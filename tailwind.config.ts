import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0f9f4',
          100: '#dbf0e3',
          200: '#b9e1ca',
          300: '#8bcba8',
          400: '#5bae83',
          500: '#3a9367',
          600: '#2a7652',
          700: '#225e43',
          800: '#1e4b37',
          900: '#1a3f2f',
          950: '#0d2319',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Neutral/Gray scale - Warm beige tones
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Feature colors
        feature: {
          blue: {
            light: '#eff6ff',
            DEFAULT: '#3b82f6',
            dark: '#1e40af',
          },
          purple: {
            light: '#faf5ff',
            DEFAULT: '#a855f7',
            dark: '#7e22ce',
          },
          orange: {
            light: '#fff7ed',
            DEFAULT: '#f97316',
            dark: '#c2410c',
          },
          cyan: {
            light: '#ecfeff',
            DEFAULT: '#06b6d4',
            dark: '#0e7490',
          },
          pink: {
            light: '#fdf2f8',
            DEFAULT: '#ec4899',
            dark: '#be185d',
          },
          amber: {
            light: '#fffbeb',
            DEFAULT: '#f59e0b',
            dark: '#b45309',
          },
        },
        // Semantic colors
        success: {
          light: '#dcfce7',
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        info: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
      },
      // Gradient color stops
      gradientColorStops: {
        'primary-start': '#3a9367',
        'primary-end': '#2a7652',
        'hero-start': '#f0f9f4',
        'hero-end': '#ffffff',
        'cta-start': '#2a7652',
        'cta-end': '#225e43',
      },
      // Background images for gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3a9367, #2a7652)',
        'gradient-secondary': 'linear-gradient(to right, #2a7652, #225e43)',
        'gradient-hero': 'linear-gradient(to bottom, #f0f9f4, #ffffff)',
        'gradient-cta': 'linear-gradient(to right, #2a7652, #225e43)',
        'gradient-feature-green': 'linear-gradient(to bottom right, #dbf0e3, #b9e1ca)',
        'gradient-feature-blue': 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)',
        'gradient-feature-purple': 'linear-gradient(to bottom right, #f3e8ff, #e9d5ff)',
        'gradient-feature-orange': 'linear-gradient(to bottom right, #ffedd5, #fed7aa)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;