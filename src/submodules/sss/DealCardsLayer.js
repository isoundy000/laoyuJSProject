/**
 * Created by hjx on 2018/9/18.
 */

(function () {
    var exports = this;

    var $ = null;
    var changePosRecord = [];
    var lastTouchTime = 0;
    var lastOpeTime = 0;

    var DealCardsLayer = cc.Layer.extend({
        ctor: function (data) {
            this._super();
            var that = this;
            this.cards = data.cards || [6, 9, 12, 8, 5, 13, 7, 4, 3, 10, 2, 1, 11];
            this.types = data.types || [];
            this.special = data.special;

            // window.sensorLandscape = false;
            var scene = loadNodeCCS(window.sensorLandscape?res.DealCardsLayer_json:res.DealCardsLayer_v_json, this);
            $ = create$(this.getChildByName("Layer"));


            TouchUtils.setOnclickListener($('btn_type1'), function () {
                console.log("类型1");
                that.refreshView(_.shuffle([6, 9, 12, 8, 5, 13, 7, 4, 3, 10, 2, 1, 11]));
            });

            TouchUtils.setOnclickListener($('btn_type2'), function () {
                console.log("类型2");
                that.refreshView(_.shuffle([6, 9, 12, 8, 5, 13, 7, 4, 3, 10, 2, 1, 11]));
            });

            TouchUtils.setOnclickListener($('btn_shoudonglipai'), function () {
                console.log("手动理牌");

                // that.removeFromParent()
                var view = new SelfSortCardsLayer(that.cards, lastOpeTime, data);
                // view.showCountDown(0, 150)
                that.addChild(view);
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

            TouchUtils.setOnclickListener($('btn_ok'), function () {
                console.log("确定");
                console.log(that.cards)
                //Submit/1/1,2,3/1,2,3,4,5/1,2,3,4,5
                // gameData.curRound = gameData.curRound || 1;
                var cmd = "Submit/" + gameData.curRound + "/"
                var shangArr = that.cards.slice(0, 3)
                var zhongArr = that.cards.slice(3, 8)
                var xiaArr = that.cards.slice(8, 13)

                cmd += shangArr.join(',');
                cmd += ("/" + zhongArr.join(','));
                cmd += ("/" + xiaArr.join(','));
                network.sendPhz(5000, cmd);

                cc.sys.localStorage.setItem("13shui_shoudonglipai", 0);
            });
            this.initView(data);
            this.createTypeSelect();
            this.refreshView(this.cards, true);
            this.hideCountDown();
        },
        initView: function (data) {
            this.originPos = {};
            this.originPkNode = {};

            var that = this;
            for (var i = 0; i < 13; i++) {
                var pk = $('pk' + (i + 1));
                this.originPkNode[i] = pk;
                this.originPos[i] = pk.getPosition();
                sssRule.setPaiFrame(pk, this.cards[i]);
                (function (pk) {
                    TouchUtils.setOnclickListener(pk, function () {
                        var name = pk.getName();
                        var idx = parseInt(name.substring(2, 4));
                        if (changePosRecord.indexOf(idx) < 0) {
                            changePosRecord.push(idx);
                            playEffect('vdianpai');
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
                        }
                    });
                })(pk)
            }

            var val = cc.sys.localStorage.getItem("13shui_shoudonglipai")
            if (val && parseInt(val) == 1) {
                var view = new SelfSortCardsLayer(that.cards, lastOpeTime, data);
                that.addChild(view);
            }
        },
        changeTwoCardsPos: function (srcIdx, tarIdx) {
            var fromDao = srcIdx <= 2 ? 1 : (srcIdx <= 7 ? 2 : 3);
            var toDao = tarIdx <= 2 ? 1 : (tarIdx <= 7 ? 2 : 3);
            var cards = _.clone(this.cards);
            var t = cards[srcIdx];
            cards[srcIdx] = cards[tarIdx];
            cards[tarIdx] = t
            this.refreshView(cards, fromDao == toDao)

        },
        refreshView: function (cards, isSameDaoChange) {
            console.log("refreshView ->" + JSON.stringify(cards))
            var oldcards = this.cards;
            var newcards = _.clone(cards);
            if (oldcards.length != 13 || newcards.length != 13) {
                cc.error('牌数量不对应')
                return;
            }

            var relationship = {};
            for (var i = 0; i < oldcards.length; i++) {
                var id = oldcards[i];
                var idx = newcards.findIndex(function (o) {
                    // if (o > 100) {
                    //     if (id > 100) {
                    //         return o == id;
                    //     } else {
                    //         return Math.floor(o % 100) == id
                    //     }
                    // } else {
                    //     if (id > 100) {
                    //         return Math.floor(id % 100) == o
                    //     } else {
                    //         return o == id;
                    //     }
                    // }
                    if (o >= 53) {
                        return false;
                    } else {
                        return o == id;
                    }
                });
                if (idx >= 0) {
                    relationship[i + 1] = idx + 1;
                    newcards[idx] = -1;
                } else {

                    if (id < 100) {
                        console.log("找不到——>" + id);
                    }
                    //找到的时候替换一张鬼牌
                    for (var u = 0; u < newcards.length; u++) {
                        var gui = newcards[u];
                        if (gui > 100) {
                            //newcards[u] = parseInt('' + Math.floor(gui/100) + (Math.floor(id%100)>10?Math.floor(id%100):'0'+Math.floor(id%100)));
                            relationship[i + 1] = u + 1;
                            newcards[u] = -1;
                            break;
                        }
                    }
                    console.log(JSON.stringify(newcards));
                }
            }
            console.log(relationship);
            //检验是否正确，否则直接返回 防止后边报错
            var startCheckIdx = 0;
            for (var i = 1; i <= 13; i++) {
                if (relationship[i] && startCheckIdx==0){
                    startCheckIdx = i;
                    break;
                }
            }
            if(startCheckIdx){
                var nextCheckIdx = relationship[startCheckIdx];
                for (var i = 1; i <= 13; i++) {
                    if(relationship[nextCheckIdx] && relationship[nextCheckIdx]!=startCheckIdx){
                        nextCheckIdx = relationship[nextCheckIdx];
                        continue;
                    }
                    break;
                }
                if(startCheckIdx != relationship[nextCheckIdx]){
                    cc.error('cuow ====')
                    return;
                }
            }

            for (var i = 1; i <= 13; i++) {
                if (relationship[i] && relationship[i] != i) {
                    console.log(i + " --> " + relationship[i]);
                    var pk = this.originPkNode[i - 1]
                    if (pk) {
                        pk.stopAllActions();
                        pk.setName('pk' + relationship[i]);
                        pk.runAction(cc.moveTo(0.2, this.originPos[relationship[i] - 1]))
                    } else {
                        cc.error('对不起 牌找不到了。。。。');
                    }
                }
            }

            //刷新界面牌型
            var daoMap = {
                1: [0, 1, 2], 2: [3, 4, 5, 6, 7], 3: [8, 9, 10, 11, 12]
            }
            for (var i = 1; i <= 3; i++) {
                var data = sssRule.judgeType(cards.slice(daoMap[i][0], daoMap[i][0] + daoMap[i].length))
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
                    if(isSameDaoChange){//不对初始牌型做处理，否则会改服务器过来的牌型 尤其癞子牌型的时候该处理需要屏蔽 ***以服务器为准
                        continue;
                    }

                    var paiData = data[0];
                    var cardObjs = [];
                    for (var j = 0; j < paiData.cards.length; j++) {
                        var id = paiData.cards[j];
                        cardObjs.push(new sssRule.Card(id))
                    }
                    paiData.cards = cardObjs;
                    paiData.cards.sort(function (a, b) {
                        return a.number - b.number;
                    })
                    for (var j = 0; j < paiData.cards.length; j++) {
                        var card = paiData.cards[j];
                        cards[daoMap[i][j]] = card.isLaizi ? card.initnumber : card.number;
                    }
                } else {
                    $('daotype' + i).setVisible(false)
                }
            }


            for (var i = 0; i < 13; i++) {
                var pk = $('pk' + (i + 1));
                this.originPkNode[i] = pk;
                sssRule.setPaiFrame(pk, cards[i])
                var spBlack = pk.getChildByName('black')
                if (spBlack) {
                    spBlack.setVisible(false);
                }
            }
            changePosRecord = [];
            this.cards = _.clone(cards);


        },

        createTypeSelect: function () {
            // this.types = [
            //     {
            //     cardModel: [
            //         {cardType: 2, cards: [6, 9, 12]},
            //         {cardType: 2, cards: [8, 5, 13, 7, 4]},
            //         {cardType: 2, cards: [3, 10, 2, 1, 11]}
            //     ],
            //     sp: 0
            // }, {
            //     cardModel: [
            //         {cardType: 2, cards: [1, 3, 12]},
            //         {cardType: 2, cards: [8, 5, 13, 7, 4]},
            //         {cardType: 2, cards: [9, 10, 2, 6, 11]}
            //     ],
            //     sp: 0
            // }, {
            //         cardModel: [
            //             {cardType: 2, cards: [1, 3, 12]},
            //             {cardType: 2, cards: [8, 5, 13, 7, 4]},
            //             {cardType: 2, cards: [9, 10, 2, 6, 11]}
            //         ],
            //         sp: 0
            //     }, {
            //         cardModel: [
            //             {cardType: 2, cards: [1, 3, 12]},
            //             {cardType: 2, cards: [8, 5, 13, 7, 4]},
            //             {cardType: 2, cards: [9, 10, 2, 6, 11]}
            //         ],
            //         sp: 0
            //     },
            //     {
            //     cardModel: [
            //         {cardType: 2, cards: [9, 3, 11]},
            //         {cardType: 2, cards: [4, 5, 12, 7, 8]},
            //         {cardType: 2, cards: [1, 10, 2, 6, 13]}
            //     ],
            //     sp: 0
            // }];
            this._dataArr = this.types;
            var that = this;
            var setClickCallback = function (node, i) {
                $('effect', node).setVisible(i==0);
                TouchUtils.setOnclickListener(node, function (){
                    console.log("click -> "  + i);
                    for(var j=0; j<that.btnList.length; j++){
                        $('effect', that.btnList[j]).setVisible(false);
                    }
                    $('effect', node).setVisible(true);
                    that.tableCellTouched(that, node, i)
                }, {swallowTouches:false});
            }
            if (!this._tableView) {
                var scrollView = $('scrolView');
                var row0 = $('row0', scrollView);
                var innerHeight = this.types.length * (row0.getContentSize().width+8);
                if (innerHeight <= scrollView.getContentSize().width) {
                    innerHeight = scrollView.getContentSize().width;
                }
                this.btnList = [];
                var dupRow0 = duplicateSprite(row0);
                for (var i = 0; i < this.types.length; i++) {
                    var data = this.types[i];
                    var node = $('row' + i, scrollView);
                    if (!node) {
                        node = duplicateSprite(dupRow0);
                        node.setName('row' + i);
                        row0.getParent().addChild(node);
                    }else{
                        $('effect', node).setVisible(true);
                    }
                    this.btnList.push(node);
                    node.setPositionX((row0.getContentSize().width + 8) * i);
                    console.log("-------" + node.x);
                    // $("label", node).setString(this.types[i]);
                    // $("label", node).setLocalZOrder(1);

                    var dao2 = data.cardModel[1].cardType == 7 ? '7_2' : data.cardModel[1].cardType
                    var dao1 = data.cardModel[2].cardType == 4 ? '4_2' : data.cardModel[2].cardType
                    $('type1',node).setTexture("res/submodules/sss/image/type/type_word_" + dao1 + ".png");
                    $('type2',node).setTexture("res/submodules/sss/image/type/type_word_" + dao2 + ".png");
                    $('type3',node).setTexture("res/submodules/sss/image/type/type_word_" + data.cardModel[0].cardType + ".png");

                    setClickCallback(node, i);
                }
                scrollView.innerWidth = innerHeight;
            }
        },
        // initItem: function (data1, data2, count, setPosX, idx) {
        //     var item = new ChooseTypeItem(data1, idx );
        //     this.layout.addChild(item);
        //     var itemWidth = item.getLayerWidth();
        //     item.setPositionX(this.totalWidth - setPosX);
        //     this.totalWidth += itemWidth;
        // },
        tableCellTouched: function (table, cell, i) {
            var curTouchTime = new Date().getTime()
            if (curTouchTime - lastTouchTime > 300) {
                lastTouchTime = curTouchTime
            } else {
                return;
            }
            var idx = i;
            // console.log("tableCellTouched --> " + idx);
            console.log(this._dataArr[idx]);
            var data = this._dataArr[idx]
            this.refreshView([].concat(data.cardModel[2].cards).concat(data.cardModel[1].cards).concat(data.cardModel[0].cards), true)


            // console.log("tableCellTouched " + cell)
            for (var i = 0; i < this._dataArr.length; i++) {
                var cell = table.btnList[i];
                if (cell) {
                    if (i == idx) {
                        table.curChooseIdx = idx;
                        $('effect',cell).setVisible(true)
                    } else {
                        $('effect',cell).setVisible(false)
                    }
                }
            }
        },
        // tableCellAtIndex: function (table, idx) {
        //     var strValue = idx.toFixed(0);
        //     var cell = table.dequeueCell();
        //     if (cell) cell.removeFromParent();
        //     // console.log("tableCellAtIndex" + strValue);
        //     cell = new ChooseTypeItem(this._dataArr[idx]);
        //     // if(!window.sensorLandscape){
        //     //     cell.setRotation(-90);
        //     // }
        //     if (table.curChooseIdx == idx) {
        //         cell.setLight(true);
        //     } else {
        //         cell.setLight(false);
        //     }
        //     return cell;
        // },
        // tableCellUnhighlight: function (table, cell) {
        //     console.log("unhigh " + cell.getIdx());
        // },
        // tableCellHighlight: function (table, cell) {
        //     console.log("high " + cell.getIdx());
        // },
        // tableCellSizeForIndex: function (table, idx) {
        //     return cc.size(175, 224);
        //     // if(window.sensorLandscape){
        //     //     return cc.size(175, 224);
        //     // }else{
        //     //     return cc.size(224, 175);
        //     // }
        //
        // },
        // numberOfCellsInTableView: function (table) {
        //     return this._dataArr.length;
        // },
        // scrollViewDidScroll: function (view) {
        //     // var size = view.getContentOffset();
        //     // if (size.x != 0) {
        //     //     setPosX = size.x;
        //     // }
        // },
        // scrollViewDidZoom: function (view) {
        // },
        // _offsetFromIndex: function (view) {

        // },

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
            lastOpeTime = Math.floor(leftTime);
            $('cd.cdtext').setString(lastOpeTime);
            this.timeInterval = setInterval(function () {
                lastOpeTime--;
                if (lastOpeTime < 0) {
                    clearInterval(that.timeInterval);
                    that.timeInterval = undefined
                    lastOpeTime = 0;
                }
                $('cd.cdtext').setString(lastOpeTime);
            }, 1000)
        },
        onExit: function () {
            this._super();
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            this.timeInterval = undefined
        },
        hideCountDown: function () {
            $('cd').setVisible(false);
            if (this.timeInterval)
                clearInterval(this.timeInterval);
            this.timeInterval = undefined
        }
    })

    var ChooseTypeItem = cc.TableViewCell.extend({
        layerHeight: 0,
        ctor: function (data) {
            this._super();

            var that = this;

            // console.log("  ChooseTypeItem-- " + JSON.stringify(data));

            var scene = ccs.load(window.sensorLandscape?res.ChooseTypeItem_json:res.ChooseTypeItem_v_json, 'res/');
            this.addChild(scene.node);
            var _$ = create$(this.getChildByName("Node"));
            this._$ = _$;
            this.layerWidth = 171;

            // {cardType: 2, cards: [6, 9, 12]},
            // {cardType: 2, cards: [ 8, 5, 13, 7, 4]},
            // {cardType: 2, cards: [ 3, 10, 2, 1, 11]}

            // var cardsTypes = [data.cardModel[2].cardType, data.cardModel[1].cardType, data.cardModel[1].cardType];
            // console.log(JSON.stringify(cardsTypes));
            var dao2 = data.cardModel[1].cardType == 7 ? '7_2' : data.cardModel[1].cardType
            var dao1 = data.cardModel[2].cardType == 4 ? '4_2' : data.cardModel[2].cardType
            _$('type1').setTexture("res/submodules/sss/image/type/type_word_" + dao1 + ".png");
            _$('type2').setTexture("res/submodules/sss/image/type/type_word_" + dao2 + ".png");
            _$('type3').setTexture("res/submodules/sss/image/type/type_word_" + data.cardModel[0].cardType + ".png");
            // console.log("res/submodules/sss/image/type/type_word_" + data.cardModel[2].cardType + ".png");
            // console.log("res/submodules/sss/image/type/type_word_" + data.cardModel[1].cardType + ".png");
            // console.log("res/submodules/sss/image/type/type_word_" + data.cardModel[0].cardType + ".png");


            return true;
        },
        getLayerWidth: function () {
            return this.layerWidth;
        },
        setLight: function (isShow) {
            this._$('effect').setVisible(!!isShow)
        },
    });

    exports.DealCardsLayer = DealCardsLayer;
})(window);