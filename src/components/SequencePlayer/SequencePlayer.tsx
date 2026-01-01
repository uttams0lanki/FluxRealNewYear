'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePeakStore, Stage } from '@/store/peakStore';
import { useFrameLoader } from './useFrameLoader';
import { useSequencePlayback } from './useSequencePlayback';
import { StageKey } from '@/lib/frameConfig';

export default function SequencePlayer() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const advance = usePeakStore((s) => s.advance);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<StageKey>(
    currentStage < 5 ? (currentStage as StageKey) : 4
  );

  // Load frames for current stage
  const { frames, isLoaded } = useFrameLoader(activeStage);

  // Handle stage completion
  const handleStageComplete = useCallback(() => {
    if (activeStage === 4) {
      // After fireworks, advance to CTA
      setTimeout(() => advance(), 500);
    }
  }, [activeStage, advance]);

  const { canvasRef, play, stop, drawFrame } = useSequencePlayback(
    activeStage,
    frames,
    handleStageComplete,
    containerRef
  );

  // Handle stage changes from store
  useEffect(() => {
    if (currentStage !== activeStage && currentStage < 5) {
      stop();
      setActiveStage(currentStage as StageKey);
    }
  }, [currentStage, activeStage, stop]);

  // Start playback when frames are loaded
  useEffect(() => {
    if (isLoaded && frames.length > 0) {
      // Draw first frame immediately
      drawFrame(0);
      // Start playback after a brief moment
      const timer = setTimeout(() => play(), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, frames, activeStage, play, drawFrame]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Redraw current frame if we have frames
      if (frames.length > 0) {
        drawFrame(0);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
    };
  }, [canvasRef, frames, drawFrame]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: '#050505',
          touchAction: 'none',
        }}
      />
    </div>
  );
}
