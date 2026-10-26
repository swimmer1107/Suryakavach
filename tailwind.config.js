/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          950: '#030712',
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111d35',
          600: '#162040',
          500: '#1a2550',
        },
        'cyan': {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        'risk': {
          safe: '#22c55e',
          moderate: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Geist Mono', 'JetBrains Mono', 'Consolas', 'monospace'],
        'display': ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scan 4s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'data-pulse': 'dataPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 211, 238, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)' },
        },
        dataPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
}
