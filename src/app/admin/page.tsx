'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  ShoppingBag, 
  PlusCircle, 
  Loader2, 
  Package, 
  CheckCircle, 
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { 
  collection, 
  getDocs, 
  orderBy, 
  query, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { seedProducts } from '@/lib/firebase/seed';
import { Product } from '@/data/products';

type AdminTab = 'orders' | 'products' | 'users';

interface ProductReview {
  rating: number;
  text: string;
  author: string;
}

interface Order {
  id: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  createdAt: Date;
  items?: Array<{ name: string; quantity: number }>;
}

export default function AdminDashboard() {
  const { userData, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    slug: '',
    emoji: '🏷️',
    bg: 'rgba(193,163,106,0.1)',
    badge: 'New',
    details: ['Premium quality', 'Sourced responsibly'],
    reviews: [] as ProductReview[]
  });
  
  const [addStatus, setAddStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Review State
  const [isAddingReview, setIsAddingReview] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<ProductReview>({
    rating: 5,
    text: '',
    author: ''
  });

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/');
      } else if (userData && !userData.isAdmin) {
        // Only allow admins
        router.push('/');
      }
    }
  }, [isLoggedIn, loading, userData, router]);

  useEffect(() => {
    if (isLoggedIn && userData?.isAdmin && db) {
      fetchData();
    }
  }, [isLoggedIn, userData]);

  const fetchData = async () => {
    if (!db) return;
    try {
      // Fetch Orders
      const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      setOrders(ordersSnap.docs.map(d => {
        const data = d.data();
        return { 
          id: d.id, 
          ...data, 
          createdAt: (data as { createdAt?: { toDate: () => Date } }).createdAt?.toDate() || new Date() 
        } as Order;
      }));
      
      // Fetch Products
      const productsSnap = await getDocs(collection(db, 'products'));
      setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id || null);
    setNewProduct({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      description: product.description || '',
      image: product.image || '',
      slug: product.slug || '',
      emoji: product.emoji || '🏷️',
      bg: product.bg || 'rgba(193,163,106,0.1)',
      badge: product.badge || 'New',
      details: product.details || ['Premium quality', 'Sourced responsibly'],
      reviews: product.reviews || []
    });
    setIsAddingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus('saving');
    try {
      const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const productData = { 
        ...newProduct, 
        slug, 
        updatedAt: serverTimestamp(),
        ...(editingProductId ? {} : { createdAt: serverTimestamp() })
      };
      
      const { doc, setDoc, updateDoc } = await import('firebase/firestore');
      
      if (editingProductId) {
        await updateDoc(doc(db, 'products', editingProductId), productData);
      } else {
        await setDoc(doc(db, 'products', slug), productData);
      }
      
      setAddStatus('success');
      setTimeout(() => {
        setIsAddingProduct(false);
        setEditingProductId(null);
        setAddStatus('idle');
      }, 1500);
      
      setNewProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        slug: '',
        emoji: '🏷️',
        bg: 'rgba(193,163,106,0.1)',
        badge: 'New',
        details: ['Premium quality', 'Sourced responsibly'],
        reviews: []
      });
      fetchData();
    } catch (err) {
      console.error('Failed to save product:', err);
      setAddStatus('error');
    }
  };

  const handleAddReview = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const updatedReviews = [...(product.reviews || []), newReview];
      await updateDoc(doc(db, 'products', productId), {
        reviews: updatedReviews
      });

      setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: updatedReviews } : p));
      setIsAddingReview(null);
      setNewReview({ rating: 5, text: '', author: '' });
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  if (loading || !isLoggedIn || !userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C1A36A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="block text-xs font-light uppercase tracking-[0.4em] text-[#C1A36A] mb-3">
              Control Panel
            </span>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-medium">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'orders' 
                ? 'bg-[#C1A36A] text-black' 
                : 'text-white/60 hover:text-white'
              }`}
            >
              <Package size={16} />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'products' 
                ? 'bg-[#C1A36A] text-black' 
                : 'text-white/60 hover:text-white'
              }`}
            >
              <ShoppingBag size={16} />
              Products
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="glass-strong p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-[#C1A36A]/10 rounded-2xl flex items-center justify-center text-[#C1A36A]">
                    <TrendingUp size={24} />
                 </div>
                 <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">+12%</span>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold">${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</h3>
           </div>
           
           <div className="glass-strong p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <Package size={24} />
                 </div>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Active Orders</p>
              <h3 className="text-3xl font-bold">{orders.filter(o => o.status !== 'completed').length}</h3>
           </div>

           <div className="glass-strong p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                    <ShoppingBag size={24} />
                 </div>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Products</p>
              <h3 className="text-3xl font-bold">{products.length}</h3>
           </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-[family-name:var(--font-playfair)] mb-6">Master Order List</h2>
              
              <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Order</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Items</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Customer</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {orders.map(order => (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                             <td className="px-6 py-6">
                                <p className="font-bold text-sm mb-1">#{order.id.slice(-6).toUpperCase()}</p>
                                <p className="text-[10px] text-white/40">{order.createdAt.toLocaleDateString()}</p>
                             </td>
                             <td className="px-6 py-6">
                                {order.items && order.items.length > 0 ? (
                                   <div className="flex flex-col gap-1">
                                      {order.items.map((item, i) => (
                                         <span key={i} className="text-xs text-white/70">
                                            {item.quantity}x {item.name}
                                         </span>
                                      ))}
                                   </div>
                                ) : (
                                   <span className="text-xs text-white/30 italic">No items</span>
                                )}
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-sm font-medium">{order.userName}</p>
                                <p className="text-xs text-white/40">{order.userEmail}</p>
                             </td>
                             <td className="px-6 py-6 font-bold text-[#C1A36A]">
                                ${order.total.toFixed(2)}
                             </td>
                             <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                   order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                   order.status === 'pending' ? 'bg-[#C1A36A]/10 text-[#C1A36A]' : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                   {order.status}
                                </span>
                             </td>
                             <td className="px-6 py-6">
                                <div className="flex gap-2">
                                   {order.status !== 'completed' && (
                                      <button 
                                        onClick={() => updateOrderStatus(order.id, 'completed')}
                                        className="p-2 hover:bg-green-500/10 text-white/40 hover:text-green-500 rounded-lg transition-colors"
                                      >
                                         <CheckCircle size={18} />
                                      </button>
                                   )}
                                   {order.status === 'pending' && (
                                      <button 
                                        onClick={() => updateOrderStatus(order.id, 'processing')}
                                        className="p-2 hover:bg-blue-500/10 text-white/40 hover:text-blue-400 rounded-lg transition-colors"
                                      >
                                         <Loader2 size={18} />
                                      </button>
                                   )}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {orders.length === 0 && (
                    <div className="p-20 text-center">
                       <p className="text-white/40">No orders found.</p>
                    </div>
                 )}
              </div>
            </motion.div>
          ) : (
            <motion.div
               key="products"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-6"
            >
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-[family-name:var(--font-playfair)]">Inventory Management</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={async () => {
                        await seedProducts();
                        fetchData();
                      }}
                      className="px-6 py-3 border border-white/10 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-all duration-300"
                    >
                      Seed Initial Data
                    </button>
                    <button 
                      onClick={() => setIsAddingProduct(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#C1A36A] text-black rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-white transition-all duration-300"
                    >
                      <PlusCircle size={18} />
                      Add Product
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                     <div key={product.id} className="glass-strong p-6 rounded-3xl border border-white/10 hover:border-[#C1A36A]/30 transition-colors flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl overflow-hidden">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                product.emoji || '🏷️'
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold truncate">{product.name}</h4>
                              <p className="text-xs text-white/40">{product.category}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-[#C1A36A]">{product.price}</p>
                           </div>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 mb-4 leading-relaxed">
                           {product.description}
                        </p>

                        {/* Reviews summary */}
                        <div className="mb-4">
                           <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex justify-between">
                              Reviews ({product.reviews?.length || 0})
                              <button 
                                onClick={() => setIsAddingReview(product.id)}
                                className="text-[#C1A36A] hover:underline"
                              >
                                + Add Review
                              </button>
                           </p>
                           {product.reviews && product.reviews.length > 0 ? (
                              <div className="space-y-2">
                                 {product.reviews.slice(-2).map((r: ProductReview, idx: number) => (
                                    <div key={idx} className="text-[10px] bg-white/5 p-2 rounded-lg border border-white/5">
                                       <div className="flex justify-between font-bold mb-1">
                                          <span>{r.author}</span>
                                          <span className="text-[#C1A36A]">{'★'.repeat(r.rating)}</span>
                                       </div>
                                       <p className="text-white/40 italic truncate">&quot;{r.text}&quot;</p>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <p className="text-[10px] text-white/20 italic">No reviews yet.</p>
                           )}
                        </div>

                        <div className="mt-auto flex items-center justify-between py-4 border-t border-white/5 gap-2">
                           <button 
                             onClick={() => deleteProduct(product.id)}
                             className="text-[10px] text-red-500/60 hover:text-red-500 font-bold uppercase tracking-widest px-2 py-1"
                           >
                             Delete
                           </button>
                           <button 
                             onClick={() => handleEditProduct(product)}
                             className="text-xs text-[#C1A36A] hover:bg-[#C1A36A]/10 px-4 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors"
                           >
                             Edit Details
                           </button>
                        </div>

                        {/* Inline Review Form */}
                        <AnimatePresence>
                           {isAddingReview === product.id && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                 <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                    <input 
                                       type="text" 
                                       placeholder="Reviewer Name"
                                       value={newReview.author}
                                       onChange={e => setNewReview({...newReview, author: e.target.value})}
                                       className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C1A36A]/50"
                                    />
                                    <textarea 
                                       placeholder="Review Text"
                                       value={newReview.text}
                                       onChange={e => setNewReview({...newReview, text: e.target.value})}
                                       className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C1A36A]/50 resize-none"
                                       rows={2}
                                    />
                                    <div className="flex justify-between items-center">
                                       <div className="flex gap-1">
                                          {[1,2,3,4,5].map(star => (
                                             <button 
                                                key={star}
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className={`text-xs ${newReview.rating >= star ? 'text-[#C1A36A]' : 'text-white/20'}`}
                                             >
                                                ★
                                             </button>
                                          ))}
                                       </div>
                                       <div className="flex gap-2">
                                          <button 
                                             onClick={() => setIsAddingReview(null)}
                                             className="text-[10px] text-white/40 font-bold uppercase"
                                          >
                                             Cancel
                                          </button>
                                          <button 
                                             onClick={() => handleAddReview(product.id)}
                                             className="text-[10px] bg-[#C1A36A] text-black px-3 py-1 rounded-lg font-bold uppercase"
                                          >
                                             Save
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
         {isAddingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProductId(null);
                 }}
                 className="absolute inset-0 bg-black/80 backdrop-blur-md"
               />
               <motion.div
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl glass-strong border border-white/10 rounded-[32px] p-8 md:p-12 max-h-[90vh] overflow-y-auto"
               >
                  <h2 className="text-3xl font-[family-name:var(--font-playfair)] mb-8">
                     {editingProductId ? 'Edit Product' : 'Add New Piece'}
                  </h2>
                  <form onSubmit={handleSaveProduct} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Product Name</label>
                           <input 
                             required
                             type="text" 
                             value={newProduct.name}
                             onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                             placeholder="Ex: Pure Teff Grain"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Category</label>
                           <input 
                              required
                              type="text" 
                              value={newProduct.category}
                              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                              placeholder="Ex: Grains"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Price</label>
                           <input 
                              required
                              type="text" 
                              value={newProduct.price}
                              onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                              placeholder="$9.99"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Icon / Emoji</label>
                           <input 
                              type="text" 
                              value={newProduct.emoji}
                              onChange={e => setNewProduct({...newProduct, emoji: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                           />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Image URL</label>
                           <div className="relative">
                              <input 
                                 type="url" 
                                 value={newProduct.image}
                                 onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                                 placeholder="https://images.unsplash.com/..."
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50 pr-12" 
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                 <ImageIcon size={18} />
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Slug (optional)</label>
                           <input 
                              type="text" 
                              value={newProduct.slug}
                              onChange={e => setNewProduct({...newProduct, slug: e.target.value})}
                              placeholder="pure-teff-grain"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Badge</label>
                           <input 
                              type="text" 
                              value={newProduct.badge}
                              onChange={e => setNewProduct({...newProduct, badge: e.target.value})}
                              placeholder="New"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Description</label>
                        <textarea 
                           required
                           rows={2}
                           value={newProduct.description}
                           onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50 resize-none" 
                           placeholder="Describe the quality and origin..."
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#C1A36A]">Extra Details (comma separated)</label>
                        <input 
                           type="text" 
                           value={newProduct.details.join(', ')}
                           onChange={e => setNewProduct({...newProduct, details: e.target.value.split(',').map(s => s.trim())})}
                           placeholder="Premium quality, Organic, Fair Trade"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50" 
                        />
                     </div>

                     <div className="flex gap-4 pt-4">
                        <button 
                           type="submit"
                           disabled={addStatus === 'saving'}
                           className={`flex-1 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xl ${
                              addStatus === 'success' ? 'bg-green-500 text-white' : 
                              addStatus === 'error' ? 'bg-red-500 text-white' :
                              'bg-[#C1A36A] text-black hover:bg-white'
                           }`}
                        >
                           {addStatus === 'saving' ? <Loader2 className="animate-spin mx-auto" size={18} /> : 
                            addStatus === 'success' ? (editingProductId ? 'Updated!' : 'Product Added!') : 
                            addStatus === 'error' ? 'Failed to Save' : (editingProductId ? 'Save Changes' : 'Publish Product')}
                        </button>
                        <button 
                           type="button"
                           onClick={() => {
                              setIsAddingProduct(false);
                              setEditingProductId(null);
                           }}
                           className="px-8 py-4 border border-white/10 rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-all duration-300"
                        >
                           Cancel
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
