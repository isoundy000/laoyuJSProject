/**
 * Created by zhangluxin on 16/6/29.
 */
var mEffect = {
    liangPai: function (showCard, userPos) {
        var _moveCoefficient = 1;
        if(userPos == 0)_moveCoefficient = 0.5;

        var img = showCard.getChildByName("img");
        img.stopAllActions();
        showCard.stopAllActions();
        var begin_pos;
        var show_pos;
        var end_pos;
        begin_pos = cc.p(1280/2, 520);
        show_pos = cc.p(1280/2, 350);
        if(mRoom.getPlayerNum() == 3){
            if (userPos == 0) {
                end_pos = cc.p(1280/2, 100);
            } else if (userPos == 1) {
                end_pos = cc.p(1280 - 100, 350);
            } else {
                end_pos = cc.p(100, 350);
            }
        }else{
            if (userPos == 0) {
                end_pos = cc.p(1280/2, 100);
            } else if (userPos == 1) {
                end_pos = cc.p(1180, 350);
            } else if (userPos == 2) {
                end_pos = cc.p(1280/2, 350);
            }else{
                end_pos = cc.p(100, 350);
            }
        }
        showCard.setPosition(begin_pos);
        img.setScale(0.5);
        if(mRoom.isReplay){
            showCard.runAction(cc.sequence(
                cc.moveTo(0.2*_moveCoefficient, show_pos),
                cc.delayTime(0.5*_moveCoefficient),
                cc.moveTo(0.2*_moveCoefficient, end_pos),
                cc.callFunc(function () {
                    showCard.setVisible(false);
                })
            ));
        }else{
            showCard.runAction(cc.sequence(
                cc.moveTo(0.2*_moveCoefficient, show_pos),
                cc.delayTime(0.5*_moveCoefficient),
                cc.moveTo(0.2*_moveCoefficient, end_pos),
                cc.callFunc(function () {
                    showCard.setVisible(false);
                })
            ));
        }
        img.runAction(cc.sequence(
            cc.scaleTo(0.2*_moveCoefficient, 1),
            cc.delayTime((0.2 + 2)*_moveCoefficient),
            cc.scaleTo(0.2*_moveCoefficient, 0.5)
        ));
    },
    chuPai: function (showCard, userPos) {
        var _moveCoefficient = 1;
        if(userPos == 0)_moveCoefficient = 0.5;
        var img = showCard.getChildByName("img");
        img.stopAllActions();
        showCard.stopAllActions();
        var begin_pos;
        var end_pos;
        var rotated = null;
        if(mRoom.getPlayerNum() == 3){
            if (userPos == 0) {
                begin_pos = cc.p(1280/2, 100);
                end_pos = cc.p(1280/2, 320);
            } else if (userPos == 1) {
                begin_pos = cc.p(1280 - 160, 350);
                end_pos = cc.p(1280 - 260, 320);
            } else {
                begin_pos = cc.p(160, 350);
                end_pos = cc.p(260, 320);
            }
        }else{
            if(mRoom.wanfatype == mRoom.HENGYANG || mRoom.wanfatype == mRoom.MAOHUZI){
                if (userPos == 0) {
                    begin_pos = cc.p(1280/2, 100);
                    end_pos = cc.p(1280/2, 360);
                    rotated = 90;
                } else if (userPos == 1) {
                    begin_pos = cc.p(1180, 150);
                    end_pos = cc.p(800, 200);
                    rotated = 0;
                } else if (userPos == 2) {
                    begin_pos = cc.p(1180, 400);
                    end_pos = cc.p(800, 450);
                    rotated = 90;
                } else {
                    begin_pos = cc.p(100, 350);
                    end_pos = cc.p(200, 350);
                    rotated = 0;
                }
            }else {
                if (userPos == 0) {
                    begin_pos = cc.p(1280/2, 100);
                    end_pos = cc.p(1280/2, 365);
                    rotated = 90;
                } else if (userPos == 1) {
                    begin_pos = cc.p(1280-100, 320);
                    end_pos = cc.p(1280-300-50, 350);//ruru
                    rotated = 0;
                } else if (userPos == 2) {
                    begin_pos = cc.p(1280/2, 700);
                    end_pos = cc.p(1280/2, 600);
                    rotated = 90;
                } else {
                    begin_pos = cc.p(100, 350);
                    end_pos = cc.p(300+50, 350);//ruru
                    rotated = 0;
                }
            }

        }
        if(mRoom.wanfatype == mRoom.HENGYANG || mRoom.wanfatype == mRoom.MAOHUZI){
        }else {
            if (rotated != null) {
                showCard.setRotation(rotated);
            }
        }
        showCard.setPosition(begin_pos);
        img.setScale(0.5);
        showCard.runAction(cc.moveTo(0.2*_moveCoefficient, cc.p(end_pos.x - 60, end_pos.y)));
        img.runAction(cc.scaleTo(0.2*_moveCoefficient, 1));
    },
    moPai: function (showCard, userPos) {
        var _moveCoefficient = 1;
        if(userPos == 0)_moveCoefficient = 0.5;
        var img = showCard;
        img.stopAllActions();
        showCard.stopAllActions();
        var begin_pos = cc.p(1280/2, 520);
        var end_pos;
        var rotated = null;
        if(mRoom.getPlayerNum() == 3){
            if (userPos == 0) {
                end_pos = cc.p(1280/2, 320);
            } else if (userPos == 1) {
                end_pos = cc.p(1280 - 260, 320);
            } else {
                end_pos = cc.p(260, 320);
            }
        }else{
            if(mRoom.wanfatype == mRoom.HENGYANG || mRoom.wanfatype == mRoom.MAOHUZI){
                if (userPos == 0) {
                    begin_pos = cc.p(1136/2, 100);
                    end_pos = cc.p(1136/2, 360);
                    rotated = 90;
                } else if (userPos == 1) {
                    begin_pos = cc.p(1180, 150);
                    end_pos = cc.p(800, 200);
                    rotated = 0;
                } else if (userPos == 2) {
                    begin_pos = cc.p(1180, 400);
                    end_pos = cc.p(800, 450);
                    rotated = 90;
                } else {
                    begin_pos = cc.p(100, 350);
                    end_pos = cc.p(200, 350);
                    rotated = 0;
                }
            }else {
                if (userPos == 0) {
                    end_pos = cc.p(1280/2, 365);
                    begin_pos = cc.p(1280/2, 550);
                    rotated = 90;
                } else if (userPos == 1) {
                    end_pos = cc.p(1280-200-50, 450);//ruru
                    begin_pos = cc.p(1280/2, 450);
                    rotated = 0;
                } else if (userPos == 2) {
                    end_pos = cc.p(1280/2, 600);
                    begin_pos = cc.p(1280/2, 450);
                    rotated = 90;
                } else {
                    end_pos = cc.p(200+50, 450); //ruru
                    begin_pos = cc.p(1280/2, 450);
                    rotated = 0;
                }
            }

        }
        if(mRoom.wanfatype == mRoom.HENGYANG || mRoom.wanfatype == mRoom.MAOHUZI){
        }else {
            if (rotated != null) {
                showCard.setRotation(rotated);
            }
        }
        showCard.setPosition(begin_pos);
        img.setScale(0.5);
        showCard.runAction(
            cc.sequence(
                cc.moveTo(0.3*_moveCoefficient, cc.p(end_pos.x - 60, end_pos.y)),
                cc.callFunc(function () {
                    // showCard.setVisible(false);
                })
            )
        );
        img.runAction(cc.scaleTo(0.2*_moveCoefficient, 1));
    },
    //手牌   吃的哪几张牌
    chiPai: function (openCards, userPos, time) {
        var _moveCoefficient = 1;
        if(userPos == 0)_moveCoefficient = 0.5;
        _moveCoefficient = _moveCoefficient * time;
        // if(mRoom.isReplay){
        //     return;
        // }
        userPos = userPos || 0;
        var colIndex = openCards.getColIndex();
        var children = openCards.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.getTag() == colIndex) {
                if(mRoom.wanfatype == mRoom.YOUXIAN){
                    child.setPositionX(child.getPositionX() + ((userPos == 1)?-250:250));
                    var action = cc.sequence(
                        cc.delayTime(0.6*_moveCoefficient)
                        ,cc.moveBy(0.2*_moveCoefficient, (userPos == 1) ? 250:-250, 0)
                    );
                    child.runAction(action);
                }else{
                    child.setPositionX(child.getPositionX() + ((openCards.getPositionX() >= 1280/2)?-250:250));
                    var action = cc.sequence(
                        cc.delayTime(0.6*_moveCoefficient)
                        ,cc.moveBy(0.2*_moveCoefficient, (openCards.getPositionX() >= 1280/2) ? 250:-250, 0)
                    );
                    child.runAction(action);
                }
            }
        }
    }
};
