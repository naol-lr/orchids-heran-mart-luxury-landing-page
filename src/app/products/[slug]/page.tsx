'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Product } from '@/data/products';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingBag, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const q = query(collection(db, 'products'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setProduct(querySnapshot.docs[0].data() as Product);
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C1A36A] animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if(product) {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }
  }

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  // Default values for missing properties
  const details = product.details || [];
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) 
    : 5;

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh' }}>
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative flex aspect-square items-center justify-center rounded-3xl border border-[rgba(193,163,106,0.15)] p-8"
            style={{
              background: product.bg || 'rgba(193,163,106,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <span className="select-none text-8xl font-[family-name:var(--font-playfair)] italic font-light opacity-60 text-[#C1A36A] transition-transform duration-300 ease-out md:text-9xl">
              {product.name.charAt(0)}
            </span>
            {product.badge && (
              <span
                className="absolute left-4 top-4 rounded-full border border-[rgba(193,163,106,0.3)] bg-[rgba(193,163,106,0.15)] px-3 py-1 text-xs font-medium tracking-wider text-[#C1A36A]"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex h-full flex-col"
          >
            <div>
              <Link
                href="/shop"
                className="mb-3 block text-sm font-light text-[rgba(193,163,106,0.6)] hover:text-[#C1A36A]"
              >
                &larr; Back to Shop
              </Link>
              <h1
                className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight lg:text-5xl"
                style={{ color: '#F5F5F5' }}
              >
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-4">
                <p className="text-3xl font-bold text-[#C1A36A]">{product.price}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < averageRating ? 'text-[#C1A36A]' : 'text-[rgba(245,245,245,0.2)]'}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              <p className="mt-6 font-light leading-relaxed text-[rgba(245,245,245,0.6)]">
                {product.description}
              </p>
            </div>

            {details.length > 0 && (
              <div className="mt-8 flex-grow">
                  <h3 className="text-sm uppercase tracking-widest text-[rgba(193,163,106,0.6)]">Includes</h3>
                  <ul className="mt-4 space-y-2">
                      {details.map(detail => (
                          <li key={detail} className="flex items-center gap-3 text-sm font-light text-[rgba(245,245,245,0.5)]">
                              <Check size={14} className="text-[#C1A36A]" />
                              {detail}
                          </li>
                      ))}
                  </ul>
              </div>
            )}
            
            {/* Add to Cart Section */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-[rgba(193,163,106,0.2)]">
                <button onClick={decrement} className="p-3 text-[rgba(245,245,245,0.5)] transition-colors hover:text-white">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-lg font-medium text-white">{quantity}</span>
                <button onClick={increment} className="p-3 text-[rgba(245,245,245,0.5)] transition-colors hover:text-white">
                  <Plus size={16} />
                </button>
              </div>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-medium uppercase tracking-wider"
                style={{
                  background: added ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)',
                  color: added ? '#F5F5F5' : '#0D0D0D',
                  boxShadow: added ? '0 4px 20px rgba(34,197,94,0.3)' : '0 4px 20px rgba(193,163,106,0.3)',
                }}
              >
                {added ? (
                  <motion.span initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}><Check size={15} /></motion.span>
                ) : (
                  <ShoppingBag size={15} />
                )}
                {added ? 'Added!' : 'Add to Cart'}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#F5F5F5] lg:text-3xl">Customer Reviews</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {reviews.map((review: any, i: number) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1}}
                      className="rounded-2xl border border-[rgba(193,163,106,0.15)] bg-[rgba(26,26,26,0.7)] p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-white">{review.author}</p>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < review.rating ? 'text-[#C1A36A]' : 'text-[rgba(245,245,245,0.2)]'} fill="currentColor" />
                                ))}
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-light text-[rgba(245,245,245,0.6)]">{review.text}</p>
                    </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
