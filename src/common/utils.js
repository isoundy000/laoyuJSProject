var compareTwoNumbers = function (a, b) {
    return a - b;
};

var equleTo0 = function (n) {
    return n == 0;
};
var largerThan0 = function (n) {
    return n > 0;
};

var isTrue = function (n) {
    return !!n;
};
var getCurTimestamp = function () {
    return Math.round((new Date()).getTime() / 1000);
};

var time2timestamp = function (time) {

};

var getPaiLR = function (paiId) {
    if (paiId >= 1 && paiId <= 9)
        return [1, 9];
    if (paiId >= 10 && paiId <= 18)
        return [10, 18];
    if (paiId >= 19 && paiId <= 27)
        return [19, 27];
    return null;
};

var isSameColor = function (paiIdA, paiIdB) {
    if (paiIdA >= 1 && paiIdA <= 9)
        return paiIdB >= 1 && paiIdB <= 9;
    if (paiIdA >= 10 && paiIdA <= 18)
        return paiIdB >= 10 && paiIdB <= 18;
    if (paiIdA >= 19 && paiIdA <= 27)
        return paiIdB >= 19 && paiIdB <= 27;
    if (paiIdA >= 28 && paiIdA <= 34)
        return paiIdB >= 28 && paiIdB <= 34;
    return false;
};

var timestamp2time = function (timestamp, format) {
    format = format || 'yyyy-mm-dd HH:MM:ss';
    var date = new Date(parseInt(timestamp) * 1000);
    return dateFormat(date, format);
};

var vibrate = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        cc.Device.vibrate(1);
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        cc.Device.vibrate(1);
    }
};
var setPokerFrameByName = function (sprite, name) {
    for (var i = 0; i < 3; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames(res.poker_b_pdk_plist);
        } else {
            sprite.setSpriteFrame(frame);
            return;
        }
    }
    if (!cc.sys.isNative)
        throw new Error('getSpriteFrame(' + name + ') == null');
    else
        alert1('getSpriteFrame(' + name + ') == null');
};

/**
 * track id
 * @type {number}
 */
var track_idx = 0;
/**
 * 创建spine动画
 * @param {String} spJson 动画json文件路径(必须和atlas文件同路径同名)
 * @returns {sp.SkeletonAnimation}
 */
var createSpine = function (spJson) {
    var spAtlas = spJson.replace('.json', '.atlas');
    return new sp.SkeletonAnimation(spJson, spAtlas);
};
/**
 * 播放spine动画
 * @param {String} spJson spine json路径
 * @param {String} [animaName] 动画名字
 * @param {Boolean} [repeate] 是否循环
 * @param {Function} [cb] 完成回调
 * @returns {sp.SkeletonAnimation}
 */
var playSpine = function (spJson, animaName, repeate, cb) {
    // cc.log(spJson, animaName);
    animaName = animaName || 'animation';
    if (repeate == undefined) {
        repeate = true;
    }
    var sp = createSpine(spJson);
    if (!sp) {
        cc.error('spine 动画为空!!!');
        return null;
    }
    sp.setAnimation(0, animaName, repeate);
    if (cb) {
        sp.setCompleteListener(cb);
    }
    return sp;
};

var regBakBtn = function () {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD, onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    // alert2('确定退出游戏吗?', function () {
                    //     cc.director.end();
                    // }, null, false, true, true);
                    HUD.showMessageBox('提示', '确定退出游戏吗?', function () {
                        cc.director.end();
                    });
                }
                else if (keyCode == cc.KEY.menu) {

                }
            }
        }, this);
    }
};

/**
 * 只有以"_"开头的变量才会被绑定，以"_"开头的变量的子节点都可以以"_a.b、_a.b.c"访问。
 * */
var loadFile = function (target, jsonFile) {
    cc.assert(target && jsonFile);

    cc.log('loadFile: ' + jsonFile);
    //绑定jsonFile
    if (!jsonFile) {
        return;
    }
    var rootNode = ccs.load(jsonFile, 'res/');
    rootNode.node.setAnchorPoint(cc.p(0.5, 0.5));
    rootNode.node.setContentSize(rootNode.node.getContentSize());
    var size = rootNode.node.getContentSize();
    rootNode.node.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
    bindMembers(rootNode.node, target);
    if (!target.rootNode) {
        target.rootNode = rootNode.node;
        target.addChild(rootNode.node);
    } else {//同时加载多个工程在一个场景
        var parent = rootNode.node;
        var arr = [];
        var children = parent.getChildren();
        for (var i = 0; i < children.length; i++)
            arr.push(children[i]);
        for (var i = 0; i < arr.length; i++) {
            arr[i].retain();
            arr[i].removeFromParent(false);
            target.rootNode.addChild(arr[i]);
            arr[i].release();
        }
        rootNode.node = target.rootNode;
    }
    return rootNode.node;
};
/**
 * 递归对rootWidget下的子节点进行成员绑定
 * @param rootWidget
 * @param target
 * @private
 */
var bindMembers = function (rootWidget, target) {
    var children = rootWidget.getChildren();

    var memberPrefix = '_';
    children.forEach(function (widget) {
        var widgetName = widget.getName();
        widgetName = widgetName.trim();
        // 控件名存在，绑定到target上
        var prefix = widgetName.substr(0, memberPrefix.length);
        if (prefix === memberPrefix) {
            target[widgetName] = widget;
        }

        // 绑定子控件,可以实现: a._b._c._d 访问子控件
        if (!rootWidget[widgetName]) {
            rootWidget[widgetName] = widget;
        }

        // 如果还有子节点，递归进去
        if (widget.getChildrenCount()) {
            bindMembers(widget, target);
        }
    });
};

var playAnimScene = function (distNode, res, posx, posy, loop, func) {
    // if(!distNode)
    //     cc.error("未找到父节点 " + res);
    //     return;

    var cacheNode = distNode.getChildByName(res);
    if (!cacheNode) {
        var animScene = ccs.load(res, 'res/');
        cacheNode = animScene.node;
        if (cacheNode) {
            cacheNode.setName(res);
            distNode.addChild(cacheNode);
            cacheNode.runAction(animScene.action);
            cacheNode.setPosition(posx, posy);

            var userdata = cacheNode.getUserData() || {};
            userdata.action = animScene.action;
            cacheNode.setUserData(userdata);
        } else {
            alert1('load' + res + 'failed');
        }

    }

    var userdata = cacheNode.getUserData();
    userdata.action.play('action', loop);

    if (func) {
        userdata.action.setLastFrameCallFunc(func);
    }
    return cacheNode;
};

var getPaiLR = function (paiId) {
    var t = [1, 9, 10, 18, 19, 27];
    var a = 0, b = 0;
    for (var i = 0; i < t.length; i += 2) {
        var l = t[i];
        var r = t[i + 1];
        if (paiId >= l && paiId <= r) {
            a = l;
            b = r;
            break;
        }
    }
    return {l: a, r: b};
};

var ellipsisStr = function (str, n) {
    if (!str) {
        return '';
    }
    if (str.length > n)
        str = str.substr(0, n - 1) + '..';
    return str;
};

// var playMusic = (function () {
//     var curBg = null;
//     return function (filename, isRepeate) {
//         filename = 'vbg';
//         if (!cc.sys.isNative)
//             return;
//         if (curBg == filename)
//             return;
//         curBg = filename;
//
//         var t = filename;
//         if (res[t])
//             cc.audioEngine.playMusic(res[t], !!isRepeate);
//         else if (res[filename])
//             cc.audioEngine.playMusic(res[filename], !!isRepeate);
//         else
//             cc.log("sound not found: " + filename);
//     }
// })();

var playMusic = (function () {
    return function (filename, isRepeate, enforce) {
        if (!cc.sys.isNative) {
            return;
        }
        if (!filename) {
            filename = 'vbg' + (cc.sys.localStorage.getItem('setting_bgm') || '1');
        }
        if (!isRepeate) {
            isRepeate = true;
        }
        if (gameData && gameData.voiceFlag == false) {
            return;
        }
        var musicvoice = cc.sys.localStorage.getItem('musicvoice') || '1';
        if (musicvoice == '0') {
            return;
        }
        if (window.curBg == filename && !enforce)
            return;
        window.curBg = filename;
        if (!_.isUndefined(window.musicID)) {
            jsb.AudioEngine.stop(window.musicID);
            window.musicID = null;
        }
        var t = filename;
        if (_.isUndefined(window.musicVolume)) {
            resetVolume();
        }
        if (cc.sys.isNative) {
            if (res[t]) {
                window.musicID = jsb.AudioEngine.play2d(res[t], isRepeate, window.musicVolume);
            } else if (res[filename]) {
                window.musicID = jsb.AudioEngine.play2d(res[filename], isRepeate, window.musicVolume);
            } else {
                cc.log('sound not found: ' + filename);
            }
        } else {
            if (res[t]) cc.audioEngine.playEffect(res[t], true);
        }
    };
})();

var pauseMusic = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (!_.isUndefined(window.musicID)) {
        jsb.AudioEngine.pause(window.musicID);
    }
};

var resumeMusic = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (!_.isUndefined(window.musicID)) {
        jsb.AudioEngine.resume(window.musicID);
    }
};

var stopMusic = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (!_.isUndefined(window.musicID)) {
        jsb.AudioEngine.stop(window.musicID);
        window.musicID = null;
    }
};

var resetVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    resetMusicVolume();
    resetEffectVolume();
};

var resetMusicVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        window.musicVolume = (cc.sys.localStorage.getItem('yinyuePrecent') || 1) / 300;
    } else {
        window.musicVolume = (cc.sys.localStorage.getItem('yinyuePrecent') || 1) / 1000;
    }
    if (window.musicID || window.musicID == 0) {
        jsb.AudioEngine.setVolume(window.musicID, window.musicVolume);
    }
};

var resetEffectVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        window.effectVolume = (cc.sys.localStorage.getItem('yinxiaoPrecent') || 1) / 200;
    } else {
        window.effectVolume = (cc.sys.localStorage.getItem('yinxiaoPrecent') || 1) / 800;
    }
};

var muteVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    jsb.AudioEngine.stopAll();
};

var playEffect = function (filename, sex, city) {
    if (!gameData)
        return;
    if (gameData.voiceFlag == false) {
        return;
    }
    var yinxiaovoice = cc.sys.localStorage.getItem('yinxiaovoice') || '1';
    if (yinxiaovoice == '0') {
        return;
    }
    if (_.isUndefined(window.effectVolume)) {
        resetVolume();
    }
    var soundName = '';
    if (window.paizhuo == 'majiang' || window.paizhuo == 'pdk' || window.paizhuo == 'pdk_jbc' || window.paizhuo == 'scpdk' || window.paizhuo == 'zjh' || window.paizhuo == 'majiang_sc' || window.paizhuo == 'epz') {
        var t = filename + '_' + (typeof sex === 'undefined' ? gameData.sex : sex);
        var soundRes = res;
        if (gameData.speakCSH && window.paizhuo != 'majiang_sc') {
            soundRes = cs_res;
        }
        soundName = soundRes[t] || soundRes[filename] || res[t] || res[filename];
        if (_.isArray(soundName)) {
            soundName = soundName[Math.floor(Math.random() * soundName.length)];
        }
    } else if (window.paizhuo == 'kaokao' || window.paizhuo == '13shui') {
        var t = filename + '_' + (typeof sex === 'undefined' ? gameData.sex : sex);
        if(window.kaokao_res){
            soundName = kaokao_res[t] || res[t] || res[filename];
        }else if(window.sss_res){
            soundName = sss_res[t] || res[t] || res[filename];
        }
        // console.log('kaokao play-> ' + soundName);
    } else {
        var t = (sex == 1 ? 'n' : 'v') + filename;
        if (city) {
            t = city + '_' + t;
        }

        if (city && gameData.isPutonghua && parseInt(gameData.isPutonghua) == 1 && mRoom.wanfatype == mRoom.YOUXIAN) {
            var ptht = 'pth_' + (sex == 1 ? 'n' : 'v') + filename;
            soundName = res[ptht];
            if (soundName == undefined) {
                var pthnosex = 'pth_' + filename;
                soundName = res[pthnosex];
            }
        } else {
            soundName = res[t];
            if (soundName == undefined) {
                soundName = res[filename];
            }
        }
    }

    if (!soundName) {
        cc.log('sound not found: ' + filename);
        return;
    }
    if (!cc.sys.isNative) {
        cc.audioEngine.playEffect(soundName, false);
    } else {
        jsb.AudioEngine.play2d(soundName, false, window.effectVolume);
    }
};

var playNorEffect = function (filename) {
    if (!cc.sys.isNative) {
        return;
    }
    var volume = 1;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        volume = 1.5;
    }
    jsb.AudioEngine.play2d(filename, false, volume);
};

var captureAndShareToWX = function (node) {
    var winSize = cc.director.getWinSize();
    var texture = new cc.RenderTexture(winSize.width, winSize.height);
    if (!texture)
        return;

    texture.retain();

    texture.setAnchorPoint(0, 0);
    texture.begin();
    node.visit();
    texture.end();

    var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
    time = time.replace(/[\s:-]+/g, '_');
    var namePNG = 'ss-' + time + '.png';
    var nameJPG = 'ss-' + time + '.jpg';
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function (renderTexture, str) {
            texture.release();
            jsb.reflection.callStaticMethod(
                'org/cocos2dx/javascript/AppActivity',
                'sharePic',
                '(Ljava/lang/String;Z)V',
                nameJPG,
                false
            );
        });
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        texture.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG, true, function (renderTexture, str) {
            texture.release();
            jsb.reflection.callStaticMethod(
                'AppController',
                'sharePic:imageName:sceneType:',
                jsb.fileUtils.getWritablePath(),
                namePNG,
                0
            );
        });
    }

};

var getNativeVersion = function () {
    if (!cc.sys.isNative)
        return '2.2.0';
    return window.nativeVersion;
};

var downloadAndInstallApk = function (url) {
    if (!cc.sys.isNative)
        return;
    if (cc.sys.os == cc.sys.OS_IOS) {
        // return jsb.reflection.callStaticMethod(
        //     "org/cocos2dx/javascript/AppActivity",
        //     "getVersionName",
        //     "()Ljava/lang/String;"
        // );
        return window.nativeVersion;
    }
};

/**
 * 获得设备UDID
 * @return {String}
 * */
var fetchUDID = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (window.nativeVersion < registerSdkVersion) {
            return jsb.reflection.callStaticMethod('AppController', 'fetchUDID');
        } else {
            return jsb.reflection.callStaticMethod('CommonUtil', 'fetchUDID');
        }
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'fetchUDID', '()Ljava/lang/String;');
    }
    return '0123456789abcdef';
};

////1方片 2梅花 3红桃 4黑桃
var getBigCardName = function (id) {
    if (id == 55) return 'guanggao.png';
    var name = 'clubs_1.png';
    var huaseArr = ['diamonds', 'clubs', 'hearts', 'spades'];
    var huase = huaseArr[(id - 1) % 4];
    var id = Math.floor((id + 3) / 4);
    return huase + '_' + id + '.png';
};
//扎金花   0-51   红桃  黑桃  梅花  方片
var getBigCardName_poker = function (id) {
    var name = 'hearts_1.png';
    var huaseArr = ['hearts', 'spades', 'clubs', 'diamonds'];
    var huase = huaseArr[Math.floor(id / 13)];
    var id = id % 13 + 1;
    return huase + '_' + id + '.png';
};
var getCardByC = function (arr) {
    var s = [];
    var searr = {'方': 1, '梅': 2, '红': 3, '黑': 4};
    for (var i = 0; i < arr.length; i++) {
        var se = arr[i].substr(0, 1);
        var v = arr[i].substr(1, arr[i].length);
        v = parseInt(v);
        s.push(searr[se] + (v - 1) * 4);
    }
    return s;
};
var getCardZWMC = function (arr) {
    var s = '';
    var huaseArr = ['方片', '梅花', '红桃', '黑桃'];
    for (var i = 0; i < arr.length; i++) {
        var id = arr[i];
        var huase = huaseArr[(id - 1) % 4];
        var id = Math.floor((id + 3) / 4);
        s = s + huase + id + ',';
    }
    return s;
};
//扎金花   0-51   红桃  黑桃  梅花  方片
var getBigCardJiaoName_poker = function (id) {
    var name = 'hearts_1.png';
    var huaseArr = ['hearts', 'spades', 'clubs', 'diamonds'];
    var huase = huaseArr[Math.floor(id / 13)];
    var id = id % 13 + 1;
    return huase + '_num_' + id + '.png';
};
var getBigCardJiaoName = function (id) {
    var name = 'clubs_1.png';
    var huaseArr = ['diamonds', 'clubs', 'hearts', 'spades'];
    var huase = huaseArr[(id - 1) % 4];
    var id = Math.floor((id + 3) / 4);
    return huase + '_num_' + id + '.png';
};
var getBigCardName2 = function (id) {
    var name = 'DN_pai_fangpian01';
    var huaseArr = ['fangpian', 'meihua', 'hongtao', 'heitao'];
    var huase = huaseArr[(id - 1) % 4];
    var id = Math.floor((id + 3) / 4);
    if (id < 10) {
        id = '0' + id;
    } else if (id == 11) {
        id = 'J';
    } else if (id == 12) {
        id = 'Q';
    } else if (id == 13) {
        id = 'K';
    }
    return 'DN_pai_' + huase + id;
};
var setPokerFrameByNameNN = function (sprite, name) {
    for (var i = 0; i < 3; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames(res.poker_b_plist);
        } else {
            sprite.setSpriteFrame(frame);
            return;
        }
    }
    if (!cc.sys.isNative)
        throw new Error('getSpriteFrame(' + name + ') == null');
    else
        alert1('getSpriteFrame(' + name + ') == null');
};

var setSpriteFrameByPath = function (sprite, name, plistPath) {
    for (var i = 0; i < 3; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames(plistPath);
        } else {
            sprite.setSpriteFrame(frame);
            return;
        }
    }
    if (!cc.sys.isNative)
        throw new Error('getSpriteFrame(' + name + ') == null');
    else
        alert1('getSpriteFrame(' + name + ') == null');
};

var setSpriteFrameByName = function (sprite, name, plisttmp) {
    var plist = 'res/submodules/majiang/image/pai.plist';

    if (plisttmp == 'majiang/pai' || plisttmp == 'pai') {
        //麻将
        plist = 'res/submodules/majiang/image/pai.plist';
    } else if (plisttmp == 'niuniu/card/poker') {
        //牛牛
        plist = res.poker_b_plist;
    } else if (plisttmp == 'niuniu/cuocard/cuocard_big') {
        //牛牛
        plist = 'res/image/ui/niuniu/cuocard/cuocard_big.plist';
    } else if (plisttmp == 'zjh/card/poker_b') {
        //扎金花
        plist = 'res/appCommon/fydp/common/poker_b.plist';
    } else if (plisttmp == 'animation/expression') {
        //表情
        plist = 'res/image/ui/animation/expression.plist';
    } else if (plisttmp == 'majiang/dice') {
        plist = 'res/submodules/majiang/image/dice.plist';
    }
    for (var i = 0; i < 3; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames(plist);
        } else {
            sprite.setSpriteFrame(frame);
            return;
        }
    }
    if (!cc.sys.isNative)
        throw new Error('getSpriteFrame(' + name + ') == null');
    else
        alert1('getSpriteFrame(' + name + ') == null');
};
var setUIImageFrameByName = function (sprite, name, plist) {
    for (var i = 0; i < 3; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames('res/image/ui/' + plist + '.plist');
        } else {
            sprite.loadTexture(name, ccui.Widget.PLIST_TEXTURE);
            return;
        }
    }
    if (!cc.sys.isNative)
        throw new Error('getSpriteFrame(' + name + ') == null');
    else
        alert1('getSpriteFrame(' + name + ') == null');
};
var resetVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    resetMusicVolume();
    resetEffectVolume();
};

var resetMusicVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        window.musicVolume = (cc.sys.localStorage.getItem('yinyuePrecent') || 1) / 300;
    } else {
        window.musicVolume = (cc.sys.localStorage.getItem('yinyuePrecent') || 1) / 1000;
    }
    if (window.musicID || window.musicID == 0) {
        jsb.AudioEngine.setVolume(window.musicID, window.musicVolume);
    }
};

var resetEffectVolume = function () {
    if (!cc.sys.isNative) {
        return;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        window.effectVolume = (cc.sys.localStorage.getItem('yinxiaoPrecent') || 1) / 200;
    } else {
        window.effectVolume = (cc.sys.localStorage.getItem('yinxiaoPrecent') || 1) / 800;
    }
};

var playThrowDice = function (sprite, k, endCb) {
    cc.spriteFrameCache.addSpriteFrames('res/submodules/majiang/image/dice.plist');

    var animFrames = [];
    for (var i = 0; i < 4; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame('dice_Action_' + i + '.png');
        animFrames.push(frame);
    }
    var animation = new cc.Animation(animFrames, 0.04);

    var action = cc.animate(animation);
    sprite.runAction(cc.sequence(
        action.repeat(2),
        cc.callFunc(function () {
            setSpriteFrameByName(sprite, 'dice_' + k + '.png', 'majiang/dice');
        }),
        cc.delayTime(0.4),
        cc.callFunc(function () {
            if (endCb)
                endCb();
        })
    ));
};
var playFrameAnim = function (plistFilePath, prefix, frameCnt, speed, isLoop, sprite, endCb) {
    playFrameAnim2(plistFilePath, prefix, 0, frameCnt, speed, isLoop, sprite, endCb);
};

var playFrameAnim2 = function (plistFilePath, prefix, beginFrame, frameCnt, speed, isLoop, sprite, endCb) {
    cc.spriteFrameCache.addSpriteFrames(plistFilePath);

    var animFrames = [];
    for (var i = beginFrame; i < beginFrame + frameCnt; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(prefix + i + '.png');
        animFrames.push(frame);
    }
    var animation = new cc.Animation(animFrames, speed);

    var action = cc.animate(animation);
    sprite.stopAllActions();
    if (isLoop) {
        sprite.runAction(action.repeatForever());
    }
    else {
        sprite.runAction(cc.sequence(action, cc.callFunc(function () {
            if (endCb)
                endCb();
        })));
    }
};

var shareText = function (text, sceneType, transaction) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'AppController',
            'shareText:sceneType:',
            text,
            (sceneType ? 1 : 0)
        );
    }
    else {
        jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'shareText',
            '(Ljava/lang/String;ZLjava/lang/String;)V',
            text,
            (sceneType ? true : false),
            transaction
        );
    }
};

var shareUrl = function (url, title, description, sceneType, transaction) {
    if (!cc.sys.isNative)
        return;
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'AppController',
            'shareUrl:title:description:sceneType:',
            url,
            title,
            description,
            (sceneType ? 1 : 0)
        );
    }
    else {
        jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'shareUrl',
            '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V',
            url,
            title,
            description,
            (sceneType ? true : false),
            transaction
        );
    }
};

var checkAllNodesValid = function (node) {
    if (!cc.sys.isObjectValid(node))
        return false;
    var children = node.getChildren();
    if (children.length) {
        for (var i = 0; i < children.length; i++)
            if (!checkAllNodesValid(children[i]))
                return false;
    }
    return true;
};

var getTransResult = function (key) {
    if (!cc.sys.isNative)
        return;

    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(
            'AppController',
            'getTransResult:',
            key
        );
    }
    else {
        return jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'getTransResult',
            '(Ljava/lang/String;)Ljava/lang/String;',
            key
        );
    }
};

var isFileOpened = function (filename) {
    if (!cc.sys.isNative)
        return;

    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'AppController',
            'isFileOpened:',
            jsb.fileUtils.getWritablePath() + filename
        );
    }
    else {
        return jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'isFileOpened',
            '(Ljava/lang/String;)Z',
            filename
        );
    }
};

var startVoiceRecord = function (filename) {
    if (!cc.sys.isNative)
        return;

    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'AppController',
            'startVoiceRecord:',
            jsb.fileUtils.getWritablePath() + filename
        );
    }
    else {
        jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'startVoiceRecord',
            '(Ljava/lang/String;)V',
            filename
        );
    }
};

var stopVoiceRecord = function (filename) {
    if (!cc.sys.isNative)
        return;

    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'AppController',
            'stopVoiceRecord:',
            jsb.fileUtils.getWritablePath() + filename
        );
    }
    else {
        jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'stopVoiceRecord',
            '(Ljava/lang/String;)V',
            filename
        );
    }
};

var playVoiceByUrl = function (url) {
    if (!cc.sys.isNative)
        return;

    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(
            'AppController',
            'playVoiceByUrl:',
            url
        );
    }
    else {
        jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'playVoiceByUrl',
            '(Ljava/lang/String;)V',
            url
        );
    }
};

var httpGet = function (url, cbSucc, cbFail) {
    var flag = false;
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open('GET', url);
    if (cc.sys.isNative) {
        // xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
        // xhr.setRequestHeader("User-Agent", "curl/7.27.0");
        // xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36");
    }
    // xhr.setRequestHeader("User-Agent", "curl/7.27.0");
    // xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
    // xhr.setRequestHeader("Accept-Encoding", "deflate");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // cc.log(xhr.responseText);
                cbSucc(xhr.responseText);
            }
            else {
                if (!flag) {
                    flag = true;
                    cbFail(xhr.statusText, xhr.responseText);
                }
            }
        }
    };
    xhr.onerror = function () {
        if (!flag) {
            flag = true;
            cbFail(xhr.status, null);
        }
    };
    xhr.send();
};

var httpGetPolling = function (params, cbSucc, cbFail, headerType, retryCnt) {
    if (gameData.ipList.length == 0) {
        cbFail();
        return;
    }
    retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;
    httpRequest('GET', gameData.ipList[0] + params, cbSucc, function () {
        if (retryCnt < gameData.ipList.length - 1) {
            var temp = gameData.ipList[0];
            gameData.ipList.splice(0, 1);
            gameData.ipList.push(temp);
            httpGetPolling(params, cbSucc, cbFail, headerType, retryCnt + 1);
        } else {
            // cbFail();
            if (gameData._add_ul > 5) {
                gameData._add_ul = 0;
                cbFail();
            } else {
                gameData._add_ul += 1;
                gameData.ipList = null;
                IIL();
                httpGetPolling(params, cbSucc, cbFail, headerType);
            }
        }
    }, headerType);
};
var httpRequest = function (method, url, cbSucc, cbFail, data, headerType) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
    }
    // cc.log(method + ':' + url);
    var flag = false;
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open(method, url);
    if (cc.sys.isNative) {
        headerType = headerType || 'gzip';
        if (headerType == 'gzip') {
            xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
        } else if (headerType == 'json') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    }
    // xhr.setRequestHeader("User-Agent", "curl/7.27.0");
    // xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
    // xhr.setRequestHeader("Accept-Encoding", "deflate");
    // xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // cc.log(xhr.responseText);
                if (!flag) {
                    flag = true;
                    cbSucc(xhr.responseText);
                }
            }
            else {
                if (!flag) {
                    flag = true;
                    cbFail(xhr.statusText, xhr.responseText);
                }
            }
        }
    };
    xhr.onerror = function () {
        if (!flag) {
            flag = true;
            cbFail(xhr.status, null);
        }
    };
    setTimeout(function () {
        if (!flag) {
            flag = true;
            cc.log('timeout, abort http request');
            cbFail(xhr.status, null);
        }
    }, 4000);
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
};
var httpPost = function (url, data, ajaxSuccess, ajaxError, noBase64) {
    data = _.isString(data) ? data : JSON.stringify(data);
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    // xhr.setRequestHeader("Content-Length", data.length);
    xhr.onreadystatechange = function () {
        var result, error = false;
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 0) {
                var dataType = xhr.getResponseHeader('content-type');
                result = xhr.responseText;
                console.log(result);
                try {
                    if (dataType.indexOf('json')) result = JSON.parse(result);
                } catch (e) {
                    error = e;
                }

                if (error) ajaxError(error, 'parsererror', xhr);
                else ajaxSuccess(result, xhr);
            } else {
                ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr);
            }
        }
    };
    xhr.onerror = function () {
        ajaxError(xhr.statusText || null);
    };
    if (noBase64) {
        xhr.send(data);
    } else {
        xhr.send(Base64.encode(data));
    }
};
var equalNum = function (num) {
    var _num = num;
    if (num >= 10000 && num < 100000000) {
        num = num / 10000;
        _num = num.toFixed(2) + '万';
    } else if (num >= 100000000) {
        num = num / 100000000;
        _num = num.toFixed(2) + '亿';
    }
    return _num;
};
var create$ = function (sceneNode) {
    var func = function (query, rootNode) {
        var arr = query.split(/\./g);
        var t = rootNode || sceneNode;
        for (var i = 0; i < arr.length; i++)
            if (t) {
                if (!cc.sys.isObjectValid(t)) {
                    cc.log('-- not a valid object ' + query);
                    return null;
                }
                t = t.getChildByName(arr[i]);
            }
            else {
                return null;
            }
        return t;
    };
    var retFunc = null;
    if (_.isArray(sceneNode)) {
        retFunc = function (query, rootNode) {
            if (rootNode)
                return func(query, rootNode);
            else {
                for (var i = 0; i < sceneNode.length; i++) {
                    var ret = func(query, sceneNode[i]);
                    if (ret)
                        return ret;
                }
                return null;
            }
        };
    }
    else
        retFunc = func;
    retFunc.get = httpGet;
    return retFunc;
};

var duplicateSprite = function (sprite, isCopyUserdata) {
    var newSprite = null;
    if (sprite instanceof cc.Sprite) {
        newSprite = new cc.Sprite(sprite.getSpriteFrame());
        newSprite.setBlendFunc(sprite.getBlendFunc());
    }
    else if (sprite instanceof ccui.CheckBox) {
        if (cc.sys.isNative)
            newSprite = sprite.clone();
        else {
            newSprite = new ccui.CheckBox();
            newSprite._copySpecialProperties(sprite);
        }
    }
    else if (sprite instanceof ccui.Text) {
        //newSprite = sprite.clone();
        newSprite = new ccui.Text();
        newSprite.setFontName(sprite.getFontName());
        newSprite.setTextColor(sprite.getTextColor());
        newSprite.setFontSize(sprite.getFontSize());
        newSprite.setTextHorizontalAlignment(sprite.getTextHorizontalAlignment());
        newSprite.setTextVerticalAlignment(sprite.getTextVerticalAlignment());
    } else if (sprite instanceof ccui.ImageView) {
        newSprite = sprite.clone();
        return newSprite;
    }
    // else if (sprite instanceof ccui.LabelBMFont) {
    //     newSprite = sprite.clone();
    //     return newSprite;
    // }
    else if (sprite instanceof ccui.TextAtlas) {
        newSprite = sprite.clone();
        newSprite.setString(sprite.getString());
        return newSprite;
    }
    else if (sprite instanceof ccui.TextBMFont) {
        return sprite.clone();
        // newSprite = new ccui.TextBMFont();
        // newSprite.setString(sprite.getString());
        // newSprite.setFntFile(newSprite._fntFileName);
        // return sprite.clone();
        // return newSprite;
    }
    else if (sprite instanceof ccui.Layout) {
        newSprite = duplicateLayout(sprite);
        newSprite.setPosition(sprite.getPosition());
        return newSprite;
    }
    newSprite.setAnchorPoint(sprite.getAnchorPoint());
    newSprite.setScale(sprite.getScaleX(), sprite.getScaleY());
    newSprite.setPosition(sprite.getPosition());
    newSprite.setContentSize(sprite.getContentSize());
    newSprite.setColor(sprite.getColor());
    newSprite.setOpacity(sprite.getOpacity());
    newSprite.setVisible(sprite.isVisible());
    newSprite.setName(sprite.getName());
    if (sprite instanceof cc.Sprite) {
        var children = sprite.getChildren();
        for (var i = 0; i < children.length; i++) {
            var node = duplicateSprite(children[i], true);
            newSprite.addChild(node);
        }
    }
    if (isCopyUserdata)
        newSprite.setUserData(_.clone(sprite.getUserData()));
    return newSprite;
};

var getCurrentTimeMills = function () {
    var date = new Date();
    var yy = date.getYear();
    var MM = date.getMonth() + 1;
    var dd = date.getDay();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var sss = date.getMilliseconds();
    return Date.UTC(yy, MM, dd, hh, mm, ss, sss);
};
var duplicateOnlyNewLayer = function (layout) {
    var newLayout = null;
    newLayout = new ccui.Layout();
    newLayout.setSize(layout.getSize());
    newLayout.setLayoutType(layout.getLayoutType());
    newLayout.setBackGroundColorType(layout.getBackGroundColorType());
    newLayout.setBackGroundColor(layout.getBackGroundColor());
    newLayout.setBackGroundColorOpacity(layout.getBackGroundColorOpacity());
    var children = layout.getChildren();
    for (var i = 0; i < children.length; i++) {
        var node = duplicateSprite(children[i], true);
        newLayout.addChild(node);
    }
    return newLayout;
};
var duplicateLayout = function (layout) {
    var newLayout = null;
    if (layout instanceof cc.Sprite)
        newLayout = duplicateSprite(layout);
    else if (layout instanceof ccui.Layout) {
        newLayout = layout.clone();
        //newLayout = new ccui.Layout();
        //newLayout.setSize(layout.getSize());
        //newLayout.setLayoutType(layout.getLayoutType());
        //newLayout.setBackGroundColorType(layout.getBackGroundColorType());
        //newLayout.setBackGroundColor(layout.getBackGroundColor());
        //newLayout.setBackGroundColorOpacity(layout.getBackGroundColorOpacity());
    }
    else if (layout instanceof cc.Node)
        newLayout = new cc.Node();
    newLayout.setPosition(layout.getPosition());
    newLayout.setScale(layout.getScale());
    newLayout.setAnchorPoint(layout.getAnchorPoint());
    newLayout.setOpacity(255);
    newLayout.setVisible(true);
    var children = layout.getChildren();
    for (var i = 0; i < children.length; i++) {
        var node = duplicateSprite(children[i], true);
        newLayout.addChild(node);
    }
    return newLayout;
};

/**
 * 複製節點
 * @param node
 * @param isCopyUserdata
 * @return {cc.Node}
 */
var duplicateNode = function (node, isCopyUserdata) {
    var cloneNode = null;
    if (node instanceof cc.Sprite) {
        cloneNode = new cc.Sprite(node.getSpriteFrame());
        cloneNode.setBlendFunc(node.getBlendFunc());
        cloneNode.setFlippedX(node.isFlippedX());
        cloneNode.setFlippedY(node.isFlippedY());
    } else if (node instanceof ccui.ImageView) {
        if (cc.sys.isNative) {
            var tmp = node.clone();
            tmp.removeAllChildren(true);
            cloneNode = tmp;
        }
        else {
            cloneNode = new ccui.ImageView(node['_textureFile']);
            cloneNode.setScale9Enabled(true);
            cloneNode.setContentSize(node.getContentSize());
        }
    } else if (node instanceof ccui.CheckBox) {
        if (cc.sys.isNative)
            cloneNode = node.clone();
        else {
            cloneNode = new ccui.CheckBox();
            cloneNode._copySpecialProperties(node);
        }
    } else if (node instanceof ccui.Text) {
        cloneNode = new ccui.Text(node.getString(), node.getFontName(), node.getFontSize());
        cloneNode.setTextColor(node.getTextColor());
        cloneNode.setTextHorizontalAlignment(node.getTextHorizontalAlignment());
        cloneNode.setTextVerticalAlignment(node.getTextVerticalAlignment());
        if (cc.sys.isNative) {
            cloneNode.enableOutline(node.getEffectColor(), node.getOutlineSize());
        }
    } else if (node instanceof ccui.Layout) {
        cloneNode = new ccui.Layout();
        cloneNode.setBackGroundColorType(node.getBackGroundColorType());
        cloneNode.setBackGroundColor(node.getBackGroundColor());
        cloneNode.setBackGroundColorOpacity(node.getBackGroundColorOpacity());
    } else if (node instanceof cc.ClippingNode) {
        cloneNode = new cc.ClippingNode();
        cloneNode.setStencil(node.getStencil());
        cloneNode.setAlphaThreshold(node.getAlphaThreshold());
        cloneNode.setInverted(node.isInverted());
    } else if (node instanceof ccui.TextBMFont) {
        if (cc.sys.isNative) {
            cloneNode = node.clone();
        } else {
            cloneNode = new ccui.TextBMFont();
            cloneNode._copySpecialProperties(node);
        }
    } else if (node instanceof ccui.TextAtlas) {
        cloneNode = node.clone();
    } else if (node instanceof cc.Node) {
        cloneNode = new cc.Node;
    }
    if (!node) {
        return null;
    }
    if (!cloneNode) {
        return null;
    }
    cloneNode.setScaleX(node.getScaleX());
    cloneNode.setScaleY(node.getScaleY());
    cloneNode.setVisible(node.isVisible());
    cloneNode.setColor(node.getColor());
    cloneNode.setSkewX(node.getSkewX());
    cloneNode.setSkewY(node.getSkewY());
    cloneNode.setOpacity(node.getOpacity());
    cloneNode.setPosition(node.getPosition());
    cloneNode.setAnchorPoint(node.getAnchorPoint());
    cloneNode.setContentSize(node.getContentSize());
    cloneNode.setLocalZOrder(node.getLocalZOrder());
    cloneNode.setName(node.getName());

    var childlist = node.getChildren();
    _.forIn(childlist, function (child) {
        var tmpChild = duplicateNode(child, isCopyUserdata);
        cloneNode.addChild(tmpChild);
        cloneNode[child.getName()] = tmpChild;
    });

    if (isCopyUserdata)
        cloneNode.setUserData(_.clone(node.getUserData()));
    return cloneNode;
};

var showLoading = function (content, nothide) {
    HUD.showLoading(content, nothide);
};

var hideLoading = function () {
    HUD.removeLoading();
};

// var setTimeout = function (func, time) {
//     cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
//         func();
//     }, time / 1000.0);
// };

// var setInterval = function (func, time) {
//     cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().schedule(function () {
//         func();
//     }, time / 1000.0, cc.REPEAT_FOREVER);
// };

var alert0 = function (title, content, isAutoHideLoading) {
    // isAutoHideLoading = _.isUndefined(isAutoHideLoading) ? true : isAutoHideLoading;
    // if (isAutoHideLoading)
    //     hideLoading();
    // cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
    //     var tishiLayer = new TishiLayer('alert0', title, content, null, null, true);
    //     cc.director.getRunningScene().addChild(tishiLayer, 1000);
    // }, 0);
    var layer = HUD.showLayer(HUD_LIST.MessageBox, cc.director.getRunningScene(), null, true);
    layer.setName('MessageBox');
    layer.setLocalZOrder(1000);
    layer.setData(title, content, function () {
    }, true);
    return layer;
};

var alert1 = function (content, onOk, canCancel, isAutoHideLoading, isHCenter, isVCenter) {
    // isAutoHideLoading = _.isUndefined(isAutoHideLoading) ? true : isAutoHideLoading;
    // if (isAutoHideLoading)
    //     hideLoading();
    // cc.director.getRunningScene().scheduleOnce(function () {
    //     var tishiLayer = new TishiLayer('alert1', '提示', content, function () {
    //         if (onOk)
    //             onOk();
    //     }, null, !!canCancel, isHCenter, isVCenter, null, null);
    //     cc.director.getRunningScene().addChild(tishiLayer, 1000);
    // }, 0);
    // var tipLayer = HUD.getTipLayer();
    // if (!tipLayer) {
    //     tipLayer = new cc.Layer();
    //     cc.director.getRunningScene().addChild(tipLayer, 1000);
    //     HUD.tipLayer = tipLayer;
    // }
    var layer = HUD.showLayer(HUD_LIST.MessageBox, cc.director.getRunningScene(), null, true);
    layer.setName('MessageBox');
    layer.setData('提示', content, onOk, true);
    layer.setLocalZOrder(1000);
    return layer;
};

var alert2 = function (content, onOk, onCancel, hideCancel, isAutoHideLoading, isHCenter, isVCenter) {
    // isAutoHideLoading = _.isUndefined(isAutoHideLoading) ? true : isAutoHideLoading;
    // if (isAutoHideLoading)
    //     hideLoading();
    // cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
    //     var tishiLayer = new TishiLayer('alert2', '提示', content, function () {
    //         if (onOk)
    //             onOk();
    //     }, function () {
    //         if (onCancel)
    //             onCancel();
    //     }, !!canCancel, isAutoHideLoading, isHCenter, isVCenter);
    //     cc.director.getRunningScene().addChild(tishiLayer, 1000);
    // }, 0);
    // var tipLayer = HUD.getTipLayer();
    // if (!tipLayer) {
    //     tipLayer = new cc.Layer();
    //     cc.director.getRunningScene().addChild(tipLayer, 1000);
    //     HUD.tipLayer = tipLayer;
    // }
    var layer = HUD.showLayer(HUD_LIST.MessageBox, cc.director.getRunningScene(), null, true);
    layer.setName('MessageBox');
    layer.setLocalZOrder(1000);
    if (hideCancel == null || hideCancel == undefined) hideCancel = false;
    layer.setData('提示', content, onOk, hideCancel);
    return layer;
};

var preloadMascene1 = function () {
    window.ccsCache = window.ccsCache || {};
    // if (window.ccsCache[res.MaScene1_json]) {
    //     window.ccsCache[res.MaScene1_json].release();
    //     delete window.ccsCache[res.MaScene1_json];
    // }
    if (!window.ccsCache[res.MaScene1_json]) {
        window.ccsCache[res.MaScene1_json] = ccs.load(res.MaScene1_json).node;
        window.ccsCache[res.MaScene1_json].retain();
    }
};

var addCachedCCSChildrenTo = function (res, distNode) {
    window.ccsCache = window.ccsCache || {};
    var isRelease = !!window.ccsCache[res];
    window.ccsCache[res] = window.ccsCache[res] || ccs.load(res, 'res/').node;
    var parent = window.ccsCache[res];
    var arr = [];
    for (var i = 0; i < parent.children.length; i++)
        arr.push(parent.children[i]);
    for (var i = 0; i < arr.length; i++) {
        arr[i].retain();
        arr[i].removeFromParent(false);
    }
    for (var i = 0; i < arr.length; i++) {
        distNode.getChildByName('Scene').addChild(arr[i]);
        arr[i].release();
    }
    if (isRelease)
        window.ccsCache[res].release();
    delete window.ccsCache[res];
};

var batchSetChildrenZorder = function (node, map) {
    for (var k in map)
        if (map.hasOwnProperty(k)) {
            var child = node.getChildByName(k);
            if (child)
                child.setLocalZOrder(map[k]);
        }
};

var loadCCSTo = function (res, distNode, rootName, moreArr) {
    moreArr = moreArr || [];
    var mainscene = null;
    if (window.ccsCache && window.ccsCache[res]) {
        mainscene = window.ccsCache[res];
        window.ccsCache[res] = null;
        distNode.addChild(mainscene.node);
        mainscene.node.release();
    }
    else {
        mainscene = ccs.load(res, 'res/');
        distNode.addChild(mainscene.node);
    }

    var interval = null;
    var checkFunc = function () {
        if (!checkAllNodesValid(distNode.getChildByName(rootName)))
            return;
        var rootNode = distNode.getChildByName(rootName);
        for (var i = 0; i < moreArr.length; i++) {
            var node = rootNode.getChildByName(moreArr[i]);
            if (!node || !cc.sys.isObjectValid(node))
                return;
        }
        clearInterval(interval);
        interval = null;

        var ret = true;
        if (distNode.getBeforeOnCCSLoadFinish && distNode.getBeforeOnCCSLoadFinish())
            ret = distNode.getBeforeOnCCSLoadFinish()();
        if (ret && distNode.onCCSLoadFinish) {
            distNode.onCCSLoadFinish.call(distNode);
        }
    };
    interval = setInterval(checkFunc, 1);
    checkFunc();
};

/**
 * 杀进程
 * */
var crash = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (window.nativeVersion < registerSdkVersion) {
            jsb.reflection.callStaticMethod('AppController', 'crash');
        } else {
            jsb.reflection.callStaticMethod('CommonUtil', 'crash');
        }
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity',
            'crash',
            '(Z)V',
            true
        );
    }
};

var calcPos = function (edgeWidth, partWidth, intervalWidth, num, cb) {
    //var left = totalWidth - (num - 1) * intervalWidth - edgeWidth * num;
    for (var i = 0; i < num; i++) {
        cb(i, edgeWidth + partWidth * i + intervalWidth * i);
    }
};

var loadImageToSprite = function (url, targetSprite) {
    if (!url) return;
    if (url.charAt(url.length - 2) == '/' &&
        url.charAt(url.length - 1) == '0')
        url = url.substr(0, url.length - 2) + '/132';

    // url.replace("https", "http");
    if (url.startsWith('https')) {
        url = 'http' + url.substring(5);
    }

    var userData = targetSprite.getUserData() || {};
    // if (userData.url == url)
    //     return;

    var sprite = null;
    var children = targetSprite.getChildren();
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.getName() == 'head') {
            sprite = child;
            break;
        }
    }

    var idx = (targetSprite.idx || 0) + 1;
    targetSprite.idx = (targetSprite.idx || 0) + 1;
    if (!url)
        return;
    cc.textureCache.addImageAsync(url, function (texture) {
        if (idx != targetSprite.idx)
            return;
        sprite && sprite.removeFromParent(true);
        sprite = new cc.Sprite(texture);
        sprite.setTexture(texture);

        var scaleX = targetSprite.getContentSize().width / sprite.getContentSize().width;
        var scaleY = targetSprite.getContentSize().height / sprite.getContentSize().height;
        sprite.setScale(scaleX, scaleY);
        sprite.setAnchorPoint(0, 0);
        sprite.setName('head');
        if (!targetSprite.getChildByName('head'))
            targetSprite.addChild(sprite);

        userData.url = url;
        targetSprite.setUserData(userData);
    }, null);
};
var loadImageToSprite2 = loadImageToSprite;
var getPositionRelativeToParent = function (node, level) {
    var t = node;
    var a = 0, b = 0;
    for (var i = 0; i < level; i++) {
        if (!t)
            return null;
        a += t.getPositionX();
        b += t.getPositionY();
        t = t.getParent();
    }
    if (t) {
        return cc.p(a, b);
    }
    return null;
};

var getPositionRelativeToSibling = function (node, sibling) {
    var p0 = node.getPosition();
    var p1 = sibling.getPosition();
    p0.x -= p1.x;
    p0.y -= p1.y;
    return p0;
};

var addAction = function (node, action) {
    action.retain();
    setTimeout(function () {
        var interval = setInterval(function () {
            if (!node || !cc.sys.isObjectValid(node)) {
                action.release();
                return clearInterval(interval);
            }
            if (node.getNumberOfRunningActions() == 0) {
                node.runAction(cc.sequence(action, cc.callFunc(function () {
                    action.release();
                })));
                clearInterval(interval);
            }
        }, 16);
    }, 66);
};

function clone(obj) {
    var o;
    switch (typeof obj) {
        case 'undefined':
            break;
        case 'string'   :
            o = obj + '';
            break;
        case 'number'   :
            o = obj - 0;
            break;
        case 'boolean'  :
            o = obj;
            break;
        case 'object'   :
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
            break;
    }
    return o;
}

/**
 * 获得游戏盾ip
 * @return {String}
 * */
var getNextIp2 = function (group) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (window.nativeVersion < registerSdkVersion) {
            try {
                return jsb.reflection.callStaticMethod(
                    'AppController',
                    'ni2:n:',
                    YunCengKey_ios,
                    group
                );
            } catch (e) {
            }
        } else {
            return jsb.reflection.callStaticMethod(
                'CommonUtil',
                'ni2:n:',
                YunCengKey_ios,
                group
            );
        }
    } else if (cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'ni2',
            '(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;',
            YunCengKey_android,
            group
        );
    }
    return '';
};

//0x70,0x68,0x7a,0x31,0x2e,0x36,0x32,0x77,0x62,0x6f,0x73,0x35,0x62,0x31,0x6e,0x2e,0x61,0x6c,0x69,0x79,0x75,0x6e,0x67,0x66,0x2e,0x63,0x6f,0x6d
//0x70,0x68,0x7a,0x32,0x2e,0x36,0x6b,0x62,0x74,0x32,0x68,0x61,0x79,0x6b,0x68,0x2e,0x61,0x6c,0x69,0x79,0x75,0x6e,0x67,0x66,0x2e,0x63,0x6f,0x6d
//0x70,0x68,0x7a,0x33,0x2e,0x6f,0x66,0x6c,0x71,0x6e,0x64,0x68,0x34,0x66,0x73,0x2e,0x61,0x6c,0x69,0x79,0x75,0x6e,0x67,0x66,0x2e,0x63,0x6f,0x6d
//0x70,0x68,0x7a,0x34,0x2e,0x69,0x73,0x6b,0x75,0x35,0x34,0x39,0x68,0x35,0x66,0x2e,0x61,0x6c,0x69,0x79,0x75,0x6e,0x67,0x66,0x2e,0x63,0x6f,0x6d
var UL = {
    '0': {
        'yxd': String.fromCharCode.apply(null, [0x70, 0x68, 0x7a, 0x31, 0x2e, 0x36, 0x32, 0x77, 0x62, 0x6f, 0x73, 0x35, 0x62, 0x31, 0x6e, 0x2e, 0x61, 0x6c, 0x69, 0x79, 0x75, 0x6e, 0x67, 0x66, 0x2e, 0x63, 0x6f, 0x6d]),
        'ym': 'http://phz.yygameapi.com',
        'gf': '116.211.166.201'//高防'phz.xcve1xafe.com'
    },
    '1': {
        'yxd': String.fromCharCode.apply(null, [0x70, 0x68, 0x7a, 0x32, 0x2e, 0x36, 0x6b, 0x62, 0x74, 0x32, 0x68, 0x61, 0x79, 0x6b, 0x68, 0x2e, 0x61, 0x6c, 0x69, 0x79, 0x75, 0x6e, 0x67, 0x66, 0x2e, 0x63, 0x6f, 0x6d]),
        'ym': 'http://phz.yygameapi.com',
        'gf': '116.211.166.201'//高防'phz.xcve1xafe.com'
    },
    '2': {
        'yxd': String.fromCharCode.apply(null, [0x70, 0x68, 0x7a, 0x33, 0x2e, 0x6f, 0x66, 0x6c, 0x71, 0x6e, 0x64, 0x68, 0x34, 0x66, 0x73, 0x2e, 0x61, 0x6c, 0x69, 0x79, 0x75, 0x6e, 0x67, 0x66, 0x2e, 0x63, 0x6f, 0x6d]),
        'ym': 'http://phz.yygameapi.com',
        // 'gf': {
        //     'dx': String.fromCharCode.apply(null, [49, 49, 54, 46, 50, 49, 49, 46, 49, 54, 55, 46, 52, 52]),
        //     'lt': String.fromCharCode.apply(null, [50, 49, 56, 46, 49, 49, 46, 49, 46, 49, 48, 53])
        // }
        'gf': '116.211.166.201'//高防'phz.xcve1xafe.com'
    },
    '3': {
        'yxd': String.fromCharCode.apply(null, [0x70, 0x68, 0x7a, 0x34, 0x2e, 0x69, 0x73, 0x6b, 0x75, 0x35, 0x34, 0x39, 0x68, 0x35, 0x66, 0x2e, 0x61, 0x6c, 0x69, 0x79, 0x75, 0x6e, 0x67, 0x66, 0x2e, 0x63, 0x6f, 0x6d]),
        'ym': 'http://phz.yygameapi.com',
        // 'gf': {
        //     'dx': String.fromCharCode.apply(null, [49, 49, 54, 46, 50, 49, 49, 46, 49, 54, 55, 46, 52, 52]),
        //     'lt': String.fromCharCode.apply(null, [50, 49, 56, 46, 49, 49, 46, 49, 46, 49, 48, 53])
        // }
        'gf': '116.211.166.201'//高防'phz.xcve1xafe.com'
    }
};

var IIL = function (ts) {
    var _ul;
    do {
        if (_.isUndefined(ts)) {
            ts = cc.sys.localStorage.getItem(gameData.clientId + 'dnts');
            if (!ts || ts.length != 13) {
                ts = '1487473786031';
            }
            ts = (Math.round(new Date().getTime() / 1000) + 1).toString() + ts.substring(10);
        }
        if (_.isNumber(ts)) ts = ts.toString();
        if (ts.length != 13) {
            _ul = '0';
            break;
        }
        var sec1 = _.parseInt(ts.substring(0, 10));
        var sec2 = Math.round(new Date().getTime() / 1000);
        if (Math.abs(sec1 - sec2) > 86400) {
            _ul = '0';
            break;
        }
        _ul = ts.substring(10, 11);
    } while (false);

    if (_.isNumber(_ul)) _ul = _ul.toString();
    if (!UL[_ul]) _ul = '0';
    if (_.isArray(gameData.ipList) && gameData.userLevel == _ul) {
        return;
    }
    gameData.ipList = [];
    gameData.ipList.splice(0, 0, UL[_ul].ym);

    if (!window.inReview) {
        var _tmp_ul = (_.parseInt(_ul) + (gameData._add_ul || 0)) % 4;
        _tmp_ul = _tmp_ul.toString();
        if (!gameData.ipType || gameData.ipType == 'other' || !UL[_tmp_ul]['gf'][gameData.ipType]) {
            gameData.ipList.splice(0, 0, 'http://' + UL[_tmp_ul]['gf']['dx']);
            gameData.ipList.splice(0, 0, 'http://' + UL[_tmp_ul]['gf']['lt']);
        } else {
            gameData.ipList.splice(0, 0, 'http://' + UL[_tmp_ul]['gf'][gameData.ipType]);
        }

        var sdkIp = getNextIp2(UL[_ul].yxd);
        // console.log("sdkIp = " + sdkIp);
        if (sdkIp && /\d+\.\d+\.\d+\.\d+/.test(sdkIp)) {
            if (!sdkIp.startsWith('http://') && !sdkIp.startsWith('https://')) {
                sdkIp = 'http://' + sdkIp;
            }
            gameData.ipList.splice(0, 0, sdkIp);
        }
    }
    gameData.userLevel = _ul;
    cc.sys.localStorage.setItem(gameData.clientId + 'dnts', ts);
};
var startLocate = function () {
    if (!cc.sys.isNative) {
        return null;
    }
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(
            'AppController',
            'startLocation'
        );
    }
    else {
        return jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'startLocate',
            '()Ljava/lang/String;'
        );
    }
};
var getCurTimemills = function () {
    return (new Date()).getTime();
};

var getCurLocation = function () {
    if (!cc.sys.isNative) {
        return null;
    }
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(
            'AppController',
            'getCurLocation'
        );
    }
    else {
        return jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'getCurLocation',
            '()Ljava/lang/String;'
        );
    }
};

var clearCurLocation = function () {
    if (!cc.sys.isNative) {
        return null;
    }
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(
            'AppController',
            'clearCurLocation'
        );
    }
    else {
        return jsb.reflection.callStaticMethod(
            'org/cocos2dx/javascript/AppActivity',
            'clearCurLocation',
            '()Ljava/lang/String;'
        );
    }
};
var deepCopy = function (source) {
    var result = [];
    for (var key in source) {
        result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
    }
    return result;
};

/**
 * 复制到剪切板
 * @param {String} text
 * */
var savePasteBoard = function (text) {
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (window.nativeVersion < registerSdkVersion) {
            jsb.reflection.callStaticMethod('AppController', 'savePasteBoard:', text);
        } else {
            jsb.reflection.callStaticMethod('CommonUtil', 'savePasteBoard:', text);
        }
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(
            packageUri + '/utils/ClipboardUtil',
            'clipboardCopyText',
            '(Ljava/lang/String;)V',
            text
        );
    }
};

/**
 * 获得剪切板内容
 * @return {String}
 * */
var getPasteBoard = function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (window.nativeVersion < registerSdkVersion) {
            return jsb.reflection.callStaticMethod('AppController', 'getPasteBoard');
        } else {
            return jsb.reflection.callStaticMethod('CommonUtil', 'getPasteBoard');
        }
    }
    return '';
};

/**
 * 数字转换 例如1转①
 * @param txtstring 数字
 * @returns {string} 转换后的数字
 */
var ToDBC = function (txtstring) {
    var tmp = '';
    if (typeof txtstring != 'string') {
        txtstring = '' + txtstring;
    }
    for (var i = 0; i < txtstring.length; i++) {
        if (txtstring.charCodeAt(i) == 32) {
            tmp = tmp + String.fromCharCode(12288);
        }
        if (txtstring.charCodeAt(i) < 127) {
            tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
        }
    }
    return tmp;
};

//提示框
//@data{color,fontName,fontSize,swallowTouch...}
var showMessage = function (message, data) {
    var currScene = cc.director.getRunningScene();
    if (currScene) {
        var layer = new MessageLayer(message, data);
        if (data && data.swallowTouch)
            TouchUtils.setOnclickListener(layer, function () {
            });
        currScene.addChild(layer, 9999);
    }
};
var showToast = function(str){
    showMessage(str);
}


// //定位
// /**
//  * approx distance between two points on earth ellipsoid
//  * @param {Object} lat1
//  * @param {Object} lng1
//  * @param {Object} lat2
//  * @param {Object} lng2
//  */
// var EARTH_RADIUS = 6378137.0;    //单位M
// var PI = Math.PI;
//
// function getRad(d) {
//     return d * PI / 180.0;
// }
//
// function getFlatternDistance(lat1, lng1, lat2, lng2) {
//     lat1 = parseFloat(lat1);
//     lng1 = parseFloat(lng1);
//     lat2 = parseFloat(lat2);
//     lng2 = parseFloat(lng2);
//     var f = getRad((lat1 + lat2) / 2);
//     var g = getRad((lat1 - lat2) / 2);
//     var l = getRad((lng1 - lng2) / 2);
//
//     var sg = Math.sin(g);
//     var sl = Math.sin(l);
//     var sf = Math.sin(f);
//
//     var s, c, w, r, d, h1, h2;
//     var a = EARTH_RADIUS;
//     var fl = 1 / 298.257;
//
//     sg = sg * sg;
//     sl = sl * sl;
//     sf = sf * sf;
//
//     s = sg * (1 - sl) + (1 - sf) * sl;
//     c = (1 - sg) * (1 - sl) + sf * sl;
//
//     w = Math.atan(Math.sqrt(s / c));
//     r = Math.sqrt(s * c) / w;
//     d = 2 * w * a;
//     h1 = (3 * r - 1) / 2 / c;
//     h2 = (3 * r + 1) / 2 / s;
//
//     var ret = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
//     return _.isNaN(ret) ? 0 : ret.toFixed(1);
// }

// var getCurLocationInfo = function (cb) {
//     if (window.inReview)
//         return;
//     if (gameData.location) {
//         var coordtype = 'wgs84ll';
//         if (cc.sys.os == cc.sys.OS_IOS) {
//             coordtype = 'wgs84ll';
//         } else {
//             coordtype = 'bd09ll';
//         }
//         httpGet('http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&coordtype=' + coordtype + '&location=' + gameData.location + '&output=json&pois=0&ak=WIVhGkuCRHrD57PnqK3hqZYpMjgavx9p',
//             function (str) {
//                 str = str.substring(29, str.length - 1);
//                 var jsonData = JSON.parse(str);
//                 var status = jsonData.status;
//                 if (status == 0) {
//                     cb(jsonData.result['formatted_address'], jsonData.result.location['lng'], jsonData.result.location['lat']);
//                 } else {
//                     // alert1("失败, 请检查网络连接");
//                 }
//             }, function () {
//
//             }, {
//                 'Accept-Encoding': 'deflate'
//             });
//     }
// };

var isNetwork = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('NetManager', 'isNetwork');
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/NetManager', 'isNetwork', '()Z');
    }
};

var beginNetListener = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('NetManager', 'beginNetListener');
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/NetManager', 'beginNetListener', '()V');
    }
};

var stopNetListener = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod('NetManager', 'stopNetListener');
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        return jsb.reflection.callStaticMethod(packageUri + '/utils/NetManager', 'stopNetListener', '()V');
    }
};

var randomString = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};
var getCurTimeMillisecond = function () {
    return Math.round((new Date()).getTime());
};

var MaScene = cc.Scene.extend({
    replayData: null,
    reconnectData: null,
    maLayer: null,
    replayLayer: null,
    ctor: function (data) {
        this._super();

        var isReplay = !!(data && data['3002']);
        var isReconnect = !!(data && !isReplay);

        if (isReplay)
            this.replayData = data || null;
        if (isReconnect)
            this.reconnectData = data || null;

        var layer = new MaLayer((isReplay ? null : this.reconnectData), isReplay);
        this.addChild(layer);
        this.maLayer = layer;

        window.maLayer = layer;
        window.paizhuo = 'majiang';

        if (isReplay) {
            var playLayer = new Ma_PlayBackLayer(data);
            layer.addChild(playLayer, 999);
        }

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;
    },
    getMalayer: function () {
        return this.maLayer;
    },
    onEnter: function () {
        cc.Scene.prototype.onEnter.call(this);
    },
    onExit: function () {
        cc.Scene.prototype.onExit.call(this);
    }
});

var NiuNiuScene = cc.Scene.extend({
    replayData: null,
    reconnectData: null,
    niuniuLayer: null,
    replayLayer: null,
    ctor: function (data) {
        this._super();

        var layer = null;
        if (gameData.mapId == MAP_ID.CRAZYNN) {
            layer = new NiuniuZJNLayer(data);
        } else {
            layer = new NiuniuLayer(data);
        }
        this.addChild(layer);
        this.niuniuLayer = layer;

        window.niuniuLayer = layer;
        window.paizhuo = 'niuniu';

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;

    },
    getMalayer: function () {
        return this.niuniuLayer;
    },
    onEnter: function () {
        cc.Scene.prototype.onEnter.call(this);
    },
    onExit: function () {
        cc.Scene.prototype.onExit.call(this);
    }
});

var PuKeScene = cc.Scene.extend({
    replayData: null,
    reconnectData: null,
    maLayer: null,
    replayLayer: null,
    ctor: function (data) {
        this._super();

        var isReplay = !!(data && data['3002']);
        var isReconnect = !!(data && !isReplay);

        if (isReplay)
            this.replayData = data || null;
        if (isReconnect)
            this.reconnectData = data || null;

        var layer = new PokerLayer((isReplay ? null : this.reconnectData), isReplay);
        this.addChild(layer);
        this.maLayer = layer;

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;

        window.maLayer = layer;
        window.paizhuo = 'pdk';

        if (isReplay) {
            var playLayer = new PokerPlayBackLayer(data);
            window.maLayer.addChild(playLayer, 500);
        }
    },

    getMalayer: function () {
        return this.maLayer;
    },
    onEnter: function () {
        cc.Scene.prototype.onEnter.call(this);
    },
    onExit: function () {
        cc.Scene.prototype.onExit.call(this);
    }
});
var ZJHScene = cc.Scene.extend({
    replayData: null,
    reconnectData: null,
    maLayer: null,
    replayLayer: null,
    ctor: function (data) {
        this._super();

        var isReplay = !!(data && data['3002']);
        var isReconnect = !!(data && !isReplay);

        if (isReplay)
            this.replayData = data || null;
        if (isReconnect)
            this.reconnectData = data || null;

        var layer = new MaLayer_zjh((isReplay ? null : this.reconnectData), isReplay);
        this.addChild(layer);
        this.maLayer = layer;

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;

        window.maLayer = layer;
        window.paizhuo = 'zjh';

        if (isReplay) {
            var playLayer = new PokerPlayBackLayer(data);
            window.maLayer.addChild(playLayer, 500);
        }
    },

    getMalayer: function () {
        return this.maLayer;
    },
    onEnter: function () {
        cc.Scene.prototype.onEnter.call(this);
    },
    onExit: function () {
        cc.Scene.prototype.onExit.call(this);
    }
});
var getPaiNameById = function (id) {
    if (id < 0) return ['b/poker_back.png'];
    if (id >= 0 && id <= 12) return ['b/red_' + (id - 0) % 13 + '.png', 'b/bigtag_2.png'];//红桃
    if (id >= 13 && id <= 25) return ['b/black_' + (id - 13) % 13 + '.png', 'b/bigtag_3.png'];//黑桃
    if (id >= 26 && id <= 38) return ['b/black_' + (id - 26) % 13 + '.png', 'b/bigtag_1.png'];//梅花
    if (id >= 39 && id <= 51) return ['b/red_' + (id - 39) % 13 + '.png', 'b/bigtag_0.png'];//方块
    if (id == 52) return ['b/smalltag_4.png'];
    if (id == 53) return ['b/smalltag_5.png'];
};
//牛牛 红桃0-12 黑桃13-25 梅花26-38 方片39-51   后端给的数据  1-4 A 5-8 2  //1方片 2梅花 3红桃 4黑桃
var getPaiNameByIdNN = function (id) {
    id = parseInt(id);
    if (id == 55) return 'poker_54.png';
    var color = (id - 1) % 4;
    var value = Math.floor((id - 1) / 4);
    var cardAdd = [39, 26, 0, 13];
    var card = cardAdd[color] + value;
    return 'poker_' + card + '.png';
};
var getZhuangMode = function (data) {
    if (data['crazy']) {
        return '疯狂双十';
    }
    if (data.ZhuangMode == 'Niuniu') {
        return '双十上庄';
    } else if (data.ZhuangMode == 'Tongbi') {
        return '通比玩法';
    } else if (data.ZhuangMode == 'Qiang' && (data.Preview || data.Preview_mp)) {
        if (data.noColor) {
            return '无花双十';
        }
        if (data.AlwaysTui) {
            if (data.Players == 'jiu') return '抢庄推注-九人场';
            return '抢庄推注';
        } else {
            if (data.Players == 'jiu') return '明牌抢庄-九人场';
            return '明牌抢庄-六人场';
        }
    } else if (data.ZhuangMode == 'Lunliu') {
        if (data.Players == 'jiu') return '九人经典-轮庄';
        return '经典双十-轮庄';
    } else if (data.ZhuangMode == 'ShuijiBawang') {
        if (data.Players == 'jiu') return '九人经典-霸王庄';
        return '经典双十-霸王庄';
    } else if (data.ZhuangMode == 'Auto') {
        if (data.Players == 'jiu') return '九人经典双十-连庄';
        return '经典双十-连庄';
    } else {
        return '抢庄玩法';
    }
};
var UTF8ArrayToUTF16Array = function (s) {
    if (!s)
        return;
    var i, codes, bytes, ret = [], len = s.length;
    for (i = 0; i < len; i++) {
        codes = [];
        codes.push(s[i]);
        if (((codes[0] >> 7) & 0xff) == 0x0) {
            //单字节  0xxxxxxx
            ret.push(s[i]);
        } else if (((codes[0] >> 5) & 0xff) == 0x6) {
            //双字节  110xxxxx 10xxxxxx
            codes.push(s[++i]);
            bytes = [];
            bytes.push(codes[0] & 0x1f);
            bytes.push(codes[1] & 0x3f);
            ret.push((bytes[0] << 6) | bytes[1]);
        } else if (((codes[0] >> 4) & 0xff) == 0xe) {
            //三字节  1110xxxx 10xxxxxx 10xxxxxx
            codes.push(s[++i]);
            codes.push(s[++i]);
            bytes = [];
            bytes.push((codes[0] << 4) | ((codes[1] >> 2) & 0xf));
            bytes.push(((codes[1] & 0x3) << 6) | (codes[2] & 0x3f));
            ret.push((bytes[0] << 8) | bytes[1]);
        }
    }
    return ret;
};

var clearGameMWRoomId = function () {
    if (getNativeVersion() < '2.0.0') {
        return;
    }
    var roomId = MWUtil.getRoomId();
    if (_.isString(roomId) && roomId.length == 6) {
        MWUtil.clearRoomId();
    }
};
//1方片 2梅花 3红桃 4黑桃
var setCardBigUI = function (node, val) {
    var createS = function (name) {
        var s = new cc.Sprite();
        s.setName(name);
        node.addChild(s);
        return s;
    };
    var nodeW = node.getContentSize().width;
    var nodeH = node.getContentSize().height;

    var arr = getPaiNameById(val);

    var c = node.getChildByName('c');
    if (c) c.setVisible(false);

    var a = node.getChildByName('a');
    if (!a) {
        a = createS('a');
    }
    a.setScale(0.6);
    a.setPosition(cc.p(17, nodeH - 8));
    setPokerFrameByNameNN(a, arr[0]);

    var b = node.getChildByName('b');
    if (!b) {
        b = createS('b');
    }
    b.setScale(0.5);
    b.setPosition(cc.p(17, nodeH - 40));
    setPokerFrameByNameNN(b, arr[1]);

    var a1 = node.getChildByName('a1');
    if (!a1) {
        a1 = createS('a1');
    }
    a1.setScale(0.6);
    a1.setRotation(-180);
    a1.setPosition(cc.p(nodeW - 17, 22));
    setPokerFrameByNameNN(a1, arr[0]);

    var b1 = node.getChildByName('b1');
    if (!b1) {
        b1 = createS('b1');
    }
    b1.setRotation(-180);
    b1.setScale(0.5);
    b1.setPosition(cc.p(nodeW - 17, 43));
    setPokerFrameByNameNN(b1, arr[1]);

    var huaPosArr = [
        //10
        cc.p(37, nodeH / 2 + 42),
        cc.p(nodeW - 37, nodeH / 2 + 42),
        cc.p(nodeW / 2, nodeH / 2 + 28),
        cc.p(37, nodeH / 2 + 14),
        cc.p(nodeW - 37, nodeH / 2 + 14),
        cc.p(37, nodeH / 2 - 14),
        cc.p(nodeW - 37, nodeH / 2 - 14),
        cc.p(nodeW / 2, nodeH / 2 - 28),
        cc.p(37, nodeH / 2 - 42),
        cc.p(nodeW - 37, nodeH / 2 - 42),

        //1   ---10
        cc.p(nodeW / 2, nodeH / 2),
        //8   ---11
        cc.p(nodeW / 2, nodeH / 2 + 21),
        cc.p(37, nodeH / 2),
        cc.p(nodeW - 37, nodeH / 2),
        cc.p(nodeW / 2, nodeH / 2 - 21),
        //2    -----15
        cc.p(nodeW / 2, nodeH / 2 + 42),
        cc.p(nodeW / 2, nodeH / 2 - 42),
        //JQK    ---17
        cc.p(nodeW / 2 - 17, nodeH / 2 + 24),
        cc.p(nodeW / 2 + 17, nodeH / 2 - 24)
    ];
    var huaNum = 1;
    if (val >= 5 && val <= 40) {
        huaNum = Math.floor((val + 3) / 4);
    } else if (val >= 41 && val <= 52) {
        huaNum = 2;
    }
    var huaPosConfig = [];
    switch (huaNum) {
        case 1:
            huaPosConfig.push([huaPosArr[10]]);
            break;
        case 2:
            if (val >= 41 && val <= 52) {     //JQK
                huaPosConfig.push([huaPosArr[17], huaPosArr[18]]);
            } else {
                huaPosConfig.push([huaPosArr[15], huaPosArr[16]]);
            }
            break;
        case 3:
            huaPosConfig.push([huaPosArr[15], huaPosArr[10], huaPosArr[16]]);
            break;
        case 4:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[8], huaPosArr[9]]);
            break;
        case 5:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[10], huaPosArr[8], huaPosArr[9]]);
            break;
        case 6:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[12], huaPosArr[13], huaPosArr[8], huaPosArr[9]]);
            break;
        case 7:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[11], huaPosArr[12], huaPosArr[13], huaPosArr[8], huaPosArr[9]]);
            break;
        case 8:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[11], huaPosArr[12],
                huaPosArr[13], huaPosArr[14], huaPosArr[8], huaPosArr[9]]);
            break;
        case 9:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[3], huaPosArr[4], huaPosArr[10],
                huaPosArr[5], huaPosArr[6], huaPosArr[8], huaPosArr[9]]);
            break;
        case 10:
            huaPosConfig.push([huaPosArr[0], huaPosArr[1], huaPosArr[2], huaPosArr[3], huaPosArr[4], huaPosArr[5],
                huaPosArr[6], huaPosArr[7], huaPosArr[8], huaPosArr[9]]);
            break;
        default:
            break;
    }
    for (var i = 0; i < huaNum; i++) {
        var hua = node.getChildByName('hua' + i);
        if (!hua) {
            hua = createS('hua' + i);
        }
        if (val >= 41 && val <= 52) {
            setPokerFrameByNameNN(hua, arr[3]);
            hua.setScale(0.5);
            hua.setRotation((i == 1) ? -180 : 0);
        } else {
            setPokerFrameByNameNN(hua, arr[1]);
            // hua.setScale(0.9);
            hua.setRotation(0);
            hua.setScale((val >= 1 && val <= 4) ? 1.5 : 0.8);
        }
        hua.setVisible(true);
        hua.setPosition(huaPosConfig[0][i]);
    }
    for (i; i < 10; i++) {
        var hua = node.getChildByName('hua' + i);
        if (hua) hua.setVisible(false);
    }
};

var layerShowAni = function (layer, hasMask) {
    if (typeof hasMask === 'undefined') {
        hasMask = false;
    }
    var mask = null;

    var parent = layer.getParent();
    if (parent) {
        mask = new cc.LayerColor(cc.color(0, 0, 0, 255 / 2), cc.winSize.width, cc.winSize.height);
        mask.setName('mask');
        mask.setPosition(0, 0);
        parent.addChild(mask, -1);
    }

    if (!hasMask && mask) {
        var chupaiListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, _) {
                return true;
            },
            onTouchMoved: function (touch, _) {
            },
            onTouchEnded: function (touch, _) {
            }
        });
        cc.eventManager.addListener(chupaiListener, mask);
    }

    layer.setScale(0);
    layer.runAction(
        cc.scaleTo(0.1, 1).easing(cc.easeIn(0.1))
    );
};
var layerHideAni = function (layer, func) {
    var parent = layer.getParent();
    if (parent) {
        var mask = parent.getChildByName('mask');
        if (mask) {
            mask.runAction(cc.sequence(
                cc.scaleTo(0.1, 0),
                cc.removeSelf()
            ));
        }
    }

    layer.runAction(cc.sequence(
        cc.scaleTo(0.1, 0),
        cc.callFunc(function () {
            func();
        })
    ));
};
//界面动画
var popShowAni = function (layer, noMask) {
    if (!noMask) {
        //加背景蒙版
        var mask = new cc.LayerColor(cc.color(0, 0, 0, 255 / 2), cc.winSize.width, cc.winSize.height);
        mask.setName('mask');
        mask.setPosition(0, 0);
        layer.getParent().addChild(mask, -1);

        var chupaiListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, _) {
                return true;
            },
            onTouchMoved: function (touch, _) {
            },
            onTouchEnded: function (touch, _) {
            }
        });
        cc.eventManager.addListener(chupaiListener, mask);
    }

    layer.setScale(0);
    layer.runAction(cc.sequence(
        cc.scaleTo(0.1, 1.05, 1.05),
        cc.scaleTo(0.08, 0.95, 0.95),
        // cc.scaleTo(0.05, 0.95, 1.05),
        cc.scaleTo(0.05, 1, 1)
    ));
};
var popHideAni = function (layer, func) {
    layer.runAction(cc.sequence(
        cc.scaleTo(0.2, 0),
        cc.callFunc(function () {
            var parent = layer.getParent();
            if (parent) {
                var mask = parent.getChildByName('mask');
                if (mask) {
                    mask.runAction(cc.sequence(
                        cc.scaleTo(0.1, 0),
                        cc.removeSelf()
                    ));
                }
            }
            func();
        })
    ));
};
//全局函数添加
/**
 * 五一活动签到
 */
var sctivity51SignIn = function () {
    var signInUrl = null;
    if (gameData.opt_conf.LaborDay == 1) {
        signInUrl = 'http://pay.yayayouxi.com/fyactivity/app/signIn';
    } else if (gameData.opt_conf.LaborDay == 2) {
        signInUrl = 'http://pay.yayayouxi.com/fyactivity-test/app/signIn';
    }
    if (!signInUrl) {
        console.log('服务器51活动未开启');
        return;
    }

    var data = {
        'playerId': gameData.uid,
        'area': gameData.parent_area,
        'activityType': 18,
        'signKey': Crypto.MD5('feiyu-activity' + gameData.uid + gameData.parent_area)
    };
    console.log(signInUrl);
    console.log(data);
    NetUtils.httpPost(signInUrl, data,
        function (data) {
            console.log(data);
        }, function (data) {
            console.log(data);
        });
};
var playAnimScene2 = function (distNode, res, posx, posy, loop, func) {
    var cacheNode = distNode.getChildByName(res);
    if (!cacheNode) {
        var animScene = ccs.load(res, 'res/');
        cacheNode = animScene.node;
        if (cacheNode) {
            console.log(res);
            cacheNode.setName(res);
            distNode.addChild(cacheNode);
            cacheNode.runAction(animScene.action);
            cacheNode.setPosition(posx, posy);

            var userdata = cacheNode.getUserData() || {};
            userdata.action = animScene.action;
            cacheNode.setUserData(userdata);
        } else {
            alert1('load ' + res + ' failed');
        }
    }

    var userdata = cacheNode.getUserData();
    userdata.action.play('action', loop);
    if (func) {
        userdata.action.setLastFrameCallFunc(func);
    }
    return cacheNode;
};
/**
 * //五一宝箱活动 默认不传入参数为测试地址
 * @param area 用户地区
 * @param roomid 房间ID
 * @param urlType 有值为正式地址 无参数为测试地址
 */
var activity51Box = function (area, roomid) {
    if (!area || !roomid) {
        console.log('房间号 地区不能为空');
        return;
    }
    var boxUrl = null;
    if (gameData.opt_conf.LaborDay == 1) {
        boxUrl = 'http://pay.yayayouxi.com/fyactivity/app/gameOverMessage';
    } else if (gameData.opt_conf.LaborDay == 2) {
        boxUrl = 'http://pay.yayayouxi.com/fyactivity-test/app/gameOverMessage';
    }
    if (!boxUrl) {
        console.log('服务器51活动未开启');
        return;
    }
    showLoading('正在请求中...');
    var data = {
        'roomId': roomid,
        'area': area,
        'activityType': 17,
        'signKey': Crypto.MD5('feiyu-activity' + roomid + area)
    };
    if (!cc.sys.isNative) console.log(data);
    NetUtils.httpPost(boxUrl, data,
        function (data) {
            hideLoading();
            if (!cc.sys.isNative) console.log(data);
            if (data.code == '0000') {
                if (data.data.playerId == gameData.uid) {
                    var type = data.data.drawType;
                    if (type == 1 || type == 4 || type == 7) {
                        var zhufuArr = ['游戏需动脑，劳动最光荣！再接再厉！',
                            '爱迪生尝试1600种灯丝后，才点亮了世界！拿大奖要坚持不懈哦！',
                            '劳动最光荣，懒癌也要钱？当代理，赚大钱，财运滚滚来！',
                            '福签：把把大赢家！ 风云祝福，叱咤牌坛！', '上上签：顺风顺水，把把通杀！  风云祝福，叱咤牌坛！'];
                        var showtext = zhufuArr[Math.floor(Math.random() * zhufuArr.length)];

                        var layer = new cc.Layer();
                        var scene = ccs.load(res.GiftZhufu_json, 'res/');
                        layer.addChild(scene.node);
                        TouchUtils.setOnclickListener(layer.getChildByName('Node').getChildByName('root').getChildByName('btn_close'), function () {
                            console.log('点击关闭');
                            layer.removeFromParent();
                        });
                        var text = layer.getChildByName('Node').getChildByName('root').getChildByName('text');
                        if (text) text.setString(showtext);
                        cc.director.getRunningScene().addChild(layer);
                        return;
                    }
                    type = data.data.drawType < 4 ? 1 : (data.data.drawType < 7 ? 2 : 3);
                    var layer = new cc.Layer();
                    var isAnimOver = false;
                    TouchUtils.setOnclickListener(layer, function () {
                        if (!isAnimOver) return;
                        layer.removeAllChildren();
                        TouchUtils.setOnclickListener(layer, function () {
                        });

                        var animNode = playAnimScene2(layer, res['box_' + type + '_2'], cc.winSize.width / 2, cc.winSize.height / 2, false, function () {
                            TouchUtils.setOnclickListener(layer, function () {
                            });
                        });
                        //TouchUtils.setOnclickListener(layer);
                        var sp = animNode.getChildByName('texture').getChildByName('jiangpin');
                        var text = animNode.getChildByName('texture').getChildByName('Text');
                        var close = animNode.getChildByName('botton').getChildByName('close');
                        var fenxiang = animNode.getChildByName('botton').getChildByName('fenxiang');
                        // sp.setTexture("res/huodong_51/animation/active/gift_type_"+type+".png");
                        sp.setTexture('res/huodong_51/animation/active/gift_type_' + ((data.data.drawType - 1) % 3 + 1) + '.png');
                        text.setString(data.data.describe || '');
                        TouchUtils.setOnclickListener(close, function () {
                            console.log('点击关闭');
                            layer.removeFromParent();
                        });
                        TouchUtils.setOnclickListener(fenxiang, function () {

                            var scene = ccs.load(res.Share51ActNode_json, 'res/');
                            WXUtils.captureAndShareToPyq(scene.node, 0x88F0);

                            console.log('点击分享');
                            sctivity51SignIn();
                        });
                    });
                    cc.director.getRunningScene().addChild(layer);
                    playAnimScene2(layer, res['box_' + type + '_1'], cc.winSize.width / 2, cc.winSize.height / 2, false, function () {
                        //layer.removeAllChildren();
                        isAnimOver = true;
                        console.log('isAnimOver');
                    });
                } else {
                    var layer = new cc.Layer();
                    var scene = ccs.load(res.NoGift_json, 'res/');
                    layer.addChild(scene.node);
                    TouchUtils.setOnclickListener(layer.getChildByName('Node').getChildByName('btn_close'), function () {
                        console.log('点击关闭');
                        layer.removeFromParent();
                    });
                    TouchUtils.setOnclickListener(layer.getChildByName('Node').getChildByName('root'), function () {

                    });
                    cc.director.getRunningScene().addChild(layer);
                }
            } else {
            }
        }, function (reqdata) {
            hideLoading();
            console.log(reqdata);
        }
    );
};
/**
 转转乐
 */
var zhuanzhuanle = function (area, roomid) {
    if (!area || !roomid) {
        console.log('房间号 地区不能为空');
        return;
    }
    var boxUrl = null;
    if (gameData.opt_conf.liuyi == 1) {
        boxUrl = 'http://pay.yayayouxi.com/fyactivity/app/gameOverMessage';
    } else if (gameData.opt_conf.liuyi == 2) {
        boxUrl = 'http://pay.yayayouxi.com/fyactivity-test/app/gameOverMessage';
    }
    if (!boxUrl) {
        return;
    }
    showLoading('正在请求中...');
    var data = {
        'roomId': roomid,
        'area': area,
        // 'activityType':19,
        'signKey': Crypto.MD5('feiyu-activity' + roomid + area)
    };
    if (!cc.sys.isNative) console.log(data);
    NetUtils.httpPost(boxUrl, data,
        function (data) {
            hideLoading();
            if (!cc.sys.isNative) console.log(data);
            if (data.code == '0000') {
                if (data.data.playerId == gameData.uid) {
                    var layer = new cc.Layer();
                    var isAnimOver = false;
                    TouchUtils.setOnclickListener(layer, function () {
                    }, {effect: TouchUtils.effects.NONE});
                    cc.director.getRunningScene().addChild(layer, 100);
                    playAnimScene2(layer, res['box_1_2'], cc.winSize.width / 2, cc.winSize.height / 2, false, function () {
                    });
                    var close = new cc.Sprite('res/animation/close.png');
                    close.setPosition(cc.p(cc.winSize.width / 2, 200));
                    layer.addChild(close);
                    TouchUtils.setOnclickListener(close, function () {
                        layer.removeFromParent();
                    });
                }
            } else {
            }
        }, function (reqdata) {
            hideLoading();
            console.log(reqdata);
        }
    );
};
//红包雨活动
var activityRedRain = function (create_time, area) {
    showLoading('正在加载中...');
    var data = {
        playerId: gameData.uid,
        unionId: gameData.unionid, //
        area: area,
        roomId: gameData.roomId,
        timestamp: create_time//getCurTimestamp(),
    };
    data.sign = Crypto.MD5(data.playerId + data.unionId + data.area + data.roomId + data.timestamp + '012E3456879aBCDFgHIjLNOPQRSUVWXYzAbcKdefMGhiJklmnopqrstTuvwxyZ+/');
    console.log(JSON.stringify(data));
    var url = 'https://pay.yayayouxi.com/fyactivity/activity/draw/redRain';
    if (gameData.test) url = 'https://pay.yayayouxi.com/fyactivity-test/activity/draw/redRain';
    httpPost(url, data,
        // httpPost("http://118.31.169.179:8086/fyactivity/activity/draw/redRain", data,
        function (response) {
            hideLoading();
            console.log(JSON.stringify(response));
            if (response.status == 6) {
                // alert1('抱歉，您未中奖！');
                cc.director.getRunningScene().addChild(new RedRainLayer('未获得红包'));
            } else if (response.status == 7) {
                //不在活动时间内
            } else if (response.data && response.data.playerId == gameData.uid) {
                cc.director.getRunningScene().addChild(new RedRainLayer(response.message));
            }
        }, function (response) {
            hideLoading();
            alert1('抱歉，系统繁忙！');
        }
    );

};

var getSortFlag = function () {
    var flag = -1;
    var sortFlag = cc.sys.localStorage.getItem('sortFlag');
    if (sortFlag) {
        flag = parseInt(sortFlag);
    }
    return flag;
};

var track_idx = 0;
var createSp = function (res_name) {
    if (!res['sp_' + res_name + '_json'] || !res['sp_' + res_name + '_atlas']) {
        cc.log('spine files not exist, res_name = ' + res_name);
        return null;
    }
    return new sp.SkeletonAnimation(res['sp_' + res_name + '_json'], res['sp_' + res_name + '_atlas']);
};
var playSpAnimation = function (sp_anim, animation_name, isLoop, timeScale, cb) {
    if (typeof sp_anim === 'string') {
        sp_anim = createSp(sp_anim);
    }
    if (sp_anim instanceof sp.SkeletonAnimation) {
        sp_anim.setAnimation(track_idx++,
            _.isUndefined(animation_name) ? 'animation' : animation_name,
            _.isUndefined(isLoop) ? true : isLoop);
        if (timeScale) {
            sp_anim.setTimeScale(timeScale);
        }
        if (cb) {
            sp_anim.setCompleteListener(function () {
                cb();
            });
        }
        return sp_anim;
    }
    return null;
};

var getUIPath = function (file) {
    return res[file];
};

/**
 * 寻找key
 * @param obj
 * @param value
 * @returns {*}
 */
var findKey = function (obj, value) {
    var key = null;
    for (var id in obj) {
        if (obj.hasOwnProperty(id)) {
            if (obj[id] == value) {
                key = id;
            }
        }
    }
    return key;
};

var getAesString = function (data, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();
};
var getDAesString = function (encrypted, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

var key = '81dbc64373d95edb';
var iv = '81dbc64373d95edb';

var getAES = function (data) {
    return getAesString(data, key, iv);
};

var getDAes = function (data) {
    return getDAesString(data, key, iv);
};

var getLocationInfo = function () {
};

var mapidToName = function (mapId, data) {
    var gameName = '';
    mapId = mapId || gameData.mapId;
    switch (parseInt(mapId)) {
        case MAP_ID.ZHUANZHUAN:
            gameName = '转转麻将';
            break;
        case MAP_ID.CHANGSHA:
            gameName = '长沙麻将';
            break;
        case MAP_ID.HONGZHONG:
            gameName = '红中麻将';
            break;
        case MAP_ID.SICHUAN_XUEZHAN:
            gameName = '血战到底';
            break;
        case MAP_ID.SICHUAN_XUELIU:
            gameName = '血流成河';
            break;
        case MAP_ID.PDK:
            gameName = '跑得快';
            break;
        case MAP_ID.DDZ_JD:
            gameName = '斗地主';
            break;
        case MAP_ID.XIANGYANG_PDK:
            gameName = '跑得快';
            break;
        case MAP_ID.DDZ_LZ:
            gameName = '癞子斗地主';
            break;
        case MAP_ID.ZJH:
            gameName = '拼三张';
            break;
        case MAP_ID.CRAZYNN:
        case MAP_ID.DN_JIU_REN:
        case MAP_ID.DN_AL_TUI:
        case MAP_ID.DN_WUHUA_CRAZY:
        case MAP_ID.DN:
        case MAP_ID.NN:
            gameName = getZhuangMode(data) || '拼十';
            break;
    }
    return gameName;
};

var alertError = function (src, content, json) {
    if (!cc.sys.isNative) {
        console.log(content);
        return;
    }

    if (!content)
        return;
    content = timestamp2time(getCurTimestamp()) + ', 抱歉, 程序出了点小问题, 请截屏反馈给客服, 谢谢! 错误日志:\n\n' +
        (gameData.roomId ? '房间号: ' + gameData.roomId + ', 局数: ' + gameData.curRound + '\n\n' : '') +
        (json ? JSON.stringify(json) + '\n\n' : '') +
        ('src: ' + src + '\n\n') +
        (content.stack || '') + '\n\n' +
        (content.message || '') + '\n\n' +
        (typeof content === 'string' ? content : '') + '\n\n' + window.curVersion;
    content = content.replace(/\/.*?app\//g, '');
    console.log(content);
    // alert1(content);
    NetUtils.uploadErrorFileToOSS(content);
};

var getShareUrl = function (roomid) {
    var ownerUid = gameData.ownerUid || mRoom.ownner || 0;
    roomid = roomid || gameData.roomId;
    roomid = _.trim(roomid || '');
    var url = '';
    if (roomid && (roomid.length < 6 || roomid.startsWith('0'))) {
        //俱乐部
        url = gameData.shareUrl_mlink + '?roomid=' + roomid;
        return url;
    }
    if (gameData.opt_conf.link == 2) {
        url = gameData.shareUrl + '?roomid=' + roomid + '&area=niuniu&sign=' + (ownerUid ^ roomid) + '&details=true&from=singlemessage';
    } else {
        url = gameData.shareUrl + '?roomid=' + roomid;
    }
    return url;
};

//判断两个数组是否相同
var Equals = function (object1, object2) {
    for (propName in object1) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            //Different types => not equal
            return false;
        }
    }
    for (propName in object2) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
        if (!object1.hasOwnProperty(propName))
            continue;
        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
            if (!Equals(object1[propName], object2[propName]))
                return false;
        } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
            if (!Equals(object1[propName], object2[propName]))
                return false;
        } else if (object1[propName] != object2[propName]) {
            return false;
        }
    }
    return true;
};
/**
 * 删除数组中的项
 * @param list
 * @param obj
 */
var removeObjArray = function (list, obj) {
    if (list == null) return;
    var pos = -1;
    for (var i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            pos = i;
            break;
        }
    }
    if (pos >= 0) {
        list.splice(pos, 1);
    }
};
var isNullString = function (str) {
    return !_.isString(str) || str == '' || str == 'null';
};

var tvibrate = function (s) {
    if (cc.sys.os == cc.sys.OS_IOS)
        cc.Device.vibrate(s);
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        cc.Device.vibrate(s);
    }
};

var MessageType = (function () {
    var t = [];
    t['Refused'] = 'Refused';
    t['Invite'] = 'Invite';
    return t;
})();
var NoticeType = (function () {
    var t = [];
    t['wanfaDetails'] = 'wanfaDetails';
    t['clubInvite'] = 'clubInvite';
    t['quickJoin'] = 'quickJoin';
    t['createClub'] = 'createClub';
    t['freeSet'] = 'freeSet';
    return t;
})();

function tableViewXSetPosition(tableView, rowWidth, itemCount, toIndex, addOffset) {
    if (addOffset == null) addOffset = 0;
    if (toIndex > 0) toIndex = 0;

    var content = tableView.getContainer();
    var viewSize = tableView.getViewSize();

    var posx = toIndex * rowWidth;
    // var offset = viewSize.width - (addOffset);
    // var posx = rowWidth * (itemCount - toIndex) + offset;
    //
    // var baseX = 0;
    // var size = content.getContentSize();
    // if (size.width < viewSize.width) {
    //     baseX = viewSize.width - size.width;
    // }
    // if (posx > baseX) posx = baseX;
    // var topX = viewSize.width - size.width;
    // if (posx < topX) posx = topX;
    content.setPositionX(posx);
    tableView.scrollViewDidScroll(tableView);
}

// /**
//  * 添加屏蔽层
//  * @public
//  * */
// var addModalLayer = function (target) {
//     var modalLayer = new ccui.Layout();
//     modalLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
//     modalLayer.setBackGroundColor(cc.color('#1A1A1A'));
//     modalLayer.setSwallowTouches(true);
//     modalLayer.setTouchEnabled(true);
//     modalLayer.setContentSize(cc.winSize);
//     modalLayer.setAnchorPoint(cc.p(0.5, 0.5));
//     modalLayer.x = target.width / 2;
//     modalLayer.y = target.height / 2;
//     modalLayer.ignoreAnchorPointForPosition(false);
//     modalLayer.setBackGroundColorOpacity(Math.floor(255 * 0.6));
//     target.addChild(modalLayer, -1);
// };
//
// // 带适配的
// var loadNodeCCS = function (res, target, rootName, hideMask) {
//     var mainscene = ccs.load(res, 'res/');
//     mainscene.node.setAnchorPoint(cc.p(0.5, 0.5));
//     mainscene.node.x = cc.winSize.width / 2;
//     mainscene.node.y = cc.winSize.height / 2;
//
//     if (!hideMask) {
//         var size = mainscene.node.getContentSize();
//         var modalLayer = new ccui.Layout();
//         modalLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
//         modalLayer.setBackGroundColor(cc.color('#1A1A1A'));
//         modalLayer.setSwallowTouches(true);
//         modalLayer.setTouchEnabled(true);
//         modalLayer.setContentSize(cc.winSize);
//         modalLayer.setAnchorPoint(cc.p(0.5, 0.5));
//         modalLayer.x = size.width / 2;
//         modalLayer.y = size.height / 2;
//         modalLayer.ignoreAnchorPointForPosition(false);
//         modalLayer.setBackGroundColorOpacity(Math.floor(255 * 0.6));
//         mainscene.node.addChild(modalLayer, -1);
//     }
//     target.addChild(mainscene.node);
//
//     if (rootName) {
//         var interval = null;
//         var checkFunc = function () {
//             if (!checkAllNodesValid(target.getChildByName(rootName)))
//                 return;
//             clearInterval(interval);
//             interval = null;
//
//             var ret = true;
//             if (target.getBeforeOnCCSLoadFinish && target.getBeforeOnCCSLoadFinish())
//                 ret = target.getBeforeOnCCSLoadFinish()();
//             if (ret && target.onCCSLoadFinish) {
//                 target.onCCSLoadFinish.call(target);
//             }
//         };
//         interval = setInterval(checkFunc, 1);
//         checkFunc();
//     }
//
//     return mainscene;
// };

var getNumString = function(num){
    if(num){
        if(num < 9999){
            return num;
        }else if(num > 99999999){
            return (Math.floor((num/10000000))/10) + '亿';
        }else{
            return (Math.floor((num/1000))/10) + '万';
        }
    }
};
/*
 * 返回外链游戏中参数
 */
var getOpenGameCfgBygame = function (opengame) {
    var openGameCfg = {
        //江上美人
        'jsmr': {
            'indexUrl': 'http://pay.yayayouxi.com/gt_cps/?r_plat=h5yaya-17018010&r_bid=17018000&r_host=gd-cpsguonei-sdk.raygame3.com&player=',
            'areacode': 'shannxi_mj',
            'scheme': 'yayayouxi302',
            'h5id': '15524',
            'signKey': 'bdfbc61e923418aaf041b3e14ac8a7f7',
            'isLandscape': false,
        },

        //龙城霸业
        'lcby': {
            'indexUrl': 'http://pay.yayayouxi.com/xdpt/feiyu/index/2093/200048?&player=',
            'areacode': 'shannxi_mj',
            'scheme': 'yayayouxi302',
            'h5id': '16501',
            'signKey': 'ad2143145034b520c552b4be3a9d9de3',
            'isLandscape': false,
        }
    }

    if(openGameCfg[opengame])
        return openGameCfg[opengame];
    else
        return null;
};


/*
 * areacode 区id 找陈世鑫对
 * scheme 跳回app的head,默认每个包的魔窗
 * h5id 小雷哥那边用该字段来区分游戏 找陈世鑫
 */
var openGameWebView = function (opengame) {
    var _gameData = getOpenGameCfgBygame(opengame);
    if(!_gameData){
        console.log("外链游戏参数错误，请核对外链游戏名称是否正确!!!");
        return;
    }

    var indexUrl = _gameData.indexUrl;
    var player = {
        "playerId": gameData.uid,
        "areacode": _gameData.areacode,
    };
    var base64_player = OldBase64.encode(JSON.stringify(player));
    var timestamp = getCurTimestamp();
    var nonce = Math.ceil(100000 + Math.random() * 899999);
    var signKey = _gameData.signKey;
    var md5 = Crypto.MD5(base64_player + timestamp + nonce + signKey);
    var end_url = indexUrl + base64_player + "&h5id=" + _gameData.h5id + "&timestamp=" + timestamp + "&nonce=" + nonce + "&sign=" + md5;

    console.log("end_url===：" + end_url);
    stopMusic();
    if (cc.sys.os == cc.sys.OS_IOS) {
        // _G.setPlatformAdap(false);
        // _G.setCommonDisplay(false);
        var webView = new ccui.WebView(end_url);
        cc.director.getRunningScene().addChild(webView, 1, "webview");
        webView.setContentSize(cc.winSize.width, cc.winSize.height);
        // webView.setRotation(-90);
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        if(!_gameData.isLandscape){ //竖屏安卓游戏
            _G.setPlatformAdap(_gameData.isLandscape);
            _G.setCommonDisplay(_gameData.isLandscape);
        }

        var webView = new ccui.WebView(end_url);
        cc.director.getRunningScene().addChild(webView, 1, "webview");
        webView.setContentSize(cc.winSize.width, cc.winSize.height);
    }
    webView.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    webView.setJavascriptInterfaceScheme(_gameData.scheme);
    webView.setOnJSCallback(function (sender, url) {
        console.log("url ===:" + url);
        resumeMusic();
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            _G.setPlatformAdap(true);
            _G.setCommonDisplay(true);
        }
        // else if (cc.sys.os == cc.sys.OS_IOS) {
        // _G.setPlatformAdap(true);
        // _G.setCommonDisplay(true);
        // }
        if(webView)
            webView.removeFromParent(true);
    });
};

/**
 * 截图
 * @param {cc.Node} node
 * @param {Function} callback
 * @public
 */
var captureNode = function (node, callback) {
    if (!cc.sys.isNative) {
        return;
    }
    var texture = new cc.RenderTexture(cc.winSize.width, cc.winSize.height, null, 0x88F0);
    texture.retain();
    texture.setAnchorPoint(0, 0);
    texture.begin();
    node.visit();
    texture.end();
    var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
    time = time.replace(/[\s:-]+/g, '_');
    var nameJPG = 'ss-' + time + '.jpg';

    // PermissionUtil.requestPermission(PermissionType.storage_read);
    // PermissionUtil.requestPermission(PermissionType.storage_write);
    texture.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false, function () {
        texture.release();
        callback(jsb.fileUtils.getWritablePath() + nameJPG, nameJPG);
    });
};