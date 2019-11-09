/**
 * Created by hjx on 2018/4/23.
 */
(function () {
    var exports = this;


    var $ = null;

    var ChiLayer = cc.Layer.extend({
        maLayer: null,
        chakanCb: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data, cardId, op, seq, isHasHu) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.ChiLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('root'), function () {
            });

            TouchUtils.setOnclickListener($('btn_close'), function () {
                if(!cc.sys.isObjectValid(that))
                    return;
                that.getParent().showOperationBtns();
                if(!cc.sys.isObjectValid(that))
                    return;
                that.removeFromParent();
            });

            var parent = $('nodes');
            //test
            data = data || [{"Cards": [1106, 1106, 1106], "Type": 3}, {"Cards": [1112, 1112, 1112], "Type": 3}];

            var spacing = 100;
            var spacingy = 85;
            for (var i = 0; i < data.length; i++) {
                var cards = deepCopy(data[i].Cards);
                // cards = _.filter(cards,function (card) {
                //     return parseInt(card)!=parseInt(cardId);
                // })
                var find = cards.indexOf(cardId);
                if (find >= 0) {
                    cards.splice(find, 1);
                }

                var cardSps = KaoKaoLayer.createGroupCards(undefined, cards, 'short');
                for (var j = 0; j < cardSps.length; j++) {
                    parent.addChild(cardSps[j]);
                    cardSps[j].x = i * spacing;
                    cardSps[j].j = j * spacingy;
                    cardSps[j].setRotation(-90);
                }

                (function (cards) {
                    TouchUtils.setOnclickListener(cardSps[0], function () {
                        var str = cards.join(',');
                        if (isHasHu) {
                            HUD.showConfirmBox('提示', '是否确认过胡，选择碰牌？', function () {
                                network.sendPhz(5000, "EatCard/" + op + "/" + str + '/' + seq);
                            }, "确定", function () {
                                maLayer.showOperationBtns();
                            }, "取消");
                        } else {
                            network.sendPhz(5000, "EatCard/" + op + "/" + str + '/' + seq);
                        }
                        that.removeFromParent();
                    })
                })(data[i].Cards);
            }
            parent.x -= ((data.length - 1 ) * spacing / 2);

            if (cardId) {
                var card = kaokaoRule.Card(cardId);
                setSpriteFrameByPath($('sprite_pai'), "image_" + card.resName, res.cp_cards);
            }
            return true;
        }
    });

    exports.ChiLayer = ChiLayer;
})(window);
