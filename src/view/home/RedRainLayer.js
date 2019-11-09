/**
 * Created by hjx on 2017/9/18.
 */
(function () {
    var exports = this;
    var $ = null;

    var RedRainLayer = cc.Layer.extend({
        onCCSLoadFinish: function () {
        },
        ctor: function (gold) {
            this._super();
            var that = this;

            var mainscene = ccs.load(res.RedRainLayer_json, 'res/');
            this.addChild(mainscene.node);
            // mainscene.node.runAction(mainscene.action);
            // mainscene.action.play('action', true);
            $ = create$(this.getChildByName("Layer"));

            $('main.lb_gold').setString(gold? gold : "未中奖");
            TouchUtils.setOnclickListener($('root'), function () {

            });
            TouchUtils.setOnclickListener($('main.btn_fx'), function () {
                $('main').setVisible(false);
                $('share_bg').setVisible(true);
                var str = gold? gold : "未中奖"
                $('share_bg.lb_gold').setString(str );
                WXUtils.captureAndShareToWX(that,0x88F0);
                $('main').setVisible(true);
                $('share_bg').setVisible(false);
            });
            TouchUtils.setOnclickListener($('main.btn_ok'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('main.btn_ok_0'), function () {
                that.removeFromParent();
            });

            if(gold == "未获得红包"){
                $('main.nogainBg').setVisible(true);
                $('main.gainBg').setVisible(false);
                $('main.btn_ok').setVisible(false);
                $('main.btn_fx').setVisible(false);
                $('main.lb_gold').setVisible(false);
                $('main.btn_ok_0').setVisible(true);
            }else{
                $('main.nogainBg').setVisible(false);
                $('main.gainBg').setVisible(true);
                $('main.btn_ok_0').setVisible(false);
            }
            return true;
        }
    });
    exports.RedRainLayer = RedRainLayer;
})(window);