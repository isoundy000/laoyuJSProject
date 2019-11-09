(function () {
    var exports = this;

    var $ = null;

    var ZongJiesuanLayerZJH = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data) {
            this._super();

            var that = this;

            // var scene = ccs.load(psz_res.ZongJiesuanLayerZJH_json, 'res/');
            var scene = loadNodeCCS(psz_res.ZongJiesuanLayerZJH_json, this, 'Scene');
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            $('lb_ts').setString(timestamp2time(data['ts'], "yyyy-mm-dd HH:MM:ss"));
            $('lb_roomid').setString('房号' + gameData.roomId);
            $('lb_jushu').setString('局数' + data['cur_round'] + '/' + data['total_round']);

            //活动的总结算
            if(gameData.zongJieSuanHuodong) {
                gameData.zongJieSuanHuodong(gameData.parent_area, gameData.roomId, data['ts'], data['cur_round']);
            }

            var players = data.players;


            var myTotalScore = 0;
            var highestScore = 0;
            var lowestScore = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var score = player.total_score;
                if (score > highestScore) {
                    highestScore = score;
                }
                if (score < lowestScore) {
                    lowestScore = score;
                }
                var playerInfo = gameData.getPlayerInfoByUid(players[i].uid);
                if (!playerInfo) {
                    continue;
                }

                $("info" + i).setVisible(true);
                loadImageToSprite(decodeURIComponent(playerInfo.headimgurl), $('info' + i + '.head'));
                $("info" + i + '.txt_name').setString(ellipsisStr(decodeURIComponent(playerInfo.nickname), 5));
                $("info" + i + '.txt_id').setString('ID:' + playerInfo.uid);
                $("info" + i + ".icon_fz").setVisible(player.uid == data.owner_id && !data['is_daikai']);
                if (player.uid == gameData.uid) {
                    myTotalScore = score;
                }
                var lbTotalSocre = $("info" + i + ".txt_score");
                var lbTotalSocre2 = $("info" + i + ".txt_score2");
                if (score > 0) {
                    lbTotalSocre.setVisible(true);
                    lbTotalSocre2.setVisible(false);
                    lbTotalSocre.setString("+" + score);
                } else {
                    lbTotalSocre.setVisible(false);
                    lbTotalSocre2.setVisible(true);
                    lbTotalSocre2.setString(score);
                }
                var bg = $('info' + i + '.bg');
                if (score >= 0) {
                    bg.setTexture('res/submodules/psz/image/ZongJiesuan_zjh/jiesuan_item2.png');
                } else {
                    bg.setTexture('res/submodules/psz/image/ZongJiesuan_zjh/jiesuan_item3.png');
                }
            }
            for (var i = 0; i < players.length; i++) {
                var player = players[i];

                var result = $("info" + i + ".icon_dyj");
                result.setVisible(false);
                if(player.total_score == highestScore) {
                    result.setVisible(true);
                    result.setTexture('res/submodules/psz/image/ZongJiesuan_zjh/dyj.png');
                }else if(player.total_score == lowestScore) {
                    result.setVisible(true);
                    result.setTexture('res/submodules/psz/image/ZongJiesuan_zjh/thl.png');
                }
            }
            for(;i<9;i++){
                $("info" + i).setVisible(false);
            }

            if (myTotalScore >= 0) {
                playEffect('vvictory');
            } else {
                playEffect('vfailure');
            }
            var btnShare = $('btn_share');
            if (gameData.loginType == 'yk') {
                btnShare.setVisible(false);
            }

            if(window.inReview){
                btnShare.setVisible(false);
                $('btn_close').setPositionX(1280/2);
            }
            TouchUtils.setOnclickListener(btnShare, function () {
                if (!cc.sys.isNative)
                    return;
                // WXUtils.captureAndShareToWX(that,0x88F0);
                // that.addChild(new ShareTypeLayer(that));

                that.addChild(new ShareTypeLayer(that), 100);
            });

            // network.disconnect();
            gameData.lastRoom = 0;
            // Filter.grayScale($('btn_close'));
            TouchUtils.setOnclickListener($('btn_close'), function () {
                HUD.showScene(HUD_LIST.Home, null);
            });

            return true;
        },
        scheduleClose: function (time) {
            var that = this;
            if (time > 0) {
                $('btn_close.Text_60').setString(time + '秒后可关闭');
                that.stopAllActions();
                that.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function () {
                        that.scheduleClose(time - 1);
                    })
                ))
            } else {
                Filter.remove($('btn_close'));
                $('btn_close.Text_60').setString('关 闭');
                TouchUtils.setOnclickListener($('btn_close'), function () {
                    HUD.showScene(HUD_LIST.Home, null);
                });
            }
        },
        onEnter: function () {
            this._super();
            AgoraUtil.hideAllVideo();
        },
        onExit: function () {
            this._super();
            AgoraUtil.showAllVideo();
        }
    });

    exports.ZongJiesuanLayerZJH = ZongJiesuanLayerZJH;
})(window);
