module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': { stage: 1 },
    cssnano: {
      preset: 'default',
    },
    'postcss-reporter': {},
  },
};