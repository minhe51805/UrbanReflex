/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 19-11-2025
 * Description: Reusable feature section component with multiple layout options (default, reversed, map-large) and animated content using Framer Motion
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeatureSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageSide: 'left' | 'right';
  bgColor: string;
  illustration: React.ReactNode;
  customLayout?: 'map-large'; // New prop for custom layouts
}

export default function FeatureSection({
  title,
  description,
  buttonText,
  buttonHref,
  imageSide,
  bgColor,
  illustration,
  customLayout
}: FeatureSectionProps) {
  const isLeft = imageSide === 'left';
  const isMapLarge = customLayout === 'map-large';

  // For map-large layout: map takes 2/3, text panel takes 1/3 - FULL WIDTH NO PADDING
  if (isMapLarge) {
    return (
      <section className="relative w-full">
        <div className="flex flex-col lg:flex-row w-full min-h-[400px] lg:min-h-[500px]">
          {/* Map - 2/3 width, NO padding, edge to edge */}
          <motion.div
            className="w-full lg:w-2/3 h-[300px] lg:h-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {illustration}
          </motion.div>

          {/* Text Panel - 1/3 width, purple background */}
          <motion.div
            className={`w-full lg:w-1/3 ${bgColor} flex flex-col justify-center px-8 lg:px-12 py-12 lg:py-16 text-neutral-soft-900`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-sm lg:text-base opacity-80 mb-6 leading-relaxed">
              {description}
            </p>
            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 text-sm w-fit"
            >
              {buttonText}
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  // Default layout: 50/50 split
  return (
    <section className={`${bgColor} py-16 lg:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text content */}
          <motion.div
            className={`${isLeft ? 'lg:order-2' : 'lg:order-1'}`}
            initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-soft-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-neutral-soft-700 mb-6 max-w-xl">
              {description}
            </p>
            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105"
            >
              {buttonText}
            </Link>
          </motion.div>

          {/* Illustration */}
          <motion.div
            className={`${isLeft ? 'lg:order-1' : 'lg:order-2'}`}
            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {illustration}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

