/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA', // Accent
          500: '#8B5CF6',
          600: '#6D5BD0', // Secondary
          700: '#5B3A8E', // Primary
          800: '#4C1D95',
          900: '#3B0764',
          950: '#2E1065',
        },
        // Alias maroon to purple so existing utility classes render in InkVerse palette
        maroon: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#A78BFA',
          300: '#C4B5FD',
          400: '#8B5CF6',
          500: '#6D5BD0',
          600: '#6D5BD0',
          700: '#5B3A8E',
          800: '#4C1D95',
          900: '#312E81',
          950: '#1E1B4B',
        },
        surface: {
          light: '#F8FAFC', // Background #F8FAFC
          cardLight: '#FFFFFF', // Cards #FFFFFF
          dark: '#0F172A', // Dark mode Slate 900
          cardDark: '#1E293B', // Dark mode Slate 800
          borderDark: '#334155',
        },
        text: {
          primary: '#1E293B', // Text #1E293B
          secondary: '#64748B',
          darkPrimary: '#F8FAFC',
          darkSecondary: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'brand-glow': '0 8px 30px rgba(91, 58, 142, 0.15)',
        'brand-hover': '0 14px 40px rgba(109, 91, 208, 0.25)',
        'maroon-glow': '0 8px 30px rgba(91, 58, 142, 0.15)',
        'maroon-hover': '0 14px 40px rgba(109, 91, 208, 0.25)',
      },
    },
  },
  plugins: [],
};
