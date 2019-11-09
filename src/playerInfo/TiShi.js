(function () {
    var exports = this;

    var $ = null;

    var TiShi = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },

        ctor: function (TYPE_Str,callBack) {
            this._super();

            var that = this;
            var scene = loadNodeCCS(res.TiShi_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('root.fake_root'), function () {});
            TouchUtils.setOnclickListener($('root.panel.btn_close'), function (node) {
                // popHideAni($('root.panel'), function(){
                    that.removeFromParent();
                // })
            });
            // popShowAni($('root.panel')); //弹出特效


            if(TYPE_Str == 'jb'){  //解绑界面
                $('root.panel.tishi').setVisible(false);
                var iphone = gameData.BDIphone;
                iphone = iphone.replace(iphone.substr(3,4),"****");
                $('root.panel.tip2').setString(iphone);
                $('root.panel.tip2').setColor(cc.color(255,255,255));
                $('root.panel.btn_know').setVisible(false);
            }else if(TYPE_Str == 'jbok'){ //解绑成功
                $('root.panel.jiebangiphone').setVisible(false); //解绑标题隐藏
                $('root.panel.tip1').setString('解绑手机成功');
                $('root.panel.btn_sure').setVisible(false);
                $('root.panel.btn_cancel').setVisible(false);
                $('root.panel.btn_know').setVisible(true);
                $('root.panel.tip2').setString('2s后窗口关闭');

                setTimeout(function () {
                    $('root.panel.tip2').setString('1s后窗口关闭');
                }, 1000);
                setTimeout(function () {
                    $('root.panel.tip2').setString('0s后窗口关闭');
                }, 2000);
                setTimeout(function () {
                    popHideAni($('root.panel'), function () {
                        that.removeFromParent();
                    })
                }, 3000);
            }else if(TYPE_Str == 'exit'){
                $('root.panel.tishi').setVisible(true);
                $('root.panel.jiebangiphone').setVisible(false);
                $('root.panel.tip1').setString("是否确定退出登录?");
                $('root.panel.tip2').setVisible(false)
                $('root.panel.btn_know').setVisible(false);
            }
            else{
                $('root.panel.btn_cancel').setVisible(false);   //取消按钮隐藏
                $('root.panel.btn_sure').setVisible(false);     //确认按钮隐藏
                $('root.panel.tip1').setString(TYPE_Str);
                $('root.panel.tip2').setVisible(false);
                $('root.panel.btn_know').setVisible(true);
                $('root.panel.jiebangiphone').setVisible(false);
            }

            //获取验证码
            TouchUtils.setOnclickListener($('root.panel.btn_sure'), function (node) {
                if(TYPE_Str == 'jb'){
                    network.send(2008,{cmd: "UnbindMobile"});
                    popHideAni($('root.panel'), function(){
                        that.removeFromParent();
                    })
                }else{
                    if(callBack){
                        callBack()
                    }
                    popHideAni($('root.panel'), function(){
                        that.removeFromParent();
                    })
                }
            });
            //确认绑定
            TouchUtils.setOnclickListener($('root.panel.btn_cancel'), function (node) {
                popHideAni($('root.panel'), function(){
                    that.removeFromParent();
                })
            });

            //知道了
            TouchUtils.setOnclickListener($('root.panel.btn_know'), function (node) {
                if(callBack){
                    callBack()
                }
                popHideAni($('root.panel'), function(){
                    that.removeFromParent();
                })
            });



            return true;
        }
    });

    exports.TiShi = TiShi;
})(window);
