'use client'

import Link from 'next/link';
import { Wind, Globe } from 'lucide-react';

export default function AQIHubSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
            Air Quality Index Hub
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            Visit the UrbanReflex AQI Hub to learn about the methodologies different countries use to build their most important air quality communications tool. Understand how UrbanReflex NGSI-LD standardizes air quality data for Ho Chi Minh City.
          </p>
          <Link
            href="/aqi-hub"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold transition-all text-base md:text-lg hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg group"
          >
            Visit the AQI Hub
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="order-1 md:order-2 relative h-80 md:h-96 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50">
          {/* Globe visualization with UrbanReflex branding */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-xl">
              <Globe className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
            <p className="text-xl md:text-2xl font-bold mb-2 text-gray-900">UrbanReflex AQI</p>
            <p className="text-gray-600 text-sm">Smart city air quality monitoring</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Wind className="w-4 h-4 text-primary-600" />
              <span className="text-xs text-gray-500">Ho Chi Minh City</span>
            </div>
          </div>

          {/* Decorative circles with primary colors */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary-400 opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full bg-blue-400 opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-400 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-green-400 opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </section>
  )
}
 
