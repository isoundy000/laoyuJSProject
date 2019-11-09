/**
 * Created by hjx on 2018/8/3.
 */
var scpdkRule = function () {
    var CardType = {};
    CardType.NONE = 0,
    CardType.t1 = 1,//单牌
    CardType.t2 = 2,//对子
    CardType.t3 = 3,//3同
    CardType.t456 = 4,//顺子
    CardType.t445566 = 5,//连对
    CardType.t444555666 = 6,//飞机
    CardType.t4 = 7,//4炸弹
    CardType.t0 = 8;//不能出牌


    var Card = function (number) {
        if(number<=-1){
            return {
                type :CardType.NONE, value:-1, number:-1,sortVal:-1
            };
        }
        var type = Math.floor(Math.floor(number / 13) + 0.5);
        var type1 = type + 1;
        var value = number - type * 13 + 1;
        var weight = value;
        if (type1 === 5)
            weight = value + 15;
        else if (value <= 2)
            weight = value + 13;
        var voice = weight - 3;

        var i = value;
        if (value === 2)
            i += 13;
        if (value === 1)
            i += 13;
        if (type1 === 5)
            i += 2;// 是王
        var sortVal = i;

        return {
            type: type1,
            value: value,
            number: number,
            name: type + "_" + value,
            weight: weight,
            voice: voice,
            changeToNumber: number % 13,
            isLaizi: false,
            sortVal : sortVal
        };
    };

    /**
     * 比较牌花色大小 初始定义牌花色大小有问题(此处服务器也是错的) 此处用于转化一下
     * @param type1
     * @param type2
     * @returns {number}
     */
    var compareHua = function (type1, type2) {
        var changeRule = { 1:2, 2:1, 3:3 ,4:4}
        var type1 = changeRule[type1];
        var type2 = changeRule[type2];
        return  type2-type1;
    }

    var getValue = function (card) {
        if(card.value<=-1){
            return -1;
        }

        var value = card.value;
        var i = value;
        if (value === 2)
            i += 13;
        if (value === 1)
            i += 13;
        if (card.type === 5)
            i += 2;// 是王
        return i;
    };

    /**
     * 得到相同的手牌
     * @param myCards
     * @param card
     * @returns {Array}
     */
    var getEqualValueCards = function (myCards, card) {
        var retArr = [];
        var value = _.isNumber(card) ? card : card.value;

        for (var i = 0; i < myCards.length; i++) {
            var tCard = myCards[i];
            if (tCard.value === value) {
                retArr.push(tCard);
            }
        }
        return retArr;
    }
    /**
     * 得到相同的手牌
     * @param myCards
     * @param card
     * @returns {Array}
     */
    var getEqualSortValueCards = function (myCards, card) {
        var retArr = [];
        var sortValue = _.isNumber(card) ? card : card.sortVal;

        for (var i = 0; i < myCards.length; i++) {
            var tCard = myCards[i];
            if (tCard.sortVal === sortValue) {
                retArr.push(tCard);
            }
        }
        return retArr;
    }

    var getSequenceCardsLength = function (myCards, rate) {
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);
        var tMap = {};
        for(var i=0; i<myCards.length; i++){
            var card = myCards[i];
            if(tMap[card.value]){
                tMap[card.value]++;
            }else{
                tMap[card.value]=1;
            }
        }
        var length = 0;
        var oldLength = 0;
        for(var i=3; i<=14; i++){
            if(i==14){
                if(tMap[13])
                    i=1;
                else
                    break;
            }

            if(tMap[i]>=rate){
                length++;
            }else{
                if(length>oldLength)
                    oldLength = length;
                length=0;
            }
            if(i==1)break;
        }
        return length>oldLength?length:oldLength;
    }
    /**
     * 判断手牌中有序的连接手牌
     * @param myCards
     * @param count
     * @returns {Array}
     */
    var getSequenceCardsArray = function (myCards, count) {
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);
        var singleCards = getEveryValueCard(myCards);
        var retCards = [];
        count = count || 3;
        var length = 0;
        var idx = 0;
        var startIdx = -1;
        while (true) {
            var curCard = singleCards[idx];
            var nextCard = singleCards[idx + 1];
            if (nextCard != undefined) {
                if(curCard.value===1)break;
                if (curCard.value === nextCard.value - 1 || (curCard.value===13 && nextCard.value===1 && nextCard.type!=5)) {
                    startIdx === -1 ? startIdx = idx : startIdx = startIdx;
                    idx++;
                    if (idx - startIdx === count - 1) {
                        var tArr = [];
                        //var str = "";
                        for (var i = startIdx; i <= idx; i++) {
                            tArr.push(singleCards[i]);
                            //str += cardToChinese(singleCards[i].number);
                        }
                        // if(!cc.sys.isNative){
                        //     cc.log(str);
                        // }
                        retCards.push(tArr);
                        idx = startIdx + 1;
                        startIdx = -1;
                    }
                } else {
                    idx++;
                    startIdx = idx;
                }
            } else {
                break;
            }
        }
        return retCards;
    }

    /**
     * 得到自己手中非重复手牌 主要用于 应付对手的 单牌 链子
     * @param list
     */
    var getEveryValueCard = function (list) {
        var retArr = [];
        var tArr = [];
        //特殊 王需要单独处理
        var t2Arr = [];
        var king = [];
        for (var i = 0; i < list.length; i++) {
            var v = list[i].value;
            if(list[i].type===5){
                if (t2Arr.indexOf(v) >= 0)continue;
                t2Arr.push(v);
            }else{
                if (tArr.indexOf(v) >= 0)continue;
                tArr.push(v);
            }
            retArr.push(list[i]);
        }
        retArr.sort(function (a, b) {
            return a.sortVal-b.sortVal;
        })
        return retArr;
    }

    /**
     * 统计牌里面出现对应几张 的牌值 打拱玩法两副牌 所以有八种
     * @param list
     * @returns {Array}
     */
    var getMax = function (list) {
        var card_index = [];

        for (var i = 0; i < 8; i++)
            card_index[i] = [];

        var count = [];// 1-13各算一种, 小王算第14种 大王15种
        for (var i = 0; i < 15; i++)
            count[i] = 0;

        for (var i = 0; i < list.length; i++) {
            if (list[i].type === 5) {
                if(list[i].number>=53) {
                    count[14]++;
                }else{
                    count[13]++;
                }
            }else {
                var v = list[i].value;
                if (v <= 2) {
                    v += 13;
                }
                count[v - 3]++;
            }
        }

        for (var i = 0; i < 15; i++) {
            var idx = count[i] - 1;
            if (idx >= 0 && idx < card_index.length) {
                card_index[idx].push(i + 3);
            }
        }

        return card_index;
    };

    var isSequenceArr = function (list) {
        var result = false;

        var count = list.length;
        if (count > 1) {
            var first = list[0];
            var last = list[count - 1];
            if (Math.abs(first - last) === count - 1 && (last < 15) && first < 15) {
                result = true;
            }
        }

        return result;
    };


    var getResultObj = function (cardType, normalCards) {
        var obj = {};
        obj.type = cardType;
        obj.cardArr = [];
        for (var i = 0; i < normalCards.length; i++) {
            obj.cardArr.push(normalCards[i].number);
        }
        return obj;
    };
    /**
     * 牌型判断
     * @param list
     * @returns {number}
     */
    var judgeType = function (list) {
        if (list && list.length > 0 && _.isNumber(list[0])) {
            list = toCardsArr(list);
        }

        list.sort(function (a, b) {
            return a.weight - b.weight
        });
        var len = list.length;
        if (len === 0) {
            return CardType.t0;
        }else if(list.length==1 && list[0].number==-1){
            return CardType.NONE;
        }
        var cardsValue = [];
        for (var i = 0; i < len; i++) {
            cardsValue.push(getValue(list[i]));
        }
        var first = cardsValue[0];
        var last = cardsValue[len - 1];
        if (len <= 4) {//单牌 对 连对 链子
            if (first === last) {
                if (len === 1) {
                    return CardType.t1;
                } else if (len === 2) {
                    return CardType.t2;
                } else if (len === 3) {
                    return CardType.t3;
                } else {
                    return CardType.t4;
                }
            } else {
                if (len === 3) {
                    // 链子
                    var ci = getMax(list);
                    if (isSequenceArr(ci[0] || [])) {
                        return CardType.t456;
                    }

                } else if (len === 4) {
                    if (first === 16 && last === 17) {
                        return CardType.t4joker;
                    }

                    var ci = getMax(list);
                    var arr0 = ci[0] || [];
                    var arr1 = ci[1] || [];
                    // 链子
                    if (arr0.length>=3 && isSequenceArr(arr0)) {
                        return CardType.t456;
                    }
                    // 连对
                    if (arr1.length * 2 === len && isSequenceArr(arr1)) {
                        return CardType.t445566;
                    }
                }
            }
        } else {
            var ci = getMax(list);

            var arr0 = ci[0] || [];
            var arr1 = ci[1] || [];
            var arr2 = ci[2] || [];

            // 链子
            if (arr0.length === len && isSequenceArr(arr0)) {
                return CardType.t456;
            }

            // 连对
            if (arr1.length * 2 === len && isSequenceArr(arr1)) {
                if (arr1.length >= 3) {
                    return CardType.t445566;
                }
            }
            //飞机
            if (arr2.length * 3 === len && isSequenceArr(arr2)) {
                if (arr2.length >= 2) {
                    return CardType.t444555666;
                }
            }
        }
        return CardType.t0;
    };

    /**
     * 判断自己的手牌是否可以大过别人的牌
     * @param myCards
     * @param otherCards
     * @returns {Array}
     */
    var checkCards = function (otherCards, myCards, isFirst ) {
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);
        if (otherCards && otherCards.length && _.isNumber(otherCards[0])) otherCards = toCardsArr(otherCards);

        var retCardsTypes = [];
        var type = judgeType(myCards);
        if (type === CardType.t0) {
            return retCardsTypes;
        }

        if (otherCards && otherCards.length != 0) {
            var type2 = judgeType(otherCards);
            var cardsObj1 = getResultObj(type, myCards);
            var cardsObj2 = getResultObj(type2, otherCards);
            if (isCanAGuanBPai(cardsObj1, cardsObj2)) {
                retCardsTypes.push(getResultObj(type, myCards));
            }
        } else {
            retCardsTypes.push(getResultObj(type, myCards));
        }


        return retCardsTypes;
    };

    /**
     * 将牌id转化为牌对象
     * @param arr
     * @returns {Array}
     */
    var toCardsArr = function (arr) {
        var retArr = [];
        for (var i = 0; i < arr.length; i++) {
            retArr.push(new Card(arr[i]));
        }
        return retArr;
    };

    /**
     * 判断牌型A是否可以管牌型B
     * @param objA
     * @param objB
     * @returns {boolean}
     */
    var isCanAGuanBPai = function (objA, objB) {
        var typeA = objA.type;
        var typeB = objB.type;
        var cardsA = objA.cardArr;
        var cardsB = objB.cardArr;

        if ((typeA <= CardType.t444555666 && typeA >= CardType.t1) && (typeB <= CardType.t444555666 && typeB >= CardType.t1)) {
            if (typeA != typeB)
                return false;
        }
        if (typeA < typeB)
            return false;

        if (typeA === typeB) {
            if (cardsA.length != cardsB.length)
                return false;

            var v1 = getValue(new Card(cardsA[0]));
            var v2 = getValue(new Card(cardsB[0]));

            if (v1 <= v2)
                return false;
        }
        return true;
    }
    /**
     * 判断数组中是否含有对应的第一个参数
     * @returns {boolean}
     * @private
     */
    var _arraysContainVal = function () {
        var length = arguments.length;
        for ( var i=1; i<length; i++){
            if(arguments[i].indexOf(arguments[0])>=0){
                return true;
            }
        }
        return false;
    }

    /**
     * 选出手牌中值大于目标牌的所有牌  对 3炸 4炸 5炸 6炸 7炸 .....
     * @param myCards 自己的手牌
     * @param cardid 牌id
     * @param srcArr 源数据
     * @param tarArr 结果目标数组
     * @param count 需要相同牌数量
     * @private
     */
    var _addBigSameCardIn = function (myCards, cardid, srcArr, tarArr, count, idx) {
        var card = new Card(cardid);
        var v = getValue(card);
        var startArr = srcArr[ idx||count-1 ];
        for(var i=0; i<startArr.length; i++) {
            var val = startArr[i];
            if(val>v && val<16){
                var tfArray = getEqualSortValueCards(myCards, val);
                if(tfArray.length<=0)continue;

                if(getValue(tfArray[0]) > v){
                    var tArr = [];
                    for(var j=0; j<count; j++)
                        tArr.push(tfArray[j].number);
                    tarArr.push(tArr);
                }
            }
        }
    }
    var _addBigShunziCardIn = function (myCards, startCardid, cardsType, retArray) {
        var v = getValue(new Card(startCardid));
        var len = cardsType.cardArr.length;
        if(startCardid===-1)
            len = getSequenceCardsLength(myCards,1);
        if(len<=3)len=3;

        var resArr = []

        while (len>=3){
            var array = getSequenceCardsArray(myCards, len)
            for (var i = 0; i < array.length; i++) {
                var card = array[i][0];
                var tv = getValue(card);
                if (tv > v) {
                    var tArr = [];
                    for (var j = 0; j < array[i].length; j++) {
                        tArr.push(array[i][j].number);
                    }
                    // retArray.unshift(tArr);
                    resArr.push(tArr)
                }
            }
            if(startCardid != -1)break;
            len--;
        }
        for(var i=resArr.length-1; i>=0; i--){
            retArray.unshift(resArr[i]);
        }
    }
    var _addBigLianduiCardIn = function (myCards, startCardid, cardsType, retArray, ci, lianLen) {
        lianLen = lianLen || 2;
        var v = getValue(new Card(startCardid));
        var len = cardsType.cardArr.length / lianLen;
        if(startCardid===-1) {
            len = getSequenceCardsLength(myCards, lianLen);
        }
        var array = getSequenceCardsArray(myCards, len);
        for (var i = 0; i < array.length; i++) {
            var card = array[i][0];
            var tv = getValue(card);
            if (tv > v) {
                var tArr = []
                for (var j = 0; j < array[i].length; j++) {
                    if (_arraysContainVal(array[i][j].sortVal, ci[1], ci[2], ci[3], ci[4], ci[5], ci[6], ci[7])){
                        // addCardToArray(tArr, myCards, array[i][j])
                        var tfArray = getEqualSortValueCards(myCards, array[i][j]);
                        // tArr.push(tfArray[0].number);
                        // tArr.push(tfArray[1].number);
                        // tArr.push(tfArray[2].number);
                        if(tfArray.length<lianLen)
                            break;
                        for(var x=0; x<lianLen; x++){
                            tArr.push(tfArray[x].number);
                        }
                    } else {
                        break;
                    }
                }
                if (array[i].length * lianLen === tArr.length)
                    retArray.unshift(tArr);
            }
        }
    }

    /**
     * 核心函数
     * 用于判断自己手牌中可以管上来牌的所有牌型 后期优化管牌算法，用于应对提示牌型的合理化
     * @param myCards
     * @param cardsType
     * @param isMyFirstSendPai
     * @returns {*}
     */
    var findBigCardsType = function (myCards, cardsType, isMyFirstSendPai) {
        var type = cardsType.type;
        if (type === undefined || type === CardType.t0 )
            return null;

        var retArray = [];
        var ci = getMax(myCards);

        var arr0 = ci[0] || [];
        var arr1 = ci[1] || [];
        var arr2 = ci[2] || [];
        var arr3 = ci[3] || [];

        var startCardid = cardsType.cardArr[0];

        do{
            switch (type) {
                case CardType.t1:
                    var card = new Card(startCardid);
                    var v = getValue(card);
                    for(var i=0; i<arr0.length; i++) {
                        var val = arr0[i];
                        if(val>v && v<16){
                            var tfArray = getEqualSortValueCards(myCards, val);
                            if(tfArray.length<=0)continue;

                            if(getValue(tfArray[0]) > v){
                                var tArr = [];
                                for(var j=0; j<1; j++)
                                    tArr.push(tfArray[j].number);
                                retArray.push(tArr);
                            }
                        } else if(v<val && (val === 16 || val === 17)){//王 判断大小王
                            var tfArray = getEqualSortValueCards(myCards, val);
                            for(var j=0; j<tfArray.length; j++){
                                if(tfArray[j].number>startCardid){
                                    retArray.push([tfArray[j].number]);
                                }
                            }
                        }
                    }
                    break;
                case CardType.t2:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 2);
                    break;
                case CardType.t456:
                    _addBigShunziCardIn(myCards, startCardid, cardsType, retArray);
                    break;
                case CardType.t445566:
                    _addBigLianduiCardIn(myCards, startCardid, cardsType, retArray, ci, 2);
                    break;
                case CardType.t444555666:
                    _addBigLianduiCardIn(myCards, startCardid, cardsType, retArray, ci, 3);
                    break;
                case CardType.t3:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 3);
                    break;
                case CardType.t4:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 4);
                    break;
                default:
                    break;
            }
            startCardid = -1;

            if (isMyFirstSendPai) {
                type++;
            } else {
                (type < CardType.t4 ) ?type =  CardType.t4:type++;
            }

        }while (type<CardType.t0);


        //如果是单牌或者对子 强行选择所有牌中符合的 放到队列末尾
        if( cardsType.type==CardType.t1 || cardsType.type==CardType.t2 ) {
            for (var i=cardsType.type; i<8; i++) {
                _addBigSameCardIn( myCards, cardsType.cardArr[0], ci, retArray, cardsType.type , i );
            }
        }
        return retArray;
    }

    /**
     * 获得提示的手牌id数组
     * @param baseCards 基础手牌
     * @param targetCards 针对出牌的牌型
     */
    var getTipsCardsArray = function (baseCards, targetCards) {
        if (targetCards && targetCards.length && _.isNumber(targetCards[0])) targetCards = toCardsArr(targetCards);
        if (baseCards && baseCards.length && _.isNumber(baseCards[0])) baseCards = toCardsArr(baseCards);

        var isMyFirstSendPai = false;
        if(targetCards.length===0){
            targetCards = toCardsArr([-1]);
            isMyFirstSendPai = true;
        }
        var type = judgeType(targetCards);

        var targetCardsObj = getResultObj(type, targetCards);
        var retArr = findBigCardsType(baseCards, targetCardsObj, isMyFirstSendPai);
        cc.log("提示：" + JSON.stringify(retArr));
        return retArr;

    }

    var chooseSuitableCardsType = function (myCards, lowCardsType) {
        if (myCards && myCards.length>0 && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);
        if(lowCardsType && lowCardsType.length && _.isNumber(lowCardsType[0])){
            lowCardsType = toCardsArr(lowCardsType);
            var vType = judgeType(lowCardsType);
            lowCardsType = getResultObj(vType, lowCardsType)
        }
        if (!lowCardsType||lowCardsType.length<=0) lowCardsType = {type:CardType.NONE, cardArr:[-1]};

        var minType = lowCardsType.type;
        if (minType === undefined || minType === CardType.t0 )
            return null;

        var retArray = [];
        var ci = getMax(myCards);


        var type = CardType.t4;
        var overCount = 1;
        do{
            var startCardid = lowCardsType.cardArr[0];
            if(type>minType)startCardid=-1;

            switch (type) {
                case CardType.t444555666:
                    _addBigLianduiCardIn(myCards, startCardid, lowCardsType, retArray, ci, 3);
                    break;
                case CardType.t445566:
                    _addBigLianduiCardIn(myCards, startCardid, lowCardsType, retArray, ci, 2);
                    break;
                case CardType.t456:
                    _addBigShunziCardIn(myCards, startCardid, lowCardsType, retArray);
                    break;
                case CardType.t1:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 1);
                    break;
                case CardType.t2:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 2);
                    break;
                case CardType.t3:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 3);
                    break;
                case CardType.t4:
                    _addBigSameCardIn(myCards, startCardid, ci, retArray, 4);
            }
            type--;
            if(type<=CardType.t444555666 && minType!=CardType.NONE){
                type = minType;
                overCount--;
            }
            if(type<CardType.t1 && minType==CardType.NONE)
                break;
        }while(type>=minType && overCount>=0);

        console.log(retArray);
        return retArray;
    }

    return{
        CardType :CardType
        , Card: Card
        , toCardsArr: toCardsArr
        , checkCards: checkCards
        , judgeType: judgeType
        , getTipsCardsArray: getTipsCardsArray
        , chooseSuitableCardsType : chooseSuitableCardsType
    }
}();