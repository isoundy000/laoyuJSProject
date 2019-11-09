(function () {
    var exports = this;



    var $ = null;

    var JiesuanLayer = cc.Layer.extend({
        maLayer: null,
        chakanCb: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (maLayer, data) {
            this._super();

            var that = this;

            that.maLayer = maLayer;
            var scene = ccs.load(res.JiesuanLayer_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            var btnStart = $('root.panel.btn_start');
            var btnChakan = $('root.panel.btn_chakan');

            TouchUtils.setOnclickListener(btnStart, function () {
                network.send([
                    'Ready'
                ].join('/'));
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener(btnChakan, function () {
                if (that.chakanCb) {
                    that.chakanCb();
                }
                that.removeFromParent(true);
            });

            var isWin = true;
            var players = data.Users;
            for (var i = 0; i < players.length; i++) {
                $('root.panel.row' + i + '.lb_nickname').setString(ellipsisStr(players[i].UserName || '', 7));
                $('root.panel.row' + i + '.lb_nickname').setVisible(false);
                $('root.panel.row' + i + '.clip').setVisible(false);

                if (gameData.uid == players[i].UserID && players[i].Result < 0)
                    isWin = false;
            }
            for (; i < 5; i++) {
                $('root.panel.row' + i + '.lb_nickname').setVisible(false);
                $('root.panel.row' + i + '.clip').setVisible(false);
            }

            $('root.panel.bg_f').setVisible(!isWin);
            $('root.panel.bg_s').setVisible(isWin);

            if (gameData.leftRound <= 0) {
                btnStart.setVisible(false);
                btnChakan.setVisible(true);
            }

            var panel = $('root.panel');
            panel.setScale(3);
            var shakeLayer = function (layer) {
                layer.runAction(cc.sequence(
                    cc.moveBy(0.05, cc.p(4, 0)),
                    cc.moveBy(0.05, cc.p(-8, 0)),
                    cc.moveBy(0.05, cc.p(0, 4)),
                    cc.moveBy(0.05, cc.p(0, -8))
                ))
            };
            panel.runAction(cc.sequence(
                cc.scaleTo(0.5, 0.9).easing(cc.easeIn(2)),
                // cc.callFunc(function () {
                //     shakeLayer(that.maLayer);
                // }),
                cc.scaleTo(0.1, 1),
                cc.callFunc(function () {
                    var playScroeChange = function (i) {
                        var score = Math.abs(players[i].Result);
                        var charArray = [];
                        while (score > 0) {
                            charArray.push(score % 10);
                            score = Math.floor(score / 10);
                        }
                        if (charArray.length == 0) {
                            charArray.push(0);
                        }
                        $('root.panel.row' + i + '.clip').setVisible(true);
                        var panelHeight = $('root.panel.row' + i + '.clip').getContentSize().height;
                        var createOneScrollAction = function (itemName, idxFlag, delayTime, moveTime, nextNum, easout) {
                            return [
                                cc.delayTime(delayTime),
                                cc.callFunc(function () {
                                    var item1 = $(itemName + idxFlag);
                                    var item2 = $(itemName + (idxFlag + 1) % 2);
                                    item2.setVisible(true);
                                    item2.setString(nextNum);
                                    item2.setPositionY(panelHeight * 3 / 2);
                                    item1.setPositionY(panelHeight / 2);
                                    item1.stopAllActions();
                                    item2.stopAllActions();
                                    item1.runAction(cc.moveBy(moveTime, cc.p(0, -panelHeight)).easing(cc.easeOut(easout)));
                                    item2.runAction(cc.moveBy(moveTime, cc.p(0, -panelHeight)).easing(cc.easeOut(easout)));
                                })
                            ];
                        };
                        var beginScroll = function (itemName, numFlag, curNum) {
                            var sequenceArray = [];
                            var idxFlag = 0;
                            for (var k = 0; k < 10 * numFlag; k++) {
                                sequenceArray = sequenceArray.concat(createOneScrollAction(
                                    itemName, idxFlag, k == 0 ? 0 : 0.03, 0.03, (curNum + k + 1) % 10, 1
                                ));
                                idxFlag = (idxFlag + 1) % 2;
                            }
                            for (var k = 0; k < 10; k++) {
                                sequenceArray = sequenceArray.concat(createOneScrollAction(
                                    itemName, idxFlag, k == 0 ? 0.03 : 0.05, 0.05, (curNum + k + 1) % 10, 1
                                ));
                                idxFlag = (idxFlag + 1) % 2;
                            }
                            for (var k = 0; k < 10; k++) {
                                var actionCfg = [
                                    [0.05, 0.05, 1],
                                    [0.05, 0.06, 1],
                                    [0.06, 0.06, 1],
                                    [0.06, 0.08, 1],
                                    [0.08, 0.08, 1],
                                    [0.08, 0.10, 1],
                                    [0.10, 0.10, 1],
                                    [0.10, 0.15, 1],
                                    [0.15, 0.20, 1],
                                    [0.20, 0.30, 2]
                                ];
                                sequenceArray = sequenceArray.concat(createOneScrollAction(
                                    itemName, idxFlag, actionCfg[k][0], actionCfg[k][1], (curNum + k + 1) % 10, actionCfg[k][2]
                                ));
                                idxFlag = (idxFlag + 1) % 2;
                            }
                            $('root.panel.row' + i + '.clip').runAction(cc.sequence(sequenceArray));
                        };
                        for (var j = 0; j < 4; j++) {
                            $('root.panel.row' + i + '.clip.lb_score_' + j + '_0').setVisible(false);
                            $('root.panel.row' + i + '.clip.lb_score_' + j + '_1').setVisible(false);
                            if (charArray.length == j) {
                                $('root.panel.row' + i + '.clip.lb_score_' + j + '_0').setString(players[i].Result >= 0 ? '+' : '-');
                                $('root.panel.row' + i + '.clip.lb_score_' + j + '_0').setVisible(true);
                            } else if (charArray.length >= j + 1) {
                                $('root.panel.row' + i + '.clip.lb_score_' + j + '_0').setString(charArray[j]);
                                beginScroll('root.panel.row' + i + '.clip.lb_score_' + j + '_', j, charArray[j]);
                            }
                        }
                    };
                    var showName = function (nickname, i) {
                        nickname.runAction(cc.sequence(
                            cc.delayTime(0.4 * i),
                            cc.callFunc(function () {
                                nickname.setVisible(true);
                                nickname.setScale(2);
                            }),
                            cc.scaleTo(0.1, 1).easing(cc.easeIn(2)),
                            cc.callFunc(function () {
                                // shakeLayer(panel);
                                playScroeChange(i);
                            })
                        ))
                    };
                    for (var i = 0; i < players.length; i++) {
                        showName($('root.panel.row' + i + '.lb_nickname'), i);
                    }
                })
            ));

            return true;
        },
        showChakan: function (chakanCb) {
            $('root.panel.btn_start').setVisible(false);
            $('root.panel.btn_chakan').setVisible(true);
            this.chakanCb = function () {
                chakanCb();
            }
        }
    });

    exports.JiesuanLayer = JiesuanLayer;
})(window);
