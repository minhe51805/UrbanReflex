# UrbanReflex Documentation

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-15.1-00A3E0)](https://fumadocs.vercel.app/)
[![License](https://img.shields.io/badge/License-GPL--3.0-green.svg)](LICENSE)

**Modern Documentation Website for UrbanReflex Smart City Platform**

Built with Next.js 15, Fumadocs, and Neobrutalism Design

</div>

---

## Overview

UrbanReflex Documentation is a modern, feature-rich documentation website built with **Next.js 15**, **Fumadocs**, and **Tailwind CSS v4**. It features a unique **Neobrutalism design** style with bold borders, shadows, and vibrant colors, providing an engaging and accessible documentation experience.

### Key Features

- 🎨 **Neobrutalism Design** - Bold, modern UI with thick borders and shadows
- 📚 **MDX Support** - Write documentation in Markdown with React components
- 🔍 **Full-Text Search** - Fast, client-side search with API integration
- 📱 **Responsive Design** - Mobile-first approach with modern UI/UX
- 🌓 **Dark Mode** - Built-in dark mode support
- 🎯 **Type-Safe** - Full TypeScript support
- ⚡ **Fast Performance** - Optimized with Next.js 15 App Router
- 🎭 **Custom Components** - Shadcn UI components with Neobrutalism styling

---

## Tech Stack

### Core Technologies

- **Next.js 15.0.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.6.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Fumadocs 15.1.0** - Documentation framework

### Key Libraries

- **Fumadocs Core** - Documentation core functionality
- **Fumadocs MDX** - MDX processing and compilation
- **Fumadocs UI** - Pre-built documentation components
- **Shadcn UI** - Customizable component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Tailwind class merging utility

---

## Project Structure

```
urban-reflex/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── search/          # Search API endpoint
│   ├── docs/                 # Documentation pages
│   │   ├── layout.tsx        # Docs layout
│   │   └── [[...slug]]/      # Dynamic docs pages
│   ├── global.css            # Global styles & Neobrutalism theme
│   ├── home-content.tsx      # Homepage content component
│   ├── layout.config.tsx     # Fumadocs layout configuration
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── source.ts             # Fumadocs source configuration
├── components/               # React components
│   └── ui/                   # Shadcn UI components
│       ├── button.tsx        # Button component
│       └── card.tsx          # Card component
├── content/                  # Documentation content (MDX)
│   ├── index.mdx            # Homepage content
│   ├── introduction.mdx      # Introduction page
│   ├── getting-started.mdx  # Getting started guide
│   ├── faqs.mdx             # FAQ page
│   ├── sponsor.mdx          # Sponsor page
│   ├── community-support.mdx # Community support page
│   └── meta.json            # Navigation structure
├── lib/                      # Utilities
│   └── utils.ts             # Helper functions
├── public/                    # Static assets
│   └── img/                  # Images
│       └── logo.png          # UrbanReflex logo
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── source.config.ts          # Fumadocs source configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- Basic knowledge of React and TypeScript

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/minhe51805/UrbanReflex.git
cd UrbanReflex/docs/urban-reflex
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

Visit `http://localhost:3001` to see the documentation website.

### Available Scripts

```bash
npm run dev      # Start development server on port 3001
npm run build    # Build for production
npm start        # Start production server
```

---

## Documentation Structure

The documentation is organized into the following sections:

### Main Sections

- **Introduction** - Overview of UrbanReflex platform
- **Getting Started** - Installation and setup guide
- **Basic Usage** - Quick start guide
- **Reference** - API documentation and references
- **Resources** - Additional resources and configuration
- **FAQ's** - Frequently asked questions
- **Sponsor** - Sponsorship information
- **Community Support** - Community resources and support
- **License** - License information

### Content Management

Documentation content is written in **MDX** format and stored in the `content/` directory. The navigation structure is defined in `content/meta.json`.

---

## Features

### Neobrutalism Design

The website features a unique Neobrutalism design style with:

- **Bold Borders** - Thick black borders (2-4px)
- **Bold Shadows** - Offset shadows for depth
- **Vibrant Colors** - Yellow, black, white color scheme
- **Bold Typography** - Heavy font weights
- **No Border Radius** - Sharp, angular design
- **Fixed Navigation** - Sticky header, sidebar, and TOC

### Search Functionality

- **Full-Text Search** - Search across all documentation pages
- **API Integration** - Custom search API endpoint
- **Real-time Results** - Instant search results
- **Neobrutalism Styled** - Search results match design system

### Custom Components

- **Button** - Neobrutalism-styled button with variants
- **Card** - Card component with bold borders and shadows
- **Logo** - Custom logo component with Neobrutalism styling

---

## Configuration

### Next.js Configuration

The `next.config.mjs` file includes:

- MDX integration with Fumadocs
- Image domain configuration for external images
- Webpack configuration
- Performance optimizations

### Tailwind CSS Configuration

The `tailwind.config.js` file includes:

- Fumadocs preset
- Custom color variables
- Neobrutalism theme variables
- Dark mode support

### Fumadocs Configuration

The `source.config.ts` file configures:

- Documentation directory
- MDX processing
- Source generation

---

## Styling

### Global Styles

The `app/global.css` file contains:

- Neobrutalism theme variables (light and dark mode)
- Base styles and resets
- Custom animations
- Fumadocs component overrides
- Fixed positioning for navigation elements
- Zigzag line design for sidebar navigation

### Theme Variables

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 0 0% 0%;
--primary: 0 0% 0%;
--secondary: 60 100% 50%;

/* Dark Mode */
--background: 0 0% 0%;
--foreground: 0 0% 100%;
--primary: 0 0% 100%;
--secondary: 60 100% 50%;
```

---

## Development

### Adding New Pages

1. Create a new `.mdx` file in the `content/` directory
2. Add frontmatter with `title` and `description`
3. Add the page to `content/meta.json` navigation structure
4. The page will automatically appear in the sidebar

### Customizing Components

Components are located in `components/ui/` and can be customized to match the Neobrutalism design system.

### Modifying Styles

Global styles are in `app/global.css`. Component-specific styles can be added using Tailwind CSS classes or custom CSS.

---

## Deployment

### Vercel (Recommended)

```bash
npx vercel
```

### Docker

```bash
docker build -t urbanreflex-docs .
docker run -p 3001:3001 urbanreflex-docs
```

### Traditional Hosting

```bash
npm run build
npm start
```

---

## License

This project is licensed under the **GNU General Public License v3.0**.

```
Copyright (C) 2025  WAG

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
```

See the [LICENSE](LICENSE) file for details.

---

## Support

- **Documentation**: Visit [the docs](https://urbanreflex.dev/docs)
- **GitHub Issues**: [Report issues](https://github.com/minhe51805/UrbanReflex/issues)
- **Community**: Join our [community support](https://urbanreflex.dev/docs/community-support)

---

## Contributing

Contributions are welcome! Please read our contribution guidelines and code of conduct before submitting pull requests.

---

## Acknowledgments

- **Fumadocs** - Documentation framework
- **Shadcn UI** - Component library
- **Neobrutalism Design** - Design inspiration
- **HUTECH University** - Academic support
- **VFOSSA** - Open source community support
- **Vietnam OLP** - Platform development support

---

<div align="center">

**Built with ❤️ by the UrbanReflex Team**

[GitHub](https://github.com/minhe51805/UrbanReflex) • [Documentation](https://urbanreflex.dev/docs) • [Support](https://urbanreflex.dev/docs/community-support)

</div>

