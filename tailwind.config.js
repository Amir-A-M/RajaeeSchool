/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./build/**/*.{html,js}"
  ],
  theme: {
    extend: {
      height: {
        'screen': '100dvh',
      },
      minHeight: {
        'screen': '100dvh',
      },
      keyframes: {
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(100%)' },
        },
        jelly: {
          'from': { transform: 'scale(1, 1)' },
          '30%': { transform: 'scale(1.25, .75)' },
          '40%': { transform: 'scale(.75, 1.25)' },
          '50%': { transform: 'scale(1.15, .85)' },
          '65%': { transform: 'scale(.95, 1.05)' },
          '75%': { transform: 'scale(1.05, .95)' },
          'to': { transform: 'scale(1, 1)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        jelly: 'jelly 0.6s ease',
      },
    },
  },
  plugins: [
    require("@xpd/tailwind-3dtransforms")
  ],
}