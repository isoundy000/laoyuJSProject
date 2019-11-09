(function () {
    var exports = this;

    var $ = null;

    var root = null;

    var BDIphone = cc.Layer.extend({
        scheYZ: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            this.stopYZMSche();
        },
        scheYZM: function () { //验证码发送后的倒计时
            var that = this;
            that.stopYZMSche();

            $('root.panel.btn_yanzhengma').setVisible(false);
            $('root.panel.sendYZM').setVisible(true);
            var num = 60;
            this.scheYZ = setInterval(function () {
                if (num <= 0) {
                    that.stopYZMSche();
                    $('root.panel.btn_yanzhengma').setVisible(true);
                    $('root.panel.sendYZM').setVisible(false);
                    num = 60;
                }
                --num;
                $('root.panel.sendYZM.second').setString(num + 's');
            }, 1000);
        },
        stopYZMSche: function () {
            if (this.scheYZ) {
                clearInterval(this.scheYZ);
                this.scheYZ = null;
            }
        },

        ctor: function (isBD) {
            this._super();

            var that = root = this;
            var scene = loadNodeCCS(res.BDIphone_json, this);
            // this.addChild(scene.node);
            // addModalLayer(scene.node);
            $ = create$(this.getChildByName('Scene'));

            TouchUtils.setOnclickListener($('root.fake_root'), function () {});
            TouchUtils.setOnclickListener($('root.panel.btn_close'), function (node) {
                popHideAni($('root.panel'), function () {
                    that.removeFromParent();
                });
            });
            popShowAni($('root.panel'), true); //弹出特效

            $('root.panel.sendYZM').setVisible(false); //隐藏验证码倒计时

            if (isBD) {//绑定手机号
                $('root.panel.change_iphone').setVisible(false); //修改手机号 隐藏
                if (gameData.showBDcards > 0) {
                    $('root.panel.tip3').setString('绑定手机号,首次绑定即可领取' + gameData.showBDcards + '张房卡');
                } else {
                    $('root.panel.tip3').setString('绑定手机号。');
                }
            } else { //修改手机号
                $('root.panel.bangdingiphone').setVisible(false);
                $('root.panel.tip3').setString('绑定手机号。');
            }

            var input_iphone = $('root.panel.input_iphone');
            var input_yanzheng = $('root.panel.input_yanzheng');

            var nowPos = $('root.panel').getPositionY();
            input_iphone.addEventListener(function (textField, type) {
                var iphone = input_iphone.getString();
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            $('root.panel').setPositionY(nowPos + 250);
                        }
                        TouchUtils.setClickDisable($('root.panel.btn_close'), true);
                        TouchUtils.setClickDisable($('root.panel.btn_bangding'), true);
                        cc.log('attach with IME');
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            $('root.panel').setPositionY(nowPos);
                        }
                        TouchUtils.setClickDisable($('root.panel.btn_close'), false);
                        TouchUtils.setClickDisable($('root.panel.btn_bangding'), false);
                        cc.log('detach with IME');
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        cc.log('insert words');
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log('delete word');
                        break;
                    default:
                        break;
                }
            }, this);

            input_yanzheng.addEventListener(function (textField, type) {
                var yanzheng = input_yanzheng.getString();
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            $('root.panel').setPositionY(nowPos + 250);
                        }
                        TouchUtils.setClickDisable($('root.panel.btn_close'), true);
                        TouchUtils.setClickDisable($('root.panel.btn_bangding'), true);
                        cc.log('attach with IME');
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            $('root.panel').setPositionY(nowPos);
                        }
                        TouchUtils.setClickDisable($('root.panel.btn_close'), false);
                        TouchUtils.setClickDisable($('root.panel.btn_bangding'), false);
                        cc.log('detach with IME');
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        cc.log('insert words');
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log('delete word');
                        break;
                    default:
                        break;
                }
            }, this);

            //获取验证码
            TouchUtils.setOnclickListener($('root.panel.btn_yanzhengma'), function (node) {
                var iphone_num = $('root.panel.input_iphone').getString();
                var isAllNum = /^[0-9]\d*$/.test(iphone_num);

                if (iphone_num.length != 11 || !isAllNum) {
                    var tishi = new TiShi('您输入的手机号码有误，请重新输入');
                    that.addChild(tishi);
                    return;
                }
                if (iphone_num === gameData.BDIphone) {
                    var tishi = new TiShi('该手机号已绑定，请重新输入');
                    that.addChild(tishi);
                    return;
                }
                network.send(2008, {cmd: 'VerificationCode', mobile: iphone_num});
            });

            //确认绑定
            TouchUtils.setOnclickListener($('root.panel.btn_bangding'), function (node) {
                TouchUtils.setClickDisable($('root.panel.btn_bangding'), true);
                setTimeout(function () {
                    TouchUtils.setClickDisable($('root.panel.btn_bangding'), false);
                }, 400);

                var iphone_num = $('root.panel.input_iphone').getString();
                var yanzheng_num = $('root.panel.input_yanzheng').getString();

                var isAllNum1 = /^[0-9]\d*$/.test(iphone_num);
                var isAllNum2 = /^[0-9]\d*$/.test(yanzheng_num);

                if (iphone_num.length != 11 || !isAllNum1) { //先判断手机号
                    var tishi = new TiShi('您输入的手机号码有误，请重新输入');
                    that.addChild(tishi);
                    return;
                }
                if (!isAllNum2) { //再判断验证码
                    var tishi = new TiShi('您输入的验证码有误，请重新输入');
                    that.addChild(tishi);
                } else {
                    //发送验证码信息
                    network.send(2008, {cmd: 'BindMobile', mobile: iphone_num, vi_code: yanzheng_num});
                }
            });

            return true;
        }
    });

    var scheYZM = function () {
        root.scheYZM();
    };
    var removeSelf = function () {
        popHideAni($('root.panel'), function () {
            root.removeFromParent();
        });
    };

    exports.BDIphone = BDIphone;
    exports.BDIphone.scheYZM = scheYZM;
    exports.BDIphone.removeSelf = removeSelf;
})(window);
