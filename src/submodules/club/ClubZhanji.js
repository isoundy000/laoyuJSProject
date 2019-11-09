/**
 * Created by dengwenzhong on 2017/5/15.
 */
'use strict';
(function (exports) {
    var $ = null;
    var BTN_NAME_RES_PATH = [
        {
            res1: 'res/common/button_choose.png',
            res2: 'res/common/button_nochoose.png',
            title: '字  牌',
        },
        {
            res1: 'res/common/button_choose.png',
            res2: 'res/common/button_nochoose.png',
            title: '扑  克',

        },
        {
            res1: 'res/common/button_choose.png',
            res2: 'res/common/button_nochoose.png',
            title: '麻  将',

        }
    ];

    var BTN_NORMAL_TEXTURE = "res/common/button_choose.png";
    var BTN_FOUCS_TEXTURE = "res/common/button_nochoose.png";

    var offset_H = 20;
    var btn_Hight = 75;
    var btn_Scroll_H = 488;
    var curSelectedTab = 0;
    var curr_type = 1;

    var ClubZhanji = cc.Layer.extend({
        // curr_type : null,
        // curSelectedTab : 0,
        majiang_data: null,
        zipai_data: null,
        poker_data: null,
        refreshType: 1,

        ctor: function (club_id) {
            this._super();

            var that = this;
            that.majiang_data = [];
            that.zipai_data = [];
            that.poker_data = [];
            that.club_id = club_id ? club_id : 699;

            // var scene = ccs.load(res.ClubZhanji_json);
            // this.addChild(scene.node);
            loadNodeCCS(res.ClubZhanji_json, this);
            $ = create$(this.getChildByName("Scene"));

            if (curr_type == 1) {
                that.getMyZhanJi(that.club_id);
            } else {
                that.getClubZhanji(that.club_id);
            }

            // if(!curr_type){
            //     curr_type = 1;
            // }
            this.initTypeBtn(curr_type);

            that.initBtn(curSelectedTab);

            TouchUtils.setOnclickListener($('btn_back'), function () {
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener($('btn_clubs'), function (target) {
                curr_type = 2;
                that.initTypeBtn(curr_type);
                that.getClubZhanji(that.club_id);
            }, this);
            TouchUtils.setOnclickListener($('btn_mine'), function (target) {
                curr_type = 1;
                that.initTypeBtn(curr_type);
                that.getMyZhanJi(that.club_id);
            }, this);

            return true;
        },
        /**
         * 初始化btn列表
         * @param type2 当前游戏
         */
        initBtn: function (type2) {
            type2 = type2 ? type2 : 0;
            var item = duplicateSprite($('btnscroll.btn_0'), true);
            var btnscroll = $('btnscroll');
            btnscroll.removeAllChildren();


            var num = BTN_NAME_RES_PATH.length;
            var that = this;
            that.Btns = [];

            //实际scroll高度
            var btnScrollH = (num ) * (btn_Hight + offset_H);
            if (btnScrollH < btn_Scroll_H) {
                btnScrollH = btn_Scroll_H;
            }
            //that.Btns.push();
            for (var i = 0; i < num; i++) {
                (function (i, type, cell) {
                    //if (i == 0)return;

                    var btn = duplicateSprite(cell, true);
                    that.Btns.push(btn);
                    if (btnScrollH < btn_Scroll_H) {
                        // btn.setPosition(cc.p(130, btn_Scroll_H - (btn_Hight+offset_H) * (i + 1 / 2)));
                        btn.setPositionY(btn_Scroll_H - (btn_Hight + offset_H) * (i + 1 / 2));
                    } else {
                        // btn.setPosition(cc.p(130, btnScrollH - (btn_Hight+offset_H) * (i + 1 / 2)));
                        btn.setPositionY(btnScrollH - (btn_Hight + offset_H) * (i + 1 / 2));
                    }
                    btn.setName("btn_" + i);
                    $('btnscroll').addChild(btn);

                    var title = btn.getChildByName('title');
                    if (title) {
                        title.setString(BTN_NAME_RES_PATH[i].title);
                    }
                    if (i == type) {
                        btn.setTexture(BTN_NORMAL_TEXTURE);
                        title.enableOutline(cc.color(192, 104, 40), 2);
                    }
                    else {
                        btn.setTexture(BTN_FOUCS_TEXTURE);
                        title.enableOutline(cc.color(87, 110, 119), 2);
                    }

                    TouchUtils.setOnclickListener(btn, function () {
                        that.btnCallBack(i);
                    }, {"swallowTouches": false});
                })(i, type2, item);
            }
            $('btnscroll').setInnerContainerSize(cc.size(266, btnScrollH));
        },
        getMyZhanJi: function (clubid) {
            var that = this;
            showLoading('正在加载..');
            var uri = '/Record/niuniuRecord?uid=' + gameData.uid + '&club_id=' + clubid;
            var sign = Crypto.MD5('request:' + uri).toString();
            NetUtils.httpGet("http://rec.yygameapi.com:56790" + uri + "&sign=" + sign, function (data) {
                hideLoading();
                that.zhanjiData = JSON.parse(data)['data'];
                that.sortZhanjiData();
                that.resetData();
            });
        },
        getClubZhanji: function (clubid) {
            var that = this;
            showLoading('正在加载..');
            var uri = '/Record/niuniuRecord?UserID=' + gameData.uid + '&club_id=' + clubid;
            var sign = Crypto.MD5('request:' + uri).toString();
            NetUtils.httpGet("http://rec.yygameapi.com:56790" + uri + "&sign=" + sign, function (data) {
                hideLoading();
                that.zhanjiData = JSON.parse(data)['data'];
                that.sortZhanjiData();
                that.resetData();
            });
        },
        sortZhanjiData: function () {
            this.getMaJiangData(this.zhanjiData);
            this.getZiPaiData(this.zhanjiData);
            this.getPokerData(this.zhanjiData);
        },
        getMaJiangData: function (dataArr) {
            this.majiang_data = [];
            for (var i = 0; i < dataArr.length; i++) {
                if (dataArr[i] && dataArr[i].map_id < 200) {
                    this.majiang_data.push(dataArr[i]);
                }
            }
        },
        getZiPaiData: function (dataArr) {
            this.zipai_data = [];
            for (var i = 0; i < dataArr.length; i++) {
                if (dataArr[i] && dataArr[i].map_id > 299 && dataArr[i].map_id < 401) {
                    this.zipai_data.push(dataArr[i]);
                }
            }
        },
        getPokerData: function (dataArr) {
            this.poker_data = [];
            for (var i = 0; i < dataArr.length; i++) {
                if (dataArr[i] && dataArr[i].map_id > 199 && dataArr[i].map_id < 300) {
                    this.poker_data.push(dataArr[i]);
                }
            }
        },
        resetData: function () {
            var that = this;
            if (!$ || !$('tableView')) {
                if (that && cc.sys.isObjectValid(that)) that.removeFromParent(true);
                return;
            }
            try {
                if (!this._tableView) {
                    var tableViewSize = $('tableView').getSize();
                    var tableViewAnchor = $('tableView').getAnchorPoint();
                    var tableViewPosition = $('tableView').getPosition();
                    var tableView = new cc.TableView(this, cc.size(tableViewSize.width, tableViewSize.height));
                    tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                    tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_BOTTOMUP);
                    if (cc.winSize.width - 1280 > 0) {
                        tableViewPosition.x = (cc.winSize.width - 1280) * 0.5;
                    }
                    tableView.setPosition(tableViewPosition);
                    tableView.setAnchorPoint(tableViewAnchor);
                    tableView.setDelegate(this);
                    this.addChild(tableView);
                    tableView.retain();
                    tableView.reloadData();
                    this._tableView = tableView;
                }
                if (this._tableView) {
                    tableViewRefresh(this._tableView);
                }
            } catch (e) {
                if (that && cc.sys.isObjectValid(that)) that.removeFromParent(true);
            }
            return;

            var that = this;
            if (curSelectedTab == 0) {
                that.initLists(that.zipai_data);
            } else if (curSelectedTab == 1) {
                that.initLists(that.poker_data);
            } else if (curSelectedTab == 2) {
                that.initLists(that.majiang_data);
            }
        },

        initLists: function (dataArr) {
            this.scrollView = $('scroll');
            if (!this.scrollView) {
                return;
            }
            this.scrollView.removeAllChildren(true);

            this.state = 1;

            if (!dataArr || !dataArr.length || dataArr.length < 1) {
                return;
            }
            this.layout = new ccui.Layout();
            this.totalHeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                this.initItem(dataArr[i], dataArr.length - i);
            }

            this.scrollView.setInnerContainerSize(cc.size(this.scrollView.getContentSize().width, this.totalHeight));
            this.scrollView.addChild(this.layout);
            this.layout.setPositionY(this.scrollView.getContentSize().height > this.totalHeight ? this.scrollView.getContentSize().height : this.totalHeight);
        },
        initItem: function (itemData, index) {
            var item = new ClubZhanjiItem(itemData, index, this.club_id);
            this.layout.addChild(item);
            var itemHeight = item.getLayerHeight();
            item.setPositionY(0 - this.totalHeight - itemHeight);
            this.totalHeight += itemHeight;
        },

        btnCallBack: function (idx) {
            curSelectedTab = idx;
            var that = this;
            for (var j = 0; j < this.Btns.length; j++) {
                var btn = this.Btns[j];
                if (j == idx) {
                    btn.setTexture(BTN_NORMAL_TEXTURE);
                    btn.getChildByName("title").enableOutline(cc.color(192, 104, 40), 2);
                } else {
                    btn.setTexture(BTN_FOUCS_TEXTURE);
                    btn.getChildByName("title").enableOutline(cc.color(87, 110, 119), 2);
                }
            }
            that.resetData();
            setTimeout(function () {
                $('scroll').jumpToTop()
            }, 10);
        },
        initTypeBtn: function (type) {
            if (type == 1) {
                $('btn_mine.choose').setVisible(true);
                $('btn_mine.nochoose').setVisible(false);
                $('btn_clubs.choose').setVisible(false);
                $('btn_clubs.nochoose').setVisible(true);
                $('btn_mine.title').enableOutline(cc.color(192, 104, 40), 2);
                $('btn_clubs.title').enableOutline(cc.color(87, 110, 119), 2);

            }
            if (type == 2) {
                $('btn_mine.choose').setVisible(false);
                $('btn_mine.nochoose').setVisible(true);
                $('btn_clubs.choose').setVisible(true);
                $('btn_clubs.nochoose').setVisible(false);
                $('btn_mine.title').enableOutline(cc.color(87, 110, 119), 2);
                $('btn_clubs.title').enableOutline(cc.color(192, 104, 40), 2);
            }
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        tableCellTouched: function (table, idx) {
            // var idx = cell.getIdx();
        },
        tableCellAtIndex: function (table, idx) {
            var strValue = idx.toFixed(0);
            var cell = table.dequeueCell();
            if (cell) cell.removeFromParent();
            var itemData;
            var lenth;
            if (curSelectedTab == 0) {
                lenth = this.zipai_data.length;
                itemData = this.zipai_data[lenth - idx - 1];
            } else if (curSelectedTab == 1) {
                lenth = this.poker_data.length;
                itemData = this.poker_data[lenth - idx - 1];
            } else if (curSelectedTab == 2) {
                lenth = this.majiang_data.length;
                itemData = this.majiang_data[lenth - idx - 1];
            }
            if (!cell) {
                cell = new ClubZhanjiItem(itemData, idx + 1, this.club_id);
            }
            cell.initCellData(itemData, idx, this.club_id);
            return cell;
        },
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(950.00, 90);
        },
        numberOfCellsInTableView: function (table) {
            if (curSelectedTab == 0) {
                return this.zipai_data.length;
            } else if (curSelectedTab == 1) {
                return this.poker_data.length;
            } else if (curSelectedTab == 2) {
                return this.majiang_data.length;
            }
        },
        scrollViewDidScroll: function (view) {
        },
        scrollViewDidZoom: function (view) {
        },
        _offsetFromIndex: function (view) {
        },
    });

    exports.ClubZhanji = ClubZhanji;
})(window);
