// We use an explicit public path when the assets are served by webpack
// to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
exports = module.exports = (config) => ({
    compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
    log4js: {
        info: {
            type: 'console'
        },
        error: {
            type: 'console'
        },
        access: {
            type: 'console'
        }
    }
});