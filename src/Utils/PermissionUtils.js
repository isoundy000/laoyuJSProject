/**
 * Created by hjx on 2017/7/13.
 */
(function (exports) {


    var isHasVideoPermission = function () {
        if (getNativeVersion() < '1.4.0') {
            return true;
        }
        if(gameData.inReview)return true;

        if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod("PermissionUtils", "hasVideoPermission");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + "/utils/PermissionUtils", "hasPermission", "(Ljava/lang/String;)Z", "android.permission.CAMERA");
        }
        return true;
    }

    var isHasAudioPermission = function () {
        if (getNativeVersion() < '1.4.0') {
            return true;
        }
        if(gameData.inReview)return true;

        if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod("PermissionUtils", "hasAudioPermission");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + "/utils/PermissionUtils", "hasPermission", "(Ljava/lang/String;)Z", "android.permission.RECORD_AUDIO");
        }
        return true;
    }

    var isHasLocationPermission = function () {
        if (getNativeVersion() < '1.4.0') {
            return true;
        }
        if(gameData.inReview)return true;

        if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod("PermissionUtils", "hasLocationPermission");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + "/utils/PermissionUtils", "hasPermission", "(Ljava/lang/String;)Z", "android.permission.ACCESS_FINE_LOCATION");
        }
        return true;
    }

    /**
     * 只支持ios跳转系统权限设置面板
     * @returns {boolean}
     */
    var settingPermissionBySystem = function () {
        if (getNativeVersion() < '1.4.0') {
            return true;
        }
        if(gameData.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("PermissionUtils", "gotoPermissionSettingView");
        }else {
            //android这里调用系统设置 不同手机不一样。。。
        }
    }

    /**
     * 参数传入  video audio location 分别申请系统获取摄像头 麦克风 位置权限
     * @param name
     * @returns {boolean}
     */
    var requestPermission = function (name) {
        if (getNativeVersion() < '1.4.0') {
            return true;
        }
        if(gameData.inReview)return;

        var nameObj = {
            video:['video', "android.permission.CAMERA"],
            audio:['audio', "android.permission.RECORD_AUDIO"],
            location:['location', "android.permission.ACCESS_FINE_LOCATION"],
        }
        var keyArr = nameObj[name];
        if(keyArr){
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("PermissionUtils", "requestPermission:", keyArr[0]);
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(packageUri + "/utils/PermissionUtils", "requestPermission", "(Ljava/lang/String;)V", keyArr[1]);
            }
        }
    }

    exports.PermissionUtils = {
        isHasVideoPermission : isHasVideoPermission,
        isHasAudioPermission : isHasAudioPermission,
        isHasLocationPermission : isHasLocationPermission,
        requestPermission : requestPermission,

        settingPermissionBySystem : settingPermissionBySystem
    };

}(this));