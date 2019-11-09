/**
 * Created by hjx on 2017/10/19.
 */

(function () {
    var exports = this;
    var $ = null;

    var PROCESS_SHOW = 1;
    var PROCESS_CUT = 2;
    var PROCESS_TO_PIECE2 = 3;
    var PROCESS_TO_PIECE1 = 4;
    var PROCESS_MOVE_TO_BOX = 5;
    var PROCESS_SEND_PAI = 6;

    var PAI_COUNT = 52;
    var GLOBAL_R = 1200;
    var SPEED_RATE = 0.5;
    var R_RATE = 1.00;

    var CENTER_POS = cc.p(640, -700);
    var process_idx = 0;
    var process_toPiece2_idx = 0;
    var paiArr = [];
    var g_callback = null;
    var g_layer = null;
    var g_paiInfo = null;
    var cutIdx2 = -1;
    var g_timeInterval;

    //角度计算位置
    var upAngleToPosition = function (angle, center, R) {
        angle = angle || 0;
        center = center || cc.p(0, 0);
        R = R || 100;
        var x = center.x + Math.cos((angle + 90) / 180 * Math.PI) * R + (cc.winSize.width/2-1280/2);
        var y = center.y + Math.sin((angle + 90) / 180 * Math.PI) * R;
        return cc.p(x, y);
    }
    var fixPaiPosition2 = function (angle, center, R, deep) {
        var pos = upAngleToPosition(angle, center, R);
        pos.x += Math.cos((angle + 90) / 180 * Math.PI) * (deep) * 1.25;
        pos.y += Math.sin((angle + 90) / 180 * Math.PI) * (deep) * 0.25;
        return pos;
    }

    var moveCircleToScheduleUpdate = function (target, func, interval, delay, repeat, duration, center, targetPos, cb) {
        unScheduleUpdate(target);
        var scheduler = cc.director.getScheduler();
        interval = interval || 0;
        repeat = repeat || cc.REPEAT_FOREVER;
        delay = delay || 0;

        var startPosX = target.getPositionX();
        var startPosY = target.getPositionY();
        var moveObj = {
            _startPosition: cc.p(startPosX, startPosY),
            _R: Math.sqrt((center.x - startPosX) * (center.x - startPosX) + (center.y - startPosY) * (center.y - startPosY)),
            _endR: Math.sqrt((center.x - targetPos.x) * (center.x - targetPos.x) + (center.y - targetPos.y) * (center.y - targetPos.y)),
            _startRad: Math.atan((startPosY - center.y) / (startPosX - center.x)),
            _endRad: Math.atan((targetPos.y - center.y) / (targetPos.x - center.x)),
        };
        moveObj._startRad < 0 ? moveObj._startRad += Math.PI : 0;
        moveObj._endRad < 0 ? moveObj._endRad += Math.PI : 0;
        var curTime = 0;

        func = func || function (dt) {
                curTime += dt;
                dt = curTime / duration;
                var isOver = false;
                if (dt >= 1) {
                    dt = 1;
                    isOver = true;
                }
                var locStartPosition = center;
                var R = moveObj._R + (moveObj._endR - moveObj._R) * dt;
                var rat = moveObj._startRad + dt * (moveObj._endRad - moveObj._startRad);//dt * 3.1415926 * 2;
                var x = locStartPosition.x + R * Math.cos(rat);
                var y = locStartPosition.y + R * Math.sin(rat);
                target.setPosition(x, y);

                if (isOver) {
                    unScheduleUpdate(target);
                    if (cb) cb();
                }
            }
        // scheduler.schedule(func, target, interval, repeat, delay, false);
        target.myScheduleFunc = func;
        target.schedule(target.myScheduleFunc, interval);
    }
    var unScheduleUpdate = function (target) {
        // var scheduler = cc.director.getScheduler();
        // scheduler.unscheduleUpdate(target);
        // scheduler.unscheduleAllCallbacksForTarget(target);
        if (target.myScheduleFunc) {
            target.unschedule(target.myScheduleFunc);
            target.myScheduleFunc = undefined;
        }
    }


    var FapaiUpdateLayer = cc.Layer.extend({
        onCCSLoadFinish: function () {
        },
        setPaiData: function (new_g_paiInfo) {
            // console.log(new_g_paiInfo);
            g_paiInfo = new_g_paiInfo;
        },
        ctor: function (sendPaiData, cb) {
            this._super();
            var that = this;
            g_layer = that;
            g_callback = cb;
            g_paiInfo = sendPaiData;
            paiArr.splice(0, paiArr.length);
            // console.log(g_paiInfo);

            // var mainscene = ccs.load(res.FapaiLayer_json, "res/");
            var mainscene = loadNodeCCS(res.FapaiLayer_json, this, null, true);
            // this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Layer"));

            if($('panel')){
                $('panel').setPositionX(-cc.winSize.width/2+1280/2);
                $('panel').setContentSize(cc.winSize);
            }

            TouchUtils.setOnclickListener($('btn'), function () {
                if (process_idx == 0) {
                    that.wholeProcess();
                }
            });
            TouchUtils.setOnclickListener($('pass'), function () {
                network.send(4111, {'qiepai_uid': gameData.uid, 'pai_index': 0, "room_id": gameData.roomId});
                $('pass').setVisible(false);
            });
            //version6 直接抄袭视频玩法 全部切牌逻辑添加
            // this.wholeProcess();

            var boxx = $('pai_box').x + cc.winSize.width/2 - 1280/2;
            var boxBan = new cc.Sprite("res/submodules/psz/image/FapaiLayer/pai_box_ban.png");
            this.addChild(boxBan, 9999);
            boxBan.x = boxx;
            boxBan.y = $('pai_box').y - 20;
            boxBan.setVisible(false);
            that.boxBan = boxBan;

            var paiBox = duplicateSprite($('pai_box'));
            this.addChild(paiBox, 9998);
            paiBox.x = boxx;
            paiBox.y = $('pai_box').y;
            $('pai_box').setVisible(false);
            that.boxDi = paiBox;
            return true;
        },
        choosePaiForCut: function (idx) {
            $('tipsLable').setVisible(false);
            $('secLabel').setVisible(false);
            $('pass').setVisible(false);
            $('qiepai_tips').setVisible(false);
            $('qiepai_bg').setVisible(false);
            var that = this;
            if (!(process_idx == PROCESS_CUT || process_idx == PROCESS_SHOW))return;

            process_idx = -1;
            cutIdx2 = idx;
            var curPos = paiArr[idx].getPosition();
            var x = curPos.x + (curPos.x - CENTER_POS.x) * 0.05;
            var y = curPos.y + (curPos.y - CENTER_POS.y) * 0.05;
            process_toPiece2_idx = 1;
            moveCircleToScheduleUpdate(paiArr[idx], undefined, 0, 0, undefined, 0.15 * SPEED_RATE, CENTER_POS, cc.p(x, y), that.moveTo2Pieces.bind(that));
        },
        getSelfInfo: function () {
            for (var i = 0; i < g_paiInfo.length; i++) {
                var data = g_paiInfo[i];
                if (gameData.uid == data.uid) {
                    return data;
                }
            }
            return {qiepai: false};
        },
        sendPai: function () {
            AgoraUtil.showAllVideo();

            $('tipsLable').setVisible(false);
            $('secLabel').setVisible(false);
            $('pass').setVisible(false);
            $('panel').setVisible(false);
            $('qiepai_tips').setVisible(false);
            $('qiepai_bg').setVisible(false);
            this.boxBan.setVisible(true);

            // g_paiInfo = _data || g_paiInfo;
            //g_paiInfo
            var count = 0;
            var maxCount = 0;
            var sendTime = 0.15;
            //调整顺序
            for (var i = 0; i < g_paiInfo.length; i++) {
                var player = g_paiInfo[0];
                if (player.uid != gameData.zhuangUid) {
                    g_paiInfo.splice(0, 1);
                    g_paiInfo.push(player);
                }
            }
            if (paiArr.length == 0) {
                for (var j = 0; j < PAI_COUNT; j++) {
                    var pai = new cc.Sprite('res/submodules/psz/image/common/pai_back3.png');
                    this.addChild(pai);
                    paiArr.push(pai);
                    pai.setLocalZOrder(j);
                    pai.y = -200
                }
            }
            // console.log("paibox");
            var paiPos = $('pai_box').convertToWorldSpace(cc.p($('pai_box').getContentSize().width / 2, $('pai_box').getContentSize().height / 2));
            // console.log("paibox");
            //初始牌位置 由于不切牌直接发牌 所以需要重置
            for (var j = 0; j < PAI_COUNT; j++) {
                var pai = paiArr[j];
                var angle = 0;
                pai.setLocalZOrder(j);
                var pos = fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, -j * 3);
                // pos.x += 318;
                pos.x = paiPos.x;

                pos.y += 140;
                // pai.runAction(
                //     cc.spawn(
                //         cc.rotateTo(1.25 * SPEED_RATE, 90),
                //         cc.scaleTo(1.25 * SPEED_RATE, 0.35),
                //         cc.moveTo(1.25 * SPEED_RATE ,pos)
                //     )
                // );
                pai.setRotation(90);
                pai.setScale(0.31);
                pai.setPosition(pos);
                pai.setVisible(true);
            }

            // console.log(g_paiInfo);
            var disY = paiArr[0].y - paiArr[1].y;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < g_paiInfo.length; j++) {
                    var obj = g_paiInfo[j];
                    var pai = paiArr[PAI_COUNT - count - 1];
                    (function (zOrder, _pai, _obj) {
                        _pai.stopAllActions();
                        _pai.runAction(
                            cc.sequence(
                                cc.delayTime(count * 0.13),
                                cc.callFunc(function () {
                                    playEffect('vfapai_bg');
                                    // _pai.setLocalZOrder(zOrder);
                                    for (var x = PAI_COUNT - zOrder - 2; x >= 0; x--) {
                                        var pai = paiArr[x];
                                        pai.y -= disY;
                                    }
                                }),
                                cc.spawn(
                                    cc.moveTo(sendTime * 1.2, _obj.x, _obj.y),
                                    cc.scaleTo(sendTime * 1.2, _obj.scale),
                                    cc.rotateTo(sendTime * 1.2, 0),
                                    cc.sequence(cc.delayTime(sendTime * 0.5), cc.callFunc(function () {
                                        _pai.setLocalZOrder(zOrder);
                                    }))
                                ),
                                cc.callFunc(function () {
                                    count--;
                                    _pai.setPosition(_obj.x, _obj.y);
                                    _pai.setScale(_obj.scale);
                                    _pai.setRotation(0);
                                    if (count == 0) {
                                        if (g_callback) {
                                            //隐藏发的牌
                                            for (var j = 0; j < maxCount; j++) {
                                                var pai_j = paiArr[PAI_COUNT - j - 1];
                                                pai_j.setVisible(false);
                                            }
                                            g_callback();
                                        }
                                    }
                                })
                            )
                        );
                    })(count, pai, obj[i]);
                    count++;
                    maxCount++;
                }
            }

        },

        moveToBox: function () {
            if (process_idx == PROCESS_MOVE_TO_BOX)return;
            process_idx = PROCESS_MOVE_TO_BOX;
            var that = this;

            this.boxDi.setVisible(true);
            // console.log("moveToBox paibox");
            var paiPos = $('pai_box').convertToWorldSpace(cc.p($('pai_box').getContentSize().width / 2, $('pai_box').getContentSize().height / 2));
            // var boxY = CENTER_POS.y + GLOBAL_R;


            for (var j = 0; j < PAI_COUNT; j++) {
                var pai = paiArr[j];
                var angle = 0;
                pai.setLocalZOrder(j);
                var pos = fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, -j * 3);
                // pos.x += 318;
                pos.x = paiPos.x;

                pos.y += 140;
                (function (_pai, _pos) {
                    _pai.stopAllActions();
                    _pai.runAction(
                        cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.6 * SPEED_RATE, _pos),
                                cc.rotateTo(0.6 * SPEED_RATE, 90),
                                cc.scaleTo(0.6 * SPEED_RATE, 0.31)
                            ),
                            cc.callFunc(function () {
                                _pai.setRotation(90);
                                _pai.setScale(0.31);
                                _pai.setPosition(_pos);
                            })
                        )
                    );
                })(pai, pos);

            }
            // setTimeout(function () {
            //     process_idx = 0;
            //     //TODO
            //     // that.sendPai();
            //     for (var j = 0; j < PAI_COUNT; j++) {
            //         var pai = paiArr[j];
            //         pai.stopAllActions();
            //         unScheduleUpdate(pai);
            //     }
            //     if(g_callback){
            //         g_callback();
            //     }
            // }, 1250 * SPEED_RATE)
            that.runAction(cc.sequence(cc.delayTime(1.25 * SPEED_RATE), cc.callFunc(function () {
                process_idx = 0;
                that.sendPai();
                // //TODO
                // if(g_callback){
                //     g_callback();
                // }

            })));
        },
        /**
         * 两摞牌挪到一起
         */
        moveTo1Piece: function () {
            if (process_idx == PROCESS_TO_PIECE1)return;
            var that = this;

            process_idx = PROCESS_TO_PIECE1;
            //调整牌顺序 产生层级变化
            var tempArr = paiArr.splice(0, cutIdx2);
            // paiArr.concat(tempArr);
            for (var i = 0; i < tempArr.length; i++) {
                paiArr.push(tempArr[i]);
            }

            var cb = function () {
                if (process_idx == PROCESS_TO_PIECE1) {
                    // setTimeout(function () {
                    //     that.moveToBox();
                    // }, 800)
                    that.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                        that.moveToBox();
                    })));
                }
            };
            for (var j = 0; j < PAI_COUNT; j++) {
                var pai = paiArr[j];
                var angle = 0;
                pai.setLocalZOrder(j);
                pai.stopAllActions();
                pai.runAction(cc.rotateTo(0.85 * SPEED_RATE, 90));
                moveCircleToScheduleUpdate(pai, undefined, 0, 0, undefined, 0.95 * SPEED_RATE, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, j * 2),
                    j == 0 ? cb : undefined
                );
            }
            $('panel').runAction(
                cc.sequence(
                    cc.fadeOut(1),
                    cc.callFunc(function () {

                    })
                ));


        },
        /**
         * 将铺开的牌 分成两摞显示
         */
        moveTo2Pieces: function () {
            var that = this;
            // console.log("---moveTo2Pieces");

            process_idx = PROCESS_TO_PIECE2;
            var cb1 = function () {
                process_toPiece2_idx = 0;
                // setTimeout(function () {
                //     // process_idx = 0;
                //     that.moveTo1Piece();
                // }, 200);
                that.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                    that.moveTo1Piece();
                })));
            }
            for (var i = 0; i < paiArr.length; i++) {
                var pai = paiArr[i];
                TouchUtils.removeListeners(pai);
                if (i < cutIdx2 && process_toPiece2_idx == 2) {
                    var start = 0;
                    var angle = (PAI_COUNT / 2 - start) * R_RATE;
                    pai.stopAllActions();
                    pai.runAction(cc.rotateTo(1 * SPEED_RATE, -angle));
                    // console.log("i=" + i +"  "+cutIdx2);
                    // pai.setPosition(fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, -i));
                    moveCircleToScheduleUpdate(pai, undefined, 0, 0, undefined, 1 * SPEED_RATE, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, -i),
                        i == 0 ? cb1 : undefined
                    )
                } else if (i == cutIdx2 && process_toPiece2_idx == 1) {
                    var end = PAI_COUNT - 1;
                    var angle = (PAI_COUNT / 2 - end) * R_RATE;
                    (function (_pai, endPos) {
                        moveCircleToScheduleUpdate(_pai, undefined, 0, 0, undefined, 1 * SPEED_RATE, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, GLOBAL_R * 1.05, 0))
                        _pai.stopAllActions();
                        _pai.runAction(
                            cc.sequence(
                                cc.rotateTo(1 * SPEED_RATE, -angle),
                                cc.moveTo(0.35 * SPEED_RATE, endPos),
                                cc.delayTime(0.14 * SPEED_RATE),
                                cc.callFunc(function () {
                                    process_toPiece2_idx = 2;
                                    that.moveTo2Pieces();
                                })
                            )
                        );
                    })(pai, fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, 0));
                } else if (i > cutIdx2 && process_toPiece2_idx == 1) {
                    var end = PAI_COUNT - 1;
                    var angle = (PAI_COUNT / 2 - end) * R_RATE;
                    pai.stopAllActions();
                    pai.runAction(cc.rotateTo(1 * SPEED_RATE, -angle));
                    moveCircleToScheduleUpdate(pai, undefined, 0, 0, undefined, 1 * SPEED_RATE, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, i - cutIdx2))

                } else if (cutIdx2 == i && i == 0 && process_toPiece2_idx == 2) {
                    process_toPiece2_idx = 0;
                    // setTimeout(function () {
                    //     that.moveTo1Piece();
                    // }, 200);
                    that.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                        that.moveTo1Piece();
                    })));
                }
            }
        },
        cutPais: function () {
            var that = this;
            process_idx = PROCESS_CUT;
            var isSend = false;
            // console.log("qiepai ==  " + JSON.stringify(that.getSelfInfo()));

            if (!that.getSelfInfo().qiepai) {
                return;
            }
            for (var i = 0; i < paiArr.length; i++) {
                (function (idx, pai) {
                    var paiInitY = -1;
                    var moveY = -1;
                    var preTime = new Date().getTime();
                    TouchUtils.setOntouchListener(pai, null,
                        {
                            effect: TouchUtils.effects.NONE,
                            onTouchBegan: function () {
                                if (isSend)return false;
                                var time = new Date().getTime();
                                if (time - preTime < 400 && that.getSelfInfo().qiepai && !isSend) {
                                    isSend = true;
                                    network.send(4111, {
                                        'qiepai_uid': gameData.uid,
                                        'pai_index': idx,
                                        "room_id": gameData.roomId
                                    });
                                    return false;
                                }
                                preTime = time;
                                paiInitY = pai.getPositionY();
                                return true;
                            },
                            onTouchMoved: function (node, touch, event) {
                                var pos = touch.getLocation();
                                if (pos.y >= paiInitY) {
                                    moveY = pos.y;
                                } else {

                                }
                                return true;
                            },
                            onTouchEnded: function (node, touch, event) {
                                var pos = touch.getLocation();
                                if ((pos.y - paiInitY > 20) && that.getSelfInfo().qiepai && !isSend) {
                                    isSend = true;
                                    network.send(4111, {
                                        'qiepai_uid': gameData.uid,
                                        'pai_index': idx,
                                        "room_id": gameData.roomId
                                    });
                                }
                            },
                            onTouchCancelled: function (node, touch, event) {
                                var pos = touch.getLocation();
                                if ((pos.y - paiInitY > 20) && that.getSelfInfo().qiepai && !isSend) {
                                    isSend = true;
                                    network.send(4111, {
                                        'qiepai_uid': gameData.uid,
                                        'pai_index': idx,
                                        "room_id": gameData.roomId
                                    });
                                }
                            }
                        })
                })(i, paiArr[i]);
            }
        },
        wholeProcess: function (_data) {
            // AgoraUtil.hideAllVideo();
            // cc.sys.garbageCollect()

            g_paiInfo = _data || g_paiInfo;
            // console.log(g_paiInfo);
            var that = this;
            that.boxDi.setVisible(false);
            cutIdx2 = -1;
            if (paiArr.length == 0) {
                for (var j = 0; j < PAI_COUNT; j++) {
                    var pai = new cc.Sprite('res/submodules/psz/image/common/pai_back3.png');
                    this.addChild(pai);
                    paiArr.push(pai);
                    pai.setLocalZOrder(j);
                    pai.y = -200
                }
            } else {
                for (var j = 0; j < PAI_COUNT; j++) {
                    var pai = paiArr[j];
                    pai.setVisible(true);
                    pai.setScale(1);
                    pai.setLocalZOrder(j);
                }
            }
            //倒计时
            $('secLabel').setString(g_paiInfo[0].sec || '0');
            $('secLabel').setVisible(true);
            if (g_paiInfo[0].sec > 0) {
                $('pass').setVisible(true);
                $('pass.txt').setString("跳过( " + g_paiInfo[0].sec + " )");
            }

            if (g_timeInterval) {
                clearInterval(g_timeInterval);
                g_timeInterval = null;
            }
            g_timeInterval = setInterval(function () {
                g_paiInfo[0].sec -= 1;
                if (g_paiInfo[0].sec <= 0 || (cc.sys.isObjectValid($('secLabel')) && !$('secLabel').isVisible())) {
                    g_paiInfo[0].sec = 0;
                    $('secLabel').setString(Math.floor(g_paiInfo[0].sec));
                    $('pass.txt').setString("跳过( " + g_paiInfo[0].sec + " )");
                    clearInterval(g_timeInterval);
                    g_timeInterval = undefined;
                    return;
                }
                $('secLabel').setString(Math.floor(g_paiInfo[0].sec));
                $('pass.txt').setString("跳过( " + Math.floor(g_paiInfo[0].sec) + " )");
            }, 1000);

            //
            $('panel').setVisible(true);
            that.boxBan.setVisible(false);
            $('panel').runAction(cc.fadeIn(0.3));


            var showPais = function () {
                var cutIdx = -1;
                process_idx = PROCESS_SHOW;
                var fapaiInterval = null;
                fapaiInterval = setInterval(function () {
                    cutIdx++;
                    cutIdx++;
                    if (cutIdx >= paiArr.length) {
                        cutIdx = 0;
                        if (fapaiInterval) {
                            clearInterval(fapaiInterval);
                            fapaiInterval = null;
                        }
                        that.cutPais();
                        return;
                    }
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = paiArr[i];
                        if (i < cutIdx) {
                            var angle = (PAI_COUNT / 2 - i) * R_RATE;
                            pai.setPosition(upAngleToPosition(angle, CENTER_POS, GLOBAL_R, -i));
                            pai.setRotation(-angle);
                        } else {
                            var angle = (PAI_COUNT / 2 - cutIdx) * R_RATE;
                            pai.setPosition(fixPaiPosition2(angle, CENTER_POS, GLOBAL_R, i - cutIdx));
                            pai.setRotation(-angle);
                        }
                    }
                }, 10);

                $('tipsLable').setVisible(true)
                $('qiepai_bg').setVisible(true);
                var userinfo = that.getSelfInfo();
                if (userinfo && userinfo.qiepai) {
                    $('tipsLable').setString('双击或向上拖动切牌');
                    $('tipsLable').setColor(cc.color(255, 255, 255));
                    $('qiepai_tips').setVisible(true)
                } else {
                    $('tipsLable').setString('等待其他玩家切牌中...');
                    $('tipsLable').setColor(cc.color(255, 255, 255));
                    $('qiepai_tips').setVisible(false)
                    $('pass').setVisible(false)
                }

                // $('tipsLable').runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.3),cc.fadeIn(0.5),cc.delayTime(1))));
            }
            showPais();
        },
    });
    exports.FapaiUpdateLayer = FapaiUpdateLayer;
    exports.moveCircleToScheduleUpdate = moveCircleToScheduleUpdate;
})(window);
