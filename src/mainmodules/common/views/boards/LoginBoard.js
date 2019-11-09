/**
 * 登录界面
 */
var LoginBoard = Board.extend({
    _ccsFileName: common_res.LoginBoard_json,
    _clickListeners: {
        'btn_liaobei': '_clickLiaobei',
        'btn_xiaoliao': '_clickXianLiao',
        'btn_weixin': '_clickWeiXin',
        'btn_youke': '_clckYouKe',
        'xieyi.image_xieyi': '_clickXieYi'
    },
    _networkListeners: {
        Login: '_loginCallBack',
        Offline: '_playerOffline',
        RefreshPlayersLoc: '_refreshPlayersLocation',
        JoinRoom: '_joinRoom',
        ReContent: '_reConnect',
        SubUpdate: '_subUpdate',
        GS_UserJoin: '_userJoin',
        GS_UserJoin_NiuNiu: '_userJoin_NN'
    },
    /**
     * ip列表
     * @type {Array}
     * @private
     */
    _ipList: [],
    /**
     * 重试次数
     * @type {Number}
     * @private
     */
    _retryTime: 0,
    /**
     * 地址循环
     * @type {Number}
     * @private
     */
    _locInterval: null,
    /**
     * 等待循环
     * @type {Number}
     * @private
     */
    _waitAuthInterval: null,
    /**
     * 屏蔽登录点击
     * @type {Boolean}
     * @private
     */
    _loginClose: false,

    initBoard: function () {
        this._super();
        this._initUI();
        this._ipList = this._getIplist();
        this._quickLogin();
        network.setOnDisconnectListener(function () {
            showBoard('LoginBoard');
        });
    },
    /**
     * 控制按钮
     * @private
     */
    _initUI: function () {
        var isGuest = !cc.sys.isNative || window.inReview;
        this._nodeList['btn_liaobei'].setVisible(!isGuest);
        this._nodeList['btn_xiaoliao'].setVisible(!isGuest);
        this._nodeList['btn_weixin'].setVisible(!isGuest);
        this._nodeList['btn_youke'].setVisible(isGuest);
        this._nodeList['text_uid'].setVisible(isGuest);
        this._nodeList['version'].setString(window.curVersion);
    },
    /**
     * 快速登录
     * @private
     */
    _quickLogin: function () {
        var wxOpenid = cc.sys.localStorage.getItem('openid');
        var xlOpenid = cc.sys.localStorage.getItem('xianliao_openid');
        var lbOpenid = cc.sys.localStorage.getItem('lbopenid');
        if (!isNullString(wxOpenid)) {
            this._clickWeiXin();
            return;
        }
        if (!isNullString(xlOpenid)) {
            this._clickXianLiao();
            return;
        }
        if (!isNullString(lbOpenid)) {
            this._clickLiaobei();
            return;
        }
        cc.log('没有快速登录');
    },
    /**
     * 点击聊呗
     * @private
     */
    _clickLiaobei: function () {
        if (!this._nodeList['xieyi.cbBox'].isSelected()) {
            alert1('请先同意用户协议');
            return;
        }
        if (!LBUtils.isLBAppInstalled()) {
            alert1('您还没有安装聊呗');
        }
        if (this._loginClose) {
            return;
        }
        this._waitLoginClick();
        showLoading('拉取聊呗授权中..');
        var openid = cc.sys.localStorage.getItem('lbopenid');
        if (isNullString(openid)) {
            this._startWaitLiaoBei();
        } else {
            var response = {
                openid: cc.sys.localStorage.getItem('lbopenid'),
                nickname: decodeURIComponent(cc.sys.localStorage.getItem('nickname')),
                sex: cc.sys.localStorage.getItem('sex'),
                province: cc.sys.localStorage.getItem('province'),
                city: cc.sys.localStorage.getItem('city'),
                country: cc.sys.localStorage.getItem('country'),
                headimgurl: cc.sys.localStorage.getItem('headimgurl'),
                unionid: cc.sys.localStorage.getItem('unionid')
            };
            this._doLogin(response, 'lb');
        }
    },
    /**
     * 点击闲聊
     * @private
     */
    _clickXianLiao: function () {
        if (!this._nodeList['xieyi.cbBox'].isSelected()) {
            alert1('请先同意用户协议');
            return;
        }
        if (!XianLiaoUtils.isXianLiaoAppInstalled()) {
            alert1('您还没有安装闲聊');
        }
        if (this._loginClose) {
            return;
        }
        this._waitLoginClick();
        showLoading('拉取闲聊授权中..');
        var openid = cc.sys.localStorage.getItem('xianliao_openid');
        if (isNullString(openid)) {
            this._startWaitXianLiao();
        } else {
            var response = {
                openid: cc.sys.localStorage.getItem('xianliao_openid'),
                nickname: decodeURIComponent(cc.sys.localStorage.getItem('xianliao_nickname')),
                sex: cc.sys.localStorage.getItem('sex'),
                province: cc.sys.localStorage.getItem('province'),
                city: cc.sys.localStorage.getItem('city'),
                country: cc.sys.localStorage.getItem('country'),
                headimgurl: cc.sys.localStorage.getItem('xianliao_headimgurl'),
                unionid: cc.sys.localStorage.getItem('unionid')
            };
            this._doLogin(response, 'xl');
        }
    },
    /**
     * 点击微信
     * @private
     */
    _clickWeiXin: function () {
        if (!this._nodeList['xieyi.cbBox'].isSelected()) {
            alert1('请先同意用户协议');
            return;
        }
        if (!WXUtils.isWXAppInstalled()) {
            alert1('您还未安装微信');
            return;
        }
        if (this._loginClose) {
            return;
        }
        this._waitLoginClick();
        showLoading('拉取微信授权中..');
        var wxToken = cc.sys.localStorage.getItem('wxToken');
        var openid = cc.sys.localStorage.getItem('openid');
        if (isNullString(wxToken)) {
            this._startWaitWeiXin();
        } else if (!isNullString(openid)) {
            var response = {
                openid: cc.sys.localStorage.getItem('openid'),
                nickname: decodeURIComponent(cc.sys.localStorage.getItem('nickname')),
                sex: cc.sys.localStorage.getItem('sex'),
                province: cc.sys.localStorage.getItem('province'),
                city: cc.sys.localStorage.getItem('city'),
                country: cc.sys.localStorage.getItem('country'),
                headimgurl: cc.sys.localStorage.getItem('headimgurl'),
                unionid: cc.sys.localStorage.getItem('unionid')
            };
            this._doLogin(response, 'wx');
        } else {
            this._requestWeiXinAuthToken(wxToken);
        }
    },
    /**
     * 点击游客
     * @private
     */
    _clckYouKe: function () {
        if (!this._nodeList['xieyi.cbBox'].isSelected()) {
            alert1('请先同意用户协议');
            return;
        }
        var uid = this._nodeList['text_uid'].getString();
        if (isNullString(uid)) {
            uid = fetchUDID() + 'A';
        }
        var response = {
            openid: uid,
            nickname: '游客' + uid,
            sex: 1,
            province: '',
            city: '',
            country: '',
            headimgurl: res.defaultHead,
            unionid: uid
        };
        this._doLogin(response);
    },
    /**
     * 点击协议
     * @private
     */
    _clickXieYi: function () {
        cc.sys.openURL('https://www.yayayouxi.com/terms/gameTerms.html');
    },
    /**
     * 控制登录按钮屏蔽
     * @private
     */
    _waitLoginClick: function () {
        var self = this;
        self._loginClose = true;
        setTimeout(function () {
            self._loginClose = false;
        }, 20);
    },
    /**
     * 开始等待微信code
     * @param {String} key 绑定key
     * @param {String} data 绑定数据
     * @private
     */
    _startWaitWeiXin: function (key, data) {
        var self = this;
        WXUtils.redirectToWeixinLogin();
        if (this._waitAuthInterval) {
            clearInterval(this._waitAuthInterval);
        }
        this._waitAuthInterval = setInterval(function () {
            var code = WXUtils.getWXLoginCode();
            if (!isNullString(code)) {
                cc.log('wxcode = ' + code);
                clearInterval(self._waitAuthInterval);
                self._requestWeiXinAuthCode(code, key, data);
            }
        }, 100);
    },
    /**
     * 开始等待聊呗code
     * @private
     */
    _startWaitLiaoBei: function () {
        LBUtils.redirectToLiaoBeiLogin();
        if (this._waitAuthInterval) {
            clearInterval(this._waitAuthInterval);
        }
        this._waitAuthInterval = setInterval(this._waitLiaoBei.bind(this), 100);
    },
    /**
     * 开始等待闲聊code
     * @private
     */
    _startWaitXianLiao: function () {
        XianLiaoUtils.redirectToXianLiaoLogin();
        if (this._waitAuthInterval) {
            clearInterval(this._waitAuthInterval);
        }
        this._waitAuthInterval = setInterval(this._waitXianLiao.bind(this), 100);
    },
    /**
     * 等待聊呗
     * @private
     */
    _waitLiaoBei: function () {
        var code = LBUtils.getLBLoginCode();
        if (!isNullString(code)) {
            clearInterval(this._waitAuthInterval);
            this._requestLiaoBeiAuthCode(code);
        }
    },
    /**
     * 等待闲聊
     * @private
     */
    _waitXianLiao: function () {
        var code = XianLiaoUtils.getXianLiaoLoginCode();
        if (!isNullString(code)) {
            clearInterval(this._waitAuthInterval);
            this._requestXianLiaoAuthCode(code);
        }
    },
    /**
     * 请求聊呗code
     * @private
     */
    _requestLiaoBeiAuthCode: function (code) {
        var time = getCurTimeMillisecond();
        var sign = Crypto.MD5('request:/' + gameData.authPath + '/LiaobeiCode?Code=' + code + '&time=' + time);
        var url = 'http://auth.yygameapi.com:44440/' + gameData.authPath + '/LiaobeiCode?Code=' + code + '&time=' + time + '&sign=' + sign + '';
        NetUtils.httpGet(url, this._requestLiaoBeiAuthCodeSuccess.bind(this), this._requestLiaoBeiAuthCodeFailure.bind(this));
    },
    /**
     * 请求闲聊code
     * @private
     */
    _requestXianLiaoAuthCode: function (code) {
        var time = getCurTimeMillisecond();
        var sign = Crypto.MD5('request:/' + gameData.authPath + '/XianLiaoCode?Code=' + code + '&time=' + time);
        var url = 'http://auth.yygameapi.com:44440/' + gameData.authPath + '/XianLiaoCode?Code=' + code + '&time=' + time + '&sign=' + sign + '';
        NetUtils.httpGet(url, this._requestXianLiaoAuthCodeSuccess.bind(this), this._requestXianLiaoAuthCodeFailure.bind(this));
    },
    /**
     * 请求微信code
     * @private
     */
    _requestWeiXinAuthCode: function (code, key, data) {
        var time = getCurTimeMillisecond();
        var sign = Crypto.MD5('request:/' + gameData.authPath + '/WeichatCode?Code=' + code + '&time=' + time);
        var url = 'http://auth.yygameapi.com:44440/' + gameData.authPath + '/WeichatCode?Code=' + code + '&time=' + time + '&sign=' + sign + '';
        if (key && data) {
            sign = Crypto.MD5('request:/' + gameData.authPath + '/WeichatCode?Code=' + code + "&time=" + time + "&" + key + "=" + data);
            url = 'http://auth.yygameapi.com:44440/' + gameData.authPath + '/WeichatCode?Code=' + code + '&time=' + time + "&" + key + "=" + data + '&sign=' + sign + '';
        }
        NetUtils.httpGet(url, this._requestWeiXinAuthCodeSuccess.bind(this), this._requestWeiXinAuthCodeFailure.bind(this));
    },
    /**
     * 请求聊呗code成功
     * @private
     */
    _requestLiaoBeiAuthCodeSuccess: function (response) {
        var userInfo = JSON.parse(response);
        switch (userInfo.result) {
            case 0:
                cc.sys.localStorage.setItem('lbopenid', userInfo.liaobei.openId);
                cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.liaobei.nick));
                cc.sys.localStorage.setItem('headimgurl', userInfo.liaobei.smallPic + "#");
                cc.sys.localStorage.setItem('sex', userInfo.sex);
                cc.sys.localStorage.setItem('province', userInfo.province);
                cc.sys.localStorage.setItem('city', userInfo.city);
                cc.sys.localStorage.setItem('country', userInfo.country);
                cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                userInfo.nickname = userInfo.liaobei.nick;
                userInfo.headimgurl = userInfo.liaobei.smallPic + "#";
                userInfo.openid = userInfo.liaobei.openId;
                this._doLogin(userInfo, 'lb');
                break;
            case 2:
                this._startWaitWeiXin("LiaobeiData", userInfo.data);
                break;
            default:
                hideLoading();
                cc.sys.localStorage.removeItem('lbopenid');
                alert1('聊呗授权验证失败!');
                break;
        }
    },
    /**
     * 请求聊呗code失败
     * @private
     */
    _requestLiaoBeiAuthCodeFailure: function () {
        hideLoading();
        cc.sys.localStorage.removeItem('lbopenid');
        alert1('拉取聊呗code失败!,请重新登录');
    },
    /**
     * 请求闲聊code成功
     * @private
     */
    _requestXianLiaoAuthCodeSuccess: function (response) {
        var userInfo = JSON.parse(response);
        switch (userInfo.result) {
            case 0:
                cc.sys.localStorage.setItem('xianliao_openid', userInfo.xianliao.openId);
                cc.sys.localStorage.setItem('xianliao_nickname', encodeURIComponent(userInfo.xianliao.nick));
                cc.sys.localStorage.setItem('xianliao_headimgurl', userInfo.xianliao.smallPic + "#");
                cc.sys.localStorage.setItem('sex', userInfo.sex);
                cc.sys.localStorage.setItem('province', userInfo.province);
                cc.sys.localStorage.setItem('city', userInfo.city);
                cc.sys.localStorage.setItem('country', userInfo.country);
                cc.sys.localStorage.setItem('unionid', userInfo.unionid);
                userInfo.nickname = userInfo.xianliao.nick;
                userInfo.headimgurl = userInfo.xianliao.smallPic + "#";
                userInfo.openid = userInfo.xianliao.openId;
                this._doLogin(userInfo, 'xl');
                break;
            case 2:
                this._startWaitWeiXin("Data", userInfo.data);
                break;
            default:
                hideLoading();
                cc.sys.localStorage.removeItem('xianliao_openid');
                alert1('闲聊授权验证失败!');
                break;
        }
    },
    /**
     * 请求闲聊code失败
     * @private
     */
    _requestXianLiaoAuthCodeFailure: function () {
        hideLoading();
        cc.sys.localStorage.removeItem('xianliao_openid');
        alert1('拉取闲聊code失败!,请重新登录');
    },
    /**
     * 请求微信code成功
     * @private
     */
    _requestWeiXinAuthCodeSuccess: function (response) {
        var userInfo = JSON.parse(response);
        if (userInfo.result && userInfo.result != 0) {
            hideLoading();
            cc.sys.localStorage.removeItem('wxToken');
            cc.sys.localStorage.removeItem('openid');
            alert1('拉取微信code失败!,请重新登录');
            return;
        }
        cc.sys.localStorage.setItem('wxToken', userInfo.at);
        cc.sys.localStorage.setItem('openid', userInfo.openid);
        cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
        cc.sys.localStorage.setItem('sex', userInfo.sex);
        cc.sys.localStorage.setItem('province', userInfo.province);
        cc.sys.localStorage.setItem('city', userInfo.city);
        cc.sys.localStorage.setItem('country', userInfo.country);
        cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl);
        cc.sys.localStorage.setItem('unionid', userInfo.unionid);
        this._doLogin(userInfo, 'wx');
    },
    /**
     * 请求微信code失败
     * @private
     */
    _requestWeiXinAuthCodeFailure: function () {
        hideLoading();
        cc.sys.localStorage.removeItem('wxToken');
        cc.sys.localStorage.removeItem('openid');
        alert1('拉取微信code失败!,请重新登录');
    },
    /**
     * 请求微信token
     * @param {String} wxToken
     * @private
     */
    _requestWeiXinAuthToken: function (wxToken) {
        var time = getCurTimeMillisecond();
        var sign = Crypto.MD5('request:/' + gameData.authPath + '/WeichatToken?AccessToken=' + wxToken + '&time=' + time);
        var url = 'http://auth.yygameapi.com:44440/' + gameData.authPath + '/WeichatToken?AccessToken=' + wxToken + '&time=' + time + '&sign=' + sign + '';
        NetUtils.httpGet(url, this._requestWeiXinAuthTokenSuccess.bind(this), this._requestWeiXinAuthTokenFailure.bind(this));
    },
    /**
     * 请求微信token成功
     * @private
     */
    _requestWeiXinAuthTokenSuccess: function (response) {
        var userInfo = JSON.parse(response);
        if (userInfo.result == -10) {
            hideLoading();
            cc.sys.localStorage.removeItem('wxToken');
            alert1('您的微信授权信息已失效, 请重新登录');
        } else {
            cc.sys.localStorage.setItem('openid', userInfo.openid);
            cc.sys.localStorage.setItem('nickname', encodeURIComponent(userInfo.nickname));
            cc.sys.localStorage.setItem('sex', userInfo.sex);
            cc.sys.localStorage.setItem('province', userInfo.province);
            cc.sys.localStorage.setItem('city', userInfo.city);
            cc.sys.localStorage.setItem('country', userInfo.country);
            cc.sys.localStorage.setItem('headimgurl', userInfo.headimgurl);
            cc.sys.localStorage.setItem('unionid', userInfo.unionid);
            this._doLogin(userInfo, 'wx');
        }
    },
    /**
     * 请求微信token失败
     * @private
     */
    _requestWeiXinAuthTokenFailure: function () {
        hideLoading();
        alert1('拉取微信token失败!,请重新登录');
    },
    /**
     * 登录回调
     * @private
     */
    _loginCallBack: function (data) {
        gameData.hasLogined = true;
        gameData.uid = data.uid;
        gameData.numOfCards = data['numof_cards'];
        gameData.ip = data['ip'];
        gameData.isNew = data['is_new'];
        gameData.weixin = decodeURIComponent(data['weixin']);
        gameData.weixin2 = decodeURIComponent(data['weixin2']);
        gameData.triggers = data['triggers'] || [];
        gameData.map_conf = data['map_conf'] || {};
        gameData.opt_conf = data['opt_conf'] || {};
        gameData.refer = data['refer'];
        gameData.hasShiMing = data['hasShiMing'];
        gameData.o = data['create_time'] || '0';
        gameData.parent_id = data['parent_id'];
        // gameData.location = data['loc'];
        // gameData.locationInfo = data['locCN'];
        gameData.initMwLink(gameData.opt_conf.link);
        //春节活动
        gameData.newyear = gameData.opt_conf.newyear || false;
        gameData.ts = (data['ts'] || '000') + '';
        if (gameData.ts && gameData.ts.length > 3) {
            gameData.ts = gameData.ts[gameData.ts.length - 3];
            cc.sys.localStorage.setItem('playerLv', 'playerLv' + gameData.ts);
        }
        cc.sys.localStorage.setItem('playero', gameData.o);
        var isReconnect = data['is_reconnect'];
        if (!isReconnect) {
            // todo 要改
            HUD.showScene(HUD_LIST.Home);
        }
        // if (!data['now'] || data['now'] - data['locUpdTime'] > 300) {
        //     if (!window.inReview) {
        //         this._startLocation();
        //     }
        // } else {
        //     gameData.location = data['loc'];
        //     gameData.locationInfo = data['locCN'];
        // }
    },
    /**
     * 用户改变断线状态
     * @private
     */
    _playerOffline: function () {
    },
    /**
     * 刷新用户的地址
     * @private
     */
    _refreshPlayersLocation: function () {
    },
    /**
     * 加入房间
     * @param {String} data
     * @param {Number} errorCode
     * @private
     */
    _joinRoom: function (data, errorCode) {
        if (errorCode) {
            var errorMsg = null;
            if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
            if (errorCode == -30) errorMsg = '该房间已满员, 无法加入';
            if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
            if (errorCode == -40) errorMsg = '您的房卡不足';
            if (errorCode == -2) errorMsg = '版本过低。请退出后重新登陆';
            if (data && data.errorMsg) {
                errorMsg = data.errorMsg;
            }
            alert1(errorMsg);
            HUD.showScene(HUD_LIST.Home);
            return;
        }
        mRoom.wanfatype = "";
        gameData.roomId = data['room_id'];
        gameData.mapId = data['map_id'];
        gameData.gold_room_lev = data["gold_room_lev"] || 0;
        gameData.players = data['players'];
        gameData.ownerUid = data['owner'];
        gameData.wanfaDesp = data['desp'];
        gameData.playerNum = data['max_player_cnt'];
        gameData.daikaiPlayer = data['daikai_player'];
        gameData.curRound = data['cur_round'];
        network.stop();
        SubUpdateUtils.showGameScene();
    },
    /**
     * 断线重连
     * @private
     */
    _reConnect: function (data) {
        mRoom.wanfatype = "";
        gameData.roomId = data['room_id'];
        gameData.mapId = data['map_id'];
        gameData.gold_room_lev = data["gold_room_lev"] || 0;
        gameData.players = data["players"];
        gameData.playerNum = data['players'].length;
        gameData.daikaiPlayer = data['daikai_player'];
        network.stop();
        SubUpdateUtils.showGameScene(data);
    },
    /**
     * 模块更新
     * @private
     */
    _subUpdate: function (data) {
        // var sub = data.key;
        // var version = data.ver;
        // var source = data.source;
    },
    /**
     * 进入房间(胡子)
     * @private
     */
    _userJoin: function (event) {
        var data = event.getUserData();
        var Result = null;
        if (data.Head) {
            Result = data.Head.Result;
        }
        if (data.Result) {
            Result = data.Result;
        }
        if (Result > 0) {
            network.stop();
            mRoom.roomId = data.RoomID;
            gameData.roomId = mRoom.roomId;
            var option = data.Option;
            var obj = decodeHttpData(option);
            mRoom.rounds = obj.rounds;
            mRoom.getWanfa(obj);
            mRoom.ownner = data.Owner;

            mRoom.wanfatype = mRoom.YOUXIAN;
            HUD.showScene(HUD_LIST.Room, that);
        } else {
            var ErrorMsg = (data.Head) ? data.Head.ErrorMsg : data.ErrorMsg;
            HUD.showMessage(ErrorMsg);
            that.scheduleOnce(function () {
                gameData.hasLogined = false;
                network.disconnect();
            }, 1);
        }
    },
    /**
     * 进入房间(牛牛)
     * @private
     */
    _userJoin_NN: function (event) {
        var data = event.getUserData();
        var Result = null;
        if (data.Head) {
            Result = data.Head.Result;
        }
        if (data.Result) {
            Result = data.Result;
        }
        if (Result > 0) {
            network.stop();
            gameData.maxPlayerNum = 6;
            var option = data.Option == "" ? {} : JSON.parse(decodeURIComponent(data.Option));
            gameData.totalRound = option.rounds;
            gameData.leftRound = gameData.totalRound - (data.CurrentRound || 0);
            gameData.currentRound = data.CurrentRound;
            gameData.Option = option;
            gameData.is_daikai = option.is_daikai;
            gameData.Option.currentRound = data.CurrentRound;
            gameData.roomId = data.RoomID;
            gameData.mapId = option['mapid'];
            gameData.ownerUid = data.Owner;
            gameData.wanfatype = option.wanfa;
            gameData.players = data['Users'];
            gameData.WatchingUsers = data.WatchingUsers;
            mRoom.wanfatype = option.wanfa;
            mRoom.roomInfo = gameData.Option;
            mRoom.BeiShu = option.BeiShu;
            mRoom.Preview = option.Preview;
            mRoom.ZhuangMode = option.ZhuangMode;
            mRoom.Is_ztjr = option.Is_ztjr;
            mRoom.Cuopai = option.Cuopai;
            mRoom.noColor = option.noColor;
            if (option.Players == "jiu") {
                gameData.maxPlayerNum = 9;
            }
            network.stop();
            SubUpdateUtils.showGameScene(data);
        } else {
            var ErrorMsg = (data.Head) ? data.Head.ErrorMsg : data.ErrorMsg;
            HUD.showMessage(ErrorMsg);
            that.scheduleOnce(function () {
                gameData.hasLogined = false;
                network.disconnect();
            }, 1);
        }
    },
    /**
     * 执行登录
     * @private
     */
    _doLogin: function (response, loginType) {
        if (!response) {
            return;
        }
        showLoading('正在登录');
        var userInfo = response;
        gameData.loginType = loginType || 'yk';
        gameData.clientId = userInfo.openid;
        gameData.nickname = userInfo.nickname;
        gameData.sex = userInfo.sex;
        gameData.province = userInfo.province;
        gameData.city = userInfo.city;
        gameData.country = userInfo.country;
        gameData.headimgurl = userInfo.headimgurl;
        gameData.unionid = userInfo.unionid;
        this._retryTime = 0;
        this._connectServer();
    },
    /**
     * 联接服务器
     * @private
     */
    _connectServer: function () {
        if (this._retryTime > 0) {
            showLoading('正在进行第' + this._retryTime + '次尝试');
        }
        var ip = this._ipList[this._retryTime];
        network.connect(gameData.clientId, this._connectSuccess.bind(this), this._connectFailure.bind(this), ip);
    },
    /**
     * 联接成功
     * @private
     */
    _connectSuccess: function () {
        // todo 这里需要整理
        if (!cc.sys.isNative) {
            window.curVersion = '9.3.0';
        }
        var version = window.curVersion;
        if (window.inReview) {
            version = '3.0.0';
        }
        var data = {
            last_retry: this._retryTime,
            openid: gameData.clientId,
            nickname: gameData.nickname,
            sex: gameData.sex,
            province: gameData.province,
            city: gameData.city,
            country: gameData.country,
            headimgurl: gameData.headimgurl,
            unionid: gameData.unionid,
            version: version,
            nativeVersion: window.nativeVersion,
            isnative: (cc.sys.isNative ? 1 : 0),
            os: cc.sys.os,
            needComp: true
        };
        showLoading('正在发送登录请求');
        network.send(MsgCode.Login, data);
    },
    /**
     * 联接失败
     * @private
     */
    _connectFailure: function () {
        this._retryTime++;
        if (this._retryTime >= this._ipList.length) {
            hideLoading();
            alert1('网络访问失败，请检查网络');
            return;
        }
        this._connectServer();
    },
    /**
     * 由于不同app ip列表应该不同，所以在这里处理
     * 初始化iplist
     * @protected
     */
    _getIplist: function () {
        var ipList = [];
        // var unionid = cc.sys.localStorage.getItem('unionid') || '0';
        var third = gameData.gameUrl;
        var playero = (cc.sys.localStorage.getItem('playero') || '0');
        if (playero != '0') {
            playero = Math.floor((playero / 86400)) % aliyunyxdList2.length;
        }
        var nextIpUrl2 = getDAes(aliyunyxdList2[playero]);
        var second = null;
        if (!window.inReview) {
            second = getNextIp2(nextIpUrl2);
        }
        // var playerLv = cc.sys.localStorage.getItem('playerLv') || '0';
        var first = null;
        if (!window.inReview) {
            first = getNextIp2(gameData.yxdGroup);
        }
        if (first && /\d+\.\d+\.\d+\.\d+/.test(first)) {
            ipList.push(first);
        }
        if (second && /\d+\.\d+\.\d+\.\d+/.test(second)) {
            ipList.push(second);
        }
        ipList.push(third);
        return ipList;
    },
    /**
     * 取用户本地地址
     * @private
     */
    _startLocation: function () {
        if (this._locInterval) {
            clearInterval(this._locInterval);
        }
        this._locInterval = setInterval(this._waitLocation.bind(this), 100);
    },
    /**
     * 等待地址
     * @private
     */
    _waitLocation: function () {
        // var locationStr = LocationUtils.getCurLocation();
        // if (isNullString(locationStr)) {
        //     return;
        // }
        // // ios版本的经纬度和android相反
        // if (cc.sys.os == cc.sys.OS_IOS) {
        //     var parts = locationStr.split(',');
        //     if (parts.length > 1) {
        //         gameData.location = parts[1] + ',' + parts[0];
        //     } else {
        //         return;
        //     }
        // } else {
        //     gameData.location = locationStr;
        // }
        // LocationUtils.getCurLocationInfo(this._getLocationInfo.bind(this));
        // // 这里会关掉地址监听
        // LocationUtils.clearCurLocation();
        clearInterval(this._locInterval);
        this._locInterval = null;
    },
    /**
     * 取得具体地址
     * @private
     */
    _getLocationInfo: function (info, lng, lat) {
        // gameData.locationInfo = info;
        // if (lng) {
        //     gameData.location = lat + ',' + lng;
        // }
        // var sendData = {};
        // sendData.location = gameData.location;
        // sendData.locationCN = gameData.locationInfo;
        // network.send(3007, sendData);
    }
});