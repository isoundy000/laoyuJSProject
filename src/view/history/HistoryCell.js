var HistoryCell = {
    init: function () {
        this.txt_house = getUI(this, "t1");
        this.txt_time = getUI(this, "t2");
        this.id = getUI(this, "id");
        this.flag = getUI(this, "flag");
        this.maxPlayerCnt = 5;

        for (var i = 1; i <= this.maxPlayerCnt; i++) {
            this["name" + i] = getUI(this, "name" + i);
            this["score" + i] = getUI(this, "score" + i);
            this["head" + i] = getUI(this, "head" + i);
            this["info" + i] = getUI(this, "info" + i);
            this["fangzhu" + i] = getUI(this, "fangzhu" + i);
        }
    },

    setIndex: function (index, data) {
        this.id.setString(index + 1);
        this.index = index;
        var time = data.ctime;
        if(!time){
            time = timestamp2time(data['create_time']);
        }
        this.txt_time.setString(time);
        this.txt_house.setString("房间:" + data.room_id);

        var useTilongResult = false;
        if(data.map_id == 310)//攸县
        {
            var wanfaArr = JSON.parse(data.optionstring);
            if (wanfaArr.wanfa == mRoom.FANGPAOFA || wanfaArr.wanfa == mRoom.XIANGXIANG
                || wanfaArr.wanfa == mRoom.SHAOYANGBOPI) {
                useTilongResult = true;
            }
        }

        for (var i = 1; i <= this.maxPlayerCnt; i++) {
            if (data["nickname" + i]) {
                this["head" + i].setVisible(true);
                this["info" + i].setVisible(true);
                this["name" + i].setVisible(true);
                this["score" + i].setVisible(true);
                this["fangzhu" + i].setVisible(true);

                this["name" + i].setString(ellipsisStr(data["nickname" + i], 8) + "");
                if (useTilongResult) {
                    this["score" + i].setString((data.tilongscore[i - 1].small == undefined || data.tilongscore[i - 1].small == null)
                        ? '0' : data.tilongscore[i - 1].small);
                } else {
                    if (data.resultscore[i - 1] >= 0) {  //绿色
                        this["score" + i].setTextColor(cc.color("#2BAC26"));
                    } else {//红色
                        this["score" + i].setTextColor(cc.color("#CA654A"));
                    }
                    this["score" + i].setString((data.resultscore == undefined || data.resultscore == null)
                        ? '0' : data.resultscore[i - 1]);
                }
                //头像
                var heads = data["heads"];
                if(heads) {
                    if (data.map_id != 310)//麻将
                    {
                        if (_.isString(heads)) {
                            heads = data["heads"].split(',');
                            for (var k = 0; k < heads.length; k++) {
                                heads[k] = heads[k].replace(/'/g, "");
                            }
                        }
                    }
                    var url = decodeURIComponent(heads[i - 1]);
                    if (url == undefined || (url.length == 0)) url = res.defaultHead;
                    loadImageToSprite(url, this["head" + i]);//头像
                }
            } else {
                this["head" + i].setVisible(false);
                this["info" + i].setVisible(false);
                this["name" + i].setVisible(false);
                this["score" + i].setVisible(false);
                this["fangzhu" + i].setVisible(false);
            }
        }
        //是不是自己赢了
        var myscore = 0;
        var fangzhuIndex = 1;
        for (var i = 1; i <= this.maxPlayerCnt; i++) {
            if (data["uid" + i] == gameData.uid) {
                if (data.resultscore[i - 1]) myscore = data.resultscore[i - 1];
                break;
            }
        }
        for (var i = 1; i <= this.maxPlayerCnt; i++) {
            //谁是房主
            if (data["uid" + i] && data.owner_uid == data["uid" + i]) {
                fangzhuIndex = i;
                break;
            }
        }
        //this["name" + fangzhuIndex].setString(ellipsisStr(data['nickname' + fangzhuIndex], 6) + "[房主]:");
        for (var i = 1; i <= this.maxPlayerCnt; ++i) {
            this["fangzhu" + i].setVisible((i == fangzhuIndex) ? true : false);
        }

        if (myscore > 0) {
            this.flag.setTexture(res.twin);
        } else if (myscore < 0) {
            this.flag.setTexture(res.tlose);
        } else {
            this.flag.setTexture(res.tping);
        }
    }
};