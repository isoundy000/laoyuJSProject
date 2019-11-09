(function () {
    var exports = this;

    var $ = null;
    var root = null;

    var NewPlayerInfo = cc.Layer.extend({

        onEnter: function () {
            var that = this;
            cc.Layer.prototype.onEnter.call(this);

            // //重连
            // network.setOnDisconnectListener(function () {
            //     cc.director.runScene(new CoverScene());
            // });
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },

        ctor: function () {
            this._super();

            var that = root = this;
            var scene = loadNodeCCS(res.NewPlayerInfo_json, this);
            // this.addChild(scene.node);
            // addModalLayer(scene.node);
            $ = create$(this.getChildByName('Scene'));

            TouchUtils.setOnclickListener($('root.fake_root'), function () {
            });
            TouchUtils.setOnclickListener($('root.panel.btn_close'), function (node) {
                // popHideAni($('root.panel'), function () {
                    that.removeFromParent();
                // });
            });
            // popShowAni($('root.panel'), true); //弹出特效

            //显示个人信息 name id  ip  location   iphone   renzheng
            $('root.panel.male').setVisible(gameData.sex == 1);
            $('root.panel.female').setVisible(gameData.sex == 2);
            $('root.panel.lb_nickname').setString(gameData.nickname);
            $('root.panel.lb_id').setString(gameData.uid);
            $('root.panel.lab_ip').setString(gameData.ip);
            $('root.panel.lab_location').setString(locationUtil.address || '未知位置');
            loadImage(gameData.headimgurl, $('root.panel.head'), false); //加载图片

            //判断绑定手机
            if (gameData.BDIphone == '' || gameData.BDIphone == null) { //未绑定手机
                $('root.panel.lab_iphone').setVisible(false);
                $('root.panel.btn_xiugai').setVisible(false);
                // $('root.panel.btn_jiebang').setVisible(false);

            } else { //已绑定手机
                $('root.panel.btn_bangding').setVisible(false);
                var iphone = gameData.BDIphone;
                iphone = iphone.replace(iphone.substr(3, 4), '****');
                $('root.panel.lab_iphone').setString(iphone);
            }
            //判断实名认证
            if (!gameData.hasShiMing) { //未实名
                $('root.panel.had_renzheng').setVisible(false);
            } else {
                $('root.panel.btn_rengzheng').setVisible(false);
            }

            //绑定手机
            TouchUtils.setOnclickListener($('root.panel.btn_bangding'), function (node) {
                var bdIphone = new BDIphone(true);
                that.addChild(bdIphone);
            });
            //修改手机号
            TouchUtils.setOnclickListener($('root.panel.btn_xiugai'), function (node) {
                var bdIphone = new BDIphone(false);
                that.addChild(bdIphone);
            });
            //解绑手机号
            TouchUtils.setOnclickListener($('root.panel.btn_jiebang'), function (node) {
                var tishi = new TiShi('jb');
                that.addChild(tishi);
            });

            //实名认证按钮
            TouchUtils.setOnclickListener($('root.panel.btn_rengzheng'), function (node) {
                var verify2 = new VerifyLayer();
                that.addChild(verify2);
            });

            //退出登录
            TouchUtils.setOnclickListener($('root.panel.btn_exit'), function (node) {
                var tishi = new TiShi('exit', function () {
                    cc.sys.localStorage.removeItem('wxToken');
                    cc.sys.localStorage.removeItem('openid');
                    cc.sys.localStorage.removeItem('xianliao_openid');
                    cc.sys.localStorage.removeItem('lbopenid');
                    gameData.hasLogined = false;
                    network.disconnect();
                    gameData.enterRoomWithClubID = 0;
                });
                that.addChild(tishi, 100);
            });

            return true;
        }
    });

    var newBDiphone = function () { //绑定解绑后修改界面

        if ($ == null) {
            return;
        }

        if (gameData.BDIphone.length > 0) { //绑定 改动 成功手机号
            $('root.panel.lab_iphone').setVisible(true);
            $('root.panel.btn_bangding').setVisible(false);
            var iphone = gameData.BDIphone;
            iphone = iphone.replace(iphone.substr(3, 4), '****');
            $('root.panel.lab_iphone').setString(iphone);
            $('root.panel.btn_xiugai').setVisible(true);
            // $('root.panel.btn_jiebang').setVisible(true);
        } else { //解绑手机号
            $('root.panel.lab_iphone').setVisible(false);
            $('root.panel.btn_xiugai').setVisible(false);
            $('root.panel.btn_bangding').setVisible(true);
            $('root.panel.btn_xiugai').setVisible(false);
            // $('root.panel.btn_jiebang').setVisible(false);
        }

    };
    var newShiMing = function () {
        if ($ == null) {
            return;
        }

        if (!gameData.hasShiMing) { //未实名
            $('root.panel.had_renzheng').setVisible(false);
            $('root.panel.btn_rengzheng').setVisible(true);
        } else {
            $('root.panel.had_renzheng').setVisible(true);
            $('root.panel.btn_rengzheng').setVisible(false);
        }

    };

    exports.NewPlayerInfo = NewPlayerInfo;
    exports.NewPlayerInfo.newBDiphone = newBDiphone;
    exports.NewPlayerInfo.newShiMing = newShiMing;

})(window);
