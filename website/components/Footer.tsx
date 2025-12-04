/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Global footer component containing links, social media icons, and newsletter signup
 */

'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Logo and tagline */}
          <div>
            <svg viewBox="0 0 72 40" width="72" height="40" className="mb-4">
              <path fill="#fff" d="M8.84 34.55C7.84 35.5 6.6 36 5.14 36s-2.68-.5-3.68-1.46A4.78 4.78 0 0 1 0 30.97c0-1.42.5-2.61 1.46-3.57 1-.96 2.23-1.46 3.69-1.46s2.69.5 3.69 1.46 1.46 2.19 1.46 3.57a4.6 4.6 0 0 1-1.46 3.58zm-5.92-1.27c.58.61 1.3.88 2.23.88.88 0 1.65-.3 2.23-.88.57-.62.88-1.39.88-2.3 0-.97-.3-1.74-.88-2.31a2.87 2.87 0 0 0-2.23-.89c-.89 0-1.65.31-2.23.89a3.26 3.26 0 0 0-.88 2.3c.03.96.3 1.73.88 2.3zm15.37-7.34c1.3 0 2.46.46 3.38 1.38a4.9 4.9 0 0 1 1.38 3.65 5.1 5.1 0 0 1-1.38 3.7c-.92.95-2 1.41-3.23 1.41a4.49 4.49 0 0 1-3.34-1.61v5.07h-2.07V26.06h2.07v1.72a3.68 3.68 0 0 1 3.19-1.84zm-3.23 5.07c0 .92.27 1.7.85 2.3a2.7 2.7 0 0 0 2.07.89 2.93 2.93 0 0 0 2.11-.88 3 3 0 0 0 .93-2.3c0-.97-.31-1.74-.89-2.35a2.83 2.83 0 0 0-2.11-.93c-.8 0-1.54.31-2.07.93a3.13 3.13 0 0 0-.89 2.34zm20.21.88h-7.68c.03.73.38 1.31.96 1.73a3.52 3.52 0 0 0 2.07.66c1.23 0 2.15-.39 2.8-1.16l1.2 1.31a5.59 5.59 0 0 1-4.15 1.65 4.84 4.84 0 0 1-4.96-5.07 4.89 4.89 0 0 1 4.92-5.07c1.3 0 2.46.38 3.42 1.2a4.2 4.2 0 0 1 1.38 3.33v1.43h.04zm-7.68-1.65h5.6c0-.8-.26-1.46-.76-1.88a2.72 2.72 0 0 0-1.92-.65c-.77 0-1.43.23-2.04.69a2.26 2.26 0 0 0-.88 1.84zm12.94.35v5.3h-2.07v-9.84h2.07v1.81a3.77 3.77 0 0 1 1.39-1.42 3.63 3.63 0 0 1 1.88-.5c1.11 0 2 .34 2.69 1 .69.69 1.04 1.65 1.04 2.92v6h-2.08v-5.39c0-1.8-.77-2.73-2.27-2.73-.73 0-1.34.24-1.84.7-.54.53-.8 1.23-.8 2.15z"></path>
              <path fill="#198cff" d="M59.1 35.89h-1.9v-1.3a4.04 4.04 0 0 1-3.26 1.45 3.7 3.7 0 0 1-2.53-.88c-.66-.58-1-1.34-1-2.3 0-.96.34-1.7 1.07-2.16.73-.46 1.7-.73 2.89-.73h2.68v-.38c0-1.3-.73-1.96-2.19-1.96-.92 0-1.84.35-2.84 1l-.92-1.3a6.27 6.27 0 0 1 4.07-1.43c1.15 0 2.12.3 2.85.89.72.57 1.1 1.5 1.1 2.76v6.34h-.03zm-2.08-3.65v-.85h-2.3c-1.5 0-2.24.47-2.24 1.39 0 .46.2.84.54 1.11.38.27.88.39 1.54.39.65 0 1.23-.2 1.73-.54.46-.38.73-.88.73-1.5zm9.56 3.8c-1.23 0-2.3-.46-3.23-1.42a5.1 5.1 0 0 1-1.38-3.69c0-1.5.46-2.72 1.38-3.65a4.64 4.64 0 0 1 3.39-1.38c1.3 0 2.38.62 3.18 1.85v-1.73H72v13.37h-2.08V34.3c-1 1.2-2.1 1.73-3.34 1.73zm-2.57-5.03c0 .92.3 1.7.92 2.3a3 3 0 0 0 2.11.89c.81 0 1.5-.3 2.08-.88.57-.62.84-1.35.84-2.3 0-.93-.26-1.74-.84-2.35a2.83 2.83 0 0 0-4.19 0 3.16 3.16 0 0 0-.92 2.34zM13.06 12.84v-1.88l12.99.03 19.82-.03c2.43 0 4.46-1.5 5.08-3.8.38-1.43.19-2.77-.81-3.93a3.82 3.82 0 0 0-3.27-1.34 3.06 3.06 0 0 0-2.61 2.5c-.11 1 .2 1.76 1.04 2.3.61.39 1.3.42 2 .12.23-.12.42-.27.57-.5.27-.46.8-.62 1.23-.35.46.23.62.77.39 1.27-.35.69-.93 1.11-1.62 1.38a4.06 4.06 0 0 1-5.45-3.15A4.84 4.84 0 0 1 48.95.31a5.69 5.69 0 0 1 3.92 4.42c.3 1.58 0 3.08-.77 4.46a6.86 6.86 0 0 1-5.11 3.53c-.39.08-.77.08-1.15.08-3.92.04-28.28.04-32.78.04z"></path>
              <path fill="#198cff" d="M28.59 9.17h-9.9V7.59h17.16c1.24 0 2.03-.55 2.33-1.66a2.9 2.9 0 0 0-.52-2.28c-.36-.42-1.08-.67-1.8-.63-.54.03-1.09.57-1.15 1.14a.92.92 0 0 0 1.28 1.03c.32-.11.65-.11.92.16.43.49.17 1.14-.42 1.38a2.52 2.52 0 0 1-3.39-1.96c-.17-1.1.42-2.3 1.41-2.9.76-.44 2.02-.5 2.96-.18 1.18.4 2.03 1.54 2.35 2.94.2.88.03 1.79-.46 2.66-.62 1.1-1.45 1.61-2.84 1.87-.19.04-.35.05-.71.05h-6.5a4.2 4.2 0 0 0-.73-.04zm28.3 7.77a3.1 3.1 0 0 1-.17 3.32c-.67.96-1.61 1.4-2.8 1.32a2.56 2.56 0 0 1-2.3-2.18 1.4 1.4 0 0 1-.03-.26l-.01-.23v-.04a.83.83 0 0 1 .83-.71c.4 0 .76.3.82.7l.03.2a1.2 1.2 0 0 0 .07.32c.17.43.63.64 1.13.52a1.4 1.4 0 0 0 1.08-1.54 1.96 1.96 0 0 0-1.6-1.75 1 1 0 0 0-.19-.02 3.46 3.46 0 0 0-.23 0 7727.1 7727.1 0 0 0-24.67.03h-.28v-1.76h25.07c1.44 0 2.56.74 3.25 2.08z"></path>
            </svg>
            <p className="text-gray-400 text-sm mt-4">
              Fighting air inequality through open data.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-400">
              <a href="/" className="block hover:text-white transition">Home</a>
              <a href="https://explore.openaq.org" className="block hover:text-white transition">Explore</a>
              <a href="https://docs.openaq.org" className="block hover:text-white transition">API</a>
              <a href="/about" className="block hover:text-white transition">About</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Stay up to date with our quarterly newsletter
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2.5 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#198cff]"
              />
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-2.5 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#198cff]"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-2.5 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#198cff]"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-[#198cff] text-white rounded-lg font-semibold hover:bg-[#1577d6] transition text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 pt-6 md:pt-8 mb-6 md:mb-8">
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start text-sm">
            <a href="https://bsky.app/profile/openaq.org" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-white transition-colors">
              Bluesky
            </a>
            <a href="https://join.slack.com/t/openaq/shared_invite/zt-3bv5rrhnp-rgrQbf6CavRSihhTW_swmA" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-white transition-colors">
              Slack
            </a>
            <a href="https://github.com/openaq" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/company/openaq" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://openaq.medium.com/" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="https://www.youtube.com/@openaq4768" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-white transition-colors">
              YouTube
            </a>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>© OpenAQ. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <a href="/terms" className="hover:text-white transition-colors">Website Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/dmca" className="hover:text-white transition-colors">DMCA</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
 
