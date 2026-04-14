'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { user } = useAuth();

  // ── Firestore sync ──────────────────────────────────────────────────────────
  // When a user logs in, load their saved cart from Firestore and listen for
  // real-time updates. Also fetch their order history.
  useEffect(() => {
    let unsubscribeCart: Unsubscribe | undefined;
    let unsubscribeOrders: Unsubscribe | undefined;

    if (user) {
      // Sync Cart
      const cartRef = doc(db, 'carts', user.uid);
      unsubscribeCart = onSnapshot(cartRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setCartItems(Array.isArray(data.items) ? data.items : []);
        } else {
          setCartItems([]);
        }
      });

      // Sync Order History (Real-time)
      // Note: In a production app, you might want to use a collection for orders
      // instead of a single document if the history gets too large.
      const ordersRef = doc(db, 'orders', user.uid);
      setOrdersLoading(true);
      unsubscribeOrders = onSnapshot(ordersRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setOrders(Array.isArray(data.history) ? data.history : []);
        } else {
          setOrders([]);
        }
        setOrdersLoading(false);
      });
    } else {
      // Logged out → clear local state
      setCartItems([]);
      setOrders([]);
    }

    return () => {
      if (unsubscribeCart) unsubscribeCart();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, [user]);

  // Persist cart to Firestore (helper)
  const persistCart = async (items: CartItem[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'carts', user.uid), { items }, { merge: true });
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  };

  // ── Cart operations ─────────────────────────────────────────────────────────
  const addToCart = (product: Product, quantity: number) => {
    const existing = cartItems.find((i) => i.slug === product.slug);
    let next: CartItem[];
    
    if (existing) {
      next = cartItems.map((i) =>
        i.slug === product.slug
          ? { ...i, quantity: i.quantity + quantity }
          : i,
      );
    } else {
      next = [...cartItems, { ...product, quantity }];
    }
    
    setCartItems(next);
    persistCart(next);
  };

  const removeFromCart = (slug: string) => {
    const next = cartItems.filter((i) => i.slug !== slug);
    setCartItems(next);
    persistCart(next);
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
    } else {
      const next = cartItems.map((i) =>
        i.slug === slug ? { ...i, quantity } : i,
      );
      setCartItems(next);
      persistCart(next);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), { items: [] });
      } catch (err) {
        console.error('Failed to clear cart in Firestore:', err);
      }
    }
  };

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) return;

    const newOrder = {
      id: `ord_${Date.now()}`,
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + price * item.quantity;
      }, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Add to order history
      const ordersRef = doc(db, 'orders', user.uid);
      await setDoc(ordersRef, {
        history: [newOrder, ...orders]
      }, { merge: true });

      // Clear the cart
      await clearCart();
      return true;
    } catch (err) {
      console.error('Failed to place order:', err);
      throw err;
    }
  };

  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        ordersLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
