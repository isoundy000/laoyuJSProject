/**
 * 视频相关操作
 * Created by zhangluxin on 2017/6/1.
 */
(function (exports) {
    var visible_count = 0;

    var initVideoView = function (videoData) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        visible_count = 0;
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "initVideoView:", videoData);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "initVideoView", "(Ljava/lang/String;)V", videoData);
        }
    };

    var openVideo = function (roomid, uid) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "openVideo:uid:", roomid, uid);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "openVideo", "(Ljava/lang/String;Ljava/lang/String;)V", roomid, uid);
        }
    };

    var hideAllVideo = function () {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;
        visible_count++;
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "hideAllVideo");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "hideAllVideo", "()V");
        }
    };

    var showAllVideo = function () {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;
        visible_count--;
        cc.log(" video visible count = " + visible_count);
        if (visible_count > 0)return;
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "showAllVideo");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "showAllVideo", "()V");
        }
    };

    var closeVideo = function () {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "closeVideo");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "closeVideo", "()V");
        }
    };

    var changeViewSizeToScreenCenter = function (uid,x,y,width,height) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        x = x || cc.director.getWinSize().width/2;
        y = y || cc.director.getWinSize().height/2;
        width = width || 300;
        height = height || 300;
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "changeViewSizeToScreenCenter:x:y:width:height:", uid+'', x+'', y+'', width+'', height+'');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "changeViewSizeToScreenCenter",
                "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V"
            , uid+'', parseInt(x)+'', parseInt(y)+'', parseInt(width)+'', parseInt(height)+'' );
        }
    };

    var changeViewSizeToNormal = function (uid) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "changeViewSizeToNormal:", uid+'');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "changeViewSizeToNormal", "(Ljava/lang/String;)V", uid+'');
        }
    }
    
    var muteRemoteVideoStream = function (uid, mute) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "muteRemoteVideoStream:val:", uid+'', mute);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "muteRemoteVideoStream", "(Ljava/lang/String;Z)V", uid+'', mute);
        }
    }

    var muteRemoteAudioStream = function (uid, mute) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "muteRemoteAudioStream:val:", uid+'', mute);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "muteRemoteAudioStream", "(Ljava/lang/String;Z)V", uid+'', mute);
        }
    }

    var muteLocalVideoStream = function ( mute) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "muteLocalVideoStream:", mute);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "muteLocalVideoStream", "(Z)V",  mute);
        }
    }

    var muteLocalAudioStream = function ( mute) {
        if (getNativeVersion() < '3.2.0') {
            return;
        }
        if (window.inReview)return;

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AgoraUtil", "muteLocalAudioStream:",  mute);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "muteLocalAudioStream", "(Z)V", mute);
        }
    }

    // var enterBackground = function () {
    //     if (getNativeVersion() < '1.4.0') {
    //         return;
    //     }
    //     if (cc.sys.os == cc.sys.OS_IOS) {
    //         jsb.reflection.callStaticMethod("AgoraUtil", "pause");
    //     } else if (cc.sys.os == cc.sys.OS_ANDROID) {
    //         jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "pause", "()V");
    //     }
    // }
    // var enterForeground = function () {
    //     if (getNativeVersion() < '1.4.0') {
    //         return;
    //     }
    //     if (cc.sys.os == cc.sys.OS_IOS) {
    //         jsb.reflection.callStaticMethod("AgoraUtil", "resume");
    //     } else if (cc.sys.os == cc.sys.OS_ANDROID) {
    //         jsb.reflection.callStaticMethod(packageUri + "/utils/AgoraUtil", "resume", "()V");
    //     }
    // }
    //
    // cc.eventManager.addListener( cc.EventListener.create({
    //     event: cc.EventListener.CUSTOM,
    //     eventName: 'game_on_hide',
    //     callback: function () {
    //         enterBackground();
    //     }
    // }),1);
    // cc.eventManager.addListener(cc.EventListener.create({
    //     event: cc.EventListener.CUSTOM,
    //     eventName: 'game_on_show',
    //     callback: function () {
    //         enterForeground();
    //     }
    // }),1);



    exports.AgoraUtil = {
        changeViewSizeToNormal : changeViewSizeToNormal,
        changeViewSizeToScreenCenter : changeViewSizeToScreenCenter,
        closeVideo : closeVideo,
        showAllVideo:showAllVideo,
        hideAllVideo:hideAllVideo,
        initVideoView:initVideoView,
        openVideo:openVideo,
        muteRemoteAudioStream : muteRemoteAudioStream,
        muteRemoteVideoStream : muteRemoteVideoStream,
        muteLocalVideoStream : muteLocalVideoStream,
        muteLocalAudioStream : muteLocalAudioStream
    };

}(this));