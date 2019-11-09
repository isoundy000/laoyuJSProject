(function (exports) {

    var $ = null;
    var BatteryTextures = {
        "battery1": res.battery_1,
        "battery2": res.battery_2,
        "battery3": res.battery_3,
        "battery4": res.battery_4,
        "battery5": res.battery_5
    };
    var posConf = {
        //九宫格气泡的位置数据信息
        ltqpPos: {}
        //九宫格气泡的宽高数据信息
        , ltqpRect: {}
        //九宫格气泡的锚点信息
        , ltqpAnchorPoint: {
            9: {
                0: cc.p(0, 0)
                , 1: cc.p(0, 1)
                , 2: cc.p(0, 1)
                , 3: cc.p(1, 1)
                , 4: cc.p(1, 1)
                , 5: cc.p(0, 1)
                , 6: cc.p(0, 1)
                , 7: cc.p(1, 1)
                , 8: cc.p(1, 1)
            },
        }
        //九宫格气泡的资源配置信息
        , ltqpFileIndex: {
            9: {
                0: 2
                , 1: 3
                , 2: 3
                , 3: 1
                , 4: 1
                , 5: 3
                , 6: 3
                , 7: 1
                , 8: 1
            },
        }
        //九宫格气泡的拉伸部分的宽高数据信息
        , ltqpCapInsets: {
            9: {
                0: cc.rect(64, 25, 1, 1)
                , 1: cc.rect(44, 25, 1, 1)
                , 2: cc.rect(44, 25, 1, 1)
                , 3: cc.rect(26, 31, 1, 1)
                , 4: cc.rect(26, 31, 1, 1)
                , 5: cc.rect(44, 25, 1, 1)
                , 6: cc.rect(44, 25, 1, 1)
                , 7: cc.rect(26, 31, 1, 1)
                , 8: cc.rect(26, 31, 1, 1)
            },
        }
        , ltqpEmojiPos: {
            9: {
                0: cc.p(40, 28)
                , 1: cc.p(40, 28)
                , 2: cc.p(40, 28)
                , 3: cc.p(40, 28)
                , 4: cc.p(40, 28)
                , 5: cc.p(40, 28)
                , 6: cc.p(40, 28)
                , 7: cc.p(40, 28)
                , 8: cc.p(40, 28)
            },
        }
        , ltqpVoicePos: {
            9: {
                0: cc.p(70, 40)
                , 1: cc.p(70, 30)
                , 2: cc.p(70, 30)
                , 3: cc.p(70, 30)
                , 4: cc.p(70, 30)
                , 5: cc.p(70, 30)
                , 6: cc.p(70, 30)
                , 7: cc.p(70, 30)
                , 8: cc.p(70, 30)
            },
        }
        , ltqpEmojiSize: {}
        //气泡里面的对话文字的偏移坐标
        , ltqpTextDelta: {
            9: {
                0: cc.p(-1, 7)
                , 1: cc.p(0, -5)
                , 2: cc.p(0, -5)
                , 3: cc.p(-7, 2)
                , 4: cc.p(-7, 2)
                , 5: cc.p(0, -5)
                , 6: cc.p(0, -5)
                , 7: cc.p(-7, 2)
                , 8: cc.p(-7, 2)
            }
        }
    };

    var g_roomState = 0;
    var g_data = null;
    var g_option = null;
    var g_pos_to_uid = {};
    var g_uid_to_pos = {};
    var g_uid_to_sex = {};
    var g_initPaiNum = 13;
    var g_last_op = 0;
    var g_curRound = 0;
    var g_totleRound = 0;
    var g_zhuangid = 0;
    var max_player_num = 9;

    //服务器记录操作序号 随着消息刷新
    var g_seq = 0;

    var g_anim_play_rate = .82;

    var selfTottalScore = 0;
    var selfSubmitCardsInfo = null;
    var selfDealCards = null;
    var GS_ReadyNotify_MSG = null;
    var selfIsShowPai = false;

    var clearVars = function () {
        mRoom.wanfatype = undefined;

        g_data = {};//test
        g_option = null;
        g_pos_to_uid = {};
        g_uid_to_pos = {};
        g_uid_to_sex = {};
        g_roomState = 0;
        g_seq = 0;
        g_last_op = 0;
        g_curRound = 0;
        g_totleRound = 0;
        g_zhuangid = 0;
        max_player_num = 9;
        selfTottalScore = 0;
        selfSubmitCardsInfo = null;
        selfDealCards = null;
        GS_ReadyNotify_MSG = null;
        selfIsShowPai = false;
    }


    var PokerLayer_sss = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            //切home
            this.hide_listener = cc.eventManager.addCustomListener("game_on_hide", this.Game_On_Hide.bind(this));
            this.show_listener = cc.eventManager.addCustomListener("game_on_show", this.Game_On_Show.bind(this));
        },
        onExit: function () {
            window.sensorLandscape = true;
            cc.Layer.prototype.onExit.call(this)
            if (this.hide_listener) {
                cc.eventManager.removeListener(this.hide_listener);
                this.hide_listener = undefined;
            }
            if (this.show_listener) {
                cc.eventManager.removeListener(this.show_listener);
                this.show_listener = undefined;
            }

            if (this.list2103) cc.eventManager.removeListener(this.list2103);
            if (this.list1) cc.eventManager.removeListener(this.list1);
            if (this.list2) cc.eventManager.removeListener(this.list2);
        },
        getRootNode: function () {
            return this.getChildByName("Layer");
        },

        ctor: function (data) {
            var pingStorage = cc.sys.localStorage.getItem('sensorLandscape');
            if (pingStorage) {
                window.sensorLandscape = parseInt(pingStorage);
            } else {
                window.sensorLandscape = true;
            }
            window.sensorLandscape = true;

            // window.sensorLandscape = !! parseInt(cc.sys.localStorage.getItem('sensorLandscape')||1);
            // console.log("PokerLayer_sss ----------  s");
            this._super();
            clearVars();

            playMusic("vbg5", true);
            var self = this;
            if (_.isArray(data)) {
                mRoom.isReplay = true;
                g_data = data[0].data;
            } else {
                mRoom.isReplay = false
                g_data = data || {};
            }
            if (data.GameStatus !== 0) { //0 未开始
                mRoom.isStart = true;
            } else {
                mRoom.isStart = false;
            }
            mRoom.isStart = data.GameStatus !== 0;


            g_option = gameData.options;
            mRoom.Is_ztjr = !!g_option.zhongtujiaru;


            try {


                loadNodeCCS(window.sensorLandscape ? res.PlayScene_sss_json : res.PlayScene_sss_v_json, self, "Layer");
                window.gameLayer = this;
                $("Version").setString("" + window.curVersion);

            } catch (e) {

                console.log(e.stack);
                console.log(e.message);
            }
            this.clearTable4StartGame();

            this.setRoomState(0);
            this.setCurRound(data.CurrentRound, data.TotalRound);


            this.getVersion();


            if (mRoom.isReplay)
                self.addChild(new SSSReplayLayer(data, 99999));
            return true;
        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if (subArr) sub = subArr['sss'];

            var versiontxt = window.curVersion + "-" + sub;

            //给代理测试 版本代码写死
            //versiontxt = window.curVersion + "-1.1.2";

            if (mRoom.isReplay) {
                versiontxt = '';
            }

            var version = new ccui.Text();
            version.setFontSize(15);
            version.setTextColor(cc.color(255, 255, 255));
            version.setPosition(cc.p(cc.winSize.width - 10, 10));
            if (!window.sensorLandscape) {
                version.setRotation(-90)
                version.setPosition(cc.p(cc.winSize.width - 10, cc.winSize.height - 10));
            }
            version.setAnchorPoint(cc.p(1, 0.5));
            version.setString(versiontxt);
            this.addChild(version, 2);
        },
        setBeforeOnCCSLoadFinish: function (cb) {
            this.beforeOnCCSLoadFinish = cb;
        },
        getBeforeOnCCSLoadFinish: function (cb) {
            return this.beforeOnCCSLoadFinish;
        },
        setPlayerPiaoState: function (uid, state, repeat) {
            var sp = $('node.info' + g_uid_to_pos[uid] + '.piao', this.playersInfo)
            if (sp) {
                if (state) {
                    state = parseInt(state);
                }
                sp.setVisible(!!state);
            }
            // console.log("shezhi setPlayerPiaoState" + uid + "  " + state);
            if (!repeat && uid) {
                g_playerPiaoState[uid] = state;
            }
        },
        clearPlayersInfo: function () {
            for (var i = 0; i < max_player_num; i++) {
                var sp = $('node.info' + i + '.zhuang', this.playersInfo)
                if (sp) {
                    sp.setVisible(false);
                }
            }
            this.clearPlayerScore();
            this.clearPlayerBeiScore();
            this.setZhuangHead(0);
            selfSubmitCardsInfo = null;
        },
        clearTableCards: function () {
            for (var i = 0; i < max_player_num; i++) {
                var backNode = $('node.row' + i + '.backNode', this.playersInfo);
                var frontNode = $('node.row' + i + '.frontNode', this.playersInfo);
                var typeNode = $('node.row' + i + '.special_type', this.playersInfo);
                if (backNode) backNode.setVisible(false)
                if (frontNode) frontNode.setVisible(false)
                if (typeNode) typeNode.setVisible(false)
            }
            this.showRoomState('clear');
            TouchUtils.setOnclickListener($('node.row0.touch', this.playersInfo), function () {

            });
            this.hideCountDown();
        },
        clearTable4StartGame: function () {
            this.clearPlayersInfo();
            this.clearTableCards();
            this.setScoreBoardNodeInfo(0)

            this.hideCountDown();

        },
        onPlayerEnterExit: function () {

        },
        getGameStep: function () {
            return g_roomState;
        },
        showRoomState: function (state) {
            $('sp_state').setVisible(true);
            switch (state) {
                case "qiangzhuang":
                    $('sp_state').setTexture('res/submodules/sss/image/word/word_waitqiangzhuang.png');
                    break;
                case "xiazhu":
                    $('sp_state').setTexture('res/submodules/sss/image/word/word_waityazhu.png');
                    break;
                case "bipai":
                    $('sp_state').setTexture('res/submodules/sss/image/word/word_waidbipai.png');
                    break;
                default:
                    $('sp_state').setVisible(false);
            }
        },
        setRoomState: function (state) {
            g_roomState = state;

            console.log("setRoomState " + state);
            if (state == 0) {
                if (g_data.Owner == gameData.uid) {
                    // $('btnlayer.jiesan').setVisible(true);
                    // $('btnlayer.tuichu').setVisible(false);
                } else {
                    // $('btnlayer.jiesan').setVisible(false);
                    // $('btnlayer.tuichu').setVisible(true);
                }

                //$('txtRound').setString(curRound + "/" + totleRound);
                // $('setbgView.jiesan').setVisible(false);
                // if (g_curRound > 1) {
                //     // $('setbgView.jiesan').setVisible(true);
                //     $('btnlayer.jiesan').setVisible(false);
                //     $('btnlayer.tuichu').setVisible(false);
                // }
                $('invite').setVisible(!mRoom.isStart)
                // $('copy').setVisible(true)
                if (window.inReview) $('invite').setVisible(false);
            }
            //this.setCurRound(g_curRound, totleRound);

            if (state != 0) {
                // $('setbgView.jiesan').setVisible(true);
                // $('btnlayer.jiesan').setVisible(false);
                // $('btnlayer.tuichu').setVisible(false);
                $('invite').setVisible(false)
                $('copy').setVisible(false)
            }

        },
        initClubAssistant: function () {
            var that = this;
            if (res.ClubAssistant_json && mRoom.club_id && mRoom.club_id > 0) {
                this.assistant = new ClubAssistant(mRoom.club_id, mRoom.isReplay, this.isStart);
                this.addChild(this.assistant, 100);
                this.list2103 = cc.eventManager.addCustomListener("custom_listener_2103", function (event) {
                    var data = event.getUserData();
                    if (data.scene == 'home') return;
                    if (data) {
                        var cmd = data['command'];
                        var errorCode = data['result'];
                        var errorMsg = data['msg'];

                        if (errorCode && errorMsg != "没有房间") {
                            alert1(errorMsg);
                        }
                        data.scene = 'sss';
                        cc.eventManager.dispatchCustomEvent(cmd, data);
                    }
                });
                this.list2 = cc.eventManager.addCustomListener("queryClub", function (event) {
                    var data = event.getUserData();
                    if (data.scene == 'home') return;
                    refreshClubData(data['arr']);
                });
                this.list1 = cc.eventManager.addCustomListener("BroadcastUid", function (event) {
                    var data = event.getUserData();
                    if (data.scene == 'home') return;
                    if (data) {
                        var message = data['data'];
                        if (message) {
                            var type = message['type'] || '';
                            if (type == MessageType.Invite) {
                            } else if (type == MessageType.Refused) {
                                if (!(that.isStart))
                                    alert1(message['msg']);
                            }
                        }
                    }
                });
            }
        },
        onCCSLoadFinish: function () {

            var that = this;
            $ = create$(this.getRootNode());


            MicLayer.init($('btn_mic'), this, "sss");

            // EFFECT_EMOJI.init(this, $);


            if (res.PlayerInfoOtherNew_json && gameData.opt_conf && gameData.opt_conf.xinbiaoqing == 1) {
                EFFECT_EMOJI_NEW.init(this, $);
            } else {
                EFFECT_EMOJI.init(this, $);
            }


            //是否加入成功
            this.joinRoom = false;


            gameData.options = gameData.options || {};
            //三人玩  四人玩加载不同的ccs
            gameData.playerNum = gameData.options.maxPlayerCnt || 3;
            this.playersInfo = $('playersInfo');
            var playerNodes = null;
            //if (gameData.playerNum == 4) {
            playerNodes = ccs.load(window.sensorLandscape ? res.Player6_sss_json : res.Player6_sss_v_json, "res/");
            // } else {
            //     playerNodes = ccs.load(res.Player6_sss_json, "res/");
            // }
            this.playersInfo.addChild(playerNodes.node);

            this.calcPosConf();

            this.initClubAssistant();

            // playMusic('vbgKK', true);

            // this.addChild(new DealCardsLayer([3,2,14,34,55, 2,14,34,55,2, 14,34,55]));


            var isFlip = true;
            TouchUtils.setOnclickListener($('setbgView.btn_xuanxiang'), function () {
                // network.disconnect();
                if (isFlip) {
                    $('setbgView.btn_xuanxiang').setFlippedX(false);
                    isFlip = false;
                    $('setbgView.setbg').stopAllActions()
                    $('setbgView.setbg').runAction(cc.moveTo(0.3, 174, 50));
                    $('setbgView.btSetting').setVisible(true);
                    $('setbgView.btSetting').setOpacity(0);
                    $('setbgView.btSetting').stopAllActions()
                    $('setbgView.btSetting').runAction(cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.1)));
                    $('setbgView.jiesan').setVisible(true);
                    $('setbgView.jiesan').setOpacity(0);
                    $('setbgView.jiesan').stopAllActions()
                    $('setbgView.jiesan').runAction(cc.sequence(cc.delayTime(0.3), cc.fadeIn(0.1)));
                    $('setbgView.btn_ping').setVisible(false);
                    $('setbgView.btn_ping').setOpacity(0);
                    $('setbgView.btn_ping').stopAllActions()
                    $('setbgView.btn_ping').runAction(cc.sequence(cc.delayTime(0.1), cc.fadeIn(0.1)));
                } else {
                    $('setbgView.btn_xuanxiang').setFlippedX(true);
                    isFlip = true;
                    $('setbgView.setbg').stopAllActions()
                    $('setbgView.setbg').runAction(cc.moveTo(0.3, -300, 50));
                    $('setbgView.btSetting').setVisible(true);
                    $('setbgView.btSetting').setOpacity(255);
                    $('setbgView.btSetting').stopAllActions()
                    $('setbgView.btSetting').runAction(cc.sequence(cc.delayTime(0.2), cc.fadeOut(0.1)));
                    $('setbgView.jiesan').setVisible(true);
                    $('setbgView.jiesan').setOpacity(255);
                    $('setbgView.jiesan').stopAllActions()
                    $('setbgView.jiesan').runAction(cc.sequence(cc.delayTime(0.1), cc.fadeOut(0.1)));
                    $('setbgView.btn_ping').setVisible(false);
                    $('setbgView.btn_ping').setOpacity(255);
                    $('setbgView.btn_ping').stopAllActions()
                    $('setbgView.btn_ping').runAction(cc.sequence(cc.delayTime(0.3), cc.fadeOut(0.1)));
                }
            }, {});
            $('setbgView.btn_xuanxiang').setFlippedX(true);
            $('setbgView.setbg').x = -300;
            $('setbgView.btSetting').setVisible(false);
            $('setbgView.jiesan').setVisible(false);
            $('setbgView.btn_ping').setVisible(false);


            //聊天
            this.chat = $("chat");
            //邀请
            // this.invite = $("btnlayer.invite");
//             TouchUtils.setOnclickListener(this.invite, function () {
//                 // that.inviteFunc()
// console.log("this.invite,");
//                 sssRule.showCardsInfo($('row2', 2, [22,2,14,34,55]))
//             }, {});
//             this.copyroom = $("btnlayer.copyroom");
//             //复制房间
//             this.copyroom.setVisible(false);
//             TouchUtils.setOnclickListener(this.copyroom, function () {
//                 that.copyroomFunc()
//             }, {});
            //退出
            // this.tuichu = $("btnlayer.tuichu");
            // TouchUtils.setOnclickListener($("btnlayer.tuichu"), function () {
            //     // alert2('确定要退出房间吗?', function () {
            //     //     network.sendPhz(3003, "Quit/" + gameData.roomId);
            //     // }, null, false, true, true);
            //     console.log("this.tuichu,");
            // }, {});
            //解散
            // this.jiesan = $("btnlayer.jiesan");
            // TouchUtils.setOnclickListener($("btnlayer.jiesan"), function () {
            //     // network.disconnect();
            //
            //     if (window.inReview)
            //         network.sendPhz(3003, "Discard/" + gameData.roomId);
            //     else
            //         alert2('解散房间不扣房卡，是否确定解散？', function () {
            //             network.sendPhz(3003, "Discard/" + gameData.roomId);
            //         }, null, false, true, true, res.tip_mark_disroom, res.tip_icon_dis);
            // });

            //准备
            this.zhunbei = $("btnlayer.zhunbei");
            TouchUtils.setOnclickListener(this.zhunbei, function () {
                network.sendPhz(5000, "Ready");
                that.zhunbei.setVisible(false);
            });
            this.zhunbei.setVisible(false);
            $('btn_qiepai').setVisible(false);

            this.start = $("btnlayer.start");
            TouchUtils.setOnclickListener(this.start, function () {
                //network.send(3005, {room_id: gameData.roomId});

                network.sendPhz(5000, "StartImmediately");
                that.start.setVisible(false);
            });
            this.start.setVisible(false);
//
            TouchUtils.setOnclickListener($('btn_paizhuoxinxi'), function () {
                that.addChild(new WanfaInfoLayer_sss(gameData.options))
            });

            // $('chat').setVisible(false);
            // $('setbgView.jiesan').setVisible(false);
            TouchUtils.setOnclickListener($('setbgView.jiesan'), function () {
                // network.disconnect();
                // return;
                // network.sendPhz(5000, "Vote/quit/1/0/0");
                // 申请投票解散
                var fun1 = function () {
                    if (window.inReview)
                        network.sendPhz(5000, "Vote/quit/1/0/0");
                    else
                        alert2('确定要申请解散房间吗？', function () {
                            network.sendPhz(5000, "Vote/quit/1/0/0");
                        }, null, false, true, true, res.tip_mark_sqjs, res.tip_icon_default);
                };
                //房主解散房间
                var fun2 = function () {
                    if (window.inReview)
                        network.sendPhz(3003, "Discard/" + gameData.roomId);
                    else
                        alert2('解散房间不扣房卡，是否确定解散？', function () {
                            network.sendPhz(3003, "Discard/" + gameData.roomId);
                        }, null, false, true, true, res.tip_mark_sqjs, res.tip_icon_default);
                };

                //其他玩家退出房间
                var func3 = function () {
                    alert2('确定要退出房间吗?', function () {
                        network.sendPhz(5000, "Quit/" + gameData.roomId);
                    }, null, false, true, true, res.tip_mark_exitroom, res.tip_icon_exitroom);
                };

                if (mRoom.isStart) {
                    if (gameData.isSelfWatching) {
                        if (gameData.isSitNotPlay) {
                            alert1('已经坐下无法退出 请等待下局开始!')
                        } else {
                            func3();
                        }
                    } else {
                        fun1();
                    }
                } else {
                    if (mRoom.ownner == gameData.uid) {
                        fun2();
                    } else {
                        func3();
                    }
                }

            }, {});

            TouchUtils.setOnclickListener($('btn_changebg'), function () {
                var sceneid = cc.sys.localStorage.getItem('kksceneid') || 0;
                sceneid++;
                if (sceneid >= 3) {
                    sceneid = 0;
                }
                that.changeBg(sceneid);
            });

            TouchUtils.setOnclickListener($('chat'), function () {
                var chatLayer = new ChatLayer();
                that.addChild(chatLayer);
                // network.disconnect();
            });

            TouchUtils.setOnclickListener($('setbgView.btSetting'), function () {
                var setting = HUD.showLayer(HUD_LIST.Settings, that);
                setting.setSetting(that, "kaokao");//大厅里面打开界面
                setting.setSettingLayerType({hidejiesan: that});
            });

            TouchUtils.setOnclickListener($('setbgView.btn_ping'), function () {
                cc.sys.localStorage.setItem('sensorLandscape', (window.sensorLandscape) ? 0 : 1)
                if (window.sensorLandscape) {
                    alert1('设置竖屏成功，重新登录即可生效')
                } else {
                    alert1('设置横屏成功，重新登录即可生效')
                }
            });


            //that.addChild(new ShareTypeLayer(undefined, undefined,undefined, undefined, getClubData(clubid)));
            TouchUtils.setOnclickListener($('invite'), function () {
                var shareLayer = new ShareTypeLayer(undefined, gameData.roomId, {
                    desp: gameData.options.desp,
                    mapid: gameData.mapId || 340
                });
                that.addChild(shareLayer);

                // var info = $("node.info" + pos, this.playersInfo);
                // for (var i = 0; i < 5; i++) {
                //     var rowNode = $("node.row" + i, that.playersInfo);
                //     rowNode.setVisible(true);
                //     (function (rowNode) {
                //         sssRule.showCardsInfo(rowNode, 1, [2, 2, 2], function () {
                //             sssRule.showCardsInfo(rowNode, 2, [26, 2, 36, 44, 51], function () {
                //                 sssRule.showCardsInfo(rowNode, 3, [0, 2, 1, 24, 15]);
                //             })
                //         })
                //     })(rowNode)
                // }

            });
            TouchUtils.setOnclickListener($('copy'), function () {
                var parts = decodeURIComponent(gameData.options.desp).split(',');
                var mapName = "绵竹考考"
                switch (gameData.mapId) {
                    case 340:
                        mapName = "绵竹考考"
                        break;
                    case 341:
                        mapName = "四川考考"
                    case 245:
                        mapName = "十三张"
                        break;
                }

                var wanfa_str = (parts.length ? parts.join(', ') + ', ' : "");
                var regx = new RegExp('\\,', 'g');
                var content = wanfa_str.replace(regx, '/');
                var title = gameData.companyName + mapName + "-" + gameData.roomId + ",已有" + gameData.players.length + "人";
                console.log(title + "\n" + content);
                var shareurl = getShareUrl(gameData.roomId);
                savePasteBoard(title + "\n" + content + "\n" +
                    shareurl);
                alert1("复制成功");
            });

            //坐下
            TouchUtils.setOnclickListener($('btn_sitdown'), function () {
                network.wsData([
                    'Sitdown'
                ].join('/'));
                $('btn_sitdown').setVisible(false);
            });
            //btn_qiepai
            TouchUtils.setOnclickListener($('btn_qiepai'), function () {
                $("btnlayer.zhunbei").setVisible(false);
                $('btn_qiepai').setVisible(false);
                network.stop();
                network.sendPhz(5000, "Ready");
                var start = playSpine(sss_res.sp_sss_xipai_json, 'animation', false, function () {
                    console.log("切牌动画结束");
                    setTimeout(function () {
                        start.removeFromParent();
                    }, 1)
                    network.start();

                });
                if (!window.sensorLandscape) {
                    start.setRotation(-90);
                }
                //start.setPosition($('node.row' + g_uid_to_pos[arr[shootIdx].shooter], that.playersInfo).getPosition())
                start.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
                start.setName('qiepai');
                that.addChild(start);
            });
            if (!mRoom.Is_ztjr) {
                // $('btn_sitdown').setVisible(false);
                // $('tip_pangguan').setVisible(false);
                $('tip_waitnext').setVisible(false);
            }

            // this.battery = $("battery");
            // this.wifi = $("wifi");
            this.startTime();

            this.startSignal();


            var btn_mic = $("btn_mic");
            this.btn_mic = btn_mic;
            this.safenode = $("safenode");
            for (var i = 1; i <= 3; i++) {
                var safe_line = $("safe_line" + i, this.safenode);
                safe_line.setOpacity(255);
                safe_line.setVisible(false);
            }
            // this.safenode.setVisible(false)
            // btn_mic.setVisible(false);

            this.setupPlayers(g_data["Users"]);
            this.setupWatcherPlayers(g_data['WatchingUsers']);
            var offLines = g_data["Users"];
            for (var i = 0; i < offLines.length; i++) {
                var user = offLines[i];
                this.setDisconnect(user.UserID, user.Offline > 0);
            }

            $('txtRoom').setString(g_data["RoomID"]);
            $('txtType').setString(['普通', '抢庄', '看牌下注'][g_option['gametype']]);
            var wanfaStr = gameData.options["desp"];
            mRoom.wanfa = wanfaStr;
            gameData.wanfaDesp = wanfaStr;

            $('txtWanfa').setString(wanfaStr);

            // $('txtRound').setVisible(false);


            network.addListener(3013, function (data) {
                if (data) gameData.numOfCards = data["numof_cards"];
            });


            //客户端状态变更
            // this.addCustomListener(P_SSS.GS_StatusChange, this.onStatusChange.bind(this));
            //开始游戏，之后发牌
            this.addCustomListener(P_SSS.GS_GameStart, this.onGameStart.bind(this));
            //发牌
            this.addCustomListener(P_SSS.GS_CardDeal, this.onCardDeal.bind(this));
            this.addCustomListener(P_SSS.GS_RoomInfo, this.onResumeRoom.bind(this));
            this.addCustomListener(P_SSS.GS_UserJoin, this.onUserJoin.bind(this));
            //
            this.addCustomListener(P_SSS.GS_AutoAction, this.onAutoAction.bind(this));
            //玩家临时掉线，真正掉线采用 	GS_UserLeave
            this.addCustomListener(P_SSS.GS_UserDisconnect, this.onUserDisconnect.bind(this));
            //房间内断开重连
            this.addCustomListener(P_SSS.GS_Login, this.onRoleLoginOK.bind(this));
            //离开房间
            this.addCustomListener(P_SSS.GS_UserLeave, this.onLeaveOK.bind(this));

            // //到谁出牌了，开始读秒
            // this.addCustomListener(P_SSS.GS_GameTurn_Out, this.onTurnOut.bind(this));
            // //请客户端选择是否进牌
            // this.addCustomListener(P_SSS.GS_GameTurn_In, this.onTurnIn.bind(this));
            // 广播
            this.addCustomListener(P_SSS.GS_BroadcastAction, this.onBroadCast.bind(this));
            //服务器宣布游戏结束
            this.addCustomListener(P_SSS.GS_GameOver, this.onGameOver.bind(this));
            //投票广播
            this.addCustomListener(P_SSS.GS_Vote, this.onGameVote.bind(this));
            //聊天广播
            // this.addCustomListener(P_SSS.GS_Chat, this.onVoice.bind(this));

            this.addCustomListener(P_SSS.GS_Marquee, this.onMaDeng.bind(this));
            //号被顶
            this.addCustomListener(P_SSS.GS_UserKick, this.onUserKick.bind(this));


            this.addCustomListener(P_SSS.GS_Pls_Disconnect, this.Pls_Disconnect_MSG.bind(this));
            // this.addCustomListener(P_SSS.GS_Baojing_Status, this.onBaojing.bind(this));

            // this.addCustomListener(EVENT_CLEAN_ROOM, this.beginReplay.bind(this));
            // this.addCustomListener(EVENT_EATCARD, this.onEatCard.bind(this));
            // this.addCustomListener(EVENT_EATOVER, this.hideReplayAction.bind(this));

            //玩家准备状态
            // this.addCustomListener(P_SSS.GS_ReadyStatus, this.setPlayersStatus.bind(this));
            //网络连接断开
            // this.addCustomListener(P_SSS.GS_NetWorkClose, this.NetWorkCloseFunc.bind(this));


            // this.addCustomListener(P_SSS.GS_GameOver, this.onGameOver.bind(this));//长牌结算

            this.addCustomListener(P_SSS.GS_RoomResult, this.onZongGameOver.bind(this));//长牌总结算
            // this.addCustomListener(P_SSS.GS_GameStatus, this.onGameStatus.bind(this));//长牌总结算
            // this.addCustomListener(P_SSS.GS_ToGameStart, this.onChooseStartGame.bind(this));//长牌总结算

            this.addCustomListener(P.GS_Chat, function (data) {
                var fromId = data.FromUser;
                var jsData = JSON.parse(data.Msg);
                var row = g_uid_to_pos[fromId];
                var type = jsData.type;
                var content = jsData.content;
                if (jsData.type == 'text') {
                    var voice = jsData.voice; //获得文字信息
                }
                that.showChat(row, type, decodeURIComponent(content), voice, fromId);
            });

            this.addCustomListener(P_SSS.GS_ReadyNotify, function (data) {
                //{"UserID":873,"Users":[{"UserID":871,"Status":0},{"UserID":872,"Status":0},{"UserID":873,"Status":0}]}
                that.setPlayersStatus(data)
                for (var i = 0; i < data.Users.length; i++) {
                    var user = data.Users[i];
                    if (user.Status == 0) {
                        that.start.setVisible(false);
                        return;
                    }
                }
                // that.start.setVisible(false);
            });
            this.addCustomListener(P_SSS.GS_ShowStartBtn, function (data) {
                //{"UserID":873,"Users":[{"UserID":871,"Status":0},{"UserID":872,"Status":0},{"UserID":873,"Status":0}]}
                // that.setPlayersStatus(data)
                // if(data.Users.length==1)return;
                if (gameData.players && gameData.players.length <= 1)
                    return;
                // console.log(gameData.players);
                for (var i = 0; i < gameData.players.length; i++) {
                    var player = gameData.players[i];
                    if (!player.ready)
                        return;
                }

                that.start.setVisible(true);
            });
            this.addCustomListener(P_SSS.GS_GameTurn_Out, this.onTurnOut.bind(this));
            this.addCustomListener(P_SSS.GS_Hint, this.onHint.bind(this));
            this.addCustomListener(P_SSS.GS_Submit, this.onSubmit.bind(this));
            //
            this.addCustomListener(P_SSS.GS_BattleResult, this.onBattleResult.bind(this));


            this.addCustomListener(P_SSS.GS_GameChipIn, this.onXiazhu.bind(this));
            this.addCustomListener(P_SSS.GS_Qiangzhuang, this.onQiangzhuang.bind(this));

            this.addCustomListener(P_SSS.GS_Sitdown, function (data) {
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


            //设置背景图
            var scene_bg_id = cc.sys.localStorage.getItem('kksceneid') || 0;
            this.changeBg(scene_bg_id);

            network.start("load over !!!");


            // var to1 = cc.progressFromTo(2, 0, 100);
            //
            // var left = new cc.ProgressTimer(new cc.Sprite('res/submodules/sss/image/word/icon_qiangzhuang.png'));
            // left.type = cc.ProgressTimer.TYPE_RADIAL;
            // this.addChild(left);
            // left.x = 200;
            // left.y = cc.winSize.height / 2;
            // left.runAction(to1.repeatForever());
        },
        changeBg: function (sceneid) {
            // if (sceneid >= 3) {
            //     sceneid = 0;
            // }
            // console.log(sceneid);
            // cc.sys.localStorage.setItem('kksceneid', sceneid);
            //
            // $('bg').loadTexture('res/submodules/kaokao/image/game_bg_' + sceneid + '.png');
        },
        onXiazhu: function (data) {
            this.setPlayersStatus(false);

            //播放音效
            if (data.UserID) {
                for (var i = 0; i < data.Users.length; i++) {
                    if (data.Users[i].UserID == data.UserID && data.Users[i].Chip >= 0) {
                        playEffect('vtimes' + data.Users[i].Chip, g_uid_to_sex[data.UserID])
                    }
                }
            }

            //{"UserID":871,"Users":[{"UserID":871,"Chip":2},{"UserID":872,"Chip":1}]}
            var chooseCount = 0;
            for (var i = 0; i < data.Users.length; i++) {
                var info = data.Users[i];
                if (info.UserID == gameData.uid && info.Chip > 0) {
                    var qiangzhuangLayer = this.getChildByName('qiangzhuangLayer');
                    if (qiangzhuangLayer) {
                        qiangzhuangLayer.removeFromParent();
                    }
                }
                if (info.Chip > 0) {
                    chooseCount++;
                    this.setPlayerBeiScore(g_uid_to_pos[info.UserID], info.Chip)
                }
            }
            if (data.Banker && data.BankerBeilv) {
                this.setPlayerBeiScore(g_uid_to_pos[data.Banker], data.BankerBeilv)
            }

            if (chooseCount == data.Users.length) {
                this.showRoomState(0)
            } else {
                this.showRoomState('xiazhu')
                var isHasSelf = false;
                for (var i = 0; i < data.Users.length; i++) {
                    var info = data.Users[i];
                    if (info.UserID == gameData.uid && info.Chip <= 0) {
                        isHasSelf = true;
                    }
                }
                if (isHasSelf) {
                    var qiangzhuangLayer = this.getChildByName('qiangzhuangLayer');
                    if (qiangzhuangLayer) {
                        qiangzhuangLayer.startXiazhu();
                        this.showRoomState('xiazhu')
                    } else {
                        qiangzhuangLayer = new QiangzhuangLayer(selfDealCards || []);
                        qiangzhuangLayer.setName('qiangzhuangLayer');
                        qiangzhuangLayer.startXiazhu();
                        this.addChild(qiangzhuangLayer)
                        this.showRoomState('xiazhu')
                    }
                }

            }
        },
        setPlayerState: function (row, state) {
            var statesp = $('node.info' + row + '.shenfen', this.playersInfo)
            statesp.setVisible(true);
            // var name = data.Users[i].Status > 0 ? 'qiangzhuang' : 'buqiang';
            // statesp.setTexture('res/submodules/sss/image/word/icon_' + name + '.png');
            switch (state) {
                case 'qiangzhuang':
                    statesp.setTexture('res/submodules/sss/image/word/icon_qiangzhuang.png');
                    break;
                case 'buqiang':
                    statesp.setTexture('res/submodules/sss/image/word/icon_buqiang.png');
                    break;
                case 'lipai':
                    statesp.setTexture('res/submodules/sss/image/word/sikaozhong.png');
                    break;
                case 'bipai':
                    statesp.setTexture('res/submodules/sss/image/word/bipaizhong.png');
                    break;
                default:
                    statesp.setVisible(false);
            }
        },
        clearPlayerState: function (row, state) {
            var statesp = $('node.info' + row + '.shenfen', this.playersInfo)
            statesp.setVisible(false);
        },
        clearAllPlayerState: function () {
            for (var i = 0; i < 9; i++) {
                var statesp = $('node.info' + i + '.shenfen', this.playersInfo)
                statesp.setVisible(false);
            }
        },
        setZhuangHead: function (zhuangUid) {
            // console.log("setZhuangHead" + zhuangUid);
            for (var i = 0; i < max_player_num; i++) {
                if (i === g_uid_to_pos[zhuangUid]) {
                    // console.log("setZhuangHead  ---- " + zhuangUid);
                    $('node.info' + i + '.zhuang', this.playersInfo).setVisible(true)
                } else {
                    $('node.info' + i + '.zhuang', this.playersInfo).setVisible(false)
                }
            }
        },
        setPlayerBeiScore: function (row, score) {
            $('node.info' + row + '.lb_bei', this.playersInfo).setVisible(score > 0)
            $('node.info' + row + '.word_bei', this.playersInfo).setVisible(score > 0)
            $('node.info' + row + '.lb_bei', this.playersInfo).setString(score);
        },
        clearPlayerBeiScore: function (row, except) {
            if (row === undefined) {
                for (var i = 0; i < max_player_num; i++) {
                    if (i == except)continue;
                    $('node.info' + i + '.lb_bei', this.playersInfo).setVisible(false)
                    $('node.info' + i + '.word_bei', this.playersInfo).setVisible(false)
                }
            } else {
                $('node.info' + row + '.lb_bei', this.playersInfo).setVisible(false)
                $('node.info' + row + '.word_bei', this.playersInfo).setVisible(false)
            }
        },
        setPlayerStateScore: function (row, score, isShowOpe) {

            $('node.info' + row + '.fnt_score', this.playersInfo).setVisible(score >= 0)
            $('node.info' + row + '.fnt_score2', this.playersInfo).setVisible(score < 0)

            if (isShowOpe) {
                score = score >= 0 ? '+' + score : score;
            }
            $('node.info' + row + '.fnt_score', this.playersInfo).setString(score);
            $('node.info' + row + '.fnt_score2', this.playersInfo).setString(score);
        },
        clearPlayerScore: function (row) {
            if (row === undefined) {
                for (var i = 0; i < max_player_num; i++) {
                    $('node.info' + i + '.fnt_score', this.playersInfo).setVisible(false)
                    $('node.info' + i + '.fnt_score2', this.playersInfo).setVisible(false)
                }
            } else {
                $('node.info' + row + '.fnt_score', this.playersInfo).setVisible(false)
                $('node.info' + row + '.fnt_score2', this.playersInfo).setVisible(false)
            }
        },
        onQiangzhuang: function (data) {
            this.setPlayersStatus(false);
            //播放音效
            if (data.UserID) {
                for (var i = 0; i < data.Users.length; i++) {
                    if (data.Users[i].UserID == data.UserID) {
                        var bei = data.Users[i].Status;
                        if (bei == -1) {
                            bei = 0;
                        }
                        playEffect('vtimes' + bei, g_uid_to_sex[data.UserID])
                    }
                }
            }

            var that = this;
            //{"UserID":871,"Users":[{"UserID":871,"Status":1},{"UserID":872,"Status":0}],"Banker":0}
            for (var i = 0; i < data.Users.length; i++) {
                if (data.Users[i].UserID == gameData.uid && data.Users[i].Status !== 0) {
                    var qiangzhuangLayer = this.getChildByName('qiangzhuangLayer');
                    if (qiangzhuangLayer) {
                        // qiangzhuangLayer.removeFromParent();
                        qiangzhuangLayer.setVisible(false);
                    }
                }
                var row = g_uid_to_pos[data.Users[i].UserID];
                // var statesp = $('node.info' + row + '.shenfen', this.playersInfo)
                // statesp.setVisible(data.Users[i].Status !== 0);
                // var name = data.Users[i].Status > 0 ? 'qiangzhuang' : 'buqiang';
                // statesp.setTexture('res/submodules/sss/image/word/icon_' + name + '.png');
                this.setPlayerState(row, data.Users[i].Status > 0 ? 'qiangzhuang' : (data.Users[i].Status == 0 ? 'clear' : 'buqiang'))
                this.setPlayerBeiScore(row, data.Users[i].Status > 0 ? data.Users[i].Status : '');
            }

            if (data.Banker) {//开始下注
                // that.setZhuangHead(data.Banker);
                that.clearAllPlayerState();


                var startXiazhu = function () {

                    var qiangzhuangLayer = that.getChildByName('qiangzhuangLayer');
                    if (qiangzhuangLayer) {
                        qiangzhuangLayer.startXiazhu();
                        that.showRoomState('xiazhu')
                    } else {
                        qiangzhuangLayer = new QiangzhuangLayer(selfDealCards || []);
                        qiangzhuangLayer.setName('qiangzhuangLayer');
                        qiangzhuangLayer.startXiazhu();
                        that.addChild(qiangzhuangLayer)
                        that.showRoomState('xiazhu')
                    }
                    // for (var i = 0; i < data.Users.length; i++) {
                    //     var row = g_uid_to_pos[data.Users[i].UserID];
                    //     $('node.info' + row + '.shenfen', that.playersInfo).setVisible(false);
                    // }
                    that.clearAllPlayerState();

                    if (gameData.isSelfWatching) {
                        qiangzhuangLayer.removeFromParent();
                    }
                }
                //播放动画 选择庄家
                var maxPlayers = [];
                var maxScore = -1;
                for (var i = 0; i < data.Users.length; i++) {
                    if (data.Users[i].UserID == data.Banker) {
                        maxScore = data.Users[i].Status;
                    }
                }
                for (var i = 0; i < data.Users.length; i++) {
                    if (data.Users[i].Status == maxScore) {
                        maxPlayers.push(data.Users[i].UserID);
                    }
                }
                if (maxPlayers.length > 1) {
                    for (var i = 0; i < maxPlayers.length; i++) {
                        var bg = $('node.info' + g_uid_to_pos[maxPlayers[i]] + '.bg', this.playersInfo);
                        var light = bg.getChildByName('light');
                        if (light) {
                            light.setVisible(true);
                        } else {
                            light = new cc.Sprite('res/submodules/sss/image/word/light' + (g_uid_to_pos[maxPlayers[i]] == 0 ? 2 : 1) + '.png')
                            light.setName('light');
                            light.x = g_uid_to_pos[maxPlayers[i]] == 0 ? 54 : 42
                            light.y = g_uid_to_pos[maxPlayers[i]] == 0 ? 65 : 56;
                            bg.addChild(light);
                        }
                        light.runAction(cc.blink(1, 8))
                    }
                    this.scheduleOnce(function () {
                        for (var i = 0; i < maxPlayers.length; i++) {
                            $('node.info' + g_uid_to_pos[maxPlayers[i]] + '.bg.light', this.playersInfo).stopAllActions();
                            $('node.info' + g_uid_to_pos[maxPlayers[i]] + '.bg.light', this.playersInfo).setVisible(false);
                        }
                        // $('node.info' + g_uid_to_pos[data.Banker] + '.zhuang', this.playersInfo).setVisible(true)
                        that.setZhuangHead(data.Banker);


                        if (data.Banker == gameData.uid) {
                            var qiangzhuangLayer = that.getChildByName('qiangzhuangLayer');
                            if (qiangzhuangLayer) {
                                qiangzhuangLayer.removeFromParent();
                            }
                            that.showRoomState('xiazhu')
                            that.setZhuangHead(data.Banker);
                        } else {
                            startXiazhu();
                            that.setZhuangHead(data.Banker);
                            that.clearPlayerBeiScore();
                        }

                    }, 1)
                } else {

                    // $('node.info' + g_uid_to_pos[data.Banker] + '.zhuang', this.playersInfo).setVisible(true)
                    if (data.Banker == gameData.uid) {
                        var qiangzhuangLayer = that.getChildByName('qiangzhuangLayer');
                        if (qiangzhuangLayer) {
                            qiangzhuangLayer.removeFromParent();
                        }
                        that.showRoomState('xiazhu')
                        that.setZhuangHead(data.Banker);
                    } else {
                        that.clearPlayerBeiScore(undefined, g_uid_to_pos[data.Banker]);
                        startXiazhu();
                        that.setZhuangHead(data.Banker);
                    }
                }


            } else {
                this.showRoomState('qiangzhuang')
            }
        },
        setScoreBoardNodeInfo: function (dao, score1, score2) {
            // console.log("setScoreBoardNodeInfo -> " + dao + "  " + score1);
            if (dao == 0 || dao == 1) {
                selfTottalScore = 0;
            }
            selfTottalScore += (score1 || 0);
            selfTottalScore += (score2 || 0);
            if (gameData.options.debug) {
                $('scoreNode.debug').setString($('scoreNode.debug').getString() + " (" + (score1 || 0) + ' ' + (score2 || 0) + ")");
            }


            // console.log("setScoreBoardNodeInfo " + dao + " " + selfTottalScore);
            if (dao > 0 && dao <= 3) {
                $('scoreNode.dao' + dao).setVisible(true);
                $('scoreNode.kuohao' + dao).setVisible(true);
                $('scoreNode.fnt' + dao + '_1_1').setVisible(score1 >= 0);
                $('scoreNode.fnt' + dao + '_1_2').setVisible(score1 < 0);
                $('scoreNode.fnt' + dao + '_2_1').setVisible(score2 >= 0);
                $('scoreNode.fnt' + dao + '_2_2').setVisible(score2 < 0);
                $('scoreNode.fnt' + dao + '_1_1').setString('+' + score1);
                $('scoreNode.fnt' + dao + '_1_2').setString(score1);
                $('scoreNode.fnt' + dao + '_2_1').setString('+' + score2);
                $('scoreNode.fnt' + dao + '_2_2').setString(score2);
                $('scoreNode.dao' + 4).setVisible(true);
                $('scoreNode.fnt' + 4 + '_1').setVisible(selfTottalScore >= 0);
                $('scoreNode.fnt' + 4 + '_2').setVisible(selfTottalScore < 0);
                $('scoreNode.fnt' + 4 + '_1').setString('+' + selfTottalScore);
                $('scoreNode.fnt' + 4 + '_2').setString(selfTottalScore);

            } else if (dao == 4) {
                $('scoreNode.dao' + dao).setVisible(true);
                $('scoreNode.fnt' + dao + '_1').setVisible(selfTottalScore >= 0);
                $('scoreNode.fnt' + dao + '_2').setVisible(selfTottalScore < 0);
                $('scoreNode.fnt' + dao + '_1').setString('+' + selfTottalScore);
                $('scoreNode.fnt' + dao + '_2').setString(selfTottalScore);
            } else if (dao == 0) {
                for (var i = 1; i <= 3; i++) {
                    dao = i;
                    $('scoreNode.dao' + dao).setVisible(false);
                    $('scoreNode.kuohao' + dao).setVisible(false);
                    $('scoreNode.fnt' + dao + '_1_1').setVisible(false);
                    $('scoreNode.fnt' + dao + '_1_2').setVisible(false);
                    $('scoreNode.fnt' + dao + '_2_1').setVisible(false);
                    $('scoreNode.fnt' + dao + '_2_2').setVisible(false);
                }
                $('scoreNode.dao' + 4).setVisible(false);
                $('scoreNode.fnt' + 4 + '_1').setVisible(false);
                $('scoreNode.fnt' + 4 + '_2').setVisible(false);
                $('scoreNode.debug').setString('');
            }

        },
        shoot: function (data) {
            var arr = data.daqiang;
            var shootIdx = 0;
            var that = this;
            var shoot = function () {
                if (arr && arr[shootIdx]) {
                    // console.log("shooter->" + arr[shootIdx].shooter);
                    playEffect('vshoot', g_uid_to_sex[arr[shootIdx].shooter]);
                    var killedPlayer = arr[shootIdx].killedPlayer;
                    for (var i = 0; i < killedPlayer.length; i++) {
                        var player = killedPlayer[i];
                        // console.log("killed->" + player.score);
                        // if (player.uid == gameData.uid) {
                        if (g_uid_to_pos[player.uid] == 0) {
                            that.setScoreBoardNodeInfo(4, player.score)
                        }
                        //子弹动画
                        var node = $('node.row' + g_uid_to_pos[player.uid], that.playersInfo);
                        for (var x = 0; x < 3; x++) {

                            var sp = new cc.Sprite('res/submodules/sss/image/dong.png');
                            sp.setPosition(160 * Math.random() - 80, 160 * Math.random() - 80)
                            node.addChild(sp);
                            sp.setVisible(false);
                            (function (sp, x) {
                                sp.runAction(cc.sequence(cc.delayTime(0.2 * (x + 1)), cc.callFunc(function () {
                                    sp.setVisible(true);
                                    playEffect('vbullet')
                                }), cc.delayTime(1), cc.removeSelf()));
                            })(sp, x)
                        }
                    }
                    // if (arr[shootIdx].shooter == gameData.uid) {
                    if (g_uid_to_pos[arr[shootIdx].shooter] == 0) {
                        that.setScoreBoardNodeInfo(4, arr[shootIdx].score)
                    }

                    var start = playSpine(sss_res.sp_sss_effect_json, 'qiang', false, function () {
                        console.log("打枪动画结束");
                        setTimeout(function () {
                            start.removeFromParent();
                        }, 1)

                    });
                    if (!window.sensorLandscape) {
                        start.setRotation(-90);
                    }
                    start.setPosition($('node.row' + g_uid_to_pos[arr[shootIdx].shooter], that.playersInfo).getPosition())
                    start.setName('shoot');
                    that.addChild(start);


                    that.scheduleOnce(function () {
                        shootIdx++;
                        shoot();
                    }, 1)
                } else {
                    //全垒打
                    if (data.quanleida) {
                        that.showQuanleida(data.quanleida)
                    } else {
                        network.start("结束打枪");
                        that.clearAllPlayerState();
                    }
                }
            }
            shoot();
        },
        showQuanleida: function (data) {
            var that = this;
//var data = {"shooter":871,"score":28,"killedPlayer":[{"uid":871,"score":28},{"uid":872,"score":-14},{"uid":873,"score":-14}]};
            var killedPlayer = data.killedPlayer;
            for (var i = 0; i < killedPlayer.length; i++) {
                var player = killedPlayer[i];
                // console.log("killed->" + player.score);
                // if (player.uid == gameData.uid) {
                if (g_uid_to_pos[player.uid] == 0) {
                    that.setScoreBoardNodeInfo(4, player.score)
                }
            }
            // if (data.shooter == gameData.uid) {
            if (g_uid_to_pos[data.shooter] == 0) {
                that.setScoreBoardNodeInfo(4, data.score)
            }
            playEffect('vquanleida', g_uid_to_sex[data.shooter]);
            var start = playSpine(sss_res.sp_sss_effect_json, 'quanleida', false, function () {
                console.log("quanleida动画结束");
                setTimeout(function () {
                    start.removeFromParent();
                }, 1)
                if (!window.sensorLandscape) {
                    start.setRotation(-90);
                }
                network.start("全垒打结束")
            });
            start.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
            start.setName('quanleida');
            that.addChild(start);
        },
        showSpecialTypes: function (data) {
            var specialData = data.stResult
            var that = this;
            // var data = [{
            //     "uid": 871,
            //     "cardGroup": {
            //         "cardModel": [{"cardType": 1, "cards": [31, 28, 24]}, {
            //             "cardType": 5,
            //             "cards": [32, 34, 38, 42, 46]
            //         }, {"cardType": 5, "cards": [35, 39, 43, 47, 50]}], "sp": 2
            //     },
            //     "sp": 2,
            //     "scoreMap": [{"uid": 872, "score": 0}, {"uid": 872, "score": 0}]
            // }];
            var specialStepIdx = 0;
            var special = function () {
                var stepData = specialData[specialStepIdx];
                if (stepData) {
                    // console.log("特殊牌型" + specialStepIdx);
                    // console.log("分数" + JSON.stringify(stepData.scoreMap));

                    for (var i = 0; i < stepData.scoreMap.length; i++) {
                        // if (stepData.scoreMap[i]['uid'] == gameData.uid) {
                        if (g_uid_to_pos[stepData.scoreMap[i]['uid']] == 0) {
                            that.setScoreBoardNodeInfo(4, stepData.scoreMap[i]['score'])
                        }
                    }
                    var cardModel = stepData.cardGroup.cardModel;
                    var paiArr = cardModel[0].cards.concat(cardModel[1].cards).concat(cardModel[2].cards)

                    sssRule.showAllCardsInfo($('node.row' + g_uid_to_pos[stepData.uid], that.playersInfo), paiArr, stepData.sp)

                    var spineAnimNames = ['', 'santonghua', 'sanshunzi', 'liuduiban', 'yitiaolong', 'zhizunqinglong'];
                    network.stop(undefined, "特殊牌型动画")
                    playEffect('vspecial_type_' + stepData.sp, g_uid_to_sex[stepData.uid]);
                    var start = playSpine(sss_res.sp_sss_effect_json, spineAnimNames[stepData.sp], false, function () {
                        console.log("开始动画结束");
                        network.start("特殊牌型");
                        that.clearAllPlayerState();
                        setTimeout(function () {
                            start.removeFromParent();
                        }, 1)
                    });
                    if (!window.sensorLandscape) {
                        start.setRotation(-90);
                    }
                    start.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
                    start.setName('special');
                    that.addChild(start);


                    specialStepIdx++;
                    that.scheduleOnce(function () {
                        special();
                    }, 1)
                } else {
                    that.scheduleOnce(function () {
                        that.shoot(data);
                    }, 1)
                }
            }
            special();
        },
        onBattleResult: function (data) {
            if (mRoom.isReplay) {
                data.br0 = data.Br0;
                data.br1 = data.Br1;
                data.br2 = data.Br2;
                data.daqiang = data.Daqiang;
                data.quanleida = data.Quanleida;
                data.reconnect = data.Reconnect;
                data.specialUid = data.SpecialUid;
                data.stResult = data.StResult;
            }
            if (HUD.getTipLayer().getChildByName('MessageBox')) {
                HUD.getTipLayer().getChildByName('MessageBox').removeFromParent();
            }
            //排序
            for (var i = 0; i < 3; i++) {
                var br = data['br' + i];
                if (br && br.length > 0) {
                    for (var j = 0; j < br.length; j++) {
                        var paiArr = br[j];
                        paiArr.cardModel.cards.sort(function (a, b) {
                            return (a % 100) - (b % 100);
                        })
                    }
                }
            }


            if (data.reconnect) {
                $('copy').setVisible(false)
                var that = this;
                for (var i = 0; i < 3; i++) {
                    var br = data['br' + i];
                    if (br && br.length > 0) {
                        for (var j = 0; j < br.length; j++) {
                            var paiArr = br[j];
                            $('node.row' + g_uid_to_pos[paiArr.uid], that.playersInfo).setVisible(true)
                            sssRule.showCardsInfo($('node.row' + g_uid_to_pos[paiArr.uid], that.playersInfo), i + 1, paiArr.cardModel, undefined, true)
                            // console.log(JSON.stringify(paiArr));
                            // if (paiArr.uid == gameData.uid) {
                            if(g_uid_to_pos[paiArr.uid] == 0){
                                that.setScoreBoardNodeInfo(i + 1, paiArr.score, paiArr.additionalScore)
                            }
                        }
                    }
                }
                if (data.stResult && data.stResult.length > 0) {
                    var stResult = data.stResult;
                    for (var i = 0; i < stResult.length; i++) {
                        var info = stResult[i];
                        // sssRule.showAllCardsInfo($('node.row' + g_uid_to_pos[paiArr.uid], that.playersInfo), i + 1, info.cardModel, undefined, true)
                        var model = info.cardGroup.cardModel
                        var cards = model[0].cards.concat(model[1].cards).concat(model[2].cards)
                        sssRule.showAllCardsInfo($('node.row' + g_uid_to_pos[info.uid], that.playersInfo), cards, info.sp);
                        for (var j = 0; j < info.scoreMap.length; j++) {
                            var scoreInfo = info.scoreMap[j];
                            // if (scoreInfo.uid == gameData.uid) {
                            if(g_uid_to_pos[scoreInfo.uid] == 0){
                                that.setScoreBoardNodeInfo(4, scoreInfo.score)
                            }
                        }
                    }
                }
                for (var i = 0; i < data.daqiang.length; i++) {
                    var killedPlayer = data.daqiang[i].killedPlayer;
                    for (var j = 0; j < killedPlayer.length; j++) {
                        var player = killedPlayer[j];
                        // console.log("killed->" + player.score);
                        // if (player.uid == gameData.uid) {
                        if(g_uid_to_pos[player.uid] == 0){
                            that.setScoreBoardNodeInfo(4, player.score)
                        }
                    }
                    // if (data.daqiang[i].shooter == gameData.uid) {
                    if (g_uid_to_pos[data.daqiang[i].shooter] == 0){
                        that.setScoreBoardNodeInfo(4, data.daqiang[i].score)
                    }
                }
                if (data.quanleida) {
                    var killedPlayer = data.quanleida.killedPlayer;
                    for (var i = 0; i < killedPlayer.length; i++) {
                        var player = killedPlayer[i];
                        // console.log("killed->" + player.score);
                        // if (player.uid == gameData.uid) {
                        if(g_uid_to_pos[player.uid] == 0){
                            that.setScoreBoardNodeInfo(4, player.score)
                        }
                    }
                    // if (data.quanleida.shooter == gameData.uid) {
                    if(g_uid_to_pos[data.quanleida.shooter]==0){
                        that.setScoreBoardNodeInfo(4, data.quanleida.score)
                    }
                }
                return;
            }


            var that = this;
            network.stop(undefined, '小结算');
            var curStepi = 0;
            var curStepj = 0;
            var calcStep = function () {
                var paiArr = data['br' + curStepi];
                if (curStepj < paiArr.length - 1) {
                    curStepj++;
                } else {
                    curStepi++;
                    curStepj = 0;
                    for (var x = 0; x < paiArr.length; x++) {
                        // if (paiArr[x].uid == gameData.uid) {
                        if(g_uid_to_pos[paiArr[x].uid]==0){
                            that.setScoreBoardNodeInfo(curStepi, paiArr[x].score, paiArr[x].additionalScore)
                        }
                    }
                }
                if (curStepi >= 3) {
                    //处理特殊牌型
                    if (data.stResult && data.stResult.length > 0) {
                        that.showSpecialTypes(data);
                    } else {
                        that.scheduleOnce(function () {
                            that.shoot(data);
                        }, 1)
                    }

                    // that.setScoreBoardNodeInfo(4)
                    // network.start();


                    return;
                }
                stepFunc(curStepi, curStepj)
            }
            var stepFunc = function (i, j, isStepOver) {
                //console.log(i + "   " + j);
                var paiArr = data['br' + i];
                //console.log("stepFunc" + g_uid_to_pos[paiArr[j].uid]);
                var type = paiArr[j].cardModel.cardType;
                if (type == 4 && i == 0) {
                    type = '4_2'
                }
                if (type == 7 && i == 1) {
                    type = '7_2'
                }
                playEffect('vnormal_type_' + type, g_uid_to_sex[paiArr[j].uid])
                sssRule.showCardsInfo($('node.row' + g_uid_to_pos[paiArr[j].uid], that.playersInfo), i + 1, paiArr[j].cardModel, function () {
                    calcStep();
                })
            }
            if (data['br' + 0].length == 0) {
                if (data.stResult && data.stResult.length > 0) {
                    that.showSpecialTypes(data);
                }
            } else {
                stepFunc(curStepi, curStepj)
            }

            for (var i = 0; i < that.playersNum; i++) {
                that.setPlayerState(i, 'bipai')
            }
            TouchUtils.removeListeners($('node.row0.touch', this.playersInfo))
        },
        onSubmit: function (data) {
            playEffect('vsssliangpai')
            if (mRoom.isReplay) {
                data.cardGroup = data.CardGroup;
                data.spUids = data.SpUids
                data.submitedUids = data.SubmitedUids
            }
//{"err":null,"cardGroup":{"cardModel":[
// {"cardType":1,"cards":[14,18,33]},{"cardType":2,"cards":[50,49,45,2,37]},{"cardType":6,"cards":[5,9,17,21,25]}],"sp":null},
// "submitedUids":[871]}
            var that = this;
            if (!data.err) {
                if (data.cardGroup && data.cardGroup.cardModel) {
                    for (var j = 0; j < data.cardGroup.cardModel.length; j++) {
                        console.log("paixu -------");
                        data.cardGroup.cardModel[j].cards.sort(function (a, b) {
                            return (a % 100) - (b % 100);
                        })
                    }
                }

                var submitedUids = data.submitedUids;
                for (var i = 0; i < that.playersNum; i++) {
                    if (submitedUids.indexOf(g_pos_to_uid[i]) >= 0) {
                        that.clearPlayerState(i)
                    } else {
                        that.setPlayerState(i, 'lipai')
                    }
                }
                if (submitedUids.indexOf(gameData.uid) >= 0) {
                    var dealCardsLayer = this.getChildByName('dealCardsLayer')
                    if (dealCardsLayer) {
                        dealCardsLayer.removeFromParent();
                    }
                    //出现自己的牌堆
                    // console.log("                //出现自己的牌堆")
                    var paiArr = [];
                    for (var i = 0; i < submitedUids.length; i++) {
                        var row = g_uid_to_pos[submitedUids[i]];
                        if ((data.cardGroup) && row == 0) {
                            if (selfSubmitCardsInfo) {
                                continue;
                            }
                            selfSubmitCardsInfo = selfSubmitCardsInfo || data.cardGroup;
                            var cards = selfSubmitCardsInfo.cardModel;
                            paiArr = cards[0].cards.concat(cards[1].cards).concat(cards[2].cards)
                            // var isShow = false;
                            console.log("zhuce");
                            (function (row) {
                                TouchUtils.setOnclickListener($('node.row0.touch', that.playersInfo), function () {
                                    // console.log("TouchUtils" + JSON.stringify(selfSubmitCardsInfo));
                                    var cards = null;
                                    var paiArr = null;
                                    if (selfSubmitCardsInfo) {
                                        cards = selfSubmitCardsInfo.cardModel;
                                    }
                                    if (cards) {
                                        paiArr = cards[0].cards.concat(cards[1].cards).concat(cards[2].cards)
                                    }
                                    if (!selfIsShowPai) {
                                        sssRule.showAllCardsInfo($('node.row' + row, that.playersInfo), row == 0 ? (paiArr || []) : [], row == 0 ? selfSubmitCardsInfo.sp : undefined)
                                        selfIsShowPai = true;
                                    } else {
                                        sssRule.showAllCardsInfo($('node.row' + row, that.playersInfo), [], undefined, selfSubmitCardsInfo.sp);
                                        selfIsShowPai = false;
                                    }
                                })
                            })(row);

                        }
                        //sssRule.showAllCardsInfo($('node.row' + row, this.playersInfo), row == 0 ? paiArr : [], row == 0 ? selfSubmitCardsInfo.sp : undefined)
                        //修改为不默认显示自己的牌 玩家自己点击
                        // if (row !== 0)
                        sssRule.showAllCardsInfo($('node.row' + row, this.playersInfo), [], undefined, data.spUids.indexOf(submitedUids[i]) >= 0, row == 0 && selfIsShowPai);
                    }
                } else {
                    console.log("玩家 选择好排了---" + submitedUids);
                    for (var i = 0; i < submitedUids.length; i++) {
                        var row = g_uid_to_pos[submitedUids[i]];
                        sssRule.showAllCardsInfo($('node.row' + row, this.playersInfo), [], undefined, data.spUids.indexOf(submitedUids[i]) >= 0)


                    }
                }
            } else {
                console.log(data.err);
                switch (data.err.err) {
                    case 1:
                        alert1("请检查您的牌数量是否正确！")
                        break;
                    case 2:
                        alert1("请检查您的牌数量是否正确！")
                        break;
                    case 3:
                        alert1("倒水了!")
                        break;
                    default:
                        alert1("未知错误")
                }
            }
        },
        onHint: function (data) {
            this.hideCountDown();
            // this.clearPlayerScore()
            // var data = {"cardGroup":[{"cardModel":
            // [{"cardType":6,"cards":[10,14,18,34,5310]},{"cardType":2,"cards":[5311,5343,47,2,49]},{"cardType":1,"cards":[5334,33,42]}],"sp":null},
            // {"cardModel":[{"cardType":5,"cards":[38,42,47,49,2]},{"cardType":3,"cards":[34,33,31,29,25]},{"cardType":1,"cards":[10,14,18]}],"sp":null},
            // {"cardModel":[{"cardType":5,"cards":[1053,1053,42,47,49]},{"cardType":2,"cards":[31,29,2,25,33]},{"cardType":1,"cards":[10,14,18]}],"sp":null}]}
            this.showRoomState('clear')

            if (gameData.isSelfWatching) {
                return;
            }

            for (var i = 0; i < data.cardGroup.length; i++) {
                var obj = data.cardGroup[i];
                for (var j = 0; j < obj.cardModel.length; j++) {
                    obj.cardModel[j].cards.sort(function (a, b) {
                        return (a % 100) - (b % 100);
                    })
                }
            }

            var that = this;
            var firstData = data.cardGroup[0];
            var secondData = data.cardGroup[1];
            if (!firstData.sp) {
                secondData = firstData;
            }
            var openDealCardsLayer = function () {
                console.log("openDealCardsLayer");
                var cards = [];
                if (secondData) {
                    cards = [].concat(secondData.cardModel[2].cards).concat(secondData.cardModel[1].cards).concat(secondData.cardModel[0].cards);
                } else {
                    cards = [].concat(firstData.cardModel[2].cards).concat(firstData.cardModel[1].cards).concat(firstData.cardModel[0].cards);
                }
                var dealCardsLayer = new DealCardsLayer({
                    types: firstData.sp ? data.cardGroup.slice(1, data.cardGroup.length) : data.cardGroup,
                    cards: cards,
                    special: firstData.sp ? firstData : null
                });
                dealCardsLayer.setName('dealCardsLayer')
                that.addChild(dealCardsLayer);

                // dealCardsLayer.showCountDown(0, 150);
            }
            if (firstData.sp) {
                HUD.showConfirmBox('提示', '是否按特殊牌型(' + sssRule.getSpecialTypeName(firstData.sp) + ")出牌？\n取消后点'特'按钮即可再报道", function () {
                    var cmd = "Submit/" + gameData.curRound + "/"
                    var shangArr = firstData.cardModel[2].cards
                    var zhongArr = firstData.cardModel[1].cards
                    var xiaArr = firstData.cardModel[0].cards

                    cmd += shangArr.join(',');
                    cmd += ("/" + zhongArr.join(','));
                    cmd += ("/" + xiaArr.join(','));
                    cmd += ("/" + firstData.sp)
                    network.sendPhz(5000, cmd);
                }, '确定', function () {
                    openDealCardsLayer();
                }, '取消')
            } else {
                openDealCardsLayer();
            }
            for (var i = 0; i < that.playersNum; i++) {
                that.setPlayerState(i, 'lipai');
            }
        },
        onResumeRoom: function (data) {
            this.clearTable4StartGame();


            if (data.GameStatus !== 0) { //0 未开始
                mRoom.isStart = true;
            } else {
                mRoom.isStart = false;
            }
            mRoom.isStart = data.GameStatus !== 0;

            var totleRound = gameData.options.jushu;
            // this.setCurRound(data.GameSeq, totleRound);
            // this.setRoomState(data.GameStatus);

            // g_curRound = data.GameSeq;

            var players = [];
            for (var i = 0; i < data.Players.length; i++) {
                var info = data.Players[i];
                players.push(info.User);
            }
            console.log("room info -----");
            this.setupPlayers(players);


        },
        // //改变桌面背景图
        // changeBg: function (sceneid) {
        //     if (sceneid > 3) {
        //         sceneid = 0;
        //     }
        //
        //     TouchUtils.setOnclickListener($('bg'), function () {
        //
        //     }, {effect: TouchUtils.effects.NONE});
        //     TouchUtils.setClickDisable($('bg'), true);
        // },
        setPlayerAvator: function (pos, url, uid) {
            //头像
            var info = $("node.info" + pos, this.playersInfo);
            var headbg = $("node.info" + pos + ".head", this.playersInfo);
            if (url == 'hide') {
                headbg.setVisible(false);
                info.setVisible(false);
                return;
            } else {
                headbg.setVisible(true);
                info.setVisible(true);
            }
            console.log("setPlayerAvator  " + url)
            if (url == undefined || url == "" || url == null) {
                url = "res/image/defaultHead.jpg";
            }
            // var headbg = headbg.getChildByName('head');
            // headbg.setLocalZOrder(-1);
            loadImageToSprite(url, headbg);//头像
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
            if (mRoom.isReplay) {
                lbTime.setString('');
                return;
            }
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
        showPlayerInfoPanel: function (idx) {
            console.log("showPlayerInfoPanel");
            if (window.inReview)
                return;
            var uid = g_pos_to_uid[idx];

            if (!uid)
                return;

            var that = this;

            //var playerInfo = gameData.players[position2playerArrIdx[idx]];
            var playerInfo = null;
            for (var i = 0; i < gameData.players.length; i++) {
                if (gameData.players[i].UserID == uid) {
                    playerInfo = gameData.players[i];
                    break;
                }
            }

            var showAniBtn = true
            if (playerInfo == null || playerInfo == undefined) {


                playerInfo = this.getWatchUserInfoByUid(uid);
            }
            // playerInfo.uid = playerInfo.UserID;
            // playerInfo.nickname = playerInfo.NickName;
            // playerInfo.ip = playerInfo.IP;
            // playerInfo.headimgurl = playerInfo.HeadIMGURL;
            // playerInfo.sex = playerInfo.Sex;

            //console.log(JSON.stringify(playerInfo));
            //合并成为一个功能块
            // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, '13shui', false);
            // this.addChild(this.playerInfoLayer);

            if (res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1) {
                this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false);
                this.addChild(this.playerInfoLayer);
            } else {
                this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, '13shui', false);
                this.addChild(this.playerInfoLayer);
            }
        },
        calcPosConf: function () {
            for (var i = 0; i < max_player_num; i++) {
                var row = i;
                var ltqp = $("playersInfo.node.info" + row + ".qp");
                if (ltqp) {
                    posConf.ltqpPos[row] = ltqp.getPosition();
                    posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                    posConf.ltqpEmojiSize[row] = cc.size({
                        9: {
                            0: 140,
                            1: 140,
                            2: 140,
                            3: 140,
                            4: 140,
                            5: 140,
                            6: 140,
                            7: 140,
                            8: 140,
                        },
                    }[max_player_num][row], posConf.ltqpRect[row].height);
                    ltqp.removeFromParent();
                } else {
                    console.log("未找到---");
                }
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
                that.scheduleOnce(function () {
                    window.soundQueue.shift();
                    that.playVoiceQueue();
                }, queue.duration);
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
            $("playersInfo.node.info" + row).setLocalZOrder(1);
            var scale9sprite = $("playersInfo.node.info" + row + ".qp9");
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("playersInfo.node.info" + row).addChild(scale9sprite, 2);
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

            // $("playersInfo.node.info" + row).setLocalZOrder(1);

            var scale9sprite = $("playersInfo.node.info" + row + ".qp9");
            if (!scale9sprite) {
                scale9sprite = new cc.Scale9Sprite(res["ltqp" + posConf.ltqpFileIndex[max_player_num][row] + "_png"], posConf.ltqpRect[row], posConf.ltqpCapInsets[max_player_num][row]);
                scale9sprite.setName("qp9");
                scale9sprite.setAnchorPoint(posConf.ltqpAnchorPoint[max_player_num][row]);
                scale9sprite.setPosition(posConf.ltqpPos[row]);
                $("playersInfo.node.info" + row).addChild(scale9sprite, 2);
            }

            for (var i = (cc.sys.isNative ? 0 : 1); i < scale9sprite.getChildren().length; i++)
                scale9sprite.getChildren()[i].setVisible(false);

            var duration = 4;
            var innerNodes = [];
            scale9sprite.setCascadeOpacityEnabled(false);
            scale9sprite.setScale(1);
            if (type == "emoji") {
                scale9sprite.setOpacity(0);

                //表情动画
                // var index = content.substring(10, 11);
                // var ccsScene = ccs.load(res['expression' + index], "res/");
                // var express = ccsScene.node;
                // express.setName("express");
                // express.setPosition(cc.p(scale9sprite.getContentSize().width / 2 + 20, scale9sprite.getContentSize().height / 2));
                // scale9sprite.addChild(express);
                // express.runAction(ccsScene.action);
                // ccsScene.action.play('action', true);
                // this.scheduleOnce(function () {
                //     express.removeFromParent();
                // }, 2);
                if (content.indexOf("sp_") == 0) {
                    var sprite = $("emoji", scale9sprite);
                    if (sprite) {
                        sprite.removeFromParent();
                        sprite = null;
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
                } else {
                    var index = content.substring(10, 11);
                    if (content.indexOf("png") < 0) {
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
            } else if (type == 'biaoqingdonghua') {
                var data = JSON.parse(content);

                //关闭表情  只能看到自己给别的  看不到别人给自己的
                if (gameData.biaoQingFlag == 0 && !(data.from_uid == gameData.uid && data.target_uid != gameData.uid)) {
                    scale9sprite.setVisible(false);
                    return;
                }
                scale9sprite.setVisible(false);

                // if(data.emoji_idx == 6){
                //     PlayerInfoLayer.showJiaTeLin(data.from_uid, data.target_uid, data.emoji_idx, data.emoji_times);
                // }else {
                //     PlayerInfoLayer.addEffectEmojiQueue(data.from_uid, data.target_uid, data.emoji_idx, data.emoji_times);
                // }
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
        // 刷新分数
        updateScore: function (pos) {
            // var users = gameData.players;
            // var userIndex = this["pos" + pos];
            // var userID = null;
            // if (users[userIndex] && users[userIndex].ID) {
            //     userID = users[userIndex].ID;
            //     var score = mRoom.scoreInfo[userID] || 0;
            //     if (mRoom.wanfatype == mRoom.YOUXIAN) {
            //         //this["txtScore" + pos].setString("总分:" + score);
            //     } else {
            //         //this["txtScore" + pos].setString("得分:" + score);
            //     }
            // }
        },
        setDisconnect: function (uid, flag) {
            var row = g_uid_to_pos[uid];
            var offline = $("node.info" + row + ".offline", this.playersInfo);
            if (!offline)return;
            offline.setVisible(flag);

            // var disconnect = head.getChildByName('disconnect');
            // if(disconnect)
            //     disconnect.removeFromParent();
            // if(!flag)
            //     return;
            // // if (!disconnect) {
            //     disconnect = new cc.Sprite('res/submodules/sss/image/disconnect.png');
            //     disconnect.setName('disconnect');
            //     disconnect.setPosition(cc.p(head.getContentSize().width / 2, head.getContentSize().height / 2 - 2));
            //     disconnect.setScale(1.5);
            //     head.addChild(disconnect);
            // }
            // disconnect.setVisible(flag);
            console.log(uid + "  discon --- " + flag);
        },
        setupWatcherPlayers: function (watchers) {
            console.log("setupWatcherPlayers");
            if (gameData.isSelfWatching && watchers) {
                gameData.isSitNotPlay = false;
                $("node.info" + 0, this.playersInfo).setVisible(false)
                console.log("setupWatcherPlayers2222");
                $("node.row" + 0, this.playersInfo).setVisible(false)
                $('btn_sitdown').setVisible(true)
                $('tip_waitnext').setVisible(false)
                for (var x = 0; x < watchers.length; x++) {
                    var user = watchers[x];
                    if (user.UserID == gameData.uid && user.User.Sitdowning) {
                        $('btn_sitdown').setVisible(false)
                        $('tip_waitnext').setVisible(true)
                        gameData.isSitNotPlay = true;
                    }
                }
            } else {
                $('btn_sitdown').setVisible(false)
                $('tip_waitnext').setVisible(false)
            }
        },
        setupPlayers: function (players) {
            if (players) {
                gameData.players = players;
            }

            var that = this;

            var data = gameData.players || [];
            gameData.playerMap = {};
            for (var i = 0; i < data.length; i++) {
                gameData.playerMap[data[i].UserID] = data[i];
            }

            var pos = -1;
            if (mRoom.isReplay == true) {
                pos = 0;
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].UserID == gameData.uid) {
                        pos = i;
                    }
                }
                if (pos == -1) {//列表没有自己 则自己处于观看模式
                    pos = 1;
                    gameData.isSelfWatching = true;
                } else {
                    gameData.isSitNotPlay = false;
                    gameData.isSelfWatching = false;
                    //将玩家列表重新排序 自己放到队列首部
                    while (gameData.players[0].UserID != gameData.uid) {
                        var obj = gameData.players.shift();
                        gameData.players.push(obj);
                    }
                    pos = 0;
                }
            }
            this.playersNum = gameData.players.length;
            this.pos0 = pos;
            for (var i = 1; i <= 9; i++) {
                this['pos' + i] = (pos + i) % max_player_num;
            }
            // this.pos1 = (pos + 1) % this.playersNum;
            // this.pos2 = (pos + 2) % this.playersNum;
            // this.pos3 = (pos + 3) % this.playersNum;

            //邀请俱乐部成员
            var currentRound = g_curRound || 1;
            if (this.isStart == true || currentRound > 1) {
                if (this.assistant) this.assistant.setVisible(false);
            }
            if (data.length >= max_player_num) {
                var clubMemberInviteLayer = this.getChildByName('clubMemberInviteLayer');
                if (clubMemberInviteLayer) {
                    clubMemberInviteLayer.removeFromParent(true);
                }
                if (this.assistant) this.assistant.setVisible(false);
            } else {
                if (mRoom.club_id) {
                    if (this.assistant) this.assistant.setVisible(!(this.isStart == true || currentRound > 1));
                }
            }
            if (mRoom.isReplay) {
                if (this.assistant) this.assistant.setVisible(false);
            }


            g_pos_to_uid = {};
            g_uid_to_pos = {};
            g_uid_to_sex = {};
            console.log("setupPlayers   ====");

            for (var i = 0; i < this.playersNum; i++) {
                var idx = gameData.isSelfWatching ? this['pos' + i] - 1 : this['pos' + i];
                var row = gameData.isSelfWatching ? i + 1 : i;
                var info = gameData.players[idx];
                console.log(idx + "     " + row);
                if (!info) {
                    console.log(info);
                    // $("node.info" + row, this.playersInfo).setVisible(false);
                    // $("node.row" + row, this.playersInfo).setVisible(false);
                } else {
                    console.log(info)
                    console.log("设置头像id" + info.UserID + "  row = " + row + " name = " + info.nickname);
                    g_pos_to_uid[row] = info.UserID;
                    g_uid_to_pos[info.UserID] = row;
                    g_uid_to_sex[info.UserID] = info.Sex || 1;
                    $("node.info" + row + ".lb_nickname", this.playersInfo).setString(ellipsisStr(info.nickname, 5));
                    // $("node.info" + row + ".txtHX" , this.playersInfo).setString(info.ID);
                    // $("node.info" + row + ".txt_point" , this.playersInfo).setString('');
                    $("node.info" + row + ".lb_score", this.playersInfo).setString(info.Score || 0);
                    this.setPlayerAvator(row, decodeURIComponent(info.headimgurl), info.UserID);
                    // $("node.row" + row, this.playersInfo).setVisible(false);
                }
            }
            for (; i <= 9; i++) {
                var row = gameData.isSelfWatching ? i + 1 : i;
                var info = $("node.info" + row, this.playersInfo)
                var rowN = $("node.row" + row, this.playersInfo)
                if (info) {
                    info.setVisible(false);
                }
                if (rowN) {
                    rowN.setVisible(false);
                }
            }


            // for (var i = 0; i < this.playersNum; i++) {
            //     if (data[this["pos" + i]]) {
            //         this.updateScore(i);
            //     }
            // }
            for (var i = 0; i < this.playersNum; i++) {
                (function (i) {
                    var headbg = $("node.info" + i + ".head", that.playersInfo);
                    console.log("touxiang dianji -> " + i);
                    console.log(headbg);
                    TouchUtils.setOnclickListener(headbg, function () {
                        if (!mRoom.isReplay) {
                            that.showPlayerInfoPanel(i);
                        }
                    })
                })(gameData.isSelfWatching ? i + 1 : i);
            }

            return;//2018年10月18日11:17:03 暂时关闭定位
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

        showCountDown: function (row, leftTime) {
            if (leftTime <= 0)
                return;
            var that = this;
            // var posObj = {0: cc.p(1070, 170), 1: cc.p(960, 600), 2: cc.p(320, 600)}
            $('cd').setVisible(true);
            // $('cd').setPosition(posObj[row] || cc.p(640, 360));
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            var time = Math.floor(leftTime);
            $('cd.cdtext').setString(time);
            this.timeInterval = setInterval(function () {
                time--;
                if (time < 0) {
                    clearInterval(that.timeInterval);
                    that.timeInterval = undefined
                    time = 0;
                }
                $('cd.cdtext').setString(time);
            }, 1000)
        },
        hideCountDown: function () {
            $('cd').setVisible(false);
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            this.timeInterval = undefined
        },
        // 注册自定义事件
        addCustomListener: function (type, func) {
            // network.addListener(ProTyp.SSS + "_" + type, func);
            network.addListener(type, func);
        },
        onPushCard: function (data) {

        },
        //开局偷牌结束后 通知玩家的状态
        onAllAnCard: function (data) {

        },
        onChooseStartGame: function (data) {
            this.start.setVisible(data.UserID == gameData.uid);

        },
        onGameStatus: function (data) {
        },
        onZongGameOver: function (data) {
            // this.addChild(new KKZongJiesuanLayer(data));
            // var layer = this.getChildByName('jiesuan');
            // if (layer) {
            //     layer.openZongjiesuan(data);
            // } else {
            //
            // }
            this.addChild(new ZongJiesuanLayerSSS(data));

            // cc.error('总结算-- ！！！！！')

            // gameData.roomId = 0;
            // clearGameMWRoomId();
            // window.paizhuo = null;
            // HUD.showScene(HUD_LIST.Home, this);
        },
        onGameOver: function (data) {
            var that = this;
            var jiesuanLayer = null;
            // setTimeout(function () {

            // }, 100);
            this.hideCountDown();
            this.clearAllPlayerState()

            if (!gameData.isSelfWatching) {
                this.zhunbei.setVisible(true);
                $('btn_qiepai').setVisible(true);
            }

            for (var i = 0; i < data.Users.length; i++) {
                var info = data.Users[i];
                var row = g_uid_to_pos[info.UserID];
                this.setPlayerStateScore(row, info.Result, true)
                $('node.info' + row + ".lb_score", this.playersInfo).setString(info.Score);
                for (var j = 0; j < gameData.players.length; j++) {
                    var player = gameData.players[j];
                    if (player.UserID == info.UserID) {
                        player.score = info.Score
                        player.Score = info.Score
                    }
                }

                if (info.UserID == gameData.uid) {
                    if (info.Score >= 0) {
                        playEffect('vssswin')
                    } else {
                        playEffect('vssslose')
                    }
                }
            }


        },
        // 切home 切出游戏
        Game_On_Hide: function () {
            var msg = JSON.stringify({
                roomid: gameData.roomId, type: 'text',
                content: '有事离开，等我一下', from: gameData.uid
            });
            network.sendPhz(5000, "Say/" + msg);
        },
        // 回到游戏
        Game_On_Show: function () {
            var msg = JSON.stringify({
                roomid: gameData.roomId, type: 'text',
                content: '我回来了', from: gameData.uid
            });
            network.sendPhz(5000, "Say/" + msg);
        },
        onBroadCast: function (data) {

        },
        getUserPosIndex: function (uid) {
            return g_uid_to_pos[uid];
        },
        setReady: function (uid, visible) {
            // var row = this.getUserPosIndex(uid) || 0;
            // var head = $("node.info" + row + ".head" + row, this.playersInfo);
            // var ready = head.getChildByName('ready');
            // if (!ready) {
            //     if (row == 0) {
            //         ready = new cc.Sprite(res.ready_min);
            //     } else {
            //         ready = new cc.Sprite('res/paohuzi/ready.png');
            //     }
            //     ready.setName('ready');
            //     ready.setAnchorPoint(cc.p(0.5, 0.5));
            //     ready.setPosition(cc.p((row == 0 ) ? 600 : ((row == 1 ) ? 95 : -15), 40));
            //
            //
            //     head.addChild(ready);
            // }
            // ready.setVisible(visible);
        },
        onGameStart: function (data) {
            if (data.CurrentRound) {
                this.setCurRound(data.CurrentRound, gameData.options.jushu || gameData.options.rounds)
            }

            // console.log(data);
            this.isStart = true;
            mRoom.isStart = this.isStart;

            // this.setReady(gameData.uid, false);
            this.setPlayersStatus(false);

            this.clearTable4StartGame();

            this.setupPlayers();
            this.setupGameStart();


            // this.setCurRound(g_curRound+1);
            g_zhuangid = data.Banker
            this.setZhuangHead(data.Banker)


            //播放开始动画
            // playSpAnimation('sss_effect', 'liuduiban', false)
            network.stop(undefined, "开始动画结束");
            var start = playSpine(sss_res.sp_sss_effect_json, 'kaishi', false, function () {
                console.log("开始动画结束");
                network.start('开始动画结束');
                setTimeout(function () {
                    start.removeFromParent();
                }, 1)
            });
            if (!window.sensorLandscape) {
                start.setRotation(-90);
            }
            start.setName('start');
            start.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
            this.addChild(start);

            this.start.setVisible(false);
        },
        setCurRound: function (round, totle) {
            console.log("局数----" + round);
            g_curRound = round || 1;
            g_totleRound = totle || g_totleRound;
            gameData.curRound = round;
            $('txtRound').setVisible(true);
            $('txtRound').setString(g_curRound + "/" + g_totleRound);
        },
        setupGameStart: function () {
            this.setRoomState(2);
            // this.invite.setVisible(false);
            // this.copyroom.setVisible(false);
            // this.tuichu.setVisible(false);
            // this.jiesan.setVisible(false);
            if (mRoom.isReplay != true) {
                this.btn_mic.setVisible(true);
            }
        },

        onStatusChange: function (data) {
            console.log(data.UserID + "  准备好了 round=" + data.Round);
            this.setCurRound(data.Round, gameData.options.jushu);
        },
        dealCards: function (row) {
            // var node = $("node.info" + row + '.wordsNode', this.playersInfo)
            // for (var i = 0; i < 13; i++) {
            //     var sp = duplicateSprite($('poker'));
            //     sp.x = i * 5 - 30;
            //     node.addChild(sp);
            //     sp.setOpacity(0);
            //     sp.runAction(cc.sequence(cc.delayTime(i * 0.08), cc.fadeTo(0.05, 255)));
            // }

            var backNode = $('node.row' + row + '.backNode', this.playersInfo);
            var frontNode = $('node.row' + row + '.frontNode', this.playersInfo);
            frontNode.setVisible(false);
            backNode.setVisible(true);
            $("node.row" + row, this.playersInfo).setVisible(true);
            for (var i = 0; i < 13; i++) {
                var pk = backNode.getChildByName('pk_' + (i + 1));
                sssRule.setPaiFrame(pk, undefined);
                pk.setOpacity(0);
                pk.runAction(cc.sequence(cc.delayTime(i * 0.04), cc.callFunc(function () {
                    playEffect('vfapai');//发牌音效
                }), cc.fadeTo(0.03, 255)));
            }
        },
        onCardDeal: function (data, closeAnim) {
            if (mRoom.isReplay) {
                $('setbgView.btn_xuanxiang').setVisible(false)
                $('copy').setVisible(false)
                $('chat').setVisible(false)
                $('btn_mic').setVisible(false)
            }

            console.log("发牌------");
            console.log(data.Cards);
            $('cards').setString(JSON.stringify(data.Cards));
            selfDealCards = data.Cards;
            selfIsShowPai = false;
            // this.addChild(new DealCardsLayer({cards:data.Cards}))
//{"Cards":[29,21,10,41,1,9,17,42,37,13,34,33,50],"ToUser":871,"Card":null,"Reason":"断线重连，发牌"}

            network.stop(undefined, '发牌');

            var players = gameData.players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var row = g_uid_to_pos[player.uid];
                this.dealCards(row)
            }
            var that = this;
            this.scheduleOnce(function () {
                // for (var i = 0; i < players.length; i++) {
                //     var player = players[i];
                //     var row = g_uid_to_pos[player.uid];
                //     $('node.row' + row + '.frontNode', this.playersInfo).setVisible(true);
                //     $('node.row' + row + '.backNode', this.playersInfo).setVisible(false);
                // }
                // sssRule.showAllCardsInfo()
                console.log("注册自己牌事件----");

                network.start("onCardDeal");

                //抢庄
                if (data.GameType == 1 && !mRoom.isReplay) {//抢庄
                    that.showRoomState('qiangzhuang');
                    var qiangzhuangLayer = new QiangzhuangLayer(data.Cards);
                    qiangzhuangLayer.setName('qiangzhuangLayer');
                    that.addChild(qiangzhuangLayer);
                }
                if (data.GameType == 2 && !mRoom.isReplay) {//看牌下注
                    that.showRoomState('xiazhu');
                    var qiangzhuangLayer = new QiangzhuangLayer(data.Cards);
                    qiangzhuangLayer.setName('qiangzhuangLayer');
                    qiangzhuangLayer.startXiazhu();
                    that.addChild(qiangzhuangLayer);
                }

                if (gameData.isSelfWatching) {
                    var qiangzhuangLayer = that.getChildByName('qiangzhuangLayer')
                    if (qiangzhuangLayer) {
                        qiangzhuangLayer.removeFromParent();
                    }
                }
            }, 1.5)
        },

        onAutoAction: function (data) {
            // this.setPlayersStatus(data)

            //{"AutoAction":2,"Second":15,"Prompt":"请选择下注倍数","Banker":321408,"PromptBanker":"请选择下注倍数"}
            if (data.AutoAction == 1 || data.AutoAction == 2) {//抢庄 下注
                this.showCountDown(0, data.Second);
            } else {
                var dealCardsLayer = this.getChildByName('dealCardsLayer')
                if (dealCardsLayer) {
                    dealCardsLayer.showCountDown(0, data.Second)
                }
            }
        },
        onUserJoin: function (data) {
            // var data = event.getUserData();
            // console.log(data);

            if (data.GameStatus !== 0) { //0 未开始
                mRoom.isStart = true;
            } else {
                mRoom.isStart = false;
            }
            mRoom.isStart = data.GameStatus !== 0;


            if (data.Result != null && data.Result == -1) {
                console.log('result ---错误');
            } else {
                // if (data.GameStatus !== 0) { //0 未开始
                //     mRoom.isStart = true;
                // } else {
                //     mRoom.isStart = false;
                // }
                // mRoom.isStart = data.GameStatus !== 0;
                // this.isStart = data.GameStatus !== 0;

                // gameData.players = data["Users"];
                this.setupPlayers(data["Users"]);
                this.setupWatcherPlayers(data['WatchingUsers']);
                //Offline
                var offLines = data["Users"];
                for (var i = 0; i < offLines.length; i++) {
                    var user = offLines[i];
                    console.log("exce--->>> offline   " + user.UserID + "     " + user.Offline);
                    this.setDisconnect(user.UserID, user.Offline > 0);
                }

                //中途加入
            }
            g_data.Owner = data.Owner;

            // this.start.setVisible(false);
            this.setCurRound(data.CurrentRound, data.TotalRound);
            // this.setZhuangHead(0);

        },
        onUserDisconnect: function (data) {
            var flag = false;
            if (data.ConnectStatus == "disconnected") {
                flag = true;
            } else if (data.ConnectStatus == "online") {
                flag = false;
            }
            this.setDisconnect(data.UserID, flag);

        },
        onRoleLoginOK: function () {

        },
        onLeaveOK: function (data) {
            //如果是自己离开的消息。socket关闭
            if (data.Users == gameData.uid) {
                // if (gameData.switchVideo) {
                //     AgoraUtil.closeVideo();
                // }
                //cc.eventManager.removeAllListeners();
                gameData.roomId = 0;
                clearGameMWRoomId();
                window.paizhuo = null;
                HUD.showScene(HUD_LIST.Home, this);
            } else {
                var uid = data["uid"];
                _.remove(gameData.players, function (player) {
                    return player.uid == uid;
                });
                this.onPlayerEnterExit();
            }
        },
        onJoinOK: function () {
            var data = event.getUserData();
            if (data.Head.Result != null && data.Head.Result == -1) {
                if (gameData.switchVideo) {
                    AgoraUtil.closeVideo();
                }
            } else {
                this.setupPlayers();
            }
        },
        onTurnOut: function (data) {
            //{"Turn":873,"Second":20,"Remark":"开门见山","Seq":0,"LastCards":[],"LastCardFrom":null,"Prompt":[],
            // "LeftCardCount":36,"CurrentRate":1,
            // "LeftNumbers":[{"UserID":871,"CardCount":13},{"UserID":872,"CardCount":13},{"UserID":873,"CardCount":13}],"Prompts":[]}

        },
        onTurnIn: function (data) {
            g_seq = data.Seq;
        },
        showTips: function (str) {
            $('tip.txt').setString(str || '');
            $('tip').setPosition(cc.p(640, 500));
            $('tip').setOpacity(0);
            $('tip').runAction(cc.sequence(
                cc.spawn(cc.moveBy(0.2, 0, 50), cc.fadeIn(0.2)),
                cc.delayTime(0.8),
                cc.spawn(cc.moveBy(0.5, 0, 150), cc.fadeOut(0.5))
            ))
        },
        onVoice: function () {

        },
        onMaDeng: function () {

        },
        onUserKick: function () {

        },
        onNiao_Status: function () {

        },
        onJushou_Status: function () {

        },
        Pls_Disconnect_MSG: function () {

        },
        onBaojing: function () {

        },
        beginReplay: function () {
            this.setupPlayers(g_data.Users);
        },
        onEatCard: function () {

        },
        hideReplayAction: function () {

        },
        setPlayersStatus: function (data) {
            if (data && data.Users) {
                for (var i = 0; i < data.Users.length; i++) {
                    var info = data.Users[i];
                    var ok = $('node.info' + g_uid_to_pos[info.UserID || info.ID] + '.ok', this.playersInfo);
                    if (!ok)continue;

                    if (!!info.Status) {
                        ok.setVisible(true);
                        if (info.UserID == gameData.uid) {
                            this.zhunbei.setVisible(false);
                            $('btn_qiepai').setVisible(false);
                        }
                    } else {

                        ok.setVisible(false);
                        if (info.UserID == gameData.uid) {
                            this.zhunbei.setVisible(true);
                            $('btn_qiepai').setVisible(g_curRound != 1);
                        }
                    }
                    // if (data.GameStatus) {
                    //     ok.setVisible(false);
                    // }
                    for (var j = 0; j < gameData.players.length; j++) {
                        var player = gameData.players[j];
                        player.ready = !!info.Status;
                    }
                }
            } else {
                for (var i = 0; i < max_player_num; i++) {
                    var ok = $('node.info' + i + '.ok', this.playersInfo);
                    ok.setVisible(!!data);
                }
                this.zhunbei.setVisible(false);
                $('btn_qiepai').setVisible(false);
            }


        },
        NetWorkCloseFunc: function () {

        },
        getUserPosIndex: function (userId) {
            var users = gameData.players;
            var pos = 0;
            if (mRoom.isReplay) {
                for (var i = 0; i < users.length; i++) {
                    if (userId == users[i].ID) {
                        pos = i;
                        break;
                    }
                }
            } else {
                if (userId == gameData.uid) {
                    pos = 0;
                } else if (users[this.pos1] != null && userId == users[this.pos1].ID) {
                    pos = 1;
                } else if (users[this.pos2] != null && userId == users[this.pos2].ID) {
                    pos = 2;
                } else if (users[this.pos3] != null && userId == users[this.pos3].ID) {
                    pos = 3;
                }
            }
            return pos;
        },
        getOriginalPos: function () {
            return 1;
        },
        getEffectEmojiPos: function (caster, patient) {
            // console.log(caster);
            // console.log(patient);
            patient = patient || 0;
            var midUserPos = 0;
            var pos = {};
            pos[caster] = $('playersInfo.node.effectemoji' + caster).getPosition();
            pos[patient] = $('playersInfo.node.effectemoji' + patient).getPosition();//patient != midUserPos ? $('playersInfo.node.effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            return pos;
        },
        onBack: function (sender, type) {
            if (this.isStart == false) {
                mRoom.quitRoom(this);
            }
            else {
                // DC.wsData("Vote/quit/1/0/0");
            }
        },

        onGameVote: function (data) {
            var that = this;
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
                this.addChild(shenqingjiesanLayer, 60);
            }
            for (var i = 0; i < gameData.players.length; i++) {
                var playerInfo = gameData.players[i];
                playerInfo.uid = playerInfo.User.ID;
                playerInfo.nickname = playerInfo.User.NickName;
                playerInfo.ip = playerInfo.User.IP;
                playerInfo.headimgurl = playerInfo.User.HeadIMGURL;
                playerInfo.sex = playerInfo.User.Sex;
            }
            shenqingjiesanLayer.setArr(leftSeconds, data.Users, data.ByUserID);
        },
        getRowByUid: function (uid) {
            return g_uid_to_pos[uid];
        }

    });
    exports.PokerLayer_sss = PokerLayer_sss;
})(window);