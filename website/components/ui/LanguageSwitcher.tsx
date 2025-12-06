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

import { useEffect, useState, useRef } from 'react';
import { Languages, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
];

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (options: any, elementId: string) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Helper function to get cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper function to get current language from cookie
const getCurrentLanguageFromCookie = (): string => {
  const cookie = getCookie('googtrans');
  if (cookie) {
    // Format: /en/vi or /en/vi-CN
    const match = cookie.match(/\/([^\/]+)\/([^\/]+)/);
    if (match && match[2]) {
      return match[2];
    }
  }
  return 'en'; // Default to English
};

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]); // Always start with English for SSR
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set mounted flag and load language from cookie after mount
  useEffect(() => {
    setIsMounted(true);
    const langCode = getCurrentLanguageFromCookie();
    const lang = languages.find(l => l.code === langCode) || languages[0];
    setCurrentLang(lang);
  }, []);

  useEffect(() => {
    // Get current language from cookie
    const savedLangCode = getCurrentLanguageFromCookie();
    const savedLang = languages.find(l => l.code === savedLangCode);
    if (savedLang && savedLang.code !== 'en') {
      setCurrentLang(savedLang);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      try {
        const element = document.getElementById('google_translate_element');
        if (element && window.google?.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: languages.map(l => l.code).join(','),
              layout: (window.google.translate.TranslateElement as any).InlineLayout?.SIMPLE || 0,
              autoDisplay: false,
            },
            'google_translate_element'
          );
          
          // Set language from cookie after initialization
          const applySavedLanguage = () => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select && savedLangCode !== 'en') {
              if (select.value !== savedLangCode) {
                select.value = savedLangCode;
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                
                // Also trigger click to ensure translation happens
                setTimeout(() => {
                  select.click();
                }, 100);
              }
            }
          };
          
          // Try multiple times to ensure it works
          setTimeout(applySavedLanguage, 500);
          setTimeout(applySavedLanguage, 1000);
          setTimeout(applySavedLanguage, 2000);
        }
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
      }
    };

    // Load Google Translate script
    const loadScript = () => {
      if (document.querySelector('script[src*="translate.google.com"]')) {
        setTimeout(() => {
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
        }, 500);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(loadScript, 100);
      } else {
        window.addEventListener('load', () => {
          setTimeout(loadScript, 100);
        });
      }
    }

    // Inject styles
    const styleId = 'google-translate-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        #google_translate_element {
          display: inline-block !important;
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        .goog-te-gadget {
          font-size: 0 !important;
        }
        .goog-te-gadget-simple {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    const lang = languages.find(l => l.code === langCode);
    if (lang) {
      setCurrentLang(lang);
    }

    setIsOpen(false);

    // Set Google Translate cookie with proper domain and path
    const setCookie = (name: string, value: string, days: number) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      
      // For localhost, don't set domain
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      } else {
        // For production, set domain
        const domain = window.location.hostname.startsWith('.') 
          ? window.location.hostname 
          : '.' + window.location.hostname;
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;domain=${domain};SameSite=Lax`;
      }
    };

    // Set translation cookie (format: /source/target)
    const sourceLang = 'en';
    const targetLang = langCode === 'en' ? '' : langCode;
    const cookieValue = targetLang ? `/${sourceLang}/${targetLang}` : '';
    
    // Clear existing cookies first
    const clearCookie = (name: string) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      if (window.location.hostname !== 'localhost') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
      }
    };
    
    clearCookie('googtrans');
    
    // Set new cookie
    if (cookieValue) {
      setCookie('googtrans', cookieValue, 365);
    }
    
    // Also save to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_language', langCode);
    }
    
    // Also try to trigger via select if available
    const triggerViaSelect = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
        
        // Also try click on the select
        select.click();
        return true;
      }
      return false;
    };

    // Try select method first
    if (!triggerViaSelect()) {
      // If select not available, wait a bit and try again
      setTimeout(() => {
        if (!triggerViaSelect()) {
          // Reload page to apply translation via cookie
          window.location.reload();
        }
      }, 500);
    } else {
      // Select method worked, but also reload to ensure consistency
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Initialize language from cookie/localStorage on mount (only on client)
  useEffect(() => {
    if (!isMounted) return;

    // Check localStorage first (backup)
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) {
        setCurrentLang(lang);
      }
    } else {
      // Check cookie
      const cookieLang = getCurrentLanguageFromCookie();
      if (cookieLang !== 'en') {
        const lang = languages.find(l => l.code === cookieLang);
        if (lang) {
          setCurrentLang(lang);
        }
      }
    }

    // Try to get current language from Google Translate select
    const checkCurrentLang = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select && select.value) {
        const lang = languages.find(l => l.code === select.value);
        if (lang && lang.code !== currentLang.code) {
          setCurrentLang(lang);
        }
      }
    }, 1000);

    return () => clearInterval(checkCurrentLang);
  }, [isMounted, currentLang.code]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-gray-200"
      >
        <Languages className="w-4 h-4" />
        <span suppressHydrationWarning>{isMounted ? currentLang.nativeName : 'English'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors flex items-center justify-between ${
                  currentLang.code === lang.code ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
                {currentLang.code === lang.code && (
                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}

