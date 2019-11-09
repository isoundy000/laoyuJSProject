/**
 * Created by sungongxiang on 17/3/10.
 */
(function () {
    var exports = this;
    var $ = null;
    var MIN_ROTAT_TIMES = 3;
    var MAX_ROTAT_TIMES = 5;
    var PRIZE = {
        "fangka1": 1,
        "cashxianhua": 2,
        "cashxiangshui": 3,
        "fangka5": 4,
        "fangka10": 8
    };
    var PRIZE_NAME = {
        "fangka1": "房卡1张",
        "fangka5": "房卡5张",
        "cashxiangshui": "香水",
        "cashxianhua": "鲜花",
        "fangka10": "房卡10张"
    };
    var zhuan = false;
    var zhuanNum = 0;
    var zhuanValue = null;
    var chouJiang = false;

    var DuiHuan = false;


    var HuoDongLayer = cc.Layer.extend({
        times: 0,
        result: null,
        onCCSLoadFinish: function () {
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function () {
            this._super();
            var that = this;
            zhuanValue = null;
            this.result = null;
            var mainscene = ccs.load(res.HuoDongLayer_json, "res/");
            this.addChild(mainscene.node);
            mainscene.node.runAction(mainscene.action);
            mainscene.action.play('action', true);
            $ = create$(this.getChildByName("Scene"));
            zhuan = false;
            TouchUtils.setOnclickListener($('root.btn_fanhui'), function () {
                that.removeFromParent(true);
            });
            TouchUtils.setOnclickListener($('btn_start'), function () {
                if (zhuan == true) {
                    return;
                }
                if (zhuanNum <= 0) {
                    TouchFilter.grayMask($("btn_start"));
                    alert1("次数不够");
                    return;
                }

                // if (zhuanValue != null) {
                for (var i = 0; i <= 5; i++) {
                    if ($("plate.gaoliang_" + i))
                        $("plate.gaoliang_" + i).setVisible(false);
                }

                    // switch (zhuanValue) {
                    //     case 1:
                            $("plate.you_2").setVisible(false);
                            // break;
                        // case 2:
                            $("plate.xi_2").setVisible(false);
                            // break;
                        // case 3:
                            $("plate.zhou_2").setVisible(false);
                            // break;
                        // case 4:
                            $("plate.nian_2").setVisible(false);
                            // break;
                        // case 5:
                            $("plate.qing_2").setVisible(false);
                            // break;
                        // case 0:
                            $("plate.YY_2").setVisible(false);
                            // break;
                    // }

                    zhuanValue = null;
                // }

                var data = {
                    area: gameData.area,
                    appid: gameData.appId,
                    playerid: gameData.uid,
                    timestamp: getCurTimestamp()
                };

                zhuan = true;
                data.sign = Crypto.MD5(data.appid + data.area + data.playerid + data.timestamp + ZADAN_KEY);
                httpPost(ZADAN_URL + "getword", data, function (data) {
                        hideLoading();
                        if (data.status == 0) {
                            var jsonData = data.data;
                            var wordid = jsonData.wordid;
                            var wordname = jsonData.wordname;
                            var curRotation = $('btn_start').getRotation() % 360;
                            $('btn_start').runAction(that.createRotatAction(wordid, curRotation));

                            zhuanValue = wordid;
                        }else if (data.status == 2) {
                            alert1("未到活动时间", function () {
                            });
                        } else {
                            zhuan = false;
                        }
                    },
                    function () {
                        hideLoading();
                        zhuan = false;
                        alert1("请求失败,请稍后重试", function () {
                            that.removeFromParent(true);
                        });
                    });
            });
            TouchUtils.setOnclickListener($('root.btn_huodongguizhe'), function () {
                that.addChild(new HuoDongGuiZheLayer());

            });
            TouchUtils.setOnclickListener($('root.btn_choujiang'), function () {
                // if (chouJiang == false) {
                //     // Filter.grayMask($("root.btn_choujiang"));
                //     return;
                //
                // }
                // that.addChild(new ZaDanLayer());
                zhuanValue = null;
                if(DuiHuan == true){
                    TouchFilter.grayMask($('root.btn_choujiang'));
                    return;
                }

                var that = this;
                var data = {
                    area: gameData.area,
                    appid: gameData.appId,
                    playerid: gameData.uid,
                    timestamp: getCurTimestamp()
                };
                data.sign = Crypto.MD5(data.appid + data.area + data.playerid + data.timestamp + ZADAN_KEY);
                httpPost(ZADAN_URL + "exchange", data, function (data) {
                        hideLoading();
                        DuiHuan = true;
                        alert1(data.message, function () {

                            $("root.bg_main.text_num_1").setString(0 + "张");
                            $("root.bg_main.text_num_2").setString(0 + "张");
                            $("root.bg_main.text_num_3").setString(0 + "张");
                            $("root.bg_main.text_num_4").setString(0 + "张");
                            $("root.bg_main.text_num_5").setString(0 + "张");
                            $("root.bg_main.text_num_6").setString(0 + "张");

                            TouchFilter.grayMask($('root.btn_choujiang'));
                        });
                    }, function (data) {
                        hideLoading();
                        alert1("请求失败,请稍后重试", function () {

                        });
                    }
                );
            }, {effect : TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($('root.zhongjiang'), function () {
                that.addChild(new ZhongJiangLayer());
            });

            showLoading("努力加载中..");
            that.initPlayerInfo();
            return true;
        },
        initPlayerInfo: function () {
            var that = this;
            var data = {
                area:  gameData.area,
                appid: gameData.appId,
                playerid: gameData.uid,
                timestamp: getCurTimestamp()
            };
            // console.log("__________");
            data.sign = Crypto.MD5(data.appid + data.area + data.playerid + data.timestamp + ZADAN_KEY);
            httpPost(ZADAN_URL + "playerinfo", data, function (data) {
                    hideLoading();
                    if (data.status == 0) {
                        var jsonData = data.data;
                        that.initView(jsonData);
                        // var yaya = jsonData.yaya;
                        // var zhou = jsonData.zhou;
                        // var xi = jsonData.xi;
                        // var cancnt = jsonData.cancnt;
                        // var candraw = jsonData.candraw;
                        // var qing = jsonData.qing;
                        // var you = jsonData.you;
                        // var nian = jsonData.nian;
                        //
                        // zhuanNum = cancnt;
                        //
                        //
                        // $("text").setString(cancnt + "次");
                        // if (cancnt <= 0) {
                        //     Filter.heavyGrayMask($("btn_start"));
                        // }
                        // if (!candraw) {
                        //     chouJiang = false;
                        //     Filter.heavyGrayMask($("root.btn_choujiang"));
                        // } else {
                        //     Filter.remove($("root.btn_choujiang"));
                        //     chouJiang = true;
                        // }
                        // $("root.bg_main.text_num_1").setString(yaya + "张");
                        // $("root.bg_main.text_num_2").setString(you + "张");
                        // $("root.bg_main.text_num_3").setString(xi + "张");
                        // $("root.bg_main.text_num_4").setString(zhou + "张");
                        // $("root.bg_main.text_num_5").setString(nian + "张");
                        // $("root.bg_main.text_num_6").setString(qing + "张");
                        // if (yaya > 0) {
                        //     $("root.bg_main.yy_2").setVisible(true);
                        //     $("root.bg_main.yy_1").setVisible(false);
                        // } else {
                        //     $("root.bg_main.yy_2").setVisible(false);
                        //     $("root.bg_main.yy_1").setVisible(true);
                        // }
                        // if (you > 0) {
                        //     $("root.bg_main.you_2").setVisible(true);
                        //     $("root.bg_main.you_1").setVisible(false);
                        // } else {
                        //     $("root.bg_main.you_2").setVisible(false);
                        //     $("root.bg_main.you_1").setVisible(true);
                        // }
                        // if (xi > 0) {
                        //     $("root.bg_main.xi_2").setVisible(true);
                        //     $("root.bg_main.xi_1").setVisible(false);
                        // } else {
                        //     $("root.bg_main.xi_2").setVisible(false);
                        //     $("root.bg_main.xi_1").setVisible(true);
                        // }
                        // if (zhou > 0) {
                        //     $("root.bg_main.zhou_2").setVisible(true);
                        //     $("root.bg_main.zhou_1").setVisible(false);
                        // } else {
                        //     $("root.bg_main.zhou_2").setVisible(false);
                        //     $("root.bg_main.zhou_1").setVisible(true);
                        // }
                        // if (nian > 0) {
                        //     $("root.bg_main.nian_2").setVisible(true);
                        //     $("root.bg_main.nian_1").setVisible(false);
                        // } else {
                        //     $("root.bg_main.nian_2").setVisible(false);
                        //     $("root.bg_main.nian_1").setVisible(true);
                        // }
                        // if (qing > 0) {
                        //     $("root.bg_main.qing_2").setVisible(true);
                        //     $("root.bg_main.qing_1").setVisible(false);
                        // } else {
                        //     $("root.bg_main.qing_2").setVisible(false);
                        //     $("root.bg_main.qing_1").setVisible(true);
                        // }

                    }else if (data.status == 2) {
                        alert1("未到活动时间", function () {
                            that.removeFromParent(true);
                        });
                    } else {
                        alert1(data.message, function () {
                            that.removeFromParent(true);
                        });

                    }
                }, function (data) {
                    hideLoading();
                    alert1("请求失败,请稍后重试", function () {
                        that.removeFromParent(true);
                    });
                }
            );
        },
        beginRotation: function () {
            if (this.result != null && PRIZE[this.result]) {
                $('label').setVisible(false);
                $('result').setVisible(false);
                $('result').setString("");
                $('root.bg_main.plate').runAction(this.createRotatAction(PRIZE[this.result]));
            }
        },
        randRotatTimes: function () {
            return Math.floor(Math.random() * (MAX_ROTAT_TIMES - MIN_ROTAT_TIMES) + MIN_ROTAT_TIMES);
        },

        initView:function(jsonData){

            var yaya = jsonData.yaya;
            var zhou = jsonData.zhou;
            var xi = jsonData.xi;
            var cancnt = jsonData.cancnt;
            var candraw = jsonData.candraw;
            var qing = jsonData.qing;
            var you = jsonData.you;
            var nian = jsonData.nian;

            zhuanNum = cancnt;


            $("text").setString(cancnt + "次");
            if (cancnt <= 0) {
                TouchFilter.grayMask($("btn_start"));
            }
            if (!candraw) {
                chouJiang = false;
                TouchFilter.grayMask($("root.btn_choujiang"));
            } else {
                TouchFilter.remove($("root.btn_choujiang"));
                chouJiang = true;
            }
            if (zhuanValue != null) {
                var choujianglight = new cc.Sprite('res/image/ui/jizizhuanpan/light_choujiang.png')
                if (zhuanValue == 0) {
                    $("root.bg_main").addChild(choujianglight);
                    choujianglight.setPosition($("root.bg_main.text_1").getPosition());
                    choujianglight.runAction(cc.fadeIn(0));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    $("root.bg_main.text_num_1").runAction(
                        cc.sequence(
                            cc.callFunc(function () {
                                    $("root.bg_main.text_num_1").setTextColor(cc.color(255, 0, 0));
                                }
                            ),
                            cc.delayTime(1.2),
                            cc.callFunc(function () {
                                    // console.log("bbbbb");
                                    $("root.bg_main.text_num_1").setTextColor(cc.color(255, 255, 255));
                                    HUD.showMessage('恭喜你获得文字\'丫丫\'');
                                }
                            )
                        )
                    );
                }
                else if (zhuanValue == 1) {
                    $("root.bg_main").addChild(choujianglight);
                    choujianglight.setPosition($("root.bg_main.text_3").getPosition());
                    choujianglight.runAction(cc.fadeIn(0));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    $("root.bg_main.text_num_2").runAction(
                        cc.sequence(
                            cc.callFunc(function () {
                                    $("root.bg_main.text_num_2").setTextColor(cc.color(255, 0, 0));
                                }
                            ),
                            cc.delayTime(1.2),
                            cc.callFunc(function () {
                                    // console.log("bbbbb");
                                    $("root.bg_main.text_num_2").setTextColor(cc.color(255, 255, 255));
                                    HUD.showMessage('恭喜你获得文字\'游\'');
                                }
                            )
                        )
                    );

                }
                else if (zhuanValue == 2) {
                    $("root.bg_main").addChild(choujianglight);
                    choujianglight.setPosition($("root.bg_main.text_5").getPosition());
                    choujianglight.runAction(cc.fadeIn(0));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    $("root.bg_main.text_num_3").runAction(
                        cc.sequence(
                            cc.callFunc(function () {
                                    $("root.bg_main.text_num_3").setTextColor(cc.color(255, 0, 0));
                                }
                            ),
                            cc.delayTime(1.2),
                            cc.callFunc(function () {
                                    // console.log("bbbbb");
                                    $("root.bg_main.text_num_3").setTextColor(cc.color(255, 255, 255));
                                    HUD.showMessage('恭喜你获得文字\'戏\'');
                                }
                            )
                        )
                    );

                }
                else if (zhuanValue == 3) {
                    $("root.bg_main").addChild(choujianglight);
                    choujianglight.setPosition($("root.bg_main.text_7").getPosition());
                    choujianglight.runAction(cc.fadeIn(0));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    $("root.bg_main.text_num_4").runAction(
                        cc.sequence(
                            cc.callFunc(function () {
                                    $("root.bg_main.text_num_4").setTextColor(cc.color(255, 0, 0));
                                }
                            ),
                            cc.delayTime(1.2),
                            cc.callFunc(function () {
                                    // console.log("bbbbb");
                                    $("root.bg_main.text_num_4").setTextColor(cc.color(255, 255, 255));
                                HUD.showMessage('恭喜你获得文字\'周\'');
                                }
                            )
                        )
                    );

                }
                else if (zhuanValue == 4) {
                    $("root.bg_main").addChild(choujianglight);
                    choujianglight.setPosition($("root.bg_main.text_9").getPosition());
                    choujianglight.runAction(cc.fadeIn(0));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    $("root.bg_main.text_num_5").runAction(
                        cc.sequence(
                            cc.callFunc(function () {
                                    $("root.bg_main.text_num_5").setTextColor(cc.color(255, 0, 0));
                                }
                            ),
                            cc.delayTime(1.2),
                            cc.callFunc(function () {
                                    // console.log("bbbbb");
                                    $("root.bg_main.text_num_5").setTextColor(cc.color(255, 255, 255));
                                HUD.showMessage('恭喜你获得文字\'年\'');
                                }
                            )
                        )
                    );

                }
                else if (zhuanValue == 5) {
                    $("root.bg_main").addChild(choujianglight);
                    choujianglight.setPosition($("root.bg_main.text_11").getPosition());
                    choujianglight.runAction(cc.fadeIn(0));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    choujianglight.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2)).repeat(3));
                    $("root.bg_main.text_num_6").runAction(
                        cc.sequence(
                            cc.callFunc(function () {
                                    $("root.bg_main.text_num_6").setTextColor(cc.color(255, 0, 0));
                                }
                            ),
                            cc.delayTime(1.2),
                            cc.callFunc(function () {
                                    // console.log("bbbbb");
                                    $("root.bg_main.text_num_6").setTextColor(cc.color(255, 255, 255));
                                    HUD.showMessage('恭喜你获得文字\'庆\'');

                                }
                            )
                        )
                    );

                }
                // zhuanValue = null;
            }
            $("root.bg_main.text_num_1").setString(yaya + "张");
            $("root.bg_main.text_num_2").setString(you + "张");
            $("root.bg_main.text_num_3").setString(xi + "张");
            $("root.bg_main.text_num_4").setString(zhou + "张");
            $("root.bg_main.text_num_5").setString(nian + "张");
            $("root.bg_main.text_num_6").setString(qing + "张");
            if (yaya > 0) {
                $("root.bg_main.yy_2").setVisible(true);
                $("root.bg_main.yy_1").setVisible(false);
            } else {
                $("root.bg_main.yy_2").setVisible(false);
                $("root.bg_main.yy_1").setVisible(true);
            }
            if (you > 0) {
                $("root.bg_main.you_2").setVisible(true);
                $("root.bg_main.you_1").setVisible(false);
            } else {
                $("root.bg_main.you_2").setVisible(false);
                $("root.bg_main.you_1").setVisible(true);
            }
            if (xi > 0) {
                $("root.bg_main.xi_2").setVisible(true);
                $("root.bg_main.xi_1").setVisible(false);
            } else {
                $("root.bg_main.xi_2").setVisible(false);
                $("root.bg_main.xi_1").setVisible(true);
            }
            if (zhou > 0) {
                $("root.bg_main.zhou_2").setVisible(true);
                $("root.bg_main.zhou_1").setVisible(false);
            } else {
                $("root.bg_main.zhou_2").setVisible(false);
                $("root.bg_main.zhou_1").setVisible(true);
            }
            if (nian > 0) {
                $("root.bg_main.nian_2").setVisible(true);
                $("root.bg_main.nian_1").setVisible(false);
            } else {
                $("root.bg_main.nian_2").setVisible(false);
                $("root.bg_main.nian_1").setVisible(true);
            }
            if (qing > 0) {
                $("root.bg_main.qing_2").setVisible(true);
                $("root.bg_main.qing_1").setVisible(false);
            } else {
                $("root.bg_main.qing_2").setVisible(false);
                $("root.bg_main.qing_1").setVisible(true);
            }

        },

        showResult: function () {
            zhuan = false;
            if (zhuanValue != null) {
                $("plate.gaoliang_" + zhuanValue).setVisible(true);

                switch (zhuanValue) {
                    case 1:
                        $("plate.you_2").setVisible(true);
                        break;
                    case 2:
                        $("plate.xi_2").setVisible(true);
                        break;
                    case 3:
                        $("plate.zhou_2").setVisible(true);
                        break;
                    case 4:
                        $("plate.nian_2").setVisible(true);
                        break;
                    case 5:
                        $("plate.qing_2").setVisible(true);
                        break;
                    case 0:
                        $("plate.YY_2").setVisible(true);
                        break;
                }
                this.initPlayerInfo();
            }
        },
        createRotatAction: function (dist, curRotation) {
            if (dist == 0)
                dist = 6;
            var rotatTimes = this.randRotatTimes();
            var roundAction = cc.rotateBy(0.9, 360);
            // var restAction = cc.rotateTo(0, 0);
            var roundTimesAction = cc.repeat(roundAction, rotatTimes);
            var distRadian = this.clacRadian(dist);
            if (curRotation > distRadian) {
                distRadian = distRadian + 360 - curRotation;
            } else {
                distRadian = distRadian - curRotation;
            }
            var distTime = distRadian == 0 ? 0 : 2;
            var distRadianAction = cc.rotateBy(distTime, distRadian);
            var callback = cc.callFunc(function () {
                $('touch_priority').setVisible(false);
                this.showResult();


            }.bind(this));
            return cc.sequence(roundTimesAction, distRadianAction, callback).easing(cc.easeInOut(2));
        },
        clacRadian: function (dist) {
            return Math.floor(360 * (dist - 1) / 6);
        }
    });
    exports.HuoDongLayer = HuoDongLayer;
})(window);
