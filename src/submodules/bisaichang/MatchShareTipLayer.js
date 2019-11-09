/**
 * Created by scw on 2018/7/26.
 */
(function () {
    var exports = this;
    var $=null;
    var MatchShareTipLayer=cc.Layer.extend(
        {
            ctor:function(func){
                this._super();
                var that=this;
                // var scene=ccs.load(res.MatchShareTipLayer_json);
                // this.addChild(scene.node);

                var scene=loadNodeCCS(res.MatchShareTipLayer_json,this);

                $=create$(this.getChildByName('Layer'));

                TouchUtils.setOnclickListener($('btn_close'), function () {
                    that.removeFromParent();
                });
                TouchUtils.setOnclickListener($('btn_fx'), function () {
                    func();
                    that.removeFromParent();
                });

                return true;
            }
        }
    );
    exports.MatchShareTipLayer=MatchShareTipLayer;
})
(window);