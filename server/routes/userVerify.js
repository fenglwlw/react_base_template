'use strict';

const express = require('express');
const request = require('request');
const config = require('../config.json');

const router = express.Router();
router.get('/:appname', function(req, res, next) {
    try {
        const schcode = req.query.code.trim(); // 学校编码
        const verify = req.query.verify;
        const domain = req.query.domain;
        if (schcode && verify && domain) {
            const handler = function(err, data) {
                if (err) {
                    res.render('error', { error: err });
                    return;
                }
                if (data.student_number) {
                    // 设置会话/**/
                    req.session.user = {
                        username: data.name, // 姓名
                        stucode: data.student_number, // 教职工号 "123",
                        schcode: schcode, // 学校编码     12345",
                        photolive: data.photo_live, // 头像图片地址
                        identity: data.identity // 身份（student/teacher）
                    };
                    console.log();
                    const hour = 3600000;
                    req.session.cookie.expires = new Date(Date.now() + hour);
                    req.session.cookie.maxAge = hour;
                    res.redirect('/' + req.params.appname);
                } else {
                    res.render('error', { error: { status: '认证失败', message: '无法识别学工号！' } });
                }
            };
            const appKey = config.oauth.key;
            if (req.session.auth && req.session.auth.expires > Date.now()) {
                // Verify user info if oauth info in session is still valid
                getUserInfo(verify, domain, appKey, req.session.auth.access_token, handler);
                return;
            }
            // Get OAuth access token
            getAccessToken(function(err, json) {
                if (err) {
                    res.render('error', { error: err });
                    return;
                }
                if (json && json.access_token) {
                    // Save access token into session
                    req.session.auth = {
                        access_token: json.access_token,
                        expires: new Date(Date.now() + json.expires_in * 1000),
                        refresh_token: json.refresh_token
                    };
                    // Verify user info with access token
                    getUserInfo(verify, domain, appKey, json.access_token, handler);
                } else {
                    res.render('error', { error: { status: '认证失败', message: '用户身份认证失败！code:Access Token获取失败' } });
                }
            });
        } else {
            res.render('error', { error: { status: '服务器内部错误', message: '参数错误' } });
        }
    } catch (err) {
        res.render('error', { error: { status: '服务器内部错误', message: err } });
    }
});


function getAccessToken(callback) {
    const oauth = config.oauth;
    const options = {
        url: oauth.url,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json'
        },
        body: {
            grant_type: 'client_credentials',
            app_key: oauth.key,
            app_secret: oauth.secret,
            scope: 'all'

        },
        strictSSL: false
    };
    request(options, function(err, response, json) {
        if (err) {
            callback({ status: '认证失败', message: '用户身份认证失败！code:' + err }, '');
            return;

        }
        if (response.statusCode !== 200) {
            callback({ status: '认证失败', message: '用户身份认证失败！code:' + response.statusCode }, '');
            return;
        }
        callback(null, json);
    });
}

function getUserInfo(verify, domain, appKey, accessToken, callback) {
    const url = 'https://api.weishao.com.cn/api/index.php?m=user&a=authUser&' +
        `verify=${verify}&domain=${domain}&app_key=${appKey}&access_token=${accessToken}`;
    request({
        url: url,
        method: 'GET',
        json: true,
        strictSSL: false
    }, function(err, response, json) {
        if (err) {
            callback({ status: '认证失败', message: '无法获取身份信息！code:' + err }, '');
            return;
        }
        if (response.statusCode !== 200) {
            callback({ status: '认证失败', message: '无法获取身份信息！code:' + response.statusCode }, '');
            return;
        }
        if (json && json.ret === 0 && json.data) {
            callback(null, json.data);
        } else {
            callback({ status: '认证失败', message: '无法获取身份信息' }, '');
        }
    });
}

module.exports = router;