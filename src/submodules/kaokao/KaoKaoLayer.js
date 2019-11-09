/**
 * Created by hjx on 2018/4/16.
 *
 */

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
            4: {
                0: cc.p(0, 0)
                , 1: cc.p(1, 1)
                , 2: cc.p(0, 1)
                , 3: cc.p(0, 1)
            },
        }
        //九宫格气泡的资源配置信息
        , ltqpFileIndex: {
            4: {
                0: 2
                , 1: 1
                , 2: 3
                , 3: 3
            },
        }
        //九宫格气泡的拉伸部分的宽高数据信息
        , ltqpCapInsets: {
            4: {
                0: cc.rect(64, 25, 1, 1)
                , 1: cc.rect(26, 31, 1, 1)
                , 2: cc.rect(44, 25, 1, 1)
                , 3: cc.rect(42, 23, 1, 1)
            },
        }
        , ltqpEmojiPos: {
            4: {
                0: cc.p(40, 28)
                , 1: cc.p(40, 28)
                , 2: cc.p(40, 28)
                , 3: cc.p(40, 28)
            },
        }
        , ltqpVoicePos: {
            4: {
                0: cc.p(70, 40)
                , 1: cc.p(70, 30)
                , 2: cc.p(70, 30)
                , 3: cc.p(58, 28)
            },
        }
        , ltqpEmojiSize: {}
        //气泡里面的对话文字的偏移坐标
        , ltqpTextDelta: {
            4: {
                0: cc.p(-1, 7)
                , 1: cc.p(-7, 2)
                , 2: cc.p(0, -5)
                , 3: cc.p(6, 3)
            }
        }
    };

    var PAIID2CARD = kaokaoRule.loadAllCard();
    var CARDS_TYPE_OWN = 'nCards';//自己手牌
    var CARDS_TYPE_OUT = 'out';//打出去的牌
    var CARDS_TYPE_OPEN = 'open';//对外公开的牌
    var CARDS_TYPE_CACHE = 'cache';//牌桌展示摸牌与打牌 大的
    var SELF_ROW = 0;
    var CARD_WIDTH = 85;
    var CARD_SPACE = 70;

    var CP_HU = 0x1;    //胡 1
    var CP_PENG = 0x8;    //碰 8
    var CP_CHI = 0x10;    //吃 16
    var CP_AN = 0x20;    //暗 32
    var CP_GUO = 0x40;    //过 64
    var CP_DANG = 0x80;    //当 128
    var CP_PIAO = 0x100;    //飘 240
    var CP_NOTPIAO = 0x400;    //飘 240
    var CP_TOU = 0x200;    //偷
    var OP_TO_BTN_NAME = function (op) {
        var btns = [];
        ((op & CP_GUO) == CP_GUO) ? btns.push('btn_guo') : 0;
        ((op & CP_DANG) == CP_DANG) ? btns.push('btn_dang') : 0;
        ((op & CP_PIAO) == CP_PIAO) ? btns.push('btn_piao') : 0;
        ((op & CP_NOTPIAO) == CP_NOTPIAO) ? btns.push('btn_bupiao') : 0;
        ((op & CP_CHI) == CP_CHI) ? btns.push('btn_chi') : 0;
        ((op & CP_PENG) == CP_PENG) ? btns.push('btn_peng') : 0;
        ((op & CP_AN) == CP_AN) ? btns.push('btn_an') : 0;
        ((op & CP_HU) == CP_HU) ? btns.push('btn_hu') : 0;
        //console.log(JSON.stringify(btns));
        return btns;
    }

    var DEBUG_HU = false;//自动打牌
    var DEBUG_CARD = false;//测试牌堆数量信息打印
    var DEBUG_MO_SEND = false;//测试自动摸牌打牌 期间操作手牌

    ////0 未开始 1 飘  2 发牌  3 当 4 偷牌  5 打牌
    var g_roomState = 0;
    var g_data = null;
    var g_option = null;
    var g_pos_to_uid = {};
    var g_uid_to_pos = {};
    var g_uid_to_sex = {};
    var g_initPaiNum = 20;
    var g_last_op = 0;
    var g_curRound = 0;
    var g_totleRound = 0;
    var g_leftCards = {};
    var g_choosePai = null;
    var g_isSelfPaiAutoOpt = false;
    var g_isCanSendPai = false;
    var g_noChoosePiaoCount = 0;
    var g_playerPiaoState = {};
    var g_zhuangid = 0;
    var max_player_num = 3;

    //服务器记录操作序号 随着消息刷新
    var g_seq = 0;

    //用于处理服务器当前记录的可以操作牌型 重连时候初始化或者刷新列表 进行对应操作
    // [Cards, Cards, Cards...]
    var g_self_turn_cards = null;

    //自己手牌
    // [id, id, id...]
    var g_self_cards = null;//一维数组

    //玩家打出去的牌
    // {row:[], row:[]...}
    var g_out_cards = null;

    //自己手牌列数
    var g_selfcards_cols = 0;

    var g_table_show_card = 0;

    //玩家落地的牌 碰 暗 展示出来
    var g_open_cards = null;
    var operateOpenCards = function (userID, op, data1, data2) {
        if (!userID) {
            cc.error("未传入 USERID");
            return;
        }
        g_open_cards[userID] = g_open_cards[userID] || [];
        switch (op) {
            case 'init':
                g_open_cards[userID] = data1;
                break;
            case 'push':
                if (data1 == 1 || data1 == 2) {
                    var pushCount = 0;
                    while (pushCount < data2) {
                        if (g_open_cards[userID][0] && g_open_cards[userID][0].Type == 0) {
                            if (g_open_cards[userID][0].Cards.length < 4) {
                                g_open_cards[userID][0].Cards.push(data1);
                                pushCount++;
                            } else {
                                g_open_cards[userID].unshift(
                                    {
                                        Cards: [],
                                        Type: 0
                                    }
                                );
                            }
                        } else {
                            g_open_cards[userID].unshift(
                                {
                                    Cards: [],
                                    Type: 0
                                }
                            );
                        }
                    }
                } else {
                    g_open_cards[userID].push(data1);
                }
                break;
            case 'showan'://此处最初打牌中间会发过来 导致吃碰牌丢失显示
                var cards = g_open_cards[data1.UserId];
                var newCards = _.filter(cards, function (card) {
                    return card.Type == 0;
                })
                var dataCards = data1.An_List;
                for (var i = 0; i < dataCards.length; i++) {
                    newCards.push(dataCards[i]);
                }
                var otherTypes = _.filter(cards, function (card) {
                    return card.Type == 2 || card.Type == 1;
                })
                g_open_cards[data1.UserId] = newCards.concat(otherTypes);
                break;
        }
    }

    var g_anim_play_rate = .82;
    if (DEBUG_HU) {
        g_anim_play_rate = .3;
    }

    //缓存核心 缓存所有牌Sprite
    var g_cache = {};
    for (var i = 0; i <= 3; i++) {
        g_cache[CARDS_TYPE_OWN + i] = {};
        g_cache[CARDS_TYPE_OUT + i] = {};
        g_cache[CARDS_TYPE_OPEN + i] = {};
    }
    if (DEBUG_CARD) {
        var _showInfo = function (obj, tab) {
            tab += " ";
            for (var key in obj) {
                console.log(tab + key);
                if (tab.length < 2 && obj.hasOwnProperty(key)) {
                    _showInfo(obj[key], tab);
                }
            }
        }
        setInterval(function () {
            _showInfo(cache, '');
        }, 50000);
    }
    if (DEBUG_MO_SEND) {
        var _stepCount = 0;
        var _step = function () {
            _stepCount++;
            if (_stepCount % 4 != 1) {
                network.selfDebugSend(152, {"UserId": 10, "Card": [1104], "IsTou": 1, "Cai": null, "Ting": 0});
            } else {
                //{"Head":null,"Action":"41/EatCard/32/1107,1107,1107/2","ScoreChange":null}
                network.selfDebugSend(112, {
                    "Head": null,
                    "Action": "10/EatCard/32/1104,1104,1104/2",
                    "ScoreChange": null
                });
            }
        }
        setInterval(function () {
            _step();
        }, 2000);
    }


    var clearVars = function () {
        mRoom.wanfatype = undefined;

        g_data = null;
        g_option = null;
        g_pos_to_uid = {};
        g_uid_to_pos = {};
        g_uid_to_sex = {};
        g_roomState = 0;
        g_seq = 0;
        g_self_turn_cards = null;
        g_out_cards = {};
        g_open_cards = {};
        for (var i = 0; i <= 3; i++) {
            g_cache[CARDS_TYPE_OWN + i] = {};
            g_cache[CARDS_TYPE_OUT + i] = {};
            g_cache[CARDS_TYPE_OPEN + i] = {};
        }
        g_last_op = 0;
        g_curRound = 0;
        g_totleRound = 0;
        g_choosePai = null;
        g_self_cards = {};
        g_noChoosePiaoCount = 0;
        g_playerPiaoState = {};
        g_zhuangid = 0;
        // if (cc.sys.isNative) {
        //     DEBUG_HU = false;
        //     g_anim_play_rate = .90;
        // }
        max_player_num = 4;
        g_isSelfPaiAutoOpt = false;
        g_choosePai = null;

    }

    var createCardSprite = function (id, type) {
        id = parseInt(id);
        switch (type) {
            case 'big':
                var sprite = new cc.Sprite()
                var card = PAIID2CARD[id];
                if (card) {
                    if (id == 0) {
                        setSpriteFrameByPath(sprite, 'bgBack.png', res.cp_cards);
                    } else {
                        setSpriteFrameByPath(sprite, "image_" + card.resName, res.cp_cards);
                    }
                }
                return sprite;
                break;
            case "small":
                var sprite = new cc.Sprite()
                var card = PAIID2CARD[id];
                if (card) {
                    setSpriteFrameByPath(sprite, "short_small.png", res.cp_cards);
                    var child_sprite = new cc.Sprite();
                    sprite.addChild(child_sprite);
                    child_sprite.setScale(0.45);
                    child_sprite.x = sprite.width / 2
                    child_sprite.y = sprite.height / 2
                    setSpriteFrameByPath(child_sprite, "" + card.resName, res.cp_cards)
                    if (id == 0) {
                        child_sprite.setScale(1);
                        child_sprite.y = sprite.height / 2;
                    }
                } else {
                    setSpriteFrameByPath(sprite, 'bgBack_short.png', res.cp_cards)
                }
                return sprite;
                break;
            case "short":
                var sprite = new cc.Sprite()
                var card = PAIID2CARD[id];
                if (card) {
                    setSpriteFrameByPath(sprite, "short_big.png", res.cp_cards);
                    var child_sprite = new cc.Sprite();
                    sprite.addChild(child_sprite);
                    child_sprite.setRotation(90);
                    child_sprite.setPosition(cc.p(sprite.getContentSize().width / 2, sprite.getContentSize().height / 2));
                    setSpriteFrameByPath(child_sprite, "" + card.resName, res.cp_cards);
                } else {
                    setSpriteFrameByPath(sprite, 'bgBack_short.png', res.cp_cards);
                }
                return sprite;
                break;
        }
        cc.error('createCardSprite id=' + id + "  type=" + type);
    }
    var playAnimationByOperate = function (parent, op, cb, x, y) {
        var animName = null;
        animName = ((op & CP_PIAO) == CP_PIAO) ? "animPiao.json" : null;
        animName = animName || (((op & CP_PENG) == CP_PENG) ? "animPeng.json" : null);
        animName = animName || (((op & CP_CHI) == CP_CHI) ? "animChi.json" : null);
        animName = animName || (((op & CP_AN) == CP_AN) ? "animAn.json" : null);
        animName = animName || (((op & CP_HU) == CP_HU) ? "animHu.json" : null);
        animName = animName || (((op & CP_TOU) == CP_TOU) ? "animTou.json" : null);
        if (!animName) {
            cc.error('playAnimationByOperate  ' + op);
            return;
        }
        var anim = playAnimScene(parent, 'res/submodules/kaokao/ccs/' + animName, x || 0, y || 0, false, cb || function () {
                anim.removeFromParent(false);
            })
        anim.setLocalZOrder(9999);
        var userdata = anim.getUserData();
        userdata.action.setTimeSpeed(1 / g_anim_play_rate);
        return anim;
    }
    var createGroupCards = function (parent, group, type, dir, moveDir) {
        var spArr = [];
        for (var i = 0; i < group.length; i++) {
            var id = group[i];
            spArr.push(createCardSprite(id, type || 'small'));
        }
        moveDir = moveDir || 1;
        for (var i = 0; i < spArr.length; i++) {
            if (!dir || dir == 'portrait') {
                spArr[i].setPositionY((spArr[0].getContentSize().height - 6) * i * moveDir + spArr[0].getContentSize().height / 2);
            } else if (dir == 'landscape') {
                spArr[i].setPositionX((spArr[0].getContentSize().width - 6) * i * moveDir + spArr[0].getContentSize().width / 2);
            }

        }
        return spArr;
    }

    var startAutoOpt = function () {
        g_isSelfPaiAutoOpt = true;
    }
    var stopAutoOpt = function () {
        g_isSelfPaiAutoOpt = false;
    }


    var KaoKaoLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            //切home
            this.hide_listener = cc.eventManager.addCustomListener("game_on_hide", this.Game_On_Hide.bind(this));
            this.show_listener = cc.eventManager.addCustomListener("game_on_show", this.Game_On_Show.bind(this));
        },
        onExit: function () {
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
        setReplayProgress: function (cur, totle) {
            console.log("setReplayProgress ->" + cur);
        },
        ctor: function (data) {
            this._super();
            clearVars();


            var self = this;
            if (_.isArray(data)) {
                mRoom.isReplay = true;
                g_data = data[0].data;
            } else {
                mRoom.isReplay = false
                g_data = data;
            }
            g_option = JSON.parse(g_data.Option);


            loadNodeCCS(res.KaoKaoLayer_json, self, "Layer");
            window.gameLayer = this;
            $("Version").setString("" + window.curVersion);


            this.clearTable4StartGame();

            this.setRoomState(0);


            this.enableSortPai();


            if (mRoom.isReplay)
                self.addChild(new KKReplayLayer(data, 99999));

            this.getVersion();
            return true;
        },
        getVersion: function () {
            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if (subArr) sub = subArr['kaokao'];

            var versiontxt = window.curVersion + "-" + sub;
            if(cc.sys.os == cc.sys.OS_IOS && versiontxt){
                var regx = new RegExp('\\.', 'g');
                versiontxt = versiontxt.replace(regx, '');
            }
            //给代理测试 版本代码写死
            //versiontxt = window.curVersion + "-1.1.2";

            if (mRoom.isReplay) {
                versiontxt = '';
            }

            var version = new ccui.Text();
            version.setFontSize(15);
            version.setTextColor(cc.color(255, 255, 255));
            version.setPosition(cc.p(cc.winSize.width - 80, 10));
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
            console.log("shezhi setPlayerPiaoState" + uid + "  " + state);
            if (!repeat && uid) {
                g_playerPiaoState[uid] = state;
            }
        },
        clearPlayersInfo: function () {
            for (var i = 0; i < this.playersNum; i++) {
                var sp = $('node.piaoBg' + i, this.playersInfo)
                if (sp) {
                    sp.setVisible(false);
                }
                sp = $('node.info' + i + '.zhuang', this.playersInfo)
                if (sp) {
                    sp.setVisible(false);
                }
                sp = $('node.info' + i + '.piao', this.playersInfo)
                if (sp) {
                    sp.setVisible(false);
                }
                sp = $('node.info' + i + '.txt_point', this.playersInfo)
                if (sp) {
                    sp.setString("");
                }
                sp = $('node.info' + i + '.txt_count', this.playersInfo)
                if (sp) {
                    sp.setString("");
                }
                sp = $('node.info' + i + '.dang', this.playersInfo)
                if (sp) {
                    sp.setVisible(false);
                }
            }
        },
        clearTableCards: function () {
            for (var i = 0; i < this.playersNum; i++) {
                $('node.nCards' + i, this.playersInfo).removeAllChildren();
                if (i != 0) {
                    $('node.nCards' + i, this.playersInfo).setScale(0.6);
                }
                $('node.open' + i, this.playersInfo).removeAllChildren();
                $('node.out' + i, this.playersInfo).removeAllChildren();
                $('node.cache' + i, this.playersInfo).removeAllChildren();
            }
            g_self_turn_cards = null;
            g_out_cards = {};
            g_open_cards = {};
            g_self_cards = {};
            g_noChoosePiaoCount = 0;
            for (var i = 0; i <= 3; i++) {
                g_cache[CARDS_TYPE_OWN + i] = {};
                g_cache[CARDS_TYPE_OUT + i] = {};
                g_cache[CARDS_TYPE_OPEN + i] = {};
            }
        },
        clearTable4StartGame: function () {

            this.setGameStep(0);
            this.hideAllOperationBtns(true);
            this.clearTableCards();
            this.clearPlayersInfo();

            this.hideCountDown();
            this.setLeftCardCount(-1);

        },
        onPlayerEnterExit: function () {

        },
        getGameStep: function () {
            return g_roomState;
        },
        ////0 未开始 1 飘  2 发牌  3 当 4 偷牌  5 打牌
        setGameStep: function (step) {
            g_roomState = step;
            if (!step) {
                step = 'clear';
            } else if (step == 1) {
                step = 'piao';
            } else if (step == 2) {
                step = 'deal';
            } else if (step == 3) {
                step = 'dang';
            } else if (step == 4) {
                step = 'ting';
            } else if (step == 5) {
                step = 'out';
            }

            $('stepSp').setVisible(true);
            $('node.word_piao_bg', this.playersInfo).setVisible(false);
            switch (step) {
                case 'piao':
                    // setSpriteFrameByPath($('stepSp'), cp_png_res1_path + 'state_piao.png', res.cp_res1);
                    $('stepSp').setVisible(false);
                    $('node.word_piao_bg', this.playersInfo).setVisible(true);
                    break;
                case 'out':
                    setSpriteFrameByPath($('stepSp'), cp_png_res1_path + 'state_outcard.png', res.cp_res1);
                    break;
                case 'dang':
                    setSpriteFrameByPath($('stepSp'), cp_png_res1_path + 'state_dang.png', res.cp_res1);
                    break;
                case 'ting':
                    setSpriteFrameByPath($('stepSp'), cp_png_res1_path + 'state_ting.png', res.cp_res1);
                    break;
                case 'tou':
                    setSpriteFrameByPath($('stepSp'), cp_png_res1_path + 'state_toucard.png', res.cp_res1);
                    break;
                case 'an':
                    setSpriteFrameByPath($('stepSp'), cp_png_res1_path + 'state_an.png', res.cp_res1);
                    break;
                case 'clear':
                    $('stepSp').setVisible(false);
                    break;
                default:
                    $('stepSp').setVisible(false);
            }
        },
        setRoomState: function (state) {
            g_roomState = state;

            console.log("setRoomState " + state);
            if (state == 0) {
                if (g_data.Owner == gameData.uid) {
                    $('btnlayer.jiesan').setVisible(true);
                    $('btnlayer.tuichu').setVisible(false);
                } else {
                    $('btnlayer.jiesan').setVisible(false);
                    $('btnlayer.tuichu').setVisible(true);
                }

                //$('txtRound').setString(curRound + "/" + totleRound);
                $('jiesan').setVisible(false);
                if (g_curRound > 1) {
                    $('jiesan').setVisible(true);
                    $('btnlayer.jiesan').setVisible(false);
                    $('btnlayer.tuichu').setVisible(false);
                }
                $('invite').setVisible(true)
                $('copy').setVisible(true)
                if(window.inReview)  $('invite').setVisible(false);
            }
            //this.setCurRound(g_curRound, totleRound);

            if (state != 0) {
                $('jiesan').setVisible(true);
                $('btnlayer.jiesan').setVisible(false);
                $('btnlayer.tuichu').setVisible(false);
                $('invite').setVisible(false)
                $('copy').setVisible(false)
            }
            if (mRoom.isReplay) {
                $('jiesan').setVisible(false);
                $('btnlayer.jiesan').setVisible(false);
                $('btnlayer.tuichu').setVisible(false);
                $('invite').setVisible(false)
                $('copy').setVisible(false)
            }
            this.setGameStep(state);
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
                        data.scene = 'kk';
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


            MicLayer.init($('btn_mic'), this, "kaokao");

            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1) {
                EFFECT_EMOJI_NEW.init(this, $);
            }else{
                EFFECT_EMOJI.init(this, $);
            }

            //是否加入成功
            this.joinRoom = false;

            //三人玩  四人玩加载不同的ccs
            gameData.playerNum = this.playersNum = g_option.cpCount || 3;
            this.playersInfo = $('playersInfo');
            var playerNodes = null;
            if (this.playersNum == 4) {
                playerNodes = ccs.load(res.FourPlayersLayer_json, "res/");
            } else {
                playerNodes = ccs.load(res.ThreePlayersLayer_json, "res/");
            }
            this.playersInfo.addChild(playerNodes.node);

            this.calcPosConf();

            this.initClubAssistant();

            playMusic('vbgKK', true);
            //聊天
            this.chat = $("chat");
            //邀请
            this.invite = $("btnlayer.invite");
            TouchUtils.setOnclickListener(this.invite, function () {
                that.inviteFunc()
            }, {});
            this.copyroom = $("btnlayer.copyroom");
            //复制房间
            this.copyroom.setVisible(false);
            TouchUtils.setOnclickListener(this.copyroom, function () {
                that.copyroomFunc()
            }, {});
            //退出
            // this.tuichu = $("btnlayer.tuichu");
            TouchUtils.setOnclickListener($("btnlayer.tuichu"), function () {
                alert2('确定要退出房间吗?', function () {
                    network.sendPhz(3003, "Quit/" + gameData.roomId);
                }, null, false, true, true);
            }, {});
            //解散
            // this.jiesan = $("btnlayer.jiesan");
            TouchUtils.setOnclickListener($("btnlayer.jiesan"), function () {
                // network.disconnect();

                if (window.inReview)
                    network.sendPhz(3003, "Discard/" + gameData.roomId);
                else
                    alert2('解散房间不扣房卡，是否确定解散？', function () {
                        network.sendPhz(3003, "Discard/" + gameData.roomId);
                    }, null, false, true, true, res.tip_mark_disroom, res.tip_icon_dis);
            });

            //准备
            this.zhunbei = $("btnlayer.zhunbei");
            TouchUtils.setOnclickListener(this.zhunbei, function () {
                network.sendPhz(5000, "Ready");
                that.zhunbei.setVisible(false);
            });
            this.zhunbei.setVisible(false);

            this.start = $("btnlayer.start");
            TouchUtils.setOnclickListener(this.start, function () {
                network.send(3005, {room_id: gameData.roomId});
                that.start.setVisible(false);
            });
            this.start.setVisible(false);


            // $('chat').setVisible(false);
            // $('jiesan').setVisible(false);
            TouchUtils.setOnclickListener($('jiesan'), function () {
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
                        network.sendPhz(3003, "Quit/" + gameData.roomId);
                    }, null, false, true, true, res.tip_mark_exitroom, res.tip_icon_exitroom);
                };

                if (mRoom.isStart) {
                    fun1();
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
            });

            TouchUtils.setOnclickListener($('btSetting'), function () {
                var setting = HUD.showLayer(HUD_LIST.Settings, that);
                setting.setSetting(that, "kaokao");//大厅里面打开界面
                setting.setSettingLayerType({hidejiesan: that});
            });

            //that.addChild(new ShareTypeLayer(undefined, undefined,undefined, undefined, getClubData(clubid)));
            TouchUtils.setOnclickListener($('invite'), function () {
                var shareLayer = new ShareTypeLayer(undefined, gameData.roomId, {
                    desp: g_option.desp,
                    mapid: gameData.mapId || 340
                });
                that.addChild(shareLayer);
            });
            TouchUtils.setOnclickListener($('copy'), function () {
                var parts = decodeURIComponent(g_option.desp).split(',');
                var mapName = "绵竹考考"
                switch (gameData.mapId) {
                    case 340:
                        mapName = "绵竹考考"
                        break;
                    case 341:
                        mapName = "四川考考"
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
            $('txtRoom').setString(g_data["RoomID"]);
            var wanfaStr = g_option["desp"];
            wanfaStr = wanfaStr.replace(/局数.*\d局,/g, '');//五红五黑 五红六黑
            wanfaStr = wanfaStr.replace(/,五红五黑/g, '');
            wanfaStr = wanfaStr.replace(/,五红六黑/g, '');
            mRoom.wanfa = wanfaStr;

            $('txtWanfa').setString(wanfaStr);
            $('stepSp').runAction(cc.repeatForever(cc.sequence(
                cc.fadeIn(0.8), cc.delayTime(0.3), cc.fadeOut(0.8)
            )))
            $('txtRound').setVisible(false);

            playAnimScene($('chupaiAnim'), res.anim_chu, 0, 0, true);
            this.disableChuPai();

            network.addListener(3013, function (data) {
                if (data) gameData.numOfCards = data["numof_cards"];
            });
            //客户端状态变更
            this.addCustomListener(P.GS_StatusChange, this.onStatusChange.bind(this));
            //开始游戏，之后发牌
            this.addCustomListener(P.GS_GameStart, this.onGameStart.bind(this));
            //发牌
            this.addCustomListener(P.GS_CardDeal, this.onCardDeal.bind(this));
            this.addCustomListener(P.GS_RoomInfo, this.onResumeRoom.bind(this));
            this.addCustomListener(P.GS_UserJoin, this.onUserJoin.bind(this));
            //玩家临时掉线，真正掉线采用 	GS_UserLeave
            this.addCustomListener(P.GS_UserDisconnect, this.onUserDisconnect.bind(this));
            //房间内断开重连
            this.addCustomListener(P.GS_Login, this.onRoleLoginOK.bind(this));
            //离开房间
            this.addCustomListener(P.GS_UserLeave, this.onLeaveOK.bind(this));

            //到谁出牌了，开始读秒
            this.addCustomListener(P.GS_GameTurn_Out, this.onTurnOut.bind(this));
            //请客户端选择是否进牌
            this.addCustomListener(P.GS_GameTurn_In, this.onTurnIn.bind(this));
            // 广播
            this.addCustomListener(P.GS_BroadcastAction, this.onBroadCast.bind(this));
            //服务器宣布游戏结束
            this.addCustomListener(P.GS_GameOver, this.onGameOver.bind(this));
            //投票广播
            this.addCustomListener(P.GS_Vote, this.onGameVote.bind(this));
            //聊天广播
            this.addCustomListener(P.GS_Chat, this.onVoice.bind(this));

            this.addCustomListener(P.GS_Marquee, this.onMaDeng.bind(this));
            //房间结算
            this.addCustomListener(P.GS_RoomResult, this.onRoomResult.bind(this));
            //号被顶
            this.addCustomListener(P.GS_UserKick, this.onUserKick.bind(this));


            this.addCustomListener(P.GS_Pls_Disconnect, this.Pls_Disconnect_MSG.bind(this));
            this.addCustomListener(P.GS_Baojing_Status, this.onBaojing.bind(this));

            // this.addCustomListener(EVENT_CLEAN_ROOM, this.beginReplay.bind(this));
            // this.addCustomListener(EVENT_EATCARD, this.onEatCard.bind(this));
            // this.addCustomListener(EVENT_EATOVER, this.hideReplayAction.bind(this));

            //玩家准备状态
            this.addCustomListener(P.GS_ReadyStatus, this.setPlayersStatus.bind(this));
            //网络连接断开
            this.addCustomListener(P.GS_NetWorkClose, this.NetWorkCloseFunc.bind(this));


            this.addCustomListener(P.GS_SelectDang, this.onSelectDang.bind(this));
            this.addCustomListener(P.GS_DangInfo, this.onDangSelected.bind(this));
            this.addCustomListener(P.GS_CacheCard, this.onCacheCard.bind(this));//通知玩家摸牌
            this.addCustomListener(P.GS_PushCard, this.onPushCard.bind(this));//通知玩家出牌
            this.addCustomListener(P.GS_AllAnCard, this.onAllAnCard.bind(this));//开局偷牌结束后 通知玩家的状态
            this.addCustomListener(P.CP_GS_GameOver, this.onGameOver.bind(this));//长牌结算
            this.addCustomListener(P.GS_Piao_Status, this.onSelectPiao.bind(this));

            this.addCustomListener(P.CP_GS_RoomResult, this.onZongGameOver.bind(this));//长牌总结算
            this.addCustomListener(P.CP_GS_GameStatus, this.onGameStatus.bind(this));//长牌总结算
            this.addCustomListener(P.CP_GS_ToGameStart, this.onChooseStartGame.bind(this));//长牌总结算

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

            // this.onTimer(false);
            // if (!mRoom.isReplay) {
            //     this.schedule(this.onTimer, 1);
            // }
            // this.onBattery();
            // this.schedule(this.onBattery, 60);

            // this.refreshTime();
            // this.schedule(this.refreshTime, 1);

            // 设置自己头像
            // this.setPlayerAvator(0, gameData.headimgurl);


            console.log("=====onCCSLoadFinish======10");
            //设置背景图
            var scene_bg_id = cc.sys.localStorage.getItem('kksceneid') || 0;
            this.changeBg(scene_bg_id);

            network.start();

            if (mRoom.isReplay) {
                this.beginReplay();
                this.setPlayersStatus(g_data);
            }
        },
        changeBg: function (sceneid) {
            if (sceneid >= 3) {
                sceneid = 0;
            }
            console.log(sceneid);
            cc.sys.localStorage.setItem('kksceneid', sceneid);

            $('bg').loadTexture('res/submodules/kaokao/image/game_bg_' + sceneid + '.png');
        },
        showOutCard: function (id, cards) {
            console.log("showOutCard" + id);
            g_out_cards[id] = g_out_cards[id] || [];

            if (_.isArray(cards) && cards.length) {
                if (cards.length == 0)return;
                g_out_cards[id] = g_out_cards[id].concat(cards);
            } else {
                g_out_cards[id].push(cards);
            }

            var row = g_uid_to_pos[id];

            if (row !== undefined) {
                console.log("-----");
                var node = $("node.out" + row, this.playersInfo);
                if (node) {
                    node.removeAllChildren();
                    var outArr = g_out_cards[id];
                    var height = CARD_WIDTH / 2 - 5;
                    var count = 0;
                    for (var j = 0; j < outArr.length; j += 5) {
                        // console.log(outArr[j]);
                        var cards = outArr.slice(j, j + 5);
                        //TODO 后期做动画
                        var spCards = createGroupCards(node, cards, 'small', 'landscape', (row == 0 || row == 1) ? -1 : 1);
                        for (var x = 0; x < spCards.length; x++) {
                            node.addChild(spCards[x]);
                            spCards[x].y = count * height + 18;
                        }
                        count++;
                    }
                }
            }
            //console.log(JSON.stringify(g_out_cards[id]));
        },
        onResumeRoom: function (data) {
            this.clearTable4StartGame();


            if (data.GameStatus !== 0) { //0 未开始
                mRoom.isStart = true;
            } else {
                mRoom.isStart = false;
            }
            mRoom.isStart = data.GameStatus !== 0;

            var totleRound = g_option.jushu;
            this.setCurRound(data.GameSeq, totleRound);
            this.setRoomState(data.GameStatus);

            // g_curRound = data.GameSeq;

            var players = [];
            for (var i = 0; i < data.Players.length; i++) {
                var info = data.Players[i];
                players.push(info.User);
            }
            console.log("room info -----");
            this.setupPlayers(players);

            for (var i = 0; i < data.Players.length; i++) {
                var info = data.Players[i];
                // players.push(info.User);
                this.onCardDeal({Cards: info.Cards.Cards, ToUser: info.UserID}, true);
                if (info.UserID == gameData.uid) {
                    if (info.IsPushCard) {
                        this.enableChuPai();
                    } else {
                        this.disableChuPai();
                    }

                    if (info.LastTurnInFlag) {
                        g_self_turn_cards = info.Cards.ChiList;
                        this.showOperationBtns(info.LastTurnInFlag | CP_GUO);
                    }
                }
                console.log("offline-------------------");
                this.setDisconnect(info.UserID, !!info.Offline);

                //if (info.Score) {
                $("node.info" + g_uid_to_pos[info.UserID] + ".txtScore", this.playersInfo).setString(info.Score || 0);
                //}
                if (info.LastTurnInFlag || info.IsPushCard) {
                    this.showCountDown(g_uid_to_pos[info.UserID])
                }
                var piaoInfo = info.Piao;
                // console.log(JSON.stringify(piaoInfo));
                if (g_option["desp"].indexOf('不飘') < 0) {
                    if (data.GameStatus != 0) {
                        if (piaoInfo && !piaoInfo.IsSet) {
                            if (info.UserID == gameData.uid) {
                                // this.showOperationBtns(CP_PIAO | CP_GUO);
                                if (piaoInfo.Value == 1) {
                                    this.showOperationBtns(CP_PIAO, true);
                                } else {
                                    this.showOperationBtns(CP_PIAO | CP_NOTPIAO, true);
                                }
                            } else {
                                console.log("已经选择票---" + info.UserID + "   " + piaoInfo.IsSet);
                            }
                            if (g_uid_to_pos[info.UserID] > 0) $('node.piaoBg' + g_uid_to_pos[info.UserID], this.playersInfo).setVisible(true);
                        } else {
                            if (g_uid_to_pos[info.UserID] > 0) $('node.piaoBg' + g_uid_to_pos[info.UserID], this.playersInfo).setVisible(false);
                            // $('node.info' + g_uid_to_pos[info.UserID] + '.piao', this.playersInfo).setVisible(!!piaoInfo.Value);
                            //g_playerPiaoState
                            this.setPlayerPiaoState(info.UserID, piaoInfo.Value);
                            if (!piaoInfo.Value)
                                g_noChoosePiaoCount++;
                        }
                    } else {
                        this.setPlayerPiaoState(info.UserID, piaoInfo.Value);
                    }
                }
                var dangInfo = info.Dang;
                if (dangInfo && dangInfo.Value == 1) {
                    $("node.info" + g_uid_to_pos[info.UserID] + ".dang", this.playersInfo).setVisible(true);
                }


                if (info.Cards.LandHand) {
                    // g_open_cards[info.UserID] = info.Cards.LandHand
                    operateOpenCards(info.UserID, 'init', info.Cards.LandHand);
                }
                //听用 财神
                var cards = info.Cards
                if (cards.CardTing > 0) {
                    operateOpenCards(info.UserID, 'push', 1, cards.CardTing)
                }
                if (cards.CardCai > 0) {
                    operateOpenCards(info.UserID, 'push', 2, cards.CardCai)
                }

                //已出牌
                // g_out_cards[info.UserID] = info.Cards.DisCards;
                if (info.Cards.DisCards && info.Cards.DisCards.length > 0) {
                    this.showOutCard(info.UserID, info.Cards.DisCards);
                }


                this.refreshPoint(info.UserID)

                //剩余牌数量
                this.setCardsCount(info.UserID, info.Cards.CardsCount || 0);
            }

            this.initOpenCards();

            //操作状态 当
            if (data.BankerUserID) {
                g_zhuangid = data.BankerUserID;
                $('node.info' + g_uid_to_pos[data.BankerUserID] + ".zhuang", this.playersInfo).setVisible(true);
            }
            if (data.CurDanger == gameData.uid) {
                this.showOperationBtns(CP_DANG | CP_GUO);
            }

            //optional int32 Card = 1 ; // 本轮要争夺的 牌面，如果是 0 表示等待出牌
            // optional int32 From = 2 ; // 本轮要出的牌是谁出的，或者谁摸得
            // optional int32 Mo = 3 ; //本轮牌是不是摸的  1 是  ，0 不是
            // repeated  RoundAction Actions = 4; //本轮都有那些 表态了 ... 出牌者自动表态 过，
            // optional int32 Seq = 5 ; // 本轮是第几轮了
            if (data.Round) {
                g_seq = data.Round.Seq || 0;
                var cardId = data.Round.Card;
                var uid = data.Round.From;
                var opt = 0;
                for (var j = 0; j < data.Round.Actions.length; j++) {
                    if (data.Round.Actions[j].UserID == uid) {
                        opt = data.Round.Actions[j].Action;
                        break;
                    }
                }
                if (opt && data.Round.Mo) {
                    g_table_show_card = cardId;
                    console.log("当前玩家 " + uid + " 正在进行动作" + opt + "  牌 ： " + cardId);
                    this.showSendPaiAnim(g_uid_to_pos[uid], cardId);
                }
            }

            // $('leftbg.num').setString(data.LeftCardCount);
            this.setLeftCardCount(data.LeftCardCount);

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
            if (window.inReview)
                return;
            var uid = g_pos_to_uid[idx];

            if (!uid)
                return;

            var that = this;

            //var playerInfo = gameData.players[position2playerArrIdx[idx]];
            var playerInfo = null;
            for (var i = 0; i < gameData.players.length; i++) {
                if (gameData.players[i].ID == uid) {
                    playerInfo = gameData.players[i];
                    break;
                }
            }

            var showAniBtn = true
            if (playerInfo == null || playerInfo == undefined) {


                playerInfo = this.getWatchUserInfoByUid(uid);
            }
            playerInfo.uid = playerInfo.ID;
            playerInfo.nickname = playerInfo.NickName;
            playerInfo.ip = playerInfo.IP;
            playerInfo.headimgurl = playerInfo.HeadIMGURL;
            playerInfo.sex = playerInfo.Sex;

            //console.log(JSON.stringify(playerInfo));
            //合并成为一个功能块
            // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'kaokao', false);
            // this.addChild(this.playerInfoLayer);

            if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1){
                this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false);
                this.addChild(this.playerInfoLayer);
            }else{
                this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'kaokao', false);
                this.addChild(this.playerInfoLayer);
            }
        },
        calcPosConf: function () {
            for (var i = 0; i < this.playersNum; i++) {
                var row = i;
                var ltqp = $("playersInfo.node.info" + row + ".qp");
                if (ltqp) {
                    posConf.ltqpPos[row] = ltqp.getPosition();
                    posConf.ltqpRect[row] = cc.rect(0, 0, ltqp.getContentSize().width, ltqp.getContentSize().height);
                    posConf.ltqpEmojiSize[row] = cc.size({
                        4: {
                            0: 140,
                            1: 140,
                            2: 140,
                            3: 140
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
            } else if (type == 'biaoqingdonghua') {
                var data = JSON.parse(content);

                //关闭表情  只能看到自己给别的  看不到别人给自己的
                if (gameData.biaoQingFlag == 0 && !(data.from_uid == gameData.uid && data.target_uid != gameData.uid)) {
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
            var head = $("node.info" + row + ".head" + row, this.playersInfo);
            if (!head)return;

            var disconnect = head.getChildByName('disconnect');
            if (!disconnect) {
                disconnect = new cc.Sprite('res/submodules/kaokao/image/ui/disconnect.png');
                disconnect.setName('disconnect');
                disconnect.setPosition(cc.p(head.getContentSize().width / 2, head.getContentSize().height / 2 - 2));
                disconnect.setScale(1.0);
                head.addChild(disconnect);
            }
            disconnect.setVisible(flag);
            console.log(uid + "  discon --- " + flag);
        },
        setupPlayers: function (players) {
            if (players) {
                gameData.players = players;
            }

            var that = this;

            var data = gameData.players || [];
            gameData.playerMap = {};
            for (var i = 0; i < data.length; i++) {
                gameData.playerMap[data[i].ID] = data[i];
            }
            var pos = 0;
            // if (mRoom.isReplay == true) {
            //     pos = 0;
            //
            // } else {
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == gameData.uid) {
                    pos = i;
                }
                data[i].ready = true;
            }
            // }
            this.pos0 = pos;
            this.pos1 = (pos + 1) % this.playersNum;
            this.pos2 = (pos + 2) % this.playersNum;
            this.pos3 = (pos + 3) % this.playersNum;

            //邀请俱乐部成员
            var currentRound = g_totleRound - g_curRound
            if (this.isStart == true || currentRound > 1) {
                if (this.assistant) this.assistant.setVisible(false);
            }
            if (data.length >= this.playersNum) {
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

            g_pos_to_uid = {};
            g_uid_to_pos = {};
            g_uid_to_sex = {};
            console.log("setupPlayers   ====");
            for (var i = 0; i < this.playersNum; i++) {
                var idx = this['pos' + i];
                var row = i;
                var info = gameData.players[idx];
                if (!info) {
                    $("node.info" + row, this.playersInfo).setVisible(false);
                } else {
                    // console.log("设置头像id" +info.ID + "  row = " + row);
                    g_pos_to_uid[row] = info.ID;
                    g_uid_to_pos[info.ID] = row;
                    g_uid_to_sex[info.ID] = info.Sex || 1;
                    $("node.info" + row + ".txtUserName", this.playersInfo).setString(ellipsisStr(info.NickName, 5));
                    // $("node.info" + row + ".txtHX" , this.playersInfo).setString(info.ID);
                    // $("node.info" + row + ".txt_point" , this.playersInfo).setString('');
                    //$("node.info" + row + ".txtScore", this.playersInfo).setString(0);
                    this.setPlayerAvator(row, decodeURIComponent(info.HeadIMGURL), info.ID);

                }

            }

            if (mRoom.isReplay != true) {

                if (mRoom.ownner == gameData.uid || mRoom.ownner == gameData.uid.toString()) {

                    //房主
                    // this.invite.setVisible(true);
                    this.copyroom.setVisible(false);
                    // this.tuichu.setVisible(false);
                    // this.jiesan.setVisible(true);
                } else {
                    // this.invite.setVisible(true);
                    this.copyroom.setVisible(false);
                    // this.tuichu.setVisible(true);
                    // this.jiesan.setVisible(false);
                }
            }

            for (var i = 0; i < this.playersNum; i++) {
                if (data[this["pos" + i]]) {
                    this.updateScore(i);
                }
            }
            for (var i = 0; i < this.playersNum; i++) {
                (function (i) {
                    var headbg = $("node.info" + i + ".head" + i, that.playersInfo);
                    TouchUtils.setOnclickListener(headbg, function () {
                        if (!mRoom.isReplay) {
                            that.showPlayerInfoPanel(i);
                        }

                    })
                })(i);

            }


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

            if (that.assistant) {
                if(typeof that.assistant.refreshPlayersStates == 'function')  that.assistant.refreshPlayersStates();
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
        clearAllMoPai: function () {
            console.log("clearAllMoPai");
            for (var i = 0; i < this.playersNum; i++) {
                var row = this['pos' + i];
                var node = $('node.cache' + row, this.playersInfo);
                console.log("clearAllMoPai " + row);
                if (node) {//TODO ERROR------此处删除全部节点 回调也会取消 ？？？？？
                    node.removeAllChildren();
                    // var c1 = node.getChildByName('pai0');
                    // if(c1){
                    //     c1.setVisible(false);
                    // }
                    // var c2 = node.getChildByName('sendpai');
                    // if(c2){
                    //     c2.setVisible(false);
                    // }
                }
            }
        },
        /**
         * 播放牌桌中心显示的摸牌效果 展示牌
         * @param row
         * @param type
         */
        showMoPaiAnim: function (row, id, opt, cb) {
            console.log("showMoPaiAnim call-----");
            var node = $('node.cache' + row, this.playersInfo);
            if (node) {
                var pai = createCardSprite(id, 'big')
                pai.setName("pai");
                pai.setAnchorPoint(cc.p(0.5, 0.5))
                node.addChild(pai);

                console.log("showMoPaiAnim " + JSON.stringify(pai.getPosition()));
                //添加动画
                // pai.setOpacity(0);
                pai.setScale(0);
                var pos = node.convertToNodeSpace(cc.p(1280 / 2, cc.winSize.height / 2 + 200));
                console.log(pos);
                pai.setPosition(pos);
                var rotation = 0;
                if (row == 0 && !opt) {
                    rotation = 90;
                }
                pai.runAction(
                    cc.sequence(
                        cc.spawn(cc.moveTo(0.2 * g_anim_play_rate, 0, 0), cc.scaleTo(0.2 * g_anim_play_rate, 1, 1), cc.rotateTo(0.2 * g_anim_play_rate, rotation)).easing(cc.easeOut(1.4)),
                        cc.delayTime(0.5 * g_anim_play_rate)
                        // , cc.callFunc(function () {
                        //     if (cb) cb();
                        // })
                    ));


                if (opt) {
                    playAnimationByOperate(node, opt);
                }
            } else {
                cc.error("未找到showMoPaiAnim");
            }
            this.scheduleOnce(function () {
                if (cb) cb();
            }, (0.2 + 0.5) * g_anim_play_rate + 0.1)
        },
        showSendPaiAnim: function (row, id) {
            var node = $('node.cache' + row, this.playersInfo);
            if (node) {
                network.stop("sendpai");
                var pai = createCardSprite(id, 'big')
                pai.setName("sendpai");
                node.addChild(pai);

                if (row == 0) {
                    pai.setRotation(90);
                }


                console.log("showSendPaiAnim ");
                //添加动画
                pai.setOpacity(0);
                pai.setScale(0);
                var head = $('node.info' + row, this.playersInfo);
                var pos = node.convertToNodeSpace(head.getPosition());
                // console.log(pos);
                pai.setPosition(pos);
                pai.runAction(
                    cc.sequence(
                        cc.spawn(cc.moveTo(0.2 * g_anim_play_rate, 0, 0), cc.scaleTo(0.2 * g_anim_play_rate, 1, 1), cc.fadeIn(0.2 * g_anim_play_rate)).easing(cc.easeOut(1.4)),
                        cc.delayTime(0.4 * g_anim_play_rate),
                        cc.callFunc(function () {
                            network.start("sendpai");
                        })
                    ));

            } else {
                cc.error("未找到showMoPaiAnim");
            }
        },
        /**
         * 牌桌中的牌进入玩家手中
         * @param row
         * @param type
         */
        showMoPaiToPlayerAnim: function (row, cb1) {
            try {
                // console.log("showMoPaiToPlayerAnim " + row + " ==  " + cb1);
                var node = $('node.cache' + row, this.playersInfo);
                if (node) {
                    for (var i = 0; i < 2; i++) {
                        var pai = node.getChildByName('pai' + i);
                        if (pai) {
                            console.log("牌移动到玩家" + g_pos_to_uid[row]);
                            var head = $('node.info' + row, this.playersInfo);
                            var pos = pai.convertToWorldSpace(cc.p(0, 0));
                            var winOffx = (cc.winSize.width-1280)/2;
                            pos.x += (pai.width / 2 * 0.95 - winOffx);
                            pos.y += (pai.height / 2 * 0.95);
                            var dupPai = duplicateSprite(pai, true)
                            pai.removeFromParent(false);
                            pai = dupPai;
                            pai.setPosition(pos);
                            pai.setScale(0.95)
                            this.addChild(pai);
                            console.log("牌移动到玩家 111");
                            pai.runAction(
                                cc.sequence(
                                    cc.delayTime(0.15 * g_anim_play_rate),
                                    cc.spawn(
                                        cc.scaleTo(0.3 * g_anim_play_rate, 0.1, 0.1)
                                        ,
                                        cc.moveTo(0.3 * g_anim_play_rate, head.getPosition()),
                                        cc.fadeOut(0.3 * g_anim_play_rate)).easing(cc.easeOut(1.5)),
                                    // cc.callFunc(function () {
                                    //     if (cb)
                                    //         cb();
                                    // }),
                                    cc.removeSelf(false)
                                )
                            )
                            console.log("牌移动到玩家 1112222");
                        } else {//如果某种情况pai找不到了 避免卡死
                            if (i == 0)
                                network.start("偷牌牌找不到了-- 继续游戏 -- 防止卡死");
                        }
                    }
                }

                if (cb1) {
                    console.log("注册回调");
                    this.scheduleOnce(function () {
                        console.log("注册回调----调用");
                        cb1();
                    }, (0.45) * g_anim_play_rate + 0.1)
                }
            } catch (e) {
                console.log(e.message);
                console.log(e.stack);
            }
        },
        showTouPaiAnim: function (row, cards, opt, cb) {
            if (row == 0) {
                row = '00';
            }
            var node = $('node.cache' + row, this.playersInfo);
            if (node) {
                //TODO 此处最多两张牌 否则GG
                if (!cards || cards.length > 2) {
                    cc.error('bug->偷牌动画最多支持两张');
                    return;
                }
                console.log("showTouPaiAnim row=" + row)
                for (var i = 0; i < cards.length; i++) {
                    var id = cards[i];
                    var pai = createCardSprite(id, 'big')
                    pai.setName("pai" + i);
                    pai.setAnchorPoint(cc.p(0.5, 0.5))
                    node.addChild(pai);
                    // console.log(i + "showTouPaiAnim " + JSON.stringify(pai.getPosition()));
                    //添加动画
                    pai.setOpacity(0);
                    pai.setScale(0);
                    var yoff = 360;
                    if (row != '00') {
                        yoff = 230;
                    }
                    if (cards.length >= 2) {
                        var pos = node.convertToNodeSpace(cc.p(640 + (i == 0 ? -pai.width / 2 : pai.width / 2), cc.winSize.height / 2 + yoff));
                        pai.setPosition(pos);
                        // if (row != '00') {
                        //     pos.y = 0;
                        // }
                        pos.x = (i == 0 ? -pai.width / 2 : pai.width / 2)
                    } else {
                        var pos = node.convertToNodeSpace(cc.p(640, cc.winSize.height / 2 + yoff));
                        pai.setPosition(pos);
                        pos.x = 0;
                        // if (row != '00') {
                        //     pos.y = 0;
                        // }
                    }
                    pos.y = 0;
                    //if (i == 0) {
                    pai.runAction(
                        cc.sequence(
                            cc.spawn(cc.moveTo(0.1 * g_anim_play_rate, pos), cc.scaleTo(0.1 * g_anim_play_rate, 1, 1), cc.fadeIn(0.1 * g_anim_play_rate)).easing(cc.easeOut(1.4)),
                            cc.delayTime(0.2 * g_anim_play_rate)
                            // , cc.callFunc(function () {
                            //     console.log('start call');
                            //     if (cb) cb();
                            // })
                        ));
                    // } else {
                    //     pai.runAction(
                    //         cc.sequence(
                    //             cc.spawn(cc.moveTo(0.1 * g_anim_play_rate, pos), cc.scaleTo(0.1 * g_anim_play_rate, 1, 1), cc.fadeIn(0.1 * g_anim_play_rate)).easing(cc.easeOut(1.4)),
                    //             cc.delayTime(0.1 * g_anim_play_rate)
                    //         ));
                    // }
                }

                if (opt) {
                    playAnimationByOperate(this, opt, undefined, node.getPositionX(), node.getPositionY());
                }
            } else {
                cc.error("未找到showMoPaiAnim");
            }
            this.scheduleOnce(function () {
                console.log('start call');
                if (cb) cb();
            }, (0.1 + 0.2 + (row == '00' ? 0.1 : 0)) * g_anim_play_rate + 0.1);
        },
        showMoPaiToSelfAnim: function (row, data, cb) {
            var that = this;
            var node = null;
            if (row == 0) {
                node = $('node.cache0' + SELF_ROW, this.playersInfo);//此处00是牌桌中心出牌点
            } else {
                node = $('node.cache' + row, this.playersInfo);//此处00是牌桌中心出牌点
            }
            if (node) {
                var poss = [];
                for (var i = 0; i < 2; i++) {
                    var pai = node.getChildByName('pai' + i);
                    if (pai) {
                        var pos = pai.convertToWorldSpace(cc.p(0, 0));
                        pos.x += pai.width / 2;
                        pos.y += pai.height / 2;
                        poss.push(pos);
                        pai.removeFromParent(false);
                    }
                }
                that.addPaiToRC(row, data.Card || [], poss, cb);
                if (data.Ting || data.Cai) {
                    this.removeSelfCards(g_pos_to_uid[row], data.Ting ? 1 : data.Cai ? 2 : 0);
                }
                this.addSelfCards(g_pos_to_uid[row], data.Card)
                this.refreshPoint(g_pos_to_uid[row]);

            }
        },
        addSelfCards: function (uid, cards) {
            g_self_cards[uid] = g_self_cards[uid] || [];
            var optArr = g_self_cards[uid];
            if (_.isArray(cards)) {
                for (var i = 0; i < cards.length; i++) {
                    optArr.push(cards[i]);
                }
            } else {
                if (!cards)
                    return;
                optArr.push(parseInt(cards));
            }
            //console.log(uid + " addSelfCards 剩余牌：" + JSON.stringify(optArr));
        },
        removeSelfCards: function (uid, cards) {
            g_self_cards[uid] = g_self_cards[uid] || [];
            var optArr = g_self_cards[uid];
            if (_.isArray(cards)) {
                for (var i = 0; i < cards.length; i++) {
                    var idx = optArr.indexOf(parseInt(cards[i]));
                    if (idx >= 0) {
                        optArr.splice(idx, 1);
                    }
                }
            } else {
                var idx = optArr.indexOf(parseInt(cards));
                if (idx >= 0) {
                    optArr.splice(idx, 1);
                }
            }

            //console.log(uid + " removeSelfCards 剩余牌：" + JSON.stringify(optArr));
        },

        showCountDown: function (row) {
            var that = this;
            var posObj = {0: cc.p(1070, 170), 1: cc.p(960, 600), 2: cc.p(320, 600)}
            $('cd').setVisible(true);
            $('cd').setPosition(posObj[row] || cc.p(640, 360));
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            var time = 15;
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
            network.addListener(type, func);
        },
        initOpenCards: function (rowInit) {
            for (var i = 0; i < this.playersNum; i++) {
                var row = rowInit || this['pos' + i];
                var uid = g_pos_to_uid[row];
                var outArr = g_open_cards[uid]
                var width = row == 1 ? -CARD_WIDTH / 2 + 7 : CARD_WIDTH / 2 - 7;
                if (outArr) {
                    var node = $('node.open' + g_uid_to_pos[uid], this.playersInfo);
                    node.removeAllChildren();
                    for (var j = 0; j < outArr.length; j++) {
                        // console.log(outArr[j]);
                        var cards = outArr[j].Cards;
                        //TODO 后期做动画
                        var spCards = createGroupCards(node, cards);
                        for (var x = 0; x < spCards.length; x++) {
                            node.addChild(spCards[x]);
                            spCards[x].x = j * width + 18;
                        }
                    }
                }
                if (rowInit)
                    break;
            }
        },

        hideAllOperationBtns: function (isForce) {
            var btns = OP_TO_BTN_NAME(0xffff);
            for (var i = 0; i < btns.length; i++) {
                var btnNode = $("nAction." + btns[i]);
                btnNode.setVisible(false);
            }
            var child = this.getChildByName('chiLayer');
            if (child && isForce) {
                child.removeFromParent(false);
            }
        },
        showOperationBtns: function (op, center) {
            if (op) {
                g_last_op = op;
            } else {
                op = g_last_op;
            }
            // console.log("showOperationBtns" + op);
            var that = this;
            that.hideAllOperationBtns(true);
            var btns = OP_TO_BTN_NAME(op);
            for (var i = 0; i < btns.length; i++) {
                var btnNode = $("nAction." + btns[i]);
                btnNode.setVisible(true);
                btnNode.setPositionX(430 - i * 170);
                (function (btnname, operate) {
                    TouchUtils.setOnclickListener(btnNode, function () {
                        if (g_choosePai)return;
                        switch (btnname) {
                            case 'btn_dang':
                                network.sendPhz(5000, "Dang/1");
                                break;
                            case 'btn_guo':
                                if ((operate & CP_DANG) == CP_DANG) {
                                    network.sendPhz(5000, "Dang/0");
                                } else {
                                    var passFunc = function () {
                                        network.sendPhz(5000, "EatCard/" + CP_GUO + '/0/' + g_seq);
                                        cc.log("choose pass");
                                        that.hideAllOperationBtns();
                                        that.disableChuPai();
                                    }
                                    if ((operate & CP_HU) == CP_HU) {
                                        HUD.showConfirmBox('提示', '是否确认过胡？', passFunc, "确定", function () {
                                            that.showOperationBtns();
                                        }, "取消");
                                    } else {
                                        passFunc();
                                    }
                                }
                                break;
                            case 'btn_an':
                                var data = kaokaoRule.getCardsByType(g_self_turn_cards, 3);
                                if (data.length > 1) {
                                    that.addChild(new TouLayer(data, g_table_show_card, CP_AN, g_seq));
                                } else if (data.length == 1) {
                                    //{"Head":null,"Seq":1,"Card":0,"Flag":32,"Remark":null,"From":30,"ChiList":null,"CCards":{"Cards":[{"Cards":[1104,1104,1104],"Type":3}]}}
                                    var cards = data[0].Cards;
                                    var str = cards.join(',');
                                    network.sendPhz(5000, "EatCard/" + CP_AN + "/" + str + '/' + g_seq);
                                } else {
                                    cc.error("不存在暗牌---");
                                }
                                break;
                            case 'btn_chi':
                                var data = kaokaoRule.getCardsByType(g_self_turn_cards, 1);
                                if (data.length >= 1) {
                                    var chiLayer = new ChiLayer(data, g_table_show_card, CP_CHI, g_seq, (operate & CP_HU) == CP_HU);
                                    chiLayer.setName("chiLayer");
                                    that.addChild(chiLayer);
                                } else {
                                    cc.error("不存在---吃牌---");
                                }
                                break;
                            case 'btn_peng':
                                var data = kaokaoRule.getCardsByType(g_self_turn_cards, 2);
                                if (data.length > 1) {
                                    var chiLayer = new ChiLayer(data, g_table_show_card, CP_PENG, g_seq, (operate & CP_HU) == CP_HU);
                                    chiLayer.setName("chiLayer");
                                    that.addChild(chiLayer);
                                } else if (data.length == 1) {
                                    //{"Head":null,"Seq":1,"Card":0,"Flag":32,"Remark":null,"From":30,"ChiList":null,"CCards":{"Cards":[{"Cards":[1104,1104,1104],"Type":3}]}}
                                    var cards = data[0].Cards;
                                    var str = cards.join(',');
                                    if ((operate & CP_HU) == CP_HU) {
                                        HUD.showConfirmBox('提示', '是否确认过胡，选择碰牌？', function () {
                                            network.sendPhz(5000, "EatCard/" + CP_PENG + "/" + str + '/' + g_seq);
                                        }, "确定", function () {
                                            that.showOperationBtns();
                                        }, "取消");
                                    } else {
                                        network.sendPhz(5000, "EatCard/" + CP_PENG + "/" + str + '/' + g_seq);
                                    }
                                } else {
                                    cc.error("不存在---碰牌---");
                                }
                                break;
                            case 'btn_hu':
                                console.log("--- 胡牌 ---");
                                network.sendPhz(5000, "EatCard/" + CP_HU + "/" + 0 + '/' + g_seq);
                                break;
                            case "btn_piao":
                                network.sendPhz(5000, "Piao/" + 1);
                                break;
                            case "btn_bupiao":
                                network.sendPhz(5000, "Piao/" + 0);
                                break;
                            default :


                        }
                        that.hideAllOperationBtns();
                    });
                })(btns[i], op);

            }
            if (center) {
                var startX = 170 / 2 - btns.length * 170 / 2;
                for (var i = 0; i < btns.length; i++) {
                    var btnNode = $("nAction." + btns[i]);
                    btnNode.setVisible(true);
                    btnNode.setPositionX(startX + i * 170);
                }
            }
        },
        onSelectPiao: function (data) {
            // console.log(data);
            for (var i = 0; i < data.Status.length; i++) {
                var info = data.Status[i];
                if (info.UserID == gameData.uid && !info.IsSet) {
                    if (info.Value == 1) {
                        this.showOperationBtns(CP_PIAO, true);
                    } else {
                        this.showOperationBtns(CP_PIAO | CP_NOTPIAO, true);
                    }

                    if (DEBUG_HU) {
                        network.sendPhz(5000, "Piao/" + 1);
                    }
                }
                if (!info.IsSet) {
                    if (g_uid_to_pos[info.UserID] > 0)
                        $('node.piaoBg' + g_uid_to_pos[info.UserID], this.playersInfo).setVisible(true);
                } else {
                    if (g_uid_to_pos[info.UserID] > 0)
                        $('node.piaoBg' + g_uid_to_pos[info.UserID], this.playersInfo).setVisible(false);
                }

            }
        },
        onSelectDang: function (data) {
            if (data.UserId == gameData.uid) {
                this.showOperationBtns(CP_DANG | CP_GUO);
                if (DEBUG_HU) {
                    network.sendPhz(5000, "Dang/1");
                    this.hideAllOperationBtns();
                    this.disableChuPai();
                }
            } else {
                console.log("玩家：" + g_uid_to_pos[data.UserId] + "选择推当--");
                this.hideAllOperationBtns();
            }
            this.showCountDown(g_uid_to_pos[data.UserId])
        },
        setLeftCardCount: function (count) {
            if (count === undefined || count < 0) {
                $('leftbg').setVisible(false);
                return;
            }
            $('leftbg').setVisible(true);
            $('leftbg.num').setString(count);
        },
        refreshChoosePai: function (data) {
            if (g_choosePai && data.UserId == gameData.uid) {
                var pai = this.getPai(SELF_ROW, g_choosePai, CARDS_TYPE_OWN, true);
                if (pai) {
                    this._initPaisPos(SELF_ROW, undefined, undefined, 0);
                    pai.setOpacity(255);
                    // var j = pai.getUserData().idx.split("_")[1];
                    // pai.setLocalZOrder(16 - j);
                }
                g_choosePai = 0;
            }
        },
        onCacheCard: function (data) {
            var that = this;
            console.log(JSON.stringify(data));
//{"UserId":0,"Card":[1110],"IsCache":1,"Cai":1,"Ting":null}
//{"UserId":163270,"Card":[1207,1107],"IsTou":1,"Cai":null,"Ting":null,"Surplus":0}

            //如果是财 听
            this.hideAllOperationBtns();
            this.disableChuPai();
            this.clearAllMoPai();
            this.refreshChoosePai(data);

            g_table_show_card = data.Card[0];

            this.setLeftCardCount(data.Surplus);

            //偷到的牌 1摸牌动画 2插入手牌 3听用需要放入open牌
            if (data.IsTou == 1) {
                that.scheduleOnce(function () {
                    var touID = cc.sys.localStorage.getItem('lastTouUid');
                    if (touID == data.UserId) {
                        playEffect('vtou2', g_uid_to_sex[data.UserId]);
                    } else {
                        playEffect('vtou1', g_uid_to_sex[data.UserId]);
                    }
                    cc.sys.localStorage.setItem('lastTouUid', data.UserId);
                }, 0.8)

                network.stop(undefined, "onCacheCard1");
                if (data.UserId == gameData.uid) {
                    startAutoOpt();
                }
                if (data.Ting || data.Cai) {
                    if (this.getGameStep() == 4) {
                        playEffect('vcard' + (data.Ting ? 1 : data.Cai ? 2 : 0), g_uid_to_sex[data.UserId]);
                    }
                    //playEffect('vcard' + (data.Ting ? 1 : data.Cai ? 2 : 0), g_uid_to_sex[data.UserId]);
                    operateOpenCards(data.UserId, 'push', data.Ting ? 1 : data.Cai ? 2 : 0, 1);
                    that.initOpenCards(g_uid_to_pos[data.UserId]);
                    that.removePaiFromRCByID(g_uid_to_pos[data.UserId], data.Ting ? 1 : data.Cai ? 2 : 0);
                } else {
                    this.setCardsCount(data.UserId, data.Card.length == 2 ? 2 : 1, 'add');
                }

                that.scheduleOnce(function () {
                    if (data.Card.length == 0) {
                        data.Card = [0];
                    }
                    that.showTouPaiAnim(g_uid_to_pos[data.UserId], data.Card || [0], CP_TOU, function () {
                        console.log('call succ');
                        if (data.UserId == gameData.uid || mRoom.isReplay) {
                            that.showMoPaiToSelfAnim(g_uid_to_pos[data.UserId], data, function () {
                                console.log("call---back   onCacheCard");
                                network.start("onCacheCard");
                                stopAutoOpt();
                            });
                        } else {
                            console.log("----");
                            that.showMoPaiToPlayerAnim(g_uid_to_pos[data.UserId], function () {
                                console.log("====")
                                network.start("onCacheCard");
                            })
                        }
                    });
                }, 0.5 * g_anim_play_rate)

            } else if (data.IsTou == 0) {
                cc.sys.localStorage.setItem('lastTouUid', 0);
                playEffect('vcard' + data.Card[0], g_uid_to_sex[data.UserId]);
                network.stop(undefined, "onCacheCard2");
                if (data.Card[0] == 1 || data.Card[0] == 2)
                    this.setCardsCount(data.UserId, 1, 'add');
                //翻牌
                this.showMoPaiAnim(g_uid_to_pos[data.UserId], data.Card[0], undefined, function () {
                    if (data.Ting || data.Cai) {

                        cc.error("摸牌摸到 听用 财神  ---此处待开发------");
                        // that.showMoPaiToPlayerAnim(g_uid_to_pos[data.UserId], function () {
                        //     if(data.UserId == gameData.uid){
                        //         if(data.Ting || data.Cai){
                        //             var idx = g_self_cards.indexOf(data.Ting?1:data.Cai?2:0);
                        //             if(idx>=0){
                        //                 g_self_cards.splice(idx,1);
                        //             }
                        //         }
                        //         g_self_cards.push(data.Card[0]);
                        //         that.setPaiArrOfRow(0, g_self_cards, CARDS_TYPE_OWN)
                        //     }
                        //     if(data.Ting || data.Cai){
                        //         g_open_cards[data.UserId] = g_open_cards[data.UserId] || [];
                        //         g_open_cards[data.UserId].push({Cards:[data.Ting?1:data.Cai?2:0], Type:0});
                        //         that.initOpenCards(g_uid_to_pos[data.UserId]);
                        //     }
                        // });
                    } else {
                        // network.start();
                    }
                    network.start("onCacheCard2");
                });
                this.showCountDown(g_uid_to_pos[data.UserId])
            }


        },
        onPushCard: function (data) {

        },
        //开局偷牌结束后 通知玩家的状态
        onAllAnCard: function (data) {
            operateOpenCards(data.UserId, 'showan', data)

            this.initOpenCards(g_uid_to_pos[data.UserId]);

            this.refreshPoint(data.UserId)
        },
        onChooseStartGame: function (data) {
            this.start.setVisible(data.UserID == gameData.uid);

        },
        onGameStatus: function (data) {
            ////0 未开始 1 飘  2 发牌  3 当 4 偷牌  5 打牌
            this.setGameStep(data.Status);
        },
        onZongGameOver: function (data) {
            // this.addChild(new KKZongJiesuanLayer(data));
            var layer = this.getChildByName('jiesuan');
            if (layer) {
                layer.openZongjiesuan(data);
            } else {
                this.addChild(new KKZongJiesuanLayer(data));
            }
        },
        onGameOver: function (data) {
            var that = this;
            var jiesuanLayer = null;
            // setTimeout(function () {
            if (DEBUG_HU) {
                var count = 0;
                var isFail = false;
                var cards = this.getAllPaiRCIDs();
                var cards1 = [];
                for (var i = 0; i < cards.length; i++) {
                    for (var j = 0; j < cards[i].length; j++) {
                        count++;
                        cards1.push(cards[i][j]);
                    }
                }
                if (data.Winner == gameData.uid) {
                    count++;
                    cards1.push(data.ByCard);
                }
                for (var f = 0; f < data.Users.length; f++) {
                    var info = data.Users[f];
                    var row = g_uid_to_pos[info.UserID];
                    var cards = info.CPAllCars.Cards;
                    if (row == 0) {
                        if (cards.length != count) {
                            isFail = true;
                            break;
                        } else {
                            cards.sort(function (a, b) {
                                return a - b;
                            })
                            cards1.sort(function (a, b) {
                                return a - b;
                            })
                            if (JSON.stringify(cards) != JSON.stringify(cards1)) {
                                isFail = true;
                                break;
                            }
                        }
                    }
                }

                if (data.WinnerZimo) {
                    isFail = false;
                }


                jiesuanLayer = new KKJiesuanLayer(data, undefined, g_uid_to_pos)
                jiesuanLayer.setName('jiesuan');
                that.addChild(jiesuanLayer);
                if (!isFail) {
                    // setTimeout(function () {
                    //     jiesuanLayer.removeFromParent();
                    //     network.sendPhz(5000, "Ready");
                    // }, 100);
                }
            } else {
                jiesuanLayer = new KKJiesuanLayer(data, function () {
                    that.clearAllMoPai();
                }, g_uid_to_pos);
                jiesuanLayer.setName('jiesuan');
                that.addChild(jiesuanLayer);
            }
            // }, 100);
            this.hideAllOperationBtns(true);
            this.disableChuPai();
            this.hideCountDown();
            for (var i = 0; i < data.Users.length; i++) {
                var player = data.Users[i];
                var id = player.UserID;
                g_self_cards[id] = player.CPAllCars.Cards;
                this.refreshPoint(id);
                $("node.info" + g_uid_to_pos[id] + ".txtScore", this.playersInfo).setString(player.Score || 0);
            }


            // var shenqingjiesanLayer = $("shenqingjiesan", that);
            // if (shenqingjiesanLayer) {
            //     shenqingjiesanLayer.removeFromParent(false);
            // }
            if (mRoom.isReplay) {
                this.clearAllMoPai();
                $('node.nCards1', this.playersInfo).removeAllChildren();
                $('node.nCards2', this.playersInfo).removeAllChildren();
                if (jiesuanLayer)
                    jiesuanLayer.replaySetting();
            }
        },
        onDangSelected: function (data) {
            console.log("onDangSelected");
            this.hideAllOperationBtns();
            if (data.IsDang) {
                var id = data.UserId;
                var dangSp = $('node.info' + g_uid_to_pos[id] + ".dang", this.playersInfo);
                dangSp.setVisible(true);
                var tarPos = dangSp.convertToNodeSpace(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
                var curPos = dangSp.getPosition();
                dangSp.setPosition(tarPos);
                dangSp.runAction(
                    cc.sequence(
                        cc.scaleTo(0.2, 1.5).easing(cc.easeInOut(3)),
                        cc.spawn(
                            cc.moveTo(0.3, curPos),
                            cc.scaleTo(0.3, 1.0)
                        ),
                        cc.scaleTo(0.2, 2),
                        cc.delayTime(0.3),
                        cc.scaleTo(0.1, 1)
                    )
                );
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
            // console.log(data);
            this.isStart = true;
            mRoom.isStart = this.isStart;

            // this.setReady(gameData.uid, false);
            this.setPlayersStatus(false);

            this.clearTable4StartGame();

            this.setupPlayers();
            this.setupGameStart();


            // this.setCurRound(g_curRound+1);
            g_zhuangid = data.BankerUserID

            if (data.CurrentRound) {
                this.setCurRound(data.CurrentRound, g_option.jushu)
            }
            if (g_option["desp"].indexOf('定飘') >= 0) {
                console.log("---定飘---" + JSON.stringify(g_playerPiaoState));
                for (var i = 0; i < this.playersNum; i++) {
                    this.setPlayerPiaoState(g_pos_to_uid[i], g_playerPiaoState[g_pos_to_uid[i]], true)
                }
            }

            var that = this;
            var fanCard = data.BankerCard;
            if (fanCard) {
                network.stop('翻拍---s');
                var pai = createCardSprite(fanCard, 'big')
                var pos = cc.p(640, 100 + cc.winSize.height / 2);
                that.addChild(pai);
                pai.setPosition(pos);
                var head = $('node.info' + g_uid_to_pos[g_zhuangid], that.playersInfo)
                // console.log(head.getPosition());
                pai.setScale(0);
                pai.setOpacity(0);
                pai.runAction(cc.sequence(
                    cc.spawn(cc.scaleTo(0.3 * g_anim_play_rate, 1, 1), cc.fadeIn(0.3 * g_anim_play_rate)),
                    cc.delayTime(0.3),
                    cc.spawn(cc.moveTo(0.3, head.getPosition()), cc.fadeOut(0.3), cc.scaleTo(0.3, 0, 0))
                    , cc.callFunc(function () {
                        if (g_zhuangid) {
                            $('node.info' + g_uid_to_pos[g_zhuangid] + ".zhuang", that.playersInfo).setVisible(true);
                        }
                        network.start('翻拍---s');
                    })
                    , cc.delayTime(0.1)
                    , cc.removeSelf(false)
                ));

            } else {
                if (g_zhuangid) {
                    $('node.info' + g_uid_to_pos[g_zhuangid] + ".zhuang", that.playersInfo).setVisible(true);
                }
            }
        },
        setCurRound: function (round, totle) {
            console.log("局数----" + round);
            g_curRound = round;
            g_totleRound = totle || g_totleRound;
            $('txtRound').setVisible(true);
            $('txtRound').setString(g_curRound + "/" + g_totleRound);
        },
        setupGameStart: function () {
            this.setRoomState(2);
            this.invite.setVisible(false);
            this.copyroom.setVisible(false);
            // this.tuichu.setVisible(false);
            // this.jiesan.setVisible(false);
            if (mRoom.isReplay != true) {
                this.btn_mic.setVisible(true);
            }
        },

        onStatusChange: function (data) {
            console.log(data.UserID + "  准备好了 round=" + data.Round);
            this.setCurRound(data.Round, g_option.jushu);
        },
        dealCardsAnim: function (row, paiArr, type) {
            var count = 0;
            for (var i = 0; i < paiArr.length; i++) {
                for (var j = 0; j < paiArr[i].length; j++) {
                    var pai = this.getPai(row, i + '_' + j, type, true);
                    if (pai) {
                        count++;
                        var pos = pai.getPosition();
                        var angle = pai.getRotation();
                        pai.setPosition(cc.p(640, 460));
                        pai.setScale(0);
                        pai.setRotation(90);
                        pai.runAction(cc.sequence(
                            cc.delayTime(0.08 * g_anim_play_rate * count + j * 0.05 * g_anim_play_rate),
                            cc.callFunc(function () {
                                playEffect('vsendCard');
                            }),
                            cc.spawn(
                                cc.moveTo(0.12 * g_anim_play_rate, pos).easing(cc.easeIn(1.6)),
                                cc.rotateTo(0.12 * g_anim_play_rate, angle).easing(cc.easeOut(1.4)),
                                cc.scaleTo(0.12 * g_anim_play_rate, 1).easing(cc.easeIn(1.4))
                            )
                        ));
                    }
                }
            }

            var that = this;
            that.scheduleOnce(function () {
                network.start("发牌");
                that.refreshPoint(g_pos_to_uid[row]);
            }, 1.7 * g_anim_play_rate)
        },
        setCardsCount: function (uid, count, type) {
            console.log("setCardsCount " + uid);
            console.log(count);
            if (type == 'add') {
                g_leftCards[uid] += count;
            } else {
                g_leftCards[uid] = count;
            }
            console.log(g_leftCards[uid]);
            var txt = $('node.info' + g_uid_to_pos[uid] + ".txt_count", this.playersInfo);
            if (txt) {
                txt.setString(g_leftCards[uid] + '张');
            }
        },
        onCardDeal: function (data, closeAnim) {
            // g_leftCards[data.ToUser] = data.Cards.length;
            if (!closeAnim)
                this.setCardsCount(data.ToUser, data.Cards.length);


            var cards = data.Cards;
            // g_self_cards = cards;
            this.addSelfCards(data.ToUser, cards)
            // this.enableChuPai();
            var parArr = kaokaoRule.sortCards(cards);
            //初始化自己手牌

            if (closeAnim && data.ToUser == gameData.uid) {
                var str = cc.sys.localStorage.getItem('kkcards');
                if (str) {
                    var localCards = JSON.parse(str);
                    var localCard1 = [];
                    for (var i = 0; i < localCards.length; i++) {
                        for (var j = 0; j < localCards[i].length; j++) {
                            localCard1.push(localCards[i][j])
                        }
                    }
                    if (localCard1.length == cards.length) {
                        var arr1 = localCard1.sort();
                        var arr2 = cards.sort();
                        for (var i = 0; i < arr1.length; i++) {
                            if (arr1[i] != arr2[i]) {
                                break;
                            }
                        }
                        if (i == arr1.length) {
                            parArr = localCards;
                        }
                    }
                }
            }

            this.setPaiArrOfRC(g_uid_to_pos[data.ToUser], parArr, CARDS_TYPE_OWN)

            if (!closeAnim && data.ToUser == gameData.uid) {
                network.stop(undefined, '发牌')
                //放动画
                this.dealCardsAnim(0, parArr, CARDS_TYPE_OWN);
            }
        },
        onUserJoin: function (data) {
            // var data = event.getUserData();
            // console.log(data);
            if (data.Head.Result != null && data.Head.Result == -1) {
            } else {
                // gameData.players = data["Users"];
                this.setupPlayers(data["Users"]);
                // var offLines = data.OfflineList;
                // for (var i = 0; i < offLines.length; i++) {
                //     var userId = Math.abs(offLines[i]);
                //     this.setDisconnect(userId, offLines[i] < 0);
                // }
            }
            g_data.Owner = data.Owner;
            this.setRoomState(0);
            this.start.setVisible(false);
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
            if (data.Users[0] == gameData.uid) {
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

            this.hideAllOperationBtns(true);
//{"Head":null,"Turn":18,"Second":20,"Remark":null,"Seq":5,"Cards":[],"Freeze":[]}
            g_seq = data.Seq;
            var that = this;
            if (data.Turn == gameData.uid) {
                this.enableChuPai();
                console.log("选择出牌吧 ！！！ ");
                if (data.CardCount) {
                    var count = 0;
                    var cards = this.getAllPaiRCIDs();
                    var cards1 = [];
                    for (var i = 0; i < cards.length; i++) {
                        for (var j = 0; j < cards[i].length; j++) {
                            count++;
                            cards1.push(cards[i][j])
                        }
                    }
                    if (count != data.CardCount && !DEBUG_HU) {
                        cc.error("玩家手牌出现错误！   与服务器同步 重新连接" + data.CardCount + '  ' + count);
                        network.disconnect();
                        return;
                    }
                    cards1.sort(function (a, b) {
                        return a - b;
                    })
                    var cards3 = data.Cards;
                    cards3.sort(function (a, b) {
                        return a - b;
                    })
                    if (JSON.stringify(cards1) != JSON.stringify(cards3)) {
                        cc.error("显示 ： " + JSON.stringify(cards1) + "\n服务器：" + JSON.stringify(cards3))
                        network.disconnect();
                        return;
                    }
                }
                if (DEBUG_HU) {
                    var cards = this.getAllPaiRCIDs();
                    while (true) {
                        var i = Math.floor(Math.random() * cards.length)
                        if (cards[i] && cards[i].length > 0) {
                            var j = Math.floor(Math.random() * cards[i].length)
                            var pai = this.getPai(SELF_ROW, i + "_" + j, CARDS_TYPE_OWN, true);
                            if (pai) {
                                that.scheduleOnce(function () {
                                    var obj = pai.getUserData();
                                    that.sendCardAnim(pai);
                                    that.sendCard(obj.pai, pai);
                                }, 0.5 * g_anim_play_rate);
                                break;
                            }
                        }
                    }
                }
            } else {
                this.disableChuPai();
                console.log("玩家" + data.Turn + " 准备出牌中");
            }
            this.showCountDown(g_uid_to_pos[data.Turn]);
        },
        onTurnIn: function (data) {
            g_seq = data.Seq;
            g_self_turn_cards = data.CCards.Cards;
//{"Head":null,"Seq":3,"Card":0,"Flag":32,"Remark":null,"From":28,"ChiList":null,"CCards":{"Cards":[{"Cards":[2104,2104,2104],"Type":3}]}}
            console.log("trun in ---" + JSON.stringify(data));
            this.showOperationBtns(data.Flag | CP_GUO);

            //this.showCountDown(g_uid_to_pos[data.UserId])
            this.hideCountDown();

            if (DEBUG_HU) {
                if ((data.Flag & CP_HU) == CP_HU) {
                    network.sendPhz(5000, "EatCard/" + CP_HU + '/0/' + g_seq);
                    // network.sendPhz(5000, "EatCard/" + CP_GUO + '/0/' + g_seq);
                } else {
                    if (data.Flag > 0) {
                        this.scheduleOnce(function () {
                            if ((data.Flag & CP_PENG) == CP_PENG) {
                                //var cards = g_self_turn_cards[0].Cards;
                                var cards = kaokaoRule.getCardsByType(g_self_turn_cards, 2)[0].Cards;
                                var str = cards.join(',');
                                network.sendPhz(5000, "EatCard/" + CP_PENG + "/" + str + '/' + g_seq);
                            } else if ((data.Flag & CP_AN) == CP_AN) {
                                var cards = g_self_turn_cards[0].Cards;
                                var str = cards.join(',');
                                network.sendPhz(5000, "EatCard/" + CP_AN + "/" + str + '/' + g_seq);
                            } else if ((data.Flag & CP_CHI) == CP_CHI) {
                                var cards = kaokaoRule.getCardsByType(g_self_turn_cards, 1)[0].Cards;
                                // var cards = g_self_turn_cards[0].Cards;
                                var str = cards.join(',');
                                network.sendPhz(5000, "EatCard/" + CP_CHI + "/" + str + '/' + g_seq);
                            } else {
                                network.sendPhz(5000, "EatCard/" + CP_GUO + '/0/' + g_seq);
                            }
                        }, 0.5 * g_anim_play_rate)
                        this.hideAllOperationBtns();
                        this.disableChuPai();
                    }
                }
            }
        },
        playOptSound: function (opt, sex) {
            switch (opt) {
                case CP_HU:
                    playEffect('vhu', sex);
                    break;
                case CP_CHI:
                    playEffect('vchi', sex);
                    break;
                case CP_PENG:
                    playEffect("vpeng", sex);
                    break;
                case CP_PIAO:
                    playEffect("vpiao", sex);
                    break;
                case CP_DANG:
                    playEffect("vdang", sex);
                    break;
                case CP_GUO:
                    playEffect("vguo", sex);
                    break;
                case CP_NOTPIAO:
                    playEffect("vbupiao", sex);
                    break;
                case CP_AN:
                    playEffect("van", sex);
                    break;
            }
        },
        onBroadCast: function (data) {
            //{"Head":null,"Action":"29/ShowCard/1206/7","ScoreChange":null}
            var cmd = data.Action.split('/');


            switch (cmd[1]) {
                case "DisCard":
                    this.showOutCard(cmd[0], parseInt(cmd[2]));
                    break;
                case "ShowCard":
                    //this.showCountDown(g_uid_to_pos[cmd[0]]);
                    console.log("*** 收到广播 玩家" + cmd[0] + cmd[1] + " 牌id=" + cmd[2]);
                    if (!mRoom.isReplay) {
                        if (cmd[0] == gameData.uid) {
                            this.removeSelfCards(cmd[0], parseInt(cmd[2]))
                        } else {
                            this.showSendPaiAnim(g_uid_to_pos[cmd[0]], cmd[2]);
                        }
                    } else {
                        this.clearAllMoPai();
                        this.removeSelfCards(cmd[0], parseInt(cmd[2]))
                        this.removePaiFromRCByID(g_uid_to_pos[cmd[0]], parseInt(cmd[2]), 1);
                        this.showSendPaiAnim(g_uid_to_pos[cmd[0]], cmd[2]);
                    }

                    this.setDisconnect(cmd[0], false);
                    //出牌显示
                    this.showOutCard(cmd[0], cmd[2]);
                    playEffect('vcard' + cmd[2], g_uid_to_sex[cmd[0]]);

                    this.setCardsCount(cmd[0], -1, 'add');

                    break;
                case "EatCard":
                    //this.showCountDown(g_uid_to_pos[cmd[0]]);
                    //{"Head":null,"Action":"41/EatCard/32/1107,1107,1107/2","ScoreChange":null}
                    var obj = kaokaoRule.executeBroadCastCmd(cmd);
                    var uid = obj.uid;
                    var opt = obj.opt;
                    var cards = obj.cards;
                    this.setDisconnect(uid, false);
                    this.playOptSound(opt, g_uid_to_sex[uid]);
                    console.log("*** 收到广播 " + JSON.stringify(OP_TO_BTN_NAME(opt)) + "玩家" + cmd[0] + cmd[1] + " 牌id=" + cmd[3]);
                    if (opt == CP_GUO) {
                        this.hideAllOperationBtns();
                        this.disableChuPai();
                        break;
                    }

                    if (opt != CP_HU) {
                        this.clearAllMoPai();
                        var type = opt == CP_CHI ? 1 : (opt == CP_PENG ? 2 : (opt == CP_AN ? 3 : 0));
                        operateOpenCards(uid, 'push', (function (arr) {
                            var obj = {}
                            obj.Cards = [];
                            for (var i = 0; i < arr.length; i++) {
                                obj.Cards.push(arr[i]);
                            }
                            obj.Type = type;
                            return obj;
                        })(cards))
                        this.initOpenCards();
                        this.execEatDetail(uid, opt, cards);
                        switch (opt) {
                            case CP_CHI:
                                this.hideAllOperationBtns(true);
                                this.setCardsCount(uid, -1, 'add');
                                break;
                            case CP_PENG:
                                this.hideAllOperationBtns(true);
                                this.setCardsCount(uid, -2, 'add');
                                break;
                            case CP_AN:
                                this.setCardsCount(uid, -(cards.length), 'add');
                                break;
                        }
                    }


                    //修改自己手牌
                    if (cmd[0] == gameData.uid) {
                        startAutoOpt();
                    }
                    if (opt == CP_AN) {
                        var cards = cmd[3].split(',');
                        for (var i = 0; i < cards.length; i++) {
                            this.removeSelfCards(cmd[0], parseInt(cards[i]));
                        }
                        var paiID = cards[0];
                        this.removePaiFromRCByID(g_uid_to_pos[cmd[0]], parseInt(paiID), cards.length);
                    }
                    if (opt == CP_CHI) {
                        var cards = cmd[3].split(',');
                        this.removeSelfCards(cmd[0], parseInt(cards[0]));
                        this.removePaiFromRCByID(g_uid_to_pos[cmd[0]], parseInt(cards[0]), 1);
                    }
                    //碰|| opt==CP_PENG
                    if (opt == CP_PENG) {
                        var cards = cmd[3].split(',');
                        for (var i = 0; i < 2; i++) {
                            this.removeSelfCards(cmd[0], parseInt(cards[i]));
                        }
                        this.removePaiFromRCByID(g_uid_to_pos[cmd[0]], parseInt(cards[0]), 2);
                    }

                    var node = $('node.cache' + g_uid_to_pos[uid], this.playersInfo);
                    if (node) {
                        network.stop(undefined, "广播 动画停");
                        // var anim = playAnimationByOperate(node, opt, function () {
                        //     network.start("广播 动画开始");
                        //     anim.removeFromParent(false);
                        //     stopAutoOpt();
                        // });
                        playAnimationByOperate(node, opt);
                        this.scheduleOnce(function () {
                            network.start("广播 动画开始");
                            stopAutoOpt();
                        }, 0.55 * g_anim_play_rate)
                    }
                    break;
                case "Piao":
                    if (g_option["desp"].indexOf('定飘') >= 0 && g_curRound > 1 && !mRoom.isReplay) {
                        break;
                    }
                    console.log(cmd[0] + " 选择漂 " + cmd[2]);
                    var node = $('node.cache' + g_uid_to_pos[cmd[0]], this.playersInfo);
                    if (node && cmd[2] == 1) {
                        playEffect('vpiao', g_uid_to_sex[cmd[0]]);
                        network.stop(undefined, "选择漂");
                        var anim = playAnimationByOperate(node, CP_PIAO, function () {
                            network.start("选择漂");
                            anim.removeFromParent(false);
                        });
                    }
                    if (cmd[2] != 1) {
                        g_noChoosePiaoCount++;
                    }
                    var row = g_uid_to_pos[cmd[0]];
                    if (row > 0) {
                        $('node.piaoBg' + row, this.playersInfo).setVisible(false);
                    }
                    // $('node.info' + row + '.piao', this.playersInfo).setVisible(cmd[2] == 1);
                    this.setPlayerPiaoState(cmd[0], cmd[2]);
                    if (g_noChoosePiaoCount == this.playersNum) {
                        this.showTips('当前牌局无人选飘');
                    }
                    break;
                default:
                    cc.error("未处理广播---》》》》" + cmd[1]);
            }


            //设置牌点数
            this.refreshPoint(cmd[0]);
        },
        execEatDetail: function (uid, op, cards) {
            // console.log(JSON.stringify(cards));
            if (op == CP_CHI && cards && cards.length > 0) {
                //判断吃四根
                if (kaokaoRule.isHasPengAnCard(g_open_cards[uid], cards[cards.length - 1])) {
                    this.addEatCardDetails(uid, 'chichengsige');
                }
            }
        },
        addEatCardDetails: function (uid, type) {
            var row = g_uid_to_pos[uid];
            var node = $('node.cache' + row, this.playersInfo);
            if (type == 'chichengsige') {
                var sp = new cc.Sprite("res/submodules/kaokao/image/common/word_chichengsige.png");
                //setSpriteFrameByPath(sp, cp_png_res1_path + 'text_chichengsige.png', res.cp_res2);
                node.addChild(sp)
                sp.y = -100;
                sp.setOpacity(0);
                sp.runAction(cc.sequence(
                    cc.fadeIn(0.3), cc.delayTime(1), cc.fadeOut(0.1), cc.removeSelf(false)
                ));
            }
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
        refreshPoint: function (uid) {
            var point = kaokaoRule.getPointByCards(g_self_cards[uid], g_open_cards[uid]) || 0;
            //console.log("refreshPoint ->" + uid + "   " + point);
            $('node.info' + g_uid_to_pos[uid] + ".txt_point", this.playersInfo).setString(point + "点");
        },
        onVoice: function () {

        },
        onMaDeng: function () {

        },
        onUserKick: function () {

        },
        onNiao_Status: function () {

        },
        onRoomResult: function () {

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
                    if(!ok)
                        continue;
                    if (!!info.ReadyValue) {
                        ok.setVisible(true);
                        if (info.UserID == gameData.uid) {
                            this.zhunbei.setVisible(false);
                        }
                    } else {
                        ok.setVisible(false);
                    }
                    if (data.GameStatus) {
                        ok.setVisible(false);
                    }
                }
            } else {
                for (var i = 0; i < this.playersNum; i++) {
                    var ok = $('node.info' + i + '.ok', this.playersInfo);
                    if(ok)
                        ok.setVisible(!!data);
                }
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
                playerInfo.uid = playerInfo.ID;
                playerInfo.nickname = playerInfo.NickName;
                playerInfo.ip = playerInfo.IP;
                playerInfo.headimgurl = playerInfo.HeadIMGURL;
                playerInfo.sex = playerInfo.Sex;
            }
            shenqingjiesanLayer.setArr(leftSeconds, data.Users, data.ByUserID);
        },
        getPaiArrRC: function (type) {
            var arr = [];
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 4; j++) {
                    var pai = this.getPai(0, i + "_" + j, type, true);
                    var userData = pai.getUserData();
                    if (userData.pai >= 0 && pai.isVisible()) {
                        arr.push(userData.pai);
                    }
                }
            }
            return arr;
        },
        getPaiArr: function (type) {
            var arr = [];
            for (var j = 0; j < g_initPaiNum; j++) {
                var pai = this.getPai(0, j, type, true);
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
        enableSortPai: function () {
            var that = this;
            var oldPos = null;
            var offPos = null;
            var zOrder = 0;
            var isOptOver = false;
            var lastClickPai = 0;
            var lastClickTime = 0;
            var windowOffx = (cc.winSize.width - 1280)/2;
            var sortpaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    // console.log("touch ----")
                    if (g_choosePai)
                        return false;
                    if (g_isSelfPaiAutoOpt)
                        return false;
                    // if (!g_isCanSendPai)
                    //     return false;

                    var paiArr = that.getAllPaiRC();
                    for (var j = 0; j < 4; j++) {
                        for (var i = 0; i < paiArr.length; i++) {
                            var pai = paiArr[i][j];
                            if (pai && pai.isVisible()) {
                                if (TouchUtils.isTouchMe(pai, touch, event)) {
                                    var userData = pai.getUserData();
                                    g_choosePai = userData.idx;
                                    oldPos = pai.getPosition();
                                    offPos = pai.convertToNodeSpace(touch.getLocation());
                                    pai.setOpacity(200);
                                    zOrder = pai.getLocalZOrder();
                                    pai.setLocalZOrder(99);
                                    isOptOver = false;

                                    if (g_isCanSendPai) {
                                        var time = new Date().getTime();
                                        if (time - lastClickTime < 200) {
                                            if (g_choosePai == lastClickPai) {
                                                pai.setOpacity(255);
                                                that.sendCardAnim(pai);
                                                that.sendCard(userData.pai, pai);
                                                offPos = null;
                                                g_choosePai = 0;
                                                lastClickPai = 0;
                                                return false;
                                            } else {
                                                lastClickPai = g_choosePai;
                                            }
                                            lastClickTime = 0;
                                        } else {
                                            lastClickTime = time;
                                        }
                                        lastClickPai = g_choosePai;
                                    }

                                    return true;
                                }
                            }
                        }
                    }
                },
                onTouchMoved: function (touch, event) {
                    // console.log("onTouchMoved ----" + isOptOver + g_choosePai + g_isSelfPaiAutoOpt)
                    if (isOptOver)return;
                    // console.log("onTouchMoved");
                    if (!!g_choosePai) {
                        var pai = that.getPai(SELF_ROW, g_choosePai, CARDS_TYPE_OWN, true);
                        // console.log(offPos);
                        if (pai && g_isSelfPaiAutoOpt) {
                            oldPos.x -= windowOffx;
                            pai.setPosition(oldPos);
                            pai.setOpacity(255);
                            pai.setLocalZOrder(zOrder);
                            offPos = null;
                            g_choosePai = 0;
                            isOptOver = true;
                            return;
                        }
                        if (pai && offPos) {
                            pai.setPosition(cc.p(touch.getLocation().x - offPos.x + pai.width / 2 -windowOffx, touch.getLocation().y - offPos.y + pai.height / 2));
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    // console.log("onTouchEnded ----" + isOptOver + g_choosePai + g_isSelfPaiAutoOpt)
                    // console.log("onTouchEnded");
                    if (!!g_choosePai && !g_isSelfPaiAutoOpt) {
                        if (isOptOver)return;

                        var pai = that.getPai(SELF_ROW, g_choosePai, CARDS_TYPE_OWN, true);
                        if (pai) {
                            //出牌阶段
                            var obj = pai.getUserData();
                            if (g_isCanSendPai && obj.pai && touch.getLocation().y >= 360) {
                                pai.setOpacity(255);
                                that.sendCardAnim(pai);
                                that.sendCard(obj.pai, pai);
                                offPos = null;
                                g_choosePai = 0;
                                return;
                            }

                            //否则理牌
                            var res = that.movePaiWithRC(pai);
                            console.log("res 否则理牌--> " + res);
                            if (!res) {
                                pai.setPosition(oldPos);
                                pai.setOpacity(255);
                                pai.setLocalZOrder(zOrder);
                            } else if (res == 'exist') {
                                pai.setOpacity(255);
                            }
                        }

                    }
                    offPos = null;
                    g_choosePai = 0;
                },
                onTouchCancelled: function (touch, event) {
                    console.log("onTouchCancelled ----" + isOptOver + g_choosePai + g_isSelfPaiAutoOpt)
                    offPos = null;
                    g_choosePai = 0;
                }
            });

            cc.eventManager.addListener(sortpaiListener, $("node.nCards0", this.playersInfo));
            this.sortpaiListener = sortpaiListener;
        },
        disableSortPai: function () {
            if (this.sortpaiListener) {
                cc.eventManager.removeListener(this.sortpaiListener);
            }
            this.sortpaiListener = null;
        },
        disableChuPai: function () {
            $('chupaiAnim').setVisible(false)
            g_isCanSendPai = false;
        },
        enableChuPai: function () {
            $('chupaiAnim').setVisible(true);
            g_isCanSendPai = true;
        },
        sendCardAnim: function (pai) {
            console.log("sendCardAnim");
            var type = CARDS_TYPE_CACHE;
            var row = SELF_ROW;
            var node = $("node." + type + row, this.playersInfo);
            if (node) {
                var pos1 = pai.convertToWorldSpace(cc.p(0, 0));
                var sp = duplicateSprite(pai)
                var pos2 = node.convertToNodeSpace(pos1);
                node.addChild(sp);
                sp.setPosition(cc.p(pos2.x + sp.width / 2, pos2.y + sp.height / 2));
                sp.setLocalZOrder(99);
                sp.runAction(cc.sequence(
                    cc.spawn(
                        cc.moveBy(0.1 * g_anim_play_rate, cc.p(50, 100)),
                        cc.rotateTo(0.1 * g_anim_play_rate, 20).easing(cc.easeIn(3))
                    ),
                    cc.spawn(
                        cc.moveTo(0.2 * g_anim_play_rate, cc.p(0, 0)).easing(cc.easeOut(2)),
                        cc.rotateTo(0.2 * g_anim_play_rate, 90)
                    ),
                    cc.delayTime(0.5 * g_anim_play_rate),
                    cc.callFunc(function () {
                        network.start();
                    })
                ))
            }
        },
        sendCard: function (id, pai) {
            this.removePaiFromRC(SELF_ROW, pai);

            network.stop();
            //第一个是ShowCard 第二个是牌    第三个是seq
            network.sendPhz(5000, "ShowCard/" + id + "/" + g_seq);
            this.disableChuPai();

        },
        setPaiArrOfRC: function (row, paiArr, type) {
            if (!mRoom.isReplay && row != 0)
                return;
            if (!paiArr || !(paiArr[0] instanceof Array)) {
                cc.error("传入二维数组->" + 'setPaiArrOfRC');
                return;
            }
            if (paiArr.length > 10) {
                cc.error("错误 牌超过十列");
                return;
            }
            //计算居中显示
            var width = row == 0 ? 1280 : 0;
            var CARD_WIDTH = 85;
            var offx = width / 2 - paiArr.length * CARD_WIDTH / 2 + CARD_WIDTH;
            var offy = -70;
            //
            for (var i = 0; i < paiArr.length; i++) {
                for (var j = 0; j < paiArr[i].length; j++) {
                    var pai = this.setPai(row, i + '_' + j, paiArr[i][j], true, type)
                    pai.setPosition(cc.p(offx + i * CARD_WIDTH, offy + j * CARD_SPACE));
                    pai.setLocalZOrder(16 - j)
                }
                for (; j < 4; j++) {
                    this.setPai(row, i + '_' + j, 0, false, type);
                }
            }

            this._initPaisPos(row);

        },
        setPaiArrOfRow: function (row, paiArr, type) {
            console.log(row + "  重新刷新手牌 " + JSON.stringify(paiArr));
            // paiArr.sort(function (a, b) {
            //     return a - b;
            // });
            // var index = 0;
            // for (var i = 0; i < paiArr.length; i++) {
            //     for (var j = 0; j < paiArr[i].length; j++) {
            //         index++;
            //         var pai = this.setPai(row, index, paiArr[i][j], true, type)
            //         pai.setPosition(cc.p(200 + i * 75, 200 + j * 65));
            //         pai.setLocalZOrder(16 - j)
            //     }
            // }
            // if (index > g_initPaiNum) {
            //     cc.error("牌数量 超过 " + g_initPaiNum);
            //     return;
            // }
            // //TODO 可以优化
            // for (index += 1; index < g_initPaiNum; index++) {
            //     this.setPai(row, index, 0, false, type);
            // }
        },
        setPaiHua: function (pai, val, row) {
            var card = PAIID2CARD[val];
            if (!card) {
                cc.error("未识别牌 " + val);
                return;
            }
            if (row == 0) {
                if (parseInt(val) == 0) {
                    setSpriteFrameByPath(pai, card.resName, res.cp_cards);
                } else {
                    setSpriteFrameByPath(pai, "image_" + card.resName, res.cp_cards);
                }
            } else {
                setSpriteFrameByPath(pai, "short_big.png", res.cp_cards);
                var child_sprite = new cc.Sprite();
                pai.addChild(child_sprite);
                // child_sprite.setRotation(90);
                child_sprite.setPosition(cc.p(pai.getContentSize().width / 2, pai.getContentSize().height / 2));
                setSpriteFrameByPath(child_sprite, "" + card.resName, res.cp_cards);
            }


        },
        setPaiSmallHua: function (pai, val) {
            var card = PAIID2CARD[val];
            if (!card) {
                cc.error("未识别牌 " + val);
                return;
            }
            var hua = pai.getChildByName('content');
            if (!hua) {
                hua = new cc.Sprite();
                pai.addChild(hua);
                hua.setName('content');
                setSpriteFrameByPath(pai, 'short_small.png', res.cp_cards)
            }
            setSpriteFrameByPath(pai, "" + card.resName, res.cp_cards);
        },
        setPai: function (row, idx, val, isVisible, type) {
            var pai = this.getPai(row, idx, type, !isVisible);//可见就不是lazy加载
            if (!pai)
                return;
            var userData = pai.getUserData();
            this.setPaiHua(pai, val, row);

            userData.pai = val;// < 100 ? val : (Math.floor(val / 100) - 1);
            if (!_.isUndefined(isVisible)) {
                if (isVisible)
                    pai.setVisible(true);
                else
                    pai.setVisible(false);
            }
            return pai;
        },
        movePaiWithRC: function (pai) {
            var offx = 1280 / 2 - g_selfcards_cols * CARD_WIDTH / 2 + CARD_WIDTH;
            // var offy = -61;
            // console.log(offx + "   " + offy);
            var pos = pai.getPosition();
            var seqx = Math.ceil((pos.x - offx - CARD_WIDTH / 2 ) / CARD_WIDTH);
            var seqy = Math.floor((pos.y + CARD_SPACE + CARD_SPACE / 2) / CARD_SPACE); //
            console.log("movePaiWithRC -> " + seqx + "  " + seqy + " totle=" + g_selfcards_cols);


            var res = this.addPaiToRCByPai(pai, seqx, seqy);
            if (res == 'new') {
                this.removePaiFromRC(SELF_ROW, pai, undefined, 0.2);
            }
            return res;
        },
        /**
         * 玩家手动理牌调用 执行牌移动插入逻辑
         * @param pai
         * @param toCol
         * @param toRow
         * @returns {*}
         */
        addPaiToRCByPai: function (pai, toCol, toRow) {
            var id = pai.getUserData().pai;
            // var idx = pai.getUserData().id;
            var oldCol = pai.getUserData().idx.split("_")[0];
            var oldRow = pai.getUserData().idx.split("_")[1];
            if (toCol < 0) {
                if (g_selfcards_cols >= 10) {
                    return false;
                }
                toCol = 0;
                toRow = 0;//此情况数组右侧移动
                var cards = this.getAllPaiRC();
                for (var i = cards.length - 1; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        this._setPaiCache(SELF_ROW, (i + 1) + '_' + j, CARDS_TYPE_OWN, cards[i][j])
                    }
                }
                for (var j = 0; j < 4; j++) {
                    this._setPaiCache(SELF_ROW, 0 + '_' + j, CARDS_TYPE_OWN, undefined)
                }
            }
            if (toCol >= g_selfcards_cols) {
                toCol = g_selfcards_cols;
                toRow = 0;
                if (g_selfcards_cols >= 10) {
                    return false;
                }
            }
            if (toRow < 0) {
                toRow = 0;
            }
            if (toRow >= 4) {
                toRow = 3;
            }

            var oldPai = this._getPaiCache(SELF_ROW, toCol + '_' + toRow, CARDS_TYPE_OWN);
            if (oldPai) {//该位置有牌的时候
                // console.log("该位置有牌的时候");
                //取该列最上头元素
                for (var i = 3; i >= 0; i--) {
                    var tPai = this._getPaiCache(SELF_ROW, toCol + '_' + i, CARDS_TYPE_OWN);
                    if (tPai) {
                        break;
                    }
                }
                if (i == 3) {//该列满了 如果本来属于该列 调整 否则 直接返回
                    console.log("满了");
                    if (oldCol == toCol) {
                        // console.log("列滑动 " + toRow);
                        var oldArr = [0, 1, 2, 3];
                        oldArr.splice(oldRow, 1);
                        oldArr.splice(toRow, 0, oldRow);
                        // console.log(JSON.stringify(oldArr));
                        var newArr = [];
                        for (var j = 0; j < oldArr.length; j++) {
                            var t = this._getPaiCache(SELF_ROW, toCol + "_" + oldArr[j], CARDS_TYPE_OWN);
                            newArr.push(t);
                        }
                        // console.log(newArr);
                        for (var j = 0; j < newArr.length; j++) {
                            this._setPaiCache(SELF_ROW, toCol + "_" + j, CARDS_TYPE_OWN, newArr[j]);
                        }
                        this._initPaisPos(SELF_ROW, undefined, undefined, 0.2);
                        return 'exist';
                    }
                    return false;
                } else {
                    for (var i = 2; i >= toRow; i--) {
                        //console.log(i + "   " + toRow);
                        var tPai = this._getPaiCache(SELF_ROW, toCol + '_' + i, CARDS_TYPE_OWN);
                        if (tPai) {
                            // console.log(" _setPaiCache  " + toCol + '_' + i);
                            this._setPaiCache(SELF_ROW, toCol + '_' + (i + 1), CARDS_TYPE_OWN, tPai);
                        }
                    }
                    this._setPaiCache(SELF_ROW, toCol + '_' + toRow, CARDS_TYPE_OWN, undefined);
                }

            } else {
                //取该列最上头元素
                for (var i = toRow; i >= 0; i--) {
                    var tPai = this._getPaiCache(SELF_ROW, toCol + '_' + i, CARDS_TYPE_OWN);
                    if (tPai) {
                        toRow = i + 1;
                        // console.log("确定位置" + toRow);
                        break;
                    }
                }
            }

            var newPai = this.setPai(SELF_ROW, toCol + '_' + toRow, id, true, CARDS_TYPE_OWN);
            newPai.setPosition(pai.getPosition());
            // this._initPaisPos();
            return 'new';
        },
        /**
         * 新牌进入自己牌堆
         *  找牌型匹配对应位置 找不到则直接放置左侧或者右侧 如果已经满了则直接找空位安放
         *  插入的时候有各种情况的特殊处理 会对牌堆进行大量操作 执行排序动画
         * @param row
         * @param id
         * @param initPos
         * @param cb
         * @returns {*}
         */
        addPaiToRC: function (row, ids, initPos, cb) {
            var row = row || SELF_ROW;
            console.log("addPaiToRC" + ids.length + JSON.stringify(initPos));
            for (var z = 0; z < ids.length; z++) {
                var id = ids[z];
                var cards = this.getAllPaiRCIDs(row);
                var pos = kaokaoRule.getAddCardToIdx(cards, id);
                var pai = null;
                // console.log(pos);
                //会出现超过宽度限制的牌 此时直接找空位放牌
                if (cards.length >= 10 && (pos.x < 0 || pos.x >= 10 || (cards[pos.x] && cards[pos.x].length == 4) || pos.newline)) {
                    var isOver = false;
                    for (var i = 0; i < cards.length; i++) {
                        if (isOver)
                            break;
                        if (cards[i].length == 4)
                            continue;
                        for (var j = 0; j < 4; j++) {
                            var tcard = cards[i][j];
                            if (!tcard) {
                                pos = {x: i, y: j}
                                isOver = true;
                                // console.log(pos);
                                break;
                            }
                        }
                    }
                    if (!isOver) {
                        cc.error("自己牌堆竟然满了 ！！ BUG");
                        return;
                    }
                }

                if (pos.newline) {
                    var cards = this.getAllPaiRC(row);
                    for (var i = cards.length - 1; i >= pos.x; i--) {
                        for (var j = 0; j < 4; j++) {
                            this._setPaiCache(row, (i + 1) + '_' + j, CARDS_TYPE_OWN, cards[i][j])
                        }
                    }
                    for (var j = 0; j < 4; j++) {
                        this._setPaiCache(row, pos.x + '_' + j, CARDS_TYPE_OWN, undefined)
                    }
                    // console.log(this.getAllPaiRCIDs());
                    pai = this.setPai(row, pos.x + '_' + 0, id, true, CARDS_TYPE_OWN);
                } else if (pos.x == -1) {//此情况需要插入最左边 数组右方移动
                    var cards = this.getAllPaiRC(row);
                    for (var i = cards.length - 1; i >= 0; i--) {
                        for (var j = 0; j < 4; j++) {
                            this._setPaiCache(row, (i + 1) + '_' + j, CARDS_TYPE_OWN, cards[i][j])
                        }
                    }
                    for (var j = 0; j < 4; j++) {
                        this._setPaiCache(row, 0 + '_' + j, CARDS_TYPE_OWN, undefined)
                    }
                    // console.log(this.getAllPaiRCIDs());
                    pai = this.setPai(row, 0 + '_' + 0, id, true, CARDS_TYPE_OWN);
                } else {
                    // TODO
                    var toCol = pos.x;
                    var toRow = pos.y;
                    //取该列最上头元素
                    for (var i = 3; i >= 0; i--) {
                        var tPai = this._getPaiCache(row, toCol + '_' + i, CARDS_TYPE_OWN);
                        if (tPai) {
                            break;
                        }
                    }
                    if (i < 3) {//列未满直接插入
                        for (var i = 2; i >= toRow; i--) {
                            console.log(i + "   " + toRow);
                            var tPai = this._getPaiCache(row, toCol + '_' + i, CARDS_TYPE_OWN);
                            if (tPai) {
                                console.log(" _setPaiCache  " + toCol + '_' + i);
                                this._setPaiCache(row, toCol + '_' + (i + 1), CARDS_TYPE_OWN, tPai);
                            }
                        }
                        this._setPaiCache(row, toCol + '_' + toRow, CARDS_TYPE_OWN, undefined);
                    } else if (toRow <= 4) {
                        //cc.error("该列满了---");
                        console.log("该列满了--- 乾坤大挪移");
                        //1 该列右侧右方移动
                        //1 筛选该列相同牌 2 不同的牌另外单独一列
                        var cards = this.getAllPaiRC(row);
                        for (var x = cards.length - 1; x > toCol; x--) {
                            for (var j = 0; j < 4; j++) {
                                this._setPaiCache(row, (x + 1) + '_' + j, CARDS_TYPE_OWN, cards[x][j])
                            }
                        }
                        for (var j = 0; j < 4; j++) {
                            this._setPaiCache(row, (toCol + 1) + '_' + j, CARDS_TYPE_OWN, undefined)
                        }
                        var j = 0;
                        var newPais = [];
                        for (var i = 0; i < 4; i++) {
                            console.log(i + "  --2-- " + toRow);
                            var tPai = this._getPaiCache(row, toCol + '_' + i, CARDS_TYPE_OWN);
                            if (tPai) {
                                if (tPai.getUserData().pai != id) {
                                    this._setPaiCache(row, (toCol + 1) + '_' + j, CARDS_TYPE_OWN, tPai);
                                    j++;
                                } else {
                                    newPais.push(tPai);
                                }
                            }
                            this._setPaiCache(row, (toCol) + '_' + i, CARDS_TYPE_OWN, undefined);
                        }
                        for (var i = 0; i < newPais.length; i++) {
                            this._setPaiCache(row, (toCol) + '_' + i, CARDS_TYPE_OWN, newPais[i]);
                        }
                        // this._setPaiCache(row, toCol + '_' + toRow, CARDS_TYPE_OWN, undefined);
                        pos.y = newPais.length;
                    } else {
                        cc.error("理论上不存在此结果---");
                    }
                    pai = this.setPai(row, pos.x + '_' + pos.y, id, true, CARDS_TYPE_OWN);
                }

                pai.setLocalZOrder(16 - pos.y);
                if (initPos && initPos[z])
                    pai.setPosition(initPos[z]);
            }

            this._initPaisPos(row, undefined, cb);
        },
        /**
         * 通过id从手牌中删除
         * @param row
         * @param id
         * @param count
         */
        //TODO 可以优化-=----
        removePaiFromRCByID: function (row, id, count) {
            var paiArr = this.getAllPaiRC(row);
            count = count || 1;
            if (count < 0) {
                cc.error('removePaiFromRCByID error count =' + count);
                return;
            }
            console.log(row + "  removePaiFromRCByID " + id + "  count=" + count);
            for (var i = 0; i < paiArr.length; i++) {
                for (var j = 0; j < paiArr[i].length; j++) {
                    var pai = paiArr[i][j];
                    var data = pai.getUserData();
                    // console.log("pai.pai=" + data.pai);
                    if (data.pai == id && count > 0) {
                        count--;
                        this.removePaiFromRC(row, pai, !!count);
                        if (count == 0)break;
                    }
                }
            }
            if (count != 0) {

                // network.stop();
                // console.log(this.getAllPaiRCIDs());
                if ((parseInt(id) > 1000) && row == 0 && !mRoom.isReplay) {//牌数量对不上 触发重连 听用财神除外
                    //(parseInt(id)>1000) &&
                    cc.error("找不到牌了——————————");
                    // 翻出来的听用是不会进入手牌 所以根本找不到
                    this.scheduleOnce(function () {
                        console.log("-------****************-----");
                    }, 2)
                    network.disconnect();
                    return;
                }

            }
        },
        /**
         * 从手牌中删除该牌
         * @param row
         * @param pai
         * @param notOver
         * @param animRate
         * @returns {*}
         */
        removePaiFromRC: function (row, pai, notOver, animRate) {
            var row = row || SELF_ROW;
            var idx = pai.getUserData().idx;
            var i = parseInt(idx.split('_')[0]);
            var j = parseInt(idx.split('_')[1]);
            this._setPaiCache(row, idx, CARDS_TYPE_OWN, undefined);
            pai.removeFromParent(false);

            console.log(row + "  删除 " + i + "  " + j + "  删除牌:" + pai.getUserData().pai);
            //如果不是该列最上一个上头的下滑
            var upNode = this._getPaiCache(row, i + "_" + (j + 1), CARDS_TYPE_OWN);
            if (upNode) {
                console.log("列下滑 " + i);
                for (var u = j + 1; u < 5; u++) {
                    var t = this._getPaiCache(row, i + "_" + u, CARDS_TYPE_OWN);
                    this._setPaiCache(row, i + "_" + (u - 1), CARDS_TYPE_OWN, t);
                }
            } else if (j == 0 && !this._getPaiCache(row, i + "_" + 0, CARDS_TYPE_OWN)) {//否则该列空了 向左移动
                console.log("列空了- zuo yi");
                for (var x = i + 1; x <= 10; x++) {
                    for (var j = 0; j < 4; j++) {
                        var otherNode = this._getPaiCache(row, x + "_" + j, CARDS_TYPE_OWN);
                        this._setPaiCache(row, (x - 1) + '_' + j, CARDS_TYPE_OWN, otherNode)
                    }
                }
                g_selfcards_cols--;
            }
            if (!notOver) {
                this._initPaisPos(row, undefined, undefined, animRate);
            }
            return pai;
        },
        /**
         * 作废函数 获取牌位置
         * @param pai
         * @param y
         * @returns {*}
         */
        getPaiPos: function (pai, y) {
            var offx = cc.winSize.width / 2 - this.getAllPaiRC().length * CARD_WIDTH / 2;
            var offy = -75;

            if (pai && !_.isNumber(pai)) {
                var data = pai.getUserData();
                var x = parseInt(data.idx.split('_')[0]);
                var y = parseInt(data.idx.split('_')[1]);
                return cc.p(offx + x * CARD_WIDTH, offy + y * CARD_SPACE)
            } else if (_.isNumber(pai) && _.isNumber(y)) {
                return cc.p(offx + pai * CARD_WIDTH, offy + y * CARD_SPACE)
            }
            return null;
        },
        /**
         * 进行牌移位动画
         * @param row 玩家
         * @param paiArr 手牌
         * @param cb 回调
         * @param animRate 动画倍率
         * @private
         */
        _initPaisPos: function (row, paiArr, cb, animRate) {
            //计算居中显示
            var paiArr = paiArr || this.getAllPaiRC(row);
            // console.log("initPaisPos");
            // console.log(this.getAllPaiRCIDs());

            if (row == 0) {//存储自己手牌 断线上来直接显示
                var pais = this.getAllPaiRCIDs()
                cc.sys.localStorage.setItem('kkcards', JSON.stringify(pais));
            }

            g_selfcards_cols = paiArr.length;
            animRate = animRate == undefined ? 1 : animRate;

            var width = row == 0 ? 1280 : 0;
            var offx = width / 2 - paiArr.length * CARD_WIDTH / 2 + CARD_WIDTH;
            var offy = -75;

            for (var i = 0; i < paiArr.length; i++) {
                for (var j = 0; j < paiArr[i].length; j++) {
                    var pai = paiArr[i][j];
                    var pos = cc.p(offx + i * CARD_WIDTH, offy + j * CARD_SPACE);
                    var posCur = pai.getPosition();
                    if ((Math.abs(pos.x - posCur.x) > 20 || Math.abs(pos.y - posCur.y) > 20) && animRate != 0) {
                        pai.runAction(cc.moveTo(0.35 * g_anim_play_rate * animRate, pos).easing(cc.easeOut(1.4)))
                    } else {
                        pai.setPosition(pos);
                    }
                    pai.setLocalZOrder(16 - j);
                }
            }
            if (cb) {
                // console.log("_initPaisPos cb-->");
                // this.runAction(cc.sequence(cc.delayTime(0.4 * g_anim_play_rate * animRate), cc.callFunc(cb)));
                this.scheduleOnce(function () {
                    cb();
                }, 0.35 * g_anim_play_rate * animRate)
            }


        },
        /**
         * 获得row手牌精灵二维数组
         * @param row
         * @returns {Array}
         */
        getAllPaiRC: function (row) {
            var row = row || SELF_ROW;
            var ret = [];
            var idx = -1;
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 4; j++) {
                    var t = this._getPaiCache(row, i + "_" + j, CARDS_TYPE_OWN);
                    if (t) {
                        if (j == 0) idx++;
                        ret[idx] = ret[idx] || [];
                        ret[idx].push(t);
                    } else if (i == 0) {
                        if (j == 0) idx++;
                        ret[idx] = ret[idx] || [];
                    }
                }
            }
            return ret;
        },
        /**
         * 根据不同玩家获得自己手牌的二维数组 其他玩家主要用于回放的时候 正常打牌时候 为全0数组
         * @param row
         * @returns {Array}
         */
        getAllPaiRCIDs: function (row) {
            var row = row || SELF_ROW;
            var ret = [];
            var idx = -1;
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 4; j++) {
                    var t = this._getPaiCache(row, i + "_" + j, CARDS_TYPE_OWN);
                    if (t) {
                        if (j == 0) idx++;
                        ret[idx] = ret[idx] || [];
                        var id = t.getUserData().pai;
                        ret[idx].push(id);
                    } else if (i == 0) {
                        if (j == 0) idx++;
                        ret[idx] = ret[idx] || [];
                    }
                }
            }
            return ret;
        },
        _getPaiCache: function (row, id, type) {
            if (!g_cache[type + row]) {
                cc.error("错误 未传入牌所属于类型 nCards open out 或者row错误  找不到" + type + row);
                return null;
            }
            g_cache[type + row] = g_cache[type + row] || {};
            if (g_cache[type + row][id])
                return g_cache[type + row][id];

            // console.log("id=" + id + " type=" + type + "row = " + row);

            return null;
        },
        _setPaiCache: function (row, id, type, node) {
            // console.log("id=" + id + " type=" + type + "row = " + row);
            g_cache[type + row][id] = node;

            if (node) {
                var userData = node.getUserData();
                if (!userData)
                    userData = {};
                userData.idx = id;
                node.setName("card" + id)
                node.setUserData(userData);
            }
        },
        /*
         *  nCards open out类型来存储牌精灵
         *
         * */
        getPai: function (row, id, type, lazy) {
            var that = this;
            var cache = this._getPaiCache(row, id, type);
            if (cache)
                return cache;
            else if (lazy) {
                return null;
            }
            var node = $("node." + type + row + ".card" + id, that.playersInfo);
            if (!node) {
                node = new cc.Sprite();
                // node.setName("card" + id);
                $("node." + type + row, that.playersInfo).addChild(node);
            }

            // g_cache[type+row][id] = node;
            this._setPaiCache(row, id, type, node);
            return node;
        },
        getRowByUid: function (uid) {
            return g_uid_to_pos[uid];
        },
        getOriginalPos: function () {
            return 1;
        },
        getEffectEmojiPos: function (caster, patient, isNotMid) {
            var self = this;
            var pos = {};
            var infoCasterHead = $('playersInfo.node.info' + caster + '.head');
            var infoPatientHead = $('playersInfo.node.info' + patient + '.head');
            pos[caster] = infoCasterHead ? infoCasterHead.getParent().convertToWorldSpace(infoCasterHead.getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            pos[patient] = (patient != self.getOriginalPos() && infoPatientHead) || isNotMid ? infoPatientHead.getParent().convertToWorldSpace(infoPatientHead.getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            return pos;
        },

    });
    exports.KaoKaoLayer = KaoKaoLayer;
    exports.KaoKaoLayer.createCardSprite = createCardSprite;
    exports.KaoKaoLayer.createGroupCards = createGroupCards;
})(window);