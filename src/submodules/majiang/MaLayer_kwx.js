'use strict';
(function (exports) {

    // var signal1 = cc.textureCache.addImage('res/table/signal1.png');
    // var signal2 = cc.textureCache.addImage('res/table/signal2.png');
    // var signal3 = cc.textureCache.addImage('res/table/signal3.png');
    // var lb_gang = cc.textureCache.addImage('res/table/lb_gang.png');
    // var lb_lai = cc.textureCache.addImage('res/table/lb_lai.png');
    // var lb_pi = cc.textureCache.addImage('res/table/lb_pi.png');
    // var lb_gen = cc.textureCache.addImage('res/table/lb_gen.png');


    var lb_gang = res.lb_gang;
    var lb_lai = res.lb_lai;
    var lb_pi = res.lb_pi;
    var lb_xia = res.lb_xia;
    var lb_wang = res.lb_wang;

    var $ = null;
    var _isHuanzhuo = false; //是否是换桌行为
    var directonName = {
        '0': '东',
        '1': '南',
        '2': '西',
        '3': '北'
    };

    var BatteryTextures = {
        "battery1": res.battery_1,
        "battery2": res.battery_2,
        "battery3": res.battery_3,
        "battery4": res.battery_4,
        "battery5": res.battery_5
    };


    var PAINAMES = ["", "一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万", "一条", "二条", "三条", "四条", "五条", "六条", "七条", "八条", "九条", "一筒", "二筒", "三筒", "四筒", "五筒", "六筒", "七筒", "八筒", "九筒"];

    // CONST
    var FAPAI_ANIM_DELAY = 0.04;
    var FAPAI_ANIM_DURATION = 0.2;
    var MOPAI_ANIM_DURATION = 0.3;
    var UPDOWNPAI_ANIM_DURATION = 0.088;
    var UPPAI_Y = 30;
    var CHUPAI_MID_NODE_SCALE_MAP = {0: 1.2, 2: 1.2, 1: 1.2, 3: 1.2};

    var MAP2PNUM = {1: 4, 2: 3};

    var OP_CHI = 1;
    var OP_PENG = 2;
    var OP_GANG = 3;
    var OP_HU = 4;
    var OP_PASS = 5;
    var OP_TING = 6;
    var OP_LIANG = 7;
    var OP_KAIGANG = 50;
    var OP_XIAOHU = 51;

    var ROOM_STATE_CREATED = 1;
    var ROOM_STATE_ONGOING = 2;
    var ROOM_STATE_ENDED = 3;

    var posConf = {
        headPosBak: {}
        , paiA0PosBak: {}
        , paiA0ScaleBak: {}
        , paiADistance: []
        , paiALiangDistance: [0.5, 3.5, 0, -3.5]
        , paiMopaiDistance: {0: 16, 1: 20, 2: 34, 3: 20}
        , paiGDistance: []
        , paiUsedDistance: []
        , paiUsedZOrder: {
            0: {0: -1, 10: 0, 20: 1, 30: 2}
            , 1: {0: -1, 10: -1, 20: -1, 30: -1}
            , 2: {0: 0, 10: -1, 20: -2, 30: -3}
            , 3: {0: 0, 10: 1, 20: 2, 30: 3}
        }
        , cpghgPositionX: {
            2: [660, 920], 3: [425, 700, 960], 4: [320, 580, 840, 1070],
            5: [210, 460, 700, 940, 1130], 6: [210, 460, 700, 940, {x: 700, y: 360}, 1180]
        }
        , upPaiPositionY: null
        , downPaiPositionY: null
        , groupWidth: {}
        , groupHeight: {}
        // , groupDistance: {0: 4, 1: 4, 2: 16, 3: 4}
        , groupDistance: {0: 4, 1: -6, 2: 16, 3: -6}
        // , groupToFirstPaiDistance: {0: 10, 1: -14, 2: 26, 3: -14}
        , groupToFirstPaiDistance: {0: 5, 1: -24, 2: 26, 3: -24}

        , paiPos: {}

        , ltqpPos: {}
        , ltqpRect: {}
        , ltqpCapInsets: {
            0: cc.rect(44, 25, 1, 1)
            , 1: cc.rect(26, 31, 1, 1)
            , 2: cc.rect(44, 25, 1, 1)
            , 3: cc.rect(42, 26, 1, 1)
        }
        , ltqpEmojiPos: {
            0: cc.p(40, 28)
            , 1: cc.p(39, 38)
            , 2: cc.p(40, 40)
            , 3: cc.p(56, 38)
        }
        , ltqpVoicePos: {
            0: cc.p(40, 28)
            , 1: cc.p(37, 30)
            , 2: cc.p(42, 40)
            , 3: cc.p(58, 30)
        }
        , ltqpEmojiSize: {}
        , ltqpTextDelta: {
            0: cc.p(0, -4)
            , 1: cc.p(-7, 2)
            , 2: cc.p(-1, 9)
            , 3: cc.p(8, 3)
        }
        , gPaiPos: {
            0: {1: 0, 2: 1, 3: 2},
            1: {0: 2, 2: 0, 3: 1},
            2: {0: 1, 3: 0, 1: 2},
            3: {0: 0, 1: 1, 2: 2}
        }
        , huFromAngle: [
            180,
            270,
            0,
            90
        ]
        , fromPos: [
            {x: 40, y: 10},
            {x: 0, y: 30},
            {x: 30, y: 10},
            {x: 0, y: 30}
        ]
    };

    var data;
    var isReconnect;

    var roomState = null;
    var mapId = 2;
    var playerNum = 4;
    var rowBegin = 1;

    var enableChupaiCnt = 0;

    var isCCSLoadFinished = false;

    var uid2position = {};
    var uid2playerInfo = {};
    var position2uid = {};
    var position2sex = {};
    var position2playerArrIdx = {};

    var hasChupai = false;

    var turnRow = null;

    var leftPaiCnt = 0;

    var isReplay = null;

    var forRows = null;

    var lianging = false;

    var liangPai = 0;
    var liangPaiIdx = 0;
    var liangStep = 0;

    var hideGangStep = 0;
    var hideGangArr = [];
    var hidedGangArr = [];
    var hideGangChupaiArr = [];

    var hupaiMap = {};
    var huTipData = {};

    var clickTing = false;
    var hideTing = [];

    var afterLianging = false;

    var disabledChuPaiIdMap = {};

    var disableChupai = false;

    var selectingXiaohu = false;

    // for wuhan
    var laiziPaiId = 0;
    var laizipiPaiAId = 0;
    var laizipiPaiBId = 0;

    var hasInitPai = false;

    var effectEmojiQueue = {};
    var effectEmojiCfg = {
        1: {'name': 'zan', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'bomb', 'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3: {'name': 'egg', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4: {'name': 'shoe', 'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5: {'name': 'flower', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0}
    };

    var isAutoSendPai = false;

    var clearVars = function () {
        roomState = null;
        mapId = gameData.mapId;
        // playerNum = MAP2PNUM[mapId] || 4;
        playerNum = gameData.playerNum || MAP2PNUM[gameData.appId] || 4;
        rowBegin = 1;
        enableChupaiCnt = 0;
        isCCSLoadFinished = false;
        uid2position = {};
        uid2playerInfo = {};
        position2uid = {};
        position2sex = {};
        position2playerArrIdx = {};
        hasChupai = false;
        turnRow = null;
        isReplay = null;
        forRows = null;
        lianging = false;
        liangPai = 0;
        liangPaiIdx = 0;
        liangStep = 0;
        hideGangStep = 0;
        hideGangArr = [];
        hidedGangArr = [];
        hideGangChupaiArr = [];
        afterLianging = false;
        disabledChuPaiIdMap = {};
        disableChupai = false;
        selectingXiaohu = false;

        laiziPaiId = 0;
        laizipiPaiAId = 0;
        laizipiPaiBId = 0;

        hasInitPai = false;

        hupaiMap = {};
        huTipData = null;
    };
    var playAnimSceneCall = function (distNode, res, posx, posy, loop, func) {
        var cacheNode = distNode.getChildByName(res);
        if (!cacheNode) {
            var animScene = ccs.load(res);
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
                alert1('load ' + res + " failed");
            }
        }

        var userdata = cacheNode.getUserData();
        userdata.action.play('action', loop);
        if (func) {
            userdata.action.setLastFrameCallFunc(func);
        }
        return cacheNode;
    };
    var getAngleByPos= function (p1,p2) {
        var p = {}
        p.x = p2.x - p1.x
        p.y = p2.y - p1.y

        var r = Math.atan2(p.y,p.x)*180/Math.PI
        return r

    };
    var getPaiNameByRowAndId = function (row, id, isLittle, isStand) {
        var prefix;

        var ret = null;

        if (row == 0 && isLittle) prefix = "p2s";
        if (row == 0 && !isLittle) prefix = "p2l";
        if (row == 1 && isLittle) prefix = "p1s";
        if (row == 1 && !isLittle) prefix = "p2l";
        if (row == 2 && isLittle) prefix = "p2s";
        if (row == 2 && !isLittle) prefix = "p2l";
        if (row == 3 && isLittle) prefix = "p3s";
        if (row == 3 && !isLittle) prefix = "p2l";

        if (prefix) ret = prefix + id + '.png';

        if (row == 0 && id == 0 && isLittle) ret = 'p0s0' + '.png';
        if (row == 1 && id == 0 && isLittle) ret = 'p1s0' + '.png';
        //if (row == 2 && id == 0 && isLittle) ret = '' + '.png';
        if (row == 3 && id == 0 && isLittle) ret = 'p3s0' + '.png';
        //if (row == 0 && id == 0 && !isLittle) ret = 'bs' + '.png';
        //if (row == 1 && id == 0 && !isLittle) ret = 'bh' + '.png';
        if (row == 2 && id == 0 && isLittle) ret = 'p2s0' + '.png';
        if (row == 2 && id == 0 && !isLittle) ret = 'p2l0' + '.png';
        //if (row == 3 && id == 0 && !isLittle) ret = 'bh' + '.png';

        if (row == 0 && isStand && isLittle) ret = 'h0s' + '.png';
        if (row == 1 && isStand && isLittle) ret = 'h1s' + '.png';
        if (row == 3 && isStand && isLittle) ret = 'h3s' + '.png';
        if (row == 0 && isStand && !isLittle) ret = 'p2l0' + '.png';
        if (row == 1 && isStand && !isLittle) ret = 'by' + '.png';
        if (row == 3 && isStand && !isLittle) ret = 'bz' + '.png';

        return ret;
    };

    var MaLayer_kwx = cc.Layer.extend({
        chatLayer: null,
        chiLayer: null,
        settingLayer: null,
        throwDiceLayer: null,
        kaigangLayer: null,
        beforeOnCCSLoadFinish: null,
        afterGameStart: null,
        curPaiArr: null,//当前手牌数组 客户端存
        prePaiArr: null,//临时手牌 用于亮牌
        peopleSend: false,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);

        },
        getRootNode: function () {
            return this.getChildByName("Scene");
        },
        initExtraMapData: function (data) {
            var that = this;
            // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
            //     laiziPaiId = data['laizi'];
            //     laizipiPaiAId = data['laizipi_a'];
            //     laizipiPaiBId = data['laizipi_b'];
            //
            //     var laiziPanel = $('laizi_panel');
            //     if (laiziPanel)
            //         laiziPanel.removeFromParent(true);
            //
            //     var pai = new cc.Sprite('#p2l8.png');
            //     var paiName = 'p2s' + laiziPaiId + '.png';//getPaiNameByRowAndId(0, laiziPaiId, false, false);
            //     setSpriteFrameByName(pai, paiName, 'pai');
            //
            //     laiziPanel = new cc.Sprite('res/table/laizi_bg.png');
            //     laiziPanel.setName('laizi_panel');
            //     laiziPanel.addChild(pai);
            //     laiziPanel.setScale(0.8);
            //     pai.setPosition(43, 52);
            //     // pai.setScale(0.76);
            //
            //     // laiziPanel.setPosition(1212, 515);
            //     laiziPanel.setPosition(66, 581);
            //     that.addChild(laiziPanel);
            // }
            // if (mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) {
            //     laiziPaiId = data['laizi'];
            //     laizipiPaiAId = data['laizipi_a'];
            //
            //     var laiziPanel = $('laizi_panel');
            //     if (laiziPanel)
            //         laiziPanel.removeFromParent(true);
            //
            //     var pai = new cc.Sprite('#p2l8.png');
            //     var paiName = 'p2s' + laiziPaiId + '.png';//getPaiNameByRowAndId(2, laiziPaiId, false, false);
            //     setSpriteFrameByName(pai, paiName, 'pai');
            //
            //     var piPai = new cc.Sprite('#p2l8.png');
            //     var paiName = 'p2s' + laiziPaiId + '.png';//getPaiNameByRowAndId(2, laizipiPaiAId, false, false);
            //     setSpriteFrameByName(piPai, paiName, 'pai');
            //     if (mapId == MAP_ID.JINGZHOUHH) {
            //         laiziPanel = new cc.Sprite('res/table/laizipi_bg.png');
            //     } else if (mapId == MAP_ID.XIANTAO) {
            //         laiziPanel = new cc.Sprite('res/table/laizigen_bg.png');
            //     }
            //     laiziPanel.setName('laizi_panel');
            //     laiziPanel.addChild(pai);
            //     laiziPanel.addChild(piPai);
            //     laiziPanel.setScale(0.66);
            //     piPai.setPosition(45, 52);
            //     piPai.setScale(0.76);
            //     pai.setPosition(127, 52);
            //     pai.setScale(0.76);
            //
            //     laiziPanel.setPosition(72, 581);
            //     that.addChild(laiziPanel);
            // }
        },
        onCCSLoadFinish: function () {
            var that = this;

            addCachedCCSChildrenTo(res.MaScene1_KWX, this);
            batchSetChildrenZorder(this.getRootNode(), {
                info0: 3, info1: 1, info2: 11, info3: 3,
                info_n0: 2, info_n1: 2, info_n2: 20, info_n3: 4,
                row2: 10, row3: 2,
                cpghg: 11, piao_bar: 12, top_tip: 999, auto_bg: 20,
                btn_bg: 30, setting: 31, chat: 31, jiesan: 31, btn_control_btns: 32
            });

            if (mapId == MAP_ID.KWX) {
                addCachedCCSChildrenTo(res.MaScene1_1KWX, this);
                // this.getChildByName("Scene").getChildByName('piao_bar').setLocalZOrder(666);
            }

            $ = create$(this.getRootNode());

            this.getPai = this.getPai();
            this.getGPai = this.getGPai();
            this.addUsedPai = this.addUsedPai();
            this.countDown = this.countDown();

            this.calcPosConf();

            if (isReplay) {
                $('lb_recordid').setString(gameData.recordId);
                $('lb_recordid').setVisible(true);
                $('lb_recordid_').setVisible(true);
            } else {
                $('lb_recordid').setVisible(false);
                $('lb_recordid_').setVisible(false);
            }


            if (getNativeVersion() < '1.4.0') {
                this.initMic();
            } else {
                MicLayer.init($('btn_mic'), this);
            }

            if (isReconnect) {
                gameData.zhuangUid = data['zhuang_uid'];
                gameData.leftRound = data['left_round'];
                gameData.players = data['players'];

                var status = data['room_status'] || ROOM_STATE_ONGOING;
                if (status == ROOM_STATE_ENDED) {
                    this.setRoomState(ROOM_STATE_ONGOING);
                    this.setRoomState(ROOM_STATE_ENDED);
                }
                else {
                    this.setRoomState(status);
                }

                this.initExtraMapData(data);
            }
            else {
                this.setRoomState(ROOM_STATE_CREATED);
                if (gameData.jinbi) {
                    this.showTip("请等待匹配玩家进入牌桌...", false, 20000);
                }
            }


            //this.initWanfa();

            this.clearTable4StartGame(isReconnect, isReconnect, data);

            this.startTime();

            this.startSignal();
            TouchUtils.setOnclickListener($('lockLocation'), function () {
                that.showLocationPanel();
            });
            TouchUtils.setOnclickListener($('btn_control_btns'), function () {
                that.changeBtnStatus();
            });
            TouchUtils.setOnclickListener($('btn_bg'), function () {

            });
            TouchUtils.setOnclickListener($('bgPanel'), function () {
                that.hideControlBtns();
            });

            TouchUtils.setOnclickListener($('chat'), function () {
                if (!that.chatLayer) {
                    that.chatLayer = new ChatLayer();
                    that.chatLayer.retain();
                }
                that.addChild(that.chatLayer);
            });

            TouchUtils.setOnclickListener($('setting'), function () {
                if (!that.settingsLayer) {
                    that.settingsLayer = new ThemeSetting();
                    that.settingsLayer.retain();
                }
                that.addChild(that.settingsLayer);
            });

            TouchUtils.setOnclickListener($('btn_zhunbei'), function () {
                network.send(3004, {room_id: gameData.roomId});
            });

            TouchUtils.setOnclickListener($('btn_huanzhuo'), function () {
                _isHuanzhuo = true;
                network.send(3003, {room_id: gameData.roomId});
                network.send(3001, {
                    jinbi: true,
                    map_id: gameData.appId,
                    chang_level: gameData.chang_level,
                    jinbi_difen: gameData.jinbi_difen,
                    "daikai": false,
                    "options": {
                        "jushu": 1,
                        "mapid": 50,
                        "quanpindao": true,
                        "fengding": 8,
                        "piao": 0,
                        "maima": 0,
                        "qiangganghu": true,
                        "desp": encodeURIComponent(["8局", "卡五星", "金币场", "全频道", "8倍封顶", "不加漂", "不买马"].join(","))
                    }
                    //options: {mapid: 50/*gameData.appId*/, jushu: 1}
                });
            });

            TouchUtils.setOnclickListener($('btn_yxks'), function () {
                network.send(3004, {room_id: gameData.roomId});
            });

            TouchUtils.setOnclickListener($('btn_copy'), function () {
                if (!cc.sys.isNative)
                    return;
                if (getNativeVersion() < "2.0.0") {
                    alert1("请下载最新版本使用新功能");
                    return;
                }
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);
                var shareText = "【逍遥麻将】\n" + mapName + "\n房号: " + ToDBC(gameData.roomId) + "\n"
                    + (parts.length ? parts.join(', ') + ', ' : "") + "速度来啊！";
                savePasteBoard(shareText);
                showMessage("您的房间信息已复制，请粘贴至微信处分享", {fontName: "res/fonts/FZZY.TTF"});
            });


            TouchUtils.setOnclickListener($('btn_invite'), function () {

                that.addChild(new ShareTypeLayer(), 100);

            });

            TouchUtils.setOnclickListener($('btn_fanhui'), function () {
                if (gameData.uid != gameData.ownerUid || gameData.jinbi) {
                    alert2('确定要退出房间吗?', function () {
                        gameData.jinbi = false;
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, true, true);
                }
            });

            TouchUtils.setOnclickListener($('btn_leave'), function () {

                    alert2('确定要退出房间吗?', function () {
                        gameData.jinbi = false;
                        network.send(3003, {room_id: gameData.roomId,leaveOnly:true});
                    }, null, false, true, true);
            });


            TouchUtils.setOnclickListener($('jiesan'), function () {
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    if (window.inReview)
                        network.send(3003, {room_id: gameData.roomId});
                    else
                        alert2('解散房间不扣房卡，是否确定解散？', function () {
                            network.send(3003, {room_id: gameData.roomId});
                        }, null, false, false, true, true);
                    return;
                }

                alert2('确定要申请解散房间吗？', function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                }, null, true, false, true, true, undefined, undefined, "解散房间");
            });

            TouchUtils.setOnclickListener($('btn_jiesan'), function () {
                if (window.inReview)
                    network.send(3003, {room_id: gameData.roomId});
                else
                    alert2('解散房间不扣房卡，是否确定解散？', function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, false, true, true, undefined, undefined, "解散房间");
            });

            TouchUtils.setOnclickListener($('info0'), function () {
                that.showPlayerInfoPanel(0);
            });
            TouchUtils.setOnclickListener($('info1'), function () {
                that.showPlayerInfoPanel(1);
            });
            TouchUtils.setOnclickListener($('info2'), function () {
                that.showPlayerInfoPanel(2);
            });
            TouchUtils.setOnclickListener($('info3'), function () {
                that.showPlayerInfoPanel(3);
            });

            TouchUtils.setOnclickListener($('info0.ti'), function () {
                that.tiAlert(position2uid[0]);
            });
            TouchUtils.setOnclickListener($('info1.ti'), function () {
                that.tiAlert(position2uid[1]);
            });
            TouchUtils.setOnclickListener($('info2.ti'), function () {
            });
            TouchUtils.setOnclickListener($('info3.ti'), function () {
                that.tiAlert(position2uid[3]);
            });

            TouchUtils.setOnclickListener($('auto_bg.button_qxtg'), function () {
                network.send(4007, {room_id: gameData.roomId, op: 0})
            });

            TouchUtils.setOnclickListener($('btn_auto'), function () {
                network.send(4007, {room_id: gameData.roomId, op: 1})
            });

            network.addListener(4201, function (data) {

            });

            network.addListener(3002, function (data) {
                gameData.last3002 = data;
                gameData.playerNum = data['max_player_cnt'];
                if (isReplay) {
                    mapId = gameData.mapId;
                    gameData.roomId = data['room_id'];
                    gameData.mapId = data['map_id'];
                    //gameData.mapName = decodeURIComponent(data['map_name'] || "");
                    gameData.wanfaDesp = data['desp'];
                    var arr = gameData.wanfaDesp.split(',');
                    var gname = arr[1];
                    gameData.mapName = gname || '';


                    playerNum = gameData.playerNum || MAP2PNUM[gameData.appId] || 4;
                }

                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.ownerUid = data['owner'];
                    gameData.players = data['players'];
                    gameData.jinbi = data['jinbi'];
                    gameData.roomId = data['room_id'];
                    that.onPlayerEnterExit();
                }

                gameData.daikaiPlayer = data['daikai_player'];
                gameData.roomClubId=data['club_id'];
            });
            network.addListener(3003, function (data) {
                var uid = data['uid'];
                if (uid == gameData.uid) {
                    //金币场 换桌
                    if (gameData.jinbi && _isHuanzhuo) {
                        _isHuanzhuo = false;
                        return;
                    }
                    clearGameMWRoomId();
                    // cc.director.runScene(new MainScene());
                    HUD.showScene(HUD_LIST.Home, that);
                    if (data['is_kick']) {
                        setTimeout(
                            function () {
                                alert1("您被【" + uid2playerInfo[gameData.ownerUid].nickname + "】踢出房间");
                            }, 100
                        );
                    }
                    return;
                }
                if (data['is_kick']) {
                    if (gameData.uid != gameData.ownerUid) {
                        setTimeout(
                            function () {
                                alert1("【" + uid2playerInfo[uid].nickname + "】被【" + uid2playerInfo[gameData.ownerUid].nickname + "】踢出房间");
                            }, 100
                        );
                    }
                }
                if (that.getRoomState() == ROOM_STATE_ONGOING)
                    return;
                if (data['del_room']) {
                    var owner = uid2playerInfo[gameData.ownerUid];
                    if (owner) {
                        alert1('房主' + owner.nickname + '已解散房间', function () {
                            clearGameMWRoomId();
                            // cc.director.runScene(new MainScene());
                            HUD.showScene(HUD_LIST.Home, that);
                        });
                    }
                } else {
                    var uid = data['uid'];
                    _.remove(gameData.players, function (player) {
                        return player.uid == uid;
                    });
                    that.onPlayerEnterExit();
                }
            });
            network.addListener(3004, function (data) {
                var isCanSet = true;

                if (!gameData.jinbi && that.getRoomState() != ROOM_STATE_ENDED)
                    isCanSet = false;

                if (gameData.jinbi && that.getRoomState() == ROOM_STATE_ONGOING)
                    isCanSet = false;

                if (isCanSet) {
                    var uid = data['uid'];
                    that.setReady(uid);
                }
            });
            network.addListener(3013, function (data) {
                gameData.numOfCards = data['numof_cards'];
            });
            network.addListener(3005, function (data) {
            });
            network.addListener(3008, function (data) {
                var uid = data['uid'];
                var type = data['type'];
                var voice = data['voice'];
                var content = decodeURIComponent(data['content']);
                that.showChat(uid2position[uid], type, content, voice);
            });
            network.addListener(3009, function (data) {
                var arr = data['arr'];
                var leftSeconds = data['left_sec'];
                leftSeconds = (leftSeconds < 0 ? 0 : leftSeconds);
                var byUserId = data['arr'][0].uid;

                if(that.isJiesan)
                    return;
                that.isJiesan = data['is_jiesan'];

                var shenqingjiesanLayer = $("shenqingjiesan", that);
                if (!shenqingjiesanLayer) {
                    shenqingjiesanLayer = new ShenqingjiesanLayer();
                    shenqingjiesanLayer.setName("shenqingjiesan");
                    that.addChild(shenqingjiesanLayer, 60);
                }
                shenqingjiesanLayer.setArrMajiang(leftSeconds, arr, byUserId,data);
            });
            network.addListener(3200, (function () {
                var interval = null;
                return function (data) {
                    return;
                    if (interval) {
                        clearInterval(interval);
                        interval = null;
                    }

                    var content = decodeURIComponent(data['content']);
                    var duration = (content.length * 0.3 <= 10) ? 10 : content.length * 0.3;
                    var totalDuration = (0.2 + duration + 0.3 + 2) * 1000;

                    var func = function () {
                        if (!that || !cc.sys.isObjectValid(that)) {
                            if (interval) {
                                clearInterval(interval);
                                interval = null;
                            }
                            return;
                        }
                        var speaker = $('speaker');
                        var speakerPanel = $('speaker.panel');
                        speaker.setLocalZOrder(100);
                        speaker.runAction(cc.fadeIn(0.2));
                        var text = new ccui.Text();
                        text.setFontSize(26);
                        text.setColor(cc.color(254, 245, 92));
                        text.setAnchorPoint(cc.p(0, 0));
                        text.enableOutline(cc.color(0, 0, 0), 1);
                        speakerPanel.removeAllChildren();
                        speakerPanel.addChild(text);
                        text.setString(content);
                        text.setPositionX(speakerPanel.getContentSize().width);
                        text.setPositionY((speakerPanel.getContentSize().height - text.getContentSize().height) / 2);
                        text.runAction(cc.sequence(
                            cc.delayTime(0.2)
                            , cc.moveTo(duration, -text.getVirtualRendererSize().width, 0)
                            , cc.delayTime(0.3)
                            // , cc.callFunc(function () { speaker.runAction(cc.fadeOut(0.2)) })
                        ));
                    };
                    func();
                    interval = setInterval(func, totalDuration);
                }
            })());
            network.addListener(4000, function (data) {
                var uid = data['uid'];
                that.throwTurn(uid2position[uid]);
            });
            network.addListener(4001, function (data) {
                var uid = data['uid'];
                var paiId = data['pai_id'];
                var left = data['left'];
                var paiArr = data['pai_arr'];
                var liangPaiArr = data['liang_pai_arr'];
                leftPaiCnt = left;
                $('timer2.Text_2').setString(left);
                that.mopai(uid2position[uid], paiId, paiArr, liangPaiArr);
            });
            network.addListener(4002, function (data, errorCode) {
                if (errorCode) {
                    network.disconnect();//直接断线重连
                    return;
                }
                var paiArr = (data['pai_arr'] || []);
                var uid = data['uid'];
                var idx = data['idx'];
                var paiId = data['pai_id'];
                var liangPaiArr = (data['liang_pai_arr'] || []);
                var paiCnt = (data['pai_cnt'] || 0);
                var left = (data['left'] || 0);
                var noSound = (data['nosound'] || false);
                var row = uid2position[uid];

                if (row == 2 && that.peopleSend) {//自己 并且不是自动发牌
                    var difArr = _.xor(that.curPaiArr, paiArr);
                    if (difArr && difArr.length > 0) {//数组不一致
                        network.disconnect();//直接断线重连
                        return;
                    }
                }
                if (mapId == MAP_ID.CHANGSHA)
                    $('timer2.Text_2').setString(left);
                for (var i = 0; i < paiCnt; i++)
                    paiArr.push(0);
                that.chuPai(row, idx, paiId, paiArr, liangPaiArr, noSound);

                // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
                //     var isGang = data['gang'] || false;
                //     if (isGang) {
                //         that.playChiPengGangHuAnim(row, OP_GANG, false, false);
                //         playEffect('vgang', position2sex[row]);
                //     }
                //     var multiple = data['multiple'] || 1;
                //     var lbBs = $('info' + row + '.lb_bs');
                //     lbBs && lbBs.setString('x' + multiple);
                //     lbBs && lbBs.setVisible(true);
                // }
                // if (mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) {
                //     var isGang = data['gang'] || false;
                //     isGang && playEffect('vlai', position2sex[row]);
                // }
            });
            network.addListener(4003, function (data) {
                var uid = data['uid'];
                var fromUid = data['from_uid'];
                var paiId = data['pai_id'];
                var op = data['op'];
                var chi = op[0];
                var peng = op[1];
                var gang = op[2];
                var hu = op[3];
                if (chi) that.chiPengGangHu(OP_CHI, uid2position[uid], paiId, uid2position[fromUid], data);
                if (peng) that.chiPengGangHu(OP_PENG, uid2position[uid], paiId, uid2position[fromUid], data);
                if (gang) that.chiPengGangHu(OP_GANG, uid2position[uid], paiId, uid2position[fromUid], data);
                if (hu) that.chiPengGangHu(OP_HU, uid2position[uid], paiId, uid2position[fromUid], data);
                if (!chi && !peng && !gang && !hu)
                    that.chiPengGangHu(OP_PASS, uid2position[uid], paiId, uid2position[fromUid], data);
            });
            network.addListener(4004, function (data) {
                var uid = data['uid'];
                var paiId = data['pai_id'];
                var op = data['op'];
                var row = uid2position[uid];
                that.showChiPengGangHu(row, paiId, op[0], op[1], op[2], op[3], op[4], data);
                gameData.data4004 = data;
            });
            network.addListener(4005, function (data) {
                var uid = data['uid'];
                var op = data['op'];
                var row = uid2position[uid];
                that.showTingLiang(row, op[0], op[1]);
            });
            network.addListener(40044, function (data) {
                var arr = data['arr'];
                for (var i = 0; i < arr.length; i++) {
                    var uid = arr[i]['data']['uid'];
                    var paiId = arr[i]['data']['pai_id'];
                    var op = arr[i]['data']['op'];
                    var row = uid2position[uid];
                    that.showChiPengGangHu(row, paiId, op[0], op[1], op[2], op[3], op[4], data);
                }
            });
            network.addListener(4008, function (data) {

                stopMusic();
                that.setRoomState(ROOM_STATE_ENDED);
                that.jiesuan(data);
            });
            network.addListener(4009, function (data) {
                that.zongJiesuan(data);
            });
            network.addListener(4010, function (data) {
                var msg = data.msg;
                that.showToast(decodeURIComponent(msg));
            });
            network.addListener(4011, function (data) {
                var zhainiaoLayer = new ZhaniaoLayer(data);
                that.addChild(zhainiaoLayer);
                network.stop();
            });
            network.addListener(4013, function (data) {
                that.showTip("diyibu");
                that.setPaiArrOfRow(2, data['pai_arr'], false, false, data['liang_pai_arr']);
                liangStep = 1;
            });
            network.addListener(4014, function (data, errorCode) {//有杠牌的时候亮牌才会收到4014

                disableChupai = false;
                if (errorCode != 0) {

                    return;
                }
                var paiArr = data['pai_arr'];


                var difArr = _.xor(that.curPaiArr, paiArr);//本地牌和服务器校验
                if (difArr && difArr.length > 0) {//数组不一致
                    network.disconnect();//直接断线重连
                    return;
                }


                var paiArrBak = _.clone(data['pai_arr']);
                var gangPaiArr = data['gang_pai_arr'];
                if (!gangPaiArr) {

                }
                else {
                    that.showTip("buxianshi");
                    $('btn_xuanzewancheng').setVisible(true);
                    TouchUtils.setOnclickListener($('btn_xuanzewancheng'), function () {
                        that.selectHideGangCb.call(that);
                    });
                    for (var i = 0; i < gangPaiArr.length; i++) {
                        while (true) {
                            var j = paiArrBak.indexOf(gangPaiArr[i]);
                            if (j < 0)
                                break;
                            paiArrBak.splice(j, 1);
                        }
                    }
                    hideGangArr = gangPaiArr;
                    hidedGangArr = [];

                    if (gangPaiArr.length == 0)
                        that.selectHideGangCb();
                    else {
                        hideGangStep = 1;
                        that.setPaiArrOfRow(2, that.curPaiArr, false, false, gangPaiArr, true, true);//用本地数组 并且不排序 本地数组不变 点杠牌倒牌后取消亮时回复牌
                    }
                }
                if (gameData.huTipData) {
                    that.showTishiTip(gameData.huTipData);
                }
            });
            network.addListener(4015, function (data) {
                // return;
                disableChupai = false;
                hideGangChupaiArr = data['ting_pai_arr'];
                hideGangStep = 2;
                that.showTip("dayizhang");
                var paiArr = data['pai_arr'];

                //cc.log('curpaiarr is ====================',that.curPaiArr);
                var difArr = _.xor(that.curPaiArr, paiArr);//本地牌和服务器校验
                if (difArr && difArr.length > 0) {//数组不一致
                    network.disconnect();//直接断线重连
                    return;
                }
                that.findNotLiang(hideGangChupaiArr, hupaiMap);


                if (hideGangStep == 1) {//取消选择
                    that.setPaiArrOfRow(2, that.curPaiArr, false, false, hideGangChupaiArr, false, true);//这里用本地的牌数组 本地数组也不会改变 顺序不变
                } else if (hideGangStep == 2) {//选择完成
                    var showIdArr = [];//需要显示的数组
                    for (var i = 0; i < 14; i++) {
                        var pai = that.getPai(2, i);
                        var ud = pai.userData;
                        if (ud.pai != 0) {
                            showIdArr.push(ud.pai);
                        }
                    }

                    //cc.log('showid arr is=========================',showIdArr);
                    that.prePaiArr = that.curPaiArr.slice(0);
                    that.setPaiArrOfRow(2, showIdArr, false, false, hideGangChupaiArr, false, true);//这里只是提示出牌 本地数组相应改变 顺序不变 curarr变成showIdarr


                }
                $('btn_xuanzewancheng').setVisible(false);
                if (gameData.huTipData) {
                    that.showTishiTip(gameData.huTipData);
                }
            });
            network.addListener(4020, function (data) {
                var uid = data['uid'];
                var isOffline = data['is_offline'];
                if (isOffline) {
                    that.showTip('有玩家离线，请稍等一下', true, 30000);
                } else {
                    that.showTip('有个离线玩家回来了^_^', true, 3000);
                }
                that.playerOnloneStatusChange(uid2position[uid], isOffline);
            });
            network.addListener(4200, function (data) {
                that.hideTip();

                var paiArr = data['paiArr'];
                var zhuangUid = data['zhuang_uid'];
                var isSelectPiaoFinished = _.isUndefined(data['spf']) ? true : data['spf'];

                gameData.zhuangUid = zhuangUid;
                gameData.leftRound = data['left_round'];

                that.initExtraMapData(data);

                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame(true);

                playMusic();//再次播放正常声音

                that.fapai(paiArr);
                that.setZhuang(uid2position[zhuangUid]);

                if (!isSelectPiaoFinished) {
                    forRows(function (i) {
                        for (var j = 0; j < 14; j++)
                            this.getPai(i, j).setVisible(false);
                    });
                }

                if (that.afterGameStart)
                    that.afterGameStart();

            });
            network.addListener(4030, function (data, errCode) {
                if (errCode == -1) {
                    that.showTip("liangpianbuzhengque");
                    $('btn_queding').setVisible(true);
                    //$('btn_quxiao').setVisible(true);
                }
                else {
                    var uid = data['uid'];
                    that.hideTip();
                    var paiArr = data['pai_arr'];
                    var liangPaiArr = data['liang_pai_arr'] || [];

                    var row = uid2position[uid];
                    if (row == 2) {
                        afterLianging = true;
                        that.upPai(2, -1);
                    }
                    else {
                        for (var i = 0; i < paiArr.length; i++)
                            paiArr[i] = 0;
                    }

                    for (var i = 0; i < liangPaiArr.length; i++)
                        disabledChuPaiIdMap[liangPaiArr[i]] = true;

                    that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), liangPaiArr);

                    if (row == 2) {
                        hasChupai = true;
                        that.hideTip();
                    }
                }
            });
            network.addListener(4031, function (data, errCode) {
                if (errCode == -1) {
                    that.showTip("chupaibuzhengque");
                    //$('btn_xuanzewancheng').setVisible(true);
                    //$('btn_quxiao').setVisible(true);
                }
                else {
                    var uid = data['uid'];
                    var row = uid2position[uid];
                    that.hideTip();
                    var paiArr = data['pai_arr'];

                    if (isReplay && row == 2) {//重播的时候这里需要做特殊处理 因为没有走send4031 curPaiArr会和paiArr不一致
                        that.curPaiArr = paiArr;
                    }
                    var hidedGangPaiArr = data['hided_gang_arr'] || [];
                    var tingArr = data['ting_arr'] || [];


                    do {
                        if (row == 2) {
                            afterLianging = true;
                            that.upPai(2, -1);
                            if (!isAutoSendPai) break;
                        }

                        // if (!isReplay)
                        //     break;

                        for (var j = 0; j < hidedGangPaiArr.length; j++) {
                            for (var i = 0; i < 4; i++) {
                                that.getGPai(row, i, 0);
                                var g = $('row' + row + '.g' + i);
                                if (g.isVisible() == false) {
                                    that.setGHide(row, i);
                                    g.setVisible(true);
                                    that.recalcPos(row);
                                    break;
                                }
                            }
                        }
                    } while (false);

                    //that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), []);

                    if (row == 2) {
                        hasChupai = true;
                        that.hideTip();

                        stopMusic();
                        playMusic('vFight');
                    }

                    if (tingArr.length) {
                        hupaiMap[row] = tingArr;
                        that.showLiangHuTip(row, tingArr);
                        that.checkMyPaiColor4KWX();
                    }
                    if ($('info' + row + '.liang'))
                        $('info' + row + '.liang').setVisible(true);
                    that.playChiPengGangHuAnim(row, OP_LIANG);
                    playEffect('vliang', position2sex[row]);
                }
            });
            network.addListener(4062, function (data) {
                that.showTishiTip(data);
            });
            network.addListener(4034, function (data, errCode) {
                that.showSelectPiao(data['sel_map']);
            });
            network.addListener(4035, function (data, errCode) {
                that.hideSelectedPiao();
                that.setPaiArrOfRow(2, data['paiArr']);
                forRows(function (i) {
                    for (var j = 0; j < 13; j++) {
                        var pai = that.getPai(i, j);
                        pai.setOpacity(255);
                        pai.setVisible(true);
                        pai.runAction(cc.fadeIn(0.5));
                    }
                });
            });
            network.addListener(4041, function (data, errCode) {
            });
            network.addListener(4007, function (data, errCode) {
                var op = data["op"];
                var uid = data["uid"];
                var row = uid2position[uid];
                if (row == 2) {
                    $('auto_bg').setVisible(op != 0);
                    $('btn_auto').setVisible(op == 0);
                }
                $('info' + row + '.tuo').setVisible(op != 0);
                isAutoSendPai = op == 1;
            });
            network.addListener(4050, function (data) {
                var arr = data['arr'];
                var haidiUid = data['haidi_uid'] || 0;
                var paiId = data['pai_id'] || 0;
                var allNo = true;
                for (var i = 0; i < arr.length; i++)
                    if (arr[i].val >= 0)
                        allNo = false;
                if (haidiUid) {
                    var haidiLayer = $('haidiLayer', that);
                    if (haidiLayer)
                        haidiLayer.removeFromParent(true);
                    alert1("玩家【" + gameData.playerMap[haidiUid].nickname + "】获得海底牌: " + PAINAMES[paiId], function () {
                    });
                }
                else if (allNo) {
                    var haidiLayer = $('haidiLayer', that);
                    if (haidiLayer)
                        haidiLayer.removeFromParent(true);
                    alert1('没有玩家要海底牌');
                }
                else {
                    var haidiLayer = $('haidiLayer', that);
                    if (!haidiLayer) {
                        haidiLayer = new HaidiLayer();
                        haidiLayer.setName('haidiLayer');
                        that.addChild(haidiLayer);
                    }
                    haidiLayer.setArr(arr);
                }
            });
            network.addListener(4053, function (data) {
                that.showTip("dengdai");
                disableChupai = true;
                selectingXiaohu = true;
            });
            network.addListener(4054, function (data) {
                that.hideTip();
                disableChupai = false;
                selectingXiaohu = false;
            });
            network.addListener(4055, function (data) {
                that.hideTip();
                disableChupai = false;
                selectingXiaohu = false;

                var uid = data['uid'];
                var row = uid2position[uid];
                if (row != 2) {
                    var paiArr = data['pai_arr'];
                    var paiCnt = data['pai_cnt'];
                    var n = paiCnt - paiArr.length;
                    for (var i = 0; i < n; i++)
                        paiArr.push(0);
                    that.setPaiArrOfRow(row, paiArr, true, false);
                }

                that.playChiPengGangHuAnim(row, OP_HU, false);
                playEffect('vhu', position2sex[row]);
            });
            network.addListener(4066, function (data) {
                // todo data格式recv: {"code":4066,"data":{"scores":[{"uid":11, "score":-100, "total":900}, {"uid":1897, "score":-100, "total":900}, {"uid":5059, "score":100, "total":1100}, {"uid":5060, "score":100, "total":1100}]}}
                if (data && data["scores"]) {
                    var scores = data["scores"];
                    for (var i = 0; i < scores.length; i++) {
                        var row = uid2position[scores[i]["uid"]];
                        that.showChangeScore(row, scores[i]["score"]);
                        $('info' + row + '.lb_score').setString(scores[i]["total"] - 1000);//前端暂时做减1000处理
                    }
                }
            });

            network.addListener(4990, function (data) {
                that.addEffectEmojiQueue(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
            });
            network.addListener(4057, function (data) {
                network.stop();
                var overCb = function () {
                    network.start();
                };
                var dice = data['dice'];
                if (!dice || dice.length < 2 || dice[0] == 0 || dice[1] == 0) {
                    overCb();
                    return;
                }
                var diceLayer = ccs.load(res.ThrowDice_json).node;
                that.addChild(diceLayer);
                var dice_text = diceLayer.getChildByName('root').getChildByName('panel').getChildByName('text');
                dice_text.setString('上楼掷骰子');
                var diceNode0 = diceLayer.getChildByName('root').getChildByName('panel').getChildByName('dice0');
                var diceNode1 = diceLayer.getChildByName('root').getChildByName('panel').getChildByName('dice1');
                playThrowDice(diceNode0, dice[0], null, Math.floor(Math.random() * 3) + 2);
                playThrowDice(diceNode1, dice[1], function () {
                    setTimeout(function () {
                        diceLayer.removeFromParent(true);
                        overCb();
                    }, 2000);
                }, Math.floor(Math.random() * 3) + 2);
            });
            network.addListener(4012, function (data) {
                network.stop();
                var overCb = function () {
                    network.start();
                };
                var zhainiaoLayer = new ZhaniaoLayer(data, 2, overCb);
                that.addChild(zhainiaoLayer);
            });
            network.start();

            isCCSLoadFinished = true;
            if (afterLianging) {//亮倒后播战斗
                stopMusic();
                playMusic('vFight');
            } else {
                playMusic();
            }


            that.showFangzhu();
        },
        showFangzhu: function () {
            if (gameData.daikaiPlayer) {
                if(!gameData.roomClubId){
                    $('clubowner').setVisible(false);
                    $('fangzhuheader').setVisible(true);
                    loadImageToSprite(gameData.daikaiPlayer['headimgurl'], $('fangzhuheader.header'));
                    $('fangzhuheader.name').setString(ellipsisStr(ellipsisStr(_.trim(gameData.daikaiPlayer['nickname']), 5)));
                }else{
                    $('clubowner').setVisible(true);
                    $('fangzhuheader').setVisible(false);

                }

            } else {
                $('fangzhuheader').setVisible(false);
                $('clubowner').setVisible(false);
            }
        },
        showTishiTip: function (data) {
            var that = this;
            if (data == null || hasChupai) return;
            gameData.huTipData = data;
            //胡牌提示
            for (var i = 0; i < 14; i++) {
                (function (i) {
                    var cardSprite = that.getPai(2, i);
                    var userData = cardSprite.getUserData();
                    var paiId = userData.pai;
                    var hucards = null;
                    for (var cards in data.tishi) {
                        if (parseInt(cards) == parseInt(paiId)) {
                            hucards = data.tishi[cards];
                            break;
                        }
                    }
                    var hucardSprite;
                    if (cardSprite.getChildByName('hucardSprite')) {
                        hucardSprite = cardSprite.getChildByName('hucardSprite');
                        hucardSprite.setPosition(cardSprite.getContentSize().width / 2 - 25, cardSprite.getContentSize().height - 33);
                    } else {
                        hucardSprite = new cc.Sprite(res.hupaitip_jiao);
                        hucardSprite.setPosition(cardSprite.getContentSize().width / 2 - 25, cardSprite.getContentSize().height - 33);
                        hucardSprite.setName('hucardSprite');
                        cardSprite.addChild(hucardSprite);
                    }
                    var duration = 2;
                    hucardSprite.setVisible(!!hucards);
                    // hucardSprite.runAction(new cc.RepeatForever(cc.sequence(
                    //     cc.spawn(cc.moveBy(duration, 0, 10), cc.fadeTo(duration, 188)),
                    //     cc.spawn(cc.moveBy(duration, 0, -10), cc.fadeTo(duration, 255))
                    // )));
                    var userData = cardSprite.getUserData();
                    userData.hucards = hucards;
                })(i);
            }
        },
        tiAlert: function (destUid) {
            alert2("是否踢出【" + uid2playerInfo[destUid].nickname + "】该玩家？", function () {
                network.send(3010, {room_id: gameData.roomId, dest_uid: destUid});
            }, function () {
            });
        },
        onExit: function () {
            if (this.chatLayer)
                this.chatLayer.release();
            if (this.settingLayer)
                this.settingLayer.release();
            if (this.chiLayer)
                this.chiLayer.release();
            if (this.throwDiceLayer)
                this.throwDiceLayer.release();
            if (this.kaigangLayer)
                this.kaigangLayer.release();
            if (!gameData.jinbi) {
                network.removeListeners([
                    3002, 3003, 3004, 3005, 3008, 3200,
                    4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200
                ]);
            }
            // network.removeListeners([
            //     3002, 3003, 3004, 3005, 3008, 3200,
            //     4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200
            // ]);

            cc.Layer.prototype.onExit.call(this);
        },
        getUserHeaderData: function () {
            var data = {};
            var players = gameData.players;
            var scale = cc.view.getFrameSize().width / cc.director.getWinSize().width;
            var theight = cc.view.getFrameSize().height / scale;
            var boardHeight = (theight - cc.director.getWinSize().height) / 2;
            console.log("boardHeight = " + boardHeight);
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var pos = uid2position[player.uid];
                var header = $('info' + pos + '.head');
                var headerPos = header.convertToWorldSpace(cc.p(0, 0));
                var width = header.getBoundingBox().width;
                var height = header.getBoundingBox().height;
                var x = headerPos.x;
                var y = headerPos.y + height - boardHeight;
                data[player.uid] = {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                };
            }
            return JSON.stringify(data);
        },
        onPlayerEnterExit: function () {
            var that = this;
            var players = gameData.players;
            for (var i = 0; i < players.length; i++) {
                var player = players[0];
                if (player.uid != gameData.uid) {
                    players.splice(0, 1);
                    players.push(player);
                }
                else
                    break;
            }
            $('timer').setUserData({delta: i});
            uid2position = {};
            var selfPosRow = -1;
            for (var i = 0, j = 2; i < players.length; i++, j++) {
                var player = players[i];
                var k = {
                    4: {'0': 0, '1': 3, '2': 2, '3': 1},
                    3: {'0': 1, '1': 3, '2': 2},
                    2: {'0': 2, '1': 0},
                    1: {'0': 2}
                }[playerNum][j % playerNum];

                if (player.uid == gameData.uid) {
                    selfPosRow = k;
                }

                $('info' + k).setVisible(true);
                $('info' + k + '.lb_nickname').setString(ellipsisStr(player['nickname'], 5));
                $('timer.txt' + k).setString(directonName[player['pos']]);

                //console.log('===================================',gameData.mapId);

                $('info' + k + '.lb_score').setString(roomState == ROOM_STATE_CREATED ? 0 : player['score'] + 0);


                if (gameData.jinbi) {
                    $('info' + k + '.lb_score').setString(player.jinbiNum);
                }

                if (k != 2 && gameData.uid == gameData.ownerUid && that.getRoomState() == ROOM_STATE_CREATED && !gameData.jinbi) {
                    $('info' + k + '.ti').setVisible(true);
                }
                // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU)
                //     $('info' + k + '.lb_bs').setString('x1');
                if (roomState == ROOM_STATE_CREATED) {
                    // $('info' + k + '.ok').setVisible(!!player['ready']);
                    if (!!player['ready'])
                        that.setReady(null, k);
                    if ($('row_top_info' + k + '.ok'))
                        $('row_top_info' + k + '.ok').setVisible(!!player['ready']);
                    if (player.uid == gameData.uid) {
                        $('btn_zhunbei').setVisible(!player['ready'] && gameData.jinbi);
                    }
                }

                // loadImageToSprite(player['headimgurl'], $('info' + k + '.head'));
                loadImageToSprite(player['headimgurl'], $('info' + k + '.head'));

                uid2position[player.uid] = k;
                uid2playerInfo[player.uid] = player;
                position2uid[k] = player.uid;
                position2sex[k] = player.sex;
                position2playerArrIdx[k] = i;
            }

            for (; i < playerNum; i++, j++) {
                var k = {
                    4: {'0': 0, '1': 3, '2': 2, '3': 1},
                    3: {'0': 1, '1': 3, '2': 2},
                    2: {'0': 2, '1': 0}
                }[playerNum][j % playerNum];
                $('info' + k).setVisible(false);
                if ($('row_top_info' + k + '.ok'))
                    $('row_top_info' + k + '.ok').removeFromParent();
            }

            if (playerNum == 3) {
                $('info0').setVisible(false);
                $('timer.txt0').setVisible(false);
            }


            if (playerNum == 2) {
                $('info1').setVisible(false);
                $('info3').setVisible(false);
                $('timer.txt1').setVisible(false);
                $('timer.txt3').setVisible(false);
            }

            // if (gameData.uid == gameData.ownerUid) {
            //     if (players.length < playerNum) {
            //         $('btn_invite').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid && !gameData.jinbi);
            //         $('btn_qq').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid && !gameData.jinbi);
            //         $('btn_copy').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid && !gameData.jinbi);
            //         $('btn_yxks').setVisible(false);
            //     } else if (that.getRoomState() == ROOM_STATE_CREATED) {
            //         $('btn_invite').setVisible(false);
            //         $('btn_qq').setVisible(false);
            //         $('btn_copy').setVisible(false);
            //         $('btn_yxks').setVisible(true);
            //         if (gameData.jinbi) {
            //             $('btn_yxks').setVisible(false);
            //         }
            //     }
            // }

            //修改为不是房主也可以分享
            if (players.length < playerNum) {
                $('btn_invite').setVisible(gameData.loginType != 'yk' && !gameData.jinbi);
                //$('btn_qq').setVisible(gameData.loginType != 'yk' && !gameData.jinbi);
                $('btn_copy').setVisible(gameData.loginType != 'yk' && !gameData.jinbi);
                $('btn_yxks').setVisible(false);
                // if(getNativeVersion()>='2.0.2'){
                //     $('btn_liaobei').setVisible(gameData.loginType != 'yk' && !gameData.jinbi);
                // }
            } else if (that.getRoomState() == ROOM_STATE_CREATED) {
                $('btn_invite').setVisible(false);
                //$('btn_qq').setVisible(false);
                $('btn_copy').setVisible(false);
                // $('btn_liaobei').setVisible(false);
                if (gameData.uid == gameData.ownerUid) {
                    $('btn_yxks').setVisible(true);
                    if (gameData.jinbi) {
                        $('btn_yxks').setVisible(false);
                    }
                }
            }


            // if (players.length >= playerNum && roomState == ROOM_STATE_CREATED) {
            //     setTimeout(function () {
            //         if (that && cc.sys.isObjectValid(that) && players.length >= playerNum && !isReplay && roomState == ROOM_STATE_CREATED) {
            //             network.disconnect();
            //         }
            //     }, 4000);
            // }

            //距离提示
            // var arr = [0, 1, 3];
            // var playerArr = [];
            // for (var i = 0; i < arr.length; i++) {
            //     var playerInfo = gameData.players[position2playerArrIdx[arr[i]]];
            //     var playerInfo2 = null;
            //     if (i == arr.length - 1) {
            //         playerInfo2 = gameData.players[position2playerArrIdx[arr[0]]];
            //     } else {
            //         playerInfo2 = gameData.players[position2playerArrIdx[arr[i + 1]]];
            //     }
            //     if (playerInfo2 && playerInfo && playerInfo2['loc'] && playerInfo['loc']) {
            //         var templocation1 = playerInfo['loc'].split(',');
            //         var other1Location_1 = templocation1[1];
            //         var other1Location_2 = templocation1[0]
            //
            //         var templocation2 = playerInfo2['loc'].split(',');
            //         var other2Location_1 = templocation2[1];
            //         var other2Location_2 = templocation2[0];
            //         //其他三个人相互的距离
            //         var distance = getFlatternDistance(other1Location_1, other1Location_2, other2Location_1, other2Location_2);
            //         if (distance <= 200) {
            //             var playerName = {};
            //             playerName.name1 = playerInfo.nickname;
            //             playerName.name2 = playerInfo2.nickname;
            //             playerArr.push(playerName);
            //         }
            //     }
            // }
            // if (playerArr.length > 0) {
            //     $('tishiguojin').setVisible(true);
            //     setTimeout(function () {
            //         $('tishiguojin').setVisible(false);
            //     }, 5000);
            // } else {
            //     $('tishiguojin').setVisible(false);
            // }

            //开启视频
            // if (players.length >=2 && roomState == ROOM_STATE_ONGOING) {
            //     AgoraUtil.initVideoView(this.getUserHeaderData());
            //     setTimeout(function () {
            //         AgoraUtil.openVideo(gameData.roomId.toString(), gameData.uid.toString());
            //     }, 1000);
            //     setTimeout(function () {
            //         var perVal = PermissionUtils.isHasAudioPermission() && PermissionUtils.isHasVideoPermission();
            //         if(!perVal){
            //             alert2("请在手机系统设置面板开启摄像头、麦克风权限", function () {
            //                 PermissionUtils.settingPermissionBySystem();
            //             }, function () {
            //
            //             });
            //         }
            //     }, 2000);
            //     //isInitShipin = true;
            // }
        },
        calcPosConf: function () {
            //此处注释 原因 不同局需要重新设置头像 出牌等的位置
            // if (window.posConf) {
            //     posConf = window.posConf;
            //     // return;
            //}

            if (playerNum == 2) {
                $('info0').setPositionX(1100);
                //选票文字向左显示
                $('info0.sp_piaostate0').setAnchorPoint(cc.p(1, 0.5));
                $('info0.sp_piaostate1').setAnchorPoint(cc.p(1, 0.5));
                $('info0.sp_piaostate0').setPosition(cc.p(2, 15));
                $('info0.sp_piaostate1').setPosition(cc.p(2, 15));
                $('row2.c0').setPositionY(148 + 77);
            } else {
                // if (!(mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU)) {
                //     $('row2.c0').setPositionY(148 + 77);
                // }
            }
            for (var row = 0; row < 4; row++) {
                var a0 = $('row' + row + '.a0');
                posConf.paiA0PosBak[row] = a0.getPosition();
                posConf.paiA0ScaleBak[row] = [a0.getScaleX(), a0.getScaleY()];
                posConf.headPosBak[row] = $('info' + row).getPosition();

                if (row == 0 || row == 2) {
                    var a0 = $('row' + row + '.a0');
                    var a1 = $('row' + row + '.a1');
                    posConf.paiADistance.push(a1.getPositionX() - a0.getPositionX());
                    var b0 = $('row' + row + '.c0.b0');
                    var b1 = $('row' + row + '.c0.b1');
                    posConf.paiUsedDistance.push(b1.getPositionX() - b0.getPositionX());

                    posConf.downPaiPositionY = a0.getPositionY();
                    posConf.upPaiPositionY = a0.getPositionY() + UPPAI_Y;
                }
                else {
                    var a0 = $('row' + row + '.a0');
                    var a1 = $('row' + row + '.a1');
                    posConf.paiADistance.push(a1.getPositionY() - a0.getPositionY());
                    var b0 = $('row' + row + '.c0.b0');
                    var b1 = $('row' + row + '.c0.b1');
                    posConf.paiUsedDistance.push(b1.getPositionY() - b0.getPositionY());
                }

                var b0 = $('row' + row + '.g0.b0');
                var b2 = $('row' + row + '.g0.b2');

                if (row == 0) posConf.groupWidth[0] = b0.getPositionX() + b0.getBoundingBox().width / 2 - (b2.getPositionX() - b2.getBoundingBox().width / 2);
                if (row == 2) posConf.groupWidth[2] = b2.getPositionX() + b2.getBoundingBox().width / 2 - (b0.getPositionX() - b0.getBoundingBox().width / 2);
                if (row == 1) posConf.groupHeight[1] = b2.getPositionY() + b2.getBoundingBox().height / 2 - (b0.getPositionY() - b0.getBoundingBox().height / 2);
                if (row == 3) posConf.groupHeight[3] = b0.getPositionY() + b0.getBoundingBox().height / 2 - (b2.getPositionY() - b2.getBoundingBox().height / 2);

                var ltqp = $('info' + row + '.qp');
                if (playerNum == 2 && row == 0) {
                    ltqp = $('info1.qp');
                }
                posConf.ltqpPos[row] = ltqp.getPosition();
                posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                posConf.ltqpEmojiSize[row] = cc.size({0: 80, 1: 90, 2: 84, 3: 100}[row], posConf.ltqpRect[row].height);
                //ltqp.removeFromParent();
            }
            window.posConf = posConf;

        },
        showLocationPanel: function () {


            var llaye = new LookLocationLayer(position2playerArrIdx);
            this.addChild(llaye);

            // var that = this;
            // var scene = ccs.load(res.LookLocation_json);
            // that.addChild(scene.node);
            //
            // var arr = [0, 1, 3];
            // var playerArr = [];
            // for (var i = 0; i < arr.length; i++) {
            //     $('root.juli' + i, scene.node).setString("?");
            //     $('root.ditanceClose' + i, scene.node).setVisible(false);
            //     $('root.locationClose' + i, scene.node).setVisible(false);
            //     var playerInfo = gameData.players[position2playerArrIdx[arr[i]]];
            //     var head = $('root.head' + i, scene.node);
            //     if (playerInfo) {
            //         loadImageToSprite(playerInfo['headimgurl'], head, head.getContentSize().width / 2);
            //         $('root.locationClose' + i, scene.node).setVisible(!playerInfo['loc']);
            //     }
            //
            //     var playerInfo2 = null;
            //     if (i == arr.length - 1) {
            //         playerInfo2 = gameData.players[position2playerArrIdx[arr[0]]];
            //     } else {
            //         playerInfo2 = gameData.players[position2playerArrIdx[arr[i + 1]]];
            //     }
            //     if (playerInfo2 && playerInfo && playerInfo2['loc'] && playerInfo['loc']) {
            //         var juli = $('root.juli' + i, scene.node);
            //         var templocation1 = playerInfo['loc'].split(',');
            //         var other1Location_1 = templocation1[1];
            //         var other1Location_2 = templocation1[0];
            //
            //         var templocation2 = playerInfo2['loc'].split(',');
            //         var other2Location_1 = templocation2[1];
            //         var other2Location_2 = templocation2[0];
            //         //其他三个人相互的距离
            //         var distance = getFlatternDistance(other1Location_1, other1Location_2, other2Location_1, other2Location_2);
            //         if (distance >= 1000) {
            //             juli.setString((distance / 1000).toFixed(2) + 'km');
            //         }
            //         else {
            //
            //             juli.setString(distance + 'm');
            //         }
            //         juli.setVisible(true);
            //         if (distance > 200) {
            //             juli.setColor(cc.color(26, 26, 26));
            //
            //         } else {
            //             juli.setColor(cc.color(255, 255, 255));
            //             var playerName = {};
            //             playerName.name1 = playerInfo.nickname;
            //             playerName.name2 = playerInfo2.nickname;
            //             playerArr.push(playerName);
            //         }
            //         $('root.juliBgWite' + i, scene.node).setVisible(distance > 200);
            //         $('root.juliBgRed' + i, scene.node).setVisible(distance <= 200);
            //     }
            //
            //
            //     //其他三个人和我的距离
            //     if (gameData.location && playerInfo && playerInfo['loc']) {
            //         var otherInfo = playerInfo['loc'].split(',');
            //         var otherLocation1 = otherInfo[1];
            //         var otherLocation2 = otherInfo[0];
            //         var mylocation = gameData.location.split(',');
            //         var mylocationlat = mylocation[1];
            //         var mylocationlng = mylocation[0];
            //         var myAndOtherDis = getFlatternDistance(mylocationlat, mylocationlng, otherLocation1, otherLocation2);
            //         if (myAndOtherDis) {
            //             $('root.ditanceClose' + i, scene.node).setVisible(myAndOtherDis <= 200);
            //         }
            //     }
            //
            // }
            // for (var i = 0; i < 3; i++) {
            //     var player = playerArr[i];
            //     var arr = [];
            //     if (player) {
            //         var text = new ccui.Text();
            //         text.setFontSize(20);
            //         text.setTextColor(cc.color(255, 0, 0));
            //         text.setPosition($('root.diban_8', scene.node).getPositionX(), $('root.diban_8', scene.node).getPositionY() - $('root.diban_8', scene.node).getContentSize().height / 2 - i * 30);
            //         text.setString(ellipsisStr(player.name1, 5) + ',' + ellipsisStr(player.name2, 5));
            //         $('root', scene.node).addChild(text);
            //         var text1 = new ccui.Text();
            //         text1.setFontSize(20);
            //         text1.setTextColor(cc.color(0, 0, 0));
            //         text1.setAnchorPoint(1, 0.5)
            //         text1.setString('玩家');
            //         $('root', scene.node).addChild(text1);
            //         text1.setPosition(text.getPositionX() - text.getContentSize().width / 2, text.getPositionY());
            //         var text2 = new ccui.Text();
            //         text2.setFontSize(20);
            //         text2.setTextColor(cc.color(0, 0, 0));
            //         text2.setAnchorPoint(0, 0.5)
            //         text2.setString('距离过近');
            //         $('root', scene.node).addChild(text2);
            //         text2.setPosition(text.getPositionX() + text.getContentSize().width / 2, text.getPositionY());
            //     }
            // }
            // TouchUtils.setOnclickListener($('root.fake_root', scene.node), function () {
            //     scene.node.removeFromParent(true);
            // });
        },
        ctor: function (_data, _isReplay) {
            this._super();

            this.curPaiArr = [];
            this.prePaiArr = [];
            var paibeiid = cc.sys.localStorage.getItem('paibeiid') || 0;
            this.changePaibei(paibeiid);

            clearVars();

            var that = this;
            forRows = function (cb) {
                if (playerNum == 4 || playerNum == 2)
                    cb.call(that, 0);
                if (playerNum != 2)
                    cb.call(that, 1);
                cb.call(that, 2);
                if (playerNum != 2)
                    cb.call(that, 3);
            };


            data = _data;
            isReconnect = !!_data;
            isReplay = !!_isReplay;

            network.stop();

            loadCCSTo(res.MaScene_KWX, this, "Scene");

            var sceneid = cc.sys.localStorage.getItem('sceneid') || 0;
            this.changeBg(sceneid);

            // if (!cc.sys.isNative) this.initTestFapai();

            return true;
        },

        // initTestFapai: function () {
        //     var that = this;
        //     var test = new cc.Sprite('res/mainScene/btn_wyfk.png');
        //     test.setPosition(cc.p(500, 700));
        //     that.addChild(test);
        //     TouchUtils.setOnclickListener(test, function () {
        //         that.addChild(new testFaPaiLayer());
        //     });
        // },

        changeBg: function (sceneid) {
            // if (sceneid <= 1) {
            //     $('bg').setTexture('res/table/table_back' + sceneid + '.jpg');
            // } else {
            //     // $('bg').setTexture('res/table/table_back' + sceneid + '.png');
            //     cc.sys.localStorage.setItem('sceneid', 0);
            //     $('bg').setTexture('res/table/table_back0.jpg');
            // }

        },
        changePaibei: function (paibeiid) {
            cc.spriteFrameCache.removeSpriteFramesFromFile('res/pai.plist');
            //cc.spriteFrameCache.removeSpriteFramesFromFile('res/pai_p.plist');
            cc.spriteFrameCache.removeSpriteFramesFromFile('res/pai_y.plist');
            cc.spriteFrameCache.addSpriteFrames(res['pai' + paibeiid + 'plist']);
        },
        startSignal: function () {
            var that = this;
            var interval = null;
            var lastDealy = -1;
            var func = function () {
                if (!that || !cc.sys.isObjectValid(that))
                    return clearInterval(interval);
                var delay = network.getLastPingInterval();
                if (delay == lastDealy)
                    return;
                //console.log('delay ' + delay);
                lastDealy = delay;
                if (delay < 200) $('signal').setTexture(res.signal3);
                else if (delay < 600) $('signal').setTexture(res.signal2);
                else $('signal').setTexture(res.signal1);
            };
            func();
            interval = setInterval(func, 200);
        },
        startTime: function () {
            var interval = null;
            var flag = true;
            var lbTime = $('lb_time');
            // if (isReplay)
            //     return;
            var updTime = function () {
                if (getNativeVersion() > '1.4.0') {
                    //显示电池电量
                    var battery = $('battery');
                    if (cc.sys.isObjectValid(battery)) {
                        var level = DeviceUtils.getBatteryLevel();
                        if (cc.sys.isObjectValid(battery)) {
                            if (level > 80) {
                                battery.setTexture(BatteryTextures["battery5"]);
                            } else if (level > 60) {
                                battery.setTexture(BatteryTextures["battery4"]);
                            } else if (level > 40) {
                                battery.setTexture(BatteryTextures["battery3"]);
                            } else if (level > 20) {
                                battery.setTexture(BatteryTextures["battery2"]);
                            } else {
                                battery.setTexture(BatteryTextures["battery1"]);
                            }
                        }
                    }
                }
                var date = new Date();
                var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
                var hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
                if (cc.sys.isObjectValid(lbTime))
                    lbTime.setString(hours + (flag ? ':' : ' ') + minutes);
                else if (interval)
                    clearInterval(interval);
                flag = !flag;
            };
            updTime();
            interval = setInterval(updTime, 1000);
        },
        isMyTurn: function () {
            return turnRow == 2;
        },
        getTurn: function () {
            for (var i = 0; i < 4; i++) {
                var node = $('timer.' + i);
                if (node.isVisible())
                    return (i + $('timer').getUserData().delta) % 4;
            }
            return -1;
        },
        throwTurnByUid: function (uid) {
            this.throwTurn(uid2position[uid]);
        },
        throwTurn: function (row) {
            turnRow = row;

            $('timer').setVisible(true);
            $('timer2').setVisible(true);


            // var arrow = $('timer.arrow');
            // // arrow.setTexture('res/table/t' + row + '.png');
            //
            // arrow.setRotation(row * +90 -90);
            var arrow = null;
            for (var j = 0; j < 4; j++) {
                if (j == row) {
                    arrow = $('timer.arrow' + j);
                    $('timer.txt' + j).setTextColor(cc.color(0, 0, 0));
                    $('timer.arrow' + j).setVisible(true);
                }
                else {
                    $('timer.txt' + j).setTextColor(cc.color(202, 202, 202));
                    $('timer.arrow' + j).setVisible(false);
                }
            }

            if (arrow) {
                if (arrow.getNumberOfRunningActions() == 0)
                    arrow.runAction(new cc.RepeatForever(cc.sequence(cc.fadeTo(0.5, 168), cc.fadeTo(0.5, 255))));
            }

            if (!afterLianging) {
                this.checkMyPaiColor4KWX();
            }

            if (row == 2)
                this.upPai(2, -1);
            this.hideTip();
        },
        setPai: function (row, idx, val, isLittle, isStand, isVisible) {
            var pai = this.getPai(row, idx);

            // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU || mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) {
            //     var lb = pai.getChildByName('lb');
            //     if (row == 2 && (val == laiziPaiId || val == laizipiPaiAId || val == laizipiPaiBId || val == 32 || mapId == MAP_ID.WUHAN_KAIKOU && val == 33)) {
            //         var texture = null;
            //         if (val == laiziPaiId) texture = lb_lai;
            //         if (val == laizipiPaiAId) {
            //             texture = lb_pi;
            //             if (mapId == MAP_ID.XIANTAO) {
            //                 texture = lb_gen;
            //             }
            //         }
            //         if (val == laizipiPaiBId) texture = lb_pi;
            //         if (val == 32) texture = lb_gang;
            //         if (mapId == MAP_ID.WUHAN_KAIKOU && val == 33) texture = lb_gang;
            //         if (!lb) {
            //             lb = new cc.Sprite('res/table/lb_gang.png');
            //             lb.setTexture(texture);
            //             lb.setName('lb');
            //             pai.addChild(lb);
            //             lb.setPosition(16, 16.5);
            //         }
            //         else
            //             lb.setTexture(texture);
            //         lb.setVisible(true);
            //     }
            //     else if (lb) {
            //         lb.setVisible(false);
            //     }
            // }

            var userData = pai.getUserData();
            var paiName = getPaiNameByRowAndId(row, val, isLittle, val > 0 ? false : (isReplay || roomState == ROOM_STATE_ENDED ? false : isStand));
            userData.pai = val;
            setSpriteFrameByName(pai, paiName, 'pai');
            if (!_.isUndefined(isVisible)) {
                if (isVisible)
                    pai.setVisible(true);
                else
                    pai.setVisible(false);
            }
            return pai;
        },
        getPai: function () {
            var cache = {};
            return function (row, id) {
                cache[row] = cache[row] || {};
                if (cache[row][id])
                    return cache[row][id];
                var node = $('row' + row + '.a' + id);
                if (!node) {
                    var a0 = $('row' + row + '.a0');
                    node = duplicateSprite(a0, true);
                    if (row == 0 || row == 2) node.setPositionX(posConf.paiADistance[row] * id + a0.getPositionX());
                    if (row == 1 || row == 3) node.setPositionY(posConf.paiADistance[row] * id + a0.getPositionY());
                    node.setName("a" + id);
                    a0.getParent().addChild(node, (row == 1 ? -id : 0));
                }
                var userData = node.getUserData();
                if (!userData)
                    userData = {};
                userData = {};
                userData.idx = id;
                node.setUserData(userData);
                cache[row][id] = node;
                return node;
            }
        },
        getPaiId: function (row, id) {
            var userData = this.getPai(row, id).getUserData();
            return userData.pai;
        },
        setPaiFrom: function (pai, row, formId) {
            if (pai && cc.sys.isObjectValid(pai) && pai.isVisible() && formId) {
                var from = posConf.gPaiPos[row][uid2position[formId]];
                if (from == undefined) {
                    from = 3;
                }
                var texture = res['narrow_' + from];
                if (texture) {
                    var narrow = pai.getChildByName('narrow');
                    if (narrow) {
                        narrow.setTexture(texture);
                    } else {
                        narrow = new cc.Sprite(texture);
                        pai.addChild(narrow);
                        narrow.setName('narrow');
                    }
                    // narrow.setScale(1.5);
                    narrow.runAction(cc.rotateTo(0, posConf.huFromAngle[row]));
                    // narrow.runAction(cc.rotateTo(0, 270));
                    narrow.setPosition(posConf.fromPos[row]);
                }
            }
        },
        setGChi: function (row, j, paiId, oriPaiId, fromId) {
            var a = 0, b = 0, c = 0;
            if (_.isArray(paiId)) {
                a = paiId[0];
                b = paiId[1];
                c = paiId[2];
            }
            else {
                if (paiId - 1 == oriPaiId) {
                    a = paiId;
                    b = paiId - 1;
                    c = paiId + 1;
                }
                if (paiId == oriPaiId) {
                    a = paiId - 1;
                    b = paiId;
                    c = paiId + 1;
                }
                if (paiId + 1 == oriPaiId) {
                    a = paiId - 1;
                    b = paiId + 1;
                    c = paiId;
                }
            }
            this.setGPai(row, j, 0, a);
            this.setGPai(row, j, 1, b);
            this.setGPai(row, j, 2, c);
            $('row' + row + '.g' + j + '.b' + 3).setVisible(false);
            $('row' + row + '.g' + j).setVisible(true);
            this.setPaiFrom($('row' + row + '.g' + j + '.b' + 0), row, fromId);
        },
        setGPai: function (row, g, idx, val) {
            var pai = this.getGPai(row, g, idx);
            var userData = pai.getUserData();
            var paiName = getPaiNameByRowAndId(row, val, true);
            userData.pai = val;
            setSpriteFrameByName(pai, paiName, 'pai');
        },
        setGPeng: function (row, j, paiId, fromId) {
            for (var k = 0; k < 3; k++)
                this.setGPai(row, j, k, paiId);
            $('row' + row + '.g' + j + '.b' + 3).setVisible(false);
            $('row' + row + '.g' + j).setVisible(true);
            this.setPaiFrom($('row' + row + '.g' + j + '.b' + 0), row, fromId);
        },
        setGHide: function (row, j) {
            for (var k = 0; k < 3; k++)
                this.setGPai(row, j, k, 0);
            $('row' + row + '.g' + j + '.b' + 3).setVisible(false);
            $('row' + row + '.g' + j).setVisible(true);
        },
        setGGang: function (row, j, upPaiId, downPaiId, fromId) {
            this.setGPai(row, j, 3, upPaiId);
            $('row' + row + '.g' + j + '.b' + 3).setVisible(true);
            for (var k = 0; k < 3; k++)
                this.setGPai(row, j, k, downPaiId);
            $('row' + row + '.g' + j).setVisible(true);

            // if (mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) {
            //     this.getGPai(row, j, 3).setOpacity(upPaiId == laizipiPaiAId ? 180 : 255);
            // }
            this.setPaiFrom($('row' + row + '.g' + j + '.b' + 0), row, fromId);
        },
        setGJiaGang: function (row, paiId, fromId) {
            for (var j = 0; j < 4; j++)
                if ($('row' + row + '.g' + j).isVisible() &&
                    this.getGPaiId(row, j, 0) == paiId &&
                    this.getGPaiId(row, j, 0) == this.getGPaiId(row, j, 1) &&
                    this.getGPaiId(row, j, 1) == this.getGPaiId(row, j, 2)) {
                    this.setGPai(row, j, 3, paiId);
                    this.getGPai(row, j, 3).setVisible(true);
                    break;
                }
            this.setPaiFrom($('row' + row + '.g' + j + '.b' + 0), row, fromId);
        },
        getGPai: function () {
            var cache = {};
            return function (row, g, id) {
                cache[row] = cache[row] || {};
                cache[row][g] = cache[row][g] || {};
                if (cache[row][g][id])
                    return cache[row][g][id];
                var group0 = $('row' + row + '.g' + 0);
                var groupNode = $('row' + row + '.g' + g);
                if (!groupNode) {
                    groupNode = duplicateLayout(group0);
                    if (row == 0 || row == 2) groupNode.setPositionX(group0.getPositionX() + posConf.groupWidth[row] * g + posConf.paiADistance[row] * g);
                    if (row == 1 || row == 3) groupNode.setPositionY(group0.getPositionY() + posConf.groupHeight[row] * g + posConf.paiADistance[row] * g);
                    groupNode.setName("g" + g);
                    groupNode.setVisible(false);
                    group0.getParent().addChild(groupNode);
                }
                var node = $('row' + row + '.g' + g + '.b' + id);
                cache[row][g][id] = node;
                return node;
            }
        },
        getGPaiId: function (row, g, id) {
            var userData = $('row' + row + '.g' + g + '.b' + id).getUserData();
            return userData.pai;
        },
        filterMyPai: function (row, idx, val) {
            var pai = this.getPai(row, idx);
            var userData = pai.getUserData();
            if (val == -1) {
                userData.isLiang = true;
                Filter.grayScale(pai);
            }
            if (val == 0 && !isReplay) {
                userData.isLiang = false;
                Filter.grayMask(pai);
            }
            if (val == 1) {
                userData.isLiang = true;
                Filter.remove(pai);
            }
        },
        checkMyPaiColor4KWX: function () {
            var row = 2;
            var paiArr = this.getPaiArr();
            var pai13 = this.getPai(2, 13);
            var pai13Id = pai13.getUserData().pai;

            var hupaiArr = [];
            for (var k in hupaiMap)
                hupaiArr = _.union(hupaiArr, hupaiMap[k]);

            _.pull(paiArr, 0);
            _.pull(hupaiArr, 0);

            var isAllLiang = _.every(paiArr, function (k) {
                return hupaiArr.indexOf(k) >= 0;
            });

            var dimArr = _.intersection(hupaiArr, paiArr);
            for (var j = 0; j < paiArr.length; j++) {
                var paiId = paiArr[j];
                this.filterMyPai(row, j, !isAllLiang && (turnRow != 2 || dimArr.indexOf(paiId) >= 0) ? 0 : 1);
            }
            if (pai13Id)
                this.filterMyPai(row, 13, !isAllLiang && (turnRow != 2 || dimArr.indexOf(pai13Id) >= 0) ? 0 : 1);
        },
        checkPaiAmount: function () {
            if (cc.sys.isNative)
                return;
            var amount = 0;
            var row = 2;
            for (var j = 0; j < 4; j++) {
                var g = $('row' + row + '.g' + j);
                if (!g || !$('row' + row + '.g' + j).isVisible())
                    break;
                else
                    amount += 3;
            }
            for (var j = 0; j < 14; j++)
                if (this.getPai(row, j).isVisible())
                    amount += 1;
            if ((amount < 13 || amount > 14) && (!isAutoSendPai)) {
                alert("你的牌数量可能不对: " + amount + ", 数一下");
            }

        },
        recalcPos: function (row) {
            var g0 = $('row' + row + '.g' + 0);
            var g0b0pos = getPositionRelativeToParent(this.getGPai(row, 0, 0), 2);
            if (row == 1) g0.setLocalZOrder(10);
            if (row == 3) g0.setLocalZOrder(-10);
            for (var i = 1; i < 4; i++) {
                var g = $('row' + row + '.g' + i);
                if (g && g.isVisible()) {
                    if (row == 0 || row == 2)
                        g.setPositionX(g0.getPositionX() + (posConf.groupWidth[row] * i + posConf.groupDistance[row] * i) * (row == 2 ? 1 : -1));
                    if (row == 1 || row == 3) {
                        g.setPositionY(g0.getPositionY() + (posConf.groupHeight[row] * i + posConf.groupDistance[row] * i) * (row == 1 ? 1 : -1));
                        g.setLocalZOrder((row == 1 ? 10 - i : i - 10));
                    }
                }
                else
                    break;
            }
            var k = i;
            var m = (k > 1 || g0.isVisible() ? 1 : 0);

            var a0 = this.getPai(row, 0);
            var to = 0;
            var p = (row == 1 || row == 2 ? 1 : -1);
            if (row == 0 || row == 2) to = !m ? posConf.paiA0PosBak[row].x : g0b0pos.x + (posConf.groupWidth[row] * k + posConf.groupDistance[row] * k + posConf.groupToFirstPaiDistance[row]) * p;
            if (row == 1 || row == 3) to = !m ? posConf.paiA0PosBak[row].y : g0b0pos.y + (posConf.groupHeight[row] * k + posConf.groupDistance[row] * k + posConf.groupToFirstPaiDistance[row]) * p;
            if (row == 0 || row == 2) a0.setPositionX(to);
            if (row == 1 || row == 3) a0.setPositionY(to);
            for (var i = 1; i < 13; i++) {
                var a = this.getPai(row, i);
                var userData = a.getUserData();
                if (row == 0) a.setPosition(a0.getPositionX() + i * posConf.paiADistance[row] + (a.getUserData().pai > 0) * i * posConf.paiALiangDistance[row], a0.getPositionY());
                if (row == 2) {
                    a.setPositionX(a0.getPositionX() + i * posConf.paiADistance[row] + (a.getUserData().pai > 0) * i * posConf.paiALiangDistance[row]);
                    if (!userData.isUpping && !userData.isDowning)
                        a.setPositionY(userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
                    // if(cardSprite.getChildByName('hucardSprite')){
                    //     cardSprite.getChildByName('hucardSprite').setVisible(false);
                    // }
                }
                if (row == 1 || row == 3) a.setPosition(a0.getPositionX(), a0.getPositionY() + i * posConf.paiADistance[row] + (a.getUserData().pai > 0) * i * posConf.paiALiangDistance[row]);
            }

            // recalc pai 13 position
            for (var i = 12; i >= 0; i--) {
                var pai = this.getPai(row, i);
                if (pai && pai.isVisible()) {
                    var userData = pai.getUserData();
                    var p = (row == 1 || row == 2 ? 1 : -1);
                    if (row == 0) this.getPai(row, 13).setPosition(pai.getPositionX() + posConf.paiADistance[row] + posConf.paiMopaiDistance[row] * p, a0.getPositionY());
                    if (row == 2) {
                        this.getPai(row, 13).setPositionX(pai.getPositionX() + posConf.paiADistance[row] + posConf.paiMopaiDistance[row] * p);
                        if (!userData.isUpping && !userData.isDowning)
                            a.setPositionY(userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
                    }
                    if (row == 1 || row == 3) this.getPai(row, 13).setPosition(a0.getPositionX(), pai.getPositionY() + posConf.paiADistance[row] + posConf.paiMopaiDistance[row] * p);
                    break;
                }
            }

            posConf.paiPos[row] = [];
            for (var i = 0; i < 14; i++) {
                posConf.paiPos[row].push(this.getPai(row, i).getPosition());
            }
            for (var i = 14; i < 18; i++) {
                var pai = $('row' + row + '.a' + i);
                if (pai)
                    pai.setVisible(false);
            }
        },
        hidePai: function (row, id) {
            this.getPai(row, id).setVisible(false);
        },
        getPaiArr: function () {
            var arr = [];
            for (var j = 0; j < 14; j++) {
                var pai = this.getPai(2, j);
                var userData = pai.getUserData();
                if (userData.pai > 0)
                    arr.push(userData.pai);
            }
            return arr;
        },
        addUsedPai: function () {
            var cache = {};
            return function (row, val) {
                cache[row] = cache[row] || {};
                for (var idx = 0; idx < 40; idx++) {
                    // 8: idx + parseInt(idx / 8) * 2
                    // 9: idx + parseInt(idx / 9)
                    var j = row == 1 || row == 3 ? idx + parseInt(idx / 9) : idx;
                    var pai = cache[row][j] || $('row' + row + '.c0.b' + j);
                    if (!pai) {
                        var k = parseInt(j / 10) * 10;
                        var b = $('row' + row + '.c0.b' + k);
                        if (!b) {
                            var b0 = $('row' + row + '.c0.b0');
                            var b10 = $('row' + row + '.c0.b10');
                            b = duplicateSprite(b0);
                            b.setName('b' + k);
                            if (row == 0) b.setPositionY(parseInt(j / 10) * (b10.getPositionY() - b0.getPositionY()) + b0.getPositionY());
                            if (row == 1) b.setPositionX(parseInt(j / 10) * (b10.getPositionX() - b0.getPositionX()) + b0.getPositionX());
                            if (row == 2) b.setPositionY(parseInt(j / 10) * (b10.getPositionY() - b0.getPositionY()) + b0.getPositionY());
                            if (row == 3) b.setPositionX(parseInt(j / 10) * (b10.getPositionX() - b0.getPositionX()) + b0.getPositionX());
                            b0.getParent().addChild(b);
                            if (row == 2)
                                b.setLocalZOrder(k * -1);
                            pai = b;
                            pai.setVisible(false);
                        }
                        if (!pai) {
                            pai = duplicateSprite(b);
                            if (row == 0 || row == 2) pai.setPositionX(posConf.paiUsedDistance[row] * (j - k) + b.getPositionX());
                            if (row == 1 || row == 3) pai.setPositionY(posConf.paiUsedDistance[row] * (j - k) + b.getPositionY());
                            pai.setName("b" + j);
                            pai.setVisible(false);
                            b.getParent().addChild(pai, j * posConf.paiUsedZOrder[row][k]);
                            cache[row][j] = pai;
                        }
                    }

                    pai.setUserData({idx: j, pai: val});

                    if (!pai.isVisible()) {
                        //var userData = pai.getUserData();
                        var paiName = getPaiNameByRowAndId(row, val, true);
                        //userData.pai = val;
                        setSpriteFrameByName(pai, paiName, 'pai');
                        pai.setVisible(true);

                        // if (mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) {
                        //     if (val == laiziPaiId)
                        //         Filter.grayRed(pai);
                        //     else
                        //         Filter.remove(pai);
                        // }

                        return pai;
                    }
                }
            }
        },
        removeOneTopUsedPai: function (row) {
            for (var j = 50; j >= 0; j--) {
                var pai = $('row' + row + '.c0.b' + j);
                if (pai && pai.isVisible()) {
                    var userData = pai.getUserData();
                    userData.pai = 0;
                    pai.setVisible(false);
                    break;
                }
            }
            this.hideArrow();
        },
        getRoomState: function () {
            return roomState;
        },
        setRoomState: function (state) {
            cc.log('2222222222222222222222');
            var arr = decodeURIComponent(gameData.wanfaDesp).split(',');
            if (arr.length >= 1)
                arr = arr.slice(1);
            var wanfaLogo = "";
            if (arr.length >= 1) {
                wanfaLogo = arr[0];
                if (wanfaLogo != "开口翻" && wanfaLogo != "口口翻") {
                    arr = arr.slice(1);
                }
            }
            var wanfaStr = arr.join(",");
            if (state == ROOM_STATE_CREATED) {
                $('btn_control_btns').setVisible(false);
                //TODO 这里差一个查看定位按钮
                // $('lockLocation').setVisible(!window.inReview);
                this.hideControlBtns();
                $('signal').setVisible(false);
                $('setting').setVisible(false);

                //TODO 这里差一个托管按钮
                // $('btn_auto').setVisible(false);
                $('chat').setVisible(false);
                $('timer').setVisible(false);
                $('timer2').setVisible(false);
                $('btn_invite').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid && !gameData.jinbi);
                //$('btn_qq').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid && !gameData.jinbi);
                $('btn_copy').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid && !gameData.jinbi);
                $('btn_fanhui').setVisible(gameData.uid != gameData.ownerUid || gameData.jinbi);
                $('btn_jiesan').setVisible(gameData.uid == gameData.ownerUid && !gameData.jinbi);

                cc.log('roomClubId is======================:',gameData.roomClubId);
                cc.log('uid is=======================:',gameData.uid);

                //TODO 这里差一个退出房间按钮
                // $('btn_leave').setVisible(gameData.roomClubId&&gameData.ownerUid==gameData.uid);



                $('btn_zhunbei').setVisible(gameData.jinbi);

                //TODO 这里差一个换桌按钮
                // $('btn_huanzhuo').setVisible(gameData.jinbi);
                $('btn_mic').setVisible(!window.inReview);
                $('lb_roomid').setString(gameData.roomId);
                $('lb_wanfa').setString(wanfaStr);
                this.showWanfaLogo(wanfaLogo);
                $('lb_roomid_').setVisible(!gameData.jinbi);
                $('lb_roomid').setVisible(!gameData.jinbi);
                $('timer2.Text_4').setVisible(!gameData.jinbi);
                $('timer2.Text_5').setVisible(!gameData.jinbi);
                $('timer2.Text_6').setVisible(!gameData.jinbi);
                $('row0').setVisible(false);
                $('row1').setVisible(false);
                $('row2').setVisible(false);
                $('row3').setVisible(false);
                //$('btn_info').setVisible(false);
                if ($('btn_queding')) $('btn_queding').setVisible(false);
                if ($('btn_quxiao')) $('btn_quxiao').setVisible(false);
                if ($('btn_xuanzewancheng')) $('btn_xuanzewancheng').setVisible(false);
                if ($('piao_bar')) $('piao_bar').setVisible(false);
                for (var i = 0; i < 4; i++) {
                    $('info' + i).setPosition($('info_n' + i).getPosition());
                }
                this.hideArrow();
                disabledChuPaiIdMap = {};

                lianging = false;
                afterLianging = false;
            }
            if (state == ROOM_STATE_ONGOING) {
                var setting = $('setting');
                if (!setting || !cc.sys.isObjectValid(setting))
                    return network.disconnect();
                // setting.setVisible(true);
                $('lockLocation').setVisible(false);
                $('btn_auto').setVisible(gameData.jinbi);
                $('signal').setVisible(!isReplay);
                $('btn_control_btns').setVisible(!isReplay);
                // $('chat').setVisible(true);
                $('timer').setVisible(true);
                $('timer2').setVisible(true);
                $('btn_invite').setVisible(false);
                //$('btn_qq').setVisible(false);
                //$('btn_liaobei').setVisible(false);
                $('btn_copy').setVisible(false);
                $('btn_leave').setVisible(false);
                $('btn_fanhui').setVisible(false);
                $('btn_huanzhuo').setVisible(false);
                $('btn_jiesan').setVisible(false);
                $('btn_zhunbei').setVisible(false);
                $('btn_yxks').setVisible(false);
                $('btn_mic').setVisible(!window.inReview);
                $('lb_roomid').setString(gameData.roomId);
                $('lb_wanfa').setString(wanfaStr);
                this.showWanfaLogo(wanfaLogo);
                $('row0.c0').setVisible(true);
                if ($('btn_queding')) $('btn_queding').setVisible(false);
                if ($('btn_quxiao')) $('btn_quxiao').setVisible(false);
                if ($('btn_xuanzewancheng')) $('btn_xuanzewancheng').setVisible(false);
                //$('lb_roomid').setVisible(false);
                $('row0').setVisible(true);
                $('row1').setVisible(true);
                $('row2').setVisible(true);
                $('row3').setVisible(true);

                $('timer2.Text_5').setString(gameData.leftRound);
                $('timer2.Text_4').setVisible(!gameData.jinbi);
                $('timer2.Text_5').setVisible(!gameData.jinbi);
                $('timer2.Text_6').setVisible(!gameData.jinbi);

                $('row0.mid').removeAllChildren();
                $('row1.mid').removeAllChildren();
                $('row2.mid').removeAllChildren();
                $('row3.mid').removeAllChildren();

                $('row_top_info0').removeAllChildren();
                $('row_top_info1').removeAllChildren();
                $('row_top_info2').removeAllChildren();
                $('row_top_info3').removeAllChildren();


                for (var i = 0; i < 4; i++) {
                    if (roomState == ROOM_STATE_CREATED)
                        $('info' + i).runAction(cc.moveTo(0.5, posConf.headPosBak[i]));
                    else
                        $('info' + i).setPosition(posConf.headPosBak[i]);

                    $('info' + i + '.ok').setVisible(false);
                    $('info' + i + '.ti').setVisible(false);
                }

                if (isReplay) {
                    this.hideControlBtns();
                    $('setting').setVisible(false);
                    $('btn_auto').setVisible(false);
                    $('chat').setVisible(false);
                }

                // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
                //     for (var i = 0; i < 4; i++) {
                //         var lbBs = $('info' + i + '.lb_bs');
                //         lbBs && lbBs.setVisible(true);
                //     }
                // }
            }
            if (state == ROOM_STATE_ENDED) {
                $('timer').setVisible(false);
                $('timer2').setVisible(false);
                if ($('btn_queding')) $('btn_queding').setVisible(false);
                if ($('btn_quxiao')) $('btn_xuanzewancheng').setVisible(false);
                if ($('btn_xuanzewancheng')) $('btn_xuanzewancheng').setVisible(false);
                this.hideChiPengGangHu();
                this.hideArrow();
                disabledChuPaiIdMap = {};

                lianging = false;
                afterLianging = false;

                hideGangStep = 0;
                hideGangArr = [];
                hidedGangArr = [];
                hideGangChupaiArr = [];


                // network.recv({"code":4007,"data":{"room_id":gameData.roomId,"op":0,"uid":gameData.uid}});
            }
            roomState = state;
        },
        setDuiArr: function (row, duiArr) {
            for (var j = 0; j < 4; j++) {
                var g = $('row' + row + '.g' + j);
                if (g && g.isVisible())
                    g.setVisible(false);
            }
            for (var j = 0; j < duiArr.length; j++) {
                var dui = duiArr[j];
                if (dui.type == 1) this.setGChi(row, j, dui['pai_arr'], dui['from_uid']);
                if (dui.type == 2) this.setGPeng(row, j, dui['pai_arr'][0], dui['from_uid']);
                if (dui.type == 3) this.setGGang(row, j, dui['pai_arr'][0], dui['pai_arr'][0], dui['from_uid']);
                if (dui.type == 4) this.setGGang(row, j, dui['pai_arr'][0], 0, dui['from_uid']);
                if (dui.type == 5) this.setGHide(row, j);
            }
        },
        clearTable4StartGame: function (isInitPai, isReconnect, reconnectData) {
            var that = this;


            this.onPlayerEnterExit();
            if (isInitPai) {
                forRows(function (i) {
                    var a0 = $('row' + i + '.a0');
                    if (a0.getPosition().x != posConf.paiA0PosBak[i].x || a0.getPosition().y != posConf.paiA0PosBak[i].y) {
                        a0.setPosition(posConf.paiA0PosBak[i]);
                        for (var j = 1; j < 13; j++) {
                            var node = $('row' + i + '.a' + j);
                            if (i == 0 || i == 2) node.setPositionX(posConf.paiADistance[i] * j + a0.getPositionX());
                            if (i == 1 || i == 3) node.setPositionY(posConf.paiADistance[i] * j + a0.getPositionY());
                        }
                    }
                });
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        this.getPai(i, j).setVisible(false);
                    }
                    for (var k = 0; k < 4; k++) {
                        var g = $('row' + i + '.g' + k);
                        if (g)
                            g.setVisible(false);
                    }
                    for (var k = 0; k < 4; k++) {
                        this.getGPai(i, 0, k).setUserData({idx: k});
                    }
                    $('row' + i + '.c0.b0').setVisible(false);
                    $('row' + i + '.c0.b1').setVisible(false);
                    $('row' + i + '.c0.b10').setVisible(false);
                }
                forRows(function (i) {
                    for (var j = 0; j < 14; j++) {
                        this.getPai(i, j).setOpacity(0);
                    }
                    var c0 = $('row' + i + '.c0');
                    if (i == 0)
                        c0.setLocalZOrder(50);
                    for (var j = 0; j < 32; j++) {
                        var t = $('b' + j, c0);
                        if (t) {
                            t.setUserData({idx: j});
                            t.setVisible(false);
                        }
                    }
                });

                if (!hasInitPai) {
                    hasInitPai = true;
                    if (mapId == MAP_ID.KWX) {
                        // $('row1').setScale($('row1').getScale() * 1.1);
                        // $('row3').setScale($('row3').getScale() * 1.1);
                        // $('row1').setPositionX($('row1').getPositionX() - 22);
                        $('row1.c0').setPositionY($('row1.c0').getPositionY() + 30);
                        $('row3.c0').setPositionY($('row3.c0').getPositionY() + 30);
                    }
                    else if (gameData.appId == APP_ID_HB) {
                        // $('row0').setScale($('row0').getScale() * 1.1);
                        // $('row0').setPositionY($('row0').getPositionY() - 22);
                        // $('row0').setPositionX($('row0').getPositionX() + 8);
                        // $('row1').setScale($('row1').getScale() * 1.1);
                        // $('row3').setScale($('row3').getScale() * 1.1);
                        // $('row1').setPositionX($('row1').getPositionX() - 22);
                        // $('row1').setPositionY($('row1').getPositionY() - 12);
                        // $('row3').setPositionY($('row3').getPositionY() + 14);
                    }
                }
                that.setHuTipVisible(false);
            }

            $('cpghg').setVisible(false);
            $('timer').setVisible(false);
            $('timer2').setVisible(false);
            //this.recalcPos(2);

            if (isReconnect) {
                hasChupai = reconnectData['has_chu'];
                that.setZhuang(uid2position[gameData.zhuangUid]);
                leftPaiCnt = reconnectData['left_pai_num'];
                $('timer2.Text_2').setString(leftPaiCnt);
                $('lb_roomid_').setVisible(!gameData.jinbi);
                $('lb_roomid').setVisible(!gameData.jinbi);
                var playerPaiArr = reconnectData['player_pai'];

                for (var i = 0; i < playerPaiArr.length; i++) {
                    var playerPai = playerPaiArr[i];
                    var isOffline = !!playerPai['is_offline'];
                    if (isOffline)
                        this.playerOnloneStatusChange(uid2position[playerPai.uid], isOffline);
                    var row = uid2position[playerPai.uid];
                    if (typeof row === 'undefined')
                        row = 2;
                    if (row != 2
                        && roomState == ROOM_STATE_ONGOING
                        && playerPai['pai_arr'].length == 0) {
                        for (var j = 0; j < playerPai['cur_pai_num']; j++)
                            playerPai['pai_arr'].push(0);
                    }
                    if (row == 2 && playerPaiArr[i]['is_ting']) {
                        afterLianging = true;
                        hideGangStep = 3;
                    }
                    var tg = playerPaiArr[i]['is_tg'];
                    if (row == 2 && gameData.jinbi) {
                        $('auto_bg').setVisible(tg);
                        $('btn_auto').setVisible(!tg);
                    }
                    // $('info' + row + '.tuo').setVisible(tg);
                    if ($('info' + row + '.liang'))
                        $('info' + row + '.liang').setVisible(playerPaiArr[i]['is_ting']);

                    // if (row == 2) {
                    //     playerPai['pai_arr'].splice(0, 3);
                    //     for (var k = 0, p = 0; k < playerPai['pai_arr'].length; k++, p++) {
                    //         playerPai['pai_arr'][k] = [25][p % 1];
                    //     }
                    //     playerPai['dui_arr'].push({"pai_arr":[10,10,10],"type":2,"from_uid":0});
                    // }

                    that.setPaiArrOfRow(row, playerPai['pai_arr'], (row != 2), (row != 2), playerPai['liang_pai_arr']);
                    var liangPaiArr = playerPai['liang_pai_arr'] || [];
                    for (var j = 0; j < liangPaiArr.length; j++)
                        disabledChuPaiIdMap[liangPaiArr[j]] = true;
                    //playerPai['pai_arr'].sort(compareTwoNumbers);
                    //var paiArr = playerPai['pai_arr'];
                    //for (var j = 0; j < paiArr.length; j++)
                    //    this.setPai(row, j, paiArr[j], (row != 2), (row != 2), true).setOpacity(255);
                    //for (; j < 14; j++)
                    //    this.setPai(row, j, 0, (row != 2), (row != 2)).setVisible(false);
                    var usedPaiArr = playerPaiArr[i]['used_pai_arr'];
                    for (var j = 0; j < usedPaiArr.length; j++)
                        this.addUsedPai(row, usedPaiArr[j]);
                    var duiArr = playerPaiArr[i]['dui_arr'];
                    this.setDuiArr(row, duiArr);

                    // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
                    //     $('info' + row + '.lb_bs').setString('x' + playerPai['multiple']);
                    //     $('info' + row + '.lb_bs').setVisible(true);
                    // }
                    var tingArr = playerPai['ting_arr'] || [];
                    if (tingArr.length) {
                        hupaiMap[row] = tingArr;
                        that.showLiangHuTip(row, tingArr);
                    }

                    var isZixuanpiao = !!reconnectData['is_zixuanpiao'];
                    var piao = playerPai['piao'] || 0;
                    var lbBs = $('info' + row + '.lb_bs');
                    var spBs = $('info' + row + '.sp_bs');
                    if (lbBs && spBs) {
                        lbBs.setVisible(isZixuanpiao);
                        spBs.setVisible(isZixuanpiao);
                        if (piao == 0) {
                            lbBs.setString('不漂');
                            spBs.setTexture(cc.textureCache.addImage('res/submodules/majiang/image/MaScene_KWX/word_jiapiao.png'));
                        } else {
                            lbBs.setString('加' + piao + '漂');
                            spBs.setTexture(cc.textureCache.addImage(res.word_bujiapiao));
                        }
                    }
                }

                forRows(function (i) {
                    this.recalcPos(i);
                });

                if (roomState == ROOM_STATE_ONGOING) {
                    this.throwTurn(uid2position[reconnectData['turn_uid']]);
                    this.enableChuPai();
                }
                else if (roomState == ROOM_STATE_ENDED) {
                    for (var i = 0; i < playerPaiArr.length; i++) {
                        var playerPai = playerPaiArr[i];
                        var isReady = !!playerPai['is_ready'];
                        if (isReady)
                            that.setReady(playerPai['uid']);
                    }
                }

                var isSelectPiaoFinished = (_.isUndefined(reconnectData['spf']) ? true : reconnectData['spf']);
                if (!isSelectPiaoFinished) {
                    forRows(function (i) {
                        for (var j = 0; j < 14; j++)
                            that.getPai(i, j).setVisible(false);
                    });
                }
            }
            else if (isInitPai) {
                forRows(function (i) {
                    this.recalcPos(i);
                });
            }
            gameData.huTipData = null;
            gameData.data4004 = null;
            hideTing = [];
        },

        putUsedPaiToTable: function (row, idx, paiId, drag) {


            var that = this;
            var duration = 0.25;
            var delayDuration = 0.15;

            var pai = this.getPai(row, idx);
            var midNode = $('row' + row + '.mid');
            var moveToMidPos = midNode.getPosition();
            var usedPai = this.addUsedPai(row, paiId);
            usedPai.setOpacity(0);
            var moveToFinalPos = cc.p(
                usedPai.getPositionX() + usedPai.getParent().getPositionX(),
                usedPai.getPositionY() + usedPai.getParent().getPositionY()
            );

            that.playerOnloneStatusChange(row, false);

            var positionBak = pai.getPosition();
            var scaleBak = pai.getScaleX();

            var userData = pai.getUserData();
            moveToMidPos.y += UPPAI_Y;
            pai.setVisible(false);

            if (drag) {
                pai.stopAllActions();
                userData.isUp = false;
                userData.isDowning = false;
                userData.isUpping = false;
            }


            var _paiBg = new cc.Sprite(res.mjbg);
            _paiBg.setScale(CHUPAI_MID_NODE_SCALE_MAP[row] / midNode.getParent().getScaleX());
            _paiBg.setName('paiBg');
            _paiBg.setOpacity(188);
            midNode.addChild(_paiBg);

            var _pai = new cc.Sprite();
            _pai.setName('pai');
            midNode.addChild(_pai);

            var paiName = getPaiNameByRowAndId(2, paiId, false, false);
            setSpriteFrameByName(_pai, paiName, 'pai');
            _pai.setScale(CHUPAI_MID_NODE_SCALE_MAP[row] / midNode.getParent().getScaleX());
            _pai.setVisible(true);
            _paiBg.setVisible(true);

            var fangda = cc.sys.localStorage.getItem('fangda') == 1;
            if (fangda) {
                _pai.runAction(cc.sequence(cc.delayTime(delayDuration), cc.callFunc(function () {
                    _pai.removeFromParent(true);
                    _paiBg.removeFromParent(true);
                })));
            } else {
                _pai.removeFromParent(true);
                _paiBg.removeFromParent(true);
            }
            if (row == 2) {
                pai.setPosition(posConf.paiPos[2][idx]);
                pai.setScale(posConf.paiA0ScaleBak[row][0], posConf.paiA0ScaleBak[row][1]);
                that.upPai(row, -1);
                that.recalcPos(row);
                that.showArrow(usedPai, row);

                that.checkPaiAmount();
                that.hideChiPengGangHu();
                pai.setPositionY(posConf.downPaiPositionY);
            }
            else {
                pai.setPosition(positionBak);
                pai.setScale(scaleBak);

                that.recalcPos(row);
                that.showArrow(usedPai, row);
            }

            usedPai.runAction(cc.fadeIn(duration));
        },
        resetUpState: function () {
            for (var i = 0; i < 14; i++) {
                var pai = this.getPai(2, i);
                var userData = pai.getUserData();

                var isup = userData.isUp;
                if (isup) {
                    userData.isUp = false;
                }

            }
        },
        sendChuPai: function (row, idx, paiId, drag) {
            network.stop([3007, 3008, 4002, 4020]);
            network.send(4002, {room_id: gameData.roomId, pai_id: paiId, idx: idx});
            if (row == 2) {
                var that = this;

                hasChupai = true;
                that.peopleSend = true;//不是自动打牌
                that.putUsedPaiToTable(row, idx, paiId, drag);//牌桌上放牌
                var pindex = _.indexOf(this.curPaiArr, paiId);
                _.pullAt(this.curPaiArr, pindex);
                that.setPaiArrOfRow(row, this.curPaiArr, false, false, []);//先设置牌数组
            }
        },
        chuPai: function (row, idx, paiId, paiArr, liangPaiArr, noSound) {
            var that = this;
            if (liangStep == 2) {
                liangStep = 0;
                // network.start();
                that.downPai(row, idx);
                return;
            }
            if (row != 2 && !isReplay)
                idx = 13;

            this.playEffect('vCardOut');


            if (row != 2 || isReplay || (!that.peopleSend && row == 2)) {//自己 重播 或者自己自动发牌
                if (row == 2 && !isReplay) {
                    liangPaiArr = [];
                }
                that.putUsedPaiToTable(row, idx, paiId);
                that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), liangPaiArr);

            }
            if (row == 2) {
                that.peopleSend = false;
                that.checkPaiAmount();
                hasChupai = true;
            }

            network.start();
            // if ((mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) && paiId == laiziPaiId)
            //     return;
            if (!noSound)
                playEffect('vp' + paiId, position2sex[row]);
        },
        checkPaiPos: function (row) {
            for (var j = 0; j < 14; j++) {
                var pai = this.getPai(row, j);
                var userData = pai.getUserData();
                //pai.setPositionX(posConf.paiPos[2][j].x);
                //console.log(j + '  ' + userData.isUp);
                if (!userData.isUpping && !userData.isDowning)
                    pai.setPosition(posConf.paiPos[2][j].x, (userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY));
            }
        },
        upPai: function (row, idx) {
            var that = this;
            this.checkPaiPos(row);
            if (liangStep == 2 && idx >= 0) {
                var pai = that.getPai(row, idx);
                var userData = pai.getUserData();
                if (userData.isUp && !userData.isDowning) {
                    userData.isDowning = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                        , cc.callFunc(function () {
                            userData.isUp = false;
                            userData.isDowning = false;
                        })
                    ));
                }
                else if (!userData.isUpping) {
                    userData.isUpping = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                        , cc.callFunc(function () {
                            userData.isUp = true;
                            userData.isUpping = false;
                        })
                    ));
                }
                return;
            }
            for (var i = 0; i < 14; i++) {
                (function (j) {
                    var pai = that.getPai(row, j);
                    var userData = pai.getUserData();
                    if (idx == j && userData.isUp) {
                        that.sendChuPai(row, idx, userData.pai);
                        userData.isUp = false;
                    }
                    else if (idx == j && !userData.isUp && !userData.isUpping) {
                        userData.isUpping = true;
                        pai.runAction(cc.sequence(
                            cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                            , cc.callFunc(function () {
                                userData.isUp = true;
                                userData.isUpping = false;
                            })
                        ));
                    }
                    else if (idx != j && userData.isUp && !userData.isDowning) {
                        userData.isDowning = true;
                        pai.runAction(cc.sequence(
                            cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                            , cc.callFunc(function () {
                                userData.isUp = false;
                                userData.isDowning = false;
                            })
                        ));
                    }
                })(i);
            }
        },
        downPai: function (row, idx) {
            var that = this;
            this.checkPaiPos(row);
            var pai = that.getPai(row, idx);
            var userData = pai.getUserData();
            if (!userData.isUp || userData.isDowning)
                return;
            userData.isDowning = true;
            pai.runAction(cc.sequence(
                cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                , cc.callFunc(function () {
                    userData.isUp = false;
                    userData.isDowning = false;
                })
            ));
        },
        clearCurPaiIdx: null,
        enableChuPai: function () {
            if (enableChupaiCnt > 0)
                return;
            enableChupaiCnt++;

            var that = this;

            var curPaiIdx = -1;
            var beganTime, beganPosition;
            var isUp, paiIdx, paiId;
            var positionBak;
            var safeY;
            var toNodeDelta = {};
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {

                    if (hasChupai || !that.isMyTurn() || afterLianging || disableChupai || roomState != ROOM_STATE_ONGOING || isReplay)
                        return false;

                    if (that.sending) {
                        return false;
                    }
                    var pai, _curPaiIdx = -1;
                    for (var i = 0; i < 14; i++) {
                        pai = that.getPai(2, i);
                        var userData = pai.getUserData();
                        if (!pai.isVisible())
                            continue;
                        if (TouchUtils.isTouchMe(pai, touch, event, null)) {
                            _curPaiIdx = i;
                            break;
                        }
                    }
                    if ((curPaiIdx >= 0 && _curPaiIdx != curPaiIdx) || !(pai.getNumberOfRunningActions() == 0 || !pai.getUserData().isUpping && !pai.getUserData().isDowning)) {
                        var tPai = $('row2.a' + curPaiIdx);
                        var tPaiUserData = (tPai ? tPai.getUserData() : null);
                        if (tPai && tPaiUserData && !(tPaiUserData.isUpping || tPaiUserData.isUp)) {
                            curPaiIdx = -1;
                            beganPosition = null;
                        } else {
                            return false;
                        }

                    }

                    curPaiIdx = _curPaiIdx;

                    if (curPaiIdx >= 0) {
                        var userData = pai.getUserData();

                        if (/*hideGangStep == 1 && */!userData.isLiang) {
                            curPaiIdx = -1;
                            return;
                        }

                        if (hideGangStep == 1 && userData.isLiang) {
                            for (var i = 0; i < 4; i++) {
                                that.getGPai(2, i, 0);
                                var g = $('row' + 2 + '.g' + i);
                                if (g.isVisible() == false) {
                                    hideTing.push(i);
                                    var paiArr = that.getPaiArr();
                                    var cnt = 0;
                                    for (var k = 0; k < paiArr.length; k++)
                                        cnt += (paiArr[k] == userData.pai ? 1 : 0);
                                    if (cnt < 3)
                                        return;
                                    that.setGHide(2, i);
                                    g.setVisible(true);
                                    that.recalcPos(2);
                                    hidedGangArr.push(userData.pai);
                                    cnt = 0;
                                    _.remove(paiArr, function (n) {
                                        return n == userData.pai && cnt++ < 3;
                                    });
                                    that.setPaiArrOfRow(2, paiArr, false, false, hideGangArr, true);

                                    curPaiIdx = -1;
                                    beganPosition = null;

                                    break;
                                }
                            }
                            //userData.isClose = true;
                            if (gameData.huTipData) {
                                that.showTishiTip(gameData.huTipData);
                            }
                            return;
                        }
                        for (var k = 0; k < 14; k++) {
                            if (k == curPaiIdx)
                                continue;
                            var _pai = that.getPai(2, k);
                            var _userData = _pai.getUserData();
                            if (_userData.isUpping || _userData.isDowning ||
                                _pai.getNumberOfRunningActions() > 0)
                                return false;
                        }

                        playEffect('vCardClick');

                        beganTime = getCurrentTimeMills();

                        // back up
                        // userData.positionBak = pai.getPosition();
                        // userData.scaleBak = pai.getScaleX();

                        isUp = userData.isUp;
                        if (!isUp || liangStep == 2)
                            that.upPai(2, userData.idx);

                        if (userData.hucards) {
                            var jiaoSp = pai.getChildByName('hucardSprite');
                            if (jiaoSp && jiaoSp.isVisible())
                                that.HuCardTip(userData.hucards, pai.getPositionX(), true);
                        }

                        paiIdx = userData.idx;
                        paiId = userData.pai;
                        positionBak = _.clone(posConf.paiPos[2][curPaiIdx]);
                        positionBak.y = (true || isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
                        beganPosition = touch.getLocation();
                        safeY = pai.getBoundingBox().height;
                        var a = touch.getLocation();
                        var b = pai.convertToNodeSpace(touch.getLocation());
                        toNodeDelta.x = a.x - b.x;
                        toNodeDelta.y = a.y - b.y;
                    }

                    return curPaiIdx >= 0;
                },
                onTouchMoved: function (touch, event) {
                    if (curPaiIdx < 0)
                        return;

                    var pai = that.getPai(2, curPaiIdx);

                    var userData = pai.getUserData();

                    if (!userData.isLiang)
                        return;

                    if (beganPosition) {
                        var p = touch.getLocation();
                        p.x -= toNodeDelta.x;
                        p.y -= toNodeDelta.y;
                        if (p.y < safeY) {
                            if (pai.getNumberOfRunningActions() <= 0)
                                pai.setPosition(positionBak);
                            $('cpghg').setOpacity(255);
                            return;
                        }
                        p = pai.convertToNodeSpace(touch.getLocation());
                        p.x += pai.getPositionX() - pai.getBoundingBox().width / 2;
                        p.y += pai.getPositionY() - pai.getBoundingBox().height / 2;
                        //that.setPai(2, 15, userData.pai);
                        pai.setPosition(p);
                        $('cpghg').setOpacity(127);

                        //拖动自动出
                        var p = touch.getLocation();
                        var disy = p.y - beganPosition.y;
                        if (disy >= 100) {
                            p.x -= toNodeDelta.x;
                            p.y -= toNodeDelta.y;
                            var now = getCurrentTimeMills();
                            var isSend = (p.y < safeY && (isUp) && Math.abs(now - beganTime) < 168) || (p.y > safeY);
                            if (isSend) {
                                if (hideGangStep == 0) {
                                    that.sendChuPai(2, paiIdx, paiId, true);//拖拽
                                } else if (hideGangStep == 2) {
                                    network.send(4031, {
                                        room_id: gameData.roomId,
                                        uid: gameData.uid,
                                        hided_gang_arr: hidedGangArr,
                                        chu_pai_id: userData.pai,
                                        chu_pai_idx: userData.idx
                                    });

                                    //没走sendchupai在这里移除id
                                    that.peopleSend = true;
                                    var pindex = _.indexOf(that.curPaiArr, userData.pai);
                                    _.pullAt(that.curPaiArr, pindex);
                                    hasChupai = true;
                                    that.putUsedPaiToTable(2, userData.idx, userData.pai, true);//拖拽
                                    that.setPaiArrOfRow(2, that.curPaiArr, false, false, []);//先设置牌数组
                                }
                                that.setHuTipVisible(false);
                                clickTing = false;
                                that.hideTingQuxiao();
                                curPaiIdx = -1;
                                beganPosition = null;

                                that.sending = true;
                                that.scheduleOnce(function () {
                                    that.sending = false
                                }, 0.5);
                            }
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    that.HuCardTip(null, null, false);
                    if (curPaiIdx < 0)
                        return;

                    var pai = that.getPai(2, curPaiIdx);
                    var userData = pai.getUserData();

                    if (beganPosition) {

                        var p = touch.getLocation();
                        p.x -= toNodeDelta.x;
                        p.y -= toNodeDelta.y;
                        var now = getCurrentTimeMills();
                        var isSend = (p.y < safeY && (isUp) && Math.abs(now - beganTime) < 168) || (p.y > safeY);
                        if (isSend) {
                            if (hideGangStep == 0) {
                                that.sendChuPai(2, paiIdx, paiId, true);//拖拽
                            }
                            else if (hideGangStep == 2) {
                                network.send(4031, {
                                    room_id: gameData.roomId,
                                    uid: gameData.uid,
                                    hided_gang_arr: hidedGangArr,
                                    chu_pai_id: userData.pai,
                                    chu_pai_idx: userData.idx
                                });

                                //没走sendchupai在这里移除id
                                that.peopleSend = true;
                                var pindex = _.indexOf(that.curPaiArr, userData.pai);
                                _.pullAt(that.curPaiArr, pindex);
                                hasChupai = true;
                                that.putUsedPaiToTable(2, userData.idx, userData.pai, true);//拖拽
                                that.setPaiArrOfRow(2, that.curPaiArr, false, false, []);//先设置牌数组


                            }

                            that.sending = true;
                            that.scheduleOnce(function () {
                                that.sending = false
                            }, 0.5);
                            that.setHuTipVisible(false);
                            clickTing = false;
                            that.hideTingQuxiao();
                            curPaiIdx = -1;
                            beganPosition = null;
                        }
                        else {
                            that.checkPaiPos(2);
                            setTimeout(function () {
                                curPaiIdx = -1;
                                beganPosition = null;
                            }, parseInt(UPDOWNPAI_ANIM_DURATION * 100));
                        }
                    }
                    return false;
                }
            });
            that.clearHuCardTip();
            return cc.eventManager.addListener(chupaiListener, $("row2"));
        },
        countDown: function () {
            var that = this;
            var timer = null;
            return function (seconds) {
                if (isReplay) {
                    $('timer.sec').setString('');
                    return;
                }
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                $('timer.sec').setString(seconds);
                timer = setInterval(function () {
                    var sec = $('timer.sec');
                    if (!cc.sys.isObjectValid(sec)) {
                        if (timer)
                            clearInterval(timer);
                        return;
                    }
                    if (!sec) {
                        clearInterval(timer);
                        timer = null;
                        return;
                    }
                    if (seconds > 0) {
                        --seconds;
                        sec.setString(seconds < 10 ? "0" + seconds : seconds);
                    }
                    if (seconds == 0) {
                        if (turnRow == 2 && !hasChupai)
                            vibrate();
                        clearInterval(timer);
                    }
                }, 1000);
            }
        },
        closePai: function (paiId) {

        },
        setHuTipVisible: function (visible) {
            for (var i = 0; i < 14; i++) {
                var cardSprite = this.getPai(2, i);
                if (cardSprite.getChildByName('hucardSprite')) {
                    cardSprite.getChildByName('hucardSprite').stopAllActions();
                    cardSprite.getChildByName('hucardSprite').setVisible(visible);
                }
            }
        },
        clearHuCardTip: function () {
            for (var i = 0; i < 14; i++) {
                var pai = this.getPai(2, i);
                var userData = pai.getUserData();
                userData.hucards = null;
            }
        },
        HuCardTip: function (showdata, posx, isVisible) {
            var hupaitip = maLayer.getChildByName('hupaitip');
            if (!isVisible && hupaitip) {
                hupaitip.setVisible(isVisible);
                return;
            }
            if (showdata == null) {
                return;
            }
            var tiplength = showdata.length;
            if (hupaitip) {
                hupaitip.setVisible(true);
                hupaitip.setContentSize(cc.size(120 + 120 * tiplength, 80));
                //设置位置
                posx = posx + 40;
                if (posx + hupaitip.getContentSize().width / 2 > maLayer.getContentSize().width) {
                    posx = maLayer.getContentSize().width - hupaitip.getContentSize().width / 2 - 20;
                } else if (posx - hupaitip.getContentSize().width / 2 < 0) {
                    posx = hupaitip.getContentSize().width / 2 + 20;
                }
                hupaitip.setPositionX(posx);
                for (var i = 0; i < 9; i++) {
                    var card = hupaitip.getChildByName('card' + (i + 1));
                    var fantext = hupaitip.getChildByName('fantext' + (i + 1));
                    var fannum = hupaitip.getChildByName('fannum' + (i + 1));
                    var zhangtext = hupaitip.getChildByName('zhangtext' + (i + 1));
                    var zhangnum = hupaitip.getChildByName('zhangnum' + (i + 1));
                    if (tiplength > i) {
                        //card
                        card.setVisible(true);
                        var paiName = getPaiNameByRowAndId(2, showdata[i][0], true, true);
                        setSpriteFrameByName(card, paiName, 'pai');
                        card.setPosition(cc.p(-5 + 120 * (i + 1), hupaitip.getContentSize().height / 2));
                        fantext.setVisible(true);
                        fantext.setPosition(cc.p(60 + 120 * (i + 1), 60));
                        fannum.setVisible(true);
                        fannum.setPosition(cc.p(40 + 120 * (i + 1), 60));
                        fannum.setString(showdata[i][1]);
                        zhangtext.setVisible(true);
                        zhangtext.setPosition(cc.p(60 + 120 * (i + 1), 20));
                        zhangnum.setVisible(true);
                        zhangnum.setString(showdata[i][2]);
                        zhangnum.setPosition(cc.p(40 + 120 * (i + 1), 20));
                    } else {
                        card.setVisible(false);
                        fantext.setVisible(false);
                        fannum.setVisible(false);
                        zhangtext.setVisible(false);
                        zhangnum.setVisible(false);
                    }
                }
            } else {
                var hupaitip = new cc.Scale9Sprite(res.toast_bg, null, cc.rect(10, 10, 10, 10));
                hupaitip.setName('hupaitip');
                hupaitip.setAnchorPoint(cc.p(0.5, 0));
                hupaitip.setContentSize(cc.size(120 + 120 * tiplength, 80));
                hupaitip.setPosition(cc.p(maLayer.getContentSize().width - 20, 172));
                maLayer.addChild(hupaitip);
                //设置位置
                posx = posx + 40;
                if (posx + hupaitip.getContentSize().width / 2 > maLayer.getContentSize().width) {
                    posx = maLayer.getContentSize().width - hupaitip.getContentSize().width / 2 - 20;
                } else if (posx - hupaitip.getContentSize().width / 2 < 0) {
                    posx = hupaitip.getContentSize().width / 2 + 20;
                }
                hupaitip.setPositionX(posx);

                var huSprite = new cc.Sprite(res.hupai_tips_icon);
                huSprite.setPosition(cc.p(40, hupaitip.getContentSize().height / 2));
                hupaitip.addChild(huSprite);
                for (var i = 0; i < 9; i++) {
                    //card
                    var card = new cc.Sprite();
                    card.setScale(0.88);
                    card.setName('card' + (i + 1));
                    card.setPosition(cc.p(-5 + 120 * (i + 1), hupaitip.getContentSize().height / 2));
                    hupaitip.addChild(card);

                    var fantext = new ccui.Text();
                    fantext.setString('番');
                    fantext.setName('fantext' + (i + 1));
                    fantext.setFontSize(24);
                    fantext.setTextColor(cc.color(0, 255, 0));
                    fantext.enableOutline(cc.color(38, 38, 38), 1);
                    fantext.setPosition(cc.p(60 + 120 * (i + 1), 60));
                    hupaitip.addChild(fantext);
                    var fannum = new ccui.Text();
                    fannum.setName('fannum' + (i + 1));
                    fannum.setFontSize(24);
                    fannum.setTextColor(cc.color(255, 255, 0));
                    fannum.enableOutline(cc.color(38, 38, 38), 1);
                    fannum.setPosition(cc.p(40 + 120 * (i + 1), 60));
                    hupaitip.addChild(fannum);
                    var zhangtext = new ccui.Text();
                    zhangtext.setString('张');
                    zhangtext.setName('zhangtext' + (i + 1));
                    zhangtext.setFontSize(24);
                    zhangtext.setTextColor(cc.color(0, 255, 0));
                    zhangtext.enableOutline(cc.color(38, 38, 38), 1);
                    zhangtext.setPosition(cc.p(60 + 120 * (i + 1), 20));
                    hupaitip.addChild(zhangtext);
                    var zhangnum = new ccui.Text();
                    zhangnum.setName('zhangnum' + (i + 1));
                    zhangnum.setFontSize(24);
                    zhangnum.setTextColor(cc.color(255, 255, 0));
                    zhangnum.enableOutline(cc.color(38, 38, 38), 1);
                    zhangnum.setPosition(cc.p(40 + 120 * (i + 1), 20));
                    hupaitip.addChild(zhangnum);
                    if (tiplength > i) {
                        card.setVisible(true);
                        var paiName = getPaiNameByRowAndId(2, showdata[i][0], true, true);
                        setSpriteFrameByName(card, paiName, 'pai');
                        fantext.setVisible(true);
                        fannum.setVisible(true);
                        fannum.setString(showdata[i][1]);
                        zhangtext.setVisible(true);
                        zhangnum.setVisible(true);
                        zhangnum.setString(showdata[i][2]);
                    } else {
                        card.setVisible(false);
                        fantext.setVisible(false);
                        fannum.setVisible(false);
                        zhangtext.setVisible(false);
                        zhangnum.setVisible(false);
                    }
                }
            }
        },
        sortFront: function (paiArr, id) {
            var oldSize = paiArr.length;
            _.pull(paiArr, id);
            if (paiArr.length != oldSize) {
                var t = paiArr.length;
                for (var j = 0; j < oldSize - t; j++)
                    paiArr.splice(0, 0, id);
            }
        },
        setPaiArrOfRow: function (row, paiArr, isLittle, isStand, liangPaiArr, liangAll, notSort) {

            //cc.log('hidegangstep=============================', hideGangStep);
            liangPaiArr = liangPaiArr || [];
            if (isReplay || roomState == ROOM_STATE_ENDED) {
                liangPaiArr = [];
            }
            if (row == 2)
                _.pull(paiArr, 0);
            if (!notSort) {//排序
                paiArr.sort(compareTwoNumbers);
                liangPaiArr.sort(compareTwoNumbers);
            }
            if (row == 2 && hideGangStep != 1) {//玩家自己 并且亮牌放倒组牌的时候本地数组不改变
                this.curPaiArr = paiArr;//保存当前牌数组
            }

            // 皮杠赖放前面
            // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
            //     this.sortFront(paiArr, 32);
            //     this.sortFront(paiArr, 33);
            //     this.sortFront(paiArr, laiziPaiId);
            //     this.sortFront(paiArr, laizipiPaiAId);
            //     this.sortFront(paiArr, laizipiPaiBId);
            // }
            for (var j = 0; j < paiArr.length; j++)
                this.setPai(row, j, paiArr[j], isLittle, isStand, true).setOpacity(255);
            for (; j < 14; j++)
                this.setPai(row, j, 0, isLittle, isStand, false);
            if (typeof liangPaiArr !== 'undefined') {
                var cond = (row == 2);
                if (mapId == MAP_ID.CHANGSHA)
                    cond = (cond && afterLianging);
                else
                    cond = (cond && hideGangStep > 0);
                if (cond) {
                    if (mapId == MAP_ID.CHANGSHA) {
                        var pai = this.getPai(2, 13);
                        Filter.grayMask(pai);
                        pai.getUserData().isLiang = false;
                    }
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = this.getPai(2, i);
                        Filter.grayMask(pai);
                        pai.getUserData().isLiang = false;
                    }
                    if (hideGangStep < 3) {
                        for (var j = 0; j < liangPaiArr.length; j++) {
                            for (var i = 0; i < paiArr.length; i++) {
                                var pai = this.getPai(2, i);
                                var userData = pai.getUserData();
                                if (userData.pai == liangPaiArr[j] && !userData.isLiang) {
                                    userData.isLiang = true;
                                    Filter.remove(pai);
                                    //this.downPai(2, i);
                                    if (!liangAll)
                                        break;
                                }
                                //else
                                //    Filter.grayMask(pai);
                            }
                        }
                    } else {
                        var pai = this.getPai(2, 13);
                        Filter.grayMask(pai);
                        pai.getUserData().isLiang = false;
                    }
                } else {
                    if (row == 1 || row == 0)
                        for (var j = 0; j < liangPaiArr.length; j++)
                            this.setPai(row, j, liangPaiArr[j], isLittle, isStand, true);
                    if (row == 3)
                        for (var j = 0; j < liangPaiArr.length; j++)
                            this.setPai(row, paiArr.length - liangPaiArr.length + j, liangPaiArr[j], isLittle, isStand, true);
                }
            } else if (false && disabledChuPaiIdMap) {
                for (var i = 0; i < paiArr.length; i++) {
                    if (disabledChuPaiIdMap[paiArr[i]]) {
                        var pai = this.getPai(2, i);
                        Filter.grayMask(pai);
                        pai.getUserData().isLiang = false;
                    }
                }
            }
        },
        findNotLiang: function (liangArr, hupaiArr) {
            var ids = [];
            for (var i = 0; i < liangArr.length; i++) {
                for (var n in hupaiArr) {
                    if (hupaiArr.hasOwnProperty(n) && n != 2) {
                        var hulist = hupaiArr[n];
                        for (var j = 0; j < hulist.length; j++) {
                            if (liangArr[i] == hulist[j]) {
                                ids.push(i);
                            }
                        }
                    }
                }

            }
            _.pullAt(liangArr, ids);
        },
        mopai: function (row, paiId, paiArr, liangPaiArr) {
            if (row == 2) {
                hasChupai = false;
                this.setPaiArrOfRow(2, paiArr, false, false, liangPaiArr);
                this.curPaiArr.push(paiId);
            }

            this.setPai(row, 13, (row == 2 || isReplay ? paiId : 0), (row != 2), (row != 2), true)
                .runAction(cc.fadeIn(MOPAI_ANIM_DURATION));


            if (row == 2 && gameData.mapId == MAP_ID.KWX) {
                this.checkMyPaiColor4KWX();
            }

            this.throwTurn(row);

            if (row == 2)
                this.recalcPos(2);

            this.countDown(12);
        },
        showChiPengGangHu: function (row, paiId, chi, peng, gang, hu, ting, data) {
            // return;
            var that = this;

            if (!isReplay) {
                $('cpghg').setOpacity(255);

                var children = $('cpghg').getChildren();
                for (var i = 0; i < children.length; i++) {
                    children[i].setVisible(false);
                }

                if (mapId == MAP_ID.CHANGSHA && gang)
                    ting = 1;

                var sum = (chi || 0) + (peng || 0) + (gang || 0) + (hu || 0) + (ting || 0) + 1;
                $('cpghg.chi').setVisible(false);
                $('cpghg.peng').setVisible(false);
                $('cpghg.gang').setVisible(false);
                $('cpghg.hu').setVisible(false);
                $('cpghg.ting').setVisible(false);
                var nodeArr = [];
                if (chi) nodeArr.push($('cpghg.chi'));
                if (peng) nodeArr.push($('cpghg.peng'));
                if (gang) nodeArr.push($('cpghg.gang'));
                if (hu) nodeArr.push($('cpghg.hu'));
                if (ting) nodeArr.push($('cpghg.ting'));
                nodeArr.push($('cpghg.guo'));

                for (var i = 0; i < nodeArr.length; i++) {
                    if (i < nodeArr.length - 1) {
                        var node = $('cpghg.' + nodeArr[i].getName() + '.a');
                        if (!node) {
                            var node = duplicateSprite($('row2.c0.b0'));
                            node.setName('a');
                            node.setPosition($('cpghg.' + nodeArr[i].getName() + '.n').getPosition());
                            nodeArr[i].addChild(node);
                        }
                        var paiName = getPaiNameByRowAndId(2, paiId, true);
                        setSpriteFrameByName(node, paiName, 'pai');
                        node.setVisible(true);
                    }

                    if (typeof posConf.cpghgPositionX[sum][i] === 'number')
                        nodeArr[i].setPositionX(posConf.cpghgPositionX[sum][i]);
                    else
                        nodeArr[i].setPosition(posConf.cpghgPositionX[sum][i]);
                    nodeArr[i].setVisible(true);
                }

                if (mapId == MAP_ID.CHANGSHA && ting) {
                    $('cpghg.ting').setTexture('res/table/bu.png');
                }

                if (mapId == MAP_ID.KWX && ting) {
                    $('cpghg.ting').setTexture(res.liang);
                    $('cpghg.ting.a').setVisible(false);
                }

                if (mapId == MAP_ID.KWX && ting && !hu)
                    $('cpghg').setContentSize(cc.winSize.width, 0);
                else
                    $('cpghg').setContentSize(cc.winSize.width, 300);

                chi && TouchUtils.setOnclickListener($('cpghg.chi'), function () {
                    var chiStr = data['chi'] || '111';
                    that.showChiLayer(paiId, function (paiId, oriPaiId) {
                        that.sendChiPengGang(OP_CHI, 2, paiId, oriPaiId);
                    }, chiStr);
                });

                peng && TouchUtils.setOnclickListener($('cpghg.peng'), function () {
                    that.sendChiPengGang(OP_PENG, 2, paiId);
                    that.hideChiPengGangHu();
                });

                ting && TouchUtils.setOnclickListener($('cpghg.ting'), function () {
                    if (mapId == MAP_ID.CHANGSHA) {
                        that.sendChiPengGang(OP_GANG, 2, paiId);
                        that.hideChiPengGangHu();
                    }
                    // else if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
                    //
                    // }
                    else if (mapId == MAP_ID.KWX) {
                        that.hideChiPengGangHu();
                        disableChupai = true;
                        network.send(4013, {
                            room_id: gameData.roomId,
                            uid: gameData.uid
                        });
                    }
                    clickTing = true;
                    that.showTingQuxiao();
                });

                hu && TouchUtils.setOnclickListener($('cpghg.hu'), function () {
                    do {
                        if (mapId == MAP_ID.CHANGSHA) {
                            if (selectingXiaohu && leftPaiCnt == 55) {
                                that.sendChiPengGang(OP_XIAOHU, 2, paiId);
                                that.hideChiPengGangHu();
                                break;
                            }
                        }

                        that.sendChiPengGang(OP_HU, 2, paiId);
                        that.hideChiPengGangHu();
                    } while (false);
                });

                gang && TouchUtils.setOnclickListener($('cpghg.gang'), function () {
                    if (mapId == MAP_ID.CHANGSHA) {
                        var isKaigang = data['kaigang'];
                        if (!isKaigang) {
                            alert2("确定要【开杠】吗?", function () {
                                that.sendChiPengGang(OP_KAIGANG, 2, paiId);
                                that.hideChiPengGangHu();
                            }, function () {
                            });
                        }
                        else {
                            that.sendChiPengGang(OP_KAIGANG, 2, paiId);
                            that.hideChiPengGangHu();
                        }
                    }
                    else {
                        that.sendChiPengGang(OP_GANG, 2, paiId);
                        that.hideChiPengGangHu();
                    }
                });

                TouchUtils.setOnclickListener($('cpghg.guo'), function () {
                    if (hu && that.isMyTurn()) {
                        alert2("您当前可以自摸, 确定要点【过】吗?", function () {
                            that.sendChiPengGang(OP_PASS, 2, paiId);
                            that.hideChiPengGangHu();
                        }, function () {
                            return;
                        });
                    }
                    else {
                        that.sendChiPengGang(OP_PASS, 2, paiId);
                        that.hideChiPengGangHu();
                    }
                });

                $('cpghg').setVisible(true);

                this.countDown(12);
            } else {
                var cpg = $('cpghRep' + row);
                for (var i = 0; i < 6; i++) {
                    if (!cpg.getChildByName("sp1_" + i)) {
                        var sp = new cc.Sprite("res/table/cpghRep/sp1_" + i + ".png");
                        sp.setPosition(cpg.getChildByName("sp_" + i).getPosition());
                        sp.setName("sp1_" + i);
                        cpg.addChild(sp);
                        sp.setVisible(false);
                    }
                }
                $('cpghRep' + row + '.sp1_0').setVisible(!!chi);
                $('cpghRep' + row + '.sp1_1').setVisible(!!peng);
                $('cpghRep' + row + '.sp1_2').setVisible(!!gang);
                $('cpghRep' + row + '.sp1_3').setVisible(!!hu);
                $('cpghRep' + row + '.sp1_4').setVisible(true);
                $('cpghRep' + row + '.sp1_5').setVisible(false);

                $('cpghRep' + row + '.sp_0').setVisible(!chi);
                $('cpghRep' + row + '.sp_1').setVisible(!peng);
                $('cpghRep' + row + '.sp_2').setVisible(!gang);
                $('cpghRep' + row + '.sp_3').setVisible(!hu);
                $('cpghRep' + row + '.sp_4').setVisible(false);
                $('cpghRep' + row + '.sp_5').setVisible(true);

                var pai = $('cpghRep' + row + '.sp_pai');
                var paiName = getPaiNameByRowAndId(2, paiId, true);
                pai.setScale(0.65, 0.65);
                setSpriteFrameByName(pai, paiName, 'pai');
                cpg.setVisible(true);
            }
        },
        showTingLiang: function (row, ting, liang) {
            return;
            var that = this;

            if (!isReplay) {
                $('tl.ting').setVisible(!!ting);
                $('tl.liang').setVisible(!!liang);

                ting && TouchUtils.setOnclickListener($('tl.ting'), function () {
                    that.sendChiPengGang(OP_PENG, 2, paiId);
                    that.hideChiPengGangHu();
                });

                liang && TouchUtils.setOnclickListener($('tl.liang'), function () {
                    that.sendChiPengGang(OP_PENG, 2, paiId);
                    that.hideChiPengGangHu();
                });

                $('tl').setVisible(true);
            } else {
                var cpg = $('cpghRep' + row);
                for (var i = 0; i < 6; i++) {
                    if (!cpg.getChildByName("sp1_" + i)) {
                        var sp = new cc.Sprite("res/table/cpghRep/sp1_" + i + ".png");
                        sp.setPosition(cpg.getChildByName("sp_" + i).getPosition());
                        sp.setName("sp1_" + i);
                        cpg.addChild(sp);
                        sp.setVisible(false);
                    }
                }
                $('cpghRep' + row + '.sp1_0').setVisible(!!chi);
                $('cpghRep' + row + '.sp1_1').setVisible(!!peng);
                $('cpghRep' + row + '.sp1_2').setVisible(!!gang);
                $('cpghRep' + row + '.sp1_3').setVisible(!!hu);
                $('cpghRep' + row + '.sp1_4').setVisible(true);
                $('cpghRep' + row + '.sp1_5').setVisible(false);

                $('cpghRep' + row + '.sp_0').setVisible(!chi);
                $('cpghRep' + row + '.sp_1').setVisible(!peng);
                $('cpghRep' + row + '.sp_2').setVisible(!gang);
                $('cpghRep' + row + '.sp_3').setVisible(!hu);
                $('cpghRep' + row + '.sp_4').setVisible(false);
                $('cpghRep' + row + '.sp_5').setVisible(true);

                var pai = $('cpghRep' + row + '.sp_pai');
                var paiName = getPaiNameByRowAndId(2, paiId, true);
                pai.setScale(0.65, 0.65);
                setSpriteFrameByName(pai, paiName, 'pai');
                cpg.setVisible(true);
            }
        },
        hideChiPengGangHu: function () {
            $('cpghg').setVisible(false);
            if ($('chiLayer'))
                $('chiLayer').removeFromParent(false);
        },
        sendChiPengGang: function (op, row, paiId, oriPaiId) {
            network.send(4003, {room_id: gameData.roomId, op: op, pai_id: paiId, ori_pai_id: oriPaiId});
        },
        showTingQuxiao: function () {
            var that = this;
            var btnQuxiao = $('ting_quxiao');
            if (btnQuxiao && cc.sys.isObjectValid(btnQuxiao)) {
                btnQuxiao.setVisible(true);
                TouchUtils.setOnclickListener(btnQuxiao, function () {
                    that.hideTingQuxiao();
                    if (gameData.data4004) {
                        if (hideGangStep == 2) {//做特殊处理 因为curPaiArr发生了改变
                            that.setPaiArrOfRow(2, that.prePaiArr, false, true, [], false, true);//重新设置为前端储存的数组 并且不排序
                        } else {
                            that.setPaiArrOfRow(2, that.curPaiArr, false, true, [], false, true);//重新设置为前端储存的数组 并且不排序
                        }
                        //cc.log('now  curpaiarr is===============',that.curPaiArr);
                        hideGangStep = 0;
                        $('btn_xuanzewancheng').setVisible(false);
                        if (hideTing) {
                            for (var i = 0; i < hideTing.length; i++) {
                                $('row' + 2 + '.g' + hideTing[i]).setVisible(false);
                            }
                            hideTing = [];
                        }


                        that.checkMyPaiColor4KWX();
                        that.recalcPos(2);
                        that.hideTip();
                        if (gameData.huTipData) {
                            that.showTishiTip(gameData.huTipData);
                        }
                        network.selfRecv({'code': 4004, 'data': gameData.data4004});
                    }
                });
            }
        },
        hideTingQuxiao: function () {
            var btnQuxiao = $('ting_quxiao');
            if (btnQuxiao && cc.sys.isObjectValid(btnQuxiao)) {
                btnQuxiao.setVisible(false);
            }
        },
        playChiPengGangHuAnim: function (row, op, isZimo, isAngang) {
            //if (op == OP_GANG) {
            //    console.log(row + '  ');
            //    var distNode = $('info_n' + row);
            //    var delta = cc.p(
            //        cc.winSize.width * 0.0369,
            //        cc.winSize.height * -0.0396
            //    );
            //    playAnimScene(distNode, isAngang ? res.AnimAngang_json : res.AnimMinggang_json,
            //        delta.x - cc.winSize.width / 2,
            //        delta.y - cc.winSize.height / 2,
            //        false
            //    );
            //    return;
            //}

            if (op == OP_GANG) {
                playAnimScene(this, res.Anima_Gang, cc.winSize.width / 2, cc.winSize.height / 2, false, 1200);
                return;
            }
            var textureName = isZimo ? 'zimo2.png' : {
                    1: 'chi2.png'    // chi
                    , 2: 'peng2.png'
                    , 3: 'gang2.png'
                    , 4: 'hu2.png'
                    , 7: 'liang2.png'
                }[op];
            if ($('info_n' + row).children.length != 0)
                $('info_n' + row).removeAllChildren();
            var sprite = new cc.Sprite(res[textureName]);
            $('info_n' + row).addChild(sprite);
            sprite.setScale(0, 0);
            var duraction = 0.5;
            sprite.runAction(cc.sequence(
                cc.scaleTo(duraction, 1.5, 1.5).easing(cc.easeExponentialOut())
                , cc.spawn(
                    cc.scaleTo(0.1, 0.80, 0.80)
                    , cc.fadeOut(0.1)
                )
            ));
        },
        setReplayProgress: function (cur, total) {
            var progress = cur / total * 100;
            this.showTip("回放进度: " + progress.toFixed(1) + '%', false);
        },
        setAllPai4Replay: function (data) {
            for (var uid in data)
                if (data.hasOwnProperty(uid)) {
                    var row = uid2position[uid];
                    var paiArr = data[uid]['pai_arr'];
                    this.setPaiArrOfRow(row, paiArr, (row != 2), false);

                    var duiArr = data[uid]['dui_arr'];
                    for (var j = 0; j < duiArr.length; j++) {
                        var dui = duiArr[j];
                        if (dui.type == 1) this.setGChi(row, j, dui['pai_arr'], data['from_uid']);
                        if (dui.type == 2) this.setGPeng(row, j, dui['pai_arr'][0], data['from_uid']);
                        if (dui.type == 3) this.setGGang(row, j, dui['pai_arr'][0], dui['pai_arr'][0], data['from_uid']);
                        if (dui.type == 4) this.setGGang(row, j, dui['pai_arr'][0], 0, data['from_uid']);
                        if (dui.type == 5) this.setGHide(row, j);
                    }
                    for (; j < 4 && $('row' + row + '.g' + j); j++)
                        $('row' + row + '.g' + j).setVisible(false);

                    if ($('row' + row + '.g' + 0).isVisible() == 0) {
                        $('row' + row + '.a' + 0).setPosition(posConf.paiA0PosBak[row]);
                    }

                    var usedArr = data[uid]['used_arr'];
                    for (var idx = 0; idx < 100; idx++) {
                        var j = idx;
                        if (row == 1 || row == 3) {
                            j = idx + parseInt(idx / 9);
                        }
                        var pai = $('row' + row + '.c0.b' + j);
                        if (pai)
                            pai.setVisible(false);
                        else
                            break;
                    }
                    for (var j = 0; j < usedArr.length; j++) {
                        this.addUsedPai(row, usedArr[j])
                    }

                    this.recalcPos(row);
                }
        },
        chiPengGangHu: function (op, row, paiId, fromRow, data) {

            if (isReplay) {
                var node = $('cpghRep' + row + '.sp_' + (op - 1));

                var touch_node = new cc.Node();
                $('cpghRep' + row).addChild(touch_node);
                touch_node.setPosition(node.getPositionX(), node.getPositionY() - 40);

                var touch_sp0 = new cc.Sprite("res/table/cpghRep/touch0.png");
                var touch_sp1 = new cc.Sprite("res/table/cpghRep/touch1.png");
                touch_node.addChild(touch_sp0);
                touch_node.addChild(touch_sp1);
                touch_sp1.setVisible(false);

                touch_node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    touch_sp0.setVisible(false);
                    touch_sp1.setVisible(true);
                }), cc.delayTime(0.818), cc.callFunc(function () {
                    touch_node.removeFromParent();
                    $('cpghRep' + row).setVisible(false);
                })));
            }

            var j;
            for (j = 0; j < 4; j++) {
                var g = $('row' + row + '.g' + j);
                if (!g || !$('row' + row + '.g' + j).isVisible())
                    break;
            }

            var paiArr = this.getPaiArr();

            if (op == OP_CHI) {
                var oriPaiId = data['ori_pai_id'];
                this.setGChi(row, j, paiId, oriPaiId, data['from_uid']);
                hasChupai = false;
                this.removeOneTopUsedPai(fromRow);
                this.playChiPengGangHuAnim(row, op);
                playEffect('vchi', position2sex[row]);
            } else if (op == OP_PENG || op == OP_GANG) {
                var duiArr = (data['dui_arr'] || []);
                var isJiagang = (data['is_jiagang'] || 0);

                if (op == OP_PENG) {
                    this.setGPeng(row, j, paiId, data['from_uid']);
                    _.remove(paiArr, function (n) {
                        return n == paiId;
                    });
                    hasChupai = false;
                    this.removeOneTopUsedPai(fromRow);
                    this.playChiPengGangHuAnim(row, op);
                    playEffect('vpeng', position2sex[row]);
                }
                else if (op == OP_PENG || op == OP_GANG) {
                    var isAngang = (row == fromRow && !isJiagang);
                    var upPaiId = paiId;
                    var downPaiId = (isAngang ? 0 : paiId);

                    if (duiArr)
                        this.setDuiArr(row, duiArr);
                    else {
                        if (isAngang || !isJiagang) {   // angang or minggang
                            this.setGGang(row, j, upPaiId, downPaiId, data['from_uid']);
                        }
                        else if (isJiagang) {
                            this.setGJiaGang(row, paiId, data['from_uid']);
                        }
                    }

                    if (row != fromRow)
                        this.removeOneTopUsedPai(fromRow);

                    _.remove(paiArr, function (n) {
                        return n == paiId;
                    });

                    hasChupai = false;
                    if (row == 2 || isJiagang)
                        hasChupai = true;
                    // if ((mapId == MAP_ID.JINGZHOUHH || mapId == MAP_ID.XIANTAO) && row == 2 && op == OP_GANG && paiId == laizipiPaiAId)
                    //     hasChupai = false;

                    this.playChiPengGangHuAnim(row, op, false, isAngang);
                    playEffect(isAngang ? 'vangang' : 'vgang', position2sex[row]);
                }

                this.hideChiPengGangHu();

                if (!isJiagang && !duiArr)
                    $('row' + row + '.g' + j).setVisible(true);
            }
            else if (op == OP_HU) {
                var isZimo = (data['is_zimo'] || 0);

                if (fromRow == 2)
                    this.hideChiPengGangHu();

                this.playChiPengGangHuAnim(row, op, isZimo);
                //playEffect(isZimo ? 'vzimo' : 'vhu', position2sex[row]);


                var ran = Math.floor(Math.random() * 100);
                if (ran < 40) {
                    playEffect(isZimo ? 'vzimo' : 'vhu', position2sex[row]);
                }
                else if (ran >= 40 && ran <= 70) {
                    playEffect("vnhu", position2sex[row]);


                }
                else if (ran > 70 && ran <= 100) {
                    playEffect("vhhu", position2sex[row]);
                }

            } else if (op == OP_PASS) {
                if (fromRow == 2)
                    this.hideChiPengGangHu();
                return;
            }
            else {
                return;
            }

            this.playerOnloneStatusChange(row, false);

            var _paiArr = (data['pai_arr'] || []);
            var liangPaiArr = (data['liang_pai_arr'] || []);
            var paiCnt = (data['pai_cnt'] || 0);
            var n = paiCnt - _paiArr.length;
            for (var i = 0; i < n; i++)
                _paiArr.push(0);
            this.setPaiArrOfRow(row, _paiArr, (row != 2), (op != OP_HU), op == OP_HU ? null : liangPaiArr);

            if (op != OP_HU) {
                this.setPai(row, 13, 0);
                this.getPai(row, 13).runAction(cc.fadeOut(0));
            }
            this.recalcPos(row);

            // if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
            //     var multiple = data['multiple'];
            //     $('info' + row + '.lb_bs').setString('x' + multiple);
            // }

            this.checkPaiAmount();
        },
        fapai: function (paiArr) {
            _.pull(paiArr, 0);
            paiArr.sort(compareTwoNumbers);
            forRows(function (i) {
                for (var j = 0; j < paiArr.length; j++)
                    this.setPai(i, j, (i == 2 ? paiArr[j] : 0), (i != 2), (i != 2));
                for (; j < 14; j++)
                    this.setPai(i, j, 0, (i != 2), (i != 2), false);
            });
            this.setPai(2, 13, 0, false, false, this.isMyTurn());
            forRows(function (i) {
                for (var j = 0; j < 13; j++) {
                    this.getPai(i, j).setVisible(true);
                    this.getPai(i, j).runAction(
                        cc.sequence(cc.delayTime(j * FAPAI_ANIM_DELAY), cc.fadeIn(FAPAI_ANIM_DURATION))
                    );
                    var userData = this.getPai(i, j).getUserData();
                    userData.isUp = false;
                    userData.isUpping = false;
                    userData.isDowning = false;
                }
                this.getPai(i, 13).setVisible(false);
                this.getPai(i, 13).getUserData().isUp = false;
                this.getPai(i, 13).isUp = false;
                this.getPai(i, 13).isUpping = false;
                this.getPai(i, 13).isDowning = false;
                this.recalcPos(i);
            });
            this.enableChuPai();

            if ($('info0.liang')) $('info0.liang').setVisible(false);
            if ($('info1.liang')) $('info1.liang').setVisible(false);
            if ($('info2.liang')) $('info2.liang').setVisible(false);
            if ($('info3.liang')) $('info3.liang').setVisible(false);
            hideGangStep = 0;
            liangStep = 0;
            afterLianging = false;
            hupaiMap = {};
            this.removeLiangHuTip();
            this.clearHuCardTip();
        },
        jiesuan: function (data) {
            var that = this;

            this.scheduleOnce(function () {
                var myScore = 0;
                var players = data.players;
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var uid = player['uid'];

                    gameData.players[position2playerArrIdx[uid2position[uid]]].score = player['total_score'] - 0;
                    if (gameData.jinbi) {
                        $('info' + uid2position[uid] + '.lb_score').setString(player.jinbiNum);
                    } else {
                        $('info' + uid2position[uid] + '.lb_score').setString(player['total_score']);
                    }

                    if (uid == gameData.uid) {
                        myScore = player['score'];
                        gameData.numOfCards[0] = player.jinbiNum;
                        continue;
                    }

                    // if (player['hu'])
                    //     continue;

                    var row = uid2position[uid];
                    var paiArr = player['pai_arr'];
                    that.setPaiArrOfRow(uid2position[uid], paiArr, (row != 2), false);
                    that.recalcPos(row);
                }

                setTimeout(function () {
                    // var layer = new JiesuanLayer(data, that);
                    // that.addChild(layer);
                    // if (that.getChildByName('ZongjiesuanLayer')) {
                    //     that.getChildByName('ZongjiesuanLayer').setVisible(true);
                    // }
                    // // playEffect(myScore >= 0 ? 'vWin' : 'vLose');
                    // playEffect(myScore >= 0 ? 'vNewWin' : 'vNewLose');
                    var layer = new Ma_JiesuanLayer(data);
                    that.addChild(layer);

                    playEffect(myScore >= 0 ? 'vWin' : 'vLose');
                }, 1500);
            }, 0.2);
        },
        onJiesuanClose: function (isReady) {
            if (isReady || isReplay) {
                $('btn_zhunbei').setVisible(false);
            } else {
                $('btn_zhunbei').setVisible(true);
            }
        },
        zongJiesuan: function (data) {
            var that = this;
            setTimeout(function () {
                var layer = new Ma_ZongJiesuanLayer(data);
                that.addChild(layer);
            }, 2000);
        },
        showPlayerInfoPanel: function (idx) {


            if (window.inReview)
                return;
            if (isReplay)
                return;
            if (position2playerArrIdx[idx] >= gameData.players.length)
                return;


            var ploclayer=this.getChildByName('loclayer');
            if(!ploclayer){
                ploclayer = new PlayerInfoLocationLayer(idx, position2playerArrIdx, this);
                ploclayer.setName('loclayer');
                this.addChild(ploclayer);
            }else{
                ploclayer.fresh(idx);
                ploclayer.setVisible(true);
            }


            // var that = this;
            // var playerInfo = gameData.players[position2playerArrIdx[idx]];
            // var scene = ccs.load(res.PlayerInfoLocation_json);
            // that.addChild(scene.node);
            // var head = $('root.head', scene.node);
            // var playerName = $('root.playerName', scene.node);
            // var playerID = $('root.PlayerID', scene.node);
            // if (playerInfo) {
            //     loadImageToSprite(playerInfo['headimgurl'], head);
            //     playerName.setString(ellipsisStr(playerInfo['nickname'], 7));
            //     playerID.setString('ID: ' + playerInfo['uid']);
            //
            //     $('root.lb_ad', scene.node).setString(decodeURIComponent(playerInfo['locCN']));
            // }
            //
            // if (playerInfo && playerInfo['loc'] && gameData.location) {
            //     var selectPlayerLocation = playerInfo['loc'].split(',');
            //     var otherLocation_1 = selectPlayerLocation[1];
            //     var otherLocation_2 = selectPlayerLocation[0];
            //
            //
            //     var mylocation = gameData.location.split(',');
            //     var mylocationlat = mylocation[1];
            //     var mylocationlng = mylocation[0];
            //
            //     var myAndOtherDis = getFlatternDistance(mylocationlat, mylocationlng, otherLocation_1, otherLocation_2);
            //     if (idx != 2) {//别人才提示
            //         var text_1 = new ccui.Text();
            //         text_1.setFontSize(20);
            //         text_1.setTextColor(cc.color(168, 107, 55));
            //         text_1.setPosition(30, 550);
            //         text_1.setAnchorPoint(0, 0.5);
            //         text_1.setString("距我");
            //         $('root.Image_6', scene.node).addChild(text_1);
            //
            //         var text_2 = new ccui.Text();
            //         text_2.setFontSize(20);
            //         text_2.setTextColor(cc.color(255, 0, 0));
            //         text_2.setAnchorPoint(0, 0.5);
            //         text_2.setPosition(text_1.getPositionX() + text_1.getContentSize().width, text_1.getPositionY());
            //
            //         if (myAndOtherDis >= 1000) {
            //             text_2.setString((myAndOtherDis / 1000).toFixed(2) + 'km');
            //         }
            //         else {
            //             text_2.setString(myAndOtherDis + 'm');
            //
            //         }
            //         $('root.Image_6', scene.node).addChild(text_2);
            //
            //     }
            //
            // }
            //
            //
            // var arr = [0, 1, 3];
            // for (var i = 0; i < arr.length; i++) {
            //     $('root.juli' + i, scene.node).setString("?");
            //     $('root.ditanceClose' + i, scene.node).setVisible(false);
            //     $('root.locationClose' + i, scene.node).setVisible(false);
            //     var playerInfo = gameData.players[position2playerArrIdx[arr[i]]];
            //     var head = $('root.head' + i, scene.node);
            //     if (playerInfo) {
            //         loadImageToSprite(playerInfo['headimgurl'], head, head.getContentSize().width / 2);
            //         $('root.locationClose' + i, scene.node).setVisible(!playerInfo['loc']);
            //     }
            //     var playerInfo2 = null;
            //     if (i == arr.length - 1) {
            //         playerInfo2 = gameData.players[position2playerArrIdx[arr[0]]];
            //     } else {
            //         playerInfo2 = gameData.players[position2playerArrIdx[arr[i + 1]]];
            //     }
            //     if (playerInfo2 && playerInfo && playerInfo2['loc'] && playerInfo['loc']) {
            //         var juli = $('root.juli' + i, scene.node);
            //
            //         var templocation1 = playerInfo['loc'].split(',');
            //         var other1Location_1 = templocation1[1];
            //         var other1Location_2 = templocation1[0]
            //
            //         var templocation2 = playerInfo2['loc'].split(',');
            //         var other2Location_1 = templocation2[1];
            //         var other2Location_2 = templocation2[0];
            //         //其他三个人相互的距离
            //         var distance = getFlatternDistance(other1Location_1, other1Location_2, other2Location_1, other2Location_2);
            //         if (distance >= 1000) {
            //             juli.setString((distance / 1000).toFixed(2) + 'km');
            //         }
            //         else {
            //             juli.setString(distance + 'm');
            //         }
            //         juli.setVisible(true);
            //         if (distance > 200) {
            //             juli.setColor(cc.color(26, 26, 26));
            //
            //         } else {
            //             juli.setColor(cc.color(255, 255, 255));
            //         }
            //         $('root.juliBgWite' + i, scene.node).setVisible(distance > 200);
            //         $('root.juliBgRed' + i, scene.node).setVisible(distance <= 200);
            //     }
            //
            //     //其他三个人和我的距离
            //     if (gameData.location && playerInfo && playerInfo['loc']) {
            //         var otherInfo = playerInfo['loc'].split(',');
            //         var otherLocation1 = otherInfo[1];
            //         var otherLocation2 = otherInfo[0]
            //         var mylocation = gameData.location.split(',');
            //         var mylocationlat = mylocation[1];
            //         var mylocationlng = mylocation[0];
            //         var myAndOtherDis = getFlatternDistance(mylocationlat, mylocationlng, otherLocation1, otherLocation2);
            //         if (myAndOtherDis) {
            //             $('root.ditanceClose' + i, scene.node).setVisible(myAndOtherDis <= 200);
            //         }
            //     }
            //
            // }
            //
            // TouchUtils.setOnclickListener($('root.fake_root', scene.node), function () {
            //     scene.node.removeFromParent(true);
            // });


        },
        // showPlayerInfoPanel: function (idx) {
        //     if (window.inReview || isReplay)
        //         return;
        //
        //     if (position2playerArrIdx[idx] >= gameData.players.length)
        //         return;
        //
        //     var that = this;
        //
        //     var playerInfo = gameData.players[position2playerArrIdx[idx]];
        //
        //     var scene = ccs.load(res.PlayerInfo_json);
        //     that.addChild(scene.node);
        //
        //     var head = $('root.panel.info.head', scene.node);
        //     var lbNickname = $('root.panel.lb_nickname', scene.node);
        //     var lbId = $('root.panel.lb_id', scene.node);
        //     var lbIp = $('root.panel.lb_ip', scene.node);
        //     var lbAD = $('root.panel.lb_ad', scene.node);
        //     var lbDt = $('root.panel.lb_dt', scene.node);
        //     var male = $('root.panel.male', scene.node);
        //     var female = $('root.panel.female', scene.node);
        //     var lbLocation = $('root.panel.lb_location', scene.node);
        //     lbNickname.setString(ellipsisStr(playerInfo['nickname'], 7));
        //     // loadImageToSprite(playerInfo['headimgurl'], head);
        //     loadImageToSprite(playerInfo['headimgurl'], head);
        //     lbId.setString('ID: ' + playerInfo['uid']);
        //     lbIp.setString('IP: ' + playerInfo['ip']);
        //     if (idx == 2) {
        //         if (gameData.location == 'false')
        //             lbAD.setString('自己' + decodeURIComponent(gameData.locationInfo));
        //         else if (!gameData.location || gameData.location == '') {
        //             lbAD.setString('您可能没有开启定位权限');
        //         }
        //         else
        //             lbAD.setString(decodeURIComponent(gameData.locationInfo));
        //     }
        //     else {
        //         if (playerInfo['loc'] == 'false')
        //             lbAD.setString('对方' + decodeURIComponent(playerInfo['locCN']));
        //         else
        //             lbAD.setString(decodeURIComponent(playerInfo['locCN']));
        //     }
        //     if (!gameData.location || playerInfo['loc'] == '' || !playerInfo['loc'] || playerInfo['loc'] == 'false' || gameData.location == 'false') {
        //         lbDt.setVisible(false);
        //     }
        //     else {
        //         var templocation1 = playerInfo['loc'].split(',');
        //         var otherpeoplelocationlat = templocation1[1];
        //         var otherpeoplelocationlng = templocation1[0];
        //         var templocation2 = gameData.location.split(',');
        //         var mylocationlat = templocation2[1];
        //         var mylocationlng = templocation2[0];
        //         // console.log(otherpeoplelocationlat+':'+otherpeoplelocationlng+':'+mylocationlat+':'+mylocationlng);
        //         if (idx == 2)
        //             lbDt.setVisible(false);
        //         else
        //             lbDt.setVisible(true);
        //         var distance = getFlatternDistance(mylocationlat, mylocationlng, otherpeoplelocationlat, otherpeoplelocationlng);
        //         if (distance >= 1000) {
        //             lbDt.setString('距我 ' + (distance / 1000).toFixed(2) + ' 公里');
        //         }
        //         else {
        //             lbDt.setString('距我 ' + distance + ' 米');
        //         }
        //     }
        //
        //     // lbLocation.setString('位置: ' + ellipsisStr(gameData.location || "未知位置", 30));
        //     male.setVisible(playerInfo.sex == '1');
        //     female.setVisible(playerInfo.sex == '2');
        //
        //     TouchUtils.setOnclickListener($('root.fake_root', scene.node), function () {
        //         that.removeChild(scene.node);
        //     });
        //     TouchUtils.setOnclickListener($('root.panel', scene.node), function () {
        //     }, {effect: TouchUtils.effects.NONE});
        // },
        playerOnloneStatusChange: function (row, isOffline) {
            var offline = $('info' + row + '.offline');
            if (offline) {
                offline.setVisible(!!isOffline);
            }
        },
        playUrlVoice: function (row, type, content, voice) {
            var url = decodeURIComponent(content);
            var arr = null;
            if (url.indexOf('.aac') >= 0) {
                arr = url.split(/\.aac/)[0].split(/-/);
            } else if (url.indexOf('.spx') >= 0) {
                arr = url.split(/\.spx/)[0].split(/-/);
                // playVoiceByUrl(url);
            }
            var duration = arr[arr.length - 1] / 1000;
            window.soundQueue = window.soundQueue || [];
            window.soundQueue.push({url: url, duration: duration, row: row});
            if (window.soundQueue.length > 1) {
            } else {
                this.playVoiceQueue();
            }
        },
        playVoiceQueue: function () {
            var that = this;
            var queue = window.soundQueue[0];
            if (queue && queue.url && queue.duration && queue.row) {
                if (queue.url.indexOf('.aac') >= 0) {
                    VoiceUtils.play(queue.url);
                } else if (queue.url.indexOf('.spx') >= 0) {
                    OldVoiceUtils.playVoiceByUrl(queue.url);
                }
                var scale9sprite = this.initQP(queue.row);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[queue.row]);
                var innerNodes = this.initSpeaker(queue.row, scale9sprite);
                this.qpAction(innerNodes, scale9sprite, queue.duration);
                setTimeout(function () {
                    window.soundQueue.shift();
                    that.playVoiceQueue();
                }, queue.duration * 1000);
            }
        },
        initQP: function (row) {
            var scale9sprite = $('info' + row + '.qp9');
            if (!scale9sprite) {
                var picIdx = row;
                var capInsets = posConf.ltqpCapInsets[row];
                if (playerNum == 2 && row == 0) {
                    picIdx = 1;
                    capInsets = cc.rect(26, 31, 1, 1);
                }
                scale9sprite = new cc.Scale9Sprite(res['ltqp'+picIdx], posConf.ltqpRect[row], capInsets);
                scale9sprite.setName('qp9');
                scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : cc.p(0, 0));
                if (playerNum == 2 && row == 0) {
                    scale9sprite.setAnchorPoint(cc.p(1, 1));
                }
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $('info' + row).addChild(scale9sprite);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);
            return scale9sprite;
        },
        initSpeaker: function (row, scale9sprite) {
            var map = {};
            var innerNodes = [];
            for (var i = 1; i <= 3; i++) {
                var sp = $('speaker' + i, scale9sprite);
                if (!sp) {
                    sp = new cc.Sprite(res['speaker' + i]);
                    sp.setName('speaker' + i);
                    sp.setPosition(posConf.ltqpVoicePos[row]);
                    scale9sprite.addChild(sp);
                }
                map[i] = sp;
                map[i].setVisible(true);
                innerNodes.push(map[i]);
            }
            map[2].runAction(cc.sequence(cc.fadeOut(0), cc.delayTime(0.25), cc.fadeIn(0.25)).repeatForever());
            map[3].runAction(cc.sequence(cc.fadeOut(0), cc.delayTime(0.50), cc.fadeIn(0.50)).repeatForever());
            return innerNodes;
        },
        qpAction: function (innerNodes, scale9sprite, duration) {
            scale9sprite.stopAllActions();
            scale9sprite.setVisible(true);
            scale9sprite.setOpacity(255);
            scale9sprite.setScale(1.6, 1.6);
            scale9sprite.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));
        },
        showChat: function (row, type, content, voice) {
            var that = this;

            if (type == 'voice') {
                var url = decodeURIComponent(content);
                if (url && url.split(/\.spx/).length > 2)
                    return;
            }

            if (type == 'voice') {
                this.playUrlVoice(row, type, content, voice);
                return;
            }

            if (type == 'oldemoji') {

                var sprite = $('info' + row + '.bq');
                sprite.setVisible(true);
                sprite.removeAllChildren();
                sprite.stopAllActions();
                sprite.setOpacity(255);
                playAnimScene(sprite, res['expression_animation_' + content], 0, 0, true);
                sprite.runAction(cc.sequence(cc.delayTime(2), cc.fadeOut(0.5), cc.callFunc(function () {
                    sprite.setVisible(false);
                })));


                return;
            }
            var scale9sprite = this.initQP(row);
            var duration = 4;
            var innerNodes = [];
            if (type == 'emoji') {
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);

                var sprite = $('emoji', scale9sprite);
                if (!sprite) {
                    sprite = new cc.Sprite();
                    sprite.setName('emoji');
                    sprite.setScale(0.6);
                    sprite.setPosition(posConf.ltqpEmojiPos[row]);
                    scale9sprite.addChild(sprite);
                }
                setSpriteFrameByName(sprite, content, 'emoji');
                sprite.setVisible(true);
                innerNodes.push(sprite);
            }
            else if (type == 'text') {
                var text = $('text', scale9sprite);
                if (!text) {
                    text = new ccui.Text();
                    text.setName('text');
                    text.setFontSize(26);
                    text.setTextColor(cc.color(0, 0, 0));
                    text.setAnchorPoint(0, 0);
                    text.enableOutline(cc.color(255, 255, 255), 1);
                    scale9sprite.addChild(text);
                }

                text.setString(content);

                var size = cc.size(text.getVirtualRendererSize().width + posConf.ltqpRect[row].width, posConf.ltqpRect[row].height);
                var textDeltaPosX = posConf.ltqpTextDelta[row].x;
                var textDeltaPosY = posConf.ltqpTextDelta[row].y;
                if (playerNum == 2 && row == 0) {
                    textDeltaPosX = -7;
                    textDeltaPosY = 8;
                }
                text.setPosition(
                    (size.width - text.getVirtualRendererSize().width) / 2 + textDeltaPosX,
                    (size.height - text.getVirtualRendererSize().height) / 2 + textDeltaPosY
                );
                scale9sprite.setContentSize(size);
                text.setVisible(true);
                innerNodes.push(text);
            }
            else if (type == 'voice') {
                var url = decodeURIComponent(content);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
                var arr = null;
                if (url.indexOf('.aac') >= 0) {
                    arr = url.split(/\.aac/)[0].split(/-/);
                    VoiceUtils.play(url);
                } else if (url.indexOf('.spx') >= 0) {
                    arr = url.split(/\.spx/)[0].split(/-/);
                    // playVoiceByUrl(url);
                    OldVoiceUtils.playVoiceByUrl(url);
                } else {
                    arr = ["1000", 5000];
                }
                duration = arr[arr.length - 1] / 1000;
                innerNodes = this.initSpeaker(row, scale9sprite);
            }
            this.qpAction(innerNodes, scale9sprite, duration);
            if (type != 'voice') {
                for (var i = 0; i < innerNodes.length; i++) {
                    var innerNode = innerNodes[i];
                    innerNode.stopAllActions();
                    innerNode.setVisible(true);
                    innerNode.setOpacity(255);
                    //innerNode.setScale(1.5, 1.5);
                    innerNode.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5)));
                }
            }
            if (voice && !window.inReview)
                playEffect(voice);
        },
        setZhuang: function (row) {
            $('info0.zhuang').setVisible(false);
            $('info1.zhuang').setVisible(false);
            $('info2.zhuang').setVisible(false);
            $('info3.zhuang').setVisible(false);
            //金币场 没庄
            if (!gameData.jinbi) {
                $('info' + row + '.zhuang').setVisible(true);
            }
            // $('info' + row + '.zhuang').setVisible(true);
        },
        setBeforeOnCCSLoadFinish: function (cb) {
            this.beforeOnCCSLoadFinish = cb;
        },
        getBeforeOnCCSLoadFinish: function (cb) {
            return this.beforeOnCCSLoadFinish;
        },
        setAfterGameStart: function (cb) {
            this.afterGameStart = cb;
        },
        setReady: function (uid, k) {
            var idx = uid ? uid2position[uid] : k;

            var ok = $('row_top_info' + idx + '.ok');
            if (!ok) {
                ok = duplicateSprite($('info0.ok'));
                ok.setVisible(true);
                ok.setPosition(cc.p(0, 0));
                $('row_top_info' + idx).addChild(ok);
            } else {
                ok.setVisible(true);
            }

            if (uid == gameData.uid)
                $('btn_zhunbei').setVisible(false);
            if (k == 2)
                $('btn_zhunbei').setVisible(false);


            // $('info' + uid2position[uid] + '.ok').setVisible(true);
            // $('btn_zhunbei').setVisible(false);

            // var ok = $('row' + uid2position[uid] + '.mid.ok');
            // if (!ok) {
            //     ok = duplicateSprite($('info0.ok'));
            //     ok.setVisible(true);
            //     ok.setPosition(cc.p(0, 0));
            //     $('row' + uid2position[uid] + '.mid').addChild(ok);
            // } else {
            //     ok.setVisible(true);
            // }
            // if (uid == gameData.uid)
            //     $('btn_zhunbei').setVisible(false);
        },
        showToast: function (msg) {
            var toast = $('toast');
            if (!toast) {
                toast = new cc.Sprite(res.toast_bg_png);
                toast.setName("toast");
                this.addChild(toast);

                var text = new ccui.Text();
                text.setName('text');
                text.setFontSize(30);
                text.setTextColor(cc.color(255, 255, 255));
                text.setPosition(toast.getBoundingBox().width / 2, toast.getBoundingBox().height / 2);
                text.setString(msg);
                toast.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 * 4 / 5);
                toast.addChild(text);
            }
            toast.stopAllActions();
            toast.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
            text = toast.getChildByName('text');
            text.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
        },
        initMic: function () {
            var that = this;
            var cancelOrSend = false;
            var chatTime = 0;
            var animNode = null;
            var voiceFilename = null;
            var uploadFilename = null;
            TouchUtils.setListeners($('btn_mic'), {
                onTouchBegan: function (node, touch, event) {
                    if (animNode && animNode.getParent()) {
                        animNode.removeFromParent();
                    }

                    cancelOrSend = true;
                    animNode = playAnimScene(that, res.AnimMic_json, 0, 0, true);
                    chatTime = getCurrentTimeMills();
                    voiceFilename = getCurTimestamp() + '-' + gameData.uid + '-';
                    uploadFilename = voiceFilename;
                    voiceFilename += Math.floor(Math.random() * 100) + '.spx';
                    // console.log(voiceFilename);
                    startVoiceRecord(voiceFilename);
                },
                onTouchMoveIn: function (node, touch, event) {
                    if (!cancelOrSend) {
                        cancelOrSend = true;

                        animNode.removeFromParent();
                        animNode = playAnimScene(that, res.AnimMic_json, 0, 0, true);
                    }
                },
                onTouchMoveOut: function (node, touch, event) {
                    if (cancelOrSend) {
                        cancelOrSend = false;
                        animNode.removeFromParent();
                        animNode = ccs.load(res.ChatNotSendNode_json).node;
                        animNode.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                        that.addChild(animNode);
                    }
                },
                onTouchEndedWithoutCheckTouchMe: function (node, touch, event) {
                    chatTime = getCurrentTimeMills() - chatTime;
                    animNode.removeFromParent();
                    animNode = null;
                    if (cancelOrSend) {
                        if (chatTime > 1000) {
                            stopVoiceRecord(voiceFilename);
                            var interval = null;
                            var checkFunc = function () {
                                var isOpened = isFileOpened(voiceFilename);
                                if (!isOpened) {
                                    clearInterval(interval);
                                    uploadFilename = uploadFilename + '' + (Math.floor(chatTime) + 500) + '.spx';
                                    uploadFileToOSS(voiceFilename, uploadFilename, function (url) {
                                        network.send(3008, {room_id: gameData.roomId, type: 'voice', content: url});
                                    }, function () {
                                        console.log('upload fail');
                                    });
                                }
                            };
                            interval = setInterval(checkFunc, 32);
                        } else {
                            animNode = ccs.load(res.ChatErrorNode_json).node;
                            animNode.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                            animNode.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                animNode.removeFromParent();
                                animNode = null;
                            })));
                            that.addChild(animNode);
                            stopVoiceRecord(voiceFilename);
                        }
                    }
                    else
                        stopVoiceRecord(voiceFilename);
                }
            });
        },
        initWanfa: function () {
            if (!gameData.wanfaDesp)
                return;
            var arr = decodeURIComponent(gameData.wanfaDesp).split(',');
            var topPosY = cc.winSize.height / 2 + 116;

            var sp_wanfa_Pos = cc.p(0, topPosY);
            // var sp_wanfa = new cc.Sprite("res/table/sp_wanfa.png");
            var sp_wanfa = new cc.Sprite(res.sp_picback);
            var sp_wanfa_size = cc.size(47, 85);
            sp_wanfa.setPosition(sp_wanfa_Pos);
            sp_wanfa.setAnchorPoint(0, 0);
            this.addChild(sp_wanfa);

            var scale9sprite = new cc.Scale9Sprite(res.sp_picback, cc.rect(0, 0, 1, 1), cc.rect(0.25, 0.25, 0.5, 0.5));
            scale9sprite.setName('s9p');
            scale9sprite.setAnchorPoint(0, 1);

            var maxLength = 0;
            var textHeight = 0;
            var fontSize = 25;
            var marginSize = cc.p(11, 5);
            var fontColor = cc.color(254, 245, 92);
            var scale9Height = 0;
            var scale9Width = 0;
            for (var i = 0; i < arr.length; i++) {
                var text = new ccui.Text();
                text.setFontSize(fontSize);
                text.setColor(fontColor);
                text.setAnchorPoint(0, 0);
                text.setString(arr[i]);
                text.setName("text" + i);
                var twidth = text.getVirtualRendererSize().width;
                textHeight = text.getAutoRenderSize().height;
                if (!scale9Height)
                    scale9Height = Math.max(arr.length * (textHeight + marginSize.y) + 3 * marginSize.y, sp_wanfa_size.height);
                text.setPosition(marginSize.x, scale9Height - marginSize.y - (textHeight + marginSize.y) * (i + 1));
                text.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                scale9sprite.addChild(text);
                maxLength = twidth > maxLength ? twidth : maxLength;
            }

            scale9Width = maxLength + marginSize.x * 2;
            scale9sprite.setPosition(-scale9Width, sp_wanfa_size.height);
            scale9sprite.setPreferredSize(cc.size(scale9Width, scale9Height));
            sp_wanfa.addChild(scale9sprite);

            var pullOrPush = true;
            TouchUtils.setOnclickListener(sp_wanfa, function () {
                // console.log(sp_wanfa.getChildrenCount());
                sp_wanfa.stopAllActions();
                if (pullOrPush)
                    sp_wanfa.runAction(cc.moveTo(0.25, sp_wanfa_Pos.x + scale9Width, sp_wanfa_Pos.y));
                else
                    sp_wanfa.runAction(cc.moveTo(0.25, sp_wanfa_Pos));
                pullOrPush = !pullOrPush;
            });
        },
        showArrow: function (pai, row) {
            // this.hideArrow();
            // var arrow = pai.getParent().getChildByName('arrow');
            // if (!arrow) {
            //     arrow = new cc.Sprite('res/table/arrow.png');
            //     arrow.setAnchorPoint(0.5, 0);
            //     arrow.setName('arrow');
            //     arrow.setLocalZOrder(100);
            //     pai.getParent().addChild(arrow);
            //     var duration = 0.8;
            //     arrow.setOpacity(168);
            // }
            // arrow.setVisible(true);
            // var arrowrot = [180, 270, 0, 90];
            // if (row == 0) {
            //     arrow.setPosition(pai.getPosition().x, pai.getPosition().y - 35);
            // }
            // else if (row == 1) {
            //     arrow.setPosition(pai.getPosition().x - 40, pai.getPosition().y + 10);
            // }
            // else if (row == 2) {
            //     arrow.setPosition(pai.getPosition().x, pai.getPosition().y + 30);
            // }
            // else if (row == 3) {
            //     arrow.setPosition(pai.getPosition().x + 25, pai.getPosition().y + 5);
            // }
            //
            // arrow.setRotation(arrowrot[row]);
            // if (row == 0 || row == 2) {
            //     arrow.runAction(cc.sequence(cc.spawn(cc.moveBy(duration, 0, +16), cc.fadeTo(duration, 255))
            //         , cc.spawn(cc.moveBy(duration, 0, -16), cc.fadeTo(duration, 168))).repeatForever());
            // }
            // else if (row == 1 || row == 3) {
            //     arrow.runAction(cc.sequence(cc.spawn(cc.moveBy(duration, +16, 0), cc.fadeTo(duration, 255))
            //         , cc.spawn(cc.moveBy(duration, -16, 0), cc.fadeTo(duration, 168))).repeatForever());
            // }


            this.hideArrow();
            //TODO 隐藏了➡️
            // var arrow = pai.getParent().getChildByName('arrow');
            // if (!arrow) {
            //     arrow = playAnimSceneCall(pai.getParent(), res['MJ_JIANTOU_json'], 0, 0, true);
            //     arrow.setAnchorPoint(0.5, 0);
            //     arrow.setName('arrow');
            //     arrow.setLocalZOrder(100);
            //
            // }
            // arrow.setVisible(true);
            // arrow.setPositionX(pai.getPositionX());
            // arrow.setPositionY(pai.getPositionY() + 20);
        },
        setLiang: function (liang) {
            lianging = liang;
            return;
            var that = this;
            if (liang) {
                lianging = true;
                for (var i = 0; i < 14; i++) {
                    var pai = that.getPai(2, i);
                    var userData = pai.getUserData();
                    if (userData.pai) {
                        userData.isLiang = false;
                        Filter.grayMask(pai);
                    }
                }
                $('btn_queding').setVisible(true);
                $('btn_quxiao').setVisible(true);
            }
            else {
                $('btn_queding').setVisible(false);
                $('btn_quxiao').setVisible(false);
                that.hideTip();
                lianging = false;
            }
        },
        showTip: function (content, isShake, timeout) {
            var that = this;
            isShake = _.isUndefined(isShake) ? true : isShake;
            var scale9sprite = $('top_tip');
            if (!(scale9sprite instanceof cc.Scale9Sprite)) {
                var newScale9sprite = new cc.Scale9Sprite('res/submodules/majiang/image/MaScene1_KWX/round_rect_91.png');
                newScale9sprite.setName('top_tip');
                scale9sprite.setAnchorPoint(0.5, 0.5);
                newScale9sprite.setPosition(scale9sprite.getPosition());
                scale9sprite.getParent().addChild(newScale9sprite);
                var lb = $('top_tip.lb_tip');

                text = new ccui.Text();
                text.setName('lb_tip');
                text.setFontSize(lb.getFontSize());
                text.setTextColor(lb.getTextColor());
                text.enableOutline(cc.color(38, 38, 38), 1);
                newScale9sprite.addChild(text);

                lb.removeFromParent(true);
                scale9sprite.removeFromParent(true);
                scale9sprite = newScale9sprite;
            }
            var text = $('top_tip.lb_tip');
            text.setString(content);
            var size = cc.size(text.getVirtualRendererSize().width + 220, (text.getVirtualRendererSize().height + 10));
            text.setPosition((text.getVirtualRendererSize().width + 220) / 2, (text.getVirtualRendererSize().height + 10) / 2);
            text.setVisible(false);
            if (scale9sprite.getChildByTag(2133)) {
                scale9sprite.removeChildByTag(2133);
            }
            var texture = null;
            switch (content) {
                case "buxianshi":
                case "chupaibuzhengque":
                case "dayizhang":
                case "dengdai":
                case "diyibu":
                case "liangpianbuzhengque":
                    texture = new cc.Sprite(res[content]);
                    break;
            }
            if (!texture) {
                text.setVisible(true);
            } else {
                size = cc.size(texture.getContentSize().width + 220, (texture.getContentSize().height + 10));
                texture.setPosition((texture.getContentSize().width + 220) / 2, (texture.getContentSize().height + 10) / 2);
                texture.setTag(2133);
                scale9sprite.addChild(texture);
            }
            scale9sprite.setContentSize(size);
            scale9sprite.setScale(1.2);
            scale9sprite.setVisible(true);
            if (isShake)
                scale9sprite.runAction(cc.sequence(cc.scaleTo(0.2, 1.4), cc.scaleTo(0.2, 1.2)));
            if (!_.isUndefined(timeout)) {
                this.scheduleOnce(function () {
                    that.hideTip();
                }, timeout / 1000, '' + getCurTimemills())
            }
        },
        hideTip: function () {
            if (!isReplay)
                $('top_tip').setVisible(false);
        },
        hideArrow: function () {
            for (var i = 0; i < 4; i++) {
                var arrow = $('row' + i + '.c0.arrow');
                if (arrow)
                    arrow.removeFromParent(true);
            }
        },
        liangAllPai: function () {
            for (var i = 0; i < 14; i++) {
                var pai = this.getPai(2, i);
                var userData = pai.getUserData();
                if (userData.pai) {
                    userData.isLiang = true;
                    Filter.remove(pai);
                }
            }
        },
        selectHideGangCb: function () {
            network.send(4015, {room_id: gameData.roomId, hided_gang_arr: hidedGangArr});
        },
        throwDice: function (title, dice, paiIdA, paiIdB, cb) {
            var that = this;
            title = title || '';
            if (dice < 1 || dice > 6)
                return;
            var layer = that.throwDiceLayer;
            if (!layer) {
                var scene = ccs.load(res.ThrowDice_json);
                layer = scene.node;
                layer.setName('throwDice');
                layer.retain();
                that.throwDiceLayer = layer;
            }
            var paiA = $('root.a0', layer);
            var paiB = $('root.a1', layer);
            paiA.setVisible(false);
            paiB.setVisible(false);
            that.addChild(layer);
            $('root.lb_title', layer).setString(title);
            playThrowDice($('root.dice1', layer), Math.floor(Math.random() * 6) + 1);
            playThrowDice($('root.dice', layer), dice, function () {
                var paiAName = getPaiNameByRowAndId(2, paiIdA, true, false);
                var paiBName = getPaiNameByRowAndId(2, paiIdB, true, false);
                setSpriteFrameByName(paiA, paiAName, 'pai');
                setSpriteFrameByName(paiB, paiBName, 'pai');
                paiA.setVisible(true);
                paiB.setVisible(true);
                setTimeout(function () {
                    layer.removeFromParent(false);
                    if (cb)
                        cb();
                }, 2600);
            });
        },
        showChiLayer: function (paiId, cb, chiStr) {
            var canChiArr = chiStr.split('');
            var that = this;
            // var paiArr = paiArrBak[row] || that.getPaiArr();
            var paiArr = that.getPaiArr();
            paiArr.push(paiId);
            var arr = [
                [paiId - 2, paiId - 1, paiId],
                [paiId - 1, paiId, paiId + 1],
                [paiId, paiId + 1, paiId + 2]
            ];
            var posibleIdxArr = [];
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i][0];
                var b = arr[i][1];
                var c = arr[i][2];
                if (canChiArr[i] == '1' && isSameColor(a, b) && isSameColor(a, c) &&
                    paiArr.indexOf(a) >= 0 && paiArr.indexOf(b) >= 0 && paiArr.indexOf(c) >= 0)
                    posibleIdxArr.push(i);
            }
            if (posibleIdxArr.length == 1) {
                cb(arr[posibleIdxArr[0]][1], paiId);
                // that.sendChiPengGang(OP_CHI, 2, arr[posibleIdxArr[0]][1], paiId);
                that.hideChiPengGangHu();
            }
            else if (posibleIdxArr.length > 1) {
                var layer = that.chiLayer;
                if (!layer) {
                    var scene = ccs.load(res.ChiPanel_json);
                    layer = scene.node;
                    layer.setName('chiLayer');
                    layer.retain();
                    that.chiLayer = layer;
                }
                that.addChild(layer);

                $('root.g0', layer).setVisible(posibleIdxArr.length >= 1);
                $('root.g1', layer).setVisible(posibleIdxArr.length >= 2);
                $('root.g2', layer).setVisible(posibleIdxArr.length >= 3);

                var fun = function (node) {
                    var parentName = node.getParent().getName();
                    var userData = $('root.' + parentName + '.' + 1, layer).getUserData();
                    var _paiId = userData.pai;
                    var paiId = userData.ori_pai_id;
                    cb(_paiId, paiId);
                    // that.sendChiPengGang(OP_CHI, 2, _paiId, paiId);
                    that.hideChiPengGangHu();
                    layer.removeFromParent(false);
                };

                for (var i = 0; i < posibleIdxArr.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        var pai = $('root.g' + i + '.' + j, layer);
                        var _paiId = arr[posibleIdxArr[i]][j];
                        var paiName = getPaiNameByRowAndId(2, _paiId, true, false);
                        pai.setUserData({pai: _paiId, ori_pai_id: paiId});
                        setSpriteFrameByName(pai, paiName, 'pai');

                        TouchUtils.setOnclickListener(pai, fun);
                    }
                }

                TouchUtils.setOnclickListener($('root.btn_close', layer), function () {
                    layer.removeFromParent();
                });
                TouchUtils.setOnclickListener($('root', layer), function () {
                    // layer.removeFromParent();
                });
            }
        },
        playEffect: function (filename, sex) {
            playEffect(filename, sex);
        },
        removeLiangHuTip: function () {
            var t0 = this.getChildByName('hupaitip0');
            var t1 = this.getChildByName('hupaitip1');
            var t2 = this.getChildByName('hupaitip2');
            var t3 = this.getChildByName('hupaitip3');
            t0 && t0.removeFromParent(true);
            t1 && t1.removeFromParent(true);
            t2 && t2.removeFromParent(true);
            t3 && t3.removeFromParent(true);
        },
        showLiangHuTip: function (row, showdata) {
            var isVisible = true;
            var pos = {
                0: {x: 900, y: 560},
                1: {x: 1030, y: 565},
                2: {x: 225, y: 130},
                3: {x: 270, y: 565}
            }[row];
            if (playerNum == 2) {
                pos = {
                    0: {x: 950, y: 455},
                    2: {x: 140, y: 230}
                }[row]
            }
            var ancherX = {
                0: 0,
                1: 1,
                2: 0,
                3: 0
            }[row];
            var posx = pos.x;
            var hupaitip = this.getChildByName('hupaitip' + row);
            if (!isVisible && hupaitip) {
                hupaitip.setVisible(isVisible);
                return;
            }
            if (showdata == null) {
                for (var i = 0; i < 14; i++) {
                    var pai = this.getPai(2, i);
                    var userData = pai.getUserData();
                    userData.hucards = null;
                }
                return;
            }
            var tiplength = showdata.length;
            if (hupaitip)
                hupaitip.removeFromParent(true);
            var hupaitip = new cc.Scale9Sprite(res.toast_bg2, cc.rect(0, 0, 28, 65), cc.rect(14, 14, 1, 1));
            hupaitip.setName('hupaitip' + row);
            hupaitip.setAnchorPoint(cc.p(ancherX, 0));
            hupaitip.setContentSize(cc.size(64 + 55 * tiplength, 80));
            hupaitip.setPosition(pos);
            this.addChild(hupaitip);
            //设置位置
            // posx = posx + 40;
            //
            // if (posx + hupaitip.getContentSize().width / 2 > window.maLayer.getContentSize().width) {
            //     posx = window.maLayer.getContentSize().width - hupaitip.getContentSize().width / 2 - 20;
            // } else if (posx - hupaitip.getContentSize().width / 2 < 0) {
            //     posx = hupaitip.getContentSize().width / 2 + 20;
            // }

            var huSprite = new cc.Sprite(res.hupai_tips_icon);
            huSprite.setPosition(cc.p(10, hupaitip.getContentSize().height / 2 - 3));
            hupaitip.addChild(huSprite);
            // huSprite.setScale(1.5);
            for (var i = 0; i < 9; i++) {
                //card
                var card = new cc.Sprite();
                card.setScale(0.88);
                card.setName('card' + (i + 1));
                card.setPosition(cc.p(30 + 55 * (i + 1), hupaitip.getContentSize().height / 2 - 2));
                hupaitip.addChild(card);

                if (tiplength > i) {
                    card.setVisible(true);
                    var paiName = getPaiNameByRowAndId(2, showdata[i], true, true);
                    setSpriteFrameByName(card, paiName, 'pai');
                } else {
                    card.setVisible(false);
                }
            }
            hupaitip.setScale(0.65)
        },
        hideSelectedPiao: function () {
            for (var i = 0; i < 4; i++) {
                var sp = $('info_n' + i + '.piao');
                sp && sp.setVisible(false);
            }
            $('piao_bar').setVisible(false);
        },
        showSelectPiao: function (selectPiaoMap) {
            var isAllSelected = true;
            for (var uid in selectPiaoMap)
                if (selectPiaoMap.hasOwnProperty(uid) && uid && selectPiaoMap[uid] < 0) {
                    isAllSelected = false;
                    break;
                }
            if (isAllSelected) {
                for (var uid in selectPiaoMap)
                    if (selectPiaoMap.hasOwnProperty(uid)) {
                        var row = uid2position[uid];
                        var sp = $('info_n' + row + '.piao');
                        sp && sp.setVisible(false);

                        var lbBs = $('info' + row + '.lb_bs');
                        var spBs = $('info' + row + '.sp_bs');
                        if (lbBs && spBs) {
                            lbBs.setVisible(true);
                            spBs.setVisible(true);
                            if (selectPiaoMap[uid] == 0) {
                                lbBs.setString('不漂');
                                spBs.setTexture(cc.textureCache.addImage(res.bujiapiao_png));
                            } else {
                                lbBs.setString('加' + selectPiaoMap[uid] + '漂');
                                spBs.setTexture(cc.textureCache.addImage(res.jiaNpiao_png));
                            }
                        }
                        $('info' + row + '.sp_piaostate0').setVisible(false);
                        $('info' + row + '.sp_piaostate1').setVisible(false);
                    }
            }
            else {
                for (var uid in selectPiaoMap)
                    if (selectPiaoMap.hasOwnProperty(uid)) {
                        var row = uid2position[uid];
                        var lbBs = $('info' + row + '.lb_bs');
                        lbBs && lbBs.setVisible(false);
                    }
                if (selectPiaoMap[gameData.uid] < 0) {
                    $('piao_bar').setVisible(true);
                    var piao0 = $('piao_bar.piao0');
                    var isShowPiao0 = gameData.triggers && gameData.triggers[9];
                    isShowPiao0 && TouchUtils.setOnclickListener($('piao_bar.piao0'), function () {
                        network.send(4033, {room_id: gameData.roomId, piao: 0});
                    });
                    if (!isShowPiao0 && piao0.isVisible()) {
                        var p1 = $('piao_bar.piao1');
                        var p2 = $('piao_bar.piao2');
                        p1.setPositionX(p1.getPositionX() - 150);
                        p2.setPositionX(p2.getPositionX() - 150);
                    }
                    piao0.setVisible(isShowPiao0);
                    TouchUtils.setOnclickListener($('piao_bar.piao1'), function () {
                        network.send(4033, {room_id: gameData.roomId, piao: 1});
                    });
                    TouchUtils.setOnclickListener($('piao_bar.piao2'), function () {
                        alert2("确定要 加2漂 吗?", function () {
                            network.send(4033, {room_id: gameData.roomId, piao: 2});
                        }, function () {
                        }, false, true, true, true);
                    });
                }
                for (var uid in selectPiaoMap) {
                    if (!selectPiaoMap.hasOwnProperty(uid))
                        continue;

                    var row = uid2position[uid];
                    var piao = selectPiaoMap[uid];
                    if (row == 2 && piao >= 0)
                        $('piao_bar').setVisible(false);
                    if (row == 2 && piao < 0)
                        continue;

                    // var sp = $('info_n' + row + '.piao');
                    // if (!sp) {
                    //     sp = new cc.Sprite('res/table/ps0' + (row == 0 || row == 2 ? '' : 'v') + '.png');
                    //     sp.setName('piao');
                    //     $('info_n' + row).addChild(sp);
                    // }
                    // sp.setTexture(cc.textureCache.addImage((piao < 0 ? 'res/table/ps0' : 'res/table/ps1') + (row == 0 || row == 2 ? '' : 'v') + '.png'));
                    // sp.setVisible(true);

                    var sp_piao = $('info' + row + '.sp_piaostate0')
                    if (sp_piao) {
                        // var texture = cc.textureCache.addImage((piao < 0 ? 'res/table/word_xpz' : 'res/table/word_yxp') + '.png');
                        // sp_piao.setTexture(texture);
                        // var contentSize = texture._contentSize;
                        // var rect = cc.rect(
                        //     0, 0,
                        //     contentSize.width, contentSize.height
                        // );
                        // sp_piao.setTextureRect(rect);
                    }
                    if (piao < 0) {
                        $('info' + row + '.sp_piaostate0').setVisible(true);
                        $('info' + row + '.sp_piaostate1').setVisible(false);
                    } else {
                        $('info' + row + '.sp_piaostate0').setVisible(false);
                        $('info' + row + '.sp_piaostate1').setVisible(true);
                    }
                }
            }
        },
        onSendEffectEmoji: function (emojiIdx, times, targetUid) {
            var _obj = [];
            _obj.push(targetUid);
            network.send(4990, {room_id: gameData.roomId, emoji_idx: emojiIdx, emoji_times: times, target_uid: _obj});
        },
        addEffectEmojiQueue: function (caster, patientList, emojiId, times) {


            if(emojiId==6)
            {

                var allCfg={
                    24:{rotate:60},

                };

                // cc.log("node.getRootNode()===="+node.getRootNode().getName());



                var sp = new cc.Sprite();
                this.getRootNode().addChild(sp, 30);
                var _casterRow = uid2position[caster];
                var _patientRow = uid2position[patientList];
                var _beginPos = $('effectemoji' + _casterRow).getPosition();
                var _endPos = $('effectemoji' + _patientRow).getPosition();



                var hudu=cc.pAngle(_beginPos,_endPos);


                // var jiao=jiaodu * 180 / Math.PI;

                // var angle = Math.floor(180/(Math.PI/hudu));

                var angle = cc.radiansToDegrees(hudu);

                angle=90-getAngleByPos(_beginPos,_endPos);

                var jiaodu=getAngleByPos(_beginPos,_endPos);

                cc.log("jiaodujiaodu="+angle);

                sp.setPosition(_beginPos);
                var effect_emoji ="jiatelin_qiang_json";
                playEffect("vJiatelin");
                for (var i=0;i<20;i++)
                {
                    setTimeout(function () {
                        var zidan = new cc.Sprite("res/effect/jiatelin_zidan.png");

                        var zidanPos=cc.p(0,0);
                        zidan.setPosition(zidanPos);
                        zidan.setRotation(angle);
                        zidan.setOpacity(0);
                        sp.addChild(zidan, 30);
                        var x2=Math.ceil(Math.random()*50);
                        var y2=Math.ceil(Math.random()*50);

                        var ePos=cc.p(_endPos.x-_beginPos.x+x2-30, _endPos.y-_beginPos.y+y2-30)
                        var lenth=cc.pDistance(zidanPos,ePos);

                        var time=lenth/3000

                        var spa=cc.spawn(cc.fadeTo(time/6,255),cc.moveTo(time, ePos.x, ePos.y));
                        zidan.runAction(cc.sequence(
                            spa
                            , cc.callFunc(function () { zidan.removeFromParent(true);
                                var dankong = new cc.Sprite("res/effect/jiatelin_dankong.png");
                                dankong.setPosition(cc.p(ePos.x+x2, ePos.y+y2));
                                sp.addChild(dankong, 30);

                            })
                        ));

                    }, i*100);
                }
                var cacheNode = playAnimScene2(sp, res[effect_emoji], 0,0, false, function () {
                    sp.removeAllChildren();
                });
                cacheNode.setRotation(angle);
                return
            }


            var _casterRow = uid2position[caster];
            var _patientRowList = [];
            for (var _j = 0; _j < patientList.length; _j++) {

                _patientRowList.push(uid2position[patientList[_j]]);
            }
            if (_.isUndefined(effectEmojiQueue[_casterRow])) {
                effectEmojiQueue[_casterRow] = [];
            }
            var _needBigenQueue = this.isEffectEmojiEmpty();
            var _obj = {};
            _obj.patientList = _patientRowList;
            _obj.emojiId = emojiId;
            for (var _i = 0; _i < times; _i++) {
                effectEmojiQueue[_casterRow].push(_obj);
            }
            if (_needBigenQueue) {
                this.startEffectEmojiQueue();
            }
        },
        isEffectEmojiEmpty: function () {
            for (var _key in effectEmojiQueue) {
                if (effectEmojiQueue.hasOwnProperty(_key)) {
                    if (effectEmojiQueue[_key].length > 0) {
                        return false;
                    }
                }
            }
            return true;
        },
        startEffectEmojiQueue: function () {

            var that = this;
            for (var _key in effectEmojiQueue) {
                if (effectEmojiQueue.hasOwnProperty(_key)) {
                    var _obj = effectEmojiQueue[_key];
                    if (_obj.length > 0) {
                        for (var _i = 0; _i < _obj[0].patientList.length; _i++) {
                            that.playEffectEmoji(_key, _obj[0].patientList[_i], _obj[0].emojiId);
                        }
                        effectEmojiQueue[_key].splice(0, 1);
                    }
                }
            }
            if (!that.isEffectEmojiEmpty()) {
                that.runAction(cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(function () {
                        that.startEffectEmojiQueue();
                    })
                ))
            }
        },
        playEffectEmoji: function (caster, patient, emojiId) {
            var _emojiCfg = effectEmojiCfg[emojiId];
            if (_.isUndefined(_emojiCfg)) {
                return;
            }

            var sp = new cc.Sprite();
            this.getRootNode().addChild(sp, 30);
            this.effectEmojiBegin(_emojiCfg, sp, caster, patient);
        },
        effectEmojiBegin: function (emojiCfg, sp,caster, patient) {

            var that = this;
            var _beginPos = $('effectemoji' + caster).getPosition();
            sp.setPosition(_beginPos);
            var effect_emoji = 'effect_emoji_' + emojiCfg.name + "_1";

            playAnimScene2(sp, res[effect_emoji], 0, 0, false, function () {
                sp.removeAllChildren();
                that.effectEmojiflying(emojiCfg, sp, caster, patient);
            });
        },
        effectEmojiflying: function (emojiCfg, sp,caster, patient) {
            var that = this;

            var _endPos = patient != 2 ? $('effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            sp.stopAllActions();
            var effect_emoji = 'effect_emoji_' + emojiCfg.name + "_2";
            playAnimScene2(sp, res[effect_emoji], 0, 0, true);
            sp.runAction(cc.sequence(
                patient != 2 ? cc.moveTo(0.5, _endPos) : cc.spawn(cc.moveTo(0.5, _endPos), cc.scaleTo(0.5, 4)),
                cc.callFunc(function () {
                    sp.removeAllChildren();
                    that.effectEmojiend(emojiCfg, sp, caster, patient);
                })
            ));
        },
        effectEmojiend: function (emojiCfg, sp, caster, patient) {

            var _offsetX = patient == 2 ? emojiCfg.offsetX * 4 : emojiCfg.offsetX;
            var _offsetY = patient == 2 ? emojiCfg.offsetY * 4 : emojiCfg.offsetY;


            sp.setRotation(0);
            sp.setPosition(cc.p(sp.getPositionX() + _offsetX, sp.getPositionY() + _offsetY));
            playEffect('vEffect_emoji_' + emojiCfg.name);
            var effect_emoji = 'effect_emoji_' + emojiCfg.name + "_3";
            playAnimScene2(sp, res[effect_emoji], 0, 0, false, function () {
                sp.runAction(cc.sequence(
                    cc.fadeOut(0.3),
                    cc.callFunc(function () {
                        sp.removeFromParent();
                    })
                ))
            });
        },
        showChangeScore: function (row, score) {
            if (!score) {
                return;
            }
            var txt = new cc.LabelBMFont(score > 0 ? "+" + score : score, score < 0 ? res.score_blue_fnt : res.score_yellow_fnt);
            var change_sroce_node = $("info" + row + ".change_sroce_node");
            change_sroce_node.addChild(txt);
            txt.runAction(
                cc.sequence(
                    cc.moveBy(2, cc.p(0, 30)),
                    cc.callFunc(function () {
                        txt.removeFromParent(true);
                    })
                )
            );
        },
        changeBtnStatus: function () {
            $('btn_bg').setVisible(!$('btn_bg').isVisible());
            $('setting').setVisible(!$('setting').isVisible());
            $('chat').setVisible(!$('chat').isVisible());
            $('jiesan').setVisible(!$('jiesan').isVisible());
            $('btn_control_btns').setFlippedY(!$('btn_control_btns').isFlippedY());
        },
        hideControlBtns: function () {
            $('btn_bg').setVisible(false);
            $('setting').setVisible(false);
            $('chat').setVisible(false);
            $('jiesan').setVisible(false);
            $('btn_control_btns').setFlippedY(true);
        },
        showWanfaLogo: function (name) {
            var logoName = null;
            switch (name) {
                case "襄阳卡五星":
                    logoName = "xykwx";
                    break;
                case "孝感卡五星":
                    logoName = "xgkwx";
                    break;
                case "随州卡五星":
                    logoName = "szkwx";
                    break;
                case "十堰卡五星":
                    logoName = "sykwx";
                    break;
                case "荆州晃晃":
                    logoName = "jzhh";
                    break;
                case "武汉麻将":
                    logoName = "wh";
                    break;
                case "开口翻":
                    logoName = "whkkf1";
                    break;
                case "口口翻":
                    logoName = "whkkf2";
                    break;
                case "宜昌血流":
                    logoName = "ycxl";
                    break;
                case "宜城卡五星":
                    logoName = "yckwx";
                    break;
                case "仙桃晃晃":
                    logoName = "xthh";
                    break;
                default:
                    cc.log("未知玩法------  " + name);
            }
            if (logoName) {
                $('logo').setTexture("res/table/logos/" + logoName + ".png");
            } else {
                $('logo').setVisible(false);
            }
        }
    });
    exports.MaLayer_kwx = MaLayer_kwx;
    exports.MaLayer_kwx.getPaiNameByRowAndId = getPaiNameByRowAndId;
})(window);
