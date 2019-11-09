(function (exports) {

    cc.inputManager.setAccelerometerEnabled(true);

    var listener = null;

    exports.AccelerometerUtils = {
        start: function (cb) {
            listener = cc.eventManager.addListener({
                event: cc.EventListener.ACCELERATION,
                callback: function (acc, event) {
                    // x, y between [0, 1]
                    cb(acc.x, acc.y);
                }
            }, 1);
        },
        stop: function () {
            cc.eventManager.removeListener(listener);
            listener = null;
        }
    }

})(this);