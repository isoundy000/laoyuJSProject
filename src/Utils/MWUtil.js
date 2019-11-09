/**
 * 魔窗工具
 * Created by hjianzhu on 17/5/15.
 */
var MWUtil = {};

MWUtil.getRoomId = function () {
    var roomid = null;
    if (cc.sys.os == cc.sys.OS_IOS) {
        roomid = jsb.reflection.callStaticMethod("MWUtil", "getRoomId");
        // this.clearRoomId();
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        roomid = jsb.reflection.callStaticMethod(packageUri + "/utils/MWUtil", "getRoomId", "()Ljava/lang/String;");
    }
    return roomid;
};

MWUtil.clearRoomId = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("MWUtil", "clearRoomId");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + "/utils/MWUtil", "clearRoomId", "()V");
    }
};
