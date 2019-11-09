
(function () {
    var exports = this;
    var $ = null;

    var WanfaLayer_scpdk = cc.Layer.extend({
        onCCSLoadFinish: function () {
        },
        ctor: function (option) {
            this._super();
            var that = this;

            var mainscene = ccs.load(res.PkWanfa_Scpdk_json, 'res/');
            this.addChild(mainscene.node);

            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('root'), function () {

            });

            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });

            console.log(option);
            $('panel.fufei_value').setString(option.AA ? "AA支付" : "房主支付");
            $('panel.jushu_value').setString(option.jushu + "局");
            $('panel.genpai_value').setString(option.fengdingbomb + "炸");
            var wanfaArr = [];
            //人数
            if(option.liangrenSuiji){
                wanfaArr.push("两人(随机)");
            }else if(option.sanrenGuding){
                wanfaArr.push("三人(固定)");
            }else if(option.sanrenSuiji){
                wanfaArr.push("三人(随机)");
            }else if(option.sirenGuding){
                wanfaArr.push("四人(固定)");
            }
            if(option.heitao5xianchu){
                wanfaArr.push("黑桃5先出");
            }
            if(option.dierjuyingjiaxianchu){
                wanfaArr.push("第二局赢家先出");
            }
            if(option.four5FourA){
                wanfaArr.push("4个5/4个A(关牌)");
            }
            if(option.four5FourA){
                wanfaArr.push("4个5/4个A(关牌)");
            }
            if(option.qheiQhongQduiQlian){
                wanfaArr.push("全黑/全红/全对/全连(关牌)");
            }
            if(option.quanda){
                wanfaArr.push("全大(关牌)");
            }
            if(option.quanxiao){
                wanfaArr.push("全小(关牌)");
            }

            for(var i=2; i<wanfaArr.length; i+=2){
                wanfaArr[i] = "\n" +  wanfaArr[i];
            }
            $('panel.wanfa_value').setString(wanfaArr.join('  '));

            return true;
        }
    });
    exports.WanfaLayer_scpdk = WanfaLayer_scpdk;
})(window);
