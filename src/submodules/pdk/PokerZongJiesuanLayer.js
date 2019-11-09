/**
 * Created by dengwenzhong on 2017/9/21.
 */
(function () {
    var exports = this;

    var $ = null;


    //var RESULT_TEXTURE = {};
    // RESULT_TEXTURE["win"] = cc.textureCache.addImage ("res/poker/jiesuan/ying.png");
    // RESULT_TEXTURE["ping"] = cc.textureCache.addImage("res/poker/jiesuan/ying.png");
    // RESULT_TEXTURE["lose"] = cc.textureCache.addImage("res/poker/jiesuan/shu.png");
    var RESULT_TEXTURE = {
        "win": res.ying_png,
        "ping": res.ping_png,
        "lose": res.shu_png,
    };

    var PokerZongJiesuanLayer = cc.Layer.extend({
        onEnter: function () {
            this._super();
            AgoraUtil.hideAllVideo();
        },
        onExit: function () {
            this._super();
            AgoraUtil.showAllVideo();
        },
        ctor: function (data) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.PokerZongJieSuan_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            $('root.panel.lb_ts').setString(timestamp2time(data['ts'], "yyyy-mm-dd HH:MM:ss"));
            $('root.panel.lb_roomid').setString('房号' + gameData.roomId);
            clearGameMWRoomId();
            $('root.panel.lb_jushu').setString('局数' + data['cur_round'] + '/' + data['total_round']);
            var mapId = data['map_id'];
            var title = (gameData.mapName || (data['map_id'] ? (gameData.mapId2Name(mapId)) || '' : ''));
            $('root.panel.lb_name').setString(title);

            //活动的总结算
            if(gameData.zongJieSuanHuodong) {
                gameData.zongJieSuanHuodong(gameData.parent_area, gameData.roomId, data['ts'], data['cur_round']);
            }

            gameData.roomId = 0;


            var players = data.players;

            var myTotalScore = 0;
            var maxScore = 0;
            var maxScoreIdx = -1;
            var maxScoreIdxDayingjia = 0;
            if (gameData.playerNum == 3) {
                var info4 = $("root.panel.info3");
                info4.setVisible(false);
                var offX = 1280/4;
                for (var i = 0; i < gameData.playerNum; i++) {
                    var info = $("root.panel.info" + i);
                    info.setPositionX( 8 + offX  * (i+1) - 153);
                }
            }else if(gameData.playerNum == 2){
                var info3 = $("root.panel.info2");
                var info4 = $("root.panel.info3");
                info3.setVisible(false);
                info4.setVisible(false);
                var offX = 1280/3;
                for (var i = 0; i < gameData.playerNum; i++) {
                    var info = $("root.panel.info" + i);
                    info.setPositionX( 8 + offX  * (i+1) - 153);
                }
            }
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var uid = player['uid'];
                var maxScore = player['max_score'];
                var totalBombs = player['total_bombs'];
                var win = player['win'];
                var lose = player['lose'];
                var score = player['score'];
                var playerInfo = gameData.getPlayerInfoByUid(uid);

                if (uid == 0) {
                    $('root.panel.info' + i).setVisible(false);
                    continue;
                }
                if (!playerInfo) {
                    continue;
                }

                var head = $('root.panel.info' + i + '.head');
                var lbNickname = $('root.panel.info' + i + '.txt_name');
                var lbUid = $('root.panel.info' + i + '.txt_id');
                var lbMaxScore = $('root.panel.info' + i + '.txt_high');
                var lbTotalBombs = $('root.panel.info' + i + '.txt_bomb');
                var lbSucess = $('root.panel.info' + i + '.txt_sucess');
                var lbFail = $('root.panel.info' + i + '.txt_fail');
                var lbTotalSocre = $('root.panel.info' + i + ".txt_score");
                var lbTotalSocre2 = $('root.panel.info' + i + ".txt_score2");
                var result = $('root.panel.info' + i + ".icon_result");
                var score_bg = $('root.panel.info' + i + ".score_back");

                loadImageToSprite(playerInfo.headimgurl, head);
                lbNickname.setString(ellipsisStr(playerInfo.nickname, 5));
                lbUid.setString('ID ' + playerInfo.uid);
                lbMaxScore.setString(maxScore);
                lbTotalBombs.setString(totalBombs);
                $('root.panel.info' + i + ".txt_beiguan").setString(player['beiguan_num']);
                if(gameData.mapId != MAP_ID.SC_PDK){
                    $('root.panel.info' + i + ".txt_beiguan").setVisible(false)
                    $('root.panel.info' + i + ".lbl_beiguan").setVisible(false)
                }
                lbSucess.setString(win);
                lbFail.setString(lose);
                $('root.panel.info' + i + ".sp_dayingjia").setVisible(false);
                // $(info + i + ".icon_fz").setVisible(player.uid == data.owner_id);
                if (player.uid == gameData.uid) {
                    myTotalScore = player.score;
                }
                if (score > 0) {
                    lbTotalSocre.setString(score);
                    lbTotalSocre2.setVisible(false);
                } else {
                    lbTotalSocre.setVisible(false);
                    lbTotalSocre2.setString(score);
                }
                if (score > 0) {
                    result.setTexture(RESULT_TEXTURE["win"]);
                    score_bg.loadTexture('res/submodules/pdk/image/PokerZongJiesuan/back2.png');
                } else if (score < 0) {
                    result.setTexture(RESULT_TEXTURE["lose"]);
                    score_bg.loadTexture('res/submodules/pdk/image/PokerZongJiesuan/back3.png');
                } else {
                    result.setTexture(RESULT_TEXTURE["ping"]);
                    score_bg.loadTexture('res/submodules/pdk/image/PokerZongJiesuan/back2.png');

                }

                if (score > maxScoreIdxDayingjia) {
                    maxScoreIdxDayingjia = score;
                    maxScoreIdx = i;
                }
            }
            if (maxScoreIdx >= 0) {
                $('root.panel.info' + maxScoreIdx + ".sp_dayingjia").setVisible(true);
            }

            if (myTotalScore >= 0) {
                playEffect('vvictory');
            } else {
                playEffect('vfailure');
            }
            var btnShare = $('root.panel.btn_share');
            if (gameData.loginType == 'yk') {
                btnShare.setVisible(false);
            }
            TouchUtils.setOnclickListener(btnShare, function () {
                if (!cc.sys.isNative)
                    return;

                // captureAndShareToWX(that);
                // WXUtils.captureAndShareToWX(that, 0x88F0);

                that.addChild(new ShareTypeLayer(that), 100);

            });

            if (window.inReview) {
                btnShare.setVisible(false);
                $('root.panel.btn_close').setPositionX(1280 / 2);
            }
            TouchUtils.setOnclickListener($('root.panel.btn_close'), function () {
                gameData.roomId = 0;
                clearGameMWRoomId();


                HUD.showScene(HUD_LIST.Home, null);
            });
            if ($('root.panel.info0.icon_fz'))
                $('root.panel.info0.icon_fz').setVisible(!data['is_daikai']);


            return true;
        }
    });

    exports.PokerZongJiesuanLayer = PokerZongJiesuanLayer;
})(window);
