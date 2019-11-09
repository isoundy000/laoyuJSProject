/**
 * Created by sungongxiang on 17/3/10.
 */

(function () {
    var exports = this;
    var $ = null;
    var HuoDongGuiZheLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            var that = this;
            var mainscene = ccs.load(res.HuoDongRule_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Scene"));
           
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent(true);
            });
        }
    });
    exports.HuoDongGuiZheLayer = HuoDongGuiZheLayer;
})(window);