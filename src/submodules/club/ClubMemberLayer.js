/**
 * Created by hjx on 2018/2/8.
 */
(function () {
    var exports = this;

    var $ = null;


    var ClubMemberLayer = cc.Layer.extend({

        onExit: function () {
            cc.Layer.prototype.onExit.call(this);

            // console.log("onExit ClubMemberLayer");
            cc.eventManager.removeListener(this.list1);
            cc.eventManager.removeListener(this.list2);
            cc.eventManager.removeListener(this.list3);
            cc.eventManager.removeListener(this.list4);
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;

            this.firstIn = false;
            this.list1 = cc.eventManager.addCustomListener('setAdmin', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('成功提升为管理员', 'noAnimation');
                    network.send(2103, {cmd: 'flushClub', club_id: that.clubInfo['_id']});
                }
            });
            this.list2 = cc.eventManager.addCustomListener('unsetAdmin', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('成功删除管理员权限', 'noAnimation');
                    network.send(2103, {cmd: 'flushClub', club_id: that.clubInfo['_id']});
                }
            });
            this.list3 = cc.eventManager.addCustomListener('flushClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0 || data.errorCode == 0) {
                    // that.initUserLayer(getClubData(that.clubInfo['_id']))
                    network.send(2103, {cmd: 'onlineMember', club_id: that.clubInfo['_id']})
                }
            });
            this.list4 = cc.eventManager.addCustomListener('onlineMember', function (event) {
                var data = event.getUserData();
                if (!!that.firstIn) {
                    return;
                }
                that.firstIn = true;
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
                }
            });

            if (that.clubInfo.players_count < 200) {
                network.send(2103, {cmd: 'flushClub', club_id: that.clubInfo['_id']});
            } else {
                var cmd = '/club?cmd=ClubDetail&uid=' + gameData.uid
                    + '&club_id=' + that.clubInfo['_id']
                    + '&area=niuniuBackend'
                    + '&time=' + new Date().getTime()
                var sign = '&sign=' + Crypto.MD5('request:' + cmd);

                showLoading('加载中...');
                NetUtils.httpGet("http://club.yygameapi.com:18800" + cmd + sign,
                    //测试地址 能返回测试数据
                    //httpGet("http://club.yygameapi.com:18800/club?cmd=ClubDetail&uid=1&club_id=11668&area=hbClub&sign=password",
                    function (response) {
                        hideLoading();
                        //修改服务器返回数据 变为正常消息数据
                        var data = JSON.parse(response);
                        data.code = 2103;
                        data.data.command = 'flushClub'
                        // console.log("打印数组长度 " + data.data.info.members.length);
                        network.recv(data);
                        // that.initUserLayer(data.data.info);
                    }, function (response) {
                        hideLoading();
                        // console.log(response);
                        alert11('抱歉，系统繁忙！', 'noAnimation');
                    }
                );
            }

        },
        ctor: function (data) {
            this._super();

            var that = this;

            // var scene = ccs.load(res.ClubMemberLayer_json);
            // this.addChild(scene.node);
            loadNodeCCS(res.ClubMemberLayer_json, this);
            $ = create$(this.getChildByName("Layer"));


            //btn_close
            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root'), function () {
                that.removeFromParent();
            }, {effect: TouchUtils.effects.NONE});


            var inputNode = $('input');
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
            TouchUtils.setOnclickListener($('btn_find'), function () {
                inputNode.didNotSelectSelf();
                var input = inputNode.getString();
                if (input == null || input == undefined || input == "") {
                    var tip = "搜索信息不能为空";
                    alert11(tip, 'noAnimation');
                    return;
                }
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
            });

            this.initUserLayer(data);
            that.hidePlayerSetting();
            return true;
        },

        initUserLayer: function (data, searchList) {
            var that = this;
            that.clubInfo = data;
            that.usersList = data['members'] || [];
            if (searchList) {
                that.usersList = searchList;
            }

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
            // var tList = ownerList.concat(sysList).concat(cyList);
            var sysListOnline = _.filter(sysList, function (obj) {
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
            var tList = ownerList.concat(sysListOnline).concat(sysListOffLine).concat(cyListOnline).concat(cyListOffLine);

            that.usersList = tList;
            // var online_num = sysListOnline.length + cyListOnline.length ;
            // $('total_num').setString('在线人数' + that.onlineMemberNum + '/' + tList.length);
            $('player_num').setString('在线人数' + that.onlineMemberNum);
            $('player_num.total_num').setString('/' + data['members'].length);

            if (that.tableview) {
                var content = that.tableview.getContainer();
                that.tableview.reloadData();

                var viewSize = that.tableview.getViewSize();
                var size = content.getContentSize();
                content.setPositionY(viewSize.height - size.height);
                that.tableview.scrollViewDidScroll(that.tableview);
            } else {
                var tableviewLayer = $('scrolView');
                var tableview = new cc.TableView(that, cc.size(tableviewLayer.getContentSize().width,
                    tableviewLayer.getContentSize().height));
                tableview.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                tableview.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
                tableview.x = 0;
                tableview.y = 0;
                tableview.setDelegate(that);
                tableview.setBounceable(true);
                tableviewLayer.addChild(tableview);
                that.tableview = tableview;
                that.showDeleteBtn = false;
            }
        },
        //tableview  begin
        tableCellTouched: function (table, cell) {
        },
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(1152, 85);
        },
        tableCellAtIndex: function (table, idx) {
            var cell = table.dequeueCell();
            if (cell == null) {
                cell = new cc.TableViewCell();
                var row0 = ccs.load(res.ClubMemberItem_json, 'res/').node;
                row0.setName('cellrow');
                cell.addChild(row0);
            }
            this.initUserCell(cell, idx);
            return cell;
        },
        numberOfCellsInTableView: function (table) {
            return this.usersList.length;
        },
        initUserCell: function (cell, i) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node)  return;
            var userInfo = this.usersList[i];
            var setData = function (ref) {
                $("lb_name", ref).setString(ellipsisStr(userInfo['name'], 6));
                $("lb_id", ref).setString("ID:" + userInfo['uid']);
                $("lb_num", ref).setString(i + 1);
                if (!!userInfo['onLine']) {
                    if (!!userInfo["inRoom"]) {
                        $("lb_states", ref).setString('游戏中');
                        $("lb_states", ref).setTextColor(cc.color(255, 0, 0));
                    } else {
                        $("lb_states", ref).setString('在线');
                        $("lb_states", ref).setTextColor(cc.color(45, 182, 56));
                    }
                } else {
                    $("lb_states", ref).setString('离线');
                    $("lb_states", ref).setTextColor(cc.color(120, 120, 120));
                    // var _time = new Date().getTime();
                    //  todo 显示几天前在线
                    // if(userInfo['lastTime']){
                    //     var _offLineData = Math.floor((_time - userInfo['lastTime']) / 86400000);
                    //     if(_offLineData > 1){
                    //         $("lb_states", ref).setString(_offLineData + '天前');
                    //     }
                    // }
                }
                if (userInfo.head) {
                    if (!cc.sys.isNative) {
                        loadImageToSprite(userInfo.head, $('head', ref), true);
                    } else {
                        cc.log("========="+userInfo.head);
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
                $("btn_operation", ref).setVisible(false);
                TouchUtils.setOnclickListener($("btn_operation", ref), function () {
                    that.showPlayerSetting(userInfo);

                    var pos = ref.convertToWorldSpace(cc.p(0, 0));
                    // console.log(pos);
                    pos.y += 45;
                    if (pos.y <= 150) {
                        pos.y = 150;
                    }
                    $("setting").setPosition(1040, pos.y);
                })
            };
            setData(node);


        },
        hidePlayerSetting: function () {
            $("setting").setVisible(false);
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
                // console.log("setting.grade ---");
                // console.log(userInfo);
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
                // console.log("setting.remove ---");
                alert22('是否删除成员?', function () {
                    var club_id = that.clubInfo['_id'];
                    network.send(2103, {cmd: 'removeClubMember', club_id: club_id, obj_id: userInfo['uid']});
                    that.hidePlayerSetting();
                }, function () {
                }, 'noAnimation');
            });

            // console.log(that.clubInfo);
            if (that.clubInfo.owner_uid != gameData.uid) {
                Filter.grayScale($("setting.grade"));
                TouchUtils.removeListeners($("setting.grade"));
            } else {
                Filter.remove($("setting.grade"));
            }
        },

    });

    exports.ClubMemberLayer = ClubMemberLayer;
})(window);