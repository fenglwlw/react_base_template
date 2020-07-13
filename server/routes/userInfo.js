'use strict';

const express = require('express');
const user = require('../common/user');
const util = require('../../lib/util');

const NOT_LOGIN_MSG = '登录超时，请重新使用微哨打开费用查询应用！';

const router = express.Router();
router.get('/', function(req, res, next) {
    // user.checkLogin(function (req, res) {
    //   res.json(util.success(req.session.user));

    // }, NOT_LOGIN_MSG, req, res);
    res.json(util.success({
        username: 'fandetao',
        stucode: 'fandetao',
        schcode: 'ruijie',
        photolive: 'http://store.weishao.com.cn///group1/M00/00/00/' +
            'rBGoWlbWpDmIXOKKAABuwQ_W4KsAAAAHBgzoCcAAG7Z490.jpg', // 头像图片地址
        identity: 'teacher', // 身份（student/teacher）,
        gender: 'boy', // 或者boy,
        pycc: 1,
        sex: '男',
        organization: "行政组织架构&0/微哨学院&1/测试系&4",
    }))
});

module.exports = router;