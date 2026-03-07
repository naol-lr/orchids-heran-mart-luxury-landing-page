"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    name: "Amara T.",
    rating: 5,
    quote: "HERAN Mart is hands down the best neighborhood store I've ever been to. The staff is incredibly welcoming and the produce is always fresh.",
    date: "February 2026",
  },
  {
    name: "James R.",
    rating: 5,
    quote: "I moved to Las Vegas last year and HERAN immediately felt like home. Clean, well-stocked, and the team genuinely cares.",
    date: "January 2026",
  },
  {
    name: "Sofia M.",
    rating: 5,
    quote: "The teff grain selection alone is worth the trip. Finally a store that caters to diverse tastes. Love this place!",
    date: "March 2026",
  },
  {
    name: "Daniel K.",
    rating: 5,
    quote: "Premium atmosphere, everyday prices. I love how they've elevated the convenience store experience without sacrificing accessibility.",
    date: "February 2026",
  },
];

function ReviewCarousel() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const prev = () => setActive((a) => (a - 1 + reviews.length) % reviews.length);
  const next = () => setActive((a) => (a + 1) % reviews.length);

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span
          className="text-xs tracking-[0.4em] uppercase font-light mb-3 block"
          style={{ color: "rgba(212,175,55,0.6)" }}
        >
          Customer Reviews
        </span>
        <h2
          className="font-[family-name:var(--font-playfair)] font-bold"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#F5F5F5" }}
        >
          What Our Community Says
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-10 text-center"
            style={{
              background: "rgba(26,26,26,0.7)",
              border: "1px solid rgba(212,175,55,0.18)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(212,175,55,0.05), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <Quote size={36} className="mx-auto mb-6" style={{ color: "rgba(212,175,55,0.3)" }} />

            <div className="flex justify-center gap-1 mb-6">
              {[...Array(reviews[active].rating)].map((_, i) => (
                <Star key={i} size={16} fill="#D4AF37" style={{ color: "#D4AF37" }} />
              ))}
            </div>

            <p
              className="font-[family-name:var(--font-playfair)] italic text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: "rgba(245,245,245,0.85)" }}
            >
              &ldquo;{reviews[active].quote}&rdquo;
            </p>

            <p className="font-semibold text-sm" style={{ color: "#D4AF37" }}>
              {reviews[active].name}
            </p>
            <p className="text-xs mt-1 font-light" style={{ color: "rgba(245,245,245,0.35)" }}>
              {reviews[active].date}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#D4AF37",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.15)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(212,175,55,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 20 : 8,
                  height: 8,
                  background: i === active ? "#D4AF37" : "rgba(212,175,55,0.2)",
                  boxShadow: i === active ? "0 0 10px rgba(212,175,55,0.5)" : "none",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#D4AF37",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.15)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(212,175,55,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface StoryItem {
  label: string;
  title: string;
  body: string;
  emoji: string;
  isEven: boolean;
}

function StoryCard({ s, isEven }: { s: StoryItem; isEven: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl p-8 md:p-12"
      style={{
        background: "rgba(26,26,26,0.6)",
        border: "1px solid rgba(212,175,55,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className={isEven ? "order-1" : "order-1 md:order-2"}>
        <span
          className="text-xs tracking-[0.3em] uppercase font-light mb-3 block"
          style={{ color: "rgba(212,175,55,0.6)" }}
        >
          {s.label}
        </span>
        <h2
          className="font-[family-name:var(--font-playfair)] font-bold text-2xl md:text-3xl mb-4"
          style={{ color: "#F5F5F5" }}
        >
          {s.title}
        </h2>
        <p
          className="text-sm md:text-base font-light leading-relaxed"
          style={{ color: "rgba(245,245,245,0.55)" }}
        >
          {s.body}
        </p>
      </div>

      <div
        className={`${isEven ? "order-2" : "order-2 md:order-1"} flex items-center justify-center h-40 md:h-56 rounded-2xl`}
        style={{
          background: "rgba(212,175,55,0.04)",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <span className="text-6xl md:text-8xl">{s.emoji}</span>
      </div>
    </motion.div>
  );
}

const story = [
  {
    label: "Our Story",
    title: "Born From Community",
    body: "HERAN Mart was founded with a simple belief: every neighborhood deserves a market that treats them with dignity and care. What started as a single store in Las Vegas has grown into a trusted name — a place where customers become family and every visit feels like home.",
    emoji: "🌱",
  },
  {
    label: "Our Mission",
    title: "Elevate the Everyday",
    body: "We exist to make everyday grocery shopping feel premium without the premium price tag. From carefully curated product selections to attentive, friendly service — we believe that how you shop matters just as much as what you buy.",
    emoji: "✨",
  },
  {
    label: "Community Promise",
    title: "Rooted in Las Vegas",
    body: "We are proud to serve the diverse communities of Las Vegas. HERAN Mart partners with local suppliers, supports neighborhood initiatives, and commits to being a reliable, respectful presence in every community we call home.",
    emoji: "🏙️",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero header */}
      <div
        className="relative pt-32 pb-20 px-6 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(27,48,34,0.3) 0%, transparent 60%), #0D0D0D",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <span
            className="text-xs tracking-[0.4em] uppercase font-light mb-4 block"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Our Identity
          </span>
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "#F5F5F5" }}
          >
            About{" "}
            <span style={{ color: "#D4AF37", textShadow: "0 0 40px rgba(212,175,55,0.4)" }}>
              HERAN Mart
            </span>
          </h1>
          <p
            className="mt-6 text-base font-light max-w-xl mx-auto"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            A neighborhood grocery store elevating the everyday — built on trust, quality, and community.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Story sections */}
        <div className="space-y-6 mb-16">
          {story.map((s, i) => (
            <StoryCard key={s.label} s={{ ...s, isEven: i % 2 === 0 }} isEven={i % 2 === 0} />
          ))}
        </div>

        {/* Gold divider */}
        <div
          className="h-px my-4"
          style={{
            background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
          }}
        />

        {/* Review carousel */}
        <ReviewCarousel />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 rounded-3xl p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(27,48,34,0.3) 50%, rgba(212,175,55,0.06) 100%)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <h3
            className="font-[family-name:var(--font-playfair)] font-bold text-2xl md:text-3xl mb-3"
            style={{ color: "#F5F5F5" }}
          >
            Come Visit Us in Las Vegas
          </h3>
          <p
            className="text-sm font-light mb-8 max-w-lg mx-auto"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            Experience HERAN Mart in person. We&apos;d love to welcome you to our store.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-2xl text-sm font-medium tracking-wider uppercase transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
                color: "#0D0D0D",
                boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 30px rgba(212,175,55,0.5)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(212,175,55,0.3)")
              }
            >
              Get Directions
            </Link>
            <Link
              href="/#shop"
              className="px-8 py-4 rounded-2xl text-sm font-medium tracking-wider uppercase transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "rgba(245,245,245,0.8)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
