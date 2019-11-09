/**
 * qq工具类
 * Created by zhangluxin on 2017/2/8.
 */
var QQUtils = {};

/**
 * 请求qq登录
 */
QQUtils.redirectToQQLogin = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("QQUtil", "redirectToQQLogin");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + "/utils/QQUtil", "redirectToQQLogin", "()V");
    }
};

/**
 * 获取qq用户信息
 * @returns {String} 用户信息
 */
QQUtils.getQQUserInfo = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("QQUtil", "getQQUserInfo");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/QQUtil", "getQQUserInfo", "()Ljava/lang/String;");
    }
};

/**
 * 获取qqToken
 * @returns {String} qqToken
 */
QQUtils.getQQToken = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("QQUtil", "getQQToken");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/QQUtil", "getQQToken", "()I");
    }
};

/**
 * 获取qqOpenID
 * @returns {String} qqOpenID
 */
QQUtils.getQQOpenID = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("QQUtil", "getQQOpenID");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/QQUtil", "getQQOpenID", "()I");
    }
};

/**
 * 分享图片到qq
 * @param node 截图的node
 */
QQUtils.sharePic = function (node) {
    var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
    time = time.replace(/[\s:-]+/g, '_');
    var namePNG = "ss-" + time + ".png";
    var nameJPG = "ss-" + time + ".jpg";

    if (cc.sys.os == cc.sys.OS_IOS) {
        node.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG, true, function () {
            node.release();
            jsb.reflection.callStaticMethod(
                "QQUtil",
                "sharePic:imageName:sceneType:",
                jsb.fileUtils.getWritablePath(),
                namePNG,
                0
            );
        });

    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        node.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function () {
            node.release();
            jsb.reflection.callStaticMethod(
                packageUri + "/utils/QQUtil",
                "sharePic",
                "(Ljava/lang/String;Z)V",
                nameJPG,
                false
            );
        });
    }
};

/**
 * 分享url到qq
 * @param {String} url 地址
 * @param {String} title 标题
 * @param {String} description 内容
 * @param {Boolean || Number} sceneType 分享类型(false或0: qq, true或其他数字: 空间)
 * @param {String} transaction 单号(时间戳)
 */
QQUtils.shareUrl = function (url, title, description, sceneType, transaction) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "QQUtil",
            "shareUrl:title:description:sceneType:",
            url,
            title,
            description,
            (sceneType ? 1 : 0)
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            packageUri + "/utils/QQUtil",
            "shareUrl",
            "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V",
            url,
            title,
            description,
            !!sceneType,
            transaction
        );
    }
};

/**
 * 分享文本到qq
 * @param {String} text 文本内容
 * @param {String} [sceneType] 0
 * @param {String} [transaction] 0
 */
QQUtils.shareText = function (text, sceneType, transaction) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "QQUtil",
            "shareText:",
            text
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + "/utils/QQUtil",
            "shareText",
            "(Ljava/lang/String;)V",
            text
        );
    }
};

QQUtils.isQQAppInstalled = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(
            "QQUtil",
            "isQQAppInstalled"
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/QQUtil",
            "isQQAppInstalled",
            "()V"
        );
    }
};