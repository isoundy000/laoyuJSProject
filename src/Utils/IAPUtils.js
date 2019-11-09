/**
 * 内购工具
 * Created by zhangluxin on 2017/2/20.
 */
var IAPUtils = {};

/**
 * 拉起iap支付
 * @param {String} productId 产品id
 */
IAPUtils.buy = function (productId) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("IAPUtil", "buy:", productId);
    }
};

/**
 * 获取结果code
 */
IAPUtils.getResultCode = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("IAPUtil", "getResultCode");
    }
};
IAPUtils.setResultCode = function (code) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("IAPUtil", "setResultCode:", code);
    }
};

/**
 * 获取结果
 */
IAPUtils.getResult = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("IAPUtil", "getResult");
    }
};
IAPUtils.setResult = function (result) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("IAPUtil", "setResult:", result);
    }
};