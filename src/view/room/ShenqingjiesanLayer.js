(function () {
    var exports = this;

    var $ = null;

    var interval = null;

    var ShenqingjiesanLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function () {
            this._super();

            var that = this;

            var scene = loadNodeCCS(res.PhzRoomQuit_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            if($('root'))  $('root').setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);
            if(!window.sensorLandscape){
                if($('root')){
                    $('root').setScale(0.8);
                    $('root').setRotation(-90)
                }
            }

            //同意解散
            TouchUtils.setOnclickListener($('root.btn_confirm'), function (node) {
                if(window.paizhuo == "majiang"
                    || window.paizhuo == "pdk"
                    || window.paizhuo == "scpdk"
                    || window.paizhuo == "zjh"
                    || window.paizhuo == "majiang_kwx"
                    || window.paizhuo == "majiang_sc"
                    || window.paizhuo == "epz") {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                }else if(window.paizhuo=='kaokao' ){
                    network.sendPhz(5000, "Vote/quit/1/0/0");
                }else{
                    network.wsData([
                        'Vote',
                        1
                    ].join('/'));
                }

            });
            //拒绝解散
            TouchUtils.setOnclickListener($('root.btn_cancel'), function (node) {
                if(window.paizhuo == "majiang"
                    || window.paizhuo == "pdk"
                    || window.paizhuo == "scpdk"
                    || window.paizhuo == "zjh"
                    || window.paizhuo == "majiang_kwx"
                    || window.paizhuo == "majiang_sc"
                    || window.paizhuo == "epz") {
                    network.send(3009, {room_id: gameData.roomId, is_accept: 0});
                }else if(window.paizhuo=='kaokao' ){
                    network.sendPhz(5000, "Vote/quit/2/0/0");
                }else {
                    network.wsData([
                        'Vote',
                        2
                    ].join('/'));
                }
            });
            //确定
            TouchUtils.setOnclickListener($('root.btn_ok'), function (node) {
                that.removeFromParent();
            });

            return true;
        },
        setArrMajiang: function (leftSeconds, arr, byUserID, data, hideBtn) {
            var that = this;
            var getAvator = function (uid) {
                for(var s=0;s<gameData.players.length;s++){
                    if(gameData.players[s].uid == uid){
                        return  gameData.players[s];
                    }
                }
            }

            for(var i=0;i<9;i++){
                if((i+1) <= gameData.players.length){
                    $('root.info' + i).setVisible(true);
                    var _player = getAvator(gameData.players[i]['uid']);
                    if(_player) {
                        var avator = $("root.info" + (i) + ".head");
                        var url = decodeURIComponent(_player.headimgurl);
                        if (url == undefined || (url.length == 0)) url = res.defaultHead;
                        loadImageToSprite(url, avator);//头像
                        $("root.info" + (i) + ".name").setString(_player.nickname);
                    }
                }else{
                    $('root.info' + i).setVisible(false);
                }
            }

            var haveISelected = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].uid == gameData.uid) {
                    haveISelected = true;
                    break;
                }
            }
            var refuseName = "";
            if(gameData.playerMap && gameData.playerMap[byUserID]) refuseName = gameData.playerMap[byUserID].nickname;
            var content = "玩家【" + refuseName + "】申请解散房间, " + (haveISelected ? "请等待其他玩家选择 (超时未做选择, 则默认同意)" : "请问是否同意? (超时未做选择, 则默认同意)");
            var selectedUid = {};
            selectedUid[byUserID] = true;
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                $('root.info'+ i +'.statusicon').setTexture(res.roomjiesan_wait_png);
                $('root.info'+ i +'.status').setString("未选择");
                for (var k = 0; k < arr.length; k++) {
                    if(player.uid == arr[k].uid)
                    {
                        $('root.info'+ i +'.statusicon').setTexture(arr[k]['is_accept']==1?res.roomjiesan_ok_png :res.roomjiesan_no_png);
                        $('root.info'+ i +'.status').setString(arr[k]['is_accept']==1? "已同意" : "已拒绝");
                    }
                }
            }

            $('root.t0').setString(content);

            if (haveISelected) {
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
            }else{
                $('root.btn_confirm').setVisible(true);
                $('root.btn_cancel').setVisible(true);
            }
            //扎金花解散   不显示
            if(gameData.mapId == MAP_ID.ZJH && hideBtn){
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
            }
            $('root.result').setVisible(false);
            $('root.btn_ok').setVisible(false);
            var isJiesan = data['is_jiesan'];
            var refuseUid = data['refuse_uid'];
            if(isJiesan){
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
                $('root.btn_ok').setVisible(true);
                $('root.result').setVisible(true);
                $('root.result').setString("投票结果为: 解散房间");
                $('root.txtTime2').setVisible(false);
            }
            if(refuseUid){
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
                $('root.btn_ok').setVisible(true);
                $('root.result').setVisible(true);
                $('root.result').setString('玩家【' + refuseName + '】拒绝，房间解散失败，游戏继续');
                $('root.txtTime2').setVisible(false);
            }
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            var func = function () {
                if (leftSeconds <= 0 || !cc.sys.isObjectValid(that)) {
                    clearInterval(interval);
                    interval = null;
                    return;
                }
                $('root.txtTime2').setString("剩余时间:"+ leftSeconds);
                leftSeconds--;
            };
            func();
            interval = setInterval(func, 1000);
        },
        setArr: function (leftSeconds, arr, byUserID, data) {
            var that = this;
            //设置 显示的数量

            var baseGapX = $('root.info1').getPositionX() - $('root.info0').getPositionX();

            var getAvator = function (uid) {
                for(var s=0;s<gameData.players.length;s++){
                    if(gameData.players[s].uid == uid){
                        return  gameData.players[s];
                    }
                }
            }
            for(var i=0;i<9;i++){
                if((i+1) <= arr.length){
                    $('root.info' + i).setVisible(true);
                    var _player = getAvator(arr[i]['UserID'] || arr[i]['uid']);
                    if(_player) {
                        var avator = $("root.info" + (i) + ".head");
                        var url = decodeURIComponent(_player.headimgurl);
                        if (url == undefined || (url.length == 0)) url = res.defaultHead;
                        loadImageToSprite(url, avator);//头像
                        $("root.info" + (i) + ".name").setString(_player.nickname);
                    }
                }else{
                    $('root.info' + i).setVisible(false);
                }
            }


            var haveISelected = false;
            for (var i = 0; i < arr.length; i++) {
                if ((arr[i].UserID == gameData.uid && (arr[i].VoteValue == 1 || arr[i].VoteValue == 2))) {
                    haveISelected = true;
                    break;
                }
            }
            var refuseName = "";
            if(gameData.playerMap && gameData.playerMap[byUserID]) refuseName = gameData.playerMap[byUserID].nickname;
            var content = "玩家【" + ellipsisStr(refuseName, 6) + "】申请解散房间, " + (haveISelected ? "请等待其他玩家选择 (超时未做选择, 则默认同意)" : "请问是否同意? (超时未做选择, 则默认同意)");
            var acceptCount = 0;
            var rejectCount = 0;
            for (var i = 0; i < arr.length; i++) {
                var player = arr[i];
                if (player.VoteValue == 2 || player['is_accept'] == 0) {
                    //拒绝
                    $('root.info'+ i +'.statusicon').setTexture(res.roomjiesan_no_png);
                    $('root.info'+ i +'.status').setString("已拒绝");
                    rejectCount++;
                }else if(player.VoteValue == 1 || player['is_accept'] == 1){
                    //同意
                    $('root.info'+ i +'.statusicon').setTexture(res.roomjiesan_ok_png);
                    $('root.info'+ i +'.status').setString("已同意");
                    acceptCount++;
                }else{
                    //未选择
                    $('root.info'+ i +'.statusicon').setTexture(res.roomjiesan_wait_png);
                    $('root.info'+ i +'.status').setString("未选择");
                }
            }
            $('root.t0').setString(content);

            $('root.btn_ok').setVisible(false);
            if (haveISelected) {
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
            }else{
                $('root.btn_confirm').setVisible(true);
                $('root.btn_cancel').setVisible(true);
            }
            $('root.result').setVisible(false);
            var isJiesan = null;
            var refuseUid = null;

            if(acceptCount == arr.length){
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
                $('root.btn_ok').setVisible(true);
                $('root.result').setVisible(true);
                $('root.result').setString("投票结果为: 解散房间");
                $('root.txtTime2').setVisible(false);
            }
            if(rejectCount > 0){
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
                $('root.btn_ok').setVisible(true);
                $('root.result').setVisible(true);
                $('root.result').setString("投票结果为: 不解散房间");
                $('root.txtTime2').setVisible(false);
            }

            //如果是观战  只显示确定按钮
            if(gameData.isSelfWatching ||  gameData.isSitNotPlay){
                $('root.btn_confirm').setVisible(false);
                $('root.btn_cancel').setVisible(false);
            }


            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            var func = function () {
                if (leftSeconds <= 0 || !cc.sys.isObjectValid(that)) {
                    clearInterval(interval);
                    interval = null;
                    return;
                }
                $('root.txtTime2').setString("剩余时间:"+ leftSeconds);
                leftSeconds--;
            };
            func();
            interval = setInterval(func, 1000);
        }
    });

    exports.ShenqingjiesanLayer = ShenqingjiesanLayer;
})(window);
