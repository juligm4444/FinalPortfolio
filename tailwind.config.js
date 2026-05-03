/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: {
          light: '#1F2624',
          DEFAULT: '#141A18',
          dark: '#0B0E0D',
        },
        pink: {
          light: '#FF85B6',
          DEFAULT: '#FF3D90',
          dark: '#FF0066',
        },
        gray: {
          light: '#535C61',
          DEFAULT: '#3F4548',
          dark: '#2F3335',
        },
        white: {
          light: '#EDEDE8',
          DEFAULT: '#E1E0DC',
          dark: '#D3D2CF',
        },
      },
      fontFamily: {
        display: ['"Libre Baskerville"', 'serif'],
        body: ['"Roboto Mono"', 'monospace'],
        nav: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        h1: ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        h2: ['44px', { lineHeight: '1.15', fontWeight: '700' }],
        h3: ['34px', { lineHeight: '1.2', fontWeight: '700' }],
        h4: ['26px', { lineHeight: '1.3', fontWeight: '500' }],
        h5: ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        h6: ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        p: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        label: ['12px', { lineHeight: '1.3', fontWeight: '500' }],
        navbar: ['24px', { lineHeight: '1.45', fontWeight: '400' }],
        'navbar-selected': ['24px', { lineHeight: '1.45', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
}
