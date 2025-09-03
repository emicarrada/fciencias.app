/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0ebff',
          200: '#c7d9ff',
          300: '#a4c1ff',
          400: '#8199ff',
          500: '#5d73ff',
          600: '#4148ff',
          700: '#041737', // Color primario principal
          800: '#030f24',
          900: '#020a18',
        },
        secondary: {
          50: '#ffffff',
          100: '#ffffff',
          500: '#ffffff',
          900: '#ffffff',
        },
        accent: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e', // Verde para éxito
            600: '#16a34a',
            700: '#15803d',
          },
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444', // Rojo para error
            600: '#dc2626',
            700: '#b91c1c',
          },
        },
        text: {
          primary: '#111111', // Texto principal
          secondary: '#222222', // Texto secundario
          muted: '#6b7280', // Texto atenuado
          inverse: '#ffffff', // Texto sobre backgrounds oscuros
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        heading: ['Helvetica Neue', 'Poppins', 'sans-serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
