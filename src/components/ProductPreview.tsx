'use client';

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { products as staticProducts, Product } from "@/data/products";
import Link from "next/link";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

function ProductCard({ product, index, inView }: { product: Product; index: number; inView: boolean }) {
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) 
    : 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="group relative overflow-hidden rounded-3xl border border-[rgba(193,163,106,0.12)] shadow-[0_2px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[rgba(193,163,106,0.45)] hover:shadow-[0_0_30px_rgba(193,163,106,0.15),_0_8px_32px_rgba(0,0,0,0.4)]"
      style={{
        background: "rgba(26,26,26,0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
        <Link href={`/products/${product.slug}`} className="block h-full">

      {/* Product image area */}
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden"
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Product info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(193,163,106,0.6)" }}
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
          className="mb-4 font-[family-name:var(--font-playfair)] text-xl font-semibold leading-tight"
          style={{ color: "#F5F5F5" }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span
            className="text-2xl font-bold"
            style={{ color: "#C1A36A" }}
          >
            {product.price}
          </span>
           <div className="flex items-center gap-2 rounded-xl text-xs font-bold uppercase tracking-widest text-[rgba(245,245,245,0.4)] transition-all duration-300 group-hover:text-[#C1A36A]">
            Discover
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
      </Link>

    </motion.div>
  );
}

export default function ProductPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!db) {
          setProducts(staticProducts.slice(0, 6));
          setLoading(false);
          return;
        }

        const q = query(collection(db, 'products'), limit(6));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const fetchedProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          setProducts(fetchedProducts);
        } else {
          setProducts(staticProducts.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(staticProducts.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <div className="mx-auto max-w-7xl">
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
            Curated Selection
          </span>
          <h2
            className="mb-4 font-[family-name:var(--font-playfair)] font-bold"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#F5F5F5" }}
          >
            The Luxury of Choice
          </h2>
          <p
            className="mx-auto max-w-xl text-base font-light leading-relaxed"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            Explore our hand-picked collection of premium essentials, 
            sourced with uncompromising standards for quality and authenticity.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-8 h-8 text-[#C1A36A] animate-spin" />
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} inView={inView} />
            ))}
          </div>
        )}

        {/* See All */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-2xl border border-[rgba(193,163,106,0.25)] bg-[rgba(193,163,106,0.04)] px-12 py-5 text-sm font-bold uppercase tracking-widest text-[#C1A36A] transition-all duration-300 hover:bg-[#C1A36A] hover:text-black hover:shadow-[0_0_30px_rgba(193,163,106,0.3)]"
            >
              Explore Full Collection
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
