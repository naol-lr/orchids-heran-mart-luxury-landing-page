'use client';

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Tag, Zap, Package, Diamond, Sprout, ShoppingBag, X, Check } from "lucide-react";
import Link from "next/link";

const promos = [
  {
    icon: Zap,
    bgIcon: Diamond,
    tag: "Limited Offering",
    headline: "20% Curated",
    subtitle: "Select artisanal snacks and confectionery items",
    cta: "Discover More",
    accentColor: "#C1A36A",
    link: "/shop?collection=curated"
  },
  {
    icon: Tag,
    bgIcon: Sprout,
    tag: "Weekend Harvest",
    headline: "Farm Fresh",
    subtitle: "Organic, farm-fresh produce sourced every weekend",
    cta: "Discover More",
    accentColor: "#A8BCA1", // Muted sage green
    link: "/shop?collection=produce"
  },
  {
    icon: Package,
    bgIcon: ShoppingBag,
    tag: "Exceptional Value",
    headline: "The Essentials",
    subtitle: "Premium household necessities bundled exclusively",
    cta: "Discover More",
    accentColor: "#E6D2A8", // Champagne silver
    link: "/shop?collection=essentials"
  },
];

export default function PromoBanners() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  const { setIsModalOpen } = useAuth();

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6"
      style={{ background: "#0A0A0A" }}
    >
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(193, 163, 106, 0.3), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span
            className="text-[10px] sm:text-xs tracking-[0.5em] uppercase font-light mb-4 block"
            style={{ color: "rgba(193, 163, 106, 0.6)" }}
          >
            Exclusive Privileges
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] font-medium"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F0F0F0" }}
          >
            Today's Curator Picks
          </h2>
        </motion.div>

        {/* Banner grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            const BgIcon = promo.bgIcon;
            return (
              <motion.div
                key={promo.headline}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="group relative rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${promo.accentColor}0A 0%, ${promo.accentColor}03 100%)`,
                  border: `1px solid ${promo.accentColor}20`,
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Make entire card clickable */}
                <Link href={promo.link} className="absolute inset-0 z-10 block" aria-label={promo.cta} />
                
                {/* Huge subtle icon in background */}
                <div
                  className="absolute -top-8 -right-8 text-7xl select-none pointer-events-none opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12"
                >
                  <BgIcon size={200} color={promo.accentColor} />
                </div>

                <div className="relative p-10 h-full flex flex-col z-20 pointer-events-none">
                  {/* Tag */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center opacity-80"
                      style={{
                        background: `${promo.accentColor}1A`,
                        border: `1px solid ${promo.accentColor}30`,
                      }}
                    >
                      <Icon size={14} style={{ color: promo.accentColor }} />
                    </div>
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase font-medium"
                      style={{ color: promo.accentColor }}
                    >
                      {promo.tag}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className="font-[family-name:var(--font-playfair)] font-medium mb-3 leading-tight"
                    style={{
                      fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                      color: "#F0F0F0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {promo.headline}
                  </h3>

                  {/* Subtitle */}
                  <p
                    className="text-sm font-light leading-relaxed mb-10 flex-grow"
                    style={{ color: "rgba(240, 240, 240, 0.5)" }}
                  >
                    {promo.subtitle}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      href={promo.link}
                      className="inline-flex items-center gap-2 text-xs font-light tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b relative z-30 pointer-events-auto"
                      style={{
                        color: promo.accentColor,
                        borderColor: `${promo.accentColor}40`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = promo.accentColor;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${promo.accentColor}40`;
                      }}
                    >
                      {promo.cta}
                    </Link>
                  </div>
                </div>

                {/* Bottom subtle gradient glow on hover */}
                <div
                  className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none filter blur-3xl rounded-full"
                  style={{
                    background: promo.accentColor,
                    opacity: 0.05,
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
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 rounded-[2.5rem] overflow-hidden cursor-pointer group relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(193, 163, 106, 0.05) 0%, rgba(20, 26, 22, 0.4) 50%, rgba(193, 163, 106, 0.05) 100%)",
            border: "1px solid rgba(193, 163, 106, 0.15)",
            backdropFilter: "blur(20px)",
            transition: "all 0.5s ease",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
            <div className="max-w-xl">
              <span
                className="text-[10px] tracking-[0.4em] uppercase font-light mb-3 block"
                style={{ color: "rgba(193, 163, 106, 0.6)" }}
              >
                The Heran Society
              </span>
              <h3
                className="font-[family-name:var(--font-playfair)] font-medium text-3xl md:text-4xl leading-tight text-[#F0F0F0]"
              >
                Join Heran Rewards & Elevate Every Visit
              </h3>
              <p
                className="text-sm font-light mt-4 leading-relaxed"
                style={{ color: "rgba(240, 240, 240, 0.5)" }}
              >
                Earn privileges on every purchase, unlock exclusive member pricing & priority access.
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap px-10 py-4 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 w-full md:w-auto relative z-10"
              style={{
                background: "linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)",
                color: "#0A0A0A",
                boxShadow: "0 8px 30px rgba(193, 163, 106, 0.15)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(193, 163, 106, 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(193, 163, 106, 0.15)";
              }}
            >
              Become a Member
            </button>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
