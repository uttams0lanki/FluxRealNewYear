'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  progress?: number;
}

export default function LoadingScreen({ progress = 0 }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Ambient glow background */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, rgba(245,166,35,0) 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Logo mark - using actual PNG */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logomark image */}
        <motion.img
          src="/Vertical_Logo_Icon.png"
          alt="Flux Real"
          style={{ width: 80, height: 'auto' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Orbiting particle - around top portion where filled shape is */}
        <motion.div
          className="absolute"
          style={{ top: '30%', left: '50%', marginLeft: -4 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background: '#F5A623',
              boxShadow: '0 0 10px #F5A623, 0 0 20px #F5A623',
              transform: 'translateX(52px)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Brand text - using actual PNG */}
      <motion.img
        src="/Horizontal_Text_Logo.png"
        alt="Flux Real"
        className="mb-10"
        style={{ width: 180, height: 'auto' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />

      {/* Progress bar */}
      <motion.div
        className="relative w-48"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {/* Background track */}
        <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
          {/* Progress fill */}
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #F5A623 0%, #E8883A 100%)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Glowing end cap */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            left: `calc(${progress}% - 3px)`,
            background: '#F5A623',
            boxShadow: '0 0 8px #F5A623, 0 0 16px #F5A623',
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Status text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <motion.p
          className="text-sm tracking-[0.2em] font-light"
          style={{ color: 'rgba(245,213,168,0.6)' }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          INITIALIZING 2026
        </motion.p>
        <p
          className="mt-2 text-xs font-mono"
          style={{ color: 'rgba(245,166,35,0.4)' }}
        >
          {Math.round(progress)}%
        </p>
      </motion.div>

      {/* Decorative lines */}
      <motion.div
        className="absolute bottom-20 left-0 right-0 flex justify-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-8 h-[1px]"
            style={{ background: 'rgba(245,166,35,0.2)' }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
