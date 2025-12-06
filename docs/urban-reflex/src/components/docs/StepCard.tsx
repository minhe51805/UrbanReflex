'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepCardProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ number, title, children }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: number * 0.1 }}
      className="relative pl-12 pb-8 last:pb-0"
    >
      {/* Vertical Line */}
      <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-violet-500 last:hidden" />
      
      {/* Number Badge */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: number * 0.1, type: 'spring' }}
        className="absolute left-0 top-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg"
      >
        {number}
      </motion.div>
      
      {/* Content */}
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300">
        <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
