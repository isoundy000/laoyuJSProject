(function () {
    var exports = this;

    var $ = null;

    // var RESULT_TEXTURE = {};
    // RESULT_TEXTURE["win"] = cc.textureCache.addImage("res/image/ui/niuniu/unit/icon_win.png");
    // RESULT_TEXTURE["ping"] = cc.textureCache.addImage("res/image/ui/niuniu/unit/icon_ping.png");
    // RESULT_TEXTURE["lose"] = cc.textureCache.addImage("res/image/ui/niuniu/unit/icon_lose.png");

    var ZongJiesuanLayer = cc.Layer.extend({
        onEnter: function () {
            this._super();
            AgoraUtil.hideAllVideo();
        },

        onExit: function () {
            this._super();
            AgoraUtil.showAllVideo();
        },
        ctor: function (data, parent) {
            this._super();

            var that = this;

            var currentRound = data.CurrentRound < data.TotalRound ? data.CurrentRound : data.TotalRound;

            //活动的总结算
            if(gameData.zongJieSuanHuodong) {
                gameData.zongJieSuanHuodong(gameData.parent_area, data.RoomID, data.EndTime, data.CurrentRound);
            }

            // var scene = ccs.load(res.ZongJiesuanLayer_json, "res/");
            var scene = null;
            if(typeof loadNodeCCS == 'function') {
                scene = loadNodeCCS(res.ZongJiesuanLayer_json, this, "Scene");
            }else{
                scene = ccs.load(res.ZongJiesuanLayer_json, "res/");
                this.addChild(scene.node);
            }
            $ = create$(this.getChildByName("Scene"));
            $('bg').setScale(cc.winSize.width/1280);

            $('lb_ts').setString("");
            if(data.EndTime != "")
                $('lb_ts').setString(data.EndTime.substring(5));
            $('lb_roomid').setString('房间号: ' + data.RoomID);
            $('lb_jushu').setString('局数: ' + currentRound + '/' + data.TotalRound);

            var roomData = JSON.parse(data.Option);
            if (roomData.basescore) {
                $('lb_difen').setVisible(true);
                $('lb_difen').setString('底分: ' + roomData.basescore);
            } else {
                $('lb_difen').setVisible(false);
            }

            var wanfastr = getZhuangMode(roomData);
            $('lb_wanfa').setString('玩法: ' + wanfastr);

            var players = data.Users;
            if (players.length == 5) {
                for (var i = 0; i < players.length; i++) {
                    if (players[i].UserID == gameData.uid) {
                        var tmp = players[i];
                        players.splice(i, 1);
                        players.splice(0, 0, tmp);
                        break;
                    }
                }
            }


            var myTotalScore = 0;
            var highestScore = 0;
            var lowestScore = 0;

            //超出数据隐藏
            for (var i = players.length; i < 9; i++) {
                $('info' + i).setVisible(false);
            }
            var info = 'info';
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var score = player.Score;
                if (score > highestScore) {
                    highestScore = score;
                }
                if (score < lowestScore) {
                    lowestScore = score;
                }

                $(info + i).setVisible(true);
                if (player.HeadImgURL == null || player.HeadImgURL == undefined || player.HeadImgURL == "") {
                    player.HeadImgURL = res.defaultHead;
                }
                loadImageToSprite(decodeURIComponent(player.HeadImgURL), $(info + i + '.infoitem.head'), true);
                $(info + i + '.infoitem.txt_name').setString(ellipsisStr(decodeURIComponent(player.UserName), 7));
                $(info + i + '.infoitem.txt_id').setString('ID ' + player.UserID);

                if(score >= 0){
                    $(info + i + ".infoitem.txt_score").setString(score > 0 ? (score) : score);
                    $(info + i + ".infoitem.txt_score").setVisible(true);
                    $(info + i + ".infoitem.txt_score2").setString(false);
                }else{
                    $(info + i + ".infoitem.txt_score2").setString(score > 0 ? (score) : score);
                    $(info + i + ".infoitem.txt_score2").setVisible(true);
                    $(info + i + ".infoitem.txt_score").setString(false);
                }

                $(info + i + ".infoitem.bg").setTexture(score >= 0 ? res.jiesuan_item_red : res.jiesuan_item_blue);
                $(info + i + ".infoitem.icon_fz").setVisible(player.UserID == data.Owner);
                if (player.uid == gameData.uid) {
                    myTotalScore = score;
                }
            }
            for (var i = 0; i < players.length; i++) {
                $(info + i + ".infoitem.icon_dyj").setVisible(highestScore > 0 && players[i].Score == highestScore);
                //$(info + i + ".infoitem.icon_thl").setVisible(false);
            }
            for (var i = 0; i < players.length; i++) {
                $(info + i + ".infoitem.icon_thl").setVisible(lowestScore < 0 && players[i].Score == lowestScore);
            }
            //播放音效关闭背景音乐
            this.setMusicState(false);
            this.scheduleOnce(function () {
                //延时打开背景音乐
                that.setMusicState(true);

            }, 4);
            if (myTotalScore >= 0) {
                playEffect('niuniuwin');
            } else {
                playEffect('niuniulose');
            }
            var btnShare = $('btn_share');
            TouchUtils.setOnclickListener(btnShare, function () {
                // if (!cc.sys.isNative)
                //     return;
                // WXUtils.captureAndShareToWX(that, 0x88F0);//0x88F0
                // //点击打开背景音乐
                that.setMusicState(true);


                // var winSize = cc.director.getWinSize();
                // var texture = new cc.RenderTexture(winSize.width, winSize.height,null, 0x88F0);
                // if (!texture)
                //     return;
                //
                // texture.retain();
                // texture.setAnchorPoint(0, 0);
                // texture.begin();
                // that.visit();
                // texture.end();
                //
                //
                // var layer = new JieSuanShare(texture);
                // that.addChild(layer, 100);
                that.addChild(new ShareTypeLayer(that), 100);
            });

            gameData.lastRoom = 0;

            TouchUtils.setOnclickListener($('btn_close'), function () {
                gameData.players = [];
                gameData.totalRound = 10;
                gameData.leftRound = undefined;
                clearGameMWRoomId();
                AgoraUtil.closeVideo();
                //点击打开背景音乐
                that.setMusicState(true);

                HUD.showScene(HUD_LIST.Home, null);

            });
            if(window.inReview){
                $('btn_close').setPositionX(640);
                $('btn_share').setVisible(false);
            }


            return true;
        },
        setMusicState: function (isOpen) {
            if (isOpen == true) {
                //播放音效关闭背景音乐
                if ((cc.sys.localStorage.getItem('musicvoice') || '1') == '1') {
                    cc.sys.localStorage.setItem('yinyuePrecent', 100);
                    resetVolume();
                }
            } else if (isOpen == false) {
                if ((cc.sys.localStorage.getItem('musicvoice') || '1') == '1') {
                    cc.sys.localStorage.setItem('yinyuePrecent', 0);
                    resetVolume();
                }
            }
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
                    gameData.players = [];
                    gameData.totalRound = 10;
                    gameData.leftRound = undefined;
                    clearGameMWRoomId();
                    HUD.showScene(HUD_LIST.Home, null);
                    AgoraUtil.closeVideo();
                    //点击打开背景音乐
                    that.setMusicState(true);
                });
            }
        }
    });

    exports.ZongJiesuanLayer = ZongJiesuanLayer;
})(window);
