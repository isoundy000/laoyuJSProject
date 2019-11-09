'use strict';
(function (exports) {
    var lb_gang = res.lb_gang;
    var lb_lai = res.lb_lai;
    var lb_pi = res.lb_pi;
    var lb_xia = res.lb_xia;
    var lb_wang = res.lb_wang;

    var ORIENTATION = {
        0:'东',
        1:'南',
        2:'西',
        3:'北',

    };

    var BatteryTextures = {
        "battery1": res.battery_1,
        "battery2": res.battery_2,
        "battery3": res.battery_3,
        "battery4": res.battery_4,
        "battery5": res.battery_5
    };
    var $ = null;

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

    var UP_PAI_TIME =0.02;

    var posConf = {
        headPosBak: {}
        , paiA0PosBak: {}
        , paiA0ScaleBak: {}
        , paiADistance: []
        , paiALiangDistance: [0.5, 3.5, 0, -3.5]
        , paiMopaiDistance: {0: 16, 1: 40, 2: 34, 3: 40}
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
        , groupDistance: {0: -5, 1: -6, 2: 16, 3: -6}
        // , groupToFirstPaiDistance: {0: 10, 1: -14, 2: 26, 3: -14}
        , groupToFirstPaiDistance: {0: 1, 1: -24, 2: 26, 3: -24}

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
            , 1: cc.p(39, 40)
            , 2: cc.p(40, 40)
            , 3: cc.p(56, 40)
        }
        , ltqpVoicePos: {
            0: cc.p(40, 28)
            , 1: cc.p(37, 40)
            , 2: cc.p(42, 40)
            , 3: cc.p(58, 40)
        }
        , ltqpEmojiSize: {}
        , ltqpTextDelta: {
            0: cc.p(0, -4)
            , 1: cc.p(-7, 7)
            , 2: cc.p(-1, 9)
            , 3: cc.p(8, 7)
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
            {x: 30, y: 85},
            {x: 70, y: 40},
            {x: 30, y: 20},
            {x: 10, y: 40}
        ]
    };

    var data;
    var isReconnect;

    var roomState = null;
    var mapId = 2;
    var playerNum = 4;
    var rowBegin = 1;

    var enableChupaiCnt = 0;

    var effectEmojiQueue = {};
    var effectEmojiCfg = {
        1: {'name': 'zan', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'bomb', 'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3: {'name': 'egg', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4: {'name': 'shoe', 'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5: {'name': 'flower', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0}
    };

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

    var curHuPaiId = 0;

    var bShowVideo = false;

    // for wuhan
    var laiziPaiId = 0;
    var laizipiPaiAId = 0;
    var laizipiPaiBId = 0;

    /*----------------------- 比赛场 ----------------------- */
    var isAutoSendPai = false;
    /*----------------------- 比赛场 ----------------------- */

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

        if (prefix) ret = prefix + id + '.png';

        if (row == 0 && id == 0 && isLittle) ret = 'p0s0' + '.png';
        if (row == 1 && id == 0 && isLittle) ret = 'p1s0' + '.png';
        //if (row == 2 && id == 0 && isLittle) ret = '' + '.png';
        if (row == 3 && id == 0 && isLittle) ret = 'p3s0' + '.png';
        //if (row == 0 && id == 0 && !isLittle) ret = 'bs' + '.png';
        //if (row == 1 && id == 0 && !isLittle) ret = 'bh' + '.png';
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

    var MaLayer_match = cc.Layer.extend({
        chatLayer: null,
        chiLayer: null,
        settingLayer: null,
        throwDiceLayer: null,
        kaigangLayer: null,
        beforeOnCCSLoadFinish: null,
        afterGameStart: null,
        safenode:null,
        isJiesan:false,
        pos0: null,
        pos1: null,
        pos2: null,
        pos3: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            /*----------------------- 比赛场 ----------------------- */
            var that = this;
            if (gameData.matchId) {
                network.send(3333, {cmd: 'getRank', params: {prmMatchId: gameData.matchId}})

                this.list_getRank = cc.eventManager.addCustomListener('match_getRank', function (event) {
                    hideLoading();
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var mtop = data['myTop'] || 0;
                        var ttop = data['totalTop'] || 0;

                        $('paiming.top').setString('排名:' + (mtop + '/' + ttop));

                    } else {
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });

                this.list_getRankList = cc.eventManager.addCustomListener("match_getRankList", function (event) {

                    hideLoading();
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var rankList = data['rankList'] || [];

                        that.addChild(new MatchRankLayer(rankList));

                    } else {
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }


                });

                this.list_putMatchRecord = cc.eventManager.addCustomListener("match_putMatchRecord", function (event) {//比赛结果
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var record = data['record'];
                        var relayer=that.getChildByName('rewardLayer');
                        if(!relayer){
                            var rlayer = new MatchRewardLayer(record);
                            rlayer.setVisible(false);
                            that.addChild(rlayer, 102);
                            rlayer.setName('rewardLayer');
                            that.scheduleOnce(function () {
                                rlayer.setVisible(true)
                                rlayer.showAnim();
                                that.hasreward=true;
                            }, 1);
                        }


                    } else {
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }


                });
            }

            /*----------------------- 比赛场 ----------------------- */
        },
        getRootNode: function () {
            return this.getChildByName("Scene");
        },
        initExtraMapData: function (data) {
            var that = this;
        },
        onCCSLoadFinish: function () {
            var that = this;
            // getLocationInfo();

            addCachedCCSChildrenTo(res.MaScene1_json, this);
            batchSetChildrenZorder(this.getRootNode(), {
                info0: 1, info1: 1, info2: 1, info3: 1,
                info_n0: 2, info_n1: 2, info_n2: 20, info_n3: 2,
                row2: 10,
                cpghg: 11,piao_bar: 12,
                btn_bg: 30, setting: 31, chat: 32, jiesan: 33, btn_control_btns: 34,
                hu_type_layer: 99,
                safenode: 100,
                /*----------------------- 比赛场 ----------------------- */
                auto_bg: 20,
                bsks:20,
                /*----------------------- 比赛场 ----------------------- */
            });

            $ = create$(this.getRootNode());

            this.getPai = this.getPai();
            this.getGPai = this.getGPai();
            this.addUsedPai = this.addUsedPai();
            this.countDown = this.countDown();

            this.calcPosConf();
            this.getVersion();

            EFFECT_EMOJI.init(this, $);
            MicLayer.init($('btn_mic'), this);

            if (isReconnect) {
                gameData.zhuangUid = data['zhuang_uid'];
                gameData.leftRound = data['left_round'];
                gameData.players = data['players'];
                gameData.wanfaDesp = data['desp'];

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
            else
                this.setRoomState(ROOM_STATE_CREATED);

            //this.initWanfa();

            $('hupai_tip').setVisible(false);

            this.safenode = $("safenode");
            //this.showSafeTipLayer();
            for (var i = 1; i <= 3; i++) {
                var safe_line = $("safe_line" + i, this.safenode);
                safe_line.setOpacity(255);
                safe_line.setVisible(false);
            }
            if(window.inReview){
                this.safenode.setVisible(false);
            }

            this.clearTable4StartGame(isReconnect, isReconnect, data);

            if (isReconnect) {
                /*----------------------- 比赛场 ----------------------- */
                var player_pai = data.player_pai;
                if (player_pai && player_pai.length > 0) {
                    for (var i = 0; i < player_pai.length; i++) {
                        var temp = player_pai[i];
                        if (temp.uid == gameData.uid && temp.is_tg) {
                            $('auto_bg').setVisible(true);
                        }
                        if(temp.is_tg)
                        {
                            var row = uid2position[temp.uid];
                            $('info' + row + '.tuo').setVisible(true);
                        }
                    }
                }
                /*----------------------- 比赛场 ----------------------- */
            }

            this.startTime();

            this.startSignal();

            TouchUtils.setOnclickListener($('btn_control_btns'), function () {
                that.changeBtnStatus();
            });
            TouchUtils.setOnclickListener($('btn_bg'), function () {

            });
            TouchUtils.setOnclickListener($('bgPanel'), function () {
                that.hideControlBtns();
            });

            TouchUtils.setOnclickListener($('chat'), function () {
                that.addChild(new ChatLayer());
            });

            TouchUtils.setOnclickListener($('setting'), function () {
                // if (!that.settingsLayer) {
                //     that.settingsLayer = new ThemeSetting();
                //     that.settingsLayer.retain();
                // }
                // that.addChild(that.settingsLayer);

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
            $("ma_refresh").setVisible(gameData.opt_conf['refresh_table']);
            TouchUtils.setOnclickListener($("ma_refresh"), function () {
                network.disconnect();
            });
            TouchUtils.setOnclickListener($('btn_zhunbei'), function () {
                network.send(3004, {room_id: gameData.roomId});
            });

            TouchUtils.setOnclickListener($('btn_yxks'), function () {
                network.send(3004, {room_id: gameData.roomId});
            });

            TouchUtils.setOnclickListener($('btn_invite'), function () {
                // that.addChild(new ShareTypeLayer(), 100);
                //shareRoomId();
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName+"麻将-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var shareurl = getShareUrl(gameData.roomId);
                WXUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($('btn_inviteLiaobei'), function () {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName+"麻将-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var shareurl = getShareUrl(gameData.roomId);
                LBUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($('btn_inviteXianLiao'), function () {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName+"麻将-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                XianLiaoUtils.shareGame(gameData.roomId, title, gameData.companyName+"麻将-" +content, 0, getCurTimestamp() + gameData.uid);
            });

            // TouchUtils.setOnclickListener($('btn_dingding'), function () {
            //     shareRoomIdDingDing();
            // });
            //
            // TouchUtils.setOnclickListener($('btn_xianliao'), function () {
            //     if (getNativeVersion() < '2.0.4') {
            //         alert1("您的版本过低，请升级后使用该功能");
            //         return;
            //     }
            //     shareRoomIdXianLiao();
            // });

            // TouchUtils.setOnclickListener($('btn_qq'), function () {
            //     var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
            //     var mapName = parts[1];
            //     parts.splice(1, 1);
            //     var url = 'http://hn.yayayouxi.com';
            //     var title = "丫丫-" + mapName + '-' + gameData.roomId;
            //     var description = "房号: " + gameData.roomId + "," +
            //         (parts.length ? parts.join(',') + ',' : "") + "速度来啊! 【丫丫湖南麻将】";
            //     if (getNativeVersion() < '1.4.0') {
            //         alert1("您的版本过低，请升级后使用该功能");
            //         return;
            //     }
            //     QQUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
            // });

            TouchUtils.setOnclickListener($('btn_copy'), function () {
                if (getNativeVersion() == "1.2.0") {
                    alert1("请下载最新版本使用新功能");
                    return;
                }
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);
                var shareurl = getShareUrl(gameData.roomId);
                var shareText = "【"+gameData.companyName+"湖南麻将】\n" + mapName + "\n房号: " + ToDBC(gameData.roomId) + "\n"
                    + (parts.length ? parts.join(', ') + ', ' : "") + "速度来啊！" +
                    shareurl;
                savePasteBoard(shareText);
                showMessage("您的房间信息已复制，请粘贴至微信处分享", {fontName: "res/fonts/FZCY.ttf"});
            });

            /*----------------------- 比赛场 ----------------------- */
            TouchUtils.setOnclickListener($('paiming'), function () {
                showLoading('正在获取数据..');
                network.send(3333, {cmd: 'getRankList', params: {prmMatchId: gameData.matchId}});
            });
            /*----------------------- 比赛场 ----------------------- */
            TouchUtils.setOnclickListener($('btn_fanhui'), function () {
                if (gameData.uid != gameData.ownerUid) {
                    alert2('确定要退出房间吗?', function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, true, true);
                }
            });

            TouchUtils.setOnclickListener($('btn_fanhui'), function () {
                if (gameData.uid != gameData.ownerUid) {
                    alert2('确定要退出房间吗?', function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, true, true);
                }
            });

            TouchUtils.setOnclickListener($('jiesan'), function () {
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    if (window.inReview)
                        network.send(3003, {room_id: gameData.roomId});
                    else
                        alert2("是否确定解散该房间？", function () {
                            network.send(3003, {room_id: gameData.roomId});
                        }, function () {

                        });
                    return;
                }

                alert2('确定要申请解散房间吗?', function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                }, function () {

                });
            });
            /*----------------------- 比赛场 ----------------------- */
            if(gameData.matchId){
                Filter.grayMask($('jiesan'));
                TouchUtils.removeListeners($('jiesan'));
            }
            /*----------------------- 比赛场 ----------------------- */
            TouchUtils.setOnclickListener($('btn_jiesan'), function () {
                if (window.inReview)
                    network.send(3003, {room_id: gameData.roomId});
                else
                    alert2("是否确定解散该房间？", function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, function () {

                    });
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
            /*----------------------- 比赛场 ----------------------- */
            TouchUtils.setOnclickListener($('auto_bg.button_qxtg'), function () {
                network.send(4007, {room_id: gameData.roomId, op: 0})
            });

            // TouchUtils.setOnclickListener($('btn_auto'), function () {//自动托管暂不使用 由服务器时间到了自动启用托管功能
            //     network.send(4007, {room_id: gameData.roomId, op: 1})
            // });
            /*----------------------- 比赛场 ----------------------- */
            network.addListener(3002, function (data) {
                gameData.last3002 = data;
                gameData.playerNum = data['max_player_cnt'];
                if (isReplay) {
                    mapId = data['map_id'];
                    gameData.mapId = data['map_id'];
                    gameData.wanfaDesp = data['desp'];
                    /*----------------------- 比赛场 ----------------------- */
                    gameData.matchId = data['match_id'] || 0;
                    console.log("3002 -------- MaLayer_match "+ gameData.matchId );
                    if(gameData.matchId){
                        gameData.matchInfo = data['match_info'];
                        gameData.baseScore=data['init_base_score']||0;
                        gameData.totalRound = data['total_round'];
                        gameData.playTime=data['play_time']||12;
                    }
                    /*----------------------- 比赛场 ----------------------- */
                }
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.ownerUid = data['owner'];
                    gameData.players = data['players'];
                    that.onPlayerEnterExit();
                }
                gameData.daikaiPlayer = data['daikai_player'];
            });
            network.addListener(3003, function (data) {
                var uid = data['uid'];
                if (uid == gameData.uid) {
                    HUD.showScene(HUD_LIST.Home, that);
                    //HUD.showScene(HUD_LIST.Home, null);
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
                            //HUD.showScene(HUD_LIST.Home, null);
                            HUD.showScene(HUD_LIST.Home, that);
                        });
                    }else
                    {
                        alert1('代开房主已解散房间', function () {
                            //HUD.showScene(HUD_LIST.Home, null);
                            HUD.showScene(HUD_LIST.Home, that);
                        });
                    }
                }
                else {
                    var uid = data['uid'];
                    _.remove(gameData.players, function (player) {
                        return player.uid == uid;
                    });
                    that.onPlayerEnterExit();
                }
            });
            network.addListener(3004, function (data) {
                if(!data)
                    return;
                if (that.getRoomState() != ROOM_STATE_ENDED)
                    return;
                var uid = data['uid'];
                that.setReady(uid);
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

                if (type == 'text') {
                    var voice = data.voice; //获得文字信息
                }
                that.showChat(uid2position[uid], type, content, voice);
            });
            network.addListener(3009, function (data) {
                if(data["arr"] == null || data["arr"] == undefined || data["arr"] == '' || (data["arr"] && data["arr"].length == 0)){
                    return;
                }

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

                // if (isJiesan) {
                //     var nicknameArr = [];
                //     for (var i = 0; i < arr.length; i++) {
                //         nicknameArr.push("【" + gameData.playerMap[arr[i].uid].nickname + "】");
                //     }
                //     var shenqingjiesanLayer = $('shenqingjiesan', that);
                //     if (shenqingjiesanLayer)
                //         shenqingjiesanLayer.removeFromParent(true);
                //     alert1("经玩家" + nicknameArr.join(",") + "同意, 房间解散成功", function () {
                //     });
                // }
                // else if (refuseUid) {
                //     var shenqingjiesanLayer = $('shenqingjiesan', that);
                //     if (shenqingjiesanLayer)
                //         shenqingjiesanLayer.removeFromParent(true);
                //     alert1('由于玩家【' + gameData.playerMap[refuseUid].nickname + '】拒绝，房间解散失败，游戏继续');
                // }
                // else {
                //     var shenqingjiesanLayer = $('shenqingjiesan', that);
                //     if (!shenqingjiesanLayer) {
                //         shenqingjiesanLayer = new Ma_ShenqingjiesanLayer();
                //         shenqingjiesanLayer.setName('shenqingjiesan');
                //         that.addChild(shenqingjiesanLayer);
                //     }
                //     shenqingjiesanLayer.setArr(leftSeconds, arr);
                // }
            });
            network.addListener(3200, (function () {
                var interval = null;
                return function (data) {
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
                        text.setString(window.inReview ? "欢迎来到"+gameData.companyName+"湖南麻将!" : content);
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
            network.addListener(3007, function (data) {
                console.log(data['map']);
                var map = data['map'];
                for(var uid in map){
                    var loc = map[uid]['loc'];
                    var locCN = map[uid]['locCN'];
                    gameData.players[position2playerArrIdx[uid2position[uid]]]['loc'] = loc;
                    gameData.players[position2playerArrIdx[uid2position[uid]]]['locCN'] = locCN;
                }
            });
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
                $('timer3.Text_2').setString(left);/*----------------------- 比赛场 ----------------------- */
                that.mopai(uid2position[uid], paiId, paiArr, liangPaiArr);
            });
            network.addListener(4002, function (data) {
                var uid = data['uid'];
                var idx = data['idx'];
                var paiId = data['pai_id'];
                var paiArr = (data['pai_arr'] || []);
                var liangPaiArr = (data['liang_pai_arr'] || []);
                var paiCnt = (data['pai_cnt'] || 0);
                var left = (data['left'] || 0);
                var row = uid2position[uid];
                if (mapId == MAP_ID.CHANGSHA)
                    $('timer2.Text_2').setString(left);
                for (var i = 0; i < paiCnt; i++)
                    paiArr.push(0);
                that.chuPai(row, idx, paiId, paiArr, liangPaiArr);
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
                /*----------------------- 比赛场 ----------------------- */
                gameData.data4004 = data;
                cc.log('row is========================',row);
                cc.log('isAutoSendPai is=====================',isAutoSendPai);
                if(isAutoSendPai&&row==2){
                    that.setHuTipVisible(false);
                    if (hideGangStep == 2) {//做特殊处理 因为curPaiArr发生了改变
                        that.setPaiArrOfRow(2, that.prePaiArr, false, true, [], false, true);//重新设置为前端储存的数组 并且不排序
                    } else {
                        that.setPaiArrOfRow(2, that.curPaiArr, false, true, [], false, true);//重新设置为前端储存的数组 并且不排序
                    }
                    hideGangStep = 0;
                    $('btn_xuanzewancheng').setVisible(false);
                    that.recalcPos(2);
                    that.hideTip();
                    if (gameData.huTipData) {
                        that.showTishiTip(gameData.huTipData);
                    }
                }
                /*----------------------- 比赛场 ----------------------- */
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
                that.setRoomState(ROOM_STATE_ENDED);
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    data['matchId'] = gameData.matchId;
                    data['matchInfo']=gameData.matchInfo;
                }
                /*----------------------- 比赛场 ----------------------- */
                that.jiesuan(data);
            });
            network.addListener(4009, function (data) {
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    return;
                }
                /*----------------------- 比赛场 ----------------------- */
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
            network.addListener(4012, function (data) {
                var zhainiaoLayer = new ZhaniaoLayer(data, 2);
                that.addChild(zhainiaoLayer);
                // network.stop();
            });
            network.addListener(4013, function (data) {
                that.showTip("第一步, 请选择一张要打出的牌");
                that.setPaiArrOfRow(2, data['pai_arr'], false, false, data['liang_pai_arr']);
                liangStep = 1;
            });
            network.addListener(4014, function (data) {
                var paiArr = data['pai_arr'];
                var paiArrBak = _.clone(data['pai_arr']);
                var gangPaiArr = data['gang_pai_arr'];
                if (!gangPaiArr) {

                }
                else {
                    that.showTip("请选择不想显示的杠牌");
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
                        that.setPaiArrOfRow(2, paiArr, false, false, gangPaiArr, true);
                    }
                }
                if (gameData.huTipData) {
                    that.showTishiTip(gameData.huTipData);
                    // console.log("111");
                }
            });
            network.addListener(4015, function (data) {
                hideGangChupaiArr = data['ting_pai_arr'];
                hideGangStep = 2;
                that.showTip("请出一张牌");
                var paiArr = that.getPaiArr();
                that.setPaiArrOfRow(2, paiArr, false, false, hideGangChupaiArr);
                if ($('btn_xuanzewancheng')) {
                    $('btn_xuanzewancheng').setVisible(false);
                }
                if (gameData.huTipData) {
                    that.showTishiTip(gameData.huTipData);
                }
            });
            network.addListener(4020, function (data) {
                var uid = data['uid'];
                var isOffline = data['is_offline'];
                that.playerOnloneStatusChange(uid2position[uid], isOffline);
            });
            network.addListener(4200, function (data) {
                var paiArr = data['paiArr'];
                var zhuangUid = data['zhuang_uid'];

                gameData.zhuangUid = zhuangUid;
                gameData.leftRound = data['left_round'];
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    gameData.totalRound = data['total_round'];
                    gameData.curRound = gameData.totalRound - gameData.leftRound;
                }

                /*----------------------- 比赛场 ----------------------- */
                that.initExtraMapData(data);

                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame(true);
                that.fapai(paiArr);
                that.setZhuang(uid2position[zhuangUid]);

                forRows(function (i) {
                    var spBs = $('info' + i + '.sp_piao');
                    if (spBs)
                        spBs.setVisible(false);
                });


                var isSelectPiaoFinished = _.isUndefined(data['spf']) ? true : data['spf'];
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
                    that.showTip('您选择要亮的或要出的牌不正确,请重新选择');
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
                    that.showTip('您选择要出的牌不正确,请重新选择');
                    //$('btn_xuanzewancheng').setVisible(true);
                    //$('btn_quxiao').setVisible(true);
                }
                else {
                    var uid = data['uid'];
                    that.hideTip();
                    var paiArr = data['pai_arr'];
                    var hidedGangPaiArr = data['hided_gang_arr'] || [];

                    var row = uid2position[uid];
                    /*----------------------- 比赛场 ----------------------- */
                    if (gameData.matchId) {
                        do{
                            if (row == 2) {
                                afterLianging = true;
                                that.upPai(2, -1);
                                if (!isAutoSendPai) break;
                            }
                            else {
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
                            }
                        }while (false);
                    }
                    /*----------------------- 比赛场 ----------------------- */
                    else{
                        if (row == 2) {
                            afterLianging = true;
                            that.upPai(2, -1);
                        }
                        else {
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
                        }
                    }

                    //that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), []);

                    if (row == 2) {
                        hasChupai = true;
                        that.hideTip();
                    }

                    if ($('info' + row + '.liang'))
                        $('info' + row + '.liang').setVisible(true);
                    setTimeout(function () {
                        that.playChiPengGangHuAnim(row, OP_LIANG);
                        playEffect('vliang', position2sex[row]);
                    }, 1200);
                }
            });
            network.addListener(4041, function (data, errCode) {
            });
            /*----------------------- 比赛场 ----------------------- */
            network.addListener(4007, function (data, errCode) {
                var op = data["op"];
                var uid = data["uid"];
                var row = uid2position[uid];
                if (row == 2) {
                    $('auto_bg').setVisible(op != 0);
                    that.hideChiPengGangHu();
                    isAutoSendPai = op == 1;
                }
                $('info' + row + '.tuo').setVisible(op != 0);
            });
            /*----------------------- 比赛场 ----------------------- */
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
            network.addListener(4052, function (data) {
                network.stop();
                var uid = data['uid'];
                var row = uid2position[uid];
                if (row == 2)
                    afterLianging = true;

                if ($('info' + row + '.liang'))
                    $('info' + row + '.liang').setVisible(true);
                if (row == 2) {
                    that.setPaiArrOfRow(2, that.getPaiArr(), false, false, []);
                    that.getPai(2, 13).setVisible(false);
                }
                var isReconnect = data['is_reconnect'] || false;
                var paiID = data['pai'];
                var paiIDA = data['pai_a'];
                var paiIDB = data['pai_b'];
                var paiStr = PAINAMES[paiIDA] + (paiIDB ? "," + PAINAMES[paiIDB] : "");

                that.showTip("开杠: " + paiStr);

                that.hideChiPengGangHu();

                var throwDiceCb = function () {
                    network.start();
                    var content = "玩家【" + ellipsisStr(_.trim(gameData.playerMap[uid].nickname), 6) + "】开杠" + PAINAMES[paiID] + ", 补牌: " + paiStr + "\n请选择你可以进行的操作";

                    var qgh = data['qgh'];
                    var opA = data['op_a'];
                    var opB = data['op_b'];

                    if (opA[0] + opA[1] + opA[2] + opA[3] <= 0 &&
                        opB[0] + opB[1] + opB[2] + opB[3] <= 0 && !qgh)
                        return;

                    var layer = $('kaigangLayer', that) || that.kaigangLayer;
                    if (!layer) {
                        var scene = ccs.load(res.KaigangLayer_json,"res/");
                        layer = scene.node;
                        layer.setName('kaigangLayer');
                        layer.retain();
                        that.kaigangLayer = layer;
                    }
                    that.addChild(layer);

                    $('root.panel.lb_content', layer).setString(content);

                    var paiA = $('root.panel.a0', layer);
                    var paiB = $('root.panel.a1', layer);
                    paiA.setUserData({paiId: paiIDA});
                    paiB.setUserData({paiId: paiIDB});
                    setSpriteFrameByName(paiA, getPaiNameByRowAndId(2, paiIDA, true), 'majiang/pai');
                    setSpriteFrameByName(paiB, getPaiNameByRowAndId(2, paiIDB, true), 'majiang/pai');

                    var qghBtn = $('root.panel.btn_qgh', layer);
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
                                var op = btn.getName().split('_')[0];
                                var idx = btn.getName().split('_')[1];
                                op = {chi: 1, peng: 2, gang: 50, bu: 3, hu: 4, guo: 0}[op];
                                var pai = btn.getParent().getChildByName('a' + idx);
                                var _paiId = pai.getUserData().paiId;
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
                                // console.log(op + ' ' + idx + ' ' + _paiId);
                            });
                        }
                        else {
                            Filter.grayScale(btn);
                            TouchUtils.removeListeners(btn);
                        }
                    };

                    enableBtn(opA[0], $('root.panel.chi_0', layer));
                    enableBtn(opA[1], $('root.panel.peng_0', layer));
                    enableBtn(opA[2], $('root.panel.gang_0', layer));
                    enableBtn(opA[2], $('root.panel.bu_0', layer));
                    enableBtn(opA[3], $('root.panel.hu_0', layer));

                    enableBtn(opB[0], $('root.panel.chi_1', layer));
                    enableBtn(opB[1], $('root.panel.peng_1', layer));
                    enableBtn(opB[2], $('root.panel.gang_1', layer));
                    enableBtn(opB[2], $('root.panel.bu_1', layer));
                    enableBtn(opB[3], $('root.panel.hu_1', layer));

                    TouchUtils.setOnclickListener($('root.panel.guo', layer), function () {
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
                    that.throwDice("开杠摇骰子", data['dice'], paiIDA, paiIDB, throwDiceCb);
                playEffect('vsaizi');
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
                if (gameData.speakCSH) {
                    var alchupai = false;
                    for (var i = 0; i < 4; i++) {
                        if ($('row' + i + '.c0.b0').isVisible()) {
                            alchupai = true;
                            break;
                        }
                    }
                    if (alchupai) {
                        playEffect('vhu_fqs', position2sex[row]);
                    } else {
                        playEffect('vhu_qs', position2sex[row]);
                    }
                } else {
                    playEffect('vhu', position2sex[row]);
                }

                var hu_type_arr = data['hu_type_arr'];
                if (hu_type_arr && hu_type_arr.length > 0) {
                    that.HuTypeAnimation(row, hu_type_arr.slice());
                }
            });
            network.addListener(4058, function (data) {
                var layer = ccs.load(res.KaigangReplayLayer_json,"res/").node;
                var content = $('root.lb_content', layer);
                content.setString(decodeURIComponent(data.content));
                that.addChild(layer);
                that.scheduleOnce(function () {
                    layer.removeFromParent(true);
                }, 5);
            });

            network.addListener(4062, function (data) {
                that.showTishiTip(data);
            });

            network.addListener(4034, function (data, errCode) {
                that.showSelectPiao(data['sel_map']);
                if(!isReplay)
                {
                    forRows(function (i) {
                        for (var j = 0; j < 14; j++)
                            this.getPai(i, j).setVisible(false);
                    });
                }
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

            network.start();

            isCCSLoadFinished = true;

            var setting_bgm = cc.sys.localStorage.getItem('setting_bgm_majiang') || 1;
            playMusic("vbg_ma" + setting_bgm);

            that.showFangzhu();
        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if(subArr)  sub = subArr['majiang'];

            var versiontxt = window.curVersion + "-" + sub;
            if(cc.sys.os == cc.sys.OS_IOS && versiontxt){
                var regx = new RegExp('\\.', 'g');
                versiontxt = versiontxt.replace(regx, '');
            }
            var version = new ccui.Text();
            version.setFontSize(15);
            version.setTextColor(cc.color(255, 255, 255));
            version.setPosition(cc.p(1280 - 10, 10));
            version.setAnchorPoint(cc.p(1, 0.5));
            version.setString(versiontxt);
            this.addChild(version, 2);
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

                        var spBs = $('info' + row + '.sp_piao');
                        if (spBs) {
                            spBs.setVisible(true);
                            if (selectPiaoMap[uid] == 0) {
                                spBs.setString('不飘');
                            } else {
                                spBs.setString('飘' + selectPiaoMap[uid] + '分');
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
                    var isShowPiao0 = true;//gameData.triggers && gameData.triggers[9];
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
                        network.send(4033, {room_id: gameData.roomId, piao: 2});
                    });
                    TouchUtils.setOnclickListener($('piao_bar.piao3'), function () {
                        alert2("确定要 飘3分 吗?", function () {
                            network.send(4033, {room_id: gameData.roomId, piao: 3});
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


                    var sp_piao = $('info' + row + '.sp_piaostate0')
                    if (sp_piao) {
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
        showFangzhu: function () {
            /*----------------------- 比赛场 ----------------------- */
            if (gameData.matchId) {
                $('fangzhuheader').setVisible(false);
                return;
            }
            /*----------------------- 比赛场 ----------------------- */
            if (gameData.daikaiPlayer && false) {
                $('fangzhuheader').setVisible(true);
                loadImageToSprite(gameData.daikaiPlayer['headimgurl'], $('fangzhuheader.header'));
                $('fangzhuheader.name').setString(ellipsisStr(gameData.daikaiPlayer['nickname']));
            } else {
                $('fangzhuheader').setVisible(false);
            }
        },
        HuTypeAnimation: function (row, arr) {
            var that = this;
            if (arr.length > 0) {
                var huType = arr.shift();
                var typeSprite = new cc.Sprite("res/image/ui/majiang/hu_type/" + huType + ".png");
                $('info_n' + row).addChild(typeSprite);
                typeSprite.runAction(
                    cc.sequence(
                        cc.moveBy(1.2, cc.p(0, 150)).easing(cc.easeOut(3.0)),
                        cc.callFunc(function () {
                            typeSprite.removeFromParent(true);
                            that.HuTypeAnimation(row, arr);
                        })
                    )
                );
                $('hu_type_layer').setVisible(true);
            } else {
                $('hu_type_layer').setVisible(false);
            }
        },

        //GPS 提示信息
        setupPlayers: function () {
            var that = this;
            // if (isReplay) {
            //     gameData.players = mRoom.replayData.users;
            // }
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
            this.pos0 = pos;
            this.pos1 = (pos + 1) %  gameData.playerNum;
            this.pos2 = (pos + 2) %  gameData.playerNum;
            this.pos3 = (pos + 3) %  gameData.playerNum;

            //报警  100以内  报警
            var needBaojing = false;
            // gameData.location = "0.1,0.1";
            for (var i = 0; i < data.length; i++) {
                if (data[i].uid != gameData.uid) {
                    var pos = that.getRowByUid(data[i].uid);
                    this.addGpsTip(pos, data[i]['nickname'], data[i]['loc']);
                }
            }
            //任意两个人距离 <500 就报警
            for (var i = 0; i < data.length; i++) {
                for (var j = i + 1; j < data.length; j++) {
                    var distance = this.getJuliByLoc(data[i]['loc'], data[j]['loc']);
                    if (distance <= 500) {
                        needBaojing = true;
                        break;
                    }
                }
            }
            if(!window.inReview){
                this.showSafeTipLayer(needBaojing);
            }

            var ORIENTATION2 = {};
            for(var i = 0 ;i < gameData.players.length; i++){
                ORIENTATION2[uid2position[gameData.players[i].uid]] = ORIENTATION[gameData.players[i].pos];
            }
            for(var j = 0 ; j < 4; j++){
                $('timer.txt'+j).setString(ORIENTATION2[j]);
            }
        },

        //GPS 提示信息
        addGpsTip: function (pos, name, loc) {
            var that = this;
            var safelayer = that.getChildByName("safelayer");
            if (safelayer) {
                var posArr = {pos0: this.pos0, pos1: this.pos1, pos2: this.pos2, pos3: this.pos3};
                safelayer.setPlayerJuli(posArr);
            }
            if (loc == undefined || loc == null || loc == "false" || loc == false) {
                return;
            }
            var templocation1 = loc.split(',');
            var otherpeoplelocationlat = 0;
            var otherpeoplelocationlng = 0;
            if (templocation1.length == 2) {
                otherpeoplelocationlat = templocation1[1];
                otherpeoplelocationlng = templocation1[0];
            }

            var mylocationlat = locationUtil.latitude;
            var mylocationlng = locationUtil.longitude;
            var juli = "";
            var distance = locationUtil.getFlatternDistance(mylocationlat, mylocationlng, otherpeoplelocationlat, otherpeoplelocationlng);
            if (distance <= 100) {
                juli = '玩家[' + name + ']' + '距您距离过近（' + distance + "米）";

                var safe_line = $("safe_line" + (pos + 1), this.safenode);
                if (safe_line) {
                    if (this.safenode.nodeNum == undefined || this.safenode.nodeNum == null) {
                        this.safenode.nodeNum = 0;
                    }
                    safe_line.setOpacity(255);
                    safe_line.setVisible(true);
                    if (!safe_line.pos) {
                        this.safenode.nodeNum += 1;
                        safe_line.setPositionY(safe_line.getPositionY() - (this.safenode.nodeNum) * 40);
                        // console.log(pos + "==="+ safe_line.getPositionY());
                    }
                    safe_line.pos = true;
                    var tip = safe_line.getChildByName("tip");
                    tip.setString(juli);
                    safe_line.runAction(cc.sequence(
                        cc.delayTime(15),
                        cc.fadeOut(1),
                        cc.callFunc(function () {
                            safe_line.pos = false;
                            safe_line.setVisible(false);
                            if (that.safenode.nodeNum > 0) that.safenode.nodeNum -= 1;
                        })
                    ))
                }
            }
        },

        getJuliByLoc: function (loc, loc2) {
            var distance = 100000;
            if (loc) {
                var templocation1 = loc.split(',');
                var otherpeoplelocationlat = 0;
                var otherpeoplelocationlng = 0;
                if (templocation1.length == 2) {
                    otherpeoplelocationlat = templocation1[1];
                    otherpeoplelocationlng = templocation1[0];
                }

                var mylocationlat = 0;
                var mylocationlng = 0;
                if (loc2) {
                    var templocation2 = loc2.split(',');
                    if (templocation2.length == 2) {
                        mylocationlat = templocation2[1];
                        mylocationlng = templocation2[0];
                    }
                }
                distance = locationUtil.getFlatternDistance(mylocationlat, mylocationlng, otherpeoplelocationlat, otherpeoplelocationlng);
            }
            return distance;
        },

        //GPS 提示
        showSafeTipLayer: function (_bool) {
            var visible = _bool;
            if (isReplay) visible = false;
            var that = this;
            var safebtn = $("safebtn", that.safenode);
            var safe_gps = $("safebtn.safe_gps", that.safenode);
            var safe_gps2 = $("safebtn.safe_gps2", that.safenode);
            safe_gps.setVisible(true);
            safe_gps2.setVisible(true);
            if (_bool) {

                if(!that.isTouchedSafeBtn){
                    safe_gps.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))));
                    safe_gps2.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
                }else{
                    safe_gps.setOpacity(255);
                    safe_gps2.setOpacity(255);
                    safe_gps.stopAllActions();
                    safe_gps2.stopAllActions();
                    safe_gps.setVisible(true);
                    safe_gps2.setVisible(false);
                }

            } else {
                safe_gps.setVisible(false);
                safe_gps2.setVisible(true);
            }

            TouchUtils.setOnclickListener(safebtn, function () {
                //var posArr = {pos0: that.pos0, pos1: that.pos1, pos2: that.pos2};
                that.isTouchedSafeBtn = true;
                safe_gps.setOpacity(255);
                safe_gps2.setOpacity(255);
                safe_gps.stopAllActions();
                safe_gps2.stopAllActions();
                safe_gps.setVisible(true);
                safe_gps2.setVisible(false);
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
        },

        getUserHeaderData: function () {
            var data = {};
            var players = gameData.players;
            var scale = cc.view.getFrameSize().width / cc.director.getWinSize().width;
            var theight = cc.view.getFrameSize().height / scale;
            var boardHeight = (theight - cc.director.getWinSize().height) / 2;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var pos = 0;
                var header = $('info' + pos + '.head');
                // var header = $('vedio' + pos);
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

        createVideoView: function(){
            // if (!bShowVideo) {
            //     bShowVideo = true;
            //     PermissionUtils.hasPermission("android.permission.CAMERA");
            //     AgoraUtil.initVideoView(this.getUserHeaderData());
            //     setTimeout(function () {
            //         AgoraUtil.openVideo(gameData.roomId.toString(), gameData.uid.toString());
            //     }, 1000);
            // }
        },

        hideWanfaLayer: function () {
            if (this.wanfaLayer != null) {
                this.wanfaLayer.setVisible(false);
            }
        },
        showTishiTip: function (data) {
            var that = this;

            //胡牌提示
            that.hupaiTipData = data.tishi;
            var hupai_tip = $('hupai_tip');
            hupai_tip.setVisible(false);
            var huCurCard = data['lastChuPai'];
            if(huCurCard > 0 && that.hupaiTipData && that.hupaiTipData[huCurCard])  that.initHuPaiTishiLayer(that.hupaiTipData[huCurCard]);

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
                        hucardSprite.setPosition(cardSprite.getContentSize().width / 2 - 24.5, cardSprite.getContentSize().height - 33);
                    } else {
                        hucardSprite = new cc.Sprite(res.hupaitip_jiao);
                        hucardSprite.setPosition(cardSprite.getContentSize().width / 2 - 24.5, cardSprite.getContentSize().height - 33);
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
            network.removeListeners([
                3002, 3003, 3004, 3005, 3008, 3200,
                4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200
            ]);

            /*----------------------- 比赛场 ----------------------- */
            if (gameData.matchId) {
                cc.eventManager.removeListener(this.list_getRank);
                cc.eventManager.removeListener(this.list_getRankList);
                cc.eventManager.removeListener(this.list_putMatchRecord);
            }
            /*----------------------- 比赛场 ----------------------- */
            cc.Layer.prototype.onExit.call(this);

            console.log("malayer  exit")
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
            for (var i = 0, j = 2; i < players.length; i++, j++) {
                var player = players[i];
                var k = {
                    4: {'0': 0, '1': 3, '2': 2, '3': 1},
                    3: {'0': 1, '1': 3, '2': 2},
                    2: {'0': 2, '1': 0}
                }[playerNum][j % playerNum];

                $('info' + k).setVisible(true);
                $('info' + k + '.lb_nickname').setString(ellipsisStr(player['nickname'], (k == 0 || k == 2 ? 7 : 5)));
                $('info' + k + '.lb_score').setString(roomState == ROOM_STATE_CREATED ? 1000 : player['score'] + 1000);
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    $('info' + k + '.lb_score').setString(roomState == ROOM_STATE_CREATED ? 0 : player['score']);
                }
                /*----------------------- 比赛场 ----------------------- */
                if (roomState == ROOM_STATE_CREATED)
                    $('info' + k + '.ok').setVisible(!!player['ready']);
                if (k != 2 && gameData.uid == gameData.ownerUid && that.getRoomState() == ROOM_STATE_CREATED) {
                    $('info' + k + '.ti').setVisible(true);
                }
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
            }

            if (playerNum == 3) {
                $('info0').setVisible(false);
                $('row1').y = 242; // todo 这里暂时写死
                $('row3').y = 135; // todo 这里暂时写死
            }

            if (playerNum == 2) {
                $('info1').setVisible(false);
                $('info3').setVisible(false);
            }

            if (gameData.uid == gameData.ownerUid) {
                if (players.length < playerNum) {
                    $('btn_yxks').setVisible(false);
                } else if (that.getRoomState() == ROOM_STATE_CREATED) {
                    $('btn_yxks').setVisible(true);
                }
            }

            if (players.length < playerNum) {
                this.setInviteBtn(gameData.loginType != 'yk' && !isReplay);
            } else if (that.getRoomState() == ROOM_STATE_CREATED) {
                this.setInviteBtn(false);
            }

            // if (players.length >= playerNum && roomState == ROOM_STATE_CREATED) {
            //     setTimeout(function () {
            //         if (that && cc.sys.isObjectValid(that) && players.length >= playerNum && !isReplay && roomState == ROOM_STATE_CREATED) {
            //             network.disconnect();
            //         }
            //     }, 4000);
            // }
            /*----------------------- 比赛场 ----------------------- */
            if(gameData.matchId){
                this.setInviteBtn(false);
            }
            if(gameData.matchId)
                console.log("GPS close");
                return;
            that.setupPlayers();
            /*----------------------- 比赛场 ----------------------- */

        },
        setInviteBtn: function(status){
            $("btn_invite").setVisible(status);
            $("btn_inviteLiaobei").setVisible(status);
            $("btn_inviteXianLiao").setVisible(status);
            $("btn_copy").setVisible(status);
            if(window.inReview){
                $("btn_invite").setVisible(false);
                $("btn_inviteLiaobei").setVisible(false);
                $("btn_inviteXianLiao").setVisible(false);
                $("btn_copy").setVisible(false);
            }
        },
        calcPosConf: function () {
            if (window.posConf) {
                posConf = window.posConf;
                return;
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

                if (row == 0) posConf.groupWidth[0] = b0.getPositionX() + b0.getContentSize().width / 2 - (b2.getPositionX() - b2.getContentSize().width / 2);
                if (row == 2) posConf.groupWidth[2] = b2.getPositionX() + b2.getContentSize().width / 2 - (b0.getPositionX() - b0.getContentSize().width / 2);
                if (row == 1) posConf.groupHeight[1] = b2.getPositionY() + b2.getContentSize().height / 2 - (b0.getPositionY() - b0.getContentSize().height / 2);
                if (row == 3) posConf.groupHeight[3] = b0.getPositionY() + b0.getContentSize().height / 2 - (b2.getPositionY() - b2.getContentSize().height / 2);

                var ltqp = $('info' + row + '.qp');
                posConf.ltqpPos[row] = ltqp.getPosition();
                posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                posConf.ltqpEmojiSize[row] = cc.size({0: 80, 1: 90, 2: 84, 3: 100}[row], posConf.ltqpRect[row].height);
                ltqp.removeFromParent();
            }
            window.posConf = posConf;
        },
        ctor: function (_data, _isReplay) {
            this._super();
            isAutoSendPai=false;
            window.posConf = null;
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

            loadCCSTo(res.MaScene_json, this, "Scene");

            var sceneid = cc.sys.localStorage.getItem('sceneid') || 0;
            this.initBG(sceneid);

            if (!cc.sys.isNative)
                // this.initTestFapai();

            return true;
        },

        initTestFapai: function () {
            var that = this;
            var test = new cc.Sprite('res/chat/chat_lan.png');
            test.setPosition(cc.p(500, 700));
            that.addChild(test);
            TouchUtils.setOnclickListener(test, function () {
                that.addChild(new testFaPaiLayer());
            });
        },

        initBG: function (sceneid) {
            var sceneid = cc.sys.localStorage.getItem('sceneid_majiang') || 0;
            var bg = $("bg");
            bg.setTexture(res["table_majiang_back" + sceneid + "_jpg"]);
        },
        changePaibei: function (paibeiid) {
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.pai0plist);
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.pai1plist);
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
            if (this.timeUpdater || isReplay) {
                return;
            }
            var that = this;
            var lbTime = $("lb_time");
            var battery = $("battery");
            var updTime = function () {
                if (!that || !cc.sys.isObjectValid(that))
                    return;
                var date = new Date();
                var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
                var hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
                lbTime.setString(hours + ":" + minutes);
                var level = DeviceUtils.getBatteryLevel();
                //根据百分比更新图片内容
                if (cc.sys.isObjectValid(battery)) {
                    if (level > 75) {
                        battery.setTexture(BatteryTextures["battery5"]);
                    } else if (level > 50) {
                        battery.setTexture(BatteryTextures["battery4"]);
                    } else if (level > 25) {
                        battery.setTexture(BatteryTextures["battery3"]);
                    } else if (level > 10) {
                        battery.setTexture(BatteryTextures["battery2"]);
                    } else {
                        battery.setTexture(BatteryTextures["battery1"]);
                    }
                }


                //battery.setPercent(level);
            };
            updTime();
            this.timeUpdater = setInterval(updTime, 1000);
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
            /*----------------------- 比赛场 ----------------------- */
            if (gameData.matchId) {
                $('timer2').setVisible(false);
                $('timer3').setVisible(true);
                $('timer4').setVisible(true);
            }
            /*----------------------- 比赛场 ----------------------- */
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
                for (var i = 0; i < 14; i++) {
                    var pai = this.getPai(2, i);
                    var userData = pai.getUserData();
                    if (row == 2/* && !disabledChuPaiIdMap[userData.pai]*/) {
                        userData.isLiang = true;
                        Filter.remove(pai);
                    }
                    else {
                        userData.isLiang = false;
                        Filter.grayMask(pai);
                    }
                }
            }

            if (row == 2)
                this.upPai(2, -1);
            this.hideTip();
            gameData.huTipData = null;
        },
        setPai: function (row, idx, val, isLittle, isStand, isVisible) {
            var pai = this.getPai(row, idx);
            if ((mapId == MAP_ID.ZHUANZHUAN || mapId == MAP_ID.HONGZHONG || mapId == MAP_ID.HONGZHONG_MATCH) && gameData.playerNum > 2) {
                var lb = pai.getChildByName('lb');
                if (row == 2 && val == 32) {
                    if (!lb) {
                        lb = new cc.Sprite(res.lb_lai);
                        lb.setTexture(lb_lai);
                        lb.setName('lb');
                        pai.addChild(lb);
                        lb.setPosition(14.8, 16.5);
                    }
                    // else
                    //     lb.setTexture(lb_lai);
                    lb.setVisible(true);
                }
                else if (lb) {
                    lb.setVisible(false);
                }
            }

            var userData = pai.getUserData();
            var paiName = getPaiNameByRowAndId(row, val, isLittle, val > 0 ? false : (isReplay || roomState == ROOM_STATE_ENDED ? false : isStand));
            userData.pai = val;
            setSpriteFrameByName(pai, paiName, 'majiang/pai');
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
                    // narrow.runAction(cc.rotateTo(0, posConf.huFromAngle[row]));
                    var rotation = posConf.huFromAngle[row];
                    console.log(rotation);
                    narrow.setRotation(rotation);
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
            setSpriteFrameByName(pai, paiName, 'majiang/pai');
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
            if (amount < 13 || amount > 14 && (!isAutoSendPai))
                alert("你的牌数量可能不对: " + amount + ", 数一下");
        },
        recalcPos: function (row) {
            var g0 = $('row' + row + '.g' + 0);
            var g0b0pos = getPositionRelativeToParent(this.getGPai(row, 0, 0), 2);
            for (var i = 1; i < 4; i++) {
                var g = $('row' + row + '.g' + i);
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
                var userData = a.getUserData();
                if (row == 0) a.setPosition(a0.getPositionX() + i * posConf.paiADistance[row] + (a.getUserData().pai > 0) * i * posConf.paiALiangDistance[row], a0.getPositionY());
                if (row == 2) {
                    a.setPositionX(a0.getPositionX() + i * posConf.paiADistance[row] + (a.getUserData().pai > 0) * i * posConf.paiALiangDistance[row]);
                    if (!userData.isUpping && !userData.isDowning)
                        a.setPositionY(userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY);
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
                        setSpriteFrameByName(pai, paiName, 'majiang/pai');
                        pai.setVisible(true);
                        return pai;
                    }
                }
            }
        },
        removeOneTopUsedPai: function (row, paiId) {
            for (var j = 23; j >= 0; j--) {
                var pai = $('row' + row + '.c0.b' + j);
                if (pai && pai.isVisible()) {
                    var userData = pai.getUserData();
                    if (!_.isUndefined(paiId) && userData.pai != paiId)
                        return;
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
            var that = this;
            var arr = decodeURIComponent(gameData.wanfaDesp).split(',');
            // if (arr.length >= 1)
            //     arr = arr.slice(1);
            var wanfaStr = arr.join(",");
            if (state == ROOM_STATE_CREATED) {
                $('btn_control_btns').setVisible(false);
                this.hideControlBtns();
                $('signal').setVisible(false);
                $('setting').setVisible(false);
                $('chat').setVisible(false);
                $('timer').setVisible(false);
                $('timer2').setVisible(false);
                // $('btn_xianliao').setVisible(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid);
                this.setInviteBtn(gameData.loginType != 'yk' && gameData.uid == gameData.ownerUid);
                $('btn_fanhui').setVisible(gameData.uid != gameData.ownerUid);
                $('btn_jiesan').setVisible(gameData.uid == gameData.ownerUid);
                $('btn_zhunbei').setVisible(false);
                $('btn_mic').setVisible(!window.inReview);
                $('lb_roomid').setString(gameData.roomId);
                $('lb_wanfa').setString(wanfaStr);
                $('lb_roomid').setVisible(true);
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

                that.createVideoView();

                lianging = false;
                afterLianging = false;
                /*----------------------- 比赛场 ----------------------- */
                $('paiming').setVisible(false);
                $('btn_auto').setVisible(false);
                if (gameData.matchId) {
                    $('safenode').setVisible(false);
                    $('btn_fanhui').setVisible(false);
                    $('bsks').setVisible(true);
                    $('lb_roomid').setVisible(false);
                    $('lb_roomid_').setVisible(false);
                    $('btn_mic').setVisible(false);

                }
                /*----------------------- 比赛场 ----------------------- */
            }
            if (state == ROOM_STATE_ONGOING) {
                var setting = $('setting');
                if (!setting || !cc.sys.isObjectValid(setting))
                    return network.disconnect();
                // setting.setVisible(true);
                $('btn_control_btns').setVisible(!isReplay);
                $('signal').setVisible(!isReplay);
                // $('chat').setVisible(true);
                $('timer').setVisible(true);
                $('timer2').setVisible(true);
                // $('btn_xianliao').setVisible(false);
                this.setInviteBtn(false);
                // $('btn_qq').setVisible(false);
                $('btn_fanhui').setVisible(false);
                $('btn_jiesan').setVisible(false);
                $('btn_zhunbei').setVisible(false);
                $('btn_yxks').setVisible(false);
                $('btn_mic').setVisible(!window.inReview);
                $('lb_roomid').setString(gameData.roomId);
                $('lb_wanfa').setString(wanfaStr);
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

                $('row0.mid').removeAllChildren();
                $('row1.mid').removeAllChildren();
                $('row2.mid').removeAllChildren();
                $('row3.mid').removeAllChildren();

                for (var i = 0; i < 4; i++) {
                    if (roomState == ROOM_STATE_CREATED)
                        $('info' + i).runAction(cc.sequence(
                            cc.moveTo(0.5, posConf.headPosBak[i]),
                            cc.delayTime(1.0),
                            cc.callFunc(that.createVideoView())));
                    else
                        $('info' + i).setPosition(posConf.headPosBak[i]);

                    $('info' + i + '.ok').setVisible(false);
                    $('info' + i + '.ti').setVisible(false);
                }

                if (isReplay) {
                    $('setting').setVisible(false);
                    $('chat').setVisible(false);
                    $('btn_auto').setVisible(false);/*----------------------- 比赛场 ----------------------- */
                }

                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    $('paiming').setVisible(true);
                    $('bsks').setVisible(false);
                    $('timer2').setVisible(false);
                    $('timer3').setVisible(true);
                    $('timer4').setVisible(true);
                    $('safenode').setVisible(false);
                    $('lb_roomid').setVisible(false);
                    $('lb_roomid_').setVisible(false);
                    $('btn_mic').setVisible(false);

                    var matchInfo = gameData.matchInfo;
                    var stage = matchInfo['stage'];
                    var tstage = matchInfo['stage_total'];

                    var mtype = matchInfo['stage_type'] || 1;
                    var tround = gameData.totalRound;

                    cc.log('tround is====================', tround);
                    var cround = gameData.curRound;
                    cc.log('cround is====================', cround);
                    $('timer4.Text_2').setString(stage + '/' + tstage);
                    $('timer4.Text_4').setString(cround + '/' + tround);
                    $('timer3.Text_5').setString(gameData.baseScore);

                    var str = '打立出局';
                    if (mtype == 2) {
                        str = '定局积分';
                    }
                    $('timer4.Text_1').setString(str);
                }
                /*----------------------- 比赛场 ----------------------- */
            }
            if (state == ROOM_STATE_ENDED) {
                $('timer').setVisible(false);
                $('timer2').setVisible(false);
                /*----------------------- 比赛场 ----------------------- */
                $('timer3').setVisible(false);
                $('timer4').setVisible(false);
                /*----------------------- 比赛场 ----------------------- */
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
                that.setHuTipVisible(false);
            }

            $('cpghg').setVisible(false);
            $('timer').setVisible(false);
            /*----------------------- 比赛场 ----------------------- */
            $('timer3').setVisible(false);
            $('timer4').setVisible(false);
            /*----------------------- 比赛场 ----------------------- */
            //this.recalcPos(2);

            if (isReconnect) {
                hasChupai = reconnectData['has_chu'];
                that.setZhuang(uid2position[gameData.zhuangUid]);
                leftPaiCnt = reconnectData['left_pai_num'];
                $('timer2.Text_2').setString(leftPaiCnt);
                var playerPaiArr = reconnectData['player_pai'];
                for (var i = 0; i < playerPaiArr.length; i++) {
                    var playerPai = playerPaiArr[i];
                    var isOffline = !!playerPai['is_offline'];
                    if (isOffline)
                        this.playerOnloneStatusChange(uid2position[playerPai.uid], isOffline);
                    var row = uid2position[playerPai.uid];
                    if (row != 2
                        && roomState == ROOM_STATE_ONGOING
                        && playerPai['pai_arr'].length == 0) {
                        for (var j = 0; j < playerPai['cur_pai_num']; j++)
                            playerPai['pai_arr'].push(0);
                    }
                    if (row == 2 && playerPaiArr[i]['is_ting']) {
                        afterLianging = true;
                    }
                    if ($('info' + row + '.liang'))
                        $('info' + row + '.liang').setVisible(playerPaiArr[i]['is_ting']);
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

                    var isZixuanpiao = !!playerPaiArr[i]['is_zixuanpiao'];
                    var isSpf = !!playerPaiArr[i]['spf'];
                    var piao = playerPai['piao'] || 0;

                    var spBs = $('info' + row + '.sp_piao');
                    if (spBs) {
                        spBs.setVisible(isZixuanpiao&&isSpf);
                        if (piao == 0) {
                            spBs.setString('不飘');
                        } else {
                            spBs.setString('飘' + piao + '分');
                        }
                    }
                    this.createVideoView();
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

                var isSelectPiaoFinished = (_.isUndefined(playerPaiArr[0]['spf']) ? true : playerPaiArr[0]['spf']);
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
            $('hu_type_layer').setVisible(false);
            /*----------------------- 比赛场 ----------------------- */
            gameData.data4004 = null;
            /*----------------------- 比赛场 ----------------------- */
            // for (var i = 0; i < 4; i++)
            //     if (i != 0)
            //         for (var j = 1; j <= 25; j++)
            //             this.addUsedPai(i, j);
        },
        sendChuPai: function (row, idx, paiId) {
            network.stop([3007, 3008, 4002, 4020 , 4990]);
            network.send(4002, {room_id: gameData.roomId, pai_id: paiId, idx: idx});

            //听牌提示
            this.HuCardTip(null, null, false);
            if(this.hupaiTipData){
                var hupaiCards = this.hupaiTipData["" + paiId];
                // console.log(hupaiCards);
                if(hupaiCards && hupaiCards.length > 0){
                    this.initHuPaiTishiLayer(hupaiCards);
                }else{
                    var hupai_tip = $('hupai_tip');
                    hupai_tip.setVisible(false);
                }
            }

            hasChupai = true;
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

            if (liangStep == 2) {
                liangStep = 0;
                // network.start();
                that.downPai(row, idx);
                return;
            }

            if (row != 2 && !isReplay)
                idx = 13;

            this.playEffect('vCardOut');

            var duration = 0.25;
            var delayDuration = 0.65;

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

            var _paiBg = new cc.Sprite(res.mjbg);
            _paiBg.setScale(CHUPAI_MID_NODE_SCALE_MAP[row] / midNode.getParent().getScaleX());
            _paiBg.setName('paiBg');
            _paiBg.setOpacity(188);
            midNode.addChild(_paiBg);

            var _pai = new cc.Sprite();
            _pai.setName('pai');
            midNode.addChild(_pai);

            var paiName = getPaiNameByRowAndId(2, paiId, false, false);
            setSpriteFrameByName(_pai, paiName, 'majiang/pai');
            _pai.setScale(CHUPAI_MID_NODE_SCALE_MAP[row] / midNode.getParent().getScaleX());
            _pai.setVisible(true);
            _paiBg.setVisible(true);
            var fangda = cc.sys.localStorage.getItem('fangda') == 1;
            if (fangda) {
                // _pai.runAction(cc.sequence(cc.delayTime(delayDuration), cc.callFunc(function () {
                //     _pai.removeFromParent(true);
                //     _paiBg.removeFromParent(true);
                // })));
                setTimeout(function () {
                    _pai.removeFromParent(true);
                    _paiBg.removeFromParent(true);
                },delayDuration);
            } else {
                _pai.removeFromParent(true);
                _paiBg.removeFromParent(true);
            }
            that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), []);

            if (row == 2) {
                pai.setPosition(posConf.paiPos[2][idx]);
                pai.setScale(posConf.paiA0ScaleBak[row][0], posConf.paiA0ScaleBak[row][1]);
                that.upPai(row, -1);
                that.recalcPos(row);
                that.showArrow(usedPai, row);

                that.checkPaiAmount();
            }
            else {
                pai.setPosition(positionBak);
                pai.setScale(scaleBak);

                that.setPaiArrOfRow(row, paiArr, (row != 2), (row != 2), liangPaiArr);
                that.recalcPos(row);
                that.showArrow(usedPai, row);
            }

            usedPai.runAction(cc.fadeIn(duration));

            network.start();

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
                        cc.moveTo(UP_PAI_TIME, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                        , cc.callFunc(function () {
                            userData.isUp = false;
                            userData.isDowning = false;
                        })
                    ));
                }
                else if (!userData.isUpping) {
                    userData.isUpping = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(UP_PAI_TIME, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
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
                            cc.moveTo(UP_PAI_TIME, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                            , cc.callFunc(function () {
                                userData.isUp = true;
                                userData.isUpping = false;
                            })
                        ));
                    }
                    else if (idx != j && userData.isUp && !userData.isDowning) {
                        userData.isDowning = true;
                        pai.runAction(cc.sequence(
                            cc.moveTo(UP_PAI_TIME, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
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
                cc.moveTo(UP_PAI_TIME, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                , cc.callFunc(function () {
                    userData.isUp = false;
                    userData.isDowning = false;
                })
            ));
        },
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
                    if (hasChupai || !that.isMyTurn() || afterLianging || disableChupai || roomState != ROOM_STATE_ONGOING)
                        return;

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

                    if ((curPaiIdx >= 0 && _curPaiIdx != curPaiIdx) || !(pai.getNumberOfRunningActions() == 0 || !pai.getUserData().isUpping && !pai.getUserData().isDowning))
                        return false;

                    curPaiIdx = _curPaiIdx;

                    if (curPaiIdx >= 0) {
                        var userData = pai.getUserData();

                        for (var k = 0; k < 14; k++)
                            if (that.getPai(2, k).getNumberOfRunningActions() > 0)
                                return false;
                        if (gameData.huTipData) {
                            that.showTishiTip(gameData.huTipData);
                            // console.log("333");
                        }
                        that.playEffect('vCardClick');

                        beganTime = getCurrentTimeMills();

                        // back up
                        userData.positionBak = pai.getPosition();
                        userData.scaleBak = pai.getScaleX();

                        isUp = userData.isUp;
                        if (!isUp || liangStep == 2)
                            that.upPai(2, userData.idx);

                        // if (userData.hucards) {
                        //     var jiaoSp = pai.getChildByName('hucardSprite');
                        //     if (jiaoSp && jiaoSp.isVisible())
                        //         that.HuCardTip(userData.hucards, pai.getPositionX(), true);
                        // }
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
                            return;
                        }
                        p = pai.convertToNodeSpace(touch.getLocation());
                        p.x += pai.getPositionX() - pai.getBoundingBox().width / 2;
                        p.y += pai.getPositionY() - pai.getBoundingBox().height / 2;
                        //that.setPai(2, 15, userData.pai);
                        pai.setPosition(p);
                    }
                },
                onTouchEnded: function (touch, event) {
                    // that.HuCardTip(null, null, false);
                    if (curPaiIdx < 0)
                        return;

                    var pai = that.getPai(2, curPaiIdx);
                    var userData = pai.getUserData();

                    if (userData.hucards) {
                        var jiaoSp = pai.getChildByName('hucardSprite');
                        if (jiaoSp && jiaoSp.isVisible())
                            that.HuCardTip(userData.hucards, pai.getPositionX(), true);
                    }else{
                        that.HuCardTip(null, null, false);
                    }

                    if (beganPosition) {
                        var p = touch.getLocation();
                        p.x -= toNodeDelta.x;
                        p.y -= toNodeDelta.y;
                        var now = getCurrentTimeMills();
                        var isSend = (p.y < safeY && isUp && Math.abs(now - beganTime) < 168) || (p.y > safeY);
                        if (isSend) {
                            if (liangStep == 0 && hideGangStep == 0) {
                                that.HuCardTip(null, null, false);
                                that.sendChuPai(2, paiIdx, paiId);
                                that.setHuTipVisible(false);
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
        setPaiArrOfRow: function (row, paiArr, isLittle, isStand, liangPaiArr, liangAll, huPaiId) {
            liangPaiArr = liangPaiArr || [];
            if (isReplay || roomState == ROOM_STATE_ENDED) {
                liangPaiArr = [];
            }
            if (row == 2)
                _.pull(paiArr, 0);
            paiArr.sort(compareTwoNumbers);
            if (mapId == MAP_ID.ZHUANZHUAN || mapId == MAP_ID.HONGZHONG || mapId == MAP_ID.HONGZHONG_MATCH) {
                var oldSize = paiArr.length;
                _.pull(paiArr, 32);
                if (paiArr.length != oldSize) {
                    var t = paiArr.length;
                    for (var j = 0; j < oldSize - t; j++)
                        paiArr.splice(0, 0, 32);
                }
            }

            if (huPaiId) {
                var idx = paiArr.indexOf(huPaiId);
                if (idx >= 0) {
                    paiArr.splice(idx, 1);
                    paiArr.push(huPaiId);
                }
            }
            var lastPai = null;
            for (var j = 0; j < paiArr.length; j++) {
                lastPai = this.setPai(row, j, paiArr[j], isLittle, isStand, true);
                lastPai.setOpacity(255);
            }
            for (; j < 14; j++)
                this.setPai(row, j, 0, isLittle, isStand, false);
            liangPaiArr.sort(compareTwoNumbers);
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
                }
                else {
                    if (row == 1)
                        for (var j = 0; j < liangPaiArr.length; j++)
                            this.setPai(row, j, liangPaiArr[j], isLittle, isStand, true);
                    if (row == 3)
                        for (var j = 0; j < liangPaiArr.length; j++)
                            this.setPai(row, paiArr.length - liangPaiArr.length + j, liangPaiArr[j], isLittle, isStand, true);
                }
            }
            else if (false && disabledChuPaiIdMap) {
                for (var i = 0; i < paiArr.length; i++) {
                    if (disabledChuPaiIdMap[paiArr[i]]) {
                        var pai = this.getPai(2, i);
                        Filter.grayMask(pai);
                        pai.getUserData().isLiang = false;
                    }
                }
            }
            if (huPaiId) {
                lastPai.setOpacity(168);
                this.recalcPos(row);
            }
        },
        mopai: function (row, paiId, paiArr, liangPaiArr) {
            if (row == 2) {
                hasChupai = false;
                this.setPaiArrOfRow(2, paiArr, false, false, liangPaiArr);
            }

            var that = this;
            var func = function () {
                that.throwTurn(row);
                if (row == 2)
                    that.recalcPos(2);
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    that.countDown(gameData.playTime);
                }
                else{
                    that.countDown(12);
                }
                /*----------------------- 比赛场 ----------------------- */
            };
            if (row == 2) {
                network.stop([3008, 4020]);
                var pai = this.setPai(row, 13, (row == 2 || isReplay ? paiId : 0), (row != 2), (row != 2), false);
                pai.setOpacity(255);
                var animPai = duplicateSprite(pai);
                animPai.setVisible(true);
                pai.getParent().addChild(animPai);
                animPai.y += 30;
                animPai.runAction(cc.sequence(
                    cc.moveBy(0.1, 0, -25).easing(cc.easeIn(1.5)),
                    // cc.moveBy(0.05, 0, 15),
                    cc.moveBy(0.05, 0, -5),
                    cc.callFunc(function () {
                        network.start();
                        animPai.removeFromParent();
                        pai.setVisible(true);
                        pai.setOpacity(255);
                        func();
                    })
                ))
            } else {
                this.setPai(row, 13, (row == 2 || isReplay ? paiId : 0), (row != 2), (row != 2), true)
                    .runAction(cc.fadeIn(MOPAI_ANIM_DURATION));
                func();
            }
        },
        showChiPengGangHu: function (row, paiId, chi, peng, gang, hu, ting, data) {
            var that = this;

            if (!isReplay) {
                var _opPaiIdArr = {};

                var children = $('cpghg').getChildren();
                for (var i = 0; i < children.length; i++) {
                    children[i].setVisible(false);
                }

                if (mapId == MAP_ID.CHANGSHA) {
                    if (!gang) {
                        var nextGang = data['next_gang'];
                        if (nextGang) {
                            _opPaiIdArr[OP_GANG] = nextGang;
                            _opPaiIdArr[OP_TING] = nextGang;
                            gang = 1;
                        }
                    }

                    ting = gang;
                }

                var sum = (chi || 0) + (peng || 0) + (gang || 0) + (hu || 0) + (ting || 0) + 1;

                $('cpghg.chi').setVisible(false);
                $('cpghg.peng').setVisible(false);
                $('cpghg.gang').setVisible(false);
                $('cpghg.hu').setVisible(false);
                $('cpghg.ting').setVisible(false);
                var nodeArr = [], opArr = [];
                if (chi) {
                    nodeArr.push($('cpghg.chi'));
                    opArr.push(OP_CHI);
                }
                if (peng) {
                    nodeArr.push($('cpghg.peng'));
                    opArr.push(OP_PENG);
                }
                if (gang) {
                    nodeArr.push($('cpghg.gang'));
                    opArr.push(OP_GANG);
                }
                if (hu) {
                    nodeArr.push($('cpghg.hu'));
                    opArr.push(OP_HU);
                }
                if (ting) {
                    nodeArr.push($('cpghg.ting'));
                    opArr.push(OP_TING);
                }
                nodeArr.splice(0,0,$('cpghg.guo'));
                opArr.splice(0,0,0);
                //nodeArr.push($('cpghg.guo'));

                for (var i = 0; i < nodeArr.length; i++) {
                    if (nodeArr[i].getName() != "guo") {
                        var node = $('a', nodeArr[i]);
                        if (!node) {
                            var node = duplicateSprite($('row2.c0.b0'));
                            node.setName('a');
                            node.setPosition($('n', nodeArr[i]).getPosition());
                            node.setVisible(true);
                            nodeArr[i].addChild(node);
                        }
                        var _paiId = _opPaiIdArr[opArr[i]] || paiId;
                        var paiName = getPaiNameByRowAndId(2, _paiId, true);
                        setSpriteFrameByName(node, paiName, 'majiang/pai');
                        node.setUserData({paiId: _paiId});
                    }

                    // if (typeof posConf.cpghgPositionX[sum][i] === 'number')
                    //     nodeArr[i].setPositionX(posConf.cpghgPositionX[sum][i]);
                    // else
                    //     nodeArr[i].setPosition(posConf.cpghgPositionX[sum][i]);

                    if (nodeArr.length > 5) {
                        nodeArr[i].setPositionX(1100 - (i % 5) * 240);
                        nodeArr[i].setPositionY(i < nodeArr.length % 5 ? 400.00 : 214);
                    }
                    else {
                        nodeArr[i].setPositionX(1100 - (i % 5) * 240);
                        nodeArr[i].setPositionY(214);
                    }

                    nodeArr[i].setVisible(true);
                }

                if (mapId == MAP_ID.CHANGSHA && ting) {
                    $('cpghg.ting').setTexture(res.bu);
                }


                chi && TouchUtils.setOnclickListener($('cpghg.chi'), function () {
                    var _paiId = $('cpghg.chi.a').getUserData().paiId || paiId;
                    that.showChiLayer(_paiId, function (paiId, oriPaiId) {
                        that.sendChiPengGang(OP_CHI, 2, paiId, oriPaiId);
                    });
                });

                peng && TouchUtils.setOnclickListener($('cpghg.peng'), function () {
                    var _paiId = $('cpghg.peng.a').getUserData().paiId || paiId;
                    that.sendChiPengGang(OP_PENG, 2, _paiId);
                    that.hideChiPengGangHu();
                });

                ting && TouchUtils.setOnclickListener($('cpghg.ting'), function () {
                    var _paiId = $('cpghg.ting.a').getUserData().paiId || paiId;
                    if (mapId == MAP_ID.CHANGSHA) {
                        that.sendChiPengGang(OP_GANG, 2, _paiId);
                        that.hideChiPengGangHu();
                    }
                });

                hu && TouchUtils.setOnclickListener($('cpghg.hu'), function () {
                    var _paiId = $('cpghg.hu.a').getUserData().paiId || paiId;
                    do {
                        if (mapId == MAP_ID.CHANGSHA) {
                            if (selectingXiaohu && leftPaiCnt == 55) {
                                that.sendChiPengGang(OP_XIAOHU, 2, _paiId);
                                that.hideChiPengGangHu();
                                break;
                            }
                        }

                        that.sendChiPengGang(OP_HU, 2, _paiId);
                        that.hideChiPengGangHu();
                    } while (false);
                });

                gang && TouchUtils.setOnclickListener($('cpghg.gang'), function () {
                    var _paiId = $('cpghg.gang.a').getUserData().paiId || paiId;
                    if (mapId == MAP_ID.CHANGSHA) {
                        var isKaigang = data['kaigang'];
                        if (!isKaigang) {
                            alert2("确定要【开杠】吗?", function () {
                                that.sendChiPengGang(OP_KAIGANG, 2, _paiId);
                                that.hideChiPengGangHu();
                            }, function () {
                            });
                        }
                        else {
                            that.sendChiPengGang(OP_KAIGANG, 2, _paiId);
                            that.hideChiPengGangHu();
                        }
                    }
                    else {
                        that.sendChiPengGang(OP_GANG, 2, _paiId);
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
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    this.countDown(gameData.playTime);
                }
                else{
                    this.countDown(12);
                }
                /*----------------------- 比赛场 ----------------------- */
            } else {
                var cpg = $('cpghRep' + row);
                for (var i = 0; i < 6; i++) {
                    if (!cpg.getChildByName("sp1_" + i)) {
                        var sp = new cc.Sprite("res/image/ui/cpghRep/sp1_" + i + ".png");
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
                setSpriteFrameByName(pai, paiName, 'majiang/pai');
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
                        var sp = new cc.Sprite("res/image/ui/majiang/cpghRep/sp1_" + i + ".png");
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
                setSpriteFrameByName(pai, paiName, 'majiang/pai');
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
            var textureName = isZimo ? 'zimo2.png' : {
                1: 'chi2.png'    // chi
                , 2: 'peng2.png'
                , 3: 'gang2.png'
                , 4: 'hu2.png'
                , 6: 'ting2.png'
                , 7: 'liang2.png'
            }[op];
            if ($('info_n' + row).children.length != 0)
                $('info_n' + row).removeAllChildren();
            var sprite = new cc.Sprite('res/image/ui/majiang/maScene/' + textureName);
            $('info_n' + row).addChild(sprite);
            sprite.setScale(1.5);
            var duraction = 0.5;
            sprite.runAction(cc.sequence(
                cc.delayTime(duraction)
                ,cc.scaleTo(0.1, 1, 1)
                ,cc.fadeOut(0.1)
                //cc.fadeOut(0.1)
                // cc.scaleTo(duraction, 1.5, 1.5).easing(cc.easeExponentialOut())
                // , cc.spawn(
                //     cc.scaleTo(0.1, 0.80, 0.80)
                //     , cc.fadeOut(0.1)
                // )
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
                        if (dui.type == 1) this.setGChi(row, j, dui['pai_arr']);
                        if (dui.type == 2) this.setGPeng(row, j, dui['pai_arr'][0], dui['from_uid']);
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
                    for (var j = 0; j < 100; j++) {
                        var pai = $('row' + row + '.c0.b' + j);
                        if (pai)
                            pai.setVisible(false);
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

                var touch_sp0 = new cc.Sprite("res/image/ui/majiang/cpghRep/touch0.png");
                var touch_sp1 = new cc.Sprite("res/image/ui/majiang/cpghRep/touch1.png");
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

                if (!isZimo)
                    this.removeOneTopUsedPai(fromRow, paiId);
                this.playChiPengGangHuAnim(row, op, isZimo);
                if (gameData.mapId != MAP_ID.CHANGSHA) {
                    playEffect(isZimo ? 'vzimo' : 'vhu_pao', position2sex[row]);
                }
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
            if (op == OP_HU)
                curHuPaiId = paiId;
            this.setPaiArrOfRow(row, _paiArr, (row != 2), (op != OP_HU), liangPaiArr, false, curHuPaiId);

            if (op == OP_HU && _.isObject(data['player'])) {
                var playerMap = data['player'];
                for (var uid in playerMap) {
                    var tRow = uid2position[uid];
                    var tPaiArr = playerMap[uid]['pai_arr'];
                    var tDuiArr = playerMap[uid]['dui_arr'];
                    if (tRow != 2) {
                        for (var i = 0; i < tPaiArr.length; i++)
                            tPaiArr[i] = 0;
                    }
                    this.setDuiArr(tRow, tDuiArr);
                    this.setPaiArrOfRow(tRow, tPaiArr, (tRow != 2), (tRow != 2));
                    this.recalcPos(tRow);
                }
            }

            if (op != OP_HU) {
                this.setPai(row, 13, 0);
                this.getPai(row, 13).runAction(cc.fadeOut(0));
            }
            this.recalcPos(row);

            this.checkPaiAmount();
        },
        fapai: function (paiArr) {
            _.pull(paiArr, 0);
            paiArr.sort(compareTwoNumbers);
            // if (mapId == MAP_ID.ZHUANZHUAN) {
            //     var oldSize = paiArr.length;
            //     _.pull(paiArr, 32);
            //     if (paiArr.length != oldSize) {
            //         var t = paiArr.length;
            //         for (var j = 0; j < oldSize - t; j++)
            //             paiArr.splice(0, 0, 32);
            //     }
            // }
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
            curHuPaiId = 0;
            this.HuCardTip(null, 0, false);
        },
        jiesuan: function (data) {
            var that = this;

            var myScore = 0;
            var players = data.players;
            var fan = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var uid = player['uid'];

                gameData.players[position2playerArrIdx[uid2position[uid]]].score = player['total_score'];
                $('info' + uid2position[uid] + '.lb_score').setString(player['total_score']+1000);
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    $('info' + uid2position[uid] + '.lb_score').setString(player['total_score']);
                }
                /*----------------------- 比赛场 ----------------------- */
                fan = Math.max(fan, player['fan']);

                if (uid == gameData.uid) {
                    myScore = player['score'];
                    continue;
                }
                var row = uid2position[uid];
                var paiArr = player['pai_arr'];
                if (data['hu_type'] == 2 && player['hu'])
                    this.setPaiArrOfRow(uid2position[uid], paiArr, (row != 2), false, [], false, curHuPaiId);
                else
                    this.setPaiArrOfRow(uid2position[uid], paiArr, (row != 2), false);
            }
            if (gameData.mapId == MAP_ID.CHANGSHA) {
                if (fan >= 6) {
                    playEffect('vhu_dfz');
                } else if (data['hu_type'] == HUTYPE_ZIMO) {
                    playEffect('vzimo');
                } else if (data['hu_type'] == HUTYPE_DIANPAO) {
                    playEffect('vhu_pao');
                }
            }

            setTimeout(function () {
                var layer = new Ma_JiesuanLayer(data);
                that.addChild(layer);
                playEffect(myScore >= 0 ? 'vWin' : 'vLose');
            }, 2000);

            $('hupai_tip').setVisible(false);
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

            if (position2playerArrIdx[idx] >= gameData.players.length)
                return;

            var that = this;

            var playerInfo = gameData.players[position2playerArrIdx[idx]];

            var showAniBtn = !gameData.isSelfWatching;
            if(playerInfo == null || playerInfo == undefined){
                if(idx == 1 && gameData.isSelfWatching == false && gameData.isSelfWatching == false){
                    playerInfo = {};
                    playerInfo.uid = gameData.uid;
                    playerInfo.nickname = gameData.nickname;
                    playerInfo.ip = gameData.ip;
                    playerInfo.headimgurl = gameData.headimgurl;
                    playerInfo.sex = gameData.sex;
                }else{
                    playerInfo = this.getWatchUserInfoByUid(uid);
                    playerInfo.uid = playerInfo.User.ID;
                    playerInfo.nickname = playerInfo.User.NickName;
                    playerInfo.ip = playerInfo.User.IP;
                    playerInfo.headimgurl = playerInfo.User.HeadIMGURL;
                    playerInfo.sex = playerInfo.User.Sex;
                    showAniBtn = false;
                }
            }
            //合并成为一个功能块
            this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', !(this.getRoomState() == ROOM_STATE_ONGOING));
            this.addChild(this.playerInfoLayer);

            // var scene = ccs.load(res.PlayerInfo_json,"res/");
            // that.addChild(scene.node);

            // var head = $('root.panel.info.head', scene.node);
            // var lbNickname = $('root.panel.lb_nickname', scene.node);
            // var lbId = $('root.panel.lb_id', scene.node);
            // var lbIp = $('root.panel.lb_ip', scene.node);
            // var lbAD = $('root.panel.lb_ad', scene.node);
            // var lbDt = $('root.panel.lb_dt', scene.node);
            // var male = $('root.panel.male', scene.node);
            // var female = $('root.panel.female', scene.node);
            // var lbLocation = $('root.panel.lb_location', scene.node);
            // lbNickname.setString(ellipsisStr(playerInfo['nickname'], 7));
            // loadImageToSprite(playerInfo['headimgurl'], head);
            // lbId.setString('ID: ' + playerInfo['uid']);
            // lbIp.setString('IP: ' + playerInfo['ip']);
            // if (idx == 2) {
            //     if (gameData.location == 'false')
            //         lbAD.setString('自己' + decodeURIComponent(gameData.locationInfo));
            //     else if (!gameData.location || gameData.location == '') {
            //         lbAD.setString('您可能没有开启定位权限');
            //     }
            //     else
            //         lbAD.setString(decodeURIComponent(gameData.locationInfo));
            // }
            // else {
            //     if (playerInfo['loc'] == 'false')
            //         lbAD.setString('对方' + decodeURIComponent(playerInfo['locCN']));
            //     else
            //         lbAD.setString(decodeURIComponent(playerInfo['locCN']));
            // }
            // if (!gameData.location || playerInfo['loc'] == '' || !playerInfo['loc'] || playerInfo['loc'] == 'false' || gameData.location == 'false') {
            //     lbDt.setVisible(false);
            // }
            // else {
            //     var templocation1 = playerInfo['loc'].split(',');
            //     var otherpeoplelocationlat = templocation1[1];
            //     var otherpeoplelocationlng = templocation1[0];
            //     var templocation2 = gameData.location.split(',');
            //     var mylocationlat = templocation2[1];
            //     var mylocationlng = templocation2[0];
            //     // console.log(otherpeoplelocationlat+':'+otherpeoplelocationlng+':'+mylocationlat+':'+mylocationlng);
            //     if (idx == 2)
            //         lbDt.setVisible(false);
            //     else
            //         lbDt.setVisible(true);
            //     var distance = getFlatternDistance(mylocationlat, mylocationlng, otherpeoplelocationlat, otherpeoplelocationlng);
            //     if (distance >= 1000) {
            //         lbDt.setString('距我 ' + (distance / 1000).toFixed(2) + ' 公里');
            //     }
            //     else {
            //         lbDt.setString('距我 ' + distance + ' 米');
            //     }
            // }
            //
            // // lbLocation.setString('位置: ' + ellipsisStr(gameData.location || "未知位置", 30));
            // male.setVisible(playerInfo.sex == '1');
            // female.setVisible(playerInfo.sex == '2');
            //
            // TouchUtils.setOnclickListener($('root.fake_root', scene.node), function () {
            //     that.removeChild(scene.node);
            // });
            // TouchUtils.setOnclickListener($('root.panel', scene.node), function () {
            // }, {effect: TouchUtils.effects.NONE});
        },
        playerOnloneStatusChange: function (row, isOffline) {
            var offline = $('info' + row + '.offline');
            if (offline && cc.sys.isObjectValid(offline))
                offline.setVisible(!!isOffline);
        },
        playUrlVoice: function (row, type, content, voice) {
            var url = decodeURIComponent(content);
            var arr = null;
            if (url.indexOf('.aac') >= 0) {
                arr = url.split(/\.aac/)[0].split(/-/);
            } else if (url.indexOf('.spx') >= 0) {
                arr = url.split(/\.spx/)[0].split(/-/);
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
                // if (playerNum == 2 && row == 0) {
                //     picIdx = 1;
                //     capInsets = cc.rect(26, 31, 1, 1);
                // }
                scale9sprite = new cc.Scale9Sprite('res/submodules/majiang/image/MaScene/ltqp' + picIdx + '.png', posConf.ltqpRect[row], capInsets);
                scale9sprite.setName('qp9');
                scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : cc.p(0, 0));
                // if (playerNum == 2 && row == 0) {
                //     scale9sprite.setAnchorPoint(cc.p(1, 1));
                // }
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
                    sp = new cc.Sprite('res/image/ui/majiang/maScene/speaker' + i + '.png');
                    sp.setName('speaker' + i);
                    sp.setPosition(posConf.ltqpVoicePos[row]);
                    sp.setFlippedX(row==1);
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
            if (type == 'emoji') {
                scale9sprite.setOpacity(0);
                // scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
                //
                // var sprite = $('emoji', scale9sprite);
                // if (!sprite) {
                //     sprite = new cc.Sprite();
                //     sprite.setName('emoji');
                //     sprite.setScale(0.6);
                //     sprite.setPosition(posConf.ltqpEmojiPos[row]);
                //     scale9sprite.addChild(sprite);
                // }
                // setSpriteFrameByName(sprite, content, 'emoji');
                // sprite.setVisible(true);
                // innerNodes.push(sprite);

                //表情动画
                var index = content.substring(10, 11);
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
            else if (type == 'text') {
                scale9sprite.setOpacity(255);
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
            else if (type == 'voice') {
                scale9sprite.setOpacity(255);
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
            scale9sprite.stopAllActions();
            scale9sprite.setVisible(true);
            scale9sprite.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));
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
            if($('info' + row + '.zhuang'))
                $('info' + row + '.zhuang').setVisible(true);
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
            var ok = $('row' + uid2position[uid] + '.mid.ok');
            if (!ok) {
                ok = duplicateSprite($('info0.ok'));
                ok.setVisible(true);
                ok.setPosition(cc.p(0, 0));
                $('row' + uid2position[uid] + '.mid').addChild(ok);
            }
            if (uid == gameData.uid)
                $('btn_zhunbei').setVisible(false);
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
        initWanfa: function () {
            if (!gameData.wanfaDesp)
                return;
            var arr = decodeURIComponent(gameData.wanfaDesp).split(',');
            var topPosY = cc.winSize.height / 2 + 116;

            var sp_wanfa_Pos = cc.p(0, topPosY);
            var sp_wanfa = new cc.Sprite("res/table/sp_wanfa.png");
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
            this.hideArrow();
            var arrow = pai.getParent().getChildByName('arrow');
            if (!arrow) {
                arrow = new cc.Sprite(res.arrow);
                arrow.setAnchorPoint(0.5, 0);
                arrow.setName('arrow');
                arrow.setLocalZOrder(100);
                pai.getParent().addChild(arrow);
                arrow.setScale(pai.getScale());
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
                arrow.setPosition(pai.getPosition().x, pai.getPosition().y + 35);
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
        showTip: function (content, isShake) {
            isShake = _.isUndefined(isShake) ? true : isShake;
            var scale9sprite = $('top_tip');
            if (!(scale9sprite instanceof cc.Scale9Sprite)) {
                var newScale9sprite = new cc.Scale9Sprite(res.round_rect_91, cc.rect(0, 0, 91, 32), cc.rect(46, 16, 1, 1));
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
            var size = cc.size(text.getVirtualRendererSize().width + 35, scale9sprite.getContentSize().height);
            text.setPosition((text.getVirtualRendererSize().width + 35) / 2, scale9sprite.getContentSize().height / 2);
            scale9sprite.setContentSize(size);
            scale9sprite.setScale(1.2);
            scale9sprite.setVisible(true);
            if (isShake)
                scale9sprite.runAction(cc.sequence(cc.scaleTo(0.2, 1.4), cc.scaleTo(0.2, 1.2)));
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
                var scene = ccs.load(res.ThrowDice_json,"res/");
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
                setSpriteFrameByName(paiA, paiAName, 'majiang/pai');
                setSpriteFrameByName(paiB, paiBName, 'majiang/pai');
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
                    var scene = ccs.load(res.ChiPanel_json,"res/");
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
                        setSpriteFrameByName(pai, paiName, 'majiang/pai');

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
        setHuTipVisible: function (visible) {
            for (var i = 0; i < 14; i++) {
                var cardSprite = this.getPai(2, i);
                if (cardSprite.getChildByName('hucardSprite')) {
                    cardSprite.getChildByName('hucardSprite').stopAllActions();
                    cardSprite.getChildByName('hucardSprite').setVisible(visible);
                }
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
                    var userData = pai.getUserData();
                    userData.hucards = null;
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
        changeBtnStatus: function () {
            $('btn_bg').setVisible(!$('btn_bg').isVisible());
            $('setting').setVisible(!$('setting').isVisible());
            $('chat').setVisible(!$('chat').isVisible());
            $('jiesan').setVisible(!$('jiesan').isVisible());
            $('btn_control_btns').setFlippedY(!$('btn_control_btns').isFlippedY());
            /*----------------------- 比赛场 ----------------------- */
            if(gameData.matchId){
                $('jiesan').setVisible(false);
            }
            /*----------------------- 比赛场 ----------------------- */
        },
        hideControlBtns: function () {
            $('btn_bg').setVisible(false);
            $('setting').setVisible(false);
            $('chat').setVisible(false);
            $('jiesan').setVisible(false);
            $('btn_control_btns').setFlippedY(true);
        },
        getRowByUid: function (uid) {
            return uid2position[uid];
        },
    });
    exports.MaLayer_match = MaLayer_match;
    exports.MaLayer_match.getPaiNameByRowAndId = getPaiNameByRowAndId;
})(window);
