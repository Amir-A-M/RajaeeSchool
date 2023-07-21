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
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [
    require("@xpd/tailwind-3dtransforms")
  ],
}