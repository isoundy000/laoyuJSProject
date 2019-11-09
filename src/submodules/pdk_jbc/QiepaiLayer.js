/**
 * Created by hjx on 2018/6/19.
 */

(function () {
    var exports = this;
    var $ = null;
    var choose_idx = 27;
    var leftTime = 10;
    var qieUid = 0;



    var PROCESS_SHOW = 1;
    var PROCESS_CUT = 2;
    var PROCESS_TO_PIECE2 = 3;
    var PROCESS_TO_PIECE1 = 4;
    var PROCESS_MOVE_TO_BOX = 5;
    var PROCESS_SEND_PAI = 6;

    var PAI_COUNT = 48;
    var GLOBAL_R = 1100;
    var SPEED_RATE = 0.5;
    var R_RATE = 1.00;

    var CENTER_POS = cc.p(640, -600);
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
        var x = center.x + Math.cos((angle + 90) / 180 * Math.PI) * R;
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

    var QiepaiLayer_old = cc.Layer.extend({
        onCCSLoadFinish: function () {
        },
        ctor: function (data) {
            this._super();
            var that = this;


            var mainscene = ccs.load(res.PkQiepai_pdk_json, 'res/');
            this.addChild(mainscene.node);

            $ = create$(this.getChildByName("Layer"));
            paiArr = [];

            TouchUtils.setOnclickListener($('root'), function () {

            });
            TouchUtils.setOnclickListener($('btn_qie'), function () {
                network.send(4111, {room_id: gameData.roomId, qiepai_index:0, is_real_qiepai:true});
            });

            $('slider').addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.Slider.EVENT_PERCENT_CHANGED:
                        var slider = sender;
                        var percent = slider.getPercent();
                        // console.log(Math.floor(percent));
                        choose_idx = Math.floor(48 * percent/100)
                        network.send(4111, {room_id: gameData.roomId, qiepai_index:choose_idx, is_real_qiepai:false});
                        break;
                    default:
                        console.log("event : " + type);
                        break;
                }
            }, null);

            choose_idx = 27;
            qieUid = data.qiepai_uid;
            leftTime = data.sec || 0;
            choose_idx = data.qiepai_index || 0;
            $('slider').setPercent(choose_idx/48 * 100);
            $('sec').setString(leftTime);
            var changeTimeFunc = function () {
                $('sec').setString(leftTime);
                leftTime--;
                if(leftTime<0){
                    that.unschedule(changeTimeFunc);
                }
            }
            this.schedule(changeTimeFunc, 1 )


            network.addListener(4111, function (data) {
                // var qieUid = data.qiepai_uid;
                // that.addChild(new QiepaiLayer(data));
                console.log(JSON.stringify(data));

                if(data.is_real_qiepai){
                    console.log("玩家切牌完毕----");
                    // that.removeFromParent();
                    that.choosePaiForCut(data.qiepai_index);
                }
            });

            this.wholeProcess();
            return true;
        },
        choosePaiForCut: function (idx) {
            network.stop(undefined, "切牌中")
            $('tipsLable').setVisible(false);
            $('sec').setVisible(false);
            $('btn_qie').setVisible(false);
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
                        //that.moveToBox();
                        console.log("切牌结束-----");
                        network.start("切牌结束");
                        that.removeFromParent();
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
            $('root').runAction(
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
            if (qieUid!=gameData.uid) {
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
                                if (time - preTime < 400 && !isSend) {
                                    isSend = true;
                                    network.send(4111, {
                                        'qiepai_uid': gameData.uid,
                                        'qiepai_index': idx,
                                        "room_id": gameData.roomId,
                                        is_real_qiepai:true
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
                                if ((pos.y - paiInitY > 20) && !isSend) {
                                    isSend = true;
                                    network.send(4111, {
                                        'qiepai_uid': gameData.uid,
                                        'qiepai_index': idx,
                                        "room_id": gameData.roomId,
                                        is_real_qiepai:true
                                    });
                                }
                            },
                            onTouchCancelled: function (node, touch, event) {
                                var pos = touch.getLocation();
                                if ((pos.y - paiInitY > 20)  && !isSend) {
                                    isSend = true;
                                    network.send(4111, {
                                        'qiepai_uid': gameData.uid,
                                        'qiepai_index': idx,
                                        "room_id": gameData.roomId,
                                        is_real_qiepai:true
                                    });
                                }
                            }
                        })
                })(i, paiArr[i]);
            }
        },

        wholeProcess: function (_data) {
            var that = this;
            cutIdx2 = -1;
            if (paiArr.length == 0) {
                for (var j = 0; j < PAI_COUNT; j++) {
                    var pai = new cc.Sprite('res/submodules/pdk/image/common/pai_back3.png');
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
                if (qieUid == gameData.uid) {
                    $('tipsLable').setString('双击或向上拖动切牌');
                    $('tipsLable').setColor(cc.color(255, 255, 255));
                    $('qiepai_tips').setVisible(true)
                } else {
                    $('tipsLable').setString('等待其他玩家切牌中...');
                    $('tipsLable').setColor(cc.color(255, 255, 255));
                    $('qiepai_tips').setVisible(false)
                    $('btn_qie').setVisible(false)
                }
            }
            showPais();
        }
    });




    var QiepaiLayer = cc.Layer.extend({
        ctor: function (data, posInfo) {
            this._super();
            var that = this;


            var mainscene = ccs.load(res.PkQiepai_pdk_json, 'res/');
            this.addChild(mainscene.node);

            $ = create$(this.getChildByName("Layer"));
            TouchUtils.setOnclickListener($('root'), function () {

            });
            $('btn_qie').setVisible(false);

            qieUid = data.qiepai_uid;
            leftTime = data.sec || 0;
            choose_idx = data.qiepai_index || 0;
            $('slider').setPercent(choose_idx/48 * 100);
            $('sec').setString(leftTime);
            var changeTimeFunc = function () {
                $('sec').setString(leftTime);
                leftTime--;
                if(leftTime<0){
                    that.unschedule(changeTimeFunc);
                }
            }
            this.schedule(changeTimeFunc, 1 )

            if(qieUid==gameData.uid){
                $('qiepai_tips2').setVisible(false);
            }else{
                $('qiepai_tips1').setVisible(false);
            }
            $('word_zbqp' + (posInfo[qieUid] || 0)).setVisible(true);


            network.addListener(4111, function (data) {
                // var qieUid = data.qiepai_uid;
                // that.addChild(new QiepaiLayer(data));
                console.log(JSON.stringify(data));

                if(data.is_real_qiepai){
                    console.log("玩家切牌完毕----");
                    // that.removeFromParent();
                    //that.choosePaiForCut(data.qiepai_index);


                    that.cutOverAnim(data.qiepai_index)
                }else{
                    that.upPai(data.qiepai_index);
                }
            });

            //this.initView();
            this.castCards();
            return true;
        },
        cutOverAnim : function (idx) {
            network.stop();
            $('huadong').setVisible(false)
            $('sec').setVisible(false)
            $('qiepai_tips2').setVisible(false)
            $('qiepai_tips1').setVisible(false)
            $('btn_qie').setVisible(false)
            var i=0;
            for (var j = idx; j < PAI_COUNT; j++) {
                var pai = $('paisNode.pai' + j);
                pai.runAction(cc.sequence(cc.moveTo(0.35, 0+ (i-PAI_COUNT/2)*0.4, 200), cc.callFunc(
                    function () {
                        for (var j = idx; j < PAI_COUNT; j++){
                            var pai = $('paisNode.pai' + j);
                            pai.setLocalZOrder(-100 + j);
                        }
                    }
                ), cc.delayTime(0.35), cc.moveTo(0.1, 0,200), cc.moveTo(0.3, 0,0).easing(cc.easeOut(3))));
                i++;
            }
            for (var j = 0; j < idx; j++) {
                var pai = $('paisNode.pai' + j);
                pai.runAction(cc.sequence(
                    cc.delayTime(0.35),
                    cc.moveTo(0.35, 0 + (i-PAI_COUNT/2)*0.4, 200),
                    cc.moveTo(0.1, 0,200),
                    cc.moveTo(0.3, 0,0).easing(cc.easeOut(3))));
                i++;
            }
            var that = this;
            this.runAction(cc.sequence(cc.delayTime(1.0),cc.fadeOut(0.3),cc.callFunc(function () {
                network.start();
            }),cc.removeSelf()));

        },
        initViewEvent : function () {
            var that = this;

            if(qieUid!=gameData.uid){
                return;
            }
            $('btn_qie').setVisible(true);

            TouchUtils.setOnclickListener($('btn_qie'), function () {
                network.send(4111, {room_id: gameData.roomId, qiepai_index:choose_idx, is_real_qiepai:true});
            });
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function (touch, event) {
                    if (TouchUtils.isTouchMe($('huadong'), touch, event, null, cc.rect(0,-30,1150,200))) {
                        var locationInNode = $('huadong').convertToNodeSpace(touch.getLocation());
                        var idx = Math.floor(locationInNode.x / 21.5);
                        if(idx>=PAI_COUNT){
                            idx = PAI_COUNT-1;
                        }
                        if(choose_idx==idx)return true;
                        choose_idx = idx;
                        that.upPai(choose_idx);
                        return true;
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    if (TouchUtils.isTouchMe($('huadong'), touch, event, null, cc.rect(0,-30,1150,200))) {
                        var locationInNode = $('huadong').convertToNodeSpace(touch.getLocation());
                        var idx = Math.floor(locationInNode.x / 21.5);
                        if(idx>=PAI_COUNT){
                            idx = PAI_COUNT-1;
                        }
                        if(choose_idx==idx)return ;
                        choose_idx = idx;
                        that.upPai(choose_idx);
                    }
                },
                onTouchEnded: function (touch, event) {
                    network.send(4111, {room_id: gameData.roomId, qiepai_index:choose_idx, is_real_qiepai:false});
                }
            }), $('huadong'));
        },
        upPai : function (idx) {
            if(idx>=0 && idx<PAI_COUNT){
                var pai = $('paisNode.pai' + idx);
                // pai.stopAllActions()
                // pai.runAction(cc.moveTo(0.08, pai.x, 50).easing(cc.easeOut(1.5)))
                pai.y = 50;
            }
            for (var j = 0; j < PAI_COUNT; j++) {
                if(j!=idx){
                    this.downPai(j);
                }
            }
            $('huadong.icon_jiantou').x = idx * 21.5;
        },
        downPai : function (idx) {
            if(idx>=0 && idx<PAI_COUNT){
                var pai = $('paisNode.pai' + idx);
                // pai.stopAllActions()
                // pai.runAction(cc.moveTo(0.08, pai.x, 0).easing(cc.easeOut(1.5)))
                pai.y = 0;
            }
        },
        castCards : function () {
            var that =this;
            for (var j = 0; j < PAI_COUNT; j++) {
                var pai = new cc.Sprite('res/submodules/pdk/image/common/pai_back3.png');
                $('paisNode').addChild(pai);
                pai.x = (j - PAI_COUNT/2);
                pai.setName('pai' + j);

                pai.runAction(
                    cc.moveTo(0.2, (j - PAI_COUNT/2) * 21.5, 0).easing(cc.easeOut(1.5))
                )
            }
            if(_.isNumber(choose_idx)){
                this.scheduleOnce(function () {
                    that.upPai(choose_idx);
                    that.initViewEvent();
                }, 0.21)
            }
        }
    });
    exports.QiepaiLayer_old = QiepaiLayer_old;
    exports.QiepaiLayer = QiepaiLayer;
})(window);