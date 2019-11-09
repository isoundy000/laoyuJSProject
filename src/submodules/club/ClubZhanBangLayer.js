/**
 * Created by www on 2018/10/16.
 */
(function () {
    var exports = this;
    var $ = null;
    var lastBtnIdx = -1;
    var rankResArr = [
        'res/submodules/club/img/zhanbang/icon_first.png'
        , 'res/submodules/club/img/zhanbang/icon_second.png'
        , 'res/submodules/club/img/zhanbang/icon_third.png'
        , 'res/submodules/club/img/zhanbang/title_bangwai.png'
    ];

    var setPosY = 0;
    var pageNumByMaxRecord = 0;
    var titleAdminsResArr = {
        "btn_0": {
            res1: 'res/submodules/club/img/zhanbang/btn_mineRecord_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_mineRecord_2.png',
        },
        "btn_1": {
            res1: 'res/submodules/club/img/zhanbang/btn_winner_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_winner_2.png',
        },
        "btn_2": {
            res1: 'res/submodules/club/img/zhanbang/btn_day_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_day_2.png',
        },
        "btn_3": {
            res1: 'res/submodules/club/img/zhanbang/btn_yestoday_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_yestoday_2.png',
        },
        "btn_4": {
            res1: 'res/submodules/club/img/zhanbang/btn_week_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_week_2.png',
        },
        "btn_5": {
            res1: 'res/submodules/club/img/zhanbang/btn_custom_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_custom_2.png',
        },
    };
    var titleMemResArr = {
        "btn_0": {
            res1: 'res/submodules/club/img/zhanbang/btn_mineRecord_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_mineRecord_2.png',
        },
        "btn_1": {
            res1: 'res/submodules/club/img/zhanbang/btn_day_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_day_2.png',
        },
        "btn_2": {
            res1: 'res/submodules/club/img/zhanbang/btn_yestoday_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_yestoday_2.png',
        },
        "btn_3": {
            res1: 'res/submodules/club/img/zhanbang/btn_week_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_week_2.png',
        },
        "btn_4": {
            res1: 'res/submodules/club/img/zhanbang/btn_custom_1.png',
            res2: 'res/submodules/club/img/zhanbang/btn_custom_2.png',
        },
    };
    var orderTypeArr = ['winnerCount', 'totalScore', 'roomCount'];
    var btnRankType = ['today', 'yesterday', 'week','custom'];

    var curSelectedTab = 0;
    var clubUrlTest = 'https://pay.yayayouxi.com/fy-club-api';
    var clubData = null;

    var ClubZhanBangLayer = cc.Layer.extend({
        myRecordData: [],
        maxRecordData: [],
        otherRankData: [],
        club_id: 0,

        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;
            this.list1 = cc.eventManager.addCustomListener('ClubParamSet', function (event) {
                var data = event.getUserData();
                if (data['result'] == 0) {
                    alert1('设置成功！');
                } else {
                    alert1(data['msg']);
                }
            });
            this.list2 = cc.eventManager.addCustomListener('ClubParamDel', function (event) {
                var data = event.getUserData();
                // that.checkCurrentWanfaIdx();
                if (data['result'] == 0) {
                    // alert1('设置成功！');
                } else {
                    alert1(data['msg']);
                }
            });
            this.list3 = cc.eventManager.addCustomListener('flushClub', function (event) {
                var data = event.getUserData();
                refreshClubData(data.info._id, data['info']);
                clubData = data['info'];
                that.setClubMemberVible();
            });
        },
        onExit: function () {
            if (this._tableView) {
                this._tableView.release();
                this._tableView.removeFromParent(true);
                this._tableView = null;
            }
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
            cc.eventManager.removeListener(this.list2);
            cc.eventManager.removeListener(this.list3);
        },
        ctor: function (club_id, data) {
            this._super();
            this.club_id = club_id;
            clubData = data;
            loadNodeCCS(res.ClubZhanBangLayer_json, this);
            var that = this;
            $ = create$(this.getChildByName("Layer"));
            TouchUtils.setOnclickListener($('btn_close'), function (node) {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('btn_queryRecord'), function (node) {
                that.addChild(new ZhanjiHuiFangLayer());
            });

            network.send(2103, {cmd: 'flushClub', club_id: this.club_id});

            that.initBtnList();

            return true;
        },
        initTableView: function () {
            var tableViewSize = $('scrolView').getSize();
            var tableViewAnchor = $('scrolView').getAnchorPoint();
            var tableViewPosition = $('scrolView').getPosition();
            var that = this;
            // try {
                if (!this._tableView) {
                    var tableView = new cc.TableView(this, cc.size(tableViewSize.width, tableViewSize.height));
                    tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                    tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_BOTTOMUP);
                    if (cc.winSize.width - 1280 > 0) {
                        tableViewPosition.x += (cc.winSize.width - 1280) * 0.5;
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
                    if (this._tableView && curSelectedTab == 1) {
                        this._tableView.setPositionY( tableViewPosition.y);
                    } else {
                        this._tableView.setPositionY( tableViewPosition.y - 10);
                    }
                    if(curSelectedTab == 0 || curSelectedTab==1 ){
                        tableViewRefresh(this._tableView,true);
                    }else{
                        tableViewRefresh(this._tableView);
                    }
                }
            // } catch (e) {
            //     if (that && cc.sys.isObjectValid(that)) that.removeFromParent(true);
            // }
            hideLoading();
        },
        getMyRecords: function () {
            var that = this;
            showLoading('正在加载..');
            var uri = '/Record/niuniuRecord?uid=' + gameData.uid + '&limit=20' + '&club_id=' + this.club_id;
            var sign = Crypto.MD5('request:' + uri).toString();
            NetUtils.httpGet("http://rec.yygameapi.com:56790" + uri + "&sign=" + sign, function (data) {
                that.myRecordData = JSON.parse(data)['data'];
                that.initTableView();
                if(that.myRecordData.length == 0){
                    hideLoading();
                    $('tip_no').setVisible(true);
                    $('tip_no').setString('暂无战绩信息')
                }
            }, function(){

            });
        },
        getMaxRecords: function () {
            var that = this;
            showLoading('正在加载..');
            var uri = '/Record/niuniuRecord?UserID=' + gameData.uid + '&limit=20' + '&club_id=' + this.club_id + '&skip=' + (pageNumByMaxRecord-1); // 页数
            var sign = Crypto.MD5('request:' + uri).toString();
            NetUtils.httpGet("http://rec.yygameapi.com:56790" + uri + "&sign=" + sign, function (data) {
                if(data){
                    var jsonData = JSON.parse(data);
                    if (jsonData && jsonData['data'] && jsonData['data'].length == 0 && pageNumByMaxRecord > 1) {
                        hideLoading();
                        pageNumByMaxRecord--;
                        $('follow_node.lb_page').setString(pageNumByMaxRecord);
                        alert1('没有更多的战绩了！');
                    } else {
                        that.maxRecordData = jsonData['data'];
                        that.initTableView();
                    }
                    if (jsonData && jsonData.data && jsonData['data'].length == 0) {
                        hideLoading();
                        $('tip_no').setVisible(true);
                        $('tip_no').setString('暂无大赢家战绩信息')
                    }
                }
            }, function(){

            });

        },
        getOtherRankList: function (orderType, rankType) {
            var that = this;
            showLoading('正在加载..');
            var pageSize = 30;
            var uri = '?area=' + gameData.parent_area
                + '&groupId=' + this.club_id + '@club'
                + '&timeType=' + rankType //今日榜today 昨日棒 yesterday // 本周榜 week
                + '&playerId=' + gameData.uid
                + '&orderByType=' + orderType ;//winner_count   total_score   room_count
                // + '&pageNo=' + 1
                // + '&pageSize=' + pageSize;
            var sign = Crypto.MD5('fy-club-stat' + gameData.parent_area + this.club_id + '@club' + gameData.uid).toString();
            console.log("/club/stat/getBigWinners" + uri + "&sign=" + sign);
            NetUtils.httpGet(clubUrlTest + "/club/stat/getRankingsList" + uri + "&sign=" + sign, function (data) {

                var data = JSON.parse(data);
                if (data.status) {
                    if (!data.resultData) {
                        hideLoading();
                        alert1('没有战绩信息');
                    } else {
                        that.otherRankData = data.resultData;
                        that.initRankScrollView(orderType);
                    }
                } else {
                    hideLoading();
                    alert1('' + data.errMsg);
                }
            }, function(){

            });
        },
        //获取自定义榜单
        getCustomRankList: function (orderType) {
            orderType = orderType || orderTypeArr[0];
            var that = this;
            showLoading('正在加载..');
            var uri = '?area=' + gameData.parent_area
                + '&groupId=' + this.club_id + '@club'
                + '&playerId=' + gameData.uid
                + '&orderByType=' + orderType;    //winner_count   total_score   room_count
            var sign = Crypto.MD5('fy-club-stat' + gameData.parent_area + this.club_id + '@club' + gameData.uid).toString();
            console.log(clubUrlTest+"/club/stat/getCustomList" + uri + "&sign=" + sign);

            NetUtils.httpGet(clubUrlTest + "/club/stat/getCustomList" + uri + "&sign=" + sign, function (data) {

                var data = JSON.parse(data);
                if (data.status) {
                    cc.log("=======getCustomRankList=======");
                    console.log(data);
                    var dateData  = getClubData(that.club_id);
                    if (!data.resultData) {
                        hideLoading();
                        alert1('没有战绩信息,请设置时间');
                        if($ && $('settime_node.lb_time')){
                            $('settime_node.lb_time').setString('请设置自定义榜统计时间');
                        }
                    } else {
                        that.otherRankData = data.resultData.rankingsList;
                        that.initRankScrollView(orderType);
                        //显示时间
                        var startTime = data.resultData.startTime;
                        var endTime = data.resultData.endTime;

                        dateData.start = startTime.split('-')[2].split(' ')[0]+ ':' + startTime.split('-')[2].split(' ')[1];
                        dateData.end = endTime.split('-')[2].split(' ')[0]+ ':' + endTime.split('-')[2].split(' ')[1];
                        if($ && $('settime_node.lb_time')){
                            $('settime_node.lb_time').setString('开始时间 '+ startTime + ' 结束时间 '+ endTime);
                        }
                    }
                    TouchUtils.setOnclickListener($('settime_node.btn_set_time'), function (node) {
                        that.addChild(new ClubSetZhanBangTime(dateData),50);
                    });
                    if (that.getMyClubMaster() == true){
                        $('settime_node.btn_set_time').setVisible(true);
                    }else{
                        $('settime_node.btn_set_time').setVisible(false);
                    }

                } else {
                    hideLoading();
                    alert1('' + data.errMsg);
                }
            }, function(){

            });
        },
        initMaxLists: function () {
            var that = this;
            $('winnerListNode').setVisible(true);
            $('btn_queryRecord').setVisible(true);
            var follow_node = $('follow_node');
            follow_node.setVisible(true);
            var selectDay = 1;
            $('lb_page', follow_node).setString(pageNumByMaxRecord);
            $('show_bg', follow_node).setVisible(false);
            TouchUtils.setOnclickListener($('page_up', follow_node), function () {
                if (pageNumByMaxRecord > 1) {
                    pageNumByMaxRecord--;
                    if(pageNumByMaxRecord < 1) {
                        pageNumByMaxRecord = 1;
                    }
                    $('lb_page', follow_node).setString(pageNumByMaxRecord);
                    that.getMaxRecords();
                } else {
                    hideLoading();
                    alert1('当前页为最新的战绩');
                }
            });
            TouchUtils.setOnclickListener($('page_next', follow_node), function () {
                if (that.maxRecordData.length == 0) {
                    alert11('没有更多的战绩了！');
                } else {
                    pageNumByMaxRecord++;
                    $('lb_page', follow_node).setString(pageNumByMaxRecord);
                    that.getMaxRecords();
                }
            });
            var func = function (type) {
                for (var i = 0; i < 3; i++) {
                    $('show_bg.btn_day' + (i + 1) + '.show_select', follow_node).setVisible(type == i);
                }
                $('show_select.lb_nowday', follow_node).setString('第' + (type + 1) + '天');
                selectDay = type + 1;
            }
            func(0);
            TouchUtils.setOnclickListener($('show_select', follow_node), function () {
                var isVisible = $('show_bg', follow_node).isVisible();
                $('show_bg', follow_node).setVisible(!isVisible);
                $('show_select.show_down', follow_node).setVisible(!isVisible);
                $('show_select.show_up', follow_node).setVisible(isVisible);
            });
            for (var i = 0; i < 3; i++) {
                (function (idx) {
                    var _node = $('show_bg.btn_day' + (idx + 1), follow_node);
                    TouchUtils.setOnclickListener(_node, function () {
                        func(idx);
                    })
                })(i);
            }

        },
        initOtherList: function (rankType) {
            var that = this;
            $('sortListNode').setVisible(true);
            var parentNode = $('sortListNode');
            $("btn_memVisible", parentNode).setVisible(true);
            $('bg_title.lb_score', parentNode).setString('次数');
            var func = function (idx, orderType) {
                for (var i = 0; i < 3; i++) {
                    var node = $('btn_up_' + (i + 1), parentNode);
                    if (idx == i) {
                        $('btn_selected', node).setVisible(true);
                        $('title_selected', node).setVisible(true);
                    } else {
                        $('btn_selected', node).setVisible(false);
                        $('title_selected', node).setVisible(false);
                    }
                }
                if (orderType != null) {
                    // 群主管理员有权限查看其他界面
                    that.queryOtherRankLists(orderType, rankType);
                }
            }
            func(0, null);
            TouchUtils.setOnclickListener($("btn_up_1", parentNode), function () {
                $('bg_title.lb_score', parentNode).setString('次数');
                func(0, orderTypeArr[0]);
            });
            TouchUtils.setOnclickListener($("btn_up_2", parentNode), function () {
                $('bg_title.lb_score', parentNode).setString('分数');
                func(1, orderTypeArr[1]);
            });
            TouchUtils.setOnclickListener($("btn_up_3", parentNode), function () {
                $('bg_title.lb_score', parentNode).setString('局数');
                func(2, orderTypeArr[2]);
            });

            that.setClubMemberVible(rankType);
            var btn_memNotVisible = $("btn_memVisible.btn_memNotVisible", parentNode);
            TouchUtils.setOnclickListener($("btn_memVisible", parentNode), function () {
                if (btn_memNotVisible.isVisible()) {
                    network.send(2103, {cmd: 'ClubParamSet', key: 'rankList' + rankType, value: "open",  club_id: that.club_id});
                } else {
                    network.send(2103, {cmd: 'ClubParamSet', key: 'rankList'  + rankType, value: "close", club_id: that.club_id});
                }
            });
        },
        queryOtherRankLists: function(orderType, rankType) {
            var that = this;

            var rankNode = $('sortListNode.rankScrollView');
            rankNode.removeAllChildren();
            if(rankType == "custom"){
                if (that.getMyClubPerssions() ||  that.getPerMissionForRankList(rankType) ) {
                    that.getCustomRankList(orderType);
                    $('settime_node').setVisible(true);
                    $('sortListNode.bg_fllowe').setPositionY(100);
                }
                return;
            }else{
                $('sortListNode.bg_fllowe').setPositionY(30);
            }

            if (that.getMyClubPerssions()) {
                that.getOtherRankList(orderType, rankType);
            } else if(that.getPerMissionForRankList(rankType)){
                that.getOtherRankList(orderType, rankType);
            }
        },
        /**
         * 获取我的权限
         * @returns {boolean}
         */
        getMyClubPerssions: function() {
            var adminsArr = clubData['admins'];
            var isInAdmins = false;
            for (var i = 0; i<adminsArr.length; i++) {
                if (gameData.uid == adminsArr[i]) {
                    isInAdmins = true;
                    break;
                }
            }
            if (gameData.uid == clubData.owner_uid) {
                isInAdmins = true;
            }
            return isInAdmins;
        },

        getMyClubMaster: function() {
            var isInAdmins = false;
            if (gameData.uid == clubData.owner_uid) {
                isInAdmins = true;
            }
            return isInAdmins;
        },
        getPerMissionForRankList: function(rankType) {
            var params = clubData['param'];
            var isCanOpenRankList = false;
            if (params && params['rankList' + rankType]) {
                if (params['rankList' + rankType ] == 'open') {
                    isCanOpenRankList = true;
                } else {
                    isCanOpenRankList = false;
                }
            }
            return isCanOpenRankList;
        },
        /**
         * 判断我是否在这个管理远列表
         */
        setClubMemberVible: function(rankType) {
            var isInAdmins = this.getMyClubMaster();
            var parentNode = $('sortListNode');
            if (isInAdmins) {
                var params = clubData['param'];
                $("btn_memVisible", parentNode).setVisible(true);
                if (!rankType){
                    rankType = btnRankType[curSelectedTab - 2];
                }

                if (params && params['rankList' + rankType]) {
                    if ( params['rankList'+ rankType] == 'open') {
                        $("btn_memVisible.btn_memNotVisible", parentNode).setVisible(false);
                    } else if  ( params['rankList'+ rankType] == 'close'){
                        $("btn_memVisible.btn_memNotVisible", parentNode).setVisible(true);
                    } else {
                        $("btn_memVisible.btn_memNotVisible", parentNode).setVisible(true);
                    }
                } else {
                    $("btn_memVisible.btn_memNotVisible", parentNode).setVisible(true);
                }
            } else {
                $("btn_memVisible", parentNode).setVisible(false);
            }
        },
        initRankScrollView: function (orderType) {
            if (this.otherRankData && this.otherRankData.length > 0) {
                $("sortListNode.noRecordNode").setVisible(false);
            } else {
                $("sortListNode.noRecordNode").setVisible(true);
            }
            var flloweNode = $('sortListNode.bg_fllowe');
            var num = this.otherRankData.length;
            var cellHeight = 80;
            flloweNode.setVisible(true);

            var rankNode = $('sortListNode.rankScrollView');
            var viewHight = num * cellHeight;
            rankNode.removeAllChildren();

            var innerHeight = rankNode.getContentSize().height;
            if (viewHight >= innerHeight) {
                innerHeight = viewHight;
            }
            rankNode.innerHeight = innerHeight;
            rankNode.setInnerContainerSize(cc.size(940, viewHight));
            var myRank = -1;
            var rankInfo = null;
            for (var i = 0; i < num; i++) {
                var cell = rankNode.getChildByName('cell' + i);
                var itemData = this.otherRankData[i];
                if (!cell) {
                    cell = new ClubZhanBangRankItem(itemData, i, orderType);
                    rankNode.addChild(cell);
                }
                cell.setPosition(cc.p(0, innerHeight - cellHeight * (i + 1)));

                if (this.otherRankData[i]['playerId'] == gameData.uid) {
                    myRank = i;
                    rankInfo = itemData;
                }
            }
            loadImage(gameData.headimgurl, $('info_1.head', flloweNode));
            $('lb_name', flloweNode).setString(ellipsisStr(gameData.nickname, 5));
            $('lb_id', flloweNode).setString(gameData.uid);
            $('lb_rank', flloweNode).setVisible(false);
            if (myRank > -1) {
                if (myRank < 3) {
                    $('icon_rank', flloweNode).setVisible(true);
                    $('icon_rank', flloweNode).setTexture(rankResArr[myRank]);
                } else {
                    $('lb_rank', flloweNode).setVisible(true);
                    $('lb_rank', flloweNode).setString(myRank + 1);
                    $('icon_rank', flloweNode).setVisible(false);
                }
                if (orderType == 'winnerCount') {
                    $('lb_score', flloweNode).setString(rankInfo['winnerCount']);
                } else if (orderType == 'totalScore') {
                    $('lb_score', flloweNode).setString(rankInfo['totalScore']);
                } else if (orderType == 'roomCount') {
                    $('lb_score', flloweNode).setString(rankInfo['roomCount']);
                }
            } else {
                $('lb_rank', flloweNode).setString(0);
                $('lb_score', flloweNode).setString(0);
                // $('icon_rank', flloweNode).setTexture(rankResArr[3]);
                $('icon_rank', flloweNode).setVisible(false);
                $('lb_rank', flloweNode).setVisible(false);
            }
            hideLoading();

        },
        initBtnList: function () {
            var that = this;

            var num = 6;
            var itemHeight = 105;
            var cellParent = $('btn_SView');
            var func = function (idx) {
                lastBtnIdx = idx;
                curSelectedTab = idx;
                cc.sys.localStorage.setItem('Sg_zhanbang_btn', idx);
                for (var i = 0; i < num; i++) {
                    var node = cellParent.getChildByName('row' + i);
                    if (node) {
                        if (i == idx) {
                            $('btn_select', node).setVisible(true);
                            $('title_1', node).setVisible(true);
                            $('title_2', node).setVisible(true);
                        } else {
                            $('btn_select', node).setVisible(false);
                            $('title_1', node).setVisible(true);
                            $('title_2', node).setVisible(false);
                        }
                    }
                }
                $('winnerListNode').setVisible(false);
                $('btn_queryRecord').setVisible(false);
                $('myRecoredNode').setVisible(false);
                $('sortListNode').setVisible(false);
                $('follow_node').setVisible(false);
                $('settime_node').setVisible(false);
                $('tip_no').setVisible(false);
                $('sortListNode.bg_fllowe').setVisible(false);
                if (that._tableView) {
                    that._tableView.setVisible(true);
                }
                if (curSelectedTab == 0) {//我的战绩
                    $('myRecoredNode').setVisible(true);
                    $('btn_queryRecord').setVisible(true);
                    that.getMyRecords();
                } else if (curSelectedTab == 1 && that.getMyClubPerssions()) { //大赢家
                    that.maxRecordData = [];
                    pageNumByMaxRecord = 1;
                    that.getMaxRecords();
                    that.initMaxLists();
                } else { //剩下的榜单
                    if (that._tableView) {
                        that._tableView.setVisible(false);
                    }
                    if (that.getMyClubPerssions()) {
                        that.initOtherList(btnRankType[idx - 2]);
                        that.queryOtherRankLists(orderTypeArr[0], btnRankType[idx - 2])
                        that.setClubMemberVible(btnRankType[idx - 2]);
                    } else {
                        that.initOtherList(btnRankType[idx - 1]);
                        that.queryOtherRankLists(orderTypeArr[0], btnRankType[idx - 1])
                        that.setClubMemberVible(btnRankType[idx - 1]);
                    }

                }
            };
            var viewHight = itemHeight * num;
            var innerHeight = cellParent.getContentSize().height;
            if (viewHight >= innerHeight) {
                innerHeight = viewHight;
            }
            cellParent.innerHeight = innerHeight;
            cellParent.setInnerContainerSize(cc.size(280, viewHight));
            var item = cellParent.getChildByName('row' + 0);
            var resArr = [];
            if (that.getMyClubPerssions()) {
                num = 6;
                resArr = titleAdminsResArr;
            } else {
                num = 5;
                resArr = titleMemResArr;
            }
            for (var i = 0; i < num; i++) {
                (function (item, idx, resArr) {
                    var cell = cellParent.getChildByName('row' + i);
                    if (!cell) {
                        cell = duplicateSprite(item);
                        cell.setName('row' + i);
                        cell.setVisible(true);
                        cellParent.addChild(cell);
                    }
                    cell.setPosition(cc.p(0, innerHeight - itemHeight * i - 120));
                    if (resArr['btn_' + idx]) {
                        $('title_1', cell).loadTexture(resArr['btn_' + idx].res1);
                        $('title_2', cell).loadTexture(resArr['btn_' + idx].res2);
                        if (idx == 1 || idx == 2 || idx == 3 || idx == 4) {
                            $('title_1', cell).setScaleX(.8);
                            $('title_2', cell).setScaleX(.8);
                        } else {
                            $('title_1', cell).setScaleX(1);
                            $('title_2', cell).setScaleX(1);
                        }
                    }
                    if (idx == num - 1) {
                        var _idx = cc.sys.localStorage.getItem('Sg_zhanbang_btn') || 0;
                        func(_idx);
                    }
                    TouchUtils.setOnclickListener(cell, function () {
                        if (lastBtnIdx != idx){
                            func(idx)
                        }
                    }, {"swallowTouches": false});

                })(item, i, resArr);
            }
        },
        tableCellTouched: function (table, cell) {
            var idx = cell.getIdx();
            var itemData = null;
            var lenth = 0;
            if (curSelectedTab == 0) {
                lenth = this.myRecordData.length;
                itemData = this.myRecordData[lenth - idx - 1];
            } else if (curSelectedTab == 1 && this.getMyClubPerssions()) {
                lenth = this.maxRecordData.length;
                itemData = this.maxRecordData[lenth - idx - 1];
            }
            console.log(itemData);
            if (itemData && itemData['result_arr'] && itemData['result_arr'].length > 0) {
                // window.maLayer.addChild(new ZhanjiDetailLayer(itemData['id'], itemData['nickname1'], itemData['nickname2'], itemData['nickname3'], itemData['nickname4'], itemData['result_arr'], itemData, this.club_id));
                if([MAP_ID.NN, MAP_ID.DN, MAP_ID.DN_JIU_REN, MAP_ID.DN_AL_TUI, MAP_ID.DN_WUHUA_CRAZY].indexOf(itemData.map_id) >= 0) {
                    var curscene = cc.director.getRunningScene();
                    var layer = new HistoryDetailNiuNiu(itemData);
                    layer.setPositionX(cc.winSize.width/2 - 1280/2);
                    curscene.addChild(layer, 100);
                }else{
                    var content = HUD.showLayer(HUD_LIST.HistoryDetail, this);
                    content.setPositionX(cc.winSize.width / 2);
                    content.updateContent(itemData);
                }
            }else{
                alert1("尚未产生战绩");
            }
        },
        tableCellAtIndex: function (table, idx) {
            var strValue = idx.toFixed(0);
            var cell = table.dequeueCell();
            var itemData;
            var lenth;
            if (curSelectedTab == 0) {
                lenth = this.myRecordData.length;
                itemData = this.myRecordData[lenth - idx - 1];
            } else if (curSelectedTab == 1) {
                lenth = this.maxRecordData.length;
                itemData = this.maxRecordData[lenth - idx - 1];
            }
            if (!cell) {
                cell = new ClubZhanBangItem(itemData, idx + 1, this.club_id, this);
            }
            if (curSelectedTab == 0 || curSelectedTab == 1) {
                cell.initCellData(itemData, idx, curSelectedTab);
            }
            // else if (curSelectedTab == 1) {
            //     cell.initMaxCellData(itemData, idx, curSelectedTab);
            // }
            return cell;
        },
        tableCellSizeForIndex: function (table, idx) {
            if (curSelectedTab == 0) {
                var lenth = this.myRecordData.length;
                var itemData = this.myRecordData[lenth - idx - 1];
                if(itemData && itemData.uid5){
                    return cc.size(960, 210);
                }else {
                    return cc.size(960, 120);
                }
            } else if (curSelectedTab == 1) {
                var lenth = this.maxRecordData.length;
                var itemData = this.maxRecordData[lenth - idx - 1];
                if(itemData && itemData.uid5){
                    return cc.size(960, 210);
                }else {
                    return cc.size(960, 120);
                }
            }
        },
        numberOfCellsInTableView: function (table) {
            if (curSelectedTab == 0) {
                return this.myRecordData.length;
            } else if (curSelectedTab == 1) {
                return this.maxRecordData.length;
            }
            return 0;
        },
        scrollViewDidScroll: function (view) {
            var size = view.getContentOffset();
            if (curSelectedTab == 1) {
                if (size.y != 0) {
                    setPosY = size.y;
                    // console.log('==========================11111');
                }
            }
        },
        scrollViewDidZoom: function (view) {
        },
        _offsetFromIndex: function (view) {
        },


        //share
        shareNode: function(_data){
            var that = this;
            var clubshare = that.getChildByName('ClubShareZhanjiLayer');
            if(clubshare){
                clubshare.removeFromParent();
                clubshare = null;
            }
            clubshare = new ClubShareZhanjiLayer(_data);
            clubshare.setName('ClubShareZhanjiLayer');
            that.addChild(clubshare, -1);
            that.scheduleOnce(function(){
                that.addChild(new ShareTypeLayer(clubshare), 100);
            }, 0.3);
        }
    });

    exports.ClubZhanBangLayer = ClubZhanBangLayer;
})(window);