(function (exports) {

    // iOS
    var UIDeviceBatteryStateUnknown = 0;
    var UIDeviceBatteryStateUnplugged = 1;
    var UIDeviceBatteryStateCharging = 2;
    var UIDeviceBatteryStateFull = 3;

    // Android
    var BATTERY_STATUS_UNKNOWN = 1;
    var BATTERY_STATUS_CHARGING = 2;
    var BATTERY_STATUS_DISCHARGING = 3;
    var BATTERY_STATUS_NOT_CHARGING = 4;
    var BATTERY_STATUS_FULL = 5;

    var REFRESH_BATTERY_INTERVAL = 2000;

    var parts;
    var lastRefreshTimestamp = 0;

    var refreshInfo = function () {
        var curTimestamp = getCurTimestamp();
        if (curTimestamp - lastRefreshTimestamp >= REFRESH_BATTERY_INTERVAL) {
            lastRefreshTimestamp = curTimestamp;
            var str = (cc.sys.os == cc.sys.OS_IOS
                ? jsb.reflection.callStaticMethod("AppController", "getBatteryInfo")
                : jsb.reflection.callStaticMethod(packageUri + '/utils/BatteryUtil', "getBatteryInfo", "()Ljava/lang/String;"));
            parts = str.split('-');
        }
    };

    exports.DeviceUtils = {
        getBatteryLevel: function () {
            var level = "100";
            if (cc.sys.os == cc.sys.OS_IOS) {
                // level = jsb.reflection.callStaticMethod(
                //     "AppController",
                //     "getBatteryLevel"
                // );
                if(getNativeVersion() != '3.1.0'){
                    level = jsb.reflection.callStaticMethod(
                        "AppController",
                        "getBatteryLevel"
                    );
                }else{
                    level = jsb.reflection.callStaticMethod('CommonUtil', 'getBatteryLevel');
                }
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                level = this.getBatteryPercent();
            }
            return Math.floor(Number(level));
        },
        getBatteryPercent: function () {
            if (!cc.sys.isNative)
                return 50;

            refreshInfo();
            return parseInt(parts[1]);
        },
        isCharging: function () {
            if (!cc.sys.isNative)
                return true;

            refreshInfo();

            var status = parts[0];
            if (cc.sys.os == cc.sys.OS_IOS)
                return status == UIDeviceBatteryStateCharging;
            if (cc.sys.os == cc.sys.OS_ANDROID)
                return status == BATTERY_STATUS_CHARGING;
        },
        vibrate: function () {
            if (cc.sys.os == cc.sys.OS_IOS)
                cc.Device.vibrate(1);
            if (cc.sys.os == cc.sys.OS_ANDROID)
                cc.Device.vibrate(1);
        },
        crash: function () {
            if (cc.sys.os == cc.sys.OS_IOS)
                jsb.reflection.callStaticMethod("AppController", "crash");
            else
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "crash", "(Z)V", true);
        },
        regBakBtn: function (node) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD, onKeyReleased: function (keyCode, event) {
                        if (keyCode == cc.KEY.back) {
                            alert2('确定退出游戏吗?', function () {
                                cc.director.end();
                            }, null, false, true, true);
                        }
                        else if (keyCode == cc.KEY.menu) {

                        }
                    }
                }, node);
            }
        },
        getSearchPaths: function () {
            return cc.sys.isNative ? jsb.fileUtils.getSearchPaths() : [];
        },
        addSearchPath: function (path) {
            if (!cc.sys.isNative)
                return;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            if (searchPaths.indexOf(path) < 0)
                searchPaths.splice(0, 0, path);
            jsb.fileUtils.setSearchPaths(searchPaths);
        }
    };

})(this);