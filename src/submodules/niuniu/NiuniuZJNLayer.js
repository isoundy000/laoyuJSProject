"use strict";
(function (exports) {

    var signal1 = cc.textureCache.addImage(res.signal1);
    var signal2 = cc.textureCache.addImage(res.signal2);
    var signal3 = cc.textureCache.addImage(res.signal3);
    var signal4 = cc.textureCache.addImage(res.signal4);
    var signal5 = cc.textureCache.addImage(res.signal5);

    var goldTexture = cc.textureCache.addImage(res.gold);

    var BatteryTextures = {
        "battery1": cc.textureCache.addImage(res.battery_1),
        "battery2": cc.textureCache.addImage(res.battery_2),
        "battery3": cc.textureCache.addImage(res.battery_3),
        "battery4": cc.textureCache.addImage(res.battery_4),
        "battery5": cc.textureCache.addImage(res.battery_5)
    };

    var $ = null;
    var initPaiNum = 5;
    // CONST
    var FAPAI_ANIM_DELAY = 0.04;
    var FAPAI_ANIM_DURATION = 0.2;
    var UPPAI_Y = 30;

    var ROOM_STATE_CREATED = 1;
    var ROOM_STATE_ONGOING = 2;
    var ROOM_STATE_ENDED = 3;
    var DISTANCE = 160;
    var posConf = {
        paiTouchRect: null
        , paiADistance: {}
        , paiStartPoint: {}
        , upPaiPositionY: null
        , downPaiPositionY: null

        //九宫格气泡的位置数据信息
        , ltqpPos: {}
        //九宫格气泡的宽高数据信息
        , ltqpRect: {}
        //九宫格气泡的锚点信息
        , ltqpAnchorPoint: {
            4: {
                1: cc.p(0, 0)
                , 2: cc.p(1, 1)
                , 3: cc.p(0, 1)
                , 4: cc.p(0, 1)
            },
            5: {
                1: cc.p(0, 0)
                , 2: cc.p(1, 1)
                , 3: cc.p(0, 1)
                , 4: cc.p(0, 1)
                , 5: cc.p(0, 1)
            },
            6: {
                1: cc.p(0, 0)
                , 2: cc.p(0, 1)
                , 3: cc.p(0, 1)
                , 4: cc.p(0, 1)
                , 5: cc.p(1, 1)
                , 6: cc.p(0, 1)//ruru
            }
        }
        //九宫格气泡的资源配置信息
        , ltqpFileIndex: {
            4: {
                1: 2
                , 2: 1
                , 3: 0
                , 4: 3
            },
            5: {
                1: 2
                , 2: 1
                , 3: 0
                , 4: 0
                , 5: 3
            },
            6: {
                1: 2
                , 2: 0
                , 3: 0
                , 4: 0
                , 5: 1
                , 6: 3   //ruru
            }
        }
        //九宫格气泡的拉伸部分的宽高数据信息
        , ltqpCapInsets: {
            4: {
                1: cc.rect(44, 25, 1, 1)
                , 2: cc.rect(26, 31, 1, 1)
                , 3: cc.rect(44, 25, 1, 1)
                , 4: cc.rect(42, 23, 1, 1)
            },
            5: {
                1: cc.rect(44, 25, 1, 1)
                , 2: cc.rect(26, 31, 1, 1)
                , 3: cc.rect(44, 25, 1, 1)
                , 4: cc.rect(44, 25, 1, 1)
                , 5: cc.rect(42, 23, 1, 1)
            },
            6: {
                1: cc.rect(68, 0, 1, 1)
                , 2: cc.rect(68, 0, 1, 1)
                , 3: cc.rect(68, 0, 1, 1)
                , 4: cc.rect(68, 0, 1, 1)
                , 5: cc.rect(68, 0, 1, 1)
                , 6: cc.rect(68, 0, 1, 1)//ruru
            }
        }
        , ltqpEmojiPos: {
            4: {
                1: cc.p(40, 28)
                , 2: cc.p(40, 28)
                , 3: cc.p(40, 28)
                , 4: cc.p(40, 28)
            },
            5: {
                1: cc.p(40, 28)
                , 2: cc.p(40, 28)
                , 3: cc.p(40, 28)
                , 4: cc.p(40, 28)
                , 5: cc.p(40, 28)
            },
            6: {
                1: cc.p(40, 28)
                , 2: cc.p(40, 28)
                , 3: cc.p(40, 28)
                , 4: cc.p(40, 28)
                , 5: cc.p(40, 28)
                , 6: cc.p(40, 28)//ruru
            }
        }
        , ltqpVoicePos: {
            4: {
                1: cc.p(40, 40)
                , 2: cc.p(37, 28)
                , 3: cc.p(42, 28)
                , 4: cc.p(58, 28)
            },
            5: {
                1: cc.p(40, 40)
                , 2: cc.p(37, 28)
                , 3: cc.p(42, 28)
                , 4: cc.p(42, 28)
                , 5: cc.p(58, 28)
            },
            6: {
                1: cc.p(40, 40)
                , 2: cc.p(37, 28)
                , 3: cc.p(42, 28)
                , 4: cc.p(42, 28)
                , 5: cc.p(58, 28)
                , 6: cc.p(58, 28)//ruru
            }
        }
        , ltqpEmojiSize: {}
        //气泡里面的对话文字的偏移坐标
        , ltqpTextDelta: {
            4: {
                1: cc.p(-1, 7)
                , 2: cc.p(-7, 2)
                , 3: cc.p(0, -5)
                , 4: cc.p(6, 3)
            },
            5: {
                1: cc.p(-1, 7)
                , 2: cc.p(-7, 2)
                , 3: cc.p(0, -5)
                , 4: cc.p(0, -5)
                , 5: cc.p(6, 3)
            },
            6: {
                1: cc.p(0, 7)//(-1, 7)
                , 2: cc.p(0, -7)//(-7, 2)
                , 3: cc.p(0, -7)//(0, -5)
                , 4: cc.p(0, -7)//(0, -5)
                , 5: cc.p(0, 0)//(6, 3)
                , 6: cc.p(0, 0)//(6, 3)//ruru
            }
        }
    };

    var roomState = null;
    var playerNum = 6;
    var max_player_num = 6;

    var uid2position = {};
    var position2uid = {};
    var position2sex = {};
    var position2playerArrIdx = {};

    var data = null;
    var isReplay = null;

    var enableChupaiCnt = 0;

    var effectEmojiQueue = {};
    var effectEmojiCfg = {
        1: {'name': 'zan', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'bomb', 'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3: {'name': 'egg', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4: {'name': 'shoe', 'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5: {'name': 'flower', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0}
    };

    var FANPAI_DURATION = 0.1;

    var clearVars = function () {
        roomState = null;
        playerNum = 6;
        max_player_num = gameData.maxPlayerNum;
        uid2position = {};
        position2uid = {};
        position2sex = {};
        position2playerArrIdx = {};
        isReplay = null;

        enableChupaiCnt = 0;
    };

    var leftTime = 0;
    var prompt = "";
    var promptAction = "";

    var NiuniuZJNLayer;
    NiuniuZJNLayer = cc.Layer.extend({
        chatLayer: null,
        afterGameStart: null,
        marqueeUpdater: null,
        timeUpdater: null,
        signalUpdater: null,
        content: null,
        inFanPaiAnim: null,
        canTouchPai: null,
        pourMultiple: null,//下注倍数
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        getRootNode: function () {
            return this.getChildByName("Scene");
        },
        onCCSLoadFinish: function () {
            var that = this;
            $ = create$(this.getRootNode());

            mRoom.voiceMap = {};

            //设置背景图
            this.initBG();
            //初始化显示的内容的状态
            this.initLoadShowState();

            if (max_player_num == 4) {
                var row3 = $('row3');
                var row4 = $('row4');
                var row5 = $('row5');
                var info3 = $('info3');
                var info4 = $('info4');
                var info5 = $('info5');
                row3.setName('row5');
                row4.setName('row3');
                row5.setName('row4');
                info3.setName('info5');
                info4.setName('info3');
                info5.setName('info4');
                row4.setPositionX(549);
                info4.setPositionX(575);
            }

            //$("cd").setVisible(false);
            //$('prompt_bg').setVisible(false);
            $("tip_niu").setVisible(false);

            this.getPai = this.getPai();

            this.calcPosConf();

            // this.initMic();
            MicLayer.init($("btn_mic"), this);

            this.setRoomState(ROOM_STATE_CREATED);

            this.clearTable4StartGame();

            this.startTime();

            this.startSignal();

            // var pScheduler = cc.director.getScheduler();
            // pScheduler.setTimeScale(0.5);

            if (window.inReview) $("chat").setVisible(false);
            TouchUtils.setOnclickListener($('chat'), function () {
                if (!that.chatLayer) {
                    that.chatLayer = new ChatLayer();
                    that.chatLayer.retain();
                }
                that.addChild(that.chatLayer);
            });

            TouchUtils.setOnclickListener($("btn_invite"), function () {
                if (!cc.sys.isNative)
                    return;
                var title = "风云拼十-" + gameData.roomId + ",已有" + gameData.players.length +  "人";
                var content = "房号: " + gameData.roomId + "," + (gameData.wanfaDesp ? decodeURIComponent(gameData.wanfaDesp) + "," : "") + "速度来啊! 【风云拼十】";
                WXUtils.shareUrl(gameData.shareUrl + '?roomid=' + gameData.roomId, title, content, 0, getCurTimestamp() + gameData.uid);

                // WXUtils.shareUrl('http://www.yayayouxi.com/penghuzi2?roomid='+gameData.roomId, "丫丫牛牛-" + gameData.roomId, "房号: " + gameData.roomId + "," + (gameData.wanfaDesp ? decodeURIComponent(gameData.wanfaDesp) + "," : "") + "速度来啊! 【丫丫牛牛】", 0, getCurTimestamp() + gameData.uid);
            });

            $("btn_start").setVisible(false);
            TouchUtils.setOnclickListener($("btn_start"), function () {
                network.wsData(['StartImmediately'].join('/'));
            });

            for(var i=0;i<max_player_num;i++){
                (function(i){
                    TouchUtils.setOnclickListener($("info" + (i+1) + ".info_bg"), function () {
                        that.showPlayerInfoPanel((i+1), $("info" + (i+1) + ".info_bg").uid);
                    });
                }(i))
            }
            TouchUtils.setOnclickListener($('btn_fanhui'), function () {
                // if (gameData.is_daikai || gameData.uid != gameData.ownerUid) {
                alert2('确定要退出房间吗?', function () {
                    network.wsData(['Quit',
                        gameData.roomId].join('/'));
                }, null, false, true);
                // }
            });

            TouchUtils.setOnclickListener($('btn_jiesan'), function () {
                var func = function () {
                    network.wsData(['Discard',
                        gameData.roomId].join('/'));
                };

                var func2 = function () {
                    network.wsData([
                        'Vote',
                        1
                    ].join('/'));
                }
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    if (window.inReview)
                        func();
                    else
                        alert2('解散房间不扣房卡，是否确定解散？', function () {
                            func();
                        }, null, false, false);
                }
                else {
                    if (window.inReview)
                        func2();
                    else
                        alert2('确认要解散房间？', function () {
                            func2();
                        }, null, false, false);
                }

            });

            TouchUtils.setOnclickListener($('setting'), function () {
                // var settingsLayer = new SettingsLayer('申请解散房间');
                // that.addChild(settingsLayer);

                var isStart = false;
                if (that.getRoomState() == ROOM_STATE_ONGOING) {
                    isStart = true;
                }
                var setting = HUD.showLayer(HUD_LIST.Settings, that, false, true);
                setting.setSetting(that, "niuniu");//niuniu打开的界面
                setting.setLocalZOrder(5);
                setting.setSettingLayerType({
                    hidelogout: true,
                    hideyijianxiufu: true,
                    isStart: isStart,
                    gameName: "dn"
                });
            });
            //上局回顾
            TouchUtils.setOnclickListener($("btn_lasthuigu"), function () {
                var huigu = new LastReviewLayer();
                that.addChild(huigu);
            });
            network.addListener(P.GS_UserJoin_NiuNiu, function (data) {
                if (data.Result == 0) {
                    if (that.getRoomState() == ROOM_STATE_CREATED) {
                        gameData.roomId = data.RoomID;
                        gameData.players = data.Users;
                        gameData.WatchingUsers = data.WatchingUsers;
                        var option = data.Option == "" ? {} : JSON.parse(decodeURIComponent(data.Option));
                        gameData.wanfaDesp = option.wanfadesc || "";
                        gameData.totalRound = option.rounds;
                        gameData.currentRound = data.CurrentRound;
                        gameData.Option = option;
                        gameData.mapId = option['mapid'];
                        gameData.Option.currentRound = data.CurrentRound;
                        gameData.leftRound = gameData.totalRound - data.CurrentRound;
                        if (data.Users.length > 0) {
                            mRoom.ownner = data.Owner;
                            gameData.ownerUid = data.Owner;
                        } else {
                            mRoom.ownner = 0;
                        }
                        that.setControlBtn(ROOM_STATE_CREATED);
                        that.onPlayerEnterExit();
                        if (gameData.currentRound <= 1 && data.Users.length > 0) {
                            that.showTipMsg("", P.GS_UserJoin);//房主登录时走的流程
                        }
                        that.setPanel3(gameData.Option);
                    }
                    else if(that.getRoomState() == ROOM_STATE_ONGOING && mRoom.Is_ztjr){
                        //中途加入
                        gameData.players = data.Users;
                        gameData.WatchingUsers = data.WatchingUsers;
                        that.onPlayerEnterExit();
                    }
                } else if (data.Result == -1) {
                    alert2(data.ErrorMsg, function () {
                        // network.disconnect();
                        clearGameMWRoomId();
                        HUD.showScene(HUD_LIST.Home, this);
                    }, null, true);
                } else {
                    alert1(data.ErrorMsg);
                }
            });
            //疯狂牛牛
            network.addListener(P.GS_ActionList_MSG, function(data){
                console.log(data);
            });

            this.initZJNBtn();

            if (data && data.Result == 0) {
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.roomId = data.RoomID;
                    gameData.players = data.Users;
                    var option = data.Option == "" ? {} : JSON.parse(decodeURIComponent(data.Option));
                    gameData.wanfaDesp = option.wanfadesc || "";
                    gameData.totalRound = option.rounds;
                    gameData.currentRound = data.CurrentRound;
                    gameData.Option = option;
                    gameData.Option.currentRound = data.CurrentRound;
                    gameData.leftRound = gameData.totalRound - data.CurrentRound;
                    if (data.Users.length > 0) {
                        mRoom.ownner = data.Owner;
                        gameData.ownerUid = data.Owner;
                    } else {
                        mRoom.ownner = 0;
                    }
                    that.setControlBtn(ROOM_STATE_CREATED);
                    that.onPlayerEnterExit();
                    that.showTipMsg("", P.GS_UserJoin);//房主登录时走的流程
                    that.setPanel3(gameData.Option);
                }
            } else if(data.Result == -1){
                alert2(data.ErrorMsg, function(){
                    // network.disconnect();
                    clearGameMWRoomId();
                    HUD.showScene(HUD_LIST.Home, this);
                }, null, true);
            } else {
                alert1(data.ErrorMsg);
            }

            network.addListener(P.GS_UserLeave, function (data) {
                var uid = data.Users;
                if (uid == gameData.uid) {
                    clearGameMWRoomId();
                    HUD.showScene(HUD_LIST.Home, this);
                } else {
                    if (that.getRoomState() == ROOM_STATE_CREATED) {
                        //todo 需要data里边传递进来剩余玩家的信息
                        // gameData.players = data.Users;
                        that.onPlayerEnterExit();
                    }
                }
            });
            network.addListener(P.GS_UserDisconnect, function (data) {
                var uid = data.UserID;
                var isOffline = !(data.ConnectStatus == 'online');
                that.playerOnlineStatusChange(uid2position[uid], isOffline);
            });
            //200 下注
            network.addListener(P.GS_GameChipIn, function (data) {
                $('btn_Ready').setVisible(false);

                if (that.getRoomState() == ROOM_STATE_ONGOING) {
                    var isInChipIn = false;
                    for (var j = 0; j < data.Users.length; j++) {
                        var jsData = data.Users[j];
                        if (jsData.Chip == -1) {
                            isInChipIn = true;
                            break;
                        }
                    }
                    var hasNotChipInPlayers = false;
                    for (var i = 0; i < data.Users.length; i++) {
                        var jsData = data.Users[i];
                        var uid = jsData.UserID;
                        var options = jsData.Options;
                        var Disable = jsData.Disable;
                        if (gameData.uid == uid && jsData.Chip == -1) {
                            that.setPourBtn(options, uid, data.UserID, Disable);
                            that.setQiangZhuangBtnsVisible(false);
                        } else if (gameData.uid == uid && jsData.Chip == 0 && isInChipIn) { //是庄家，同时
                            that.setQiangZhuangBtnsVisible(false);
                        } else if (gameData.uid == uid && jsData.Chip == 0 && !isInChipIn) {
                        }
                        //是不是上次数据为0，这次新变化的
                        var isNewFlyCoin = true;
                        // console.log(JSON.stringify(gameData.players));
                        // console.log(JSON.stringify(position2playerArrIdx));
                        // console.log(JSON.stringify(uid2position));
                        // console.log(JSON.stringify(uid));
                        var playerChipIn = gameData.players[position2playerArrIdx[uid2position[uid]]].chipIn;
                        if (playerChipIn && playerChipIn == jsData.Chip) {
                            isNewFlyCoin = false;
                        }
                        gameData.players[position2playerArrIdx[uid2position[uid]]].chipIn = jsData.Chip;
                        if (jsData.Chip > 0) {
                            if (gameData.uid == uid) {
                                //todo ruru
                                //prompt = '等待其他玩家下注';
                            }

                            $('info' + uid2position[uid] + '.chipin').setVisible(true);
                            $('info' + uid2position[uid] + '.chipin' + '.num').setString(jsData.Chip ? jsData.Chip : '');

                            var n = that.getChipImg(jsData.Chip);
                            $('info' + uid2position[uid] + '.chipin' + '.fenshu').setString('' + n);
                            // $('info' + uid2position[uid] + '.chipin' + '.fenshu').setVisible(false);//先隐藏等飞完  在显示

                            if (isNewFlyCoin) {
                                that.flyFenshu(uid, n);
                            }

                        } else {
                            if (jsData.Chip == -1) {
                                hasNotChipInPlayers = true;
                            }
                            // $('info' + uid2position[uid] + '.chipin').setVisible(false);
                        }
                    }
                }
            });
            //201 翻拍，亮牌
            network.addListener(P.GS_GameShowHand, function (data) {
                if (that.getRoomState() == ROOM_STATE_ONGOING) {
                    var needShowNow = false;
                    var curShowNiuAniUserID = null;
                    var finishNum = 0;
                    var zhuangLastShow = false;
                    for (var i = 0; i < data.Users.length; i++) {
                        var jsData = data.Users[i];
                        var uid = jsData.UserID;
                        if (uid == data.UserID) {
                            curShowNiuAniUserID = uid;
                        }

                        if (jsData.UserID == gameData.uid) {
                            if (jsData.HandStatus == 0) { //还没到这个阶段
                                //that.hideAndResetPourBtn();
                            } else if (jsData.HandStatus > 0) {
                                //$('Tip').setVisible(false);
                                that.hideAndResetPourBtn();
                            }
                            if(jsData.NiuResult != null){
                                //搓牌  自己亮牌了  就干掉
                                that.cuoPaiData = {};
                                that.canCuopai = false;
                            }
                        }
                        if(jsData.NiuResult != null){
                            finishNum++;
                        }
                        if(finishNum != gameData.players.length
                            && that.zhuangUid && that.zhuangUid != gameData.uid && that.zhuangUid == uid){
                            gameData.players[position2playerArrIdx[uid2position[uid]]].cards = jsData.Cards;
                            gameData.players[position2playerArrIdx[uid2position[uid]]].handStatus = jsData.HandStatus;
                            gameData.players[position2playerArrIdx[uid2position[uid]]].niuResult = 100;
                            gameData.players[position2playerArrIdx[uid2position[uid]]].niuRatio = 0;//倍数
                        }else{
                            gameData.players[position2playerArrIdx[uid2position[uid]]].cards = jsData.Cards;
                            gameData.players[position2playerArrIdx[uid2position[uid]]].handStatus = jsData.HandStatus;
                            gameData.players[position2playerArrIdx[uid2position[uid]]].niuResult = jsData.NiuResult;
                            gameData.players[position2playerArrIdx[uid2position[uid]]].niuRatio = jsData.NiuRatio;//倍数
                        }
                        if (jsData.HandStatus > 0) {
                            needShowNow = true;
                        }
                    }
                    if(finishNum == gameData.players.length){
                        for (var i = 0; i < data.Users.length; i++) {
                            var jsData = data.Users[i];
                            if(that.zhuangUid && jsData.UserID == that.zhuangUid){
                                gameData.players[position2playerArrIdx[uid2position[that.zhuangUid]]].niuResult = jsData.NiuResult;
                                gameData.players[position2playerArrIdx[uid2position[that.zhuangUid]]].niuRatio = jsData.NiuRatio;//倍数
                                break;
                            }
                        }
                    }
                    that.canTouchPai = gameData.isSelfWatching ? false: (gameData.players[position2playerArrIdx[1]].handStatus == -1);
                    if (that.canTouchPai) {
                        that.checkPaiRule();
                    }
                    if (needShowNow) {
                        that.fanRowPai(1, true);
                    } else if (gameData.isSelfWatching ? false : (gameData.players[position2playerArrIdx[1]].handStatus == -1)) {
                        that.inFanPaiAnim = true;
                        setTimeout(function () {
                            that.inFanPaiAnim = false;
                        }, 500);
                        that.fanRowPai(1, false);
                    }

                    for (var i = 0; i < gameData.players.length; i++) {
                        var isFanpai = true;
                        if (mRoom.ZhuangMode == "Tongbi") {
                            isFanpai = true;
                        } else {
                            isFanpai = (that.zhuangUid && that.zhuangUid != gameData.players[i].uid);
                        }
                        that.showPaiResult(gameData.players[i], curShowNiuAniUserID, isFanpai);
                    }
                    //最后显示庄  人满 庄不是自己 庄不是最后一个选的
                    if(finishNum == gameData.players.length && that.zhuangUid && that.zhuangUid != gameData.uid){
                        // that.scheduleOnce(function(){
                        that.showPaiResult(gameData.players[position2playerArrIdx[uid2position[that.zhuangUid]]], that.zhuangUid, true);
                        // }, 0.1);
                    }

                    //亮牌了，干掉搓牌中
                    var pos = 1;
                    if(uid2position[curShowNiuAniUserID]){
                        pos = uid2position[curShowNiuAniUserID];
                    }
                    that.cuoPaiZhongAni(pos, false);
                }
            });
            //105 游戏结束
            network.addListener(P.GS_GameOver, function (data) {

            });
            //106 战绩显示
            network.addListener(P.GS_GameResult, function (data) {

            });
            //107 发牌
            network.addListener(P.GS_CardDeal, function (data) {
                playEffect('fanpai');//发牌音效

                //test
                // data.Cards = [17,5,10,14,2];//顺子牛
                // data.Cards = [17,5,9,13,33];//同花牛
                // data.Cards = [5,6,1,2,3];//葫芦牛
                // data.Cards = [6,1,2,3,4];//炸弹牛

                $('btn_Ready').setVisible(false);
                //$('Tip').setVisible(false);
                that.hideTipMsg();
                // $('btn_buqiangzhuang').setVisible(false);
                // $('btn_qiangzhuang').setVisible(false);
                // $('btn_qiangzhuang1').setVisible(false);
                // $('btn_qiangzhuang2').setVisible(false);
                // $('btn_qiangzhuang3').setVisible(false);
                // $('btn_qiangzhuang4').setVisible(false);
                that.setQiangZhuangBtnsVisible(false);
                that.hideAndResetPourBtn();

                // if(mRoom.ZhuangMode == "Qiang"){
                //     that.faAllPai(true);
                // }

                var paiArr = data.Cards;
                if (paiArr.length == 0) {
                    return;
                }
                if(that.fapaiAniing){
                    that.MyCards = paiArr;
                }else {
                    //搓牌
                    if(mRoom.Cuopai && mRoom.Preview && mRoom.Preview.length > 0){
                        that.cuoPaiData = {};
                        if(mRoom.Preview == "ling"){//搓5张
                            that.cuoPaiData = {typ:1, topData:null, cuoData:paiArr};
                            that.fapai([0, 0, 0, 0 ,0]);
                        }else if(mRoom.Preview == "san"){//搓2张
                            that.cuoPaiData = {typ:1, topData:[paiArr[0], paiArr[1], paiArr[2]], cuoData:[paiArr[3], paiArr[4]]};
                            that.fapai([paiArr[0], paiArr[1], paiArr[2], 0, 0]);
                        }else{//搓1张
                            that.cuoPaiData = {typ:2, topData:[paiArr[0], paiArr[1], paiArr[2], paiArr[3]], cuoData:[paiArr[4]]};
                            that.fapai([paiArr[0], paiArr[1], paiArr[2], paiArr[3], 0]);
                        }
                    }else {
                        that.fapai(paiArr);
                    }

                }
                if (that.afterGameStart) {
                    that.afterGameStart();
                }
            });
            //109 开始游戏，进入投注状态，玩家开始投注
            network.addListener(P.GS_GameStart, function (data) {
                //清理分数
                for (var i = 1; i <= max_player_num; i++) {
                    if($("info" + i) && $("info" + i + ".change_sroce_node")) {
                        $("info" + i + ".change_sroce_node").removeAllChildren();
                    }
                }

                that.fapaiAniing = true;
                var isChangeZhuang = (that.zhuangUid && that.zhuangUid != data.Banker);
                playerNum = gameData.players.length;
                that.changeZhuang(data.Banker);

                gameData.totalRound = data.TotalRound;
                gameData.currentRound = data.CurrentRound;
                gameData.leftRound = gameData.totalRound - data.CurrentRound;
                if (gameData.leftRound < 0) {
                    gameData.leftRound = 0;
                }
                var needShowAnim = data.Chonglian != 'yes';
                for (var i = 0; i < data.Score.length; i++) {
                    var jsData = data.Score[i];
                    var uid = jsData.UserID;
                    gameData.players[position2playerArrIdx[uid2position[uid]]].score = jsData.Score;
                    gameData.players[position2playerArrIdx[uid2position[uid]]].chipIn = jsData.ChipIn;
                    if (jsData.ChipIn > 0) {
                        $('info' + uid2position[uid] + '.chipin').setVisible(true);
                        //$('info' + uid2position[uid] + '.chipin').setTexture('res/image/ui/niuniu/button/bt_bet_' + jsData.ChipIn + '.png');
                        $('info' + uid2position[uid] + '.chipin' + '.num').setString(jsData.Chip ? jsData.Chip : '');
                    } else {
                        $('info' + uid2position[uid] + '.chipin').setVisible(false);
                    }
                }
                that.setRoomState(ROOM_STATE_CREATED);
                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame();
                that.downAllPaiImmediately();

                var gameStartAni = function () {
                    if(network.getMsgQueueNum() > 5){
                        that.faAllPai(false);
                    } else {
                        that.faAllPai(needShowAnim);
                    }
                };

                //先播抢庄动画   播完在继续执行
                if (isChangeZhuang) {
                    gameStartAni();
                } else {
                    gameStartAni();
                }
            });
            //112 广播
            network.addListener(P.GS_BroadcastAction, function (data) {

            });
            //113 重连之后获取房间id
            network.addListener(P.GS_RoomInfo, function (data) {

            });
            //115 聊天广播
            network.addListener(P.GS_Chat, function (data) {
                var fromId = data.FromUser;
                var jsData = JSON.parse(data.Msg);
                var row = uid2position[fromId];
                var type = jsData.type;
                var content = jsData.content;
                if (jsData.type == 'text') {
                    var voice = jsData.voice; //获得文字信息
                } else if (jsData.type == 'effectemoji') {
                    var data = JSON.parse(content);
                    //ruru 根据返回的内容播放动画
                    var delaytimeList = [1, 1.6, 1, 0.4, 1];
                    that.scheduleOnce(function(){
                        playEffect("itr_biaoqing" + data.emoji_idx);
                    }, delaytimeList[data.emoji_idx - 1]);
                    that.addEffectEmojiQueue(data.from_uid, data.target_uid, data.emoji_idx, data.emoji_times);
                    return;
                }
                that.showChat(row, type, decodeURIComponent(content), voice, fromId);
            });
            //116 投票广播
            network.addListener(P.GS_Vote, function (data) {
                if (!data.Voting) {
                    return;
                }
                var byUserId = data.ByUserID;
                if (byUserId == 0) {
                    return;
                }
                var leftSeconds = data.EndSecond;
                var voteResult = data.VoteResult;
                leftSeconds = (leftSeconds < 0 ? 0 : leftSeconds);
                // var refusedId = null;
                // var voteUsers = [];
                // voteUsers.push(byUserId);
                // for (var i = 0; i < data.Users.length; i++) {
                //     var jsData = data.Users[i];
                //     var uid = jsData.UserID;
                //     var voteValue = jsData.VoteValue;
                //     if (voteValue == 1 && uid != byUserId) {
                //         voteUsers.push(uid);
                //     }
                //     if (voteValue == 2) {
                //         refusedId = uid;
                //     }
                // }
                // if (refusedId) {
                //     var shenqingjiesanLayer = $("shenqingjiesan", that);
                //     if (shenqingjiesanLayer)
                //         shenqingjiesanLayer.removeFromParent(true);
                //     alert1("由于玩家【" + gameData.playerMap[refusedId].nickname + "】拒绝，房间解散失败，游戏继续");
                // } else if (voteResult == 1) {
                //     if (cc.director.getRunningScene().getChildByName('alertLayer')) {
                //         return;
                //     }
                //     var nicknameArr = [];
                //     for (var i = 0; i < voteUsers.length; i++) {
                //         nicknameArr.push("【" + gameData.playerMap[voteUsers[i]].nickname + "】");
                //     }
                //     var shenqingjiesanLayer = $("shenqingjiesan", that);
                //     if (shenqingjiesanLayer)
                //         shenqingjiesanLayer.removeFromParent(true);
                //     alert1("经玩家" + nicknameArr.join(",") + "同意, 房间解散成功", function () {
                //     });
                // } else {
                //     var shenqingjiesanLayer = $("shenqingjiesan", that);
                //     if (!shenqingjiesanLayer) {
                //         shenqingjiesanLayer = new ShenqingjiesanLayer();
                //         shenqingjiesanLayer.setName("shenqingjiesan");
                //         that.addChild(shenqingjiesanLayer, 60);
                //     }
                //     shenqingjiesanLayer.setArr(leftSeconds, voteUsers);
                // }


                var shenqingjiesanLayer = $("shenqingjiesan", that);
                if (!shenqingjiesanLayer) {
                    shenqingjiesanLayer = new ShenqingjiesanLayer();
                    shenqingjiesanLayer.setName("shenqingjiesan");
                    that.addChild(shenqingjiesanLayer, 60);
                }
                shenqingjiesanLayer.setArr(leftSeconds, data.Users, data.ByUserID);
            });
            //118 房间结算
            network.addListener(P.GS_RoomResult, function (data) {
                that.zongJiesuan(data);
            });
            //130 单局结束
            network.addListener(P.GS_NiuniuOver, function (data) {
                network.stop([P.GS_Chat]);
                // setTimeout(function () {
                //     that.jiesuan(data);
                // }, 300);
                that.jiesuan(data);
            });
            //207 GS_Sitdown
            network.addListener(P.GS_Sitdown, function (data) {
                // if(data.Result == 0){
                //     $("info1").setVisible(true);
                //     $("info1.lb_nickname").setString(ellipsisStr(gameData["nickname"], 5));
                //     $("info1.lb_score").setString(0);
                //     $("info1.ok").setVisible(true);
                //     if (gameData["headimgurl"] == undefined || gameData["headimgurl"] == null || gameData["headimgurl"] == "") {
                //         gameData["headimgurl"] = res.defaultHead;
                //     }
                //     loadImageToSprite(gameData["headimgurl"], $("info1.head._head"), true);
                // }
                if(data.Result != 0){
                    HUD.showMessage(data.Reason);
                }
            });
            //202 ready
            network.addListener(P.GS_ReadyNotify, function (data) {
                var hasNoReadyPlayers = false;

                if(data.Users && data.Users.length == 0){
                    return;
                }
                for (var i = 0; i < data.Users.length; i++) {
                    var jsData = data.Users[i];
                    var uid = jsData.UserID;
                    var isReady = jsData.Status == 1;
                    gameData.players[position2playerArrIdx[uid2position[uid]]].ready = isReady;
                    if (isReady) {
                        that.setReady(uid);
                    } else {
                        hasNoReadyPlayers = true;
                    }
                }
                if ((gameData.isSelfWatching ? true : gameData.players[position2playerArrIdx[1]].ready) && hasNoReadyPlayers && that.getRoomState() == ROOM_STATE_ONGOING) {
                    //that.showWaiting(TEXTURE_READY);
                    that.showWaiting('等待玩家准备');
                } else {
                    //that.hideWaiting(TEXTURE_READY);
                    that.hideWaiting('等待玩家准备');
                }
            });

            network.addListener(3013, function (data) {
                gameData.numOfCards = data['numof_cards'];
            });
            network.addListener(3005, function (data, errorCode) {
            });

            $('btn_Ready').setVisible(false);
            //204 预览
            network.addListener(P.GS_Preview, function (data) {
                // network.stop([P.GS_Chat]);
                // that.setPaiArrOfRow(1, data.Cards, true);
                // that.fanRowPai(1);

                if(that.fapaiAniing) {
                    that.MyCards = data.Cards;
                }else {
                    network.stop([P.GS_Chat]);
                    that.setPaiArrOfRow(1, data.Cards);
                    that.fanRowPai(1);
                }
            });

            this.schedule(this.onTimer, 1);
            // 倒计时
            network.addListener(P.GS_AutoAction, function (data) {
                //确定倒计时时间
                leftTime = data.Second;
                leftTime--;

                //根据倒计时发生的状态更新显示Tip的内容
                if (data.AutoAction == 1) { //可以抢庄
                    that.showTipMsg("qiangzhuang")
                } else if (data.AutoAction == 2) { //可以下注
                    that.showTipMsg("xiazhuxian")
                    if (gameData.uid == data.Banker) { //庄家 是我
                        that.showTipMsg("xiazhuzhuang")
                    }
                } else if (data.AutoAction == 3) { //可以亮牌
                    that.showTipMsg("liangpai");

                } else if (data.AutoAction == 4) { //等待新局
                    that.showTipMsg("dengdaikaishi")
                } else {
                    $('prompt_bg').setVisible(true);
                    var szTipPrompt = $('prompt_bg.prompt');
                    szTipPrompt.setString(data.Prompt);
                }
            });

            //网络断线
            network.addListener(P.GS_NetWorkClose, function (data) {
                //cc.eventManager.removeAllListeners(););
                //DC.socket.close();
                HUD.showScene(HUD_LIST.Login, this);
            });

            setTimeout(function () {
                network.start();
            }, 500);

            var setting_bgm = cc.sys.localStorage.getItem('setting_bgm_niuniu') || 4;
            playMusic("vbg" + setting_bgm);

            $('speaker').setVisible(false);
            setTimeout(function () {
                that.activatePaomadeng();
            }, 0);

            $('btn_Ready').setVisible(false);
            this.btReady = $("btn_Ready");
            TouchUtils.setOnclickListener(this.btReady, function () {
                that.showTipMsg("dengdaikaishiend");
                network.wsData([
                    'Ready'
                ].join('/'));
                $('btn_Ready').setVisible(false);
            }, {});

            //坐下
            TouchUtils.setOnclickListener($('btn_sitdown'), function () {
                network.wsData([
                    'Sitdown'
                ].join('/'));
                $('btn_sitdown').setVisible(false);
            });
            if(!mRoom.Is_ztjr){
                // $('btn_sitdown').setVisible(false);
                $('tip_pangguan').setVisible(false);
                $('tip_waitnext').setVisible(false);
            }

            this.getVersion();

            TouchUtils.setOnclickListener($('btn_control_btns'), function () {
                that.changeBtnStatus();
            });

            TouchUtils.setOnclickListener($('Panel_1'), function () {
                if(!cc.sys.isNative){
                    // var msg = JSON.stringify({roomid: mRoom.roomId, type:'text', content:"testing", from:gameData.uid});
                    // network.wsData("Say/" + msg);
                }
                that.hideControlBtns();
            }, {sound:"no"});
            TouchUtils.setOnclickListener($('btn_wanfa'), function () {
                cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
                    var data = gameData.Option;
                    var wanfaLayer = new NiuniuWanfaLayer(data);
                    cc.director.getRunningScene().addChild(wanfaLayer, 1000);
                });
            });

            var particleSystem = cc.ParticleSystem.create(res.fly_icon);
            particleSystem.setAutoRemoveOnFinish(true);
            particleSystem.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(particleSystem);

            $('panel_3').setVisible(false);


            DC.start();

            //切home
            network.addCustomListener("game_on_hide", this.Game_On_Hide.bind(this));
            network.addCustomListener("game_on_show", this.Game_On_Show.bind(this));


            // var cuoLayer = new CuoOnePaiLayer();
            // this.addChild(cuoLayer);
            // mRoom.Cuopai = false;

            this.canCuopai = false;

            //
            MWUtil.clearRoomId();


        },
        Game_On_Hide: function(){

        },
        Game_On_Show: function(){

        },

        getChipImg:function(chip){
            var n = 1;
            if (chip == 2) n = 2;
            if (chip == 3 || chip == 4) n = 3;
            if (chip >= 5 && chip <= 8) n = 4;
            if (chip >= 9) n = 5;

            return n;
        },
        initLoadShowState: function () {
            $('lb_wanfa').setVisible(false);

            for (var i = 1; i <= max_player_num; ++i) {
                $('info' + i + ".offline").setVisible(false);
                $('info' + i + ".chipin").setVisible(false);
                $('info' + i + ".shenfen").setVisible(false);
                $('info' + i + ".ok").setVisible(false);
            }
        },

        setPanel3: function (data) {
            if (data == undefined) {
                return;
            }
            $('panel_3').setVisible(true);
            $('panel_3.Text_1_value').setString(data.zhuang_gz);
            if (data.basescore != undefined) {
                $('panel_3.Text_3_value').setString(data.basescore);
                $('panel_3.Text_3').setVisible(true);
                $('panel_3.Text_3_value').setVisible(true);
            }
            else {
                $('panel_3.Text_3').setVisible(false);
                $('panel_3.Text_3_value').setVisible(false);
            }
            $('panel_3.Text_2_value').setString(data.currentRound + '/' + data.rounds);

        },
        hideControlBtns: function () {
            $('btn_bg').setVisible(false);
            $('setting').setVisible(false);
            $('btn_fanhui').setVisible(false);
            $('btn_jiesan').setVisible(false);
            $('btn_lasthuigu').setVisible(false);
            // $('btn_control_btns').setFlippedY(true);
        },

        changeBtnStatus: function () {
            $('btn_bg').setVisible(!$('btn_bg').isVisible());
            $('setting').setVisible(!$('setting').isVisible());
            $('btn_fanhui').setVisible(!$('btn_fanhui').isVisible());
            $('btn_jiesan').setVisible(!$('btn_jiesan').isVisible());
            $('btn_lasthuigu').setVisible(!$('btn_lasthuigu').isVisible());
            if(gameData.currentRound > 1) {
                TouchUtils.setClickDisable($('btn_lasthuigu'), false);
                $('btn_lasthuigu').setOpacity(255);
            }else{
                $('btn_lasthuigu').setOpacity(50);
                TouchUtils.setClickDisable($('btn_lasthuigu'), true);
            }
            if(mRoom.ZhuangMode == "Tongbi")  $('btn_lasthuigu').setVisible(false);
            $('btn_control_btns').setFlippedY(!$('btn_control_btns').isFlippedY());


            // 自己就是房主
            if (gameData.ownerUid == gameData.uid && gameData.isSelfWatching == false) {
                $('btn_jiesan').setOpacity(225);
                TouchUtils.setClickDisable($('btn_jiesan'), false);
                $('btn_fanhui').setOpacity(50);
                TouchUtils.setClickDisable($('btn_fanhui'), true);
            } else {
                if(gameData.isSelfWatching && gameData.isSitNotPlay == false){
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(255);
                    TouchUtils.setClickDisable($('btn_fanhui'), false);
                }else if(gameData.isSelfWatching && gameData.isSitNotPlay){
                    //既不能解散 也不能退出
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_fanhui'), true);
                }
            }
        },
        getVersion: function () {
            var versiontxt = window.curVersion;
            var version = new ccui.Text();
            version.setFontSize(15);
            version.setTextColor(cc.color(255, 255, 255));
            version.setPosition(cc.p(1280 - 10, 10));
            version.setAnchorPoint(cc.p(1, 0.5));
            version.setString(versiontxt);
            this.addChild(version, 2);
        },
        onExit: function () {
            this._super();
            if (this.chatLayer)
                this.chatLayer.release();
            if (this.marqueeUpdater) {
                clearInterval(this.marqueeUpdater);
                this.marqueeUpdater = null;
            }
            if (this.timeUpdater) {
                clearInterval(this.timeUpdater);
                this.timeUpdater = null;
            }
            if (this.signalUpdater) {
                clearInterval(this.signalUpdater);
                this.signalUpdater = null;
            }
            MWUtil.clearRoomId();
            network.removeListeners(P);
            AgoraUtil.closeVideo();
            // cc.Layer.prototype.onExit.call(this);
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
                    cc.delayTime(1)
                    // cc.callFunc(function () {
                    //     txt.removeFromParent(true);
                    // })
                )
            );
        },
        onPlayerEnterExit: function () {
            var that = this;
            var players = gameData.players || [];
            var watchingplayers = gameData.WatchingUsers || [];

            if (players.length > 1) {
                $("btn_start").setVisible(gameData.uid == gameData.ownerUid &&
                    players.length > 1 &&
                    players.length < playerNum && gameData.currentRound <= 1);
            }
            else
                $("btn_start").setVisible(false);

            for (var i = 0; i < players.length; i++) {
                var player = players[0];
                if (player.uid != gameData.uid) {
                    players.splice(0, 1);
                    players.push(player);
                }
                else
                    break;
            }
            uid2position = {};

            //中途加入 人数计算
            gameData.isSelfWatching = false;
            gameData.isSitNotPlay = false;//坐下未开始
            this.sitDownWatchNum = 0;
            // WatchingUsers  Watching=1 Sitdowning=0 观看   Watching=1 Sitdowning=1坐下未开始    players 打牌
            if(mRoom.Is_ztjr){
                for (var i = 0; i < watchingplayers.length; i++) {
                    var player = watchingplayers[i];
                    if(player.UserID == gameData.uid){
                        if(player['User']['Watching'] && !player['User']['Sitdowning']){
                            gameData.isSelfWatching = true;
                            gameData.isSitNotPlay = false;
                            break;
                        }else if(player['User']['Watching'] && player['User']['Sitdowning']){
                            gameData.isSelfWatching = true;
                            gameData.isSitNotPlay = true;
                            break;
                        }
                    }
                }
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    if(player.UserID == gameData.uid){
                        gameData.isSelfWatching = false;
                        gameData.isSitNotPlay = false;
                        break;
                    }
                }
                if (gameData.leftRound + 1 < gameData.totalRound) {
                    playerNum = players.length;
                }
                //观战里面 Sitdowning = 1  Watching = 1 画头像
                for (var i = 0; i < watchingplayers.length; i++) {
                    var player = watchingplayers[i];
                    if(player['User']['Watching'] &&  player['User']['Sitdowning']) {
                        if(gameData.uid == player['UserID']){
                            $("info1").setVisible(true);
                            $("info1.info_bg").uid = gameData.uid;
                            $("info1.lb_nickname").setString(ellipsisStr(gameData["nickname"], 5));
                            $("info1.lb_score").setString(0);
                            $("info1.ok").setVisible(true);
                            if (gameData["headimgurl"] == undefined || gameData["headimgurl"] == null || gameData["headimgurl"] == "") {
                                gameData["headimgurl"] = res.defaultHead;
                            }
                            loadImageToSprite(gameData["headimgurl"], $("info1.head._head"), true);
                        }else {
                            this.sitDownWatchNum++;
                            var pindex = (gameData.isSelfWatching == false) ? (players.length + this.sitDownWatchNum) : (players.length + this.sitDownWatchNum + 1);
                            if(pindex > max_player_num)  pindex = pindex % max_player_num;
                            // console.log(gameData.isSelfWatching);
                            // console.log(players.length + this.sitDownWatchNum);
                            // console.log(pindex);
                            if ($("info" + pindex)) {
                                $("info" + pindex +".info_bg").uid = player['UserID'];
                                $("info" + pindex).setVisible(true);
                                $("info" + pindex + ".lb_nickname").setString(ellipsisStr(player['User']["NickName"], 5));
                                $("info" + pindex + ".lb_score").setString(0);
                                $("info" + pindex + ".ok").setVisible(false);
                                if (player['User']["HeadIMGURL"] == undefined || player['User']["HeadIMGURL"] == null || player['User']["HeadIMGURL"] == "") {
                                    player["headimgurl"] = res.defaultHead;
                                } else {
                                    player["headimgurl"] = player['User']["HeadIMGURL"];
                                }
                                loadImageToSprite(player["headimgurl"], $("info" + pindex + ".head._head"), true);
                            }
                        }
                    }
                }
                //test
                $('btn_sitdown').setVisible(gameData.isSelfWatching && gameData.isSitNotPlay == false);
                $('tip_pangguan').setVisible(this.getRoomState() == ROOM_STATE_ONGOING && gameData.isSelfWatching && gameData.isSitNotPlay == false);
                $('tip_waitnext').setVisible(this.getRoomState() == ROOM_STATE_ONGOING && gameData.isSelfWatching && gameData.isSitNotPlay);
                $("btn_mic").setVisible(gameData.isSelfWatching == false && gameData.isSitNotPlay == false);
                $("chat").setVisible(gameData.isSelfWatching == false && gameData.isSitNotPlay == false);
                if(gameData.isSelfWatching && gameData.isSitNotPlay == false){
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(255);
                    TouchUtils.setClickDisable($('btn_fanhui'), false);
                }else if(gameData.isSelfWatching && gameData.isSitNotPlay){
                    //既不能解散 也不能退出
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_fanhui'), true);
                }
            } else {
                //没有中途加入   开始没坐下  在观察者列表里面
                for (var i = 0; i < watchingplayers.length; i++) {
                    var player = watchingplayers[i];
                    if (gameData.uid == player['UserID']) {
                        gameData.isSelfWatching = true;
                        gameData.isSitNotPlay = false;
                        break;
                    }
                }
                $('btn_sitdown').setVisible(gameData.isSelfWatching && gameData.isSitNotPlay == false
                    && this.getRoomState() == ROOM_STATE_CREATED);
                if (gameData.leftRound + 1 < gameData.totalRound) {
                    playerNum = players.length;
                }
            }

            if(mRoom.Is_ztjr){
                if (players.length == playerNum){
                    $("btn_invite").setVisible(false);
                }
                //坐满了
                if(max_player_num == (players.length + this.sitDownWatchNum)){
                    $('btn_sitdown').setVisible(false);
                }
                if(window.inReview){
                    $("btn_mic").setVisible(false);
                    $("chat").setVisible(false);
                }
            }else {
                if (players.length == playerNum) {
                    that.setRoomState(ROOM_STATE_CREATED);
                    that.setRoomState(ROOM_STATE_ONGOING);
                }
            }

            for (var i = 0; i < max_player_num; i++) {
                var k = i + 1;
                if(gameData.isSelfWatching && max_player_num > (players.length + this.sitDownWatchNum)){//如果自己观看 留出1号位
                    k = k + 1;
                }
                $("info1").setVisible(!(gameData.isSitNotPlay == false && gameData.isSelfWatching && max_player_num > (players.length + this.sitDownWatchNum)));
                if(players && players.length == 0)  $("info1").setVisible(false);

                // console.log(i+"=="+k);
                if (i < players.length) {
                    var player = players[i];
                    $("info" + k +".info_bg").uid = player.uid;
                    $("info" + k).setVisible(true);
                    $("info" + k + ".lb_nickname").setString(ellipsisStr(player["nickname"], 5));
                    $("info" + k + ".lb_score").setString((roomState == ROOM_STATE_CREATED) ? 0 : player["score"]);
                    if (roomState == ROOM_STATE_CREATED)
                        $("info" + k + ".ok").setVisible(!!player["ready"]);
                    if (player["headimgurl"] == undefined || player["headimgurl"] == null || player["headimgurl"] == "") {
                        player["headimgurl"] = res.defaultHead;
                    }
                    loadImageToSprite(player["headimgurl"], $("info" + k + ".head._head"), true);

                    uid2position[player.uid] = k;
                    position2uid[k] = player.uid;
                    position2sex[k] = player.sex;
                    position2playerArrIdx[k] = i;
                } else {
                    if(mRoom.Is_ztjr && i < (players.length + this.sitDownWatchNum)){
                    } else {
                        if ($("info" + k)) $("info" + k).setVisible(false);
                    }
                }
            }

            if (players.length > playerNum && roomState == ROOM_STATE_CREATED) {
                setTimeout(function () {
                    if (that && cc.sys.isObjectValid(that) && players.length >= playerNum && !isReplay && roomState == ROOM_STATE_CREATED) {
                        network.reconnect();
                    }
                }, 4000);
            }


            // if (players.length == playerNum && roomState == ROOM_STATE_ONGOING) {
            //     setTimeout(function () {
            //         if (that && cc.sys.isObjectValid(that) && players.length >= playerNum && !isReplay && roomState == ROOM_STATE_CREATED) {
            //             network.reconnect();
            //         }
            //     }, 4000);
            //
            //     AgoraUtil.initVideoView(this.getUserHeaderData());
            //     setTimeout(function () {
            //         AgoraUtil.openVideo(gameData.roomId.toString(), gameData.uid.toString());
            //     }, 1000);
            // }
        },

        getUserHeaderData: function () {
            var data = {};
            var players = gameData.players;
            var scale = cc.view.getFrameSize().width / cc.director.getWinSize().width;
            var theight = cc.view.getFrameSize().height / scale;
            var boardHeight = (theight - cc.director.getWinSize().height) / 2;
            // console.log("boardHeight = " + boardHeight);
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

        calcPosConf: function () {
            posConf.paiADistance[0] = 0;
            var arr = [1, 2, 3, 4, 5, 6, 10];
            if(gameData.mapId == MAP_ID.CRAZYNN){
                arr = [1, 2, 3, 4, 5, 10];
            }
            for (var i = 0; i < arr.length; i++) {
                var row = arr[i];
                var a0 = $("row" + row + ".a0");

                var a1 = $("row" + row + ".a1");
                posConf.paiADistance[row] = a1.getPositionX() - a0.getPositionX();
                //记录下 a0 牌的出事位置
                posConf.paiStartPoint[row] = a0.getPositionX();
                if (row == 1) {
                    posConf.upPaiPositionY = a0.getPositionY() + UPPAI_Y;
                    posConf.downPaiPositionY = a0.getPositionY();

                    posConf.paiTouchRect = cc.rect(0, 0, posConf.paiADistance[1], a0.getContentSize().height);
                }

                var ltqp = $("info" + row + ".qp");
                if (ltqp) {
                    posConf.ltqpPos[row] = ltqp.getPosition();
                    posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                    posConf.ltqpEmojiSize[row] = cc.size({
                        4: {
                            1: 80,
                            2: 90,
                            3: 84,
                            4: 100
                        },
                        5: {
                            1: 80,
                            2: 90,
                            3: 84,
                            4: 84,
                            5: 100
                        },
                        6: {
                            1: 80,
                            2: 90,
                            3: 84,
                            4: 84,
                            5: 84,
                            6: 100 //ruru
                        }
                    }[max_player_num][row], posConf.ltqpRect[row].height);
                    ltqp.removeFromParent();
                }
            }
        },
        ctor: function (_data, _isReplay) {
            this._super();
            // gameData.ownerUid = mRoom.ownner;
            if (gameData.wanfaDesp == undefined || gameData.wanfaDesp == null || gameData.wanfaDesp == "") {
                gameData.wanfaDesp = mRoom.wanfa;
            }

            clearVars();

            data = _data;
            isReplay = !!_isReplay;

            network.stop();

            gameData.mapId = MAP_ID.CRAZYNN;
            max_player_num = 5;
            loadCCSTo(res.NiuniuZJNLayer_json, this, "Scene");

            this.setPanel3(mRoom.roomInfo);

            return true;
        },
        startSignal: function () {
            if (this.signalUpdater) {
                return;
            }
            var that = this;
            var lastDealy = -1;
            var func = function () {
                if (!that || !cc.sys.isObjectValid(that))
                    return;
                DC.wsPing();
                var cur = Date.now();
                var delay = cur - DC.lastPong;
                lastDealy = delay;
                if (delay < 200) $("signal").setTexture(signal4);
                else if (delay < 400) $("signal").setTexture(signal3);
                else if (delay < 700) $("signal").setTexture(signal2);
                else $("signal").setTexture(signal1);
            };
            func();
            this.signalUpdater = setInterval(func, 5000);
        },
        closePing: function () {
            if (this.signalUpdater) {
                clearInterval(this.signalUpdater);
                this.signalUpdater = null;
            }
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
        setPai: function (row, idx, val, isVisible) {
            var pai = this.getPai(row, idx);
            var userData = pai.getUserData();
            this.setPaiHua(pai, val);
            userData.pai = val;
            if (!_.isUndefined(isVisible)) {
                if (isVisible)
                    pai.setVisible(true);
                else
                    pai.setVisible(false);
            }
            return pai;
        },
        setPaiHua: function (pai, val) {
            var that = this;
            if (val == 0) {
                that.showPaiBack(pai);
                return;
            }
            var a = pai.getChildByName("a");
            var b = pai.getChildByName("b");
            var arr = getPaiNameById(val);
            //数字的
            setPokerFrameByNameNN(a, arr[0]);
            //数字下面的牌型
            if (val < 53) {
                setPokerFrameByNameNN(b, arr[1]);
                b.setVisible(true);
            } else {
                b.setVisible(false);
            }
            //显示大类型的
            var c = pai.getChildByName("c");
            if (c && cc.sys.isObjectValid(c)) {
                if (val > 52) {
                    c.setVisible(false);
                } else {
                    c.setVisible(true);
                    setPokerFrameByNameNN(c, arr[3]);
                }
            }
            if (pai.getChildByTag(5001)) {
                pai.removeChildByTag(5001, true);
            }
            if (pai.getChildByName("5001")) {
                pai.removeChild(pai.getChildByName("5001"), true);
            }
            if (val == 53) {
                var w_1 = new cc.Sprite(res.w_1);
                pai.addChild(w_1);
                w_1.setTag(5001);
                w_1.setName("5001");
                w_1.setPosition(cc.p(0.5 * pai.getContentSize().width, 0.5 * pai.getContentSize().height));
                w_1.setScale(0.8);
            }
            if (val == 54) {
                var w_2 = new cc.Sprite(res.w_2);
                pai.addChild(w_2);
                w_2.setTag(5001);
                w_2.setName("5001");
                w_2.setPosition(cc.p(0.5 * pai.getContentSize().width, 0.5 * pai.getContentSize().height));
                w_2.setScale(0.8);
            }
        },
        //获得row位置上面的牌放置的推放方向：-1为向下堆放，1为向上堆放（实际上就是界面上面的牌堆放上下的情况）
        getPaiStackDir:function (row) {
            //获得方法1：使用固定的数值进行运算（容易出错误）
            // if (max_player_num == 4) {//4人配置牌桌
            //
            // } else if (max_player_num == 5) {//5人配置牌桌
            //
            // } else if (max_player_num == 6) {//6人配置牌桌
            //     return (max_player_num == 6 ? (row == 5 || row == 3) : row == 2) ? -1 : 1;
            // }
            //获得方法2：使用界面上面的牌堆放上下的情况获得
            //界面上一定有两张牌a0和a1，使用相对坐标判定叠放方向
            var nodeA0 = $("row" + row + ".a0");
            var nodeA1 = $("row" + row + ".a1");

            var _dis = nodeA1.getPositionX() - nodeA0.getPositionX();
            return (_dis < 0 ? -1 : 1);

        },
        getPai: function () {
            var cache = {};
            return function (row, id) {
                cache[row] = cache[row] || {};
                if (cache[row][id]) {
                    return cache[row][id];
                }
                var node = $("row" + row + ".a" + id);
                if (!node) {
                    var a0 = $("row" + row + ".a0");
                    node = duplicateSprite(a0, true);
                    var dis = posConf.paiADistance[row] || posConf.paiADistance[row / 10];
                    node.setPositionX(dis * id + a0.getPositionX());
                    node.setName("a" + id);
                    a0.getParent().addChild(node, this.getPaiStackDir(row) * id);
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
        showPaiBack: function (pai) {
            var paiBack = pai.getChildByName('paiBack');
            if (!paiBack) {
                paiBack = new cc.Sprite();
                // setPokerFrameByNameNN(paiBack, 'b/poker_back.png');
                paiBack.setTexture('res/image/ui/niuniu/card/back_1.png');
                paiBack.setPosition(cc.p(pai.getContentSize().width / 2, pai.getContentSize().height / 2));
                paiBack.setName('paiBack');
                // paiBack.setScale(0.98);
                pai.addChild(paiBack, 10);
            }
            paiBack.setVisible(true);
        },
        hidePaiBack: function (pai) {
            var paiBack = pai.getChildByName('paiBack');
            if (paiBack) {
                paiBack.setVisible(false);
            }
        },
        isPaiFan: function (pai) {
            var paiBack = pai.getChildByName('paiBack');
            return paiBack ? !paiBack.isVisible() : true;
        },
        getPaiId: function (row, id) {
            var userData = this.getPai(row, id).getUserData();
            return userData.pai;
        },
        hidePai: function (row, id) {
            this.getPai(row, id).setVisible(false);
        },
        getPaiArr: function () {
            var arr = [];
            for (var j = 0; j < initPaiNum; j++) {
                var pai = this.getPai(1, j);
                var userData = pai.getUserData();
                if (userData.pai >= 0 && pai.isVisible()) {
                    pai.setVisible(true);
                    arr.push(userData.pai);
                } else {
                    pai.setVisible(false);
                }
            }
            return arr;
        },
        getUpPaiArr: function () {
            var arr = [];
            for (var j = 0; j < initPaiNum; j++) {
                var pai = this.getPai(1, j);
                var userData = pai.getUserData();
                if (pai.isVisible() && userData.pai >= 0 && !userData.isDowning && (userData.isUp || userData.isUpping))
                    arr.push(userData.pai);
            }
            return arr;
        },
        getDownPaiArr: function () {
            var arr = [];
            var _arr = this.getUpPaiArr();
            for (var j = 0; j < initPaiNum; j++) {
                var pai = this.getPai(1, j);
                var userData = pai.getUserData();
                var isOver = false;
                for (var i = 0; i < _arr.length; ++i) {
                    if (userData.pai == _arr[i]) {
                        isOver = true;
                        break;
                    }
                }
                if (isOver)continue;
                arr.push(userData.pai);
            }
            return arr;
        },
        getRoomState: function () {
            return roomState;
        },
        setRoomState: function (state) {
            gameData.wanfaDesp = mRoom.wanfa;
            var that = this;
            var arr = decodeURIComponent(gameData.wanfaDesp).split(",");
            if (arr.length >= 1)
                arr = arr.slice(1);
            var wanfaStr = arr.join("\n");
            if (state == ROOM_STATE_CREATED) {
                this.hideControlBtns(false);
                $("signal").setVisible(false);
                // $("setting").setVisible(false);
                if(gameData.isSelfWatching){
                    $("chat").setVisible(false);
                    $("btn_mic").setVisible(false);
                }else {
                    $("chat").setVisible(true);
                    $("btn_mic").setVisible(true);
                }
                if (window.inReview) $("chat").setVisible(false);
                $("timer2").setVisible(false);
                $("btn_invite").setVisible(gameData.loginType != "yk");
                if (window.inReview) $("btn_invite").setVisible(false);
                this.setControlBtn(state);
                gameData.isOpen = false;

                if (window.inReview) $("btn_mic").setVisible(false);
                $("lb_roomid").setString(gameData.roomId);
                $("lb_wanfa").setString(wanfaStr);
                $("lb_roomid").setVisible(true);

                var arr = [1, 2, 3, 4, 5, 6, 10];
                if(gameData.mapId == MAP_ID.CRAZYNN){
                    arr = [1, 2, 3, 4, 5, 10];
                }
                for (var i = 0; i < arr.length; i++) {
                    $("row" + arr[i]).setVisible(false);
                }
                this.hideWaiting();
            } else if (state == ROOM_STATE_ONGOING) {
                var setting = $("setting");
                if (!setting || !cc.sys.isObjectValid(setting))
                    return network.reconnect();
                //setting.setVisible(true);
                $("signal").setVisible(!isReplay);
                if(gameData.isSelfWatching){
                    $("chat").setVisible(false);
                    $("btn_mic").setVisible(false);
                }else {
                    $("chat").setVisible(true);
                    $("btn_mic").setVisible(true);
                }
                if (window.inReview) $("chat").setVisible(false);

                $("timer2").setVisible(false);
                $("btn_invite").setVisible(false);
                // $("btn_fanhui").setVisible(false);
                // $("btn_jiesan").setVisible(false);
                this.setControlBtn(state);

                gameData.isOpen = true;
                $("btn_mic").setVisible(!window.inReview);
                $("lb_roomid").setString(gameData.roomId || '');
                $("lb_wanfa").setString(wanfaStr || '');
                var arr = [1, 2, 3, 4, 5, 6, 10];
                if(gameData.mapId == MAP_ID.CRAZYNN){
                    arr = [1, 2, 3, 4, 5, 10];
                }
                for (var i = 0; i < arr.length; i++) {
                    $("row" + arr[i]).setVisible(false);
                }

                // $("timer2.Text_5").setString(gameData.leftRound || '0');
                $('panel_3.Text_2_value').setString(gameData.currentRound + '/' + gameData.totalRound);

                for (var i = 1; i <= playerNum; i++)
                    $("info" + i + ".ok").setVisible(false);

                if (isReplay) {
                    $("lb_time").setVisible(false);
                    $("setting").setVisible(false);
                    $("chat").setVisible(false);
                }
            } else if (state == ROOM_STATE_ENDED) {
                $("timer2").setVisible(false);
            }

            roomState = state;
        },
        setControlBtn: function (state) {
            var that = this;
            //如果是代开房间直接显示离开按钮
            if (gameData.is_daikai == true && state == ROOM_STATE_CREATED){
                $('btn_jiesan').setOpacity(50);
                TouchUtils.setClickDisable($('btn_jiesan'), true);
                $('btn_fanhui').setOpacity(255);
                TouchUtils.setClickDisable($('btn_fanhui'), false);
                return ;
            }
            // 自己就是房主
            if (mRoom.ownner == gameData.uid) {
                $('btn_jiesan').setOpacity(225);
                TouchUtils.setClickDisable($('btn_jiesan'), false);
                $('btn_fanhui').setOpacity(50);
                TouchUtils.setClickDisable($('btn_fanhui'), true);
            }
            else {
                if (state == ROOM_STATE_CREATED) {
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(255);
                    TouchUtils.setClickDisable($('btn_fanhui'), false);
                }
                else {
                    $('btn_jiesan').setOpacity(255);
                    TouchUtils.setClickDisable($('btn_jiesan'), false);
                    $('btn_fanhui').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_fanhui'), true);
                }
            }
        },

        clearTable4StartGame: function () {
            var that = this;
            //清理分数
            for (var i = 1; i <= max_player_num; i++) {
                if($("info" + i) && $("info" + i + ".change_sroce_node")) {
                    $("info" + i + ".change_sroce_node").removeAllChildren();
                }
            }

            this.onPlayerEnterExit();

            //抢庄  需要把庄家去掉
            if (mRoom.ZhuangMode == "Qiang") this.changeZhuang(0);
            this.qiangZhuangData = null;


            var cleanAni = function(i){
                //清楚 动画
                var sp = that.getNiuAnimSp(i);
                if(sp) {
                    var niuRatioSprite = sp.getChildByName("niuRatioSprite");
                    if (niuRatioSprite) {
                        var niuCheng = niuRatioSprite.getChildByName('niuCheng');
                        if(niuCheng)  niuCheng.removeFromParent(true);
                    }
                    var niuResultSprite = sp.getChildByName("niuResultSprite");
                    if (niuResultSprite) {
                        var niuAction = niuResultSprite.getChildByName('niuAction');
                        if(niuAction) {
                            niuAction.removeFromParent(true);
                        }
                    }
                }
            }
            for (var i = 1; i <= max_player_num; i++) {
                var head = $("info" + i + ".head");
                var qiangfinish = head.getChildByName("qiangfinish");
                if (qiangfinish) qiangfinish.removeFromParent();

                cleanAni(i);
            }
        },
        upPai: function (idx, showAjiaB) {
            if (idx < 0)
                return;
            var that = this;
            var pai = that.getPai(1, idx);
            var userData = pai.getUserData();
            if(userData.pai == 0){
                return;
            }
            // //选了三张牌  不能继续再选了
            // var arr = this.getUpPaiArr();
            // if (arr && arr.length >= 3 && !userData.isUp) {
            //     return;
            // }
            if (userData.isUp) {
                that.downPai(idx, showAjiaB);
            }
            else if (!userData.isUp && !userData.isUpping) {
                playEffect('fapai');
                userData.isUpping = true;
                pai.runAction(cc.sequence(
                    cc.moveTo(0.08, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                    , cc.callFunc(function () {
                        userData.isUp = true;
                        userData.isUpping = false;
                        if(showAjiaB)  that.checkPaiRuleResult();
                    })
                ));
            }
            else if (userData.isUp && !userData.isDowning) {
                playEffect('fanpai');
                userData.isDowning = true;
                pai.runAction(cc.sequence(
                    cc.moveTo(0.08, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                    , cc.callFunc(function () {
                        userData.isUp = false;
                        userData.isDowning = false;
                        if(showAjiaB)  that.checkPaiRuleResult();
                    })
                ));
            }
        },
        downAllPaiImmediately: function () {
            for (var i = 0; i < initPaiNum; i++) {
                var pai = this.getPai(1, i);
                var userData = pai.getUserData();
                userData.isUp = false;
                userData.isUpping = false;
                userData.isDown = true;
                userData.isDowning = false;
                pai.setPositionY(posConf.downPaiPositionY);
            }
        },
        downPai: function (idx, showAjiaB) {
            var that = this;
            var arr = [];
            if (idx == -1) {
                var paiArr = this.getPaiArr();
                for (var i = 0; i < paiArr.length; i++)
                    arr.push(i);
            } else
                arr.push(idx);
            for (var i = 0; i < arr.length; i++)
                (function (idx) {
                    var pai = that.getPai(1, idx);
                    var userData = pai.getUserData();
                    if (!userData.isUp || userData.isDowning)
                        return;
                    playEffect('dianpai');
                    userData.isDowning = true;
                    pai.runAction(cc.sequence(
                        cc.moveTo(0.08, pai.getPositionX(), (userData.isUp ? posConf.downPaiPositionY : posConf.upPaiPositionY))
                        , cc.callFunc(function () {
                            userData.isUp = false;
                            userData.isDowning = false;
                            if(showAjiaB)  that.checkPaiRuleResult();
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
                    if (!that.canTouchPai || !($("row1").isVisible()) || that.inFanPaiAnim) {
                        return false;
                    }
                    curPaiIdx = -1;
                    slideOverCnt = 0;
                    var paiArr = that.getPaiArr();
                    for (var i = 0; i < initPaiNum; i++) {
                        var pai = that.getPai(1, i);
                        if (!pai.isVisible())
                            break;
                        var userData = pai.getUserData();
                        userData.slideOverCnt = 0;
                        if (TouchUtils.isTouchMe(pai, touch, event, null, i == paiArr.length - 1 ? null : posConf.paiTouchRect)) {
                            curPaiIdx = i;
                            break;
                        }
                    }
                    return curPaiIdx >= 0;
                },
                onTouchMoved: function (touch, event) {
                    if (!that.canTouchPai || !($("row1").isVisible()) || that.inFanPaiAnim) {
                        return;
                    }
                    var paiArr = that.getPaiArr();
                    for (var i = 0; i < totalPaiCnt; i++) {
                        var pai = that.getPai(1, i);
                        var userData = pai.getUserData();
                        if (TouchUtils.isTouchMe(pai, touch, event, null, i == paiArr.length - 1 ? null : posConf.paiTouchRect)) {
                            if (userData.slideOverCnt == 0) {
                                slideOverCnt++;
                                userData.slideOverCnt++;
                                if (cc.sys.isNative)
                                    Filter.grayMask(pai);
                            }
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    if (!that.canTouchPai || !($("row1").isVisible()) || that.inFanPaiAnim) {
                        return;
                    }
                    if (slideOverCnt > 0) {
                        for (var i = 0; i < initPaiNum; i++) {
                            var pai = that.getPai(1, i);
                            var userData = pai.getUserData();
                            if (userData.slideOverCnt > 0) {
                                if (cc.sys.isNative)
                                    Filter.remove(pai);
                                userData.slideOverCnt = 0;
                                that.upPai(i, true);
                                playEffect("vclick_cards");
                            }
                        }
                    }
                    else if (curPaiIdx >= 0)
                        that.upPai(curPaiIdx, true);
                    that.checkPaiRule();
                }
            });

            cc.eventManager.addListener(chupaiListener, $("row1"));
        },
        setPaiArrOfRow: function (row, paiArr, result) {
            // paiArr = [1,5,9,13,17];
            // result = 16;
            if (!(_.isNumber(result)) && !result) {
                for (var j = 0; j < paiArr.length; j++)
                    this.setPai(row, j, paiArr[j], true).setOpacity(255);
                for (; j < initPaiNum; j++) {
                    this.setPai(row, j, 0, true).setOpacity(255);
                }
                return;
            }

            var arr = [];
            var niuArr = [];
            //获取超过10的牌组
            var indexArr = pokerRule.checkNiu(paiArr);

            //超过10的牌组首先放到  arr里
            //并且记录 那些牌超过10
            for (var i = 0; i < indexArr.length; i++) {
                var id = paiArr[indexArr[i]];
                arr.push(id);
                niuArr.push(id);
            }
            //剩余不是10的牌再放到 arr里
            for (var i = 0; i < paiArr.length; i++) {
                if (arr.indexOf(paiArr[i]) < 0) {
                    arr.push(paiArr[i]);
                }
            }
            //根据界面上面的牌的堆放方向颠倒一下数组
            if (this.getPaiStackDir(row) == -1) {
                arr = arr.reverse();
            }
            //初始化牌的初始化位置,30是有牛的时候的牌的坐标差，其中牌0和1是界面上面的坐标固定位置不可以改变
            //恢复初始位置
            for (var i = 2; i < initPaiNum; ++i) {
                this.getPai(row, i).setPositionX(this.getPai(row, i - 1).getPositionX() + posConf.paiADistance[row]);
            }
            //根据结果显示坐标差位置
            if (niuArr.length > 0 && result > 0) {
                var _moveId = -1;
                if(indexArr.length == 4) {
                    if (this.getPaiStackDir(row) == -1) {
                        _moveId = 1;
                    } else {
                        _moveId = 4;
                    }
                }else if(indexArr.length == 5){

                }else{
                    if (this.getPaiStackDir(row) == -1) {
                        _moveId = 2;
                    } else {
                        _moveId = 3;
                    }
                }
                if(_moveId != -1) {
                    for (var i = _moveId; i < initPaiNum; ++i) {
                        this.getPai(row, i).setPositionX(this.getPai(row, i - 1).getPositionX() + posConf.paiADistance[row] + (i == _moveId ? this.getPaiStackDir(row) * 30 : 0));
                    }
                }
            }
            //设置牌数据
            for (var j = 0; j < arr.length; j++) {
                this.setPai(row, j, arr[j], true).setOpacity(255);
            }
            for (; j < initPaiNum; j++) {
                this.setPai(row, j, 0, true).setOpacity(255);
            }

        },

        setAllPai4Replay: function (data) {
            for (var uid in data)
                if (data.hasOwnProperty(uid)) {
                    var row = uid2position[uid];
                    var paiArr = data[uid]["pai_arr"];
                    var usedPaiArr = data[uid]["used_arr"];
                    if (row == 1) {
                        this.setPaiArrOfRow(row, paiArr);
                        $("row" + row).setVisible(true);

                        this.setPaiArrOfRow(10, usedPaiArr);
                        $("row" + 10).setVisible(true);

                        for (var _i = 0; _i < initPaiNum; _i++) {
                            Filter.grayMask(this.getPai(row, _i));
                        }
                    } else {
                        this.setPaiArrOfRow(row, usedPaiArr);
                        $("row" + row).setVisible(true);
                    }
                }
        },
        fapai: function (paiArr) {
            for (var j = 0; j < paiArr.length; j++)
                this.setPai(1, j, paiArr[j], false);
            for (var j = 0; j < paiArr.length; j++) {
                var root = this.getPai(1, j);
                root.setVisible(true);
                var userData = this.getPai(1, j).getUserData();
                userData.isUp = false;
                userData.isUpping = false;
                userData.isDowning = false;
            }
            for (; j < initPaiNum; j++) {
                var pai = this.getPai(1, j);
                var userData = pai.getUserData();
                if (userData.pai >= 0 && pai.isVisible()) {
                    pai.userData.pai = -1;
                    pai.setVisible(false);
                } else {
                    pai.setVisible(false);
                }
            }


            $("row1").setVisible(true);
            $("row10").setVisible(false);
            this.downAllPaiImmediately();
            this.enableChuPai();
        },
        jiesuan: function (data) {
            var that = this;
            var zhuangId = data.Banker;
            var zhuangIndex = uid2position[zhuangId];
            var winArr = [];
            var loseArr = [];
            var usercount = data.Users.length;
            // 飞金币
            // 1.飞给庄
            // 2.飞给赢家
            for (var i = 0; i < usercount; i++) {
                var userData = data.Users[i];
                if (userData.UserID != zhuangId) {
                    if (userData.Result > 0) {
                        winArr.push(userData.UserID);
                    } else if (userData.Result < 0) {
                        loseArr.push(userData.UserID);
                    }
                }
                gameData.players[position2playerArrIdx[uid2position[userData.UserID]]].score = userData.Score;
                gameData.players[position2playerArrIdx[uid2position[userData.UserID]]].lastResult = userData.Result;
            }
            var delayTime = 0;
            if (loseArr.length > 0) {  //有输家列表发起
                playEffect('vcoinsfly');
                for (var i = 0; i < loseArr.length; i++) {
                    that.playCoinsFlyAnim(uid2position[loseArr[i]], uid2position[zhuangId], function () {
                        if (winArr.length > 0) {
                            playEffect('vcoinsfly');
                            for (var i = 0; i < winArr.length; i++) {
                                that.playCoinsFlyAnim(uid2position[zhuangId], uid2position[winArr[i]]);
                            }
                            delayTime += 1;
                        }
                    });
                }
                delayTime += 0.4;
            } else{//没有输家列表
                if (winArr.length > 0) {
                    playEffect('vcoinsfly');
                    for (var i = 0; i < winArr.length; i++) {
                        that.playCoinsFlyAnim(uid2position[zhuangId], uid2position[winArr[i]]);
                    }
                    delayTime += 1;
                }
            }
            setTimeout(function () {
                for (var i = 0; i < gameData.players.length; i++) {
                    var k = i + 1;
                    if(gameData.isSelfWatching && max_player_num > (gameData.players.length + that.sitDownWatchNum)){
                        k = k + 1;
                    }
                    $("info" + k + ".lb_score").setString(gameData.players[position2playerArrIdx[k]].score);
                    that.showChangeScore(k, gameData.players[position2playerArrIdx[k]].lastResult);
                }
                that.one_data = data;
                $('btn_Ready').setVisible(!(gameData.isSelfWatching));
                Filter.remove($('btn_Ready'));
                //$('Tip').setVisible(false);
                // $('btn_buqiangzhuang').setVisible(false);
                // $('btn_qiangzhuang').setVisible(false);
                // $('btn_qiangzhuang1').setVisible(false);
                // $('btn_qiangzhuang2').setVisible(false);
                // $('btn_qiangzhuang3').setVisible(false);
                // $('btn_qiangzhuang4').setVisible(false);
                that.setQiangZhuangBtnsVisible(false);
                that.hideAndResetPourBtn();
                network.start();
            }, delayTime * 1000 + 800);
        },
        zongJiesuan: function (data) {
            var that = this;
            var func = function () {
                DD[T.PlayerList] = [];
                mRoom.voiceMap = {};
                var layer = new ZongJiesuanLayer(data, that);
                that.addChild(layer, 100);
            };
            setTimeout(function () {
                var shenqingjiesanLayer = $("shenqingjiesan", that);
                if (shenqingjiesanLayer) {
                    shenqingjiesanLayer.removeFromParent(true);
                }
                var jiesuanLayer = $("jiesuanLayer", that);
                if (jiesuanLayer) {
                    jiesuanLayer.showChakan(func);
                } else if (cc.director.getRunningScene().getChildByName('alertLayer')) {
                    cc.director.getRunningScene().getChildByName('alertLayer').registerExitCbk(function () {
                        func();
                    })
                } else {
                    func();
                }
            }, 2000);
        },
        getWatchUserInfoByUid: function(uid){
            if(uid == null)  return null;
            for(var i=0;i<gameData.WatchingUsers.length;i++){
                if(gameData.WatchingUsers[i].User.ID == uid){
                    return gameData.WatchingUsers[i];
                }
            }
            return null;
        },
        showPlayerInfoPanel: function (idx, uid) {
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
            PlayerInfoLayer.init(playerInfo, that, showAniBtn);


            // var scene;
            //
            // scene = ccs.load(res.PlayerInfo_json, "res/");
            //
            // that.addChild(scene.node, 60);
            // scene.node.targetUid = playerInfo.uid;
            //
            // var head = $('root.panel.head', scene.node);
            // var lbNickname = $('root.panel.lb_nickname', scene.node);
            // var lbId = $('root.panel.lb_id', scene.node);
            // var lbIp = $('root.panel.lb_ip', scene.node);
            // var male = $('root.panel.male', scene.node);
            // var female = $('root.panel.female', scene.node);
            // var lbLocation = $('root.panel.lb_ad', scene.node);
            // lbNickname.setString(ellipsisStr(playerInfo['nickname'], 7));
            // if(playerInfo['headimgurl'] == undefined || playerInfo['headimgurl'] == null || playerInfo['headimgurl'] == ""){
            //     playerInfo['headimgurl'] = 'res/image/defaultHead.jpg';
            // }
            // loadImageToSprite(playerInfo['headimgurl'], head);
            // lbId.setString(playerInfo['uid']);
            // lbIp.setString(playerInfo['ip']);
            // lbLocation.setString('位置: ' + ellipsisStr(gameData.location || "未知位置", 30));
            // male.setVisible(playerInfo.sex == '1');
            // female.setVisible(playerInfo.sex == '2');
            //
            // var canClose = false;
            // var beginPos = $('info' + idx).convertToWorldSpace(cc.p(0, 0));
            // var panel = $('root.panel', scene.node);
            // panel.setPosition(beginPos);
            // panel.setScale(0);
            // panel.runAction(cc.sequence(
            //     cc.spawn(
            //         cc.moveTo(0.2, cc.winSize.width / 2, cc.winSize.height / 2),
            //         cc.scaleTo(0.2, 1)
            //     ),
            //     cc.callFunc(function () {
            //         canClose = true;
            //     })
            // ));
            // var closeFunc = function () {
            //     canClose = false;
            //     panel.runAction(cc.sequence(
            //         cc.spawn(
            //             cc.moveTo(0.2, beginPos),
            //             cc.scaleTo(0.2, 0)
            //         ),
            //         cc.callFunc(function () {
            //             that.removeChild(scene.node);
            //         })
            //     ));
            // };
            // TouchUtils.setOnclickListener($('root.fake_root', scene.node), function () {
            //     if (!canClose) {
            //         return;
            //     }
            //     closeFunc();
            // });
            // TouchUtils.setOnclickListener($('root.panel', scene.node), function () {
            // }, {effect: TouchUtils.effects.NONE});

        },
        playerOnlineStatusChange: function (row, isOffline) {
            var offline = $("info" + row + ".offline");
            if (offline && cc.sys.isObjectValid(offline)) {
                offline.setVisible(!!isOffline);
            }
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
                //关闭背景音域
                if (!_.isUndefined(window.musicID)) {
                    jsb.AudioEngine.pause(window.musicID);
                }
                setTimeout(function () {
                    window.soundQueue.shift();
                    that.playVoiceQueue();
                    //开启背景音乐
                    if (!_.isUndefined(window.musicID)) {
                        jsb.AudioEngine.resume(window.musicID);
                    }
                }, queue.duration * 1000);
            }
        },
        initQP: function (row) {
            var that = this;
            $("info" + row).setLocalZOrder(1);
            var scale9sprite = $("info" + row + ".qp9");
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("info" + row).addChild(scale9sprite, 2);
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
                    sp = new cc.Sprite(res['speaker' + i + '_png']);
                    sp.setName('speaker' + i);
                    sp.setPosition(posConf.ltqpVoicePos[max_player_num][row]);
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
            //scale9sprite.setScale(1.6, 1.6);
            scale9sprite.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));
        },
        showChat: function (row, type, content, voice, uid) {
            if(row == undefined)  return;
            if (type == 'voice') {
                var url = decodeURIComponent(content);
                if (url && url.split(/\.spx/).length > 2) {
                    return;
                }
            }

            if (type == 'voice') {
                this.playUrlVoice(row, type, content, voice, uid);
                return;
            }

            // $("info" + row).setLocalZOrder(1);

            var scale9sprite = $("info" + row + ".qp9");
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("info" + row).addChild(scale9sprite, 2);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);

            var duration = 4;
            var innerNodes = [];
            scale9sprite.setCascadeOpacityEnabled(false);
            scale9sprite.setScale(1);
            if (type == "emoji") {
                scale9sprite.setOpacity(0);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);

                // var sprite = $("emoji", scale9sprite);
                // if (!sprite) {
                //     sprite = new cc.Sprite();
                //     sprite.setName("emoji");
                //     //sprite.setScale(1.2);//ruru
                //     sprite.setPosition(posConf.ltqpEmojiPos[max_player_num][row]);
                //     scale9sprite.addChild(sprite);
                // }
                // setSpriteFrameByName(sprite, content, "chat/emoji");
                // sprite.setVisible(true);
                // sprite.setOpacity(255);
                // innerNodes.push(sprite);

                //表情动画
                var index = content.substring(10, 11);
                var ccsScene = ccs.load(res['expression' + index], "res/");
                var express = ccsScene.node;
                express.setName("express");
                express.setPosition(cc.p(scale9sprite.getContentSize().width / 2 + 20, scale9sprite.getContentSize().height / 2));
                scale9sprite.addChild(express);
                express.runAction(ccsScene.action);
                ccsScene.action.play('action', true);
                this.scheduleOnce(function () {
                    express.removeFromParent();
                }, 2);
            } else if (type == "text") {
                scale9sprite.setOpacity(255);
                var text = $("text", scale9sprite);
                if (!text) {
                    text = new ccui.Text();
                    text.setName("text");
                    text.setFontSize(25);
                    text.setAnchorPoint(0, 0);
                    scale9sprite.addChild(text);
                }

                text.setString(content);

                var size = cc.size(text.getVirtualRendererSize().width + posConf.ltqpRect[row].width-40, posConf.ltqpRect[row].height);
                text.setPosition(
                    (size.width - text.getVirtualRendererSize().width) / 2 + posConf.ltqpTextDelta[max_player_num][row].x,
                    (size.height - text.getVirtualRendererSize().height) / 2 + posConf.ltqpTextDelta[max_player_num][row].y
                );
                scale9sprite.setContentSize(size);
                text.setVisible(true);
                innerNodes.push(text);
            } else if (type == "voice") {
                scale9sprite.setOpacity(255);
                var url = decodeURIComponent(content);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
                // var arr = url.split(/\.spx/)[0].split(/-/);
                // duration = arr[arr.length - 1] / 1000;
                // playVoiceByUrl(url);
                VoiceUtils.play(url);
                var map = {};
                for (var i = 1; i <= 3; i++) {
                    var sp = $("speaker" + i, scale9sprite);
                    if (!sp) {
                        sp = new cc.Sprite(res['speaker' + i + '_png']);
                        sp.setName("speaker" + i);
                        sp.setPosition(posConf.ltqpVoicePos[max_player_num][row]);
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
            scale9sprite.setVisible(true);
            //scale9sprite.setScale(1.6, 1.6);  //ruru
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
        setAfterGameStart: function (cb) {
            this.afterGameStart = cb;
        },
        setReady: function (uid) {
            $("info" + uid2position[uid] + ".ok").setVisible(true);
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
                                    NetUtils.uploadFileToOSS(voiceFilename, uploadFilename, function (url) {
                                        cc.log(url);
                                        var obj = {};
                                        obj.type = 'voice';
                                        obj.content = encodeURIComponent(url);
                                        network.wsData([
                                            'Say',
                                            JSON.stringify(obj)
                                        ].join('/'));
                                    }, function () {
                                        cc.log("upload fail");
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

        //此消息整体去掉，改为PlayerInfoLayer界面上的通用接口
        // onSendEffectEmoji: function (emojiIdx, times, targetUid) {
        //     var _obj = [];
        //     _obj.push(targetUid);
        //     var obj = {};
        //     obj.type = 'effectemoji';
        //     obj.emoji_idx = emojiIdx;
        //     obj.emoji_times = times;
        //     obj.target_uid = _obj;
        //     network.wsData([
        //         'Say',
        //         JSON.stringify(obj)
        //     ].join('/'));
        // },
        addEffectEmojiQueue: function (caster, patientList, emojiId, times) {
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
            var _frame = cc.spriteFrameCache.getSpriteFrame(_emojiCfg.name + 'temp.png');
            if (!_frame) {
                cc.spriteFrameCache.addSpriteFrames(res['effect_emoji_' + _emojiCfg.name]);
                _frame = cc.spriteFrameCache.getSpriteFrame(_emojiCfg.name + 'temp.png');
            }
            this.effectEmojiBegin(_emojiCfg, sp, _frame, caster, patient);
        },
        effectEmojiBegin: function (emojiCfg, sp, frame, caster, patient) {
            var that = this;
            var _beginPos = $('info' + caster).getPosition();
            var _addPos = $('info' + caster + '.head');
            _beginPos = cc.p(_beginPos.x + _addPos.x, _beginPos.y + _addPos.y);
            sp.setPosition(_beginPos);
            if (emojiCfg.name != 'bomb') {
                playFrameAnim2(res['effect_emoji_' + emojiCfg.name], emojiCfg.name + 'start', 1, emojiCfg.startFrames, 0.05, false, sp, function () {
                    that.effectEmojiflying(emojiCfg, sp, frame, caster, patient);
                })
            }
            if (emojiCfg.name == 'bomb') {
                var _shvlitime, _shvlirotate;
                if (max_player_num == 5
                        ? (caster == 2 ||
                        (caster == 3 && (patient == 4 || patient == 5 || patient == 1)) ||
                        (caster == 4 && patient == 5))
                        : (caster == 2 ||
                        (caster == 3 && patient == 4))) {
                    _shvlitime = 0.2;
                    _shvlirotate = 45;
                } else if (max_player_num == 5
                        ? ((caster == 1 && (patient == 2 || patient == 3 || patient == 4)) ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)) ||
                        (caster == 5 && (patient == 1 || patient == 2 || patient == 3 || patient == 4)))
                        : ((caster == 1 && (patient == 2 || patient == 3)) ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)))) {
                    _shvlitime = 0.2;
                    _shvlirotate = -45;
                } else {
                    _shvlitime = 0.1;
                    _shvlirotate = 0;
                }
                sp.setSpriteFrame(frame);
                sp.runAction(cc.sequence(
                    cc.moveBy(0, 0, 40),
                    cc.moveBy(0.3, 0, -40).easing(cc.easeIn(1.5)),
                    cc.rotateBy(0.1, -10).easing(cc.easeOut(1.5)),
                    cc.rotateBy(0.1, 20).easing(cc.easeOut(1.5)),
                    cc.rotateBy(0.1, -10).easing(cc.easeOut(1.5)),
                    cc.delayTime(0.1),
                    cc.rotateBy(_shvlitime, _shvlirotate).easing(cc.easeOut(1.5)),
                    cc.delayTime(_shvlitime * 1.5),
                    cc.callFunc(function () {
                        that.effectEmojiflying(emojiCfg, sp, frame, caster, patient);
                    })
                ))
            }
        },
        effectEmojiflying: function (emojiCfg, sp, frame, caster, patient) {
            var that = this;
            var _endPos = $('info' + patient).getPosition();
            var _addPos = $('info' + patient + '.head');
            _endPos = cc.p(_endPos.x + _addPos.x, _endPos.y + _addPos.y);
            var _endPos = patient != 1 ? _endPos : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            sp.stopAllActions();
            sp.setSpriteFrame(frame);
            var _flyRotate;
            if (emojiCfg.name == 'bomb') {
                if (max_player_num == 5
                        ? (caster == 2 ||
                        (caster == 3 && (patient == 4 || patient == 5 || patient == 1)) ||
                        (caster == 4 && patient == 5))
                        : (caster == 2 ||
                        (caster == 3 && patient == 4))) {
                    _flyRotate = -105;
                } else if (max_player_num == 5
                        ? ((caster == 1 && (patient == 2 || patient == 3 || patient == 4)) ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)) ||
                        (caster == 5 && (patient == 1 || patient == 2 || patient == 3 || patient == 4)))
                        : ((caster == 1 && (patient == 2 || patient == 3)) ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)))) {
                    _flyRotate = 105;
                } else {
                    _flyRotate = 0;
                }
                sp.runAction(cc.rotateBy(0.5, _flyRotate));
            } else if (emojiCfg.name == 'egg' || emojiCfg.name == 'shoe') {
                if (max_player_num == 5
                        ? (caster == 1 ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)) ||
                        caster == 5)
                        : (caster == 1 ||
                        (caster == 3 && (patient == 1 || patient == 2)) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)))) {
                    _flyRotate = 360;
                } else {
                    _flyRotate = -360;
                }
                sp.runAction(cc.rotateBy(0.5, _flyRotate * 5));
            }
            sp.runAction(cc.sequence(
                patient != 1 ? cc.moveTo(0.5, _endPos) : cc.spawn(cc.moveTo(0.5, _endPos), cc.scaleTo(0.5, 4)),
                cc.callFunc(function () {
                    that.effectEmojiend(emojiCfg, sp, frame, caster, patient);
                })
            ));
        },
        effectEmojiend: function (emojiCfg, sp, frame, caster, patient) {
            var _offsetX = patient == 1 ? emojiCfg.offsetX * 4 : emojiCfg.offsetX;
            var _offsetY = patient == 1 ? emojiCfg.offsetY * 4 : emojiCfg.offsetY;
            if (emojiCfg.name != 'bomb') {
                sp.setRotation(0);
                sp.setPosition(cc.p(sp.getPositionX() + _offsetX, sp.getPositionY() + _offsetY));
                playFrameAnim2(res['effect_emoji_' + emojiCfg.name], emojiCfg.name + 'end', 1, emojiCfg.endFrames, 0.05, false, sp, function () {
                    sp.runAction(cc.sequence(
                        cc.fadeOut(0.3),
                        cc.callFunc(function () {
                            sp.removeFromParent(false);
                        })
                    ))
                })
            }
            if (emojiCfg.name == 'bomb') {
                sp.setSpriteFrame(frame);
                var _flag = 1;
                if (max_player_num == 5
                        ? (caster == 2 ||
                        (caster == 3 && (patient == 4 || patient == 5 || patient == 1)) ||
                        (caster == 4 && patient == 5))
                        : (caster == 2 ||
                        (caster == 3 && patient == 4))) {
                    _flag = 1;
                } else if (max_player_num == 5
                        ? ((caster == 1 && (patient == 2 || patient == 3 || patient == 4)) ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)) ||
                        (caster == 5 && (patient == 1 || patient == 2 || patient == 3 || patient == 4)))
                        : ((caster == 1 && (patient == 2 || patient == 3)) ||
                        (caster == 3 && patient == 2) ||
                        (caster == 4 && (patient == 1 || patient == 2 || patient == 3)))) {
                    _flag = -1;
                } else {
                    _flag = 0;
                }
                sp.runAction(cc.sequence(
                    cc.rotateBy(0.1 * Math.abs(_flag), 110 * _flag).easing(cc.easeOut(1.5)),
                    cc.rotateBy(0.1 * Math.abs(_flag), -80 * _flag).easing(cc.easeOut(1.5)),
                    cc.rotateBy(0.1 * Math.abs(_flag), 50 * _flag).easing(cc.easeOut(1.5)),
                    cc.rotateBy(0.1 * Math.abs(_flag), -20 * _flag).easing(cc.easeOut(1.5)),
                    cc.callFunc(function () {
                        sp.setRotation(0);
                        sp.setPosition(cc.p(sp.getPositionX() + _offsetX, sp.getPositionY() + _offsetY));
                        playFrameAnim2(res['effect_emoji_' + emojiCfg.name], emojiCfg.name + 'end', 1, emojiCfg.endFrames, 0.05, false, sp, function () {
                            sp.runAction(cc.sequence(
                                cc.fadeOut(0.3),
                                cc.callFunc(function () {
                                    sp.removeFromParent(false);
                                })
                            ))
                        })
                    })
                ))
            }
        },
        activatePaomadeng: function () {
            if (this.marqueeUpdater) {
                return;
            }
            var that = this;
            var func = function () {
                if (!that || !cc.sys.isObjectValid(that)) {
                    return;
                }
                var _speaker = $('speaker');
                if (_speaker.isVisible()) {
                    return;
                }
                _speaker.setVisible(false); //关闭跑马灯
                var speakerPanel = $('speaker.panel');
                var text = new ccui.Text();
                text.setFontSize(26);
                text.setColor(cc.color(254, 245, 92));
                text.setAnchorPoint(cc.p(0, 0.5));
                text.enableOutline(cc.color(0, 0, 0), 1);
                speakerPanel.removeAllChildren();
                speakerPanel.addChild(text);
                text.setString(window.inReview ? "风云全民斗牌!" : gameData.Content);
                text.setPositionX(speakerPanel.getContentSize().width);
                text.setPositionY(speakerPanel.getContentSize().height / 2);
                text.runAction(cc.sequence(
                    cc.moveTo(20, -text.getVirtualRendererSize().width, speakerPanel.getContentSize().height / 2),
                    cc.callFunc(function () {
                        $('speaker').setVisible(false);
                    })
                ));
            };
            func();
            this.marqueeUpdater = setInterval(func, 25000);
        },
        fanPai: function (pai, immediatly) {
            var that = this;
            if (pai.getUserData().pai == 0) {
                that.showPaiBack(pai);
                return;
            }
            if (that.isPaiFan(pai) || immediatly) {
                that.hidePaiBack(pai);
                return;
            }
            that.showPaiBack(pai);
            pai.setScaleX(-1);
            pai.getChildByName('paiBack').setScaleX(-1);
            pai.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(FANPAI_DURATION, 0, 1),
                    cc.skewTo(FANPAI_DURATION, 0, 30)
                ),
                cc.callFunc(function () {
                    that.hidePaiBack(pai);
                    pai.getChildByName('paiBack').setScaleX(1);
                }),
                cc.spawn(
                    cc.scaleTo(FANPAI_DURATION, 1, 1),
                    cc.skewTo(FANPAI_DURATION, 0, 0)
                )
            ))
        },
        fanRowPai: function (row, immediatly, myCards) {
            var that = this;
            //自己观战 row==1 return
            if(gameData.isSelfWatching && row == 1 && (gameData.players.length + that.sitDownWatchNum) < max_player_num){
                return;
            }
            //搓牌之前  先不亮牌
            if(mRoom.Cuopai && mRoom.Preview && mRoom.Preview.length > 0 && that.canCuopai && row == 1){
                network.start();
                return;
            }

            $('row' + row).setVisible(true);
            that.getNiuAnimSp(row).setVisible(false);
            for (var i = 0; i < initPaiNum; i++) {
                var pai = that.getPai(row, i);
                that.fanPai(pai, immediatly);
            }

            if (!immediatly) {
                $('row' + row).runAction(cc.sequence(
                    cc.delayTime(FANPAI_DURATION * 2),
                    cc.callFunc(function () {
                        network.start();
                        that.MyCards = null;
                    })
                ))
            }
        },
        changeZhuang: function (zhuangId) {
            var that = this;
            //通比没 庄
            if (mRoom.ZhuangMode == "Tongbi") {
                return;
            }
            var beforZhuangId = -1;
            that.zhuangUid = zhuangId;
            for (var i = 0; i < playerNum; i++) {
                if ($("info" + (i + 1) + ".shenfen").isVisible()) {
                    beforZhuangId = i + 1;
                }
            }

            var nowZhuangId = -1;
            for (var i = 0; i < playerNum; i++) {
                $("info" + (i + 1) + ".shenfen").setVisible(position2uid[i + 1] == zhuangId);
                if ($("info" + (i + 1) + ".shenfen").isVisible()) {
                    nowZhuangId = i + 1;
                }
            }
            // beforZhuangId = 1;
            // nowZhuangId = 2;
            if (beforZhuangId != -1 && nowZhuangId != -1 && beforZhuangId != nowZhuangId) {
                var changZhuangAni = function () {
                    //播放上庄的动画
                    var i = nowZhuangId;
                    var head = $("info" + i + ".head");
                    var zhuangAni = $("info" + i + ".head").getChildByName('zhuangAni');
                    if (zhuangAni) zhuangAni.removeFromParent(true);


                    $("info" + i + ".shenfen").setVisible(false);
                    that.scheduleOnce(function () {
                        playEffect('dingzhuang');
                    }, 0.2);
                    var ccsScene = ccs.load(res["DN_qiangzhuang0" + ((i == 5 || i == 6) ? 2 : 1) + "_json"], "res/");
                    zhuangAni = ccsScene.node;
                    zhuangAni.setScale((i == 5 || i == 6 || i == 1) ? 1 : 0.88);
                    var pos = cc.p(100, 45);
                    if (i == 5 || i == 6) {
                        pos = cc.p(head.getContentSize().width / 2, 25);
                    } else if (i == 1) {
                        pos = cc.p(110, 45);
                    }
                    zhuangAni.setPosition(pos);
                    zhuangAni.setName("zhuangAni");
                    head.addChild(zhuangAni, 100);
                    zhuangAni.runAction(ccsScene.action);
                    ccsScene.action.play('action', false);

                    that.scheduleOnce(function () {
                        zhuangAni.setVisible(false);
                        $("info" + i + ".shenfen").setVisible(true);
                    }, 1.5);
                }

                var beforeZhuangSprite = $("info" + beforZhuangId + ".shenfen");
                beforeZhuangSprite.setVisible(false);
                var nowZhuangSprite = $("info" + nowZhuangId + ".shenfen");
                nowZhuangSprite.setVisible(false);
                var beforeToMid = beforeZhuangSprite.convertToWorldSpace(cc.p(0, 0));
                var midToNow = nowZhuangSprite.convertToWorldSpace(cc.p(0, 0));
                var newZhuangSprite = new cc.Sprite(res.zhuang_png);
                newZhuangSprite.setPosition(cc.p(beforeToMid.x + 30, beforeToMid.y + 30));
                that.addChild(newZhuangSprite);
                newZhuangSprite.runAction(cc.sequence(
                    cc.callFunc(function () {
                        leftTime = -100;
                        //todo ruru
                        prompt = gameData.playerMap[position2uid[nowZhuangId]].nickname + "成为庄家";
                        //$('prompt_bg.prompt').setString(prompt);
                    }),
                    cc.moveTo(0.5, cc.p(400, 360)),
                    cc.delayTime(0.5),
                    cc.moveTo(0.5, cc.p(midToNow.x + 30, midToNow.y + 30)),
                    cc.callFunc(changZhuangAni),
                    cc.removeSelf()
                ));
            }
        },
        faAllPai: function (needShowAnim) {
            var that = this;

            if (needShowAnim) {
                // network.stop([P.GS_Chat]);
                for (var i = 0; i < 5; i++) {
                    that.scheduleOnce(function () {
                        playEffect('fapai');//发牌音效
                    }, 0.1 * i);
                }
            }
            var showCards = function(){
                if(that.MyCards && that.fapaiAniing) {
                    network.stop([P.GS_Chat]);
                    that.setPaiArrOfRow(1, that.MyCards);
                    that.fanRowPai(1);
                }
            }
            var func = function (i, j, isSelf) {
                var sprite = new cc.Sprite();
                sprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('b/poker_back.png'));
                sprite.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
                sprite.setScale(0);
                that.addChild(sprite);
                var pai = that.getPai(i, j);
                if(pai)  Filter.remove(pai);
                pai.setVisible(false);

                //再发牌动画的时候  动画目标 需要重新计算下目标位置
                //因为 出牌的时候 位置会发生变化
                //无论何时界面上面的pai0和pai1位置永远不变，所以使用0和1的位置差初始化位置
                var dis = posConf.paiADistance[i] || posConf.paiADistance[i / 10];
                pai.setPositionX(dis * j + posConf.paiStartPoint[i]);

                var x = pai.getPositionX() * $('row' + i).getScaleX() + $('row' + i).getPositionX();
                var y = pai.getPositionY() * $('row' + i).getScaleY() + $('row' + i).getPositionY();
                sprite.runAction(cc.sequence(
                    cc.delayTime(0 * (i - 1) + 0.05 * j),
                    cc.spawn(
                        cc.moveTo(0.1, x, y),
                        cc.scaleTo(0.1, $('row' + i).getScale())
                    ),
                    cc.callFunc(function () {
                        sprite.removeFromParent(true);
                        pai.setVisible(true);
                        that.setPaiHua(pai, 0);
                        if (i == playerNum && j == initPaiNum - 1) {
                            showCards();
                            that.fapaiAniing = false;
                            var hasNotChipInPlayers = false;
                            for (var k = 1; k <= playerNum; k++) {
                                if(gameData.isSelfWatching && max_player_num > (gameData.players.length + that.sitDownWatchNum)){
                                    k = k + 1;
                                }
                                if (gameData.players[position2playerArrIdx[k]].chipIn == -1) {
                                    hasNotChipInPlayers = true;
                                    break;
                                }
                            }
                            if ((gameData.isSelfWatching ? true : (gameData.players[position2playerArrIdx[1]].chipIn >= 0)) && hasNotChipInPlayers) {
                                //that.showWaiting(TEXTURE_CHIPIN);
                                //that.showWaiting('等待玩家下注');
                                that.showTipMsg("等待玩家下注");
                            } else {
                                //that.hideWaiting(TEXTURE_CHIPIN);
                                //that.hideWaiting('等待玩家下注');
                                that.showTipMsg("等待玩家下注");

                            }
                        }
                    })
                ))
            };
            for (var i = 1; i <= playerNum; i++) {
                var userRow = i;
                if(gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)){
                    userRow = userRow + 1;
                }
                $('row' + userRow).setVisible(true);
                that.getNiuAnimSp(userRow).setVisible(false);
                for (var j = 0; j < initPaiNum; j++) {
                    if (needShowAnim) {
                        var isSelf = false;
                        if (userRow == 1) isSelf = true;
                        func(userRow, j, isSelf);
                    } else {
                        var pai = that.getPai(userRow, j);
                        pai.setVisible(true);
                        that.showPaiBack(pai);
                        that.fapaiAniing = false;
                        that.scheduleOnce(function(){
                            showCards();
                        }, 0.2)
                    }
                }
            }
        },
        faSiglePai: function (player) {
            if (player.uid == gameData.uid) {
                return;
            }
            var that = this;
            var row = uid2position[player.uid];
            $('row' + row).setVisible(true);
            that.getNiuAnimSp(row).setVisible(false);
            for (var j = 0; j < initPaiNum; j++) {
                var pai = that.getPai(row, j);
                pai.setVisible(true);
                that.showPaiBack(pai);
            }
        },

        onTimer: function () {
            /*游戏中的所有状态列表
             action == "chuangjianfangjian"//创建房间ok
             action == "dengwanjia";//等待玩家加入ok
             action == "dengfangzhu";//等待房主开始ok
             action == "fapai"//发牌中
             action == "qiangzhuang"//可以抢庄
             action == "qiangzhuangend"//抢庄结束
             action == "xiazhuxian"//闲家可以下注
             action == "xiazhuxianend"//闲家下注结束
             action == "xiazhuzhuang"//庄家 是我
             action == "liangpai"//可以亮牌
             action == "liangpaiend"//亮牌结束
             action == "dengdaikaishi"//开始新局
             action == "dengdaikaishiend"//等待其他人开始新局
             */
            if(gameData.mapId == MAP_ID.CRAZYNN){
                return;
            }

            if (leftTime >= 0) leftTime--;

            //纯文字显示  没有leftTime
            if (leftTime > 0) {//正常倒计时阶段
                $('prompt_bg.prompt').setTextColor(cc.color("#E2D54A"));
                $('prompt_bg.prompt').setString(prompt + ":" + leftTime);
                if (leftTime < 4) {  //警告阶段
                    //根据实际状态确定警告内容
                    if (promptAction === "xiazhuxian") {
                        prompt = "即将选最低分";
                        $('prompt_bg.prompt').setTextColor(cc.color("#FF0000"));
                        $('prompt_bg.prompt').setString(prompt + ":" + leftTime);
                    } else if (promptAction === "qiangzhuang") {
                        prompt = "即将选最低倍数";
                        if (!(mRoom.Preview == 'san' || mRoom.Preview == 'si')){
                            prompt = "即将放弃抢庄";
                        }
                        $('prompt_bg.prompt').setTextColor(cc.color("#FF0000"));
                        $('prompt_bg.prompt').setString(prompt + ":" + leftTime);
                    }
                }
            } else {//只是显示阶段未倒计时
                $('prompt_bg.prompt').setTextColor(cc.color("#E2D54A"));
                $('prompt_bg.prompt').setString(prompt);
            }
        },

        checkPaiRule: function () {

        },
        checkPaiRuleResult: function () {
            var arr = this.getUpPaiArr();
            var _arr = this.getDownPaiArr();

            $("tip_niu").setVisible(true);

            if(arr.length == 3) {
                $('tip_niu.selectscore_bg').setVisible(true);
                var allscore = 0;
                for (var s = 1; s <= 3; s++) {
                    var score = 0;
                    if (arr[s - 1]) score = pokerRule.getPaiValueNN(arr[s - 1]);
                    allscore += score;
                    $('tip_niu.selectscore_bg.num' + s).setString((score == 0) ? '' : score);
                }
                $('tip_niu.selectscore_bg.num4').setString(allscore);
            }else{
                $('tip_niu.selectscore_bg').setVisible(false);
            }

            $("tip_niu.niuniu").setVisible(true);
            //顺序 五小牛  炸弹牛 五花牛 葫芦牛 同花牛 顺子牛
            if(arr.length == 5){
                if (pokerRule.isFiveSmall(arr)) {
                    $("tip_niu.niuniu").setTexture(res.DN_wuxiaoniu_png);
                } else if (pokerRule.isBomb(arr)) {
                    $("tip_niu.niuniu").setTexture(res.DN_zhadanniu_png);
                }else if (pokerRule.isWuhua(arr)) {//五花牛
                    $("tip_niu.niuniu").setTexture(res.DN_wuhuaniu_png);
                }else if (pokerRule.isHulu(arr)) {
                    $("tip_niu.niuniu").setTexture(res.DN_niu16_png);
                }else if (pokerRule.isTonghua(arr)) {
                    $("tip_niu.niuniu").setTexture(res.DN_niu15_png);
                }else if (pokerRule.isShunzi(arr)) {
                    $("tip_niu.niuniu").setTexture(res.DN_niu14_png);
                }else{
                    $("tip_niu.niuniu").setTexture(res.DN_niu0_png);
                }
            }else if(arr.length == 4){
                if (pokerRule.isBomb(arr)) {
                    $("tip_niu.niuniu").setTexture(res.DN_zhadanniu_png);
                }else{
                    $("tip_niu.niuniu").setTexture(res.DN_niu0_png);
                }
            }else if(arr.length == 3){
                if (pokerRule.isNiu(arr)) {
                    var count = pokerRule.getNiuCount(_arr);
                    if (count > 0)
                        $("tip_niu.niuniu").setTexture(res["DN_niu" + count + "_png"]);
                    else
                        $("tip_niu.niuniu").setTexture(res["DN_niuniu_png"]);
                } else {
                    $("tip_niu.niuniu").setTexture(res.DN_niu0_png);
                }
            }else{
                $("tip_niu.niuniu").setVisible(false);
            }
        },
        //isFanpai是否翻牌  isSelf
        showPaiResult: function (player, curShowAniUid, isFanpai) {
            var that = this;
            if(player == null)  return;
            if (player.handStatus <= 0) {
                that.faSiglePai(player);
                return;
            }
            var row = uid2position[player.uid];
            var cards = player.cards;
            var result = player.niuResult;
            var niuRatio = player.niuRatio;
            if (row == 1) {
                that.setPaiArrOfRow(10, cards, result);
                $('row1').setVisible(false);
                $('row10').setVisible(true);
                if (curShowAniUid == player.uid) {
                    var func = function (i) {
                        var pai = that.getPai(1, i);
                        var sprite = duplicateSprite(pai);
                        sprite.setPosition(pai.getPositionX() * $('row1').getScaleX() + $('row1').getPositionX(),
                            pai.getPositionY() * $('row1').getScaleY() + $('row1').getPositionY());
                        sprite.setScale($('row1').getScale());
                        sprite.setVisible(true);
                        that.addChild(sprite);
                        var pai2 = that.getPai(10, i);
                        pai2.setVisible(false);
                        var x = pai2.getPositionX() * $('row10').getScaleX() + $('row10').getPositionX();
                        var y = pai2.getPositionY() * $('row10').getScaleY() + $('row10').getPositionY();
                        sprite.runAction(cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.1, x, y),
                                cc.scaleTo(0.1, $('row10').getScale() - 0.1)
                            ),
                            cc.scaleTo(0.05, $('row10').getScale()),
                            cc.callFunc(function () {
                                sprite.removeFromParent(true);
                                pai2.setVisible(true);
                            })
                        ))
                    };

                    for (var i = 0; i < initPaiNum; i++) {
                        func(i);
                    }

                    var sp = that.getNiuAnimSp(1);
                    if(sp) {
                        sp.removeAllChildren();
                    }
                    $('row10').runAction(cc.sequence(
                        cc.delayTime(0.2),
                        cc.callFunc(function () {
                            that.showResultAnim(10, result, false, niuRatio);
                        })
                    ))
                } else {
                    for (var i = 0; i < initPaiNum; i++) {
                        that.showResultAnim(10, result, true, niuRatio);
                    }
                }
            } else {
                that.setPaiArrOfRow(row, cards, result);
                if (curShowAniUid == player.uid) {
                    network.stop([P.GS_GameShowHand, P.GS_Chat]);
                    if(isFanpai){
                        that.fanRowPai(row);
                    }else {
                        network.start();
                    }
                    $('row' + row).runAction(cc.sequence(
                        // cc.delayTime(FANPAI_DURATION * 2),
                        cc.callFunc(function () {
                            that.showResultAnim(row, result, false, niuRatio);
                        })
                    ))
                } else {
                    if(isFanpai){
                        that.fanRowPai(row);
                    }else {
                        network.start();
                    }
                    that.showResultAnim(row, result, true, niuRatio);
                }
            }
        },

        showResultAnim: function (row, result, immediatly, niuRatio) {
            //14顺子牛  15同花牛  16葫芦牛
            $("tip_niu").setVisible(false);

            playEffect('liangpai');//亮牌音效

            var that = this;
            // result = 14;

            //牛牛结果显示的图片节点
            var sp = that.getNiuAnimSp(row);
            sp.setVisible(true);

            //庄家完成标记
            if(result && result == 100){
                var niuRatioSprite = sp.getChildByName("niuRatioSprite");
                if (niuRatioSprite) {
                    niuRatioSprite.setVisible(false);
                    niuRatioSprite.removeAllChildren();
                }
                var niuResultSprite = sp.getChildByName("niuResultSprite");
                if (niuResultSprite) {
                    niuResultSprite.setVisible(false);
                    niuResultSprite.removeAllChildren();
                }

                var finish = sp.getChildByName("finish");
                if(finish == null) {
                    finish = new cc.Sprite(res.DN_finish_png);
                    finish.setPosition(cc.p(sp.getContentSize().width / 2 + 50, sp.getContentSize().height / 2));
                    finish.setName("finish");
                    sp.addChild(finish);
                }
                finish.setVisible(true);
                return;
            }

            if (typeof result !== 'number' || result < 0 || result > 16) {
                result = 0;
            }
            result = Math.floor(result);

            //倍数
            var finish = sp.getChildByName("finish");
            if(finish)  finish.setVisible(false);

            var niuRatioSprite = sp.getChildByName("niuRatioSprite");
            if (!niuRatioSprite) {
                var niuRatioSprite = new cc.Sprite();
                niuRatioSprite.setPosition(cc.p(130, 0));
                niuRatioSprite.setName("niuRatioSprite");
                sp.addChild(niuRatioSprite);
            }
            var isRatio = false;

            if (immediatly) {

            } else {
                if (niuRatio && niuRatio >= 2 && niuRatio <= 9) {
                    niuRatioSprite.setVisible(true);
                    niuRatioSprite.removeAllChildren(true);

                    var ccsScene = ccs.load(res['DN_niu_cheng' + niuRatio + "_json"], "res/");
                    var niuAction = ccsScene.node;
                    niuAction.setScale(1.0);
                    niuAction.setPosition(cc.p(niuRatioSprite.getContentSize().width / 2, niuRatioSprite.getContentSize().height / 2));
                    niuAction.setName("niuCheng");
                    niuRatioSprite.addChild(niuAction);
                    niuAction.runAction(ccsScene.action);
                    ccsScene.action.play('action', false);
                    isRatio = true;
                } else {
                    niuRatioSprite.setVisible(false);
                }
            }

            //结果
            var niuResultSprite = sp.getChildByName("niuResultSprite");
            if (!niuResultSprite) {
                var niuResultSprite = new cc.Sprite();
                niuResultSprite.setName("niuResultSprite");
                sp.addChild(niuResultSprite);
            }
            niuResultSprite.setVisible(true);

            if (immediatly) {
                // niuResultSprite.removeAllChildren(true);
                // var ccsScene = ccs.load(res['DN_niu' + result + "_json"], "res/");
                // var niuAction = ccsScene.node;
                // if (isRatio) {
                //     niuAction.setPosition(cc.p(sp.getContentSize().width / 2, sp.getContentSize().height / 2));
                // } else {
                //     niuAction.setPosition(cc.p(sp.getContentSize().width / 2 + 50, sp.getContentSize().height / 2));
                // }
                //
                // niuResultSprite.addChild(niuAction);
                // niuAction.runAction(ccsScene.action);
                // ccsScene.action.play('action', false);

            } else {
                if (row == 10) {
                    row = 1;
                }
                playEffect('nn' + result, position2sex[row]);

                // console.log("动画" + row);
                niuResultSprite.removeAllChildren();
                if([14, 15, 16].indexOf(result) >= 0){
                    var niuSprite = new cc.Sprite(res['DN_niu' + result +'_png']);
                    // niuSprite.setPosition(cc.p());
                    niuSprite.setScale(0.85);
                    niuSprite.setName("niuAction");
                    niuResultSprite.addChild(niuSprite);
                }else {
                    var ccsScene = ccs.load(res['DN_niu' + result + "_json"], "res/");
                    var niuAction = ccsScene.node;
                    if (isRatio) {
                        niuAction.setPosition(cc.p(sp.getContentSize().width / 2, sp.getContentSize().height / 2));
                    } else {
                        niuAction.setPosition(cc.p(sp.getContentSize().width / 2 + 50, sp.getContentSize().height / 2));
                    }
                    niuAction.setName("niuAction");
                    niuResultSprite.addChild(niuAction);
                    niuAction.runAction(ccsScene.action);
                    ccsScene.action.play('action', false);
                }
            }
        },
        getNiuAnimSp: function (row) {
            var sp = $('row' + row + '.anim');
            if (!sp) {
                sp = new cc.Sprite();
                sp.setName('anim');
                sp.setPosition(this.getPai(row, 2).getPosition());
                sp.setPositionY(sp.getPositionY() - 40);
                sp.setPositionX(sp.getPositionX() - 50);
                $('row' + row).addChild(sp, 20);
                sp.setScale(1.4);
            }
            return sp;
        },
        playCoinsFlyAnim: function (rowBegin, rowEnd, cb) {
            var that = this;
            var beginPos = //$('info' + rowBegin).getPosition();
                cc.p(
                    $('info' + rowBegin).getPositionX() + $('info' + rowBegin + ".info_bg").getPositionX(),
                    $('info' + rowBegin).getPositionY() + $('info' + rowBegin + ".info_bg").getPositionY()
                );
            var endPos =  //$('info' + rowEnd + ".info_bg").getPosition();
                cc.p(
                    $('info' + rowEnd).getPositionX() + $('info' + rowEnd + ".info_bg").getPositionX(),
                    $('info' + rowEnd).getPositionY() + $('info' + rowEnd + ".info_bg").getPositionY()
                );

            var headTwinkle = function (row) {
                var headTwinkle = $('info' + row).getChildByName("headTwinkle");
                if (!headTwinkle) {
                    headTwinkle = new cc.Sprite();
                    headTwinkle.setPosition($('info' + row + ".info_bg").getPosition());

                    headTwinkle.setName("headTwinkle");
                    $('info' + row).addChild(headTwinkle);
                }
                var Anim_name = "DN_xiangkuang_guang01_json";
                if (row == 5 || row == 6) {
                    Anim_name = "DN_xiangkuang_guang02_json";
                };

                playAnimScene(headTwinkle, res[Anim_name], 0, 0, false, function () {
                    headTwinkle.removeAllChildren();
                });
            };

            var coinFly = function (i) {
                var sprite = new cc.Node();
                var particleSystem = new cc.ParticleSystem(res.flyIcon_plist);
                particleSystem.setPosition(0, 0);
                particleSystem.setAutoRemoveOnFinish(true);
                sprite.addChild(particleSystem);
                sprite.setPosition(beginPos);

                that.addChild(sprite, 30);
                sprite.runAction(cc.sequence(
                    cc.delayTime(0.01 * i),
                    cc.jumpTo(0.8,
                        cc.p(endPos.x + Math.floor(Math.random() * 61), endPos.y + Math.floor(Math.random() * 61)),
                        30,
                        1).easing(cc.easeOut(1.5)),
                    //cc.delayTime(0.2),
                    cc.callFunc(function () {
                        sprite.removeFromParent(true);
                        headTwinkle(rowEnd);
                        cb && cb()
                    })
                ))
            };
            coinFly(1);
            // for (var i = 0; i < 10; i++) {
            //     coinFly(i);
            // }
        },
        showTips: function (texture) {
            var sp = new cc.Sprite(texture);
            sp.setPosition($('transparent').getPosition());
            sp.setScale(0.7);
            this.addChild(sp, 40);
            sp.runAction(cc.sequence(
                cc.scaleTo(0.05, 1.1),
                cc.scaleTo(0.02, 1),
                cc.delayTime(1.5),
                cc.spawn(
                    cc.moveBy(0.8, cc.p(0, 100)),
                    cc.fadeOut(0.8)
                ),
                cc.callFunc(function () {
                    sp.removeFromParent(true);
                })
            ))
        },
        hideTipMsg: function () {
            if(gameData.mapId == MAP_ID.CRAZYNN){
                return;
            }
            $('prompt_bg').setVisible(false);
        },
        showTipMsg: function (action, state) {
            if(gameData.mapId == MAP_ID.CRAZYNN){
                return;
            }
            if(gameData.players && gameData.players.length == 0){
                $('prompt_bg').setVisible(false);
                return;
            }
            $('prompt_bg').setVisible(true);
            var szTipPrompt = $('prompt_bg.prompt');

            console.log("action==="+action);
            if ("" != action) {
                //根据action状态区分显示内容
                //根据倒计时发生的状态更新显示Tip的内容
                if (action == "qiangzhuang" || action == 1) {//可以抢庄
                    promptAction = "qiangzhuang";
                    prompt = "请选择抢庄倍数";
                    if (!(mRoom.Preview == 'san' || mRoom.Preview == 'si')){
                        prompt = "请选择是否抢庄";
                    }
                }
                if (action == "qiangzhuangend") {//可以抢庄结束
                    promptAction = "qiangzhuangend";
                    prompt = "等待其他人抢庄";
                } else if (action == "xiazhuxian" || action == 2) {//可以下注
                    promptAction = "xiazhuxian";
                    prompt = "请选择下注分数";
                } else if (action == "xiazhuxianend" || action == 2) {//可以下注
                    promptAction = "xiazhuxianend";
                    prompt = "等待其他人下注";
                } else if (action == "xiazhuzhuang") {//庄家 是我
                    promptAction = "xiazhuzhuang";
                    prompt = "等待闲家下注";
                } else if (action == "liangpai" || action == 3) {//可以亮牌
                    promptAction = "liangpai";
                    prompt = "请亮牌";
                } else if (action == "liangpaiend") {//可以亮牌
                    promptAction = "liangpaiend";
                    prompt = "还有人在冥思苦想";
                } else if (action == "dengdaikaishi" || action == 4) {//等待新局
                    promptAction = "dengdaikaishi";
                    prompt = "新的牌局即将开始";
                } else if(action == "dengdaikaishiend"){
                    promptAction = "dengdaikaishiend";
                    prompt = "等待其他玩家准备";
                }

                if (leftTime < 0) {
                    szTipPrompt.setString(prompt)
                } else {
                    szTipPrompt.setString(prompt + ":" + leftTime)
                }
                return;
            }

            if (P.GS_UserJoin == state) {
                leftTime = 0;
                var players = gameData.players || [];
                if (players.length == 1) {
                    prompt = "等待玩家加入…";
                    promptAction = "chuangjianfangjian";
                    szTipPrompt.setString(prompt);
                }
                else if (players.length > 1) {
                    if (mRoom.ownner == gameData.uid) {
                        prompt = "等待其他玩家加入…";
                        promptAction = "dengwanjia";
                        szTipPrompt.setString(prompt)
                    }
                    else {
                        var _player = function () {
                            for (var i = 0; i < players.length; ++i) {
                                if (mRoom.ownner == gameData.uid) {
                                    return players[i];
                                }
                                else if(i == players.length){
                                    return players[0];
                                }

                            }
                        }();
                        //var _player =  players[0];
                        //console.log(players);
                        var nickname = "房主";
                        if(_player && _player["nickname"])  nickname = _player["nickname"];
                        prompt = "等待" + ellipsisStr(nickname, 5) + "开始游戏";
                        if(gameData.currentRound > 1){
                            prompt = "等待其他玩家准备游戏";
                        }
                        promptAction = "dengfangzhu";
                        szTipPrompt.setString(prompt)
                    }
                }
            }
        },
        showWaiting: function (texture) {
            // $('waiting').setVisible(true);
            // var sp = $('waiting.sp');
            // if (!sp) {
            //     sp = new cc.Sprite(texture);
            //     sp.setName('sp');
            //     $('waiting').addChild(sp);
            // }
            // sp.setTexture(texture);

            // $('Tip').setVisible(false);
            // var text = $('Tip.msg');
            // if (!text) {
            //     text = new ccui.Text();
            //     text.setFontSize(36);
            //     text.setColor(cc.color(226, 213, 74));
            //     text.setAnchorPoint(cc.p(0.5, 0.5));
            //     text.setString(texture);
            //     text.setPositionX(300);
            //     text.setPositionY(248);
            //     text.setName('msg');
            //     $('Tip').addChild(text);
            // }
            // text.setString(texture);
        },
        hideWaiting: function (szStr) {
            // if (texture) {
            //     var sp = $('waiting.sp');
            //     if (sp && sp.getTexture() === texture) {
            //         $('waiting').setVisible(false);
            //     }
            // } else {
            //     $('waiting').setVisible(false);
            // }
            // if (szStr) {
            //     var sp = $('Tip.msg');
            //     if (sp && sp.getString() === szStr) {
            //         $('Tip').setVisible(false);
            //     }
            // } else {
            //     $('Tip').setVisible(false);
            // }
        },
        hideJiaoFen: function (Banker) {
            for (var i = 1; i <= playerNum; i++) {
                //自己观战 i需要加1
                var row = i;
                if(gameData.isSelfWatching  && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)){
                    row = row + 1;
                }
                var head = $("info" + row + ".head");

                var jiaofen = $("info" + row + ".jiaofen");
                var jiaofenSprite = jiaofen.getChildByName("jiaofenSprite");
                if (jiaofenSprite) {
                    jiaofenSprite.setVisible(false);
                }

                var info_bg = $("info" + row + ".info_bg");
                var guangquan = info_bg.getChildByName("guangquan");
                if (guangquan) guangquan.removeFromParent();
                var qiangfinish = head.getChildByName("qiangfinish");
                if (qiangfinish) qiangfinish.removeFromParent();
                if (position2uid[row] == Banker) {

                    this.scheduleOnce(function () {
                        playEffect("dingzhuang");
                    }, 0.2);

                    var ccsScene = ccs.load(res["DN_qiangzhuang0" + ((row == 5 || row == 6) ? 2 : 1) + "_json"], "res/");
                    qiangfinish = ccsScene.node;
                    qiangfinish.setScale((row == 5 || row == 6 || row == 1) ? 1 : 0.88);
                    var pos = cc.p(100, 45);
                    if (row == 5 || row == 6) {
                        pos = cc.p(head.getContentSize().width / 2, 25);
                    } else if (row == 1) {
                        pos = cc.p(110, 45);
                    }
                    qiangfinish.setPosition(pos);
                    qiangfinish.setName("qiangfinish");
                    head.addChild(qiangfinish, 100);
                    qiangfinish.runAction(ccsScene.action);
                    ccsScene.action.play('action', false);
                }
            }
        },
        flyJiaoFen: function (status, row) {
            //status
            var jiaofenSrc = res["jiaofen_" + status + "_png"];
            if (status == -2) jiaofenSrc = res.jiaofen_no_png;

            var jiaofen = $("info" + row + ".jiaofen");
            if (jiaofen == null || status == null || row == null)  return;
            var jiaofenSprite = jiaofen.getChildByName("jiaofenSprite");
            if (jiaofenSprite == null) {
                jiaofenSprite = new cc.Sprite(jiaofenSrc);
                jiaofenSprite.setName("jiaofenSprite");
                jiaofen.addChild(jiaofenSprite);
            }
            jiaofenSprite.setOpacity(255);
            jiaofenSprite.setVisible(true);
            jiaofenSprite.setTexture(jiaofenSrc);
            jiaofenSprite.stopAllActions();
            jiaofenSprite.setScale(0);
            jiaofenSprite.runAction(cc.sequence(
                cc.scaleTo(0.2, 0.8, 1.2),
                cc.scaleTo(0.16, 1.1, 0.9),
                cc.scaleTo(0.1, 0.95, 1.05),
                cc.scaleTo(0.1, 1, 1)
                // cc.delayTime(1.5),
                // cc.fadeOut(1)
            ));


            //抢庄音效
            playEffect("niuniuchoose");

            var info_bg = $("info" + row + ".info_bg");
            var ccsScene = ccs.load(res["DN_qiangzhuang0" + ((row == 5 || row == 6) ? 4 : 5) + "_json"], "res/");
            var guangquan = ccsScene.node;
            guangquan.setName("guangquan");
            guangquan.setPosition(cc.p(info_bg.getContentSize().width / 2, info_bg.getContentSize().height / 2));
            info_bg.addChild(guangquan);
            guangquan.setLocalZOrder(2);
            guangquan.runAction(ccsScene.action);
            ccsScene.action.play('action', false);


            // var infobg_1 = $("info" + row).getChildByName('infobg_1');
            // var scaleCount = 0.88;
            // var APonit = info_bg.getAnchorPoint();
            // var infobg1src = "res/image/ui/niuniu/bg/info_frame1_1.png";
            // if (row == 1){
            //     scaleCount = 1.0;
            // }
            // else if(row == 5 || row == 6)  {
            //     scaleCount = 1.0;
            //     infobg1src = "res/image/ui/niuniu/bg/info_frame2_1.png";
            // }
            //
            // if(infobg_1 == null){
            //     infobg_1 = new cc.Sprite(infobg1src);
            //     infobg_1.setScale(scaleCount);
            //     infobg_1.setPosition(info_bg.getPosition());
            //     infobg_1.setAnchorPoint(APonit);
            //     infobg_1.setName("infobg_1");
            //     $("info" + row).addChild(infobg_1);
            // }
            // infobg_1.setTexture(infobg1src);
            // info_bg.stopAllActions();
            // infobg_1.stopAllActions();
            // infobg_1.runAction(cc.sequence(
            //     cc.fadeIn(0.5),
            //     cc.fadeOut(0.5),
            //     cc.fadeIn(0.5),
            //     cc.fadeOut(0.5),
            //     cc.fadeIn(0.5),
            //     cc.fadeOut(0.5)
            // ));
            // info_bg.runAction(cc.sequence(
            //     cc.fadeOut(0.5),
            //     cc.fadeIn(0.5),
            //     cc.fadeOut(0.5),
            //     cc.fadeIn(0.5),
            //     cc.fadeOut(0.5),
            //     cc.fadeIn(0.5)
            // ));
        },
        initBG: function () {
            // var sceneid = cc.sys.localStorage.getItem('sceneid_niuniu') || 0;
            // var bg = $("bg");
            // bg.setTexture(res["table_niuniu_back" + sceneid + "_jpg"]);
        },
        flyFenshu: function (uid, scorenum) {
            playEffect("jiazhu", gameData.sex);

            var row = uid2position[uid];
            var info = $('info' + row);
            var head = $('head', info);
            var chipin = $('info' + row + '.chipin');
            var fenshu = $('fenshu', chipin);
            fenshu.setVisible(false);
            var sPos = info.getPosition();
            sPos.x += head.x;
            sPos.y += head.y;
            var tPos = info.getPosition();
            tPos.x += chipin.x - chipin.width / 2;
            tPos.y += chipin.y - chipin.height / 2;
            tPos.x += fenshu.x;
            tPos.y += fenshu.y;

            //飞金币
            var flycoin = duplicateSprite(fenshu);
            flycoin.setVisible(true);
            flycoin.setScale(2);
            flycoin.setPosition(sPos);
            flycoin.setLocalZOrder(1000);
            this.addChild(flycoin);

            //粒子特效  1绿2蓝3紫4红5黑
            // var lizi = null;
            // if (scorenum > 0) {
            //     var lizisrc = res.s_bkcoin;
            //     switch (scorenum) {
            //         case 1:
            //             lizisrc = res.s_grcoin;
            //             break;
            //         case 2:
            //             lizisrc = res.s_blcoin;
            //             break;
            //         case 3:
            //             lizisrc = res.s_pkcoin;
            //             break;
            //         case 4:
            //             lizisrc = res.s_rdcoin;
            //             break;
            //         default:
            //             lizisrc = res.s_bkcoin;
            //             break;
            //     }
            //     lizi = cc.ParticleSystem.create(lizisrc);
            //     lizi.setPosition(cc.p(flycoin.getContentSize().width / 2, flycoin.getContentSize().height / 2));
            //     lizi.setName("lizi");
            //     flycoin.addChild(lizi, 100);
            // }

            var movetime = Math.sqrt(tPos.x*tPos.x + tPos.y*tPos.y) / 1800;
            flycoin.runAction(cc.sequence(
                cc.callFunc(function () {
                    fenshu.setVisible(false);
                }),
                cc.spawn(cc.moveTo(movetime, tPos.x, tPos.y), cc.scaleTo(movetime, fenshu.getScale())),
                cc.callFunc(function () {
                    fenshu.setVisible(true);
                    flycoin.removeFromParent();
                    // if (lizi) lizi.removeFromParent();
                })
            ));
        },
        initZJNBtn:function(){
            var that = this;

            TouchUtils.setOnclickListener($("zjnLayer.btn_qipai"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_checkgen"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_zhu1"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_zhu2"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_zhu3"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_tuizhu"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_alwaysqirang"), function () {

            });
            TouchUtils.setOnclickListener($("zjnLayer.btn_alwaysgen"), function () {

            });
            $('zjnLayer.tuizhubg.tuizhu').addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.Slider.EVENT_PERCENT_CHANGED:
                        var percent = sender.getPercent();
                        $('zjnLayer.tuizhubg.tuizhutiao').setPercent(percent);
                        $('zjnLayer.tuizhubg.tuizhuts').setPositionY(490 * percent / 100 + 100);
                        break;
                    default:
                        break;
                }
            }, null);

            var touchLayer = new cc.LayerColor(cc.color(0, 0, 0, 1), 150, 600);
            touchLayer.setPosition($('zjnLayer.tuizhubg').getPosition());
            $('zjnLayer').addChild(touchLayer);
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    if(TouchUtils.isTouchMe(touchLayer, touch, event, null)){
                        return true;
                    }
                    return false;
                },
                onTouchEnded: function (touch, event) {
                    var percent = $('zjnLayer.tuizhubg.tuizhu').getPercent();
                    var juli = percent%20;
                    if(juli >= 10){
                        percent = percent + 20 - juli;
                    }else{
                        percent = percent - juli;
                    }
                    $('zjnLayer.tuizhubg.tuizhutiao').setPercent(percent);
                    $('zjnLayer.tuizhubg.tuizhuts').setPositionY(490 * percent / 100 + 100);
                    $('zjnLayer.tuizhubg.tuizhu').setPercent(percent);
                }
            });
            return cc.eventManager.addListener(chupaiListener, touchLayer);
        }
    });
    exports.NiuniuZJNLayer = NiuniuZJNLayer;
})(window);
