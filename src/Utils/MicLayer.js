(function (exports) {

    var RECORD_STATUS_RECORD_SUCCESS = 2;

    exports.MicLayer = {
        init: function (btn, node) {
            var that = node;
            var cancelOrSend = false;
            var chatTime = 0;
            var animNode = null;
            var voiceFilename = null;
            var uploadFilename = null;
            var hasSendFileName = null;
            TouchUtils.setListeners(btn, {
                onTouchBegan: function (node, touch, event) {
                    if (animNode && animNode.getParent()) {
                        animNode.removeFromParent();
                    }

                    cancelOrSend = true;
                    var ccsScene = loadNodeCCS("res/ccs/room/AnimMic.json", that, null, true);
                    animNode = ccsScene.node;
                    if(!window.sensorLandscape){
                        animNode.setRotation(-90)
                    }
                    // that.addChild(animNode);
                    animNode.runAction(ccsScene.action);
                    ccsScene.action.play('action', true);

                    chatTime = getCurTimestampMills();
                    voiceFilename = getCurTimestamp() + "-" + gameData.uid + "-";
                    uploadFilename = voiceFilename;
                    voiceFilename += Math.floor(Math.random() * 100) + '.aac';
                    VoiceUtils.startRecord();
                },
                onTouchMoveIn: function (node, touch, event) {
                    if (!cancelOrSend) {
                        cancelOrSend = true;

                        animNode.removeFromParent();
                        animNode = HUD.showLayer(HUD_LIST.AnimMic, that);
                    }
                },
                onTouchMoveOut: function (node, touch, event) {
                    if (cancelOrSend) {
                        cancelOrSend = false;
                        animNode.removeFromParent();
                        animNode = HUD.showLayer(HUD_LIST.ChatNotSendNode, that);
                        animNode.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                        // that.addChild(animNode);

                        var voice_cancel = new cc.Sprite('res/image/ui/anim/mic/voice_cancel.png');
                        voice_cancel.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                        that.addChild(voice_cancel);
                        if(!window.sensorLandscape){
                            animNode.setRotation(-90)
                            voice_cancel.setRotation(-90)
                        }
                        voice_cancel.runAction(cc.sequence(
                            cc.hide(),
                            cc.delayTime(0.4),
                            cc.show(),
                            cc.delayTime(1.2),
                            cc.removeSelf()
                        ))
                    }
                },
                onTouchEndedWithoutCheckTouchMe: function (node, touch, event) {
                    chatTime = getCurTimestampMills() - chatTime;
                    animNode.removeFromParent();
                    animNode = null;
                    if (cancelOrSend) {
                        if (chatTime > 1000) {
                            VoiceUtils.stopRecord();
                            // var interval = null;
                            // var checkFunc = function () {
                            //     var recordStatus = VoiceUtils.getCurRecordStatus();
                            //     if (recordStatus == RECORD_STATUS_RECORD_SUCCESS) {
                            //         var savedFilePath = VoiceUtils.getCurSavedVoiceFilePath();
                            //         clearInterval(interval);
                            //         uploadFilename = uploadFilename + "" + (Math.floor(chatTime) + 500) + '.aac';
                            //         NetUtils.uploadFileToOSS(savedFilePath, uploadFilename, function (url) {
                            //             var urlbase64 = encodeURIComponent(url);
                            //             var msg = JSON.stringify({
                            //                 roomid: mRoom.roomId,
                            //                 type: 'voice',
                            //                 voice: '',
                            //                 content: urlbase64,
                            //                 from: gameData.uid
                            //             });
                            //             network.wsData("Say/" + msg);
                            //         }, function () {
                            //             console.log("upload fail");
                            //         });
                            //     }
                            // };
                            // interval = setInterval(checkFunc, 32);

                            if (window.recordinterval) {
                                clearInterval(window.recordinterval);
                                window.recordinterval = null;
                            }
                            var checkFunc = function () {
                                var recordStatus = VoiceUtils.getCurRecordStatus();
                                if (recordStatus == RECORD_STATUS_RECORD_SUCCESS) {
                                    var savedFilePath = VoiceUtils.getCurSavedVoiceFilePath();
                                    clearInterval(window.recordinterval);
                                    uploadFilename = uploadFilename + "" + (Math.floor(chatTime) + 500) + '.aac';
                                    //防止声音多次上传
                                    if (hasSendFileName) {
                                        if (uploadFilename.indexOf(hasSendFileName) > -1)return;
                                    }
                                    hasSendFileName = uploadFilename;

                                    NetUtils.uploadFileToOSS(savedFilePath, uploadFilename, function (url) {
                                        if(window.paizhuo == "majiang" || window.paizhuo == "zjh" || window.paizhuo == "pdk"|| window.paizhuo == "scpdk"
                                            || window.paizhuo == "majiang_sc"|| window.paizhuo == "epz") {
                                            network.send(3008, {room_id: gameData.roomId, type: "voice", content: url});
                                        }else {
                                            var urlbase64 = encodeURIComponent(url);
                                            var msg = JSON.stringify({
                                                roomid: mRoom.roomId,
                                                type: 'voice',
                                                voice: '',
                                                content: urlbase64,
                                                from: gameData.uid
                                            });
                                            network.wsData("Say/" + msg);
                                        }
                                    }, function () {
                                        console.log("upload fail");
                                    });
                                }
                            };
                            window.recordinterval = setInterval(checkFunc, 32);
                        } else {
                            animNode = HUD.showLayer(HUD_LIST.ChatErrorNode, that);
                            animNode.setPosition(that.getContentSize().width / 2, that.getContentSize().height / 2);
                            animNode.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                animNode.removeFromParent();
                                animNode = null;
                            })));
                            // that.addChild(animNode);
                            VoiceUtils.stopRecord();
                        }
                    }
                    else
                        VoiceUtils.stopRecord();
                }
            });
        }
    }

})(this);