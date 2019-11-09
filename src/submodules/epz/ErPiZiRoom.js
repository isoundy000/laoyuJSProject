/**
 * 二皮子玩法
 * Created by duwei on 2018/7/13.
 */

/**
 * 添加屏蔽层
 * @public
 * */

if (!window.addModalLayer) {
    window.addModalLayer = function (target) {
        var modalLayer = new ccui.Layout();
        modalLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        modalLayer.setBackGroundColor(cc.color('#1A1A1A'));
        modalLayer.setSwallowTouches(true);
        modalLayer.setTouchEnabled(true);
        modalLayer.setContentSize(cc.winSize);
        modalLayer.setAnchorPoint(cc.p(0.5, 0.5));
        modalLayer.x = target.width / 2;
        modalLayer.y = target.height / 2;
        modalLayer.ignoreAnchorPointForPosition(false);
        modalLayer.setBackGroundColorOpacity(Math.floor(255 * 0.6));
        target.addChild(modalLayer, -1);
    };
}

var ErPiZiRoom = cc.Layer.extend({
    data: null,
    isReconnect: null,
    isReplay: null,
    initPaiNum: 2,
    originalPos: 1,
    playerNums: 8,
    roomStatus: {
        CREATED: 1,  // 刚创建
        PREPARING: 5,// 准备阶段
        ONGOING: 2,   // 正在游戏
        GAMEOVER: 3, // 游戏结束
        ENDED: 4     // 房间解散
    },
    roomState: 1,
    playerStatus: {
        WAITING: 0,          // 等待
        NEEDTOPREPARE: 1,    // 需要准备
        PREPARED: 2,        // 已准备
        PLAYING: 3,          // 正在游戏
        ONLOOKING: 4,        // 围观
        NULL: 5
    },
    gameStatus: {
        NONE: 0,
        BOBO: 1,//设置簸簸数
        FAPAI: 2,//发牌
        XIAZHU: 3,//第一轮下注
        FAPAI2: 4,//发第二张牌
        LIANGPAI: 5,//等待亮牌/搓牌
        XIAZHU2: 6,//第二轮下注
        BIPAI: 7,//比牌
        END: 8//本局结束
    },
    selfStatus: 0,
    opType: {
        NONE: 0,
        GEN: 1,
        DA: 2,
        DIU: 3,
        BI: 4,
        QIAO: 5
    },
    cardType: {
        NODE: 0,         //无
        SANPAI: 1,       //散牌
        JIASANPI: 2,     //假三皮
        ZHANSANPI: 3    //真三皮
    },
    uid2position: {},
    uid2playerInfo: {},
    position2uid: {},
    position2sex: {},
    position2playerArrIdx: {},
    playUrlVoice: function (row, type, content, voice, uid) {
        var url = decodeURIComponent(content);
        var arr = null;
        if (url.indexOf('.aac') >= 0) {
            arr = url.split(/\.aac/)[0].split(/-/);
        } else if (url.indexOf('.spx') >= 0) {
            arr = url.split(/\.spx/)[0].split(/-/);
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
    playVoiceQueue: function () {
        var self = this;
        var queue = window.soundQueue[0];
        if (queue && queue.url && queue.duration && _.isNumber(queue.row)) {
            if (queue.url.indexOf('.aac') >= 0) {
                VoiceUtils.play(queue.url);
            } else if (queue.url.indexOf('.spx') >= 0) {
                OldVoiceUtils.playVoiceByUrl(queue.url);
            }

            var row = queue.row;
            var duration = queue.duration;
            var innerNodes = [];
            var ChatInfo = self.getChatInfoNode(row);
            if (!ChatInfo) {
                return;
            }
            var Children = ChatInfo.getChildren();
            for (var i = 0; i < Children.length; i++) {
                Children[i].setVisible(false);
            }
            var yuyin = ChatInfo.getChildByName("yuyin");
            yuyin.setVisible(true);

            var speakerNode = yuyin.getChildByName("pos");
            var resPath = epz_res['ChatSpeaker'];
            if (!speakerNode.getChildByName(resPath)) {
                speakerNode.removeAllChildren();
                playAnimScene(speakerNode, resPath, 0, 0, true);
            }
            innerNodes.push(yuyin);
            ChatInfo.stopAllActions();
            ChatInfo.setVisible(true);
            ChatInfo.setOpacity(255);

            ChatInfo.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));

            setTimeout(function () {
                window.soundQueue.shift();
                self.playVoiceQueue();
            }, queue.duration * 1000);
        }
    },

    showChat: function (row, uid, type, content, voice) {
        var self = this;
        if (type == 'voice') {
            var url = decodeURIComponent(content);
            if (url && url.split(/\.spx/).length > 2)
                return;
        }

        if (type == 'voice') {
            self.playUrlVoice(row, type, content, voice);
            return;
        }
        var ChatInfo = self.getChatInfoNode(row);
        if (!ChatInfo) {
            return;
        }
        var Children = ChatInfo.getChildren();
        for (var i = 0; i < Children.length; i++) {
            Children[i].setVisible(false);
        }
        var duration = 4;
        var innerNodes = [];
        if (type == 'emoji') {
            var scale9sprite = ChatInfo.getChildByName("qp");
            scale9sprite.setCascadeOpacityEnabled(false);
            scale9sprite.setOpacity(0);
            scale9sprite.setVisible(true);
            var text = scale9sprite.getChildByName("text");
            if(text)  text.setVisible(false);

            //表情动画
            if (content.indexOf("sp_") == 0) {
                var sprite = scale9sprite.getChildByName('emoji');
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
        else if (type === 'text' || type === 'leave' || type === 'back') {
            if (type === 'leave') {//玩家离开
                network.selfRecv({
                    "code": 4020,
                    "data": {"room_id": gameData.roomId, "uid": uid, "is_offline": 1, "left_time": 0}
                })
            } else if (type === 'back') {//玩家回来
                network.selfRecv({
                    "code": 4020,
                    "data": {"room_id": gameData.roomId, "uid": uid, "is_offline": 0, "left_time": 0}
                })
            }
            var spriteBg = ChatInfo.getChildByName("qp");
            spriteBg.setVisible(true);
            var text = spriteBg.getChildByName("text");
            var tmptext = new ccui.Text();
            tmptext.setFontRes(text.getFontName());
            tmptext.setFontSize(text.getFontSize());
            tmptext.setTextColor(cc.color(0, 0, 0));
            tmptext.enableOutline(cc.color(255, 255, 255), 1);
            tmptext.setString(content);
            var data = ChatInfo.getUserData();
            if (!data) {
                data = {
                    initWidth: spriteBg.getContentSize().width,
                    initpos: text.getPositionX(),
                };
                ChatInfo.setUserData(data);
            }
            var textSize = cc.size(tmptext.getContentSize().width, text.getContentSize().height);
            var size = cc.size(textSize.width + (data.initpos - data.initWidth / 2 != 0 ? 60 : 50), spriteBg.getContentSize().height);
            spriteBg.setContentSize(size);
            text.setContentSize(textSize);
            text.setString(content);
            text.setVisible(true);
            text.setPositionX(size.width / 2 + (data.initpos - data.initWidth / 2));
            innerNodes.push(spriteBg);
        }else if (type == 'biaoqingdonghua') {
            var data = JSON.parse(content);

            //关闭表情  只能看到自己给别的  看不到别人给自己的
            var scale9sprite = ChatInfo.getChildByName("qp");
            if (gameData.biaoQingFlag == 0 && !(data.from_uid == gameData.uid && data.target_uid != gameData.uid)) {
                scale9sprite.setVisible(false);
                return;
            }
            scale9sprite.setVisible(false);
            network.selfRecv({'code': 4990, 'data': data});
            return;
        }

        ChatInfo.stopAllActions();
        ChatInfo.setVisible(true);
        ChatInfo.setOpacity(255);

        ChatInfo.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
            for (var i = 0; i < innerNodes.length; i++)
                innerNodes[i].setVisible(false);
        })));

        for (var i = 0; i < innerNodes.length; i++) {
            var innerNode = innerNodes[i];
            innerNode.stopAllActions();
            innerNode.setVisible(true);
            innerNode.setOpacity(255);
            innerNode.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5)));
        }
        if (voice && !window.inReview)
            playEffect(voice);
    },
    onEnter: function () {
        var self = this;
        cc.Layer.prototype.onEnter.call(this);
        self.addNetWork()
    },
    onExit: function () {
        network.removeListeners([
            3002, 3003, 3004, 3005, 3008, 3009, 3200,
            4000, 4001, 4002, 4003, 4004, 4008, 4009, 4020, 4200, 4201, 4202, 4500, 4503
        ]);

        if (this.list2103) cc.eventManager.removeListener(this.list2103);
        if (this.list1) cc.eventManager.removeListener(this.list1);
        if (this.list2) cc.eventManager.removeListener(this.list2);

        cc.Layer.prototype.onExit.call(this);
    },
    getRoomState: function () {
        return this.roomState;
    },
    //网络
    addNetWork: function () {
        var self = this;
        //加入房间
        network.addListener(3002, function (data) {
            hideLoading();
            network.stop();
            gameData.last3002 = data;
            gameData.ownerUid = data["owner_uid"];
            gameData.masterUid = data["master"];
            gameData.players = data["players"];
            gameData.roomId = data['room_id'];
            self.is_club = data["is_club"];
            self.onPlayerEnter(self.curPlayerNum);
            self.setRoomState(data["room_status"]);
        });
        network.addListener(3006, function (data) {
            hideLoading();
            network.stop();
            self.setReplayData(data);
            self.initData();
            gameData.players = data["players"];
            self.clearTable();
            self.onPlayerEnter();
            var status = self.data["room_status"] || self.roomStatus.ONGOING;
            if (status == self.roomStatus.ENDED) {
                self.setRoomState(self.roomStatus.ONGOING);
                self.setRoomState(self.roomStatus.ENDED);
            } else {
                self.setRoomState(status);
            }
            self.StartGame();
        });
        //退出房间，
        network.addListener(3003, function (data) {
            var uid = data["uid"];
            if (uid == self.uid) {
                HUD.showScene(HUD_LIST.Home, null);
                if (data['is_kick']) {
                    setTimeout(function () {
                        alert1("您被【" + self.uid2playerInfo[gameData.ownerUid].nickname + "】踢出房间");
                    }, 100);
                }
                return;
            }
            if (data['is_kick']) {
                if (self.uid != gameData.ownerUid) {
                    setTimeout(function () {
                        alert1("【" + self.uid2playerInfo[uid].nickname + "】被【" + self.uid2playerInfo[gameData.ownerUid].nickname + "】踢出房间");
                    }, 100);
                }
            }

            if (data["del_room"]) {
                var owner = self.uid2playerInfo[gameData.ownerUid];
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
                self.setPlayerData();
                if (self['_FunctionBtnUnit']["btn_begin"].isVisible()) {
                    self['_FunctionBtnUnit']["btn_begin"].setVisible(gameData.players.length > 1);
                }
            }
        });
        //准备
        network.addListener(3004, function (data) {
            if (data && data["uid"]) {
                var uid = data["uid"];
                self.setReady(uid);
            }
        });
        network.addListener(3008, function (data) {
            var uid = data['uid'];
            var type = data['type'];
            var voice = data['voice'];
            var content = decodeURIComponent(data['content']);
            self.showChat(self.getRowByUid(uid), uid, type, content, voice);
        });
        //刷房卡
        network.addListener(3013, function (data) {
            gameData.numOfCards = data["numof_cards"];
        });
        network.addListener(3005, function (data) {
        });
        //解散房间
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
                var shenqingjiesanLayer = self.getChildByName('shenqingjiesan');
                if (shenqingjiesanLayer)
                    shenqingjiesanLayer.removeFromParent();
                alert1("经玩家" + nicknameArr.join(",") + "同意, 房间解散成功", function () {
                });

                self.scheduleOnce(function () {
                    var tipLayer = HUD.getTipLayer();
                    if (tipLayer) {
                        var MessageBox = tipLayer.getChildByName('MessageBox');
                        if (MessageBox) MessageBox.removeFromParent();
                    }
                }, 2);
            }
            else if (refuseUid) {
                var shenqingjiesanLayer = self.getChildByName('shenqingjiesan');
                if (shenqingjiesanLayer)
                    shenqingjiesanLayer.removeFromParent();
                alert1("由于玩家【" + gameData.playerMap[refuseUid].nickname + "】拒绝，房间解散失败，游戏继续");
            }
            else {
                var byUserId = data['arr'][0].uid;

                var shenqingjiesanLayer = self.getChildByName('shenqingjiesan');
                if (!shenqingjiesanLayer) {
                    shenqingjiesanLayer = new ShenqingjiesanLayer();
                    shenqingjiesanLayer.setName("shenqingjiesan");
                    self.addChild(shenqingjiesanLayer, 2);
                }
                shenqingjiesanLayer.setArrMajiang(leftSeconds, arr, byUserId, data, true);
            }
        });

        network.addListener(3011, function (data) {

        });
        network.addListener(4007, function (data, errorCode) {
            if (errorCode == -10) {
                if (data['msg']) {
                    HUD.showMessage(data['msg']);
                }
                return;
            }
            var row = self.uid2position[data['uid']];
            if (!self.isReplay && self.isExist && row == self.originalPos) {
                gameData.trusteeship = data['op'];
                self['_TuoguanUnit'].setVisible(data['op']);
            }
            var infoNode = self.PlayersUnitNode['info' + row];
            if (infoNode) {
                var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                PlayerInfoUnitRoot['tuoguan'].setVisible(data['op']);
            }
            if (self.isReplay && self.operateFinishCb) {
                self.operateFinishCb();
            }
        });

        network.addListener(3502, function (data) {
            self['_FunctionBtnUnit']["btn_begin"].setVisible(true);
        });

        //结算
        network.addListener(4008, function (data) {
            self.setRoomState(self.roomStatus.ENDED);
            //剩余牌数
            self.hideOps();
            // self.setTishiNode(false);
            self.jiesuan(data);
        });
        //总结算
        network.addListener(4009, function (data) {
            self['_FunctionBtnUnit']["btn_ready"].setVisible(false);
            self.zongjiesuanData = data;
            if (gameData.trusteeship) {
                self.showZongJieSuanWindow();
            }
        });
        //提示
        network.addListener(4010, function (data) {
            var msg = data.msg;
            self.showToast(decodeURIComponent(msg));
        });
        //离线
        network.addListener(4020, function (data) {
            if (data && data["uid"]) {
                var uid = data["uid"];
                var isOffline = data["is_offline"];
                self.playerOnloneStatusChange(self.uid2position[uid], isOffline);
            }
        });
        //发牌
        network.addListener(4200, function (data) {
            network.stop();
            gameData.totalRound = data['total_round'];
            gameData.leftRound = data["left_round"];
            gameData.curRound = data["cur_round"];
            self.clearTable();
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                player["pai_arr"] = [];
                player["is_auto_trust"] = null;
            }
            self.curPlayerNum = gameData.players.length;
            self.setPlayerData(self.curPlayerNum);
            self.setRoomState(self.roomStatus.ONGOING);
            self['_RoomInfoUnit']['lb_jushu'].setString(gameData.curRound + 1 + "/" + gameData.totalRound);
            //剩余牌数
            self.setCardShengyuNum(data["cardsNum"]);
            //玩家数据
            var playerInfos = data["playerInfos"];
            for (var i = 0; i < playerInfos.length; i++) {
                var info = playerInfos[i];
                var uid = info["uid"];
                // var player = self.uid2playerInfo[uid];
                // player["pai_arr"] = info["pai_arr"];
                var player = gameData.getPlayerInfoByUid(uid);
                if(player){
                    player["pai_arr"] = info["pai_arr"];
                }
                //玩家
                var row = self.uid2position[uid];
                var infoNode = self.PlayersUnitNode['info' + row];
                if(infoNode) {
                    var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                    PlayerInfoUnitRoot['lb_boboscore'].setString(info["boboNum"]);
                    PlayerInfoUnitRoot['zhuang'].setVisible(uid == data["zhuang_uid"]);
                }
            }
            self.StartGame(true);
            if (self.isReplay && self.operateFinishCb) {
                self.operateFinishCb();
            }
        });
        //再发牌
        network.addListener(4201, function (data) {
            network.stop();
            // self.hideOpInfo();
            // self.setTishiNode(false);
            self.setCardShengyuNum(data["cardsNum"]);
            var playerInfos = data["playerInfos"];
            for (var i = 0; i < playerInfos.length; i++) {
                var info = playerInfos[i];
                var uid = info["uid"];
                var row = self.uid2position[uid];
                var player = self.uid2playerInfo[uid];
                player["pai_arr"].push(info['pai_arr']);
                var infoNode = self.PlayersUnitNode['info' + row];
                var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                PlayerInfoUnitRoot['lb_boboscore'].setString(info["boboNum"]);
                if (self.isReplay) {

                }
            }
            //发牌动
            self.dealCards(2, function () {
                network.start();
                if (self.isReplay && self.operateFinishCb) {
                    self.operateFinishCb();
                }
            });
        });
        //操作
        network.addListener(4500, function (data) {
            var uid = data["turnUid"];
            var row = self.uid2position[uid];
            self.throwTurn(row, data);

        });
        //设置簸簸数
        network.addListener(4501, function (data) {
            self.setRoomState(self.roomStatus.ONGOING);
            gameData.totalRound = data['total_round'];
            gameData.curRound = data["cur_round"];
            self.curPlayerNum = gameData.players.length;
            self['_RoomInfoUnit']['lb_jushu'].setString(gameData.curRound + 1 + "/" + gameData.totalRound);
            var jieSuanErPiZiWindow = self['_WindowUnit'].getChildByName('jieSuanErPiZiWindow');
            if (jieSuanErPiZiWindow) {
                jieSuanErPiZiWindow.removeFromParent(true);
            }
            for (var i = 1; i <= self.playerNums; i++) {
                //玩家
                var infoNode = self.PlayersUnitNode['info' + i];
                var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                PlayerInfoUnitRoot['ok'].setVisible(false);
                PlayerInfoUnitRoot['lb_boboscore'].setString("0");
            }
            var playersSetBoboInfo = data['playersSetBoboInfo'] || [];
            for (var i = 0; i < playersSetBoboInfo.length; i++) {
                var info = playersSetBoboInfo[i];
                var uid = info['uid'];
                var row = self.uid2position[uid];
                var infoNode = self.PlayersUnitNode['info' + row];
                if (!self.isReplay) {
                    var cheerpizi = infoNode['cheerpiziNode'].getChildByName('cheerpizi');
                    if (row == self.originalPos) {
                        var _SetBoBoShuWindow = self['_WindowUnit'].getChildByName('SetBoBoShuWindow');
                        if (!info['isSetBobo'] && !info['loser']) {
                            if (!_SetBoBoShuWindow) {
                                _SetBoBoShuWindow = new SetBoBoShuWindow(data);
                                _SetBoBoShuWindow.setName('SetBoBoShuWindow');
                                self['_WindowUnit'].addChild(_SetBoBoShuWindow);
                            } else {
                                _SetBoBoShuWindow.upBoboInfo(data);
                            }
                        } else {
                            if (_SetBoBoShuWindow) {
                                _SetBoBoShuWindow.removeFromParent(true);
                            }
                        }
                    }

                    if (info['loser']) {
                        var player = self.uid2playerInfo[uid];
                        player['pai_arr'] = [];
                    }
                    if (!info['loser']) {
                        if (!info['isSetBobo']) {
                            if (!cheerpizi) {
                                cheerpizi = playSpine(epz_res.sp_cheerpizi_json, 'xuanzezhong', true);
                                cheerpizi.setName('cheerpizi');
                                infoNode['cheerpiziNode'].addChild(cheerpizi);
                            }
                        } else {
                            if (cheerpizi) {
                                cheerpizi.removeFromParent(true);
                            }
                        }
                    }
                }
                var infoNode = self.PlayersUnitNode['info' + row];
                infoNode['liuzuolixi'].setVisible(info['loser']);
            }
            if (self.isReplay && self.operateFinishCb) {
                self.operateFinishCb();
            }
        });
        network.addListener(4502, function (data) {
            self['_ChipUnit']['xiazhuchi'].setVisible(true);
            self['_ChipUnit']['xiazhuchi']['num'].setString(data['totalRatio'] ? data['totalRatio'] : "0");
            var row = self.uid2position[data.from_uid];
            if (data['ratio'] > 0) {
                playEffect('vfollow_chip_bg');
                self.throwCMAnim(row, data['ratio'], data['difen']);
            }
            var player = self.uid2playerInfo[data.from_uid];
            var op = data['op'];
            var infoNode = self.PlayersUnitNode['info' + row];
            var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
            var ScoreUnitNode = infoNode["ScoreUnit"];
            ScoreUnitNode.setVisible(true);
            self.showOpInfo(row, op);
            if (op == self.opType.GEN) {
                playEffect('epz_gen', self.position2sex[row]);
            } else if (op == self.opType.DA) {
                playEffect('epz_da', self.position2sex[row]);
            } else if (op == self.opType.DIU) {
                playEffect('epz_diu', self.position2sex[row]);
                //if(self.isReplay){
                //self.hidePaiAnim(row, 0);
                //}
            } else if (op == self.opType.BI) {
                playEffect('epz_bi', self.position2sex[row]);
            } else if (op == self.opType.QIAO) {
                playEffect('epz_qiao', self.position2sex[row]);
            }
            ScoreUnitNode['num'].setString(data['cur_ratio']);
            if (self.isReplay && self.operateFinishCb) {
                self.operateFinishCb();
            }
        });
        //操作结果
        network.addListener(4503, function (data) {
            //{"code":4503,"data":{"room_id":329541,"from_uid":242,"pai_info":[{"uid":242,"pai":"31"},{"uid":220,"pai":"-1"}],"op":3}}
            if (data['op'] == 1) {//搓牌
                var row = self.uid2position[data['from_uid']];
                if (row == self.originalPos) {
                    for (var i = 0; i < data['pai_info'].length; i++) {
                        (function (i) {
                            var paiInfo = data['pai_info'][i];
                            if (data['from_uid'] == paiInfo['uid']) {
                                self.scheduleOnce(function () {
                                    var cuoOnePaiWindow = self.getChildByName('cuoOnePaiWindow');
                                    if (!cuoOnePaiWindow) {
                                        cuoOnePaiWindow = new CuoOnePaiWindow(2, [paiInfo['pai']], [self.getPai(row, 0).paiId], this);
                                        cuoOnePaiWindow.setName('cuoOnePaiWindow');
                                        self.addChild(cuoOnePaiWindow, 100);
                                    }
                                }, 0.1);
                            }
                        })(i);
                    }
                }
            } else {//亮牌
                for (var i = 0; i < data['pai_info'].length; i++) {
                    var paiInfo = data['pai_info'][i];
                    var row = self.uid2position[paiInfo['uid']];
                    if (row == self.originalPos && paiInfo['pai'] > 0) {
                        var cuoOnePaiWindow = self.getChildByName('cuoOnePaiWindow');
                        if (cuoOnePaiWindow) {
                            cuoOnePaiWindow.removeFromParent(true);
                        }
                        self['_FunctionBtnUnit']["btn_cuopai"].setVisible(false);
                        self['_FunctionBtnUnit']["btn_liangpai"].setVisible(false);
                    }
                    self.showPaiAnim(row, 1, paiInfo['pai']);
                }
            }
        });
        network.addListener(4600, function (data) {
            //{"code":4600,"data":{"room_id":259356,"dice":0,"cardsNum":52}}
            network.stop();
            if (data["dice"] > 0 && data["dice"] < 7) {
                var touzi = playSpine(epz_res.sp_touzi_json, 'touzi' + data["dice"], false);
                touzi.setPosition(cc.p(640, 360));
                self['_WindowUnit'].addChild(touzi);
                setTimeout(function () {
                    touzi.removeFromParent(true);
                    self.setCardShengyuNum(data["cardsNum"]);
                    network.start()
                    if (self.isReplay && self.operateFinishCb) {
                        self.operateFinishCb();
                    }
                }, 1500)
            }
        });
        network.addListener(4900, function (data) {

        });
        network.start();
    },
    //触摸事件
    addBtnTouch: function () {
        var self = this;

        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_chat"], function () {
            self.addChild(new ChatLayer());
        });

        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_invite"], function () {
            var shareTypeLayer = new ShareTypeLayer(null, gameData.roomId, {
                desp: gameData.wanfaDesp,
                mapid: gameData.mapId
            })
            shareTypeLayer.x = self.width / 2;
            shareTypeLayer.y = self.height / 2;
            shareTypeLayer.ignoreAnchorPointForPosition(false);
            self.addChild(shareTypeLayer, 100);
        });

        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_copy"], function () {
            var title = gameData.companyName + "二皮子-" + gameData.roomId + ",已有" + gameData.players.length + "人";
            var content = gameData.companyName + "二皮子-" + gameData.wanfaDesp + gameData.shareUrl + '?roomid=' + gameData.roomId;
            console.log(title + "\n" + content);
            var shareurl = getShareUrl(gameData.roomId);
            savePasteBoard(title + "\n" + content + "\n" + shareurl);
            alert1("复制成功");
        });

        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_tuoguan"], function () {
            network.send(4007, {room_id: gameData.roomId, op: true});
        });

        // TouchUtils.setOnclickListener(self['_TuoguanUnit'], function () {
        //     network.send(4007, {room_id: gameData.roomId,op:false});
        // });

        TouchUtils.setOnclickListener(self['_TuoguanUnit']["btn_quxiaotuoguan"], function () {
            network.send(4007, {room_id: gameData.roomId, op: false});
        });

        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_ready"], function () {
            network.send(3004, {room_id: gameData.roomId});
            self['_FunctionBtnUnit']["btn_ready"].setVisible(false);
        });

        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_zuoxia"], function () {
            network.send(3002, {room_id: gameData.roomId, sit_down: true});
            self['_FunctionBtnUnit']['btn_zuoxia'].setVisible(false);
        });
        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_begin"], function () {
            network.send(3005, {room_id: gameData.roomId});
            self['_FunctionBtnUnit']["btn_begin"].setVisible(false);
        });
        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_cuopai"], function () {
            network.send(4503, {room_id: gameData.roomId, op: 1});
            self['_FunctionBtnUnit']["btn_cuopai"].setVisible(false);
            self['_FunctionBtnUnit']["btn_liangpai"].setVisible(false);
        });
        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_liangpai"], function () {
            network.send(4503, {room_id: gameData.roomId, op: 2});
            self['_FunctionBtnUnit']["btn_cuopai"].setVisible(false);
            self['_FunctionBtnUnit']["btn_liangpai"].setVisible(false);
        });
        TouchUtils.setOnclickListener(self['_FunctionBtnUnit']["btn_help"], function () {
            //self.addChild(new NiuniuWanfaLayer(gameData.wanfaDesp, 'epz'));
            alert1(gameData.wanfaDesp);
        });
        for (var i = 1; i <= self.playerNums; i++) {
            (function (row) {
                var infoNode = self.PlayersUnitNode['info' + row];
                if (infoNode) {
                    TouchUtils.setOnclickListener(infoNode, function () {
                        self.showPlayerInfoPanel(row);
                    });
                }
            })(i)
        }
    },
    //房间数据
    setReplayData: function (data) {
        var self = this;
        self.isReplay = !!(data && data['3002']);
        self.isReconnect = !!(data && !self.isReplay);
        self.data = data;
        self.uid = gameData.uid;
        if (self.isReplay || self.isReconnect) {
            if (self.isReplay) {
                self.data = data['3002']['data'];
            }
            gameData.playerNum = self.data['max_player_cnt'] || self.playerNums;
            gameData.curRound = self.data['cur_round'];
            gameData.leftRound = self.data['left_round'];
            gameData.totalRound = self.data['total_round'];
            if (self.data['options']) {
                gameData.yunxujiaru = self.data['options']['yunxujiaru'];
                if (self.data['options']['maxPlayerCnt']) {
                    gameData.playerNum = self.data['options']['maxPlayerCnt'];
                }
            }
        }
    },
    initClubAssistant: function () {
        var that = this;
        var self = this;
        if(self.isReplay){
            return;
        }
        if (res.ClubAssistant_json && mRoom.club_id && mRoom.club_id > 0) {
            this.assistant = new ClubAssistant(mRoom.club_id, self.isReplay, this.getRoomState() == self.roomStatus.ONGOING);
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
                    data.scene = 'epz';
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
                            if (!(that.getRoomState() == self.roomStatus.ONGOING))
                                alert1(message['msg']);
                        }
                    }
                }
            });
        }
    },
    //初始化
    ctor: function (_data) {
        this._super();
        var self = this;
        network.stop();
        var rootNode = loadFile(this, epz_res.ErPiZiRoom_json);
        rootNode.ignoreAnchorPointForPosition(false);
        // rootNode.setAnchorPoint(cc.p(0.5))
        rootNode.x = cc.winSize.width / 2
        self.getPai = self.getPai();
        self.countDown = self.countDown();
        self.setReplayData(_data);
        self.initData();
        self.initializeUI();
        self.onPlayerEnter();
        if (self.isReconnect) {
            var status = self.data["room_status"] || self.roomStatus.ONGOING;
            if (status == self.roomStatus.ENDED) {
                self.setRoomState(self.roomStatus.ONGOING);
                self.setRoomState(self.roomStatus.ENDED);
            } else {
                self.setRoomState(status);
            }
        }
        else {
            self.setRoomState(self.roomStatus.CREATED);
        }
        self.StartGame();
        self.addBtnTouch();
        self.hideControlBtns();
        self.initClubAssistant();

        // EFFECT_EMOJI.init(self);
        if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1) {
            EFFECT_EMOJI_NEW.init(self);
        }else{
            EFFECT_EMOJI.init(self);
        }

        MicLayer.init(self['_FunctionBtnUnit']['btn_mic'], this);
        playMusic("vbg6");
        return true;
    },
    getVersion: function () {
        var subArr = SubUpdateUtils.getLocalVersion();
        var sub = "";
        if (subArr) sub = subArr['epz'];

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
    initData: function () {
        var self = this;
        self.roomPlayers = {};
        self.uid2position = {};
        self.uid2playerInfo = {};
        self.position2uid = {};
        self.position2sex = {};
        self.position2playerArrIdx = {};
        self.roomState = self.roomStatus.CREATED;
        self.playerNums = gameData.playerNum;
    },
    setRoomState: function (state) {
        var self = this;
        self.roomState = state;
        self['_FunctionBtnUnit']['btn_tuoguan'].setVisible(self.roomState != self.roomStatus.CREATED && self.isExist);
        self['_FunctionBtnUnit']['btn_mic'].setVisible(self.roomState != self.roomStatus.CREATED && self.isExist);
        self['_FunctionBtnUnit']['btn_chat'].setVisible(self.roomState != self.roomStatus.CREATED && self.isExist);
        self['_FunctionBtnUnit']["btn_invite"].setVisible(self.roomState == self.roomStatus.CREATED && (gameData.loginType != "yk" || !cc.sys.isNative) && !self.isReplay);
        self['_FunctionBtnUnit']["btn_copy"].setVisible(self.roomState == self.roomStatus.CREATED && (gameData.loginType != "yk" || !cc.sys.isNative) && !self.isReplay);
        switch (self.roomState) {
            case self.roomStatus.CREATED:
                self['_FunctionBtnUnit']['btn_zuoxia'].setVisible(self.isWatch && !self.isReplay);
                break;
            case self.roomStatus.PREPARING:
                break;
            case self.roomStatus.ONGOING: {
                self['_FunctionBtnUnit']['btn_zuoxia'].setVisible(self.isWatch && !self.isExist && !self.isReplay && gameData.yunxujiaru);
                for (var i = 1; i <= self.playerNums; i++) {
                    //玩家
                    var infoNode = self.PlayersUnitNode['info' + i];
                    var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                    PlayerInfoUnitRoot['ok'].setVisible(false);
                }
                break;
            }
            case self.roomStatus.GAMEOVER:
            case self.roomStatus.ENDED:
                break;
            default:
                break;
        }
    },
    initializeUI: function () {
        var self = this;
        //房间信息
        self['_RoomInfoUnit']['lb_roomid'].setString(gameData.roomId);
        self['_RoomInfoUnit']['lb_jushu'].setString(gameData.curRound + 1 + "/" + gameData.totalRound);
        self.startSignal();
        self.startTime();
        self.initBG();
        //托管页面
        self['_TuoguanUnit'].setVisible(false);
        var robot = playSpine(epz_res.sp_robot_json, 'animation', true);
        var size = self['_FunctionBtnUnit']['btn_tuoguan'].getContentSize();
        robot.setPosition(cc.p(size.width / 2, size.height / 2));
        self['_FunctionBtnUnit']['btn_tuoguan'].addChild(robot);
        //控制页面
        self['_ControlUnit']['btn_bg'].setVisible(false);
        self['_ControlUnit']['btn_bg'].setPositionX(1280 + (cc.winSize.width/2-1280/2)-50);
        self['_ControlUnit']['btn_control_btns'].setPositionX(1200 + (cc.winSize.width/2-1280/2)-50);
        //操作按钮
        self['_OperationBtnUnit']['op_bg'].setVisible(false);
        //闹钟
        self['_ClockiUnit']['clock'].setVisible(false);
        //提示
        self['_TipUnit']['top_tip'].setVisible(false);
        if (self.playerNums == 6) {
            self['_PlayersUnit']['Players_6'].setVisible(true);
            self['_PlayersUnit']['Players_8'].removeFromParent(true);
            self.PlayersUnitNode = self['_PlayersUnit']['Players_6']['root'];
            self['_PaisUnit']['Pais_6'].setVisible(true);
            self['_PaisUnit']['Pais_8'].removeFromParent(true);
            self.PaisUnitNode = self['_PaisUnit']['Pais_6']['root'];
        } else {
            self['_PlayersUnit']['Players_6'].removeFromParent(true);
            self['_PlayersUnit']['Players_8'].setVisible(true);
            self.PlayersUnitNode = self['_PlayersUnit']['Players_8']['root'];
            self['_PaisUnit']['Pais_6'].removeFromParent(true);
            self['_PaisUnit']['Pais_8'].setVisible(true);
            self.PaisUnitNode = self['_PaisUnit']['Pais_8']['root'];
        }
        //牌和玩家
        for (var i = 1; i <= self.playerNums; i++) {
            (function (i) {
                //玩家
                var infoNode = self.PlayersUnitNode['info' + i];
                var cheerpiziNode = new cc.Node();
                cheerpiziNode.setPosition(cc.p(infoNode.getContentSize().width / 2, infoNode.getContentSize().height / 2));
                infoNode['cheerpiziNode'] = cheerpiziNode;
                infoNode.addChild(cheerpiziNode);
                infoNode.setVisible(false);
                var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                PlayerInfoUnitRoot['head_timerbg'].setVisible(false);
                PlayerInfoUnitRoot['tuoguan'].setVisible(false);
                //聊天
                var ChatInfoNode = infoNode["ChatInfo"];
                var prop = ChatInfoNode.getChildren();
                for (var k = 0; k <= prop.length; k++) {
                    var Child = prop[k];
                    if (Child)
                        Child.setVisible(false);
                }
            })(i);
        }
        self.fapaiNode = self["_fapaiNode"];
        if (!self.fapaiNode) {
            self.fapaiNode = new cc.Node();
            self["_fapaiNode"] = self.fapaiNode;
            self.addChild(self.fapaiNode);
        }
        self.clearTable();
        self.getVersion();
    },
    clearTable: function () {
        var self = this;
        //牌和玩家组件
        self['_PaisUnit']['shengyuNode'].setVisible(false);
        for (var i = 1; i <= self.playerNums; i++) {
            (function (i) {
                //牌
                var rowNode = self.PaisUnitNode['row' + i];
                for (var k = 0; k < self.initPaiNum; k++) {
                    var pai = self.getPai(i, k);
                    pai.stopAllActions();
                    pai.setVisible(false);
                }
                rowNode['CardTypeUnit'].setVisible(false);
                //玩家
                var infoNode = self.PlayersUnitNode['info' + i];
                infoNode['cheerpiziNode'].removeAllChildren();
                var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
                PlayerInfoUnitRoot['ok'].setVisible(false);
                PlayerInfoUnitRoot['offline'].setVisible(false);
                PlayerInfoUnitRoot['zhuang'].setVisible(false);

                var ScoreUnitNode = infoNode["ScoreUnit"];
                ScoreUnitNode.setVisible(false);
                ScoreUnitNode['num'].setString("0");

                //操作信息
                self.showOpInfo(i, self.opType.NONE);
            })(i);
        }
        //功能按钮
        var childlist = self['_FunctionBtnUnit'].getChildren();
        _.forIn(childlist, function (child) {
            child.setVisible(false);
        });
        self['_FunctionBtnUnit']["btn_help"].setVisible(true);
        self['_ChipUnit']['xiazhuchi'].setVisible(false);
        self['_ChipUnit']['ChipNode'].removeAllChildren();
        self.fapaiNode.removeAllChildren();
        var jieSuanErPiZiWindow = self['_WindowUnit'].getChildByName('jieSuanErPiZiWindow');
        if (jieSuanErPiZiWindow) {
            jieSuanErPiZiWindow.removeFromParent(true);
        }
    },
    calcPosConf: function () {
        var self = this;
        //操作坐标
        // var ops = self["_ops"];
        // self.opPos = {
        //     1: ops["btn_qipai"].getPosition(),
        //     2: ops["btn_jiafen_1"].getPosition(),
        //     3: ops["btn_jiafen_2"].getPosition(),
        //     4: ops["btn_jiafen_3"].getPosition(),
        //     5: ops["btn_xiupai"].getPosition()
        // };
        // self.rowScales = {};
        // self.rowOpTextScales = {};
        // for (var i = 0; i < self.playerNums; i++) {
        //     (function (i) {
        //         var row = self['_row' + i];
        //         self.rowScales[i] = row.getScale();
        //         var opText = self.getOpsText(i, self.opType.QI);
        //         self.rowOpTextScales[i] = opText.getScale();
        //     })(i);
        // }
    },
    setChipPool: function (num) {
        var self = this;
        var chip = self.getChipIcon(num);
        var size = self['_ChipUnit']['ChipPool'].getContentSize();
        var endPos = self['_ChipUnit']['ChipPool'].getPosition();
        while (chip) {
            var x = (0.5 - Math.random()) * size.width + endPos.x;
            var y = (0.5 - Math.random()) * size.height + endPos.y;
            chip.setPosition(cc.p(x, y));
            self['_ChipUnit']['ChipNode'].addChild(chip);
            chip = self.getChipIcon(chip.num);
        }
    },
    getChipIcon: function (num) {
        var name = null;
        var curNum = 0;
        if (num >= 100) {
            name = 'chip_epz/chip_' + 100 + '.png';
            curNum = num - 100;
        } else if (num >= 50) {
            name = 'chip_epz/chip_' + 50 + '.png';
            curNum = num - 50;
        } else if (num >= 20) {
            name = 'chip_epz/chip_' + 20 + '.png';
            curNum = num - 20;
        } else if (num >= 10) {
            name = 'chip_epz/chip_' + 10 + '.png';
            curNum = num - 10;
        } else if (num >= 5) {
            name = 'chip_epz/chip_' + 5 + '.png';
            curNum = num - 5;
        } else if (num >= 2) {
            name = 'chip_epz/chip_' + 2 + '.png';
            curNum = num - 2;
        } else if (num == 1) {
            name = 'chip_epz/chip_' + 1 + '.png';
            curNum = num - 1;
        }
        if (name) {
            var chip = new cc.Sprite();
            chip.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(name));
            chip.num = curNum;
            return chip;
        }
        return name;
    },
    throwCMAnim: function (row, num) {
        var self = this;
        var chip = self.getChipIcon(num);
        var startPos = self.PlayersUnitNode['info' + row].convertToWorldSpace(self.PlayersUnitNode['info' + row]['PlayerInfoUnit'].getPosition());
        var size = self['_ChipUnit']['ChipPool'].getContentSize();
        var endPos = self['_ChipUnit']['ChipPool'].getPosition();
        while (chip) {
            chip.setPosition(startPos);
            var x = (0.5 - Math.random()) * size.width + endPos.x;
            var y = (0.5 - Math.random()) * size.height + endPos.y;
            chip.runAction(cc.moveTo(0.2, cc.p(x, y)));
            self['_ChipUnit']['ChipNode'].addChild(chip);
            chip = self.getChipIcon(chip.num);
        }
    },
    setPlayerData: function (curPlayerNum) {
        var self = this;
        if (!gameData.players) {
            return;
        }
        self.uid2position = {};
        self.uid2playerInfo = {};
        self.position2uid = {};
        self.position2sex = {};
        self.position2playerArrIdx = {};
        var players = gameData.players;
        //排序
        players.sort(function (a, b) {
            return a.pos - b.pos;
        });

        //邀请俱乐部成员
        if (this.getRoomState() == self.roomStatus.ONGOING || gameData.curRound > 1) {
            if (this.assistant) this.assistant.setVisible(false);
        } else {
            if (players.length >= self.playerNums) {
                var clubMemberInviteLayer = this.getChildByName('clubMemberInviteLayer');
                if (clubMemberInviteLayer) {
                    clubMemberInviteLayer.removeFromParent(true);
                }
                if (this.assistant) this.assistant.setVisible(false);
            } else {
                if (mRoom.club_id && (this.getRoomState() == self.roomStatus.ONGOING || gameData.curRound > 1)) {
                    if (this.assistant) this.assistant.setVisible(true);
                }
            }
        }


        //判断围观
        self.isWatch = players.length < self.playerNums;
        self.isExist = false;
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.uid == gameData.uid) {
                if (!self.isReplay) {
                    self.isWatch = false;
                }
                self.isExist = true;
            }
        }
        //不是围观排序
        self.selfpos = self.originalPos;
        if (self.isExist) {
            for (var i = 0; i < players.length; i++) {
                var player = players[0];
                if (player.uid != gameData.uid) {
                    players.splice(0, 1);
                    players.push(player);
                } else {
                    self.selfpos = player.pos + 1;
                    break;
                }
            }
        }
        for (var i = 1; i <= self.playerNums; i++) {
            var infoNode = self.PlayersUnitNode['info' + i];
            infoNode.setVisible(false);
        }
        var addnumber = 0;
        if (self.selfpos !== self.originalPos) addnumber = self.playerNums - self.selfpos; // 加数
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            var pos = player.pos + self.originalPos;
            if (self.selfpos !== self.originalPos) {
                if (pos >= self.selfpos) {
                    player.row = pos - self.selfpos;
                } else {
                    player.row = pos + addnumber;
                }
            } else {
                player.row = player.pos;
            }
            player.row += self.originalPos;
            if (!self.isExist && self.isWatch && gameData.players.length < self.playerNums) {
                player.row = player.row - gameData.players.length;
                if (curPlayerNum > 0) {
                    player.row += (players.length - curPlayerNum);
                }
                cc.log('围观：=' + player.row);
                if (player.row < self.originalPos) {
                    player.row += self.playerNums;
                }
            }
            self.uid2playerInfo[player.uid] = player;
            self.uid2position[player.uid] = player.row;
            self.position2uid[player.row] = player.uid;
            self.position2sex[player.row] = player.sex;
            self.position2playerArrIdx[player.row] = i;
            self.setPlayerInfo(player, i);
        }

        if (self.assistant) {
            if(typeof self.assistant.refreshPlayersStates == 'function')  self.assistant.refreshPlayersStates();
        }
    },
    //玩家信息
    setPlayerInfo: function (playerInfo, arrIdx) {
        var self = this;
        var index = playerInfo.row;
        var infoNode = self.PlayersUnitNode['info' + index];
        infoNode.setVisible(true);
        var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
        PlayerInfoUnitRoot['lb_nickname'].setString(ellipsisStr(playerInfo["nickname"], 5));
        PlayerInfoUnitRoot['lb_boboscore'].setString(playerInfo["bobo_num"] ? playerInfo["bobo_num"] : "0");
        if (self.isReconnect && self.data && self.data['gameStatus'] && self.data['gameStatus'] == self.gameStatus.BOBO) {
            PlayerInfoUnitRoot['lb_boboscore'].setString('0');
        }
        PlayerInfoUnitRoot['ok'].setVisible(playerInfo["ready"]);
        PlayerInfoUnitRoot['tuoguan'].setVisible(playerInfo['is_auto_trust']);
        if (playerInfo['is_auto_trust'] && index == self.originalPos && self.isExist) {
            gameData.trusteeship = true;
            self['_TuoguanUnit'].setVisible(true);
        }
        infoNode['liuzuolixi'].setVisible(playerInfo['loser']);
        if (playerInfo["headimgurl"] === "") playerInfo["headimgurl"] = res.defaultHead;
        loadImageToSprite(playerInfo["headimgurl"], PlayerInfoUnitRoot['head'], true);
        if (playerInfo['ratio'] > 0) {
            var ScoreUnitNode = infoNode["ScoreUnit"];
            ScoreUnitNode.setVisible(true);
            ScoreUnitNode['num'].setString(playerInfo['ratio']);
        }
        if (arrIdx == gameData.players.length - 1) {
            network.start();
        }
    },
    /**
     * 玩家加入房间
     */
    onPlayerEnter: function (curPlayerNum) {
        var self = this;
        self.setPlayerData(curPlayerNum);
    },
    initBG: function () {
        var self = this;
        var id = cc.sys.localStorage.getItem('sceneid_epz') || 0;
        if (id > 3) id = id - 3;
        self["_bg"].setTexture(res["table_epz_back" + id + "_jpg"]);

    },
    startSignal: function () {
        var self = this;
        var interval = null;
        var lastDealy = -1;
        var func = function () {
            if (!self || !cc.sys.isObjectValid(self))
                return clearInterval(interval);
            var delay = network.getLastPingInterval();
            if (delay == lastDealy)
                return;
            var signal = self['_RoomInfoUnit']['signal'];
            lastDealy = delay;
            if (NetUtils.isWAN()) {
                if (delay < 100) signal.setTexture(epz_res.signal5);
                else if (delay < 200) signal.setTexture(epz_res.signal4);
                else if (delay < 300) signal.setTexture(epz_res.signal3);
                else if (delay < 600) signal.setTexture(epz_res.signal2);
                else signal.setTexture(epz_res.signal1);
            } else if (NetUtils.isWifi()) {
                if (delay < 200) signal.setTexture(epz_res.wifi_signal4);
                else if (delay < 400) signal.setTexture(epz_res.wifi_signal3);
                else if (delay < 600) signal.setTexture(epz_res.wifi_signal2);
                else signal.setTexture(epz_res.wifi_signal1);
            }
        };
        func();
        interval = setInterval(func, 200);
        //如果视频房判断网络 并提示玩家
        if (NetUtils.isWAN() && gameData.shipin > 0) {
            alert1("您当前为移动网络，已经进入视屏房，耗费流量较大。");
        }
    },
    startTime: function () {
        var self = this;
        var interval = null;
        var flag = true;
        var lbTime = self['_RoomInfoUnit']["lb_time"];
        var updTime = function () {
            //显示电池电量
            var battery = self['_RoomInfoUnit']["battery"];
            var level = DeviceUtils.getBatteryLevel();
            if (cc.sys.isObjectValid(battery)) {
                if (level > 75) {
                    battery.setTexture(epz_res.battery_5);
                } else if (level > 50) {
                    battery.setTexture(epz_res.battery_4);
                } else if (level > 25) {
                    battery.setTexture(epz_res.battery_3);
                } else if (level > 10) {
                    battery.setTexture(epz_res.battery_2);
                } else {
                    battery.setTexture(epz_res.battery_1);
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
    setReady: function (uid) {
        var self = this;
        var _PlayersUnit = self.PlayersUnitNode;
        var row = self.uid2position[uid];
        if (_PlayersUnit["info" + row]) {
            var PlayerInfoUnitRoot = _PlayersUnit["info" + row]["PlayerInfoUnit"]['root'];
            PlayerInfoUnitRoot['ok'].setVisible(true);
        }
        if (uid == self.uid) {
            self['_FunctionBtnUnit']["btn_ready"].setVisible(false);
        }
    },
    playerOnloneStatusChange: function (row, isOffline) {
        var self = this;
        var _PlayersUnit = self.PlayersUnitNode;
        if (self && _PlayersUnit && _PlayersUnit["info" + row]) {
            var PlayerInfoUnitRoot = _PlayersUnit["info" + row]["PlayerInfoUnit"]['root'];
            var offline = PlayerInfoUnitRoot["offline"];
            offline.setVisible(!!isOffline);
        }
    },
    setCardShengyuNum: function (num) {
        var self = this;
        if (num > 0) {
            //剩余牌数
            self.cardsNum = num;
            self['_PaisUnit']['shengyuNode'].setVisible(true);
            self.cardShengyuNum = self['_PaisUnit']['shengyuNode']['card_shengyuNum'];
            self.cardShengyuNum.setString(self.cardsNum);
        }
    },
    //开始游戏
    StartGame: function (isFapai) {
        var self = this;
        if (isFapai) {
            self.dealCards(1, function () {
                network.start();
            });

            // //中途加入
            // if (self.selfPlayerInfo.playerStatus == self.playerStatus.WAITING) {
            //     self.showCards(3, function () {
            //         network.start();
            //     });
            // } else {//发牌动
            //     self.dealCards(3, function () {
            //         self.setPaiDianshu(self.selfPlayerInfo.weight);
            //         network.start();
            //     });
            // }
        } else if (self.isReconnect) {
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                var row = self.uid2position[player.uid];
                if (player["pai_arr"] && player["pai_arr"].length > 0) {
                    var arr = player["pai_arr"];
                    for (var j = 0; j < arr.length; j++) {
                        self.setPai(row, j, arr[j], true);
                    }
                }
                self.showOpInfo(row, player['op']);
            }

            self.setCardShengyuNum(self.data["cardsNum"]);
            self['_ChipUnit']['xiazhuchi'].setVisible(true);
            self['_ChipUnit']['xiazhuchi']['num'].setString(self.data['totalRatio'] ? self.data['totalRatio'] : "0");
            if (self.data['totalRatio'] > 0) {
                self.setChipPool(self.data['totalRatio'], self.data['options']['difen']);
            }
            network.start();
        }
    },
    checkFaPaiNum: function (toIndex) {
        var self = this;
        var count = 0;
        for (var k = 0; k < toIndex; k++) {
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                var row = self.uid2position[player.uid];
                var isVisible = self.getPai(row, k).isVisible();
                if (!isVisible && player["pai_arr"] && player["pai_arr"][k] != null) {
                    count++;
                }
            }
        }
        return count;
    },
    /**
     * 显示牌动画
     */
    hidePaiAnim: function (row, index, cd) {
        var self = this;
        var pai = self.getPai(row, index);
        if (pai.getNumberOfRunningActions() > 0 || pai.paiId == -1) {
            return;
        }
        var flipTime = 0.05;
        var scalevalue = pai.getScale();
        pai.stopAllActions();
        pai.setScaleX(-scalevalue);
        pai.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(flipTime, 0, scalevalue),
                cc.skewTo(flipTime, 0, 30)
            ),
            cc.callFunc(function () {
                self.setPai(row, index, -1, true);
            }),
            cc.spawn(
                cc.scaleTo(flipTime, scalevalue, scalevalue),
                cc.skewTo(flipTime, 0, 0)
            ),
            cc.callFunc(function () {
                cd && cd();
            })
        ));
        return true;
    },
    /**
     * 显示牌动画
     */
    showPaiAnim: function (row, index, paiId, cd) {
        var self = this;
        if (paiId == -1) {
            self.setPai(row, index, paiId, true);
            return;
        }
        var pai = self.getPai(row, index);
        if (pai.getNumberOfRunningActions() > 0 || pai.paiId == paiId) {
            return;
        }
        var flipTime = 0.05;
        var pai = self.setPai(row, index, -1, true);
        var scalevalue = pai.getScale();
        pai.stopAllActions();
        pai.setScaleX(-scalevalue);
        pai.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(flipTime, 0, scalevalue),
                cc.skewTo(flipTime, 0, 30)
            ),
            cc.callFunc(function () {
                self.setPai(row, index, paiId, true);
            }),
            cc.spawn(
                cc.scaleTo(flipTime, scalevalue, scalevalue),
                cc.skewTo(flipTime, 0, 0)
            ),
            cc.callFunc(function () {
                cd && cd();
            })
        ));
        return true;
    },
    //搓牌的翻牌
    showHandCard: function (flag, cardArr, cancel) {
        var self = this;
        self.showPaiAnim(self.originalPos, 1, cardArr[1]);
        network.send(4503, {room_id: gameData.roomId, op: 3});
    },
    /**
     * 按轮发牌
     */
    dealCards: function (toIndex, callfunc) {
        var self = this;
        var time = 0; // 发牌次数
        var count = self.checkFaPaiNum(toIndex);
        self.isFapai = true;
        for (var k = 0; k < toIndex; k++) {
            for (var i = 0; i < gameData.players.length; i++) {
                (function (i, k) {
                    var player = gameData.players[i];
                    var row = self.uid2position[player.uid];
                    var isVisible = self.getPai(row, k).isVisible();
                    if (!isVisible && player["pai_arr"] && player["pai_arr"][k] != null) {
                        (function (row, player, i, k) {
                            self.setPai(row, k, player['pai_arr'][k], false);
                            var cl_pai = duplicateNode(self.getPai(self.originalPos, 0));
                            self.setPaiHua(cl_pai, -1, row);
                            self.fapaiNode.addChild(cl_pai);
                            cl_pai.setVisible(true);
                            cl_pai.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height));
                            cl_pai.setLocalZOrder(gameData.players.length * toIndex - time);

                            var rowNode = self.PaisUnitNode['row' + row];
                            var pai = self.getPai(row, k);
                            var x = pai.getPositionX() * rowNode.getScaleX() + rowNode.getPositionX();
                            var y = pai.getPositionY() * rowNode.getScaleY() + rowNode.getPositionY();
                            time++;
                            cl_pai.runAction(cc.sequence(
                                cc.delayTime(time * 0.08),
                                cc.callFunc(function () {
                                    playEffect('vfapai_bg');
                                }),
                                cc.spawn(
                                    cc.moveTo(0.08, x, y),
                                    cc.scaleTo(0.08, rowNode.getScale())
                                ),
                                cc.callFunc(function () {
                                    cl_pai.removeFromParent(true);
                                })
                            ));
                            pai.runAction(cc.sequence(
                                cc.delayTime(time * 0.08 + 0.08),
                                cc.callFunc(function () {
                                    pai.getParent().setVisible(true);
                                    pai.setVisible(true);
                                    count--;
                                    if (count === 0) {
                                        callfunc();
                                    }
                                })
                            ));
                        })(row, player, i, k);
                    }
                })(i, k)
            }
        }
    },
    //更换操作对象
    isMyTurn: function () {
        var self = this;
        return self.turnRow == self.originalPos;
    },
    throwTurnByUid: function (uid) {
        var self = this;
        self.throwTurn(self.uid2position[uid]);
    },
    throwTurn: function (row, data) {
        var self = this;
        self.turnRow = row;
        self.showOps(row, data);
        self.countDown(row, data["left_time"] > 0 ? data["left_time"] : 12);
    },
    countDown: function () {
        var self = this;
        var timer = null;
        return function (row, seconds) {
            var clock = self['_ClockiUnit']['clock'];
            var clocktime = clock["clocktime"];
            if (self.isReplay || seconds == -1) {
                clock.setVisible(false);
                return;
            }
            clock.setVisible(true);
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            clocktime.setString(seconds);
            timer = setInterval(function () {
                if (!cc.sys.isObjectValid(clocktime)) {
                    if (timer)
                        clearInterval(timer);
                    return;
                }
                if (!clocktime) {
                    clearInterval(timer);
                    timer = null;
                    return;
                }
                if (seconds > 0) {
                    --seconds;
                    clocktime.setString(seconds < 10 ? "0" + seconds : seconds);
                }
                if (seconds == 0) {
                    if (self.isMyTurn())
                        vibrate();
                    clearInterval(timer);
                }
            }, 1000);
            self.showHeadTime(row, seconds);
        }
    },
    showHeadTime: function (row, seconds) {
        var self = this;
        for (var i = 0; i < gameData.players.length; i++) {
            var player = gameData.players[i];
            var pos = self.uid2position[player.uid];
            var infoNode = self.PlayersUnitNode['info' + pos];
            var PlayerInfoUnitRoot = infoNode["PlayerInfoUnit"]['root'];
            if (pos == row) {
                var head_timer = PlayerInfoUnitRoot["head_timer"];
                if (!head_timer) {
                    var head_timer_sprite = duplicateNode(PlayerInfoUnitRoot["head_timerbg"]);
                    head_timer = new cc.ProgressTimer(head_timer_sprite);
                    head_timer.setName('head_timer');
                    head_timer.setType(cc.ProgressTimer.TYPE_RADIAL);
                    PlayerInfoUnitRoot["head_timer"] = head_timer;
                    PlayerInfoUnitRoot.addChild(head_timer);
                    head_timer.setPosition(PlayerInfoUnitRoot["head_timerbg"].getPosition());
                }
                head_timer.stopAllActions();
                head_timer.setPercentage(0);
                head_timer.runAction(cc.progressTo(seconds, 100));
            } else {
                var head_timer = PlayerInfoUnitRoot["head_timer"];
                if (head_timer) {
                    head_timer.stopAllActions();
                    head_timer.setPercentage(0);
                }
            }
        }
    },

    //牌相关
    getPai: function () {
        var self = this;
        var cache = {};
        return function (row, id) {
            cache[row] = cache[row] || {};
            if (cache[row][id])
                return cache[row][id];
            var node = self.PaisUnitNode["row" + row]["a" + id]["pai"];
            node.idx = id;
            cache[row][id] = node;
            return node;
        }
    },
    setPai: function (row, idx, val, isVisible) {
        var self = this;
        var pai = this.getPai(row, idx);
        self.setPaiHua(pai, val, row);
        pai.paiId = val;
        if (!_.isUndefined(isVisible)) {
            if (isVisible)
                pai.setVisible(true);
            else
                pai.setVisible(false);
        }
        return pai;
    },
    setPaiHua: function (pai, val) {
        if (val == -1) {
            pai.getChildByName("bei").setVisible(true);
        } else {
            pai.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('poker_epz/pai_' + val + '.png'));
            pai.getChildByName("bei").setVisible(false);
        }
    },
    //操作控制
    showOps: function (row, data) {
        var self = this;
        self.fapaiNode.removeAllChildren();
        self.hideOps();
        self.showOpInfo(row, self.opType.NONE);
        self.codeData4500 = data;
        var gameStatus = data['gameStatus'];
        //{"code":4500,"data":{"room_id":113497,"turnUid":286,"gameStatus":3,"zhuangUid":285,"radio":0,"difen":5,"cardsNum":52,"maxCardUid":0}}
        if (!self.isReplay && self.isExist) {
            var op_bg = self['_OperationBtnUnit']['op_bg'];
            if (row == self.originalPos) {
                op_bg.setVisible(gameStatus == self.gameStatus.XIAZHU || gameStatus == self.gameStatus.XIAZHU2);
                op_bg['btn_diu'].setVisible(data['diu']);
                op_bg['btn_bi']['btn_show'].setVisible(data['bi']);
                op_bg['btn_qiao']['btn_show'].setVisible(data['qiao']);
                op_bg['btn_da']['btn_show'].setVisible(data['da'] > 0);
                op_bg['btn_gen']['btn_show'].setVisible(data['gen'] >= 0);
                if (data['gen'] >= 0) {
                    op_bg['btn_gen']['btn_show']['num'].setString(data['gen']);
                }
            }
            self['_FunctionBtnUnit']['btn_cuopai'].setVisible(data['liang']);
            self['_FunctionBtnUnit']['btn_liangpai'].setVisible(data['liang']);

            TouchUtils.setOnclickListener(op_bg['btn_diu']['btn_show'], function () {
                alert2("是否确定丢牌？", function () {
                    network.send(4502, {room_id: gameData.roomId, op: self.opType.DIU});
                    self.hideOps();
                })
            });
            TouchUtils.setOnclickListener(op_bg['btn_bi']['btn_show'], function () {
                network.send(4502, {room_id: gameData.roomId, op: self.opType.BI});
                self.hideOps();
            });
            TouchUtils.setOnclickListener(op_bg['btn_qiao']['btn_show'], function () {
                alert2("是否确定敲？", function () {
                    network.send(4502, {room_id: gameData.roomId, op: self.opType.QIAO});
                    self.hideOps();
                });
            });
            TouchUtils.setOnclickListener(op_bg['btn_da']['btn_show'], function () {
                self.hideOps();
                self['_WindowUnit'].addChild(new SetDaWindow(self.codeData4500, self));
            });
            TouchUtils.setOnclickListener(op_bg['btn_gen']['btn_show'], function () {
                network.send(4502, {room_id: gameData.roomId, op: self.opType.GEN});
                self.hideOps();
            });
        }
        network.start();
    },
    hideOps: function () {
        var self = this;
        //操作按钮
        self['_OperationBtnUnit']['op_bg'].setVisible(false);
    },
    showOpInfo: function (row, opType) {
        var self = this;
        var infoNode = self.PlayersUnitNode['info' + row];
        var OperationInfoUnit = infoNode["OperationInfoUnit"];
        var childlist = OperationInfoUnit.getChildren();
        _.forIn(childlist, function (child) {
            child.setVisible(false);
        });
        if (opType == self.opType.DIU) {
            OperationInfoUnit['opInfo_diu'].setVisible(true);
        } else if (opType == self.opType.BI) {
            OperationInfoUnit['opInfo_bi'].setVisible(true);
        } else if (opType == self.opType.QIAO) {
            OperationInfoUnit['opInfo_qiao'].setVisible(true);
        } else if (opType == self.opType.DA) {
            OperationInfoUnit['opInfo_da'].setVisible(true);
        } else if (opType == self.opType.GEN) {
            OperationInfoUnit['opInfo_gen'].setVisible(true);
        }
    },
    showZongJieSuanWindow: function () {
        var self = this;
        if (self.zongjiesuanData) {
            var zongJieSuanErPiZiWindow = new ZongJieSuanErPiZiWindow(self.zongjiesuanData, self);
            zongJieSuanErPiZiWindow.setName('zongJieSuanErPiZiWindow');
            var curscene = cc.director.getRunningScene();
            // self['_WindowUnit'].addChild(zongJieSuanErPiZiWindow, 1);
            curscene.addChild(zongJieSuanErPiZiWindow, 1);
        }
    },
    showJiesuanWindow: function (data) {
        var self = this;
        var jieSuanErPiZiWindow = self['_WindowUnit'].getChildByName('jieSuanErPiZiWindow');
        if (jieSuanErPiZiWindow) {
            jieSuanErPiZiWindow.removeFromParent(true);
        }
        var jieSuanErPiZiWindow = new JieSuanErPiZiWindow(data, self);
        jieSuanErPiZiWindow.setName('jieSuanErPiZiWindow');
        self['_WindowUnit'].addChild(jieSuanErPiZiWindow, 2);

        if (gameData.trusteeship) {
            setTimeout(function () {
                jieSuanErPiZiWindow.removeFromParent(true);
            }, 1000);
        }
        if (self.zongjiesuanData) {
            setTimeout(function () {
                self.showZongJieSuanWindow();
            }, 1000);
        }
    },
    jiesuan: function (data) {
        var self = this;
        //uid":244,"score":-95,"total_score":40,"pai_arr":[30,16],"pai_type":1,"pai_point":9
        for (var i = 0; i < data['players'].length; i++) {
            var player = data['players'][i];
            var uid = player['uid'];
            var row = self.uid2position[uid];
            var rowNode = self.PaisUnitNode['row' + row];
            rowNode['CardTypeUnit'].setVisible(player['pai_type'] > 0 && player['is_visible']);
            if (player['is_visible']) {
                for (var k = 0; k < player['pai_arr'].length; k++) {
                    self.showPaiAnim(row, k, player['pai_arr'][k]);
                }
                rowNode['CardTypeUnit']['sanNode'].setVisible(player['pai_type'] == 1);
                rowNode['CardTypeUnit']['duiNode'].setVisible(player['pai_type'] == 2);
                if (player['pai_type'] == 1) {//散牌
                    rowNode['CardTypeUnit']['sanNode']['num'].setString(player['pai_point'] + '点');
                } else if (player['pai_type'] == 2) {//对子
                    var childlist = rowNode['CardTypeUnit']['duiNode'].getChildren();
                    _.forIn(childlist, function (child) {
                        child.setVisible(false);
                    });
                    var pai0 = player['pai_arr'][0];
                    var pai1 = player['pai_arr'][1];
                    var index = Math.floor(pai0 / 13);
                    if (index < 4) {
                        var value = pai0 % 13 + 1;
                        rowNode['CardTypeUnit']['duiNode']['dui_' + value].setVisible(true);
                    } else if (pai0 == pai1) {
                        if (pai0 == 52) {
                            rowNode['CardTypeUnit']['duiNode']['dui_14'].setVisible(true);
                        } else {
                            rowNode['CardTypeUnit']['duiNode']['dui_15'].setVisible(true);
                        }
                    } else {
                        rowNode['CardTypeUnit']['duiNode']['dui_16'].setVisible(true);
                    }
                }
            }
            if (player['is_loser']) {
                var dataplayer = self.uid2playerInfo[uid];
                dataplayer['loser'] = player['is_loser'];
                var infoNode = self.PlayersUnitNode['info' + row];
                infoNode['liuzuolixi'].setVisible(player['is_loser']);
            }
            self.showChangeScore(row, player['score']);
        }
        if (gameData.trusteeship) {
            self.showJiesuanWindow(data);
        } else {
            setTimeout(function () {
                self.showJiesuanWindow(data);
            }, 2000);
        }
    },
    showChangeScore: function (row, score) {
        var self = this;
        if (!score) {
            return;
        }
        var txt = new cc.LabelBMFont(score > 0 ? "+" + score : score, score < 0 ? res.score_blue_fnt : res.score_yellow_fnt);
        var change_sroce_node = self.PlayersUnitNode['info' + row]['change_sroce_node'];
        change_sroce_node.addChild(txt);
        txt.runAction(
            cc.sequence(
                cc.moveBy(1.5, cc.p(0, 20)),
                cc.callFunc(function () {
                    txt.removeFromParent(true);
                })
            )
        );
    },
    //管理设置
    hideControlBtns: function () {
        var self = this;
        var ControlUnit = self["_ControlUnit"];
        ControlUnit["btn_bg"].setVisible(false);
        ControlUnit["touch"].setVisible(false);

        TouchUtils.setOnclickListener(ControlUnit["btn_control_btns"], function () {
            self.changeBtnStatus();
        });

        TouchUtils.setOnclickListener(ControlUnit["touch"], function () {
            self.changeBtnStatus();
        });

        TouchUtils.setOnclickListener(ControlUnit["btn_bg"]["btn_fanhui"], function () {
            if (self.uid == gameData.ownerUid) {
                alert2('确定要申请解散房间吗?', function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                });
            } else {
                //站立，观看
                if (!self.isExist) {
                    alert2('确定要退出房间吗?', function () {
                        network.send(3003, {room_id: gameData.roomId});
                    });
                } else {
                    if (self.roomState != self.roomStatus.CREATED) {
                        alert2('确定要申请解散房间吗?', function () {
                            network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                        });
                    } else {
                        alert2('确定要退出房间吗?', function () {
                            network.send(3003, {room_id: gameData.roomId});
                        });
                    }
                }
            }
        });

        TouchUtils.setOnclickListener(ControlUnit["btn_bg"]["btn_jiesan"], function () {
            if (gameData.ownerUid == self.uid) {
                if (window.inReview) {
                    network.send(3003, {room_id: gameData.roomId});
                } else {
                    alert2("是否确定解散该房间？", function () {
                        network.send(3003, {room_id: gameData.roomId});
                    });
                }
            } else {
                alert2('确定要申请解散房间吗?', function () {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                });
            }
        });

        TouchUtils.setOnclickListener(ControlUnit["btn_bg"]["btn_setting"], function () {
            var setting = HUD.showLayer(HUD_LIST.Settings, self);
            setting.setSetting(self, "epz");//大厅里面打开界面
            setting.setSettingLayerType({hidejiesan: self});
        });
    },
    changeBtnStatus: function () {
        var self = this;
        var ControlUnit = self["_ControlUnit"];
        ControlUnit["touch"].setVisible(!ControlUnit["btn_bg"].isVisible());
        ControlUnit["btn_bg"].setVisible(!ControlUnit["btn_bg"].isVisible());
        ControlUnit["btn_control_btns"].setFlippedY(!ControlUnit["btn_control_btns"].isFlippedY());
        // 自己就是房主
        if (gameData.ownerUid == self.uid) {
            ControlUnit["btn_bg"]["btn_jiesan"].setOpacity(225);
            TouchUtils.setClickDisable(ControlUnit["btn_bg"]["btn_jiesan"], false);
            ControlUnit["btn_bg"]["btn_fanhui"].setOpacity(50);
            TouchUtils.setClickDisable(ControlUnit["btn_bg"]["btn_fanhui"], true);
        } else {
            if (self.roomState == self.roomStatus.CREATED || !self.isExist) {
                ControlUnit["btn_bg"]["btn_jiesan"].setOpacity(50);
                TouchUtils.setClickDisable(ControlUnit["btn_bg"]["btn_jiesan"], true);
                ControlUnit["btn_bg"]["btn_fanhui"].setOpacity(225);
                TouchUtils.setClickDisable(ControlUnit["btn_bg"]["btn_fanhui"], false);
            } else {
                ControlUnit["btn_bg"]["btn_jiesan"].setOpacity(225);
                TouchUtils.setClickDisable(ControlUnit["btn_bg"]["btn_jiesan"], false);
                ControlUnit["btn_bg"]["btn_fanhui"].setOpacity(50);
                TouchUtils.setClickDisable(ControlUnit["btn_bg"]["btn_fanhui"], true);
            }
        }
    },
    getChatInfoNode: function (row) {
        var self = this;
        var infoNode = self.PlayersUnitNode['info' + row];
        var ChatInfo = infoNode["ChatInfo"];
        return ChatInfo;
    },
    getRowByUid: function (uid) {
        var self = this;
        return self.uid2position[uid];
    },
    showPlayerInfoPanel: function (idx) {
        var self = this;
        if (window.inReview || self.isReplay)
            return;
        if (self.position2playerArrIdx[idx] >= gameData.players.length)
            return;
        var playerInfo = gameData.players[self.position2playerArrIdx[idx]];
        var hideBtn = self.roomState == self.roomStatus.CREATED;

        // this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', hideBtn);
        // this.addChild(this.playerInfoLayer);

        if(res.PlayerInfoOtherNew_json && gameData.opt_conf.xinbiaoqing == 1){
            this.playerInfoLayer = new PlayerInfoLayerInGame(playerInfo, false);
            this.addChild(this.playerInfoLayer);
        }else{
            this.playerInfoLayer = new PlayerInfoLayer(playerInfo, this, 'poker', hideBtn);
            this.addChild(this.playerInfoLayer);
        }
    },
    getRootNode: function () {
        return this;
    },
    getOriginalPos: function () {
        return this.originalPos;
    },
    getEffectEmojiPos: function (caster, patient) {
        var self = this;
        var pos = {};
        var infoCaster = self.PlayersUnitNode['info' + caster];
        pos[caster] = infoCaster ? infoCaster.convertToWorldSpace(infoCaster["PlayerInfoUnit"]['root']["head"].getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        var infoPatient = self.PlayersUnitNode['info' + patient];
        pos[patient] = infoPatient ? infoPatient.convertToWorldSpace(infoPatient["PlayerInfoUnit"]['root']["head"].getPosition()) : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        return pos;
    },
    setReplayProgress: function (cur, total) {
        var progress = cur / total * 100;
        this.showTip("进度: " + progress.toFixed(1) + "%", false);
    },
    showTip: function (content, isShake) {
        var self = this;
        isShake = _.isUndefined(isShake) ? true : isShake;
        var scale9sprite = self['_TipUnit']['top_tip'];
        if (!(scale9sprite instanceof cc.Scale9Sprite)) {
            var lb = self['_TipUnit']['top_tip']['lb_tip'];
            var newScale9sprite = new cc.Scale9Sprite(res.round_rect_91, cc.rect(0, 0, 91, 32), cc.rect(46, 16, 1, 1));
            newScale9sprite.setName("top_tip");
            scale9sprite.setAnchorPoint(0.5, 0.5);
            newScale9sprite.setPosition(scale9sprite.getPosition());
            scale9sprite.getParent().addChild(newScale9sprite);
            self['_TipUnit']['top_tip'] = newScale9sprite;

            text = new ccui.Text();
            text.setName("lb_tip");
            text.setFontRes(res.default_ttf);
            text.setFontSize(lb.getFontSize());
            text.setTextColor(lb.getTextColor());
            text.enableOutline(cc.color(38, 38, 38), 1);
            newScale9sprite.addChild(text);
            self['_TipUnit']['top_tip']['lb_tip'] = text;

            scale9sprite.removeFromParent(true);
            scale9sprite = newScale9sprite;
        }
        var text = self['_TipUnit']['top_tip']['lb_tip'];
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
        var self = this;
        if (self['_TipUnit']['top_tip'])
            self['_TipUnit']['top_tip'].setVisible(false);
    },
    setOperateFinishCb: function (cb) {
        this.operateFinishCb = cb;
    },
});
