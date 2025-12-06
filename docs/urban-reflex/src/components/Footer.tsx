'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart, Sparkles, MapPin, Cloud, Activity, Lightbulb } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: 'Tính Năng', href: '#features' },
      { name: 'Tài Liệu', href: '/docs' },
      { name: 'API Reference', href: '/docs/api' },
      { name: 'Changelog', href: '/docs/changelog' },
    ],
    company: [
      { name: 'Về Chúng Tôi', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
    ],
    resources: [
      { name: 'GitHub', href: 'https://github.com' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Community', href: '#community' },
      { name: 'Support', href: '#support' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@urbanreflex.dev', label: 'Email' },
  ];

  const features = [
    { icon: Cloud, label: 'Weather' },
    { icon: Activity, label: 'Air Quality' },
    { icon: Lightbulb, label: 'Streetlights' },
    { icon: MapPin, label: 'Citizen Reports' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  UrbanReflex
                </div>
                <div className="text-xs text-white/60">Smart City Monitoring</div>
              </div>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Hệ thống giám sát và quản lý đô thị thông minh cho thành phố  với dữ liệu real-time và visualization mạnh mẽ.
            </p>
            
            {/* Feature Icons */}
            <div className="flex gap-3">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, scale: 1.1 }}
                    className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
                    title={feature.label}
                  >
                    <Icon className="w-5 h-5 text-white/80" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>© 2025 UrbanReflex. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            </motion.div>
            <span>for Open Source Vietnam</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/70">Cuộc Thi Mã Nguồn Mở Việt Nam 2025</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
