/**
 * 太极盾工具类
 * Created by zhangluxin on 2017/2/8.
 */
var TaiJiDunUtils = {};

/**
 * 获取太极盾
 * @param HostURL 地址
 * @param HostPort 端口
 */
TaiJiDunUtils.getSecurityServerIP = function (HostURL, HostPort) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("TaiJiDunUtil", "getSecurityServerIP:HostPort:", HostURL, HostPort);
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/TaiJiDunUtil", "getSecurityServerIP", "(Ljava/lang/String;Ljava/lang/String;)I", HostURL, HostPort);
    }
};

/**
 * 取得host
 */
TaiJiDunUtils.getHost = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("TaiJiDunUtil", "getHost");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/TaiJiDunUtil", "getHost", "()Ljava/lang/String;");
    }
};

/**
 * 取得port
 */
TaiJiDunUtils.getPort = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod("TaiJiDunUtil", "getPort");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + "/utils/TaiJiDunUtil", "getPort", "()I");
    }
};