const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('../config');
const _debug = require('debug');
const debug = _debug('app:webpack:config');
const paths = config.utils_paths;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const { __DEV__, __PROD__, __TEST__ } = config.globals;
const theme = require('../package.json').theme;
debug('Create configuration.');
const webpackConfig = {
    mode: __PROD__ ? 'production' : __DEV__ && 'development',
    devtool: __PROD__ ?
        shouldUseSourceMap ?
        'source-map' :
        false : __DEV__ && 'eval-source-map',
    name: 'client',
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            views: paths.client('views/'),
            styles: paths.client('styles/'),
            strings: paths.client('strings/'),
            utils: paths.client('utils/'),
            images: paths.client('images/'),
            containers: paths.client('containers/'),
            components: paths.client('components/'),
            layouts: paths.client('layouts/'),
            reduxdir: paths.client('redux/'),
            store: paths.client('redux/'),
            '@redux': paths.client('redux/'),
            routes: paths.client('routes/')
        }
    },
    module: {
        rules: []
    },
    optimization: {
        minimize: __PROD__,
        minimizer: [
            // This is only used in production mode
            // This is only used in production mode
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending futher investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: shouldUseSourceMap,
            }),
            // This is only used in production mode
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    map: shouldUseSourceMap ? {
                        // `inline: false` forces the sourcemap to be output into a
                        // separate file
                        inline: false,
                        // `annotation: true` appends the sourceMappingURL to the end of
                        // the css file, helping the browser find the sourcemap
                        annotation: true,
                    } : false,
                },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATH = paths.client('main.js');

webpackConfig.entry = {
    app: __DEV__ ?
        [APP_ENTRY_PATH, "babel-polyfill",`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`] : [APP_ENTRY_PATH,"babel-polyfill"]
};
// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
    filename: __PROD__ ?
        '[name].[chunkhash:8].js' : __DEV__ && '[name].js',
    chunkFilename: __PROD__ ?
        '[name].[chunkhash:8].js' : __DEV__ && '[name].js',
    path: paths.dist(__DEV__ ? '' : config.app_base_name),
    publicPath: config.compiler_public_path
};
// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
    new webpack.DefinePlugin(config.globals),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin(
        Object.assign({}, {
                inject: true,
                template: paths.client('index.html'),
            },
            __PROD__ ? {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            } : undefined
        )
    ),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];
if (__DEV__) {
    debug('Enable plugins for live development (HMR, NoErrors).');
    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
} else if (__PROD__) {
    debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
    webpackConfig.plugins.push(
        new CleanWebpackPlugin(['dist'], {
            root: paths.base()
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[hash:8].css',
            chunkFilename: '[name].[contenthash:8].css',
        })
    );
    // webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
if (!__TEST__) {
    webpackConfig.plugins.push(
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['vendor']
        // })
    );
}
// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
        cacheDirectory: true
    }
}]
// File loaders
webpackConfig.module.rules.push({
    test: /\.woff(\?.*)?$/,
    loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
}, {
    test: /\.woff2(\?.*)?$/,
    loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
}, {
    test: /\.otf(\?.*)?$/,
    loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
}, {
    test: /\.ttf(\?.*)?$/,
    loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
}, {
    test: /\.eot(\?.*)?$/,
    loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'
}, {
    test: /\.svg(\?.*)?$/,
    loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
}, {
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader?name=images/[hash:8].[ext]&limit=8192'
})
// ------------------------------------
// Style Loaders
// ------------------------------------
// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        __DEV__ && require.resolve('style-loader'),
        __PROD__ && {
            loader: MiniCssExtractPlugin.loader,
            // options: Object.assign({},
            //     shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
            // ),
        }, {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        }, {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        stage: 3,
                    }),
                ],
                sourceMap: __PROD__ ? shouldUseSourceMap : __DEV__,
            },
        },
    ].filter(Boolean);
    if (preProcessor) {
        let loader = {
            loader: require.resolve(preProcessor),
            options: {
              sourceMap: __PROD__ ? shouldUseSourceMap : __DEV__,
            },
        }
        if (preProcessor === "less-loader") {
            loader.options.modifyVars = theme
            loader.options.javascriptEnabled = true
        }
        loaders.push(loader);
    }
    return loaders;
};
// ------------------------------------
// Style Configuration
// ------------------------------------
webpackConfig.module.rules.push(
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use MiniCSSExtractPlugin to extract that CSS
    // to a file, but in development "style" loader enables hot editing
    // of CSS.
    // By default we support CSS Modules with the extension .module.css
    {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: __PROD__ ?
                shouldUseSourceMap : __DEV__,
        }),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    {
        test: cssModuleRegex,
        use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: __PROD__ ?
                shouldUseSourceMap : __DEV__,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent,
        }),
    },
    // Opt-in support for SASS (using .scss or .sass extensions).
    // By default we support SASS Modules with the
    // extensions .module.scss or .module.sass
    {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders({
                importLoaders: 2,
                sourceMap: __PROD__ ?
                    shouldUseSourceMap : __DEV__,
            },
            'sass-loader'
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
    },
    // Adds support for CSS Modules, but using SASS
    // using the extension .module.scss or .module.sass
    {
        test: sassModuleRegex,
        use: getStyleLoaders({
                importLoaders: 2,
                sourceMap: __PROD__ ?
                    shouldUseSourceMap : __DEV__,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
            },
            'sass-loader'
        ),
    },
    {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders({ importLoaders: 2 }, 'less-loader'),
    },
    {
        test: lessModuleRegex,
        use: getStyleLoaders(
            {
                importLoaders: 2,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
            },
            'less-loader'
        ),
    }
)
exports = module.exports = webpackConfig;