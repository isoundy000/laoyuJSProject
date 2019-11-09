/**
 * Created by www on 2017/5/15.
 */
(function () {
    var exports = this;

    var $ = null;
    var rankResArr = [
        'res/submodules/club/img/zhanbang/icon_first.png'
        , 'res/submodules/club/img/zhanbang/icon_second.png'
        , 'res/submodules/club/img/zhanbang/icon_third.png'
    ];

    var orderTypeArr = ['', '', ''];

    var ClubZhanBangRankItem = cc.TableViewCell.extend({
        layerHeight: 0,
        ctor: function (data, idx, orderType) {
            this._super();

            var that = this;

            var scene = ccs.load(res.ClubZhanBangRankItem_json, 'res/');
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.layerHeight = this.getChildByName("Layer").getBoundingBox().height;
            this.initUI(data, idx, orderType);
            return true;
        },
        initUI: function (data, idx, orderType) {
            if (idx < 3) {
                $('icon_rank').setVisible(true);
                $('icon_rank').setTexture(rankResArr[idx]);
            } else {
                $('icon_rank').setVisible(false);
            }

            $('lb_name').setString(ellipsisStr(data['playerName'], 5));
            $('lb_id').setString(data['playerId']);
            if (orderType == 'winnerCount') {
                $('lb_score').setString(data['winnerCount']);
            } else if (orderType == 'totalScore') {
                $('lb_score').setString(data['totalScore']);
            } else if (orderType == 'roomCount') {
                $('lb_score').setString(data['roomCount']);
            }

            $('lb_rank').setString(idx + 1);

            loadImage(data['headImg'], $('info_1.head'))
        },
        getLayerWidth: function () {
            return this.layerWidth;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
    });

    exports.ClubZhanBangRankItem = ClubZhanBangRankItem;
})(window);
