/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Global animated bubbles background component with fixed positioning for full-page visual effects
 */

'use client';

import { motion } from 'framer-motion';

export default function GlobalBubblesBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Canvas Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" />

      {/* Animated Floating Bubbles - Large */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/25 to-purple-600/15 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -100, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/25 to-teal-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, -90, 0],
          y: [0, 70, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-40 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-teal-400/25 to-cyan-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.45, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-indigo-400/20 to-purple-400/10 rounded-full blur-3xl"
        animate={{
          x: [0, -70, 0],
          y: [0, 60, 0],
          scale: [1, 1.35, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional smaller bubbles for depth */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-[350px] h-[350px] bg-gradient-to-br from-pink-400/15 to-purple-400/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/20 to-blue-400/10 rounded-full blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

