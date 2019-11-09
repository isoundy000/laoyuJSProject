/**
 * 旧版本声音
 * Created by zhangluxin on 2017/2/9.
 */
var OldVoiceUtils = {};

/**
 * 判断文件是否是打开状态
 * @param filename 文件名
 * @returns {Boolean} 是否打开
 */
OldVoiceUtils.isFileOpened = function (filename) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(
            "OldVoiceUtil",
            "isFileOpened:",
            jsb.fileUtils.getWritablePath() + filename
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(
            "org/cocos2dx/javascript/OldVoiceUtil",
            "isFileOpened",
            "(Ljava/lang/String;)Z",
            filename
        );
    }
};

/**
 * 开始录音
 * @param {String} filename 文件名
 */
OldVoiceUtils.startVoiceRecord = function (filename) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "OldVoiceUtil",
            "startVoiceRecord:",
            jsb.fileUtils.getWritablePath() + filename
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            "org/cocos2dx/javascript/OldVoiceUtil",
            "startVoiceRecord",
            "(Ljava/lang/String;)V",
            filename
        );
    }
};

/**
 * 停止录音
 * @param {String} filename 文件名
 */
OldVoiceUtils.stopVoiceRecord = function (filename) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "OldVoiceUtil",
            "stopVoiceRecord:",
            jsb.fileUtils.getWritablePath() + filename
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            "org/cocos2dx/javascript/OldVoiceUtil",
            "stopVoiceRecord",
            "(Ljava/lang/String;)V",
            filename
        );
    }
};

/**
 * 播放声音
 * @param url 声音地址
 */
OldVoiceUtils.playVoiceByUrl = function (url) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            "OldVoiceUtil",
            "playVoiceByUrl:",
            url
        );
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            "org/cocos2dx/javascript/OldVoiceUtil",
            "playVoiceByUrl",
            "(Ljava/lang/String;)V",
            url
        );
    }
};