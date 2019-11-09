/**
 * Created by dabai on 2017/8/30.
 */
(function (exports) {
    exports.XianLiaoUtils = {
        /**
         * 是否安装闲聊
         * @return {boolean}
         * */
        isXianLiaoAppInstalled: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('XianLiaoUtil', 'isXianLiaoAppInstalled');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'isXLAppInstalled', '()I');
            }
            return false;
        },

        /**
         * 拉起闲聊登陆
         * */
        redirectToXianLiaoLogin: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('XianLiaoUtil', 'login');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'redirectXianLiaoLogin', '()V');
            }
        },

        /**
         * 获取闲聊AppId
         * @return {String}
         * */
        getAppid: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('XianLiaoUtil', 'getXianLiaoAppId');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (window.nativeVersion < registerSdkVersion) {
                    return jsb.reflection.callStaticMethod(packageUri + '/Global', 'getXianliaoAppId', '()Ljava/lang/String;');
                }
                return jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'getAppid', '()Ljava/lang/String;');
            }
            return '';
        },

        /**
         * 获得房间id
         * @return {String}
         * */
        getRoomId: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('XianLiaoUtil', 'getXianLiaoRoomId');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'getXianLiaoRoomId', '()Ljava/lang/String;');
            }
            return '';
        },

        /**
         * 清除房间号
         * */
        clearRoomId: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('XianLiaoUtil', 'clearRoomId');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (window.nativeVersion < registerSdkVersion) {
                    jsb.reflection.callStaticMethod(packageUri + '/Global', 'clearXianLiaoRoomId', '()V');
                } else {
                    jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'clearRoomId', '()V');
                }
            }
        },

        /**
         * 获取闲聊登陆返回Code
         * @return {String}
         * */
        getXianLiaoLoginCode: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('XianLiaoUtil', 'getXianLiaoLoginCode');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (window.nativeVersion < registerSdkVersion) {
                    return jsb.reflection.callStaticMethod(packageUri + '/Global', 'getXianLiaoLoginCode', '()Ljava/lang/String;');
                } else {
                    return jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'getXianLiaoLoginCode', '()Ljava/lang/String;');
                }
            }
            return '';
        },

        /**
         * 获取闲聊登陆状态
         * @return {String}
         * */
        getXianLiaoLoginState: function () {
            if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('XianLiaoUtil', 'getXianLiaoLoginState');
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (window.nativeVersion < registerSdkVersion) {
                    return jsb.reflection.callStaticMethod(packageUri + '/Global', 'getXianLiaoLoginState', '()Ljava/lang/String;');
                } else {
                    return jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'getXianLiaoLoginState', '()Ljava/lang/String;');
                }
            }
            return '';
        },

        /**
         * 设置闲聊登陆Code
         * */
        setXianLiaoLoginCode: function (code) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('XianLiaoUtil', 'setXianLiaoLoginCode:', code);
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (window.nativeVersion < registerSdkVersion) {
                    jsb.reflection.callStaticMethod(packageUri + '/Global', 'setXianLiaoLoginCode', '(Ljava/lang/String;)V', code);
                } else {
                    jsb.reflection.callStaticMethod(packageUri + '/utils/XianLiaoUtil', 'setXianLiaoLoginCode', '(Ljava/lang/String;)V', code);
                }
            }
        },

        //分享文本
        shareText: function (text) {
            if (!cc.sys.isNative) {
                return;
            }
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    'XianLiaoUtil',
                    'shareText:',
                    text
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/XianLiaoUtil',
                    'shareText',
                    '(Ljava/lang/String;)V',
                    text
                );
            }
        },
        //分享Url
        shareUrlWithIcon: function (url) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    'XianLiaoUtil',
                    'shareUrlWithIcon:',
                    url
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/XianLiaoUtil',
                    'shareUrlWithIcon',
                    '(Ljava/lang/String;)V',
                    url
                );
            }
        },

        captureAndShareToXianLiao: function (node, depthStencilFormat) {
            var winSize = cc.director.getWinSize();
            var texture = new cc.RenderTexture(winSize.width * 0.5, winSize.height * 0.5,null,depthStencilFormat);
            if (!texture)
                return;

            texture.retain();
            texture.setAnchorPoint(0, 0);
            node.setAnchorPoint(0, 0);
            node.setScale(0.5);
            texture.begin();
            node.visit();
            texture.end();

            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = "ss-" + time + ".jpg";
            var namePNG = "ss-" + time + ".png";

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + "/utils/XianLiaoUtil",
                        "sharePic",
                        "(Ljava/lang/String;)V",
                        nameJPG
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        "XianLiaoUtil",
                        "sharePic:imageName:",
                        jsb.fileUtils.getWritablePath(),
                        namePNG
                    );
                });
            }
            setTimeout(function () {
                node.setScale(1);
            },1);
        },


        captureAndShareToXianLiao2: function (texture) {
            var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
            time = time.replace(/[\s:-]+/g, '_');
            var nameJPG = 'ss-' + time + '.jpg';

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + '/utils/XianLiaoUtil',
                        'sharePic',
                        '(Ljava/lang/String;)V',
                        nameJPG
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        'XianLiaoUtil',
                        'sharePic:imageName:',
                        jsb.fileUtils.getWritablePath(),
                        nameJPG
                    );
                });
            }
        },

        //分享游戏
        shareGame: function (roomId, title, text) {
            roomId = roomId + '';
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    'XianLiaoUtil',
                    'shareGame:title:text:',
                    roomId,
                    title,
                    text
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + '/utils/XianLiaoUtil',
                    'shareGame',
                    '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',
                    roomId,
                    title,
                    text
                );
            }
        }
    };

})(this);


