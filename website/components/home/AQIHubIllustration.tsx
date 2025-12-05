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
import { Globe, Wind, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AQIHubIllustration() {
  const aqiLevels = [
    { label: 'Good', range: '0-50', color: 'from-green-500 to-green-600', icon: CheckCircle, textColor: 'text-green-700' },
    { label: 'Moderate', range: '51-100', color: 'from-yellow-500 to-yellow-600', icon: AlertCircle, textColor: 'text-yellow-700' },
    { label: 'Unhealthy', range: '101-150', color: 'from-orange-500 to-orange-600', icon: AlertTriangle, textColor: 'text-orange-700' },
    { label: 'Very Unhealthy', range: '151-200', color: 'from-red-500 to-red-600', icon: AlertTriangle, textColor: 'text-red-700' },
    { label: 'Hazardous', range: '201+', color: 'from-purple-600 to-purple-800', icon: AlertCircle, textColor: 'text-purple-700' },
  ];

  const roads = [
    { code: 'UR', name: 'UrbanReflex', color: 'primary-500', isHighlight: true },
    { code: 'NH', name: 'Nguyễn Huệ', color: 'accent-500' },
    { code: 'LL', name: 'Lê Lợi', color: 'primary-600' },
    { code: 'ĐBP', name: 'Điện Biên Phủ', color: 'accent-600' },
  ];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center p-6">
      <div className="flex items-start gap-8 lg:gap-12">
        {/* Left: AQI Scale */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-2">
            <h4 className="text-sm font-bold text-neutral-soft-900 mb-1">AQI Scale</h4>
            <p className="text-xs text-neutral-soft-600">Air Quality Index</p>
          </div>

          {aqiLevels.map((level, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`relative bg-gradient-to-r ${level.color} rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px] overflow-hidden border border-white/20`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
                  }} />
                </div>

                <div className="relative flex items-center gap-3">
                  <level.icon className="w-5 h-5 text-white flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{level.label}</div>
                    <div className="text-xs text-white/90">{level.range}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Center: Globe with AQI Hub */}
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Globe container */}
          <div className="relative">
            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-48 h-48 rounded-full border-2 border-primary-300/30" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-40 h-40 rounded-full border-2 border-accent-300/30" />
            </motion.div>

            {/* Main globe */}
            <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-large">
              {/* Globe icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Globe className="w-16 h-16 text-white" />
              </motion.div>

              {/* Orbiting dots */}
              {[0, 90, 180, 270].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-accent-400 rounded-full shadow-md"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos((angle * Math.PI) / 180) * 75,
                      Math.cos(((angle + 360) * Math.PI) / 180) * 75,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * 75,
                      Math.sin(((angle + 360) * Math.PI) / 180) * 75,
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>

            {/* AQI Hub label */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full px-4 py-2 shadow-medium border border-primary-400">
                <Wind className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">UrbanReflex AQI</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Country Standards */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-2">
            <h4 className="text-sm font-bold text-neutral-soft-900 mb-1">Road Segments</h4>
            <p className="text-xs text-neutral-soft-600">By Location</p>
          </div>

          {roads.map((road, i) => (
            <motion.div
              key={i}
              className="group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }}
            >
              <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-soft border transition-all duration-300 min-w-[160px] ${road.isHighlight
                  ? 'border-2 border-primary-400 shadow-medium bg-gradient-to-br from-primary-50/50 to-white'
                  : 'border-neutral-soft-200/50 hover:shadow-medium hover:border-primary-300'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${road.isHighlight
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                      : `bg-gradient-to-br from-${road.color}/20 to-${road.color}/30 border border-${road.color}/20`
                    } flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${road.isHighlight ? 'text-white' : 'text-neutral-soft-900'}`}>
                      {road.code}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs font-semibold ${road.isHighlight ? 'text-primary-700' : 'text-neutral-soft-900'}`}>
                      {road.name}
                    </div>
                    <div className="text-[10px] text-neutral-soft-500">Road</div>
                  </div>
                </div>

                {/* Mini color bar */}
                <div className="mt-2 h-1.5 rounded-full overflow-hidden flex">
                  <div className="flex-1 bg-green-400" />
                  <div className="flex-1 bg-yellow-400" />
                  <div className="flex-1 bg-orange-400" />
                  <div className="flex-1 bg-red-400" />
                  <div className="flex-1 bg-purple-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
