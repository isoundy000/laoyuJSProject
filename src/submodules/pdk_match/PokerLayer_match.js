/**
 * Created by dengwenzhong on 2017/9/19.
 */
"use strict";
(function (exports) {


    var BatteryTextures = {
        "battery1": res.battery_1,
        "battery2": res.battery_2,
        "battery3": res.battery_3,
        "battery4": res.battery_4,
        "battery5": res.battery_5
    };

    var $ = null;

    var PAIID2CARD = [];


    var shangyijiaArr = [];

    var zidongTishi = false;


    var initPaiNum = 20;

    for (var i = 0; i < 54; i++)
        PAIID2CARD[i] = new pokerRule.Card(i);

    // CONST
    var FAPAI_ANIM_DELAY = 0.04;
    var FAPAI_ANIM_DURATION = 0.2;
    var UPPAI_Y = 30;

    var TEXT_BUYAO = 1;
    var TEXT_YAOBUQI = 2;
    var TEXT_DAWANLA = 3;

    var TEXT_2_FILENAME = {};
    TEXT_2_FILENAME[TEXT_BUYAO] = "res/image/ui/poker/character/text_buchu.png";
    TEXT_2_FILENAME[TEXT_YAOBUQI] = "res/image/ui/poker/character/text_yaobuqi.png";
    TEXT_2_FILENAME[TEXT_DAWANLA] = "res/image/ui/poker/character/text_dawanla.png";

    var TEXT_2_TEXTURE = {};
    TEXT_2_TEXTURE[TEXT_BUYAO] = cc.textureCache.addImage(TEXT_2_FILENAME[TEXT_BUYAO]);
    TEXT_2_TEXTURE[TEXT_YAOBUQI] = cc.textureCache.addImage(TEXT_2_FILENAME[TEXT_YAOBUQI]);
    TEXT_2_TEXTURE[TEXT_DAWANLA] = cc.textureCache.addImage(TEXT_2_FILENAME[TEXT_DAWANLA]);

    var ROOM_STATE_CREATED = 1;
    var ROOM_STATE_ONGOING = 2;
    var ROOM_STATE_ENDED = 3;
    var zongjiesuanData = null;

    var posConf = {
        headPosBak: {}
        , paiTouchRect: null
        , paiASize: {}
        , paiA0PosBak: {}
        , paiA0ScaleBak: {}
        , paiADistance: {}
        , paiALiangDistance: [0.5, 3.5, 0, -3.5]
        , paiMopaiDistance: {0: 16, 1: 40, 2: 34, 3: 40}
        , paiGDistance: []
        , paiUsedDistance: []
        , paiUsedZOrder: {
            0: {0: -1, 10: 0}
            , 1: {0: -1, 10: -1}
            , 2: {0: 0, 10: -1}
            , 3: {0: 0, 10: 1}
        }
        , opsPositionX: {4: [288, 538, 788, 1038], 3: [386, 636, 886]}
        , upPaiPositionY: null
        , downPaiPositionY: null
        , groupWidth: {}
        , groupHeight: {}
        , groupDistance: {0: 4, 1: 4, 2: 16, 3: 4}
        , groupToFirstPaiDistance: {0: 10, 1: -14, 2: 26, 3: -14}

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
            , 1: cc.p(40, 28)
            , 2: cc.p(40, 28)
            , 3: cc.p(40, 28)
        }
        , ltqpVoicePos: {
            0: cc.p(40, 28)
            , 1: cc.p(37, 28)
            , 2: cc.p(42, 40)
            , 3: cc.p(60, 28)
        }
        , ltqpEmojiSize: {}
        , ltqpTextDelta: {
            0: cc.p(0, -4)
            , 1: cc.p(-7, 2)
            , 2: cc.p(-1, 7)
            , 3: cc.p(3, 5)
        }
    };

    var data;
    var isReconnect;

    var roomState = null;
    var mapId = 2;
    var playerNum = 5;
    var rowBegin = 1;

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
    var isChooseQiepai = false;

    var forRows = null;

    var disabledChuPaiIdMap = {};

    var curChuPaiUid = 0;
    var curChuPaiArr = [];
    var curTishiArr = [];
    var curTishiIdx = 0;
    var enableChupaiCnt = 0;
    var curLeftPaiCntMap = {};

    var effectEmojiQueue = {};
    var effectEmojiCfg = {
        1: {'name': 'zan', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'bomb', 'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3: {'name': 'egg', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4: {'name': 'shoe', 'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5: {'name': 'flower', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0}
    };

    var laiziValue = [];
    var resultTypes = [];

    var clearVars = function () {
        roomState = null;
        mapId = gameData.mapId;
        if (gameData.mapId == MAP_ID.ZJH) {
            playerNum = 5;
        }
        else {
            playerNum = 3;
        }
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

        curChuPaiUid = 0;
        curChuPaiArr = [];
        curTishiArr = null;
        curTishiIdx = 0;
        enableChupaiCnt = 0;
        laiziValue = [];
        resultTypes = [];
        isChooseQiepai = false;
    };

    var PokerLayer_match = cc.Layer.extend({
        chatLayer: null,
        chiLayer: null,
        throwDiceLayer: null,
        kaigangLayer: null,
        beforeOnCCSLoadFinish: null,
        afterGameStart: null,
        interval: null,
        content: null,
        needBaojing: false,
        isByMySelf: true,
        paiArrOfShow: null,
        showBack: null,
        isChooseHeiSan: null,
        isShowFirst: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            // 比赛场
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

                        $('info2.paiming.top').setString('排名:' + (mtop + '/' + ttop));

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
                        var relayer = that.getChildByName('rewardLayer');
                        if (!relayer) {
                            var rlayer = new MatchRewardInGameLayer(record);
                            rlayer.setVisible(false);
                            that.addChild(rlayer, 104);
                            rlayer.setName('rewardLayer');
                            that.scheduleOnce(function () {
                                rlayer.setVisible(true)
                                rlayer.showAnim();
                                that.hasreward = true;
                            }, 1);
                        }

                    } else {
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });
                this.list_getPromotionState = cc.eventManager.addCustomListener("match_getPromotionState", function (event) {
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {

                        var matchInfo = gameData.matchInfo;
                        var stage = matchInfo['stage'];
                        var tstage = matchInfo['stage_total'];


                        var jlayer = that.getChildByName('jinjilayer');
                        if (!jlayer) {
                            var jjlayer = new MatchJinJiInGameLayer(stage, tstage, data);
                            jjlayer.setName('jinjilayer');
                            that.addChild(jjlayer, 103);
                        } else {
                            jlayer.freshInfo(data);
                        }

                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });
            }
        },
        getRootNode: function () {
            return this.getChildByName("Scene");
        },
        initExtraMapData: function (data) {
            var that = this;
        },
        onCCSLoadFinish: function () {
            // getLocationInfo();

            // network.send(3007, {
            //     location: '11111',
            //     locationCN: '2222'
            // });

            var that = this;

            $ = create$(this.getRootNode());

            this.getPai = this.getPai();
            this.addUsedPai = this.addUsedPai();
            this.countDown = this.countDown();

            this.calcPosConf();
            mRoom.voiceMap = {};


            if(res.PlayerInfoOtherNew_json) {
                EFFECT_EMOJI_NEW.init(this, $);
            }else{
                EFFECT_EMOJI.init(this, $);
            }
            MicLayer.init($('btn_mic'), this);


            // 暂时加上
            var puke_paibeiid = cc.sys.localStorage.getItem('puke_paibeiid') || 0;
            puke_paibeiid = parseInt(puke_paibeiid);
            if (puke_paibeiid > 2) {
                //防止意外
                puke_paibeiid = 2;
                cc.sys.localStorage.setItem('puke_paibeiid', puke_paibeiid);
            }

            if (getNativeVersion() < '1.4.0') {
                this.initMic();
            } else {
                MicLayer.init($('btn_mic'), this);
            }

            if (isReconnect) {
                gameData.zhuangUid = data["zhuang_uid"];
                gameData.leftRound = data["left_round"];
                gameData.totalRound = data["total_round"];
                gameData.players = data["players"];
                gameData.wanfaDesp = data["desp"];
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

            this.safenode = $("safenode");
            if (window.inReview) {
                this.safenode.setVisible(false);
            }

            //this.showSafeTipLayer(false);
            for (var i = 1; i <= 3; i++) {
                var safe_line = $("safe_line" + i, this.safenode);
                safe_line.setOpacity(255);
                safe_line.setVisible(false);
            }

            this.clearTable4StartGame(isReconnect, isReconnect, data);

            this.startTime();

            this.startSignal();


            if (isReconnect) {
                var player_pai = data.player_pai;
                if (player_pai && player_pai.length > 0) {
                    for (var i = 0; i < player_pai.length; i++) {
                        var temp = player_pai[i];
                        if (temp.uid == gameData.uid && temp.is_tg) {
                            $('auto_bg').setVisible(true);
                        }
                        if (temp.is_tg) {
                            var row = uid2position[temp.uid];
                            $('info' + row + '.tuo').setVisible(true);
                        }
                    }
                }
            }

            this.btnChangebg = $("btn_changebg");
            TouchUtils.setOnclickListener($('btn_changebg'), function () {
                (function () {
                    var sceneid = cc.sys.localStorage.getItem('sceneid') || 0;
                    sceneid++;
                    if (sceneid > 3) {
                        sceneid = 0;
                    }
                    that.changeBg(sceneid);
                })()
            }, {});
            TouchUtils.setOnclickListener($('btn_changepai'), function () {
                var paiid = cc.sys.localStorage.getItem('paiid') || 0;
                paiid++;
                if (paiid > 1) {
                    paiid = 0;
                }
                that.changePai(paiid);
            });

            TouchUtils.setOnclickListener($('chat'), function () {
                //
                that.addChild(new ChatLayer);
            });

            TouchUtils.setOnclickListener($("btn_zhunbei"), function () {
                network.send(3004, {room_id: gameData.roomId, is_support_qiepai: true});
                $('btn_ready').setVisible(false);
                isChooseQiepai = false;
            });
            if (mapId == MAP_ID.ZJH) {
                TouchUtils.setOnclickListener($("kan.kan"), function () {
                    network.send(4503, {room_id: gameData.roomId, op: 5});
                    $("kan").setVisible(false);
                });
            }

            TouchUtils.setOnclickListener($('btn_chakanjiesuan'), function () {
                if (that.jieSuanData) {
                    that.openJiesuanLayer()
                }
            });
            TouchUtils.setOnclickListener($("btn_copy"), function () {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName + "跑得快-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                console.log(title + "\n" + content);
                var shareurl = getShareUrl(gameData.roomId);
                savePasteBoard(title + "\n" + content + "\n" +
                    shareurl);
                alert1("复制成功");
            });
            TouchUtils.setOnclickListener($("btn_invite"), function () {

                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName + "跑得快-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var shareurl = getShareUrl(gameData.roomId);
                WXUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_inviteLiaobei"), function () {

                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName + "跑得快-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var shareurl = getShareUrl(gameData.roomId);
                LBUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_inviteXianLiao"), function () {

                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                var mapName = parts[1];
                parts.splice(1, 1);

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName + "跑得快-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                XianLiaoUtils.shareGame(gameData.roomId, title, gameData.companyName + "跑得快-" + content, 0, getCurTimestamp() + gameData.uid);
            });

            TouchUtils.setOnclickListener($('btn_ready'), function () {
                network.send(3004, {room_id: gameData.roomId, is_support_qiepai: true});
                $('btn_ready').setVisible(false);
                isChooseQiepai = false;
                // $('btn_ready_qie').setVisible(false);
            });
            // TouchUtils.setOnclickListener($('btn_ready_qie'), function () {
            //     network.send(3004, {room_id: gameData.roomId, has_qiepai:true});
            //     $('btn_ready').setVisible(false);
            //     $('btn_ready_qie').setVisible(false);
            // });

            TouchUtils.setOnclickListener($("info1"), function () {
                that.showPlayerInfoPanel(1);
            });
            TouchUtils.setOnclickListener($("info2"), function () {
                that.showPlayerInfoPanel(2);
            });
            TouchUtils.setOnclickListener($("info3"), function () {
                that.showPlayerInfoPanel(3);
            });

            TouchUtils.setOnclickListener($('btn_tuichu'), function () {
                alert2('确定要申请解散房间吗?', function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                }, null, false, false, true);
            })

            if (mapId == MAP_ID.ZJH) {
                TouchUtils.setOnclickListener($("info4"), function () {
                    that.showPlayerInfoPanel(4);
                });
                TouchUtils.setOnclickListener($("info5"), function () {
                    that.showPlayerInfoPanel(5);
                });
            }

            TouchUtils.setOnclickListener($('btn_fanhui'), function () {
                var code = 3003;
                if(gameData.mapId == MAP_ID.PDK_JBC){
                    code = 3233;
                }
                if (gameData.uid != gameData.ownerUid) {
                    alert2('确定要退出房间吗?', function () {
                        network.send(code, {room_id: gameData.roomId});
                    }, null, false, true, true);
                }
            });

            TouchUtils.setOnclickListener($('btn_jiesan'), function () {
                if (window.inReview)
                    network.send(3003, {room_id: gameData.roomId});
                else
                    alert2('解散房间不扣房卡，是否确定解散？', function () {
                        network.send(3003, {room_id: gameData.roomId, force: true});
                    }, null, false, false, true);
            });


            if (mapId == MAP_ID.ZJH) {
                TouchUtils.setOnclickListener($('btn_begin'), function () {
                    network.send(3005, {room_id: gameData.roomId});
                });
            }

            TouchUtils.setOnclickListener($('setting'), function () {
                var setting = HUD.showLayer(HUD_LIST.Settings, that);
                setting.setSetting(that, "pdk");//大厅里面打开界面
                setting.setSettingLayerType({hidejiesan: that});
            });

            //比赛场
            TouchUtils.setOnclickListener($('info2.paiming'), function () {
                showLoading('正在获取数据..');
                network.send(3333, {cmd: 'getRankList', params: {prmMatchId: gameData.matchId}});
            });

            TouchUtils.setOnclickListener($('auto_bg.button_qxtg'), function () {
                network.send(4007, {room_id: gameData.roomId, op: 0})
            });

            network.addListener(4110, function (data) {
                var qieUid = data.qiepai_uid;
                that.addChild(new QiepaiLayer(data, uid2position));
                that.onJiesuanClear();
                isChooseQiepai = false;
            });
            // this.changeVoice();
            network.addListener(3002, function (data) {
                if (that.getRoomState() == ROOM_STATE_ENDED) {
                    //加入房间成功  立即停止魔窗循环检测
                    gameData.roomId = data['room_id'];
                    gameData.mapId = data['map_id'];
                    gameData.gold_room_lev = data["gold_room_lev"] || 1;
                    gameData.gold_room_name = data["name"] || '新手场';
                    gameData.gold_room_base = data["baseGold"] || 50;
                    gameData.players = data['players'];
                    gameData.ownerUid = data['owner'];
                    gameData.last3002 = data;
                    gameData.wanfaDesp = data['desp'];
                    gameData.playerNum = data['max_player_cnt'];
                    gameData.daikaiPlayer = data['daikai_player'];


                    mRoom.club_id = data['club_id'];
                    if (!data['club_id'] && data['options']) {
                        var options = (_.isString(data['options']) ? JSON.parse(data['options']) : data['options']);
                        mRoom.club_id = options['club_id'];
                    }

                    if (data['options']) {
                        gameData.options = data['options'];
                        gameData.yunxujiaru = data['options']['yunxujiaru'];
                        if (data['options']['maxPlayerCnt']) {
                            gameData.playerNum = data['options']['maxPlayerCnt'];
                        }
                    }
                    gameData.matchId = data['match_id'] || 0;

                    gameData.matchInfo = data['match_info'];
                    gameData.baseScore = data['init_base_score'] || 0;
                    gameData.playTime = data['play_time'] || 12;
                    if (gameData.matchId) {//自动准备
                        network.send(3004, {room_id: gameData.roomId});
                    }
                    network.stop();
                    cc.director.runScene(new GameScene(data));

                }else if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.last3002 = data;
                    gameData.ownerUid = data["owner"];
                    gameData.players = data["players"];
                    that.onPlayerEnterExit();

                    gameData.daikaiPlayer = data['daikai_player'];
                    pokerRule.changeAvailableCardTypes(gameData.mapId);
                }
            });
            network.addListener(3003, function (data) {
                var uid = data["uid"];
                if (uid == gameData.uid) {
                    HUD.showScene(HUD_LIST.Home, null);
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
                if (data["del_room"]) {
                    var owner = uid2playerInfo[gameData.ownerUid];
                    if (owner) {
                        alert1("房主" + owner.nickname + "已解散房间", function () {
                            HUD.showScene(HUD_LIST.Home, null);
                        });
                    } else {
                        alert1("代开房主已解散房间", function () {
                            HUD.showScene(HUD_LIST.Home, null);
                        });
                    }
                }
                else {
                    var uid = data["uid"];
                    _.remove(gameData.players, function (player) {
                        return player.uid == uid;
                    });
                    that.onPlayerEnterExit();

                    if (that.assistant) {
                        if(typeof that.assistant.refreshPlayersStates == 'function')  that.assistant.refreshPlayersStates();
                    }
                }
            });
            network.addListener(3007, function (data) {
                var map = data['map'];
                for (var uid in map) {
                    var loc = map[uid]['loc'];
                    var locCN = map[uid]['locCN'];
                    gameData.players[position2playerArrIdx[uid2position[uid]]]['loc'] = loc;
                    gameData.players[position2playerArrIdx[uid2position[uid]]]['locCN'] = locCN;
                }
            });
            network.addListener(3004, function (data) {
                // if (that.getRoomState() != ROOM_STATE_ENDED || !data)
                //     return;
                var uid = data["uid"];
                that.setReady(uid);
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
                that.showChat(uid2position[uid], type, content, voice, uid);
            });
            network.addListener(3009, function (data) {
                if (data["arr"] == null || data["arr"] == undefined || data["arr"] == '' || (data["arr"] && data["arr"].length == 0)) {
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
                        shenqingjiesanLayer.removeFromParent();
                    alert1("经玩家" + nicknameArr.join(",") + "同意, 房间解散成功", function () {
                    });
                    $('jiesuan_btn_bg').setVisible(false);
                    $('btn_zhunbei').setVisible(false);
                    $('btn_chakanjiesuan').setVisible(false);

                    that.scheduleOnce(function () {
                        var tipLayer = HUD.getTipLayer();
                        if (tipLayer) {
                            var MessageBox = tipLayer.getChildByName('MessageBox');
                            if (MessageBox) MessageBox.removeFromParent();
                        }
                    }, 2);
                }
                else if (refuseUid) {
                    var shenqingjiesanLayer = $("shenqingjiesan", that);
                    if (shenqingjiesanLayer)
                        shenqingjiesanLayer.removeFromParent();
                    alert1("由于玩家【" + gameData.playerMap[refuseUid].nickname + "】拒绝，房间解散失败，游戏继续");
                }
                else {
                    var byUserId = gameData.uid;
                    if (data && data['arr'] && data['arr'][0] && data['arr'][0].uid) {
                        byUserId = data['arr'][0].uid;
                    }

                    var shenqingjiesanLayer = $("shenqingjiesan", that);
                    if (!shenqingjiesanLayer) {
                        shenqingjiesanLayer = new ShenqingjiesanLayer();
                        shenqingjiesanLayer.setName("shenqingjiesan");
                        that.addChild(shenqingjiesanLayer, 60);
                    }
                    shenqingjiesanLayer.setArrMajiang(leftSeconds, arr, byUserId, data);
                }
            });
            network.addListener(4000, function (data) {
                var uid = data["turn_uid"];
                var row = uid2position[uid];

                //上一轮 我赢了   轮到我出牌的
                // that.myTurnFirstChupai = (data['turn_uid'] == gameData.uid && data['curUid'] == 0) ||
                //     (data['turn_uid'] == gameData.uid && data['curUid'] == gameData.uid);

                shangyijiaArr = data.curPaiArr;
                if (!data['is_first']) {
                    that.isByMySelf = true;
                    if (that.showBack) {
                        that.fapai(that.paiArrOfShow, true);
                        that.showBack = false;
                    }
                }
                if (that.isShowFirst && that.isChooseHeiSan) {
                    that.isShowFirst = false;
                    if (row != 2) {
                        if (data['is_hei3first']) {
                            that.playPokerAnim(row, 'woxianchu', 'heitao3_woxianchu', false, 0);
                        } else {
                            that.playPokerAnim(row, 'woxianchu', 'woying_woxianchu', false, 0);
                        }
                    }
                }

                that.throwTurn(row, data);
            });
            network.addListener(4500, function (data) {
                $("btn_zhunbei").setVisible(false);
                var uid = data["uid"];
                var row = uid2position[uid];
                that.ZJHthrowTurn(row, data);
            });
            network.addListener(4002, function (data, errorCode) {
                if (errorCode)
                    return network.disconnect();

                var leftPaiCnt = data["left_pai_cnt"];
                var uid = curChuPaiUid = data["uid"];
                var paiArr = curChuPaiArr = (data["pai_arr"] || []);
                var row = uid2position[uid];
                if (data['bei']) {
                    $('bg_bei.lb_bei').setString((data["bei"]) + '倍');
                }
                if ($('info' + row + ".left_bg")) {
                    if (gameData.showLeft) {
                        $('info' + row + ".left_bg").setVisible(true);
                        $('info' + row + ".left_bg.left").setString(leftPaiCnt + "张");
                    } else {
                        $('info' + row + ".left_bg").setVisible(false);
                    }
                }
                that.chuPai(row, paiArr, leftPaiCnt);
                curLeftPaiCntMap[row] = leftPaiCnt;
                if (row == 2 && leftPaiCnt != that.getPaiArr().length && !isReplay) {
                    network.disconnect();
                }
                if (isReplay) {
                    var myPaiArr = data["my_pai_arr"];
                    if (row != 2) {
                        that.setPaiArrOfRow(row * 10, myPaiArr);
                    } else {
                        that.setPaiArrOfRow(2, myPaiArr);
                        that.recalcPos(2, myPaiArr.length)
                    }
                }

                that.playerOnloneStatusChange(row, 0);
            });
            network.addListener(4003, function (data) {
                var uid = data["uid"];
                var arr = data["pai_arr"];

                curTishiArr = arr;
                curTishiIdx = 0;
                if (curTishiArr.length > 0) {
                    // that.upPaiByPaiArr(arr[0]);
                    // curTishiIdx++;
                    that.upPaiByPaiArr(arr[0], arr, 0);
                    if (!zidongTishi || arr.length == 0) {
                        curTishiIdx++;
                    }
                } else {
                    that.disableTiShiBtn("ops.tishi");
                }
            });
            network.addListener(3502, function (data) {

            });
            network.addListener(3200, function (data) {
                return;
                that.content = decodeURIComponent(data['content']);
                var func = function () {
                    if (!that || !cc.sys.isObjectValid(that)) {
                        return;
                    }
                    var _speaker = $('speaker');
                    if (_speaker.isVisible()) {
                        return;
                    }
                    _speaker.setVisible(true);
                    var speakerPanel = $('speaker.panel');
                    var text = new ccui.Text();
                    text.setFontSize(26);
                    text.setColor(cc.color(254, 245, 92));
                    text.setAnchorPoint(cc.p(0, 0));
                    text.enableOutline(cc.color(0, 0, 0), 1);
                    speakerPanel.removeAllChildren();
                    speakerPanel.addChild(text);
                    text.setString(that.content);
                    text.setPositionX(speakerPanel.getContentSize().width);
                    text.setPositionY((speakerPanel.getContentSize().height - text.getContentSize().height) / 2);
                    text.runAction(cc.sequence(
                        cc.moveTo(20, -text.getVirtualRendererSize().width, 0),
                        cc.callFunc(function () {
                            $('speaker').setVisible(false);
                        })
                    ));
                };
                func();
                if (this.interval == null) {
                    this.interval = setInterval(func, 25000);
                }
            });

            network.addListener(4112, function (data) {
                //切牌相关
                if (data.qiepai_uid == gameData.uid) {
                    //$('btn_ready_qie').setVisible(true);
                    isChooseQiepai = true;
                }

            });
            network.addListener(4007, function (data, errCode) {
                var op = data["op"];
                console.log('托管=>', op);
                var uid = data["uid"];
                var row = uid2position[uid];
                if (row == 2) {
                    $('auto_bg').setVisible(op != 0);
                    // that.hideChiPengGangHu();
                    // isAutoSendPai = op == 1;
                }
                $('info' + row + '.tuo').setVisible(op != 0);
            });
            network.addListener(4008, function (data) {
                that.setRoomState(ROOM_STATE_ENDED);
                that.jiesuan(data);
                //比赛场
                if (gameData.matchId) {
                    data['matchId'] = gameData.matchId;
                    data['matchInfo'] = gameData.matchInfo;
                }
                if (!isReplay) {
                    if (data.cur_round == data.total_round) {
                        $('jiesuan_btn_bg').setVisible(false);
                        $('btn_zhunbei').setVisible(false);
                        $('btn_chakanjiesuan').setVisible(false);
                    } else {
                        $('jiesuan_btn_bg').setVisible(false);
                        $('btn_zhunbei').setVisible(false);
                        $('btn_chakanjiesuan').setVisible(false);
                    }

                }
            });
            network.addListener(4009, function (data) {
                zongjiesuanData = data;
                $('jiesuan_btn_bg').setVisible(false);
                $('btn_zhunbei').setVisible(false);
                $('btn_chakanjiesuan').setVisible(false);


                if (gameData.matchInfo && gameData.matchId) {//比赛场
                    var matchInfo = gameData.matchInfo;
                    var mtype = matchInfo['stage_type'] || 1;
                    if (mtype == 1) {//打立出局  等待页
                        that.scheduleOnce(function () {
                            var mwl = new MatchWaitLayer(that.curTop, that.totalTop);
                            mwl.setName('waitlayer');
                            that.addChild(mwl, 102);
                        }, 2);

                    }
                }

            });
            network.addListener(4010, function (data) {
                var msg = data.msg;
                that.showToast(decodeURIComponent(msg));
            });
            network.addListener(4020, function (data) {
                var uid = data["uid"];
                var isOffline = data["is_offline"];
                that.playerOnloneStatusChange(uid2position[uid], isOffline);
            });
            network.addListener(4200, function (data) {
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    $('bg_bei').setVisible(true);
                    $('bg_bei.lb_bei').setString('1倍');
                }
                var paiArr = that.paiArrOfShow = data["paiArr"];
                var paiBackArr = [];
                gameData.leftRound = data["left_round"];
                gameData.totalRound = data["total_round"];
                if (gameData.matchId) {
                    // gameData.totalRound = data['total_round'];
                    gameData.curRound = gameData.totalRound - gameData.leftRound;
                }
                var zhuangID = data['zhuang_uid']
                that.initExtraMapData(data);
                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame(true);
                if ((mapId == MAP_ID.PDK || mapId == MAP_ID.PDK_MATCH) && uid2position[zhuangID] != 2) {
                    that.isByMySelf = false;
                }
                if (gameData.anticheating) {
                    if (!that.isByMySelf) {
                        for (var i = 0; i < paiArr.length; i++) {
                            paiBackArr.push(-1);
                        }
                        that.fapai(paiBackArr, false);
                        that.showBack = true;
                    } else {
                        that.fapai(paiArr, true);
                    }
                }
                else {
                    that.fapai(paiArr, true);
                }

                var unuse = data["unused_paiArr"];
                if (unuse && (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ)) {
                    gameData.unused_paiArr = unuse;
                    if (data["lord_is_made"]) {
                        var zhuangID = data["zhuang_uid"];
                        that.changeShenFen(zhuangID);
                    } else {
                        that.hideShenFen();
                    }
                }
                if (that.afterGameStart)
                    that.afterGameStart();
                var isLeftCardNum = false; //false 16 true 15
                var arr = decodeURIComponent(gameData.wanfaDesp != "null" ? gameData.wanfaDesp : "").split(',');
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == '15张') {
                        isLeftCardNum = true;
                    }
                }

                if ($('info1.left_bg')) {
                    if (gameData.showLeft) {
                        $('info1.left_bg').setVisible(true);
                        if (isLeftCardNum) {
                            $('info1.left_bg.left').setString("15张");
                        } else {
                            $('info1.left_bg.left').setString("16张");
                        }
                    } else {
                        $('info1.left_bg').setVisible(false);
                    }

                }
                if ($('info2.left_bg')) {
                    if (gameData.showLeft) {
                        $('info2.left_bg').setVisible(true);
                        if (isLeftCardNum) {
                            $('info2.left_bg.left').setString("15张");
                        } else {
                            $('info2.left_bg.left').setString("16张");
                        }
                    } else {
                        $('info2.left_bg').setVisible(false);
                    }

                }
                if ($('info3.left_bg')) {
                    if (gameData.showLeft) {
                        $('info3.left_bg').setVisible(true);
                        if (isLeftCardNum) {
                            $('info3.left_bg.left').setString("15张");
                        } else {
                            $('info3.left_bg.left').setString("16张");
                        }
                    } else {
                        $('info3.left_bg').setVisible(false);
                    }

                }

            });
            network.addListener(4888, function (data) {
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    if (data['end_socre']) {
                        $('lb_jiaofen').setString('叫' + (data["end_socre"]) + '分');
                    }
                    else {
                        $('lb_jiaofen').setString('叫0分');
                    }
                }
                if (gameData.uid == data["lord"]) {
                    var min = data["score"] || 1;
                    that.showJiaoDiZhu(min);
                }
            });
            network.addListener(4889, function (data) {
                var zhuangID = data["zhuang_uid"];
                that.changeShenFen(zhuangID);
            });
            // network.addListener(4990, function (data) {
            //     that.addEffectEmojiQueue(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
            // });
            network.addListener(4901, function (data) {
                laiziValue = data.laizi || [];
                that.setLaiziCards();
                that.setPaiArrOfRow(2, that.getPaiArr());
            });
            network.start();
            isCCSLoadFinished = true;

            playMusic("vbg6");

            if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                $("top_panel").setVisible(true);
            }
            pokerRule.changeAvailableCardTypes(gameData.mapId);
            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH || gameData.mapId == MAP_ID.XIANGYANG_PDK || isReplay) {
                $("top_panel").setVisible(false);
            }
            // if (!isReplay) {
            //     var wanfa = $("word_wanfa_" + gameData.mapId);
            //     if (wanfa)
            //         wanfa.setVisible(true);
            // }
            $('speaker').setVisible(false);

            that.showFangzhu();

            that.getVersion();


        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if (subArr) sub = subArr['pdk_match'];

            var versiontxt = window.curVersion + "-" + sub;
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
        setInviteBtn: function (status) {
            $("btn_invite").setVisible(status);
            $("btn_inviteLiaobei").setVisible(status);
            $("btn_inviteXianLiao").setVisible(status);
            $("btn_copy").setVisible(status);
            if (window.inReview) {
                $("btn_invite").setVisible(false);
                $("btn_inviteLiaobei").setVisible(false);
                $("btn_inviteXianLiao").setVisible(false);
                $("btn_copy").setVisible(false);
            }
        },
        setupPlayers: function () {
            var that = this;

            if (mRoom.isReplay) {
                gameData.players = mRoom.replayData.users;
            }
            var data = gameData.players || [];
            var pos = 0;
            if (mRoom.isReplay == true) {
                pos = 0;
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].uid == gameData.uid) {
                        pos = i;
                    }
                }
            }
            this.pos0 = pos;
            this.pos1 = (pos + 1) % gameData.playerNum;
            this.pos2 = (pos + 2) % gameData.playerNum;
            this.pos3 = (pos + 3) % gameData.playerNum;

            //报警  100以内  报警
            that.needBaojing = false;
            // gameData.location = "0.1,0.1";
            for (var i = 0; i < data.length; i++) {
                if (data[i].uid != gameData.uid) {
                    var pos = that.getRowByUid(data[i].uid);
                    //console.log(pos+"==="+data[i].NickName);
                    //console.log("Location==="+data[i]['Location']);
                    this.addGpsTip(pos, data[i]['nickname'], data[i]['loc']);
                }
            }
            //任意两个人距离 <500 就报警
            for (var i = 0; i < data.length; i++) {
                for (var j = i + 1; j < data.length; j++) {
                    var distance = this.getJuliByLoc(data[i]['loc'], data[j]['loc']);
                    //console.log('============distance:'+distance);
                    if (distance <= 500) {
                        that.needBaojing = true;
                        break;
                    }
                }
            }
            // var safebtn = $("safebtn", that.safenode);
            // safebtn.setVisible(that.needBaojing);
            if (!window.inReview) {
                this.showSafeTipLayer(that.needBaojing);
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
        //GPS 提示信息
        addGpsTip: function (pos, name, loc) {
            var that = this;
            // var loc = '0.000001,0.00001';
            // gameData.location = '0.000001,0.00001';
            //console.log(pos+"?????????????=="+name+"==");

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
                var safe_line = $("safe_line" + (pos), that.safenode);

                var postion = safe_line.getPositionY();
                if (safe_line) {
                    if (this.safenode.nodeNum == undefined || this.safenode.nodeNum == null) {
                        this.safenode.nodeNum = 0;
                    }
                    safe_line.setOpacity(255);
                    safe_line.setVisible(true);
                    if (!safe_line.pos) {
                        this.safenode.nodeNum += 1;
                        //safe_line.setPositionY(safe_line.getPositionY() - (this.safenode.nodeNum) * 40);
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
                            //safe_line.setPositionY(postion);
                            if (that.safenode.nodeNum > 0) that.safenode.nodeNum -= 1;
                        })
                    ))
                }
            }
        },
        //GPS 提示
        showSafeTipLayer: function (_bool) {
            var visible = _bool;
            if (mRoom.isReplay) visible = false;
            var that = this;
            var safebtn = $("safebtn", that.safenode);
            var safe_gps = $("safebtn.safe_gps", that.safenode);
            var safe_gps2 = $("safebtn.safe_gps2", that.safenode);
            safe_gps.setVisible(true);
            safe_gps2.setVisible(true);
            if (_bool) {

                if (!that.isTouchedSafeBtn) {
                    safe_gps.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))));
                    safe_gps2.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5))));
                } else {
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
                if (that.needBaojing) {
                    safe_gps.setVisible(true);
                    safe_gps2.setVisible(false);
                }
                else {
                    safe_gps.setVisible(false);
                    safe_gps2.setVisible(true);
                }
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
        changePai: function (paiid) {
            if (paiid > 1) {
                paiid = 0;
            }
            cc.sys.localStorage.setItem('paiid', paiid);
            network.send(3008, {
                room_id: gameData.roomId,
                voice: null,
                type: 'pdkcardtype',
                content: paiid
            });
            for (var idx = 0; idx < initPaiNum; idx++) {
                var pai1 = this.getPai(1, idx);
                var pai2 = this.getPai(2, idx);
                var pai3 = this.getPai(3, idx);
                var pai20 = this.getPai(20, idx);
                if (pai1 && pai1.isVisible()) {
                    // console.log(pai1.getUserData().paivalue);
                    if (pai1.getUserData().paivalue >= 0) this.setPaiHua(pai1, pai1.getUserData().paivalue, 1);
                }
                if (pai2 && pai2.isVisible()) {
                    // console.log(pai2.getUserData());
                    if (pai2.getUserData().paivalue >= 0) this.setPaiHua(pai2, pai2.getUserData().paivalue, 2);
                }
                if (pai3 && pai3.isVisible()) {
                    // console.log(pai3.getUserData().paivalue);
                    if (pai3.getUserData().paivalue >= 0) this.setPaiHua(pai3, pai3.getUserData().paivalue, 3);
                }
                if (pai20 && pai20.isVisible()) {
                    // console.log(pai20.getUserData().paivalue);
                    if (pai20.getUserData().paivalue >= 0) this.setPaiHua(pai20, pai20.getUserData().paivalue, 20);
                }
            }
        },
        changeBg: function (sceneid) {
            if (sceneid > 3) {
                sceneid = 0;
            }
            // console.log(sceneid);
            cc.sys.localStorage.setItem('sceneid', sceneid);
            $('bg').setTexture('res/submodules/pdk_match/PkScene/table_back' + sceneid + '.jpg');
        },
        showFangzhu: function () {
            if (gameData.matchId) {
                $('fangzhuheader').setVisible(false);
                return;
            }

            if (gameData.daikaiPlayer && false) {
                $('fangzhuheader').setVisible(true);
                loadImageToSprite(gameData.daikaiPlayer['headimgurl'], $('fangzhuheader.header'));
                $('fangzhuheader.name').setString(ellipsisStr(gameData.daikaiPlayer['nickname'], 6));
            } else {
                $('fangzhuheader').setVisible(false);
            }
        },
        onExit: function () {
            if (this.chatLayer)
                this.chatLayer.release();
            if (this.chiLayer)
                this.chiLayer.release();
            if (this.throwDiceLayer)
                this.throwDiceLayer.release();
            if (this.kaigangLayer)
                this.kaigangLayer.release();
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            // EFFECT_EMOJI.destroy();
            // EFFECT_CHAT.destroy();
            // network.removeListeners([
            //     3003, 3004, 3005, 3008, 3200,
            //     4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200, 4888, 4889, 4890
            // ]);
            if (this.list2103) cc.eventManager.removeListener(this.list2103);
            if (this.list1) cc.eventManager.removeListener(this.list1);
            if (this.list2) cc.eventManager.removeListener(this.list2);

            if (gameData.matchId) {
                cc.eventManager.removeListener(this.list_getRank);
                cc.eventManager.removeListener(this.list_getRankList);

                cc.eventManager.removeListener(this.list_getPromotionState);
                cc.eventManager.removeListener(this.list_putMatchRecord);
            }

            cc.Layer.prototype.onExit.call(this);
        },
        onPlayerEnterExit: function () {
            var that = this;
            var players_copy = gameData.players;
            var players = [];
            for (var i = 0; i < players_copy.length; i++) {
                var player = players_copy[0];
                if (player.uid != gameData.uid) {
                    players_copy.splice(0, 1);
                    players_copy.push(player);
                }
                else
                    break;
            }

            //邀请俱乐部成员
            var currentRound = gameData.totalRound - gameData.leftRound;
            if (this.getRoomState() == ROOM_STATE_ONGOING || currentRound > 1) {
                if (this.assistant) this.assistant.setVisible(false);
            }
            if (players_copy.length >= gameData.playerNum) {
                var clubMemberInviteLayer = this.getChildByName('clubMemberInviteLayer');
                if (clubMemberInviteLayer) {
                    clubMemberInviteLayer.removeFromParent(true);
                }
                if (this.assistant) this.assistant.setVisible(false);
            } else {
                if (mRoom.club_id) {
                    if (this.assistant) this.assistant.setVisible(true);
                }
            }

            // 2人玩专用
            if (gameData.mapId != MAP_ID.ZJH && players.length > 1 && players[1].uid == 0) {
                var tempPlayer = players[1];
                players[1] = players[2];
                players[2] = tempPlayer;
            }

            for (var i = 0; i < players_copy.length; i++) {
                var player = players_copy[i];
                if (player.uid != 0) {
                    players.push(player);
                }

            }

            $("timer").setUserData({delta: i});
            uid2position = {};
            for (var i = 0, j = 2; i < players.length; i++ , j++) {
                var player = players[i];
                var k = {
                    5: {0: 4, 1: 3, 2: 2, 3: 1, 4: 5},
                    4: {0: 0, 1: 3, 2: 2, 3: 1},
                    3: {0: 1, 1: 3, 2: 2}
                }[playerNum][j % playerNum];


                uid2position[player.uid] = k;
                uid2playerInfo[player.uid] = player;
                position2uid[k] = player.uid;
                position2sex[k] = player.sex;
                position2playerArrIdx[k] = i;
                if (player.uid == 0) {
                    $("info" + k).setVisible(false);
                    continue;
                }
                $("info" + k).setVisible(true);
                $("info" + k + ".lb_nickname").setString(ellipsisStr(player["nickname"], (k == 0 || k == 2 ? 7 : 5)));
                $("info" + k + ".lb_score").setString((roomState == ROOM_STATE_CREATED) ? 0 : ((player["total_score"] == undefined) ? player["score"] : player["total_score"]));
                if (roomState == ROOM_STATE_CREATED) {
                    $("info" + k + ".ok").setVisible(!!player["ready"]);
                    if (player['uid'] == gameData.uid)
                        $("btn_ready").setVisible(!player["ready"]);
                }

                loadImageToSprite(player["headimgurl"], $("info" + k + ".head"));
            }

            for (; i < playerNum; i++ , j++) {
                var k = {
                    4: {0: 0, 1: 3, 2: 2, 3: 1},
                    5: {0: 4, 1: 3, 2: 2, 3: 1, 4: 5},
                    3: {0: 1, 1: 3, 2: 2}
                }[playerNum][j % playerNum];
                $("info" + k).setVisible(false);
            }

            // if (players.length >= playerNum && roomState == ROOM_STATE_CREATED) {
            //     setTimeout(function () {
            //         if (that && cc.sys.isObjectValid(that) && players.length >= playerNum && !isReplay && roomState == ROOM_STATE_CREATED) {
            //            // network.disconnect();
            //         }
            //     }, 4000);
            // }
            if (gameData.matchId) {
                this.setInviteBtn(false);
            }

            if (!isReplay) {
                that.setupPlayers();
            }

        },
        calcPosConf: function () {
            // if (window.posConf) {
            //     posConf = window.posConf;
            //     return;
            // }
            posConf.paiADistance[0] = 0;
            var arr = mapId == MAP_ID.ZJH ? [1, 2, 3, 4, 5] : [1, 2, 3, 20];
            for (var i = 0; i < arr.length; i++) {
                var row = arr[i];
                if (mapId != MAP_ID.ZJH) {
                    var a0 = $("row" + row + ".a0");
                    posConf.paiASize[row] = a0.getContentSize();
                    posConf.paiA0PosBak[row] = a0.getPosition();
                    posConf.paiA0ScaleBak[row] = [a0.getScaleX(), a0.getScaleY()];
                    if ($("info" + row))
                        posConf.headPosBak[row] = $("info" + row).getPosition();

                    var a0 = $("row" + row + ".a0");
                    var a1 = $("row" + row + ".a1");
                    posConf.paiADistance[row] = a1.getPositionX() - a0.getPositionX();

                    if (row == 2) {
                        posConf.upPaiPositionY = a0.getPositionY() + UPPAI_Y;
                        posConf.downPaiPositionY = a0.getPositionY();

                        posConf.paiTouchRect = cc.rect(0, 0, posConf.paiADistance[2], a0.getContentSize().height);
                    }
                }

                var ltqp = $("info" + row + ".qp");
                if (ltqp) {
                    posConf.ltqpPos[row] = ltqp.getPosition();
                    posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                    posConf.ltqpEmojiSize[row] = cc.size({
                        3: {
                            0: 80,
                            1: 90,
                            2: 84,
                            3: 100
                        },
                        5: {
                            1: 90,
                            2: 84,
                            3: 100,
                            4: 100,
                            5: 90
                        }
                    }[playerNum][row], posConf.ltqpRect[row].height);
                    ltqp.removeFromParent();
                }
            }
            // window.posConf = posConf;
        },
        ctor: function (_data, _isReplay) {
            this._super();

            clearVars();

            var that = this;
            forRows = function (cb) {
                cb.call(that, 1);
                cb.call(that, 2);
                if (gameData.players.length >= 3) {
                    cb.call(that, 3);
                }
                if (gameData.players.length >= 4) {
                    cb.call(that, 4);
                }
                if (gameData.players.length >= 5) {
                    cb.call(that, 5);
                }
            };

            data = _data;
            isReconnect = !!_data;
            isReplay = !!_isReplay;


            network.stop();

            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                loadNodeCCS(res.PkScene_match_json, this, "Scene");
            }
            var default_sceneid = 0;
            var default_paiid = 0;
            if (gameData.mapId == MAP_ID.PDK_MATCH) {
                default_sceneid = 3;
                default_paiid = 1;
            }
            var sceneid = cc.sys.localStorage.getItem('sceneid') || default_sceneid;
            var paiid = cc.sys.localStorage.getItem('paiid') || default_paiid;
            $('pos_c1').setLocalZOrder(200);
            $('pos_c2').setLocalZOrder(200);
            $('pos_c3').setLocalZOrder(200);
            this.changeBg(sceneid);
            this.changePai(paiid);

            return true;
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
                if (delay < 100) $('signal').setTexture(res.signal5);
                else if (delay < 200) $('signal').setTexture(res.signal4);
                else if (delay < 300) $('signal').setTexture(res.signal3);
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
            if (isReplay)
                return;
            var updTime = function () {
                //显示电池电量
                var battery = $('battery');
                var level = DeviceUtils.getBatteryLevel();
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
        throwTurnByUid: function (uid) {
            this.throwTurn(uid2position[uid]);
        },
        throwTurn: function (row, data) {
            var isYaodeqi = data["is_beat"] || false;
            var canPass = data["can_pass"] || false;
            var that = this;
            turnRow = row;
            if ($("timer")) {
                $("timer").setVisible(true);
            }

            $("timer2").setVisible(true);

            if (gameData.matchId) {
                $('timer2').setVisible(false);
                $('timer3').setVisible(true);
                $('timer4').setVisible(true);
            }

            setTimeout(function () {
                $("row" + (row == 2 ? 20 : row)).setVisible(false);
            }, 0);


            for (var i = 0; i < initPaiNum; i++) {
                var pai = this.getPai(2, i);
                if (pai.isVisible() && row == 2 && isYaodeqi)
                    Filter.remove(pai);
                else
                    Filter.grayMask(pai);
            }

            if (row == 2) {
                curTishiArr = null;
                this.upPai(2, -1);
                if (isYaodeqi) {
                    var enforce = false;
                    if (data["validUid"] == gameData.uid) {
                        enforce = true;
                    }
                    this.showOps(enforce, canPass);
                    if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                        zidongTishi = true;
                        if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4003, {room_id: gameData.roomId});
                    }
                } else {
                    if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH || gameData == MAP_ID.XIANGYANG_PDK) {
                        this.hideOps();
                    } else if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                        this.yaobuqiOps();
                    }
                }
            }
            else {
                this.hideOps();
            }

            if (isYaodeqi || gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                this.hidePlayerStatus(row);
                this.countDown(row, (gameData.playTime ? gameData.playTime : 15));
            } else {
                this.countDown(row, (gameData.playTime ? gameData.playTime : 15));
                setTimeout(function () {
                    $("timer").setVisible(false);
                    that.setPlayerStatus(row, TEXT_YAOBUQI);
                    playEffect("vbuyao" + (Math.floor(Math.random() * 2) + 1));
                }, 788);
                network.send(4004, {"room_id": gameData.roomId});
            }
            this.hideTip();
        },
        ZJHthrowTurn: function (row, data) {
            var that = this;
            this.countDown(row, (gameData.playTime ? gameData.playTime : 15));
            $('top_panel').setVisible(true);
            $('top_panel.chipnum').setString(data['total_chip']);
            $('top_panel.gennum').setString(data['gen_round'][0] + '/' + data['gen_round'][1]);
            that.gen_round = data['gen_round'][0];
            $('top_panel.binum').setString(data['bi_round'][0] + '/' + data['bi_round'][1]);
            $('top_panel.mennum').setString(data['men_round'][0] + '/' + data['men_round'][1]);
            if (!isReplay) {
                if (row != 2) {
                    that.disableOpsBtns();
                    return;
                }
                $("kan").setVisible(!!data['kan']);
                $('ops.gen.txt').setString('跟注x' + data['gen_score']);

                TouchUtils.removeListeners($('ops.shield'));
                TouchUtils.setOnclickListener($("jia.jia0"), function () {
                    $('ops').setVisible(true);
                    $('jia').setVisible(false);
                });
                for (var i = 5; i > Math.max(data.jia, 1); i--) {
                    that.enableBtn('jia.jia' + i);
                    (function (idx) {
                        TouchUtils.setOnclickListener($("jia.jia" + idx), function () {
                            network.send(4503, {room_id: gameData.roomId, op: 3, bei: idx});
                            $('ops').setVisible(true);
                            $('jia').setVisible(false);
                            that.disableOpsBtns();
                        });
                    })(i)
                }
                for (var i = data['jia']; i > 1; i--) {
                    that.disableBtn('jia.jia' + i);
                }
                //NONE, QI, GEN, JIA, BI, KAN
                TouchUtils.setOnclickListener($("ops.qi"), function () {
                    alert2('确定要弃牌吗?', function () {
                        network.send(4503, {room_id: gameData.roomId, op: 1});
                        that.disableOpsBtns();
                    }, null, false, true, true);
                });
                TouchUtils.setOnclickListener($("ops.gen"), function () {
                    network.send(4503, {room_id: gameData.roomId, op: 2});
                    that.disableOpsBtns();
                });
                TouchUtils.setOnclickListener($("ops.jia"), function () {
                    $('ops').setVisible(false);
                    $('jia').setVisible(true);
                    for (var k = 2; k <= 5; k++) {
                        $('jia.jia' + k + '.txt').setString('x ' + (data['read'] ? (2 * k) : k));
                    }
                });
                TouchUtils.setOnclickListener($("ops.bi"), function () {
                    TouchUtils.setOnclickListener($('ops.shield'), function () {

                    });
                    network.send(4503, {room_id: gameData.roomId, op: 4, bi_uid: 0});
                });
                TouchUtils.setOnclickListener($("ops.canclebi"), function () {
                    $('ops.qi').setVisible(true);
                    $('ops.gen').setVisible(true);
                    $('ops.jia').setVisible(true);
                    $("ops.bi").setVisible(true);
                    $('ops.canclebi').setVisible(false);
                    for (var i = 1; i < 6; i++) {
                        //头像变正常
                        if ($('info' + i + '.head_bg_anmi').isVisible()) {
                            $('info' + i + '.head_bg_anmi').stopAllActions();
                            $('info' + i + '.head_bg_anmi').setVisible(false);
                        }
                        (function (idx) {
                            TouchUtils.setOnclickListener($('info' + idx), function () {
                                that.showPlayerInfoPanel(idx);
                            });
                        })(i);
                    }
                    $('choose_player_bi').setVisible(false);
                });
                if (data['jia'] >= 5) {
                    that.disableBtn('ops.jia');
                } else {
                    that.enableBtn('ops.jia');
                }
                if (!data['bi']) {
                    that.disableBtn('ops.bi');
                } else {
                    that.enableBtn('ops.bi');
                }
                that.enableBtn('ops.qi');
                that.enableBtn('ops.gen');
            }
        },
        setPai: function (row, idx, val, isVisible) {
            var pai = this.getPai(row, idx);
            var userData = pai.getUserData();
            this.setPaiHua(pai, val, row);
            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                userData.isLiang = true;
            }
            userData.pai = val < 100 ? val : (Math.floor(val / 100) - 1);
            if (!_.isUndefined(isVisible)) {
                if (isVisible)
                    pai.setVisible(true);
                else
                    pai.setVisible(false);
            }
            return pai;
        },
        getPaiNameById_PDK: function (id) {
            return "newpoker_" + id + ".png";
        },
        setPaiHua: function (pai, val, row) {
            var paiid = cc.sys.localStorage.getItem('paiid') || 0;

            pai.getUserData().paivalue = val;
            // console.log(pai.getUserData());
            pai.setVisible(true);

            if (paiid == 0) {
                // 改扑克牌面备份
                var a = pai.getChildByName("a");
                var b = pai.getChildByName("b");
                var originValue = null;
                if (val >= 100) {
                    originValue = val % 100;
                    val = (val - originValue) / 100 - 1;
                }
                var arr = getPaiNameById(val);
                if (val >= 0) {
                    //setPokerFrameByName(a, (originValue == null && !pokerRule.isLaizi(val, laiziValue)) ? arr[0] : "b/orange_" + val % 13 + ".png");
                    setPokerFrameByName(a, arr[0]);
                    a.setVisible(true);
                } else {
                    a.setVisible(false);
                }

                if (val == -1) {
                    setPokerFrameByName(pai, arr[0]);
                } else {
                    setPokerFrameByName(pai, 'b/bg.png');
                }

                if (val < 52 && val >= 0) {
                    setPokerFrameByName(b, arr[1]);
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }

                var c = pai.getChildByName("c");
                if (c && cc.sys.isObjectValid(c)) {
                    c.setVisible(true);
                    if (val > 51) {
                        c.setVisible(false);
                    } else if (val >= 0) {
                        setPokerFrameByName(c, arr[1]);
                        c.setVisible(true);
                    } else {
                        c.setVisible(false);
                    }
                }
                if (!row || row != 2) {
                    //c.setVisible(false);
                }
                if (pai.getChildByTag(5001)) {
                    pai.removeChildByTag(5001, true);
                }
                if (val == 52) {
                    var w_1 = new cc.Sprite("res/image/ui/zjh/card/w_1.png");
                    pai.addChild(w_1);
                    w_1.setTag(5001);
                    w_1.setPosition(cc.p(0.5 * pai.getContentSize().width, 0.5 * pai.getContentSize().height));
                    w_1.setScale(0.8);
                }
                if (val == 53) {
                    var w_2 = new cc.Sprite("res/image/ui/zjh/card/w_2.png");
                    pai.addChild(w_2);
                    w_2.setTag(5001);
                    w_2.setPosition(cc.p(0.5 * pai.getContentSize().width, 0.5 * pai.getContentSize().height));
                    w_2.setScale(0.8);
                }
                var laizi = pai.getChildByName('laizi');
                var originValueFrame = pai.getChildByName('origin');
                if (originValue != null) {
                    if (!laizi) {
                        laizi = new cc.Sprite(LAIZI_TEXTURE);
                        laizi.setName('laizi');
                        laizi.setAnchorPoint(cc.p(0.5, 0.5));
                        laizi.setPosition(b.getPosition());
                        pai.addChild(laizi);
                    }
                    laizi.setVisible(true);
                    if (!originValueFrame) {
                        originValueFrame = new cc.Sprite();
                        originValueFrame.setName('origin');
                        originValueFrame.setAnchorPoint(cc.p(0.5, 0));
                        originValueFrame.setPosition(cc.p(40, 25));
                        originValueFrame.setScale(0.7);
                        pai.addChild(originValueFrame);
                    }
                    setPokerFrameByName(originValueFrame, "b/orange_" + originValue % 13 + ".png");
                    Filter.grayScale(originValueFrame);
                    originValueFrame.setVisible(true);
                    b.setVisible(false);
                    c.setVisible(false);
                } else if (pokerRule.isLaizi(val, laiziValue)) {
                    if (originValueFrame) {
                        originValueFrame.setVisible(false);
                    }
                    if (!laizi) {
                        laizi = new cc.Sprite(LAIZI_TEXTURE);
                        laizi.setName('laizi');
                        laizi.setAnchorPoint(cc.p(0.5, 0.5));
                        laizi.setPosition(b.getPosition());
                        pai.addChild(laizi);
                    }
                    laizi.setVisible(true);
                    b.setVisible(false);
                    c.setVisible(false);
                } else {
                    if (laizi) {
                        laizi.setVisible(false);
                    }
                    if (originValueFrame) {
                        originValueFrame.setVisible(false);
                    }
                }
            } else {
                // 改扑克牌面备份
                var originValue = null;
                if (val >= 100) {
                    originValue = val % 100;
                    val = (val - originValue) / 100 - 1;
                }
                if (val == -1) {
                    pai.setTexture('res/submodules/pdk_match/PkScene/pai_back3.png');
                } else {
                    var arr = this.getPaiNameById_PDK(val);
                    setSpriteFrameByPath(pai, arr, 'res/submodules/pdk_match/PkScene/newpoker.plist');
                }

                var a = pai.getChildByName('a');
                if (a) a.setVisible(false);
                var b = pai.getChildByName('b');
                if (b) b.setVisible(false);
                var c = pai.getChildByName('c');
                if (c) c.setVisible(false);
            }

            if (row == 2) {
                if (!pai.getUserData().isLiang || !this.isMyTurn()) {
                    Filter.grayMask(pai);
                }
            }
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
                    if (row != 2 && row != 20 && row != 0 && row != 10 && row != 30 && row != 40) {
                        var a10 = $("row" + row + ".a10");
                        a10.setLocalZOrder(row == 1 ? 90 : 10);
                    }

                    node = duplicateSprite(a0, true);
                    var dis = posConf.paiADistance[row];
                    dis = dis || posConf.paiADistance[row == 0 ? -63 : row / 10];
                    dis = ((row == 10 || row == 40 || row == 30) ? (row == 30 ? 63 : -63) : dis);
                    node.setPositionX(dis * (row == 1 || row == 3 ? (id < 10 ? id : (id - 10)) : id) + a0.getPositionX());
                    if (row != 2 && row != 20 && row != 0 && row != 10 && row != 30 && row != 40) {
                        node.setPositionY(id < 10 ? a0.getPositionY() : a10.getPositionY());
                    }
                    node.setName("a" + id);
                    node.setVisible(false);
                    a0.getParent().addChild(node, row == 1 ? (id < 10 ? -id : 100 - id) : (row == 10 || row == 40 ? -id : id));
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
        getShareTitleOfAbsent: function () {
            var absent = '';
            if (gameData.playerNum == 4) {
                if (gameData.players.length == 1) {
                    absent = "一缺三";
                }
                if (gameData.players.length == 2) {
                    absent = "二缺二";
                }
                if (gameData.players.length == 3) {
                    absent = "三缺一";
                }
                return absent;
            }
            if (gameData.playerNum == 3) {
                if (gameData.players.length == 1) {
                    absent = "一缺二";
                }
                if (gameData.players.length == 2) {
                    absent = "二缺一";
                }
                return absent;
            }
            if (gameData.playerNum == 2) {
                if (gameData.players.length == 1) {
                    absent = "一缺一";
                }
                return absent;

            }
        },
        getPaiId: function (row, id) {
            var userData = this.getPai(row, id).getUserData();
            return userData.pai;
        },
        hidePlayerStatus: function (row) {
            var spStatus = $("sp_status" + row);
            if (spStatus)
                spStatus.setVisible(false);
        },
        hideAllPlayersStatus: function () {
            for (var row = 1; row <= 3; row++) {
                var spStatus = $("sp_status" + row);
                if (spStatus)
                    spStatus.setVisible(false);
            }
        },
        setPlayerStatus: function (row, status) {
            var spStatus = $("sp_status" + row);
            if (!spStatus) {
                spStatus = new cc.Sprite(TEXT_2_FILENAME[status]);
                spStatus.setName("sp_status" + row);
                spStatus.setPosition($("pos_c" + row).getPosition());
                this.getRootNode().addChild(spStatus);
            }
            spStatus.setTexture(TEXT_2_TEXTURE[status]);
            spStatus.setVisible(true);
            setTimeout(function () {
                spStatus.setVisible(false);
            }, 100)
        },
        recalcPos: function (row, paiCnt) {
            if (row != 2 && row != 20)
                return;

            if (row == 2 && _.isUndefined(paiCnt))
                paiCnt = this.getPaiArr().length;

            var distance = posConf.paiADistance[row];
            if (row == 2) {
                if (paiCnt < 19) {
                    distance = posConf.paiADistance[row] * 18 / (paiCnt - 1);
                    distance = distance <= (0.5 * posConf.paiASize[row].width) ? distance : (0.5 * posConf.paiASize[row].width);
                }
                var a0 = $("row" + row + ".a0");
                posConf.paiTouchRect = cc.rect(0, 0, distance, a0.getContentSize().height);
                for (var i = 0; i < paiCnt; i++) {
                    this.getPai(row, i).setPositionX(distance * i + a0.getPositionX());
                }
            }
            var width = (paiCnt - 1) * distance + posConf.paiASize[row].width;
            width *= $("row" + row).getScaleX();
            $("row" + row).setPositionX((cc.winSize.width - width) / 2 - (cc.winSize.width/2 - 1280/2));
        },
        hidePai: function (row, id) {
            this.getPai(row, id).setVisible(false);
        },
        getPaiArr: function () {
            var arr = [];
            for (var j = 0; j < initPaiNum; j++) {
                var pai = this.getPai(2, j);
                var userData = pai.getUserData();
                if (userData.pai >= 0 && pai.isVisible()) {
                    pai.setVisible(true);
                    arr.push(userData.pai);
                } else if (!this.isByMySelf && !isReplay) {
                    arr.push(-1);
                    pai.setVisible(true);
                } else {
                    pai.setVisible(false);
                }
            }
            return arr;
        },
        removePaiArr: function (_arr) {
            var arr = deepCopy(_arr);
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i] % 100;
            }
            var paiArr = this.getPaiArr();
            var newPaiArr = [];
            for (var i = 0; i < paiArr.length; i++) {
                if (arr.indexOf(paiArr[i]) < 0)
                    newPaiArr.push(paiArr[i]);
                else
                    arr.splice(arr.indexOf(paiArr[i]), 1);
            }
            return newPaiArr;
        },
        getUpPaiArr: function () {
            var arr = [];
            for (var j = 0; j < initPaiNum; j++) {
                var pai = this.getPai(2, j);
                var userData = pai.getUserData();
                if (pai.isVisible() && userData.pai >= 0 && !userData.isDowning && (userData.isUp || userData.isUpping))
                    arr.push(userData.pai);
            }
            return arr;
        },
        addUsedPai: function () {
            var cache = {};
            return function (row, val) {
                cache[row] = cache[row] || {};
                for (var j = 0; j < 24; j++) {
                    var pai = cache[row][j] || $("row" + row + ".c0.b" + j);
                    if (!pai) {
                        var k = (j >= 0 && j < 10 ? 0 : 10);
                        var b = $("row" + row + ".c0.b" + k);
                        pai = duplicateSprite(b);
                        if (row == 0 || row == 2) pai.setPositionX(posConf.paiUsedDistance[row] * (j - k) + b.getPositionX());
                        if (row == 1 || row == 3) pai.setPositionY(posConf.paiUsedDistance[row] * (j - k) + b.getPositionY());
                        pai.setName("b" + j);
                        pai.setVisible(false);
                        b.getParent().addChild(pai, j * posConf.paiUsedZOrder[row][k]);
                        cache[row][j] = pai;
                    }

                    pai.setUserData({idx: j, pai: val});

                    if (!pai.isVisible()) {
                        //var userData = pai.getUserData();
                        var paiName = this.getPaiNameById_PDK(val);
                        cc.log("painame = " + paiName);
                        //userData.pai = val;
                        setSpriteFrameByName(pai, paiName, "zjh/card/poker_b");
                        pai.setVisible(true);
                        return pai;
                    }
                }
            }
        },
        getRoomState: function () {
            return roomState;
        },
        setRoomState: function (state) {
            var arr = decodeURIComponent(gameData.wanfaDesp != "null" ? gameData.wanfaDesp : "").split(',');
            if (arr.join(",").indexOf("二人玩") != -1) {
                gameData.playerNum = 2;
            }
            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                if (arr.join(",").indexOf("15张") != -1) {
                    initPaiNum = 15;
                } else {
                    initPaiNum = 16;
                }
            }
            gameData.showLeft = arr.join(",").indexOf("显示余牌") != -1;
            gameData.anticheating = arr.join(",").indexOf("防作弊") != -1;
            this.isChooseHeiSan = arr.join(",").indexOf("黑桃3先出") != -1;
            gameData.pdk3Abomb = arr.join(",").indexOf("3A当炸弹") != -1 || arr.join(",").indexOf("三A当炸弹") != -1;
            gameData.pdk3A1bomb = arr.join(",").indexOf("3A带1张当炸弹") != -1 || arr.join(",").indexOf("三A带1张当炸弹") != -1;

            if (arr.length >= 1)
                arr = arr.slice(0);
            var wanfaStr = arr.join(" ");


            if (state == ROOM_STATE_CREATED) {
                $("signal").setVisible(false);
                $("setting").setVisible(false);
                $("btn_tuichu").setVisible(false);
                $("chat").setVisible(false);
                if ($("timer")) {
                    $("timer").setVisible(false);
                }
                $("timer2").setVisible(false);
                $('info2.paiming').setVisible(false);
                // $('btn_auto').setVisible(false);
                if (gameData.matchId) {
                    $('safenode').setVisible(false);
                    $('btn_fanhui').setVisible(false);
                    $('bsks').setVisible(true);
                }

                this.setInviteBtn(!window.inReview);
                if (mapId == MAP_ID.ZJH) {
                    $("btn_begin").setVisible(false);
                    // removeLightButton($("btn_begin"));
                }
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    $('bg_bei').setVisible(true);
                    $('bg_bei.lb_bei').setString('1倍');
                    $('lb_jiaofen').setVisible(true);
                    $('lb_jiaofen').setString('叫0分');
                }
                $("btn_fanhui").setVisible(gameData.uid != gameData.ownerUid);
                $("btn_jiesan").setVisible(gameData.uid == gameData.ownerUid);
                gameData.isOpen = false;
                $('btn_chakanjiesuan').setVisible(false);
                $("btn_zhunbei").setVisible(false);
                $('btn_ready').setVisible(true);
                $("btn_mic").setVisible(false);
                $("lb_roomid").setString(gameData.roomId);
                $("lb_wanfa").setString(wanfaStr);
                $("lb_roomid").setVisible(true);
                $("row1").setVisible(false);
                $("row2").setVisible(false);
                $("row3").setVisible(false);
                if (mapId == MAP_ID.ZJH) {
                    $("row1b").setVisible(false);
                    $("row2b").setVisible(false);
                    $("row3b").setVisible(false);
                    $("row4b").setVisible(false);
                    $("row5b").setVisible(false);
                    $("row4").setVisible(false);
                    $("row5").setVisible(false);
                    $('top_panel').setVisible(false);
                    $('top_panel_mine').setVisible(false);
                }
                if (mapId != MAP_ID.ZJH) {
                    $("row20").setVisible(false);
                }
                //$("btn_info").setVisible(false);
                if (gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                    $("lb_roomid").setVisible(false);
                    $("lb_roomid_").setVisible(false);
                    $("imgbg_roomid").setVisible(false);
                }

                $("btn_fanhui").setVisible(gameData.mapId == MAP_ID.PDK_JBC);
                console.log('fanhui=>',gameData.mapId == MAP_ID.PDK_JBC);
                $("btn_jiesan").setVisible(gameData.mapId != MAP_ID.PDK_JBC);

                disabledChuPaiIdMap = {};
            }
            if (state == ROOM_STATE_ONGOING) {
                if(this.assistant) {
                    this.assistant.removeFromParent(true);
                    this.assistant = null;
                }

                var setting = $("setting");
                if (!setting || !cc.sys.isObjectValid(setting))
                    return network.disconnect();
                setting.setVisible(true);
                $("btn_tuichu").setVisible(true);
                $("signal").setVisible(!isReplay);
                $("chat").setVisible(true);
                if ($("timer")) {
                    $("timer").setVisible(true);
                }
                $("timer2").setVisible(true);
                this.setInviteBtn(false);
                if (mapId == MAP_ID.ZJH) {
                    $("btn_begin").setVisible(false);
                    // removeLightButton($("btn_begin"));
                }
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    $('bg_bei').setVisible(true);
                    $('lb_jiaofen').setVisible(true);
                }
                $("btn_fanhui").setVisible(false);
                $("btn_jiesan").setVisible(false);
                gameData.isOpen = true;
                $('btn_chakanjiesuan').setVisible(false);
                $("btn_zhunbei").setVisible(false);
                $('btn_ready').setVisible(false);
                $("btn_mic").setVisible(!window.inReview);
                $("lb_roomid").setString(gameData.roomId);
                $("lb_wanfa").setString(wanfaStr);
                //$("lb_roomid").setVisible(false);
                $("row1").setVisible(false);
                $("row2").setVisible(false);
                $("row3").setVisible(false);
                $("row20").setVisible(false);
                if (mapId == MAP_ID.ZJH) {
                    $("row1b").setVisible(false);
                    $("row2b").setVisible(false);
                    $("row3b").setVisible(false);
                    $("row4b").setVisible(false);
                    $("row5b").setVisible(false);
                    $("row4").setVisible(false);
                    $("row5").setVisible(false);
                }

                $("timer2.Text_5").setString(gameData.leftRound);
                if (mapId == MAP_ID.ZJH) {
                    for (var i = 1; i < 6; i++)
                        $("info" + i + ".ok").setVisible(false);
                }
                else {
                    for (var i = 1; i <= 3; i++)
                        $("info" + i + ".ok").setVisible(false);
                }

                if (mapId != MAP_ID.ZJH) {
                    $("info" + 1 + ".alarm").setVisible(false);
                    $("info" + 2 + ".alarm").setVisible(false);
                    $("info" + 3 + ".alarm").setVisible(false);
                }

                if (isReplay) {
                    $("lb_time").setVisible(false);
                    $("setting").setVisible(false);
                    $("btn_tuichu").setVisible(false);
                    $("chat").setVisible(false);
                    $("btn_mic").setVisible(false);
                    this.safenode.setVisible(false);
                }
                //比赛场
                if (gameData.matchId) {
                    $('info2.paiming').setVisible(true);
                    $('bsks').setVisible(false);
                    $('timer2').setVisible(false);
                    $('timer3').setVisible(true);

                    var matchInfo = gameData.matchInfo;
                    var stage = matchInfo['stage'];
                    var tstage = matchInfo['stage_total'];

                    var mtype = matchInfo['stage_type'] || 1;
                    var tround = gameData.totalRound;

                    cc.log('tround is====================', tround);
                    var cround = gameData.curRound;

                    $('timer4.Text_2').setString(stage + '/' + tstage);
                    if(cround && tround){
                        $('timer4.Text_4').setString(cround + '/' + tround);
                    }else{
                        $('timer4.Text_4').setString('-/-');
                    }
                    // $('timer3.Text_5').setString(gameData.baseScore);

                    var str = "打立出局";
                    if (mtype == 2) {
                        str = "定局积分";
                    }
                    $('timer4.Text_1').setString(str);

                    $('timer4').setVisible(true);
                    $("lb_roomid").setVisible(false);
                    $("lb_roomid_").setVisible(false);
                    $("imgbg_roomid").setVisible(false);
                    $("btn_tuichu").setVisible(false);
                    $("btn_mic").setVisible(false);
                    $('safenode').setVisible(false);
                }
            }
            if (state == ROOM_STATE_ENDED) {
                if ($("timer")) {
                    $("timer").setVisible(false);
                }
                $("timer3").setVisible(false);
                this.hideOps();
                $('btn_ready').setVisible(false);
                //比赛场 ...报警不显示
                if (gameData.matchId) {
                    $("info1.alarm").setVisible(false);
                    $("info2.alarm").setVisible(false);
                    $("info3.alarm").setVisible(false);
                }
            }
            if (state == ROOM_STATE_CREATED || state == ROOM_STATE_ENDED)
                this.hideAllPlayersStatus();

            roomState = state;
        },
        clearTable4StartGame: function (isInitPai, isReconnect, reconnectData) {
            var that = this;
            that.jieSuanData = null;
            that.isShowFirst = true;
            this.onPlayerEnterExit();

            $("ops").setVisible(false);
            if ($("timer")) {
                $("timer").setVisible(false);
            }

            if (isReconnect) {
                //noinspection JSUnusedLocalSymbols
                if (mapId != MAP_ID.ZJH) {
                    var paiArr = this.getPaiArr();
                }
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    $('lb_jiaofen').setString('叫' + data['difen'] + '分');
                    $('bg_bei.lb_bei').setString(data['bei'] + '倍');
                }
                curChuPaiArr = reconnectData["chu_pai_arr"];
                curChuPaiUid = reconnectData["chu_pai_uid"];
                hasChupai = reconnectData["has_chu"];
                leftPaiCnt = reconnectData["left_pai_num"];
                laiziValue = data.laizi || [];
                var playerPaiArr = reconnectData["player_pai"] || [];
                var myPai;
                for (var i = 0; i < playerPaiArr.length; i++) {
                    var playerPai = playerPaiArr[i];
                    var paiArr = playerPai["pai_arr"];
                    //test code
                    // paiArr = [3,4,5,6, 8,9,10,23,36,49];
                    var chuPaiArr = playerPai["chu_pai_arr"];
                    var curPaiNum = playerPai["cur_pai_num"];
                    var isOffline = !!playerPai["is_offline"];
                    var first = playerPai["is_first"];
                    var cur_chupai_uid = playerPai['cur_chupai_uid'];
                    if (isOffline)
                        this.playerOnloneStatusChange(uid2position[playerPai.uid], isOffline);
                    var row = uid2position[playerPai.uid];
                    if (undefined == row) {//跑得快两人玩的时候 playerPaiArr.length = 3 第三个字段全为空字符串
                        continue;
                    }
                    if ((mapId == MAP_ID.PDK || mapId == MAP_ID.PDK_JBC || mapId == MAP_ID.PDK_MATCH) && uid2position[cur_chupai_uid] != 2 && first) {
                        that.isByMySelf = false;
                    }
                    if (row == 2 && mapId != MAP_ID.ZJH) {
                        if (gameData.anticheating) {
                            if (that.isByMySelf) {
                                that.setPaiArrOfRow(row, paiArr);
                            }
                            else {
                                that.paiArrOfShow = paiArr;
                                that.showBack = true;
                                that.setPaiArrBgOfRow(row, paiArr.length);
                            }
                        }
                        else {
                            that.setPaiArrOfRow(row, paiArr);
                        }

                    }

                    if (that.getRoomState() == ROOM_STATE_ONGOING && mapId != MAP_ID.ZJH)
                        that.setPaiArrOfRow((row == 2 ? 20 : row), chuPaiArr);
                    else if (that.getRoomState() == ROOM_STATE_ENDED) {
                        if (mapId != MAP_ID.ZJH) {
                            that.setPaiArrOfRow((row == 2 ? 20 : row), paiArr);
                        }
                    }
                    if (mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                        if ($('info' + row + ".left_bg")) {
                            if (gameData.showLeft) {
                                $('info' + row + ".left_bg").setVisible(true);
                                $('info' + row + ".left_bg.left").setString(curPaiNum + "张");
                            } else {
                                $('info' + row + ".left_bg").setVisible(false);
                            }

                        }
                    }

                    if (mapId != MAP_ID.ZJH) {
                        $("row" + row).setVisible(true);
                    }
                    if (mapId == MAP_ID.ZJH) {
                        if (row == 2) {
                            myPai = deepCopy(playerPai);
                            that.ZJHthrowTurn(uid2position[reconnectData['turn_uid']], {
                                gen_round: reconnectData['gen_round'],
                                men_round: reconnectData['men_round'],
                                bi_round: reconnectData['bi_round'],
                                total_chip: reconnectData['total_chip'],
                                kan: playerPai['kan'],
                                gen_score: playerPai['gen_score'],
                                jia: reconnectData['jia'],
                                bi: reconnectData['bi'],
                                read: playerPai['read']
                            });
                            $('kan').setVisible(!!playerPai['kan']);
                            if (playerPai['card_type'] && playerPai['card_type'] != '' && playerPai['card_type'] != "0") {
                                $('row' + row + '.cardtype').setVisible(true);
                                $('row' + row + '.cardtype').loadTexture('res/ui/resources/character/cardtype' + playerPai['card_type'] + '.png');
                            } else {
                                $('row' + row + '.cardtype').setVisible(false);
                            }
                            if (!playerPai['has_xia']) {
                                $('top_panel_mine').setVisible(false);
                            } else {
                                $('top_panel_mine').setVisible(true);
                                $('top_panel_mine.yixianum').setString(playerPai['has_xia']);
                            }
                        }
                    }

                    if (that.getRoomState() == ROOM_STATE_ONGOING) {
                        if (mapId != MAP_ID.ZJH) {
                            var isBeat = playerPai["is_beat"];
                            if (isBeat) {
                                that.hidePlayerStatus(row);
                            } else {
                                if (row != 2)
                                    $("row" + row).setVisible(false);
                                //that.setPlayerStatus(row, TEXT_YAOBUQI);
                            }
                        } else {
                            if (row == 2) {
                                if (playerPai['read']) {
                                    $('row2').setVisible(true);
                                    $('row2b').setVisible(false);
                                    for (var j = 0; j < playerPai['pai_arr'].length; j++) {
                                        that.setPai(2, j, playerPai['pai_arr'][j], true);
                                    }
                                    if (playerPai['isloser'] || playerPai['isqi']) {
                                        $('row2b').setVisible(true);
                                        for (var j = 0; j < 3; j++) {
                                            $('row' + row + 'b.b' + j).setVisible(false);
                                        }
                                        that.updateCardStatusZJH(2, playerPai['isqi'] ? 'qi' : 'shu');
                                    }
                                } else {
                                    $('row' + row + 'b').setVisible(true);
                                    $('row' + row).setVisible(false);
                                    if (playerPai['isloser'] || playerPai['isqi']) {
                                        $('row2b').setVisible(true);
                                        for (var j = 0; j < 3; j++) {
                                            $('row' + row + 'b.b' + j).setTexture('res/image/ui/poker/unit/pai_backold.png');
                                        }
                                        that.updateCardStatusZJH(2, playerPai['isqi'] ? 'qi' : 'shu');
                                    }
                                }
                                $('ops.gen.txt').setString('跟注x' + playerPai['gen_score']);
                            } else {
                                $('row' + row + 'b').setVisible(true);
                                $('row' + row).setVisible(false);
                                if (playerPai['read']) {
                                    that.updateCardStatusZJH(row, 'kan');
                                }
                                if (playerPai['isloser'] || playerPai['isqi']) {
                                    for (var j = 0; j < 3; j++) {
                                        $('row' + row + 'b.b' + j).setTexture('res/ui/resources/unit/pai_backold.png');
                                    }
                                    that.updateCardStatusZJH(row, playerPai['isqi'] ? 'qi' : 'shu');
                                }
                            }
                        }
                    }
                    if (that.getRoomState() == ROOM_STATE_ENDED && paiArr.length == 0 && mapId != MAP_ID.ZJH)
                        that.setPlayerStatus(row, TEXT_DAWANLA);
                    //if (row != 2 && mapId != MAP_ID.ZJH) {
                    if (mapId != MAP_ID.ZJH) {
                        if (curPaiNum <= 1) {
                            that.playAlarmAnim(row);
                        } else {
                            if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                                $("info" + row + ".pai_back").setVisible(true);
                            }
                        }
                        if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                            $("info" + row + ".txt_left").setVisible(true);
                            var txt = $("info" + row + ".txt_left");
                            txt.setString(curPaiNum);
                        }
                    }
                    curLeftPaiCntMap[row] = curPaiNum;
                }

                gameData.unused_paiArr = data["unused_card_arr"];
                if ((gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) && data["chu_pai_arr"] != 0) {
                    this.changeShenFen(gameData.zhuangUid);
                }
                if (mapId != MAP_ID.ZJH) {
                    forRows(function (i) {
                        this.recalcPos(i)
                    });
                }
                if (roomState == ROOM_STATE_ONGOING) {
                    if (mapId != MAP_ID.ZJH) {
                        this.enableChuPai();
                    }
                } else if (roomState == ROOM_STATE_ENDED) {
                    if (mapId != MAP_ID.ZJH) {
                        for (var i = 0; i < playerPaiArr.length; i++) {
                            var playerPai = playerPaiArr[i];
                            if (playerPai["uid"]) {//两人玩BUG
                                var isReady = !!playerPai["is_ready"];
                                if (isReady)
                                    that.setReady(playerPai["uid"]);
                                else {
                                    if (playerPai["uid"] == gameData.uid)
                                        that.showReadyBtn();
                                }

                            }

                        }
                    } else {
                        $('kan').setVisible(false);
                        $('ops').setVisible(false);
                        for (var i = 1; i < 6; i++) {
                            that.updateCardStatusZJH(i);
                        }
                        if (myPai['read']) {
                            $('row2').setVisible(true);
                            $('row2b').setVisible(false);
                            for (var j = 0; j < myPai['pai_arr'].length; j++) {
                                that.setPai(2, j, myPai['pai_arr'][j], true);
                            }
                        } else {
                            $('row' + row + 'b').setVisible(true);
                            $('row' + row).setVisible(false);
                        }
                    }
                    //清理上局残留
                    $("info1.alarm").setVisible(false);
                    $("info1.left_bg").setVisible(false);
                    $("info2.alarm").setVisible(false);
                    $("info2.left_bg").setVisible(false);
                    $("info3.alarm").setVisible(false);
                    $("info3.left_bg").setVisible(false);
                }
            }
            else if (isInitPai) {
                if (mapId != MAP_ID.ZJH) {
                    forRows(function (i) {
                        this.recalcPos(i);
                    });
                    $("info1.pai_back").setVisible(false);
                    $("info1.txt_left").setVisible(false);
                    $("info3.pai_back").setVisible(false);
                    $("info3.txt_left").setVisible(false);
                }
            }
        },
        playPokerAnim: function (row, fileName, actionName, isLoop, length) {
            var posNode = $("pos_c" + row);
            if (row == 1) {
                if (actionName == 'sandai1') {
                    actionName = 'sandai2';
                } else if (actionName == 'zhadanzi') {

                } else if (actionName == 'sidaisan1') {
                    actionName = 'sidaisan2';
                } else {
                    actionName = actionName + "2";
                }
            }
            var spNode = playSpAnimation(fileName, actionName, isLoop);
            spNode.setEndListener(function () {
                setTimeout(function () {
                    spNode.removeFromParent();
                }, 1)
            })
            posNode.addChild(spNode);
            posNode.setLocalZOrder(100);

            if (length > 0) {
                if (row == 1) {
                    spNode.setPositionX(-(138 + (length - 1) * 54) * 0.35);
                } else if (row == 3) {
                    spNode.setPositionX((138 + (length - 1) * 54) * 0.35);
                }
            } else {
                if (row == 1) {
                    spNode.setPositionX(100);
                } else if (row == 3) {
                    spNode.setPositionX(-100);
                }
            }

        },
        playAircraftAnim: function () {
            playEffect("vcom_airplane_the_first_time");
            var transparent = $("transparent");
            transparent.setVisible(false);
            transparent.setOpacity(255);
            // $("transparent").setVisible(true);
            transparent.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.66);
            playFrameAnim(res.air_plist, "air", 3, 0.05, true, $("transparent"));
            transparent.setPositionX(cc.winSize.width * 0.25);
            transparent.runAction(cc.sequence(
                cc.spawn(cc.moveBy(1, cc.winSize.width * 0.5, 0), cc.sequence(cc.delayTime(0.8), cc.fadeOut(0.2))),
                cc.callFunc(function () {
                    $("transparent").setVisible(false);
                })));
            // transparent.runAction(cc.moveBy(1, cc.winSize.width * 0.5, 0));
            transparent.setVisible(true);
        },
        playAlarmAnim: function (row) {
            var that = this;
            var sp = $("info" + row + ".alarm");
            sp.setVisible(true);
            var bk = $("info" + row + ".pai_back");
            bk.setVisible(false);

            playAnimScene(sp, res.Warning_json, 32, 0, true);
        },
        chuPai: function (row, paiArr, leftPaiCnt) {
            var that = this;

            if (false) ;
            else if (leftPaiCnt == 1 && row == 2)
                playEffect("vI_got_left_one_cards_erdou", position2sex[row]);
            else if (false && leftPaiCnt == 2 && row == 2 && (gameData.mapId != MAP_ID.PDK || gameData.mapId != MAP_ID.PDK_MATCH || gameData.mapId != MAP_ID.PDK_JBC))
                playEffect("vI_got_left_two_cards_erdou", position2sex[row]);
            else if (leftPaiCnt == 1 && row != 2)
                playEffect("vI_got_left_one_cards", position2sex[row]);
            else if (false && leftPaiCnt == 2 && row != 2 && (gameData.mapId != MAP_ID.PDK || gameData.mapId != MAP_ID.PDK_MATCH || gameData.mapId != MAP_ID.PDK_JBC))
                playEffect("vI_got_left_two_cards", position2sex[row]);
            else {
                var cardType = pokerRule.judgeType(paiArr);
                if (paiArr.length > 0)
                    var pai_for_voice = paiArr[0] < 100 ? paiArr[0] : (Math.floor(paiArr[0] / 100) - 1);
                if (cardType == pokerRule.CardType.c1)
                    playEffect("v" + PAIID2CARD[pai_for_voice].voice, position2sex[row]);
                else if (cardType == pokerRule.CardType.c2)
                    playEffect("vpair" + PAIID2CARD[pai_for_voice].voice, position2sex[row]);
                else if (cardType == pokerRule.CardType.c3) {
                    playEffect("vthree_one", position2sex[row]);
                    setTimeout(function () {
                        playEffect("v" + PAIID2CARD[pai_for_voice].voice, position2sex[row]);
                    }, 600);
                }
                else if (cardType == pokerRule.CardType.c4 || cardType == pokerRule.CardType.c42 ||
                    (cardType == pokerRule.CardType.c3A && (gameData.pdk3Abomb || gameData.pdk3A1bomb)) ||
                    (cardType == pokerRule.CardType.c3A1 && gameData.pdk3A1bomb)) {
                    playEffect("vbomb", position2sex[row]);
                    playEffect("vcom_bomb");
                    $("transparent").setVisible(true);
                    $("transparent").setOpacity(255);
                    $("transparent").setPosition(cc.winSize.width / 2, cc.winSize.height * 0.66);
                    playFrameAnim(res.bomb_plist, "bomb", 12, 0.05, false, $("transparent"), function () {
                        $("transparent").setVisible(false);
                    });
                }
                else if (cardType == pokerRule.CardType.c1122) {
                    playEffect("vcontinuous_pair", position2sex[row]);
                    playEffect("vcom_continuous_pair");
                }
                else if (cardType == pokerRule.CardType.c31)
                    playEffect("vthree_with_one", position2sex[row]);
                else if (cardType == pokerRule.CardType.c32)
                    playEffect("vthree_with_one_pair", position2sex[row]);
                else if (cardType == pokerRule.CardType.c123) {
                    playEffect("vshunzi", position2sex[row]);
                    playEffect("vcom_shunzi");
                }
                else if (cardType == pokerRule.CardType.c11122234) {
                    playEffect("vaircraft_with_wings", position2sex[row]);
                    //that.playAircraftAnim();
                }
                else if (cardType == pokerRule.CardType.c111222) {
                    playEffect("vairplane", position2sex[row]);
                    //that.playAircraftAnim();
                }
                else if (cardType == pokerRule.CardType.c1112223344) {
                    playEffect("vaircraft_with_wings", position2sex[row]);
                    //that.playAircraftAnim();
                } else if (cardType == pokerRule.CardType.c4111) {//四代三音效
                    playEffect("vfour_with_three", position2sex[row]);
                }
            }
            switch (cardType) {
                case pokerRule.CardType.c1112223344:
                case pokerRule.CardType.c111222:
                case pokerRule.CardType.c11122234:
                    // that.playTextAnim(row, TEXT_FEIJI);
                    // that.playPokerAnim(row, 'feijizhadan', 'feijidonghua', false, paiArr.length);
                    var spNode = playSpAnimation('feijizhadan', 'feijidonghua', false);
                    spNode.setEndListener(function () {
                        setTimeout(function () {
                            spNode.removeFromParent();
                        }, 1)
                    })
                    // $("transparent").addChild(spNode);
                    spNode.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.65);
                    this.addChild(spNode);
                    break;
                case pokerRule.CardType.c123:
                    // that.playTextAnim(row, TEXT_SHUNZI);
                    that.playPokerAnim(row, 'shenglishibai', 'shunzi', false, paiArr.length);
                    break;
                case pokerRule.CardType.c32:
                    // that.playTextAnim(row, TEXT_SANDAIYIDUI);
                    that.playPokerAnim(row, 'shenglishibai', 'sandaiyi', false, paiArr.length);
                    break;
                case pokerRule.CardType.c31:
                    // that.playTextAnim(row, TEXT_SANDAIYI);
                    that.playPokerAnim(row, 'shenglishibai', 'sandai1', false, paiArr.length);
                    break;
                case pokerRule.CardType.c1122:
                    // that.playTextAnim(row, TEXT_LIANDUI);
                    that.playPokerAnim(row, 'shenglishibai', 'liandui', false, paiArr.length);
                    break;
                case pokerRule.CardType.c4111:
                    that.playPokerAnim(row, 'shenglishibai', 'sidaisan1', false, paiArr.length);
                    break;
                case pokerRule.CardType.c4:
                case pokerRule.CardType.c42:
                    // that.playTextAnim(row, TEXT_ZHADAN);
                    that.playPokerAnim(row, 'feijizhadan', 'zhadanzi', false, paiArr.length);
                    var spNode = playSpAnimation('feijizhadan', 'zhadan', false);
                    spNode.setEndListener(function () {
                        setTimeout(function () {
                            spNode.removeFromParent();
                        }, 1)
                    })
                    // $("transparent").addChild(spNode);
                    spNode.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.55);
                    this.addChild(spNode);
                    break;
            }

            if ($("timer")) {
                $("timer").setVisible(false);
            }

            $("row" + (row == 2 ? 20 : row)).setVisible(true);

            if (row == 2) {
                var newPaiArr = that.removePaiArr(paiArr);
                that.setPaiArrOfRow(2, newPaiArr);
                that.recalcPos(2, newPaiArr.length);
                that.downPai(2, -1);

                $("row20").setVisible(true);
                that.setPaiArrOfRow(20, paiArr);
                that.recalcPos(20, paiArr.length);

                if (leftPaiCnt <= 1) {
                    that.playAlarmAnim(row);
                } else {
                    if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                        $("info" + row + ".pai_back").setVisible(true);
                    }
                }
            }
            else {
                that.setPaiArrOfRow(row, paiArr);
                var a0 = $("row" + row + ".a0");
                // for (var i = 1; i < paiArr.length; i++) {
                //     var a = $("row" + row + ".a" + i);
                //     a.setPosition(a0.getPosition());
                //
                //     a.runAction(cc.moveTo(0.06 * i, a0.getPositionX() + posConf.paiADistance[row] * i, a0.getPositionY()).easing(cc.easeExponentialOut()))
                // }

                if (leftPaiCnt <= 1) {
                    that.playAlarmAnim(row);
                } else {
                    if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                        $("info" + row + ".pai_back").setVisible(true);
                    }
                }
                if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                    $("info" + row + ".txt_left").setVisible(true);
                    var txt = $("info" + row + ".txt_left");
                    txt.setString(leftPaiCnt);
                }
            }
        },
        checkPaiPos: function (row) {
            // todo
            // for (var j = 0; j < 14; j++) {
            //     var pai = this.getPai(row, j);
            //     var userData = pai.getUserData();
            //     //pai.setPositionX(posConf.paiPos[2][j].x);
            //     //console.log(j + "  " + userData.isUp);
            //     if (!userData.isUpping && !userData.isDowning)
            //         pai.setPosition(posConf.paiPos[2][j].x, (userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY));
            // }
        },
        enableChupaiBtn: function () {
            var that = this;

            // var chuPaiArr = this.getUpPaiArr();
            that.enableBtn("ops.chupai");
            TouchUtils.setOnclickListener($("ops.chupai"), function () {
                if (resultTypes.length == 1) {
                    network.send(4002, {room_id: gameData.roomId, cards: resultTypes[0].cardArr});
                    that.hideOps();
                } else if (resultTypes.length > 1) {
                    that.showChosePai();
                    that.hideOps();
                }
            });
        },
        disableChupaiBtn: function () {
            this.disableBtn("ops.chupai");
        },
        checkCanChupai: function () {
            var paiArr = this.getPaiArr();
            var chuPaiArr = this.getUpPaiArr();

            var flag = getSortFlag();
            paiArr.sort(function (a, b) {
                return flag * (PAIID2CARD[b].weight - PAIID2CARD[a].weight)
            });
            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH || gameData.mapId == MAP_ID.XIANGYANG_PDK) {
                // for paodekuai
                var nextPlayerLeftPaiCnt = curLeftPaiCntMap[1];
                var idx = flag > 0 ? 0 : paiArr.length - 1;
                if (nextPlayerLeftPaiCnt <= 1 && chuPaiArr.length == 1 && paiArr.length > 0 &&
                    PAIID2CARD[paiArr[idx]].weight != PAIID2CARD[chuPaiArr[0]].weight) {
                    this.disableChupaiBtn();
                    return this.showTip('下家已报单, 你出的牌不符合规则');
                }
                else
                    this.hideTip();
            }

            var isMyLastHandCards = chuPaiArr.length == paiArr.length;
            resultTypes = pokerRule.checkCards(curChuPaiUid == gameData.uid ? null : curChuPaiArr, chuPaiArr, isMyLastHandCards, laiziValue);
            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
                // for paodekuai
                if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c111222 && !(resultTypes.length > 0 && chuPaiArr.length == 6 && paiArr.length == 6))
                    resultTypes = [];
                if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c3 && !(resultTypes.length > 0 && chuPaiArr.length == 3 && paiArr.length == 3))
                    resultTypes = [];
                // if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c3A && !gameData.pdk3Abomb) {
                //     resultTypes = [];
                // }
                // if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c3A1 && !gameData.pdk3A1bomb) {
                //     resultTypes = [];
                // }

                //
                if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c3A && !gameData.pdk3Abomb && !gameData.pdk3A1bomb) {
                    resultTypes = [];
                }
                if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c3A1 && !gameData.pdk3A1bomb) {
                    resultTypes = [];
                }

                if (pokerRule.judgeType(chuPaiArr) == pokerRule.CardType.c31 && chuPaiArr.length == 4 && paiArr.length == 4)
                    resultTypes = [{type: pokerRule.CardType.c31, cardArr: deepCopy(chuPaiArr)}];
            }
            if (resultTypes.length > 0)
                this.enableChupaiBtn();
            else
                this.disableChupaiBtn();
        },
        // upPaiByPaiArr: function (upPaiArr) {
        //     this.downAllPaiImmediately();
        //     var paiArr = this.getPaiArr();
        //     var upedPaiIdxMap = {};
        //     for (var i = 0; i < upPaiArr.length; i++) {
        //         var paiValue = upPaiArr[i] < 100 ? upPaiArr[i] : (upPaiArr[i] % 100);
        //         var j = -1;
        //         while (true) {
        //             j = paiArr.indexOf(paiValue, j + 1);
        //             if (j < 0)
        //                 break;
        //             if (j >= 0 && !upedPaiIdxMap[paiValue]) {
        //                 upedPaiIdxMap[paiValue] = 1;
        //                 this.upPai(2, j);
        //             }
        //         }
        //     }
        //     this.checkCanChupai();
        // },
        upPaiByPaiArr: function (upPaiArr, tishiArr, idx) {
            this.downAllPaiImmediately();
            var paiArr = this.getPaiArr();
            var upedPaiIdxMap = {};
            var tishi = [];
            if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {

                for (var i = 0; i < tishiArr.length; i++) {
                    var arr = tishiArr[i];
                    for (var j = 0; j < arr.length; j++) {
                        var paiValue = arr[j] < 100 ? upPaiArr[j] : (arr[j] % 100);
                        tishi.push(arr[j] % 100);
                        if (idx == i) {
                            var x = -1;
                            while (true) {
                                x = paiArr.indexOf(paiValue, x + 1);
                                if (x < 0)
                                    break;

                                if (x >= 0 && !upedPaiIdxMap[paiValue]) {
                                    upedPaiIdxMap[paiValue] = 1;
                                    if (!zidongTishi || tishiArr.length == 1) {
                                        this.upPai(2, x);
                                    }
                                }
                            }
                        }
                    }
                }
                if (shangyijiaArr.length != 0) {
                    var paiType = pokerRule.judgeType(shangyijiaArr);
                    //单牌、对子、炸弹、顺子、跑得快连对
                    if (paiType == pokerRule.CardType.c1 || paiType == pokerRule.CardType.c2 || paiType == pokerRule.CardType.c4 || paiType == pokerRule.CardType.c123 || paiType == pokerRule.CardType.c1122) {
                        paiArr = pokerRule.toCardsArr(paiArr);
                        tishi = pokerRule.toCardsArr(tishi);
                        for (var i = 0; i < paiArr.length; i++) {
                            var paiValue = paiArr[i].weight;
                            this.setPaiGary(2, i, true);
                            for (var j = 0; j < tishi.length; j++) {
                                var paiValueTishi = tishi[j].weight;
                                if (paiValue == paiValueTishi) {
                                    this.setPaiGary(2, i, false);
                                }
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < upPaiArr.length; i++) {
                    var paiValue = upPaiArr[i] < 100 ? upPaiArr[i] : (upPaiArr[i] % 100);
                    var j = -1;
                    while (true) {
                        j = paiArr.indexOf(paiValue, j + 1);
                        if (j < 0)
                            break;
                        if (j >= 0 && !upedPaiIdxMap[paiValue]) {
                            upedPaiIdxMap[paiValue] = 1;
                            this.upPai(2, j);
                        }
                    }
                }
            }

            this.checkCanChupai();
        },
        setPaiGary: function (row, idx, isgray) {
            var that = this;
            var pai = that.getPai(row, idx);
            pai.getUserData().isLiang = !isgray;
            // pai.setOpacity(isgray?100:255);
            if (isgray) {
                Filter.grayMask(pai);
            } else {
                Filter.remove(pai);
            }

            // pai.setTouchEnabled(!isgray)
        },
        upPai: function (row, idx) {
            if (idx < 0)
                return;
            var that = this;
            this.checkPaiPos(row);
            var pai = that.getPai(row, idx);
            var userData = pai.getUserData();
            if (userData.isUp) {
                that.downPai(row, idx);
            }
            else if (!userData.isUp && !userData.isUpping) {
                userData.isUpping = true;
                pai.runAction(cc.sequence(
                    cc.moveTo(0.08, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                    , cc.callFunc(function () {
                        userData.isUp = true;
                        userData.isUpping = false;
                    })
                ));
            }
            else if (userData.isUp && !userData.isDowning) {
                userData.isDowning = true;
                pai.runAction(cc.sequence(
                    cc.moveTo(0.08, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                    , cc.callFunc(function () {
                        userData.isUp = false;
                        userData.isDowning = false;
                    })
                ));
            }
        },
        downAllPaiImmediately: function () {
            var paiArr = this.getPaiArr();
            for (var i = 0; i < paiArr.length; i++) {
                var pai = this.getPai(2, i);
                var userData = pai.getUserData();
                userData.isUp = false;
                userData.isUpping = false;
                userData.isDown = true;
                userData.isDowning = false;
                pai.setPositionY(posConf.downPaiPositionY);
            }
        },
        downPai: function (row, idx) {
            var that = this;
            var arr = [];
            if (idx == -1) {
                var paiArr = this.getPaiArr();
                for (var i = 0; i < paiArr.length; i++)
                    arr.push(i);
            }
            else
                arr.push(idx);
            for (var i = 0; i < arr.length; i++)
                (function (idx) {
                    var pai = that.getPai(row, idx);
                    var userData = pai.getUserData();
                    if (!userData.isUp || userData.isDowning)
                        return;
                    userData.isDowning = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(0.08, pai.getPositionX(), (userData.isUp ? posConf.downPaiPositionY : posConf.upPaiPositionY))
                        , cc.callFunc(function () {
                            userData.isUp = false;
                            userData.isDowning = false;
                            userData.slidegray = 0;
                        })
                    ));
                })(arr[i]);
        },
        enableChuPai: function () {
            if (enableChupaiCnt > 0)
                return;
            enableChupaiCnt++;

            var that = this;

            var totalPaiCnt = initPaiNum;

            var curPaiIdx = -1;
            var slideOverCnt = 0;
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    if (!that.isMyTurn())
                        return false;
                    curPaiIdx = -1;
                    slideOverCnt = 0;
                    var paiArr = that.getPaiArr();
                    var pai = -1;
                    for (var i = 0; i < initPaiNum; i++) {
                        pai = that.getPai(2, i);
                        if (!pai.isVisible())
                            break;
                        var userData = pai.getUserData();
                        userData.slideOverCnt = 0;
                        if (curPaiIdx < 0 && TouchUtils.isTouchMe(pai, touch, event, null, i == paiArr.length - 1 ? null : posConf.paiTouchRect))
                            curPaiIdx = i;
                    }
                    if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && curPaiIdx >= 0) {
                        var pai = that.getPai(2, curPaiIdx);
                        var userData = pai.getUserData();
                        if (!userData.isLiang)
                            return false;
                    }
                    return curPaiIdx >= 0;
                },
                onTouchMoved: function (touch, event) {
                    if (!that.isMyTurn())
                        return false;
                    if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && curPaiIdx >= 0) {
                        var pai = that.getPai(2, curPaiIdx);
                        var userData = pai.getUserData();
                        if (!userData.isLiang)
                            return false;
                    }
                    var pai = -1;
                    var paiArr = that.getPaiArr();
                    for (var i = 0; i < totalPaiCnt; i++) {
                        pai = that.getPai(2, i);
                        var userData = pai.getUserData();
                        if (TouchUtils.isTouchMe(pai, touch, event, null, i == paiArr.length - 1 ? null : posConf.paiTouchRect)) {
                            if (userData.slideOverCnt == 0) {
                                slideOverCnt++;
                                if (userData.isLiang) {
                                    userData.slideOverCnt++;
                                }

                                if (cc.sys.isNative && !userData.slidegray && userData.slideOverCnt && userData.isLiang) {
                                    //滑动过程中变灰  滑动完变回来
                                    userData.slidegray = 1;
                                    Filter.grayMask(pai);
                                }
                            }
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    if (!that.isMyTurn())
                        return false;
                    if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && curPaiIdx >= 0) {
                        var pai = that.getPai(2, curPaiIdx);
                        var userData = pai.getUserData();
                        if (!userData.isLiang)
                            return false;
                    }
                    if (slideOverCnt > 0) {
                        //关闭优先提示顺子
                        if(pokerRule && typeof pokerRule.automaticTip == 'function'){
                            //有之前滑起的牌  ，全部下去,重新选择
                            var upbefore = false;
                            for (var i = 0; i < initPaiNum; i++) {
                                var pai = that.getPai(2, i);
                                var userData = pai.getUserData();
                                if (pai && pai.isVisible() && userData.isUp) {
                                    upbefore = true;
                                    break;
                                }
                            }
                            if(upbefore){
                                for (var i = 0; i < initPaiNum; i++) {
                                    var pai = that.getPai(2, i);
                                    var userData = pai.getUserData();
                                    if (pai && pai.isVisible() && userData.slideOverCnt > 0 && userData.isUp) {
                                        that.downPai(2, i);
                                    }
                                }
                            }
                            var cardsArr = [];
                            for (var i = 0; i < initPaiNum; i++) {
                                var pai = that.getPai(2, i);
                                var userData = pai.getUserData();
                                // console.log(i+"==="+userData.slideOverCnt+"==="+userData.isUp)
                                if (pai && pai.isVisible() && (userData.slideOverCnt > 0 || userData.isUp)) {
                                    if (userData && userData.pai >= 0 && PAIID2CARD[userData.pai] && PAIID2CARD[userData.pai].weight) {
                                        cardsArr.push(userData.pai);
                                    }
                                }
                            }
                            var shangjiaPaiArr = (curChuPaiUid == gameData.uid ? null : curChuPaiArr);
                            var cardlist = pokerRule.automaticTip(cardsArr, shangjiaPaiArr);
                            // console.log(cardlist);
                            for (var i = 0; i < initPaiNum; i++) {
                                var pai = that.getPai(2, i);
                                var userData = pai.getUserData();
                                if(upbefore){
                                    if(userData.slideOverCnt){
                                        userData.slideOverCnt = 1;
                                        if (cc.sys.isNative) {
                                            Filter.remove(pai);
                                        }
                                        that.upPai(2, i);
                                        playEffect("vclick_cards");
                                    }
                                }else {
                                    if (cardlist.indexOf(userData.pai) >= 0 && userData && !userData.isUp) {
                                        userData.slideOverCnt = 1;
                                        if (cc.sys.isNative) {
                                            Filter.remove(pai);
                                        }
                                        that.upPai(2, i);
                                        playEffect("vclick_cards");
                                    }
                                    // if(cardlist.indexOf(userData.pai) < 0 && userData && userData.isUp) {
                                    //     userData.slideOverCnt = 0;
                                    //     if (cc.sys.isNative) {
                                    //         Filter.remove(pai);
                                    //     }
                                    //     that.downPai(2, i);
                                    // }
                                    if (cardlist.indexOf(userData.pai) < 0 && userData && userData.slidegray) {
                                        if (cc.sys.isNative) {
                                            userData.slidegray = 0;
                                            Filter.remove(pai);
                                        }
                                    }
                                }
                            }
                        }else {
                            that.slideTishiChupai();
                        }
                    }
                    else if (curPaiIdx >= 0) {
                        if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && curPaiIdx >= 0) {
                            var pai = that.getPai(2, curPaiIdx);
                            var userData = pai.getUserData();
                            if (!userData.isLiang)
                                return;
                        }
                        that.upPai(2, curPaiIdx);
                    }
                    that.checkCanChupai();
                }
            });

            cc.eventManager.addListener(chupaiListener, $("row2"));
        },
        /*
         滑动  智能提示出牌
         上家出的顺子    我滑牌   出顺子
         */
        slideTishiChupai: function () {
            var that = this;
            //自己出牌  提示顺子
            var cardsArr = [];
            var valueArr = [];
            for (var i = 0; i < initPaiNum; i++) {
                var pai = that.getPai(2, i);
                var userData = pai.getUserData();
                if (pai && pai.isVisible() && userData.slideOverCnt > 0) {
                    var paiData = pai.getUserData();
                    if (paiData && paiData.pai && PAIID2CARD[paiData.pai] && PAIID2CARD[paiData.pai].weight) {
                        cardsArr.push(pai);
                        valueArr.push(PAIID2CARD[paiData.pai].weight);
                    }
                }
            }
            var slideIndexArr = [];
            if (valueArr.length >= 5) {
                var tmp = valueArr[valueArr.length - 1];
                slideIndexArr.push(valueArr.length - 1);
                for (var i = valueArr.length - 2; i >= 0; i--) {
                    if (valueArr[i] - tmp > 1) {
                        break;
                    } else if (valueArr[i] != 15 && valueArr[i] - tmp == 1) {
                        tmp = valueArr[i];
                        slideIndexArr.push(i);
                    }
                }
                // console.log(valueArr);
                // console.log(slideIndexArr);
                if (curChuPaiArr && curChuPaiArr.length > 0) {
                    //上家去出了牌
                    var paiType = pokerRule.judgeType(curChuPaiArr);
                    if (paiType == pokerRule.CardType.c123 && curTishiArr.length >= 1) {
                        if (slideIndexArr.length > curChuPaiArr.length) {
                            slideIndexArr = slideIndexArr.splice(0, curChuPaiArr.length);
                        }
                    }
                }
                if (slideIndexArr.length >= 5) {
                    for (var i = 0; i < cardsArr.length; i++) {
                        var pai = cardsArr[i];
                        var userData = pai.getUserData();
                        if (slideIndexArr.indexOf(i) >= 0) {
                            userData.slideOverCnt = 1;
                        } else {
                            if (cc.sys.isNative) {
                                Filter.remove(pai);
                            }
                            userData.slideOverCnt = 0;
                        }
                    }
                }
            }
            for (var i = 0; i < initPaiNum; i++) {
                var pai = that.getPai(2, i);
                var userData = pai.getUserData();
                if (userData.slideOverCnt > 0) {
                    if (cc.sys.isNative)
                        Filter.remove(pai);
                    that.upPai(2, i);
                    playEffect("vclick_cards");
                }
            }
        },
        countDown: function () {
            var that = this;
            var timer = null;
            return function (row, seconds) {
                if (isReplay || seconds == -1) {
                    $('timer3').setVisible(false);
                    return;
                }
                $('timer3').setVisible(true);
                // $('timer3').setLocalZOrder(100);
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                $('timer3.sec').setString(seconds);
                var posObj = {
                    0: {x: 690, y: 651},
                    1: {x: 1045, y: 550},
                    2: {x: 637, y: 350},
                    3: {x: 240, y: 550}
                };
                $('timer3').setPositionX(posObj[row].x);
                $('timer3').setPositionY(posObj[row].y);
                timer = setInterval(function () {
                    var sec = $('timer3.sec');
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
        setPaiArrBgOfRow: function (row, length) {
            var that = this;

            for (var j = 0; j < length; j++) {
                this.setPai(row, j, -1, true).setOpacity(255);
            }
            for (; j < 168; j++) {
                var pai = $("row" + row + ".a" + j);
                if (!pai)
                    break;
                pai.setVisible(false);
            }

        },
        setPaiArrOfRow: function (row, paiArr) {
            // if (!paiArr || paiArr.length == 0)
            //     return;
            var that = this;
            var flag = getSortFlag();
            if (row == 1 || row == 3 || row == 20)
                paiArr.sort(function (a, b) {
                    var wa = PAIID2CARD[a < 100 ? a : (Math.floor(a / 100) - 1)].weight;
                    var wb = PAIID2CARD[b < 100 ? b : (Math.floor(b / 100) - 1)].weight;
                    if (pokerRule.isLaizi(a, laiziValue) != pokerRule.isLaizi(b, laiziValue)) {
                        return pokerRule.isLaizi(a, laiziValue) ? -1 : 1;
                    }
                    return wa == wb ? that.getHuaValue(a) - that.getHuaValue(b) : wa - wb;
                });
            else if (row == 2) {
                paiArr.sort(function (a, b) {
                    var wa = PAIID2CARD[a].weight;
                    var wb = PAIID2CARD[b].weight;
                    if (pokerRule.isLaizi(a, laiziValue) != pokerRule.isLaizi(b, laiziValue)) {
                        return pokerRule.isLaizi(a, laiziValue) ? -flag : flag;
                    }
                    return wa == wb ? flag * (that.getHuaValue(a) - that.getHuaValue(b)) : flag * (wa - wb);
                    //return wb - wa
                });
            }
            else if (row == 10 || row == 30) {
                paiArr.sort(function (a, b) {
                    var wa = PAIID2CARD[a].weight;
                    var wb = PAIID2CARD[b].weight;
                    if (pokerRule.isLaizi(a, laiziValue) != pokerRule.isLaizi(b, laiziValue)) {
                        return pokerRule.isLaizi(a, laiziValue) ? -1 : 1;
                    }
                    return wa == wb ? that.getHuaValue(a) - that.getHuaValue(b) : wa - wb;
                });
            }
            if (row == 20 && paiArr.length > 14) {
                $('row20').setPositionX($('row20').getPositionX() - 230);
            }
            for (var j = 0; j < paiArr.length; j++)
                this.setPai(row, j, paiArr[j], true).setOpacity(255);
            for (; j < 168; j++) {
                var pai = $("row" + row + ".a" + j);
                if (!pai)
                    break;
                pai.setVisible(false);
            }
        },
        disableTiShiBtn: function () {
            this.disableBtn("ops.tishi");
        },
        showOps: function (enforce, canPass) {
            var that = this;

            if (!isReplay) {
                $("ops.buchu").setVisible(true);
                that.enableBtn("ops.buchu");
                that.enableBtn("ops.chongxuan");
                that.enableBtn("ops.tishi");
                that.enableBtn("ops.chupai");
                $("ops.buchu").setPositionX(posConf.opsPositionX[4][0]);
                $("ops.chongxuan").setPositionX(posConf.opsPositionX[4][1]);
                $("ops.tishi").setPositionX(posConf.opsPositionX[4][2]);
                $("ops.chupai").setPositionX(posConf.opsPositionX[4][3]);
                if (mapId == MAP_ID.PDK || mapId == MAP_ID.PDK_JBC ||mapId == MAP_ID.PDK_MATCH || enforce) {
                    $("ops.buchu").setVisible(false);
                    $("ops.chongxuan").setPositionX(posConf.opsPositionX[3][0]);
                    $("ops.tishi").setPositionX(posConf.opsPositionX[3][1]);
                    $("ops.chupai").setPositionX(posConf.opsPositionX[3][2]);
                    if (!enforce) {
                        that.enableBtn('ops.tishi');
                    } else {
                        that.disableTiShiBtn('ops.tishi');
                    }
                }

                if (mapId == MAP_ID.XIANGYANG_PDK) {
                    $("ops.buchu").setVisible(false);
                    $("ops.chongxuan").setPositionX(posConf.opsPositionX[3][0]);
                    $("ops.tishi").setPositionX(posConf.opsPositionX[3][1]);
                    $("ops.chupai").setPositionX(posConf.opsPositionX[3][2]);
                }

                TouchUtils.setOnclickListener($("ops.buchu"), function () {
                    network.send(4002, {room_id: gameData.roomId, cards: []});
                    that.hideOps();
                    that.downPai(2, -1);
                    playEffect("vbuyao" + (Math.floor(Math.random() * 2) + 1));
                });

                TouchUtils.setOnclickListener($("ops.chongxuan"), function () {
                    that.downPai(2, -1);
                    that.checkCanChupai();
                });

                TouchUtils.setOnclickListener($("ops.tishi"), function () {
                    zidongTishi = false;
                    if (curTishiArr == null)
                        network.send(4003, {room_id: gameData.roomId});
                    else {
                        if (curTishiArr.length <= curTishiIdx)
                            curTishiIdx = 0;
                        // console.log(JSON.stringify(pokerRule.numberArr2NameArr(curTishiArr[curTishiIdx])));
                        if (curTishiArr[curTishiIdx])
                        //that.upPaiByPaiArr(curTishiArr[curTishiIdx]);
                            that.upPaiByPaiArr(curTishiArr[curTishiIdx], curTishiArr, curTishiIdx);
                        curTishiIdx++;
                    }
                });

                that.checkCanChupai();

                $("ops").setVisible(true);
            }
        },
        yaobuqiOps: function () {
            var that = this;
            $("ops.buchu").setVisible(true);
            $("ops.buchu").setPositionX(posConf.opsPositionX[4][0]);
            $("ops.chongxuan").setPositionX(posConf.opsPositionX[4][1]);
            $("ops.tishi").setPositionX(posConf.opsPositionX[4][2]);
            $("ops.chupai").setPositionX(posConf.opsPositionX[4][3]);
            that.disableBtn("ops.chupai");
            that.disableBtn("ops.tishi");
            that.disableBtn("ops.chongxuan");
            $("ops").setVisible(true);
            TouchUtils.setOnclickListener($("ops.buchu"), function () {
                network.send(4002, {room_id: gameData.roomId, cards: []});
                that.hideOps();
                that.downPai(2, -1);
                playEffect("vbuyao" + (Math.floor(Math.random() * 2) + 1));
            });
        },
        hideOps: function () {
            $("ops").setVisible(false);
        },
        setReplayProgress: function (cur, total) {
            var progress = cur / total * 100;
            this.showTip("进度: " + progress.toFixed(1) + "%", false);
        },
        setAllPai4Replay: function (data) {
            for (var uid in data)
                if (data.hasOwnProperty(uid)) {
                    var row = uid2position[uid];
                    if (undefined == row) {//跑得快两人玩的时候 playerPaiArr.length = 3 第三个字段全为空字符串
                        $("row30").setVisible(false);
                        continue;
                    }
                    if (gameData.mapId != MAP_ID.ZJH) {
                        if (uid == 0) {
                            if (row == 2) {
                                $("row" + row).setVisible(false);
                            } else {
                                $("row" + row * 10).setVisible(false);
                            }
                            continue;
                        }
                    }

                    var paiArr = data[uid]["pai_arr"];
                    var usedPaiArr = data[uid]["used_arr"];
                    if (row == 2) {
                        this.setPaiArrOfRow(row, paiArr);
                        $("row" + row).setVisible(true);

                        this.setPaiArrOfRow(20, usedPaiArr);
                        $("row" + 20).setVisible(true);

                        for (var _i = 0; _i < initPaiNum; _i++) {
                            Filter.grayMask(this.getPai(row, _i));
                        }
                    }
                    else {
                        this.setPaiArrOfRow(row, usedPaiArr);
                        $("row" + row).setVisible(true);

                        this.setPaiArrOfRow(row * 10, paiArr);
                        $("row" + row * 10).setVisible(true);
                    }
                    this.recalcPos(row);

                    // console.log(row);
                }
        },
        fapai: function (paiArr, isSort) {
            var flag = getSortFlag();
            if (isSort) {
                paiArr.sort(function (a, b) {

                    if (pokerRule.isLaizi(a, laiziValue) != pokerRule.isLaizi(b, laiziValue)) {
                        return pokerRule.isLaizi(a, laiziValue) ? -flag : flag;
                    }
                    return flag * (PAIID2CARD[a].weight - PAIID2CARD[b].weight)
                });
            }
            var i = 2;
            for (var j = 0; j < paiArr.length; j++)
                this.setPai(i, j, paiArr[j], false).setOpacity(0);
            for (var j = 0; j < paiArr.length; j++) {
                var root = this.getPai(i, j);
                root.setVisible(true);
                root.setOpacity(0);
                root.runAction(
                    cc.sequence(cc.delayTime(j * FAPAI_ANIM_DELAY), cc.fadeIn(FAPAI_ANIM_DURATION))
                );
                var children = root.getChildren();
                for (var childID in children) {
                    children[childID].setOpacity(0);
                    children[childID].runAction(
                        cc.sequence(cc.delayTime(j * FAPAI_ANIM_DELAY), cc.fadeIn(FAPAI_ANIM_DURATION))
                    );
                }
                var userData = this.getPai(i, j).getUserData();
                userData.isUp = false;
                userData.isUpping = false;
                userData.isDowning = false;
                Filter.grayMask(root);
            }
            for (; j < initPaiNum; j++) {
                var pai = this.getPai(2, j);
                var userData = pai.getUserData();
                if (userData.pai >= 0 && pai.isVisible()) {
                    pai.userData.pai = -1;
                    pai.setVisible(false);
                } else {
                    pai.setVisible(false);
                }
            }

            curChuPaiUid = 0;
            curChuPaiArr = [];
            curTishiArr = [];
            curTishiIdx = 0;
            //bug 跑得快  玩法防作弊 第一个人先出，出的剩一张牌，又重新发牌  curLeftPaiCntMap清理了，没法判断下家手牌数量 放到结算清理
            if (paiArr && paiArr.length > 0) curLeftPaiCntMap = {};//重新发牌清理 curLeftPaiCntMap


            $("row3").setPositionY($("row1").getPositionY());
            $("row2").setVisible(true);
            $("row20").setVisible(false);
            this.hideAllPlayersStatus();
            this.downAllPaiImmediately();
            this.recalcPos(i);
            this.enableChuPai();
        },
        jiesuan: function (data) {
            var that = this;
            //bug 跑得快  玩法防作弊 第一个人先出，出的剩一张牌，又重新发牌  curLeftPaiCntMap清理了，没法判断下家手牌数量 放到结算清理
            curLeftPaiCntMap = {};

            var myScore = 0;
            var players = data.players;
            var winneruid;
            that.jieSuanData = data;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var uid = player["uid"];

                if (uid == 0) { //跑得快两人玩
                    continue;
                }
                if (mapId == MAP_ID.ZJH && player.score > 0) {
                    winneruid = uid;
                }

                gameData.players[position2playerArrIdx[uid2position[uid]]].total_score = player["total_score"];
                if (mapId != MAP_ID.ZJH)
                    $("info" + uid2position[uid] + ".lb_score").setString(player["total_score"]);

                if (uid == gameData.uid) {
                    myScore = player["score"];
                    if (mapId != MAP_ID.ZJH) {
                        continue;
                    }
                }

                var row = uid2position[uid];
                var paiArr = player["pai_arr"];
                if (paiArr.length != 0 && mapId != MAP_ID.ZJH)
                    this.setPaiArrOfRow(row, paiArr);
                $("row" + row).setVisible(true);

                if (paiArr.length == 0 && mapId != MAP_ID.ZJH)
                    that.setPlayerStatus(row, TEXT_DAWANLA);
            }
            if (mapId != MAP_ID.ZJH) {
                $("row3").setPositionY($("row3").getPositionY() - 86);
            }

            if (data.is_chun) {
                $("transparent").setVisible(true);
                $("transparent").setOpacity(255);
                $("transparent").setPosition(cc.winSize.width / 2, cc.winSize.height * 0.66);
                playFrameAnim(res.spring_plist, "spring", 12, 0.05, false, $("transparent"), function () {
                    $("transparent").setVisible(false);
                });
            }

            setTimeout(function () {
                playEffect(myScore > 0 ? "vvictory" : "vfailure");
            }, 800);

            setTimeout(function () {
                var layer = null;
                switch (gameData.mapId) {
                    case MAP_ID.PDK:
                    case MAP_ID.PDK_JBC:
                    case MAP_ID.PDK_MATCH:
                        layer = new PokerJieSuanLayer_match(data, isReplay, !!isChooseQiepai);
                        isChooseQiepai = false;
                        break;
                }
                if (layer)
                    that.addChild(layer, 101);
                else
                    setTimeout(function () {
                        if (!isReplay)
                            that.onJiesuanClose();
                    }, 1000);
            }, 1000);
            // if(isReplay){
            //
            // }

        },
        openJiesuanLayer: function () {
            var that = this;
            var myScore = 0;
            var players = that.jieSuanData.players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.uid == gameData.uid) {
                    myScore = player['score'];
                    continue;
                }
            }

            setTimeout(function () {
                playEffect(myScore > 0 ? "vvictory" : "vfailure");
            }, 0);

            setTimeout(function () {
                var layer = null;
                switch (gameData.mapId) {
                    case MAP_ID.PDK:
                    case MAP_ID.PDK_JBC:
                    case MAP_ID.PDK_MATCH:
                        layer = new PokerJieSuanLayer_match(that.jieSuanData);
                        break;
                    case MAP_ID.DDZ_JD:
                        layer = new DiZhuJieSuanLayer(that.jieSuanData);
                        break;
                    case MAP_ID.XIANGYANG_PDK:
                        layer = new JiesuanLayer(that.jieSuanData);
                        break;
                    case MAP_ID.DDZ_LZ:
                        layer = new DiZhuJieSuanLayer(that.jieSuanData);
                        break;
                }
                if (layer)
                    that.addChild(layer, 101);
                else
                    setTimeout(function () {
                        if (!isReplay)
                            that.onJiesuanClose();
                    }, 0);
            }, 0);
        },
        onJiesuanClear: function () {
            //清理手牌
            for (var i = 1; i <= playerNum; i++) {
                this.setPaiArrOfRow(i, []);
            }
            this.setPaiArrOfRow(20, []);

            $("info1.alarm").setVisible(false);
            $("info1.left_bg").setVisible(false);
            $("info2.alarm").setVisible(false);
            $("info2.left_bg").setVisible(false);
            $("info3.alarm").setVisible(false);
            $("info3.left_bg").setVisible(false);
        },
        onJiesuanClose: function (isReady) {
            isChooseQiepai = false;
            this.onJiesuanClear();
            if (isReady) {
                $('jiesuan_btn_bg').setVisible(false);
                $('btn_zhunbei').setVisible(false);
                $('btn_chakanjiesuan').setVisible(false);
            } else {
                //隐藏
                $('jiesuan_btn_bg').setVisible(false);
                $('btn_zhunbei').setVisible(false);
                $('btn_chakanjiesuan').setVisible(false);

            }
        },
        zongJiesuan: function (data, delay) {
            data = zongjiesuanData || data;
            if (!data) return;

            var that = this;
            mRoom.voiceMap = {};
            $('btn_zhunbei').setVisible(false);
            $('btn_chakanjiesuan').setVisible(false);
            setTimeout(function () {
                if (mapId == MAP_ID.PDK_MATCH) {
                    return;
                }
                if (mapId == MAP_ID.ZJH) {
                    var layer = new ZongJiesuanLayerZJH(data);
                    that.addChild(layer);
                }
                else if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    var layer = new ZongJiesuanLayer_new(data);
                    that.addChild(layer);
                }
                else {
                    var layer = new PokerZongJiesuanLayer(data);
                    that.addChild(layer);
                }
            }, delay || 1);

        },
        showPlayerInfoPanel: function (idx) {
            if (window.inReview || isReplay)
                return;
            // if(this.getRoomState() == ROOM_STATE_CREATED)  return;

            if (position2playerArrIdx[idx] >= gameData.players.length)
                return;

            var that = this;

            // var playerInfo = gameData.players[position2playerArrIdx[idx]];
            // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', !(this.getRoomState() == ROOM_STATE_ONGOING));
            // this.addChild(this.playerInfoLayer);

            //合并成为一个功能块
            var playerInfo = gameData.players[position2playerArrIdx[idx]];
            if(res.PlayerInfoOtherNew_json){
                this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false);
                this.addChild(this.playerInfoLayer);
            }else{
                this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', !(this.getRoomState() == ROOM_STATE_ONGOING));
                this.addChild(this.playerInfoLayer);
            }
        },
        playerOnloneStatusChange: function (row, isOffline) {
            var offline = $("info" + row + ".offline");
            if (offline && cc.sys.isObjectValid(offline)) {
                offline.setVisible(!!isOffline);
            }
        },
        showChat: function (row, type, content, voice, uid) {
            var that = this;

            if (type == 'pdkcardtype') {
                return;
            }
            if (type == 'voice') {
                var url = decodeURIComponent(content);
                if (url && url.split(/\.spx/).length > 2)
                    return;
            }

            if (type == 'voice') {
                this.playUrlVoice(row, type, content, voice, uid);
                return;
            }

            var scale9sprite = $('info' + row + '.qp9');
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite("res/submodules/pdk_match/common/ltqp" + (row == 4 ? 3 : (row % 4)) + ".png", posConf.ltqpRect[row], posConf.ltqpCapInsets[row]);
                scale9sprite.setName('qp9');
                //scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : cc.p(0, 0));
                scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : (row == 0 ? cc.p(1, 0) : cc.p(0, 0)));
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $('info' + row).addChild(scale9sprite);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);

            var duration = 4;
            var innerNodes = [];
            scale9sprite.setCascadeOpacityEnabled(false);
            if (type == 'emoji') {
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
            else if (type == 'text') {
                scale9sprite.setOpacity(255);
                var text = $("text", scale9sprite);
                if (!text) {
                    text = new ccui.Text();
                    text.setName("text");
                    text.setFontSize(26);
                    text.setTextColor(cc.color(106, 57, 6));
                    // text.enableShadow(cc.color.BLACK, cc.p(1, -1));
                    text.setAnchorPoint(0, 0);
                    scale9sprite.addChild(text);
                }

                text.setString(content);

                var size = cc.size(text.getVirtualRendererSize().width + posConf.ltqpRect[row].width, posConf.ltqpRect[row].height);
                text.setPosition(
                    (size.width - text.getVirtualRendererSize().width) / 2 + posConf.ltqpTextDelta[row].x,
                    (size.height - text.getVirtualRendererSize().height) / 2 + posConf.ltqpTextDelta[row].y
                );
                scale9sprite.setContentSize(size);
                text.setVisible(true);
                innerNodes.push(text);
            }
            else if (type == 'voice') {
                var url = decodeURIComponent(content);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
                if (cc.sys.isNative) {
                    var arr = null;
                    if (url.indexOf('.aac') >= 0) {
                        arr = url.split(/\.aac/)[0].split(/-/);
                        VoiceUtils.play(url);
                    } else if (url.indexOf('.spx') >= 0) {
                        arr = url.split(/\.spx/)[0].split(/-/);
                        playVoiceByUrl(url);
                    }
                }

                duration = arr[arr.length - 1] / 1000;
                var map = {};
                for (var i = 1; i <= 3; i++) {
                    var sp = $('speaker' + i, scale9sprite);
                    if (!sp) {
                        sp = new cc.Sprite('res/image/ui/room/speaker' + i + '.png');
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
            }

            scale9sprite.stopAllActions();
            // scale9sprite.setVisible((type == 'emoji') ? false : true);
            scale9sprite.setOpacity((type == 'emoji')?0:255);
            scale9sprite.setScale(1.6, 1.6);
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

        playUrlVoice: function (row, type, content, voice, uid) {
            var url = decodeURIComponent(content);
            var arr = null;
            if (url.indexOf('.aac') >= 0) {
                arr = url.split(/\.aac/)[0].split(/-/);
            } else if (url.indexOf('.spx') >= 0) {
                arr = url.split(/\.spx/)[0].split(/-/);
                // playVoiceByUrl(url);
            }
            mRoom.voiceMap[uid] = null;
            mRoom.voiceMap[uid] = url;
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
        qpAction: function (innerNodes, scale9sprite, duration) {
            scale9sprite.stopAllActions();
            scale9sprite.setVisible(true);
            scale9sprite.setOpacity(255);
            //scale9sprite.setScale(1.6, 1.6);
            scale9sprite.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));
        },
        initQP: function (row) {
            var that = this;
            $("info" + row).setLocalZOrder(1);

            var scale9sprite = $('info' + row + '.qp9');
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite('res/submodules/pdk_match/common/ltqp' + row + '.png', posConf.ltqpRect[row], posConf.ltqpCapInsets[row]);
                scale9sprite.setName('qp9');
                //scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : cc.p(0, 0));
                scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : (row == 0 ? cc.p(1, 0) : cc.p(0, 0)));
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
                    sp = new cc.Sprite('res/image/ui/room/speaker' + i + '.png');
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
            $("info" + uid2position[uid] + ".ok").setVisible(true);
            var p = gameData.getUserInfo(uid);
            if(p){
                p.ready = true;
            }
            this.refreshPlayersStates();
            if (uid == gameData.uid) {
                $('jiesuan_btn_bg').setVisible(false);
                $('btn_zhunbei').setVisible(false);
                $('btn_chakanjiesuan').setVisible(false);
                $('btn_ready').setVisible(false);
            }
        },
        refreshPlayersStates:function () {
            if (this.assistant) {
                if(typeof this.assistant.refreshPlayersStates == 'function')  this.assistant.refreshPlayersStates();
            }
        },
        showReadyBtn: function () {
            $('btn_ready').setVisible(true);
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

        showTip: function (content, isShake) {
            isShake = _.isUndefined(isShake) ? true : isShake;
            var scale9sprite = $("top_tip");
            if (!(scale9sprite instanceof cc.Scale9Sprite)) {
                var newScale9sprite = new cc.Scale9Sprite(res.round_rect_91, cc.rect(0, 0, 91, 32), cc.rect(46, 16, 1, 1));
                newScale9sprite.setName("top_tip");
                scale9sprite.setAnchorPoint(0.5, 0.5);
                newScale9sprite.setPosition(scale9sprite.getPosition());
                scale9sprite.getParent().addChild(newScale9sprite);
                var lb = $("top_tip.lb_tip");

                text = new ccui.Text();
                text.setName("lb_tip");
                text.setFontRes(res.default_ttf);
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
        },
        hideTip: function () {
            if ($("top_tip"))
                $("top_tip").setVisible(false);
        },
        showJiaoDiZhu: function (min) {
            var that = this;
            TouchUtils.setOnclickListener($("btn_jiao1"), function () {
                network.send(4900, {room_id: gameData.roomId, uid: gameData.uid, score: 1});
                that.hideAllDizhu();
            });
            TouchUtils.setOnclickListener($("btn_jiao2"), function () {
                network.send(4900, {room_id: gameData.roomId, uid: gameData.uid, score: 2});
                that.hideAllDizhu();
            });
            TouchUtils.setOnclickListener($("btn_jiao3"), function () {
                network.send(4900, {room_id: gameData.roomId, uid: gameData.uid, score: 3});
                that.hideAllDizhu();
            });
            TouchUtils.setOnclickListener($("btn_buyao"), function () {
                network.send(4900, {room_id: gameData.roomId, uid: gameData.uid, score: 0});
                that.hideAllDizhu();
            });
            for (var i = 1; i <= 3; i++) {
                var btn = $("btn_jiao" + i);
                btn.setVisible(true);
                if (i < min) {
                    that.disableBtn("btn_jiao" + i);
                } else {
                    that.enableBtn("btn_jiao" + i);
                }
            }
            $("btn_buyao").setVisible(true);
        },
        hideAllDizhu: function () {
            $("btn_jiao1").setVisible(false);
            $("btn_jiao2").setVisible(false);
            $("btn_jiao3").setVisible(false);
            $("btn_buyao").setVisible(false);
        },
        changeShenFen: function (zhuangID) {
            for (var i = 1; i <= 3; i++) {
                var uid = position2uid[i];
                var node = $("info" + i + ".shenfen");
                var tawords = "l";
                if (i == 1) {
                    tawords = "r";
                }
                node.setVisible(true);
                var texture = null;
                if (uid == zhuangID) {
                    texture = SHENFEN_TEXTURE["dizhu_" + tawords];
                } else {
                    texture = SHENFEN_TEXTURE["nongmin_" + tawords];
                }
                node.setTexture(texture);
                if (i != 2 && !$("info" + i + ".txt_left").isVisible() && (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ)) {
                    $("info" + i + ".pai_back").setVisible(true);
                    $("info" + i + ".txt_left").setVisible(true);
                    $("info" + i + ".txt_left").setString(BEGIN_DDZ_POKEY_NUM(uid == zhuangID));
                }
            }

            var unusebg = $("top_panel.unuse_pai_back");
            var unusepaibg = $("top_panel.unuse_pai");
            unusebg.setVisible(false);
            unusepaibg.setVisible(true);
            for (var i = 0; i < 3; i++) {
                var pai = $("top_panel.unuse_pai.a" + i);
                this.setPaiHua(pai, gameData.unused_paiArr[i]);
            }
        },
        hideShenFen: function () {
            var unusebg = $("top_panel.unuse_pai_back");
            var unusepaibg = $("top_panel.unuse_pai");
            unusebg.setVisible(true);
            unusepaibg.setVisible(false);
        },
        changeVoice: function () {
            if (cc.sys.localStorage.getItem('yinxiaoPrecent') > 0 || cc.sys.localStorage.getItem('yinyuePrecent') > 0) {
                $('btn_voice_on').setVisible(false);
                $('btn_voice_off').setVisible(true);
            } else {
                $('btn_voice_on').setVisible(true);
                $('btn_voice_off').setVisible(false);
            }
        },
        onSendEffectEmoji: function (emojiIdx, times, targetUid) {
            var _obj = [];
            _obj.push(targetUid);
            network.send(4990, {room_id: gameData.roomId, emoji_idx: emojiIdx, emoji_times: times, target_uid: _obj});
        },
        getHuaValue: function (id) {
            if (id >= 0 && id <= 12) return 3;
            if (id >= 13 && id <= 25) return 4;
            if (id >= 26 && id <= 38) return 2;
            if (id >= 39 && id <= 51) return 1;
            if (id >= 100) return 0;
            return id;
        },
        showChosePai: function () {
            var that = this;
            var layer = new cc.Layer();
            TouchUtils.setOnclickListener(layer, function () {
                layer.removeFromParent(true);
                $("ops").setVisible(true);
            }, {swallowTouches: false});
            that.addChild(layer);
            var container = new cc.Scale9Sprite(res.round_rect_91, cc.rect(0, 0, 91, 32), cc.rect(46, 16, 1, 1));
            container.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
            layer.addChild(container);
            resultTypes.sort(function (a, b) {
                return a.type < b.type;
            });
            var layerList = [];
            var maxWidth = 0;
            var flag = getSortFlag();
            var a0 = $("row2.a0");
            var a0size = a0.getContentSize();
            var scale = 0.4;
            var gap = posConf.paiADistance[2] * scale;
            var createPaiResult = function (i) {
                layerList[i] = new cc.Scale9Sprite('res/transparent/transparent_64x64.png', cc.rect(0, 0, 64, 64), cc.rect(32, 32, 1, 1));
                var width = a0size.width * scale + gap * (resultTypes[i].cardArr.length - 1);
                if (maxWidth < width) {
                    maxWidth = width;
                }
                layerList[i].setContentSize(cc.size(width, a0size.height * scale));
                layerList[i].setAnchorPoint(cc.p(0.5, 0.5));
                TouchUtils.setOnclickListener(layerList[i], function () {
                    network.send(4002, {room_id: gameData.roomId, cards: resultTypes[i].cardArr});
                    layer.removeFromParent(true);
                }, {swallowTouches: false});
                container.addChild(layerList[i]);
                resultTypes[i].cardArr.sort(function (a, b) {
                    var wa = PAIID2CARD[a < 100 ? a : (Math.floor(a / 100) - 1)].weight;
                    var wb = PAIID2CARD[b < 100 ? b : (Math.floor(b / 100) - 1)].weight;
                    return wa == wb ? flag * (that.getHuaValue(a) - that.getHuaValue(b)) : flag * (wa - wb);
                });
                for (var j = 0; j < resultTypes[i].cardArr.length; j++) {
                    var pai = duplicateSprite(a0);
                    pai.setScale(scale);
                    pai.setPosition(cc.p(gap * j + a0size.width / 2 * scale, a0size.height / 2 * scale));
                    that.setPaiHua(pai, resultTypes[i].cardArr[j]);
                    layerList[i].addChild(pai, j);
                }
            };
            for (var i = 0; i < resultTypes.length; i++) {
                createPaiResult(i);
            }
            var totalHeight = (20 + a0size.height * scale) * layerList.length + 20;
            container.setContentSize(cc.size(maxWidth + 40, totalHeight));
            for (i = 0; i < layerList.length; i++) {
                layerList[i].setPosition(cc.p(maxWidth / 2 + 20, totalHeight - (20 + a0size.height * scale) * (i + 1) + a0size.height * scale / 2));
            }
        },
        setLaiziCards: function () {
            if (isReplay) return;
            for (var i = 0; i < 2; i++) {
                var pai = $('laizi_card.a' + i);
                if (pai)
                    pai.setVisible(false);
            }
            for (i = 0; i < laiziValue.length; i++) {
                var pai = $('laizi_card.a' + i);
                if (pai) {
                    pai.setVisible(true);
                    this.setPaiHua(pai, laiziValue[i] - 1);
                }
            }
        },
        throwCMAnim: function (row, needchip) {
            var chip = new cc.Sprite(cc.textureCache.addImage('res/ui/resources/unit/chip' + needchip + '.png'));
            chip.setPosition($('info' + row).getPosition());
            chip.runAction(cc.moveTo(0.4, Math.random() * 300 + 490, Math.random() * 270 + 330).easing(cc.easeOut(5)));
            $('chipnode').addChild(chip);

        },
        checkPaiAnim: function (row, paiarr) {
            network.stop();
            if (!$('row' + row + 'b').isVisible()) {
                network.start();
                return false;
            }
            for (var j = 0; j < paiarr.length; j++) {
                this.setPai(row, j, paiarr[j], true);
                (function (j, row) {
                    $("row" + row + 'b.b' + j).setScaleX(-1);
                    $("row" + row + 'b.b' + j).runAction(cc.sequence(
                        cc.spawn(
                            cc.scaleTo(0.2, 0, 1),
                            cc.skewTo(0.2, 0, 30)
                        ),
                        cc.callFunc(function () {
                            $("row" + row + 'b').setVisible(false);
                        }),
                        cc.spawn(
                            cc.scaleTo(0.2, 1, 1),
                            cc.skewTo(0.2, 0, 0)
                        )
                    ));
                    $("row" + row + '.a' + j).setScaleX(-1);
                    $("row" + row + '.a' + j).runAction(cc.sequence(
                        cc.spawn(
                            cc.scaleTo(0.2, 0, 1),
                            cc.skewTo(0.2, 0, 30)
                        ),
                        cc.callFunc(function () {
                            $("row" + row).setVisible(true);
                        }),
                        cc.spawn(
                            cc.scaleTo(0.2, 1, 1),
                            cc.skewTo(0.2, 0, 0)
                        )
                    ));
                })(j, row);
            }
            setTimeout(function () {
                network.start();
            }, 1000);
            return true;
        },
        wordsFly: function (row, str, time_scale, scale) {
            time_scale = time_scale || 1;
            scale = scale || 0.9;
            var fnt = new cc.LabelBMFont(str, res.wordsfly_fnt);
            var parent = $('info' + row);
            parent.addChild(fnt, 2);
            fnt.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
            fnt.setScale(0);
            fnt.runAction(cc.sequence(
                cc.scaleTo(0.1 * time_scale, scale),
                cc.scaleTo(0.05 * time_scale, scale * 0.8),
                cc.delayTime(0.8 * time_scale),
                cc.spawn(
                    cc.moveBy(1.5 * time_scale, 0, 100),
                    cc.fadeOut(1.5 * time_scale)
                ),
                cc.callFunc(function () {
                    fnt.removeFromParent();
                })
            ));
        },
        disableOpsBtns: function () {
            this.disableBtn('ops.qi');
            this.disableBtn('ops.bi');
            this.disableBtn('ops.jia');
            this.disableBtn('ops.gen');
        },
        disableBtn: function (btnname) {
            $(btnname).setTexture('res/image/ui/poker/button/btn_disable.png');
            TouchUtils.removeListeners($(btnname));
            $(btnname + '.txt').setTextColor(cc.color(255, 255, 255));
            $(btnname + '.txt').enableOutline(cc.color(48, 57, 59), 2);
        },
        enableBtn: function (btnname) {
            var texture_filename = {
                'ops.qi': 'res/submodules/pdk_match/PkScene/btn_hong.png',
                'ops.bi': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'ops.jia': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'ops.gen': 'res/submodules/pdk_match/PkScene/btn_cheng.png',
                'jia.jia2': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'jia.jia3': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'jia.jia4': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'jia.jia5': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'ops.buchu': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'ops.chongxuan': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'ops.tishi': 'res/submodules/pdk_match/PkScene/btn_cheng.png',
                'ops.chupai': 'res/submodules/pdk_match/PkScene/btn_cheng.png',
                'btn_jiao1': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'btn_jiao2': 'res/submodules/pdk_match/PkScene/table/btn_lan.png',
                'btn_jiao3': 'res/submodules/pdk_match/PkScene/btn_lan.png',
                'btn_buyao': 'res/submodules/pdk_match/PkScene/btn_cheng.png'
            };
            var outline_color = {
                'ops.qi': cc.color(118, 37, 23),
                'ops.bi': cc.color(23, 92, 111),
                'ops.jia': cc.color(29, 101, 82),
                'ops.gen': cc.color(89, 43, 103),
                'jia.jia2': cc.color(149, 28, 56),
                'jia.jia3': cc.color(149, 28, 56),
                'jia.jia4': cc.color(149, 28, 56),
                'jia.jia5': cc.color(149, 28, 56),
                'ops.buchu': cc.color(118, 37, 23),
                'ops.chongxuan': cc.color(23, 92, 111),
                'ops.tishi': cc.color(152, 78, 24),
                'ops.chupai': cc.color(152, 78, 24),
                'btn_jiao1': cc.color(29, 101, 82),
                'btn_jiao2': cc.color(29, 101, 82),
                'btn_jiao3': cc.color(29, 101, 82),
                'btn_buyao': cc.color(118, 37, 23)
            };
            $(btnname).setTexture(texture_filename[btnname]);
            $(btnname + '.txt').setTextColor(cc.color(255, 255, 255));
            $(btnname + '.txt').enableOutline(outline_color[btnname], 3);
        },
        setOperateFinishCb: function (cb) {
            this.operateFinishCb = cb;
        },
        updateCardStatusZJH: function (row, status) {
            if (!status || !TEXTURE_STATUS[status]) {
                $('row' + row + 'b.status').setVisible(false);

            } else {
                if ($('row' + row + 'b.status') && TEXTURE_STATUS[status]) {
                    $('row' + row + 'b.status').setVisible(true);
                    $('row' + row + 'b.status').setTexture(TEXTURE_STATUS[status]);
                }
            }
        },

        getRowByUid: function (uid) {
            return uid2position[uid];
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
    exports.PokerLayer_match = PokerLayer_match;
})(window);
