'use client';

import React, { useState } from 'react';
import { useSound } from '@/context/SoundContext';
import { themesList } from '@/context/SoundContext';
import { Volume2, VolumeX, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const themeEmojis = ['🌅', '🌙', '✨', '🌴', '🪐'];

export default function SoundControlCenter() {
  const { 
    initAudio, 
    playClick, 
    playHover, 
    isMuted, 
    setMuted, 
    musicVolume, 
    setMusicVolume, 
    isAudioInitialized,
    soundTheme,
    setSoundTheme
  } = useSound();

  const [isOpen, setIsOpen] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 select-none">
      <AnimatePresence>
        {!isAudioInitialized ? (
          <motion.button
            key="activator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initAudio}
            onMouseEnter={playHover}
            className="flex items-center gap-3 px-5 py-3 bg-[#0D0D0D]/90 hover:bg-[#121212]/95 border border-[#C1A36A]/30 hover:border-[#C1A36A]/60 rounded-full text-[#C1A36A] text-xs font-semibold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(193,163,106,0.15)] backdrop-blur-md transition-all duration-300 group cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1A36A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C1A36A]"></span>
            </span>
            <Music size={12} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[10px] sm:text-xs">Activate Ambience</span>
          </motion.button>
        ) : (
          <div className="flex flex-col items-start gap-2">
            {/* Theme picker dropdown (appears above) */}
            <AnimatePresence>
              {showThemes && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="flex flex-col gap-1 px-3 py-3 bg-[#0A0A0A]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg min-w-[200px]"
                >
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold px-2 mb-1">
                    Ambience Theme
                  </span>
                  {themesList.map((name, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playClick();
                        setSoundTheme(idx);
                      }}
                      onMouseEnter={playHover}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all duration-200 cursor-pointer ${
                        soundTheme === idx
                          ? 'bg-[#C1A36A]/15 text-[#C1A36A] border border-[#C1A36A]/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="text-sm">{themeEmojis[idx]}</span>
                      <span className="font-medium tracking-wide">{name}</span>
                      {soundTheme === idx && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C1A36A]"
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main controls row */}
            <div className="flex items-center gap-3">
              {/* Main Toggle Button */}
              <motion.button
                key="control-btn"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  setIsOpen(!isOpen);
                  if (isOpen) setShowThemes(false);
                }}
                className="flex items-center justify-center w-12 h-12 bg-[#0D0D0D]/90 border border-[#C1A36A]/20 hover:border-[#C1A36A]/50 rounded-full text-white/80 hover:text-white shadow-lg backdrop-blur-md cursor-pointer transition-all duration-300"
                title="Ambience settings"
              >
                {isMuted ? <VolumeX size={16} className="text-white/40" /> : <Volume2 size={16} className="text-[#C1A36A]" />}
              </motion.button>

              {/* Expandable Control Panel */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className="flex items-center gap-4 px-5 py-3 bg-[#0D0D0D]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg"
                  >
                    {/* Mute toggle */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          playClick();
                          setMuted(!isMuted);
                        }}
                        onMouseEnter={playHover}
                        className="p-1 hover:bg-white/5 rounded text-white/60 hover:text-white cursor-pointer"
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                        {isMuted ? 'Muted' : 'Ambience'}
                      </span>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="0.4"
                        step="0.01"
                        value={musicVolume}
                        onChange={(e) => {
                          setMusicVolume(parseFloat(e.target.value));
                        }}
                        className="w-20 h-1 bg-white/10 hover:bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C1A36A] focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-white/40">
                        {Math.round((musicVolume / 0.4) * 100)}%
                      </span>
                    </div>

                    {/* Theme selector button */}
                    <button
                      onClick={() => {
                        playClick();
                        setShowThemes(!showThemes);
                      }}
                      onMouseEnter={playHover}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
                      title="Choose ambience theme"
                    >
                      <span className="text-xs">{themeEmojis[soundTheme]}</span>
                      <span className="text-[9px] font-semibold tracking-wider uppercase hidden sm:inline">{themesList[soundTheme]}</span>
                      {showThemes ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>

                    {/* Visualizer bars */}
                    {!isMuted && (
                      <div className="flex items-end gap-[2px] h-3">
                        <span className="w-[2px] bg-[#C1A36A] rounded-full animate-[pulse_0.6s_infinite_alternate]" style={{ height: '30%' }}></span>
                        <span className="w-[2px] bg-[#C1A36A] rounded-full animate-[pulse_0.4s_infinite_alternate]" style={{ height: '80%', animationDelay: '0.1s' }}></span>
                        <span className="w-[2px] bg-[#C1A36A] rounded-full animate-[pulse_0.5s_infinite_alternate]" style={{ height: '50%', animationDelay: '0.2s' }}></span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
