export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0B',
          900: '#0A0A0B',
          800: '#18181B',
          700: '#2E2E33',
          600: '#52525B',
        },
        brand: {
          DEFAULT: '#5B5BEF',
          hover: '#4646D6',
          bright: '#B9B9FF',
          soft: '#EEEEFD',
        },
        navy: '#25309A',
        surface: '#F5F5F5',
        canvas: '#FAFAFA',
        line: '#E7E7E9',
        muted: '#6B6B73',
        eco: '#1F9D45',
        sale: '#E5484D',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        snappy: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      maxWidth: {
        site: '1280px',
      },
    },
  },
}
