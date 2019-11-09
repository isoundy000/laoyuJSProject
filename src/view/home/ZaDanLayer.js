/**
 * Created by sungongxiang on 17/3/10.
 */

(function () {
    var exports = this;
    var $ = null;
    var that = null;
    var zaOne = false;
    var ZaDanLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            that = this;
            zaOne = false;
            var mainscene = ccs.load(res.ZaDanLayer_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Scene"));

            var egg11 = new sp.SkeletonAnimation('res/anima/spine/sld.json', 'res/anima/spine/sld.atlas');
            egg11.addAnimation(0, 'sld', true);
            $('egg1').addChild(egg11);
            var egg2 = new sp.SkeletonAnimation('res/anima/spine/sld.json', 'res/anima/spine/sld.atlas');
            egg2.addAnimation(0, 'sld', true);
            $('egg2').addChild(egg2);
            var egg3 = new sp.SkeletonAnimation('res/anima/spine/sld.json', 'res/anima/spine/sld.atlas');
            egg3.addAnimation(0, 'sld', true);
            $('egg3').addChild(egg3);
            TouchUtils.setOnclickListener($('transparent_1'), function () {
                chuizi.setPosition($('transparent_1').getPosition().x + 20, $('transparent_1').getPosition().y + 130);
                chuizi.runAction(cc.sequence(cc.rotateBy(0.2, 30), cc.rotateBy(0.1, -50), cc.callFunc
                (
                    function () {
                        that.zaDanEffect($('egg1'))
                    }
                )));
            });
            TouchUtils.setOnclickListener($('transparent_2'), function () {
                chuizi.setPosition($('transparent_2').getPosition().x + 20, $('transparent_2').getPosition().y + 130);
                chuizi.runAction(cc.sequence(cc.rotateBy(0.2, 30), cc.rotateBy(0.1, -50), cc.callFunc(
                    function () {
                        that.zaDanEffect($('egg2'))
                    }
                )));
            });
            TouchUtils.setOnclickListener($('transparent_3'), function () {
                chuizi.setPosition($('transparent_3').getPosition().x + 20, $('transparent_3').getPosition().y + 130);
                chuizi.runAction(cc.sequence(cc.rotateBy(0.2, 30), cc.rotateBy(0.1, -50), cc.callFunc(
                    function () {
                        that.zaDanEffect($('egg3'))
                    }
                )));
            });
            var chuizi = new cc.Sprite(cc.textureCache.addImage('res/image/ui/jizizhuanpan/zadan/cz.png'));
            chuizi.setPosition(1000, 600);
            chuizi.setLocalZOrder($('transparent_1').getLocalZOrder() + 1);
            that.addChild(chuizi);

            TouchUtils.setListeners($('bg'), {
                onTouchBegan: function (node, touch, event) {
                    chuizi.setPosition(touch.getLocation());
                }
                , onTouchMoved: function (node, touch, event) {
                    // console.log(touch.getLocation());
                    chuizi.setPosition(touch.getLocation());
                }
                , onTouchEnded: function (node, touch, event) {

                }
            });

        },
        zaDanEffect: function (node) {

            if(zaOne == true){
                return;
            }
            zaOne = true;
            node.removeAllChildren();
            var egg3 = new sp.SkeletonAnimation('res/anima/spine/zd.json', 'res/anima/spine/zd.atlas');
            egg3.addAnimation(0, 'zd', false);
            node.addChild(egg3);


            var data = {
                area: "hn",
                appid: gameData.appId,
                playerid: gameData.uid,
                timestamp: getCurTimestamp()
            };

            zhuan = true;
            data.sign = Crypto.MD5(data.appid + data.area + data.playerid + data.timestamp + ZADAN_KEY);
            httpPost(ZADAN_URL + "draw", data, function (data) {
                    hideLoading();
                    if (data.status == 0) {
                        var jsonData = data.data;
                        if (jsonData.prize.indexOf('房卡') >= 0) {
                            alert1("恭喜" + gameData.nickname + "（" + gameData.uid + "）" + "获得:" + "\n" + jsonData.prize + " !" + '\n请退出游戏重新登录', function () {
                                that.getParent().initView(jsonData);
                                that.removeFromParent(true);
                            });
                            // that.mainLayer.refreshFangka();
                            // MainLayer.refreshFangka();
                        } else {
                            alert1("恭喜" + gameData.nickname + "（" + gameData.uid + "）" + "获得:" + "\n" + jsonData.prize + " !" + "\n" + "实物奖励请截图并发送至微信号yykf1699", function () {
                                // that.getParent().initPlayerInfo();
                                that.getParent().initView(jsonData);
                                that.removeFromParent(true);
                            });
                        }
                    }

                },
                function () {
                    hideLoading();
                    zhuan = false;
                    alert1("请求失败,请稍后重试", function () {
                        that.removeFromParent(true);
                    });
                });

        }
    });
    exports.ZaDanLayer = ZaDanLayer;
})(window);