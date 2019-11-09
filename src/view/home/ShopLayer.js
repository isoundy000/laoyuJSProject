(function () {
    var exports = this;

    var $ = null;
    var iapList = [
        { money: 6, card: 1, key: 'niudawang_fangka1' },
        { money: 30, card: 6, key: 'niudawang_fangka2' },
        { money: 128, card: 32, key: 'niudawang_fangka3' }
    ];
    var iapUrl = 'http://pay.yayayouxi.com/payServer/order/appleresult';
    var buyIndex = 0;
    var keyIap = 'yayagameiapkey_2017YY';

    var interval = null;

    var ShopLayer = cc.Layer.extend({
        // onExit: function(){
        //     console.log("exittt");
        //     if (interval) {
        //         clearInterval(interval);
        //         interval = null;
        //     }
        // },
        ctor: function (parent) {
            this._super();
            var that = this;

            var scene = ccs.load(res.ShopLayer_json, 'res/');
            addModalLayer(scene.node);
            this.addChild(scene.node);
            $ = create$(this.getChildByName('Scene'));
            var root = $('root');

            TouchUtils.setOnclickListener($('root.buy'), function () {
                if (!cc.sys.isNative) {
                    cc.log('购买项：', JSON.stringify(iapList[buyIndex]));
                    return;
                }
                showLoading('正在请求服务器..');
                var cid = iapList[buyIndex]['key'];
                IAPUtils.buy(cid);
                var func = function () {
                    var code = IAPUtils.getResultCode();
                    if (code == 'sucess') {
                        IAPUtils.setResultCode('');
                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                        var ticket = IAPUtils.getResult();
                        if (ticket == '' || ticket == null) return;

                        var area = 'youxian';
                        if (gameData.appId == APP_ID.FYDP) {
                            area = 'niuniu';
                        }
                        var data = {
                            ticket: ticket,
                            playerid: gameData.uid,
                            area: area,
                            appid: gameData.appId,
                            cid: cid,
                            timestamp: getCurTimestamp()
                        };
                        data.sign = Crypto.MD5(data.appid + data.area + data.cid + data.playerid + data.timestamp + keyIap);
                        httpPost(iapUrl, data, function (response) {
                            hideLoading();
                            IAPUtils.setResult('');
                            if (response.status == 0) {
                                //购买成功
                                alert1('支付成功');
                                gameData.cardnum += iapList[buyIndex]['card'];
                                // if(parent){
                                //     parent.setCardNum(gameData.cardnum);
                                // }
                                var homelayer = HUD.getLayerById('home');
                                if (homelayer) homelayer.setFangkaNum(gameData.cardnum);
                            } else {
                                alert1('支付失败');
                            }
                        }, function () {
                            hideLoading();
                            IAPUtils.setResult('');
                        }, true);
                    } else if (code == 'fail') {
                        IAPUtils.setResultCode('');
                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                        IAPUtils.setResult('');
                        hideLoading();
                    }
                };
                interval = setInterval(func, 100);
            });
            TouchUtils.setOnclickListener($('root.close'), function () {
                that.removeFromParent();
            });
            for (var i = 0; i < iapList.length; i++) {
                (function (i) {
                    $('root.fk' + (i + 1) + '.card').setString('房卡' + iapList[i].card + '张');
                    $('root.fk' + (i + 1) + '.money').setString(iapList[i].money + '元');
                    $('root.fk' + (i + 1) + '.light').setVisible(buyIndex == i);
                    TouchUtils.setOnclickListener($('touch' + (i + 1)), function () {
                        $('root.fk' + (buyIndex + 1) + '.light').setVisible(false);
                        $('root.fk' + (i + 1) + '.light').setVisible(true);
                        buyIndex = i;
                    });
                })(i);
            }
            return true;
        }
    });

    exports.ShopLayer = ShopLayer;
})(window);
