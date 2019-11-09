/**
 * Created by duwei on 18/5/9.
 */
(function (exports) {

    var $ = null;
    var node = null;
    var effectEmojiQueue = {};
    var effectEmojiCfg = {
        1:  {'name': 'zan',         'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 0},
        2:  {'name': 'bomb',        'startFrames': 0, 'endFrames': 10, 'offsetX': 3, 'offsetY': 11},
        3:  {'name': 'egg',         'startFrames': 9, 'endFrames': 10, 'offsetX': 0, 'offsetY': 22},
        4:  {'name': 'shoe',        'startFrames': 5, 'endFrames': 10, 'offsetX': -1, 'offsetY': -1},
        5:  {'name': 'flower',      'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        6:  {'name': 'jiatelin',    'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},

        7: {'name': 'bingtong',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        8:  {'name': 'gongjian',    'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        9:  {'name': 'zhayao',      'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        10: {'name': 'dapao',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        11: {'name': 'che',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        12: {'name': 'ship',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        13: {'name': 'plane',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        14: {'name': 'tiaoxing',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},

        // 7:  {'name': 'limao',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 11: {'name': 'pengbei',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 12: {'name': 'daoshui',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 13: {'name': 'maobi',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 14: {'name': 'shuai',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 15: {'name': 'zhuaji',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 16: {'name': 'bianpao',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},

        // 18: {'name': 'jiaoshui',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 19: {'name': 'hongbao',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 20: {'name': 'laolong',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 21: {'name': 'woshou',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 22: {'name': 'xihongshi',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 23: {'name': 'huaquan',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 24: {'name': 'liwuzhadan',       'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},


        // 11: {'name': 'laotou',     'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 12: {'name': 'qifu',        'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 13: {'name': 'pengbei',        'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 14: {'name': 'daoshui',        'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        // 15: {'name': 'caishen',        'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
    };
    var effectEmojiCfgSelf = {
        1: {'name': 'expression1',     'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        2: {'name': 'expression2',     'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        3: {'name': 'expression11',     'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
        4: {'name': 'chuizhuozi',        'startFrames': 11, 'endFrames': 13, 'offsetX': 0, 'offsetY': 0},
    };
    var buyType = "fangka";
    var buyTypeDesc = {
        fangka: "张房卡",
        diamonds: "个钻石",
        coin: "个金币",
    };

    var effectEmojiShengyinTimeCfg = {
        'zhayao': 800,
        'maobi': 0,
        'gongjian': 800,
        'caishen': 0,
        'qifu': 0,
        'dapao': 800,
        'bianpao': 1700,
        'zhuaji': 1000,
        'daoshui': 1000,
        'laolong': 1000,
        'jiaoshui': 1000,
        'liwuzhadan': 1200,
        'bingtong': 800,
        'xihongshi': 1000,
        'tiaoxing': 1200,
    };
    var EmojiSpTimeCfg = {
        'woshou': 800,
        'laolong': 800,
        'liwuzhadan': 1200,
        'huaquan': 1200,
        'che': 1200,
        'tiaoxing': 1200,
    };

    //道具位置
    var  selfProp = [
        {posX:330,posY:345},
        {posX:485,posY:345},
        {posX:795,posY:345},
        {posX:640,posY:345},
    ];
    var  otherProp = [
        {posX:795,posY:180},
        {posX:1176,posY:1900},
        {posX:795,posY:345},
        {posX:950,posY:345},
        {posX:950,posY:180},

        {posX:485,posY:345},
        {posX:1176,posY:1900},
        {posX:640,posY:345},
        {posX:1176,posY:1900},
        {posX:330,posY:345},

        {posX:330,posY:180},
        {posX:485,posY:180},
        {posX:640,posY:180},
        {posX:1176,posY:1900},
    ];



    var TIMESTAMP = 4;


    var addEffectEmojiQueue = function (caster, patientList, emojiId, times) {
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
    var isEffectEmojiEmpty = function () {
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
    var startEffectEmojiQueue = function () {
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
    var playEffectEmoji = function (caster, patient, emojiId) {
        if (!cc.sys.isObjectValid(node)) return;
        var _emojiCfg = effectEmojiCfg[emojiId];
        if (_.isUndefined(_emojiCfg)) {
            return;
        }
        var sp = new cc.Sprite();
        node.getRootNode().addChild(sp, 30);
        if(res["sp_"+_emojiCfg.name+"_json"]){
            effectEmojiSpBegin(_emojiCfg, sp, caster, patient);
        }else{
            effectEmojiBegin(_emojiCfg, sp, caster, patient);
        }
    };
    var effectEmojiSpBegin= function (emojiCfg, sp, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var pos = node.getEffectEmojiPos(caster,patient,true);
        var _beginPos = pos[caster];
        var _endPos = pos[patient]
        var emoji =playSpAnimation(emojiCfg.name,emojiCfg.name + '1',false,null,function () {
            if(emojiCfg.name == 'bingtong'||emojiCfg.name == 'maobi'||emojiCfg.name == 'shuai'||emojiCfg.name == 'bianpao'||emojiCfg.name== 'hongbao'||emojiCfg.name == 'zhuaji'||emojiCfg.name == 'daoshui'||emojiCfg.name == 'jiaoshui'||emojiCfg.name == 'xihongshi') {

            }else {
                setTimeout(function () {
                    emoji.removeFromParent(true)
                },10)
            }
        })
        var time=effectEmojiShengyinTimeCfg[emojiCfg.name];
        setTimeout(function () {
            playEffect('vEffect_emoji_'+ emojiCfg.name);
        }, time);
        emoji.setPosition(_beginPos);
        emoji.setLocalZOrder(100)
        if(emojiCfg.name == 'dapao' || emojiCfg.name == 'gongjian') {
            emoji.setRotation(90 - 180 * Math.atan2(_endPos.y - _beginPos.y, _endPos.x - _beginPos.x) / Math.PI)
        }
        node.addChild(emoji)
        if(emojiCfg.name == 'dapao') {
            var paodan = new cc.Sprite(res.sp_baodan_image)
            paodan.setOpacity(0);
            paodan.setPosition(_beginPos);
            node.addChild(paodan)
            paodan.runAction(cc.sequence(cc.delayTime(0.7),cc.fadeIn(0),
                patient != node.getOriginalPos() ? cc.moveTo(1, _endPos) : cc.spawn(cc.moveTo(1, _endPos), cc.scaleTo(1, 1)),
                cc.callFunc(function () {
                    effectEmojiend(emojiCfg, sp, caster, patient);
                    paodan.removeFromParent(true);
                })))
        }
        else {
            if(emojiCfg.name == 'bingtong'||emojiCfg.name == 'maobi'||emojiCfg.name == 'xihongshi'||emojiCfg.name == 'shuai'||emojiCfg.name == 'bianpao'||emojiCfg.name == 'hongbao'||emojiCfg.name == 'zhuaji'||emojiCfg.name == 'daoshui'||emojiCfg.name == 'jiaoshui') {
                if(emojiCfg.name == 'hongbao'||emojiCfg.name == 'zhuaji'||emojiCfg.name == 'daoshui'){
                    if(_endPos.x>=cc.winSize.width/2){
                        emoji.setScaleX(-1);
                        if(emojiCfg.name == 'hongbao'){//红包动画位置有偏移  前后动画会瞬移  加这个减小视觉冲击效果
                            _endPos.x-=65;
                        }
                    }else {
                        if(emojiCfg.name == 'hongbao'){
                            _endPos.x+=65;
                        }
                    }
                }
                emoji.runAction(cc.sequence(cc.delayTime(0.7),
                    patient != node.getOriginalPos() ? cc.moveTo(0.3, _endPos) : cc.spawn(cc.moveTo(0.3, _endPos), cc.scaleTo(0.3, 1)),
                    cc.callFunc(function () {
                        emoji.removeFromParent(true)
                        effectEmojiend(emojiCfg, sp, caster, patient);
                    })))
            }
            else {
                var sptime=EmojiSpTimeCfg[emojiCfg.name];
                if(sptime){
                    setTimeout(function () {
                        effectEmojiend(emojiCfg, sp, caster, patient);
                    }, sptime);
                }else {
                    effectEmojiend(emojiCfg, sp, caster, patient);
                }

            }
        }
    };
    var effectEmojiBegin= function (emojiCfg, sp, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var pos = node.getEffectEmojiPos(caster,patient,true);
        var _beginPos = pos[caster];
        sp.setPosition(_beginPos);
        var effect_emoji ='effect_emoji_' + emojiCfg.name + "_1";
        playAnimScene(sp, res[effect_emoji], 0,0, false, function () {
            sp.removeAllChildren();
            effectEmojiflying(emojiCfg, sp, caster, patient);
        });
    };
    var effectEmojiflying= function (emojiCfg, sp, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var pos = node.getEffectEmojiPos(caster,patient,true);
        var _endPos = pos[patient];
        sp.stopAllActions();
        var effect_emoji ='effect_emoji_' + emojiCfg.name + "_2";
        playAnimScene(sp, res[effect_emoji], 0,0, true);
        sp.runAction(cc.sequence(
            patient != node.getOriginalPos() ? cc.moveTo(0.5, _endPos) : cc.spawn(cc.moveTo(0.5, _endPos), cc.scaleTo(0.5, 1)),
            cc.callFunc(function () {
                sp.removeAllChildren();
                effectEmojiend(emojiCfg, sp, caster, patient);
            })
        ));
    };
    var effectEmojiend= function (emojiCfg, sp, caster, patient) {
        if (!cc.sys.isObjectValid(node)) return;
        var pos = node.getEffectEmojiPos(caster,patient,true);
        var _beginPos = pos[caster];
        var _endPos = pos[patient];
        //SkeletonAnimation
        if(res["sp_"+emojiCfg.name+"_json"]){
            var emoji = playSpAnimation(emojiCfg.name, emojiCfg.name + '2', false,null, function () {
                setTimeout(function () {
                    emoji.removeFromParent(true)
                },10)
            })
            if(emojiCfg.name == 'plane'){
                var emoji1 = playSpAnimation(emojiCfg.name, emojiCfg.name + '3', false,null, function () {
                    setTimeout(function () {
                        emoji1.removeFromParent(true)
                    },10)
                })
                emoji1.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height/2));
                emoji1.setScale(1);
                node.addChild(emoji1)
            }
            emoji.setScale(1);
            if(emojiCfg.name == 'gongjian') {
                emoji.setRotation(90 - 180 * Math.atan2(_endPos.y - _beginPos.y, _endPos.x - _beginPos.x) / Math.PI)
            }else if(emojiCfg.name == 'hongbao'||emojiCfg.name == 'daoshui'||emojiCfg.name == 'jiaoshui'){
                if(_endPos.x>=cc.winSize.width/2){
                    emoji.setScaleX(-1);
                }
            }else if(emojiCfg.name == 'bingtong'){
                if(_endPos.x<cc.winSize.width/2){
                    emoji.setScaleX(-1);
                }
            }

            emoji.setPosition(_endPos);

            node.addChild(emoji)
        }else{
            playEffect('vEffect_emoji_'+ emojiCfg.name);
            var effect_emoji ='effect_emoji_' + emojiCfg.name + "_3";
            playAnimScene(sp, res[effect_emoji], 0,0, false, function () {
                sp.runAction(cc.sequence(
                    cc.fadeOut(0.3),
                    cc.callFunc(function () {
                        sp.removeFromParent();
                    })
                ))
            });
        }
    };
    var showPengbei = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        if(emojiId==11 && res['sp_pengbei_json']) {

            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var pos = node.getEffectEmojiPos(_casterRow,_patientRow,true);
            var _beginPos = pos[_casterRow];
            var _endPos = pos[_patientRow];

            var centerPs = cc.p((_beginPos.x+_endPos.x)/2,(_beginPos.y+_endPos.y)/2);

            var sp = new cc.Sprite(res.sp_pengbeiBG_png);
            node.addChild(sp, 30);
            sp.setPosition(_beginPos);

            var sp1 = new cc.Sprite(res.sp_pengbeiBG_png);
            node.addChild(sp1, 30);
            sp1.setPosition(_endPos);


            // var lenth=cc.pDistance(_beginPos,centerPs);
            var time=0.4;

            sp.runAction(cc.sequence(cc.moveTo(time,centerPs),cc.callFunc(function () {
                sp.removeFromParent(true);
            })));
            var name = effectEmojiCfg[emojiId].name ;
            sp1.runAction(cc.sequence(cc.moveTo(time,centerPs),cc.callFunc(function () {
                playEffect('vEffect_emoji_' + name);

                var emoji3 = playSpAnimation(name, name+1, false,null, function () {
                    setTimeout(function () {
                        emoji3.removeFromParent(true);
                    }, 10)
                });
                emoji3.setPosition(centerPs);
                node.addChild(emoji3);
                sp1.removeFromParent(true);
            })));


            // var name = effectEmojiCfg[emojiId].name ;
            // var emoji = playSpAnimation(name, name + 1, false, null,function () {
            //     setTimeout(function () {
            //         emoji.removeFromParent(true);
            //     }, 10)
            //     playEffect('vEffect_emoji_' + name);
            //     var emoji2 = playSpAnimation(name, name+2, false,null, function () {
            //         setTimeout(function () {
            //             emoji2.removeFromParent(true);
            //             sp.setPosition(_endPos);
            //
            //             var emoji3 = playSpAnimation(name, name+3, false,null, function () {
            //                 setTimeout(function () {
            //                     emoji3.removeFromParent(true);
            //                 }, 10)
            //             });
            //             if(_endPos.x<cc.winSize.width/2){
            //                 emoji3.setScaleX(-1);
            //             }
            //             sp.addChild(emoji3);
            //
            //         }, 10)
            //     });
            //     if(_beginPos.x>cc.winSize.width/2){
            //         emoji2.setScaleX(-1);
            //     }
            //     sp.addChild(emoji2);
            // })
            // if(_beginPos.x>cc.winSize.width/2){
            //     emoji.setScaleX(-1);
            // }
            // sp.addChild(emoji);

        }
    };
    var showLiMao = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        if(emojiId==7 && res['sp_limao_json']) {
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var pos = node.getEffectEmojiPos(_casterRow,_patientRow,true);
            var _beginPos = pos[_casterRow];
            sp.setPosition(_beginPos);
            var _endPos = pos[_patientRow];
            var name = effectEmojiCfg[emojiId].name ;
            var emoji = playSpAnimation(name, name + 1, false, null,function () {
                setTimeout(function () {
                    emoji.removeFromParent(true);
                }, 10)
                playEffect('vEffect_emoji_' + name);
                var emoji2 = playSpAnimation(name, name+2, false,null, function () {
                    setTimeout(function () {
                        emoji2.removeFromParent(true);
                        sp.setPosition(_endPos);

                        var emoji3 = playSpAnimation(name, name+3, false,null, function () {
                            setTimeout(function () {
                                emoji3.removeFromParent(true);
                            }, 10)
                        });
                        if(_endPos.x<cc.winSize.width/2){
                            emoji3.setScaleX(-1);
                        }
                        sp.addChild(emoji3);

                    }, 10)
                });
                if(_beginPos.x>cc.winSize.width/2){
                    emoji2.setScaleX(-1);
                }
                sp.addChild(emoji2);
            })
            if(_beginPos.x>cc.winSize.width/2){
                emoji.setScaleX(-1);
            }
            sp.addChild(emoji);

        }
    };
    var playAnimSceneNoCache = function (distNode, res, posx, posy, loop,func) {
        var cacheNode = null;
        if (!cacheNode) {
            var name = res.split("-");
            var animScene = ccs.load(name[0], 'res/');
            cacheNode = animScene.node;
            cacheNode.setName(res);
            distNode.addChild(cacheNode);
            cacheNode.runAction(animScene.action);
            cacheNode.setPosition(posx, posy);

            var userdata = cacheNode.getUserData() || {};
            userdata.action = animScene.action;
            cacheNode.setUserData(userdata);
        }

        var userdata = cacheNode.getUserData();
        userdata.action.play('action', loop);
        if(func){
            userdata.action.setLastFrameCallFunc(function () {
                setTimeout(function () {
                    func();
                },10);
            });
        }
        return cacheNode;
    };
    var showShoes = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        if(emojiId==4 && res['effect_emoji_shoe_2']) {
            var getAngleByPos= function (p1,p2) {
                var p = {}
                p.x = p2.x - p1.x;
                p.y = p2.y - p1.y;
                var r = Math.atan2(p.y,p.x)*180/Math.PI;
                return r

            };
            var allCfg={
                24:{rotate:60},
            };
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var pos = node.getEffectEmojiPos(_casterRow,_patientRow,true);
            var _beginPos = pos[_casterRow];
            var _endPos = pos[_patientRow];
            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            // angle=90-getAngleByPos(_beginPos,_endPos);
            // var jiaodu=getAngleByPos(_beginPos,_endPos);
            sp.setPosition(_beginPos);
            var effect_emoji ="effect_emoji_shoe_2";
            var effect_emoji3 ="effect_emoji_shoe_3";

            for (var i=0;i<15;i++)
            {
                setTimeout(function (key) {
                    playEffect("vEffect_emoji_shoe");
                    // var zidan = new cc.Sprite(res.bullet);
                    // var zidanPos=cc.p(25,25);
                    // zidan.setPosition(zidanPos);
                    // zidan.setRotation(angle);
                    // zidan.setOpacity(0);
                    // sp.addChild(zidan, 30);
                    var zidan = playAnimSceneNoCache(sp, res[effect_emoji]+"-"+key, 0, 0, false, function () {
                        // sp.removeAllChildren();
                    });
                    var zidanPos=cc.p(25,25);
                    zidan.setPosition(zidanPos);
                    zidan.setRotation(angle);
                    // zidan.setOpacity(0);
                    // sp.addChild(zidan, 30);


                    var x2=(25 - Math.ceil(Math.random()*80))*(_patientRow != node.getOriginalPos()?1:1);
                    var y2=(25 - Math.ceil(Math.random()*80))*(_patientRow != node.getOriginalPos()?1:1);
                    var ePos=cc.p(_endPos.x-_beginPos.x+x2, _endPos.y-_beginPos.y+y2);
                    var lenth=cc.pDistance(zidanPos,ePos);
                    var time=lenth/3000
                    var spa=cc.spawn(cc.fadeTo(time/6,255),cc.moveTo(time, ePos.x, ePos.y));
                    zidan.runAction(cc.sequence(
                        _patientRow != node.getOriginalPos()?spa:cc.spawn(spa,cc.scaleTo(time, 1))
                        ,cc.callFunc(function (key1) {
                            zidan.removeFromParent(true);
                            var dankong = playAnimSceneNoCache(sp, res[effect_emoji3], 0, 0, false, function (key2) {
                                dankong.removeFromParent();
                                // cc.log(key2);
                                if(key2==14){
                                    // cc.log("zhangzhisong");
                                    sp.removeFromParent();
                                }
                            }.bind(this,key1));
                            dankong.setPosition(cc.p(ePos.x+x2, ePos.y+y2));
                            var rotation = Math.random()*360;
                            dankong.setRotation(rotation);
                            dankong.setScale(1);
                            // sp.addChild(dankong, 30);

                        }.bind(this,key))
                    ));
                }.bind(this,i), i*100);
            }
            // var cacheNode = playAnimScene(sp, res[effect_emoji], 0, 0, false, function () {
            //     sp.removeAllChildren();
            // });
            // cacheNode.setRotation(angle);
            return;
        }
    };
    var showEgg = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        if(emojiId==3 && res['effect_emoji_egg_2']) {
            var getAngleByPos= function (p1,p2) {
                var p = {}
                p.x = p2.x - p1.x;
                p.y = p2.y - p1.y;
                var r = Math.atan2(p.y,p.x)*180/Math.PI;
                return r

            };
            var allCfg={
                24:{rotate:60},
            };
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var pos = node.getEffectEmojiPos(_casterRow,_patientRow,true);
            var _beginPos = pos[_casterRow];
            var _endPos = pos[_patientRow];
            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            // angle=90-getAngleByPos(_beginPos,_endPos);
            // var jiaodu=getAngleByPos(_beginPos,_endPos);
            sp.setPosition(_beginPos);
            var effect_emoji ="effect_emoji_egg_2";
            var effect_emoji3 ="effect_emoji_egg_3";

            for (var i=0;i<15;i++)
            {
                setTimeout(function (key) {
                    playEffect("vEffect_emoji_egg");
                    // var zidan = new cc.Sprite(res.bullet);
                    // var zidanPos=cc.p(25,25);
                    // zidan.setPosition(zidanPos);
                    // zidan.setRotation(angle);
                    // zidan.setOpacity(0);
                    // sp.addChild(zidan, 30);
                    var zidan = playAnimSceneNoCache(sp, res[effect_emoji]+"-"+key, 0, 0, false, function () {
                        // sp.removeAllChildren();
                    });
                    var zidanPos=cc.p(25,25);
                    zidan.setPosition(zidanPos);
                    zidan.setRotation(angle);
                    // zidan.setOpacity(0);
                    // sp.addChild(zidan, 30);


                    var x2=(25 - Math.ceil(Math.random()*100))*(_patientRow != node.getOriginalPos()?1:1);
                    var y2=(25 - Math.ceil(Math.random()*100))*(_patientRow != node.getOriginalPos()?1:1);
                    var ePos=cc.p(_endPos.x-_beginPos.x+x2, _endPos.y-_beginPos.y+y2);
                    var lenth=cc.pDistance(zidanPos,ePos);
                    var time=lenth/3000
                    var spa=cc.spawn(cc.fadeTo(time/6,255),cc.moveTo(time, ePos.x, ePos.y));
                    zidan.runAction(cc.sequence(
                        _patientRow != node.getOriginalPos()?spa:cc.spawn(spa,cc.scaleTo(time, 1))
                        ,cc.callFunc(function (key1) {
                            zidan.removeFromParent(true);
                            var dankong = playAnimSceneNoCache(sp, res[effect_emoji3], 0, 0, false, function (key2) {
                                dankong.removeFromParent();
                                // cc.log(key2);
                                if(key2==14){
                                    sp.removeFromParent();
                                }
                            }.bind(this,key1));
                            dankong.setPosition(cc.p(ePos.x+x2, ePos.y+y2));
                            var rotation = Math.random()*360;
                            dankong.setRotation(rotation);
                            // cc.log("random====="+rotation);
                            dankong.setScale(1);
                            // sp.addChild(dankong, 30);

                        }.bind(this,key))
                    ));
                }.bind(this,i), i*100);
            }
            // var cacheNode = playAnimScene(sp, res[effect_emoji], 0, 0, false, function () {
            //     sp.removeAllChildren();
            // });
            // cacheNode.setRotation(angle);
            return;
        }
    };
    var showJiaTeLin = function(caster, patientList, emojiId, times){
        if (!cc.sys.isObjectValid(node)) return;
        if(emojiId==6 && res['jiatelin_qiang_json']) {
            var getAngleByPos= function (p1,p2) {
                var p = {}
                p.x = p2.x - p1.x;
                p.y = p2.y - p1.y;
                var r = Math.atan2(p.y,p.x)*180/Math.PI;
                return r

            };
            var allCfg={
                24:{rotate:60},
            };
            var sp = new cc.Sprite();
            node.addChild(sp, 30);
            var _casterRow = node.getRowByUid(caster);
            var _patientRow = node.getRowByUid(patientList[0]);
            var pos = node.getEffectEmojiPos(_casterRow,_patientRow,true);
            var _beginPos = pos[_casterRow];
            var _endPos = pos[_patientRow];
            var hudu=cc.pAngle(_beginPos,_endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle=90-getAngleByPos(_beginPos,_endPos);
            var jiaodu=getAngleByPos(_beginPos,_endPos);
            sp.setPosition(_beginPos);
            var effect_emoji ="jiatelin_qiang_json";
            playEffect("vEffect_emoji_jiatelin");
            for (var i=0;i<20;i++)
            {
                setTimeout(function () {
                    var zidan = new cc.Sprite(res.bullet);
                    var zidanPos=cc.p(25,25);
                    zidan.setPosition(zidanPos);
                    zidan.setRotation(angle);
                    zidan.setOpacity(0);
                    sp.addChild(zidan, 30);
                    var x2=(25 - Math.ceil(Math.random()*50))*(_patientRow != node.getOriginalPos()?1:1);
                    var y2=(25 - Math.ceil(Math.random()*50))*(_patientRow != node.getOriginalPos()?1:1);
                    var ePos=cc.p(_endPos.x-_beginPos.x+x2, _endPos.y-_beginPos.y+y2);
                    var lenth=cc.pDistance(zidanPos,ePos);
                    var time=lenth/3000
                    var spa=cc.spawn(cc.fadeTo(time/6,255),cc.moveTo(time, ePos.x, ePos.y));
                    zidan.runAction(cc.sequence(
                        _patientRow != node.getOriginalPos()?spa:cc.spawn(spa,cc.scaleTo(time, 1))
                        ,cc.callFunc(function () { zidan.removeFromParent(true);
                            var dankong = new cc.Sprite(res.daikong);
                            dankong.setPosition(cc.p(ePos.x+x2, ePos.y+y2));
                            dankong.setScale(1);
                            sp.addChild(dankong, 30);
                        })
                    ));
                }, i*100);
            }
            var cacheNode = playAnimScene(sp, res[effect_emoji], 0, 0, false, function () {
                sp.removeAllChildren();
            });
            cacheNode.setRotation(angle);
            return;
        }
    };

    exports.EFFECT_EMOJI_NEW = {
        init: function (_node, _$,_buyType) {
            node = _node;
            buyType =_buyType?_buyType:"fangka";
            $ = _$;
            effectEmojiQueue = {};
            network.addListener(4990, function (data) {
                if(!effectEmojiCfg[data.emoji_idx]){
                    return ;
                }
                if(!data.target_id)  data.target_id = data.target_uid;
                if(!data.from_id)  data.from_id = data.from_uid;

                if(data.emoji_idx == 6){
                    showJiaTeLin(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                }
                // else if(data.emoji_idx == 7){
                //     showLiMao(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                // }
                else if(data.emoji_idx == 3){
                    showEgg(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                }else if(data.emoji_idx == 4){
                    showShoes(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                }
                // else if(data.emoji_idx == 11){
                //     showPengbei(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                // }
                else {
                    addEffectEmojiQueue(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
                }
            });
            network.addListener(3018,function (date) {
                if(date.errorMsg){
                    date.errorMsg = date.errorMsg.replace('\\n','\n');
                    alert1(date.errorMsg);
                    return;
                }
                if(date.cmd == 'queryEmoji'){
                    gameData.emoji = date.emoji || {};//数量
                    if(date.price){
                        gameData.price = date.price;//价格
                    }else{
                        gameData.price = {};
                    }
                    if(buyType=="diamonds"){
                        gameData.price =  date.PriceDiamonds ;
                    }

                    // if(node && gameData.EmojiPlayerInfo && !date['push']){
                    //     node.addChild(new PlayerInfoLayer(gameData.EmojiPlayerInfo));
                    // }
                }else if(date.cmd == 'buyEmoji'){

                }else if(date.cmd == 'useEmoji'){

                }
            });
            if(buyType=="diamonds"){
                network.send(3018, {cmd: 'queryEmoji',uid: gameData.uid,room_id:gameData.roomId,showOption:32767});
            }else {
                network.send(3018, {cmd: 'queryEmoji',uid: gameData.uid,room_id:gameData.roomId});
            }

        },
        destroy: function () {
            node = null;
            $ = null;
        }
    };


    exports.PlayerInfoLayerInGame = cc.Layer.extend({
        _cdbarArray:null,
        onEnter: function () {
            var self = this;
            cc.Layer.prototype.onEnter.call(this);
            self.onTimer();
            self.scheduleTimer = self.scheduleOnce(self.onTimer, 0.01, "");
        },
        onExit:function () {
            this._cdbarArray = null;
            this.unscheduleAllCallbacks();
            cc.Layer.prototype.onExit.call(this);
        },
        ctor:function (playerInfo,isMain,hideBtn) {
            this._super();
            var self = this;
            self._cdbarArray = [];
            self.init(playerInfo,isMain,hideBtn)
        },
        init: function (playerInfo,isMain, hideBtn) {
            var self = this;
            self.playerInfo=playerInfo;
            var targetUid = playerInfo['ID']||playerInfo.uid;
            var targetSex = playerInfo['Sex']||playerInfo['sex'];
            var targetNickName = playerInfo['nickname']||playerInfo['NickName'];
            var targetHeadimgUrl = playerInfo['headimgurl']||playerInfo['HeadIMGURL']
            var targetID = playerInfo['ID']||playerInfo['uid'];
            var targetIP = playerInfo['IP']||playerInfo['ip'];
            var targetLocCN = playerInfo["locationInfo"]|| playerInfo['locCN']||decodeURIComponent(playerInfo['locationCN']);
            if(targetLocCN == ''){
                targetLocCN = '未知地址';
            }
            var node = null;
            var root = null;
            if (isMain) {
                node = loadFile(this,res.PlayerInfo_json);
                root = node.getChildByName('root');
            } else{
                node = loadFile(this,res.PlayerInfoOtherNew_json);
                root = node.getChildByName('root');
            }
            node.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));

            if(root){
                root.setPositionX(-cc.winSize.width/2 + 1280/2);
                root.setContentSize(cc.winSize);
            }

            var head = self["_head"];
            var lbNickname = self["_lb_nickname"];
            var lbId = self["_lb_id"];
            var lbIp = self["_lb_ip"];
            var male = self["_sex_1"];
            var female = self["_sex_0"];
            var lbAD = self["_lb_ad"];

            lbAD.setVisible(true);
            lbNickname.setString('昵称：'+targetNickName);
            //loadImageToSprite(targetHeadimgUrl, head);
            loadImageToSprite(targetHeadimgUrl, head, head.getContentSize().width / 2);
            lbId.setString('ID：'+targetID);
            lbIp.setString('IP：'+targetIP);
            lbAD.setString('地址：'+targetLocCN);
            male.setVisible(targetSex == '1');
            female.setVisible(targetSex == '2');
            TouchUtils.setOnclickListener(self["_btn_close"], function () {
                self.removeFromParent(true);
            });
            if(isMain){
                return;
            }
            self["_zhezhao"].setVisible(false);
            self["_self"].setVisible(targetUid == gameData.uid);
            self["_other"].setVisible(targetUid != gameData.uid);

            if(gameData.mapId == MAP_ID.PDK_JBC){
                var lb1 = self["_ico_ip"];
                if(lb1) lb1.setVisible(false);
                var lb2 = self["_ico_ad"];
                if(lb2) lb2.setVisible(false);
                lbIp.setVisible(false);
                lbAD.setVisible(false);
            }
            if(targetUid == gameData.uid){
                var indexs = {1: "expression1", 2: "expression2", 3: "expression11", 4: "sp_chuizhuozi"};
                var emojiNode = self["_self"];
                for(var i=1;i<=selfProp.length;i++) {
                    (function (k) {
                        var target = emojiNode["emoji" + k];
                        target.setPosition(cc.p(selfProp[i-1].posX,selfProp[i-1].posY));
                        if(hideBtn == false)  target.setVisible(hideBtn);
                        if(k>0&&k<=17){
                            self.addCDbar(target);
                            self.addNum(target,effectEmojiCfgSelf[i].name);
                        }else {
                            if(target["xianmian"]){
                                target["xianmian"].setVisible(false);
                            }
                            if(target["num"]){
                                target["num"].setVisible(false);
                            }
                        }
                        TouchUtils.setOnclickListener(target, function () {
                            if(target["cdbar"]){
                                if(getCurTimestamp() - gameData.timestamp > TIMESTAMP){
                                    if(gameData.price && gameData.emoji){
                                        if(target.isXianMian || (!target.isXianMian && target._num>0)){
                                            gameData.timestamp = getCurTimestamp();
                                            var codertmp = 3008;
                                            var dt = null;
                                            if (gameData.mapId == MAP_ID.NN || gameData.mapId == MAP_ID.DN || gameData.mapId == MAP_ID.DN_JIU_REN || gameData.mapId == MAP_ID.DN_AL_TUI ||gameData.mapId == MAP_ID.DN_WUHUA_CRAZY
                                                || gameData.mapId == MAP_ID.CP_KAOKAO || gameData.mapId == MAP_ID.CP_SICHUAN
                                                || gameData.mapId == MAP_ID.PK_13S) {
                                                codertmp = 5000;
                                                dt = "Say/" + JSON.stringify({
                                                        roomid: gameData.roomId,
                                                        type: 'emoji',
                                                        emoji_name: effectEmojiCfgSelf[k].name,
                                                        emoji_idx: k,
                                                        uid: gameData.uid,
                                                        content: indexs[k]
                                                    });
                                            }
                                            network.send(3018, {
                                                cmd: 'useEmoji',
                                                emoji_name:effectEmojiCfgSelf[k].name,
                                                emoji_idx:indexs[k],
                                                coder:codertmp,
                                                uid: gameData.uid,
                                                room_id:gameData.roomId,
                                                type: 'emoji',
                                                content: indexs[k]}, dt);
                                            self.removeFromParent(true);
                                        }else{
                                            var buydesc = buyTypeDesc[buyType];
                                            var str = "是否花1"+buydesc+"，购买"+gameData.price[effectEmojiCfgSelf[k].name] + '次表情使用次数？';
                                            cc.director.getRunningScene().addChild(new BuyTishiLayer(str,function () {
                                                gameData.timestamp = getCurTimestamp();
                                                network.send(3018, {
                                                    cmd: 'buyAndUse',
                                                    count:1,
                                                    emoji_name:effectEmojiCfgSelf[k].name,
                                                    emoji_idx:indexs[k],
                                                    coder:3008,
                                                    uid: gameData.uid,
                                                    room_id:gameData.roomId,
                                                    type: 'emoji',
                                                    currency:buyType,
                                                    content: indexs[k]});
                                                self.removeFromParent(true);
                                            }),1000);
                                        }
                                    }else{
                                        gameData.timestamp = getCurTimestamp();
                                        self.onSendExpression(indexs[k],targetUid);
                                        // self.removeFromParent(true);
                                    }
                                }else{
                                    alert1('表情冷却中，请稍等');
                                }
                            }else{
                                self.onSendExpression(indexs[k],targetUid);
                                // self.removeFromParent(true);
                            }
                        });
                    })(i);
                }
            }else{
                var emojiNode = self["_other"];
                for(var i=1;i<=otherProp.length;i++) {
                    (function (k) {
                        var target = emojiNode["emoji" + k];
                        target.setPosition(cc.p(otherProp[i-1].posX,otherProp[i-1].posY));
                        if(hideBtn == false)  target.setVisible(hideBtn);
                        self.addCDbar(target);
                        self.addNum(target,effectEmojiCfg[k].name);
                        TouchUtils.setOnclickListener(target, function () {
                            if(target["cdbar"]){
                                if(getCurTimestamp() - gameData.timestamp > TIMESTAMP){
                                    if(gameData.price && gameData.emoji){
                                        var _obj = [];
                                        _obj.push(targetUid);
                                        if(target.isXianMian || (!target.isXianMian && target._num>0)){
                                            gameData.timestamp = getCurTimestamp();
                                            var codertmp = 3008;
                                            var dt = null;
                                            if (gameData.mapId == MAP_ID.NN || gameData.mapId == MAP_ID.DN || gameData.mapId == MAP_ID.DN_JIU_REN || gameData.mapId == MAP_ID.DN_AL_TUI ||gameData.mapId == MAP_ID.DN_WUHUA_CRAZY
                                            || gameData.mapId == MAP_ID.CP_KAOKAO || gameData.mapId == MAP_ID.CP_SICHUAN
                                                || gameData.mapId == MAP_ID.PK_13S) {
                                                codertmp = 5000;
                                                var content = JSON.stringify({
                                                    from_uid: gameData.uid,
                                                    emoji_idx: k,
                                                    emoji_name: effectEmojiCfg[k].name,
                                                    emoji_times: 1,
                                                    target_uid: _obj,
                                                    target_id: _obj
                                                });
                                                dt = "Say/" + JSON.stringify({
                                                        roomid: gameData.roomId,
                                                        type: 'biaoqingdonghua',
                                                        content: content
                                                    });
                                            }
                                            network.send(3018, {
                                                cmd: 'useEmoji',
                                                emoji_name:effectEmojiCfg[k].name,
                                                emoji_idx:k,
                                                uid: gameData.uid,
                                                room_id:gameData.roomId,
                                                emoji_times: 1,
                                                target_uid: _obj}, dt);
                                            self.removeFromParent(true);
                                        }else{
                                            var buydesc = buyTypeDesc[buyType];
                                            var str = "是否花1"+buydesc+"\n购买"+gameData.price[effectEmojiCfg[k].name] + '次道具使用次数？';
                                            cc.director.getRunningScene().addChild(new BuyTishiLayer(str,function () {
                                                gameData.timestamp = getCurTimestamp();
                                                network.send(3018, {
                                                    cmd: 'buyAndUse',
                                                    count:1,
                                                    emoji_name:effectEmojiCfg[k].name,
                                                    emoji_idx:k,
                                                    uid: gameData.uid,
                                                    room_id:gameData.roomId,
                                                    emoji_times: 1,
                                                    currency:buyType,
                                                    target_uid: _obj});
                                                self.removeFromParent(true);
                                            }),1000);
                                        }
                                    }else{
                                        gameData.timestamp = getCurTimestamp();
                                        self.onSendEffectEmoji(k, 1, targetUid);
                                        // self.removeFromParent(true);
                                    }
                                }else{
                                    alert1('表情冷却中，请稍等');
                                }
                            }else{
                                self.onSendEffectEmoji(k, 1, targetUid);
                                // self.removeFromParent(true);
                            }
                        });
                    })(i);
                }
            }
        },
        addNum:function (target,name) {
            target.isXianMian = true;
            target._num = 1;
            if(!gameData.price && !gameData.emoji){
                if(target['xianmian']){
                    target['xianmian'].setVisible(true);
                }
                if(target['num']){
                    target['num'].setVisible(false);
                }
                if(target['numbg']){
                    target['numbg'].setVisible(false);
                }
                return;
            }
            if(!gameData.price[name]){
                if(target['xianmian']){
                    target['xianmian'].setVisible(false);
                }
                if(target['num']){
                    target['num'].setVisible(false);
                }
                if(target['numbg']){
                    target['numbg'].setVisible(false);
                }
            }else if(gameData.price[name]<0){//限免
                if(target['xianmian']){
                    target['xianmian'].setVisible(true);
                }
                if(target['num']){
                    target['num'].setVisible(false);
                }
                if(target['numbg']){
                    target['numbg'].setVisible(false);
                }
            }else{
                target.isXianMian = false;
                target._num =gameData.emoji[name] || '0';
                if(target['xianmian']){
                    target['xianmian'].setVisible(false);
                }
                if(target['num']){
                    target['num'].setVisible(true);
                    target['num'].setString(target._num);
                }
                if(target['numbg']){
                    target['numbg'].setVisible(true);
                }
            }
        },
        //添加定时
        addCDbar:function (target){
            var self = this;
            cc.log("cdbar0=="+target.getName());
            if(!target["cdbar"]){
                cc.log("cdbar1=="+target.getName());
                var zhezhao =duplicateSprite(self["_zhezhao"]);
                zhezhao.setVisible(true);
                var cdbar = new cc.ProgressTimer(zhezhao);
                cdbar.setPosition(cc.p(target.getContentSize().width / 2, target.getContentSize().height / 2 + 2));
                cdbar.setType(cc.ProgressTimer.TYPE_RADIAL);
                cdbar.setMidpoint(cc.p(0.5, 0.5));
                cdbar.setOpacity(200);
                cdbar.setReverseDirection(true);
                self._cdbarArray.push(cdbar);
                target.addChild(cdbar);
                target["cdbar"] = cdbar;
            }
        },
        //表情
        onSendExpression:function (expression, targetUid) {
            var self = this;
            if(self.playerInfo.UserID){
                var msg = JSON.stringify({roomid: gameData.roomId, type:'emoji', voice:'', content:expression, from:targetUid});
                network.wsData("Say/" + msg);
            }else{
                network.send(3008, {room_id: gameData.roomId, type: 'emoji', content: expression});
            }
            self.removeFromParent(true);
        },
        //道具
        onSendEffectEmoji:function (emojiIdx, times, targetUid) {
            var self = this;
            var _obj = [];
            _obj.push(targetUid);
            if(self.playerInfo.UserID){
                var msg = JSON.stringify({roomid: gameData.roomId, type:'biaoqingdonghua',
                    content:JSON.stringify({from_uid:gameData.uid, emoji_idx: emojiIdx, emoji_times: times, target_uid: _obj}), from:gameData.uid});
                network.wsData("Say/" + msg);
            }else{
                network.send(4990, {room_id: gameData.roomId, emoji_idx: emojiIdx, emoji_times: times, target_uid: _obj});
            }
            self.removeFromParent(true);
        },
        onTimer:function () {
            var self = this;
            var currtime_second = getCurTimestamp();
            if(gameData.timestamp == 0){
                self.unschedule(self.scheduleTimer);
                return;
            }
            var currtime_tamp = currtime_second - gameData.timestamp;
            if(currtime_tamp<TIMESTAMP){
                var percen = 100-currtime_tamp/TIMESTAMP*100;
                for(var i=0;i<15;i++){
                    if (true) {
                        var target = self._cdbarArray[i];
                        if(target){
                            target.setPercentage(percen);
                            target.runAction(
                                cc.sequence(
                                    cc.progressTo(TIMESTAMP-currtime_tamp, 0),
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

})(this);