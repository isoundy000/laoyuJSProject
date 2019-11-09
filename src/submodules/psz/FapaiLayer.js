/**
 * Created by hjx on 2017/10/19.
 *
 * 本版本是继承 cocos底层 Action
 *      是切牌动画的第一版 完成之后发现 android ios底层不知道Action重写。。。所以废弃。
 */

(function () {
    var exports = this;
    var $ = null;

    var PROCESS_SHOW = 1;
    var PROCESS_CUT = 2;
    var PROCESS_TO_PIECE2= 3;
    var PROCESS_TO_PIECE1= 4;
    var PROCESS_MOVE_TO_ORIGIN = 5;

    var CENTER_POS = cc.p(640, -700);

    //角度计算位置
    var upAngleToPosition = function (angle, center, R) {
        angle = angle || 0;
        center = center || cc.p(0, 0);
        R = R || 100;
        var x = center.x + Math.cos((angle + 90) / 180 * Math.PI) * R;
        var y = center.y + Math.sin((angle + 90) / 180 * Math.PI) * R;
        return cc.p(x, y);
    }

    //修正位置 显示立体效果
    var fixPaiPosition1 = function (angle, center, R, deep) {
        var pos = upAngleToPosition(angle, center, R);
        pos.x += (deep / 2)
        pos.y += (deep / 7)
        return pos;
    }
    var fixPaiPosition2 = function (angle, center, R, deep) {
        var pos = upAngleToPosition(angle, center, R);
        pos.x += Math.cos((angle + 90) / 180 * Math.PI) * (deep) * 1.25;
        pos.y += Math.sin((angle + 90) / 180 * Math.PI) * (deep) * 0.25;
        return pos;
    }

    /**
     * 绕固定圆心 向目标点移动动作
     * @type {*}
     */
    if(cc.sys.isNative){
        cc.ActionInterval = cc.Class;
    }
    cc.MoveCircleTo = cc.ActionInterval.extend({
        _positionDelta: null,
        _startPosition: null,
        _previousPosition: null,
        _targetPos:null,
        _centerPos : null,
        _endR:null,
        _R :null,
        ctor: function (duration, center, targetPos) {
            cc.ActionInterval.prototype.ctor.call(this);
            this._positionDelta = cc.p(0, 0);
            this._startPosition = cc.p(0, 0);
            this._previousPosition = cc.p(0, 0);
            this._targetPos = targetPos || cc.p(0, 0);
            this._centerPos = center || cc.p(0, 0);
            this.initWithDuration(duration);
        },
        initWithDuration: function (duration) {
            if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
                return true;
            }
            return false;
        },
        startWithTarget: function (target) {
            cc.ActionInterval.prototype.startWithTarget.call(this, target);
            var locPosX = target.getPositionX();
            var locPosY = target.getPositionY();
            this._startPosition.x = locPosX;
            this._startPosition.y = locPosY;
            this._R = Math.sqrt((this._centerPos.x-this._startPosition.x)*(this._centerPos.x-this._startPosition.x) + (this._centerPos.y-this._startPosition.y)*(this._centerPos.y-this._startPosition.y))
            this._endR = Math.sqrt((this._centerPos.x-this._targetPos.x)*(this._centerPos.x-this._targetPos.x) + (this._centerPos.y-this._targetPos.y)*(this._centerPos.y-this._targetPos.y))
            this._startRad = Math.atan((this._startPosition.y-this._centerPos.y)/(this._startPosition.x-this._centerPos.x));
            this._endRad = Math.atan((this._targetPos.y-this._centerPos.y)/(this._targetPos.x-this._centerPos.x));
            this._startRad<0 ? this._startRad+=Math.PI : 0;
            this._endRad<0 ? this._endRad+=Math.PI : 0;
        },
        update: function (dt) {
            if (this.target) {
                var locStartPosition = this._centerPos;
                if (cc.ENABLE_STACKABLE_ACTIONS) {
                    var R = this._R + (this._endR-this._R)*dt;
                    var rat = this._startRad + dt*(this._endRad-this._startRad);//dt * 3.1415926 * 2;
                    var x = locStartPosition.x + R * Math.cos(rat);
                    var y = locStartPosition.y + R * Math.sin(rat);
                    this.target.setPosition(x, y);
                } else {
                    this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
                }
            }
        }
    });
    cc.moveCircleTo = function (duration, center, targetPos, startPos) {
        if(!cc.sys.isNative){
            return new cc.MoveCircleTo(duration, center, targetPos)
        }

        var xoff = targetPos.x - startPos.x;
        var yoff = targetPos.y - startPos.y;
        var dis = Math.sqrt((xoff*xoff)+(yoff*yoff));
        if(xoff==0){
            xoff = 0.00000000001;
        }
        var rad = Math.atan(yoff/xoff);
        if(xoff<0){
            rad-=Math.PI
        }
        // rad<0 ? rad+=Math.PI : 0;
        var controlPoints2 = [
            cc.p(startPos.x+Math.cos(rad)*dis/2,   startPos.y + dis / 15),
            cc.p(startPos.x+Math.cos(rad)*dis/2, startPos.y + dis / 15 ),
            targetPos
        ];
        return  cc.bezierTo(duration, controlPoints2);
    }

    var FapaiLayer = cc.Layer.extend({
        onCCSLoadFinish: function () {
        },
        ctor: function (_delay) {
            this._super();
            var that = this;

            var mainscene = ccs.load(res.FapaiLayer_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Layer"));


            // TouchUtils.setOnclickListener($('root'), function () {
            //
            // });

            //version1 堆牌显示立体效果
            // for(var i=0; i<45; i++){
            //     var pai = $('pai_back2_1_' + i);
            //     pai.x += i/2;
            //     pai.y += i/4;
            //     pai.setRotation(15);
            // }

            //version 2 利用函数计算位置 任意角度平铺扑克牌
            // for(var i=0; i<52; i++){
            //     var pai = new cc.Sprite('res/ui/resources/unit/pai_back3.png');
            //     var angle = (i-26) * 1.15;
            //     pai.setPosition(upAngleToPosition(angle,cc.p(640,-700),1100));
            //     pai.setRotation(-angle);
            //     pai.setLocalZOrder(100-i);
            //     this.addChild(pai);
            // }

            //堆叠放置 添加立体效果
            // for(var i=0; i<7; i++){
            //     //从左向右
            //     for(var j=0; j<52; j++){
            //         var pai = new cc.Sprite('res/ui/resources/unit/pai_back3.png');
            //         var angle = (i*9-26) * 1.15;
            //         pai.setPosition(fixPaiPosition2(angle,cc.p(640,-700),1100, j));
            //         pai.setRotation(-angle);
            //         pai.setLocalZOrder(100-i);
            //         this.addChild(pai);
            //     }
            // }

            //version 3 添加可变状态
            // var cutIdx = 40;
            // for(var j=0; j<52; j++){
            //     var pai = new cc.Sprite('res/ui/resources/unit/pai_back3.png');
            //     var angle = (26-j) * 1.15;
            //     pai.setPosition(upAngleToPosition(angle,cc.p(640,-700),1100, j));
            //     pai.setRotation(-angle);
            //     if(j>=cutIdx){
            //         angle = (26-cutIdx) * 1.15;
            //         pai.setPosition(fixPaiPosition1(angle,cc.p(640,-700),1100, j));
            //         pai.setRotation(-angle);
            //     }
            //     this.addChild(pai);
            // }

            //version 4 添加动画 来回展牌 收牌
            // this.paiOpenAndClose();

            //version5 中间位置直接分牌
            // this.splitPaisByAnim();

            //version6 直接抄袭视频玩法 全部切牌逻辑添加
            this.wholeProcess();

            //version7 中间堆牌显示
            // this.centerShowPais();

            return true;
        },
        centerShowPais : function () {
            var paiArr = [];
            for (var j = 0; j < 52; j++) {
                var pai = new cc.Sprite('res/image/ui/zjh/unit/pai_back3.png');
                this.addChild(pai);
                paiArr.push(pai);
                var angle = 0 ;
                pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, j*2));
                pai.setRotation(90);
            }
        },
        wholeProcess : function () {
            var process_idx = 0;
            var cutIdx = -1;
            var cutIdx2 = -1;
            var paiArr = [];
            for (var j = 0; j < 52; j++) {
                var pai = new cc.Sprite('res/image/ui/zjh/unit/pai_back3.png');
                this.addChild(pai);
                paiArr.push(pai);
                pai.y = -200
            }
            var moveTo1Piece = function () {
                process_idx = PROCESS_TO_PIECE1;
                for (var j = 0; j < 52; j++) {
                    var pai = paiArr[j];
                    var angle = 0;
                    pai.runAction(
                        cc.spawn(
                            cc.moveCircleTo(0.7, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, j * 2),pai.getPosition()),
                            cc.rotateTo(0.7, 90)
                        ).easing(cc.easeOut(0.7))
                    );
                }
            }
            var moveTo2Pieces = function () {
                process_idx = PROCESS_TO_PIECE2;
                for (var i = 0; i < paiArr.length; i++) {
                    var pai = paiArr[i];
                    if (i < cutIdx2) {
                        var start = 0;
                        var angle = (26 - start) * 1.15;
                        pai.runAction(
                            cc.spawn(
                                cc.moveCircleTo(1, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, i - start),pai.getPosition()),
                                cc.rotateTo(1, -angle)
                            )
                        );
                    } else if(i==cutIdx2){
                        var end = 51;
                        var angle = (26 - end) * 1.15;
                        pai.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.moveCircleTo(1, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100 * 1.05, i),pai.getPosition()),
                                    cc.rotateTo(1, -angle)
                                ),
                                cc.moveCircleTo(0.35, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, i),pai.getPosition()).easing(cc.easeOut(0.35)),
                                cc.callFunc(function () {
                                    setTimeout(function () {
                                        moveTo1Piece();
                                    },1)
                                })
                            )
                        );
                    }else{
                        var end = 51;
                        var angle = (26 - end) * 1.15;
                        pai.runAction(
                            cc.spawn(
                                cc.moveCircleTo(1, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, i),pai.getPosition()),
                                cc.rotateTo(1, -angle)
                            )
                        );
                    }
                }
            }
            var cutPais = function () {
                process_idx = PROCESS_CUT;
                for (var i = 0; i < paiArr.length; i++) {
                    (function (idx, pai){
                        TouchUtils.setOnclickListener(pai, function () {
                            if(process_idx!=PROCESS_CUT)return;
                            process_idx = -1;
                            cutIdx2 = idx;
                            var curPos = pai.getPosition();
                            var x = curPos.x + (curPos.x - CENTER_POS.x) * 0.05;
                            var y = curPos.y + (curPos.y - CENTER_POS.y) * 0.05;
                            pai.runAction(
                                cc.sequence(
                                    cc.moveCircleTo(0.15, CENTER_POS, cc.p(x,y),pai.getPosition()).easing(cc.easeOut(0.15)),
                                    cc.callFunc(function () {
                                        moveTo2Pieces();
                                    })
                                ));
                        })
                    })(i, paiArr[i]);
                }
            }

            var showPais = function () {
                process_idx = PROCESS_SHOW;
                var fapaiInterval = setInterval(function () {
                    cutIdx++;
                    if (cutIdx >= paiArr.length) {
                        cutIdx = 0;
                        clearInterval(fapaiInterval);
                        cutPais();
                        return;
                    }
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = paiArr[i];
                        if (i < cutIdx) {
                            var angle = (26 - i) * 1.15;
                            pai.setPosition(upAngleToPosition(angle, CENTER_POS, 1100, i));
                            pai.setRotation(-angle);
                        } else {
                            var angle = (26 - cutIdx) * 1.15;
                            pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, i - cutIdx));
                            pai.setRotation(-angle);
                        }
                    }
                },50);
            }
            showPais();
        },
        paiOpenAndClose: function () {
            var cutIdx = -1;
            var paiArr = [];
            var dir = 1;
            for (var j = 0; j < 52; j++) {
                var pai = new cc.Sprite('res/image/ui/zjh/unit/pai_back3.png');
                this.addChild(pai);
                paiArr.push(pai);
            }
            setInterval(function () {
                cutIdx++;
                if (dir == 1) {
                    if (cutIdx >= paiArr.length) {
                        dir = -1;
                        cutIdx = 0;
                        return;
                    }
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = paiArr[i];
                        if (i < cutIdx) {
                            var angle = (26 - i) * 1.15;
                            pai.setPosition(upAngleToPosition(angle, CENTER_POS, 1100, j));
                            pai.setRotation(-angle);
                        } else {
                            var angle = (26 - cutIdx) * 1.15;
                            pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, i - cutIdx));
                            pai.setRotation(-angle);
                        }
                    }
                } else if (dir == -1) {
                    if (cutIdx >= paiArr.length) {
                        dir = 1;
                        cutIdx = 0;
                        return;
                    }
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = paiArr[i];
                        if (i < cutIdx) {
                            var angle = (26 - cutIdx) * 1.15;
                            pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, -i));
                            pai.setRotation(-angle);
                        } else {
                            var angle = (26 - i) * 1.15;
                            pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, -i));
                            pai.setRotation(-angle);
                        }
                    }
                }
            }, 50)
        },
        splitPaisByAnim: function () {
            var cutIdx = -1;
            var cutIdx2 = 15;
            var paiArr = [];
            var dir = 1;
            for (var j = 0; j < 52; j++) {
                var pai = new cc.Sprite('res/image/ui/zjh/unit/pai_back3.png');
                this.addChild(pai);
                paiArr.push(pai);
                var angle = (26 - j) * 1.15;
                pai.setPosition(upAngleToPosition(angle, CENTER_POS, 1100, j));
                pai.setRotation(-angle);
            }
            var fapaiInterval = setInterval(function () {
                cutIdx++;
                if (dir == 1) {
                    if (cutIdx >= paiArr.length) {
                        dir = -1;
                        cutIdx = 0;
                        clearInterval(fapaiInterval);
                        setTimeout(function () {
                            for (var i = 0; i < paiArr.length; i++) {
                                var pai = paiArr[i];
                                if (i < cutIdx2) {
                                    var start = 0;
                                    var angle = (26 - start) * 1.15;
                                    // pai.setPosition(fixPaiPosition2(angle,cc.p(640,-700),1100, i-start));
                                    pai.runAction(
                                        cc.spawn(
                                            cc.moveCircleTo(1, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, i - start),pai.getPosition()),
                                            cc.rotateTo(1, -angle)
                                        )
                                    );
                                } else {
                                    var end = 51;
                                    var angle = (26 - end) * 1.15;
                                    pai.runAction(
                                        cc.spawn(
                                            cc.moveCircleTo(1, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, i),pai.getPosition()),
                                            cc.rotateTo(1, -angle)
                                        )
                                    );
                                }
                            }
                        }, 1000)

                        setTimeout(function () {
                            for (var j = 0; j < 52; j++) {
                                var pai = paiArr[j];
                                var angle = 0 ;
                                // pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, j));
                                // pai.setRotation(90);
                                pai.runAction(
                                    cc.spawn(
                                        cc.moveCircleTo(1, CENTER_POS, fixPaiPosition2(angle, CENTER_POS, 1100, j*2),pai.getPosition()),
                                        cc.rotateTo(1, 90)
                                    ).easing(cc.easeOut(1.0))
                                );
                            }
                        }, 2500);
                        return;
                    }
                    for (var i = 0; i < paiArr.length; i++) {
                        var pai = paiArr[i];
                        if (i < cutIdx) {
                            var angle = (26 - i) * 1.15;
                            pai.setPosition(upAngleToPosition(angle, CENTER_POS, 1100, j));
                            pai.setRotation(-angle);
                        } else {
                            var angle = (26 - cutIdx) * 1.15;
                            pai.setPosition(fixPaiPosition2(angle, CENTER_POS, 1100, i - cutIdx));
                            pai.setRotation(-angle);
                        }
                    }
                }
            },50);

        }
    });
    exports.FapaiLayer = FapaiLayer;
})(window);
