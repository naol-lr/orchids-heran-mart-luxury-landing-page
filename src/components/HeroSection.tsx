'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

// Floating grocery emoji icons in the background
const floatingIcons = [
  { icon: "🥑", x: "8%", y: "20%", delay: 0, duration: 4 },
  { icon: "🍎", x: "88%", y: "15%", delay: 0.5, duration: 3.5 },
  { icon: "🥦", x: "5%", y: "65%", delay: 1, duration: 4.5 },
  { icon: "🍋", x: "92%", y: "55%", delay: 0.3, duration: 3.8 },
  { icon: "🥕", x: "15%", y: "80%", delay: 1.5, duration: 4.2 },
  { icon: "🫐", x: "80%", y: "75%", delay: 0.8, duration: 3.6 },
  { icon: "🧀", x: "70%", y: "25%", delay: 1.2, duration: 4.8 },
  { icon: "🍇", x: "22%", y: "35%", delay: 0.6, duration: 4.0 },
  { icon: "🥐", x: "55%", y: "82%", delay: 1.8, duration: 3.4 },
  { icon: "🍓", x: "40%", y: "12%", delay: 0.9, duration: 4.3 },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(27,48,34,0.3) 0%, rgba(13,13,13,0) 60%), #0D0D0D",
      }}
    >
      {/* Floating grocery icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl md:text-3xl pointer-events-none select-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [-10, 10, -10], rotate: [-3, 3, -3] }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span style={{ opacity: 0.18, filter: "saturate(0.5)" }}>
            {item.icon}
          </span>
        </motion.div>
      ))}

      {/* Central radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span
            className="text-xs tracking-[0.4em] uppercase font-light px-4 py-2 rounded-full"
            style={{
              color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.25)",
              background: "rgba(212,175,55,0.06)",
            }}
          >
            Las Vegas, Nevada
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-[family-name:var(--font-playfair)] font-bold leading-[1.1] mb-6"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            color: "#F5F5F5",
          }}
        >
          Your Neighborhood Market
          <br />
          <span
            style={{
              color: "#D4AF37",
              textShadow:
                "0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15)",
            }}
          >
            — Elevated.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: "rgba(245,245,245,0.55)" }}
        >
          Fresh essentials, polite service, and everyday convenience
          in Las Vegas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium tracking-wide text-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
              color: "#0D0D0D",
              boxShadow: "0 4px 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 30px rgba(212,175,55,0.5), 0 0 60px rgba(212,175,55,0.2)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1)")
            }
          >
            Explore Shop
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/contact"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium tracking-wide text-sm transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(245,245,245,0.8)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(212,175,55,0.5)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(212,175,55,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(212,175,55,0.2)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
          >
            <MapPin size={16} />
            Find Us
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 md:gap-16"
        >
          {[
            { value: "500+", label: "Products" },
            { value: "7 Days", label: "A Week" },
            { value: "24/7", label: "Essentials" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-[family-name:var(--font-playfair)] font-bold text-2xl md:text-3xl"
                style={{ color: "#D4AF37" }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs tracking-widest uppercase mt-1"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #0D0D0D)",
        }}
      />
    </section>
  );
}
