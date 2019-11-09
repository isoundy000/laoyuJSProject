(function () {
    var exports = this;

    var $ = null;

    var NUM_TO_ZHONGWEN = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二',
        13: '十三',
        14: '十四',
        15: '十五',
        16: '十六',
        17: '十七',
        18: '十八',
        19: '十九',
        20: '二十'
    };

    var ZongJiesuanLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data) {
            this._super();

            var that = this;

            var size = cc.winSize;

            var scene = loadNodeCCS(res.Ma_ZongJiesuanLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));


            //活动的总结算
            if(gameData.zongJieSuanHuodong){
                gameData.zongJieSuanHuodong(gameData.parent_area, gameData.roomId, data['ts'], data['cur_round']);
            }

            var players = data.players;
            var wanfa = (data['map_id'] ? ('玩法：'+gameData.mapId2Name(data['map_id'])): '玩法：');

            $('root.panel.lb_ts').setString(timestamp2time(data['ts']));
            $('root.panel.lb_wanfa').setString(wanfa);
            $('root.panel.lb_roomid').setString('房号：' + gameData.roomId + '   局数：' + data['cur_round'] + '/' + data['total_round']);

            var maxDianpao = 0;
            var maxScore = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (maxDianpao < player['dianpao'])
                    maxDianpao = player['dianpao'];
                if (maxScore < player['score'])
                    maxScore = player['score'];
            }


            var myTotalScore = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var uid = player['uid'];
                var zimo = player['zimo'];
                var jiepao = player['jiepao'];
                var dianpao = player['dianpao'];
                var angang = player['angang'];
                var minggang = player['minggang'];
                var score = player['score'];
                var score_list = player['scores'] || [1,12,13,114,115,6,7,8];

                var playerInfo = gameData.getPlayerInfoByUid(uid);
                if (!playerInfo)
                    continue;

                var info = $('root.panel.row' + i + '.info');
                var head1 = $('root.panel.row' + i + '.info.head1');
                var head2 = $('root.panel.row' + i + '.info.head2');
                var lbNickname = $('root.panel.row' + i + '.info.lb_nickname');
                var lbUid = $('root.panel.row' + i + '.info.lb_uid');
                // var lbZimo = $('root.panel.row' + i + '.lb_zimo');
                // var lbJiepao = $('root.panel.row' + i + '.lb_jiepao');
                // var lbDianpao = $('root.panel.row' + i + '.lb_dianpao');
                // var lbAngang = $('root.panel.row' + i + '.lb_angang');
                // var lbMinggang = $('root.panel.row' + i + '.lb_minggang');

                var lb_score_win = $('root.panel.row' + i + '.lb_score_win');
                var lb_score_fail = $('root.panel.row' + i + '.lb_score_fail');

                var score_bg_lan = $('root.panel.row' + i + '.score_bg_lan');
                var score_bg_huang = $('root.panel.row' + i + '.score_bg_huang');


                //头像
                var clipper = function () {  //创建剪切区域
                    var clipper = new cc.ClippingNode();
                    var gameTitle = new cc.Sprite('res/image/head.png');
                    gameTitle.setScale(0.5);
                    clipper.setAlphaThreshold(255);
                    clipper.setStencil(gameTitle);
                    clipper.setAlphaThreshold(0);
                    clipper.setContentSize(cc.size(gameTitle.getContentSize().width, gameTitle.getContentSize().height));
                    return clipper;
                }
                var clip = clipper();
                clip.setPosition(head1.getPosition());
                info.addChild(clip);
                var avator = new cc.Sprite('res/image/defaultHead.jpg');
                avator.setScale(0.75);
                avator.setPosition(cc.p(0, 0));
                clip.addChild(avator);
                var url = decodeURIComponent(playerInfo.headimgurl);
                if (url == undefined || (url.length == 0)) url = res.defaultHead;
                loadImageToSprite2(url, avator);//头像

                head1.setLocalZOrder(1);
                head2.setLocalZOrder(1);

                lbNickname.setString(playerInfo.nickname);
                lbUid.setString('ID: ' + playerInfo.uid);

                if (window.inReview)
                    lbUid.setVisible(false);

                var sv = $('root.panel.row' + i + '.sv');
                var row0 = $('row0', sv);
                row0.setVisible(false);
                var totalheight = row0.getContentSize().height * score_list.length;
                if (totalheight < sv.getContentSize().height)
                    totalheight = sv.getContentSize().height;
                sv.setInnerContainerSize(cc.size(sv.getContentSize().width, totalheight));
                for (var j = 0; j < score_list.length; j++) {
                    var row = $('row' + j, sv);
                    if (!row) {
                        row = duplicateLayout(row0);
                        row.setName('row' + j);
                        sv.addChild(row);
                    }
                    row.setVisible(true);
                    row.setPosition(0, totalheight - j * row0.getContentSize().height);
                    $('txt_jushu', row).setString('第' + NUM_TO_ZHONGWEN[j + 1] + '局：');
                    $('txt_score', row).setString(score_list[j]);
                    $('txt_jushu', row).setLocalZOrder(2);
                    $('txt_score', row).setLocalZOrder(2);
                    $('separate', row).setVisible(j%2 == 0);
                }
                // lbZimo.setString(zimo);
                // lbJiepao.setString(jiepao);
                // lbDianpao.setString(dianpao);
                // lbAngang.setString(angang);
                // lbMinggang.setString(minggang);

                score_bg_lan.setVisible(score<0);
                score_bg_huang.setVisible(score>=0);
                lb_score_win.setString(score);
                lb_score_fail.setString(score);
                lb_score_win.setVisible(score>=0);
                lb_score_fail.setVisible(score<0);
                head1.setVisible(score<0);
                head2.setVisible(score>=0);


                $('root.panel.row' + i + '.zjps').setVisible(maxDianpao <= dianpao && dianpao > 0);
                //todo 房主
                // $('root.panel.row' + i + '.fz').setVisible(uid == data.xxx);
                $('root.panel.row' + i + '.dyj').setVisible(maxScore <= score && score > 0);

                if (player.uid == gameData.uid) {
                    myTotalScore = player.score;
                }
            }

            for (; i < 4; i++) {
                $('root.panel.row' + i).setVisible(false);
            }
            var count= 1150 ;
            var interval = count / players.length;
            if (players.length == 2) {
                var w =$('root.panel.row1').getPositionX() - $('root.panel.row0').getPositionX();
                interval=(count-2*w)/3+w;
            }
            var originPosX = 1280/2 - (players.length-1)/2 * interval;
            for (var s = 0; s < players.length; s++) {
                $('root.panel.row' + s).setPositionX(originPosX + interval*s);
            }

            playEffect(myTotalScore >= 0 ? 'vWin' : 'vLose');

            var btnShare = $('root.panel.btn_share');
            //var btnOk = $('root.panel.btn_ok');

            if(window.inReview){
                btnShare.setVisible(false);
            }

            TouchUtils.setOnclickListener(btnShare, function () {
                if (!cc.sys.isNative)
                    return;
                // if (getNativeVersion() < '1.4.0' && cc.sys.isNative) {
                //     captureAndShareToWX(that,0x88F0);
                // }
                // else
                //     WXUtils.captureAndShareToWX(that,0x88F0);

                that.addChild(new ShareTypeLayer(that), 100);
            });

            //TouchUtils.setOnclickListener(btnOk, function () {
            //    HUD.showScene(HUD_LIST.Home, null);
            //});

            TouchUtils.setOnclickListener($('root.panel.btn_back'), function () {
                HUD.showScene(HUD_LIST.Home, that);
                //HUD.showScene(HUD_LIST.Home, null);
            });

            return true;
        }
    });

    exports.Ma_ZongJiesuanLayer = ZongJiesuanLayer;
})(window);
