/**
 * Created by hjx on 2018/4/16.
 */
/////////牌
////////分为四位数
/////千位数       表示颜色(1 红色  2 黑色)
/////百位数       表示牌型(如:一六（高脚）7点，大七（三四）7点)
/////后两位数       表示牌值

    //（1）天牌：红，12点——6点红6点黑           1112
//（2）地牌：红，2点——2点全红             1102
//（3）丁丁：红，3点——1点红2点黑            1103
//（4）长二：黑，4点——4点全黑             2104
//（5）和牌：红，4点——1点红3点黑            1104
//（6）拐子：黑，5点——5点全黑             2205
//（7）幺四：红，5点——5点全红             1105
//（8）长三：黑，6点——6点全黑             2306
//（9）二红：红，6点——2点红4点黑            1106
//（10）猫猫：红，6点——1点红5点黑           1206
//（11）二五：黑，7点——7点全黑（2+5）         2307
//（12）一六（高脚）：红，7点——1点红6点黑     1107
//（13）大七（三四）：红，7点——3点黑4点红     1207
//（14）三五：黑，8点——8点全黑（3+5）         2208
//（15）胖子（平八）：黑，8点——8点全黑（2+6）   2308
//（16）人牌：红，8点——8点全红                1108
//（17）臭九（黑九）：黑，9点——9点全黑          2209
//（18）红九：红，9点——4点红5点黑           1109
//（19）梅十（梅子）：黑，10点——10点全黑     2210
//（20）苕十（四六）：红，10点——4点红6点黑    1110
//（21）斧头：黑，11点——11点全黑           2111
// 听                              1
// 财                              2


var kaokaoRule = function () {
        /**
         * 颜色(1 红色  2 黑色)
         * 牌型(如:一六（高脚）7点，大七（三四）7点)
         * 牌值
         * @param number
         * @constructor
         */
        var _cardInfoMap = {
            0: ['bgBack_short', '无效牌'],
            1: ['tingyong', '听'],
            2: ['caishen', '财'],
            1112: ['tianpai', '天牌'],
            1102: ['dipai', '地牌'],
            1103: ['dingding', '丁丁'],
            2104: ['bandeng', '长二(板凳)'],
            1104: ['hepai', '和牌'],
            2205: ['guaizi', '拐子'],
            1105: ['yaosi', '幺四'],

            2306: ['changsan', '长三'],
            1106: ['erhong', '二红'],
            1206: ['maomao', '猫猫'],

            2307: ['erwu', '二五'],
            1107: ['gaojiao', '一六（高脚）'],
            1207: ['sansi', '大七（三四）'],
            2208: ['sanwu', '三五'],
            2308: ['pingba', '胖子（平八）'],
            1108: ['renpai', '人牌'],
            2209: ['heijiu', '臭九（黑九）'],
            1109: ['hongjiu', '红九'],

            2210: ['meizi', '梅十（梅子）'],
            1110: ['siliu', '苕十（四六）'],
            2111: ['fuzi', '斧头'],
        };

        var CP_HU = 0x1;    //胡 1
        var CP_PENG = 0x8;    //碰 8
        var CP_CHI = 0x10;    //吃 16
        var CP_AN = 0x20;    //暗 32

        var _loadAllCard = function () {
            var cache = {};
            for (var key in _cardInfoMap) {
                if (_cardInfoMap.hasOwnProperty(key)) {
                    cache[key] = new Card(key);
                }
            }
            return cache;
        }
        var _getNameByID = function (id) {
            return _cardInfoMap[id] ? _cardInfoMap[id][1] : "错误";
        }
        var _getResNameByID = function (id) {
            return _cardInfoMap[id] ? _cardInfoMap[id][0] : "错误";
        }
        /**
         * 牌定义
         * @param number
         * @returns {{id: Number, value: number, red: boolean, type: number, name, resName: string}}
         * @constructor
         */
        var Card = function (number) {
            var id = parseInt(number);
            var value = id % 100;
            var red = Math.floor(id / 1000) == 1;
            var type = Math.floor(id / 100);
            var name = _getNameByID(id);
            var resName = _getResNameByID(id);
            return {
                id: id, value: value, red: red, type: type, name: name, resName: resName + ".png"
            };
        }

        // 1 吃  2 碰 3 暗
        var getCardsByType = function (data, type) {
            if (!data || !type)
                return [];

            var ret = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].Type == type) {
                    ret.push(data[i])
                }
            }

            return ret;
        }

        /**
         * 处理广播信息
         * @param cmd
         * @returns {{uid: *, cmd: *, opt: Number, cards: Array}}
         */
            // [41/EatCard/32/1107,1107,1107/2]
        var executeBroadCastCmd = function (cmd) {
                if (!cmd || cmd.length < 3) {
                    cc.error("广播消息错误--》" + cmd);
                    return;
                }
                var uid = cmd[0];
                var cmd1 = cmd[1];
                var opt = parseInt(cmd[2]);
                var cards = cmd[3].split(',');
                return {uid: uid, cmd: cmd1, opt: opt, cards: cards};
            }

        /**
         * 牌型匹配 结合与拆散匹配牌型
         * @type {{1: number, 2: number, 3: number, 4: number, 5: number, 6: number, 7: number}}
         */
        var CARDS_MATCH_CONFIG = {1: 1, 2: 12, 3: 11, 4: 10, 5: 9, 6: 8, 7: 7};
        var CARDS_HEIGHT_COUNT = 4;
        //拆开多于列长度的牌型 合并拆开的牌型
        var _splitAndUnionTypeCards = function (cards1, origin) {
            var _obj = {};
            for (var i = 0; i < cards1.length; i++) {
                _obj[cards1[i].id] = _obj[cards1[i].id] || [];
                _obj[cards1[i].id].push(cards1[i])
            }
            // console.log(_obj);
            var res = [];
            for (var key in _obj) {
                if (_obj.hasOwnProperty(key)) {
                    res.push(_obj[key])
                }
            }

            //按照牌量排序 相同多的列靠左侧放置 为后面单牌插入做铺垫
            res.sort(function (arr1, arr2) {
                return arr2.length - arr1.length;
            })

            // console.log(JSON.stringify(res));
            //合并相同的对牌
            if (res.length >= 2) {
                var duiIdxs = [];//存储对牌的索引
                var singleIdxs = [];//存储单牌的索引
                for (var i = 0; i < res.length; i++) {
                    if (res[i].length == 2) {
                        duiIdxs.push(i);
                    }
                }
                //如果对牌存在多个 则将二者合为一列
                if (duiIdxs.length >= 2) {
                    // console.log("dui ----")
                    for (var i = 0; i < duiIdxs.length; i += 2) {
                        var idx1 = duiIdxs[i];
                        var idx2 = duiIdxs[i + 1];
                        if (idx1 != undefined && idx2 != undefined) {
                            if (idx2 >= 0) {
                                res[idx1] = res[idx1].concat(res[idx2])
                                res.splice(idx2, 1);
                                for (var j = idx2; j < duiIdxs.length; j++) {
                                    duiIdxs[j]--;
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < res.length; i++) {
                    if (res[i].length == 1) {
                        singleIdxs.push(i);
                    }
                }
                //如果单牌存在 则将它合到其他列 优先左侧（即排序好的队列-左侧相同牌多）
                if (singleIdxs.length > 0) {
                    // console.log("single card = " + JSON.stringify(singleIdxs));
                    // console.log(JSON.stringify(res));
                    //单牌 查找未满的列插入 pass自己列
                    for (var i = 0; i < singleIdxs.length; i++) {
                        var idx = singleIdxs[i];
                        if(idx<0)continue;
                        for (var j = 0; j < res.length; j++) {
                            if (res[j].length >= 4 || j == idx)
                                continue;//该列大于4 或者 就是该单列
                            if(res[idx] && res[idx].length!=1){
                                continue;//该列不在报单的时候继续循环
                            }
                            res[j] = res[j].concat(res[idx])
                            res.splice(idx, 1);
                            // console.log(idx + "== to ==" + j);
                            // console.log(JSON.stringify(res));
                            for (var x = i+1; x < singleIdxs.length; x++) {
                                singleIdxs[x]--;
                                // console.log("---");
                            }
                            // console.log("single arr = " + JSON.stringify(singleIdxs));
                            break;
                        }
                    }
                    // console.log("later -- " + JSON.stringify(res));
                }

                for (var i = 0; i < res.length; i++) {
                    if (res[i].length > 0)
                        origin.push(res[i]);
                }
            }

        }
        /**
         * 合并牌型
         * @param map
         * @param idx
         * @returns {*}
         * @private
         */
        var _unionMatchCards = function (map, idx) {
            var matchIdx = CARDS_MATCH_CONFIG[idx];
            var cards1 = map[idx];
            var cards2 = map[matchIdx];
            if (idx == matchIdx) {//7 的时候   7与7匹配 需要特殊处理
                var ret = [];
                if (cards1.length > CARDS_HEIGHT_COUNT) {//拆开
                    _splitAndUnionTypeCards(cards1, ret);
                }else{
                    for (var i = 0; i < cards1.length; i += CARDS_HEIGHT_COUNT) {
                        ret.push(cards1.slice(i, i + CARDS_HEIGHT_COUNT));
                    }
                }
                return ret;
            }
            if (cards1.length + cards2.length <= CARDS_HEIGHT_COUNT) {
                return [cards1.concat(cards2)];
            } else {
                var ret = [];
                var push1, push2 = false;
                //否则两种组合大于一列最大容量 存在一样牌本身就大于容量
                if (cards1.length > CARDS_HEIGHT_COUNT) {//拆开
                    _splitAndUnionTypeCards(cards1, ret);
                    push1 = true;
                }
                if (cards2.length > CARDS_HEIGHT_COUNT) {//拆开
                    _splitAndUnionTypeCards(cards2, ret);
                    push2 = true;
                }
                //未拆分的列 直接加入返回值
                if (!push1) ret.push(cards1)
                if (!push2) ret.push(cards2)
                return ret;
            }
        }
        /**
         * 传入自己手牌二维数组 通过牌id判断需要插入的位置信息
         * @param cards
         * @param id
         * @returns {*}
         */
        var getAddCardToIdx = function (cards, id) {
            // console.log(cards);
            console.log("getAddCardToIdx   " + id + "   " + JSON.stringify(cards));
            var card = new Card(id);
            var cardsArr = cards.map(function (arr) {
                return arr.map(function (item) {
                    return new Card(item);
                });
            })


            if (card.type == 0) {
                if (cardsArr[0][0] && cardsArr[0][0].type == 0 && cardsArr[0].length < CARDS_HEIGHT_COUNT) {
                    return {x: 0, y: cardsArr[0].length};
                }
                return {x: -1, y: 0};
            }

            // var sameCount = _.filter(cards, function (val) {
            //     return parseInt(val) == parseInt(id);
            // }).length;
            var sameCount = 0;
            for (var i = 0; i < cardsArr.length; i++) {
                for (var j = cardsArr[i].length - 1; j >= 0; j--) {
                    var tcard = cardsArr[i][j];
                    if (parseInt(tcard.id) == parseInt(id))
                        sameCount++;
                }
            }
            if (sameCount >= 4)//此时除非牌数量不对 否则不会出现大于等于4
                return {x: -1, y: 0};

            if (sameCount > 0) {
                for (var i = 0; i < cardsArr.length; i++) {
                    //2018年05月16日11:23:55 支持插入满列 产生列之间挪牌--
                    // if (cardsArr[i].length == CARDS_HEIGHT_COUNT)
                    //     continue;
                    for (var j = cardsArr[i].length - 1; j >= 0; j--) {
                        var tcard = cardsArr[i][j];
                        if (tcard) {
                            if (tcard.id == card.id) {
                                return {x: i, y: j + 1};
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < cardsArr.length; i++) {
                if (cardsArr[i].length == CARDS_HEIGHT_COUNT)
                    continue;
                for (var j = cardsArr[i].length - 1; j >= 0; j--) {
                    var tcard = cardsArr[i][j];
                    if (tcard) {
                        if (tcard.value + card.value == 14) {
                            return {x: i, y: j + 1};
                        }
                    }
                }
            }
            //此处 找不到成牌 找不到一样的牌 寻找合理位置放牌
            for (var i = cardsArr.length - 1; i >= 0; i--) {
                var tcard = cardsArr[i][0];
                if (tcard && tcard.value) {
                    var val1 = CARDS_MATCH_CONFIG[tcard.value] || tcard.value;
                    var val2 = CARDS_MATCH_CONFIG[card.value] || card.value;
                    if (val1 > val2) {
                        console.log("1确定放置列" + i + "   " + val1 + " " + val2);
                        return {x: i + 1, y: 0, newline: true};
                    } else if (val1 == val2 && cardsArr[i].length < CARDS_HEIGHT_COUNT) {
                        console.log("2确定放置列" + i + "   " + val1 + " " + val2);
                        return {x: i, y: cardsArr[i].length};
                    }
                }
            }


            var ret = {x: -1, y: 0};
            // if(ret.x>=10){
            //     cc.error("竟然放置的牌 超过了十列 ");
            //     ret.x = {x:cardsArr.length-1, y:cardsArr[cardsArr.length-1].length};
            // }
            return ret;
        }

        /**
         * 传入手牌 对手牌进行牌型匹配 排序返回二维数组
         * @param cards
         * @returns {Array}
         */
        var sortCards = function (cards) {
            if (!cards)
                return;
            var ret = [];
            var cardsArr = cards.map(function (id) {
                return new Card(id);
            })
            cardsArr.sort(function (a, b) {
                return ((a.value - b.value) == 0) ? (a.id - b.id) : (a.value - b.value);
            })
            //听 财神 提出来放最左边
            //凑14原则  优先左边小牌匹配牌型 相同牌型可以堆积 但是不能超过4张
            //固定牌型顺序 2`12 -> 3`11 -> 4`10 -> 5`9 -> 6`8 -> 7`7
            //
            var map = {};
            for (var i = 1; i <= 12; i++) {
                map[i] = [];
            }
            for (var i = 0; i < cardsArr.length; i++) {
                if (cardsArr[i].type == 0) {
                    map[1].push(cardsArr[i])
                    continue;
                }
                map[cardsArr[i].value].push(cardsArr[i])
            }
            for (var key in CARDS_MATCH_CONFIG) {
                var res = _unionMatchCards(map, key)
                //如果有单牌 找牌型插入
                // console.log("如果有单牌 找牌型插 " + key);
                // console.log(JSON.stringify(res));
                var singleIdxs = [];
                for (var i = 0; i < res.length; i++) {
                    if (res[i].length == 1)
                        singleIdxs.push(i);
                }
                for (var j = 0; j < singleIdxs.length; j++) {
                    var s = singleIdxs[j];
                    for (var y = 0; y < res.length; y++) {
                        if(y==s)continue;
                        if (res[y].length > 0 && res[y].length < 4 && res[y][0].value + res[s][0].value == 14) {
                            res[y] = res[y].concat(res[s])
                            res.splice(s, 1);
                            for (var x = j; x < singleIdxs.length; x++) {
                                singleIdxs[x]--;
                                // console.log("111---");
                            }
                            break;
                        }
                    }
                }


                // console.log("===");


                for (var i = 0; i < res.length; i++) {
                    if (res[i].length == 0)
                        continue;
                    ret.push(res[i]);
                }
                // console.log(res);

            }
            //对牌型进行错位调整大牌挪到右边 2018年05月30日11:01:01注释掉大牌后移 大牌小牌能匹配的放一起
            // for (var i = 0; i < ret.length; i++) {
            //     if (!CARDS_MATCH_CONFIG[ret[i][0].value]) {
            //         for (var j = i; j < ret.length; j++) {
            //             if (ret[i][0].value > ret[j][0].value) {
            //                 var temp = ret[i];
            //                 ret[i] = ret[j];
            //                 ret[j] = temp;
            //             }
            //         }
            //     }
            // }
            // if(!cc.sys.isNative){
            //     for(var i=0; i<ret.length; i++){
            //         var str = "";
            //         for(var j=0; j<ret[i].length; j++){
            //             str+= (" "+ret[i][j].id );
            //         }
            //         console.log(str);
            //     }
            // }
            // console.log(ret);
            var retObj = ret.map(function (arr) {
                return arr.map(function (item) {
                    return item.id;
                });
            });
            if (retObj.length > 10) {
                //cc.error('竟然超过10列牌');
                retObj = [];
                for (var i = 0; i < cards.length; i += 4) {
                    var id = cards[i];
                    if (id) {
                        var arr = [];
                        for (var j = 0; j < 4; j++) {
                            if (cards[i + j])
                                arr.push(cards[i + j]);
                        }
                        retObj.push(arr);
                    } else {
                        break;
                    }
                }
            }

            //console.log(JSON.stringify(retObj));
            return retObj;
        }

        /**
         * 获取牌型对应的分数 此分数与自己是否可以胡牌有关系
         * 亮出来的牌 3张一样的红算8    3张一样的黑算4
         * 亮出来的吃有一张红算1    手牌有一张红算1
         * 亮出来4张红算10 黑算6
         */
        var getPointByCards = function (myCards, openCards) {
            // console.log(JSON.stringify(myCards));
            // console.log(JSON.stringify(openCards));
            var point = 0;
            //统计手牌
            if (myCards) {
                for (var i = 0; i < myCards.length; i++) {
                    var card = new Card(myCards[i]);
                    if (card.red) {
                        point++;
                    }
                }
            }
            if (!openCards) {
                return point;
            }
            //统计成牌
            for (var i = 0; i < openCards.length; i++) {
                var obj = openCards[i];
                if (obj.Type == 0) {//听用财神
                    continue;
                }
                //1 吃  2 碰 3 暗
                if (obj.Type == 1) {
                    for (var j = 0; j < obj.Cards.length; j++) {
                        var card = new Card(obj.Cards[j]);
                        if (card.red) {
                            point++;
                        }
                    }
                }
                if (obj.Type == 2) {
                    if (obj.Cards.length == 3) {
                        var card = new Card(obj.Cards[0]);
                        if (card.red) {
                            point += 8;
                        } else {
                            point += 4;
                        }
                    }
                }
                if (obj.Type == 3) {
                    if (obj.Cards.length == 3) {
                        var card = new Card(obj.Cards[0]);
                        if (card.red) {
                            point += 8;
                        } else {
                            point += 4;
                        }
                    } else if (obj.Cards.length == 4) {
                        var card = new Card(obj.Cards[0]);
                        if (card.red) {
                            point += 10;
                        } else {
                            point += 6;
                        }
                    }
                }
            }
            return point;
        }

        var isHasPengAnCard = function (openCards, id) {
            if (!openCards) {
                return false;
            }
            //统计成牌
            for (var i = 0; i < openCards.length; i++) {
                var obj = openCards[i];
                if (obj.Type == 0 || obj.Type == 1) {
                    continue;
                }
                if (parseInt(obj.Cards[0]) == parseInt(id)) {
                    return true;
                }
            }
        }

        return {
            Card: Card,
            loadAllCard: _loadAllCard,
            getCardsByType: getCardsByType,
            executeBroadCastCmd: executeBroadCastCmd,
            sortCards: sortCards,
            getAddCardToIdx: getAddCardToIdx,
            getPointByCards: getPointByCards,
            isHasPengAnCard: isHasPengAnCard
        };
    }();