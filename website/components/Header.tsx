/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Global header component containing navigation, logo, and mobile menu
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <svg viewBox="0 0 72 40" width="40" height="22" className="text-blue-600">
            <path fill="#343638" d="M8.84 34.55C7.84 35.5 6.6 36 5.14 36s-2.68-.5-3.68-1.46A4.78 4.78 0 0 1 0 30.97c0-1.42.5-2.61 1.46-3.57 1-.96 2.23-1.46 3.69-1.46s2.69.5 3.69 1.46 1.46 2.19 1.46 3.57a4.6 4.6 0 0 1-1.46 3.58zm-5.92-1.27c.58.61 1.3.88 2.23.88.88 0 1.65-.3 2.23-.88.57-.62.88-1.39.88-2.3 0-.97-.3-1.74-.88-2.31a2.87 2.87 0 0 0-2.23-.89c-.89 0-1.65.31-2.23.89a3.26 3.26 0 0 0-.88 2.3c.03.96.3 1.73.88 2.3zm15.37-7.34c1.3 0 2.46.46 3.38 1.38a4.9 4.9 0 0 1 1.38 3.65 5.1 5.1 0 0 1-1.38 3.7c-.92.95-2 1.41-3.23 1.41a4.49 4.49 0 0 1-3.34-1.61v5.07h-2.07V26.06h2.07v1.72a3.68 3.68 0 0 1 3.19-1.84zm-3.23 5.07c0 .92.27 1.7.85 2.3a2.7 2.7 0 0 0 2.07.89 2.93 2.93 0 0 0 2.11-.88 3 3 0 0 0 .93-2.3c0-.97-.31-1.74-.89-2.35a2.83 2.83 0 0 0-2.11-.93c-.8 0-1.54.31-2.07.93a3.13 3.13 0 0 0-.89 2.34zm20.21.88h-7.68c.03.73.38 1.31.96 1.73a3.52 3.52 0 0 0 2.07.66c1.23 0 2.15-.39 2.8-1.16l1.2 1.31a5.59 5.59 0 0 1-4.15 1.65 4.84 4.84 0 0 1-4.96-5.07 4.89 4.89 0 0 1 4.92-5.07c1.3 0 2.46.38 3.42 1.2a4.2 4.2 0 0 1 1.38 3.33v1.43h.04zm-7.68-1.65h5.6c0-.8-.26-1.46-.76-1.88a2.72 2.72 0 0 0-1.92-.65c-.77 0-1.43.23-2.04.69a2.26 2.26 0 0 0-.88 1.84zm12.94.35v5.3h-2.07v-9.84h2.07v1.81a3.77 3.77 0 0 1 1.39-1.42 3.63 3.63 0 0 1 1.88-.5c1.11 0 2 .34 2.69 1 .69.69 1.04 1.65 1.04 2.92v6h-2.08v-5.39c0-1.8-.77-2.73-2.27-2.73-.73 0-1.34.24-1.84.7-.54.53-.8 1.23-.8 2.15z"></path>
            <path fill="#198cff" d="M59.1 35.89h-1.9v-1.3a4.04 4.04 0 0 1-3.26 1.45 3.7 3.7 0 0 1-2.53-.88c-.66-.58-1-1.34-1-2.3 0-.96.34-1.7 1.07-2.16.73-.46 1.7-.73 2.89-.73h2.68v-.38c0-1.3-.73-1.96-2.19-1.96-.92 0-1.84.35-2.84 1l-.92-1.3a6.27 6.27 0 0 1 4.07-1.43c1.15 0 2.12.3 2.85.89.72.57 1.1 1.5 1.1 2.76v6.34h-.03zm-2.08-3.65v-.85h-2.3c-1.5 0-2.24.47-2.24 1.39 0 .46.2.84.54 1.11.38.27.88.39 1.54.39.65 0 1.23-.2 1.73-.54.46-.38.73-.88.73-1.5zm9.56 3.8c-1.23 0-2.3-.46-3.23-1.42a5.1 5.1 0 0 1-1.38-3.69c0-1.5.46-2.72 1.38-3.65a4.64 4.64 0 0 1 3.39-1.38c1.3 0 2.38.62 3.18 1.85v-1.73H72v13.37h-2.08V34.3c-1 1.2-2.1 1.73-3.34 1.73zm-2.57-5.03c0 .92.3 1.7.92 2.3a3 3 0 0 0 2.11.89c.81 0 1.5-.3 2.08-.88.57-.62.84-1.35.84-2.3 0-.93-.26-1.74-.84-2.35a2.83 2.83 0 0 0-4.19 0 3.16 3.16 0 0 0-.92 2.34zM13.06 12.84v-1.88l12.99.03 19.82-.03c2.43 0 4.46-1.5 5.08-3.8.38-1.43.19-2.77-.81-3.93a3.82 3.82 0 0 0-3.27-1.34 3.06 3.06 0 0 0-2.61 2.5c-.11 1 .2 1.76 1.04 2.3.61.39 1.3.42 2 .12.23-.12.42-.27.57-.5.27-.46.8-.62 1.23-.35.46.23.62.77.39 1.27-.35.69-.93 1.11-1.62 1.38a4.06 4.06 0 0 1-5.45-3.15A4.84 4.84 0 0 1 48.95.31a5.69 5.69 0 0 1 3.92 4.42c.3 1.58 0 3.08-.77 4.46a6.86 6.86 0 0 1-5.11 3.53c-.39.08-.77.08-1.15.08-3.92.04-28.28.04-32.78.04z"></path>
            <path fill="#198cff" d="M28.59 9.17h-9.9V7.59h17.16c1.24 0 2.03-.55 2.33-1.66a2.9 2.9 0 0 0-.52-2.28c-.36-.42-1.08-.67-1.8-.63-.54.03-1.09.57-1.15 1.14a.92.92 0 0 0 1.28 1.03c.32-.11.65-.11.92.16.43.49.17 1.14-.42 1.38a2.52 2.52 0 0 1-3.39-1.96c-.17-1.1.42-2.3 1.41-2.9.76-.44 2.02-.5 2.96-.18 1.18.4 2.03 1.54 2.35 2.94.2.88.03 1.79-.46 2.66-.62 1.1-1.45 1.61-2.84 1.87-.19.04-.35.05-.71.05h-6.5a4.2 4.2 0 0 0-.73-.04zm28.3 7.77a3.1 3.1 0 0 1-.17 3.32c-.67.96-1.61 1.4-2.8 1.32a2.56 2.56 0 0 1-2.3-2.18 1.4 1.4 0 0 1-.03-.26l-.01-.23v-.04a.83.83 0 0 1 .83-.71c.4 0 .76.3.82.7l.03.2a1.2 1.2 0 0 0 .07.32c.17.43.63.64 1.13.52a1.4 1.4 0 0 0 1.08-1.54 1.96 1.96 0 0 0-1.6-1.75 1 1 0 0 0-.19-.02 3.46 3.46 0 0 0-.23 0 7727.1 7727.1 0 0 0-24.67.03h-.28v-1.76h25.07c1.44 0 2.56.74 3.25 2.08z"></path>
          </svg>
          OpenAQ
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/explore" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
            Explore the data
          </Link>
          <Link href="/why-air-quality" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
            Why air quality?
          </Link>
          <Link href="/why-open-data" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
            Why open data?
          </Link>
          <Link href="/partners" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
            Partners
          </Link>
          <div className="group relative">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition flex items-center gap-1">
              Developers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto border border-gray-100">
              <Link href="/developers/roadmap" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg transition">
                Roadmap
              </Link>
              <Link href="/developers/platform-overview" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                Platform Overview
              </Link>
              <a href="https://docs.openaq.org" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                Developer Documentation
              </a>
              <Link href="/developers/help" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg transition">
                Help
              </Link>
            </div>
          </div>
          <div className="group relative">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition flex items-center gap-1">
              About
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto border border-gray-100">
              <Link href="/about" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg transition">
                About Us
              </Link>
              <Link href="/about/initiatives" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                Initiatives
              </Link>
              <Link href="/about/people" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                People
              </Link>
              <Link href="/about/sponsor" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                Sponsor us
              </Link>
              <Link href="/blog" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                Blog
              </Link>
              <Link href="/use-cases" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                Use Cases
              </Link>
              <Link href="/legal" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg transition">
                Legal & Policies
              </Link>
            </div>
          </div>
        </nav>

        {/* Donate Button */}
        <a
          href="https://secure.givelively.org/donate/openaq-inc/"
          target="_blank"
          rel="noreferrer noopener"
          className="hidden md:inline-block px-5 py-2.5 bg-[#198cff] text-white rounded-lg hover:bg-[#1577d6] transition-all font-semibold text-sm shadow-sm hover:shadow-md"
        >
          Donate
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="px-6 py-4 space-y-4">
            <Link href="/explore" className="block text-gray-700 hover:text-gray-900">
              Explore the data
            </Link>
            <Link href="/why-air-quality" className="block text-gray-700 hover:text-gray-900">
              Why air quality?
            </Link>
            <Link href="/why-open-data" className="block text-gray-700 hover:text-gray-900">
              Why open data?
            </Link>
            <Link href="/partners" className="block text-gray-700 hover:text-gray-900">
              Partners
            </Link>
            <Link href="/developers/platform-overview" className="block text-gray-700 hover:text-gray-900">
              Developers
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-gray-900">
              About
            </Link>
            <a
              href="https://secure.givelively.org/donate/openaq-inc/"
              className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
            >
              Donate
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
 
