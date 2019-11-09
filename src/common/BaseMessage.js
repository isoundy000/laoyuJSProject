/**
 * Created by scw on 2018/5/28.
 */

var BaseMessage = (function () {

    var startReceive = function (mcode) {

        network.addListener(mcode, function (data) {
            cc.eventManager.dispatchCustomEvent("custom_listener_" + mcode, data);
        });
    }

    var startReceiveMatchMessage = function () {
        network.addListener(3333, function (data) {
            if (data && data['cmd']) {
                cc.eventManager.dispatchCustomEvent('match_' + data['cmd'], data);
            }
        });

        network.addListener(99999, function (data) {
            if (data && data['cmd']) {
                cc.eventManager.dispatchCustomEvent('jbc_' + data['cmd'], data);
            }
        });
    }

    return {
        startReceiveMatchMessage: startReceiveMatchMessage,
        startReceive: startReceive
    }
})();
