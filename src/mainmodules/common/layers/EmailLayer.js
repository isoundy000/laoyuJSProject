/**
 * Created by zhanglm
 */

SysEmailCell = UIComponent.extend({
    m_data: null,
    m_detailCallbck: null,
    ctor: function (widget) {
        this._super();

        widget.addComponent(this);
        widget.setVisible(true);

        this.parseNode({
            m_panelCell: 'panelCell',
            m_imgOpen: 'imgOpen',
            m_txtTitle: 'txtTitle',
            m_txtDate: 'txtDate'
        });

        this.m_panelCell.addTouchEventListener(this.onTouchBg, this);
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
    },

    setData: function (data) {
        this.m_data = data;
        this.m_txtTitle.setString(data.m_title);
        this.m_txtDate.setString(GameUtils.timeFormat(data.m_date, TimeFormat.YYYYMMDDHHmm));
        this.setRead(data.m_read);
    },

    setRead: function (read) {
        if (read) {
            MKUIHelper.setSpriteFrameNameForImageView(this.m_imgOpen, 'Texture/lobby/email/read.png');
        } else {
            MKUIHelper.setSpriteFrameNameForImageView(this.m_imgOpen, 'Texture/lobby/email/unread.png');
        }
    },

    onTouchBg: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            if (this.m_detailCallbck) {
                this.m_detailCallbck(this);
            }
        }
    }
});

FrEmailCell = UIComponent.extend({
    m_data: null,
    m_detailCallbck: null,
    ctor: function (widget) {
        this._super();

        widget.addComponent(this);
        widget.setVisible(true);

        this.parseNode({
            m_panelCell: 'panelCell1',
            m_imgHead: 'imgOpen',
            m_txtTitle: 'txtTitle',
            m_txtContent: 'txtContent',
            m_txtDate: 'txtDate',
            m_coinNum: 'coinNum'
        });

        this.m_panelCell.addTouchEventListener(this.onTouchBg, this);
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
    },

    setData: function (data) {
        this.m_data = data;
        this.m_txtTitle.setString(data.m_title);
        this.m_txtDate.setString(GameUtils.timeFormat(data.m_givetime * 1000, TimeFormat.YYYYMMDD));
        this.m_txtContent.setString(data.m_content);
        this.m_coinNum.setString('x' + data.m_coincnt);
        var netImg = this.m_imgHead.getComponent('NetImage');
        if (netImg) {
            netImg.setUrl(data.m_headURL);
        } else {
            netImg = new NetImage();
            this.m_imgHead.addComponent(netImg);
            netImg.setUrl(data.m_headURL);
        }
    },

    onTouchBg: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            if (this.m_detailCallbck) {
                this.m_detailCallbck(this);
            }
        }
    }
});

SystemEmailSubLayer = UIComponent.extend({
    m_data: null,
    ctor: function () {
        this._super();
        var rootNode = UIFileLoader.loadWithVisibleSize('res/Lobby/sys_email_sub.json').node;
        rootNode.addComponent(this);
        this.parseNode({
            m_txtTitle: 'txtTitle',
            m_txtContent: 'txtContent',
            m_btnOK: 'btnOK',
            m_btnClose: 'btnClose',
            m_imgItem0: 'imgItem0',
            m_imgItem1: 'imgItem1',
            m_imgItem2: 'imgItem2',
            m_imgItem3: 'imgItem3',
            m_imgItem4: 'imgItem4',
            m_txtFujian: 'txtTitle_1_0'
        });
        this.m_itemCount = 5;
        this.m_items = new Array(this.m_itemCount);
        for (var i = 0; i < this.m_itemCount; ++i) {
            var pkey = 'm_imgItem' + i;
            this.m_items[i] = this[pkey];
            this[pkey].setVisible(false);
        }
        this.m_btnOK.addTouchEventListener(this.onTouchReceive, this);
        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
    },

    onEnter: function () {
        this._super();
    },

    setData: function (data) {
        this.m_data = data;
        if (data.m_items.length > 0) {
            for (var i = 0; i < data.m_items.length && i < 5; ++i) {
                var item = data.m_items[i];
                var itemConfig = DataManager.getInstance().getItemsData().getConfigByCode(item.m_code);
                if (itemConfig) {
                    this.m_items[i].setVisible(true);
                    var netImg = new NetImage();
                    var itemImg = this.m_items[i].getChildByName('item');
                    itemImg.ignoreContentAdaptWithSize(true);
                    itemImg.addComponent(netImg);
                    netImg.setUrl(itemConfig.m_imgUrl);
                    this.m_items[i].getChildByName('num').setString('X' + item.m_count);
                }
            }
        } else {
            this.m_txtFujian.setVisible(false);
        }
        this.m_txtTitle.setString(this.m_data.m_title);
        this.m_txtContent.setString(this.m_data.m_content);

        if (data.m_items.length == 0) {
            this.m_btnOK.setVisible(false);
        }

        if (data.m_items.length > 0 && data.m_hasReceived) {
            this.setReceived();
        }
    },

    setReceived: function () {
        this.m_btnOK.setTouchEnabled(false);
        GameUtils.setButtonGray(this.m_btnOK);
        var titleImg = this.m_btnOK.getChildByName('imgBtnTitle');
        titleImg.ignoreContentAdaptWithSize(true);
        titleImg.loadTexture('Texture/lobby/email/txt_received.png', ccui.Widget.PLIST_TEXTURE);
    },

    onTouchReceive: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            ref.setTouchEnabled(false);
            var cmd = new ReceiveEmailCommand();
            cmd.m_emails.push(this.m_data.m_id);
            MKEventSystem.sendCommand(cmd);
            this.setReceived();
        }
    },

    onTouchClose: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            this.node.removeFromParent();
        }
    }
});

EmailLayer = UIComponent.extend
({
    m_selIndex: 0,
    ctor: function () {
        this._super();

        var rootNode = UIFileLoader.loadWithVisibleSize(main_module_common_res.email_layer).node;
        rootNode.addComponent(this);

        this.parseNode({
            m_btnClose: 'btnClose',
            m_txtEmpty: 'txtEmpty',
            m_lstInfo: 'lstInfo',
            m_panelCell: 'panelCell',
            m_panelCell1: 'panelCell1',
            m_pannelBg: 'pannelBg',
            m_btnSel: 'btnSel',
            m_btnSel1: 'btnSel1',
            m_btnDel: 'btnDel',
            m_btnReadAll: 'btnReadAll',
            m_btnGetAll: 'btnGetAll',
            m_emailNum: 'emailNum'
        });

        this.m_panelCell.setVisible(false);
        this.m_panelCell1.setVisible(false);
        this.m_txtEmpty.setVisible(false);
        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
        this.m_btnSelVec = new Array(2);
        this.m_btnSel.ignoreContentAdaptWithSize(true);
        this.m_btnSel.setZoomScale(false);
        this.m_btnSel.addTouchEventListener(this.onTouchSysEmail, this);
        this.m_btnSelVec[0] = this.m_btnSel;
        this.m_btnSel1.ignoreContentAdaptWithSize(true);
        this.m_btnSel1.setZoomScale(false);
        this.m_btnSel1.addTouchEventListener(this.onTouchFriendEmail, this);
        this.m_btnSelVec[1] = this.m_btnSel1;

        this.m_btnDel.addTouchEventListener(this.onTouchDel, this);
        this.m_btnReadAll.addTouchEventListener(this.onTouchReadAll, this);
        this.m_btnGetAll.addTouchEventListener(this.onTouchGetAll, this);

        this.registerNotice(NtfGetEmailList, this.onGetEmailList, this);

        MKEventSystem.sendCommand(CmdGetEmailList);
        MKEventSystem.sendCommand(CmdGetFriendEmails);

        if (this.m_pannelBg) {
            this.m_pannelBg.addComponent(new PopAnimation());
        }
        this.node.addComponent(new KeybackComponent(this.onTouchClose, this));
        this.changeSel(0);
    },

    onEnter: function () {
        this._super();
        DataManager.getInstance().getGlobalData().setCanShowInvitations(false);
    },

    onExit: function () {
        this._super();
        MKEventSystem.sendNotice(NtfEmailUnreadState);
        DataManager.getInstance().getGlobalData().setCanShowInvitations(true);
    },

    onTouchClose: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            this.node.removeFromParent();
        }
    },

    onTouchSysEmail: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            this.changeSel(0);
        }
    },

    onTouchFriendEmail: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            this.changeSel(1);
        }
    },

    changeSel: function (sel) {
        var selImg = ['system_', 'friend_'];
        for (var i = 0; i < selImg.length; ++i) {
            var btn = this.m_btnSelVec[i];
            if (sel == i) {
                btn.loadTextureNormal('res/mainmodules/common/layers/email/btn_sel_on.png', ccui.Widget.LOCAL_TEXTURE);
                // var img = cc.formatStr('res/mainmodules/common/layers/email/%son.png', selImg[i]);
                // btn.getChildByName('imgTitle').loadTexture(img, ccui.Widget.LOCAL_TEXTURE);
            } else {
                btn.loadTextureNormal('res/mainmodules/common/layers/email/btn_sel_off.png', ccui.Widget.LOCAL_TEXTURE);
                // var img = cc.formatStr('res/mainmodules/common/layers/email/%soff.png', selImg[i]);
                // btn.getChildByName('imgTitle').loadTexture(img, ccui.Widget.LOCAL_TEXTURE);
            }
        }

        this.setListData(sel);
        this.m_selIndex = sel;
    },

    onTouchDel: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            var cmd = new DeleteEmailCommand();
            MKEventSystem.sendCommand(cmd);
        }
    },

    onTouchReadAll: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            var cmd = new ReadEmailCommand();
            MKEventSystem.sendCommand(cmd);
        }
    },

    onTouchGetAll: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            SoundManager.playSoundEffect(ddz.SOUND_BUTTON_CLICK);
            if (this.m_selIndex == 1) {
                var getCoinCmd = new GetFriendCoinsCmd();
                MKEventSystem.sendCommand(getCoinCmd);
            } else {
                var emailLst = [];
                var email = DataManager.getInstance().getEmailData();
                for (var i = 0; i < email.getEmailList().length; ++i) {
                    var ele = email.getEmailList()[i];
                    if (ele.m_items.length > 0 && !ele.m_hasReceived) {
                        emailLst.push(ele.m_id);
                    }
                }

                if (emailLst.length == 0) {
                    MessageView.show('没有可领取的附件');
                    return;
                }

                //领取系统邮件
                var cmd = new ReceiveEmailCommand();
                cmd.m_emails = emailLst;
                MKEventSystem.sendCommand(cmd);
            }
        }
    },

    onGetEmailList: function () {
        this.setListData(this.m_selIndex);
    },

    setListData: function (index) {
        this.m_lstInfo.removeAllItems();
        if (index == 0) {//系统邮件
            var email = DataManager.getInstance().getEmailData();
            // var lst = [];
            // for (var i = 1; i < 30; ++i) {
            //    var data = new EmailInfo();
            //    data.m_id = "" + i;
            //    data.m_date = "2017/12/" + i;
            //    data.m_title = "title" + i;
            //    data.m_read = false;
            //    data.m_content = "你好：XXX\n\t\t欢迎光临\n\t\t\t\t\t\t\t游戏项目组" + i;
            //    lst.push(data);
            //    data.m_hasReceived = false;
            //    var item = new EmailItem();
            //    item.m_imgUrl = "http://res.caileddz.com/mall/icon_iphoneX.png";
            //    item.m_count = i;
            //    data.m_items.push(item);
            //    var item = new EmailItem();
            //    item.m_imgUrl = "http://res.caileddz.com/mall/icon_iphoneX.png";
            //    item.m_count = i;
            //    data.m_items.push(item);
            // }
            //
            // email.setEmailList(lst);

            var emailList = email.getEmailList();
            var emailLen = emailList.length;
            for (var i = 0; i < emailLen; ++i) {
                var cell = new SysEmailCell(this.m_panelCell.clone());
                this.m_lstInfo.pushBackCustomItem(cell.node);
                cell.m_detailCallbck = this.onShowSystemDetail.bind(this);
                cell.setData(emailList[i]);
            }

            if (emailLen == 0) {
                this.m_txtEmpty.setVisible(true);
                this.m_btnDel.setVisible(false);
                this.m_btnReadAll.setVisible(false);
                this.m_btnGetAll.setVisible(false);
            } else {
                this.m_txtEmpty.setVisible(false);
                this.m_btnDel.setVisible(true);
                this.m_btnReadAll.setVisible(true);
                this.m_btnGetAll.setVisible(true);

            }
            this.m_emailNum.setString(emailLen + '/30');
            var unreadNum = email.getUnreadEmailList();
            if (unreadNum == 0) {
                this.m_btnSel.getChildByName('imgRed').setVisible(false);
            } else {
                this.m_btnSel.getChildByName('imgRed').setVisible(true);
                this.m_btnSel.getChildByName('imgRed').getChildByName('Text_1').setString(unreadNum.toString());
            }
            var friendLen = email.getFriendEmails().length;
            if (friendLen == 0) {
                this.m_btnSel1.getChildByName('imgRed').setVisible(false);
            } else {
                this.m_btnSel1.getChildByName('imgRed').setVisible(true);
                this.m_btnSel1.getChildByName('imgRed').getChildByName('Text_1').setString(friendLen.toString());
            }
        } else {
            var email = DataManager.getInstance().getEmailData();
            // var lst = [];
            // for (var i = 1; i < 30; ++i) {
            //    var data = new EmailInfo();
            //    data.m_id = "" + i;
            //    data.m_date = "2017/12/" + i;
            //    data.m_title = "title" + i;
            //    data.m_read = false;
            //    data.m_headURL = "http://res.caileddz.com/mall/icon_iphoneX.png";
            //    data.m_content = "你好：XXX欢迎光临游戏项目组" + i;
            //    lst.push(data);
            //    data.m_hasReceived = false;
            //    var item = new EmailItem();
            //    item.m_imgUrl = "http://res.caileddz.com/mall/icon_iphoneX.png";
            //    item.m_count = i;
            //    data.m_items.push(item);
            //    var item = new EmailItem();
            //    item.m_imgUrl = "http://res.caileddz.com/mall/icon_iphoneX.png";
            //    item.m_count = i;
            //    data.m_items.push(item);
            // }
            //
            // email.setEmailList(lst);

            var emailList = email.getFriendEmails();
            var emailLen = emailList.length;
            for (var i = 0; i < emailLen; ++i) {
                var cell = new FrEmailCell(this.m_panelCell1.clone());
                this.m_lstInfo.pushBackCustomItem(cell.node);
                cell.m_detailCallbck = this.onShowFriendDetail.bind(this);
                cell.setData(emailList[i]);
            }

            this.m_btnDel.setVisible(false);
            this.m_btnReadAll.setVisible(false);
            if (emailLen == 0) {
                this.m_txtEmpty.setVisible(true);
                this.m_btnGetAll.setVisible(false);
            } else {
                this.m_txtEmpty.setVisible(false);
                this.m_btnGetAll.setVisible(true);
            }
            this.m_emailNum.setString(emailLen + '/30');

            if (emailLen == 0) {
                this.m_btnSel1.getChildByName('imgRed').setVisible(false);
            } else {
                this.m_btnSel1.getChildByName('imgRed').setVisible(true);
                this.m_btnSel1.getChildByName('imgRed').getChildByName('Text_1').setString(emailLen.toString());
            }
        }
    },

    onShowSystemDetail: function (cell) {
        var layer = new SystemEmailSubLayer();
        layer.setData(cell.m_data);
        cc.director.getRunningScene().addChild(layer.node);

        if (cell.m_data.m_read == false) {
            var cmd = new ReadEmailCommand();
            cmd.m_emails.push(cell.m_data.m_id);
            MKEventSystem.sendCommand(cmd);
            cell.setRead(true);
        }
    },

    onShowFriendDetail: function (cell) {
        var getCoinCmd = new GetFriendCoinsCmd();
        getCoinCmd.m_fromuid = cell.m_data.m_fromuid;
        getCoinCmd.m_givetime = cell.m_data.m_givetime;
        getCoinCmd.m_recvtype = 1;
        MKEventSystem.sendCommand(getCoinCmd);
    }

});


EmailAwardLayer = UIComponent.extend({
    m_list: null,
    ctor: function (list) {
        this._super();
        this.m_list = list;
        var rootNode = UIFileLoader.loadWithVisibleSize('res/Lobby/share_inv_award.json').node;
        rootNode.addComponent(this);
    },

    onAdd: function () {
        this._super();
        this.parseNode({
            m_btnClose: 'btnClose',
            m_panelQuit: 'panelQuit',
            m_contentBg: 'contentBg',
            m_panelContent: 'panelContent',
            m_imgTips: 'imgTips'
        });
        this.m_btnClose.setZoomScale(0);
        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
        this.m_btnClose.setVisible(false);
        this.m_panelQuit.setTouchEnabled(true);
        this.m_panelQuit.addTouchEventListener(this.onTouchClose, this);
        this.m_panelContent.setVisible(false);
        this.showContent();
    },

    onEnter: function () {
        this._super();
        SoundManager.playSoundEffect(ddz.SOUND_AWARD);
        cc.director.getScheduler().unschedule('delaycloseself', this);
        cc.director.getScheduler().schedule(this.onDelayClose, this, 0, 0, 10, false, 'delaycloseself');
        DataManager.getInstance().getGlobalData().setCanShowInvitations(false);
    },

    onExit: function () {
        this._super();
        cc.director.getScheduler().unschedule('delaycloseself', this);
        DataManager.getInstance().getGlobalData().setCanShowInvitations(true);
    },

    showContent: function () {
        var gap = 40;
        var nodenum = this.m_list.length > 5 ? 5 : this.m_list.length;
        var firPosx = this.m_panelContent.getPositionX();
        var tmpWidth = this.m_panelContent.getContentSize().width;
        if (nodenum == 2) {
            firPosx = this.m_panelContent.getPositionX() - (gap / 2 + tmpWidth / 2);
        } else if (nodenum == 3) {
            firPosx = this.m_panelContent.getPositionX() - (gap + tmpWidth);
        } else if (nodenum == 4) {
            firPosx = this.m_panelContent.getPositionX() - (gap + tmpWidth) * 1.5;
        } else if (nodenum == 5) {
            firPosx = this.m_panelContent.getPositionX() - (gap + tmpWidth) * 2;
        }
        for (var i = 0; i < this.m_list.length && i < 5; ++i) {
            var node = this.m_panelContent.clone();
            var item = this.m_list[i];
            var netImg = new NetImage();
            node.getChildByName('imgContent').addComponent(netImg);
            node.getChildByName('imgContent').ignoreContentAdaptWithSize(true);
            netImg.setUrl(item.m_imgUrl);
            var name = item.m_name;
            if (item.m_count > 0 || typeof item.m_count == 'string') {
                name += 'x' + item.m_count;
            }
            node.getChildByName('txtContent').setString(name);
            node.setPositionX(firPosx + (gap + tmpWidth) * i);
            node.setVisible(true);
            this.m_panelContent.getParent().addChild(node);
        }
    },

    onTouchClose: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            this.showNextLayer();
            this.node.removeFromParent();
        }
    },

    onDelayClose: function () {
        cc.director.getScheduler().unschedule('delaycloseself', this);
        this.showNextLayer();
        this.node.removeFromParent();
    },

    showNextLayer: function () {
        if (this.m_list.length > 5) {
            var awards = this.m_list.slice(5);
            var layer = new EmailAwardLayer(awards);
            cc.director.getRunningScene().addChild(layer.node);
        }
    }
});