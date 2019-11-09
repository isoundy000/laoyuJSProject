/**
 * Created by hjx on 2018/11/14.
 */
(function () {
    var exports = this;

    var $ = null;
    var WanfaInfoLayer_sss = cc.Layer.extend({

        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data) {
            this._super();
            var that = this;
            loadNodeCCS(res.SSSWanfaLayer_json, this, undefined, true);
            $ = create$(this.getChildByName("Layer").getChildByName('root'));
            console.log(data);

            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent()
            });
            TouchUtils.setOnclickListener(this.getChildByName("Layer"), function () {
            });

            $('word_fufei_0').setString(data.AA ? "AA支付" : '房主支付');
            $('word_jushu_0').setString(data.rounds + "局");
            $('word_rs_0').setString(data.maxPlayerCnt + "人");
            $('word_lx_0').setString(data.gametype == 1 ? '普通' : data.gametype == 2 ? "抢庄" : '看牌下注');
            if (data.beilv && data.gametype !== 1) {
                $('word_bl_0').setString(data.beilv + "倍");
            } else {
                $('word_bl').setVisible(false)
                $('word_bl_0').setVisible(false)
            }


            var xuanxiangStr = '';
            if (data.mapai) {
                xuanxiangStr += ('马牌:' + sssRule._toChinese([data.mapai]) + '  ');
            } else {
                xuanxiangStr += '无马牌  '
            }
            if (data.guipai) {
                xuanxiangStr += (data.guipai + '张鬼牌\n');
            } else {
                xuanxiangStr += '无鬼牌\n'
            }
            if (data.chaoshichupai) {
                xuanxiangStr += (data.chaoshichupai + '秒超时出牌  ')
            } else {
                xuanxiangStr += ('不超时出牌  ')
            }
            if (data.zhongtujiaru) {
                xuanxiangStr += ('允许中途加入\n')
            } else {
                xuanxiangStr += ('不允许中途加入\n')
            }
            if (data.crazy) {
                xuanxiangStr += ('疯狂场  ')
            }
            if (data.firsttonghuashun) {
                xuanxiangStr += ('同花顺>铁支')
            }
            $('word_xx_0').setString(xuanxiangStr)


            var idx2name = ["无", "方块", "梅花", "红桃", "黑桃"]
            var str = '';
            str += ("正色：" + idx2name[data.zhengse])
            str += ("  副色：" + idx2name[data.fuse1])
            if (data.fuse2 != 0 && data.fuse1 != 0) {
                str += ("," + idx2name[data.fuse2])
            }
            // console.log(str)
            $('word_ys_0').setString(str);
        }
    });

    exports.WanfaInfoLayer_sss = WanfaInfoLayer_sss;
})(window);