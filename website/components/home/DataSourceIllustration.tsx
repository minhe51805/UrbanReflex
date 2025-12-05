/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Professional data aggregation visualization showing UrbanReflex's centralized platform architecture
 */

'use client';

import { motion } from 'framer-motion';
import { Database, Globe2, Network, TrendingUp, MapPin, Code } from 'lucide-react';

export default function DataSourceIllustration() {
  const dataSources = [
    { icon: Globe2, label: 'Government', count: '150+' },
    { icon: Database, label: 'Research', count: '80+' },
    { icon: MapPin, label: 'Sensors', count: '300+' },
  ];

  const outputs = [
    { icon: TrendingUp, label: 'Analytics' },
    { icon: Network, label: 'Data Hub' },
    { icon: Code, label: 'API' },
  ];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(14, 165, 233, 0.3) 25%, rgba(14, 165, 233, 0.3) 26%, transparent 27%, transparent 74%, rgba(14, 165, 233, 0.3) 75%, rgba(14, 165, 233, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(14, 165, 233, 0.3) 25%, rgba(14, 165, 233, 0.3) 26%, transparent 27%, transparent 74%, rgba(14, 165, 233, 0.3) 75%, rgba(14, 165, 233, 0.3) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative flex items-center justify-center gap-6 lg:gap-12">
        {/* Left: Data Sources */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {dataSources.map((source, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-soft border border-neutral-soft-200/50 hover:shadow-medium hover:border-primary-300 transition-all duration-300 min-w-[140px]">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300">
                    <source.icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  {/* Connection indicator */}
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-primary-600 mb-0.5">{source.count}</div>
                  <div className="text-xs font-semibold text-neutral-soft-900 truncate">{source.label}</div>
                </div>
              </div>

              {/* Connecting line with animation */}
              <motion.div
                className="absolute left-full top-1/2 w-6 lg:w-12 h-[2px] bg-gradient-to-r from-primary-400 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
              >
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"
                  animate={{
                    x: [0, 24, 48],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Center: OpenAQ Platform */}
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Main platform card */}
          <div className="relative z-10 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 shadow-large">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-400 rounded-br-2xl" />

            <div className="text-center">
              {/* Logo/Icon */}
              <motion.div
                className="w-14 h-14 mx-auto mb-2 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(217, 70, 239, 0.3)',
                    '0 0 40px rgba(217, 70, 239, 0.5)',
                    '0 0 20px rgba(217, 70, 239, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Database className="w-7 h-7 text-white" />
              </motion.div>

              {/* Platform name */}
              <h3 className="text-lg font-bold text-white mb-0.5">UrbanReflex</h3>
              <div className="text-primary-100 text-[10px] font-medium mb-2">Platform</div>

              {/* Stats */}
              <div className="flex gap-3 justify-center pt-2 border-t border-white/20">
                <div>
                  <div className="text-xl font-bold text-white">500+</div>
                  <div className="text-[9px] text-primary-200">Sources</div>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <div className="text-xl font-bold text-white">180+</div>
                  <div className="text-[9px] text-primary-200">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orbiting dots - subtle animation */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-accent-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [
                  Math.cos((angle * Math.PI) / 180) * 70,
                  Math.cos(((angle + 360) * Math.PI) / 180) * 70,
                ],
                y: [
                  Math.sin((angle * Math.PI) / 180) * 70,
                  Math.sin(((angle + 360) * Math.PI) / 180) * 70,
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        {/* Right: Outputs */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {outputs.map((output, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 + 0.4 }}
            >
              {/* Connecting line with animation */}
              <motion.div
                className="absolute right-full top-1/2 w-6 lg:w-12 h-[2px] bg-gradient-to-l from-accent-400 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
              >
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent-500 rounded-full"
                  animate={{
                    x: [0, -24, -48],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4 + 0.5,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-soft border border-neutral-soft-200/50 hover:shadow-medium hover:border-accent-300 transition-all duration-300 min-w-[140px]">
                <div className="flex-1 text-right min-w-0">
                  <div className="text-xs font-semibold text-neutral-soft-900 truncate">{output.label}</div>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center group-hover:from-accent-500 group-hover:to-accent-600 transition-all duration-300">
                    <output.icon className="w-5 h-5 text-accent-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  {/* Connection indicator */}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
