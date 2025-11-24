/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: AQI Hub page explaining Air Quality Index methodologies from different countries
 */

'use client';

import { motion } from 'framer-motion';
import { Wind, AlertTriangle, Info, TrendingUp, Globe } from 'lucide-react';
import { useState } from 'react';

const aqiLevels = [
  {
    level: 'Good',
    range: '0-50',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthAdvice: 'Enjoy outdoor activities!'
  },
  {
    level: 'Moderate',
    range: '51-100',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    description: 'Air quality is acceptable. However, there may be a risk for some people.',
    healthAdvice: 'Sensitive individuals should consider limiting prolonged outdoor exertion.'
  },
  {
    level: 'Unhealthy for Sensitive Groups',
    range: '101-150',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    description: 'Members of sensitive groups may experience health effects.',
    healthAdvice: 'Children, elderly, and people with respiratory conditions should limit outdoor activities.'
  },
  {
    level: 'Unhealthy',
    range: '151-200',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    description: 'Some members of the general public may experience health effects.',
    healthAdvice: 'Everyone should limit prolonged outdoor exertion.'
  },
  {
    level: 'Very Unhealthy',
    range: '201-300',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    description: 'Health alert: The risk of health effects is increased for everyone.',
    healthAdvice: 'Avoid outdoor activities. Keep windows closed.'
  },
  {
    level: 'Hazardous',
    range: '300+',
    color: 'bg-maroon-700',
    textColor: 'text-red-900',
    bgColor: 'bg-red-100',
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    healthAdvice: 'Stay indoors and keep activity levels low. Wear a mask if you must go outside.'
  }
];

const countryAQIs = [
  {
    country: 'United States',
    flag: '🇺🇸',
    name: 'US EPA AQI',
    description: 'The US Environmental Protection Agency AQI is a standardized indicator of air quality.',
    pollutants: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'],
    scale: '0-500',
    breakpoints: 'Non-linear scale with 6 categories'
  },
  {
    country: 'European Union',
    flag: '🇪🇺',
    name: 'CAQI (Common Air Quality Index)',
    description: 'European Air Quality Index used across EU member states.',
    pollutants: ['PM2.5', 'PM10', 'O3', 'NO2'],
    scale: '0-100+',
    breakpoints: '5 categories with hourly and daily indices'
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    name: 'DAQI (Daily Air Quality Index)',
    description: 'UK air quality index providing health advice for different groups.',
    pollutants: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2'],
    scale: '1-10',
    breakpoints: '4 bands: Low (1-3), Moderate (4-6), High (7-9), Very High (10)'
  },
  {
    country: 'India',
    flag: '🇮🇳',
    name: 'AQI (National Air Quality Index)',
    description: 'India\'s national AQI launched in 2014 for major cities.',
    pollutants: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO', 'NH3', 'Pb'],
    scale: '0-500',
    breakpoints: '6 categories similar to US EPA'
  },
  {
    country: 'China',
    flag: '🇨🇳',
    name: 'China AQI',
    description: 'Chinese Air Quality Index based on 6 major pollutants.',
    pollutants: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'],
    scale: '0-500',
    breakpoints: '6 levels from Excellent to Severely Polluted'
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    name: 'Air Quality Categories',
    description: 'Australian air quality reporting system.',
    pollutants: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'],
    scale: 'Good to Hazardous',
    breakpoints: '6 categories with health messages'
  }
];

const pollutantInfo = [
  {
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter',
    description: 'Particles smaller than 2.5 micrometers that can penetrate deep into lungs',
    sources: 'Vehicle emissions, industrial processes, wildfires',
    health: 'Respiratory and cardiovascular problems'
  },
  {
    name: 'PM10',
    fullName: 'Coarse Particulate Matter',
    description: 'Particles smaller than 10 micrometers',
    sources: 'Dust, pollen, mold, construction',
    health: 'Respiratory irritation, reduced lung function'
  },
  {
    name: 'O3',
    fullName: 'Ozone',
    description: 'Ground-level ozone formed by chemical reactions',
    sources: 'Vehicle emissions + sunlight, industrial emissions',
    health: 'Breathing problems, asthma aggravation'
  },
  {
    name: 'NO2',
    fullName: 'Nitrogen Dioxide',
    description: 'Reddish-brown gas with pungent odor',
    sources: 'Vehicle emissions, power plants',
    health: 'Respiratory inflammation, reduced immunity'
  },
  {
    name: 'SO2',
    fullName: 'Sulfur Dioxide',
    description: 'Colorless gas with sharp odor',
    sources: 'Coal and oil combustion, metal smelting',
    health: 'Breathing difficulties, especially for asthmatics'
  },
  {
    name: 'CO',
    fullName: 'Carbon Monoxide',
    description: 'Colorless, odorless gas',
    sources: 'Vehicle emissions, incomplete combustion',
    health: 'Reduces oxygen delivery to organs'
  }
];

export default function AQIHubPage() {
  const [selectedPollutant, setSelectedPollutant] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Wind className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-6">Air Quality Index Hub</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Understanding air quality indices from around the world and what they mean for your health
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is AQI */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What is the Air Quality Index?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Air Quality Index (AQI) is a standardized indicator that tells you how clean or polluted your air is, and what associated health effects might be a concern.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Info,
                title: 'Easy to Understand',
                description: 'Converts complex air quality data into simple numbers and colors'
              },
              {
                icon: AlertTriangle,
                title: 'Health-Focused',
                description: 'Provides health advice based on current pollution levels'
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Updates',
                description: 'Updated regularly to reflect current air quality conditions'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary-100 text-primary-600 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AQI Levels */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">US EPA AQI Levels</h2>
            <p className="text-lg text-gray-600">
              Understanding the six categories of air quality
            </p>
          </motion.div>

          <div className="space-y-4">
            {aqiLevels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${level.bgColor} border-l-4 ${level.color} rounded-r-xl p-6 shadow-md`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${level.color} text-white px-4 py-1 rounded-full font-bold text-sm`}>
                        {level.range}
                      </span>
                      <h3 className={`text-xl font-bold ${level.textColor}`}>{level.level}</h3>
                    </div>
                    <p className="text-gray-700 mb-2">{level.description}</p>
                    <p className={`text-sm font-semibold ${level.textColor}`}>
                      💡 {level.healthAdvice}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Country AQIs */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Globe className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AQI Systems Around the World</h2>
            <p className="text-lg text-gray-600">
              Different countries use different methodologies to calculate and communicate air quality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryAQIs.map((aqi, index) => (
              <motion.div
                key={aqi.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="text-5xl mb-3 text-center">{aqi.flag}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{aqi.country}</h3>
                <p className="text-primary-600 font-semibold mb-3 text-center text-sm">{aqi.name}</p>
                <p className="text-gray-700 mb-4 text-sm">{aqi.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Scale:</span>
                    <span className="text-gray-700 ml-2">{aqi.scale}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Pollutants:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aqi.pollutants.map(p => (
                        <span key={p} className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pollutants Info */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Common Air Pollutants</h2>
            <p className="text-lg text-gray-600">
              Learn about the pollutants measured in air quality indices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pollutantInfo.map((pollutant, index) => (
              <motion.div
                key={pollutant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-primary-600">{pollutant.name}</h3>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">{pollutant.fullName}</p>
                <p className="text-sm text-gray-700 mb-3">{pollutant.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Sources:</span>
                    <p className="text-gray-600">{pollutant.sources}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Health Effects:</span>
                    <p className="text-gray-600">{pollutant.health}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Check Your Local Air Quality</h2>
            <p className="text-xl text-primary-100 mb-8">
              Explore real-time air quality data from monitoring stations worldwide
            </p>
            <a
              href="/explore"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Air Quality Map
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

