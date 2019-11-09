/**
 * 邀请码界面
 * Created by zhangluxin on 2016/11/26.
 */
(function () {
    var exports = this;

    var requestURL = "http://114.55.58.95:8085/payServer/game/bind";
// test
//     requestURL = "http://10.0.0.7:8080/payServer/game/bind";

    var $ = null;
    var YaoQingLayer = cc.Layer.extend({
        ctor: function () {
            this._super();

            var that = this;

            var scene = ccs.load(res.YaoQing_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('root.panel.btn_ok'), function () {
                // that.removeFromParent(true);
                var code = $('root.panel.input').getString();
                if (code && code != "" && code.length == 6) {
                    HUD.showLoading();
                    var data = {
                        playerid: gameData.uid,
                        code: code,
                        area: "hn",
                        appid: gameData.appId,
                        timestamp: getCurTimestamp()
                    };
                    // data = {
                    //     playerid: gameData.uid,
                    //     code: code,
                    //     area: "test",
                    //     appid: APP_ID,
                    //     timestamp: getCurTimestamp()
                    // };
                    httpPost(requestURL, data,
                        function (data) {
                            var status = data["status"];
                            var msg = data["message"];
                            if (status == 0) {
                                that.removeFromParent(true);
                                if (msg) {
                                    HUD.showMessageBox("提示", msg, function(){}, true);
                                } else {
                                    HUD.showMessageBox("提示", "邀请码验证成功！", function(){}, true);
                                }
                            } else {
                                if (msg) {
                                    HUD.showMessageBox("提示", msg, function(){}, true);
                                } else {
                                    HUD.showMessageBox("提示", "请求失败,请检查网络", function(){}, true);
                                }
                            }
                            HUD.removeLoading();
                        },
                        function () {
                            HUD.showMessageBox("提示", "请求失败,请检查网络", function(){}, true);
                            HUD.removeLoading();
                        }
                    );
                } else {
                    HUD.showMessageBox("提示", "请输入正确的验证码", function(){}, true);
                }
            });
            TouchUtils.setOnclickListener($('root.panel.btn_cancel'), function () {
                that.removeFromParent(true);
            });

        }
    });
    exports.YaoQingLayer = YaoQingLayer;
})(window);