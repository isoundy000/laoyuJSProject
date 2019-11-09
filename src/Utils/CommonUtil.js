/**
 * 公用方法
 * Created by zhangluxin on 16/8/4.
 */

/**
 * 判断是不是空字符串
 * @param {String} str
 * @returns {Boolean}
 */
var isNullString = function (str) {
    return !_.isString(str) || str === '' || str === 'null';
};

var CommonUtil = {};

CommonUtil.crash = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('CommonUtil', 'crash');
    }
};

CommonUtil.getBundleId = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('CommonUtil', 'getBundleId');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'getBundleId', '()Ljava/lang/String;');
    }
    return '';
};

CommonUtil.getUdid = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('CommonUtil', 'getUdid');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/CommonUtil', 'fetchUDID', '()Ljava/lang/String;');
    }
    return '';
};

CommonUtil.fetchUDID = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('CommonUtil', 'fetchUDID');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/CommonUtil', 'fetchUDID', '()Ljava/lang/String;');
    }
    return '';
};

CommonUtil.getVersionName = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('CommonUtil', 'getVersionName');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/Global', 'getVersionName', '()Ljava/lang/String;');
    }
    return '';
};

CommonUtil.savePasteBoard = function (text) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('CommonUtil', 'savePasteBoard:', text);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/ClipboardUtil', 'clipboardCopyText', '(Ljava/lang/String;)V', text);
    }
};

CommonUtil.getPasteBoard = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('CommonUtil', 'getPasteBoard');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/ClipboardUtil', 'getPasteBoard', '()Ljava/lang/String;');
    }
    return '';
};

/**
 * 打开指定的App
 * @param {String} [app] 默认打开微信
 * */
CommonUtil.openApp = function (app) {
    if (typeof app === 'undefined') {
        app = cc.sys.os === cc.sys.OS_IOS ? 'weixin://' : 'com.tencent.mm';
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('CommonUtil', 'openApp:', app);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/CommonUtil', 'openApp', '(Ljava/lang/String;)Z', app);
    }
};

CommonUtil.getBatteryLevel = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('CommonUtil', 'getBatteryLevel');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/CommonUtil', 'getBatteryLevel', '()Ljava/lang/String;');
    }
    return '';
};

CommonUtil.getBatteryInfo = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('CommonUtil', 'getBatteryInfo');
    }
    return '';
};