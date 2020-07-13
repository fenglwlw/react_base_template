const _debug = require('debug');
const path = require('path');
const { argv } = require('yargs');
const ip = require('ip');

const ipAddress = ip.address();
const debug = _debug('app:config:_base');
const config = {
    env: process.env.NODE_ENV || 'development',

    // ----------------------------------
    // Base name for react-router
    // ----------------------------------
    'app_base_name': process.env.BASENAME || 'hello',

    // ----------------------------------
    // Project Structure
    // ----------------------------------
    'path_base': path.resolve(__dirname, '..'),
    'dir_client': 'src',
    'dir_dist': 'dist',
    'dir_server': 'server',
    'dir_test': 'tests',

    // ----------------------------------
    // Server Configuration
    // ----------------------------------
    'server_host': ipAddress,
    'server_port': process.env.PORT || 3000,

    // ----------------------------------
    // API Server Configuration
    // ----------------------------------
    'api_host': ipAddress,
    'api_port': process.env.PORT || 8001,

    // ----------------------------------
    // Compiler Configuration
    // ----------------------------------
    'compiler_css_modules': true,
    'compiler_devtool': 'source-map',
    'compiler_hash_type': 'hash',
    'compiler_fail_on_warning': false,
    'compiler_quiet': false,
    'compiler_public_path': '/',
    'compiler_stats': {
        chunks: false,
        chunkModules: false,
        colors: true
    },
    'compiler_vendor': [
        'react',
        'react-router-dom',
        'react-dom',
        // 'react-addons-css-transition-group',
        'react-redux',
        'redux',
        'redux-thunk'
    ],

    // ----------------------------------
    // Test Configuration
    // ----------------------------------
    'coverage_enabled': !argv.watch,
    'coverage_reporters': [
        { type: 'text-summary' },
        { type: 'lcov', dir: 'coverage' }
    ]
};

/************************************************
 -------------------------------------------------

 All Internal Configuration Below
 Edit at Your Own Risk

 -------------------------------------------------
 ************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
    'process.env': {
        'NODE_ENV': JSON.stringify(config.env)
    },
    'NODE_ENV': config.env,
    '__DEV__': config.env === 'development',
    '__PROD__': config.env === 'production',
    '__TEST__': config.env === 'test',
    '__DEBUG__': config.env === 'development' && !argv.no_debug,
    '__BASENAME__': JSON.stringify('/' + config.app_base_name)
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config['compiler_vendor'] = config['compiler_vendor']
    .filter((dep) => {
        if (pkg.dependencies[dep]) return true;

        debug(
            `Package "${dep}" was not found as an npm dependency in package.json; ` +
            `it won't be included in the webpack vendor bundle. Consider removing it from vendor_dependencies in ~/config/index.js`
        );
    });

// ------------------------------------
// Utilities
// ------------------------------------
config['utils_paths'] = (() => {
    const resolve = path.resolve;
    const base = (...args) =>
        resolve.apply(resolve, [config.path_base, ...args]);
    return {
        base: base,
        client: base.bind(null, config.dir_client),
        dist: base.bind(null, config.dir_dist)
    };
})();

// ------------------------------------
// Proxy
// ------------------------------------
config.proxy = {
    enabled: true,
    options: {
        host: `http://${config.api_host}:${config.api_port}/api`,
        match: `/api/${config.app_base_name}`
    }
};

exports = module.exports = config;