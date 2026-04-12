'use client';

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
    <div ref={ref} className="relative mx-auto max-w-3xl py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <span
          className="mb-3 block text-xs font-light uppercase tracking-[0.4em]"
          style={{ color: "rgba(193,163,106,0.6)" }}
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
              border: "1px solid rgba(193,163,106,0.18)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(193,163,106,0.05), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <Quote size={36} className="mx-auto mb-6" style={{ color: "rgba(193,163,106,0.3)" }} />

            <div className="mb-6 flex justify-center gap-1">
              {[...Array(reviews[active].rating)].map((_, i) => (
                <Star key={i} size={16} fill="#C1A36A" style={{ color: "#C1A36A" }} />
              ))}
            </div>

            <p
              className="mb-8 font-[family-name:var(--font-playfair)] text-lg italic leading-relaxed md:text-xl"
              style={{ color: "rgba(245,245,245,0.85)" }}
            >
              &ldquo;{reviews[active].quote}&rdquo;
            </p>

            <p className="text-sm font-semibold" style={{ color: "#C1A36A" }}>
              {reviews[active].name}
            </p>
            <p className="mt-1 text-xs font-light" style={{ color: "rgba(245,245,245,0.35)" }}>
              {reviews[active].date}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
            style={{
              background: "rgba(193,163,106,0.08)",
              border: "1px solid rgba(193,163,106,0.2)",
              color: "#C1A36A",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(193,163,106,0.15)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(193,163,106,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(193,163,106,0.08)";
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
                  background: i === active ? "#C1A36A" : "rgba(193,163,106,0.2)",
                  boxShadow: i === active ? "0 0 10px rgba(193,163,106,0.5)" : "none",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
            style={{
              background: "rgba(193,163,106,0.08)",
              border: "1px solid rgba(193,163,106,0.2)",
              color: "#C1A36A",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(193,163,106,0.15)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(193,163,106,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(193,163,106,0.08)";
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
      className="grid grid-cols-1 items-center gap-8 rounded-3xl p-8 md:grid-cols-2 md:p-12"
      style={{
        background: "rgba(26,26,26,0.6)",
        border: "1px solid rgba(193,163,106,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className={isEven ? "order-1" : "order-1 md:order-2"}>
        <span
          className="mb-3 block text-xs font-light uppercase tracking-[0.3em]"
          style={{ color: "rgba(193,163,106,0.6)" }}
        >
          {s.label}
        </span>
        <h2
          className="mb-4 font-[family-name:var(--font-playfair)] text-2xl font-bold md:text-3xl"
          style={{ color: "#F5F5F5" }}
        >
          {s.title}
        </h2>
        <p
          className="text-sm font-light leading-relaxed md:text-base"
          style={{ color: "rgba(245,245,245,0.55)" }}
        >
          {s.body}
        </p>
      </div>

      <div
        className={`flex h-40 items-center justify-center rounded-2xl ${isEven ? "order-2" : "order-2 md:order-1"}`}
        style={{
          background: "rgba(193,163,106,0.04)",
          border: "1px solid rgba(193,163,106,0.1)",
        }}
      >
        <span className="text-6xl md:text-8xl font-[family-name:var(--font-playfair)] italic font-light text-[#C1A36A] opacity-50">{s.title.charAt(0)}</span>
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
        className="relative overflow-hidden px-6 pt-32 pb-20 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(27,48,34,0.3) 0%, transparent 60%), #0D0D0D",
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(193,163,106,0.04) 0%, transparent 70%)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <span
            className="mb-4 block text-xs font-light uppercase tracking-[0.4em]"
            style={{ color: "rgba(193,163,106,0.6)" }}
          >
            Our Identity
          </span>
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "#F5F5F5" }}
          >
            About{" "}
            <span style={{ color: "#C1A36A", textShadow: "0 0 40px rgba(193,163,106,0.4)" }}>
              HERAN Mart
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-base font-light"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            A neighborhood grocery store elevating the everyday — built on trust, quality, and community.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {/* Story sections */}
        <div className="mb-16 space-y-6">
          {story.map((s, i) => (
            <StoryCard key={s.label} s={s} isEven={i % 2 === 0} />
          ))}
        </div>

        {/* Gold divider */}
        <div
          className="my-4 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(193,163,106,0.4), transparent)",
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
              "linear-gradient(135deg, rgba(193,163,106,0.06) 0%, rgba(27,48,34,0.3) 50%, rgba(193,163,106,0.06) 100%)",
            border: "1px solid rgba(193,163,106,0.2)",
          }}
        >
          <h3
            className="mb-3 font-[family-name:var(--font-playfair)] text-2xl font-bold md:text-3xl"
            style={{ color: "#F5F5F5" }}
          >
            Come Visit Us in Las Vegas
          </h3>
          <p
            className="mx-auto mb-8 max-w-lg text-sm font-light"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            Experience HERAN Mart in person. We&apos;d love to welcome you to our store.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-2xl px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)",
                color: "#0D0D0D",
                boxShadow: "0 4px 20px rgba(193,163,106,0.3)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 30px rgba(193,163,106,0.5)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(193,163,106,0.3)")
              }
            >
              Get Directions
            </Link>
            <Link
              href="/shop"
              className="rounded-2xl border border-[rgba(193,163,106,0.2)] bg-[rgba(255,255,255,0.04)] px-8 py-4 text-sm font-medium uppercase tracking-wider text-[rgba(245,245,245,0.8)] transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
