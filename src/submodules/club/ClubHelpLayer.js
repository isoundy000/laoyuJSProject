/**
 * Created by scw on 2018/6/1.
 */
(function () {
    var exports = this;
    var $ = null;
    var ClubHelpLayer = cc.Layer.extend(
        {
            ctor: function (idx) {
                this._super();
                var that = this;

                $ = create$(loadNodeCCS(res.ClubTimeHelpLayer_json, this).node);
                for (var i = 1; i <= 5; i++) {
                    if (i == idx) {
                        $('Panel_1.Text_' + i).setVisible(true);
                    } else {
                        $('Panel_1.Text_' + i).setVisible(false);
                    }
                }

                TouchUtils.setOnclickListener($('btn_close'), function (node) {
                    that.removeFromParent();
                });
                return true;
            }
        }
    );
    exports.ClubHelpLayer = ClubHelpLayer;
})(window);
