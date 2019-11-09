/**
 * Created by dengwenzhong on 2017/6/8.
 */

(function () {
    var exports = this;

    var $ = null;
    var NiuniuWanfaLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function (data, gametype) {
            this._super();

            var that = this;

            if(gametype == 'zjh'){
                // var scene = ccs.load(res.Wanfa_zjh_json, "res/");
                var scene = loadNodeCCS(res.Wanfa_zjh_json, this, "Layer");
                // this.addChild(scene.node);
                $ = create$(this.getChildByName("Layer"));
                this.setZjhContent(data);
            }else{
                // var scene = ccs.load(res.NiuniuWanfa_json, "res/");
                var scene = loadNodeCCS(res.NiuniuWanfa_json, this, "Scene");
                // this.addChild(scene.node);
                $ = create$(this.getChildByName("Scene"));
                this.setContent(data);
            }

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


        },
        setContent: function (data) {
            // console.log(data);
            var fufei = data['AA']?"AA支付":"房主支付";
            var gaoji = '';
            var paixing = '无';
            var difen = data.Difen || "无";
            difen = difen.replace(/,/g, '/');
            var qitas = "";
            var tuizhus = "";
            if(!data.Difen){
                difen = data.basescore ? data.basescore : "无";
            }

            if(data['ChipInType']  == '1'){
                gaoji = '首局下注';
            }

            if(data['ChipInType']  == '2'){
                gaoji = '闲家推注';
            }

            var index = 0;
            if (data['Preview'] && data['Preview'].length > 0) {
                index = 1;
                var Preview = "全扣  ";
                if(data['Preview'] == "si"){
                    Preview = "扣一张  ";
                }else if(data['Preview'] == "san"){
                    Preview = "扣两张  ";
                }
                gaoji = gaoji + ((gaoji == '') ? '':' ') + Preview;
            }
            paixing = '';
            if(data.Xiaobeilv){
                paixing = paixing + ((data.Xiaobeilv == "3222") ? '双十x3十带九x2十带八x2十带七x2  ' : '双十x4十带九x3十带八x2十带七x2  ');
            }
            if(data.kuozhan1){
                paixing = paixing + "五花x6炸弹x6五小x8  ";
            }
            if(data.kuozhan2){
                paixing = paixing + "顺子x5葫芦x5同花x5  ";
            }
            if(data.noColor){
                paixing = paixing + "炸弹x8 四十大/十小x6  ";
            }
            if(data.tieban){
                paixing = paixing + "铁板牛  ";
            }
            if(data.Huapai){
                paixing = paixing + "癞子牌  ";
            }

            if(data.DisableHeiqiang){
                gaoji = gaoji + "下注限制" + "  ";
            }
            if(data.MaxTuizhu >= 0){
                tuizhus = tuizhus + data.MaxTuizhu + "倍";
            }
            if(data.Is_ztjr){
                qitas = qitas + "游戏中途加入" + "  ";
            }else if(data.Is_ztjr == false){
                qitas = qitas + "游戏中禁止加入" + "  ";
            }
            if(data.Meiniuxiazhuang){
                qitas = qitas + "没十下庄" + "  ";
            }
            if(data.ChipInOnce){
                qitas = qitas + "只下一次注" + "  ";
            }
            if(data.ZhuangMode == "Lunliu"){
                qitas = qitas + "轮庄" + "  ";
            }
            if(data.ZhuangMode == 'ShuijiBawang'){
                qitas = qitas + "霸王庄" + "  ";
            }
            if(data.ZhuangMode == 'Niuniu'){
                qitas = qitas + "双十上庄" + "  ";
            }
            if(data.Quick){
                qitas = qitas + "快速场" + "  ";
            }
            if(data.AutoDo){
                qitas = qitas + "超时托管" + "  ";
            }
            if(data.MinBegin > 0){
                qitas = qitas + data.MinBegin + "人自动开" + "  ";
            }else{
                qitas = qitas + "手动开始" + "  ";
            }
            if(data.Players){
                qitas = qitas + (data.Players == 'jiu'?'九人场':'六人场') + "  ";
            }

            if(data.Preview || data.Preview_mp){
                qitas = qitas + "  " + (data.Cuopai ? "搓牌":"禁止搓牌");
            }

            $('root.panel.fufei_value').setString(fufei);
            $('root.panel.jushu_value').setString((data.jushu || data.rounds)+"局");
            $('root.panel.paixing_value').setString(paixing);
            $('root.panel.difen_value').setString(difen);
            $('root.panel.xuanxiang_value').setString(gaoji);
            $('root.panel.wanfa_value').setString(data.BeiShu ? data.BeiShu+"倍" : "无");
            $('root.panel.qita_value').setString(qitas);
            $('root.panel.tuizhu_value').setString(tuizhus);

            var ZhuangMode = getZhuangMode(data);
            $('root.panel.zhuangjia_value').setString(ZhuangMode);
        }
    });

    exports.NiuniuWanfaLayer = NiuniuWanfaLayer;
})(window);
