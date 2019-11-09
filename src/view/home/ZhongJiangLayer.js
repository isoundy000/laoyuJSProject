/**
 * Created by sungongxiang on 17/3/10.
 */

(function () {
    var exports = this;
    var $ = null;
    var ZhongJiangLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            var that = this;
            var mainscene = ccs.load(res.ZhongJiangJiLu_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Scene"));

            var data = {
                area: "hn",
                appid: gameData.appId,
                playerid: gameData.uid,
                timestamp: getCurTimestamp()
            };


            data.sign = Crypto.MD5(data.appid + data.area + data.playerid + data.timestamp + ZADAN_KEY);
            httpPost(ZADAN_URL + "prizelist", data, function (data) {
                    hideLoading();
                    if (data.status == 0) {
                        var jsonData = data.data;
                        var itemList = $('iitem_list');
                        for (var i = 0; i < jsonData.length; i++) {
                            var text1 = new ccui.Text( jsonData[i].date  + "       "  + "获得奖品 : " + jsonData[i].name  , "AmericanTypewriter", 32);
                            if (jsonData[i].type != 1) {
                                // if(jsonData[i].name=='房卡') {
                                text1.setTextColor(cc.color(253, 111, 255));
                            }
                            else {
                                text1.setTextColor(cc.color(255, 244, 170));
                            }
                            itemList.pushBackCustomItem(text1);
                        }

                    }

                },
                function () {
                    hideLoading();

                    alert1("请求失败,请稍后重试", function () {
                        that.removeFromParent(true);
                    });
                });
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent(true);
            });

        }

    });
    exports.ZhongJiangLayer = ZhongJiangLayer;
})(window);