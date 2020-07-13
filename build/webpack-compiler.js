const webpack = require('webpack');
const _debug = require('debug');
const config = require('../config');

const debug = _debug('app:build:webpack-compiler');
const DEFAULT_STATS_FORMAT = config.compiler_stats;

exports = module.exports = function webpackCompiler(webpackConfig, statsFormat = DEFAULT_STATS_FORMAT) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig);

        compiler.run((err, stats) => {
            debug('Webpack compile completed.');

            if (err) {
                debug('Webpack compiler encountered a fatal error.', err);
                return reject(err);
            } else {
                const jsonStats = stats.toJson();

                debug(stats.toString(statsFormat));

                if (jsonStats.errors.length > 0) {
                    debug('Webpack compiler encountered errors.');
                    debug(jsonStats.errors.join('\n'));
                    return reject(new Error('Webpack compiler encountered errors'));
                } else if (jsonStats.warnings.length > 0) {
                    debug('Webpack compiler encountered warnings.');
                    debug(jsonStats.warnings.join('\n'));
                } else {
                    debug('No errors or warnings encountered.');
                }

                resolve(jsonStats);
            }
        });
    });
}