var showLayer = function (name, args) {
    var layer = new window[name](args);
    layer.x = cc.winSize.width / 2;
    layer.y = cc.winSize.height / 2;
    layer.ignoreAnchorPointForPosition(false);
    cc.director.getRunningScene().addChild(layer);
    return layer;
};
/**
 * 添加屏蔽层
 * @public
 * */
var addModalLayer = function (target) {
    var modalLayer = new ccui.Layout();
    modalLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    modalLayer.setBackGroundColor(cc.color('#1A1A1A'));
    modalLayer.setSwallowTouches(true);
    modalLayer.setTouchEnabled(true);
    modalLayer.setContentSize(cc.winSize);
    modalLayer.setAnchorPoint(cc.p(0.5, 0.5));
    modalLayer.x = target.width / 2;
    modalLayer.y = target.height / 2;
    modalLayer.ignoreAnchorPointForPosition(false);
    modalLayer.setBackGroundColorOpacity(Math.floor(255 * 0.6));
    target.addChild(modalLayer, -1);
};
// 带适配的
var loadNodeCCS = function (res, target, rootName, hideMask) {
    var mainscene = ccs.load(res, 'res/');
    // if (res == res.Home_json) {
    mainscene.node.setAnchorPoint(cc.p(0.5, 0.5));
    mainscene.node.ignoreAnchorPointForPosition(false);
    mainscene.node.x = cc.winSize.width / 2;
    mainscene.node.y = cc.winSize.height / 2;
    // }
    if (!hideMask) {
        addModalLayer(mainscene.node);
    }
    target.addChild(mainscene.node);

    if (rootName && _.isString(rootName)) {
        var interval = null;
        var checkFunc = function () {
            if (!checkAllNodesValid(target.getChildByName(rootName)))
                return;
            clearInterval(interval);
            interval = null;

            var ret = true;
            if (target.getBeforeOnCCSLoadFinish && target.getBeforeOnCCSLoadFinish())
                ret = target.getBeforeOnCCSLoadFinish()();
            if (ret && target.onCCSLoadFinish) {
                target.onCCSLoadFinish.call(target);
            }
        };
        interval = setInterval(checkFunc, 1);
        checkFunc();
    }

    return mainscene;
};
var CoverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new CoverLayer();
        // layer.setPositionX(cc.winSize.width/2  - 1280/2);
        this.addChild(layer);

        // for test
        //window.maLayer = layer;

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;
    },
    ctor: function (returnRoomId, club_id) {
        this._super();

    },
    onExit: function () {
        this._super();
    }
});
var MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new MainLayer(this._clubid, this._frommatch);
        window.maLayer = layer;
        this.addChild(layer);

        // for test
        window.mScene = layer;

        var tipLayer = new cc.Layer();
        layer.addChild(tipLayer, 1000);
        HUD.tipLayer = tipLayer;

        var loadingLayer = new cc.Layer();
        layer.addChild(loadingLayer, 2000);
        HUD.loadingLayer = loadingLayer;
    },
    ctor: function (clubid, frommatch) {
        this._super();
        this._clubid = clubid;
        this._frommatch = frommatch;

    },
    onExit: function () {
        this._super();
    }
});

var HUD = {
    loadingCount: 0,
    layer: null,
    init: function () {
    },

    showScene: function (hud) {
        if (hud) {
            if (hud.id == HUD_LIST_pro.Home) {
                cc.director.runScene(new MainScene());
            } else if (hud.id == HUD_LIST_pro.Login) {
                cc.director.runScene(new CoverScene());
            }
        }
    },
    // showScene2: function (hud, oldLayer, popLayer) {
    //     var newScene = new cc.Scene();
    //     newScene.onEnter = function () {
    //         cc.Scene.prototype.onEnter.call(this);
    //         // console.log("11111--- " + hud.ccs);
    //         var layer = load_ccs(hud.ccs, hud.cls);
    //         this.layer = layer;
    //         //  一定要判断是数字
    //         if (hud && hud.id && _.isNumber(hud.id)) {
    //             layer.setTag(hud.id);
    //         }
    //
    //         if (hud && hud.ccs && hud.ccs == 'home/Home') {
    //             layer.setName('home');
    //             window.maLayer = layer;
    //         }
    //
    //         // console.log("========"+layer+"========"+hud.ccs);
    //         layer.setAnchorPoint(cc.p(0.5, 0.5));
    //         layer.x = cc.winSize.width / 2;
    //         layer.y = cc.winSize.height / 2;
    //         this.addChild(layer);
    //
    //         if (popLayer != null) {
    //             layer.addChild(popLayer, 1);
    //         }
    //
    //         var tipLayer = new cc.Layer();
    //         layer.addChild(tipLayer, 1000);
    //         HUD.tipLayer = tipLayer;
    //
    //         var loadingLayer = new cc.Layer();
    //         layer.addChild(loadingLayer, 2000);
    //         HUD.loadingLayer = loadingLayer;
    //         // console.log("22222--- " + hud.ccs);
    //         layer.init();
    //         // console.log("333333--- " + hud.ccs);
    //         if (oldLayer != null) {
    //             oldLayer.removeFromParent(true);
    //         }
    //     };
    //
    //     newScene.onExit = function () {
    //         //cc.log("new scene ------- ", sceneName);
    //         if (this.layer && cc.sys.isObjectValid(this.layer) && this.layer.exit && _.isFunction(this.layer.exit)) {
    //             this.layer.exit();
    //         }
    //         cc.Scene.prototype.onExit.call(this);
    //         this.removeAllChildren(true);
    //     };
    //     cc.director.runScene(newScene);
    // },

    getLayerById: function (name) {
        var scene = cc.director.getRunningScene();
        var layer = scene.getChildByName(name);
        if (layer) {
            return layer;
        }
        return null;

    },

    getTipLayer: function () {
        return HUD.tipLayer;
    },

    getMainPage: function () {
        return HUD.mainContent;
    },

    getSubContent: function () {
        return HUD.subContent;
    },

    getTopContent: function () {
        return HUD.topContent;
    },

    showLoading: function (content, nothide) {
        // if (HUD.loadingLayer == null){
        //     var loadingLayer = new cc.Layer();
        //     var scene = cc.director.getRunningScene();
        //     scene.addChild(loadingLayer, 2000);
        //     HUD.loadingLayer = loadingLayer;
        // }
        // if(HUD.loadingLayer.getChildByName("loading") == null) {
        //     var loading = HUD.showLayer(HUD_LIST.Loading, HUD.loadingLayer);
        //     loading.setName("loading");
        // }
        cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
            var loadingLayer = cc.director.getRunningScene().getChildByName('loading');
            if (!loadingLayer) {
                loadingLayer = new Loading();
                loadingLayer.setName('loading');
                cc.director.getRunningScene().addChild(loadingLayer, 1000);
            }
            loadingLayer.setContent(content);
            loadingLayer.setVisible(true);

            if (!nothide) {
                setTimeout(function () {
                    if (loadingLayer && cc.sys.isObjectValid(loadingLayer)) {
                        loadingLayer.removeFromParent();
                    }
                }, 20000);
            }
        }, 0);

    },
    removeLoading: function () {
        // if (HUD.loadingLayer && HUD.loadingLayer.getChildByName("loading")){
        //     HUD.loadingLayer.removeAllChildren();
        // }
        cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
            var loadingLayer = cc.director.getRunningScene().getChildByName('loading');
            if (loadingLayer) {
                loadingLayer.setVisible(false);
            }
        }, 0);
    },

    showMainContent: function (hud, index) {
        HUD.mainContent.nContent.removeAllChildren();
        if (index == null) index = 0;
        HUD.mainContent._index = index;
        return HUD.showLayer(hud, HUD.mainContent.nContent);
    },

    showLayer: function (hud, parent, isNoAnimation, isTip) {
        var time1 = Date.now();

        var layer = load_ccs(hud.ccs, hud.cls);
        if (parent != null) {
            // if (isTip != null) {
            layer.setAnchorPoint(0.5, 0.5);
            layer.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);

            // }
            if (isNoAnimation != null)
                layer.show(parent);
            parent.addChild(layer);
        }
        if (layer.init != null)
            layer.init();
        return layer;
    },

    createTableCell: function (hud, parent) {
        var layer = load_ccs(hud.ccs, hud.cls);
        if (parent != null) {
            parent.addChild(layer);
            parent.node = layer;
        }
        if (layer.init != null)
            layer.init();
        return layer;
    },

    getTableCell: function (hud, p) {
        var node = p.clone();
        var ccsCls = hud.cls;
        if (ccsCls != null) {
            for (var key in ccsCls) {
                node[key] = ccsCls[key];
            }
        }
        return node;
    },

    //norepeat 是否重复
    showMessage: function (msg, norepeat) {
        if (norepeat) {
            var toast = HUD.getTipLayer().getChildByName('toast');
            if (toast) {
                return;
            }
        }
        var toast = new ccui.Scale9Sprite('res/image/ui/common/bg_message.png');
        toast.setPreferredSize(cc.size(612, 55));
        toast.setName('toast');
        HUD.getTipLayer().addChild(toast);

        var txt = new ccui.Text();
        txt.setString(msg);
        txt.setFontSize(28);
        txt.setColor(cc.color(253, 205, 35));
        txt.setPosition(306, 28);
        txt.setName('txt');
        toast.addChild(txt, 1);

        toast.setPosition(cc.p(1280 * 0.5, SH * 0.5 + 230));

        var moveTo = cc.moveBy(1.5, cc.p(0, 50));
        var delay = cc.delayTime(1.0);
        var fadeOut = cc.fadeOut(0.5);
        var seq = cc.sequence(delay, fadeOut);
        var act = cc.spawn(moveTo, seq);
        var clean = cc.removeSelf();
        var actSeq = cc.sequence(act, clean);
        toast.runAction(actSeq);

        // toast.setGlobalZOrder(100);
    },

    showMessageBox: function (title, msg, callFunc, hideCancel) {
        var layer = HUD.showLayer(HUD_LIST.MessageBox, HUD.getTipLayer(), null, true);
        layer.setName('MessageBox');
        layer.setData(title, msg, callFunc, hideCancel);
        return layer;
    },
    showConfirmBox: function (title, msg, confirmFunc, confirmText, cancelFunc, cancelText) {
        if (HUD.getTipLayer().getChildByName('MessageBox')) {
            return;
        }
        var layer = HUD.showLayer(HUD_LIST.MessageBox, HUD.getTipLayer(), null, true);
        layer.setName('MessageBox');
        layer.setConfirmData(title, msg, confirmFunc, confirmText, cancelFunc, cancelText);
        return layer;
    },

    showFriendMessage: function (other) {
        var tip = HUD.showLayer(HUD_LIST.Tip_Message, HUD.getTipLayer(), null, true);
        tip.setData(other);
    },

    showItemInfo: function (itemId, data, pos, ownerId) {
        var layer;
        var typ = mItem.getItemTypeById(itemId);
        switch (typ) {
            case mProto.EntityType.EntitySpirit:            //NPC
                layer = HUD.showLayer(HUD_LIST.Tip_Npc, HUD.getTipLayer(), null, true);
                break;
            case mProto.EntityType.EntityMagic:             //Magic
                layer = HUD.showLayer(HUD_LIST.Tip_Magic, HUD.getTipLayer(), null, true);
                break;
            case mProto.EntityType.EntityEquip:             //Equip
                layer = HUD.showLayer(HUD_LIST.Tip_Equip, HUD.getTipLayer(), null, true);
                break;
            case mProto.EntityType.Coin:
            case mProto.EntityType.Dollar:
            case mProto.EntityType.Merit:
            case mProto.EntityType.ArenaScore:
            case mProto.EntityType.Exp:
            case mProto.EntityType.EntityItem:              //Item
                layer = HUD.showLayer(HUD_LIST.Tip_Item, HUD.getTipLayer(), null, true);
                break;
            case mProto.EntityType.EntityHorse:             //Horse
                layer = HUD.showLayer(HUD_LIST.Tip_Horse, HUD.getTipLayer(), null, true);
                break;
            case mProto.EntityType.EntityActor:             //Actor
                break;
            default:                                       //Monster
                break;
        }
        if (layer != null) {
            layer.setData(itemId, data, pos, ownerId);
        }
    },

    showAwards: function (awardList) {
        if (awardList == null || awardList.length == 0) return;

        var infoLayer = null;
        if (awardList.length == 1) {
            infoLayer = HUD.showLayer(HUD_LIST.Tip_Award2, HUD.getTipLayer(), null, true);
        } else {
            infoLayer = HUD.showLayer(HUD_LIST.Tip_Award, HUD.getTipLayer(), null, true);
        }
        infoLayer.setWithAwardData(awardList);
        return infoLayer;
    },

    showAwardsByString: function (awardToString) {
        //var awardToString = Config.XItem[itemId].awardToString;
        var listAwardString = awardToString.toString().split('|');
        if (listAwardString.length == 0) return;

        var infoLayer = null;
        if (listAwardString.length == 1) {
            infoLayer = HUD.showLayer(HUD_LIST.Tip_Award2, HUD.getTipLayer(), null, true);
        } else {
            infoLayer = HUD.showLayer(HUD_LIST.Tip_Award, HUD.getTipLayer(), null, true);
        }
        infoLayer.setWithStringList(listAwardString);
    },

    showBattle: function () {
        HUD.getTopContent().removeAllChildren();
        HUD.showLayer(HUD_LIST.BattleField, HUD.getTopContent());
    },

    showLevelUp: function () {
        if (DD[T.LevelUpAward] != null) {
            var delay = cc.delayTime(0.5);
            var callFunc = cc.callFunc(function () {
                if (mBattle.IsInBattle != true && mRole.IsWishing != true) {
                    HUD.showLayer(HUD_LIST.Tip_LevelUp, HUD.getTipLayer(), false, true);
                }
            });
            var act = cc.sequence(delay, callFunc);
            HUD.getTipLayer().stopAllActions();
            HUD.getTipLayer().runAction(act);
        }
    },

    showPowerChange: function () {
        if (DD[T.PowerChange] != null) {
            var delay = cc.delayTime(0.3);
            var callFunc = cc.callFunc(function () {
                if (mBattle.IsInBattle != true && mRole.IsWishing != true) {
                    var value = DD[T.PowerChange];
                    cc.spriteFrameCache.addSpriteFrames('res/image/ui/common/powerChangeRes.plist');
                    var node = new cc.Node();
                    var spr = new cc.Sprite();
                    var numberMap = '';
                    if (value > 0) {
                        spr.initWithSpriteFrameName('ui_shuxin_shenglishangshang.png');
                        numberMap = 'res/image/ui/common/disable/ui_shuxin_shuzishangsheng.png';
                    }
                    else {
                        spr.initWithSpriteFrameName('ui_shuxin_shenglixiajiang.png');
                        numberMap = 'res/image/ui/common/disable/ui_shuxin_shuzixiajiang.png';
                    }
                    spr.setAnchorPoint(0, 0.5);
                    node.addChild(spr);

                    var strValue = '/' + Math.abs(value);
                    var number = new cc.LabelAtlas(strValue, numberMap, 29, 41, '/');
                    var size = number.getContentSize();
                    number.setAnchorPoint(0, 0.5);
                    number.setPosition(100, 0);
                    node.addChild(number);

                    node.setPosition(SW * 0.5 - (100 + size.width) * 0.5, SH * 0.5);
                    var tipLayer = HUD.getTipLayer();
                    tipLayer.addChild(node);

                    var moveTo1 = cc.moveBy(0.05, cc.p(0, -15));
                    var moveTo2 = cc.moveBy(0.1, cc.p(0, 15));
                    var delay = cc.delayTime(1.0);
                    var clean = cc.removeSelf();
                    var actSeq = cc.sequence(moveTo1, moveTo2, delay, clean);
                    node.runAction(actSeq);
                    DD[T.PowerChange] = null;

                    if (value > 0)
                        AudioEngine.playEffect(res_sound_root + 'ui/evolution.mp3');
                    else
                        AudioEngine.playEffect(res_sound_root + 'ui/se_scoutrush_lose.mp3');
                }
            });
            var act = cc.sequence(delay, callFunc);
            HUD.getTipLayer().stopAllActions();
            HUD.getTipLayer().runAction(act);
        }
    },

    showBoard: function () {
        var boards = DD[T.Board];
        if (boards != null && boards.length > 0) {
            for (var i = 0; i < boards.length; i++) {
                var tip = HUD.showLayer(HUD_LIST.Tip_Board, HUD.getTipLayer(), null, true);
                tip.setData(boards[i]);
            }
        }
    },

    goToPanel: function (panelType, panelTab) {
        if (panelTab != null) panelTab = 0;
        switch (panelType) {
            case 0://PanelType_Interface
                HUD.showMainContent(HUD_LIST.Home);
                HUD.getMainPage().setTop(1);
                break;
            case 1://PanelType_RenWu
                HUD.showMainContent(HUD_LIST.Team);
                HUD.getMainPage().setTop(1);
                break;
            case 2://PanelType_RenWu
                HUD.showMainContent(HUD_LIST.InstanceZone);
                HUD.getMainPage().setTop(2);
                break;
            case 3://PanelType_Lilian
                var layer = HUD.showMainContent(HUD_LIST.Adventure);
                layer.selectTab(panelTab);
                HUD.getMainPage().setTop(1);
                break;
            case 4://PanelType_Adventrue
                HUD.showMainContent(HUD_LIST.Meeting);
                HUD.getMainPage().setTop(1);
                break;
            case 5://PanelType_PK
                HUD.showMainContent(HUD_LIST.Arena);
                HUD.getMainPage().setTop(3);
                break;
            case 6://PanelType_Macket
                HUD.showMainContent(HUD_LIST.Shop);
                HUD.getMainPage().setTop(1);
                break;
            case 8://PanelType_Mail
                var layer = HUD.showMainContent(HUD_LIST.Home);
                layer.showLeftContent(3);
                HUD.getMainPage().setTop(1);
                break;
            case 9://PanelType_Friend
                var layer = HUD.showMainContent(HUD_LIST.Home);
                layer.showContent(6);
                HUD.getMainPage().setTop(1);
                break;
            case 10://PanelType_Chat
                var layer = HUD.showMainContent(HUD_LIST.Home);
                layer.showLeftContent(4);
                HUD.getMainPage().setTop(1);
                break;
            case 11://PanelType_Setting
                HUD.showLayer(HUD_LIST.Setting, HUD.getTipLayer(), null, true);
                break;
            case 12://PanelType_Xianyou
                var layer = HUD.showMainContent(HUD_LIST.Partner);
                layer.selectTab(panelTab + 1);
                HUD.getMainPage().setTop(1);
                break;
            case 13://PanelType_Equip
                var layer = HUD.showMainContent(HUD_LIST.Equipment);
                layer.selectTab(panelTab + 1);
                HUD.getMainPage().setTop(1);
                break;
            case 14://PanelType_Wugong
                var layer = HUD.showMainContent(HUD_LIST.MagicWeapon);
                layer.selectTab(panelTab + 1);
                HUD.getMainPage().setTop(1);
                break;
            case 15://PanelType_Horse
                var layer = HUD.showMainContent(HUD_LIST.Mount);
                layer.selectTab(panelTab + 1);
                HUD.getMainPage().setTop(1);
                break;

            case 16://PanelType_Liudao
                var layer = HUD.showMainContent(HUD_LIST.Adventure);
                layer.selectTab(1);
                HUD.getMainPage().setTop(1);
                break;
            case 17://PanelType_TempleRun
                HUD.showMainContent(HUD_LIST.Temple);
                HUD.getMainPage().setTop(4);
                break;
            case 18://PanelType_OpenServiceActivities
                var layer = HUD.showMainContent(HUD_LIST.Activity);
                if (panelTab == 13)
                    layer.selectTab(4);
                HUD.getMainPage().setTop(1);
                break;
        }
    }
};