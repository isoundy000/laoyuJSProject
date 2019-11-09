var mCard = {
    init: function () {
    },

    comboTypes:{
        peng:1,
        kan:2,
        wei:3,
        chouwei:4,
        pao:5,
        ti:6,
        o123:7,
        o2710:8,
        o234:9,
        dui:10,
        jiao:11,
        none:12,
        chi:13,
        hu:14
    },

    comboTypes_ZN:{
        "碰":1,
        "坎":2,
        "偎":3,
        "臭偎":4,
        "跑":5,
        "提":6,
        "一二三":7,
        "二七十":8,
        "一句话":9,
        "对":10,
        "绞":11,
        none:12,
        chi:13,
        hu:14
    },

    //1-12
    comboImg : ["peng", "kan", "wei", "wei", "pao", "ti", "chi", "chi", "chi", "jiang", "chi", "none"],

    combo_hx_Big:   [3,6,6,6,9,12,6,6,0,0,0,0,0,0],
    combo_hx_Small: [1,3,3,3,6,9 ,3,3,0,0,0,0,0,0],

    copyCards:function(list){
        var newCards = list.concat([]);
        return newCards;
    },

    copyComboList:function(list){
        var newList = [];
        if(list != null){
            for(var i=0;i<list.length;i++){
                var comboInfo = list[i];

                var newCombo = {};
                newCombo.typ = comboInfo.typ;
                newCombo.cards = comboInfo.cards.concat([]);
                newList.push(newCombo);
            }
        }
        return newList;
    },

    getComboType:function(combo, ziMo){
        var typ = mCard.comboTypes.none;
        combo.sort(function(a, b){
            return a - b;
        });

        if(combo.length == 4){
            if(ziMo == true)
                typ = mCard.comboTypes.ti;
            else
                typ = mCard.comboTypes.pao;
        }else if(combo.length == 3){
            var c1= parseInt(combo[0]);
            var c2= parseInt(combo[1]);
            var c3= parseInt(combo[2]);

            if(c1 == c2 == c3){
                if(ziMo == true)
                    typ = mCard.comboTypes.wei;
                else
                    typ = mCard.comboTypes.peng;
            }else if(c1 == c2 -1 && c2 == c3 -1){
                if(c1 == 1 || c1 == 11){
                    typ = mCard.comboTypes.o123;
                }else{
                    typ = mCard.comboTypes.o234;
                }
            }else if(c1 == 2 && c2 == 7 && c3 == 10){
                typ = mCard.comboTypes.o2710;
            }else if(c1 == 12 && c2 == 17 && c3 == 20){
                typ = mCard.comboTypes.o2710;
            }else if(mRoom.is1510 == true && c1 == 1 && c2 == 5 && c3 == 10){
                typ = mCard.comboTypes.o2710;
            }else if(mRoom.is1510 == true && c1 == 11 && c2 == 15 && c3 == 20){
                typ = mCard.comboTypes.o2710;
            }else{
                typ = mCard.comboTypes.jiao;
            }
        }else if(combo.length == 2){
            typ = mCard.comboTypes.dui;
        }
        return typ;
    },
    //显示的胡息  自己的话计算全部   不是自己不计算偎
    getHuXi:function(comboList, isSelf){
        var total = 0;
        for(var i=0;i<comboList.length;i++){
            var comboInfo = comboList[i];

            var xi = 0;
            var typ = comboInfo.typ;
            //偎不计算胡息
            if (isSelf == null || isSelf == undefined || isSelf == true){
                if(comboInfo.cards[0] > 10){
                    xi = mCard.combo_hx_Big[typ-1];
                }else{
                    xi = mCard.combo_hx_Small[typ-1];
                }
                total += xi;
            }else{
                if (typ != mCard.comboTypes.wei){
                    if(comboInfo.cards[0] > 10){
                        xi = mCard.combo_hx_Big[typ-1];
                    }else{
                        xi = mCard.combo_hx_Small[typ-1];
                    }
                    total += xi;
                }
            }
        }
        return total;
    },
    //偎麻雀的胡息
    //碰   2 3
    //偎   3 4
    //将   0 2
    //团圆 碰(偎)+一句话  3 4
    //转弯 将+一句话     2 3
    getHuXiWeiMaQue: function(comboList){
        var total = 0;
        var cardNumArray = [];
        for(var i=0;i<comboList.length;i++){
            var comboInfo = comboList[i];
            var xi = 0;
            var typ = comboInfo.typ;
            if(typ == mCard.comboTypes.peng){
                if([2,7,10,12,17,20].indexOf(comboInfo.cards[0]) >= 0){
                    total += 3;
                }else{
                    total += 2;
                }
            }else if(typ == mCard.comboTypes.wei || typ == mCard.comboTypes.chouwei){
                if([2,7,10,12,17,20].indexOf(comboInfo.cards[0]) >= 0){
                    total += 4;
                }else{
                    total += 3;
                }
            }else if(typ == mCard.comboTypes.dui){
                if([2,7,10,12,17,20].indexOf(comboInfo.cards[0]) >= 0){
                    total += 2;
                }else{
                    total += 0;
                }
            }
            total += xi;
            for(var j=0;j<comboInfo.cards.length;j++){
                if(cardNumArray[comboInfo.cards[j]]){
                    cardNumArray[comboInfo.cards[j]] ++;
                }else{
                    cardNumArray[comboInfo.cards[j]] = 1;
                }
            }
        }
        //团圆
        var hasWeiPeng = function(card){
            for(var i=0;i<comboList.length;i++){
                var comboInfo = comboList[i];
                if((comboInfo.typ == mCard.comboTypes.chouwei || comboInfo.typ == mCard.comboTypes.peng) &&
                    comboInfo.cards.indexOf(card)){
                    return true;
                }
            }
            return false;
        };
        var hasYiJuHua = function(card){
            for(var i=0;i<comboList.length;i++){
                var comboInfo = comboList[i];
                if(comboInfo.typ == mCard.comboTypes.o234 &&
                    comboInfo.cards.indexOf(card)){
                    return true;
                }
            }
            return false;
        };
        for(var card in cardNumArray){
            if(cardNumArray[card] == 4 && hasYiJuHua(card) && hasWeiPeng(card)){
                total += ([2,7,10,12,17,20].indexOf(parseInt(card)) >= 0)? 4:3;
            }
        }
        return total;
    },
    //团圆 碰(偎)+一句话  3 4
    //转弯 将+一句话     2 1
    getComboHuXiWeiMaQue:function(comboInfo, comboList){
        // console.log(comboInfo);
        // console.log(comboList);
        var cardNumArray = [];
        if(comboList) {
            for (var i = 0; i < comboList.length; i++) {
                var combo = comboList[i];
                for (var j = 0; j < combo.cards.length; j++) {
                    if (cardNumArray[combo.cards[j]]) {
                        cardNumArray[combo.cards[j]]++;
                    } else {
                        cardNumArray[combo.cards[j]] = 1;
                    }
                }
            }
        }

        var xi = 0;
        var typ = comboInfo.typ;
        if(typ == mCard.comboTypes.peng ||
            typ == mCard.comboTypes.wei || typ == mCard.comboTypes.chouwei || typ == mCard.comboTypes.kan){
            if(typ == mCard.comboTypes.peng){
                if([2,7,10,12,17,20].indexOf(comboInfo.cards[0]) >= 0){
                    xi = 3;
                }else{
                    xi = 2;
                }
            }else{
                if([2,7,10,12,17,20].indexOf(comboInfo.cards[0]) >= 0){
                    xi = 4;
                }else{
                    xi = 3;
                }
            }
            //团圆 碰(偎)+一句话  3 4
            for(var card in cardNumArray){
                if(cardNumArray[card] == 4 && comboInfo.cards[0] == card){
                    xi += ([2,7,10,12,17,20].indexOf(parseInt(card)) >= 0)? 4:3;
                    break;
                }
            }
        }else if(typ == mCard.comboTypes.dui){
            if([2,7,10,12,17,20].indexOf(comboInfo.cards[0]) >= 0){
                xi = 2;
            }else{
                xi = 0;
            }
            //转弯 将+一句话     2 3
            if(comboList) {
                for (var j = 0; j < comboList.length; j++) {
                    var combo = comboList[j];
                    if (combo.typ == mCard.comboTypes.o234 || combo.typ == mCard.comboTypes.o123 || combo.typ == mCard.comboTypes.o2710
                        || combo.typ == mCard.comboTypes.chi) {
                        if (combo.cards.indexOf(comboInfo.cards[0]) >= 0) {
                            if ([2, 7, 10, 12, 17, 20].indexOf(comboInfo.cards[0]) >= 0) {
                                xi += 1;
                            } else {
                                xi += 2;
                            }
                            break;
                        }
                    }
                }
            }
        }
        return xi;
    },
    getComboHuXi: function(comboInfo){
        var xi = 0;
        var typ = comboInfo.typ;
        if(comboInfo.cards[0] > 10){
            xi = mCard.combo_hx_Big[typ-1];
        }else{
            xi = mCard.combo_hx_Small[typ-1];
        }
        return xi;
    },

    getComboHuXiByType:function(typ, isBig){
        var xi = 0;
        if(isBig){
            xi = mCard.combo_hx_Big[typ-1];
        }else{
            xi = mCard.combo_hx_Small[typ-1];
        }
        return xi;
    },

    getCardList:function(cards){
        cards = cards || DD[T.CardList];
        // mRoom.wanfatype = mRoom.YAYA;

        if(mRoom.wanfatype == mRoom.YOUXIAN){
            //碰胡子  摆拍 规则
            var newCardList = [[], [], [], [], [], [], [], [], [], [], []];
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] > 10) {
                    newCardList[cards[i] - 10].push(cards[i]);
                }
            }
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] <= 10) {
                    newCardList[cards[i]].push(cards[i]);
                }
            }
            var newCardList = _.filter(newCardList, function (item) {
                return item.length;
            });
            var resultArr = [];
            for (var i = 0; i < newCardList.length; i++) {
                var cardA = 0;
                var cardB = 0;
                var cntA = 0;
                var cntB = 0;
                for (var j = 0; j < newCardList[i].length; j++) {
                    var card = newCardList[i][j];
                    if (card > 10) {
                        cardA = card;
                        cntA++;
                    }
                    else {
                        cardB = card;
                        cntB++;
                    }
                }
                if (cntA + cntB >= 4) {
                    var cardListA = [];
                    var cardListB = [];
                    for(var s=0;s<cntA;s++){
                        cardListA.push(cardA);
                    }
                    for(var s=0;s<cntB;s++){
                        cardListB.push(cardB);
                    }
                    resultArr.push(cardListA);
                    resultArr.push(cardListB);
                }
                else
                    resultArr.push(newCardList[i])
            }
            return resultArr;
        }else {
            var allCard = [];
            for (var i = 0; i < cards.length; i++) {
                allCard.push(cards[i]);
            }
            allCard.sort(function (a, b) {
                return a - b;
            });
            var retList = [];
            //排序全部采用长沙
            mCard.getCardListWork(retList, allCard, true);
            mCard.getCardListWork(retList, allCard, false);
            //排序
            retList.sort(function (a, b) {
                var isKan = function (kan) {
                    if (kan.length == 3 && kan[0] == kan[1] && kan[0] == kan[2]) return true;
                    return false;
                }
                var aquan = 0;
                var bquan = 0;
                if (isKan(a)) {
                    aquan = a[0];
                } else {
                    aquan = 100 + (a[0] + 9) % 10 * 10 + (a[0] + 9) / 10;
                }
                if (isKan(b)) {
                    bquan = b[0];
                } else {
                    bquan = 100 + (b[0] + 9) % 10 * 10 + (b[0] + 9) / 10;
                }
                return aquan - bquan;
            });
            // console.log(retList);
            return retList;
        }
    },
    getOtherCardList:function (cards) {
        var smallCard = [];
        var bigCard = [];
        for(var i=0;i<cards.length;i++){
            if(cards[i] > 10)
                bigCard.push(cards[i]);
            else if(cards[i] < 11)
                smallCard.push(cards[i]);
        }
        smallCard.sort(function(a,b){
            return a - b;
        });
        bigCard.sort(function(a,b){
            return a - b;
        });
        var retList = [];
        mCard.getCardListWork2(retList, smallCard, true);
        mCard.getCardListWork2(retList, bigCard, true);
        mCard.getCardListWork2(retList, smallCard, false);
        mCard.getCardListWork2(retList, bigCard, false, true);
        //排序
        retList.sort(function(a,b){
            var isKan = function(kan){
                if(kan.length == 3 && kan[0] == kan[1] && kan[0] == kan[2]) return true;
                return false;
            }
            var aquan = (isKan(a) ? 0:100) + a[0];
            var bquan = (isKan(b) ? 0:100) + b[0];
            return aquan - bquan;
        });
        return retList;
    },
    getCardListWork:function(retList, newCardList, isKan){
        if(isKan){
            mCard.searchSameCard(retList, newCardList, 4);
            mCard.searchSameCard(retList, newCardList, 3);
        }else{
            mCard.searchSameCard(retList, newCardList, 2);
            if(mRoom.wanfatype != mRoom.YOUXIAN){
                mCard.searchJiaoCard(retList, newCardList);
                mCard.search123Card(retList, newCardList, true);
            }
            if(mRoom.wanfatype != mRoom.WEIMAQUE && mRoom.wanfatype != mRoom.YOUXIAN){
                mCard.search2710Card(retList, newCardList, true);
                mCard.search2710Card(retList, newCardList, false);
            }
            if(mRoom.is1510 == true){
                mCard.search1510Card(retList, newCardList, true);
                mCard.search1510Card(retList, newCardList, false);
            }
            mCard.search123Card(retList, newCardList);
            //再找   对能不能升级成  交
            if(mRoom.wanfatype != mRoom.WEIMAQUE)  mCard.searchDuiToJiao(retList, newCardList);
            mCard.search123NeedCard(retList, newCardList);
            mCard.searchLianCard(retList, newCardList)//连着的牌
            for(var i=0;i<newCardList.length;i++){
                var combo = [];
                combo.push(newCardList[i]);
                retList.push(combo);
            }
        }
        return retList;
    },
    getCardListWork2:function(retList, newCardList, isKan){
        if(isKan){
            mCard.searchSameCard(retList, newCardList, 4);
            mCard.searchSameCard(retList, newCardList, 3);
        }else {
            mCard.search123Card(retList, newCardList, true);
            mCard.searchJiaoCard(retList, newCardList);
            if (mRoom.wanfatype != mRoom.WEIMAQUE) {
                mCard.search2710Card(retList, newCardList, true);
                mCard.search2710Card(retList, newCardList, false);
            }
            if (mRoom.is1510 == true) {
                mCard.search1510Card(retList, newCardList, true);
                mCard.search1510Card(retList, newCardList, false);
            }
            mCard.searchSameCard(retList, newCardList, 2);
            mCard.search123Card(retList, newCardList);
            //再找   对能不能升级成  交
            if (mRoom.wanfatype != mRoom.WEIMAQUE) mCard.searchDuiToJiao(retList, newCardList);
            mCard.search123NeedCard(retList, newCardList);
            mCard.searchLianCard(retList, newCardList)//连着的牌

            for(var i=0;i<newCardList.length;i++){
                var combo = [];
                combo.push(newCardList[i]);
                retList.push(combo);
            }
        }
        return retList;
    },

    getCardCount:function(cards, card){
        var count = 0;
        for(var i=0;i<cards.length;i++){
            if(cards[i] == card){
                count ++;
            }
        }
        return count;
    },

    searchSameCard:function(list, cards, num){
        var sameList = {};
        for(var i=0;i<cards.length;i++){
            var card = cards[i];
            if(sameList[card] == null){
                sameList[card] = {};
                sameList[card].count = 1;
                sameList[card].pos = i;
            }else{
                sameList[card].count += 1;
            }
        }

        var deleteList = [];
        for(var key in sameList){
            var count = sameList[key].count;
            if(count == num){
                var v = parseInt(key);
                var combo = [];
                for(var i=0;i<count;i++){
                    combo.push(v);
                    deleteList.push(sameList[key].pos + i);
                }
                list.push(combo);
            }
        }
        removeInArray(cards, deleteList);
    },

    search2710Card:function(list, cards, isBig){
        var list1 = [];
        var list2 = [];
        var list3 = [];

        for(var i=0;i<cards.length;i++){
            var cardNumber = cards[i];
            if(isBig == true){
                cardNumber = cardNumber - 10;
            }

            if(cardNumber == 2){
                list1.push(i);
            }else if(cardNumber == 7){
                list2.push(i);
            }else if(cardNumber == 10){
                list3.push(i);
            }
        }

        var count = Math.min(list1.length, list2.length, list3.length);
        var deleteList = [];
        for(var i=0;i<count;i++){
            var combo = [2,7,10];
            if(isBig){
                combo = [12,17,20];
            }
            list.push(combo);

            deleteList.push(list1[i]);
            deleteList.push(list2[i]);
            deleteList.push(list3[i]);
        }
        removeInArray(cards, deleteList);
    },

    search1510Card:function(list, cards, isBig){
        var list1 = [];
        var list2 = [];
        var list3 = [];

        for(var i=0;i<cards.length;i++){
            var cardNumber = cards[i];
            if(isBig == true){
                cardNumber = cardNumber - 10;
            }

            if(cardNumber == 1){
                list1.push(i);
            }else if(cardNumber == 5){
                list2.push(i);
            }else if(cardNumber == 10){
                list3.push(i);
            }
        }

        var count = Math.min(list1.length, list2.length, list3.length);
        var deleteList = [];
        for(var i=0;i<count;i++){
            var combo = [1,5,10];
            if(isBig){
                combo = [11,15,20];
            }
            list.push(combo);

            deleteList.push(list1[i]);
            deleteList.push(list2[i]);
            deleteList.push(list3[i]);
        }
        removeInArray(cards, deleteList);
    },
    searchDuiToJiao:function(retList, list){
        var deleteList = [];
        for(var i=0;i<retList.length;i++){
            if(retList[i].length == 2 && retList[i][0] == retList[i][1]){
                for(var j=0;j<list.length;j++){
                    if((list[j]+10 == retList[i][0]) || (list[j]-10 == retList[i][0])){
                        deleteList.push(j);
                        retList[i].push(list[j]);
                        break;
                    }
                }
            }
        }
        removeInArray(list, deleteList);
    },
    search123Card:function(list, cards, iso123){
        var deleteList = [];
        for(var i=0;i<cards.length-2;i++){
            var card1 = cards[i];

            if(iso123 == true && card1 != 1 && card1 != 11){
                continue;
            }

            for(var j=i+1;j<cards.length-1;j++){
                var card2 = cards[j];
                if(card2 == card1+1){
                    for(var k=j+1;k<cards.length;k++){
                        var card3 = cards[k];
                        if(card3 == card2+1 && card3 != 11 && card3 != 12){
                            var isInUse = false;
                            for(var x=0;x<deleteList.length;x++){
                                var y = deleteList[x];
                                if(i== y || j == y || k == y){
                                    isInUse = true;
                                    break;
                                }
                            }

                            if(isInUse == false){
                                var combo = [card1, card2, card3];
                                list.push(combo);
                                deleteList.push(i);
                                deleteList.push(j);
                                deleteList.push(k);
                            }
                        }else if(card3 > card2+1){
                            break;
                        }
                    }
                }else if(card2 > card1+1){
                    break;
                }
            }
        }
        removeInArray(cards, deleteList);
    },

    searchJiaoCard:function(list, cards){
        var sameList = {};
        for(var i=0;i<cards.length;i++){
            var card = cards[i];
            var cardNumber = card;
            if(cardNumber > 10)cardNumber -= 10;

            if(sameList[cardNumber] == null){
                sameList[cardNumber] = {};
                sameList[cardNumber].cards = [];
                sameList[cardNumber].pos = [];
                sameList[cardNumber].count = 1;
            }else{
                sameList[cardNumber].count += 1;
            }
            sameList[cardNumber].cards.push(card);
            sameList[cardNumber].pos.push(i);
        }

        var deleteList = [];
        for(var key in sameList){
            var count = sameList[key].count;
            if(count == 3){
                var combo = sameList[key].cards;
                for(var s=0;s<combo.length;s++){
                    if(combo.length == 3 && combo[0] != combo[1]){
                        var tmp = combo[0];
                        combo[0] = combo[2];
                        combo[2] = tmp;
                    }
                }
                list.push(combo);
                deleteList = deleteList.concat(sameList[key].pos);
            }
        }
        removeInArray(cards, deleteList);
    },

    is2710:function(card){
        var no = card;
        if(no > 10)no -= 10;
        if(no == 2 || no == 7 || no == 10){
            return true;
        }
        return false;
    },

    is1510:function(card){
        var no = card;
        if(no > 10)no -= 10;
        if(no == 1 || no == 5 || no == 10){
            return true;
        }
        return false;
    },

    search123NeedCard:function(list, cards){
        var getList = [];
        var deleteList = [];

        for(var i=0;i<cards.length-1;i++){
            var card1 = cards[i];
            var card2 = cards[i+1];

            if(mCard.is2710(card1) && mCard.is2710(card2)){
                var combo = [card1, card2];
                getList.push(i);
                list.push(combo);

                deleteList.push(i);
                deleteList.push(i+1);

                i+=1;
            }
            // else if(card1 != 11 && card1 != 12) {
            else{
                if(card2 == card1+1 || card2 == card1+2){
                    var combo = [card1, card2];
                    getList.push(i);
                    list.push(combo);

                    deleteList.push(i);
                    deleteList.push(i+1);

                    i+=1;
                }
            }
        }
        removeInArray(cards, deleteList);
    },
    searchLianCard:function(list, cards) {
        var getList = [];
        var deleteList = [];

        for(var i=0;i<cards.length-1;i++){
            var card1 = cards[i];
            var card2 = cards[i+1];

            if(card2 == card1+1 || card2 == card1+2){
                var combo = [card1, card2];
                getList.push(i);
                list.push(combo);

                deleteList.push(i);
                deleteList.push(i+1);

                i+=1;
            }
        }
        removeInArray(cards, deleteList);
    },

    getHuCardCountInfo:function(huInfo){
        var info = {};
        info.big = 0;
        info.small = 0;
        info.red = 0;

        if(huInfo != null){
            mCard.getCardCountInComboList(huInfo.openList, info);
            mCard.getCardCountInComboList(huInfo.kanList, info);
            mCard.getCardCountInComboList(huInfo.huList, info);
        }
        return info;
    },

    getCardCountInComboList:function(comboList, info){
        for(var i=0;i < comboList.length;i++){
            var comboInfo = comboList[i];
            var cards = comboInfo.cards;
            for(var j=0;j<cards.length;j++){
                var card = cards[j];
                if(card > 10){
                    info.big += 1;
                }else{
                    info.small += 1;
                }
                if(mCard.is2710(card) == true){
                    info.red += 1;
                }
            }
        }
    }
}