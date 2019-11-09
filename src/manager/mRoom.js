var mRoom = {
    roomType:0,
    scoreInfo:{},
    voiceMap:{},
    InGameScore:{},
    YAYA:"yaya",
    CHANGDE:"changde",
    FANGPAOFA:"fangpaofa",
    LEIYANG:"leiyang",
    CHANGSHA:"changsha",
    SHAOYANG:"shaoyang",
    SHAOYANGBOPI:"shaoyangbopi",
    HONGGUAIWAN:"huaihua",
    XIANGXIANG:"xiangxiang",
    YOUXIAN:"youxian",
    GUILIN:"guilin",
    CHENZHOU:"chenzhou",
    HENGYANG:"hengyang",
    MAOHUZI:"maohuzi",
    HENGDONG:"hengdong",
    WEIMAQUE:"anxiang",
    YUEYANG:"yueyang",

    inSeq: 0,

    init: function () {
    },

    setRoomType:function(typ){
        mRoom.roomType = typ;
    },

    isFree:function(freeCount, maxFreeCount, nextTime){
        if(nextTime <= 0 && (maxFreeCount - freeCount) > 0){
            return true;
        }
        return false;
    },

    getUserPosIndex:function(userId){
        var users = DD[T.PlayerList];
        if (users == null) return 0;
        var pos = 0;
        if(mRoom.isReplay){
            for(var i=0;i<users.length;i++){
                if(userId == users[i].ID){
                    pos = i;
                    break;
                }
            }
        }else{
            for(var i=0;i<users.length;i++){
                if(users[i].ID == gameData.uid){
                    pos = i;
                }
            }
            var pos0 = pos;
            var pos1 = (pos + 1) % mRoom.getPlayerNum();
            var pos2 = (pos + 2) % mRoom.getPlayerNum();
            var pos3 = (pos + 3) % mRoom.getPlayerNum();
            if(userId == gameData.uid){
                pos = 0;
            }else if(users[pos1] && userId == users[pos1].ID){
                pos = 1;
            }else if(users[pos2] && userId == users[pos2].ID){
                pos = 2;
            }else if(users[pos3] && userId == users[pos3].ID){
                pos = 3;
            }
        }
        return pos;
    },
    getUserIndex:function(userId){
        var users = DD[T.PlayerList];
        if (users == null) return 0;
        for(var i=0;i<users.length;i++){
            if(users[i].ID == gameData.uid){
                return i;
            }
        }
        return 0;
    },
    getUserByUserId:function(userId){
        var users = DD[T.PlayerList];
        if (users == null) return null;
        for(var i=0;i<users.length;i++){
            if(users[i].ID == userId){
                return users[i];
            }
        }
        return null;
    },
    getUserByUserPos:function(pos){
        var users = DD[T.PlayerList];
        if (users == null) return null;
        if (users[pos]){
            return users[pos];
        }else{
            return null;
        }
    },

    isInOpenList:function(card){
        var openList = mAction.combos[0]
        for(var i=0;i<openList.length;i++){
            var comb = openList[i];
            var cardInCombo = comb.cards[0];
            if(card == cardInCombo){
                return true;
            }
        }
        return false;
    },


    resumeRoom:function(room, data){
        var players = data.Players;
        var flag = 65984;
        var ChiList = null;

        //Set up players
        var playerList = [];
        for(var i=0;i<players.length;i++){
            var p = players[i];

            var userInfo = p.User;
            var cardInfo = p.Card;
            var userId = p.UserID;

            playerList.push(userInfo);
            if(userId == gameData.uid){
                DD[T.CardList] = cardInfo.Hands;
                flag = p.LastTurnInFlag;
                ChiList = p.ChiList;
            }
            mRoom.scoreInfo[userId] = p.Score;
            mRoom.InGameScore[i] = p.InGameScore;

            //定位
            if(userInfo.Location && userInfo.Location.length > 0) {
            }else{
                userInfo.locationCN = "未开启地理位置共享";
                userInfo.Location = "false";
            }
        }
        DD[T.PlayerList] = playerList;
        room.setupPlayers();

        //set up handCard
        var cards = DD[T.CardList];
        cards.sort(function(a,b){
            return a - b;
        });
        var cardList = mCard.getCardList();
        room.cardList = cardList;
        room.setupCards();
        room.enableChuPai();

        //set up desk cards
        for(var i=0;i<players.length;i++){
            var p = players[i];

            //var userInfo = p.User;
            var cardInfo = p.Card;
            var userId = p.UserID;
            var offLine = p.Offline;
            room.setDisconnect(userId, offLine == 1);

            var pos = room.getUserPosIndex(userId);
            var outCards = room["out" + pos];
            var openCards = room["open" + pos];

            for(var j=0;j<cardInfo.DiscardCards.length;j++){
                var card = cardInfo.DiscardCards[j];
                outCards.addCard(card);
            }

            var menzi = cardInfo.Menzi;
            for(var j=menzi.length-1;j>=0;j--) {
                var mz = menzi[j];
                if (mz.Type == "吃"){
                    //吃的牌特殊显示
                    var chiCard = mz.Chi;
                    for(var k=0;k<mz.Cards.length;k+=3){
                        var cards = [mz.Cards[k], mz.Cards[k+1], mz.Cards[k+2]];
                        var typ = mCard.getComboType(cards, false);
                        //吃的放在第一个位置
                        // openCards.addCards(cards, typ, false, chiCard);
                        for(var x=0;x<cards.length;x++){
                            if(chiCard == cards[x]){
                                var tmp = cards[x];
                                for(var y=x+1;y<3;y++){
                                    cards[y-1] = cards[y];
                                }
                                cards[2] = tmp;
                            }
                        }
                        //cc.log("ruru---------------mRoom吃");
                        openCards.addCards(cards, typ, false);
                    }
                } else if (mz.Type == "话") {
                    for (var k = 0; k < mz.Cards.length; k += 3) {
                        var cards = [mz.Cards[k], mz.Cards[k + 1], mz.Cards[k + 2]];
                        var typ = mCard.getComboType(cards, false);
                        //cc.log("ruru---------------mRoom话");
                        openCards.addCards(cards, typ);
                    }
                } else if (mz.Type == "碰") {
                    var typ = mCard.comboTypes_ZN[mz.Type];
                    if (typ != mCard.comboTypes.kan) {
                        //cc.log("ruru---------------mRoom碰");
                        openCards.addCards(mz.Cards, mCard.comboTypes_ZN[mz.Type], undefined, mz.Chi);
                    }
                } else {
                    var typ = mCard.comboTypes_ZN[mz.Type];
                    if (typ != mCard.comboTypes.kan) {
                        //cc.log("ruru---------------mRoom。。。。。");
                        openCards.addCards(mz.Cards, mCard.comboTypes_ZN[mz.Type]);
                    }
                }
            }
            //冻结
            if(userId == gameData.uid) {
                var freeze = cardInfo.Freeze;
                if (freeze && freeze.length > 0) {
                    room.setFreezeCard(freeze);
                }
            }
        }
        for(var i=0;i<mRoom.getPlayerNum();i++){
            room.updateHX(i);
        }

        //设置回合信息
        var roundInfo = data.Round;
        var cardCount = data.LeftCardCount;

        mAction.leftCardCount = cardCount;
        room.txtCardCount.setString(mAction.leftCardCount);

        var curRound = data.GameSeq;
        room.round = curRound;
        mRoom.curRound = curRound;
        var showTxtRound = mRoom.getRound(room.round);
        room.txtRound.setString(showTxtRound);


        if(DD[T.PlayerList].length >= mRoom.getPlayerNum()){
            room.isStart = true;

            var card = roundInfo.Card;
            var from = roundInfo.From;
            var mo = roundInfo.Mo;
            var seq = roundInfo.Seq;

            if(card == 0){
                if(from == 0)from = gameData.uid;
                room.goTurnOut(from, 0, seq);
            }else{
                var userPos = room.getUserPosIndex(from);
                var roleInfo = mRoom.getUserByUserPos(userPos);
                var userSex = 1;
                if(!roleInfo){
                    roleInfo.Sex = 1;
                } else {
                    userSex = roleInfo.Sex;
                }
                var isMo = (mo == 1);

                if(seq == 0){
                    room.showLZCardAtPos(card, userPos, isMo, true, gameData.sex);
                }else{
                    room.showCardAtPos(card, userPos, isMo, false, userSex );
                }
                room.goTurnIn(card, flag, "", seq, ChiList);
            }
            room.setupGameStart();
        }
        network.wsData("Ready", true);
        room.setZhuangjia(data.Banker, data.Lianzhuang);

        //设置抓鸟
        if(data.Niao && data.Niao.Users){
            var players = DD[T.PlayerList];
            for(var i = 0 ; i < players.length ; i++){
                room.setSelectNiao(data.Niao.Users[i].UserID, data.Niao.Users[i].IsSet, true, data.Niao.Users[i].TuoNiao);
                room.setNiaoNumVisible(players[i].ID, true);
            }
        }
        mRoom.VoteInfo = data.Vote;
        //断线重连解散房间
        if(data.Vote && data.Vote.Users){
            if(mRoom.isPause != true){
                var vote = new RoomQuit();
                room.addChild(vote);
                for(var i=0;i<data.Vote.Users.length;i++){
                    if(data.Vote.Users[i].Content != ""){
                        var content = data.Vote.Users[i].UserID + "/Vote/quit/"+ data.Vote.Users[i].Content +"/0/0";
                        if(data.Vote.ByWho == data.Vote.Users[i].UserID) {
                            vote.setData(content, true, room);
                        }
                    }
                }
                for(var i=0;i<data.Vote.Users.length;i++){
                    if(data.Vote.Users[i].Content != ""){
                        var content = data.Vote.Users[i].UserID + "/Vote/quit/"+ data.Vote.Users[i].Content +"/0/0";
                        if(data.Vote.ByWho != data.Vote.Users[i].UserID){
                            vote.setData(content, false, room);
                        }
                    }
                }
            }
        }
        //举手
        if(data && data.Jushou && data.Jushou.Users){
            var canchupai = true;
            for (var i = 0; i < data.Jushou.Users.length; i++) {
                room.setJushou(data.Jushou.Users[i].UserID, data.Jushou.Users[i].IsSet, data.Jushou.Users[i].CanSet);
                if(data.Jushou.Users[i].CanSet == 1 && data.Jushou.Users[i].IsSet == 0){
                    canchupai = false;
                }
            }
            room.setMyCardsTouch(canchupai);
        }
        //报警
        if(data && data.Baojing && data.Baojing.Users){
            for (var i = 0; i < data.Baojing.Users.length; i++) {
                room.setBaojing(data.Baojing.Users[i].UserID, data.Baojing.Users[i].Stat);
            }
        }

        // var gameResultLayer = new GameResultLayer(this, this.gameOverHuInfo, this.gameOverData, mRoom.isReplay);
        // // gameResultLayer.setLocalZOrder(3);
        // // gameResultLayer.setName("gameResultLayer");
        // room.addChild(gameResultLayer);
        // gameResultLayer.setRoomInfo();
    },

    quitRoom:function(room){
        network.wsData("Quit/" + mRoom.roomId, true);
    },

    sendPing:function(){
        DC.checkReconnect();
        if(DC.wsStatus != 1){

        }else{
            this.txtUserName0.setString(gameData.nickname);
        }
    },
    getRound:function(round){
        var showTxtRound = round + "/" + mRoom.rounds;
        if (mRoom.wanfatype == mRoom.FANGPAOFA ||
            mRoom.wanfatype == mRoom.SHAOYANGBOPI ||
            mRoom.wanfatype == mRoom.XIANGXIANG){
            showTxtRound = round;
        }
        return showTxtRound;
    },
    getWanfaName:function (wanfatext) {
        var wanfa = "";
        if (wanfatext == mRoom.FANGPAOFA) {
            wanfa = "娄底放炮罚";
        }else if(wanfatext == mRoom.CHANGDE) {
            wanfa = "常德跑胡子";
            if(mRoom.subWanfa == "bashifan")  wanfa = "常德八十番";
        }else if(wanfatext == mRoom.LEIYANG){
            wanfa = "耒阳字牌";
        }else if(wanfatext == mRoom.CHANGSHA){
            wanfa = "长沙跑胡子";
        }else if(wanfatext == mRoom.YAYA){
            wanfa = "丫丫跑胡子";
        }else if(wanfatext == mRoom.SHAOYANG){
            wanfa = "邵阳字牌";
        }else if(wanfatext == mRoom.SHAOYANGBOPI){
            wanfa = "邵阳剥皮";
        }else if(wanfatext == mRoom.HONGGUAIWAN) {
            wanfa = "怀化红拐弯";
        }else if(wanfatext == mRoom.XIANGXIANG){
            wanfa = "湘乡告胡子";
        }else if(wanfatext == mRoom.YOUXIAN){
            wanfa = "攸县碰胡子";
        }else if(wanfatext == mRoom.GUILIN) {
            wanfa = "桂林字牌";
        }else if(wanfatext == mRoom.CHENZHOU ||wanfatext == mRoom.MAOHUZI){
            wanfa = "郴州字牌";
        }else if(wanfatext == mRoom.HENGYANG){
            wanfa = "衡阳六胡抢";
        }else if(wanfatext == mRoom.HENGDONG){
            wanfa = "衡东六胡抢";
        }else if(wanfatext == mRoom.WEIMAQUE){
            wanfa = "安乡偎麻雀";
        }
        return wanfa;
    },
    getWanfa:function(obj){
        mRoom.zimo = obj.zimo;
        mRoom.is1510 = obj.o1510;
        mRoom.isallmt = obj.allmt;
        mRoom.maxJi = obj.maxJi;
        mRoom.wanfatype = obj.wanfa;
        mRoom.niao = obj.niao;
        mRoom.subWanfa = obj.subWanfa;
        mRoom.jushou = obj.jushou;
        mRoom.mingwei = obj.mingwei;
        mRoom.haidi = obj.haidi;
        mRoom.duidui = obj.duidui;
        mRoom.zhongzhuang = obj.zhongzhuang;
        mRoom.Fanxing = obj.Fanxing;
        mRoom.ZimoFan = obj.ZimoFan;
        mRoom.difen = obj.difen;
        mRoom.maohuzi = obj.maohuzi;
        mRoom.Zimofan = obj.Zimofan;
        mRoom.Tuan = obj.Tuan;
        mRoom.Huangfan = obj.Huangfan;
        mRoom.Wuhu = obj.Wuhu;
        mRoom.Yidianhong = obj.Yidianhong;
        mRoom.is_daikai = obj.is_daikai;
        gameData.is_daikai = mRoom.is_daikai;
        mRoom.ZhuangMode = obj.ZhuangMode;
        mRoom.Preview = obj.Preview;
        mRoom.BeiShu = obj.BeiShu;
        // mRoom.Beishu = 2;
        if(mRoom.maohuzi == true){
            mRoom.wanfatype = mRoom.MAOHUZI;
        }
        mRoom.wanfa = decodeURIComponent(obj.wanfadesc);
        if(mRoom.wanfa == undefined || mRoom.wanfa == null || mRoom.wanfa == ""){
            mRoom.wanfa = '';
            if (mRoom.zimo) {
                mRoom.wanfa = mRoom.wanfa + "自摸加级,";
            }
            if(mRoom.wanfatype == mRoom.LEIYANG){
                if (mRoom.jushou) {
                    mRoom.wanfa = mRoom.wanfa + "举手做声,";
                }else{
                    mRoom.wanfa = mRoom.wanfa + "举手不做声,";
                }
            }
            if (mRoom.is1510) {
                mRoom.wanfa = mRoom.wanfa + "一五十,";
            }
            if(mRoom.mingwei){
                mRoom.wanfa = mRoom.wanfa + "明偎,";
            }
            if (mRoom.isallmt != undefined) {
                if(mRoom.isallmt == true){
                    mRoom.wanfa = mRoom.wanfa + "全名堂,";
                }else{
                    mRoom.wanfa = mRoom.wanfa + "红黑点,";
                }
            }
            if(mRoom.duidui){
                mRoom.wanfa = mRoom.wanfa + "对对胡,";
            }
            if(mRoom.haidi){
                mRoom.wanfa = mRoom.wanfa + "海底胡,";
            }
            if(mRoom.zhongzhuang != undefined){
                if(mRoom.zhongzhuang == true){
                    mRoom.wanfa = mRoom.wanfa + "中庄,";
                }else{
                    mRoom.wanfa = mRoom.wanfa + "连中,";
                }
            }
            if(mRoom.subWanfa != undefined){
                if(mRoom.subWanfa == 'tiandihonghei'){
                    mRoom.wanfa = mRoom.wanfa + "天地红黑,";
                }else if(mRoom.subWanfa == 'wumingtang'){
                    mRoom.wanfa = mRoom.wanfa + "无名堂,";
                }else if(mRoom.subWanfa == 'quanhuayang'){
                    mRoom.wanfa = mRoom.wanfa + "全花样,";
                }else if(mRoom.subWanfa == 'banhuayang'){
                    mRoom.wanfa = mRoom.wanfa + "半花样,";
                }else if(mRoom.subWanfa == 'hongheidian') {
                    mRoom.wanfa = mRoom.wanfa + "红黑点,";
                }else if(mRoom.subWanfa == 'honghei'){
                    mRoom.wanfa = mRoom.wanfa + "红黑点,";
                }else if(mRoom.subWanfa == '10jin5'){
                    mRoom.wanfa = mRoom.wanfa + "10胡息起胡,";
                }else if(mRoom.subWanfa == '15jin3'){
                    mRoom.wanfa = mRoom.wanfa + "15胡息起胡,";
                }
            }

            if (mRoom.maxJi != undefined && mRoom.maxJi != null) {
                if(mRoom.wanfatype == mRoom.FANGPAOFA ||
                    mRoom.wanfatype == mRoom.XIANGXIANG){
                    mRoom.wanfa = mRoom.wanfa + "封顶" + mRoom.maxJi + "胡息,";
                }else{
                    if(mRoom.maxJi == 0){
                        mRoom.wanfa = mRoom.wanfa + "不封顶,";
                    }else{
                        if(mRoom.wanfatype == mRoom.CHANGSHA ||
                            mRoom.wanfatype == mRoom.HONGGUAIWAN) {
                            mRoom.wanfa = mRoom.wanfa + "封顶" + mRoom.maxJi + "番,";
                        }else if(mRoom.subWanfa == "bashifan"){
                            mRoom.wanfa = mRoom.wanfa + "封顶" + mRoom.maxJi + "分,";
                        }else{
                            mRoom.wanfa = mRoom.wanfa + "封顶" + mRoom.maxJi + "级,";
                        }
                    }
                }
            }
            if (mRoom.niao != undefined) {
                mRoom.wanfa = mRoom.wanfa + "拖鸟,";
            }
            if (mRoom.Fanxing && mRoom.Fanxing.indexOf('ben') >= 0){
                mRoom.wanfa = mRoom.wanfa + '本醒,';
            }
            if(mRoom.Fanxing && mRoom.Fanxing.indexOf('shang') >= 0){
                mRoom.wanfa = mRoom.wanfa + '上醒,';
            }
            if(mRoom.Fanxing && mRoom.Fanxing.indexOf('xia') >= 0){
                mRoom.wanfa = mRoom.wanfa + '下醒,';
            }
            if(mRoom.ZimoFan && mRoom.ZimoFan == "jia1"){
                mRoom.wanfa = mRoom.wanfa + '自摸加级,';
            }else if(mRoom.ZimoFan && mRoom.ZimoFan == "cheng2"){
                mRoom.wanfa = mRoom.wanfa + '自摸翻倍,';
            }
            if(mRoom.difen != undefined){
                mRoom.wanfa = mRoom.wanfa + "底分两分,";
            }
            if (mRoom.maohuzi == true) {
                mRoom.wanfa = mRoom.wanfa + "四人玩,";
            }
            if (mRoom.Zimofan != undefined){
                mRoom.wanfa = mRoom.wanfa + "自摸" + mRoom.Zimofan + "番,";
            }
            if(mRoom.Tuan){
                mRoom.wanfa = mRoom.wanfa + "团、行行息,";
            }
            if(mRoom.Huangfan == 2){
                mRoom.wanfa = mRoom.wanfa + "多黄多番,";
            }else if(mRoom.Huangfan == 1){
                mRoom.wanfa = mRoom.wanfa + "多黄单番,";
            }
            if(mRoom.Wuhu == false){
                mRoom.wanfa = mRoom.wanfa + "不带无胡,";
            }
            if(mRoom.Yidianhong == false){
                mRoom.wanfa = mRoom.wanfa + "不带一点红,";
            }
        }

    },
    getPlayerNum:function(){
        if(mRoom.wanfatype == mRoom.YOUXIAN || mRoom.wanfatype == mRoom.HENGYANG
            || mRoom.wanfatype == mRoom.MAOHUZI || mRoom.wanfatype == mRoom.HENGDONG){
            return 4;
        }else{
            return 3;
        }
    },
}