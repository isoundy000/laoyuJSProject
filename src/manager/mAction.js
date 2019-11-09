TIANHU = 0x1; 	//天胡1
DIHU = 0x2; 	//地胡2
TI = 0x4;		//提4
WEI=0x8;	    //偎8
CHOUWEI = 0x10; //臭畏16
HU= 0x20;		//胡32
PAO = 0x40;		//跑64
PENG = 0x80;	//碰128
CHI =  0x100;	//吃256
GUO = 0x10000;  //65536

var mAction = {
    acts : {
        "chi":CHI,
        "peng":PENG,
        "ti":TI,
        "pao":PAO,
        "hu":HU,
        "tianhu":TIANHU,
        "wei":WEI,
        "chouwei":CHOUWEI,
        "none":GUO
    },

    combos: {},
    hx: {},
    outCards: {},
    leftCardCount:0,

    init: function () {
    },

    initGame:function(){
        mAction.combos = {
            0:[],
            1:[],
            2:[],
            3:[]
        };

        mAction.hx = {
            0:0,
            1:0,
            2:0,
            3:0
        };
        mAction.showHx = {
            0:0,
            1:0,
            2:0,
            3:0
        };
        mAction.outCards = {
            0:[],
            1:[],
            2:[],
            3:[]
        };

        mAction.leftCardCount = 80;
    },

    getActionString:function(act){
        var str = "";
        var acts = mAction.acts;
        for(var key in acts){
            if(acts[key] == act){
                return key;
            }
        }
        return str;
    },

    getActionByString:function(actStr){
        var act = mAction.acts[actStr];
        return act;
    },

    checkOpen:function(target, typ){
        //如果是录像回放不判断
        if(999999 == target){
            return true;
        }
        if ((typ & target) != 0) {
            return true;
        }
        return false;
    },

    getBTAct:function(index, actList){
        //if(index == 3)return true;
        for(var i=0;i<actList.length;i++){
            var act = actList[i];
            if(index == 1 && act == CHI){
                return CHI;
            }else if(index == 2 && act == PENG){
                return PENG;
            }else if(index == 0 && act == HU){
                return HU;
            }else if(index == 3 && act == GUO){
                return GUO;
            }else if(index == 3 && act == WEI){
                return WEI;
            }else if(index == 3 && act == PAO){
                return PAO;
            }
        }
        return 0;
    },

    getActList:function(target, card){
        var actList = [];
        var list = this.isCanAct(target, CHI, card);
        if(list.length > 0)actList.push(CHI);

        list = this.isCanAct(target, PENG, card);
        if(list.length > 0)actList.push(PENG);

        return actList;
    },

    isCanAct:function(target, typ, card){
        var retList = [];
        card = parseInt(card);

        if(target != null && this.checkOpen(target, typ)){
            switch (typ){
                case PENG:
                    retList = this.isHaveSame(card, 2);
                    break;
                case CHI:
                    retList = this.isHaveChi(card);
                    break;
            }
        }
        return retList;
    },

    isCanWei:function(target){
        if(this.checkOpen(target, WEI) == true || this.checkOpen(target, CHOUWEI) == true)
            return true;
        return false;
    },

    isCanPaoTi:function(target, card, isMo, isSelf){
        var paoInfo = {};
        var retList = [];
        var isOpen = false;
        paoInfo.act = null;

        card = parseInt(card);
        if(target != null && (this.checkOpen(target, PAO) || this.checkOpen(target, TI))){
            retList = this.isHaveSame(card, 3);
            if(retList.length > 0){
                if(isMo == true && isSelf == true){
                    //TI  玩家手中有一坎，摸起相同的一只牌后，必须四只放置于桌面
                    paoInfo.act = TI;
                    paoInfo.old = mCard.comboTypes.kan;
                    paoInfo.newt = mCard.comboTypes.ti;
                }else if(isSelf == false){
                    //PAO 玩家手中有一坎牌，当其他玩家打出或摸出一只相同的牌，玩家必须跑牌
                    paoInfo.act = PAO;
                    paoInfo.old = mCard.comboTypes.kan;
                    paoInfo.newt = mCard.comboTypes.pao;
                }
            }else{
                for(var i=0;i<mAction.combos[0].length;i++){
                    var comboInfo = mAction.combos[0][i];
                    var cardInCombo = comboInfo.cards[0];
                    if(card == cardInCombo){
                        if(comboInfo.typ == mCard.comboTypes.wei || comboInfo.typ == mCard.comboTypes.chouwei){
                            if(isSelf == true){
                                //TI 玩家桌面已有偎的牌，摸起相同的一只牌后，必须和原来的三只一起放置于桌面
                                paoInfo.act = TI;
                                retList = comboInfo.cards;
                                isOpen = true;
                                paoInfo.old = comboInfo.typ;
                                paoInfo.newt = mCard.comboTypes.ti;
                                break;
                            }else{
                                //PAO 玩家桌面已有偎的牌，当其他玩家打出或摸出相同的牌后，必须跑牌
                                paoInfo.act = PAO;
                                retList = comboInfo.cards;
                                isOpen = true;
                                paoInfo.old = comboInfo.typ;
                                paoInfo.newt = mCard.comboTypes.pao;
                                break;
                            }
                        }else if(comboInfo.typ == mCard.comboTypes.peng && isMo == true){
                            //PAO 玩家桌面已有碰的牌，当自己或其他玩家摸出相同的牌后，必须跑牌
                            paoInfo.act = PAO;
                            retList = comboInfo.cards;
                            isOpen = true;
                            paoInfo.old = comboInfo.typ;
                            paoInfo.newt = mCard.comboTypes.pao;
                            break;
                        }
                    }
                }
            }
        }
        paoInfo.cards = retList;
        paoInfo.isOpen = isOpen;
        return paoInfo;
    },

    isHaveSame:function(card, count, cards){
        card = parseInt(card);
        cards = cards || DD[T.CardList];
        var sameList = [];
        for(var i=0;i<cards.length;i++){
            if(cards[i] == card){
                sameList.push(cards[i]);
            }
        }

        if(sameList.length == count){
            return sameList;
        }
        return [];
    },

    isHaveChi:function(card, checkCards){
        card = parseInt(card);
        var chiList = [];

        var cards = checkCards || DD[T.CardList];
        var newCardList = [];
        for(var i=0;i<cards.length;i++){
            newCardList.push(cards[i]);
        }

        var retList = [];
        mCard.searchSameCard(retList, newCardList, 3);
        if(checkCards == null)
            newCardList.push(card);

        var count = mCard.getCardCount(newCardList, card);

        this.isHave2710Card(chiList, card, newCardList);
        this.isHave1510Card(chiList, card, newCardList);
        this.isHave123Card(chiList, card, newCardList);
        this.isHaveJiaoCard(chiList, card, newCardList);

        if(count > 1){                  // 2级
            for(var i=chiList.length-1;i>=0;i--){
                var leftCards = mCard.copyCards(newCardList);
                var chiInfo = chiList[i];
                for(var x=0;x<chiInfo.length; x++){
                    removeObjArray(leftCards, chiInfo[x]);
                }

                var leftCount = mCard.getCardCount(leftCards, card);
                if(leftCount == 0){  // 没有能组合的吃卡了
                    continue;
                }

                var subList = [];
                this.isHave2710Card(subList, card, leftCards);
                this.isHave1510Card(subList, card, leftCards);
                this.isHave123Card(subList, card, leftCards);
                this.isHaveJiaoCard(subList, card, leftCards);

                if(count > 2){         // 3级
                    for(var j=subList.length-1;j>=0;j--){
                        var endCards = mCard.copyCards(leftCards);
                        var subInfo = subList[j];
                        for(var x=0;x<subInfo.length; x++){
                            removeObjArray(endCards, subInfo[x]);
                        }

                        var leftCount2 = mCard.getCardCount(endCards, card);
                        if(leftCount2 == 0){  // 没有能组合的吃卡了
                            continue;
                        }

                        var endList = [];
                        this.isHave2710Card(endList, card, endCards);
                        this.isHave1510Card(endList, card, endCards);
                        this.isHave123Card(endList, card, endCards);
                        this.isHaveJiaoCard(endList, card, endCards);

                        if(endList.length > 0){
                            subInfo.push(endList);
                        }else{
                            subList.splice(j, 1);
                        }
                    }
                }

                if(subList.length > 0){
                    chiInfo.push(subList);
                }else{
                    chiList.splice(i, 1);
                }
            }
        }

        return chiList;
    },

    isHaveBi:function(card){


        var leftCards = mCard.copyCards(DD[T.CardList]);
        var comboList = mCard.copyCards(comboListSrc);
        leftCards.push(card);

        comboList.push(cards);
        for(var i=0;i<comboList.length; i++){
            var combo = comboList[i];
            for(var j=0;j<combo.length; j++){
                removeObjArray(leftCards, combo[j]);
            }
        }

        var rowIndex = comboList.length;
        var children = this.nChiList.getChildren();
        for(var i=0;i<children.length;i++){
            var child = children[i];
            if(child.getTag() >= rowIndex){
                child.removeFromParent();
            }
        }

        var py = rowIndex * 240 * -1;
        var chiList = mAction.isHaveChi(card, leftCards);
        for(var i=0;i<chiList.length;i++){
            var cardSelect = HUD.showLayer(HUD_LIST.CardSelect, this.nChiList);
            cardSelect.setData(this.showNo, chiList[i], this, comboList);
            cardSelect.setPosition(i * 90,  py);
            cardSelect.setTag(rowIndex);
        }

        if(chiList.length > 0)
            return true;
        return false;
    },

    checkNeeds:function(needs, card, cards, isDui){
        card = parseInt(card);
        var retList = [];
        var isHave = [false, false, false];
        if(isDui){
            isHave = [false, false];
        }

        var isInCards  = false;
        if(cards != null){
            isInCards  = true;
        }
        cards = cards || DD[T.CardList];
        for(var i=0;i<cards.length;i++){
            var cardNumber = cards[i];

            for(var j=0;j<needs.length;j++){
                if(cardNumber == needs[j] && isHave[j] != true){
                    isHave[j] = true;
                    break;
                }
            }
        }

        if(isInCards == false){
            for(var j=0;j<needs.length;j++){
                if(card == needs[j] && isHave[j] != true){
                    isHave[j] = true;
                    break;
                }
            }
        }

        var allHave = true;
        for(var j=0;j<isHave.length;j++){
            if(isHave[j] != true){
                allHave = false;
                break;
            }
        }

        if(allHave == true){
            retList = needs;
        }
        return retList;
    },

    isHaveDuiCard:function(chiList, card, cards){
        card = parseInt(card);
        var needs = [card, card];
        var retList = this.checkNeeds(needs, card, cards, true);
        if(retList.length > 0){
            chiList.push(retList);
        }
    },

    isHaveKanCard:function(chiList, card, cards){
        card = parseInt(card);
        var needs = [card, card, card];
        var retList = this.checkNeeds(needs, card, cards);
        if(retList.length > 0){
            chiList.push(retList);
        }
    },

    isHave2710Card:function(chiList, card, cards){
        card = parseInt(card);
        if(mCard.is2710(card) == false){
            return;
        }
        var needs = [2, 7, 10];
        if(card > 10){
            needs = [12, 17, 20];
        }

        var retList = this.checkNeeds(needs, card, cards);
        if(retList.length > 0){
            chiList.push(retList);
        }
    },

    isHave1510Card:function(chiList, card, cards){
        if(mRoom.is1510 != true){
            return;
        }

        card = parseInt(card);
        if(mCard.is1510(card) == false){
            return;
        }
        var needs = [1, 5, 10];
        if(card > 10){
            needs = [11, 15, 20];
        }

        var retList = this.checkNeeds(needs, card, cards);
        if(retList.length > 0){
            chiList.push(retList);
        }
    },

    isHave123Card:function(chiList, card, cards){
        card = parseInt(card);
        var need1 = [card, card+1, card+2];
        var need2 = [card-1, card, card+1];
        var need3 = [card-2, card-1, card];

        if((card > 10 && card < 19) || (card > 0 && card < 9)){
            var retList = this.checkNeeds(need1, card, cards);
            if(retList.length > 0){
                chiList.push(retList);
            }
        }

        if((card > 11 && card < 20) || (card > 1 && card < 10)){
            var retList = this.checkNeeds(need2, card, cards);
            if(retList.length > 0){
                chiList.push(retList);
            }
        }

        if((card > 12 && card < 21)  || (card > 2 && card < 11)){
            var retList = this.checkNeeds(need3, card, cards);
            if(retList.length > 0){
                chiList.push(retList);
            }
        }
    },

    isHaveJiaoCard:function(chiList, card, cards){
        card = parseInt(card);
        var need1, need2;
        if(card > 10){
            need1 = [card, card, card-10];
            need2 = [card, card-10, card-10];
        }else{
            need1 = [card, card, card+10];
            need2 = [card, card+10, card+10];
        }

        var retList = this.checkNeeds(need1, card, cards);
        if(retList.length > 0){
            chiList.push(retList);
        }
        var retList = this.checkNeeds(need2, card, cards);
        if(retList.length > 0){
            chiList.push(retList);
        }
    },

    isHaveHu:function(card, isSelf, paoInfo){
        if(paoInfo != null && paoInfo.act == PAO){
            var huInfo1 = mAction.isHaveHuAct(card, isSelf, paoInfo);   //跑胡
            var huInfo2 = mAction.isHaveHuAct(card, isSelf, null);      //破跑胡

            var hx1 = 0;
            var hx2 = 0;
            if(huInfo1 != null)hx1 = huInfo1.hx;
            if(huInfo2 != null)hx2 = huInfo2.hx;

            if(hx1 >= hx2){
                return huInfo1;
            }else{
                return huInfo2;
            }
        }else{
            return mAction.isHaveHuAct(card, isSelf, paoInfo);
        }
    },

    isHaveHuAct:function(card, isSelf, paoInfo){
        var newCardList = [];
        var cards = DD[T.CardList];
        for(var i=0;i<cards.length;i++){
            newCardList.push(cards[i]);
        }

        var isCardAdd = false;
        var openList = mCard.copyComboList(mAction.combos[0]);              //检查跑和提
        if(paoInfo != null && paoInfo.act != null){
            if(paoInfo.isOpen == true){
                for(var i=0;i<openList.length;i++){
                    var comb = openList[i];
                    var cardInCombo = comb.cards[0];
                    if(card == cardInCombo){
                        if(comb.typ == mCard.comboTypes.peng || comb.typ == mCard.comboTypes.wei || comb.typ == mCard.comboTypes.chouwei){
                            comb.cards = paoInfo.cards;
                            comb.typ = paoInfo.newt;
                            comb.cards.push(card);
                            break;
                        }
                    }
                }
            }else{                  //kan
                var comb = {};
                comb.cards = paoInfo.cards;
                comb.typ = paoInfo.newt;
                comb.cards.push(card);
                openList.push(comb);
                for(var i=0;i<3;i++){
                    removeObjArray(newCardList, card);
                }
            }
            isCardAdd = true;
        }

        var cardCount = mCard.getCardCount(newCardList, card);
        if(isSelf == true && cardCount == 2)                    //偎牌
        {
            var comb = {};
            comb.cards = [card, card, card];
            comb.typ = mCard.comboTypes.wei;
            openList.push(comb);
            for(var i=0;i<2;i++){
                removeObjArray(newCardList, card);
            }
            isCardAdd = true;
        }

        var kanRet = [];
        newCardList.sort(function(a,b){
            return b - a;
        })
        mCard.searchSameCard(kanRet, newCardList, 3);

        if(isCardAdd == false){                             //吃进
            newCardList.push(card);
        }

        newCardList.sort(function(a,b){
            return b - a;
        });

        var retList = [];
        var okList = [];
        var huList = null;

        //this.checkLeftCards(huList, retList, newCardList, []);

        if(newCardList.length > 0){
            this.checkLeftCards2(okList, retList, newCardList, []);
        } else{
            okList.push([]);
        }

        var deskHx = mCard.getHuXi(openList);
        var maxHx = 0;
        var kanHx = 0;
        var kanList = [];
        for(var i=0;i<kanRet.length;i++){
            if(kanRet[i][0] > 10){
                kanHx += 6;
            }else{
                kanHx += 3;
            }
            var cObj = {};
            cObj.typ = mCard.comboTypes.kan;
            cObj.cards = kanRet[i];
            kanList.push(cObj);
        }
        for(var i=0;i<okList.length;i++){
            var hx = mCard.getHuXi(okList[i]) + deskHx + kanHx;
            if(hx >= 15 && hx > maxHx){
                maxHx = hx;
                huList = okList[i];
            }
        }

        var huInfo = null;
        if(huList != null){
            huInfo = {};
            huInfo.huList = huList;
            huInfo.kanList = kanList;
            huInfo.openList = openList;
            huInfo.hx = maxHx;
        }
        return huInfo;
    },

    //checkChiList:function(okList, retList, newCardList, card, typ){
    //    var chiList = [];
    //    switch (typ){
    //        case mCard.comboTypes.o2710:
    //            this.isHave2710Card(chiList, card, newCardList);
    //            break;
    //        case mCard.comboTypes.o234:
    //            this.isHave123Card(chiList, card, newCardList);
    //            break;
    //        case mCard.comboTypes.jiao:
    //            this.isHaveJiaoCard(chiList, card, newCardList);
    //            break;
    //    }
    //
    //    for(var i=0; i<chiList.length;i++){
    //        var combo = chiList[i];
    //        var retCopy = retList.concat();
    //        this.checkLeftCards(okList, retCopy, newCardList, combo, typ);
    //    }
    //},
    //
    //checkLeftCards:function(okList, retList, newCardList, combo, typ){
    //    if(combo.length > 0){
    //        for(var i=0;i<combo.length;i++){
    //            removeObjArray(newCardList, combo[i]);
    //        }
    //        var cObj = {};
    //        cObj.typ = typ;
    //        cObj.cards = combo;
    //        retList.push(cObj);
    //    }
    //
    //    if(newCardList.length > 2){
    //        var card = newCardList[0];
    //
    //        var checkList = this.isHaveSame(card, 3, newCardList);
    //        if(checkList.length > 0){
    //            var retCopy = retList.concat();
    //            this.checkLeftCards(okList, retCopy, newCardList, checkList, mCard.comboTypes.kan);
    //        }
    //
    //        this.checkChiList(okList, retList, newCardList, card, mCard.comboTypes.o2710);
    //        this.checkChiList(okList, retList, newCardList, card, mCard.comboTypes.o234);
    //        this.checkChiList(okList, retList, newCardList, card, mCard.comboTypes.jiao);
    //
    //    }else if(newCardList.length == 2){
    //        if(newCardList[0] == newCardList[1]){
    //            var card = newCardList[0];
    //            var combo = [card, card];
    //
    //            var cObj = {};
    //            cObj.typ = mCard.comboTypes.dui;
    //            cObj.cards = combo;
    //            retList.push(cObj);
    //            okList.push(retList);
    //        }
    //    }
    //    else{
    //        okList.push(retList);
    //    }
    //},

    checkChiList2:function(okList, retList, hasDui, newCardList, card, typ, myStack){
        var chiList = [];
        switch (typ){
            case mCard.comboTypes.peng:
                this.isHaveKanCard(chiList, card, newCardList);
                break;
            case mCard.comboTypes.o2710:
                this.isHave2710Card(chiList, card, newCardList);
                this.isHave1510Card(chiList, card, newCardList);
                break;
            case mCard.comboTypes.o234:
                this.isHave123Card(chiList, card, newCardList);
                break;
            case mCard.comboTypes.jiao:
                this.isHaveJiaoCard(chiList, card, newCardList);
                break;
            case mCard.comboTypes.dui:
                this.isHaveDuiCard(chiList, card, newCardList);
                break;
        }

        for(var i=0; i<chiList.length;i++){
            var combo = chiList[i];
            var retCopy = retList.concat();
            var cardsCopy = newCardList.concat();
            //this.checkLeftCards(okList, retCopy, newCardList, combo, typ);

            if(typ == mCard.comboTypes.o234 && (combo[0] == 1 || combo[0] == 11) ){
                typ = mCard.comboTypes.o123;
            }

            var stackObj = {};
            stackObj.okList = okList;
            stackObj.retList = retCopy;
            stackObj.newCardList = cardsCopy;
            stackObj.combo = combo;
            stackObj.typ = typ;
            stackObj.hasDui = hasDui;
            myStack.push(stackObj);
        }
    },

    checkLeftCards2:function(okList, retList, newCardList, combo, typ){
        var myStack = [];
        var stackObj = {};
        stackObj.okList = okList;
        stackObj.retList = retList;
        stackObj.newCardList = newCardList;
        stackObj.combo = combo;
        stackObj.typ = typ;
        stackObj.hasDui = false;
        myStack.push(stackObj);
        var hasDui = false;

        while(true) {
            if(myStack.length > 0){
                var stackObj = myStack.pop();
                okList = stackObj.okList;
                retList = stackObj.retList;
                newCardList = stackObj.newCardList;
                combo = stackObj.combo;
                typ = stackObj.typ;
                hasDui = stackObj.hasDui;
            }else{
                return;
            }

            if(combo.length > 0){
                for(var i=0;i<combo.length;i++){
                    removeObjArray(newCardList, combo[i]);
                }
                var cObj = {};
                cObj.typ = typ;
                cObj.cards = combo;
                retList.push(cObj);

                if(typ == mCard.comboTypes.dui){
                    hasDui = true;
                }
            }

            if(newCardList.length > 2){
                var card = newCardList[0];

                this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.peng, myStack);
                this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.o2710, myStack);
                this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.o234, myStack);
                this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.jiao, myStack);
                //this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.jiao, myStack);
                if(hasDui == false){
                    this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.dui, myStack);
                }
            }else if(newCardList.length == 2 && hasDui == false){
                var card = newCardList[0];
                this.checkChiList2(okList, retList, hasDui, newCardList, card, mCard.comboTypes.dui, myStack);
            }
            else if(newCardList.length == 0){
                okList.push(retList);
            }
        }
    }
};