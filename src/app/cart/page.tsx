'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle, PackageCheck } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  }

  if (orderPlaced) {
    return (
        <div style={{ background: '#0D0D0D', minHeight: '100vh' }}>
            <Navbar />
            <div className="mx-auto max-w-2xl px-6 pt-32 pb-16 text-center">
                <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.5}}>
                    <PackageCheck size={64} className="mx-auto text-green-500" />
                    <h1 className="mt-6 font-[family-name:var(--font-playfair)] text-4xl font-bold text-white">
                        Order Sent!
                    </h1>
                    <p className="mt-4 text-lg text-[rgba(245,245,245,0.6)]">
                        Your order has been sent to the store. We'll have it ready for you.
                    </p>
                    <p className="mt-2 text-sm text-[rgba(245,245,245,0.4)]">
                        Please pay at the counter when you pick up your items.
                    </p>
                    <Link href="/shop">
                        <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         className="mt-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-3 font-medium text-white shadow-[0_4px_20px_rgba(74,222,128,0.3)]">
                            Continue Shopping
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
  }

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh' }}>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-baseline justify-between">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-white">Your Cart</h1>
            <Link href="/shop" className="text-sm text-[rgba(193,163,106,0.6)] hover:text-[#C1A36A]">
              &larr; Back to Shop
            </Link>
          </div>

          <AnimatePresence>
            {cartItems.length > 0 ? (
              <div className="mt-8">
                <ul className="space-y-4">
                  {cartItems.map(item => (
                    <motion.li 
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between gap-6 rounded-2xl border border-[rgba(193,163,106,0.15)] bg-[rgba(26,26,26,0.5)] p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg" style={{background: item.bg}}>
                            <span className="text-3xl font-[family-name:var(--font-playfair)] italic font-light opacity-80 text-[#C1A36A]">{item.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-[rgba(245,245,245,0.4)]">{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center rounded-lg border border-[rgba(193,163,106,0.2)]">
                          <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="p-2 text-[rgba(245,245,245,0.5)] transition-colors hover:text-white"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="p-2 text-[rgba(245,245,245,0.5)] transition-colors hover:text-white"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.slug)} className="text-[rgba(245,245,245,0.4)] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-[rgba(193,163,106,0.15)] bg-[rgba(26,26,26,0.5)] p-6">
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-medium text-[rgba(245,245,245,0.6)]">Subtotal</span>
                        <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <p className="mt-2 text-xs text-center text-[rgba(245,245,245,0.4)]">Final price will be confirmed at the store.</p>
                    <motion.button
                        onClick={handlePlaceOrder}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-base font-medium uppercase tracking-wider"
                        style={{
                            background: 'linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)',
                            color: '#0D0D0D',
                            boxShadow: '0 4px 20px rgba(193,163,106,0.3)',
                        }}
                    >
                        <CheckCircle size={18} />
                        Prepare for Pickup
                    </motion.button>
                </div>
              </div>
            ) : (
              <motion.div layout initial={{opacity:0}} animate={{opacity:1}} className="py-16 text-center border-t border-[rgba(193,163,106,0.1)] mt-8">
                <ShoppingBag size={48} className="mx-auto text-[rgba(245,245,245,0.3)]" />
                <h2 className="mt-6 text-xl font-semibold text-white">Your cart is empty.</h2>
                <p className="mt-2 text-[rgba(245,245,245,0.5)]">Looks like you haven't added anything to your cart yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
