/**
 * Created by hjx on 2018/10/12.
 */
(function () {
    var exports = this;

    var $ = null;

    var _change2ImageID = function (number) {
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
        // var card = new Card(id)
        // var offType = 5 - card.type;
        // var offType = card.type;
        // return (card.value - 1) * 4 + offType - 1;
        var offType = {4: 2, 1: 4, 2: 3, 3: 1}[type];

        return (offType - 1) * 13 + value - 1;
    }


    var setPaiFrame = function (sp, id) {
        if (!sp) {
            cc.error('null ->>> setPaiFrame')
            return;
        }
        // console.log("setPaiFrame -> " + id);
        if (id === undefined) {
            sp.setTexture('res/submodules/sss/image/bg/card_bg.png');
            var guiCard = sp.getChildByName('gui');
            if (guiCard) {
                guiCard.setVisible(false)
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

    }


    var showAllCardsInfo = function (node, paiArr, type, isShowSpecial) {
        if(!node)
            return;
        var frontNode = node.getChildByName('frontNode');
        node.getChildByName('backNode').setVisible(false);
        frontNode.setVisible(true)
        for (var i = 1; i <= 13; i++) {
            var sp = frontNode.getChildByName('pk' + i);
            if (sp) {
                setPaiFrame(sp, paiArr[i - 1])
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


    var HuifangDetailedLayer = cc.Layer.extend({
        ctor: function (data, index) {
            this._super();
            var that = this;
            loadNodeCCS(res.HuifangDetailed_json, this);
            $ = create$(this.getChildByName("Layer"));
            // console.log(data);

            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });

            console.log("HuifangDetailedLayer");
            var HEIGHT = 390;
            var yOff = HEIGHT;

            var arr = data.card_result[index] || [];
            var wholeHeight = arr.length * HEIGHT;

            for (var i = 0; i < arr.length; i++) {
                var info = arr[i];
                if (i > 0) {
                    yOff += HEIGHT;
                }
                var ccsScene = ccs.load(res.HuifangItemNode_json, "res/");
                var sp = ccsScene.node;
                sp.setName('info' + i);
                $('tabList').addChild(sp);
                sp.y = wholeHeight - yOff + HEIGHT / 2;
                sp.x = 317;
                $('tabList.info' + i + '.view0.lb_jushu').setString('第' + (index + 1) + '局');
                $('tabList.info' + i + '.view0.lb_type').setString('');
                loadImageToSprite(data.heads[(i)], $('tabList.info' + i + '.view0.info.head'))
                $('tabList.info' + i + '.view0.info.lb_nickname').setString(data['nickname' + (i + 1)]);
                $('tabList.info' + i + '.view0.info.lb_score').setString(arr[i].score);

                $('tabList.info' + i + '.view0.lb_jushu')

                // cardModel[0].cards.concat(cardModel[1].cards).concat(cardModel[2].cards)
                // showAllCardsInfo($('tabList.info' + i +'scoreNode'), );
                console.log("222");
                if (arr) {
                    var pais = arr;
                    for (var j = 0; j < pais.length; j++) {
                        if (pais[j].uid == data['uid' + (i + 1)]) {
                            $('tabList.info' + i + '.view0.info.lb_score').setString(pais[j].score);
                            var battleres = pais[j].battleresults;
                            // console.log(pais[j].uid);
                            // console.log(battleres);
                            if (battleres.length == 3) {
                                showAllCardsInfo($('tabList.info' + i + '.view0.' + 'row'), battleres[0].cardmodel.cards.concat(battleres[1].cardmodel.cards).concat(battleres[2].cardmodel.cards));
                                this.setScoreBoardNodeInfo(1, battleres[0].score, battleres[0].additionalscore, $('tabList.info' + i + '.view0'));
                                this.setScoreBoardNodeInfo(2, battleres[1].score, battleres[1].additionalscore, $('tabList.info' + i + '.view0'));
                                this.setScoreBoardNodeInfo(3, battleres[2].score, battleres[2].additionalscore, $('tabList.info' + i + '.view0'));
                                this.setScoreBoardNodeInfo(5, pais[j].score, 0, $('tabList.info' + i + '.view0'));
                            } else {
                                showAllCardsInfo($('tabList.info' + i + '.view0.' + 'row'), pais[j].cards, pais[j].sptype);
                                this.setScoreBoardNodeInfo(0, 0, 0, $('tabList.info' + i + '.view0'));
                                this.setScoreBoardNodeInfo(5, pais[j].score, 0, $('tabList.info' + i + '.view0'));
                            }

                        }


                    }
                }
            }


            $('tabList').setInnerContainerSize(cc.size(560, wholeHeight > 518 ? wholeHeight : 518));
        },
        setScoreBoardNodeInfo: function (dao, score1, score2, target) {
            console.log("setScoreBoardNodeInfo -> " + dao + "  " + score1);
            if (dao == 0 || dao == 1) {
                target.selfTottalScore = 0;
            }
            target.selfTottalScore += (score1 || 0);
            target.selfTottalScore += (score2 || 0);
            // if (gameData.options.debug) {
            //     $('scoreNode.debug').setString($('scoreNode.debug').getString() + " (" + (score1 || 0) + ' ' + (score2 || 0) + ")");
            // }


            console.log("setScoreBoardNodeInfo " + dao + " " + target.selfTottalScore);
            if (dao > 0 && dao <= 3) {
                $('scoreNode.dao' + dao, target).setVisible(true);
                $('scoreNode.kuohao' + dao, target).setVisible(true);
                $('scoreNode.fnt' + dao + '_1_1', target).setVisible(score1 >= 0);
                $('scoreNode.fnt' + dao + '_1_2', target).setVisible(score1 < 0);
                $('scoreNode.fnt' + dao + '_2_1', target).setVisible(score2 >= 0);
                $('scoreNode.fnt' + dao + '_2_2', target).setVisible(score2 < 0);
                $('scoreNode.fnt' + dao + '_1_1', target).setString('+' + score1);
                $('scoreNode.fnt' + dao + '_1_2', target).setString(score1);
                $('scoreNode.fnt' + dao + '_2_1', target).setString('+' + score2);
                $('scoreNode.fnt' + dao + '_2_2', target).setString(score2);
                $('scoreNode.dao' + 4, target).setVisible(true);
                $('scoreNode.fnt' + 4 + '_1', target).setVisible(target.selfTottalScore >= 0);
                $('scoreNode.fnt' + 4 + '_2', target).setVisible(target.selfTottalScore < 0);
                $('scoreNode.fnt' + 4 + '_1', target).setString('+' + target.selfTottalScore);
                $('scoreNode.fnt' + 4 + '_2', target).setString(target.selfTottalScore);

            } else if (dao == 4) {
                $('scoreNode.dao' + dao, target).setVisible(true);
                $('scoreNode.fnt' + dao + '_1', target).setVisible(target.selfTottalScore >= 0);
                $('scoreNode.fnt' + dao + '_2', target).setVisible(target.selfTottalScore < 0);
                $('scoreNode.fnt' + dao + '_1', target).setString('+' + target.selfTottalScore);
                $('scoreNode.fnt' + dao + '_2', target).setString(target.selfTottalScore);
            } else if (dao == 0) {
                for (var i = 1; i <= 3; i++) {
                    dao = i;
                    $('scoreNode.dao' + dao, target).setVisible(false);
                    $('scoreNode.kuohao' + dao, target).setVisible(false);
                    $('scoreNode.fnt' + dao + '_1_1', target).setVisible(false);
                    $('scoreNode.fnt' + dao + '_1_2', target).setVisible(false);
                    $('scoreNode.fnt' + dao + '_2_1', target).setVisible(false);
                    $('scoreNode.fnt' + dao + '_2_2', target).setVisible(false);
                }
                $('scoreNode.dao' + 4, target).setVisible(false);
                $('scoreNode.fnt' + 4 + '_1', target).setVisible(false);
                $('scoreNode.fnt' + 4 + '_2', target).setVisible(false);
            } else if (dao == 5) {
                $('scoreNode.dao' + 4, target).setVisible(true);
                $('scoreNode.fnt' + 4 + '_1', target).setVisible(score1 >= 0);
                $('scoreNode.fnt' + 4 + '_2', target).setVisible(score1 < 0);
                $('scoreNode.fnt' + 4 + '_1', target).setString('+' + score1);
                $('scoreNode.fnt' + 4 + '_2', target).setString(score1);
            }

        }
    });
    exports.HuifangDetailedLayer = HuifangDetailedLayer;
})(window);