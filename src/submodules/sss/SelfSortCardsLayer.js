/**
 * Created by hjx on 2018/9/28.
 */
(function () {
    var exports = this;

    var $ = null;
    var changePosRecord = [];
    var getDaoIdxs = function (idx) {
        var idxs = null;
        if (idx == 1) {
            idxs = [1, 2, 3]
        } else if (idx == 2) {
            idxs = [4, 5, 6, 7, 8]
        } else {
            idxs = [9, 10, 11, 12, 13]
        }
        return idxs;
    }

    var SelfSortCardsLayer = cc.Layer.extend({
        ctor: function (cards, time, data) {
            this._super();
            var that = this;
            console.log(cards);
            this.down_cards = _.clone(cards) || [];
            this.down_cards.sort(function (a, b) {
                if (a <= 4 || a >= 53) {
                    a += 52;
                }
                if (b <= 4 || b >= 53) {
                    b += 52;
                }
                return b - a
            });
            this.up_cards = [];
            for (var i = 0; i < 13; i++) {
                this.up_cards[i] = undefined;
            }
            this.special = data.special;

            var scene = loadNodeCCS(window.sensorLandscape?res.SelfSortCardsLayer_json:res.SelfSortCardsLayer_v_json, this);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('btn_zidonglipai'), function () {
                console.log("自动理牌");
                that.removeFromParent();
            });

            TouchUtils.setOnclickListener($('btn_ok'), function () {
                console.log("确定");
                console.log(that.up_cards)
                for (var i = 0; i < 13; i++) {
                    if (!that.up_cards) {
                        alert1('请选择完整牌型');
                        return;
                    }
                }
                var cmd = "Submit/" + gameData.curRound;
                cmd += ( "/" + that.up_cards[0] + ',' + that.up_cards[1] + ',' + that.up_cards[2])
                cmd += ( "/" + that.up_cards[3] + ',' + that.up_cards[4] + ',' + that.up_cards[5] + ',' + that.up_cards[6] + ',' + that.up_cards[7])
                cmd += ( "/" + that.up_cards[8] + ',' + that.up_cards[9] + ',' + that.up_cards[10] + ',' + that.up_cards[11] + ',' + that.up_cards[12])
                network.sendPhz(5000, cmd)

                cc.sys.localStorage.setItem("13shui_shoudonglipai", 1);
            });

            TouchUtils.setOnclickListener($('btn_special'), function () {
                console.log("类型2");
                // var cmd = "Submit/" + gameData.curRound + "/"
                // var shangArr = that.special.cardModel[2].cards
                // var zhongArr = that.special.cardModel[1].cards
                // var xiaArr = that.special.cardModel[0].cards
                //
                // cmd += shangArr.join(',');
                // cmd += ("/" + zhongArr.join(','));
                // cmd += ("/" + xiaArr.join(','));
                // cmd += ("/" + that.special.sp)
                // network.sendPhz(5000, cmd);

                HUD.showConfirmBox('提示', '是否按特殊牌型(' + sssRule.getSpecialTypeName(that.special.sp) + ")出牌？", function () {
                    var cmd = "Submit/" + gameData.curRound + "/"
                    var shangArr = that.special.cardModel[2].cards
                    var zhongArr = that.special.cardModel[1].cards
                    var xiaArr = that.special.cardModel[0].cards

                    cmd += shangArr.join(',');
                    cmd += ("/" + zhongArr.join(','));
                    cmd += ("/" + xiaArr.join(','));
                    cmd += ("/" + that.special.sp)
                    network.sendPhz(5000, cmd);
                }, '确定', function () {

                }, '取消')
            });
            $('btn_special').setVisible(!!this.special)

            $('btn_ok').setVisible(false);
            for (var i = 1; i <= 3; i++) {
                (function (i) {
                    TouchUtils.setOnclickListener($('btn_close' + i), function () {
                        changePosRecord = [];
                        for (var y = 1; y <= 13; y++) {
                            var spBlack = $('pk' + y).getChildByName('black')
                            if (spBlack) {
                                spBlack.setVisible(false);
                            }
                        }

                        console.log("清牌" + i);
                        var idxs = getDaoIdxs(i);
                        var cards = that.getDownCardsArray();
                        for (var x = 0; x < idxs.length; x++) {
                            var pai = $('pk' + idxs[x]);
                            if (pai.isVisible()) {
                                cards.push(pai.id);
                                pai.setVisible(false)
                                that.up_cards[idxs[x] - 1] = undefined;
                            }
                        }
                        $('daotype' + i).setVisible(false)
                        console.log(cards)
                        that.setDownCards(cards)
                        that.initChooseType();
                    });
                    TouchUtils.setOnclickListener($('cardsView' + i), function () {
                        changePosRecord = [];
                        for (var y = 1; y <= 13; y++) {
                            var spBlack = $('pk' + y).getChildByName('black')
                            if (spBlack) {
                                spBlack.setVisible(false);
                            }
                        }
                        console.log("选择第几道 ：" + i);
                        var upPais = [];
                        for (var j = 1; j <= 13; j++) {
                            var pk = $('down_pk' + j);
                            if (pk.isUp && pk.isVisible()) {
                                upPais.push(pk);
                            }
                        }
                        console.log(upPais);
                        var idx = i;
                        var idxs = getDaoIdxs(i);

                        var alreadyHasCount = 0;
                        for (var j = 0; j < idxs.length; j++) {
                            if ($('pk' + idxs[j]).isVisible()) {
                                alreadyHasCount++;
                            }
                        }
                        if (alreadyHasCount + upPais.length > idxs.length) {
                            alert1('牌数量不符合该道');
                            return;
                        }
                        if (upPais.length == 0) {
                            alert1('请先选择牌');
                            return;
                        }
                        that.refreshUpDown(idx, upPais);
                        //如果两道已经满了 剩下的牌 直接加入另一道
                        var otherDao = that.getTwoDaoFullDao()
                        if (otherDao) {
                            that.refreshUpDown(otherDao);
                        }

                        that.setDownCards();
                        that.initChooseType();

                    });
                })(i)
            }


            this.initView();
            this.enableChoosePai();
            this.initChooseType();
            this.showCountDown(0, time);
        },
        refreshUpDown: function (idx, upPais) {
            var idxs = getDaoIdxs(idx);
            var that = this;

            if (!upPais) {
                upPais = [];
                for (var j = 1; j <= 13; j++) {
                    var pk = $('down_pk' + j);
                    if (!pk.isUp && pk.isVisible()) {
                        upPais.push(pk);
                        pk.isUp = true;
                    }
                }
            }

            var y = 0;
            for (var x = 0; x < idxs.length; x++) {
                if (!$('pk' + idxs[x]).isVisible()) {
                    sssRule.setPaiFrame($('pk' + idxs[x]), upPais[y].id);
                    $('pk' + idxs[x]).setVisible(true)
                    $('pk' + idxs[x]).id = upPais[y].id
                    that.up_cards[idxs[x] - 1] = upPais[y].id;
                    y++;
                    if (y >= upPais.length)
                        break;
                }
            }
            that.sortUpCards(idx);

            for (var j = 1; j <= 13; j++) {
                var pk = $('down_pk' + j);
                if (pk.isUp && pk.isVisible()) {
                    pk.setVisible(false)
                    var idx = that.down_cards.indexOf(pk.id)
                    if (idx >= 0) {
                        var t = that.down_cards.splice(idx, 1);
                        console.log("删除——>" + JSON.stringify(t));
                    } else {
                        if (pk.id >= 53) {
                            //癞子牌找不到---代码重定位 TODO
                            for (var x = 0; x < that.down_cards.length; x++) {
                                if (that.down_cards[x] >= 53) {
                                    var t = that.down_cards.splice(x, 1);
                                    console.log("删除——>" + JSON.stringify(t));
                                    break;
                                }
                            }
                        } else {

                            cc.error("错误-》 找不到删除");
                        }
                    }
                }
            }
        },
        getTwoDaoFullDao: function () {
            var fullCount = 0;
            var notFullDao = 0;
            console.log(this.up_cards);
            for (var i = 1; i <= 3; i++) {
                var idxs = getDaoIdxs(i);
                for (var j = 0; j < idxs.length; j++) {
                    if (!this.up_cards[idxs[j] - 1]) {
                        break;
                    }
                }
                if (j == idxs.length) {
                    fullCount++;
                } else {
                    notFullDao = i;
                }
            }
            if (fullCount == 2) {
                console.log("dao ->>>> " + notFullDao);
                return notFullDao;
            }
            console.log(fullCount);
            console.log(notFullDao);
        },
        initView: function () {
            this.originPos = {};
            this.originPkNode = {};

            var that = this;
            for (var i = 0; i < 13; i++) {
                var pk = $('pk' + (i + 1));
                this.originPkNode[i] = pk;
                this.originPos[i] = pk.getPosition();
                // sssRule.setPaiFrame(pk, this.cards[i]);
                // pk.id = this.cards[i]
                pk.setVisible(false);
                (function (pk) {
                    TouchUtils.setOnclickListener(pk, function () {
                        if (pk.getPositionY() < 250)
                            return;
                        var name = pk.getName();
                        var idx = parseInt(name.substring(2, 4));
                        var upPais = that.getDownUpedPais();
                        if(upPais.length==1){
                            that.replaceUpCardWithDownCard(idx-1, parseInt(upPais[0].getName().substring(7, 9))-1)
                            that.setDownCards()
                            that.sortUpCards(1)
                            that.sortUpCards(2)
                            that.sortUpCards(3)
                            return;
                        }

                        if (changePosRecord.indexOf(idx) < 0) {
                            playEffect('vdianpai');
                            changePosRecord.push(idx);
                            if (changePosRecord.length == 2) {
                                that.changeTwoCardsPos(changePosRecord[0] - 1, changePosRecord[1] - 1);
                            } else {
                                var spBlack = pk.getChildByName('black')
                                if (spBlack) {
                                    spBlack.setVisible(true);
                                } else {
                                    spBlack = new cc.Sprite('res/submodules/sss/image/bg/black_card_bg.png');
                                    spBlack.x = 81, spBlack.y = 110;
                                    spBlack.setName('black');
                                    pk.addChild(spBlack, 99);
                                }
                            }
                            that.setDownCards()
                        }

                    }, {swallowTouches: true});
                })(pk)
                //pk.setPosition($('cardsView').x + i * 40 - 6.5 * 40, $('cardsView').y + 50);
            }
            $('daotype' + 1).setVisible(false)
            $('daotype' + 2).setVisible(false)
            $('daotype' + 3).setVisible(false)
            TouchUtils.setOnclickListener($('btn_sort' ), function () {
                console.log("排序---》");
                // that.down_cards.sort(function (a, b) {
                //     return sssRule.Card(a).type  - sssRule.Card(b).type;
                // })
                // for(var i=1;i<=that.down_cards.length; i++){
                //     sssRule.setPaiFrame($('down_pk' + i), that.down_cards[i-1]);
                //     $('down_pk' + i).setOpacity(0)
                //     $('down_pk' + i).runAction(cc.sequence(cc.delayTime(i * 0.06),cc.fadeIn(0.1)));
                // }
                cc.sys.localStorage.setItem('self_sort_func', 'hua')
                that.setDownCards()
                $('btn_sort2' ).setVisible(true);
                $('btn_sort' ).setVisible(false);
            });
            TouchUtils.setOnclickListener($('btn_sort2' ), function () {
                console.log("排序---》");
                cc.sys.localStorage.setItem('self_sort_func', 'value')
                // that.down_cards.sort(function (a, b) {
                //     return a-b;
                // })
                // for(var i=1;i<=that.down_cards.length; i++){
                //     sssRule.setPaiFrame($('down_pk' + i), that.down_cards[i-1]);
                //     $('down_pk' + i).setOpacity(0)
                //     $('down_pk' + i).runAction(cc.sequence(cc.delayTime(i * 0.06),cc.fadeIn(0.1)));
                // }
                that.setDownCards()
                $('btn_sort2' ).setVisible(false);
                $('btn_sort' ).setVisible(true);
            });
            $('btn_sort' ).setVisible(cc.sys.localStorage.getItem('self_sort_func')=='hua');
        },
        replaceUpCardWithDownCard : function (upIdx, downIdx) {
            //up
            var tempCard = this.up_cards[upIdx]
            this.up_cards[upIdx] = this.down_cards[downIdx];
            var pk = $('pk' + (upIdx + 1));
            this.originPkNode[upIdx] = pk;
            sssRule.setPaiFrame(pk, this.up_cards[upIdx])
            pk.id = this.up_cards[upIdx];
            //down
            this.down_cards[downIdx] = tempCard;
            this.setDownCards(this.down_cards);
            // this.upPai(upIdx)
        },
        changeTwoCardsPos: function (srcIdx, tarIdx) {
            var cards = _.clone(this.up_cards);
            var t = cards[srcIdx];
            cards[srcIdx] = cards[tarIdx];
            cards[tarIdx] = t
            // this.refreshView(cards)


            for (var i = 0; i < 13; i++) {
                var pk = $('pk' + (i + 1));
                this.originPkNode[i] = pk;
                sssRule.setPaiFrame(pk, cards[i])
                pk.id = cards[i];
                var spBlack = pk.getChildByName('black')
                if (spBlack) {
                    spBlack.setVisible(false);
                }
            }
            changePosRecord = [];
            for (var y = 1; y <= 13; y++) {
                var spBlack = $('pk' + y).getChildByName('black')
                if (spBlack) {
                    spBlack.setVisible(false);
                }
            }
            this.up_cards = _.clone(cards);

            this.sortUpCards(1)
            this.sortUpCards(2)
            this.sortUpCards(3)
        },

        initChooseType: function () {
            var that = this;
            var cards = [];
            for (var i = 0; i < this.down_cards.length; i++) {
                if (this.down_cards[i] < 100) {
                    cards.push(this.down_cards[i])
                } else {
                    cards.push(Math.floor(this.down_cards[i] / 100))
                }
            }

            var typesArr = sssRule.findCardsType(cards, true);
            var suportMap = {};
            for (var i = 0; i < typesArr.length; i++) {
                var obj = typesArr[i];
                if (!suportMap[obj.cardType]) {
                    suportMap[obj.cardType] = [];
                }
                suportMap[obj.cardType].push(obj);
            }
            var typeIdx = {};
            for (var i = 2; i <= 10; i++) {
                var btn = $('btn' + i);
                (function (btn, type) {
                    Filter.remove(btn);
                    TouchUtils.setOnclickListener(btn, function () {
                        console.log("选择类型：" + type);
                        that.setDownCards();

                        var idxs = that.getIdxByPaiIDs(suportMap[type][typeIdx[type]].cards);
                        console.log(idxs)
                        for (var j = 0; j < idxs.length; j++) {
                            that.upPai(idxs[j]);
                        }
                        typeIdx[type]++;
                        if (typeIdx[type] >= suportMap[type].length) {
                            typeIdx[type] = 0;
                        }
                    });
                })(btn, i)
                if (!suportMap[i]) {
                    Filter.grayScale(btn);
                    TouchUtils.removeListeners(btn);
                }
                typeIdx[i] = 0;
            }
        },
        getIdxByPaiIDs: function (ids) {
            ids = _.clone(ids);
            console.log(ids);
            var ret = [];
            for (var i = 0; i < this.down_cards.length; i++) {
                var id = this.down_cards[i];
                var idx = ids.indexOf(id);
                if (idx >= 0) {
                    ret.push(i + 1);
                    ids.splice(idx, 1);
                } else if (id >= 53) {
                    for (var j = 0; j < ids.length; j++) {
                        if (ids[j] >= 53) {
                            ret.push(i + 1);
                            //cards[i - 1] > 100 ? (Math.floor(cards[i - 1] / 100)) : cards[i - 1]
                            sssRule.setPaiFrame($('down_pk' + (i + 1)), ids[j] > 100 ? (Math.floor(ids[j] / 100)) : ids[j]);
                            $('down_pk' + (i + 1)).id = ids[j]
                            console.log("第 " + (i + 1) + " 牌 设置：" + ids[j]);
                            ids.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            if (ids.length > 0) {
                cc.error("找不到牌" + ids[0]);

            }
            return ret;
        },
        upPai: function (idx, isGoUp) {
            var pai = $('down_pk' + idx);
            if (pai.isPass)
                return;
            if (pai.isUp) {
                if(window.sensorLandscape){
                    pai.setPositionY(144)
                }else{
                    pai.setPositionX(745)
                }
                pai.isUp = false;
                pai.isPass = true;
                return;
            }
            window.sensorLandscape?pai.setPositionY(160):pai.setPositionX(730)
            pai.isPass = true;
            pai.isUp = true;

            if(isGoUp){
                console.log("去上头 !!!");
                if(changePosRecord && changePosRecord.length==1){
                    var that = this;
                    this.scheduleOnce(function () {
                        that.replaceUpCardWithDownCard(changePosRecord[0]-1, idx-1)
                        changePosRecord = [];
                        for (var y = 1; y <= 13; y++) {
                            var spBlack = $('pk' + y).getChildByName('black')
                            if (spBlack) {
                                spBlack.setVisible(false);
                            }
                        }
                        that.sortUpCards(1)
                        that.sortUpCards(2)
                        that.sortUpCards(3)
                    },0.1)

                }
            }
        },
        enableChoosePai: function () {
            var that = this;
            var centerPos = window.sensorLandscape?$('cardsView').x:$('cardsView').y;
            window.sensorLandscape?$('down_pk1').setPosition(centerPos + 1 * 75 - 8 * 75, 144):$('down_pk1').setPosition(745, centerPos + 1 * 50 - 7 * 50);
            $('down_pk1').id = that.down_cards[0]
            sssRule.setPaiFrame($('down_pk1'), that.down_cards[0] > 100 ? (Math.floor(that.down_cards[0] / 100)) : that.down_cards[0])
            for (var i = 2; i <= 13; i++) {
                var pk = duplicateSprite($('down_pk1'));
                pk.setName('down_pk' + i);
                if(window.sensorLandscape){
                    pk.setPosition(centerPos + i * 75 - 8 * 75, 144);
                }else{
                    pk.setRotation(-90)
                    pk.setPosition(745, centerPos + i * 50 - 7 * 50);
                }

                //that.down_cards[i - 1] > 100 ? (Math.floor(that.down_cards[i - 1] / 100)) : that.down_cards[i - 1]
                sssRule.setPaiFrame(pk, that.down_cards[i - 1] > 100 ? (Math.floor(that.down_cards[i - 1] / 100)) : that.down_cards[i - 1])
                pk.id = that.down_cards[i - 1]
                $('down_pk1').getParent().addChild(pk);
            }
            console.log('enableChoosePai');
            console.log(that.down_cards)

            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    console.log("------")
                    for (var i = 13; i > 0; i--) {
                        var pai = $('down_pk' + i);
                        pai.isPass = false;
                    }
                    for (var i = 13; i > 0; i--) {
                        var pai = $('down_pk' + i);
                        if (TouchUtils.isTouchMe(pai, touch, event, null)) {
                            that.upPai(i, true)
                            return true;
                        }
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    for (var i = 13; i > 0; i--) {
                        var pai = $('down_pk' + i);
                        if (TouchUtils.isTouchMe(pai, touch, event, null)) {
                            that.upPai(i)
                            return;
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    for (var i = 13; i > 0; i--) {
                        var pai = $('down_pk' + i);
                        if (TouchUtils.isTouchMe(pai, touch, event, null)) {
                            that.upPai(i)
                            return;
                        }
                    }
                }
            });

            cc.eventManager.addListener(chupaiListener, $('cardsView'));
        },
        getDownUpedPais : function () {
            var pais = [];
            for (var i = 1; i <= 13; i++) {
                var pai = $('down_pk' + i);
                if (pai.isVisible() && pai.isUp) {
                    pais.push(pai)
                }
            }
            return pais;
        },
        getDownCardsArray: function () {
            var ids = [];
            for (var i = 1; i <= 13; i++) {
                var pai = $('down_pk' + i);
                if (pai.isVisible()) {
                    ids.push(pai.id)
                }
            }
            return ids;
        },
        setDownCards: function (cards) {
            cards = cards || this.down_cards
            var sortType = cc.sys.localStorage.getItem('self_sort_func') || 'value';
            if(sortType=='value'){
                cards.sort(function (a, b) {
                    if (a <= 4 || a >= 53) {
                        a += 52;
                    }
                    if (b <= 4 || b >= 53) {
                        b += 52;
                    }
                    return b - a
                });
            }else{

                cards.sort(function (a, b) {
                    var aa = a;
                    var bb = b;
                    if (a <= 4 || a >= 53) {
                        a += 52;
                    }
                    if (b <= 4 || b >= 53) {
                        b += 52;
                    }
                    return sssRule.Card(b).type*100  - sssRule.Card(a).type*100 + (bb-aa);
                })
            }


            for (var i = 1; i <= 13; i++) {
                var pai = $('down_pk' + i);
                pai.setVisible(!!cards[i - 1]);
                pai.isUp = false;
                pai.isPass = false;
                window.sensorLandscape?pai.setPositionY(144):pai.setPositionX(745)
                sssRule.setPaiFrame(pai, cards[i - 1] > 100 ? (Math.floor(cards[i - 1] / 100)) : cards[i - 1]);
                pai.id = cards[i - 1]
            }
            this.down_cards = cards;
            $('btn_ok').setVisible(cards.length == 0);
        },
        sortUpCards: function (dao) {
            console.log("sortUpCards");
            console.log("排序前：" + JSON.stringify(this.up_cards));
            var idxs = getDaoIdxs(dao);
            var cards = [];
            for (var i = 0; i < idxs.length; i++) {
                if (this.up_cards[idxs[i] - 1])
                    cards.push(this.up_cards[idxs[i] - 1]);
            }
            cards.sort(function (a, b) {
                return a - b
            });

            if (cards.length == idxs.length) {
                //刷新界面牌型
                var daoMap = {
                    1: [0, 1, 2], 2: [3, 4, 5, 6, 7], 3: [8, 9, 10, 11, 12]
                }
                // for (var i = 1; i <= 3; i++) {

                var i = dao;
                var data = sssRule.judgeType(cards)
                // console.log("刷新牌型： " + JSON.stringify(data));
                if (data && data.length > 0) {
                    var type = data[0].cardType
                    $('daotype' + i).setVisible(true);
                    if (i == 1) {
                        var dao = (type == 4 && i == 1) ? '4_2' : type
                        $('daotype' + i).setTexture("res/submodules/sss/image/type/type_word_" + dao + ".png");
                    } else if (i == 2) {
                        var dao = (type == 7 && i == 2) ? '7_2' : type
                        $('daotype' + i).setTexture("res/submodules/sss/image/type/type_word_" + dao + ".png");
                    } else {
                        var dao = type;
                        $('daotype' + i).setTexture("res/submodules/sss/image/type/type_word_" + dao + ".png");
                    }
                    var paiData = data[0];
                    var cardObjs = [];
                    for (var j = 0; j < paiData.cards.length; j++) {
                        var id = paiData.cards[j];
                        cardObjs.push(new sssRule.Card(id))
                    }
                    paiData.cards = cardObjs;
                    // paiData.cards.sort(function (a, b) {
                    //     return a.number - b.number;
                    // })
                    cards = [];
                    for (var j = 0; j < paiData.cards.length; j++) {
                        var card = paiData.cards[j];
                        cards.push(card.isLaizi ? card.initnumber : card.number);
                    }
                    $('daotype' + i).setVisible(true);
                } else {
                    $('daotype' + i).setVisible(false)
                }
                // }
            } else {
                $('daotype' + dao).setVisible(false)
            }


            for (var i = 0; i < idxs.length; i++) {
                if (cards[i]) {
                    this.up_cards[idxs[i] - 1] = cards[i];
                    sssRule.setPaiFrame($('pk' + idxs[i]), cards[i]);
                    $('pk' + idxs[i]).setVisible(true)
                    $('pk' + idxs[i]).id = cards[i]
                    var spBlack = $('pk' + idxs[i]).getChildByName('black')
                    if (spBlack) {
                        spBlack.setVisible(false);
                    }
                }
            }
            //
            console.log("排序后：" + JSON.stringify(this.up_cards));
        },
        showCountDown: function (row, leftTime) {
            if (leftTime <= 0) {
                this.hideCountDown();
                return;
            }

            var that = this;
            // var posObj = {0: cc.p(1070, 170), 1: cc.p(960, 600), 2: cc.p(320, 600)}
            $('cd').setVisible(true);
            // $('cd').setPosition(posObj[row] || cc.p(640, 360));
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            var time = Math.floor(leftTime);
            $('cd.cdtext').setString(time);
            this.timeInterval = setInterval(function () {
                time--;
                if (time < 0) {
                    clearInterval(that.timeInterval);
                    that.timeInterval = undefined
                    time = 0;
                }
                $('cd.cdtext').setString(time);
            }, 1000)
        },
        hideCountDown: function () {
            $('cd').setVisible(false);
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            this.timeInterval = undefined
        },
        onExit: function () {
            this._super();
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            this.timeInterval = undefined
        }
    })

    exports.SelfSortCardsLayer = SelfSortCardsLayer;
})(window);