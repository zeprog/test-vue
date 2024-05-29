module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/brand_static/'
        : '/',
    devServer: {
        proxy: 'http://localhost:3003'
    }
}