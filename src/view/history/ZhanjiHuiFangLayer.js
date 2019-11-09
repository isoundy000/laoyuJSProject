(function () {
    var exports = this;

    var $ = null;

    var numArr = [];
    var maxN = 9;

    var ZhanjiHuiFangLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);

        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        clear: function () {
            numArr = [];
            this.updateNums();
        },
        updateNums: function () {
            var showNum = "";
            var _nCount = numArr.length;
            if (_nCount > maxN) _nCount = maxN;

            for (var j = 0; j < _nCount; j++) {
                showNum = showNum + numArr[j] + "";
            }
            $('numbg.num').setString(showNum);
        },
        ctor: function (reqip) {
            this.ip = reqip || 'http://gg-paohuzi.oss-cn-hangzhou.aliyuncs.com/niuniu-rec/';
            this._super();

            var that = this;
            var updateNums = that.updateNums;

            maxN = gameData.opt_conf.recordNum + 2;

            var scene = loadNodeCCS(res.ZhanjiHuifang_json, this, null);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('btClose'), function (node) {
                that.removeFromParent(true);
            }, {sound: 'return'});

            updateNums();
            for (var i = 0; i <= 9; i++)
                (function (i) {
                    TouchUtils.setOnclickListener($('bt' + i), function () {
                        if (numArr.length < 10) {
                            numArr.push(i);
                            updateNums();
                        }
                    });
                })(i);

            TouchUtils.setOnclickListener($('bt10'), function (node) {
                numArr = [];
                updateNums();
            });
            TouchUtils.setOnclickListener($('btn_ok'), function (node) {
                var recId = "";
                for (var j = 0; j < numArr.length; j++) {
                    recId = recId + numArr[j];
                }
                // var recId = "2709448";
                if (!recId || recId.length <= 6) {
                    return HUD.showMessage('请输入正确的回放码', true);

                }
                // var idx = recId.length - 7;
                // that.record_round = Number(recId.substr(0, idx));
                // var record_roomID = recId.substr(idx, recId.length - idx);
                // var recordId = record_roomID + '-' + that.record_round;

                var recordNum = gameData.opt_conf.recordNum || 7;
                var recordId = recId.substr(1, recId.length - 1) + '-' + recId.charAt(0);
                if(recId.length >= (recordNum + 2)){
                    recordId = recId.substr(2, recId.length - 2) + '-' + recId.charAt(0) + recId.charAt(1);
                }

                var rec_uel = DC.httpHost4 + "/" + recordId;
                // if(that.ip){
                //     rec_uel = that.ip + "/youxian-rec/" + recordId;
                // }
                if (getNativeVersion() >= "2.2.0") {
                    rec_uel = rec_uel.replace("youxian", "niuniu");
                }
                console.log("-----------------");
                console.log(rec_uel);
                httpGet(rec_uel, function (data) {

                    var tData = data.replace(/'/g, "\"");
                    var newdata = JSON.parse(tData);
                    // console.log(newdata);
                    if (newdata['3002']) {
                        gameData.mapId = newdata['3002']['data']['map_id'];
                        gameData.roomId = newdata['3002']['data']['room_id'];
                        gameData.players = newdata['3002']['data']['players'];
                        gameData.ownerUid = newdata['3002']['data']['owner'];
                        gameData.last3002 = newdata['3002'];
                        gameData.wanfaDesp = newdata['3002']['data']['desp'];

                        //人数
                        if(gameData.players) {
                            gameData.playerNum = gameData.players.length;
                        }
                        SubUpdateUtils.showGameScene(newdata);

                    }else if(_.isArray(newdata)){//考考回放
                        gameData.roomId = newdata[0].data.RoomID;
                        var option = newdata[0].data.Option;
                        var obj = decodeHttpData(option);
                        gameData.mapId = obj.mapid;
                        mRoom.isReplay = true;
                        gameData.options = obj;

                        SubUpdateUtils.showGameScene(newdata);
                    }else {
                        // this.txt_number.didNotSelectSelf();

                        mRoom.isReplay = true;
                        mRoom.replayData = new ReplayData(JSON.parse(data));
                        mRoom.replayData.round = that.record_round;
                        var option = newdata[0].data.Option;
                        var obj = decodeHttpData(option);
                        mRoom.roomId = newdata[0].data.RoomID;
                        gameData.roomId = mRoom.roomId;
                        mRoom.replayTime = newdata[1].data.StartTime;
                        mRoom.getWanfa(obj);

                        HUD.showScene(HUD_LIST.Room, that);
                    }
                }, function () {
                    HUD.showMessage('获取录像失败', true);
                });
            });

            TouchUtils.setOnclickListener($('bt11'), function (node) {
                if (numArr.length) {
                    numArr.splice(numArr.length - 1, 1);
                    updateNums();
                }
            });
            return true;
        }
    });

    exports.ZhanjiHuiFangLayer = ZhanjiHuiFangLayer;
})(window);
