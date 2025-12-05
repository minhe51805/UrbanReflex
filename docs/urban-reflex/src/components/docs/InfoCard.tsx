'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface InfoCardProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: ReactNode;
}

const typeConfig = {
  info: {
    icon: Info,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  success: {
    icon: CheckCircle,
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  error: {
    icon: AlertCircle,
    gradient: 'from-red-500 to-rose-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
};

export function InfoCard({ type = 'info', title, children }: InfoCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`relative p-5 rounded-xl ${config.bg} border ${config.border} backdrop-blur-sm my-6 overflow-hidden`}
    >
      {/* Animated Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20 blur-xl`} />
      
      <div className="relative flex gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} p-2 shadow-lg`}>
          <Icon className="w-full h-full text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
          )}
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
