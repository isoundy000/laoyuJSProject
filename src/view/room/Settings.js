/**
 * Created by zhangluxin on 16/7/5.
 */
var Settings = {
    init: function () {
        var that = this;
        addModalLayer(this);
        // this.setPositionX(cc.winSize.width/2 - 1280/2);

        if(!window.sensorLandscape)getUI(this, 'main').setRotation(-90);

        this.slider_yinxiao = getUI(this, 'slider_yinxiao');
        this.slider_yinyue = getUI(this, 'slider_yinyue');

        this.btn_close = getUI(this, 'btn_close');
        this.bg = getUI(this, 'bg');
        this.bg2 = getUI(this, 'bg2');
        this.title_set = getUI(this, 'title_set');

        this.jingyin_cb = getUI(this, 'jingyin_btn');
        this.biaoqing_btn = getUI(this, 'biaoqing_btn');
        this.music_btn = getUI(this, 'music_btn');
        this.yinxiao_btn = getUI(this, 'yinxiao_btn');
        this.set_topbg = getUI(this, 'set_topbg');
        this.panel = getUI(this, 'panel');
        this.btn_logout = getUI(this, 'btn_logout');
        this.sound_panel = getUI(this, 'sound_panel');
        this.scene_panel = getUI(this, 'scene_panel');
        this.tab_sound_choose = getUI(this, 'tab_sound_choose');
        this.tab_scene_choose = getUI(this, 'tab_scene_choose');
        this.hua_common = getUI(this, 'hua_common');
        this.Text_common = getUI(this, 'Text_common');
        this.hua_youxian = getUI(this, 'hua_youxian');
        this.Text_youxian = getUI(this, 'Text_youxian');
        this.hua_changsha = getUI(this, 'hua_changsha');
        this.Text_changsha = getUI(this, 'Text_changsha');
        this.hua_sichuan = getUI(this, 'hua_sichuan');
        this.Text_sichuan = getUI(this, 'Text_sichuan');

        this.nusicNode = getUI(this, 'nusicNode');
        this.soundNode = getUI(this, 'soundNode');

        this.initSoundPanel();
        this.initScenePanel();

        //声音 背景 设置 set_topbg
        this.tab = 0;
        TouchUtils.setOnclickListener(getUI(this, 'set_topbg'), function () {
            var tab = 0;
            if (that.tab == 0) {
                tab = 1;
            } else {
                tab = 0;
            }
            that.tab = tab;
            that.changeTab(tab);
        }, { effect: TouchUtils.effects.NONE, sound: 'tab' });
        TouchUtils.setOnclickListener(this.tab_sound_choose, function () {
            that.changeTab(0);
        });
        TouchUtils.setOnclickListener(this.tab_scene_choose, function () {
            that.changeTab(1);
        });

        this.parentType = '';  //从那个界面打开的窗口 "room"，"penghuzi"，"niuniu"
        this.gameType = '';
        this.parent = null;

        AgoraUtil.hideAllVideo();

        var root = getUI(this, 'root');
        popShowAni(root, true);

        getUI(this, 'ver').setString(window.curVersion);
        getUI(this, 'ver').setVisible(!window.inReview);
    },
    //改变玩法标签
    changeType: function (tab) {
        var that = this;

        if (tab == 'huzigame') {  //胡子
            this.gameType = 'huzigame';
            that.changeTab(0);
        } else if (tab == 'niuniugame') { //牛牛
            this.gameType = 'niuniugame';
            that.changeTab(0);
        } else if (tab == 'majianggame') { //麻将
            this.gameType = 'majianggame';
            that.changeTab(0);
        } else if (tab == 'room') { //大厅
            this.gameType = 'room';
            that.changeTab(0);
        } else if (tab == 'pdk') {
            this.gameType = 'pdk';
            that.changeTab(0);
        } else if (tab == 'pdk_jbc') {
            this.gameType = 'pdk_jbc';
            that.changeTab(0);
        } else if (tab == 'zjh') {
            this.gameType = 'zjh';
            that.changeTab(0);
        } else if (tab == 'kaokao') {
            this.gameType = 'kaokao';
            that.changeTab(0);
        } else if (tab == 'epz') {
            this.gameType = 'epz';
            that.changeTab(0);
        }
    },
    //改变选择类型标签
    changeTab: function (tab) {
        this.sound_panel.setVisible(tab == 0);
        if (this.gameType == 'huzigame') {
            this.nusicNode.setVisible(true);
            this.soundNode.setVisible(true);
            this.hua_youxian.setVisible(true);
            this.Text_youxian.setVisible(true);

            this.hua_changsha.setVisible(false);
            this.Text_changsha.setVisible(false);
        } else if (this.gameType == 'majianggame') {
            this.nusicNode.setVisible(true);
            this.soundNode.setVisible(true);
            this.hua_youxian.setVisible(false);
            this.Text_youxian.setVisible(false);

            this.hua_changsha.setVisible(true);
            this.Text_changsha.setVisible(true);

            this.hua_sichuan.setVisible(false);
            this.Text_sichuan.setVisible(false);
            if (window.paizhuo == 'majiang_sc') {
                this.hua_common.setVisible(true);
                this.Text_common.setVisible(true);
                this.hua_changsha.setVisible(false);
                this.Text_changsha.setVisible(false);
                this.hua_sichuan.setVisible(true);
                this.Text_sichuan.setVisible(true);
            }
        } else if (this.gameType == 'niuniugame') {
            this.nusicNode.setPositionX(480);
            this.nusicNode.setVisible(true);
            this.soundNode.setVisible(false);
        } else if (this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'zjh' || this.gameType == 'kaokao' || this.gameType == 'epz') {
            //this.sound_panel.setPositionX(150);
            this.nusicNode.setVisible(false);
            this.soundNode.setVisible(false);

            getUI(this, 'set_yinyue_7').setPositionX(220);
            getUI(this, 'set_yinxiao_6').setPositionX(220);
            getUI(this, 'set_jingyin_5').setPositionX(220);
            getUI(this, 'set_hudongbiaoqing').setPositionX(220);
            getUI(this, 'music_btn').setPositionX(400);
            getUI(this, 'yinxiao_btn').setPositionX(400);
            getUI(this, 'jingyin_btn').setPositionX(400);
            getUI(this, 'biaoqing_btn').setPositionX(400);
        }
        else if (this.gameType == 'pdk_jbc') {
            this.nusicNode.setVisible(false);
            this.soundNode.setVisible(false);

            getUI(this, 'set_yinyue_7').setPositionX(220);
            getUI(this, 'set_yinxiao_6').setPositionX(220);
            getUI(this, 'set_jingyin_5').setPositionX(220);
            getUI(this, 'set_hudongbiaoqing').setPositionX(220);
            getUI(this, 'music_btn').setPositionX(400);
            getUI(this, 'yinxiao_btn').setPositionX(400);
            getUI(this, 'jingyin_btn').setPositionX(400);
            getUI(this, 'biaoqing_btn').setPositionX(400);

            getUI(this, 'biaoqing_btn').setVisible(false);
            getUI(this, 'set_hudongbiaoqing').setVisible(false);
        }
        this.tab_scene_choose.setVisible(!(this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh' || this.gameType == 'kaokao'));
        this.tab_sound_choose.setVisible(!(this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh' || this.gameType == 'kaokao'));
        this.bg.setVisible((this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh' || this.gameType == 'kaokao'));
        this.bg2.setVisible(!(this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh' || this.gameType == 'kaokao'));
        this.btn_close.setPositionX((this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh' || this.gameType == 'kaokao') ? 900 : 1000);
        this.title_set.setVisible((this.gameType == 'room' || this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh' || this.gameType == 'kaokao'));
        this.refreshSound();
        //桌面场景的初始化
        this.scene_panel.setVisible(tab == 1);
        this.refreshScene();

        //按钮状态的初始化
        if (tab == 1) {
            this.tab_sound_choose.getChildByName('on').setVisible(false);
            this.tab_scene_choose.getChildByName('on').setVisible(true);

            this.btn_logout.setVisible(false);
        } else {
            this.tab_sound_choose.getChildByName('on').setVisible(true);
            this.tab_scene_choose.getChildByName('on').setVisible(false);

            this.btn_logout.setVisible(false);
        }

    },
    initSoundPanel: function () {
        var that = this;

        //退出游戏 此按钮功能已经禁用
        // TouchUtils.setOnclickListener(this.btn_logout, function () {
        //     cc.sys.localStorage.removeItem('wxToken');
        //     HUD.showScene(HUD_LIST.Login, that);
        // });

        TouchUtils.setOnclickListener(getUI(this.sound_panel, 'music1'), function () {
            that.changeBgm(1);
        });
        TouchUtils.setOnclickListener(getUI(this.sound_panel, 'music2'), function () {
            that.changeBgm(2);
        });
        TouchUtils.setOnclickListener(getUI(this.sound_panel, 'music3'), function () {
            that.changeBgm(3);
        });

        var musicvoice = cc.sys.localStorage.getItem('musicvoice') || '1';
        // that.music_btn.setTexture((musicvoice == "1") ? res.setting_on_png : res.setting_off_png);
        // that.music_btn.getChildByName("setting_doudou").setPositionX((musicvoice == "1") ? 95 : 25);
        // that.music_btn.getChildByName("setting_doudou").setPositionY((musicvoice == "1") ? 44 / 2 : 56 / 2);
        // this.music_btn.getChildByName("setting_doudou").setTexture((musicvoice == "1") ? res.setting_on_png : res.setting_on2_png);
        // this.music_btn.getChildByName("setting_doudou").setPositionX((musicvoice == "1") ? 57:152);
        TouchUtils.setOnclickListener(this.music_btn, function () {
            if (musicvoice == '1') {
                musicvoice = '0';
                cc.sys.localStorage.setItem('yinyuePrecent', 0);
                // that.music_btn.getChildByName("setting_doudou").setTexture(res.setting_on2_png);
            } else {
                musicvoice = '1';
                cc.sys.localStorage.setItem('yinyuePrecent', 100);
                // that.music_btn.getChildByName("setting_doudou").setTexture(res.setting_on_png);
            }
            resetVolume();
            // that.music_btn.getChildByName("setting_doudou").setPositionX((musicvoice == "1") ? 57:152);
            that.music_btn.getChildByName('setting_doudou').setVisible(musicvoice == '1');
            cc.sys.localStorage.setItem('musicvoice', musicvoice);
        });
        that.music_btn.getChildByName('setting_doudou').setVisible(musicvoice == '1');

        var yinxiaovoice = cc.sys.localStorage.getItem('yinxiaovoice') || '1';
        // that.yinxiao_btn.setTexture((yinxiaovoice == 1) ? res.setting_on_png : res.setting_off_png);
        // that.yinxiao_btn.getChildByName("setting_doudou").setPositionX((yinxiaovoice == "1") ? 95 : 25);
        // that.yinxiao_btn.getChildByName("setting_doudou").setPositionY((yinxiaovoice == "1") ? 44 / 2 : 56 / 2);
        // this.yinxiao_btn.getChildByName("setting_doudou").setTexture((yinxiaovoice == "1") ? res.setting_on_png : res.setting_on2_png);
        // this.yinxiao_btn.getChildByName("setting_doudou").setPositionX((yinxiaovoice == "1") ? 57:152);
        TouchUtils.setOnclickListener(this.yinxiao_btn, function () {
            if (yinxiaovoice == '1') {
                yinxiaovoice = '0';
                cc.sys.localStorage.setItem('yinxiaoPrecent', 0);
                // that.yinxiao_btn.getChildByName("setting_doudou").setTexture(res.setting_on2_png);
            } else {
                yinxiaovoice = '1';
                cc.sys.localStorage.setItem('yinxiaoPrecent', 100);
                // that.yinxiao_btn.getChildByName("setting_doudou").setTexture(res.setting_on_png);
            }
            resetVolume();
            // that.yinxiao_btn.getChildByName("setting_doudou").setPositionX((yinxiaovoice == "1") ? 57:152);
            that.yinxiao_btn.getChildByName('setting_doudou').setVisible(yinxiaovoice == '1');
            cc.sys.localStorage.setItem('yinxiaovoice', yinxiaovoice);
        });
        that.yinxiao_btn.getChildByName('setting_doudou').setVisible(yinxiaovoice == '1');

        //互动表情
        // this.biaoqing_btn.getChildByName("setting_doudou").setTexture((gameData.biaoQingFlag == 1) ? res.setting_on_png : res.setting_on2_png);
        // this.biaoqing_btn.getChildByName("setting_doudou").setPositionX((gameData.biaoQingFlag == 1) ? 57:152);
        TouchUtils.setOnclickListener(this.biaoqing_btn, function () {
            if (gameData.biaoQingFlag == 0) {//关闭
                gameData.biaoQingFlag = 1;
                cc.sys.localStorage.setItem('biaoqing', '1');
                // that.biaoqing_btn.getChildByName("setting_doudou").setTexture(res.setting_on_png);
            } else {
                gameData.biaoQingFlag = 0;
                cc.sys.localStorage.setItem('biaoqing', '0');
                // that.biaoqing_btn.getChildByName("setting_doudou").setTexture(res.setting_on2_png);
            }
            // that.biaoqing_btn.getChildByName("setting_doudou").setPositionX((gameData.biaoQingFlag == 1) ? 57:152);
            that.biaoqing_btn.getChildByName('setting_doudou').setVisible(gameData.biaoQingFlag == '1');
        });
        that.biaoqing_btn.getChildByName('setting_doudou').setVisible(gameData.biaoQingFlag == '1');

        //静音开启
        // this.jingyin_cb.getChildByName("setting_doudou").setTexture((gameData.voiceFlag == false) ? res.setting_on_png : res.setting_on2_png);
        // this.jingyin_cb.getChildByName("setting_doudou").setPositionX((gameData.voiceFlag == false) ? 57:152);
        TouchUtils.setOnclickListener(this.jingyin_cb, function () {
            if (gameData.voiceFlag == true) {//关闭
                gameData.voiceFlag = false;
                cc.sys.localStorage.setItem('jingyinopen', '0');
                // that.jingyin_cb.getChildByName("setting_doudou").setTexture(res.setting_on_png);
                if (cc.sys.isNative) jsb.AudioEngine.pauseAll();
            } else {
                playEffect('effect_on');
                gameData.voiceFlag = true;
                cc.sys.localStorage.setItem('jingyinopen', '1');
                // that.jingyin_cb.getChildByName("setting_doudou").setTexture(res.setting_on2_png);
                if (cc.sys.isNative) jsb.AudioEngine.resumeAll();

                //
                var setting_bgm = 1;
                if (this.gameType == 'huzigame') {
                    setting_bgm = cc.sys.localStorage.getItem('setting_bgm_niuniu') || 4;
                    playMusic('vbg' + setting_bgm);
                } else if (this.gameType == 'niuniugame') { //牛牛
                    setting_bgm = cc.sys.localStorage.getItem('setting_bgm') || 1;
                    playMusic('vbg' + setting_bgm);
                } else if (this.gameType == 'majianggame') { //牛牛
                    setting_bgm = cc.sys.localStorage.getItem('setting_bgm_majiang') || 1;
                    playMusic('vbg_ma' + setting_bgm);
                } else if (this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh') {
                    playMusic('vbg6');
                }
            }
            // that.jingyin_cb.getChildByName("setting_doudou").setPositionX((gameData.voiceFlag == false) ? 57:152);
            that.jingyin_cb.getChildByName('setting_doudou').setVisible(gameData.voiceFlag == '1');
        });
        that.jingyin_cb.getChildByName('setting_doudou').setVisible(gameData.voiceFlag == '1');

        //普通话
        if (window.paizhuo == 'majiang') {
            this.hua_common.setTexture((gameData.speakCSH == 0) ? res.cbn1_png : res.cbn0_png);
            this.hua_changsha.setTexture((gameData.speakCSH == 1) ? res.cbn1_png : res.cbn0_png);
        } else if (window.paizhuo == 'majiang_sc') {
            this.hua_common.setTexture((gameData.speakSiChuanH == 0) ? res.cbn1_png : res.cbn0_png);
            this.hua_sichuan.setTexture((gameData.speakSiChuanH == 1) ? res.cbn1_png : res.cbn0_png);
        } else {
            this.hua_common.setTexture((gameData.isPutonghua == 1) ? res.cbn1_png : res.cbn0_png);
            this.hua_youxian.setTexture((gameData.isPutonghua == 0) ? res.cbn1_png : res.cbn0_png);
        }
        TouchUtils.setOnclickListener(this.hua_common, function () {
            if (that.gameType == 'majianggame') {
                if (window.paizhuo == 'majiang_sc') {
                    if (gameData.speakSiChuanH == 1) {
                        gameData.speakSiChuanH = 0;
                        cc.sys.localStorage.setItem('speakSiChuanH' + gameData.mapId, gameData.speakSiChuanH);
                        that.hua_common.setTexture(res.cbn1_png);
                        that.hua_sichuan.setTexture(res.cbn0_png);
                    } else {
                        gameData.speakSiChuanH = 1;
                        cc.sys.localStorage.setItem('speakSiChuanH' + gameData.mapId, gameData.speakSiChuanH);
                        that.hua_common.setTexture(res.cbn0_png);
                        that.hua_sichuan.setTexture(res.cbn1_png);
                    }
                } else {
                    if (gameData.speakCSH == 1) {
                        gameData.speakCSH = 0;
                        cc.sys.localStorage.setItem('speakCSH', gameData.speakCSH);
                        that.hua_common.setTexture(res.cbn1_png);
                        that.hua_changsha.setTexture(res.cbn0_png);
                    } else {
                        gameData.speakCSH = 1;
                        cc.sys.localStorage.setItem('speakCSH', gameData.speakCSH);
                        that.hua_common.setTexture(res.cbn0_png);
                        that.hua_changsha.setTexture(res.cbn1_png);
                    }
                }
            } else {
                if (gameData.isPutonghua == 1) {
                    gameData.isPutonghua = 0;
                    cc.sys.localStorage.setItem('putonghua', gameData.isPutonghua);
                    that.hua_common.setTexture(res.cbn0_png);
                    that.hua_youxian.setTexture(res.cbn1_png);
                } else {
                    gameData.isPutonghua = 1;
                    cc.sys.localStorage.setItem('putonghua', gameData.isPutonghua);
                    that.hua_common.setTexture(res.cbn1_png);
                    that.hua_youxian.setTexture(res.cbn0_png);
                }
            }
        });
        TouchUtils.setOnclickListener(this.hua_youxian, function () {
            if (gameData.isPutonghua == 1) {
                gameData.isPutonghua = 0;
                cc.sys.localStorage.setItem('putonghua', gameData.isPutonghua);
                that.hua_youxian.setTexture(res.cbn1_png);
                that.hua_common.setTexture(res.cbn0_png);
            } else {
                gameData.isPutonghua = 1;
                cc.sys.localStorage.setItem('putonghua', gameData.isPutonghua);
                that.hua_youxian.setTexture(res.cbn0_png);
                that.hua_common.setTexture(res.cbn1_png);
            }
        });

        TouchUtils.setOnclickListener(this.hua_changsha, function () {
            if (gameData.speakCSH == 1) {
                gameData.speakCSH = 0;
                cc.sys.localStorage.setItem('speakCSH', gameData.speakCSH);
                that.hua_common.setTexture(res.cbn1_png);
                that.hua_changsha.setTexture(res.cbn0_png);
            } else {
                gameData.speakCSH = 1;
                cc.sys.localStorage.setItem('speakCSH', gameData.speakCSH);
                that.hua_common.setTexture(res.cbn0_png);
                that.hua_changsha.setTexture(res.cbn1_png);
            }
        });
        TouchUtils.setOnclickListener(this.hua_sichuan, function () {
            if (gameData.speakSiChuanH == 1) {
                gameData.speakSiChuanH = 0;
                cc.sys.localStorage.setItem('speakSiChuanH' + gameData.mapId, gameData.speakSiChuanH);
                that.hua_common.setTexture(res.cbn1_png);
                that.hua_sichuan.setTexture(res.cbn0_png);
            } else {
                gameData.speakSiChuanH = 1;
                cc.sys.localStorage.setItem('speakSiChuanH' + gameData.mapId, gameData.speakSiChuanH);
                that.hua_common.setTexture(res.cbn0_png);
                that.hua_sichuan.setTexture(res.cbn1_png);
            }
        });

        TouchUtils.setOnclickListener(this.btn_close, function (node) {
            // that.hide(true);
            var root = getUI(that, 'root');
            popHideAni(root, function () {
                that.removeFromParent(true);
                // that.parent = null;
                AgoraUtil.showAllVideo();
            });
        }, { sound: 'close' });
    },
    //改变背景音乐选择
    changeBgm: function (id) {
        //按钮显示
        for (var i = 1; i <= 3; i++) {
            var musicbtn = getUI(this.sound_panel, 'music' + i);
            musicbtn.setTexture((id == i) ? res.cbn1_png : res.cbn0_png);
        }
        //声音设置
        if (this.gameType == 'huzigame') {  //胡子
            cc.sys.localStorage.setItem('setting_bgm', id);
            playMusic('vbg' + id);
        } else if (this.gameType == 'niuniugame') { //牛牛
            cc.sys.localStorage.setItem('setting_bgm_niuniu', id + 3);
            playMusic('vbg' + (id + 3));
        } else if (this.gameType == 'majianggame') { //麻将
            cc.sys.localStorage.setItem('setting_bgm_majiang', id);
            playMusic('vbg_ma' + id);
        } else if (this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh') {
            playMusic('vbg6');
        }
    },
    refreshSound: function () {
        var that = this;
        if (this.gameType == 'huzigame') {
            var id = cc.sys.localStorage.getItem('setting_bgm') || 1;
            for (var i = 1; i <= 3; i++) {
                var musicbtn = getUI(this.sound_panel, 'music' + i);
                musicbtn.setTexture((id == i) ? res.cbn1_png : res.cbn0_png);
            }
            playMusic('vbg' + id);
        } else if (this.gameType == 'niuniugame') {
            var id = cc.sys.localStorage.getItem('setting_bgm_niuniu') || 4;
            for (var i = 1; i <= 3; i++) {
                var musicbtn = getUI(this.sound_panel, 'music' + i);
                musicbtn.setTexture((id - 3 == i) ? res.cbn1_png : res.cbn0_png);
            }
            playMusic('vbg' + id);
        } else if (this.gameType == 'room') {
            playMusic('vbg5');
        } else if (this.gameType == 'pdk' || this.gameType == 'pdk_jbc' || this.gameType == 'zjh') {
            playMusic('vbg6');
        }

    },
    initScenePanel: function () {
        var that = this;
        for (var i = 0; i < 4; i++) {
            (function (i) {
                var table_back = getUI(that, 'table_back' + i);
                TouchUtils.setOnclickListener(table_back, function () {
                    that.changeScene(i);
                });
            })(i);
        }
    },
    refreshScene: function () {
        var that = this;
        if (this.gameType == 'huzigame') {
            var id = cc.sys.localStorage.getItem('sceneid') || 1;

            var table_back4 = getUI(that, 'table_back3');
            table_back4.setVisible(false);
            for (var i = 0; i < 3; i++) {
                var table_back = getUI(that, 'table_back' + i);
                var choose = getUI(table_back, 'choose');

                choose.setTexture((i == id) ? res.shiyong_png : res.click_to_use_png);
                var table_back = getUI(that, 'table_back' + i);
                table_back.setTexture(res['table_back' + i + '_jpg']);
            }

            var bg = getUI(that, 'tablebg');
            bg.setTexture(res['table_back' + id + '_jpg']);
        } else if (this.gameType == 'majianggame') {
            var id = cc.sys.localStorage.getItem('sceneid_majiang') || 0;
            if (id > 3) id = id - 3;

            for (var i = 0; i < 4; i++) {
                var table_back = getUI(that, 'table_back' + i);
                var choose = getUI(table_back, 'choose');

                choose.setTexture((i == id) ? res.shiyong_png : res.click_to_use_png);
                var table_back = getUI(that, 'table_back' + i);
                table_back.setTexture(res['table_majiang_back' + i + '_jpg']);
            }

            var bg = getUI(that, 'tablebg');
            bg.setTexture(res['table_majiang_back' + (id) + '_jpg']);
        } else if (this.gameType == 'niuniugame') {
            var id = cc.sys.localStorage.getItem('sceneid_niuniu') || 0;
            if (id > 3) id = id - 3;

            for (var i = 0; i < 4; i++) {
                var table_back = getUI(that, 'table_back' + i);
                var choose = getUI(table_back, 'choose');

                choose.setTexture((i == id) ? res.shiyong_png : res.click_to_use_png);
                var table_back = getUI(that, 'table_back' + i);
                table_back.setTexture(res['table_niuniu_back' + i + '_jpg']);
            }

            var bg = getUI(that, 'tablebg');
            bg.setTexture(res['table_niuniu_back' + (id) + '_jpg']);
        } else if (this.gameType == 'epz') {
            var id = cc.sys.localStorage.getItem('sceneid_epz') || 0;
            if (id > 3) id = id - 3;

            for (var i = 0; i < 4; i++) {
                var table_back = getUI(that, 'table_back' + i);
                var choose = getUI(table_back, 'choose');

                choose.setTexture((i == id) ? res.shiyong_png : res.click_to_use_png);
                var table_back = getUI(that, 'table_back' + i);
                table_back.setTexture(res['table_epz_back' + i + '_jpg']);
            }

            var bg = getUI(that, 'tablebg');
            bg.setTexture(res['table_epz_back' + (id) + '_jpg']);
        }
    },
    changeScene: function (id) {
        var that = this;
        this.hasChange = true;
        if (this.gameType == 'huzigame') {
            cc.sys.localStorage.setItem('sceneid', id);
        } else if (this.gameType == 'majianggame') {
            cc.sys.localStorage.setItem('sceneid_majiang', id);
        } else if (this.gameType == 'niuniugame') {
            cc.sys.localStorage.setItem('sceneid_niuniu', id);
        } else if (this.gameType == 'epz') {
            cc.sys.localStorage.setItem('sceneid_epz', id);
        }
        this.refreshScene();

        if (this.parent != null && this.parent && this.parent.initBG) {
            this.parent.initBG();
        }
    },
    setSettingLayerType: function (params) {
        this.params = params;

        this.btn_logout.setVisible(false);

        if (params.hidelogout) {
            this.btn_logout.setVisible(false);
        }
    },
    //根据父级界面打开的位置初始化界面显示内容
    setparentType: function (type) {
        var that = this;
        this.parentType = type;

        if (this.parentType == 'penghuzi') {//penghuzi
            that.changeType('huzigame');
        } else if (this.parentType == 'niuniu') {//niuniu
            that.changeType('niuniugame');
        } else if (this.parentType == 'majiang') {//majiang
            that.changeType('majianggame');
        } else if (this.parentType == 'room') {//room或其他
            that.changeType('room');
        } else if (this.parentType == 'pdk') {
            that.changeType('pdk');
        } else if (this.parentType == 'pdk_jbc') {
            that.changeType('pdk_jbc');
        } else if (this.parentType == 'zjh') {
            that.changeType('zjh');
        } else if (this.parentType == 'kaokao') {
            that.changeType('kaokao');
        } else if (this.parentType == 'epz') {
            that.changeType('epz');
        }

        this.initMusicSelect();
    },
    initMusicSelect: function () {
        if (this.gameType == 'majianggame') { //麻将
            var musicmajiang = cc.sys.localStorage.getItem('setting_bgm_majiang') || 1;
            for (var i = 1; i <= 3; i++) {
                var musicbtn = getUI(this.sound_panel, 'music' + i);
                musicbtn.setTexture((musicmajiang == i) ? res.cbn1_png : res.cbn0_png);
            }
        }
    },
    setSetting: function (room, szType) {
        if (room) this.parent = room;
        var that = this;
        that.setparentType(szType);

        //如果是房主,未开始之前,不显示解散房间
        if (room.isStart == false) {
            //房主
            this.setSettingLayerType({ hidejiesan: true, hidelogout: true });
        } else {
            this.setSettingLayerType({ hidelogout: true });
        }
    }
};
