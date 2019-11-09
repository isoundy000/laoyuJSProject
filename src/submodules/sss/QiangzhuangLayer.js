/**
 * Created by hjx on 2018/10/9.
 */
(function () {
    var exports = this;

    var $ = null;
    var type = -1;
    var cmd = null;

    var QiangzhuangLayer = cc.Layer.extend({
        ctor: function (cards) {
            this._super();
            var that = this;
            loadNodeCCS(window.sensorLandscape?res.Qiangzhuang13shui_json:res.Qiangzhuang13shui_v_json, this,undefined,true);
            $ = create$(this.getChildByName("Layer"));
            $ = create$($("root"));

            this.cards = cards.slice(0, 8);
            this.cards.sort(function (a, b) {
                return a - b
            });
            console.log("QiangzhuangLayer ->" + this.cards)

            cards.sort(function (a, b) {
                return a - b
            });

            cmd = "Qiangzhuang/";

            for(var i=1;i<=8; i++){
                sssRule.setPaiFrame($('pk' + i), this.cards[i-1]);
                $('pk' + i).setOpacity(0)
                $('pk' + i).runAction(cc.sequence(cc.delayTime(i * 0.06),cc.fadeIn(0.1)));
            }
            var maxZhu = gameData.options.beilv || 5;
            for(var i=1;i<=5;i++){
                (function (rate) {
                    TouchUtils.setOnclickListener($('btn_' + rate), function () {
                        network.sendPhz(5000, cmd+gameData.curRound+ "/"+ rate);
                    });
                })(i)
                var tarPos = $('btn_' + i).getPosition();
                $('btn_' + i).x = $('btn_' + 1).x;
                $('btn_' + i).runAction(cc.moveTo(0.3,tarPos));//.easing(cc.easeBackIn()))
                if(maxZhu<i){
                    $('btn_' + i).setVisible(false)
                }
            }

            TouchUtils.setOnclickListener($('btn_buqiang' ), function () {
                network.sendPhz(5000, cmd+gameData.curRound+ "/"+ -1);
            });
            TouchUtils.setOnclickListener($('btn_sort' ), function () {
                console.log("排序---》");
                that.cards.sort(function (a, b) {
                    return sssRule.Card(a).type  - sssRule.Card(b).type;
                })
                for(var i=1;i<=8; i++){
                    sssRule.setPaiFrame($('pk' + i), that.cards[i-1]);
                    $('pk' + i).setOpacity(0)
                    $('pk' + i).runAction(cc.sequence(cc.delayTime(i * 0.06),cc.fadeIn(0.1)));
                }
                $('btn_sort2' ).setVisible(true);
                $('btn_sort' ).setVisible(false);
            });
            TouchUtils.setOnclickListener($('btn_sort2' ), function () {
                console.log("排序---》");
                that.cards.sort(function (a, b) {
                    return a-b;
                })
                for(var i=1;i<=8; i++){
                    sssRule.setPaiFrame($('pk' + i), that.cards[i-1]);
                    $('pk' + i).setOpacity(0)
                    $('pk' + i).runAction(cc.sequence(cc.delayTime(i * 0.06),cc.fadeIn(0.1)));
                }
                $('btn_sort2' ).setVisible(false);
                $('btn_sort' ).setVisible(true);
            });
            $('btn_sort' ).setVisible(false);
            console.log("准侧点击事件---》");
        },
        startXiazhu : function () {
            if(cmd == "Xiazhu/")return;

            this.setVisible(true);
            cmd = "Xiazhu/"
            var maxZhu = gameData.options.beilv || 5;
            for(var i=1;i<=5;i++){
                $('btn_' + i).setVisible(true);
                var tarPos = $('btn_' + i).getPosition();
                $('btn_' + i).x = $('btn_' + 1).x;
                $('btn_' + i).runAction(cc.moveTo(0.3,tarPos));//.easing(cc.easeBackIn()))
                if(i>maxZhu){
                    $('btn_' + i).setVisible(false);
                }
            }
            $('btn_buqiang' ).setVisible(false);

        },
    })
    exports.QiangzhuangLayer = QiangzhuangLayer;
})(window);