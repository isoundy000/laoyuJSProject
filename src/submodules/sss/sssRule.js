/**
 * Created by hjx on 2018/9/17.
 */

/**
 * 十三水规则定义 判断函数定义
 */
var sssRule = function () {
//牌型大小，清龙/一条龙>报道>同花顺>铁支>小同花顺>葫芦>同花>顺子>三条>两对>对子>乌龙。
    var ruleCards = [];
    var CardType = {};
    var CardSpType = {};
    var CardBaseType = {};
    CardBaseType.NONE = 0;
    CardBaseType.t1 = 1;//单牌
    CardBaseType.t2 = 2;//对
    CardBaseType.t3 = 3;//三同
    CardBaseType.t4 = 4;//四同
    CardBaseType.t22 = 5;//对
    CardBaseType.t5 = 6;//五同
    CardBaseType.t12345 = 7;//顺子
    CardBaseType.t123452 = 8;//同花顺

    CardType.NONE = 0;
    CardType.Wulong = 1;     // 乌龙
    CardType.Double = 2;     // 对子
    CardType.TwoDui = 3;     // 两对
    CardType.Three = 4;      // 三张
    CardType.Shunzi = 5;     // 顺子
    CardType.TongHua = 6;    // 同花
    CardType.FullHouse = 7;    // 葫芦
    CardType.Bomb = 8;         // 炸弹、铁枝
    CardType.TongHuaShun = 9;  // 同花顺
    CardType.FiveBomb = 10;    // 五炸、五同
    CardType.gui5 = 11;//五鬼


    CardSpType.SanTongHua = 1;     // 5.报道（三同花）：第二墩，第三墩为同花，第一墩为三张同花色的牌，并且三墩牌型的花色都不同，才能算作三同花。
    CardSpType.SanShun = 2;     // 4.报道（三顺子）：第二墩，第三墩为顺子，第一墩为三张连续的牌
    CardSpType.LiuDuiBan = 3;     // 3.报道（六对半）：十三章牌由六个对子加一张其他单牌组成
    CardSpType.Yitiaolong = 4;      // 2.一条龙：不同花色，A到K各一张的十三张牌
    CardSpType.Qinglong = 5;     // 1.清龙：同一种花色，A到K各一张的十三张牌型


    var Card = function (number) {
        number = parseInt(number);
        if (number <= -1) {
            return {
                type: CardType.NONE, value: -1, number: -1, sortVal: -1
            };
        }
        var initnumber = undefined;
        var isLaizi = false
        var laiziVal = 0;
        if (number > 100) {
            isLaizi = true;
            initnumber = number;
            laiziVal = Math.floor(number / 100);
            number = Math.floor(number % 100);
        } else if (number == 53 || number == 54) {
            isLaizi = true;
            initnumber = number;
            laiziVal = number;
            number = Math.floor(number % 100);
        }


        var type = Math.floor((number - 1) % 4) + 1;
        var type1 = type + 1;
        var value = Math.floor((number - 1) / 4) + 1;
        //var isLaizi = value >= 14;


        var weight = value;
        if (type1 === 5)
            weight = value + 15;
        else if (value <= 2)
            weight = value + 13;
        var voice = weight - 3;

        var i = value;
        // if (value === 2)
        //     i += 13;
        if (value === 1)
            i += 13;
        if (type1 === 5)
            i += 2;// 是王
        var sortVal = i;

        return {
            type: type,
            value: value,
            number: number,
            name: type + "_" + value,
            weight: weight,
            voice: voice,
            isLaizi: isLaizi,
            initnumber: initnumber,
            laiziVal: laiziVal,//癞子牌的癞子值 其他为癞子代替的牌值
            sortVal: sortVal
        };
    };
    Card.getValue = function (id) {
        return Math.floor((id - 1) / 4) + 1;
    }

    var initCards = function (type) {
        switch (type) {
            case 1://基本的完整一副牌 无鬼牌
                for (var i = 0; i < 52; i++) {
                    ruleCards.push(new Card(i))
                }
                break;
        }
    }

    /**
     * 比较牌花色大小 初始定义牌花色大小有问题(此处服务器也是错的) 此处用于转化一下
     * @param type1
     * @param type2
     * @returns {number}
     */
    var compareHua = function (type1, type2) {
        var changeRule = {1: 2, 2: 1, 3: 3, 4: 4}
        var type1 = changeRule[type1];
        var type2 = changeRule[type2];
        return type2 - type1;
    }

    var getValue = function (card) {
        if (card.value <= -1) {
            return -1;
        }

        var value = card.value;
        var i = value;
        // if (value === 2)
        //     i += 13;
        // if (value === 1)
        //     i += 13;
        // if (card.type === 5)
        //     i += 2;// 是王
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
        var value = _.isNumber(card) ? card : card.value;

        for (var i = 0; i < myCards.length; i++) {
            var tCard = myCards[i];
            if (tCard.value === value && !tCard.isLaizi) {
                retArr.push(tCard);
            }
        }
        return retArr;
    }

    var getSequenceCardsLength = function (myCards, rate) {
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);
        var tMap = {};
        for (var i = 0; i < myCards.length; i++) {
            var card = myCards[i];
            if (tMap[card.value]) {
                tMap[card.value]++;
            } else {
                tMap[card.value] = 1;
            }
        }
        var length = 0;
        var oldLength = 0;
        for (var i = 3; i <= 14; i++) {
            if (i == 14) {
                if (tMap[13])
                    i = 1;
                else
                    break;
            }

            if (tMap[i] >= rate) {
                length++;
            } else {
                if (length > oldLength)
                    oldLength = length;
                length = 0;
            }
            if (i == 1)break;
        }
        return length > oldLength ? length : oldLength;
    }


    var setPaiTypeFrame = function (sp, id) {
        var strId = '' + id;
        if (strId.length <= 1) {
            strId = '0' + strId;
        }
        var frame = cc.spriteFrameCache.getSpriteFrame("game/poker_type" + strId);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames('res/submodules/sss/plist/game_txt.plist');
            frame = cc.spriteFrameCache.getSpriteFrame("game/poker_type" + strId + ".png");//pokers/pokers_1.png
        }
        if (frame)
            sp.setSpriteFrame(frame);
        else
            cc.error("不存在牌setPaiTypeFrame  " + id)

    }
    var _change2ImageID = function (id) {
        var card = new Card(id)
        // var offType = 5 - card.type;
        // var offType = card.type;
        // return (card.value - 1) * 4 + offType - 1;
        var offType = {4: 2, 1: 4, 2: 3, 3: 1}[card.type];

        return (offType - 1) * 13 + card.value - 1;
    }

    var setPaiFrame = function (sp, id) {
        if (!sp) {
            cc.error('null ->>> setPaiFrame')
            return;
        }
        console.log("setPaiFrame -> " + id);
        if (id === undefined) {
            sp.setTexture('res/submodules/sss/image/bg/card_bg.png');
            var guiCard = sp.getChildByName('gui');
            if (guiCard) {
                guiCard.setVisible(false)
            }
            var light = sp.getChildByName('light');
            if (light) {
                light.setVisible(false);
            }
            return;
        }
        var id = parseInt(id);
        //由于资源与服务器牌ID不同步 此处增加一步转换
        var imgId = _change2ImageID(id);
        var guiId = 0;

        //鬼牌 特殊处理 需要堆牌
        if (id > 100) {
            guiId = Math.floor(id / 100);
            imgId = _change2ImageID(Math.floor(id % 100));
        } else if (id == 53 || id == 54) {
            imgId = id - 1;
        }

        var frame = cc.spriteFrameCache.getSpriteFrame("poker_epz/pai_" + imgId);
        if (!frame) {
            cc.spriteFrameCache.addSpriteFrames('res/submodules/sss/plist/poker_epz.plist');
            frame = cc.spriteFrameCache.getSpriteFrame("poker_epz/pai_" + imgId + ".png");//pokers/pokers_1.png
        }
        if (frame)
            sp.setSpriteFrame(frame);
        else
            cc.error("不存在牌id  " + id)

        if (guiId) {
            var guiCard = sp.getChildByName('gui');
            if (guiCard) {
                guiCard.setVisible(true)
                guiCard.setTexture('res/submodules/sss/image/bg/w' + guiId + '.png');
            } else {
                var guiCard = new cc.Sprite('res/submodules/sss/image/bg/w' + guiId + '.png');
                sp.addChild(guiCard);
                guiCard.x = 81;
                guiCard.y = 110;
                guiCard.setName('gui')
            }
        } else {
            var guiCard = sp.getChildByName('gui');
            if (guiCard) {
                guiCard.setVisible(false)
            }
        }
        //马牌
        if (gameData.options && gameData.options.mapai && gameData.options.mapai == id) {
            var mapai = gameData.options.mapai;
            var light = sp.getChildByName('light');
            if (light) {
                light.setVisible(true);
            } else {
                var light = new cc.Sprite('res/submodules/sss/image/bg/card_light_bg.png')
                light.setName('light');
                light.x = 81;
                light.y = 110;
                // light.setScale(1.05);
                sp.addChild(light);
            }
        } else {
            var light = sp.getChildByName('light');
            if (light) {
                light.setVisible(false);
            }
        }
    }
    var showCardsInfo = function (node, idx, data, cb, passAnim) {
        node.setVisible(true)
        console.log("showCardsInfo " + idx + "  " + JSON.stringify(data));
        var idxs = [];
        var spArr = [];
        var posY = 0;
        var paiArr = data.cards;
        var cardType = data.cardType;
        if (idx == 1) {
            idxs = [1, 2, 3]
            posY = 130;
        } else if (idx == 2) {
            idxs = [4, 5, 6, 7, 8]
            posY = 80
        } else {
            idxs = [9, 10, 11, 12, 13]
        }
        if (paiArr && idxs.length == paiArr.length) {
            var frontNode = node.getChildByName('frontNode');
            frontNode.setVisible(true)
            for (var i = 0; i < idxs.length; i++) {
                var sp = frontNode.getChildByName('pk' + (idxs[i]));
                if (sp) {
                    setPaiFrame(sp, paiArr[i])
                    sp.setVisible(!!passAnim);
                    spArr.push(sp);
                }
            }
        } else {
            console.log(JSON.stringify(paiArr));
            cc.error('showCardsInfo 数量错误' + idx + "    " + idxs.length)
        }
        if (!passAnim) {
            var animNode = playAnimScene(node, res.ShowIdxPaisAnim_json, 0, posY, false, function () {
                animNode.removeFromParent();
                for (var i = 0; i < spArr.length; i++) {
                    spArr[i].setVisible(true);
                }
                if (cb) cb();
            });
            var start = paiArr.length == 5 ? 0 : 1;
            if (start == 1) {
                animNode.getChildByName('pk0').setVisible(false)
                animNode.getChildByName('pk4').setVisible(false)
            }
            for (var i = 0; i < paiArr.length; i++, start++) {
                setPaiFrame(animNode.getChildByName('pk' + start), paiArr[i])
            }
            var typeSp = animNode.getChildByName('type');
            if (typeSp) {
                // setPaiTypeFrame(typeSp, cardType);
                typeSp.setTexture('res/submodules/sss/image/type/type_word_' + cardType + ".png")
                if (idx == 2 && cardType == 7) {
                    typeSp.setTexture('res/submodules/sss/image/type/type_word_7_2.png')
                }
                if (idx == 1 && cardType == 4) {
                    typeSp.setTexture('res/submodules/sss/image/type/type_word_4_2.png')
                }
            }
        }

        var typeP = node.getChildByName('special_type');
        if (typeP) {
            typeP.setVisible(false);
        }
        node.getChildByName('word_tspx').setVisible(false)
    }
    var clearCardsInfo = function (row) {

    }
    var showAllCardsInfo = function (node, paiArr, type, isShowSpecial, isShowBack) {
        var frontNode = node.getChildByName('frontNode');
        node.getChildByName('backNode').setVisible(false);
        frontNode.setVisible(true)
        for (var i = 1; i <= 13; i++) {
            var sp = frontNode.getChildByName('pk' + i);
            if (sp) {
                if (!paiArr[i - 1] && isShowBack) {

                } else {
                    setPaiFrame(sp, paiArr[i - 1])
                }
            }
        }

        var typeP = node.getChildByName('special_type');
        if (typeP) {
            if (type) {
                typeP.setVisible(true);
                typeP.getChildByName('type').setTexture('res/submodules/sss/image/type/special_type_' + type + '.png');
            } else {
                typeP.setVisible(false);
            }
        }
        if (isShowSpecial) {
            node.getChildByName('word_tspx').setVisible(true)
        } else {
            node.getChildByName('word_tspx').setVisible(false)
        }
    }

    var toCardsArr = function (arr) {
        var retArr = [];
        for (var i = 0; i < arr.length; i++) {
            retArr.push(new Card(arr[i]));
        }
        return retArr;
    };
    var getMax = function (list, laiziList) {
        if (list && list.length && _.isNumber(list[0])) list = toCardsArr(list);
        var card_index = [];

        for (var i = 0; i < 9; i++)
            card_index[i] = [];

        var count = [];// 1-13各算一种, 小王算第14种 大王15种
        for (var i = 0; i < 15; i++)
            count[i] = 0;

        for (var i = 0; i < list.length; i++) {
            if (list[i].isLaizi && laiziList) {
                laiziList.push(list[i].laiziVal)
            } else {
                var v = list[i].value;
                count[v]++;
            }
        }

        for (var i = 0; i < 15; i++) {
            var idx = count[i] - 1;
            if (idx >= 0 && idx < card_index.length) {
                card_index[idx].push(i);
            }
        }

        return card_index;
    };

    var isSequenceIDArr = function (list) {
        var lastID = undefined;
        for (var i = 0; i < list.length; i++) {
            var id = list[i].number;
            if (lastID === undefined) {
                lastID = id;
                continue;
            }
            if (id == lastID + 1) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }

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
    var judgeBaseType = function (list) {
        if (list && list.length > 0 && _.isNumber(list[0])) {
            list = toCardsArr(list);
        }

        list.sort(function (a, b) {
            return a.weight - b.weight
        });
        var len = list.length;
        if (len === 0) {
            return CardBaseType.t0;
        } else if (list.length == 1 && list[0].number == -1) {
            return CardBaseType.NONE;
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
                    return CardBaseType.t1;
                } else if (len === 2) {
                    return CardBaseType.t2;
                } else if (len === 3) {
                    return CardBaseType.t3;
                } else {
                    return CardBaseType.t4;
                }
            } else {
                if (len === 3) {
                    return CardBaseType.t0;
                } else if (len === 4) {
                    var ci = getMax(list);
                    var arr1 = ci[1] || [];
                    if (arr1.length * 2 === len) {
                        return CardBaseType.t22;
                    }
                }
            }
        } else {
            var ci = getMax(list);
            var arr0 = ci[0] || [];
            var arr1 = ci[1] || [];
            var arr2 = ci[2] || [];
            var arr4 = ci[4] || [];

            // 链子
            if (arr0.length === len && isSequenceArr(arr0)) {
                if (isSequenceIDArr(list)) {
                    return CardBaseType.t123452;
                }
                return CardBaseType.t12345;
            }
            if (first === last) {
                if (arr4.length == 1)
                    return CardBaseType.t5;

            }
        }
        return CardType.t0;
    };
    var _toChinese = function (arr) {
        var str = "";
        var type = ['方块', '梅花', '红桃', '黑桃']
        var values = [0, 'A', '2', 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        for (var i = 0; i < arr.length; i++) {
            var card = new Card(arr[i]);
            str += (type[card.type - 1] + values[card.value])
            //str += "资源:" + _change2ImageID(arr[i])
            // str += " "
        }
        console.log(str);
        return str;
    }
    var getSpecialTypeName = function (id) {
        switch (id) {
            case 1:
                return '三同花';
            case 2:
                return '三顺子';
            case 3:
                return '六对半';
            case 4:
                return '一条龙';
            case 5:
                return '清龙';
            default:
                return '';
        }
    }

    var _id2two = function (id) {
        if (id < 10) {
            return '0' + id;
        } else {
            if (id > 52) {
                id -= 52;//如果传过来大于k的牌 则替换为A
            }
            if (id < 10) {
                return '0' + id;
            }
            return id;
        }
    }

    var _addSameCardIn = function (myCards, srcArr, tarArr, count, type, laiziArr) {
        var startArr = null;
        for (var x = count - 1; x < srcArr.length; x++) {
            startArr = srcArr[x]
            for (var i = 0; i < startArr.length; i++) {
                var val = startArr[i];
                var tfArray = getEqualSortValueCards(myCards, val);
                if (tfArray.length <= 0)continue;

                if (getValue(tfArray[0])) {
                    var tArr = [];
                    for (var j = 0; j < count; j++)
                        tArr.push(tfArray[j].number);
                    if (laiziArr) {
                        if ((val == 1) || i == startArr.length - 1) {
                        } else {
                            continue;
                        }
                        for (var y = 0; y < laiziArr.length; y++) {
                            tArr.push(parseInt('' + laiziArr[y] + _id2two(tfArray[0].number)));
                        }
                    }
                    tarArr.push({cardType: type, cards: tArr});
                }
            }
        }
    }
    var _addSameHuaShunIn = function (myCards, tarArr) {
        var huaMap = {
            1: [], 2: [], 3: [], 4: []
        }
        for (var i = 0; i < myCards.length; i++) {
            var card = myCards[i];
            if (card.value <= 13) {
                huaMap[card.type].push(card.number)
            }
        }
        for (var i = 1; i <= 4; i++) {
            huaMap[i].sort();
            _addShunziCardIn(toCardsArr(huaMap[i]), tarArr, 5, CardType.TongHuaShun)
        }
    }
    var _addSameHuaIn = function (myCards, tarArr, count, type, laiziArr) {
        var huaMap = {
            1: [], 2: [], 3: [], 4: []
        }
        for (var i = 0; i < myCards.length; i++) {
            var card = myCards[i];
            if (card.value <= 13 && !card.isLaizi) {
                huaMap[card.type].push(card.number)
            }
        }
        for (var i = 1; i <= 4; i++) {
            var arr = huaMap[i];
            if (laiziArr) {
                if (arr.length >= 5) {//多余-》不需要用癞子
                    continue;
                }
                if (laiziArr.length + arr.length >= 5) {
                    // var cards = arr.concat(laiziArr.slice(0, 5 - arr.length))
                    // for (var j = 0; j < cards.length; j++) {
                    //     if (cards[j] > 52) {
                    //         cards[j] = parseInt('' + cards[j] + _id2two(cards[j - 1]))
                    //     }
                    // }
                    var cards = [];
                    for (var j = 0; j < arr.length; j++) {
                        cards.push(arr[j])
                    }
                    var y = 0;
                    var Ace = !!cards[0] && cards[0] <= 4;
                    //2018年11月20日18:01:43 出现对牌 优先替换对牌
                    var Dui = (function () {
                        var lastVal = 0;
                        for(var x=0; x<cards.length; x++){
                            if(lastVal != new Card(cards[x]).value){
                                lastVal = new Card(cards[x]).value
                            }else{
                                return cards[x];
                            }
                        }
                        return 0;
                    })();
                    while (cards.length < 5) {
                        var lastNum = new Card(cards[cards.length - 1]).number;
                        if(Dui){
                            lastNum = Dui
                        }else if (Ace) {
                            lastNum = new Card(cards[0]).number;
                        }
                        cards.push(parseInt('' + new Card(laiziArr[y]).laiziVal + _id2two(lastNum)));
                    }
                    // console.log(JSON.stringify(cards));
                    tarArr.push({cardType: type, cards: cards})
                }
            } else {
                if (arr.length >= 5) {
                    tarArr.push({cardType: type, cards: arr.slice(0, count)})
                }
            }
        }
    }
    var getEveryValueCard = function (list) {
        var retArr = [];
        var tArr = [];
        //特殊 王需要单独处理
        var t2Arr = [];
        var king = [];
        for (var i = 0; i < list.length; i++) {
            var v = list[i].value;
            if (list[i].isLaizi)continue;
            if (list[i].type === 5) {
                if (t2Arr.indexOf(v) >= 0)continue;
                t2Arr.push(v);
            } else {
                if (tArr.indexOf(v) >= 0)continue;
                tArr.push(v);
            }
            retArr.push(list[i]);
        }
        retArr.sort(function (a, b) {
            return a.value - b.value;
        })
        return retArr;
    }
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
                //if(curCard.value===1)break;
                if (curCard.value === nextCard.value - 1 || (curCard.value === 13 && singleCards[startIdx - 1].value === 1 && nextCard.type != 5)) {
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
            } else if (startIdx != -1 && singleCards[0] && startIdx - 1 >= 0) {
                if ((curCard.value === 13 && singleCards[0].value === 1 && singleCards[0].type != 5)) {
                    var tArr = [];
                    for (var i = startIdx; i <= idx; i++) {
                        tArr.push(singleCards[i]);
                    }
                    tArr.push(singleCards[0]);
                    if (tArr.length == 5)
                        retCards.push(tArr);
                }
                break;
            } else {
                break;
            }
        }
        return retCards;
    }
    var _addShunziCardIn = function (myCards, retArray, len, type) {
        var resArr = []
        while (len >= 5) {
            var array = getSequenceCardsArray(myCards, len)
            for (var i = 0; i < array.length; i++) {
                var card = array[i][0];
                var tv = getValue(card);
                // if (tv > v) {
                var tArr = [];
                for (var j = 0; j < array[i].length; j++) {
                    tArr.push(array[i][j].number);
                }
                // retArray.unshift(tArr);
                resArr.push(tArr)
                // }
            }
            len--;
        }
        for (var i = resArr.length - 1; i >= 0; i--) {
            retArray.push({cardType: type, cards: resArr[i]});
        }
    }
    var findCardsTypes = function (myCards, isMixed) {
        var inCards = _.clone(myCards);
        if (myCards && myCards.length && _.isNumber(myCards[0])) myCards = toCardsArr(myCards);
        var type = CardType.NONE;
        //var return_eg = [{cardType: 0, cards: []}];


        var retArray = [];
        var laiziArray = [];
        var ci = getMax(myCards, laiziArray);

        if (laiziArray.length > 0) {
            retArray = findCardsTypesByLaizi(myCards, ci, laiziArray)
            if (!isMixed)return retArray;
        }

        var arr0 = ci[0] || [];
        var arr1 = ci[1] || [];
        var arr2 = ci[2] || [];
        var arr3 = ci[3] || [];

        // var startCardid = cardsType.cardArr[0];
        type = CardType.gui5
        do {
            switch (type) {
                case CardType.Wulong:
                    retArray.push({
                        cardType: CardType.Wulong,
                        cards: inCards
                    })
                case CardType.Double:
                    _addSameCardIn(myCards, ci, retArray, 2, type);
                    break;
                case CardType.Three:
                    _addSameCardIn(myCards, ci, retArray, 3, type);
                    break;
                case CardType.TwoDui:
                    var duiArray = [];
                    _addSameCardIn(myCards, ci, duiArray, 2, CardType.Double);
                    for (var i = 0; i < duiArray.length; i += 2) {
                        if (!!duiArray[i] && !!duiArray[i + 1]) {
                            retArray.push({
                                cardType: CardType.TwoDui,
                                cards: duiArray[i].cards.concat(duiArray[i + 1].cards)
                            })
                        }
                    }
                    break;
                case CardType.Bomb:
                    _addSameCardIn(myCards, ci, retArray, 4, type);
                    break;
                case CardType.Shunzi:
                    _addShunziCardIn(myCards, retArray, 5, type);
                    break;
                case CardType.TongHua:
                    _addSameHuaIn(myCards, retArray, 5, type);
                    break;
                case CardType.TongHuaShun:
                    _addSameHuaShunIn(myCards, retArray);
                    break;
                case CardType.FullHouse:
                    var duiArr = [];
                    var threeArr = [];
                    _addSameCardIn(myCards, ci, duiArr, 2, CardType.Double);
                    _addSameCardIn(myCards, ci, threeArr, 3, CardType.Three);
                    for (var i = 0; i < threeArr.length; i++) {
                        for (var j = 0; j < duiArr.length; j++) {
                            if (Card.getValue(threeArr[i].cards[0]) != Card.getValue(duiArr[j].cards[0])) {
                                retArray.push({
                                    cardType: CardType.FullHouse,
                                    cards: threeArr[i].cards.concat(duiArr[j].cards)
                                })
                            }
                        }
                    }
                    break;
                case CardType.FiveBomb:
                    _addSameCardIn(myCards, ci, retArray, 5, type);
                    break;

                default:
                    break;
            }
            type--;
        } while (type > CardType.NONE);

        // for (var i = 0; i < retArray.length; i++) {
        //     var obj = retArray[i];
        //     _toChinese(obj.cards);
        // }
        // console.log(retArray);

        return retArray;
    }
    var _addShunziCardInByLaizi = function (myCards, retArray, len, type, laiziArr) {
        var valMap = {};
        var laiziLength = laiziArr.length == 1 ? 1 : 2
        for (var i = 0; i < myCards.length; i++) {
            if (myCards[i].isLaizi)continue;
            valMap[myCards[i].value] = myCards[i];
            if (myCards[i].value == 1) {
                valMap[14] = myCards[i];//A相当于14 放进去 为 10 J Q K A
            }
        }
        var laiziInCount = 0;
        var shunziArr = [];
        var lastNumber = 0;
        for (var i = 1; i <= 10; i++) {//两张癞子 优先顺子
            for (var j = 0; j < 5; j++) {
                if (valMap[i + j]) {
                    lastNumber = valMap[i + j];
                    shunziArr.push(valMap[i + j])
                } else {
                    if (shunziArr.length !== 0) {
                        if (laiziInCount < laiziLength) {
                            shunziArr.push(new Card('' + laiziArr[laiziInCount] + _id2two(lastNumber.number + 4)))
                            laiziInCount++;
                            lastNumber = new Card(_id2two(lastNumber.number + 4));
                        } else {
                            break;
                        }
                    } else {
                        //癞子开头 需要根据后面的牌进行替代
                        for (var x = 1; x <= laiziLength - laiziInCount; x++) {
                            if (valMap[i + j + x]) {
                                var realCard = valMap[i + j + x]
                                shunziArr.push(new Card('' + laiziArr[laiziInCount] + _id2two(realCard.number - 4 * x)))
                                laiziInCount++;
                                lastNumber = new Card(_id2two(realCard.number - 4 * x));
                                break;
                            }
                        }
                    }
                }
            }
            if (shunziArr.length == 5) {
                //如果是癞子开头 将牌型向后调整 （比如 53，53，11，12，13  调整为  53，11，12，13，A）
                if (shunziArr[0].isLaizi) {
                    while (shunziArr[0].value < 10 && shunziArr[0].isLaizi && shunziArr[0].value != 1) {
                        var oldCard = shunziArr.shift();
                        var newCard = new Card(parseInt('' + oldCard.laiziVal + _id2two(shunziArr[shunziArr.length - 1].number + 4)));
                        oldCard.initnumber = newCard.initnumber
                        oldCard.value = newCard.value;
                        oldCard.number = newCard.number;
                        shunziArr.push(oldCard);
                    }
                }
                var idArr = []
                for (var j = 0; j < 5; j++) {
                    idArr.push(shunziArr[j].initnumber ? shunziArr[j].initnumber : shunziArr[j].number);
                }
                retArray.push({cardType: type, cards: idArr});

            }
            shunziArr = [];
            laiziInCount = 0;
            lastNumber = 0;
        }

    }
    var _addSameHuaShunInByLaizi = function (myCards, retArray, laiziArray) {
        var huaMap = {};
        for (var i = 0; i < myCards.length; i++) {
            if (!huaMap[myCards[i].type]) {
                huaMap[myCards[i].type] = [];
            }
            huaMap[myCards[i].type].push(myCards[i]);
        }
        for (var i = 1; i <= 4; i++) {
            var typeList = huaMap[i];
            if (typeList) {
                typeList.sort(function (o1, o2) {
                    return o1.number - o2.number;
                })
                _addShunziCardInByLaizi(typeList, retArray, 5, CardType.TongHuaShun, laiziArray);
            }
        }
    }
    var findCardsTypesByLaizi = function (myCards, ci, laiziArray) {
        var retArray = [];
        var type = CardType.gui5
        do {
            switch (type) {
                case CardType.Double:
                    _addSameCardIn(myCards, ci, retArray, 1, type, laiziArray.slice(0, 1));
                    break;
                case CardType.Three:
                    for (var i = 1; i <= 2; i++) {
                        if (i > laiziArray.length) {
                            break;
                        }
                        var laiziIn = laiziArray.slice(0, i);
                        _addSameCardIn(myCards, ci, retArray, 3 - i, type, laiziIn);
                    }
                    break;
                case CardType.Bomb:
                    for (var i = 1; i <= 3; i++) {
                        if (i > laiziArray.length) {
                            break;
                        }
                        var laiziIn = laiziArray.slice(0, i);
                        _addSameCardIn(myCards, ci, retArray, 4 - i, type, laiziIn);
                    }
                    break;
                case CardType.FiveBomb:
                    for (var i = 1; i <= 4; i++) {
                        if (i > laiziArray.length) {
                            break;
                        }
                        var laiziIn = laiziArray.slice(0, i);
                        _addSameCardIn(myCards, ci, retArray, 5 - i, type, laiziIn);
                    }
                    break;
                case CardType.TwoDui:
                    var duiArray = ci[1];
                    var danArray = ci[0];
                    for (var i = 1; i <= 2; i++) {
                        if (i == 1) {//对1 单1
                            for (var x = 0; x < duiArray.length; x++) {
                                for (var y = 0; y < danArray.length; y++) {
                                    var tfArray1 = getEqualSortValueCards(myCards, duiArray[x]);
                                    var tfArray2 = getEqualSortValueCards(myCards, danArray[y]);
                                    var cards = [];
                                    cards.push(tfArray1[0].number)
                                    cards.push(tfArray1[1].number)
                                    cards.push(tfArray2[0].number)
                                    cards.push(parseInt('' + laiziArray[0] + _id2two(tfArray2[0].number)))
                                    retArray.push({
                                        cardType: CardType.TwoDui,
                                        cards: cards
                                    })
                                }
                            }
                        } else {
                            if (i > laiziArray.length) {
                                break;
                            }
                            for (var x = 0; x < danArray.length; x += 2) {
                                if (!!danArray[x] && !!danArray[x + 1]) {
                                    var tfArray1 = getEqualSortValueCards(myCards, danArray[x]);
                                    var tfArray2 = getEqualSortValueCards(myCards, danArray[x + 1]);
                                    var cards = []
                                    cards.push(tfArray1[0].number)
                                    cards.push(parseInt('' + laiziArray[0] + _id2two(tfArray1[0].number)))
                                    cards.push(tfArray2[0].number)
                                    cards.push(parseInt('' + laiziArray[1] + _id2two(tfArray2[0].number)))
                                    retArray.push({
                                        cardType: CardType.TwoDui,
                                        cards: cards
                                    })
                                }
                            }
                        }
                    }
                    break;
                case CardType.Shunzi:
                    // _addShunziCardIn(myCards, retArray, 5, type);
                    _addShunziCardInByLaizi(myCards, retArray, 5, type, laiziArray);
                    break;
                case CardType.TongHua:
                    _addSameHuaIn(myCards, retArray, 5, type, laiziArray);
                    break;
                case CardType.TongHuaShun:
                    _addSameHuaShunInByLaizi(myCards, retArray, laiziArray);
                    break;
                case CardType.FullHouse:
                    for (var q = 1; q <= 2; q++) {
                        if (q == 1) {// 两对给整成葫芦
                            var duiArray = [];
                            _addSameCardIn(myCards, ci, duiArray, 2, CardType.Double);
                            for (var i = 0; i < duiArray.length; i += 2) {
                                if (!!duiArray[i] && !!duiArray[i + 1]) {
                                    var cards = duiArray[i].cards.concat(duiArray[i + 1].cards);
                                    cards.push(parseInt('' + laiziArray[0] + _id2two(duiArray[i + 1].cards[0])));
                                    retArray.push({
                                        cardType: CardType.FullHouse,
                                        cards: cards
                                    })
                                }
                            }
                        } else if (q == 2) {//两个以上癞子时候 所有情况都可以比该牌型大 没必要写逻辑 TODO

                        }
                    }
                    break;

                default:
                    break;
            }
            type--;
        } while (type > CardType.NONE);
        // console.log(retArray);
        return retArray;
    }

    var judgeType = function (myCards) {
        var tMyCards = _.clone(myCards);
        var laiziCount = 0;
        for (var i = 0; i < myCards.length; i++) {
            if (myCards[i] > 100 || myCards[i] == 53 || myCards[i] == 54) {
                laiziCount++;
            }
        }
        var types = findCardsTypes(myCards);
        types.sort(function (a, b) {
            return b.cardType - a.cardType;
        })
        //过滤掉癞子不全的提示
        for (var i = 0; i < types.length; i++) {
            var laiNum = 0;
            var cards = types[i].cards;
            for (var j = 0; j < cards.length; j++) {
                if (cards[j] > 100 || cards[j] == 53 || cards[j] == 54) {
                    laiNum++;
                }
            }
            if (laiNum != laiziCount) {
                // console.log("shanchu -》" + JSON.stringify(types[i]));
                types.splice(i, 1);
                i--;
            }
        }
        //加入缺失的牌
        if (types[0]) {
            var maxType = -1;
            for (var x = 0; x < types.length; x++) {
                if (maxType <= types[x].cardType) {
                    // console.log("加入缺失的牌  -->>>>" + x);
                    maxType = types[x].cardType
                    var cards = types[x].cards;
                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i] > 100 || cards[i] == 53 || cards[i] == 54) {

                        } else {
                            cards.splice(i, 1)
                            i--;
                        }
                    }
                    // var tCards = _.clone(myCards);
                    // console.log("原来手牌" + JSON.stringify(tMyCards));
                    for (var i = 0; i < tMyCards.length; i++) {
                        if (tMyCards[i] > 100 || tMyCards[i] == 53 || tMyCards[i] == 54) {
                        } else {
                            cards.push(tMyCards[i])
                        }
                    }
                    // if (cards.length != tMyCards.length) {
                    //     cc.error('错误')
                    //     console.log(types[x]);
                    //     console.log(myCards);
                    // }
                } else {
                    types.splice(x, types.length);
                    break;
                }
            }

        }
        //同牌型 将大的筛选出来
        // console.log(JSON.stringify(types));
        var maxTypes = null;
        if (types[0]) {
            maxTypes = getMaxTypeCards(types, types[0].cardType)
            // console.log("-------" + JSON.stringify(maxTypes));
            if (maxTypes)
                return maxTypes;
        }

        return types;
    }
    var getMaxTypeCards = function (typeCards, type) {
        switch (type) {
            case CardType.Double :
                // console.log("getMaxTypeCards");
                var bigDuiValue = -1;
                var idx = -1;
                for (var i = 0; i < typeCards.length; i++) {
                    var ci = getMax(typeCards[i].cards);
                    if (ci[1].length > 0 && (ci[1][0] > bigDuiValue && bigDuiValue != 1 || ci[1][0] == 1)) {
                        bigDuiValue = ci[1][0];
                        idx = i;
                    }
                }
                if (idx >= 0)
                    return [typeCards[idx]];
                break;
            case CardType.FullHouse :    // 葫芦
                var bigDuiValue = -1;
                var idx = -1;
                for (var i = 0; i < typeCards.length; i++) {
                    var ci = getMax(typeCards[i].cards);
                    if (ci[2].length > 0 && (ci[2][0] > bigDuiValue && bigDuiValue != 1 || ci[2][0] == 1)) {
                        bigDuiValue = ci[2][0];
                        idx = i;
                    }
                }
                if (idx >= 0)
                    return [typeCards[idx]];
                break;
            case CardType.TongHua :

                break;
            // case CardType.Wulong :
            // case CardType.TwoDui :
            // case CardType.Three :      // 三张
            // case CardType.Shunzi :     // 顺子
            // case CardType.TongHua :   // 同花
            // case CardType.FullHouse :    // 葫芦
            // case CardType.Bomb :        // 炸弹、铁枝
            // case CardType.TongHuaShun :  // 同花顺
            // case CardType.FiveBomb:
        }

    }

    return {
        CardType: CardType
        , Card: Card
        , initCards: initCards,
        showCardsInfo: showCardsInfo,
        showAllCardsInfo: showAllCardsInfo,
        setPaiFrame: setPaiFrame,
        judgeBaseType: judgeBaseType,
        _change2ImageID: _change2ImageID,
        _toChinese: _toChinese
        , getSpecialTypeName: getSpecialTypeName
        , findCardsType: findCardsTypes
        , judgeType: judgeType
    }
}();