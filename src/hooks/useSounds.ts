'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePeakStore } from '@/store/peakStore';

// Sound file paths
const SOUND_PATHS = {
  ambient: '/sounds/ambient.mp3',
  lock: '/sounds/lock.mp3',
  whoosh: '/sounds/whoosh.mp3',
  fireworks: '/sounds/fireworks.mp3',
} as const;

// Stage to sound mapping
const STAGE_SOUNDS: Record<number, keyof typeof SOUND_PATHS | null> = {
  0: null,
  1: 'lock',
  2: 'whoosh',
  3: null,
  4: 'fireworks',
};

// Simple audio manager that works without Howler
// Falls back gracefully if Howler isn't installed
export function useSounds() {
  const soundEnabled = usePeakStore((s) => s.soundEnabled);
  const currentStage = usePeakStore((s) => s.currentStage);
  const prevStageRef = useRef(0);
  
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const soundsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const initializedRef = useRef(false);

  // Initialize audio elements
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined' || initializedRef.current) return;
    
    // Create ambient audio
    ambientRef.current = new Audio(SOUND_PATHS.ambient);
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0.3;
    
    // Create other sounds
    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      if (key !== 'ambient') {
        const audio = new Audio(path);
        audio.volume = 0.5;
        audio.preload = 'auto';
        soundsRef.current.set(key, audio);
      }
    });
    
    initializedRef.current = true;
  }, []);

  // Play a specific sound
  const playSound = useCallback((soundKey: keyof typeof SOUND_PATHS) => {
    if (!soundEnabled) return;
    
    const audio = soundsRef.current.get(soundKey);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [soundEnabled]);

  // Handle sound enable/disable
  useEffect(() => {
    initAudio();
    
    if (soundEnabled && ambientRef.current) {
      ambientRef.current.play().catch(() => {
        // Autoplay blocked - that's fine
      });
    } else if (ambientRef.current) {
      ambientRef.current.pause();
    }
  }, [soundEnabled, initAudio]);

  // Play sounds on stage change
  useEffect(() => {
    if (currentStage !== prevStageRef.current) {
      const soundKey = STAGE_SOUNDS[currentStage];
      if (soundKey && soundEnabled) {
        playSound(soundKey);
      }
      prevStageRef.current = currentStage;
    }
  }, [currentStage, soundEnabled, playSound]);

  // Cleanup
  useEffect(() => {
    const ambient = ambientRef.current;
    const sounds = soundsRef.current;
    return () => {
      ambient?.pause();
      sounds.forEach((audio) => audio.pause());
    };
  }, []);

  return { playSound, initAudio };
}
