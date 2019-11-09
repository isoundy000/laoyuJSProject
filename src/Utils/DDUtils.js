/**
 * 钉钉工具
 * Created by zhangluxin on 2017/2/18.
 */
var DDUtils = {};

DDUtils.isDDAppInstalled = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('DDUtil', 'isDDAppInstalled');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/DDUtil', 'isInstalled', '()Z');
    }
    return false;
},
/**
 * 分享文本到钉钉
 * @param {String} text 文本内容
 * @param {String} [sceneType] 0
 * @param {String} [transaction] 0
 */
DDUtils.shareText = function (text, sceneType, transaction) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "DDUtil",
            "shareText:",
            text
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + "/utils/DDUtil",
            "shareText",
            "(Ljava/lang/String;)V",
            text
        );
    }
};

/**
 * 分享url到钉钉
 * @param {String} url 地址
 * @param {String} title 标题
 * @param {String} description 内容
 * @param {Boolean || Number} sceneType 分享类型
 * @param {String} transaction 单号(时间戳)
 */
DDUtils.shareUrl = function (url, title, description, sceneType, transaction) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "DDUtil",
            "shareUrl:title:description:sceneType:",
            url,
            title,
            description,
            (sceneType ? 1 : 0)
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            packageUri + "/utils/DDUtil",
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
 * 分享图片到钉钉
 * @param node 截图的node
 */
// DDUtils.sharePic = function (node) {
//     // var winSize = cc.director.getWinSize();
//     // var texture = new cc.RenderTexture(winSize.width, winSize.height);
//     // if (!texture)
//     //     return;
//     //
//     // texture.retain();
//     // texture.setAnchorPoint(0, 0);
//     // texture.begin();
//     // node.visit();
//     // texture.end();
//     var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
//     time = time.replace(/[\s:-]+/g, '_');
//     var namePNG = "ss-" + time + ".png";
//     var nameJPG = "ss-" + time + ".jpg";
//
//     if (cc.sys.os == cc.sys.OS_IOS) {
//         node.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG, true, function () {
//             node.release();
//             jsb.reflection.callStaticMethod(
//                 "DDUtil",
//                 "sharePic:imageName:sceneType:",
//                 jsb.fileUtils.getWritablePath(),
//                 namePNG,
//                 0
//             );
//         });
//
//     } else if (cc.sys.os == cc.sys.OS_ANDROID) {
//         node.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function () {
//             node.release();
//             jsb.reflection.callStaticMethod(
//                 packageUri + "/utils/DDUtil",
//                 "sharePic",
//                 "(Ljava/lang/String;Z)V",
//                 nameJPG,
//                 false
//             );
//         });
//     }
// };
DDUtils.shareCapture = function (node) {
    if(getNativeVersion() < '3.1.0'){
        alert1('请先升级到最新版本');
        return;
    }
    if(!DDUtils.isDDAppInstalled()){
        alert1('请先安装钉钉');
        return;
    }
    captureNode(node, function (path, nameJPG) {
        DDUtils.sharePic(path, nameJPG);
    });
};
DDUtils.sharePic = function (path, nameJPG) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'DDUtil',
            'sharePic:imageName:sceneType:',
            jsb.fileUtils.getWritablePath(),
            nameJPG,
            1
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            packageUri + '/utils/DDUtil',
            'sharePic',
            '(Ljava/lang/String;Z)V',
            nameJPG,
            true
        );
    }
};