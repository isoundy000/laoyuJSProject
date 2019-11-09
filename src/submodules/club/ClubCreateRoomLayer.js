/**
 * Created by spring on 2018/3/29.
 */

(function () {
    var exports = this;

    var $ = null;
    var interval = 200;
    var ClubCreateRoomLayer = cc.Layer.extend({
        ctor: function (clubid, pos) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.ClubCreateRoomLayer_json, this);

            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('btn_back'), function () {
                that.removeFromParent();
            }, {effect: TouchUtils.effects.NONE});

            var games = ['niuniu', 'psz', 'pdk', 'majiang', 'kaokao','epz','sss'];
            var btnList = [];
            for (var i = 0; i < games.length; i++) {
                (function (name) {
                    console.log(name);
                    btnList[i] = $('root.create_' + games[i]);
                    btnList[i].setVisible(true);
                    TouchUtils.setOnclickListener(btnList[i], function (sender) {
                        // window.maLayer.createRoomLayer(games[i], 0, clubid, currentWanfaIdx);
                        SubUpdateUtils.showCreateRoom(name, true, clubid, true, pos);
                        that.removeFromParent();
                    }, {swallowTouches: false, effect: TouchUtils.effects.NONE});
                })(games[i]);
            }
            return true;
        },
    });

    exports.ClubCreateRoomLayer = ClubCreateRoomLayer;
})(window);