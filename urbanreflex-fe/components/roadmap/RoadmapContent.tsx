/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Roadmap content component displaying project development timeline and milestones with interactive features
 */

'use client';

import { motion } from 'framer-motion';
import { Github, MessageSquare, Share2, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import DotsBackground from '../ui/DotsBackground';

export default function RoadmapContent() {
  const [copyText, setCopyText] = useState('Copy link');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy link'), 2000);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Dots Background */}
      <div className="absolute inset-0">
        <DotsBackground />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-8"
        >
          <span className="text-[#33a3a1]">developers</span>
          <span className="mx-2">/</span>
          <span>roadmap</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-[#1e64ab] mb-8"
        >
          2025 Tech Roadmap
        </motion.h1>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-gray-700 text-base leading-relaxed">
            The OpenAQ governing board and team developed core strategic objectives to guide the organization as shown in our{' '}
            <a href="/about" className="text-[#1e64ab] underline hover:text-[#33a3a1]">
              OpenAQ 2022-2025 strategic direction
            </a>
          </p>

          <p className="text-gray-700 text-base leading-relaxed mt-6">
            Three core objectives drive the technical direction of the OpenAQ platform:
          </p>

          <ul className="list-disc pl-6 mt-4 space-y-3 text-gray-700 text-base">
            <li>Make air quality data universally accessible and equip stakeholders with tools to use it</li>
            <li>Maintain and strategically increase the amount and types of data on our platform</li>
            <li>Spur greater use of air quality data by introducing potential users to the platform and how it can be used</li>
          </ul>
        </motion.div>

        {/* Roadmap Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#1e64ab] mb-8">Roadmap for 2025</h2>

          {/* Section 1: Tools */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-[#1e64ab] mb-4">1 Tools</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base">
              <li>Release an official R package for the OpenAQ API.</li>
              <li>Release new features for common use-cases into OpenAQ Python SDK.</li>
              <li>Release new features for common use-cases into OpenAQ CLI.</li>
            </ul>
          </div>

          {/* Section 2: Data coverage */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-[#1e64ab] mb-4">2 Data coverage</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base">
              <li>Develop and release an upload tool to more easily allow contributions from small projects.</li>
              <li>
                Acquire new and regain lost government-produced data, prioritizing:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>India</li>
                  <li>Brazil</li>
                  <li>South Africa</li>
                  <li>Türkiye</li>
                </ul>
              </li>
              <li>Fill in historical gaps across geographies, where possible.</li>
            </ul>
          </div>

          {/* Section 3: Outreach */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-[#1e64ab] mb-4">3 Outreach and Documentation</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Improve documentation sites (API documentations site, Python documentation, R documentation and CLI documentation) with more examples of how to use the platform for common use cases.
            </p>
          </div>

          <hr className="border-0 border-b border-dashed border-gray-300 my-10" />

          {/* Footer note */}
          <p className="text-gray-700 text-base leading-relaxed mb-8">
            This roadmap was largely informed by the OpenAQ community through outreach and the results of our Community Survey. To keep up with OpenAQ news sign up for our{' '}
            <a href="#newsletter" className="text-[#1e64ab] underline hover:text-[#33a3a1]">
              quarterly newsletter
            </a>
            {' '}and make your voice heard by participating in upcoming community surveys.
          </p>

          {/* Social Share Buttons */}
          <div className="flex gap-3 mb-12">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-6 py-2 bg-[#e6f8f8] border border-[#b0e8e6] text-[#33a3a1] rounded-full font-bold hover:bg-[#b0e8e6] transition-colors"
            >
              <LinkIcon className="h-4 w-4" />
              {copyText}
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Call to Action Cards */}
          <div className="space-y-6">
            {/* GitHub */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-700 text-base mb-4">
                    Follow and contribute to our work on GitHub.
                  </p>
                </div>
                <a
                  href="https://github.com/openaq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-[#e6f8f8] border border-[#b0e8e6] text-[#33a3a1] rounded-full font-bold hover:bg-[#b0e8e6] transition-colors whitespace-nowrap ml-4"
                >
                  <Github className="h-4 w-4" />
                  Follow
                </a>
              </div>
            </div>

            {/* Slack */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-700 text-base mb-4">
                    Participate in the OpenAQ clean air community on Slack
                  </p>
                </div>
                <a
                  href="https://join.slack.com/t/openaq/shared_invite/zt-yzqlgsva-v6McumTjy2BZnegIK9XCVw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-[#e6f8f8] border border-[#b0e8e6] text-[#33a3a1] rounded-full font-bold hover:bg-[#b0e8e6] transition-colors whitespace-nowrap ml-4"
                >
                  <MessageSquare className="h-4 w-4" />
                  Join
                </a>
              </div>
            </div>

            {/* Bluesky */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-700 text-base mb-4">
                    Stay up to date with OpenAQ news on Bluesky
                  </p>
                </div>
                <a
                  href="https://bsky.app/profile/openaq.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-[#e6f8f8] border border-[#b0e8e6] text-[#33a3a1] rounded-full font-bold hover:bg-[#b0e8e6] transition-colors whitespace-nowrap ml-4"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                  </svg>
                  Follow
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


