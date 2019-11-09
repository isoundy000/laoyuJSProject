var App = ({
    init: function () {
        // addConfigRes();
        // addViewRes();
    },

    init1: function () {
        // addViewRes();
    },

    run: function () {
        this._loadGame();
    },

    /**
     * 加载游戏
     * @private
     */
    _loadGame: function () {
        this._loadFramework();
    },
    /**
     * 加载框架代码
     * @private
     */
    _loadFramework: function () {
        cc.loader.loadJs(framework_src, this._loadMainModules.bind(this));
    },
    /**
     * 加载主模块代码
     * @private
     */
    _loadMainModules: function () {
        cc.loader.loadJs(main_src, this._loadMainCommonRes.bind(this));
    },
    /**
     * 加载主模块通用资源
     * @private
     */
    _loadMainCommonRes: function () {
        if(cc.sys.isNative){
            this._loadMainCommonSrc();
        }else {
            cc.loader.load(_.values(common_res), this._loadMainCommonSrc.bind(this));
        }
    },
    /**
     * 加载主模块通代码
     * @private
     */
    _loadMainCommonSrc: function () {
        cc.loader.loadJs(common_src, this._loadGRes.bind(this));
    },
    /**
     * 加载全局res
     * @private
     */
    _loadGRes: function () {
        // todo
        addViewRes();
        if(cc.sys.isNative){
            this._loadProto();
        }else {
            cc.loader.load(g_resources, this._loadProto.bind(this));
        }
    },
    /**
     * 加载protobuf
     * @private
     */
    _loadProto: function () {
        // todo 清理
        var size = cc.director.getVisibleSize();
        SW = size.width;
        SH = size.height;
        FIT_SX = size.width / 1136;
        FIT_SY = size.height / 640;
        mProto.initProtoTypes();
        cc.loader.loadTxt("res/paohuzi.proto", this._loadProtoOver.bind(this));
    },
    /**
     * 加载protobuf结束
     * @private
     */
    _loadProtoOver: function (err, txt) {
        var ProtoBuf = dcodeIO.ProtoBuf;
        mProto.builder = ProtoBuf.loadProto(txt);
        DC.init();
        HUD.init();
        mProto.init();
        this._enterGame();
    },
    /**
     * 进入游戏
     * @private
     */
    _enterGame: function () {
        HUD.showScene(HUD_LIST.Login);
    },
    run1: function () {
        window.sensorLandscape = true;
        var size = cc.director.getVisibleSize();

        SW = size.width;
        SH = size.height;
        FIT_SX = size.width / 1136;
        FIT_SY = size.height / 640;

        BOTTOM_H = 92;
        TOP_H = 48;
        COTENT_H = SH - BOTTOM_H - TOP_H;
        OFFSET_H = SH - 640;

        mProto.protoName = {};
        mProto.initProtoTypes();
        cc.loader.loadTxt("res/paohuzi.proto", function (err, txt) {
            var ProtoBuf = dcodeIO.ProtoBuf;
            mProto.builder['old'] = ProtoBuf.loadProto(txt);
            mProto.protoName['old'] = 'old';
            DC.init();
            HUD.init();
            mProto.init('old');
        });

        cc.loader.loadTxt("res/sss.proto", function (err, txt) {
            var ProtoBuf = dcodeIO.ProtoBuf;
            mProto.builder['sss'] = ProtoBuf.loadProto(txt);
            mProto.protoName['sss'] = 'sss';
            mProto.init('sss');
        });
    }
});

var yy = {};



