'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Github, Sparkles, Search, Moon, Sun, Globe, Command } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { language, setLanguage, t } = useLanguage();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsLangMenuOpen(false);
      }
    };

    // Close dropdowns on click outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lang-menu-container')) {
        setIsLangMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.docs'), href: '/docs' },
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.demo'), href: '#demo' },
  ];

  const languages = [
    { code: 'vi' as const, name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  ];

  return (
    <>
      <motion.header
        style={{
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 shadow-lg shadow-blue-500/5 border-b border-slate-200/50 dark:border-slate-800/50'
            : 'bg-white/60 dark:bg-slate-900/60'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.span 
                  className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  UrbanReflex
                </motion.span>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium -mt-1">
                  Smart City Monitoring
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="relative px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <motion.div
                      className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
              >
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('header.search')}
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-500 border border-slate-300 dark:border-slate-700">
                  <Command className="w-3 h-3" />
                  K
                </kbd>
              </motion.button>

              {/* Language Switcher */}
              <div className="relative lang-menu-container">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <span className="text-xl">{languages.find(l => l.code === language)?.flag}</span>
                </motion.button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
                    >
                      {languages.map((lang) => (
                        <motion.button
                          key={lang.code}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => { setLanguage(lang.code); setIsLangMenuOpen(false); }}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                            language === lang.code
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                          {language === lang.code && (
                            <motion.div
                              layoutId="activeLanguage"
                              className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                            />
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </motion.button>

              {/* GitHub */}
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </motion.a>
              
              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/docs"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                >
                  {t('header.getStarted')}
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              )}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-6 pb-6 space-y-3">
            {/* Search in Mobile */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
              transition={{ delay: 0 }}
              onClick={() => {
                setIsSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              <Search className="w-5 h-5" />
              {t('header.search')}
            </motion.button>

            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
                transition={{ delay: (index + 1) * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 font-semibold transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 pt-2">
              <motion.button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </motion.button>

              <div className="relative flex-1">
                <motion.button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <Globe className="w-5 h-5" />
                  {languages.find(l => l.code === language)?.flag}
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Link
                href="/docs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 text-white font-bold text-center shadow-lg shadow-blue-500/30"
              >
                {t('header.getStarted')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Search Dialog */}
            <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {/* Search Input */}
                  <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t('search.placeholder')}
                      autoFocus
                      className="flex-1 bg-transparent text-lg outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 border border-slate-200 dark:border-slate-700">
                      ESC
                    </kbd>
                  </div>

                  {/* Search Results */}
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {t('search.results')}
                    </div>
                    
                    {/* Quick Links */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
                        {t('search.quickLinks')}
                      </div>
                      {[
                        { title: t('search.intro'), href: '/docs', icon: '📘' },
                        { title: t('search.quickStart'), href: '/docs/quick-start', icon: '🚀' },
                        { title: 'API Reference', href: '/docs/api', icon: '⚡' },
                        { title: t('search.examples'), href: '/docs/examples', icon: '💡' },
                      ].map((item, idx) => (
                        <motion.a
                          key={idx}
                          href={item.href}
                          whileHover={{ x: 4 }}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {item.title}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        ↑↓
                      </kbd>
                      <span>{t('search.navigate')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        ↵
                      </kbd>
                      <span>{t('search.select')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-20"></div>
    </>
  );
}
