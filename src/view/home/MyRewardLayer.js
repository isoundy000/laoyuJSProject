/**
 * Created by zhangluxin on 16/6/3.
 */

(function () {
    var exports = this;
    var $ = null;
    var MyRewardLayer = cc.Layer.extend({
        data : null,
        ctor: function (data) {
            this._super();
            var that = this;
            var mainscene = ccs.load(res.MyReward_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Scene"));
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent(true);
            });
            this.data = data;
            var itemList = $('iitem_list');
            for (var i = 0; i < data.length; i++) {
                var text1 = new ccui.Text(data[i],"AmericanTypewriter",32);
                text1.setTextColor(cc.color(0, 0, 0));
                itemList.pushBackCustomItem(text1);
            }
        }
    });
    exports.MyRewardLayer = MyRewardLayer;
})(window);