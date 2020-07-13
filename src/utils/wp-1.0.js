(function () {
    var wp = window.wp = {
        ready: function(rc) {
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.onReady = rc;
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.ready(rc);
            }
            else {
                //非微信和微哨 ,需要触发下ready方法
                rc();
            }
        },
        checkParam : function(error) {
            if(error) {
                //微哨运行环境下,没有引入whistle.js,抛出错误
                if(this.sys.platformName == this.sys.WHISTLE && !Whistle) {
                    var msg = "在微哨平台下运行,需要引入whistle.js";
                    if(error) {
                        error({
                            errMsg: msg
                        });
                    }
                    else {
                        alert(msg);
                    }
                    
                }
                else if(this.sys.platformName == this.sys.WEIXIN && !wx) {
                    var msg = "在微信平台下运行,需要引入微信jssdk相关js文件";
                    if(error) {
                        error({
                            errMsg: msg
                        });
                    }
                    else {
                        alert(msg);
                    }
                }
            }
        },
        error: function (ec) {
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.onError = ec;
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.error(ec);
            }
        },
        config: function(conf) {
            this.__config = conf;
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.config(conf.whistle ? conf.whistle : {});
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.config(conf.weixin);
            }
        },

        getNetworkType: function (param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.getNetworkType(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.getNetworkType(param);
            }
        },

        checkJsApi: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.checkJsApi(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.checkJsApi(param);
            }
        },

        getLocation: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.getLocation(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.getLocation(param);
            }
        },
        scanQRCode: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.scanQRCode(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.scanQRCode(param);
            }
        },

        chooseImage: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.chooseImage(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.chooseImage(param);
            }
        },
        uploadImage: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.uploadImage(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.uploadImage(param);
            }
        },
        downloadImage: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.downloadImage(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.downloadImage(param);
            }
        },
        startSearchBeacons: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.startSearchBeacons(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.startSearchBeacons(param);
            }
        },
        stopSearchBeacons: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.stopSearchBeacons(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.stopSearchBeacons(param);
            }
        },
        onSearchBeacons: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.onSearchBeacons(param);
            }
            else if(this.sys.platformName == this.sys.WEIXIN) {
                wx.onSearchBeacons(param);
            }
        },
        getDeviceId: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.getDeviceId(param);
            }
            else {
                if(param.fail) {
                    param.fail({
                        errMsg: '该平台('+this.sys.platformName+')不支持getDeviceId接口'
                    });
                }
            }
        },
        startPedometer: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.startPedometer(param);
            }
            else {
                if(param.fail) {
                    param.fail({
                        errMsg: '该平台('+this.sys.platformName+')不支持startPedometer接口'
                    });
                }
            }
        },

        stopPedometer: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.stopPedometer(param);
            }
            else {
                if(param.fail) {
                    param.fail({
                        errMsg: '该平台('+this.sys.platformName+')不支持stopPedometer接口'
                    });
                }
            }
        },

        getPedometerStatus: function(param) {
            this.checkParam(param.fail);
            if(this.sys.platformName == this.sys.WHISTLE) {
                Whistle.getPedometerStatus(param);
            }
            else {
                if(param.fail) {
                    param.fail({
                        errMsg: '该平台('+this.sys.platformName+')不支持getPedometerStatus接口'
                    });
                }
            }
        },

        getWXProxy: function() {
          return wx;
        },

        _initSys: function () {
            this.sys = {
                ANDROID: 'android',
                IOS: 'iOS',
                OTHER: 'other',
                WHISTLE: 'whistle',
                WEIXIN: 'weixin'
            };
            var ua =  window.navigator.userAgent.toLowerCase();
            var iOS = ( ua.match(/(iPad|iPhone|iPod)/i) ? true : false );
            var isAndroid = ua.match(/android/i) ? true : false;
            if (iOS) {
                this.sys.osName = this.sys.IOS;
                __nativeWhistleProxy = window.__nativeWhistleProxy = {};
            } else if (isAndroid) {
                this.sys.osName = this.sys.ANDROID;
                this._isReady = true;
            } else {
                this.sys.osName = this.sys.OTHER;
            }

            if(ua.match(/MicroMessenger/i) == 'micromessenger') {
                this.sys.platformName = this.sys.WEIXIN;
            }
            else if(ua.match(/weishao/i) == 'weishao') {
                this.sys.platformName = this.sys.WHISTLE;
            }
            else {
                this.sys.platformName = this.sys.OTHER;
            }

        },
    };
    wp._initSys();
})();