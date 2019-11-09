/**
 * Created by dengwenzhong on 2017/5/11.
 */
(function (exports) {

    var $ = null;
    var node = null;
    var effectEmojiQueue = {};
    var TIMESTAMP = 5;
    var effectEmojiCfg = {
        1: {'name': 'zan', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'bomb', 'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3: {'name': 'egg', 'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4: {'name': 'shoe', 'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5: {'name': 'flower', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        6: {'name': 'jiatelin', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        7: {'name': 'maobi', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        8: {'name': 'gongjian', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        9: {'name': 'zhayao', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        10: {'name': 'dapao', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        11: {'name': 'caishen', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        12: {'name': 'qifu', 'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
    };
    var getAngleByPos= function (p1,p2) {
        var p = {}
        p.x = p2.x - p1.x;
        p.y = p2.y - p1.y;
        var r = Math.atan2(p.y,p.x)*180/Math.PI;
        return r

    };
    var usegetEffectEmojiPosFunc = function(){
        if(window.paizhuo == "epz"){
            return true;
        }
        if(window.paizhuo == "13shui"){
            return true;
        }
        return false;
    };
    var onSendEffectEmoji= function (emojiIdx, times, targetUid) {
        if (!cc.sys.isObjectValid(node)) return;
        var _obj = [];
        _obj.push(targetUid);
        if(window.paizhuo == "majiang" || window.paizhuo == "pdk" || window.paizhuo == "scpdk"|| window.paizhuo == "pdk_jbc" || window.paizhuo == "zjh" || window.paizhuo == "majiang_sc" || window.paizhuo == "epz"){
            network.send(4990, {room_id: gameData.roomId, emoji_idx: emojiIdx, emoji_times: times, target_uid: _obj});
        }else{
            // biaoqingdonghua  effectemoji
            var msg = JSON.stringify({roomid: gameData.roomId, type:'biaoqingdonghua',
                content:JSON.stringify({from_uid:gameData.uid, emoji_idx: emojiIdx, emoji_times: times, target_uid: _obj}), from:gameData.uid});
            network.wsData("Say/" + msg);
        }
    };

    var addEffectEmojiQueue= function (caster, patientList, emojiId, times) {
        if (!cc.sys.isObjectValid(node)) return;
        var _casterRow = node.getRowByUid(caster);
        var _patientRowList = [];
        for (var _j = 0; _j < patientList.length; _j++) {
            _patientRowList.push(node.getRowByUid(patientList[_j]));
        }
        if (_.isUndefined(effectEmojiQueue[_casterRow])) {
            effectEmojiQueue[_casterRow] = [];
        }
        var _needBigenQueue = isEffectEmojiEmpty();
        var _obj = {};
        _obj.patientList = _patientRowList;
        _obj.emojiId = emojiId;
        for (var _i = 0; _i < times; _i++) {
            effectEmojiQueue[_casterRow].push(_obj);
        }
        if (_needBigenQueue) {
            startEffectEmojiQueue();
        }
    };
    var isEffectEmojiEmpty= function () {
        if (!cc.sys.isObjectValid(node)) return true;
        for (var _key in effectEmojiQueue) {
            if (effectEmojiQueue.hasOwnProperty(_key)) {
                if (effectEmojiQueue[_key].length > 0) {
                    return false;
                }
            }
        }
        return true;
    };
    var startEffectEmojiQueue= function () {
        if (!cc.sys.isObjectValid(node)) return;
        for (var _key in effectEmojiQueue) {
            if (effectEmojiQueue.hasOwnProperty(_key)) {
                var _obj = effectEmojiQueue[_key];
                if (_obj.length > 0) {
                    for (var _i = 0; _i < _obj[0].patientList.length; _i++) {
                        playEffectEmoji(_key, _obj[0].patientList[_i], _obj[0].emojiId);
                    }
                    effectEmojiQueue[_key].splice(0, 1);
                }
            }
        }
        if (!isEffectEmojiEmpty()) {
            node.runAction(cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function () {
                    startEffectEmojiQueue();
                })
            ))
        }
    };
    var playEffectEmoji= function (caster, patient, emojiId) {
        if (!cc.sys.isObjectValid(node)) return;
        var _emojiCfg = effectEmojiCfg[emojiId];
        if (_.isUndefined(_emojiCfg)) {
            return;
        }
        var sp = new cc.Sprite();
        node.getRootNode().addChild(sp, 30);
        var _frame = cc.spriteFrameCache.getSpriteFrame(_emojiCfg.name + 'temp.png');
        if (!_frame) {
            cc.spriteFrameCache.addSpriteFrames(res['effect_emoji_' + _emojiCfg.name]);
            _frame = cc.spriteFrameCache.getSpriteFrame(_emojiCfg.name + 'temp.png');
        }
        effectEmojiBegin(_emojiCfg, sp, _frame, caster, patient);
    };
    var effectEmojiBegin= function (emojiCfg, sp, frame, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var _beginPos = null;
        var _endPos = null;
        if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
            var pos = node.getEffectEmojiPos(caster,patient);
            _beginPos = pos[caster];
            _endPos = pos[patient];
        }else{
            if(!$('effectemoji' + caster) && !$('playerLayer.node.effectemoji' + caster ))  return;
            var midUserPos = 2;
            if(window.paizhuo == 'niuniu' || window.paizhuo == 'dn') {
                midUserPos = 1;
            }else if( window.paizhuo == 'kaokao' || window.paizhuo == '13shui'){
                midUserPos = 0;
            }
            if($('effectemoji' + caster)){
                _beginPos = $('effectemoji' + caster).getPosition();
                _endPos = patient != midUserPos ? $('effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            }else{
                _beginPos = $('playerLayer.node.effectemoji' + caster ).getPosition();
                _endPos = patient != midUserPos ? $('playerLayer.node.effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            }
        }

        sp.setPosition(_beginPos);
        if (emojiCfg.name != 'bomb') {
            playFrameAnim2(res['effect_emoji_' + emojiCfg.name], emojiCfg.name + 'start', 1, emojiCfg.startFrames, 0.08, false, sp, function () {
                effectEmojiflying(emojiCfg, sp, frame, caster, patient);
            })
        }
        if (emojiCfg.name == 'bomb') {
            var _shvlitime, _shvlirotate;
            if (_beginPos.x > _endPos.x) {
                _shvlitime = 0.2;
                _shvlirotate = 45;
            } else if (_beginPos.x < _endPos.x) {
                _shvlitime = 0.2;
                _shvlirotate = -45;
            } else {
                _shvlitime = 0.1;
                _shvlirotate = 0;
            }
            sp.setSpriteFrame(frame);
            sp.runAction(cc.sequence(
                cc.moveBy(0, 0, 40),
                cc.moveBy(0.3, 0, -40).easing(cc.easeIn(1.5)),
                cc.rotateBy(0.1, -10).easing(cc.easeOut(1.5)),
                cc.rotateBy(0.1, 20).easing(cc.easeOut(1.5)),
                cc.rotateBy(0.1, -10).easing(cc.easeOut(1.5)),
                cc.delayTime(0.1),
                cc.rotateBy(_shvlitime, _shvlirotate).easing(cc.easeOut(1.5)),
                cc.delayTime(_shvlitime * 1.5),
                cc.callFunc(function () {
                    effectEmojiflying(emojiCfg, sp, frame, caster, patient);
                })
            ))
        }
    };
    var effectEmojiflying= function (emojiCfg, sp, frame, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var _beginPos = null;
        var _endPos = null;
        if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
            var pos = node.getEffectEmojiPos(caster,patient);
            _beginPos = pos[caster];
            _endPos = pos[patient];
        }else{
            if(!$('effectemoji' + caster) && !$('playerLayer.node.effectemoji' + caster ))  return;
            var midUserPos = 2;
            if(window.paizhuo == 'niuniu' || window.paizhuo == 'dn') {
                midUserPos = 1;
            }else if( window.paizhuo == 'kaokao'|| window.paizhuo == '13shui'){
                midUserPos = 0;
            }
            if($('effectemoji' + caster)){
                _beginPos = $('effectemoji' + caster).getPosition();
                _endPos = patient != midUserPos ? $('effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            }else{
                _beginPos = $('playerLayer.node.effectemoji' + caster).getPosition();
                _endPos = patient != midUserPos ? $('playerLayer.node.effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            }
        }
        sp.stopAllActions();
        sp.setSpriteFrame(frame);
        var _flyRotate;
        if (emojiCfg.name == 'bomb') {
            if (_beginPos.x > _endPos.x) {
                _flyRotate = -105;
            } else if (_beginPos.x < _endPos.x) {
                _flyRotate = 105;
            } else {
                _flyRotate = 0;
            }
            sp.runAction(cc.rotateBy(0.5, _flyRotate));
        } else if (emojiCfg.name == 'egg' || emojiCfg.name == 'shoe') {
            if (_beginPos.x <= _endPos.x) {
                _flyRotate = 360;
            } else {
                _flyRotate = -360;
            }
            sp.runAction(cc.rotateBy(0.5, _flyRotate * 5));
        }
        sp.runAction(cc.sequence(
            patient != midUserPos ? cc.moveTo(0.5, _endPos) : cc.spawn(cc.moveTo(0.5, _endPos), cc.scaleTo(0.5, 4)),
            cc.callFunc(function () {
                effectEmojiend(emojiCfg, sp, frame, caster, patient);
            })
        ));
    };
    var effectEmojiend= function (emojiCfg, sp, frame, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var _beginPos = null;
        var _endPos = null;
        if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
            var pos = node.getEffectEmojiPos(caster,patient);
            _beginPos = pos[caster];
            _endPos = pos[patient];
        }else{
            if(!$('effectemoji' + caster) && !$('playerLayer.node.effectemoji' + caster ))  return;
            var midUserPos = 2;
            if(window.paizhuo == 'niuniu'  || window.paizhuo == 'dn') {
                midUserPos = 1;
            }else if( window.paizhuo == 'kaokao'|| window.paizhuo == '13shui'){
                midUserPos = 0;
            }
            console.log(" effectEmojiend - >" + patient);
            if($('effectemoji' + caster)){
                _beginPos = $('effectemoji' + caster).getPosition();
                _endPos = patient != midUserPos ? $('effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            }else{
                _beginPos = $('playerLayer.node.effectemoji' + caster).getPosition();
                _endPos = patient != midUserPos ? $('playerLayer.node.effectemoji' + patient).getPosition() : cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            }
        }

        var _offsetX = patient == midUserPos ? emojiCfg.offsetX * 4 : emojiCfg.offsetX;
        var _offsetY = patient == midUserPos ? emojiCfg.offsetY * 4 : emojiCfg.offsetY;
        playEffect('vEffect_emoji_'+ emojiCfg.name);
        if (emojiCfg.name != 'bomb') {
            sp.setRotation(0);
            sp.setPosition(cc.p(sp.getPositionX() + _offsetX, sp.getPositionY() + _offsetY));
            playFrameAnim2(res['effect_emoji_' + emojiCfg.name], emojiCfg.name + 'end', 1, emojiCfg.endFrames, 0.08, false, sp, function () {
                sp.runAction(cc.sequence(
                    cc.fadeOut(0.3),
                    cc.callFunc(function () {
                        sp.removeFromParent(false);
                    })
                ))
            })
        }
        if (emojiCfg.name == 'bomb') {
            sp.setSpriteFrame(frame);
            var _flag = 1;
            if (_beginPos.x > _endPos.x) {
                _flag = 1;
            } else if (_beginPos.x < _endPos.x) {
                _flag = -1;
            } else {
                _flag = 0;
            }
            sp.runAction(cc.sequence(
                cc.rotateBy(0.1 * Math.abs(_flag), 110 * _flag).easing(cc.easeOut(1.5)),
                cc.rotateBy(0.1 * Math.abs(_flag), -80 * _flag).easing(cc.easeOut(1.5)),
                cc.rotateBy(0.1 * Math.abs(_flag), 50 * _flag).easing(cc.easeOut(1.5)),
                cc.rotateBy(0.1 * Math.abs(_flag), -20 * _flag).easing(cc.easeOut(1.5)),
                cc.callFunc(function () {
                    sp.setRotation(0);
                    sp.setPosition(cc.p(sp.getPositionX() + _offsetX, sp.getPositionY() + _offsetY));
                    playFrameAnim2(res['effect_emoji_' + emojiCfg.name], emojiCfg.name + 'end', 1, emojiCfg.endFrames, 0.08, false, sp, function () {
                        sp.runAction(cc.sequence(
                            cc.fadeOut(0.3),
                            cc.callFunc(function () {
                                sp.removeFromParent(false);
                            })
                        ))
                    })
                })
            ))
        }
    };
    var showJiaTeLin = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        if(emojiId==6 && res['jiatelin_qiang_json']) {
            var allCfg={
                24:{rotate:60},
            };
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var _beginPos = null;
            var _endPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow,_patientRow);
                _beginPos = pos[_casterRow];
                _endPos = pos[_patientRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;
                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x - 40, $('effectemoji' + (_casterRow)).getPosition().y- 40);
                    _endPos = cc.p($('effectemoji' + (_patientRow)).getPosition().x- 40, $('effectemoji' + (_patientRow)).getPosition().y- 40);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x- 40, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y- 40);
                    _endPos = cc.p($('playerLayer.node.effectemoji' + (_patientRow)).getPosition().x- 40, $('playerLayer.node.effectemoji' + (_patientRow)).getPosition().y- 40);
                }
            }


            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle=90-getAngleByPos(_beginPos,_endPos);
            var jiaodu=getAngleByPos(_beginPos,_endPos);
            cc.log("jiaodujiaodu="+angle);
            sp.setPosition(_beginPos);
            var effect_emoji ="jiatelin_qiang_json";
            playEffect("itr_biaoqing6");
            for (var i=0;i<20;i++)
            {
                setTimeout(function () {
                    var zidan = new cc.Sprite(res.bullet);
                    var zidanPos=cc.p(25,25);
                    zidan.setPosition(zidanPos);
                    zidan.setRotation(angle);
                    zidan.setOpacity(0);
                    sp.addChild(zidan, 30);
                    cc.log(_endPos.x-_beginPos.x, _endPos.y-_beginPos.y);
                    var x2=Math.ceil(Math.random()*50);
                    var y2=Math.ceil(Math.random()*50);
                    var ePos=cc.p(_endPos.x-_beginPos.x+x2-30+25, _endPos.y-_beginPos.y+y2-30+25);
                    var lenth=cc.pDistance(zidanPos,ePos);
                    var time=lenth/3000
                    var spa=cc.spawn(cc.fadeTo(time/6,255),cc.moveTo(time, ePos.x, ePos.y));
                    zidan.runAction(cc.sequence(
                        spa
                        , cc.callFunc(function () { zidan.removeFromParent(true);
                            var dankong = new cc.Sprite('res/image/ui/animation/jiatelin_dankong.png');
                            dankong.setPosition(cc.p(ePos.x+x2, ePos.y+y2));
                            sp.addChild(dankong, 30);
                        })
                    ));
                }, i*100);
            }
            var cacheNode = playAnimScene(sp, res[effect_emoji], 40, 40, false, function () {
                sp.removeAllChildren();
            });
            cacheNode.setRotation(angle);
            return;
        }
    };
    var showDapao = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        var that = this;
        if(emojiId==10&& res['sp_daoju_dapao_json']) {
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var sp3 = new cc.Sprite('res/image/ui/skeletons/paodan.png');
            sp3.setTexture('res/image/ui/skeletons/paodan.png');
            node.addChild(sp3, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var _beginPos = null;
            var _endPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow,_patientRow);
                _beginPos = pos[_casterRow];
                _endPos = pos[_patientRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('effectemoji' + (_patientRow)).getPosition().x, $('effectemoji' + (_patientRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('playerLayer.node.effectemoji' + (_patientRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_patientRow)).getPosition().y);
                }
            }


            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle=90-getAngleByPos(_beginPos,_endPos);
            var jiaodu=getAngleByPos(_beginPos,_endPos);
            cc.log("jiaodujiaodu="+angle);
            sp.setPosition(_beginPos);
            sp2.setPosition(_endPos);

            var dapao = playSpAnimation('daoju_dapao', 'daopao1', false);
            if(dapao) {
                dapao.setRotation(angle);
                sp.addChild(dapao);
                sp.runAction(cc.sequence(
                    cc.delayTime(2)
                    , cc.callFunc(function () {
                        sp.removeFromParent();
                    }))
                );
                sp3.setPosition(cc.p(_beginPos.x + 25, _beginPos.y + 25));
                sp3.setRotation(angle);
                sp3.setVisible(false);
                sp3.runAction(cc.sequence(
                    cc.delayTime(.9)
                    , cc.callFunc(function () {
                        sp3.setVisible(true);
                    })
                    , cc.moveTo(.2, _endPos)
                    , cc.callFunc(function () {
                        sp3.removeFromParent();
                    })
                ));
                var dapao2 = null;
                sp2.runAction(cc.sequence(
                    cc.delayTime(1)
                    , cc.callFunc(function () {
                        dapao2 = playSpAnimation('daoju_dapao', 'daopao2', false);
                        sp2.addChild(dapao2);
                    })
                    , cc.delayTime(3)
                    , cc.callFunc(function () {
                        sp2.removeFromParent();
                    })
                ))
            }
        }
    };
    var showGongjian = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        var that = this;
        if(emojiId==8) {
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var _beginPos = null;
            var _endPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow,_patientRow);
                _beginPos = pos[_casterRow];
                _endPos = pos[_patientRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('effectemoji' + (_patientRow)).getPosition().x, $('effectemoji' + (_patientRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('playerLayer.node.effectemoji' + (_patientRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_patientRow)).getPosition().y);
                }
            }


            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle=90-getAngleByPos(_beginPos,_endPos);
            var jiaodu=getAngleByPos(_beginPos,_endPos);
            cc.log("jiaodujiaodu="+angle);
            sp.setPosition(_beginPos);
            sp2.setPosition(_endPos);

            var dapao = playSpAnimation('daoju_gongjian', 'gongjian1', false);
            if(dapao){
                dapao.setRotation(angle);
                sp.addChild(dapao);
                sp.runAction(cc.sequence(
                    cc.delayTime(4)
                    // ,cc.moveTo(.2,_endPos)
                    // ,cc.delayTime(.1)
                    , cc.callFunc(function () {
                        sp.removeFromParent();
                    }))
                );
                var dapao2 = null;
                dapao2 = playSpAnimation('daoju_gongjian', 'gongjian2', false);
                dapao2.setRotation(angle);
                sp2.addChild(dapao2);
                sp2.runAction(cc.sequence(
                    // cc.delayTime(.8)
                    // , cc.callFunc(function () {
                    //
                    // })
                    cc.delayTime(4)
                    , cc.callFunc(function () {
                        sp2.removeFromParent();
                    })
                ))
            }
        }
    };
    var showMaobi = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        var that = this;
        if(emojiId==7) {
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var _beginPos = null;
            var _endPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow,_patientRow);
                _beginPos = pos[_casterRow];
                _endPos = pos[_patientRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('effectemoji' + (_patientRow)).getPosition().x, $('effectemoji' + (_patientRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('playerLayer.node.effectemoji' + (_patientRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_patientRow)).getPosition().y);
                }
            }
            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle=90-getAngleByPos(_beginPos,_endPos);
            var jiaodu=getAngleByPos(_beginPos,_endPos);
            cc.log("jiaodujiaodu="+angle);
            sp.setPosition(_beginPos);
            sp2.setPosition(_endPos);

            var dapao = playSpAnimation('maobi', 'maobi1', false);
            if(dapao) {
                dapao.setRotation(angle);
                sp.addChild(dapao);
                sp.runAction(cc.sequence(
                    cc.delayTime(.8)
                    , cc.spawn(
                        cc.moveTo(.3, _endPos)
                        , cc.rotateBy(.3, 360 * 4, 360 * 4)
                    )
                    , cc.delayTime(.1)
                    , cc.callFunc(function () {
                        sp.removeFromParent();
                    }))
                );
                var dapao2 = null;
                sp2.runAction(cc.sequence(
                    cc.delayTime(1.3)
                    , cc.callFunc(function () {
                        dapao2 = playSpAnimation('maobi', 'maobi2', false);
                        sp2.addChild(dapao2);
                    })
                    , cc.delayTime(3)
                    , cc.callFunc(function () {
                        sp2.removeFromParent();
                    })
                ))
            }
        }
    };
    var showZhayao = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        var that = this;
        if(emojiId==9) {
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var _beginPos = null;
            var _endPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow,_patientRow);
                _beginPos = pos[_casterRow];
                _endPos = pos[_patientRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('effectemoji' + (_patientRow)).getPosition().x, $('effectemoji' + (_patientRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                    _endPos = cc.p($('playerLayer.node.effectemoji' + (_patientRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_patientRow)).getPosition().y);
                }
            }


            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle=90-getAngleByPos(_beginPos,_endPos);
            var jiaodu=getAngleByPos(_beginPos,_endPos);
            cc.log("jiaodujiaodu="+angle);
            sp.setPosition(_beginPos);
            sp2.setPosition(_endPos);

            var dapao = playSpAnimation('daoju_zhayao', 'zhayao1', false);
            // dapao.setRotation(angle);
            if(dapao) {
                sp.addChild(dapao);
                sp.runAction(cc.sequence(
                    cc.delayTime(1.8)
                    , cc.callFunc(function () {
                        sp.removeFromParent();
                    }))
                );
                var dapao2 = null;
                sp2.runAction(cc.sequence(
                    cc.delayTime(.3)
                    , cc.callFunc(function () {
                        dapao2 = playSpAnimation('daoju_zhayao', 'zhayao2', false);
                        sp2.addChild(dapao2);
                    })
                    , cc.delayTime(3.8)
                    , cc.callFunc(function () {
                        sp2.removeFromParent();
                    })
                ))
            }
        }
    };
    var showQifu = function(caster, patientList, emojiId, times) {
        if (!cc.sys.isObjectValid(node)) return;
        var that = this;
        if(emojiId==4) {
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var _casterRow = node.getRowByUid(caster);
            var _beginPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow);
                _beginPos = pos[_casterRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                }
            }
            var dapao2 = null;
            sp2.setPosition(_beginPos);
            sp2.runAction(cc.sequence(
                cc.delayTime(.01)
                , cc.callFunc(function () {
                    dapao2 = playSpAnimation('daoju_qifu', 'qifu2', false);
                    sp2.addChild(dapao2);
                })
                ,cc.delayTime(3)
                ,cc.callFunc(function () {
                    sp2.removeFromParent();
                })
            ))
        }
    };
    var showCaishen = function(caster, patientList, emojiId, times) {
        if (!cc.sys.isObjectValid(node)) return;
        var that = this;
        if(emojiId==3) {
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var _casterRow = node.getRowByUid(caster);
            var _beginPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow);
                _beginPos = pos[_casterRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                }
            }
            var dapao2 = null;
            sp2.setPosition(_beginPos);
            sp2.runAction(cc.sequence(
                cc.delayTime(.01)
                , cc.callFunc(function () {
                    dapao2 = playSpAnimation('daoju_caishen', 'caishen2', false);
                    sp2.addChild(dapao2);
                })
                ,cc.delayTime(3)
                ,cc.callFunc(function () {
                    sp2.removeFromParent();
                })
            ))
        }
    };
    var showExpression = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        var duration = 2.4;
        if(res['expression_animation_' + emojiId]){
            var sp2 = new cc.Sprite();
            node.addChild(sp2, 30);
            var _casterRow = node.getRowByUid(caster);
            var _beginPos = null;
            if(node.getEffectEmojiPos && usegetEffectEmojiPosFunc()){
                var pos = node.getEffectEmojiPos(_casterRow);
                _beginPos = pos[_casterRow];
            }else{
                if(!$('effectemoji' + _casterRow) && !$('playerLayer.node.effectemoji' + _casterRow ))  return;

                if($('effectemoji' + _casterRow)){
                    _beginPos = cc.p($('effectemoji' + (_casterRow)).getPosition().x, $('effectemoji' + (_casterRow)).getPosition().y);
                }else{
                    _beginPos = cc.p($('playerLayer.node.effectemoji' + (_casterRow)).getPosition().x, $('playerLayer.node.effectemoji' + (_casterRow)).getPosition().y);
                }
            }
            sp2.setPosition(_beginPos);
            var anim = playAnimScene(sp2, res['expression_animation_' + emojiId], 0, 0, true);
            sp2.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                sp2.removeFromParent();
            })));
        }
    };
    exports.EFFECT_EMOJI = {
        init: function (_node, _$) {
            node = _node;
            $ = _$;
            effectEmojiQueue = {};
            network.addListener(4990, function (data) {
                //关闭表情  只能看到自己给别的  看不到别人给自己的
                if(gameData.biaoQingFlag == 0 && !(data.from_uid == gameData.uid && data.target_id != gameData.uid)) {
                    return;
                }
                if(!data.target_id)  data.target_id = data.target_uid;
                if(!data.from_id)  data.from_id = data.from_uid;

                if(data.target_id == data.from_uid){ //自己给自己发表情
                    if(data.emoji_idx == 1 || data.emoji_idx == 2){
                        showExpression(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                    } else if(data.emoji_idx == 3){
                        playEffect('vEffect_emoji_caishen');
                        showCaishen(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                    } else if(data.emoji_idx == 4){
                        playEffect('vEffect_emoji_dajidali');
                        showQifu(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                    }
                } else if(data.emoji_idx == 10){ //大炮
                    _node.scheduleOnce(function(){
                        playEffect('vEffect_emoji_dapao');
                    }, 1);
                    showDapao(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                } else if(data.emoji_idx == 6){ //加特林
                    showJiaTeLin(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                } else if(data.emoji_idx == 7){
                    _node.scheduleOnce(function(){
                        playEffect('vEffect_emoji_maobi');
                    }, 1);
                    showMaobi(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                } else if(data.emoji_idx == 8){
                    _node.scheduleOnce(function(){
                        playEffect('vEffect_emoji_shejian');
                    }, 1);
                    showGongjian(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                } else if(data.emoji_idx == 9){
                    _node.scheduleOnce(function(){
                        playEffect('vEffect_emoji_dingshidan');
                    }, 1);
                    showZhayao(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                } else {
                    addEffectEmojiQueue(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                }
            });
        },
        destroy: function () {
            node = null;
            $ = null;
        }
    };

    // exports.PlayerInfoLayer = {
    var PlayerInfoLayer = cc.Layer.extend({
        _cdbarArray:null,
        onExit:function () {
            this._cdbarArray = null;
            this.unscheduleAllCallbacks();
            cc.Layer.prototype.onExit.call(this);
        },
        ctor:function (playerInfo,node,gamename,watch) {
            this._super();
            var that = this;
            that._cdbarArray = [];
            that.init(playerInfo,node,gamename,watch)
        },
        init: function (playerInfo, node, gamename, watch) {
            var that = node;
            var self = this;
            self.scene = null;
            var targetUid = playerInfo['ID']||playerInfo.uid;
            var targetSex = playerInfo['Sex']||playerInfo['sex'];
            var targetNickName = playerInfo['nickname']||playerInfo['NickName'];
            var targetHeadimgUrl = playerInfo['headimgurl']||playerInfo['HeadIMGURL'];
            var targetID = playerInfo['ID']||playerInfo['uid'];
            var targetIP = playerInfo['IP']||playerInfo['ip'];
            var targetLocCN = playerInfo['locCN']||decodeURIComponent(playerInfo['locationCN']);
            if(targetUid == gameData.uid && !isNullString(locationUtil.address)){
                targetLocCN = locationUtil.address;
            }
            if(targetLocCN == ''){
                targetLocCN = '未知地址';
            }

            this.targetUid = targetUid;
            if (targetUid == gameData.uid) {
                // self.scene = ccs.load(res.PlayerInfo_json, "res/");
                self.scene = loadNodeCCS(res.PlayerInfo_json, this, null, true);
            } else if(gamename == 'niuniu' || gamename == 'poker' || gamename == 'kaokao'|| window.paizhuo == '13shui') {
                // self.scene = ccs.load(res.PlayerInfoOther_json, "res/");
                self.scene = loadNodeCCS(res.PlayerInfoOther_json, this, null, true);
            } else if(gamename == "paohuzi"){
                // self.scene = ccs.load(res.PlayerInfo_json, "res/");
                self.scene = loadNodeCCS(res.PlayerInfo_json, this, null, true);
            } else{
                // self.scene = ccs.load(res.PlayerInfo_json, "res/");
                self.scene = loadNodeCCS(res.PlayerInfo_json, this, null, true);
            }

            // that.addChild(self.scene.node, 200);
            var root = self.scene.node.getChildByName('root');
            var panel = root.getChildByName('panel');

            // if(root)  root.setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);
            root.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.scene.node.removeFromParent();
                }
            });

            var head = panel.getChildByName('head');
            var lbNickname = panel.getChildByName('lb_nickname');
            var lbId = panel.getChildByName('lb_id');
            var lbIp = panel.getChildByName('lb_ip');
            var male = panel.getChildByName('male');
            var female = panel.getChildByName('female');
            var lbAD = panel.getChildByName('lb_ad');
            var lbDt = panel.getChildByName('lb_dt');
            var icon_add = panel.getChildByName('icon_add_22');


            var get_gps = panel.getChildByName('get_gps');
            if(get_gps){
                get_gps.setVisible(false);
                this.initResetGps(get_gps, lbAD);
            }

            // var lbLocation = $('root.panel.lb_location', that.scene.node);
            lbAD.setVisible(true);

            //lbNickname.setString(ellipsisStr(targetNickName, 7));
            lbNickname.setString(targetNickName);
            loadImageToSprite(targetHeadimgUrl, head);
            lbId.setString('ID:'+targetID);
            lbIp.setString('IP:'+targetIP);
            lbDt.setVisible(false);
            if(window.paizhuo == "niuniu" || window.paizhuo == 'dn') {
                if(icon_add)
                    icon_add.setVisible(false);
                lbAD.setVisible(false);
            }
            else{
                lbAD.setVisible(true);
                lbAD.setString(targetLocCN);
            }
            if(gameData.mapId == MAP_ID.PDK_JBC){
                lbAD.setVisible(false);
                lbAD.setString(targetLocCN);
            }
            /*----------------------- 比赛场 ----------------------- */
            if(gameData.matchId){
                var icon_add_22 = panel.getChildByName('icon_add_22');
                if(icon_add_22)  icon_add_22.setVisible(false);
                if(lbAD) lbAD.setVisible(false);
                if(get_gps) get_gps.setVisible(false);
            }
            /*----------------------- 比赛场 ----------------------- */

            for(var i=1;i<=10;i++){
                var target = panel.getChildByName('emoji' + i);
                if(target) {
                    var cdbar = new cc.ProgressTimer(cc.Sprite.create('res/image/ui/common/arrowbg.png'));
                    cdbar.setPosition(cc.p(target.getContentSize().width / 2, target.getContentSize().height / 2 + 2));
                    cdbar.setType(cc.ProgressTimer.TYPE_RADIAL);
                    cdbar.setMidpoint(cc.p(0.5, 0.5));
                    cdbar.setOpacity(200);
                    cdbar.setScale(1.3);
                    cdbar.setReverseDirection(true);
                    // cdbar.runAction(
                    //     cc.progressTo(0.1, 100)
                    // );
                    this._cdbarArray.push(cdbar);
                    target.addChild(cdbar);
                    this.onTimer();
                    this.scheduleTimer = this.scheduleOnce(this.onTimer, 0.01, "");

                    if (watch) {
                        //观看状态  未开始
                        target.setVisible(false);
                    }
                }
            }

            //声音小喇叭
            var voice = panel.getChildByName('voice');
            if(voice) {
                voice.setVisible(!!mRoom.voiceMap[targetUid]);
                TouchUtils.setOnclickListener(voice, function () {
                    // console.log("================::" + mRoom.voiceMap[targetUid]);
                    if (mRoom.voiceMap[targetUid]) {
                        // VoiceUtils.play(mRoom.voiceMap[targetUid]);
                        VoiceUtils.play(mRoom.voiceMap[targetUid]);
                    }
                });
            }

            male.setVisible(targetSex == '1');
            female.setVisible(targetSex == '2');

            // TouchUtils.setOnclickListener(root.getChildByName('fake_root'), function () {
            //     // that.removeChild(self.scene.node);
            //     that.removeFromParent();
            // });
            TouchUtils.setOnclickListener(root, function () {
                self.removeFromParent();
            }, {effect: TouchUtils.effects.NONE});

            if (targetUid != gameData.uid) {
                for (var i = 1; i <= 10; i++) {
                    (function (k) {
                        TouchUtils.setOnclickListener(panel.getChildByName('emoji' + k), function () {
                            if(getCurTimestamp() - gameData.timestamp > TIMESTAMP){
                                gameData.timestamp = getCurTimestamp();
                                onSendEffectEmoji(k, 1, targetUid);
                                self.scene.node.removeFromParent();
                            }else{
                                HUD.showMessage('表情冷却中，请稍等', true);
                            }

                        });
                    })(i);
                }
            }else{
                for (var i = 1; i <= 4; i++) {
                    (function (k) {
                        TouchUtils.setOnclickListener(panel.getChildByName('emoji' + k), function () {
                            if(getCurTimestamp() - gameData.timestamp > TIMESTAMP){
                                gameData.timestamp = getCurTimestamp();
                                onSendEffectEmoji(k, 1, targetUid);
                                self.scene.node.removeFromParent();
                            }else{
                                HUD.showMessage('表情冷却中，请稍等', true);
                            }

                        });
                    })(i);
                }
            }
        },
        initResetGps: function(get_gps, lbAD){
            var that = this;

            //gps
            var lastGetLocTIme = 0;
            // TouchUtils.setOnclickListener(get_gps, function () {
            //     if(!PermissionUtils.isHasLocationPermission()){
            //         alert1('未开启定位权限，请先开启定位权限');
            //         return;
            //     }
            //     var now = getCurTimestamp();
            //     if (now - lastGetLocTIme < 10) {
            //         alert1('过于频繁，请稍后重试');
            //         return;
            //     }
            //     lastGetLocTIme = now;
            //
            //     HUD.showMessage('重新请求定位中');
            //     LocationUtils.startLocation();
            //     that.scheduleOnce(function(){
            //         var locationStr = null;
            //         locationStr = LocationUtils.getCurLocation();
            //         //locationStr = '66.1111,55.111111';
            //         console.log("locationStr = " + locationStr);
            //         if (locationStr) {
            //             if (cc.sys.os == cc.sys.OS_IOS) {
            //                 var parts = locationStr.split(',');
            //                 if (parts.length > 1) {
            //                     gameData.location = parts[1] + ',' + parts[0];
            //                 } else {
            //                     gameData.location = null;
            //                     return;
            //                 }
            //             } else {
            //                 gameData.location = locationStr;
            //             }
            //
            //             LocationUtils.getCurLocationInfo(function (info, lng, lat) {
            //                 gameData.locationInfo = info;
            //                 lbAD.setString(decodeURIComponent(gameData.locationInfo));
            //
            //                 //刷新 players 数据
            //                 var playerInfo = gameData.getPlayerInfoByUid(gameData.uid);
            //                 if(playerInfo) {
            //                     playerInfo['loc'] = gameData.location;
            //                     playerInfo['locCN'] = gameData.locationInfo;
            //                 }
            //
            //                 if (lng)
            //                     gameData.location = lat + ',' + lng;
            //
            //                 network.send(3007, {
            //                     location: gameData.location,
            //                     locationCN: gameData.locationInfo
            //                 });
            //             });
            //             LocationUtils.clearCurLocation();
            //         }
            //     }, 2)
            // });
        },
        onTimer:function () {
            var self = this;
            var currtime_second = getCurTimestamp();
            //console.log("currtime_second=========="+currtime_second);
            if(gameData.timestamp == 0){
                this.unschedule(this.scheduleTimer);
                return;
            }
            var currtime_tamp = currtime_second - gameData.timestamp;
            if(currtime_tamp<TIMESTAMP){
                var percen = 100-currtime_tamp/TIMESTAMP*100;
                //console.log("currtime_tamp=========="+currtime_tamp+",percen=="+percen);
                if (this.targetUid != gameData.uid) {
                    for (var i = 0; i < 10; i++) {
                        var target = this._cdbarArray[i];
                        if (target) {
                            target.setPercentage(percen);
                            target.runAction(
                                cc.sequence(
                                    cc.progressTo(TIMESTAMP - currtime_tamp, 0),
                                    cc.callFunc(function () {
                                        gameData.timestamp = 0;
                                        this.setVisible(false);
                                    }, target))
                            );
                        }
                    }
                }else{
                    for (var i = 0; i < 4; i++) {
                        var target = this._cdbarArray[i];
                        if (target) {
                            target.setPercentage(percen);
                            target.runAction(
                                cc.sequence(
                                    cc.progressTo(TIMESTAMP - currtime_tamp, 0),
                                    cc.callFunc(function () {
                                        gameData.timestamp = 0;
                                        this.setVisible(false);
                                    }, target))
                            );
                        }
                    }
                }
            }

        },
    });
    exports.PlayerInfoLayer = PlayerInfoLayer;
    exports.PlayerInfoLayer.addEffectEmojiQueue = addEffectEmojiQueue;
    exports.PlayerInfoLayer.showJiaTeLin = showJiaTeLin;
})(this);