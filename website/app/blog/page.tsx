/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Update at: 18-11-2025
 * Description: Professional blog page with modern UI/UX and icon components
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Calendar, User, ArrowRight, Tag, Search, Clock, TrendingUp,
  Sparkles, Filter, Heart, MessageCircle, Share2, Rocket, Globe,
  Microscope, Code, BarChart3, MapPin, Brain, Handshake,
  BookMarked, Award, Eye, Bookmark, Users, Zap, Target
} from 'lucide-react';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Announcing UrbanReflex API v3: Real-time Air Quality Data at Scale',
    excerpt: 'We\'re excited to announce the launch of our new API v3, featuring real-time data streaming, improved performance, and enhanced data quality metrics.',
    author: 'Joe Flasher',
    authorRole: 'CTO',
    date: '2025-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    iconComponent: Rocket,
    featured: true,
    tags: ['API', 'Real-time', 'Performance'],
    likes: 245,
    comments: 32,
    views: 1850,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
  },
  {
    id: 2,
    title: 'How Communities Are Using Air Quality Data to Drive Change',
    excerpt: 'Discover inspiring stories from communities around the world using UrbanReflex data to advocate for cleaner air and environmental justice.',
    author: 'Priya Patel',
    authorRole: 'Community Lead',
    date: '2025-01-10',
    category: 'Impact Stories',
    readTime: '7 min read',
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    iconComponent: Users,
    tags: ['Community', 'Impact', 'Advocacy'],
    likes: 189,
    comments: 24,
    views: 1420,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
  },
  {
    id: 3,
    title: 'Understanding PM2.5: The Invisible Threat to Public Health',
    excerpt: 'A comprehensive guide to particulate matter pollution, its health impacts, and why monitoring PM2.5 levels is crucial for public health.',
    author: 'Dr. Emily Roberts',
    authorRole: 'Chief Scientist',
    date: '2025-01-05',
    category: 'Education',
    readTime: '10 min read',
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    iconComponent: Microscope,
    tags: ['PM2.5', 'Health', 'Science'],
    likes: 312,
    comments: 45,
    views: 2340,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80'
  },
  {
    id: 4,
    title: 'Expanding Coverage: 5,000 New Monitoring Stations Added',
    excerpt: 'Our network continues to grow with partnerships across Africa, Southeast Asia, and Latin America, bringing air quality data to underserved communities.',
    author: 'Sarah Johnson',
    authorRole: 'Head of Partnerships',
    date: '2024-12-20',
    category: 'Announcements',
    readTime: '4 min read',
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    iconComponent: TrendingUp,
    tags: ['Expansion', 'Network', 'Global'],
    likes: 156,
    comments: 18,
    views: 980,
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80'
  },
  {
    id: 5,
    title: 'Building with UrbanReflex: Developer Success Stories',
    excerpt: 'Meet the developers and researchers building innovative applications using our open API, from mobile apps to research platforms.',
    author: 'Michael Chen',
    authorRole: 'Developer Relations',
    date: '2024-12-15',
    category: 'Developer Stories',
    readTime: '6 min read',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    iconComponent: Code,
    tags: ['Developers', 'API', 'Innovation'],
    likes: 203,
    comments: 28,
    views: 1560,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
  },
  {
    id: 6,
    title: 'The State of Global Air Quality: 2024 Annual Report',
    excerpt: 'Our comprehensive analysis of global air quality trends, highlighting progress, challenges, and opportunities for 2025.',
    author: 'Christa Hasenkopf',
    authorRole: 'CEO',
    date: '2024-12-01',
    category: 'Research',
    readTime: '15 min read',
    gradient: 'from-indigo-500 via-purple-600 to-pink-600',
    iconComponent: BarChart3,
    tags: ['Research', 'Report', 'Trends'],
    likes: 428,
    comments: 67,
    views: 3120,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
  }
];

const categories = [
  { name: 'All', icon: BookOpen, color: 'text-gray-600' },
  { name: 'Product Updates', icon: Rocket, color: 'text-blue-600' },
  { name: 'Impact Stories', icon: Users, color: 'text-green-600' },
  { name: 'Education', icon: Brain, color: 'text-purple-600' },
  { name: 'Announcements', icon: Sparkles, color: 'text-orange-600' },
  { name: 'Developer Stories', icon: Code, color: 'text-cyan-600' },
  { name: 'Research', icon: BarChart3, color: 'text-indigo-600' }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Latest Insights & Updates</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              UrbanReflex Blog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Insights, stories, and updates from the world of air quality monitoring
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.name;

              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                  {category.name !== 'All' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {blogPosts.filter(p => p.category === category.name).length}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Sort by</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => {
            const IconComponent = post.iconComponent;
            const isBookmarked = bookmarkedPosts.includes(post.id);

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
              >
                {/* Image with Gradient Overlay */}
                <div className="relative h-56 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-90`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className="w-20 h-20 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-semibold rounded-full text-gray-800">
                      {post.category}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`}
                    />
                  </button>

                  {post.featured && (
                    <div className="absolute bottom-4 left-4">
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        <Award className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.gradient} flex items-center justify-center text-white font-bold`}>
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-blue-600 font-semibold hover:gap-2 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
              <span>Load More Articles</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* Newsletter CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Stay Updated</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Never Miss an Update
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get the latest insights on air quality, research findings, and platform updates delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <span>Subscribe</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-blue-100 mt-4">
              Join 10,000+ subscribers. No spam, unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Trending Topics */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Trending Topics</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {['Air Quality', 'PM2.5', 'Climate Change', 'Open Data', 'API', 'Community', 'Research', 'Health', 'Technology', 'Sustainability'].map((topic, index) => (
              <motion.button
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all hover:scale-105 font-medium"
              >
                #{topic}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

