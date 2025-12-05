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

import { useState } from 'react';
import { Book, Code, FileText, Rocket, Search, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

const docSections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    items: [
      { title: 'Introduction', href: '#introduction' },
      { title: 'Quick Start', href: '#quick-start' },
      { title: 'Installation', href: '#installation' },
    ],
  },
  {
    title: 'API Reference',
    icon: Code,
    items: [
      { title: 'Authentication', href: '#authentication' },
      { title: 'Endpoints', href: '#endpoints' },
      { title: 'Rate Limits', href: '#rate-limits' },
      { title: 'Error Codes', href: '#error-codes' },
    ],
  },
  {
    title: 'Guides',
    icon: Book,
    items: [
      { title: 'Road Data', href: '#road-data' },
      { title: 'Community Reports', href: '#reports' },
      { title: 'Real-time Updates', href: '#real-time' },
    ],
  },
  {
    title: 'Resources',
    icon: FileText,
    items: [
      { title: 'Platform Overview', href: '#platform-overview' },
      { title: 'Roadmap', href: '#roadmap' },
      { title: 'Examples', href: '#examples' },
      { title: 'SDKs', href: '#sdks' },
      { title: 'Help & Support', href: '#help' },
    ],
  },
];

export default function DocsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className="flex max-w-[1800px] mx-auto">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-6">
              {docSections.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="h-4 w-4 text-gray-500" />
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveSection(item.href.substring(1));
                            setSidebarOpen(false);
                          }}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeSection === item.href.substring(1)
                              ? 'bg-primary-50 text-primary-700 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 lg:px-12 lg:py-12">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                UrbanReflex Documentation
              </h1>
              <p className="text-xl text-gray-600">
                Everything you need to build with UrbanReflex platform
              </p>
            </div>

            {/* Content Sections */}
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to UrbanReflex documentation. This guide will help you integrate our platform
                  into your applications and make the most of our road network and community reporting features.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Our API is currently in beta. Features and endpoints may change.
                  </p>
                </div>
              </section>

              {/* Quick Start */}
              <section id="quick-start" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
                <p className="text-gray-600 mb-6">
                  Get started with UrbanReflex in just a few minutes.
                </p>
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <code className="text-green-400 text-sm">
                    npm install @urbanreflex/sdk
                  </code>
                </div>
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`import { UrbanReflex } from '@urbanreflex/sdk';

const client = new UrbanReflex({
  apiKey: 'your-api-key'
});

// Fetch road segments
const roads = await client.roads.list();`}
                  </pre>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-600 mb-6">
                  All API requests require authentication using an API key.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Getting your API Key</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Sign in to your UrbanReflex account</li>
                    <li>Navigate to Settings → API Keys</li>
                    <li>Click "Generate New Key"</li>
                    <li>Copy and securely store your key</li>
                  </ol>
                </div>
              </section>

              {/* Endpoints */}
              <section id="endpoints" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">GET</span>
                      <code className="text-sm font-mono">/api/ngsi-ld</code>
                    </div>
                    <p className="text-gray-600 mb-4">Fetch road segments and entities</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">type</code> - Entity type (e.g., RoadSegment)</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">limit</code> - Number of results (default: 50)</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">options</code> - Response format options</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">POST</span>
                      <code className="text-sm font-mono">/api/reports</code>
                    </div>
                    <p className="text-gray-600">Submit community reports</p>
                  </div>
                </div>
              </section>

              {/* Examples */}
              <section id="examples" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Examples</h2>
                <p className="text-gray-600 mb-6">
                  Common use cases and code examples.
                </p>
                <div className="grid gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">Fetch Road Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Retrieve road segments within a specific area
                    </p>
                    <Link href="#road-data" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                      View Example <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Reports</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Allow users to report road issues
                    </p>
                    <Link href="#reports" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                      View Example <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Platform Overview */}
              <section id="platform-overview" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Overview</h2>
                <p className="text-gray-600 mb-6">
                  UrbanReflex is a comprehensive platform for urban road network data and community reporting.
                </p>
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>Road Network Visualization:</strong> Interactive map with detailed road segments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>Community Reporting:</strong> Real-time issue reporting and tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>Open Data:</strong> Free access to road infrastructure data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>RESTful API:</strong> Easy integration with your applications</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2025 Roadmap</h2>
                <p className="text-gray-600 mb-6">
                  Our plans for expanding the platform and improving data coverage.
                </p>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Q1 2025 - Tools Enhancement</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Official Python SDK release</li>
                      <li>• Enhanced CLI tools</li>
                      <li>• Real-time data streaming</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Q2 2025 - Data Expansion</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Additional Vietnam cities coverage</li>
                      <li>• Historical data archive</li>
                      <li>• Data quality improvements</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Q3-Q4 2025 - Platform Features</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Mobile applications</li>
                      <li>• Advanced analytics dashboard</li>
                      <li>• Community features expansion</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Help & Support */}
              <section id="help" className="mb-16 scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h2>
                <p className="text-gray-600 mb-6">
                  Get help with using UrbanReflex platform.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-3">📚 Documentation</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Browse our comprehensive guides and API reference
                    </p>
                    <a href="#introduction" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      Read Docs →
                    </a>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-3">💬 Community</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Join our community to ask questions and share knowledge
                    </p>
                    <a href="https://github.com/urbanreflex" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      GitHub Discussions →
                    </a>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-3">📧 Email Support</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Contact our team for technical assistance
                    </p>
                    <a href="mailto:support@urbanreflex.com" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      Send Email →
                    </a>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-3">🐛 Report Issues</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Found a bug? Let us know on GitHub
                    </p>
                    <a href="https://github.com/urbanreflex/issues" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      Report Issue →
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

