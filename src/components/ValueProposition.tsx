"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Star, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Polite Service",
    description:
      "We treat every customer with respect and friendliness — because you deserve more than just a transaction.",
    accent: "#C1A36A",
    bg: "rgba(193,163,106,0.05)",
    glow: "rgba(193,163,106,0.2)",
  },
  {
    icon: Star,
    title: "Quality Products",
    description:
      "Fresh groceries and trusted brands every day — carefully selected so you never have to compromise.",
    accent: "#C1A36A",
    bg: "rgba(27,48,34,0.15)",
    glow: "rgba(27,48,34,0.4)",
  },
  {
    icon: Users,
    title: "Community Store",
    description:
      "A neighborhood mart built for convenience and reliability — rooted in the Las Vegas community.",
    accent: "#C1A36A",
    bg: "rgba(193,163,106,0.05)",
    glow: "rgba(193,163,106,0.2)",
  },
];

export default function ValueProposition() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="values"
      ref={ref}
      className="relative py-24 md:py-32 px-6"
      style={{ background: "#0D0D0D" }}
    >
      {/* Section divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(193,163,106,0.4), transparent)",
        }}
      />

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
            style={{ color: "rgba(193,163,106,0.6)" }}
          >
            Why Choose HERAN
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F5F5F5" }}
          >
            Our Promise to You
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="group relative rounded-2xl p-8 cursor-default transition-all duration-500"
                style={{
                  background: "rgba(26,26,26,0.6)",
                  border: "1px solid rgba(193,163,106,0.12)",
                  backdropFilter: "blur(20px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(193,163,106,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 30px rgba(193,163,106,0.12), 0 0 60px rgba(193,163,106,0.05)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(193,163,106,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: v.bg,
                    border: "1px solid rgba(193,163,106,0.2)",
                  }}
                >
                  <Icon size={24} style={{ color: v.accent }} />
                </div>

                {/* Title */}
                <h3
                  className="font-[family-name:var(--font-playfair)] font-semibold text-xl mb-3"
                  style={{ color: "#F5F5F5" }}
                >
                  {v.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed font-light"
                  style={{ color: "rgba(245,245,245,0.55)" }}
                >
                  {v.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(193,163,106,0.5), transparent)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
