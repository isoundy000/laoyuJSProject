(function () {
    var exports = this;

    var $ = null;

    var ChatLayer = cc.Layer.extend({
        ctor: function () {
            var that = this;

            this._super();

            // var scene = ccs.load(res.Chat_json, 'res/');
            var scene = loadNodeCCS(res.Chat_json, this, "Scene");
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));


            if (!window.sensorLandscape) {
                $('root').setRotation(-90);
                $('root').y = 80;
                // $('root').setPositionX(cc.winSize.height / 2 - 720 / 2);
            } else {
                // $('root').setPositionX(cc.winSize.width / 2 - 1280 / 2);
            }

            var panelOriPos = $('root.panel').getPosition();
            var panelnewPos = $('root.panel').getPosition(); //cc.p(panelOriPos.x, panelOriPos.y + cc.winSize.height / 2);

            TouchUtils.setOnclickListener($('root.panel'), function () {
                that.removeFromParent(false);
            });
            TouchUtils.setOnclickListener($('root.panel.btn_back'), function () {
                that.removeFromParent(false);
            });

            var leftClick = function () {
                // $('root.panel.btn_left').setTexture("res/image/ui/btn/btn_commit3.png");
                // $('root.panel.btn_right').setTexture("res/image/ui/btn/btn_commit3.png");
                $('root.panel.btn_left').setOpacity(255);
                $('root.panel.btn_right').setOpacity(1);
                $('root.panel.left').setVisible(true);
                $('root.panel.right').setVisible(false);
            };

            var rightClick = function () {
                // $('root.panel.btn_left').setTexture("res/image/ui/btn/btn_commit3.png");
                // $('root.panel.btn_right').setTexture("res/image/ui/btn/btn_commit3.png");
                $('root.panel.btn_left').setOpacity(1);
                $('root.panel.btn_right').setOpacity(255);
                $('root.panel.left').setVisible(false);
                $('root.panel.right').setVisible(true);
            };

            TouchUtils.setOnclickListener($('root.panel.btn_left'), leftClick, {sound: "tab"});
            TouchUtils.setOnclickListener($('root.panel.btn_right'), rightClick, {sound: "tab"});

            leftClick();
            this.initMic();

            // ==================================================================
            var wordsArr = [
                '大家好，很高兴见到各位！'
                , '快点儿啊，我等的花都谢了！'
                , '我是庄家，谁敢挑战我！'
                , '看我通杀全场！这些钱全是我的！'
                , '风水轮流转，底裤都输光了！'
                , '大牛吃小牛，不要伤心哦！'
                , '不要吵了，专心玩游戏吧！'
                , '一点小钱，那都不是事儿！'
                , '大家一起浪起来！'
                , '木有小伙伴给我送礼物吗？'
                , '底牌亮出来，绝对吓死你！'
                , '嚯！你真是一个天生的演员。'
                , '不好意思啊，我要离开一会儿。'
                , '再见了，我们会想你的。'
                , '不要走，决战到天亮！'
                , '你这么牛X，你家里人知道吗？'
                , '哦，糟了'
            ];
            if (mRoom.wanfatype == mRoom.YOUXIAN || window.paizhuo == "kaokao" || window.paizhuo == "13shui") {
                wordsArr = [
                    '快点啊,等的花都谢了'
                    , '怎么又断线了,网络怎么那么差啊'
                    , '不要走,决战到天亮'
                    , '你的牌打得也太好了'
                    , '你是妹妹,还是哥哥'
                    , '和你合作真是太愉快了'
                    , '大家好,很高兴见到各位'
                    , '各位不好意思,我得离开一会儿'
                    , '不要吵了，有什么好吵的，专心玩游戏吧'
                    , '你这么牛X，你家里人知道吗？'
                    , '哦，糟了'
                ];
            }


            if(window.paizhuo == "majiang" || window.paizhuo == "pdk"|| window.paizhuo == 'pdk_match'|| window.paizhuo == "scpdk"|| window.paizhuo == "pdk_jbc" || window.paizhuo == "zjh" || window.paizhuo == "majiang_sc" || window.paizhuo =='epz'){

                wordsArr = [
                    '快点啊，我等到花儿也谢了'
                    , '怎么又断线了啊，网络怎么这么差啊'
                    , '不要走，决战到天亮'
                    , '你的牌打得太好啦'
                    , '你是妹妹还是哥哥'
                    , '和你合作真是太愉快了'
                    , '大家好，很高兴见到各位'
                    , '各位，真不好意思我要离开一会'
                    , '不要吵了，有什么好吵的，专心玩游戏吧'
                    , '你这么牛X，你家里人知道吗？'
                    , '哦，糟了'
                ];
                if (gameData.speakCSH) {
                    wordsArr = [
                        '今天真的背'
                        , '别墨迹了'
                        , '哈哈,手气正好'
                        , '气死我了'
                        , '叫我怎么说呢'
                        , '你太牛了'
                    ];
                    var soundArr = [
                        [
                            '今天真的背',
                            '我的个娘啊',
                            '下手别这样重啊',
                            '想哭却哭不出来'
                        ],
                        [
                            '别墨迹了',
                            '快点快点,别打酱油了',
                            '想啥呢?出牌啊',
                            '咋比乌龟还慢呢'
                        ],
                        [
                            '哈哈,手气正好',
                            '今儿真高兴',
                            '爽爆了',
                            '我可以不笑么?哈哈哈哈'
                        ],
                        [
                            '放学你别走',
                            '气死我了',
                            '伤不起',
                            '咋这么菜呢'
                        ],
                        [
                            '汗汗汗汗',
                            '叫我怎么说呢',
                            '你不懂我的心啊',
                            '无语'

                        ],
                        [
                            '必须点个赞',
                            '你太牛了',
                            '神一样的队友',
                            '这牌打得好'
                        ]

                    ];
                }
            }

            var setWordsClickCallback = function (node, i) {
                // todo
                TouchUtils.setOnclickListener(node, function () {
                    if(window.paizhuo == "majiang" || window.paizhuo == "pdk"|| window.paizhuo == 'pdk_match'|| window.paizhuo == "scpdk"|| window.paizhuo == "pdk_jbc" || window.paizhuo == "zjh" || window.paizhuo == "majiang_sc" || window.paizhuo =='epz')
                    {
                        if (gameData.speakCSH) {
                            var _soundArr = soundArr[i];
                            var rand = Math.floor(Math.random() * _soundArr.length);
                            network.send(3008, {
                                room_id: gameData.roomId,
                                voice: 'vcsv' + (i + 1) + '_' + rand + '_' + ((gameData.sex == null || gameData.sex == 0) ? '1' : gameData.sex),
                                type: 'text',
                                content: _soundArr[rand]
                            });
                        } else {
                            network.send(3008, {
                                room_id: gameData.roomId,
                                voice: 'vv_ma' + (i + 1) + '_' + ((gameData.sex == null || gameData.sex == 0) ? '1' : gameData.sex),
                                type: 'text',
                                content: wordsArr[i]
                            });
                        }
                    } else {
                        // network.send(3008, {room_id: gameData.roomId, voice: 'vv' + (i + 1) + '_' + gameData.sex, type: 'text', content: wordsArr[i]});
                        var msg = JSON.stringify({
                            roomid: mRoom.roomId,
                            type: 'text',
                            voice: 'vv' + (i + 1) + '_' + ((gameData.sex == null || gameData.sex == 0) ? '1' : gameData.sex),
                            content: wordsArr[i],
                            from: gameData.uid
                        });
                        if (mRoom.wanfatype == mRoom.YOUXIAN || window.paizhuo == "kaokao" || window.paizhuo == "13shui") {
                            msg = JSON.stringify({
                                roomid: mRoom.roomId,
                                type: 'text',
                                voice: 'vv2_' + (i + 1) + '_' + ((gameData.sex == null || gameData.sex == 0) ? '1' : gameData.sex),
                                content: wordsArr[i],
                                from: gameData.uid
                            });
                        }
                        network.wsData("Say/" + msg);
                    }
                    that.removeFromParent(false);
                }, {swallowTouches: false, effect: "none"});
            };

            var scrollView = $('root.panel.left.scrollview');
            var row0 = $('row0', scrollView);
            var innerHeight = wordsArr.length * (row0.getContentSize().height);
            if (innerHeight <= scrollView.getContentSize().height) {
                innerHeight = scrollView.getContentSize().height;
            }
            for (var i = 0; i < wordsArr.length; i++) {
                var node = $('row' + i, scrollView);
                if (!node) {
                    node = duplicateSprite(row0);
                    node.setName('row' + i);
                    row0.getParent().addChild(node);
                }
                node.setPositionY(innerHeight - (row0.getContentSize().height) * (i + 1) + 30);
                $("label", node).setString(wordsArr[i]);
                $("label", node).setLocalZOrder(1);

                setWordsClickCallback(node, i);
            }

            scrollView.innerHeight = innerHeight;

            // ==================================================================
            /*----------------------- 比赛场 ----------------------- */
            if (gameData.matchId) {
                $('root.panel.mask').setVisible(false);
            }
            /*----------------------- 比赛场 ----------------------- */

            if (gameData.mapId == MAP_ID.PDK_JBC) {
                $('root.panel.mask').setVisible(false);
            }

            TouchUtils.setOnclickListener($('root.panel.mask'), function () {
            });

            var input = $('root.panel.mask.input');
            input.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            input.addEventListener(function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        $('root.panel').setPosition(panelnewPos);
                        // cc.log("attach with IME");
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        $('root.panel').setPosition(panelOriPos);
                        // cc.log("detach with IME");
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        // cc.log("insert words");
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        // cc.log("delete word");
                        break;
                    default:
                        break;
                }
            }, this);

            TouchUtils.setOnclickListener($('root.panel.mask.btn_send'), function () {
                var str = _.trim(input.getString());
                if (!!str) {
                    if(window.paizhuo == "majiang" || window.paizhuo == "pdk" || window.paizhuo == 'pdk_match' || window.paizhuo == "scpdk"|| window.paizhuo == "pdk_jbc" || window.paizhuo == "zjh"|| window.paizhuo == "majiang_sc"|| window.paizhuo =='epz')
                    {
                        network.send(3008, {room_id: gameData.roomId, type: 'text', content: input.getString()});
                        input.setString("");
                    } else {
                        var msg = JSON.stringify({
                            roomid: mRoom.roomId,
                            type: 'text',
                            content: input.getString(),
                            from: gameData.uid
                        });
                        network.wsData("Say/" + msg);
                        input.setString("");
                    }
                    input.didNotSelectSelf();
                    that.removeFromParent(false);
                    return;
                }
                input.didNotSelectSelf();
            });
            var emojiArr = [];
            for (var i = 1; i <= 9; i++) {
                emojiArr.push("expression" + i + "01.png");
            }
            var setEmojiClickCallback = function (node, i) {
                TouchUtils.setOnclickListener(node, function () {
                    if(window.paizhuo == "majiang" || window.paizhuo == "pdk"|| window.paizhuo == 'pdk_match'|| window.paizhuo == "scpdk" || window.paizhuo == "pdk_jbc"|| window.paizhuo == "zjh"|| window.paizhuo == "majiang_sc"|| window.paizhuo =='epz')
                    {
                        network.send(3008, {room_id: gameData.roomId, type: 'emoji', content: emojiArr[i]});
                    } else {
                        var msg = JSON.stringify({
                            roomid: mRoom.roomId,
                            type: 'emoji',
                            voice: '',
                            content: emojiArr[i],
                            from: gameData.uid
                        });
                        network.wsData("Say/" + msg);
                    }

                    that.removeFromParent(false);
                }, {swallowTouches: false});
            };

            var emojiScrollView = $('root.panel.right.scrollview');
            var a0 = $('a0', emojiScrollView);
            var deltaX = -5;
            var deltaY = 0;
            for (var k = 0; k < emojiArr.length; k++) {
                var i = Math.floor(k / 3);
                var j = k % 3;
                var node = $('a' + k, emojiScrollView);
                if (!node) {
                    node = duplicateSprite(a0);
                    setSpriteFrameByName(node, emojiArr[k], 'animation/expression');
                    node.setName('a' + k);
                    a0.getParent().addChild(node);
                }
                var x = a0.getPositionX() + j * (120 + deltaX);
                var y = a0.getPositionY() - i * (120 + deltaY);
                var scale = 0.7;
                switch (k) {
                    case 1:
                        x += 5;
                        break;
                    case 2:
                        scale = 0.85;
                        break;
                    case 4:
                        x -= 10;
                        scale = 0.85;
                        break;
                    case 5:
                        x += 10;
                        break;
                    case 8:
                        x += 30;
                        break;
                }
                node.setScale(scale);
                node.setPosition(x, y);
                setEmojiClickCallback(node, k);
            }

            return true;
        },
        //语音
        initMic: function () {
            var that = this;
            var cancelOrSend = false;
            var chatTime = 0;
            var animNode = null;
            var voiceFilename = null;
            var uploadFilename = null;
            var btn_mic = getUI(this, "btn_mic");
            this.btn_mic = btn_mic;
            if (btn_mic == null)
                return;

            if (window.inReview || mRoom.isReplay)
                btn_mic.setVisible(false);

            TouchUtils.setListeners(btn_mic, {
                onTouchBegan: function (node, touch, event) {
                    if (animNode && animNode.getParent()) {
                        animNode.removeFromParent();
                    }

                    cancelOrSend = true;
                    var ccsScene = ccs.load("res/ccs/room/AnimMic.json", "res/");
                    animNode = ccsScene.node;
                    that.addChild(animNode);
                    animNode.runAction(ccsScene.action);
                    ccsScene.action.play('action', true);
                    //
                    chatTime = getCurrentTimeMills();
                    voiceFilename = getCurTimestamp() + '-' + gameData.uid + '-';
                    uploadFilename = voiceFilename;
                    voiceFilename += Math.floor(Math.random() * 100) + '.spx';
                    // cc.log(voiceFilename);
                    startVoiceRecord(voiceFilename);
                },
                onTouchMoveIn: function (node, touch, event) {
                    if (!cancelOrSend) {
                        cancelOrSend = true;

                        animNode.removeFromParent();
                        // animNode = playAnimScene(that, "res/ccs/room/AnimMic.json", 0, 0, true);
                        animNode = HUD.showLayer(HUD_LIST.AnimMic, that);
                    }
                },
                onTouchMoveOut: function (node, touch, event) {
                    if (cancelOrSend) {
                        cancelOrSend = false;
                        animNode.removeFromParent();
                        // animNode = ccs.load("res/ccs/room/ChatNotSendNode.json").node;
                        animNode = HUD.showLayer(HUD_LIST.ChatNotSendNode, that);
                        animNode.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                    }
                },
                onTouchEndedWithoutCheckTouchMe: function (node, touch, event) {
                    chatTime = getCurrentTimeMills() - chatTime;
                    animNode.removeFromParent();
                    animNode = null;
                    if (cancelOrSend) {
                        if (chatTime > 1000) {
                            stopVoiceRecord(voiceFilename);
                            var interval = null;
                            var checkFunc = function () {
                                var isOpened = isFileOpened(voiceFilename);
                                if (!isOpened) {
                                    clearInterval(interval);
                                    uploadFilename = uploadFilename + '' + (Math.floor(chatTime) + 500) + '.spx';
                                    NetUtils.uploadFileToOSS(voiceFilename, uploadFilename, function (url) {
                                        //network.send(3008, {room_id: gameData.roomId, type: 'voice', content: url});
                                        var urlbase64 = encodeURIComponent(url);
                                        var msg = JSON.stringify({
                                            roomid: mRoom.roomId,
                                            type: 'voice',
                                            voice: '',
                                            content: urlbase64,
                                            from: gameData.uid
                                        });
                                        network.wsData("Say/" + msg);
                                    }, function () {
                                        // console.log('upload fail');
                                    });
                                }
                            };
                            interval = setInterval(checkFunc, 32);
                        } else {
                            // animNode = ccs.load("res/ccs/room/ChatErrorNode.json").node;
                            animNode = HUD.showLayer(HUD_LIST.ChatErrorNode, that);
                            animNode.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                            animNode.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                animNode.removeFromParent();
                                animNode = null;
                            })));
                            stopVoiceRecord(voiceFilename);
                        }
                    }
                    else
                        stopVoiceRecord(voiceFilename);
                }
            });
        }
    });
    exports.ChatLayer = ChatLayer;
})(window);
