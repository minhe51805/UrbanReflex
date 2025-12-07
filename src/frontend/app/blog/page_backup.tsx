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
import { BookOpen, Calendar, User, ArrowRight, Tag, Search, Clock, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Announcing UrbanReflex API v3: Real-time Air Quality Data at Scale',
    excerpt: 'We\'re excited to announce the launch of our new API v3, featuring real-time data streaming, improved performance, and enhanced data quality metrics. This major update brings significant improvements to developer experience and data accessibility.',
    author: 'Joe Flasher',
    date: '2025-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    icon: '🚀',
    featured: true,
    tags: ['API', 'Real-time', 'Performance']
  },
  {
    id: 2,
    title: 'How Communities Are Using Air Quality Data to Drive Change',
    excerpt: 'Discover inspiring stories from communities around the world using UrbanReflex data to advocate for cleaner air and environmental justice. From grassroots movements to policy changes, see the real impact of open data.',
    author: 'Priya Patel',
    date: '2025-01-10',
    category: 'Impact Stories',
    readTime: '7 min read',
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    icon: '🌱',
    tags: ['Community', 'Impact', 'Advocacy']
  },
  {
    id: 3,
    title: 'Understanding PM2.5: The Invisible Threat to Public Health',
    excerpt: 'A comprehensive guide to particulate matter pollution, its health impacts, and why monitoring PM2.5 levels is crucial for public health. Learn about the science behind air quality measurements.',
    author: 'Dr. Emily Roberts',
    date: '2025-01-05',
    category: 'Education',
    readTime: '10 min read',
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    icon: '🔬',
    tags: ['PM2.5', 'Health', 'Science']
  },
  {
    id: 4,
    title: 'Expanding Coverage: 5,000 New Monitoring Stations Added',
    excerpt: 'Our network continues to grow with partnerships across Africa, Southeast Asia, and Latin America, bringing air quality data to underserved communities. This expansion represents a major milestone in our mission.',
    author: 'Sarah Johnson',
    date: '2024-12-20',
    category: 'Announcements',
    readTime: '4 min read',
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    icon: '📈',
    tags: ['Expansion', 'Network', 'Global']
  },
  {
    id: 5,
    title: 'Building with UrbanReflex: Developer Success Stories',
    excerpt: 'Meet the developers and researchers building innovative applications using our open API, from mobile apps to research platforms. See how they\'re making a difference with air quality data.',
    author: 'Michael Chen',
    date: '2024-12-15',
    category: 'Developer Stories',
    readTime: '6 min read',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    icon: '💻',
    tags: ['Developers', 'API', 'Innovation']
  },
  {
    id: 6,
    title: 'The State of Global Air Quality: 2024 Annual Report',
    excerpt: 'Our comprehensive analysis of global air quality trends, highlighting progress, challenges, and opportunities for 2025. Dive deep into the data that shapes our understanding of air pollution worldwide.',
    author: 'Christa Hasenkopf',
    date: '2024-12-01',
    category: 'Research',
    readTime: '15 min read',
    gradient: 'from-indigo-500 via-purple-600 to-pink-600',
    icon: '📊',
    tags: ['Research', 'Report', 'Trends']
  },
  {
    id: 7,
    title: 'Open Data Standards: Why Interoperability Matters',
    excerpt: 'Exploring the importance of open standards in air quality monitoring and how they enable global collaboration. Learn why standardization is key to solving the air quality crisis.',
    author: 'David Martinez',
    date: '2024-11-25',
    category: 'Technical',
    readTime: '8 min read',
    gradient: 'from-slate-500 via-gray-600 to-zinc-700',
    icon: '🔧',
    tags: ['Standards', 'Technical', 'Collaboration']
  },
  {
    id: 8,
    title: 'Community Spotlight: Fighting Air Pollution in Delhi',
    excerpt: 'How local activists in Delhi are using UrbanReflex data to push for policy changes and raise awareness about air quality. A powerful story of data-driven activism.',
    author: 'Priya Patel',
    date: '2024-11-20',
    category: 'Impact Stories',
    readTime: '9 min read',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    icon: '🏙️',
    tags: ['Delhi', 'Activism', 'Policy']
  },
  {
    id: 9,
    title: 'Machine Learning for Air Quality Forecasting',
    excerpt: 'Exploring how machine learning and AI are revolutionizing air quality predictions. Discover the latest techniques and their real-world applications in environmental monitoring.',
    author: 'Dr. James Wilson',
    date: '2024-11-15',
    category: 'Technical',
    readTime: '12 min read',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
    icon: '🤖',
    tags: ['AI', 'ML', 'Forecasting']
  },
  {
    id: 10,
    title: 'Partnership Announcement: Collaborating with WHO',
    excerpt: 'We\'re proud to announce our partnership with the World Health Organization to improve global air quality monitoring. This collaboration will help bring better data to underserved regions.',
    author: 'Christa Hasenkopf',
    date: '2024-11-10',
    category: 'Announcements',
    readTime: '5 min read',
    gradient: 'from-teal-500 via-cyan-600 to-blue-600',
    icon: '🤝',
    tags: ['Partnership', 'WHO', 'Global Health']
  },
  {
    id: 11,
    title: 'Air Quality 101: A Beginner\'s Guide',
    excerpt: 'New to air quality monitoring? This comprehensive guide covers everything you need to know, from basic concepts to understanding AQI values and pollutant types.',
    author: 'Emily Rodriguez',
    date: '2024-11-05',
    category: 'Education',
    readTime: '8 min read',
    gradient: 'from-lime-500 via-green-600 to-emerald-600',
    icon: '📚',
    tags: ['Beginner', 'Guide', 'AQI']
  },
  {
    id: 12,
    title: 'Success Story: Reducing Emissions in Los Angeles',
    excerpt: 'How data-driven policies helped Los Angeles reduce air pollution by 30% in just two years. A case study in effective environmental governance.',
    author: 'Michael Chen',
    date: '2024-10-28',
    category: 'Impact Stories',
    readTime: '10 min read',
    gradient: 'from-rose-500 via-pink-600 to-fuchsia-600',
    icon: '✨',
    tags: ['Success', 'Policy', 'LA']
  }
];

const categories = ['All', 'Product Updates', 'Impact Stories', 'Education', 'Announcements', 'Developer Stories', 'Research', 'Technical'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-white/10 backdrop-blur-sm"
            >
              <BookOpen className="h-10 w-10" />
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              UrbanReflex Blog
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Stories, insights, and updates from the world of open air quality data
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>{blogPosts.length} Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Updated Weekly</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 whitespace-nowrap ${selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

