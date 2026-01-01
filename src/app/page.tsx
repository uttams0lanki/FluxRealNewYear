'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { usePeakStore } from '@/store/peakStore';
import { useSounds } from '@/hooks/useSounds';
import LoadingScreen from '@/components/UI/LoadingScreen';
import Overlay from '@/components/UI/Overlay';
import { preloadStage } from '@/components/SequencePlayer/useFrameLoader';

// Dynamic import for SequencePlayer
const SequencePlayer = dynamic(
  () => import('@/components/SequencePlayer/SequencePlayer'),
  { ssr: false }
);

function PageContent() {
  const searchParams = useSearchParams();
  const setRecipientName = usePeakStore((s) => s.setRecipientName);
  const setLoaded = usePeakStore((s) => s.setLoaded);
  const isLoaded = usePeakStore((s) => s.isLoaded);
  const [showLoading, setShowLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Initialize sounds
  useSounds();
  
  // Extract name from URL params
  useEffect(() => {
    const name = searchParams.get('name');
    if (name) {
      setRecipientName(decodeURIComponent(name));
    }
  }, [searchParams, setRecipientName]);
  
  // Preload frames
  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const MIN_LOADING_TIME = 2500; // Minimum 2.5 seconds to show loading animation

    const loadFrames = async () => {
      // Preload stage 0 first (critical path)
      setLoadProgress(10);
      await preloadStage(0);
      if (!mounted) return;

      setLoadProgress(40);

      // Preload stage 1 (will be needed soon)
      await preloadStage(1);
      if (!mounted) return;

      setLoadProgress(70);

      // Mark as ready
      setLoaded(true);
      setLoadProgress(100);

      // Calculate remaining time to meet minimum loading duration
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

      // Wait for minimum time before hiding loading screen
      setTimeout(() => {
        if (mounted) setShowLoading(false);
      }, remainingTime);

      // Continue preloading remaining stages in background
      preloadStage(2);
      preloadStage(3);
      preloadStage(4);
    };

    loadFrames();

    return () => {
      mounted = false;
    };
  }, [setLoaded]);
  
  return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
      {/* Mobile-locked container - 9:16 aspect ratio on desktop, full screen on mobile */}
      <main
        className="relative bg-[#050505] overflow-hidden touch-none select-none
                   w-full h-full
                   md:w-auto md:h-full md:aspect-[9/16] md:max-h-screen
                   lg:max-w-[500px]"
      >
        {/* Frame Sequence Player */}
        {!showLoading && <SequencePlayer />}

        {/* UI Overlay */}
        {!showLoading && <Overlay />}

        {/* Loading Screen */}
        <AnimatePresence>
          {showLoading && <LoadingScreen progress={loadProgress} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen progress={0} />}>
      <PageContent />
    </Suspense>
  );
}
