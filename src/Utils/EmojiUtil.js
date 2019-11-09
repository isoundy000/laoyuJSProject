/**
 * 表情逻辑组件
 */
var EmojiUtil = {
    /**
     * 表情动画类型
     */
    emojiType: {
        emoji_sp: "emoji_sp",//表情
        prop_sp: "prop_sp",//道具
        kwx_majiang: "kwx_majiang",
        niuniu: "niuniu",
        pdk: "pdk",
        fsp: 'fsp',
        psz: "psz",
        phz: "phz_face",//跑胡子表情
        phz_hyphz: "phz_hyphz"//跑胡子表情,

    },
    /**
     * 道具配置
     */
    _effectEmojiCfg: {
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
    },
    /**
     * 道具间隔时间
     */
    _effectEmojiShengyinTimeCfg: {
        'zhayao': 800,
        'maobi': 0,
        'gongjian': 800,
        'caishen': 0,
        'qifu': 0,
        'dapao': 800,
    },
    /**
     * 道具队列
     */
    _effectEmojiQueue: {},
    /**
     * 初始化表情动画
     */
    initUtil: function (node) {
        var self = this;
        this.room = node;
        //隐藏
        for (var i = 0; i < 12; i++) {
            var ChatInfo = this.room.getChatInfoNode(i)
            if (ChatInfo) {
                var prop = ChatInfo.getChildren();
                for (var k = 0; k <= prop.length; k++) {
                    var Child = prop[k];
                    if (Child) {
                        Child.setVisible(false);
                    }
                }
            }
        }
        /**
         * 道具资源
         */
        this._emojiNameTab = {
            "maobi": main_module_common_res.sp_maobi_json,
            "gongjian": main_module_common_res.sp_gongjian_json,
            "zhayao": main_module_common_res.sp_zhayao_json,
            "dapao": main_module_common_res.sp_dapao_json,
            "caishen": main_module_common_res.sp_caishen_json,
            "qifu": main_module_common_res.sp_qifu_json
        },
            /**
             * 表情队列
             */
            this._effectEmojiQueue = {};
        /**
         * Go语言聊天
         * @type {Object}
         */
        network.addListener(P.GS_Chat, function (data) {
            var jsData = JSON.parse(data.Msg);
            var uid = data.FromUser;
            var type = jsData.type;
            var content = decodeURIComponent(jsData.content);
            var voice = jsData.voice; //获得文字信息
            if (type == 'biaoqingdonghua') {
                var data = JSON.parse(content);
                data.target_id = data.target_uid;
                network.selfRecv({"code": 4990, "data": data});
            } else {
                self._showChat(self.room.getRowByUid(uid), type, content, voice);
            }
        });
        /**
         * Java表情4990
         * @type {Object}
         */
        network.addListener(MsgCode.AddEffectEmoji, function (data) {
            if (data.emoji_idx == 6) {
                self._showJiaTeLin(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
            } else {
                self._addEffectEmojiQueue(data.from_uid, data.target_id, data.emoji_idx, data.emoji_times);
            }
        });
        /**
         * Java聊天3008
         * @type {Object}
         */
        network.addListener(MsgCode.ShowChat, function (data) {
            var uid = data['uid'];
            var type = data['type'];
            var voice = data['voice'];
            var content = decodeURIComponent(data['content']);
            self._showChat(self.room.getRowByUid(uid), type, content, voice);
        });
    },
    /**
     * 删除网络监听
     */
    _removeJianTing: function () {
        network.removeListener(4990);
        network.removeListener(3008);
        network.removeListener(P.GS_Chat);
    },
    /**
     * 添加表情队列
     */
    _addEffectEmojiQueue: function (caster, patientList, emojiId, times) {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        var _casterRow = self.room.getRowByUid(caster);
        var _patientRowList = [];
        for (var _j = 0; _j < patientList.length; _j++) {
            _patientRowList.push(self.room.getRowByUid(patientList[_j]));
        }
        if (_.isUndefined(self._effectEmojiQueue[_casterRow])) {
            self._effectEmojiQueue[_casterRow] = [];
        }
        var _needBigenQueue = self._isEffectEmojiEmpty();
        var _obj = {};
        _obj.patientList = _patientRowList;
        _obj.emojiId = emojiId;
        for (var _i = 0; _i < times; _i++) {
            self._effectEmojiQueue[_casterRow].push(_obj);
        }
        if (_needBigenQueue) {
            self._startEffectEmojiQueue();
        }
    },
    /**
     * 是否有表情队列
     */
    _isEffectEmojiEmpty: function () {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return true;
        for (var _key in self._effectEmojiQueue) {
            if (self._effectEmojiQueue.hasOwnProperty(_key)) {
                if (self._effectEmojiQueue[_key].length > 0) {
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * 开始表情队列
     */
    _startEffectEmojiQueue: function () {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        for (var _key in self._effectEmojiQueue) {
            if (self._effectEmojiQueue.hasOwnProperty(_key)) {
                var _obj = self._effectEmojiQueue[_key];
                if (_obj.length > 0) {
                    for (var _i = 0; _i < _obj[0].patientList.length; _i++) {
                        self._playEffectEmoji(_key, _obj[0].patientList[_i], _obj[0].emojiId);
                    }
                    self._effectEmojiQueue[_key].splice(0, 1);
                }
            }
        }
        if (!self._isEffectEmojiEmpty()) {
            self.room.runAction(cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function () {
                    self._startEffectEmojiQueue();
                })
            ))
        }
    },
    /**
     * 播放表情动画
     */
    _playEffectEmoji: function (caster, patient, emojiId) {
        if (patient == this.room.getOriginalPos() && !settingData.pingBiBiaoQing) {
            return;
        }
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        var _emojiCfg = self._effectEmojiCfg[emojiId];
        if (_.isUndefined(_emojiCfg)) {
            return;
        }
        var sp = new cc.Sprite();
        self.room.getRootNode().addChild(sp, 30);
        if (main_module_common_res["sp_" + _emojiCfg.name + "_json"]) {
            var isnotMid = false;
            if (emojiId == 11 || emojiId == 12) {
                isnotMid = true;
            }

            self._effectEmojiSpBegin(_emojiCfg, sp, caster, patient, isnotMid);
        } else {
            self._effectEmojiBegin(_emojiCfg, sp, caster, patient);
        }
    },
    /**
     * 播放表情动画开始
     */
    _effectEmojiBegin: function (emojiCfg, sp, caster, patient) {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        var pos = self.room.getEffectEmojiPos(caster, patient);
        var _beginPos = pos[caster];
        sp.setPosition(_beginPos);
        var effect_emoji = 'effect_emoji_' + emojiCfg.name + "_1";

        playAnimScene(sp, main_module_common_res[effect_emoji], 0, 0, false, function () {
            sp.removeAllChildren();
            self._effectEmojiflying(emojiCfg, sp, caster, patient);
        });
    },
    /**
     * 播放表情动画进行中
     */
    _effectEmojiflying: function (emojiCfg, sp, caster, patient) {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        var pos = self.room.getEffectEmojiPos(caster, patient);
        var _endPos = pos[patient];
        sp.stopAllActions();
        var effect_emoji = 'effect_emoji_' + emojiCfg.name + "_2";
        playAnimScene(sp, main_module_common_res[effect_emoji], 0, 0, true);
        sp.runAction(cc.sequence(
            patient != self.room.getOriginalPos() ? cc.moveTo(0.5, _endPos) : cc.spawn(cc.moveTo(0.5, _endPos), cc.scaleTo(0.5, 4)),
            cc.callFunc(function () {
                sp.removeAllChildren();
                self._effectEmojiend(emojiCfg, sp, caster, patient);
            })
        ));
    },
    /**
     * 播放表情Sp动画开始
     */
    _effectEmojiSpBegin: function (emojiCfg, sp, caster, patient, isnotmid) {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        var pos = self.room.getEffectEmojiPos(caster, patient, isnotmid);
        var _beginPos = pos[caster];
        var _endPos = pos[patient];

        var eName = self._emojiNameTab[emojiCfg.name];

        var emoji = playSpine(eName, emojiCfg.name + '1', false, function () {
            if (emojiCfg.name != 'maobi') {
                setTimeout(function () {
                    emoji.removeFromParent(true)
                }, 10)
            }
        });

        var time = self._effectEmojiShengyinTimeCfg[emojiCfg.name];
        setTimeout(function () {
            playEffect('v' + emojiCfg.name);
        }, time);
        emoji.setPosition(_beginPos);
        emoji.setLocalZOrder(100);
        if (emojiCfg.name == 'dapao' || emojiCfg.name == 'gongjian') {
            emoji.setRotation(90 - 180 * Math.atan2(_endPos.y - _beginPos.y, _endPos.x - _beginPos.x) / Math.PI)
        }
        self.room.addChild(emoji)
        if (emojiCfg.name == 'dapao') {
            var paodan = new cc.Sprite(main_module_common_res.sp_baodan_image);
            paodan.setOpacity(0);
            paodan.setPosition(_beginPos);
            self.room.addChild(paodan)
            paodan.runAction(cc.sequence(cc.delayTime(0.7), cc.fadeIn(0),
                patient != self.room.getOriginalPos() ? cc.moveTo(1, _endPos) : cc.spawn(cc.moveTo(1, _endPos), cc.scaleTo(1, 4)),
                cc.callFunc(function () {
                    self._effectEmojiend(emojiCfg, sp, caster, patient);
                    paodan.removeFromParent(true);
                })))
        }
        else {
            if (emojiCfg.name == 'maobi') {
                emoji.runAction(cc.sequence(cc.delayTime(0.7),
                    patient != self.room.getOriginalPos() ? cc.moveTo(0.3, _endPos) : cc.spawn(cc.moveTo(0.3, _endPos), cc.scaleTo(0.3, 4)),
                    cc.callFunc(function () {
                        emoji.removeFromParent(true)
                        self._effectEmojiend(emojiCfg, sp, caster, patient);
                    })))
            }
            else {
                self._effectEmojiend(emojiCfg, sp, caster, patient, isnotmid);
            }
        }
    },
    /**
     * 播放表情动画结束
     */
    _effectEmojiend: function (emojiCfg, sp, caster, patient, isnotmid) {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        var pos = self.room.getEffectEmojiPos(caster, patient, isnotmid);
        var _beginPos = pos[caster];
        var _endPos = pos[patient];

        //SkeletonAnimation
        if (main_module_common_res["sp_" + emojiCfg.name + "_json"]) {
            var eName = self._emojiNameTab[emojiCfg.name];
            var emoji = playSpine(eName, emojiCfg.name + '2', false, function () {
                setTimeout(function () {
                    emoji.removeFromParent(true)
                }, 10)
            });

            if (emojiCfg.name == 'gongjian') {
                emoji.setRotation(90 - 180 * Math.atan2(_endPos.y - _beginPos.y, _endPos.x - _beginPos.x) / Math.PI)
            }
            emoji.setPosition(_endPos);

            emoji.setScale(patient != self.room.getOriginalPos() ? 1 : 4);
            self.room.addChild(emoji)
        } else {
            playEffect('vEffect_emoji_' + emojiCfg.name);
            var effect_emoji = 'effect_emoji_' + emojiCfg.name + "_3";
            playAnimScene(sp, main_module_common_res[effect_emoji], 0, 0, false, function () {
                sp.runAction(cc.sequence(
                    cc.fadeOut(0.3),
                    cc.callFunc(function () {
                        sp.removeFromParent();
                    })
                ))
            });
        }
    },
    /**
     * 播放表情动画加特林
     */
    _showJiaTeLin: function (caster, patientList, emojiId, times) {
        var self = this;
        if (!cc.sys.isObjectValid(self.room)) return;
        if (emojiId == 6 && main_module_common_res.jiatelin_qiang_json) {
            var getAngleByPos = function (p1, p2) {
                var p = {}
                p.x = p2.x - p1.x;
                p.y = p2.y - p1.y;
                var r = Math.atan2(p.y, p.x) * 180 / Math.PI;
                return r

            };
            var allCfg = {
                24: {rotate: 60},
            };
            var sp = new cc.Sprite();
            self.room.addChild(sp, 30);
            var _casterRow = self.room.getRowByUid(caster);
            var _patientRow = self.room.getRowByUid(patientList[0]);
            var pos = self.room.getEffectEmojiPos(_casterRow, _patientRow);
            var _beginPos = pos[_casterRow];
            var _endPos = pos[_patientRow];
            var hudu = cc.pAngle(_beginPos, _endPos);
            var angle = cc.radiansToDegrees(hudu);
            angle = 90 - getAngleByPos(_beginPos, _endPos);
            var jiaodu = getAngleByPos(_beginPos, _endPos);
            sp.setPosition(_beginPos);
            var effect_emoji = "jiatelin_qiang_json";
            playEffect("vJiatelin");
            for (var i = 0; i < 20; i++) {
                setTimeout(function () {
                    var zidan = new cc.Sprite(main_module_common_res.jiatelin_bullet);
                    var zidanPos = cc.p(25, 25);
                    zidan.setPosition(zidanPos);
                    zidan.setRotation(angle);
                    zidan.setOpacity(0);
                    sp.addChild(zidan, 30);
                    var x2 = (25 - Math.ceil(Math.random() * 50)) * (_patientRow != self.room.getOriginalPos() ? 1 : 4);
                    var y2 = (25 - Math.ceil(Math.random() * 50)) * (_patientRow != self.room.getOriginalPos() ? 1 : 4);
                    var ePos = cc.p(_endPos.x - _beginPos.x + x2, _endPos.y - _beginPos.y + y2);
                    var lenth = cc.pDistance(zidanPos, ePos);
                    var time = lenth / 3000
                    var spa = cc.spawn(cc.fadeTo(time / 6, 255), cc.moveTo(time, ePos.x, ePos.y));
                    zidan.runAction(cc.sequence(
                        _patientRow != self.room.getOriginalPos() ? spa : cc.spawn(spa, cc.scaleTo(time, 4))
                        , cc.callFunc(function () {
                            zidan.removeFromParent(true);
                            var dankong = new cc.Sprite(main_module_common_res.jiatelin_Dankong);
                            dankong.setPosition(cc.p(ePos.x + x2, ePos.y + y2));
                            dankong.setScale(_patientRow != self.room.getOriginalPos() ? 1 : 4);
                            sp.addChild(dankong, 30);
                        })
                    ));
                }, i * 100);
            }
            var cacheNode = playAnimScene(sp, main_module_common_res[effect_emoji], 0, 0, false, function () {
                sp.removeAllChildren();
            });
            cacheNode.setRotation(angle);
        }
    },
    /**
     * 对话框隐藏
     */
    _qpAction: function (innerNodes, scale9sprite, duration) {
        scale9sprite.stopAllActions();
        scale9sprite.setVisible(true);
        scale9sprite.setOpacity(255);
        scale9sprite.setScale(1.6, 1.6);
        scale9sprite.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
            for (var i = 0; i < innerNodes.length; i++)
                innerNodes[i].setVisible(false);
        })));
    },
    /**
     * 对话框全部隐藏
     */
    _qpAction2: function (innerNodes, scale9sprite, duration) {
        setTimeout(function () {
            for (var i = 0; i < innerNodes.length; i++)
                innerNodes[i].setVisible(false);
        }, 3000);

    },


    /**
     * 播放语音
     */
    playUrlVoice: function (row, type, content, voice) {
        var self = this;
        var url = decodeURIComponent(content);
        var arr = null;
        if (url.indexOf('.aac') >= 0) {
            arr = url.split(/\.aac/)[0].split(/-/);
        } else if (url.indexOf('.spx') >= 0) {
            arr = url.split(/\.spx/)[0].split(/-/);
        }
        var duration = arr[arr.length - 1] / 1000;
        window.soundQueue = window.soundQueue || [];
        window.soundQueue.push({url: url, duration: duration, row: row});
        if (window.soundQueue.length > 1) {
        } else {
            self.playVoiceQueue();
        }
    },
    /**
     * 播放语音队列
     */
    playVoiceQueue: function () {
        var self = this;
        var queue = window.soundQueue[0];
        if (queue && queue.url && queue.duration && _.isNumber(queue.row)) {
            if (queue.url.indexOf('.aac') >= 0) {
                VoiceUtil.play(queue.url);
            }
            var row = queue.row;
            var duration = queue.duration;
            var innerNodes = [];
            var ChatInfo = self.room.getChatInfoNode(row);
            if (!ChatInfo) {
                return;
            }
            for (var i = (cc.sys.isNative ? 0 : 1); i < ChatInfo.getChildren().length; i++) {
                ChatInfo.getChildren()[i].setVisible(false);
            }
            var yuyin = ChatInfo.getChildByName("yuyin");
            yuyin.setVisible(true);

            var speakerNode = yuyin.getChildByName("pos");
            var resPath = main_module_common_res.ChatSpeaker_json;
            if (!speakerNode.getChildByName(resPath)) {
                speakerNode.removeAllChildren();
                var speakerAnim = playAnimScene(speakerNode, resPath, 0, 0, true);
            }
            innerNodes.push(yuyin);
            ChatInfo.stopAllActions();
            ChatInfo.setVisible(true);
            ChatInfo.setOpacity(255);

            ChatInfo.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
                for (var i = 0; i < innerNodes.length; i++)
                    innerNodes[i].setVisible(false);
            })));

            setTimeout(function () {
                window.soundQueue.shift();
                self.playVoiceQueue();
            }, queue.duration * 1000);
        }
    },

    /**
     * 显示聊天
     */
    _showChat: function (row, type, content, voice) {
        var self = this;
        if (type == 'voice') {
            var url = decodeURIComponent(content);
            if (url && url.split(/\.spx/).length > 2)
                return;
        }

        if (type == 'voice') {
            this.playUrlVoice(row, type, content, voice);
            return;
        }
        var ChatInfo = self.room.getChatInfoNode(row);
        if (!ChatInfo) {
            return;
        }
        for (var i = (cc.sys.isNative ? 0 : 1); i < ChatInfo.getChildren().length; i++)
            ChatInfo.getChildren()[i].setVisible(false);
        var innerNodes = [];
        var duration = 4;
        if (type == EmojiUtil.emojiType.emoji_sp) {
            duration = 5;
            var emojiNode = ChatInfo.getChildByName("emoji");
            emojiNode.setVisible(true);
            emojiNode.removeAllChildren();
            var emojiCfg = self._effectEmojiCfg[content];
            var eName = self._emojiNameTab[emojiCfg.name];
            var emoji = playSpine(eName, emojiCfg.name + 1, false, function () {
                setTimeout(function () {
                    emoji.removeFromParent(true);
                }, 10)
                playEffect('v' + emojiCfg.name);
                var emoji2 = playSpine(eName, emojiCfg.name + 2, false, function () {
                    setTimeout(function () {
                        emoji2.removeFromParent(true);
                    }, 10)
                });
                emojiNode.addChild(emoji2);
            });
            emojiNode.addChild(emoji);
            innerNodes.push(emojiNode);
        } else if (type == EmojiUtil.emojiType.kwx_majiang) {//卡五星表情
            duration = 2.2;
            var emojiNode = ChatInfo.getChildByName("emoji");
            emojiNode.setVisible(true);
            emojiNode.removeAllChildren();
            var tab = [
                main_module_common_res.sp_biaoqing_cuicu_json,
                main_module_common_res.sp_biaoqing_zhuanqian_json,
                main_module_common_res.sp_biaoqing_kaixin_json,
                main_module_common_res.sp_biaoqing_kuqi_json,
                main_module_common_res.sp_biaoqing_shengqi_json,
                main_module_common_res.sp_biaoqing_BYEBYE_json,
                main_module_common_res.sp_biaoqing_tuxue_json
            ];
            var animationNameTab = [
                "biaoqing_cuicu",
                "biaoqing_zhuanqian",
                "biaoqing_kaixin",
                "biaoqing_kuqi",
                "biaoqing_shengqi",
                "biaoqing_BYEBYE",
                "biaoqing_tuxue"
            ];
            var emoji = playSpine(tab[content], animationNameTab[content], false);
            emoji.setScale(0.5);
            if (row == 0) {
                emoji.setPosition(cc.p(-70, -80));
            }
            else if (row == 1) {
                emoji.setPosition(cc.p(-80, -100));
            }
            else if (row == 3) {
                emoji.setPosition(cc.p(-70, -100));
            }
            else {
                emoji.setPosition(cc.p(-70, -100));
            }
            emojiNode.addChild(emoji);
            innerNodes.push(emojiNode);
        } else if (type == EmojiUtil.emojiType.fsp) {
            var emojiNode = ChatInfo.getChildByName("emoji");
            emojiNode.setVisible(true);
            emojiNode.removeAllChildren();
            var resPath = privy_module_res[content];
            playAnimScene(emojiNode, resPath, 0, 0, true);
            innerNodes.push(emojiNode);
        } else if (type == EmojiUtil.emojiType.psz || type == EmojiUtil.emojiType.pdk || type == EmojiUtil.emojiType.niuniu) {
            var emojiNode = ChatInfo.getChildByName("emoji");
            emojiNode.setVisible(true);
            emojiNode.removeAllChildren();
            playAnimScene(emojiNode, main_module_common_res['expression_animation_' + content], 0, 0, true);
            innerNodes.push(emojiNode);
        } else if (type == EmojiUtil.emojiType.phz) {
            var face = this.room.showChat(row, type, content, voice);
            innerNodes.push(face);
        } else if (type == EmojiUtil.emojiType.phz_hyphz) {
            var emojiNode = ChatInfo.getChildByName("emoji");
            emojiNode.setVisible(true);
            emojiNode.removeAllChildren();
            playAnimScene(emojiNode, main_module_common_res['expression_animation_' + content], 0, 0, true);
            innerNodes.push(emojiNode);
        }
        else if (type == "oldemoji") {
            var emojiNode = ChatInfo.getChildByName("emoji");
            emojiNode.setVisible(true);
            emojiNode.removeAllChildren();
            var indexs = {1: 1, 2: 2, 3: 3, 4: 10, 5: 11};
            playAnimScene(emojiNode, main_module_common_res['expression_animation_' + indexs[content]], 0, 0, true);
            innerNodes.push(emojiNode);
        } else if (type == 'text') {
            var spriteBg = ChatInfo.getChildByName("qp");
            spriteBg.setVisible(true);
            var text = spriteBg.getChildByName("text");
            var tmptext = new ccui.Text();
            //tmptext.setFontRes(text.getFontName());
            tmptext.setFontSize(text.getFontSize());
            tmptext.setTextColor(cc.color(0, 0, 0));
            tmptext.enableOutline(cc.color(255, 255, 255), 1);
            tmptext.setString(content);
            var data = ChatInfo.getUserData();
            if (!data) {
                data = {
                    initWidth: spriteBg.getContentSize().width,
                    initpos: text.getPositionX(),
                }
                ChatInfo.setUserData(data);
            }
            var textSize = cc.size(tmptext.getContentSize().width, text.getContentSize().height);
            var size = cc.size(textSize.width + (data.initpos - data.initWidth / 2 != 0 ? 60 : 50), spriteBg.getContentSize().height);
            spriteBg.setContentSize(size);
            text.setContentSize(textSize);
            text.setString(content);
            text.setPositionX(size.width / 2 + (data.initpos - data.initWidth / 2));
            innerNodes.push(spriteBg);
        }

        ChatInfo.stopAllActions();
        ChatInfo.setVisible(true);
        ChatInfo.setOpacity(255);

        ChatInfo.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5), cc.callFunc(function () {
            for (var i = 0; i < innerNodes.length; i++)
                innerNodes[i].setVisible(false);
        })));

        for (var i = 0; i < innerNodes.length; i++) {
            var innerNode = innerNodes[i];
            innerNode.stopAllActions();
            innerNode.setVisible(true);
            innerNode.setOpacity(255);
            innerNode.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5)));
        }
        if (voice && !window.inReview) {
            if((app.appName==APP_NAME.LDFPF || app.appName==APP_NAME.HYPHZ) && gameData.subModule=="huzi"){
                var sex;
                if(row == 3)
                    sex = mRoom.getUserByUserId(mRoom.sxUserId).sex;
                else
                    sex = mRoom.getUserByUserPos(gameLayer['pos'+row]).sex;
                playEffect(voice,sex);
            }else{
                playEffect(voice);
            }
        }


        // if (type == 'oldemoji' || type == 'chatemoji') {
        //     var sprite = null;
        //     var indexs = {1: 1, 2: 2, 3: 3, 4: 10, 5: 11};
        //
        //     if (window.paizhuo == "dn" || window.paizhuo == "zjh") {
        //
        //         sprite = $('playerLayer.node.info' + row);
        //         var sp = null;
        //         if (type == 'chatemoji') {
        //             sp = playAnimScene(sprite, main_module_common_res['expression_animation_' + content], 0, 0, true);
        //         }
        //         else {
        //             sp = playAnimScene(sprite, main_module_common_res['expression_animation_' + indexs[content]], 0, 0, true);
        //         }
        //         sp.setPosition(cc.p(sp.getPositionX() + 40, sp.getPositionY() + 40));
        //         sprite.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
        //             sp.removeFromParent(true);
        //         })));
        //
        //     }
        //     else if (window.paizhuo == "pdk") {
        //
        //         sprite = $('info' + row);
        //         var sp = null;
        //         if (type == 'chatemoji') {
        //             sp = playAnimScene(sprite, main_module_common_res['expression_animation_' + content], 0, 0, true);
        //         }
        //         else {
        //             sp = playAnimScene(sprite, main_module_common_res['expression_animation_' + indexs[content]], 0, 0, true);
        //         }
        //         sp.setPosition(cc.p(sp.getPositionX() + 40, sp.getPositionY() + 40));
        //         sprite.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
        //             sp.removeFromParent(true);
        //         })));
        //
        //     }
        //
        //     else {
        //         sprite = $('info' + row + '.bq');
        //         sprite.setVisible(true);
        //         sprite.removeAllChildren();
        //         sprite.stopAllActions();
        //         sprite.setOpacity(255);
        //
        //         playAnimScene(sprite, main_module_common_res['expression_animation_' + indexs[content]], 0, 0, true);
        //         sprite.runAction(cc.sequence(cc.delayTime(2), cc.fadeOut(0.5), cc.callFunc(function () {
        //             sprite.setVisible(false);
        //         })));
        //     }
        //     return;
        // }
        // var scale9sprite = this._node.initQP(row);
        // var duration = 4;
        // var innerNodes = [];
        // var posConf = window.posConf;
        // if (type == 'emoji') {
        //
        //
        //     duration = 2.2;
        //     scale9sprite.setContentSize(posConf.ltqpEmojiSize[row]);
        //     scale9sprite.setVisible(false);
        //
        //
        //     var sprite = $('emoji', scale9sprite);
        //     if (!sprite) {
        //
        //         var sprite = $('info' + row + '.emoji');
        //         if (sprite) {
        //             $('info' + row).removeChild(sprite);
        //         }
        //         sprite = new cc.Sprite();
        //         sprite.setName('emoji');
        //         sprite.setPosition(posConf.ltqpEmojiPos[row]);
        //
        //         var tab = [
        //             main_module_common_res.sp_biaoqing_cuicu_json,
        //             main_module_common_res.sp_biaoqing_zhuanqian_json,
        //             main_module_common_res.sp_biaoqing_kaixin_json,
        //             main_module_common_res.sp_biaoqing_kuqi_json,
        //             main_module_common_res.sp_biaoqing_shengqi_json,
        //             main_module_common_res.sp_biaoqing_BYEBYE_json,
        //             main_module_common_res.sp_biaoqing_tuxue_json
        //         ];
        //
        //         var animationNameTab = [
        //             "biaoqing_cuicu",
        //             "biaoqing_zhuanqian",
        //             "biaoqing_kaixin",
        //             "biaoqing_kuqi",
        //             "biaoqing_shengqi",
        //             "biaoqing_BYEBYE",
        //             "biaoqing_tuxue"
        //         ];
        //
        //
        //         if (!cc.sys.isNative) {
        //             return;
        //         }
        //         var aa = playSpine(tab[content], animationNameTab[content], false);
        //
        //         if (row == 0) {
        //             aa.setPosition(cc.p(-120, -220));
        //         }
        //         else if (row == 1) {
        //             aa.setPosition(cc.p(-180, -150));
        //         }
        //         else if (row == 3) {
        //             aa.setPosition(cc.p(-70, -150));
        //         }
        //         else {
        //             aa.setPosition(cc.p(-70, -100));
        //         }
        //
        //         sprite.addChild(aa);
        //         $('info' + row).addChild(sprite);
        //         innerNodes.push(sprite);
        //     }
        // }
        // else if (type == 'text') {
        //     var text = $('text', scale9sprite);
        //     if (!text) {
        //         text = new ccui.Text();
        //         text.setName('text');
        //         text.setFontSize(20);
        //
        //         text.setAnchorPoint(0, 0);
        //         if (window.paizhuo != "dn") {
        //             text.setTextColor(cc.color(0, 0, 0));
        //             text.enableOutline(cc.color(255, 255, 255), 1);
        //         }
        //         else {
        //             text.setTextColor(cc.color(255, 255, 255));
        //         }
        //
        //         scale9sprite.addChild(text);
        //     }
        //
        //     text.setString(content);
        //     var size = cc.size(text.getVirtualRendererSize().width + posConf.ltqpRect[row].width, posConf.ltqpRect[row].height);
        //     var textDeltaPosX = 0;
        //     var textDeltaPosY = 0;
        //
        //     if (window.paizhuo == "dn" || window.paizhuo == "zjh") {
        //         textDeltaPosX = posConf.ltqpTextDelta[gameData.maxPlayerNum][row].x;
        //         textDeltaPosY = posConf.ltqpTextDelta[gameData.maxPlayerNum][row].y;
        //     }
        //     else {
        //         textDeltaPosX = posConf.ltqpTextDelta[row].x;
        //         textDeltaPosY = posConf.ltqpTextDelta[row].y;
        //     }
        //
        //     if (gameData.playerNum == 2 && row == 0) {
        //         textDeltaPosX = -7;
        //         textDeltaPosY = 8;
        //     }
        //     text.setPosition(
        //         (size.width - text.getVirtualRendererSize().width) / 2 + textDeltaPosX,
        //         (size.height - text.getVirtualRendererSize().height) / 2 + textDeltaPosY
        //     );
        //     scale9sprite.setContentSize(size);
        //     text.setVisible(true);
        //     innerNodes.push(text);
        //
        // }
        // else if (type == 'voice') {
        //
        // }
        // if (type == 'emoji') {
        //     this._qpAction2(innerNodes, scale9sprite, duration);
        //
        // }
        // else {
        //     this._qpAction(innerNodes, scale9sprite, duration);
        // }
        //
        // if (type != 'voice') {
        //     for (var i = 0; i < innerNodes.length; i++) {
        //         var innerNode = innerNodes[i];
        //         innerNode.stopAllActions();
        //         innerNode.setVisible(true);
        //         innerNode.setOpacity(255);
        //         innerNode.runAction(cc.sequence(cc.delayTime(duration), cc.fadeOut(0.5)));
        //     }
        // }
        // if (voice && !window.inReview)
        //     playEffect(voice);
        //
        // cc.log("aaaaaaaaaaaaaaaaaaaaa");

    },

};