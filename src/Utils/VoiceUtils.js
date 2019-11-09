(function (exports) {

    var voiceDir = cc.sys.writablePath + 'voice/';

    var init = function () {
        if (!cc.sys.isNative)
            return;
        if (jsb.fileUtils.isDirectoryExist(voiceDir))
            jsb.fileUtils.removeDirectory(voiceDir);
        jsb.fileUtils.createDirectory(voiceDir);
    };

    init();

    exports.VoiceUtils = {
        startRecord: function () {
            if (!cc.sys.isNative)
                return;
            if (!_.isUndefined(window.musicID)) {
                jsb.AudioEngine.pauseAll();
            }
            if (cc.sys.os == cc.sys.OS_IOS)
                jsb.reflection.callStaticMethod("VoiceUtil", "startRecord");
            else
                jsb.reflection.callStaticMethod(packageUri + '/utils/VoiceUtil', "startRecord", "()V");
        },
        stopRecord: function () {
            if (!cc.sys.isNative)
                return;
            //开了静音启动   不resume
            if(gameData.voiceFlag){
                if (!_.isUndefined(window.musicID)) {
                    jsb.AudioEngine.resumeAll();
                }
            }
            if (cc.sys.os == cc.sys.OS_IOS)
                jsb.reflection.callStaticMethod("VoiceUtil", "stopRecord");
            else
                jsb.reflection.callStaticMethod(packageUri + '/utils/VoiceUtil', "stopRecord", "()V");
        },
        play: function (url) {
            if (!cc.sys.isNative)
                return;
            if (cc.sys.os == cc.sys.OS_IOS) {
                var parts = url.split('/');
                var fileName = parts[parts.length - 1];
                NetUtils.httpGet(url, function (content) {
                    var fullPath = voiceDir + fileName;
                    // console.log(fullPath);
                    var ret = jsb.fileUtils.writeDataToFile(content, fullPath);
                    if (ret)
                        playNorEffect(fullPath);
                        //cc.audioEngine.playEffect(fullPath);
                }, null, {
                    responseType: 'arraybuffer'
                });
            }
            else
                jsb.reflection.callStaticMethod(packageUri + '/utils/VoiceUtil', "playVoiceByUrl", "(Ljava/lang/String;)V", url);
        },
        getCurRecordStatus: function () {
            if (!cc.sys.isNative)
                return;
            if (cc.sys.os == cc.sys.OS_IOS)
                return jsb.reflection.callStaticMethod("VoiceUtil", "getCurRecordStatus");
            else
                return jsb.reflection.callStaticMethod(packageUri + '/utils/VoiceUtil', "getCurRecordStatus", "()I");
        },
        getCurSavedVoiceFilePath: function () {
            if (!cc.sys.isNative)
                return;
            if (cc.sys.os == cc.sys.OS_IOS)
                return jsb.reflection.callStaticMethod("VoiceUtil", "getCurSavedVoiceFilePath");
            else
                return jsb.reflection.callStaticMethod(packageUri + '/utils/VoiceUtil', "getCurSavedVoiceFilePath", "()Ljava/lang/String;");
        },
        getCurrentAmplitude: function () {
            if (!cc.sys.isNative)
                return;
            if (cc.sys.os == cc.sys.OS_IOS)
                return jsb.reflection.callStaticMethod("VoiceUtil", "getCurrentAmplitude");
            else
                return jsb.reflection.callStaticMethod(packageUri + '/utils/VoiceUtil', "getCurrentAmplitude", "()I");
        }
    };

})(this);
