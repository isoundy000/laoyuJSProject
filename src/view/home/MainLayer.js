/**
 * 大厅界面
 */
(function () {
    var exports = this;
    var $ = null;
    var MainLayer = cc.Layer.extend({
        ctor: function (clubid, frommatch) {
            this._super();

            var that = this;
            var mainscene = loadNodeCCS("res/ccs/home/Home.json", this, 'Layer');

            $ = create$(this.getChildByName("Layer"));

            gameData.enterRoomWithMatchID = frommatch;

            return true;
        },
        onEnter: function(clubid, frommatch){
            this._super();

            if (gameData.enterRoomWithMatchID) {
                gameData.enterRoomWithMatchID = false;
                this.showMatchMainLayer();
            }

            //俱乐部进去的要回大厅  继续打开俱乐部
            if (gameData.enterRoomWithClubID) {
                SubUpdateUtils.showCreateMatch('club');
            }
        },
        /**
         * 是否要强更
         */
        _isHotUpdate: function () {
            if (!cc.sys.isNative)
                return;
            // window.nativeVersion = '2.4.0';
            // gameData.opt_conf.forceVer = '2.6.0';
            // gameData.opt_conf.minVer = '2.6.0';
            var that = this;
            var native_version = window.nativeVersion;
            if(native_version < gameData.opt_conf.forceVer){
                that.forceUpdate = function(){
                    alert1('发现新版本,是否前往更新？', function(){
                        cc.sys.openURL(DOWN_QMDPURL);
                        that.forceUpdate();
                    });
                };
                alert1('发现新版本,是否前往更新？', function(){
                    cc.sys.openURL(DOWN_QMDPURL);
                    that.forceUpdate();
                });
                return;
            }
            if (!gameData.alertUpdate) {
                if(native_version < gameData.opt_conf.minVer){
                    gameData.alertUpdate = true;
                    var that = this;
                    var scene = loadNodeCCS(res.GuideDownLayer_json, this);

                    var btn_close = getUI(scene.node, 'close');
                    var hand = getUI(scene.node, 'hand');
                    var btn_down = getUI(scene.node, 'btn_down');
                    hand.runAction(cc.repeatForever(cc.sequence(
                        cc.moveBy(1, cc.p(-50, 0)),
                        cc.moveBy(1, cc.p(50, 0))
                    )))
                    TouchUtils.setOnclickListener(btn_close, function () {
                        scene.node.removeFromParent(true);
                    }, {effect: TouchUtils.effects.NONE});
                    TouchUtils.setOnclickListener(btn_down, function () {
                        cc.sys.openURL(DOWN_QMDPURL);
                    }, {effect: TouchUtils.effects.NONE});
                }
            }
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            console.log('home exit');

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
        },
        onCCSLoadFinish: function () {

            // gameData.opt_conf.liuyi = 1;

            mRoom.isReplay = false;
            mRoom.wanfatype = '';

            this.isHotUpdate();
            this.initUI();
            this.initTouch();
            // this.showNoticeMatchLayer();
            this.initShopAni();
            this.onMaDeng();
            this.initInReview();
            this.initNetListener();
            this.alertError();
            this.requestNotice();
            this.scheduleUpdate();
            this.initTishi();//提示
            this._isHotUpdate();

            playMusic('vbg5');

            if (typeof regBakBtn !== 'undefined')
                regBakBtn.call(this);

            //预创建粒子资源
            new cc.ParticleSystem(res.flyIcon_plist);

            var sgameBridge = SgameBridge.getInstance();

            if (sgameBridge) {
                sgameBridge.nickname = gameData.nickname;
                sgameBridge.coinnum = gameData.coinnum;
                sgameBridge.diamondnum = gameData.diamondnum;
                sgameBridge.headimgurl = gameData.headimgurl;
                sgameBridge.cardnum = gameData.cardnum;
                sgameBridge.sex = gameData.sex;
                sgameBridge.address = LocationUtil.address;
                sgameBridge.packagename = window.packageName;
                sgameBridge.jbcData = gameData.jbcData;
                sgameBridge.phone = gameData.BDIphone;
                sgameBridge.appid = gameData.appId;
                sgameBridge.appname = gameData.appName;
                sgameBridge.wxsecret = '';
                sgameBridge.wxappid = 'wxb45a03a146f54e45';
                sgameBridge.shopurl = "";
                sgameBridge.ip = gameData.ip;
                sgameBridge.parentid = gameData.parent_id;
                sgameBridge.clientid = gameData.clientId;
                sgameBridge.logintype = gameData.loginType;
                sgameBridge.uid = gameData.uid;
                sgameBridge.area = gameData.parent_area;
            }

            //金币场的断线续玩
            if (gameData.jbcData) {
                if (gameData.jbcData.last && gameData.jbcData.last.game_type == 1) {
                    this.clickDDZ();
                }else if (gameData.jbcData.last && gameData.jbcData.last.game_type == 3) {
                    this.clickMatchDDZ();
                }
            }

            if (gameData.enterJBC) {
                gameData.enterJBC = false;
                var layer = new JBCMainLayer();
                //layer.setName('jbcMainLayer');
                this.addChild(layer);
            }

            return true;
        },

        showMatchMainLayer: function (name, args) {
            // var layer = new window[name](args);
            // layer.x = cc.winSize.width / 2;
            // layer.y = cc.winSize.height / 2;
            // layer.ignoreAnchorPointForPosition(false);
            // return layer;
            SubUpdateUtils.showCreateMatch('bisaichang');
        },

        /**
         * ui初始化
         */
        initUI: function () {
            this.nBTN = getUI(this, 'nBTN');
            this.nMain = getUI(this, 'nMain');
            this.txtCount = getUI(this, 'txtCount');
            this.messagenum = getUI(this, 'messagenum');
            this.message_numbg = getUI(this, 'message_numbg');
            this.message_numbg.setVisible(false);
            this.messagenum.setString('');
            this.btn_verify = getUI(this, 'btn_verify');
            this.btn_msg = getUI(this.nBTN, 'btn_msg');
            this.btn_wf = getUI(this.nBTN, 'btn_wf');
            this.btn_zj = getUI(this.nBTN, 'btn_zj');
            this.btn_sz = getUI(this.nBTN, 'btn_sz');
            this.btn_dc = getUI(this.nBTN, 'btn_dc');
            this.btn_hd = getUI(this.nBTN, 'btn_hd');
            this.btn_yq = getUI(this.nBTN, 'btn_yq');
            this.btn_tc = getUI(this.nBTN, 'btn_tc');
            this.btn_iap = getUI(this.nBTN, 'btn_iap');
            this.btn_add = getUI(this, 'add_3');
            this.btn_share = getUI(this.nBTN, 'btn_share');
            this.btn_binding = getUI(this, 'binding');
            this.btn_jbcddz = getUI(this, 'btn_jbcddz');
            this.btn_matchddz = getUI(this, 'btn_matchddz');
            this.btn_jbcpdk = getUI(this, 'btn_jbcpdk');
            this.lottery = getUI(this, 'lottery');
            this.btn_joinroom = getUI(this.nMain, 'btn_joinroom');
            this.btn_match = getUI(this.nMain, 'btn_match');
            this.btn_yikai = getUI(this.nMain, 'btn_yikai');
            this.btn_daikai = getUI(this.nMain, 'btn_daikai');
            this.btn_club = getUI(this.nMain, 'btn_club');
            this.txtName = getUI(this, 'txtName');
            this.txtID = getUI(this, 'txtID');
            this.headbg = getUI(this, 'head_1');
            this.head = getUI(this, 'head');
            this.debug_reateroom = getUI(this, 'debugcreateroom');
            this.btn_notice = getUI(this, 'btn_notice');
            this.logo = getUI(this, 'hall_title_41');
            this.nodeQyq = getUI(this, 'node_renwu');
            this.nodeCoin = getUI(this, 'roomcoin');
            this.nodeDiamond = getUI(this, 'roomdiamond');
            this.bangding_iphone = getUI(this.nBTN, 'bangding_iphone');

            this.txtCountCoin = getUI(this.nodeCoin, "txtCount");
            this.txtCountdiamond = getUI(this.nodeDiamond, "txtCount");
            this.btn_addCoin = getUI(this.nodeCoin, "add_3");
            this.btn_adddiamond = getUI(this.nodeDiamond, "add_3");


            this.initQyq();
            this.initBscbtn();
            this.initLunBo();
            this.initNewYear();
            this.initGames();
            this.initUserInfo();
            // this.btn_match.disable = true;
            this.nodeDiamond.setVisible(true);
            this.nodeCoin.setVisible(true);
            this.btn_iap.setVisible(true);

            this.bangding_iphone.setVisible(true);
            // 使用本地记录的绑定状态值。
            this.key_bangding = 'bangding_yes';
            this.stbangding = cc.sys.localStorage.getItem(this.key_bangding);
            if (this.stbangding == '1') {
                // this.bangding_iphone.setVisible(false);
                cc.log('==this.stbangding:' + this.stbangding);
            }

            // 实名验证
            this.setYanzheng(gameData.hasShiMing == null || gameData.hasShiMing == undefined || gameData.hasShiMing == false);

            // 绑定手机
            if (window.inReview || gameData.BDIphone && gameData.BDIphone.length > 0) {
                this.bangding_iphone.setVisible(false);
            } else {
                this.bangding_iphone.setVisible(true);
            }
            // todo 代开隐藏
            this.btn_yikai.setVisible(false);
            this.btn_daikai.setVisible(false);

            //切home
            this.hide_listener = cc.eventManager.addCustomListener("game_on_hide", this.Game_On_Hide.bind(this));
            this.show_listener = cc.eventManager.addCustomListener("game_on_show", this.Game_On_Show.bind(this));
        },

        Game_On_Hide: function () {

        },

        // 回到游戏
        Game_On_Show: function () {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                network.send(3013);
            }
        },

        /**
         * 初始化点击事件
         */
        initTouch: function () {
            TouchUtils.setOnclickListener(this.btn_verify, this.onVerify.bind(this));
            TouchUtils.setOnclickListener(this.lottery, this.showLotterlayer.bind(this));
            TouchUtils.setOnclickListener(this.btn_iap, this.clickShop.bind(this, 1));
            TouchUtils.setOnclickListener(this.btn_add, this.clickShop.bind(this, 1));
            TouchUtils.setOnclickListener(this.btn_addCoin, this.clickShop.bind(this, 2));
            TouchUtils.setOnclickListener(this.btn_adddiamond, this.clickShop.bind(this, 3));
            TouchUtils.setOnclickListener(this.btn_binding, this.clickBinding.bind(this));
            TouchUtils.setOnclickListener(this.btn_msg, this.clickActivityMsg.bind(this));
            TouchUtils.setOnclickListener(this.btn_wf, this.clickWanfa.bind(this));
            TouchUtils.setOnclickListener(this.btn_zj, this.clickZhanJi.bind(this));
            TouchUtils.setOnclickListener(this.btn_hd, this.clickHuodong.bind(this));
            TouchUtils.setOnclickListener(this.btn_yq, this.clickBinding.bind(this));
            TouchUtils.setOnclickListener(this.btn_tc, this.clickExit.bind(this));
            TouchUtils.setOnclickListener(this.btn_sz, this.clickSheZhi.bind(this));
            TouchUtils.setOnclickListener(this.btn_dc, this.clickExit.bind(this));
            TouchUtils.setOnclickListener(this.btn_share, this.clickShare.bind(this));
            TouchUtils.setOnclickListener(this.bangding_iphone, this.clickBangding.bind(this));
            TouchUtils.setOnclickListener(this.btn_joinroom, this.clickJoinRoom.bind(this));
            TouchUtils.setOnclickListener(this.btn_match, this.clickMatch.bind(this));
            TouchUtils.setOnclickListener(this.btn_yikai, this.clickYiKai.bind(this));
            TouchUtils.setOnclickListener(this.btn_daikai, this.clickDaiKai.bind(this));
            TouchUtils.setOnclickListener(this.btn_club, this.clickClub.bind(this));
            TouchUtils.setOnclickListener(this.headbg, this.clickHead.bind(this));
            TouchUtils.setOnclickListener(this.debug_reateroom, this.onDebugCreateRoom.bind(this));
            TouchUtils.setOnclickListener(this.btn_notice, this.showNoPluginLayer.bind(this));
            TouchUtils.setOnclickListener(this.logo, this.logoFunc.bind(this));
            TouchUtils.setOnclickListener(this.btn_jbcddz, this.clickDDZ.bind(this));
            TouchUtils.setOnclickListener(this.btn_matchddz, this.clickMatchDDZ.bind(this));
            TouchUtils.setOnclickListener(this.btn_jbcpdk, this.clickPDK.bind(this));
            //test
            // TouchUtils.setOnclickListener(this.btn_sz, this.clickExit.bind(this));
        },

        /**
         * 初始化网络监听
         */
        initNetListener: function () {
            var that = this;
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
                var update = data.update;

                console.log('拉去更新' + sub);
                if (url) {
                    showLoading('有新的' + sub + '版本:' + version + ',请更新中');
                    if (sub == 'home') {
                        var scene = new UpdateScene();
                        scene.run();
                        return;
                    }
                    SubUpdateUtils.checkUpdate(url, sub, version, function () {
                        console.log("source==="+source);
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
                                        gameData.last3001Data = null;
                                    }
                                }
                            }
                        } else if (source === 'join') {
                            network.send(3002, {
                                room_id: '' + roomid
                            });
                        } else if (source === 'request') {
                            // if (gameData.last3002Data) {
                            //     gameData.last3002Data.isself = true;
                            //     var recvData = _.clone(gameData.last3002Data);
                            //     network.start();
                            //     network.selfRecv({'code': 3002, 'data': recvData});
                            //     // network.selfRecv({'code': 4004, 'data': gameData.data4004});
                            //     gameData.last3002Data = null;
                            // }
                        } else if (source === '' + MAP_ID.MATCHHALL) {
                            SubUpdateUtils.loadSubGame('bisaichang', function () {
                                var matchl = new MatchMainLayer();
                                matchl.setName('matchmainlayer');
                                that.addChild(matchl);
                            });
                        } else if (source === '' + MAP_ID.PDK_MATCH) {
                            if (gameData.lastMatchSignFunc) {
                                gameData.lastMatchSignFunc();
                                gameData.lastMatchSignFunc = null;
                            }
                        } else if(source === '' + MAP_ID.CLUBHALL){
                            SubUpdateUtils.loadSubGame('club', function () {
                                var matchl = new ClubMainLayer();
                                matchl.setName('ClubLayer');
                                window.maLayer.addChild(matchl);
                            });
                        } else {
                            hideLoading();
                            if (gameData.mapId != MAP_ID.PDK_JBC) {
                                alert1('有新的' + sub + '版本:' + version + ',请更新后进入');
                            }
                        }
                    });
                } else {
                    //不需要更新
                    if (source === 'request') {
                        // if (gameData.last3002Data) {
                        //     gameData.last3002Data.isself = true;
                        //     var recvData = _.clone(gameData.last3002Data);
                        //     network.start();
                        //     network.selfRecv({'code': 3002, 'data': recvData});
                        //     gameData.last3002Data = null;
                        // }
                    }else if (source === '' + MAP_ID.MATCHHALL) {
                        SubUpdateUtils.loadSubGame('bisaichang', function () {
                            var matchl = new MatchMainLayer();
                            matchl.setName('matchmainlayer');
                            that.addChild(matchl);
                        });
                    }else if (source === '' + MAP_ID.PDK_MATCH){
                        if (gameData.lastMatchSignFunc) {
                            gameData.lastMatchSignFunc();
                            gameData.lastMatchSignFunc = null;
                        }
                    }else if (source === '' + MAP_ID.CLUBHALL){
                        SubUpdateUtils.loadSubGame('club', function () {
                            var matchl = new ClubMainLayer();
                            matchl.setName('ClubLayer');
                            window.maLayer.addChild(matchl);
                        });
                    }
                }
            });

            network.addListener(2008, function (_data) {
                if (_data.cmd == 'VerificationCode') {  // 发送验证码成功
                    if (_data.error_code == 0) {
                        BDIphone.scheYZM();
                    } else {
                        var tishi = new TiShi('您输入的手机号码有误，请重新输入');
                        that.addChild(tishi, 100);
                    }
                } else if (_data.cmd == 'BindMobile') {  //绑定成功
                    if (_data.error_code == 0) {
                        var str = '手机号绑定成功';
                        if (_data.numof_cards_2 > 0) {
                            str = '手机号绑定成功，恭喜获得' + _data.numof_cards_2 + '张房卡';
                            network.send(3013);
                        }
                        gameData.BDIphone = _data.mobile;
                        var tishi = new TiShi(str);
                        that.addChild(tishi, 100);
                        that.bangding_iphone.setVisible(false); //主界面隐藏绑定手机号按钮
                        NewPlayerInfo.newBDiphone();  //修改个人信息界面 已绑定手机号
                        BDIphone.removeSelf();

                        cc.sys.localStorage.setItem(this.key_bangding, 1);
                    } else {
                        var tishi = new TiShi('您输入的验证码有误，请重新输入');
                        that.addChild(tishi, 100);
                    }
                } else if (_data.cmd == 'UnbindMobile') {
                    if (_data.error_code == 0) {
                        gameData.BDIphone = '';
                        NewPlayerInfo.newBDiphone(); //个人信息界面 解绑
                        that.bangding_iphone.setVisible(true); //主界面显示绑定手机号按钮
                        cc.sys.localStorage.setItem(this.key_bangding, 0);
                        setTimeout(function () {
                            cc.log('==解绑成功倒计时=');
                            var tishi = new TiShi('jbok');
                            that.addChild(tishi, 100);
                        }, 200);
                    } else {
                        var tishi = new TiShi('解绑失败!');
                        that.addChild(tishi, 100);
                    }
                } else {
                    if (_data.success) {
                        var tishi = new TiShi('认证成功!', function () {
                            gameData.hasShiMing = true;
                            // MainLayer.setYanzheng(true);
                            NewPlayerInfo.newShiMing();
                            VerifyLayer.removeSelf();
                        });
                        that.addChild(tishi, 100);
                    } else {
                        var tishi = new TiShi('验证失败,请重试！');
                        that.addChild(tishi, 100);
                    }
                }
            });

            // 请求房卡
            setTimeout(function () {
                network.send(3013, {});
            }, 500);

            this.list2103 = cc.eventManager.addCustomListener('custom_listener_2103', function (event) {
                var data = event.getUserData();
                if (data) {
                    var cmd = data['command'];
                    var errorCode = data['result'];
                    var errorMsg = data['msg'];

                    if (errorCode && errorMsg != '没有房间') {
                        alert1(errorMsg, 'noAnimation');
                    }
                    data.scene = 'home';
                    cc.eventManager.dispatchCustomEvent(cmd, data);
                }
            });
            this.list1 = cc.eventManager.addCustomListener('BroadcastUid', function (event) {
                var data = event.getUserData();
                if (data.scene != 'home') return;
                if (data) {
                    var message = data['data'];
                    if (message) {
                        var type = message['type'] || '';
                        if (type == MessageType.Invite) {
                            message.from_uid = data['from_uid'];
                            message.club_id = data['club_id'];
                            if (message) {
                                if (message['uids'].toString().indexOf(gameData.uid) >= 0) {
                                    if (cc.sys.isObjectValid(that)) {
                                        var clubNoticeLayer = that.getChildByName('clubNoticeLayer');
                                        if (clubNoticeLayer) clubNoticeLayer.removeFromParent();
                                        if(typeof ClubNoticeLayer != 'undefined') {
                                            clubNoticeLayer = new ClubNoticeLayer(message, NoticeType.clubInvite);
                                            clubNoticeLayer.setName('clubNoticeLayer');
                                            that.addChild(clubNoticeLayer);
                                        }
                                    }
                                }
                            }
                        } else if (type == MessageType.Refused) {
                            alert1(message['msg']);
                        }
                    }
                }
            });
        },

        /**
         * 提审隐藏东西
         */
        initInReview: function () {
            if (!window.inReview) {
                return;
            }
            this.btn_msg.setVisible(false);
            this.btn_yq.setVisible(false);
            this.btn_share.setVisible(false);
            this.btn_binding.setVisible(false);
            this.lottery.setVisible(false);
            this.txtID.setString('LV:1');

            // 调整位置
            var posX = this.btn_sz.x;
            var showList = [
                this.btn_zj,
                this.btn_hd,
                this.btn_wf,
                this.btn_notice,
                this.btn_iap
            ];
            for (var i = 0; i < showList.length; i++) {
                posX += 120;
                showList[i].x = posX;
            }
        },

        clickMatchDDZ: function(){
            if(gameData.opt_conf.closeMatchDdz){
                alert1('敬请期待');
                return;
            }
            var sgLoder = new SGameDownloader();
            this.addChild(sgLoder);
            sgLoder.loadGame("jbclandlord", "res/project-jbc-landlord.manifest", "jbcddz", "match");
        },
        /**
         * 点击金币场斗地主
         */
        clickDDZ: function () {
            cc.log("clickDDZ ====================");
            var sgLoder = new SGameDownloader();
            this.addChild(sgLoder);
            sgLoder.loadGame("jbclandlord", "res/project-jbc-landlord.manifest", "jbcddz");
        },

        /**
         * 点击金币场跑得快
         */
        clickPDK: function () {
            var time = Math.floor(getCurTimeMillisecond()/1000);
            var url = 'http://static.yygameapi.com:23456/' + gameData.parent_area + '/' + 'click' + '?uid=' + gameData.uid + '&where=main&' + 'time=' + time;
            var sign = Crypto.MD5('request:/' + gameData.parent_area + '/' + 'click' + '?uid=' + gameData.uid + '&where=main&' + 'time=' + time);
            console.log(url + "&sign=" + sign);
            NetUtils.httpGet(url + "&sign=" + sign, function (response) {
            }, function () {
            });
            SubUpdateUtils.showCreateJBC_PDK('pdk_jbc');
        },
        /**
         * 弹出错误消息
         */
        alertError: function () {
            if (gameData.errMessage) {
                HUD.showMessageBox('提示', gameData.errMessage, function () {
                }, true);
                gameData.errMessage = null;
            }
        },

        /**
         * 请求公告
         */
        requestNotice: function () {
            var request = {};
            request.test = '';
            DC.httpData('/qmdp', request, this.onMessageList.bind(this), true, 'http://notice.yygameapi.com:34567');
        },

        /**
         * 初始化游戏按钮
         */
        initGames: function () {
            var games = ['niuniu', 'pdk', 'majiang', 'psz', 'kaokao', 'epz', 'sss'];

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
                        // if(name=="sss"){
                        //     SubUpdateUtils.loadSubGame("sss", function () {
                        //         that.addChild(new PokerLayer_sss());
                        //     })
                        //     return;
                        // }
                        if (that) {//} && sender.getPositionY() < (cy + 60)){
                            that.createRoomLayer(name, false);
                        }
                    }, {swallowTouches: true});

                    //暂时隐藏二皮子
                    if (!!btn && name == 'erpizi') {
                        btn.setVisible(false);
                    }


                    // var title = new cc.Sprite('res/image/ui/hall/title_roomcreate_' + games[i] + '.png');
                    // title.setPosition(cc.p(btnList[i].getContentSize().width / 2, 50));
                    // btnList[i].addChild(title);
                })(games[i]);
            }

            // this.initBtnLight(this.btn_jbcddz);
            // this.initBtnLight(this.btn_jbcpdk);

            var scroll = getUI(that.nMain, 'scroll');
            that.initBtnLight(getUI(scroll, 'btn_createroom_sss' ));
        },
        initBtnLight: function (btn) {
            var initBscbtnxg = null;
            initBscbtnxg = new sp.SkeletonAnimation(res.main_btn_light_json, res.main_btn_light_atlas);
            initBscbtnxg.addAnimation(0, 'animation', true);
            if (!!initBscbtnxg) {
                btn.addChild(initBscbtnxg);
                initBscbtnxg.setAnchorPoint(cc.p(0, 0));
                initBscbtnxg.setPosition(btn.getContentSize().width / 2, btn.getContentSize().height / 2);
            }
        },

        /**
         * 初始化亲友圈头像
         */
        initQyq: function () {
            var defaulthead = null;
            var x = 0;
            var y = 60;
            if (!cc.sys.isNative) {
                defaulthead = new cc.Sprite('res/image/ui/hall/defaultHead.jpg');
            } else {
                defaulthead = new sp.SkeletonAnimation(res.qyqrw_json, res.qyqrw_atlas);
                defaulthead.addAnimation(0, 'animation', true);
                x = -153;
                y = -83;
            }
            if (!!defaulthead) {
                this.nodeQyq.addChild(defaulthead);
                defaulthead.setPosition(x, y);
            }
        },

        /**
         * 初始化比赛场按钮效果
         */
        initBscbtn: function () {
            var initBscbtnxg = null;
            initBscbtnxg = new sp.SkeletonAnimation(res.bscbtn_json, res.bscbtn_atlas);
            initBscbtnxg.addAnimation(0, 'bisaichang1', true);
            if (!!initBscbtnxg) {
                this.btn_match.addChild(initBscbtnxg);
                initBscbtnxg.setAnchorPoint(cc.p(0, 0));
                initBscbtnxg.setPosition(this.btn_match.getContentSize().width / 2, this.btn_match.getContentSize().height / 2);
            }
        },


        /**
         * 初始化轮播
         */
        initLunBo: function () {
            // 新版大厅暂没轮播界面
            // var wmxybg = new LunBoLayer();
            // wmxybg.setScale(0.9);
            // wmxybg.setPosition(cc.p(50, 70));
            // this.addChild(wmxybg);
            // wmxybg.setVisible(!window.inReview);
            // wmxybg.setVisible(false);
        },

        /**
         * 初始化新年
         */
        initNewYear: function () {
            this.lottery.setVisible(gameData.opt_conf.liuyi > 0);
            playFrameAnim2(res.zhuanzhuanle_plist, 'zhuanzhuan', 1, 30, 0.1, true, this.lottery, function () {

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

            // gameData.opt_conf['scpdk']  = 1;
            var tanchuangConfig = ['mianzhufk', 'sss'];
            for (var i = 0; i < tanchuangConfig.length; i++) {
                (function (i) {
                    var key = cc.sys.localStorage.getItem(tanchuangConfig[i]) || '0-0';
                    // key  = '0';
                    if (window.inReview == false && gameData.opt_conf[tanchuangConfig[i]] && key != (month + '-' + day)) {
                        cc.sys.localStorage.setItem(tanchuangConfig[i], month + '-' + day);

                        var pop = new ccui.Layout();
                        pop.setColor(cc.color(0, 0, 0));
                        pop.setOpacity(200);
                        pop.setPosition(cc.p(0, 0));
                        pop.setContentSize(cc.winSize);
                        that.addChild(pop, 1000);
                        var bg = new cc.Sprite(res['pop_' + tanchuangConfig[i]]);
                        bg.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
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
                })(i);
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
         * 点击头像
         */
        clickHead: function () {
            if (window.inReview)
                return;
            var newPlayerInfo = new NewPlayerInfo();
            this.addChild(newPlayerInfo);
            return;

            var that = this;
            var scene = ccs.load(res.PlayerInfo_json, 'res/');
            this.addChild(scene.node);

            var head = getUI(scene.node, 'head');
            var lbNickname = getUI(scene.node, 'lb_nickname');
            var lbId = getUI(scene.node, 'lb_id');
            var lbIp = getUI(scene.node, 'lb_ip');
            var male = getUI(scene.node, 'male');
            var female = getUI(scene.node, 'female');
            var fake_root = getUI(scene.node, 'fake_root');
            var panel = getUI(scene.node, 'panel');
            var lbAd = getUI(scene.node, 'lb_ad');
            var lbDt = getUI(scene.node, 'lb_dt');
            var get_gps = getUI(scene.node, 'get_gps');
            lbDt.setVisible(false);

            lbNickname.setString(ellipsisStr(gameData.nickname, 6));
            lbId.setString(gameData.uid);
            lbIp.setString(gameData.ip);
            male.setVisible(gameData.sex == '1');
            female.setVisible(gameData.sex == '2');
            loadImageToSprite(((gameData.headimgurl == null || gameData.headimgurl == '') ? res.defaultHead : gameData.headimgurl), head);

            //定位
            lbAd.setVisible(true);
            if (!isNullString(locationUtil.address)) {
                lbAd.setString(decodeURIComponent(locationUtil.address));
            } else {
                lbAd.setString('您可能没有开启定位权限');
            }

            //gps
            var lastGetLocTIme = 0;
            get_gps.setVisible(false);
            // TouchUtils.setOnclickListener(get_gps, function () {
            //     if(!PermissionUtils.isHasLocationPermission()){
            //         alert1('未开启定位权限，请先开启定位权限');
            //         return;
            //     }
            //     var now = getCurTimestamp();
            //     if (now - lastGetLocTIme < 10) {
            //         alert1('过于频繁，请稍后重试');
            //         return;
            //     }
            //     lastGetLocTIme = now;
            //
            //     HUD.showMessage('重新请求定位中');
            //     LocationUtils.startLocation();
            //     that.scheduleOnce(function(){
            //         var locationStr = null;
            //         locationStr = LocationUtils.getCurLocation();
            //         if(cc.sys.isNative) console.log("locationStr = " + locationStr);
            //         if (locationStr) {
            //             if (cc.sys.os == cc.sys.OS_IOS) {
            //                 var parts = locationStr.split(',');
            //                 if (parts.length > 1) {
            //                     gameData.location = parts[1] + ',' + parts[0];
            //                 } else {
            //                     gameData.location = null;
            //                     return;
            //                 }
            //             } else {
            //                 gameData.location = locationStr;
            //             }
            //
            //             LocationUtils.getCurLocationInfo(function (info, lng, lat) {
            //                 gameData.locationInfo = info;
            //                 lbAd.setString(decodeURIComponent(gameData.locationInfo));
            //                 if (lng)
            //                     gameData.location = lat + ',' + lng;
            //                 network.send(3007, {
            //                     location: gameData.location,
            //                     locationCN: gameData.locationInfo
            //                 });
            //             });
            //             LocationUtils.clearCurLocation();
            //         }
            //     }, 2)
            // });

            TouchUtils.setOnclickListener(fake_root, function () {
                scene.node.removeFromParent(true);
            });
            TouchUtils.setOnclickListener(panel, function () {
            }, {effect: TouchUtils.effects.NONE});

            for (var i = 1; i <= 4; i++) {
                var emoji = getUI(scene.node, 'emoji' + i);
                emoji.setVisible(false);
            }
        },

        /**
         * 点击俱乐部
         */
        clickClub: function () {
            // this.addChild(new ClubMainLayer());
            SubUpdateUtils.showCreateMatch('club');
        },
        createClubRoom: function(club_id, pos){
            this.addChild(new ClubCreateRoomLayer(club_id, pos));
        },

        /**
         * 点击已开
         */
        clickYiKai: function () {
            this.addChild(new DaiKai());
        },

        /**
         * 点击代开
         */
        clickDaiKai: function () {
            this.createRoomLayer(true);
        },

        /**
         * 点击加入房间
         */
        clickJoinRoom: function () {
            HUD.showLayer(HUD_LIST.RoomJoin, this);
        },

        /**
         * 点击比赛场按钮
         */
        clickMatch: function () {
            // if (!gameData.canMatch) {
            //     alert1('比赛场正在路上，敬请期待...');
            //     return;
            // }
            // showLayer('MatchMainLayer').setName('matchmainlayer');
            SubUpdateUtils.showCreateMatch('bisaichang');
        },

        /**
         * 点击分享
         */
        clickShare: function () {
            // var share = new ShareLayer();
            showLayer("ShareLayer")
        },

        /**
         * 点击绑定
         */
        clickBangding: function () {
            cc.log('clickBangding');
            // var bdIphone = new BDIphone(true);
            // this.addChild(bdIphone);
            showLayer("BDIphone")
        },

        /**
         * 点击退出
         */
        clickExit: function () {
            alert2('是否确定退出登录？', function () {
                cc.sys.localStorage.removeItem('wxToken');
                cc.sys.localStorage.removeItem('openid');
                cc.sys.localStorage.removeItem('xianliao_openid');
                cc.sys.localStorage.removeItem('lbopenid');
                gameData.hasLogined = false;
                network.disconnect();
                gameData.enterRoomWithClubID = 0;
            }, null, false, false);
        },

        /**
         * 点击设置
         */
        clickSheZhi: function () {
            var setting = HUD.showLayer(HUD_LIST.Settings, this);
            setting.setSetting(this, 'room');//大厅里面打开界面
            setting.setSettingLayerType({hidejiesan: this});
        },

        /**
         * 点击玩法
         */
        clickWanfa: function () {
            HUD.showLayer(HUD_LIST.Rule, this);
        },

        /**
         * 点击战绩
         */
        clickZhanJi: function () {
            HUD.showLayer(HUD_LIST.History, this);
        },

        /**
         * 点击活动
         */
        clickActivityMsg: function () {
            this.addChild(new ActivityMsgLayer(this.noticeData || []));
            // showLayer('ActivityMsgLayer',this.noticeData || [])
        },

        /**
         * 点击绑定邀请码
         */
        clickBinding: function () {
            this.addChild(new BindingAgencyLayer(gameData.parent_id));
        },

        /**
         * 点击活动
         */
        clickHuodong: function () {
            // this.addChild(new BindingAgencyLayer(gameData.parent_id));
            this.clickActivityMsg();
        },

        /**
         * 点击商店
         */
        clickShop: function (index) {
            if (window.inReview) {
                // ios商店
                this.addChild(new ShopLayer(this));
            } else {
                // 微信商店
                // 微信商店
                network.send(2103, {cmd: 'updateLocal', location: 3});
                if (cc.sys.os == cc.sys.OS_ANDROID && (getNativeVersion() != '3.1.0')) {
                    this.showH5Shop(index);
                    return;
                }
                var coinShop = new CoinShopLayer(this, index);
                this.coinShop = coinShop;
                cc.director.getRunningScene().addChild(coinShop);
                // this.addChild(coinShop);
                return;
                this.openShop();
            }
        },
        showH5Shop: function (ciType) {//ciType   房卡是1   金币是2   钻石是3
            var that = this;
            //http://pay.bangshuiwang.com  pay.yayayouxi.com
            var indexUrl = PAY_QMDPURL + "/payServer/wxpay/app_pay/dist/index.html?";
            if (!indexUrl) return;
            var signKey = Crypto.MD5("feiyu-pay" + gameData.uid + gameData.parent_area);
            indexUrl += "area=" + gameData.parent_area + "&buyerId=" + gameData.uid + "&source=5&ciType=" + ciType + "&signKey=" + signKey + "&#http://";
            cc.log("indexUrl===" + indexUrl)
            var layer = new cc.LayerColor(cc.color(0, 0, 0, 255), 1280, 641);
            layer.setAnchorPoint(0, 0);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                cc.sys.openURL(indexUrl);
                return;
            }
        },

        /**
         * 测试创建房间
         */
        onDebugCreateRoom: function () {
            var roomid = cc.sys.localStorage.getItem('lastroomid');
            if (roomid) {
                network.send(3002, {room_id: parseInt(roomid)});
                return;
            }
            network.send(3001, {
                'room_id': 0,
                'map_id': 340,
                'mapid': 340,
                'daikai': false,
                'options': {
                    'mapid': 340,
                    'name': '四川考考',
                    'AA': false,
                    'room_gz': '房主支付',
                    'jushu': 8,
                    'cpCount': 3,
                    'cpSsz': 0,
                    'cpWuhei': 0,
                    'cpDang': 2,
                    'cpPiao': 0,
                    'desp': '四川考考,房主支付,局数: 8局,3人玩,胡到底,五红五黑,推当,不飘',
                    'special_gz': ['四川考考', '房主支付', '局数: 8局', '3人玩', '胡到底', '五红五黑', '推当', '不飘'],
                    'wanfa': 'kaokao'
                }
            });
        },
        /**
         * 俱乐部优惠
         */
        showClubCreateRoom: function () {
            var that = this;
            var scene = ccs.load(res.ClubFankuiLayer_json, 'res/');
            that.addChild(scene.node);

            var fake_root = getUI(scene.node, 'root');
            var close = getUI(scene.node, 'close');

            TouchUtils.setOnclickListener(close, function () {
                scene.node.removeFromParent(true);
            });
            TouchUtils.setOnclickListener(fake_root, function () {
                scene.node.removeFromParent(true);
            }, {effect: TouchUtils.effects.NONE});
        },
        /*
         logo
         */
        logoFunc: function () {
            this.clickLogo = this.clickLogo || 0;
            this.clickLogo++;
            if (this.clickLogo >= 10) {
                this.clickLogo = 0;
                SubUpdateUtils.clearAllSubmodules();
            }
        },
        /**
         * 反外挂
         */
        showNoPluginLayer: function () {
            var that = this;
            var scene = loadNodeCCS(res.NoPluginLayer_json, this);
            // that.addChild(scene.node);
            // addModalLayer(scene.node);
            var close = getUI(scene.node, 'close');

            TouchUtils.setOnclickListener(close, function () {
                scene.node.removeFromParent(true);
            });
        },

        /**
         * 比赛活动通知
         */
        showNoticeMatchLayer: function () {
            if (gameData.isNoticeMatch)
                return;
            gameData.isNoticeMatch = true;
            var that = this;
            var scene = loadNodeCCS(res.NoticeMatchLayer_json, this);
            // addModalLayer(scene.node);
            // that.addChild(scene.node);

            var fake_root = getUI(scene.node, 'root');
            var close = getUI(scene.node, 'close');
            var match = getUI(scene.node, 'match');

            TouchUtils.setOnclickListener(match, function () {
                // that.clickMatch();
                scene.node.removeFromParent(true);
            });
            TouchUtils.setOnclickListener(close, function () {
                scene.node.removeFromParent(true);
            });
            TouchUtils.setOnclickListener(fake_root, function () {
                scene.node.removeFromParent(true);
            }, {effect: TouchUtils.effects.NONE});
        },

        /**
         * 点击实名
         */
        onVerify: function () {
            this.addChild(new VerifyLayer(this));
        },

        /**
         * 转盘抽奖
         */
        showLotterlayer: function () {
            var that = this;
            var indexUrl = null;
            if (gameData.opt_conf.liuyi == 1) {
                indexUrl = 'https://pay.yayayouxi.com/activity-front/liuyi_activity/index.html';
            } else if (gameData.opt_conf.liuyi == 2) {
                indexUrl = 'https://pay.yayayouxi.com/activity-front-test/liuyi_activity/index.html';
            }
            if (!indexUrl) return;
            var layer = new cc.LayerColor(cc.color(0, 0, 0, 127), cc.winSize.width, cc.winSize.height);
            layer.setAnchorPoint(0, 0);
            var playerId = gameData.uid;
            var area = gameData.parent_area;
            var signKey = Crypto.MD5('feiyu-activity' + playerId + area);
            var webView = new ccui.WebView(indexUrl + '?playerId=' + playerId + '&area=' + area + '&signKey=' + signKey + '&#http://');
            webView.setContentSize(cc.winSize.width * 0.85, cc.winSize.height * 0.85);
            webView.setAnchorPoint(0, 0);
            webView.setPosition(cc.winSize.width * 0.0725, cc.winSize.height * 0.0725);
            layer.addChild(webView);
            cc.director.getRunningScene().addChild(layer, 1001);
            TouchUtils.setOnclickListener(layer, function (node) {
                layer.removeFromParent(true);
            }, {effect: TouchUtils.effects.NONE});

            var btn_close = new cc.Sprite('res/appCommon/fydp/common/room_close.png');
            btn_close.setPositionX(cc.winSize.width * 0.9 + 70);
            btn_close.setPositionY(cc.winSize.height * 0.9 + 20);
            layer.addChild(btn_close);
            TouchUtils.setOnclickListener(btn_close, function (node) {
                layer.removeFromParent(true);
            });
            //
            // var btn_share = new cc.Sprite('res/huodong_51/animation/active/btn_share2.png');
            // btn_share.setPositionX( cc.winSize.width * 0.9 + 60);
            // btn_share.setPositionY(  cc.winSize.height * 0.7 - 80);
            // layer.addChild(btn_share);
            // TouchUtils.setOnclickListener(btn_share, function (node) {
            //     layer.removeFromParent(true);
            //     var scene = ccs.load(res.Share51ActNode_json, 'res/');
            //     WXUtils.captureAndShareToPyq(scene.node,0x88F0);
            //     sctivity51SignIn();
            // });
        },

        /**
         * 微信商城
         */
        openShop: function () {
            var that = this;

            var sendData = {area: gameData.parent_area, playerid: gameData.uid, unionid: gameData.unionid};
            //购卡方式   修改
            var id = gameData.uid % 10;
            var buycardtype = -1;
            if (gameData.opt_conf && gameData.opt_conf['buycardtype'] >= 0) {
                buycardtype = gameData.opt_conf['buycardtype'];
            }
            // buycardtype = -1;//-1 不开
            if (id <= buycardtype) {
                var signKey = Crypto.MD5('feiyu-pay' + gameData.uid + gameData.parent_area);
                cc.sys.openURL('http://pay2.lvhejincheng.com:8899/payServer/wxpay/unify_pay/index.html?area=' + gameData.parent_area + '&buyerId=' + gameData.uid + '&source=2&ciType=1&signKey=' + signKey);
            }

            // var layer = new cc.Layer();
            // var playerId = gameData.uid;
            // var area = gameData.parent_area;
            // var signKey = Crypto.MD5("feiyu-pay" + playerId + area);
            // var url = "http://pay.yayayouxi.com/payServer-test/wxpay/unify_pay/index.html?area=" + area + "&buyerId=" + gameData.uid + "&source=22&ciType=1&signKey=" + signKey;
            // // var webView = new ccui.WebView("https://pay.yayayouxi.com/activity-front/dice/shanxi_dice/index.html?playerId=" + playerId + "&area=" + area + "&signKey=" + signKey+"&http://#");
            // console.log(url);
            // var webView = new ccui.WebView(url);
            // webView.setContentSize(cc.winSize.width * 0.5, cc.winSize.height * 1);
            // webView.setAnchorPoint(0, 0);
            // webView.setPosition(cc.winSize.width * 0.1, cc.winSize.height * 0);
            // layer.addChild(webView);
            // cc.director.getRunningScene().addChild(layer, 1001);
            // TouchUtils.setOnclickListener(layer, function (node) {
            //     layer.removeFromParent(true);
            // });
        },

        /**
         * 验证按钮显示
         * @param _bool
         */
        setYanzheng: function (_bool) {
            // this.btn_verify.setVisible(_bool);
            // if (window.inReview) {
            //     this.btn_verify.setVisible(!window.inReview);
            // }
            //新版界面暂不显示认证按钮
            this.btn_verify.setVisible(false);
        },

        /**
         * 轮询
         * @param dt 轮询时间
         */
        update: function (dt) {
            if (!this._time)
                this._time = 0;
            this._time += dt * 1000;
            if (this._time >= 250) {
                var autoJoinRoomId = _.trim(MWUtil.getRoomId() || '');
                // autoJoinRoomId = 'clubid_205';
                // console.log("autoJoinRoomId==="+autoJoinRoomId);
                if (autoJoinRoomId) {
                    if (autoJoinRoomId.startsWith('0')) {
                        var clubId = parseInt(autoJoinRoomId);
                        if (clubId) {
                            var myClubLayer = window.maLayer.getChildByName('ClubLayer');
                            if (myClubLayer)
                                myClubLayer.removeFromParent();
                            // myClubLayer = new ClubMainLayer();
                            // myClubLayer.setName('ClubLayer');
                            // window.maLayer.addChild(myClubLayer);
                            // myClubLayer.addChild(new ClubInputLayer('join', clubId));
                            SubUpdateUtils.loadSubGame('club', function () {
                                var matchl = new ClubMainLayer();
                                matchl.setName('ClubLayer');
                                window.maLayer.addChild(matchl);
                                matchl.addChild(new ClubInputLayer('join', clubId));
                            });

                            MWUtil.clearRoomId();
                        }
                        return;
                    } else if (autoJoinRoomId.length == 6 && network.isAlive()) {
                        showLoading('正在自动加入房间: ' + autoJoinRoomId);
                        gameData.enterRoomWithClubID = 0;
                        network.send(3002, {room_id: autoJoinRoomId});
                        MWUtil.clearRoomId();
                    }
                    // if (getNativeVersion() >= "2.3.0") {
                    //     if (cc.sys.isNative) {
                    //         var xianLiaoJoinRoomId = XianLiaoUtils.getRoomId();
                    //         if (xianLiaoJoinRoomId && !xianLiaoJoinRoomId.startsWith('0') && xianLiaoJoinRoomId.length == 6 && network.isAlive()) {
                    //             showLoading("正在自动加入房间: " + xianLiaoJoinRoomId);
                    //             network.send(3002, {room_id: xianLiaoJoinRoomId});
                    //             XianLiaoUtils.clearRoomId();
                    //         }
                    //     }
                    // }
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
            var filename = 'native_version';
            var dates = cc.sys.localStorage.getItem('updatetime') || '0-0';
            var today = new Date();
            var month = today.getMonth() + 1;
            var day = today.getDate();
            if (dates != (month + '-' + day)) {
                NetUtils.httpGet('http://penghuzi.yayayouxi.com/penghuzi/' + filename, function (response) {
                    if (native_version < response) {
                        cc.sys.localStorage.setItem('updatetime', month + '-' + day);
                        alert2('发现新版本,是否前往更新？', function () {
                            cc.sys.openURL('https://pay.bangshuiwang.com/fydp/');
                        }, false, false, false, true, true);
                    }
                }, function () {
                });
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
                    var hasread = cc.sys.localStorage.getItem('notice' + data.data[i]['TimeInMillionSecond']);
                    if (hasread == undefined || hasread == null || hasread == '') {
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
            var lastShowDay = cc.sys.localStorage.getItem('lastShowDay') || null;
            if (new Date().getDate() != lastShowDay) {
                cc.sys.localStorage.setItem('lastShowDay', new Date().getDate());
            }
        },

        /**
         * 牛牛加入房间
         */
        onJoinNiuNiu: function (event) {
            var data = event.getUserData();
            var Result = null;
            if (data.Head) {
                Result = data.Head.Result;
            }
            if (data.Result != null) {
                Result = data.Result;
            }
            if (Result == 0) {
                network.stop();
                gameData.maxPlayerNum = 6;
                var option = data.Option == '' ? {} : JSON.parse(decodeURIComponent(data.Option));
                gameData.totalRound = option.rounds;
                gameData.leftRound = gameData.totalRound - (data.CurrentRound || 0);
                gameData.currentRound = data.CurrentRound;
                gameData.Option = option;
                gameData.is_daikai = option.is_daikai;
                gameData.Option.currentRound = data.CurrentRound;
                gameData.roomId = data.RoomID;
                gameData.mapId = option['mapid'];
                gameData.ownerUid = data.Owner;
                gameData.wanfatype = option.wanfa;
                gameData.players = data['Users'];
                gameData.WatchingUsers = data.WatchingUsers;
                gameData.wanfaDesp = option['desp'];

                mRoom.wanfatype = option.wanfa;
                mRoom.roomInfo = gameData.Option;
                mRoom.BeiShu = option.BeiShu;
                mRoom.Preview = option.Preview;
                mRoom.ZhuangMode = option.ZhuangMode;
                mRoom.is_daikai = option.is_daikai;
                mRoom.Is_ztjr = option.Is_ztjr;
                mRoom.Cuopai = option.Cuopai;
                mRoom.noColor = option.noColor;
                mRoom.club_id = option.club_id;

                if (option.Players == 'jiu') {
                    gameData.maxPlayerNum = 9;
                }
                SubUpdateUtils.showGameScene(data);
            } else {
                hideLoading();
                HUD.showMessageBox('提示', data.ErrorMsg);
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
                this.messagenum.setString('');
            }
            if (window.inReview) {
                var btn7 = getUI(this.nBTN, 'btn_msg');
                btn7.setVisible(false);
            }
        },

        /**
         * 用户信息
         */
        initUserInfo: function () {
            var name = ellipsisStr(gameData.nickname, 6);
            this.txtName.setString(name);
            this.txtID.setString(' ID:' + gameData.uid);
            var headurl = (gameData.headimgurl == undefined || gameData.headimgurl == null || gameData.headimgurl == '') ? res.defaultHead : gameData.headimgurl;
            loadImageToSprite(headurl, this.head);
            if (gameData.numOfCards && gameData.numOfCards[1] >= 0) {
                //gameData.cardnum = data.numof_cards_2;//房卡数量
                gameData.cardnum = gameData.numOfCards[1];
                this.txtCount.setString(equalNum(gameData.cardnum) || "0");
            }
            if (gameData.numOfCards && gameData.numOfCards[0] >= 0) {
                gameData.coinnum = gameData.numOfCards[0];
                if (this.txtCountCoin) this.txtCountCoin.setString(equalNum(gameData.coinnum) || "0");
            }
            if (gameData.numOfCards && gameData.numOfCards[2] >= 0) {
                gameData.diamondnum = gameData.numOfCards[2];
                if (this.txtCountdiamond) this.txtCountdiamond.setString(equalNum(gameData.diamondnum) || "0");
            }

            //test
            // loadImageToSprite('http://127.0.0.1/1.jpg', this.head);
            // loadImageToSprite('http://127.0.0.1/1.jpg', this.head);
            // loadImageToSprite('http://127.0.0.1/1.jpg', this.head);
            // loadImageToSprite(res.defaultHead, this.head);
            // loadImageToSprite('http://127.0.0.1/1.jpg', this.head);
            // loadImageToSprite('http://127.0.0.1/1.jpg', this.head);
            // loadImageToSprite(res.defaultHead, this.head);
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
                hideLoading();
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
                gameData.options = obj;
                mRoom.rounds = obj.rounds;
                gameData.mapId = obj.mapid;
                mRoom.getWanfa(obj);
                mRoom.ownner = data.Owner;
                mRoom.club_id = obj.club_id;

                if (mRoom.wanfatype == 'dn') {
                    gameData.players = data['Users'];
                } else {
                    DD[T.PlayerList] = data['Users'];
                }
                network.stop();
                // if (mRoom.wanfatype == mRoom.YOUXIAN) {
                //     HUD.showScene(HUD_LIST.Room, this);
                // }

                SubUpdateUtils.showGameScene(data);
                cc.sys.localStorage.setItem('lastroomid', gameData.roomId);
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
                    var cmd = 'JoinRoom/' + mRoom.roomId;//Continue
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
                HUD.showMessage('登录失败');
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
                if (this.txtCount) this.txtCount.setString(equalNum(gameData.cardnum) || '0');
            }
            if (gameData.numOfCards[0] >= 0) {
                gameData.coinnum = gameData.numOfCards[0];
                if (this.txtCountCoin) this.txtCountCoin.setString(equalNum(gameData.coinnum) || "0");
            }
            if (gameData.numOfCards[2] >= 0) {
                gameData.diamondnum = gameData.numOfCards[2];
                if (this.txtCountdiamond) this.txtCountdiamond.setString(equalNum(gameData.diamondnum) || "0");
            }
            // gameData.BDIphone = data['mobile'];
            gameData.showBDcards = data['add_bind_card'] || 0;//新加的房卡
            this.bangding_iphone.setVisible(!window.inReview && (gameData.BDIphone == '' || gameData.BDIphone == null));

            // 比赛场
            // var mmlayer = this.getChildByName('matchmainlayer');
            // if (mmlayer && cc.sys.isObjectValid(mmlayer)) {
            //     mmlayer.freshFk();
            // }
            cc.eventManager.dispatchCustomEvent('updateFk', data);

            if (this.coinShop) {
                this.coinShop.initUserInfo();
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
                var content = (window.inReview) ? '文明游戏,欢乐人生' : gameData.Content;
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
                        speaker.runAction(cc.fadeOut(0.2));
                    })
                ));
            };
            if (gameData.Content != null && gameData.Content != undefined && gameData.Content != '') {
                func();
                var t = (gameData.Content.length * 0.3 <= 30) ? 30 : (gameData.Content.length * 0.3 + 5);
                interval = setInterval(func, t * 1000);
            }
        },

        /**
         * 创建房间
         * @param data
         */
        onCreateRoom: function (data, errorCode) {
            var that = this;
            if (errorCode) {
                var errorMsg = '创建房间失败, 请重试';
                if (errorCode == -40) errorMsg = '创建房间失败, 您的房卡不足';
                if (errorCode == -2) errorMsg = '版本过低。请退出后重新登陆';
                if (data && data.errorMsg) {
                    errorMsg = data.errorMsg;
                }
                alert1(errorMsg);
                HUD.removeLoading();
                return;
            }
            // hideLoading();
            //俱乐部创建的
            if (data && data['club_id']) {
                var club_id = data['club_id'];
                // var createRoomLayer = that.getChildByName('createRoomLayer');
                // if (createRoomLayer) createRoomLayer.removeFromParent();
                // network.send(2103, {cmd: 'listClubRoom', club_id: club_id});

                network.send(3002, {
                    room_id: '' + data.room_id
                });
                return;
            }
            if (data && data['is_daikai']) {
                that.mapId = data['map_id'] || 0;
                alert2(
                    '代开房间创建成功，房间号：' + data['room_id'] + '，代扣房卡' + data['need_cards'] + '张',
                    function () {
                        that.addChild(new DaiKai(that.mapId));
                    },
                    null,
                    false,
                    true,
                    true,
                    null,
                    null
                );
            }
        },

        /**
         * 重连
         * @param data
         */
        onReContent: function (data) {
            mRoom.wanfatype = '';
            gameData.roomId = data['room_id'];
            gameData.mapId = data['map_id'];
            gameData.gold_room_lev = data["gold_room_lev"] || 1;
            gameData.gold_room_name = data["name"] || '新手场';
            gameData.gold_room_base = data["baseGold"] || 50;
            gameData.players = data['players'];
            gameData.playerNum = data['players'].length;
            gameData.daikaiPlayer = data['daikai_player'];
            gameData.wanfaDesp = data['desp'];
            gameData.curRound = data['cur_round'];
            gameData.totalRound = data['total_round'];
            gameData.leftRound = data['left_round'] ? data['left_round'] : data['total_round'] - 1;
            gameData.matchId = data['match_id'] || 0;
            if (gameData.matchId) {
                gameData.totalRound = data['total_round'];
                gameData.matchInfo = data['match_info'];
                gameData.baseScore = data['init_base_score'];
                gameData.playTime = data['play_time'] || 12;
                // gameData.is_tg = data['is_tg'];
            }
            // gameData.curRound = gameData.totalRound - gameData.leftRound;

            if (data['options']) {
                gameData.yunxujiaru = data['options']['yunxujiaru'];
                if (data['options']['maxPlayerCnt']) {
                    gameData.playerNum = data['options']['maxPlayerCnt'];
                }
            }
            network.stop();
            this.intoRoom(data);
        },

        /**
         * 加入房间 3002
         */
        onJoinRoom: function (data, errorCode) {
            if (errorCode) {
                var errorMsg = null;
                if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
                if (errorCode == -30) errorMsg = '该房间已满员, 无法加入';
                if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
                if (errorCode == -40) errorMsg = '您的房卡不足';
                if (errorCode == -2) errorMsg = '版本过低。请退出后重新登陆';
                if (data && data.errorMsg) {
                    errorMsg = data.errorMsg;
                }
                alert1(errorMsg, null, null, true, true, true);
                HUD.removeLoading();
                return;
            }

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
            gameData.curRound = data['cur_round'];
            gameData.totalRound = data['total_round'];
            gameData.leftRound = data['left_round'] ? data['left_round'] : data['total_round'] - 1;

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
            if (gameData.matchId) {
                gameData.matchInfo = data['match_info'];
                gameData.baseScore = data['init_base_score'] || 0;
                gameData.playTime = data['play_time'] || 12;
                if (gameData.matchId) {//自动准备
                    network.send(3004, {room_id: gameData.roomId});
                }
                this.intoRoom();
                //自己发2006
                // if (!gameData.last3002Data) {
                //     if (!data.isself) {
                //         gameData.last3002Data = data;
                //         var mapid = gameData.mapId;
                //         network.send(2006, {map_id: mapid});
                //     } else {
                //         network.stop();
                //         if (this.returnRoomId) {
                //         } else {
                //             this.intoRoom();
                //         }
                //     }
                // }
            } else {
                network.stop();
                if (this.returnRoomId) {
                } else {
                    this.intoRoom();
                }
            }
        },

        /**
         * 创建房间
         * @param sub
         * @param isDaikai
         * @param club_id
         */
        createRoomLayer: function (sub, isDaikai, club_id, isSetWanfa) {
            SubUpdateUtils.showCreateRoom(sub, isDaikai, club_id, isSetWanfa);
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
            this.txtCount.setString(gameData.cardnum || '0');
        },

        /**
         * 进入房间
         * @param data
         */
        intoRoom: function (data) {
            SubUpdateUtils.showGameScene(data);
        }
    });
    exports.MainLayer = MainLayer;
})(window);
