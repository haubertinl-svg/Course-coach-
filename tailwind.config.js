/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#05070a', 900: '#0a0e14', 800: '#101620', 700: '#18202d' },
        mint: { 300: '#8ff5cf', 400: '#4df0b4', 500: '#1fe0a0', 600: '#10b981' },
        ember: { 400: '#ffa24d', 500: '#ff8a1f' },
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '-apple-system', '"SF Pro Display"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(77,240,180,0.45)',
        glass: '0 10px 40px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        rise: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(77,240,180,0.45)' }, '50%': { boxShadow: '0 0 0 12px rgba(77,240,180,0)' } },
      },
      animation: {
        rise: 'rise .45s cubic-bezier(.2,.8,.2,1) both',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
