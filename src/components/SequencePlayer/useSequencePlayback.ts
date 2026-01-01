'use client';

import { useRef, useCallback, useEffect, RefObject } from 'react';
import { FRAME_CONFIG, StageKey } from '@/lib/frameConfig';

interface PlaybackState {
  currentFrame: number;
  isPlaying: boolean;
}

export function useSequencePlayback(
  stage: StageKey,
  frames: HTMLImageElement[],
  onComplete?: () => void,
  containerRef?: RefObject<HTMLDivElement>
) {
  const stateRef = useRef<PlaybackState>({ currentFrame: 0, isPlaying: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const stageRef = useRef<StageKey>(stage);

  // Keep stage ref updated
  stageRef.current = stage;

  const getConfig = useCallback(() => FRAME_CONFIG[stageRef.current], []);
  const frameDuration = 1000 / FRAME_CONFIG[stage].fps;

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const frame = frames[frameIndex];
    const container = containerRef?.current;

    if (canvas && ctx && frame && frame.complete && frame.naturalWidth > 0) {
      // Use container dimensions if available, otherwise window
      const logicalWidth = container ? container.clientWidth : window.innerWidth;
      const logicalHeight = container ? container.clientHeight : window.innerHeight;

      // Calculate scaling to cover the canvas (like object-fit: cover)
      const canvasRatio = logicalWidth / logicalHeight;
      const frameRatio = frame.naturalWidth / frame.naturalHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (canvasRatio > frameRatio) {
        // Canvas is wider than frame
        drawWidth = logicalWidth;
        drawHeight = logicalWidth / frameRatio;
        offsetX = 0;
        offsetY = (logicalHeight - drawHeight) / 2;
      } else {
        // Canvas is taller than frame
        drawHeight = logicalHeight;
        drawWidth = logicalHeight * frameRatio;
        offsetX = (logicalWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);
      ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [frames, containerRef]);

  const animate = useCallback((timestamp: number) => {
    if (!stateRef.current.isPlaying) return;

    const config = getConfig();
    const elapsed = timestamp - lastTimeRef.current;

    if (elapsed >= frameDuration) {
      lastTimeRef.current = timestamp - (elapsed % frameDuration);

      const { currentFrame } = stateRef.current;
      drawFrame(currentFrame);

      const nextFrame = currentFrame + 1;

      if (nextFrame >= config.count) {
        if (config.loop) {
          stateRef.current.currentFrame = 0;
        } else {
          stateRef.current.isPlaying = false;
          // Keep last frame visible
          drawFrame(config.count - 1);
          onComplete?.();
          return;
        }
      } else {
        stateRef.current.currentFrame = nextFrame;
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [getConfig, frameDuration, drawFrame, onComplete]);

  const play = useCallback(() => {
    stateRef.current = { currentFrame: 0, isPlaying: true };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    stateRef.current.isPlaying = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const pause = useCallback(() => {
    stateRef.current.isPlaying = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (!stateRef.current.isPlaying) {
      stateRef.current.isPlaying = true;
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { canvasRef, play, stop, pause, resume, drawFrame };
}
