'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/#shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const products = [
    {
      category: "Ethiopian Products",
      items: [
        { name: "Teff", href: "/products/teff" },
        { name: "Enjera", href: "/products/enjera" },
        { name: "Butter", href: "/products/butter" },
        { name: "Honey", href: "/products/honey" },
        { name: "Jewelries", href: "/products/jewelries" },
        { name: "Divine Pictures", href: "/products/divine-pictures" },
      ],
    },
    {
      category: "American Products",
      items: [
        { name: "Shampoo", href: "/products/shampoo" },
        { name: "Conditioner", href: "/products/conditioner" },
      ],
    },
];

interface NavbarProps {
  logoVisible?: boolean;
}

export default function Navbar({ logoVisible = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className={`mx-4 mt-3 rounded-2xl transition-all duration-500 ${
            scrolled ? 'glass-strong shadow-lg' : 'glass'
          }`}
          style={{
            borderColor: scrolled
              ? 'rgba(212,175,55,0.25)'
              : 'rgba(212,175,55,0.12)',
          }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <AnimatePresence>
              {logoVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'backOut' }}
                >
                  <Link href="/" className="group flex items-center gap-2">
                    <span
                      className="font-[family-name:var(--font-playfair)] font-bold text-2xl tracking-wider"
                      style={{
                        color: '#D4AF37',
                        textShadow: '0 0 20px rgba(212,175,55,0.5)',
                      }}
                    >
                      HERAN
                    </span>
                    <span
                      className="text-xs tracking-[0.25em] uppercase font-light hidden sm:block"
                      style={{ color: 'rgba(212,175,55,0.6)' }}
                    >
                      Mart
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href.replace('/#', '/'));
                
                if (link.label === 'Shop') {
                  return (
                    <div 
                      className="relative"
                      onMouseEnter={() => setShopMenuOpen(true)}
                      onMouseLeave={() => setShopMenuOpen(false)}
                    >
                      <button
                        className="relative flex items-center gap-1 text-sm tracking-wider uppercase font-light transition-colors duration-200 group"
                        style={{
                          color: isActive ? '#D4AF37' : 'rgba(245,245,245,0.7)',
                        }}
                      >
                        {link.label}
                        <ChevronDown size={16} />
                        <span
                          className="absolute -bottom-1 left-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full"
                          style={{ width: isActive ? '100%' : '0%' }}
                        />
                      </button>
                      <AnimatePresence>
                        {shopMenuOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-black ring-1 ring-white ring-opacity-5 focus:outline-none"
                          >
                            <div className="py-1">
                              {products.map((productCategory) => (
                                <div key={productCategory.category} className="px-4 py-2">
                                  <p className="text-xs uppercase font-bold text-gray-400">{productCategory.category}</p>
                                  {productCategory.items.map((item) => (
                                    <Link
                                      key={item.name}
                                      href={item.href}
                                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-sm tracking-wider uppercase font-light transition-colors duration-200 group"
                    style={{
                      color: isActive ? '#D4AF37' : 'rgba(245,245,245,0.7)',
                    }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full"
                      style={{ width: isActive ? '100%' : '0%' }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-xl transition-all duration-200 hover:bg-[rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                style={{ color: 'rgba(245,245,245,0.7)' }}
                aria-label="Profile"
              >
                <User size={18} />
              </button>
              <button
                className="p-2 rounded-xl transition-all duration-200 hover:bg-[rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                style={{ color: 'rgba(245,245,245,0.7)' }}
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
              </button>
              <Link
                href="/#contact"
                className="hidden sm:flex items-center px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                  color: '#0D0D0D',
                  boxShadow: '0 0 15px rgba(212,175,55,0.25)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 25px rgba(212,175,55,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 15px rgba(212,175,55,0.25)';
                }}
              >
                Login
              </Link>
              <button
                className="md:hidden p-2 rounded-xl"
                style={{ color: 'rgba(245,245,245,0.7)' }}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-4 mt-1 rounded-2xl glass overflow-hidden"
            >
              <div className="flex flex-col py-4 px-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm tracking-wider uppercase font-light py-2 border-b transition-colors duration-200"
                    style={{
                      color: 'rgba(245,245,245,0.7)',
                      borderColor: 'rgba(212,175,55,0.1)',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 text-center py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #B8962E)',
                    color: '#0D0D0D',
                  }}
                >
                  Login / Register
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
