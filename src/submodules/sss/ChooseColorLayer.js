/**
 * Created by hjx on 2018/9/28.
 */

(function () {
    var exports = this;

    var $ = null;
    var type = -1;

    var ChooseColorLayer = cc.Layer.extend({
        ctor: function (_type, resultCb, cbList) {
            this._super();
            var that = this;
            type = _type;
            loadNodeCCS(res.ColorSetLayer_json, this);
            $ = create$(this.getChildByName("Layer"));

            TouchUtils.setOnclickListener($('panel.btn_ok'), function () {
                console.log("确定");
                resultCb(that.getConfig());
                that.removeFromParent();
            });

            this.initView(cbList);
        },

        initView: function (cbList) {
            //获取玩家初始配置
            var idx1, idx2, idx3 = -1;
            for (var i = 0; i < 5; i++) {
                var zhengse = cbList['zhengse_' + i];
                var fuse1 = cbList['fuse1_' + i];
                var fuse2 = cbList['fuse2_' + i];
                if (zhengse.getChildByName('checkBox').isSelected()) {
                    idx1 = i;
                }
                if (fuse1.getChildByName('checkBox').isSelected()) {
                    idx2 = i;
                }
                if (fuse2.getChildByName('checkBox').isSelected()) {
                    idx3 = i;
                }
            }
            // console.log("initView " + idx1 + "    " + idx2 + "   " + idx3);
            idx1 = idx1 || 1;
            idx2 = idx2 || 1;
            idx3 = idx3 || 1;
            for (var i = 1; i <= 4; i++) {
                $('cb_zhu' + (i)).getChildByName('checkBox').setSelected(false);
                $('cb_fu' + (i)).getChildByName('checkBox').setSelected(false);
                if (idx1 == i) {
                    $('cb_zhu' + (i)).getChildByName('checkBox').setSelected(true);
                }
                if (idx2 == i) {
                    $('cb_fu' + (i)).getChildByName('checkBox').setSelected(true);
                }
                if (idx3 == i) {
                    $('cb_fu' + (i)).getChildByName('checkBox').setSelected(true);
                }
            }

            for (var i = 1; i <= 4; i++) {
                var node = $('cb_zhu' + i);
                node.setUserData({"zhu": i})
                var checkbox = node.getChildByName('checkBox');
                checkbox.addEventListener(this.cbListener, this);
                node = $('cb_fu' + i);
                node.setUserData({"fu": i})
                var checkbox = node.getChildByName('checkBox');
                checkbox.addEventListener(this.cbListener, this);
                if (type == 3) {
                    $('cb_fu' + i).setVisible(false)
                    $('text_fuhua').setVisible(false)
                    var node = $('cb_daxiao' + i);
                    if (node) {
                        node.setUserData({"daxiao": i})
                        var checkbox = node.getChildByName('checkBox');
                        checkbox.addEventListener(this.cbListener, this);
                    }
                }
            }


            if (idx1) {
                this.handleMutexField($('cb_zhu' + idx1))
            }

            //1色的时候 同花顺逻辑
            var firstTHS1 = cbList['firsttonghuashun_' + 0];
            var firstTHS2 = cbList['firsttonghuashun_' + 1];
            if (type == 3) {
                firstTHS1.setVisible(true);
                firstTHS2.setVisible(true);
                if (firstTHS1.getChildByName('checkBox').isSelected()) {
                    // console.log("1");
                    $('cb_daxiao1').getChildByName('checkBox').setSelected(true);
                    $('cb_daxiao2').getChildByName('checkBox').setSelected(false);
                }
                if (firstTHS2.getChildByName('checkBox').isSelected()) {
                    // console.log("2");
                    $('cb_daxiao1').getChildByName('checkBox').setSelected(false);
                    $('cb_daxiao2').getChildByName('checkBox').setSelected(true);
                }
                // console.log("333333");
            } else {
                firstTHS1.setVisible(false);
                firstTHS2.setVisible(false);
                $('text_daxiao').setVisible(false)
                $('cb_daxiao1').setVisible(false)
                $('cb_daxiao2').setVisible(false)
            }
        },

        /**
         * checkbox监听
         * @param sender
         */
        cbListener: function (sender) {
            var userData = sender.getParent().getUserData();
            // 取得checkbox
            var cb = sender.getParent().getChildByName('checkBox');
            var state = cb.isSelected();
            // 处理不可取消

            if (userData.disable) {
                alert1('主色牌与副色牌颜色必须不一致')
                cb.setSelected(!state)
                return;
            }
            if (!state) {
                cb.setSelected(true);
                return;
            }
            this.setSelected(sender.getParent(), state);
        },
        getConfig: function () {
            var obj = {
                zhengse: 0,
                fuse1: 0,
                fuse2: 0,
                firsttonghuashun: 1
            }
            var fuseCount = 1;
            for (var i = 1; i <= 4; i++) {
                if ($('cb_zhu' + i).getChildByName('checkBox').isSelected()) {
                    obj.zhengse = i;
                }
                if ($('cb_fu' + i).getChildByName('checkBox').isSelected() && type != 3) {
                    obj['fuse' + fuseCount] = i;
                    fuseCount++;
                }
                if (type == 3 && $('cb_daxiao' + i) && $('cb_daxiao' + i).getChildByName('checkBox').isSelected()) {
                    obj['firsttonghuashun'] = i-1;
                }
            }
            // console.log("CONFIG_>" + JSON.stringify(obj));
            return obj;
        },
        handleMutexField: function (node) {
            var userData = node.getUserData();
            // console.log(userData);
            if (userData.zhu !== undefined) {
                for (var i = 1; i <= 4; i++) {
                    if (i != userData.zhu) {
                        // console.log(" ------- ");
                        $('cb_zhu' + i).getChildByName('checkBox').setSelected(false);
                    }
                }
                if (type == 1) {//副花两种 定死的
                    var fuhuas = [];
                    if (userData.zhu == 1 || userData.zhu == 3) {
                        fuhuas = [2, 4]
                    } else if (userData.zhu == 2 || userData.zhu == 4) {
                        fuhuas = [1, 3]
                    }
                    for (var i = 1; i <= 4; i++) {
                        $('cb_fu' + i).getChildByName('checkBox').setSelected(false);
                        $('cb_fu' + i).getUserData().disable = true;
                    }
                    for (var i = 0; i < fuhuas.length; i++) {
                        $('cb_fu' + fuhuas[i]).getChildByName('checkBox').setSelected(true);
                    }
                }
                if (type == 2) {
                    var fuhuas = [];
                    if (userData.zhu == 1 || userData.zhu == 3) {
                        fuhuas = [2, 4]
                    } else if (userData.zhu == 2 || userData.zhu == 4) {
                        fuhuas = [1, 3]
                    }
                    for (var i = 1; i <= 4; i++) {
                        $('cb_fu' + i).getChildByName('checkBox').setSelected(false);
                        $('cb_fu' + i).getUserData().disable = true;
                    }
                    for (var i = 0; i < fuhuas.length; i++) {
                        $('cb_fu' + fuhuas[i]).getUserData().disable = false;
                        if (i == 0)
                            $('cb_fu' + fuhuas[i]).getChildByName('checkBox').setSelected(true);
                    }
                }
            } else if (userData.fu !== undefined) {
                if (type == 1) {
                    return;
                }
                if (type == 2) {
                    var otherFu = (userData.fu + 1) % 4 + 1;
                    // console.log(userData.fu + "---- otherFu---" + otherFu);
                    $('cb_fu' + userData.fu).getChildByName('checkBox').setSelected(true);
                    $('cb_fu' + otherFu).getChildByName('checkBox').setSelected(false);
                }
            } else if (userData.daxiao != undefined) {
                if (type == 3) {
                    $('cb_daxiao' + userData.daxiao).getChildByName('checkBox').setSelected(true);
                    $('cb_daxiao' + (userData.daxiao == 1 ? 2 : 1)).getChildByName('checkBox').setSelected(false);
                }
            }
        },

        /**
         * 设置选择
         * @param node
         * @param selected
         */
        setSelected: function (node, selected) {
            var userData = node.getUserData();
            // var light = node.getChildByName('light');
            // if (light) {
            //     light.setVisible(selected);
            // }
            // console.log(userData);
            // 不是选中不处理
            if (selected) {
                this.handleMutexField(node);
            }
            // var txt = node.getChildByName('text');
            // if (light.isVisible()) {
            //     if (!!txt) {
            //         txt.setColor(cc.color(21, 161, 31, 255));
            //     }
            // } else {
            //     if (!!txt) {
            //         txt.setColor(cc.color(175, 133, 108, 255));
            //     }
            // }
            // light.setVisible(false);
        },
    })

    exports.ChooseColorLayer = ChooseColorLayer;
})(window);