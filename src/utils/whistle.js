(function () {
    var win = window, nav = win.navigator, doc = document, docEle = doc.documentElement;
    var browserType = '';
    if(win.JSNativeProxy === void 0 || win.JSNativeProxy === null){
        var ua = nav.userAgent.toLowerCase();
        var browserTypes = ua.match(/weishao/i);
        if (browserTypes && browserTypes.length > 0) {
            browserType = browserTypes[0];
        } else {
            browserType = "other";
        }
    }else{
        browserType = "WeishaoCCRuntime";
        window.__nativeWhistleProxy = win.JSNativeProxy;
    }
    var Whistle = window.Whistle = {
        __successCallbackBuffer: {},
        __failCallbackBuffer: {},
        __cancelCallbackBuffer: {},
        __completeCallbackBuffer: {},
        _gui: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                /[xy]/g,
                function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r
                        : (r & 0x3 | 0x8);
                    return v.toString(16);
                }).toUpperCase();
        },
        __clearCallbackForCommand: function (commandId) {
            if(this.__successCallbackBuffer[commandId]) delete this.__successCallbackBuffer[commandId];
            if(this.__failCallbackBuffer[commandId]) delete this.__failCallbackBuffer[commandId];
            if(this.__completeCallbackBuffer[commandId]) delete this.__completeCallbackBuffer[commandId];
            if(this.__cancelCallbackBuffer[commandId]) delete this.__cancelCallbackBuffer[commandId];
        },
        __onCommandSuccessCallback: function (commandId, resultString) {
            var result = JSON.parse(resultString);
            var callback = this.__successCallbackBuffer[commandId];
            if (callback) {

                callback(result);
            }
            callback = this.__completeCallbackBuffer[commandId];
            if (callback) {
                callback(result);
            }
            this.__clearCallbackForCommand(commandId);
        },

        __onCommandFailCallback: function (commandId, resultString) {
            var result = JSON.parse(resultString);
            var callback = this.__failCallbackBuffer[commandId];
            if (callback) {
                callback(result);
            }
            callback = this.__completeCallbackBuffer[commandId];
            if (callback) {
                callback(result);
            }
            this.__clearCallbackForCommand(commandId);

        },

        __onCommandCancelCallback: function (commandId, resultString) {
            var result = JSON.parse(resultString);
            var callback = this.__cancelCallbackBuffer[commandId];
            if (callback) {
                callback(result);
            }
            this.__clearCallbackForCommand(commandId);

        },
        __onReady: function () {
            this._isReady = true;

            if(__nativeWhistleProxy.configApp(JSON.stringify(this.__whistleAppConfig))){
                if (this._isFunction(this.onReady)) {
                    this.onReady();
                }
            }else{
                this.__onError();
            }

        },
        __onError: function () {
            if (this._isFunction(this.onError)) {
                this.onError();
            }
        },

        _isReady: false,
        _isObject: function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },
        _isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        _isFunction: function (func) {
            return typeof func == 'function' || false;
        },
        _isString: function (obj) {
            return typeof obj == 'string' || Object.prototype.toString.call(obj) == '[object String]';
        },
        _isUndefinedOrNull: function (data) {
            if (data === void 0) {
                return true;
            }
            if (data === null) {
                return true;
            }
            return false;
        },
        _isNumber: function (num) {
            return typeof num == 'number' || Object.prototype.toString.call(num) == '[object Number]';
        },
        _isNaN: function (num) {
            return this._isNumber(num) && num !== +num;

        },
        _registerCallback: function (apiName, commandId, key, func, allowEmpty) {
            if (!this._isUndefinedOrNull(func)) {

                if (!this._isFunction(func)) {
                    this._parameterError(apiName, key + '字段不是回调函数。');
                    return false;
                }
                this["__" + key + "CallbackBuffer"][commandId] = func;
                return true;
            }else if(allowEmpty){
                return true;
            }
            this._parameterError(apiName, key + '字段不能为空。');
            return false;

        },

        _normalizeArrayValue: function (apiName, key, originalArray, refValueArray, allowEmpty) {
            if (this._isUndefinedOrNull(originalArray)) {
                if (!allowEmpty) {
                    this._parameterError(apiName, key + '没有设定值。');
                    return;
                } else {
                    return refValueArray;
                }
            } else {
                if (this._isArray(originalArray)) {
                    if (originalArray.length == 0) {
                        if (!allowEmpty) {
                            this._parameterError(apiName, key + '没有包含指定的值。');
                            return;
                        } else {
                            return refValueArray;
                        }
                    }
                    var result = [];
                    for (var i = 0; i < originalArray.length; i++) {
                        if (result.indexOf(originalArray[i]) < 0) {
                            if (refValueArray.indexOf(originalArray[i]) >= 0) {
                                result.push(originalArray[i]);
                            } else {
                                this._parameterError(apiName, key + '包含了不能识别的值' + originalArray[i]);
                                return;
                            }
                        }
                    }
                    return result;

                } else {
                    this._parameterError(apiName, key + '不是数组类型。');
                    return;
                }
            }
        },

        _initSys: function () {
            this.sys = {
                ANDROID: 'android',
                IOS: 'iOS',
                OTHER: 'other'
            };
            var iOS = ( ua.match(/(iPad|iPhone|iPod)/i) ? true : false );
            var isAndroid = ua.match(/android/i) || nav.platform.match(/android/i) ? true : false;
            if (iOS) {
                this.sys.osName = this.sys.IOS;
                __nativeWhistleProxy = window.__nativeWhistleProxy = {};
            } else if (isAndroid) {
                this.sys.osName = this.sys.ANDROID;
                this._isReady = true;
            } else {
                this.sys.osName = this.sys.OTHER;
            }
            this.sys.browserType = browserType;

        },
        _checkStatusAndParameter: function (apiName, para) {
            if (!this._isReady) {
                this._statusError();
                return false;
            }
            if (!this._isObject(para)) {
                this._parameterError(apiName, '参数不是JSON对象。');
                return false;
            }
            return true;
        },

        _statusError: function (apiName) {

            alert(apiName + "不能调用，因为Whistle还没有ready。");
        },
        _parameterError: function (apiName, errorMsg) {
            alert(apiName + " " + errorMsg);
        },
        config:function(option){
            if(!this._isObject(option)){
                alert("config的参数必须是对象.");
                return;
            }
            if(this._isUndefinedOrNull(option.appId)){
                alert("config的参数中必须指定appId.");
                return;
            }
            this.__whistleAppConfig = option;
        },
        debugOut: function (str) {
            if (this._isReady) {
                __nativeWhistleProxy.debugOut(str);
            }
        },
        /*
         wx.checkJsApi({
         jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
         success: function(res) {
         // 以键值对的形式返回，可用的api值true，不可用为false
         // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
         }
         });

         */
        checkJsApi: function (option) {
            var apiName = 'checkJsApi';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            if (!this._isArray(option.jsApiList)) {
                this._parameterError(apiName, 'jsApiList的数据不合法');
                return;
            } else {
                if (option.jsApiList.length == 0) {
                    this._parameterError(apiName, 'jsApiList没有指定api的名字');
                    return;
                }
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },
        getVersion: function (option) {
            var apiName = 'getVersion';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },
        previewImage: function(option) {
            var apiName = 'previewImage';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },
        chooseImage: function (option) {
            var apiName = 'chooseImage';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var para = {};
            var key = 'count';
            var value = para[key] = option[key];
            if (this._isUndefinedOrNull(value)) {
                para[key] = 9;
            } else {
                value = parseInt(value);
                if (this._isNumber(value)) {
                    if (value > 9 || value <= 0) {
                        para[key] = 9;
                    } else {
                        para[key] = value;
                    }
                } else {
                    para[key] = 9;
                }
            }
            key = 'sizeType';
            value = para[key] = option[key];
            var result = this._normalizeArrayValue(apiName, key, value, ['original', 'compressed'], true);
            if (this._isUndefinedOrNull(result)) {
                return;
            }
            para[key] = result;

            key = 'sourceType';
            value = para[key] = option[key];
            var result = this._normalizeArrayValue(apiName, key, value, ['album', 'camera'], true);
            if (this._isUndefinedOrNull(result)) {
                return;
            }
            para[key] = result;

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'cancel',option.cancel,false)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(para));

        },

        uploadImage: function (option) {
            var apiName = 'uploadImage';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var para = {};
            var key = 'localId';
            var value = para[key] = option[key];
            if (this._isUndefinedOrNull(value)) {
                this._parameterError(apiName, key + '字段不能为空。');
                return;
            } else {
                if (!this._isString(value)) {
                    this._parameterError(apiName, key + '字段不能为空。');
                    return;
                }
            }

            key = 'isShowProgressTips';
            value = para[key] = option[key];
            if(this._isUndefinedOrNull(option[key])){
                para[key] = 1;
            }else{
                if(value != 1){
                    para[key] = 0;
                }else{
                    para[key] = 1;
                }
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(para));
        },

        httpRequestData: function (option) {
            var apiName = 'httpRequestData';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var key = 'requestUrl';
            var value = option[key];
            if (this._isUndefinedOrNull(value)) {
                this._parameterError(apiName, key + '字段不能为空。');
                return;
            } else {
                if (!this._isString(value)) {
                    this._parameterError(apiName, key + '字段不能为空。');
                    return;
                }
                //补全url
                else if(value.indexOf('://') < 0) {
                    option[key] = 'http://' + value;
                }
            }

            key = 'methodName';
            value = option[key];
            if (!this._isUndefinedOrNull(value)) {
                if(value != 'GET' && value != 'POST') {
                    this._parameterError(apiName, key + '只支持GET/POST请求。');
                    return;
                }
            }

            key = 'requestParams';
            value = option[key];
            if (!this._isUndefinedOrNull(value)) {
                if(!this._isObject(value)) {
                    this._parameterError(apiName, key + '只支持json格式。');
                    return;
                }
            }
            key = 'headers';
            value = option[key];
            if (!this._isUndefinedOrNull(value)) {
                if(!this._isObject(value)) {
                    this._parameterError(apiName, key + '只支持json格式。');
                    return;
                }
            }
            var originalCB = option.success;
            option.success = function(res) {
                console.log('original response : '+res.responseData);
                res.responseData = decodeURIComponent(res.responseData);
                originalCB(res);
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        connectWifi: function (option) {
            var apiName = 'connectWifi';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var key = 'wifis';
            var value = option[key];
            if (this._isUndefinedOrNull(value)) {
                this._parameterError(apiName, key + '字段不能为空。');
                return;
            } else {
                if (!this._isArray(value)) {
                    this._parameterError(apiName, key + '只支持array格式数据。');
                    return;
                }
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        downloadImage: function (option) {
            var apiName = 'downloadImage';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var para = {};
            var key = 'imageUrl';
            var value = para[key] = option[key];
            if (this._isUndefinedOrNull(value)) {
                this._parameterError(apiName, key + '字段不能为空。');
                return;
            } else {
                if (!this._isString(value)) {
                    this._parameterError(apiName, key + '字段不能为空。');
                    return;
                }
            }

            key = 'isShowProgressTips';
            value = para[key] = option[key];
            if(this._isUndefinedOrNull(option[key])){
                para[key] = 1;
            }else{
                if(value != 1){
                    para[key] = 0;
                }else{
                    para[key] = 1;
                }
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(para));


        },

        scanQRCode: function (option) {
            var apiName = 'scanQRCode';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var para = {};
            var key = 'needResult';
            var value = para[key] = option[key];
            if (this._isUndefinedOrNull(value)) {
                para[key] = 0;
            } else {
                value = parseInt(value);
                if (this._isNumber(value)) {
                    if (value != 0) {
                        para[key] = 1;
                    } else {
                        para[key] = 0;
                    }

                } else {
                    para[key] = 0;
                }
            }

            key = 'scanType';
            value = para[key] = option[key];
            var result = this._normalizeArrayValue(apiName,key,value,['qrCode', 'barCode'],true);
            if(this._isUndefinedOrNull(result)){
                return;
            }
            para[key] = result;

            key = 'hint';
            if (this._isUndefinedOrNull(option[key])){
                para[key] = '';
            }else {
                para[key] = option[key];
            }

            var cmdId = this._gui();
            var successWrapper = function(res){
                res.resultStr = decodeURIComponent(res.resultStr);
                option.success(res);
            };
            if(!this._registerCallback(apiName,cmdId,'success',successWrapper,false)){
                return;
            }

            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'cancel',option.cancel,false)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(para));

        },


        setOrientation: function (option) {
            var apiName = 'setOrientation';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            if (!this._isNumber(option.toOrientation)) {
                this._parameterError(apiName, 'toOrientation包含的值不正确。');
                return;

            }
            //if(option.success){
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
            //}

        },

        getNetworkType: function (option) {
            var apiName = 'getNetworkType';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        closeWindow: function (option) {
            var apiName = 'closeWindow';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        getDeviceId:function(option){
            var apiName = 'getDeviceId';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },
        startPedometer: function (option) {
            var apiName = 'startPedometer';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        stopPedometer: function (option) {
            var apiName = 'stopPedometer';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        onSearchBeacons: function (option) {
            console.log('onSearchBeacons  enter');
            Whistle.__onSearchBeacons = function (obj) {
                option.complete(JSON.parse(obj));
            };
        },
        getPedometerStatus: function (option) {
            var apiName = 'getPedometerStatus';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        startSearchBeacons: function (option) {
            var apiName = 'startSearchBeacons';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            if(this.sys.osName == this.sys.IOS && (!option.myBeacons || !this._isArray(option.myBeacons) || option.myBeacons.length <= 0)) {
                this._parameterError(apiName, 'iOS平台, myBeacons字段不能为空');
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        stopSearchBeacons: function (option) {
            var apiName = 'stopSearchBeacons';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },
        getLocation: function(option) {
            var apiName = 'getLocation';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            /*
             var para = {};
             var key = 'type';
             var value = para[key] = option[key];
             if (this._isUndefinedOrNull(value)) {
             this._parameterError(apiName, key + '字段不能为空。');
             return;
             } else {
             if (!this._isString(value)) {
             this._parameterError(apiName, key + '字段不能为空。');
             return;
             }
             }
             */


            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        openWifiHotspot: function (option) {
            var apiName = 'openWifiHotspot';
            if(!this._checkStatusAndParameter(apiName, option)){
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName, cmdId, 'success', option.success, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'fail', option.fail, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'complete', option.complete, true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        closeWifiHotspot: function (option) {
            var apiName = 'closeWifiHotspot';
            if(!this._checkStatusAndParameter(apiName, option)){
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName, cmdId, 'success', option.success, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'fail', option.fail, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'complete', option.complete, true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        getWifiScanList: function (option) {
            var apiName = 'getWifiScanList';
            if(!this._checkStatusAndParameter(apiName, option)){
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName, cmdId, 'success', option.success, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'fail', option.fail, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'complete', option.complete, true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        getHotspotInfo: function (option) {
            var apiName = 'getHotspotInfo';
            if(!this._checkStatusAndParameter(apiName, option)){
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName, cmdId, 'success', option.success, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'fail', option.fail, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'complete', option.complete, true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        startScan: function (option) {
            var apiName = 'startScan';
            if(!this._checkStatusAndParameter(apiName, option)){
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName, cmdId, 'success', option.success, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'fail', option.fail, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'complete', option.complete, true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        stopScan: function (option) {
            var apiName = 'stopScan';
            if(!this._checkStatusAndParameter(apiName, option)){
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName, cmdId, 'success', option.success, false)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'fail', option.fail, true)){
                return;
            }
            if(!this._registerCallback(apiName, cmdId, 'complete', option.complete, true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));
        },

        onScanCallback : function (option) {
            console.log('onScanCallback ' + JSON.stringify(option));
            Whistle.__onScanCallback = function (obj) {
                option.success(JSON.parse(obj));
            }
        },

        startNativePage: function(option) {
            var apiName = 'startNativePage';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        notifyUser: function(option) {
            var apiName = 'notifyUser';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        onMenuShareTimeline: function(option) {
            var apiName = 'onMenuShareTimeline';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        onMenuShareWechat: function(option) {
            var apiName = 'onMenuShareWechat';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        onMenuShareQQ: function(option) {
            var apiName = 'onMenuShareQQ';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        setTitleBar: function(option) {
            var apiName = 'setTitleBar';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }
            var cmdId = this._gui();

            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        goBack: function(option) {
            var apiName = 'goBack';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        showMenuPopup: function(option) {
            var apiName = 'showMenuPopup';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        },

        requestFullScreen: function(option) {
            var apiName = 'requestFullScreen';
            if (!this._checkStatusAndParameter(apiName, option)) {
                return;
            }

            var cmdId = this._gui();
            if(!this._registerCallback(apiName,cmdId,'success',option.success,false)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'fail',option.fail,true)){
                return;
            }
            if(!this._registerCallback(apiName,cmdId,'complete',option.complete,true)){
                return;
            }
            __nativeWhistleProxy.issueCommand(cmdId, apiName, JSON.stringify(option));

        }
    };

    Whistle.SCREEN_PORTRAIT = 1;
    Whistle.SCREEN_LANDSCAPE_RIGHT = 2;
    Whistle.SCREEN_LANDSCAPE_LEFT = 3;
    Whistle._initSys();


})();
