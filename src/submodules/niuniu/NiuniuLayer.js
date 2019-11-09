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
            },
            9: {
                1: cc.p(0, 0)
                , 2: cc.p(0, 1)
                , 3: cc.p(0, 1)
                , 4: cc.p(0, 1)
                , 5: cc.p(1, 1)
                , 6: cc.p(0, 1)
                , 7: cc.p(1, 1)
                , 8: cc.p(0, 1)
                , 9: cc.p(1, 1)
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
                , 6: 3
            },
            9: {
                1: 2
                , 2: 0
                , 3: 0
                , 4: 3
                , 5: 1
                , 6: 3
                , 7: 1
                , 8: 3
                , 9: 1
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
                , 6: cc.rect(68, 0, 1, 1)
            },
            9: {
                1: cc.rect(68, 0, 1, 1)
                , 2: cc.rect(68, 0, 1, 1)
                , 3: cc.rect(68, 0, 1, 1)
                , 4: cc.rect(68, 0, 1, 1)
                , 5: cc.rect(68, 0, 1, 1)
                , 6: cc.rect(68, 0, 1, 1)
                , 7: cc.rect(68, 0, 1, 1)
                , 8: cc.rect(68, 0, 1, 1)
                , 9: cc.rect(68, 0, 1, 1)
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
                , 6: cc.p(40, 28)
            },
            9: {
                1: cc.p(40, 28)
                , 2: cc.p(40, 28)
                , 3: cc.p(40, 28)
                , 4: cc.p(40, 28)
                , 5: cc.p(40, 28)
                , 6: cc.p(40, 28)
                , 7: cc.p(40, 28)
                , 8: cc.p(40, 28)
                , 9: cc.p(40, 28)
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
                , 6: cc.p(58, 28)
            },
            9: {
                1: cc.p(40, 40)
                , 2: cc.p(37, 28)
                , 3: cc.p(42, 28)
                , 4: cc.p(42, 28)
                , 5: cc.p(42, 28)
                , 6: cc.p(42, 28)
                , 7: cc.p(42, 28)
                , 8: cc.p(42, 28)
                , 9: cc.p(42, 28)
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
                , 6: cc.p(0, 0)//(6, 3)
            },
            9: {
                1: cc.p(0, 7)//(-1, 7)
                , 2: cc.p(0, -7)//(-7, 2)
                , 3: cc.p(0, -7)//(0, -5)
                , 4: cc.p(0, -7)//(0, -5)
                , 5: cc.p(0, -7)//(6, 3)
                , 6: cc.p(0, -7)//(6, 3)
                , 7: cc.p(0, -7)//(6, 3)
                , 8: cc.p(0, -7)//(6, 3)
                , 9: cc.p(0, -7)//(6, 3)
            }
        }
    };

    var roomState = null;
    var playerNum = 6;
    var max_player_num = 6;

    var btnQiangZhuangArr = [1, 2, 3, 4];//抢庄倍数1 2 3 4倍

    var uid2position = {};
    var position2uid = {};
    var position2sex = {};
    var position2playerArrIdx = {};

    var data = null;
    var isReplay = null;

    var enableChupaiCnt = 0;

    var isReconnect = false;//是不是断线重连

    var effectEmojiQueue = {};
    var effectEmojiCfg = {
        1: {'name': 'zan', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'bomb', 'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3: {'name': 'egg', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4: {'name': 'shoe', 'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5: {'name': 'flower', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0}
    };

    var FANPAI_DURATION = 0.05;

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

    var NiuniuLayer;
    NiuniuLayer = cc.Layer.extend({
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
            var playerLayer = $('playerLayer');
            playerLayer.onCCSLoadFinish = function () {
                that.onPlayerCCSLoadFinish();
            }
            // max_player_num = gameData.maxPlayerNum;

            if (max_player_num == 6) {
                loadCCSTo(res.NiuniuSixPlayerLayer_json, playerLayer, "node");
            } else {
                loadCCSTo(res.NiuniuNinePlayerLayer_json, playerLayer, "node");
            }

            var cardbackLayer = new cc.Layer();
            cardbackLayer.setPosition(cc.p(-cc.winSize.width/2+1280/2, -cc.winSize.height/2+720/2));
            cardbackLayer.setName('cardbackLayer');
            playerLayer.addChild(cardbackLayer, 100);
        },
        onPlayerCCSLoadFinish: function () {
            // getLocationInfo();

            var that = this;
            mRoom.voiceMap = {};
            this.setPanel3(mRoom.roomInfo);
            //设置背景图
            this.initBG();
            //初始化显示的内容的状态
            this.initLoadShowState();

            this.enableChuPai();

            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1) {
                EFFECT_EMOJI_NEW.init(this, $);
            }else{
                EFFECT_EMOJI.init(this, $);
            }

            that.curPlayerIndex = 0;
            //test
            // var huigu = new LastReviewLayer();
            // that.addChild(huigu);

            $('btn_huanpai').setVisible(false);
            $('btn_buhuanpai').setVisible(false);

            //邀请俱乐部在线好友
            this.initClubAssistant();
            this.resetControllBtnsPos();

            if (max_player_num == 4) {
                var row3 = $('playerLayer.node.row3');
                var row4 = $('playerLayer.node.row4');
                var row5 = $('playerLayer.node.row5');
                var info3 = $('playerLayer.node.info3');
                var info4 = $('playerLayer.node.info4');
                var info5 = $('playerLayer.node.info5');
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

            TouchUtils.setOnclickListener($("btn_copy"), function () {
                // if (!cc.sys.isNative)
                //     return;
                var shareurl = getShareUrl(gameData.roomId);

                var title = gameData.companyName + "拼十-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = (gameData.wanfaDesp ? decodeURIComponent(gameData.wanfaDesp) + "," : "") + "速度来啊! 【" + gameData.companyName  + "拼十】" + shareurl;
                console.log(title + "\n" + content);
                savePasteBoard(title + "\n" + content);
                alert1("复制成功");
            });
            //btn_inviteLiaobei
            TouchUtils.setOnclickListener($("btn_inviteLiaobei"), function () {
                var title = gameData.companyName + "拼十-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = (gameData.wanfaDesp ? decodeURIComponent(gameData.wanfaDesp) + "," : "") + "速度来啊! 【"+gameData.companyName+"拼十】";
                var changeTxt = function (content) {
                    var newcontent = content;
                    newcontent = newcontent.replace("双十上庄", "双十做东");
                    newcontent = newcontent.replace("通比玩法", "抢东");
                    newcontent = newcontent.replace("抢庄玩法", "抢东");
                    newcontent = newcontent.replace("明牌抢庄", "看♣️抢东");

                    newcontent = newcontent.replace("局", "次");
                    newcontent = newcontent.replace("AA支付", "AA");
                    newcontent = newcontent.replace("房主支付", "房东付");

                    newcontent = newcontent.replace("五花(6倍)", "🌺x6 ");
                    newcontent = newcontent.replace("炸弹(6倍)", "💣x6 ");
                    newcontent = newcontent.replace("五小(8倍)", "5小x8");
                    newcontent = newcontent.replace("顺子(5倍)", "顺字x5");
                    newcontent = newcontent.replace("葫芦(5倍)", "3带对x5");
                    newcontent = newcontent.replace("同花(5倍)", "同花x5");
                    newcontent = newcontent.replace("下注限制", "🈲打黑🔫");
                    newcontent = newcontent.replace("禁止搓牌", "🈲搓");
                    newcontent = newcontent.replace("扣", "Q");
                    newcontent = newcontent.replace("底分", "分");
                    newcontent = newcontent.replace("推注", "推");
                    newcontent = newcontent.replace("抢庄", "抢");
                    newcontent = newcontent.replace("分", "");
                    newcontent = newcontent.replace("倍", "");
                    return newcontent;
                };
                var newcontent = changeTxt(content);
                var shareurl = getShareUrl(gameData.roomId);
                LBUtils.shareUrl(shareurl, title, newcontent, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_invite"), function () {
                var title = gameData.companyName + "拼十-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = (gameData.wanfaDesp ? decodeURIComponent(gameData.wanfaDesp) + "," : "") + "速度来啊! 【"+gameData.companyName+"拼十】";
                var changeTxt = function (content) {
                    var newcontent = content;
                    newcontent = newcontent.replace("双十上庄", "双十做东");
                    newcontent = newcontent.replace("通比玩法", "抢东");
                    newcontent = newcontent.replace("抢庄玩法", "抢东");
                    newcontent = newcontent.replace("明牌抢庄", "看♣️抢东");

                    newcontent = newcontent.replace("局", "次");
                    newcontent = newcontent.replace("AA支付", "AA");
                    newcontent = newcontent.replace("房主支付", "房东付");

                    newcontent = newcontent.replace("五花(6倍)", "🌺x6 ");
                    newcontent = newcontent.replace("炸弹(6倍)", "💣x6 ");
                    newcontent = newcontent.replace("五小(8倍)", "5小x8");
                    newcontent = newcontent.replace("顺子(5倍)", "顺字x5");
                    newcontent = newcontent.replace("葫芦(5倍)", "3带对x5");
                    newcontent = newcontent.replace("同花(5倍)", "同花x5");
                    newcontent = newcontent.replace("下注限制", "🈲打黑🔫");
                    newcontent = newcontent.replace("禁止搓牌", "🈲搓");
                    newcontent = newcontent.replace("扣", "Q");
                    newcontent = newcontent.replace("底分", "分");
                    newcontent = newcontent.replace("推注", "推");
                    newcontent = newcontent.replace("抢庄", "抢");
                    newcontent = newcontent.replace("分", "");
                    newcontent = newcontent.replace("倍", "");
                    return newcontent;
                };
                var newcontent = changeTxt(content);
                console.log(newcontent);
                var shareurl = getShareUrl(gameData.roomId);
                console.log(shareurl);
                WXUtils.shareUrl(shareurl, title, newcontent, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_inviteXianLiao"), function () {
                if (!cc.sys.isNative)
                    return;
                var title = gameData.companyName + "🐂🐮-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = (gameData.wanfaDesp ? decodeURIComponent(gameData.wanfaDesp) + "," : "") + "速度来啊! 【"+gameData.companyName+"拼十】";
                var changeTxt = function (content) {
                    var newcontent = content;
                    newcontent = newcontent.replace("双十上庄", "双十做东");
                    newcontent = newcontent.replace("通比玩法", "抢东");
                    newcontent = newcontent.replace("抢庄玩法", "抢东");
                    newcontent = newcontent.replace("明牌抢庄", "看♣️抢东");

                    newcontent = newcontent.replace("局", "次");
                    newcontent = newcontent.replace("AA支付", "AA");
                    newcontent = newcontent.replace("房主支付", "房东付");

                    newcontent = newcontent.replace("五花(6倍)", "🌺x6 ");
                    newcontent = newcontent.replace("炸弹(6倍)", "💣x6 ");
                    newcontent = newcontent.replace("五小(8倍)", "5小x8");
                    newcontent = newcontent.replace("顺子(5倍)", "顺字x5");
                    newcontent = newcontent.replace("葫芦(5倍)", "3带对x5");
                    newcontent = newcontent.replace("同花(5倍)", "同花x5");
                    newcontent = newcontent.replace("下注限制", "🈲打黑🔫");
                    newcontent = newcontent.replace("禁止搓牌", "🈲搓");
                    newcontent = newcontent.replace("扣", "Q");
                    newcontent = newcontent.replace("底分", "分");
                    newcontent = newcontent.replace("推注", "推");
                    newcontent = newcontent.replace("抢庄", "抢");
                    newcontent = newcontent.replace("分", "");
                    newcontent = newcontent.replace("倍", "");
                    return newcontent;
                };
                var newcontent = changeTxt(content);

                XianLiaoUtils.shareGame(gameData.roomId, title, gameData.companyName+"拼十" + newcontent, 0, getCurTimestamp() + gameData.uid);
                // XianLiaoUtils.shareUrlWithIcon('http://www.yayayouxi.com/penghuzi2?roomid=' + gameData.roomId);

            });


            $("btn_start").setVisible(false);
            TouchUtils.setOnclickListener($("btn_start"), function () {
                network.wsData(['StartImmediately'].join('/'));
            }, {effect: TouchUtils.effects.NONE});

            TouchUtils.setOnclickListener($("playerLayer.node.info1.info_bg"), function () {
                that.showPlayerInfoPanel(1, $("playerLayer.node.info1").uid);
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($("playerLayer.node.info2.info_bg"), function () {
                that.showPlayerInfoPanel(2, $("playerLayer.node.info2").uid);
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($("playerLayer.node.info3.info_bg"), function () {
                that.showPlayerInfoPanel(3, $("playerLayer.node.info3").uid);
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($("playerLayer.node.info4.info_bg"), function () {
                that.showPlayerInfoPanel(4, $("playerLayer.node.info4").uid);
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($("playerLayer.node.info5.info_bg"), function () {
                that.showPlayerInfoPanel(5, $("playerLayer.node.info5").uid);
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($("playerLayer.node.info6.info_bg"), function () {
                that.showPlayerInfoPanel(6, $("playerLayer.node.info6").uid);
            }, {effect: TouchUtils.effects.NONE});
            if ($("playerLayer.node.info7")) {
                TouchUtils.setOnclickListener($("playerLayer.node.info7.info_bg"), function () {
                    that.showPlayerInfoPanel(7, $("playerLayer.node.info7").uid);
                }, {effect: TouchUtils.effects.NONE});
                TouchUtils.setOnclickListener($("playerLayer.node.info8.info_bg"), function () {
                    that.showPlayerInfoPanel(8, $("playerLayer.node.info8").uid);
                }, {effect: TouchUtils.effects.NONE});
                TouchUtils.setOnclickListener($("playerLayer.node.info9.info_bg"), function () {
                    that.showPlayerInfoPanel(9, $("playerLayer.node.info9").uid);
                }, {effect: TouchUtils.effects.NONE});
            }
            TouchUtils.setOnclickListener($('btn_bg'), function () {
            });
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
            TouchUtils.setOnclickListener($("btn_jiao1"), function () {
                network.wsData([
                    'ChipIn',
                    1,
                    gameData.totalRound - gameData.leftRound
                ].join('/'))
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($("btn_jiao2"), function () {
                network.wsData([
                    'ChipIn',
                    2,
                    gameData.totalRound - gameData.leftRound
                ].join('/'))
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($("btn_jiao3"), function () {
                network.wsData([
                    'ChipIn',
                    3,
                    gameData.totalRound - gameData.leftRound
                ].join('/'))
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($("btn_jiao4"), function () {
                network.wsData([
                    'ChipIn',
                    4,
                    gameData.totalRound - gameData.leftRound
                ].join('/'))
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($("btn_jiao5"), function () {
                network.wsData([
                    'ChipIn',
                    5,
                    gameData.totalRound - gameData.leftRound
                ].join('/'))
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($('ops.niu0'), function () {
                var arr = that.getPaiArr();
                if (pokerRule_NN.checkNiu(arr).length > 0) {
                    //that.showTips(oxtips1);
                    return;
                }
                that.canTouchPai = false;
                network.wsData([
                    'Showhand',
                    true
                ].join('/'));
            });
            TouchUtils.setOnclickListener($('ops.niu1-10'), function () {
                var arr = that.getPaiArr();
                if (pokerRule_NN.isFiveSmall(arr) || pokerRule_NN.isBomb(arr)) {
                    //that.showTips(oxtips2);
                    return;
                }
                that.canTouchPai = false;
                network.wsData([
                    'Showhand',
                    false,
                    that.getUpPaiArr().join(',')
                ].join('/'));
            });
            TouchUtils.setOnclickListener($('ops.bomb'), function () {
                var arr = that.getPaiArr();
                if (pokerRule_NN.isFiveSmall(arr)) {
                    //that.showTips(oxtips2);
                    return;
                }
                that.canTouchPai = false;
                network.wsData([
                    'Showhand',
                    false,
                    arr.join(',')
                ].join('/'));
            });
            TouchUtils.setOnclickListener($('ops.fivesmall'), function () {
                var arr = that.getPaiArr();
                that.canTouchPai = false;
                network.wsData([
                    'Showhand',
                    false,
                    arr.join(',')
                ].join('/'));
            });
            //搓牌
            $('ops.cuopai').setVisible(mRoom.Cuopai);
            TouchUtils.setOnclickListener($('ops.cuopai'), function () {
                network.wsData(['clickCuoPai', gameData.currentRound].join('/'));

                if (that.cuoPaiData && that.cuoPaiData.typ) {
                    that.showHandCard(false);
                    that.scheduleOnce(function () {
                        var cuopaiLayer = that.getChildByName('cuopaiLayer');
                        if (!cuopaiLayer) {
                            if (mRoom.Preview == "si") {
                                cuopaiLayer = new CuoOnePaiLayer(that.cuoPaiData.typ, that.cuoPaiData.cuoData, that.cuoPaiData.topData);
                            } else {
                                cuopaiLayer = new CuoPaiLayer(that.cuoPaiData.typ, that.cuoPaiData.cuoData, that.cuoPaiData.topData);
                            }
                            cuopaiLayer.setName('cuopaiLayer');
                            // cuopaiLayer.initUI();
                            that.addChild(cuopaiLayer);
                        }
                    }, 0.1);
                }
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($('ops.hint'), function () {
                $('ops.hint').setVisible(false);
                $('ops.cuopai').setVisible(false);

                playEffect('tishi');//提示音效
                playEffect("kanpai", gameData.sex);
                that.showTipMsg("liangpaiend");
                that.downAllPaiImmediately();

                //add new 株洲直接出牌   如果是搓牌  先翻牌  在发消息
                var needFanpai = false;
                var arr = that.getPaiArr();
                var cuoCardArr = [];
                if (that.cuoPaiData &&
                    that.cuoPaiData.cuoData && that.cuoPaiData.cuoData.length > 0) {
                    cuoCardArr = deepCopy(that.cuoPaiData.topData);
                    for (var i = 0; i < that.cuoPaiData.cuoData.length; i++) {
                        cuoCardArr.push(that.cuoPaiData.cuoData[i]);
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == 0) {
                        needFanpai = true;
                        var value = (cuoCardArr && cuoCardArr[i]) ? cuoCardArr[i] : 0;
                        arr[i] = value;
                        var pai = that.getPai(1, i);
                        pai.getUserData().pai = value;
                        that.setPaiHua(pai, value);
                        that.fanPai(pai);
                    }
                }
                // that.scheduleOnce(function () {
                // var indexArr = pokerRule_NN.checkNiu(arr);
                // for (var i = 0; i < indexArr.length; i++) {
                //     that.upPai(indexArr[i]);
                // }

                that.canTouchPai = false;
                network.wsData([
                    'Showhand',
                    false,
                    arr.join(',')
                ].join('/'));
                // }, needFanpai ? 0:0);
            }, {effect: TouchUtils.effects.ZOOM});
            network.addListener(P.GS_UserJoin_NiuNiu, function (data) {
                if (data.Result == 0) {
                    if (that.getRoomState() == ROOM_STATE_CREATED) {
                        gameData.roomId = data.RoomID;
                        gameData.players = data.Users;
                        gameData.WatchingUsers = data.WatchingUsers;
                        var option = data.Option == "" ? {} : JSON.parse(decodeURIComponent(data.Option));
                        if(option.wanfadesc && option.wanfadesc.length > 0) gameData.wanfaDesp = option.wanfadesc;
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
                    else if (that.getRoomState() == ROOM_STATE_ONGOING && mRoom.Is_ztjr) {
                        //中途加入
                        gameData.players = data.Users;
                        gameData.WatchingUsers = data.WatchingUsers;
                        that.onPlayerEnterExit(that.curPlayerIndex);
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
            if (data && data.Result == 0) {
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.roomId = data.RoomID;
                    gameData.players = data.Users;
                    var option = data.Option == "" ? {} : JSON.parse(decodeURIComponent(data.Option));
                    if(option.wanfadesc && option.wanfadesc.length > 0)  gameData.wanfaDesp = option.wanfadesc;
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
            //103
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
                        if (gameData.uid == uid && jsData.Chip > 0) {
                            $('PanelPour').setVisible(false);
                        }
                        //是不是上次数据为0，这次新变化的
                        var isNewFlyCoin = true;
                        var p = null;
                        if(gameData.players && gameData.players.length > 0){
                            p = gameData.getPlayerInfoByUid(uid);
                        }
                        var playerChipIn = null;
                        if(p)  playerChipIn = p.chipIn;
                        if (playerChipIn && playerChipIn == jsData.Chip) {
                            isNewFlyCoin = false;
                        }
                        if(p)  p.chipIn = jsData.Chip;
                        if (jsData.Chip > 0) {
                            if (gameData.uid == uid) {
                                //todo ruru
                                //prompt = '等待其他玩家下注';
                            }

                            $('playerLayer.node.info' + uid2position[uid] + '.chipin').setVisible(true);
                            $('playerLayer.node.info' + uid2position[uid] + '.chipin' + '.num').setString(jsData.Chip ? jsData.Chip : '');

                            var n = that.getChipImg(jsData.Chip);
                            $('playerLayer.node.info' + uid2position[uid] + '.chipin' + '.fenshu').setString('' + n);
                            //播放火焰特效
                            var OptionData = gameData.Option;
                            var Difen = 2;
                            if (OptionData.Difen) {
                                Difen = OptionData.Difen.split(",")[1];
                            }
                            if ((mRoom.ZhuangMode != "Tongbi" && mRoom.ZhuangMode != "Auto"
                                && mRoom.ZhuangMode != "Lunliu" && mRoom.ZhuangMode != "ShuijiBawang") && jsData.Chip > Difen) {
                                that.huoYanAni(uid2position[uid], true);
                            }
                            if (isNewFlyCoin) {
                                that.flyFenshu(uid, n);
                            }
                        } else {
                            if (jsData.Chip == -1) {
                                hasNotChipInPlayers = true;
                            }
                            // $('playerLayer.node.info' + uid2position[uid] + '.chipin').setVisible(false);
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
                    var liangpaiNum = 0;

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
                            if (jsData.NiuResult != null) {
                                //搓牌  自己亮牌了  就干掉
                                that.cuoPaiData = {};
                                that.canCuopai = false;
                                // Filter.remove($('ops.hint'));
                                TouchUtils.setClickDisable($('ops.hint'), false);
                                var cuopaiLayer = that.getChildByName('cuopaiLayer');
                                if (cuopaiLayer) {
                                    cuopaiLayer.removeFromParent(true);
                                }
                            }
                        }
                        if (jsData.NiuResult != null) {
                            finishNum++;
                        }else{
                            liangpaiNum ++;
                        }
                        if (finishNum != gameData.players.length
                            && that.zhuangUid && that.zhuangUid != gameData.uid && that.zhuangUid == uid) {
                            if(gameData.players && gameData.players.length > 0){
                                var p = gameData.getUserInfo(uid);
                                if(p){
                                    p.cards = jsData.Cards;
                                    p.handStatus = jsData.HandStatus;
                                    p.niuResult = 100;
                                    p.niuRatio = 0;
                                }
                            }

                        } else {
                            if(gameData.players && gameData.players.length > 0){
                                var p = gameData.getUserInfo(uid);
                                if(p){
                                    p.cards = jsData.Cards;
                                    p.handStatus = jsData.HandStatus;
                                    p.niuResult = jsData.NiuResult;
                                    p.niuRatio = jsData.NiuRatio;//倍数
                                }
                            }
                        }
                        if (jsData.HandStatus > 0) {
                            needShowNow = true;
                        }
                    }
                    var p = null;
                    if(position2playerArrIdx && position2playerArrIdx[1] >= 0 && gameData.players[position2playerArrIdx[1]]){
                        p = gameData.players[position2playerArrIdx[1]];
                    }
                    var selfhandStatus = -1;
                    if(p)  selfhandStatus = p.handStatus;

                    that.canTouchPai = gameData.isSelfWatching ? false : (selfhandStatus == -1);
                    if (that.canTouchPai) {
                        that.checkPaiRule();
                    } else {
                        $('ops').setVisible(false);
                    }

                    if(gameData.players && liangpaiNum == gameData.players.length){
                        //无人亮牌 消息不处理
                        return;
                    }
                    if (gameData.players && finishNum == gameData.players.length) {
                        for (var i = 0; i < data.Users.length; i++) {
                            var jsData = data.Users[i];
                            if (that.zhuangUid && jsData.UserID == that.zhuangUid) {
                                if(gameData.players && gameData.players.length > 0){
                                    var p = gameData.getPlayerInfoByUid(that.zhuangUid);
                                    if(p){
                                        p.niuResult = jsData.NiuResult;
                                        p.niuRatio = jsData.NiuRatio;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    var p = null;
                    if(position2playerArrIdx && position2playerArrIdx[1] >= 0 && gameData.players[position2playerArrIdx[1]]){
                        p = gameData.players[position2playerArrIdx[1]];
                    }
                    var selfhandStatus = -1;
                    if(p)  selfhandStatus = p.handStatus;
                    if (needShowNow && gameData.isSelfWatching == false) {
                        network.start();
                    } else if (gameData.isSelfWatching ? false : (selfhandStatus == -1)) {
                        network.start();
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
                    console.log("that.zhuangUid=="+that.zhuangUid);
                    //最后显示庄  人满 庄不是自己 庄不是最后一个选的
                    if (finishNum == gameData.players.length && that.zhuangUid && that.zhuangUid != gameData.uid) {
                        var p = null;
                        if(gameData.players && gameData.players.length > 0){
                            p = gameData.getPlayerInfoByUid(that.zhuangUid);
                        }
                        that.showPaiResult(p, that.zhuangUid, true);
                    }

                    //亮牌了，干掉搓牌中
                    var pos = 1;
                    if (uid2position[curShowNiuAniUserID]) {
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

                $('btn_Ready').setVisible(false);
                that.hideTipMsg();
                that.setQiangZhuangBtnsVisible(false);
                that.hideAndResetPourBtn();

                var paiArr = data.Cards;
                if (paiArr.length == 0) {
                    return;
                }
                var fapaiLun = 1;//选了Preview 第一轮发四张  第二轮发一张 标记第几轮
                var showPaiArr = [];
                var showPaiArr2 = [0, 0, 0, 0, 0];
                var newFaPaiNum = 0;
                that.cuoPaiData = {};
                if(isReconnect){
                    showPaiArr = paiArr;
                }else {
                    if (mRoom.Preview == "san") {
                        if (mRoom.Cuopai) {
                            that.cuoPaiData = {
                                typ: 1,
                                topData: [paiArr[0], paiArr[1], paiArr[2]],
                                cuoData: [paiArr[3], paiArr[4]]
                            };
                        }else{
                            showPaiArr2 = [0, 0, 0, paiArr[3], paiArr[4]];
                        }
                        showPaiArr = [paiArr[0], paiArr[1], paiArr[2]];

                        fapaiLun = (paiArr.length == 5) ? 2 : 1;
                        if (fapaiLun == 2) {
                            newFaPaiNum = 2;
                        }
                    } else if (mRoom.Preview == "si") {
                        if (mRoom.Cuopai) {
                            that.cuoPaiData = {
                                typ: 2,
                                topData: [paiArr[0], paiArr[1], paiArr[2], paiArr[3]],
                                cuoData: [paiArr[4]]
                            };
                        }else{
                            showPaiArr2 = [0, 0, 0, 0, paiArr[4]];
                        }
                        showPaiArr = [paiArr[0], paiArr[1], paiArr[2], paiArr[3]];

                        fapaiLun = (paiArr.length == 5) ? 2 : 1;
                        if (fapaiLun == 2) {
                            newFaPaiNum = 1;
                        }
                    } else {
                        if (mRoom.Cuopai) {
                            that.cuoPaiData = {typ: 1, topData: null, cuoData: paiArr};
                        }
                        showPaiArr = paiArr;
                    }
                }

                for (var j = 0; j < paiArr.length; j++) {
                    var pai = that.getPai(1, j);
                    that.setPaiHua(pai, paiArr[j]);
                }

                if(fapaiLun == 1) {
                    that.faAllPai(!isReconnect, showPaiArr);
                }else{
                    if(isReconnect){
                        that.faAllPai(!isReconnect, showPaiArr);
                    }else {
                        if (showPaiArr2 && showPaiArr2.length > 0) {
                            if($('playerLayer.cardbackLayer')){
                                $('playerLayer.cardbackLayer').setVisible(true);
                                $('playerLayer.cardbackLayer').removeAllChildren();
                            }

                            for (var i = 1; i <= playerNum; i++) {
                                (i == 1) ? that.fapai(showPaiArr2, newFaPaiNum) : that.faSiglePai(i);
                            }
                        }
                    }
                }
            });
            //109 开始游戏，进入投注状态，玩家开始投注
            network.addListener(P.GS_GameStart, function (data) {
                if($('playerLayer.cardbackLayer')){
                    $('playerLayer.cardbackLayer').removeAllChildren();
                }

                //清理分数
                for (var i = 1; i <= max_player_num; i++) {
                    if ($("playerLayer.node.info" + i) && $("playerLayer.node.info" + i + ".change_sroce_node")) {
                        $("playerLayer.node.info" + i + ".change_sroce_node").removeAllChildren();
                    }
                }

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
                isReconnect = (data.Chonglian == 'yes');//是不是断线重连

                for (var i = 0; i < data.Score.length; i++) {
                    var jsData = data.Score[i];
                    var uid = jsData.UserID;
                    if(gameData.players && gameData.players.length > 0){
                        var p = gameData.getUserInfo(uid);
                        if(p){
                            p.score = jsData.Score;
                            p.chipIn = jsData.ChipIn;
                        }
                    }

                    if (jsData.ChipIn > 0) {
                        $('playerLayer.node.info' + uid2position[uid] + '.chipin').setVisible(true);
                        //$('playerLayer.node.info' + uid2position[uid] + '.chipin').setTexture('res/image/ui/niuniu/button/bt_bet_' + jsData.ChipIn + '.png');
                        $('playerLayer.node.info' + uid2position[uid] + '.chipin' + '.num').setString(jsData.Chip ? jsData.Chip : '');
                    } else {
                        $('playerLayer.node.info' + uid2position[uid] + '.chipin').setVisible(false);
                    }
                }
                that.setRoomState(ROOM_STATE_CREATED);
                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame();
                that.downAllPaiImmediately();

                that.setInviteBtn(false);

                if((gameData.isSelfWatching || gameData.isSitNotPlay)) {
                    var cards = [0, 0, 0, 0, 0];
                    if(mRoom.Preview == 'si')  cards = [0, 0, 0, 0];
                    if(mRoom.Preview == 'san')  cards = [0, 0, 0];
                    that.faAllPai(!isReconnect, cards);
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
                isReconnect = false;
                if($('playerLayer.cardbackLayer')){
                    $('playerLayer.cardbackLayer').removeAllChildren();
                }
                that.jiesuan(data);
            });
            //207 GS_Sitdown
            network.addListener(P.GS_Sitdown, function (data) {
                // if(data.Result == 0){
                //     $("playerLayer.node.info1").setVisible(true);
                //     $("playerLayer.node.info1.lb_nickname").setString(ellipsisStr(gameData["nickname"], 5));
                //     $("playerLayer.node.info1.lb_score").setString(0);
                //     $("playerLayer.node.info1.ok").setVisible(true);
                //     if (gameData["headimgurl"] == undefined || gameData["headimgurl"] == null || gameData["headimgurl"] == "") {
                //         gameData["headimgurl"] = res.defaultHead;
                //     }
                //     loadImageToSprite(gameData["headimgurl"], $("playerLayer.node.info1.head._head"), true);
                // }
                if (data.Result != 0) {
                    HUD.showMessage(data.Reason);
                }
            });
            //202 ready
            network.addListener(P.GS_ReadyNotify, function (data) {
                var hasNoReadyPlayers = false;

                if (data.Users && data.Users.length == 0) {
                    return;
                }
                for (var i = 0; i < data.Users.length; i++) {
                    var jsData = data.Users[i];
                    var uid = jsData.UserID;
                    var isReady = jsData.Status == 1;
                    if(gameData.players && gameData.players.length > 0){
                        var p = gameData.getUserInfo(uid);
                        if(p){
                            p.ready = isReady;
                        }
                    }
                    if (isReady) {
                        that.setReady(uid);
                    } else {
                        hasNoReadyPlayers = true;
                    }
                }
                var isready = false;
                if(position2playerArrIdx && position2playerArrIdx[1] >= 0 && gameData.players[position2playerArrIdx[1]]){
                    isready = gameData.players[position2playerArrIdx[1]].ready;
                }
                if ((gameData.isSelfWatching ? true : isready) && hasNoReadyPlayers && that.getRoomState() == ROOM_STATE_ONGOING) {
                    //that.showWaiting(TEXTURE_READY);
                    that.showWaiting('等待玩家准备');
                } else {
                    //that.hideWaiting(TEXTURE_READY);
                    that.hideWaiting('等待玩家准备');
                }
            });
            //209 GS_Replace_MSG 换牌  Status -1:可以换牌，1+:换了几张牌 0：放弃换牌
            network.addListener(P.GS_Replace, function(data){
                // var UserID = data['UserID'];//谁换了牌
                // that.selfReplaceStatus = -1;
                // for(var i=0;i<data['Users'].length;i++){
                //     if(data['Users'][i]['UserID'] == gameData.uid){
                //         that.selfReplaceStatus = data['Users'][i]['Status'];
                //         break;
                //     }
                // }
                //
                // $('btn_huanpai').setVisible(that.selfReplaceStatus == -1);
                // $('btn_buhuanpai').setVisible(that.selfReplaceStatus == -1);
                // if(that.selfReplaceStatus == -1) $('btn_Ready').setVisible(false);
            });
            network.addListener(3007, function (data) {

            });

            $('btn_buqiangzhuang').setVisible(false);
            $('btn_qiangzhuang').setVisible(false);

            network.addListener(3013, function (data) {
                gameData.numOfCards = data['numof_cards'];
            });
            network.addListener(3005, function (data, errorCode) {
            });

            $('btn_Ready').setVisible(false);

            that.setQiangZhuangBtnsVisible(false);
            TouchUtils.setOnclickListener($('btn_buqiangzhuang'), function () {
                that.showTipMsg("qiangzhuangend")
                network.wsData([
                    'Qiangzhuang',
                    "-2"
                ].join('/'));
            }, {effect: TouchUtils.effects.ZOOM});
            TouchUtils.setOnclickListener($('btn_qiangzhuang'), function () {
                that.showTipMsg("qiangzhuangend")
                playEffect("jiazhu", gameData.sex);
                network.wsData([
                    'Qiangzhuang',
                    "1"
                ].join('/'));
            }, {effect: TouchUtils.effects.ZOOM});
            for (var s = 0; s < btnQiangZhuangArr.length; s++) {
                (function (s) {
                    TouchUtils.setOnclickListener($('btn_qiangzhuang' + btnQiangZhuangArr[s]), function () {
                        that.showTipMsg("qiangzhuangend")
                        playEffect("jiazhu", gameData.sex);
                        network.wsData([
                            'Qiangzhuang',
                            btnQiangZhuangArr[s]
                        ].join('/'));
                    },  {effect: TouchUtils.effects.ZOOM});
                })(s)
            }
            //203 抢庄
            network.addListener(P.GS_Qiangzuang, function (data) {
                //牌背
                $('btn_Ready').setVisible(false);
                //$('Tip').setVisible(false);
                that.hideAndResetPourBtn();
                //抢庄  Qiangzhuang/1 抢  Qiangzhuang/-2 不抢
                var Status = -1;//-1 未操作
                var finishQiangNum = 0;
                // var isInQiangzhuang = false;

                if (mRoom.ZhuangMode == "Qiang") {
                    for (var i = 1; i <= max_player_num; i++) {
                        $('playerLayer.node.info' + i + '.chipin').setVisible(false);
                    }
                }

                for (var i = 0; i < data['Users'].length; i++) {
                    if (data['Users'][i]['UserID'] == gameData.uid) {
                        Status = data['Users'][i]['Status'];
                    }
                    if (data["Users"][i]["Status"] != -1) {
                        finishQiangNum++;
                        if (that.qiangZhuangData == null) {
                            that.qiangZhuangData = [];
                        }
                        if (that.qiangZhuangData.indexOf(data["Users"][i]["UserID"]) < 0)
                            that.flyJiaoFen(data['Users'][i]['Status'], uid2position[data["Users"][i]["UserID"]]);//叫分动画
                        that.qiangZhuangData.push(data['Users'][i]['UserID'])
                    }
                }
                if (finishQiangNum == gameData.players.length && data.Banker) {
                    if (data.Banker) {
                        that.zhuangUid = data.Banker;
                    }
                    //叫分中间叫分最大且一样的人，抢庄光圈动画
                    var MaxJiaofen = -100;//-2是不叫
                    var jiaoUsers = [];
                    for (var i = 0; i < data.Users.length; i++) {
                        if (MaxJiaofen <= data.Users[i]['Status']) {
                            MaxJiaofen = data.Users[i]['Status'];
                        }
                    }
                    for (var i = 0; i < data.Users.length; i++) {
                        if (MaxJiaofen <= data.Users[i]['Status']) {
                            jiaoUsers.push(data.Users[i]['UserID']);
                        }
                    }

                    network.stop();
                    that.scheduleOnce(function () {
                        for (var i = 1; i <= playerNum; i++) {
                            var row = i;
                            if (gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                                row = row + 1;
                            }
                            var jiaofen = $("playerLayer.node.info" + row + ".jiaofen");
                            var jiaofenSprite = jiaofen.getChildByName("jiaofenSprite");
                            if (jiaofenSprite) {
                                jiaofenSprite.setVisible(false);
                            }
                        }
                        that.playQiangzhuangAnim(jiaoUsers, data.Banker, data.Ratio);
                    }, (isReconnect ? 0:0.5));
                }
                if (Status == -1 && data['Users'] && data['Users'].length >= 2) {//未操作
                    if (mRoom.Preview && mRoom.Preview.length > 0) {
                        $('btn_buqiangzhuang').setVisible(true);
                        // Filter.remove($('btn_buqiangzhuang'));
                        that.showTipMsg("qiangzhuang");
                        $('btn_qiangzhuang').setVisible(false);
                        $('btn_buqiangzhuang').setPositionX(340);

                        var spacing = 140;
                        var len = 1;
                        for (var i = 0; i < btnQiangZhuangArr.length; i++) {
                            if (btnQiangZhuangArr[i] <= mRoom.BeiShu) len++;
                        }
                        var offestX = 1280/2 - (spacing * (len - 1)) / 2;
                        $('btn_buqiangzhuang').x = offestX;

                        for (var i = 0; i < btnQiangZhuangArr.length; i++) {
                            var btnName = btnQiangZhuangArr[i];
                            if (btnName <= mRoom.BeiShu) {
                                $('btn_qiangzhuang' + btnName).setVisible(true);
                                // Filter.remove($('btn_qiangzhuang' + btnName));
                                $('btn_qiangzhuang' + btnName).x = offestX + spacing * (i + 1);
                            } else {
                                $('btn_qiangzhuang' + btnName).setVisible(false);
                            }
                        }
                    } else {
                        //明牌抢庄
                        that.setQiangZhuangBtnsVisible(false);

                        $('btn_buqiangzhuang').setVisible(true);
                        $('btn_qiangzhuang').setVisible(true);
                        $('btn_buqiangzhuang').setPositionX(1280 / 2 - 80);
                        $('btn_qiangzhuang').setPositionX(1280 / 2 + 80);
                    }
                }
                if (Status != -1) {
                    that.setQiangZhuangBtnsVisible(false);
                }
                if (gameData.isSelfWatching) {
                    that.setQiangZhuangBtnsVisible(false);
                }
            });
            //204 预览
            network.addListener(P.GS_Preview, function (data) {
                var Cards = data.Cards;
                if(Cards && Cards.length > 0)  that.faAllPai(!isReconnect, Cards);
            });

            this.schedule(this.onTimer, 1);
            // 倒计时
            network.addListener(P.GS_AutoAction, function (data) {
                //确定倒计时时间
                leftTime = data.Second;
                leftTime--;

                //根据倒计时发生的状态更新显示Tip的内容
                if (data.AutoAction == 1) { //可以抢庄
                    //开始抢庄  不能换牌
                    $('btn_huanpai').setVisible(false);
                    $('btn_buhuanpai').setVisible(false);
                    // that.selfReplaceStatus = 0;

                    that.showTipMsg("qiangzhuang")
                } else if (data.AutoAction == 2) { //可以下注
                    that.showTipMsg("xiazhuxian")
                    if (gameData.uid == data.Banker) { //庄家 是我
                        that.showTipMsg("xiazhuzhuang")
                    }
                } else if (data.AutoAction == 3) { //可以亮牌
                    that.showTipMsg("liangpai");

                    //搓牌
                    if (mRoom.Cuopai && mRoom.Preview && mRoom.Preview.length > 0) {
                        if (gameData.isSelfWatching == false && gameData.isSitNotPlay == false) {
                            that.canCuopai = true;
                            $('ops.hint').setVisible(true);
                            $('ops.cuopai').setVisible(true);
                            for (var i = 0; i < gameData.players.length; i++) {
                                var k = i + 1;
                                if (gameData.isSelfWatching && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                                    k = k + 1;
                                }
                                that.cuoPaiZhongAni(k, true);
                            }
                        }
                    } else {
                        $('ops.hint').setVisible(true);
                        // Filter.remove($('ops.hint'));
                    }
                } else if (data.AutoAction == 4) { //等待新局
                    that.showTipMsg("dengdaikaishi")
                } else if (data.AutoAction == 5){
                    that.showTipMsg("replacecard");
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

            network.start();

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
            if (!mRoom.Is_ztjr) {
                // $('btn_sitdown').setVisible(false);
                $('tip_pangguan').setVisible(false);
                $('tip_waitnext').setVisible(false);
            }

            this.getVersion();

            TouchUtils.setOnclickListener($('btn_control_btns'), function () {
                that.changeBtnStatus();
            });

            TouchUtils.setOnclickListener($('Panel_1'), function () {
                if (!cc.sys.isNative) {
                    // var msg = JSON.stringify({roomid: mRoom.roomId, type:'text', content:"testing", from:gameData.uid});
                    // network.wsData("Say/" + msg);
                }
                that.hideControlBtns();
            }, {sound: "no"});
            TouchUtils.setOnclickListener($('btn_wanfa'), function () {
                cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
                    var data = gameData.Option;
                    var wanfaLayer = new NiuniuWanfaLayer(data);
                    cc.director.getRunningScene().addChild(wanfaLayer, 1000);
                });
            });


            TouchUtils.setOnclickListener($('PanelPour.btn_xjxz_1'), function () {
                $('PanelPour').setVisible(false);
                that.showTipMsg("xiazhuxianend");
                //console.log('玩家下注:'+$('PanelPour.btn_xjxz_1').getChildByName('num').getString());
                playEffect("jiazhu", gameData.sex);
                var value = $('PanelPour.btn_xjxz_1').getChildByName('num2').getString();
                network.wsData([
                    'ChipIn',
                    value
                ].join('/'));
                that.hideAndResetPourBtn();
            },  {effect: TouchUtils.effects.ZOOM});

            TouchUtils.setOnclickListener($('PanelPour.btn_xjxz_2'), function () {
                $('PanelPour').setVisible(false);
                that.showTipMsg("xiazhuxianend");
                //console.log('玩家下注:'+$('PanelPour.btn_xjxz_2').getChildByName('num').getString());
                playEffect("jiazhu", gameData.sex);
                var value = $('PanelPour.btn_xjxz_2').getChildByName('num2').getString()
                network.wsData([
                    'ChipIn',
                    value
                ].join('/'));
                that.hideAndResetPourBtn();
            },  {effect: TouchUtils.effects.ZOOM});

            TouchUtils.setOnclickListener($('PanelPour.btn_xjxz_3'), function () {
                $('PanelPour').setVisible(false);
                that.showTipMsg("xiazhuxianend");
                //console.log('玩家下注:'+$('PanelPour.btn_xjxz_3').getChildByName('num').getString());
                playEffect("jiazhu", gameData.sex);
                var value = $('PanelPour.btn_xjxz_3').getChildByName('num2').getString();
                network.wsData([
                    'ChipIn',
                    value
                ].join('/'));
                that.hideAndResetPourBtn();
            }, {effect: TouchUtils.effects.ZOOM});

            TouchUtils.setOnclickListener($('PanelPour.btn_xjxz_4'), function () {
                $('PanelPour').setVisible(false);
                that.showTipMsg("xiazhuxianend");
                //console.log('玩家下注:'+$('PanelPour.btn_xjxz_4').getChildByName('num').getString());
                playEffect("jiazhu", gameData.sex);
                var value = $('PanelPour.btn_xjxz_4').getChildByName('num2').getString();
                network.wsData([
                    'ChipIn',
                    value
                ].join('/'));
                that.hideAndResetPourBtn();
            }, that.pourMultiple || {});
            TouchUtils.setOnclickListener($('PanelPour.btn_xjxz_5'), function () {
                $('PanelPour').setVisible(false);
                that.showTipMsg("xiazhuxianend");
                //console.log('玩家下注:'+$('PanelPour.btn_xjxz_4').getChildByName('num').getString());
                playEffect("jiazhu", gameData.sex);
                var value = $('PanelPour.btn_xjxz_5').getChildByName('num2').getString();
                network.wsData([
                    'ChipIn',
                    value
                ].join('/'));
                that.hideAndResetPourBtn();
            },  {effect: TouchUtils.effects.ZOOM});


            $('PanelPour').setVisible(false);

            DC.start();

            //切home
            // network.addCustomListener("game_on_hide", this.Game_On_Hide.bind(this));
            // network.addCustomListener("game_on_show", this.Game_On_Show.bind(this));


            // var cuoLayer = new CuoPaiLayer();
            // this.addChild(cuoLayer);
            // mRoom.Cuopai = false;

            this.canCuopai = false;

            //
            MWUtil.clearRoomId();

        },
        // Game_On_Hide: function(){
        //
        // },
        // Game_On_Show: function(){
        //
        // },
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
                        data.scene = 'nn';
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
        getChipImg: function (chip) {
            var n = 6;
            if (chip == 2) n = 6;
            if (chip == 3 || chip == 4) n = 6;
            if (chip >= 5 && chip <= 8) n = 6;
            if (chip >= 9) n = 6;

            return n;
        },
        //搓牌的翻牌
        showHandCard: function (flag, cardArr, cancel) {
            // var paiMidPos = this.getPai(1, 2).getPosition();
            // var moveIndex = 0;
            // if(mRoom.Preview == 'si'){
            //     moveIndex = 4;
            //     paiMidPos = this.getPai(1, 4).getPosition();
            // }else if(mRoom.Preview == 'san'){
            //     moveIndex = 3;
            //     paiMidPos = cc.p(this.getPai(1, 3).getPositionX() + posConf.paiADistance[1]/2, this.getPai(1, 3).getPositionY());
            // }

            if (cancel) {//取消了
                this.canCuopai = true;
                $('ops.hint').setVisible(true);
                $('ops.cuopai').setVisible(true);
            } else {
                if (flag) {
                    this.canCuopai = false;
                    $('ops.hint').setVisible(true);
                    // Filter.remove($('ops.hint'));
                    TouchUtils.setClickDisable($('ops.hint'), false);
                    $('ops.cuopai').setVisible(false);
                } else {
                    $('ops.hint').setVisible(false);
                    $('ops.cuopai').setVisible(false);
                }
            }
            if (flag) {
                for (var i = 0; i < initPaiNum; i++) {
                    var pai = this.getPai(1, i);
                    this.setPaiHua(pai, cardArr[i]);
                    var userData = pai.getUserData();
                    userData.pai = cardArr[i];

                    this.hidePaiBack(pai);
                    if(mRoom.Preview == 'si' && i == 4){
                        this.setFiveCard(pai, true);
                    }
                }
            }
        },
        initLoadShowState: function () {
            $('lb_wanfa').setVisible(false);
            $('top_tip').setVisible(false);

            for (var i = 1; i <= max_player_num; ++i) {
                $('playerLayer.node.info' + i + ".offline").setVisible(false);
                $('playerLayer.node.info' + i + ".chipin").setVisible(false);
                $('playerLayer.node.info' + i + ".shenfen").setVisible(false);
                $('playerLayer.node.info' + i + ".ok").setVisible(false);
            }
        },

        hideAndResetPourBtn: function () {
            $('PanelPour').setVisible(false);
            var btn1 = $('PanelPour.btn_xjxz_1');
            var btn2 = $('PanelPour.btn_xjxz_2');
            var btn3 = $('PanelPour.btn_xjxz_3');
            var btn4 = $('PanelPour.btn_xjxz_4');
            btn1.setPositionX(1280 / 2 - DISTANCE);
            btn2.setPositionX(1280 / 2);
            btn3.setPositionX(1280 / 2 + DISTANCE);
            btn4.setPositionX(1280 / 2 + DISTANCE * 2);
        },

        setBtnImage: function (btn, count) {
            if (count == 1) btn.setTexture(res.b_g_png);
            if (count == 2) btn.setTexture(res.b_b_png);
            if (count == 3 || count == 4) btn.setTexture(res.b_p_png);
            if (count >= 5 && count <= 8) btn.setTexture(res.b_r_png);
            if (count >= 9) btn.setTexture(res.b_bk_png);
        },
        setPourBtn: function (data, uid, uid2, Disable) {
            //if(uid!=uid2)return;
            Disable = Disable || [];

            // data = [1,2,3,40];
            // Disable = [2,40];

            var btn1 = $('PanelPour.btn_xjxz_1');
            var btn2 = $('PanelPour.btn_xjxz_2');
            var btn3 = $('PanelPour.btn_xjxz_3');
            var btn4 = $('PanelPour.btn_xjxz_4');
            var btn5 = $('PanelPour.btn_xjxz_5');
            Filter.remove(btn1);
            Filter.remove(btn2);
            Filter.remove(btn3);
            Filter.remove(btn4);
            Filter.remove(btn5);
            $('PanelPour').setVisible(true);
            this.showTipMsg("xiazhuxian");

            for (var i = 0; i < data.length; i++) {
                var btn = $('PanelPour.btn_xjxz_' + (i + 1));
                if(btn) {
                    TouchUtils.setClickDisable(btn, false);
                    btn.setVisible(true);
                    btn.getChildByName('num2').setString(data[i]);
                    btn.setPosition(cc.p(1280 / 2 + (i - data.length / 2 + 1 / 2) * DISTANCE, 0));

                    if (Disable && Disable.indexOf(data[i]) >= 0) {
                        Filter.grayScale(btn);
                        TouchUtils.setClickDisable(btn, true);
                    }
                }
            }
            for (i; i < 5; i++) {
                $('PanelPour.btn_xjxz_' + (i + 1)).setVisible(false);
            }
        },

        setPanel3: function (data) {
            if (data == undefined) {
                return;
            }
            $('panel_3').setVisible(true);
            var zhuangs = getZhuangMode(data);
            $('panel_3.Text_1_value').setString(zhuangs);
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
        resetControllBtnsPos: function(){
            var posx = cc.winSize.width/2 - 1280/2;
            $('btn_bg').setPositionX($('btn_bg').getPositionX() + posx);
            $('setting').setPositionX($('setting').getPositionX() + posx + (cc.winSize.width >= 1560 ?-50:0));
            $('btn_fanhui').setPositionX($('btn_fanhui').getPositionX() + posx + (cc.winSize.width >= 1560 ?-50:0));
            $('btn_jiesan').setPositionX($('btn_jiesan').getPositionX() + posx + (cc.winSize.width >= 1560 ?-50:0));
            $('btn_lasthuigu').setPositionX($('btn_lasthuigu').getPositionX() + posx + (cc.winSize.width >= 1560 ?-50:0));
            $('btn_control_btns').setPositionX($('btn_control_btns').getPositionX() + posx + (cc.winSize.width >= 1560 ?-50:0));
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
            if (gameData.currentRound > 1) {
                TouchUtils.setClickDisable($('btn_lasthuigu'), false);
                $('btn_lasthuigu').setOpacity(255);
            } else {
                $('btn_lasthuigu').setOpacity(50);
                TouchUtils.setClickDisable($('btn_lasthuigu'), true);
            }
            if (mRoom.ZhuangMode == "Tongbi") $('btn_lasthuigu').setVisible(false);
            $('btn_control_btns').setFlippedY(!$('btn_control_btns').isFlippedY());


            // 自己就是房主
            if (gameData.ownerUid == gameData.uid && gameData.isSelfWatching == false) {
                $('btn_jiesan').setOpacity(225);
                TouchUtils.setClickDisable($('btn_jiesan'), false);
                $('btn_fanhui').setOpacity(50);
                TouchUtils.setClickDisable($('btn_fanhui'), true);
            } else {
                if (gameData.isSelfWatching && gameData.isSitNotPlay == false) {
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(255);
                    TouchUtils.setClickDisable($('btn_fanhui'), false);
                } else if (gameData.isSelfWatching && gameData.isSitNotPlay) {
                    //既不能解散 也不能退出
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_fanhui'), true);
                }
            }
        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if(subArr)  sub = subArr['niuniu'];

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

            if (this.list2103) cc.eventManager.removeListener(this.list2103);
            if (this.list1) cc.eventManager.removeListener(this.list1);
            if (this.list2) cc.eventManager.removeListener(this.list2);

            AgoraUtil.closeVideo();
            // cc.Layer.prototype.onExit.call(this);
        },
        showChangeScore: function (row, score) {
            if (!score) {
                return;
            }
            var txt = new cc.LabelBMFont(score > 0 ? "+" + score : score, score < 0 ? res.score_blue_fnt : res.score_yellow_fnt);
            if (max_player_num == 9) txt.setScale(1.5);
            var change_sroce_node = $("playerLayer.node.info" + row + ".change_sroce_node");
            change_sroce_node.addChild(txt);
            txt.runAction(
                cc.sequence(
                    cc.moveBy(2, cc.p(0, 30)),
                    cc.delayTime(1)
                )
            );
        },
        onPlayerEnterExit: function (curPlayerIndex) {
            var that = this;
            var players = gameData.players || [];
            var watchingplayers = gameData.WatchingUsers || [];
            // console.log(players);
            // console.log(watchingplayers);

            if (players.length > 1) {
                $("btn_start").setVisible(gameData.uid == gameData.ownerUid &&
                    players.length > 1 &&
                    gameData.currentRound <= 1 && this.getRoomState() == ROOM_STATE_CREATED);
            }
            else
                $("btn_start").setVisible(false);

            //邀请俱乐部成员
            if (this.getRoomState() == ROOM_STATE_ONGOING || gameData.currentRound > 1) {
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

            gameData.isSelfWatching = true;
            gameData.isSitNotPlay = false;//坐下未开始
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
            var sitDownWatchNumTmp = 0;
            if (mRoom.Is_ztjr) {
                for (var i = 0; i < watchingplayers.length; i++) {
                    var player = watchingplayers[i];
                    if(player['User']['Watching'] && player['User']['Sitdowning'])  sitDownWatchNumTmp++;
                    if (player.UserID == gameData.uid) {
                        if (player['User']['Watching'] && !player['User']['Sitdowning']) {
                            gameData.isSelfWatching = true;
                            gameData.isSitNotPlay = false;
                        } else if (player['User']['Watching'] && player['User']['Sitdowning']) {
                            gameData.isSelfWatching = true;
                            gameData.isSitNotPlay = true;
                        }
                    }
                }
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    player.ready = true;
                    if (player.UserID == gameData.uid) {
                        gameData.isSelfWatching = false;
                        gameData.isSitNotPlay = false;
                        // break;
                    }
                }
                if (gameData.leftRound + 1 < gameData.totalRound) {
                    playerNum = players.length;
                }
                that.curPlayerIndex = players.length + sitDownWatchNumTmp;
                //观战里面 Sitdowning = 1  Watching = 1 画头像
                for (var i = 0; i < watchingplayers.length; i++) {
                    var player = watchingplayers[i];
                    if (player['User']['Watching'] && player['User']['Sitdowning']) {
                        if (gameData.uid == player['UserID']) {
                            $("playerLayer.node.info1").setVisible(true);
                            $("playerLayer.node.info1").uid = gameData.uid;
                            $("playerLayer.node.info1.lb_nickname").setString(ellipsisStr(gameData["nickname"], 5));
                            $("playerLayer.node.info1.lb_score").setString(0);
                            $("playerLayer.node.info1.ok").setVisible(true);
                            if (gameData["headimgurl"] == undefined || gameData["headimgurl"] == null || gameData["headimgurl"] == "") {
                                gameData["headimgurl"] = res.defaultHead;
                            }
                            loadImageToSprite(gameData["headimgurl"], $("playerLayer.node.info1.head._head"), true);
                        } else {
                            this.sitDownWatchNum++;

                            //观看者  未坐下 人满了
                            // var pindex = (gameData.isSelfWatching == false) ? (players.length + this.sitDownWatchNum) : (players.length + this.sitDownWatchNum + 1);
                            var pindex = players.length + this.sitDownWatchNum;
                            if(gameData.isSelfWatching){
                                if(gameData.isSitNotPlay == false && (sitDownWatchNumTmp + players.length >= max_player_num)){
                                }else{
                                    pindex = pindex + 1;
                                }
                            }
                            if (pindex > max_player_num) pindex = pindex % max_player_num;
                            // console.log(players.length + this.sitDownWatchNum);
                            // console.log(sitDownWatchNumTmp);
                            if (pindex > 0 && $("playerLayer.node.info" + pindex) && player && player['UserID'] && player['User']) {
                                // console.log(pindex);
                                // console.log(player);
                                $("playerLayer.node.info" + pindex).uid = player['UserID'];
                                $("playerLayer.node.info" + pindex).setVisible(true);
                                $("playerLayer.node.info" + pindex + ".lb_nickname").setString(ellipsisStr(player['User']["NickName"], 5));
                                $("playerLayer.node.info" + pindex + ".lb_score").setString(0);
                                $("playerLayer.node.info" + pindex + ".ok").setVisible(false);
                                if (player['User']["HeadIMGURL"] == undefined || player['User']["HeadIMGURL"] == null || player['User']["HeadIMGURL"] == "") {
                                    player["headimgurl"] = res.defaultHead;
                                } else {
                                    player["headimgurl"] = player['User']["HeadIMGURL"];
                                }
                                loadImageToSprite(player["headimgurl"], $("playerLayer.node.info" + pindex + ".head._head"), true);
                            }
                        }
                    }
                }
                this.sitDownWatchNum = sitDownWatchNumTmp;
                // console.log(this.sitDownWatchNum);
                // console.log(gameData.isSelfWatching);
                // console.log(gameData.isSitNotPlay);
                //test
                $('btn_sitdown').setVisible(gameData.isSelfWatching && gameData.isSitNotPlay == false);
                $('tip_pangguan').setVisible(this.getRoomState() == ROOM_STATE_ONGOING && gameData.isSelfWatching && gameData.isSitNotPlay == false);
                $('tip_waitnext').setVisible(this.getRoomState() == ROOM_STATE_ONGOING && gameData.isSelfWatching && gameData.isSitNotPlay);
                $("btn_mic").setVisible(gameData.isSelfWatching == false && gameData.isSitNotPlay == false);
                $("chat").setVisible(gameData.isSelfWatching == false && gameData.isSitNotPlay == false);
                if (gameData.isSelfWatching && gameData.isSitNotPlay == false) {
                    $('btn_jiesan').setOpacity(50);
                    TouchUtils.setClickDisable($('btn_jiesan'), true);
                    $('btn_fanhui').setOpacity(255);
                    TouchUtils.setClickDisable($('btn_fanhui'), false);
                } else if (gameData.isSelfWatching && gameData.isSitNotPlay) {
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
                    && this.getRoomState() == ROOM_STATE_CREATED && gameData.currentRound <= 1);
                if (gameData.leftRound + 1 < gameData.totalRound) {
                    playerNum = players.length;
                }
            }

            if (mRoom.Is_ztjr) {
                //坐满了
                if (max_player_num == (players.length + this.sitDownWatchNum)) {
                    $('btn_sitdown').setVisible(false);
                }
                if (window.inReview) {
                    $("btn_mic").setVisible(false);
                    $("chat").setVisible(false);
                }
            } else {
                if (players.length == max_player_num) {
                    that.setRoomState(ROOM_STATE_CREATED);
                    that.setRoomState(ROOM_STATE_ONGOING);
                }
            }

            // console.log("max_player_num==="+max_player_num);
            // console.log(gameData.isSelfWatching);
            // console.log(gameData.isSitNotPlay);
            // console.log(this.sitDownWatchNum);
            for (var i = 0; i < max_player_num; i++) {
                var k = i + 1;
                if(gameData.isSelfWatching){
                    if(gameData.isSitNotPlay == false && max_player_num <= (players.length + this.sitDownWatchNum)){
                    }else{
                        k = k + 1;
                    }
                }
                // console.log("k===="+k);
                $("playerLayer.node.info1").setVisible(!(gameData.isSitNotPlay == false && gameData.isSelfWatching && max_player_num > (players.length + this.sitDownWatchNum)));
                if (players && players.length == 0) $("playerLayer.node.info1").setVisible(false);

                // console.log(i+"=="+k);
                if (i < players.length) {
                    var player = players[i];
                    // console.log(i);
                    // console.log(player);
                    if($("playerLayer.node.info" + k) && player && player.uid){
                        $("playerLayer.node.info" + k).uid = player.uid;
                        $("playerLayer.node.info" + k).setVisible(true);
                        $("playerLayer.node.info" + k + ".lb_nickname").setString(ellipsisStr(player["nickname"], 5));
                        $("playerLayer.node.info" + k + ".lb_score").setString((roomState == ROOM_STATE_CREATED) ? 0 : player["score"]);
                        if (roomState == ROOM_STATE_CREATED)
                            $("playerLayer.node.info" + k + ".ok").setVisible(!!player["ready"]);
                        if (player["headimgurl"] == undefined || player["headimgurl"] == null || player["headimgurl"] == "") {
                            player["headimgurl"] = res.defaultHead;
                        }
                        loadImageToSprite(player["headimgurl"], $("playerLayer.node.info" + k + ".head._head"), true);

                        uid2position[player.uid] = k;
                        position2uid[k] = player.uid;
                        position2sex[k] = player.sex;
                        position2playerArrIdx[k] = i;
                    }
                } else {
                    if (mRoom.Is_ztjr) {
                        if(i < (players.length + this.sitDownWatchNum
                            + ((gameData.isSelfWatching && gameData.isSitNotPlay) ? -1 : 0))){
                        }else{
                            if ($("playerLayer.node.info" + k)) $("playerLayer.node.info" + k).setVisible(false);
                        }
                    } else {
                        if ($("playerLayer.node.info" + k)) $("playerLayer.node.info" + k).setVisible(false);
                    }
                }
            }

            this.setInviteBtn();

            //如果差一个人满员  惯着看看到的人  位置会变化  清理手牌
            if(gameData.isSelfWatching && gameData.isSitNotPlay == false &&
                (curPlayerIndex > 0 && (curPlayerIndex+1) == max_player_num)){
                this.setInviteBtn(false);
                for (var j = 1; j <= max_player_num; j++) {
                    $('playerLayer.node.row' + j).setVisible(false);
                }
                for (var i = 0; i < players.length; i++) {
                    var uid = players[i].uid;
                    var row = uid2position[uid];
                    if(row > 0){
                        $('playerLayer.node.row' + row).setVisible(true);
                        for (var j = 0; j < initPaiNum; j++) {
                            var pai = this.getPai(1, j);
                            this.showPaiBack(pai);
                        }
                    }
                }
            }

            if (that.assistant) {
                if(typeof that.assistant.refreshPlayersStates == 'function')  that.assistant.refreshPlayersStates();
            }
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
                var header = $('playerLayer.node.info' + pos + '.head');
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
            if (max_player_num == 9) {
                arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
            for (var i = 0; i < arr.length; i++) {
                var row = arr[i];
                var a0 = $("playerLayer.node.row" + row + ".a0");

                var a1 = $("playerLayer.node.row" + row + ".a1");
                posConf.paiADistance[row] = a1.getPositionX() - a0.getPositionX();
                //记录下 a0 牌的出事位置
                posConf.paiStartPoint[row] = a0.getPositionX();
                if (row == 1) {
                    posConf.upPaiPositionY = a0.getPositionY() + UPPAI_Y;
                    posConf.downPaiPositionY = a0.getPositionY();

                    posConf.paiTouchRect = cc.rect(0, 0, posConf.paiADistance[1], a0.getContentSize().height);
                }

                var ltqp = $("playerLayer.node.info" + row + ".qp");
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
                        },
                        9: {
                            1: 80,
                            2: 90,
                            3: 84,
                            4: 84,
                            5: 84,
                            6: 100,
                            7: 100,
                            8: 100,
                            9: 100
                        }
                    }[max_player_num][row], posConf.ltqpRect[row].height);
                    ltqp.removeFromParent();
                }
            }
        },
        ctor: function (_data, _isReplay) {
            this._super();

            if (gameData.wanfaDesp == undefined || gameData.wanfaDesp == null || gameData.wanfaDesp == "") {
                if(mRoom.wanfa && mRoom.wanfa.length > 0)  gameData.wanfaDesp = mRoom.wanfa;
            }

            clearVars();

            data = _data;
            isReplay = !!_isReplay;

            network.stop();

            // loadCCSTo(res.NiuniuLayer_json, this, "Scene");
            if(typeof loadNodeCCS == 'function') {
                loadNodeCCS(res.NiuniuLayer_json, this, "Scene");
            }else{
                loadCCSTo(res.NiuniuLayer_json, this, "Scene");
            }

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
            if (val == -1) {
                return;
            }
            if (val == 0) {
                that.showPaiBack(pai);
                return;
            }
            var arr = getPaiNameByIdNN(val);
            var laizi = pai.getChildByName('laizi');
            if(!laizi) {
                laizi = new cc.Sprite('res/image/ui/niuniu/card/laizi.png');
                laizi.setAnchorPoint(cc.p(0, 1));
                laizi.setPosition(cc.p(-3, pai.getBoundingBox().height + 3));
                laizi.setName('laizi');
                pai.addChild(laizi);
            }
            laizi.setVisible(val == 55);
            //getUserData
            var userData = pai.getUserData();
            if (!userData)
                userData = {};
            userData.pai = val;

            //数字的
            setPokerFrameByNameNN(pai, arr);
            if(gameData.isSelfWatching){
                if(laizi)  laizi.setVisible(false);
            }

            //第五张牌特殊显示
            if(mRoom.Preview == 'si' && that.cuoPaiData && that.cuoPaiData.cuoData && that.cuoPaiData.cuoData[0] &&
                pai && pai.getUserData().pai == that.cuoPaiData.cuoData[0] &&
                pai.getParent() && pai.getParent().getName() == 'row1'){
                that.setFiveCard(pai, true);
            }
        },
        //第五张牌
        setFiveCard: function(pai, flag){
            var five = pai.getChildByName('five');
            if(!five) {
                five = new cc.Sprite('res/submodules/niuniu/image/NiuniuScene/card_jiaobiao.png');
                five.setAnchorPoint(cc.p(1, 1));
                five.setPosition(cc.p(pai.getBoundingBox().width*1, pai.getBoundingBox().height*1));
                five.setName('five');
                five.setScale(1.2);
                pai.addChild(five);
            }
            // console.log(five.getPosition());
            five.setVisible(flag);

            var a0 = $("playerLayer.node.row1.a0");
            pai.setPositionY(a0.getPositionY() + (flag ? 20 : 0));
        },
        //获得row位置上面的牌放置的推放方向：-1为向下堆放，1为向上堆放（实际上就是界面上面的牌堆放上下的情况）
        getPaiStackDir: function (row) {
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
            var nodeA0 = $("playerLayer.node.row" + row + ".a0");
            var nodeA1 = $("playerLayer.node.row" + row + ".a1");

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
                var node = $("playerLayer.node.row" + row + ".a" + id);
                if (!node) {
                    var a0 = $("playerLayer.node.row" + row + ".a0");
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
                paiBack.setTexture('res/submodules/niuniu/image/common/pai_back2.png');
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
                if (isOver) continue;
                arr.push(userData.pai);
            }
            return arr;
        },
        getRoomState: function () {
            return roomState;
        },
        setRoomState: function (state) {
            if(mRoom.wanfa && mRoom.wanfa.length > 0)  gameData.wanfaDesp = mRoom.wanfa;
            var that = this;
            var arr = decodeURIComponent(gameData.wanfaDesp).split(",");
            if (arr.length >= 1)
                arr = arr.slice(1);
            var wanfaStr = arr.join("\n");
            if (state == ROOM_STATE_CREATED) {
                this.hideControlBtns(false);
                $("signal").setVisible(false);
                // $("setting").setVisible(false);
                if (gameData.isSelfWatching) {
                    $("chat").setVisible(false);
                    $("btn_mic").setVisible(false);
                } else {
                    $("chat").setVisible(true);
                    $("btn_mic").setVisible(true);
                }
                if (window.inReview) $("chat").setVisible(false);
                $("timer2").setVisible(false);
                this.setControlBtn(state);
                gameData.isOpen = false;

                if (window.inReview) $("btn_mic").setVisible(false);
                $("lb_roomid").setString(gameData.roomId);
                $("lb_wanfa").setString(wanfaStr);
                $("lb_roomid").setVisible(true);
                $("playerLayer.node.row1").setVisible(false);
                $("playerLayer.node.row2").setVisible(false);
                $("playerLayer.node.row3").setVisible(false);
                $("playerLayer.node.row4").setVisible(false);
                $("playerLayer.node.row5").setVisible(false);
                $("playerLayer.node.row6").setVisible(false);
                $("playerLayer.node.row10").setVisible(false);
                if ($("playerLayer.node.row7")) {
                    $("playerLayer.node.row7").setVisible(false);
                    $("playerLayer.node.row8").setVisible(false);
                    $("playerLayer.node.row9").setVisible(false);
                }
                this.setChipInBtnsVisible(false);
                this.hideWaiting();
            } else if (state == ROOM_STATE_ONGOING) {
                // var setting = $("setting");
                // if (!setting || !cc.sys.isObjectValid(setting))
                //     return network.reconnect();
                //setting.setVisible(true);
                $("signal").setVisible(!isReplay);
                if (gameData.isSelfWatching) {
                    $("chat").setVisible(false);
                    $("btn_mic").setVisible(false);
                } else {
                    $("chat").setVisible(true);
                    $("btn_mic").setVisible(true);
                }
                if (window.inReview) $("chat").setVisible(false);

                $("timer2").setVisible(false);
                this.setControlBtn(state);

                gameData.isOpen = true;
                $("btn_mic").setVisible(!window.inReview);
                $("lb_roomid").setString(gameData.roomId || '');
                $("lb_wanfa").setString(wanfaStr || '');
                $("playerLayer.node.row1").setVisible(false);
                $("playerLayer.node.row2").setVisible(false);
                $("playerLayer.node.row3").setVisible(false);
                $("playerLayer.node.row4").setVisible(false);
                $("playerLayer.node.row5").setVisible(false);
                $("playerLayer.node.row6").setVisible(false);
                $("playerLayer.node.row10").setVisible(false);
                if ($("playerLayer.node.row7")) {
                    $("playerLayer.node.row7").setVisible(false);
                    $("playerLayer.node.row8").setVisible(false);
                    $("playerLayer.node.row9").setVisible(false);
                }

                // $("timer2.Text_5").setString(gameData.leftRound || '0');
                $('panel_3.Text_2_value').setString(gameData.currentRound + '/' + gameData.totalRound);

                for (var i = 1; i <= playerNum; i++)
                    $("playerLayer.node.info" + i + ".ok").setVisible(false);

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
        setInviteBtn: function (status) {
            var isShow = this.getRoomState();

            $("btn_invite").setVisible(isShow == ROOM_STATE_CREATED);
            $("btn_inviteXianLiao").setVisible(isShow == ROOM_STATE_CREATED);
            $("btn_inviteLiaobei").setVisible(isShow == ROOM_STATE_CREATED);
            $("btn_copy").setVisible(isShow == ROOM_STATE_CREATED);

            if(status == false || gameData.currentRound > 1){
                $("btn_invite").setVisible(false);
                $("btn_inviteXianLiao").setVisible(false);
                $("btn_inviteLiaobei").setVisible(false);
                $("btn_copy").setVisible(false);
            }
            if (window.inReview) {
                $("btn_invite").setVisible(false);
                $("btn_inviteXianLiao").setVisible(false);
                $("btn_inviteLiaobei").setVisible(false);
                $("btn_copy").setVisible(false);
            }
        },
        setControlBtn: function (state) {
            var that = this;
            //如果是代开房间直接显示离开按钮
            if (gameData.is_daikai == true && state == ROOM_STATE_CREATED) {
                $('btn_jiesan').setOpacity(50);
                TouchUtils.setClickDisable($('btn_jiesan'), true);
                $('btn_fanhui').setOpacity(255);
                TouchUtils.setClickDisable($('btn_fanhui'), false);
                return;
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
            //牌背
            if( $('playerLayer.cardbackLayer')){
                $('playerLayer.cardbackLayer').removeAllChildren();
            }
            //清理分数
            for (var i = 1; i <= max_player_num; i++) {
                if ($("playerLayer.node.info" + i) && $("playerLayer.node.info" + i + ".change_sroce_node")) {
                    $("playerLayer.node.info" + i + ".change_sroce_node").removeAllChildren();
                }
            }

            this.onPlayerEnterExit();
            $("ops").setVisible(false);

            //抢庄  需要把庄家去掉
            if (mRoom.ZhuangMode == "Qiang") this.changeZhuang(0);
            this.qiangZhuangData = null;


            var cleanAni = function (i) {
                //清楚 动画
                var sp = that.getNiuAnimSp(i);
                if (sp) {
                    var niuRatioSprite = sp.getChildByName("niuRatioSprite");
                    if (niuRatioSprite) {
                        var niuCheng = niuRatioSprite.getChildByName('niuCheng');
                        if (niuCheng) niuCheng.removeFromParent(true);
                    }
                    var niuResultSprite = sp.getChildByName("niuResultSprite");
                    if (niuResultSprite) {
                        var niuAction = niuResultSprite.getChildByName('niuAction');
                        if (niuAction) {
                            niuAction.removeFromParent(true);
                        }
                    }
                }

                for (var j = 0; j < initPaiNum; j++) {
                    var pai = that.getPai(i, j);
                    pai.setPositionY(0);
                    var fiveJiao = pai.getChildByName('five');
                    if(fiveJiao)  fiveJiao.setVisible(false);
                }
            }
            for (var i = 1; i <= max_player_num; i++) {
                var head = $("playerLayer.node.info" + i + ".head");
                cleanAni(i);
                var zhuangAni = head.getChildByName('zhuangAni');
                if (zhuangAni) zhuangAni.setVisible(false);

                that.huoYanAni(i, false);

                for (var j = 0; j < initPaiNum; j++) {
                    var pai = that.getPai(i, j);
                    pai.setPositionY(0);
                    var fiveJiao = pai.getChildByName('five');
                    if(fiveJiao)  fiveJiao.setVisible(false);
                }
            }
            cleanAni(10);
        },
        upPai: function (idx, showAjiaB) {
            if (idx < 0)
                return;
            var that = this;
            var pai = that.getPai(1, idx);
            var userData = pai.getUserData();
            if (userData.pai == 0) {
                return;
            }
            if (userData.isUp) {
                that.downPai(idx, showAjiaB);
            }
            else if (!userData.isUp && !userData.isUpping) {
                playEffect('fapai');
                userData.isUpping = true;
                pai.runAction(cc.sequence(
                    cc.moveTo(0.04, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                    , cc.callFunc(function () {
                        userData.isUp = true;
                        userData.isUpping = false;
                        if (showAjiaB) that.checkPaiRuleResult();
                    })
                ));
            }
            else if (userData.isUp && !userData.isDowning) {
                playEffect('fanpai');
                userData.isDowning = true;
                pai.runAction(cc.sequence(
                    cc.moveTo(0.04, pai.getPositionX(), (!userData.isUp ? posConf.upPaiPositionY : posConf.downPaiPositionY))
                    , cc.callFunc(function () {
                        userData.isUp = false;
                        userData.isDowning = false;
                        if (showAjiaB) that.checkPaiRuleResult();
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
                            if (showAjiaB) that.checkPaiRuleResult();
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
                    if (that.selfReplaceStatus != -1 && (!that.canTouchPai || !($("playerLayer.node.row1").isVisible()))) {
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
                    if (that.selfReplaceStatus != -1 && (!that.canTouchPai || !($("playerLayer.node.row1").isVisible()))) {
                        return false;
                    }
                    var paiArr = that.getPaiArr();
                    for (var i = 0; i < totalPaiCnt; i++) {
                        var pai = that.getPai(1, i);
                        var userData = pai.getUserData();
                        if (TouchUtils.isTouchMe(pai, touch, event, null, i == paiArr.length - 1 ? null : posConf.paiTouchRect)) {
                            if (userData.slideOverCnt == 0) {
                                slideOverCnt++;
                                userData.slideOverCnt++;
                                // if (cc.sys.isNative)
                                //     Filter.grayMask(pai);
                            }
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    if (that.selfReplaceStatus != -1 && (!that.canTouchPai || !($("playerLayer.node.row1").isVisible()))) {
                        return false;
                    }
                    if (slideOverCnt > 0) {
                        for (var i = 0; i < initPaiNum; i++) {
                            var pai = that.getPai(1, i);
                            var userData = pai.getUserData();
                            if (userData.slideOverCnt > 0) {
                                // if (cc.sys.isNative)
                                //     Filter.remove(pai);
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

            cc.eventManager.addListener(chupaiListener, $("playerLayer.node.row1"));
        },
        setPaiArrOfRow: function (row, paiArr, result) {
            // paiArr = [1,5,9,13,17];
            // result = 16;
            if (!(_.isNumber(result)) && !result) {
                for (var j = 0; j < paiArr.length; j++) {
                    this.setPai(row, j, paiArr[j], true).setOpacity(255);
                }
                for (; j < initPaiNum; j++) {
                    //盖一张两张  值-1  如果是五张全盖 值0
                    if (paiArr.length == 3 || paiArr.length == 4) {
                        this.setPai(row, j, -1, true).setOpacity(255);
                    } else {
                        this.setPai(row, j, 0, true).setOpacity(255);
                    }
                }
                return;
            }
            var arr = [];
            var niuArr = [];
            //获取超过10的牌组
            var indexArr = pokerRule_NN.checkNiu(paiArr);

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
                if (indexArr.length == 4) {
                    if (this.getPaiStackDir(row) == -1) {
                        _moveId = 1;
                    } else {
                        _moveId = 4;
                    }
                } else if (indexArr.length == 5) {

                } else {
                    if (this.getPaiStackDir(row) == -1) {
                        _moveId = 2;
                    } else {
                        _moveId = 3;
                    }
                }
                if (_moveId != -1) {
                    for (var i = 0; i < initPaiNum; ++i) {
                        var pai = this.getPai(row, i);
                        var dis = posConf.paiADistance[row] || posConf.paiADistance[row / 10];
                        pai.setPositionX(dis * i + posConf.paiStartPoint[row] +
                            this.getPaiStackDir(row) * (((i >= _moveId) ? 15 : -15)));
                    }
                }
            }
            //设置牌数据
            for (var j = 0; j < arr.length; j++) {
                var pai = this.setPai(row, j, arr[j], true);
                pai.setOpacity(255);
                if(arr[j] > 0)  this.hidePaiBack(pai);
            }
            for (; j < initPaiNum; j++) {
                this.setPai(row, j, 0, true).setOpacity(255);
            }

        },
        setReplayProgress: function (cur, total) {
            var progress = cur / total * 100;
            this.showTip("进度: " + progress.toFixed(1) + "%", false);
        },
        setAllPai4Replay: function (data) {
            for (var uid in data)
                if (data.hasOwnProperty(uid)) {
                    var row = uid2position[uid];
                    var paiArr = data[uid]["pai_arr"];
                    var usedPaiArr = data[uid]["used_arr"];
                    if (row == 1) {
                        this.setPaiArrOfRow(row, paiArr);
                        $("playerLayer.node.row" + row).setVisible(true);

                        this.setPaiArrOfRow(10, usedPaiArr);
                        $("playerLayer.node.row" + 10).setVisible(true);

                        // for (var _i = 0; _i < initPaiNum; _i++) {
                        //     Filter.grayMask(this.getPai(row, _i));
                        // }
                    } else {
                        this.setPaiArrOfRow(row, usedPaiArr);
                        $("playerLayer.node.row" + row).setVisible(true);
                    }
                }
        },
        fapaiAni: function (i, j, paiArr) {
            var that = this;
            if(isReconnect){
                var pai = that.getPai(i, j);
                pai.setVisible(true);
                if(paiArr && paiArr.length > 0){
                    that.hidePaiBack(pai);
                    that.setPaiHua(pai, paiArr[j]);
                }else{
                    that.showPaiBack(pai);
                }
            }else {
                var sprite = new cc.Sprite('res/submodules/niuniu/image/common/pai_back2.png');
                $('playerLayer.cardbackLayer').addChild(sprite);
                sprite.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
                sprite.setScale(0);
                var pai = that.getPai(i, j);
                // if (pai) Filter.remove(pai);
                pai.setVisible(false);
                var dis = posConf.paiADistance[i] || posConf.paiADistance[i / 10];
                pai.setPositionX(dis * j + posConf.paiStartPoint[i]);

                var x = pai.getPositionX() * $('playerLayer.node.row' + i).getScaleX() + $('playerLayer.node.row' + i).getPositionX();
                var y = pai.getPositionY() * $('playerLayer.node.row' + i).getScaleY() + $('playerLayer.node.row' + i).getPositionY();
                sprite.runAction(cc.sequence(
                    cc.spawn(
                        cc.moveTo(0.1, x, y),
                        cc.scaleTo(0.1, $('playerLayer.node.row' + i).getScale())
                    ),
                    cc.callFunc(function () {
                        sprite.setVisible(false);
                        pai.setVisible(true);
                        if(paiArr && paiArr.length > 0) {
                            that.hidePaiBack(pai);
                            that.setPaiHua(pai, paiArr[j]);
                        }else{
                            that.showPaiBack(pai);
                        }
                    })
                ));
            }
        },
        // faSiglePai: function (player) {
        //     if (player.uid == gameData.uid) {
        //         return;
        //     }
        //     var that = this;
        //     var newFaPaiNum = 0;
        //     if (mRoom.Preview == "si") {
        //         newFaPaiNum = 1;
        //     } else if (mRoom.Preview == "san") {
        //         newFaPaiNum = 2;
        //     }
        //     var row = uid2position[player.uid];
        //     $('playerLayer.node.row' + row).setVisible(true);
        //     that.getNiuAnimSp(row).setVisible(false);
        //     for (var j = 0; j < (initPaiNum - newFaPaiNum); j++) {
        //         var pai = that.getPai(row, j);
        //         pai.setVisible(true);
        //         that.showPaiBack(pai);
        //     }
        //     for (j; j < initPaiNum; j++) {
        //         //盖一张  两张
        //         var pai = that.getPai(row, j);
        //         if (pai) {
        //             if (pai.isVisible()) {
        //                 return;
        //             } else {
        //                 that.fapaiAni(row, j, function () {
        //                 }, 0);//0 发牌动画时间
        //             }
        //         }
        //     }
        // },
        faSiglePai: function (row) {
            if (row == 1 && gameData.isSelfWatching == false && gameData.isSitNotPlay == false) {
                return;
            }
            var that = this;
            var newFaPaiNum = 5;
            if (mRoom.Preview == "si") {
                newFaPaiNum = 1;
            } else if (mRoom.Preview == "san") {
                newFaPaiNum = 2;
            }
            that.getNiuAnimSp(row).setVisible(false);
            for (var j = 0; j < (initPaiNum - newFaPaiNum); j++) {
                var pai = that.getPai(row, j);
                pai.setVisible(true);
                that.showPaiBack(pai);
            }
            for (j; j < initPaiNum; j++) {
                //盖一张  两张
                (function(j){
                    var pai = that.getPai(row, j);
                    if (pai) {
                        if (pai.isVisible()) {
                            return;
                        } else {
                            that.fapaiAni(row, j);
                        }
                    }
                })(j);
            }
        },
        fapai: function (paiArr, newFaPaiNum) {//新发的牌  需要动画
            var that = this;
            // for (var j = 0; j < paiArr.length; j++)
            //     this.setPai(1, j, paiArr[j], false);
            for (var j = 0; j < paiArr.length; j++) {
                var root = this.getPai(1, j);
                if (j >= initPaiNum - newFaPaiNum) {
                    that.fapaiAni(1, j, paiArr)
                } else {
                    root.setVisible(true);
                }
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


            $("playerLayer.node.row1").setVisible(true);
            $("playerLayer.node.row10").setVisible(false);
            this.downAllPaiImmediately();
            // this.enableChuPai();
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
                var p = null;
                if(gameData.players && gameData.players.length > 0){
                    p = gameData.getPlayerInfoByUid(userData.UserID);
                }
                if(p){
                    p.score = userData.Score;
                    p.lastResult = userData.Result;
                }
            }
            var delayTime = 0;
            if (loseArr.length > 0) {  //有输家列表发起
                playEffect('vcoinsfly');
                for (var i = 0; i < loseArr.length; i++) {
                    that.playCoinsFlyAnim(uid2position[loseArr[i]], uid2position[zhuangId], function () {
                        if (winArr.length > 0) {
                            playEffect('vcoinsfly');
                            for (var i = 0; i < winArr.length; i++) {
                                that.playCoinsFlyAnim(uid2position[zhuangId], uid2position[winArr[i]], function () {
                                }, winArr[i]);
                            }
                            delayTime += 1;
                        }
                    }, loseArr[i]);
                }
                delayTime += 0.4;
            } else {//没有输家列表
                if (winArr.length > 0) {
                    playEffect('vcoinsfly');
                    for (var i = 0; i < winArr.length; i++) {
                        that.playCoinsFlyAnim(uid2position[zhuangId], uid2position[winArr[i]], function () {
                        }, winArr[i]);
                    }
                    delayTime += 1;
                }
            }
            setTimeout(function () {
                for (var i = 0; i < gameData.players.length; i++) {
                    var k = i + 1;
                    if (gameData.isSelfWatching && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                        k = k + 1;
                    }
                    var p = 0;
                    if(position2playerArrIdx && position2playerArrIdx[k] >= 0 && gameData.players[position2playerArrIdx[k]]){
                        p = gameData.players[position2playerArrIdx[k]];
                    }
                    $("playerLayer.node.info" + k + ".lb_score").setString(p.score);
                    that.showChangeScore(k, p.lastResult);
                }
                that.one_data = data;
                $('btn_Ready').setVisible(!(gameData.isSelfWatching));
                // Filter.remove($('btn_Ready'));
                that.setQiangZhuangBtnsVisible(false);
                that.hideAndResetPourBtn();
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
        getWatchUserInfoByUid: function (uid) {
            if (uid == null) return null;
            for (var i = 0; i < gameData.WatchingUsers.length; i++) {
                if (gameData.WatchingUsers[i].User.ID == uid) {
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

            var playerInfo = null;
            if(idx >= 0 && position2playerArrIdx[idx] >= 0 && gameData.players[position2playerArrIdx[idx]]){
                playerInfo = gameData.players[position2playerArrIdx[idx]];
            }
            var showAniBtn = !gameData.isSelfWatching;
            if (playerInfo == null || playerInfo == undefined) {
                if (idx == 1 && gameData.isSelfWatching == false && gameData.isSelfWatching == false) {
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
                    showAniBtn = false;
                }
            }
            //合并成为一个功能块
            // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', !showAniBtn);
            // this.addChild(this.playerInfoLayer);
            //合并成为一个功能块
            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1){
                this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false, showAniBtn);
                this.addChild(this.playerInfoLayer);
            }else{
                this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', showAniBtn);
                this.addChild(this.playerInfoLayer);
            }

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
            // var beginPos = $('playerLayer.node.info' + idx).convertToWorldSpace(cc.p(0, 0));
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
            var offline = $("playerLayer.node.info" + row + ".offline");
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
                setTimeout(function () {
                    window.soundQueue.shift();
                    that.playVoiceQueue();
                }, queue.duration * 1000);
            }
        },
        // playVoiceQueue: function () {
        //     var that = this;
        //     var queue = window.soundQueue[0];
        //     if (queue && queue.url && queue.duration && _.isNumber(queue.row)) {
        //         if (queue.url.indexOf('.aac') >= 0) {
        //             VoiceUtils.play(queue.url);
        //         } else if (queue.url.indexOf('.spx') >= 0) {
        //             OldVoiceUtils.playVoiceByUrl(queue.url);
        //         }
        //         var scale9sprite = this.initQP(queue.row);
        //         scale9sprite.setContentSize(posConf.ltqpEmojiSize[queue.row]);
        //         var innerNodes = this.initSpeaker(queue.row, scale9sprite);
        //         this.qpAction(innerNodes, scale9sprite, queue.duration);
        //         //关闭背景音域
        //         if (!_.isUndefined(window.musicID)) {
        //             jsb.AudioEngine.pause(window.musicID);
        //         }
        //         setTimeout(function () {
        //             window.soundQueue.shift();
        //             that.playVoiceQueue();
        //             //开启背景音乐
        //             if (!_.isUndefined(window.musicID)) {
        //                 jsb.AudioEngine.resume(window.musicID);
        //             }
        //
        //             if (gameData && gameData.voiceFlag == false) {
        //                 if (cc.sys.isNative) jsb.AudioEngine.pauseAll();
        //             }
        //         }, queue.duration * 1000);
        //     }
        // },
        initQP: function (row) {
            var that = this;
            $("playerLayer.node.info" + row).setLocalZOrder(1);
            var scale9sprite = $("playerLayer.node.info" + row + ".qp9");
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("playerLayer.node.info" + row).addChild(scale9sprite, 2);
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
            var that = this;
            if (row == undefined) return;
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

            // $("playerLayer.node.info" + row).setLocalZOrder(1);

            var scale9sprite = $("playerLayer.node.info" + row + ".qp9");
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("playerLayer.node.info" + row).addChild(scale9sprite, 2);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);

            var duration = 4;
            var innerNodes = [];
            scale9sprite.setCascadeOpacityEnabled(false);
            scale9sprite.setScale(1);
            if (type == "emoji") {
                scale9sprite.setOpacity(0);

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

                var size = cc.size(text.getVirtualRendererSize().width + posConf.ltqpRect[row].width - 40, posConf.ltqpRect[row].height);
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
            }else if (type == 'biaoqingdonghua') {
                var data = JSON.parse(content);

                //关闭表情  只能看到自己给别的  看不到别人给自己的
                if(gameData.biaoQingFlag == 0 && !(data.from_uid == gameData.uid && data.target_uid != gameData.uid)){
                    scale9sprite.setVisible(false);
                    return;
                }
                scale9sprite.setVisible(false);
                network.selfRecv({'code': 4990, 'data': data});
                return;
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
            var row = uid2position[uid];
            if (row >= 0 && $("playerLayer.node.info" + row)) {
                $("playerLayer.node.info" + uid2position[uid] + ".ok").setVisible(true);
            }
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
                text.setString(window.inReview ? "欢迎来到" + gameData.companyName + "拼十!" : gameData.Content);
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
            //一开始发牌 不发的牌值为-1  不显示  wcc修改
            if (pai.getUserData().pai == -1) {
                that.hidePaiBack(pai);
                pai.setVisible(false);
                return;
            }

            if (pai.getUserData().pai == 0) {
                that.showPaiBack(pai);
                return;
            }
            if (that.isPaiFan(pai) || immediatly) {
                that.hidePaiBack(pai);
                return;
            }
            // console.log("pai.fanAni"+pai.fanAni);
            if (pai.fanAni) {
                return;
            }
            pai.fanAni = true;
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
                ),
                cc.callFunc(function () {
                    pai.fanAni = false;
                })
            ))
        },
        fanRowPai: function (row, immediatly, fivecardv) {
            var that = this;
            //自己观战 row==1 return
            if (gameData.isSelfWatching && row == 1 && (gameData.players.length + that.sitDownWatchNum) < max_player_num) {
                return;
            }
            //搓牌之前  先不亮牌
            if (mRoom.Cuopai && mRoom.Preview && mRoom.Preview.length > 0 && that.canCuopai && row == 1) {
                network.start();
                return;
            }

            $('playerLayer.node.row' + row).setVisible(true);
            that.getNiuAnimSp(row).setVisible(false);
            for (var i = 0; i < initPaiNum; i++) {
                var pai = that.getPai(row, i);
                that.fanPai(pai, immediatly);
                if(row != 1 && mRoom.Preview == 'si' && pai.getUserData().pai == fivecardv){
                    that.setFiveCard(pai, true);
                    pai.setPositionY(20);
                }
            }

            if (!immediatly) {
                $('playerLayer.node.row' + row).runAction(cc.sequence(
                    cc.delayTime(FANPAI_DURATION * 2),
                    cc.callFunc(function () {
                        network.start();
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
                if ($("playerLayer.node.info" + (i + 1) + ".shenfen").isVisible()) {
                    beforZhuangId = i + 1;
                }
            }

            var nowZhuangId = -1;
            for (var i = 0; i < playerNum; i++) {
                $("playerLayer.node.info" + (i + 1) + ".shenfen").setVisible(position2uid[i + 1] == zhuangId);
                if ($("playerLayer.node.info" + (i + 1) + ".shenfen").isVisible()) {
                    nowZhuangId = i + 1;
                }
            }
            // beforZhuangId = 1;
            // nowZhuangId = 2;
            if (beforZhuangId != -1 && nowZhuangId != -1 && beforZhuangId != nowZhuangId) {
                var changZhuangAni = function () {
                    //播放上庄的动画
                    var i = nowZhuangId;
                    var head = $("playerLayer.node.info" + i + ".head");

                    $("playerLayer.node.info" + i + ".shenfen").setVisible(false);
                    that.scheduleOnce(function () {
                        playEffect('dingzhuang');
                    }, 0.2);
                    var anisrc = 1;
                    var aniScale = 1;
                    var pos = cc.p(100, 45);
                    if (max_player_num == 6) {
                        if (i == 5 || i == 6) {
                            anisrc = 2;
                            pos = cc.p(head.getContentSize().width / 2, 25);
                        }//六人的5，6头像框是竖着的
                        if (i == 1) {
                            pos = cc.p(110, 45);
                        }
                        if (i == 2 || i == 3 || i == 4) aniScale = 0.88;
                    } else {
                        pos = cc.p(110, 45);
                    }
                    var zhuangAni = head.getChildByName('zhuangAni');
                    if (!zhuangAni) {
                        var zhuangAniccsScene = ccs.load(res["DN_qiangzhuang0" + anisrc + "_json"], "res/");
                        zhuangAni = zhuangAniccsScene.node;
                        zhuangAni.setScale(aniScale);
                        zhuangAni.setPosition(pos);
                        zhuangAni.setName("zhuangAni");
                        head.addChild(zhuangAni);
                        zhuangAni.runAction(zhuangAniccsScene.action);
                        head.zhuangAniccsScene = zhuangAniccsScene;
                    }
                    zhuangAni.setVisible(true);
                    head.zhuangAniccsScene.action.play('action', false);

                    that.scheduleOnce(function () {
                        zhuangAni.setVisible(false);
                        $("playerLayer.node.info" + i + ".shenfen").setVisible(true);
                    }, 1.5);
                }

                var beforeZhuangSprite = $("playerLayer.node.info" + beforZhuangId + ".shenfen");
                beforeZhuangSprite.setVisible(false);
                var nowZhuangSprite = $("playerLayer.node.info" + nowZhuangId + ".shenfen");
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
        setQiangZhuangBtnsVisible: function (isVisible) {
            isVisible = !!isVisible;
            $('btn_buqiangzhuang').setVisible(isVisible);
            $('btn_qiangzhuang').setVisible(isVisible);
            $('btn_qiangzhuang1').setVisible(isVisible);
            $('btn_qiangzhuang2').setVisible(isVisible);
            $('btn_qiangzhuang3').setVisible(isVisible);
            $('btn_qiangzhuang4').setVisible(isVisible);
        },
        setChipInBtnsVisible: function (isVisible) {
            isVisible = !!isVisible;
            $("btn_jiao1").setVisible(isVisible);
            $("btn_jiao2").setVisible(isVisible);
            $("btn_jiao3").setVisible(isVisible);
            $("btn_jiao4").setVisible(isVisible);
            $("btn_jiao5").setVisible(isVisible);
        },
        //isReconnect 除了自己其他人发手牌  断线重连用
        faAllPai: function (needShowAnim, paiArr) {
            if($('playerLayer.cardbackLayer')){
                $('playerLayer.cardbackLayer').removeAllChildren();
                $('playerLayer.cardbackLayer').setVisible(true);
            }
            var that = this;

            if (needShowAnim) {
                for (var i = 0; i < 5; i++) {
                    that.scheduleOnce(function () {
                        playEffect('fapai');//发牌音效
                    }, 0.1 * i);
                }
            }
            var func = function (showNum) {
                var userFapai = function (i, j) {
                    var sprite = new cc.Sprite('res/submodules/niuniu/image/common/pai_back2.png');
                    $('playerLayer.cardbackLayer').addChild(sprite);
                    sprite.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
                    sprite.setScale(0);
                    var pai = that.getPai(i, j);
                    pai.setVisible(false);

                    var dis = posConf.paiADistance[i] || posConf.paiADistance[i / 10];
                    pai.setPositionX(dis * j + posConf.paiStartPoint[i]);

                    var x = pai.getPositionX() * $('playerLayer.node.row' + i).getScaleX() + $('playerLayer.node.row' + i).getPositionX() +
                        (cc.winSize.width / 2 - 1280 / 2);
                    var y = pai.getPositionY() * $('playerLayer.node.row' + i).getScaleY() + $('playerLayer.node.row' + i).getPositionY();
                    sprite.runAction(cc.sequence(
                        cc.delayTime(0.05 * j),
                        cc.spawn(
                            cc.moveTo(0.2, x, y),
                            cc.scaleTo(0.2, $('playerLayer.node.row' + i).getScale())
                        ),
                        cc.callFunc(function (sender) {
                            // sender.removeFromParent();
                        })
                    ));
                }
                for (var i = 1; i <= playerNum; i++) {
                    var userRow = i;
                    if (gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                        userRow = userRow + 1;
                    }
                    $('playerLayer.node.row' + userRow).setVisible(true);
                    that.getNiuAnimSp(userRow).setVisible(false);
                    for (var j = 0; j < showNum; j++) {
                        userFapai(userRow, j);
                    }
                    for (j; j < initPaiNum; j++) {
                        var pai = that.getPai(userRow, j);
                        pai.setVisible(false);
                    }
                }
            };
            var callback = function(){
                var showNum = paiArr.length;
                for (var i = 1; i <= playerNum; i++) {
                    var userRow = i;
                    if (gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                        userRow = userRow + 1;
                    }
                    for (var j = 0; j < showNum; j++) {
                        var pai = that.getPai(userRow, j);
                        if (pai) {
                            pai.setVisible(true);
                            that.hidePaiBack(pai);
                            that.setPaiHua(pai, userRow == 1 ? paiArr[j] : 0);
                        }
                    }
                }
            }

            if (needShowAnim) {
                var showNum = paiArr.length;
                var aniFinish = function(){
                    if($('playerLayer.cardbackLayer')){
                        $('playerLayer.cardbackLayer').removeAllChildren();
                        $('playerLayer.cardbackLayer').setVisible(false);
                    }

                    for (var i = 1; i <= playerNum; i++) {
                        //记录下错误日志
                        if(i == 1 && !gameData.isSelfWatching && !gameData.isSitNotPlay){
                            if(!paiArr || (paiArr && paiArr[0] == 0)){
                                network.disconnect();
                                alertError("", "发手牌报错，房间号" + gameData.roomId +",用户id" + gameData.uid, "")
                            }
                        }

                        var userRow = i;
                        if (gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                            userRow = userRow + 1;
                        }
                        //显示牌
                        for (var j = 0; j < showNum; j++) {
                            (function(currow, curj){
                                var pai = that.getPai(currow, curj);
                                pai.setVisible(true);
                                var cardvalue = 0;
                                if(currow == 1 && !gameData.isSelfWatching && !gameData.isSitNotPlay){
                                    cardvalue = paiArr[curj];
                                }
                                that.setPaiHua(pai, cardvalue);
                                if(currow == 1 && cardvalue > 0){
                                    that.hidePaiBack(pai);
                                }
                            })(userRow, j);
                        }
                    }
                }
                func(showNum);
                setTimeout(aniFinish, 500);
            } else {
                var showNum = paiArr.length;
                for (var i = 1; i <= playerNum; i++) {
                    var userRow = i;
                    if (gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
                        userRow = userRow + 1;
                    }
                    $('playerLayer.node.row' + userRow).setVisible(true);
                    that.getNiuAnimSp(userRow).setVisible(false);
                    for (var j = 0; j < showNum; j++) {
                        var pai = that.getPai(userRow, j);
                        pai.setVisible(true);
                        that.showPaiBack(pai);
                        if (i == playerNum) {
                            callback();
                        }
                    }
                    for (j; j < initPaiNum; j++) {
                        var pai = that.getPai(userRow, j);
                        pai.setVisible(false);
                    }
                }
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

            if (leftTime >= 0) leftTime--;

            //纯文字显示  没有leftTime
            if (leftTime > 0) {//正常倒计时阶段
                $('prompt_bg.prompt').setTextColor(cc.color("#e1dae2"));
                $('prompt_bg.prompt').setString(prompt + ":" + leftTime);
                if (leftTime < 4) {  //警告阶段
                    //根据实际状态确定警告内容
                    if (promptAction === "xiazhuxian") {
                        prompt = "即将选最低分";
                        $('prompt_bg.prompt').setTextColor(cc.color("#FF0000"));
                        $('prompt_bg.prompt').setString(prompt + ":" + leftTime);
                    } else if (promptAction === "qiangzhuang") {
                        prompt = "即将选最低倍数";
                        if (!(mRoom.Preview == 'san' || mRoom.Preview == 'si')) {
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
            if(this.selfReplaceStatus == -1)  return;
            var arr = this.getUpPaiArr();
            $('ops').setVisible(true);
            $('ops.niu0').setVisible(false);
            $('ops.niu1-10').setVisible(false);
            $('ops.bomb').setVisible(false);
            $('ops.fivesmall').setVisible(false);
            if (pokerRule_NN.isFiveSmall(arr)) {
                // $('ops.fivesmall').setVisible(true);
            } else if (pokerRule_NN.isBomb(arr)) {
                // $('ops.bomb').setVisible(true);
            } else if (pokerRule_NN.isNiu(arr)) {
                // $('ops.niu1-10').setVisible(true);
            } else {
                // $('ops.niu0').setVisible(true);
            }
        },
        checkPaiRuleResult: function () {
            if(this.selfReplaceStatus == -1){
                return;
            }
            var arr = this.getUpPaiArr();
            var _arr = this.getDownPaiArr();

            $("tip_niu").setVisible(true);

            if (arr.length == 3) {
                $('tip_niu.selectscore_bg').setVisible(true);
                var allscore = 0;
                for (var s = 1; s <= 3; s++) {
                    var score = 0;
                    if (arr[s - 1]) score = pokerRule_NN.getPaiValueNN(arr[s - 1]);
                    allscore += score;
                    $('tip_niu.selectscore_bg.num' + s).setString((score == 0) ? '' : score);
                }
                $('tip_niu.selectscore_bg.num4').setString(allscore);
            } else {
                $('tip_niu.selectscore_bg').setVisible(false);
            }

            $("tip_niu.niuniu").setVisible(true);
            //顺序 五小牛  炸弹牛 五花牛 葫芦牛 同花牛 顺子牛

            if (arr.length == 5) {
                if (pokerRule_NN.isFiveSmall(arr)) {
                    $("tip_niu.niuniu").loadTexture(res.DN_wuxiaoniu_png);
                } else if (pokerRule_NN.isBomb(arr)) {
                    $("tip_niu.niuniu").loadTexture(res.DN_zhadanniu_png);
                } else if (pokerRule_NN.isWuhua(arr)) {//五花牛
                    $("tip_niu.niuniu").loadTexture(res.DN_wuhuaniu_png);
                } else if (pokerRule_NN.isHulu(arr)) {
                    $("tip_niu.niuniu").loadTexture(res.DN_niu16_png);
                } else if (pokerRule_NN.isTonghua(arr)) {
                    $("tip_niu.niuniu").loadTexture(res.DN_niu15_png);
                } else if (pokerRule_NN.isShunzi(arr)) {
                    $("tip_niu.niuniu").loadTexture(res.DN_niu14_png);
                } else {
                    $("tip_niu.niuniu").loadTexture(res.DN_niu0_png);
                }

            } else if (arr.length == 4) {
                if (pokerRule_NN.isBomb(arr)) {
                    $("tip_niu.niuniu").loadTexture(res.DN_zhadanniu_png);
                } else {
                    $("tip_niu.niuniu").loadTexture(res.DN_niu0_png);
                }
            }else if(arr.length == 3){
                if (pokerRule_NN.isNiu(arr)) {
                    var count = pokerRule_NN.getNiuCount(_arr);
                    if (count > 0)
                        $("tip_niu.niuniu").loadTexture(res["DN_niu" + count + "_png"]);
                    else
                        $("tip_niu.niuniu").loadTexture(res["DN_niuniu_png"]);
                } else {
                    $("tip_niu.niuniu").loadTexture(res.DN_niu0_png);
                }
            } else {
                $("tip_niu.niuniu").setVisible(false);
            }
        },
        //isFanpai是否翻牌  isSelf
        showPaiResult: function (player, curShowAniUid, isFanpai, fiveCardValue) {
            var that = this;
            if (player == null) return;
            if (player.handStatus <= 0) {
                return;
            }
            //亮牌只亮一次
            // if(player.uid != curShowAniUid && player.uid != gameData.uid){
            //     return;
            // }
            // console.log("亮牌" + curShowAniUid);
            var row = uid2position[player.uid];
            var cards = player.cards;
            var result = player.niuResult;
            var niuRatio = player.niuRatio;
            if (row == 1) {
                that.setPaiArrOfRow(10, cards, result);
                $('playerLayer.node.row1').setVisible(false);
                $('playerLayer.node.row10').setVisible(true);
                if (curShowAniUid == player.uid) {
                    var func = function (i) {
                        var pai = that.getPai(1, i);
                        //去掉之前的动画
                        // that.hidePaiBack(pai);

                        var sprite = that.getChildByName('resultfly' + i);
                        if(!sprite) {
                            sprite = duplicateSprite(pai);
                            sprite.setName('resultfly' + i);
                            that.addChild(sprite);
                        }
                        var cardvalue = pai.getUserData().pai || 0;
                        that.setPaiHua(sprite, cardvalue);
                        sprite.setPosition(pai.getPositionX() * $('playerLayer.node.row1').getScaleX() + $('playerLayer.node.row1').getPositionX() + (cc.winSize.width/2 - 1280/2),
                            pai.getPositionY() * $('playerLayer.node.row1').getScaleY() + $('playerLayer.node.row1').getPositionY());
                        sprite.setScale($('playerLayer.node.row1').getScale());
                        sprite.setVisible(true);

                        var pai2 = that.getPai(10, i);
                        pai2.setVisible(false);
                        var x = pai2.getPositionX() * $('playerLayer.node.row10').getScaleX() + $('playerLayer.node.row10').getPositionX() + (cc.winSize.width/2 - 1280/2);
                        var y = pai2.getPositionY() * $('playerLayer.node.row10').getScaleY() + $('playerLayer.node.row10').getPositionY();
                        sprite.runAction(cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.08, x, y),
                                cc.scaleTo(0.08, $('playerLayer.node.row10').getScale() - 0.1)
                            ),
                            cc.scaleTo(0.04, $('playerLayer.node.row10').getScale()),
                            cc.callFunc(function () {
                                sprite.setVisible(false);
                                pai2.setVisible(true);

                                //第五张牌特殊显示
                                if(mRoom.Preview == 'si' && cards && cards[4] &&
                                    pai2 && pai2.getUserData().pai == cards[4]){
                                    // console.log("pai2222222==="+fiveCardValue);
                                    that.setFiveCard(pai2, true);
                                }
                            })
                        ))
                    };

                    for (var i = 0; i < initPaiNum; i++) {
                        func(i);
                    }

                    var sp = that.getNiuAnimSp(1);
                    if (sp) {
                        sp.removeAllChildren();
                    }
                    $('playerLayer.node.row10').runAction(cc.sequence(
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
                that.setPaiArrOfRow(row, (result == 100) ? [0, 0, 0, 0, 0]:cards, result);
                if (curShowAniUid == player.uid) {
                    var fivecardv = (cards && cards[4]) ? cards[4]:0;
                    network.stop([P.GS_Chat]);
                    if (isFanpai) {
                        that.fanRowPai(row, false, fivecardv);
                    } else {
                        network.start();
                    }

                    that.showResultAnim(row, result, false, niuRatio);
                } else {
                    if (isFanpai) {
                        that.fanRowPai(row);
                    } else {
                        network.start();
                    }
                    that.showResultAnim(row, result, (isReconnect ? false:true), niuRatio);
                }
            }
        },

        showResultAnim: function (row, result, immediatly, niuRatio) {
            //14顺子牛  15同花牛  16葫芦牛
            $("tip_niu").setVisible(false);

            playEffect('liangpai');//亮牌音效

            //test
            // if(this.result){
            //     if(this.result >= 18){
            //         this.result = 10;
            //     }
            //     this.result ++;
            // }else{
            //     this.result = 10;
            // }
            // result = this.result;
            // niuRatio = 3;
            // result = 11;

            var that = this;

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
                    finish.setPosition(cc.p(0, 0));
                    finish.setName("finish");
                    sp.addChild(finish);
                }
                finish.setVisible(true);
                return;
            }

            if (typeof result !== 'number' || result < 0 || result > 19) {
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
                sp.addChild(niuRatioSprite, 2);
            }
            var isRatio = false;

            var niuchengAction = null;
            if (immediatly) {

            } else {
                if (niuRatio && niuRatio >= 2) {
                    niuRatioSprite.setVisible(true);
                    niuRatioSprite.removeAllChildren(true);

                    var ccsScene = ccs.load(res['DN_niu_cheng' + niuRatio + "_json"], "res/");
                    niuchengAction = ccsScene.node;
                    niuchengAction.setScale(1.0);
                    niuchengAction.setPosition(cc.p(0, 0));
                    niuchengAction.setName("niuCheng");
                    niuRatioSprite.addChild(niuchengAction);
                    niuchengAction.runAction(ccsScene.action);
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
            } else {
                if (row == 10) {
                    row = 1;
                }
                playEffect('nn' + result, position2sex[row]);

                niuResultSprite.removeAllChildren();

                // console.log(res['DN_niu' + result + "_json"]);
                var ccsScene = ccs.load(res['DN_niu' + result + "_json"], "res/");
                var niuAction = ccsScene.node;

                var niuRatioSprite = sp.getChildByName("niuRatioSprite");

                //十带七 八 九
                // if([7, 8, 9].indexOf(result) >= 0) {
                //     niuResultSprite.setPosition(cc.p(-70, 0));
                //     niuRatioSprite.setPosition(cc.p(100, 0));
                // }else if([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(result) >= 0){
                //     //11炸弹妞 12五花牛 13五小牛 14顺子 15同花 16葫芦 17十小 18 四十大 19同花顺
                //     niuResultSprite.setPosition(cc.p(-45, 0));
                //     niuRatioSprite.setPosition(cc.p(90, 0));
                // }else if([0,1,2,3,4,5,6].indexOf(result) >= 0){
                //     if(niuRatio && niuRatio >= 2){
                //
                //     }else {
                //         niuResultSprite.setPosition(cc.p(-10, 0));
                //     }
                // }else{
                //     niuResultSprite.setPosition(cc.p(0, 0));
                // }

                //新的设置
                var nnWidth = 147;//208
                var chengWidth = 0;
                if(niuAction && $('Node_1.DN_niu00_2', niuAction)){
                    nnWidth = $('Node_1.DN_niu00_2', niuAction).getContentSize().width;
                }
                if(niuRatio >= 2 && niuchengAction && $('Node_2.Node_6.MJ_taizhuang_2_2', niuchengAction)){
                    chengWidth = 53 + $('Node_2.Node_6.MJ_taizhuang_2_2', niuchengAction).getContentSize().width;
                }
                if(niuRatio >= 2){
                    niuResultSprite.setPosition(cc.p(nnWidth/2 - (nnWidth + chengWidth)/2 + ((result>10)?-10:0), 0));
                    niuRatioSprite.setPosition(cc.p((nnWidth + chengWidth)/2 - chengWidth/2, 0));
                }else{
                    niuResultSprite.setPosition(cc.p(-10, 0));
                }


                niuAction.setPosition(cc.p(0, 0));
                niuAction.setName("niuAction");
                niuResultSprite.addChild(niuAction);
                niuAction.runAction(ccsScene.action);
                ccsScene.action.play('action', false);
            }
        },
        getNiuAnimSp: function (row) {
            var sp = $('playerLayer.node.row' + row + '.anim');
            if (!sp) {
                sp = new cc.Sprite();
                sp.setName('anim');
                sp.setPosition(cc.p(0, -40));
                // sp.setPositionY(sp.getPositionY() - 40);
                // sp.setPositionX(sp.getPositionX() - 50);
                $('playerLayer.node.row' + row).addChild(sp, 20);
                sp.setScale(1.4);
            }
            return sp;
        },
        playCoinsFlyAnim: function (rowBegin, rowEnd, cb, parentUserId) {
            var that = this;
            var beginPos = $('playerLayer.node.info' + rowBegin + ".info_bg").convertToWorldSpace(cc.p(0, 0));
            beginPos.x = beginPos.x + $('playerLayer.node.info' + rowBegin + ".info_bg").getContentSize().width / 2;
            beginPos.y = beginPos.y + $('playerLayer.node.info' + rowBegin + ".info_bg").getContentSize().height / 2;
            var endPos = $('playerLayer.node.info' + rowEnd + ".info_bg").convertToWorldSpace(cc.p(0, 0));
            endPos.x = endPos.x + $('playerLayer.node.info' + rowEnd + ".info_bg").getContentSize().width / 2;
            endPos.y = endPos.y + $('playerLayer.node.info' + rowEnd + ".info_bg").getContentSize().height / 2;

            var headTwinkle = function (row) {
                var headTwinkle = $('playerLayer.node.info' + row).getChildByName("headTwinkle");
                var infobgSize = $('playerLayer.node.info' + row + ".info_bg").getBoundingBox();
                if (!headTwinkle) {
                    headTwinkle = new cc.Sprite();
                    var pos = $('playerLayer.node.info' + row + ".info_bg").getPosition();
                    headTwinkle.setPosition(pos);
                    headTwinkle.setName("headTwinkle");
                    $('playerLayer.node.info' + row).addChild(headTwinkle);
                }
                var Anim_name = "DN_xiangkuang_guang01_json";
                if (max_player_num == 6 && (row == 5 || row == 6)) {
                    Anim_name = "DN_xiangkuang_guang02_json";
                }
                ;

                playAnimScene(headTwinkle, res[Anim_name], infobgSize.width / 2, infobgSize.height / 2, false, function () {
                    headTwinkle.removeAllChildren();
                });
            };

            var coinFly = function (i, allnum) {
                var sprite = that.getChildByName("flycoin_" + parentUserId + "_" + i);
                if (!sprite) {
                    sprite = new cc.Sprite(res.game_coin);
                    sprite.setName("flycoin_" + parentUserId + "_" + i);
                    that.addChild(sprite, 30);
                }
                sprite.setPosition(cc.p(beginPos.x + Math.floor(Math.random() * 20), -40 + beginPos.y + Math.floor(Math.random() * 20)));
                sprite.setVisible(true);
                sprite.stopAllActions();
                sprite.runAction(cc.sequence(
                    cc.delayTime(0 + 0.08 * i),
                    cc.jumpTo(0.4,
                        cc.p(endPos.x + Math.floor(Math.random() * 40), -20 + endPos.y + Math.floor(Math.random() * 40)),
                        30,
                        1).easing(cc.easeOut(1)),
                    cc.delayTime(0.2),
                    cc.callFunc(function () {
                        sprite.setVisible(false);
                        if ((allnum - 1) == i) {
                            headTwinkle(rowEnd);
                            cb && cb()
                        }
                    })
                ))
            };
            // coinFly(1);
            var flycoinNum = 8;
            for (var i = 0; i < flycoinNum; i++) {
                coinFly(i, flycoinNum);
            }
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
            $('prompt_bg').setVisible(false);
        },
        showTipMsg: function (action, state) {
            if (gameData.players && gameData.players.length == 0) {
                $('prompt_bg').setVisible(false);
                return;
            }
            $('prompt_bg').setVisible(true);
            var szTipPrompt = $('prompt_bg.prompt');

            if ("" != action) {
                //根据action状态区分显示内容
                //根据倒计时发生的状态更新显示Tip的内容
                if (action == "qiangzhuang" || action == 1) {//可以抢庄
                    promptAction = "qiangzhuang";
                    prompt = "请选择抢庄倍数";
                    if (!(mRoom.Preview == 'san' || mRoom.Preview == 'si')) {
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
                } else if (action == "dengdaikaishiend") {
                    promptAction = "dengdaikaishiend";
                    prompt = "等待其他玩家准备";
                } else if(action == "replacecard"){
                    promptAction = "replacecard";
                    prompt = "请选择是否换牌";
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
                                else if (i == players.length) {
                                    return players[0];
                                }

                            }
                        }();
                        //var _player =  players[0];
                        //console.log(players);
                        var nickname = "房主";
                        if (_player && _player["nickname"]) nickname = _player["nickname"];
                        prompt = "等待" + ellipsisStr(nickname, 5) + "开始游戏";
                        if (gameData.currentRound > 1) {
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
        uid2player: function (uid) {
            var that = this;
            var row = uid2position[uid];
            // console.log(row);
            var playerInfo = $("playerLayer.node.info" + row);
            if (playerInfo) {
                var head = playerInfo.getChildByName('head');
                playerInfo.setYellowFrameVisible = function (visible) {
                    var guangquan = head.getChildByName("guangquan");
                    var guangquanSprite = head.getChildByName("guangquanSprite");
                    if (guangquanSprite) guangquanSprite.setVisible(visible);

                }
                playerInfo.hideQiangzhuangResult = function () {
                    var jiaofen = playerInfo.getChildByName('jiaofen');
                    var jiaofenSprite = jiaofen.getChildByName("jiaofenSprite");
                    if (jiaofenSprite) jiaofenSprite.setVisible(false);
                    var guangquanSprite = head.getChildByName("guangquanSprite");
                    if (guangquanSprite) guangquanSprite.setVisible(false);
                }
                playerInfo.playGetZhuangAnim = function (ratio) {
                    playerInfo.hideQiangzhuangResult();
                    playEffect("dingzhuang");
                    var anisrc = 1;//定庄特效
                    var aniScale = 1;
                    var pos = cc.p(100, 45);
                    var row = uid2position[playerInfo.uid];
                    if (max_player_num == 6) {
                        if (row == 5 || row == 6) {
                            anisrc = 2;
                            pos = cc.p(head.getContentSize().width / 2, 25);
                        }
                        if (row == 1) {
                            pos = cc.p(110, 45);
                        }
                        if (row == 2 || row == 3 || row == 4) aniScale = 0.88;
                    } else {
                        pos = cc.p(110, 45);
                    }
                    var zhuangAni = head.getChildByName('zhuangAni');
                    if (!zhuangAni) {
                        var zhuangAniccsScene = ccs.load(res["DN_qiangzhuang0" + anisrc + "_json"], "res/");
                        zhuangAni = zhuangAniccsScene.node;
                        zhuangAni.setScale(aniScale);
                        zhuangAni.setPosition(pos);
                        zhuangAni.setName("zhuangAni");
                        head.addChild(zhuangAni);
                        zhuangAni.runAction(zhuangAniccsScene.action);
                        head.zhuangAniccsScene = zhuangAniccsScene;
                    }
                    zhuangAni.setVisible(true);
                    head.zhuangAniccsScene.action.play('action', false);

                    this.scheduleOnce(function () {
                        if (ratio && ratio != 0) {
                            $('playerLayer.node.info' + row + '.chipin').setVisible(true);
                            $('playerLayer.node.info' + row + '.chipin.fenshu').setString('0');
                            $('playerLayer.node.info' + row + '.chipin.num').setString('x' + ratio);
                            that.flyFenshu(playerInfo.uid);
                        }
                        network.start();
                    }, 1);
                }
            }
            return playerInfo;
        },
        playQiangzhuangAnim: function (uidArr, zhuangUid, zhuangBeishu) {
            var that = this;
            uidArr = _.shuffle(uidArr);
            // console.log(uidArr);
            var zhuangPlayer = this.uid2player(zhuangUid);
            if (uidArr && uidArr.length == 1) {
                //只有一个人抢庄
                zhuangPlayer.playGetZhuangAnim(zhuangBeishu);
                return;
            }
            var playerArr = [];
            for (var i = 0; i < uidArr.length; i++)
                if (uidArr[i]) {
                    var player = this.uid2player(uidArr[i]);
                    playerArr.push(player);
                }

            var fn = function (dt) {
                return dt === 1 ? 1 : (-(Math.pow(2, -10 * dt)) + 1);
            };
            var totalSec = 1.8, totalFrames = 25;
            var dtArr = [];
            for (var i = 0; i < totalFrames; i++)
                dtArr.push(fn(i / totalFrames) * totalSec);

            var i = 0, dt = 0, lastPlayer = null;
            var qiangzhuangMask = $("playerLayer.node.black");
            qiangzhuangMask.setBackGroundColorOpacity(60);
            qiangzhuangMask.setContentSize(cc.winSize);
            qiangzhuangMask.setVisible(true);
            qiangzhuangMask.update = function (_dt) {
                dt += _dt;
                if (dt < dtArr[i])
                    return;

                if (lastPlayer)
                    lastPlayer.setYellowFrameVisible(false);

                var player = playerArr[i % playerArr.length];
                player.setYellowFrameVisible(true);

                lastPlayer = player;
                i++;
                if (dt > totalSec || isReconnect) {
                    for (var j = 0; j < gameData.players.length; j++)
                        if (gameData.players[j].uid != zhuangUid) {
                            var player = that.uid2player(gameData.players[j].uid);
                            player.hideQiangzhuangResult();
                            gameData.players[j].uid != zhuangUid && player.setYellowFrameVisible(false);
                        }
                    zhuangPlayer.playGetZhuangAnim(zhuangBeishu);
                    qiangzhuangMask.setVisible(false);
                    qiangzhuangMask.unscheduleUpdate();
                }
            };
            qiangzhuangMask.scheduleUpdate();
        },
        // hideJiaoFen: function (data, jiaoUsers) {
        //     var that = this;
        //     var Banker = data.Banker;
        //     // console.log(jiaoUsers);
        //     //抢庄结束 光圈按顺时针依次消失  在显示定庄的特效
        //     var clearJiangeT = 0.5;
        //     var clearRowArr = [0, 5, 3, 1, 2, 4];
        //     if(max_player_num == 9){
        //         clearRowArr = [0, 7, 5, 3, 1, 2, 4, 6, 8];
        //     }
        //     for(var i=clearRowArr.length-1;i>=0;i--) {
        //         if (position2uid[clearRowArr[i]] && jiaoUsers.indexOf(position2uid[clearRowArr[i]]) >= 0) {
        //         }else{
        //             clearRowArr.splice(i, 1);
        //         }
        //     }
        //     var zhuangRow = uid2position[Banker];
        //     for (var i = 0; i < clearRowArr.length; i++) {
        //         var clearRow = clearRowArr[0];
        //         if (zhuangRow != clearRowArr[0]) {
        //             clearRowArr.splice(0, 1);
        //             clearRowArr.push(clearRow);
        //         }
        //         else
        //             break;
        //     }
        //     // console.log(zhuangRow);
        //     // console.log(clearRowArr);
        //
        //     for (var i = 1; i <= playerNum; i++) {
        //         //自己观战 i需要加1
        //         var row = i;
        //         if (gameData.isSelfWatching && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)) {
        //             row = row + 1;
        //         }
        //     }
        //     for (var i = 1; i <= playerNum; i++) {
        //         (function(i){
        //             //自己观战 i需要加1
        //             var row = i;
        //             if(gameData.isSelfWatching  && i < max_player_num && max_player_num > (gameData.players.length + that.sitDownWatchNum)){
        //                 row = row + 1;
        //             }
        //             var jiaofen = $("playerLayer.node.info" + row + ".jiaofen");
        //             var jiaofenSprite = jiaofen.getChildByName("jiaofenSprite");
        //             if (jiaofenSprite) {
        //                 jiaofenSprite.setVisible(false);
        //             }
        //             var head = $("playerLayer.node.info" + row + ".head");
        //
        //             var delayT = clearJiangeT*(clearRowArr.length - 1);
        //             if(row != zhuangRow){
        //                 for (var k = 0; k < clearRowArr.length; k++) {
        //                     if (clearRowArr[k] == row) {
        //                         delayT = clearJiangeT * (k - 1);
        //                         break;
        //                     }
        //                 }
        //             }
        //             // console.log(row);
        //             // console.log(delayT);
        //             if(false) {
        //                 var guangquan = head.getChildByName("guangquan");
        //                 var guangquanSprite = head.getChildByName("guangquanSprite");
        //                 if (guangquan) {
        //                     guangquan.setVisible(true);
        //                     if (guangquanSprite) guangquanSprite.setVisible(true);
        //                     guangquan.runAction(cc.sequence(
        //                         cc.delayTime(0.2),
        //                         cc.fadeOut(0.1),
        //                         cc.delayTime(delayT),
        //                         cc.fadeIn(0.1),
        //                         cc.delayTime(0.6),
        //                         cc.callFunc(function () {
        //                             guangquan.setVisible(false);
        //                             if (guangquanSprite) guangquanSprite.setVisible(false);
        //                         })
        //                     ))
        //                 }
        //             }
        //             if (position2uid[row] == Banker) {
        //                 that.scheduleOnce(function () {
        //                     playEffect("dingzhuang");
        //                     var anisrc = 1;//定庄特效
        //                     var aniScale = 1;
        //                     var pos = cc.p(100, 45);
        //                     if(max_player_num == 6){
        //                         if(row == 5 || row == 6) {
        //                             anisrc = 2;
        //                             pos = cc.p(head.getContentSize().width / 2, 25);
        //                         }
        //                         if(row == 1){
        //                             pos = cc.p(110, 45);
        //                         }
        //                         if(row == 2 || row == 3 || row == 4)  aniScale = 0.88;
        //                     }else{
        //                         pos = cc.p(110, 45);
        //                     }
        //                     var zhuangAni = head.getChildByName('zhuangAni');
        //                     if(!zhuangAni) {
        //                         var zhuangAniccsScene = ccs.load(res["DN_qiangzhuang0" + anisrc + "_json"], "res/");
        //                         zhuangAni = zhuangAniccsScene.node;
        //                         zhuangAni.setScale(aniScale);
        //                         zhuangAni.setPosition(pos);
        //                         zhuangAni.setName("zhuangAni");
        //                         head.addChild(zhuangAni);
        //                         zhuangAni.runAction(zhuangAniccsScene.action);
        //                         head.zhuangAniccsScene = zhuangAniccsScene;
        //                     }
        //                     zhuangAni.setVisible(true);
        //                     head.zhuangAniccsScene.action.play('action', false);
        //                 }, clearJiangeT*clearRowArr.length);
        //             }
        //         })(i);
        //     }
        // },
        flyJiaoFen: function (status, row) {
            //status
            var jiaofenSrc = res["jiaofen_" + status + "_png"];
            if (status == -2) {
                jiaofenSrc = res.jiaofen_no_png;
            }

            var jiaofen = $("playerLayer.node.info" + row + ".jiaofen");
            if (jiaofen == null || status == null || row == null) return;
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

            //抢庄音效  抢了才播放动画
            if (status != -2) {
                playEffect("niuniuchoose");
            }
            var head = $("playerLayer.node.info" + row + ".head");
            var anisrc = 5;
            var aniScale = 1;
            var pos = cc.p(100, 45);
            var guangquanSrc = 'res/image/ui/animation/DN_qiangzhuang01.png';
            if (max_player_num == 6) {
                if (row == 5 || row == 6) {
                    anisrc = 4;
                    pos = cc.p(head.getContentSize().width / 2, 25);
                    guangquanSrc = 'res/image/ui/animation/DN_qiangzhuang02.png'
                }
                if (row == 1) {
                    pos = cc.p(110, 45);
                }
                if (row == 2 || row == 3 || row == 4) aniScale = 0.88;
            } else {
                pos = cc.p(110, 45);
            }
            var guangquanSprite = head.getChildByName('guangquanSprite');
            if (!guangquanSprite) {
                guangquanSprite = new cc.Sprite(guangquanSrc);
                guangquanSprite.setPosition(pos);
                head.addChild(guangquanSprite);
                guangquanSprite.setName('guangquanSprite');
                guangquanSprite.setOpacity(100);
                guangquanSprite.setScale(aniScale);
            }
            guangquanSprite.setVisible(false);

        },
        initBG: function () {
            var sceneid = cc.sys.localStorage.getItem('sceneid_niuniu') || 0;
            var bg = $("bg");
            bg.setTexture(res["table_niuniu_back" + sceneid + "_jpg"]);

        },
        flyFenshu: function (uid, scorenum) {
            playEffect("jiazhu", gameData.sex);

            var row = uid2position[uid];
            var info = $('playerLayer.node.info' + row);
            var head = $('head', info);
            var chipin = $('playerLayer.node.info' + row + '.chipin');
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

            var movetime = Math.sqrt((sPos.x - tPos.x) * (sPos.x - tPos.x) + (sPos.y - tPos.y) * (sPos.y - tPos.y)) / 1800;
            flycoin.runAction(cc.sequence(
                cc.callFunc(function () {
                    fenshu.setVisible(false);
                }),
                cc.spawn(cc.moveTo(movetime, tPos.x, tPos.y), cc.scaleTo(movetime, fenshu.getScale())),
                cc.callFunc(function () {
                    fenshu.setVisible(true);
                    flycoin.removeFromParent();
                })
            ));
        },
        huoYanAni: function (row, visibleFlag) {
            if (row == undefined) {
                return;
            }
            var head = $("playerLayer.node.info" + row + ".head");
            if (head) {
                var huoyan = head.getChildByName('huoyan');
                if (!huoyan) {
                    var pos = cc.p(100, 25);
                    var aniScale = 1;
                    if (max_player_num == 6) {
                        if (row == 5 || row == 6) {
                            pos = cc.p(head.getContentSize().width / 2, 0);
                        }//六人的5，6头像框是竖着的
                        if (row == 1) {
                            pos = cc.p(110, 25);
                        }
                        if (row == 2 || row == 3 || row == 4) aniScale = 0.88;
                    } else {
                        pos = cc.p(110, 25);
                    }
                    huoyan = new sp.SkeletonAnimation(res.huoyan_json, res.huoyan_atlas);
                    huoyan.setName('huoyan');
                    huoyan.setScale(aniScale);
                    huoyan.setPosition(pos);
                    huoyan.setLocalZOrder(100);
                    head.addChild(huoyan);
                }
                if (visibleFlag && huoyan.isVisible() == false) {
                    playEffect('fire');//提示音效
                    if (max_player_num == 6 && (row == 5 || row == 6)) {
                        huoyan.addAnimation(0, 'huoyan02', true);
                    } else {
                        huoyan.addAnimation(0, 'huoyan01', true);
                    }
                }
                huoyan.setVisible(visibleFlag);
            }
        },
        cuoPaiZhongAni: function (row, visibleFlag) {
            if (row == 1 && gameData.isSelfWatching == false) {//自己不显示
                return;
            }
            var updownTime = 0.4;
            var head = $("playerLayer.node.info" + row + ".head");

            var cuoS = head.getChildByName('cuoS');
            if (!cuoS) {
                cuoS = new cc.Sprite('res/image/ui/niuniu/character/operate_cuo.png');
                cuoS.setName('cuoS');
                cuoS.setPosition(cc.p(12, 42 + 10));
                head.addChild(cuoS);
            }
            var paiS = head.getChildByName('paiS');
            if (!paiS) {
                paiS = new cc.Sprite('res/image/ui/niuniu/character/operate_pai.png');
                paiS.setName('paiS');
                paiS.setPosition(cc.p(42, 42));
                head.addChild(paiS);
            }
            var zhongS = head.getChildByName('zhongS');
            if (!zhongS) {
                zhongS = new cc.Sprite('res/image/ui/niuniu/character/operate_zhong.png');
                zhongS.setName('zhongS');
                zhongS.setPosition(cc.p(72, 42 - 10));
                head.addChild(zhongS);
            }
            if (visibleFlag) {
                cuoS.setVisible(true);
                paiS.setVisible(true);
                zhongS.setVisible(true);
                cuoS.stopAllActions();
                paiS.stopAllActions();
                zhongS.stopAllActions();
                cuoS.setPosition(cc.p(12, 52));
                paiS.setPosition(cc.p(42, 42));
                zhongS.setPosition(cc.p(72, 32));
                cuoS.runAction(cc.repeatForever(cc.sequence(
                    cc.moveBy(updownTime, cc.p(0, -20)), cc.moveBy(updownTime, cc.p(0, 20))
                )));
                paiS.runAction(cc.repeatForever(cc.sequence(
                    cc.moveBy(updownTime / 2, cc.p(0, -10)), cc.moveBy(updownTime, cc.p(0, 20)), cc.moveBy(updownTime / 2, cc.p(0, -10))
                )));
                zhongS.runAction(cc.repeatForever(cc.sequence(
                    cc.moveBy(updownTime, cc.p(0, 20)), cc.moveBy(updownTime, cc.p(0, -20))
                )));
            } else {
                cuoS.stopAllActions();
                paiS.stopAllActions();
                zhongS.stopAllActions();
                cuoS.setVisible(false);
                paiS.setVisible(false);
                zhongS.setVisible(false);
                cuoS.setPosition(cc.p(12, 52));
                paiS.setPosition(cc.p(42, 42));
                zhongS.setPosition(cc.p(72, 32));
            }

            // ccs.jingluan(cuoS, true);
            // ccs.jingluan(paiS, true);
            // ccs.jingluan(zhongS, true);
        },
        //换牌动画
        replaceCardAni: function(arr){
            arr = [1,2,3,7];
            for(var i=0;i<arr.length;i++){
                var card = new cc.Sprite();
                this.setPaiHua(card, arr[i]);
                card.setPosition(cc.p(1000, 50));
                card.setRotation(-45);
                this.addChild(card);
                card.runAction(cc.sequence(
                    cc.delayTime(i*0.2),
                    cc.spawn(
                        cc.rotateTo(0.2, 0),
                        cc.moveTo(0.2, cc.p(cc.winSize.width/2 - (arr.length/2 - i - 0.5)*160, 120)))
                ))
            }
        },
        getRowByUid: function (uid) {
            return uid2position[uid];
        },
        getOriginalPos: function () {
            return 1;
        },
        getEffectEmojiPos: function (caster, patient, isNotMid) {
            var self = this;
            var pos = {};
            var infoCasterHead = $('playerLayer.node.info' + caster + '.head');
            var infoPatientHead = $('playerLayer.node.info' + patient + '.head');
            if(!(caster >= 0 && patient >= 0 && infoCasterHead && infoPatientHead)) {
                pos[caster] = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
                pos[patient] = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
                return pos;
            }else{
                pos[caster] = infoCasterHead ? infoCasterHead.getParent().convertToWorldSpace(infoCasterHead.getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
                pos[patient] = (patient != self.getOriginalPos() && infoPatientHead) || isNotMid ? infoPatientHead.getParent().convertToWorldSpace(infoPatientHead.getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
                return pos;
            }
        },
    });
    exports.NiuniuLayer = NiuniuLayer;
})(window);
