/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      keyframes: {
        // Slow ambient blobs — large blurred shapes that drift behind the hero
        'blob-1': {
          '0%, 100%': { transform: 'translate(0px,   0px)   scale(1)'   },
          '33%':       { transform: 'translate(40px,  -60px) scale(1.08)' },
          '66%':       { transform: 'translate(-25px,  30px) scale(0.94)' },
        },
        'blob-2': {
          '0%, 100%': { transform: 'translate(0px,   0px)   scale(1)'   },
          '33%':       { transform: 'translate(-35px, 55px)  scale(0.92)' },
          '66%':       { transform: 'translate(25px, -25px)  scale(1.06)' },
        },
        'blob-3': {
          '0%, 100%': { transform: 'translate(0px,   0px)   scale(1)'   },
          '33%':       { transform: 'translate(50px,  35px)  scale(1.1)'  },
          '66%':       { transform: 'translate(-35px, -20px) scale(0.92)' },
        },
        // Section scroll-reveal — subtle upward drift into view
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        // Aurora background blobs — large, very slow, wide drift for ambient wash effect
        'aurora-1': {
          '0%, 100%': { transform: 'translate(0px,    0px)   scale(1)'    },
          '25%':      { transform: 'translate(70px,  -90px)  scale(1.08)' },
          '50%':      { transform: 'translate(-50px,  70px)  scale(0.94)' },
          '75%':      { transform: 'translate(90px,   50px)  scale(1.05)' },
        },
        'aurora-2': {
          '0%, 100%': { transform: 'translate(0px,    0px)   scale(1)'    },
          '25%':      { transform: 'translate(-80px,  60px)  scale(0.91)' },
          '50%':      { transform: 'translate(60px,  -80px)  scale(1.09)' },
          '75%':      { transform: 'translate(-40px, -40px)  scale(0.96)' },
        },
        'aurora-3': {
          '0%, 100%': { transform: 'translate(0px,    0px)   scale(1)'    },
          '33%':      { transform: 'translate(100px,  70px)  scale(1.07)' },
          '66%':      { transform: 'translate(-70px, -50px)  scale(0.93)' },
        },
        'aurora-4': {
          '0%, 100%': { transform: 'translate(0px,    0px)   scale(1)'    },
          '25%':      { transform: 'translate(-60px, -70px)  scale(1.1)'  },
          '50%':      { transform: 'translate(80px,   50px)  scale(0.92)' },
          '75%':      { transform: 'translate(-30px,  90px)  scale(1.06)' },
        },
      },
      animation: {
        'blob-1':    'blob-1   9s  ease-in-out infinite',
        'blob-2':    'blob-2   12s ease-in-out infinite',
        'blob-3':    'blob-3   15s ease-in-out infinite',
        'fade-up':   'fade-up  0.55s ease-out both',
        'aurora-1':  'aurora-1 11s ease-in-out infinite',
        'aurora-2':  'aurora-2 14s ease-in-out infinite',
        'aurora-3':  'aurora-3  9s ease-in-out infinite',
        'aurora-4':  'aurora-4 13s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
