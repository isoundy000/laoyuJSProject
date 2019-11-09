/**
 * Created by hjx on 2018/2/8.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubJoinLayer = cc.Layer.extend({
        layerHeight: 0,
        ctor: function (data, isNew, isWhite) {
            this._super();

            var that = this;

            loadNodeCCS(res.JoinClubLayer_json, this);
            $ = create$(this.getChildByName("Layer"));

            var inputNode = $('input');
            inputNode.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            if (data) {
                inputNode.setString(data);
            }
            inputNode.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        that.setPositionY(320);
                        cc.log("attach with IME");
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        that.setPositionY(0);
                        cc.log("detach with IME");
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        cc.log("insert words");
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log("delete word");
                        break;
                    default:
                        break;
                }
            }, that);
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root'), function () {
            });
            TouchUtils.setOnclickListener($('btn_ok'), function () {
                inputNode.didNotSelectSelf();
                var input = inputNode.getString();


            });

            return true;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;
            that.msgList = [];
            this.list1 = cc.eventManager.addCustomListener('applyClub', function (event) {
                var data = event.getUserData();
                alert11(data.msg, 'noAnimation');
                that.removeFromParent();

            });
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
        }
    });

    exports.ClubJoinLayer = ClubJoinLayer;
})(window);