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

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', { email, firstName, lastName });
  };

  return (
    <footer className="bg-gradient-to-br from-neutral-soft-900 via-neutral-soft-800 to-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold">UrbanReflex</span>
          </Link>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-6">Stay up to date with our quarterly newsletter</h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex gap-4 justify-center sm:justify-start">
            {[
              { name: 'Twitter', icon: '𝕏' },
              { name: 'GitHub', icon: '⚙' },
              { name: 'Facebook', icon: 'f' },
              { name: 'LinkedIn', icon: 'in' },
              { name: 'Medium', icon: 'M' },
              { name: 'YouTube', icon: '▶' },
              { name: 'Slack', icon: '#' },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
                aria-label={social.name}
              >
                <span className="text-white font-bold">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-white/20">
          <Link href="/" className="hover:text-primary-300 transition-colors font-medium">
            Home
          </Link>
          <Link href="/explore" className="hover:text-primary-300 transition-colors font-medium">
            Explore
          </Link>
          <Link href="/developers" className="hover:text-primary-300 transition-colors font-medium">
            API
          </Link>
          <Link href="/about" className="hover:text-primary-300 transition-colors font-medium">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary-300 transition-colors font-medium">
            Contact
          </Link>
          <Link href="/help" className="hover:text-primary-300 transition-colors font-medium">
            Help
          </Link>
          <Link href="/report-issue" className="hover:text-primary-300 transition-colors font-medium">
            Report Issue
          </Link>
          <Link href="/admin" className="hover:text-primary-300 transition-colors font-medium">
            Admin
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-white/80 mb-4 md:mb-0">
            © UrbanReflex. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-white/80">
            <Link href="/terms" className="hover:text-white transition-colors">
              Website Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/dmca" className="hover:text-white transition-colors">
              DMCA
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

