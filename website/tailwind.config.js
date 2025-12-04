const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      slate: colors.slate,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      red: colors.red,
      green: colors.green,
      yellow: colors.yellow,
      purple: colors.purple,
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: {
        50: '#ECEBEA',  // Very light grey/off-white (from palette #3)
        100: '#E8F4F6', // Very light aqua (derived from #64BABE)
        200: '#B8E1E5', // Light aqua (derived from #64BABE)
        300: '#64BABE', // Light aqua/sky-blue (from palette #6)
        400: '#008EA0', // Medium teal (from palette #5)
        500: '#008EA0', // Medium teal - main primary
        600: '#085979', // Dark teal (from palette #4)
        700: '#064A5F', // Darker teal (derived)
        800: '#043B4A', // Even darker (derived)
        900: '#022C35', // Darkest (derived)
        DEFAULT: '#008EA0',
      },
      secondary: {
        50: '#FEF5F5',  // Very light red (derived from #F3505A)
        100: '#FCE8E9', // Light coral (derived)
        200: '#F9B5B9', // Light salmon (derived)
        300: '#F3505A', // Coral/salmon-pink (from palette #2)
        400: '#D4343F', // Deep red (from palette #1)
        500: '#F3505A', // Coral - main secondary
        600: '#D4343F', // Deep red
        700: '#B82A33', // Darker red (derived)
        800: '#9C2128', // Even darker (derived)
        900: '#80181D', // Darkest (derived)
        DEFAULT: '#F3505A',
      },
      accent: {
        50: '#ECEBEA',  // Very light grey (from palette #3)
        100: '#F5F5F5', // Light grey (derived)
        200: '#E0E0E0', // Medium grey (derived)
        300: '#64BABE', // Light aqua (from palette #6)
        400: '#008EA0', // Medium teal (from palette #5)
        500: '#64BABE', // Light aqua - main accent
        600: '#008EA0', // Medium teal
        700: '#085979', // Dark teal (from palette #4)
        800: '#064A5F', // Darker (derived)
        900: '#043B4A', // Darkest (derived)
        DEFAULT: '#64BABE',
      },
      'neutral-soft': {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'sm': '12px',
        'md': '18px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

