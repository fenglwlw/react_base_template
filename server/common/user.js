'use strict';

/**
 * 会话处理
 */
const log4js = require('./log4js');
const util = require('../../lib/util');

exports = module.exports = {
    /**
     * 检查登录状态，并处理未登录或异常情况。
     * @param callback 已登录回调
     * @param notLoginMsg 未登录提示
     * @param req
     * @param res
     */
    checkLogin: function(callback, notLoginMsg, req, res) {
        try {
            if (req.session.user) {
                callback(req, res);
            } else {
                res.json(util.error(notLoginMsg));
            }
        } catch (ex) {
            log4js.logError(ex);
            res.json(util.error(util.getErrorMessage(ex)));
        }
    }
};