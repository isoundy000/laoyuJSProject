(function (exports) {
    var $ = null;
    var ClubID = 0;
    var ClubBindMember = cc.Layer.extend({
        manageTable: [],//管理员列表
        HadBindTable: [],//已分配列表
        NotBindTable: [],//未分配列表
        curManagerId: 0,
        canSelect: false, //true 可以点击分配成员 false  点击cell无效果
        onEnter: function () {
            var that = this;
            cc.Layer.prototype.onEnter.call(this);
            //保存修改
            this.list1 = cc.eventManager.addCustomListener('bindParent', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert1("成员分配成功!");

                    that.canSelect = false;
                    $('btn_mergeClub').setTexture("res/submodules/club/img/bindMember/btn_change.png");

                    var clubInfo = getClubData(ClubID);
                    if (clubInfo.players_count < 200) { //200人以内直接请求后端
                        network.send(2103, {cmd: 'flushClub', club_id: ClubID});
                    } else {
                        var cmd = '/club?cmd=ClubDetail&uid=' + gameData.uid
                            + '&club_id=' + that.clubInfo['_id']
                            + '&area=niuniuBackend'
                            + '&time=' + new Date().getTime();
                        var sign = '&sign=' + Crypto.MD5('request:' + cmd);

                        NetUtils.httpGet("http://club.yygameapi.com:18800" + cmd + sign,
                            //测试地址 能返回测试数据
                            function (response) {
                                hideLoading();
                                //修改服务器返回数据 变为正常消息数据
                                var data = JSON.parse(response);
                                data.code = 2103;
                                data.data.command = 'flushClub'
                                network.recv(data);
                            }, function (response) {
                                hideLoading();
                                alert11('抱歉，系统繁忙！', 'noAnimation');
                            }
                        );
                    }
                }
            });
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
        },
        //点击管理员切换 绑定成员信息
        changeMemberLayer: function () {
            var that = this;

            cc.log("====curManagerId=====" + that.curManagerId);

            var v_ScrollView = $('ScrollView');
            var InnerLayer = v_ScrollView.getChildByName('InnerLayer');
            var AllBtns = InnerLayer.getChildren();
            for (var i = 0; i < AllBtns.length; i++) {
                AllBtns[i].setTexture(res.club_left_btn_1);
            }

            var curBtn = InnerLayer.getChildByTag(that.curManagerId);
            if (curBtn) {
                curBtn.setTexture(res.club_left_btn_2);
            }

            that.initHanBindList(); //加载该管理员已绑定的成员
        },
        initItem: function (itemData) {
            var that = this;
            var item = new cc.Sprite(res.club_left_btn_1);
            item.setAnchorPoint(0, 0);
            item.setTag(itemData.uid); //将管理员自己的uid 设置为tag

            var curManagerId = itemData.uid; //当前管理员的uid

            var name = ellipsisStr(itemData['name'], 5);
            var nameLab = new ccui.Text();
            nameLab.setString(name);
            nameLab.setTextColor(cc.color(255, 255, 255));
            nameLab.setFontSize(35);
            nameLab.setPosition(125, 40);
            item.addChild(nameLab, 10);

            TouchUtils.setOnclickListener(item, function () {
                if (that.curManagerId == curManagerId) {
                    return;
                }
                if (that.canSelect) {
                    alert22("您的操作尚未保存\n是否保存", function () {
                        that.sendBindNet();
                    }, function () {

                    });
                    return;
                }
                cc.log("=====管理员==uid==" + curManagerId);
                that.curManagerId = curManagerId;
                that.changeMemberLayer();
            }, {"swallowTouches": false});

            that.layout.addChild(item);
            var itemHeight = item.getContentSize().height + 10;
            item.setPositionX(0);
            item.setPositionY(that.totalHight);
            that.totalHight += itemHeight;
        },
        //管理员列表
        initBtnList: function () {
            var that = this;
            cc.log("============manageTable=========", that.manageTable);
            var v_ScrollView = $('ScrollView');
            v_ScrollView.removeAllChildren();
            that.layout = new ccui.Layout();//滑动区域
            that.layout.setPositionY(0);
            that.layout.setName('InnerLayer');
            v_ScrollView.addChild(that.layout);

            that.totalHight = 0; //滑动区域高度
            for (var i = that.manageTable.length - 1; i >= 0; i--) {
                (function (i) {
                    that.initItem(that.manageTable[i]);
                })(i);
            }
            v_ScrollView.setInnerContainerSize(cc.size(v_ScrollView.getContentSize().width, that.totalHight));

            if (that.totalHight < v_ScrollView.getContentSize().height) {
                var dis = v_ScrollView.getContentSize().height - that.totalHight;
                var new_posY = v_ScrollView.getPositionY() + dis;
                v_ScrollView.setPositionY(new_posY);
            }

            //默认展示第一个管理员的绑定成员
            that.changeMemberLayer();
        },
        //未分配的成员
        initNotBindList: function () {
            var that = this;
            var curManagerId = that.curManagerId; //当前展示的成员列表
            var club_info = getClubData(ClubID);
            var member = club_info['members']; //所有成员

            that.NotBindTable = []; //未分配的成员列表
            for (var i = 0; i < member.length; i++) {
                if (!member[i].aid) {
                    that.NotBindTable.push(member[i]);
                }
            }
            $('tip_not_bind').setVisible(that.NotBindTable.length <= 0);
            cc.log("===没有分配的成员======" + that.NotBindTable.length);

            if (that.tableview2) {
                tableViewRefresh(that.tableview2); //刷新一遍 用于查询
            } else {

                var dalegate = {
                    //点击cell
                    tableCellTouched: function (table, cell) {
                        var TouchIdx = cell.getIdx();
                        if (!that.canSelect) {
                            return;
                        }

                        cc.log("===点击tableview2=" + TouchIdx);
                        var touchMember = that.NotBindTable[TouchIdx];
                        if (that.curManagerId == touchMember.uid) {
                            alert11("不能绑定自己!");
                            return;
                        }
                        that.NotBindTable.splice(TouchIdx, 1);
                        table.reloadData();
                        that.HadBindTable.unshift(touchMember);
                        that.tableview1.reloadData();

                        $('tip_bind').setVisible(that.HadBindTable.length <= 0);
                        $('tip_not_bind').setVisible(that.NotBindTable.length <= 0);

                    },
                    tableCellSizeForIndex: function (table, idx) {
                        return cc.size(345, 86);
                    },
                    tableCellAtIndex: function (table, idx) {
                        var height = table.height;

                        var cell = table.dequeueCell();
                        if (cell == null) {
                            cell = new cc.TableViewCell();
                            var row0 = ccs.load(res.ClubBindItem_json, 'res/').node;
                            row0.setName('cellrow');
                            cell.addChild(row0);
                        }

                        var node = cell.getChildByName('cellrow');
                        var BandInfo = that.NotBindTable; // bind info

                        loadImageToSprite(BandInfo[idx].head, $('head', node));
                        $('lb_name', node).setString(ellipsisStr(BandInfo[idx].name, 5));
                        $('lb_id', node).setString(BandInfo[idx].uid);

                        return cell;
                    },
                    numberOfCellsInTableView: function (table) {
                        return that.NotBindTable.length
                    },

                }

                var tableviewLayer = $('tableView2');
                var tableview2 = new cc.TableView(dalegate, cc.size(tableviewLayer.getContentSize().width, tableviewLayer.getContentSize().height));
                tableview2.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                tableview2.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
                tableview2.setPosition(0, 0);
                tableview2.setDelegate(dalegate);
                tableview2.setBounceable(true);
                tableviewLayer.addChild(tableview2);
                that.tableview2 = tableview2;
            }

            var v_input = $('input');
            v_input.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
            v_input.setPlaceHolderColor(cc.color(255, 255, 255, 255));
            v_input.addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME: //点开输入框
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME://输入完毕
                        that.setPositionY(0);
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT://插入字符
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD://点击enter
                        break;
                    default:
                        break;
                }
            });

            TouchUtils.setOntouchListener($('btn_find'), function (sender) {
                v_input.didNotSelectSelf();
                var input = v_input.getString();
                if (input == null || input == undefined || input == "") {
                    alert11("搜索信息不能为空", 'noAnimation');
                    return;
                }
                var result = [];

                that.NotBindTable = []; //未分配的成员列表
                var club_info = getClubData(ClubID);
                var member = club_info['members']
                for (var i = 0; i < member.length; i++) {
                    if (!member[i].aid) {
                        that.NotBindTable.push(member[i]);
                    }
                }
                for (var i = 0; i < that.NotBindTable.length; i++) {
                    var item = that.NotBindTable[i];
                    if (new RegExp(input, "g").test(item.name) || new RegExp(input, "g").test(item.uid + '')) {
                        result.push(item);
                    }
                }
                that.NotBindTable = result;
                that.tableview2.reloadData();
            });

        },
        //未分配的成员
        initHanBindList: function () {
            var that = this;
            var curManagerId = that.curManagerId; //当前展示的成员列表
            var club_info = getClubData(ClubID);
            var member = club_info['members']; //所有成员

            that.HadBindTable = []; //已经分配的成员列表
            for (var i = 0; i < member.length; i++) {
                if (member[i].aid && member[i].aid != member[i].uid && member[i].aid == curManagerId) {
                    that.HadBindTable.push(member[i]);
                }
            }
            $('tip_bind').setVisible(that.HadBindTable.length <= 0);
            cc.log("====当前管理员的绑定列表======" + that.HadBindTable.length);
            if (that.tableview1) {
                tableViewRefresh(that.tableview1); //刷新一遍 用于查询
            } else {
                var tableviewLayer = $('tableView1');
                var tableview1 = new cc.TableView(that, cc.size(tableviewLayer.getContentSize().width, tableviewLayer.getContentSize().height));
                tableview1.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                tableview1.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
                tableview1.setPosition(0, 0);
                tableview1.setDelegate(that);
                tableview1.setBounceable(true);
                tableviewLayer.addChild(tableview1);
                that.tableview1 = tableview1;
            }
        },

        ctor: function (clubid) {
            this._super();

            var that = this;
            ClubID = clubid;

            loadNodeCCS(res.ClubBindMember_json, this);
            $ = create$(this.getChildByName("Layer"))

            this._$ = $;
            that.manageTable = [];
            that.HadBindTable = [];//已分配列表
            that.NotBindTable = [];//未分配列表

            $('tip_bind').setVisible(false);
            $('tip_not_bind').setVisible(false);
            cc.log("=======managermanager===========");

            var club_info = getClubData(ClubID);
            cc.log(club_info);
            var member = club_info['members']; //所有成员
            var manager = club_info['admins']; //管理员列表

            var arr = [];
            for (var i = 0; i < manager.length; i++) {
                if (arr.indexOf(manager[i]) == -1) {
                    arr.push(manager[i]);
                }
            }
            manager = arr;

            for (var i = 0; i < manager.length; i++) {
                for (var j = 0; j < member.length; j++) {
                    if (manager[i] == member[j].uid) {
                        that.manageTable.push(member[j]);
                    }
                }
            }

            cc.log("========that.manageTable=========" + that.manageTable);
            //获取第一个管理员的uid 逆序展示 所以取最后一个
            that.curManagerId = that.manageTable[0].uid;
            //初始化按钮
            that.initBtnList();
            that.initNotBindList();

            TouchUtils.setOntouchListener($('btn_close'), function (sender) {
                that.removeFromParent(true);
            });
            $('btn_mergeClub').setVisible(true);
            $('btn_send').setVisible(false);
            TouchUtils.setOntouchListener($('btn_mergeClub'), function (sender) {
                if (!that.canSelect) {
                    that.canSelect = true;
                    sender.setTexture("res/submodules/club/img/bindMember/btn_save.png");
                } else {
                    that.sendBindNet();
                    $('input').setString('');

                }
            });
        },
        sendBindNet: function () {
            var that = this;
            var add_objs = "";
            var del_objs = "";
            //判断新加入的成员
            for (var i = 0; i < that.HadBindTable.length; i++) {
                var member = that.HadBindTable[i];
                if (!member.aid) {
                    add_objs += member.uid + ",";
                }
            }
            //判断删除的成员
            for (var i = 0; i < that.NotBindTable.length; i++) {
                var member = that.NotBindTable[i];
                if (member.aid && member.aid == that.curManagerId) {
                    del_objs += member.uid + ",";
                }
            }
            add_objs = add_objs.substring(0, add_objs.length - 1);
            del_objs = del_objs.substring(0, del_objs.length - 1);
            var data = {
                cmd: "bindParent",
                aid: that.curManagerId,
                club_id: ClubID,
                add_objs: add_objs,
                del_objs: del_objs
            };
            network.send(2103, data) //绑定成员
        },
        //点击cell
        tableCellTouched: function (table, cell) {
            var that = this;
            var TouchIdx = cell.getIdx();
            if (!that.canSelect) {
                return;
            }
            cc.log("===点击tableview1=" + TouchIdx);
            var touchMember = that.HadBindTable[TouchIdx];
            if (that.curManagerId == touchMember.uid) {
                alert11("不能绑定自己!");
                return;
            }
            that.HadBindTable.splice(TouchIdx, 1);
            table.reloadData();
            that.NotBindTable.unshift(touchMember);
            that.tableview2.reloadData();
            $('tip_bind').setVisible(that.HadBindTable.length <= 0);
            $('tip_not_bind').setVisible(that.NotBindTable.length <= 0);
        },
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(345, 86);
        },
        tableCellAtIndex: function (table, idx) {
            var that = this;
            var height = table.height;

            var cell = table.dequeueCell();
            if (cell == null) {
                cell = new cc.TableViewCell();
                var row0 = ccs.load(res.ClubBindItem_json, 'res/').node;
                row0.setName('cellrow');
                cell.addChild(row0);
            }

            var node = cell.getChildByName('cellrow');
            var BandInfo = that.HadBindTable; // bind info
            loadImageToSprite(BandInfo[idx].head, $('head', node));
            $('lb_name', node).setString(ellipsisStr(BandInfo[idx].name, 5));
            $('lb_id', node).setString(BandInfo[idx].uid);

            return cell;
        },
        numberOfCellsInTableView: function (table) {
            return this.HadBindTable.length

        },


    });
    exports.ClubBindMember = ClubBindMember;

})(window);