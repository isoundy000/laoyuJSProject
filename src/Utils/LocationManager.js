/**
 * 定位类型
 * @type{Object}
 * */
var LocationType = {
    Baidu: 'Baidu',
    Gaode: 'Gaode'
};

/**
 * 定位
 * @type{Object}
 * */
var LocationManager = {
    type: LocationType.Baidu
    // type: LocationType.Gaode
};

/**
 * 定位刷新
 * @public
 * */
LocationManager.init = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return;
    }
    if(window.nativeVersion <= '3.0.0'){
        return;
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            jsb.reflection.callStaticMethod('BDLocationManager', 'init:', 'bYmYwRhGOmQnciUkLpzjzGQxAVxPusED');
        } else if (this.type === LocationType.Gaode) {
            jsb.reflection.callStaticMethod('GDLocationManager', 'init:', '4f0b022bc4fa8cb413aa7c86c1b18237');
        }
    }
};

/**
 * 定位刷新
 * @public
 * */
LocationManager.didUpdateLocation = function () {
    console.log('位置刷新--1--' + LocationManager.getCurLocation());
    console.log('位置刷新--2--' + LocationManager.getLocationInfo());
};

/**
 * 单次定位，不需要手动关闭
 * @public
 * */
LocationManager.requestLocation = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return;
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            jsb.reflection.callStaticMethod('BDLocationManager', 'requestLocation');
        } else if (this.type === LocationType.Gaode) {
            jsb.reflection.callStaticMethod('GDLocationManager', 'requestLocation');
        }
    }
};

/**
 * 开启持续定位
 * @public
 * */
LocationManager.startUpdatingLocation = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return;
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            jsb.reflection.callStaticMethod('BDLocationManager', 'startUpdatingLocation');
        } else if (this.type === LocationType.Gaode) {
            jsb.reflection.callStaticMethod('GDLocationManager', 'startUpdatingLocation');
        }
    }
};

/**
 * 关闭持续定位
 * @public
 * */
LocationManager.stopUpdatingLocation = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return;
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            jsb.reflection.callStaticMethod('BDLocationManager', 'stopUpdatingLocation');
        } else if (this.type === LocationType.Gaode) {
            jsb.reflection.callStaticMethod('GDLocationManager', 'stopUpdatingLocation');
        }
    }
};

/**
 * 清除定位信息
 * @public
 */
LocationManager.clearCurLocation = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return;
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            jsb.reflection.callStaticMethod('BDLocationManager', 'clearCurLocation');
        } else if (this.type === LocationType.Gaode) {
            jsb.reflection.callStaticMethod('GDLocationManager', 'clearCurLocation');
        }
    }
};

/**
 * 取得定位经纬度
 * @returns {String} 经纬度(String,String)
 */
LocationManager.getCurLocation = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return '113.897503,27.657331';
    }
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            return jsb.reflection.callStaticMethod('BDLocationManager', 'getCurLocation');
        } else if (this.type === LocationType.Gaode) {
            return jsb.reflection.callStaticMethod('GDLocationManager', 'getCurLocation');
        }
    }
    return '113.897503,27.657331';
};

/**
 * 获得具体地址信息
 * @public
 */
LocationManager.getCurLocationInfo = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return '';
    }
    var str = '';
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            str = jsb.reflection.callStaticMethod('BDLocationManager', 'getCurLocationInfo');
        } else if (this.type === LocationType.Gaode) {
            str = jsb.reflection.callStaticMethod('GDLocationManager', 'getCurLocationInfo');
        }
    }
    return str;
};

/**
 * 获得详细的地址信息
 * @public
 * */
LocationManager.getLocationInfo = function () {
    if (window.inReview || window.inBanShu || !cc.sys.isNative) {
        return '';
    }
    var str = '';
    if (cc.sys.os === cc.sys.OS_IOS) {
        if (this.type === LocationType.Baidu) {
            str = jsb.reflection.callStaticMethod('BDLocationManager', 'getLocationInfo');
        } else if (this.type === LocationType.Gaode) {
            str = jsb.reflection.callStaticMethod('GDLocationManager', 'getLocationInfo');
        }
    }
    return str;
};