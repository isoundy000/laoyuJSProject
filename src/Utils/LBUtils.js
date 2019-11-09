(function (exports) {
    var appId = null;
    exports.LBUtils = {
        isLBAppInstalled: function () {
            if (!cc.sys.isNative)
                return false;
            if (getNativeVersion()<'2.3.0')
                return false;
            return (cc.sys.os == cc.sys.OS_IOS
                ? jsb.reflection.callStaticMethod("LBUtil", "isLBAppInstalled")
                : jsb.reflection.callStaticMethod(packageUri + "/utils/LBUtil", "isLBAppInstalled", "()I"));
        },
        // getAppid: function () {
        //     if (appId)
        //         return appId;
        //     return appId = (cc.sys.os == cc.sys.OS_IOS
        //         ? jsb.reflection.callStaticMethod("LBUtil", "getWeixinAppId")
        //         : jsb.reflection.callStaticMethod(packageUri + '/Global', "getWeixinAppId", "()Ljava/lang/String;"));
        // },
        redirectToLiaoBeiLogin: function () {
            if (cc.sys.os == cc.sys.OS_IOS)
                jsb.reflection.callStaticMethod("LBUtil", "redirectToLBLogin");
            else
                jsb.reflection.callStaticMethod(packageUri + "/utils/LBUtil", "redirectToLBLogin", "()V");
        },
        getLBLoginCode: function () {
            return appId = (cc.sys.os == cc.sys.OS_IOS
                ? jsb.reflection.callStaticMethod("LBUtil", "getLBLoginCode")
                : jsb.reflection.callStaticMethod(packageUri + "/utils/LBUtil", "getLBLoginCode", "()Ljava/lang/String;"));
        },
        setLBLoginCode: function (code) {
            return appId = (cc.sys.os == cc.sys.OS_IOS
                ? jsb.reflection.callStaticMethod("LBUtil", "setLBLoginCode:", code)
                : jsb.reflection.callStaticMethod(packageUri + "/utils/WeixinUtil", "setLBLoginCode", "(Ljava/lang/String;)V", code));
        },
        captureAndShareToLB: function (node, depthStencilFormat) {

            // if(getNativeVersion()<='2.0.0'){
            //     captureAndShareToWX(node, depthStencilFormat);
            //     return;
            // }

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
            var nameJPG = "ss-" + time + ".jpg";
            var namePNG = "ss-" + time + ".png";

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        packageUri + "/utils/LBUtil",
                        "sharePic",
                        "(Ljava/lang/String;Z)V",
                        nameJPG,
                        false
                    );
                });
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                texture.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG, true, function (renderTexture, str) {
                    texture.release();
                    jsb.reflection.callStaticMethod(
                        "LBUtil",
                        "sharePic:imageName:sceneType:",
                        jsb.fileUtils.getWritablePath(),
                        namePNG,
                        0
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
                    "LBUtil",
                    "shareText:sceneType:",
                    text,
                    (sceneType ? 1 : 0)
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + "/utils/LBUtil",
                    "shareText",
                    "(Ljava/lang/String;ZLjava/lang/String;)V",
                    text,
                    (sceneType ? true : false),
                    transaction
                );
            }
        },
        shareUrl: function (url, title, description, sceneType, transaction) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    "LBUtil",
                    "shareUrl:title:description:sceneType:",
                    url,
                    title,
                    description,
                    (sceneType ? 1 : 0)
                );
            }
            else {
                jsb.reflection.callStaticMethod(
                    packageUri + "/utils/LBUtil",
                    "shareUrl",
                    "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V",
                    url,
                    title,
                    description,
                    (!!sceneType),
                    transaction
                );
            }
        }
    };

})(window);