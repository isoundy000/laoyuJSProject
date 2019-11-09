//支付
var WXA = {
    // t[APP_ID_QUANMINDOUPAI] = "wxb45a03a146f54e45";//需要根据区域替换--微信申请信息
    // t[APP_ID_PENGHUZI] = "wx1f322fc80f8d5e44";//需要根据区域替换--微信申请信息

    // 全民斗牌
    PENGHUZI: 'wx1f322fc80f8d5e44',
    // 全民斗牌
    FYDP: 'wxb45a03a146f54e45'
};
// key
var WXK = {
    // t[APP_ID_QUANMINDOUPAI] = "252419947aaeb4a8dabe9c8cc2453c12";//需要根据区域替换--微信申请信息
    // t[APP_ID_PENGHUZI] = "252419947aaeb4a8dabe9c8cc2453c12";//需要根据区域替换--微信申请信息
    // 全民斗牌
    PENGHUZI: '252419947aaeb4a8dabe9c8cc2453c12',
    // 全民斗牌
    FYDP: '252419947aaeb4a8dabe9c8cc2453c12'
};

var WXS = {
    // t[APP_ID_QUANMINDOUPAI] = ['5b83', '027d', '0cdbd', '14a5', '9986', 'e51d', 'f93', 'cc9a'];
    // t[APP_ID_PENGHUZI] = ['cf10', 'be97', '3460', 'f5952', '23ad88', 'c627c', 'de82'];
    // 全民斗牌
    PENGHUZI: ['cf10', 'be97', '3460', 'f5952', '23ad88', 'c627c', 'de82'],
    // 全民斗牌
    FYDP: ['5b83', '027d', '0cdbd', '14a5', '9986', 'e51d', 'f93', 'cc9a']
};

// 商户
var WXP = {
    // t[APP_ID_QUANMINDOUPAI] = "1480895852";//需要根据区域替换--微信申请信息
    // t[APP_ID_PENGHUZI] = "1480895852";//需要根据区域替换--微信申请信息
    // 全民斗牌
    PENGHUZI: '1480895852',
    // 全民斗牌
    FYDP: '1480895852'
};

/**
 * 数据集合
 */

/**
 * package name 集合
 * @type {Object}
 */
var PN = {
    // 全民斗牌
    PENGHUZI: 'com.gggame.penghuzi',
    // 全民斗牌
    FYDP: 'com.gggame.quanguonn',
    // 逍遥卡五星
    XYKWX: 'com.yygame.xykwx'
};

/**
 * app id 集合
 * @type {Object}
 */
var APP_ID = {
    // 株洲斗牌
    PENGHUZI: 305,
    // 全民斗牌
    FYDP: 306,
    // 逍遥卡五星
    XYKWX: 110
};

/**
 * app名字
 * @type {Object}
 */
var APP_NAME = {
    PENGHUZI: '株洲斗牌',
    FYDP: '全民斗牌',
    XYKWX: '逍遥卡五星'
};

/**
 * app地区
 * @type {Object}
 */
var APP_AREA = {
    PENGHUZI: 'hn',
    FYDP: 'hn',
    XYKWX: 'hbkwx'
};

/**
 * sub热更地址
 * @type {Object}
 */
var APP_SUB_UPDATE_URL = {
    PENGHUZI: 'http://penghuzi.yayayouxi.com/penghuzi/sub/',
    FYDP: 'http://penghuzi.yayayouxi.com/penghuzi/sub/',
    XYKWX: 'http://xykwx.yayayouxi.com/sub/'
};

/**
 * 推荐制区域
 * @type {Object}
 */
var PARENT_AREA = {
    PENGHUZI: 'zhuzhou',
    FYDP: 'niuniu',
    XYKWX: 'hbkwx'
};

/**
 * 端口号
 * @type {Object}
 */
var SK_PORT = {
    PENGHUZI: 8888,
    FYDP: 8889,
    XYKWX: 8890
};

/**
 * 直连地址
 * @type {Object}
 */
var SK_URL = {
    PENGHUZI: 'zhuzhou.yygameapi.com',
    FYDP: 'niuniu.yygameapi.com',
    XYKWX: 'xykwx.yygameapi.com'
};

/**
 * 游戏盾分组
 * @type {Object}
 */
var YXD_GROUP = {
    PENGHUZI: 'zhuzhou1.D9F7SWg2Y5.aliyungf.com',
    FYDP: 'zhuzhou1.D9F7SWg2Y5.aliyungf.com',
    XYKWX: 'zhuzhou1.D9F7SWg2Y5.aliyungf.com'
};

/**
 * 认证path
 * @type {Object}
 */
var AUTH_PATH = {
    PENGHUZI: 'zhuzhouAuth',
    FYDP: 'niuniuAuth',
    XYKWX: 'hbkwxAuth'
};
var NOW_PAGE_STAGE = {
    STAGE_RULE_LAYER: 'page_ruleLayer',
    STAGE_ZHANJI_LAYER: 'page_zhanjiLayer',
    STAGE_SETTING_LAYER: 'page_settingLayer',
    STAGE_CREATE_LAYER: 'page_createLayer',
    STAGE_MATCH_LAYER: 'page_matchLayer',
    STAGE_JOINROOM_LAYER: 'page_joinRmLayer',
    STAGE_CLUB_LAYER: 'page_clubLayer',
    STAGE_CLUBMAIN_LAYER: 'page_clubMainLayer',
}
/**
 * map id 集合
 * @type {object}
 */
var MAP_ID = {
    // 转转麻将
    ZHUANZHUAN: 1,
    // 长沙麻将
    CHANGSHA: 5,
    // 碰胡子
    PHZ: 9,
    // 红中麻将
    HONGZHONG: 22,

    //红中麻将比赛场
    HONGZHONG_MATCH: 20001,
    //卡五星
    KWX: 2,
    //襄阳卡五星
    KWX_XIANGYANG: 50,
    // 斗牛
    DN: 203,
    // 牛牛
    NN: 203,
    // 襄阳跑得快
    XIANGYANG_PDK: 200,
    // 跑得快
    PDK: 200,
    // 比赛场跑得快
    PDK_MATCH: 20200,

    PDK_JBC: 30200,
    // 经典斗地主
    DDZ_JD: 201,
    // 癞子斗地主
    DDZ_LZ: 206,
    // 扎金花
    ZJH: 207,
    //二皮子
    EPZ: 223,
    // 疯狂牛牛
    CRAZYNN: 2004,
    // 九人明牌
    DN_JIU_REN: 4000,
    // 抢庄推注
    DN_AL_TUI: 4001,
    // 无花双十, 疯狂双十
    DN_WUHUA_CRAZY: 4002,
    //长牌绵竹考考
    CP_KAOKAO: 340,
    //长牌四川考考
    CP_SICHUAN: 341,
    //四川跑得快
    SC_PDK: 225,
    //十三水
    PK_13S:245,

    //四川
    SICHUAN_XUEZHAN: 7,
    SICHUAN_XUELIU: 8,
    SICHUAN_DEYANG: 17,
    SICHUAN_SRLF: 74,
    SICHUAN_TRLF: 73,
    SICHUAN_SRSF: 75,
    SICHUAN_DDH: 78,
    SICHUAN_YB: 76,
    SICHUAN_MZ: 79,
    SICHUAN_SF: 80,
    SICHUAN_GH: 81,
    SICHUAN_ZJ: 82,
    SICHUAN_LJ: 83,
    SICHUAN_JY: 84,

    WUHAN_KAIKOU: 4,
    WUHAN_KOUKOU: 6,


    MATCHHALL: 80001,//比赛场大厅
    CLUBHALL: 80002,//俱乐部大厅
};

/**
 * map 名字
 * @type {object}
 */
var MAP_NAME = {
    ZHUANZHUAN: '转转麻将',
    CHANGSHA: '长沙麻将',
    PHZ: '碰胡子',
    HONGZHONG: '红中麻将',
    HONGZHONG_MATCH: '红中麻将',
    KWX_XIANGYANG: '襄阳卡五星',
    KWX: '卡五星',
    //牛牛
    DN: '拼十',
    NN: '拼十',
    DN_JIU_REN: '九人明牌',
    DN_AL_TUI: '抢庄推注',
    DN_WUHUA_CRAZY: '无花双十',

    XIANGYANG_PDK: '襄阳跑得快',
    PDK: '跑得快',
    SC_PDK: '四川跑得快',
    PDK_MATCH: '跑得快比赛场',
    PDK_JBC: '跑得快',
    DDZ_JD: '经典斗地主',
    DDZ_LZ: '癞子斗地主',
    ZJH: '拼三张',
    EPZ: '扯二皮子',
    CRAZYNN: '疯狂拼十',
    DN_JIU_REN: '九人明牌',
    DN_AL_TUI: '抢庄推注',
    SICHUAN_XUEZHAN: '血战到底',
    SICHUAN_XUELIU: '血流成河',
    SICHUAN_MZ: '绵竹玩法',
    SICHUAN_TRLF: '三人两房',
    CP_KAOKAO: '绵竹考考',
    CP_SICHUAN: '四川考考',
    PK_13S : '十三张'

};

/**
 * 地图玩法
 * @type {object}
 */
var MAP_WANFA = {
    // 麻将
    MaJiang: 'majiang',
    //卡五星
    MaJiang_kwx: 'majiang_kwx',
    // 麻将比赛场
    MaJiang_match: 'majiang_match',
    //四川
    MaJiang_sc: 'majiang_sc',
    // 攸县碰胡子
    YouXian: 'youxian',
    // 牛牛(斗牛，拼十)
    DN: 'dn',
    // 跑得快
    PDK: 'pdk',
    PDK_MATCH: 'pdk_match',
    PDK_JBC: 'pdk_jbc',
    SC_PDK: 'scpdk',
    // 拼三张
    ZJH: 'zjh',
    // 斗地主
    DDZ: 'ddz',
    //二皮子
    EPZ: 'epz',
    //考考 长牌
    KAOKAO: 'kaokao',
    //十三水
    PK_13S:'13shui'
};

/**
 * 按mapid得到玩法
 * @type {object}
 */
var MAP_ID_2_WANFA = {
    ZHUANZHUAN: MAP_WANFA.MaJiang,
    CHANGSHA: MAP_WANFA.MaJiang,
    PHZ: MAP_WANFA.YouXian,
    HONGZHONG: MAP_WANFA.MaJiang,
    HONGZHONG_MATCH: MAP_WANFA.MaJiang_match,
    KWX_XIANGYANG: MAP_WANFA.MaJiang_kwx,
    KWX: MAP_WANFA.MaJiang_kwx,
    DN: MAP_WANFA.DN,
    NN: MAP_WANFA.DN,
    XIANGYANG_PDK: MAP_WANFA.PDK,
    PDK: MAP_WANFA.PDK,
    PDK_MATCH: MAP_WANFA.PDK_MATCH,
    PDK_JBC: MAP_WANFA.PDK_JBC,
    DDZ_JD: MAP_WANFA.DDZ,
    DDZ_LZ: MAP_WANFA.DDZ,
    ZJH: MAP_WANFA.ZJH,
    EPZ: MAP_WANFA.EPZ,
    CRAZYNN: MAP_WANFA.DN,
    DN_JIU_REN: MAP_WANFA.DN,
    DN_AL_TUI: MAP_WANFA.DN,
    DN_WUHUA_CRAZY: MAP_WANFA.DN,
    CP_KAOKAO: MAP_WANFA.KAOKAO,
    CP_SICHUAN: MAP_WANFA.KAOKAO,

    //四川
    SICHUAN_XUEZHAN: MAP_WANFA.MaJiang_sc,
    SICHUAN_XUELIU: MAP_WANFA.MaJiang_sc,
    SICHUAN_SRLF: MAP_WANFA.MaJiang_sc,
    SICHUAN_TRLF: MAP_WANFA.MaJiang_sc,
    SICHUAN_SRSF: MAP_WANFA.MaJiang_sc,
    SICHUAN_YB: MAP_WANFA.MaJiang_sc,
    SICHUAN_MZ: MAP_WANFA.MaJiang_sc,
    SC_PDK: MAP_WANFA.SC_PDK,
    PK_13S:MAP_WANFA.PK_13S,

};

/**
 * 主模块
 * @type {Object}
 */
var MAIN_MODULE = {
    FYDP: 'fydp',
    XYKWX: 'xykwx'
};

/**
 * 模块
 * @type {object}
 */
var SUB_MODULE = {
    HOME: 'home',
    MaJiang: 'majiang',
    NN: 'niuniu',
    HuZi: 'huzi',
    PDK: 'pdk',
    PDK_JBC: 'pdk_jbc',
    ZJH: 'psz',
    EPZ: 'epz',
    KAOKAO: 'kaokao',
    PK_13S:"sss",
    PDK_MATCH: 'pdk_match',
    BISAICHANG: 'bisaichang',
    CLUB: 'club',
};

/**
 * mapid需要的模块
 * @type {object}
 */
var MAP_ID_2_SUB = {
    ZHUANZHUAN: SUB_MODULE.MaJiang,
    CHANGSHA: SUB_MODULE.MaJiang,
    PHZ: SUB_MODULE.HuZi,
    KWX_XIANGYANG: SUB_MODULE.MaJiang,
    KWX: SUB_MODULE.MaJiang,
    HONGZHONG: SUB_MODULE.MaJiang,
    HONGZHONG_MATCH: SUB_MODULE.MaJiang,
    DN: SUB_MODULE.NN,
    NN: SUB_MODULE.NN,
    PDK: SUB_MODULE.PDK,
    PDK_MATCH: SUB_MODULE.PDK_MATCH,
    PDK_JBC: SUB_MODULE.PDK_JBC,
    DDZ_JD: SUB_MODULE.PDK,
    DDZ_LZ: SUB_MODULE.PDK,
    ZJH: SUB_MODULE.ZJH,
    EPZ: SUB_MODULE.EPZ,
    CRAZYNN: SUB_MODULE.NN,
    DN_JIU_REN: SUB_MODULE.NN,
    DN_AL_TUI: SUB_MODULE.NN,
    DN_WUHUA_CRAZY: SUB_MODULE.NN,
    CP_KAOKAO: SUB_MODULE.KAOKAO,
    CP_SICHUAN: SUB_MODULE.KAOKAO,

    //四川
    SICHUAN_XUEZHAN: SUB_MODULE.MaJiang,
    SICHUAN_XUELIU: SUB_MODULE.MaJiang,
    SICHUAN_SRLF: SUB_MODULE.MaJiang,
    SICHUAN_TRLF: SUB_MODULE.MaJiang,
    SICHUAN_SRSF: SUB_MODULE.MaJiang,
    SICHUAN_YB: SUB_MODULE.MaJiang,
    SICHUAN_MZ: SUB_MODULE.MaJiang,
    SC_PDK: SUB_MODULE.PDK,
    PK_13S : SUB_MODULE.PK_13S,
};

/**
 * 贷款网址
 * @type {string}
 */
var DAIKUAN_URL = 'http://tuanzidai.cn/frontend_loan_service/common?funid=201&appid=3&channel=120477';

var PAY_QMDPURL = 'http://pay.bangshuiwang.com';
var DOWN_QMDPURL = 'http://pay.bangshuiwang.com/fydp/';

/**
 * 分享地址
 * @type {object}
 */
var SHARE_LINK = {
    // 风云斗牌
    FYDP: [
        // 'https://pay.yayayouxi.com/mochuang/milnk/newOpenApp/index.html?url=https://aidhyd.mlinks.cc/A0Gc?area=niuniu&sign=139497&details=true',
        'https://aidhyd.mlinks.cc/A0Gc',
        'https://pay.bangshuiwang.com/fydp/',
        'http://pay.bangshuiwang.com/mochuang/milnk/newOpenApp/index.html?url=https://aidhyd.mlinks.cc/A0Gc'
    ],
    // 株洲斗牌
    PENGHUZI: ['https://aidhyd.mlinks.cc/Acj4', 'https://www.yayayouxi.com/penghuzi/', 'https://pay.yayayouxi.com/activity-front/openApp/current/index.html?url=https://aidhyd.mlinks.cc/Acj4']
};

/**
 * 公司名
 * @type {object}
 */
var COMPANY_NAME = {
    YY: '丫丫',
    FY: '风云',
    XY: '逍遥'
};

/**
 * 公司名称
 * @type {object}
 */
var APP_COMPANY_NAME = {
    HN: COMPANY_NAME.YY,
    PENGHUZI: COMPANY_NAME.YY,
    FYDP: COMPANY_NAME.FY
};

/**
 * 语音地址
 * @type {object}
 */
var ALOV = {
    PENGHUZI: ['mj-hn-sound', 'http://mj-hn-sound.oss-cn-hangzhou.aliyuncs.com', 'IhWyMYkOv0w6yn2P', ['KqQ', 'sUD', 'lMJ', 'W3x', 'nDj', 'Eg5', '5nq', 'ZaL', 'IV5', 'Uta']],
    FYDP: ['game-general', 'http://game-general.oss-cn-hangzhou.aliyuncs.com', 'IhWyMYkOv0w6yn2P', ['KqQ', 'sUD', 'lMJ', 'W3x', 'nDj', 'Eg5', '5nq', 'ZaL', 'IV5', 'Uta'], 'fydp-sound/']
};

var gameData = {

    // 微信是否安装
    isWXAppInstalled: null,
    // 闲聊是否安装
    isXianLiaoAppInstalled: null,
    // 聊呗是否安装
    isLBAppInstalled: null,

    lotteryNum: 1,
    // app id
    appId: APP_ID.FYDP,
    // app名字
    appName: APP_NAME.FYDP,
    // 时间戳
    timestamp: 0,
    // 公司名称
    companyName: COMPANY_NAME.FY,
    // 分享地址  新版魔窗  https://pay.yayayouxi.com/mochuang/milnk/newOpenApp/index.html?url=https://aidhyd.mlinks.cc/A0C6?roomid=257531&area=niuniu&sign=139497&details=true
    shareUrl: SHARE_LINK.FYDP[0],
    shareUrl_mlink: SHARE_LINK.FYDP[0],
    // 语音地址
    alov: ALOV.FYDP,
    // 地区
    area: APP_AREA.FYDP,
    // 推荐制区域
    parent_area: PARENT_AREA.FYDP,
    // 热更地址（sub）
    updateSubUrl: APP_SUB_UPDATE_URL.FYDP,
    // 端口号
    port: SK_PORT.FYDP,
    // 直连地址
    gameUrl: SK_URL.FYDP,
    // 认证path
    authPath: AUTH_PATH.FYDP,
    // 游戏盾分组
    yxdGroup: YXD_GROUP.FYDP,
    // 主模块
    mainModule: MAIN_MODULE.FYDP,

    //支付
    // WXA WXK WXS
    WXAvalue: WXA.FYDP,
    WXKvalue: WXK.FYDP,
    WXSvalue: WXS.FYDP,
    WXPvalue: WXP.FYDP,

    loginType: null,
    hasLogined: null,
    clientId: null,
    nickname: null,
    sex: null,
    province: null,
    city: null,
    country: null,
    headimgurl: null,
    privilege: null,
    unionid: null,
    numOfCards: null,
    isNew: null,
    weixin: null,
    weixin2: null,
    triggers: null,
    ip: '',
    cardnum: 0,
    coinnum: 0,
    diamondnum: 0,
    // 代理id
    parent_id: null,
    roomId: null,
    returnRoomId: null,
    ownerUid: null,
    _players: null,
    playerMap: null,
    last3002: null,

    isWXAppInstalled: null

    , isXianLiaoAppInstalled: null
    , isLBAppInstalled: null

    , lotteryNum: 1
    , gonggaoNum: 1
    , pluginNum: 1
    , appId: APP_ID.FYDP

    , clickClubRoomTime: 0

    , mapIdMap: {1: true, 5: true}
    , timestamp: 0
    , matchId: null
    , isNoticeMatch: null
    , jbcData: null,

    /**
     * 初始化
     */
    init: function () {
        if (!window.packageName) {
            return;
        }
        var pnKey = findKey(PN, window.packageName);
        if (!pnKey) {
            return;
        }
        this.appId = APP_ID[pnKey];
        var idKey = findKey(APP_ID, this.appId);
        if (!idKey) {
            return;
        }
        this.appName = APP_NAME[idKey];
        this.area = APP_AREA[idKey];
        this.parent_area = PARENT_AREA[idKey];
        this.companyName = APP_COMPANY_NAME[idKey];
        this.updateSubUrl = APP_SUB_UPDATE_URL[idKey];
        this.port = SK_PORT[idKey];
        this.gameUrl = SK_URL[idKey];
        this.yxdGroup = YXD_GROUP[idKey];
        this.authPath = AUTH_PATH[idKey];
    },
    /**
     * 初始化mwlink
     * @param {Number} link
     * @public
     */
    initMwLink: function (link) {
        link = link || 0;
        var key = findKey(APP_ID, this.appId);
        if (key) {
            this.shareUrl = SHARE_LINK[key][link];
        }
    },
    /**
     * 通过mapid取名字
     * @param mapId
     * @public
     */
    mapId2Name: function (mapId) {
        var key = findKey(MAP_ID, mapId);
        if (key) {
            return MAP_NAME[key];
        }
        return this.appName;
    },
    /**
     * 从uid取玩家信息
     * @param {number} uid
     * @returns {object} 信息
     * @public
     */
    getPlayerInfoByUid: function (uid) {
        if (gameData.players && gameData.players.length > 0) {
            for (var i = 0; i < gameData.players.length; i++)
                if (gameData.players[i].uid == uid)
                    return gameData.players[i];
        }
        return null;
    }
};

gameData.zongJieSuanHuodong = function (parent_area, RoomID, EndTime, currentRound) {
    // //红包活动
    if (!window.inReview && currentRound > 1 && gameData.newyear && !gameData.isSelfWatching) {
        var timemiao = Date.parse(new Date(EndTime)) / 1000;
        activityRedRain(timemiao, 'niuniu');
    }
    if (!window.inReview && gameData.opt_conf.LaborDay > 0 && !gameData.isSelfWatching) {
        activity51Box(parent_area, RoomID);
    }
    if (!window.inReview && gameData.opt_conf.liuyi > 0 && !gameData.isSelfWatching) {
        zhuanzhuanle(parent_area, RoomID);
    }
};
gameData.getUserInfo = function (uid) {
    for (var i = 0; i < gameData.players.length; i++) {
        if (gameData.players[i].uid == uid) {
            return gameData.players[i];
        }
    }
    return null;
};

gameData.__defineGetter__('players', function () {
    return this._players;
});

gameData.__defineSetter__('players', function (players) {
    // if (mRoom.wanfatype == mRoom.YOUXIAN) {
    //     return;
    // }
    this._players = players;
    this.playerMap = {};
    if (players && players.length > 0) {
        var i = 0;
        // todo 修改成通用的
        switch (gameData.mapId) {
            case MAP_ID.DN:
            case MAP_ID.NN:
            case MAP_ID.CRAZYNN:
            case MAP_ID.DN_AL_TUI:
            case MAP_ID.DN_JIU_REN:
            case MAP_ID.DN_WUHUA_CRAZY:
            case MAP_ID.PHZ:
            case MAP_ID.PK_13S:
                for (i = 0; i < this._players.length; i++) {
                    this._players[i].uid = this._players[i].User.ID;
                    this._players[i].nickname = this._players[i].User.NickName;
                    this._players[i].sex = (this._players[i].User.Sex || 1);
                    this._players[i].headimgurl = decodeURIComponent(this._players[i].User.HeadIMGURL);
                    this._players[i].ip = this._players[i].User.IP;
                    this._players[i].score = 0;
                    this._players[i].ready = false;
                    if (_.isNumber(this._players[i].Score))
                        this._players[i].score = this._players[i].Score;
                    if (_.isNumber(this._players[i].User.Score))
                        this._players[i].score = this._players[i].User.Score;
                    this.playerMap[this._players[i].uid] = this._players[i];
                }
                break;
            case MAP_ID.CP_KAOKAO:
                for (i = 0; i < this._players.length; i++) {
                    this._players[i].uid = this._players[i].ID;
                    this._players[i].nickname = this._players[i].NickName;
                    this._players[i].sex = (this._players[i].Sex || 1);
                    this._players[i].headimgurl = decodeURIComponent(this._players[i].HeadIMGURL);
                    this._players[i].ip = this._players[i].IP;
                    this._players[i].loc = this._players[i].Location;
                }
                break;
            default:
                for (i = 0; i < this._players.length; i++) {
                    this._players[i].nickname = decodeURIComponent(this._players[i].nickname);
                    this._players[i].sex = (this._players[i].sex || 1);
                    if (this._players[i] && this._players[i].uid) {
                        this.playerMap[this._players[i].uid] = this._players[i];
                    }
                }
                break;
        }
    }
});

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var hosts = [
    'RDHFFSVQpSaH5RYLFFSQm4ePgq+ss4yzdmQmoBAI+I4=',
    '7anGdz+XXxTok+hETUH9moKD/k6ayzy4a7RO6pQ/MF0=',
    'BGuOtWaoxFmK6wnK3aka5kB+oBuf5pGHzgOBze+jO5g=',
    'Ee9DSxeaL+YXnloHofG2ol7bM5AN/kppHcroma36EhM=',
    'hBr3GIsi4RoARtK8eQToxd2G1ULR8BRQqPjoz7TPbqc=',
    'FPokDShy0RqQtvxsiHgNjxDZFJk1mpLGiJQg3rx9jSI=',
    'IFJbev8pUFuowFOUtrcopbqRY6m5DYU3yJKeiE6bZqE=',
    'zJ8t8me7vPxHSp57Gul9cAhb78X66Z1R60UY0nm7V1k=',
    '8z9vD3lbd9MWViDzstJ5UZmYfINYwm7EjY5Oi8TlCnw=',
    'gytQ1Eif9XQFjWQ1CzCGafsyEhV9ajU7Ryu4RvHsNRc=',
    'pGmik0Mq+cFyJz6r3Z5Bf+kl+4plYg9y7pzyVI7/iP0=',
    '7C9/thFrJiLvpQ4cIIYkXOskrtkOUlKja3bkZhasW9A=',
    'P+CFBun2yXVleF3XfkEpOhBHrdjhgvdJGkxmE/Bv7No=',
    'LZz6v3Pv3if5dE1P7uLYez+aicxI+LTfQrrTojU6KiI=',
    'FbTijSR+3053+njVCebuay3X002UD40YvJhfkqTQkyQ=',
    'PW3DvjgFw09CZAQETcSn1fFbA9cTdwWHNCofbEH1P0I=',
    'U7iMy58GFThk/szouIJYPXo/8O+LnPEVd0Xzn1YJSXI=',
    'dHR7fSM0YrND7BGOaOrtHof6heUi7byfCVDUUq5LxEM=',
    'hBLxyO9ejZPZkSx2bKRRXzw2YKj8X1wiI1pOlgrx9z4=',
    'Wg0TqdKFcdcyzxmnHa5CNS0oBLTR4Rb7ZjfrT3IyjwA=',
    '9RlPCd0Fvi0ESSvdWgjs28HI3wKZloYrsWlCGntnz3Y=',
    'WZ8I3U1azC7H0hid9JcHbqkMlTJQIaI5RJymfq8o+AY=',
    'vS8v4r23IzLDsu/51YewydZiwsVw7QREfo4hapFabME=',
    'eGAg0sWncGXQOmFP8Ed+7OPXxFsMU7AVTX0Ze6c+7pM=',
    'kYZaBaRKHePpNlQ7btQNu11m0xcpqHf8xubxc5mof8c=',
    'iIJkLFJvUlHVBAl19O6rN1idYC2zrjRy4USraPE4Hc0=',
    'XfLStkShD1H7IxlaTSBYZXBKljh8xUSPzM3fg3t0oq0=',
    'bOlghCmf8XJA9f2kTN9GMNCAFP3lv1TGAWFH5HBIFKE=',
    'OVRXOXNlefcwWqL6z0a8dTonkVtMJbs/dJzMWeAtuHk=',
    'RZu/PXQ3rACuYRUPjoqWTgXrvCVDOzxAFWxzvs9blg4=',
    'H+aXtvDef7RqfIboDCfARpBPPyyUerSHWKXR/nSkLTI=',
    'ki7A7s+VliE6glrSQahgU3TWv9NmqcOSBcg/6tuS2R0=',
    'sE0bCzCpLIWFNFfc7wRBQLRtD/Jso5tmoC+zhOLYcNg=',
    'Ljk36ayzLspwIC3I+LwIOvr441ub60LME7JMnXrcI4M=',
    'lK3h7PivluhmyYO1kRqplMwEdkkbeXDigMLicNkrP9k=',
    'VGPbm1/WbWivThprPUpj8D4hSQNyL8pffERjWT5Ooms=',
    '0RDtLCDt+spDAeZXUaDnNaktkkpCs/xx8QTpHrkCkOo=',
    '36N9AdCdptt5RqVRlPHan1rvooEkryLBdOryuP9UZEA=',
    'ZwBMAN+fiz507YtDlBFwNECarvD7QuZ4BmgMXZyRfNg=',
    'IlE+V8GYQYgKwKaB36h72t+t6pj00wQ72B9XVOSzIRE=',
    '1cR0dQ/9CpWR7itJ+6lualhuy/Ed86x23nXRaowP+ds=',
    'HOIs4Ns/YivFzzgg0SRRJs3HfGyJNS6eK71PVVi+pgM=',
    'zZn8qd0QuD3bck/8UlQ+d8/AwbgyoHwcFc9y0YdT8dU=',
    'r0gHHOxsrqSFDbDROnca2wmObudAkh98VU4WIEESA8E=',
    'nNw3Z6B3y0i5334IdIX1v6M8MIV2othwVgPH1c4aZsU=',
    'wP0Km4qDREfVFU0dduHg+GAO9zSQjXwYY9WccZRJBf8=',
    '6UM89CVNVm0Tpez31KzwjYwZ3E1upcjXfDJ/nn66uHk=',
    'qZGa26hG0knEdX/E8jajmxeSVUSfGiliO06WCxzVHAo=',
    'D0eKHtVVeOSBZOTF7+P9kHsoRhKlhly4WFEhMEXapf0=',
    'IMvzj5CStoNlzZ3CKJMyUe0xazgKoO34IT3Vx/mO+WI='
];
var aliyunyxdList2 = [
    'XpXv+upgNVR7+3CDwB5N3XrMh37QBSdNpxUoc7v+OopP5imnH9YVta+K0i1r/MZo',
    'xw/cUQXlzv/SORHe9TIUvggfeKLToVM9OiEAOcf3HhakDrh9yclDsO3RDeDM0KXM',
    'rCojYIX0O8DNoP47cNkp3eUvY4Z8920cIWGY0lNxwRcVFvbFgxEeeeT/Fx01tLus',
    'v8LNDK4n6ImhgXjjH7uqKTSScdR1hnttJBLFxMTpBhwSHUzd2mpKwIi5Pv5Mvo4H',
    'Bj8Oo/SPtkguSDiDYjdpcAck9o4XDpMculyr/bCZ7PbZmMEO5TvuyJOALKgJbke+',
    'RKpTHoh7qt/N3E2bfMaBzGQTXewTeLE1UHv7HKsgLwIvc6Yfle1kJjNb6sSXatBV',
    '9RRpRmL6v4wtr7vx4t5HlKLvrq0qMrJvXty4c/mI83/etJO/2grvuTmAcKldysWo',
    'iOqr+B5jICX74JCeIRI80NxUG3LoXLQ+AgIWADholLfpXiESCdsZKgegKwTnD0px',
    'hsPRkqu1y8Ih4uRCZmrtCu5gowBE7Z+LHk5fF9HkhZpYqPLqJv4n8Xb56I/I4wWA',
    'UtYfB3cdpo5VVOFwjTpCT/TAR8rEWBy/A3Oxfc1kl+imMLvz/v5t+Nyb4tV+pcIL',
    '7PY+cdZkUwPfhkuD50OOcFnUEZKu9fDYJLANyAu4c7GLNWx7pwGLshjOfVKy3uc3',
    'u6oNYHHyXaLyHVG0PrEpQjNjoOMITpmJLonuB8zXzXd9PT+OPaVfkPa1Ue+WeT+w',
    '1rv0df/rl1wrifqeeQyoEivpZgeNEtCAdbKhO37Twjpf26jHJoIAmyVnOFbbWQIQ',
    'bXmZMXN7kGx1GG3RB45yosKBlpgThI7M50K7NVXeIWwmAIhlhfuTpkiLZVkuy3+x',
    'aFUsHm7kZbJ8G5p8hlio9LZNGOwFXAv107IKTc0dDi1xV/QYeggYo/8DOFmRXfox',
    'Rn6XjQINFhvb6DKyCnRq5759CfvHmIsmbiYxxDjq998tKzBUay2XuNNSDlgTxciZ',
    'zsoWkiR4ob+J8SezeA/8/rhTzVySxOEAhFEXgafQVxZ7AO2LeKQBZ62C0lLYfCQ9',
    '/wr+KKag7HRZEK61XW7bljEa/U1LjbpVXq1c7dHyB++s3SjzA/0+7nUvjAkrGHE8',
    'wCqqzOTGn+WurKKEVV3Tf2BI9ztSLy0gL+NXfBbuOtnKAt3yxXp1xLnu2gNykIKQ',
    'g7Ty5Eszkubf68qoeTwDM+cxPAAevF+eWS/FOvS90CG0G0uWevzt7TE5F1HVod7Z'
];
/**
 * 获得服务器地址
 */
var getIpList = (function () {
    return function (udid) {
        udid = udid || '0';

        var ipList = [];
        var first = 'zhuzhou1.D9F7SWg2Y5.aliyungf.com';
        var third = 'niuniu.yygameapi.com';

        //second
        var playero = (cc.sys.localStorage.getItem('playero') || '0');
        if (playero != '0') {
            playero = Math.floor((playero / 86400)) % aliyunyxdList2.length;
        }
        var second = getDAes(aliyunyxdList2[playero]);

        if (window.inReview || !cc.sys.isNative) {
            ipList.push(first);
        }
        else {
            ipList.push('yxd:' + first);
            ipList.push('yxd:' + second);
            ipList.push(third);
        }

        return ipList;
    };
})();

var getCurTimestampM = function () {
    return Math.round((new Date()).getTime());
};
var getIpList2 = (function () {
    return function () {
        var ipList = cc.sys.localStorage.getItem('ipList');
        try {
            ipList = JSON.parse(ipList)['ipList'];
        } catch (e) {

        }
        if (ipList != undefined && ipList.length >= 1) {
            for (var i = 0; i < ipList.length; i++) {
                cc.log('getIpList2==ipLists i:' + i + '  IP:' + ipList[i]);
            }
            return ipList;
        } else {
            ipList = [];
        }

        var first = 'zhuzhou1.D9F7SWg2Y5.aliyungf.com';
        var third = 'niuniu.yygameapi.com';
        //second
        var playero = '0';
        var second = getDAes(aliyunyxdList2[playero]);

        if (window.inReview || !cc.sys.isNative) {
            ipList.push(first);
        }
        else {
            ipList.push('yxd:' + first);
            ipList.push('yxd:' + second);
            ipList.push(third);
        }

        for (var i = 0; i < ipList.length; i++) {
            cc.log('getIpList2new==ipLists i:' + i + '  IP:' + ipList[i]);
        }
        return ipList;
    };
})();

var saveIpLists = function (ipLists) {
    if (ipLists == undefined || ipLists.length == 0) {
        return;
    }
    var saveIpLists = [];
    for (var i in ipLists) {
        try {
            saveIpLists.push(getDAes(ipLists[i]));
        } catch (e) {
            cc.log('IP 地址保存失败');
        }
    }
    for (var i = 0; i < saveIpLists.length; i++) {
        cc.log('saveIpLists==save IP i:' + i + '  IP:' + saveIpLists[i]);
    }
    cc.sys.localStorage.setItem('ipList', JSON.stringify({'ipList': saveIpLists}));
    return saveIpLists;

};

if (window.inReview) {
    gameData.updateSubUrl = 'http://penghuzi.yayayouxi.com/ttqmdp/sub/';
}

/**
 * 注册Sdk版本号
 * @type {String}
 * */
var registerSdkVersion = '3.1.0';