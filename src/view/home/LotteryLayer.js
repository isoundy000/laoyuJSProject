/**
 * Created by zhangluxin on 16/6/2.
 */
(function () {
    var exports = this;
    var $ = null;
    var MIN_ROTAT_TIMES = 3;
    var MAX_ROTAT_TIMES = 5;
    var PRIZE = {
        "fangka1": 1,
        "cashxianhua": 3,
        "cashxiangshui": 2,
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
    var IP = "http://www.yayayouxi.com/draw/hn?";
    var LotteryLayer = cc.Layer.extend({
        times: 0,
        result: null,
        onCCSLoadFinish: function () {
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function () {
            this._super();

            // var SIGN = Crypto.MD5('uid:' + gameData.uid + 'appid:' + APP_ID + '4K9QZpeHMIbVh695uAJw');

            var that = this;
            this.result = null;
            var mainscene = ccs.load(res.Lottery_json, "res/");
            this.addChild(mainscene.node);
            mainscene.node.runAction(mainscene.action);
            mainscene.action.play('action', true);
            $ = create$(this.getChildByName("Scene"));
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent(true);
            });
            $('touch_priority').setVisible(false);
            TouchUtils.setOnclickListener($('root.btn_start'), function () {
                if (that.times > 0) {
                    HUD.showLoading();
                    httpGet(IP + "uid=" + gameData.uid + '&appid=' + gameData.appId + "&operator=draw&sign=" + Crypto.MD5("xymjdraw" + gameData.uid),
                        function (str) {
                            HUD.removeLoading();
                            var jsonData = JSON.parse(str);
                            var status = jsonData.status;
                            if (status == 0) {
                                that.result = jsonData.data;
                                $('touch_priority').setVisible(true);
                                that.beginRotation();
                            } else {
                                HUD.showMessage("失败, 请检查网络连接");
                            }
                            that.times--;
                            $('txt_times').setString("您还有" + that.times + "次抽奖机会");
                            if (that.times > 0) {
                                TouchFilter.remove($('root.btn_start'));
                            } else {
                                TouchFilter.grayScale($('root.btn_start'));
                                TouchUtils.removeListeners($('root.btn_start'));
                                TouchUtils.setOnclickListener($('root.btn_cant_start'), function () {
                                    HUD.showMessage("您今天的抽奖次数已经用完,请明天再来!");
                                })
                            }
                        },
                        function (data) {
                            HUD.removeLoading();
                            HUD.showMessage("失败, 请检查网络连接");
                        }
                    );
                } else {
                    HUD.showMessage("您今天的抽奖次数已经用完,请明天再来!");
                }
            });
            TouchUtils.setOnclickListener($('root.btn_rule'), function () {
                HUD.showLoading();
                httpGet(IP + "uid=" + gameData.uid + '&appid=' + gameData.appId + "&operator=list",
                    function (str) {
                        HUD.removeLoading();
                        var jsonData = JSON.parse(str);
                        var status = jsonData.status;
                        if (status == 0) {
                            var data = jsonData.data;
                            var desc = data["desc"] || "";
                            that.addChild(new LotteryRuleLayer(desc));
                        } else {
                            HUD.removeLoading();
                            HUD.showMessage("失败, 请检查网络连接");
                        }
                    },
                    function (data) {
                        HUD.removeLoading();
                        HUD.showMessage("失败, 请检查网络连接");
                    }
                );
            });
            TouchUtils.setOnclickListener($('root.btn_myreward'), function () {
                HUD.showLoading();
                httpGet(IP + "uid=" + gameData.uid + '&appid=' + gameData.appId + "&operator=query",
                    function (str) {
                        HUD.removeLoading();
                        var jsonData = JSON.parse(str);
                        var status = jsonData.status;
                        if (status == 0) {
                            var data = jsonData.data;
                            var dataName = [];
                            for (var i = 0; i < data.length; i++) {
                                dataName.push(PRIZE_NAME[data[i]]);
                            }
                            that.addChild(new MyRewardLayer(dataName));
                        } else {
                            HUD.removeLoading();
                            HUD.showMessage("失败, 请检查网络连接");
                        }
                    },
                    function (data) {
                        HUD.removeLoading();
                        HUD.showMessage("失败, 请检查网络连接");
                    }
                );
            });
            TouchUtils.setOnclickListener($('btn_share'), function () {
                // if (!cc.sys.isNative) {
                //     return;
                // }
                // if (that.times == 0 && that.result != null) {
                //     shareUrl("phz.kwx0710.com", "【" + gameData.nickname + "】在丫丫跑胡子庆新年得大奖活动中抽中了【" + PRIZE_NAME[that.result] + "】，小伙伴们快来参加吧。", "", 1, getCurTimestamp() + gameData.uid);
                // } else {
                //     shareUrl("phz.kwx0710.com", "丫丫跑胡子，每天送现金红包，赢大奖！", "", 1, getCurTimestamp() + gameData.uid);
                // }
            });
            $('label').setVisible(false);
            $('result').setVisible(false);
            HUD.showLoading();
            httpGet(IP + "uid=" + gameData.uid + '&appid=' + gameData.appId + "&operator=list",
                function (str) {
                    HUD.removeLoading();
                    var jsonData = JSON.parse(str);
                    // console.log(jsonData);
                    var status = jsonData.status;
                    if (status == 0) {
                        var data = jsonData.data;
                        that.times = data["leftcount"] || 0;
                        $('txt_times').setString("您还有" + that.times + "次抽奖机会");
                        if (that.times > 0) {
                            TouchFilter.remove($('root.btn_start'));
                        } else {
                            TouchFilter.grayScale($('root.btn_start'));
                            TouchUtils.removeListeners($('root.btn_start'));
                            TouchUtils.setOnclickListener($('root.btn_cant_start'), function () {
                                HUD.showMessage("您今天的抽奖次数已经用完,请明天再来!");
                            })
                        }
                    } else if (status == 2) {
                        HUD.removeLoading();
                        HUD.showMessage("不在活动时间范围内,敬请关注活动时间。", function () {
                            that.removeFromParent(true);
                        });
                    } else {
                        HUD.removeLoading();
                        HUD.showMessage("失败, 请检查网络连接", function () {
                            that.removeFromParent(true);
                        });
                    }
                },
                function (data) {
                    HUD.removeLoading();
                    HUD.showMessageBox('提示', "失败, 请检查网络连接", function () {
                        that.removeFromParent(true);
                    });
                }
            );
            return true;
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
        showResult: function () {
            if (this.result != null) {
                $('label').setVisible(true);
                $('result').setVisible(true);
                $('result').setString(PRIZE_NAME[this.result]);
                if (this.result.indexOf("fangka") >= 0) {
                    HUD.showMessageBox('提示', '恭喜获得' + PRIZE_NAME[this.result] + '\n\n退出重新登录可看到房卡更新', function(){}, true);
                }
                else if (this.result.indexOf("none") >= 0) {
                } else {
                    HUD.showMessageBox('提示', "恭喜获得" + PRIZE_NAME[this.result] + ", 请联系\n微信 : yykf1699\n获取您的奖励", function(){}, true);
                }
            }
        },
        createRotatAction: function (dist) {
            var rotatTimes = this.randRotatTimes();
            var roundAction = cc.rotateBy(1.5, 360);
            var restAction = cc.rotateTo(0, 0);
            var roundTimesAction = cc.repeat(roundAction, rotatTimes);
            var distRadian = this.clacRadian(dist);
            var distRadianAction = cc.rotateBy(2, distRadian);
            var callback = cc.callFunc(function () {
                $('touch_priority').setVisible(false);
                this.showResult();
            }.bind(this));
            return cc.sequence(restAction, roundTimesAction, distRadianAction, callback).easing(cc.easeInOut(3));
        },
        clacRadian: function (dist) {
            return 360 - Math.floor(360 * (dist - 1) / 12);
        }
    });
    exports.LotteryLayer = LotteryLayer;
})(window);
