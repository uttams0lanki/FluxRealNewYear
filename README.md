# Project Peak - Flux Real 2026 (WebP Sequence Edition)

An interactive New Year experience using WebP frame sequences for smooth, controlled playback.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

## Test Personalization

```
http://localhost:3000/?name=Ahmed
http://localhost:3000/?name=Sarah
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Metadata & fonts
│   └── globals.css           # Tailwind + custom styles
├── components/
│   ├── SequencePlayer/
│   │   ├── SequencePlayer.tsx    # Canvas frame renderer
│   │   ├── useFrameLoader.ts     # Preload frames
│   │   └── useSequencePlayback.ts # Playback control
│   └── UI/
│       ├── Overlay.tsx           # Stage labels, CTA
│       └── LoadingScreen.tsx
├── store/
│   └── peakStore.ts              # Zustand state
├── lib/
│   ├── constants.ts              # Colors, messages, CTAs
│   └── frameConfig.ts            # Frame counts per stage
└── hooks/
    └── useSounds.ts              # Audio management
```

## Adding Your Frames

Place WebP sequences in `public/frames/`:

```
public/frames/
├── stage-0/    # 30 frames (looping pulse)
│   ├── 0001.webp
│   ├── 0002.webp
│   └── ...
├── stage-1/    # 60 frames (foundation)
├── stage-2/    # 90 frames (ascent)
├── stage-3/    # 30 frames (summit loop)
└── stage-4/    # 90 frames (fireworks)
```

### Frame Specs
- **Resolution:** 1080 x 1920 (9:16 portrait)
- **Format:** WebP, quality 85
- **Naming:** 0001.webp, 0002.webp, etc.

### Convert PNG to WebP
```bash
# Install cwebp: brew install webp
for f in *.png; do cwebp -q 85 "$f" -o "${f%.png}.webp"; done
```

## Stage Flow

| Stage | Frames | Behavior | Label |
|-------|--------|----------|-------|
| 0 | 30 | Loop | BEGIN 2026 |
| 1 | 60 | Play once | ALIGN VISION |
| 2 | 90 | Play once | ACCELERATE GROWTH |
| 3 | 30 | Loop | LAUNCH TOGETHER |
| 4 | 90 | Play once | (fireworks) |
| 5 | - | CTA overlay | - |

## Customize

1. **CTA Links** → `src/lib/constants.ts`
2. **Frame Counts** → `src/lib/frameConfig.ts`
3. **Messages** → `src/lib/constants.ts`
4. **Sounds** → `public/sounds/`

## Sound Files Needed

Place in `public/sounds/`:
- `ambient.mp3` - Background loop
- `lock.mp3` - Stage 1 transition
- `whoosh.mp3` - Stage 2 ascending
- `fireworks.mp3` - Stage 4 celebration

## Deploy

```bash
# Vercel (recommended)
vercel --prod

# Or Netlify
npm run build
# Deploy .next folder
```

## Placeholder Frames (Dev Only)

If you don't have frames yet, the player will still work but show empty canvas. Create test frames:

```javascript
// Run in browser console to generate test frames
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 1920;
const ctx = canvas.getContext('2d');

for (let i = 0; i < 30; i++) {
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = '#FFD700';
  ctx.font = '120px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${i + 1}`, 540, 960);
  console.log(`Frame ${i + 1}: Right-click to save`);
  // Save each manually or use FileSaver.js
}
```

---

Built with ❤️ by Flux Real
