/**
 * Created by hjx on 2018/4/23.
 */
(function () {
    var exports = this;


    var $ = null;

    var TouLayer = cc.Layer.extend({
        maLayer: null,
        chakanCb: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data, cardId, op, seq) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.TouLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('root'), function () {
            });

            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.getParent().showOperationBtns();
                that.removeFromParent();
            });

            var parent = $('nodes');
            //test
            data = data || [{"Cards": [1106, 1106, 1106, 1106], "Type": 3}, {"Cards": [1112, 1112, 1112], "Type": 3}, {"Cards": [1112, 1112, 1112], "Type": 3}];

            var cardsSp = [];
            var spacing = 110;
            var spacingy = 85;
            var isHas4 = false;
            for (var i = 0; i < data.length; i++) {
                var cardSps = KaoKaoLayer.createGroupCards(undefined, data[i].Cards, 'short');
                if(cardSps.length >= 4) {
                    isHas4 = true;
                }
                for (var j = 0; j < cardSps.length; j++) {
                    parent.addChild(cardSps[j]);
                    cardSps[j].x = i * spacing;
                    cardSps[j].y = j * spacingy + spacingy/2;
                    cardSps[j].setRotation(-90);
                }

                // parent.addChild(cardSp);
                // cardSp.x = i * spacing;
                // cardsSp.push(cardSp);
                (function (cards) {
                    var lis = function () {
                        var str = cards.join(',');
                        network.sendPhz(5000, "EatCard/" + op + "/" + str + '/' + seq);
                        that.removeFromParent();
                    }
                    for (var j = 0; j < cards.length; j++) {
                        TouchUtils.setOnclickListener(cardSps[j], lis)
                    }

                })(data[i].Cards);
            }
            parent.x -= ((data.length - 1) * spacing / 2 * 0.65);
            parent.setScale(0.65)
            if(isHas4){
                parent.y += 6;
            }else{
                parent.y += 30;
            }


            return true;
        }
    });

    exports.TouLayer = TouLayer;
})(window);
