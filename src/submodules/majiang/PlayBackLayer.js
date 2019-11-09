(function (exports) {

    var PLAY_INTERVAL = 1.6;

    var $ = null;

    var data;
    var resp4008;

    var PlayBackLayer = cc.Layer.extend({

        curDataIndex: 0,
        ctor: function (_data) {
            this._super();

            var that = this;

            var jsondata = _data || {};

            resp4008 = _.isArray(jsondata["4008"]) ? jsondata["4008"][0] : null;

            // network.removeListener(3002);
            network.selfRecv(jsondata["3002"] || {});

            var idArrS = jsondata["3005"] || [];
            for (var i = 0; i < idArrS.length; i++) {
                if (idArrS[i]["data"]["uid"] == gameData.uid) {
                    network.selfRecv(idArrS[i]);
                    break;
                }
            }
            if (i == idArrS.length) {
                network.selfRecv(idArrS[0]);
            }

            data = jsondata["arr"] || [];
            while (true) {
                for (var i = 0; i < data.length;) {
                    if (data[i].code && data[i].code == 4004) {
                        var j = i;
                        var arr = [];
                        for (; j < data.length; j++) {
                            if (data[j].code && data[j].code == 4004) {
                                arr.push(data[j]);
                            }
                            else
                                break;
                        }
                        if (j - i > 0) {
                            data.splice(i, j - i, {
                                code: 40044,
                                data: {
                                    arr: arr
                                }
                            });
                            break;
                        }
                    }
                    else
                        i++;
                }
                if (i == data.length)
                    break;
            }

            //目前是暂停还是播放状态 true是播放 false暂停
            this.status = true;

            var scene = null;
            if(window.paizhuo == "majiang_sc"){
                scene = loadNodeCCS(res.PlayBackLayer_sc_json, this, false, true);
            }else{
                scene = loadNodeCCS(res.PlayBackLayer_json, this, false, true);
            }
            // this.addChild(scene.node);

            $ = create$(this.getChildByName("Layer"));

            for (var i = 0; i < 4; i++) {
                var node = $('cpghRep' + i);
                node.removeFromParent(false);
                maLayer.getRootNode().addChild(node, 11);
            }

            maLayer.setAfterGameStart(function () {
                //第一条数据
                maLayer.setAllPai4Replay(data[that.curDataIndex]);

                that.scheduleId = that.scheduleOnce(function () {
                    that.popCommand();
                }, 0.01);
            });

            $('root.play_searchpai').setVisible(false);
            TouchUtils.setOnclickListener($('root'), function () {
            });

            TouchUtils.setOnclickListener($('root.pause_searchpai'), function () {
                cc.director.pause();
                that.status = !that.status;
                $('root.pause_searchpai').setVisible(false);
                $('root.play_searchpai').setVisible(true);
            });

            TouchUtils.setOnclickListener($('root.play_searchpai'), function () {
                cc.director.resume();
                that.status = !that.status;
                $('root.play_searchpai').setVisible(false);
                $('root.pause_searchpai').setVisible(true);
            });

            TouchUtils.setOnclickListener($('root.btn_close'), function () {
                alert2("确定要退出吗?", function () {
                    cc.director.resume();
                    HUD.showScene(HUD_LIST.Home, that);
                });
            });

            if(window.paizhuo != "majiang_sc") {
                TouchUtils.setOntouchListener($('btn_wanfa'), null, {
                    onTouchBegan: function () {
                        if (window.maLayer && window.maLayer.showWanfaLayer) {
                            window.maLayer.showWanfaLayer();
                        }
                    },
                    onTouchEnded: function () {
                        if (window.maLayer && window.maLayer.hideWanfaLayer) {
                            window.maLayer.hideWanfaLayer();
                        }
                    }
                });
            }

            TouchUtils.setOnclickListener($('root.back_searchpai'), function () {
                that.unscheduleAllCallbacks();

                for (that.curDataIndex = Math.max(that.curDataIndex - 1, 0); that.curDataIndex >= 0; that.curDataIndex--) {
                    if (!data[that.curDataIndex].code) {
                        var uid4001 = 0;
                        for (var i = that.curDataIndex + 1; i < data.length && data[i].code; i++)
                            if (data[i].code == 4001 || data[i].code == 4003) {
                                uid4001 = data[i]['data'].uid;
                                break;
                            }
                        if (uid4001)
                            maLayer.throwTurnByUid(uid4001);
                        maLayer.setReplayProgress(that.curDataIndex, data.length - 1);
                        maLayer.setAllPai4Replay(data[that.curDataIndex]);
                        that.scheduleOnce(function () {
                            that.popCommand();
                        }, PLAY_INTERVAL / 2);
                        break;
                    }
                }
                if (that.curDataIndex < 0) {
                    that.curDataIndex = 0;
                    maLayer.setReplayProgress(0, 1);
                }
            });

            TouchUtils.setOnclickListener($('root.next_searchpai'), function () {
                that.unscheduleAllCallbacks();
                for (that.curDataIndex = Math.min(that.curDataIndex + 1, data.length - 1); that.curDataIndex < data.length; that.curDataIndex++) {
                    if (!data[that.curDataIndex].code) {
                        var uid4001 = 0;
                        for (var i = that.curDataIndex + 1; i < data.length && data[i].code; i++)
                            if (data[i].code == 4001 || data[i].code == 4003) {
                                uid4001 = data[i]['data'].uid;
                                break;
                            }
                        if (uid4001)
                            maLayer.throwTurnByUid(uid4001);
                        maLayer.setReplayProgress(that.curDataIndex, data.length - 1);
                        maLayer.setAllPai4Replay(data[that.curDataIndex]);
                        that.scheduleOnce(function () {
                            that.popCommand();
                        }, PLAY_INTERVAL / 2);
                        break;
                    }
                }

                if (that.curDataIndex >= data.length) {
                    that.curDataIndex = data.length - 1;
                    maLayer.setReplayProgress(1, 1);
                }
            });


            if(window.paizhuo != "majiang_sc") {
                var arr = decodeURIComponent(jsondata[3002].data.desp).split(',');
                if (arr.length >= 1)
                    arr = arr.slice(1);
                if (arr.length > 7) {
                    if (arr[0]) {
                        $('btn_wanfa.title').setString(arr[0]);
                    }
                    $('btn_wanfa').setVisible(true);
                } else {
                    $('btn_wanfa').setVisible(false);
                }
            }

            return true;
        },
        popCommand: function () {
            var that = this;
            for (this.curDataIndex++; this.curDataIndex < data.length; this.curDataIndex++) {
                if (data[this.curDataIndex].code) {
                    maLayer.setReplayProgress(that.curDataIndex, data.length - 1);

                    if (that.curDataIndex == data.length - 1 && resp4008) {
                        var layer = null;
                        var map_id = resp4008.data['map_id'];
                        var jiesuan_data = resp4008.data;
                        jiesuan_data['is_huifang'] = true;
                        if (map_id === MAP_ID.SICHUAN_MZ && jiesuan_data["new_panel"]) {
                            layer = new JiesuanSc2Layer(jiesuan_data, 0, map_id, 0);
                        } else {
                            layer = new Ma_JiesuanLayer(jiesuan_data);
                        }
                        that.addChild(layer);
                    }

                    if (data[this.curDataIndex].code == 4003)
                        maLayer.throwTurnByUid(data[this.curDataIndex]['data'].uid);

                    network.selfRecv(data[this.curDataIndex]);

                    that.scheduleOnce(function () {
                        that.popCommand();
                    }, PLAY_INTERVAL);
                    break;
                }
            }
        }

    });

    exports.Ma_PlayBackLayer = PlayBackLayer;
})(window);
