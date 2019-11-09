(function () {
    var exports = this;

    var $ = null;

    var TishiLayer_Club = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function (type, title, content, onOk, onCancel, canCancel, isHCenter, isVCenter, okRes, cancelRes, titleRes) {
            this._super();

            var that = this;

            if (type.indexOf('alert') == 0) {
                if (type == 'alert1') {
                   alert1(content, onOk);
                }
                else if (type == 'alert2') {
                    alert2(content, onOk, onCancel);
                }
            }

            return true;
        },

    });

    exports.TishiLayer_Club = TishiLayer_Club;
})(window);
