module.exports = {
  plugins: {
    'autoprefixer': process.env === 'production' ? options.autoprefixer : false,
    'precss': require('precss'),
  },
};