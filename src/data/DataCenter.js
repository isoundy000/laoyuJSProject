var DD = {};
// var serverAddress = "phz.xcve1xafe.com";
var serverAddress = "phz.yygameapi.com";



// //网络层  牛牛专用
// var network = {};
// network.stop = function(){
//     return DC.stop();
// };
// network.start = function(){
//     return DC.start();
// };
// network.send = function(str){
//     var funccall = function(str){
//         network.wsData(str);
//     }
//     return funccall(str);
// };
// network.addListener = function(msgtype, func){
//     cc.eventManager.removeCustomListeners(msgtype);
//     var funccall = function(userData){
//         var data = userData.getUserData();
//         func(data);
//     }
//     return cc.eventManager.addCustomListener(msgtype, funccall);
// };
// network.removeListeners = function(msgArr){
//     for(var k in msgArr){
//         cc.eventManager.removeCustomListeners(msgArr[k]);
//     }
// };
// network.disconnect = function(){
//     DC.requestLastRoom = false;
//     DC.closeByClient = true;
//     //DC.socket.close();
//     if(cc.sys.isObjectValid(DC.socket)){
//         DC.socket.close();
//     };
//     DC.socket = null;
// };
// network.reconnect = function(){
//     DC.reconnect();
// };


var DC = {
    serverIp: serverAddress + ":30003",
    httpServerIp : serverAddress + ":30003",
    httpServerIp2 : serverAddress + ":30003",
    httpServerIp3: serverAddress + ":30003",
    httpServerIp4: "gg-paohuzi.oss-cn-hangzhou.aliyuncs.com/youxian-rec",
    httpServerIp5: serverAddress + ":30003",

    MAX_PING_PONG_INTERVAL: 8,

    data: {},
    socket: null,
    wsStatus: 0,
    DC_Seq:-1,

    curPingInterval: 0,
    curPingNum: 0,
    closeByClient: false,//客户端主动断开
    requestLastRoom: true,
    retryCnt: 0,
    activeClose: false,
    isConnected: false,

    //消息队列
    timer: null,
    msgQueue: [],
    isStop: false,


    updateInterval: null,
    updateLastTimestamp: 0,
    update: function (interval) {
        if (DC.wsStatus == 1) {
            DC.curPingInterval += interval / 1000.0;
            // if (DC.curPingInterval > DC.MAX_PING_PONG_INTERVAL) {
            //     // DC.socket.close();
            //     console.log("心跳超时" + DC.curPingInterval);
            //     // cc.eventManager.dispatchCustomEvent(P.GS_NetWorkClose, "连接断开");
            // }
            if(DC.curPingNum > 5){
                console.log("连接断开=" + DC.curPingInterval);
                if (DC.updateInterval) {
                    clearInterval(DC.updateInterval);
                    DC.updateInterval = null;
                }
                if (DC.timer){
                    clearInterval(DC.timer);
                    DC.timer = null;
                }
                cc.eventManager.dispatchCustomEvent(P.GS_NetWorkClose, "连接断开");
            }
        }
    },

    init: function () {
        DC.serverIp = serverAddress + ":30003";
        DC.httpServerIp = serverAddress + ":30003";
        DC.httpServerIp2 = serverAddress + ":30003";
        DC.httpServerIp3 = serverAddress + ":30003";
        DC.httpServerIp4 = "gg-paohuzi.oss-cn-hangzhou.aliyuncs.com/youxian-rec";
        DC.httpServerIp5 = serverAddress + ":30003";

        //httpHost : "http://xuegaogame.tpddns.cn:11114/achieve-sd-master",
        if (!serverAddress.startsWith("http://") && !serverAddress.startsWith("https://")) {
            DC.httpHost = "http://"+DC.httpServerIp;
            DC.httpHost2 = "http://"+DC.httpServerIp2;
            DC.httpHost3 = "http://"+DC.httpServerIp3;
            DC.httpHost4 = "http://"+DC.httpServerIp4;
            DC.httpHost5 = "http://"+DC.httpServerIp5;
        }
        // DC.httpHostTest = "http://"+DC.httpServerTest;
        DC.wsHost = "ws://"+DC.serverIp+"/achieve-sd-slave/g2/websocket?serverId=1";
    },
    http: function (url, callback, failfunc, noLoading) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url, true);
        if (cc.sys.isNative == true)
            xhr.setRequestHeader("Content-Type", "application/json");
        // cc.log("http post --------- " + url);
        xhr.timeout = 4000;
        xhr.ontimeout = failfunc;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status <= 207) {
                    //var result = JSON.parse(xhr.responseText);
                    callback(xhr.responseText);
                } else {
                    cc.log("http error state :" + xhr.status);
                }

                if (noLoading != true) {
                    // HUD.removeLoading();
                }
            }
        };
        xhr.send('');
        if (noLoading != true) {
            // HUD.showLoading();
        }
    },
    httpPost: function (api, request, callback, noLoading, httpHost, failCallBack) {
        var url = DC.httpHost + api;
        if (httpHost){
            url = httpHost + api;
        }
        // console.log(url);
        // url = "http://o4sdsrbplwxb0im6.alicloudsec.com:8083" + api;
        var strRequest = JSON.stringify(request);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url, true);

        //超时
        // xhr.timeout = 5000;
        // var callBack = false;
        // setTimeout(function () {
        //     if(!callBack){
        //         failCallBack();
        //     }
        // }, 5000);
        //超时
        xhr.timeout = 4000;
        xhr.ontimeout = failCallBack;
        if (cc.sys.isNative == true)
            xhr.setRequestHeader("Content-Type", "application/json");
        // console.log("http post --------- " + url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status <= 207) {
                    //var result = JSON.parse(xhr.responseText);
                    callback(xhr.responseText);
                } else {
                    // cc.log("http error state---- :" + xhr.status);
                    if(failCallBack) {
                        failCallBack();
                    }
                }

                if (noLoading != true) {
                    // HUD.removeLoading();
                }
            }
        };
        xhr.send(strRequest);
        if (noLoading != true) {
            // HUD.showLoading();
        }
    },

    httpData: function (api, request, callback, noLoading, httpHost, failCallBack, noSign) {
        //http://42.62.40.112:8080/achieve-sd-master/api/open/servers?version=1.0.0&channel=android
        if(!noLoading) {
            HUD.showLoading();
        }
        var url = api;
        if (request != null) {
            for (var key in request) {
                if (url.indexOf("?") >= 0){
                    url = url + "&" + key + "="+ request[key];
                }else{
                    url = url + "?" + key + "="+ request[key];
                }
            }
        }
        var sig = "";

        if(noSign){
        }else{
            sig = "&sign=" + CryptoJS.MD5("request:" + url).toString();
        }
        if (httpHost){
            url = httpHost + url + sig;
        }else{
            url = DC.httpHost + url + sig;
        }

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url, true);
        // xhr.setTimeout(5);
        cc.log("http get --------- " + url);
        xhr.timeout = 4000;
        xhr.ontimeout = failCallBack;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(!noLoading) {
                    HUD.removeLoading();
                }
                if (xhr.status >= 200 && xhr.status <= 207) {
                    //var httpStatus = xhr.statusText;
                    //var response = xhr.responseText.substring(0, 100) + "...";
                    //console.log("get response data ++++ ", xhr.responseText);
                    var result = JSON.parse(xhr.responseText);
                    if(result.result == -3) {
                        HUD.showMessageBox('提示', result.msg, function () {
                            HUD.showScene(HUD_LIST.Login);
                        }, true);
                    }else{
                        callback(result);
                    }
                } else {
                    if(failCallBack) {
                        failCallBack();
                    }
                    cc.log("http error state :" + xhr.status);
                }
            }
        };
        xhr.send();
    },

    //
    clearMsgs:function () {
        DC.msgQueue = [];
        DC.isStop = false;
    },
    stop:function(e) {
        DC.isStop = true;
    },
    start:function() {
        DC.isStop = false;
    },
    updateMsgQueue:function(){
        while (DC.msgQueue.length > 0) {
            var obj = DC.msgQueue[0];
            if (DC.isStop)
                return;
            if (obj && obj.proxyID && obj.msg) {

                DC.msgQueue.shift();
                cc.eventManager.dispatchCustomEvent(obj.proxyID, obj.msg);
            }
            break;
        }
    },


    checkReconnect:function(){
        if ((DC.wsStatus != 1) &&  (DC.wsStatus != 2)) {
            this.wsConnect(true);
        }
    },

    wsPing:function(){
        var ByteBuffer = dcodeIO.ByteBuffer;
        var msg = new ByteBuffer();
        msg.writeByte(0);
        msg.flip();
        var data = msg.toBuffer();

        if(cc.sys.isObjectValid(DC.socket) == false){
            DC.wsConnect(true);
            return;
        }

        if(DC.socket != null) {
            // console.log(DC.socket.readyState+"====readyState");
            // DC.socket.send(data);
            try {
                var send = DC.socket.send(data);
                DC.curPingNum += 1;
            } catch (e) {
            }
        }
    },

    wsData: function (cmd, isSpecial, lsLogin) {
        if (DC.wsStatus != 1) {
            // HUD.showMessage("网络连接中断,请重新尝试");
            // this.wsConnect(true);
            return false;
        }
        else {
            //cmd = "Hello world!";
            var ByteBuffer = dcodeIO.ByteBuffer;

            var msg = new ByteBuffer();

            if (lsLogin == true) {
                var content = new ByteBuffer();
                content.writeString(cmd);
                var realLen = content.offset;
                content.copyTo(msg, 1, 0, realLen);
                msg.skip(realLen);
                msg.flip();
                msg.limit = realLen + 1;
            } else {
                msg.writeString(cmd);
                msg.flip();
            }


            var data = msg.toBuffer();
            // console.log("发消息时间" + Date.now());
            if (!cc.sys.isNative)  console.log("发消息" + cmd);
            DC.socket.send(data);
            return true;
        }
    },
    getWsUrl: function () {
        gameData.host = DC.wsHost.substring(5, DC.wsHost.indexOf('/', 5));
        gameData.wsData = DC.wsHost.substring(DC.wsHost.indexOf('/', 5));
        // gameData.host = '127.0.0.1111';
    },
    disconnect: function() {
        DC.activeClose = true;
        DC.closeByClient = true;
        if(cc.sys.isObjectValid(DC.socket)){
            //DC.socket.close();
        }
        DC.socket = null;
    },
    wsConnect: function (parentlayer) {
        return;
        // HUD.showLoading();
        DC.disconnect();
        setTimeout(function () {
            if (!DC.isConnected) {
                DC.disconnect();

                DC.retryCnt++;
                DC.wsConnect();
            }
        }, 3000);

        this.getWsUrl();
        var _getHost = function (url) {
            if (url.startsWith("http://")) {
                return url.substring(7);
            } else if (url.startsWith("https://")) {
                return url.substring(8);
            } else {
                return url;
            }
        };
        var _connect = function () {
            if ((!gameData.useHttpReturedLast && DC.retryCnt == 0)
                || (gameData.useHttpReturedLast && DC.retryCnt == gameData.ipList.length)) {
                gameData.url = "ws://" + gameData.host + gameData.wsData;
            } else {
                gameData.url = "ws://" + _getHost(gameData.ipList[0]) + ':30004' + gameData.wsData;
            }
        };
        _connect();
        cc.log("web socket connect to ---" + gameData.url);

        DC.socket = new WebSocket(gameData.url + "&token=" + gameData.myToken);
        DC.socket.binaryType = "arraybuffer";
        DC.wsStatus = 2;

        DC.socket.onopen = function (event) {
            if (!DC.updateInterval) {
                DC.updateLastTimestamp = getCurTimestamp();
                DC.updateInterval = setInterval(function () {
                    DC.update(200);
                }, 200);
            }
            DC.isConnected = true;
            if(!DC.timer){
                DC.timer = setInterval(DC.updateMsgQueue, 1);
            }

            if (HUD.tipLayer)
                HUD.tipLayer.removeAllChildren();
            cc.log("message connected !");
            DC.wsStatus = 1;
            DC.lastPong = Date.now();
            DC.closeByClient = false;

            DC.curPingInterval = 0;
            DC.curPingNum = 0;

            mAccount.onWebSocketConnected();
        };

        DC.socket.onmessage = function (data) {
            // console.log("on message: " + data);
            var arrayBuffer = data.data;
            // HUD.removeLoading();
            var ByteBuffer = dcodeIO.ByteBuffer;
            var readMsg = ByteBuffer.wrap(arrayBuffer);
            DC.lastPong = Date.now();
            if(readMsg.limit == 1){ //心跳包
                DC.curPingInterval = 0;
                DC.curPingNum = 0;
                var value = readMsg.readByte();
                return;
            }
            var proxyID = ByteHandler.getInt(readMsg, 0);
            var check = ByteHandler.getInt(readMsg, 4);

            var ox = 8;
            var msg = null;

            //牛牛的消息从 500 开始的
            var NiuNiuChangeProxyID = [P.GS_Login, P.GS_GameStart, P.GS_RoomResult, P.GS_Vote];
            var proxyIDTmp = proxyID;
            console.log('xxx' + mRoom.wanfatype)
            if(mRoom.wanfatype == "dn" && NiuNiuChangeProxyID.indexOf(proxyID) >= 0) {
                proxyIDTmp = 500 + proxyIDTmp;
            }

            var messageType = ProtoTypes[proxyIDTmp.toString()];
            var lenBuf = readMsg.limit - 8;
            console.log(proxyIDTmp+'----'+messageType);
            if (lenBuf > 0) {
                var protoData = new ByteBuffer(lenBuf);
                readMsg.copyTo(protoData, 0, ox, ox + lenBuf);
                var Message = null;
                console.log(mRoom.wanfatype+"==="+messageType);
                Message = mProto.builder['old'].build("paohuzi." + messageType);
                if (protoData != null && Message != null)
                    msg = Message.decode(protoData);
                else
                    console.log("got null message");
            }

            //牛牛的消息从 500 开始的
            if(mRoom.wanfatype == "dn" && NiuNiuChangeProxyID.indexOf(proxyID) >= 0) {
                proxyIDTmp = proxyIDTmp - 500;
            }
            DD[proxyIDTmp] = msg;
            DC.processResult(proxyIDTmp, msg);
            if (msg) {
                // console.log("收消息时间" + Date.now());
                // console.log(proxyID+"=消息="+JSON.stringify(msg));
                if (!cc.sys.isNative) console.log(proxyIDTmp+"=消息="+JSON.stringify(msg));
            }
            if(proxyIDTmp && msg)
                DC.msgQueue.push({proxyID:proxyIDTmp, msg:msg});
            // cc.eventManager.dispatchCustomEvent(proxyID, msg);
        };

        DC.socket.onclose = function (data) {
            cc.log("message close by server: " + data);
            if (DC.updateInterval) {
                clearInterval(DC.updateInterval);
                DC.updateInterval = null;
            }
            if (DC.timer){
                clearInterval(DC.timer);
                DC.timer = null;
            }
            // HUD.removeLoading();

            DC.wsStatus = 0;

            DC.activeClose = false;
            if (DC.closeByClient != true) {
                cc.eventManager.dispatchCustomEvent(P.GS_NetWorkClose, "连接断开");
            }
            //HUD.showMessage("connecting closed!");
        };

        DC.socket.onerror = function (data) {
            cc.log("message erroe by server: " + data);
            // HUD.removeLoading();
            DC.wsStatus = 0;
            if (DC.retryCnt < gameData.ipList.length) {
                // if ((!gameData.useHttpReturedLast && DC.retryCnt > 0)
                //     || (gameData.useHttpReturedLast && DC.retryCnt < gameData.ipList.length - 1)) {
                if (DC.retryCnt < gameData.ipList.length - 1) {
                    var temp = gameData.ipList[0];
                    gameData.ipList.splice(0, 1);
                    gameData.ipList.push(temp);
                }
                if (DC.retryCnt == 0 && !gameData.useHttpReturedLast) {
                    gameData.useHttpReturedLast = true;
                }
                DC.retryCnt++;
                setTimeout(function () {
                    // _connect();
                    DC.wsConnect();
                }, 200);
            } else {
                // HUD.removeLoading();
                //DC.isConnected = true;
                // HUD.showConfirmBox('提示', '连接失败，是否重试？', function () {
                //     DC.retryCnt = 0;
                //     DC.isConnected = false;
                //     gameData.useHttpReturedLast = false;
                //     DC.wsConnect();
                // }, '确定', function(){
                    DC.retryCnt = 0;
                    DC.isConnected = false;
                    gameData.useHttpReturedLast = false;
                // }, '取消')
            }

            // if (gameData._add_ul > 5) {
            //     gameData._add_ul = 0;
            //     HUD.removeLoading();
            //     HUD.showConfirmBox('提示', '连接失败，是否重试？', function () {
            //         DC.retryCnt = 0;
            //         DC.isConnected = false;
            //         gameData.useHttpReturedLast = false;
            //         DC.wsConnect();
            //     }, '确定', function(){
            //         DC.retryCnt = 0;
            //         DC.isConnected = false;
            //         gameData.useHttpReturedLast = false;
            //     }, '取消')
            // } else {
            //     gameData._add_ul += 1;
            //     gameData.ipList = null;
            //     // IIL();
            //     DC.retryCnt = 0;
            //     setTimeout(function () {
            //         DC.wsConnect();
            //     }, 100);
            // }
        }
    },

    processResult: function (proxyID, msg) {
        switch (proxyID) {
            case P.GS_Login:
                break;

            case P.GS_UserJoin:
                if(msg){
                    //定位
                    for(var i=0;i<msg.Users.length;i++) {
                        if(msg.Users[i].GPS) {
                            try {
                                var GPS = JSON.parse(msg.Users[i].GPS);
                                msg.Users[i].locCN = GPS.locationInfo;
                                msg.Users[i].loc = GPS.location;

                                // msg.Users[i].loc = "0.1,0.1";
                            } catch (e) {
                                msg.Users[i].locCN = '未开启地理位置共享';
                                msg.Users[i].loc = 'false';
                            }
                        }else{
                            msg.Users[i].locCN = "未开启地理位置共享";
                            msg.Users[i].loc = "false";
                        }
                    }
                    DD[T.PlayerList] = msg.Users;
                }
                //addListToList(T.PlayerList, msg.Users);
                break;

            case P.GS_CardDeal:
                setObjectList(T.CardList, msg, "Cards");
                break;

            case P.GS_CardLast:
                break;

            case P.GS_GameTurn:
                break;

            case P.GS_GameStart:
                break;

            case P.GS_GameOver:
                break;


            case P.TypeAllNpc:
                setObjectList(T.NpcList, msg, "npcList");
                break;


        }
    }
};

