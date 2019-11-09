(function () {
    var exports = this;

    var $ = null;

    var SafeTipLayer = cc.Layer.extend({
        ctor: function (parent, posArr) {
            var that = this;


            this._super();

            var scene = loadNodeCCS(res.SafeTipLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            if($('root'))  $('root').setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);

            $('root.juli1to2').setVisible(false);
            $('root.juli1to3').setVisible(false);
            $('root.juli2to3').setVisible(false);
            $('root.juli2to4').setVisible(false);
            $('root.juli3to4').setVisible(false);
            $('root.juli4to1').setVisible(false);

            this.setPlayerJuli(posArr);

            TouchUtils.setOnclickListener($('root.btn_cancel'), function() {
                if(parent){
                    if(window.paizhuo == "majiang" || window.paizhuo == "zjh" || window.paizhuo == "pdk"  || window.paizhuo == "scpdk"|| window.paizhuo == "majiang_sc")
                    {
                        var func_ma_1 = function () {
                            if (window.inReview)
                                network.send(3003, {room_id: gameData.roomId});
                            else
                                alert2("是否解散房间？", function () {
                                    network.send(3003, {room_id: gameData.roomId});
                                }, null, false, false, true, true);
                        };
                        // 麻将 退出房间
                        var func_ma_2 =function () {
                            if (gameData.uid != gameData.ownerUid) {
                                alert2("是否退出房间？", function () {
                                    network.send(3003, {room_id: gameData.roomId});
                                }, null, false, true, true);
                            }
                        };

                        // 麻将 申请解散
                        var func_ma_3 = function () {
                            alert2("是否申请解散房间？", function () {
                                network.send(3009, {room_id: gameData.roomId, is_accept: 1});
                            }, null, false, false, true, true);
                        };

                        if (parent.getRoomState() == 1) { //没开始
                            if (gameData.ownerUid == gameData.uid) {
                                func_ma_1();
                            }else {
                                func_ma_2();
                            }
                        } else{
                            func_ma_3();
                        }
                        that.removeFromParent();
                    }else if( window.paizhuo == "kaokao" ){
                        var fun1 = function () {
                            if (window.inReview)
                                network.sendPhz(5000, "Vote/quit/1/0/0");
                            else
                                alert2('确定要申请解散房间吗？', function () {
                                    network.sendPhz(5000, "Vote/quit/1/0/0");
                                }, null, false, true, true);
                        };
                        //房主解散房间
                        var fun2 = function () {
                            if (window.inReview)
                                network.sendPhz(3003, "Discard/" + gameData.roomId);
                            else
                                alert2('解散房间不扣房卡，是否确定解散？', function () {
                                    network.sendPhz(3003, "Discard/" + gameData.roomId);
                                }, null, false, true, true);
                        };

                        //其他玩家退出房间
                        var func3 = function () {
                            alert2('确定要退出房间吗?', function () {
                                network.sendPhz(3003, "Quit/" + gameData.roomId);
                            }, null, false, true, true);
                        };

                        if (mRoom.isStart) {
                            fun1();
                        } else {
                            if (mRoom.ownner == gameData.uid) {
                                fun2();
                            } else {
                                func3();
                            }
                        }
                        that.removeFromParent();
                    }else
                    {
                        if (mRoom.ownner == gameData.uid.toString()) {
                            network.wsData("Discard/" + mRoom.roomId);
                        } else {
                            if (!parent.isStart) {
                                mRoom.quitRoom();
                            } else {
                                network.wsData("Vote/quit/1/0/0");
                            }
                        }
                    }
                }
            });

            TouchUtils.setOnclickListener($('root.btn_ok'), function() {
                that.removeFromParent();
            });
        },
        setPlayerJuli: function(posArr){
            var that = this;
            this.posArr = posArr;
            var players = [];
            if(window.paizhuo == "majiang" || window.paizhuo == "zjh" || window.paizhuo == "pdk" || window.paizhuo == "scpdk" || window.paizhuo == "majiang_sc" || window.paizhuo == "kaokao") {
                players = gameData.players;
            }else {
                players = DD[T.PlayerList];
            }
            var playerJuli = {};
            var playerIP = {};

            getJuli = function(loc1, loc2, ip1, ip2){
                var juli = "距离未知";
                if(loc1 == undefined || loc1 == null || loc1 == "false" || loc1 == false){
                    if(ip1 == ip2 && ip1 != "false"){
                        return juli + ",IP相同"
                    }
                    return juli;
                }
                if(loc2 == undefined || loc2 == null || loc2 == "false" || loc2 == false){
                    if(ip1 == ip2 && ip1 != "false"){
                        return juli + ",IP相同"
                    }
                    return juli;
                }
                var templocation1 = loc1.split(',');
                var otherpeoplelocationlat = templocation1[1];
                var otherpeoplelocationlng = templocation1[0];
                var templocation2 = loc2.split(',');
                var mylocationlat = templocation2[1];
                var mylocationlng = templocation2[0];
                var distance = locationUtil.getFlatternDistance(mylocationlat,mylocationlng,otherpeoplelocationlat,otherpeoplelocationlng);
                if(distance >= 1000) {
                    juli = '距离 ' + Math.round(distance/1000) + '公里';
                }else{
                    juli = '距离 ' + distance + '米';
                }
                return juli;
            };

            for(var i=0;i<4;i++){
                (function(i){
                    //$('root.headbg' + i).setVisible(false);
                    $('root.head' + i).setVisible(false);
                    if(window.paizhuo == "majiang" || window.paizhuo == "pdk" || window.paizhuo == "scpdk" || window.paizhuo == "zjh" || window.paizhuo == "majiang_sc"|| window.paizhuo == "kaokao")
                    {
                        var user = gameData.players[i];
                        if(user){
                            playerJuli["pos" + i] = user['loc'] || "false";
                            if(user.uid == gameData.uid && !user['loc']){
                                playerJuli["pos" + i] = locationUtil.latitude + ',' + locationUtil.longitude;
                            }
                            playerIP["pos" + i] = user['ip'] || "false";
                            $('root.head' + i).setVisible(true);
                            var head = $('root.head' + i + "._head");
                            if(head){
                                var headurl = decodeURIComponent(user.headimgurl);
                                if(headurl && headurl.length > 0) loadImageToSprite(headurl, head);//头像
                            }
                        }
                    } else{
                        var user = mRoom.getUserByUserPos(that.posArr['pos' + i]);
                        if(user){
                            playerJuli["pos" + i] = user['Location'] || "false";
                            playerIP["pos" + i] = user['IP'] || "false";
                            $('root.head' + i).setVisible(true);
                            var head = $('root.head' + i + "._head");
                            if(head){
                                var headurl = decodeURIComponent(user.HeadIMGURL);
                                if(headurl && headurl.length > 0)  loadImageToSprite(headurl, head);//头像
                            }
                        }
                    }

                })(i);
            }
            // playerJuli = {0:'120,80', 1:'121,81'};
            // console.log(playerJuli);
            if(playerJuli["pos1"]){
                $('root.juli1to2').setVisible(true);
                $('root.juli1to2').setString(getJuli(playerJuli["pos0"], playerJuli["pos1"], playerIP["pos0"], playerIP["pos1"]));
            }
            if(playerJuli["pos2"]){
                $('root.juli1to3').setVisible(true);
                $('root.juli1to3').setString(getJuli(playerJuli["pos0"], playerJuli["pos2"], playerIP["pos0"], playerIP["pos2"]));
            }
            if(playerJuli["pos3"]){
                $('root.juli4to1').setVisible(true);
                $('root.juli4to1').setString(getJuli(playerJuli["pos0"], playerJuli["pos3"], playerIP["pos0"], playerIP["pos3"]));
            }
            if(playerJuli["pos1"] && playerJuli["pos2"]){
                $('root.juli2to3').setVisible(true);
                $('root.juli2to3').setString(getJuli(playerJuli["pos1"], playerJuli["pos2"], playerIP["pos1"], playerIP["pos2"]));
            }
            if(playerJuli["pos1"] && playerJuli["pos3"]){
                $('root.juli2to4').setVisible(true);
                $('root.juli2to4').setString(getJuli(playerJuli["pos1"], playerJuli["pos3"], playerIP["pos1"], playerIP["pos3"]));
            }
            if(playerJuli["pos2"] && playerJuli["pos3"]){
                $('root.juli3to4').setVisible(true);
                $('root.juli3to4').setString(getJuli(playerJuli["pos2"], playerJuli["pos3"], playerIP["pos2"], playerIP["pos3"]));
            }
        }
    });

exports.SafeTipLayer = SafeTipLayer;
})(window);
