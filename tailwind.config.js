/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mist: 'var(--mist)',
        concrete: {
          100: 'var(--concrete-100)',
          300: 'var(--concrete-300)',
          500: 'var(--concrete-500)',
          900: 'var(--concrete-900)',
        },
        moss: {
          400: 'var(--moss-400)',
          700: 'var(--moss-700)',
        },
        bloom: {
          DEFAULT: 'var(--bloom)',
          deep: 'var(--bloom-deep)',
          ink: 'var(--bloom-ink)',
        },
        // Semantic
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        cta: {
          DEFAULT: 'var(--cta-bg)',
          text: 'var(--cta-text)',
        },
      },
      fontFamily: {
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
        label: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        nav: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-h1)', letterSpacing: 'var(--tracking-h1)', fontWeight: '700' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-h2)', fontWeight: '700' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-h3)', fontWeight: '700' }],
        species: ['var(--text-species)', { lineHeight: 'var(--leading-h3)', fontStyle: 'italic' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        small: ['var(--text-small)', { lineHeight: 'var(--leading-body)' }],
        label: ['var(--text-label)', { lineHeight: '1.3', letterSpacing: 'var(--tracking-label)', fontWeight: '500' }],
        'label-sm': ['var(--text-label-sm)', { lineHeight: '1.3', letterSpacing: 'var(--tracking-label)', fontWeight: '500' }],
        // Legacy sizes still referenced by old pages.
        h4: ['26px', { lineHeight: '1.3', fontWeight: '500' }],
        h5: ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        h6: ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        p: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        navbar: ['24px', { lineHeight: '1.45', fontWeight: '400' }],
        'navbar-selected': ['24px', { lineHeight: '1.45', fontWeight: '700' }],
      },
      spacing: {
        'nav-offset': 'var(--nav-offset)',
      },
      maxWidth: {
        content: 'var(--content-max)',
      },
      borderRadius: {
        slab: 'var(--radius-slab)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        slab: 'var(--slab-shadow)',
        'slab-pressed': 'var(--slab-shadow-pressed)',
        cta: 'var(--cta-shadow)',
      },
    },
  },
  plugins: [],
}
