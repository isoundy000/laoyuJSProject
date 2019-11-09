(function (exports) {

    var $ = null;

    var BindingTipPop = cc.Layer.extend({
        ctor: function (func, fkInfo) {
            this._super();
            var that = this;

            var scene = ccs.load(res.BindingTipPop_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            TouchUtils.setOnclickListener($('root.btn_bangding'), function () {
                that.getParent().addChild(new BindingAgencyLayer());
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root.btn_go'), function () {
                that.removeFromParent();
                if(func){
                    func();
                }
            });
            TouchUtils.setOnclickListener($('root.close'), function () {
                that.removeFromParent();
            });
            console.log(fkInfo);

            $('root.mainbg.money').setString("￥" + fkInfo.amount + "  =");
            $('root.mainbg.num1').setString(fkInfo.cnt);
            $('root.mainbg.num2').setString(fkInfo.agencyCnt - fkInfo.cnt);
        }
    });

    exports.BindingTipPop = BindingTipPop;
})(window);