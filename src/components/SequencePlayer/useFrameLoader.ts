'use client';

import { useState, useEffect, useCallback } from 'react';
import { FRAME_CONFIG, StageKey, getFramePath } from '@/lib/frameConfig';

interface UseFrameLoaderResult {
  frames: HTMLImageElement[];
  isLoaded: boolean;
  progress: number;
}

// Cache for loaded frames across stages
const frameCache = new Map<string, HTMLImageElement[]>();

export function useFrameLoader(stage: StageKey): UseFrameLoaderResult {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cacheKey = `stage-${stage}`;
    
    // Check cache first
    if (frameCache.has(cacheKey)) {
      setFrames(frameCache.get(cacheKey)!);
      setIsLoaded(true);
      setProgress(100);
      return;
    }

    const config = FRAME_CONFIG[stage];
    let loadedCount = 0;
    setIsLoaded(false);
    setProgress(0);

    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = getFramePath(stage, index);
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / config.count) * 100));
          resolve(img);
        };
        img.onerror = () => {
          // On error, still resolve with a placeholder to prevent blocking
          console.warn(`Failed to load frame ${index} for stage ${stage}`);
          loadedCount++;
          setProgress(Math.round((loadedCount / config.count) * 100));
          resolve(img); // Resolve anyway to not block
        };
      });
    };

    Promise.all(
      Array.from({ length: config.count }, (_, i) => loadFrame(i))
    ).then((images) => {
      frameCache.set(cacheKey, images);
      setFrames(images);
      setIsLoaded(true);
    });
  }, [stage]);

  return { frames, isLoaded, progress };
}

// Preload frames for a specific stage
export function preloadStage(stage: StageKey): Promise<void> {
  const cacheKey = `stage-${stage}`;
  
  if (frameCache.has(cacheKey)) {
    return Promise.resolve();
  }

  const config = FRAME_CONFIG[stage];
  
  return new Promise((resolve) => {
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((res) => {
        const img = new Image();
        img.src = getFramePath(stage, index);
        img.onload = () => res(img);
        img.onerror = () => res(img);
      });
    };

    Promise.all(
      Array.from({ length: config.count }, (_, i) => loadFrame(i))
    ).then((images) => {
      frameCache.set(cacheKey, images);
      resolve();
    });
  });
}

// Preload all stages in background
export function preloadAllStages(onProgress?: (stage: number) => void): Promise<void> {
  const stages: StageKey[] = [0, 1, 2, 3, 4];
  
  return stages.reduce((promise, stage, index) => {
    return promise.then(() => {
      onProgress?.(index);
      return preloadStage(stage);
    });
  }, Promise.resolve());
}
