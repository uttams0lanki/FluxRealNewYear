'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePeakStore } from '@/store/peakStore';
import { CTA, STAGE_LABELS, TIMING } from '@/lib/constants';

// Stage label display
function StageLabel() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const label = STAGE_LABELS[currentStage];

  if (currentStage >= 5 || !label) return null;

  // Split label into words for staggered animation
  const words = label.split(' ');

  return (
    <motion.div
      key={currentStage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-1/3 left-8 md:left-12 text-left pointer-events-none"
    >
      <div className="flex flex-col gap-1">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {word}
          </motion.span>
        ))}
      </div>
      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="h-[2px] w-16 bg-gradient-to-r from-yellow-400 to-transparent mt-4 origin-left"
      />
    </motion.div>
  );
}

// Swipe slider component
function SwipeSlider({ onComplete }: { onComplete: () => void }) {
  const currentStage = usePeakStore((s) => s.currentStage);
  const [isComplete, setIsComplete] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const sliderWidth = 240;
  const thumbSize = 56;
  const maxDrag = sliderWidth - thumbSize - 8;

  // Transforms based on drag position
  const progress = useTransform(x, [0, maxDrag], [0, 1]);
  const trackOpacity = useTransform(x, [0, maxDrag * 0.5, maxDrag], [0.3, 0.5, 0.8]);
  const thumbScale = useTransform(x, [0, maxDrag], [1, 1.1]);
  const glowIntensity = useTransform(x, [0, maxDrag], [0, 1]);
  const progressWidth = useTransform(x, [0, maxDrag], ['0%', '100%']);

  // Reset when stage changes
  useEffect(() => {
    setIsComplete(false);
    animate(x, 0, { duration: 0.3 });
  }, [currentStage, x]);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= maxDrag * 0.85) {
      // Complete the slide
      setIsComplete(true);
      animate(x, maxDrag, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          // Haptic feedback
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([20, 50, 20]);
          }
          setTimeout(onComplete, 200);
        }
      });
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
    }
  };

  if (currentStage >= 4) return null;

  return (
    <motion.div
      className="absolute bottom-16 left-8 md:left-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      {/* Backdrop for readability on bright backgrounds */}
      <motion.div
        className="absolute -inset-4 -top-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.4) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Label */}
      <motion.p
        className="relative text-xs tracking-[0.2em] mb-3 font-medium"
        style={{
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {currentStage === 0 ? 'SLIDE TO BEGIN' : 'SLIDE TO CONTINUE'}
      </motion.p>

      {/* Slider track */}
      <div
        ref={constraintsRef}
        className="relative h-14 rounded-full overflow-hidden"
        style={{
          width: sliderWidth,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: progressWidth,
            background: 'linear-gradient(90deg, rgba(245,166,35,0.1) 0%, rgba(245,166,35,0.3) 100%)',
            opacity: trackOpacity,
          }}
        />

        {/* Animated hint arrows */}
        <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-sm"
              style={{ color: 'rgba(245,166,35,0.3)', marginRight: i < 2 ? -4 : 0 }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                x: [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              ›
            </motion.span>
          ))}
        </div>

        {/* Draggable thumb */}
        <motion.div
          className="absolute top-1 left-1 cursor-grab active:cursor-grabbing"
          style={{
            x,
            width: thumbSize,
            height: thumbSize - 8,
            scale: thumbScale,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.05}
          onDragEnd={handleDragEnd}
        >
          {/* Thumb glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(245,166,35,0.4) 0%, transparent 70%)',
              opacity: glowIntensity,
              scale: 1.5,
            }}
          />

          {/* Thumb button */}
          <motion.div
            className="relative w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #F5A623 0%, #E8883A 100%)',
              boxShadow: '0 4px 20px rgba(245,166,35,0.4)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-lg font-bold"
              style={{ color: '#050505' }}
              animate={!isComplete ? { x: [0, 3, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}

// Final CTA screen
function CTAOverlay() {
  const currentStage = usePeakStore((s) => s.currentStage);

  if (currentStage !== 5) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Flux Real 2026',
          text: 'Check out this interactive New Year experience!',
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  // Smooth easing curve
  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
    >
      <div className="max-w-lg">
        {/* Header with reveal animation */}
        <div className="overflow-hidden mb-6">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="flex items-center gap-3"
          >
            <span
              className="text-sm md:text-base font-semibold tracking-[0.25em]"
              style={{ color: '#F5D5A8' }}
            >
              FLUX REAL
            </span>
            <span style={{ color: 'rgba(245,166,35,0.4)' }}>{'//'}</span>
            <span
              className="text-sm md:text-base font-light tracking-[0.2em]"
              style={{ color: '#F5A623' }}
            >
              H1 2026
            </span>
          </motion.div>
        </div>

        {/* Animated accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: smoothEase }}
          className="h-px w-24 mb-10 origin-left"
          style={{ background: 'linear-gradient(90deg, #F5A623 0%, transparent 100%)' }}
        />

        {/* Main title with character stagger */}
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: smoothEase }}
            className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white leading-[1.2] tracking-tight"
          >
            Conversational AI Agents
            <br />
            <span className="font-light">&amp; The Future of</span>{' '}
            <span style={{ color: '#F5A623' }}>UX</span>
          </motion.h1>
        </div>

        {/* Events with staggered reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-10 space-y-3"
        >
          {CTA.events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1, ease: smoothEase }}
              className="flex items-center gap-3 text-sm md:text-base"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F5A623' }} />
              <span className="text-white/80 font-light">{event.name}</span>
              <span style={{ color: 'rgba(245,166,35,0.3)' }}>—</span>
              <span className="text-white/50">{event.location}</span>
              <span style={{ color: 'rgba(245,166,35,0.3)' }}>—</span>
              <span style={{ color: '#F5A623' }} className="font-medium">{event.dates}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <div className="overflow-hidden mb-8">
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: smoothEase }}
            className="text-base md:text-lg tracking-[0.15em] font-light"
            style={{ color: 'rgba(245,213,168,0.7)' }}
          >
            {CTA.tagline}
          </motion.p>
        </div>

        {/* CTA statement */}
        <div className="overflow-hidden mb-10">
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease: smoothEase }}
            className="text-xl md:text-2xl font-semibold tracking-[0.1em]"
            style={{
              color: '#F5A623',
              textShadow: '0 0 40px rgba(245,166,35,0.3)',
            }}
          >
            {CTA.cta}
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: smoothEase }}
        >
          <motion.a
            href={CTA.button.url}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm md:text-base font-semibold tracking-[0.1em] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #F5A623 0%, #E8883A 100%)',
              color: '#050505',
              boxShadow: '0 4px 30px rgba(245,166,35,0.3)',
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 8px 40px rgba(245,166,35,0.5)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {CTA.button.text}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Share button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-6"
          >
            <motion.button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm tracking-wider transition-all duration-300"
              style={{ color: 'rgba(245,213,168,0.5)' }}
              whileHover={{ color: 'rgba(245,213,168,0.8)', x: 4 }}
            >
              <span>Share experience</span>
              <span>↗</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-8 md:left-16 text-xs tracking-[0.2em]"
        style={{ color: 'rgba(245,166,35,0.3)' }}
      >
        © 2026 FLUX REAL
      </motion.div>
    </motion.div>
  );
}

// Sound toggle
function SoundToggle() {
  const soundEnabled = usePeakStore((s) => s.soundEnabled);
  const toggleSound = usePeakStore((s) => s.toggleSound);
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSound();
      }}
      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center
                 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
      aria-label={soundEnabled ? 'Mute' : 'Unmute'}
    >
      <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
    </button>
  );
}

// Main overlay container
export default function Overlay() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const advance = usePeakStore((s) => s.advance);

  // Auto-advance from stage 4 to 5 after animation completes
  useEffect(() => {
    if (currentStage === 4) {
      const timer = setTimeout(() => {
        advance();
      }, TIMING.autoAdvanceDelay + 3000); // Wait for fireworks + delay
      return () => clearTimeout(timer);
    }
  }, [currentStage, advance]);

  return (
    <div className="absolute inset-0 z-10">
      <SoundToggle />

      <AnimatePresence mode="wait">
        <StageLabel key={`label-${currentStage}`} />
      </AnimatePresence>

      <SwipeSlider onComplete={advance} />
      <CTAOverlay />
    </div>
  );
}
