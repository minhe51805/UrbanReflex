/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: Legal and policies page with terms of service, privacy policy, and data licensing
 */

'use client';

import { motion } from 'framer-motion';
import { Scale, Shield, FileText, Lock, Eye, Database } from 'lucide-react';
import { useState } from 'react';

const sections = [
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: FileText,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: Lock,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'data-license',
    title: 'Data License',
    icon: Database,
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'code-license',
    title: 'Code License',
    icon: Shield,
    color: 'from-orange-500 to-orange-600'
  }
];

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('terms');

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Scale className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-6">Legal & Policies</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Our commitment to transparency, privacy, and open data
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <section.icon className="h-5 w-5" />
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Terms of Service */}
          {activeSection === 'terms' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h2>
              <p className="text-gray-600 mb-6">Last updated: January 1, 2025</p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <p className="text-blue-900 font-semibold">
                  By using UrbanReflex services, you agree to these terms. Please read them carefully.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 mb-4">
                By accessing and using UrbanReflex's platform, API, and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use of Services</h3>
              <p className="text-gray-700 mb-4">
                UrbanReflex provides free access to air quality data and related services. You may use our services for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Research and academic purposes</li>
                <li>Commercial applications</li>
                <li>Personal projects and applications</li>
                <li>Journalism and public interest reporting</li>
                <li>Policy development and advocacy</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. API Usage</h3>
              <p className="text-gray-700 mb-4">
                When using our API, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Respect rate limits and usage guidelines</li>
                <li>Not attempt to circumvent security measures</li>
                <li>Provide attribution when required</li>
                <li>Not use the service for illegal purposes</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Disclaimer</h3>
              <p className="text-gray-700 mb-4">
                UrbanReflex provides data "as is" without warranty of any kind. We aggregate data from multiple sources and cannot guarantee accuracy, completeness, or timeliness.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                UrbanReflex shall not be liable for any damages arising from the use or inability to use our services.
              </p>
            </motion.div>
          )}

          {/* Privacy Policy */}
          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
              <p className="text-gray-600 mb-6">Last updated: January 1, 2025</p>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg">
                <p className="text-purple-900 font-semibold">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h3>
              <p className="text-gray-700 mb-4">
                We collect minimal information necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Usage Data:</strong> API requests, page views, and feature usage</li>
                <li><strong>Technical Data:</strong> IP addresses, browser type, device information</li>
                <li><strong>Optional Data:</strong> Email addresses for newsletter subscriptions</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>To provide and improve our services</li>
                <li>To monitor and analyze usage patterns</li>
                <li>To communicate updates and news (with consent)</li>
                <li>To prevent abuse and ensure security</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Sharing</h3>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Service providers who assist our operations</li>
                <li>Law enforcement when legally required</li>
                <li>Aggregated, anonymized data for research</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h3>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
                <li>Update your information</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies</h3>
              <p className="text-gray-700 mb-4">
                We use essential cookies for functionality and analytics cookies to improve our services. You can control cookie preferences in your browser settings.
              </p>
            </motion.div>
          )}

          {/* Data License */}
          {activeSection === 'data-license' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data License</h2>
              <p className="text-gray-600 mb-6">Last updated: January 1, 2025</p>

              <div className="bg-teal-50 border-l-4 border-teal-500 p-6 mb-8 rounded-r-lg">
                <p className="text-teal-900 font-semibold">
                  All UrbanReflex data is available under an open license for maximum accessibility and reuse.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CC BY 4.0 License</h3>
              <p className="text-gray-700 mb-4">
                UrbanReflex data is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">You Are Free To:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Share:</strong> Copy and redistribute the data in any medium or format</li>
                <li><strong>Adapt:</strong> Remix, transform, and build upon the data</li>
                <li><strong>Commercial Use:</strong> Use the data for commercial purposes</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Under These Terms:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Attribution:</strong> You must give appropriate credit to UrbanReflex and data providers</li>
                <li><strong>No Additional Restrictions:</strong> You may not apply legal terms that restrict others from doing anything the license permits</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Attribution Example</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                Data provided by UrbanReflex (https://urbanreflex.org) under CC BY 4.0
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Source Data Licenses</h3>
              <p className="text-gray-700 mb-4">
                Individual data sources may have their own licenses. Please check the provider information for specific attribution requirements.
              </p>
            </motion.div>
          )}

          {/* Code License */}
          {activeSection === 'code-license' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Code License</h2>
              <p className="text-gray-600 mb-6">Last updated: January 1, 2025</p>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-8 rounded-r-lg">
                <p className="text-orange-900 font-semibold">
                  All UrbanReflex platform code is open source and available on GitHub.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Apache License 2.0</h3>
              <p className="text-gray-700 mb-4">
                UrbanReflex platform code is licensed under the Apache License 2.0, a permissive open source license with patent grants.
              </p>

              <div className="bg-gray-100 p-6 rounded-lg mb-6 font-mono text-sm">
                <p className="mb-4">Apache License 2.0</p>
                <p className="mb-4">Copyright 2025 The UrbanReflex Authors</p>
                <p className="mb-4">
                  Licensed under the Apache License, Version 2.0 (the "License");
                  you may not use this file except in compliance with the License.
                  You may obtain a copy of the License at:
                </p>
                <p className="mb-4">
                  http://www.apache.org/licenses/LICENSE-2.0
                </p>
                <p>
                  Unless required by applicable law or agreed to in writing, software
                  distributed under the License is distributed on an "AS IS" BASIS,
                  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  See the License for the specific language governing permissions and
                  limitations under the License.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contributing</h3>
              <p className="text-gray-700 mb-4">
                We welcome contributions! By contributing to UrbanReflex, you agree to license your contributions under the Apache License 2.0.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GitHub Repository</h3>
              <p className="text-gray-700 mb-4">
                Visit our GitHub repository to view the source code, report issues, and contribute:
              </p>
              <a
                href="https://github.com/openaq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg no-underline"
              >
                <Eye className="h-5 w-5" />
                View on GitHub
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Our Policies?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Contact our legal team for clarifications or concerns
            </p>
            <a
              href="mailto:legal@openaq.org"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact Legal Team
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

