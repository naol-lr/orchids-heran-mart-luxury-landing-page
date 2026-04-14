'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  MapPin, 
  Mail, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

type Tab = 'history' | 'settings';

export default function ProfilePage() {
  const { user, userData, isLoggedIn, loading, updateUserData, setIsModalOpen } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('history');
  
  // Settings Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
    }
  }, [userData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserData({
        name,
        phone,
        address,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C1A36A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Profile Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span className="block text-xs font-light uppercase tracking-[0.4em] text-[#C1A36A] mb-3">
                Member Profile
              </span>
              <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-medium">
                Welcome, {userData?.name || user?.displayName || 'Member'}
              </h1>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'history' 
                  ? 'bg-[#C1A36A] text-black shadow-lg shadow-[#C1A36A]/20' 
                  : 'text-white/60 hover:text-white'
                }`}
              >
                <Clock size={16} />
                Order History
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'settings' 
                  ? 'bg-[#C1A36A] text-black shadow-lg shadow-[#C1A36A]/20' 
                  : 'text-white/60 hover:text-white'
                }`}
              >
                <Settings size={16} />
                Settings
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="glass-strong rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C1A36A] to-[#8E7A53] flex items-center justify-center text-2xl font-bold text-black shadow-xl">
                  {userData?.name ? userData.name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{userData?.name || user?.displayName || 'Member'}</h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase mt-1">
                    {userData?.tier === 'gold' ? 'Gold Signature' : userData?.tier === 'silver' ? 'Silver Elite' : 'Basic Member'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Mail size={16} className="text-[#C1A36A]" />
                  <span>{user?.email}</span>
                </div>
                {userData?.phone && (
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Phone size={16} className="text-[#C1A36A]" />
                    <span>{userData.phone}</span>
                  </div>
                )}
                {userData?.address && (
                  <div className="flex items-start gap-3 text-sm text-white/60">
                    <MapPin size={16} className="text-[#C1A36A] mt-0.5" />
                    <span>{userData.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-strong rounded-3xl p-8 border border-white/10 bg-[#C1A36A]/5">
              <h4 className="text-[#C1A36A] text-xs font-bold tracking-widest uppercase mb-4">Membership Perks</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 size={14} className="text-[#C1A36A]" />
                  Exclusive early access
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 size={14} className="text-[#C1A36A]" />
                  Member-only pricing
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 size={14} className="text-[#C1A36A]" />
                  Priority concierge support
                </li>
              </ul>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 py-3 border border-[#C1A36A]/30 text-[#C1A36A] rounded-xl text-xs tracking-widest uppercase hover:bg-[#C1A36A] hover:text-black transition-all duration-300"
              >
                Change Plan
              </button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'history' ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-[family-name:var(--font-playfair)]">Recent Orders</h2>
                  </div>

                  {/* Placeholder for Order History */}
                  <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={24} className="text-white/20" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">
                        Your luxury collection starts here. Explore our curated selection and find your first piece.
                      </p>
                      <button 
                        onClick={() => router.push('/shop')}
                        className="px-8 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#C1A36A] transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-[family-name:var(--font-playfair)]">Account Settings</h2>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="glass-strong rounded-3xl p-8 border border-white/10 space-y-8">
                    {/* Status Messages */}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <CheckCircle2 size={18} />
                        Profile updated successfully
                      </motion.div>
                    )}
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <AlertCircle size={18} />
                        {error}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] font-medium ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] font-medium ml-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50 transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] font-medium ml-1">
                        Shipping Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C1A36A]/50 transition-colors resize-none"
                        placeholder="State, City, Street, Apartment..."
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full md:w-auto px-10 py-4 bg-[#C1A36A] text-black rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {updating ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
