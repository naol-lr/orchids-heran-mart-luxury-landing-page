"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroIntro from "@/components/HeroIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import ProductPreview from "@/components/ProductPreview";
import PromoBanners from "@/components/PromoBanners";
import Footer from "@/components/Footer";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (introComplete) {
      // Small delay so the fade-out of intro overlaps the fade-in of content
      const t = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(t);
    }
  }, [introComplete]);

  // Lenis smooth scroll
  useEffect(() => {
    if (!showContent) return;
    let lenis: import("@studio-freight/lenis").default | null = null;
    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      function raf(time: number) {
        lenis!.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });
    return () => {
      lenis?.destroy();
    };
  }, [showContent]);

  return (
    <>
      {/* Hero intro animation — shown until clicked */}
      <AnimatePresence>
        {!introComplete && (
          <HeroIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Main site content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Navbar logoVisible />
            <main>
              <HeroSection />
              <ValueProposition />
              <ProductPreview />
              <PromoBanners />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
