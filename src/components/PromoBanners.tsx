"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tag, Zap, Package } from "lucide-react";

const promos = [
  {
    icon: Zap,
    tag: "Limited Time",
    headline: "20% OFF",
    subtitle: "All Snacks & Confectionery",
    cta: "Shop Snacks",
    accent: "#D4AF37",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)",
    border: "rgba(212,175,55,0.25)",
    glow: "rgba(212,175,55,0.15)",
    emoji: "🍿",
  },
  {
    icon: Tag,
    tag: "Weekend Sale",
    headline: "Fresh Produce",
    subtitle: "Farm-fresh fruits & vegetables every weekend",
    cta: "See Produce",
    accent: "#4ade80",
    bg: "linear-gradient(135deg, rgba(27,48,34,0.5) 0%, rgba(27,48,34,0.2) 100%)",
    border: "rgba(74,222,128,0.25)",
    glow: "rgba(74,222,128,0.12)",
    emoji: "🥦",
  },
  {
    icon: Package,
    tag: "Best Value",
    headline: "Family Bundle",
    subtitle: "Household essentials at one unbeatable price",
    cta: "Get Bundle",
    accent: "#D4AF37",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(27,48,34,0.15) 100%)",
    border: "rgba(212,175,55,0.25)",
    glow: "rgba(212,175,55,0.15)",
    emoji: "🧺",
  },
];

export default function PromoBanners() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6"
      style={{ background: "#0D0D0D" }}
    >
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)",
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
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Exclusive Deals
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F5F5F5" }}
          >
            Today&apos;s Offers
          </h2>
        </motion.div>

        {/* Banner grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.headline}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  background: promo.bg,
                  border: `1px solid ${promo.border}`,
                  backdropFilter: "blur(20px)",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${promo.glow}, 0 8px 40px rgba(0,0,0,0.4)`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.borderColor = promo.accent + "60";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = promo.border;
                }}
              >
                {/* Big emoji watermark */}
                <div
                  className="absolute top-4 right-4 text-7xl select-none pointer-events-none"
                  style={{ opacity: 0.12 }}
                >
                  {promo.emoji}
                </div>

                <div className="relative p-8">
                  {/* Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${promo.accent}20`,
                        border: `1px solid ${promo.accent}40`,
                      }}
                    >
                      <Icon size={14} style={{ color: promo.accent }} />
                    </div>
                    <span
                      className="text-xs tracking-[0.25em] uppercase font-medium"
                      style={{ color: promo.accent }}
                    >
                      {promo.tag}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className="font-[family-name:var(--font-playfair)] font-bold mb-2 leading-tight"
                    style={{
                      fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                      color: promo.accent,
                      textShadow: `0 0 30px ${promo.accent}60`,
                    }}
                  >
                    {promo.headline}
                  </h3>

                  {/* Subtitle */}
                  <p
                    className="text-sm font-light leading-relaxed mb-6"
                    style={{ color: "rgba(245,245,245,0.5)" }}
                  >
                    {promo.subtitle}
                  </p>

                  {/* CTA */}
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase transition-all duration-300"
                    style={{
                      background: `${promo.accent}15`,
                      color: promo.accent,
                      border: `1px solid ${promo.accent}30`,
                    }}
                  >
                    {promo.cta}
                    <span className="text-lg leading-none">{promo.emoji}</span>
                  </button>
                </div>

                {/* Bottom shimmer line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, transparent, ${promo.accent}80, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Wide banner at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-6 rounded-3xl overflow-hidden cursor-pointer group relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(27,48,34,0.25) 50%, rgba(212,175,55,0.06) 100%)",
            border: "1px solid rgba(212,175,55,0.2)",
            transition: "all 0.4s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 50px rgba(212,175,55,0.1), 0 8px 40px rgba(0,0,0,0.4)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(212,175,55,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(212,175,55,0.2)";
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
            <div>
              <span
                className="text-xs tracking-[0.35em] uppercase font-light mb-2 block"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                Member Exclusive
              </span>
              <h3
                className="font-[family-name:var(--font-playfair)] font-bold text-2xl md:text-3xl"
                style={{ color: "#F5F5F5" }}
              >
                Join HERAN Rewards &amp; Save Every Visit
              </h3>
              <p
                className="text-sm font-light mt-2"
                style={{ color: "rgba(245,245,245,0.45)" }}
              >
                Earn points on every purchase, unlock weekly member discounts &amp; more.
              </p>
            </div>
            <button
              className="whitespace-nowrap px-8 py-4 rounded-2xl text-sm font-medium tracking-wider uppercase transition-all duration-300"
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
              Join Free
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
