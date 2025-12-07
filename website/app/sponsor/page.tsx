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
  Heart, 
  Building2, 
  Users, 
  Star,
  Check,
  Gift,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

const donationTiers = [
  {
    name: 'Supporter',
    amount: '$25/month',
    icon: Heart,
    color: 'from-blue-500 to-blue-600',
    benefits: [
      'Monthly newsletter',
      'Community forum access',
      'Supporter badge',
      'Impact reports'
    ]
  },
  {
    name: 'Advocate',
    amount: '$100/month',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    popular: true,
    benefits: [
      'All Supporter benefits',
      'Early access to features',
      'Quarterly webinars',
      'Recognition on website',
      'Custom data reports'
    ]
  },
  {
    name: 'Champion',
    amount: '$500/month',
    icon: Award,
    color: 'from-orange-500 to-orange-600',
    benefits: [
      'All Advocate benefits',
      'Direct team access',
      'Annual summit invitation',
      'Logo on website',
      'Custom API support',
      'Priority feature requests'
    ]
  }
];

const corporateTiers = [
  {
    name: 'Bronze Partner',
    amount: '$5,000/year',
    icon: Building2,
    color: 'from-amber-600 to-amber-700',
    benefits: [
      'Logo on website',
      'Social media recognition',
      'Annual impact report',
      'API support',
      'Partnership certificate'
    ]
  },
  {
    name: 'Silver Partner',
    amount: '$15,000/year',
    icon: Zap,
    color: 'from-gray-400 to-gray-500',
    benefits: [
      'All Bronze benefits',
      'Featured case study',
      'Co-branded materials',
      'Quarterly strategy calls',
      'Custom data solutions',
      'Event sponsorship opportunities'
    ]
  },
  {
    name: 'Gold Partner',
    amount: '$50,000+/year',
    icon: Star,
    color: 'from-yellow-500 to-yellow-600',
    benefits: [
      'All Silver benefits',
      'Board advisory seat',
      'Dedicated account manager',
      'Custom integrations',
      'Speaking opportunities',
      'Strategic partnership development',
      'Maximum visibility across all channels'
    ]
  }
];

const impactStats = [
  {
    icon: Users,
    value: '10M+',
    label: 'People Reached',
    description: 'Through our data and tools'
  },
  {
    icon: TrendingUp,
    value: '15K+',
    label: 'Monitoring Stations',
    description: 'Providing real-time data'
  },
  {
    icon: Gift,
    value: '100+',
    label: 'Countries',
    description: 'With air quality coverage'
  }
];

const sponsors = [
  { name: 'Google.org', logo: '🔍' },
  { name: 'Microsoft', logo: '💻' },
  { name: 'Bloomberg', logo: '📊' },
  { name: 'NASA', logo: '🚀' },
  { name: 'WHO', logo: '🏥' },
  { name: 'UNEP', logo: '🌍' }
];

export default function SponsorPage() {
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
            <Heart className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-6">Support Our Mission</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Help us fight air inequality by making air quality data universally accessible. Your support powers our open-source platform and global community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#donate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Donate Now
              </a>
              <a
                href="#corporate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Corporate Partnership
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 -mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary-100 text-primary-600 mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Donations */}
      <section id="donate" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Individual Giving</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of supporters making clean air data accessible to everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  tier.popular ? 'border-primary-500' : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${tier.color} text-white mb-4`}>
                  <tier.icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-6">{tier.amount}</div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">Prefer a one-time donation?</p>
            <button className="px-8 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg">
              Make One-Time Donation
            </button>
          </motion.div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section id="corporate" className="py-20 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Corporate Partnerships</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Partner with us to demonstrate your commitment to environmental sustainability and social impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {corporateTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${tier.color} text-white mb-4`}>
                  <tier.icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-6">{tier.amount}</div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  Contact Us
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Supporters</h2>
            <p className="text-lg text-gray-600">
              Thank you to our generous sponsors and partners
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-2">{sponsor.logo}</div>
                <div className="text-sm font-semibold text-gray-700 text-center">{sponsor.name}</div>
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
            <h2 className="text-4xl font-bold mb-6">Questions About Sponsorship?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Our team is here to help you find the right partnership opportunity
            </p>
            <a
              href="mailto:partnerships@openaq.org"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact Partnerships Team
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

