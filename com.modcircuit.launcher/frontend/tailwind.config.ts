import type { Config } from 'tailwindcss'

export default {
  content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./app.vue", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: '#1a1f2e',
        foreground: '#e8eaed',
        card: '#232938',
        'card-foreground': '#e8eaed',
        primary: '#4ade80',
        'primary-foreground': '#1a1f2e',
        secondary: '#2d3548',
        'secondary-foreground': '#e8eaed',
        muted: '#2d3548',
        'muted-foreground': '#9ca3af',
        accent: '#ef4444',
        'accent-foreground': '#ffffff',
        border: '#3d4558',
        input: '#2d3548',
        ring: '#4ade80',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
      transitionTimingFunction: {
        'drawer-open': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'drawer-close': 'cubic-bezier(0.5, 0, 0.75, 0)',
      },
    },
  },
  plugins: [],
} satisfies Config
