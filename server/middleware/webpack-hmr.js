const WebpackHotMiddleware = require('webpack-hot-middleware');
const _debug = require('debug');

const debug = _debug('app:server:webpack-hmr');

exports = module.exports = function(compiler, opts) {
    debug('Enable Webpack Hot Module Replacement (HMR).');

    const middleware = WebpackHotMiddleware(compiler, opts);
    return middleware;
}