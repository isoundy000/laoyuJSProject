/**
 * Created by zhangluxin on 16/8/22.
 */
(function () {
    var exports = this;

    var $ = null;

    var ShareLayer = cc.Layer.extend({
        ctor: function () {
            var that = this;
            this._super();

            var scene = loadNodeCCS(res.ShareLayer_json, this);
            // this.addChild(scene.node);
            // addModalLayer(scene.node);
            $ = create$(this.getChildByName('Scene'));

            popShowAni($('root.main'), true);

            TouchUtils.setOnclickListener($('root.main.bg.share_friend'), function () {
                if (cc.sys.isNative) {
                    WXUtils.shareUrl('http://pay.bangshuiwang.com/fydp/', '【风云全民斗牌】',
                        '全民斗牌--风云邀您来斗牌，拼三张、跑得快、拼十任您挑，日进斗金不是梦，盆满钵盈笑开怀！', 0, getCurTimestamp() + gameData.uid);
                }
            });
            TouchUtils.setOnclickListener($('root.main.bg.share_round'), function () {
                if (cc.sys.isNative) {
                    WXUtils.shareUrl('http://pay.bangshuiwang.com/fydp/', '风云斗牌--风云邀您来斗牌，拼三张、跑得快、拼十任您挑，日进斗金不是梦，盆满钵盈笑开怀！', '', 1, getCurTimestamp() + gameData.uid);
                }
            });

            TouchUtils.setOnclickListener($('root.main.bg.share_xianLIao'), function () {
                if (getNativeVersion() < '2.2.0') {
                    alert1('请先升级最新版本');
                    return;
                }
                if (cc.sys.isNative) {
                    XianLiaoUtils.shareGame('99999', '全民风云斗牌邀您来斗牌，拼三张、跑得快、拼十任您挑，日进斗金不是梦，盆满钵盈笑开怀！', '全民风云斗牌邀您来斗牌，拼三张、跑得快、拼十任您挑，日进斗金不是梦，盆满钵盈笑开怀', 0, getCurTimestamp() + gameData.uid);
                }
            });

            TouchUtils.setOnclickListener($('root.main.btn_close'), function () {
                popHideAni($('root.main'), function () {
                    that.removeFromParent(true);
                });
            });
            return true;
        }
    });

    exports.ShareLayer = ShareLayer;
})(window);
