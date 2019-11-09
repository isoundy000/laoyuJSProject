/**
 * Created by zhangluxin on 16/6/3.
 */

(function () {
    var exports = this;
    var $ = null;
    var LotteryRuleLayer = cc.Layer.extend({
        ctor: function (desc) {
            this._super();
            var that = this;
            var mainscene = ccs.load(res.LotteryRule_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Scene"));
            $('root.txt_rule').setString(desc);
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent(true);
            });
        }
    });
    exports.LotteryRuleLayer = LotteryRuleLayer;
})(window);