/**
 * Created by hjx on 2018/4/25.
 */
(function () {
    var exports = this;


    var $ = null;

    var KKJiesuanLayer = cc.Layer.extend({
        maLayer: null,
        chakanCb: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data, cb, posConf) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.KKJiesuanLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('root'), function () {
            });

            TouchUtils.setOnclickListener($('btn_close'), function () {
                if (cb) cb();
                that.removeFromParent();
            });


            TouchUtils.setOnclickListener($('btn_ready'), function () {
                network.sendPhz(5000, "Ready");
                if (cb) cb();
                that.removeFromParent();
            });
            $('btn_chakan').setVisible(false);


            // var str = "结算结果：\n";
            // str += (data.Reason + "\n");
            // str += (data.WinnerRemark + "\n");
            // var uid = data.Winner;
            // for (var i = 0; i < data.Users; i++) {
            //     var user = data.Users[i];
            //     str += (user.UserID + "  结果： " + user.Result + " 总分：" + user.Score + "  \n");
            // }
            // var card = kaokaoRule.Card(data.ByCard)
            // str += ("赢牌：" + card.name + "  id=" + card.id);
            var str = (" " + data.EndTime);
            $('lb_res').setString(str);

            var players = data.Users;
            for (var f = 0; f < players.length; f++) {
                var info = players[f];
                var row = posConf[info.UserID];
                var cards = info.CPAllCars.Cards;
                if (info.UserID == data.Winner && data.WinnerZimo) {
                    if (cards.indexOf(data.ByCard) >= 0) {
                        cards.splice(cards.indexOf(data.ByCard), 1);
                    }
                }

                var array2d = kaokaoRule.sortCards(cards);
                //计算居中显示
                var CARD_WIDTH = 36;
                var offx = 0 - array2d.length * CARD_WIDTH / 2;
                var offy = 30;
                if (row != 0) {
                    for (var i = 0; i < array2d.length; i++) {
                        for (var j = 0; j < array2d[i].length; j++) {
                            var pai = KaoKaoLayer.createCardSprite(array2d[i][j], 'small');//this.setPai(row, i+'_'+j, array2d[i][j], true , type)
                            pai.setPosition(cc.p(offx + i * CARD_WIDTH, offy + j * 40));
                            pai.setLocalZOrder(16 - j)
                            $('info' + row + "").addChild(pai);
                        }
                    }
                }
                if (info.UserID == data.Winner) {
                    var card = kaokaoRule.Card(data.ByCard);
                    var pai = KaoKaoLayer.createCardSprite(card.id, 'small');
                    if (gameData.uid != info.UserID) {
                        pai.setPosition(cc.p(offx + i * CARD_WIDTH + 20, offy));
                    } else {
                        pai.setPosition(0, 100);
                    }
                    $('info' + row + "").addChild(pai);
                }

                var score = info.Result || 0
                if (score > 0) {
                    $('info' + row + ".score").setColor(cc.color(238, 163, 35));
                } else {
                    $('info' + row + ".score").setColor(cc.color(185, 210, 205));
                }
                $('info' + row + ".score").setString(info.Result || 0);
                var showDesp = '';
                if (info.Dang) {
                    showDesp = '当 ' + showDesp;
                }
                if (info.Piao>0) {
                    showDesp = '飘 ' + showDesp;
                }

                if (info.UserID == data.Winner) {
                    showDesp += data.WinnerRemark;

                    if(!!data.FanFlag){
                        showDesp += ( " " + data.FanFlag + "番")
                    }
                    if(!!data.TuoScore){
                        showDesp += (" 点数:" + data.TuoScore)
                    }
                }

                $('info' + row + ".desp").setString(showDesp);
                if(players.length==3){
                    $('info3').setVisible(false);
                }
            }
            return true;
        },
        openZongjiesuan: function (data) {
            $('btn_chakan').setVisible(true);
            $('btn_ready').setVisible(false);
            var that = this;

            TouchUtils.setOnclickListener($('btn_chakan'), function () {
                that.getParent().addChild(new KKZongJiesuanLayer(data));
            });
        },
        replaySetting : function () {
            $('btn_chakan').setVisible(false);
            $('btn_ready').setVisible(false);
            $('root').setVisible(false);
        }
    });

    exports.KKJiesuanLayer = KKJiesuanLayer;
})(window);