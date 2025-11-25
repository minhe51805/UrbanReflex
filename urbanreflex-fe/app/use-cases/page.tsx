/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: Use cases page showcasing real-world applications of UrbanReflex data
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Lightbulb, 
  GraduationCap, 
  Building2, 
  Heart,
  Smartphone,
  BarChart3,
  Users,
  Globe,
  Shield,
  Leaf,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const useCases = [
  {
    icon: GraduationCap,
    title: 'Academic Research',
    description: 'Researchers worldwide use UrbanReflex data to study air pollution patterns, health impacts, and climate change.',
    examples: [
      'Published 500+ peer-reviewed papers',
      'Supporting PhD dissertations globally',
      'Enabling cross-country comparative studies'
    ],
    color: 'from-blue-500 to-blue-600',
    stats: '500+ Research Papers'
  },
  {
    icon: Building2,
    title: 'Government & Policy',
    description: 'Policymakers leverage our data to develop evidence-based air quality regulations and monitor compliance.',
    examples: [
      'Informing national air quality standards',
      'Tracking policy effectiveness',
      'Supporting environmental impact assessments'
    ],
    color: 'from-purple-500 to-purple-600',
    stats: '50+ Governments'
  },
  {
    icon: Heart,
    title: 'Public Health',
    description: 'Health organizations use air quality data to protect vulnerable populations and issue health advisories.',
    examples: [
      'Real-time health alerts for sensitive groups',
      'Epidemiological studies on air pollution',
      'Hospital admission forecasting'
    ],
    color: 'from-pink-500 to-pink-600',
    stats: '100+ Health Agencies'
  },
  {
    icon: Smartphone,
    title: 'Mobile Applications',
    description: 'Developers build apps that help people make informed decisions about outdoor activities and exposure.',
    examples: [
      'Personal air quality tracking apps',
      'Running and cycling route planners',
      'Smart home air purifier controls'
    ],
    color: 'from-teal-500 to-teal-600',
    stats: '200+ Apps Built'
  },
  {
    icon: BarChart3,
    title: 'Data Journalism',
    description: 'Journalists use our data to investigate environmental stories and hold polluters accountable.',
    examples: [
      'Investigative reporting on pollution sources',
      'Interactive data visualizations',
      'Community pollution mapping'
    ],
    color: 'from-orange-500 to-orange-600',
    stats: '1000+ Articles'
  },
  {
    icon: Users,
    title: 'Community Advocacy',
    description: 'Local groups use data to advocate for cleaner air and environmental justice in their communities.',
    examples: [
      'Grassroots air quality monitoring',
      'Evidence for policy change campaigns',
      'Community health education'
    ],
    color: 'from-green-500 to-green-600',
    stats: '300+ Communities'
  },
  {
    icon: Globe,
    title: 'Environmental Monitoring',
    description: 'Organizations track air quality trends and assess the effectiveness of pollution control measures.',
    examples: [
      'Long-term trend analysis',
      'Pollution source identification',
      'Climate change impact studies'
    ],
    color: 'from-indigo-500 to-indigo-600',
    stats: '24/7 Monitoring'
  },
  {
    icon: Shield,
    title: 'Corporate ESG',
    description: 'Companies use air quality data for environmental reporting and sustainability initiatives.',
    examples: [
      'ESG reporting and compliance',
      'Supply chain environmental assessment',
      'Employee health and safety programs'
    ],
    color: 'from-cyan-500 to-cyan-600',
    stats: '150+ Companies'
  },
  {
    icon: Leaf,
    title: 'Urban Planning',
    description: 'City planners use data to design healthier cities and optimize green space placement.',
    examples: [
      'Smart city air quality integration',
      'Green infrastructure planning',
      'Traffic management optimization'
    ],
    color: 'from-lime-500 to-lime-600',
    stats: '80+ Cities'
  }
];

const successStories = [
  {
    title: 'Delhi Air Quality Improvement',
    location: 'Delhi, India',
    impact: '30% reduction in PM2.5 levels',
    description: 'Community advocates used UrbanReflex data to push for stricter vehicle emissions standards, resulting in measurable air quality improvements.',
    icon: TrendingUp
  },
  {
    title: 'School Siting Study',
    location: 'Los Angeles, USA',
    impact: '50 schools relocated',
    description: 'Researchers identified schools in high-pollution zones, leading to policy changes in school siting regulations.',
    icon: GraduationCap
  },
  {
    title: 'Health Alert System',
    location: 'London, UK',
    impact: '2M people protected',
    description: 'Public health agency developed an SMS alert system for vulnerable populations during high pollution episodes.',
    icon: AlertTriangle
  }
];

export default function UseCasesPage() {
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
            <Lightbulb className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-6">Use Cases</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover how organizations and individuals around the world are using UrbanReflex data to create positive change
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How People Use UrbanReflex</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From research to advocacy, our data powers solutions across diverse sectors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${useCase.color} text-white mb-6`}>
                  <useCase.icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>

                <ul className="space-y-2 mb-6">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      {example}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  <span className="text-sm font-bold text-primary-600">{useCase.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-world impact from communities using UrbanReflex data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary-100 text-primary-600 mb-4">
                  <story.icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{story.location}</p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-bold text-green-700">{story.impact}</p>
                </div>

                <p className="text-gray-700">{story.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">By the Numbers</h2>
            <p className="text-lg text-gray-600">
              The global impact of UrbanReflex data
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10M+', label: 'API Requests/Day' },
              { value: '100+', label: 'Countries' },
              { value: '15K+', label: 'Data Sources' },
              { value: '500+', label: 'Research Papers' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Start Your Own Project</h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of developers, researchers, and advocates using UrbanReflex data to make a difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/developers"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore the API
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse Data
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

