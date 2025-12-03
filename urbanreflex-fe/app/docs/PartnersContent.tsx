/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 16-11-2025
 * Update at: 01-12-2025
 * Description: Partners content component displaying all UrbanReflex collaborators
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Users, Heart, DollarSign } from 'lucide-react';

const airSensorPartners = [
  'Air Gradient',
  'Airqoon',
  'Clarity',
  'Habitat Map',
  'IQAir',
  'Senstate',
  'Smart Sense',
];

const corporateSponsors = [
  { name: 'Atmo', description: 'Advanced atmospheric intelligence' },
  { name: 'Geocode Earth', description: 'Global geocoding services' },
  { name: 'Up Here Media', description: 'Digital media solutions' },
];

const partners = [
  {
    name: 'APAD',
    description: 'Air Pollution Asset-Level Detection makes air pollution sources visible through open-access data and citizen science.',
  },
  {
    name: 'City of Los Angeles',
    description: 'Leads NASA-funded partnership including California State University Los Angeles & UrbanReflex.',
  },
  {
    name: 'CAMS-Net',
    description: 'International network focused on low-cost sensor air quality data applications.',
  },
  {
    name: 'Clean Air One Atmosphere',
    description: 'African citizen science group revolutionizing monitoring with micro sensors.',
  },
  {
    name: 'ESIP',
    description: 'Community addressing global Earth science data across disciplines.',
  },
  {
    name: 'Environmental Defense Fund',
    description: 'Leading environmental advocacy organization.',
  },
  {
    name: 'Fast Forward',
    description: 'Mobilizes resources for tech nonprofits creating positive impact.',
  },
  {
    name: 'Green Decision Labs',
    description: 'Pursues urban sustainability in Nepalese cities.',
  },
  {
    name: 'Hikma Health',
    description: 'Empowers data-driven health decisions for displaced populations.',
  },
  {
    name: 'Kenyatta University',
    description: 'Public research university in Nairobi, Kenya.',
  },
  {
    name: 'LAECESS',
    description: 'Latin American platform for open Earth System science.',
  },
  {
    name: 'Love My Air',
    description: 'Provides Denver communities accessible air quality information.',
  },
  {
    name: 'Lovexair',
    description: 'Global foundation addressing respiratory health and environmental exposures.',
  },
  {
    name: 'One Percent for the Planet',
    description: 'Certified environmental partner eligibility organization.',
  },
  {
    name: 'Project Phoenix',
    description: 'Community science monitoring wildfire smoke impacts on California birds.',
  },
  {
    name: 'UESD',
    description: 'Ghanaian university specializing in environment and agriculture.',
  },
  {
    name: 'University of the Philippines-Manila',
    description: 'Public health college co-creating sustainable communities.',
  },
  {
    name: 'World Resources Institute',
    description: 'Co-leads USAID-funded Clean Air Catalyst partnership.',
  },
];

const funders = [
  'AWS',
  'NASA',
  'Clean Air Fund',
  'Schmidt Futures',
  'Google.org',
  'Bloomberg Philanthropies',
  'Pisces Foundation',
  'The 11th Hour Project',
];

export default function PartnersContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6" aria-label="Breadcrumb">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-primary-500 hover:text-primary-600">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7Z"></path>
            </svg>
          </Link>
          <svg viewBox="0 0 48 48" width="20" height="20" fill="#7e8c9a">
            <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z"></path>
          </svg>
          <span className="text-neutral-soft-600">partners</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Air Sensor Partners */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-soft-900">Air Sensor Partners</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {airSensorPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`${index % 4 === 0
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                    : index % 4 === 1
                      ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                      : index % 4 === 2
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                        : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
                  } rounded-2xl p-6 border hover:shadow-large transition-all hover:scale-105`}
              >
                <p className="text-center font-semibold text-neutral-soft-800">{partner}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Corporate Sponsors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-accent-100 rounded-xl">
              <Heart className="w-6 h-6 text-accent-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-soft-900">Corporate Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corporateSponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${index === 0
                    ? 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200'
                    : index === 1
                      ? 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200'
                      : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
                  } rounded-2xl p-8 border hover:shadow-large transition-all`}
              >
                <h3 className={`text-xl font-bold mb-2 ${index === 0
                    ? 'text-rose-700'
                    : index === 1
                      ? 'text-cyan-700'
                      : 'text-amber-700'
                  }`}>{sponsor.name}</h3>
                <p className="text-neutral-soft-700">{sponsor.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Partners */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-soft-900">Partners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                viewport={{ once: true }}
                className={`${index % 6 === 0
                    ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
                    : index % 6 === 1
                      ? 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200'
                      : index % 6 === 2
                        ? 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200'
                        : index % 6 === 3
                          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
                          : index % 6 === 4
                            ? 'bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200'
                            : 'bg-gradient-to-br from-lime-50 to-lime-100 border-lime-200'
                  } rounded-2xl p-6 border hover:shadow-large transition-all`}
              >
                <h3 className={`text-lg font-bold mb-2 ${index % 6 === 0
                    ? 'text-indigo-700'
                    : index % 6 === 1
                      ? 'text-pink-700'
                      : index % 6 === 2
                        ? 'text-teal-700'
                        : index % 6 === 3
                          ? 'text-yellow-700'
                          : index % 6 === 4
                            ? 'text-violet-700'
                            : 'text-lime-700'
                  }`}>{partner.name}</h3>
                <p className="text-neutral-soft-700 text-sm">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Funders */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-accent-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-accent-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-soft-900">Funders</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {funders.map((funder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`${index % 4 === 0
                    ? 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-300'
                    : index % 4 === 1
                      ? 'bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-fuchsia-300'
                      : index % 4 === 2
                        ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300'
                        : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                  } rounded-2xl p-6 border-2 hover:shadow-large transition-all hover:scale-105`}
              >
                <p className="text-center font-bold text-neutral-soft-800">{funder}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Want to collaborate with UrbanReflex? Join our Slack community or reach out to learn more about partnership opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://join.slack.com/t/openaq/shared_invite/zt-yzqlgsva-v6MchmVhcU5~RZfLvSkgxA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-primary-600 font-semibold hover:bg-neutral-soft-50 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105"
            >
              Join Slack Community
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold hover:bg-white/20 transition-all duration-200"
            >
              Learn More About Us
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
