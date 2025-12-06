'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface FeatureCardProps {
  icon: keyof typeof LucideIcons;
  title: string;
  description: string;
  gradient?: string;
}

export function FeatureCard({ icon, title, description, gradient = 'from-blue-500 to-cyan-500' }: FeatureCardProps) {
  const Icon = LucideIcons[icon] as React.ComponentType<{ className?: string }>;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Icon */}
      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-2.5 mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
        <Icon className="w-full h-full text-white" />
      </div>
      
      {/* Content */}
      <h3 className="relative text-lg font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="relative text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
}
