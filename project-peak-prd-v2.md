# Project Peak PRD v2.0
## Flux Real 2026 New Year Experience — WebP Sequence Edition

**Version:** 2.0  
**Date:** December 30, 2024  
**Status:** Ready for Vibe Coding  
**Deadline:** TODAY  

---

## 1. Executive Summary

A mobile-first, interactive experience that plays through a WebP image sequence as users progress through 5 stages. The sequence depicts a wireframe tower building upward, culminating in a fireworks celebration. Designed to impress clients, partners, and prospects with Flux Real's creative-tech prowess.

**Core Approach:** WebP frame sequence (not video) for:
- Precise control over playback
- No buffering or codec issues
- Scrubbing/looping individual segments
- Works identically across all browsers

---

## 2. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Engagement | Completion rate (reach Summit) | >70% |
| Impact | Average session duration | >45 seconds |
| Conversion | CTA click-through | >25% |
| Virality | Share actions | >15% of completers |

---

## 3. Tech Stack (Simplified)

```
┌─────────────────────────────────────────────────────────┐
│  DEPLOYMENT: Vercel (recommended) or Netlify            │
├─────────────────────────────────────────────────────────┤
│  FRAMEWORK: Next.js 14 (App Router)                     │
├─────────────────────────────────────────────────────────┤
│  SEQUENCE PLAYER                                        │
│  ├── Canvas API (for frame rendering)                   │
│  └── Preloaded WebP frames                              │
├─────────────────────────────────────────────────────────┤
│  ANIMATION: Framer Motion (UI only)                     │
├─────────────────────────────────────────────────────────┤
│  AUDIO: Howler.js (simpler than Tone.js)                │
├─────────────────────────────────────────────────────────┤
│  STATE: Zustand                                         │
├─────────────────────────────────────────────────────────┤
│  STYLING: Tailwind CSS                                  │
└─────────────────────────────────────────────────────────┘
```

### Package Installation
```bash
npx create-next-app@latest project-peak --typescript --tailwind --app
cd project-peak

npm install framer-motion zustand howler
npm install @types/howler --save-dev
```

**What we removed:** Three.js, R3F, Drei, postprocessing, GSAP

---

## 4. WebP Sequence Strategy

### A. Frame Organization

```
public/
└── frames/
    ├── stage-0/          # Entry: Pulsing core (loop)
    │   ├── 0001.webp
    │   ├── 0002.webp
    │   └── ... (30 frames @ 30fps = 1 second loop)
    │
    ├── stage-1/          # Foundation: Grid materializes
    │   ├── 0001.webp
    │   └── ... (60 frames = 2 second transition)
    │
    ├── stage-2/          # Ascent: Tower rises
    │   ├── 0001.webp
    │   └── ... (90 frames = 3 second transition)
    │
    ├── stage-3/          # Summit: Full tower + subtle movement
    │   ├── 0001.webp
    │   └── ... (30 frames = 1 second loop)
    │
    └── stage-4/          # Ignition: Fireworks
        ├── 0001.webp
        └── ... (90 frames = 3 second sequence)
```

### B. Frame Specifications

| Property | Value |
|----------|-------|
| Format | WebP (lossy, quality 85) |
| Resolution | 1080 x 1920 (9:16 portrait) |
| Frame Rate | 30fps |
| File Size Target | <50KB per frame |
| Total Frames | ~300 frames |
| Total Size Budget | ~15MB (will feel instant with preloading) |

### C. Alternative: Single Sprite Sheet

For even faster loading, combine all frames into sprite sheets:

```
public/
└── sprites/
    ├── stage-0.webp      # 5x6 grid = 30 frames
    ├── stage-1.webp      # 6x10 grid = 60 frames
    ├── stage-2.webp      # 9x10 grid = 90 frames
    ├── stage-3.webp      # 5x6 grid = 30 frames
    └── stage-4.webp      # 9x10 grid = 90 frames
```

**Sprite sheet pros:** Single HTTP request per stage, GPU-friendly
**Sprite sheet cons:** Slightly more complex rendering logic

---

## 5. User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ENTRY]  →  [FOUNDATION]  →  [ASCENT]  →  [SUMMIT]  →  [IGNITION]     │
│     │            │              │            │             │            │
│   Loop         Play Once      Play Once     Loop        Play Once      │
│   30 frames    60 frames      90 frames    30 frames    90 frames      │
│   ~1s loop     ~2s            ~3s          ~1s loop     ~3s → CTA      │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│  Interaction:  TAP / SWIPE UP / SCROLL                                  │
│  Duration:     ~30-45 seconds total                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Scene States (Detailed)

### State 0: Entry (Dormant)
**Frames:** 30 (looping)  
**Duration:** Until first interaction

| Element | Description |
|---------|-------------|
| **Visual** | Golden core/torus pulsing at ground level, fog, minimal geometry |
| **Behavior** | Loop frames 1-30 continuously |
| **UI** | "BEGIN 2026" + subtle tap indicator |
| **Audio** | Low ambient hum (if sound enabled) |

### State 1: Foundation
**Frames:** 60 (play once, hold last frame)  
**Duration:** ~2 seconds

| Element | Description |
|---------|-------------|
| **Visual** | Base grid materializes, wireframe edges glow on |
| **Behavior** | Play frames 1-60, then hold frame 60 |
| **UI** | "ALIGN VISION" |
| **Audio** | Structural "lock" sound |

### State 2: Ascent
**Frames:** 90 (play once, hold last frame)  
**Duration:** ~3 seconds

| Element | Description |
|---------|-------------|
| **Visual** | Tower skeleton rises floor by floor, energy trails |
| **Behavior** | Play frames 1-90, then hold frame 90 |
| **UI** | "ACCELERATE GROWTH" |
| **Audio** | Rising whoosh sound |

### State 3: Summit
**Frames:** 30 (looping)  
**Duration:** Until tap (then auto-advance after 2s)

| Element | Description |
|---------|-------------|
| **Visual** | Complete tower with subtle ambient movement |
| **Behavior** | Loop frames 1-30 |
| **UI** | "LAUNCH TOGETHER" |
| **Audio** | Triumphant swell |

### State 4: Ignition
**Frames:** 90 (play once)  
**Duration:** ~3 seconds, then fade to CTA

| Element | Description |
|---------|-------------|
| **Visual** | Fireworks burst from tower apex, full illumination |
| **Behavior** | Play frames 1-90, then transition to CTA overlay |
| **Audio** | Firework burst sounds |

### State 5: CTA Reveal
**Frames:** Hold last frame of Stage 4 (or fade to dark)

| Element | Description |
|---------|-------------|
| **Visual** | Tower faded in background, CTA overlay |
| **UI** | Personalized message + CTAs |

---

## 7. Component Architecture

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Main entry, handles URL params
│   └── globals.css
├── components/
│   ├── SequencePlayer/
│   │   ├── SequencePlayer.tsx    # Main canvas + frame renderer
│   │   ├── useFrameLoader.ts     # Preload frames hook
│   │   └── useSequencePlayback.ts # Playback control hook
│   ├── UI/
│   │   ├── Overlay.tsx           # Stage labels, tap indicator
│   │   ├── CTA.tsx               # Final call-to-action
│   │   ├── SoundToggle.tsx
│   │   └── LoadingScreen.tsx
│   └── Audio/
│       └── AudioManager.tsx      # Howler.js wrapper
├── store/
│   └── peakStore.ts              # Zustand store
├── lib/
│   ├── constants.ts              # Colors, timings, messages
│   └── frameConfig.ts            # Frame counts, paths per stage
├── hooks/
│   └── useSounds.ts
└── public/
    ├── frames/                   # WebP sequences
    │   ├── stage-0/
    │   ├── stage-1/
    │   ├── stage-2/
    │   ├── stage-3/
    │   └── stage-4/
    └── sounds/
        ├── ambient.mp3
        ├── lock.mp3
        ├── whoosh.mp3
        └── fireworks.mp3
```

---

## 8. Frame Sequence Player Implementation

### Core Configuration

```typescript
// lib/frameConfig.ts
export const FRAME_CONFIG = {
  0: { folder: 'stage-0', count: 30, loop: true, fps: 30 },
  1: { folder: 'stage-1', count: 60, loop: false, fps: 30 },
  2: { folder: 'stage-2', count: 90, loop: false, fps: 30 },
  3: { folder: 'stage-3', count: 30, loop: true, fps: 30 },
  4: { folder: 'stage-4', count: 90, loop: false, fps: 30 },
} as const;

export type StageKey = keyof typeof FRAME_CONFIG;
```

### Frame Loader Hook

```typescript
// components/SequencePlayer/useFrameLoader.ts
import { useState, useEffect } from 'react';
import { FRAME_CONFIG, StageKey } from '@/lib/frameConfig';

export function useFrameLoader(stage: StageKey) {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const config = FRAME_CONFIG[stage];
    let loadedCount = 0;

    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(4, '0');
        img.src = `/frames/${config.folder}/${frameNum}.webp`;
        img.onload = () => {
          loadedCount++;
          setProgress((loadedCount / config.count) * 100);
          resolve(img);
        };
        img.onerror = reject;
      });
    };

    Promise.all(
      Array.from({ length: config.count }, (_, i) => loadFrame(i))
    ).then((images) => {
      setFrames(images);
      setIsLoaded(true);
    });
  }, [stage]);

  return { frames, isLoaded, progress };
}
```

### Playback Hook

```typescript
// components/SequencePlayer/useSequencePlayback.ts
import { useRef, useCallback, useEffect } from 'react';
import { FRAME_CONFIG, StageKey } from '@/lib/frameConfig';

interface PlaybackState {
  currentFrame: number;
  isPlaying: boolean;
}

export function useSequencePlayback(
  stage: StageKey,
  frames: HTMLImageElement[],
  onComplete?: () => void
) {
  const stateRef = useRef<PlaybackState>({ currentFrame: 0, isPlaying: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const config = FRAME_CONFIG[stage];
  const frameDuration = 1000 / config.fps;

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const frame = frames[frameIndex];

    if (canvas && ctx && frame) {
      // Scale to cover canvas (object-fit: cover behavior)
      const scale = Math.max(
        canvas.width / frame.width,
        canvas.height / frame.height
      );
      const x = (canvas.width - frame.width * scale) / 2;
      const y = (canvas.height - frame.height * scale) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frame, x, y, frame.width * scale, frame.height * scale);
    }
  }, [frames]);

  const animate = useCallback((timestamp: number) => {
    if (!stateRef.current.isPlaying) return;

    const elapsed = timestamp - lastTimeRef.current;

    if (elapsed >= frameDuration) {
      lastTimeRef.current = timestamp;
      
      const { currentFrame } = stateRef.current;
      drawFrame(currentFrame);

      const nextFrame = currentFrame + 1;
      
      if (nextFrame >= config.count) {
        if (config.loop) {
          stateRef.current.currentFrame = 0;
        } else {
          stateRef.current.isPlaying = false;
          onComplete?.();
          return;
        }
      } else {
        stateRef.current.currentFrame = nextFrame;
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [config, frameDuration, drawFrame, onComplete]);

  const play = useCallback(() => {
    stateRef.current = { currentFrame: 0, isPlaying: true };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    stateRef.current.isPlaying = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { canvasRef, play, stop, drawFrame };
}
```

### Sequence Player Component

```typescript
// components/SequencePlayer/SequencePlayer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePeakStore } from '@/store/peakStore';
import { useFrameLoader } from './useFrameLoader';
import { useSequencePlayback } from './useSequencePlayback';

export default function SequencePlayer() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const advance = usePeakStore((s) => s.advance);
  const [activeStage, setActiveStage] = useState(currentStage);

  const { frames, isLoaded } = useFrameLoader(activeStage);
  
  const handleStageComplete = () => {
    if (activeStage === 4) {
      setTimeout(() => advance(), 500);
    }
  };

  const { canvasRef, play, stop, drawFrame } = useSequencePlayback(
    activeStage,
    frames,
    handleStageComplete
  );

  useEffect(() => {
    if (currentStage !== activeStage && currentStage < 5) {
      stop();
      setActiveStage(currentStage);
    }
  }, [currentStage, activeStage, stop]);

  useEffect(() => {
    if (isLoaded && frames.length > 0) {
      drawFrame(0);
      play();
    }
  }, [isLoaded, frames, play, drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (frames.length > 0) drawFrame(0);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef, frames, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#050505' }}
    />
  );
}
```

---

## 9. Visual Design Tokens

```typescript
// lib/constants.ts
export const COLORS = {
  background: '#050505',
  gold: '#FFD700',
  goldDim: '#B8860B',
  white: '#FFFFFF',
} as const;

export const TIMING = {
  autoAdvanceDelay: 2000,
  ctaFadeIn: 500,
} as const;

export const getMessage = (name?: string | null) => {
  if (name) {
    return {
      heading: `${name}, the view from here is extraordinary.`,
      subheading: "2025 was our foundation. In 2026, let's reach new heights together.",
    };
  }
  return {
    heading: "The view from the top is only possible when vision meets precision.",
    subheading: "2025 was the foundation. In 2026, let's build the extraordinary together.",
  };
};

export const CTA = {
  primary: {
    text: 'SCHEDULE A 2026 SYNC',
    url: 'https://calendly.com/fluxreal/2026-sync',
  },
  secondary: {
    text: 'View the 2026 Roadmap →',
    url: '/roadmap',
  },
} as const;
```

---

## 10. Personalization

### URL Structure
```
https://peak.fluxreal.com/?name=Ahmed
https://peak.fluxreal.com/?name=Sarah
```

---

## 11. Sound Design

### Howler.js Implementation

```typescript
// hooks/useSounds.ts
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePeakStore } from '@/store/peakStore';

const SOUNDS = {
  ambient: new Howl({ src: ['/sounds/ambient.mp3'], loop: true, volume: 0.3 }),
  lock: new Howl({ src: ['/sounds/lock.mp3'], volume: 0.5 }),
  whoosh: new Howl({ src: ['/sounds/whoosh.mp3'], volume: 0.5 }),
  fireworks: new Howl({ src: ['/sounds/fireworks.mp3'], volume: 0.6 }),
};

const STAGE_SOUNDS: Record<number, keyof typeof SOUNDS> = {
  1: 'lock',
  2: 'whoosh',
  4: 'fireworks',
};

export function useSounds() {
  const soundEnabled = usePeakStore((s) => s.soundEnabled);
  const currentStage = usePeakStore((s) => s.currentStage);
  const prevStageRef = useRef(0);

  useEffect(() => {
    if (soundEnabled) {
      SOUNDS.ambient.play();
    } else {
      SOUNDS.ambient.pause();
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (currentStage !== prevStageRef.current && soundEnabled) {
      const soundKey = STAGE_SOUNDS[currentStage];
      if (soundKey) SOUNDS[soundKey].play();
      prevStageRef.current = currentStage;
    }
  }, [currentStage, soundEnabled]);
}
```

---

## 12. Asset Creation Guide

### Creating the WebP Sequence

**Option A: After Effects / Premiere**
1. Create 1080x1920 composition
2. Animate the tower build sequence
3. Export as PNG sequence
4. Batch convert to WebP:
```bash
for f in *.png; do cwebp -q 85 "$f" -o "${f%.png}.webp"; done
```

**Option B: Blender**
1. Model simple wireframe tower
2. Animate camera + tower build
3. Render to PNG sequence
4. Convert to WebP

**Option C: Cavalry / Fable / Rive**
- Vector-based, perfect for wireframe aesthetics
- Easy export to image sequences

### Batch WebP Conversion
```bash
# Install cwebp: brew install webp (Mac) or apt install webp (Linux)
# Convert all PNGs in a folder to WebP
for f in *.png; do cwebp -q 85 "$f" -o "${f%.png}.webp"; done
```

---

## 13. Loading Strategy

### Progressive Loading

```typescript
const PRELOAD_ORDER = [0, 1, 2, 3, 4];

useEffect(() => {
  preloadStage(0).then(() => {
    setIsReady(true);
    PRELOAD_ORDER.slice(1).forEach((stage, index) => {
      setTimeout(() => preloadStage(stage), index * 500);
    });
  });
}, []);
```

---

## 14. Performance Budget

| Metric | Target | Critical |
|--------|--------|----------|
| First Frame Visible | <2s | <3s |
| All Stage 0 Frames | <3s | <5s |
| Total Asset Size | <15MB | <25MB |
| Frame Rate | 30fps | 24fps min |

---

## 15. Quick Start Commands

```bash
# Create project
npx create-next-app@latest project-peak --typescript --tailwind --app
cd project-peak

# Install dependencies
npm install framer-motion zustand howler
npm install @types/howler --save-dev

# Create directories
mkdir -p public/frames/{stage-0,stage-1,stage-2,stage-3,stage-4}
mkdir -p public/sounds

# Dev
npm run dev

# Deploy
vercel --prod
```

---

## 16. Asset Checklist

### Required
- [ ] Stage 0 frames (30 frames, looping pulse)
- [ ] Stage 1 frames (60 frames, grid materialize)
- [ ] Stage 2 frames (90 frames, tower rise)
- [ ] Stage 3 frames (30 frames, summit loop)
- [ ] Stage 4 frames (90 frames, fireworks)
- [ ] Flux Real logo (SVG)
- [ ] Sound files (ambient, lock, whoosh, fireworks)

### Nice to Have
- [ ] OG social image
- [ ] Favicon

---

## 17. Timeline for Today

| Time | Task |
|------|------|
| Hour 1 | Set up Next.js, implement SequencePlayer |
| Hour 2 | Create/source frame sequences |
| Hour 3 | Wire up UI, interactions, sounds |
| Hour 4 | Test mobile, fix issues, deploy |

---

**Document prepared for Flux Real**  
*WebP sequences: Full creative control, zero 3D complexity.*
