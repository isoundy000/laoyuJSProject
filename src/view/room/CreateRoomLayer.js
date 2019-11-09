/**
 * 创建房间
 */
(function (exports) {

    /**
     * 控件切分
     * @type {function}
     */
    var $ = null;

    // ----------- 数组位含义 ------------
    /**
     * 名称
     * @type {number}
     */
    var IDX_DESP = 0;

    /**
     * 值
     * @type {number}
     */
    var IDX_VALUE = 1;

    /**
     * x位置
     * @type {number}
     */
    var IDX_POSX = 2;

    /**
     * y位置
     * @type {number}
     */
    var IDX_POSY = 3;

    /**
     * 默认选不选中
     * @type {number}
     */
    var IDX_DEF_VAL = 4;

    /**
     * 能不能不选中
     * @type {number}
     */
    var IDX_UNDESELECTABLE = 5;

    /**
     * 置灰
     * @type {number}
     */
    var IDX_DISABLE = 6;

    /**
     * 排斥
     * @type {number}
     */
    var IDX_MUTEX_FIELD = 7;

    /**
     * 依赖关系
     * @type {number}
     */
    var IDX_DEP_NAME = 8;

    /**
     * 介绍文本
     * @type {number}
     */
    var IDX_HINT = 9;
    /**
     * 一个空间针对不同mapid 显示的不同位置
     * @type {number}
     */
    var IDX_POSWITHMAP = 10;

    // ----------------------------------

    /**
     * sub ccs 路径
     * @type {string}
     */
    var CCS_SUB_PATH = 'res/submodules/';

    /**
     * tablist ccs 名字
     * @type {string}
     */
    var CCS_TAB_LIST_NAME = '/ccs/CreateTabList.json';

    /**
     * 玩法 ccs 名字
     * @type {string}
     */
    var CCS_WANFA_NAME = '/ccs/CreateWanfa.json';

    /**
     * 牛牛和胡子需要的特殊参数
     * @type {object}
     */
    var EXTRA_DESP_MAP = {
        mapid: 'name',
        ZhuangMode: 'zhuang_gz',
        Chipin: 'basescore',
        AA: 'room_gz',
        Tuizhu: 'gaoji',
        ChipInType: 'gaoji'
    };

    /**
     * 需要加入special_gz的列表
     * @type {Array}
     */
    var SPECIAL_GZ_MAP = [
        'Wuhuaniu',
        'Zhadan',
        'Wuxiaoniu',
        'Preview',
        'Shunzi',
        'Hulu',
        'Tonghua'
    ];

    //混合牌桌
    var hunzhuoRenshuConfig = {
        'btn_7': {'hide': ['liangrenwan', 'sanrenwan', 'siren']},//转转
        'btn_8': {'hide': ['sanrenwan_cs', 'siren_cs']},//长沙
        'btn_9': {'hide': ['sanrenwan_cs', 'siren_cs']},//红中
        'btn_17': {'hide': ['sanrenwan_mz', 'liangrenwan_mz', 'yifandiaopao']},//绵竹
        'btn_18': {'hide': ['liangrenwan_srlf']},//三人两房
        'btn_10': {'hide': ['sanrenwan_pdk', 'liangren_pdk']}//跑得快
    };
    var hunzhuoSubConfig = {
        'majiang': [
            ['wanjiarenshu0', [['2人', 'liangrenwan', 800, 195, false, false, false, null, ['mapid_0']]]],
            ['wanjiarenshu1', [['3人', 'sanrenwan', 640, 195, false, false, false, null, ['mapid_0']]]],
            ['wanjiarenshu2', [['4人', 'siren', 480, 195, false, false, false, null, ['mapid_0']]]],
            ['wanjiarenshu1_cs', [['3人', 'sanrenwan', 640, 195, false, false, false, null, ['mapid_1', 'mapid_2']]]],
            ['wanjiarenshu2_cs', [['4人', 'siren', 480, 195, false, false, false, null, ['mapid_1', 'mapid_2']]]],
            //绵竹
            ['wanjiarenshu0_mz', [['2人', 'liangrenwan', 720, 415, false, false, false, null, ['mapid_5']]]],
            ['wanjiarenshu1_mz', [['3人', 'sanrenwan', 720, 348, false, false, false, null, ['mapid_5']]]],
            ['wanjiarenshu2_mz', [['4人', 'siren', 720, 281, false, false, false, null, ['mapid_5']]]],
            ['yifandiaopaolr', [['平胡可接炮', true, 960, 415, false, false, false, null, ['mapid_5']]]],
            ['yifandiaopaosr', [['平胡可接炮', true, 960, 348, false, false, false, null, ['mapid_5']]]],
            //三人两房
            ['wanjiarenshu0_srlf', [['2人', 'liangrenwan', 485, 170, false, false, false, null, ['mapid_6']]]],
            ['wanjiarenshu1_srlf', [['3人', 'sanrenwan', 760, 170, false, false, false, null, ['mapid_6']]]],
        ],
        'pdk': [
            //跑得快
            ['wanjiarenshu0_pdk', [['2人', 'liangren', 480, 470, false, false, false, null, ['mapid_0']]]],
            ['wanjiarenshu1_pdk', [['3人', 'sanrenwan', 720, 470, false, false, false, null, ['mapid_0']]]],
        ]
    };
    exports.CreateRoomLayer = cc.Layer.extend({

        // 当前的模块
        sub: null,
        // 当前的选项
        curSelectedTab: null,
        // ccs文件
        ccsFile: null,
        // tablist文件
        tabCcsFile: null,
        // tablist文件
        wanfaCcsFile: null,
        // tab数据
        tabData: null,
        // wanfa数据
        wanfaData: null,
        // 房卡数据
        fangkaData: null,
        // 是否是代开
        isDaikai: null,
        // 是否是设置玩法
        isSetWanfa: false,
        // 俱乐部id
        clubId: null,
        // tab list
        tabList: [],
        // checkbox list,
        cbList: {},
        // 房卡列表
        fangkaTextList: [],
        /**
         * 构造函数
         * @param {string} sub 对应子模块
         * @param {bool} isDaikai 是否为代开
         * @param {number} club_id 俱乐部id
         * @param isSetWanfa 是否设置玩法
         */
        ctor: function (sub, isDaikai, club_id, isSetWanfa, setwanfapos) {
            this._super();
            if (!sub) {
                cc.error('模块为空');
                return;
            }
            this.sub = sub;
            this.setwanfapos = setwanfapos;
            this.isDaikai = isDaikai;
            this.clubId = club_id;
            this.isSetWanfa = isSetWanfa;
            this.tabData = window[sub + '_create_room_tabData'];
            this.wanfaData = _.clone(window[sub + '_create_room_wanFaData']);
            this.fangkaData = window[sub + '_fangka'];
            this.fangkaTextList = [];
            this.tabList = [];
            this.cbList = {};

            //混合牌桌
            var wanfaAddData = hunzhuoSubConfig[sub];
            if (this.clubId && (this.setwanfapos && this.setwanfapos != 5) && wanfaAddData && wanfaAddData.length > 0) {
                for (var i = 0; i < wanfaAddData.length; i++) {
                    this.wanfaData.push(wanfaAddData[i]);
                }
            }

            if (!this.tabData) {
                console.log('create room tab data is null!');
                return;
            }
            if (!this.wanfaData) {
                console.log('create room wanfa data is null!');
                return;
            }
            //特殊玩法修改玩法数据
            this.updateWanfaCfg()
            this.curSelectedTab = cc.sys.localStorage.getItem('create_room_tab_' + sub);
            switch (sub) {
                case 'pdk':
                    this.curSelectedTab = 'btn_10';
                    break;
                case 'psz':
                    this.curSelectedTab = 'btn_11';
                    break;
                case 'majiang':
                    this.curSelectedTab = 'btn_7';
                    break;
                case 'kaokao':
                    this.curSelectedTab = 'btn_19';
                    break;
                case 'epz':
                    this.curSelectedTab = 'btn_21';
                    break;
                case 'sss':
                    this.curSelectedTab = 'btn_23';
                    break;
                default:
                    this.curSelectedTab = 'btn_1';
                    break;
            }
            this.ccsFile = resJson.CreateRoom_json;
            this.tabCcsFile = CCS_SUB_PATH + sub + CCS_TAB_LIST_NAME;
            this.wanfaCcsFile = CCS_SUB_PATH + sub + CCS_WANFA_NAME;
            cc.loader.load([this.ccsFile, this.tabCcsFile, this.wanfaCcsFile], this.initUI.bind(this));
            return true;
        },
        updateWanfaCfg: function () {
            this.update13ShuiCfg();
        },
        update13ShuiCfg: function () {
            var mapai = cc.sys.localStorage.getItem('sss_create_room_mapai');
            if (mapai && window.MAPAI_13SHUI_IDX!==undefined&& window.MAPAI_13SHUI_IDX!==-1) {
                //sss_create_room_wanFaData
                var saveJson = JSON.parse(cc.sys.localStorage.getItem('create_room_cblist_' + this.sub) || '{}');
                if(saveJson.mapai_0 && saveJson.mapai_0.selected){
                    this.wanfaData[window.MAPAI_13SHUI_IDX][1][0][0] = "马牌:" + sssRule._toChinese([mapai])
                    this.wanfaData[window.MAPAI_13SHUI_IDX][1][0][1] = mapai
                    this.wanfaData[window.MAPAI_13SHUI_IDX][1][0][4] = true
                    console.log(this.wanfaData);
                }
            }
        },
        /**
         * 初始化界面
         */
        initUI: function () {
            var scene = loadNodeCCS(this.ccsFile, this);
            if (!scene || !scene.node) {
                console.log('load create room ccs error !!!');
                return;
            }
            // addModalLayer(scene.node);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName('Layer'));
            if (this.isSetWanfa && this.setwanfapos != 5) {
                $('btn_create').setTexture('res/image/ui/room2/btn_setwanfa.png');
            }
            this.addTabList();
            this.addWanfa();
            this.initWanfa();
            this.loadSelected();
            this.initTouch();
            this.changeTab(this.curSelectedTab);

            //创建房间时显示房间类型
            var bgpanel = getUI(scene.node, 'bg_panel');
            var sptitle = getUI(bgpanel, 'room_createroom_5');
            var _title = 'res/image/ui/room2/title_' + this.sub + '.png';
            sptitle.setTexture(_title);

            //创建房间按钮 播放动画效果
            if (cc.sys.isNative) {
                var btn_create = getUI(scene.node, 'btn_create');
                var _anim = btn_create.getChildByName('anim_btn');
                if (this.clubId) {
                    if (_anim) {
                        _anim.setVisible(false);
                    }
                } else if (!_anim) {
                    _anim = sp.SkeletonAnimation(res.croom_json, res.croom_atlas);
                    _anim.setPosition(cc.p(135, 63));
                    _anim.addAnimation(0, 'quanguobao1', true);
                    btn_create.addChild(_anim);
                }
            }
        },

        /**
         * 添加tab list
         */
        addTabList: function () {
            var tabcss = ccs.load(this.tabCcsFile, 'res/');
            if (!tabcss || !tabcss.node) {
                console.log('load create room tab list ccs error !!!');
                return;
            }
            $('tab_list').addChild(tabcss.node);
            this.tabList = tabcss.node.getChildByName('tabList').getChildren();
            for (var i = 0; i < this.tabList.length; i++) {
                var tab = this.tabList[i];
                TouchUtils.setOnclickListener(tab, this.clickTab.bind(this), {
                    effect: TouchUtils.effects.SEPIA,
                    swallowTouches: false
                });
            }
            this.initXianMian();
        },

        /**
         * 初始化限免
         */
        initXianMian: function () {
            if (!gameData.map_conf) {
                return;
            }
            for (var id in gameData.map_conf) {
                if (gameData.map_conf.hasOwnProperty(id)) {
                    var tab = null;
                    // 寻找对应的tab
                    for (var i = 0; i < this.tabList.length; i++) {
                        var name = this.tabList[i].getName();
                        var ids = name.split('_');
                        if (ids && ids.length > 1 && ids[1] == id) {
                            tab = this.tabList[i];
                            break;
                        }
                    }
                    if (!tab) {
                        continue;
                    }
                    var xm = gameData.map_conf[id];
                    // 0正常  1免费 -1不显示
                    switch (xm) {
                        case 1:
                            tab.setVisible(true);
                            tab.getChildByName('xm').setVisible(true);
                            break;
                        case -1:
                            tab.setVisible(false);
                            break;
                        case 0:
                        default:
                            tab.setVisible(true);
                            tab.getChildByName('xm').setVisible(false);
                            break;
                    }
                }
            }
        },

        /**
         * 添加玩法
         */
        addWanfa: function () {
            var that = this;
            var wfcss = ccs.load(this.wanfaCcsFile, 'res/');
            if (!wfcss || !wfcss.node) {
                console.log('load create room tab list ccs error !!!');
                return;
            }
            wfcss.node.setPositionY(wfcss.node.getPositionY() + 15);
            $('wanfa_node').addChild(wfcss.node);
            var data = this.wanfaData;
            this.cbList = {};
            var baseCheckbox = $('wanfa_node.cb');
            for (var k = 0; k < data.length; k++) {
                var catName = data[k][0];
                var optArr = data[k][1];
                //俱乐部创建  房主支付 改为 群主支付
                if (this.clubId && catName == 'AA') {
                    for (var s = 0; s < optArr.length; s++) {
                        if (optArr[s][0] == '房主支付') {
                            optArr[s][0] = '群主支付';
                            break;
                        }
                    }
                }
                for (var i = 0; i < optArr.length; i++) {
                    // 配置数据
                    var opt = optArr[i];
                    // 拷贝checkbox
                    var node = duplicateLayout(baseCheckbox);
                    baseCheckbox.getParent().addChild(node);
                    // 命名
                    var name = catName + '_' + i;
                    node.setName(name);
                    // 设置坐标
                    node.setPosition(cc.p(opt[IDX_POSX], opt[IDX_POSY] + 15));
                    // 设置单选复选框
                    this.changeCheckBox(node, opt[IDX_MUTEX_FIELD] || opt[IDX_UNDESELECTABLE]);
                    // 取得checkbox
                    var checkbox = node.getChildByName('checkBox');
                    // 取得text
                    var text = node.getChildByName('text');
                    // 设置文本
                    text.setString(decodeURIComponent(opt[IDX_DESP]));
                    // 设置hint
                    var hint = node.getChildByName('hint');
                    var hinttext = opt[IDX_HINT];
                    (function (_hinttext) {
                        if (_.isString(_hinttext)) {
                            hint.setPositionX(text.getContentSize().width + 60);
                            // hint.setVisible(true);
                            // text.setColor(cc.Color(21,161,31));
                            TouchUtils.setListeners(hint, {
                                onTouchBegan: function (node, touch, event) {
                                    if (that.getChildByName('PopTishiLayer')) {
                                        return;
                                    }
                                    var scene = ccs.load(res.PopTishiLayer_json, 'res/');
                                    scene.node.setName('PopTishiLayer');
                                    scene.node.setPositionX(300);
                                    that.addChild(scene.node);
                                    var panel = $('root.panel', scene.node);
                                    var content = new ccui.Text();
                                    content.setFontSize(35);
                                    content.setTextColor(cc.color(253, 244, 170));
                                    content.setString(_hinttext);
                                    panel.addChild(content, 2);
                                    panel.setContentSize(cc.size(content.getContentSize().width + 200,
                                        content.getContentSize().height + 100));
                                    content.setPosition(cc.p(panel.getContentSize().width / 2,
                                        panel.getContentSize().height / 2));
                                    var pos = hint.convertToWorldSpace(cc.p(0, 0));
                                    panel.setPosition(cc.p(pos.x, pos.y));
                                }
                                , onTouchMoveOut: function (node, touch, event) {
                                    if (that.getChildByName('PopTishiLayer')) {
                                        that.getChildByName('PopTishiLayer').removeFromParent();
                                    }
                                }
                                , onTouchEnded: function (node, touch, event) {
                                    if (that.getChildByName('PopTishiLayer')) {
                                        that.getChildByName('PopTishiLayer').removeFromParent();
                                    }
                                }
                            });
                        } else {
                            hint.setVisible(false);
                            // text.setColor(cc.Color(175,133,108));
                        }
                    })(hinttext);
                    // 以 '_' 开头的控件是纯文本，隐藏checkBox
                    var noTextTouch = catName.charAt(0) == '_';
                    // 下拉列表
                    var isPopup = _.last(catName.split('_')) == 'popup';
                    if (isPopup) {
                        this.createPopup(node);
                    }
                    // var popup = node.getChildByName('popup');
                    // popup.setVisible(isPopup);
                    // 保存列表(name如果相同会发生覆盖)
                    this.cbList[name] = node;
                    // 设置数据
                    var userdata = {
                        desp: opt[IDX_DESP],
                        key: catName,
                        val: opt[IDX_VALUE],
                        state: !!opt[IDX_DEF_VAL],
                        undeselectable: !!opt[IDX_UNDESELECTABLE],
                        mutexField: opt[IDX_MUTEX_FIELD],
                        depName: opt[IDX_DEP_NAME],
                        isPopup: isPopup,
                        posMapArr: opt[IDX_POSWITHMAP]
                    };
                    node.setUserData(userdata);
                    // 添加房卡
                    if (catName.indexOf('jushu') == 0 || catName.indexOf('rounds') == 0) {
                        this.initFangkaText(node);
                    }
                    // 点击监听
                    checkbox.addEventListener(this.cbListener, this);
                    if (noTextTouch) {
                        node.getChildByName('checkBox').setVisible(false);
                        continue;
                    }
                    if (isPopup) {
                        var popArrow = node.getChildByName('popArrow');

                        if (popArrow) hint.setPositionX(popArrow.getContentSize().width + 160);

                        node.getChildByName('checkBox').setVisible(false);
                        TouchUtils.setOnclickListener(text, this.cbTouchPop.bind(this), {effect: TouchUtils.effects.SEPIA});
                        var popArrow = node.getChildByName('popArrow');
                        var bg = node.getChildByName('bg');
                        if (popArrow && bg) {
                            TouchUtils.setOnclickListener(popArrow, this.cbTouchPop.bind(this), {effect: TouchUtils.effects.SEPIA});
                            TouchUtils.setOnclickListener(bg, this.cbTouchPop.bind(this), {effect: TouchUtils.effects.SEPIA});
                        }
                        continue;
                    }
                    TouchUtils.setOnclickListener(text, this.cbTouch.bind(this), {effect: TouchUtils.effects.SEPIA});
                }
            }
            baseCheckbox.setVisible(false);
        },

        /**
         * 初始化玩法
         */
        initWanfa: function () {
            if (!this.cbList) {
                cc.error('创建房间选项框列表是空的');
                return;
            }
            for (var name in this.cbList) {
                if (!this.cbList.hasOwnProperty(name)) {
                    continue;
                }
                var node = this.cbList[name];
                if (!node) {
                    continue;
                }
                var userData = node.getUserData();
                if (!userData) {
                    continue;
                }
                var checkbox = node.getChildByName('checkBox');
                if (!checkbox) {
                    continue;
                }
                // 设置默认值
                checkbox.setSelected(userData.state);
                this.setSelected(node, userData.state);
            }
        },

        /**
         * 初始化房卡
         * @param node
         */
        initFangkaText: function (node) {
            var kaImage = new cc.Sprite(res.fangka);
            node.addChild(kaImage);
            kaImage.setPosition(cc.p(113, 0));
            var fkText = new ccui.Text();
            fkText.setFontSize(30);
            fkText.setTextColor(cc.color(0, 0, 0));
            fkText.setPosition(cc.p(163, -0));
            fkText.setString('x99');
            node.addChild(fkText);
            this.fangkaTextList.push(fkText);
        },

        /**
         * 改变房卡
         */
        changeFangkaText: function (node) {
            if(!node)return;
            // console.log("changeFangkaText");
            var userData = node.getUserData();
            if (!userData) {
                return;
            }
            // 改变AA值或者地图id时才检测
            if (!userData.key || (userData.key.indexOf('AA') != 0 && userData.key.indexOf('mapid') != 0
                && userData.key.indexOf('maxPlayerCnt_popup') != 0 && userData.key.indexOf('Players') != 0
                && userData.key.indexOf('maxPlayerCnt') != 0)) {
                console.log(userData.key);
                return;
            }
            // 只有选择AA时候才处理
            var AANode = this.cbList['AA_1'];
            if (!AANode) {
                return;
            }
            var AAcb = AANode.getChildByName('checkBox');
            if (!AAcb) {
                return;
            }
            // AA是否选中
            var idx = AAcb.isSelected() ? 1 : 0;
            var tab = this.curSelectedTab || this.tabList[0].getName();
            console.log('choose tab = ' + tab + "   -key" + userData.key);
            if (!this.fangkaData || !this.fangkaData[tab] || !this.fangkaData[tab][idx]) {
                console.log('房卡数据为空');
                return;
            }
            var _data = this.fangkaData[tab][idx];

            for (var i = 0; i < this.fangkaTextList.length; i++) {
                var id = i % _data.length;
                var card = _data[id];
                this.fangkaTextList[i].setString('x' + card);

                //九人扣卡 x1.5
                var maxPlayerCnt = this.cbList['maxPlayerCnt_popup_1'];
                var Players = this.cbList['Players_1'];
                // var Players_jd = this.cbList['Players_jd_1'];
                var maxPlayerNum = this.cbList['maxPlayerCnt_1'];
                if (maxPlayerCnt && maxPlayerCnt.isVisible() && maxPlayerCnt.getChildByName('checkBox') && maxPlayerCnt.getChildByName('checkBox').isSelected()) {
                    var costcard = Math.ceil(card * 1.5);
                    this.fangkaTextList[i].setString('x' + costcard);
                }
                if (Players && Players.isVisible() && Players.getChildByName('checkBox') && Players.getChildByName('checkBox').isSelected()) {
                    var costcard = Math.ceil(card * 1.5);
                    this.fangkaTextList[i].setString('x' + costcard);
                }
                if (maxPlayerNum && maxPlayerNum.isVisible() && maxPlayerNum.getChildByName('checkBox') && maxPlayerNum.getChildByName('checkBox').isSelected()) {
                    var costcard = (!AAcb.isSelected() ? Math.ceil(card * 1.33) : card);
                    this.fangkaTextList[i].setString('x' + costcard);
                }
                //十三水人数选择影响扣卡
                if(window.sss_players_fangka && idx!=1){
                    for(var j=0; j<5; j++){
                        var curPlayerCb = this.cbList['maxPlayerCnt_' + j];
                        if(curPlayerCb && curPlayerCb.getChildByName('checkBox') && curPlayerCb.getChildByName('checkBox').isSelected()){
                            if(idx==1){
                                this.fangkaTextList[i].setString('x' + card);
                            }else{
                                this.fangkaTextList[i].setString('x' + sss_players_fangka[j][i]);
                            }

                        }
                    }
                }
            }
        },
        /**
         * 创建下拉菜单显示
         * @param node
         */
        createPopup: function (node) {
            var popArrow = new cc.Sprite(res.popup);
            node.addChild(popArrow);
            popArrow.setName('popArrow');
            var text = node.getChildByName('text');
            var checkBox = node.getChildByName('checkBox');
            var width = text.getContentSize().width + checkBox.getContentSize().width + 20;
            var height = checkBox.getContentSize().height;
            var color = cc.color('#af7547');
            var pos = cc.p(-25, -20);
            // var popBg = new cc.LayerColor(color, width, height);
            // popBg.setPosition(pos);
            // popBg.setName('bg');
            // node.addChild(popBg, -2);
            var popBg = new cc.Scale9Sprite('res/image/ui/hall/createroom_kuang1.png', cc.rect(0, 0, 52, 54), cc.rect(20, 23, 20, 20));
            var newwidth = 230;
            if (width > 230 && width < 400) newwidth = 250;
            else if (width >= 550) newwidth = 600;
            else newwidth = width + 50;
            popBg.setContentSize(cc.size(newwidth, height + 5));
            popBg.setAnchorPoint(cc.p(0, 0.5));
            popBg.setName('bg');
            popBg.setPositionX(-25);
            node.addChild(popBg, -1);
        },

        /**
         * 初始化点击事件
         */
        initTouch: function () {
            TouchUtils.setOnclickListener($('btn_create'), this.clickCreate.bind(this));
            TouchUtils.setOnclickListener($('btn_back'), this.clickClose.bind(this));
        },

        /**
         * 点击创建
         */
        clickCreate: function () {
            mRoom.wanfaMap = {};
            mRoom.wanfa = '';
            mRoom.special_gz = [];
            mRoom.wanfaArr = [];
            for (var id in this.cbList) {
                if (this.cbList.hasOwnProperty(id)) {
                    // console.log(id);
                    if (id == 'cpWanfa_0') {
                        // console.log(id);
                    }
                    var cb = this.cbList[id];
                    var userData = cb.getUserData();
                    var checkBox = cb.getChildByName('checkBox');
                    // 选项框不存在
                    if (!checkBox || !cc.sys.isObjectValid(checkBox)) {
                        continue;
                    }
                    // 不可见或者未被选中
                    if (!userData.isPopup) {
                        if (!cb.isVisible() || !checkBox.isVisible() || !checkBox.isSelected()) {
                            continue;
                        }
                    } else {
                        if (!cb.isVisible() || !checkBox.isSelected()) {
                            continue;
                        }
                    }
                    var key = userData.key;

                    // 以 '_' 开头的直接忽略
                    if (key.indexOf('_') == 0) {
                        continue;
                    }
                    if (key.indexOf('_') > 0) {
                        key = key.split('_')[0];
                    }
                    var value = userData.val;
                    var desp = this.getSpecialDesp(key, userData.desp);
                    // 生成option
                    mRoom.wanfaMap[key] = value;
                    console.log(key);
                    console.log(value);
                    // 添加玩法
                    // mRoom.wanfaArr.push(desp);

                    if (gameData.useNewClub && this.clubId
                        && (this.curSelectedTab == 'btn_7' || this.curSelectedTab == 'btn_8' || this.curSelectedTab == 'btn_9'
                        || this.curSelectedTab == 'btn_17' || this.curSelectedTab == 'btn_18' || this.curSelectedTab == 'btn_10')
                        && desp.indexOf('人') > -1) {
                    } else {
                        mRoom.wanfaArr.push(desp);
                    }

                    // 处理特殊参数
                    this.generateExtraDespMap(key, desp);
                    this.generateSpecialGz(key, desp);
                }
            }

            mRoom.wanfaArr = _.filter(mRoom.wanfaArr, function (obj) {
                return obj != '';
            });
            // console.log(mRoom.wanfaArr);

            // 玩法
            mRoom.wanfa = mRoom.wanfaArr.join(',');
            mRoom.wanfaMap.desp = mRoom.wanfa;
            // 特殊规则
            mRoom.wanfaMap.special_gz = mRoom.special_gz;
            this.generateSpecialWanfa();

            //俱乐部进去的要回大厅  继续打开俱乐部
            gameData.enterRoomWithClubID = 0;

            if (mRoom.wanfaMap.jushu) {
                mRoom.wanfaMap.rounds = mRoom.wanfaMap.jushu;
            }
            if (mRoom.wanfaMap.rounds) {//四川跑得快 局数特殊不同于跑得快 局数字段使用 rounds
                mRoom.wanfaMap.jushu = mRoom.wanfaMap.rounds;
            }

            if (this.isSetWanfa && this.setwanfapos != 5) {
                if (mRoom.wanfaMap.rounds) {
                    mRoom.wanfaMap.jushu = mRoom.wanfaMap.rounds;
                }
                //人数控制
                var wanjiarenshu0 = this.cbList['wanjiarenshu0'];
                var wanjiarenshu1 = this.cbList['wanjiarenshu1'];
                var wanjiarenshu2 = this.cbList['wanjiarenshu2'];
                if (((mRoom.wanfaMap['mapid'] == MAP_ID.PDK || mRoom.wanfaMap['mapid'] == MAP_ID.SICHUAN_TRLF) && !mRoom.wanfaMap['wanjiarenshu0'] && !mRoom.wanfaMap['wanjiarenshu1'])
                    ||
                    ((mRoom.wanfaMap['mapid'] == MAP_ID.ZHUANZHUAN || mRoom.wanfaMap['mapid'] == MAP_ID.SICHUAN_MZ) && !mRoom.wanfaMap['wanjiarenshu0'] && !mRoom.wanfaMap['wanjiarenshu1'] && !mRoom.wanfaMap['wanjiarenshu2'])
                    ||
                    ((mRoom.wanfaMap['mapid'] == MAP_ID.CHANGSHA || mRoom.wanfaMap['mapid'] == MAP_ID.HONGZHONG) && !mRoom.wanfaMap['wanjiarenshu1'] && !mRoom.wanfaMap['wanjiarenshu2'])) {
                    alert1('请选择人数');
                    return;
                }
                if (!mRoom.wanfaMap.desp) {
                    mRoom.wanfaMap.desp = mRoom.wanfaArr.join(',');
                }
                mRoom.wanfaMap['club_id'] = this.clubId;
                if (this.setwanfapos >= 1) {
                    network.send(2103, {
                        cmd: 'addWanfa',
                        club_id: this.clubId,
                        options: mRoom.wanfaMap,
                        desc: mRoom.wanfaMap.desp,//encodeURIComponent(despArr.join(",")),
                        map_id: mRoom.wanfaMap['mapid'],
                        shipin: false,
                        daikai: false,
                        pos: this.setwanfapos
                    });
                }
                this.saveSelected();
                this.removeFromParent();
            } else {
                HUD.showLoading('正在创建房间');
                mRoom.roomInfo = mRoom.wanfaMap;
                network.start();
                if(this.setwanfapos == 5){
                    mRoom.wanfaMap.pos = this.setwanfapos;
                    mRoom.wanfaMap.club_id = this.clubId;
                    gameData.enterRoomWithClubID = this.clubId;
                }
                network.send(3001, {
                    room_id: 0
                    , map_id: mRoom.wanfaMap['mapid']
                    , mapid: mRoom.wanfaMap['mapid']
                    , daikai: this.isDaikai
                    , options: mRoom.wanfaMap
                    , club_id: this.clubId
                });
                this.saveSelected();
            }

        },

        /**
         * 存档
         */
        saveSelected: function () {
            if (this.curSelectedTab) {
                cc.sys.localStorage.setItem('create_room_tab_' + this.sub, this.curSelectedTab);
            }
            if (!this.cbList || _.keys(this.cbList) == 0) {
                return;
            }
            var saveJson = {};
            for (var name in this.cbList) {
                if (this.cbList.hasOwnProperty(name)) {
                    var node = this.cbList[name];
                    var cb = node.getChildByName('checkBox');
                    saveJson[name] = {
                        visiable: node.isVisible(),
                        selected: cb.isSelected()
                    };
                }
            }
            cc.sys.localStorage.setItem('create_room_cblist_' + this.sub, JSON.stringify(saveJson));
        },

        /**
         * 读档
         */
        loadSelected: function () {
            if (!this.cbList || this.cbList.length == 0) {
                return;
            }
            var saveJson = JSON.parse(cc.sys.localStorage.getItem('create_room_cblist_' + this.sub) || '{}');
            // 检查是否有不同的项,如果有的话清除存档
            if (_.difference(_.keys(this.cbList), _.keys(saveJson)).length > 0) {
                cc.sys.localStorage.removeItem('create_room_cblist_' + this.sub);
                return;
            }
            for (var name in this.cbList) {
                if (this.cbList.hasOwnProperty(name)) {
                    var node = this.cbList[name];
                    console.log("loadSelected->" +name);
                    node.setVisible(saveJson[name].visiable);
                    var cb = node.getChildByName('checkBox');
                    cb.setSelected(saveJson[name].selected);
                    var txt = node.getChildByName('text');
                    txt.setTextColor(saveJson[name].selected ? cc.color(21,161,31):cc.color(175,133,108));
                }
            }
            this.changeFangkaText(this.cbList['AA_1']);//加载数据之后 房卡对不上 添加函数重新刷新一遍
        },

        /**
         * 点击关闭
         */
        clickClose: function () {
            this.removeFromParent(true);
        },

        /**
         * 点击tab
         * @param tab
         */
        clickTab: function (tab) {
            this.changeTab(tab.getName());
        },

        /**
         * 改变tab
         * @param name
         */
        changeTab: function (name) {
            console.log('changeTab ' + name);
            var that = this;
            name = name || this.tabList[0].getName();
            this.curSelectedTab = name;
            var foucsTab = null;
            // 控制foucs的显示隐藏
            for (var i = 0; i < this.tabList.length; i++) {
                (function (i) {
                    var foucs = that.tabList[i].getChildByName('foucs');
                    var foucs_bg = that.tabList[i].getChildByName('foucs_bg');
                    if (foucs_bg) {
                        if (that.tabList[i].getName() == name) {
                            if (foucsTab) foucsTab = that.tabList[i];
                            if (foucs) foucs.setVisible(true);
                            if (foucs_bg) foucs_bg.setVisible(true);
                            that.changeTabData(name);

                            //选中按钮 播放动画效果--俱乐部中不显示特效
                            if (cc.sys.isNative && foucs_bg) {
                                var _anim = foucs_bg.getChildByName('anim_eff');
                                if (!_anim) {
                                    _anim = sp.SkeletonAnimation(res.croom_json, res.croom_atlas);
                                    _anim.setPosition(cc.p(138, 59));
                                    _anim.addAnimation(0, 'quanguobao2', true);
                                    _anim.setName('anim_eff');
                                    foucs_bg.addChild(_anim);
                                }
                            }
                        } else {
                            if (foucs) foucs.setVisible(false);
                            if (foucs_bg) foucs_bg.setVisible(false);
                        }
                    } else {
                        //老版的UI
                        // that.tabList[i].setScale(0.5);
                        if (foucs) {
                            foucs.setPosition(cc.p(that.tabList[i].getContentSize().width / 2 + 15, that.tabList[i].getContentSize().height / 2 + 2));
                            foucs.setVisible(true);
                            that.tabList[i].setTexture('res/image/ui/room2/btn_blue_2.png');
                            foucs.setTexture('res/image/ui/room2/btn_yellow_2.png');
                            var nametmp = that.tabList[i].getName();
                            var id = nametmp.substr(4, nametmp.length - 3);
                            var on = new cc.Sprite('res/image/ui/room2/create_btn' + id + '_1.png');
                            on.setPosition(cc.p(that.tabList[i].getContentSize().width / 2, that.tabList[i].getContentSize().height / 2));
                            that.tabList[i].addChild(on);
                            if (that.tabList[i].getName() == name) {
                                if (foucs) foucs.setVisible(true);
                                that.changeTabData(name);
                            } else {
                                if (foucs) foucs.setVisible(false);
                            }
                        }
                    }
                })(i);
            }

            // 处理特殊依赖
            this.handleSpecialDepend(name);


            if (!foucsTab) {
                return;
            }
            // 处理如果存储的tab在视区外的情况(需要延迟执行)
            setTimeout(function () {
                var scrollView = foucsTab.getParent().getParent();
                if (scrollView.getInnerContainer().y + foucsTab.y < 0) {
                    scrollView.jumpToBottom();
                }
            }, 1);

        },

        /**
         * 改变tab数据
         * @param name
         */
        changeTabData: function (name) {
            var tabData = this.tabData[name];
            // console.log("changeTabData " + name + " " + JSON.stringify(tabData));
            if (!tabData) {
                return;
            }
            var click = tabData['click'];
            var show = tabData['show'];
            var hide = tabData['hide'];
            // 处理click(只能响应1个)
            if (_.isArray(click)) {
                click = click[0];
            }
            if (this.cbList.hasOwnProperty(click)) {
                var node = this.cbList[click];
                var cb = node.getChildByName('checkBox');
                cb.setSelected(true);
                this.setSelected(node, true);
            }
            // 处理show(只处理同父节点下)
            if (!_.isArray(show)) {
                show = [show];
            }
            for (var i = 0; i < show.length; i++) {
                var shownode = $('wanfa_node.Node.' + show[i]);
                if (shownode && cc.sys.isObjectValid(shownode)) {
                    shownode.setVisible(true);
                }
            }
            // 处理hide
            if (!_.isArray(hide)) {
                hide = [hide];
            }
            for (var j = 0; j < hide.length; j++) {
                var hidenode = $('wanfa_node.Node.' + hide[j]);
                if (hidenode && cc.sys.isObjectValid(hidenode)) {
                    hidenode.setVisible(false);
                }
            }
        },

        /**
         * 改变CheckBox
         * @param node CheckBox
         * @param radio 单选还是复选
         */
        changeCheckBox: function (node, radio) {
            var cb1 = node.getChildByName('checkBox1');
            var cb2 = node.getChildByName('checkBox2');
            cb1.setVisible(radio);
            cb2.setVisible(!radio);
            cb1.setName(radio ? 'checkBox' : '_');
            cb2.setName(radio ? '_' : 'checkBox');
        },

        /**
         * checkbox文字监听
         * @param sender
         */
        cbTouch: function (sender) {
            var userData = sender.getParent().getUserData();
            // 取得checkbox
            var cb = sender.getParent().getChildByName('checkBox');
            var state = cb.isSelected();
            // 处理不可取消
            if (userData.undeselectable && state) {
                this.handleOnlySelected(sender.getParent(), !state, true);
                return;
            }
            cb.setSelected(!state);
            this.setSelected(sender.getParent(), !state);
            this.handleOnlySelected(sender.getParent(), !state);
        },

        /**
         * pop点击
         * @param sender
         */
        cbTouchPop: function (sender) {
            var that = this;
            var node = sender.getParent();
            var userData = node.getUserData();
            if (!userData) {
                return;
            }
            // 创建一个背景layer，屏蔽点击
            var layer = new cc.Layer();
            this.addChild(layer, 999);
            TouchUtils.setOnclickListener(layer, function () {
                layer.removeFromParent(true);
            }, {effect: TouchUtils.effects.NONE});
            // 检索数组（有关数组的方案后面要重写）
            var cbs = [];
            var name = node.getName();
            var names = name.split('_');
            if (names.length < 2) {
                return;
            }
            var id = Number(_.last(names));
            names = _.dropRight(names);
            var catname = names.join('_');
            if (!isNaN(id)) {
                var i = 0;
                while (true) {
                    var cbName = catname + '_' + i;
                    if (this.cbList.hasOwnProperty(cbName)) {
                        cbs.push(this.cbList[cbName]);
                    } else {
                        break;
                    }
                    i++;
                }
            }
            // 创建背景
            var bg = node.getChildByName('bg');
            var width = bg.getContentSize().width;
            var height = cbs.length * 50;
            var pos = bg.convertToWorldSpace(cc.p(0, 0));
            if (node.getPositionY() <= 300) {
                pos.y += 50;
            } else {
                pos.y -= height;
            }
            var popBg = new cc.Scale9Sprite('res/image/ui/hall/createroom_kuang2.png', cc.rect(0, 0, 97, 120), cc.rect(57, 80, 20, 20));
            popBg.setContentSize(cc.size(width, height));
            popBg.setAnchorPoint(cc.p(0, 0));
            popBg.setPosition(pos);
            layer.addChild(popBg);

            TouchUtils.setOnclickListener(popBg, function () {
            }, {effect: TouchUtils.effects.NONE});
            // 创建文字
            for (var idx = 0; idx < cbs.length; idx++) {
                var cb = cbs[idx];
                var cbUserData = cb.getUserData();
                if (!cbUserData) {
                    continue;
                }
                var desp = cbUserData.desp;
                var text = new ccui.Text();
                text.setFontSize(28);
                text.setAnchorPoint(cc.p(0, 0));
                text.setTextColor(cc.color(0, 0, 0));
                text.setPosition(cc.p(55, idx * 50 + 5));
                text.setString(desp);
                text.setName(cbUserData.key + '_' + idx);
                popBg.addChild(text);
                //check
                var check = new cc.Sprite('res/image/ui/room2/bt_bg.png');
                check.setPosition(cc.p(25, idx * 50 + 25));
                popBg.addChild(check);
                if (userData.val == cbUserData.val) {
                    var check2 = new cc.Sprite('res/image/ui/room2/btselect.png');
                    check2.setPosition(cc.p(check.getContentSize().width / 2, check.getContentSize().height / 2));
                    check.addChild(check2);
                }
                (function (text) {
                    // console.log(text.getContentSize())
                    if (text.getContentSize().width <= 200) TouchUtils.setTouchRect(text, cc.rect(-50, 0, 230, 36));//0 0 130 36
                    TouchUtils.setOnclickListener(text, function () {
                        var node = that.cbList[text.getName()];
                        var cb = node.getChildByName('checkBox');
                        cb.setSelected(true);
                        that.setSelected(node, true);
                        layer.removeFromParent(true);
                    }, {effect: TouchUtils.effects.NONE});
                })(text);
            }
        },

        /**
         * checkbox监听
         * @param sender
         */
        cbListener: function (sender) {
            var userData = sender.getParent().getUserData();
            // 取得checkbox
            var cb = sender.getParent().getChildByName('checkBox');
            var state = cb.isSelected();
            // 处理不可取消
            if (userData.undeselectable && !state) {
                cb.setSelected(true);
                return;
            }
            this.setSelected(sender.getParent(), state);
            this.handleOnlySelected(sender.getParent(), !state);
        },

        /**
         * 设置选择
         * @param node
         * @param selected
         */
        setSelected: function (node, selected) {
            var userData = node.getUserData();
            // 不是选中不处理
            var txt = node.getChildByName('text');
            txt.setTextColor(selected ? cc.color(21,161,31):cc.color(175,133,108));
            if (selected) {
                this.handleArray(node.getName());
                this.handleDepend(node.getName());
                if (!userData.isPopup) this.handleMutexField(userData.mutexField);
                this.changeFangkaText(node);
            }
            this.handleSpecialDepend(node.getName());

        },

        /**
         * 处理数组
         * @param name
         */
        handleArray: function (name) {
            var names = name.split('_');
            if (names.length < 2) {
                return;
            }
            var id = Number(_.last(names));
            names = _.dropRight(names);
            var catname = names.join('_');
            if (!isNaN(id)) {
                var i = 0;
                // 这里是个死循环，谨慎！
                while (true) {
                    var cbName = catname + '_' + i;
                    if (this.cbList.hasOwnProperty(cbName)) {
                        if (cbName != name) {
                            var cb = this.cbList[cbName].getChildByName('checkBox');
                            cb.setSelected(false);
                            this.setSelected(this.cbList[cbName], false);
                        }
                    } else {
                        break;
                    }
                    i++;
                }
            }
        },

        /**
         * 处理依赖(mapid)
         * @param name
         */
        handleDepend: function (name) {
            // 不处理mapid以外的依赖
            if (name.indexOf('mapid') != 0) {
                return;
            }
            for (var id in this.cbList) {
                if (this.cbList.hasOwnProperty(id)) {
                    var cb = this.cbList[id];
                    var userData = cb.getUserData();
                    var depend = userData.depName;
                    var posMapArr = userData.posMapArr;
                    if (posMapArr) {
                        // console.log(userData);
                        // console.log(posMapArr);
                        var curPos = cc.p(0, 0);
                        for (var k = 0; k < posMapArr.length; k++) {
                            var nodename = posMapArr[k][0];
                            if (this.cbList[nodename] && this.cbList[nodename].getChildByName('checkBox') &&
                                this.cbList[nodename].getChildByName('checkBox').isSelected()) {
                                curPos = cc.p(posMapArr[k][1], posMapArr[k][2]);
                                // console.log(curPos);
                                // console.log(k);
                                break;
                            }
                        }
                        cb.setPosition(curPos);
                    }

                    if (!depend) {
                        continue;
                    }
                    if (!_.isArray(depend)) {
                        depend = [depend];
                    }
                    for (var i = 0; i < depend.length; i++) {
                        if (name == depend[i]) {
                            cb.setVisible(true);
                            break;
                        } else {
                            cb.setVisible(false);
                        }
                    }
                }
            }
        },

        /**
         * 处理互斥
         * @param mutexField
         */
        handleMutexField: function (mutexField) {
            if (!mutexField) {
                return;
            }
            if (!_.isArray(mutexField)) {
                mutexField = [mutexField];
            }
            for (var i = 0; i < mutexField.length; i++) {
                var cbName = mutexField[i];
                if (this.cbList.hasOwnProperty(cbName)) {
                    var cb = this.cbList[cbName].getChildByName('checkBox');
                    cb.setSelected(false);
                    this.setSelected(this.cbList[cbName], false);
                }
            }
        },
        handleOnlySelected: function (node, selected, isRepeat) {
            // console.log("(单独回调 handleOnlySelected )点击 --> " + node.getName());
            var that = this;
            if (this.curSelectedTab == 'btn_23') {
                var name = node.getName();
                var key = name.substr(0, name.indexOf('_'));
                var idx = name.substr(name.lastIndexOf('_') + 1, name.length);
                if (key == "yanse") {
                    var handleFun = function (cfg) {
                        for (var key in cfg) {
                            if (cfg.hasOwnProperty(key)) {
                                that.cbList[key + '_' + cfg[key]].getChildByName('checkBox').setSelected(true);
                                that.setSelected(that.cbList[key + '_' + cfg[key]], true);
                            }
                        }
                        that.handle13Shui('yanse')
                    }
                    if (idx > 0) {
                        this.addChild(new ChooseColorLayer(idx, handleFun, this.cbList))
                    } else {
                        handleFun({
                            zhengse: 0,
                            fuse1: 0,
                            fuse2: 0
                        })
                    }
                }
            }
        },
        /**
         * 处理特殊依赖关系
         */
        handleSpecialDepend: function (name) {
            this.handleChangShaZhuaMa();
            this.handleZhuanzhuanZhuaMa();
            this.handleNiuniu();//牛牛的特殊处理
            this.handlePdk();//处理跑得快
            this.handlePsz();//处理拼三张
            this.handleEpz();//处理二皮子
            this.handlePopup();
            this.handleKaokao();
            this.handleScma();//川麻特殊处理
            this.handleHHDesk();
            this.handle13Shui(name);//处理13水
        },
        handle13Shui: function (name) {
            var that = this;
            if (this.curSelectedTab == 'btn_23') {
                //根据配置显示文字
                var str = "";
                var idx1, idx2, idx3 = -1;
                for (var i = 0; i < 5; i++) {
                    var zhengse = this.cbList['zhengse_' + i];
                    var fuse1 = this.cbList['fuse1_' + i];
                    var fuse2 = this.cbList['fuse2_' + i];
                    if (zhengse.getChildByName('checkBox').isSelected()) {
                        idx1 = i;
                    }
                    if (fuse1.getChildByName('checkBox').isSelected()) {
                        idx2 = i;
                    }
                    if (fuse2.getChildByName('checkBox').isSelected()) {
                        idx3 = i;
                    }
                }
                var idx2name = ["无", "黑桃", "红桃", "梅花", "方块"]
                str += ("正色：" + idx2name[idx1])
                str += ("  副色：" + idx2name[idx2])
                if (idx3 != 0 && idx2 != 0) {
                    str += ("," + idx2name[idx3])
                }
                // console.log(str)
                $('wanfa_node.Node.word_yanse').setString(str);


                //倍率控制
                //gametype
                var gametypeBeilv1 = this.cbList['gametype_1'];
                var gametypeBeilv2 = this.cbList['gametype_2'];
                //TODO 根据以上两个选项 决定倍率的显示
                if (gametypeBeilv1.getChildByName('checkBox').isSelected()) {//抢庄
                    //beilv
                    this.cbList['beilv_0'].setVisible(false);
                    this.cbList['beilv_1'].setVisible(true);
                    this.cbList['beilv_2'].setVisible(true);
                    this.cbList['beilv_3'].setVisible(true);
                    that.cbList['beilv_0'].getChildByName('checkBox').setSelected(false);
                    // that.setSelected(that.cbList['beilv_0'], false);
                    var isSelect = false;
                    for (var i = 3; i >= 1; i--) {
                        if (this.cbList['beilv_' + i].getChildByName('checkBox').isSelected()) {
                            isSelect = true;
                        }
                    }
                    if (!isSelect) {
                        that.cbList['beilv_' + 1].getChildByName('checkBox').setSelected(true);
                    }
                    $('wanfa_node.Node.word_bl').setVisible(true);
                } else if (gametypeBeilv2.getChildByName('checkBox').isSelected()) {
                    this.cbList['beilv_0'].setVisible(true);
                    this.cbList['beilv_1'].setVisible(true);
                    this.cbList['beilv_2'].setVisible(false);
                    this.cbList['beilv_3'].setVisible(false);
                    that.cbList['beilv_2'].getChildByName('checkBox').setSelected(false);
                    that.cbList['beilv_3'].getChildByName('checkBox').setSelected(false);
                    var isSelect = false;
                    for (var i = 1; i >= 0; i--) {
                        if (this.cbList['beilv_' + i].getChildByName('checkBox').isSelected()) {
                            isSelect = true;
                        }
                    }
                    if (!isSelect) {
                        that.cbList['beilv_' + 1].getChildByName('checkBox').setSelected(true);
                    }
                    $('wanfa_node.Node.word_bl').setVisible(true);
                } else {
                    this.cbList['beilv_0'].setVisible(false);
                    this.cbList['beilv_1'].setVisible(false);
                    this.cbList['beilv_2'].setVisible(false);
                    this.cbList['beilv_3'].setVisible(false);
                    $('wanfa_node.Node.word_bl').setVisible(false);
                }
                if (!this.cbList['mapai_0'].getChildByName('checkBox').isSelected()) {
                    this.cbList['mapai_0'].getChildByName('text').setString('马牌')
                    $('wanfa_node.Node.btn_mapai').setVisible(false)
                } else {

                    if (window.sssRule && (name == "mapai_0" || name == 'yanse' || name == 'btn_23') ){
                        // console.log("--------------------------------" + name);
                        // console.log("###################################");
                        $('wanfa_node.Node.btn_mapai').setVisible(true)
                        var mapai = this.makeMapaiByZhuFu();
                        cc.sys.localStorage.setItem('sss_create_room_mapai', mapai)
                        this.update13ShuiCfg()
                        this.cbList['mapai_0'].getChildByName('text').setString('马牌:' + sssRule._toChinese([mapai]))
                        var userData = this.cbList['mapai_0'].getUserData();
                        // userData.key = mapai;
                        userData.val = mapai;//'马牌:' + sssRule._toChinese([mapai]);
                        userData.desp = '马牌:' + sssRule._toChinese([mapai]);
                    }else{
                        this.maPaiEventInit(idx1, idx2, idx3);
                    }
                }
                if(this.cbList['AA_0'].getChildByName('checkBox').isSelected()){
                    this.cbList['zhongtujiaru_0'].setVisible(true)
                }else{
                    this.cbList['zhongtujiaru_0'].setVisible(false)
                }
            }
            // console.log("??? " + name);
        },
        makeMapaiByZhuFu : function () {
            var idx1, idx2, idx3 = -1;
            for (var i = 0; i < 5; i++) {
                var zhengse = this.cbList['zhengse_' + i];
                var fuse1 = this.cbList['fuse1_' + i];
                var fuse2 = this.cbList['fuse2_' + i];
                if (zhengse.getChildByName('checkBox').isSelected()) {
                    idx1 = i;
                }
                if (fuse1.getChildByName('checkBox').isSelected()) {
                    idx2 = i;
                }
                if (fuse2.getChildByName('checkBox').isSelected()) {
                    idx3 = i;
                }
            }
            var zhu = idx1;
            var fu1 = idx2;
            var fu2 = idx3;

            var limitTypes = [];
            if(zhu)limitTypes.push(zhu);
            if(fu1)limitTypes.push(fu1);
            if(fu2)limitTypes.push(fu2);
            if(!zhu && !fu1 && !fu2){
                limitTypes = [1,2,3,4]
            }
            console.log(zhu);
            console.log(fu1);
            console.log(fu2);
            var value = _.random(12) + 1;
            var typeIdx = _.random(limitTypes.length-1);
            var type = limitTypes[typeIdx];
            type = {4: 1, 1: 4, 2: 3, 3: 2}[type];
            console.log(JSON.stringify(limitTypes));
            console.log("value=" + value + "  type="+type);

            var mapai = (value-1) * 4 + type;
            return mapai;
        },
        maPaiEventInit : function (zhu,fu1,fu2) {
            var that = this;
            TouchUtils.setOnclickListener($('wanfa_node.Node.btn_mapai'), function () {
                if(that.cbList['mapai_0'].getChildByName('checkBox').isSelected()){
                    //得到允许的牌堆
                    var mapai = that.makeMapaiByZhuFu()
                    cc.sys.localStorage.setItem('sss_create_room_mapai', mapai)
                    that.update13ShuiCfg()
                    that.cbList['mapai_0'].getChildByName('text').setString('马牌:' + sssRule._toChinese([mapai]))
                    var userData = that.cbList['mapai_0'].getUserData();
                    // userData.key = mapai;
                    userData.val = mapai;//'马牌:' + sssRule._toChinese([mapai]);
                    userData.desp = '马牌:' + sssRule._toChinese([mapai]);
                }
            });
        },
        handleKaokao: function () {
            if (this.curSelectedTab == 'btn_19') {
                var isChooseFengding = false;
                for (var i = 0; i <= 2; i++) {
                    var fengdingN = this.cbList['cpFengding_' + i];
                    if (fengdingN.getChildByName('checkBox').isSelected()) {
                        isChooseFengding = true;
                        break;
                    }
                }
                if (!isChooseFengding) {
                    var fengdingN = this.cbList['cpFengding_' + 0];
                    fengdingN.getChildByName('checkBox').setSelected(true);
                }

                $('wanfa_node.Node.word_wf').y = 280.00;
                this.cbList['cpZimo_0'].y = 280;
                this.cbList['cpGsh_0'].y = 280;
                this.cbList['cpQiahu_0'].y = 280;
                this.cbList['cpWanfa_0'].getChildByName('checkBox').setSelected(true);
            }
            if (this.curSelectedTab == 'btn_20') {
                var tifan = this.cbList['cpFanType_0'];
                var isChooseFengding = false;
                var isTifan = tifan.getChildByName('checkBox').isSelected();
                for (var i = 3; i <= 5; i++) {
                    var fengdingN = this.cbList['cpFengding_' + i];
                    fengdingN.setVisible(!isTifan);
                    fengdingN.setScale(0.93);
                    if (!isTifan) {
                        if (fengdingN.getChildByName('checkBox').isSelected()) {
                            isChooseFengding = true;
                        }
                    }
                }
                if (!isTifan && !isChooseFengding) {
                    this.cbList['cpFengding_' + 4].getChildByName('checkBox').setSelected(true);
                }
                for (var i = 6; i <= 8; i++) {
                    var fengdingN = this.cbList['cpFengding_' + i];
                    fengdingN.setVisible(isTifan);
                    fengdingN.setScale(0.93);
                    if (isTifan) {
                        if (fengdingN.getChildByName('checkBox').isSelected()) {
                            isChooseFengding = true;
                        }
                    }
                }
                if (isTifan && !isChooseFengding) {
                    this.cbList['cpFengding_' + 7].getChildByName('checkBox').setSelected(true);
                }
                $('wanfa_node.Node.word_wf').y = 180.00;
                this.cbList['cpZimo_0'].y = 180;
                this.cbList['cpGsh_0'].y = 180;
                this.cbList['cpQiahu_0'].y = 180;
                this.cbList['cpWanfa_1'].getChildByName('checkBox').setSelected(true);
            }

        },
        /**
         * 混合牌桌
         */
        handleHHDesk: function () {
            if (this.clubId && (this.setwanfapos && this.setwanfapos != 5) && gameData.useNewClub) {
                var curConfig = hunzhuoRenshuConfig[this.curSelectedTab];
                if (curConfig) {
                    var hideNode = curConfig['hide'];
                    for (var i = 0; i < hideNode.length; i++) {
                        var curnode = this.cbList[hideNode[i] + '_0'];
                        if (curnode) curnode.setVisible(false);
                    }
                }
            }
            // if(this.curSelectedTab == "btn_8" || this.curSelectedTab == "btn_9") { //长沙麻将 和  红肿麻将
            //     var wanjiarenshu1_cs_0 = this.cbList['wanjiarenshu1_cs_0'];
            //     var wanjiarenshu2_cs_0 = this.cbList['wanjiarenshu2_cs_0'];
            //     if (this.clubId && gameData.useNewClub) {
            //         var sirenwan = this.cbList['siren_cs_0'];
            //         if(sirenwan) sirenwan.setPositionX(1500);
            //         var sanrenwan = this.cbList['sanrenwan_cs_0'];
            //         if(sanrenwan) sanrenwan.setPositionX(1500);
            //
            //         if(wanjiarenshu1_cs_0) {
            //             wanjiarenshu1_cs_0.setVisible(true);
            //             var posX_0 = wanjiarenshu1_cs_0.getPositionX(); // 分包更新兼容
            //             if(posX_0 > 2000) wanjiarenshu1_cs_0.setPositionX(posX_0 - 2000);
            //         }
            //         if(wanjiarenshu2_cs_0) {
            //             wanjiarenshu2_cs_0.setVisible(true);
            //             var posX_1 = wanjiarenshu2_cs_0.getPositionX(); // 分包更新兼容
            //             if(posX_1 > 2000) wanjiarenshu2_cs_0.setPositionX(posX_1 - 2000);
            //         }
            //     } else {
            //         if(wanjiarenshu1_cs_0) wanjiarenshu1_cs_0.setVisible(false);
            //         if(wanjiarenshu2_cs_0) wanjiarenshu2_cs_0.setVisible(false);
            //     }
            // } else if(this.curSelectedTab == "btn_7"){ // 转转麻将
            //     var wanjiarenshu0_0 = this.cbList['wanjiarenshu0_0'];
            //     var wanjiarenshu1_0 = this.cbList['wanjiarenshu1_0'];
            //     var wanjiarenshu2_0 = this.cbList['wanjiarenshu2_0'];
            //     if (this.clubId && gameData.useNewClub) {
            //         var siren_0 = this.cbList['siren_0'];
            //         if (siren_0) siren_0.setPositionX(1500);
            //         var sanrenwan_0 = this.cbList['sanrenwan_0'];
            //         if (sanrenwan_0) sanrenwan_0.setPositionX(1500);
            //         var liangrenwan_0 = this.cbList['liangrenwan_0'];
            //         if (liangrenwan_0) liangrenwan_0.setPositionX(1500);
            //
            //         if (wanjiarenshu0_0){
            //             wanjiarenshu0_0.setVisible(true);
            //             var posX_0 = wanjiarenshu0_0.getPositionX(); // 分包更新兼容
            //             if(posX_0 > 2000) wanjiarenshu0_0.setPositionX(posX_0 - 2000);
            //         }
            //         if (wanjiarenshu1_0) {
            //             wanjiarenshu1_0.setVisible(true);
            //             var posX_1 = wanjiarenshu1_0.getPositionX();
            //             if(posX_1 > 2000) wanjiarenshu1_0.setPositionX(posX_1 - 2000);
            //         }
            //         if (wanjiarenshu2_0) {
            //             wanjiarenshu2_0.setVisible(true);
            //             var posX_2 = wanjiarenshu2_0.getPositionX();
            //             if(posX_2 > 2000) wanjiarenshu2_0.setPositionX(posX_2 - 2000);
            //         }
            //     } else {
            //         if (wanjiarenshu0_0) wanjiarenshu0_0.setVisible(false);
            //         if (wanjiarenshu1_0) wanjiarenshu1_0.setVisible(false);
            //         if (wanjiarenshu2_0) wanjiarenshu2_0.setVisible(false);
            //     }
            // }

        },
        /**
         * 处理川麻特殊显示
         */
        handleScma: function () {
            //门清  dianpaomenqing
            if (this.cbList['menqing_0'] && this.cbList['menqing_0'].isVisible()) {
                if (this.cbList['menqing_0'].getChildByName('checkBox').isSelected()) {
                    this.cbList['dianpaomenqing_0'].setVisible(true);
                } else {
                    this.cbList['dianpaomenqing_0'].setVisible(false);
                }
            }
            //选中三人玩  显示 平胡可接炮 sanrenwan_mz
            if (gameData.useNewClub && this.clubId) {
                if ((this.cbList['wanjiarenshu0_mz_0'] && this.cbList['wanjiarenshu0_mz_0'].isVisible())) {
                    if (this.cbList['wanjiarenshu0_mz_0'].getChildByName('checkBox').isSelected()) {
                        this.cbList['yifandiaopaolr_0'].setVisible(true);
                    } else {
                        this.cbList['yifandiaopaolr_0'].setVisible(false);
                    }
                }
                //(this.cbList['wanjiarenshu1_mz_0'] && this.cbList['wanjiarenshu1_mz_0'].isVisible())
                if ((this.cbList['wanjiarenshu1_mz_0'] && this.cbList['wanjiarenshu1_mz_0'].isVisible())) {
                    if (this.cbList['wanjiarenshu1_mz_0'].getChildByName('checkBox').isSelected()) {
                        this.cbList['yifandiaopaosr_0'].setVisible(true);
                    } else {
                        this.cbList['yifandiaopaosr_0'].setVisible(false);
                    }
                }
            } else {
                if ((this.cbList['sanrenwan_mz_0'] && this.cbList['sanrenwan_mz_0'].isVisible()) ||
                    (this.cbList['liangrenwan_mz_0'] && this.cbList['liangrenwan_mz_0'].isVisible())) {
                    if (this.cbList['sanrenwan_mz_0'].getChildByName('checkBox').isSelected() ||
                        this.cbList['liangrenwan_mz_0'].getChildByName('checkBox').isSelected()) {
                        this.cbList['yifandiaopao_0'].setVisible(true);
                    } else {
                        this.cbList['yifandiaopao_0'].setVisible(false);
                    }
                }
            }
        },
        /**
         * 处理拼三张特殊显示
         */
        handlePsz: function () {
            if (this.curSelectedTab == 'btn_11') {
                var AA = this.cbList['AA_1'];
                var yunxujiaru = this.cbList['yunxujiaru_0'];
                yunxujiaru.setVisible(!AA.getChildByName('checkBox').isSelected());
                //选了禁止观战 禁止中途加入也得勾选
                var withOnLookers = this.cbList['withOnLookers_0'];
                if (withOnLookers && withOnLookers.getChildByName('checkBox').isSelected()) {
                    yunxujiaru.getChildByName('checkBox').setSelected(true);
                    yunxujiaru.getUserData().state = true;
                }
            }
        },
        /**
         * 处理二皮子特殊显示
         */
        handleEpz: function () {
            if (this.curSelectedTab == 'btn_21') {
                // var AA = this.cbList['AA_1'];
                var yunxujiaru = this.cbList['yunxujiaru_0'];
                // yunxujiaru.setVisible(!AA.getChildByName('checkBox').isSelected());
                //选了禁止观战 禁止中途加入也得勾选
                var withOnLookers = this.cbList['withOnLookers_0'];
                if (withOnLookers && withOnLookers.getChildByName('checkBox').isSelected()) {
                    yunxujiaru.getChildByName('checkBox').setSelected(true);
                    yunxujiaru.getUserData().state = true;
                }
            }
        },
        /**
         * 处理跑得快特殊显示
         */
        handlePdk: function () {
            //选 15张没有 pdk3Abomb pdk3A1bomb
            if (this.curSelectedTab == 'btn_10') {
                var pdkNumofCardsPerUser = this.cbList['pdkNumofCardsPerUser_0'];
                var pdk3Abomb = this.cbList['pdk3Abomb_0'];
                var pdk3A1bomb = this.cbList['pdk3A1bomb_0'];
                pdk3Abomb.setVisible(pdkNumofCardsPerUser.getChildByName('checkBox').isSelected());
                pdk3A1bomb.setVisible(pdkNumofCardsPerUser.getChildByName('checkBox').isSelected());
            }
        },
        /**
         * 处理牛牛特殊显示
         */
        handleNiuniu: function () {
            //牛牛的AA 没有中途加入
            var AA = this.cbList['AA_1'];
            if (!AA) {
                return;
            }
            var AACb = AA.getChildByName('checkBox');
            if (!AACb) {
                return;
            }

            if (this.curSelectedTab == 'btn_14') {
                //经典双十
                //轮庄 霸王庄  不显示 双十上庄  双十下庄
                var ZhuangMode = this.cbList['ZhuangMode_jd_0'];
                if (!ZhuangMode) {
                    return;
                }
                var ZhuangModeCb = ZhuangMode.getChildByName('checkBox');
                if (!ZhuangModeCb) {
                    return;
                }
                var ZhuangMode_jd2 = this.cbList['ZhuangMode_jd2_0'];//双十上庄
                var Meiniuxiazhuang_jd = this.cbList['Meiniuxiazhuang_jd_0'];//没十下庄
                if (ZhuangMode.isVisible()) {
                    ZhuangMode_jd2.setVisible(ZhuangModeCb.isSelected());
                    Meiniuxiazhuang_jd.setVisible(ZhuangModeCb.isSelected());
                }
                //扣一张 扣两张 不显示 只下一次注
                //选了只下一次注  才出现 固定低分
                var Preview_jd = this.cbList['Preview_jd_0'];
                if (!Preview_jd) {
                    return;
                }
                var Preview_jdCb = Preview_jd.getChildByName('checkBox');
                if (!Preview_jdCb) {
                    return;
                }
                var ChipInOnce = this.cbList['ChipInOnce_0'];//只下一次注
                if (!Preview_jdCb.isSelected()) {
                    ChipInOnce.setVisible(false);
                    for (var i = 0; i < 6; i++) {
                        var Chipin_jd_popup = this.cbList['Chipin_jd_popup_' + i];
                        if (Chipin_jd_popup) {
                            Chipin_jd_popup.setVisible(false);
                            Chipin_jd_popup.getUserData().state = false;
                            Chipin_jd_popup.getChildByName('checkBox').setSelected(false);
                        }
                    }
                } else {
                    ChipInOnce.setVisible(true);
                    var isReset = true;//不选只下一次注   再勾选 需要重新设置
                    for (var i = 0; i < 6; i++) {
                        var Chipin_jd_popup = this.cbList['Chipin_jd_popup_' + i];
                        if (Chipin_jd_popup) {
                            Chipin_jd_popup.setVisible(Chipin_jd_popup.getUserData().state);
                            if (Chipin_jd_popup.getUserData().state == true) isReset = false;
                        }
                    }
                    if (isReset) {
                        this.cbList['Chipin_jd_popup_5'].setVisible(true);
                        this.cbList['Chipin_jd_popup_5'].getUserData().state = true;
                        this.cbList['Chipin_jd_popup_5'].getChildByName('checkBox').setSelected(true);
                    }
                }
                //只下一次注 不显示 禁止中途加入
                var ChipInOnceCb = ChipInOnce.getChildByName('checkBox');
                if (!ChipInOnceCb) {
                    return;
                }
                var isztjr_jd = this.cbList['isztjr_0'];//只下一次注
                if (ChipInOnceCb.isSelected() && ChipInOnce.isVisible()) {
                    isztjr_jd.setVisible(false);
                } else {
                    isztjr_jd.setVisible(true && !AACb.isSelected());
                }
            } else if (this.curSelectedTab == 'btn_1') {
                //双十上庄  闲家推注  显示 全扣  禁止中途加入  禁止搓牌
                var ChipInType = this.cbList['ChipInType_0'];
                if (!ChipInType) {
                    return;
                }
                var ChipInTypeCb = ChipInType.getChildByName('checkBox');
                if (!ChipInTypeCb) {
                    return;
                }
                for (var i = 0; i < 3; i++) {
                    var Preview = this.cbList['Preview_' + i];
                    Preview.setVisible(!ChipInTypeCb.isSelected());
                }
                var isztjr_qztt = this.cbList['isztjr_0'];//双十上庄
                var Cuopai_qztt = this.cbList['Cuopai_0'];//没十下庄
                isztjr_qztt.setVisible(!ChipInTypeCb.isSelected() && !AACb.isSelected());
                Cuopai_qztt.setVisible(!ChipInTypeCb.isSelected());
            }

            if (this.curSelectedTab == 'btn_4' || this.curSelectedTab == 'btn_12') this.cbList['isztjr_0'].setVisible(!AACb.isSelected());
            if (this.curSelectedTab == 'btn_3') this.cbList['isztjr_0'].setVisible(!AACb.isSelected());
            if (this.curSelectedTab == 'btn_2') this.cbList['isztjr_0'].setVisible(!AACb.isSelected());
            if (this.curSelectedTab == 'btn_13') this.cbList['isztjr_0'].setVisible(!AACb.isSelected());
            if (this.curSelectedTab == 'btn_6') this.cbList['isztjr_0'].setVisible(!AACb.isSelected());
        },
        /**
         * 处理转转麻将的抓码  2人玩没抓麻
         */
        handleZhuanzhuanZhuaMa: function () {
            // 长沙麻将
            var mapid = this.cbList['mapid_0'];
            if (!mapid) {
                return;
            }
            var mapidUserData = mapid.getUserData();
            if (!mapidUserData) {
                return;
            }
            if (mapidUserData.val != MAP_ID.ZHUANZHUAN) {
                return;
            }
            var mapidCb = mapid.getChildByName('checkBox');
            if (!mapidCb) {
                return;
            }
            if (!mapidCb.isSelected()) {
                return;
            }
            // 抓码文字
            // var zhuamaWz = $('wanfa_node.Node.word_zm');
            // if (!zhuamaWz) {
            //     return;
            // }
            // 抓码2，4，6 不翻倍时候
            var zhua2 = this.cbList['zhaniao_0'];
            var zhua4 = this.cbList['zhaniao_1'];
            var zhua6 = this.cbList['zhaniao_2'];
            var zhuamoji = this.cbList['zhaniao_3'];
            var hongzhong = this.cbList['hongzhong_0'];
            if (!zhua2 || !zhua4 || !zhua6 || !zhuamoji || !hongzhong) {
                return;
            }
            // //两人玩
            // var liangrenwan = this.cbList['liangrenwan_0'];
            // var liangrenwanCb = liangrenwan.getChildByName('checkBox');
            // if (!liangrenwanCb) {
            //     return;
            // }
            // // 如果选中的是不抓码
            // if (liangrenwanCb.isSelected() && !this.clubId) {
            //     // zhuamaWz.setVisible(false);
            //     zhua2.setVisible(false);
            //     zhua4.setVisible(false);
            //     zhua6.setVisible(false);
            //     zhuamoji.setVisible(false);
            //     hongzhong.setVisible(false);
            // } else {
            //     // zhuamaWz.setVisible(true);
            //     zhua2.setVisible(true);
            //     zhua4.setVisible(true);
            //     zhua6.setVisible(true);
            //     zhuamoji.setVisible(true);
            //     hongzhong.setVisible(true);
            // }
        },
        /**
         * 处理长沙麻将的抓码
         */
        handleChangShaZhuaMa: function () {
            // 长沙麻将
            var mapid = this.cbList['mapid_1'];
            if (!mapid) {
                return;
            }
            var mapidUserData = mapid.getUserData();
            if (!mapidUserData) {
                return;
            }
            if (mapidUserData.val != MAP_ID.CHANGSHA) {
                return;
            }
            var mapidCb = mapid.getChildByName('checkBox');
            if (!mapidCb) {
                return;
            }
            if (!mapidCb.isSelected()) {
                return;
            }
            // 抓码文字
            // var zhuamaWz = $('wanfa_node.Node.word_zm');
            // if (!zhuamaWz) {
            //     return;
            // }
            // 抓码1个（翻倍时候用）
            var zhua1 = this.cbList['zhaniao_csfanbei_0'];
            if (!zhua1) {
                return;
            }
            var zhua1Cb = zhua1.getChildByName('checkBox');
            if (!zhua1Cb) {
                return;
            }
            // 抓码2，4，6 不翻倍时候
            var zhua2 = this.cbList['zhaniao_cs_0'];
            var zhua4 = this.cbList['zhaniao_cs_1'];
            var zhua6 = this.cbList['zhaniao_cs_2'];
            if (!zhua2 || !zhua4 || !zhua6) {
                return;
            }
            var zhua2Cb = zhua2.getChildByName('checkBox');
            var zhua4Cb = zhua4.getChildByName('checkBox');
            var zhua6Cb = zhua6.getChildByName('checkBox');
            if (!zhua2Cb || !zhua4Cb || !zhua6Cb) {
                return;
            }
            // 抓码翻倍
            var zhuanFbNode = this.cbList['zhongniaofanbei_0'];
            if (!zhuanFbNode) {
                return;
            }
            var zhuanFbCb = zhuanFbNode.getChildByName('checkBox');
            if (!zhuanFbCb) {
                return;
            }
            // 不抓码
            var buzhuama = this.cbList['buzhuama_0'];
            if (!buzhuama) {
                return;
            }
            var buzhuamaCb = buzhuama.getChildByName('checkBox');
            if (!buzhuamaCb) {
                return;
            }
            // 经典抓码
            var zhuamajingdian = this.cbList['zhuamajingdian_0'];
            if (!zhuamajingdian) {
                return;
            }
            var zhuamajingdianCb = zhuamajingdian.getChildByName('checkBox');
            if (!zhuamajingdianCb) {
                return;
            }
            // 159抓码
            var zhuama159 = this.cbList['zhuama159_0'];
            if (!zhuama159) {
                return;
            }
            var zhuama159Cb = zhuama159.getChildByName('checkBox');
            if (!zhuama159Cb) {
                return;
            }
            // 如果选中的是不抓码
            if (buzhuamaCb.isSelected()) {
                // zhuamaWz.setVisible(false);
                zhua1.setVisible(false);
                zhua2.setVisible(false);
                zhua4.setVisible(false);
                zhua6.setVisible(false);
                zhuanFbNode.setVisible(false);
                return;
            }
            // 如果选中的是经典抓码
            if (zhuamajingdianCb.isSelected()) {
                // zhuamaWz.setVisible(true);
                zhuanFbNode.setVisible(true);
                zhua1.setVisible(zhuanFbCb.isSelected());
                zhua2.setVisible(!zhuanFbCb.isSelected());
                zhua4.setVisible(!zhuanFbCb.isSelected());
                zhua6.setVisible(!zhuanFbCb.isSelected());
                return;
            }
            // 如果选中的是159抓码
            if (zhuama159Cb.isSelected()) {
                // zhuamaWz.setVisible(true);
                zhua1.setVisible(false);
                zhua2.setVisible(true);
                zhua4.setVisible(true);
                zhua6.setVisible(true);
                zhuanFbNode.setVisible(false);
            }
        },

        /**
         * 弹出框
         */
        handlePopup: function () {
            for (var id in this.cbList) {
                if (this.cbList.hasOwnProperty(id)) {
                    var cb = this.cbList[id];
                    var userData = cb.getUserData();
                    if (userData.isPopup) {
                        //依赖父节点显示
                        var depName = userData.depName;
                        if (_.isString(depName)) depName = [depName];
                        var parentFlag = false;
                        for (var s = 0; s < depName.length; s++) {
                            if (this.cbList[depName[s]] && this.cbList[depName[s]].getChildByName('checkBox') &&
                                this.cbList[depName[s]].getChildByName('checkBox').isSelected()) {
                                parentFlag = true;
                                break;
                            }
                        }
                        var checkBox = cb.getChildByName('checkBox');
                        if (checkBox && parentFlag) {
                            cb.setVisible(checkBox.isSelected());
                        }
                        //处理互斥
                        var mutexFieldName = userData.mutexField;
                        if (mutexFieldName) {
                            if (_.isString(mutexFieldName)) mutexFieldName = [mutexFieldName];
                            var isMutex = false;
                            for (var s = 0; s < mutexFieldName.length; s++) {
                                if (this.cbList[mutexFieldName[s]] && this.cbList[mutexFieldName[s]].getChildByName('checkBox') &&
                                    this.cbList[mutexFieldName[s]].getChildByName('checkBox').isSelected()) {
                                    isMutex = true;
                                    break;
                                }
                            }
                            var checkBox = cb.getChildByName('checkBox');
                            if (checkBox && isMutex) {
                                cb.setVisible(false);
                            }
                        }
                    }
                }
            }
        },

        /**
         * 取得特殊玩法(这里做强行匹配，以后再想更好的方法)
         * @param key
         * @param desp
         */
        getSpecialDesp: function (key, desp) {
            var ret;
            switch (key) {
                case 'jushu':
                case 'rounds':
                    ret = '局数: ' + desp;
                    break;
                case 'siren':
                case 'sanrenwan':
                case 'liangrenwan':
                    ret = '人数: ' + desp;
                    break;
                case 'zhaniao':
                    ret = '抓码: ' + desp;
                    break;
                case 'Difen':
                    ret = '底分: ' + desp;
                    break;
                case 'BeiShu':
                    ret = '最大抢庄: ' + desp;
                    break;
                case 'MaxTuizhu':
                    ret = '推注: ' + desp;
                    break;
                default:
                    ret = desp;
                    break;
            }
            return ret;
        },

        /**
         * 胡子和牛牛有一堆特殊map值需要生成，在这里统一处理
         * @param key
         * @param desp
         */
        generateExtraDespMap: function (key, desp) {
            if (EXTRA_DESP_MAP.hasOwnProperty(key)) {
                mRoom.wanfaMap[EXTRA_DESP_MAP[key]] = desp;
            }
        },

        /**
         * 生成特殊参数
         * @param key
         * @param desp
         */
        generateSpecialGz: function (key, desp) {
            if (_.indexOf(SPECIAL_GZ_MAP, key)) {
                mRoom.special_gz.push(desp);
            }
        },

        /**
         * todo 这里之后一定要改！！！
         * 生成玩法参数（又是奇怪的参数，以后希望和mapid统一）
         */
        generateSpecialWanfa: function () {
            var key = findKey(MAP_ID, mRoom.wanfaMap.mapid);
            if (key) {
                mRoom.wanfaMap.wanfa = MAP_ID_2_WANFA[key];
            }
            // 牛牛一堆特殊的判断(实在摘不出去了,这些判断太JB傻了)
            if (mRoom.wanfaMap.mapid == MAP_ID.DN) {
                if (!mRoom.wanfaMap.Players) {
                    mRoom.wanfaMap.Players = 'liu';
                }
                if (mRoom.wanfaMap.Players == 'jiu') {
                    mRoom.wanfaMap.mapid = MAP_ID.DN_JIU_REN;
                }
                if (mRoom.wanfaMap.AlwaysTui) {
                    mRoom.wanfaMap.mapid = MAP_ID.DN_AL_TUI;
                    mRoom.wanfaMap.DisableHeiqiang = false;
                }
                mRoom.wanfaMap.Beilv = 'zhuzhou';
                if (mRoom.wanfaMap.noColor) {
                    mRoom.wanfaMap.mapid = MAP_ID.DN_WUHUA_CRAZY;
                    mRoom.wanfaMap.Beilv = 'wuhua';
                }
                if (mRoom.wanfaMap.crazy) {
                    mRoom.wanfaMap.mapid = 4002;
                    mRoom.wanfaMap.Beilv = 'crazy';
                }
                if (mRoom.wanfaMap.AA || mRoom.wanfaMap.ChipInType == 1 || mRoom.wanfaMap.ChipInOnce == 1) {
                    mRoom.wanfaMap.Is_ztjr = false;
                } else {
                    if (gameData.opt_conf && gameData.opt_conf.isztjr_0 == 1) {
                        mRoom.wanfaMap.Is_ztjr = false;
                    } else {
                        // mRoom.wanfaMap.Is_ztjr = !mRoom.wanfaMap.Is_ztjr;
                        mRoom.wanfaMap.Is_ztjr = !mRoom.wanfaMap.isztjr;
                        delete  mRoom.wanfaMap.isztjr;
                    }
                }
                if (mRoom.wanfaMap.name == '明牌抢庄') {
                    mRoom.wanfaMap.Preview = 'si';
                }
                if (mRoom.wanfaMap.Preview && mRoom.wanfaMap.Preview.length > 0) {
                    mRoom.wanfaMap.Cuopai = !mRoom.wanfaMap.Cuopai;
                } else {
                    delete  mRoom.wanfaMap.Cuopai;
                }
            } else if (mRoom.wanfaMap.mapid == MAP_ID.ZJH) {
                if (mRoom.wanfaMap.yunxujiaru == null || mRoom.wanfaMap.yunxujiaru == undefined) {
                    mRoom.wanfaMap.yunxujiaru = true;
                }
                if (mRoom.wanfaMap.withOnLookers == null || mRoom.wanfaMap.withOnLookers == undefined) {
                    mRoom.wanfaMap.withOnLookers = true;
                }
                // mRoom.wanfaMap.withOnLookers = true;
                if (mRoom.wanfaMap.AA) {
                    mRoom.wanfaMap.yunxujiaru = false;
                    if (mRoom.wanfaMap.desp) mRoom.wanfaMap.desp += ',禁止中途加入';
                }
                //弃牌时间 > 0 zidongqipai 传 true  否则  传false
                mRoom.wanfaMap.zidongqipai = (mRoom.wanfaMap.qipaishijian > 0);
            } else if (mRoom.wanfaMap.mapid == MAP_ID.EPZ) {
                if (mRoom.wanfaMap.yunxujiaru == null || mRoom.wanfaMap.yunxujiaru == undefined) {
                    mRoom.wanfaMap.yunxujiaru = true;
                }
                if (mRoom.wanfaMap.withOnLookers == null || mRoom.wanfaMap.withOnLookers == undefined) {
                    mRoom.wanfaMap.withOnLookers = true;
                }
            }else if (mRoom.wanfaMap.mapid == MAP_ID.PK_13S){
                if(mRoom.wanfaMap.yanse!=1){
                    mRoom.wanfaMap.firsttonghuashun = undefined;
                    mRoom.wanfaMap.desp = mRoom.wanfaMap.desp.replace('同花顺>铁枝','')
                    mRoom.wanfaMap.desp = mRoom.wanfaMap.desp.replace('铁枝>同花顺','')
                    // mRoom.wanfaMap.mapai = this.wanfaData[window.MAPAI_13SHUI_IDX][1][0][1];

                }
            }
        }
    });
})(window);
