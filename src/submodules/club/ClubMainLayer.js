/**
 * Created by hjx on 2018/2/7.
 */

(function () {
    var exports = this;
    var $ = null;

    /**
     *针对一堆按钮互斥 产生按钮变化的统一处理
     * @param list  传入按钮数组
     * @param options 按钮显示的互斥配置
     * {
                    btnchoose:'res/submodules/club/img/btn_main_2.png',
                    btnnochoose:'res/submodules/club/img/btn_main_1.png',
                    word:[
                        ['res/submodules/club/img/word_wdjlb2.png', 'res/submodules/club/img/word_wdjlb1.png'],
                        ['res/submodules/club/img/word_zj2.png', 'res/submodules/club/img/word_zj1.png'],
                        ['res/submodules/club/img/word_xx2.png', 'res/submodules/club/img/word_xx1.png']
                    ]
                }
     */
    var btnsMutexExecute = function (list, options) {
        for (var i = 0; i < list.length; i++) {
            (function (j) {
                var _btn = list[j];
                TouchUtils.setOnclickListener(_btn, function () {
                    for (var x = 0; x < list.length; x++) {
                        var ibtn = list[x];
                        if (x != j) {
                            ibtn.setTexture(options.btnnochoose);
                            ibtn.getChildren()[0].setTexture(options.word[x][0]);
                        } else {
                            ibtn.setTexture(options.btnchoose);
                            ibtn.getChildren()[0].setTexture(options.word[x][1]);
                        }
                    }
                });
            })(i);

        }
    };

    var clubsInfo = [];
    var selectClubId = 0;


    var msgListeners = {};
    // network.addListener(2103, function (data) {
    //     var cmd = data['command'];
    //     var errorCode = data['result'];
    //     var errorMsg = data['msg'];
    //
    //     if (errorCode && errorMsg!="没有房间") {
    //         alert11(errorMsg, 'noAnimation');
    //     }
    //
    //     if (msgListeners[cmd]) {
    //         // console.log("处理亲友圈消息：" + cmd + "数量：" + msgListeners[cmd].length);
    //         for(var i=0; i<msgListeners[cmd].length; i++){
    //             msgListeners[cmd][i](data);
    //         }
    //     }else{
    //         // console.log("未处理亲友圈消息");// + JSON.stringify(data));
    //     }
    // });

    var ClubMainLayer = cc.Layer.extend({
        onCCSLoadFinish: function () {
        },
        ctor: function (club_id) {
            this._super();
            if(gameData.enterRoomWithClubID){
                club_id = gameData.enterRoomWithClubID;
                gameData.enterRoomWithClubID = null;
            }
            var that = this;
            selectClubId = club_id || 0;
            showLoading('进入亲友圈牌桌.');
            // var mainscene = ccs.load(res.ClubMainLayer_json);
            // this.addChild(mainscene.node);
            loadNodeCCS(res.ClubMainLayer_json, this);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('root'), function () {
            });

            //btn_join
            TouchUtils.setOnclickListener($('btn_join'), function () {
                // that.addChild(new ClubJoinLayer());
                that.addChild(new ClubInputLayer('join'));
            });
            //
            // TouchUtils.setOnclickListener($('btn_xiaoxi'), function () {
            //     that.addChild(new ClubMsgLayer());
            // });

            TouchUtils.setOnclickListener($('btn_help'), function () {
                that.addChild(new GuideLayer());
            });
            //btn_refresh
            var refresh = 0;
            TouchUtils.setOnclickListener($('btn_refresh'), function () {
                network.send(2103, {cmd: 'queryClub', refresh: refresh});
                refresh++;
            });

            $('btn_create').setVisible(false);
            TouchUtils.setOnclickListener($('btn_create'), function () {
                if(gameData.isAgent && gameData.isAgent == 1){
                    var create_club_layer = new ClubNoticeLayer(null,NoticeType.createClub);
                    that.addChild(create_club_layer);
                }else{
                    alert11("您还不是代理，无法创建亲友圈!");
                }

            });

            // btnsMutexExecute([$('btn_club'), $('btn_zhanji'), $('btn_xiaoxi')],
            //     {
            //         btnchoose: 'res/submodules/club/img/btn_main_2.png',
            //         btnnochoose: 'res/submodules/club/img/btn_main_1.png',
            //         word: [
            //             ['res/submodules/club/img/word_wdjlb1.png', 'res/submodules/club/img/word_wdjlb2.png'],
            //             ['res/submodules/club/img/word_zj1.png', 'res/submodules/club/img/word_zj2.png'],
            //             ['res/submodules/club/img/word_xx1.png', 'res/submodules/club/img/word_xx2.png']
            //         ]
            //     }
            // );

            TouchUtils.setOnclickListener($('btn_close'), function () {
                cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER, 0);
                that.removeFromParent(true);
            });
            network.send(2103, {cmd: 'queryClub'});


            var subArr = SubUpdateUtils.getLocalVersion();
            var sub = "";
            if(subArr)  sub = subArr['club'];
            var versiontxt = window.curVersion + "-" + sub;
            if(cc.sys.os == cc.sys.OS_IOS && versiontxt){
                var regx = new RegExp('\\.', 'g');
                versiontxt = versiontxt.replace(regx, '');
            }
            $("lbl_version").setString('Ver.' + versiontxt);

            cc.sys.localStorage.setItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER, 1);
            return true;
        },
        resetSelectClubId: function () {
            selectClubId = 0;
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;
            this.list1 = cc.eventManager.addCustomListener("queryClub", function (event) {
                var data = event.getUserData();
                refreshClubData(data['arr']);
                that.refreshClub(clubsInfo);
            });
            this.list2 = cc.eventManager.addCustomListener("flushClub", function (event) {
                var data = event.getUserData();
                refreshClubData(data.info._id, data['info']);
                that.refreshClub(clubsInfo);
            });
            this.list3 = cc.eventManager.addCustomListener("createClub", function (event) {
                var data = event.getUserData();
                if (data.result == 0){
                    alert11("亲友圈创建成功");
                }
            });
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
            cc.eventManager.removeListener(this.list2);
            cc.eventManager.removeListener(this.list3);
        },

        refreshClub: function (dataArr) {
            if (!$ || !$('scrolView')) {
                hideLoading();
                return;
            }
            this.scrollView = $('scrolView');
            this.scrollView.removeAllChildren(true);

            this.state = 1;

            if (!dataArr || !dataArr.length || dataArr.length < 1) {
                hideLoading();
                $('meinv').setVisible(true);
                return;
            } else {
                $('meinv').setVisible(false);
            }
            this.layout = new ccui.Layout();
            this.totalWidth = 0;
            for (var i = 0; i < dataArr.length; i++) {
                this.initItem(dataArr[i]);
            }

            this.scrollView.setInnerContainerSize(cc.size(this.totalWidth, this.scrollView.getContentSize().height));
            this.scrollView.addChild(this.layout);
            this.layout.setPositionX(0);

        },
        initItem: function (itemData) {
            var item = new ClubInfoItem(itemData, this);
            this.layout.addChild(item);
            hideLoading();
            if (itemData._id == selectClubId) {//未刷新过并且从其他场景带clubid过来的
                item.enterClub(itemData._id);
            } else {
                var enterCLubId = parseInt(cc.sys.localStorage.getItem(NOW_PAGE_STAGE.STAGE_CLUB_LAYER + '_btn_clubId')) || 0;
                var canEnter = parseInt(cc.sys.localStorage.getItem(NOW_PAGE_STAGE.STAGE_CLUBMAIN_LAYER)) || 0;
                if (enterCLubId && !canEnter && itemData._id == enterCLubId) {
                    item.enterClub(itemData._id);
                }
            }
            var itemWidth = item.getLayerWidth();
            item.setPositionX(this.totalWidth);
            this.totalWidth += itemWidth;
        }
    });
    exports.ClubMainLayer = ClubMainLayer;
    exports.getClubData = function (id) {
        if (id) {
            for (var i = 0; i < clubsInfo.length; i++) {
                if (clubsInfo[i]._id == id) {
                    return clubsInfo[i];
                }
            }
        }
        return clubsInfo;
    };
    exports.refreshClubData = function (id, data) {
        if (_.isArray(id)) {
            clubsInfo = id;
        } else {
            for (var i = 0; i < clubsInfo.length; i++) {
                if (clubsInfo[i]._id == id) {
                    clubsInfo[i] = data;
                    break;
                }
            }
        }
        return data;
    };
    exports.addClubInfoListener = function (key, callback) {
        if (!msgListeners[key]) {
            msgListeners[key] = [];
        }
        for (var i = 0; i < msgListeners[key].length; i++) {
            if (callback == msgListeners[key][i]) {
                return callback;
            }
        }
        msgListeners[key].push(callback);
        return callback;
    };
    exports.removeClubInfoListener = function (key, callback) {
        // msgListeners[key] = undefined;
        if (callback && msgListeners[key]) {
            var idx = msgListeners[key].indexOf(callback)
            if (idx >= 0) {
                msgListeners[key].splice(idx, 1);
            }
        } else {
            msgListeners[key] = undefined;
        }
    };
    exports.getWanfaPlayerCountByMapId = function (id) {
        switch (id) {
            case MAP_ID.PDK:
                return 3;
            case 319:
                return 4;
            case 318:
                return 3;
            case 320:
                return 4;
            case 1:
                return 4;
            case 22:
                return 4;
            case MAP_ID.DN:
                return 6;
            case MAP_ID.ZJH:
                return 5;
            case MAP_ID.NN:
                return 5;
            case MAP_ID.PDK:
                return 3;
            case MAP_ID.DDZ_JD:
            case MAP_ID.DDZ_LZ:
                return 3;
        }
        return 4;
    };
    exports.alert11 = function (content, onOk, canCancel, isAutoHideLoading, isHCenter, isVCenter) {
        isAutoHideLoading = _.isUndefined(isAutoHideLoading) ? true : isAutoHideLoading;
        if (isAutoHideLoading)
            hideLoading();
        cc.director.getRunningScene().scheduleOnce(function () {
            var title = '提示';
            if (content.indexOf("恭喜您成为游戏新用户") >= 0) {
                title = 'game_given';
            } else if (onOk && _.isString(onOk) && onOk == 'noAnimation') {
                title = 'noAnimation';
            }
            var tishiLayer = new TishiLayer_Club('alert1', title, content, function () {
                if (onOk && cc.isFunction(onOk))
                    onOk();
            }, null, !!canCancel, isHCenter, isVCenter, null, null);
            cc.director.getRunningScene().addChild(tishiLayer, 1000);
        }, 0);
    };

    exports.alert22 = function (content, onOk, onCancel, canCancel, isAutoHideLoading, isHCenter, isVCenter) {
        isAutoHideLoading = _.isUndefined(isAutoHideLoading) ? true : isAutoHideLoading;
        if (isAutoHideLoading)
            hideLoading();
        cc.sys.isObjectValid(cc.director.getRunningScene()) && cc.director.getRunningScene().scheduleOnce(function () {
            var title = '提示';
            if (content == "是否确定退出登录?") {
                title = "quit_loading";
            } else if (content == "确定要一键修复客户端") {
                title = 'quit_fix';
            } else if (content == "确定要退出房间吗?") {
                title = 'quit_game';
            } else if (content == "解散房间不扣房卡，是否要申请解散房间？" || content == "是否要申请解散房？") {
                title = 'quit_vote';
            } else if (content == "登录失败, 请检查您的网络或者重新登录") {
                title = 'quit_faildload';
            } else if (content == "") {
                title = '';
            } else if (content == '确定退出比赛?') {
                title = 'quit_tuisai';
            }
            if (canCancel && _.isString(canCancel) && canCancel == 'noAnimation') {
                title = 'noAnimation';
            }
            var tishiLayer = new TishiLayer_Club('alert2', title, content, function () {
                if (onOk)
                    onOk();
            }, function () {
                if (onCancel)
                    onCancel();
            }, !!canCancel, isAutoHideLoading, isHCenter, isVCenter);
            cc.director.getRunningScene().addChild(tishiLayer, 1000);
        }, 0);
    };
    exports.tvibrate = function (s) {
        if (cc.sys.os == cc.sys.OS_IOS)
            cc.Device.vibrate(s);
        else if (cc.sys.os == cc.sys.OS_ANDROID) {
            cc.Device.vibrate(s);
        }
    };
})(window);