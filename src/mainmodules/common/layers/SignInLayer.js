/**
 * Created by zhanglm on 2018/6/4.
 */

SignInCell = UIComponent.extend({
    m_data: null,
    ctor: function() {
        this._super();
    },

    onAdd: function() {
        this._super();

        this.parseNode({
            m_panelCell: "panelCell",
            m_txtName: "txtName",
            m_imgNameBg: "imgNameBg",
            m_imgPic: "imgPic",
            m_imgReceived: "imgReceived"
        });

        this.m_imgReceived.setVisible(false);
        this.m_imgPic.ignoreContentAdaptWithSize(true);
        this.m_imgPic.addComponent(new NetImage());
    },

    setData: function(data) {
        this.m_data = data;

        this.m_txtName.setString(data.m_name);
        this.m_imgNameBg.setContentSize(cc.size(this.m_txtName.getContentSize().width + 30,
            this.m_imgNameBg.getContentSize().height));
        this.m_txtName.setPositionX(this.m_imgNameBg.getContentSize().width / 2);
        this.m_imgPic.getComponent("NetImage").setUrl(data.m_imgUrl);
    },

    setReceived: function(hasReceived) {
        if (hasReceived) {
            this.m_imgReceived.setVisible(true);
            this.m_imgPic.setColor(cc.color(100, 100, 100, 50));
        }
    },

    setBox: function() {
        this.m_imgPic.loadTexture("Texture/lobby/signin/box.png", ccui.Widget.PLIST_TEXTURE);
        this.m_imgNameBg.setVisible(false);
    }

});

SignInLayer = UIComponent.extend
({
    m_items: null,
    m_cellLst: null,
    ctor: function () {
        this._super();
        this.m_cellLst = [];

        var rootNode = UIFileLoader.loadWithVisibleSize(main_module_common_res.signin_layer).node;
        rootNode.addComponent(this);
    },

    onAdd: function () {
        this._super();
        this.parseNode({
            m_btnClose:"btnClose",
            m_btnSign:"btnSign",
            m_item1:"item1",
            m_item2:"item2",
            m_item3:"item3",
            m_item4:"item4",
            m_item5:"item5",
            m_item6:"item6",
            m_item7:"item7",
            m_imgDay1:"imgDay1",
            m_imgDay2:"imgDay2",
            m_imgDay3:"imgDay3",
            m_imgDay4:"imgDay4",
            m_imgDay5:"imgDay5",
            m_imgDay6:"imgDay6",
            m_imgDay7:"imgDay7"
        });

        this.m_items = [];
        for (var i = 0; i < 7; ++i) {
            this.m_items.push(this["m_item" + (i + 1)]);
        }

        this.m_imgDay = [];
        for (var i = 0; i < 7; ++i) {
            this.m_imgDay.push(this["m_imgDay" + (i + 1)]);
        }

        this.m_btnSign.setZoomScale(0);
        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
        this.m_btnSign.addTouchEventListener(this.onTouchSign, this);

        this.node.addComponent(new KeybackComponent(this.onTouchClose, this));

        this.initCell();
        this.setListData();

        this.registerNotice(NtfGetSignInData, this.onGetSignInData, this);
        this.registerNotice(NtfSignIn, this.onSignIn, this);
        MKEventSystem.sendCommand(CmdGetSignInData);
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

    onTouchSign: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            MKEventSystem.sendCommand(CmdSignIn);
        }
    },

    onGetSignInData: function() {
        this.setListData();
    },

    initCell: function() {
        for (var i = 0; i < 7; ++i) {
            var itemNode = this.m_items[i];
            var cell = new SignInCell();
            itemNode.addComponent(cell);
            this.m_cellLst.push(cell);
            cell.node.setVisible(false);
        }
    },

    setListData: function() {
        var signInData = DataManager.getInstance().getSignInData();
        var lstData = signInData.getItemList();
        var lstLen = lstData.length;
        for (var i = 0; i < lstLen; ++i) {
            var cell = this.m_cellLst[i];
            cell.node.setVisible(true);
            if (i == 6) {
                cell.setBox();
            } else {
                cell.setData(lstData[i]);
            }
        }

        this.updateReceivedCell();
        this.updateSignBtn();
        this.updateDay();
    },

    updateReceivedCell: function() {
        var signInData = DataManager.getInstance().getSignInData();
        var singCount = signInData.getSignCount();
        for (var i = 0; i < this.m_items.length; ++i) {
            var itemNode = this.m_items[i];
            var cell = itemNode.getComponent(UIComponent.Name);

            if (i < singCount) {
                cell.setReceived(true);
            }
        }
    },

    updateSignBtn: function() {
        var signInData = DataManager.getInstance().getSignInData();

        if (signInData.hasSignToday()) {
            GameUtils.setButtonGray(this.m_btnSign);
            this.m_btnSign.setTouchEnabled(false);
        } else {
            GameUtils.setButtonGray(this.m_btnSign, false);
            this.m_btnSign.setTouchEnabled(true);
        }
    },

    updateDay: function() {
        for (var i = 0; i < 7; ++i) {
            this.m_imgDay[i].setVisible(false);
        }

        var signInData = DataManager.getInstance().getSignInData();
        var signCount = signInData.getSignCount();

        var nowDay = -1;
        if (signInData.hasSignToday()) {
            nowDay = signCount - 1;
        } else {
            nowDay = signCount;
        }

        if (nowDay >= 0 && nowDay < 7) {
            this.m_imgDay[nowDay].setVisible(true);
        }
    },

    onSignIn: function(ntc) {
        if (ntc.m_result == 0) {
            this.updateReceivedCell();
            this.updateSignBtn();

            var layer = new EmailAwardLayer(ntc.m_awardLst);
            cc.director.getRunningScene().addChild(layer.node);
        }
    }
});

