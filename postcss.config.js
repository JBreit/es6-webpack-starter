module.exports = {
    parser: 'sugarss',
    plugins: {
        'autoprefixer': process.env == 'production' ? options.autoprefixer : false,
    },
};