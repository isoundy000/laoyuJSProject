/**
 * Created by duwei on 2018/10/17.
 */
(function () {
    var exports = this;
    var $ = null;
    var CoinShopLayer = cc.Layer.extend({
        ctor: function (parent,_ciType) {
            this._super();
            var that = this;
            parent.coinShop = this;
            var scene = loadNodeCCS(res.CoinShopLayer_json,that);
            $ = create$(this.getChildByName("Scene"));
            that.initUserInfo();
            that.showH5Shop(_ciType);
            network.send(2103, {cmd: 'updateLocal',  location: 3});

            TouchUtils.setOnclickListener($('root.close'), function () {
                that.removeFromParent();
                parent.coinShop =null ;
                network.send(3013);
                network.send(2103, {cmd: 'updateLocal',  location: 0});
            });

            cc.eventManager.addCustomListener("update3013WithCocosNtf", that.onNoticeUpdate);
            cc.eventManager.addCustomListener("removeShopWithCocosNtf", that.onNoticeRemoveSelf);

            return true;
        },

        //【非常重要】注意 uid 和 area 按照自己的底包的参数名称自己实现***************
        showH5Shop: function (ciType) {//ciType   房卡是1   金币是2   钻石是3
            var that = this;
            var uid = gameData.uid;
            var area = gameData.parent_area;
            var signKey = Crypto.MD5("feiyu-pay" + uid + area);

            var indexUrl =  PAY_QMDPURL + "/payServer/wxpay/app_pay/dist/index.html?";
            indexUrl+="area=" + area + "&buyerId=" + uid + "&source=5&ciType="+ciType+"&signKey=" + signKey+"&#http://";
            cc.log("indexUrl==="+indexUrl);

            if(cc.sys.os == cc.sys.OS_ANDROID && getNativeVersion() == '2.1.0'){
                cc.sys.openURL(indexUrl);
                return ;
            }
            var sizeX = 1280;
            var sizeY = 641;
            var webView = new ccui.WebView(indexUrl);
            webView.setContentSize(sizeX, sizeY);
            webView.setAnchorPoint(0.5, 0);
            webView.setPosition(cc.p(cc.winSize.width/2,0));
            that.addChild(webView);
        },

        initUserInfo: function () {
            if (gameData.numOfCards && gameData.numOfCards[1] >= 0) {
                gameData.cardnum = gameData.numOfCards[1];
                $("root.roomcard.txtCount").setString(equalNum(gameData.cardnum) || "0");
            }
            if (gameData.numOfCards && gameData.numOfCards[0] >= 0) {
                gameData.coinnum = gameData.numOfCards[0];
                $("root.roomcoin.txtCount").setString(equalNum(gameData.coinnum) || "0");
            }
            if (gameData.numOfCards && gameData.numOfCards[2] >= 0) {
                gameData.diamondnum = gameData.numOfCards[2];
                $("root.roomdiamond.txtCount").setString(equalNum(gameData.diamondnum) || "0");
            }
        },

        onNoticeRemoveSelf: function(){
            network.send(3013);
            network.send(2103, {cmd: 'updateLocal',  location: 0});
            this.removeFromParent();
        },

        onNoticeUpdate: function (event) {
            if (!event){
                return;
            }
            var data = event.getUserData();
            if (!data){
                return;
            }
            var numOfCards = data["numof_cards"];
            if (numOfCards){
                gameData.numOfCards = numOfCards;
                if (numOfCards[1] >= 0) {
                    gameData.cardnum = numOfCards[1];
                    $("root.roomcard.txtCount").setString(equalNum(gameData.cardnum) || "0");
                }
                if (numOfCards[0] >= 0) {
                    gameData.coinnum = numOfCards[0];
                    $("root.roomcoin.txtCount").setString(equalNum(gameData.coinnum) || "0");
                }
                if (numOfCards[2] >= 0) {
                    gameData.diamondnum = numOfCards[2];
                    $("root.roomdiamond.txtCount").setString(equalNum(gameData.diamondnum) || "0");
                }
            }
        }
    });
    exports.CoinShopLayer = CoinShopLayer;
})(window);
