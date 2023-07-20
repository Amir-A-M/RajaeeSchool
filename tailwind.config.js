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
    },
  },
  plugins: [
    require("@xpd/tailwind-3dtransforms")
  ],
}