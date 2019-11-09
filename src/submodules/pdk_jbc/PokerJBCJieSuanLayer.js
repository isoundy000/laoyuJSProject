/**
 * Created by dengwenzhong on 2017/9/21.
 */
(function () {
    var exports = this;

    var $ = null;

    var HUTYPE_LIUJU = 0;
    var HUTYPE_ZIMO = 1;
    var HUTYPE_DIANPAO = 2;
    var PokerJBCJieSuanLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            AgoraUtil.hideAllVideo();
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            AgoraUtil.showAllVideo();
        },
        ctor: function (data, isReplay, isQiepai) {
            this._super();

            var that = this;
            this._data = data;
            var size = cc.winSize;
            //this.enableClick = true;

            var scene = loadNodeCCS(res.PokerJBCJieSuan_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            var btnFenxiang = $('root.btn_share');
            var btnStart = $('root.btn_again');
            var btnChakan = $('root.btn_chakan');
            var btnSure = $('root.btn_sure');
            // if (gameData.loginType == 'yk') {
            //     btnFenxiang.setVisible(false);
            //     btnStart.setPositionX(btnStart.getParent().getContentSize().width / 2);
            // }

            var isWin = true;
            var players = [];
            var base = $('info0');
            var myScore = 0;
            var lb_leftCards = $('lb_leftCards');
            var lb_bombs = $('lb_bomb');
            var lb_scores = $('lb_score');
            lb_scores.setString('金币');
            // lb_bombs.setVisible(false);
            var is_hide = false;
            //两人玩 BUG
            var players = [];
            var uid2index = {};
            for (var i = 0; i < data.players.length; i++) {
                var player = data.players[i];
                if (player.uid != 0) {
                    players.push(player);
                    uid2index[player.uid] = players.length - 1;
                }

            }
            $('info2').setVisible(false);
            $('info3').setVisible(false);
            $('info1').setVisible(false);

            // if (gameData.mapId == MAP_ID.PDK_MATCH) {
            //     lb_leftCards.x -= 15;
            //     lb_bombs.setVisible(true);
            //     lb_scores.x += 15;
            // }

            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                base = $('info' + i);

                if (player['uid'] == 0) {
                    base.setVisible(false);
                    continue;
                } else {
                    base.setVisible(true);
                    var lb_nickname = $('txt_name', base);
                    var lb_uid = $('txt_id', base);
                    var lb_left = $('lb_left', base);
                    // var lb_score = $('row' + i + '.lb_score', base);
                    var head = $('head', base);
                    var niao = $('niao', base);
                    var spring = $('spring', base);
                    var lb_score = $('txt_score', base);
                    var lb_bomb = $('txt_bomb', base);
                    var ic_broken = $('broken', base);
                    ic_broken.setVisible(false);
                    var ic_full = $('full', base);
                    ic_full.setVisible(false);
                    // lb_bomb.setVisible(false);
                    // var playerName = gameData.playerMap[player.uid].nickname ? gameData.playerMap[player.uid].nickname : '玩家'+i;
                    lb_nickname.setString(ellipsisStr(player['nickname'] || '', 6));
                    lb_uid.setString('' + player.uid);
                    lb_left.setString(player['pai_arr'].length + '张');
                    lb_score.setString('' + player['gold']);
                    if (player['gold'] > 0) {
                        lb_score.setTextColor(cc.color(255, 249, 142));
                    } else {
                        lb_score.setTextColor(cc.color(103, 220, 255));
                    }
                    if (player.uid == gameData.uid) {
                        myScore = player['gold'];
                        lb_nickname.setTextColor(cc.color(255, 249, 142));
                        lb_uid.setTextColor(cc.color(255, 249, 142));
                    }
                    // lb_score.setString('' + player['score']);
                    lb_bomb.setString('' + player['bombs']);
                    // if (gameData.mapId == MAP_ID.PDK_JBC) {
                    //     lb_left.x -= 15;
                    //     lb_bomb.setVisible(true);
                    //     lb_score.x += 15;
                    // }
                    if (player['is_fengding']) {
                        ic_full.setVisible(true);
                        console.log('封顶')
                    }
                    if (player['is_pochan']) {
                        ic_broken.setVisible(true);
                        console.log('破产')
                    }
                    //gameData.playerMap[player.uid].headimgurl
                    loadImageToSprite(player['headimgurl'], head);
                    niao.setVisible(player.uid == data.zhuaniao_uid);
                    spring.setVisible(player.uid == data.chuntian_uid);

                    if (gameData.uid == player.uid) {
                        is_hide = player['is_hide'];
                        console.log('hide button=>', is_hide);
                    }
                    if (gameData.uid == player.uid && player['score'] < 0)
                        isWin = false;
                }

            }

            $('root.btn_again').setVisible(!is_hide);
            $('root.btn_change').setVisible(!is_hide);

            //关牌的判断
            // if(data.map_id == MAP_ID.SC_PDK && data.is_chun){
            //     if(data.guanpai_type){
            //         var idx = uid2index[data.chuntian_uid];
            //         var sprintSp = $('info'+idx + '.spring');
            //         if(sprintSp) {
            //             sprintSp.setTexture("res/submodules/pdk/image/PokerJieSuan/icon_guanpai.png");
            //             sprintSp.setVisible(true);
            //         }
            //     }else{
            //         for(var i=0; i<data.beiguan_uids.length; i++){
            //             var idx = uid2index[data.beiguan_uids[i]];
            //             var sprintSp = $('info'+idx + '.spring');
            //             if(sprintSp){
            //                 sprintSp.setTexture("res/submodules/pdk/image/PokerJieSuan/icon_beiguan.png");
            //                 sprintSp.setVisible(true);
            //             }
            //         }
            //     }
            // }


            if (myScore >= 0) {
                $('root.pic_win').setVisible(true);
                $('root.pic_lose').setVisible(false);
                $('root.losebg').setVisible(false);
                $('root.winbg').setVisible(true);
                if (cc.sys.isNative) {
                    var spNode = playSpAnimation('shenglijiesuan', undefined, false);
                    spNode.setEndListener(function () {
                        setTimeout(function () {
                            //spNode.removeFromParent();
                        }, 1)
                    })
                    spNode.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.65 + 115);
                    this.addChild(spNode);
                }
            } else if (myScore < 0) {
                $('root.pic_win').setVisible(false);
                $('root.pic_lose').setVisible(true);
                $('root.losebg').setVisible(true);
                $('root.winbg').setVisible(false);
            }

            // $('root.panel.bg_base').setVisible(isWin);

            $('root.lb_ts').setString(timestamp2time(data['ts'], "yyyy-mm-dd HH:MM:ss"));
            // $('root.panel.lb_title').setString(title);
            $('root.lb_roomid').setString('房号' + gameData.roomId);
            $('root.lb_jushu').setString('局数' + data['cur_round'] + '/' + data['total_round']);

            $('root.lb_ts').setVisible(false);
            $('root.lb_roomid').setVisible(false);
            $('root.lb_jushu').setVisible(false);
            // if(gameData.mapId == MAP_ID.PDK_MATCH){
            //     $('root.lb_roomid').setVisible(false);
            //     $('root.lb_jushu').setString('轮数' + data['cur_round'] + '/' + data['total_round']);
            // }

            TouchUtils.setOnclickListener(btnFenxiang, function () {
                if (!cc.sys.isNative)
                    return;

                WXUtils.captureAndShareToWX(that, 0x88F0);
            });

            TouchUtils.setOnclickListener(btnStart, function () {
                // ready
                // if (!this.enableClick)
                //     return;
                if (!window.jbcLayer.isReNew()) {
                    network.send(3004, { room_id: gameData.roomId, is_support_qiepai: true });
                } else {
                    network.send(3233, {
                        exit: false,
                        gold_map_id: gameData.mapId,
                        gold_room_lev: gameData.gold_room_lev,
                        room_id: gameData.roomId, map_id: MAP_ID.PDK_JBC
                    });
                    //network.send(3234, {gold_map_id: MAP_ID.PDK_JBC});
                }
                if (window.jbcLayer) window.jbcLayer.onJiesuanClose(true);
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener($('root.btn_change'), function () {
                // ready
                // if (!this.enableClick)
                //     return;
                if (window.jbcLayer) window.jbcLayer.reNew(true);
                network.send(3233, {
                    exit: false,
                    gold_map_id: gameData.mapId,
                    gold_room_lev: gameData.gold_room_lev,
                    room_id: gameData.roomId, map_id: MAP_ID.PDK_JBC
                });
                // network.send(3004, {room_id: gameData.roomId, has_qiepai:true, is_support_qiepai: true});
                if (window.jbcLayer) window.jbcLayer.onJiesuanClose(true);
                that.removeFromParent(true);
            });

            // if(isQiepai){

            // }else{
            //     $('root.btn_again_qiepai').setVisible(false);
            //     btnStart.x = 640;
            // }


            var closeFunc = function () {
                // if(isReplay){
                //     gameData.roomId = 0;
                //     HUD.showScene(HUD_LIST.Home, null);
                // }else{
                //     // ready
                //     window.maLayer.onJiesuanClose(false);
                //     that.removeFromParent(true);
                // }
                network.send(3233, {
                    exit: true,
                    gold_map_id: gameData.mapId,
                    gold_room_lev: gameData.gold_room_lev,
                    room_id: gameData.roomId, map_id: MAP_ID.PDK_JBC
                });

                that.removeFromParent(true);
                // cc.director.runScene(new JBCMainLayer());
                // gameData.enterJBC = true;
                // HUD.showScene(HUD_LIST.Home, null);
                // window.maLayer.onJiesuanClose(false);
            };
            TouchUtils.setOnclickListener($('root.btn_close'), closeFunc);
            // TouchUtils.setOnclickListener(btnSure, closeFunc);
            // TouchUtils.setOnclickListener(btnChakan, function () {
            //     window.maLayer.zongJiesuan();
            //     that.removeFromParent(true);
            // });

            // if (data['is_last']) {
            //     $('root.btn_again_qiepai').setVisible(false);
            //     btnStart.setVisible(false);
            //     btnChakan.setVisible(true);
            //     btnFenxiang.setVisible(false);
            //     $('root.btn_close').setVisible(false);
            //     if (gameData.mapId == MAP_ID.PDK_MATCH) {
            //         btnSure.setVisible(true);
            //         btnChakan.setVisible(false);
            //         $('root.btn_close').setVisible(true);
            //     }
            // }else{
            //     $('root.btn_close').setVisible(false);
            //     btnChakan.setVisible(false);
            // }
            // if(isReplay){
            //     $('root.btn_close').setVisible(true);
            //     btnStart.setVisible(false);
            //     btnChakan.setVisible(false);
            // }

            return true;
        },
        // setClick: function (isEnabled) {
        //     this.enableClick = isEnabled
        // },
        onEnter: function () {
            this._super();
            var that = this;
            this.scheduleOnce(function () {
                $('root.btn_again').setVisible(true);
                $('root.btn_change').setVisible(true);
            }, 3);

            AgoraUtil.hideAllVideo();
        },
        onExit: function () {
            this._super();
            AgoraUtil.showAllVideo();
        }
    });

    exports.PokerJBCJieSuanLayer = PokerJBCJieSuanLayer;
})(window);

