'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';
import { Search, X } from 'lucide-react';

// Get unique categories for filtering
const categories = [
  'All',
  ...Array.from(new Set(products.map((p) => p.category))),
];

// Price ranges for filtering
const priceRanges = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under $5', min: 0, max: 5 },
  { label: '$5 - $10', min: 5, max: 10 },
  { label: 'Over $10', min: 10, max: Infinity },
];

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState(priceRanges[0]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory === 'All') return true;
        return p.category === activeCategory;
      })
      .filter((p) => {
        // Price filter
        const price = parseFloat(p.price.substring(1));
        return price >= activePriceRange.min && price < activePriceRange.max;
      })
      .filter((p) => {
        // Search term filter
        if (searchTerm === '') return true;
        return p.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [searchTerm, activeCategory, activePriceRange]);

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div className="px-6 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span
            className="block text-xs font-light uppercase tracking-[0.4em]"
            style={{ color: 'rgba(212,175,55,0.6)' }}
          >
            Our Collection
          </span>
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#F5F5F5' }}
          >
            Shop Essentials
          </h1>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="mx-auto mb-12 max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[rgba(26,26,26,0.7)] p-6 backdrop-blur-sm md:grid-cols-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[rgba(245,245,245,0.3)]"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-full w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none focus:ring-1 focus:ring-[rgba(212,175,55,0.5)]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute top-1/2 right-4 -translate-y-1/2">
                <X size={16} className="text-[rgba(245,245,245,0.3)]" />
              </button>
            )}
          </div>

          {/* Category & Price Filters */}
          <div className="flex flex-wrap gap-x-4 gap-y-3 md:col-span-2 md:justify-end">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-light text-[rgba(245,245,245,0.4)]">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors duration-200 ${activeCategory === cat ? 'bg-[rgba(212,175,55,0.25)] text-[#D4AF37]' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(245,245,245,0.5)] hover:bg-[rgba(255,255,255,0.1)]'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Pills */}
            <div className="flex flex-wrap items-center gap-2">
               <span className="mr-2 text-xs font-light text-[rgba(245,245,245,0.4)]">Price:</span>
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setActivePriceRange(range)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors duration-200 ${activePriceRange.label === range.label ? 'bg-[rgba(212,175,55,0.25)] text-[#D4AF37]' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(245,245,245,0.5)] hover:bg-[rgba(255,255,255,0.1)]'}`}>
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
