var NiuniuHistoryCell = {
    init: function () {
        this.txt_house = getUI(this, "t1");
        this.txt_time = getUI(this, "t2");
        this.id = getUI(this, "id");
        this.flag = getUI(this, "flag");
        this.bg_cell = getUI(this, "bg_cell");
        this.roominfo = getUI(this, "roominfo");
        this.score = getUI(this, "score");
        this.tjushu = getUI(this, "tjushu");
        this.tdifen = getUI(this, "tdifen");
        this.twanfa = getUI(this, "twanfa");
        this.btn_fenxiang = getUI(this, "btn_fenxiang");

        this.highestScore = 0;
        this.lowestScore = 0;
    },
    setParentLayer: function(parentlayer){
        this.parentlayer = parentlayer;
    },
    setIndex: function (index, data) {
        var that = this;
        var itemSize = cc.size(1170, 520);
        this.highestScore = 0;
        this.lowestScore = 0;

        this.id.setString(index + 1);
        this.index = index;
        this.txt_time.setString(data.ctime);
        this.txt_house.setString("房间:" + data.room_id);
        if(data['uid7']) {
            this.bg_cell.setContentSize(cc.size(1170, 15 + 390 + 75));
            this.roominfo.setPositionY(15 + 390);
            this.score.setPositionY(15);
        }else if(data['uid4']) {
            this.bg_cell.setContentSize(cc.size(1170, 15 + 260 + 75));
            this.roominfo.setPositionY(15 + 260);
            this.score.setPositionY(15);
        }else{
            this.bg_cell.setContentSize(cc.size(1170, 15 + 130 + 75));
            this.roominfo.setPositionY(15 + 130);
            this.score.setPositionY(15);
        }
        //分享
        var setData = function (ref, data) {
            var wanfaArr = {};
            var tdifenLabel = getUI(ref, 'tdifen');
            var tjushuLabel = getUI(ref, 'tjushu');
            var twanfaLabel = getUI(ref, 'twanfa');
            var idLabel = getUI(ref, 'id');
            var t1Label = getUI(ref, 't1');
            var t2Label = getUI(ref, 't2');
            idLabel.setString(index + 1);
            t1Label.setString("房间:" + data.room_id);
            t2Label.setString(data.ctime || (timestamp2time(data['create_time'], "yyyy-mm-dd HH:MM:ss")));
            if(data.map_id == MAP_ID.ZJH || data.map_id == MAP_ID.EPZ || data.map_id == MAP_ID.PK_13S){
                tdifenLabel.setVisible(false);
                tjushuLabel.setString("局数："+data['total_round']);
                twanfaLabel.setString("玩法："+gameData.mapId2Name(data.map_id));
            }else {
                tjushuLabel.setString("局数："+wanfaArr.rounds);
                if(wanfaArr.basescore) {
                    twanfaLabel.setString("底分：" + wanfaArr.basescore);
                }
                var optionArr = {};
                if(data.optionstring){
                    optionArr = JSON.parse(data.optionstring)
                }
                var wanfatxt = getZhuangMode(optionArr);//wanfaArr.name;
                if(wanfaArr.desp && wanfaArr.desp.indexOf('九人') >= 0)  wanfatxt = wanfatxt + "-九人场";
                twanfaLabel.setString("玩法："+wanfatxt);
            }
            var wanfa2str = "";
            if(data.map_id == MAP_ID.ZJH || data.map_id == MAP_ID.EPZ || data.map_id == MAP_ID.PK_13S){
                if(data.map_id == MAP_ID.PK_13S && data.optionstring){
                    var optionArr  = JSON.parse(data.optionstring);
                    wanfa2str = optionArr.desp;
                }else{
                    wanfa2str = data['wanfa'];
                }
            }else {
                if (wanfaArr.Xiaobeilv == "3222") {
                    wanfa2str += '双十x3 十带九x2 十带八x2 十带七x2 ';
                }
                if (wanfaArr.Xiaobeilv == "4322") {
                    wanfa2str += '双十x4 十带九x3 十带八x2 十带七x2 ';
                }
                if (wanfaArr.kuozhan1) {
                    wanfa2str += '五花/炸弹x6 五小x8 ';
                }
                if (wanfaArr.kuozhan2) {
                    wanfa2str += '顺子/葫芦/同花x5';
                }
                if (wanfaArr.kuozhanwuhua1) {
                    wanfa2str += '炸弹x8 四十大/十小x6';
                }
            }
            getUI(ref, "wanfa2").setString(wanfa2str);
            for (var i = 1; i <= 9; i++) {
                if (data["uid" + i]) {
                    if (data.resultscore[i-1] > that.highestScore) {
                        that.highestScore = data.resultscore[i-1];
                    }
                    if(data.resultscore[i-1] < that.lowestScore){
                        that.lowestScore = data.resultscore[i-1];
                    }

                    var bg = getUI(ref, "bg_" + i);
                    var posY = 0;
                    if(data['uid7']) {
                        posY = (3 - Math.floor((i+2)/3))*130;
                    }else if(data['uid4']){
                        posY = (2 - Math.floor((i+2)/3))*130;
                    }else{
                        posY = 0;
                    }
                    bg.setPositionY(posY);
                    bg.setVisible(true);
                    //// $('titlelist.score' + (i + 1)).setFntFile((score >= 0) ? res.score_yellow_fnt : res.score_blue_fnt);
                    var score = getUI(bg, 'score');
                    var score2 = getUI(bg, 'score2');
                    var title_win = getUI(bg, 'title_win');
                    var title_shu = getUI(bg, 'title_shu');
                    if(data.resultscore[i-1] >= 0){
                        score.setString(data.resultscore[i-1]);
                        score.setVisible(data.resultscore[i-1] >= 0);
                        score2.setVisible(data.resultscore[i-1] < 0);
                    }else{
                        score2.setString(data.resultscore[i-1]);
                        score.setVisible(data.resultscore[i-1] >= 0);
                        score2.setVisible(data.resultscore[i-1] < 0);
                    }
                    title_win.setVisible(data.resultscore[i-1] >= 0);
                    title_shu.setVisible(data.resultscore[i-1] < 0);
                    bg.setTexture((data.resultscore[i - 1]) >= 0 ? 'res/image/ui/history/jiesuan_item2.png' :
                        'res/image/ui/history/jiesuan_item3.png');
                    getUI(bg, "name").setString(ellipsisStr(data["nickname" + i], 6) + "");
                    //头像
                    var url = "";
                    if(data["heads"]) {
                        if (data['map_id'] == MAP_ID.ZJH || data['map_id'] == MAP_ID.EPZ) {
                            if (data['heads']) {
                                var heads = data['heads'].split(',');
                                if (heads[i - 1]) {
                                    var head = heads[i - 1].replace(/'/g, "");
                                    url = decodeURIComponent(head);
                                }
                            }
                        } else {
                            url = decodeURIComponent(data["heads"][i - 1]);
                        }
                    }
                    if (url == undefined || (url.length == 0)) url = res.defaultHead;
                    loadImageToSprite(url, getUI(bg, "head"));//头像

                } else {
                    var bg = getUI(ref, "bg_" + i);
                    bg.setVisible(false);
                }
            }
            for (var i = 1; i <= 9; i++) {
                if (data["uid" + i]) {
                    var bg = getUI(ref, "bg_" + i);
                    getUI(bg, 'icon_dyj').setVisible(that.highestScore > 0 && data.resultscore[i-1] == that.highestScore);
                    getUI(bg, 'icon_thl').setVisible(that.lowestScore < 0 && data.resultscore[i-1] == that.lowestScore);
                }
            }
            //是不是自己赢了
            var fangzhuIndex = 1;
            for (var i = 1; i <= 9; i++) {
                //谁是房主
                if (data["uid" + i] && data.owner_uid == data["uid" + i]) {
                    fangzhuIndex = i;
                    break;
                }
            }
            for (var i = 1; i <= 9; ++i) {
                var bg = getUI(ref, "bg_" + i);
                getUI(bg, 'fangzhu').setVisible((i == fangzhuIndex) ? true : false);
            }
        };
        TouchUtils.setOnclickListener(this.btn_fenxiang, function () {
            // if (!cc.sys.isNative)
            //     return;

            var curscene = cc.director.getRunningScene();

            var sharebg = curscene.getChildByName('sharebg');
            if(!sharebg){
                sharebg = new cc.Sprite(res.jiesuan_bg_png);
                sharebg.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
                sharebg.setName('sharebg');
                curscene.addChild(sharebg, -1);
            }
            sharebg.setVisible(true);
            var nodeForShare = sharebg.getChildByName('nodeForShare');
            if(!nodeForShare){
                nodeForShare = ccs.load(res.NiuniuHistoryCell_json, "res/").node;
                nodeForShare.setPosition((1280-itemSize.width)/2, (720-itemSize.height)/2);
                nodeForShare.setName('nodeForShare');
                sharebg.addChild(nodeForShare);
            }
            setData(nodeForShare, data);
            that.scheduleOnce(function(){
                WXUtils.captureAndShareToWX(sharebg, 0x88F0);//0x88F0
            }, 1);
            that.scheduleOnce(function(){
                sharebg.setVisible(false);
            }, 2);
            // if (!cc.sys.isNative)
            //     return;
            // var nodeForShare = ccs.load(res.NiuniuHistoryCell_json, "res/").node;
            // // nodeForShare.setPosition(cc.p(itemSize.width / 2, itemSize.height / 2));
            // setData(nodeForShare, data);
            // nodeForShare.setPosition((1280-itemSize.width)/2, (720-itemSize.height)/2);
            // // that.addChild(nodeForShare);
            // var bg = new cc.Sprite(res.jiesuan_bg_png);
            // bg.setPosition(cc.p(nodeForShare.getContentSize().width/2, nodeForShare.getContentSize().height/2));
            // nodeForShare.addChild(bg, -1);
            // WXUtils.captureAndShareToWX(nodeForShare, 0x88F0);//0x88F0
        });

        setData(this, data);
    }
};