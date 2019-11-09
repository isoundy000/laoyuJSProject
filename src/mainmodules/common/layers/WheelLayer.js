/**
 * Created by zhanglm on 2018/6/4.
 */

WheelCell = UIComponent.extend({
    m_data: null,
    ctor: function() {
        this._super();
    },

    onAdd: function() {
        this._super();

        this.parseNode({
            m_txtName: "txtName",
            m_imgPic: "imgPic"
        });

        this.m_imgPic.ignoreContentAdaptWithSize(true);
        this.m_imgPic.addComponent(new NetImage());
    },

    setData: function(data) {
        this.m_data = data;

        this.m_txtName.setString(data.m_name);
        this.m_imgPic.getComponent("NetImage").setUrl(data.m_imgUrl);
    }
});

WheelLucyUserCell = UIComponent.extend({
    m_data: null,
    ctor: function(widget) {
        this._super();
        widget.setVisible(true);
        widget.addComponent(this);
    },

    onAdd: function() {
        this._super();

        this.parseNode({
            m_txtName: "txtName",
            m_txtAward: "txtAward",
            m_imgBg: "imgBg"
        });
    },

    setData: function(data, idx) {
        this.m_data = data;

        this.m_txtName.setString(GameUtils.nameMaxCut(data.m_name, 8));
        this.m_txtAward.setString("获得" + data.m_award);
        this.m_imgBg.setVisible(false);
    }
});

WheelLayer = UIComponent.extend
({
    m_items: null,
    m_lstIdx: 0,
    m_delayIdx: 0,
    m_lstData: null,
    m_lstCellCache: null,
    m_lstCellCacheIdx: 0,
    m_awardLstShow: null,
    ctor: function () {
        this._super();

        this.m_lstData = [];
        this.m_lstCellCache = [];
        this.m_awardLstShow = [];

        var rootNode = UIFileLoader.loadWithVisibleSize(main_module_common_res.wheel_layer).node;
        rootNode.addComponent(this);
    },

    onAdd: function () {
        this._super();
        this.parseNode({
            m_btnClose:"btnClose",
            m_btnStart:"btnStart",
            m_imgCircle:"imgCircle",
            m_lstInfo:"lstInfo",
            m_panelCell:"panelCell",
            m_imgLight:"imgLight",
            m_txtCoin:"txtCoin",
            m_txtCard:"txtCard",
            m_txtLessMoney:"txtLessMoney",
            m_item1:"item1",
            m_item2:"item2",
            m_item3:"item3",
            m_item4:"item4",
            m_item5:"item5",
            m_item6:"item6",
            m_item7:"item7",
            m_item8:"item8"
        });

        this.m_items = [];
        for (var i = 0; i < 8; ++i) {
            this.m_items.push(this["m_item" + (i + 1)]);
        }

        this.m_panelCell.setVisible(false);
        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
        this.m_btnStart.addTouchEventListener(this.onTouchStart, this);
        this.m_btnStart.setZoomScale(0);

        this.node.addComponent(new KeybackComponent(this.onTouchClose, this));

        this.setItemData();
        this.rollLight();

        this.putNewLstData();
        this.initLstCellCache();
        this.setLstData();
        this.scrollLst();
        this.updateCard();

        MKEventSystem.sendCommand(CmdWheelGetConfig);
        MKEventSystem.sendCommand(CmdWheelGetLucyLst);

        this.registerNotice(NtfWheelGetConfig, this.onWheelGetConfig, this);
        this.registerNotice(NtfWheelLottery, this.onWheelLottery, this);
        this.registerNotice(NtfWheelGetLucyLst, this.onWheelGetLucyLst, this);
    },

    onExit: function () {
        this._super();
    },

    onTouchClose: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            this.node.removeFromParent();
        }
    },

    onTouchStart: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            var user = DataManager.getInstance().getOnlineUser();
            var wheelData = DataManager.getInstance().getWheelData();
            if (wheelData.getCardCount() > 0 || user.getCoin() > wheelData.getCostMoney()) {
                this.m_btnStart.setTouchEnabled(false);
                MKEventSystem.sendCommand(CmdWheelLottery);
            } else {
                MessageView.show("您的金币不足");
            }
        }
    },

    onWheelGetConfig: function() {
        this.updateCard();
    },

    updateCard: function() {
        var wheelData = DataManager.getInstance().getWheelData();
        if (wheelData.getCardCount() == 0) {
            this.m_txtCard.setVisible(false);
            this.m_txtCoin.setVisible(true);
            this.m_txtCoin.setString(wheelData.getCostMoney());
        } else {
            this.m_txtCard.setVisible(true);
            this.m_txtCoin.setVisible(false);
            this.m_txtCard.setString("抽奖券X" + wheelData.getCardCount());
        }
    },

    rollLight: function() {
        var rot = cc.rotateBy(0.08, 45);
        var delay = cc.delayTime(0.12);
        var func = cc.callFunc(this.rollLight, this);
        this.m_imgLight.runAction(cc.sequence(rot, delay, func));
    },

    rollLightToUp: function() {
        this.m_imgLight.stopAllActions();
        var rotNow = this.m_imgLight.getRotation();
        rotNow = rotNow % 360;
        rotNow = Math.ceil(rotNow / 45) * 45;
        this.m_imgLight.setRotation(rotNow);
        var rotDelt = 360 - rotNow;
        if (rotDelt < 270) {
            rotDelt += 360
        }

        var rotCount = rotDelt / 45;
        var allRot = [];
        var delayTime = (2.4 - 0.9) / rotCount - 0.08;
        for (var i = 0; i < rotCount - 3; ++i) {
            var rot = cc.rotateBy(0.08, 45);
            var delay = cc.delayTime(delayTime);
            allRot.push(rot);
            allRot.push(delay);
        }

        for (var i = 0; i < 3; ++i) {
            var rot = cc.rotateBy(0.08, 45);
            var delay = cc.delayTime(0.22);
            allRot.push(rot);
            allRot.push(delay);
        }

        var rotAni = cc.sequence(allRot);

        var blink = cc.blink(1, 8);
        var func1 = cc.callFunc(this.showAward, this);
        var delay = cc.delayTime(0.5);
        var func2 = cc.callFunc(this.rollLight, this);
        var endSeq = cc.sequence(blink, func1, delay, func2);

        this.m_imgLight.runAction(cc.sequence(rotAni, endSeq));
    },

    showAward: function() {
        var layer = new EmailAwardLayer(this.m_awardLstShow.slice());
        cc.director.getRunningScene().addChild(layer.node);
        this.m_awardLstShow.length = 0;
        this.m_btnStart.setTouchEnabled(true);
    },

    onWheelLottery: function (ntc) {
        var itemIdx = ntc.m_itemIdx;

        if (itemIdx < 1 || itemIdx > 8) {
            this.m_btnStart.setTouchEnabled(true);
            return;
        }

        this.updateCard();
        this.m_awardLstShow = ntc.m_awardLst;
        // 插入自己的中奖纪录
        if (itemIdx > 2) {
            var lstData = DataManager.getInstance().getWheelData().getItemList();
            var data = new WheelLucyUser();
            data.m_name = DataManager.getInstance().getOnlineUser().getNickName();
            data.m_award = lstData[itemIdx - 1].m_name;
            this.m_lstData.unshift(data);
        }

        var rotDelt = this.getRotDelt(this.m_imgCircle.getRotation(), itemIdx);
        var rot = cc.rotateBy(2, 360 * 6 + rotDelt).easing(cc.easeQuinticActionOut());
        this.m_imgCircle.runAction(rot);

        this.rollLightToUp();
    },

    getRotDelt: function(rotNow, itemIdx) {
        rotNow = (rotNow + 360) % 360;
        var rotDest = 360 - (itemIdx - 1) * 45;
        var rotDelt = 360 - (rotNow - rotDest + 360) % 360;
        return rotDelt;
    },

    setItemData: function() {
        var wheelData = DataManager.getInstance().getWheelData();
        var lstData = wheelData.getItemList();
        var lstLen = lstData.length;
        for (var i = 0; i < lstLen; ++i) {
            var itemNode = this.m_items[i];
            var cell = new WheelCell();
            itemNode.addComponent(cell);
            cell.setData(lstData[i]);
        }

        if (wheelData.getCoinLimit() > 0) {
            this.m_txtLessMoney.setString("金币小于" + wheelData.getCoinLimit() + "不能参加抽奖");
        } else {
            this.m_txtLessMoney.setVisible(false);
        }
    },

    initLstCellCache: function() {
        for (var i = 0; i < 13; ++i) {
            var cell = new WheelLucyUserCell(this.m_panelCell.clone());
            this.m_lstInfo.addChild(cell.node);
            cell.node.setVisible(false);
            this.m_lstCellCache.push(cell);
        }
    },

    getCellFromCache: function() {
        var cell = this.m_lstCellCache[this.m_lstCellCacheIdx];
        cell.node.setVisible(true);
        this.m_lstCellCacheIdx++;
        this.m_lstCellCacheIdx = this.m_lstCellCacheIdx % this.m_lstCellCache.length;
        return cell;
    },

    onWheelGetLucyLst: function() {
        this.putNewLstData();
    },

    putNewLstData: function() {
        var lst =DataManager.getInstance().getWheelData().getLucyUserList();
        this.m_lstData = this.m_lstData.concat(lst);
    },

    setLstData: function() {
        for (var i = 0; i < 11; ++i) {
            this.addLstCell();
        }
    },

    addLstCell: function() {
        if (this.m_lstData.length == 0) {
            return;
        }

        var cellData = this.m_lstData.shift();
        var cell = this.getCellFromCache();
        cell.setData(cellData, this.m_lstIdx);
        cell.node.setAnchorPoint(cc.p(0.5, 1));
        cell.node.setPosition(cc.p(290, 360 - 40 * this.m_lstIdx));
        this.m_lstIdx++;
    },

    scrollLst: function() {
        var delay = cc.delayTime(1.5);
        var move = cc.moveBy(0.3, 0, 40);
        var func = cc.callFunc(this.scrollLst, this);
        this.m_lstInfo.getInnerContainer().runAction(cc.sequence(delay, move, func));

        if (this.m_delayIdx > 1) {
            this.addLstCell();
        }

        this.m_delayIdx++;

        if (this.m_lstData.length < 10) {
            MKEventSystem.sendCommand(CmdWheelGetLucyLst);
        }
    },



});

