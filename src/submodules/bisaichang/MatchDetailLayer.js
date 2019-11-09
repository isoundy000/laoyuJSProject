/**
 * Created by scw on 2018/6/5.
 */
(function () {
    var exports = this;
    var $ = null;

    var MatchDetailLayer = cc.Layer.extend(
        {
            ctor: function (textjl,textxq) {
                this._super();

                var that = this;

                this.text_jiangli=textjl;
                this.text_xiangqing=textxq;

                var scene=loadNodeCCS(res.MatchDetailLayer_json,this);


                $ = create$(this.getChildByName("Layer"));

                TouchUtils.setOnclickListener($('btn_saizhi'), function () {
                    $('btn_saizhi').setVisible(false);
                    $('szxq').setVisible(true);
                    $('btn_jiangli').setVisible(true);
                    $('jlfa').setVisible(false);

                    that.showDetail();

                });


                TouchUtils.setOnclickListener($('btn_jiangli'), function () {
                    $('btn_saizhi').setVisible(true);
                    $('szxq').setVisible(false);
                    $('btn_jiangli').setVisible(false);
                    $('jlfa').setVisible(true);

                    that.showScheme();

                });


                TouchUtils.setOnclickListener($('btn_close'), function () {
                    that.removeFromParent();
                });



                this.showScheme();
                return true;
            },
            showScheme:function(){

                $('showtext').setString(this.text_jiangli);
            },
            showDetail:function(){

                $('showtext').setString(this.text_xiangqing);
            }
        }
    );
    exports.MatchDetailLayer = MatchDetailLayer;
})(window);