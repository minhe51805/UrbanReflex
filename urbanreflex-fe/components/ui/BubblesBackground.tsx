/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Animated bubbles background component with floating gradient circles for visual enhancement
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BubblesBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function BubblesBackground({ children, className = '' }: BubblesBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Canvas Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" />
      
      {/* Animated Floating Bubbles */}
      <motion.div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-400/30 to-purple-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-teal-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, -70, 0],
          y: [0, 50, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-teal-400/30 to-cyan-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -60, 0],
          scale: [1, 1.35, 1],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-gradient-to-br from-indigo-400/25 to-purple-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.25, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

