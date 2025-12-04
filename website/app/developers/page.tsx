/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Developers page component with API documentation, code examples, and integration guides
 */

'use client';

import { motion } from 'framer-motion';
import { Code, Book, Zap, Shield } from 'lucide-react';
import DotsBackground from '@/components/ui/DotsBackground';

const features = [
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Our API is built for performance with 99.9% uptime and low latency responses.',
  },
  {
    icon: Shield,
    title: 'Free & Open',
    description: 'No API keys required. All data is freely accessible under open licenses.',
  },
  {
    icon: Book,
    title: 'Well Documented',
    description: 'Comprehensive documentation with examples in multiple programming languages.',
  },
  {
    icon: Code,
    title: 'RESTful Design',
    description: 'Clean, intuitive API design following REST best practices.',
  },
];

const endpoints = [
  {
    method: 'GET',
    path: '/v3/locations',
    description: 'Get a list of air quality monitoring locations',
    example: 'https://api.openaq.org/v3/locations?limit=100&page=1',
  },
  {
    method: 'GET',
    path: '/v3/locations/{id}',
    description: 'Get details for a specific location',
    example: 'https://api.openaq.org/v3/locations/2178',
  },
  {
    method: 'GET',
    path: '/v3/measurements',
    description: 'Get air quality measurements',
    example: 'https://api.openaq.org/v3/measurements?location_id=2178&limit=1000',
  },
  {
    method: 'GET',
    path: '/v3/parameters',
    description: 'Get list of available parameters (pollutants)',
    example: 'https://api.openaq.org/v3/parameters',
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        <DotsBackground />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#30363c] mb-6">
              UrbanReflex <span className="text-[#1e64ab]">API</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Access global air quality data through our free, open API.
              No authentication required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://docs.openaq.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#33a3a1] text-white font-bold hover:bg-[#2a8886] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Full Documentation
              </a>
              <a
                href="https://api.openaq.org/v3/locations?limit=10"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-[#1e64ab] font-bold border-2 border-[#1e64ab] hover:bg-[#1e64ab] hover:text-white transition-all duration-200"
              >
                Try the API
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e64ab] to-[#33a3a1] flex items-center justify-center text-white mx-auto mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are some of the main endpoints available in the UrbanReflex API v3
            </p>
          </motion.div>

          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-[#33a3a1] text-white text-sm font-bold rounded">
                      {endpoint.method}
                    </span>
                  </div>
                  <div className="flex-1">
                    <code className="text-[#1e64ab] font-mono font-semibold">
                      {endpoint.path}
                    </code>
                    <p className="text-gray-600 text-sm mt-1">{endpoint.description}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-700 font-mono break-all">
                    {endpoint.example}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

