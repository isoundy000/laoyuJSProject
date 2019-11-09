/**
 * 大厅界面
 */
(function (exports) {
    var exports = this;
    var $ = null;
    var CoverLayer = cc.Layer.extend({
        /**
         * 初始化Sdk
         * 根据底包需要注册sdk，未注册调用则会失败
         * */
        _initSdk: function () {
            if (!cc.sys.isNative || window.nativeVersion < registerSdkVersion || Sdk.isRegistered) {
                return;
            }
            Sdk.registerWeChat();
            Sdk.registerLiaoBe();
            Sdk.registerDingTalk();
            Sdk.isRegistered = true;
        },

        ctor: function () {
            this._super();
            this._initSdk();
            
            var that = this;
            var mainscene = loadNodeCCS('res/ccs/login/Login.json', this, 'Scene');

            $ = create$(this.getChildByName('Scene'));

            return true;
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        initIpList: function () {
            var unionid = cc.sys.localStorage.getItem('unionid');
            // unionid = 'og-le05lpErxMaJca7KFZOfgHDZQ';
            // alert0("unionid", unionid);
            var ipList = getIpList2(unionid || '');
            console.log(ipList);
            // alert0("111", ipList.toString());
            // alert0("111", gameData.o);

            if (window.inReview || !cc.sys.isNative) {
                ipList = ['niuniu.yygameapi.com', 'niuniu.yygameapi.com', 'niuniu.yygameapi.com'];
            }

            this.ipList = ipList;

            this.last_retry = 0;

        },
        installAppShowHideListener: function () {
            window.enterFrontListener = window.enterFrontListener || cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
                var now = getCurTimestamp();
                var networkId = network.getId();
                if (this.lastEnterBackTimestamp && now - this.lastEnterBackTimestamp > network.getKeepAliveInterval() && network.isAlive() && network.resetAndPing()) {
                    var _lastEnterBackTimestamp = this.lastEnterBackTimestamp;
                    this.lastEnterBackTimestamp = 0;
                    var fun = function (cnt) {
                        if (cnt > 60 / 4) {
                            if (networkId == network.getId())
                                network.disconnect();
                            return;
                        }
                        if (network.getLastPongTimestamp() < now)
                            return setTimeout(function () {
                                fun(cnt + 1);
                            }, 100);
                        if (now - _lastEnterBackTimestamp > network.getKeepAliveInterval() * 3 && networkId == network.getId()) {
                            network.fakeDisconect();
                        }
                    };
                    setTimeout(function () {
                        fun(0);
                    }, 100);
                }
            });

            window.enterBackListener = window.enterBackListener || cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
                this.lastEnterBackTimestamp = getCurTimestamp();
            });
        },
        onCCSLoadFinish: function () {
            if (!cc.sys.isNative) {
                this.initAfter();
                return;
            }
            // 重新加载utils
            cc.sys.cleanScript('src/common/utils.js');
            cc.sys.cleanScript('src/common/utils.jsc');
            cc.loader.loadJs(['src/common/utils.js'], this.initAfter.bind(this));

            this.lastEnterBackTimestamp = 0;
            this.installAppShowHideListener();
        },
        initAfter: function () {
            //test
            // console.log(pokerRule_NN.isShiXiao([1,2,3,4,2]));
            // console.log(pokerRule_NN.isSiShiDa([41,41,41,41,41]));
            // console.log(getCardZWMC([26,17,39,16,30]));
            // console.log(pokerRule_NN.checkNiu([26,17,39,16,30]));
            // this.addChild(new RotatingMenu(null, ['niuniu', 'pdk', 'psz', 'majiang']));
            // this.addChild(new ReplaceCardLayer());
            // var ccsScene = ccs.load(res['DN_niu' + 6 + "_json"], "res/");
            // var niuAction = ccsScene.node;
            // niuAction.setPosition(cc.p(200, 200));
            // niuAction.setName("niuAction");
            // this.addChild(niuAction);
            // niuAction.runAction(ccsScene.action);
            // ccsScene.action.play('action', false);

            window.inReview = false;
            window.inBanShu = false;
            window.nativeVersion = getNativeVersion();
            LocationManager.init();

            gameData.init();
            this.initIpList();

            //cc.spriteFrameCache.addSpriteFrames(res.card_plist);
            cc.spriteFrameCache.addSpriteFrames(res.card_common_plist);
            cc.sys.localStorage.setItem('save_native_version', getNativeVersion());

            var that = this;

            window.isQuickLogin = !!window.isQuickLogin;

            this.MAX_LOGIN_RETRY_CNT = 3;
            window.onEnterCnt = window.onEnterCnt || 0;
            window.udid = fetchUDID();
            if (window.onEnterCnt == 0 && cc.sys.isNative) {
                window.onEnterCnt++;
                var path = jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/');
                if (jsb.fileUtils.isFileExist(path + 'src/_files_.js')) {
                    if (cc.sys.os == cc.sys.OS_ANDROID) cc.loader.loadJs(path, 'src/_files_.js');
                    else cc.loader.loadJs('src/_files_.js');
                }
                if (jsb.fileUtils.isFileExist(path + 'src/_files_.jsc')) {
                    if (cc.sys.os == cc.sys.OS_ANDROID) cc.loader.loadJs(path, 'src/_files_.jsc');
                    else cc.loader.loadJs('src/_files_.jsc');
                }
                for (var i = 0; i < jsFiles.length; i++) {
                    if (jsFiles[i] == 'src/common/gameData.js')
                        continue;
                    var file = path + jsFiles[i];
                    if (jsb.fileUtils.isFileExist(file)) {
                        if (cc.sys.os == cc.sys.OS_ANDROID)
                            cc.loader.loadJs(path, jsFiles[i], function () {
                            });
                        else
                            cc.loader.loadJs(path, jsFiles[i], function () {
                            });
                    }

                    file += 'c';
                    if (jsb.fileUtils.isFileExist(file)) {
                        if (cc.sys.os == cc.sys.OS_ANDROID)
                            cc.loader.loadJs(path, jsFiles[i] + 'c', function () {
                            });
                        else
                            cc.loader.loadJs(path, jsFiles[i] + 'c', function () {
                            });
                    }
                }
            }


            App.run1();
            //加载音效
            if (!window.loadresflag) {
                window.loadresflag = true;
                addViewRes();
                addMusicRes();
                var t = [];
                for (var i = 0; i < g_resourcesMusic.length; i++) {
                    t.push(g_resourcesMusic[i]);
                    if (t.length == 10 || i == g_resourcesMusic.length - 1) {
                        cc.loader.load(_.clone(t), function () {
                        });
                        t = [];
                    }
                }
            }

            //静音启动
            var jingyinopen = cc.sys.localStorage.getItem('jingyinopen') || '1';
            if (jingyinopen == '1') {
                gameData.voiceFlag = true;
            } else {
                gameData.voiceFlag = false;
            }
            if (gameData.voiceFlag == false) {
                pauseMusic();
            }
            //普通话
            gameData.isPutonghua = cc.sys.localStorage.getItem('putonghua');
            if (gameData.isPutonghua == undefined || gameData.isPutonghua == null) gameData.isPutonghua = 0;
            //长沙话
            gameData.speakCSH = cc.sys.localStorage.getItem('speakCSH') || 0;
            if (gameData.speakCSH == undefined || gameData.speakCSH == null) gameData.speakCSH = 0;
            gameData.speakCSH = parseInt(gameData.speakCSH);
            //字体设置
            gameData.fontType = cc.sys.localStorage.getItem('fonttype');
            //位置共享
            gameData.isOpenLocation = cc.sys.localStorage.getItem('openlocation');
            //表情动画
            gameData.biaoQingFlag = cc.sys.localStorage.getItem('biaoqing') || 1;

            if (gameData.isOpenLocation == undefined || gameData.isOpenLocation == null) gameData.isOpenLocation = 1;

            playMusic('vbg1');

            var isNewPlayer = false;
            if (LD.get(LD.K_USER_NAME) == '') {
                isNewPlayer = true;
            }

            this.btWeiXin = getUI(this, 'btWeiXin');
            this.btWeiXin.setTag(1);
            this.btGuest = getUI(this, 'btGuest');
            this.btGuest.setTag(2);
            this.cbBox = getUI(this, 'cbBox');

            for (var i = 1; i <= 4; i++) {
                var btn = getUI(this, 'btn_youke' + i);
                (function (idx) {
                    TouchUtils.setOnclickListener(btn, function () {
                        gameData.clientId = idx + 12000 + '';
                        gameData.nickname = '' + gameData.clientId;
                        gameData.sex = 1;
                        gameData.province = '';
                        gameData.city = '';
                        gameData.country = '';
                        gameData.headimgurl = res.defaultHead;
                        gameData.unionid = gameData.clientId;
                        // gameData.unionid = 'ocuY30VLT8q7AxsqX3FcZ8x_KXqU';
                        that.reLogin();
                    });
                })(i);
                if (cc.sys.isNative) {
                    btn.setVisible(false);
                }
            }

            this.login_xieyi_3 = getUI(this, 'login_xieyi_3');
            TouchUtils.setOnclickListener(this.login_xieyi_3, function () {
                if (cc.sys.isNative) {
                    cc.sys.openURL('http://pay.bangshuiwang.com/protocol.html');
                } else {
                    window.open('http://pay.bangshuiwang.com/protocol.html', '_blank');
                }
            });

            //登录按钮不能连续点
            that.loginClose = false;

            this.btXianLiao = getUI(this, 'btXianLiao');
            TouchUtils.setOnclickListener(this.btXianLiao, function () {
                if (that.loginClose == false) {
                    that.loginClose = true;
                    that.xianLiaoFunction();
                }
                that.scheduleOnce(function () {
                    that.loginClose = false;
                }, 2);
            });

            this.btn_liaobei_login = getUI(this, 'btLiaobei');
            TouchUtils.setOnclickListener(this.btn_liaobei_login, function () {
                if (that.loginClose == false) {
                    that.loginClose = true;
                    that.liaoBeiFunction();
                }
                that.scheduleOnce(function () {
                    that.loginClose = false;
                }, 2);
            });

            TouchUtils.setOnclickListener(this.btWeiXin, function () {
                if (that.loginClose == false) {
                    that.loginClose = true;
                    that.weixinFunc();
                }
                that.scheduleOnce(function () {
                    that.loginClose = false;
                }, 2);
            });
            TouchUtils.setOnclickListener(this.btGuest, function () {
                gameData.loginType = 'yk';
                if (!that.cbBox.isSelected()) {
                    HUD.showMessageBox('提示', '请先同意用户协议', function () {
                    }, true);
                    return;
                }
                var tfUserId = getUI(that, 'tfUserId').getString();
                if (!cc.sys.isNative) {
                    if (tfUserId && (tfUserId.length == 6 || tfUserId.length == 5)) {
                        NetUtils.httpGet('http://auth.yygameapi.com:44440/niuniuAuth/unionid?UserID=' + tfUserId + '&sign=password',
                            function (response) {
                                var userInfo = JSON.parse(response);
                                gameData.unionid = userInfo['unionid'];
                                gameData.clientId = tfUserId;
                                gameData.nickname = '游客' + gameData.clientId;
                                gameData.sex = 1;
                                gameData.province = '';
                                gameData.city = '';
                                gameData.country = '';
                                gameData.headimgurl = userInfo.headimageurl;//res.defaultHead;
                                that.reLogin();
                                return;
                            });
                    }
                }
                if (tfUserId == null || tfUserId == '') tfUserId = fetchUDID() + 'A';
                // console.log("tfUserId" + tfUserId);
                gameData.clientId = tfUserId;
                gameData.nickname = '游客' + gameData.clientId;
                gameData.sex = 1;
                gameData.province = '';
                gameData.city = '';
                gameData.country = '';
                gameData.headimgurl = res.defaultHead;
                gameData.unionid = gameData.clientId;
                // gameData.unionid = 'ocuY30VgMyeA-Bo0djG3_RYv116I';
                that.reLogin();
            });
            //判断按没按微信,没按的话,不显示微信登录按钮
            if (cc.sys.isNative) {
                gameData.isWXAppInstalled = WXUtils.isWXAppInstalled();
                gameData.isXianLiaoAppInstalled = false;
                if (window.nativeVersion > '2.2.0') {
                    console.log('window.nativeVersion' + window.nativeVersion);
                    gameData.isXianLiaoAppInstalled = XianLiaoUtils.isXianLiaoAppInstalled();
                    gameData.isLBAppInstalled = LBUtils.isLBAppInstalled();
                }
                var tfUserId = getUI(this, 'tfUserId');
                tfUserId.setVisible(false);

                this.getVersion();
                SubUpdateUtils.saveLocalVersion('home', window.curVersion);
            }

            if (cc.sys.isNative == false || window.inReview) {
                this.btGuest.setVisible(true);
                this.btWeiXin.setVisible(false);
                this.btXianLiao.setVisible(false);
                this.btn_liaobei_login.setVisible(false);
                // this.btGuest.setPositionX(SW * 0.5);
            } else {
                if (window.nativeVersion <= '2.2.0') {
                    this.btGuest.setVisible(false);
                    this.btWeiXin.setVisible(true);
                    this.btWeiXin.setPositionX(SW * 0.5);
                    this.btXianLiao.setVisible(false);
                    this.btn_liaobei_login.setVisible(false);
                } else {
                    this.btGuest.setVisible(false);
                    this.btWeiXin.setVisible(true);
                    this.btXianLiao.setVisible(true);
                    this.btn_liaobei_login.setVisible(true);
                }
            }

            // if(true){
            //     this.btGuest.setVisible(true);
            //     this.btWeiXin.setVisible(true);
            //     this.btGuest.setPositionX(SW * 0.35);
            //     this.btWeiXin.setPositionX(SW * 0.65);
            //     var tfUserId = getUI(this, "tfUserId");
            //     tfUserId.setVisible(true);
            // }
            var xieyi = getUI(this, 'xieyi');
            xieyi.setVisible(!window.inReview);
            if (isNewPlayer == false) {
                //mAccount.login(LD.get(LD.K_USER_NAME), LD.get(LD.K_PASS_WORD));
            }

            if (gameData.hasLogined) {
                showLoading('正在返回游戏..');
                runAtNextFrame(function () {
                    this.reLogin();
                }, this);
            }

            if (typeof regBakBtn !== 'undefined')
                regBakBtn.call(this);

            if (gameData.errMessage) {
                HUD.showMessageBox('提示', gameData.errMessage, function () {
                }, true);
                gameData.errMessage = null;
            }

            //一键修复客户端
            // console.log(cc.loader);
            // HUD.showMessageBox("312321321312", "312312312", function(){}, true);
            this.btn_refresh = getUI(this, 'btn_refresh');
            this.btn_refresh.setScale(0.5);
            this.btn_refresh.setVisible(!window.inReview);
            TouchUtils.setOnclickListener(this.btn_refresh, function () {
                var that = this;

                var yjxfFunc = function () {
                    if (cc.sys.isNative) {
                        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'project.manifest');
                        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'project.manifest.tmp');
                        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'version.manifest');
                        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'version.manifest.tmp');
                        var scene = new UpdateScene();
                        scene.run();
                    }
                };
                yjxfFunc();
                // var layer = HUD.showLayer(HUD_LIST.MessageBox, HUD.getTipLayer(), null, true);
                // layer.setName("MessageBox");
                // layer.setData("提示", '确定要一键修复客户端', yjxfFunc, null);
            });

            //高防
            var playerLv = 0;//(cc.sys.localStorage.getItem('playerLv') || 'playerLv0').replace('playerLv', '');
            // HUD.showMessageBox('playerLv', playerLv, function(){}, true);
            this.slbIpCnt = 0;
            // gameData.ipList = ['116.211.167.162'];
            gameData.ipList = _.shuffle(gameData.ipList);

            (function () {
                var funcBak = (cc.sys.isNative ? ccui.Text.prototype._ctor : ccui.Text.prototype.ctor);
                ccui.Text.prototype.setFontRes = function (fontRes) {
                    var path = fontRes;
                    var fontName = '';
                    if (path != null) {
                        if (cc.sys.isNative) {
                            fontName = path;
                        } else {
                            fontName = path.substr(4).match(/([^\/]+)\.(\S+)/);
                            fontName = fontName ? fontName[1] : '';
                        }
                        this.setFontName(fontName);
                        //this.enableOutline(cc.color(0, 0, 0), 2);
                    }
                };
                // var func = function (textContent, fontName, fontSize) {
                //     funcBak.call(this, textContent, fontName, fontSize);
                //     this.setFontRes(res.default_ttf);
                // };
                var func = function (textContent, _fontName, fontSize) {
                    if (!fontSize) {
                        var path = res.default_ttf;
                        var fontName = '';
                        if (path != null) {
                            if (cc.sys.isNative) {
                                fontName = path;
                            } else {
                                fontName = path.substr(4).match(/([^\/]+)\.(\S+)/);
                                fontName = fontName ? fontName[1] : '';
                            }
                        }
                        // console.log('xxx ' + _fontName + ' ' + fontName);
                        funcBak.call(this, textContent || '', fontName, fontSize || 0);
                    }
                    else
                        funcBak.call(this, textContent || '', _fontName, fontSize || 0);
                };
                if (cc.sys.isNative)
                    ccui.Text.prototype._ctor = func;
                else
                    ccui.Text.prototype.ctor = func;
            })();

            network.setOnDisconnectListener(function () {
                if (mRoom.isReplay) {
                    mRoom.isReplay = false;
                    clearInterval(mRoom.interval);
                }
                network.removeAllListeners();
                HUD.showScene(HUD_LIST.Login);
            });

            network.addListener(2001, function (data) {
                var now = getCurTimestamp();
                if (now < 1500480000) {
                    gameData.free = '10000,0,1,2,3,4,5,6,7,8,9';
                }

                gameData.free = '10';
                gameData.hasLogined = true;
                gameData.uid = data.uid;
                gameData.numOfCards = data['numof_cards'];
                gameData.ip = data['ip'];
                gameData.isNew = data['is_new'];
                gameData.weixin = decodeURIComponent(data['weixin']);
                gameData.weixin2 = decodeURIComponent(data['weixin2']);
                gameData.triggers = data['triggers'] || [];
                gameData.map_conf = data['map_conf'] || {};
                gameData.opt_conf = data['opt_conf'] || {};
                gameData.refer = data['refer'];
                gameData.hasShiMing = data['hasShiMing'];
                gameData.o = data['create_time'] || '0';
                gameData.parent_id = data['parent_id'];

                if (data['jbUserDetail']) {
                    gameData.jbcData = data['jbUserDetail'];
                    //ps 添加金币场后，修改金币数据来源
                    if (gameData.numOfCards) {
                        gameData.numOfCards[0] = gameData.jbcData.jbNum || 0;
                    }
                    cc.log('jbUserDetail = ' + JSON.stringify(gameData.jbcData) || 'undefine');
                }

                //
                if (data['userDetail'])
                    gameData.BDIphone = data['userDetail']['mobile'];

                gameData.useNewClub = !!gameData.opt_conf['useNewClub'] ? true : false;
                gameData.useNewClub = true;

                //gaofang
                saveIpLists(data['server_address']);

                //定位
                if (gameData.isOpenLocation == 1 && window.inReview == false) {
                    if (!window.inReview) {
                        // LocationUtils.startLocation();
                        // window.isLocation = true;
                        if (!window.locationUtil) {
                            window.locationUtil = new LocationUtil();
                            locationUtil.startRefreshAddress();
                        }
                    }
                }

                var matchRate = gameData.opt_conf.ShowMatch || 0;
                var matchWhiteList = gameData.opt_conf.showMatch_whitelist || [];
                var mtflag1 = gameData.uid % 100 < matchRate ? true : false;
                var mtflag2 = (matchWhiteList.indexOf(gameData.uid)) >= 0 ? true : false;
                gameData.canMatch = mtflag1 || mtflag2;

                if (data['loc'] && window.locationUtil) {
                    var parts = data['loc'].split(',');
                    if (parts && parts.length == 2) {
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            locationUtil.longitude = parseFloat(parts[0]);
                            locationUtil.latitude = parseFloat(parts[1]);
                        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                            locationUtil.latitude = parseFloat(parts[0]);
                            locationUtil.longitude = parseFloat(parts[1]);
                        }
                    }
                    locationUtil.address = data['locCN'];
                }

                // gameData.opt_conf.link = 2;
                gameData.initMwLink(gameData.opt_conf.link);

                //春节活动
                gameData.newyear = gameData.opt_conf.newyear || false;
                // gameData.newyear = true;

                gameData.ts = (data['ts'] || '000') + '';
                if (gameData.ts && gameData.ts.length > 3) {
                    gameData.ts = gameData.ts[gameData.ts.length - 3];
                    cc.sys.localStorage.setItem('playerLv', 'playerLv' + gameData.ts);
                }
                cc.sys.localStorage.setItem('playero', gameData.o);

                var isReconnect = data['is_reconnect'];
                gameData.isNoticeMatch = isReconnect;
                if (!isReconnect) {
                    HUD.showScene(HUD_LIST.Home);
                }
            });

            network.addListener(3002, function (data, errorCode) {
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
                    HUD.showScene(HUD_LIST.Home);
                    return;
                }

                network.stop();

                mRoom.wanfatype = '';
                gameData.roomId = data['room_id'];
                gameData.mapId = data['map_id'];
                gameData.gold_room_lev = data["gold_room_lev"] || 1;
                gameData.gold_room_name = data["name"] || '新手场';
                gameData.gold_room_base = data["baseGold"] || 50;
                gameData.players = data['players'];
                gameData.ownerUid = data['owner'];
                gameData.wanfaDesp = data['desp'];
                gameData.playerNum = data['max_player_cnt'];
                gameData.daikaiPlayer = data['daikai_player'];
                gameData.curRound = data['cur_round'];
                gameData.totalRound = data['total_round'];
                gameData.leftRound = data['left_round'] ? data['left_round'] : data['total_round'] - 1;
                gameData.wanfaDesp = data['desp'];
                gameData.gold_room_lev = data["gold_room_lev"] || 1;

                mRoom.club_id = data['club_id'];
                if (!data['club_id'] && data['options']) {
                    var options = (_.isString(data['options']) ? JSON.parse(data['options']) : data['options']);
                    mRoom.club_id = options['club_id'];
                }

                gameData.matchId = data['match_id'] || 0;
                if (gameData.matchId) {
                    gameData.matchInfo = data['match_info'];
                    gameData.baseScore = data['init_base_score'] || 0;
                    gameData.playTime = data['play_time'] || 12;
                    if (gameData.matchId) {//自动准备
                        network.send(3004, {room_id: gameData.roomId});
                    }
                }

                gameData.curRound = gameData.totalRound - gameData.leftRound;

                if (data['options']) {
                    gameData.options = data['options'];
                    gameData.yunxujiaru = data['options']['yunxujiaru'];
                    if (data['options']['maxPlayerCnt']) {
                        gameData.playerNum = data['options']['maxPlayerCnt'];
                    }
                }
                SubUpdateUtils.showGameScene();

                // if(gameData.mapId == MAP_ID.PDK) {
                //     var maScene = new PuKeScene();
                //     cc.director.runScene(maScene);
                // }else if(gameData.mapId == MAP_ID.ZJH){
                //     cc.director.runScene(new ZJHScene());
                // }else{
                //     var maScene = new MaScene();
                //     cc.director.runScene(maScene);
                // }
            });
            network.addListener(3006, function (data) {
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
                gameData.totalRound = data['total_round'];
                gameData.curRound = data['cur_round'];
                gameData.leftRound = data['left_round'] ? data['left_round'] : data['total_round'] - 1;
                gameData.matchId = data['match_id'] || 0;
                gameData.options = data['options'];
                if (gameData.matchId) {
                    gameData.totalRound = data['total_round'];
                    gameData.matchInfo = data['match_info'];
                    gameData.baseScore = data['init_base_score'];
                    gameData.playTime = data['play_time'] || 12;
                }
                gameData.curRound = gameData.totalRound - gameData.leftRound;
                if (data['options']) {
                    gameData.yunxujiaru = data['options']['yunxujiaru'];
                    if (data['options']['maxPlayerCnt']) {
                        gameData.playerNum = data['options']['maxPlayerCnt'];
                    }
                }

                // if (gameData.mapId == MAP_ID.PDK) {
                //     var maScene = new PuKeScene(data);
                //     cc.director.runScene(maScene);
                // } else if (gameData.mapId == MAP_ID.ZJH) {
                //     cc.director.runScene(new ZJHScene(data));
                // } else {
                //     var maScene = new MaScene(data);
                //     cc.director.runScene(maScene);
                // }
                network.stop();
                SubUpdateUtils.showGameScene(data);
            });
            // todo
            network.addListener(2006, function (data) {
                var sub = data.key;
                var version = data.ver;
                var source = data.source;
                var url = data.url;
                showLoading('有新的' + sub + '版本:' + version + ',请更新中', true);
                if (sub == 'home') {
                    // var scene = new UpdateScene();
                    // scene.run();
                    return;
                }
                SubUpdateUtils.checkUpdate(url, sub, version, function () {
                    if (source === 'login') {
                        var data = {
                            openid: gameData.clientId,
                            nickname: gameData.nickname,
                            sex: gameData.sex,
                            province: gameData.province,
                            city: gameData.city,
                            country: gameData.country,
                            headimgurl: gameData.headimgurl,
                            unionid: gameData.unionid,
                            version: window.curVersion,
                            nativeVersion: window.nativeVersion,
                            isnative: (cc.sys.isNative ? 1 : 0),
                            os: (cc.sys.os == cc.sys.OS_IOS ? 'ios' : (cc.sys.os == cc.sys.OS_ANDROID ? 'android' : 'others')),
                            needComp: true
                        };
                        network.send(2001, data);
                    } else {
                        hideLoading();
                        alert1('有新的' + sub + '版本:' + version + ',请更新后进入');
                    }
                });
            });
            network.addListener(3007, function (data) {

            });

            network.addListener(4020, function (data) {

            });

            network.addCustomListener(101, function (event) {
                console.log("101 -------");
                var data = event.getUserData();
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
                    that.scheduleOnce(function () {
                        gameData.hasLogined = false;
                        network.disconnect();
                    }, 1);
                } else if (Result != null && Result == -1) {
                    var msg = (data.Head) ? data.Head.ErrorMsg : data.ErrorMsg;
                    HUD.showMessageBox('提示', msg, function () {
                        HUD.showScene(HUD_LIST.Login, this);
                    }, true);
                } else {
                    // if (mRoom.oldRoom != 0) {
                    network.stop();
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

                    // mRoom.wanfatype = mRoom.YOUXIAN;
                    // HUD.showScene(HUD_LIST.Room, that);
                    SubUpdateUtils.showGameScene(data);
                }
            });
            network.addCustomListener(601, function (event) {
                var data = event.getUserData();
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
                    that.scheduleOnce(function () {
                        gameData.hasLogined = false;
                        network.disconnect();
                    }, 1);
                } else if (Result != null && Result == -1) {
                    var msg = (data.Head) ? data.Head.ErrorMsg : data.ErrorMsg;
                    HUD.showMessageBox('提示', msg, function () {
                        HUD.showScene(HUD_LIST.Login, this);
                    }, true);
                } else {
                    // if (mRoom.oldRoom != 0) {
                    network.stop();

                    gameData.maxPlayerNum = 6;
                    var option = data.Option == '' ? {} : JSON.parse(decodeURIComponent(data.Option));
                    gameData.totalRound = option.rounds;
                    // gameData.wanfaDesp = option.desp || "";
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
                    // mRoom.owner = data.Owner;
                    mRoom.BeiShu = option.BeiShu;
                    mRoom.Preview = option.Preview;
                    mRoom.ZhuangMode = option.ZhuangMode;
                    mRoom.Is_ztjr = option.Is_ztjr;
                    mRoom.Cuopai = option.Cuopai;
                    mRoom.noColor = option.noColor;
                    mRoom.club_id = option.club_id;
                    if (option.Players == 'jiu') {
                        gameData.maxPlayerNum = 9;
                    }
                    network.stop();
                    SubUpdateUtils.showGameScene(data);
                }
            });
            BaseMessage.startReceive(2103);
            BaseMessage.startReceiveMatchMessage();

            //自动登录
            if (!window.isQuickLogin) {
                window.isQuickLogin = true;

                var openid = cc.sys.localStorage.getItem('xianliao_openid');
                if (openid && typeof openid === 'string' && openid.length > 0 && window.inReview == false) {
                    that.xianLiaoFunction();
                    return;
                }

                //lbopenid
                var openid = cc.sys.localStorage.getItem('lbopenid');
                if (openid && typeof openid === 'string' && openid.length > 0 && window.inReview == false) {
                    that.liaoBeiFunction();
                    return;
                }

                var openid = cc.sys.localStorage.getItem('openid');
                if (openid && typeof openid === 'string' && openid.length > 0 && window.inReview == false) {
                    that.weixinFunc();
                    return;
                }
            }

            var storage_statement = (cc.sys.localStorage.getItem('Storage_statement'));
            if (!storage_statement && !window.inReview) {
                var scene = ccs.load(res.FanDuLayer_json, 'res/');
                addModalLayer(scene.node);
                that.addChild(scene.node);
                scene.node.x = cc.winSize.width / 2;
                scene.node.y = cc.winSize.height / 2;
                scene.node.ignoreAnchorPointForPosition(false);
                scene.node.setAnchorPoint(cc.p(0.5, 0.5));
                var close = getUI(scene.node, 'close');
                TouchUtils.setOnclickListener(close, function () {
                    cc.sys.localStorage.setItem('Storage_statement', 1);
                    scene.node.removeFromParent(true);
                });
            }

            return true;
        },
        getVersion: function () {
            var nativeVersion = getNativeVersion() || '';
            var manifestUrl = 'res/project.manifest';
            var storagePath = cc.sys.writablePath;
            var manager = new jsb.AssetsManager(manifestUrl, storagePath);
            window.curVersion = manager.getLocalManifest().getVersion();
            // window.curVersion = '2.2.001';
            //版本号显示
            var lb_version = new ccui.Text();
            lb_version.setFontSize(24);
            lb_version.setTextColor(cc.color(255, 255, 255));
            lb_version.setPosition(1120, 55);
            lb_version.setAnchorPoint(cc.p(0, 0.5));
            lb_version.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
            lb_version.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.addChild(lb_version, 2);
            lb_version.setString(window.curVersion);
        },
        weixinFunc: function () {
            if (!this.cbBox.isSelected()) {
                HUD.showMessageBox('提示', '请先同意用户协议', function () {
                }, true);
                return;
            }
            var interval = null;
            var that = this;
            if (!gameData.isWXAppInstalled) {
                HUD.showMessage('您还没有安装微信哦');
                return;
            }

            var appId = WXUtils.getAppid();
            var wxToken = cc.sys.localStorage.getItem('wxToken');
            var openid = cc.sys.localStorage.getItem('openid');
            var time = getCurTimeMillisecond();

            if (!wxToken || typeof wxToken === 'string' && wxToken.length == 0) {
                showLoading();
                WXUtils.redirectToWeixinLogin();
                if (interval) {
                    clearInterval(interval);
                } else {
                    interval = setInterval(function () {
                        var code = WXUtils.getWXLoginCode();
                        if (code && typeof code === 'string' && code.length > 0 && code != 'null') {
                            clearInterval(interval);
                            var sign = Crypto.MD5('request:/niuniuAuth/WeichatCode?Code=' + code + '&time=' + time);
                            var url = 'http://auth.yygameapi.com:44440/niuniuAuth/WeichatCode?Code=' + code + '&time=' + time + '&sign=' + sign + '';
                            // console.log("请求微信:" + url);
                            NetUtils.httpGet(url, function (response) {
                                HUD.showLoading();
                                var userInfo = JSON.parse(response);
                                // alert0("ss", userInfo['at']+"======"+userInfo.openid);
                                cc.sys.localStorage.setItem('wxToken', userInfo['at']);

                                cc.sys.localStorage.setItem('openid', userInfo.openid);
                                cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
                                cc.sys.localStorage.setItem('sex', userInfo.sex);
                                cc.sys.localStorage.setItem('province', userInfo.province);
                                cc.sys.localStorage.setItem('city', userInfo.city);
                                cc.sys.localStorage.setItem('country', userInfo.country);
                                cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl);
                                cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                                that.login(response);
                            });
                        }
                    }, 300);
                }

            } else if (openid && typeof openid === 'string' && openid.length > 0) {
                HUD.showLoading();
                var response = {
                    openid: cc.sys.localStorage.getItem('openid'),
                    nickname: decodeURIComponent(cc.sys.localStorage.getItem('nickname')),
                    sex: cc.sys.localStorage.getItem('sex'),
                    province: cc.sys.localStorage.getItem('province'),
                    city: cc.sys.localStorage.getItem('city'),
                    country: cc.sys.localStorage.getItem('country'),
                    headimgurl: cc.sys.localStorage.getItem('headimgurl'),
                    unionid: cc.sys.localStorage.getItem('unionid')
                };
                that.login(JSON.stringify(response));
            } else {
                var sign = Crypto.MD5('request:/niuniuAuth/WeichatToken?AccessToken=' + accessToken + '&time=' + time);
                var url = 'http://auth.yygameapi.com:44440/niuniuAuth/WeichatToken?AccessToken=' + accessToken + '&time=' + time + '&sign=' + sign + '';
                // console.log("请求微信:" + url);
                NetUtils.httpGet(url, function (response) {
                    HUD.showLoading();
                    var userInfo = JSON.parse(response);
                    if (userInfo.result == -10) {
                        cc.sys.localStorage.removeItem('wxToken');
                        HUD.showMessage('您的微信授权信息已失效, 请重新登录');
                    } else {
                        cc.sys.localStorage.setItem('openid', userInfo.openid);
                        cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
                        cc.sys.localStorage.setItem('sex', userInfo.sex);
                        cc.sys.localStorage.setItem('province', userInfo.province);
                        cc.sys.localStorage.setItem('city', userInfo.city);
                        cc.sys.localStorage.setItem('country', userInfo.country);
                        cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl);
                        cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                        that.login(response);
                    }
                });
            }
        },
        onWeixinLogin: function (sender, type) {
            var ok = touch_process(sender, type);
            if (ok) {
                this.weixinFunc();
            }
        },
        setTs: function () {
            if (gameData.ts && gameData.ts.length > 3) {
                gameData.ts = gameData.ts[gameData.ts.length - 3];
                cc.sys.localStorage.setItem('playerLv', 'playerLv' + gameData.ts);
            }
        },
        reLogin: function (retryCnt) {
            if (!gameData.clientId) {
                return;
            }
            showLoading('正在登录');
            var that = this;
            var ipList = this.ipList;
            retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;

            var ip = ipList[parseInt(retryCnt) % ipList.length];
            if (_.startsWith(ip, 'yxd:')) {
                var yxd = ip.substr(4);
                ip = getNextIp2(yxd);
                if (ip && /\d+\.\d+\.\d+\.\d+/.test(ip)) {

                }
                else {
                    that.reLogin(++retryCnt);
                    return;
                }
            }
            if (!cc.sys.isNative) {
                window.curVersion = '2.4.0.050';
            }
            var version = window.curVersion;
            if (window.inReview) {
                version = '3.0.0';
            }
            if (network.isAlive()) {
                network.disconnect();
            }
            var time2001 = getCurrentTimeMills();
            network.connect(gameData.clientId, function () {
                var data = {
                    last_retry: that.last_retry,
                    openid: gameData.clientId,
                    nickname: gameData.nickname,
                    sex: gameData.sex,
                    province: gameData.province,
                    city: gameData.city,
                    country: gameData.country,
                    headimgurl: gameData.headimgurl,
                    unionid: gameData.unionid,
                    version: version,
                    nativeVersion: window.nativeVersion,
                    isnative: (cc.sys.isNative ? 1 : 0),
                    os: (cc.sys.os == cc.sys.OS_IOS ? 'ios' : (cc.sys.os == cc.sys.OS_ANDROID ? 'android' : 'others')),
                    needComp: true,
                    endpoint: ip,
                    connectTime: (getCurrentTimeMills() - time2001) / 1000,
                };
                network.send(2001, data);
            }, function () {
                that.last_retry++;
                if (retryCnt < ipList.length) {
                    retryCnt++;

                    that.reLogin(retryCnt);

                    showLoading('正在进行第' + retryCnt + '次重试');
                }
                else {
                    cc.sys.localStorage.setItem('ipList', '');
                    hideLoading();
                    alert2('登录失败', function () {
                        console.log('登陆失败，重新去iplist');
                        that.initIpList();
                    }, function () {

                    }, true);
                }
            }, ip);
        },

        loginXL: function (response) {
            showLoading('正在登录');
            var userInfo = _.isString(response) ? JSON.parse(response) : response;
            gameData.loginType = 'xl';
            // cc.sys.localStorage.setItem('openid', userInfo.xianliao.openId);
            // cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.xianliao.nick));
            // cc.sys.localStorage.setItem('headimgurl', userInfo.xianliao.smallPic);

            gameData.clientId = userInfo.xianliao.openId;
            gameData.nickname = userInfo.xianliao.nick;
            gameData.sex = userInfo.sex;
            gameData.city = userInfo.city;
            gameData.country = userInfo.country;
            gameData.headimgurl = userInfo.xianliao.smallPic;
            gameData.unionid = userInfo.unionid;
            this.reLogin();

        },
        loginCX: function (response) {
            showLoading('正在登录');
            var userInfo = _.isString(response) ? JSON.parse(response) : response;
            gameData.loginType = 'xl';
            gameData.clientId = userInfo.liaobei.openId;
            gameData.nickname = userInfo.liaobei.nick;
            gameData.sex = userInfo.sex;
            gameData.city = userInfo.city;
            gameData.country = userInfo.country;
            gameData.headimgurl = userInfo.liaobei.smallPic;
            gameData.unionid = userInfo.unionid;
            this.reLogin();

        },
        login: function (response) {
            showLoading('正在登录');

            var userInfo = _.isString(response) ? JSON.parse(response) : response;

            gameData.loginType = 'wx';

            gameData.clientId = userInfo.openid;
            gameData.nickname = userInfo.nickname;
            gameData.sex = userInfo.sex;
            gameData.province = userInfo.province;
            gameData.city = userInfo.city;
            gameData.country = userInfo.country;
            gameData.headimgurl = userInfo.headimgurl;
            gameData.unionid = userInfo.unionid;

            this.reLogin();

        },

        //游客登陆  去掉socket连接
        onGuest: function (sender, type) {
            var ok = touch_process(sender, type);
            if (ok) {
                var that = this;
                if (!this.cbBox.isSelected()) {
                    HUD.showMessageBox('提示', '请先同意用户协议', function () {
                    }, true);
                    return;
                }
                gameData.loginType = 'yk';
                this.reLogin();
            }
        },
        isConnect: function () {
            HUD.showScene(HUD_LIST.Home, this);
        },

        liaoBeiFunction: function () {
            if (!this.cbBox.isSelected()) {
                HUD.showMessageBox('提示', '请先同意用户协议', function () {
                }, true);
                return;
            }
            var interval = null;
            var that = this;
            console.log('gameData.isLBAppInstalled -- >>' + gameData.isLBAppInstalled);
            if (!gameData.isLBAppInstalled) {

                if (cc.sys.isNative) {
                    cc.sys.openURL('https://www.liaobe.cn/');
                } else {
                    window.open('https://www.liaobe.cn/', '_blank');
                }
                alert0('提示', '您还没有安装聊呗哦');
                return;
            }

            var openid = cc.sys.localStorage.getItem('lbopenid');
            var cxToken = cc.sys.localStorage.getItem('cxtoken');
            console.log('openid -- >>' + openid);

            if (!cxToken || !openid || openid.length == 0) {
                LBUtils.redirectToLiaoBeiLogin();
                showLoading();
                if (interval)
                    clearInterval(interval);
                interval = setInterval(function () {
                    var code = LBUtils.getLBLoginCode();
                    console.log('LBUtils =>' + code);
                    if (code) {
                        clearInterval(interval);
                        console.log('LBUtils  sprin1 =>' + code);
                        var time = getCurTimeMillisecond();
                        var sign = Crypto.MD5('request:/niuniuAuth/LiaobeiCode?Code=' + code + '&time=' + time);

                        //http://10.10.20.139:8081/xiaoyaopkAuth/LiaobeiCode
                        //TODO 这里替换成自己的地址
                        var url = 'http://auth.yygameapi.com:44440/niuniuAuth/LiaobeiCode?Code=' + code + '&time=' + time + '&sign=' + sign + '';
                        console.log('url =  ' + url);
                        NetUtils.httpGet(url, function (response) {
                            showLoading('加载中...');
                            console.log('=====' + response);
                            var userInfo = JSON.parse(response);
                            if (userInfo.result != null) {
                                console.log(userInfo);
                                if (userInfo.result == 2) {
                                    //拉起微信请求
                                    that.otherToWeixinFunction(userInfo.data, 'LiaobeiData');
                                } else if (userInfo.result == 0) {
                                    cc.sys.localStorage.setItem('lbopenid', userInfo.liaobei.openId);
                                    cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.liaobei.nick));
                                    var smallPic = userInfo.liaobei.smallPic;
                                    if (smallPic.indexOf('90_90') < 0 && smallPic.indexOf('scale') < 0) {
                                        var arr = smallPic.split('.');
                                        arr[arr.length - 2] = arr[arr.length - 2] + '_center_90_90';
                                        userInfo.liaobei.smallPic = arr.join('.');
                                    }
                                    cc.sys.localStorage.setItem('headimgurl', userInfo.liaobei.smallPic);

                                    // cc.sys.localStorage.setItem('headimgurl', userInfo.liaobei.smallPic + "#");

                                    cc.sys.localStorage.setItem('sex', userInfo.sex);
                                    cc.sys.localStorage.setItem('province', userInfo.province);
                                    cc.sys.localStorage.setItem('city', userInfo.city);
                                    cc.sys.localStorage.setItem('country', userInfo.country);
                                    cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                                    cc.sys.localStorage.setItem('cxToken', 'true');
                                    that.loginCX(userInfo);
                                } else if (userInfo.result == 1) {

                                } else {
                                    hideLoading();
                                    clearInterval(interval);
                                }
                            }
                        }, function (error, text) {
                            console.log('失败error:' + error);
                            console.log('失败text:' + text);
                            if (error) alert1('登陆失败!' + text);
                            hideLoading();
                            clearInterval(interval);
                        });
                    } else {
                        // alert1("登陆失败!");
                        // hideLoading();
                        // clearInterval(interval);
                    }
                }, 300);
            }
            else if (openid && cxToken) {
                showLoading('加载中...');
                var response = {
                    openid: cc.sys.localStorage.getItem('lbopenid'),
                    nickname: decodeURIComponent(cc.sys.localStorage.getItem('nickname')),
                    sex: cc.sys.localStorage.getItem('sex'),
                    province: cc.sys.localStorage.getItem('province'),
                    city: cc.sys.localStorage.getItem('city'),
                    country: cc.sys.localStorage.getItem('country'),
                    headimgurl: cc.sys.localStorage.getItem('headimgurl'),
                    unionid: cc.sys.localStorage.getItem('unionid')
                };
                that.login(JSON.stringify(response));
            }
            else {

            }
        },
        //拉起闲聊登陆
        xianLiaoFunction: function () {
            if (!this.cbBox.isSelected()) {
                HUD.showMessageBox('提示', '请先同意用户协议', function () {
                }, true);
                return;
            }
            var interval = null;
            var that = this;
            if (!gameData.isXianLiaoAppInstalled) {
                HUD.showMessage('您还没有安装闲聊哦');
                return;
            }

            var openid = cc.sys.localStorage.getItem('xianliao_openid');
            if (!openid || openid.length == 0) {
                XianLiaoUtils.redirectToXianLiaoLogin();
                showLoading();
                if (interval)
                    clearInterval(interval);
                interval = setInterval(function () {
                    var state = XianLiaoUtils.getXianLiaoLoginState();
                    if (state == 0) {
                        var code = XianLiaoUtils.getXianLiaoLoginCode();
                        if (code != 'null') {
                            clearInterval(interval);
                            // console.log("sprin1");
                            var time = getCurTimeMillisecond();
                            var sign = Crypto.MD5('request:/niuniuAuth/XianLiaoCode?Code=' + code + '&time=' + time);
                            var url = 'http://auth.yygameapi.com:44440/niuniuAuth/XianLiaoCode?Code=' + code + '&time=' + time + '&sign=' + sign + '';
                            // console.log("编码:" + Crypto.MD5("081N8zI12LrvB01jlZI12ePjI12N8zIi")   + "   原声code:N8zI12LrvB01jlZI12ePjI12N8zIi ");
                            NetUtils.httpGet(url, function (response) {
                                HUD.showLoading();
                                // console.log("闲聊数据:" + response);
                                var userInfo = JSON.parse(response);
                                if (userInfo.result != null) {
                                    if (userInfo.result == 2) {
                                        //拉起微信请求
                                        that.xianLiaoWeixinFunction(userInfo.data);
                                    } else if (userInfo.result == 0) {
                                        //可以直接登陆
                                        // cc.sys.localStorage.setItem('openid', userInfo.openid);
                                        // cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
                                        // cc.sys.localStorage.setItem('sex', userInfo.sex);
                                        // cc.sys.localStorage.setItem('province', userInfo.province);
                                        // cc.sys.localStorage.setItem('city', userInfo.city);
                                        // cc.sys.localStorage.setItem('country', userInfo.country);
                                        // cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl);
                                        // cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                                        // that.login(userInfo);
                                        cc.sys.localStorage.setItem('xianliao_openid', userInfo.xianliao.openId);
                                        cc.sys.localStorage.setItem('xianliao_nickname', encodeURIComponent(userInfo.xianliao.nick));
                                        cc.sys.localStorage.setItem('xianliao_headimgurl', userInfo.xianliao.smallPic + '#');
                                        cc.sys.localStorage.setItem('sex', userInfo.sex);
                                        cc.sys.localStorage.setItem('province', userInfo.province);
                                        cc.sys.localStorage.setItem('city', userInfo.city);
                                        cc.sys.localStorage.setItem('country', userInfo.country);
                                        cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                                        that.loginXL(userInfo);
                                    } else if (userInfo.result == 1) {

                                    }
                                }
                            }, function (error, text) {
                                console.log('失败error:' + error);
                                console.log('失败text:' + text);
                            });
                        }
                    } else if (state == -1) {
                        HUD.showMessage('登陆失败!');
                        HUD.removeLoading();
                        clearInterval(interval);
                    }
                }, 300);
            }
            else if (openid) {
                HUD.showLoading();
                var response = {
                    openid: cc.sys.localStorage.getItem('xianliao_openid'),
                    nickname: decodeURIComponent(cc.sys.localStorage.getItem('xianliao_nickname')),
                    sex: cc.sys.localStorage.getItem('sex'),
                    province: cc.sys.localStorage.getItem('province'),
                    city: cc.sys.localStorage.getItem('city'),
                    country: cc.sys.localStorage.getItem('country'),
                    headimgurl: cc.sys.localStorage.getItem('xianliao_headimgurl'),
                    unionid: cc.sys.localStorage.getItem('unionid')
                };
                var that = this;
                that.login(JSON.stringify(response));
            }
            else {
            }
        },
        otherToWeixinFunction: function (data, dataKey) {
            var interval = null;
            var that = this;
            dataKey = dataKey || 'Data';
            WXUtils.redirectToWeixinLogin();
            showLoading('加载中...');
            if (interval)
                clearInterval(interval);
            interval = setInterval(function () {
                var code = WXUtils.getWXLoginCode();
                console.log('code = ' + code);
                if (code != 'null') {
                    clearInterval(interval);
                    var time = getCurTimeMillisecond();
                    //TODO 这里替换成自己的地址
                    //http://10.10.20.139:8081
                    var sign = Crypto.MD5('request:/niuniuAuth/WeichatCode?Code=' + code + '&time=' + time + '&' + dataKey + '=' + data);
                    var url = 'http://auth.yygameapi.com:44440/niuniuAuth/WeichatCode?Code=' + code + '&time=' + time + '&' + dataKey + '=' + data + '&sign=' + sign + '';
                    NetUtils.httpGet(url, function (response) {
                        showLoading('加载中...');
                        var userInfo = JSON.parse(response);
                        cc.sys.localStorage.setItem('openid', userInfo.openid);
                        cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
                        cc.sys.localStorage.setItem('sex', userInfo.sex);
                        cc.sys.localStorage.setItem('province', userInfo.province);
                        cc.sys.localStorage.setItem('city', userInfo.city);
                        cc.sys.localStorage.setItem('country', userInfo.country);
                        cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl || '');
                        cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                        that.login(response);
                    });
                }
            }, 300);

        },
        xianLiaoWeixinFunction: function (data) {
            var interval = null;
            var that = this;

            WXUtils.redirectToWeixinLogin();
            showLoading();
            if (interval)
                clearInterval(interval);
            interval = setInterval(function () {
                var code = WXUtils.getWXLoginCode();
                if (code != 'null') {
                    clearInterval(interval);
                    var time = getCurTimeMillisecond();
                    var sign = Crypto.MD5('request:/niuniuAuth/WeichatCode?Code=' + code + '&time=' + time + '&Data=' + data);
                    var url = 'http://auth.yygameapi.com:44440/niuniuAuth/WeichatCode?Code=' + code + '&time=' + time + '&Data=' + data + '&sign=' + sign + '';
                    // console.log("请求微信:" + url);
                    NetUtils.httpGet(url, function (response) {
                        HUD.showLoading();
                        var userInfo = JSON.parse(response);
                        cc.sys.localStorage.setItem('openid', userInfo.openid);
                        cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
                        cc.sys.localStorage.setItem('sex', userInfo.sex);
                        cc.sys.localStorage.setItem('province', userInfo.province);
                        cc.sys.localStorage.setItem('city', userInfo.city);
                        cc.sys.localStorage.setItem('country', userInfo.country);
                        cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl);
                        cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                        that.login(response);
                    });
                }
            }, 300);
        }
    });
    exports.CoverLayer = CoverLayer;
})(window);
