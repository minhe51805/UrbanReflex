/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: About page component displaying mission, vision, and team information with animated sections
 */

'use client';

import { motion } from 'framer-motion';
import { User, FileText, Users } from 'lucide-react';
import Image from 'next/image';
import DotsBackground from '@/components/ui/DotsBackground';

const licenseParts = [
  'Apache License 2.0',
  'Copyright 2025 The UrbanReflex Authors',
  'Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0',
  'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
  'See the License for the specific language governing permissions and limitations under the License.',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <DotsBackground />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">About UrbanReflex</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Learn about the creators behind the project and our commitment to open-source.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">
          {/* Team Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="inline-block bg-gray-100 p-4 rounded-full mb-6">
                <Users className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
              <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
                The passionate individuals who brought UrbanReflex to life. Our diverse skills and shared vision drive our mission to make air quality data universally accessible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              {[
                {
                  name: 'Hồ Viết Hiệp',
                  role: 'Leader',
                  quote: 'Our goal is to turn complex data into clear, actionable insights for everyone.',
                  imageUrl: '/images/hiep-ho.png'
                },
                {
                  name: 'Trương Dương Bảo Minh',
                  role: 'Frontend Developer',
                  quote: 'Crafting an intuitive and engaging user experience is at the heart of what I do.',
                  imageUrl: '/images/minh-truong.png'
                },
                {
                  name: 'Trần Tuấn Anh',
                  role: 'Backend Developer',
                  quote: 'Building a robust and scalable data pipeline is crucial for a global platform.',
                  imageUrl: '/images/anh-tran.png'
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center flex flex-col items-center"
                >
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={member.imageUrl}
                      alt={`Photo of ${member.name}`}
                      width={128}
                      height={128}
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/128x128/E2E8F0/4A5568?text=Photo'; }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-500 italic">"{member.quote}"</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Open Source Overview Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50/70 rounded-2xl p-8 lg:p-12 border border-gray-200/80"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">An Open-Source Initiative</h2>
              <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
                UrbanReflex is more than just a platform; it's a community-driven, open-source project. We believe that transparency and collaboration are key to solving complex environmental challenges. Our source code is publicly available, encouraging developers, researchers, and enthusiasts to contribute, innovate, and build upon our work.
              </p>
            </div>
          </motion.section>

          {/* License Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <div className="inline-block bg-primary-100/50 p-4 rounded-full mb-6 ring-8 ring-primary-100/30">
                <FileText className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Source License</h2>
              <p className="max-w-3xl mx-auto text-gray-600">
                UrbanReflex is released under the Apache License 2.0, ensuring it remains free and open for anyone to use, modify, and distribute.
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-soft">
              <div className="text-sm text-gray-600">
                {licenseParts.map((part, index) => (
                  <div key={index}>
                    <p className="p-4 text-center">{part}</p>
                    {index < licenseParts.length - 1 && <hr className="border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

