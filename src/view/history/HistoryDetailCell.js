var HistoryDetailCell = {
    init: function () {
        this.bg = getUI(this, "bg_cell");
        this.txt_id = getUI(this, "txt_id");
        this.txt_time = getUI(this, "txt_time");
        this.share = getUI(this, "share");
        this.huifang = getUI(this, "huifang");
        this.share.addTouchEventListener(this.shareBack, this);
        this.huifang.addTouchEventListener(this.huifangBack, this);

        this.ipList = _.clone(gameData.ipList);
        // this.ipList.splice(0, 0, DC.httpServerIp4);
    },

    setIndex: function (index, repalyRoomData) {
        this.index = index;
        this.repalyRoomData = repalyRoomData;
        this.result_arr = repalyRoomData.result_arr;
        this.result = repalyRoomData.result_arr[index];
        // this.recordCode = repalyRoomData.room_id + "-" + (index + 1);
        this.recordCode = repalyRoomData["_id"] + "-" + (index + 1);
        this.httpHost = "http://gg-paohuzi.oss-cn-hangzhou.aliyuncs.com/niuniu-rec/"
        this.replayurl = this.httpHost + "/" + this.recordCode;
        this.txt_id.setString(index + 1);


        if (this.result[0] > 0) {
            var timestr = timestamp2time(this.result[0]);
            if (timestr && timestr.length > 5) timestr = timestr.substr(5);
            this.txt_time.setString(timestr);

            for (var i = 1; i <= 9; i++) {
                var score = getUI(this, "score" + i);
                if (repalyRoomData["uid" + i]) {
                    score.setVisible(true);
                    score.setString((repalyRoomData.result_arr[index][i] == undefined) ? 0 : repalyRoomData.result_arr[index][i]);
                    score.setTextColor((repalyRoomData.result_arr[index][i] >= 0) ? cc.color(121, 102, 62) : cc.color(20, 118, 153));
                } else {
                    score.setVisible(false);
                }
            }
            if (repalyRoomData["uid6"]) {
                for (var i = 1; i <= 9; i++) {
                    var score = getUI(this, "score" + i);
                    score.setPosition(cc.p(180 + (i - 1) * 100, 33));
                }
                this.txt_time.setVisible(false);
            }
        } else {
            this.txt_time.setString('房间解散');
            for (var i = 1; i <= 9; i++) {
                var score = getUI(this, "score" + i);
                if (repalyRoomData["uid" + i]) {
                    score.setVisible(true);
                    score.setString((repalyRoomData.result_arr[index][i] == undefined) ? "" : (repalyRoomData.result_arr[index][i] > 0 ? '同意' : ''));
                } else {
                    score.setVisible(false);
                }
            }
            this.share.setVisible(false);
            this.huifang.setVisible(false);
        }

        this.record_round = index + 1;
        // this.bg.loadTexture((index % 2 == 0) ? res.history_detailcell2_png : res.history_detailcell1_png);
    },
    shareBack: function (sender, type) {
        var ok = touch_process(sender, type);
        if (ok) {
            // http://gg-paohuzi.oss-cn-hangzhou.aliyuncs.com/phz-rec/994910-1
            var replayurl_split = this.replayurl.split("/");
            var rec_str = replayurl_split[replayurl_split.length - 1];
            var rec_str_split = rec_str.split("-");
            var rec_num = rec_str_split[1] + "" + rec_str_split[0];
            console.log("玩家【" + gameData.nickname + "】分享了一个回放码: " + rec_num + ", 在大厅点击进入战绩页面, 然后点击查看回放按钮, 输入回放码点击确定后即可查看.", 0, getCurTimestamp() + gameData.uid);
            WXUtils.shareText("玩家【" + gameData.nickname + "】分享了一个回放码: " + rec_num + ", 在大厅点击进入战绩页面, 然后点击查看回放按钮, 输入回放码点击确定后即可查看.", 0, getCurTimestamp() + gameData.uid);
        }
    },
    huifangBack: function (sender, type) {
        var that = this;
        var ok = touch_process(sender, type);
        if (ok) {
            // httpGet(this.replayurl, this.huifangGet.bind(this), this.huifangGetFail.bind(this));
            if (this.repalyRoomData["map_id"] == MAP_ID.PK_13S) {
                var localVersion = SubUpdateUtils.getLocalVersion()['sss'];
                if (localVersion == '1.0.0' && cc.sys.isNative) {
                    console.log("localVersion" + localVersion);
                    alert1('请先拉取十三张更新包!')
                    return;
                }
                //加载十三水资源
                var sub = 'sss';
                var manifestDirPath = cc.sys.writablePath + sub + '/';
                var subSrc = 'src/submodules/' + sub + '/' + sub + '.jsc';
                if (!cc.sys.isNative || jsb.fileUtils.isFileExist(manifestDirPath + subSrc)) {
                    SubUpdateUtils.loadSubGame(sub, function () {
                        var curscene = cc.director.getRunningScene();
                        if (that.repalyRoomData) {
                            try{
                                curscene.addChild(new HuifangDetailedLayer(that.repalyRoomData, that.index));
                            }catch (e){
                                console.log(e.stack);
                                console.log(e.message);
                            }

                        }
                    });
                }

            } else {
                this.reTry();
            }
        }
    },
    reTry: function (retryCnt) {
        var that = this;
        retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;
        var ip = this.ipList[parseInt(retryCnt) % this.ipList.length];
        // ip = "http://" + ip + ":30003"
        ip = 'http://gg-paohuzi.oss-cn-hangzhou.aliyuncs.com';
        var path = "/niuniu-rec/";
        
        if (that.repalyRoomData["map_id"] == 310) {
            DC.httpData(path + this.recordCode, {}, function (data) {
                mRoom.isReplay = true;
                mRoom.replayData = new ReplayData(data);
                mRoom.replayData.round = that.record_round;

                var option = data[0].data.Option;
                var obj = decodeHttpData(option);
                mRoom.roomId = data[0].data.RoomID;
                gameData.roomId = mRoom.roomId;
                mRoom.replayTime = data[1].data.StartTime;
                mRoom.getWanfa(obj);

                HUD.showScene(HUD_LIST.Room, that);
            }, false, ip, function () {
                retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;
                if (retryCnt < that.ipList.length - 1) {
                    retryCnt++;
                    that.reTry(retryCnt);
                    HUD.showMessage("正在进行第" + parseInt(retryCnt) + "次重试");
                } else {
                    HUD.showMessageBox('提示', '请求信息失败,请检查您的网络', function () {
                    }, true);
                }
            }, true);
        } else {
                console.log("0000000000000000");
            console.log(ip + path + this.recordCode);
            NetUtils.httpGet(ip + path + this.recordCode, function (data) {
                cc.log(data);
                var tData = data.replace(/'/g, "\"");
                data = JSON.parse(tData);
                if (data['3002']) {
                    gameData.mapId = data['3002']['data']['map_id'];
                    gameData.roomId = data['3002']['data']['room_id'];
                    gameData.players = data['3002']['data']['players'];
                    gameData.ownerUid = data['3002']['data']['owner'];
                    gameData.last3002 = data['3002'];
                    gameData.wanfaDesp = data['3002']['data']['desp'];
                    gameData.totalRound = data['3002']['data']['total_round'];
                    gameData.leftRound = data['3002']['data']["left_round"] ? data['3002']['data']["left_round"] : data['3002']['data']['total_round'] - 1;
                    //人数
                    if (gameData.players) {
                        gameData.playerNum = gameData.players.length;
                    }
                    SubUpdateUtils.showGameScene(data);
                } else if (_.isArray(data)) {//考考回放
                    gameData.roomId = data[0].data.RoomID;
                    var option = data[0].data.Option;
                    var obj = decodeHttpData(option);
                    gameData.mapId = obj.mapid;
                    mRoom.isReplay = true;

                    SubUpdateUtils.showGameScene(data);
                }
            }, function () {
                retryCnt = typeof retryCnt === 'undefined' ? 0 : retryCnt;
                if (retryCnt < that.ipList.length - 1) {
                    retryCnt++;
                    that.reTry(retryCnt);
                    HUD.showMessage("正在进行第" + parseInt(retryCnt) + "次重试");
                } else {
                    HUD.showMessageBox('提示', '请求信息失败,请检查您的网络', function () {
                    }, true);
                }
            });
        }
    },
    huifangGetFail: function () {
        HUD.showMessage("录像不存在或者网络出现问题");
    }
};