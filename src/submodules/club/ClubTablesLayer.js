/**
 * Created by hjx on 2018/2/7.
 */
(function () {
    var exports = this;
    var $ = null;
    var lastBtnIdx = -1;

    var clubid = null;
    var currentWanfaIdx = 0;
    var targetWanfaIdx = 0;
    var isHasWanfaIdx = function (clubInfo, idx) {
        if (!clubInfo.wanfas) {//不存在玩法设置
            return false;
        } else {
            for (var i = 0; i < clubInfo.wanfas.length; i++) {
                var room = clubInfo.wanfas[i];
                if (room.pos == idx) {
                    return room;
                }
            }
        }
        return false;
    }
    var clubRoomMap = null;
    var tablesCount = 10;
    var setPosX = 0;
    var lastEnterTime = 0;
    var timeOutMinute = 5;
    var clubMemberArr = [];
    var clubMemberStateArr = [];
    var wanfaArray = [];
    /**
     * 混桌 拥有几个牌桌类型 队形的人数
     * @type {Array}
     */
    var wanfaPlayerNums = [];

    var ClubTablesLayer = cc.Layer.extend({
        /**
         * @是否在房间内打开亲友圈
         * @true 是
         * @false 不是
         */
        inRoomLayer: false,
        onCCSLoadFinish: function () {
        },
        checkCurrentWanfaIdx: function () {
            currentWanfaIdx = cc.sys.localStorage.getItem('club_pos_' + clubid) || '0';
            if (currentWanfaIdx < 5) {
                var clubInfo = getClubData(clubid);
                if (!parseInt(currentWanfaIdx) && clubInfo && clubInfo.wanfas && clubInfo.wanfas.length >= 1) {
                    currentWanfaIdx = clubInfo.wanfas[0].pos;
                } else if (currentWanfaIdx) {
                    if (!isHasWanfaIdx(clubInfo, currentWanfaIdx)) {
                        if (clubInfo && clubInfo.wanfas && clubInfo.wanfas.length >= 1) {
                            currentWanfaIdx = clubInfo.wanfas[0].pos;
                        }
                    }
                } else {
                    currentWanfaIdx = 1;
                }
            }
            this.refreshBtnBg(currentWanfaIdx);
            this.showWanfaBtns();
            cc.sys.localStorage.setItem('club_pos_' + clubid, currentWanfaIdx);
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;
            this.list1 = cc.eventManager.addCustomListener('flushClub', function (event) {
                var data = event.getUserData();
                that.checkCurrentWanfaIdx();
                that.refreshView('flushClub ');
            });

            this.list2 = cc.eventManager.addCustomListener('addWanfa', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    if(maLayer &&  _.isFunction(maLayer.removeClubRoom)){
                        maLayer.removeClubRoom();
                    }
                    alert11(data.msg, 'noAnimation');
                    network.send(2103, {cmd: 'flushClub', club_id: clubid});
                    if (targetWanfaIdx) {
                        currentWanfaIdx = targetWanfaIdx;
                        cc.sys.localStorage.setItem('club_pos_' + clubid, targetWanfaIdx);
                        targetWanfaIdx = 0;
                        that.refreshBtnBg(currentWanfaIdx);
                    }
                }
            });

            this.list3 = cc.eventManager.addCustomListener('listClubRoom', function (event) {
                var data = event.getUserData();
                var cid = data['club_id'];
                if (cid && cid != clubid) {
                    return;
                }

                var listClubRoom = data['arr'];
                clubRoomMap = {};
                for (var i = 0; i < listClubRoom.length; i++) {
                    var room = listClubRoom[i];
                    if (room.option) {
                        if (_.isString(room.option)) {
                            room.option = JSON.parse(room.option);
                        }
                        if (room.option.pos) {
                            var idx = room.option.pos;
                            if (!clubRoomMap[idx]) {
                                clubRoomMap[idx] = [];
                            }
                            clubRoomMap[idx].push(room);
                        }
                    }
                }
                if (currentWanfaIdx < 5) {
                    var showRooms = clubRoomMap[currentWanfaIdx];
                    that.refreshClubRooms(showRooms);
                } else {
                    // that.refreshUnlimitedRooms(clubRoomMap);
                    if (data.result == -9) {
                        hideLoading();
                        that.refreshUnlimitedRooms([]);
                    } else {
                        that.refreshUnlimitedRooms(clubRoomMap);
                    }
                }
            });
            this.list4 = cc.eventManager.addCustomListener('leaveClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('成功离开亲友圈', 'noAnimation');
                    if (that && cc.sys.isObjectValid(that)) {
                        cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER + '_btn_clubId', 0);
                        cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUBMAIN_LAYER, 0);
                        that.removeFromParent();
                    }
                }
            });
            this.list5 = cc.eventManager.addCustomListener('deleteClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11('成功解散亲友圈', 'noAnimation');
                    cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER + '_btn_clubId', 0);
                    cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUBMAIN_LAYER, 0);
                    that.removeFromParent();
                }
            });
            this.list6 = cc.eventManager.addCustomListener('queryMSG', function (event) {
                var data = event.getUserData();
                if (data['arr']) {
                    var youyongData = [];
                    for (var i = 0; i < data['arr'].length; i++) {
                        var obj = data['arr'][i];
                        if (obj.club_id == clubid) {
                            youyongData.push(obj);
                        }
                    }
                    that.setWeiduMegNum(youyongData.length || 0);
                } else {
                    that.setWeiduMegNum(0);
                }
            });
            this.list7 = cc.eventManager.addCustomListener('queryClub', function (event) {
                var data = event.getUserData();
                that.refreshView('recv queryClub');
            });
            this.list8 = cc.eventManager.addCustomListener('delWanfa', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    alert11(data.msg, 'noAnimation');
                    network.send(2103, {cmd: 'flushClub', club_id: clubid});
                    currentWanfaIdx = 0;
                    that.refreshBtnBg(currentWanfaIdx);
                    cc.sys.localStorage.setItem('club_pos_' + clubid, 0);
                    targetWanfaIdx = 0;
                    $('wanfasp').onclickCallBack();
                }
            });
            this.list9 = cc.eventManager.addCustomListener('onlineMember', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {
                    if (clubid && clubid > 0) {
                        var clubInfo = getClubData(clubid);
                        var clubMembersInfo = clubInfo['members'];
                        clubMemberArr = clubInfo['members'];
                        var onLinesMems = data['info']['online'];
                        for (var i = 0; i < clubMembersInfo.length; i++) {
                            clubMembersInfo[i].onLine = false;
                            clubMembersInfo[i].inRoom = false;
                        }
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
                        var inRoomArr = _.filter(clubMembersInfo, function (obj) {
                            return !!obj.inRoom;
                        });
                        var noRoomArr = _.filter(clubMembersInfo, function (obj) {
                            return !obj.inRoom;
                        });
                        var onLineArr = _.filter(noRoomArr, function (obj) {
                            return !!obj.onLine;
                        })
                        clubMemberStateArr = [];
                        clubMemberStateArr = clubMemberStateArr.concat(onLineArr).concat(inRoomArr);
                        that.refreshTablesMemberStates();
                    }

                }
            });
            this.list10 = cc.eventManager.addCustomListener('modifyClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0 && parseInt(data.modifyName) > 0) alert11("亲友圈名称修改成功", 'noAnimation');
                if (data.result == 0 && parseInt(data.modifyNotice) > 0) alert11("公告修改成功", 'noAnimation');
            });
            this.list11 = cc.eventManager.addCustomListener('ClubParamSet', function (event) {
                var data = event.getUserData();
                if (data.result == 0) {

                }
            });


            network.send(2103, {cmd: 'updateLocal', club_id: clubid, location: 1});
            if (!this.inRoomLayer) {
                network.addListener(3003, function () {
                    alert11('房间已解散', 'noAnimation');
                    network.send(2103, {cmd: 'listClubRoom', club_id: clubid, reason: "房间已解散"});
                })
            }
            network.send(2103, {cmd: 'queryMSG', club_id: clubid});
            network.send(2103, {cmd: 'flushClub', club_id: clubid});
            network.send(2103, {cmd: 'onlineMember', club_id: clubid});
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
            cc.eventManager.removeListener(this.list2);
            cc.eventManager.removeListener(this.list3);
            cc.eventManager.removeListener(this.list4);
            cc.eventManager.removeListener(this.list5);
            cc.eventManager.removeListener(this.list6);
            cc.eventManager.removeListener(this.list7);
            cc.eventManager.removeListener(this.list8);
            cc.eventManager.removeListener(this.list9);
            cc.eventManager.removeListener(this.list10);
            cc.eventManager.removeListener(this.list11);

            network.send(2103, {cmd: 'updateLocal', club_id: clubid, location: 0});
            if (this._tableView && cc.sys.isObjectValid(this._tableView)) {
                this._tableView.removeFromParent(true);
                this._tableView.release();
                this._tableView = null;
            }
        },
        ctor: function (_id, inRoomLayer) {
            this._super();
            this.inRoomLayer = !!inRoomLayer;
            lastEnterTime = getCurTimestamp();
            cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER + '_btn_clubId', _id);
            cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUBMAIN_LAYER, 1);
            var that = this;

            var mainscene = loadNodeCCS(res.ClubTablesLayer_json, this);
            $ = create$(mainscene.node);

            this._dataArr = [];

            cc.sys.localStorage.setItem('activityOpen', new Date().getTime());

            if (gameData.mapId >= 300 && this.inRoomLayer && mRoom.club_id) {
                network.sendPhz(5000, "clubTablesLayer/this.inRoomLayer:true");
            }

            clubid = _id;
            var clubInfo = getClubData(clubid);
            this.checkCurrentWanfaIdx();

            // 公告
            $('gonggao').setVisible(true);
            var notice = clubInfo["notice"] == "" ? "暂无公告！" : clubInfo["notice"];
            if (!notice) {
                notice = "欢迎加入亲友圈！";
            }
            if (notice) {
                $('gonggao').setVisible(true);
                var gongGText = $('gonggao.panel.textContent');
                gongGText.setContentSize(cc.size(notice.length * 23, 25));
                gongGText.setString(notice);
                var panelWid = $('gonggao.panel').getContentSize().width;
                var posXStart = $('gonggao.panel').getPositionX() + panelWid / 2;
                var posXEnd = -notice.length * 23 + $('gonggao.panel').getPositionX() - panelWid;
                gongGText.setPositionX(posXStart);
                var _time = Math.round(notice.length * 23 / 100);
                if (_time < 10) {
                    _time = 10;
                }
                var _action = gongGText.runAction(
                    cc.sequence(
                        cc.moveTo(_time, posXEnd, 2)
                        , cc.delayTime(1)
                        , cc.callFunc(function () {
                            gongGText.stopAllActions();
                            gongGText.setPositionX(posXStart);
                            // console.log('===============time : ' + _time);
                            gongGText.runAction(_action);
                        })
                    ));
            } else {
                $('gonggao').setVisible(false);
            }

            TouchUtils.setOnclickListener($('root'), function () {

            });

            TouchUtils.setOnclickListener($('btn_close'), function () {
                if (that.inRoomLayer) {
                    that.removeFromParent(true);
                    return;
                }
                var clubml = that.getParent();
                clubml.resetSelectClubId();//重置选中亲友圈id
                cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER + '_btn_clubId', 0);
                cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUBMAIN_LAYER, 0);
                that.removeFromParent(true);
            });

            var wanfaState = 1;
            TouchUtils.setOnclickListener($('wanfasp.node.root'), function () {
                $('wanfasp').onclickCallBack();
            });
            TouchUtils.setOnclickListener($('wanfasp'), function () {
                $('wanfasp.node').setVisible(true);
                that.showWanfaBtns();
            });
            $('wanfasp.node').setVisible(true);
            for (var i = 1; i <= 4; i++) {
                (function (idx) {
                    var btn = $('wanfasp.node.list.btn_' + idx);
                    TouchUtils.setOnclickListener(btn, function () {
                        $('btn_createRoom').setVisible(false);
                        $('btn_quickJoin').setVisible(true);
                        var _clubInfo = getClubData(clubid);
                        if (isHasWanfaIdx(_clubInfo, idx)) {
                            if(lastBtnIdx == idx){
                                return;
                            }
                            lastBtnIdx = idx;
                            showLoading("加载中...");
                            currentWanfaIdx = idx;
                            that.refreshBtnBg(currentWanfaIdx);
                            cc.sys.localStorage.setItem('club_pos_' + clubid, idx);
                            if (currentWanfaIdx >= 1) {
                                $('icon_wanfa').setTexture('res/submodules/club/img/icon_wanfa' + currentWanfaIdx + '.png');
                                // if (cc.sys.isNative)
                                    // $('club_bg_1').setTexture('res/submodules/club/img/club_bg' + currentWanfaIdx + '.jpg');
                            }
                            that.showRooms(_clubInfo.wanfas, idx, 'wanfasp.node.list.btn_' + idx);
                        } else {
                            if (_clubInfo['owner_uid'] == gameData.uid || (_clubInfo['admins'] && _clubInfo['admins'].indexOf(gameData.uid) >= 0)) {
                                targetWanfaIdx = idx;
                                // window.maLayer.createClubRoom(false, 0, clubid, idx);
                                if (!that.inRoomLayer) {
                                    window.maLayer.createClubRoom(clubid, idx);
                                }
                                //cc.sys.localStorage.setItem('club_pos_' + clubid, idx);
                            } else {
                                alert11('只有群主与管理员才有设置玩法权限', 'noAnimation');
                            }
                        }
                        $('wanfasp').onclickCallBack();
                    })

                    var btn_clear = $('wanfasp.node.list.btn_' + idx + ".btn_clear");
                    TouchUtils.setOnclickListener(btn_clear, function () {
                        alert22('是否确定删除玩法设置？', function () {
                            // console.log("清除玩法 " + idx);
                            network.send(2103, {
                                cmd: 'delWanfa',
                                club_id: clubid,
                                pos: idx
                            });
                        }, function () {
                        }, 'noAnimation');
                    })
                })(i);
            }
            if (!clubInfo.wanfas) {//不存在玩法设置
                $('meinv').setVisible(true);
            } else {
                $('meinv').setVisible(false);
            }
            //展示自由玩法
            TouchUtils.setOnclickListener($('wanfasp.node.list.btn_5'), function () {
                if (lastBtnIdx == 5){
                    return;
                }
                lastBtnIdx = 5;
                currentWanfaIdx = 5;
                showLoading("加载中...");
                that.refreshBtnBg(currentWanfaIdx);
                cc.sys.localStorage.setItem('club_pos_' + clubid, currentWanfaIdx);
                network.send(2103, {
                    cmd: 'listClubRoom',
                    club_id: clubid,
                    reason: 'wanfasp.node.list.btn_5' + ' showRooms'
                });
            });



            //玩法设置
            TouchUtils.setOnclickListener($('wanfa_bg'), function () {
            }, {swallowTouches: true, effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($('wanfa_bg.btn_wanfa'), function () {
                window.maLayer.createClubRoom(clubid, currentWanfaIdx);
            }, {swallowTouches: true});


            //邀请
            TouchUtils.setOnclickListener($('btn_invite'), function () {
                that.addChild(new ClubInviteLayer(getClubData(clubid)));
            });

            //分享
            TouchUtils.setOnclickListener($('btn_share'), function () {
                var clubInfo = getClubData(clubid);
                that.addChild(new ShareTypeLayer(null, null, null, null, clubInfo))
            });


            var refreshTime = 0;
            TouchUtils.setOnclickListener($('btn_refresh'), function () {
                // network.send(2103, {cmd:'queryClub'});

                if (new Date().getTime() - refreshTime < 2000) {
                    alert11('您的刷新频率过于频繁，请稍后再试', 'noAnimation');
                    return;
                }
                refreshTime = new Date().getTime();

                network.send(2103, {cmd: 'flushClub', club_id: clubid});
                network.send(2103, {cmd: 'listClubRoom', club_id: clubid, reason: "click btn_refresh"});
                network.send(2103, {cmd: 'queryMSG', club_id: clubid});
                network.send(2103, {cmd: 'onlineMember', club_id: clubid});
            });
            TouchUtils.setOnclickListener($('btn_zhanbang'), function () {
                // try {
                    that.addChild(new ClubZhanBangLayer(clubid, getClubData(clubid)));
                // } catch (e) {
                //     console.log('error : e = ' + e.toString());
                // }
            });
            TouchUtils.setOnclickListener($('btn_sys'), function () {
                that.addChild(new ClubMsgLayer(clubid, $("btn_sys.numbg.num").getString()));
                that.setWeiduMegNum(0);
            });

            TouchUtils.setOnclickListener($('btn_zhanji'), function () {
                // try {
                    that.addChild(new ClubZhanji(clubid));
                // } catch (e) {
                //     console.log('error : e = ' + e.toString());
                // }
            });

            TouchUtils.setOnclickListener($('btn_member'), function () {
                that.addChild(new ClubMemberLayer(getClubData(clubid)));
            });


            if (that.isSelfAdministration()) {
                $('btn_sys').setVisible(true);
                $('btn_member').setVisible(false);
            } else {
                $('btn_sys').setVisible(false);
                $('btn_member').setVisible(true);
            }
            var func = function (type) {
                if (type == 'btn_wanfa') {
                    if ($('wanfasp.node.btn_member.on')) $('wanfasp.node.btn_member.on').setVisible(false);
                    if ($('wanfasp.node.btn_wanfa.on')) $('wanfasp.node.btn_wanfa.on').setVisible(true);
                    $('wanfasp.node.list').setVisible(true);
                    $('wanfasp.node.mem_node').setVisible(false);
                } else if (type == 'btn_member') {
                    if ($('wanfasp.node.btn_member.on')) $('wanfasp.node.btn_member.on').setVisible(true);
                    if ($('wanfasp.node.btn_wanfa.on')) $('wanfasp.node.btn_wanfa.on').setVisible(false);
                    $('wanfasp.node.list').setVisible(false);
                    $('wanfasp.node.mem_node').setVisible(true);
                }
            };
            TouchUtils.setOnclickListener($('wanfasp.node.btn_member'), function () {
                var clubInfo = getClubData(clubid);
                var clubMembersInfo = clubInfo['members'];
                if(!clubMemberArr)return;

                if (clubInfo.players_count > 200 && clubMemberArr.length < 200) {
                    var cmd = '/club?cmd=ClubDetail&uid=' + gameData.uid
                        + '&club_id=' + clubid
                        + '&area=niuniuBackend'
                        + '&time=' + new Date().getTime();
                    var sign = '&sign=' + Crypto.MD5('request:' + cmd);
                    showLoading('获取成员列表中...');

                    NetUtils.httpGet("http://club.yygameapi.com:18800" + cmd + sign,
                        function (response) {
                            hideLoading();
                            var data = JSON.parse(response);
                            clubInfo['members'] = data['data']['info']['members'];
                            func('btn_member');
                            network.send(2103, {cmd: 'onlineMember', club_id: clubid});
                        }, function (response) {
                            hideLoading();
                            alert1('抱歉，系统繁忙！');
                        }
                    );
                } else {
                    func('btn_member');
                    network.send(2103, {cmd: 'onlineMember', club_id: clubid});
                }
                return;
            });
            TouchUtils.setOnclickListener($('wanfasp.node.btn_wanfa'), function () {
                func('btn_wanfa');
            });
            $('wanfasp.node.btn_wanfa').onclickCallBack();

            // 从俱乐部房间界面到的俱乐部 大厅界面。
            if (this.inRoomLayer && $('showRoomNode')) {
                $('showRoomNode').setPositionX(cc.winSize.width / 2 - 1280 / 2 - 50);

                this.showRoomNode = $('showRoomNode');
                this.showRoomNode.setVisible(true);
                $('lb_roomId', this.showRoomNode).setString(gameData.roomId);

                TouchUtils.setOnclickListener($('info_panel_3', this.showRoomNode), function () {
                }, {effect: TouchUtils.effects.NONE});
                TouchUtils.setOnclickListener($('btn_backRoom', this.showRoomNode), function () {
                    that.removeFromParent(true);
                });
                TouchUtils.setOnclickListener($('btn_quitRoom', this.showRoomNode), function () {
                    if (gameData.mapId < 300) {
                        alert2('确定要退出房间吗?', function () {
                            clearGameMWRoomId();
                            network.send(3003, {room_id: gameData.roomId});
                        }, null, false, true, true);
                    } else {
                        alert2('确定要退出房间吗?', function () {
                            clearGameMWRoomId();
                            network.sendPhz(3003, "Quit/" + gameData.roomId);
                        }, null, false, true, true);
                    }
                });
                this.refreshPlayersStates();
            } else {
                if ($('showRoomNode')) $('showRoomNode').setVisible(false);
            }

            // 公告
            $('gonggao').setVisible(true);
            var notice = clubInfo["notice"] == "" ? "暂无公告！" : clubInfo["notice"];
            if (!notice) {
                notice = "欢迎加入俱乐部！";
            }
            if (notice) {
                $('gonggao').setVisible(true);
                var gongGText = $('gonggao.panel.textContent');
                gongGText.setContentSize(cc.size(notice.length * 23, 25));
                gongGText.setString(notice);
                var panelWid = $('gonggao.panel').getContentSize().width;
                var posXStart = $('gonggao.panel').getPositionX() + panelWid / 2;
                var posXEnd = -notice.length * 23 + $('gonggao.panel').getPositionX() - panelWid;
                gongGText.setPositionX(posXStart);
                var _time = Math.round(notice.length * 23 / 100);
                if (_time < 10) {
                    _time = 10;
                }
                var _action = gongGText.runAction(
                    cc.sequence(
                        cc.moveTo(_time, posXEnd, 2)
                        , cc.delayTime(1)
                        , cc.callFunc(function () {
                            gongGText.stopAllActions();
                            gongGText.setPositionX(posXStart);
                            console.log('===============time : ' + _time);
                            gongGText.runAction(_action);
                        })
                    ));
            } else {
                $('gonggao').setVisible(false);
            }

            TouchUtils.setOnclickListener($('btn_member'), function () {
                that.addChild(new ClubMemberLayer(getClubData(clubid)));
            });

            TouchUtils.setOnclickListener($('btn_details'), function () {
                that.addChild(new ClubNoticeLayer(getClubData(clubid), NoticeType.wanfaDetails, clubid, currentWanfaIdx, that.inRoomLayer));
            });

            if (that.inRoomLayer) {
                TouchUtils.setClickDisable($('btn_quickJoin'), true);
                TouchUtils.setClickDisable($('btn_set'), true);
                TouchUtils.setClickDisable($('btn_invite'), true);
                TouchUtils.setClickDisable($('btn_zhanji'), true);
                TouchUtils.setClickDisable($('btn_member'), true);
                TouchUtils.setClickDisable($('btn_sys'), true);
                TouchUtils.setClickDisable($('btn_createRoom'), true);
                Filter.grayScale($('btn_quickJoin'));
                Filter.grayScale($('btn_set'));
                Filter.grayScale($('btn_invite'));
                Filter.grayScale($('btn_zhanji'));
                Filter.grayScale($('btn_member'));
                Filter.grayScale($('btn_sys'));
                Filter.grayScale($('btn_createRoom'));
            } else {
                try {
                    // var quickJoinRoom = playSpAnimation("quickJoinRoom", 'animation', true);
                    // quickJoinRoom.setPosition(cc.p(153, 26));
                    // $('btn_quickJoin').addChild(quickJoinRoom);
                } catch (e) {
                    console.log('error to load : ' + e.toString());
                }
            }
            /**
             * 快速加入策略
             * 1.非混合牌桌
             * 2.混合牌桌。一、只有一种房间类型，快速加入方法同 非混合牌桌的。（一种房间类型，就是人数选择只有一种的）
             *           二、有多种房间类型，快速加入会有弹窗 弹出提示选择一种房间类型。
             */
            TouchUtils.setOnclickListener($('btn_createRoom'), function () {
                var clubInfo = getClubData(clubid);
                if (clubInfo.param && clubInfo.param.free_play) {
                    if (clubInfo.param.free_play == "open") {
                        window.maLayer.createClubRoom(clubid, 5);
                        return;
                    }
                }
                alert1("自由玩法未开启，请联系群主")
            });
            TouchUtils.setOnclickListener($('btn_quickJoin'), function () {
                // that.addChild(new ClubMemberLayer(getClubData(clubid)));
                if (that.checkTimeOut()) {
                    return;
                }

                // 首先看玩法是几人玩的
                var clubInfo = getClubData(clubid);
                var wanfaObj = isHasWanfaIdx(clubInfo, currentWanfaIdx);
                if(!wanfaObj){
                    alert11("请设置玩法");
                    return;
                }
                var isHunzhuo = JSON.parse(wanfaObj['options'])['hunzhuo'];

                //判断是否禁玩
                var black_list = clubInfo.black_list || [];
                if (black_list.length > 0) {
                    var isfind = _.filter(black_list, function (uid) {
                        return gameData.uid == uid;
                    });
                    if (isfind.length > 0) {
                        alert11("你已被管理员禁玩,请联系管理员");
                        return;
                    }
                }

                gameData.enterRoomWithClubID = clubid;

                if (wanfaArray && wanfaArray.length > 1 // 混合牌桌
                    && (isHunzhuo || (wanfaObj['map_id'] == MAP_ID.HONGZHONG
                    || wanfaObj['map_id'] == MAP_ID.ZHUANZHUAN
                    || wanfaObj['map_id'] == MAP_ID.CHANGSHA
                    || wanfaObj['map_id'] == MAP_ID.SICHUAN_MZ
                    || wanfaObj['map_id'] == MAP_ID.SICHUAN_TRLF
                    || wanfaObj['map_id'] == MAP_ID.PDK))) {
                    //
                    that.addChild(new ClubNoticeLayer(wanfaPlayerNums, NoticeType.quickJoin));
                } else {
                    var playerCount = getWanfaPlayerCountByMapId(wanfaObj ? wanfaObj['map_id'] : 0);
                    if (wanfaObj) {
                        if (wanfaObj['desc'].indexOf('二人') >= 0 || wanfaObj['desc'].indexOf('2人') >= 0) {
                            playerCount = 2;
                        } else if (wanfaObj['desc'].indexOf('三人') >= 0 || wanfaObj['desc'].indexOf('3人') >= 0) {
                            playerCount = 3;
                        } else if (wanfaObj['desc'].indexOf('四人') >= 0 || wanfaObj['desc'].indexOf('4人') >= 0) {
                            playerCount = 4;
                        }
                    }
                    var joinType = 0; // 非混合牌桌，混合牌桌设为 joinType = 1
                    if (wanfaArray && wanfaArray.length == 1
                        && (wanfaObj['map_id'] == MAP_ID.HONGZHONG
                        || wanfaObj['map_id'] == MAP_ID.ZHUANZHUAN
                        || wanfaObj['map_id'] == MAP_ID.CHANGSHA
                        || wanfaObj['map_id'] == MAP_ID.SICHUAN_MZ
                        || wanfaObj['map_id'] == MAP_ID.SICHUAN_TRLF
                        || wanfaObj['map_id'] == MAP_ID.PDK)) {
                        var data = that._dataArr[0]['roomInfo'];
                        if (data) {
                            if (data.desc.indexOf('2人') >= 0 || data.desc.indexOf('二人') >= 0 || data.desc.indexOf('两人') >= 0) {
                                playerCount = 2;
                            } else if (data.desc.indexOf('3人') >= 0 || data.desc.indexOf('三人') >= 0) {
                                playerCount = 3;
                            } else if (data.desc.indexOf('4人') >= 0 || data.desc.indexOf('四人') >= 0) {
                                playerCount = 4;
                            }
                            joinType = 1;
                        }
                    }

                    var isJoinRoomOk = false;
                    // 找人数不满的房间
                    for (var j = playerCount - 1; j >= 0; j--) {
                        var isBreak = false;
                        for (var i = 0; i < that._dataArr.length; i++) {
                            var data = that._dataArr[i];
                            if (joinType) {
                                if (data['roomData']) {
                                    data = data['roomData'];
                                } else {
                                    data = '';
                                }
                            }
                            if (data != '') {
                                if (data['cur_player_cnt'] == j) {
                                    showLoading('正在加入房间.');
                                    network.send(3002, {
                                        room_id: '' + data.room_id
                                    });
                                    isJoinRoomOk = true;
                                    isBreak = true;
                                    break;
                                }
                            }
                        }
                        if (isBreak) {
                            break;
                        }
                    }
                    console.log('i : ' + i + '   =====   j : ' + j);
                    // 如果没有加入房间, 从前往后找 空的没有roomId 的房间
                    if (!isJoinRoomOk) {
                        for (var i = 0; i < that._dataArr.length; i++) {
                            var data = that._dataArr[i];
                            if (joinType) {
                                if (data['roomData']) {
                                    data = data['roomData'];
                                } else {
                                    data = '';
                                }
                            }
                            if (data == '') {
                                var info = getClubCurrentWanfaInfo();
                                if (joinType) {
                                    info = that._dataArr[i]['roomInfo'];
                                }
                                if (info) {
                                    var options = info.options;
                                    if (!options) {
                                        continue;
                                    }
                                    if (_.isString(options)) {
                                        options = JSON.parse(options)
                                    }
                                    options.pos = currentWanfaIdx;
                                    options.place = i;
                                    console.log('options.place : ========== : ' + options.place);
                                    options.desp = info.desc;
                                    showLoading('正在加入房间..');
                                    var last3001Data = {
                                        room_id: 0
                                        , club_id: options['club_id']
                                        , map_id: options['mapid']//gameData.appId
                                        , mapid: options['mapid']
                                        , daikai: true
                                        , options: options
                                        , timestamp: getCurrentTimeMills()
                                    }
                                    gameData.last3001Data = last3001Data;
                                    network.send(3001, last3001Data);
                                    break;
                                }
                            }
                        }
                    }
                }
            });

            var func = function (type) {
                if (type == 'btn_wanfa') {
                    $('wanfasp.node.btn_member').setTexture('res/submodules/club/img/btn_member_tab1.png');
                    $('wanfasp.node.btn_wanfa').setTexture('res/submodules/club/img/btn_wanfa_tab2.png');
                    $('wanfasp.node.list').setVisible(true);
                    $('wanfasp.node.mem_node').setVisible(false);
                } else if (type == 'btn_member') {
                    $('wanfasp.node.btn_member').setTexture('res/submodules/club/img/btn_member_tab2.png');
                    $('wanfasp.node.btn_wanfa').setTexture('res/submodules/club/img/btn_wanfa_tab1.png');
                    $('wanfasp.node.list').setVisible(false);
                    $('wanfasp.node.mem_node').setVisible(true);
                }
            };
            TouchUtils.setOnclickListener($('wanfasp.node.btn_member'), function () {
                var clubInfo = getClubData(clubid);
                var clubMembersInfo = clubInfo['members'];
                if (clubInfo.players_count > 200 && clubMemberArr.length < 200) {
                    var cmd = '/club?cmd=ClubDetail&uid=' + gameData.uid
                        + '&club_id=' + clubid
                        + '&area=niuniuBackend'
                        + '&time=' + new Date().getTime();
                    var sign = '&sign=' + Crypto.MD5('request:' + cmd);
                    showLoading('获取成员列表中...');

                    NetUtils.httpGet("http://club.yygameapi.com:18800" + cmd + sign,
                        function (response) {
                            hideLoading();
                            var data = JSON.parse(response);
                            clubInfo['members'] = data['data']['info']['members'];
                            func('btn_member');
                            network.send(2103, {cmd: 'onlineMember', club_id: clubid});
                        }, function (response) {
                            hideLoading();
                            alert11('抱歉，系统繁忙！');
                        }
                    );
                } else {
                    func('btn_member');
                    network.send(2103, {cmd: 'onlineMember', club_id: clubid});
                }
                return;
            });
            TouchUtils.setOnclickListener($('wanfasp.node.btn_wanfa'), function () {
                func('btn_wanfa');
            });
            $('wanfasp.node.btn_wanfa').onclickCallBack();

            //设置
            TouchUtils.setOnclickListener($('btn_set'), function () {
                that.addChild(new ClubSettingLayer(clubid));
            });
            that.refreshView('firstIn ClubTablesLayer');

            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if(subArr)  sub = subArr['club'];
            var versiontxt = window.curVersion + "-" + sub;
            if(cc.sys.os == cc.sys.OS_IOS && versiontxt){
                var regx = new RegExp('\\.', 'g');
                versiontxt = versiontxt.replace(regx, '');
            }
            $("lbl_version").setString('Ver.' + versiontxt);

            if (gameData.InClubZhanjiLayer) {
                gameData.InClubZhanjiLayer = false;
               // that.addChild(new ClubZhanji(clubid));
            }

            // 从亲友圈房间界面到的亲友圈 大厅界面。
            if (this.inRoomLayer && $('showRoomNode')) {
                this.showRoomNode = $('showRoomNode');
                this.showRoomNode.setVisible(true);
                $('lb_roomId', this.showRoomNode).setString(gameData.roomId);

                TouchUtils.setOnclickListener($('info_panel_3', this.showRoomNode), function () {
                }, {effect: TouchUtils.effects.NONE});
                TouchUtils.setOnclickListener($('btn_backRoom', this.showRoomNode), function () {
                    that.removeFromParent(true);
                });
                TouchUtils.setOnclickListener($('btn_quitRoom', this.showRoomNode), function () {
                    if (gameData.mapId < 300) {
                        alert22('确定要退出房间吗?', function () {
                            network.send(3003, {room_id: gameData.roomId,leaveOnly: true});
                        }, null, false, true, true);
                    } else {
                        alert22('确定要退出房间吗?', function () {
                            network.sendPhz(3003, "Quit/" + gameData.roomId);
                        }, null, false, true, true);
                    }
                });
                this.refreshPlayersStates();
            } else {
                if ($('showRoomNode')) $('showRoomNode').setVisible(false);
            }

            //营业时间
            var yyopen = clubInfo['openingtime'] || 'closed';
            var stime = clubInfo['start'] || '0:0';
            var etime = clubInfo['end'] || '0:0';

            var isopen = getIsOpenState(stime, etime);
            if (yyopen == 'open' && !isopen) {//开启了时间 并且不在范围内
                 this.addChild(new ClubDayangLayer(stime, etime, 1));
            }


            return true;
        },
        quickJoinHunzhuoNum: function (playerCount) {
            console.log('===================playerCount : ' + playerCount);
            var that = this;
            showLoading('正在匹配' + playerCount + '人..');
            var isJoinRoomOk = false;
            // 找人数不满的房间
            var joinType = 1;
            for (var j = playerCount - 1; j >= 0; j--) {
                var isBreak = false;
                for (var i = 0; i < that._dataArr.length; i++) {
                    var data = that._dataArr[i];
                    if (joinType) {
                        if (data['roomData']) {
                            data = data['roomData'];
                        } else {
                            data = '';
                        }
                    }
                    if (data != '') {
                        if (data['max_player_cnt'] != playerCount) { //不是选定人数的房间
                            continue;
                        }
                        if (data['cur_player_cnt'] == j) {
                            showLoading('正在加入房间.');
                            network.send(3002, {
                                room_id: '' + data.room_id
                            });
                            isJoinRoomOk = true;
                            isBreak = true;
                            break;
                        }
                    }
                }
                if (isBreak) {
                    break;
                }
            }
            console.log('i : ' + i + '   =====   j : ' + j);
            // 如果没有加入房间, 从前往后找 空的没有roomId 的房间
            if (!isJoinRoomOk) {
                for (var i = 0; i < that._dataArr.length; i++) {
                    var data = that._dataArr[i];
                    if (joinType) {
                        if (data['roomData']) {
                            data = data['roomData'];
                        } else {
                            data = '';
                        }
                    }
                    if (data == '') {
                        var info = getClubCurrentWanfaInfo();
                        if (joinType) {
                            info = that._dataArr[i]['roomInfo'];
                        }
                        if (info) {
                            if (info.max_player_cnt != playerCount) { //不是选定人数的房间
                                continue;
                            }
                            var options = info.options;
                            if (!options) {
                                continue;
                            }
                            if (_.isString(options)) {
                                options = JSON.parse(options)
                            }
                            options.pos = currentWanfaIdx;
                            options.place = i;
                            console.log('options.place : ========== : ' + options.place);
                            options.desp = info.desc;
                            showLoading('正在加入房间..');
                            network.send(3001, {
                                room_id: 0
                                , club_id: options['club_id']
                                , map_id: options['mapid']//gameData.appId
                                , mapid: options['mapid']
                                , daikai: true
                                , options: options

                            });
                            break;
                        }
                    }
                }
            }
        },
        refreshPlayersStates: function () {
            var playerStr = '';
            if (gameData.mapId == MAP_ID.NN || gameData.mapId == MAP_ID.DN || gameData.mapId == MAP_ID.DN_JIU_REN || gameData.mapId == MAP_ID.DN_AL_TUI || gameData.mapId == MAP_ID.DN_WUHUA_CRAZY) {
                playerStr += gameData.players.length + '/' + gameData.maxPlayerNum;
            } else {
                playerStr += gameData.players.length + '/' + gameData.playerNum;
            }
            $('lb_person', this.showRoomNode).setString(playerStr);
            var playeresFunc = function (cell, i) {
                $('lb_name', cell).setString(ellipsisStr((gameData.players[i].NickName || gameData.players[i].nickname), 5));
                if (gameData.players[i]['ready'] && gameData.players[i]['ready'] == 1) {
                    $('lb_ready', cell).setString('已准备');
                    $('lb_ready', cell).setTextColor(cc.color(17, 172, 38));
                } else {
                    $('lb_ready', cell).setString('未准备');
                    $('lb_ready', cell).setTextColor(cc.color(220, 20, 25));
                }
            };
            var parent = $('playerView', this.showRoomNode);
            var cell0 = $('user0', this.showRoomNode);
            cell0.setVisible(false);
            if (gameData.players) {
                var viewHight = 50 * gameData.players.length;
                parent.removeAllChildren();

                var innerHeight = parent.getContentSize().height;
                if (viewHight >= innerHeight) {
                    innerHeight = viewHight;
                }
                parent.innerHeight = innerHeight;
                parent.setInnerContainerSize(cc.size(230, viewHight));
                for (var i = 0; i < gameData.players.length; i++) {
                    var cell = parent.getChildByName('cell' + i);
                    if (!cell) {
                        cell = duplicateSprite(cell0);
                        cell.setName('cell' + i);
                        cell.setVisible(true);
                        parent.addChild(cell);
                    }
                    cell.setPosition(cc.p(0, innerHeight - 50 * i - 50));
                    playeresFunc(cell, i);
                }
            }
        },
        refreshTablesMemberStates: function () {
            if (!$ || !$('wanfasp.node.mem_node')) {
                return;
            }
            var parent = $('wanfasp.node.mem_node.scrollView');
            var cell0 = $('wanfasp.node.mem_node.cell0');
            cell0.setVisible(false);
            var viewHight = 40 * clubMemberStateArr.length;
            parent.removeAllChildren();

            var innerHeight = parent.getContentSize().height;
            if (viewHight >= innerHeight) {
                innerHeight = viewHight;
            }
            parent.innerHeight = innerHeight;
            parent.setInnerContainerSize(cc.size(256, viewHight));
            for (var i = 0; i < clubMemberStateArr.length; i++) {
                var cell = parent.getChildByName('cell' + i);
                if (!cell) {
                    cell = duplicateSprite(cell0);
                    cell.setName('cell' + i);
                    cell.setVisible(true);
                    parent.addChild(cell);
                }
                cell.setPosition(cc.p(127, innerHeight - 40 * i - 10));
                this.initMemStateCell(cell, clubMemberStateArr[i], i);
            }
        },
        initMemStateCell: function (cell, data, idx) {
            $('lb_num', cell).setString(idx + 1);
            $('lb_name', cell).setString(ellipsisStr(data['name'], 6));
            if (data['inRoom']) {
                $('lb_states', cell).setString('游戏中');
                $("lb_states", cell).setTextColor(cc.color(255, 0, 0));
                $('lb_num', cell).setTextColor(cc.color(255, 0, 0));
                $('lb_name', cell).setTextColor(cc.color(255, 0, 0));
            } else {
                $('lb_states', cell).setString('在线');
                $("lb_states", cell).setTextColor(cc.color(45, 182, 56));
                $('lb_num', cell).setTextColor(cc.color(45, 182, 56));
                $('lb_name', cell).setTextColor(cc.color(45, 182, 56));
            }
        },
        checkTimeOut: function () {
            var nowTime = getCurTimestamp();
            if ((nowTime - lastEnterTime) > 60 * timeOutMinute) {
                network.send(2103, {cmd: 'updateLocal', club_id: clubid, location: 1});
                $('btn_refresh').onclickCallBack();
                lastEnterTime = nowTime;
                return true;
            }
            return false;
        },
        refreshBtnBg: function (idx) {
            if (!$ || !$('wanfasp.node.list')) {
                return;
            }
            var parent = $('wanfasp.node.list');
            for (var i = 1; i <= 4; i++) {
                if (i == idx) {
                    $('btn_' + i, parent).setTexture('res/submodules/club/img/item_wanfa_bg_sel.png');
                    $('btn_' + i + '.lb_name', parent).setTextColor(cc.color(141, 68, 26));
                    $('btn_' + i + '.lb_jushu', parent).setTextColor(cc.color(141, 68, 26));
                } else {
                    $('btn_' + i, parent).setTexture('res/submodules/club/img/item_wanfa_bg.png');
                    $('btn_' + i + '.lb_name', parent).setTextColor(cc.color(39, 119, 182));
                    $('btn_' + i + '.lb_jushu', parent).setTextColor(cc.color(39, 119, 182));
                }
            }
            if (idx < 5) {
                cc.log("===1115===");
                $('btn_createRoom').setVisible(false);
                $('btn_quickJoin').setVisible(true);
                $('btn_5.unlimitid_bg1', parent).setVisible(true);
                $('btn_5.unlimitid_bg2', parent).setVisible(false);
            } else {
                cc.log("===选中5===");
                $('btn_createRoom').setVisible(true);
                $('btn_quickJoin').setVisible(false);
                $('btn_5.unlimitid_bg1', parent).setVisible(false);
                $('btn_5.unlimitid_bg2', parent).setVisible(true);
            }
        },
        showWanfaBtns: function (wanfas) {
            if (!$) {
                console.log('sdfasdf===============sdfasdf');
                return;
            }
            var clubInfo = getClubData(clubid);
            for (var i = 1; i <= 4; i++) {
                var info = isHasWanfaIdx(clubInfo, i);
                var parent = $('wanfasp.node.list.btn_' + i);
                if (info) {
                    var option = JSON.parse(info.options);
                    var wanfa = gameData.mapId2Name(info['map_id']);
                    if (info['map_id'] == MAP_ID['DN'] || info['map_id'] == MAP_ID['NN'] || info['map_id'] >= 4000) {
                        wanfa = getZhuangMode(option);
                    }
                    $('lb_name', parent).setString(wanfa);//info.desc.split(',')[0]);
                    $('lb_jushu', parent).setString('局数:' + option.jushu || option.rounds);
                    $('lb_jushu', parent).setVisible(true);
                    $('btn_clear', parent).setVisible(this.isSelfAdministration());
                    if (this.inRoomLayer) {
                        TouchUtils.setClickDisable($('btn_clear', parent), true);
                        Filter.grayMask($('btn_clear', parent));
                    }
                    if (info.desc.indexOf("AA支付") >= 0) {
                        $('lb_jushu_0', parent).setVisible(true);
                    } else {
                        $('lb_jushu_0', parent).setVisible(false);
                    }
                } else {
                    $('lb_jushu_0', parent).setVisible(false);
                    $('lb_jushu', parent).setVisible(false);
                    $('lb_name', parent).setString('请点击设置玩法');
                    $('btn_clear', parent).setVisible(false);
                }
            }
        },
        showRooms: function (wanfas, pos, type) {
            var rooms = _.filter(wanfas, function (obj) {
                return obj.pos == pos;
            });
            // console.log("选取玩法信息：" + JSON.stringify(rooms));
            var wanfastr = decodeURIComponent(rooms[0].desc).replace(/,/g, '\n');
            $('wanfa_bg.lb_wanfa').setString(wanfastr || '');
            var newstring = '';
            if (wanfastr.length > 60) {
                wanfastr = wanfastr.split('\n');
                for (var i = 0; i < wanfastr.length; i++) {
                    if (wanfastr[i].length > 10) {
                        wanfastr[i] = ellipsisStr(wanfastr[i], 10);
                    }
                }
                for (var i = 0; i < wanfastr.length; i++) {
                    newstring = newstring + wanfastr[i] + '\n';
                }
                $('wanfa_bg.lb_wanfa').setString(newstring || '');
            }
            $('meinv').setVisible(false);

            network.send(2103, {cmd: 'listClubRoom', club_id: clubid, reason: type + ' showRooms'});
        },
        isSelfAdministration: function () {
            var clubInfo = getClubData(clubid);
            if (clubInfo['owner_uid'] == gameData.uid || (clubInfo['admins'] && clubInfo['admins'].indexOf(gameData.uid) >= 0)) {
                return true;
            }
            return false;
        },
        refreshView: function (type) {
            if (!$ || !$('scrolView') || !$('lb_name')) {
                return;
            }
            var clubInfo = getClubData(clubid);
            $('lb_name') && $('lb_name').setString("" + clubInfo.name);
            $('lb_id').setString("ID:" + clubInfo._id);
            $('lb_num').setString("人数:" + (clubInfo.players_count || '' ));
            if (isHasWanfaIdx(clubInfo, currentWanfaIdx) && currentWanfaIdx<5 ) {
                this.showRooms(clubInfo.wanfas, currentWanfaIdx, type + ' refreshView');
            } else {
                if (currentWanfaIdx < 5){
                    $('meinv').setVisible(true);
                }
                this.scrollView = $('scrolView');
                this.scrollView.removeAllChildren(true);
            }

            if(currentWanfaIdx == 5){ //自由桌子
                network.send(2103, {cmd: 'listClubRoom', club_id: clubid, reason:  'btn_5 showRooms'});
            }

            if (this.isSelfAdministration() && !this.inRoomLayer) {
                $('btn_invite').setVisible(true);
                Filter.remove($('btn_invite'));
                TouchUtils.setClickDisable($('btn_invite'), false);
            } else {
                Filter.grayScale($('btn_invite'));
                TouchUtils.setClickDisable($('btn_invite'), true);
                $('btn_xiaoxi').setVisible(false);
                $('wanfa_bg.btn_wanfa').setVisible(false);
            }

            if (currentWanfaIdx >= 1 && isHasWanfaIdx(clubInfo, currentWanfaIdx)) {
                $('icon_wanfa').setTexture('res/submodules/club/img/icon_wanfa' + currentWanfaIdx + '.png');
                // if (cc.sys.isNative)
                    // $('club_bg_1').setTexture('res/submodules/club/img/club_bg' + currentWanfaIdx + '.jpg');
            } else {
                if (this._tableView) {
                    this._tableView.removeFromParent(true);
                    this._tableView.release();
                    this._tableView = null;
                }
            }

        },
        //消息列表
        setWeiduMegNum: function (num) {
            if (!$ || !$("btn_sys")) {
                return;
            }
            if (num > 0) {
                $("btn_sys.numbg").setVisible(true);
                $("btn_sys.numbg.num").setString(num);
            } else {
                $("btn_sys.numbg.num").setString('0');
                $("btn_sys.numbg").setVisible(false);
            }
        },
        //自由玩法显示已开未玩房间
        refreshUnlimitedRooms: function (dataArr) {
            if (!$ || !$('scrolView')) {
                return;
            }
            var clubInfo = getClubData(clubid);
            if (!clubInfo.wanfas || (clubInfo.wanfas && clubInfo.wanfas.length == 0)) {
                return;
            }

            dataArr = dataArr || [];
            if (!this._tableView) {
                var tableViewSize = $('scrolView').getSize();
                var tableViewAnchor = $('scrolView').getAnchorPoint();
                var tableViewPosition = $('scrolView').getPosition();
                var width = tableViewSize.width;
                if (cc.winSize.width > 1280) {
                    width = cc.winSize.width - tableViewPosition.x - (cc.winSize.width - 1280) / 2;
                }
                var tableView = new cc.TableView(this, cc.size(width, tableViewSize.height));
                tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
                tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_BOTTOMUP);
                tableView.setPosition(tableViewPosition);
                tableView.setAnchorPoint(tableViewAnchor);
                tableView.setDelegate(this);
                $('tableView').addChild(tableView);
                tableView.retain();
                tableView.reloadData();
                this._tableView = tableView;
            }
            this.scrollView = $('scrolView');
            this.scrollView.removeAllChildren(true);

            var AllRoomArr = [];
            for (var i in dataArr) {
                for (var j = 0; j < dataArr[i].length; j++) {
                    if (dataArr[i][j].status == 1) {
                        AllRoomArr.push(dataArr[i][j]);
                    }
                }
            }
            if (AllRoomArr.length <= 0) {
                $('meinv').setVisible(true);
            } else {
                $('meinv').setVisible(false);
            }

            var nowLen = AllRoomArr.length;
            wanfaArray = [];
            wanfaPlayerNums = [];


            dataArr = this.resetDesksArr2(AllRoomArr);

            this._dataArr = dataArr;
            if (this._tableView) {
                tableViewRefresh(this._tableView);
                var toIndx = setPosX / 300;
                tableViewXSetPosition(this._tableView, 300, tablesCount / 2, toIndx); // 记录tableView 横向移动 的位置
            }
            if (this._tableView) {
                var num = nowLen % 2 == 0 ? nowLen / 2 : Math.ceil(nowLen / 2);
                var _width = 440;//this.tableCellSizeForIndex().width;
                this._tableView.setContentSize(cc.size(num * _width, this._tableView.getContentSize().height));
            }
            hideLoading();
        },

        refreshClubRooms: function (dataArr) {
            if (!$ || !$('scrolView')) {
                return;
            }
            var clubInfo = getClubData(clubid)
            if (!clubInfo.wanfas || (clubInfo.wanfas && clubInfo.wanfas.length == 0)) {
                return;
            }

            dataArr = dataArr || [];
            if (!this._tableView) {
                var tableViewSize = $('scrolView').getSize();
                var tableViewAnchor = $('scrolView').getAnchorPoint();
                var tableViewPosition = $('scrolView').getPosition();
                var width = tableViewSize.width;
                if (cc.winSize.width > 1280) {
                    width = cc.winSize.width - tableViewPosition.x - (cc.winSize.width - 1280) / 2;
                }

                var tableView = new cc.TableView(this, cc.size(width, tableViewSize.height));
                tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
                tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_BOTTOMUP);
                tableView.setPosition(tableViewPosition);
                tableView.setAnchorPoint(tableViewAnchor);
                tableView.setDelegate(this);
                $('tableView').addChild(tableView);
                tableView.retain();
                tableView.reloadData();
                this._tableView = tableView;
            }
            console.log('setPosX == ' + setPosX);
            this.scrollView = $('scrolView');
            this.scrollView.removeAllChildren(true);

            var _wanfasInfo = _.filter(clubInfo['wanfas'], function (obj) {
                return obj.pos == currentWanfaIdx;
            })[0];
            var nowLen = dataArr.length;
            var isHunzhuo = JSON.parse(_wanfasInfo['options'])['hunzhuo'];
            if ((isHunzhuo || (_wanfasInfo['map_id'] == MAP_ID.HONGZHONG
                || _wanfasInfo['map_id'] == MAP_ID.ZHUANZHUAN
                || _wanfasInfo['map_id'] == MAP_ID.CHANGSHA
                || _wanfasInfo['map_id'] == MAP_ID.SICHUAN_MZ
                || _wanfasInfo['map_id'] == MAP_ID.SICHUAN_TRLF
                || _wanfasInfo['map_id'] == MAP_ID.PDK))) {
                wanfaArray = [];
                wanfaPlayerNums = [];
                this.handleWanType(clubInfo);
                dataArr = this.resetDesksArr(dataArr);
            } else {
                dataArr = this.resetSigleWFArr(dataArr);
            }

            this._dataArr = dataArr;
            if (this._tableView) {
                tableViewRefresh(this._tableView);
                var toIndx = setPosX / 300;
                tableViewXSetPosition(this._tableView, 300, tablesCount / 2, toIndx); // 记录tableView 横向移动 的位置
            }
            if (this._tableView) {
                var num = Math.max(Math.ceil(nowLen / 2), 3) + 2; // + 3 多显示 3*2 张桌子 最少显示6个的宽度。
                if (num > Math.floor(tablesCount / 2)) {
                    num = Math.floor(tablesCount / 2);
                }
                var _width = this.tableCellSizeForIndex().width;
                console.log('================== _width : ' + _width + '     num : ' + num);
                this._tableView.setContentSize(cc.size(num * _width, this._tableView.getContentSize().height));
            }
            hideLoading();
        },
        /**
         *
         */
        handleWanType: function (clubInfo) {
            var wanfasInfo;
            var setMJWanfaInfo = function () {

            };
            if (clubInfo['wanfas']) {
                wanfasInfo = _.filter(clubInfo['wanfas'], function (obj) {
                    return obj.pos == currentWanfaIdx;
                })[0];
                if (wanfasInfo['map_id'] == MAP_ID.CHANGSHA || wanfasInfo['map_id'] == MAP_ID.ZHUANZHUAN
                    || wanfasInfo['map_id'] == MAP_ID.HONGZHONG || wanfasInfo['map_id'] == MAP_ID.SICHUAN_MZ
                    || wanfasInfo['map_id'] == MAP_ID.SICHUAN_TRLF
                    || wanfasInfo['map_id'] == MAP_ID.PDK) {
                    var _seleInfo = JSON.parse(wanfasInfo.options);
                    var allowRenshu = '';
                    if (_seleInfo['wanjiarenshu0'] || _seleInfo['wanjiarenshu1'] || _seleInfo['wanjiarenshu2']) {
                        if (_seleInfo['wanjiarenshu0']) allowRenshu += '2,';
                        if (_seleInfo['wanjiarenshu1']) allowRenshu += '3,';
                        if (_seleInfo['wanjiarenshu2']) allowRenshu += '4,';
                    }
                    if (_seleInfo['wanjiarenshu0']) {
                        var wanfasInfo1 = _.cloneDeep(wanfasInfo);
                        wanfasInfo1.desc += ',两人玩';
                        var _seleInfo1 = JSON.parse(wanfasInfo1.options);
                        _seleInfo1.desp += ',两人玩';
                        _seleInfo1.AllowRenshu = allowRenshu;
                        _seleInfo1.special_gz += ',两人玩';
                        if (_seleInfo1.siren) delete _seleInfo1.siren;
                        if (_seleInfo1.sanrenwan) delete _seleInfo1.sanrenwan;
                        if (_seleInfo1.liangrenwan) delete _seleInfo1.liangrenwan;
                        //add
                        var _arr = wanfasInfo1.desc.split(',');

                        if (wanfasInfo['map_id'] == MAP_ID.CHANGSHA || wanfasInfo['map_id'] == MAP_ID.ZHUANZHUAN
                            || wanfasInfo['map_id'] == MAP_ID.HONGZHONG) {
                            // if (_seleInfo1.hongzhong && wanfasInfo['map_id'] == MAP_ID.ZHUANZHUAN) delete _seleInfo1.hongzhong;
                            // if (_seleInfo1.zhaniao) delete _seleInfo.zhaniao;
                            // if(_arr && _arr.length > 0){
                            //     for(var i=0; i<_arr.length; i++){
                            //         if(_arr[i].indexOf('抓码') > -1) {
                            //             _arr[i] = '';
                            //         }
                            //         if(_arr[i].indexOf('红中') > -1 && wanfasInfo['map_id'] == MAP_ID.ZHUANZHUAN) {
                            //             _arr[i] = '';
                            //         }
                            //     }
                            // }
                            _arr = _.filter(_arr, function (obj) {
                                return obj != '';
                            })
                        }
                        //绵竹2人玩   yifandiaopao  平胡可接炮
                        if (wanfasInfo['map_id'] == MAP_ID.SICHUAN_MZ) {
                            if (_seleInfo1.yifandiaopaolr) {
                                _seleInfo1.yifandiaopao = true;
                            }
                            delete _seleInfo1.yifandiaopaolr;
                            delete _seleInfo1.yifandiaopaosr;
                            if (_seleInfo1.huansanzhang) delete _seleInfo1.huansanzhang;
                            if (_arr && _arr.length > 0) {
                                for (var i = 0; i < _arr.length; i++) {
                                    if (_arr[i].indexOf('平胡可接炮') > -1 && !_seleInfo1.yifandiaopao) {
                                        _arr[i] = '';
                                    }
                                    if (_arr[i].indexOf('换三张') > -1) {
                                        _arr[i] = '';
                                    }
                                }
                            }
                            _arr = _.filter(_arr, function (obj) {
                                return obj != '';
                            })
                        }
                        _seleInfo1.special_gz = _arr.join(',');
                        _seleInfo1.desp = _arr.join(',');
                        wanfasInfo1.desc = _arr.join(',');
                        _seleInfo1[_seleInfo1['wanjiarenshu0']] = true;
                        wanfasInfo1.options = JSON.stringify(_seleInfo1);
                        wanfasInfo1.max_player_cnt = 2;
                        wanfaPlayerNums.push(2);
                        wanfaArray.push(wanfasInfo1);
                    }
                    if (_seleInfo['wanjiarenshu1']) {
                        var wanfasInfo2 = _.cloneDeep(wanfasInfo);
                        wanfasInfo2.desc += ',三人玩';
                        var _seleInfo2 = JSON.parse(wanfasInfo2.options);
                        _seleInfo2.desp += ',三人玩';
                        _seleInfo2.AllowRenshu = allowRenshu;
                        _seleInfo2.special_gz += ',三人玩';
                        if (_seleInfo2.siren) delete _seleInfo2.siren;
                        if (_seleInfo2.sanrenwan) delete _seleInfo2.sanrenwan;
                        if (_seleInfo2.liangrenwan) delete _seleInfo2.liangrenwan;
                        var _arr = wanfasInfo2.desc.split(',');
                        //绵竹2人玩   yifandiaopao  平胡可接炮
                        if (wanfasInfo2['map_id'] == MAP_ID.SICHUAN_MZ) {
                            if (_seleInfo2.yifandiaopaosr) {
                                _seleInfo2.yifandiaopao = true;
                            }
                            delete _seleInfo2.yifandiaopaolr;
                            delete _seleInfo2.yifandiaopaosr;
                            if (_seleInfo2.huansanzhang) delete _seleInfo2.huansanzhang;
                            if (_arr && _arr.length > 0) {
                                for (var i = 0; i < _arr.length; i++) {
                                    if (_arr[i].indexOf('平胡可接炮') > -1 && !_seleInfo2.yifandiaopao) {
                                        _arr[i] = '';
                                    }
                                    if (_arr[i].indexOf('换三张') > -1) {
                                        _arr[i] = '';
                                    }
                                }
                            }
                            _arr = _.filter(_arr, function (obj) {
                                return obj != '';
                            })
                        }
                        _seleInfo2.special_gz = _arr.join(',');
                        _seleInfo2.desp = _arr.join(',');
                        wanfasInfo2.desc = _arr.join(',');
                        _seleInfo2[_seleInfo2['wanjiarenshu1']] = true;
                        wanfasInfo2.options = JSON.stringify(_seleInfo2);
                        wanfasInfo2.max_player_cnt = 3;
                        wanfaPlayerNums.push(3);
                        wanfaArray.push(wanfasInfo2);
                    }
                    if (_seleInfo['wanjiarenshu2']) {
                        var wanfasInfo3 = _.cloneDeep(wanfasInfo);
                        wanfasInfo3.desc += ',四人玩';
                        var _seleInfo3 = JSON.parse(wanfasInfo3.options);
                        _seleInfo3.desp += ',四人玩';
                        _seleInfo3.AllowRenshu = allowRenshu;
                        _seleInfo3.special_gz += ',四人玩';
                        if (_seleInfo3.siren) delete _seleInfo3.siren;
                        if (_seleInfo3.sanrenwan) delete _seleInfo3.sanrenwan;
                        if (_seleInfo3.liangrenwan) delete _seleInfo3.liangrenwan;
                        //绵竹2人玩   yifandiaopao  平胡可接炮
                        var _arr = wanfasInfo3.desc.split(',');
                        if (wanfasInfo3['map_id'] == MAP_ID.SICHUAN_MZ) {
                            delete _seleInfo3.yifandiaopaolr;
                            delete _seleInfo3.yifandiaopaosr;
                            if (_arr && _arr.length > 0) {
                                for (var i = 0; i < _arr.length; i++) {
                                    if (_arr[i].indexOf('平胡可接炮') > -1) {
                                        _arr[i] = '';
                                    }
                                }
                            }
                            _arr = _.filter(_arr, function (obj) {
                                return obj != '';
                            })
                        }
                        _seleInfo3.special_gz = _arr.join(',');
                        _seleInfo3.desp = _arr.join(',');
                        wanfasInfo3.desc = _arr.join(',');
                        _seleInfo3[_seleInfo3['wanjiarenshu2']] = true;
                        wanfasInfo3.options = JSON.stringify(_seleInfo3);
                        wanfasInfo3.max_player_cnt = 4;
                        wanfaPlayerNums.push(4);
                        wanfaArray.push(wanfasInfo3);
                    }
                    if (wanfaArray.length == 0) {
                        wanfaArray.push(wanfasInfo);
                    }
                }
            }
        },
        /**
         *
         * @param dataArr
         * @returns {Array}
         */
        resetDesksArr: function (dataArr) {
            // // 优先排没有开始的房间桌子,
            var arr2 = _.filter(dataArr, function (obj) {
                return obj.status && obj.status == 2;
            });
            var arr1 = _.filter(dataArr, function (obj) {
                return obj.status && obj.status == 1 && ((obj['uids'] && obj['uids'].length > 0)
                    || (obj['heads'] && obj['heads'].length > 0)
                    || (obj['nicknames'] && obj['nicknames'].length > 0));
            });
            var arr3 = _.filter(dataArr, function (obj) {
                return !(obj.status && obj.status == 1 && ((obj['uids'] && obj['uids'].length > 0)
                    || (obj['heads'] && obj['heads'].length > 0)
                    || (obj['nicknames'] && obj['nicknames'].length > 0))) && obj.status != 2;
            });
            dataArr = [];
            dataArr = dataArr.concat(arr1).concat(arr2).concat(arr3);

            var idx = 0;
            var newTableArr = [];
            for (var i = 0; i < tablesCount; i++) {
                var roomInfo = {};
                roomInfo.roomInfo = wanfaArray[Math.floor(i % wanfaArray.length)];
                newTableArr.push(roomInfo);
            }
            for (var i = 0; i < dataArr.length; i++) {
                if (newTableArr[i + wanfaArray.length]) { //防止数组越界。
                    var roomInfo = newTableArr[i + wanfaArray.length];
                    roomInfo.roomData = dataArr[i];
                }
            }
            return newTableArr;
        },
        //自有桌子的信息整合
        resetDesksArr2: function (dataArr) {
            var newTableArr = [];
            var clubInfo = getClubData(clubid);
            var wanfas = clubInfo['wanfas'];
            for (var i = 0; i < dataArr.length; i++) {
                var roomInfo = {};
                roomInfo.roomInfo = wanfas[1];
                roomInfo.roomData = dataArr[i];
                newTableArr.push(roomInfo);
            }
            if (dataArr.length % 2 != 0) {
                newTableArr.push({roomInfo: wanfas[1]});
            }

            return newTableArr;
        },



        /**
         * 非混合牌桌的排序
         * 1.空一个桌子
         * 2.先排人不满的桌子
         * 3.再排人满的桌子
         * 4.最后有房间号的空桌子
         */
        resetSigleWFArr: function (dataArr) {
            // // 优先排没有开始的房间桌子,
            var arr2 = _.filter(dataArr, function (obj) {
                return obj.status && obj.status == 2;
            });
            var arr1 = _.filter(dataArr, function (obj) {
                return obj.status && obj.status == 1 && ((obj['uids'] && obj['uids'].length > 0)
                    || (obj['heads'] && obj['heads'].length > 0)
                    || (obj['nicknames'] && obj['nicknames'].length > 0));
            });
            var arr3 = _.filter(dataArr, function (obj) {
                return !(obj.status && obj.status == 1 && ((obj['uids'] && obj['uids'].length > 0)
                    || (obj['heads'] && obj['heads'].length > 0)
                    || (obj['nicknames'] && obj['nicknames'].length > 0))) && obj.status != 2;
            });
            dataArr = [];
            dataArr = dataArr.concat(arr1).concat(arr2).concat(arr3);

            var newTableArr = [];
            for (var i = 0; i < tablesCount; i++) {
                newTableArr.push('');
            }
            for (var i = 0; i < dataArr.length; i++) {
                if (dataArr[i]) {
                    for (var j = 1; j < tablesCount; j++) {
                        if (!newTableArr[j]) {
                            newTableArr[j] = dataArr[i];
                            break;
                        }
                    }
                }
            }
            return newTableArr;
        },
        /**
         * 固定牌桌逻辑
         * 1.对数组进行place字段进行排序
         * 2.预防有位置相同的冲突
         * 3.没有place字段的房间,安插place
         */
        resetDeskPlace: function (dataArr) {
            var newTableArr = [];
            for (var i = 0; i < tablesCount; i++) {
                newTableArr.push('');
            }
            for (var i = 0; i < dataArr.length;) {
                if (!dataArr[i]) {
                    i++;
                    continue;
                }
                var options = dataArr[i].option;
                if (!options) {
                    i++;
                    continue;
                }
                if (_.isString(dataArr[i].option)) {
                    options = JSON.parse(options)
                }
                if (_.isNumber(options.place)) {
                    if (!newTableArr[options.place]) {
                        newTableArr[options.place] = dataArr[i];
                        dataArr.splice(i, 1);
                    } else {
                        i++;
                    }
                } else {
                    i++;
                }
            }
            if (dataArr.length > 0) {
                for (var i = 0; i < dataArr.length;) {
                    if (!dataArr[i]) {
                        i++;
                        continue;
                    }
                    for (var j = 0; j < tablesCount; j++) {
                        if (!newTableArr[j]) {
                            newTableArr[j] = dataArr[i];
                            dataArr.splice(i, 1);
                            break;
                        }
                    }
                    if (j == tablesCount)
                        break;
                }
            }
            dataArr = newTableArr;
            return dataArr;
        },
        initItem: function (data1, data2, count, setPosX, idx) {
            var item = new ClubTableItem(data2, currentWanfaIdx, count, idx + 1);
            this.layout.addChild(item);
            var itemWidth = item.getLayerWidth();
            item.setPositionX(this.totalWidth - setPosX);

            item = new ClubTableItem(data1, currentWanfaIdx, count, idx);
            this.layout.addChild(item);
            item.setPositionX(this.totalWidth - setPosX);
            item.setPositionY(260);
            this.totalWidth += itemWidth;
        },
        tableCellTouched: function (table, idx) {
        },
        tableCellAtIndex: function (table, idx) {
            if (currentWanfaIdx && parseInt(currentWanfaIdx) == 5) {
                var cell = table.dequeueCell();
                if (cell) cell.removeFromParent();
                var playerCount = 4;
                var clubInfo = getClubData(clubid);
                // var wanfaObj = this._dataArr[idx].roomInfo;
                // if (wanfaObj) {
                //     playerCount = this.getMaxPlayerNum(wanfaObj);
                // }
                playerCount = 9;
                var owner_uid = clubInfo['owner_uid'];
                cell = new ClubTableItem(this._dataArr[2 * idx], this._dataArr[2 * idx + 1], currentWanfaIdx, playerCount, idx, owner_uid, this, this.inRoomLayer);

                return cell;
            }
            var cell = table.dequeueCell();
            if (cell) cell.removeFromParent();
            var clubInfo = getClubData(clubid);
            var wanfaObj = '';
            var maxPlayerCnt = 4;
            var clubInfo = getClubData(clubid);
            wanfaObj = isHasWanfaIdx(clubInfo, currentWanfaIdx);
            var isHunzhuo = JSON.parse(wanfaObj['options'])['hunzhuo'];
            if ((isHunzhuo || (wanfaObj['map_id'] == MAP_ID.ZHUANZHUAN
                || wanfaObj['map_id'] == MAP_ID.HONGZHONG
                || wanfaObj['map_id'] == MAP_ID.CHANGSHA
                || wanfaObj['map_id'] == MAP_ID.SICHUAN_MZ
                || wanfaObj['map_id'] == MAP_ID.SICHUAN_TRLF
                || wanfaObj['map_id'] == MAP_ID.PDK))) {
                wanfaObj = this._dataArr[idx].roomInfo;
            }
            if (wanfaObj) {
                maxPlayerCnt = this.getMaxPlayerNum(wanfaObj);
            }
            var owner_uid = clubInfo['owner_uid']
            cell = new ClubTableItem(this._dataArr[2 * idx], this._dataArr[2 * idx + 1], currentWanfaIdx, maxPlayerCnt, idx, owner_uid, this, this.inRoomLayer);
            return cell;
        },
        getMaxPlayerNum: function(wanfaObj){
            var maxPlayerCnt = 4;
            if (wanfaObj['map_id'] == MAP_ID.NN || wanfaObj['map_id'] == MAP_ID.DN || wanfaObj['map_id'] >= 4000) {
                maxPlayerCnt = 9;
                if (wanfaObj['desc'].indexOf('六人') >= 0) {
                    maxPlayerCnt = 6;
                }
            } else if (wanfaObj['map_id'] == MAP_ID.ZJH) {
                maxPlayerCnt = 9;
                if (wanfaObj['desc'].indexOf('五人') >= 0) {
                    maxPlayerCnt = 5;
                }
            } else if (wanfaObj['map_id'] == MAP_ID.EPZ) {
                maxPlayerCnt = 8;
                if (wanfaObj['desc'].indexOf('六人') >= 0) {
                    maxPlayerCnt = 6;
                }
            } else {
                // console.log(wanfaObj);
                if (wanfaObj['desc'].indexOf('二人') >= 0 || wanfaObj['desc'].indexOf('2人') >= 0 || wanfaObj['desc'].indexOf('两人') >= 0) {
                    maxPlayerCnt = 2;
                } else if (wanfaObj['desc'].indexOf('三人') >= 0 || wanfaObj['desc'].indexOf('3人') >= 0) {
                    maxPlayerCnt = 3;
                } else if (wanfaObj['desc'].indexOf('四人') >= 0 || wanfaObj['desc'].indexOf('4人') >= 0) {
                    maxPlayerCnt = 4;
                } else if (wanfaObj['desc'].indexOf('五人') >= 0 || wanfaObj['desc'].indexOf('5人') >= 0) {
                    maxPlayerCnt = 5;
                } else if (wanfaObj['desc'].indexOf('六人') >= 0 || wanfaObj['desc'].indexOf('6人') >= 0) {
                    maxPlayerCnt = 6;
                } else if (wanfaObj['desc'].indexOf('七人') >= 0 || wanfaObj['desc'].indexOf('7人') >= 0) {
                    maxPlayerCnt = 7;
                } else if (wanfaObj['desc'].indexOf('九人') >= 0 || wanfaObj['desc'].indexOf('9人') >= 0) {
                    maxPlayerCnt = 9;
                }
            }
            return maxPlayerCnt;
        },
        tableCellSizeForIndex: function (table, idx) {
            if (currentWanfaIdx && parseInt(currentWanfaIdx) == 5 && idx != undefined) {
                var playerCount = 4;
                // var wanfaObj = this._dataArr[idx].roomInfo;
                // if (wanfaObj) {
                //     playerCount = this.getMaxPlayerNum(wanfaObj);
                // }
                playerCount = 9;
                if (playerCount > 4) {
                    return cc.size(440, 520);
                } else {
                    return cc.size(300, 520);
                }
            }
            var clubInfo = getClubData(clubid);
            var wanfaObj = isHasWanfaIdx(clubInfo, currentWanfaIdx);
            var playerCount = getWanfaPlayerCountByMapId(wanfaObj ? wanfaObj['map_id'] : 0);
            if (wanfaObj) {
                playerCount = this.getMaxPlayerNum(wanfaObj);
            }
            if (playerCount > 4) {
                return cc.size(440, 520);
            } else {
                return cc.size(300, 520);
            }
        },
        numberOfCellsInTableView: function (table) {
            return this._dataArr.length / 2;
        },
        scrollViewDidScroll: function (view) {
            var size = view.getContentOffset();
            if (size.x != 0) {
                setPosX = size.x;
                // console.log('==========================11111');
            }
        },
        scrollViewDidZoom: function (view) {
        },
        _offsetFromIndex: function (view) {

        },
        showRoomSetting: function (data, endPos, owner_uid, inRoomLayer) {
            $('setting').setVisible(true);
            endPos.y = endPos.y + 100;
            $('setting').setPosition(endPos);
            var that = this;
            TouchUtils.setOnclickListener($('setting.grade'), function () { // 进入房间
                if (!!inRoomLayer) {
                    if (data.room_id == gameData.roomId) {
                        that.removeFromParent(true);
                    } else {
                        if (gameData.mapId < 300) {
                            alert22('是否退出当前房间, 加入其他房间？', function () {
                                network.send(3003, {room_id: gameData.roomId});
                            }, null, false, true, true);
                        } else {
                            alert22('是否退出当前房间, 加入其他房间？', function () {
                                network.sendPhz(3003, "Quit/" + gameData.roomId);
                            }, null, false, true, true);
                        }
                    }
                } else {
                    showLoading('正在加入房间');
                    $('setting').setVisible(false);
                    network.send(3002, {
                        room_id: '' + data.room_id, uid: owner_uid
                    });
                }
            });
            TouchUtils.setOnclickListener($('setting.remove'), function () {
                $('setting').setVisible(false);

                if (data['map_id'] && data['map_id'] < 300) {
                    if (data['status'] == 1) {
                        network.send(3003, {
                            daikai_room_id: data['room_id'],
                            room_id: data['room_id'],
                            force: true,
                            uid: owner_uid,
                        });
                    } else if (data['status'] == 2) {
                        network.send(3019, {
                            daikai_room_id: data['room_id'],
                            room_id: data['room_id'],
                            force: true,
                            uid: owner_uid,
                        });
                    }
                } else {
                    // 群主解散房间 // 待确定¬
                    // network.send(3019, {
                    network.send(3003, {
                        daikai_room_id: data['room_id'],
                        room_id: data['room_id'],
                        force: true,
                        uid: owner_uid,
                    });
                }
            });
            TouchUtils.setOnclickListener($('setting.root'), function () {
                $('setting').setVisible(false);
            });
        }
    });
    exports.ClubTablesLayer = ClubTablesLayer;
    exports.getClubCurrentWanfaInfo = function () {
        var club = getClubData(clubid);
        var info = isHasWanfaIdx(club, currentWanfaIdx);
        return info;
    };
    exports.Currentclubid = function () {
        return clubid;
    };
    exports.getIsOpenState = function (stime, etime) {
        var myDate = new Date();
        var nh = myDate.getHours();
        var nm = myDate.getMinutes();
        var arr1 = stime.split(':');
        var arr2 = etime.split(':');
        var sh = parseInt(arr1[0]);
        var sm = parseInt(arr1[1]);

        var eh = parseInt(arr2[0]);
        var em = parseInt(arr2[1]);

        if (sh < eh) {//非跨天
            if (nh > sh && nh < eh) {
                return true;
            } else if (nh == sh && nm >= sm) {
                return true;

            } else if (nh == eh && nm <= em) {
                return true;
            }
        } else if (sh == eh) {

            if (sm < em) {// 非跨天
                if (nh == sh && nm >= sm && nm <= em) {
                    return true;
                }
            } else if (sm > em) {//跨天
                if (nh > sh) {
                    return true;
                } else if (nh == sh && nm >= sm) {
                    return true;
                } else if (nh == sh && nm <= em) {
                    return true;
                }
            } else if (sm == em) {//完全一致认为全营业
                return true;
            }
        } else if (sh > eh) {//跨天
            if (nh == sh && nm >= sm) {
                return true;

            } else if (nh > sh) {
                return true;
            } else if (nh < eh) {
                return true;
            } else if (nh == eh && nm <= em) {
                return true;
            }
        }
        return false;
    };

})(window);
