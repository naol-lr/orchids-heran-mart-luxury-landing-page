'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

// Subtle floating geometric orbs instead of emojis
const floatingOrbs = [
  { size: "120px", blur: "60px", color: "rgba(193, 163, 106, 0.08)", x: "10%", y: "20%", delay: 0, duration: 8 },
  { size: "200px", blur: "80px", color: "rgba(193, 163, 106, 0.05)", x: "75%", y: "15%", delay: 1, duration: 10 },
  { size: "150px", blur: "70px", color: "rgba(255, 255, 255, 0.03)", x: "85%", y: "65%", delay: 0.5, duration: 9 },
  { size: "180px", blur: "90px", color: "rgba(193, 163, 106, 0.06)", x: "15%", y: "70%", delay: 2, duration: 11 },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(20, 26, 22, 0.4) 0%, rgba(10, 10, 10, 1) 70%), #0A0A0A",
      }}
    >
      {/* Floating Orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none select-none"
          style={{ 
            left: orb.x, 
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${orb.blur})`,
          }}
          animate={{ 
            y: [-20, 20, -20], 
            x: [-15, 15, -15],
            scale: [1, 1.05, 1] 
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(193, 163, 106, 0.05) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span
            className="text-[10px] sm:text-xs tracking-[0.5em] uppercase font-light px-5 py-2.5 rounded-full backdrop-blur-sm"
            style={{
              color: "#C1A36A",
              border: "1px solid rgba(193, 163, 106, 0.2)",
              background: "rgba(193, 163, 106, 0.05)",
            }}
          >
            Las Vegas, Nevada
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-[family-name:var(--font-playfair)] font-bold leading-[1.1] mb-6"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            color: "#F0F0F0",
            letterSpacing: "-0.02em",
          }}
        >
          Your Neighborhood
          <br />
          Market{" "}
          <span
            className="italic font-light"
            style={{
              color: "#C1A36A",
            }}
          >
            — Elevated.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          style={{ color: "rgba(240, 240, 240, 0.6)" }}
        >
          Curated essentials, refined service, and everyday convenience
          in Las Vegas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-3 px-10 py-4.5 rounded-full font-medium tracking-wide text-sm transition-all duration-300 w-full sm:w-auto justify-center"
            style={{
              background: "linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)",
              color: "#0A0A0A",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 30px rgba(193, 163, 106, 0.25)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow = "none")
            }
          >
            Explore Selection
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/contact"
            className="group flex items-center gap-3 px-10 py-4.5 rounded-full font-medium tracking-wide text-sm transition-all duration-300 w-full sm:w-auto justify-center"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              color: "#F0F0F0",
              border: "1px solid rgba(193, 163, 106, 0.2)",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(193, 163, 106, 0.5)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(193, 163, 106, 0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(193, 163, 106, 0.2)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255, 255, 255, 0.03)";
            }}
          >
            <MapPin size={16} opacity={0.7} />
            Find Us
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-20 border-t border-[rgba(193,163,106,0.1)] pt-12"
        >
          {[
            { value: "500+", label: "Curated Items" },
            { value: "7 Days", label: "A Week" },
            { value: "24/7", label: "Essentials" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-[family-name:var(--font-playfair)] font-medium text-3xl md:text-4xl mb-2"
                style={{ color: "#C1A36A" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(240, 240, 240, 0.4)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #0A0A0A)",
        }}
      />
    </section>
  );
}
