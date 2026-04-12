'use client';

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { products, Product } from "@/data/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Take first 6 products to feature
const featuredProducts = products.slice(0, 6);

function ProductCard({ product, index, inView }: { product: Product; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="group relative overflow-hidden rounded-2xl border border-[rgba(193,163,106,0.12)] shadow-[0_2px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[rgba(193,163,106,0.45)] hover:shadow-[0_0_30px_rgba(193,163,106,0.15),_0_8px_32px_rgba(0,0,0,0.4)]"
      style={{
        background: "rgba(26,26,26,0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
        <Link href={`/products/${product.slug}`}>

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
           <div className="flex items-center gap-2 rounded-xl text-xs font-medium text-[rgba(245,245,245,0.5)] transition-all duration-200 group-hover:text-[#C1A36A]">
            View
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
      </Link>

    </motion.div>
  );
}

export default function ProductPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="shop-preview"
      ref={ref}
      className="relative py-24 px-6 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #0D0D0D 0%, rgba(27,48,34,0.08) 50%, #0D0D0D 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span
            className="mb-4 block text-xs font-light uppercase tracking-[0.4em]"
            style={{ color: "rgba(193,163,106,0.6)" }}
          >
            Featured Products
          </span>
          <h2
            className="mb-4 font-[family-name:var(--font-playfair)] font-bold"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F5F5F5" }}
          >
            Fresh Every Day
          </h2>
          <p
            className="mx-auto max-w-xl text-base font-light"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            From local produce to everyday essentials — everything you need,
            right in your neighborhood.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} inView={inView} />
          ))}
        </div>

        {/* See All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/shop"
            className="inline-block rounded-2xl border border-[rgba(193,163,106,0.25)] bg-[rgba(193,163,106,0.06)] px-10 py-4 text-sm font-medium tracking-wider text-[#C1A36A] transition-all duration-300 hover:bg-[rgba(193,163,106,0.12)] hover:shadow-[0_0_20px_rgba(193,163,106,0.2)]"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
