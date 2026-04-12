'use client';

import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} passHref>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[rgba(193,163,106,0.12)] shadow-[0_2px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[rgba(193,163,106,0.45)] hover:shadow-[0_0_30px_rgba(193,163,106,0.15),_0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          background: "rgba(26,26,26,0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Product image area */}
        <div
          className="relative flex h-44 items-center justify-center overflow-hidden"
          style={{ background: product.bg }}
        >
          <span
            className="select-none text-7xl font-[family-name:var(--font-playfair)] italic font-light opacity-60 text-[#C1A36A] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-100"
          >
            {product.name.charAt(0)}
          </span>

          {/* Badge */}
          <span
            className="absolute left-3 top-3 rounded-full border border-[rgba(193,163,106,0.3)] bg-[rgba(193,163,106,0.15)] px-2.5 py-1 text-xs font-medium tracking-wider text-[#C1A36A]"
            style={{ backdropFilter: "blur(8px)" }}
          >
            {product.badge}
          </span>

          {/* Quick view overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-3 bg-[rgba(13,13,13,0.6)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div
              className="flex items-center gap-2 rounded-xl border border-[rgba(193,163,106,0.3)] bg-[rgba(193,163,106,0.15)] px-4 py-2 text-xs font-medium text-[#C1A36A] transition-all duration-200"
            >
              <Eye size={14} />
              Quick View
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="p-5">
          <p
            className="mb-1 text-xs font-light uppercase tracking-[0.25em]"
            style={{ color: "rgba(193,163,106,0.5)" }}
          >
            {product.category}
          </p>
          <h3
            className="mb-3 font-[family-name:var(--font-playfair)] text-lg font-semibold"
            style={{ color: "#F5F5F5" }}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <span
              className="text-xl font-bold"
              style={{ color: "#C1A36A" }}
            >
              {product.price}
            </span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[rgba(245,245,245,0.5)] transition-all duration-200 group-hover:border-[rgba(193,163,106,0.3)] group-hover:bg-[rgba(193,163,106,0.15)] group-hover:text-[#C1A36A]"
            >
              <ShoppingBag size={13} />
              Add
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
       {products.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div layout className="py-12 text-center">
            <p className="text-lg text-gray-400">No products found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
}
