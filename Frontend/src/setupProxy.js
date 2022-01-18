const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api', {
        target: process.env.REACT_APP_API,
        secure: false,
        logLevel: 'debug',
        changeOrigin: true
    }));
};