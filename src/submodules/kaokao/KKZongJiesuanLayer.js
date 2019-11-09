/**
 * Created by hjx on 2018/4/25.
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
        "ping": 'res/submodules/kaokao/image/ui/zhanji_ping.png',
        "lose": res.shu_png,
    };

    var KKZongJiesuanLayer = cc.Layer.extend({
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

            var scene = loadNodeCCS(res.KKZongJiesuanLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            if($('root'))  $('root').setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);

            $('root.panel.lb_ts').setString(data.EndTime);//(timestamp2time(data['ts'], "yyyy-mm-dd HH:MM:ss"));
            $('root.panel.lb_roomid').setString('房号' + gameData.roomId);
            gameData.roomId = 0;
            clearGameMWRoomId();
            $('root.panel.lb_jushu').setString('局数' + data['CurrentRound'] + '/' + data['TotalRound']);
            var mapId = gameData.mapId;//data['map_id'];
            var title = (gameData.mapName || (data['map_id'] ? (gameData.mapId2Name(mapId)) || '' : ''));
            $('root.panel.lb_name').setString(title);

            var option = JSON.parse(data.Option);
            $('txt_wanfa').setString(option.desp || '');


            var players = data.Users;

            var myTotalScore = 0;
            var maxScore = 0;
            var maxScoreIdx = -1;
            var maxScoreIdxDayingjia = 0;
            for (var i = 0; i < players.length; i++) {
                //{"UserID":70,"UserName":"","Score":-17,"HeadImgURL":"","RemoteAdress":"192.168.199.203","HuCount":0,"LoseCount":0}
                var player = players[i];
                var uid = player['UserID'];
                var score = player['Score'];
                //var playerInfo = gameData.getPlayerInfoByUid(uid);

                if (uid == 0) {
                    $('root.panel.info' + i).setVisible(false);
                    continue;
                }
                // if (!playerInfo) {
                //     continue;
                // }

                var head = $('root.panel.info' + i + '.head');
                var lbNickname = $('root.panel.info' + i + '.txt_name');
                var lbUid = $('root.panel.info' + i + '.txt_id');
                var lbHu = $('root.panel.info' + i + '.txt_hu');
                var lbDianpao = $('root.panel.info' + i + '.txt_dian');
                var lbTuo = $('root.panel.info' + i + '.txt_tuo');
                var lbTotalSocre = $('root.panel.info' + i + ".txt_score");
                var lbTotalSocre2 = $('root.panel.info' + i + ".txt_score2");
                var result = $('root.panel.info' + i + ".icon_result");
                var word_zong = $('root.panel.info' + i + ".word_zong");
                var bg =  $('root.panel.info' + i + ".bg");

                lbHu.setString(player.HuCount || 0);
                lbDianpao.setString(player.LoseCount || 0);
                lbTuo.setString(player.MaxTuo || 0);

                loadImageToSprite(player.HeadImgURL, head);
                lbNickname.setString(ellipsisStr(player.UserName, 5));
                lbUid.setString('ID ' + player.UserID);
                $('root.panel.info' + i + ".sp_dayingjia").setVisible(false);
                // $(info + i + ".icon_fz").setVisible(player.uid == data.owner_id);
                if (player.UserID == gameData.uid) {
                    myTotalScore = player.Score;
                }
                if (score > 0) {
                    lbTotalSocre.setString("+" + score);
                    lbTotalSocre2.setVisible(false);
                    word_zong.setTexture('res/submodules/kaokao/image/ui/ying.png')
                    bg.loadTexture('res/submodules/kaokao/image/ui/yingbg.png')
                    ///Users/hjx/Documents/workspace/fydp/ccui/cocosstudio/submodules/kaokao/image/ui/shubg.png
                } else {
                    lbTotalSocre.setVisible(false);
                    lbTotalSocre2.setString(score);
                    word_zong.setTexture('res/submodules/kaokao/image/ui/shu.png')
                    bg.loadTexture('res/submodules/kaokao/image/ui/shubg.png')
                }
                if (score > 0) {
                    result.setTexture(RESULT_TEXTURE["win"]);
                } else if (score < 0) {
                    result.setTexture(RESULT_TEXTURE["lose"])
                } else {
                    result.setTexture(RESULT_TEXTURE["ping"]);
                }

                if (score > maxScoreIdxDayingjia) {
                    maxScoreIdxDayingjia = score;
                    maxScoreIdx = i;
                }
            }
            if (i == 3) {
                $('root.panel.info' + 3).setVisible(false);
                for (var i = 0; i < 3; i++) {
                    $('root.panel.info' + i).x += 144;
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
                // $('root.panel.btn_close').setPositionX(1280 / 2);
            }
            TouchUtils.setOnclickListener($('root.panel.btn_close'), function () {
                gameData.roomId = 0;
                clearGameMWRoomId();


                HUD.showScene(HUD_LIST.Home, null);
            });
            if ($('root.panel.info0.icon_fz'))
                $('root.panel.info0.icon_fz').setVisible(!data['is_daikai']);

            $('root.daikuan').setVisible(!window.inReview);
            TouchUtils.setOnclickListener($('root.daikuan'), function () {
                if (cc.sys.isNative) {
                    cc.sys.openURL(DAIKUAN_URL);
                } else {
                    window.open(DAIKUAN_URL, "_blank");
                }

            });

            return true;
        }
    });
    exports.KKZongJiesuanLayer = KKZongJiesuanLayer;
})(window);