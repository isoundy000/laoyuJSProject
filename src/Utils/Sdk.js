/**
 * Created by yanghaijin on 2018/10/8.
 */

var Sdk = {};

Sdk.isRegistered = false;

Sdk.registerWeChat = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerWeChat');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerWeChat', '()V');
    }
};

Sdk.registerWeChatByAppId = function (appId) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerWeChatByAppId:', appId);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/WeixinUtil', 'registerWeChatByAppId', '(Ljava/lang/String;)V', appId);
    }
};

Sdk.registerMagicWindow = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerMagicWindow');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerMagicWindow', '()V');
    }
};

Sdk.registerMagicWindowByAppId = function (appId, appKey) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerMagicWindowByAppId:key:', appId, appKey);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerMagicWindowByKey', '(Ljava/lang/String;)V');
    }
};

Sdk.registerXianLiao = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerXianLiao');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerXianLiao', '()V');
    }
};

Sdk.registerXianLiaoByAppId = function (appId) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerXianLiaoByAppId:', appId);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerXianLiaoByAppId', '(Ljava/lang/String;)V');
    }
};

Sdk.registerAgora = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerAgora');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerAgora', '()V');
    }
};

Sdk.registerAgoraByAppId = function (appId) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerAgoraByAppId:', appId);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerAgoraByAppId', '(Ljava/lang/String;)V');
    }
};

Sdk.registerQQ = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerQQ');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerQQ', '()V');
    }
};

Sdk.registerQQByAppId = function (appId) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerQQByAppId:', appId);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerQQByAppId', '(Ljava/lang/String;)V');
    }
};

Sdk.registerDingTalk = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerDingTalk');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerDingTalk', '()V');
    }
};

Sdk.registerLiaoBe = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerLiaoBe');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerLiaoBe', '()V');
    }
};

Sdk.registerLiaoBeByAppId = function (appId) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerLiaoBeByAppId:', appId);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerLiaoBeByAppId', '(Ljava/lang/String;)V');
    }
};

Sdk.registerNIM = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerNIM');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerNIM', '()V');
    }
};

Sdk.registerTalkingData = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerTalkingData');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(packageUri + '/utils/Sdk', 'registerTalkingData', '()V');
    }
};

Sdk.registerBaiDu = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerBaiDu');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
    }
};

Sdk.registerBaiDuByAk = function (appKey) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerBaiDuByAk:', appKey);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
    }
};

Sdk.registerGaoDe = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerGaoDe');
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
    }
};

Sdk.registerGaoDeByAk = function (appKey) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('Sdk', 'registerGaoDeByAk:', appKey);
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
    }
};