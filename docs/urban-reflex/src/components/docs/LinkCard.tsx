'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';

interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
  external?: boolean;
}

export function LinkCard({ title, description, href, external }: LinkCardProps) {
  const isExternal = external || href.startsWith('http');
  const LinkComponent = isExternal ? 'a' : Link;
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <LinkComponent
        href={href}
        {...linkProps}
        className="block p-5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden relative"
      >
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 p-2 text-white shadow-lg">
            <FileText className="w-full h-full" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                {title}
              </h3>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                {isExternal ? (
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                )}
              </motion.div>
            </div>
            {description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.8 }}
        />
      </LinkComponent>
    </motion.div>
  );
}
