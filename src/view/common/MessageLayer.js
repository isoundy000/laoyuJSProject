(function (exports) {
    var exports = this;
    var MessageLayer = cc.Layer.extend({

        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function (message, data) {
            this._super();
            var that = this;

            var message = message || 'error';
            var color = data && data.color || cc.color(255, 255, 255);
            var fontName = data && data.fontName || res.default_ttf;
            var fontSize = data && data.fontSize || 30;

            var text = new cc.LabelTTF(message, fontName, fontSize);
            //text.retain();

            var bgSize = text.getContentSize();
            bgSize = cc.size(Math.max(bgSize.width + 100, 500), bgSize.height + 30);
            var msgbg = new cc.Scale9Sprite(res.msgbg);
            msgbg.setContentSize(bgSize);
            msgbg.setPosition(cc.winSize.width / 2, cc.winSize.height - 200);
            that.addChild(msgbg);


            msgbg.addChild(text);
            //text.release();
            text.setPosition(bgSize.width / 2, bgSize.height / 2);
            text.setColor(color);

            var acDela = new cc.DelayTime(1);
            var acMove = new cc.MoveBy(0.5, cc.p(0, 80));
            var acFade = new cc.FadeOut(1);
            var callBack = new cc.CallFunc(
                function () {
                    msgbg.setVisible(false);
                    that.removeFromParent(true);
                }
            );
            var action = new cc.Sequence(acDela, acMove, acFade, callBack);
            msgbg.runAction(action);

            return true;
        }
    });

    exports.MessageLayer = MessageLayer;
})(window);

