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

import { useEffect } from 'react';

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

export default function GoogleTranslate() {
  useEffect(() => {
    // Initialize callback
    window.googleTranslateElementInit = () => {
      try {
        const element = document.getElementById('google_translate_element');
        if (element && window.google?.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,vi,fr,es,de,ja,ko,zh-CN,zh-TW,ar,hi,th',
              layout: (window.google.translate.TranslateElement as any).InlineLayout?.SIMPLE || 0,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
      }
    };

    // Load script
    const loadScript = () => {
      // Check if already loaded
      if (document.querySelector('script[src*="translate.google.com"]')) {
        // Script exists, try to initialize after a delay
        setTimeout(() => {
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
        }, 1000);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Wait for DOM
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
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 14px !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 1rem !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        .goog-te-gadget-simple:hover {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-menu-value {
          color: #374151 !important;
        }
        .goog-te-menu-frame {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          border-radius: 0.5rem !important;
          margin-top: 0.5rem !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="inline-block">
      <div id="google_translate_element" />
    </div>
  );
}
