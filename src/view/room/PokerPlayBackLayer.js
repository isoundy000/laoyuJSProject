/**
 * Created by dengwenzhong on 2017/9/22.
 */
(function (exports) {

    var PLAY_INTERVAL = 1.6;

    var $ = null;

    var data;

    var PokerPlayBackLayer = cc.Layer.extend({

        curDataIndex: 0,
        ctor: function (_data) {
            this._super();

            var that = this;

            var jsondata = _data || {};

            // network.removeListener(3002);
            network.selfRecv(jsondata["3002"] || {});

            if (gameData.mapId != MAP_ID.ZJH && gameData.mapId != MAP_ID.NN && gameData.mapId != MAP_ID.EPZ) {
                var idArrS = jsondata["3005"] || [];
                for (var i = 0; i < idArrS.length; i++) {
                    if (idArrS[i]["data"]["uid"] == gameData.uid) {
                        // if (idArrS[i]["data"]["uid"] == 92915) {
                        network.selfRecv(idArrS[i]);
                        break;
                    }
                }
                if (i == idArrS.length) {
                    network.selfRecv(idArrS[0]);
                }

                data = jsondata["arr"] || [];

                //给data[0]里边应该是地主的那个哥们加上3张地主牌
                // if (idArrS[0] && idArrS[0].data) {
                //     var _dizhu_id = idArrS[0].data.zhuang_uid;
                //     var _dizhu_pai = idArrS[0].data.unused_paiArr;
                //     if (_dizhu_id && _dizhu_pai) {
                //         if (data[0] && data[0][_dizhu_id]) {
                //             data[0][_dizhu_id].pai_arr = data[0][_dizhu_id].pai_arr.concat(_dizhu_pai);
                //         }
                //     }
                // }

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
            } else if(gameData.mapId == MAP_ID.NN){
                data = jsondata["3005"] || [];
                network.selfRecv(data[0]);
            } else {
                data = jsondata["3005"] || [];
            }

            //目前是暂停还是播放状态 true是播放 false暂停
            this.status = true;

            //var scene = ccs.load(gameData.mapId != MAP_ID.ZJH ? res.PlayBackLayer_json : res.PlayBackLayerZJH_json);
            var scene = loadNodeCCS(res.PokerPlayBackLayer_json, this, null, true);
            // this.addChild(scene.node);

            $ = create$(this.getChildByName("Layer"));

            if (gameData.mapId != MAP_ID.ZJH && gameData.mapId != MAP_ID.NN && gameData.mapId != MAP_ID.EPZ) {
                var node = $('row10');
                node.removeFromParent(false);
                maLayer.getRootNode().addChild(node);

                var node = $('row30');
                node.removeFromParent(false);
                maLayer.getRootNode().addChild(node);
            } else if(gameData.mapId == MAP_ID.NN){
                $('row10').removeFromParent();
                $('row30').removeFromParent();
            }else if(gameData.mapId == MAP_ID.ZJH){
                $('row10').removeFromParent();
                $('row30').removeFromParent();
            } else if(gameData.mapId == MAP_ID.EPZ){
                $('row10').removeFromParent();
                $('row30').removeFromParent();
            }

            if (gameData.mapId != MAP_ID.ZJH && gameData.mapId != MAP_ID.EPZ) {
                maLayer.setAfterGameStart(function () {
                    if (data.length > 1 && data[1].code == 4901) {
                        network.selfRecv(data[1]);
                        data.splice(1, 1);
                    }
                    setTimeout(function () {
                        //第一条数据
                        maLayer.setAllPai4Replay(data[that.curDataIndex]);

                        that.scheduleId = that.scheduleOnce(function () {
                            that.popCommand();
                        }, 0.01);
                    }, 100);
                });
            } else {
                that.scheduleId = that.scheduleOnce(function () {
                    that.popCommand();
                }, 0.01);
            }


            $('root.play_searchpai').setVisible(false);
            TouchUtils.setOnclickListener($('root'), function () {
            });



            TouchUtils.setOnclickListener($('root.btn_close'), function () {
                cc.director.resume();
                alert2("确定要退出吗?", function () {
                    if(that.scheduleId){
                        that.unschedule(that.scheduleId);
                        that.scheduleId = null;
                    }
                    cc.director.resume();
                    HUD.showScene(HUD_LIST.Home, null);
                });
            });

            if (gameData.mapId == MAP_ID.ZJH || gameData.mapId == MAP_ID.EPZ) {
                Filter.grayScale($('root.back_searchpai'));
                Filter.grayScale($('root.next_searchpai'));
                Filter.grayScale($('root.pause_searchpai'));
                Filter.grayScale($('root.play_searchpai'));
            } else {
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
            }

            return true;
        },
        popCommand: function () {
            var that = this;
            if (gameData.mapId == MAP_ID.ZJH || gameData.mapId == MAP_ID.EPZ) {
                for (that.curDataIndex; that.curDataIndex < data.length;) {
                    if (data[that.curDataIndex].code) {
                        maLayer.setReplayProgress(that.curDataIndex, data.length - 1);

                        network.selfRecv(data[that.curDataIndex]);
                        if (data[that.curDataIndex].code == 4500) {
                            that.curDataIndex++;
                            continue;
                        }
                        that.curDataIndex++;

                        maLayer.setOperateFinishCb(function () {
                            that.scheduleOnce(function () {
                                that.popCommand();
                            }, PLAY_INTERVAL);
                        });
                        break;
                    }
                }
            } else {
                for (this.curDataIndex++; this.curDataIndex < data.length; this.curDataIndex++) {
                    if (data[this.curDataIndex].code) {
                        maLayer.setReplayProgress(that.curDataIndex, data.length - 1);

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
        }
    });

    exports.PokerPlayBackLayer = PokerPlayBackLayer;
})(window);
