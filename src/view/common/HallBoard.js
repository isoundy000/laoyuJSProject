/**
 * 通用大厅界面
 */
var HallBoard = {
    init: function () {

        // gameData.opt_conf.liuyi = 1;

        mRoom.isReplay = false;
        mRoom.wanfatype = "";

        this.isHotUpdate();
        this.initUI();
        this.initTouch();
        this.initShopAni();
        this.onMaDeng();
        this.initInReview();
        this.initNetListener();
        this.alertError();
        this.requestNotice();
        this.scheduleUpdate();
        this.initTishi();//提示

        playMusic('vbg5');


        cc.spriteFrameCache.addSpriteFrames(res.card_common_plist);

        if (typeof regBakBtn !== 'undefined')
            regBakBtn.call(this);

        //预创建粒子资源
        new cc.ParticleSystem(res.flyIcon_plist);


        //俱乐部进去的要回大厅  继续打开俱乐部
        if (gameData.enterRoomWithClubID) {
            this.addChild(new ClubMainLayer(gameData.enterRoomWithClubID));
        }

        return true;
    },

    exit: function () {

    },
    /**
     * ui初始化
     */
    initUI: function () {
        this.nBTN = getUI(this, "nBTN");
        this.nMain = getUI(this, "nMain");
        this.txtCount = getUI(this, "txtCount");
        this.messagenum = getUI(this, "messagenum");
        this.message_numbg = getUI(this, "message_numbg");
        this.message_numbg.setVisible(false);
        this.messagenum.setString("");
        this.btn_verify = getUI(this, "btn_verify");
        this.btn_msg = getUI(this.nBTN, "btn_msg");
        this.btn_wf = getUI(this.nBTN, "btn_wf");
        this.btn_zj = getUI(this.nBTN, "btn_zj");
        this.btn_sz = getUI(this.nBTN, "btn_sz");
        this.btn_dc = getUI(this.nBTN, "btn_dc");
        this.btn_iap = getUI(this.nBTN, "btn_iap");
        this.btn_add = getUI(this, "add_3");
        this.btn_share = getUI(this.nBTN, "btn_share");
        this.btn_binding = getUI(this, "binding");
        this.lottery = getUI(this, "lottery");
        this.btn_joinroom = getUI(this.nMain, 'btn_joinroom');
        this.btn_yikai = getUI(this.nMain, 'btn_yikai');
        this.btn_daikai = getUI(this.nMain, 'btn_daikai');
        this.btn_club = getUI(this, 'btn_club');
        this.txtName = getUI(this, "txtName");
        this.txtID = getUI(this, "txtID");
        this.headbg = getUI(this, "head_1");
        this.head = getUI(this, "head");
        this.debug_reateroom = getUI(this, 'debugcreateroom');
        this.btn_notice = getUI(this, "btn_notice");
        this.logo = getUI(this, 'hall_title_41');

        this.initLunBo();
        this.initNewYear();
        this.initGames();
        this.initUserInfo();

        // 实名验证
        this.setYanzheng(gameData.hasShiMing == null || gameData.hasShiMing == undefined || gameData.hasShiMing == false);

        // todo 代开隐藏
        this.btn_yikai.setVisible(false);
        this.btn_daikai.setVisible(false);
    },

    /**
     * 初始化点击事件
     */
    initTouch: function () {
        TouchUtils.setOnclickListener(this.btn_verify, this.onVerify.bind(this));
        TouchUtils.setOnclickListener(this.lottery, this.showLotterlayer.bind(this));
        TouchUtils.setOnclickListener(this.btn_iap, this.clickShop.bind(this));
        TouchUtils.setOnclickListener(this.btn_add, this.clickShop.bind(this));
        TouchUtils.setOnclickListener(this.btn_yq, this.clickBinding.bind(this));
        TouchUtils.setOnclickListener(this.btn_hd, this.clickHuodong.bind(this));
        TouchUtils.setOnclickListener(this.btn_binding, this.clickBinding.bind(this));
        TouchUtils.setOnclickListener(this.btn_msg, this.clickActivityMsg.bind(this));
        TouchUtils.setOnclickListener(this.btn_wf, this.clickWanfa.bind(this));
        TouchUtils.setOnclickListener(this.btn_zj, this.clickZhanJi.bind(this));
        TouchUtils.setOnclickListener(this.btn_sz, this.clickSheZhi.bind(this));
        TouchUtils.setOnclickListener(this.btn_dc, this.clickExit.bind(this));
        TouchUtils.setOnclickListener(this.btn_share, this.clickShare.bind(this));
        TouchUtils.setOnclickListener(this.btn_joinroom, this.clickJoinRoom.bind(this));
        TouchUtils.setOnclickListener(this.btn_yikai, this.clickYiKai.bind(this));
        TouchUtils.setOnclickListener(this.btn_daikai, this.clickDaiKai.bind(this));
        TouchUtils.setOnclickListener(this.btn_club, this.clickClub.bind(this));
        TouchUtils.setOnclickListener(this.headbg, this.clickHead.bind(this));
        TouchUtils.setOnclickListener(this.debug_reateroom, this.onDebugCreateRoom.bind(this));
        TouchUtils.setOnclickListener(this.btn_notice, this.showNoPluginLayer.bind(this));
        TouchUtils.setOnclickListener(this.logo, this.logoFunc.bind(this));
    },

    /**
     * 初始化网络监听
     */
    initNetListener: function () {

        network.addCustomListener(P.GS_StatusChange, this.onStatusChange.bind(this));
        network.addCustomListener(P.GS_Login, this.onRoleLoginOK.bind(this));
        network.addCustomListener(P.GS_UserJoin, this.onUserJoin.bind(this));
        network.addCustomListener(P.GS_UserJoin_NiuNiu, this.onJoinNiuNiu.bind(this));

        network.addListener(3001, this.onCreateRoom.bind(this));
        network.addListener(3006, this.onReContent.bind(this));
        network.addListener(3002, this.onJoinRoom.bind(this));
        network.addListener(3005, function (data, errorCode) {
        });
        network.addListener(3200, this.onMaDeng.bind(this));
        network.addListener(3013, this.onReqFangKa.bind(this));
        // todo
        network.addListener(2006, function (data) {
            var sub = data.key;
            var version = data.ver;
            var source = data.source;
            var roomid = data.room_id;
            var url = data.url;
            showLoading('有新的' + sub + '版本:' + version + ',请更新中');
            if(sub == 'home'){
                var scene = new UpdateScene();
                scene.run();
                return;
            }
            SubUpdateUtils.checkUpdate(url, sub, version, function () {
                if (source === 'create') {
                    var tipLayer = HUD.getTipLayer();
                    var createRoomLayer = null;
                    if (!tipLayer) {
                        createRoomLayer = cc.director.getRunningScene().get('createRoomLayer');
                    } else {
                        createRoomLayer = tipLayer.getParent().getChildByName('createRoomLayer');
                    }
                    if (createRoomLayer && cc.sys.isObjectValid(createRoomLayer)) {
                        createRoomLayer.clickCreate();
                    }
                    if (data['club_id']) {
                        if (gameData.last3001Data) {
                            var timestamp = gameData.last3001Data['timestamp'];
                            if (getCurrentTimeMills() - timestamp <= 30000) {
                                network.send(3001, gameData.last3001Data);
                            }
                        }
                    }
                } else if (source === 'join') {
                    network.send(3002, {
                        room_id: '' + roomid
                    });
                } else {
                    hideLoading();
                    alert1('有新的' + sub + '版本:' + version + ',请更新后进入');
                }
            });
        });
        // 请求房卡
        setTimeout(function () {
            network.send(3013, {});
        }, 500);
    },

    /**
     * 提审隐藏东西
     */
    initInReview: function () {
        if (!window.inReview) {
            return;
        }
        this.btn_msg.setVisible(false);
        this.btn_wf.setVisible(false);
        this.btn_zj.setVisible(false);
        this.btn_share.setVisible(false);
        this.btn_binding.setVisible(false);
        this.lottery.setVisible(false);
        this.txtID.setString("LV:1");
    },

    /**
     * 弹出错误消息
     */
    alertError: function () {
        if (gameData.errMessage) {
            HUD.showMessageBox("提示", gameData.errMessage, function () {
            }, true);
            gameData.errMessage = null;
        }
    },

    /**
     * 请求公告
     */
    requestNotice: function () {
        var request = {};
        request.test = "";
        DC.httpData("/qmdp", request, this.onMessageList.bind(this), true, "http://notice.yygameapi.com:34567");
    },

    /**
     * 初始化游戏按钮
     */
    initGames: function () {
        var games = ['niuniu', 'pdk', 'majiang', 'psz', 'kaokao'];
        // this.addChild(new RotatingMenu(this, games));
        //
        // var scrollview = getUI(this.nMain, 'scroll');
        // scrollview.setVisible(false);

        var that = this;
        var btnList = [];
        var clicktime = 0;
        for (var i = 0; i < games.length; i++) {
            (function (name) {
                // btnList[i] = new cc.Sprite('res/image/ui/hall/roomcreate_' + games[i] + ".png");
                // btnList[i].setPosition(cc.p(220 * (i + 1 / 2), 200));
                // that.addChild(btnList[i]);
                var scroll = getUI(that.nMain, 'scroll');
                var btn = getUI(scroll, 'btn_createroom_' + name);
                // console.log(btn);
                TouchUtils.setOnclickListener(btn, function (sender) {
                    var time = new Date().getTime();
                    if (time - clicktime <= 1000) {
                        return;
                    }
                    clicktime = time;
                    if (that) {//} && sender.getPositionY() < (cy + 60)){
                        that.createRoomLayer(name, false);
                    }
                }, {swallowTouches: true});

                // var title = new cc.Sprite('res/image/ui/hall/title_roomcreate_' + games[i] + '.png');
                // title.setPosition(cc.p(btnList[i].getContentSize().width / 2, 50));
                // btnList[i].addChild(title);
            })(games[i]);
        }
    },

    /**
     * 初始化轮播
     */
    initLunBo: function () {
        var wmxybg = new LunBoLayer();
        wmxybg.setScale(0.9);
        wmxybg.setPosition(cc.p(50, 70));
        this.addChild(wmxybg);
        wmxybg.setVisible(!window.inReview);
    },

    /**
     * 初始化新年
     */
    initNewYear: function () {
        this.lottery.setVisible(gameData.opt_conf.liuyi > 0);
        playFrameAnim2(res.zhuanzhuanle_plist, "zhuanzhuan", 1, 30, 0.1, true, this.lottery, function () {

        });
        if (gameData.lotteryNum == 1 && gameData.opt_conf.liuyi > 0) {
            this.showLotterlayer();
            gameData.lotteryNum = 0;
        }
    },
    /**
     * 提示
     */
    initTishi: function () {
        var that = this;
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var fanwaigua = cc.sys.localStorage.getItem('fanwaigua') || "0-0";
        if (window.inReview == false && (fanwaigua != (month + "-" + day))) {
            cc.sys.localStorage.setItem('fanwaigua', month + "-" + day);
            that.showNoPluginLayer();
        }

        var tanchuangConfig = ['mianzhu', 'pszliuju'];
        for (var i = 0; i < tanchuangConfig.length; i++) {
            (function (i) {
                var key = cc.sys.localStorage.getItem(tanchuangConfig[i]) || "0-0";
                if (window.inReview == false && gameData.opt_conf[tanchuangConfig[i]] && key != (month + "-" + day)) {
                    cc.sys.localStorage.setItem(tanchuangConfig[i], month + "-" + day);

                    var pop = new ccui.Layout();
                    pop.setColor(cc.color(0, 0, 0));
                    pop.setOpacity(200);
                    pop.setContentSize(cc.size(1280, 720));
                    that.addChild(pop, 1000);
                    var bg = new cc.Sprite('res/image/ui/hall/pop_' + tanchuangConfig[i] + '.jpg');
                    bg.setPosition(cc.p(640, 360));
                    pop.addChild(bg);
                    var close = new cc.Sprite('res/appCommon/fydp/common/room_close.png');
                    close.setPosition(cc.p(bg.getContentSize().width, bg.getContentSize().height));
                    bg.addChild(close);
                    TouchUtils.setOnclickListener(close, function () {
                        pop.removeFromParent(true);
                    });
                    TouchUtils.setOnclickListener(pop, function () {
                    }, {effect: TouchUtils.effects.NONE});
                }
            })(i)
        }
    },

    /**
     * 商城动画
     */
    initShopAni: function () {
        var shoprow1 = getUI(this, 'shoprow1');
        var shoprow2 = getUI(this, 'shoprow2');
        var shoprow3 = getUI(this, 'shoprow3');
        shoprow1.setOpacity(0);
        shoprow2.setOpacity(0);
        shoprow3.setOpacity(0);
        shoprow1.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0), cc.fadeIn(0.2), cc.delayTime(0.4), cc.fadeOut(0.2), cc.delayTime(0.6))));
        shoprow2.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.2), cc.delayTime(0.4), cc.fadeOut(0.2), cc.delayTime(0.4))));
        shoprow3.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.4), cc.fadeIn(0.2), cc.delayTime(0.4), cc.fadeOut(0.2), cc.delayTime(0.2))));
    },

    /**
     * 测试创建房间
     */
    onDebugCreateRoom: function () {
        var roomid = cc.sys.localStorage.getItem("lastroomid");
        if (roomid) {
            network.send(3002, {room_id: parseInt(roomid)})
            return;
        }
        network.send(3001, {
            "room_id": 0,
            "map_id": 340,
            "mapid": 340,
            "daikai": false,
            "options": {
                "mapid": 340,
                "name": "四川考考",
                "AA": false,
                "room_gz": "房主支付",
                "jushu": 8,
                "cpCount": 3,
                "cpSsz": 0,
                "cpWuhei": 0,
                "cpDang": 2,
                "cpPiao": 0,
                "desp": "四川考考,房主支付,局数: 8局,3人玩,胡到底,五红五黑,推当,不飘",
                "special_gz": ["四川考考", "房主支付", "局数: 8局", "3人玩", "胡到底", "五红五黑", "推当", "不飘"],
                "wanfa": "kaokao"
            }
        });
    },

    /*
    logo
     */
    logoFunc: function(){
        this.clickLogo = this.clickLogo || 0;
        this.clickLogo ++;
        if(this.clickLogo >= 10){
            this.clickLogo = 0;
            SubUpdateUtils.clearAllSubmodules();
        }
    },


    // /**
    //  * 微信商城
    //  */
    // openShop: function () {
    //     var that = this;

    //     var sendData = {area: gameData.parent_area, playerid: gameData.uid, unionid: gameData.unionid};
    //     //购卡方式   修改
    //     var id = gameData.uid % 10;
    //     var buycardtype = -1;
    //     if (gameData.opt_conf && gameData.opt_conf['buycardtype'] >= 0) {
    //         buycardtype = gameData.opt_conf['buycardtype'];
    //     }
    //     // buycardtype = -1;//-1 不开
    //     if (id <= buycardtype) {
    //         var signKey = Crypto.MD5("feiyu-pay" + gameData.uid + gameData.parent_area);
    //         cc.sys.openURL("http://pay2.lvhejincheng.com:8899/payServer/wxpay/unify_pay/index.html?area=" + gameData.parent_area + "&buyerId=" + gameData.uid + "&source=2&ciType=1&signKey=" + signKey);
    //     }
    // },

    /**
     * 轮询
     * @param dt 轮询时间
     */
    update: function (dt) {
        if (!this._time)
            this._time = 0;
        this._time += dt * 1000;
        if (this._time >= 250) {
            var autoJoinRoomId = _.trim(MWUtil.getRoomId() || "");
            // autoJoinRoomId = 'clubid_205';
            // console.log("autoJoinRoomId==="+autoJoinRoomId);
            if (autoJoinRoomId) {
                if (autoJoinRoomId.startsWith('0')) {
                    var clubId = parseInt(autoJoinRoomId);
                    if (clubId) {
                        var myClubLayer = window.maLayer.getChildByName('ClubLayer');
                        if (myClubLayer)
                            myClubLayer.removeFromParent();
                        myClubLayer = new ClubMainLayer();
                        myClubLayer.setName('ClubLayer');
                        window.maLayer.addChild(myClubLayer);
                        myClubLayer.addChild(new ClubInputLayer('join', clubId));
                        MWUtil.clearRoomId();
                    }
                    return;
                } else if (autoJoinRoomId.length == 6 && network.isAlive()) {
                    showLoading("正在自动加入房间: " + autoJoinRoomId);
                    gameData.enterRoomWithClubID = 0;
                    network.send(3002, {room_id: autoJoinRoomId});
                    MWUtil.clearRoomId();
                }
            }
            this._time -= 250;
        }
    },

    /**
     * 是否要强更
     */
    isHotUpdate: function () {
        if (!cc.sys.isNative)
            return;

        var native_version = getNativeVersion();
        // if(native_version == '2.3.0'){
        //     var layer = HUD.showLayer(HUD_LIST.MessageBox, this, null, true);
        //     layer.setName("MessageBox");
        //     layer.setData("提示", '发现新版本,是否前往更新？', function(){
        //         cc.sys.openURL('https://pay.bangshuiwang.com/fydp/');
        //     }, true, true);
        //     layer.setLocalZOrder(100);
        //     return;
        // }
        var filename = "native_version";
        var dates = cc.sys.localStorage.getItem('updatetime') || "0-0";
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        if (dates != (month + "-" + day)) {
            NetUtils.httpGet('http://penghuzi.yayayouxi.com/penghuzi/' + filename, function (response) {
                if (native_version != response) {
                    cc.sys.localStorage.setItem('updatetime', month + "-" + day);
                    alert2('发现新版本,是否前往更新？', function () {
                        cc.sys.openURL('https://pay.bangshuiwang.com/fydp/');
                    }, false, false, false, true, true);
                }
            }, function () {
            })
        }
    },

    /**
     * 获得消息
     * @param data
     */
    onMessageList: function (data) {
        if (data && data.result && parseInt(data.result) == 0) {
            this.noticeData = data.data;
            var notReadNum = 0;
            for (var i = 0; i < data.data.length; i++) {
                var hasread = cc.sys.localStorage.getItem("notice" + data.data[i]["TimeInMillionSecond"]);
                if (hasread == undefined || hasread == null || hasread == "") {
                    notReadNum++;
                }
            }
            this.setMessageNum(notReadNum);
        }

        if (window.inReview == false && gameData.lotteryNum == 1 && gameData.opt_conf['chongfan'] == 1) {
            var notice = new ActivityMsgLayer(this.noticeData || []);
            this.addChild(notice, 1000);
            gameData.lotteryNum = 0;
        }
        var lastShowDay = cc.sys.localStorage.getItem("lastShowDay") || null;
        if (new Date().getDate() != lastShowDay) {
            cc.sys.localStorage.setItem("lastShowDay", new Date().getDate());
        }
    },

    /**
     * 设置消息数
     * @param num
     */
    setMessageNum: function (num) {
        if (num && num > 0) {
            this.message_numbg.setVisible(true);
            this.messagenum.setString(1);
        } else {
            this.message_numbg.setVisible(false);
            this.messagenum.setString("");
        }
        if (window.inReview) {
            var btn7 = getUI(this.nBTN, "btn_msg");
            btn7.setVisible(false);
        }
    },

    /**
     * 用户信息
     */
    initUserInfo: function () {
        var name = ellipsisStr(gameData.nickname, 6);
        this.txtName.setString(name);
        this.txtID.setString(" ID:" + gameData.uid);
        var headurl = (gameData.headimgurl == undefined || gameData.headimgurl == null || gameData.headimgurl == '') ? res.defaultHead : gameData.headimgurl;
        loadImageToSprite(headurl, this.head);
        if (gameData.numOfCards && gameData.numOfCards[1] >= 0) {
            //gameData.cardnum = data.numof_cards_2;//房卡数量
            gameData.cardnum = gameData.numOfCards[1];
            this.txtCount.setString(gameData.cardnum || "0");
        }
    },

    /**
     * 加入房间
     * @param event
     */
    onUserJoin: function (event) {
        var data = event.getUserData();
        // console.log(data);
        var Result = null;
        if (data.Head) {
            Result = data.Head.Result;
        }
        if (data.Result) {
            Result = data.Result;
        }
        if (Result != null && Result != 0) {
            var ErrorMsg = (data.Head) ? data.Head.ErrorMsg : data.ErrorMsg;
            HUD.showMessage(ErrorMsg);
            this.scheduleOnce(function () {
                DC.closeByClient = true;
                //DC.socket.close();
            }, 1);
        } else if (Result != null && Result == -1) {
            var msg = (data.Head) ? data.Head.ErrorMsg : data.ErrorMsg;
            HUD.showMessageBox('提示', msg, function () {
                HUD.showScene(HUD_LIST.Login, null);
            }, true);
        } else {
            //加入房间要收到确切的加入房间消息才能加入,断线重连直接进入房间
            mRoom.roomId = data.RoomID;
            gameData.roomId = mRoom.roomId;
            var option = data.Option;
            var obj = decodeHttpData(option);
            mRoom.rounds = obj.rounds;
            gameData.mapId = obj.mapid;
            mRoom.getWanfa(obj);
            mRoom.ownner = data.Owner;

            if (mRoom.wanfatype == "dn") {
                gameData.players = data['Users'];
            } else {
                DD[T.PlayerList] = data['Users'];
            }
            network.stop();
            // if (mRoom.wanfatype == mRoom.YOUXIAN) {
            //     HUD.showScene(HUD_LIST.Room, this);
            // }

            SubUpdateUtils.showGameScene(data);
            cc.sys.localStorage.setItem("lastroomid", gameData.roomId)
        }
    },

    /**
     * 验证登录
     * @param event
     */
    onRoleLoginOK: function (event) {
        if (this.checkNoRunning()) return;
        var data = event.getUserData();
        var Result = 0;
        if (data.Head) {
            Result = data.Head.Result;
        } else {
            Result = data.Result;
        }
        if (Result == 0) {
            mRoom.setRoomType(2);
            if (mRoom.roomType == 1) {
            } else if (mRoom.roomType == 2) {
                //加入房间要收到确切的加入房间消息才能加入,断线重连直接进入房间
                var cmd = "JoinRoom/" + mRoom.roomId;//Continue
                network.wsData(cmd, true);
                network.stop();
                if (mRoom.wanfatype == mRoom.YOUXIAN) {
                    HUD.showScene(HUD_LIST.Room, this);
                }
            }
        } else if (Result == ERR_CODE.VERSION_ERR) {
            if (cc.sys.isNative) {
                HUD.showMessageBox('提示', '系统检测到有新的游戏版本，为避免影响您的游戏体验，请尽快大退游戏进行更新。', function () {
                    if (cc.sys.os == cc.sys.OS_ANDROID) {
                        cc.director.end();
                    }
                }, true);
            }
        } else {
            HUD.showMessage("登录失败");
        }
    },

    /**
     * 请求房卡
     * @param data
     */
    onReqFangKa: function (data) {
        gameData.numOfCards = data['numof_cards'];
        if (gameData.numOfCards[1] >= 0) {
            gameData.cardnum = gameData.numOfCards[1];
            if (this.txtCount) this.txtCount.setString(gameData.cardnum || "0");
        }
    },

    /**
     * 跑马灯
     */
    onMaDeng: function (data) {
        var that = this;
        if (data && data.content) {
            gameData.Content = data.content;
        }
        if (!gameData.Content) {
            return;
        }
        var interval = null;
        var func = function () {
            if (!that || !cc.sys.isObjectValid(that)) {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
                return;
            }
            var content = (window.inReview) ? "文明游戏,欢乐人生" : gameData.Content;
            var speaker = getUI(that, 'speaker');
            speaker.setVisible(true);
            speaker.setLocalZOrder(100);
            var speakerPanel = getUI(that, 'speakepanel');
            speaker.runAction(cc.fadeIn(0.2));
            var text = new ccui.Text();
            text.setFontSize(26);
            text.setColor(cc.color(255, 255, 255));
            text.setAnchorPoint(cc.p(0, 0));
            text.enableOutline(cc.color(0, 0, 0), 1);
            speakerPanel.removeAllChildren();
            speakerPanel.addChild(text);
            text.setString(content);
            text.setPositionX(speakerPanel.getContentSize().width);
            text.setPositionY(5);
            text.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.moveTo((content.length * 0.3 <= 10) ? 10 : content.length * 0.3, -text.getVirtualRendererSize().width, 5),
                cc.delayTime(0.3),
                cc.callFunc(function () {
                    speaker.runAction(cc.fadeOut(0.2))
                })
            ));
        };
        if (gameData.Content != null && gameData.Content != undefined && gameData.Content != "") {
            func();
            var t = (gameData.Content.length * 0.3 <= 30) ? 30 : (gameData.Content.length * 0.3 + 5);
            interval = setInterval(func, t * 1000);
        }
    },

    /**
     * 重连
     * @param data
     */
    onReContent: function (data) {
        mRoom.wanfatype = "";
        gameData.roomId = data['room_id'];
        gameData.mapId = data['map_id'];
        gameData.playerNum = data['players'].length;
        gameData.daikaiPlayer = data['daikai_player'];
        gameData.wanfaDesp = data['desp'];
        network.stop();
        this.intoRoom(data);
    },

    /**
     * 状态改变
     * @param event
     */
    onStatusChange: function (event) {
        if (this.checkNoRunning()) return;
        var data = event.getUserData();
        HUD.showMessage(data.Status);
    },

    /**
     * 设置房卡
     * @param numof_cards
     */
    setFangkaNum: function (numof_cards) {
        gameData.cardnum = numof_cards;
        this.txtCount.setString(gameData.cardnum || "0");
    },

};

// var startKaokaoReplay = function () {
//     gameData.roomId = data[0].data.RoomID;
//     // var option = data.Option;
//     // var obj = decodeHttpData(option);
//     gameData.mapId = 340;
//     mRoom.isReplay = true;
//     SubUpdateUtils.showGameScene(data[0].data);
// }