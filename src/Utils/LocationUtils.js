/**
 * 定位相关操作
 * Created by zhangluxin on 2017/2/8.
 */
var LocationUtil = cc.Class.extend({
    /**
     * 地球长轴(单位M)
     * @const
     * @private
     * @type {Number}
     */
    EARTH_RADIUS: 6378137.0,
    /**
     * π
     * @const
     * @private
     * @type {Number}
     */
    PI: Math.PI,
    /**
     * 刷新时间(2分钟)
     * @const
     * @private
     * @type {Number}
     */
    REFRESH_TIME: 120*1000,
    /**
     * 等待时间(1秒)
     * @const
     * @private
     * @type {Number}
     */
    WAIT_TIME: 1000,
    /**
     * 经度
     * @type{Number}
     * @public
     */
    longitude: 0.0,
    /**
     * 纬度
     * @type{Number}
     * @public
     */
    latitude: 0.0,
    /**
     * 地址
     * @type{String}
     * @public
     */
    address: '',
    /**
     * 等待Interval
     * @private
     */
    waitLocationInterval: null,
    /**
     * 已经启动
     * @type {Boolean}
     */
    isStart: false,

    /**
     * 已经启动
     * @type {Boolean}
     */
    alertOpenLocation: 2,
    /**
     * 角度转弧度
     * @param {Number} d 角度
     * @private
     * @returns {Number} 弧度
     */
    getRad: function (d) {
        return d * this.PI / 180.0;
    },
    /**
     * 启动地址
     * @private
     */
    startLocation: function () {
        if (window.inReview) return;

        //限制提示次数  如果不开定位 每天提示5次
        var today = new Date();
        var day = today.getMonth() + 1 + today.getDate();
        var reqDingweiTime = cc.sys.localStorage.getItem('reqDingweiTime' + day) || 0;
        var isHasLocationFlag = PermissionUtils.isHasLocationPermission();
        if(isHasLocationFlag == false){
            if(reqDingweiTime >= this.alertOpenLocation){
                console.log("定位关闭，不再请求了");
                return;
            }else{
                if(!reqDingweiTime)  reqDingweiTime = 0;
                reqDingweiTime = parseInt(reqDingweiTime) + 1;
                console.log("定位关闭，"+reqDingweiTime);
                cc.sys.localStorage.setItem('reqDingweiTime' + day, reqDingweiTime);
            }
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod('LocationManager', 'startLocation');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + '/utils/LocationManager', 'startLocation', '()V');
        }
    },
    /**
     * 清除获得的地址
     * @private
     */
    clearLocation: function () {
        if (window.inReview) return;
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod('LocationManager', 'clearCurLocation');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(packageUri + '/utils/LocationManager', 'clearCurLocation', '()V');
        }
    },
    /**
     * 取得当前的地址(经纬度)
     * @returns {String}
     * @private
     */
    getLocation: function () {
        if (window.inReview) {
            return null;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod('LocationManager', 'getCurLocation');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + '/utils/LocationManager', 'getCurLocation', '()Ljava/lang/String;');
        }
    },
    /**
     * 开始刷新地址
     * @public
     */
    startRefreshAddress: function () {
        if (window.inReview) {
            return;
        }
        this.refreshAddress();
        setTimeout(this.startRefreshAddress.bind(this), this.REFRESH_TIME);
    },
    /**
     * 刷新地址
     * @private
     */
    refreshAddress: function () {
        if (window.inReview) {
            return;
        }
        if (!cc.sys.isNative) {
            return;
        }
        if (this.isStart) {
            return;
        }
        this.clearLocation();
        this.startLocation();
        this.isStart = true;
        if (this.waitLocationInterval != null) {
            clearInterval(this.waitLocationInterval);
            this.waitLocationInterval = null;
        }
        this.waitLocationInterval = setInterval(this.waitLocation.bind(this), this.WAIT_TIME);
    },
    /**
     * 等待地址回调
     * @private
     */
    waitLocation: function () {
        var locationStr = this.getLocation();
        if (isNullString(locationStr)) {
            return;
        }
        if (this.waitLocationInterval == null) {
            return;
        }
        this.isStart = false;
        clearInterval(this.waitLocationInterval);
        var parts = locationStr.split(',');
        if (parts.length != 2) {
            return;
        }
        // ios版本的经纬度和android相反
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.longitude = parseFloat(parts[0]);
            this.latitude = parseFloat(parts[1]);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.latitude = parseFloat(parts[0]);
            this.longitude = parseFloat(parts[1]);
        }
        this.requestAddress();
    },
    /**
     * 请求地址
     */
    requestAddress: function () {
        if (window.inReview) return;
        var coordtype = 'wgs84ll';
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            // coordtype = 'bd09ll';
            var address = jsb.reflection.callStaticMethod(packageUri + '/utils/LocationManager', 'getCurLocationInfo', '()Ljava/lang/String;');
            if (isNullString(address)) {
                return;
            }
            this.address = address;
            // this.latitude = jsonData.result.location['lat'];
            // this.longitude = jsonData.result.location['lng'];
            // cc.log('请求地址信息成功!');
            network.send(3007, {
                location: this.latitude + ',' + this.longitude,
                locationCN: this.address
            });
            return;
        }
        var requestUrl = 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse';
        requestUrl += '&coordtype=' + coordtype;
        requestUrl += '&location=' + this.latitude + ',' + this.longitude;
        requestUrl += '&output=json';
        requestUrl += '&pois=0&ak=' + this.randomKey();
        NetUtils.httpGet(requestUrl, this.requestAddressSucess.bind(this), this.requestAddressFail.bind(this), {'Accept-Encoding': 'deflate'});
    },
    /**
     * 随机key
     */
    randomKey: function () {
        var id = Math.round(Math.random() * 3);
        var KEYS = [
            'WIVhGkuCRHrD57PnqK3hqZYpMjgavx9p',
            'Y8XAbnM0mhXYURWjX7EUer999wONTdRl',
            'haB8XTt53xh5uIZoAwEhYAAZVUrLhDWy',
            'NKOlWy6PxCWBXyoxT93LZhAVvw7UkPFZ'
        ];
        if (id < 0 || id >= KEYS.length) {
            id = 0;
        }
        return KEYS[id];
    },
    /**
     * 请求成功
     * @param str
     */
    requestAddressSucess: function (str) {
        try {
            str = str.substring(29, str.length - 1);
            var jsonData = JSON.parse(str);
            var status = jsonData.status;
            if (status != 0) {
                return;
            }
            this.address = jsonData.result['formatted_address'];
            this.latitude = jsonData.result.location['lat'];
            this.longitude = jsonData.result.location['lng'];
            // cc.log('请求地址信息成功!');
            network.send(3007, {
                location: this.latitude + ',' + this.longitude,
                locationCN: this.address
            });
        } catch (e) {
        }
    },
    /**
     * 请求失败
     */
    requestAddressFail: function () {
        cc.log('请求地址失败!!!!!')
    },
    /**
     * approx distance between two points on earth ellipsoid
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @returns {Number} distance
     * @public
     */
    getFlatternDistance: function (lat1, lng1, lat2, lng2) {
        lat1 = parseFloat(lat1);
        lng1 = parseFloat(lng1);
        lat2 = parseFloat(lat2);
        lng2 = parseFloat(lng2);
        var f = this.getRad((lat1 + lat2) / 2);
        var g = this.getRad((lat1 - lat2) / 2);
        var l = this.getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = this.EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        var ret = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
        return _.isNaN(ret) ? 0 : ret.toFixed(1);
    }
});
