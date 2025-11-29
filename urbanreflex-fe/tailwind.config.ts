import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OpenAQ Brand Colors
        'brand': {
          'purple': '#7867eb',
          'blue': '#198cff',
        },
        // Grays
        'sky-120': '#1f2937',
        'lavender-100': '#7867eb',
        'smoke-100': '#6b7280',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-1-lg': ['3.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1-lg': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-3': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'heading-3-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'subtitle-3': ['0.75rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        'card': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
