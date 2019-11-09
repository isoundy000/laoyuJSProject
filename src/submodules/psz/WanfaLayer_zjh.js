/**
 * Created by dengwenzhong on 2017/6/8.
 */

(function () {
    var exports = this;

    var $ = null;
    var WanfaLayer_zjh = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function (data, gametype) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.Wanfa_zjh_json, this, "Layer");
            $ = create$(this.getChildByName("Layer"));
            this.setZjhContent(data);


            if($('root'))  $('root').setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);


            TouchUtils.setOnclickListener($('root.btClose'), function (node) {
                that.removeFromParent(true);
            }, {sound:'close'});
            return true;
        },
        setZjhContent: function(data){
            var zhifu = "";
            var jushu = "";
            var menpai = "";
            var bipai = "";
            var genpai = "";
            var bidaxiao = "";
            var wanfa = "";
            if(gameData.options){
                zhifu = gameData.options.AA ? "AA支付":"房主支付";
                jushu = gameData.options.jushu + "局";
                menpai = gameData.options.menround == 0 ? '不闷':gameData.options.menround + '轮';
                bipai = gameData.options.biround + '轮';
                genpai = gameData.options.genround + '轮';
                bidaxiao = gameData.options.bipai = 'daxiao' ? '比大小':(gameData.options.bipai = 'huase'? '比花色':'全比');
                wanfa += '下注倍数' + (gameData.options.zuidaxiazhu == 5?'2、3、4、5  ':'2、3、5、10  ');
                wanfa += (gameData.options.maxPlayerCnt == 5?'五人场  ':'九人场  ');
                wanfa += (gameData.options.qipaishijian == -1?'不弃牌  ':(gameData.options.qipaishijian+"秒弃牌  "));
                wanfa += (gameData.options.yunxujiaru?'允许中途加入  ':'禁止中途加入  ');
                wanfa += '底分' + gameData.options.difen + '  ';
                wanfa += gameData.options.canReadOtherPai ? '未比牌不可见  ':'';
                wanfa += gameData.options.yaman ? '押满  ':'';
                wanfa += gameData.options.baoziewai ? '豹子额外奖励  ':'';
                wanfa += gameData.options.bipaishuangbei ? '比牌双倍开  ':'';
                wanfa += gameData.options.jiesuansuanfen ? '解散局算分  ':'';
                wanfa += gameData.options.cuopai ? '搓牌  ':'';
                wanfa += gameData.options.qiepai ? '切牌  ':'';
                wanfa += gameData.options.autoReadyAfterEnd ? '自动准备  ':'';
            }else {
                var wanfaArr = data.split(',');
                // wanfaArr.shift();
                if (wanfaArr && wanfaArr.length > 0 && wanfaArr[0] == "拼三张") wanfaArr.shift();
                if (wanfaArr && wanfaArr.length >= 6) {
                    zhifu = wanfaArr[0];
                    jushu = wanfaArr[1].split(':')[1];
                    menpai = wanfaArr[2];
                    bipai = wanfaArr[3];
                    genpai = wanfaArr[4];
                    bidaxiao = wanfaArr[5];
                }
                var index = 0;
                for (var i = 6; i < wanfaArr.length; i++) {
                    wanfa = wanfa + wanfaArr[i] + "  ";
                    index++;
                }
                if (wanfaArr.indexOf("禁止中途加入") < 0 && wanfaArr.indexOf("允许中途加入") < 0) {
                    wanfa = wanfa + "允许中途加入" + "    ";
                }
            }

            $('root.panel.fufei_value').setString(zhifu);
            $('root.panel.jushu_value').setString(jushu);
            $('root.panel.genpai_value').setString(genpai);
            $('root.panel.bipai_value').setString(bipai);
            $('root.panel.menpai_value').setString(menpai);
            $('root.panel.wanfa_value').setString(bidaxiao + "  " + wanfa);
        }
    });

    exports.WanfaLayer_zjh = WanfaLayer_zjh;
})(window);
