/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Main navigation header component with responsive mobile menu and dropdown navigation for the application
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Menu, X, ChevronDown, LogIn, LogOut, User, Shield, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type NavigationItem = {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
};

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const navigation: NavigationItem[] = [
    {
      name: 'Explore the data',
      href: '/explore',
    },
    {
      name: 'Why open data?',
      href: '/why-open-data',
    },
    {
      name: 'Docs',
      href: '/docs',
    },
    {
      name: 'Help',
      href: '/help',
    },
    {
      name: 'About',
      href: '/about',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-soft-200 shadow-soft">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:to-primary-400 transition-all">
                UrbanReflex
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 text-sm font-medium text-neutral-soft-700 hover:text-primary-600 transition-colors py-2">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute left-0 pt-2 -mt-2">
                        <div className="w-56 rounded-lg bg-white shadow-lg border border-neutral-soft-200">
                          <div className="py-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-neutral-soft-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-neutral-soft-700 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth & Donate Buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">{user.full_name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setAuthDropdownOpen(true)}
                onMouseLeave={() => setAuthDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <UserCircle className="w-5 h-5" />
                  <span>Account</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {authDropdownOpen && (
                  <div className="absolute right-0 pt-2 -mt-2">
                    <div className="w-48 rounded-lg bg-white shadow-lg border border-neutral-soft-200">
                      <div className="py-2">
                        <Link
                          href="/login"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-soft-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Login</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-soft-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Link
              href="/donate"
              className="rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-2.5 text-sm font-bold text-white hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-soft hover:shadow-medium transform hover:scale-105"
            >
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-soft-700 hover:bg-neutral-soft-100 hover:text-neutral-soft-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-neutral-soft-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}

              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-neutral-soft-200">
                {user ? (
                  <>
                    <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg mb-2 hover:bg-slate-200 transition-colors">
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{user.full_name}</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-md"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-md mb-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-md mb-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>

              <Link
                href="/donate"
                className="block mt-4 mx-3 text-center rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-2.5 text-sm font-bold text-white hover:from-secondary-600 hover:to-secondary-700 transition-all"
              >
                Donate
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

