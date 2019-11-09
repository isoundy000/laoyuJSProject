/**
 * Created by hjx on 2018/10/12.
 */
(function () {
    var exports = this;

    var $ = null;

    var HuifangZhanjiLayer = cc.Layer.extend({
        ctor: function (data) {
            this._super();
            var that = this;
            loadNodeCCS(res.HuifangZhanji_json, this);
            $ = create$(this.getChildByName("Layer"));

            var HEIGHT = 90;
            var yOff = HEIGHT;

            var arr = data || [];
            //debug
            for (var i = 0; i < 19; i++) {//局数
                arr.push({jushu: i + 1, score: i + 1})
            }
            var wholeHeight = Math.ceil(arr.length / 2) * HEIGHT;

            for (var i = 0; i < arr.length; i++) {
                var info = arr[i];
                if (i % 2 == 0 && i > 0) {
                    yOff += HEIGHT;
                }
                var sp = duplicateSprite($('tabList.btn_0'))
                sp.setName('btn_' + (i + 1));
                $('tabList').addChild(sp);
                sp.y = wholeHeight - yOff + 50;
                sp.x = i % 2 == 1 ? 403 : 130;
                sp.getChildByName('lb_jushu').setString(info.jushu);
                sp.getChildByName('score1').setString(info.score);
                (function (i) {
                    console.log("init btn -> event " + i);
                    TouchUtils.setOnclickListener($('tabList.btn_' + i), function () {
                        console.log("类型 " + i);
                        that.addChild(new HuifangDetailedLayer());
                    }, {swallowTouches: false});
                })(i + 1)
            }
            $('tabList').setInnerContainerSize(cc.size(560, wholeHeight > 600 ? wholeHeight : 400));
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });
        }
    });
    exports.HuifangZhanjiLayer = HuifangZhanjiLayer;
})(window);