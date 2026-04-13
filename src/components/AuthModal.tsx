'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Diamond, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    isLoggedIn,
    setIsLoggedIn,
    isLoginView,
    setIsLoginView,
  } = useAuth();

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsLoggedIn(false);
    setIsLoginView(true);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

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
              {!isLoggedIn ? (
                /* Auth View */
                <div>
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

                  <form onSubmit={handleAuthSubmit} className="space-y-5">
                    {!isLoginView && (
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C1A36A] mb-2 font-medium">
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C1A36A] transition-colors"
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
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C1A36A] transition-colors"
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
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#C1A36A] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-8 py-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300"
                      style={{
                        background:
                          'linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)',
                        color: '#0A0A0A',
                        boxShadow: '0 8px 30px rgba(193, 163, 106, 0.15)',
                      }}
                    >
                      {isLoginView ? 'Sign In' : 'Create Account'}
                    </button>
                  </form>

                  <div className="mt-8 text-center text-xs text-gray-500 font-light">
                    {isLoginView
                      ? "Don't have an account? "
                      : 'Already have an account? '}
                    <button
                      type="button"
                      onClick={() => setIsLoginView(!isLoginView)}
                      className="text-[#C1A36A] hover:text-white transition-colors ml-1 font-medium tracking-wide border-b border-transparent hover:border-[#C1A36A]"
                    >
                      {isLoginView ? 'Sign up' : 'Sign in'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Membership Plans View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                        <h4 className="font-medium text-white tracking-wide">
                          Silver Elite
                        </h4>
                        <span className="text-[#C1A36A] text-lg font-semibold">
                          $49
                          <span className="text-xs text-gray-500 font-light ml-1">
                            /mo
                          </span>
                        </span>
                      </div>
                      <ul className="text-sm font-light text-gray-400 space-y-3 mt-4">
                        <li className="flex items-center gap-3">
                          <Check size={14} className="text-[#C1A36A]" /> Free
                          weekend delivery
                        </li>
                        <li className="flex items-center gap-3">
                          <Check size={14} className="text-[#C1A36A]" /> 5% off
                          curated picks
                        </li>
                      </ul>
                      <button className="w-full mt-6 py-3 border border-white/20 text-white rounded-xl text-xs tracking-widest uppercase group-hover:border-[#C1A36A] group-hover:text-[#C1A36A] transition-colors">
                        Select Silver
                      </button>
                    </div>

                    {/* Gold Tier */}
                    <div className="border border-[#C1A36A] rounded-2xl p-6 bg-[#C1A36A]/5 relative overflow-hidden cursor-pointer group">
                      <div className="absolute top-0 right-7 bg-[#C1A36A] text-black text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-b-lg">
                        Most Popular
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-white tracking-wide">
                          Gold Signature
                        </h4>
                        <span className="text-[#C1A36A] text-lg font-semibold">
                          $99
                          <span className="text-xs text-black/0 md:text-gray-500 font-light ml-1">
                            /mo
                          </span>
                        </span>
                      </div>
                      <ul className="text-sm font-light text-gray-400 space-y-3 mt-4">
                        <li className="flex items-center gap-3">
                          <Check size={14} className="text-[#C1A36A]" />{' '}
                          Unlimited priority delivery
                        </li>
                        <li className="flex items-center gap-3">
                          <Check size={14} className="text-[#C1A36A]" /> 15%
                          off all items
                        </li>
                        <li className="flex items-center gap-3">
                          <Check size={14} className="text-[#C1A36A]" /> Early
                          access to events
                        </li>
                      </ul>
                      <button className="w-full mt-6 py-3 bg-[#C1A36A] text-black rounded-xl text-xs tracking-widest uppercase hover:bg-white transition-colors font-medium">
                        Select Gold
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
