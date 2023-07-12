module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: 'default',
    },
    'postcss-preset-env': { stage: 1 },
    'postcss-reporter': {},
  },
};