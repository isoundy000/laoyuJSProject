/**
 * Created by xuefr on 2018/08/10.
 */
var sgame = sgame || {};

SGameHelper = cc.Class.extend({
    m_gamePath: null,
    m_manifestPath: null,
    m_storagePath: null,
    m_entry: null,
    m_beginCallback: null,
    m_percentCallback: null,
    m_completeCallback: null,
    m_ext: null,

    ctor: function (gamePath, manifestPath, entry) {
        this.m_gamePath = gamePath;
        this.m_manifestPath = manifestPath;
        this.m_entry = entry;
    },

    runGame: function () {
        var debugLocal = false;
        if (debugLocal || !cc.sys.isNative) {
            this.onComplete(0);
        } else {
            this.checkUpdate();
        }
    },

    checkUpdate: function () {
        var sgamePath = jsb.fileUtils.getWritablePath() + "sgame/";
        this.m_storagePath = sgamePath + this.m_gamePath + '/';
        cc.log("checkUpdate start storagePath = " + this.m_storagePath);
        this.m_hotUpdater = new HotUpdateHelper(this.m_manifestPath,
            this.m_storagePath,
            this.onBeginUpdate.bind(this),
            this.onPersent.bind(this),
            this.onComplete.bind(this));
        this.m_hotUpdater.prepareUpdate();
    },

    onBeginUpdate: function (totalSize) {
        cc.log("onBeginUpdate");
        if (this.m_beginCallback) {
            this.m_beginCallback();
        }
    },

    onPersent: function (percent) {
        cc.log("onPersent:" + percent);
        if (this.m_percentCallback) {
            this.m_percentCallback(percent);
        }
    },

    onComplete: function (res) {
        cc.log("onComplete:" + res);

        if (this.m_completeCallback) {
            this.m_completeCallback(res);
        }
    },

    loadGame: function (cb) {
        if (sgame && sgame[this.m_entry]) {
            SgameBridge.gotoDDZGame();
            if (cb) {
                cb(0);
            }
            sgame[this.m_entry].run(this.m_ext);
        } else {
            var mainPath = "src/sgame/" + this.m_gamePath + "/main.js";
            cc.log("jsb mainPath path = " + mainPath);
            if (cc.sys.isNative) {
                cc.log("jsb file path = " + jsb.fileUtils.fullPathForFilename("main.js"));
            }
            cc.loader.loadJs(mainPath, function (err) {
                if (err) {
                    this.cleanLocal();
                    if (cb) {
                        cb(-1);
                    }
                } else {
                    SgameBridge.gotoDDZGame();
                    if (cb) {
                        cb(0);
                    }
                    sgame[this.m_entry].run(this.m_ext);
                }
            }.bind(this));
        }
    },
    cleanLocal: function () {
        var manifest = this.m_storagePath + "project.manifest";
        var version = this.m_storagePath + "version.manifest";
        if (jsb.fileUtils.isFileExist(manifest)) {
            jsb.fileUtils.removeFile(manifest);
        }
        if (jsb.fileUtils.isFileExist(version)) {
            jsb.fileUtils.removeFile(version);
        }
    }
});


HotUpdateHelper = cc.Class.extend({
    _manifestPath: null,
    _beginCallback: null,
    _persentCallback: null,
    _completeCallback: null,
    _failCount: 0,
    _maxFailCount: 3,
    _checkListener: null,
    _updateListener: null,
    _am: null,
    _storagePath: null,
    ctor: function (manifestPath, storagePath, beginCallback, persentCallback, completeCallback) {
        this._manifestPath = manifestPath;
        this._storagePath = storagePath;
        this._beginCallback = beginCallback;
        this._persentCallback = persentCallback;
        this._completeCallback = completeCallback;
    },

    onExit: function () {
        this._am.release();

        if (this._checkListener) {
            cc.eventManager.removeListener(this._checkListener);
            this._checkListener = null;
        }

        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
    },

    onBegin: function (totalSize) {
        if (this._beginCallback) {
            this._beginCallback(totalSize);
        }
    },

    onComplete: function (res) {
        if (this._completeCallback) {
            this._completeCallback(res);
        }
    },

    onPersent: function (persent) {
        if (this._persentCallback) {
            this._persentCallback(persent);
        }
    },

    prepareUpdate: function () {
        if (!cc.sys.isNative) {
            this.onComplete(0);
            return;
        }

        var localPath = this._manifestPath;

        this._am = new jsb.AssetsManager(localPath, this._storagePath, this.versionCompareHandle);
        this._am.retain();

        cc.log('Hot update is ready, please check or directly update.');

        this.checkUpdate();
    },

    // Setup your own version compare handler, versionA and B is versions in string
    // if the return value greater than 0, versionA is greater than B,
    // if the return value equals 0, versionA equals to B,
    // if the return value smaller than 0, versionA is smaller than B.
    versionCompareHandle: function (versionA, versionB) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    },

    checkUpdate: function () {
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            cc.log('Failed to load local manifest ...');
            this.onComplete(-1);
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        cc.log('msg: ' + event.getMessage());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                this.onComplete(-1);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                this.onComplete(-1);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                this.onComplete(0);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('New version found, please try to update.');
                var msg = event.getMessage();
                var totalSize = "1000";
                try {
                    var jsonData = JSON.parse(msg);
                    totalSize = jsonData.totalSize;
                } catch (e) {

                }

                this.onBegin(parseInt(totalSize));

                this.hotUpdate();
                break;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
    },

    hotUpdate: function () {
        this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
        cc.eventManager.addListener(this._updateListener, 1);

        this._am.update();
    },

    updateCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        cc.log('msg: ' + event.getMessage());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
                this.onComplete(-1);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.log('byteProgress.progress = ' + event.getPercent());
                if (event.getAssetId() != "@version" && event.getAssetId() != "@manifest" && event.getAssetId() != "") {
                    this.onPersent(event.getPercent());
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                this.onComplete(-1);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('Already up to date with the latest remote version.');
                this.onComplete(0);
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());
                var storagePath = this._am.getStoragePath();
                jsb.fileUtils.addSearchPath(storagePath, true);
                this.onComplete(0);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());
                this.retryUpdate();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log(event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                break;
            default:
                break;
        }
    },

    retryUpdate: function () {
        this._failCount++;
        if (this._failCount < this._maxFailCount) {
            this._am.downloadFailedAssets();
        } else {
            this.onComplete(-1);
        }
    }
});

SGameDownloader = cc.Node.extend
({
    m_sgameHelper: null,
    ctor: function () {
        cc.log("SGameHelper ctor");
        this._super();
        this.jbcLoadPercent = 0;
    },

    onEnter: function () {
        cc.log("SGameHelper onEnter");
        this._super();
    },

    onExit: function () {
        this._super();
        cc.log("SGameHelper onExit");
        if (this.m_sgameHelper) {
            this.m_sgameHelper.m_beginCallback = null;
            this.m_sgameHelper.m_percentCallback = null;
            this.m_sgameHelper.m_completeCallback = null;
        }
    },

    loadGame: function (gmPath, manifest, gmNameSpace, type) {
        SgameBridge.showLoading('正在加载游戏中……');
        this.m_sgameHelper = new SGameHelper(gmPath, manifest, gmNameSpace);
        cc.log("show ddz layer release4444");
        if (!!type) {
            this.m_sgameHelper.m_ext = type;
        }
        cc.log("show ddz layer release5555");
        this.m_sgameHelper.m_beginCallback = this.onDownloadResBegin.bind(this);
        this.m_sgameHelper.m_percentCallback = this.onDownloadResPercent.bind(this);
        this.m_sgameHelper.m_completeCallback = this.onDownloadResComplete.bind(this);
        this.m_sgameHelper.runGame();
        cc.log("show ddz layer release6666");
    },

    onDownloadResBegin: function () {

    },

    onDownloadResPercent: function (percent) {
        SgameBridge.hideLoading();
        percent = Math.floor(percent);
        percent = percent > this.jbcLoadPercent ? percent : this.jbcLoadPercent;
        percent = percent > 100 ? 100 : percent;
        SgameBridge.showLoading('下载中' + percent + '%');
        this.jbcLoadPercent = percent;
    },

    onDownloadResComplete: function (res) {
        cc.log("SgameHelper onDownloadResComplete removeFromParent, res = " + res);
        SgameBridge.hideLoading();
        if (res === 0) {
            this.m_sgameHelper.loadGame(function () {
                this.removeFromParent();
            }.bind(this));
        } else if (res == -1) {
            alert1('热更新失败!');
        }
    },
});


SgameBridge = cc.Class.extend({
    ctor: function () {
        this.nickname = "";     //昵称
        this.headimgurl = "";   //头像url
        this.sex = 0;           //性别
        this.coinnum = 0;       //金币
        this.diamondnum = 0;    //钻石
        this.cardnum = 0;       //房卡
        this.address = "";      //地理位置
        this.packagename = "";  //包名（eg: com.gggame.yayadoupai）
        this.jbcData = null;    //金币场相关数据
        this.phone = "";        //绑定手机号
        this.appid = "";        //appid（eg: 307）
        this.appname = "";      //app名称(eg:全民斗牌)
        this.wxsecret = "";     //wechat Secret
        this.wxappid = "";      //wechat Appid
        this.shopurl = "";      //商城url
        this.ip = "";           //用户ip
        this.parentid = "";     //代理id
        this.clientid = "";     //（eg: wx openid）
        this.logintype = "";    //登录类型（eg: "yk"）
        this.uid = "";
        this.area = "";
    },

});

//关闭主包背景音乐
SgameBridge.stopParentSound = function () {
    stopMusic();
};

//开始播放主包背景音效
SgameBridge.startParentSound = function () {
    playMusic();
};


//停止音乐
SgameBridge.stopBgMusic = function () {
    stopMusic();
};

//播放音效
SgameBridge.playEffect = function (fileName) {
    if (fileName) {
        var effectKey = fileName.substr(fileName.lastIndexOf("/") + 1);
        res[effectKey] = fileName;
        playEffect(effectKey);
    } else {
        cc.log("has no ddzbgMusic = " + fileName);
    }
};

//停止音效（根据文件名）
SgameBridge.stopEffect = function () {

};

//展示下载进度loading
SgameBridge.showLoading = function (content) {
    showLoading(content);
};

//去掉下载进度loading
SgameBridge.hideLoading = function () {
    hideLoading();
};

//前往斗地主金币场（切换场景前的处理）
SgameBridge.gotoDDZGame = function () {
    network.addListener(3013, function (data) {
        SgameBridge.updateCoins(data);
        cc.eventManager.dispatchCustomEvent("update3013WithCocosNtf", data);
    });
    SgameBridge.stopParentSound();
};

//返回主包大厅的实现（切换scene）
SgameBridge.backParentGame = function () {
    SgameBridge.getInstance().jbcData.last = undefined;
    cc.director.runScene(new MainScene());
    SgameBridge.startParentSound();
};

//下载网络图片
SgameBridge.loadImage = function (url, parent, clip) {
    // loadImage(url, parent, clip);
    loadImageToSprite(url, parent, clip);
};

//监听网络消息
SgameBridge.addNetListener = function (msgid, func,target) {
    network.addListener(msgid, func,target);
};

//刷新货币数据3013
SgameBridge.updateCoins = function (data) {
    gameData.numOfCards = data['numof_cards'];
    if (gameData.numOfCards[1] >= 0) {
        gameData.cardnum = gameData.numOfCards[1];
    }

    if (gameData.numOfCards[0] >= 0) {
        gameData.coinnum = gameData.numOfCards[0];
    }

    if (gameData.numOfCards[2] >= 0) {
        gameData.diamondnum = gameData.numOfCards[2];
    }
};

SgameBridge.createQRImage = function(node){
    var url;
    url = "http://pay.bangshuiwang.com/fydp/";
    QrcUtil.makeQrcode(node, url, null, function () {

    });
};

SgameBridge.WchatShareType = {
    Session: 1,
    Timeline: 2
};


//1是微信好友 2 是朋友圈
SgameBridge.shareWechat = function (node, type) {
    console.log("SgameBridge.shareWechat ==== 0");
    if (SgameBridge.WchatShareType.Timeline == type){
        WXUtils.captureAndShareToWX(node, 0x88F0, 2);
    } else{
        WXUtils.captureAndShareToWX(node, 0x88F0);
    }
};


//针对有改写cc.loader.load方法的主包，需要特殊实现
SgameBridge.load = function (resources, option, loadCallback) {
    cc.log('针对有改写cc.loader.load方法的主包，需要特殊实现');
    cc.loader.load(resources, option, loadCallback);
};

//启动H5商城（传参可能根据不同的包，参数命名不同）
SgameBridge.showH5Shop = function (ciType) {
    //安卓 2.1.0版本需要直接跳转浏览器
    //ios 和安卓2.1.0以上版本都显示coinshoplayer

    //【非常重要】注意 uid 和 area 按照自己的底包的参数名称自己实现***************
    var uid = SgameBridge.getInstance().uid;
    if (!uid){
        console.log("[Shop Layer Error] uid is null");
    }
    var area = SgameBridge.getInstance().area;
    if (!area){
        console.log("[Shop Layer Error] uid is null");
    }
    var signKey = Crypto.MD5("feiyu-pay" + uid + area);
    var indexUrl = PAY_QMDPURL + "/payServer/wxpay/app_pay/dist/index.html?";
    indexUrl += "area=" + area + "&buyerId=" + uid + "&source=5&ciType=" + ciType + "&signKey=" + signKey + "&#http://";
    cc.log("[Shop Layer] shop url = " + indexUrl);

    if (cc.sys.os == cc.sys.OS_ANDROID && getNativeVersion() == '2.1.0') {
        cc.sys.openURL(indexUrl);
    }else{
        var parent = cc.director.getRunningScene();
        var coinShop = new CoinShopLayer(parent, ciType);
        parent.addChild(coinShop);
    }
};

SgameBridge.removeNetWorkListeners = function (target,id) {
    network.removeListener(id);
};

SgameBridge.sharedManager = null;

SgameBridge.getInstance = function () {
    if (SgameBridge.sharedManager === null) {
        SgameBridge.sharedManager = new SgameBridge();
    }
    return SgameBridge.sharedManager;
};
