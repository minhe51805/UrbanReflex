/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Key features section component showcasing main features with icons and descriptions
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Database, Map, BarChart3, Code } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'One-stop data source',
    description: 'UrbanReflex aggregates data from hundreds of sources worldwide, harmonizing and sharing them on our centralized, trusted, open-source data platform.',
    link: '/about',
    linkText: 'Learn how UrbanReflex works',
  },
  {
    icon: Map,
    title: 'Search for local data',
    description: 'Hundreds of people use UrbanReflex every day. Our interactive map makes it easy to explore and understand global air quality data.',
    link: '/explore',
    linkText: 'Explore the data',
  },
  {
    icon: BarChart3,
    title: 'Air Quality Index Hub',
    description: 'Visit the UrbanReflex AQI Hub to learn about the methodologies different countries use to build their most important air quality communications tool.',
    link: '/aqi-hub',
    linkText: 'Visit the AQI Hub',
  },
  {
    icon: Code,
    title: 'Direct API access',
    description: 'Our open API allows applications to connect directly to UrbanReflex data. One air quality API provides access to hundred of sources.',
    link: '/developers',
    linkText: 'Learn about UrbanReflex API',
  },
];

export default function KeyFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e64ab] to-[#33a3a1] flex items-center justify-center text-white shadow-lg">
                  <feature.icon className="h-8 w-8" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  href={feature.link}
                  className="inline-flex items-center text-[#1e64ab] font-semibold hover:text-[#33a3a1] transition-colors group"
                >
                  {feature.linkText}
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

