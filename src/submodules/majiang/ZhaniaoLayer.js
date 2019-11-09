(function (exports) {

    var $ = null;

    var ZhaniaoLayer = cc.Layer.extend({
        ctor: function (data, timeout) {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.Zhaoniao_json, this);
            // this.addChild(scene.node);

            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('root'), null, {effect: TouchUtils.effects.NONE});

            for (var i = 0; i < 6; i++)
                $('root.' + i).setOpacity(0);

            var A = 0.1, B = 0.2;

            var uid = data['uid'];
            var playerInfo = gameData.getPlayerInfoByUid(uid);
            var nickname = playerInfo ? ellipsisStr(_.trim(decodeURIComponent(playerInfo.nickname)), 6) : '';
            $('root.lb_title').setString("玩家" + nickname + "正在抓码");

            var paiArr = data['pai_arr'];
            var paiDelta = (6 - paiArr.length) * 46;
            for (var i = 0; i < paiArr.length; i++) {
                if(i>=6)
                    break;
                var pai = $('root.' + i);
                var paiName = 'p2l' + paiArr[i] + '.png';
                setSpriteFrameByName(pai, paiName, 'majiang/pai');
                pai.runAction(cc.sequence(cc.delayTime(i * A), cc.fadeIn(B)));
                pai.setPositionX(pai.getPositionX() + paiDelta);
            }

            this.scheduleOnce(function () {
                that.removeFromParent(true);
            }, timeout);

        }
    });

    exports.ZhaniaoLayer = ZhaniaoLayer;
})(this);
