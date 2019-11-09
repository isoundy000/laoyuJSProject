/**
 * Created by dengwenzhong on 2017/9/19.
 */
'use strict';
var pokerRule_pdk = (function () {
    var NUM_XIAOWANG = 52;
    var NUM_DAWANG = 53;
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
    CardType.c111222333 = 13; //火箭
    CardType.c111222333456 = 14; //火箭带单
    CardType.c1112223333445566 = 15; //火箭带对
    CardType.c42 = 16; // 王炸
    CardType.c3A = 17;//3A炸弹
    CardType.c4111 = 18;//4带3
    CardType.c0 = 19;//不能出牌
    CardType.c3A1 = 20;//3A带1张炸弹

    var availableCardTypes = [];
    availableCardTypes.push(CardType.c1);
    availableCardTypes.push(CardType.c2);
    availableCardTypes.push(CardType.c3);
    availableCardTypes.push(CardType.c4);
    availableCardTypes.push(CardType.c3A);
    availableCardTypes.push(CardType.c3A1);
    availableCardTypes.push(CardType.c1122);
    availableCardTypes.push(CardType.c31);
    availableCardTypes.push(CardType.c32);
    availableCardTypes.push(CardType.c123);
    availableCardTypes.push(CardType.c111222);
    availableCardTypes.push(CardType.c1112223344);
    if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
        if (gameData.wanfaDesp && gameData.wanfaDesp.indexOf('允许4带2') >= 0) {
            availableCardTypes.push(CardType.c411);
        }
        if (gameData.wanfaDesp && gameData.wanfaDesp.indexOf('允许4带3') >= 0) {
            availableCardTypes.push(CardType.c4111);
        }
    }


    var Card = function (number) {
        var type = Math.floor(Math.floor(number / 13) + 0.5);
        var type1 = type + 1;
        var value = number - type * 13 + 1;
        var weight = value;
        if (type1 == 5)
            weight = value + 15;
        else if (value <= 2)
            weight = value + 13;
        var voice = weight - 3;
        return {
            type: type1,
            value: value,
            number: number,
            name: type + "_" + value,
            weight: weight,
            voice: voice,
            changeToNumber: number % 13,
            isLaizi: false
        };
    };

    var getValue = function (card) {
        var value = card.value;
        var i = value;
        if (value == 2)
            i += 13;
        if (value == 1)
            i += 13;
        if (card.type == 5)
            i += 2;// 是王
        return i;
    };

    var getMax = function (list) {
        var card_index = [];

        for (var i = 0; i < 4; i++)
            card_index[i] = [];

        var count = [];// 1-13各算一种,王算第14种
        for (var i = 0; i < 14; i++)
            count[i] = 0;

        for (var i = 0; i < list.length; i++) {
            if (list[i].type == 5) {
                count[13]++;
            } else {
                var v = list[i].value;
                if (v <= 2) {
                    v += 13;
                }

                count[v - 3]++;
            }
        }

        for (var i = 0; i < 14; i++) {
            switch (count[i]) {
                case 1:
                    card_index[0].push(i + 3);
                    break;
                case 2:
                    card_index[1].push(i + 3);
                    break;
                case 3:
                    card_index[2].push(i + 3);
                    break;
                case 4:
                    card_index[3].push(i + 3);
                    break;
            }
        }

        return card_index;
    };

    var isSequenceArr = function (list) {
        var result = false;

        var count = list.length;
        if (count != 0) {
            var first = list[0];
            var last = list[count - 1];
            if (Math.abs(first - last) == count - 1 && (last < 15) && first < 15) {
                result = true;
            }
        }

        return result;
    };

    var checkPlane = function (cards, isMylastHandCards) {
        var count = analyzeCards(cards);
        var len = cards.length;
        var threeList = [];
        var twoList = [];
        var oneList = [];
        for (var i = 0; i < count.length; i++) {
            if (count[i] >= 3) {
                //add the weight to the list
                threeList.push(i);
            } else if (count[i] >= 2) {
                twoList.push(i);
            } else if (count[i] >= 1) {
                oneList.push(i);
            }
        }
        var size = threeList.length;
        var twosize = twoList.length;
        var onesize = oneList.length;
        if (size < 2) {
            return CardType.c0;
        }
        if (size * 3 == len && isSequenceArr(threeList)) {
            return CardType.c111222;
        }
        switch (gameData.mapId) {
            case MAP_ID.PDK:
            case MAP_ID.PDK_JBC:
            case MAP_ID.PDK_MATCH:
                for (var i = 0; i < size; ++i) {
                    for (var k = 2; k <= size - i; ++k) {
                        var subList = threeList.slice(i, k + i);
                        if (isSequenceArr(subList)) {
                            if (5 * k == len) {
                                return CardType.c1112223344;
                            }
                            else if (k == 2) {
                                if (len < 10 && isMylastHandCards)
                                    return CardType.c1112223344;
                            }
                        } else {
                            break;
                        }
                    }
                }
                break;
            case MAP_ID.DDZ_JD:
            case MAP_ID.DDZ_LZ:
                if (size >= 2 && size * 3 == len && isSequenceArr(threeList)) {
                    return CardType.c111222;
                }
                if (size >= 2 && isSequenceArr(threeList) && size == twosize && len == size * 3 + twosize * 2) {
                    return CardType.c1112223344
                }
                if (size >= 2 && isSequenceArr(threeList) && size == onesize && len == size * 3 + onesize) {
                    return CardType.c11122234;
                }
                break;
        }
        return CardType.c0;
    };

    var checkPlaneWithLaizi = function (normalCards, laiziCards, cardsValue, laiziValue) {
        var resultTypes = [];
        var _availableCardTypes = [];
        var cardsLen = normalCards.length;
        var laiziLen = laiziCards.length;
        var totalLen = cardsLen + laiziLen;
        if (totalLen == 6 || totalLen == 9 || totalLen == 12 || totalLen == 15 || totalLen == 18) {
            _availableCardTypes.push(CardType.c111222);
        }
        if (totalLen == 8 || totalLen == 12 || totalLen == 16 || totalLen == 20) {
            _availableCardTypes.push(CardType.c11122234);
        }
        if (totalLen == 10 || totalLen == 15 || totalLen == 20) {
            _availableCardTypes.push(CardType.c1112223344);
        }
        if (_availableCardTypes.length == 0) {
            return resultTypes;
        }
        var count = analyzeCards(normalCards);
        var fourList = [];
        var threeList = [];
        var twoList = [];
        var oneList = [];
        var i, j, _temp_laizi_cards;
        for (i = 0; i < count.length; i++) {
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
        if (_availableCardTypes.indexOf(CardType.c111222) >= 0) {
            if (laiziLen == 0) {
                if (threeList.length * 3 == totalLen && isSequenceArr(threeList)) {
                    resultTypes.push(getResultObj(CardType.c111222, normalCards, laiziCards));
                }
            } else if (fourList.length == 0) {
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
                                _temp_laizi_cards[_changeIndex].changeToNumber = (j - 1) % 13;
                                _temp_count[j - 3]++;
                            }
                            if (_temp_count[j - 3] == 3) {
                                _temp_three_list.push(j);
                            }
                        }
                        if (_temp_count[j - 3] < 3) {
                            break;
                        }
                    }
                    if (_temp_three_list.length * 3 == totalLen && isSequenceArr(_temp_three_list.sort(compareTwoNumbers))) {
                        resultTypes.push(getResultObj(CardType.c111222, normalCards, _temp_laizi_cards));
                        if (laiziLen == 0) {
                            break;
                        }
                    }
                }
            }
        }
        if (_availableCardTypes.indexOf(CardType.c11122234) >= 0) {
            var planeLen = totalLen / 4;
            var begin = first - Math.floor(laiziLen / 3);
            var _pre_three_list = [];
            for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                if (count[i - 3] > 2) {
                    _pre_three_list.push(i);
                    if (_pre_three_list.length == planeLen) {
                        resultTypes.push(getResultObj(CardType.c11122234, normalCards, laiziCards));
                        break;
                    }
                    continue;
                }
                _temp_laizi_cards = deepCopy(laiziCards);
                var _temp_three_list = deepCopy(_pre_three_list);
                _pre_three_list = [];
                var _temp_count = deepCopy(count);
                var _changeIndex = -1;
                for (j = i; j < 15; j++) {
                    if (laiziLen - 1 - _changeIndex >= 3 - _temp_count[j - 3]) {
                        while (_temp_count[j - 3] < 3) {
                            _changeIndex++;
                            if (_changeIndex >= laiziLen) {
                                break;
                            }
                            _temp_laizi_cards[_changeIndex].changeToNumber = (j - 1) % 13;
                            _temp_count[j - 3]++;
                        }
                    }
                    if (_temp_count[j - 3] >= 3) {
                        _temp_three_list.push(j);
                    } else {
                        break;
                    }
                }
                if (_temp_three_list.length == planeLen && isSequenceArr(_temp_three_list.sort(compareTwoNumbers))) {
                    resultTypes.push(getResultObj(CardType.c11122234, normalCards, _temp_laizi_cards));
                } else if (_temp_three_list.length == planeLen + 1) {
                    _temp_three_list.sort(compareTwoNumbers);
                    if (!(_temp_three_list.length * 3 == totalLen && isSequenceArr(_temp_three_list))) {
                        var _temp_three_list1 = deepCopy(_temp_three_list);
                        _temp_three_list1.splice(0, 1);
                        var _temp_three_list2 = deepCopy(_temp_three_list);
                        _temp_three_list2.splice(_temp_three_list2.length - 1, 1);
                        if (isSequenceArr(_temp_three_list1) || isSequenceArr(_temp_three_list2)) {
                            resultTypes.push(getResultObj(CardType.c11122234, normalCards, _temp_laizi_cards));
                        }
                    }
                }
            }
        }
        if (_availableCardTypes.indexOf(CardType.c1112223344) >= 0) {
            var planeLen = totalLen / 5;
            var begin = first - Math.floor(laiziLen / 3);
            var _pre_three_list = [];
            for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                if (count[i - 3] > 2) {
                    _pre_three_list.push(i);
                    if (_pre_three_list.length < planeLen) {
                        continue;
                    }
                }
                _temp_laizi_cards = deepCopy(laiziCards);
                var _temp_three_list = deepCopy(_pre_three_list);
                _pre_three_list = [];
                var _temp_count = deepCopy(count);
                var _changeIndex = -1;
                var _single_list = oneList.concat(threeList);
                for (j = i; j < 15; j++) {
                    if (_temp_three_list.length == planeLen) {
                        break;
                    }
                    while (_temp_count[j - 3] < 3) {
                        _changeIndex++;
                        if (_changeIndex >= laiziLen) {
                            break;
                        }
                        _temp_laizi_cards[_changeIndex].changeToNumber = (j - 1) % 13;
                        _temp_count[j - 3]++;
                    }
                    if (_temp_count[j - 3] >= 3) {
                        _temp_three_list.push(j);
                    } else {
                        break;
                    }
                }
                if (_temp_three_list.length == planeLen && isSequenceArr(_temp_three_list.sort(compareTwoNumbers))) {
                    for (j = 0; j < _temp_three_list.length; j++) {
                        if (count[_temp_three_list[j] - 3] == 1 || count[_temp_three_list[j] - 3] == 3) {
                            _single_list.splice(_single_list.indexOf(_temp_three_list[j]), 1);
                        } else if (count[_temp_three_list[j] - 3] == 4) {
                            _single_list.push(_temp_three_list[j]);
                        }
                    }
                    for (j = 0; j < _single_list.length; j++) {
                        _changeIndex++;
                        if (_changeIndex >= laiziLen) {
                            break;
                        }
                        _temp_laizi_cards[_changeIndex].changeToNumber = (_single_list[j] - 1) % 13;
                    }
                    if (_changeIndex < laiziLen) {
                        while (_changeIndex < laiziLen - 1) {
                            _changeIndex++;
                            _temp_laizi_cards[_changeIndex].changeToNumber = laiziCards[laiziLen - 1].number % 13;
                        }
                        resultTypes.push(getResultObj(CardType.c1112223344, normalCards, _temp_laizi_cards));
                    }
                }
            }
        }
        return resultTypes;
    };

    var judgeType = function (list, myLastHandCards) {
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
            cardsValue.push(getValue(list[i]));
        }
        var first = cardsValue[0];
        var last = cardsValue[len - 1];
        if (len <= 4) {
            if (first == last) {
                if (len == 1) {
                    return CardType.c1;
                } else if (len == 2) {
                    return CardType.c2;
                } else if (len == 3) {
                    if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && first == 14) {
                        return CardType.c3A;
                    }
                    return CardType.c3;
                } else {
                    return CardType.c4;
                }
            } else {
                if (len == 2 && first > 15 && last > 15) {
                    return CardType.c42;
                } else if (len == 4) {
                    var second = cardsValue[1];
                    var third = cardsValue[2];
                    if (second == third && (first == second || third == last)) {

                        if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && gameData.pdk3A1bomb && second == 14) {
                            return CardType.c3A1;
                        }
                        return CardType.c31;
                    } else {
                        var arr = [first, second, third, last];
                        arr.sort(compareTwoNumbers);
                        if (arr[2] == arr[1] + 1 && arr[0] == arr[1] && arr[2] == arr[3] && (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH))
                            return CardType.c1122;
                    }
                }
            }
        } else {
            if (first == last) {
                return CardType.c4;
            }
            var ci = getMax(list);

            var arr0 = ci[0] || [];
            var arr1 = ci[1] || [];
            var arr2 = ci[2] || [];
            var arr3 = ci[3] || [];

            // 链子
            if (arr0.length == len && isSequenceArr(arr0)) {
                return CardType.c123;
            }

            // 跑得快连对
            if (arr1.length * 2 == len && isSequenceArr(arr1)) {
                return CardType.c1122;
            }


            // 跑得快3带一对
            if (arr2.length == 1 && len == 5 && (gameData.mapId == MAP_ID.PDK  || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH)&& (arr1.length == 1 || arr0.length == 2)) {
                return CardType.c32;
            }

            // 斗地主3带一对
            if (arr2.length == 1 && len == 5 && arr1.length == 1) {
                return CardType.c32;
            }

            // 4带2
            if (myLastHandCards && (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH)) {
                if (arr3.length == 1 && len < 7 && gameData.wanfaDesp.indexOf("允许4带2") >= 0) {
                    return CardType.c411;
                }
                // 4带3
                if (arr3.length == 1 && len < 8 && gameData.wanfaDesp.indexOf("允许4带3") >= 0) {
                    return CardType.c4111;
                }
            } else {
                if (arr3.length == 1 && len == 6) {
                    return CardType.c411;
                }
                // 4带3
                if (arr3.length == 1 && len == 7) {
                    return CardType.c4111;
                }
            }

            // 4带2对
            if (arr3.length == 1 && arr1.length == 2 && len == 8 || arr3.length == 2) {
                return CardType.c422;
            }

            // 分析飞机
            if (len >= 6) {
                if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH)) {
                    return checkPlane(list, myLastHandCards);
                } else if (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ) {
                    var resultTypes = checkPlaneWithLaizi(list, [], cardsValue, []);
                    if (resultTypes.length > 0) {
                        return resultTypes[0].type;
                    }
                }
            }
        }
        return CardType.c0;
    };

    var judgeTypeWithLaizi = function (normalCards, laiziCards, isMyLastHandCards) {
        if (normalCards && normalCards.length > 0 && _.isNumber(normalCards[0]))
            normalCards = toCardsArr(normalCards);
        if (laiziCards && laiziCards.length > 0 && _.isNumber(laiziCards[0]))
            laiziCards = toCardsArr(laiziCards);
        var cardsLen = normalCards.length;
        var laiziLen = laiziCards.length;
        var cardsValue = [];
        var i;
        var j;
        for (i = 0; i < cardsLen; i++) {
            cardsValue.push(getValue(normalCards[i]));
        }
        var laiziValue = [];
        for (i = 0; i < laiziLen; i++) {
            laiziValue.push(getValue(laiziCards[i]));
        }
        var resultTypes = [];
        var _temp_laizi_cards = null;
        if (cardsLen == 0) {
            if (laiziLen == 0) {
                resultTypes.push(getResultObj(CardType.c0, normalCards, laiziCards));
            } else if (laiziLen == 1) {
                resultTypes.push(getResultObj(CardType.c1, normalCards, laiziCards));
            } else if (laiziLen == 2) {
                if (laiziValue[0] == laiziValue[1]) {
                    resultTypes.push(getResultObj(CardType.c2, normalCards, laiziCards));
                }
            } else if (laiziLen == 3) {
                if (laiziValue[0] == laiziValue[2]) {
                    resultTypes.push(getResultObj(CardType.c3, normalCards, laiziCards));
                }
            } else {
                _temp_laizi_cards = deepCopy(laiziCards);
                for (i = 1; i < _temp_laizi_cards.length; i++) {
                    _temp_laizi_cards[i].changeToNumber = _temp_laizi_cards[0].number % 13;
                }
                resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                if (laiziLen == 4 && laiziValue[0] != laiziValue[laiziLen - 1]) {
                    if (laiziValue[0] == laiziValue[2] || laiziValue[1] == laiziValue[3]) {
                        resultTypes.push(getResultObj(CardType.c31, normalCards, laiziCards));
                    }
                }
                if (laiziLen == 5 && ((laiziValue[0] == laiziValue[2] && laiziValue[3] == laiziValue[4]) ||
                    (laiziValue[0] == laiziValue[1] && laiziValue[2] == laiziValue[4]))) {
                    resultTypes.push(getResultObj(CardType.c32, normalCards, laiziCards));
                }
                if (laiziLen == 6 && laiziValue[0] != laiziValue[laiziLen - 1]) {
                    if (laiziValue[0] == laiziValue[2] && laiziValue[3] == laiziValue[5]) {
                        resultTypes.push(getResultObj(CardType.c111222, normalCards, laiziCards));
                    }
                    if ((laiziValue[0] == laiziValue[3] && laiziValue[4] == laiziValue[5]) ||
                        (laiziValue[0] == laiziValue[1] && laiziValue[2] == laiziValue[5])) {
                        resultTypes.push(getResultObj(CardType.c411, normalCards, laiziCards));
                    }
                }
            }
            return resultTypes;
        }

        var first = cardsValue[0];
        var last = cardsValue[cardsLen - 1];
        if (cardsLen + laiziLen == 1) {
            resultTypes.push(getResultObj(CardType.c1, normalCards, laiziCards));
        } else if (cardsLen + laiziLen == 2) {
            if (first == last && last <= 15) {
                _temp_laizi_cards = deepCopy(laiziCards);
                for (i = 0; i < _temp_laizi_cards.length; i++) {
                    _temp_laizi_cards[i].changeToNumber = normalCards[0].number % 13;
                }
                resultTypes.push(getResultObj(CardType.c2, normalCards, _temp_laizi_cards));
            }
            if (cardsLen == 2 && first > 15) {
                resultTypes.push(getResultObj(CardType.c42, normalCards, laiziCards));
            }
        } else if (cardsLen + laiziLen == 3) {
            if (first == last && last <= 15) {
                _temp_laizi_cards = deepCopy(laiziCards);
                for (i = 0; i < _temp_laizi_cards.length; i++) {
                    _temp_laizi_cards[i].changeToNumber = normalCards[0].number % 13;
                }
                resultTypes.push(getResultObj(CardType.c3, normalCards, _temp_laizi_cards));
            }
        } else if (cardsLen + laiziLen == 4) {
            if (cardsLen == 1) {
                var _three_value = [];
                _three_value.push({value: normalCards[0].number, needCount: 2});
                _three_value.push({value: laiziCards[0].number, needCount: 3});
                if (laiziValue[0] != laiziValue[laiziLen - 1]) {
                    _three_value.push({value: laiziCards[laiziLen - 1].number, needCount: 3});
                }
                for (i = 0; i < _three_value.length; i++) {
                    _temp_laizi_cards = deepCopy(laiziCards);
                    for (j = 0; j < _three_value[i].needCount; j++) {
                        _temp_laizi_cards[j].changeToNumber = _three_value[i].value % 13;
                    }
                    resultTypes.push(getResultObj(CardType.c31, normalCards, _temp_laizi_cards));
                }
                if (first <= 15) {
                    _temp_laizi_cards = deepCopy(laiziCards);
                    for (i = 0; i < _temp_laizi_cards.length; i++) {
                        _temp_laizi_cards[i].changeToNumber = normalCards[0].number % 13;
                    }
                    resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                }
            } else if (cardsLen == 2) {
                if (first <= 15) {
                    var _three_value = [];
                    if (first == last) {
                        _three_value.push({value: normalCards[0].number, needCount: 1});
                        _temp_laizi_cards = deepCopy(laiziCards);
                        for (i = 0; i < _temp_laizi_cards.length; i++) {
                            _temp_laizi_cards[i].changeToNumber = normalCards[0].number % 13;
                        }
                        resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                    } else {
                        _three_value.push({value: normalCards[0].number, needCount: 2});
                        if (last <= 15) {
                            _three_value.push({value: normalCards[cardsLen - 1].number, needCount: 2});
                        }
                    }
                    for (i = 0; i < _three_value.length; i++) {
                        _temp_laizi_cards = deepCopy(laiziCards);
                        for (j = 0; j < _three_value[i].needCount; j++) {
                            _temp_laizi_cards[j].changeToNumber = _three_value[i].value % 13;
                        }
                        resultTypes.push(getResultObj(CardType.c31, normalCards, _temp_laizi_cards));
                    }
                }
            } else if (cardsLen == 3) {
                if (first == last) {
                    resultTypes.push(getResultObj(CardType.c31, normalCards, laiziCards));
                    _temp_laizi_cards = deepCopy(laiziCards);
                    for (i = 0; i < _temp_laizi_cards.length; i++) {
                        _temp_laizi_cards[i].changeToNumber = normalCards[0].number % 13;
                    }
                    resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
                } else {
                    var _three_value = [];
                    if (first == cardsValue[1]) {
                        _three_value.push({value: normalCards[0].number, needCount: 1});
                    }
                    if (cardsValue[1] == last) {
                        _three_value.push({value: normalCards[cardsLen - 1].number, needCount: 1});
                    }
                    for (i = 0; i < _three_value.length; i++) {
                        _temp_laizi_cards = deepCopy(laiziCards);
                        for (j = 0; j < _three_value[i].needCount; j++) {
                            _temp_laizi_cards[j].changeToNumber = _three_value[i].value % 13;
                        }
                        resultTypes.push(getResultObj(CardType.c31, normalCards, _temp_laizi_cards));
                    }
                }
            } else if (cardsLen == 4) {
                if (first == last) {
                    resultTypes.push(getResultObj(CardType.c4, normalCards, laiziCards));
                } else if (first == cardsValue[2] || cardsValue[1] == last) {
                    resultTypes.push(getResultObj(CardType.c31, normalCards, laiziCards));
                }
            }
        } else {
            var count = analyzeCards(normalCards);
            var fourList = [];
            var threeList = [];
            var twoList = [];
            var oneList = [];
            for (i = 0; i < count.length; i++) {
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
            //炸弹
            if (first == last && last <= 15) {
                _temp_laizi_cards = deepCopy(laiziCards);
                for (i = 0; i < _temp_laizi_cards.length; i++) {
                    _temp_laizi_cards[i].changeToNumber = normalCards[0].number % 13;
                }
                resultTypes.push(getResultObj(CardType.c4, normalCards, _temp_laizi_cards));
            }
            //顺子
            if (oneList.length == cardsLen) {
                var begin = first - laiziLen;
                for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                    if (count[i - 3] > 0) {
                        if (i == 14 && laiziLen == 0 && isSequenceArr(oneList)) {
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
                            if (_changeIndex >= _temp_laizi_cards.length) {
                                break;
                            }
                            _temp_laizi_cards[_changeIndex].changeToNumber = (j - 1) % 13;
                            _temp_one_list.push(j);
                        }
                    }
                    if (isSequenceArr(_temp_one_list.sort(compareTwoNumbers))) {
                        resultTypes.push(getResultObj(CardType.c123, normalCards, _temp_laizi_cards));
                    }
                    if (laiziLen == 0 || _changeIndex < _temp_laizi_cards.length) {
                        break;
                    }
                }
            }

            //连对
            if (fourList.length == 0 && threeList.length == 0) {
                var begin = first - Math.floor(laiziLen / 2);
                for (i = begin >= 3 ? begin : 3; i < 15; i++) {
                    if (count[i - 3] > 1) {
                        if (i == 14 && twoList.length * 2 == cardsLen + laiziLen && isSequenceArr(twoList)) {
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
                                if (_changeIndex >= _temp_laizi_cards.length) {
                                    break;
                                }
                                _temp_laizi_cards[_changeIndex].changeToNumber = (j - 1) % 13;
                            }
                            if (_changeIndex < _temp_laizi_cards.length) {
                                _temp_two_list.push(j);
                            } else {
                                break;
                            }
                        }
                    }
                    if (_temp_two_list.length * 2 == cardsLen + laiziLen && isSequenceArr(_temp_two_list.sort(compareTwoNumbers))) {
                        resultTypes.push(getResultObj(CardType.c1122, normalCards, _temp_laizi_cards));
                    }
                    if (laiziLen == 0 || _changeIndex < _temp_laizi_cards.length) {
                        break;
                    }
                }
            }

            // 跑得快3带一对
            if (threeList.length == 1 && cardsLen == 5 && (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && (twoList.length == 1 || oneList.length == 2)) {
                resultTypes.push(getResultObj(CardType.c32, normalCards, laiziCards));
            }

            // 斗地主3带一对
            if (cardsLen + laiziLen == 5 && last <= 15 && fourList.length == 0 && (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ)) {
                if (oneList.length + twoList.length + threeList.length <= 2) {
                    if (threeList.length == 1) {
                        _temp_laizi_cards = deepCopy(laiziCards);
                        if (oneList.length == 1) {
                            _temp_laizi_cards[0].changeToNumber = (oneList[0] - 1) % 13
                        } else if (oneList.length + twoList.length == 0) {
                            if (laiziValue[0] != laiziValue[1]) {
                                _temp_laizi_cards[0].changeToNumber = _temp_laizi_cards[1].number % 13
                            }
                        }
                        resultTypes.push(getResultObj(CardType.c32, normalCards, _temp_laizi_cards));
                    } else {
                        var _changeValue = [];
                        if (cardsValue[0] == cardsValue[cardsLen - 1]) {
                            _changeValue.push([{value: normalCards[0].number, needCount: 3 - cardsLen},
                                {value: laiziCards[laiziLen - 1].number, needCount: 2}]);
                            _changeValue.push([{value: normalCards[0].number, needCount: 2 - cardsLen},
                                {value: laiziCards[laiziLen - 1].number, needCount: 3}]);
                            if (laiziValue[0] != laiziValue[laiziLen - 1]) {
                                _changeValue.push([{value: normalCards[0].number, needCount: 2 - cardsLen},
                                    {value: laiziCards[0].number, needCount: 3}]);
                            }
                        } else {
                            var _availableNum = [];
                            for (i = 0; i < oneList.length; i++) {
                                _availableNum.push({number: oneList[i] - 1, count: 1});
                            }
                            for (i = 0; i < twoList.length; i++) {
                                _availableNum.push({number: twoList[i] - 1, count: 2});
                            }
                            _changeValue.push([{value: _availableNum[0].number, needCount: 3 - _availableNum[0].count},
                                {value: _availableNum[1].number, needCount: 2 - _availableNum[1].count}]);
                            _changeValue.push([{value: _availableNum[1].number, needCount: 3 - _availableNum[1].count},
                                {value: _availableNum[0].number, needCount: 2 - _availableNum[0].count}]);
                        }
                        for (i = 0; i < _changeValue.length; i++) {
                            _temp_laizi_cards = deepCopy(laiziCards);
                            var _changeIndex = -1;
                            for (j = 0; j < _changeValue[i].length; j++) {
                                for (var k = 0; k < _changeValue[i][j].needCount; k++) {
                                    _changeIndex++;
                                    _temp_laizi_cards[_changeIndex].changeToNumber = _changeValue[i][j].value % 13;
                                }
                            }
                            resultTypes.push(getResultObj(CardType.c32, normalCards, _temp_laizi_cards));
                        }
                    }
                }
            }

            //4带2
            if (cardsLen + laiziLen == 6 && oneList.length + twoList.length + threeList.length + fourList.length <= 3) {
                if (fourList.length == 1) {
                    resultTypes.push(getResultObj(CardType.c411, normalCards, laiziCards));
                } else if (threeList.length == 1) {
                    if (laiziLen > 0) {
                        _temp_laizi_cards = deepCopy(laiziCards);
                        _temp_laizi_cards[0].changeToNumber = (threeList[0] - 1) % 13;
                        resultTypes.push(getResultObj(CardType.c411, normalCards, _temp_laizi_cards));
                    }
                } else if (laiziLen > 0) {
                    var _availableNums = oneList.concat(twoList);
                    _availableNums.push(laiziValue[0]);
                    if (laiziValue[0] != laiziValue[laiziLen - 1]) {
                        _availableNums.push(laiziValue[laiziLen - 1]);
                    }
                    for (i = 0; i < _availableNums.length; i++) {
                        _temp_laizi_cards = deepCopy(laiziCards);
                        var _changeIndex = -1;
                        for (j = 0; j < (4 - count[_availableNums[i] - 3]); j++) {
                            _changeIndex++;
                            if (_changeIndex >= _temp_laizi_cards.length) {
                                break;
                            }
                            _temp_laizi_cards[_changeIndex].changeToNumber = (_availableNums[i] - 1) % 13;
                        }
                        if (j == (4 - count[_availableNums[i] - 3])) {
                            resultTypes.push(getResultObj(CardType.c411, normalCards, _temp_laizi_cards));
                        }
                    }
                }
            }

            //4带2对
            if (cardsLen + laiziLen == 8 && last <= 15 && oneList.length + twoList.length + threeList.length + fourList.length <= 3) {
                _temp_laizi_cards = deepCopy(laiziCards);
                var _changeIndex = -1;
                do {
                    for (i = 0; i < oneList.length; i++) {
                        _changeIndex++;
                        if (_changeIndex >= _temp_laizi_cards.length) {
                            break;
                        }
                        _temp_laizi_cards[_changeIndex].changeToNumber = (oneList[i] - 1) % 13;
                    }
                    for (i = 0; i < threeList.length; i++) {
                        _changeIndex++;
                        if (_changeIndex >= _temp_laizi_cards.length) {
                            break;
                        }
                        _temp_laizi_cards[_changeIndex].changeToNumber = (threeList[i] - 1) % 13;
                    }
                    if (_changeIndex >= _temp_laizi_cards.length) {
                        break;
                    }
                    var _temp_two_list = twoList.concat(oneList);
                    var _temp_four_list = fourList.concat(threeList);
                    if (_temp_four_list.length == 1) {
                        if (_temp_two_list.length == 1) {
                            var _temp_laizi_cards2 = deepCopy(_temp_laizi_cards);
                            var _changeIndex2 = _changeIndex;
                            _changeIndex2++;
                            _temp_laizi_cards2[_changeIndex2].changeToNumber = _temp_laizi_cards2[laiziLen - 1] % 13;
                            resultTypes.push(getResultObj(CardType.c422, normalCards, _temp_laizi_cards2));
                            break;
                        } else if (_temp_two_list.length == 0) {
                            var _temp_laizi_cards2 = deepCopy(_temp_laizi_cards);
                            var _changeIndex2 = _changeIndex;
                            _changeIndex2++;
                            _temp_laizi_cards2[_changeIndex2].changeToNumber = _temp_laizi_cards2[0] % 13;
                            _changeIndex2++;
                            _temp_laizi_cards2[_changeIndex2].changeToNumber = _temp_laizi_cards2[laiziLen - 1] % 13;
                            resultTypes.push(getResultObj(CardType.c422, normalCards, _temp_laizi_cards2));
                            break;
                        }
                    } else if (_temp_four_list.length == 0) {
                        if (_temp_two_list.length == 3) {
                            for (i = 0; i < _temp_two_list.length; i++) {
                                var _temp_laizi_cards2 = deepCopy(_temp_laizi_cards);
                                var _changeIndex2 = _changeIndex;
                                for (j = 0; j < 2; j++) {
                                    _changeIndex2++;
                                    _temp_laizi_cards2[_changeIndex2].changeToNumber = (_temp_two_list[i] - 1) % 13;
                                }
                                resultTypes.push(getResultObj(CardType.c422, normalCards, _temp_laizi_cards2));
                            }
                            break;
                        } else if (_temp_two_list.length == 2 || _temp_two_list.length == 1) {
                            var _availableNums = [];
                            for (i = 0; i < _temp_two_list.length; i++) {
                                _availableNums.push(_temp_two_list[i]);
                            }
                            _availableNums.push(laiziValue[0]);
                            if (laiziValue[0] != laiziValue[laiziLen - 1]) {
                                _availableNums.push(laiziValue[laiziLen - 1]);
                            }
                            for (i = 0; i < _availableNums.length; i++) {
                                var _temp_laizi_cards2 = deepCopy(_temp_laizi_cards);
                                var _changeIndex2 = _changeIndex;
                                for (j = 0; j < 2; j++) {
                                    _changeIndex2++;
                                    _temp_laizi_cards2[_changeIndex2].changeToNumber = (_availableNums[i] - 1) % 13;
                                }
                                if (_temp_two_list.length == 1 && i == _availableNums.length - 1) {
                                    for (j = 0; j < 2; j++) {
                                        _changeIndex2++;
                                        _temp_laizi_cards2[_changeIndex2].changeToNumber = (laiziValue[0] - 1) % 13;
                                    }
                                }
                                resultTypes.push(getResultObj(CardType.c422, normalCards, _temp_laizi_cards2));
                            }
                            break;
                        }
                    }
                    resultTypes.push(getResultObj(CardType.c422, normalCards, _temp_laizi_cards));
                } while (0);
            }

            // 分析飞机
            if (cardsLen + laiziLen >= 6) {
                resultTypes = resultTypes.concat(checkPlaneWithLaizi(normalCards, laiziCards, cardsValue, laiziValue));
            }
        }

        return resultTypes;
    };

    var getResultObj = function (cardType, normalCards, laiziCards) {
        var obj = {};
        obj.type = cardType;
        obj.cardArr = [];
        obj.newCards = deepCopy(normalCards);
        for (var i = 0; i < normalCards.length; i++) {
            obj.cardArr.push(normalCards[i].number);
        }
        for (i = 0; i < laiziCards.length; i++) {
            obj.cardArr.push((laiziCards[i].changeToNumber + 1) * 100 + laiziCards[i].number);
            obj.newCards.push(new Card(laiziCards[i].changeToNumber));
        }
        obj.newCards.sort(function (a, b) {
            return a.weight - b.weight
        });
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


    var checkCards = function (playerCards, myCards, isMyLastHandCards, laiziValue) {
        if (playerCards && playerCards.length && _.isNumber(playerCards[0])) playerCards = toCardsArr(playerCards);
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);

        var laiziCards = [];
        myCards = myCards || [];
        for (var j = myCards.length - 1; j >= 0; j--) {
            if (isLaizi(myCards[j].number, laiziValue)) {
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

        var resultTypes = checkCardsSimple(myCards, laiziCards, isMyLastHandCards);
        if (!playerCards || playerCards.length == 0)
            return resultTypes;

        var playerCardType = judgeType(playerCards, isMyLastHandCards);
        if (availableCardTypes.indexOf(playerCardType) < 0) {
            return [];
        }
        if (resultTypes.length <= 0) {
            return resultTypes;
        }
        if (playerCardType == CardType.c42 && (gameData.mapId == MAP_ID.DDZ_JD || gameData.mapId == MAP_ID.DDZ_LZ)) {
            return [];
        }
        var exceptTypes = [];
        exceptTypes.push(CardType.c42);
        exceptTypes.push(CardType.c4);
        if ((gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && gameData.wanfaDesp.indexOf('3A当炸弹') >= 0) {
            exceptTypes.push(CardType.c3A);
        }
        if ( (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) && gameData.wanfaDesp.indexOf('3A带1张当炸弹') >= 0) {
            exceptTypes.push(CardType.c3A1);
        }
        if (playerCardType == CardType.c4) {
            removeResultType(resultTypes, exceptTypes);
            for (var i = resultTypes.length - 1; i >= 0; i--) {
                if (resultTypes[i].type == CardType.c4) {
                    if (myCards.length + laiziCards.length < playerCards.length) {
                        resultTypes.splice(i, 1);
                    } else if (myCards.length + laiziCards.length == playerCards.length) {
                        if (getBombWeight(playerCards) >= getBombWeight(myCards.concat(laiziCards))) {
                            resultTypes.splice(i, 1);
                        }
                    }
                }
            }
            return resultTypes;
        }

        exceptTypes.push(playerCardType);
        if (isMyLastHandCards) {
            if (playerCardType == CardType.c32) {
                exceptTypes.push(CardType.c31);
                exceptTypes.push(CardType.c3);
            }
            if (playerCardType == CardType.c1112223344) {
                exceptTypes.push(CardType.c111222);
            }
        }
        removeResultType(resultTypes, exceptTypes);

        // 单牌,对子,3带
        if (playerCardType == CardType.c1 || playerCardType == CardType.c2
            || playerCardType == CardType.c3) {
            for (var i = resultTypes.length - 1; i >= 0; i--) {
                if (resultTypes[i].type != CardType.c4 && resultTypes[i].type != CardType.c42 && resultTypes[i].type != CardType.c3A && resultTypes[i].type != CardType.c3A1) {
                    if (playerCards[0].weight >= resultTypes[i].newCards[0].weight) {
                        resultTypes.splice(i, 1);
                    }
                }
            }
        }

        // 顺子,连队，飞机不带
        if (playerCardType == CardType.c123 || playerCardType == CardType.c1122
            || playerCardType == CardType.c111222) {
            for (var i = resultTypes.length - 1; i >= 0; i--) {
                if (resultTypes[i].type != CardType.c4 && resultTypes[i].type != CardType.c42 && resultTypes[i].type != CardType.c3A && resultTypes[i].type != CardType.c3A1) {
                    if (playerCards.length != resultTypes[i].newCards.length ||
                        playerCards[0].weight >= resultTypes[i].newCards[0].weight) {
                        resultTypes.splice(i, 1);
                    }
                }
            }
        }
        // 按重复多少排序
        // 3带1,3带2 ,飞机带单，双,4带1,2,只需比较第一个就行，独一无二的
        if (playerCardType == CardType.c31 || playerCardType == CardType.c32
            || playerCardType == CardType.c411 || playerCardType == CardType.c4111 || playerCardType == CardType.c422) {
            var count = analyzeCards(playerCards);
            var fourList = [];
            var threeList = [];
            var twoList = [];
            var oneList = [];
            for (i = 0; i < count.length; i++) {
                if (count[i] == 4) {
                    fourList.push(i);
                } else if (count[i] == 3) {
                    threeList.push(i);
                } else if (count[i] == 2) {
                    twoList.push(i);
                } else if (count[i] == 1) {
                    oneList.push(i);
                }
            }
            if (fourList.length == 2) {
                twoList.push(fourList[0]);
                twoList.push(fourList[0]);
                twoList.sort(compareTwoNumbers);
                fourList.splice(0, 1);
            }
            for (var i = resultTypes.length - 1; i >= 0; i--) {
                if (resultTypes[i].type != CardType.c4 && resultTypes[i].type != CardType.c42 && resultTypes[i].type != CardType.c3A && resultTypes[i].type != CardType.c3A1) {
                    var count2 = analyzeCards(resultTypes[i].newCards);
                    var fourList2 = [];
                    var threeList2 = [];
                    var twoList2 = [];
                    var oneList2 = [];
                    for (j = 0; j < count2.length; j++) {
                        if (count2[j] == 4) {
                            fourList2.push(j);
                        } else if (count2[j] == 3) {
                            threeList2.push(j);
                        } else if (count2[j] == 2) {
                            twoList2.push(j);
                        } else if (count2[j] == 1) {
                            oneList2.push(j);
                        }
                    }
                    if (fourList2.length == 2) {
                        twoList2.push(fourList2[0]);
                        twoList2.push(fourList2[0]);
                        twoList2.sort(compareTwoNumbers);
                        fourList2.splice(0, 1);
                    }
                    var isEqual = false;
                    var func = function (list1, list2, i) {
                        if (list1.length != list2.length) {
                            resultTypes.splice(i, 1);
                            return true;
                        }
                        for (var j = list1.length - 1; j >= 0; j--) {
                            if (list1[j] > list2[j]) {
                                resultTypes.splice(i, 1);
                                return true;
                            } else if (list1[j] < list2[j]) {
                                return true;
                            } else if (list1[j] == list2[j]) {
                                isEqual = true;
                            }
                        }
                        return false;
                    };

                    if (fourList.length > 0 && func(fourList, fourList2, i)) {
                        continue;
                    }
                    if (threeList.length > 0 && func(threeList, threeList2, i)) {
                        continue;
                    }
                    if (twoList.length > 0 && func(twoList, twoList2, i)) {
                        continue;
                    }
                    if (oneList.length > 0 && func(oneList, oneList2, i)) {
                        continue;
                    }
                    if (isEqual) {
                        resultTypes.splice(i, 1);
                    }
                }
            }
        }
        if (playerCardType == CardType.c11122234 || playerCardType == CardType.c1112223344) {
            for (var i = resultTypes.length - 1; i >= 0; i--) {
                if (resultTypes[i].type != CardType.c4 && resultTypes[i].type != CardType.c42 && resultTypes[i].type != CardType.c3A && resultTypes[i].type != CardType.c3A1) {
                    var playerWeight = getPlaneMinWeight(playerCards, playerCardType);
                    var mineWeight = getPlaneMinWeight(resultTypes[i].newCards, resultTypes[i].type);
                    if (playerWeight[0] > mineWeight[0]) {
                        resultTypes.splice(i, 1);
                    } else if (playerWeight[0] == mineWeight[0]) {
                        var isBreak = false;
                        for (var j = playerWeight[1].length - 1; j >= 0; j--) {
                            if (playerWeight[1][j] > mineWeight[1][j]) {
                                resultTypes.splice(i, 1);
                                isBreak = true;
                                break;
                            } else if (playerWeight[1][j] < mineWeight[1][j]) {
                                isBreak = true;
                                break;
                            }
                        }
                        if (!isBreak) {
                            resultTypes.splice(i, 1);
                        }
                    }else if(playerWeight[0] < mineWeight[0]){
                        //飞机数量得一样
                        var myPlaneNum = getPlaneNum(myCards);
                        var otherPlaneNum = getPlaneNum(playerCards);
                        if(otherPlaneNum != myPlaneNum) {
                            resultTypes.splice(i, 1);
                        }
                    }
                }
            }
        }
        return resultTypes;
    };

    var removeResultType = function (resultTypes, exceptTypes) {
        for (var i = resultTypes.length - 1; i >= 0; i--) {
            var needRemove = true;
            for (var j = 0; j < exceptTypes.length; j++) {
                if (resultTypes[i].type == exceptTypes[j]) {
                    needRemove = false;
                    break;
                }
            }
            if (needRemove) {
                resultTypes.splice(i, 1);
            }
        }
    };

    var getBombWeight = function (cards) {
        var laiziNum = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].isLaizi) {
                laiziNum++;
            }
        }
        var fixNum;
        if (laiziNum == 0) {
            fixNum = 2;
        } else if (laiziNum == cards.length) {
            fixNum = 3;
        } else {
            fixNum = 1;
        }
        return fixNum * 100 + getValue(cards[0]);
    };

    var getPlaneNum = function(cardsArr){
        if(cardsArr && cardsArr.length > 0){
            var vnum = {};
            var planeNum = 0;
            for(var s=cardsArr.length-1;s>=0;s--){
                var value = cardsArr[s].value;
                if(vnum[value]){
                    vnum[value] ++;
                    if(vnum[value] == 3){
                        planeNum ++;
                    }
                }else{
                    vnum[value] = 1;
                }
            }
            if(planeNum == 3 && cardsArr.length < 12) planeNum = 2;
            if(planeNum == 4 && cardsArr.length < 16) planeNum = 3;
            return planeNum;
        }
        return 0;
    };
    var getPlaneMinWeight = function (playerCards, planeType) {
        var player_count = analyzeCards(playerCards);
        var plane_size;
        if (planeType == CardType.c1112223344) {
            plane_size = playerCards.length / 5;
        } else if (planeType == CardType.c111222) {
            plane_size = playerCards.length / 3;
        } else if (planeType == CardType.c11122234) {
            plane_size = playerCards.length / 4;
        }

        for (var i = 11; i >= 0; i--) {
            if (player_count[i] < 3) {
                continue;
            }
            var size = 1;
            for (var j = i - 1; j >= 0; j--) {
                if (player_count[j] >= 3) {
                    size++;
                } else {
                    break;
                }
                if (size == plane_size) {
                    return [i + 3, player_count];
                }
            }
        }
        return [0, player_count];
    };

    var checkCardsSimple = function (myCards, laiziCards, isMyLastHandCards) {
        if (myCards && myCards.length && _.isNumber(myCards[0]))
            myCards = toCardsArr(myCards);
        if (laiziCards && laiziCards.length && _.isNumber(laiziCards[0]))
            laiziCards = toCardsArr(laiziCards);
        var myCardTypeList = [];
        if (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) {
            var cardType = judgeType(myCards, isMyLastHandCards);
            if (cardType != CardType.c0) {
                myCardTypeList.push(getResultObj(cardType, myCards, laiziCards));
            }
        } else {
            myCardTypeList = judgeTypeWithLaizi(myCards, laiziCards, isMyLastHandCards);
        }
        for (var i = myCardTypeList.length - 1; i >= 0; i--) {
            if (availableCardTypes.indexOf(myCardTypeList[i].type) < 0 ||
                (!isMyLastHandCards && (myCardTypeList[i].type == CardType.c31 || myCardTypeList[i].type == CardType.c3 || myCardTypeList[i].type == CardType.c111222) &&  (gameData.mapId == MAP_ID.PDK || gameData.mapId == MAP_ID.PDK_JBC || gameData.mapId == MAP_ID.PDK_MATCH) )) {
                myCardTypeList.splice(i, 1);
            }
        }
        return myCardTypeList;
    };
    //跑得快智能提示
    var automaticTip = function(myCards, otherCards){
        //顺子
        var getShunzi = function(valueArr, retArr, min, begin){
            if(valueArr && valueArr.length < 5){
                return null;
            }
            var outArr = [];
            if(valueArr && valueArr.length >= 5) {
                var tmp = valueArr[valueArr.length - 1];
                if(min){
                    for(var k=valueArr.length-1;k>=0;k--){
                        if (valueArr[k] > min) {
                            tmp = valueArr[k];
                            outArr.push(retArr[k].number);
                            break;
                        }
                    }
                }else{
                    outArr.push(retArr[valueArr.length - 1].number);
                }

                for (var i = valueArr.length - 2; i >= 0; i--) {
                    if (valueArr[i] - tmp > 1) {
                        break;
                    } else if (valueArr[i] != 15 && valueArr[i] - tmp == 1) {
                        tmp = valueArr[i];
                        outArr.push(retArr[i].number);
                    }
                }
                if(outArr && outArr.length >= 5) {
                    return outArr;
                }else{
                    //递归调用
                    var begintmp = begin || valueArr.length - 2;
                    var mintmp = valueArr[begintmp];
                    if(begintmp > 4) {
                        outArr = getShunzi(valueArr, retArr, mintmp, begintmp - 1);
                        if (outArr && outArr.length >= 5) {
                            return outArr;
                        }
                    }
                }
            }
            return null;
        }
        //连队
        var getLiandui = function(valueArr, retArr, min, begin){
            if(valueArr && valueArr.length < 4){
                return null;
            }
            var outArr = [];
            var vnum = {};
            var tmp = 0;
            for(var s=valueArr.length-1;s>=0;s--){
                if(vnum[valueArr[s]]){
                    vnum[valueArr[s]] ++;
                    if (!tmp && vnum[valueArr[s]] == 2 && (min ? valueArr[s] > min:true)) {
                        tmp = valueArr[s];
                        outArr.push(retArr[s].number);
                        outArr.push(retArr[s + 1].number);
                    }
                }else{
                    vnum[valueArr[s]] = 1;
                }
            }
            if(valueArr && valueArr.length >= 4 && tmp > 0) {
                for (var i = valueArr.length - 1; i > 0; i--) {
                    if (valueArr[i] - tmp > 1) {
                        break;
                    } else if (valueArr[i] != 15 && valueArr[i] - tmp == 1 && vnum[valueArr[i]] >= 2) {
                        tmp = valueArr[i];
                        outArr.push(retArr[i].number);
                        outArr.push(retArr[i - 1].number);
                        i = i - vnum[valueArr[i]] + 1;
                    }
                }
                if(outArr && outArr.length >= 4) {
                    return outArr;
                }else{
                    //递归调用
                    var begintmp = begin || valueArr.length - 2;
                    if(begintmp > 2) {
                        var mintmp = valueArr[begintmp];
                        outArr = getLiandui(valueArr, retArr, mintmp, begintmp - 1);
                        if (outArr && outArr.length >= 4) {
                            return outArr;
                        }
                    }
                }
            }
            return null;
        }
        //3带2
        var getSanDaiEr = function(valueArr, retArr, min, daiji){
            if(valueArr && valueArr.length < (daiji == 2?4:3)){
                return
            }
            var outArr = [];
            var vnum = {};
            for(var s=valueArr.length-1;s>=0;s--){
                if(vnum[valueArr[s]]){
                    vnum[valueArr[s]] ++;
                    if (vnum[valueArr[s]] == 3
                        && ((retArr[s-1] && retArr[s-1].value && retArr[s].value != retArr[s-1].value) || !retArr[s-1])
                        && (min ? valueArr[s] > min:true)) {
                        outArr.push(retArr[s].number);
                        outArr.push(retArr[s + 1].number);
                        outArr.push(retArr[s + 2].number);
                        break;
                    }
                }else{
                    vnum[valueArr[s]] = 1;
                }
            }
            if(outArr && outArr.length > 0) {
                var add = 0;
                for (var i = retArr.length-1; i >= 0; i--) {
                    if (outArr.indexOf(retArr[i].number) < 0 && (add < (daiji == 2?2:1))) {
                        outArr.push(retArr[i].number);
                        add++;
                    }
                }
                return outArr;
            }
            return null;
        }
        //四带三
        var getSiDaiSan = function(valueArr, retArr, min){
            if(valueArr && valueArr.length < 7){
                return null;
            }
            var outArr = [];
            var vnum = {};
            var tmp = 0;
            for(var s=valueArr.length-1;s>=0;s--){
                if(vnum[valueArr[s]]){
                    vnum[valueArr[s]] ++;
                    if (!tmp && vnum[valueArr[s]] == 4 && (min ? valueArr[s] > min:true)) {
                        tmp = valueArr[s];
                        outArr.push(retArr[s].number);
                        outArr.push(retArr[s + 1].number);
                        outArr.push(retArr[s + 2].number);
                        outArr.push(retArr[s + 3].number);
                    }
                }else{
                    vnum[valueArr[s]] = 1;
                }
            }
            if(outArr && outArr.length >= 4 && tmp > 0) {
                var addnum = 0;
                for (var i = retArr.length - 1; i >= 0; i--) {
                    if(outArr.indexOf(retArr[i].number) < 0 && addnum < 3){
                        outArr.push(retArr[i].number);
                        addnum++;
                    }
                }
                if(outArr && outArr.length >= 7) {
                    return outArr;
                }
            }
            return null;
        }
        //炸弹
        var getBomb = function(valueArr, retArr, min){
            if(valueArr && valueArr.length < 3){
                return null;
            }
            var outArr = [];
            var vnum = {};
            var tmp = 0;
            for(var s=valueArr.length-1;s>=0;s--){
                if(vnum[valueArr[s]]){
                    vnum[valueArr[s]] ++;
                    if (!tmp) {
                        if(vnum[valueArr[s]] == 4 && (min ? (valueArr[s] > min):true)) {
                            tmp = valueArr[s];
                            outArr.push(retArr[s].number);
                            outArr.push(retArr[s + 1].number);
                            outArr.push(retArr[s + 2].number);
                            outArr.push(retArr[s + 3].number);
                        }else if(vnum[valueArr[s]] == 3 && gameData.pdk3Abomb && valueArr[s] == 14 && (min ? (valueArr[s] > min):true)){
                            tmp = valueArr[s];
                            outArr.push(retArr[s].number);
                            outArr.push(retArr[s + 1].number);
                            outArr.push(retArr[s + 2].number);
                        }else if(vnum[valueArr[s]] == 3 && gameData.pdk3A1bomb && valueArr[s] == 14 && (min ? (valueArr[s] > min):true)
                            && retArr.length >= 4 && retArr[0]){
                            tmp = valueArr[s];
                            outArr.push(retArr[s].number);
                            outArr.push(retArr[s + 1].number);
                            outArr.push(retArr[s + 2].number);
                            outArr.push(retArr[0].number);
                        }
                    }
                }else{
                    vnum[valueArr[s]] = 1;
                }
            }
            if(outArr && tmp > 0) {
                return outArr;
            }
            return null;
        }
        //飞机
        // notwins不要翅膀
        var getPlane = function(valueArr, retArr, min, begin, notwings, otherplaneNum){
            if(valueArr && valueArr.length < 6){
                return null;
            }
            var planeNum = otherplaneNum || 3;
            var outArr = [];
            var vnum = {};
            for(var s=valueArr.length-1;s>=0;s--){
                if(vnum[valueArr[s]]){
                    vnum[valueArr[s]] ++;
                }else{
                    vnum[valueArr[s]] = 1;
                }
            }
            var tmp = 0;
            var index = valueArr.length;
            var feijinum = 0;//飞机最多三联对
            for(var k in vnum){
                index -= vnum[k];
                if(tmp == 0){
                    if(vnum[k] >= 3 && (min ? (parseInt(k) > min): true)){
                        feijinum++;
                        tmp = k;
                        outArr.push(retArr[index].number);
                        outArr.push(retArr[index + 1].number);
                        outArr.push(retArr[index + 2].number);
                    }
                }else{
                    if(vnum[k] >= 3 && (min ? (parseInt(k) > min): true) && parseInt(k) - parseInt(tmp) == 1
                        && (feijinum <= planeNum - 1) &&  ((feijinum == 1 && valueArr.length >= 6) || (feijinum == 2 && valueArr.length >= 9))){
                        tmp = k;
                        feijinum++;
                        outArr.push(retArr[index].number);
                        outArr.push(retArr[index + 1].number);
                        outArr.push(retArr[index + 2].number);
                    }
                }
            }
            //不要翅膀
            if(notwings && outArr
                && ((outArr.length == 6 && valueArr.length < 10) || (outArr.length == 9 && valueArr.length < 15))){
                for (var i = retArr.length - 1; i >= 0; i--) {
                    if (outArr.indexOf(retArr[i].number) < 0) {
                        outArr.push(retArr[i].number);
                    }
                }
                return outArr;
            }
            //上家出了几个飞机
            if(otherplaneNum && outArr && otherplaneNum != outArr.length/3){
                outArr = [];
            }
            if(outArr && outArr.length >= 6){
                if(outArr.length == 6 && valueArr.length >= 10){
                    var addnum = 0;
                    for (var i = retArr.length - 1; i >= 0; i--) {
                        if (outArr.indexOf(retArr[i].number) < 0 && addnum < 4) {
                            outArr.push(retArr[i].number);
                            addnum++;
                        }
                    }
                    return outArr;
                }else if(outArr.length == 9 && valueArr.length >= 15){
                    var addnum = 0;
                    for(var i=retArr.length - 1;i>=0;i--){
                        if(outArr.indexOf(retArr[i].number) < 0 && addnum < 6){
                            outArr.push(retArr[i].number);
                            addnum++;
                        }
                    }
                    return outArr;
                }
                return null;
            }else{
                //递归调用
                var begintmp = begin || valueArr.length - 2;
                if(begintmp > 3) {
                    var mintmp = valueArr[begintmp];
                    outArr = getPlane(valueArr, retArr, mintmp, begintmp - 1, notwings);
                }
                if (outArr && outArr.length >= 6) {
                    return outArr;
                }
            }
            return null;
        }
        //获取单 或者 对  三张
        var getDanOrDui = function(valueArr, retArr, min, danordui){
            if(valueArr && valueArr.length < 1){
                return null;
            }
            var outArr = [];
            var vnum = {};
            var tmp = 0;
            for(var s=valueArr.length-1;s>=0;s--){
                if(vnum[valueArr[s]]){
                    vnum[valueArr[s]] ++;
                }else{
                    vnum[valueArr[s]] = 1;
                }
                if (!tmp) {
                    if(vnum[valueArr[s]] == danordui && (min ? (valueArr[s] > min):true)) {
                        tmp = valueArr[s];
                        outArr.push(retArr[s].number);
                        if(danordui == 2)  outArr.push(retArr[s + 1].number);
                        if(danordui == 3){
                            outArr.push(retArr[s + 1].number);
                            outArr.push(retArr[s + 2].number);
                        }
                    }
                }
            }
            if(outArr && tmp > 0) {
                return outArr;
            }
            return null;
        }
        var getMinWight = function(otherCardsArr, num){
            var vnum = {};
            for(var s=otherCardsArr.length-1;s>=0;s--){
                var value = otherCardsArr[s].value;
                if(vnum[value]){
                    vnum[value] ++;
                    if(vnum[value] == num)  return value;
                }else{
                    vnum[value] = 1;
                }
            }
            return null;
        }


        var outArr = [];
        //自己出
        var retArr = [];
        var valueArr = [];
        for (var i = 0; i < myCards.length; i++) {
            var card = new Card(myCards[i]);
            retArr.push(card);
            valueArr.push(card.weight);
        }
        if(otherCards && otherCards.length > 0){
            var paiType = pokerRule_pdk.judgeType(otherCards);
            var otherCardsArr = toCardsArr(otherCards);
            var card = otherCardsArr[0];

            if (paiType == pokerRule_pdk.CardType.c123) {
                //顺子
                outArr = getShunzi(valueArr, retArr, card.weight);
                if(outArr && outArr.length >= otherCards.length){
                    return outArr.splice(0, otherCards.length);
                }
            }else if(paiType == pokerRule_pdk.CardType.c1122){
                //连对
                outArr = getLiandui(valueArr, retArr, card.weight);
                if(outArr && outArr.length >= otherCards.length){
                    return outArr.splice(0, otherCards.length);
                }
            }else if(paiType == pokerRule_pdk.CardType.c1112223344){
                //跑得快飞机
                var otherPlaneNum = getPlaneNum(otherCardsArr);
                var cardwight = getMinWight(otherCardsArr, 3) || card.weight;
                outArr = getPlane(valueArr, retArr, cardwight, null, null, otherPlaneNum);
                if(outArr){
                    return outArr;
                }
            }else if(paiType == pokerRule_pdk.CardType.c32){
                //三带几
                var cardwight = getMinWight(otherCardsArr, 3) || card.weight;
                outArr = getSanDaiEr(valueArr, retArr, cardwight, 2);
                if(outArr){
                    return outArr;
                }
            }else if(gameData.wanfaDesp && gameData.wanfaDesp.indexOf('允许4带3') >= 0 && paiType == pokerRule_pdk.CardType.c4111){
                //四单三
                var cardwight = getMinWight(otherCardsArr, 4) || card.weight;
                outArr = getSiDaiSan(valueArr, retArr, cardwight);
                if(outArr){
                    return outArr;
                }
            }else if(paiType == pokerRule_pdk.CardType.c2){
                //对
                outArr = getDanOrDui(valueArr, retArr, card.weight, 2);
                if(outArr){
                    return outArr;
                }
            }else if(paiType == pokerRule_pdk.CardType.c1){
                //单
                outArr = getDanOrDui(valueArr, retArr, card.weight, 1);
                if(outArr){
                    return outArr;
                }
            }
            var bomb = getBomb(valueArr, retArr, (paiType == pokerRule_pdk.CardType.c4) ? card.weight:null);
            if(bomb)  return bomb;
        }else{
            //跑得快飞机
            var plane = getPlane(valueArr, retArr, null, null, true);
            if(plane){
                return plane;
            }
            //跑得快连对
            var liandui = getLiandui(valueArr, retArr);
            //顺子
            var shunzi = getShunzi(valueArr, retArr);

            if(liandui && shunzi){
                return ((shunzi.length*2 - 2) > liandui.length)?shunzi:liandui;
            }
            if(shunzi) return shunzi;

            //四带三
            if (gameData.wanfaDesp && gameData.wanfaDesp.indexOf('允许4带3') >= 0) {
                var sidaisan = getSiDaiSan(valueArr, retArr);
                if (sidaisan)  return sidaisan;
            }
            //先出炸弹
            var bomb = getBomb(valueArr, retArr);
            if(bomb)  return bomb;

            //三带几
            var sandaier = getSanDaiEr(valueArr, retArr, null, 2);
            if(liandui){
                if(sandaier && sandaier.length >= liandui.length){
                    return sandaier;
                }
                return liandui;
            }
            if(sandaier)  return sandaier;

            //三
            var san = getDanOrDui(valueArr, retArr, null, 3);
            if(san)  return san;
            //单或者对
            var dui = getDanOrDui(valueArr, retArr, null, 2);
            if(dui)  return dui;
            var dan = getDanOrDui(valueArr, retArr, null, 1);
            if(dan)  return dan;

        }
        return myCards;
    };

    var toCardsArr = function (arr) {
        var retArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < 100) {
                retArr.push(new Card(arr[i]));
            } else {
                var card = new Card(Math.floor(arr[i] / 100) - 1);
                card.isLaizi = true;
                retArr.push(card);
            }
        }
        return retArr;
    };

    var numberArr2NameArr = function (arr) {
        var t = [];
        for (var i = 0; i < arr.length; i++)
            t.push(new Card(arr[i]).name);
        return t;
    };

    var changeAvailableCardTypes = function (roomID) {
        availableCardTypes = [];
        switch (roomID) {
            case MAP_ID.PDK:
            case MAP_ID.PDK_JBC:
            case MAP_ID.PDK_MATCH:
                availableCardTypes.push(CardType.c1);
                availableCardTypes.push(CardType.c2);
                availableCardTypes.push(CardType.c3);
                availableCardTypes.push(CardType.c4);
                availableCardTypes.push(CardType.c3A);
                availableCardTypes.push(CardType.c3A1);
                availableCardTypes.push(CardType.c1122);
                availableCardTypes.push(CardType.c31);
                availableCardTypes.push(CardType.c32);
                availableCardTypes.push(CardType.c123);
                availableCardTypes.push(CardType.c111222);
                availableCardTypes.push(CardType.c1112223344);
                if (gameData.wanfaDesp && gameData.wanfaDesp.indexOf('允许4带2') >= 0) {
                    availableCardTypes.push(CardType.c411);
                }
                if (gameData.wanfaDesp && gameData.wanfaDesp.indexOf('允许4带3') >= 0) {
                    availableCardTypes.push(CardType.c4111);
                }

                break;
            case MAP_ID.DDZ_JD:
            case MAP_ID.DDZ_LZ:
                availableCardTypes.push(CardType.c1);
                availableCardTypes.push(CardType.c2);
                availableCardTypes.push(CardType.c3);
                availableCardTypes.push(CardType.c4);
                availableCardTypes.push(CardType.c1122);
                availableCardTypes.push(CardType.c31);
                availableCardTypes.push(CardType.c32);
                availableCardTypes.push(CardType.c123);
                availableCardTypes.push(CardType.c111222);
                availableCardTypes.push(CardType.c1112223344);
                availableCardTypes.push(CardType.c11122234);
                availableCardTypes.push(CardType.c111222333);
                availableCardTypes.push(CardType.c111222333456);
                availableCardTypes.push(CardType.c1112223333445566);
                availableCardTypes.push(CardType.c42);
                availableCardTypes.push(CardType.c411);
                break;
        }
    };


    var isLaizi = function (value, laiziValue) {
        if (laiziValue.length > 0) {
            for (var i = 0; i < laiziValue.length; i++) {
                if (value < 52 && value % 13 + 1 == laiziValue[i]) {
                    return true;
                }
            }
            return false;
        }
        return false;
    };

    return {
        CardType: CardType
        , checkCards: checkCards
        , judgeType: judgeType
        , checkCardsSimple: checkCardsSimple
        , numberArr2NameArr: numberArr2NameArr
        , toCardsArr: toCardsArr
        , getValue: getValue
        , Card: Card
        , changeAvailableCardTypes: changeAvailableCardTypes
        , isLaizi: isLaizi
        , automaticTip: automaticTip
    };

})();


