'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroIntroProps {
  onComplete: () => void;
}

const letters = ['H', 'E', 'R', 'A', 'N'];

export default function HeroIntro({ onComplete }: HeroIntroProps) {
  const [phase, setPhase] = useState<'floating' | 'clicked' | 'welcome' | 'rising' | 'done'>('floating');
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (phase !== 'floating') return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1000);

      setPhase('clicked');

      setTimeout(() => setPhase('welcome'), 300);
      setTimeout(() => setPhase('rising'), 1400);
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 2600);
    },
    [phase, onComplete]
  );

  // Stagger float offsets per letter
  const floatOffsets = [0, 0.4, 0.8, 1.2, 1.6];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D] cursor-pointer select-none"
      onClick={handleClick}
      initial={{ opacity: 1 }}
      animate={phase === 'done' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Ripple effects */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
            border: '2px solid rgba(212,175,55,0.7)',
            animation: 'ripple 1s ease-out forwards',
          }}
        />
      ))}

      {/* Letter group */}
      <div className="relative flex items-center gap-1 md:gap-2">
        <AnimatePresence mode="wait">
          {(phase === 'floating' || phase === 'clicked') && (
            <motion.div
              key="heran"
              className="flex items-center gap-2 md:gap-4"
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.3 }}
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={letter + i}
                  className="font-[family-name:var(--font-playfair)] font-bold text-[clamp(4rem,12vw,9rem)] leading-none select-none"
                  style={{
                    color: '#D4AF37',
                    textShadow:
                      '0 0 30px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.3), 0 0 100px rgba(212,175,55,0.15)',
                    filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.5))',
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: [0, -14, 0],
                    scale: 1,
                  }}
                  transition={{
                    opacity: { delay: i * 0.12, duration: 0.5 },
                    scale: { delay: i * 0.12, duration: 0.5 },
                    y: {
                      delay: floatOffsets[i],
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          )}

          {(phase === 'welcome') && (
            <motion.div
              key="welcome"
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.8, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: '0.15em' }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className="font-[family-name:var(--font-playfair)] font-light text-[clamp(2.5rem,7vw,6rem)] tracking-[0.2em] uppercase"
                style={{
                  color: '#F5F5F5',
                  textShadow:
                    '0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15)',
                }}
              >
                Welcome
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint text */}
      <AnimatePresence>
        {phase === 'floating' && (
          <motion.p
            key="hint"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-sm tracking-[0.3em] uppercase"
            style={{ color: 'rgba(212,175,55,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          >
            Tap to enter
          </motion.p>
        )}
      </AnimatePresence>

      {/* Floating particles */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: 'rgba(212,175,55,0.4)',
                left: `${10 + i * 8}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [-20, -80, -20],
                opacity: [0, 0.6, 0],
                x: [0, (i % 2 === 0 ? 1 : -1) * 20, 0],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
