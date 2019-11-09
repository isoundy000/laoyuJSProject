/**
 * Created by hjx on 2018/5/9.
 */
(function () {
    var exports = this;

    var $ = null;

    var replayData = null;
    var PLAY_INTERVAL = 1.6;
    var isPause = false;

    var KKReplayLayer = cc.Layer.extend({
        curDataIndex: 0,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data) {
            this._super();

            var that = this;
            replayData = data;
            var scene = loadNodeCCS(res.KKReplayLayer_json, this, null, true);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('Panel_1'),function () {});

            TouchUtils.setOnclickListener($('play'),function () {
                isPause = false;
            });
            TouchUtils.setOnclickListener($('pause'),function () {
                isPause = true;
            });
            TouchUtils.setOnclickListener($('quit'),function () {
                alert2('确定结束回放吗？', function () {
                    gameData.roomId = 0;
                    window.paizhuo = null;
                    HUD.showScene(HUD_LIST.Home, null);    
                }, function () {
                    
                });
                
            });


            //gameData.roomId = mRoom.roomId;
            //gameData.mapId = obj.mapid;
            console.log("ctro-----");
            setTimeout(function () {
                that.popCommand();
            }, 1000);

            return true;
        },
        popCommand: function () {
            var that = this;
            var data = replayData;
            if(isPause){
                that.scheduleOnce(function () {
                    that.popCommand();
                }, PLAY_INTERVAL);
                return;
            }
            console.log("popCommand");
            for (this.curDataIndex++; this.curDataIndex < data.length; this.curDataIndex++) {
                if (data[this.curDataIndex].cmd) {
                    maLayer.setReplayProgress(that.curDataIndex, data.length - 1);

                    // if (data[this.curDataIndex].code == 4003)
                    //     maLayer.throwTurnByUid(data[this.curDataIndex]['data'].uid);
                    data[this.curDataIndex].code = data[this.curDataIndex].cmd;
                    // network.kkReplayRecv(data[this.curDataIndex]);

                    console.log(data[this.curDataIndex].cmd);
                    console.log(data[this.curDataIndex].data);

                    cc.eventManager.dispatchCustomEvent(data[this.curDataIndex].cmd, data[this.curDataIndex].data);

                    if(!isPause){
                        that.scheduleOnce(function () {
                            that.popCommand();
                        }, PLAY_INTERVAL);
                    }
                    break;
                }
            }
        }
    });

    exports.KKReplayLayer = KKReplayLayer;
})(window);
