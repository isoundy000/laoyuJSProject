/**
 * Created by hjx on 2018/2/8.
 */

(function () {
    var exports = this;

    var $ = null;
    var club_id = null;
    var NowTabIndex = 1;
    var clubRoomData = [];
    var sendFirst = true;
    var btnPosY = [587, 480, 372, 266, 159, 52];
    var clubHttpUrl = 'https://pay.yayayouxi.com/fy-club-api';
    var paramsTime = ['today', 'yesterday', 'three', 'week'];

    var ClubMsgLayer = cc.Layer.extend({
        adminIdx: gameData.uid,
        curTouchIdx: 0,
        eventCallBack: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;

            //成员管理
            this.list1 = cc.eventManager.addCustomListener('setAdmin', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('成功提升为管理员', 'noAnimation');
                    network.send(2103, {cmd: 'flushClub', club_id: that.clubInfo['_id']});
                } else {
                    hideLoading()
                }
            });
            this.list2 = cc.eventManager.addCustomListener('unsetAdmin', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('成功删除管理员权限', 'noAnimation');
                    network.send(2103, {cmd: 'flushClub', club_id: that.clubInfo['_id']});
                } else {
                    hideLoading()
                }
            });
            this.list3 = cc.eventManager.addCustomListener('flushClub', function (event) {

                var data = event.getUserData();
                if (data.result == 0 || data.errorCode == 0) {
                    sendFirst = true;
                    network.send(2103, {cmd: 'onlineMember', club_id: that.clubInfo['_id']})
                    that.clubInfo = getClubData(club_id); //刷新俱乐部信息
                    //获取管理员列表
                    var manager = that.clubInfo['admins'];
                    var member = that.clubInfo['members']; //所有成员
                    //排除重复的管理员
                    var arr = [];
                    for (var i = 0; i < manager.length; i++) {
                        if (arr.indexOf(manager[i]) == -1) {
                            arr.push(manager[i]);
                        }
                    }
                    manager = arr;
                    //管理员列表
                    that.adminTable = [];
                    for (var i = 0; i < manager.length; i++) {
                        for (var j = 0; j < member.length; j++) {
                            if (manager[i] == member[j].uid) {
                                that.adminTable.push(member[j]);
                            }
                        }
                    }

                } else {
                    hideLoading()
                }
            });

            this.list4 = cc.eventManager.addCustomListener('onlineMember', function (event) {
                var data = event.getUserData();
                if (!sendFirst) {
                    hideLoading()
                    return;
                }
                if (NowTabIndex != 1) {
                    hideLoading()
                    return;
                }
                sendFirst = false;
                if (data.result == 0 && that.clubInfo['_id'] && that.clubInfo['_id'] > 0) {
                    that.onlineMemberNum = data['info']['online'].length || 0;
                    var clubInfo = getClubData(that.clubInfo['_id']);
                    var clubMembersInfo = clubInfo['members'];
                    var onLinesMems = data['info']['online'];
                    for (var j = 0; j < onLinesMems.length; j++) {
                        for (var i = 0; i < clubMembersInfo.length; i++) {
                            if (onLinesMems[j] == clubMembersInfo[i]['uid']) {
                                clubMembersInfo[i].onLine = true;
                                break;
                            }
                        }
                    }
                    var inRoomMems = data['info']['inroom'];
                    for (var j = 0; j < inRoomMems.length; j++) {
                        for (var i = 0; i < clubMembersInfo.length; i++) {
                            if (inRoomMems[j] == clubMembersInfo[i]['uid']) {
                                clubMembersInfo[i].inRoom = true;
                                break;
                            }
                        }
                    }
                    that.initUserLayer(getClubData(that.clubInfo['_id']))
                } else {
                    hideLoading()
                }
            });

            this.list5 = cc.eventManager.addCustomListener('BlackListAdd', function (event) {
                var data = event.getUserData();
                if (data.result == 0 || data.errorCode == 0) {
                    alert11('该成员被禁玩');
                } else {
                    hideLoading()
                }
            });
            this.list6 = cc.eventManager.addCustomListener('BlackListDel', function (event) {
                var data = event.getUserData();
                if (data.result == 0 || data.errorCode == 0) {
                    alert11('成员解禁成功');
                } else {
                    hideLoading()
                }
            });
            that.flushClub();
            //房间管理列表
            this.list11 = cc.eventManager.addCustomListener('listClubRoom', function (event) {

                if (NowTabIndex != 2) {
                    hideLoading()
                    return;
                }
                var data = event.getUserData();
                var cid = data['club_id'];
                if (cid && cid != club_id) {
                    hideLoading()
                    return;
                }
                clubRoomData = data['arr'];
                that.initRoomLayer(data['arr']);

            });

            //申请消息
            that.msgList = [];
            this.list111 = cc.eventManager.addCustomListener('queryMSG', function (event) {
                var data = event.getUserData();
                that.msgList = [];
                for (var i = 0; i < data['arr'].length; i++) {
                    var obj = data['arr'][i];
                    if (obj.club_id == club_id) {
                        that.msgList.push(obj);
                    }
                }
                that.initMsgLayer(that.msgList);
            });
            this.list222 = cc.eventManager.addCustomListener('agreeClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('操作成功', 'noAnimation');
                }
                network.send(2103, {cmd: 'queryMSG', club_id: club_id});
            });

            this.list333 = cc.eventManager.addCustomListener('agreeComboClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0 && (data.msg && data.msg.length > 0)) {
                    alert11(data.msg, 'noAnimation');
                }
                network.send(2103, {cmd: 'queryMSG', club_id: club_id});
            });

            this.list1111 = cc.eventManager.addCustomListener('feeds', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    that.initLogLayer(data);
                } else {
                    hideLoading();
                }
            });

        },
        flushClub: function () {
            var that = this;
            //进来首先加载成员管理
            if (that.clubInfo.players_count < 200) { //200人以内直接请求后端
                network.send(2103, {cmd: 'flushClub', club_id: that.clubInfo['_id']});
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
        },
        getMemberShuju: function (idx) {
            var btnT = ['btn_shuju_today', 'btn_shuju_yesteday', 'btn_shuju_3day', 'btn_shuju_7day']
            for (var i = 0; i < btnT.length; i++) {
                if (i == idx) {
                    $('node_shuju.' + btnT[i] + '1').setVisible(false);
                    $('node_shuju.' + btnT[i] + '2').setVisible(true);
                } else {
                    $('node_shuju.' + btnT[i] + '1').setVisible(true);
                    $('node_shuju.' + btnT[i] + '2').setVisible(false);
                }
            }
            showLoading("加载中...")
            var that = this;
            var uri = '?area=' + gameData.area
                + '&groupId=' + club_id + '@club'
                + '&timeType=' + paramsTime[idx]     //今日榜today 昨日棒 yesterday // 本周榜 week
                + '&playerId=' + gameData.uid;
            var sign = Crypto.MD5('fy-club-stat' + gameData.area + club_id + '@club' + gameData.uid).toString();
            cc.log(clubHttpUrl + "/club/stat/getStat" + uri + "&sign=" + sign);
            NetUtils.httpGet(clubHttpUrl + "/club/stat/getStat" + uri + "&sign=" + sign, function (data) {
                var data = JSON.parse(data);
                cc.log("=======getshuju====11===");
                console.log(data);
                if (data.status) {
                    that.initDataLayer(data.resultData);
                } else {
                    hideLoading();
                    alert11('' + data.errMsg);
                }
            });
        },
        getBindMemberInfo: function (idx) {
            var that = this;
            if (idx == undefined) {
                idx = that.bindTimeIdx;
            }
            that.bindTimeIdx = idx; //保存请求哪天的数据
            var sendUid = "-99";

            var btnT = ['btn_shuju_today', 'btn_shuju_yesteday', 'btn_shuju_3day', 'btn_shuju_7day'];
            for (var i = 0; i < btnT.length; i++) {
                if (i == idx) {
                    $('node_bind.' + btnT[i] + '1').setVisible(false);
                    $('node_bind.' + btnT[i] + '2').setVisible(true);
                } else {
                    $('node_bind.' + btnT[i] + '1').setVisible(true);
                    $('node_bind.' + btnT[i] + '2').setVisible(false);
                }
            }
            showLoading("加载中...");
            var url = "https://pay.yayayouxi.com/fy-club-api/club/stat/getDataByGroupList";
            url += "?area=" + gameData.area;
            url += "&playerId=" + sendUid;
            url += "&groupId=" + club_id + "@club";
            url += "&timeType=" + paramsTime[idx];

            var sign = '&sign=' + Crypto.MD5('fy-club-stat' + gameData.area + club_id + "@club" + sendUid);
            cc.log(url + sign);
            NetUtils.httpGet(url + sign, function (response) {
                    hideLoading();
                    response = JSON.parse(response);
                    var resultData = response.resultData;
                    that.showBindLayer(resultData);
                }, function (response) {
                    hideLoading();
                    alert11('抱歉，系统繁忙！', 'noAnimation');
                }
            );
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
            cc.eventManager.removeListener(this.list2);
            cc.eventManager.removeListener(this.list3);
            cc.eventManager.removeListener(this.list4);
            cc.eventManager.removeListener(this.list5);
            cc.eventManager.removeListener(this.list6);

            cc.eventManager.removeListener(this.list11);
            cc.eventManager.removeListener(this.list111);
            cc.eventManager.removeListener(this.list222);
            cc.eventManager.removeListener(this.list333);
            cc.eventManager.removeListener(this.list1111);
        },
        //消息列表
        setWeiduMegNum: function (num) {
            if (!$ || !$("btn_manage_info1")) {
                return;
            }
            if (num > 0) {
                $("btn_manage_info1.numbg").setVisible(true);
                $("btn_manage_info1.numbg.num").setString(num);
            } else {
                $("btn_manage_info1.numbg").setVisible(false);
            }
        },
        ctor: function (id, msgNum) {
            this._super();

            var that = this;
            club_id = id;

            loadNodeCCS(res.ClubMsgLayer_json, this);
            $ = create$(this.getChildByName("Layer"));

            that.clubInfo = getClubData(club_id); //获取clubinfo
            //获取管理员列表
            var manager = that.clubInfo['admins'];
            var member = that.clubInfo['members']; //所有成员
            //排除重复的管理员
            var arr = [];
            for (var i = 0; i < manager.length; i++) {
                if (arr.indexOf(manager[i]) == -1) {
                    arr.push(manager[i]);
                }
            }
            manager = arr;

            //管理员列表
            that.adminTable = [];
            for (var i = 0; i < manager.length; i++) {
                for (var j = 0; j < member.length; j++) {
                    if (manager[i] == member[j].uid) {
                        that.adminTable.push(member[j]);
                    }
                }
            }

            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root'), function () {
            });

            that.selectTab(1);
            TouchUtils.setOnclickListener($('btn_manage_player1'), function () {
                that.selectTab(1);
                showLoading("加载中...");
                that.initUserLayer(getClubData(that.clubInfo['_id']));
                that.flushClub();
            });
            TouchUtils.setOnclickListener($('btn_manage_room1'), function () {
                that.selectTab(2);
                showLoading("加载中...");
                network.send(2103, {cmd: 'listClubRoom', club_id: club_id, reason: "flushClub"});
            });
            TouchUtils.setOnclickListener($('btn_manage_info1'), function () {
                that.setWeiduMegNum(0);
                that.selectTab(3);
                showLoading("加载中...");
                network.send(2103, {cmd: 'queryMSG', club_id: club_id}); //获取成员信息列表
            });

            TouchUtils.setOnclickListener($('btn_manage_rizhi1'), function () {
                that.selectTab(4);
                showLoading("加载中...");
                network.send(2103, {cmd: 'feeds', club_id: club_id}); //获取成员日志
            });

            TouchUtils.setOnclickListener($('btn_manage_shuju1'), function () {
                that.selectTab(5);
                that.getMemberShuju(0);
            });
            TouchUtils.setOnclickListener($('btn_manage_bind1'), function () {
                that.selectTab(6);
                that.getBindMemberInfo(0); //默认传自己的uid 请求今天的消息
            });

            var btnT = ['btn_shuju_today1', 'btn_shuju_yesteday1', 'btn_shuju_3day1', 'btn_shuju_7day1'];
            for (var i = 0; i < paramsTime.length; i++) {
                (function (i) {
                    TouchUtils.setOnclickListener($('node_shuju.' + btnT[i]), function () {
                        that.getMemberShuju(i);
                    });
                })(i);
            }
            for (var i = 0; i < paramsTime.length; i++) {
                (function (i) {
                    TouchUtils.setOnclickListener($('node_bind.' + btnT[i]), function () {
                        that.getBindMemberInfo(i);
                    });
                })(i);
            }

            var clubinfo = getClubData(club_id);
            if (clubinfo['owner_uid'] != gameData.uid) {
                $('btn_manage_room1').setPositionY(-500);
                $('btn_manage_room2').setPositionY(-500);
                $('btn_manage_info1').setPositionY(btnPosY[1]);
                $('btn_manage_info2').setPositionY(btnPosY[1]);
                $('btn_manage_rizhi1').setPositionY(btnPosY[2]);
                $('btn_manage_rizhi2').setPositionY(btnPosY[2]);
                $('btn_manage_shuju1').setPositionY(-500);
                $('btn_manage_shuju2').setPositionY(-500);
                $('btn_manage_bind1').setPositionY(btnPosY[3]);
                $('btn_manage_bind2').setPositionY(btnPosY[3]);
            }
            //搜索
            var inputNode = $('node_select.input');
            inputNode.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            inputNode.setPlaceHolderColor(cc.color(255, 255, 255, 235));
            inputNode.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        //that.setPositionY(320);
                        cc.log("attach with IME");
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        that.setPositionY(0);
                        cc.log("detach with IME");
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        cc.log("insert words");
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log("delete word");
                        break;
                    default:
                        break;
                }
            }, that);
            TouchUtils.setOnclickListener($('node_select.btn_find'), function () {
                inputNode.didNotSelectSelf();
                var input = inputNode.getString();
                if (input == null || input == undefined || input == "") {
                    var tip = "搜索信息不能为空";
                    alert11(tip, 'noAnimation');
                    return;
                }
                if (NowTabIndex == 1) {
                    var result = [];
                    var clubInfo = getClubData(that.clubInfo['_id']);
                    if (_.isArray(clubInfo)) {
                        clubInfo = that.clubInfo;
                    }
                    that.usersList = clubInfo['members'] || [];
                    for (var i = 0; i < that.usersList.length; i++) {
                        var item = that.usersList[i];
                        if (new RegExp(input, "g").test(item.name) || new RegExp(input, "g").test(item.uid + '')) {
                            result.push(item);
                        }
                    }
                    that.initUserLayer(that.clubInfo, result);
                } else if (NowTabIndex == 2) {
                    var result = [];
                    that.roomList = clubRoomData;
                    for (var i = 0; i < that.roomList.length; i++) {
                        var room_id = that.roomList[i].room_id;
                        if (new RegExp(input, "g").test(room_id + '')) {
                            result.push(that.roomList[i]);
                        }
                    }
                    that.initRoomLayer(that.roomList, result);
                }

            });

            TouchUtils.setOnclickListener($('node_select.btn_fenpei'), function () {
                that.addChild(new ClubBindMember(club_id));
            });
            if (gameData.uid != that.clubInfo['owner_uid']) {
                $('node_select.btn_fenpei').setVisible(false);
            }

            //进入先加载成员管理
            that.initUserLayer(that.clubInfo); //先加载成员信息
            that.setWeiduMegNum(parseInt(msgNum) || 0); //判断有无申请消息

            return true;
        },
        selectTab: function (index) { //index选择的tab 1成员管理 2房间管理 3申请消息
            NowTabIndex = index;
            var btnTab = ['btn_manage_player', 'btn_manage_room', 'btn_manage_info', 'btn_manage_rizhi', 'btn_manage_shuju', 'btn_manage_bind'];
            for (var i = 0; i < btnTab.length; i++) {
                (function (i) {
                    if (i == (index - 1)) {
                        $(btnTab[i] + '1').setVisible(false);
                        $(btnTab[i] + '2').setVisible(true);
                    } else {
                        $(btnTab[i] + '1').setVisible(true);
                        $(btnTab[i] + '2').setVisible(false);
                    }
                })(i);
            }
            $('node_select.input').setString('');
            var heightT = [510, 510, 610, 610, 510, 530];
            $('Image_bg').setContentSize(cc.size(947, heightT[index - 1]));

            $('node_select').setVisible(false);
            $('node_players').setVisible(false);
            $('node_rooms').setVisible(false);
            $('node_shuju').setVisible(false);
            $('node_bind').setVisible(false);
            if (index == 1) {
                $('node_select').setVisible(true);
                $('node_select.player_num').setVisible(true);
                $('node_select.input').setPlaceHolder('请输入玩家昵称或玩家ID');
                $('node_select.btn_fenpei').setVisible(true);
                $('node_players').setVisible(true);
            } else if (index == 2) {
                $('node_select').setVisible(true);
                $('node_select.player_num').setVisible(false);
                $('node_select.input').setPlaceHolder('请输入房间ID');
                $('node_select.btn_fenpei').setVisible(false);
                $('node_rooms').setVisible(true);
            } else if (index == 5) {
                $('node_shuju').setVisible(true);
            } else if (index == 6) {
                $('node_bind').setVisible(true);
            }

            if (this.tableview) {
                this.tableview.removeAllChildren();
            }

        },

        tableCellTouched: function (table, cell) {
        },
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(922, 76);
        },
        tableCellAtIndex: function (table, idx) {
            var that = this;
            var cell = table.dequeueCell();
            if (cell == null) {
                cell = new cc.TableViewCell();
                var row0 = ccs.load(res.ClubMsgItem_json, 'res/').node;
                row0.setName('cellrow');
                cell.addChild(row0);
            }

            if (NowTabIndex == 1) {
                that.initUserCell(cell, idx);
            } else if (NowTabIndex == 2) {
                that.initRoomCell(cell, idx);
            } else if (NowTabIndex == 3) {
                that.initMsgCell(cell, idx);
            } else if (NowTabIndex == 4) {
                that.initLogCell(cell, idx);
            } else if (NowTabIndex == 5) {
                that.initDataCell(cell, idx);
            } else {
                that.initBindCell(cell, idx);
            }

            return cell;
        },
        numberOfCellsInTableView: function (table) {
            var that = this;
            if (NowTabIndex == 1) {
                return that.usersList.length;
            } else if (NowTabIndex == 2) {
                return that.roomList.length
            } else if (NowTabIndex == 3) {
                return that.msgList.length;
            } else if (NowTabIndex == 4) {
                return that.logArr.length;
            } else if (NowTabIndex == 5) {
                return that.logDataArr.length;
            } else {
                return that.logBindArr.length;
            }
        },
        initTableView: function (height) {
            var that = this;
            if (that.tableview) {
                that.tableview.removeFromParent(true);
                that.tableview = null;
            }
            if (that.tableview) {
                tableViewRefresh(that.tableview); //刷新一遍 用于查询
            } else {
                var tableviewLayer = $('tableviewLayer');
                var tableview = new cc.TableView(that, cc.size(tableviewLayer.getContentSize().width, height));
                tableview.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                tableview.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
                tableview.x = 0;
                tableview.y = 0;
                tableview.setDelegate(that);
                tableview.setBounceable(true);
                tableviewLayer.addChild(tableview);
                that.tableview = tableview;
            }
            hideLoading();
        },
        showPlayerSetting: function (userInfo) {
            var that = this;
            $("setting").setVisible(true);
            TouchUtils.setOnclickListener($("setting.root"), function () {
                that.hidePlayerSetting();
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($("setting.setting_bg_5"), function () {

            }, {effect: TouchUtils.effects.NONE});


            TouchUtils.setOnclickListener($("setting.grade"), function () {
                if (that.clubInfo['admins'] && that.clubInfo['admins'].indexOf(userInfo['uid']) >= 0) {
                    var club_id = that.clubInfo._id;
                    alert22('是否将玩家设置为普通成员?', function () {
                        network.send(2103, {cmd: 'unsetAdmin', club_id: club_id, obj_id: userInfo['uid']});
                    }, function () {
                    }, 'noAnimation');
                } else {
                    var club_id = that.clubInfo._id;
                    alert22('是否将玩家设置为管理员?', function () {
                        network.send(2103, {cmd: 'setAdmin', club_id: club_id, obj_id: userInfo['uid']});
                    }, function () {
                    }, 'noAnimation');
                }
                that.hidePlayerSetting();
            });
            TouchUtils.setOnclickListener($("setting.remove"), function () {
                alert22('是否删除成员?', function () {
                    var club_id = that.clubInfo['_id'];
                    network.send(2103, {
                        cmd: 'removeClubMember',
                        club_id: club_id,
                        obj_id: userInfo['uid'],
                        name: userInfo['name'],
                        head: userInfo['head']
                    });
                    that.hidePlayerSetting();
                }, function () {
                }, 'noAnimation');
            });

            var had_jinzhi = false;
            var black_list = that.clubInfo.black_list || [];
            for (var i = 0; i < black_list.length; i++) {
                if (userInfo['uid'] == black_list[i]) {
                    had_jinzhi = true;
                    break;
                }
            }
            if (had_jinzhi) { //被禁玩了
                $("setting.btn_jinwan").setVisible(false);
                $("setting.btn_jiejin").setVisible(true);
            } else {
                $("setting.btn_jinwan").setVisible(true);
                $("setting.btn_jiejin").setVisible(false);
            }
            TouchUtils.setOnclickListener($("setting.btn_jinwan"), function () {
                var club_id = that.clubInfo['_id'];
                network.send(2103, {cmd: 'BlackListAdd', club_id: club_id, uid: userInfo['uid']});
                that.hidePlayerSetting();

            });
            TouchUtils.setOnclickListener($("setting.btn_jiejin"), function () {
                var club_id = that.clubInfo['_id'];
                network.send(2103, {cmd: 'BlackListDel', club_id: club_id, uid: userInfo['uid']});
                that.hidePlayerSetting();

            });

            if (that.clubInfo.owner_uid != gameData.uid) {
                Filter.grayScale($("setting.grade"));
                TouchUtils.removeListeners($("setting.grade"));
            } else {
                Filter.remove($("setting.grade"));
            }
        },
        hidePlayerSetting: function () {
            $("setting").setVisible(false);
        },
        //下面展示6个界面的详细信息 Layer + Cell
        initUserLayer: function (data, searchList) {
            var that = this;
            that.clubInfo = data;
            that.usersList = data['members'] || [];
            if (searchList) {
                that.usersList = searchList;
            }
            $('no_info_tip').setString('');
            this.owner_uid = that.clubInfo['owner_uid'];
            var ownerList = [];
            for (var i = 0; i < that.usersList.length; i++) {
                var _userInfo = this.usersList[i];
                if (_userInfo['uid'] == this.owner_uid) {
                    ownerList.push(_userInfo);
                    break;
                }
            }
            //管理员排序 放到队列前面
            var sysList = _.filter(this.usersList, function (obj) {
                return (that.clubInfo['admins'] && that.clubInfo['admins'].indexOf(obj.uid) >= 0) && (obj.uid != that.owner_uid);
            });
            var cyList = _.filter(this.usersList, function (obj) {
                return !(that.clubInfo['admins'] && that.clubInfo['admins'].indexOf(obj.uid) >= 0) && (obj.uid != that.owner_uid);
            });
            var sysListOnline = _.filter(sysList, function (obj) { //在线 不在线
                return !!obj.onLine;
            });
            var sysListOffLine = _.filter(sysList, function (obj) {
                return !obj.onLine;
            });
            var cyListOnline = _.filter(cyList, function (obj) {
                return !!obj.onLine;
            });
            var cyListOffLine = _.filter(cyList, function (obj) {
                return !obj.onLine;
            });
            //在线管理员 不在线管理员 在线成员 不在线成员
            that.usersList = ownerList.concat(sysListOnline).concat(sysListOffLine).concat(cyListOnline).concat(cyListOffLine);

            that.initTableView(455);
            //在线人数 =  自己 + 在线管理员 + 在线普通成员
            if (!searchList) {
                $('node_select.player_num').setString('在线人数:' + that.onlineMemberNum);
                $('node_select.player_num.total_num').setString('/' + that.usersList.length)
            }
        },
        initUserCell: function (cell, i) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node) return;
            var userInfo = this.usersList[i];
            var setData = function (ref, idx) {
                $("idx", ref).setString(idx + 1);
                $("lb_name", ref).setString(ellipsisStr(userInfo['name'], 6));
                $("lb_id", ref).setString('ID:' + userInfo['uid']);
                if (!!userInfo['onLine']) {
                    if (!!userInfo["inRoom"]) {
                        $("lb_states", ref).setString('游戏中');
                        $("lb_states", ref).setTextColor(cc.color(255, 10, 10));
                    } else {
                        $("lb_states", ref).setString('在线');
                        $("lb_states", ref).setTextColor(cc.color(39, 182, 49));
                    }
                } else {
                    $("lb_states", ref).setString('离线');
                    $("lb_states", ref).setTextColor(cc.color(115, 115, 115));
                }

                if (!!that.clubInfo.black_list) {
                    var blackList = that.clubInfo.black_list;
                    for (var i = 0; i < blackList.length; i++) {
                        if (userInfo['uid'] == blackList[i]) {
                            $("lb_states", ref).setString('禁玩');
                            $("lb_states", ref).setTextColor(cc.color(255, 10, 10));
                            break;
                        }
                    }
                }

                if (userInfo.head) {
                    if (!cc.sys.isNative) {
                        loadImageToSprite(userInfo.head, $('head', ref), true);
                    } else {
                        loadImageToSprite(userInfo.head, $('head', ref));
                    }
                }
                if (userInfo['uid'] == that.clubInfo['owner_uid']) {
                    $('lb_shenfen', ref).setString('创建者');
                    $('lb_shenfen', ref).setTextColor(cc.color(214, 131, 43));
                    $("btn_operation", ref).setVisible(false);
                } else {
                    $("btn_operation", ref).setVisible(true);
                    if (that.clubInfo['admins']) {
                        if (that.clubInfo['admins'].indexOf(userInfo['uid']) >= 0) {
                            $('lb_shenfen', ref).setString('管理员');
                            $('lb_shenfen', ref).setTextColor(cc.color(214, 131, 43));
                        } else {
                            $('lb_shenfen', ref).setString('成员');
                            $('lb_shenfen', ref).setTextColor(cc.color(214, 131, 43));
                        }
                    } else {
                        $('lb_shenfen', ref).setString('成员');
                        $('lb_shenfen', ref).setTextColor(cc.color(214, 131, 43));
                    }
                }
                if (that.clubInfo['owner_uid'] == gameData.uid || (that.clubInfo['admins'] && that.clubInfo['admins'].indexOf(gameData.uid) >= 0)) {
                    $("btn_operation", ref).setVisible(true);
                } else {
                    $("btn_operation", ref).setVisible(false);
                }

                if (userInfo['uid'] == gameData.uid) {
                    $("btn_operation", ref).setVisible(false);
                }
                if (userInfo['uid'] == that.clubInfo['owner_uid']) {
                    $("btn_operation", ref).setVisible(false);
                }
                if ((that.clubInfo['admins'] && that.clubInfo['admins'].indexOf(gameData.uid) >= 0) && (that.clubInfo['admins'] && that.clubInfo['admins'].indexOf(userInfo['uid']) >= 0)) {
                    if (gameData.uid != that.clubInfo['owner_uid']) {
                        $("btn_operation", ref).setVisible(false);
                    }
                }
                TouchUtils.setOnclickListener($("btn_operation", ref), function () {
                    that.showPlayerSetting(userInfo);
                    var pos = ref.convertToWorldSpace(cc.p(0, 0));
                    pos.y += 45;
                    if (pos.y <= 150) {
                        pos.y = 150;
                    }
                    $("setting").setPosition(1050, pos.y);
                })
            };
            var row = $('row', node);
            var _node = $('node1', row);
            setData(_node, i);
            for (var i = 1; i <= 6; i++) {
                $('node' + i, row).setVisible(false);
            }
            $('node1', row).setVisible(true);
        },
        initRoomLayer: function (roomList, result) {
            var that = this;
            that.roomList = roomList;
            if (that.roomList.length <= 0 && NowTabIndex == 2) {
                $('no_info_tip').setString('暂无已开房间')
            } else {
                $('no_info_tip').setString('');
            }
            if (result) {
                that.roomList = result;
            }

            that.initTableView(450);
        },
        initRoomCell: function (cell, idx) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node) {
                return;
            }
            var setData = function (ref) {
                $("room_id", ref).setString(that.roomList[idx].room_id);
                var time = timestamp2time(that.roomList[idx].create_time);
                $("create_time", ref).setString(time);
            };
            var row = $('row', node); //设置信息
            var _node = $('node2', row);
            setData(_node);

            //隐藏node1和node3
            for (var i = 1; i <= 6; i++) {
                $('node' + i, row).setVisible(false);
            }
            $('node2', row).setVisible(true);
            //管理员操作
            if (gameData.uid == this.clubInfo['owner_uid'] || (this.clubInfo['admins'] && (this.clubInfo['admins'].indexOf(gameData.uid) >= 0))) {
                TouchUtils.setOnclickListener($("btn_jiesan", _node), function () {
                    alert22("是否确定解散该房间？", function () {
                        network.send(3003, {daikai_room_id: that.roomList[idx].room_id, force: true});
                    }, function () {
                    }, 'noAnimation');

                });

            }
        },
        initMsgLayer: function (data) {
            var that = this;
            that.msgList = data || [];
            this.club_id = that.clubInfo['_id'];

            if (that.msgList.length <= 0 && NowTabIndex == 3) {
                $('no_info_tip').setString('暂无申请消息')
            } else {
                $('no_info_tip').setString('');
            }

            if (that.tableview) {
                that.tableview.removeFromParent(true);
                that.tableview = null;
            }

            if (that.tableview) {
                tableViewRefresh(that.tableview); //刷新一遍 用于查询
            } else {
                var tableviewLayer = $('tableviewLayer');
                var tableview = new cc.TableView(that, cc.size(tableviewLayer.getContentSize().width, 590));
                tableview.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                tableview.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
                tableview.x = 0;
                tableview.y = 0;
                tableview.setDelegate(that);
                tableview.setBounceable(true);
                tableviewLayer.addChild(tableview);
                that.tableview = tableview;
            }
            hideLoading();
        },
        initMsgCell: function (cell, i) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node) {
                return;
            }
            var userInfo = this.msgList[i];
            var setData = function (ref) {
                $("node3.name", ref).setString(ellipsisStr(userInfo['name'], 6));
                $("node3.id", ref).setString("ID:" + userInfo['uid']);
                if (userInfo['head'] == null || userInfo['head'] == undefined || userInfo['head'] == "") {
                    userInfo['head'] = res.club_defaultHead;
                }
                loadImageToSprite(decodeURIComponent(userInfo['head']), $('node3.head', ref));
                $("node3.time", ref).setString(userInfo['create_time']);

                if (userInfo.type == "comboClub") { //合群消息
                    $('node3.tip2', ref).setString("申请合群时间");
                    $('node3.tip2', ref).setColor(cc.color(255, 0, 0));
                }
            };
            var row = $('row', node); //设置信息
            setData(row);

            //隐藏node1和node2
            for (var i = 1; i <= 6; i++) {
                $('node' + i, row).setVisible(false);
            }
            $('node3', row).setVisible(true);

            var btn_pingbi = $("node3.btn_pingbi", row);
            var btn_jujue = $("node3.btn_jujue", row);
            var btn_tongyi = $("node3.btn_tongyi", row);
            btn_pingbi.setVisible(false);
            btn_jujue.setVisible(false);
            btn_tongyi.setVisible(false);
            //管理员操作
            if (gameData.uid == this.clubInfo['owner_uid'] || (this.clubInfo['admins'] && (this.clubInfo['admins'].indexOf(gameData.uid) >= 0))) {
                btn_jujue.setVisible(true);
                btn_tongyi.setVisible(true);
                TouchUtils.setOnclickListener(btn_pingbi, function () {
                    network.send(2103, {
                        cmd: 'agreeClub', club_id: that.club_id, obj_id: userInfo['uid'],
                        msg_id: userInfo['_id'], name: userInfo['name'], head: userInfo['head'], value: 'ignore'
                    });
                });

                var cmd = userInfo.type == "comboClub" ? 'agreeComboClub' : 'agreeClub';
                var obj_id = userInfo.type == "comboClub" ? userInfo.detail.old_club_id : userInfo['uid'];
                TouchUtils.setOnclickListener(btn_jujue, function () {
                    network.send(2103, {
                        cmd: cmd, club_id: that.club_id, obj_id: obj_id,
                        msg_id: userInfo['_id'], name: userInfo['name'], head: userInfo['head'], value: 'reject'
                    });
                });
                TouchUtils.setOnclickListener(btn_tongyi, function () {
                    network.send(2103, {
                        cmd: cmd, club_id: that.club_id, obj_id: obj_id,
                        msg_id: userInfo['_id'], name: userInfo['name'], head: userInfo['head'], value: 'accept'
                    });
                });
            }
        },
        initLogLayer: function (data) {
            var that = this;
            var logArr = [];
            var selectCMD = ['removeClubMember', 'leaveClub', 'agreeClub', 'addClubMember'];//筛选的日志
            for (var i = 0; i < data.arr.length; i++) {
                for (var j = 0; j < selectCMD.length; j++) {
                    if (selectCMD[j] == data.arr[i].data.cmd) {
                        logArr.push(data.arr[i]);
                    }
                }
            }

            if (NowTabIndex == 4 && logArr.length == 0) { //无数据
                $('no_info_tip').setString('暂无成员日志')
            } else {
                $('no_info_tip').setString('');
            }

            that.logArr = logArr;
            that.initTableView(590);
        },
        initLogCell: function (cell, idx) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node) {
                return;
            }
            var setData = function (ref) {
                $("lb_name", ref).setString(ellipsisStr(that.logArr[idx].data.name, 6) || "");
                $("lb_id", ref).setString(that.logArr[idx].data.uid || that.logArr[idx].data.obj_id);
                $("lb_option_id", ref).setString("操作人ID:" + that.logArr[idx].op);
                if (that.logArr[idx].data.head) {
                    loadImageToSprite(that.logArr[idx].data.head, $('head', ref));
                }
                var name = ellipsisStr(that.logArr[idx].data.name, 6) || that.logArr[idx].data.obj_id || that.logArr[idx].data.uid;
                if (that.logArr[idx].data.cmd == "leaveClub") { //自己离开亲友圈
                    $("lb_option_id", ref).setVisible(false);
                    $("lb_content", ref).setString("离开亲友圈");
                    $("lb_content", ref).setPositionY(38);
                } else if (that.logArr[idx].data.cmd == "agreeClub") { //同意加入亲友圈
                    $("lb_content", ref).setString("同意【" + name + "】加入亲友圈");
                } else if (that.logArr[idx].data.cmd == "addClubMember") { //邀请加入亲友圈
                    $("lb_content", ref).setString("邀请【" + name + "】加入亲友圈");
                } else if (that.logArr[idx].data.cmd == "removeClubMember") { //踢出亲友圈
                    $("lb_content", ref).setString("将【" + name + "】踢出亲友圈");
                }
                $("lb_time", ref).setString(that.logArr[idx].create_time);
            };
            var row = $('row', node); //设置信息
            var _node = $('node4', row);
            setData(_node);

            //隐藏node1和node3
            for (var i = 1; i <= 6; i++) {
                $('node' + i, row).setVisible(false);
            }
            $('node4', row).setVisible(true);
        },
        initDataLayer: function (data) { //用户数据
            var that = this;
            if (NowTabIndex == 5 && data.length == 0) { //无数据
                $('no_info_tip').setString('暂无数据')
            } else {
                $('no_info_tip').setString('');
            }
            that.logDataArr = data;

            $('node_shuju.club_name').setString(that.clubInfo.name);
            $('node_shuju.club_id').setString(that.clubInfo._id);
            if (gameData.uid == that.clubInfo.owner_uid) {
                $('node_shuju.card_bg.card_num').setString(gameData.numOfCards[1] + "张");
            } else {
                $('node_shuju.card_bg').setVisible(false);
            }
            that.initTableView(370);
        },
        initDataCell: function (cell, idx) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node) {
                return;
            }
            var setData = function (ref) {
                $("lb_time", ref).setString(that.logDataArr[idx].date || ""); //日期
                $("lb_player_num", ref).setString(that.logDataArr[idx].activeNumber);//活跃人数
                $("lb_card", ref).setString(that.logDataArr[idx].userCard);//消耗房卡
                $("lb_play_num", ref).setString(that.logDataArr[idx].roomCount);//总场次
                $("lb_all_num", ref).setString(that.logDataArr[idx].fullRoomCount);//完整场次
                $("lb_maxwin_num", ref).setString(that.logDataArr[idx].hasWinnerCount);//大赢家场次
            };
            var row = $('row', node); //设置信息
            var _node = $('node5', row);
            setData(_node);

            //隐藏node1和node3
            for (var i = 1; i <= 6; i++) {
                $('node' + i, row).setVisible(false);
            }
            $('node5', row).setVisible(true);
        },
        getAdminByUid: function (uid) {
            var that = this;
            for (var i = 0; i < that.adminTable.length; i++) {
                if (uid == that.adminTable[i].uid) {
                    return that.adminTable[i];
                }
            }
            return [];
        },
        showBindLayer: function (data) {
            var that = this;
            if (NowTabIndex == 6 && data.length == 0) { //无数据
                $('no_info_tip').setString('暂无数据')
            } else {
                $('no_info_tip').setString('');
            }

            //管理员只能看自己和全部成员
            if (gameData.uid != that.clubInfo.owner_uid) {
                var arr = [];
                for (var i = 0; i < that.adminTable.length; i++) {
                    if (gameData.uid == that.adminTable[i].uid) {
                        arr.push(that.adminTable[i]);
                        break;
                    }
                }
                that.adminTable = arr;
            }

            var JudgeBindMember = function (uid) {
                var members = that.clubInfo['members'];
                var arr = [];
                for (var i = 0; i < members.length; i++) {
                    if (members[i].aid && members[i].aid == uid) {
                        arr.push(members[i]);
                    }
                }
                return arr;
            };

            if (that.adminIdx == undefined) {
                that.adminIdx = gameData.uid;
            }

            cc.log("========that.adminIdx====" + that.adminIdx);
            //帅选当前管理员的人数;
            if (that.adminIdx == -99) {
                that.logBindArr = data;
            } else { //展示管理员绑定的成员信息
                that.logBindArr = [];
                var bindMembers = JudgeBindMember(that.adminIdx); //该管理员绑定的成员
                for (var i = 0; i < bindMembers.length; i++) { //筛选
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].playerId == bindMembers[i].uid) {
                            that.logBindArr.push(data[j]);
                        }
                    }
                }
            }
            that.initTableView(390); //筛选完毕 渲染tableview

            //选中的管理员 //todo  需要优化
            $('node_bind.tip1_1').setVisible(that.adminIdx != -99);
            $('node_bind.tip1_2').setVisible(that.adminIdx != -99);

            $('node_bind.tip1_1').setString('管理员');
            $('node_bind.tip1_2').setString('管理员ID');
            if (that.adminIdx == gameData.uid) { //默认是自己
                if (that.adminIdx == that.clubInfo.owner_uid) {
                    $('node_bind.tip1_1').setString('创建者');
                    $('node_bind.tip1_2').setString('创建者ID');
                }
                $('node_bind.curName').setString("我的成员");
                $('node_bind.admin_name').setString(ellipsisStr(gameData.nickname, 5));
                $('node_bind.admin_id').setString(gameData.uid);
                $('node_bind.lb_bind_num').setString("绑定人数:" + JudgeBindMember(gameData.uid).length);
            } else if (that.adminIdx == -99) {
                $('node_bind.curName').setString("全部成员");
                $('node_bind.admin_name').setString("");
                $('node_bind.admin_id').setString("");
                $('node_bind.lb_bind_num').setString("");
            } else {
                var uid = that.adminIdx;
                var name = that.getAdminByUid(uid).name;
                $('node_bind.curName').setString(ellipsisStr(name, 5));
                $('node_bind.admin_name').setString(ellipsisStr(name, 5));
                $('node_bind.admin_id').setString(uid);
                $('node_bind.lb_bind_num').setString("绑定人数:" + JudgeBindMember(uid).length);
            }
            //管理员面板
            $('node_bind.nameBg').setVisible(false); //默认隐藏管理员面板
            $('node_bind.nameBg').show = false;
            TouchUtils.setOnclickListener($('node_bind.select_bg'), function () {
                if ($('node_bind.nameBg').show) {
                    $('node_bind.nameBg').show = false;
                    $('node_bind.nameBg').setVisible(false);
                } else {
                    $('node_bind.nameBg').show = true;
                    $('node_bind.nameBg').setVisible(true);
                }
            });

            TouchUtils.setOnclickListener($('node_bind.btn_help'), function () {
                that.addChild(new ClubHelpLayer(5));
            });

            //listView展示
            var length = that.adminTable.length + 1;
            if (length > 5) {
                length = 5;
            }

            var listView = $('node_bind.nameBg.ListView');
            listView.removeAllChildren();
            listView.setContentSize(cc.size(listView.getContentSize().width, 52 * length));
            $('node_bind.nameBg').setContentSize(cc.size(listView.getContentSize().width, 52 * length + 5));
            // listView.setScrollBarAutoHideEnabled(true);

            for (var i = 0; i < that.adminTable.length + 1; i++) {
                (function (i) {
                    var custom_item = new ccui.Layout();
                    custom_item.setContentSize(cc.size(199, 52));
                    listView.pushBackCustomItem(custom_item); //添加cell

                    //创建node
                    var node = new ccui.Text();
                    node.setPosition(100, 26);
                    node.setName("cellRow");
                    node.setFontSize(28);
                    node.setTextHorizontalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                    custom_item.addChild(node);

                    var bg_bai = new cc.Sprite($('bg_bai').getTexture());
                    bg_bai.setAnchorPoint(0, 0);
                    bg_bai.setPosition(10, 7);
                    bg_bai.setName('bg_bai');
                    custom_item.addChild(bg_bai, 5);
                    bg_bai.setVisible(false);

                    var itemInfo = that.adminTable[i];
                    if (itemInfo) {
                        node.setString(itemInfo.uid == gameData.uid ? "我的成员" : itemInfo.name);
                        if (itemInfo.uid == that.adminIdx){
                            bg_bai.setVisible(true);
                        }
                    } else {
                        if (that.adminIdx == -99){
                            bg_bai.setVisible(true);
                        }
                        node.setString('全部成员');
                    }

                    var select_touch_bg = new cc.Sprite($('select_touch_bg').getTexture());
                    select_touch_bg.setAnchorPoint(0, 0);
                    custom_item.addChild(select_touch_bg);
                    var TouchIdx = i;
                    TouchUtils.setOnclickListener(select_touch_bg, function (sender) {
                        if (that.adminTable[TouchIdx]) {
                            that.adminIdx = that.adminTable[TouchIdx].uid; //保存当前的admin uid
                            $('node_bind.curName').setString(ellipsisStr(that.adminTable[TouchIdx].name, 5)); //设置当前管理员名字
                        } else {
                            that.adminIdx = -99;
                            $('node_bind.curName').setString("全部成员"); //设置当前管理员名字
                        }

                        var allChild = listView.getChildren();
                        for (var i = 0; i < allChild.length; i++) {
                            allChild[i].getChildByName('bg_bai').setVisible(false);
                        }
                        bg_bai.setVisible(true);
                        that.getBindMemberInfo(null); //更新 改管理员的绑定成员信息
                    }, {"swallowTouches": false});
                })(i);
            }

        },
        initBindCell: function (cell, idx) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node) {
                return;
            }
            var setData = function (ref) {
                $("lb_name", ref).setString(ellipsisStr(that.logBindArr[idx].playerName, 5)); //日期
                $("lb_uid", ref).setString(that.logBindArr[idx].playerId);//活跃人数
                var roomTable = {}; //把几人桌数据存起来
                for (var key in that.logBindArr[idx]) {
                    if (key.indexOf('roomCount') > 0) {
                        roomTable[key] = that.logBindArr[idx][key];
                    }
                }
                var player2Num = that.logBindArr[idx].roomCount2;
                var player3Num = that.logBindArr[idx].roomCount3;
                var player4Num = that.logBindArr[idx].roomCount4;

                $("count1", ref).setString(player2Num);//消耗房卡
                $("count2", ref).setString(player3Num);//总场次
                $("count3", ref).setString(player4Num);//完整场次

                var allCoe = 1 / 2 * player2Num + 1 / 3 * player3Num + 1 / 4 * player4Num;
                $("count4", ref).setString(allCoe.toFixed(2));//大赢家场次
            };
            var row = $('row', node); //设置信息
            var _node = $('node6', row);
            setData(_node);

            //隐藏node1和node3
            for (var i = 1; i <= 6; i++) {
                $('node' + i, row).setVisible(false);
            }
            $('node6', row).setVisible(true);
        },

    });

    exports.ClubMsgLayer = ClubMsgLayer;
})(window);