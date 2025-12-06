'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Cloud, 
  Wind, 
  MapPin, 
  Lightbulb, 
  MessageSquare, 
  Activity,
  Eye,
  Gauge,
  Thermometer,
  CloudRain,
  Radio,
  FileText,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  TrendingUp,
  Globe,
  Satellite
} from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const features = [
    {
      icon: Cloud,
      title: t('features.weather.title'),
      description: t('features.weather.desc'),
      color: "blue",
      details: [
        { icon: Thermometer, text: t('features.weather.temp') },
        { icon: Wind, text: t('features.weather.wind') },
        { icon: CloudRain, text: t('features.weather.precip') }
      ]
    },
    {
      icon: Activity,
      title: t('features.airquality.title'),
      description: t('features.airquality.desc'),
      color: "green",
      details: [
        { icon: Gauge, text: "AQI Index" },
        { icon: Radio, text: "PM2.5, PM10, NO₂, O₃" },
        { icon: Activity, text: "SO₂, CO" }
      ]
    },
    {
      icon: Lightbulb,
      title: t('features.streetlight.title'),
      description: t('features.streetlight.desc'),
      color: "amber",
      details: [
        { icon: Zap, text: t('features.weather.temp').split('&')[0].trim() },
        { icon: MapPin, text: t('features.weather.wind').split('&')[0].trim() },
        { icon: BarChart3, text: t('features.weather.precip').split('&')[0].trim() }
      ]
    },
    {
      icon: MessageSquare,
      title: t('features.citizen.title'),
      description: t('features.citizen.desc'),
      color: "violet",
      details: [
        { icon: FileText, text: t('search.intro') },
        { icon: MapPin, text: t('features.weather.wind').split('&')[0].trim() },
        { icon: Shield, text: "Real-time" }
      ]
    }
  ];

  const stats = [
    { value: "7+", label: t('stats.weatherFields'), icon: Cloud },
    { value: "7", label: t('stats.airPollutants'), icon: Activity },
    { value: "24/7", label: t('stats.realtime'), icon: TrendingUp },
    { value: "∞", label: t('stats.roadSegments'), icon: Globe }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col overflow-hidden">
      {/* Hero Section with Advanced Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950">
          <div className="absolute inset-0">
            {/* Animated Orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 45, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
            />
          </div>
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
        </div>

        <motion.div 
          style={{ y, opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-2xl shadow-blue-500/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/90 font-medium">{t('hero.badge')}</span>
          </motion.div>

          {/* Main Heading with Gradient Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-6"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 80px rgba(59, 130, 246, 0.5)"
              }}
            >
              {t('hero.title')}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-white/90 mb-4 max-w-3xl mx-auto font-semibold"
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-white/70 mb-12 max-w-2xl mx-auto"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/docs" 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 rounded-2xl font-bold text-white shadow-2xl shadow-blue-500/50 overflow-hidden flex items-center gap-2 justify-center"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {t('hero.viewDocs')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a 
                href="#features" 
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-bold text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
              >
                <Satellite className="w-5 h-5" />
                {t('hero.exploreFeatures')}
              </a>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants as any}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  transition: { type: "spring" as const, stiffness: 300 }
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/30 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                  <div className="text-4xl font-black text-white mb-2 bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            ></motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section with 3D Cards */}
      <section id="features" className="py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t('hero.features')}</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {t('features.dataTitle')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('features.dataSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: {
                  gradient: "from-blue-500/10 to-cyan-500/10",
                  border: "border-blue-500/20 hover:border-blue-500/50",
                  glow: "group-hover:shadow-blue-500/25",
                  icon: "bg-blue-500/20 text-blue-500",
                  iconGlow: "group-hover:shadow-blue-500/50"
                },
                green: {
                  gradient: "from-green-500/10 to-emerald-500/10",
                  border: "border-green-500/20 hover:border-green-500/50",
                  glow: "group-hover:shadow-green-500/25",
                  icon: "bg-green-500/20 text-green-500",
                  iconGlow: "group-hover:shadow-green-500/50"
                },
                amber: {
                  gradient: "from-amber-500/10 to-orange-500/10",
                  border: "border-amber-500/20 hover:border-amber-500/50",
                  glow: "group-hover:shadow-amber-500/25",
                  icon: "bg-amber-500/20 text-amber-500",
                  iconGlow: "group-hover:shadow-amber-500/50"
                },
                violet: {
                  gradient: "from-violet-500/10 to-purple-500/10",
                  border: "border-violet-500/20 hover:border-violet-500/50",
                  glow: "group-hover:shadow-violet-500/25",
                  icon: "bg-violet-500/20 text-violet-500",
                  iconGlow: "group-hover:shadow-violet-500/50"
                }
              };
              const colors = colorClasses[feature.color as keyof typeof colorClasses];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    y: -12,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                  
                  {/* Card */}
                  <div className={`relative p-8 rounded-3xl bg-white dark:bg-slate-900 border ${colors.border} shadow-xl ${colors.glow} transition-all duration-500 h-full`}>
                    {/* Icon with Glow */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl ${colors.icon} flex items-center justify-center mb-6 shadow-lg ${colors.iconGlow} transition-all duration-300`}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Details */}
                    <div className="space-y-3">
                      {feature.details.map((detail, idx) => {
                        const DetailIcon = detail.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + idx * 0.1 }}
                            className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"
                          >
                            <DetailIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{detail.text}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Visualization Preview với Bento Grid */}
      <section className="py-32 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 mb-6"
            >
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Dữ Liệu</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Dữ Liệu Đầy Đủ & Chi Tiết
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Đáp ứng đầy đủ yêu cầu từ OpenWeatherMap và OpenAQ
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Weather Data Bento Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
                  >
                    <Cloud className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">WeatherObserved</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">City-wide data</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Temperature", value: "28°C", color: "blue" },
                    { label: "Humidity", value: "75%", color: "cyan" },
                    { label: "Wind Speed", value: "3.2 m/s", color: "blue" },
                    { label: "Pressure", value: "1013 hPa", color: "cyan" },
                    { label: "Visibility", value: "10 km", color: "blue" },
                    { label: "Precipitation", value: "0.5 mm", color: "cyan" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{item.label}</div>
                      <div className={`text-3xl font-black ${item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Air Quality Data Bento Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50"
                  >
                    <Activity className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">AirQualityObserved</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Per-region data</p>
                  </div>
                </div>
                
                {/* AQI Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4 shadow-xl"
                >
                  <div className="text-sm text-white/80 mb-2 font-medium">AQI Index</div>
                  <div className="text-5xl font-black text-white">52</div>
                  <div className="text-white/90 font-semibold mt-1">Good</div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "PM2.5", value: "12 µg/m³" },
                    { label: "PM10", value: "25 µg/m³" },
                    { label: "NO₂", value: "18 µg/m³" },
                    { label: "O₃", value: "45 µg/m³" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{item.label}</div>
                      <div className="text-xl font-black text-green-600 dark:text-green-400">{item.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases với Interactive Cards */}
      <section className="py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
            >
              <Eye className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">Use Cases</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              {t('usecase.title')}
            </h2>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, translateY: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-2xl shadow-blue-500/50"
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      Xem toàn bộ thành phố qua map
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      Hiển thị tất cả RoadSegments, AQI stations và WeatherObserved indicator (city-wide) trên bản đồ tương tác với real-time updates
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, translateY: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-2xl shadow-violet-500/50"
                  >
                    <Eye className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Click vào 1 tuyến đường → Thông tin chi tiết
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: MapPin, title: "RoadSegment", desc: "Tên, vị trí, loại đường" },
                        { icon: Lightbulb, title: "Streetlights", desc: "Số lượng, trạng thái (on/off)" },
                        { icon: Activity, title: "AirQuality", desc: "AQI, PM2.5, PM10, NO₂, O₃, SO₂, CO" },
                        { icon: Cloud, title: "Weather", desc: "7+ weather fields city-wide" }
                      ].map((item, idx) => {
                        const ItemIcon = item.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                                <ItemIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="font-bold text-lg">✅ {item.title}</div>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section với 3D Effect */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-violet-950 to-slate-900">
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
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm text-white/90 font-semibold">Cuộc Thi Mã Nguồn Mở Việt Nam 2025</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8"
            >
              {t('cta.title')}{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {t('cta.titleHighlight')}
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto"
            >
              {t('cta.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/docs" 
                  className="group relative px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg shadow-2xl overflow-hidden flex items-center gap-3 justify-center"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500"
                    initial={{ x: "100%", opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                    {t('cta.readDocs')}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="#features"
                  className="group px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-black text-lg text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  {t('cta.viewDemo')}
                </a>
              </motion.div>
            </motion.div>

            {/* Floating Elements */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { icon: Globe, text: "Open Source" },
                { icon: Zap, text: "Real-time" },
                { icon: Shield, text: "Reliable" }
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    whileHover={{ y: -10, scale: 1.1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                      <ItemIcon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white/80 font-semibold">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
