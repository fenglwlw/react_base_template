const WebpackDevMiddleware = require('webpack-dev-middleware');
const _debug = require('debug');
const config = require('../../config');

const paths = config.utils_paths;
const debug = _debug('app:server:webpack-dev');

exports = module.exports = function(compiler, publicPath) {
    debug('Enable webpack dev middleware.');

    const middleware = WebpackDevMiddleware(compiler, {
        publicPath,
        contentBase: paths.client(),
        hot: true,
        quiet: config.compiler_quiet,
        noInfo: config.compiler_quiet,
        lazy: false,
        stats: config.compiler_stats
    });
    return middleware;
}