(function (exports) {
    var id = 0;

    var isSignOn = false;
    var isShowNativeLog = true;
    var client = null;

    var isConnected = false;
    var listenerMap = {};

    var msgQueue = [];
    var timer = null;

    var disconnectCb = null;
    var fakeDisconnectCb = null;

    var isStop = false;
    var excepts = [];
    var excepts2 = [3004, 3007, 3008, 4002, 4020, 4990, 115];

    var beforeSendCallbackMap = {};

    function clearMsgs() {
        msgQueue = [];
        isStop = false;
        cc.log('clearMsgs');
    }

    function stop(e, str) {
        excepts = (e || []).concat(excepts2);
        isStop = true;
        console.log("停止消息：" + str);
    }

    function start() {
        excepts = [];
        isStop = false;
        console.log("开始消息：");
    }

    /**
     *
     * @returns {string}
     */
    function UTF8ArrayToUTF16Array(s, startIdx) {
        var aCharCode = '\n'.charCodeAt(0);
        var cCharCode = '\''.charCodeAt(0);
        if (!s)
            return '';
        var i, codes0, codes1, codes2, bytes0, bytes1, ret = '', len = s.length;
        for (i = startIdx; i < len; i++) {
            codes0 = s[i];
            if (((codes0 >> 7) & 0xff) == 0x0) {
                //单字节  0xxxxxxx
                if (s[i] == aCharCode)
                    ret += "\\n";
                else if (s[i] == cCharCode)
                    ret += '"';
                else
                    ret += String.fromCharCode(s[i]);
            } else if (((codes0 >> 5) & 0xff) == 0x6) {
                //双字节  110xxxxx 10xxxxxx
                codes1 = s[++i];
                bytes0 = codes0 & 0x1f;
                bytes1 = codes1 & 0x3f;
                ret += String.fromCharCode((bytes0 << 6) | bytes1);
            } else if (((codes0 >> 4) & 0xff) == 0xe) {
                //三字节  1110xxxx 10xxxxxx 10xxxxxx
                codes1 = s[++i];
                codes2 = s[++i];
                bytes0 = (codes0 << 4) | ((codes1 >> 2) & 0xf);
                bytes1 = ((codes1 & 0x3) << 6) | (codes2 & 0x3f);
                ret += String.fromCharCode((bytes0 << 8) | bytes1);
            }
        }
        return ret;
    }

    function update() {
        while (msgQueue.length > 0) {
            var obj = msgQueue[0];
            if (!obj) {
                msgQueue.shift();
                return;
            }
            if (isStop && excepts.indexOf(obj.code) < 0) {
                for (var i = 0; i < msgQueue.length; i++) {
                    var tCode = msgQueue[i].code;
                    if (tCode == 115 || tCode == 4990) {//聊天消息优先放队列首部 防止卡聊天
                        var delArr = msgQueue.splice(i, 1);
                        msgQueue.unshift(delArr[0])
                        return;
                    }
                }
                return;
            }
            if (obj['base64data']) {
                if (obj['protoc'] == "dn" || obj['protoc'] == "cp") {
                    try {
                        var NiuNiuChangeProxyID = [P.GS_Login, P.GS_GameStart, P.GS_RoomResult, P.GS_Vote];
                        console.log("mRoom.wanfatype==" + mRoom.wanfatype);
                        if ((mRoom.wanfatype == "dn" || obj['protoc'] == 'dn') && NiuNiuChangeProxyID.indexOf(obj.code) >= 0)
                            obj.code += 500;
                        var messageType = ProtoTypes[obj.code.toString()];   //'GS_UserJoin_MSG';
                        if (messageType == undefined) {
                            mProto.initProtoTypes();
                            messageType = ProtoTypes[obj.code.toString()];
                            if (messageType == undefined) {
                                msgQueue.shift();
                                return;
                            }
                        }
                        if(mProto.builder && mProto.builder['old']) {
                            var builder = mProto.builder['old'].build("paohuzi." + messageType);
                            if (!builder) {
                                msgQueue.shift();
                                continue;
                            }
                            var msgArr = _base64ToArrayBuffer(obj['base64data']);
                            var msgObj = builder.decode(msgArr);
                            msgQueue.shift();
                            if ((mRoom.wanfatype == "dn" || obj['protoc'] == 'dn') && NiuNiuChangeProxyID.indexOf(obj.code - 500) >= 0)
                                obj.code -= 500;
                            console.log(timestamp2time(getCurTimestamp()) + "==" + (new Date().getTime()) + "=code=" + obj.code + " recv: " + JSON.stringify(msgObj));
                            cc.eventManager.dispatchCustomEvent(obj.code, msgObj);
                        }
                    } catch (e) {
                        alertError(obj.code, e, obj);
                    }
                } else if (obj['protoc']) {
                    try {
                        var messageType = ProtoNewTypes[obj['protoc'] + '_' + obj.code.toString()];   //'GS_UserJoin_MSG';
                        if (messageType == undefined) {
                            mProto.initProtoTypes();
                            messageType = ProtoNewTypes[obj['protoc'] + '_' + obj.code.toString()];
                            if (messageType == undefined) {
                                msgQueue.shift();
                                alert1(obj.code.toString() + ' is 不存在');
                                return;
                            }
                        }
                        var builder = mProto.builder[obj['protoc']].build(mProto.protoName[obj['protoc']] + "." + messageType);
                        var msgArr = _base64ToArrayBuffer(obj['base64data']);
                        // console.log("hp==msgArr==="+msgArr);
                        var msgObj = builder.decode(msgArr);
                        // console.log("hp==msgObj==="+msgObj);
                        msgQueue.shift();

                        if (!cc.sys.isNative) {
                            // console.log(obj['protoc'] + '_' + obj.code);
                            var str = messageType.split('_')[0] + "_" + messageType.split('_')[1]
                            console.log(" code = " + obj.code + " Type = " + str + " recv: " + "\n" + JSON.stringify(msgObj));
                        }
                        // console.log(timestamp2time(getCurTimestamp()) + "==" + (new Date().getTime()) + "=code=" + obj.code + " recv: " + JSON.stringify(msgObj));
                        // cc.eventManager.dispatchCustomEvent(obj['protoc'] + '_' + obj.code, msgObj);
                        cc.eventManager.dispatchCustomEvent(obj.code, msgObj);
                    } catch (e) {
                        alertError(obj.code, e, obj);
                    }
                }
                break;
            } else {
                var callback = listenerMap[obj.code];
                if (callback) {
                    msgQueue.shift();
                    if (cc.sys.isNative)
                        console.log(timestamp2time(getCurTimestamp()) + " recv: " + JSON.stringify(obj));
                    else
                        console.log(
                            "%c[" + timestamp2time(getCurTimestamp()) + "] %crecv%c " + JSON.stringify(obj),
                            "background-color:#dfdfdf; color:blue",
                            "background-color:grey; color:blue;",
                            "color:black"
                        );
                    obj.errorCode = obj.errorCode || 0;
                    obj.errorMsg = obj.errorMsg || '';
                    do {
                        if (obj.errorCode && obj.errorMsg) {
                            var errorMsg = obj.errorMsg;
                            alert1(errorMsg);
                            HUD.removeLoading();
                            break;
                        }
                        if (true || cc.sys.isNative) {
                            try {
                                callback(obj.data, obj.errorCode);
                            } catch (e) {
                                alertError(obj.code, e, obj);
                            }
                            break;
                        }
                        callback(obj.data, obj.errorCode);
                    } while (false);
                } else if (excepts2.indexOf(obj.code) >= 0) {
                    msgQueue.shift();
                    cc.log("recv ignore: " + obj.code);
                } else {
                    if(obj.protoc=='sss'){
                        // msgQueue.shift();
                        alert1(JSON.stringify(obj))
                    }
                    cc.log("recv eee: " + obj.code);
                    spMsgHandler();
                }
                break;
            }
        }
    }

    function spMsgHandler() {
        var id3006 = -1;
        var id2001 = -1;
        var id3002 = -1;
        for (var i = 0; i < msgQueue.length; i++) {
            var message = msgQueue[i];
            switch (message.code) {
                case 2001:
                    id2001 = i;
                    break;
                case 3002:
                    id3002 = i;
                    break;
                case 3006:
                    id3006 = i;
                    break;
            }
        }
        if (id3006 > 0) {
            var msg3006 = msgQueue.splice(id3006, 1);
            msgQueue = msg3006.concat(msgQueue);
        }
        if (id3002 > 0) {
            var msg3002 = msgQueue.splice(id3002, 1);
            msgQueue = msg3002.concat(msgQueue);
        }
        if (id2001 > 0) {
            var msg2001 = msgQueue.splice(id2001, 1);
            msgQueue = msg2001.concat(msgQueue);
        }
    }

    function getNextMsgCode() {
        if (msgQueue.length < 1)
            return 0;
        if (msgQueue[0] && msgQueue[0].code)
            return msgQueue[0].code;
        return 0;
    }

    function onConnectSuccess() {
        clearMsgs();
        client.subscribe("n", {qos: 2});
        cc.log("network: onConnect");
        isConnected = true;
        timer = setInterval(update, 50);
    }

    function onConnectFailure() {
        isConnected = false;
    }

    function onConnectionLost(responseObject) {
        clearInterval(timer);
        clearMsgs();
        if (responseObject.errorCode !== 0) {
            cc.log("network onConnectionLost:" + responseObject.errorMessage);
        }
        isConnected = false;
        if (client && disconnectCb) {
            client = null;
            disconnectCb();
        }
    }

    function onMessageArrived(message) {
        var bytes = message.payloadBytes;
        // var a = parseInt(bytes[0]), b = parseInt(bytes[1]);
        // var len = a * 256 + b;

        var arr = [];
        // todo rc4

        try {
            for (var j = 2; j < bytes.length; j++)
                arr.push(bytes[j]);
            arr = bzip2.simple(bzip2.array(arr));
            arr = UTF8ArrayToUTF16Array(arr, 0);
        } catch (e) {
            arr = UTF8ArrayToUTF16Array(bytes, 2);
        }

        //noinspection JSCheckFunctionSignatures
        var str = decodeURIComponent(arr);

        try {
            var obj = JSON.parse(str);
            msgQueue.push(obj);
        } catch (e) {
            cc.log(str);
            cc.log(e);
        }

        if (!obj) {
            alertError('network', 'can not parse: ' + str);
        }
    }

    function recv(obj) {
        msgQueue.push(obj);
        update();
    }

    function selfRecv(obj) {
        msgQueue.push(obj);
    }

    function isAlive() {
        return client && isConnected;
    }

    function addListener(code, cb) {
        if (!code || !cb) {
            return;
        }
        if (code > 1000) {
            listenerMap[code] = cb;
            return;
        }
        var msgtype = code;
        var func = cb;
        cc.eventManager.removeCustomListeners(msgtype);
        var funccall = function (userData) {
            var data = userData.getUserData();
            try {
                func(data);
            } catch (e) {
                alertError(code, e, data);
            }
        };
        return cc.eventManager.addCustomListener(msgtype, funccall);
    }

    function getListenerByCode(code) {
        return listenerMap[code];
    }

    function removeListener(code) {
        delete listenerMap[code];
    }

    function removeListeners(arr) {
        for (var i = 0; i < arr.length; i++)
            delete listenerMap[arr[i]];
    }


    function send(code, data, dt) {
        if(!client){
            return;
        }
        if (!isConnected) {
            return;
        }
        if (beforeSendCallbackMap[code])
            beforeSendCallbackMap[code](data);

        var obj = {};
        obj.code = code;
        obj.data = data || {};
        if(dt)  obj.dt = dt;
        if (gameData.uid)
            obj.uid = gameData.uid;

        if (cc.sys.isNative && window.SubUpdateUtils && SubUpdateUtils.getLocalVersion) {
            obj.data.map_ver = SubUpdateUtils.getLocalVersion();
        }
        var msgStr = JSON.stringify(obj);

        var sign = '';
        if (isSignOn) {
            var sum = 0;
            for (var i = 0; i < msgStr.length; i++) {
                if (msgStr.charCodeAt(i) < 256)
                    sum += msgStr.charCodeAt(i);
            }
            sign = (sum + 245619426) % 15619472 + '';
        }

        var message = new Paho.MQTT.Message(sign + msgStr);
        message.destinationName = "n";
        client.send(message);

        if (cc.sys.isNative)
            isShowNativeLog && console.log("send: " + JSON.stringify(obj));
        else
            console.log(
                "%c[" + timestamp2time(getCurTimestamp()) + "] %csend%c " + JSON.stringify(obj),
                "background-color:#ff0000; color:blue",
                "background-color:grey; color:blue;",
                "color:black"
            );
    }

    var getKeepAliveInterval = function () {
        return window.inReview ? 66 : 8;
    };

    var getId = function () {
        return id;
    };

    var connect = function (clientId, successCB, failureCB, ip) {
        clearMsgs();
        if (isConnected) {
            successCB();
            return;
        }
        if (client)
            return;
        var url = gameData.url;
        var port = 8889;

        //少阳
        // // ip = "192.168.199.245";
        // ip = '101.37.13.203';
        // // port = 17100
        // port =  8888
        // ip = '127.0.0.1';
        // port = 17100;
        //
        // ip = '192.168.199.180';
        // port = 17100;

        // ip = "101.37.13.203";
        // port = 8089;

        //云卓 feiyu02

        // // ip = "192.168.199.159";
        // ip = "10.10.0.75";
        // port = 13200

        //考考测试服

        // ip = "192.168.199.159";

        // ip = "118.31.248.205";
        // port = 17109;
        // ip = "192.168.199.191";
        // port = 17109;

        // ip = "10.10.0.75";
        // port = 13200;
        
        // ip = '10.10.21.4';

        // ip = '118.31.248.205';//比赛场测试服
        // port = 8893;
        // ip = '192.168.199.233';
        // port = 56701;

        // ip = '192.168.199.236';
        // port = 56701;


        url = url || "ws://" + ip + ":" + port + "/mqtt";
        // if (!cc.sys.isNative) {
        console.log("connect Url ==" + url);
        // }
        client = new Paho.MQTT.Client(url, clientId);
        id = _.random(1, 16888);

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        client.connect({
            timeout: 4,
            mqttVersion: 3,
            keepAliveInterval: getKeepAliveInterval(),
            onSuccess: function () {
                onConnectSuccess();
                if (successCB){
                    successCB(ip);
                }
            }
            , onFailure: function () {
                onConnectFailure(ip);

                client = null;
                if (failureCB)
                    failureCB();
            }
        });
    };

    var getLastPingInterval = function () {
        if (isConnected && client)
            return client.getLastPingInterval();
        else
            return 16888;
    };

    var getLastPingTimestamp = function () {
        if (isConnected && client)
            return client.getLastPingTimestamp();
        else
            return 0;
    };


    var getLastPongTimestamp = function () {
        if (isConnected && client)
            return client.getLastPongTimestamp();
        else
            return 0;
    };

    var resetAndPing = function () {
        if (client && client.isConnected()) {
            client.resetAndPing();
            return true;
        }
        return false;
    };

    var resetSendPinger = function () {
        if (client && client.isConnected()) {
            client.resetSendPinger();
            return true;
        }
        return false;
    };

    var disconnect = function () {
        if (client) {
            client.disconnect();
            client = null;
            console.log("network: disconnect");
        }
    };

    var setOnDisconnectListener = function (cb) {
        disconnectCb = cb;
    };

    var fakeDisconect = function () {
        if (fakeDisconnectCb)
            fakeDisconnectCb();
    };

    var setOnFakeDisconnectListener = function (cb) {
        fakeDisconnectCb = cb;
    };

    var regBeforeSendCallback = function (code, callback) {
        beforeSendCallbackMap[code] = callback;
    };

    var wsData = function (msg) {
        network.sendPhz(5000, msg);
    };

    // var alertError = function (src, content, json) {
    //     if (!content)
    //         return;
    //     var time = timestamp2time(getCurTimestamp()) + ", 抱歉, 程序出了点小问题, 请截屏反馈给客服, 谢谢! 错误日志:\n\n";
    //     var arr = content.stack.match(/(src\/(.*)\.js:[0-9]*)|(<.\w+@)/g);
    //     if (arr) {
    //         // alert1(time + content + "\n" + arr[0] + "\n" + arr[1] + "\n" + "code=" + src);
    //     } else {
    //         // alert1(time + content.message + ", code=" + src);
    //     }
    //
    //     content = time +
    //         (gameData.roomId ? '房间号: ' + gameData.roomId + ', 局数: ' + gameData.leftRound + '\n\n' : '') +
    //         (json ? JSON.stringify(json) + '\n\n' : '') +
    //         ('src: ' + src + '\n\n') +
    //         (content.stack || '') + '\n\n' +
    //         (content.message || '') + '\n\n' +
    //         (typeof content === 'string' ? content : '') + '\n\n' + window.curVersion;
    //     content = content.replace(/\/.*?app\//g, '');
    //     NetUtils.uploadErrorFileToOSS(content);
    // };

    //消息
    function addCustomListener(typ, func) {
        cc.eventManager.removeCustomListeners(typ);
        return cc.eventManager.addCustomListener(typ, func);
    }

    function getMsgQueueNum() {
        // for(var i=0;i<msgQueue.length;i++){
        //     console.log(msgQueue[i].code);
        // }
        return msgQueue.length;
    }

    function removeAllListeners(arr) {
        listenerMap = {};
    }

    function _base64ToArrayBuffer(base64) {
        var binary_string = dcodeIO.ByteBuffer.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function sendPhz(code, dt) {
        var obj = {};
        obj.code = code;
        obj.dt = dt;
        obj.data = {room_id: gameData.roomId};
        if (gameData.uid)
            obj.uid = gameData.uid;

        var msgStr = JSON.stringify(obj);
        var sum = 0;
        for (var i = 0; i < msgStr.length; i++) {
            if (msgStr.charCodeAt(i) < 256)
                sum += msgStr.charCodeAt(i);
        }
        var sign = (sum + 245619426) % 15619472;
        // sign = '';

        var message = new Paho.MQTT.Message(sign + msgStr);
        message.destinationName = "n";
        client.send(message);

        cc.log("send: " + msgStr);
    }

    function debugMsg(code, msg) {
        cc.eventManager.dispatchCustomEvent(code, msg);
    }

    exports.network = {
        getId: getId
        , connect: connect
        , disconnect: disconnect
        , setOnDisconnectListener: setOnDisconnectListener
        , fakeDisconect: fakeDisconect
        , setOnFakeDisconnectListener: setOnFakeDisconnectListener
        , addListener: addListener
        , getListenerByCode: getListenerByCode
        , removeListener: removeListener
        , removeListeners: removeListeners
        , send: send
        , sendPhz: sendPhz
        , recv: recv
        , selfRecv: selfRecv
        , isAlive: isAlive
        , clearMsgs: clearMsgs
        , stop: stop
        , start: start
        , getKeepAliveInterval: getKeepAliveInterval
        , getLastPingInterval: getLastPingInterval
        , getLastPingTimestamp: getLastPingTimestamp
        , getLastPongTimestamp: getLastPongTimestamp
        , regBeforeSendCallback: regBeforeSendCallback
        , resetAndPing: resetAndPing
        , resetSendPinger: resetSendPinger
        , getNextMsgCode: getNextMsgCode
        , onConnectSuccess: onConnectSuccess
        , wsData: wsData
        , addCustomListener: addCustomListener
        , getMsgQueueNum: getMsgQueueNum
        , removeAllListeners: removeAllListeners

        , debugMsg: debugMsg
    }

})(window);
