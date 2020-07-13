'use strict';

const config = require('../../config');
const log4js = require('log4js');
const Config = config.log4js;

exports = module.exports = {
    logInfo: function(data) {
        log4js.configure({
            appenders: {
                cheese: {
                    type: Config.info.type, // 文件输出
                    filename: Config.info.filename || 'cheese',
                    maxLogSize: 1024 * 1024 * 20,
                    backups: 4,
                    category: 'normal'
                }
            },
            categories: {
                default: {
                    appenders: ['cheese'],
                    level: 'error'
                }
            }
        });
        const logger = log4js.getLogger('normal');
        logger.info('INFO');
        logger.info(data);
    },

    logError: function(data) {
        log4js.configure({
            appenders: {
                cheese: {
                    type: Config.error.type, // 文件输出
                    filename: Config.error.filename,
                    maxLogSize: 1024 * 1024 * 20,
                    backups: 4,
                    category: 'ERROR'
                }
            },
            categories: {
                default: {
                    appenders: ['cheese'],
                    level: 'error'
                }
            }
        });
        const logger = log4js.getLogger('ERROR');
        logger.error('ERROR');
        logger.error(data);
    },

    connectLogger: function() {
        log4js.configure({
            appenders: {
                cheese: {
                    type: Config.access.type, // 文件输出
                    filename: Config.access.filename,
                    maxLogSize: 1024 * 1024 * 20,
                    backups: 4,
                    category: 'normal'
                }
            },
            categories: {
                default: {
                    appenders: ['cheese'],
                    level: 'error'
                }
            }
        });

        const logger = log4js.getLogger('normal');
        logger.info('INFO');
        return log4js.connectLogger(logger, { level: log4js.levels.INFO });
    }
};