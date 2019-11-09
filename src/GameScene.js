/**
 * 打牌界面
 */
var GameScene = cc.Scene.extend({
    replayData: null,
    reconnectData: null,
    niuniuLayer: null,
    replayLayer: null,
    wanfa: MAP_ID_2_WANFA.DN,
    data: null,
    sub: SUB_MODULE.NN,
    /**
     * 构造方法
     * @param data
     */
    ctor: function (data) {
        this._super();
        this.data = data;
        // this.handleKWXMapId(data);
        this.initWanFa();
        this.initLayer();
    },

    initLayer: function () {
        var layer = null;
        var playLayer = null;
        var data = this.data;

        var isReplay = !!(data && data['3002']) || _.isArray(data);

        var isReconnect = !!(data && !isReplay);
        if (isReplay)
            this.replayData = data || null;
        if (isReconnect)
            this.reconnectData = data || null;

        switch (this.wanfa) {
            case MAP_WANFA.MaJiang:
                layer = new MaLayer((isReplay ? null : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.MaJiang_sc:
                //四川
                // if (gameData.mapId === MAP_ID.SICHUAN_MZ || gameData.mapId == MAP_ID.SICHUAN_TRLF) {
                layer = new MaLayer_sc_mz((isReplay ? null : this.reconnectData), isReplay);
                // } else {
                //     layer = new MaLayer_sc((isReplay ? null : this.reconnectData), isReplay);
                // }
                break;
            case MAP_WANFA.MaJiang_match:
                layer = new MaLayer_match((isReplay ? null : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.ZJH:
                layer = new MaLayer_zjh((isReplay ? null : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.PDK:
                layer = new PokerLayer((isReplay ? null : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.PDK_MATCH:
                layer = new PokerLayer_match((isReplay ? null : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.SC_PDK:
                layer = new SCPokerLayer((isReplay ? data['3002'].data : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.PDK_JBC:
                layer = new PokerJBCLayer((isReplay ? null : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.KAOKAO:
                layer = new KaoKaoLayer(data, isReplay);
                break;
            case MAP_WANFA.YouXian:
                // todo
                break;
            case MAP_WANFA.DDZ:
                // todo
                break;
            case MAP_WANFA.EPZ:
                layer = new ErPiZiRoom((isReplay ? data : this.reconnectData), isReplay);
                break;
            case MAP_WANFA.PK_13S:
                layer = new PokerLayer_sss(data, isReplay);
                break;
            case MAP_WANFA.DN:
            default:
                if (gameData.mapId == MAP_ID.CRAZYNN) {
                    layer = new NiuniuZJNLayer(data);
                } else {
                    layer = new NiuniuLayer(data);
                }
                break;
        }
        if (!layer) {
            return;
        }
        // layer.setPositionX(cc.winSize.width/2 - 1280/2);
        this.addChild(layer);

        window.maLayer = layer;
        window.paizhuo = this.wanfa;

        if (isReplay) {
            switch (this.wanfa) {
                case MAP_WANFA.MaJiang:
                    playLayer = new Ma_PlayBackLayer(data);
                    break;
                case MAP_WANFA.MaJiang_sc:
                    playLayer = new Ma_PlayBackLayer(data);
                    break;
                case MAP_WANFA.ZJH:
                    playLayer = new PokerPlayBackLayer(data);
                    break;
                case MAP_WANFA.EPZ:
                    playLayer = new PokerPlayBackLayer(data);
                    break;
                case MAP_WANFA.PDK:
                    playLayer = new PokerPlayBackLayer(data);
                    break;
                case MAP_WANFA.SC_PDK:
                    playLayer = new ScpdkPlayBackLayer(data);
                    break;
                case MAP_WANFA.YouXian:
                    // todo
                    break;
                case MAP_WANFA.DDZ:
                    // todo
                    break;
                case MAP_WANFA.DN:
                default:
            }
            if (playLayer) {
                layer.addChild(playLayer, 999);
            }
        }

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;
    },

    /**
     * 初始化玩法
     */
    initWanFa: function () {
        var key = findKey(MAP_ID, gameData.mapId);
        if (key) {
            this.wanfa = MAP_ID_2_WANFA[key];
        }
    },
    /**
     * 处理特殊mapid（卡五星）
     */
    // handleKWXMapId: function (data) {
    //     if (gameData.mapId != 2) {
    //         return;
    //     }
    //     if(!data){
    //         return;
    //     }
    //     if(!data.desp){
    //         return;
    //     }
    //     var despArr = data.desp.split(',');
    //     var mapName = despArr[0];
    //     console.log("玩法：" + mapName);
    //     switch (mapName){
    //         case '襄阳卡五星':
    //             gameData.mapId = 50;
    //             break;
    //     }
    // }
});