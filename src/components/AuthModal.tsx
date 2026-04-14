'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Diamond, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    isLoggedIn,
    isLoginView,
    setIsLoginView,
    login,
    signup,
    loginWithGoogle,
    updateTier,
    authError,
    setAuthError,
  } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tierLoading, setTierLoading] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    setIsLoginView(true);
    setAuthError(null);
    setShowPlans(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      // On success, redirect to shop
      handleClose();
      router.push('/shop');
    } catch {
      // Error is already set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      handleClose();
      router.push('/shop');
    } catch {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelect = async (tier: string) => {
    setTierLoading(tier);
    try {
      await updateTier(tier);
      handleClose();
    } catch {
      // Error handled in console
    } finally {
      setTierLoading(null);
    }
  };


  // When already logged in and modal opens, show plans
  const viewingPlans = showPlans || (isLoggedIn && isModalOpen);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl z-10"
            style={{
              background: 'rgba(15, 15, 15, 0.95)',
              border: '1px solid rgba(193, 163, 106, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-10">
              <AnimatePresence mode="wait">
                {!viewingPlans ? (
                  /* ── Auth Form ── */
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-center mb-10">
                      <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#F0F0F0] mb-3">
                        {isLoginView ? 'Welcome Back' : 'Join The Society'}
                      </h3>
                      <p className="text-sm font-light text-gray-400">
                        {isLoginView
                          ? 'Sign in to access your exclusive benefits'
                          : 'Create an account to unlock member privileges'}
                      </p>
                    </div>

                    {/* Error Banner */}
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20"
                      >
                        <AlertCircle size={16} className="shrink-0" />
                        {authError}
                      </motion.div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="space-y-5">
                      {!isLoginView && (
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] mb-2 font-medium">
                            Full Name
                          </label>
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C1A36A] transition-colors placeholder-gray-600"
                            placeholder="Jane Doe"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] mb-2 font-medium">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C1A36A] transition-colors placeholder-gray-600"
                          placeholder="jane@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] mb-2 font-medium">
                          Password
                        </label>
                        <input
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C1A36A] transition-colors placeholder-gray-600"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 py-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                        style={{
                          background: 'linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)',
                          color: '#0A0A0A',
                          boxShadow: '0 8px 30px rgba(193, 163, 106, 0.15)',
                        }}
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : isLoginView ? (
                          'Sign In'
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-xs text-gray-600 tracking-widest uppercase">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google Sign-In */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl border border-white/10 hover:border-[#C1A36A]/50 transition-all duration-200 text-sm text-white/80 hover:text-white flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>

                    <div className="mt-6 text-center text-xs text-gray-500 font-light">
                      {isLoginView ? "Don't have an account? " : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => { setIsLoginView(!isLoginView); setAuthError(null); }}
                        className="text-[#C1A36A] hover:text-white transition-colors ml-1 font-medium tracking-wide border-b border-transparent hover:border-[#C1A36A]"
                      >
                        {isLoginView ? 'Sign up' : 'Sign in'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Membership Plans ── */
                  <motion.div
                    key="plans"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-[#C1A36A]/10 border border-[#C1A36A]/30">
                        <Diamond size={24} className="text-[#C1A36A]" />
                      </div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#F0F0F0] mb-2">
                        Select Your Tier
                      </h3>
                      <p className="text-sm font-light text-gray-400">
                        Choose a membership plan to elevate your Heran experience
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Silver Tier */}
                      <div className="border border-white/10 rounded-2xl p-6 hover:border-[#C1A36A]/50 transition-colors cursor-pointer group bg-black/40">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-white tracking-wide">Silver Elite</h4>
                          <span className="text-[#C1A36A] text-lg font-semibold">
                            $49<span className="text-xs text-gray-500 font-light ml-1">/mo</span>
                          </span>
                        </div>
                        <ul className="text-sm font-light text-gray-400 space-y-3 mt-4">
                          <li className="flex items-center gap-3"><Check size={14} className="text-[#C1A36A]" /> Free weekend delivery</li>
                          <li className="flex items-center gap-3"><Check size={14} className="text-[#C1A36A]" /> 5% off curated picks</li>
                        </ul>
                        <button 
                          onClick={() => handleTierSelect('silver')}
                          disabled={!!tierLoading}
                          className="w-full mt-6 py-3 border border-white/20 text-white rounded-xl text-xs tracking-widest uppercase group-hover:border-[#C1A36A] group-hover:text-[#C1A36A] transition-colors flex items-center justify-center gap-2"
                        >
                          {tierLoading === 'silver' ? <Loader2 size={14} className="animate-spin" /> : 'Select Silver'}
                        </button>
                      </div>

                      {/* Gold Tier */}
                      <div className="border border-[#C1A36A] rounded-2xl p-6 bg-[#C1A36A]/5 relative overflow-hidden cursor-pointer group">
                        <div className="absolute top-0 right-7 bg-[#C1A36A] text-black text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-b-lg">
                          Most Popular
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-white tracking-wide">Gold Signature</h4>
                          <span className="text-[#C1A36A] text-lg font-semibold">
                            $99<span className="text-xs text-gray-500 font-light ml-1">/mo</span>
                          </span>
                        </div>
                        <ul className="text-sm font-light text-gray-400 space-y-3 mt-4">
                          <li className="flex items-center gap-3"><Check size={14} className="text-[#C1A36A]" /> Unlimited priority delivery</li>
                          <li className="flex items-center gap-3"><Check size={14} className="text-[#C1A36A]" /> 15% off all items</li>
                          <li className="flex items-center gap-3"><Check size={14} className="text-[#C1A36A]" /> Early access to events</li>
                        </ul>
                        <button 
                          onClick={() => handleTierSelect('gold')}
                          disabled={!!tierLoading}
                          className="w-full mt-6 py-3 bg-[#C1A36A] text-black rounded-xl text-xs tracking-widest uppercase hover:bg-white transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          {tierLoading === 'gold' ? <Loader2 size={14} className="animate-spin" /> : 'Select Gold'}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full mt-6 text-center text-xs text-gray-600 hover:text-gray-400 transition-colors tracking-wide"
                    >
                      Maybe later
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
