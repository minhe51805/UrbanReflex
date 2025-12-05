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
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  FileText, 
  Code, 
  Database,
  Search,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is UrbanReflex?',
        a: 'UrbanReflex is a nonprofit organization that provides universal access to air quality data through an open-source platform. We aggregate data from thousands of sources worldwide and make it freely available to everyone.'
      },
      {
        q: 'How do I access the data?',
        a: 'You can explore data through our interactive map, download datasets, or access our API programmatically. All data is freely available without registration.'
      },
      {
        q: 'Is the data free to use?',
        a: 'Yes! All data on UrbanReflex is open and free to use. We believe in universal access to air quality information.'
      }
    ]
  },
  {
    category: 'API & Technical',
    questions: [
      {
        q: 'Do I need an API key?',
        a: 'No API key is required for basic usage. However, we recommend registering for an API key for higher rate limits and better performance.'
      },
      {
        q: 'What are the API rate limits?',
        a: 'Without an API key: 100 requests/hour. With API key: 10,000 requests/hour. Enterprise plans available for higher limits.'
      },
      {
        q: 'Which programming languages are supported?',
        a: 'Our REST API can be accessed from any programming language. We provide official libraries for Python, JavaScript, R, and Julia.'
      }
    ]
  },
  {
    category: 'Data Quality',
    questions: [
      {
        q: 'How accurate is the data?',
        a: 'Data accuracy depends on the source. We provide metadata about each measurement including the source, instrument type, and quality flags.'
      },
      {
        q: 'How often is data updated?',
        a: 'Update frequency varies by source. Many stations report hourly or more frequently. Check the location details for specific update schedules.'
      },
      {
        q: 'What pollutants are measured?',
        a: 'Common pollutants include PM2.5, PM10, O3, NO2, SO2, CO, and BC. Available parameters vary by location.'
      }
    ]
  },
  {
    category: 'Contributing',
    questions: [
      {
        q: 'Can I add my own monitoring station?',
        a: 'Yes! We welcome data contributions. Contact us to discuss integration of your monitoring network.'
      },
      {
        q: 'How can I contribute to the platform?',
        a: 'You can contribute code on GitHub, help with documentation, report bugs, or support us financially.'
      },
      {
        q: 'Is the platform open source?',
        a: 'Yes! Our platform is fully open source. Visit our GitHub repository to contribute or fork the project.'
      }
    ]
  }
];

const resources = [
  {
    icon: Book,
    title: 'Documentation',
    description: 'Complete API documentation and guides',
    href: '/developers',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Detailed endpoint specifications',
    href: '/developers#api-reference',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Database,
    title: 'Data Sources',
    description: 'Learn about our data providers',
    href: '/partners',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: FileText,
    title: 'Tutorials',
    description: 'Step-by-step guides and examples',
    href: '/developers#tutorials',
    color: 'from-orange-500 to-orange-600'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <HelpCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-[#1e64ab]" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#30363c] mb-6">
              How can we help you?
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers to common questions, explore our documentation, or get in touch with our team
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#1e64ab] border border-gray-200 shadow-soft"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-16 -mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={resource.href}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${resource.color} text-white mb-4`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm">{resource.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about UrbanReflex
            </p>
          </motion.div>

          <div className="space-y-8">
            {filteredFaqs.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <ChevronRight className="h-6 w-6 text-primary-500 mr-2" />
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const faqId = `${category.category}-${faqIndex}`;
                    const isExpanded = expandedFaq === faqId;

                    return (
                      <div
                        key={faqId}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                          <ChevronRight
                            className={`h-5 w-5 text-primary-500 flex-shrink-0 transition-transform ${
                              isExpanded ? 'transform rotate-90' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 mt-2">Try different keywords or browse all FAQs</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our team is here to assist you with any questions or issues
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="mailto:info@openaq.org">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Mail className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 text-sm">info@openaq.org</p>
                </div>
              </Link>

              <Link href="https://github.com/openaq" target="_blank">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <MessageCircle className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Community Forum</h3>
                  <p className="text-gray-600 text-sm">Join the discussion</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

