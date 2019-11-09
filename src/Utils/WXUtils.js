(function (exports) {
    exports.WXUtils = {
        /**
         * 是否安装微信app
         * */
        isWXAppInstalled: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('WXUtil', 'isWXAppInstalled');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'isWXAppInstalled', '()I');
            }
            return false;
        },

        /**
         * 获得微信Appid
         * */
        getAppid: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('WXUtil', 'getWeixinAppId');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (window.nativeVersion < registerSdkVersion) {
                    return jsb.reflection.callStaticMethod(packageUri + '/Global', 'getWeixinAppId', '()Ljava/lang/String;');
                } else {
                    return jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'getAppId', '()Ljava/lang/String;');
                }
            }
            return '';
        },

        /**
         * 拉起微信登录
         * */
        redirectToWeixinLogin: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('WXUtil', 'redirectToWeixinLogin');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'redirectToWeixinLogin', '()V');
            }
        },

        /**
         * 获得微信登录code
         * @return {String}
         * */
        getWXLoginCode: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('WXUtil', 'getWXLoginCode');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'getWXLoginCode', '()Ljava/lang/String;');
            }
            return '';
        },

        /**
         * 设置微信登录code
         * */
        setWXLoginCode: function (code) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('WXUtil', 'setWXLoginCode:', code);
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'setWXLoginCode', '(Ljava/lang/String;)V', code);
            }
        },

        shareTexture: function (texture) {
            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = 'ss-' + time + '.jpg';
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + '/utils/WeixinUtil',
                        'sharePic',
                        '(Ljava/lang/String;Z)V',
                        nameJPG,
                        false
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        'WXUtil',
                        'sharePic:imageName:sceneType:',
                        jsb.fileUtils.getWritablePath(),
                        nameJPG,
                        0
                    );
                });
            }
        },
        captureAndShareToWX2: function (texture) {
            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = 'ss-' + time + '.jpg';

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + '/utils/WeixinUtil',
                        'sharePic',
                        '(Ljava/lang/String;Z)V',
                        nameJPG,
                        false
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        'WXUtil',
                        'sharePic:imageName:sceneType:',
                        jsb.fileUtils.getWritablePath(),
                        nameJPG,
                        0
                    );
                });
            }
        },


        captureAndShareToWX: function (node, depthStencilFormat,ispyq) {
            if(ispyq == 2){
                this.captureAndShareToPyq(node, depthStencilFormat);
                return;
            }
            var winSize = cc.director.getWinSize();
            var texture = new cc.RenderTexture(winSize.width, winSize.height, null, depthStencilFormat);
            if (!texture)
                return;

            texture.retain();

            texture.setAnchorPoint(0, 0);
            texture.begin();
            node.visit();
            texture.end();

            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = 'ss-' + time + '.jpg';

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + '/utils/WeixinUtil',
                        'sharePic',
                        '(Ljava/lang/String;Z)V',
                        nameJPG,
                        false
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        'WXUtil',
                        'sharePic:imageName:sceneType:',
                        jsb.fileUtils.getWritablePath(),
                        nameJPG,
                        0
                    );
                });
            }
        },
        //分享到朋友圈
        captureAndShareToPyq: function (node, depthStencilFormat) {
            var winSize = cc.director.getWinSize();
            var texture = new cc.RenderTexture(winSize.width, winSize.height, null, depthStencilFormat);
            if (!texture)
                return;

            texture.retain();

            texture.setAnchorPoint(0, 0);
            texture.begin();
            node.visit();
            texture.end();

            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = 'ss-' + time + '.jpg';

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + '/utils/WeixinUtil',
                        'sharePic',
                        '(Ljava/lang/String;Z)V',
                        nameJPG,
                        true
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        'WXUtil',
                        'sharePic:imageName:sceneType:',
                        jsb.fileUtils.getWritablePath(),
                        nameJPG,
                        1
                    );
                });
            }
        },
        captureAndCopy: function (node) {
            var winSize = cc.director.getWinSize();
            var texture = new cc.RenderTexture(winSize.width, winSize.height);
            if (!texture)
                return;

            texture.retain();

            texture.setAnchorPoint(0, 0);
            texture.begin();
            node.visit();
            texture.end();

            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = 'ss-' + time + '.jpg';

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + '/utils/WeixinUtil',
                        'sharePic',
                        '(Ljava/lang/String;Z)V',
                        nameJPG,
                        false
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        'AppController',
                        'fetchUDID:type:',
                        cc.sys.writablePath + '/' + nameJPG,
                        'public.jpeg'
                    );
                });
            }
        },
        shareText: function (text, sceneType, transaction) {
            if (!cc.sys.isNative) {
                return;
            }
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    'WXUtil',
                    'shareText:sceneType:',
                    text,
                    (sceneType ? 1 : 0)
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/WeixinUtil',
                    'shareText',
                    '(Ljava/lang/String;ZLjava/lang/String;)V',
                    text,
                    (sceneType ? true : false),
                    transaction
                );
            }
        },
        shareUrl: function (url, title, description, sceneType, transaction) {
            if (!cc.sys.isNative) return;
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    'WXUtil',
                    'shareUrl:title:description:sceneType:',
                    url,
                    title,
                    description,
                    (sceneType ? 1 : 0)
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/WeixinUtil',
                    'shareUrl',
                    '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V',
                    url,
                    title,
                    description,
                    (sceneType ? true : false),
                    transaction
                );
            }
        },
        beginWxPay: function (cid) {
            //showLoading("正在跳转微信支付...")
            var that = this;
            // gameData.unionid = 'ocuY30YIuXy11KbGCJ63y68gxrTQ';
            // gameData.uid = '124182';
            var data = {
                appid: gameData.WXAvalue,
                playerid: gameData.uid,
                unionid: gameData.unionid,
                area: gameData.parent_area,
                cid: cid,
                timestamp: getCurTimestampM(),
                payType: 6,//6代表H5支付
                ciType: 1//1代表房卡2代表金币
            };
            data.sign = Crypto.MD5('yayapay' + data.appid + data.playerid + data.unionid + data.area + data.cid + data.timestamp + data.payType + data.ciType);
            data = _.isString(data) ? data : JSON.stringify(data);
            // cc.sys.openURL('https://pay.yayayouxi.com/payServer/wxpay/web_pay/index.html?param='+Base64.encode(data));
            // cc.sys.openURL('https://pay.yayayouxi.com/payServer-test/wxpay/web_pay/index.html?param='+Base64.encode(data));
            if (gameData.uid % 10 >= gameData.opt_conf['zhifu']) {
                cc.sys.openURL('http://pay2.lvhejincheng.com:8899/payServer/wxpay/web_pay/dcard.html?param=' + Base64.encode(data));
            } else {
                cc.sys.openURL('https://pay.yayayouxi.com/payServer/wxpay/web_pay/index.html?param=' + Base64.encode(data));
            }
        },
        wxPay: function (prepayId) {
            var nonceStr = randomString(16);
            var packageValue = 'Sign=WXPay';
            var timeStamp = getCurTimestamp();
            if (cc.sys.os == cc.sys.OS_IOS) {
                var str = 'appid=' + gameData.WXAvalue + '&noncestr=' + nonceStr + '&package=' + packageValue + '&partnerid=' + gameData.WXPvalue + '&prepayid=' + prepayId + '&timestamp=' + timeStamp + '&key=' + gameData.WXKvalue;
                var ios_sign = Crypto.MD5(str).toUpperCase();
                jsb.reflection.callStaticMethod(
                    'WXUtil',
                    'wxPay:prepayId:package:nonceStr:timeStamp:sign:',
                    gameData.WXPvalue,
                    prepayId,
                    packageValue,
                    nonceStr,
                    timeStamp + '',
                    ios_sign
                );
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                var android_sign = Crypto.MD5('appid=' + gameData.WXAvalue + '&noncestr=' + nonceStr + '&package=' + packageValue + '&partnerid=' + gameData.WXPvalue + '&prepayid=' + prepayId + '&timestamp=' + timeStamp + '&key=' + gameData.WXKvalue).toUpperCase();
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/WeixinUtil',
                    'wxPay',
                    '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',
                    gameData.WXAvalue,
                    gameData.WXPvalue,
                    prepayId,
                    packageValue,
                    nonceStr,
                    timeStamp + '',
                    android_sign
                );
            }
        },

        /**
         * 小程序分享
         */
        shareMiniPro: function (url, title, description, texture, miniId, path) {
            if (window.nativeVersion < registerSdkVersion) {
                return;
            }
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    'WXUtil',
                    'shareMiniPro:title:description:hdImagePath:userName:path:miniProgramType:',
                    url,
                    title,
                    description,
                    texture,
                    miniId,
                    path,
                    2
                );
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/WeixinUtil',
                    'shareMiniPro',
                    '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',
                    url,
                    title,
                    description,
                    texture,
                    miniId,
                    path,
                    '2'
                );
            }
        },

        setMiniProRoomId: function (roomid) {
            if (window.nativeVersion < registerSdkVersion) {
                return;
            }
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('WXUtil', 'setminiRroRoomId:', roomid);
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'setminiRroRoomId', '(Ljava/lang/String;)V', roomid);
            }
        },

        getMiniProRoomId: function () {
            if (window.nativeVersion < registerSdkVersion) {
                return;
            }
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('WXUtil', 'getminiRroRoomId');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'getminiRroRoomId', '()Ljava/lang/String;');
            }
            return '';
        }
    };

})(this);