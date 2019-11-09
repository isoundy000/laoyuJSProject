'use strict';
var pokerRule_NN = (function () {
    var getPaiValueNN = function (pai) {
        var val = Math.floor((pai - 1) / 4) + 1;
        return val <= 10 ? val : 10;
    };
    var getLaiziArr = function(arr){
        var laiziarr = [];
        for(var i=arr.length-1;i>=0;i--){
            if(arr[i] == 55){
                laiziarr.push(55);
                arr.splice(i, 1);
            }
        }
        return laiziarr;
    };
    //五小牛 每张小于5  和小于10
    var isFiveSmall = function (paiarr) {
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        var total = 0;
        for (var i = 0; i < arr.length; i++) {
            var value = getPaiValueNN(arr[i]);
            if (value >= 5) {
                return false;
            }
            total += value;
            if (total > 10) {
                return false;
            }
        }
        return true;
    };
    //五花牛  五张都是JQK
    var isWuhua = function(paiarr){
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        for (var i = 0; i < arr.length - 1; i++) {
            if(arr[i] <= 40){
                return false;
            }
        }
        return true;
    };
    //顺子牛
    var isShunzi = function(paiarr){
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        var cardvalue = [];
        for (var i = 0; i < arr.length; i++) {
            var value = Math.floor((arr[i] - 1) / 4) + 1;
            cardvalue.push(value);
        }
        cardvalue.sort(function (a, b) {
            return a - b;
        });
        if(cardvalue.length == 1){
            return true;
        }else if(cardvalue.length >= 2 && cardvalue.length <= 4){
            var cha = 0;
            for(var i=cardvalue.length-1;i>0;i--){
               if(cardvalue[i] == cardvalue[i-1])  return false;
               cha += cardvalue[i] - cardvalue[i-1] - 1;
            }
            if(cha > laiziarr.length) return false;
            return true;
        }
        for (var i = 0; i < cardvalue.length - 1; i++) {
            if(cardvalue[i+1] - cardvalue[i] != 1){
                return false;
            }
        }
        return true;
    };
    //同花牛
    var isTonghua = function(paiarr){
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        for (var i = 0; i < arr.length - 1; i++) {
            if((arr[i]%4) != (arr[i+1]%4)){
                return false;
            }
        }
        return true;
    };
    //葫芦牛
    var isHulu = function(paiarr){
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        var cardvalue = [];
        for (var i = 0; i < arr.length; i++) {
            var value = Math.floor((arr[i] - 1) / 4) + 1;
            cardvalue.push(value);
        }
        cardvalue.sort(function (a, b) {
            return a - b;
        });
        if(cardvalue.length == 1 || cardvalue.length == 2) {
            return true;
        }else if(cardvalue.length == 3){
            if(cardvalue[0] == cardvalue[1] || cardvalue[1] == cardvalue[2]){
                return true;
            }
            return false;
        }else if(cardvalue.length == 4){
            if((cardvalue[0] == cardvalue[1] && cardvalue[1] == cardvalue[2]) || (cardvalue[1] == cardvalue[2] && cardvalue[2] == cardvalue[3]) || (cardvalue[0] == cardvalue[1] && cardvalue[2] == cardvalue[3])){
                return true;
            }
            return false;
        }
        if(cardvalue[0] == cardvalue[1] && cardvalue[0] == cardvalue[2] && cardvalue[3] == cardvalue[4]){
            return true;
        }
        if(cardvalue[2] == cardvalue[3] && cardvalue[2] == cardvalue[4] && cardvalue[0] == cardvalue[1]){
            return true;
        }
        return false;
    };
    //炸弹牛
    var isBomb = function (paiarr) {
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        var cardvalue = [];
        for (var i = 0; i < arr.length; i++) {
            var value = Math.floor((arr[i] - 1) / 4) + 1;
            cardvalue.push(value);
        }
        cardvalue.sort(function (a, b) {
            return a - b;
        });
        if(cardvalue.length == 1 || cardvalue.length == 2) {
            return true;
        } else if(cardvalue.length == 3){
            if(cardvalue[0] == cardvalue[1] || cardvalue[1] == cardvalue[2])  return true;
        } else if (cardvalue.length == 4) {
            if((cardvalue[0] == cardvalue[1] && cardvalue[1] == cardvalue[2]) || (cardvalue[1] == cardvalue[2] && cardvalue[2] == cardvalue[3]))  return true;
        } else {
            if((cardvalue[0] == cardvalue[1] && cardvalue[1] == cardvalue[2] && cardvalue[2] == cardvalue[3]) || (cardvalue[1] == cardvalue[2] && cardvalue[2] == cardvalue[3] && cardvalue[3] == cardvalue[4]))  return true;
        }
        return false;
    };
    //四十大  加起来 >= 40
    var isSiShiDa = function(paiarr){
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        var cardvalueSum = 0;
        for (var i = 0; i < arr.length; i++) {
            var value = Math.floor((arr[i] - 1) / 4) + 1;
            cardvalueSum = cardvalueSum + value;
        }
        return (cardvalueSum >= arr.length*8);
    };
    //十小
    var isShiXiao = function(paiarr){
        var arr = _.clone(paiarr);
        if (arr.length != 5) {
            return false;
        }
        var laiziarr = getLaiziArr(arr);
        var cardvalueSum = 0;
        for (var i = 0; i < arr.length; i++) {
            var value = Math.floor((arr[i] - 1) / 4) + 1;
            cardvalueSum = cardvalueSum + value;
        }
        return (cardvalueSum <= arr.length*2);
    };

    var isNiu = function (arr) {
        return arr.length == 3 &&
            (getPaiValueNN(arr[0]) + getPaiValueNN(arr[1]) + getPaiValueNN(arr[2])) % 10 == 0
    };
    var getNiuCount = function (arr) {
        if (arr.length == 2) {
            return (getPaiValueNN(arr[0]) + getPaiValueNN(arr[1])) % 10
        }
        else {
            cc.log("传入的牌数不对啦～～～"+arr.length);
            return 0;
        }

    }

    var getNotInArr = function(arr1tmp, arr2tmp){
        for(var i=arr1tmp.length-1;i>=0;i--){
            for(var j=arr2tmp.length;j>=0;j--){
                if(arr2tmp[j] == arr1tmp[i]){
                    arr2tmp.splice(j, 1);
                }
            }
        }
        return arr2tmp;
    };

    var checkNiu = function (arr) {
        if(mRoom.noColor){
            if (isSiShiDa(_.clone(arr)) || isShiXiao(_.clone(arr))
                || isShunzi(_.clone(arr)) || isTonghua(_.clone(arr))) {
                return [0, 1, 2, 3, 4];
            }
        }else {
            if (isFiveSmall(arr) || isWuhua(_.clone(arr))
                || isShunzi(_.clone(arr)) || isTonghua(_.clone(arr))) {
                return [0, 1, 2, 3, 4];
            }
        }
        if(isHulu(_.clone(arr))){
            return [0, 1, 2];
        }
        if(isBomb(_.clone(arr))){
            return [0, 1, 2, 3];
        }
        if(arr.indexOf(55) >= 0) {
            //有癞子
            var weight = 0;
            var niuarr = [];
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    if(arr[i] != 55 && arr[j] != 55) {
                        var weighttmp = (getPaiValueNN(arr[i]) + getPaiValueNN(arr[j]) - 1) % 10 + 1;
                        // console.log(weighttmp);
                        // console.log([i, j]);
                        if (weighttmp > weight) {
                            weight = weighttmp;
                            niuarr = [i, j];
                        }
                    }
                }
            }
            //在除了癞子的牌里找是10的倍数的三张牌，癞子和另外一张
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    for (var k = j + 1; k < arr.length; k++) {
                        if(arr[i] != 55 && arr[j] != 55 && arr[k] != 55 && (getPaiValueNN(arr[i]) + getPaiValueNN(arr[j]) + getPaiValueNN(arr[k])) % 10 == 0) {
                            weighttmp = 10;
                            if (weighttmp > weight) {
                                weight = weighttmp;
                                niuarr = getNotInArr([i, j, k], [0, 1, 2, 3, 4]);
                                // console.log(niuarr);
                            }
                        }
                    }
                }
            }

            // console.log(niuarr);
            var tenarr = getNotInArr(niuarr, [0, 1, 2, 3, 4]);
            // console.log(tenarr);
            return tenarr;
        }else{
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    for (var k = j + 1; k < arr.length; k++) {
                        if ((getPaiValueNN(arr[i]) + getPaiValueNN(arr[j]) + getPaiValueNN(arr[k])) % 10 == 0) {
                            return [i, j, k];
                        }
                    }
                }
            }
        }
        return [];
    };

    //一共有10种选择
    var getNiuType = function (arr) {
        if (arr.length == 0)return 0;//没牛
    }

    var getPaiValue = function (pai) {
        if (pai == 53 || pai == 54) {
            return pai - 39;
        }
        return Math.floor((pai - 1) / 4) + 1;
    };

    var getPaiWeight = function (pai) {
        var value = getPaiValue(pai);
        if (value == 14 || value == 15) {
            return value + 2;
        }
        if (value == 1 || value == 2) {
            return value + 13;
        }
        return value;
    };

    var getPaiSortWeight = function (pai) {
        var weight = pai > 100 ? 4 * Math.floor(pai / 100) + 0.5 : pai;
        if (isLaizi(pai)) {
            weight = weight + 100;
        }
        if (pai == 53 || pai == 54) {
            weight = weight + 8;
        }
        if (weight > 0 && weight < 9) {
            weight = weight + 52;
        }
        return weight;
    };

    var CardType = {};
    CardType.c1 = 0;//单牌
    CardType.c2 = 1;//对子
    CardType.c3 = 2;//3不带
    CardType.c4 = 3;//炸弹
    CardType.c31 = 4;//3带1
    CardType.c32 = 5;//3带2
    CardType.c411 = 6;//4带2个单，或者一对
    CardType.c422 = 7;//4带2对
    CardType.c123 = 8;//顺子
    CardType.c1122 = 9;//跑得快连对
    CardType.c111222 = 10;//飞机
    CardType.c11122234 = 11;//飞机带单牌.
    CardType.c1112223344 = 12;//飞机带对子.
    CardType.c42 = 16; // 王炸
    CardType.c0 = 17;//不能出牌

    var Card = function (number) {
        return {
            value: getPaiValue(number),
            weight: getPaiWeight(number),
            number: number,
            voice: getPaiWeight(number) - 3,
            changeToNumber: number % 13,
            isLaizi: false
        };
    };

    var isSequenceArr = function (list) {
        var result = false;
        var count = list.length;
        if (count != 0) {
            var first = list[0];
            var last = list[count - 1];
            if (Math.abs(first - last) == count - 1 && last < 15 && first < 15) {
                result = true;
            }
        }
        return result;
    };

    var judgeType = function (list) {
        if (list && list.length > 0 && _.isNumber(list[0]))
            list = toCardsArr(list);
        list.sort(function (a, b) {
            return a.weight - b.weight
        });
        var len = list.length;
        if (len == 0) {
            return CardType.c0;
        }
        var cardsValue = [];
        for (var i = 0; i < len; i++) {
            cardsValue.push(list[i].weight);
        }
        var count = analyzeCards(list);
        var fourList = [];
        var threeList = [];
        var twoList = [];
        var oneList = [];
        for (var i = 0; i < count.length; i++) {
            if (count[i] == 4) {
                fourList.push(i + 3);
            } else if (count[i] == 3) {
                threeList.push(i + 3);
            } else if (count[i] == 2) {
                twoList.push(i + 3);
            } else if (count[i] == 1) {
                oneList.push(i + 3);
            }
        }
        var first = cardsValue[0];
        var last = cardsValue[len - 1];
        if (len == 1) {
            return CardType.c1;
        }
        if (len == 2) {
            if (first == last) {
                return CardType.c2;
            } else if (first == 16 && last == 17) {
                return CardType.c42;
            }
        }
        if (len == 3) {
            if (threeList.length == 1) {
                return CardType.c3;
            }
        }
        if (len == 4) {
            if (fourList.length == 1) {
                return CardType.c4;
            }
        }
        if ((len > 0 && len % 3 == 0) || (gameData.long_shun && len > 3)) {
            if (oneList.length == len && isSequenceArr(oneList)) {
                return CardType.c123;
            }
        }
        if (len == 4 || len == 6 || (gameData.long_shun && len > 6 && len % 2 == 0)) {
            if (twoList.length * 2 == len && isSequenceArr(twoList)) {
                return CardType.c1122;
            }
        }
        if (len == 6 || len == 9 || (gameData.long_shun && len > 9 && len % 3 == 0)) {
            if (threeList.length * 3 == len && isSequenceArr(threeList)) {
                return CardType.c111222;
            }
        }
        return CardType.c0;
    };

    var getResultObj = function (cardType, normalCards, laiziCards) {
        var obj = {};
        obj.type = cardType;
        obj.cardArr = [];
        for (var i = 0; i < normalCards.length; i++) {
            obj.cardArr.push(normalCards[i].number);
        }
        for (i = 0; i < laiziCards.length; i++) {
            obj.cardArr.push(laiziCards[i].changeToNumber * 100 + laiziCards[i].number);
        }
        return obj;
    };

    var analyzeCards = function (list) {
        var count = [];
        for (var i = 0; i < 15; i++)
            count[i] = 0;

        for (var _card in list)
            if (list.hasOwnProperty(_card)) {
                var card = list[_card];
                var index = card.weight - 3;
                count[index]++;
            }
        return count;
    };

    var checkCards = function (playerCards, myCards) {
        var firstChupai = !playerCards || !playerCards.length;
        if (playerCards && playerCards.length && _.isNumber(playerCards[0])) playerCards = toCardsArr(playerCards);
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);

        var laiziCards = [];
        myCards = myCards || [];
        for (var j = myCards.length - 1; j >= 0; j--) {
            if (isLaizi(myCards[j].number) || myCards[j].number > 52) {
                myCards[j].isLaizi = true;
                laiziCards.push(myCards[j]);
                myCards.splice(j, 1);
            }
        }
        if (laiziCards.length)
            laiziCards.sort(function (a, b) {
                return a.weight - b.weight
            });
        if (myCards && myCards.length)
            myCards.sort(function (a, b) {
                return a.weight - b.weight
            });
        if (playerCards && playerCards.length)
            playerCards.sort(function (a, b) {
                return a.weight - b.weight
            });

        var normalCards = deepCopy(myCards);
        var resultTypes = [];
        var cardsLen = normalCards.length;
        var laiziLen = laiziCards.length;
        var totalLen = cardsLen + laiziLen;
        var i;
        var j;
        var cardsValue = [];
        for (i = 0; i < cardsLen; i++)
            cardsValue.push(normalCards[i].weight);
        var laiziValue = [];
        for (i = 0; i < laiziLen; i++)
            laiziValue.push(laiziCards[i].weight);
        if (laiziLen >= 2)
            if (laiziValue[laiziLen - 1] == 17 && laiziValue[laiziLen - 2] == 16) {
                //大小王都有，只能是王炸。大小王不能同时出现当做癞子
                if (cardsLen + laiziLen == 2)
                    resultTypes.push(getResultObj(CardType.c42, laiziCards, []));
                return resultTypes;
            }
        var count = analyzeCards(normalCards);
        //癞子和大小王不能当做2，所以如果有癞子并且有2，是不可能组成任何牌型的
        if (count[12] > 0 && laiziLen > 0)
            return resultTypes;
        var fourList = [];
        var threeList = [];
        var twoList = [];
        var oneList = [];
        for (i = 0; i < count.length; i++) {
            if (count[i] == 4)
                fourList.push(i + 3);
            else if (count[i] == 3)
                threeList.push(i + 3);
            else if (count[i] == 2)
                twoList.push(i + 3);
            else if (count[i] == 1)
                oneList.push(i + 3);
        }
        var _temp_laizi_cards = null;
        var first = cardsLen > 0 ? cardsValue[0] : null;
        var last = cardsLen > 0 ? cardsValue[cardsLen - 1] : null;
        var playerCardType = CardType.c0;
        if (!firstChupai) {
            playerCardType = judgeType(playerCards);
        }

        //单张
        if (totalLen == 1) {
            if (firstChupai) {
                if (cardsLen == 1) {
                    resultTypes.push(getResultObj(CardType.c1, normalCards, laiziCards));
                }
            } else {
                if (playerCardType == CardType.c1) {
                    if (playerCards[0].weight < 15) {
                        if (cardsLen == 1 && (first == playerCards[0].weight + 1 || first == 15)) {
                            resultTypes.push(getResultObj(CardType.c1, normalCards, laiziCards));
                        }
                    } else if (playerCards[0].weight == 15 || playerCards[0].weight == 16)
                        if (gameData.king_guan_two && laiziLen == 1 && laiziValue[0] > 15)
                            resultTypes.push(getResultObj(CardType.c1, laiziCards, []));
                }
            }
        }
        //对子
        if (totalLen == 2) {
            if (firstChupai) {
                if ((cardsLen == 1 && first < 15) || (cardsLen == 2 && first == last)) {
                    _temp_laizi_cards = deepCopy(laiziCards);
                    for (i = 0; i < laiziLen; i++)
                        _temp_laizi_cards[i].changeToNumber = normalCards[0].value;
                    resultTypes.push(getResultObj(CardType.c2, normalCards, _temp_laizi_cards));
                }
            } else {
                if (playerCardType == CardType.c2) {
                    if ((cardsLen == 1 && first < 15 && first == playerCards[0].weight + 1) ||
                        (cardsLen == 2 && first == last && (first == playerCards[0].weight + 1 || first == 15))) {
                        var dstNum = playerCards[0].value + 1;
                        if (dstNum == 14)
                            dstNum = 1;
                        _temp_laizi_cards = deepCopy(laiziCards);
                        for (i = 0; i < laiziLen; i++)
                            _temp_laizi_cards[i].changeToNumber = dstNum;
                        resultTypes.push(getResultObj(CardType.c2, normalCards, _temp_laizi_cards));
                    }
                }
            }
        }
        //3张炸或者3张，看房间选项
        if (totalLen == 3) {
            if (firstChupai) {
                if ((cardsLen == 1 && first < 15) || (cardsLen == 2 && first == last && first < 15) || (cardsLen == 3 && first == last)) {
                    _temp_laizi_cards = deepCopy(laiziCards);
                    for (i = 0; i < laiziLen; i++) {
                        _temp_laizi_cards[i].changeToNumber = normalCards[0].value;
                    }
                    resultTypes.push(getResultObj(CardType.c3, normalCards, _temp_laizi_cards));
                }
            } else {
                if (playerCardType == CardType.c3) {
                    if (gameData.bomb_three) {
                        var _playerLaiziNum = 0;
                        for (i = 0; i < playerCards.length; i++) {
                            if (playerCards[i].isLaizi) {
                                _playerLaiziNum++;
                            }
                        }
                        if (_playerLaiziNum == 0) {
                            if (cardsLen == 3 && first == last && first > playerCards[0].weight) {
                                resultTypes.push(getResultObj(CardType.c3, normalCards, laiziCards));
                            }
                        } else {
                            if (cardsLen == 3 && first == last) {
                                resultTypes.push(getResultObj(CardType.c3, normalCards, laiziCards));
                            }
                            if ((cardsLen == 1 || cardsLen == 2) && first == last && first < 15 && first > playerCards[0].weight) {
                                _temp_laizi_cards = deepCopy(laiziCards);
                                for (i = 0; i < laiziLen; i++) {
                                    _temp_laizi_cards[i].changeToNumber = normalCards[0].value;
                                }
                                resultTypes.push(getResultObj(CardType.c3, normalCards, _temp_laizi_cards));
                            }
                        }
                    } else {
                        if (((cardsLen == 1 || cardsLen == 2) && first < 15 && first == last && first > playerCards[0].weight) ||
                            (cardsLen == 3 && first == last && first > playerCards[0].weight)) {
                            _temp_laizi_cards = deepCopy(laiziCards);
                            for (i = 0; i < laiziLen; i++)
                                _temp_laizi_cards[i].changeToNumber = cardsLen > 0 ? normalCards[0].value : 1;
                            resultTypes.push(getResultObj(CardType.c3, normalCards, _temp_laizi_cards));
                        }
                    }
                } else {
                    if (gameData.bomb_three) {
                        if ((cardsLen == 1 && first < 15) || (cardsLen == 2 && first == last && first < 15) || (cardsLen == 3 && first == last)) {
                            _temp_laizi_cards = deepCopy(laiziCards);
                            for (i = 0; i < laiziLen; i++) {
                                _temp_laizi_cards[i].changeToNumber = cardsLen > 0 ? normalCards[0].value : 1;
                            }
                            resultTypes.push(getResultObj(CardType.c3, normalCards, _temp_laizi_cards));
                        }
                    }
                }
            }
        }
        //4张炸弹
        if (totalLen == 4) {
            if (firstChupai) {
                if ((cardsLen == 1 && first < 15) || ((cardsLen == 2 || cardsLen == 3) && first == last && first < 15) || (cardsLen == 4 && first == last)) {
                    _temp_laizi_cards = deepCopy(laiziCards);
                    for (i = 0; i < laiziLen; i++) {
                        _temp_laizi_cards[i].changeToNumber = normalCards[0].value;
                    }
                    resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                }
            } else {
                if (playerCardType == CardType.c4) {
                    var _playerLaiziNum = 0;
                    for (i = 0; i < playerCards.length; i++) {
                        if (playerCards[i].isLaizi) {
                            _playerLaiziNum++;
                        }
                    }
                    if (_playerLaiziNum == 0) {
                        if (cardsLen == 4 && first == last && first > playerCards[0].weight) {
                            resultTypes.push(getResultObj(CardType.c4, normalCards, laiziCards));
                        }
                    } else {
                        if (cardsLen == 4 && first == last) {
                            resultTypes.push(getResultObj(CardType.c4, normalCards, laiziCards));
                        }
                        if ((cardsLen == 1 || cardsLen == 2 || cardsLen == 3) && first == last && first < 15 && first > playerCards[0].weight) {
                            _temp_laizi_cards = deepCopy(laiziCards);
                            for (i = 0; i < laiziLen; i++) {
                                _temp_laizi_cards[i].changeToNumber = normalCards[0].value;
                            }
                            resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                        }
                    }
                } else {
                    if ((cardsLen == 1 && first < 15) || ((cardsLen == 2 || cardsLen == 3) && first == last && first < 15) || (cardsLen == 4 && first == last)) {
                        _temp_laizi_cards = deepCopy(laiziCards);
                        for (i = 0; i < laiziLen; i++) {
                            _temp_laizi_cards[i].changeToNumber = cardsLen > 0 ? normalCards[0].value : 1;
                        }
                        resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                    }
                }
            }
        }
        //顺子
        if ((totalLen > 0 && totalLen % 3 == 0) || (gameData.long_shun && totalLen > 3)) {
            if (((playerCardType == CardType.c123 && playerCards.length == totalLen) || firstChupai) &&
                cardsLen > 0 && twoList.length == 0 && threeList.length == 0 && fourList.length == 0 && last < 15) {
                var begin = first - laiziLen;
                for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                    if (count[i - 3] > 0) {
                        if (i == 14 && laiziLen == 0 && isSequenceArr(oneList)) {
                            if (firstChupai || first == playerCards[0].weight + 1)
                                resultTypes.push(getResultObj(CardType.c123, normalCards, laiziCards));
                            break;
                        }
                        continue;
                    }
                    _temp_laizi_cards = deepCopy(laiziCards);
                    var _temp_one_list = deepCopy(oneList);
                    var _changeIndex = -1;
                    for (j = i; j < 15; j++) {
                        if (count[j - 3] == 0) {
                            _changeIndex++;
                            if (_changeIndex >= _temp_laizi_cards.length)
                                break;
                            _temp_laizi_cards[_changeIndex].changeToNumber = (j == 14 ? 1 : j);
                            _temp_one_list.push(j);
                        }
                    }
                    if (isSequenceArr(_temp_one_list.sort(compareTwoNumbers)))
                        if (firstChupai || _temp_one_list[0] == playerCards[0].weight + 1)
                            resultTypes.push(getResultObj(CardType.c123, normalCards, _temp_laizi_cards));
                    if (laiziLen == 0 || _changeIndex < _temp_laizi_cards.length)
                        break;
                }
            }
        }
        //连对
        if (totalLen == 4 || totalLen == 6 || (gameData.long_shun && totalLen > 6 && totalLen % 2 == 0)) {
            if (((playerCardType == CardType.c1122 && playerCards.length == totalLen) || firstChupai) &&
                cardsLen > 0 && fourList.length == 0 && threeList.length == 0 && last < 15) {
                var begin = first - Math.floor(laiziLen / 2);
                for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                    if (count[i - 3] > 1) {
                        if (i == 14 && twoList.length * 2 == cardsLen + laiziLen && isSequenceArr(twoList)) {
                            if (firstChupai || first == playerCards[0].weight + 1)
                                resultTypes.push(getResultObj(CardType.c1122, normalCards, laiziCards));
                            break;
                        }
                        continue;
                    }
                    _temp_laizi_cards = deepCopy(laiziCards);
                    var _temp_two_list = deepCopy(twoList);
                    var _changeIndex = -1;
                    for (j = i; j < 15; j++) {
                        if (count[j - 3] < 2) {
                            for (var k = 0; k < (2 - count[j - 3]); k++) {
                                _changeIndex++;
                                if (_changeIndex >= _temp_laizi_cards.length)
                                    break;
                                _temp_laizi_cards[_changeIndex].changeToNumber = (j == 14 ? 1 : j);
                            }
                            if (_changeIndex < _temp_laizi_cards.length)
                                _temp_two_list.push(j);
                            else
                                break;
                        }
                    }
                    if (_temp_two_list.length * 2 == totalLen && isSequenceArr(_temp_two_list.sort(compareTwoNumbers)))
                        if (firstChupai || _temp_two_list[0] == playerCards[0].weight + 1)
                            resultTypes.push(getResultObj(CardType.c1122, normalCards, _temp_laizi_cards));
                    if (laiziLen == 0 || _changeIndex < _temp_laizi_cards.length)
                        break;
                }
            }
        }
        //飞机
        if (totalLen == 6 || totalLen == 9 || (gameData.long_shun && totalLen > 9 && totalLen % 3 == 0)) {
            if (firstChupai || (playerCardType == CardType.c111222 && playerCards.length == totalLen)) {
                if (laiziLen == 0) {
                    if (threeList.length * 3 == totalLen && isSequenceArr(threeList))
                        if (firstChupai || first > playerCards[0].weight)
                            resultTypes.push(getResultObj(CardType.c111222, normalCards, laiziCards));
                }
                else if (cardsLen > 0 && fourList.length == 0) {
                    var begin = first - Math.floor(laiziLen / 3);
                    for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                        if (count[i - 3] > 2) {
                            continue;
                        }
                        _temp_laizi_cards = deepCopy(laiziCards);
                        var _temp_three_list = deepCopy(threeList);
                        var _temp_count = deepCopy(count);
                        var _changeIndex = -1;
                        for (j = i; j < 15; j++) {
                            if (_temp_count[j - 3] < 3) {
                                while (_temp_count[j - 3] < 3) {
                                    _changeIndex++;
                                    if (_changeIndex >= laiziLen) {
                                        break;
                                    }
                                    _temp_laizi_cards[_changeIndex].changeToNumber = (j == 14 ? 1 : j);
                                    _temp_count[j - 3]++;
                                }
                                if (_temp_count[j - 3] == 3)
                                    _temp_three_list.push(j);
                            }
                            if (_temp_count[j - 3] < 3)
                                break;
                        }
                        if (_temp_three_list.length * 3 == totalLen && isSequenceArr(_temp_three_list.sort(compareTwoNumbers))) {
                            if (firstChupai || _temp_three_list[0] > playerCards[0].weight)
                                resultTypes.push(getResultObj(CardType.c111222, normalCards, _temp_laizi_cards));
                            if (laiziLen == 0)
                                break;
                        }
                    }
                }
            }
        }
        return resultTypes;
    };

    var toCardsArr = function (arr) {
        var retArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < 100) {
                retArr.push(new Card(arr[i]));
            } else {
                var card = new Card(4 * Math.floor(arr[i] / 100));
                card.isLaizi = true;
                retArr.push(card);
            }
        }
        return retArr;
    };

    var isLaizi = function (value) {
        return gameData.laizi_three && value < 53 && getPaiValue(value) == 3;
    };

    return {
        isFiveSmall: isFiveSmall
        , isBomb: isBomb
        , isNiu: isNiu
        , isShunzi: isShunzi
        , isTonghua: isTonghua
        , isHulu: isHulu
        , isWuhua: isWuhua
        , isSiShiDa: isSiShiDa
        , isShiXiao: isShiXiao
        , getNiuCount: getNiuCount
        , checkNiu: checkNiu
        , getPaiValue: getPaiValue
        , getPaiWeight: getPaiWeight
        , getPaiSortWeight: getPaiSortWeight
        , checkCards: checkCards
        , CardType: CardType
        , judgeType: judgeType
        , toCardsArr: toCardsArr
        , Card: Card
        , isLaizi: isLaizi
        , getPaiValueNN: getPaiValueNN
    };

})();


