'use client';

import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';

function ProductCard({ product }: { product: Product }) {
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) 
    : 5;

  return (
    <Link href={`/products/${product.slug}`} passHref>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-[rgba(193,163,106,0.12)] shadow-[0_2px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[rgba(193,163,106,0.45)] hover:shadow-[0_0_30px_rgba(193,163,106,0.15),_0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col"
        style={{
          background: "rgba(26,26,26,0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Product image area */}
        <div
          className="relative flex h-56 items-center justify-center overflow-hidden"
          style={{ background: product.bg || 'rgba(193,163,106,0.1)' }}
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <span
              className="select-none text-8xl font-[family-name:var(--font-playfair)] italic font-light opacity-60 text-[#C1A36A] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-100"
            >
              {product.name.charAt(0)}
            </span>
          )}

          {/* Badge */}
          {product.badge && (
            <span
              className="absolute left-4 top-4 rounded-full border border-[rgba(193,163,106,0.3)] bg-[rgba(193,163,106,0.15)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C1A36A]"
              style={{ backdropFilter: "blur(8px)" }}
            >
              {product.badge}
            </span>
          )}

          {/* Quick view overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-3 bg-[rgba(13,13,13,0.4)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div
              className="flex items-center gap-2 rounded-xl border border-[rgba(193,163,106,0.5)] bg-black/60 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#C1A36A] transition-all duration-300"
            >
              <Eye size={16} />
              Details
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "rgba(193,163,106,0.5)" }}
            >
              {product.category}
            </p>
            <div className="flex items-center gap-0.5">
               {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className={i < averageRating ? 'text-[#C1A36A]' : 'text-white/10'} fill="currentColor" />
               ))}
            </div>
          </div>
          
          <h3
            className="mb-4 font-[family-name:var(--font-playfair)] text-xl font-semibold leading-tight flex-1"
            style={{ color: "#F5F5F5" }}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <span
              className="text-2xl font-bold"
              style={{ color: "#C1A36A" }}
            >
              {product.price}
            </span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border border-[rgba(193,163,106,0.3)] bg-[rgba(193,163,106,0.1)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#C1A36A] transition-all duration-300 group-hover:bg-[#C1A36A] group-hover:text-black"
            >
              <ShoppingBag size={14} />
              Buy
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
       {products.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div layout className="py-20 text-center glass-strong rounded-3xl border border-white/5">
            <p className="text-white/40 font-light italic">No products matched your refined selection.</p>
        </motion.div>
      )}
    </div>
  );
}
