(function (exports) {

    var $ = null;
    var bindingId = -1;
    var bindingData = null;

    var BindingAgencyLayer = cc.Layer.extend({
        showBindingInfo: function (data) {
            $('root.mask').setVisible(false);
            $('root.binding').setVisible(true);
            $('root.bindingScusse').setVisible(false);
            var info = data.resultData;
            $('root.binding.id').setString(info.userId);
            $('root.binding.name').setString(info.username);
            loadImageToSprite(info.headimgUrl ? info.headimgUrl : res.defaultHead, $('root.binding.head'));
        },
        showBindingSucess: function () {
            $('root.mask').setVisible(false);
            $('root.binding').setVisible(false);
            $('root.bindingScusse').setVisible(true);
            var info = bindingData.resultData;
            $('root.bindingScusse.id').setString(info.userId);
            $('root.bindingScusse.name').setString(info.username);
            loadImageToSprite(info.headimgUrl ? info.headimgUrl : res.defaultHead, $('root.bindingScusse.head'));
        },
        ctor: function (parent_id) {
            this._super();
            var that = this;
            bindingId = -1;
            bindingData = null;
            var scene = loadNodeCCS(res.BindingAgency_json, this);
            // this.addChild(scene.node);
            // addModalLayer(scene.node);
            $ = create$(this.getChildByName('Scene'));

            popShowAni($('root'), true);

            var weixinLabel = $('root.weixin');
            if (gameData.opt_conf['dailiweixin']) {
                var weixinhao = gameData.opt_conf['dailiweixin'].replace(',', '\n');
                weixinLabel.setString(weixinhao);
            }
            if (parent_id > 0) {
                showLoading('努力加载中..');
                $('root.mask').setVisible(false);
                $('root.binding').setVisible(false);
                $('root.bindingScusse').setVisible(true);

                var data = {
                    area: gameData.parent_area,
                    agentId: parent_id,
                    playerId: gameData.uid
                };
                NetUtils.httpPost('http://pay.yayayouxi.com/newagent-console/thirdPartApi/getAgentById'  //推荐制 通过id获得代理的信息
                    , data,
                    function (data) {
                        hideLoading();
                        if (data.errCode == 10001) {
                            alert1('网络异常,请检查网络');
                            // that.removeFromParent();
                            popHideAni($('root'), function () {
                                that.removeFromParent();
                            });
                        }
                        else {
                            var info = data.resultData;
                            $('root.bindingScusse.id').setString(info.userId);
                            $('root.bindingScusse.name').setString(info.username);
                            loadImageToSprite(info.headimgUrl ? info.headimgUrl : res.defaultHead, $('root.bindingScusse.head'));
                        }
                    },
                    function (error) {
                        hideLoading();
                        alert1('网络异常,请检查网络');
                    }
                );
            } else {
                $('root.mask').setVisible(true);
                $('root.binding').setVisible(false);
                $('root.bindingScusse').setVisible(false);
                // console.log("没绑定");
            }

            TouchUtils.setOnclickListener($('root.close'), function () {
                // that.removeFromParent();
                popHideAni($('root'), function () {
                    that.removeFromParent();
                });
            }, {sound: 'close'});

            TouchUtils.setOnclickListener($('root.binding.btn_bangding'), function () {
                showLoading('努力加载中..');
                var str = _.trim(input.getString());
                var data = {
                    area: gameData.parent_area,
                    agentId: bindingId,
                    playerId: gameData.uid
                };
                NetUtils.httpPost('http://pay.yayayouxi.com/newagent-console/thirdPartApi/bindingPlayerParent' //推荐制 绑定代理id
                    , data,
                    function (data) {
                        hideLoading();
                        if (data.status) {
                            // if (data.errCode == 10001) {
                            //     alert1("网络异常,请检查网络");
                            // }
                            // else if (data.errCode == 20011) {
                            //     alert1(data.errMsg);
                            // }
                            // else {
                            gameData.parent_id = bindingId;
                            that.showBindingSucess();
                            gameData.cardnum += 18;

                            var homelayer = HUD.getLayerById('home');
                            if (homelayer) homelayer.setFangkaNum(gameData.cardnum);

                            that.getParent().setFangka();
                        }
                        else {
                            alert1(data.errMsg);
                        }
                    },
                    function (error) {
                        hideLoading();
                        alert1('网络异常,请检查网络');
                    }
                );
            });

            TouchUtils.setOnclickListener($('root.binding.btn_cancle'), function () {
                $('root.mask').setVisible(true);
                $('root.binding').setVisible(false);
                $('root.bindingScusse').setVisible(false);

            });
            var input = $('root.mask.input');
            input.setTextColor(cc.color(255, 255, 255));
            input.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);

            input.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        $('root.mask.tishi').setVisible(false);
                        cc.log('attach with IME');
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        cc.log('detach with IME');
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        $('root.mask.tishi').setVisible(false);
                        cc.log('insert words');
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log('delete word');
                        var str = _.trim(input.getString());
                        if (str.length <= 0) {
                            $('root.mask.tishi').setVisible(true);
                        }
                        break;
                    default:
                        break;
                }
            }, this);

            TouchUtils.setOnclickListener($('root.mask.btn_send'), function () {
                var str = _.trim(input.getString());
                bindingId = str;
                var isNumber = Number(str);
                //如果不全是数字，Number()返回值是NaN, 而NaN == NaN 是false,这样也防止输入是0的时候
                if (isNumber == isNumber) {
                    showLoading('努力加载中..');
                    var data = {
                        area: gameData.parent_area,
                        agentId: str,
                        playerId: gameData.uid
                    };
                    //192.168.199.241:8080
                    NetUtils.httpPost('http://pay.yayayouxi.com/newagent-console/thirdPartApi/getAgentById' //推荐制 验证代理id
                        , data,
                        function (data) {
                            hideLoading();
                            if (data.status) {
                                that.showBindingInfo(data);
                                bindingData = data;
                            }
                            else if (data.errCode == 20005) {
                                // $('mask.shuru').setVisible(false);
                                $('root.mask.chongxinshuru').setVisible(true);
                                setTimeout(function () {
                                    // $('mask.shuru').setVisible(true);
                                    $('root.mask.chongxinshuru').setVisible(false);
                                }, 2000);
                            }
                            else {
                                alert1(data.errMsg);
                            }
                        },
                        function (error) {
                            hideLoading();
                            alert1('网络异常,请检查网络');
                        }
                    );
                } else {
                    alert1('请输入数字');
                }
                if (!!str) {
                    input.setString('');
                    $('root.mask.tishi').setVisible(true);
                }
                input.didNotSelectSelf();
            });
            return true;
        },
    });

    exports.BindingAgencyLayer = BindingAgencyLayer;
})(window);
