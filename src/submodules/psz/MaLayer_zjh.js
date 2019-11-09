"use strict";
(function (exports) {

    var zjh_signal1 = res.signal1;
    var zjh_signal2 = res.signal2;
    var zjh_signal3 = res.signal3;
    var zjh_signal4 = res.signal4;

    var wifi_signal1 = res.signal1;
    var wifi_signal2 = res.signal2;
    var wifi_signal3 = res.signal3;
    var wifi_signal4 = res.signal4;

    var TEXTURE_STATUS = {
        'kan': "res/submodules/psz/image/PkScene_zjh/yikanpai.png",//cc.textureCache.addImage("res/submodules/psz/image/PkScene_zjh/yikanpai.png"),
        'qi': "res/submodules/psz/image/PkScene_zjh/yiqipai.png",//cc.textureCache.addImage("res/submodules/psz/image/PkScene_zjh/yiqipai.png"),
        'shu': "res/submodules/psz/image/PkScene_zjh/bipaishu.png",//cc.textureCache.addImage("res/submodules/psz/image/PkScene_zjh/bipaishu.png")
    };
    var TEXTURE_SELF_STATUS = {
        'kan': "res/submodules/psz/image/PkScene_zjh/yikanpai2.png",//cc.textureCache.addImage("res/submodules/psz/image/PkScene_zjh/yikanpai2.png"),
        'qi': "res/submodules/psz/image/PkScene_zjh/yiqipai2.png",//cc.textureCache.addImage("res/submodules/psz/image/PkScene_zjh/yiqipai2.png"),
        'shu': "res/submodules/psz/image/PkScene_zjh/bipaishu2.png",//cc.textureCache.addImage("res/submodules/psz/image/PkScene_zjh/bipaishu2.png")
    };
    var BUTTON_COMMON_RES = {
        'disable1' : "res/submodules/psz/image/PkScene_zjh/btn_hui.png",
        'blue1' : "res/submodules/psz/image/PkScene_zjh/btn_lan.png",
        'orange1' : "res/submodules/psz/image/PkScene_zjh/btn_cheng.png",
        'red1' : "res/submodules/psz/image/PkScene_zjh/btn_red.png"
    }
    //后期优化牌桌 加入筹码按钮
    var chipsArr = [2,3,4,5,6,8,10];
    for(var i=0; i<chipsArr.length; i++){
        BUTTON_COMMON_RES['chip'+chipsArr[i]] = "res/submodules/psz/image/PkScene_zjh/btn_chip" +chipsArr[i]+ ".png";
    }
    var BUTTON_COMMON_FONT_COLOR = {
        'blue' : cc.color(49, 83, 168),
        'orange': cc.color(152, 78, 24),
        'red': cc.color(152,24,24),
        'green' : cc.color(6,118,0)
    }

    var $ = null;

    var PAIID2CARD = [];

    var initPaiNum = 20;

    var g_kanpai = false;
    var g_gendaodi = false;//跟到底

    var paizhuoType = 0;

    for (var i = 0; i < 54; i++)
        PAIID2CARD[i] = new pokerRule.Card(i);

    // CONST
    var FAPAI_ANIM_DELAY = 0.04;
    var FAPAI_ANIM_DURATION = 0.2;

    var LAIZI_TEXTURE = cc.textureCache.addImage("res/image/ui/poker/character/lai_star.png");

    var ROOM_STATE_CREATED = 1;
    var ROOM_STATE_ONGOING = 2;
    var ROOM_STATE_ENDED = 3;

    var PLAYER_STATE_WATCHING = 5;
    var PLAYER_STATE_SITDOWN = 0;
    var PLAYER_STATE_PREPAREING = 2;
    var PLAYER_STATE_PLAYING = 3;


    var cardScale = 1;

    var TUIZHUARRAY = {5:[2,3,4,5], 10:[2,3,5,10]};
    var ZUIDAXIAZHU = 5;

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
            3: {
                0: cc.rect(44, 25, 1, 1)
                , 1: cc.rect(26, 31, 1, 1)
                , 2: cc.rect(44, 25, 1, 1)
                , 3: cc.rect(42, 26, 1, 1)
            },
            5: {
                1: cc.rect(26, 31, 1, 1)
                , 2: cc.rect(44, 25, 1, 1)
                , 3: cc.rect(42, 23, 1, 1)
                , 4: cc.rect(42, 23, 1, 1)
                , 5: cc.rect(26, 31, 1, 1)
            },
            9: {
                1: cc.rect(26, 31, 1, 1)//右
                , 2: cc.rect(42, 23, 1, 1)
                , 3: cc.rect(42, 23, 1, 1)//左
                , 4: cc.rect(42, 23, 1, 1)
                , 5: cc.rect(42, 23, 1, 1)
                , 6: cc.rect(42, 23, 1, 1)
                , 7: cc.rect(26, 31, 1, 1)
                , 8: cc.rect(26, 31, 1, 1)
                , 9:  cc.rect(26, 31, 1, 1)
            }
        }
        , ltqpEmojiPos: {
            3: {
                0: cc.p(40, 28)
                , 1: cc.p(40, 28)
                , 2: cc.p(60, 40)
                , 3: cc.p(40, 28)
            },
            5: {
                1: cc.p(40, 28)//右
                , 2: cc.p(60, 40)
                , 3: cc.p(40, 28)//左
                , 4: cc.p(40, 28)
                , 5: cc.p(40, 28)
            },
            9: {
                1: cc.p(40, 28)//右
                , 2: cc.p(60, 40)
                , 3: cc.p(40, 28)//左
                , 4: cc.p(40, 28)
                , 5: cc.p(40, 28)
                , 6: cc.p(40, 28)
                , 7: cc.p(40, 28)
                , 8: cc.p(40, 28)
                , 9: cc.p(40, 28)
            }
        }
        , ltqpVoicePos: {
            3: {
                0: cc.p(40, 28)
                , 1: cc.p(37, 28)
                , 2: cc.p(42, 40)
                , 3: cc.p(58, 40)
            },
            5: {
                1: cc.p(37, 28)
                , 2: cc.p(42, 40)
                , 3: cc.p(58, 30)
                , 4: cc.p(58, 30)
                , 5: cc.p(37, 28)
            },
            9: {
                1: cc.p(37, 28)//右
                , 2: cc.p(50, 40)
                , 3: cc.p(50, 28)//左
                , 4: cc.p(50, 28)
                , 5: cc.p(50, 28)
                , 6: cc.p(50, 28)
                , 7: cc.p(37, 28)
                , 8: cc.p(37, 28)
                , 9: cc.p(37, 28)
            }
        }
        , ltqpEmojiSize: {}
        , ltqpTextDelta: {
            3: {
                0: cc.p(0, -4)
                , 1: cc.p(-7, 2)
                , 2: cc.p(-1, 7)
                , 3: cc.p(3, 5)
            },
            5: {
                1: cc.p(-7, 2)
                , 2: cc.p(-1, 7)
                , 3: cc.p(3, 5)
                , 4: cc.p(3, 5)
                , 5: cc.p(-7, 2)
            },
            9: {
                1: cc.p(-7, 2)//右
                , 2: cc.p(-1, 7)
                , 3: cc.p(3, 5)//左
                , 4: cc.p(3, 5)
                , 5: cc.p(3, 5)
                , 6: cc.p(3, 5)
                , 7: cc.p(-7, 2)
                , 8: cc.p(-7, 2)
                , 9: cc.p(-7, 2)
            }
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

    var turnRow = null;


    var isReplay = null;

    var forRows = null;

    var laiziValue = [];
    var resultTypes = [];

    var isInitShipin = false;
    var fapaiLayer = null;
    var selfCurrentBtnStates = {};
    var isCuopaiOps = false;

    var clearVars = function () {
        roomState = null;
        mapId = gameData.mapId;
        playerNum = 5;
        rowBegin = 1;
        isCCSLoadFinished = false;
        uid2position = {};
        uid2playerInfo = {};
        position2uid = {};
        position2sex = {};
        position2playerArrIdx = {};
        turnRow = null;
        isReplay = null;
        forRows = null;

        isInitShipin = false;
        fapaiLayer = null;
        isCuopaiOps = false;
    };

    var MaLayer_zjh = cc.Layer.extend({
        chatLayer: null,
        chiLayer: null,
        throwDiceLayer: null,
        kaigangLayer: null,
        beforeOnCCSLoadFinish: null,
        afterGameStart: null,
        interval: null,
        content: null,

        updateCardStatusZJH: function (row, status) {

            var cardStatusSp = $('playerLayer.node.row' + row + 'b.status');

            if (!cardStatusSp || cardStatusSp == null || cardStatusSp == undefined)
                return;

            if (cardStatusSp && !cc.sys.isObjectValid(cardStatusSp))
                return;

            if (!status || !TEXTURE_STATUS[status]) {

                if (cardStatusSp && cc.sys.isObjectValid(cardStatusSp))
                    cardStatusSp.setVisible(false);

            } else {

                if (row == 2) {

                    if (cardStatusSp && cc.sys.isObjectValid(cardStatusSp))
                        cardStatusSp.setVisible(true);

                    if (cardStatusSp && cc.sys.isObjectValid(cardStatusSp))
                        cardStatusSp.setTexture(TEXTURE_SELF_STATUS[status]);

                } else {

                    if (cardStatusSp && cc.sys.isObjectValid(cardStatusSp))
                        cardStatusSp.setVisible(true);

                    if (cardStatusSp && cc.sys.isObjectValid(cardStatusSp))
                        cardStatusSp.setTexture(TEXTURE_STATUS[status]);

                }

            }
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        getRootNode: function () {
            return this.getChildByName("Scene");
        },
        initExtraMapData: function (data) {
            var that = this;
        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if(subArr)  sub = subArr['psz'];

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
        onCCSLoadFinish: function(){
            var that = this;

            $ = create$(this.getRootNode());

            var playerLayer = $('playerLayer');
            playerLayer.onCCSLoadFinish = function () {
                that.onPlayerCCSLoadFinish();
            }
            if (!this.isNinePlayer()) {
                playerNum = 5;
                loadCCSTo(res.ZJHPlayer_json, playerLayer, "node");
            } else {
                playerNum = 9;
                loadCCSTo(res.ZJHNinePlayer_json, playerLayer, "node");
            }
        },
        initChatPop: function(){
            for(var i=1;i<=playerNum;i++){
                var e = $('playerLayer.node.effectemoji' + i);
                var effectemoji = duplicateOnlyNewLayer(e);
                effectemoji.setPosition(e.getPosition());
                effectemoji.setLocalZOrder(100);
                effectemoji.setName('effectemoji' + i);
                this.addChild(effectemoji);
            }
        },
        initPaiBox: function(){
            for(var i=0;i<17;i++){
                var card = duplicateSprite($('pai_box.pai'));
                card.setPositionY($('pai_box.pai').getPositionY() - (i+1) * 2);
                card.setRotation(90);
                $('pai_box').addChild(card);
            }
            $('pai_box.pai_box_ban').setLocalZOrder(1);
            $('pai_box').setVisible(false);
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
                        data.scene = 'psz';
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
        onPlayerCCSLoadFinish: function () {
            var that = this;

            // getLocationInfo();

            this.getPai = this.getPai();
            this.addUsedPai = this.addUsedPai();
            this.countDown = this.countDown();

            this.calcPosConf();
            mRoom.voiceMap = {};


            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1) {
                EFFECT_EMOJI_NEW.init(this, $);
            }else{
                EFFECT_EMOJI.init(this, $);
            }

            MicLayer.init($('btn_mic'), this);

            this.getVersion();
            this.initChatPop();
            this.initPaiBox();

            this.initClubAssistant();

            $("btn_list_bg").setLocalZOrder(999);

            if (isReconnect) {
                gameData.zhuangUid = data["zhuang_uid"];
                gameData.leftRound = data["left_round"];
                gameData.totalRound = data["total_round"];
                gameData.wanfaDesp = data["desp"];
                gameData.shipin = data['shipin'] || 0;
                gameData.players = data['players'];
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
            else {
                this.setRoomState(ROOM_STATE_CREATED);
            }

            //this.initWanfa();

            this.clearTable4StartGame(isReconnect, isReconnect, data);

            this.startTime();

            this.startSignal();

            TouchUtils.setOnclickListener($('bg'), function () {
                that.onListBtnAni(true);
            },{effect: TouchUtils.effects.NONE, sound:'no'});
            TouchUtils.setOnclickListener($('chat'), function () {
                // if (!that.chatLayer) {
                //     that.chatLayer = new ChatLayer();
                //     that.chatLayer.retain();
                // }
                that.addChild(new ChatLayer());
            });
            TouchUtils.setOnclickListener($('btn_help'), function () {
                that.addChild(new WanfaLayer_zjh(gameData.wanfaDesp, 'zjh'));
            });
            // $('btn_help').setVisible(false);//gameData.wanfaDesp
            $('lb_wanfa').setVisible(false);

            TouchUtils.setOnclickListener($("btn_zhunbei"), function () {
                network.send(3004, {room_id: gameData.roomId});
                $("btn_zhunbei").setVisible(false);

                //清理动画
                for(var i=0;i<10;i++){
                    var spNode = that.getChildByName('spNode' + i);
                    if(spNode){
                        spNode.setVisible(false);
                    }
                }
            });

            TouchUtils.setTouchRect($("kan"), cc.rect(0, -40, 400, 80+80));//400 80
            TouchUtils.setOnclickListener($("kan"), function () {
                if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 5});
                $('kan').setVisible(false);
                // that.setBtnEnableState('ops.kan',false);
            }, {effect: TouchUtils.effects.NONE});

            TouchUtils.setOnclickListener($('jia.jiabg'), function () {

            }, {effect: TouchUtils.effects.NONE});

            TouchUtils.setOnclickListener($("btn_copy"), function () {
                // if (!cc.sys.isNative)
                //     return;
                var title = gameData.companyName+"拼三张-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = gameData.companyName+"拼三张-" + gameData.wanfaDesp + gameData.shareUrl + '?roomid=' + gameData.roomId;

                console.log(title + "\n" + content);
                var shareurl = getShareUrl(gameData.roomId);
                savePasteBoard(title + "\n" + content + "\n" + shareurl);
                alert1("复制成功");
            });
            TouchUtils.setOnclickListener($("btn_invite"), function () {
                // if (!cc.sys.isNative)
                //     return;
                var title = gameData.companyName+"拼三张-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = gameData.wanfaDesp;
                var shareurl = getShareUrl(gameData.roomId);
                console.log(shareurl);
                WXUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);
            });
            TouchUtils.setOnclickListener($("btn_inviteXianLiao"), function () {
                // if (!cc.sys.isNative)
                //     return;
                var title = gameData.companyName+"拼三张-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = gameData.companyName+"拼三张-" + gameData.wanfaDesp;

                XianLiaoUtils.shareGame(gameData.roomId, title, content, 0, getCurTimestamp() + gameData.uid);

            });
            TouchUtils.setOnclickListener($("btn_inviteLiaobei"), function () {
                // if (!cc.sys.isNative)
                //     return;
                var title = gameData.companyName+"拼三张-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                var content = gameData.wanfaDesp;
                var shareurl = getShareUrl(gameData.roomId);
                LBUtils.shareUrl(shareurl, title, content, 0, getCurTimestamp() + gameData.uid);

            });


            TouchUtils.setOnclickListener($("location_btn"), function () {
                if (position2playerArrIdx[1] >= gameData.players.length)
                    return;
                that.addChild(new PlayerLocationInfoLayer(position2playerArrIdx, 1));
            });

            TouchUtils.setOnclickListener($("btn_list_bg.location2_btn"), function () {

                // that.showPlayerInfoPanel(1);
                if (position2playerArrIdx[1] >= gameData.players.length)
                    return;


                that.addChild(new PlayerLocationInfoLayer(position2playerArrIdx, 1));
            });
            if(that.isNinePlayer()){
                // this.disableBtn("btn_list_bg.location2_btn");
                $("btn_list_bg.location2_btn").setVisible(false);
                $("location_btn").setVisible(false);
            }

            for(var i=1;i<=playerNum;i++){
                (function(row){
                    if($("playerLayer.node.info" + row)) {
                        TouchUtils.setOnclickListener($("playerLayer.node.info" + row), function () {
                            that.showPlayerInfoPanel(row);
                        });
                    }
                })(i)
            }
            // TouchUtils.setOnclickListener($("playerLayer.node.info1"), function () {
            //     that.showPlayerInfoPanel(1);
            // });
            //
            // TouchUtils.setOnclickListener($("playerLayer.node.info2"), function () {
            //     that.showPlayerInfoPanel(2);
            // });
            // TouchUtils.setOnclickListener($("playerLayer.node.info3"), function () {
            //     that.showPlayerInfoPanel(3);
            // });
            //
            // TouchUtils.setOnclickListener($("playerLayer.node.info4"), function () {
            //     that.showPlayerInfoPanel(4);
            // });
            // TouchUtils.setOnclickListener($("playerLayer.node.info5"), function () {
            //     that.showPlayerInfoPanel(5);
            // });

            TouchUtils.setOnclickListener($('btn_fanhui'), function () {
                if (window.inReview)
                    network.send(3003, {room_id: gameData.roomId});
                else {
                    if(that.getRoomState()==ROOM_STATE_CREATED){
                        if (gameData.uid != gameData.ownerUid || gameData.clubCreater) {
                            alert2('确定要退出房间吗?', function () {
                                network.send(3003, {room_id: gameData.roomId});
                            }, null, false, true, true);
                        }else{
                            alert2('解散房间不扣房卡，是否确定解散？', function () {
                                network.send(3003, {room_id: gameData.roomId});
                            }, null, false, false, true, true);
                        }
                    }else{
                        alert2('确定要申请解散房间吗?', function () {
                            network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                        }, null, false, true, true);
                    }
                }
            });

            TouchUtils.setOnclickListener($('btn_jiesan'), function () {
                if (window.inReview)
                    network.send(3003, {room_id: gameData.roomId});
                else
                    alert2('解散房间不扣房卡，是否确定解散？', function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, false, true, true);
            });

            TouchUtils.setOnclickListener($('btn_begin'), function () {
                if(that.assistant)  that.assistant.setVisible(false);
                network.send(3005, {room_id: gameData.roomId});
            });


            TouchUtils.setOnclickListener($('btn_list_bg.setting'), function () {
                // var settingsLayer = new SettingsLayer('申请解散房间', function () {
                // });
                // that.addChild(settingsLayer);

                var setting = HUD.showLayer(HUD_LIST.Settings, that, false, true);
                setting.setSetting(that, "zjh");//大厅里面打开界面
                setting.setSettingLayerType({hidejiesan: that});
            });
            TouchUtils.setOnclickListener($('btn_list_bg.btn_exit'), function () {
                //观看 直接退出房间
                if(gameData.myGameStatus == PLAYER_STATE_WATCHING){
                    alert2('确定要退出房间吗?', function () {
                        network.send(3003, {room_id: gameData.roomId});
                    }, null, false, true, true);
                    return;
                }

                alert2('确定要申请解散房间吗?', function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                }, null, false, true, true);
            });
            TouchUtils.setOnclickListener($('btn_list'), function () {
                that.onListBtnAni();
            });
            //坐下按钮
            TouchUtils.setOnclickListener($('btn_sitdown'), function () {
                $('btn_sitdown').setVisible(false);
                network.send(3002, {
                    room_id: '' + gameData.roomId,
                    sit_down: true
                });
            });
            //跟到底  4510
            var check = $("ops.alwaysfollow.check");
            check.setSelected(false);
            TouchUtils.setOnclickListener($("ops.alwaysfollow"), function () {
                g_gendaodi = !check.isSelected();
                check.setSelected(g_gendaodi);
                playEffect('vgendaodi', gameData.sex);

                if(g_gendaodi)  that.disableOpsBtns('ops.alwaysfollow');
                else  that.disableOpsBtns(['ops.qi', 'ops.bi', 'ops.jia', 'ops.gen', 'ops.kan', 'ops.alwaysfollow']);
                //是自己的turn  发消息
                console.log("点击了跟到底" + g_gendaodi + turnRow);
                if(turnRow == 2 && g_gendaodi) {
                    if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 2});
                    that.disableOpsBtns('ops.alwaysfollow');
                }
            });
            //押满
            TouchUtils.setOnclickListener($("ops.yaman"), function () {
                alert2('确定要押满吗?', function () {
                    network.send(4513, {room_id: gameData.roomId});
                }, null, false, true, true);
            });
            network.addListener(4513, function (data) {
                var from_uid = data['from_uid'];
                var row = uid2position[from_uid];

                $('playerLayer.node.info' + row + '.minexia.yixianum').setString(data['has_xia']);
                $('top_panel.chipnum').setString(data['total_chip']);
                data['yachip'] = that.dealChips([data['yachip']]);
                // console.log(data['yachip']);
                if(data['yachip'] && data['yachip'].length>0) {
                    for (var i = 0; i < data['yachip'].length; i++) {
                        that.throwCMAnim(row, data['yachip'][i]);
                    }
                }
                that.huoYanAni(row, true);

                var transparent = $("transparent");
                transparent.setVisible(true);
                transparent.removeAllChildren();
                var yaman = new sp.SkeletonAnimation('res/submodules/psz/image/PkScene_zjh/yaman.json',
                    'res/submodules/psz/image/PkScene_zjh/yaman.atlas');
                transparent.addChild(yaman);
                yaman.addAnimation(0, 'animation', false);

                playEffect('vyaman', position2sex[row]);

                //如果胜利了  失败了
                if(data['lost_uid'] && data['win_uid']){
                    if (!isReplay) {
                        network.stop();
                        $('choose_player_bi').setVisible(false);
                        $('ops.qi').setVisible(true);
                        $('ops.gen').setVisible(true);
                        $('ops.jia').setVisible(true);
                        $("ops.bi").setVisible(true);
                        $("ops.kan").setVisible(true);
                        $("ops.alwaysfollow").setVisible(true);
                        $("ops.canclebi").setVisible(false);
                        TouchUtils.removeListeners($('ops.shield'));
                    }
                    that.scheduleOnce(function(){
                        playEffect('vcompare_bg');
                        playEffect('vcompare', position2sex[row]);
                        that.biPaiAnim(row, uid2position[data['win_uid']], uid2position[data['lost_uid']], function () {
                            network.start();
                            if (isReplay) {
                                $('playerLayer.node.row' + uid2position[data['lost_uid']]).setVisible(false);
                                $('playerLayer.node.row' + uid2position[data['lost_uid']] + 'b').setVisible(true);
                                $('playerLayer.node.row' + uid2position[data['lost_uid']] + 'b.b0').setVisible(true);
                                $('playerLayer.node.row' + uid2position[data['lost_uid']] + 'b.b1').setVisible(true);
                                $('playerLayer.node.row' + uid2position[data['lost_uid']] + 'b.b2').setVisible(true);
                                that.updateCardStatusZJH(uid2position[data['lost_uid']], 'shu');
                            }
                            for (var i = 0; i < 3; i++) {
                                $('playerLayer.node.row' + uid2position[data['lost_uid']] + 'b.b' + i).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backold.png');
                            }
                            if (!isReplay) {
                                if (uid2position[data['lost_uid']] != 2) {
                                    $('playerLayer.node.row' + uid2position[data['lost_uid']] + '.a0').setVisible(false);
                                    $('playerLayer.node.row' + uid2position[data['lost_uid']] + '.a1').setVisible(false);
                                    $('playerLayer.node.row' + uid2position[data['lost_uid']] + '.a2').setVisible(false);
                                    $('playerLayer.node.row' + uid2position[data['lost_uid']] + '.cardtype').setVisible(false);
                                    that.updateCardStatusZJH(uid2position[data['lost_uid']], 'shu');
                                }

                                //比牌输的  一直跟置灰
                                if(data['lost_uid'] == gameData.uid)  that.disableBtn('ops.alwaysfollow');
                                var delay = 0;
                                if (data.card_type && data.card_type != '' && data.card_type != "0") {
                                    $('playerLayer.node.row2.cardtype').setVisible(true);
                                    $('playerLayer.node.row2.cardtype').loadTexture('res/submodules/psz/image/PkScene_zjh/cardtype' + data.card_type + '.png');
                                }
                                if (uid2position[data['lost_uid']] == 2) {
                                    // setTimeout(function () {
                                    $('playerLayer.node.row2b').setVisible(true);
                                    for (var i = 0; i < 3; i++) {
                                        $('playerLayer.node.row2b.b' + i).setVisible(!g_kanpai || gameData.myGameStatus == PLAYER_STATE_WATCHING);
                                    }
                                    that.updateCardStatusZJH(2, 'shu');
                                }
                            }
                            if (isReplay && that.operateFinishCb) {
                                that.operateFinishCb();
                            }
                        });
                    }, 1);
                }else{
                    if (isReplay && that.operateFinishCb) {
                        that.operateFinishCb();
                    }
                }
            });
            // this.changeVoice();
            network.addListener(4510, function (data) {
                var gendaodi = data['gendaodi'];
                check.setSelected(gendaodi);
            });
            network.addListener(3002, function (data, errorCode) {
                if(errorCode == -20){
                    HUD.showScene(HUD_LIST.Home, null);
                }
                if(data['msg']){
                    HUD.showMessage(data['msg']);
                    return;
                }
                gameData.last3002 = data;
                if (isReplay) {
                    gameData.wanfaDesp = data['desp'];
                    mapId = gameData.mapId = data["map_id"];
                    var wanfa = $("word_wanfa_" + gameData.mapId);
                    if (wanfa)
                        wanfa.setVisible(true);
                }
                if (that.getRoomState() == ROOM_STATE_CREATED) {
                    gameData.ownerUid = data["owner"];
                    gameData.players = data['players'];
                    that.onPlayerEnterExit();
                }else if(that.getRoomState() == ROOM_STATE_ONGOING || that.getRoomState() == ROOM_STATE_ENDED){
                    //开始后中途加入
                    gameData.ownerUid = data["owner"];
                    gameData.players = data['players'];
                    that.onPlayerEnterExit(that.inArrayPos);
                }
                gameData.daikaiPlayer = data['daikai_player'];
                gameData.clubCreater = data['is_club'];
                pokerRule.changeAvailableCardTypes(gameData.mapId);
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
                    }else{
                        alert1("房主已解散房间", function () {
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
            //中途加入  3006
            network.addListener(3006, function (_data) {
                data = _data;
                isReconnect = !!_data;
                isReplay = false;

                gameData.zhuangUid = data["zhuang_uid"];
                gameData.leftRound = data["left_round"];
                gameData.totalRound = data["total_round"];
                gameData.wanfaDesp = data["desp"];
                gameData.shipin = data['shipin'] || 0;

                gameData.leftRound = data['left_round'];
                gameData.totalRound = data['total_round'];
                $("timer2.Text_5").setString(gameData.leftRound);

                var status = data["room_status"] || ROOM_STATE_ONGOING;
                if (status == ROOM_STATE_ENDED) {
                    that.setRoomState(ROOM_STATE_ONGOING);
                    that.setRoomState(ROOM_STATE_ENDED);
                }
                else {
                    that.setRoomState(status);
                }

                that.clearTable4StartGame(isReconnect, isReconnect, data,
                    (that.getRoomState() == ROOM_STATE_ONGOING || that.getRoomState() == ROOM_STATE_ENDED) ? that.inArrayPos : null);
            });
            network.addListener(3007, function (data) {
                var map = data['map'];
                for(var uid in map){
                    var loc = map[uid]['loc'];
                    var locCN = map[uid]['locCN'];
                    if(uid && uid2position[uid] >= 0){
                        // gameData.players[position2playerArrIdx[uid2position[uid]]]['loc'] = loc;
                        // gameData.players[position2playerArrIdx[uid2position[uid]]]['locCN'] = locCN;
                        var _p = gameData.getPlayerInfoByUid(uid);
                        if(_p){
                            _p['loc'] = loc;
                            _p['locCN'] = locCN;
                        }
                    }
                }
            });
            network.addListener(3004, function (data) {
                if (that.getRoomState() != ROOM_STATE_ENDED || !data)
                    return;
                var uid = data["uid"];
                that.setReady(uid);
            });
            network.addListener(3013, function (data) {
                gameData.numOfCards = data["numof_cards"];
            });
            network.addListener(3005, function (data) {
                if(that.assistant)  that.assistant.setVisible(false);
            });
            network.addListener(3008, function (data) {
                var uid = data["uid"];
                var type = data["type"];
                var voice = data["voice"];
                var content = decodeURIComponent(data["content"]);
                that.showChat(uid2position[uid], type, content, voice, uid);
            });
            network.addListener(3009, function (data) {
                if(data["arr"] == null || data["arr"] == undefined || data["arr"] == '' || (data["arr"] && data["arr"].length == 0)){
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

                    that.scheduleOnce(function(){
                        var tipLayer = HUD.getTipLayer();
                        if(tipLayer){
                            var MessageBox = tipLayer.getChildByName('MessageBox');
                            if(MessageBox)  MessageBox.removeFromParent();
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
                    var byUserId = data['arr'][0].uid;

                    var shenqingjiesanLayer = $("shenqingjiesan", that);
                    if (!shenqingjiesanLayer) {
                        shenqingjiesanLayer = new ShenqingjiesanLayer();
                        shenqingjiesanLayer.setName("shenqingjiesan");
                        that.addChild(shenqingjiesanLayer);
                    }
                    shenqingjiesanLayer.setArrMajiang(leftSeconds, arr, byUserId,data,
                        (gameData.myGameStatus == PLAYER_STATE_WATCHING));
                }
            });
            network.addListener(4500, function (data) {
                if($("btn_zhunbei"))  $("btn_zhunbei").setVisible(false);
                var uid = data["uid"];
                var row = uid2position[uid];

                that.ZJHthrowTurn(row, data);
            });

            network.addListener(3502, function (data) {
                console.log("3502===true");
                if($('btn_begin'))  $('btn_begin').setVisible(true);
                // lightButton($('btn_begin'), 0, 0, res.Btn_StartGame_stencil_png);
            });
            network.addListener(4503, function (data) {
                if(!$("btn_zhunbei")){
                    return;
                }
                $("btn_zhunbei").setVisible(false);
                $('top_panel.chipnum').setString(data['total_chip']);
                var uid = data["uid"];
                var arr = data["pai_arr"];
                var op = data['op'];
                var cardtype = data['card_type'];
                // NONE, QI, GEN, JIA, BI, KAN
                // var NONE = op[0];
                var QI = op[0];
                var GEN = op[1];
                var JIA = op[2];
                var BI = op[3];
                var KAN = op[4];
                var row = uid2position[data.from_uid];
                if(!row){
                    return;
                }
                // if (row == 2) {
                //     if (!data['has_xia']) {
                //         $('top_panel_mine').setVisible(false);
                //     } else {
                //         $('top_panel_mine').setVisible(true);
                //         $('top_panel_mine.yixianum').setString(data['has_xia']);
                //     }
                // }
                if (!data['has_xia']) {
                    $('playerLayer.node.info' + row + '.minexia').setVisible(false);
                }else{
                    $('playerLayer.node.info' + row + '.minexia').setVisible(true);
                    $('playerLayer.node.info' + row + '.minexia.yixianum').setString(data['has_xia']);
                }
                if (!isReplay) {
                    if (row == 2) {
                        if (cardtype && cardtype != '' ) {
                            $('playerLayer.node.row2.cardtype').setVisible(true);
                            $('playerLayer.node.row2.cardtype').loadTexture('res/submodules/psz/image/PkScene_zjh/cardtype' + cardtype + '.png');
                        } else {
                            $('playerLayer.node.row2.cardtype').setVisible(false);
                        }
                    }
                    console.log("4503 ===" + row + "==="+data['kan']);
                    $('kan').setVisible(!!data['kan']);
                    if(gameData.myGameStatus == PLAYER_STATE_SITDOWN || gameData.myGameStatus == PLAYER_STATE_WATCHING){
                        $('kan').setVisible(false);
                    }
                }else{
                    console.log("replay=kan -------===" + row + "4503==="+data['kan']);
                }
                if (QI) {
                    //扔牌动画
                    if (!isReplay && gameData.myGameStatus != PLAYER_STATE_WATCHING) {
                        if (row == 2) {
                            $('kan').setVisible(false);
                            // that.setBtnEnableState('ops.kan',false);
                            $('jia').setVisible(false);
                            var delay = that.checkPaiAnim(2, arr) ? 1000 : 0;
                            setTimeout(function () {
                                $('playerLayer.node.row' + row + 'b').setVisible(true);
                                for (var i = 0; i < 3; i++) {
                                    $('playerLayer.node.row' + row + 'b.b' + i).setVisible(false);
                                }
                                that.updateCardStatusZJH(row, 'qi');
                            }, delay);
                        } else {
                            $('playerLayer.node.row' + row + '.a0').setVisible(false);
                            $('playerLayer.node.row' + row + '.a1').setVisible(false);
                            $('playerLayer.node.row' + row + '.a2').setVisible(false);
                            $('playerLayer.node.row' + row + '.cardtype').setVisible(false);
                            that.updateCardStatusZJH(row, 'qi');
                        }
                    } else if(isReplay || gameData.myGameStatus == PLAYER_STATE_WATCHING){
                        $('playerLayer.node.row' + row).setVisible(false);
                        $('playerLayer.node.row' + row + 'b').setVisible(true);
                        $('playerLayer.node.row' + row + 'b.b0').setVisible(true);
                        $('playerLayer.node.row' + row + 'b.b1').setVisible(true);
                        $('playerLayer.node.row' + row + 'b.b2').setVisible(true);
                        that.updateCardStatusZJH(row, 'qi');
                    }
                    playEffect('vgive_up_bg');
                    playEffect('vgive_up', position2sex[row]);
                    for (var i = 0; i < 3; i++) {
                        $('playerLayer.node.row' + row + 'b.b' + i).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backhui.png');
                    }
                    that.wordsFly(row, '弃拍');
                }
                if (GEN) {
                    //筹码动画
                    playEffect('vfollow_chip_bg');
                    var idx = 0;
                    if (that.gen_round && that.gen_round > 1) {
                        idx = Math.floor(Math.random() * 2) + 1;
                    }
                    playEffect('vfollow_chip' + idx, position2sex[row]);
                    that.throwCMAnim(row, data['needchip']);
                    that.wordsFly(row, '跟注' + data['needchip']);
                }
                if (JIA) {
                    //筹码动画
                    playEffect('vadd_chip_bg');
                    playEffect('vadd_chip', position2sex[row]);
                    that.throwCMAnim(row, data['needchip']);
                    that.wordsFly(row, '加注' + data['needchip']);
                    if (!isReplay) {
                        $('ops.gen.txt').setString(''+data.genchip);//('跟注x' + data.genchip);
                        $('ops.bi.txt').setString(''+(data.genchip*that.getBipaiRate()));
                        $('ops.alwaysfollow.txt').setString(''+data.genchip);
                    }
                }
                if (BI) {
                    data['zhu_shu'] = data['zhu_shu'] || 1;
                    for (var i = 0; i < data['zhu_shu']; i++) {
                        that.throwCMAnim(row, data['needchip']);
                    }
                    if (!isReplay) {
                        network.stop();
                        for (var i = 1; i < (playerNum + 1); i++) {
                            //头像变正常
                            // if ($('playerLayer.node.info' + i + '.head_bg_anmi').isVisible()) {
                            //     $('playerLayer.node.info' + i + '.head_bg_anmi').stopAllActions();
                            //     $('playerLayer.node.info' + i + '.head_bg_anmi').setVisible(false);
                            // }
                            // (function (idx) {
                            //     TouchUtils.setOnclickListener($('playerLayer.node.info' + idx), function () {
                            //         that.showPlayerInfoPanel(idx);
                            //     });
                            // })(i);
                            if($('playerLayer.node.row'+i+'b.bi_rect_sp')){
                                $('playerLayer.node.row'+i+'b.bi_rect_sp').setVisible(false);
                                $('playerLayer.node.row'+i+'b.bi_rect_sp').removeAllChildren();
                                TouchUtils.removeListeners($('playerLayer.node.row'+i+'b.bi_rect_sp'));
                            }
                        }
                        $('choose_player_bi').setVisible(false);
                        $('ops.qi').setVisible(true);
                        $('ops.gen').setVisible(true);
                        $('ops.jia').setVisible(true);
                        $("ops.bi").setVisible(true);
                        $("ops.kan").setVisible(true);
                        $("ops.alwaysfollow").setVisible(true);
                        $("ops.canclebi").setVisible(false);
                        TouchUtils.removeListeners($('ops.shield'));
                    }
                    playEffect('vcompare_bg');
                    playEffect('vcompare', position2sex[row]);
                    that.biPaiAnim(row, uid2position[data['win_uid']], uid2position[data['lose_uid']], function () {
                        network.start();
                        if (isReplay) {
                            $('playerLayer.node.row' + uid2position[data['lose_uid']]).setVisible(false);
                            $('playerLayer.node.row' + uid2position[data['lose_uid']] + 'b').setVisible(true);
                            $('playerLayer.node.row' + uid2position[data['lose_uid']] + 'b.b0').setVisible(true);
                            $('playerLayer.node.row' + uid2position[data['lose_uid']] + 'b.b1').setVisible(true);
                            $('playerLayer.node.row' + uid2position[data['lose_uid']] + 'b.b2').setVisible(true);
                            that.updateCardStatusZJH(uid2position[data['lose_uid']], 'shu');
                        }
                        for (var i = 0; i < 3; i++) {
                            $('playerLayer.node.row' + uid2position[data['lose_uid']] + 'b.b' + i).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backold.png');
                        }
                        if (!isReplay) {
                            if (uid2position[data['lose_uid']] != 2) {
                                $('playerLayer.node.row' + uid2position[data['lose_uid']] + '.a0').setVisible(false);
                                $('playerLayer.node.row' + uid2position[data['lose_uid']] + '.a1').setVisible(false);
                                $('playerLayer.node.row' + uid2position[data['lose_uid']] + '.a2').setVisible(false);
                                $('playerLayer.node.row' + uid2position[data['lose_uid']] + '.cardtype').setVisible(false);
                                that.updateCardStatusZJH(uid2position[data['lose_uid']], 'shu');
                            }

                            //比牌输的  一直跟置灰
                            if(data['lose_uid'] == gameData.uid)  that.disableBtn('ops.alwaysfollow');
                            // if (_.isArray(data['pai_arr']) && data['pai_arr'].length > 0) {
                            //比牌  自己未看的牌  不翻开
                            // var delay = that.checkPaiAnim(2, data['pai_arr']) ? 1000 : 0;
                            var delay = 0;
                            if (data.card_type && data.card_type != '' && data.card_type != "0") {
                                $('playerLayer.node.row2.cardtype').setVisible(true);
                                $('playerLayer.node.row2.cardtype').loadTexture('res/submodules/psz/image/PkScene_zjh/cardtype' + data.card_type + '.png');
                            }
                            if (uid2position[data['lose_uid']] == 2) {
                                // setTimeout(function () {
                                $('playerLayer.node.row2b').setVisible(true);
                                for (var i = 0; i < 3; i++) {
                                    $('playerLayer.node.row2b.b' + i).setVisible(!g_kanpai || gameData.myGameStatus == PLAYER_STATE_WATCHING);
                                }
                                that.updateCardStatusZJH(2, 'shu');
                                // }, delay);
                            }
                            // }

                            //比牌赢得玩家 可能会显示 压满
                            if(data['win_uid'] == gameData.uid && data['canYaMan'] == 0){
                                //压满
                                that.setYaman(data['canYaMan'], false, row == 2, data['yaManChip']);
                            }
                        }
                        if (isReplay && that.operateFinishCb) {
                            that.operateFinishCb();
                        }
                    });
                }
                if (KAN) {
                    if (!isReplay && row == 2) {
                        g_kanpai = true;

                        //看牌  一直跟  取消
                        var check = $("ops.alwaysfollow.check");
                        check.setSelected(false);
                        g_gendaodi = false;
                        //压满 *2
                        if($('ops.yaman') && $('ops.yaman').isVisible()){
                            var num = $('ops.yaman.txt').getString();
                            if(num > 0)  $('ops.yaman.txt').setString(num*2);
                        }

                        var kanpaiFunc = function () {
                            network.start();
                            that.checkPaiAnim(2, arr);
                            // for (var k = 2; k <= 5; k++) {
                            //     $('jia.jia' + k + '.txt').setString('x ' + (2 * k));
                            // }
                            that.jiaBtnTextureShow(2);
                            $('ops.gen.txt').setString(''+data.needchip);//('跟注x' + data['needchip'])
                            $('ops.bi.txt').setString(''+(data.needchip*that.getBipaiRate()));
                            $('ops.alwaysfollow.txt').setString(''+data.needchip);
                        }
                        if(isCuopaiOps && gameData.myGameStatus == PLAYER_STATE_PLAYING && arr && arr.length > 0){
                            network.stop();
                            that.addChild(new CuoPaiLayer_zjh('zjh', arr, null, kanpaiFunc));
                        }else{
                            kanpaiFunc();
                        }
                        if(gameData.myGameStatus == PLAYER_STATE_WATCHING){
                            $('playerLayer.node.row' + row + 'b').setVisible(true);
                            $('playerLayer.node.row' + row + 'b.b0').setVisible(true);
                            $('playerLayer.node.row' + row + 'b.b1').setVisible(true);
                            $('playerLayer.node.row' + row + 'b.b2').setVisible(true);
                            that.updateCardStatusZJH(row, 'kan');
                        }
                    }

                    if (row != 2) {
                        playEffect('vlook_card_bg');
                        playEffect('vlook_card', position2sex[row]);
                        that.wordsFly(row, '看牌');
                        that.updateCardStatusZJH(row, 'kan');
                    }
                    if (isReplay) {
                        $('playerLayer.node.row' + row + 'b').setVisible(true);
                        $('playerLayer.node.row' + row + 'b.b0').setVisible(false);
                        $('playerLayer.node.row' + row + 'b.b1').setVisible(false);
                        $('playerLayer.node.row' + row + 'b.b2').setVisible(false);
                        that.updateCardStatusZJH(row, 'kan');
                    }
                    that.wordsFly(row, '看牌');
                    if(row == 2){
                        selfCurrentBtnStates['kan']=false;
                    }
                }
                if (isReplay && !BI && that.operateFinishCb) {
                    that.operateFinishCb();
                }
                if(isReplay)  $('ops').setVisible(false);
            });
            network.addListener(4504, function (data) {
                $('ops.qi').setVisible(false);
                $('ops.bi').setVisible(false);
                $('ops.gen').setVisible(false);
                $('ops.jia').setVisible(false);
                $("ops.kan").setVisible(false);
                $("ops.alwaysfollow").setVisible(false);
                $('ops.canclebi').setVisible(true);
                TouchUtils.removeListeners($('ops.shield'));
                for (var i = 0; i < data['canbi_arr'].length; i++) {
                    //头像变亮
                    $('choose_player_bi').setVisible(true);
                    var row = uid2position[data['canbi_arr'][i]];
                    if(row > 0) {
                        if (cc.sys.isNative) {
                            var anim = null;
                            if (that.isNinePlayer()) {
                                anim = playSpAnimation('vs1', (row == 1 || row == 7 || row == 8 || row == 9) ? 'kuang2' : 'kuang', true);
                            } else {
                                anim = playSpAnimation('vs1', row == 1 || row == 5 ? 'kuang2' : 'kuang', true);
                            }
                            anim.x = 98;
                            anim.y = 74;
                            $('playerLayer.node.row' + row + 'b.bi_rect_sp').addChild(anim);
                        }
                        $('playerLayer.node.row' + row + 'b.bi_rect_sp').setVisible(true);
                        (function (idx) {
                            TouchUtils.setOnclickListener($('playerLayer.node.row' + uid2position[data['canbi_arr'][idx]] + "b.bi_rect_sp"), function () {
                                if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 4, bi_uid: data['canbi_arr'][idx]});
                            });
                        })(i);
                    }
                }
            });
            network.addListener(3200, function (data) {
                return;
                // that.content = decodeURIComponent(data['content']);
                // var func = function () {
                //     if (!that || !cc.sys.isObjectValid(that)) {
                //         return;
                //     }
                //     var _speaker = $('speaker');
                //     if (_speaker.isVisible()) {
                //         return;
                //     }
                //     _speaker.setVisible(true);
                //     var speakerPanel = $('speaker.panel');
                //     var text = new ccui.Text();
                //     text.setFontSize(26);
                //     text.setColor(cc.color(254, 245, 92));
                //     text.setAnchorPoint(cc.p(0, 0));
                //     text.enableOutline(cc.color(0, 0, 0), 1);
                //     speakerPanel.removeAllChildren();
                //     speakerPanel.addChild(text);
                //     text.setString(that.content);
                //     text.setPositionX(speakerPanel.getContentSize().width);
                //     text.setPositionY((speakerPanel.getContentSize().height - text.getContentSize().height) / 2);
                //     text.runAction(cc.sequence(
                //         cc.moveTo(20, -text.getVirtualRendererSize().width, 0),
                //         cc.callFunc(function () {
                //             $('speaker').setVisible(false);
                //         })
                //     ));
                // };
                // func();
                // if (this.interval == null) {
                //     this.interval = setInterval(func, 25000);
                // }
            });
            network.addListener(4008, function (data) {
                network.start()
                that.setRoomState(ROOM_STATE_ENDED);
                that.jiesuan(data);
            });
            network.addListener(4009, function (data) {
                network.start()
                that.zongJiesuan(data);
                MWUtil.clearRoomId();//用于清空房间id
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
            /**
             * 服务器广播切牌状态
             */
            network.addListener(4110, function (data) {
                //{'code':4111,'data':{'room_id':%d,'qiepai_uid':%d,'pai_index':%d}}
                //{'code':4110,'data':{'room_id':%d,'qiepai_uid':%d}
                // if(data['qiepai_uid']== gameData.uid){
                //     console.log("自己切牌中 ");
                // }else{
                //     console.log("等待别人切牌----");
                // }
                for (var i = 0; i < gameData.players.length; i++) {
                    var player = gameData.players[i];
                    player['player_status'] = PLAYER_STATE_PLAYING;
                }

                $('chipnode').removeAllChildren();
                $('top_panel.chipnum').setString('0');
                if (!isReplay) {
                    for (var i = 1; i < (playerNum + 1); i++) {
                        for (var j = 0; j < 3; j++) {
                            $('playerLayer.node.row' + i + 'b.b' + j).setTexture('res/submodules/psz/image/common/pai_back3.png');
                            $('playerLayer.node.row' + i + 'b.b' + j).setVisible(false);
                        }
                    }
                    gameData.totalRound = data["total_round"];
                }
                gameData.leftRound = data["left_round"];
                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame(true);
                // $('top_panel_mine').setVisible(true);
                // $('top_panel_mine.yixianum').setString(0);
                for (var i = 0; i < gameData.players.length; i++) {
                    var rowid = uid2position[gameData.players[i].uid];
                    $("playerLayer.node.row" + rowid + 'b').setVisible(true);
                    $("playerLayer.node.row" + rowid).setVisible(false);
                    $('playerLayer.node.info'+rowid+'.minexia').setVisible(true);
                    $('playerLayer.node.info'+rowid+'.minexia.yixianum').setString('0');
                }
                for (var i = 1; i < (playerNum + 1); i++) {
                    that.updateCardStatusZJH(i);
                }
                $('kan').setVisible(false);
                // that.setBtnEnableState('ops.kan',false);

                //切牌
                fapaiLayer = fapaiLayer || new FapaiUpdateLayer(
                        that.calcPaisInfo(data),
                        function () {
                            network.start();
                        }
                    );
                $('pai_box').setVisible(false);
                //重新设置发牌动画
                var new_g_paiInfo = that.calcPaisInfo(data);
                fapaiLayer.setPaiData(new_g_paiInfo);
                network.stop([3005, 3002, 3009, 3008, 4111, 4020, 4008, 4009, 3004, 4990]);
                if (!fapaiLayer.getParent()) {
                    that.addChild(fapaiLayer);
                }
                fapaiLayer.wholeProcess(that.calcPaisInfo(data));
            });
            network.addListener(4111, function (data) {
                //{'code':4111,'data':{'room_id':%d,'qiepai_uid':%d,'pai_index':%d}}
                // if(data['qiepai_uid']== gameData.uid){
                //     console.log("自己切牌中 ");
                //     setTimeout(function () {
                //         network.send(4111, {'qiepai_uid':gameData.uid,'pai_index':25});
                //     }, 50);
                // }else{
                //     console.log("等待别人切牌----");
                // }
                if(fapaiLayer){
                    fapaiLayer.choosePaiForCut(data['pai_index']);
                }
            });
            /**
             * 发牌
             */
            network.addListener(4200, function (data) {
                //强制设为  PLAYER_STATE_PLAYING
                var playerInfo = data['player_info'] || [];
                var getStatus = function(player){
                    var uid = player['uid'];
                    for(var k=0;k<playerInfo.length;k++){
                        if(playerInfo[k]['uid'] == uid)  return playerInfo[k]['playerStatus'];
                    }
                    return player['player_status'];
                }
                //发牌的时候如果gameData.players是空的，断线重连
                if(gameData.players == null || gameData.players == undefined){
                    network.disconnect();
                }
                for (var i = 0; i < gameData.players.length; i++) {
                    var player = gameData.players[i];
                    //回放的话  在 player是列表里  就是打牌的  不存在观战
                    if(isReplay){
                        player['player_status'] = PLAYER_STATE_PLAYING;
                        gameData.myGameStatus = PLAYER_STATE_PLAYING;
                    }else {
                        player['player_status'] = getStatus(player);
                        if (player.uid == gameData.uid) {
                            gameData.myGameStatus = player['player_status'];
                        }
                    }
                }

                g_gendaodi = false;
                g_kanpai = false;

                //跟到底  不显示
                var check = $("ops.alwaysfollow.check");
                if(check)  check.setSelected(g_gendaodi);
                that.enableBtn('ops.alwaysfollow');

                $('chipnode').removeAllChildren();
                $('top_panel.chipnum').setString('0');
                if (!isReplay) {
                    for (var i = 1; i < (playerNum + 1); i++) {
                        for (var j = 0; j < 3; j++) {
                            $('playerLayer.node.row' + i + 'b.b' + j).setTexture('res/submodules/psz/image/common/pai_back3.png');
                            $('playerLayer.node.row' + i + 'b.b' + j).setVisible(false);
                        }
                    }
                    gameData.totalRound = data["total_round"];
                }
                gameData.leftRound = data["left_round"];

                that.setRoomState(ROOM_STATE_ONGOING);
                that.clearTable4StartGame(true);
                // $('top_panel_mine').setVisible(true);
                // $('top_panel_mine.yixianum').setString(0);
                for (var i = 0; i < gameData.players.length; i++) {
                    var rowid = uid2position[gameData.players[i].uid];
                    if(gameData.players[i]['player_status'] == PLAYER_STATE_PLAYING || gameData.players[i]['player_status'] == PLAYER_STATE_PREPAREING) {
                        $("playerLayer.node.row" + rowid + 'b').setVisible(true);
                        $("playerLayer.node.row" + rowid).setVisible(false);
                        $('playerLayer.node.info' + rowid + '.minexia').setVisible(true);
                        $('playerLayer.node.info' + rowid + '.minexia.yixianum').setString('0');
                    }

                    //清理上局的火焰特效
                    that.huoYanAni(rowid, false);
                }
                for (var i = 1; i < (playerNum + 1); i++) {
                    that.updateCardStatusZJH(i);
                }

                var fapaiOverCb = function () {
                    //原来函数里面必须执行函数
                    var row_list = [2, 1, 5, 4, 3];
                    if(that.isNinePlayer())  row_list = [2, 1, 9, 8, 7, 6, 5, 4, 3];
                    for (var i = 0; i < gameData.players.length; i++) {
                        // var index = i % playerNum;
                        // if(gameData.myGameStatus == PLAYER_STATE_WATCHING && gameData.players.length < playerNum){
                        //     index = index + 1;
                        // }
                        // var row = row_list[index];
                        var row = uid2position[gameData.players[i].uid];

                        if(gameData.players[i]['player_status'] == PLAYER_STATE_PLAYING) {
                            for (var j = 0; j < 3; j++) {
                                var pai = $('playerLayer.node.row' + row + 'b.b' + j);
                                pai.setVisible(true);
                            }
                        }
                    }

                    // $('top_panel_mine.yixianum').setString(1);
                    for (var i = 0; i < gameData.players.length; i++) {
                        if(gameData.players[i]['player_status'] == PLAYER_STATE_PLAYING) {
                            var throwship = 1;
                            if(gameData.options && gameData.options.difen)  throwship = gameData.options.difen;
                            that.throwCMAnim(uid2position[gameData.players[i].uid], throwship);
                            $('playerLayer.node.info' + uid2position[gameData.players[i].uid] + '.minexia.yixianum').setString(throwship);
                        }
                    }
                    if (!isReplay) {
                        $('ops').setVisible(true);
                        if(gameData.myGameStatus == PLAYER_STATE_WATCHING || gameData.myGameStatus == PLAYER_STATE_SITDOWN){
                            $('ops').setVisible(false);
                        }
                        $('ops.gen.txt').setString('1');//('跟注x1');
                        $('ops.bi.txt').setString('' + that.getBipaiRate());
                        $('ops.alwaysfollow.txt').setString('1');
                    } else {
                        for (var _uid in data.pai_arr) {
                            if (data.pai_arr.hasOwnProperty(_uid) && _uid && _uid != '0') {
                                var _row = uid2position[parseInt(_uid)];
                                if (_row) {
                                    that.checkPaiAnim(_row, data.pai_arr[_uid].pai);
                                    (function (__row, __uid) {
                                        if(data.pai_arr[__uid].cardtype && data.pai_arr[__uid].cardtype!='0'){
                                            $('playerLayer.node.row' + __row + '.cardtype').setVisible(true);
                                            $('playerLayer.node.row' + __row + '.cardtype').loadTexture('res/submodules/psz/image/PkScene_zjh/cardtype' + data.pai_arr[__uid].cardtype + '.png');
                                        }
                                    })(_row, _uid);
                                }
                            }
                        }
                        setTimeout(function () {
                            if (that.operateFinishCb) {
                                that.operateFinishCb();
                            }
                        }, 1000);
                    }
                    network.start();
                }

                $('tip_waitnext').setVisible(gameData.myGameStatus == PLAYER_STATE_SITDOWN);

                if(decodeURIComponent(gameData.wanfaDesp).indexOf('切牌')>=0 || isReplay){
                    fapaiOverCb();
                }else{
                    fapaiLayer = fapaiLayer || new FapaiUpdateLayer(
                            that.calcPaisInfo(data),
                            fapaiOverCb
                        );
                    $('pai_box').setVisible(false);
                    //重新设置发牌动画
                    var new_g_paiInfo = that.calcPaisInfo(data);
                    // console.log(new_g_paiInfo);
                    fapaiLayer.setPaiData(new_g_paiInfo);
                    // network.stop([3008,4020]);
                    network.stop([3005, 3002, 3009, 3008, 4111, 4020, 4008, 4009, 3004, 4990]);
                    if(!fapaiLayer.getParent()){
                        that.addChild(fapaiLayer);
                    }
                    fapaiLayer.sendPai();
                }
            });

            network.start();
            console.log("isCCSLoadFinished");
            isCCSLoadFinished = true;
            playMusic("vbg6");

            pokerRule.changeAvailableCardTypes(gameData.mapId);
            if (isReplay) {
                $("top_panel").setVisible(false);
            }
            if (!isReplay) {
                var wanfa = $("word_wanfa_" + gameData.mapId);
                if (wanfa)
                    wanfa.setVisible(true);
            }
            // $('speaker').setVisible(false);

            that.showFangzhu();
        },
        onListBtnAni:function(hide){
            var view = $('btn_list_bg');
            if(hide){
                if (view.isVisible()) {
                    view.stopAllActions();
                    view.runAction(cc.sequence(cc.scaleTo(0.15, 1, 0).easing(cc.easeOut(3)), cc.callFunc(function () {
                        view.setVisible(false);
                    })));
                }
            }else {
                if (view.isVisible()) {
                    view.stopAllActions();
                    view.runAction(cc.sequence(cc.scaleTo(0.15, 1, 0).easing(cc.easeOut(3)), cc.callFunc(function () {
                        view.setVisible(false);
                    })));
                } else {
                    view.setVisible(true);
                    view.stopAllActions();
                    view.runAction(cc.sequence(cc.scaleTo(0.15, 1, 1).easing(cc.easeIn(3)), cc.callFunc(function () {
                        view.setVisible(true);
                    })));
                }
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
                    x: x-1,
                    y: y-1,
                    width: width+2,
                    height: height+2
                };
            }
            return JSON.stringify(data);
        },
        showFangzhu: function () {
            if (gameData.daikaiPlayer && false) {
                $('fangzhuheader').setVisible(true);
                loadImageToSprite(gameData.daikaiPlayer['headimgurl'], $('fangzhuheader.header'));
                $('fangzhuheader.name').setString(ellipsisStr(gameData.daikaiPlayer['nickname']));
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
            network.removeListeners([
                3002, 3006, 3008,
                4008, 4110, 4500, 4503, 4513,
                4990
            ]);

            // network.removeListeners([
            //     3002, 3003, 3004, 3005, 3008, 3200,
            //     4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200, 4888, 4889, 4890
            // ]);
            if (this.list2103) cc.eventManager.removeListener(this.list2103);
            if (this.list1) cc.eventManager.removeListener(this.list1);
            if (this.list2) cc.eventManager.removeListener(this.list2);

            AgoraUtil.closeVideo();
            cc.Layer.prototype.onExit.call(this);
        },
        //获取玩家状态的数量
        getPlayerNumByStatus: function(status){
            var num = 0;
            var players = gameData.players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.player_status == status) {
                    num++;
                }
            }
            return num;
        },
        //isZtjr是不是中途加入
        onPlayerEnterExit: function (index) {
            if(!$("timer")){
                return;
            }
            var that = this;
            if(!gameData.players){
                return;
            }
            var players = gameData.players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                player.ready = true;
            }
            //排序
            players.sort(function (a, b) {
                return a.pos - b.pos;
            });

            //邀请俱乐部成员
            var currentRound = gameData.totalRound - gameData.leftRound;
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
                if (mRoom.club_id && !(this.getRoomState() == ROOM_STATE_ONGOING || currentRound > 1)) {
                    if(this.assistant)  this.assistant.setVisible(true);
                }
            }

            this.inArrayPos = 0;
            gameData.myGameStatus = PLAYER_STATE_WATCHING;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.uid == gameData.uid) {
                    if (player['player_status'] == PLAYER_STATE_PREPAREING ||
                        player['player_status'] == PLAYER_STATE_PLAYING) this.inArrayPos = i;
                    gameData.location = player.loc;
                    gameData.myGameStatus = player['player_status'];
                    break;
                }
            }
            if (gameData.myGameStatus == PLAYER_STATE_WATCHING) this.inArrayPos = players.length;

            var firstuid = gameData.uid;
            if(index >= 0){
                console.log("index==="+index);
                this.inArrayPos = index;
                if(players && players[index])  firstuid = players[index]['uid'];
            }
            // console.log("inArrayPos=="+this.inArrayPos+"--"+firstuid);
            for (var i = 0; i < players.length; i++) {
                var player = players[0];
                if (player.uid != firstuid) {
                    players.splice(0, 1);
                    players.push(player);
                } else {
                    break;
                }
            }
            // console.log(players);

            if(this.getRoomState() == ROOM_STATE_ONGOING) {
                $("chat").setVisible(!(gameData.myGameStatus == PLAYER_STATE_WATCHING));
                $("btn_mic").setVisible(!(gameData.myGameStatus == PLAYER_STATE_WATCHING));
            }

            $("timer").setUserData({delta: i});
            uid2position = {};
            position2playerArrIdx = {};
            var posArr = {
                9: {0: 4, 1: 3, 2: 2, 3: 1, 4: 9, 5:8, 6:7, 7:6, 8:5},
                5: {0: 4, 1: 3, 2: 2, 3: 1, 4: 5},
                4: {0: 0, 1: 3, 2: 2, 3: 1},
                3: {0: 1, 1: 3, 2: 2}
            };
            for (var i = 0, j = 2; i < players.length - this.inArrayPos; i++, j++) {
                var j = j % playerNum;
                var player = players[i];
                //旁观 没满员之前  2号位字留出来
                var index = j;
                var k = posArr[playerNum][index % playerNum];

                $("playerLayer.node.info" + k).setVisible(true);
                $("playerLayer.node.info" + k + ".lb_nickname").setString(ellipsisStr(player["nickname"], (k == 0 || k == 2 ? 7 : 5)));
                $("playerLayer.node.info" + k + ".lb_score").setString(player["total_score"] || 0);

                //回放总分显示0分
                if(isReplay){
                    $("playerLayer.node.info" + k + ".lb_score").setString(0);
                }

                if (roomState == ROOM_STATE_CREATED)
                    $("playerLayer.node.info" + k + ".ok").setVisible(!!player["ready"]);
                loadImageToSprite(player["headimgurl"], $("playerLayer.node.info" + k + ".head"));

                uid2position[player.uid] = k;
                uid2playerInfo[player.uid] = player;
                position2uid[k] = player.uid;
                position2sex[k] = player.sex;
                position2playerArrIdx[k] = i;
                // console.log("k11111111==="+k);
            }
            for (; i < playerNum - this.inArrayPos; i++, j++) {
                var j = j % playerNum;
                var index = j;

                var k =posArr[playerNum][index % playerNum];
                // console.log("k222222222==="+k);
                $("playerLayer.node.info" + k).setVisible(false);
            }
            for (; i < playerNum; i++, j++) {
                var j = j % playerNum;
                var player = players[i - (playerNum - players.length)];
                //旁观 没满员之前  2号位字留出来
                var index = j;
                var k = posArr[playerNum][index % playerNum];
                // console.log("k3333333==="+k);

                if(player) {
                    $("playerLayer.node.info" + k).setVisible(true);
                    $("playerLayer.node.info" + k + ".lb_nickname").setString(ellipsisStr(player["nickname"], (k == 0 || k == 2 ? 7 : 5)));
                    $("playerLayer.node.info" + k + ".lb_score").setString(player["total_score"] || 0);

                    //回放总分显示0分
                    if(isReplay){
                        $("playerLayer.node.info" + k + ".lb_score").setString(0);
                    }

                    if (roomState == ROOM_STATE_CREATED)
                        $("playerLayer.node.info" + k + ".ok").setVisible(!!player["ready"]);
                    loadImageToSprite(player["headimgurl"], $("playerLayer.node.info" + k + ".head"));

                    uid2position[player.uid] = k;
                    uid2playerInfo[player.uid] = player;
                    position2uid[k] = player.uid;
                    position2sex[k] = player.sex;
                    position2playerArrIdx[k] = i - (playerNum - players.length);
                }
            }
            // console.log(uid2position);
            // console.log(position2uid);
            // console.log(position2playerArrIdx);

            $('btn_sitdown').setVisible(gameData.myGameStatus == PLAYER_STATE_WATCHING && gameData.players.length < playerNum);//tip_waitnext  tip_pangguan
            $('tip_waitnext').setVisible(gameData.myGameStatus == PLAYER_STATE_SITDOWN);
            $('tip_pangguan').setVisible(gameData.myGameStatus == PLAYER_STATE_WATCHING);
            if(this.getMidJoin() == false){
                var curround = 0;
                if(gameData.curRound) {
                    curround = gameData.curRound;
                }
                $('btn_sitdown').setVisible(this.getRoomState() == ROOM_STATE_CREATED && gameData.myGameStatus == PLAYER_STATE_WATCHING && curround == 0);
            }

            if(isReplay) {
                $('btn_sitdown').setVisible(false);
                $('tip_waitnext').setVisible(false);
                $('tip_pangguan').setVisible(false);
            }
        },
        calcPosConf: function () {
            // if (window.posConf) {
            //     posConf = window.posConf;
            //     return;
            // }
            posConf.paiADistance[0] = 0;
            var arr =  [1, 2, 3, 4, 5];
            if(this.isNinePlayer())   arr =  [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (var i = 0; i < arr.length; i++) {
                var row = arr[i];

                var ltqp = $("playerLayer.node.info" + row + ".qp");
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
                        },
                        9: {
                            1: 90,
                            2: 84,
                            3: 100,
                            4: 100,
                            5: 90,
                            6: 90,
                            7: 90,
                            8: 90,
                            9: 90
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

            g_gendaodi = false;//跟到底

            network.stop();

            // loadCCSTo(res.PkSceneZJH_json, this, "Scene");
            if(typeof loadNodeCCS == 'function') {
                loadNodeCCS(res.PkSceneZJH_json, this, "Scene");
            }else{
                loadCCSTo(res.PkSceneZJH_json, this, "Scene");
            }

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
                //console.log("delay " + delay);
                lastDealy = delay;
                if (NetUtils.isWAN()) {
                    if (delay < 200) $("signal").setTexture(zjh_signal4);
                    else if (delay < 400) $("signal").setTexture(zjh_signal3);
                    else if (delay < 600) $("signal").setTexture(zjh_signal2);
                    else $("signal").setTexture(zjh_signal1);
                } else if(NetUtils.isWifi()) {
                    if (delay < 200) $("signal").setTexture(wifi_signal4);
                    else if (delay < 400) $("signal").setTexture(wifi_signal3);
                    else if (delay < 600) $("signal").setTexture(wifi_signal2);
                    else $("signal").setTexture(wifi_signal1);
                }
            };
            func();
            interval = setInterval(func, 200);

            //如果视频房判断网络 并提示玩家
            if(NetUtils.isWAN() && gameData.shipin>0){
                alert1("您当前为移动网络，已经进入视屏房，耗费流量较大。");
            }
        },
        startTime: function () {
            var interval = null;
            var flag = true;
            var lbTime = $("lb_time");
            var battery = $("battery_bg.battery");
            if (isReplay)
                return;
            var updTime = function () {
                var date = new Date();
                var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
                var hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
                if (cc.sys.isObjectValid(lbTime))
                    lbTime.setString(hours + ":" + minutes);
                else if (interval)
                    clearInterval(interval);
                var level = DeviceUtils.getBatteryLevel();
                if (cc.sys.isObjectValid(battery)) {
                    battery.setPercent(level);
                }
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
        shakePais : function (isStop) {
            for(var i=0; i<3; i++){
                var pai = $('playerLayer.node.row2b.b' + i);
                if(pai) {
                    if (isStop) {
                        pai.stopAllActions();
                        pai.setRotation(0);
                        continue;
                    }
                    var isReverse = 0.7;
                    if (i == 1) {
                        isReverse = -0.7;
                    }
                    pai.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function (target, isReverse) {
                        target.runAction(cc.repeatForever(cc.sequence(
                            cc.rotateTo(0.18, 3 * isReverse).easing(cc.easeInOut(3)),
                            cc.rotateTo(0.16, -3 * isReverse).easing(cc.easeInOut(3)),
                            cc.rotateTo(0.14, 2 * isReverse).easing(cc.easeInOut(2)),
                            cc.rotateTo(0.12, -2 * isReverse).easing(cc.easeInOut(2)),
                            cc.rotateTo(0.09, 1 * isReverse).easing(cc.easeInOut(3)),
                            cc.rotateTo(0.04, -1 * isReverse).easing(cc.easeInOut(3))
                        )));
                    }, pai, isReverse)))
                }
            }
        },
        setTopPanelInfo: function(data){
            if(!$('top_panel')){
                return;
            }
            $('top_panel').setVisible(true);
            $('top_panel.chipnum').setString(data['total_chip']);
            $('top_panel.gennum').setString(data['gen_round'][0] + '/' + data['gen_round'][1]);
            this.gen_round = data['gen_round'][0];
            $('top_panel.binum').setString(data['bi_round'][0] + '/' + data['bi_round'][1]);
            $('top_panel.mennum').setString(data['men_round'][0] + '/' + data['men_round'][1]);
        },
        setYaman: function(canYaMan, needYaMan, ismyturn, yaManChip){
            // console.log(canYaMan);
            // console.log(needYaMan);
            // console.log(ismyturn);
            // console.log(yaManChip);
            //-1不能压满    0可以压满    1已压满
            if(!$('ops')){
                return;
            }
            var btnArr = ['qi', 'bi', 'jia', 'gen', 'alwaysfollow'];
            if(gameData.wanfaDesp && gameData.wanfaDesp.indexOf('押满') > 0){
                btnArr = ['qi', 'bi', 'jia', 'gen', 'alwaysfollow', 'yaman'];
                $('ops.yaman').setVisible(true);
            }
            if(ismyturn) {
                for (var i = 0; i < btnArr.length; i++) {
                    $('ops.' + btnArr[i]).setPositionX(640 - (btnArr.length / 2 - i - 0.5) * 150 + 60);
                }
                if (needYaMan){
                    var check = $("ops.alwaysfollow.check");
                    g_gendaodi = false;
                    check.setSelected(g_gendaodi);
                    this.disableOpsBtns(['ops.qi', 'ops.yaman'])
                }
                if(canYaMan == 0 || canYaMan == 1){
                    $('ops.yaman.txt').setString(yaManChip || 0);
                }else{
                    $('ops.yaman.txt').setString("");
                }
            }else{
                for (var i = 0; i < btnArr.length; i++) {
                    $('ops.' + btnArr[i]).setPositionX(640 - (btnArr.length / 2 - i - 0.5) * 150 + 60);
                }
                if(canYaMan == 1) {
                    this.disableBtn('ops.alwaysfollow');
                    $('ops.yaman.txt').setString(yaManChip);
                }
            }
            if(canYaMan != 0)  this.disableBtn("ops.yaman");
            if(canYaMan == 0 && !g_gendaodi)  this.enableBtn("ops.yaman");
        },
        huoYanAni: function (row, visibleFlag) {
            if (row == undefined) {
                return;
            }
            var head = $("playerLayer.node.info" + row + ".bg");
            if (head) {
                var huoyan = head.getChildByName('huoyan');
                if (!huoyan) {
                    var pos = cc.p(head.getContentSize().width/2, 50);
                    var aniScale = 1;
                    if (row != 2) {
                        pos = cc.p(head.getContentSize().width/2, 65);
                    }
                    huoyan = new sp.SkeletonAnimation(res.huoyan_json, res.huoyan_atlas);
                    huoyan.setName('huoyan');
                    huoyan.setScale(aniScale);
                    huoyan.setPosition(pos);
                    huoyan.setLocalZOrder(100);
                    head.addChild(huoyan);
                }
                if(visibleFlag) {
                    playEffect('fire');//提示音效
                    if (row != 2) {
                        huoyan.addAnimation(0, 'huoyan02', true);
                    } else {
                        huoyan.addAnimation(0, 'huoyan01', true);
                    }
                }
                huoyan.setVisible(visibleFlag);
            }
        },
        ZJHthrowTurn: function (row, data) {
            var that = this;

            if(gameData.myGameStatus == PLAYER_STATE_PLAYING)  turnRow = row;

            this.countDown(row, 12);
            this.setTopPanelInfo(data);

            //观看模式
            if(isReplay == false && (gameData.myGameStatus == PLAYER_STATE_SITDOWN || gameData.myGameStatus == PLAYER_STATE_WATCHING)){
                $('ops').setVisible(false);
                $('kan').setVisible(false);
                return;
            }
            if(isReplay == false && gameData.myGameStatus == PLAYER_STATE_PLAYING)  $('ops').setVisible(true);

            //跟到底
            // console.log("跟到底自动+" + g_gendaodi + data['uid'] + gameData.uid);
            if(g_gendaodi && data['uid'] == gameData.uid){
                //选了跟到底  第一次 可以押满 跟到底改成  不选中  不是第一次不管
                if(row == 2 && data['canYaMan'] == 0)  that.clickAlwaysFollow++;
                if(that.clickAlwaysFollow == 1) {
                    g_gendaodi = false;
                    that.disableOpsBtns(['ops.qi', 'ops.bi', 'ops.jia', 'ops.gen', 'ops.kan', 'ops.alwaysfollow', 'ops.yaman']);
                    $("ops.alwaysfollow.check").setSelected(false);
                }else {
                    if (!data['needYaMan']) {
                        that.scheduleOnce(function () {
                            $('ops').setVisible(true);
                            if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 2});
                            that.disableOpsBtns('ops.alwaysfollow');
                        }, 0.5);
                        $('ops.gen.txt').setString('' + data['gen_score']);//('跟注x' + data['gen_score']);
                        $('ops.bi.txt').setString('' + (data['gen_score'] * that.getBipaiRate()));
                        $('ops.alwaysfollow.txt').setString('' + data['gen_score']);

                        //压满
                        that.setYaman(data['canYaMan'], data['needYaMan'], row == 2, data['yaManChip']);
                        return;
                    }
                }
            }
            if (!isReplay) {
                if (row != 2) {
                    if(!data['isloser'])  that.disableOpsBtns('ops.alwaysfollow');
                    if(data['isloser'])  that.disableOpsBtns();
                    that.shakePais(true);

                    //压满
                    that.setYaman(data['canYaMan'], data['needYaMan'], row == 2, data['yaManChip']);
                    return;
                }else{
                    that.shakePais(!data['kan']);
                }

                $('kan').setVisible(!!data['kan']);
                // that.setBtnEnableState('ops.kan',!!data['kan']);
                $('ops.gen.txt').setString(''+ data['gen_score']);//('跟注x' + data['gen_score']);
                $('ops.bi.txt').setString(''+ (data['gen_score']*that.getBipaiRate()));
                $('ops.alwaysfollow.txt').setString(''+ data['gen_score']);

                TouchUtils.removeListeners($('ops.shield'));
                TouchUtils.setOnclickListener($("jia.jia0"), function () {
                    $('ops').setVisible(true);
                    $('jia').setVisible(false);
                });
                var tuiArr = TUIZHUARRAY[ZUIDAXIAZHU];
                var datajiachange = 1;
                for(var k=0;k<tuiArr.length;k++){
                    if(tuiArr[k] == data.jia){
                        datajiachange = k + 2;
                        break;
                    }
                }
                for (var i = 5; i > Math.max(datajiachange, 1); i--) {
                    that.enableBtn('jia.jia' + i);
                    (function (idx) {
                        var value = tuiArr[idx - 2];
                        TouchUtils.setOnclickListener($("jia.jia" + idx), function () {
                            if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 3, bei: value});
                            $('ops').setVisible(true);
                            $('jia').setVisible(false);
                            that.enableBtn('ops.alwaysfollow');
                        });
                    })(i)
                }
                for (var i = datajiachange; i > 1; i--) {
                    that.disableBtn('jia.jia' + i, 1);
                }
                //NONE, QI, GEN, JIA, BI, KAN
                TouchUtils.setOnclickListener($("ops.qi"), function () {
                    alert2('确定要弃牌吗?', function () {
                        if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 1});
                        that.disableOpsBtns();
                    }, null, false, true, true);
                });
                TouchUtils.setOnclickListener($("ops.gen"), function () {
                    if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 2});
                    that.disableOpsBtns('ops.alwaysfollow');
                });
                TouchUtils.setOnclickListener($("ops.jia"), function () {
                    if($('jia').isVisible()){
                        that.enableBtn("ops.jia");
                        that.enableBtn("ops.alwaysfollow");
                        that.enableBtn("ops.yaman");
                        $('jia').setVisible(false);
                        that.refreshBtnsStatus();
                        return;
                    }
                    // $('ops').setVisible(false);
                    that.disableOpsBtns(["ops.jia"]);
                    $('jia').setVisible(true);

                    for (var k = 2; k <= 5; k++) {
                        //$('jia.jia' + k + '.txt').setString('x ' + (data['read'] ? (2 * k) : k));
                        that.jiaBtnTextureShow((data['read'] ? 2 : 1));
                        if(g_kanpai){
                            //$('jia.jia' + k + '.txt').setString('x ' +(2 * k));
                            that.jiaBtnTextureShow(2);
                        }
                    }

                });
                TouchUtils.setOnclickListener($("ops.bi"), function () {
                    TouchUtils.setOnclickListener($('ops.shield'), function () {

                    });
                    if(that.getRoomState() == ROOM_STATE_ONGOING)  network.send(4503, {room_id: gameData.roomId, op: 4, bi_uid: 0});
                });
                TouchUtils.setOnclickListener($("ops.canclebi"), function () {
                    $('ops.qi').setVisible(true);
                    $('ops.gen').setVisible(true);
                    $('ops.jia').setVisible(true);
                    $("ops.bi").setVisible(true);
                    $("ops.kan").setVisible(true);
                    $("ops.alwaysfollow").setVisible(true);
                    $('ops.canclebi').setVisible(false);
                    for (var i = 1; i < 10; i++) {
                        //头像变正常
                        // if ($('playerLayer.node.info' + i + '.head_bg_anmi').isVisible()) {
                        //     $('playerLayer.node.info' + i + '.head_bg_anmi').stopAllActions();
                        //     $('playerLayer.node.info' + i + '.head_bg_anmi').setVisible(false);
                        // }
                        // (function (idx) {
                        //     TouchUtils.setOnclickListener($('playerLayer.node.info' + idx), function () {
                        //         that.showPlayerInfoPanel(idx);
                        //     });
                        // })(i);
                        if($('playerLayer.node.row'+i+'b.bi_rect_sp')){
                            $('playerLayer.node.row'+i+'b.bi_rect_sp').removeAllChildren();
                            $('playerLayer.node.row'+i+'b.bi_rect_sp').setVisible(false);
                            TouchUtils.removeListeners($('playerLayer.node.row'+i+'b.bi_rect_sp'));
                        }
                    }
                    $('choose_player_bi').setVisible(false);
                });
                if (data['jia'] >= that.getZuidaxiazhu()) {
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
                var maxjia = that.getZuidaxiazhu();
                selfCurrentBtnStates['jia'] = !(data['jia'] >= maxjia);
                selfCurrentBtnStates['bi'] = data['bi'];
                selfCurrentBtnStates['kan'] = data['kan'];
                selfCurrentBtnStates['read'] = data['read'];
                selfCurrentBtnStates['qi'] = data['qi'] || true;
                selfCurrentBtnStates['gen'] = true;

                //压满按钮显不显示
                that.setYaman(data['canYaMan'], data['needYaMan'], row == 2, data['yaManChip']);
            }
            if(isReplay)  {
                $('ops').setVisible(false);
            }
        },
        setPai: function (row, idx, val, isVisible) {
            var pai = this.getPai(row, idx);
            var userData = pai.getUserData();
            this.setPaiHua(pai, val, row);
            userData.pai = val < 100 ? val : (Math.floor(val / 100) - 1);
            if (!_.isUndefined(isVisible)) {
                if (isVisible)
                    pai.setVisible(true);
                else
                    pai.setVisible(false);
            }
            return pai;
        },
        setPaiHua: function (pai, val, row) {
            // 改扑克牌面备份
            var a = pai.getChildByName("a");
            var b = pai.getChildByName("b");
            var originValue = null;
            if (val >= 100) {
                originValue = val % 100;
                val = (val - originValue) / 100 - 1;
            }
            var arr = getPaiNameById(val);
            setPokerFrameByName(a, (originValue == null && !pokerRule.isLaizi(val, laiziValue)) ? arr[0] : "b/orange_" + val % 13 + ".png");
            if (val < 52) {
                setPokerFrameByName(b, arr[1]);
                b.setVisible(true);
            } else {
                b.setVisible(false);
            }
            // if (!row || row != 2) {
            //     b.setVisible(false);
            // }
            var c = pai.getChildByName("c");
            if (c && cc.sys.isObjectValid(c)) {
                c.setVisible(true);
                if (val > 51) {
                    c.setVisible(false);
                } else {
                    setPokerFrameByName(c, arr[1]);
                }
            }
            if (pai.getChildByTag(5001)) {
                pai.removeChildByTag(5001, true);
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
            // var sp_frame_name = getPaiNameByRowAndId(val);
            // setPokerFrameByName(pai, sp_frame_name);
        },
        getPai: function () {
            var cache = {};
            return function (row, id) {
                cache[row] = cache[row] || {};
                if (cache[row][id])
                    return cache[row][id];
                var node = $("playerLayer.node.row" + row + ".a" + id);
                if (!node) {
                    var a0 = $("playerLayer.node.row" + row + ".a0");
                    node = duplicateSprite(a0, true);
                    var dis = posConf.paiADistance[row];
                    dis = dis || posConf.paiADistance[row / 10];
                    node.setPositionX(dis * id + a0.getPositionX());
                    node.setName("a" + id);
                    a0.getParent().addChild(node, row == 1 || row == 10 ? -id : id);
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
        hidePlayerStatus: function (row) {
            var spStatus = $("sp_status" + row);
            if (spStatus)
                spStatus.setVisible(false);
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
                var a0 = $("playerLayer.node.row" + row + ".a0");
                posConf.paiTouchRect = cc.rect(0, 0, distance, a0.getContentSize().height);
                for (var i = 0; i < paiCnt; i++) {
                    this.getPai(row, i).setPositionX(distance * i + a0.getPositionX());
                }
            }
            var width = (paiCnt - 1) * distance + posConf.paiASize[row].width;
            width *= $("playerLayer.node.row" + row).getScaleX();
            $("playerLayer.node.row" + row).setPositionX((cc.winSize.width - width) / 2);
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
                    var pai = cache[row][j] || $("playerLayer.node.row" + row + ".c0.b" + j);
                    if (!pai) {
                        var k = (j >= 0 && j < 10 ? 0 : 10);
                        var b = $("playerLayer.node.row" + row + ".c0.b" + k);
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
                        var paiName = getPaiNameById(val);
                        cc.log("painame = " + paiName);
                        //userData.pai = val;
                        setSpriteFrameByName(pai, paiName, "zjh/card/poker_b");
                        pai.setVisible(true);
                        return pai;
                    }
                }
            }
        },
        isNinePlayer: function(){
            if(gameData.wanfaDesp && gameData.wanfaDesp.indexOf("九人场") >= 0){
                return true;
            }
            return false;
        },
        getMidJoin: function(){
            if(gameData.wanfaDesp && gameData.wanfaDesp.indexOf("禁止中途加入") >= 0){
                return false;
            }
            return true;
        },
        getRoomState: function () {
            return roomState;
        },
        setRoomState: function (state) {
            if(!$("timer")){
                return;
            }
            ZUIDAXIAZHU = this.getZuidaxiazhu();//加注2345 23510

            var arr = decodeURIComponent(gameData.wanfaDesp).split(",");
            if (arr.length >= 1)
                arr = arr.slice(1);
            var wanfaStr;
            if (mapId == MAP_ID.ZJH) {
                for (var i = 0; i < 3; i++) {
                    arr.splice(0, 1);
                }
                wanfaStr = arr.join(" ");
            } else {
                wanfaStr = arr.join("\n");
            }
            if (state == ROOM_STATE_CREATED) {
                $("signal").setVisible(false);
                $("btn_list").setVisible(false);
                $("chat").setVisible(false);
                $("timer").setVisible(false);
                $("timer2").setVisible(false);
                $("location_btn").setVisible(!window.inReview);
                // $("location2_btn").setVisible(!window.inReview);
                this.setInviteBtn(gameData.loginType != "yk");
                if (mapId == MAP_ID.ZJH) {
                    $("btn_begin").setVisible(false);
                    console.log("setRoomState===false");
                    // removeLightButton($("btn_begin"));
                }
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ_LZ) {
                    $('bg_bei').setVisible(true);
                    $('bg_bei.lb_bei').setString('1倍');
                    $('lb_jiaofen').setVisible(true);
                    $('lb_jiaofen').setString('叫0分');
                }
                $("btn_fanhui").setVisible(gameData.uid != gameData.ownerUid || gameData.clubCreater);
                $("btn_jiesan").setVisible(gameData.uid == gameData.ownerUid && !gameData.clubCreater);
                gameData.isOpen = false;
                $("btn_zhunbei").setVisible(false);
                $("btn_mic").setVisible(false);
                $("lb_roomid").setString(gameData.roomId);
                $("lb_wanfa").setString(wanfaStr);
                // $("lb_wanfa").setPositionY(695);
                $("lb_roomid").setVisible(true);
                for(var i=1;i<=9;i++){
                    if($("playerLayer.node.row" + i)){
                        $("playerLayer.node.row" + i).setVisible(false);
                        $("playerLayer.node.row" + i + "b").setVisible(false);
                    }
                }
                $('top_panel').setVisible(false);
            }
            if (state == ROOM_STATE_ONGOING) {
                if(this.assistant) {
                    this.assistant.removeFromParent(true);
                    this.assistant = null;
                }

                var setting = $('btn_list');
                if (!setting || !cc.sys.isObjectValid(setting))
                    return network.disconnect();
                setting.setVisible(true);
                $("signal").setVisible(!isReplay);
                $("chat").setVisible(!gameData.shipin);
                $("timer").setVisible(true);
                $("timer2").setVisible(true);
                this.setInviteBtn(false);
                $("location_btn").setVisible(false);
                if (mapId == MAP_ID.ZJH) {
                    console.log("setRoomStateROOM_STATE_ONGOING===false");
                    $("btn_begin").setVisible(false);
                }
                if (mapId == MAP_ID.DDZ_JD || mapId == MAP_ID.DDZ) {
                    $('bg_bei').setVisible(true);
                    $('lb_jiaofen').setVisible(true);
                }
                $("btn_fanhui").setVisible(false);
                $("btn_jiesan").setVisible(false);
                gameData.isOpen = true;
                $("btn_zhunbei").setVisible(false);
                $("btn_mic").setVisible(!window.inReview && !gameData.shipin);
                $("lb_roomid").setString(gameData.roomId);
                $("lb_wanfa").setString(wanfaStr);
                // $("lb_wanfa").setPositionY(707);
                //$("lb_roomid").setVisible(false);
                for(var i=1;i<=9;i++){
                    if($("playerLayer.node.row" + i)){
                        $("playerLayer.node.row" + i).setVisible(false);
                        $("playerLayer.node.row" + i + "b").setVisible(false);
                    }
                }


                $("timer2.Text_5").setString(gameData.leftRound);
                for (var i = 1; i < (playerNum + 1); i++) {
                    $("playerLayer.node.info" + i + ".ok").setVisible(false);
                }

                if (isReplay) {
                    $("lb_time").setVisible(false);
                    $("btn_list").setVisible(false);
                    $("chat").setVisible(false);
                    $("btn_mic").setVisible(false);
                }
            }
            if (state == ROOM_STATE_ENDED) {
                $("timer").setVisible(false);
                this.hideOps();
            }

            roomState = state;
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
        //处理chips  只有 1234568 10 20
        dealChips: function(chipArr){
            var coinArr = [1,2,3,4,5,6,8,10,20];
            var spliceCoin = function(bigcoin){
                var spliceArr = [];
                for(var i=coinArr.length-1;i>=0;i--){
                    var num = Math.floor(bigcoin/coinArr[i]);
                    for(var j=0;j<num;j++){
                        spliceArr.push(coinArr[i]);
                    }
                    bigcoin = bigcoin%coinArr[i];
                    if(bigcoin > 0){
                        continue;
                    }else{
                        // console.log(spliceArr);
                        return spliceArr;
                    }
                }
            }
            if(chipArr && chipArr.length > 0) {
                for (var i = chipArr.length - 1; i >= 0; i--) {
                    if (coinArr.indexOf(chipArr[i]) < 0) {
                        var spliceArr = spliceCoin(chipArr[i]);
                        if (spliceArr && spliceArr.length > 0){
                            for (var j=0;j<spliceArr.length;j++) {
                                chipArr.push(spliceArr[j]);
                            }
                        }
                        chipArr.splice(i, 1);
                    }
                }
                // console.log(chipArr);
                return chipArr;
            }
            return [];
        },
        clearTable4StartGame: function (isInitPai, isReconnect, reconnectData, inArrayPos) {
            var that = this;

            this.onPlayerEnterExit(inArrayPos);

            //
            that.clickAlwaysFollow = 0;

            $("ops").setVisible(false);
            $("jia").setVisible(false);
            $("timer").setVisible(false);
            $("btn_list_bg").setVisible(false);
            //押满显示
            $('ops.yaman.txt').setString("");

            if(paizhuoType == 0) {
                $('ops.qi.down_bg').setLocalZOrder(-1);
                $('ops.kan.down_bg').setLocalZOrder(-1);
                $('ops.jia.down_bg').setLocalZOrder(-1);
                $('ops.bi.down_bg').setLocalZOrder(-1);
                $('ops.gen.down_bg').setLocalZOrder(-1);
                $('ops.canclebi.down_bg').setLocalZOrder(-1);
            }
            isCuopaiOps = !!(decodeURIComponent(gameData.wanfaDesp).indexOf('搓牌')>=0);

            if (isReconnect) {
                $('pai_box').setVisible(true);

                var playerPaiArr = reconnectData["player_pai"] || [];
                var myPai;
                for (var i = 0; i < playerPaiArr.length; i++) {
                    var playerPai = playerPaiArr[i];
                    var paiArr = playerPai["pai_arr"];
                    var chuPaiArr = playerPai["chu_pai_arr"];
                    var curPaiNum = playerPai["cur_pai_num"];
                    var isOffline = !!playerPai["is_offline"];
                    var canYaMan = playerPai["canYaMan"];
                    if (isOffline)
                        this.playerOnloneStatusChange(uid2position[playerPai.uid], isOffline);
                    var row = uid2position[playerPai.uid];

                    //已经压满
                    if(canYaMan == 1 && playerPai['player_status'] == 3){
                        that.huoYanAni(row, true);
                    }

                    this.setTopPanelInfo(data);
                    if (row == 2 && reconnectData['turn_uid']) {
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
                            read: playerPai['read'],
                            isloser: playerPai['isloser'],
                            qi : playerPai['isqi'],
                            canYaMan: playerPai['canYaMan'],
                            needYaMan: playerPai['needYaMan'],
                            yaManChip: playerPai['yaManChip'],
                        });
                        //if(playerPai['read']){
                        g_kanpai = playerPai['read'];
                        //}
                        $('kan').setVisible(!!playerPai['kan']);
                        if(gameData.myGameStatus == PLAYER_STATE_SITDOWN || gameData.myGameStatus == PLAYER_STATE_WATCHING){
                            $('kan').setVisible(false);
                        }

                        if (playerPai['card_type'] && playerPai['card_type'] != '' && playerPai['card_type'] != "0") {
                            $('playerLayer.node.row' + row + '.cardtype').setVisible(true);
                            $('playerLayer.node.row' + row + '.cardtype').loadTexture('res/submodules/psz/image/PkScene_zjh/cardtype' + playerPai['card_type'] + '.png');
                        } else {
                            $('playerLayer.node.row' + row + '.cardtype').setVisible(false);
                        }
                    }


                    if (that.getRoomState() == ROOM_STATE_ONGOING) {
                        {
                            if (row == 2) {
                                //PLAYER_STATE_SITDOWN  0    PLAYER_STATE_WATCHING -1  getPlayerNumByStatus
                                if(playerPai['player_status'] == PLAYER_STATE_SITDOWN){
                                    $('playerLayer.node.row2b').setVisible(false);
                                    $('playerLayer.node.row2').setVisible(false);
                                    var status = null;
                                    if(playerPai['isqi'])  status = 'qi';
                                    if(playerPai['read'])  status = 'kan';
                                    that.updateCardStatusZJH(row, status);
                                    continue;
                                }
                                if(playerPai['player_status'] == PLAYER_STATE_WATCHING){
                                    if(gameData.players.length >= playerNum) {
                                        $('playerLayer.node.row2b').setVisible(true);
                                        $('playerLayer.node.row2').setVisible(true);
                                        var status = null;
                                        if (playerPai['read']) status = 'kan';
                                        if (playerPai['isqi']) status = 'qi';
                                        that.updateCardStatusZJH(row, status);
                                        continue;
                                    }else{
                                        //2号位是空的
                                        $('playerLayer.node.row2b').setVisible(false);
                                        $('playerLayer.node.row2').setVisible(false);
                                        continue;
                                    }
                                }
                                if (playerPai['read'] && playerPai['uid'] == gameData.uid) {
                                    $('playerLayer.node.row2').setVisible(true);
                                    $('playerLayer.node.row2b').setVisible(false);
                                    for (var j = 0; j < playerPai['pai_arr'].length; j++) {
                                        that.setPai(2, j, playerPai['pai_arr'][j], true);
                                    }
                                    if (playerPai['isloser'] || playerPai['isqi']) {
                                        $('playerLayer.node.row2b').setVisible(true);
                                        for (var j = 0; j < 3; j++) {
                                            $('playerLayer.node.row' + row + 'b.b' + j).setVisible(false);
                                        }
                                        that.updateCardStatusZJH(2, playerPai['isqi'] ? 'qi' : 'shu');
                                    }
                                } else {
                                    $('playerLayer.node.row' + row + 'b').setVisible(true);
                                    $('playerLayer.node.row' + row).setVisible(false);
                                    if (playerPai['isloser'] ) {
                                        $('playerLayer.node.row2').setVisible(false);
                                        $('playerLayer.node.row2b').setVisible(true);
                                        for (var j = 0; j < 3; j++) {
                                            $('playerLayer.node.row' + row + 'b.b' + j).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backold.png');
                                        }
                                        that.updateCardStatusZJH(2, playerPai['isqi'] ? 'qi' : 'shu');
                                    }
                                    if ( playerPai['isqi']) {
                                        $('playerLayer.node.row2b').setVisible(true);
                                        for (var j = 0; j < 3; j++) {
                                            $('playerLayer.node.row' + row + 'b.b' + j).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backhui.png');
                                        }
                                        that.updateCardStatusZJH(2, playerPai['isqi'] ? 'qi' : 'shu');
                                    }
                                }
                                $('ops.gen.txt').setString(''+ playerPai['gen_score']);//('跟注x' + playerPai['gen_score']);
                                $('ops.bi.txt').setString(''+ (playerPai['gen_score']*that.getBipaiRate()));
                                $('ops.alwaysfollow.txt').setString(''+ playerPai['gen_score']);
                            } else {
                                $('playerLayer.node.row' + row + 'b').setVisible(true);
                                $('playerLayer.node.row' + row).setVisible(false);
                                if (playerPai['read']) {
                                    that.updateCardStatusZJH(row, 'kan');
                                }
                                if (playerPai['isloser'] ) {
                                    for (var j = 0; j < 3; j++) {
                                        $('playerLayer.node.row' + row + 'b.b' + j).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backold.png');
                                    }
                                    that.updateCardStatusZJH(row, playerPai['isqi'] ? 'qi' : 'shu');
                                }
                                if (playerPai['isqi']) {
                                    for (var j = 0; j < 3; j++) {
                                        $('playerLayer.node.row' + row + 'b.b' + j).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backhui.png');
                                    }
                                    that.updateCardStatusZJH(row, playerPai['isqi'] ? 'qi' : 'shu');
                                }

                                var player_status = gameData.players[position2playerArrIdx[row]]['player_status'];
                                console.log(row+"==="+player_status);
                                if(player_status == PLAYER_STATE_SITDOWN || player_status == PLAYER_STATE_WATCHING){
                                    $('playerLayer.node.row' + row + 'b').setVisible(false);
                                    $('playerLayer.node.row' + row).setVisible(false);
                                }
                            }
                        }
                        if (!playerPai['has_xia']) {
                            $('playerLayer.node.info' + row + '.minexia').setVisible(false);
                        }else{
                            $('playerLayer.node.info' + row + '.minexia').setVisible(true);
                            $('playerLayer.node.info' + row + '.minexia.yixianum').setString(playerPai['has_xia']);
                        }
                    }
                }

                gameData.unused_paiArr = data["unused_card_arr"];


                if (roomState == ROOM_STATE_ONGOING) {
                    {
                        $('ops').setVisible(true);
                        if(gameData.myGameStatus == PLAYER_STATE_SITDOWN || gameData.myGameStatus == PLAYER_STATE_WATCHING){
                            $('ops').setVisible(false);
                        }
                        $('chipnode').removeAllChildren();

                        //处理chips  1234568 10 20
                        data['chips'] = that.dealChips(data['chips']);
                        console.log(data['chips']);

                        for (var chipnum = 0; chipnum < data['chips'].length; chipnum++) {
                            (function (chipnum) {
                                var chip = new cc.Sprite(cc.textureCache.addImage('res/submodules/psz/image/PkScene_zjh/chip' + data['chips'][chipnum] + '.png'));
                                chip.setPosition((Math.random()-0.5) * 380 + 640, (Math.random()-0.5) * 150 + 420);
                                // chip.runAction(cc.moveTo(1, ).easing(cc.easeOut(5)));
                                $('chipnode').addChild(chip);
                            })(chipnum);
                        }
                    }
                } else if (roomState == ROOM_STATE_ENDED) {
                    $('kan').setVisible(false);
                    $('ops').setVisible(false);
                    for (var i = 1; i < 10; i++) {
                        that.updateCardStatusZJH(i);
                    }
                    // if (myPai['read']) {
                    //     $('playerLayer.node.row2').setVisible(true);
                    //     $('playerLayer.node.row2b').setVisible(false);
                    //     for (var j = 0; j < myPai['pai_arr'].length; j++) {
                    //         that.setPai(2, j, myPai['pai_arr'][j], true);
                    //     }
                    // } else {
                    //     $('playerLayer.node.row' + row + 'b').setVisible(true);
                    //     $('playerLayer.node.row' + row).setVisible(false);
                    // }
                    //已经结束了，就不显示牌了
                    $('top_panel.chipnum').setString('');
                    $('playerLayer.node.row' + row + 'b').setVisible(false);
                    $('playerLayer.node.row' + row).setVisible(false);
                }
            } else if (isInitPai) {

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
            var sp = $("playerLayer.node.info" + row + ".alarm");
            sp.setVisible(true);
            var bk = $("playerLayer.node.info" + row + ".pai_back");
            bk.setVisible(false);
            playFrameAnim(res.alarm_plist, "alarm", 2, 0.2, true, sp);
        },
        countDown: function () {
            var that = this;
            var timer = null;
            return function (row, seconds) {
                if (isReplay || !$('timer') || !row) {
                    return;
                }

                $('timer').setVisible(true);
                var bg = $('playerLayer.node.info' + row + '.bg');
                var parentScale = $('playerLayer.node.info' + row).getScale();
                var pos = bg.convertToWorldSpace(cc.p(0, 0));
                $('timer').setPosition(pos.x + bg.getContentSize().width / 2 * bg.getScaleX() * parentScale - (cc.winSize.width/2-1280/2),
                    pos.y + bg.getContentSize().height / 2 * bg.getScaleY() * parentScale + 2);

                var pt0 = $('timer').getChildByName('pt0');
                if(pt0){
                    pt0.removeFromParent();
                }

                var path = 'res/submodules/psz/image/PkScene_zjh/head_timer_bg.png';
                if(row==2){
                    path = 'res/submodules/psz/image/PkScene_zjh/head_timer_bg2.png'
                }
                var ptsp = new cc.Sprite(path);
                pt0 = new cc.ProgressTimer(ptsp);
                if(row==2){
                    pt0.setScale(1.2);
                }
                if(this.isNinePlayer()){
                    pt0.setScale((row == 2) ? 1 : 0.8);
                }
                pt0.setName('pt0');
                pt0.setType(cc.ProgressTimer.TYPE_RADIAL);
                $('timer').addChild(pt0);

                pt0.stopAllActions();
                pt0.setPercentage(0);
                pt0.runAction(cc.progressTo(seconds, 100));
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
            for (var j = 0; j < paiArr.length; j++)
                this.setPai(row, j, paiArr[j], true).setOpacity(255);
            for (; j < 168; j++) {
                var pai = $("playerLayer.node.row" + row + ".a" + j);
                if (!pai)
                    break;
                pai.setVisible(false);
            }
        },
        hideOps: function () {
            $("ops").setVisible(false);
        },
        setReplayProgress: function (cur, total) {
            var progress = cur / total * 100;
            if(!total){
                progress = 100;
                this.showTip("当前牌局为解散局 未显示牌为服务器还未发牌", true);
                return;
            }
            this.showTip("进度: " + progress.toFixed(1) + "%", false);
        },
        setAllPai4Replay: function (data) {
            for (var uid in data)
                if (data.hasOwnProperty(uid)) {
                    var row = uid2position[uid];
                    var paiArr = data[uid]["pai_arr"];
                    var usedPaiArr = data[uid]["used_arr"];
                    if (row == 2) {
                        this.setPaiArrOfRow(row, paiArr);
                        $("playerLayer.node.row" + row).setVisible(true);

                        this.setPaiArrOfRow(20, usedPaiArr);
                        $("playerLayer.node.row" + 20).setVisible(true);

                        for (var _i = 0; _i < initPaiNum; _i++) {
                            Filter.grayMask(this.getPai(row, _i));
                        }
                    }
                    else {
                        this.setPaiArrOfRow(row, usedPaiArr);
                        $("playerLayer.node.row" + row).setVisible(true);

                        this.setPaiArrOfRow(row * 10, paiArr);
                        $("playerLayer.node.row" + row * 10).setVisible(true);
                    }
                    this.recalcPos(row);

                    // console.log(row);
                }
        },
        jiesuan: function (data) {
            var that = this;

            g_gendaodi = false;
            g_kanpai = false;

            var myScore = 0;
            var players = data.players;
            var winneruid;
            // console.log(players);
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var uid = player["uid"];
                if (player.score > 0) {
                    winneruid = uid;
                }

                var _p = gameData.getPlayerInfoByUid(uid);
                if(_p){
                    _p.score = player["total_score"];
                    _p.total_score = player["total_score"];
                }

                if (uid == gameData.uid) {
                    myScore = player["score"];
                }

                var row = uid2position[uid];
                var paiArr = player["pai_arr"];
                if (paiArr.length != 0 ){
                    this.setPaiArrOfRow(row, paiArr);
                    $("playerLayer.node.row" + row).setVisible(true);
                    $('playerLayer.node.row' + row + '.cardtype').setVisible(false);
                }

                if (!isReplay) {
                    if (_.isArray(paiArr) && paiArr.length > 0) {
                        that.checkPaiAnim(row, paiArr);
                        that.updateCardStatusZJH(row);
                    }
                    $('kan').setVisible(false);
                    if (player['card_type'] && player['card_type'] != '' && player['card_type'] != '0') {
                        $('playerLayer.node.row' + row + '.cardtype').setVisible(true);
                        $('playerLayer.node.row' + row + '.cardtype').loadTexture('res/submodules/psz/image/PkScene_zjh/cardtype' + player['card_type'] + '.png');
                    } else {
                        $('playerLayer.node.row' + row + '.cardtype').setVisible(false);
                    }
                }

                (function (_row, _player) {
                    setTimeout(function () {
                        if(_row >= 0) {
                            if (_player.score != 0) {
                                that.wordsFly(_row, (_player.score > 0 ? '+' : '') + _player.score, 2, 1.2);
                            }
                            $("playerLayer.node.info" + _row + ".lb_score").setString(_player["total_score"]);
                        }
                    }, 500);
                })(row, player);
            }

            if (winneruid && uid2position[winneruid]) {
                var endPos = $('playerLayer.node.info' + uid2position[winneruid]).getPosition();
                var chips = $('chipnode').getChildren();
                var tArr = [];
                if(cc.sys.isNative){
                    var row = uid2position[winneruid];
                    var spNode = that.getChildByName('spNode' + row);
                    if(!spNode) {
                        spNode = createSp('button_anim2');
                        spNode.setName("spNode" + row);
                        that.addChild(spNode);
                    }
                    spNode.setVisible(true);
                    spNode.setAnimation(0, 'xuanwo', true);
                    spNode.setPosition(endPos);
                }
                for (var i = 0; i < chips.length; i++) {
                    (function (chip, count, len) {
                        var randEndX = endPos.x + Math.random() * 30 - 15;
                        var randEndY = endPos.y + Math.random() * 30 - 15;
                        chip.runAction(cc.sequence(
                            cc.delayTime(count*0.04),
                            cc.moveTo(0.35 + Math.random() * 0.05, cc.p(randEndX,randEndY)).easing(cc.easeInOut(3)),
                            cc.callFunc(function () {
                                tArr.push(chip);
                                if(tArr.length == len){
                                    setTimeout(function () {
                                        for(var j=0; j<tArr.length; j++){
                                            tArr[j].removeFromParent();
                                        }
                                        tArr.length = 0;
                                    },100);
                                    if(cc.sys.isNative) {
                                        spNode.setAnimation(0, 'xuanwo2', false);
                                        spNode.setEndListener(function () {
                                            setTimeout(function () {
                                                // spNode.removeFromParent();
                                                spNode.setVisible(false);
                                            }, 1)
                                        })
                                    }
                                }
                            })
                        ))
                    })(chips[i], i, chips.length);
                }
            }

            setTimeout(function () {
                playEffect(myScore > 0 ? "vvictory" : "vfailure");
            }, 800);

            setTimeout(function () {
                if (!isReplay)
                    that.onJiesuanClose();
            }, 580);
        },
        onJiesuanClose: function (isReady) {
            if (isReady) {
                $("btn_zhunbei").setVisible(false);
            } else {
                $("btn_zhunbei").setVisible(true);
                if(gameData.myGameStatus == PLAYER_STATE_WATCHING || gameData.myGameStatus == PLAYER_STATE_SITDOWN){
                    $("btn_zhunbei").setVisible(false);
                }
            }
        },
        zongJiesuan: function (data) {
            var that = this;
            mRoom.voiceMap = {};
            setTimeout(function () {
                if (mapId == MAP_ID.ZJH) {
                    var layer = new ZongJiesuanLayerZJH(data);
                    that.addChild(layer);
                }
            }, 2000);
        },
        showPlayerInfoPanel : function (idx) {
            if (window.inReview || isReplay)
                return;

            if (position2playerArrIdx[idx] >= gameData.players.length)
                return;

            var that = this;

            var playerInfo = gameData.players[position2playerArrIdx[idx]];

            var showAniBtn = (this.getRoomState() == ROOM_STATE_ONGOING);
            if(gameData.myGameStatus == PLAYER_STATE_WATCHING){
                showAniBtn = false;
            }
            // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'niuniu', hideBtn);
            // this.addChild(this.playerInfoLayer);

            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1){
                this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false, showAniBtn);
                this.addChild(this.playerInfoLayer);
            }else{
                this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'niuniu', showAniBtn);
                this.addChild(this.playerInfoLayer);
            }
        },
        playerOnloneStatusChange: function (row, isOffline) {
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
        initQP: function (row) {
            // var scale9sprite = $('playerLayer.node.info' + row + '.qp9');
            var scale9sprite = $('effectemoji' + row + '.qp9');
            var effectemoji = this.getChildByName('effectemoji' + row);
            if (!scale9sprite && effectemoji) {
                var src = 2;
                if (row == 1 || row == 5) src = 1;
                else if (row == 3 || row == 4) src = 3;
                if(this.isNinePlayer()){
                    if (row == 1 || row == 7 || row == 8 || row == 9) src = 1;
                    else if (row == 3 || row == 4 || row == 5 || row == 6) src = 3;
                }
                scale9sprite = new cc.Scale9Sprite("res/submodules/psz/image/common/ltqp" + src + ".png", posConf.ltqpRect[row], posConf.ltqpCapInsets[playerNum][row]);
                scale9sprite.setName("qp9");
                if (mapId == MAP_ID.ZJH) {
                    var ap = cc.p(0, 0);
                    if (row == 1 || row == 5) ap = cc.p(1, 1);
                    else if (row == 2) ap = cc.p(0, 0);
                    else if (row == 3 || row == 4) ap = cc.p(0, 1);
                    if(this.isNinePlayer()){
                        if (row == 1 || row == 7 || row == 8 || row == 9) ap = cc.p(1, 1);
                        else if (row == 2) ap = cc.p(0, 0);
                        else if (row == 3 || row == 4 || row == 5 || row == 6) ap = cc.p(0, 1);
                    }
                    scale9sprite.setAnchorPoint(ap);
                } else {
                    scale9sprite.setAnchorPoint(row == 1 ? cc.p(1, 0) : cc.p(0, 0));
                }
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                // $("playerLayer.node.info" + row).addChild(scale9sprite, 2);
                effectemoji.addChild(scale9sprite);
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
                    sp.setPosition(posConf.ltqpVoicePos[playerNum][row]);
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
        showChat: function (row, type, content, voice, uid) {
            var that = this;

            if (type == "voice") {
                var url = decodeURIComponent(content);
                if (url && url.split(/\.spx/).length > 2)
                    return;
                that.playUrlVoice(row, type, content, voice, uid);
                return;
            }
            // $("playerLayer.node.info" + row).setLocalZOrder(1);
            // var scale9sprite = $("playerLayer.node.info" + row + ".qp9");
            // if (!scale9sprite) {
            //     scale9sprite = this.initQP(row);
            // }
            var effectemoji = this.getChildByName('effectemoji' + row);
            if(!effectemoji){
                return;
            }
            var scale9sprite = effectemoji.getChildByName('qp9');
            if(!scale9sprite){
                scale9sprite = this.initQP(row);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);

            var duration = 4;
            var innerNodes = [];
            scale9sprite.setCascadeOpacityEnabled(false);
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
                    text.setTextColor(cc.color(106, 57, 6));
                    // text.enableShadow(cc.color.BLACK, cc.p(1, -1));
                    text.setAnchorPoint(0, 0);
                    scale9sprite.addChild(text);
                }

                text.setString(content);

                var size = cc.size(text.getVirtualRendererSize().width + posConf.ltqpRect[row].width, posConf.ltqpRect[row].height);
                text.setPosition(
                    (size.width - text.getVirtualRendererSize().width) / 2 + posConf.ltqpTextDelta[playerNum][row].x,
                    (size.height - text.getVirtualRendererSize().height) / 2 + posConf.ltqpTextDelta[playerNum][row].y
                );
                scale9sprite.setContentSize(size);
                text.setVisible(true);
                innerNodes.push(text);
            }
            else if (type == "voice") {
                scale9sprite.setOpacity(255);
                var url = decodeURIComponent(content);
                scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
                // var arr = url.split(/\.spx/)[0].split(/-/);
                // duration = arr[arr.length - 1] / 1000;
                // playVoiceByUrl(url);

                var map = {};
                for (var i = 1; i <= 3; i++) {
                    var sp = $("speaker" + i, scale9sprite);
                    if (!sp) {
                        sp = new cc.Sprite('res/image/ui/room/speaker' + i + '.png');
                        sp.setName("speaker" + i);
                        sp.setPosition(posConf.ltqpVoicePos[playerNum][row]);
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
            scale9sprite.setScale(1.6, 1.6);
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
            if(!uid || !uid2position[uid] || !$("playerLayer.node.info" + uid2position[uid] + ".ok"))
                return;
            $("playerLayer.node.info" + uid2position[uid] + ".ok").setVisible(true);
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
                toast.setPosition(1280 / 2, cc.winSize.height / 2 * 4 / 5);
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
        changeVoice: function () {
            if (cc.sys.localStorage.getItem('yinxiaoPrecent') > 0 || cc.sys.localStorage.getItem('yinyuePrecent') > 0) {
                $('btn_voice_on').setVisible(false);
                $('btn_voice_off').setVisible(true);
            } else {
                $('btn_voice_on').setVisible(true);
                $('btn_voice_off').setVisible(false);
            }
        },
        getHuaValue: function (id) {
            if (id >= 0 && id <= 12) return 3;
            if (id >= 13 && id <= 25) return 4;
            if (id >= 26 && id <= 38) return 2;
            if (id >= 39 && id <= 51) return 1;
            if (id >= 100) return 0;
            return id;
        },
        throwCMAnim: function (row, needchip) {
            var chip = new cc.Sprite(cc.textureCache.addImage('res/submodules/psz/image/PkScene_zjh/chip' + needchip + '.png'));
            chip.setPosition($('playerLayer.node.info' + row).getPosition());
            chip.runAction(cc.moveTo(0.1, (Math.random()-0.5) * 380 + 640, (Math.random()-0.5) * 150 + 420).easing(cc.easeOut(5)));
            $('chipnode').addChild(chip);
            // console.log("chip x=" + chip.x + "  y=" + chip.y);
        },
        biPaiAnim: function (fromRow, row1, row2, cb) {
            if (position2playerArrIdx[row1] >= gameData.players.length || position2playerArrIdx[row2] >= gameData.players.length)
                return;
            if (fromRow != row1 && fromRow != row2) {
                return;
            }
            var that = this;
            TouchUtils.setOnclickListener($('shield'), function () {

            });
            var loser;
            if (fromRow == row1) loser = 2;
            else loser = 1;
            var info = {};
            var cards = {};
            for (var i = 1; i <= 2; i++) {
                cards[i] = duplicateOnlyNewLayer($(i == 1 ? 'playerLayer.node.row3b' : 'playerLayer.node.row1b'));
                for (var j = 0; j < 3; j++) {
                    cards[i].getChildByName('b' + j).setVisible(true);
                    cards[i].getChildByName('b' + j).setTexture('res/submodules/psz/image/common/pai_back3.png');
                }
                cards[i].getChildByName('status').setVisible(false);
                cards[i].setVisible(false);
                cards[i].setScale(0.5);
                cards[i].setPosition(i == 1 ? 360 : (cc.winSize.width - 360), i == 1 ? 385 : 330);
                that.addChild(cards[i], 2);
                var row = (i == 1 ? fromRow : (loser == 1 ? row1 : row2));
                info[i] = ccs.load(res.VS_json, "res/").node;
                var pos = $('playerLayer.node.info' + row).getPosition();
                info[i].setPosition(cc.p(pos.x + (cc.winSize.width/2-1280/2), pos.y));
                loadImageToSprite(gameData.players[position2playerArrIdx[row]]['headimgurl'], info[i].getChildByName('info').getChildByName('head'));
                info[i].getChildByName('info').getChildByName('lb_nickname').setString(gameData.players[position2playerArrIdx[row]]['nickname']);
                that.addChild(info[i], 2);
                (function (k) {
                    setTimeout(function () {
                        info[k].runAction(cc.sequence(
                            cc.scaleTo(0.2, 2),
                            cc.scaleTo(0.05, 1.7),
                            cc.scaleTo(0.05, 2),
                            cc.delayTime(0.3),
                            cc.spawn(
                                cc.moveTo(0.4, k == 1 ? (160) : (cc.winSize.width - 160), k == 1 ? 402 : 347).easing(cc.easeIn(3)),
                                cc.scaleTo(0.4, 0.7).easing(cc.easeIn(3))
                            ),
                            cc.scaleTo(0.1, 0.9),
                            cc.callFunc(function () {
                                cards[k].setVisible(true);
                            })
                        ));
                    }, 100);
                })(i);
            }

            setTimeout(function () {
                var bi_sp = playSpAnimation('vs1', 'VS', false);
                bi_sp.setScale(cc.winSize.width/1280);
                bi_sp.setPosition(cc.winSize.width/2, 360);
                bi_sp.setTimeScale(0.9);
                setTimeout(function () {
                    playEffect('vcompare_effect');
                }, 400);



                setTimeout(function () {
                    var loser_sp = playSpAnimation('vs1', 'shandian', false);
                    loser_sp.setPosition(cards[loser].getPosition());
                    that.addChild(loser_sp, 999);
                    setTimeout(function () {
                        for (var i = 0; i < 3; i++) {
                            cards[loser].getChildByName('b' + i).setVisible(true);
                            cards[loser].getChildByName('b' + i).setTexture('res/submodules/psz/image/PkScene_zjh/pai_backold.png');
                        }
                        loser_sp.removeFromParent();
                        setTimeout(function () {
                            for (var i = 1; i <= 2; i++) {
                                cards[i].removeFromParent();
                                info[i].removeFromParent();
                            }
                            bi_sp.removeFromParent();
                            TouchUtils.removeListeners($('shield'));
                            if (typeof cb == 'function') {
                                cb();
                            }
                        }, 1600);
                    }, 400);
                }, 600);
                that.addChild(bi_sp);

            }, 800);
        },
        checkPaiAnim: function (row, paiarr) {
            // console.log(row);
            // console.log(paiarr);
            if(paiarr == null || paiarr == undefined)  return;
            network.stop();
            if (!$('playerLayer.node.row' + row + 'b').isVisible()) {
                network.start();
                return false;
            }
            var flipTime = 0.175;
            for (var j = 0; j < paiarr.length; j++) {
                this.setPai(row, j, paiarr[j], true);
                (function (j, row) {
                    $("playerLayer.node.row" + row + 'b.b' + j).setScaleX(-1);
                    $("playerLayer.node.row" + row + 'b.b' + j).runAction(cc.sequence(
                        cc.spawn(
                            cc.scaleTo(flipTime, 0, 1),
                            cc.skewTo(flipTime, 0, 30)
                        ),
                        cc.callFunc(function () {
                            $("playerLayer.node.row" + row + 'b').setVisible(false);
                        }),
                        cc.spawn(
                            cc.scaleTo(flipTime, 1, 1),
                            cc.skewTo(flipTime, 0, 0)
                        )
                    ));
                    $("playerLayer.node.row" + row + '.a' + j).setScaleX(-1);
                    $("playerLayer.node.row" + row + '.a' + j).runAction(cc.sequence(
                        cc.spawn(
                            cc.scaleTo(flipTime, 0, 1),
                            cc.skewTo(flipTime, 0, 30)
                        ),
                        cc.callFunc(function () {
                            $("playerLayer.node.row" + row).setVisible(true);
                        }),
                        cc.spawn(
                            cc.scaleTo(flipTime, 1, 1),
                            cc.skewTo(flipTime, 0, 0)
                        )
                    ));
                })(j, row);
            }
            setTimeout(function () {
                network.start();
            }, 600);
            return true;
        },
        calcPaisInfo : function (_data) {
            var data = [];
            var players = gameData.players;
            var scale = cc.view.getFrameSize().width / cc.director.getWinSize().width;
            var theight = cc.view.getFrameSize().height / scale;
            var boardHeight = (theight - cc.director.getWinSize().height) / 2;

            var index = 0;
            // console.log(players);
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if(player.player_status == null || player.player_status == undefined) player.player_status = PLAYER_STATE_PLAYING;
                if(player.player_status == PLAYER_STATE_PLAYING || player.player_status == PLAYER_STATE_PREPAREING) {
                    var pos = uid2position[player.uid];
                    data.push({uid: player.uid});
                    for (var j = 0; j < 3; j++) {
                        var pai = $('playerLayer.node.row' + pos + '.a' + j);
                        var paiPos = pai.convertToWorldSpace(cc.p(pai.getContentSize().width / 2,
                            pai.getContentSize().height / 2));
                        var x = paiPos.x;
                        var y = paiPos.y - 0;
                        var scale = pai.getScaleX() * pai.getParent().getScaleX();
                        data[index][j] = {
                            x: x, y: y, scale: scale
                        }
                        data[index].row = pos;
                    }
                    if (_data.qiepai_uid == player.uid) {
                        data[index].qiepai = true;
                    } else {
                        data[index].qiepai = false;
                    }
                    data[index].sec = _data.sec;

                    index++;
                }
            }
            // console.log(JSON.stringify(data));
            return data;
        },
        faAllPai: function (cb) {
            var that = this;
            network.stop([3008]);
            var func = function (i, j, idx) {
                var sprite = new cc.Sprite();
                sprite.setTexture('res/submodules/psz/image/common/pai_back3.png');
                sprite.setPosition(cc.p(1280 / 2, cc.winSize.height / 2));
                sprite.setScale(0);
                that.addChild(sprite);
                var pai = $('playerLayer.node.row' + i + 'b.b' + j);
                pai.setVisible(false);
                var x = pai.getPositionX() * $('playerLayer.node.row' + i).getScaleX() + $('playerLayer.node.row' + i).getPositionX();
                var y = pai.getPositionY() * $('playerLayer.node.row' + i).getScaleY() + $('playerLayer.node.row' + i).getPositionY();
                sprite.runAction(cc.sequence(
                    cc.delayTime(0.45 * idx + 0.15 * j),
                    cc.callFunc(function () {
                        playEffect('vfapai_bg');
                    }),
                    cc.spawn(
                        cc.moveTo(0.3, x, y),
                        cc.scaleTo(0.3, $('playerLayer.node.row' + i).getScale())
                    ),
                    cc.callFunc(function () {
                        sprite.removeFromParent(true);
                        pai.setVisible(true);
                        if (idx == gameData.players.length - 1 && j == 2) {
                            if (typeof cb == 'function') {
                                cb();
                            }
                            network.start();
                        }
                    })
                ))
            };
            var row_list = [2, 1, 5, 4, 3];
            if(this.isNinePlayer())  row_list = [2, 1, 9, 8, 7, 6, 5, 4, 3];
            for (var i = 0; i < gameData.players.length; i++) {
                var row = row_list[i];
                if (!$('playerLayer.node.row' + row + 'b').isVisible()) break;
                for (var j = 0; j < 3; j++) {
                    func(row, j, i);
                }
            }
        },
        wordsFly: function (row, str, time_scale, scale) {
            time_scale = time_scale || 1;
            scale = scale || 0.9;
            var fnt = new cc.LabelBMFont(str, res.wordsfly_fnt);
            var parent = $('playerLayer.node.info' + row +".wordsNode");
            parent.addChild(fnt, 2);
            fnt.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
            fnt.setScale(0);
            fnt.runAction(cc.sequence(
                cc.scaleTo(0.1 * time_scale, scale * 1.5),
                cc.scaleTo(0.05 * time_scale, scale * 1.2),
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
        getBipaiRate : function () {
            if(decodeURIComponent(gameData.wanfaDesp).indexOf('比牌双倍开')>=0){
                return 2;
            }
            return 1;
        },
        //获取推注  2，3，4，5  2，3，5，10
        getZuidaxiazhu: function(){
            if(gameData.wanfaDesp && gameData.wanfaDesp.indexOf('2、3、5、10') >= 0){
                return 10;
            }
            return 5;
        },
        jiaBtnTextureShow : function (rate) {
            //2 3 4 5  2 3 5 10
            var tuiArr = TUIZHUARRAY[ZUIDAXIAZHU];
            rate = rate || 1;
            for(var i=2;i<=5;i++){
                var zhu = tuiArr[i-2];
                Filter.store($('jia.jia'+i), 'jia.jia'+i);
                $('jia.jia'+i).setTexture('res/submodules/psz/image/PkScene_zjh/btn_chip'+(zhu*rate)+'.png');
                Filter.useStore($('jia.jia'+i), 'jia.jia'+i);
            }
        },
        refreshBtnsStatus : function () {
            var status = selfCurrentBtnStates;
            for(var key in status){
                this.setBtnEnableState('ops.'+key, !!status[key])
            }
        },
        setBtnEnableState : function (name, val) {
            if(!$(name)){
                return;
            }
            if(val){
                this.enableBtn(name);
            }else{
                this.disableBtn(name);
            }
        },
        disableOpsBtns: function (excepts) {
            var array = ['ops.qi', 'ops.bi', 'ops.jia', 'ops.gen', 'ops.kan', 'ops.alwaysfollow', 'ops.yaman'];
            excepts = excepts || [];
            for(var i=0; i<array.length; i++){
                var name = array[i];
                if(excepts.indexOf(name)>=0)continue;
                this.disableBtn(name);
            }
        },
        disableBtn: function (btnname, type) {
            if(!$(btnname)){
                return;
            }
            TouchUtils.setClickDisable($(btnname),true);
            var resName = null;
            if(type==1){
                $(btnname).setOpacity(100);
                resName = 'res/submodules/psz/image/PkScene_zjh/mask_circle_bg.png';
            }else{
                resName = 'res/submodules/psz/image/PkScene_zjh/btn_up_bg.png';
            }
            var maskSp =  $('mask',$(btnname))
            if(!maskSp){
                maskSp = new cc.Sprite(resName);
                $(btnname).addChild(maskSp);
                maskSp.x = $(btnname).width/2;
                maskSp.y = $(btnname).height/2;
                maskSp.setName('mask');
            }
            // }else{
            //     Filter.grayMask2($(btnname));
            // }
            //
            var childs = $(btnname).getChildren();
            var len = $(btnname).getChildrenCount();
            for(var i=0; i<len; i++){
                var child = childs[i];
                if(child instanceof ccui.Text){
                    child.setOpacity(120);
                }
            }
        },
        enableBtn: function (btnname) {
            var maskSp =  $('mask', $(btnname))
            if(maskSp){
                maskSp.removeFromParent();
            }
            if(!$(btnname)){
                return;
            }
            $(btnname).setOpacity(255);
            // $(btnname).setLocalZOrder(1);
            // var texture_filename = {
            //     'ops.qi': BUTTON_COMMON_RES['red1'],
            //     'ops.bi': BUTTON_COMMON_RES['blue1'],
            //     'ops.jia': BUTTON_COMMON_RES['blue1'],
            //     'ops.gen': BUTTON_COMMON_RES['orange1'],
            //     'jia.jia2': BUTTON_COMMON_RES['orange1'],
            //     'jia.jia3': BUTTON_COMMON_RES['orange1'],
            //     'jia.jia4': BUTTON_COMMON_RES['orange1'],
            //     'jia.jia5': BUTTON_COMMON_RES['orange1'],
            // };
            // var outline_color = {
            //     'ops.qi': BUTTON_COMMON_FONT_COLOR['red'],
            //     'ops.bi': BUTTON_COMMON_FONT_COLOR['blue'],
            //     'ops.jia': BUTTON_COMMON_FONT_COLOR['blue'],
            //     'ops.gen': BUTTON_COMMON_FONT_COLOR['orange'],
            //     'jia.jia2': BUTTON_COMMON_FONT_COLOR['orange'],
            //     'jia.jia3': BUTTON_COMMON_FONT_COLOR['orange'],
            //     'jia.jia4': BUTTON_COMMON_FONT_COLOR['orange'],
            //     'jia.jia5': BUTTON_COMMON_FONT_COLOR['orange']
            // };
            // // $(btnname).setTexture(texture_filename[btnname]);
            // // $(btnname + '.txt').setTextColor(cc.color(255, 255, 255));
            // // $(btnname + '.txt').enableOutline(outline_color[btnname], 2);
            // Filter.remove($(btnname));
            TouchUtils.setClickDisable($(btnname),false);
            var childs = $(btnname).getChildren();
            var len = $(btnname).getChildrenCount();
            for(var i=0; i<len; i++){
                var child = childs[i];
                if(child instanceof ccui.Text){
                    child.setOpacity(255);
                }
            }
        },
        setOperateFinishCb: function (cb) {
            this.operateFinishCb = cb;
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
    exports.MaLayer_zjh = MaLayer_zjh;
})(window);
