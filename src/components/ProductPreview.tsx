"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";

const products = [
  {
    name: "Teff Grain",
    category: "Grains & Seeds",
    price: "$4.99",
    emoji: "🌾",
    badge: "Organic",
    bg: "rgba(27,48,34,0.4)",
  },
  {
    name: "Fresh Fruit Mix",
    category: "Produce",
    price: "$6.99",
    emoji: "🍎",
    badge: "Daily Fresh",
    bg: "rgba(212,175,55,0.06)",
  },
  {
    name: "Premium Snacks",
    category: "Snacks",
    price: "$3.49",
    emoji: "🍿",
    badge: "Popular",
    bg: "rgba(212,175,55,0.06)",
  },
  {
    name: "Craft Beverages",
    category: "Drinks",
    price: "$2.99",
    emoji: "🧃",
    badge: "Cold",
    bg: "rgba(27,48,34,0.4)",
  },
  {
    name: "Household Bundle",
    category: "Essentials",
    price: "$12.99",
    emoji: "🧴",
    badge: "Bundle",
    bg: "rgba(212,175,55,0.06)",
  },
  {
    name: "Artisan Bread",
    category: "Bakery",
    price: "$3.99",
    emoji: "🍞",
    badge: "Baked Today",
    bg: "rgba(27,48,34,0.4)",
  },
];

function ProductCard({ product, index, inView }: { product: typeof products[0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(26,26,26,0.8)",
        border: hovered ? "1px solid rgba(212,175,55,0.45)" : "1px solid rgba(212,175,55,0.12)",
        boxShadow: hovered ? "0 0 30px rgba(212,175,55,0.15), 0 8px 32px rgba(0,0,0,0.4)" : "0 2px 16px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product image area */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: product.bg }}
      >
        <motion.span
          className="text-6xl select-none"
          animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.35, ease: "backOut" }}
        >
          {product.emoji}
        </motion.span>

        {/* Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium tracking-wider"
          style={{
            background: "rgba(212,175,55,0.15)",
            color: "#D4AF37",
            border: "1px solid rgba(212,175,55,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          {product.badge}
        </span>

        {/* Quick view overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: "rgba(13,13,13,0.6)", backdropFilter: "blur(4px)" }}
        >
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: "rgba(212,175,55,0.15)",
              color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            <Eye size={14} />
            Quick View
          </button>
        </motion.div>
      </div>

      {/* Product info */}
      <div className="p-5">
        <p
          className="text-xs tracking-[0.25em] uppercase mb-1 font-light"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          {product.category}
        </p>
        <h3
          className="font-[family-name:var(--font-playfair)] font-semibold text-lg mb-3"
          style={{ color: "#F5F5F5" }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span
            className="font-bold text-xl"
            style={{ color: "#D4AF37" }}
          >
            {product.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: hovered ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
              color: hovered ? "#D4AF37" : "rgba(245,245,245,0.5)",
              border: `1px solid ${hovered ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <ShoppingBag size={13} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="shop"
      ref={ref}
      className="relative py-24 md:py-32 px-6"
      style={{
        background:
          "linear-gradient(180deg, #0D0D0D 0%, rgba(27,48,34,0.08) 50%, #0D0D0D 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="text-xs tracking-[0.4em] uppercase font-light mb-4 block"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Featured Products
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F5F5F5" }}
          >
            Fresh Every Day
          </h2>
          <p
            className="max-w-xl mx-auto text-base font-light"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            From local produce to everyday essentials — everything you need,
            right in your neighborhood.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} inView={inView} />
          ))}
        </div>

        {/* See All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <button
            className="px-10 py-4 rounded-2xl text-sm font-medium tracking-wider uppercase transition-all duration-300"
            style={{
              background: "rgba(212,175,55,0.06)",
              color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(212,175,55,0.12)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 20px rgba(212,175,55,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(212,175,55,0.06)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}
