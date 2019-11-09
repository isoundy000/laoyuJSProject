(function (exports) {

    var $ = null;

    var interval = null;
    var WxShopLayer = cc.Layer.extend({


        initListView: function (data) {
            this.layertyp = "chongzhi";
            var that = this;
            var listView = $('root.node1.ListView_1');
            listView.removeAllChildren();
            var fkArr = data.data;
            if (fkArr) {
                for (var i = 0; i < fkArr.length; i++) {
                    var fkInfo = fkArr[i];
                    var item = ccs.load(res.WxShopItem_json, "res/");
                    var custom_item = new ccui.Layout();
                    custom_item.setContentSize(item.node.getContentSize());
                    custom_item.addChild(item.node);

                    var layer = create$(custom_item.getChildByName("Layer"));
                    layer('fk.money').setString(fkInfo.amount + '元');
                    if (gameData.parent_id > 0) {
                        layer('fk.card').setString(fkInfo.agencyCnt + "张");
                    } else {
                        layer('fk.card').setString(fkInfo.cnt + "张");
                    }
                    layer('fk.zengtitle').setVisible(fkInfo.isactivity == 1);
                    layer('fk.zeng').setString((fkInfo.isactivity == 1 ? fkInfo.presenterCard:""));

                    (function (k) {
                        TouchUtils.setOnclickListener(layer('fk.buy'), function () {
                            // WXUtils.beginWxPay(fkArr[k].cid);
                            // var func = function () {
                            //     var wxPayCode = WXUtils.getWxPayCode();
                            //     if (wxPayCode == "sucess") {
                            //         WXUtils.setWxPayCode("");
                            //         if (interval) {
                            //             clearInterval(interval);
                            //             interval = null;
                            //         }
                            //         alert1("支付成功");
                            //         gameData.cardnum += ((gameData.parent_id > 0) ? fkArr[k].agencyCnt : fkArr[k].cnt);
                            //
                            //         var homelayer = HUD.getLayerById('home');
                            //         if(homelayer)  homelayer.setFangkaNum(gameData.cardnum);
                            //
                            //         if($('root.txtCount'))  $('root.txtCount').setString(gameData.cardnum || 0);
                            //     } else if (wxPayCode == "failed") {
                            //         WXUtils.setWxPayCode("");
                            //         if (interval) {
                            //             clearInterval(interval);
                            //             interval = null;
                            //         }
                            //         alert1("支付失败");
                            //     }
                            // }
                            // interval = setInterval(func, 100);
                            // if(gameData.parent_id>0){
                                // TalkingDataUtils.onChargeRequest(""+fkArr[k].cid,fkArr[k].name,""+fkArr[k].amount,"CNY",""+fkArr[k].amount,"WeiXin");
                                // WXUtils.beginWxPay(fkArr[k].cid);
                            // }else{
                            //     alert2('你必须绑定才能购买商品', function () {
                            //         that.addChild(new BindingAgencyLayer());
                            //     }, null, true, false, true, true);
                            // }
                            var func = function(){
                                WXUtils.beginWxPay(fkArr[k].cid);
                            }
                            if(gameData.parent_id > 0){
                                func();
                            }else{
                                that.addChild(new BindingTipPop(func, fkArr[k]));
                            }
                        });
                    })(i);

                    listView.pushBackCustomItem(custom_item);
                }
            }

        },
        initListView2: function (data) {
            this.layertyp = "chongzhijilu";
            var infoArr = data.data;
            if (infoArr.length > 0) {
                var listView2 = $('root.node2.ListView_1')
                listView2.removeAllChildren();
                for (var i = 0; i < infoArr.length; i++) {
                    var info = infoArr[i];
                    var item = ccs.load(res.WxShopItem_json2, "res/");
                    var custom_item = new ccui.Layout();
                    custom_item.setContentSize(item.node.getContentSize());
                    custom_item.addChild(item.node);
                    var layer = create$(custom_item.getChildByName("Layer"));
                    layer('bg').setVisible(i % 2 == 0);
                    layer('order').setString(info.orderCode);
                    layer('money').setString(info.totalAmount + '元');
                    layer('id').setString(info.parent_id);
                    layer('time').setString(info.createTime);
                    layer('statu').setString(info.statusStr);
                    if (info.status == 0) {
                        layer('statu').setTextColor(cc.color(255, 0, 0));
                    } else if (info.status == 1) {
                        layer('statu').setTextColor(cc.color(6, 143, 35));
                    } else {
                        layer('statu').setTextColor(cc.color(255, 0, 0));
                    }

                    listView2.pushBackCustomItem(custom_item);
                }
            }

        },
        changeBtnState: function (index) {
            $('root.node1').setVisible(index == 0);
            $('root.node2').setVisible(index == 1);

        },
        send: function (that) {
            showLoading("努力加载中..");
            var data = {area: gameData.parent_area, playerid: gameData.uid, unionid: gameData.unionid};
            NetUtils.httpPost("http://pay.yayayouxi.com/payServer/order/findOrderListByPlayerId" //推荐制 通过id查找历史订单
                , data,
                function (data) {
                    if (data) {
                        hideLoading();
                        that.initListView2(data);
                    } else {
                        alert1("获取订单请求失败,请检查网络");
                    }
                },
                function () {
                    alert1("获取订单请求失败,请检查网络");
                }
            );

        },
        ctor: function (data) {
            this._super();
            var that = this;

            this.layertyp = "chongzhi";

            var scene = ccs.load(res.WxShopLayer_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            layerShowAni($('root'));

            if($('root.txtCount'))  $('root.txtCount').setString(gameData.cardnum || "0");

            $('root.node1.bindingPlayer').setVisible(gameData.parent_id > 0)
            $('root.node1.invite').setVisible(gameData.parent_id <= 0)
            TouchUtils.setOnclickListener($('root.close'), function () {
                if(that.layertyp == "chongzhijilu"){
                    that.changeBtnState(0);
                    that.initListView(data);
                }else{
                    // that.removeFromParent();
                    layerHideAni($('root'), function(){
                        that.removeFromParent();
                    })
                }
            }, {sound:'return'});
            TouchUtils.setOnclickListener($('root.chongzhijilu'), function () {
                that.send(that);
                that.changeBtnState(1);
            });
            TouchUtils.setOnclickListener($('root.node2.refresh'), function () {
                that.send(that);
            });
            TouchUtils.setOnclickListener($('root.node1.invite'), function () {
                that.addChild(new BindingAgencyLayer());
            });
            this.initListView(data);

            // if (gameData.parent_id <= 0) {
            //     that.scheduleOnce(function(){
            //         that.addChild(new BindingAgencyLayer());
            //     }, 1);
            // }


            return true;
        },
        setFangka:function(){
            if($('root.txtCount'))  $('root.txtCount').setString(gameData.cardnum || 0);
        },
    });

    exports.WxShopLayer = WxShopLayer;
})(window);
