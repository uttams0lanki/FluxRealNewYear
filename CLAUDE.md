# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Peak is a mobile-first interactive New Year experience that plays through WebP image sequences as users progress through 5 stages. Built with Next.js 14, it features a wireframe tower building animation culminating in a fireworks celebration.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

Test personalization with URL params: `http://localhost:3000/?name=Ahmed`

## Architecture

### State Management

Zustand store (`src/store/peakStore.ts`) manages:
- `currentStage` (0-5): Controls which stage is active
- `soundEnabled`: Toggle for audio playback
- `recipientName`: URL param personalization
- `advance()`: Progresses to next stage with haptic feedback

### Frame Sequence System

The core playback system has three parts:

1. **Frame Config** (`src/lib/frameConfig.ts`): Defines frame counts, folder paths, loop behavior, and FPS per stage
2. **Frame Loader** (`src/components/SequencePlayer/useFrameLoader.ts`): Loads WebP frames with caching via `frameCache` Map. Exports `preloadStage()` for progressive loading
3. **Playback Hook** (`src/components/SequencePlayer/useSequencePlayback.ts`): Manages canvas rendering via `requestAnimationFrame`, handles object-fit cover scaling

### Stage Flow

| Stage | Frames | Behavior |
|-------|--------|----------|
| 0 | 30 | Loop until tap |
| 1 | 60 | Play once, hold |
| 2 | 90 | Play once, hold |
| 3 | 30 | Loop until tap |
| 4 | 90 | Play once, then auto-advance to CTA |
| 5 | - | CTA overlay |

### Loading Strategy

`page.tsx` preloads stages 0-1 before showing content, then background-loads stages 2-4. The `SequencePlayer` is dynamically imported with SSR disabled.

### Sound System

`useSounds.ts` uses Howler.js with stage-mapped sounds:
- Stage 1: lock.mp3
- Stage 2: whoosh.mp3
- Stage 4: fireworks.mp3
- Background: ambient.mp3 (loops)

## Asset Requirements

**Frames**: Place WebP sequences in `public/frames/stage-{0-4}/` named `0001.webp`, `0002.webp`, etc.
- Resolution: 1080x1920 (9:16 portrait)
- Format: WebP quality 85

**Sounds**: Place in `public/sounds/` (ambient.mp3, lock.mp3, whoosh.mp3, fireworks.mp3)

## Key Configuration Files

- `src/lib/constants.ts`: CTA content (header, title, events, button with mailto link), stage labels, color tokens
- `src/lib/frameConfig.ts`: Frame counts per stage (update if your sequences differ)

## Windows Build Notes

Config files use CommonJS format (.js) for Windows compatibility. Do not convert to ESM (.mjs).
