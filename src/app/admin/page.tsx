'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  PlusCircle, 
  Loader2, 
  Package, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Search,
  Image as ImageIcon
} from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { 
  collection, 
  getDocs, 
  orderBy, 
  query, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { seedProducts } from '@/lib/firebase/seed';

type AdminTab = 'orders' | 'products' | 'users';

export default function AdminDashboard() {
  const { user, userData, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  
  // Data State
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    slug: '',
    emoji: '🏷️',
    bg: 'rgba(193,163,106,0.1)',
    badge: 'New',
    details: ['Premium quality', 'Sourced responsibly']
  });
  
  const [addStatus, setAddStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

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
    } else if (isLoggedIn && userData?.isAdmin && !db) {
      setLoadingData(false);
    }
  }, [isLoggedIn, userData]);

  const fetchData = async () => {
    if (!db) return;
    setLoadingData(true);
    try {
      // Fetch Orders
      const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() || new Date() })));
      
      // Fetch Products
      const productsSnap = await getDocs(collection(db, 'products'));
      setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus('saving');
    try {
      const slug = newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const productData = { ...newProduct, slug };
      
      // Use the slug as the document ID for consistency, or let Firestore generate one
      // We'll use setDoc with doc(collection, slug) to ensure slugs act as primary keys
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'products', slug), productData);
      
      setAddStatus('success');
      setTimeout(() => {
        setIsAddingProduct(false);
        setAddStatus('idle');
      }, 1500);
      
      setNewProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        slug: '',
        emoji: '🏷️',
        bg: 'rgba(193,163,106,0.1)',
        badge: 'New',
        details: ['Premium quality', 'Sourced responsibly']
      });
      fetchData();
    } catch (err) {
      console.error('Failed to add product:', err);
      setAddStatus('error');
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
                     <div key={product.id} className="glass-strong p-6 rounded-3xl border border-white/10 hover:border-[#C1A36A]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">
                              {product.emoji || '🏷️'}
                           </div>
                           <div>
                              <h4 className="font-bold">{product.name}</h4>
                              <p className="text-xs text-white/40">{product.category}</p>
                           </div>
                           <div className="ml-auto text-right">
                              <p className="font-bold text-[#C1A36A]">{product.price}</p>
                           </div>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 mb-4 leading-relaxed">
                           {product.description}
                        </p>
                        <div className="flex items-center justify-between py-4 border-t border-white/5">
                           <span className="text-[10px] text-white/40 uppercase tracking-widest">STOCK: 45 units</span>
                           <button className="text-xs text-[#C1A36A] hover:underline font-bold uppercase tracking-widest">Edit Details</button>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
         {isAddingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsAddingProduct(false)}
                 className="absolute inset-0 bg-black/80 backdrop-blur-md"
               />
               <motion.div
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl glass-strong border border-white/10 rounded-[32px] p-8 md:p-12"
               >
                  <h2 className="text-3xl font-[family-name:var(--font-playfair)] mb-8">Add New Piece</h2>
                  <form onSubmit={handleAddProduct} className="space-y-6">
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
                            addStatus === 'success' ? 'Product Added!' : 
                            addStatus === 'error' ? 'Failed to Add' : 'Publish Product'}
                        </button>
                        <button 
                           type="button"
                           onClick={() => setIsAddingProduct(false)}
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
