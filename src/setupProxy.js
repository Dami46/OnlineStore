const proxy = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs')

module.exports = function (app) {
    app.use(proxy('/api', {
        target: 'http://localhost:' + 8080,
        logLevel: 'debug',
        ws: true
    }));
};