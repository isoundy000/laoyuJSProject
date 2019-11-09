/**
 * 支付宝工具类
 * Created by zhangluxin on 2017/2/8.
 */
var AliUtils = {};

/**
 * 分享图片到支付宝
 * @param node 截图的node
 */
AliUtils.sharePic = function (node) {
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
    var namePNG = "ss-" + time + ".png";
    var nameJPG = "ss-" + time + ".jpg";

    if (cc.sys.os == cc.sys.OS_IOS) {
        texture.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG, true, function () {
            texture.release();
            console.log(namePNG);
            jsb.reflection.callStaticMethod(
                "AliUtil",
                "sharePic:imageName:sceneType:",
                jsb.fileUtils.getWritablePath(),
                namePNG,
                0
            );
        });

    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function () {
            texture.release();
            jsb.reflection.callStaticMethod(
                packageUri + "/utils/AliUtil",
                "sharePic",
                "(Ljava/lang/String;Z)V",
                nameJPG,
                false
            );
        });
    }
};

/**
 * 分享url到支付宝
 * @param {String} url 地址
 * @param {String} title 标题
 * @param {String} description 内容
 * @param {Boolean || Number} sceneType 分享类型(false或0: 支付宝, true或其他数字: 空间)
 * @param {String} transaction 单号(时间戳)
 */
AliUtils.shareUrl = function (url, title, description, sceneType, transaction) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "AliUtil",
            "shareUrl:title:description:sceneType:",
            url,
            title,
            description,
            (sceneType ? 1 : 0)
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            packageUri + "/utils/AliUtil",
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
 * 分享文本到支付宝
 * @param {String} text 文本内容
 */
AliUtils.shareText = function (text) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "AliUtil",
            "shareText:",
            text
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + "/utils/AliUtil",
            "shareText",
            "(Ljava/lang/String;)V",
            text
        );
    }
};