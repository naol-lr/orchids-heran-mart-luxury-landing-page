'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export const themesList = [
  "Golden Hour",
  "Midnight Lounge",
  "Astral Shimmer",
  "Oasis Breeze",
  "Cosmic Horizon"
];

interface SoundContextType {
  initAudio: () => void;
  playClick: () => void;
  playHover: () => void;
  playWelcome: () => void;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  isAudioInitialized: boolean;
  soundTheme: number;
  setSoundTheme: (theme: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

class WebAudioSynth {
  ctx: AudioContext | null = null;
  isMuted: boolean = false;
  musicVolume: number = 0.15;
  sfxVolume: number = 0.35;
  activeTheme: number = 0;
  ambientGain: GainNode | null = null;
  seqInterval: NodeJS.Timeout | null = null;
  activeOscillators: { osc: OscillatorNode; lfo?: OscillatorNode; gain: GainNode }[] = [];

  constructor() {}

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    
    // Create master gain for background ambient pads
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);
    
    // Start procedural pad chord loops
    this.startAmbientDrone();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ambientGain) {
      const targetVol = muted ? 0 : this.musicVolume;
      this.ambientGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.3);
    }
  }

  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.ctx && this.ambientGain && !this.isMuted) {
      this.ambientGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.2);
    }
  }

  setSoundTheme(theme: number) {
    this.activeTheme = theme;
    if (this.ctx && this.ambientGain) {
      // Transition immediately: fade out current voices and trigger new theme
      this.stopAll();
      this.startAmbientDrone();
    }
  }

  playClick() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    // Sharp high-end mechanical tactile transient drop
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(4, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playHover() {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Futuristic glass touch tick sound
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.015);

    gain.gain.setValueAtTime(this.sfxVolume * 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  playWelcome() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Warm low bass hum
    this.playTone(73.42, 'sine', 0.7, now, 2.8, false); // D2
    
    // Dreamy luxury major chord roll (Dmaj9: D3, A3, C#4, F#4, E5)
    const chord = [146.83, 220.00, 277.18, 369.99, 659.25];
    chord.forEach((freq, index) => {
      const delay = index * 0.07;
      // Synthesize with clean sine wave + detuned triangle for luxurious warm density
      this.playTone(freq - 1.2, 'sine', 0.22, now + delay, 2.5, false);
      this.playTone(freq + 1.2, 'triangle', 0.08, now + delay, 2.2, true);
    });
  }

  private playTone(freq: number, type: OscillatorType, maxGain: number, start: number, duration: number, useFilter: boolean) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(maxGain * this.sfxVolume, start + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    if (useFilter) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, start);
      filter.frequency.exponentialRampToValueAtTime(900, start + 0.5);
      filter.frequency.exponentialRampToValueAtTime(180, start + duration);
      
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.1);
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.ambientGain) return;

    // Smooth transition into music volume
    const now = this.ctx.currentTime;
    this.ambientGain.gain.linearRampToValueAtTime(this.musicVolume, now + 1.2);

    // Dynamic progressions list matching the 5 themes
    const progressions = [
      // 0: Golden Hour (Warm Pentatonic Major)
      [146.83, 220.00, 277.18, 369.99, 440.00], // Dmaj9
      // 1: Midnight Lounge (Deep mysterious jazz chords)
      [82.41, 164.81, 196.00, 246.94, 293.66],  // Em9
      // 2: Astral Shimmer (Crystalline higher bells)
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
      // 3: Oasis Breeze (Tropical warm major vibes)
      [110.00, 220.00, 277.18, 329.63, 415.30], // Amaj9
      // 4: Cosmic Horizon (Analog cinematic deep drones)
      [87.31, 174.61, 261.63, 329.63, 392.00]   // Fmaj9
    ];

    let chordIdx = 0;
    const chordDuration = 10; // Transitions every 10 seconds

    const triggerNextChord = () => {
      if (!this.ctx || !this.ambientGain || this.isMuted) return;
      const currentNow = this.ctx.currentTime;
      const chord = progressions[this.activeTheme];

      // Define synthesizer characteristics based on selected theme
      let oscType: OscillatorType = 'sine';
      let lfoFreq = 0.08;
      let lfoDepth = 1.8;
      let filterCutoffStart = 240;
      let filterCutoffPeak = 580;
      let filterQ = 1;

      if (this.activeTheme === 1) { // Midnight Lounge
        oscType = 'triangle';
        lfoFreq = 0.05;
        lfoDepth = 2.5;
        filterCutoffStart = 160;
        filterCutoffPeak = 410;
      } else if (this.activeTheme === 2) { // Astral Shimmer
        oscType = 'sine';
        lfoFreq = 0.22; // Faster shimmer frequency
        lfoDepth = 3.5;
        filterCutoffStart = 450;
        filterCutoffPeak = 1100;
        filterQ = 3;
      } else if (this.activeTheme === 3) { // Oasis Breeze
        oscType = 'triangle';
        lfoFreq = 0.12;
        lfoDepth = 1.2;
        filterCutoffStart = 280;
        filterCutoffPeak = 620;
      } else if (this.activeTheme === 4) { // Cosmic Horizon
        oscType = 'triangle'; // Detuned triangle sounds like clean analog saw
        lfoFreq = 0.04;
        lfoDepth = 4.0;
        filterCutoffStart = 120;
        filterCutoffPeak = 850;
      }

      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = oscType;
        // Pitch drift slightly for stereo widening chorus feel
        const pitchVariance = (idx - 2) * 0.4;
        osc.frequency.setValueAtTime(freq + pitchVariance, currentNow);

        // LFO Module
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.value = lfoFreq + Math.random() * 0.05;
        lfoGain.gain.value = lfoDepth;

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        // Lowpass sweep
        filter.type = 'lowpass';
        filter.Q.value = filterQ;
        filter.frequency.setValueAtTime(filterCutoffStart + Math.random() * 50, currentNow);
        filter.frequency.exponentialRampToValueAtTime(filterCutoffPeak + Math.random() * 100, currentNow + chordDuration / 2);
        filter.frequency.exponentialRampToValueAtTime(filterCutoffStart - 40, currentNow + chordDuration);

        // Smooth volume envelope
        gain.gain.setValueAtTime(0, currentNow);
        gain.gain.linearRampToValueAtTime(0.06, currentNow + 2.5); // Attack
        gain.gain.setValueAtTime(0.06, currentNow + chordDuration - 2.5);
        gain.gain.linearRampToValueAtTime(0.001, currentNow + chordDuration); // Release

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientGain!);

        lfo.start(currentNow);
        osc.start(currentNow);

        lfo.stop(currentNow + chordDuration + 0.2);
        osc.stop(currentNow + chordDuration + 0.2);

        this.activeOscillators.push({ osc, lfo, gain });
      });

      chordIdx = (chordIdx + 1) % 4;
    };

    triggerNextChord();
    this.seqInterval = setInterval(triggerNextChord, chordDuration * 1000);
  }

  stopAll() {
    if (this.seqInterval) {
      clearInterval(this.seqInterval);
      this.seqInterval = null;
    }
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.activeOscillators.forEach(({ osc, lfo, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.5); // Fade out over 0.5s click-free
          osc.stop(now + 0.6);
          lfo?.stop(now + 0.6);
        } else {
          osc.stop();
          lfo?.stop();
        }
      } catch (e) {}
    });
    this.activeOscillators = [];
  }
}

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const synthRef = useRef<WebAudioSynth | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.15);
  const [soundTheme, setSoundTheme] = useState(0);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    synthRef.current = new WebAudioSynth();
    return () => {
      synthRef.current?.stopAll();
    };
  }, []);

  const initAudio = () => {
    if (isAudioInitialized || !synthRef.current) return;
    try {
      synthRef.current.init();
      setIsAudioInitialized(true);
      // Unmute and trigger welcome sound
      setIsMuted(false);
      synthRef.current.setMuted(false);
      setTimeout(() => {
        synthRef.current?.playWelcome();
      }, 300);
    } catch (e) {
      console.error('Audio initialization error:', e);
    }
  };

  const setMuted = (muted: boolean) => {
    setIsMuted(muted);
    synthRef.current?.setMuted(muted);
  };

  const handleSetMusicVolume = (vol: number) => {
    setMusicVolume(vol);
    synthRef.current?.setMusicVolume(vol);
  };

  const handleSetSoundTheme = (theme: number) => {
    setSoundTheme(theme);
    synthRef.current?.setSoundTheme(theme);
  };

  const playClick = () => {
    synthRef.current?.playClick();
  };

  const playHover = () => {
    synthRef.current?.playHover();
  };

  const playWelcome = () => {
    synthRef.current?.playWelcome();
  };

  // Add click-to-initialize global window event handler so audio initializes instantly on user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      if (!isAudioInitialized) {
        initAudio();
      }
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, [isAudioInitialized]);

  return (
    <SoundContext.Provider
      value={{
        initAudio,
        playClick,
        playHover,
        playWelcome,
        isMuted,
        setMuted,
        musicVolume,
        setMusicVolume: handleSetMusicVolume,
        isAudioInitialized,
        soundTheme,
        setSoundTheme: handleSetSoundTheme
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
