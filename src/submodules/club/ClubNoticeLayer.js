(function () {
    var exports = this;

    var $ = null;
    var ClubTimeHelpLayer = cc.Layer.extend(
        {
            ctor: function () {
                this._super();
                var that = this;

                var $ = create$(loadNodeCCS(res.ClubTimeHelpLayer_json, this).node);

                $('Panel_1.Text_1').setVisible(false);
                $('Panel_1.Text_2').setVisible(false);
                $('Panel_1.Text_3').setVisible(true);
                $('Panel_1.Text_4').setVisible(true);
                $('Panel_1.Text_5').setVisible(true);

                TouchUtils.setOnclickListener($('btn_close'), function (node) {
                    that.removeFromParent();
                });

                return true;
            }
        }
    );
    var ClubNoticeLayer = cc.Layer.extend({

        ctor: function (data, type, clubid, currentWanfaIdx, inRoomLayer) {
            this._super();
            var that = this;
            this.clubid = clubid;


            loadNodeCCS(res.ClubNoticeLayer_json, this);
            $ = create$(this.getChildByName("Layer"));
            $('invite_node').setVisible(false);
            $('wanFa_node').setVisible(false);
            $('gongGao_node').setVisible(false);
            $('gongGao_change_node').setVisible(false);
            $('quickJoin_node').setVisible(false);
            $('create_club_node').setVisible(false);
            $('ziyou_node').setVisible(false);

            if (type == NoticeType.wanfaDetails) {
                this.setWanfaDetailsInfo(data, clubid, currentWanfaIdx, inRoomLayer);
            } else if (type == NoticeType.clubInvite) {
                this.setClubInvitionInfo(data);
            } else if (type == NoticeType.quickJoin) {
                this.setQuickJoinInfo(data);
            } else if (type == NoticeType.createClub) {
                this.createClubNode();
            } else if (type == NoticeType.freeSet) {
                this.freeSetNode(data);
            } else {
                this.setGonggaoContent(data);
            }

            TouchUtils.setOnclickListener($('btn_back'), function (node) {
                if (type == NoticeType.clubInvite) {
                    that.sendRefusedInvition(data);
                }
                that.removeFromParent();
            });

            TouchUtils.setOnclickListener($('black'), function (node) {
                if (type == NoticeType.clubInvite) {
                    that.sendRefusedInvition(data);
                }
                that.removeFromParent();
            });

            return true;
        },
        freeSetNode: function (data) {
            var that = this;
            $('ziyou_node').setVisible(true);
            if (data.param && data.param.free_play) {
                var free_play = data.param.free_play;
                $('ziyou_node.btn_open').setVisible(free_play == "open" ? true : false);
                $('ziyou_node.btn_close').setVisible(free_play == "close" ? true : false);
            }
            //点击关闭
            TouchUtils.setOnclickListener($('ziyou_node.btn_open'), function () {
                var clubInfo = getClubData(that.clubid);

                if (clubInfo['owner_uid'] != gameData.uid) {
                    alert1("您不是群主，无法操作");
                    return;
                }

                $('ziyou_node.btn_open').setVisible(false);
                $('ziyou_node.btn_close').setVisible(true);

                network.send(2103, {cmd: 'ClubParamSet', key: 'free_play', value: "close", club_id: that.clubid});
            });
            //点击开启
            TouchUtils.setOnclickListener($('ziyou_node.btn_close'), function () {
                var clubInfo = getClubData(that.clubid);
                if (clubInfo['owner_uid'] != gameData.uid) {
                    alert1("您不是群主，无法操作");
                    return;
                }
                $('ziyou_node.btn_open').setVisible(true);
                $('ziyou_node.btn_close').setVisible(false);

                network.send(2103, {cmd: 'ClubParamSet', key: 'free_play', value: "open", club_id: that.clubid});
            });

            TouchUtils.setOnclickListener($('ziyou_node.btn_sure'), function () {
                that.removeFromParent(true);
            });
            TouchUtils.setOnclickListener($('ziyou_node.btn_help'), function () {
                that.addChild(new ClubTimeHelpLayer(),10);
            });
        },

        setQuickJoinInfo: function (wanfaPlayerNums) {
            var that = this;
            var btn_qJoin2 = $('quickJoin_node.btn_qJoin2');
            var btn_qJoin3 = $('quickJoin_node.btn_qJoin3');
            var btn_qJoin4 = $('quickJoin_node.btn_qJoin4');
            if (!btn_qJoin2) {
                if (that && cc.sys.isObjectValid(that)) that.removeFromParent(true);
                return;
            }
            wanfaPlayerNums.sort(function (a, b) {
                return a > b;
            });
            $('gongGao_node').setVisible(false);
            $('quickJoin_node').setVisible(true);
            var callFunc = function (num) {
                var parent = that.getParent();
                if (parent && parent.quickJoinHunzhuoNum) {
                    parent.quickJoinHunzhuoNum(num);
                }
            };
            TouchUtils.setOnclickListener(btn_qJoin2, function () {
                callFunc(2);
            });
            TouchUtils.setOnclickListener(btn_qJoin3, function () {
                callFunc(3);
            });
            TouchUtils.setOnclickListener(btn_qJoin4, function () {
                callFunc(4);
            });
            var arr1 = [cc.p(439, 348), cc.p(641, 348), cc.p(843, 348)];
            var arr2 = [cc.p(533, 348), cc.p(737, 348)];
            var _len = wanfaPlayerNums.length;

            btn_qJoin2.setVisible(false);
            btn_qJoin3.setVisible(false);
            btn_qJoin4.setVisible(false);
            var setNodeVisibleFunc = function (node, pos) {
                node.setVisible(true);
                node.setPosition(pos);
            };
            if (_len == 3) {
                setNodeVisibleFunc(btn_qJoin2, arr1[0]);
                setNodeVisibleFunc(btn_qJoin3, arr1[1]);
                setNodeVisibleFunc(btn_qJoin4, arr1[2]);
            } else if (_len == 2) {
                if (wanfaPlayerNums[0] == 2) {
                    setNodeVisibleFunc(btn_qJoin2, arr2[0]);
                    if (wanfaPlayerNums[1] == 3) {
                        setNodeVisibleFunc(btn_qJoin3, arr2[1]);
                    } else if (wanfaPlayerNums[1] == 4) {
                        setNodeVisibleFunc(btn_qJoin4, arr2[1]);
                    }
                } else if (wanfaPlayerNums[0] == 3) {
                    setNodeVisibleFunc(btn_qJoin3, arr2[0]);
                    setNodeVisibleFunc(btn_qJoin4, arr2[1]);
                }
            } else if (_len == 1) {
                if (wanfaPlayerNums[0] == 2) {
                    setNodeVisibleFunc(btn_qJoin2, arr1[1]);
                } else if (wanfaPlayerNums[0] == 3) {
                    setNodeVisibleFunc(btn_qJoin3, arr1[1]);
                } else if (wanfaPlayerNums[0] == 4) {
                    setNodeVisibleFunc(btn_qJoin4, arr1[1]);
                }
            } else {
                cc.log('wanfaPlayerNums wanfasError error!!!');
            }
        },
        setWanfaDetailsInfo: function (data, clubid, currentWanfaIdx, inRoomLayer) {
            var that = this;
            $('gongGao_node').setVisible(false);
            $('wanFa_node').setVisible(true);
            var rooms = _.filter(data['wanfas'], function (obj) {
                return obj.pos == currentWanfaIdx;
            });
            if (rooms && rooms.length) {
                $('wanFa_node.lb_content').setString(decodeURIComponent(rooms[0]['desc']));
            } else {
                $('wanFa_node.lb_content').setString(decodeURIComponent('还没有设置玩法'));
            }
            if (!!inRoomLayer) {
                TouchUtils.setClickDisable($('wanFa_node.btn_setwf'), true);
                Filter.grayMask($('wanFa_node.btn_setwf'));
            }
            var rooms = _.filter(data['wanfas'], function (obj) {
                return obj.pos == currentWanfaIdx;
            });
            if (rooms && rooms.length) {
                $('wanFa_node.btn_setwf').setVisible(this.isSelfAdministration());
            } else {
                $('wanFa_node.btn_setwf').setVisible(false);
            }
            TouchUtils.setOnclickListener($('wanFa_node.btn_setwf'), function (node) {
                if (!currentWanfaIdx) {
                    currentWanfaIdx = 1;
                }
                window.maLayer.createClubRoom(clubid, currentWanfaIdx);
                that.removeFromParent();
            });
            if (currentWanfaIdx == 5){
                $('wanFa_node.btn_setwf').setVisible(false);
                $('wanFa_node.lb_content').setString(decodeURIComponent('自由玩法功能支持玩家在亲友圈里面自由创建任何玩法'));
            }
        },
        sendRefusedInvition: function (refushInfo) {
            var from_uid = refushInfo['from_uid'];
            var club_id = refushInfo['club_id'];

            var message = {
                type: MessageType.Refused,
                msg: gameData.nickname + '拒绝了您的邀请',
            };
            var data = {
                club_id: club_id,
                cmd: 'BroadcastUid',
                uids: from_uid.toString(), // uids 必须为字符串
                data: message,
                from_uid: gameData.uid,
            };
            network.send(2103, data);
        },
        setClubInvitionInfo: function (data) {
            var that = this;
            $('gongGao_node').setVisible(false);
            $('invite_node').setVisible(true);
            $('invite_node.wanfaInfo').setVisible(false);
            $('invite_node.inviteInfo.lb_clubRoomId').setString(data['room_id']);
            $('invite_node.inviteInfo.lb_playerName').setString(data['player_name']);
            //扯胡子单独处理 获取玩法名字
            $('invite_node.inviteInfo.lb_wanfaName').setString(data['wanfa_name']);
            // $('invite_node.inviteInfo.lb_wanfaName').setString(mapidToName(data['map_id'], null, data['wanfa_desc']));
            $('invite_node.inviteInfo.lb_clubName').setString(data['club_name']);
            $('invite_node.wanfaInfo.lb_wanfaDesc').setString(data['wanfa_desc']);

            TouchUtils.setOnclickListener($('invite_node.inviteInfo.lb_wanfaDetail'), function () {
                $('invite_node.wanfaInfo').setVisible(true);
                $('invite_node.inviteInfo').setVisible(false);
            });
            TouchUtils.setOnclickListener($('invite_node.wanfaInfo.btn_back_invite'), function () {
                $('invite_node.wanfaInfo').setVisible(false);
                $('invite_node.inviteInfo').setVisible(true);
            });
            TouchUtils.setOnclickListener($('invite_node.inviteInfo.btn_cancel'), function () {
                that.sendRefusedInvition(data);

                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('invite_node.inviteInfo.btn_joinIn'), function () {
                showLoading('进入房间..');
                network.send(3002, {
                    room_id: data['room_id']
                });
                that.removeFromParent();
            });
        },
        isSelfAdministration: function () {
            var clubInfo = getClubData(this.clubid);
            if (clubInfo['owner_uid'] == gameData.uid || (clubInfo['admins'] && clubInfo['admins'].indexOf(gameData.uid) >= 0)) {
                return true;
            }
            return false;
        },
        setGonggaoContent: function (data) {
            var that = this;
            $('gongGao_node').setVisible(true);

            var notice = data["notice"] == "" ? "暂无公告！" : data["notice"];
            var ggContent = "【" + data["name"] + "】亲友圈：" + notice;
            if (!notice) {
                ggContent = '亲友圈暂无公告';
            }
            $('gongGao_node.lb_content').setString(ggContent);
            TouchUtils.setOnclickListener($('gongGao_node.btn_change_gonggao'), function () {
                that.setGongGaoChangeNode();
            });

            var clubInfo = getClubData(data._id);
            if (clubInfo['owner_uid'] == gameData.uid) {
                $('gongGao_node.btn_change_gonggao').setVisible(true);
            } else {
                $('gongGao_node.btn_change_gonggao').setVisible(false);
            }

        },
        setGongGaoChangeNode: function () {
            var that = this;
            $('gongGao_node').setVisible(false);
            $('gongGao_change_node').setVisible(true);


            var inputNode = $('gongGao_change_node.input');
            inputNode.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            inputNode.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            that.setPositionY(320);
                        }
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

            TouchUtils.setOnclickListener($('gongGao_change_node.bnt_sure_change'), function () {
                var str = inputNode.getString();
                if (str.length <= 0) {
                    alert11("公告不能为空")
                    return;
                }
                network.send(2103, {cmd: 'modifyClub', club_id: Currentclubid(), notice: str});
                that.removeFromParent(true);
            });

        },
        createClubNode: function () {
            var that = this;
            $('gongGao_node').setVisible(false);
            $('create_club_node').setVisible(true);

            var inputNode1 = $('create_club_node.input1');
            inputNode1.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            inputNode1.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            that.setPositionY(320);
                        }
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

            var inputNode2 = $('create_club_node.input2');
            inputNode2.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            inputNode2.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            that.setPositionY(320);
                        }
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

            TouchUtils.setOnclickListener($('create_club_node.bnt_create'), function () {
                var name = inputNode1.getString();
                var gonggao = inputNode2.getString();
                if (name.length <= 0) {
                    alert11("亲友圈名称不能为空")
                    return;
                }
                if (gonggao.length <= 0) {
                    alert11("公告不能为空")
                    return;
                }
                network.send(2103, {cmd: 'createClub', name: name, notice: gonggao});
                that.removeFromParent(true);
            });

        },
    });

    exports.ClubNoticeLayer = ClubNoticeLayer;
})(window);



