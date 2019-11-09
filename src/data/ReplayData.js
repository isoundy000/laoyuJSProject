/**
 * Created by zhangluxin on 16/7/11.
 */
var IDX = {
    HEAD: 0,
    CREATE: 1,
    FA_PAI1: 2,
    FA_PAI2: 3,
    FA_PAI3: 4
};

var EVENT_CLEAN_ROOM = "event_clean_room";
var EVENT_EATCARD = "event_eat_card";
var EVENT_EATOVER = "event_eat_over";

var ReplayDataCmd = function (data) {
    this.cmd = data.cmd;
    this.data = clone(data.data);
};

var ReplayData = function (recData) {
    // this.replayLayer = HUD
    this.recData = recData;
    var headData = new ReplayDataCmd(recData[IDX.HEAD]);
    // 取录像头
    if (headData.cmd == 101) {
        var Option = JSON.parse(headData.data.Option);
        this.rounds = Option.rounds;
        this.zimo = Option.zimo;
        this.o1510 = Option.o1510;
        this.allmt = Option.allmt;
        this.users = headData.data.Users;
    } else {
        cc.error("录像格式有误");
    }
    this.isOver = function (step) {
        return step >= this.recData.length;
    };
    this.getRound = function(step){
        if(this.recData[step] && this.recData[step].cmd == 112){
            var data = this.recData[step].data.Action.split("/");
            if(data.length >= 5 && data[4] >= 0){
                return data[4];
            }
        }
        return null;
    };
    this.getLastRound = function(){
         var lastround = 0;
         for(var i=0;i<this.recData.length;i++){
             if(this.recData[i] && this.recData[i].cmd == 112) {
                 var data = this.recData[i].data.Action.split("/");
                 if (data.length >= 5 && data[4] >= 0) {
                     if(lastround <= parseInt(data[4])){
                         lastround = parseInt(data[4]);
                     }
                 }
             }
         }
         return lastround;
    };
    this.getStepByRound = function(round){
        for(var i=0;i<this.recData.length;i++){
            if(this.recData[i] && this.recData[i].cmd == 112) {
                var data = this.recData[i].data.Action.split("/");
                if (data.length >= 5 && data[4] >= 0 && data[4] == round) {
                    return i;
                }
            }
        }
        return null;
    };
    this.getDataLength = function () {
        return this.recData.length;
    };
    this.runEvent = function (step, isMove) {
        var event = new ReplayDataCmd(recData[step]);
        var action = event.data.Action;
        if (action && isMove != true) {
            var actionData = action.split("/");
            var mainAction = actionData[1];
            var subAction = actionData[2];
            if (mainAction == "EatCard") {
                cc.eventManager.dispatchCustomEvent(EVENT_EATCARD, action);
                setTimeout(function () {
                    cc.eventManager.dispatchCustomEvent(EVENT_EATOVER, "");
                    cc.eventManager.dispatchCustomEvent(event.cmd, event.data);
                }, 1200);
                return;
            }
        }
        //回放不播放 GS_Vote 信息
        if(event.cmd != P.GS_Vote){
            cc.eventManager.dispatchCustomEvent(event.cmd, event.data);
        }
    };
    this.moveToEvent = function (step) {
        cc.eventManager.dispatchCustomEvent(EVENT_CLEAN_ROOM, "");
        for (var i = 0; i < step; i++) {
            this.runEvent(i, true)
        }
    };
    this.backward = function (step) {
        while (--step > 0) {
            var event = new ReplayDataCmd(recData[step]);
            var action = event.data.Action;
            if(action){
                var actionData = action.split("/");
                var mainAction = actionData[1];
                if (mainAction != "EatCard") {
                    break;
                }
            }
        }
        if(step < 0){
            step = 0;
        }
        return step;
    };
    this.toward = function (step) {
        while (++step < recData.length - 2) {
            var event = new ReplayDataCmd(recData[step]);
            var action = event.data.Action;
            if(action){
                var actionData = action.split("/");
                var mainAction = actionData[1];
                if (mainAction != "EatCard") {
                    break;
                }
            }
        }
        if(step > recData.length - 2){
            step = recData.length - 2;
        }
        return step;
    };

    //根据轮次获取最新的数据
    this.moveCardFroUser = function(cards, card){
        for(var i=0;i<cards.length;i++){
            if(parseInt(cards[i]) == parseInt(card)){
                cards.splice(i ,1);
                break;
            }
        }
    };
    //牌桌里的偎 变跑或者提
    this.moveThreeFomrUser = function(cards, card){
        for(var i=0;i<cards.length;i++){
            if(cards[i].cards
                && cards[i].cards[0] == cards[i].cards[1]
                && cards[i].cards[1] == cards[i].cards[2]
                && parseInt(cards[i].cards[0]) == parseInt(card)){
                cards.splice(i ,1);
                break;
            }
        }
    },
    this.getAllPlayerCardsByStep = function(step){
        mAction.leftCardCount = 19;
        var allPlayerCard = [];
        for(var i=0;i<this.users.length;i++){
            allPlayerCard[this.users[i].ID] = [];
            allPlayerCard[this.users[i].ID].cards = null;
            allPlayerCard[this.users[i].ID].open = [];
            allPlayerCard[this.users[i].ID].out = [];
        }
        // console.log(allPlayerCard);
        // console.log(step);
        for(var i=0;i<this.recData.length;i++){
            if(this.recData[i].cmd == 107){
                var userid = this.recData[i].data.ToUser;
                allPlayerCard[userid].cards = deepCopy(this.recData[i].data.Cards);
            }else if(this.recData[i].cmd == 112){
                var actions = this.recData[i].data.Action.split("/");
                if(actions && actions.length >= 5 && actions[4] < step){
                    if(actions[1] == "1"){
                        var userid = actions[0];
                        var control = actions[1];
                        var caozuo = actions[2];
                        var card = actions[3];
                        var round = actions[4];
                        if (caozuo == "liangzhang") {
                            //后端是先提  后亮张,检查如果是亮张,之前一个操作是提,并且提的牌一样,就不加入手牌
                            if(this.recData[i - 1]){
                                var addLiangZhangCard = true;
                                if(this.recData[i - 1].data && this.recData[i - 1].data.Action) {
                                    var beforeActions = this.recData[i - 1].data.Action.split("/");
                                    if (beforeActions[2] == "ti" && beforeActions[3] == card)
                                        addLiangZhangCard = false;
                                }
                            }
                            if(addLiangZhangCard)
                                allPlayerCard[userid].cards.push(parseInt(card));
                        } else if (caozuo == "ShowCard") {
                            this.moveCardFroUser(allPlayerCard[userid].cards, card);
                        } else if (caozuo == "mo") {
                            mAction.leftCardCount --;
                            // allPlayerCard[userid].cards.push(parseInt(card));
                        } else if (caozuo == "chi") {
                            var chicard = [];
                            var cards = actions[5].split(",");
                            var removeCards = deepCopy(cards);
                            for (var l = 0; l<removeCards.length; l++) {
                                if (removeCards[l] == card) {
                                    removeCards.splice(l, 1);
                                    break;
                                }
                            }
                            for(var l=0;l<removeCards.length;l++){
                                this.moveCardFroUser(allPlayerCard[userid].cards, removeCards[l]);
                            }
                            for(var l=0;l<cards.length/3;l++){
                                var chicard = [];
                                var eatcard = [];
                                for(var m=0;m<3;m++){
                                    eatcard[m] = cards[l*3+m];
                                }
                                chicard.cards = eatcard;
                                chicard.typ = mCard.getComboType(eatcard);
                                allPlayerCard[userid].open.push(chicard);
                            }
                        } else if (caozuo == "peng") {
                            for(var l=0;l<2;l++){
                                this.moveCardFroUser(allPlayerCard[userid].cards, card);
                            }
                            var pengcartds = [];
                            pengcartds.typ = 1;
                            pengcartds.cards = [card, card, card];
                            allPlayerCard[userid].open.push(pengcartds);
                        } else if (caozuo == "pao") {
                            if(actions[5] && actions[5] == "true"){
                                this.moveThreeFomrUser(allPlayerCard[userid].open, card);
                            }else{
                                for(var s=0;s<3;s++){
                                    this.moveCardFroUser(allPlayerCard[userid].cards, card);
                                }
                            }
                            var paocards = [];
                            paocards.typ = 5;
                            paocards.cards = [card, card, card, card];
                            allPlayerCard[userid].open.push(paocards);
                        } else if (caozuo == "ti") {
                            if(actions[5] && actions[5] == "true"){
                                this.moveThreeFomrUser(allPlayerCard[userid].open, card);
                            }else{
                                for(var s=0;s<4;s++){
                                    this.moveCardFroUser(allPlayerCard[userid].cards, card);
                                }
                            }
                            var ticards = [];
                            ticards.typ = 6;
                            ticards.cards = [card, card, card, card];
                            allPlayerCard[userid].open.push(ticards);
                        } else if (caozuo == "wei") {
                            var deletenum = 2;
                            if(mRoom.wanfatype == mRoom.YOUXIAN){
                                deletenum = 3;
                            }
                            for(var s=0;s<deletenum;s++) {
                                this.moveCardFroUser(allPlayerCard[userid].cards, card);
                            }
                            var weicards = [];
                            weicards.typ = 3;
                            weicards.cards = [card, card, card];
                            allPlayerCard[userid].open.push(weicards);
                        } else if (caozuo == "chouwei") {
                            var deletenum = 2;
                            if(mRoom.wanfatype == mRoom.YOUXIAN){
                                deletenum = 3;
                            }
                            for(var s=0;s<deletenum;s++) {
                                this.moveCardFroUser(allPlayerCard[userid].cards, card);
                            }
                            var weicards = [];
                            weicards.typ = 4;
                            weicards.cards = [card, card, card];
                            allPlayerCard[userid].open.push(weicards);
                        } else if (caozuo == "hu") {
                        }
                    }
                }
            }
        }
        for(var i=0;i<this.recData.length;i++) {
            if (this.recData[i].cmd == 112) {
                var actions = this.recData[i].data.Action.split("/");
                if (actions && actions.length >= 5 && actions[4] < step) {
                    if (actions[1] == "1") {
                        var userid = actions[0];
                        var caozuo = actions[2];
                        var card = actions[3];
                        var round = actions[4];
                        if (caozuo == "mo" || caozuo == "ShowCard") {
                            //摸牌  三个人都得点过
                            //出牌  其他两人点过
                            var isQi = true;
                            for(var j=1;j<=10;j++){
                                if(this.recData[i+j] && this.recData[i+j].data && this.recData[i+j].data.Action){
                                    var newactions = this.recData[i+j].data.Action.split("/");
                                    if (newactions && newactions.length >= 5 && newactions[4] == round) {
                                        if(newactions[1] == "1" &&
                                            (newactions[2] == "chi" || newactions[2] == "peng"
                                            || newactions[2] == "pao"|| newactions[2] == "ti"
                                            || newactions[2] == "wei" || newactions[2] == "chouwei")){
                                            isQi = false;
                                        }
                                    }
                                }
                            }
                        }
                        if(isQi){
                            allPlayerCard[userid].out.push(card);
                        }
                    }
                }
            }
        }
        // console.log(allPlayerCard);
        return allPlayerCard;
    };
};

