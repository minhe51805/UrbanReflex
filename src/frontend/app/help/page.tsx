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

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Code, 
  Search,
  ChevronRight,
  Github,
  Send
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
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Icon with professional styling */}
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-xl">
              <HelpCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent mb-6">
              How can we help you?
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find answers to common questions, explore our documentation, or get in touch with our team
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary-200 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={resource.href} className="block h-full group">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-primary-200 h-full flex flex-col">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${resource.color} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {React.createElement(IconComponent, { className: "h-7 w-7", strokeWidth: 2 })}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{resource.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed flex-grow">{resource.description}</p>
                      <div className="mt-4 flex items-center text-primary-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                      <motion.div
                        key={faqId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: faqIndex * 0.05 }}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden border-2 border-gray-100 transition-all duration-300"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 group"
                        >
                          <span className="font-semibold text-gray-900 pr-4 group-hover:text-primary-600 transition-colors text-base">{faq.q}</span>
                          <ChevronRight
                            className={`h-5 w-5 text-primary-500 flex-shrink-0 transition-all duration-300 ${
                              isExpanded ? 'transform rotate-90 text-primary-600' : 'group-hover:translate-x-1'
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 py-5 bg-gradient-to-br from-gray-50 to-white border-t-2 border-primary-100"
                          >
                            <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </motion.div>
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
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
              Our team is here to assist you with any questions or issues
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="https://t.me/+o1X9iR9j7_czYmE1" target="_blank" rel="noopener noreferrer" className="group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/20"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Send className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Telegram</h3>
                  <p className="text-gray-600 text-sm font-medium">Join our community</p>
                </motion.div>
              </Link>

              <Link href="https://github.com/minhe51805/UrbanReflex" target="_blank" rel="noopener noreferrer" className="group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/20"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Github className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">GitHub</h3>
                  <p className="text-gray-600 text-sm font-medium">View our repository</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

