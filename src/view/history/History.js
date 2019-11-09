var History = {
    init: function () {
        var that = this;

        this.pageMax = 50;
        this.pageNum = 1;
        this.curPage = 0;

        this.btn_left = new cc.Sprite('res/image/ui/history/history_left.png');
        this.btn_left.setPosition(cc.p(35, 35));
        this.addChild(this.btn_left);
        this.btn_right = new cc.Sprite('res/image/ui/history/history_right.png');
        this.btn_right.setPosition(cc.p(1280 - 35, 35));
        this.addChild(this.btn_right);
        TouchUtils.setOnclickListener(this.btn_left, function () {
            if (that.curPage >= 1) {
                that.curPage--;
                that.setLRBtn();
                that.itemList = [];
                for (var s = 0; s < that.pageMax; s++) {
                    if (that.itemAll[that.curPage * that.pageMax + s]) {
                        that.itemList[s] = that.itemAll[that.curPage * that.pageMax + s];
                    }
                }
                tableViewRefresh(that.tableView);
            }
        });
        TouchUtils.setOnclickListener(this.btn_right, function () {
            if (that.curPage < that.pageNum - 1) {
                that.curPage++;
                that.setLRBtn();
                that.itemList = [];
                for (var s = 0; s < that.pageMax; s++) {
                    if (that.itemAll[that.curPage * that.pageMax + s]) {
                        that.itemList[s] = that.itemAll[that.curPage * that.pageMax + s];
                    }
                }
                tableViewRefresh(that.tableView);
            }
        });

        this.btBack = getUI(this, 'btn_back');
        this.scrollview = getUI(this, 'scrollview');
        this.btOthers = getUI(this, 'btOthers');
        addModalLayer(this);
        TouchUtils.setOnclickListener(this.btBack, function () {
            that.removeFromParent();
        }, {sound: 'close'});

        //按钮 0碰胡子 1牛牛 2麻将 3跑得快 4拼三张 5长牌
        var showBtnArr = [1, 2, 3, 4, 5, 6, 7];

        var index = 0;
        for (var i = 1; i <= showBtnArr.length; i++) {
            this['bt' + i] = getUI(this, 'btn_' + i);
            if (showBtnArr.indexOf(i) >= 0) {
                this['bt' + i].setPositionX(150 + index * 170);
                index++;
            } else {
                this['bt' + i].setVisible(false);
            }
        }

        var showBtnFunc = function (index) {
            for (var i = 0; i < 7; i++) {
                that['bt' + (i + 1)].getChildByName('on').setVisible((i + 1) == index);
                that['bt' + (i + 1)].setLocalZOrder((i + 1) == index ? 2:1);
            }
        };

        this.zhanjiTab = 'dn';
        showBtnFunc(1);

        TouchUtils.setOnclickListener(this.bt1, function () {
            if (that.zhanjiTab != 'dn') {
                that.zhanjiTab = 'dn';

                showBtnFunc(1);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});
        TouchUtils.setOnclickListener(this.bt2, function () {
            if (that.zhanjiTab != 'majiang') {
                that.zhanjiTab = 'majiang';

                showBtnFunc(2);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});
        TouchUtils.setOnclickListener(this.bt3, function () {
            if (that.zhanjiTab != 'pdk') {
                that.zhanjiTab = 'pdk';

                showBtnFunc(3);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});
        TouchUtils.setOnclickListener(this.bt4, function () {
            if (that.zhanjiTab != 'zjh') {
                that.zhanjiTab = 'zjh';

                showBtnFunc(4);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});
        TouchUtils.setOnclickListener(this.bt5, function () {
            if (that.zhanjiTab != 'kaokao') {
                that.zhanjiTab = 'kaokao';

                showBtnFunc(5);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});
        TouchUtils.setOnclickListener(this.bt6, function () {
            if (that.zhanjiTab != 'epz') {
                that.zhanjiTab = 'epz';
                showBtnFunc(6);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});
        TouchUtils.setOnclickListener(this.bt7, function () {
            if (that.zhanjiTab != 'sss') {
                that.zhanjiTab = 'sss';
                showBtnFunc(7);
                that.createContent();
                that.reTry();
            }
        }, {sound: 'tab', swallowTouches: false});

        TouchUtils.setOnclickListener(this.btOthers, function () {
            var seeOtherZhanji = new ZhanjiHuiFangLayer(that.ip);
            cc.director.getRunningScene().addChild(seeOtherZhanji);
        });

        this.createContent();
        this.reTry();

        return true;
    },
    reTry: function (retryCnt) {
        var that = this;

        retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;
        var urlreq = '/Record/youxianRecord';
        var req = {UserID: gameData.uid, mapid: 310};
        if (that.zhanjiTab == 'majiang') {
            req = {
                UserID: gameData.uid,
                mapid: '' + MAP_ID.CHANGSHA + ',' + MAP_ID.ZHUANZHUAN + ',' + MAP_ID.HONGZHONG + ','
                + MAP_ID.SICHUAN_XUELIU + ',' + MAP_ID.SICHUAN_XUEZHAN + ',' + MAP_ID.SICHUAN_MZ + ',' + MAP_ID.SICHUAN_TRLF
            };
            urlreq = '/Record/niuniuRecord';
        } else if (that.zhanjiTab == 'dn') {
            req = {
                UserID: gameData.uid,
                mapid: '4000,400'
            };
            urlreq = '/Record/niuniuRecord';
        } else if (that.zhanjiTab == 'pdk') {
            req = {
                UserID: gameData.uid,
                mapid: MAP_ID.PDK + ',' + MAP_ID.SC_PDK
            };
            urlreq = '/Record/niuniuRecord';
        } else if (that.zhanjiTab == 'zjh') {
            req = {
                UserID: gameData.uid,
                mapid: MAP_ID.ZJH
            };
            urlreq = '/Record/niuniuRecord';
        } else if (that.zhanjiTab == 'kaokao') {
            req = {
                UserID: gameData.uid,
                mapid: MAP_ID.CP_KAOKAO + ',' + MAP_ID.CP_SICHUAN
            };
            urlreq = '/Record/mianzhuRecord';

            // urlreq = "/Record/ldfpfRecord";
            // req.mapid = 301;
            // req.UserID = 83;
        } else if (that.zhanjiTab == 'epz') {
            req = {
                UserID: gameData.uid,
                mapid: MAP_ID.EPZ
            };
            urlreq = '/Record/niuniuRecord';
        } else if (that.zhanjiTab == 'sss') {
            req = {
                UserID: gameData.uid,
                mapid: MAP_ID.PK_13S
            };
            urlreq = '/Record/niuniuRecord';
        }
        //var ip = gameData.ipList[parseInt(retryCnt) % gameData.ipList.length];
        var ip = 'http://rec.yygameapi.com:56790';
        // this.ip = ip;
        this.ip = 'http://gg-paohuzi.oss-cn-hangzhou.aliyuncs.com/niuniu-rec/';
        DC.httpData(urlreq, req, function (data) {
            // cc.log(data);
            if (data != null && data.result == 0) {
                that.ip = ip;//正确的ip
                that.itemAll = data.data || [];
                if (that.itemAll && that.itemAll.length > 0) {
                    // for(var k=that.itemAll.length;k<496;k++){
                    //     that.itemAll[k] = deepCopy(that.itemAll[0]);
                    //     that.itemAll[k]['room_id'] = k;
                    // }
                    var lb_nozhanji = getUI(that, 'lb_nozhanji');
                    lb_nozhanji.setVisible(that.itemAll.length == 0);
                    that.itemAll.sort(function (a, b) {
                        return b.create_time - a.create_time;
                    });
                }
                that.pageNum = Math.floor((that.itemAll.length + that.pageMax - 1) / that.pageMax);
                that.curPage = 0;
                that.itemList = [];
                that.setLRBtn();
                //处理  itemList
                for (var s = 0; s < that.pageMax; s++) {
                    if (that.itemAll[that.curPage * that.pageMax + s]) {
                        that.itemList[s] = that.itemAll[that.curPage * that.pageMax + s];
                    }
                }
                tableViewRefresh(that.tableView);

                var bg_cell = getUI(that, 'bg_cell');
                if (that.zhanjiTab == 'dn' || that.zhanjiTab == 'zjh' || that.zhanjiTab == 'epz' || that.zhanjiTab == 'sss') {
                    bg_cell.setVisible((that.itemList && that.itemList.length == 0));
                } else {
                    bg_cell.setVisible(true);
                }

                //移动到第一行
                var innerHeight = that.itemList.length * 130;
                if (that.zhanjiTab == 'dn' || that.zhanjiTab == 'zjh' || that.zhanjiTab == 'epz' || that.zhanjiTab == 'sss') {
                    innerHeight = 0;
                    for (var k = 0; k < that.itemList.length; k++) {
                        var curH = 240;
                        if (that.itemList[k]['uid7']) {
                            curH = 500;
                        } else if (that.itemList[k]['uid4']) {
                            curH = 370;
                        }
                        innerHeight = innerHeight + curH;
                    }
                }
                that.tableView.setContentOffset(cc.p(0, -innerHeight + that.scrollview.getContentSize().height), false);
            }
        }, false, ip, function () {
            retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;
            if (retryCnt < gameData.ipList.length - 1) {
                retryCnt++;
                that.reTry(retryCnt);
                HUD.showMessage('正在进行第' + parseInt(retryCnt) + '次重试');
            } else {
                HUD.showMessageBox('提示', '请求信息失败,请检查您的网络', function () {
                }, true);
            }
        });
    },
    setLRBtn: function () {
        var that = this;
        if (that.pageNum == 0 || that.pageNum == 1 || that.curPage == 0) {
            Filter.grayScale(that.btn_left);
            TouchUtils.setClickDisable(that.btn_left, true);
        } else {
            Filter.remove(that.btn_left);
            TouchUtils.setClickDisable(that.btn_left, false);
        }
        if (that.pageNum == 0 || that.pageNum == 1 || that.curPage == (that.pageNum - 1)) {
            Filter.grayScale(that.btn_right);
            TouchUtils.setClickDisable(that.btn_right, true);
        } else {
            Filter.remove(that.btn_right);
            TouchUtils.setClickDisable(that.btn_right, false);
        }
    },
    updateContent: function (info) {
        //this.itemList = mItem.getItemList(this.index-1)
        var result = info.result;
        if (result != '0') {

        }
        this.itemList = info.data;
        this.itemList.sort(function (a, b) {
            return b.create_time - a.create_time;
        });
        // this.itemList = [1, 2, 3, 4, 5];
        tableViewRefresh(this.tableView);
    },

    createContent: function () {
        //scrollview
        if (this.tableView) {
            this.tableView.removeFromParent();
            this.tableView = null;
            this.itemList = [];
        }
        var tableView = new cc.TableView(this, cc.size(this.scrollview.getContentSize().width, this.scrollview.getContentSize().height));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        tableView.x = 0;
        tableView.y = 0;
        tableView.setDelegate(this);
        tableView.setBounceable(true);
        this.scrollview.addChild(tableView);
        this.tableView = tableView;
    },

    tableCellTouched: function (table, cell) {
        if (this.zhanjiTab == 'dn') {
            // showLoading();
            var curscene = cc.director.getRunningScene();
            var layer = new HistoryDetailNiuNiu(this.itemList[cell.getIdx()]);
            layer.setPositionX(cc.winSize.width/2 - 1280/2);
            curscene.addChild(layer, 100);
        } else {
            var content = HUD.showLayer(HUD_LIST.HistoryDetail, this);
            content.setPositionX(1280/2);
            content.updateContent(this.itemList[cell.getIdx()]);
        }
    },

    tableCellSizeForIndex: function (table, idx) {
        if (this.zhanjiTab != 'dn' && this.zhanjiTab != 'zjh' && this.zhanjiTab != 'epz' && this.zhanjiTab != 'sss') {
            return cc.size(1180, 130);
        } else {
            //牛牛  几个人
            var size = null;
            if (this.itemList[idx]['uid7']) {
                size = cc.size(1180, 500);
            } else if (this.itemList[idx]['uid4']) {
                size = cc.size(1180, 370);
            } else {
                size = cc.size(1180, 240);
            }
            return size;
        }
    },

    tableCellAtIndex: function (table, idx) {
        var cell = table.dequeueCell();
        if (cell == null) {
            cell = new cc.TableViewCell();
            var node = null;
            // console.log(this.zhanjiTab);
            if (this.zhanjiTab != 'dn' && this.zhanjiTab != 'zjh' && this.zhanjiTab != 'epz' && this.zhanjiTab != 'sss') {
                node = HUD.createTableCell(HUD_LIST.HistoryCell, cell);
            } else {
                node = HUD.createTableCell(HUD_LIST.NiuniuHistoryCell, cell);
                node.setParentLayer(this);
            }
            node.setIndex(idx + (this.curPage * this.pageMax), this.itemList[idx]);
        } else {
            cell.node.setIndex(idx + (this.curPage * this.pageMax), this.itemList[idx]);
        }
        return cell;
    },

    numberOfCellsInTableView: function (table) {
        if (this.itemList == null) return 0;
        return this.itemList.length;
    },

    lookOther: function (sender, type) {
        var that = this;
        var ok = touch_process(sender, type);
        if (ok) {
            // var seeOtherZhanji = HUD.showLayer(HUD_LIST.InputPlayBack, this);
            // seeOtherZhanji.setData(this.ip);
            var seeOtherZhanji = new ZhanjiHuiFangLayer(that.ip);
            cc.director.getRunningScene().addChild(seeOtherZhanji);
        }
    }
};