/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */


'use client';

import { motion } from 'framer-motion';

interface GradientBubblesProps {
  variant?: 'default' | 'hero';
}

export default function GradientBubbles({ variant = 'default' }: GradientBubblesProps) {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 top-0 w-[230px] h-[230px] rounded-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, #8f81ee 0%, rgba(106, 92, 216, 0) 100%)',
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute left-14 top-64 w-[45px] h-[45px] rounded-full opacity-40"
          style={{
            background: 'linear-gradient(135deg, #8f81ee 0%, rgba(106, 92, 216, 0) 100%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute right-0 top-0 w-[230px] h-[230px] rounded-full opacity-30 hidden lg:block"
          style={{
            background: 'linear-gradient(135deg, #8f81ee 0%, rgba(106, 92, 216, 0) 100%)',
            transform: 'translate(50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute right-10 top-10 w-[135px] h-[135px] rounded-full"
        style={{
          background: 'linear-gradient(135deg, #8f81ee 0%, rgba(106, 92, 216, 0) 100%)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute left-20 bottom-20 w-[45px] h-[45px] rounded-full"
        style={{
          background: 'linear-gradient(135deg, #8f81ee 0%, rgba(106, 92, 216, 0) 100%)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />
    </div>
  );
}

