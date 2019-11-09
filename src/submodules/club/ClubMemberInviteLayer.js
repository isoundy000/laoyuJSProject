/**
 * Created by www on 2018/8/10.
 */
(function () {
    var exports = this;

    var $ = null;
    var clubInfo = null;
    var membersArr = [];

    var ClubMemberInviteLayer = cc.Layer.extend({

        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list4);
            cc.eventManager.removeListener(this.list3);
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;
            this.list3 = cc.eventManager.addCustomListener('onlineMemberInfo', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    membersArr = data['info']['online'];
                    that.initUserLayer();
                }
            });
            this.list4 = cc.eventManager.addCustomListener('onlineMember', function (event) {
                var data = event.getUserData();
                if (data.result == 0 && clubInfo['_id'] && clubInfo['_id'] > 0 && data['info']) {
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
                    this.usersList = clubInfo['members'];
                    membersArr = data['info']['online'];
                    that.initUserLayer();
                }
            });
        },
        ctor: function (data, club_id, max_player_num) {
            this._super();

            var that = this;
            membersArr = [];

            clubInfo = data;
            this.club_id = club_id;
            this.max_player_num = max_player_num;
            this.usersList = clubInfo['members'];

            // var scene = ccs.load(res.ClubMemberInviteLayer_json);
            // this.addChild(scene.node);
            loadNodeCCS(res.ClubMemberInviteLayer_json, this);
            $ = create$(this.getChildByName("Layer"));

            var _clubInfo = getClubData(club_id);
            if (_clubInfo) this._clubName = _clubInfo.name;

            //btn_close
            TouchUtils.setOnclickListener($('btn_back'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('black'), function () {
                that.removeFromParent();
            }, {effect: TouchUtils.effects.NONE});

            network.send(2103, {cmd: 'onlineMemberInfo', club_id: club_id});
            $('showOffLine').setVisible(false);
            // network.send(2103, {cmd: 'onlineMember', club_id: club_id});
            // this.isShieldingOnffLine = true;
            // var func = function () {
            //     that.isShieldingOnffLine = !that.isShieldingOnffLine;
            //     if (that.isShieldingOnffLine) {
            //         $('showOffLine').setSelected(true);
            //     } else {
            //         $('showOffLine').setSelected(false);
            //     }
            //     that.initUserLayer();
            // };
            // TouchUtils.setOnclickListener($('Text_6'), function () {
            //     func();
            // }, {effect: TouchUtils.effects.NONE});
            // $('showOffLine').addEventListener(func);
            return true;
        },

        initUserLayer: function () {
            var that = this;

            this.usersList = membersArr;
            var inRoomMembers = _.filter(this.usersList, function (obj) {
                return obj['s'] == 2;
            });
            var onLineMembers = _.filter(this.usersList, function (obj) {
                return obj['s'] == 1;
            });
            var tList = [];
            tList = tList.concat(onLineMembers).concat(inRoomMembers);
            this.usersList = tList;

            if (that.tableview) {
                var content = that.tableview.getContainer();
                that.tableview.reloadData();

                var viewSize = that.tableview.getViewSize();
                var size = content.getContentSize();
                content.setPositionY(viewSize.height - size.height);
                that.tableview.scrollViewDidScroll(that.tableview);
            } else {
                var tableviewLayer = $('Panel_3');
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
            }
            return;

            this.usersList = clubInfo['members'];

            var sortList = [];
            var inRoomMembers = _.filter(this.usersList, function (obj) {
                return !!obj.inRoom;
            });
            var noInRoomMembers = _.filter(this.usersList, function (obj) {
                return !obj.inRoom;
            })
            var onLineMembers = _.filter(noInRoomMembers, function (obj) {
                return !!obj.onLine;
            });
            var noOnLineMembers = _.filter(noInRoomMembers, function (obj) {
                return !obj.onLine;
            });
            var tList = [];
            if (!this.isShieldingOnffLine) {
                tList = sortList.concat(onLineMembers).concat(inRoomMembers).concat(noOnLineMembers);
            } else {
                tList = sortList.concat(onLineMembers).concat(inRoomMembers);
            }
            this.usersList = tList;


            if (that.tableview) {
                var content = that.tableview.getContainer();
                that.tableview.reloadData();

                var viewSize = that.tableview.getViewSize();
                var size = content.getContentSize();
                content.setPositionY(viewSize.height - size.height);
                that.tableview.scrollViewDidScroll(that.tableview);
            } else {
                var tableviewLayer = $('Panel_3');
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
            }
        },
        //tableview  begin
        tableCellTouched: function (table, cell) {
        },
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(630, 68);
        },
        tableCellAtIndex: function (table, idx) {
            var cell = table.dequeueCell();
            if (cell == null) {
                cell = new cc.TableViewCell();
                var row0 = ccs.load(res.ClubMemberInviteItem_json, 'res/').node;
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
                $("lb_name", ref).setString(ellipsisStr(userInfo['n'], 6));
                $("lb_num", ref).setString(i + 1);
                if (userInfo['s']) {
                    if (userInfo["s"] == 2) {
                        $("lb_states", ref).setString('游戏中');
                        $('btn_invite', ref).setVisible(false);
                        $("lb_states", ref).setTextColor(cc.color(255, 0, 0));
                        $("lb_num", ref).setTextColor(cc.color(255, 0, 0));
                        $("lb_name", ref).setTextColor(cc.color(255, 0, 0));
                    } else if (userInfo["s"] == 1) {
                        $('btn_invite', ref).setVisible(true);
                        $("lb_states", ref).setString('在线');
                        $("lb_states", ref).setTextColor(cc.color(45, 182, 56));
                        $("lb_num", ref).setTextColor(cc.color(45, 182, 56));
                        $("lb_name", ref).setTextColor(cc.color(45, 182, 56));

                        cc.log("=====clubInfoclubInfoclubInfo========");
                        var clubInfo = getClubData(that.club_id);
                        cc.log(clubInfo);
                        var black_list = clubInfo.black_list || [];
                        if(black_list.length > 0){
                            var isfind =  _.filter(black_list, function (uid) {
                                return  userInfo['u'] == uid;
                            });
                            if(isfind.length > 0){
                                $('btn_invite', ref).setVisible(false);
                                $("lb_states", ref).setString('已禁玩');
                            }
                        }
                    }
                }

                TouchUtils.setOnclickListener($('btn_invite', ref), function () {
                    TouchUtils.setClickDisable($('btn_invite', ref), true);
                    Filter.grayScale($('btn_invite', ref));
                    setTimeout(function () {
                        TouchUtils.setClickDisable($('btn_invite', ref), false);
                        Filter.remove($('btn_invite', ref));
                    }, 5000);
                    var wanfaStr = '';
                    if (gameData.mapId >= 300) {
                        wanfaStr = decodeURIComponent(mRoom.wanfa);
                    } else {
                        wanfaStr = decodeURIComponent(gameData.wanfaDesp);
                    }
                    var message = {
                        type: MessageType.Invite,
                        uids: userInfo['u'],
                        room_id: gameData.roomId,
                        player_name: gameData.nickname,
                        // map_id: mRoom.map_id,
                        wanfa_name: that.getWanfaName(), // 方便加几人玩，更好的显示人数
                        wanfa_desc: wanfaStr,
                        club_name: that._clubName ? that._clubName : '',
                    }
                    var data = {
                        cmd: 'BroadcastUid',
                        club_id: that.club_id,
                        uids: userInfo['u'].toString(),
                        data: message,
                        from_uid: gameData.uid,
                    }
                    network.send(2103, data);
                })

            };
            setData(node);
            return;


            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node)  return;
            var userInfo = this.usersList[i];
            var setData = function (ref) {
                $("lb_name", ref).setString(ellipsisStr(userInfo['name'], 6));
                $("lb_num", ref).setString(i + 1);
                if (!!userInfo['onLine']) {
                    if (!!userInfo["inRoom"]) {
                        $("lb_states", ref).setString('游戏中');
                        $('btn_invite', ref).setVisible(false);
                        $("lb_states", ref).setTextColor(cc.color(255, 0, 0));
                        $("lb_num", ref).setTextColor(cc.color(255, 0, 0));
                        $("lb_name", ref).setTextColor(cc.color(255, 0, 0));
                    } else {
                        $('btn_invite', ref).setVisible(true);
                        $("lb_states", ref).setString('在线');
                        $("lb_states", ref).setTextColor(cc.color(45, 182, 56));
                        $("lb_num", ref).setTextColor(cc.color(45, 182, 56));
                        $("lb_name", ref).setTextColor(cc.color(45, 182, 56));
                    }
                } else {
                    $('btn_invite', ref).setVisible(false);
                    $("lb_states", ref).setString('离线');
                    $("lb_states", ref).setTextColor(cc.color(120, 120, 120));
                    $("lb_num", ref).setTextColor(cc.color(120, 120, 120));
                    $("lb_name", ref).setTextColor(cc.color(120, 120, 120));
                }

                TouchUtils.setOnclickListener($('btn_invite', ref), function () {
                    console.log('====' + JSON.stringify(userInfo));
                    TouchUtils.setClickDisable($('btn_invite', ref), true);
                    Filter.grayScale($('btn_invite', ref));
                    setTimeout(function () {
                        TouchUtils.setClickDisable($('btn_invite', ref), false);
                        Filter.remove($('btn_invite', ref));
                    }, 5000);
                    var wanfaStr = '';
                    if (gameData.mapId >= 300) {
                        wanfaStr = decodeURIComponent(mRoom.wanfa);
                    } else {
                        wanfaStr = decodeURIComponent(gameData.wanfaDesp);
                    }
                    var message = {
                        type: MessageType.Invite,
                        uids: userInfo['uid'],
                        room_id: gameData.roomId,
                        player_name: gameData.nickname,
                        // map_id: mRoom.map_id,
                        wanfa_name: that.getWanfaName(), // 方便加几人玩，更好的显示人数
                        wanfa_desc: wanfaStr,
                        club_name: that._clubName ? that._clubName : '',
                    }
                    var data = {
                        cmd: 'BroadcastUid',
                        club_id: that.club_id,
                        uids: userInfo['uid'].toString(),
                        data: message,
                        from_uid: gameData.uid,
                    }
                    network.send(2103, data);
                })

            };
            setData(node);
        },
        getWanfaName: function () {
            var wanfaName = '';
            if (gameData.mapId >= 300) {
                if (mRoom.wanfatype == mRoom.QIYANG) {
                    if (mRoom.erren)
                        wanfaName += "二人落地扫";
                    else
                        wanfaName += "四人落地扫";
                } else if (mRoom.wanfatype == mRoom.HENGYANG) {
                    wanfaName += "衡阳六胡抢";
                } else if (mRoom.wanfatype == mRoom.QIYANG3) {
                    if (mRoom.erren)
                        wanfaName += "二人落地扫";
                    else
                        wanfaName += "三人落地扫";
                } else if (mRoom.wanfatype == mRoom.JIANGYONG) {
                    if (mRoom.erren)
                        wanfaName += "江永十五张(2人)";
                    else if (mRoom.sanren)
                        wanfaName += "江永十五张(3人)";
                    else
                        wanfaName += "江永十五张(4人)";
                } else {
                    if (mRoom.erren) {
                        wanfaName += "火拼二人场";
                    } else {
                        if (mRoom.shouxing) {
                            wanfaName += "坐醒四人场";
                        } else {
                            wanfaName += "永州三人场";
                        }
                    }
                }
            } else if (gameData.mapId >= 200) {
                if (gameData.mapId == MAP_ID.PDK) {
                    wanfaName += '跑得快';
                    var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                    wanfaName = parts[0];
                    if (gameData.wanfaDesp.indexOf('二人') > -1) {
                        wanfaName += '(2人)';
                    } else if (gameData.wanfaDesp.indexOf('三人') > -1) {
                        wanfaName += '(3人)';
                    }
                }
            } else {
                var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
                wanfaName = parts[1];
                if (this.max_player_num == 2) {
                    wanfaName += '（2人）';
                } else if (this.max_player_num == 3) {
                    wanfaName += '（3人）';
                } else if (this.max_player_num == 4) {
                    wanfaName += '（4人）';
                }
            }
            return wanfaName;
        },
    });

    exports.ClubMemberInviteLayer = ClubMemberInviteLayer;
})(window);