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
import Link from 'next/link';
import { useState } from 'react';
import DotsBackground from '@/components/ui/DotsBackground';
import MapSection from '@/components/home/MapSection';

export default function WhyOpenDataContent() {
  const [copyText, setCopyText] = useState('Copy link');

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopyText('Copied!');
        setTimeout(() => {
          setCopyText('Copy link');
        }, 2000);
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6" aria-label="Breadcrumb">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-primary-500 hover:text-primary-600">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7Z"></path>
            </svg>
          </Link>
          <svg viewBox="0 0 48 48" width="20" height="20" fill="#7e8c9a">
            <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z"></path>
          </svg>
          <span className="text-neutral-soft-600">why open data</span>
        </div>
      </nav>

      {/* Dots Background */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <DotsBackground />
        </div>

        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-8">
              Why open data?
            </h1>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-soft-700 text-base leading-relaxed mb-6">
                UrbanReflex was founded on the principle that people have a <strong>right to know what they are breathing</strong>. We believe everyone should be able to freely access, use, reuse, and redistribute air quality data to make informed decisions about their health and environment.
              </p>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-8">
                Open data has many benefits, including innovation, collaboration and knowledge sharing, equity, improved decision-making, public oversight and accountability, reproducibility and scientific advancement, and efficiency.
              </p>

              {/* Benefits Section */}
              <h2 className="text-2xl font-bold text-primary-600 mt-12 mb-4">
                Benefits of Open Data
              </h2>

              <ul className="space-y-3 mb-8 text-neutral-soft-700 text-base">
                <li>
                  <strong>Innovation:</strong> When data are open, everyone – civil society, government, private sector, academia – can help solve key social challenges.
                </li>
                <li>
                  <strong>Collaboration and knowledge sharing:</strong> Open data facilitates trust-building and knowledge exchange across organizational and geographical boundaries.
                </li>
                <li>
                  <strong>Equity:</strong> Open data access enables marginalized communities to understand and address disparities in their favor.
                </li>
                <li>
                  <strong>Improved decision-making:</strong> Citizens make better-informed choices when grounded in evidence rather than assumptions.
                </li>
                <li>
                  <strong>Public oversight and accountability:</strong> Transparent government data allows citizens to monitor officials and hold them responsible for their actions.
                </li>
                <li>
                  <strong>Reproducibility and scientific advancement:</strong> Open platforms enable verification of research methods and encourage new discoveries through shared data.
                </li>
                <li>
                  <strong>Efficiency:</strong> Open data reduces the time and effort users spend locating and acquiring information.
                </li>
              </ul>

              {/* Image placeholder */}
              <div className="my-8 rounded-2xl overflow-hidden bg-neutral-soft-100 aspect-video flex items-center justify-center">
                <span className="text-neutral-soft-400">Open data visualization</span>
              </div>

              {/* UrbanReflex Mission Section */}
              <h2 className="text-2xl font-bold text-primary-600 mt-12 mb-4">
                UrbanReflex's Mission
              </h2>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-6">
                UrbanReflex aggregates global air quality data sources into a unified, accessible open-source platform designed to support changemakers addressing air inequality.
              </p>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-6">
                Despite the urgency of confronting air pollution, only 61% of governments worldwide produce air quality data, leaving over 1 billion people without access to fundamental information that could protect them from the harmful effects of air pollution.
              </p>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-8">
                Anyone can use the UrbanReflex platform for free to find out what air quality data monitoring is occurring in or near their community and use that information to advocate for increased monitoring where needed and to advocate for air pollution solutions.
              </p>

              {/* How to Use UrbanReflex Section */}
              <h2 className="text-2xl font-bold text-primary-600 mt-12 mb-4">
                How to Use UrbanReflex
              </h2>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-6">
                Anyone can use the data platform or the <Link href="/explore" className="text-primary-500 hover:text-primary-600 underline">UrbanReflex Explorer Tool</Link> for analysis, from basic interpretations to in-depth analyses using the API.
              </p>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-8">
                For organizations deploying air quality monitors, UrbanReflex can ingest and share the data from these projects on the UrbanReflex platform to ensure data is broadly accessible.
              </p>

              {/* Learn More Section */}
              <h2 className="text-2xl font-bold text-primary-600 mt-12 mb-4">
                Learn More
              </h2>

              <p className="text-neutral-soft-700 text-base leading-relaxed mb-12">
                We endorse the <a href="https://opendatacharter.net/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 underline">Open Data Charter</a> principles and promote expanded air quality data accessibility. Learn more about the importance of open data and how it can drive positive change in communities worldwide.
              </p>

              {/* Explore More Button */}
              <div className="mt-12 mb-8">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105"
                >
                  Explore Air Quality Data
                </Link>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-4 py-8 border-t border-neutral-soft-200">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-accent-50 border border-accent-200 rounded-full text-accent-600 font-semibold hover:bg-accent-100 transition-colors"
                >
                  <svg height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                  </svg>
                  {copyText}
                </button>
                <span className="text-neutral-soft-600">Share</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-neutral-soft-200 flex items-center justify-center hover:bg-neutral-soft-50 transition-colors">
                  <svg fill="none" viewBox="0 0 18 18" width="20" height="20">
                    <path fill="#4267b2" d="M17 0H1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.6v-7H7.3V8.3h2.3v-2c0-2.3 1.4-3.6 3.5-3.6l2.1.1v2.5h-1.4c-1.2 0-1.4.5-1.4 1.3v1.7h2.7l-.3 2.7h-2.4v7H17a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1Z" />
                  </svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-neutral-soft-200 flex items-center justify-center hover:bg-neutral-soft-50 transition-colors">
                  <svg fill="none" viewBox="0 0 18 18" width="20" height="20">
                    <path fill="#0a66c2" d="M16.6 0H1.3C.6 0 0 .6 0 1.3v15.3c0 .7.6 1.3 1.4 1.3h15.3c.7 0 1.3-.6 1.3-1.3V1.3c0-.7-.6-1.3-1.4-1.3ZM5.3 15.3H2.7V6.7h2.6v8.6ZM4 5.5C3.3 5.6 2.5 5 2.5 4S3 2.4 4 2.4s1.6.7 1.6 1.6c0 .9-.7 1.5-1.5 1.5Zm11.4 9.7h-2.7V11c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H7.2V6.8h2.5v1a3 3 0 0 1 2.6-1.3c2.7 0 3.3 1.8 3.3 4v4.7h-.1Z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Map Explorer Section */}
      <div className="w-full h-52 overflow-hidden">
        <div className="w-full h-[600px] scale-[0.35] origin-top-left" style={{ width: '285.7%' }}>
          <MapSection />
        </div>
      </div>
    </div>
  );
}
