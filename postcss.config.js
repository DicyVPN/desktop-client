module.exports = {
    plugins: {
        'tailwindcss/nesting': 'postcss-nesting',
        tailwindcss: require('./tailwind.config.js'),
        autoprefixer: {}
    },
}
