"use strict";
(function () {
    var $ = null;

    var PAINAMES = ["", "一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万", "一条", "二条", "三条", "四条", "五条", "六条", "七条", "八条", "九条", "一筒", "二筒", "三筒", "四筒", "五筒", "六筒", "七筒", "八筒", "九筒"];

    // CONST
    var FAPAI_ANIM_DELAY = 0.04;
    var FAPAI_ANIM_DURATION = 0.2;
    var MOPAI_ANIM_DURATION = 0.3;
    var UPDOWNPAI_ANIM_DURATION = 0.088;
    var UPPAI_Y = 30;
    //出牌时缩放
    var CHUPAI_MID_NODE_SCALE_MAP = {0: 0.8, 2: 0.8, 1: 0.8, 3: 0.8};

    var MAP2PNUM = {1: 4, 2: 3};

    var OP_CHI = 1;
    var OP_PENG = 2;
    var OP_GANG = 3;
    var OP_HU = 4;
    var OP_PASS = 5;
    var OP_TING = 6;
    var OP_LIANG = 7;
    var OP_FEI = 8;
    var OP_TI = 9;
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
        //胡牌与手牌的间距
        , paiALiangDistance: [-1.5, 3.5, 0, -3.5]
        , paiMopaiDistance: {0: 16, 1: 40, 2: 34, 3: 40}
        , paiGDistance: []
        , paiUsedDistance: []
        , paiUsedZOrder: {
            0: {0: -1, 10: 0, 20: 1, 40: 2}
            , 1: {0: -1, 10: -1, 20: -1, 30: -1, 40: -1, 50: -1}
            , 2: {0: 0, 10: -1, 20: -2, 40: -3}
            , 3: {0: 0, 10: 1, 20: 2, 30: 3, 40: 4, 50: 5}
        }
        // , paiUsedZOrder: {
        //     0: {0: -1, 10: 0}
        //     , 1: {0: -1, 10: -1}
        //     , 2: {0: 0, 10: -1}
        //     , 3: {0: 0, 10: 1}
        // }
        , cpghgPositionX: {
            2: [660, 920], 3: [425, 700, 960], 4: [320, 580, 840, 1070],
            5: [210, 460, 700, 940, 1130], 6: [210, 460, 700, 940, {x: 700, y: 360}, 1180],
            8: [660, 920], 9: [660, 920]
        }
        , upPaiPositionY: null
        , downPaiPositionY: null
        , groupWidth: {}
        , groupHeight: {}
        , groupDistance: {0: 4, 1: -10, 2: 16, 3: -10}
        , groupToFirstPaiDistance: {0: 10, 1: -24, 2: 26, 3: -24}

        , paiPos: {}

        , ltqpPos: {}
        , ltqpRect: {}
        , ltqpCapInsets: {
            0: cc.rect(26, 31, 1, 1)
            , 1: cc.rect(26, 31, 1, 1)
            , 2: cc.rect(44, 25, 1, 1)
            , 3: cc.rect(42, 26, 1, 1)
        }
        , ltqpEmojiPos: {
            0: cc.p(40, 28)
            , 1: cc.p(39, 28)
            , 2: cc.p(40, 40)
            , 3: cc.p(56, 28)
        }
        , ltqpVoicePos: {
            0: cc.p(40, 28)
            , 1: cc.p(37, 28)
            , 2: cc.p(42, 40)
            , 3: cc.p(58, 28)
        }
        , ltqpEmojiSize: {}
        , ltqpTextDelta: {
            0: cc.p(0, -4)
            , 1: cc.p(-7, 2)
            , 2: cc.p(-1, 9)
            , 3: cc.p(8, 3)
        }
    };

    var data;
    var isReconnect;

    var roomState = null;
    var mapId = 2;
    var playerNum = 4;
    var rowBegin = 1;

    var enableChupaiCnt = 0;

    // var isNotLiang = false;

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

    var afterLianging = false;

    var disabledChuPaiIdMap = {};

    var disableChupai = false;

    var selectingXiaohu = false;

    // for wuhan
    var laiziPaiId = 0;
    var laizipiPaiAId = 0;
    var laizipiPaiBId = 0;

    // for sichuan
    var position2que = {};
    var position2quelr = {};
    var isHuansanzhanging = false;

    var bShowVideo = false;

    var clearVars = function () {
        roomState = null;
        mapId = gameData.mapId;
        playerNum = gameData.playerNum || MAP2PNUM[gameData.appId] || 4;
        rowBegin = 1;
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
        enableChupaiCnt = 0;

        laiziPaiId = 0;
        laizipiPaiAId = 0;
        laizipiPaiBId = 0;

        position2que = {};
        position2quelr = {};
        isHuansanzhanging = false;

        // isNotLiang = false;
    };

    var getPaiNameByRowAndId = function (row, id, isLittle, isStand) {
        var prefix;

        var ret = null;

        if (row == 0 && isLittle) prefix = "p0s";
        if (row == 0 && !isLittle) prefix = "p2l";
        if (row == 1 && isLittle) prefix = "p1s";
        if (row == 1 && !isLittle) prefix = "p2l";
        if (row == 2 && isLittle) prefix = "p2s";
        if (row == 2 && !isLittle) prefix = "p2l";
        if (row == 3 && isLittle) prefix = "p3s";
        if (row == 3 && !isLittle) prefix = "p2l";

        if (prefix) ret = prefix + id + ".png";

        if (row == 0 && id == 0 && isLittle) ret = "p0s0" + ".png";
        if (row == 1 && id == 0 && isLittle) ret = "p1s0" + ".png";
        //if (row == 2 && id == 0 && isLittle) ret = '' + '.png';
        if (row == 3 && id == 0 && isLittle) ret = "p3s0" + ".png";
        //if (row == 0 && id == 0 && !isLittle) ret = 'bs' + '.png';
        //if (row == 1 && id == 0 && !isLittle) ret = 'bh' + '.png';
        if (row == 2 && id == 0 && !isLittle) ret = "p2l0" + ".png";
        //if (row == 3 && id == 0 && !isLittle) ret = 'bh' + '.png';

        if (row == 0 && isStand && isLittle) ret = "h0s" + ".png";
        if (row == 1 && isStand && isLittle) ret = "h1s" + ".png";
        if (row == 3 && isStand && isLittle) ret = "h3s" + ".png";
        if (row == 0 && isStand && !isLittle) ret = "p2l0" + ".png";
        if (row == 1 && isStand && !isLittle) ret = "by" + ".png";
        if (row == 3 && isStand && !isLittle) ret = "bz" + ".png";

        return ret;
    };

    window.MaLayer_sc_mz = cc.Layer.extend({
        chatLayer: null,
        chiLayer: null,
        settingLayer: null,
        throwDiceLayer: null,
        kaigangLayer: null,
        beforeOnCCSLoadFinish: null,
        afterGameStart: null,
        //todo 相同牌存储变量1
        allCache: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        getRootNode: function () {
            return this.getChildByName("Scene");
        },
        initExtraMapData: function (data) {
            var that = this;
            if (mapId == MAP_ID.SICHUAN_YB || mapId == MAP_ID.WUHAN_KOUKOU) {
                laiziPaiId = data["laizi"];
                laizipiPaiAId = data["laizipi_a"];
                laizipiPaiBId = data["laizipi_b"];

                var laiziPanel = $("laizi_panel");

                if (!laiziPanel) {
                    var pai = new cc.Sprite("#p2l8.png");

                    var showPai = laiziPaiId;
                    if (mapId == MAP_ID.SICHUAN_YB) {
                        showPai = laizipiPaiAId;
                    }
                    //laizi_bg换去图框
                    var paiName = getPaiNameByRowAndId(2, showPai, false, false);
                    setSpriteFrameByName(pai, paiName, "pai");
                    if (mapId == MAP_ID.SICHUAN_YB) {
                        laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");

                    } else {
                        laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");
                    }
                    pai.setPosition(85, 655);
                    pai.setScale(0.5);
                    that.addChild(pai);

                    {
                        var pai = new cc.Sprite("#p2l8.png");
                        var showPai = laiziPaiId;
                        if (mapId == MAP_ID.SICHUAN_YB) {
                            showPai = laizipiPaiAId;
                        }
                        //laizi_bg换去图框
                        var paiName = getPaiNameByRowAndId(2, laiziPaiId[0], false, false);
                        setSpriteFrameByName(pai, paiName, "pai");
                        if (mapId == MAP_ID.SICHUAN_YB) {
                            laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");

                        } else {
                            laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");

                        }
                        pai.setPosition(40, 655);
                        pai.setScale(0.5);
                        pai.setColor(cc.color(255, 255, 0));
                        that.addChild(pai);
                    }
                    {
                        var pai = new cc.Sprite("#p2l8.png");
                        var showPai = laiziPaiId;
                        if (mapId == MAP_ID.SICHUAN_YB) {
                            showPai = laizipiPaiAId;
                        }
                        //laizi_bg换去图框
                        var paiName = getPaiNameByRowAndId(2, laiziPaiId[1], false, false);
                        setSpriteFrameByName(pai, paiName, "pai");
                        if (mapId == MAP_ID.SICHUAN_YB) {
                            laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");
                        } else {
                            laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");
                        }

                        pai.setPosition(130, 655);
                        pai.setScale(0.5);
                        pai.setColor(cc.color(255, 255, 0));
                        that.addChild(pai);
                    }
                    if (laiziPaiId[2] != 0) {
                        pai.setPosition(85, 655);
                        {
                            var pai = new cc.Sprite("#p2l8.png");
                            var showPai = laiziPaiId;
                            if (mapId == MAP_ID.SICHUAN_YB) {
                                showPai = laizipiPaiAId;
                            }
                            //laizi_bg换去图框
                            var paiName = getPaiNameByRowAndId(2, laiziPaiId[2], false, false);
                            setSpriteFrameByName(pai, paiName, "pai");
                            if (mapId == MAP_ID.SICHUAN_YB) {
                                laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");
                            } else {
                                laiziPanel = new cc.Sprite("res/submodules/majiang/image/ma_sc/laizi_bg.png");
                            }
                            pai.setPosition(130, 655);
                            pai.setScale(0.5);
                            pai.setColor(cc.color(255, 255, 0));
                            that.addChild(pai);
                        }
                    }
                }
                if (laiziPaiId[2] == 0) {
                    //本金的显示
                    var benjin = $("benjin");
                    if (!benjin) {
                        if (mapId == MAP_ID.SICHUAN_YB) {
                            benjin = new cc.Sprite("res/submodules/majiang/image/ma_sc/benjin.png");
                        } else {
                            benjin = new cc.Sprite("res/submodules/majiang/image/ma_sc/benjin.png");
                        }
                        laiziPanel.addChild(benjin);
                        benjin.setPosition(80, 40);
                    }
                }
            }
        },
        onCCSLoadFinish: function () {
            var that = this;

            if ((mapId || gameData.mapId) == MAP_ID.SICHUAN_XUELIU)
                addCachedCCSChildrenTo(res.MaScene1Xueliu_json, this);
            else
                addCachedCCSChildrenTo(res.MaScene1_Sc_json, this);
            batchSetChildrenZorder(this.getRootNode(), {
                info0: 1, info1: 1, info2: 11, info3: 3,
                info_n0: 2, info_n1: 2, info_n2: 20, info_n3: 4,
                row2: 10, row3: 2,
                cpghg: 11, wtt: 12, piao: 11,
                btn_bg: 30, setting: 31, chat: 31, jiesan: 31,
                qn1: 1001, qn2: 1200, qn3: 1300, qn0: 1400
            });

            $ = create$(this.getRootNode());
            this.getPai = this.getPai();
            this.getGPai = this.getGPai();
            this.addUsedPai = this.addUsedPai();
            this.countDown = this.countDown();

            this.calcPosConf();

            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1) {
                EFFECT_EMOJI_NEW.init(this, $);
            }else{
                EFFECT_EMOJI.init(this, $);
            }

            MicLayer.init($("btn_mic"), this);
            this.initBG();
            this.getVersion();

            this.initClubAssistant();

            //绵竹默认四川话   三人两房默认普通话
            gameData.speakSiChuanH = cc.sys.localStorage.getItem("speakSiChuanH" + gameData.mapId)
            if(mapId == MAP_ID.SICHUAN_TRLF){
                if (gameData.speakSiChuanH == undefined || gameData.speakSiChuanH == null) gameData.speakSiChuanH = 0;
            }else{
                if (gameData.speakSiChuanH == undefined || gameData.speakSiChuanH == null) gameData.speakSiChuanH = 1;
            }
            gameData.speakSiChuanH = parseInt(gameData.speakSiChuanH);

            if (isReconnect) {
                gameData.zhuangUid = data["zhuang_uid"];
                gameData.leftRound = data["left_round"];
                gameData.players = data["players"];
                gameData.wanfaDesp = data["desp"];

                gameData.total_round = data["total_round"];

                var status = data["room_status"] || ROOM_STATE_ONGOING;
                if (status == ROOM_STATE_ENDED) {
                    this.setRoomState(ROOM_STATE_ONGOING);
                    this.setRoomState(ROOM_STATE_ENDED);
                }
                else {
                    this.setRoomState(status);
                }

                this.initExtraMapData(data);
            }
            else
                this.setRoomState(ROOM_STATE_CREATED);

            //this.initWanfa();

            this.clearTable4StartGame(isReconnect, isReconnect, data);

            this.startTime();

            this.startSignal();

            $('hupai_tip').setVisible(false);

            // TouchUtils.setOnclickListener($('bg'), function(){
            //     that.HuCardTip(null, null, false);
            //     for (var i = 0; i < 14; i++) {
            //         var pai = that.getPai(2, i);
            //         if (!pai.isVisible())
            //             continue;
            //         that.downPai(2, i);
            //     }
            // }, {effect: TouchUtils.effects.NONE});

            TouchUtils.setOnclickListener($("chat"), function () {
                if (!that.chatLayer) {
                    that.chatLayer = new ChatLayer();
                    that.chatLayer.retain();
                }
                that.addChild(that.chatLayer);
            });


            TouchUtils.setOnclickListener($("safe_gps"), function () {
                var data = gameData.players || [];
                var pos = 0;
                if (isReplay == true) {
                    pos = 0;
                } else {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].uid == gameData.uid) {
                            pos = i;
                        }
                    }
                }
                that.pos0 = pos;
                that.pos1 = (pos + 1) % gameData.playerNum;
                that.pos2 = (pos + 2) % gameData.playerNum;
                this.pos3 = (pos + 3) % gameData.playerNum;

                var posArr = {};
                if (gameData.players.length == 2) {
                    posArr = {pos0: that.pos0, pos1: that.pos1};
                }
                else if (gameData.players.length == 3) {
                    posArr = {pos0: that.pos0, pos1: that.pos1, pos2: that.pos2};
                }
                else if (gameData.players.length == 4) {
                    posArr = {pos0: that.pos0, pos1: that.pos1, pos2: that.pos2, pos3: that.pos3};
                }
                var safelayer = new SafeTipLayer(that, posArr);
                safelayer.setName("safelayer");
                that.addChild(safelayer, 10);
            });
            $("ma_refresh").setVisible(gameData.opt_conf['refresh_table']);
            TouchUtils.setOnclickListener($("ma_refresh"), function () {
                network.disconnect();
            });
            TouchUtils.setOnclickListener($("btn_bg"), function () {

            });

            TouchUtils.setOnclickListener($("setting"), function () {
                var isStart = false;
                if (that.getRoomState() == ROOM_STATE_ONGOING) {
                    isStart = true;
                }
                var setting = HUD.showLayer(HUD_LIST.Settings, that, false, true);
                setting.setSetting(that, "majiang");//niuniu打开的界面
                setting.setLocalZOrder(5);
                setting.setSettingLayerType({
                    hidelogout: true,
                    hideyijianxiufu: true,
                    isStart: isStart,
                    gameName: "dn"
                });
            });

            TouchUtils.setOnclickListener($("jiesan"), function () {
                alert2("确定要申请解散房间吗？", function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                }, null, false, false, true, true);
            });

            TouchUtils.setOnclickListener($("btn_control_btns"), function () {
                that.changeBtnStatus();
            });

            TouchUtils.setOnclickListener($("btn_zhunbei"), function () {
                network.send(3004, {room_id: gameData.roomId});
            });
            TouchUtils.setOnclickListener($("btn_invite"), function () {
                // if (!cc.sys.isNative)
                //     return;

                var parts = decodeURIComponent(gameData.wanfaDesp).split(",");
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(", ") + ", " : "");
                var regx = new RegExp("\\,", "g");
                var content = wanfa_str.replace(regx, "/");
                var title = gameData.companyName + "麻将-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                console.log(title);
                console.log(content);
                if (!cc.sys.isNative)
                    return;
                var shareurl = getShareUrl(gameData.roomId);
                WXUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_inviteLiaoBei"), function () {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(",");
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(", ") + ", " : "");
                var regx = new RegExp("\\,", "g");
                var content = wanfa_str.replace(regx, "/");
                var title = gameData.companyName + "麻将-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                console.log(title);
                console.log(content);
                if (!cc.sys.isNative)
                    return;
                var shareurl = getShareUrl(gameData.roomId);
                LBUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_inviteXianLiao"), function () {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(",");
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(", ") + ", " : "");
                var regx = new RegExp("\\,", "g");
                var content = wanfa_str.replace(regx, "/");
                var title = gameData.companyName + "麻将-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                console.log(title);
                console.log(content);
                if (!cc.sys.isNative)
                    return;
                XianLiaoUtils.shareGame(gameData.roomId, title, gameData.companyName + "麻将-" + content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_copy"), function () {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(",");
                var mapName = parts[1];
                parts.splice(1, 1);
                var shareurl = getShareUrl(gameData.roomId);
                var shareText = "【" + gameData.companyName + "麻将】\n" + mapName + "\n房号: " + ToDBC(gameData.roomId) + "\n"
                    + (parts.length ? parts.join(", ") + ", " : "") + "速度来啊！" +
                    shareurl;
                console.log(shareText);
                showMessage("您的房间信息已复制，请粘贴至微信处分享", {fontName: "res/fonts/FZCY.ttf"});
                if (!cc.sys.isNative)
                    return;
                savePasteBoard(shareText);
            });
            TouchUtils.setOnclickListener($("btn_fanhui"), function () {
                if (gameData.uid != gameData.ownerUid) {
                    alert2("确定要退出房间吗?", function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, true, true);
                }
            });
            TouchUtils.setOntouchListener($("btn_wanfa"), null, {
                onTouchBegan: function () {
                    that.showWanfaLayer();
                },
                onTouchEnded: function () {
                    that.hideWanfaLayer();
                }
            });
            TouchUtils.setOnclickListener($("btn_jiesan"), function () {
                if (window.inReview) {
                    network.send(3003, {room_id: gameData.roomId});
                } else {
                    alert2("解散房间不扣房卡，是否确定解散？", function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, true, true);
                }
            });

            TouchUtils.setOnclickListener($("info0"), function () {
                that.showPlayerInfoPanel(0);
            });
            TouchUtils.setOnclickListener($("info1"), function () {
                that.showPlayerInfoPanel(1);
            });
            TouchUtils.setOnclickListener($("info2"), function () {
                that.showPlayerInfoPanel(2);
            });
            TouchUtils.setOnclickListener($("info3"), function () {
                that.showPlayerInfoPanel(3);
            });
            network.addListener(3002, function (data) {

                gameData.last3002 = data;
                gameData.playerNum = data["max_player_cnt"];

                if (isReplay) {
                    mapId = data["map_id"];
                    gameData.mapId = data["map_id"];
                    gameData.wanfaDesp = data["desp"];
                }
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.ownerUid = data["owner"];
                    gameData.players = data["players"];
                    that.onPlayerEnterExit();
                }
            });
            network.addListener(3003, function (data) {
                var uid = data["uid"];
                if (uid == gameData.uid) {
                    HUD.showScene(HUD_LIST.Home, that);
                    return;
                }
                if (that.getRoomState() == ROOM_STATE_ONGOING)
                    return;
                if (data["del_room"]) {
                    var owner = uid2playerInfo[gameData.ownerUid];
                    alert1("房主" + (owner ? owner.nickname : data["nickname"] || "") + "已解散房间", function () {
                        HUD.showScene(HUD_LIST.Home, that);
                    });
                }
                else {
                    var uid = data["uid"];
                    _.remove(gameData.players, function (player) {
                        return player.uid == uid;
                    });
                    that.onPlayerEnterExit();
                }
            });
            network.addListener(3004, function (data, errCode) {
                if (!errCode) {
                    if (that.getRoomState() != ROOM_STATE_ENDED)
                        return;
                    var uid = data["uid"];
                    that.setReady(uid);
                }
            });
            network.addListener(3013, function (data) {
                gameData.numOfCards = data["numof_cards"];
            });
            network.addListener(3005, function (data) {
            });
            network.addListener(3008, function (data) {
                var uid = data["uid"];
                var type = data["type"];
                var voice = data["voice"];
                var content = decodeURIComponent(data["content"]);
                that.showChat(uid2position[uid], type, content, voice);
            });
            network.addListener(3009, function (data) {
                if (data["arr"] == null || data["arr"] == undefined || data["arr"] == "" || (data["arr"] && data["arr"].length == 0)) {
                    return;
                }

                var arr = data["arr"];
                var isJiesan = data["is_jiesan"];
                var refuseUid = data["refuse_uid"];
                var leftSeconds = data["left_sec"];
                leftSeconds = (leftSeconds < 0 ? 0 : leftSeconds);
                if (isJiesan) {
                    var nicknameArr = [];
                    for (var i = 0; i < arr.length; i++) {
                        nicknameArr.push("【" + gameData.playerMap[arr[i].uid].nickname + "】");
                    }
                    var shenqingjiesanLayer = $("shenqingjiesan", that);
                    if (shenqingjiesanLayer)
                        shenqingjiesanLayer.removeFromParent(true);
                    alert1("经玩家" + nicknameArr.join(",") + "同意, 房间解散成功", function () {
                    });
                }
                else if (refuseUid) {
                    var shenqingjiesanLayer = $("shenqingjiesan", that);
                    if (shenqingjiesanLayer)
                        shenqingjiesanLayer.removeFromParent(true);
                    alert1("由于玩家【" + gameData.playerMap[refuseUid].nickname + "】拒绝，房间解散失败，游戏继续");
                }
                else {
                    var byUserId = gameData.uid;
                    if (data && data["arr"] && data["arr"][0] && data["arr"][0].uid) {
                        byUserId = data["arr"][0].uid;
                    }

                    var shenqingjiesanLayer = $("shenqingjiesan", that);
                    if (!shenqingjiesanLayer) {
                        shenqingjiesanLayer = new ShenqingjiesanLayer();
                        shenqingjiesanLayer.setName("shenqingjiesan");
                        that.addChild(shenqingjiesanLayer);
                    }
                    shenqingjiesanLayer.setArrMajiang(leftSeconds, arr, byUserId, data);
                }
            });
            network.addListener(3200, (function () {
                var interval = null;
                return function (data) {
                    if (interval) {
                        clearInterval(interval);
                        interval = null;
                    }

                    var content = decodeURIComponent(data["content"]);
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
                        var speaker = $("speaker");
                        var speakerPanel = $("speaker.panel");
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
                };
            })());
            network.addListener(4000, function (data) {
                var uid = data["uid"];
                that.throwTurn(uid2position[uid]);
            });
            network.addListener(4001, function (data) {
                var uid = data["uid"];
                var paiId = data["pai_id"];
                var left = data["left"];
                var paiArr = data["pai_arr"];
                var liangPaiArr = data["liang_pai_arr"];
                var isTing = data["isTing"];
                leftPaiCnt = left;
                $("timer2.Text_2").setString(left);
                that.mopai(uid2position[uid], paiId, paiArr, liangPaiArr, isTing);

                if(uid == gameData.uid){
                    var hupai_tip = $('hupai_tip');
                    hupai_tip.setVisible(false);
                }
                //
                if(data['op']){
                    var op = data['op'];
                    that.showChiPengGangHu(position2uid[uid], paiId, op[0], op[1], op[2], op[3], op[4], op[5], op[6], data);
                }
            });
            network.addListener(4002, function (data) {
                var uid = data["uid"];
                var idx = data["idx"];
                var paiId = data["pai_id"];
                var paiArr = (data["pai_arr"] || []);
                var liangPaiArr = (data["liang_pai_arr"] || []);
                var paiCnt = (data["pai_cnt"] || 0);
                var left = (data["left"] || 0);
                var row = uid2position[uid];
                if (mapId == MAP_ID.CHANGSHA)
                    $("timer2.Text_2").setString(left);
                for (var i = 0; i < paiCnt; i++)
                    paiArr.push(0);

                // 修改出牌逻辑，点击直接出牌，等消息回来刷新手牌
                if (!gameData.opt_conf["disable_client_chupai"]) { // 0 || false || undefined 前端出牌
                    that.upPai(2, -1);
                    if (row != 2 || isReplay) {
                        that.chuPai(row, idx, paiId, paiArr, liangPaiArr);
                    } else {
                        if (!Equals(paiArr.sort(compareTwoNumbers), that.getPaiArr().sort(compareTwoNumbers))) {
                            that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), []);
                            that.checkPaiAmount();
                            //alertError(null,'牌数不对',null,true);
                        }
                        //牌的动画去掉
                        for (var j = 0; j < paiArr.length; j++) {
                            var pai = that.getPai(2, j);
                            pai.stopAllActions();
                            pai.setPositionY(posConf.paiA0PosBak[2].y);
                        }
                    }
                } else {
                    that.chuPai(row, idx, paiId, paiArr, liangPaiArr);
                }

                if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
                    var isGang = data["gang"] || false;
                    if (isGang) {
                        if (row == 2)
                            network.stop();
                        that.playChiPengGangHuAnim(row, OP_GANG, false, false);
                        that.playEffect("vgang", position2sex[row]);
                    }
                    var multiple = data["multiple"] || 1;
                    $("info" + row + ".lb_bs").setString("x" + multiple);
                }
            });
            network.addListener(4003, function (data) {
                var uid = data["uid"];
                var fromUid = data["from_uid"];
                var paiId = data["pai_id"];
                var op = data["op"];

                var chi = op[0];
                var peng = op[1];
                var gang = op[2];
                var ting = op[4];
                var hu = op[3];
                var fei = op[5];
                var ti = op[6];
                if (chi) that.chiPengGangHu(OP_CHI, uid2position[uid], paiId, uid2position[fromUid], data);
                if (peng) that.chiPengGangHu(OP_PENG, uid2position[uid], paiId, uid2position[fromUid], data);
                if (gang) that.chiPengGangHu(OP_GANG, uid2position[uid], paiId, uid2position[fromUid], data);
                if (hu) that.chiPengGangHu(OP_HU, uid2position[uid], paiId, uid2position[fromUid], data);
                if (ting) that.chiPengGangHu(OP_TING, uid2position[uid], paiId, uid2position[fromUid], data);
                if (fei) that.chiPengGangHu(OP_FEI, uid2position[uid], paiId, uid2position[fromUid], data);
                if (ti) that.chiPengGangHu(OP_TI, uid2position[uid], paiId, uid2position[fromUid], data);
                if (!chi && !peng && !gang && !hu && !ting && !fei && !ti)
                    that.chiPengGangHu(OP_PASS, uid2position[uid], paiId, uid2position[fromUid], data);


                //是自己 并且不是点的过
                if(uid == gameData.uid && peng){
                    $('hupai_tip').setVisible(false);
                }
                // 临时处理
                that.upPai(2, -1);
            });
            network.addListener(4004, function (data) {
                var uid = data["uid"];
                var paiId = data["pai_id"];
                var op = data["op"];
                var row = uid2position[uid];
                that.showChiPengGangHu(row, paiId, op[0], op[1], op[2], op[3], op[4], op[5], op[6], data);
            });
            network.addListener(4005, function (data) {
                var uid = data["uid"];
                var op = data["op"];
                var row = uid2position[uid];
                that.showTingLiang(row, op[0], op[1]);
            });
            network.addListener(40044, function (data) {
                var arr = data["arr"];
                for (var i = 0; i < arr.length; i++) {
                    var uid = arr[i]["data"]["uid"];
                    var paiId = arr[i]["data"]["pai_id"];
                    var op = arr[i]["data"]["op"];
                    var row = uid2position[uid];
                    that.showChiPengGangHu(row, paiId, op[0], op[1], op[2], op[3], op[4], op[5], op[6], data);
                }
            });
            network.addListener(4008, function (data) {
                that.setRoomState(ROOM_STATE_ENDED);
                that.jiesuan(data);
                if (bShowVideo) {
                    // AgoraUtil.hideAllVideo();
                }
                //todo 相同牌存储变量2
                that.allCache = null;
            });
            network.addListener(4009, function (data) {
                that.zongJiesuan(data);
                if (bShowVideo) {
                    // AgoraUtil.hideAllVideo();
                }
                //todo 相同牌存储变量3
                that.allCache = null;
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
                that.showTip("第一步, 请选择一张要打出的牌");
                that.setPaiArrOfRow(2, data["pai_arr"], false, false, data["liang_pai_arr"]);
                liangStep = 1;
            });
            network.addListener(4014, function (data) {
                var paiArr = data["pai_arr"];
                var paiArrBak = _.clone(data["pai_arr"]);
                var gangPaiArr = data["gang_pai_arr"];
                if (!gangPaiArr) {

                }
                else {
                    that.showTip("请选择不想显示的杠牌");
                    $("btn_xuanzewancheng").setVisible(true);
                    TouchUtils.setOnclickListener($("btn_xuanzewancheng"), function () {
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
                        that.setPaiArrOfRow(2, paiArr, false, false, gangPaiArr, true);
                    }
                }
            });
            network.addListener(4015, function (data) {
                hideGangChupaiArr = data["ting_pai_arr"];
                hideGangStep = 2;
                that.showTip("请出一张牌");
                var paiArr = that.getPaiArr();
                that.setPaiArrOfRow(2, paiArr, false, false, hideGangChupaiArr);
                $("btn_xuanzewancheng").setVisible(false);
            });
            network.addListener(4020, function (data) {
                var uid = data["uid"];
                var isOffline = data["is_offline"];
                that.playerOnloneStatusChange(uid2position[uid], isOffline);
            });
            network.addListener(4200, function (data) {
                var paiArr = data["paiArr"];
                var zhuangUid = data["zhuang_uid"];

                //todo 相同牌存储变量4
                that.allCache = {};
                gameData.zhuangUid = zhuangUid;
                // gameData.leftRound = data['left_round'];
                gameData.leftRound = data["left_round"];
                gameData.total_round = data["total_round"];
                //hjz 判断ip是否相同
                that.initExtraMapData(data);
                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame(true);
                that.fapai(paiArr);
                that.setZhuang(uid2position[zhuangUid]);
                if (that.afterGameStart)
                    that.afterGameStart();

                // gameData.players[0].ip = gameData.players[1].ip = '1.2.3.4';
                // gameData.players[2].ip = gameData.players[3].ip = '5.2.3.4';

                // var ip2names = {};
                // for (var i = 0; i < gameData.players.length; i++) {
                //     var player = gameData.players[i];
                //     ip2names[player.ip] = ip2names[player.ip] || [];
                //     ip2names[player.ip].push('【' + player.nickname + '】');
                // }
                // var parts = [];
                // for (var ip in ip2names) {
                //     if (ip2names[ip].length > 1) {
                //         parts.push(ip2names[ip].join('与') + '的IP相同');
                //     }
                // }
                // if (parts.length > 0)
                //     alert1(parts.join('\n'), null, null, true, true, true);
                // if (bShowVideo){
                //     AgoraUtil.showAllVideo();
                // }
            });
            network.addListener(4030, function (data, errCode) {
                if (errCode == -1) {
                    that.showTip("您选择要亮的或要出的牌不正确,请重新选择");
                    $("btn_queding").setVisible(true);
                    //$('btn_quxiao').setVisible(true);
                }
                else {
                    var uid = data["uid"];
                    that.hideTip();
                    var paiArr = data["pai_arr"];
                    var liangPaiArr = data["liang_pai_arr"] || [];

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
                    that.showTip("您选择要出的牌不正确,请重新选择");
                    //$('btn_xuanzewancheng').setVisible(true);
                    //$('btn_quxiao').setVisible(true);
                }
                else {
                    var uid = data["uid"];
                    that.hideTip();
                    var paiArr = data["pai_arr"];
                    var hidedGangPaiArr = data["hided_gang_arr"] || [];

                    var row = uid2position[uid];
                    if (row == 2) {
                        afterLianging = true;
                        that.upPai(2, -1);
                    }
                    else {
                        for (var j = 0; j < hidedGangPaiArr.length; j++) {
                            for (var i = 0; i < 4; i++) {
                                that.getGPai(row, i, 0);
                                var g = $("row" + row + ".g" + i);
                                if (g.isVisible() == false) {
                                    that.setGHide(row, i);
                                    g.setVisible(true);
                                    that.recalcPos(row);
                                    break;
                                }
                            }
                        }
                    }

                    //that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), []);

                    if (row == 2) {
                        hasChupai = true;
                        that.hideTip();
                    }

                    if ($("info" + row + ".liang"))
                        $("info" + row + ".liang").setVisible(true);
                    setTimeout(function () {
                        that.playChiPengGangHuAnim(row, OP_LIANG);
                        that.playEffect("vliang", position2sex[row]);
                    }, 1200);
                }
            });
            network.addListener(4041, function (data, errCode) {
            });
            network.addListener(4050, function (data) {
                var arr = data["arr"];
                var haidiUid = data["haidi_uid"] || 0;
                var paiId = data["pai_id"] || 0;
                var allNo = true;
                for (var i = 0; i < arr.length; i++)
                    if (arr[i].val >= 0)
                        allNo = false;
                if (haidiUid) {
                    var haidiLayer = $("haidiLayer", that);
                    if (haidiLayer)
                        haidiLayer.removeFromParent(true);
                    alert1("玩家【" + gameData.playerMap[haidiUid].nickname + "】获得海底牌: " + PAINAMES[paiId], function () {
                    });
                }
                else if (allNo) {
                    var haidiLayer = $("haidiLayer", that);
                    if (haidiLayer)
                        haidiLayer.removeFromParent(true);
                    alert1("没有玩家要海底牌");
                }
                else {
                    var haidiLayer = $("haidiLayer", that);
                    if (!haidiLayer) {
                        haidiLayer = new HaidiLayer();
                        haidiLayer.setName("haidiLayer");
                        that.addChild(haidiLayer);
                    }
                    haidiLayer.setArr(arr);
                }
            });
            network.addListener(4052, function (data) {
                network.stop();
                var uid = data["uid"];
                var row = uid2position[uid];
                if (row == 2)
                    afterLianging = true;

                if ($("info" + row + ".liang"))
                    $("info" + row + ".liang").setVisible(true);
                if (row == 2) {
                    that.setPaiArrOfRow(2, that.getPaiArr(), false, false, []);
                    that.getPai(2, 13).setVisible(false);
                }
                var isReconnect = data["is_reconnect"] || false;
                var paiID = data["pai"];
                var paiIDA = data["pai_a"];
                var paiIDB = data["pai_b"];
                var paiStr = PAINAMES[paiIDA] + (paiIDB ? "," + PAINAMES[paiIDB] : "");

                that.showTip("开杠: " + paiStr);

                that.hideChiPengGangHu();

                var throwDiceCb = function () {
                    network.start();
                    var content = "玩家【" + ellipsisStr(_.trim(gameData.playerMap[uid].nickname), 6) + "】开杠" + PAINAMES[paiID] + ", 补牌: " + paiStr + "\n请选择你可以进行的操作";

                    var qgh = data["qgh"];
                    var opA = data["op_a"];
                    var opB = data["op_b"];

                    if (opA[0] + opA[1] + opA[2] + opA[3] <= 0 &&
                        opB[0] + opB[1] + opB[2] + opB[3] <= 0 && !qgh)
                        return;

                    var layer = $("kaigangLayer", that) || that.kaigangLayer;
                    if (!layer) {
                        var scene = ccs.load(res.KaigangLayer_json);
                        layer = scene.node;
                        layer.setName("kaigangLayer");
                        layer.retain();
                        that.kaigangLayer = layer;
                    }
                    that.addChild(layer);

                    $("root.panel.lb_content", layer).setString(content);

                    var paiA = $("root.panel.a0", layer);
                    var paiB = $("root.panel.a1", layer);
                    paiA.paiId = paiIDA;
                    paiA.paiId = paiIDB;
                    setSpriteFrameByName(paiA, getPaiNameByRowAndId(2, paiIDA, true), "pai");
                    setSpriteFrameByName(paiB, getPaiNameByRowAndId(2, paiIDB, true), "pai");

                    var qghBtn = $("root.panel.btn_qgh", layer);
                    if (qgh) {
                        qghBtn.setVisible(true);
                        TouchUtils.setOnclickListener(qghBtn, function () {
                            network.send(4056, {room_id: gameData.roomId, pai_id: paiID, op: OP_HU});
                            layer.removeFromParent(false);
                        });
                    }
                    else {
                        qghBtn.setVisible(false);
                        TouchUtils.removeListeners(qghBtn);
                    }

                    var enableBtn = function (val, btn) {
                        if (val) {
                            Filter.remove(btn);
                            TouchUtils.setOnclickListener(btn, function () {
                                var op = btn.getName().split("_")[0];
                                var idx = btn.getName().split("_")[1];
                                op = {chi: 1, peng: 2, gang: 50, bu: 3, hu: 4, guo: 0}[op];
                                var pai = btn.getParent().getChildByName("a" + idx);
                                var _paiId = pai.paiId;
                                if (op == 1) {
                                    that.showChiLayer(_paiId, function (paiId, oriPaiId) {
                                        network.send(4056, {
                                            room_id: gameData.roomId,
                                            pai_id: paiId,
                                            ori_pai_id: oriPaiId,
                                            op: op
                                        });
                                        layer.removeFromParent(false);
                                    });
                                }
                                else {
                                    network.send(4056, {room_id: gameData.roomId, pai_id: _paiId, op: op});
                                    layer.removeFromParent(false);
                                }
                                console.log(op + " " + idx + " " + _paiId);
                            });
                        }
                        else {
                            Filter.grayScale(btn);
                            TouchUtils.removeListeners(btn);
                        }
                    };

                    enableBtn(opA[0], $("root.panel.chi_0", layer));
                    enableBtn(opA[1], $("root.panel.peng_0", layer));
                    enableBtn(opA[2], $("root.panel.gang_0", layer));
                    enableBtn(opA[2], $("root.panel.bu_0", layer));
                    enableBtn(opA[3], $("root.panel.hu_0", layer));

                    enableBtn(opB[0], $("root.panel.chi_1", layer));
                    enableBtn(opB[1], $("root.panel.peng_1", layer));
                    enableBtn(opB[2], $("root.panel.gang_1", layer));
                    enableBtn(opB[2], $("root.panel.bu_1", layer));
                    enableBtn(opB[3], $("root.panel.hu_1", layer));

                    TouchUtils.setOnclickListener($("root.panel.guo", layer), function () {
                        if (qgh) {
                            alert2("当前可以抢杠胡, 确定要【过】吗? \n(点击取消可重新选择抢杠胡)", function () {
                                network.send(4056, {room_id: gameData.roomId, pai_id: 0, op: 0});
                                layer.removeFromParent(false);
                            });
                        }
                        else {
                            network.send(4056, {room_id: gameData.roomId, pai_id: 0, op: 0});
                            layer.removeFromParent(false);
                        }
                    });
                };

                if (isReconnect) {
                    network.start();
                    throwDiceCb();
                }
                else
                    that.throwDice("开杠摇骰子", data["dice"], paiIDA, paiIDB, throwDiceCb);
            });
            network.addListener(4053, function (data) {
                that.showTip("请等待他人选择是否小胡");
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

                var uid = data["uid"];
                var row = uid2position[uid];
                if (row != 2) {
                    var paiArr = data["pai_arr"];
                    var paiCnt = data["pai_cnt"];
                    var n = paiCnt - paiArr.length;
                    for (var i = 0; i < n; i++)
                        paiArr.push(0);
                    that.setPaiArrOfRow(row, paiArr, true, false);
                }

                that.playChiPengGangHuAnim(row, OP_HU, false);
                that.playEffect("vhu", position2sex[row]);
            });
            network.addListener(4060, function (data) {
                that.showSelectQue(data["sel_map"]);
            });
            network.addListener(4061, function (data) {
                that.showSelectQue(data["sel_map"]);
            });
            network.addListener(4062, function (data) {
                //胡牌提示
                if (data == null || hasChupai) return;

                //本地数据
                that.hupaiTipData = data.tishi;
                var myPaiArr = that.getPaiArr();
                var hupai_tip = $('hupai_tip');
                hupai_tip.setVisible(false);
                var huCurCard = 0;
                if(data.lastChuPai){
                    huCurCard = data.lastChuPai;
                }
                // console.log(huCurCard);
                if(huCurCard > 0 && that.hupaiTipData && that.hupaiTipData[huCurCard])  that.initHuPaiTishiLayer(that.hupaiTipData[huCurCard]);

                //胡牌提示
                if(!that.isMyTurn()){
                    return;
                }
                for (var i = 0; i < 14; i++) {
                    (function (i) {
                        var cardSprite = that.getPai(2, i);
                        var paiId = cardSprite.pai;
                        var hucards = null;
                        for (var cards in data.tishi) {
                            //胡牌提示其余牌亮
                            if (parseInt(cards) == parseInt(paiId)) {
                                if (mapId != MAP_ID.SICHUAN_DEYANG
                                    && mapId != MAP_ID.SICHUAN_GH
                                    && mapId != MAP_ID.SICHUAN_MZ
                                    && mapId != MAP_ID.SICHUAN_XUELIU
                                    && mapId != MAP_ID.SICHUAN_XUEZHAN
                                    && mapId != MAP_ID.SICHUAN_SF
                                    && mapId != MAP_ID.SICHUAN_ZJ
                                    && mapId != MAP_ID.SICHUAN_LJ
                                    && mapId != MAP_ID.SICHUAN_JY) {
                                    cardSprite.isLiang = true;

                                    Filter.remove(cardSprite);
                                }
                                hucards = data.tishi[cards];
                                break;
                            } else {
                                if (mapId != MAP_ID.SICHUAN_DEYANG
                                    && mapId != MAP_ID.SICHUAN_GH
                                    && mapId != MAP_ID.SICHUAN_MZ
                                    && mapId != MAP_ID.SICHUAN_XUELIU
                                    && mapId != MAP_ID.SICHUAN_XUEZHAN
                                    && mapId != MAP_ID.SICHUAN_SF
                                    && mapId != MAP_ID.SICHUAN_ZJ
                                    && mapId != MAP_ID.SICHUAN_LJ
                                    && mapId != MAP_ID.SICHUAN_JY) {
                                }
                            }
                        }
                        var hucardSprite;
                        if (cardSprite.getChildByName("hucardSprite")) {
                            hucardSprite = cardSprite.getChildByName("hucardSprite");
                            hucardSprite.setPosition(cardSprite.getContentSize().width / 2 - 20.8, cardSprite.getContentSize().height - 38);
                        } else {
                            hucardSprite = new cc.Sprite("res/submodules/majiang/image/ma_sc/hupaitip_jiao.png");
                            hucardSprite.setPosition(cardSprite.getContentSize().width / 2 - 20.8, cardSprite.getContentSize().height - 38);
                            hucardSprite.setName("hucardSprite");
                            cardSprite.addChild(hucardSprite);
                        }
                        hucardSprite.setVisible(!!hucards);
                        cardSprite.hucards = hucards;
                    })(i);
                }
            });

            network.addListener(4034, function (data, errCode) {
                var allSelect = true;
                for (var key in data["sel_map"]) {
                    var state = data["sel_map"][key];
                    var row = uid2position[key];
                    if ($("qn" + row)) {

                        if (state == 0) {
                            playEffect("vbupiao", position2sex[row]);
                        } else if (state == 1) {
                            playEffect("vpiao", position2sex[row]);
                        }
                        //选票中和已选票的添加
                        var xuanpiaoSp = $("qn" + row + ".xuanpiao");
                        if (!xuanpiaoSp) {
                            xuanpiaoSp = new cc.Sprite("res/submodules/majiang/image/ma_sc/xuanpaioh.png");
                            xuanpiaoSp.setName("xuanpiao");
                            $("qn" + row).addChild(xuanpiaoSp);
                        }
                        xuanpiaoSp.setTexture(cc.textureCache.addImage(state != -1 ? "res/submodules/majiang/image/ma_sc/yixuanpiaoh.png" : "res/submodules/majiang/image/ma_sc/xuanpaioh.png"));

                        //添加小飘字
                        if (state == 1) {
                            $("info" + row + ".piao").setVisible(true);
                        } else {
                            $("info" + row + ".piao").setVisible(false);
                        }

                        xuanpiaoSp.setVisible(true);
                    }

                    if (data["sel_map"][key] == -1) {
                        allSelect = false;
                    }
                }

                if (allSelect) {
                    for (var i = 0; i < 4; i++) {
                        var xuanpiaoSp = $("qn" + i + ".xuanpiao");
                        if (xuanpiaoSp) {
                            xuanpiaoSp.removeFromParent();
                        }
                    }
                }

                var state = data["sel_map"][gameData.uid];
                if (state == -1) {
                    that.showSelectPiao(data["sel_map"]);
                }
            });

            network.addListener(4035, function (data, errCode) {
                that.hideSelectedPiao();
                that.setPaiArrOfRow(2, data["paiArr"]);
                forRows(function (i) {
                    for (var j = 0; j < 13; j++) {
                        var pai = that.getPai(i, j);
                        pai.setOpacity(255);
                        pai.setVisible(true);
                        pai.runAction(cc.fadeIn(0.5));
                    }
                });
            });

            network.addListener(4063, function (data) {
                that.showHuansanzhang(data["arr"], data["arr1"], data["sel_map"]);
            });
            // network.addListener(4065, function (data) {
            //     var paiArr = data['pai_arr'] || [];
            //     that.setPaiArrOfRow(2, paiArr, false, false);
            //     that.upPai(2, -1);
            //     var dir = data['dir'];
            //     that.showToast({0: "逆时针交换三张", 1: "顺时针交换三张", 2: "与对家交换三张"}[dir]);
            // });
            network.addListener(4065, function (data) {
                var paiArr = data["pai_arr"] || [];
                var arr0 = data["arr0"] || [];
                var arr1 = data["arr1"] || [];
                arr0.sort(compareTwoNumbers);
                arr1.sort(compareTwoNumbers);
                var dice = data["dice"] || Math.floor(Math.random() * 6) + 1;
                that.setPaiArrOfRow(2, paiArr, false, false);
                that.upPai(2, -1);
                var dir = data["dir"];
                var str = {1: "逆时针换三张", 0: "顺时针换三张", 2: "与对家换三张"}[dir];
                if(that.isHuanjiZhuang() == 4){
                    str = {1: "逆时针换四张", 0: "顺时针换四张", 2: "与对家换四张"}[dir];
                }
                that.showToast(str);
                $("hsz_seq").setVisible(false);
                $("hsz_seq").setString(str);

                for (var i = 0; i < arr0.length; i++) {
                    $("hsz_seq.arr" + i).setVisible(true);
                    setSpriteFrameByName($("hsz_seq.arr" + i), "p2s" + arr0[i] + ".png", "pai");
                }

                $("Node.dice").setVisible(true);

                var posArr = [cc.p(0, 150), cc.p(150, 0), cc.p(0, -150), cc.p(-150, 0)];
                if(that.isHuanjiZhuang() == 4){
                    posArr = [cc.p(0, 180), cc.p(180, 0), cc.p(0, -180), cc.p(-180, 0)];
                }

                playThrowDice($("Node.dice"), dice, function () {
                    $("Node.dice").setVisible(false);
                    for(var i=0;i<4;i++){
                        $("Node.r" + i).setRotation(0);
                        $("Node.r" + i).setPosition(posArr[i]);
                    }
                    $("Node").setRotation(0);

                    if (dir == 0) { // 顺时针
                        if(gameData.players.length == 3){
                            $("Node").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r1").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r2").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r3").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r3").runAction(cc.moveTo(1.5, posArr[0]));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3]) setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r1.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r1.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r1.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r1.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }else if(gameData.players.length == 2){
                            $("Node").runAction(cc.rotateBy(1.5, 180));
                            $("Node.r0").runAction(cc.rotateBy(1.5, -180));
                            $("Node.r2").runAction(cc.rotateBy(1.5, -180));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r0.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }else{
                            $("Node").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r0").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r1").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r2").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r3").runAction(cc.rotateBy(1.5, -90));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r1.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r1.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r1.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r1.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }
                    }
                    if (dir == 1) { // 逆时针
                        if(gameData.players.length == 3){
                            $("Node").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r1").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r2").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r3").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r1").runAction(cc.moveTo(1.5, posArr[0]));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r3.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r3.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r3.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r3.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }else if(gameData.players.length == 2) {
                            $("Node").runAction(cc.rotateBy(1.5, -180));
                            $("Node.r0").runAction(cc.rotateBy(1.5, 180));
                            $("Node.r2").runAction(cc.rotateBy(1.5, 180));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r0.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }else{
                            $("Node").runAction(cc.rotateBy(1.5, -90));
                            $("Node.r0").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r1").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r2").runAction(cc.rotateBy(1.5, 90));
                            $("Node.r3").runAction(cc.rotateBy(1.5, 90));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r3.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r3.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r3.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3]) setSpriteFrameByName($("Node.r3.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }
                    }
                    if (dir == 2) { // 对家换
                        $("Node").runAction(cc.rotateBy(1.5, -180));
                        if(gameData.players.length == 2){
                            $("Node.r0").runAction(cc.rotateBy(1.5, 180));
                            $("Node.r2").runAction(cc.rotateBy(1.5, 180));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r0.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }else {
                            $("Node.r0").runAction(cc.rotateBy(1.5, 180));
                            $("Node.r1").runAction(cc.rotateBy(1.5, 180));
                            $("Node.r2").runAction(cc.rotateBy(1.5, 180));
                            $("Node.r3").runAction(cc.rotateBy(1.5, 180));
                            setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + arr0[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + arr0[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + arr0[2] + ".png", "pai");
                            if(arr0[3])  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + arr0[3] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2"), "p2s" + arr1[0] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_0"), "p2s" + arr1[1] + ".png", "pai");
                            setSpriteFrameByName($("Node.r0.p2s0_2_1"), "p2s" + arr1[2] + ".png", "pai");
                            if(arr1[3])  setSpriteFrameByName($("Node.r0.p2s0_2_2"), "p2s" + arr1[3] + ".png", "pai");
                        }
                    }
                    $("Node").runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
                        $("Node").setVisible(false);
                        for (var i=0;i<4;i++) {
                            var hszSp = $("qn" + i + ".hsz");
                            if (hszSp) {
                                hszSp.setVisible(false);
                            }
                        }
                    })));
                });
            });

            network.addListener(4066, function (data) {
                // todo data格式recv: {"code":4066,"data":{"scores":[{"uid":11, "score":-100, "total":900}, {"uid":1897, "score":-100, "total":900}, {"uid":5059, "score":100, "total":1100}, {"uid":5060, "score":100, "total":1100}]}}
                if (data && data["scores"]) {
                    var scores = data["scores"];
                    for (var i = 0; i < scores.length; i++) {
                        var row = uid2position[scores[i]["uid"]];
                        that.showChangeScore(row, scores[i]["score"]);
                        $("info" + row + ".lb_score").setString(scores[i]["total"]);
                    }
                }
            });

            network.start();

            isCCSLoadFinished = true;

            playMusic("vbg1");
        },
        isHuanjiZhuang: function(){
            if(gameData.wanfaDesp.indexOf('换三张') >= 0){
                return 3;
            }
            if(gameData.wanfaDesp.indexOf('换四张') >= 0){
                return 4;
            }
        },
        initBG: function (sceneid) {
            var sceneid = cc.sys.localStorage.getItem("sceneid_majiang") || 0;
            var bg = $("bg");
            bg.setTexture(res["table_majiang_back" + sceneid + "_jpg"]);
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
            network.removeListeners([
                3002, 3003, 3004, 3005, 3008, 3200,
                4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200
            ]);
            // AgoraUtil.closeVideo();
            bShowVideo = false;

            if (this.list2103) cc.eventManager.removeListener(this.list2103);
            if (this.list1) cc.eventManager.removeListener(this.list1);
            if (this.list2) cc.eventManager.removeListener(this.list2);

            cc.Layer.prototype.onExit.call(this);
        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if (subArr) sub = subArr["majiang"];

            var versiontxt = window.curVersion + '-' + sub;
            if(cc.sys.os == cc.sys.OS_IOS && versiontxt){
                var regx = new RegExp('\\.', 'g');
                versiontxt = versiontxt.replace(regx, '');
            }
            var version = new ccui.Text();
            version.setFontSize(15);
            version.setTextColor(cc.color(255, 255, 255));
            version.setPosition(cc.p(cc.winSize.width - 80, 10));
            version.setAnchorPoint(cc.p(1, 0.5));
            version.setString(versiontxt);
            this.addChild(version, 2);
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
                // var header = $('info' + pos + '.head');
                var header = $("vedio" + pos);
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

        createVideoView: function () {
            // if (!bShowVideo) {
            //     bShowVideo = true;
            //     AgoraUtil.initVideoView(this.getUserHeaderData());
            //     setTimeout(function () {
            //         AgoraUtil.openVideo(gameData.roomId.toString(), gameData.uid.toString());
            //     }, 1000);
            // }
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

            //邀请俱乐部成员
            var currentRound = gameData.total_round - gameData.leftRound;
            if (this.getRoomState() == ROOM_STATE_ONGOING || currentRound > 1) {
                if(this.assistant)  this.assistant.setVisible(false);
            }
            if (players.length >= playerNum) {
                var clubMemberInviteLayer = this.getChildByName('clubMemberInviteLayer');
                if (clubMemberInviteLayer) {
                    clubMemberInviteLayer.removeFromParent(true);
                }
                if(this.assistant)  this.assistant.setVisible(false);
            } else {
                if (mRoom.club_id) {
                    if(this.assistant)  this.assistant.setVisible(true);
                }
            }


            $("timer").delta = i;
            uid2position = {};
            for (var i = 0, j = 2; i < players.length; i++, j++) {
                var player = players[i];
                var k = {
                    4: {"0": 0, "1": 3, "2": 2, "3": 1},
                    3: {"0": 1, "1": 3, "2": 2},
                    2: {'0': 2, '1': 0}
                }[playerNum][j % playerNum];

                $("info" + k).setVisible(true);
                $("info" + k + ".lb_nickname").setString(ellipsisStr(player["nickname"], (k == 0 || k == 2 ? 7 : 5)));
                $("info" + k + ".lb_score").setString((roomState == ROOM_STATE_CREATED) ? 0 : player["score"]);
                if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU)
                    $("info" + k + ".lb_bs").setString("x1");
                if (roomState == ROOM_STATE_CREATED) {
                    $("info" + k + ".ok").setVisible(!!player["ready"]);
                }
                if (roomState == ROOM_STATE_ENDED && !player["ready"])
                    $("btn_zhunbei").setVisible(true);
                loadImageToSprite(player["headimgurl"], $("info" + k + ".head"));

                uid2position[player.uid] = k;
                uid2playerInfo[player.uid] = player;
                position2uid[k] = player.uid;
                position2sex[k] = player.sex;
                position2playerArrIdx[k] = i;
            }

            for (; i < playerNum; i++, j++) {
                var k = {
                    4: {"0": 0, "1": 3, "2": 2, "3": 1},
                    3: {"0": 1, "1": 3, "2": 2},
                    2: {'0': 2, '1': 0}
                }[playerNum][j % playerNum];
                $("info" + k).setVisible(false);
            }

            if (playerNum == 3)
                $("info0").setVisible(false);

            if (playerNum == 2) {
                $('info1').setVisible(false);
                $('info3').setVisible(false);
            }
        },
        calcPosConf: function () {
            // if (window.posConf) {
            //     posConf = window.posConf;
            //     return;
            // }
            for (var row = 0; row < 4; row++) {
                var a0 = $("row" + row + ".a0");
                posConf.paiA0PosBak[row] = a0.getPosition();
                posConf.paiA0ScaleBak[row] = [a0.getScaleX(), a0.getScaleY()];
                posConf.headPosBak[row] = $("info" + row).getPosition();

                if (row == 0 || row == 2) {
                    var a0 = $("row" + row + ".a0");
                    var a1 = $("row" + row + ".a1");
                    posConf.paiADistance.push(a1.getPositionX() - a0.getPositionX());
                    var b0 = $("row" + row + ".c0.b0");
                    var b1 = $("row" + row + ".c0.b1");
                    posConf.paiUsedDistance.push(b1.getPositionX() - b0.getPositionX());

                    posConf.downPaiPositionY = a0.getPositionY();
                    posConf.upPaiPositionY = a0.getPositionY() + UPPAI_Y;
                }
                else {
                    var a0 = $("row" + row + ".a0");
                    var a1 = $("row" + row + ".a1");
                    posConf.paiADistance.push(a1.getPositionY() - a0.getPositionY());
                    var b0 = $("row" + row + ".c0.b0");
                    var b1 = $("row" + row + ".c0.b1");
                    posConf.paiUsedDistance.push(b1.getPositionY() - b0.getPositionY());
                }

                var b0 = $("row" + row + ".g0.b0");
                var b2 = $("row" + row + ".g0.b2");

                if (row == 0) posConf.groupWidth[0] = b0.getPositionX() + b0.getContentSize().width / 2 - (b2.getPositionX() - b2.getContentSize().width / 2);
                if (row == 2) posConf.groupWidth[2] = b2.getPositionX() + b2.getContentSize().width / 2 - (b0.getPositionX() - b0.getContentSize().width / 2);
                if (row == 1) posConf.groupHeight[1] = b2.getPositionY() + b2.getContentSize().height / 2 - (b0.getPositionY() - b0.getContentSize().height / 2);
                if (row == 3) posConf.groupHeight[3] = b0.getPositionY() + b0.getContentSize().height / 2 - (b2.getPositionY() - b2.getContentSize().height / 2);

                var ltqp = $("info" + row + ".qp");
                posConf.ltqpPos[row] = ltqp.getPosition();
                posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                posConf.ltqpEmojiSize[row] = cc.size({0: 80, 1: 90, 2: 84, 3: 100}[row], posConf.ltqpRect[row].height);
                ltqp.removeFromParent();
            }
            // window.posConf = posConf;
        },
        ctor: function (_data, _isReplay) {
            this._super();

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
            // loadCCSTo(res.MaScene_Sc_json, this, "Scene");
            loadNodeCCS(res.MaScene_Sc_json, this, "Scene");
            if (!cc.sys.isNative) this.initTestFapai();
            return true;

        },

        showWanfaLayer: function () {
            if (!gameData.wanfaDesp) {
                return;
            }
            if (this.wanfaLayer != null) {
                this.wanfaLayer.setVisible(true);
            } else {
                var arr = decodeURIComponent(gameData.wanfaDesp).split(",");
                if (arr.length >= 1)
                    arr = arr.slice(1);
                var wanfaStr = arr.join("\n");
                var text = new ccui.Text(wanfaStr, "res/fonts/FZCY.ttf", 24);
                var width = text.getContentSize().width + 30;
                var height = text.getContentSize().height + 30;
                text.setPosition(cc.p(width / 2, height / 2));
                this.wanfaLayer = new cc.LayerColor(cc.color(0, 0, 0, 189), width, height);
                this.wanfaLayer.addChild(text);
                this.wanfaLayer.setPosition(cc.p($("btn_wanfa").x, $("btn_wanfa").y - height));
                this.addChild(this.wanfaLayer);
            }

        },
        hideWanfaLayer: function () {
            if (this.wanfaLayer != null) {
                this.wanfaLayer.setVisible(false);
            }
        },

        initTestFapai: function () {
            var that = this;
            var test = new cc.Sprite("res/mainScene/btn_yellow.png");
            test.setPosition(cc.p(500, 700));
            that.addChild(test);
            TouchUtils.setOnclickListener(test, function () {
                that.addChild(new testFaPaiLayer());
            });
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
                if (delay < 200) $("signal").setTexture(res.signal5);
                else if (delay < 300) $("signal").setTexture(res.signal4);
                else if (delay < 400) $("signal").setTexture(res.signal3);
                else if (delay < 600) $("signal").setTexture(res.signal2);
                else $("signal").setTexture(res.signal1);
            };
            func();
            interval = setInterval(func, 200);
        },
        startTime: function () {
            var interval = null;
            var flag = true;
            var lbTime = $("lb_time");
            if (isReplay)
                return;
            var updTime = function () {
                //显示电池电量
                // var battery = $('battery_bg.battery');
                // var level = getBatteryLevel();
                // if (cc.sys.isObjectValid(battery)) {
                //     battery.setPercent(level);
                // }

                var battery = $("battery");
                var level = DeviceUtils.getBatteryLevel();
                if (cc.sys.isObjectValid(battery)) {
                    if (level > 80) {
                        battery.setTexture(res.battery_5);
                    } else if (level > 60) {
                        battery.setTexture(res.battery_4);
                    } else if (level > 40) {
                        battery.setTexture(res.battery_3);
                    } else if (level > 20) {
                        battery.setTexture(res.battery_2);
                    } else {
                        battery.setTexture(res.battery_1);
                    }
                }

                var date = new Date();
                var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
                var hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
                if (cc.sys.isObjectValid(lbTime))
                    lbTime.setString(hours + (flag ? " " : " ") + minutes);
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
                var node = $("timer." + i);
                if (node.isVisible())
                    return (i + $("timer").delta) % 4;
            }
            return -1;
        },
        throwTurnByUid: function (uid) {
            this.throwTurn(uid2position[uid]);
        },

        showSelectPiao: function (selectPiaoMap) {
            if (selectPiaoMap[gameData.uid] == 1) {
                return;
            }
            $("piao").setVisible(true);
            var that = this;
            TouchUtils.setOnclickListener($("piao.piao0"), function () {
                network.send(4033, {room_id: gameData.roomId, piao: 0});
                that.hideSelectedPiao();
            });
            TouchUtils.setOnclickListener($("piao.piao1"), function () {
                network.send(4033, {room_id: gameData.roomId, piao: 1});
                that.hideSelectedPiao();
            });
        },

        throwTurn: function (row, isTing) {
            turnRow = row;

            $("timer").setVisible(true);
            $("timer2").setVisible(true);
            var arrow = $("timer.arrow");
            arrow.setTexture(cc.textureCache.addImage("res/submodules/majiang/image/ma_sc/t" + row + ".png"));
            arrow.setVisible(true);
            if (arrow.getNumberOfRunningActions() == 0)
                arrow.runAction(new cc.RepeatForever(cc.sequence(cc.fadeTo(0.5, 168), cc.fadeTo(0.5, 255))));

            if (!afterLianging) {
                // if (mapId != MAP_ID.SICHUAN_YB) {
                this.checkMyPaiColor4SC();
                // }
                for (var i = 0; i < 14; i++) {
                    var pai = this.getPai(2, i);
                    if (row == 2) {
                        if (mapId != MAP_ID.SICHUAN_DEYANG
                            && mapId != MAP_ID.SICHUAN_ZJ
                            && mapId != MAP_ID.SICHUAN_LJ
                            && mapId != MAP_ID.SICHUAN_JY
                            && mapId != MAP_ID.SICHUAN_GH
                            && mapId != MAP_ID.SICHUAN_SF
                            && mapId != MAP_ID.SICHUAN_MZ
                            && mapId != MAP_ID.SICHUAN_XUELIU
                            && mapId != MAP_ID.SICHUAN_XUEZHAN
                            && mapId != MAP_ID.SICHUAN_SRSF) {
                            if (isTing) {
                                pai.isLiang = false;
                                // Filter.grayMask(pai);
                            }
                            else {
                                pai.isLiang = true;
                                if (mapId != MAP_ID.SICHUAN_YB) {
                                    // Filter.remove(pai);
                                }
                            }
                        }
                    }
                    else {
                        pai.isLiang = false;

                        Filter.remove(pai);

                    }
                }
            }

            // if (row == 2) {
            this.upPai(2, -1);
            // }
            this.hideTip();

            if (mapId == MAP_ID.SICHUAN_XUEZHAN || mapId == MAP_ID.SICHUAN_DEYANG || mapId == MAP_ID.SICHUAN_ZJ || mapId == MAP_ID.SICHUAN_LJ || mapId == MAP_ID.SICHUAN_JY || mapId == MAP_ID.SICHUAN_GH || mapId == MAP_ID.SICHUAN_MZ || mapId == MAP_ID.SICHUAN_XUELIU) {
                for (var row = 0; row < 4; row++) {
                    var dingquezhongSp = $("qn" + row + ".dingquezhong");
                    dingquezhongSp && dingquezhongSp.setVisible(false);
                }
            }
        },
        setPai: function (row, idx, val, isLittle, isStand, isVisible) {
            var pai = this.getPai(row, idx);

            if (mapId == MAP_ID.SICHUAN_YB || mapId == MAP_ID.WUHAN_KOUKOU) {
                var lb = pai.getChildByName("lb");

                // || val == laizipiPaiAId || val == laizipiPaiBId
                if (row == 2 && (val == laiziPaiId || val == 32 || (mapId == MAP_ID.SICHUAN_YB && (val == laiziPaiId[0] || val == laiziPaiId[1] || (laiziPaiId[2] != 0 && val == laiziPaiId[2]))))) {
                    var texture = null;
                    if (val == laiziPaiId) texture = res.lb_lai;
                    if (_.isArray(laiziPaiId)) {
                        for (var i = 0; i < laiziPaiId.length; i++) {
                            var id = laiziPaiId[i];
                            if (val == id) {
                                texture = res.lb_lai;
                                break;
                            }
                        }
                    }

                    // if (val == laizipiPaiAId) texture = lb_pi;
                    // if (val == laizipiPaiBId) texture = lb_pi;
                    if (val == 32) texture = res.lb_gang;
                    if (mapId == MAP_ID.WUHAN_KAIKOU && val == 33) texture = res.lb_gang;
                    if (!lb) {
                        lb = new cc.Sprite(res.lb_gang);
                        lb.setTexture(texture);
                        lb.setName("lb");
                        pai.addChild(lb);
                        lb.setPosition(16.1, 17.5);
                    }
                    else
                        lb.setTexture(texture);
                    lb.setVisible(true);
                }
                else if (lb) {
                    lb.setVisible(false);
                }
            }

            var paiName = getPaiNameByRowAndId(row, val, isLittle, val > 0 ? false : (isReplay || roomState == ROOM_STATE_ENDED ? false : isStand));
            pai.pai = val;
            setSpriteFrameByName(pai, paiName, "pai");
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
                var node = $("row" + row + ".a" + id);
                if (!node) {
                    var a0 = $("row" + row + ".a0");
                    node = duplicateSprite(a0, true);
                    if (row == 0 || row == 2) node.setPositionX(posConf.paiADistance[row] * id + a0.getPositionX());
                    if (row == 1 || row == 3) node.setPositionY(posConf.paiADistance[row] * id + a0.getPositionY());
                    node.setName("a" + id);
                    a0.getParent().addChild(node, (row == 1 ? -id : 0));
                }
                node.idx = id;
                cache[row][id] = node;
                if (node.getChildByName("hucardSprite")) {
                    node.getChildByName("hucardSprite").removeFromParent(true);
                }
                return node;
            };
        },

        getPaiId: function (row, id) {
            var pai = this.getPai(row, id);
            return pai.pai;
        },
        setGChi: function (row, j, paiId, oriPaiId) {
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
            $("row" + row + ".g" + j + ".b" + 3).setVisible(false);
            $("row" + row + ".g" + j).setVisible(true);
        },
        setGPai: function (row, g, idx, val) {
            var pai = this.getGPai(row, g, idx);
            var paiName = getPaiNameByRowAndId(row, val, true);
            pai.pai = val;
            setSpriteFrameByName(pai, paiName, "pai");
            return pai;
        },
        setGPeng: function (row, j, paiId) {
            for (var k = 0; k < 3; k++) {
                var pai = this.setGPai(row, j, k, paiId);

                var lb = pai.getChildByName("lb");
                if (lb) {
                    lb.removeFromParent();
                }
            }

            $("row" + row + ".g" + j + ".b" + 3).setVisible(false);
            $("row" + row + ".g" + j).setVisible(true);
        },
        //添加飞的处理逻辑
        setGFei: function (row, j, duiArr) {
            for (var k = 0; k < 3; k++) {
                var pai = this.setGPai(row, j, k, duiArr[k]);
                var lb = pai.getChildByName("lb");
                if (laiziPaiId.indexOf(duiArr[k]) >= 0) {
                    if (!lb) {
                        lb = new cc.Sprite(res.lb_lai);
                        lb.setName("lb");
                        pai.addChild(lb);

                    }

                    if (row == 0) {
                        lb.setPosition(49.1, 72.5);
                        lb.setRotation(180);
                    }
                    if (row == 1) {
                        lb.setPosition(58.1, 18.5);
                        lb.setRotation(-90);
                    }
                    if (row == 2) {
                        lb.setPosition(17.1, 20.5);
                    }
                    if (row == 3) {
                        lb.setPosition(19.1, 48.5);
                        lb.setRotation(90);
                    }
                } else if (lb) {
                    lb.removeFromParent();
                }
            }

            $("row" + row + ".g" + j + ".b" + 3).setVisible(false);
            $("row" + row + ".g" + j).setVisible(true);
        },
        setGHide: function (row, j) {
            for (var k = 0; k < 3; k++)
                this.setGPai(row, j, k, 0);
            $("row" + row + ".g" + j + ".b" + 3).setVisible(false);
            $("row" + row + ".g" + j).setVisible(true);
        },
        setGGang: function (row, j, upPaiId, downPaiId) {
            this.setGPai(row, j, 3, upPaiId);
            $("row" + row + ".g" + j + ".b" + 3).setVisible(true);
            for (var k = 0; k < 3; k++) {
                var pai = this.setGPai(row, j, k, downPaiId);
                var lb = pai.getChildByName("lb");
                if (lb && isReplay) {
                    lb.setVisible(false);
                }
            }

            $("row" + row + ".g" + j).setVisible(true);
        },
        setGJiaGang: function (row, paiId) {
            for (var j = 0; j < 4; j++)
                if ($("row" + row + ".g" + j).isVisible() &&
                    this.getGPaiId(row, j, 0) == paiId &&
                    this.getGPaiId(row, j, 0) == this.getGPaiId(row, j, 1) &&
                    this.getGPaiId(row, j, 1) == this.getGPaiId(row, j, 2)) {
                    this.setGPai(row, j, 3, paiId);
                    this.getGPai(row, j, 3).setVisible(true);
                    break;
                }
        },
        getGPai: function () {
            var cache = {};
            return function (row, g, id) {
                cache[row] = cache[row] || {};
                cache[row][g] = cache[row][g] || {};
                if (cache[row][g][id])
                    return cache[row][g][id];
                var group0 = $("row" + row + ".g" + 0);
                var groupNode = $("row" + row + ".g" + g);
                if (!groupNode) {
                    groupNode = duplicateLayout(group0);
                    if (row == 0 || row == 2) groupNode.setPositionX(group0.getPositionX() + posConf.groupWidth[row] * g + posConf.paiADistance[row] * g);
                    if (row == 1 || row == 3) groupNode.setPositionY(group0.getPositionY() + posConf.groupHeight[row] * g + posConf.paiADistance[row] * g);
                    groupNode.setName("g" + g);
                    groupNode.setVisible(false);
                    group0.getParent().addChild(groupNode);
                }
                var node = $("row" + row + ".g" + g + ".b" + id);
                cache[row][g][id] = node;
                return node;
            };
        },
        getGPaiId: function (row, g, id) {
            var pai = $("row" + row + ".g" + g + ".b" + id);
            return pai.pai;
        },
        isMyPaiContainsQue: function () {
            var paiArr = this.getPaiArr();
            var queLR = position2quelr[uid2position[gameData.uid]];
            var hasQue = (queLR && !_.every(paiArr, function (n) {
                return n < queLR.l || n > queLR.r;
            }));
            return hasQue;
        },
        checkMyPaiColor4SC: function () {
            var row = 2;
            var paiArr = this.getPaiArr();
            var queLR = position2quelr[uid2position[gameData.uid]];
            var hasQue = (queLR && !_.every(paiArr, function (n) {
                if (gameData.mapId == MAP_ID.SICHUAN_YB) {
                    var arr = [];
                    if (n >= queLR.l && n <= queLR.r && (n != laiziPaiId[0] && n != laiziPaiId[1] && n != laiziPaiId[2])) {
                        arr.push(n);
                    }
                    if (arr.length == 0) {
                        return true;
                    }
                    else {
                        return false;
                    }

                } else {
                    return n < queLR.l || n > queLR.r;
                }
            }));
            for (var j = 0; j < paiArr.length; j++) {
                var _paiId = paiArr[j];
                if (isHuansanzhanging)
                    this.filterMyPai(row, j, 1);
                else if (turnRow != 2) {
                    this.filterMyPai(row, j, 0);
                }
                else {
                    if (hasQue)
                        this.filterMyPai(row, j, (_paiId < queLR.l || _paiId > queLR.r ? 0 : 1));
                    else
                        this.filterMyPai(row, j, 1);
                }
            }
            var pai13 = this.getPai(2, 13);
            var pai13Id = pai13.pai;
            if (pai13Id) {
                hasQue = hasQue || (queLR && pai13Id >= queLR.l && pai13Id <= queLR.r);
                if (hasQue)
                    this.filterMyPai(row, 13, (queLR && (pai13Id < queLR.l || pai13Id > queLR.r ? 0 : 1)));
                else if (this.hasHu(row)) {
                    this.filterMyPai(row, 13, 0);
                }
                else
                    this.filterMyPai(row, 13, 1);
            }
        },
        filterMyPai: function (row, idx, val) {
            var pai = this.getPai(row, idx);
            if (val == -1) {
                pai.isLiang = true;

                Filter.grayScale(pai);
            }
            if (val == 0 && !isReplay) {
                pai.isLiang = false;
                Filter.grayMask(pai);
            }
            if (val == 1) {
                pai.isLiang = true;

                Filter.remove(pai);
            }
        },
        checkPaiAmount: function () {
            if (cc.sys.isNative)
                return;
            var amount = 0;
            var row = 2;
            for (var j = 0; j < 4; j++) {
                var g = $("row" + row + ".g" + j);
                if (!g || !$("row" + row + ".g" + j).isVisible())
                    break;
                else
                    amount += 3;
            }
            for (var j = 0; j < 14; j++)
                if (this.getPai(row, j).isVisible())
                    amount += 1;
            if (amount < 13 || amount > 14)
                alert("你的牌数量可能不对: " + amount + ", 数一下");
        },
        recalcPos: function (row) {
            var g0 = $("row" + row + ".g" + 0);
            var g0b0pos = getPositionRelativeToParent(this.getGPai(row, 0, 0), 2);
            for (var i = 1; i < 4; i++) {
                var g = $("row" + row + ".g" + i);
                if (g && g.isVisible()) {
                    if (row == 0 || row == 2)
                        g.setPositionX(g0.getPositionX() + (posConf.groupWidth[row] * i + posConf.groupDistance[row] * i) * (row == 2 ? 1 : -1));
                    if (row == 1 || row == 3)
                        g.setPositionY(g0.getPositionY() + (posConf.groupHeight[row] * i + posConf.groupDistance[row] * i) * (row == 1 ? 1 : -1));
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
                if (row == 0) a.setPosition(a0.getPositionX() + i * posConf.paiADistance[row] + (a.pai > 0) * i * posConf.paiALiangDistance[row], a0.getPositionY());
                if (row == 2) {
                    a.setPositionX(a0.getPositionX() + i * posConf.paiADistance[row] + (a.pai > 0) * i * posConf.paiALiangDistance[row]);
                    if (!a.isUpping && !a.isDowning)
                        a.setPositionY(a.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
                }
                if (row == 1 || row == 3) a.setPosition(a0.getPositionX(), a0.getPositionY() + i * posConf.paiADistance[row] + (a.pai > 0) * i * posConf.paiALiangDistance[row]);
            }

            // recalc pai 13 position
            for (var i = 12; i >= 0; i--) {
                var pai = this.getPai(row, i);
                if (pai && pai.isVisible()) {
                    var p = (row == 1 || row == 2 ? 1 : -1);
                    if (row == 0) this.getPai(row, 13).setPosition(pai.getPositionX() + posConf.paiADistance[row] + posConf.paiMopaiDistance[row] * p, a0.getPositionY());
                    if (row == 2) {
                        this.getPai(row, 13).setPositionX(pai.getPositionX() + posConf.paiADistance[row] + posConf.paiMopaiDistance[row] * p);
                        if (!pai.isUpping && !pai.isDowning)
                            a.setPositionY(pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
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
                var pai = $("row" + row + ".a" + i);
                if (pai)
                    pai.setVisible(false);
            }
        },
        hidePai: function (row, id) {
            this.getPai(row, id).setVisible(false);
        },
        getPaiArr: function () {
            return this.getPaiArrOfRow(2);
        },
        getPaiArrOfRow: function (row) {
            var arr = [];
            for (var j = 0; j < 14; j++) {
                var pai = this.getPai(row, j);
                if (pai.pai > 0)
                    arr.push(pai.pai);
            }
            return arr;
        },
        addUsedPai: function () {
            var cache = {};

            //todo 相同牌变量5
            if (this.allCache == null) {
                this.allCache = {};
            }
            return function (row, val) {
                cache[row] = cache[row] || {};
                for (var j = 0; j < 40; j++) {
                    var pai = cache[row][j] || $("row" + row + ".c0.b" + j);
                    if (!pai) {
                        var maxNum = (row == 0 || row == 2) ? 10 : 10;
                        var k = (j >= 0 && j < maxNum ? 0 : parseInt(j / maxNum) * maxNum);
                        var b = $("row" + row + ".c0.b" + k);
                        if (!b) {
                            var b0 = $("row" + row + ".c0.b0");
                            var b10 = $("row" + row + ".c0.b" + maxNum);
                            b = duplicateSprite(b0);
                            b.setName("b" + k);
                            if (row == 0) b.setPositionY(parseInt(j / maxNum) * (b10.getPositionY() - b0.getPositionY()) + b0.getPositionY());
                            if (row == 1) b.setPositionX(parseInt(j / maxNum) * (b10.getPositionX() - b0.getPositionX()) + b0.getPositionX());
                            if (row == 2) b.setPositionY(parseInt(j / maxNum) * (b10.getPositionY() - b0.getPositionY()) + b0.getPositionY());
                            if (row == 3) b.setPositionX(parseInt(j / maxNum) * (b10.getPositionX() - b0.getPositionX()) + b0.getPositionX());
                            b0.getParent().addChild(b);
                            if (row == 2 || row == 1)
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

                    if (!pai.isVisible()) {
                        var paiName = getPaiNameByRowAndId(row, val, true);
                        setSpriteFrameByName(pai, paiName, "pai");
                        pai.setVisible(true);
                        pai.idx = j;
                        pai.pai = val;

                        //todo 相同牌变量6
                        if (!this.allCache[row]) {
                            this.allCache[row] = [];
                        }
                        this.allCache[row].push({idx: j, pai: val});

                        return pai;
                    }
                }
            };
        },
        addHuPai4Xueliu: function (row, val) {
            if (mapId != MAP_ID.SICHUAN_XUELIU)
                return;
            var arr = [];
            if (_.isNumber(val))
                arr.push(val);
            else if (_.isArray(val))
                arr = val;
            else return;
            if (!arr.length)
                return;
            var b0 = $("row" + row + ".h0.b0");
            var b1 = $("row" + row + ".h0.b1");
            var delta = (row == 0 || row == 2 ? b1.getPositionX() - b0.getPositionX() : b1.getPositionY() - b0.getPositionY());
            for (var i = 0; i < arr.length; i++) {
                var paiId = arr[i];
                for (var j = 0; j < 24; j++) {
                    var pai = $("row" + row + ".h0.b" + j);
                    if (!pai) {
                        var k = 0;
                        var b = $("row" + row + ".h0.b" + k);
                        pai = duplicateSprite(b);
                        if (row == 0 || row == 2) pai.setPositionX(delta * (j - k) + b.getPositionX());
                        if (row == 1 || row == 3) pai.setPositionY(delta * (j - k) + b.getPositionY());
                        pai.setName("b" + j);
                        pai.setVisible(false);
                        b.getParent().addChild(pai, j * posConf.paiUsedZOrder[row][k]);
                    }

                    pai.idx = j;
                    pai.pai = paiId;
                    if (!pai.isVisible()) {
                        var paiName = getPaiNameByRowAndId(row, paiId, true);
                        setSpriteFrameByName(pai, paiName, "pai");
                        pai.setVisible(true);
                        break;
                    }
                }
            }
        },
        removeOneTopUsedPai: function (row, paiId) {
            for (var j = 23; j >= 0; j--) {
                var pai = $("row" + row + ".c0.b" + j);
                if (pai && pai.isVisible()) {
                    if (!_.isUndefined(paiId) && pai.pai != paiId)
                        return;
                    pai.pai = 0;
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
            var that = this;
            var arr = decodeURIComponent(gameData.wanfaDesp).split(",");
            // if (arr.length >= 1)
            //     arr = arr.slice(1);
            // if (arr.length > 5) {
            //     //$('btn_wanfa').setVisible(true);
            //     $('lb_wanfa').setString(arr[0]);
            // } else {
            //     //$('btn_wanfa').setVisible(false);
            //     // $('lb_wanfa').setVisible(true);
            // }
            var wanfaStr = arr.join(",");
            if (state == ROOM_STATE_CREATED) {
                // $('lockLocation').setVisible(!window.inReview);
                $("signal").setVisible(true);
                // $('setting').setVisible(false);
                // $('chat').setVisible(false);
                $("timer").setVisible(false);
                $("timer2").setVisible(false);
                this.setInviteBtn(gameData.loginType != "yk");
                $("btn_fanhui").setVisible(gameData.uid != gameData.ownerUid);
                $("btn_jiesan").setVisible(gameData.uid == gameData.ownerUid);
                $("btn_zhunbei").setVisible(false);
                $("safe_gps").setVisible(false);
                $("btn_mic").setVisible(false);
                $("lb_roomid").setString(gameData.roomId);
                $("btn_control_btns").setVisible(false);
                if (!$("btn_wanfa").isVisible()) {
                    $("lb_wanfa").setString(wanfaStr);
                }
                $("lb_roomid").setVisible(true);
                $("row0").setVisible(false);
                $("row1").setVisible(false);
                $("row2").setVisible(false);
                $("row3").setVisible(false);
                this.hideControlBtns();
                //$('btn_info').setVisible(false);
                if ($("btn_queding")) $("btn_queding").setVisible(false);
                if ($("btn_quxiao")) $("btn_quxiao").setVisible(false);
                if ($("btn_xuanzewancheng")) $("btn_xuanzewancheng").setVisible(false);
                for (var i = 0; i < 4; i++) {
                    $("info" + i).setPosition($("info_n" + i).getPosition());
                    var que = $("info" + i + ".que");
                    que && que.setVisible(false);

                    var piao = $("info" + i + ".piao");
                    piao.setVisible(false);
                }
                this.hideArrow();
                disabledChuPaiIdMap = {};

                lianging = false;
                afterLianging = false;

            }
            if (state == ROOM_STATE_ONGOING) {
                if(this.assistant) {
                    this.assistant.removeFromParent(true);
                    this.assistant = null;
                }

                // $('lockLocation').setVisible(false);
                var setting = $("setting");
                if (!setting || !cc.sys.isObjectValid(setting))
                    return network.disconnect();
                // setting.setVisible(true);
                $("signal").setVisible(!isReplay);
                // $('chat').setVisible(true);
                $("timer").setVisible(true);
                $("timer2").setVisible(true);
                this.setInviteBtn(false);
                $("btn_fanhui").setVisible(false);
                $("btn_jiesan").setVisible(false);
                $("btn_zhunbei").setVisible(false);
                $("btn_mic").setVisible(!window.inReview);
                $("safe_gps").setVisible(!window.inReview);
                $("lb_roomid").setString(gameData.roomId);
                $("btn_control_btns").setVisible(true);
                if (!$("btn_wanfa").isVisible()) {
                    $("lb_wanfa").setString(wanfaStr);
                }
                $("row0.c0").setVisible(true);
                if ($("btn_queding")) $("btn_queding").setVisible(false);
                if ($("btn_quxiao")) $("btn_quxiao").setVisible(false);
                if ($("btn_xuanzewancheng")) $("btn_xuanzewancheng").setVisible(false);
                //$('lb_roomid').setVisible(false);
                $("row0").setVisible(true);
                $("row1").setVisible(true);
                $("row2").setVisible(true);
                $("row3").setVisible(true);

                // $('timer2.Text_7').setString(gameData.leftRound);
                var currentRound = gameData.total_round - gameData.leftRound;
                $("timer2.Text_7").setString((currentRound + "/" + gameData.total_round));

                $("row0.mid").removeAllChildren();
                $("row1.mid").removeAllChildren();
                $("row2.mid").removeAllChildren();
                $("row3.mid").removeAllChildren();

                for (var i = 0; i < 4; i++) {
                    if (roomState == ROOM_STATE_CREATED) {
                        $("info" + i).runAction(cc.sequence(
                            cc.moveTo(0.5, posConf.headPosBak[i]),
                            cc.delayTime(1.0),
                            cc.callFunc(that.createVideoView())));
                    }
                    else {
                        $("info" + i).setPosition(posConf.headPosBak[i]);
                    }

                    $("info" + i + ".ok").setVisible(false);
                }

                if (isReplay) {
                    $("setting").setVisible(false);
                    $("chat").setVisible(false);
                    this.hideControlBtns();
                }
            }
            if (state == ROOM_STATE_ENDED) {
                $("timer").setVisible(false);
                $("timer2").setVisible(false);
                if ($("btn_queding")) $("btn_queding").setVisible(false);
                if ($("btn_quxiao")) $("btn_xuanzewancheng").setVisible(false);
                if ($("btn_xuanzewancheng")) $("btn_xuanzewancheng").setVisible(false);
                this.hideChiPengGangHu();
                this.hideArrow();
                disabledChuPaiIdMap = {};

                lianging = false;
                afterLianging = false;

                hideGangStep = 0;
                hideGangArr = [];
                hidedGangArr = [];
                hideGangChupaiArr = [];
            }
            roomState = state;
        },
        setInviteBtn: function (status) {
            $("btn_invite").setVisible(status);
            $("btn_inviteLiaoBei").setVisible(status);
            $("btn_inviteXianLiao").setVisible(status);
            $("btn_copy").setVisible(status);
        },
        setDuiArr: function (row, duiArr) {
            for (var j = 0; j < 4; j++) {
                var g = $("row" + row + ".g" + j);
                if (g && g.isVisible())
                    g.setVisible(false);
            }
            for (var j = 0; j < duiArr.length; j++) {
                var dui = duiArr[j];
                if (dui.type == 1) this.setGChi(row, j, dui["pai_arr"]);
                if (dui.type == 2) this.setGPeng(row, j, dui["pai_arr"][0]);
                if (dui.type == 3) this.setGGang(row, j, dui["pai_arr"][0], dui["pai_arr"][0]);
                if (dui.type == 4) this.setGGang(row, j, dui["pai_arr"][0], 0);
                if (dui.type == 5) this.setGHide(row, j);
                if (dui.type == 6) this.setGFei(row, j, dui["pai_arr"]);
            }
        },
        clearTable4StartGame: function (isInitPai, isReconnect, reconnectData) {
            var that = this;

            $('hupai_tip').setVisible(false);

            this.onPlayerEnterExit();

            if (isInitPai) {
                forRows(function (i) {
                    var a0 = $("row" + i + ".a0");
                    if (a0.getPosition().x != posConf.paiA0PosBak[i].x || a0.getPosition().y != posConf.paiA0PosBak[i].y) {
                        a0.setPosition(posConf.paiA0PosBak[i]);
                        for (var j = 1; j < 13; j++) {
                            var node = $("row" + i + ".a" + j);
                            if (i == 0 || i == 2) node.setPositionX(posConf.paiADistance[i] * j + a0.getPositionX());
                            if (i == 1 || i == 3) node.setPositionY(posConf.paiADistance[i] * j + a0.getPositionY());
                        }
                    }
                    var mid = $("row" + i + ".mid");
                    mid.setLocalZOrder(999);
                });
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        this.getPai(i, j).setVisible(false);
                    }
                    for (var k = 0; k < 4; k++) {
                        var g = $("row" + i + ".g" + k);
                        if (g)
                            g.setVisible(false);
                    }
                    for (var k = 0; k < 4; k++) {
                        this.getGPai(i, 0, k).idx = k;
                    }
                    $("row" + i + ".c0.b0").setVisible(false);
                    $("row" + i + ".c0.b1").setVisible(false);
                    $("row" + i + ".c0.b10").setVisible(false);
                }
                forRows(function (i) {
                    for (var j = 0; j < 14; j++) {
                        this.getPai(i, j).setOpacity(0);
                    }
                    var c0 = $("row" + i + ".c0");
                    if (i == 0)
                        c0.setLocalZOrder(50);
                    for (var j = 0; j < 32; j++) {
                        var t = $("b" + j, c0);
                        if (t) {
                            t.idx = j;
                            t.setVisible(false);
                        }
                    }
                    if (mapId == MAP_ID.SICHUAN_XUELIU) {
                        for (var j = 0; j < 20; j++) {
                            var b0 = $("row" + i + ".h0.b" + j);
                            if (b0)
                                b0.setVisible(false);
                        }
                    }
                });
                for (var i = 0; i < 14; i++) {
                    var pai = this.getPai(2, i);
                    pai.hucards = null;
                    var hucardSprite = pai.getChildByName("hucardSprite");
                    if(hucardSprite){
                        hucardSprite.setVisible(false);
                    }
                }
            }

            $("cpghg").setVisible(false);
            $("timer").setVisible(false);

            //this.recalcPos(2);

            if (isReconnect) {
                isReconnect;
                hasChupai = reconnectData["has_chu"];
                that.setZhuang(uid2position[gameData.zhuangUid]);
                leftPaiCnt = reconnectData["left_pai_num"];
                $("timer2.Text_2").setString(leftPaiCnt);
                var playerPaiArr = reconnectData["player_pai"];
                //掉线之后提示胡添加map
                if (mapId == MAP_ID.SICHUAN_XUEZHAN
                    || mapId == MAP_ID.SICHUAN_DEYANG
                    || mapId == MAP_ID.SICHUAN_ZJ
                    || mapId == MAP_ID.SICHUAN_LJ
                    || mapId == MAP_ID.SICHUAN_JY
                    || mapId == MAP_ID.SICHUAN_GH
                    || mapId == MAP_ID.SICHUAN_XUELIU
                    || mapId == MAP_ID.SICHUAN_SRLF
                    || mapId == MAP_ID.SICHUAN_TRLF
                    || mapId == MAP_ID.SICHUAN_SRSF
                    || mapId == MAP_ID.SICHUAN_DDH
                    || mapId == MAP_ID.SICHUAN_YB
                    || mapId == MAP_ID.SICHUAN_MZ
                    || mapId == MAP_ID.SICHUAN_SF) {
                    var isAll13 = _.every(playerPaiArr, function (_player) {
                        return _player["cur_pai_num"] == 13;
                    });
                    if (isAll13) {
                        position2que[0] = position2que[1] = position2que[2] = position2que[3] = 0;
                    }
                    else {
                        for (var i = 0; i < playerPaiArr.length; i++) {
                            var playerPai = playerPaiArr[i];
                            var isHu = playerPai["is_hu"];
                            var row = uid2position[playerPai.uid];
                            this.setHuIconVisible(row, isHu);
                            position2que[row] = {1: 1, 10: 2, 19: 3}[playerPai["que"]];
                            if (!position2que[row]) {
                                $("info" + row + ".que").setVisible(false);
                                continue;
                            }
                            // if (playerPaiArr.length == 3) {
                            //     position2que[row] = 1;
                            //     continue;
                            // }
                            position2quelr[row] = getPaiLR(playerPai["que"]);
                            this.setInfoQue(row, position2que[row]);
                            var huPaiArr = playerPai["hu_pai_arr"] || [];
                            this.addHuPai4Xueliu(row, huPaiArr);
                        }
                    }
                }
                //页面刷新时,把定缺去掉
                if (mapId == MAP_ID.SICHUAN_SRLF
                    || mapId == MAP_ID.SICHUAN_TRLF
                    || mapId == MAP_ID.SICHUAN_SRSF
                    || mapId == MAP_ID.SICHUAN_DDH
                    || mapId == MAP_ID.SICHUAN_SF) {
                    for (var i = 0; i < 4; i++) {
                        $("info" + i + ".que").setVisible(false);
                    }
                }
                for (var i = 0; i < playerPaiArr.length; i++) {
                    var playerPai = playerPaiArr[i];
                    var isOffline = !!playerPai["is_offline"];
                    if (isOffline)
                        this.playerOnloneStatusChange(uid2position[playerPai.uid], isOffline);
                    var row = uid2position[playerPai.uid];
                    if (row != 2 && roomState == ROOM_STATE_ONGOING && playerPai["pai_arr"].length == 0) {
                        for (var j = 0; j < playerPai['cur_pai_num']; j++)
                            playerPai["pai_arr"].push(0);
                    }
                    if (mapId == MAP_ID.SICHUAN_YB && row != 2 && roomState == ROOM_STATE_ONGOING && playerPai["is_hu"]) {
                        var tmp_Paiarr = playerPai["pai_arr"];
                        playerPai["pai_arr"] = [];
                        for (var j = 0; j < playerPai['cur_pai_num'] - 1; j++)
                            playerPai["pai_arr"].push(0);
                        playerPai["pai_arr"].push(tmp_Paiarr[tmp_Paiarr.length - 1]);
                    }
                    if (row == 2 && playerPaiArr[i]["is_ting"])
                        afterLianging = true;
                    if ($("info" + row + ".liang"))
                        $("info" + row + ".liang").setVisible(playerPaiArr[i]["is_ting"]);
                    var _paiArr = playerPai["pai_arr"];
                    do {
                        if (row != 2 && (mapId === MAP_ID.SICHUAN_XUEZHAN
                            || mapId === MAP_ID.SICHUAN_DEYANG
                            || mapId === MAP_ID.SICHUAN_ZJ
                            || mapId === MAP_ID.SICHUAN_LJ
                            || mapId === MAP_ID.SICHUAN_JY
                            || mapId === MAP_ID.SICHUAN_GH
                            || mapId === MAP_ID.SICHUAN_MZ
                            || mapId === MAP_ID.SICHUAN_SF)) {
                            var huPaiArr = playerPai["hu_pai_arr"] || [];
                            if (huPaiArr.length > 0) {
                                _paiArr.splice(_paiArr.length - 1, 1);
                                _paiArr.push(huPaiArr[0]);
                                this.setPaiArrOfRow(row, _paiArr, (row != 2), false);
                                break;
                            }
                        }
                        if (mapId == MAP_ID.SICHUAN_YB && row != 2 && playerPai["is_hu"]) {
                            this.setPaiArrOfRow(row, _paiArr, (row != 2), false);
                            break;
                        }
                        that.setPaiArrOfRow(row, _paiArr, (row != 2), (row != 2), playerPai["liang_pai_arr"]);
                    } while (false);
                    var liangPaiArr = playerPai["liang_pai_arr"] || [];
                    for (var j = 0; j < liangPaiArr.length; j++)
                        disabledChuPaiIdMap[liangPaiArr[j]] = true;
                    var usedPaiArr = playerPaiArr[i]["used_pai_arr"];
                    for (var j = 0; j < usedPaiArr.length; j++)
                        this.addUsedPai(row, usedPaiArr[j]);
                    var duiArr = playerPaiArr[i]["dui_arr"];
                    this.setDuiArr(row, duiArr);

                    if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU)
                        $("info" + row + ".lb_bs").setString("x" + playerPai["multiple"]);
                }

                forRows(function (i) {
                    this.recalcPos(i);
                });

                if (roomState == ROOM_STATE_ONGOING) {
                    if (reconnectData["turn_uid"])
                        this.throwTurn(uid2position[reconnectData["turn_uid"]]);
                    this.enableChuPai();
                }
                else if (roomState == ROOM_STATE_ENDED) {
                    for (var i = 0; i < playerPaiArr.length; i++) {
                        var playerPai = playerPaiArr[i];
                        var isReady = !!playerPai["is_ready"];
                        if (isReady)
                            that.setReady(playerPai["uid"]);
                    }
                }
            }
            else if (isInitPai) {
                forRows(function (i) {
                    this.recalcPos(i);
                });
            }

            //for (var i = 0; i < 4; i++)
            //    for (var j = 1; j <= 15; j++)
            //        this.addUsedPai(i, j);
            if (isReconnect) {
                this.createVideoView();
            }
        },
        initClubAssistant: function(){
            var that = this;
            if(res.ClubAssistant_json && mRoom.club_id && mRoom.club_id > 0){
                this.assistant = new ClubAssistant(mRoom.club_id, isReplay, this.getRoomState() == ROOM_STATE_ONGOING);
                this.addChild(this.assistant, 100);
                this.list2103 = cc.eventManager.addCustomListener("custom_listener_2103", function (event) {
                    var data = event.getUserData();
                    if (data) {
                        var cmd = data['command'];
                        var errorCode = data['result'];
                        var errorMsg = data['msg'];

                        if (errorCode && errorMsg != "没有房间") {
                            alert1(errorMsg);
                        }
                        data.scene = 'ma';
                        cc.eventManager.dispatchCustomEvent(cmd, data);
                    }
                });
                this.list2 = cc.eventManager.addCustomListener("queryClub", function (event) {
                    var data = event.getUserData();
                    if(data.scene == 'home') return;
                    refreshClubData(data['arr']);
                });
                this.list1 = cc.eventManager.addCustomListener("BroadcastUid", function (event) {
                    var data = event.getUserData();
                    if(data.scene == 'home') return;
                    if (data) {
                        var message = data['data'];
                        if (message) {
                            var type = message['type'] || '';
                            if (type == MessageType.Invite) {
                            } else if (type == MessageType.Refused) {
                                if (!(that.getRoomState() == ROOM_STATE_ONGOING))
                                    alert1(message['msg']);
                            }
                        }
                    }
                });
            }
        },
        sendChuPai: function (row, idx, paiId) {
            //2017.4.28赖子牌不出判断
            // if (mapId == MAP_ID.SICHUAN_YB && laiziPaiId.indexOf(paiId) >= 0) {
            //     // hasChupai = true;
            //     this.setHuTipVisible(false);
            //     return;
            // }
            network.stop([3007, 3008, 4002, 4020, 4990]);

            network.send(4002, {room_id: gameData.roomId, pai_id: paiId, idx: idx});
            //听牌提示
            if(this.hupaiTipData){
                var hupaiCards = this.hupaiTipData["" + paiId];
                // console.log(hupaiCards);
                if(hupaiCards && hupaiCards.length > 0){
                    this.initHuPaiTishiLayer(hupaiCards);
                }else{
                    var hupai_tip = $('hupai_tip');
                    hupai_tip.setVisible(false);
                    this.hupaiTipData = null;
                }
            }

            //todo 相同牌2
            this.xiangTongPaiBianHui(-1);
            hasChupai = true;
            this.setHuTipVisible(false);
            this.HuCardTip(null, null, false);
        },
        initHuPaiTishiLayer: function(hupaiCards){
            var hupai_tip = $('hupai_tip');
            hupai_tip.setLocalZOrder(10);
            hupai_tip.setVisible(true);
            $('hupai_tip.bg').setVisible(false);

            TouchUtils.setOnclickListener(hupai_tip, function () {
                $('hupai_tip.bg').setVisible(! $('hupai_tip.bg').isVisible());
            });
            for(var i=1;i<=10;i++){
                if($('hupai_tip.bg').getChildByName('bg' + i)){
                    $('hupai_tip.bg').getChildByName('bg' + i).setVisible(false);
                }
            }
            for (var i=0;i<hupaiCards.length;i++) {
                (function (rowi) {
                    var bg0 = $('hupai_tip.bg.bg0');
                    var bg = $('hupai_tip.bg.bg' + rowi);
                    if(!bg){
                        bg = duplicateSprite(bg0, true);
                        bg.setName('bg' + rowi);
                        bg0.getParent().addChild(bg);
                    }
                    bg.setPositionX(bg0.getPositionX() + 150*(rowi));
                    bg.setVisible(true);
                    var paiName = getPaiNameByRowAndId(2, hupaiCards[rowi][0], true, true);
                    var card = bg.getChildByName('pai');
                    var bei_num = bg.getChildByName('bei_num');
                    var zhang_num = bg.getChildByName('zhang_num');
                    if(!card){
                        card = new cc.Sprite();
                        card.setName('pai');
                        card.setPosition(cc.p(45, 50));
                        bg.addChild(card);
                    }
                    setSpriteFrameByName(card, paiName, "pai");
                    if(bei_num)  bei_num.setString(hupaiCards[rowi][1]);
                    if(bei_num)  zhang_num.setString(hupaiCards[rowi][2]);
                })(i)
            }
            $('hupai_tip.bg').setContentSize(cc.size(150 + 150*hupaiCards.length, 160));
        },
        chuPai: function (row, idx, paiId, paiArr, liangPaiArr) {
            var that = this;
            that.upPai(2, -1);
            if (liangStep == 2) {
                liangStep = 0;
                that.downPai(row, idx);
                return;
            }

            if (row != 2 && !isReplay)
                idx = 13;

            var usedPai = this.addUsedPai(row, paiId);
            that.playerOnloneStatusChange(row, false);

            var pai = this.getPai(row, idx);
            var positionBak = pai.getPosition();
            var scaleBak = pai.getScaleX();
            pai.setVisible(false);
            if (row == 2) {
                pai.setPosition(posConf.paiPos[2][idx]);
                pai.setScale(posConf.paiA0ScaleBak[row][0], posConf.paiA0ScaleBak[row][1]);
                that.upPai(row, -1);
                that.recalcPos(row);
                that.showArrow(usedPai, row);
                that.checkPaiAmount();
                // 删除手里出的那张牌
                if (!gameData.opt_conf["disable_client_chupai"] && !isReplay) {
                    removeObjArray(paiArr, paiId);
                }
                that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), []);
            } else {
                pai.setPosition(positionBak);
                pai.setScale(scaleBak);

                that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), liangPaiArr);
                that.recalcPos(row);
                that.showArrow(usedPai, row);
            }

            that.playEffect("vCardOut");
            that.playEffect("vp" + paiId, position2sex[row]);

            network.start();
        },
        checkPaiPos: function (row) {
            for (var j = 0; j < 14; j++) {
                var pai = this.getPai(row, j);
                if (!pai.isUpping && !pai.isDowning)
                    pai.setPosition(posConf.paiPos[2][j].x, (pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY));
            }
        },

        sortPaiArr: function (paiArr, row, liangPaiArr, hupaiID, isLittle, isStand) {
            // cc.log("_____+++++123123");
            // cc.log(paiArr);
            var _paiArr = deepCopy(paiArr);
            liangPaiArr = liangPaiArr || [];
            hupaiID = hupaiID || null;
            var isPai13Show = false;
            if (row == 2)
                _.pull(_paiArr, 0);
            //定缺时这里加入
            if ((row == 2 || isReplay) && (mapId == MAP_ID.SICHUAN_YB
                || mapId == MAP_ID.SICHUAN_XUEZHAN
                || mapId == MAP_ID.SICHUAN_DEYANG
                || mapId == MAP_ID.SICHUAN_ZJ
                || mapId == MAP_ID.SICHUAN_LJ
                || mapId == MAP_ID.SICHUAN_JY
                || mapId == MAP_ID.SICHUAN_GH
                || mapId == MAP_ID.SICHUAN_MZ
                || mapId == MAP_ID.SICHUAN_XUELIU
                || mapId == MAP_ID.SICHUAN_SRSF )) {
                var lr = position2quelr[row];
                _paiArr.sort(function (a, b) {
                    return a * (lr && a >= lr.l && a <= lr.r ? 100 : 1) - b * (lr && b >= lr.l && b <= lr.r ? 100 : 1);
                });
            }
            else {
                cc.log("_____+++++");
                cc.log(_paiArr);
                _paiArr.sort(compareTwoNumbers);
            }

            if ((row == 2 || isReplay) && hupaiID != null && (mapId == MAP_ID.SICHUAN_XUEZHAN || mapId == MAP_ID.SICHUAN_DEYANG || mapId == MAP_ID.SICHUAN_ZJ || mapId == MAP_ID.SICHUAN_LJ || mapId == MAP_ID.SICHUAN_JY || mapId == MAP_ID.SICHUAN_GH || mapId == MAP_ID.SICHUAN_MZ)) {
                for (var i = 0; i < _paiArr.length; i++) {
                    if (_paiArr[i] == hupaiID) {
                        _paiArr.splice(i, 1);
                        // paiArr.push(hupaiID);
                        this.setPai(row, 13, hupaiID, isLittle, isStand, true).setOpacity(255);
                        // this.filterMyPai(row, 13, 0);
                        isPai13Show = true;
                        break;
                    }
                }
            }
            liangPaiArr.sort(compareTwoNumbers);
            return _paiArr;
        },

        upPai: function (row, idx, isDownAll) {

            isDownAll = _.isUndefined(isDownAll) ? true : isDownAll;
            var that = this;
            this.checkPaiPos(row);
            if (liangStep == 2 && idx >= 0) {
                var pai = that.getPai(row, idx);
                if (pai.isUp && !pai.isDowning) {
                    pai.isDowning = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                        , cc.callFunc(function () {
                            pai.isUp = false;
                            pai.isDowning = false;
                        })
                    ));
                }
                else if (!pai.isUpping) {
                    pai.isUpping = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                        , cc.callFunc(function () {
                            pai.isUp = true;
                            pai.isUpping = false;
                        })
                    ));
                }
                return;
            }
            for (var i = 0; i < 14; i++) {
                (function (j) {
                    if (!isDownAll && j != idx)
                        return;

                    var pai = that.getPai(row, j);
                    if (idx == j && pai.isUp) {
                        that.sendChuPai(row, idx, pai.pai);
                        pai.isUp = false;
                    }
                    else if (idx == j && !pai.isUp && !pai.isUpping) {
                        pai.isUpping = true;
                        pai.runAction(cc.sequence(
                            cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                            , cc.callFunc(function () {
                                pai.isUp = true;
                                pai.isUpping = false;
                            })
                        ));
                    }
                    else if (idx != j && pai.isUp && !pai.isDowning) {
                        pai.isDowning = true;
                        pai.runAction(cc.sequence(
                            cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                            , cc.callFunc(function () {
                                pai.isUp = false;
                                pai.isDowning = false;
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
            if (!pai.isUp || pai.isDowning)
                return;
            pai.isDowning = true;
            pai.runAction(cc.sequence(
                cc.moveTo(UPDOWNPAI_ANIM_DURATION, pai.getPositionX(), (!pai.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                , cc.callFunc(function () {
                    pai.isUp = false;
                    pai.isDowning = false;
                })
            ));
        },
        enableChuPai: function () {
            if (enableChupaiCnt > 0)
                return;
            enableChupaiCnt++;

            var that = this;

            var curPaiIdx = -1;
            var lastPaiIdx = -1;
            var beganTime, beganPosition;
            var isUp, paiIdx, paiId;
            var positionBak;
            var safeY;
            var toNodeDelta = {};
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    if (!isHuansanzhanging && (hasChupai || !that.isMyTurn() || that.hasHu(2) || disableChupai || roomState != ROOM_STATE_ONGOING)) {
                        return;
                    }
                    if (!isHuansanzhanging && (mapId == MAP_ID.SICHUAN_XUEZHAN
                        || mapId == MAP_ID.SICHUAN_DEYANG
                        || mapId == MAP_ID.SICHUAN_GH
                        || mapId == MAP_ID.SICHUAN_ZJ
                        || mapId == MAP_ID.SICHUAN_MZ
                        || mapId == MAP_ID.SICHUAN_XUELIU)
                        && !_.every(position2que, largerThan0)) {
                        return;
                    }
                    if ((mapId == MAP_ID.SICHUAN_LJ || mapId == MAP_ID.SICHUAN_JY ) && !_.every(position2que, largerThan0) && gameData.options && gameData.options.dingque) {
                        return;
                    }
                    if ((mapId == MAP_ID.SICHUAN_SRSF) && !_.every(position2que, largerThan0)) {
                        return;
                    }
                    if (mapId == MAP_ID.SICHUAN_YB) {
                        if (gameData.options && gameData.options.dique) {
                            if (!isHuansanzhanging && !_.every(position2que, largerThan0)) {
                                return;
                            }
                        }
                    }
                    var pai, _curPaiIdx = -1;
                    for (var i = 0; i < 14; i++) {
                        pai = that.getPai(2, i);
                        if (!pai.isVisible())
                            continue;
                        if (TouchUtils.isTouchMe(pai, touch, event, null)) {
                            _curPaiIdx = i;
                            break;
                        }
                    }

                    if (!isHuansanzhanging && (curPaiIdx >= 0 && _curPaiIdx != curPaiIdx) || !(pai.getNumberOfRunningActions() == 0 || !pai.isUpping && !pai.isDowning))
                        return false;
                    curPaiIdx = _curPaiIdx;
                    lastPaiIdx = curPaiIdx;
                    if (curPaiIdx >= 0) {
                        //其余三人能在换三张时换牌不按指定牌打出
                        if (/*hideGangStep == 1 && */!pai.isLiang && isHuansanzhanging == false) {
                            curPaiIdx = -1;
                            return;
                        }
                        //赖子牌不能打出,不能点击
                        if (mapId == MAP_ID.SICHUAN_YB) {
                            for (var i = 0; i < laiziPaiId.length; i++) {
                                if (pai.pai == laiziPaiId[i]) {
                                    pai.isLiang = false;
                                }
                            }
                        }
                        var queLR = position2quelr[uid2position[gameData.uid]];
                        var paiArr = that.getPaiArr();
                        if (gameData.mapId == MAP_ID.SICHUAN_YB && queLR) {
                            //宜宾玩法赖子牌的处理
                            var arr = [];
                            var dingque = false;
                            for (var i = 0; i < paiArr.length; i++) {
                                if (paiArr[i] >= queLR.l && paiArr[i] <= queLR.r && (paiArr[i] != laiziPaiId[0] && paiArr[i] != laiziPaiId[1] && paiArr[i] != laiziPaiId[2])) {
                                    arr.push(paiArr[i]);
                                }
                            }
                            if (arr.length == 0) {
                                dingque = false;
                            }
                            else {
                                dingque = true;
                            }

                            var hasQue = (queLR && dingque);
                            if (hasQue) {
                                if (queLR && !_.every(paiArr, function (n) {
                                        return n < queLR.l || n > queLR.r;
                                    })) {
                                    var _paiId = pai.pai;
                                    if (_paiId < queLR.l || _paiId > queLR.r) {
                                        curPaiIdx = -1;
                                        beganPosition = null;
                                        return;
                                    }
                                }
                            }
                        } else {
                            if (queLR && !_.every(paiArr, function (n) {
                                    return n < queLR.l || n > queLR.r;
                                })) {
                                var _paiId = pai.pai;
                                if (_paiId < queLR.l || _paiId > queLR.r) {
                                    curPaiIdx = -1;
                                    beganPosition = null;
                                    return;
                                }
                            }
                        }
                        for (var k = 0; k < 14; k++)
                            if (that.getPai(2, k).getNumberOfRunningActions() > 0)
                                return false;

                        that.playEffect("vCardClick");

                        beganTime = getCurrentTimeMills();

                        // back up
                        pai.positionBak = pai.getPosition();
                        pai.scaleBak = pai.getScaleX();

                        isUp = pai.isUp;

                        if (isHuansanzhanging) {
                            if (!isUp) {
                                that.upPai(2, pai.idx, false);
                            }
                            else
                                that.downPai(2, pai.idx);
                            curPaiIdx = -1;
                            beganPosition = null;
                            return;
                        }
                        if (!isUp) {
                            that.upPai(2, pai.idx);
                        }

                        //胡牌提示
                        if (pai.hucards) {
                            that.HuCardTip(pai.hucards, pai.getPositionX(), true);
                        }else{
                            that.HuCardTip(null, null, false);
                        }

                        paiIdx = pai.idx;
                        paiId = pai.pai;
                        positionBak = _.clone(posConf.paiPos[2][curPaiIdx]);
                        positionBak.y = (true || isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
                        beganPosition = touch.getLocation();
                        safeY = pai.getBoundingBox().height;
                        var a = touch.getLocation();
                        var b = pai.convertToNodeSpace(touch.getLocation());
                        toNodeDelta.x = a.x - b.x;
                        toNodeDelta.y = a.y - b.y;
                        //todo 相同牌3
                        that.xiangTongPaiBianHui(paiId);
                    }

                    return curPaiIdx >= 0;
                },
                onTouchMoved: function (touch, event) {
                    //that.HuCardTip(null, null, false);
                    if (curPaiIdx < 0)
                        return;

                    if (isHuansanzhanging)
                        return;

                    var pai = that.getPai(2, curPaiIdx);

                    if (!pai.isLiang) {
                        return;
                    }

                    if (beganPosition) {
                        var p = touch.getLocation();
                        p.x -= toNodeDelta.x;
                        p.y -= toNodeDelta.y;
                        if (p.y < safeY) {
                            if (pai.getNumberOfRunningActions() <= 0)
                                pai.setPosition(positionBak);
                            return;
                        }
                        p = pai.convertToNodeSpace(touch.getLocation());
                        p.x += pai.getPositionX() - pai.getBoundingBox().width / 2;
                        p.y += pai.getPositionY() - pai.getBoundingBox().height / 2;
                        pai.setPosition(p);
                    }
                },
                onTouchEnded: function (touch, event) {
                    // that.HuCardTip(null, null, false);
                    if (curPaiIdx < 0)
                        return;

                    if (isHuansanzhanging)
                        return;

                    var pai = that.getPai(2, curPaiIdx);
                    if (beganPosition) {
                        var p = touch.getLocation();
                        p.x -= toNodeDelta.x;
                        p.y -= toNodeDelta.y;
                        var now = getCurrentTimeMills();
                        var isSend = (p.y < safeY && isUp && (lastPaiIdx >= 0 && lastPaiIdx == curPaiIdx) && Math.abs(now - beganTime) < 168) || (p.y > safeY);
                        if (isSend) {
                            //在send时候,让isliang不等于flase时候在出牌
                            if (liangStep == 0 && hideGangStep == 0 && pai.isLiang != false) {
                                that.sendChuPai(2, paiIdx, paiId);
                                if (!gameData.opt_conf["disable_client_chupai"]) {
                                    that.chuPai(2, paiIdx, paiId, that.getPaiArr());
                                }
                            }
                        }
                        else {
                            that.checkPaiPos(2);
                            setTimeout(function () {
                                curPaiIdx = -1;
                                beganPosition = null;
                            }, parseInt(UPDOWNPAI_ANIM_DURATION * 100));
                        }
                    }
                    curPaiIdx = -1;
                    beganPosition = null;
                    return false;
                }
            });
            that.HuCardTip(null, null, false);

            return cc.eventManager.addListener(chupaiListener, $("row2"));
        },
        countDown: function () {
            var that = this;
            var timer = null;
            return function (seconds) {
                if (isReplay) {
                    $("timer.sec").setString("");
                    return;
                }
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                $("timer.sec").setString(seconds);
                timer = setInterval(function () {
                    var sec = $("timer.sec");
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
            };
        },
        closePai: function (paiId) {

        },

        //todo 相同牌1
        xiangTongPaiBianHui: function (paiId) {

            for (var i = 0; i < 4; i++) {
                if (this.allCache[i]) {
                    for (var j = 0; j < this.allCache[i].length; j++) {
                        var obj = this.allCache[i][j];
                        // console.log("牌池Id :" + obj.pai);
                        if (obj.pai == paiId) {
                            Filter.grayRed($("row" + i + ".c0.b" + obj.idx));
                        }
                        else {
                            Filter.remove($("row" + i + ".c0.b" + obj.idx));
                        }
                        // && paiId != laiziPaiId
                    }
                }
            }
        },

        setPaiArrOfRow: function (row, paiArr, isLittle, isStand, liangPaiArr, liangAll, hupaiID) {
            liangPaiArr = liangPaiArr || [];
            hupaiID = hupaiID || null;
            var isPai13Show = false;

            paiArr = this.sortPaiArr(paiArr, row, liangPaiArr, hupaiID, isLittle, isStand);
            //调用这个sortFront方法实现赖子在最左侧
            if (!isLittle) {
                this.sortFront(paiArr, laiziPaiId[0]);
                this.sortFront(paiArr, laiziPaiId[1]);
                if (laiziPaiId[2] != 0) {
                    this.sortFront(paiArr, laiziPaiId[2]);
                }
            }

            for (var j = 0; j < paiArr.length; j++)
                this.setPai(row, j, paiArr[j], isLittle, isStand, true).setOpacity(255);
            for (; j < 14; j++) {
                if (j == 13 && isPai13Show) {
                    continue;
                }
                this.setPai(row, j, 0, isLittle, isStand, false);

            }

            var cond = (row == 2);
            if (mapId == MAP_ID.CHANGSHA)
                cond = (cond && afterLianging);
            else
                cond = (cond && hideGangStep > 0);
            if (cond) {
                if (mapId == MAP_ID.CHANGSHA) {
                    var pai = this.getPai(2, 13);
                    this.filterMyPai(2, 13, 0);
                    pai.isLiang = false;
                }
                for (var i = 0; i < paiArr.length; i++) {
                    var pai = this.getPai(2, i);
                    this.filterMyPai(2, i, 0);
                    pai.isLiang = false;
                }
                for (var j = 0; j < liangPaiArr.length; j++) {
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = this.getPai(2, i);
                        if (pai.pai == liangPaiArr[j] && !pai.isLiang) {
                            pai.isLiang = true;

                            this.filterMyPai(row, i, 1);
                            //this.downPai(2, i);
                            if (!liangAll)
                                break;
                        }
                        //else
                        //    Filter.grayMask(pai);
                    }
                }
            }
            else {
                if (row == 1)
                    for (var j = 0; j < liangPaiArr.length; j++)
                        this.setPai(row, j, liangPaiArr[j], isLittle, isStand, true);
                if (row == 3)
                    for (var j = 0; j < liangPaiArr.length; j++)
                        this.setPai(row, paiArr.length - liangPaiArr.length + j, liangPaiArr[j], isLittle, isStand, true);
                if (gameData.appId == APP_ID.FYDP) {
                    // this.checkMyPaiColor4SC();
                }
                else if (row == 2 || isReplay) {
                    for (var j = 0; j < paiArr.length; j++) {
                        this.filterMyPai(row, j, 1);
                    }
                    this.filterMyPai(row, 13, 1);
                }
            }
            if (false && disabledChuPaiIdMap) {
                for (var i = 0; i < paiArr.length; i++) {
                    if (disabledChuPaiIdMap[paiArr[i]]) {
                        var pai = this.getPai(2, i);
                        this.filterMyPai(row, i, 0);
                        pai.isLiang = false;
                    }
                }
            }
        },
        mopai: function (row, paiId, paiArr, liangPaiArr, isTing) {
            if (row == 2) {
                hasChupai = false;
                this.setPaiArrOfRow(2, paiArr, false, false, liangPaiArr);
            }
            var that = this;
            var func = function () {
                if (row == 2 && gameData.appId == APP_ID.FYDP && mapId != MAP_ID.SICHUAN_YB) {
                    that.checkMyPaiColor4SC();
                }
                that.throwTurn(row, isTing);

                if (row == 2)
                    that.recalcPos(2);

                that.countDown(10);
            };

            if (row == 2)
                that.recalcPos(2);

            if (row == 2) {
                network.stop([3008, 4020]);
                var pai = this.setPai(row, 13, (row == 2 || isReplay ? paiId : 0), (row != 2), (row != 2), false);
                pai.setOpacity(255);
                var paiParent = pai.getParent();
                var animPai = paiParent.getChildByName('animPai');
                if(!animPai){
                    animPai = duplicateSprite(pai);
                    animPai.setName('animPai');
                    paiParent.addChild(animPai);
                }
                animPai.setPosition(pai.getPosition());
                var paiName = getPaiNameByRowAndId(2, pai.pai, false);
                setSpriteFrameByName(animPai, paiName, "pai");
                animPai.setVisible(true);
                animPai.y += 30;
                animPai.runAction(cc.sequence(
                    cc.moveBy(0.1, 0, -40).easing(cc.easeIn(1.5)),
                    cc.moveBy(0.05, 0, 15),
                    cc.moveBy(0.05, 0, -5),
                    cc.callFunc(function () {
                        network.start();
                        animPai.setVisible(false);
                        pai.setVisible(true);
                        pai.setOpacity(255);
                        func();
                    })
                ));
            } else {
                this.setPai(row, 13, (row == 2 || isReplay ? paiId : 0), (row != 2), (row != 2), true, isReplay)
                    .runAction(cc.fadeIn(MOPAI_ANIM_DURATION));
                func();
            }
        },
        showChiPengGangHu: function (row, paiId, chi, peng, gang, hu, ting, fei, ti, data) {
            var that = this;

            //回放在else里面做操作
            if (!isReplay) {
                var children = $("cpghg").getChildren();
                for (var i = 0; i < children.length; i++) {
                    children[i].setVisible(false);
                }

                if (mapId == MAP_ID.CHANGSHA && gang)
                    ting = 1;

                var sum = (chi || 0) + (peng || 0) + (gang || 0) + (hu || 0) + (ting || 0) + (fei || 0) + (ti || 0) + 1;
                $("cpghg.chi").setVisible(false);
                $("cpghg.peng").setVisible(false);
                $("cpghg.gang").setVisible(false);
                $("cpghg.hu").setVisible(false);
                $("cpghg.ting").setVisible(false);
                if ($("cpghg.fei") && cc.sys.isObjectValid($("cpghg.fei")))
                    $("cpghg.fei").setVisible(false);
                if ($("cpghg.ti") && cc.sys.isObjectValid($("cpghg.ti")))
                    $("cpghg.ti").setVisible(false);

                var nodeArr = [];
                if (chi) nodeArr.push($("cpghg.chi"));
                if (peng) nodeArr.push($("cpghg.peng"));
                if (gang) nodeArr.push($("cpghg.gang"));
                if (hu) nodeArr.push($("cpghg.hu"));
                if (ting) nodeArr.push($("cpghg.ting"));
                if (fei) nodeArr.push($("cpghg.fei"));
                if (ti) nodeArr.push($("cpghg.ti"));
                nodeArr.push($("cpghg.guo"));

                //如果是自摸  过按钮  2秒后才能点
                if(data && data.uid == gameData.uid && hu && that.isMyTurn()){
                    TouchUtils.setClickDisable($("cpghg.guo"), true);
                    Filter.grayScale($("cpghg.guo"));
                    that.scheduleOnce(function(){
                        Filter.remove($("cpghg.guo"));
                        TouchUtils.setClickDisable($("cpghg.guo"), false);
                    }, 2);
                }

                for (var i = 0; i < nodeArr.length; i++) {
                    if (i < nodeArr.length - 1) {
                        var node = $("cpghg." + nodeArr[i].getName() + ".a");
                        if (!node) {
                            var node = duplicateSprite($("row2.c0.b0"));
                            node.setName("a");
                            node.setVisible(true);
                            node.setPosition($("cpghg." + nodeArr[i].getName() + ".n").getPosition());
                            nodeArr[i].addChild(node);
                        }
                        var paiName = null;
                        if (nodeArr[i].getName() == "ti" /*paiId == 0*/) {
                            paiName = getPaiNameByRowAndId(2, data["ti_paiIds"][0], true);
                        }
                        else {
                            paiName = getPaiNameByRowAndId(2, paiId, true);
                        }
                        setSpriteFrameByName(node, paiName, "pai");
                    }

                    if (typeof posConf.cpghgPositionX[sum][i] === "number")
                        nodeArr[i].setPositionX(posConf.cpghgPositionX[sum][i]);
                    else
                        nodeArr[i].setPosition(posConf.cpghgPositionX[sum][i]);
                    nodeArr[i].setVisible(true);
                }

                if (mapId == MAP_ID.SICHUAN_SRLF && ting) {
                    $("cpghg.ting").setTexture(cc.textureCache.addImage("res/submodules/majiang/image/ma_sc/ting.png"));
                }

                chi && TouchUtils.setOnclickListener($("cpghg.chi"), function () {
                    that.showChiLayer(paiId, function (paiId, oriPaiId) {
                        that.sendChiPengGang(OP_CHI, 2, paiId, oriPaiId);
                    });
                });

                peng && TouchUtils.setOnclickListener($("cpghg.peng"), function () {
                    that.sendChiPengGang(OP_PENG, 2, paiId);
                    that.hideChiPengGangHu();
                });

                fei && TouchUtils.setOnclickListener($("cpghg.fei"), function () {
                    if (mapId == MAP_ID.SICHUAN_YB) {
                        that.sendChiPengGang(OP_FEI, 2, paiId);
                        that.hideChiPengGangHu();
                    }

                });
                ti && TouchUtils.setOnclickListener($("cpghg.ti"), function () {
                    if (mapId == MAP_ID.SICHUAN_YB) {
                        var ybTiNum = 0;
                        var firstGangKey = 0;
                        for (var k in data["ti_paiIds"]) {
                            if (ybTiNum == 0) firstGangKey = k;
                            if (k) ybTiNum++;
                        }
                        if (ybTiNum > 1) {
                            var cancelfunc = function () {
                                for (var i = 0; i < nodeArr.length; i++) {
                                    nodeArr[i].setVisible(true);
                                }
                            };
                            var gangListSp = new GangListSpLayer(data, cancelfunc);
                            that.addChild(gangListSp);
                            for (var i = 0; i < nodeArr.length; i++) {
                                nodeArr[i].setVisible(false);
                            }
                        } else {
                            if (ybTiNum == 1) {
                                //就一个杠
                                network.send(4003, {
                                    room_id: gameData.roomId,
                                    op: OP_TI,
                                    pai_id: paiId,
                                    idx: 0,
                                    ti_paiId: data["ti_paiIds"][0]
                                });
                            } else {
                                that.sendChiPengGang(OP_TI, 2, paiId);
                                that.hideChiPengGangHu();
                            }
                        }

                    }

                });

                ting && TouchUtils.setOnclickListener($("cpghg.ting"), function () {
                    var _paiId = paiId;
                    if (mapId == MAP_ID.SICHUAN_SRLF) {
                        that.sendChiPengGang(OP_TING, 2, _paiId);
                    }
                });

                hu && TouchUtils.setOnclickListener($("cpghg.hu"), function () {
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

                gang && TouchUtils.setOnclickListener($("cpghg.gang"), function () {
                    if (mapId == MAP_ID.CHANGSHA) {
                        var isKaigang = data["kaigang"];
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

                TouchUtils.setOnclickListener($("cpghg.guo"), function () {
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

                $("cpghg").setVisible(true);

                this.countDown(12);
            } else {
                var cpg = $("cpghRep" + row);
                if (!cpg || !cc.sys.isObjectValid(cpg)) {
                    return;
                }
                for (var i = 0; i < 9; i++) {
                    if (i == 6) {
                        continue;
                    }
                    if (!cpg.getChildByName("sp1_" + i)) {
                        var sp = new cc.Sprite("res/submodules/majiang/image/ma_sc/cpghRep/sp1_" + i + ".png");
                        sp.setPosition(cpg.getChildByName("sp_" + i).getPosition());
                        sp.setName("sp1_" + i);
                        cpg.addChild(sp);
                        sp.setVisible(false);
                    }
                }
                $("cpghRep" + row + ".sp1_0").setVisible(!!chi);
                $("cpghRep" + row + ".sp1_1").setVisible(!!peng);
                $("cpghRep" + row + ".sp1_2").setVisible(!!gang);
                $("cpghRep" + row + ".sp1_3").setVisible(!!hu);
                $("cpghRep" + row + ".sp1_7").setVisible(!!fei);
                $("cpghRep" + row + ".sp1_8").setVisible(!!ti);
                $("cpghRep" + row + ".sp1_4").setVisible(true);
                $("cpghRep" + row + ".sp1_5").setVisible(false);

                $("cpghRep" + row + ".sp_0").setVisible(!chi);
                $("cpghRep" + row + ".sp_1").setVisible(!peng);
                $("cpghRep" + row + ".sp_2").setVisible(!gang);
                $("cpghRep" + row + ".sp_3").setVisible(!hu);
                $("cpghRep" + row + ".sp_7").setVisible(!fei);
                $("cpghRep" + row + ".sp_8").setVisible(!ti);
                $("cpghRep" + row + ".sp_4").setVisible(false);
                $("cpghRep" + row + ".sp_5").setVisible(true);

                var pai = $("cpghRep" + row + ".sp_pai");
                var paiName = getPaiNameByRowAndId(2, paiId, true);
                pai.setScale(0.65, 0.65);
                setSpriteFrameByName(pai, paiName, "pai");
                cpg.setVisible(true);
            }
            // that.setHuTipVisible(false);
        },
        showTingLiang: function (row, ting, liang) {
            return;
            var that = this;

            if (!isReplay) {
                $("tl.ting").setVisible(!!ting);
                $("tl.liang").setVisible(!!liang);

                ting && TouchUtils.setOnclickListener($("tl.ting"), function () {
                    that.sendChiPengGang(OP_PENG, 2, paiId);
                    that.hideChiPengGangHu();
                });

                liang && TouchUtils.setOnclickListener($("tl.liang"), function () {
                    that.sendChiPengGang(OP_PENG, 2, paiId);
                    that.hideChiPengGangHu();
                });

                $("tl").setVisible(true);
            } else {
                var cpg = $("cpghRep" + row);
                for (var i = 0; i < 6; i++) {
                    if (!cpg.getChildByName("sp1_" + i)) {
                        var sp = new cc.Sprite("res/submodules/majiang/image/ma_sc/cpghRep/sp1_" + i + ".png");
                        sp.setPosition(cpg.getChildByName("sp_" + i).getPosition());
                        sp.setName("sp1_" + i);
                        cpg.addChild(sp);
                        sp.setVisible(false);
                    }
                }

                for (var i = 8; i < 10; i++) {
                    if (!cpg.getChildByName("sp1_" + i)) {
                        var sp = new cc.Sprite("res/submodules/majiang/image/ma_sc/cpghRep/sp1_" + i + ".png");
                        sp.setPosition(cpg.getChildByName("sp_" + i).getPosition());
                        sp.setName("sp1_" + i);
                        cpg.addChild(sp);
                        sp.setVisible(false);
                    }
                }

                $("cpghRep" + row + ".sp1_0").setVisible(!!chi);
                $("cpghRep" + row + ".sp1_1").setVisible(!!peng);
                $("cpghRep" + row + ".sp1_2").setVisible(!!gang);
                $("cpghRep" + row + ".sp1_3").setVisible(!!hu);
                $("cpghRep" + row + ".sp1_8").setVisible(!!fei);
                $("cpghRep" + row + ".sp1_9").setVisible(!!ti);

                $("cpghRep" + row + ".sp1_4").setVisible(true);
                $("cpghRep" + row + ".sp1_5").setVisible(false);

                $("cpghRep" + row + ".sp_0").setVisible(!chi);
                $("cpghRep" + row + ".sp_1").setVisible(!peng);
                $("cpghRep" + row + ".sp_2").setVisible(!gang);
                $("cpghRep" + row + ".sp_3").setVisible(!hu);
                $("cpghRep" + row + ".sp_8").setVisible(!fei);
                $("cpghRep" + row + ".sp_9").setVisible(!ti);

                $("cpghRep" + row + ".sp_4").setVisible(false);
                $("cpghRep" + row + ".sp_5").setVisible(true);

                var pai = $("cpghRep" + row + ".sp_pai");
                var paiName = getPaiNameByRowAndId(2, paiId, true);
                pai.setScale(0.65, 0.65);
                setSpriteFrameByName(pai, paiName, "pai");
                cpg.setVisible(true);
            }
        },
        hideChiPengGangHu: function () {
            $("cpghg").setVisible(false);
            if ($("chiLayer"))
                $("chiLayer").removeFromParent(false);
            // this.setHuTipVisible(true);
        },
        sendChiPengGang: function (op, row, paiId, oriPaiId) {
            network.send(4003, {room_id: gameData.roomId, op: op, pai_id: paiId, ori_pai_id: oriPaiId});
        },
        showHuansanzhang: function (arr, arr1, selMap) {
            var that = this;
            if($('hsz.tishi.txt')){
                $('hsz.tishi.txt').setString(that.isHuanjiZhuang() == 3?'请选择要换的三张牌':'请选择要换的四张牌');
            }
            if($('hsz.tishi._')){
                $('hsz.tishi._').setString(that.isHuanjiZhuang() == 3?'请选择要换的三张牌':'请选择要换的四张牌');
            }

            if (!$("Node").isVisible()) {
                setSpriteFrameByName($("Node.r3.p2s0_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r3.p2s0_2_0"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r3.p2s0_2_1"), "p2s" + 0 + ".png", "pai");
                if($("Node.r3.p2s0_2_2"))  setSpriteFrameByName($("Node.r3.p2s0_2_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r2.p2s0_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r2.p2s0_2_0"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r2.p2s0_2_1"), "p2s" + 0 + ".png", "pai");
                if($("Node.r2.p2s0_2_2"))  setSpriteFrameByName($("Node.r2.p2s0_2_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r1.p2s0_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r1.p2s0_2_0"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r1.p2s0_2_1"), "p2s" + 0 + ".png", "pai");
                if($("Node.r1.p2s0_2_2"))  setSpriteFrameByName($("Node.r1.p2s0_2_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r0.p2s0_2"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r0.p2s0_2_0"), "p2s" + 0 + ".png", "pai");
                setSpriteFrameByName($("Node.r0.p2s0_2_1"), "p2s" + 0 + ".png", "pai");
                if($("Node.r0.p2s0_2_2"))  setSpriteFrameByName($("Node.r0.p2s0_2_2"), "p2s" + 0 + ".png", "pai");
                if(gameData.players.length == 3){
                    $("Node.r0").setVisible(false);
                }
                if(gameData.players.length == 2){
                    $("Node.r1").setVisible(false);
                    $("Node.r3").setVisible(false);
                }
            }
            if(that.isHuanjiZhuang() == 3 && $("Node.r0.p2s0_2_2")){
                $("Node.r0.p2s0_2_2").setVisible(false);
                $("Node.r1.p2s0_2_2").setVisible(false);
                $("Node.r2.p2s0_2_2").setVisible(false);
                $("Node.r3.p2s0_2_2").setVisible(false);
            }
            $("Node").setRotation(0);
            $("Node").setVisible(true);
            $("Node.dice").setVisible(false);

            //换三张
            var posArr = [cc.p(0, 150), cc.p(150, 0), cc.p(0, -150), cc.p(-150, 0)];
            if(that.isHuanjiZhuang() == 4){
                posArr = [cc.p(0, 180), cc.p(180, 0), cc.p(0, -180), cc.p(-180, 0)];
            }
            for(var i=0;i<4;i++){
                $("Node.r" + i).setRotation(0);
                $("Node.r" + i).setPosition(posArr[i]);
                if(that.isHuanjiZhuang() == 3){
                    if($("Node.r" + i + ".p2s0_2_2"))  $("Node.r" + i + ".p2s0_2_2").setVisible(false);
                }else{
                    $("Node.r" + i + ".p2s0_2").setPositionX(-58*1.5);
                    $("Node.r" + i + ".p2s0_2_0").setPositionX(-58*0.5);
                    $("Node.r" + i + ".p2s0_2_1").setPositionX(58*0.5);
                    if($("Node.r" + i + ".p2s0_2_2"))  $("Node.r" + i + ".p2s0_2_2").setPositionX(58*1.5);
                }
            }

            for (var uid in selMap) {
                if(uid > 0) {
                    isHuansanzhanging = isHuansanzhanging || !selMap[uid];
                    var row = uid2position[uid];
                    $("Node.r" + row).setVisible(selMap[uid]);

                    var hszSp = $("qn" + row + ".hsz");
                    if (!hszSp) {
                        hszSp = new cc.Sprite("res/submodules/majiang/image/ma_sc/hsz1h.png");
                        hszSp.setName("hsz");
                        $("qn" + row).addChild(hszSp);
                    }
                    if(that.isHuanjiZhuang() == 3){
                        hszSp.setTexture(cc.textureCache.addImage(selMap[uid] ? "res/submodules/majiang/image/ma_sc/hsz1h.png" : "res/submodules/majiang/image/ma_sc/hsz0h.png"));
                    }else{
                        hszSp.setTexture(cc.textureCache.addImage(selMap[uid] ? "res/submodules/majiang/image/ma_sc/hsz1h_4.png" : "res/submodules/majiang/image/ma_sc/hsz0h_4.png"));
                    }
                    hszSp.setVisible(true);
                    if (gameData.uid == uid && !selMap[gameData.uid])
                        hszSp.setVisible(false);
                    hszSp.setScale(0.8);
                }
            }

            if (!selMap[gameData.uid]) {
                $("hsz").setVisible(true);
                if (arr) {
                    var paiArr = this.getPaiArr();
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = 0; j < paiArr.length; j++) {
                            if (paiArr[j] == arr[i]) {
                                paiArr[j] = 0;
                                this.upPai(2, j, false);
                                break;
                            }
                        }
                    }
                }
                var checkSanzhangPai = function () {
                    var paiArr = that.getPaiArr();
                    var selPaiIdArr = [];
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = that.getPai(2, i);
                        if (pai.isUp) {
                            selPaiIdArr.push(pai.pai);
                        }
                    }
                    if (that.isHuanjiZhuang() == 3 && selPaiIdArr.length != 3) {
                        that.showTip("请选择3张牌", true, 1500);
                        return false;
                    } else if (that.isHuanjiZhuang() == 4 && selPaiIdArr.length != 4) {
                        that.showTip("请选择4张牌", true, 1500);
                        return false;
                    }
                    else{
                        var paiId0 = selPaiIdArr[0];
                        for (var i = 1; i < selPaiIdArr.length; i++)
                            if (!isSameColor(paiId0, selPaiIdArr[i])) {
                                that.showTip("必须选择相同花色的牌", true, 1500);
                                return false;
                            }
                    }
                    return selPaiIdArr;
                };
                TouchUtils.setOnclickListener($("hsz.ssz1"), function () {
                    var paiIdArr = checkSanzhangPai();
                    console.log(paiIdArr);
                    if (paiIdArr) {
                        network.send(4064, {
                            room_id: gameData.roomId,
                            dir: parseInt(getCurTimestamp() % 2),
                            pai0: paiIdArr[0],
                            pai1: paiIdArr[1],
                            pai2: paiIdArr[2],
                            pai3: paiIdArr[3]
                        });
                    }
                });

                if (/*row == 2 && */this.isMyPaiContainsQue()) {
                    $("pig").setVisible(true);
                } else {
                    $("pig").setVisible(false);
                }
            }
            else {
                if (arr1) {
                    var paiArr = this.getPaiArr();
                    if (paiArr.length >= 13) {
                        for (var i = 0; i < arr1.length; i++) {
                            for (var j = 0; j < paiArr.length; j++) {
                                if (paiArr[j] == arr1[i]) {
                                    paiArr.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        this.setPaiArrOfRow(2, paiArr);
                        this.upPai(2, -1);
                    }
                }
                isHuansanzhanging = false;
                $("hsz").setVisible(false);
            }
        },
        showQueLittle: function (row, que) {
            var queSp = $("qn" + row + ".que");
            if (!queSp) {
                queSp = new cc.Sprite("res/submodules/majiang/image/ma_sc/que" + que + ".png");
                queSp.setName("que");
                $("qn" + row).addChild(queSp);
            }
            queSp.setVisible(que > 0);
        },
        showQue: function (row, que) {
            if (que > 3)
                que = {1: 1, 10: 2, 19: 3}[que];
            if (row == 2) {
                if (que > 0) {
                    this.showQueLittle(row, que);
                }
            }
            else if ($("qn" + row)) {
                var dingquezhongSp = $("qn" + row + ".dingquezhong");
                if (!dingquezhongSp) {
                    dingquezhongSp = new cc.Sprite("res/submodules/majiang/image/ma_sc/dingqueh.png");
                    dingquezhongSp.setName("dingquezhong");
                    $("qn" + row).addChild(dingquezhongSp);
                }
                dingquezhongSp.setTexture(que <= 0 ? "res/submodules/majiang/image/ma_sc/dingqueh.png" : "res/submodules/majiang/image/ma_sc/yidingqueh.png");
                dingquezhongSp.setVisible(true);
            }
        },
        setInfoQue: function (row, que) {
            var sp = $("info" + row + ".que");
            var t = {1: 1, 10: 2, 19: 3}[que] || que;
            sp.setTexture(cc.textureCache.addImage("res/submodules/majiang/image/ma_sc/que" + t + ".png"));
            if (gameData.mapId === MAP_ID.SICHUAN_MZ &&
                ((gameData.wanfaDesp.indexOf("三人玩") > -1) || (gameData.wanfaDesp.indexOf("两人玩") > -1))) {
                sp.setVisible(false);
            }
            return sp;
        },
        showSelectQue: function (selectQueMap) {
            var that = this;
            for (var i in selectQueMap) {
                if (selectQueMap.hasOwnProperty(i)) {
                    if (i == 0) {
                        delete selectQueMap[i];
                    }
                }
            }
            for (var i = 0; i < 4; i++) {
                var sp = $("qn" + i + ".hsz");
                sp && sp.setVisible(false);
            }
            var isAllSelected = true;
            for (var uid in selectQueMap)
                if (selectQueMap.hasOwnProperty(uid) && uid && selectQueMap[uid] <= 0) {
                    isAllSelected = false;
                    break;
                }
            if (isAllSelected) {
                var s0 = $("qn0.dingquezhong");
                var s1 = $("qn1.dingquezhong");
                var s2 = $("qn2.dingquezhong");
                var s3 = $("qn3.dingquezhong");
                if (s0) s0.setVisible(false);
                if (s1) s1.setVisible(false);
                if (s2) s2.setVisible(false);
                if (s3) s3.setVisible(false);
                for (var uid in selectQueMap) {
                    (function (uid) {
                        var row = uid2position[uid];
                        var dingquezhongSp = $("qn" + row + ".que");
                        if (dingquezhongSp) {
                            dingquezhongSp.removeFromParent();
                            dingquezhongSp = null;
                        }
                        if (!dingquezhongSp) {
                            var t = {1: 1, 10: 2, 19: 3}[selectQueMap[uid]];
                            dingquezhongSp = new cc.Sprite("res/submodules/majiang/image/ma_sc/que" + t + ".png");
                            dingquezhongSp.setName("que");
                            $("qn" + row).addChild(dingquezhongSp);
                        }
                        if (dingquezhongSp) {

                            dingquezhongSp.setVisible(true);
                            dingquezhongSp.setScale(1);
                            var t = {1: 1, 10: 2, 19: 3}[selectQueMap[uid]];
                            dingquezhongSp.setTexture("res/submodules/majiang/image/ma_sc/que" + t + ".png");
                            var movePos = {0: [0, 100], 1: [100, 0], 2: [0, -50], 3: [-100, 0]};

                            $("info" + row + ".que").setVisible(false);
                            movePos[row][0] = $("info" + row + ".que").getPositionX() + $("info" + row).getPositionX() - $("info" + row).getContentSize().width / 2 - $("qn" + row).getPositionX();
                            movePos[row][1] = $("info" + row + ".que").getPositionY() + $("info" + row).getPositionY() - $("info" + row).getContentSize().height / 2 - $("qn" + row).getPositionY();

                            dingquezhongSp.runAction(cc.sequence(
                                cc.spawn(
                                    cc.moveTo(0.4, movePos[row][0], movePos[row][1]),
                                    cc.scaleTo(0.4, $("info" + row + ".que").getScale())
                                )
                                , cc.delayTime(0.1)
                                , cc.callFunc(function () {
                                    dingquezhongSp.setVisible(false);
                                    dingquezhongSp.setPosition(dingquezhongSp.getPositionX() - movePos[row][0], dingquezhongSp.getPositionY() - movePos[row][1]);

                                    $("info" + row + ".que").setVisible(true);

                                })
                            ));
                            var sp = that.setInfoQue(row, selectQueMap[uid]);
                            sp.setVisible(true);
                            sp.runAction(cc.sequence(
                                cc.delayTime(0.5),
                                cc.moveBy(0.05, 5, 0),
                                cc.moveBy(0.1, -10, 0),
                                cc.moveBy(0.1, 10, 0),
                                cc.moveBy(0.1, -10, 0),
                                cc.moveBy(0.1, 10, 0),
                                cc.moveBy(0.1, -10, 0),
                                cc.moveBy(0.1, 10, 0),
                                cc.moveBy(0.05, -5, 0)
                            ));
                        }
                        position2que[row] = t;
                        // position2que[row] = t == null ?0: t;
                        position2quelr[row] = getPaiLR(selectQueMap[uid]);
                    })(uid);
                }
                $("wtt").setVisible(false);
                this.setPaiArrOfRow(2, this.getPaiArr(), false, false);
                this.checkMyPaiColor4SC();
            }
            else {
                for (var i = 0; i < 4; i++) {
                    var sp = $("info" + i + ".que");
                    sp && sp.setVisible(false);
                }

                for (var uid in selectQueMap)
                    (function (uid) {
                        var row = uid2position[uid];
                        var que = selectQueMap[uid];
                        var queName = "";
                        if (que == -1) queName = "wan";
                        if (que == -2) queName = "tiao";
                        if (que == -3) queName = "tong";
                        if (row == 2) {
                            if (que < 0) {
                                if (!$("wtt.wan_bg")) {
                                    return;
                                }
                                $("wtt.wan_bg").stopAllActions();
                                $("wtt.tong_bg").stopAllActions();
                                $("wtt.tiao_bg").stopAllActions();
                                $("wtt.wan_bg").setVisible(false);
                                $("wtt.tong_bg").setVisible(false);
                                $("wtt.tiao_bg").setVisible(false);
                                $("wtt." + queName + "_bg").setVisible(true);
                                $("wtt." + queName + "_bg").runAction(new cc.RepeatForever(cc.sequence(cc.fadeTo(0.3, 15), cc.fadeTo(0.3, 255))));
                                $("wtt").setVisible(true);
                                var ta = cc.textureCache.addImage("res/submodules/majiang/image/ma_sc/que" + (-que) + "a.png");
                                var tb = cc.textureCache.addImage("res/submodules/majiang/image/ma_sc/que" + (-que) + "b.png");
                                //选缺提示
                                var selectQueConfirm = function (selectname, confirm) {
                                    var wannum = 0;
                                    var tongnum = 0;
                                    var tiaonum = 0;
                                    for (var j = 0; j < 14; j++) {
                                        var paiId = that.getPai(2, j).pai;
                                        if (paiId >= 1 && paiId <= 9) wannum = wannum + 1;
                                        if (paiId >= 10 && paiId <= 18) tiaonum = tiaonum + 1;
                                        if (paiId >= 19 && paiId <= 27) tongnum = tongnum + 1;
                                    }
                                    if (selectname == 1) {//万
                                        if (wannum >= tongnum && wannum >= tiaonum) {
                                            alert2("确认选择万作为缺吗", confirm, function () {
                                            }, false, true, true, true);
                                        } else {
                                            confirm();
                                        }
                                    }
                                    if (selectname == 3) {//筒
                                        if (tongnum >= wannum && tongnum >= tiaonum) {
                                            alert2("确认选择筒作为缺吗", confirm, function () {
                                            }, false, true, true, true);
                                        } else {
                                            confirm();
                                        }
                                    }
                                    if (selectname == 2) {//条
                                        if (tiaonum >= tongnum && tiaonum >= wannum) {
                                            alert2("确认选择条作为缺吗", confirm, function () {
                                            }, false, true, true, true);
                                        } else {
                                            confirm();
                                        }
                                    }
                                };
                                TouchUtils.setOnclickListener($("wtt.wan"), function () {
                                    selectQueConfirm(1, function () {
                                        network.send(4061, {room_id: gameData.roomId, que: 1});
                                    });
                                });
                                TouchUtils.setOnclickListener($("wtt.tong"), function () {
                                    selectQueConfirm(3, function () {
                                        network.send(4061, {room_id: gameData.roomId, que: 3});
                                    });
                                });
                                TouchUtils.setOnclickListener($("wtt.tiao"), function () {
                                    selectQueConfirm(2, function () {
                                        network.send(4061, {room_id: gameData.roomId, que: 2});
                                    });
                                });
                            }
                            else {
                                $("wtt").setVisible(false);
                                that.showQue(row, que);
                            }
                        }
                        else {
                            that.showQue(row, que);
                        }
                    })(uid);
            }
        },
        playChiPengGangHuAnim: function (row, op, isZimo, isAngang) {
            if (op == OP_GANG && isAngang) {
                var node = new cc.Sprite();
                $("info_n" + row).addChild(node);
                this.playEffect("vxiayu");
                playFrameAnim(res.xiayu_plist, "rain", 6, 0.1, false, node, function () {
                    node.removeFromParent(true);
                });
                return;
            }
            else if (op == OP_GANG) {
                var node = new cc.Sprite();
                $("info_n" + row).addChild(node);
                this.playEffect("vguafeng");
                playFrameAnim(res.guafeng_plist, "guafeng", 7, 0.1, false, node, function () {
                    node.removeFromParent(true);
                });
                return;
            }

            var textureName = isZimo ? "zimo2.png" : {
                1: "chi2.png"    // chi
                , 2: "peng2.png"
                , 3: "gang2.png"
                , 4: "hu2.png"
                , 7: "liang2.png"
                , 8: "fei2.png"
                , 9: "ti2.png"
            }[op];

            if (isZimo) {
                var infoNode = $("info_n" + row);
                if (infoNode.children.length != 0) {
                    infoNode.removeAllChildren();
                }
                var anim = playAnimScene(infoNode, res["zimo_json"], 0, 0, false, function () {
                    infoNode.removeAllChildren();
                    // var sprite = new cc.Sprite('res/submodules/majiang/image/ma_sc/zimo2.png');
                    // sprite.setName("cpghSprite");
                    // $('info_n' + row).addChild(sprite);
                });
            }
            else if (op == 4) {
                var infoNode = $("info_n" + row);
                if (infoNode.children.length != 0) {
                    infoNode.removeAllChildren();
                }
                var anim = playAnimScene(infoNode, res["hu_json"], 0, 0, false, function () {
                    infoNode.removeAllChildren();
                    // var sprite = new cc.Sprite('res/submodules/majiang/image/ma_sc/hu2.png');
                    // sprite.setName("cpghSprite");
                    // $('info_n' + row).addChild(sprite);
                });
            }

            else {
                if ($("info_n" + row).children.length != 0)
                    $("info_n" + row).removeAllChildren();
                var sprite = new cc.Sprite("res/submodules/majiang/image/ma_sc/" + textureName);
                sprite.setName("cpghSprite");
                $("info_n" + row).addChild(sprite);
                sprite.setScale(0, 0);
                var duraction = 1;
                sprite.runAction(cc.sequence(
                    cc.scaleTo(duraction, 1.5, 1.5).easing(cc.easeExponentialOut())
                    , cc.spawn(
                        cc.scaleTo(0.1, 0.80, 0.80)
                        , cc.fadeOut(0.1)
                    )
                ));
            }
        },
        setReplayProgress: function (cur, total) {
            var progress = cur / total * 100;
            this.showTip("回放进度: " + progress.toFixed(1) + "%", false);
        },
        setAllPai4Replay: function (data) {
            cc.log("123131231414++++");
            cc.log(data);
            for (var uid in data)
                if (data.hasOwnProperty(uid)) {
                    var row = uid2position[uid];
                    var paiArr = data[uid]["pai_arr"];

                    this.setPaiArrOfRow(row, paiArr, (row != 2), false);

                    var duiArr = data[uid]["dui_arr"];
                    //快进的时候处理下飞提的堆数据
                    for (var j = 0; j < duiArr.length; j++) {
                        var dui = duiArr[j];
                        if (dui.type == 1) this.setGChi(row, j, dui["pai_arr"]);
                        if (dui.type == 2) this.setGPeng(row, j, dui["pai_arr"][0]);
                        if (dui.type == 3) this.setGGang(row, j, dui["pai_arr"][0], dui["pai_arr"][0]);
                        if (dui.type == 4) this.setGGang(row, j, dui["pai_arr"][0], 0);
                        if (dui.type == 5) this.setGHide(row, j);
                        if (dui.type == 6) this.setGFei(row, j, dui["pai_arr"]);
                    }
                    for (; j < 4 && $('row' + row + '.g' + j); j++)
                        $("row" + row + ".g" + j).setVisible(false);

                    if ($("row" + row + ".g" + 0).isVisible() == 0) {
                        $("row" + row + ".a" + 0).setPosition(posConf.paiA0PosBak[row]);
                    }

                    var usedArr = data[uid]["used_arr"];
                    for (var j = 0; j < 24; j++) {
                        var pai = $("row" + row + ".c0.b" + j);
                        if (pai)
                            pai.setVisible(false);
                        else
                            break;
                    }
                    for (var j = 0; j < usedArr.length; j++) {
                        this.addUsedPai(row, usedArr[j]);
                    }

                    this.recalcPos(row);
                }
        },
        chiPengGangHu: function (op, row, paiId, fromRow, data) {
            if (isReplay) {
                var node = $("cpghRep" + row + ".sp_" + (op - 1));

                var touch_node = new cc.Node();
                $("cpghRep" + row).addChild(touch_node);
                touch_node.setPosition(node.getPositionX(), node.getPositionY() - 40);

                var touch_sp0 = new cc.Sprite("res/submodules/majiang/image/ma_sc/cpghRep/touch0.png");
                var touch_sp1 = new cc.Sprite("res/submodules/majiang/image/ma_sc/cpghRep/touch1.png");
                touch_node.addChild(touch_sp0);
                touch_node.addChild(touch_sp1);
                touch_sp1.setVisible(false);

                touch_node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    touch_sp0.setVisible(false);
                    touch_sp1.setVisible(true);
                }), cc.delayTime(0.818), cc.callFunc(function () {
                    touch_node.removeFromParent();
                    $("cpghRep" + row).setVisible(false);
                })));
            }

            var j;
            for (j = 0; j < 4; j++) {
                var g = $("row" + row + ".g" + j);
                if (!g || !$("row" + row + ".g" + j).isVisible())
                    break;
            }

            var paiArr = this.getPaiArr();

            if (op == OP_CHI) {
                var oriPaiId = data["ori_pai_id"];
                this.setGChi(row, j, paiId, oriPaiId);
                hasChupai = false;
                this.removeOneTopUsedPai(fromRow);
                this.playChiPengGangHuAnim(row, op);
                this.playEffect("vchi", position2sex[row]);
            } else if (op == OP_PENG || op == OP_GANG) {
                var duiArr = (data["dui_arr"] || []);
                var isJiagang = (data["is_jiagang"] || 0);

                if (op == OP_PENG) {
                    this.setGPeng(row, j, paiId);
                    _.remove(paiArr, function (n) {
                        return n == paiId;
                    });
                    hasChupai = false;
                    this.removeOneTopUsedPai(fromRow);
                    this.playChiPengGangHuAnim(row, op);
                    this.playEffect("vpeng", position2sex[row]);
                }
                else if (op == OP_PENG || op == OP_GANG) {
                    var isAngang = (row == fromRow && !isJiagang);
                    var upPaiId = paiId;
                    var downPaiId = (isAngang ? 0 : paiId);

                    if (duiArr)
                        this.setDuiArr(row, duiArr);
                    else {
                        if (isAngang || !isJiagang) {   // angang or minggang
                            this.setGGang(row, j, upPaiId, downPaiId);
                        }
                        else if (isJiagang) {
                            this.setGJiaGang(row, paiId);
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

                    this.playChiPengGangHuAnim(row, op, false, isAngang);
                    this.playEffect(isAngang ? "vangang" : "vgang", position2sex[row]);
                }

                this.hideChiPengGangHu();

                if (!isJiagang && !duiArr)
                    $("row" + row + ".g" + j).setVisible(true);
            }
            else if (op == OP_HU) {
                var isZimo = (data["is_zimo"] || 0);

                if (fromRow == 2)
                    this.hideChiPengGangHu();
                if (!isZimo) {
                    this.removeOneTopUsedPai(fromRow, paiId);
                }
                this.playChiPengGangHuAnim(row, op, isZimo);
                this.playEffect(isZimo ? "vzimo" : "vhu", position2sex[row]);

                if (mapId == MAP_ID.SICHUAN_XUELIU)
                    this.addHuPai4Xueliu(row, paiId);

            }
            else if (op == OP_TING) {
                $("info" + fromRow + ".liang").setVisible(true);
                this.playChiPengGangHuAnim(row, op, isZimo);
                this.hideChiPengGangHu();
                playEffect("vting", position2sex[row]);
            } else if (op == OP_FEI) {
                // this.setGPeng(row, j, paiId);
                var duiArr = (data["dui_arr"] || []);
                this.setDuiArr(row, duiArr);

                _.remove(paiArr, function (n) {
                    return n == duiArr[0];
                });
                _.remove(paiArr, function (n) {
                    return n == duiArr[1];
                });

                hasChupai = false;
                this.removeOneTopUsedPai(fromRow);
                this.hideChiPengGangHu();
                this.playChiPengGangHuAnim(row, op);
                playEffect("vfei", position2sex[row]);
            }
            else if (op == OP_TI) {
                // this.setGPeng(row, j, paiId);
                var duiArr = (data["dui_arr"] || []);
                this.setDuiArr(row, duiArr);
                hasChupai = false;
                this.hideChiPengGangHu();
                this.playChiPengGangHuAnim(row, op);
                playEffect("vti", position2sex[row]);
            }
            else {
                return;
            }

            this.playerOnloneStatusChange(row, false);

            var _paiArr = (data["pai_arr"] || []);
            var liangPaiArr = (data["liang_pai_arr"] || []);
            var paiCnt = (data["pai_cnt"] || 0);
            var n = paiCnt - _paiArr.length;
            if (mapId == MAP_ID.SICHUAN_YB && op == OP_HU && row != 2) {
                n = _paiArr.length;
                _paiArr = [];
            }
            for (var i = 0; i < n; i++)
                _paiArr.push(0);
            if (op == OP_HU && row != 2 && (mapId == MAP_ID.SICHUAN_YB
                || mapId == MAP_ID.SICHUAN_XUEZHAN
                || mapId == MAP_ID.SICHUAN_TRLF
                || mapId == MAP_ID.SICHUAN_SRSF
                || mapId == MAP_ID.SICHUAN_SRLF
                || mapId == MAP_ID.SICHUAN_DEYANG
                || mapId == MAP_ID.SICHUAN_ZJ
                || mapId == MAP_ID.SICHUAN_LJ
                || mapId == MAP_ID.SICHUAN_JY
                || mapId == MAP_ID.SICHUAN_GH
                || mapId == MAP_ID.SICHUAN_MZ
                || mapId == MAP_ID.SICHUAN_SF)) {
                _paiArr.splice(_paiArr.length - 1, 1);
                _paiArr.push(paiId);
                this.setPaiArrOfRow(row, _paiArr, (row != 2), (op != OP_HU), liangPaiArr);
            }
            else
                this.setPaiArrOfRow(row, _paiArr, (row != 2), (op != OP_HU), liangPaiArr);
            //胡牌亮胡牌

            // if (op == OP_HU && row == 2 && (mapId == MAP_ID.SICHUAN_XUEZHAN || mapId == MAP_ID.SICHUAN_DEYANG || mapId == MAP_ID.SICHUAN_GH || mapId == MAP_ID.SICHUAN_MZ || mapId == MAP_ID.SICHUAN_SF)) {
            // if (op == OP_HU && row == 2 ) {
            //     this.setPaiArrOfRow(row, _paiArr, (row != 2), (op != OP_HU), liangPaiArr, false, paiId);
            // }

            if (op == OP_HU && _.isObject(data["player"])) {
                var playerMap = data["player"];
                for (var uid in playerMap) {
                    var tRow = uid2position[uid];
                    var tPaiArr = playerMap[uid]["pai_arr"];
                    var tDuiArr = playerMap[uid]["dui_arr"];
                    if (tRow != 2) {
                        for (var i = 0; i < tPaiArr.length; i++)
                            tPaiArr[i] = 0;
                    }
                    this.setDuiArr(tRow, tDuiArr);
                    this.setPaiArrOfRow(tRow, tPaiArr, (tRow != 2), (tRow != 2));
                    this.recalcPos(tRow);
                }
            }

            //考虑ting时的判断
            if (op != OP_HU && op != OP_TING) {
                this.setPai(row, 13, 0);
                this.getPai(row, 13).runAction(cc.fadeOut(0));
            }
            this.recalcPos(row);

            if (mapId == MAP_ID.WUHAN_KAIKOU || mapId == MAP_ID.WUHAN_KOUKOU) {
                var multiple = data["multiple"];
                $("info" + row + ".lb_bs").setString("x" + multiple);
            }
            //胡牌提示
            if (op == OP_HU && (mapId == MAP_ID.SICHUAN_XUEZHAN
                || mapId == MAP_ID.SICHUAN_DEYANG
                || mapId == MAP_ID.SICHUAN_ZJ
                || mapId == MAP_ID.SICHUAN_LJ
                || mapId == MAP_ID.SICHUAN_JY
                || mapId == MAP_ID.SICHUAN_GH
                || mapId == MAP_ID.SICHUAN_XUELIU
                || mapId == MAP_ID.SICHUAN_SRLF
                || mapId == MAP_ID.SICHUAN_TRLF
                || mapId == MAP_ID.SICHUAN_SRSF
                || mapId == MAP_ID.SICHUAN_DDH
                || mapId == MAP_ID.SICHUAN_YB
                || mapId == MAP_ID.SICHUAN_MZ
                || mapId == MAP_ID.SICHUAN_SF)) {
                this.setHuIconVisible(row, true, data["is_zimo"]);
            }

            this.checkPaiAmount();
        },
        fapai: function (paiArr) {
            _.pull(paiArr, 0);

            paiArr.sort(compareTwoNumbers);
            this.sortFront(paiArr, laiziPaiId[0]);
            this.sortFront(paiArr, laiziPaiId[1]);

            forRows(function (i) {
                for (var j = 0; j < paiArr.length; j++)
                    this.setPai(i, j, (i == 2 ? paiArr[j] : 0), (i != 2), (i != 2));
                for (; j < 14; j++)
                    this.setPai(i, j, 0, (i != 2), (i != 2), false);
                if (i == 2) {
                    for (var j = 0; j < paiArr.length; j++)
                        this.filterMyPai(i, j, 1);
                }
            });
            this.setPai(2, 13, 0, false, false, this.isMyTurn());
            forRows(function (i) {
                for (var j = 0; j < 13; j++) {
                    this.getPai(i, j).setVisible(true);
                    this.getPai(i, j).runAction(
                        cc.sequence(cc.delayTime(j * FAPAI_ANIM_DELAY), cc.fadeIn(FAPAI_ANIM_DURATION))
                    );
                    var pai = this.getPai(i, j);
                    pai.isUp = false;
                    pai.isUpping = false;
                    pai.isDowning = false;
                }
                var pai = this.getPai(i, 13);
                pai.setVisible(false);
                pai.isUp = false;
                pai.isUp = false;
                pai.isUpping = false;
                pai.isDowning = false;
                this.recalcPos(i);
            });
            this.enableChuPai();

            for (var i = 0; i < 4; i++) {
                var sp;
                sp = $("info" + i + ".liang");
                sp && sp.setVisible(false);
                sp = $("info" + i + ".que");
                sp && sp.setVisible(false);
                this.setHuIconVisible(i, false);
            }

            hideGangStep = 0;
            liangStep = 0;
            afterLianging = false;
            isHuansanzhanging = false;
            position2que = {};
            position2quelr = {};
            forRows(function (row) {
                if (gameData.mapId == MAP_ID.SICHUAN_SRSF) {
                    position2que[row] = 0;
                } else {
                    position2que[row] = ((playerNum == 3 || playerNum == 2) ? 1 : 0);
                }
            });
            this.HuCardTip(null, 0, false);

        },
        jiesuan: function (data) {
            var that = this;

            this.scheduleOnce(function () {
                var myScore = 0;
                var players = data.players;
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var uid = player["uid"];

                    gameData.players[position2playerArrIdx[uid2position[uid]]].score = player["total_score"];
                    $("info" + uid2position[uid] + ".lb_score").setString(player["total_score"]);

                    if (uid == gameData.uid) {
                        myScore = player["score"];
                        continue;
                    }

                    var row = uid2position[uid];
                    var paiArr = player["pai_arr"];
                    that.setPaiArrOfRow(uid2position[uid], paiArr, (row != 2), false);
                    that.recalcPos(row);
                }

                setTimeout(function () {
                    if (mapId == MAP_ID.SICHUAN_XUELIU) {
                        var layer = (players.length == 3 ? new JiesuanSc3Layer(data) : new JiesuanScLayer(data));
                    }
                    //结算处理
                    else if (mapId == MAP_ID.SICHUAN_DEYANG || mapId == MAP_ID.SICHUAN_ZJ || mapId == MAP_ID.SICHUAN_LJ || mapId == MAP_ID.SICHUAN_JY || mapId == MAP_ID.SICHUAN_GH || mapId == MAP_ID.SICHUAN_XUEZHAN || mapId == MAP_ID.SICHUAN_SRLF || mapId == MAP_ID.SICHUAN_TRLF || mapId == MAP_ID.SICHUAN_SRSF || mapId == MAP_ID.SICHUAN_DDH || mapId == MAP_ID.SICHUAN_YB || mapId == MAP_ID.SICHUAN_MZ || mapId == MAP_ID.SICHUAN_SF) {
                        // if (data["new_panel"])
                        var layer = new JiesuanSc2Layer(data, laizipiPaiAId, mapId, laiziPaiId);
                        // else
                        //     var layer = (players.length == 3 ? new JiesuanSc3Layer(data) : new JiesuanScLayer(data));
                    }
                    that.addChild(layer);

                    playEffect(myScore >= 0 ? "vWin" : "vLose");
                }, 0);
            }, 0.2);

            $('hupai_tip').setVisible(false);
        },
        onJiesuanClose: function (isReady) {
            if (isReady || isReplay) {
                $("btn_zhunbei").setVisible(false);
            } else {
                $("btn_zhunbei").setVisible(true);
            }

            if (bShowVideo) {
                // AgoraUtil.showAllVideo();
            }
        },
        zongJiesuan: function (data) {
            var that = this;
            setTimeout(function () {
                that.addChild(new Ma_ZongJiesuanLayer(data));
            }, 2000);
            if (bShowVideo) {
                bShowVideo = false;
            }
        },
        showLocationPanel: function () {
            var that = this;
            var scene = ccs.load(res.LookLocation_json);
            that.addChild(scene.node);

            var arr = [0, 1, 3];
            var playerArr = [];
            for (var i = 0; i < arr.length; i++) {
                $("root.juli" + i, scene.node).setString("?");
                $("root.ditanceClose" + i, scene.node).setVisible(false);
                $("root.locationClose" + i, scene.node).setVisible(false);
                var playerInfo = gameData.players[position2playerArrIdx[arr[i]]];
                var head = $("root.head" + i, scene.node);
                if (playerInfo) {
                    loadCircleConorToSprite(playerInfo["headimgurl"], head, head.getContentSize().width / 2);
                    $("root.locationClose" + i, scene.node).setVisible(!playerInfo["loc"]);
                }

                var playerInfo2 = null;
                if (i == arr.length - 1) {
                    playerInfo2 = gameData.players[position2playerArrIdx[arr[0]]];
                } else {
                    playerInfo2 = gameData.players[position2playerArrIdx[arr[i + 1]]];
                }
                if (playerInfo2 && playerInfo && playerInfo2["loc"] && playerInfo["loc"]) {
                    var juli = $("root.juli" + i, scene.node);
                    var templocation1 = playerInfo["loc"].split(",");
                    var other1Location_1 = templocation1[1];
                    var other1Location_2 = templocation1[0];

                    var templocation2 = playerInfo2["loc"].split(",");
                    var other2Location_1 = templocation2[1];
                    var other2Location_2 = templocation2[0];
                    //其他三个人相互的距离
                    var distance = locationUtil.getFlatternDistance(other1Location_1, other1Location_2, other2Location_1, other2Location_2);
                    if (distance >= 1000) {
                        juli.setString((distance / 1000).toFixed(2) + "km");
                    }
                    else {
                        juli.setString(distance + "m");
                    }
                    juli.setVisible(true);
                    if (distance > 100) {
                        juli.setColor(cc.color(26, 26, 26));

                    } else {
                        juli.setColor(cc.color(255, 255, 255));
                        var playerName = {};
                        playerName.name1 = playerInfo.nickname;
                        playerName.name2 = playerInfo2.nickname;
                        playerArr.push(playerName);
                    }
                    $("root.juliBgWite" + i, scene.node).setVisible(distance > 100);
                    $("root.juliBgRed" + i, scene.node).setVisible(distance <= 100);
                }

                //其他三个人和我的距离

                if (!isNullString(locationUtil.address) && playerInfo && playerInfo["loc"]) {
                    var otherInfo = playerInfo["loc"].split(",");
                    var otherLocation1 = otherInfo[1];
                    var otherLocation2 = otherInfo[0];
                    var mylocationlat = locationUtil.latitude;
                    var mylocationlng = locationUtil.longitude;
                    var myAndOtherDis = locationUtil.getFlatternDistance(mylocationlat, mylocationlng, otherLocation1, otherLocation2);
                    if (myAndOtherDis) {
                        $("root.ditanceClose" + i, scene.node).setVisible(myAndOtherDis <= 100);
                    }
                }

            }
            for (var i = 0; i < 3; i++) {
                var player = playerArr[i];
                var arr = [];
                if (player) {
                    var text = new ccui.Text();
                    text.setFontSize(20);
                    text.setTextColor(cc.color(255, 0, 0));
                    text.setPosition($("root.diban_8", scene.node).getPositionX(), $("root.diban_8", scene.node).getPositionY() - $("root.diban_8", scene.node).getContentSize().height / 2 - i * 30);
                    text.setString(ellipsisStr(player.name1, 5) + "," + ellipsisStr(player.name2, 5));
                    $("root", scene.node).addChild(text);
                    var text1 = new ccui.Text();
                    text1.setFontSize(20);
                    text1.setTextColor(cc.color(0, 0, 0));
                    text1.setAnchorPoint(1, 0.5);
                    text1.setString("玩家");
                    $("root", scene.node).addChild(text1);
                    text1.setPosition(text.getPositionX() - text.getContentSize().width / 2, text.getPositionY());
                    var text2 = new ccui.Text();
                    text2.setFontSize(20);
                    text2.setTextColor(cc.color(0, 0, 0));
                    text2.setAnchorPoint(0, 0.5);
                    text2.setString("距离过近");
                    $("root", scene.node).addChild(text2);
                    text2.setPosition(text.getPositionX() + text.getContentSize().width / 2, text.getPositionY());
                }
            }
            TouchUtils.setOnclickListener($("root.fake_root", scene.node), function () {
                scene.node.removeFromParent(true);
            });
            TouchUtils.setOnclickListener($("btn_close"), function () {
                that.removeFromParent(false);
            });

        },
        showPlayerInfoPanel: function (idx) {
            if (window.inReview)
                return;

            if (position2playerArrIdx[idx] >= gameData.players.length)
                return;

            var that = this;

            var playerInfo = gameData.players[position2playerArrIdx[idx]];

            if (playerInfo == null || playerInfo == undefined) {
                if (idx == 1) {
                    playerInfo = {};
                    playerInfo.uid = gameData.uid;
                    playerInfo.nickname = gameData.nickname;
                    playerInfo.ip = gameData.ip;
                    playerInfo.headimgurl = gameData.headimgurl;
                    playerInfo.sex = gameData.sex;
                } else {
                    playerInfo = this.getWatchUserInfoByUid(uid);
                    playerInfo.uid = playerInfo.User.ID;
                    playerInfo.nickname = playerInfo.User.NickName;
                    playerInfo.ip = playerInfo.User.IP;
                    playerInfo.headimgurl = playerInfo.User.HeadIMGURL;
                    playerInfo.sex = playerInfo.User.Sex;
                }
            }
            //合并成为一个功能块
            // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, "poker", !(this.getRoomState() == ROOM_STATE_ONGOING));
            // this.addChild(this.playerInfoLayer);
            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1){
                this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false);
                this.addChild(this.playerInfoLayer);
            }else{
                this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', !(this.getRoomState() == ROOM_STATE_ONGOING));
                this.addChild(this.playerInfoLayer);
            }

        },
        hideSelectedPiao: function () {
            $("piao").setVisible(false);
        },

        playerOnloneStatusChange: function (row, isOffline) {
            if ($("info" + row + ".offline"))
                $("info" + row + ".offline").setVisible(!!isOffline);
        },
        playUrlVoice: function (row, type, content, voice) {
            var url = decodeURIComponent(content);
            var arr = null;
            if (url.indexOf(".aac") >= 0) {
                arr = url.split(/\.aac/)[0].split(/-/);
            } else if (url.indexOf(".spx") >= 0) {
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
            if (queue && queue.url && queue.duration && _.isNumber(queue.row)) {
                if (queue.url.indexOf(".aac") >= 0) {

                    VoiceUtils.play(queue.url);
                } else if (queue.url.indexOf(".spx") >= 0) {

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
            var scale9sprite = $("info" + row + ".qp9");
            if (!scale9sprite) {
                var picIdx = row;
                var capInsets = posConf.ltqpCapInsets[row];
                if (row == 0) {
                    picIdx = 1;
                    capInsets = cc.rect(26, 31, 1, 1);
                }
                scale9sprite = new cc.Scale9Sprite("res/submodules/majiang/image/MaScene/ltqp" + picIdx + ".png", posConf.ltqpRect[row], capInsets);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : cc.p(0, 0));
                if (row == 0) {
                    scale9sprite.setAnchorPoint(cc.p(1, 1));
                }
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("info" + row).addChild(scale9sprite);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);
            return scale9sprite;
        },
        initSpeaker: function (row, scale9sprite) {
            var map = {};
            var innerNodes = [];
            for (var i = 1; i <= 3; i++) {
                var sp = $("speaker" + i, scale9sprite);
                if (!sp) {
                    sp = new cc.Sprite("res/image/ui/majiang/maScene/speaker" + i + ".png");
                    sp.setName("speaker" + i);
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

            if (type == "voice") {
                var url = decodeURIComponent(content);
                if (url && url.split(/\.spx/).length > 2)
                    return;
            }

            if (type == "voice") {
                this.playUrlVoice(row, type, content, voice);
                return;
            }
            var scale9sprite = this.initQP(row);

            // var scale9sprite = $("playerLayer.node.info" + row + ".qp9");
            // if (!scale9sprite) {
            //     scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
            //     scale9sprite.setName("qp9");
            //     scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
            //     scale9sprite.setPosition(posConf.ltqpPos[row]);
            //     $("playerLayer.node.info" + row).addChild(scale9sprite, 2);
            // }

            var duration = 4;
            var innerNodes = [];
            scale9sprite.setCascadeOpacityEnabled(false);
            scale9sprite.setScale(1);
            if (type == "emoji") {
                scale9sprite.setOpacity(0);

                //表情动画
                if (content.indexOf("sp_") == 0) {
                    var sprite = $("emoji", scale9sprite);
                    if(sprite){
                        sprite.removeFromParent();
                        sprite=null;
                    }
                    if (!sprite) {
                        sprite = new cc.Sprite();
                        sprite.setName("emoji");
                        sprite.setScale(1.2);
                        sprite.setPosition(cc.p(scale9sprite.getContentSize().width / 2, scale9sprite.getContentSize().height / 2));
                        scale9sprite.addChild(sprite);
                    }
                    duration = 5;
                    var name = content.split("_")[1];
                    if (name == "laotou" || name == "tuxue") {
                        var psX = sprite.convertToWorldSpace(sprite.getPosition()); // cc.log("psXpsXpsX===="+psX.x) if(psX.x>cc.winSize.width/2){
                        sprite.setScaleX(-1);
                    }

                    if (name == "tuxue" || name == "chuizhuozi") {
                        var time = 0;
                        if (name == "chuizhuozi") {
                            time = 2000;
                        }
                        setTimeout(function () {
                            playEffect('vEffect_emoji_' + name);
                        }, time)
                        var emoji = playSpAnimation(name, name + 1, false, null, function () {
                            setTimeout(function () {
                                emoji.removeFromParent(true);
                            }, 10)
                        });
                    } else {
                        var emoji = playSpAnimation(name, name + 1, false, null, function () {
                            setTimeout(function () {
                                emoji.removeFromParent(true);
                            }, 10)
                            playEffect('vEffect_emoji_' + name);
                            var emoji2 = playSpAnimation(name, name + 2, false, null, function () {
                                setTimeout(function () {
                                    emoji2.removeFromParent(true);
                                }, 10)
                            });
                            sprite.addChild(emoji2);
                        });
                    }
                    sprite.addChild(emoji);
                }else {
                    var index = content.substring(10, 11);
                    if(content.indexOf("png") < 0){
                        index = content.substring(10, content.length);
                    }
                    var ccsScene = ccs.load(res['expression' + index], "res/");
                    var express = ccsScene.node;
                    express.setName("express");
                    express.setPosition(cc.p(scale9sprite.getContentSize().width / 2, scale9sprite.getContentSize().height / 2));
                    scale9sprite.addChild(express);
                    express.runAction(ccsScene.action);
                    ccsScene.action.play('action', true);
                    this.scheduleOnce(function () {
                        express.removeFromParent();
                    }, 2);
                }
            }
            else if (type == "text") {
                scale9sprite.setOpacity(255);
                var text = $("text", scale9sprite);
                if (!text) {
                    text = new ccui.Text();
                    text.setName("text");
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
                    textDeltaPosX = -8;
                    textDeltaPosY = -3;
                }
                text.setPosition(
                    (size.width - text.getVirtualRendererSize().width) / 2 + textDeltaPosX,
                    (size.height - text.getVirtualRendererSize().height) / 2 + textDeltaPosY
                );
                scale9sprite.setContentSize(size);
                text.setVisible(true);
                innerNodes.push(text);
            }
            else if (type == "voice") {
                scale9sprite.setOpacity(255);
                var url = decodeURIComponent(content);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
                var arr = null;
                if (url.indexOf(".aac") >= 0) {
                    arr = url.split(/\.aac/)[0].split(/-/);
                    VoiceUtils.play(url);
                } else if (url.indexOf(".spx") >= 0) {
                    arr = url.split(/\.spx/)[0].split(/-/);
                    // playVoiceByUrl(url);
                    OldVoiceUtils.playVoiceByUrl(url);
                } else {
                    arr = ["1000", 5000];
                }
                duration = arr[arr.length - 1] / 1000;
                innerNodes = this.initSpeaker(row, scale9sprite);
            }
            scale9sprite.stopAllActions();
            scale9sprite.setVisible(true);
            scale9sprite.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));
            if (type != "voice") {
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
            if (row >= 0 && row <= 3) {
                $("info0.zhuang").setVisible(false);
                $("info1.zhuang").setVisible(false);
                $("info2.zhuang").setVisible(false);
                $("info3.zhuang").setVisible(false);
                $("info" + row + ".zhuang").setVisible(true);
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

        setBeforeOnCCSLoadFinish: function (cb) {
            this.beforeOnCCSLoadFinish = cb;
        },
        getBeforeOnCCSLoadFinish: function (cb) {
            return this.beforeOnCCSLoadFinish;
        },
        setAfterGameStart: function (cb) {
            this.afterGameStart = cb;
        },
        setReady: function (uid) {
            // var ok = $('row' + uid2position[uid] + '.mid.ok');
            // if (!ok) {
            //     ok = duplicateSprite($('info0.ok'));
            //     ok.setVisible(true);
            //     ok.setPosition(cc.p(0, 0));
            //     $('row' + uid2position[uid] + '.mid').addChild(ok);
            // }
            $("info" + uid2position[uid] + ".ok").setVisible(true);
            if (uid == gameData.uid)
                $("btn_zhunbei").setVisible(false);
        },
        showToast: function (msg) {
            var toast = $("toast");
            if (!toast) {
                toast = new cc.Sprite(res.toast_bg_png);
                toast.setName("toast");
                this.addChild(toast);

                var text = new ccui.Text();
                text.setName("text");
                text.setFontSize(30);
                text.setTextColor(cc.color(255, 255, 255));
                text.setPosition(toast.getBoundingBox().width / 2, toast.getBoundingBox().height / 2);
                text.setString(msg);
                toast.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 * 4 / 5);
                toast.addChild(text);
            }
            toast.stopAllActions();
            toast.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
            text = toast.getChildByName("text");
            text.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
        },
        initMic: function () {
            var that = this;
            var cancelOrSend = false;
            var chatTime = 0;
            var animNode = null;
            var voiceFilename = null;
            var uploadFilename = null;
            TouchUtils.setListeners($("btn_mic"), {
                onTouchBegan: function (node, touch, event) {
                    if (animNode && animNode.getParent()) {
                        animNode.removeFromParent();
                    }

                    cancelOrSend = true;
                    animNode = playAnimScene(that, res.AnimMic_json, 0, 0, true);
                    chatTime = getCurrentTimeMills();
                    voiceFilename = getCurTimestamp() + "-" + gameData.uid + "-";
                    uploadFilename = voiceFilename;
                    voiceFilename += Math.floor(Math.random() * 100) + ".spx";
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
                                    uploadFilename = uploadFilename + "" + (Math.floor(chatTime) + 500) + ".spx";
                                    uploadFileToOSS(voiceFilename, uploadFilename, function (url) {
                                        network.send(3008, {room_id: gameData.roomId, type: "voice", content: url});
                                    }, function () {
                                        console.log("upload fail");
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
            var arr = decodeURIComponent(gameData.wanfaDesp).split(",");
            var topPosY = cc.winSize.height / 2 + 116;

            var sp_wanfa_Pos = cc.p(0, topPosY);
            var sp_wanfa = new cc.Sprite("res/submodules/majiang/image/ma_sc/sp_wanfa.png");
            var sp_wanfa_size = cc.size(47, 85);
            sp_wanfa.setPosition(sp_wanfa_Pos);
            sp_wanfa.setAnchorPoint(0, 0);
            this.addChild(sp_wanfa);

            var scale9sprite = new cc.Scale9Sprite("res/submodules/majiang/image/ma_sc/sp_picback.png", cc.rect(0, 0, 1, 1), cc.rect(0.25, 0.25, 0.5, 0.5));
            scale9sprite.setName("s9p");
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
                console.log(sp_wanfa.getChildrenCount());
                sp_wanfa.stopAllActions();
                if (pullOrPush)
                    sp_wanfa.runAction(cc.moveTo(0.25, sp_wanfa_Pos.x + scale9Width, sp_wanfa_Pos.y));
                else
                    sp_wanfa.runAction(cc.moveTo(0.25, sp_wanfa_Pos));
                pullOrPush = !pullOrPush;
            });
        },
        showArrow: function (pai, row) {
            this.hideArrow();
            var arrow = pai.getParent().getChildByName("arrow");
            if (!arrow) {
                arrow = new cc.Sprite("res/submodules/majiang/image/ma_sc/arrow.png");
                arrow.setAnchorPoint(0.5, 0);
                arrow.setName("arrow");
                arrow.setLocalZOrder(100);
                pai.getParent().addChild(arrow);
                var duration = 0.8;
                arrow.setOpacity(168);
            }
            arrow.setVisible(true);
            var arrowrot = [180, 270, 0, 90];
            if (row == 0) {
                arrow.setPosition(pai.getPosition().x, pai.getPosition().y - 35);
            }
            else if (row == 1) {
                arrow.setPosition(pai.getPosition().x - 40, pai.getPosition().y + 10);
            }
            else if (row == 2) {
                arrow.setPosition(pai.getPosition().x, pai.getPosition().y + 30);
            }
            else if (row == 3) {
                arrow.setPosition(pai.getPosition().x + 25, pai.getPosition().y + 5);
            }

            arrow.setRotation(arrowrot[row]);
            if (row == 0 || row == 2) {
                arrow.runAction(cc.sequence(cc.spawn(cc.moveBy(duration, 0, +16), cc.fadeTo(duration, 255))
                    , cc.spawn(cc.moveBy(duration, 0, -16), cc.fadeTo(duration, 168))).repeatForever());
            }
            else if (row == 1 || row == 3) {
                arrow.runAction(cc.sequence(cc.spawn(cc.moveBy(duration, +16, 0), cc.fadeTo(duration, 255))
                    , cc.spawn(cc.moveBy(duration, -16, 0), cc.fadeTo(duration, 168))).repeatForever());
            }
        },
        setLiang: function (liang) {
            lianging = liang;
            return;
            var that = this;
            if (liang) {
                lianging = true;
                for (var i = 0; i < 14; i++) {
                    var pai = that.getPai(2, i);
                    if (pai.pai) {
                        pai.isLiang = false;
                        Filter.grayMask(pai);
                    }
                }
                $("btn_queding").setVisible(true);
                $("btn_quxiao").setVisible(true);
            }
            else {
                $("btn_queding").setVisible(false);
                $("btn_quxiao").setVisible(false);
                that.hideTip();
                lianging = false;
            }
        },
        showTip: function (content, isShake, mills) {
            var that = this;
            isShake = _.isUndefined(isShake) ? true : isShake;
            var scale9sprite = $("top_tip");
            if (!(scale9sprite instanceof cc.Scale9Sprite)) {
                var newScale9sprite = new cc.Scale9Sprite("res/submodules/majiang/image/ma_sc/round_rect_91.png", cc.rect(0, 0, 91, 32), cc.rect(46, 16, 1, 1));
                newScale9sprite.setName("top_tip");
                scale9sprite.setAnchorPoint(0.5, 0.5);
                newScale9sprite.setPosition(scale9sprite.getPosition());
                scale9sprite.getParent().addChild(newScale9sprite);
                var lb = $("top_tip.lb_tip");

                text = new ccui.Text();
                text.setName("lb_tip");
                text.setFontSize(lb.getFontSize());
                text.setTextColor(lb.getTextColor());
                text.enableOutline(cc.color(38, 38, 38), 1);
                newScale9sprite.addChild(text);

                lb.removeFromParent(true);
                scale9sprite.removeFromParent(true);
                scale9sprite = newScale9sprite;
            }
            var text = $("top_tip.lb_tip");
            text.setString(content);
            var size = cc.size(text.getVirtualRendererSize().width + 35, scale9sprite.getContentSize().height);
            text.setPosition((text.getVirtualRendererSize().width + 35) / 2, scale9sprite.getContentSize().height / 2);
            scale9sprite.setContentSize(size);
            scale9sprite.setScale(1.2);
            scale9sprite.setVisible(true);
            if (isShake)
                scale9sprite.runAction(cc.sequence(cc.scaleTo(0.2, 1.4), cc.scaleTo(0.2, 1.2)));
            if (mills) {
                this.scheduleOnce(function () {
                    that.hideTip();
                }, mills / 1000);
            }
        },
        hideTip: function () {
            if (!isReplay)
                $("top_tip").setVisible(false);
        },
        hideArrow: function () {
            for (var i = 0; i < 4; i++) {
                var arrow = $("row" + i + ".c0.arrow");
                if (arrow)
                    arrow.removeFromParent(true);
            }
        },
        liangAllPai: function () {
            for (var i = 0; i < 14; i++) {
                var pai = this.getPai(2, i);
                if (pai.pai) {
                    pai.isLiang = true;
                    Filter.remove(pai);
                }
            }
        },
        selectHideGangCb: function () {
            network.send(4015, {room_id: gameData.roomId, hided_gang_arr: hidedGangArr});
        },
        throwDice: function (title, dice, paiIdA, paiIdB, cb) {
            var that = this;
            title = title || "";
            if (dice < 1 || dice > 6)
                return;
            var layer = that.throwDiceLayer;
            if (!layer) {
                var scene = ccs.load(res.ThrowDice_json);
                layer = scene.node;
                layer.setName("throwDice");
                layer.retain();
                that.throwDiceLayer = layer;
            }
            var paiA = $("root.a0", layer);
            var paiB = $("root.a1", layer);
            paiA.setVisible(false);
            paiB.setVisible(false);
            that.addChild(layer);
            $("root.lb_title", layer).setString(title);
            playThrowDice($("root.dice1", layer), Math.floor(Math.random() * 6) + 1);
            playThrowDice($("root.dice", layer), dice, function () {
                var paiAName = getPaiNameByRowAndId(2, paiIdA, true, false);
                var paiBName = getPaiNameByRowAndId(2, paiIdB, true, false);
                setSpriteFrameByName(paiA, paiAName, "pai");
                setSpriteFrameByName(paiB, paiBName, "pai");
                paiA.setVisible(true);
                paiB.setVisible(true);
                setTimeout(function () {
                    layer.removeFromParent(false);
                    if (cb)
                        cb();
                }, 2600);
            });
        },
        showChiLayer: function (paiId, cb) {
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
                if (isSameColor(a, b) && isSameColor(a, c) &&
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
                    layer.setName("chiLayer");
                    layer.retain();
                    that.chiLayer = layer;
                }
                that.addChild(layer);

                $("root.g0", layer).setVisible(posibleIdxArr.length >= 1);
                $("root.g1", layer).setVisible(posibleIdxArr.length >= 2);
                $("root.g2", layer).setVisible(posibleIdxArr.length >= 3);

                var fun = function (node) {
                    var parentName = node.getParent().getName();
                    var pai = $("root." + parentName + "." + 1, layer);
                    var _paiId = pai.pai;
                    var paiId = pai.ori_pai_id;
                    cb(_paiId, paiId);
                    // that.sendChiPengGang(OP_CHI, 2, _paiId, paiId);
                    that.hideChiPengGangHu();
                    layer.removeFromParent(false);
                };

                for (var i = 0; i < posibleIdxArr.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        var pai = $("root.g" + i + "." + j, layer);
                        var _paiId = arr[posibleIdxArr[i]][j];
                        var paiName = getPaiNameByRowAndId(2, _paiId, true, false);
                        pai.pai = _paiId;
                        pai.ori_pai_id = paiId;
                        setSpriteFrameByName(pai, paiName, "pai");

                        TouchUtils.setOnclickListener(pai, fun);
                    }
                }

                TouchUtils.setOnclickListener($("root.btn_close", layer), function () {
                    layer.removeFromParent();
                });
                TouchUtils.setOnclickListener($("root", layer), function () {
                    // layer.removeFromParent();
                });
            }
        },

        //王常春 胡牌提示 2016-6-15 add
        HuCardTip: function (showdata, posx, isVisible) {
            var hupaitip = this.getChildByName("hupaitip");
            if (!isVisible && hupaitip) {
                hupaitip.setVisible(isVisible);
                return;
            }
            if (showdata == null) {
                for (var i = 0; i < 14; i++) {
                    var pai = this.getPai(2, i);
                    pai.hucards = null;
                }
                return;
            }
            var tiplength = showdata.length;
            var hupaitipW = 150;//大的背景
            var hupaitipH = 160;//大的背景
            var hupaitip2W = 140;//小的背景宽
            var hupaitip2H = 100;//小的背景高

            if (hupaitip) {
                hupaitip.setVisible(true);
                hupaitip.setContentSize(cc.size(hupaitipW + (hupaitip2W+10) * tiplength, hupaitipH));
                //设置位置
                posx = posx + 40;
                if (posx + hupaitip.getContentSize().width / 2 > this.getContentSize().width) {
                    posx = this.getContentSize().width - hupaitip.getContentSize().width / 2 - 20;
                } else if (posx - hupaitip.getContentSize().width / 2 < 0) {
                    posx = hupaitip.getContentSize().width / 2 + 20;
                }
                hupaitip.setPositionX(posx);
                for (var i = 0; i < 9; i++) {
                    var card = hupaitip.getChildByName("card" + (i + 1));
                    var fantext = hupaitip.getChildByName("fantext" + (i + 1));
                    var fannum = hupaitip.getChildByName("fannum" + (i + 1));
                    var zhangtext = hupaitip.getChildByName("zhangtext" + (i + 1));
                    var zhangnum = hupaitip.getChildByName("zhangnum" + (i + 1));
                    var hupaitipbg = hupaitip.getChildByName("hupaitipbg" + (i + 1));
                    if (tiplength > i) {
                        //card
                        card.setVisible(true);
                        var paiName = getPaiNameByRowAndId(2, showdata[i][0], true, true);
                        setSpriteFrameByName(card, paiName, "pai");
                        card.setPosition(cc.p(10 + (hupaitip2W+10) * (i + 1), hupaitip.getContentSize().height / 2));
                        fantext.setVisible(true);
                        fantext.setPosition(cc.p(80 + (hupaitip2W+10) * (i + 1), hupaitipH*0.6));
                        fannum.setVisible(true);
                        fannum.setPosition(cc.p(60 + (hupaitip2W+10) * (i + 1), hupaitipH*0.6));
                        fannum.setString(showdata[i][1]);
                        zhangtext.setVisible(true);
                        zhangtext.setPosition(cc.p(80 + (hupaitip2W+10) * (i + 1), hupaitipH*0.4));
                        zhangnum.setVisible(true);
                        zhangnum.setString(showdata[i][2]);
                        zhangnum.setPosition(cc.p(60 + (hupaitip2W+10) * (i + 1), hupaitipH*0.4));
                    } else {
                        card.setVisible(false);
                        fantext.setVisible(false);
                        fannum.setVisible(false);
                        zhangtext.setVisible(false);
                        zhangnum.setVisible(false);
                        hupaitipbg.setVisible(false);
                    }
                }
            } else {
                hupaitip = new cc.Scale9Sprite("res/submodules/majiang/image/ma_sc/hupai_bg2.png", null, cc.rect(50, 50, 50, 50));
                hupaitip.setName("hupaitip");
                hupaitip.setAnchorPoint(cc.p(0.5, 0));
                hupaitip.setContentSize(cc.size(hupaitipW + (hupaitip2W+10) * tiplength, hupaitipH));
                hupaitip.setPosition(cc.p(this.getContentSize().width - 20, 172));
                this.addChild(hupaitip);
                //设置位置
                posx = posx + 40;
                if (posx + hupaitip.getContentSize().width / 2 > this.getContentSize().width) {
                    posx = this.getContentSize().width - hupaitip.getContentSize().width / 2 - 20;
                } else if (posx - hupaitip.getContentSize().width / 2 < 0) {
                    posx = hupaitip.getContentSize().width / 2 + 20;
                }
                hupaitip.setPositionX(posx);

                var huSprite = new cc.Sprite("res/submodules/majiang/image/ma_sc/hupaitip_hu.png");
                huSprite.setPosition(cc.p(70, hupaitip.getContentSize().height / 2));
                hupaitip.addChild(huSprite);
                for (var i = 0; i < 9; i++) {
                    var hupaitipbg = new cc.Scale9Sprite("res/submodules/majiang/image/ma_sc/hupai_bg.png", null, cc.rect(30, 30, 30, 30));
                    hupaitipbg.setName("hupaitipbg" + (i + 1));
                    hupaitipbg.setAnchorPoint(cc.p(0, 0.5));
                    hupaitipbg.setContentSize(cc.size(hupaitip2W, hupaitip2H));
                    hupaitipbg.setPosition(cc.p(i*(hupaitip2W+10) + 120, hupaitipH/2));
                    hupaitip.addChild(hupaitipbg);
                    //card
                    var card = new cc.Sprite();
                    card.setScale(0.88);
                    card.setName("card" + (i + 1));
                    card.setPosition(cc.p(10 + (hupaitip2W+10) * (i + 1), hupaitip.getContentSize().height / 2));
                    hupaitip.addChild(card);

                    var fantext = new ccui.Text();
                    fantext.setString("番");
                    fantext.setName("fantext" + (i + 1));
                    fantext.setFontSize(20);
                    fantext.setTextColor(cc.color(0, 255, 0));
                    fantext.enableOutline(cc.color(38, 38, 38), 1);
                    fantext.setPosition(cc.p(80 + (hupaitip2W+10) * (i + 1), hupaitipH*0.6));
                    hupaitip.addChild(fantext);
                    var fannum = new ccui.Text();
                    fannum.setName("fannum" + (i + 1));
                    fannum.setFontSize(20);
                    fannum.setTextColor(cc.color(255, 255, 0));
                    fannum.enableOutline(cc.color(38, 38, 38), 1);
                    fannum.setPosition(cc.p(60 + (hupaitip2W+10) * (i + 1), hupaitipH*0.6));
                    hupaitip.addChild(fannum);
                    var zhangtext = new ccui.Text();
                    zhangtext.setString("张");
                    zhangtext.setName("zhangtext" + (i + 1));
                    zhangtext.setFontSize(20);
                    zhangtext.setTextColor(cc.color(0, 255, 0));
                    zhangtext.enableOutline(cc.color(38, 38, 38), 1);
                    zhangtext.setPosition(cc.p(80 + (hupaitip2W+10) * (i + 1), hupaitipH*0.4));
                    hupaitip.addChild(zhangtext);
                    var zhangnum = new ccui.Text();
                    zhangnum.setName("zhangnum" + (i + 1));
                    zhangnum.setFontSize(20);
                    zhangnum.setTextColor(cc.color(255, 255, 0));
                    zhangnum.enableOutline(cc.color(38, 38, 38), 1);
                    zhangnum.setPosition(cc.p(60 + (hupaitip2W+10) * (i + 1), hupaitipH*0.4));
                    hupaitip.addChild(zhangnum);
                    if (tiplength > i) {
                        card.setVisible(true);
                        var paiName = getPaiNameByRowAndId(2, showdata[i][0], true, true);
                        setSpriteFrameByName(card, paiName, "pai");
                        fantext.setVisible(true);
                        fannum.setVisible(true);
                        fannum.setString(showdata[i][1]);
                        zhangtext.setVisible(true);
                        zhangnum.setVisible(true);
                        zhangnum.setString(showdata[i][2]);
                    } else {
                        hupaitipbg.setVisible(false);
                        card.setVisible(false);
                        fantext.setVisible(false);
                        fannum.setVisible(false);
                        zhangtext.setVisible(false);
                        zhangnum.setVisible(false);
                    }
                }
            }
        },
        hasHu: function (row) {
            if (row == 2) {
                var sp = $("qn" + row + ".hu");
                if (!sp)
                    return false;
                return sp.isVisible();
            }
        },
        setHuIconVisible: function (row, visible, iszimo) {
            var huSp = $("row" + row + ".mid.hu");
            huSp && huSp.removeFromParent(true);
            huSp = new cc.Sprite(iszimo ? "res/submodules/majiang/image/ma_sc/hu5.png" : "res/submodules/majiang/image/ma_sc/hu4.png");

            huSp.setName("hu");
            $("row" + row + ".mid").addChild(huSp);
            var hupos = [cc.p(0, -30), cc.p(-74, 0), cc.p(0, 50), cc.p(80, 0)];
            //var huposr = [0,270,0,90];
            if (mapId == MAP_ID.SICHUAN_XUELIU)
                hupos = [cc.p(0, 30), cc.p(-74, 0), cc.p(0, -26), cc.p(80, 0)];
            huSp.setPosition(hupos[row]);
            // if(iszimo) {
            //     huSp.setRotation(huposr[row]);
            // }
            huSp.setVisible(visible);
        },
        setHuTipVisible: function (visible) {
            for (var i = 0; i < 14; i++) {
                var cardSprite = this.getPai(2, i);
                if (cardSprite.getChildByName("hucardSprite")) {
                    cardSprite.getChildByName("hucardSprite").stopAllActions();
                    cardSprite.getChildByName("hucardSprite").setVisible(visible);
                }
            }
        },
        playEffect: function (filename, sex) {
            //四川音效
            if (mapId == MAP_ID.SICHUAN_XUEZHAN
                || mapId == MAP_ID.SICHUAN_DEYANG
                || mapId == MAP_ID.SICHUAN_ZJ
                || mapId == MAP_ID.SICHUAN_LJ
                || mapId == MAP_ID.SICHUAN_JY
                || mapId == MAP_ID.SICHUAN_GH
                || mapId == MAP_ID.SICHUAN_XUELIU
                || mapId == MAP_ID.SICHUAN_SRLF
                || mapId == MAP_ID.SICHUAN_TRLF
                || mapId == MAP_ID.SICHUAN_SRSF
                || mapId == MAP_ID.SICHUAN_DDH
                || mapId == MAP_ID.SICHUAN_YB
                || mapId == MAP_ID.SICHUAN_MZ
                || mapId == MAP_ID.SICHUAN_SF) {
                var prefix = "sc_";
                if(gameData.speakSiChuanH){
                    if (/^vp\d+/.test(filename)) {
                        var paiId = filename.substr(2);
                        if (paiId >= 1 && paiId <= 9)
                            return playEffect(prefix + "1" + paiId, sex);
                        if (paiId >= 10 && paiId <= 18)
                            return playEffect(prefix + "3" + (paiId - 9), sex);
                        if (paiId >= 19 && paiId <= 27)
                            return playEffect(prefix + "2" + (paiId - 18), sex);
                    }
                }else{
                    if (/^vp\d+/.test(filename)) {
                        var paiId = filename.substr(2);
                        return playEffect('vp' + paiId, sex);
                    }
                }
                if (["vpeng", "vgang", "vangang", "vhu", "vzimo"].indexOf(filename) >= 0) {
                    if(gameData.speakSiChuanH) {
                        return playEffect(prefix + filename.substr(1), sex);
                    }else{
                        return playEffect(filename, sex);
                    }
                }
            }
            playEffect(filename, sex);
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
                    cc.moveBy(1.5, cc.p(0, 30)),
                    cc.callFunc(function () {
                        txt.removeFromParent(true);
                    })
                )
            );
        },
        getRowByUid: function (uid) {
            return uid2position[uid];
        },
        changeBtnStatus: function () {
            $("btn_bg").setVisible(!$("btn_bg").isVisible());
            $("setting").setVisible(!$("setting").isVisible());
            $("chat").setVisible(!$("chat").isVisible());
            $("jiesan").setVisible(!$("jiesan").isVisible());
            $("btn_control_btns").setFlippedY(!$("btn_control_btns").isFlippedY());
        },
        hideControlBtns: function () {
            $("btn_bg").setVisible(false);
            $("setting").setVisible(false);
            $("chat").setVisible(false);
            $("jiesan").setVisible(false);
            $("btn_control_btns").setFlippedY(true);
        },
        getOriginalPos: function () {
            return 2;
        },
        getEffectEmojiPos: function (caster, patient, isNotMid) {
            var self = this;
            var pos = {};
            var infoCasterHead = $('info' + caster + '.head');
            var infoPatientHead = $('info' + patient + '.head');
            pos[caster] = infoCasterHead ? infoCasterHead.getParent().convertToWorldSpace(infoCasterHead.getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            pos[patient] = (patient != self.getOriginalPos() && infoPatientHead) || isNotMid ? infoPatientHead.getParent().convertToWorldSpace(infoPatientHead.getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            return pos;
        },
    });
})();