/**
 * Created by yu on 2018/8/31.
 */
// 'use strict';
(function (exports) {
    var $ = null;
    var exports = this;

    var JBCMainLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            var that = this;
            this._time = 0;
            this.matchArr = [];
            this._curMatchId = 0;
            this._mapid = 0;

            this._canSign = true;


            //this.btnNameArr = ['btn_mfs', 'btn_fks', 'btn_hbs', 'btn_sws'];
            loadNodeCCS(res.JBCMainLayer_json, this);
            // var scene = ccs.load(res.JBCMainLayer_json, "res/");
            // this.addChild(scene.node);

            $ = create$(this.getChildByName("Layer"));

            TouchUtils.setOnclickListener($('root.btn_back'), function () {
                //that.removeFromParent();
                HUD.showScene(HUD_LIST.Home, null);
            });

            TouchUtils.setOnclickListener($('root.btn_help'), function () {
                HUD.showLayer(HUD_LIST.RuleJBC_PDK, cc.director.getRunningScene());
            });

            // var str = '{"cmd":"getList","list":[{"base_score":100,"maxGold":12000,"baseGold":100,"out":1000,"limit_upper":10000,"time_online":"2018-01-01 00:00:00","user_num":1598,"outGold":5000,"deduction":100,"minGold":5000,"name":"初级场","mapId":30200,"id":1,"limit_lowest":1000,"lev":1,"key":"30200_1"},{"base_score":100,"maxGold":15000,"baseGold":200,"out":1000,"limit_upper":100000,"time_online":"2018-01-01 00:00:00","outGold":12000,"deduction":200,"minGold":12000,"name":"中级场","mapId":30200,"id":2,"limit_lowest":10000,"lev":2,"key":"30200_2"},{"base_score":100,"maxGold":20000,"baseGold":300,"out":1000,"limit_upper":1000000,"time_online":"2018-01-01 00:00:00","outGold":100000,"deduction":300,"minGold":15000,"name":"高级场","mapId":30200,"id":3,"limit_lowest":10000,"lev":3,"key":"30200_3"},{"base_score":100,"maxGold":20000,"baseGold":300,"out":1000,"limit_upper":1000000,"time_online":"2018-01-01 00:00:00","outGold":100000,"deduction":300,"minGold":15000,"name":"vip场","mapId":30200,"id":4,"limit_lowest":10000,"lev":4,"key":"30200_3"}]}';
            // var dataArr = JSON.parse(str);
            // console.log(dataArr);
            // that.refreshLevel(dataArr);

            // $('root.coin.lb_coin').setString(10000);
            // $('root.gem.lb_gem').setString(10000);

            TouchUtils.setOnclickListener($('root.coin.btn_add'), function () {
                // cc.eventManager.dispatchCustomEvent('addCoin');
                if (window.mScene) window.mScene.clickShop(2);
            });

            TouchUtils.setOnclickListener($('root.gem.btn_add'), function () {
                // cc.eventManager.dispatchCustomEvent('adddiamond');
                if (window.mScene) window.mScene.clickShop(3);
            });

            TouchUtils.setOnclickListener($('root.btn_quickstart'), function () {
                network.send(3234, { gold_map_id: MAP_ID.PDK_JBC, map_id: MAP_ID.PDK_JBC });
            });
            window.jbcMainLayer = this;

            return true;
        },
        // freshFk: function () {
        //     $('root.fklb').setString(gameData.numOfCards[1]);
        // },
        onEnter: function () {
            this._super();
            var that = this;
            var coins = gameData.numOfCards;


            $('root.coin.lb_coin').setString(equalNum(coins[0]));
            $('root.gem.lb_gem').setString(equalNum(coins[2]));

            showLoading('正在获取数据..');
            //network.send(3013);
            network.send(99999, { cmd: 'getList', area: gameData.parent_area });

            // this.schedule(this.didTimeCount, 1);
            this.list_getList = cc.eventManager.addCustomListener("jbc_getList", function (event) {
                gameData.mapJBCName = {};
                gameData.mapJBCBase = {};
                var data = event.getUserData();
                var ecode = data['errorCode'];
                if (!ecode) {
                    that.refreshLevel(data);
                    hideLoading();
                } else {
                    hideLoading();
                    alert1(data['errorMsg'], null, null, false, true, true);
                }
            });

            this.updateFk = cc.eventManager.addCustomListener('updateFk', function (event) {
                // network.addListener(3013, function (data) {
                var data = event.getUserData();
                var numOfCards = data["numof_cards"];
                if (numOfCards && numOfCards.length > 0) {
                    $('root.coin.lb_coin').setString(equalNum(numOfCards[0]));
                    $('root.gem.lb_gem').setString(equalNum(numOfCards[2]));
                }
            });

            network.addListener(3230, function (data) {
                console.log(data);
                var code = data['errorCode'];
                var msg = data['errorMsg'];
                if (code == -6 || code == -7) {
                    alert1(msg);
                }
                if (code == -8) {
                    network.send(99998, { cmd: 'addEncourageCoin', area: 'niuniu' });
                    // alert2('当前金币不足，是否充值', function () {
                    //     if (window.mScene) window.mScene.clickShop(2);
                    // })
                }
            });

            network.addListener(3234, function (data) {
                console.log(data);
                var code = data['errorCode'];
                var msg = data['errorMsg'];
                if (code == -4) {
                    network.send(99998, { cmd: 'addEncourageCoin', area: 'niuniu' });
                    // alert2(msg, function(){
                    //     if(window.mScene)  window.mScene.clickShop(2);
                    // })
                }

            });
            // network.addListener(3002, function(data, errorCode){
            //     window.mScene.onJoinRoom(data, errorCode);
            // });
            // network.addListener(3006, function(data, errorCode){
            //     window.mScene.onReContent(data);
            // });

            network.addListener(99998, function (data) {
                var errorCode = data['errorCode'];
                if (errorCode == 0) {
                    var coins = gameData.numOfCards;
                    coins[0] = data['currentGoldNum'];
                    $('root.coin.lb_coin').setString(coins[0]);
                    network.send(3013);

                    alert1('您的金币不足，系统免费赠送您' + data['perchipnum'] + "金币", function () {
                        // if (gameData.numOfCards[0] >= that['minGold']) {
                        //     if (that['minGold'] && that.level) {
                        network.send(3230, { gold_map_id: MAP_ID.PDK_JBC, gold_room_lev: that.level, map_id: MAP_ID.PDK_JBC });
                        //     }
                        // } else {
                        //     alert2('当前金币不足，是否充值', function () {
                        //         if (window.mScene) window.mScene.clickShop(2);
                        //     })
                        // }
                    });
                } else {
                    alert2('当前金币不足，是否充值', function () {
                        if (window.mScene) window.mScene.clickShop(2);
                    })
                }
            });
        },
        refreshLevel: function (data) {

            var dataArr = data['list'] || [];
            this.scrollView = $('root.scrollView');

            this.scrollView.removeAllChildren(true);

            this.layout = new ccui.Layout();
            this.totalWidth = 0;
            for (var i = 0; i < dataArr.length; i++) {
                var lev = dataArr[i]['lev'];
                var name = dataArr[i]['name'];
                var base = dataArr[i]['baseGold'];
                gameData.mapJBCName[lev] = name;
                gameData.mapJBCBase[lev] = base;
                this.initLevelItem(dataArr[i], lev);
            }
            console.log(gameData.mapJBCBase);
            console.log(gameData.mapJBCName);

            this.scrollView.setInnerContainerSize(cc.size(this.totalWidth, this.scrollView.getContentSize().height));
            this.scrollView.addChild(this.layout);
            this.layout.setPositionX(20);
        },
        setClickInfo: function (level, minGold) {
            this.level = level;
            this.minGold = minGold;
        },
        getCurLevel: function () {
            return this.level;
        },
        getCurMin: function () {
            return this.minGold;
        },
        initLevelItem: function (data, lev) {
            var item = new JBCLevelItem(data, lev, this);
            this.layout.addChild(item);
            var itemWidth = item.getLayerWidth();
            item.setPositionX(this.totalWidth);
            item.setPositionY(-85);

            this.totalWidth += itemWidth;
        },
        // didTimeCount: function (dt) {

        //     this._time++;
        //     if (this._time >= 20) {
        //         //hideLoading();
        //         //network.send(3333, {cmd: 'setPushState', params: {type: 1}});
        //         this._time = 0;
        //     }
        // },
        showToast: function (msg) {
            console.log('toast', msg);
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
        onExit: function () {
            this._super();
            // network.send(3333, {cmd: 'setPushState', params: {type: 0}});
            cc.eventManager.removeListener(this.list_getList);
            cc.eventManager.removeListener(this.updateFk);
            // cc.eventManager.removeListener(this.list_getMatchRecord);
            // cc.eventManager.removeListener(this.list_signup);
            // cc.eventManager.removeListener(this.list_cancel);
            // cc.eventManager.removeListener(this.list_putMatchInfo);
            // this.unschedule(this.didTimeCount);

        }

        // /**
        //  * 加入房间 3002
        //  */
        // onJoinRoom: function (data, errorCode) {
        //     if (errorCode) {
        //         var errorMsg = null;
        //         if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
        //         if (errorCode == -30) errorMsg = '该房间已满员, 无法加入';
        //         if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
        //         if (errorCode == -40) errorMsg = '您的房卡不足';
        //         if (errorCode == -2) errorMsg = '版本过低。请退出后重新登陆';
        //         if (data && data.errorMsg) {
        //             errorMsg = data.errorMsg;
        //         }
        //         alert1(errorMsg, null, null, true, true, true);
        //         HUD.removeLoading();
        //         return;
        //     }
        //
        //     //加入房间成功  立即停止魔窗循环检测
        //     gameData.roomId = data['room_id'];
        //     gameData.mapId = data['map_id'];
        //     gameData.gold_room_lev = data["gold_room_lev"] || 1;
        //     gameData.players = data['players'];
        //     gameData.ownerUid = data['owner'];
        //     gameData.last3002 = data;
        //     gameData.wanfaDesp = data['desp'];
        //     gameData.playerNum = data['max_player_cnt'];
        //     gameData.daikaiPlayer = data['daikai_player'];
        //     gameData.curRound = data['cur_round'];
        //     gameData.totalRound = data['total_round'];
        //     gameData.leftRound = data['left_round'] ? data['left_round'] : data['total_round'] - 1;
        //
        //
        //     mRoom.club_id = data['club_id'];
        //     if (!data['club_id'] && data['options']) {
        //         var options = (_.isString(data['options']) ? JSON.parse(data['options']) : data['options']);
        //         mRoom.club_id = options['club_id'];
        //     }
        //
        //     if (data['options']) {
        //         gameData.options = data['options'];
        //         gameData.yunxujiaru = data['options']['yunxujiaru'];
        //         if (data['options']['maxPlayerCnt']) {
        //             gameData.playerNum = data['options']['maxPlayerCnt'];
        //         }
        //     }
        //
        //     // gameData.matchId = data['match_id'] || 0;
        //     // console.log('比赛场 match_id == ' + gameData.matchId);
        //     // if (gameData.matchId) {
        //     //     gameData.matchInfo = data['match_info'];
        //     //     gameData.baseScore = data['init_base_score'] || 0;
        //     //     gameData.playTime = data['play_time'] || 12;
        //     //     if (gameData.matchId) {//自动准备
        //     //         network.send(3004, {room_id: gameData.roomId});
        //     //     }
        //     //     //自己发2006
        //     //     if (!gameData.last3002Data) {
        //     //         if (!data.isself) {
        //     //             gameData.last3002Data = data;
        //     //             network.send(2006, {map_id: gameData.mapId});
        //     //         } else {
        //     //             network.stop();
        //     //             if (this.returnRoomId) {
        //     //             } else {
        //     //                 this.intoRoom();
        //     //             }
        //     //         }
        //     //     }
        //     // } else {
        //         network.stop();
        //         if (this.returnRoomId) {
        //         } else {
        //             this.intoRoom();
        //         }
        //     // }
        // },
        // /**
        //  * 进入房间
        //  * @param data
        //  */
        // intoRoom: function (data) {
        //     SubUpdateUtils.showGameScene(data);
        // }
    });

    exports.JBCMainLayer = JBCMainLayer;
})(window);