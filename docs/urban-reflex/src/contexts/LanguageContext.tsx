'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  vi: {
    // Header
    'nav.home': 'Trang Chủ',
    'nav.docs': 'Tài Liệu',
    'nav.features': 'Tính Năng',
    'nav.demo': 'Demo',
    'header.search': 'Tìm kiếm',
    'header.getStarted': 'Bắt Đầu',
    
    // Hero
    'hero.badge': 'Hệ Thống Giám Sát Đô Thị Thông Minh',
    'hero.title': 'UrbanReflex',
    'hero.subtitle': 'Giám sát Real-time cho Thành phố Hồ Chí Minh',
    'hero.description': 'Tích hợp dữ liệu thời tiết, chất lượng không khí, đèn đường và báo cáo công dân trên một nền tảng thống nhất',
    'hero.viewDocs': 'Xem Tài Liệu',
    'hero.exploreFeatures': 'Khám Phá Tính Năng',
    'hero.features': 'Tính Năng',
    
    // Stats
    'stats.weatherFields': 'Weather Fields',
    'stats.airPollutants': 'Air Pollutants',
    'stats.realtime': 'Real-time',
    'stats.roadSegments': 'Road Segments',
    
    // Features
    'features.badge': 'Tính Năng',
    'features.title': 'Sức Mạnh Của Dữ Liệu',
    'features.subtitle': 'Hệ thống giám sát đô thị toàn diện với visualization mạnh mẽ và real-time updates',
    'features.dataTitle': 'Sức Mạnh Của Dữ Liệu',
    'features.dataSubtitle': 'Hệ thống giám sát đô thị toàn diện với visualization mạnh mẽ và real-time updates',
    'features.weather.title': 'Thời Tiết',
    'features.weather.desc': 'Dữ liệu city-wide với 7+ fields',
    'features.weather.temp': 'Temperature & Humidity',
    'features.weather.wind': 'Wind Speed & Direction',
    'features.weather.precip': 'Precipitation & Dew Point',
    'features.airquality.title': 'Chất Lượng Không Khí',
    'features.airquality.desc': '7 pollutants theo khu vực',
    'features.streetlight.title': 'Đèn Đường',
    'features.streetlight.desc': 'Giám sát theo tuyến đường',
    'features.citizen.title': 'Báo Cáo Công Dân',
    'features.citizen.desc': 'Kết nối với cộng đồng',
    
    // Data
    'data.badge': 'Dữ Liệu',
    'data.title': 'Dữ Liệu Đầy Đủ & Chi Tiết',
    'data.subtitle': 'Đáp ứng đầy đủ yêu cầu từ OpenWeatherMap và OpenAQ',
    'data.weather': 'WeatherObserved',
    'data.airquality': 'AirQualityObserved',
    'data.citywide': 'City-wide data',
    'data.perRegion': 'Per-region data',
    
    // Use Cases
    'usecase.badge': 'Use Cases',
    'usecase.title': 'Trải Nghiệm Người Dùng',
    'usecase.map.title': 'Xem toàn bộ thành phố qua map',
    'usecase.map.desc': 'Hiển thị tất cả RoadSegments, AQI stations và WeatherObserved indicator (city-wide) trên bản đồ tương tác với real-time updates',
    'usecase.detail.title': 'Click vào 1 tuyến đường → Thông tin chi tiết',
    
    // CTA
    'cta.badge': 'Cuộc Thi Mã Nguồn Mở Việt Nam 2025',
    'cta.title': 'Sẵn sàng',
    'cta.titleHighlight': 'khám phá?',
    'cta.subtitle': 'Xem tài liệu chi tiết và trải nghiệm hệ thống giám sát đô thị thông minh ngay hôm nay',
    'cta.readDocs': 'Đọc Tài Liệu',
    'cta.viewDemo': 'Xem Demo',
    
    // Common
    'common.openSource': 'Open Source',
    'common.realtime': 'Real-time',
    'common.reliable': 'Reliable',
    
    // Search
    'search.placeholder': 'Tìm kiếm tài liệu...',
    'search.results': 'Kết quả tìm kiếm sẽ hiển thị ở đây',
    'search.quickLinks': 'Liên kết nhanh',
    'search.navigate': 'điều hướng',
    'search.select': 'chọn',
    'search.intro': 'Giới thiệu',
    'search.quickStart': 'Bắt đầu nhanh',
    'search.examples': 'Ví dụ',
    
    // Footer
    'footer.madeWith': 'Made with',
    'footer.forOpenSource': 'for Open Source Vietnam',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.docs': 'Docs',
    'nav.features': 'Features',
    'nav.demo': 'Demo',
    'header.search': 'Search',
    'header.getStarted': 'Get Started',
    
    // Hero
    'hero.badge': 'Smart City Monitoring System',
    'hero.title': 'UrbanReflex',
    'hero.subtitle': 'Real-time Monitoring for Ho Chi Minh City',
    'hero.description': 'Integrate weather, air quality, streetlight, and citizen report data on a unified platform',
    'hero.viewDocs': 'View Documentation',
    'hero.exploreFeatures': 'Explore Features',
    'hero.features': 'Features',
    
    // Stats
    'stats.weatherFields': 'Weather Fields',
    'stats.airPollutants': 'Air Pollutants',
    'stats.realtime': 'Real-time',
    'stats.roadSegments': 'Road Segments',
    
    // Features
    'features.badge': 'Features',
    'features.title': 'Power of Data',
    'features.subtitle': 'Comprehensive urban monitoring system with powerful visualization and real-time updates',
    'features.dataTitle': 'Power of Data',
    'features.dataSubtitle': 'Comprehensive urban monitoring system with powerful visualization and real-time updates',
    'features.weather.title': 'Weather',
    'features.weather.desc': 'City-wide data with 7+ fields',
    'features.weather.temp': 'Temperature & Humidity',
    'features.weather.wind': 'Wind Speed & Direction',
    'features.weather.precip': 'Precipitation & Dew Point',
    'features.airquality.title': 'Air Quality',
    'features.airquality.desc': '7 pollutants by region',
    'features.streetlight.title': 'Streetlights',
    'features.streetlight.desc': 'Monitor by road segment',
    'features.citizen.title': 'Citizen Reports',
    'features.citizen.desc': 'Connect with community',
    
    // Data
    'data.badge': 'Data',
    'data.title': 'Complete & Detailed Data',
    'data.subtitle': 'Fully compliant with OpenWeatherMap and OpenAQ requirements',
    'data.weather': 'WeatherObserved',
    'data.airquality': 'AirQualityObserved',
    'data.citywide': 'City-wide data',
    'data.perRegion': 'Per-region data',
    
    // Use Cases
    'usecase.badge': 'Use Cases',
    'usecase.title': 'User Experience',
    'usecase.map.title': 'View entire city on map',
    'usecase.map.desc': 'Display all RoadSegments, AQI stations, and WeatherObserved indicator (city-wide) on interactive map with real-time updates',
    'usecase.detail.title': 'Click on a road → Detailed information',
    
    // CTA
    'cta.badge': 'Vietnam Open Source Contest 2025',
    'cta.title': 'Ready to',
    'cta.titleHighlight': 'explore?',
    'cta.subtitle': 'View detailed documentation and experience the smart city monitoring system today',
    'cta.readDocs': 'Read Documentation',
    'cta.viewDemo': 'View Demo',
    
    // Common
    'common.openSource': 'Open Source',
    'common.realtime': 'Real-time',
    'common.reliable': 'Reliable',
    
    // Search
    'search.placeholder': 'Search documentation...',
    'search.results': 'Search results will appear here',
    'search.quickLinks': 'Quick Links',
    'search.navigate': 'to navigate',
    'search.select': 'to select',
    'search.intro': 'Introduction',
    'search.quickStart': 'Quick Start',
    'search.examples': 'Examples',
    
    // Footer
    'footer.madeWith': 'Made with',
    'footer.forOpenSource': 'for Open Source Vietnam',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.vi] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
