/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070707',
        card: '#161616',
        brand: { DEFAULT: '#149765', deep: '#0B5E3F', mint: '#1FD8B6', ice: '#C2FFF1' }
      },
      fontFamily: { sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', 'sans-serif'] },
      screens: { tab: { max: '1025px' }, mob: { max: '767px' } }
    }
  },
  plugins: []
};
