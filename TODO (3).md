# Project Peak TODO
## Flux Real 2026 New Year Experience

**Target Launch:** Today (December 30, 2024)  
**Status:** 🟡 In Progress

---

## 🎯 Quick Reference

| Stage | Frames Needed | Duration | Behavior |
|-------|---------------|----------|----------|
| 0 | 30 | 1s | Loop (pulsing core) |
| 1 | 60 | 2s | Play once (foundation) |
| 2 | 90 | 3s | Play once (tower rise) |
| 3 | 30 | 1s | Loop (summit idle) |
| 4 | 90 | 3s | Play once (fireworks) |

**Total frames needed:** 300  
**Frame spec:** 1080×1920 WebP @ 85% quality

---

## Phase 1: Project Setup ⏱️ ~10 min

- [ ] Unzip `project-peak-webp.zip`
- [ ] `cd project-peak-webp`
- [ ] `npm install`
- [ ] `npm run dev` — verify it runs (will show black canvas without frames)
- [ ] Open `http://localhost:3000` in browser
- [ ] Test tap interaction (should advance stages even without frames)

---

## Phase 2: Asset Creation ⏱️ ~2-3 hours

### 2.1 Frame Sequence Creation

Choose your tool and create the animation:

#### Option A: After Effects (Recommended)
- [ ] Create new composition: 1080×1920, 30fps
- [ ] Design Stage 0: Pulsing golden core/torus on dark background
  - 30 frames, seamless loop
  - Subtle fog/particles
- [ ] Design Stage 1: Foundation grid materializes
  - 60 frames
  - Wireframe edges "draw on" from center
- [ ] Design Stage 2: Tower ascent
  - 90 frames
  - Vertical structure rises floor by floor
  - Energy trails, speed lines
- [ ] Design Stage 3: Summit idle
  - 30 frames, seamless loop
  - Complete tower with subtle ambient movement
- [ ] Design Stage 4: Fireworks celebration
  - 90 frames
  - Particle explosions from apex
  - Full tower illumination
- [ ] Export each stage as PNG sequence
- [ ] Convert to WebP (see conversion commands below)

#### Option B: Blender
- [ ] Model simple wireframe tower geometry
- [ ] Set up camera animation path
- [ ] Create material with emission for glow effect
- [ ] Render each stage as PNG sequence
- [ ] Convert to WebP

#### Option C: Cavalry / Fable / Motion Graphics Tool
- [ ] Design vector-based wireframe tower
- [ ] Animate build sequence
- [ ] Export as image sequence
- [ ] Convert to WebP

#### Option D: Figma + Plugins
- [ ] Design keyframes in Figma
- [ ] Use Figmotion or similar for tweening
- [ ] Export frames
- [ ] Convert to WebP

### 2.2 Frame Conversion

```bash
# Install cwebp (if not installed)
# Mac: brew install webp
# Linux: apt install webp
# Windows: download from https://developers.google.com/speed/webp/download

# Navigate to your PNG export folder
cd /path/to/stage-0-pngs

# Convert all PNGs to WebP
for f in *.png; do cwebp -q 85 "$f" -o "${f%.png}.webp"; done

# Rename to sequential numbering if needed
# (ensure files are named 0001.webp, 0002.webp, etc.)
```

### 2.3 Frame Organization

- [ ] Create folder structure in project:
  ```
  public/frames/
  ├── stage-0/
  ├── stage-1/
  ├── stage-2/
  ├── stage-3/
  └── stage-4/
  ```
- [ ] Copy Stage 0 WebP files (0001.webp - 0030.webp) to `public/frames/stage-0/`
- [ ] Copy Stage 1 WebP files (0001.webp - 0060.webp) to `public/frames/stage-1/`
- [ ] Copy Stage 2 WebP files (0001.webp - 0090.webp) to `public/frames/stage-2/`
- [ ] Copy Stage 3 WebP files (0001.webp - 0030.webp) to `public/frames/stage-3/`
- [ ] Copy Stage 4 WebP files (0001.webp - 0090.webp) to `public/frames/stage-4/`

### 2.4 Verify Frame Counts

If your frame counts differ from the defaults, update `src/lib/frameConfig.ts`:

```typescript
export const FRAME_CONFIG = {
  0: { folder: 'stage-0', count: YOUR_COUNT, loop: true, fps: 30 },
  1: { folder: 'stage-1', count: YOUR_COUNT, loop: false, fps: 30 },
  // etc.
};
```

- [ ] Update frame counts if different from defaults
- [ ] Verify FPS matches your export (default: 30)

---

## Phase 3: Sound Design ⏱️ ~30 min

### 3.1 Source Sound Files

Download from [Freesound.org](https://freesound.org) or create:

- [ ] **ambient.mp3** — Low ambient drone/hum
  - Search: "ambient drone dark cinematic"
  - ~30 seconds, will loop
  - Target: <500KB
  
- [ ] **lock.mp3** — Mechanical/structural sound
  - Search: "mechanical lock click futuristic"
  - ~1-2 seconds
  - Target: <100KB
  
- [ ] **whoosh.mp3** — Rising/ascending sound
  - Search: "whoosh rise cinematic"
  - ~2-3 seconds
  - Target: <150KB
  
- [ ] **fireworks.mp3** — Celebration burst
  - Search: "fireworks burst explosion"
  - ~3-4 seconds
  - Target: <200KB

### 3.2 Audio Processing

- [ ] Normalize volume levels across all files
- [ ] Convert to MP3 if needed (128kbps is fine)
- [ ] Trim silence from start/end
- [ ] Test that ambient loops seamlessly

### 3.3 Add to Project

- [ ] Copy `ambient.mp3` to `public/sounds/`
- [ ] Copy `lock.mp3` to `public/sounds/`
- [ ] Copy `whoosh.mp3` to `public/sounds/`
- [ ] Copy `fireworks.mp3` to `public/sounds/`

---

## Phase 4: Branding & Content ⏱️ ~20 min

### 4.1 Update CTA Links

Edit `src/lib/constants.ts`:

- [ ] Update primary CTA URL (Calendly or contact link)
  ```typescript
  primary: {
    text: 'SCHEDULE A 2026 SYNC',
    url: 'YOUR_CALENDLY_LINK_HERE',
  },
  ```
- [ ] Update secondary CTA URL (roadmap or website)
  ```typescript
  secondary: {
    text: 'View the 2026 Roadmap →',
    url: 'YOUR_ROADMAP_LINK_HERE',
  },
  ```

### 4.2 Update Messages (Optional)

Edit `src/lib/constants.ts` if you want different copy:

- [ ] Review/edit personalized heading
- [ ] Review/edit personalized subheading
- [ ] Review/edit default heading
- [ ] Review/edit default subheading

### 4.3 Add Logo

- [ ] Create/export Flux Real logo as SVG
- [ ] Replace text logo in `src/components/UI/Overlay.tsx` (search for "FLUX REAL")
- [ ] Alternative: Keep text logo, just verify brand colors

### 4.4 Create OG Image

For social media link previews:

- [ ] Create 1200×630 image with:
  - Dark background (#050505)
  - Tower visual or brand imagery
  - "Flux Real 2026" text
  - Gold accent colors
- [ ] Export as `og-image.png`
- [ ] Place in `public/og-image.png`

### 4.5 Favicon (Optional)

- [ ] Create 32×32 favicon
- [ ] Add to `public/favicon.ico`

---

## Phase 5: Testing ⏱️ ~30 min

### 5.1 Desktop Testing

- [ ] Chrome — Full experience
- [ ] Firefox — Full experience
- [ ] Safari — Full experience
- [ ] Edge — Full experience

### 5.2 Mobile Testing (Critical!)

- [ ] iOS Safari — This is the most restrictive browser
  - [ ] Verify frames load and play
  - [ ] Verify tap advances stages
  - [ ] Verify swipe up advances stages
  - [ ] Verify sound toggle works
  - [ ] Verify CTA buttons work
  - [ ] Verify share button works
  
- [ ] Chrome Android
  - [ ] Same checks as iOS

### 5.3 Interaction Testing

- [ ] Tap to advance (stages 0-3)
- [ ] Swipe up to advance
- [ ] Scroll to advance (desktop)
- [ ] Sound toggle on/off
- [ ] Haptic feedback (mobile)

### 5.4 Personalization Testing

- [ ] `http://localhost:3000/` — Default message
- [ ] `http://localhost:3000/?name=Ahmed` — Personalized message
- [ ] `http://localhost:3000/?name=Test%20Name` — Name with space

### 5.5 Performance Testing

- [ ] Check loading time (target: <3s for first frame)
- [ ] Check frame rate (target: smooth 30fps)
- [ ] Check memory usage (target: <200MB)
- [ ] Test on slow connection (throttle in DevTools)

### 5.6 Edge Cases

- [ ] Refresh mid-experience — Should restart from beginning
- [ ] Rotate device — Should resize properly
- [ ] Background/foreground app — Should resume correctly

---

## Phase 6: Deployment ⏱️ ~15 min

### 6.1 Pre-Deploy Checklist

- [ ] All frames in place
- [ ] All sounds in place
- [ ] CTA links updated
- [ ] OG image added
- [ ] Tested on mobile

### 6.2 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Test preview URL thoroughly!

# Deploy production
vercel --prod
```

- [ ] Run `vercel` for preview deploy
- [ ] Test preview URL on mobile
- [ ] Run `vercel --prod` for production
- [ ] Note production URL

### 6.3 Alternative: Deploy to Netlify

```bash
# Build
npm run build

# Using Netlify CLI
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=.next
```

### 6.4 Custom Domain (Optional)

- [ ] Add custom domain in Vercel/Netlify dashboard
- [ ] Update DNS records
- [ ] Verify SSL certificate
- [ ] Test: `https://peak.fluxreal.com` (or your domain)

---

## Phase 7: Launch ⏱️ ~30 min

### 7.1 Final Verification

- [ ] Test production URL on desktop
- [ ] Test production URL on mobile (iOS Safari!)
- [ ] Test personalized URL
- [ ] Verify OG image shows in link preview (paste URL in Slack/Twitter)

### 7.2 Prepare Recipient List

Create tracking spreadsheet:

| Name | Company | URL | Sent | Opened | CTA Clicked |
|------|---------|-----|------|--------|-------------|
| Ahmed K. | Emaar | `?name=Ahmed` | ☐ | ☐ | ☐ |
| Sarah M. | DAMAC | `?name=Sarah` | ☐ | ☐ | ☐ |
| ... | ... | ... | ... | ... | ... |

- [ ] List all recipients
- [ ] Generate personalized URLs
- [ ] Prepare email/message copy

### 7.3 Send to Recipients

Use the email template from the original brief:

```
Subject: 2026: The view from the top.

Hi [Name],

Great landmarks aren't just built—they are engineered with 
vision and scaled with purpose.

At Flux Real, we spent 2025 laying the foundation. For 2026, 
we've built something to help us visualize the ascent ahead.

I'd love for you to take 30 seconds on your mobile to 
initialize our 2026 launch sequence:

[YOUR_PERSONALIZED_LINK]
(Open on mobile for the full experience)

Let's reach the peak together.

Best,
[Your Name]
Flux Real
```

- [ ] Send test email to yourself
- [ ] Verify link works
- [ ] Send to recipient list
- [ ] Track sends

### 7.4 Social Media Post (Optional)

```
2025 was the foundation. 2026 is the ascent. 🚀

At Flux Real, we believe vision without velocity is just a dream. 
We've built a mobile-first interactive experience to kick off the 
new year—an architectural look at where we're headed.

Click through to initialize the launch sequence. 3 clicks to the peak.

[LINK]

#FluxReal #ProjectPeak #2026Vision
```

- [ ] Post on LinkedIn
- [ ] Post on Twitter/X
- [ ] Post on Instagram (if applicable)

---

## Phase 8: Post-Launch

### 8.1 Monitor

- [ ] Check Vercel/Netlify analytics
- [ ] Track CTA clicks (if using analytics)
- [ ] Collect feedback from recipients

### 8.2 Iterate (If Time Permits)

- [ ] Fix any reported bugs
- [ ] Adjust timing if needed
- [ ] Update copy based on feedback

---

## 🚨 Troubleshooting

### Frames Not Loading
- Check file names are exactly `0001.webp`, `0002.webp`, etc.
- Check files are in correct folders
- Check frame count in `frameConfig.ts` matches actual files
- Check browser console for 404 errors

### Black Screen on Mobile
- Ensure canvas is using correct dimensions
- Check for JavaScript errors in console
- Try clearing cache and reload

### Sound Not Playing
- Sound requires user interaction first (browser policy)
- Check sound files exist in `public/sounds/`
- Check volume isn't 0

### Slow Loading
- Compress WebP files more aggressively (quality 75-80)
- Reduce frame count if possible
- Check total asset size (<15MB ideal)

### Gestures Not Working
- Ensure no elements are blocking touch events
- Check `touch-action: none` is set
- Verify event listeners are attached

---

## 📊 Success Metrics to Track

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Completion rate | >70% | Analytics: stage 4 reached |
| Session duration | >45s | Analytics: time on page |
| CTA clicks | >25% | Link tracking |
| Shares | >15% | Share API or social mentions |

---

## 📁 Final File Structure

```
project-peak-webp/
├── public/
│   ├── frames/
│   │   ├── stage-0/ (30 webp files)
│   │   ├── stage-1/ (60 webp files)
│   │   ├── stage-2/ (90 webp files)
│   │   ├── stage-3/ (30 webp files)
│   │   └── stage-4/ (90 webp files)
│   ├── sounds/
│   │   ├── ambient.mp3
│   │   ├── lock.mp3
│   │   ├── whoosh.mp3
│   │   └── fireworks.mp3
│   ├── og-image.png
│   └── favicon.ico
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── store/
└── [config files]
```

---

## ✅ Launch Checklist Summary

Before sending to anyone:

- [ ] Frames render correctly
- [ ] All 5 stages work
- [ ] Sound works when enabled
- [ ] CTA links work
- [ ] Mobile experience is smooth
- [ ] Personalization works
- [ ] Production URL is live
- [ ] OG image shows in previews

---

**Good luck with the launch! 🚀**

*Last updated: December 30, 2024*
