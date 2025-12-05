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
import { LucideIcon } from 'lucide-react';
import DotsBackground from './DotsBackground';

interface PageHeroProps {
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function PageHero({ icon: Icon, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative bg-white py-20 overflow-hidden min-h-[400px]">
      <div className="absolute inset-0">
        <DotsBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {Icon && (
            <Icon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-[#1e64ab]" />
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#30363c] mb-6">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

