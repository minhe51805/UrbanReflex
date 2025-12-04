/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: Initiatives page showcasing UrbanReflex's key programs and projects
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Rocket, 
  Globe, 
  Users, 
  BookOpen, 
  Award,
  Target,
  Heart,
  Sparkles,
  TrendingUp,
  Shield
} from 'lucide-react';

const initiatives = [
  {
    icon: Globe,
    title: 'Global Data Network',
    description: 'Building the world\'s largest open air quality data network by partnering with governments, organizations, and communities worldwide.',
    impact: '15,000+ monitoring stations',
    color: 'from-blue-500 to-blue-600',
    status: 'Ongoing',
    link: '/partners'
  },
  {
    icon: BookOpen,
    title: 'Education & Awareness',
    description: 'Empowering communities with knowledge about air quality through workshops, webinars, and educational resources.',
    impact: '50,000+ people reached',
    color: 'from-purple-500 to-purple-600',
    status: 'Active',
    link: '/use-cases'
  },
  {
    icon: Users,
    title: 'Community Champions',
    description: 'Supporting local advocates and grassroots organizations fighting for clean air in their communities.',
    impact: '200+ community groups',
    color: 'from-teal-500 to-teal-600',
    status: 'Growing',
    link: '#community'
  },
  {
    icon: Award,
    title: 'Open Data Standards',
    description: 'Developing and promoting open standards for air quality data to ensure interoperability and accessibility.',
    impact: 'Industry-wide adoption',
    color: 'from-orange-500 to-orange-600',
    status: 'Leading',
    link: '/platform-overview'
  },
  {
    icon: Rocket,
    title: 'Innovation Lab',
    description: 'Supporting researchers and developers building innovative solutions using air quality data.',
    impact: '100+ projects funded',
    color: 'from-pink-500 to-pink-600',
    status: 'Active',
    link: '/developers'
  },
  {
    icon: Shield,
    title: 'Policy Advocacy',
    description: 'Working with policymakers to promote evidence-based air quality policies and regulations.',
    impact: '30+ policy changes',
    color: 'from-green-500 to-green-600',
    status: 'Ongoing',
    link: '#policy'
  }
];

const milestones = [
  {
    year: '2015',
    title: 'UrbanReflex Founded',
    description: 'Started with a mission to democratize air quality data'
  },
  {
    year: '2017',
    title: 'API Launch',
    description: 'Released public API serving 1 billion data points'
  },
  {
    year: '2019',
    title: 'Global Expansion',
    description: 'Reached 100 countries with monitoring coverage'
  },
  {
    year: '2021',
    title: 'Community Growth',
    description: 'Surpassed 10,000 active users and developers'
  },
  {
    year: '2023',
    title: 'Platform Upgrade',
    description: 'Launched v3 API with real-time data streaming'
  },
  {
    year: '2025',
    title: 'Future Vision',
    description: 'Aiming for universal air quality monitoring coverage'
  }
];

const goals = [
  {
    icon: Target,
    title: 'Universal Coverage',
    description: 'Air quality monitoring in every community worldwide',
    progress: 65
  },
  {
    icon: TrendingUp,
    title: 'Data Accessibility',
    description: 'Free, open access to all air quality data',
    progress: 85
  },
  {
    icon: Heart,
    title: 'Community Impact',
    description: 'Empowering 1 million changemakers globally',
    progress: 45
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Supporting 1,000 air quality solutions',
    progress: 55
  }
];

export default function InitiativesPage() {
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
            <Rocket className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-6">Our Initiatives</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Driving global change through innovative programs, partnerships, and community engagement to fight air inequality
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our strategic initiatives are designed to create lasting impact in the fight for clean air
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={initiative.link}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${initiative.color} text-white mb-6 self-start`}>
                      <initiative.icon className="h-8 w-8" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{initiative.title}</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                          {initiative.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{initiative.description}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-bold text-primary-600">{initiative.impact}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Key milestones in our mission to democratize air quality data
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-300"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary-600 border-4 border-white shadow-lg z-10"></div>
                  </div>
                  
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Progress */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">2025 Goals</h2>
            <p className="text-lg text-gray-600">
              Tracking our progress towards a cleaner, healthier future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="flex items-start mb-6">
                  <div className="p-3 rounded-xl bg-primary-100 text-primary-600 mr-4">
                    <goal.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                    <p className="text-gray-600">{goal.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-primary-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    />
                  </div>
                </div>
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
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-primary-100 mb-8">
              Be part of the global movement to fight air inequality through open data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sponsor"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Support Us
              </Link>
              <Link
                href="/developers"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Building
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

