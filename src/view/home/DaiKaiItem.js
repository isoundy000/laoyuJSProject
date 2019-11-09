(function () {
    var exports = this;

    var $ = null;

    var DaiKaiItem = cc.Layer.extend({
        layerHeight: 0,
        ctor: function (data, isNew, isWhite, parent) {
            this._super();
            var that = this;

            if(data['option']) {
                data['option'] = JSON.parse(data['option']);
            }
            if(data['optionstring']) {
                data['option'] = JSON.parse(data['optionstring']);
            }

            var scene = ccs.load(res.DaiKaiItem_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.layerHeight = this.getChildByName("Layer").getBoundingBox().height;

            TouchUtils.setOnclickListener($('button_yq'), function () {
                var title = "";
                var content = "";

                if(data['map_id'] == MAP_ID.DN) {
                    title = gameData.companyName+"拼十-" + data['room_id'];
                    content = gameData.companyName+"拼十" + data['wanfa'];
                }else if(data['map_id'] == MAP_ID.PDK) {
                    title = gameData.companyName+"跑得快-" + data['room_id'];
                    content = gameData.companyName+"跑得快" + data['wanfa'];
                }else if(data['map_id'] == MAP_ID.ZJH){
                    title = gameData.companyName+"拼三张-" + data['room_id'];
                    content = gameData.companyName+"拼三张" + data['wanfa'];
                }else if(data['map_id'] == MAP_ID.ZHUANZHUAN){
                    title = gameData.companyName+"拼三张-" + data['room_id'];
                    content = gameData.companyName+"拼三张" + data['wanfa'];
                }else{
                    title = gameData.companyName+"碰胡子-" + data['room_id'];
                    content = gameData.companyName+"碰胡子-" + data['wanfa'];
                }
                WXUtils.shareUrl(gameData.shareUrl + '?roomid='+mRoom.roomId, title, content, 0, getCurTimestamp() + gameData.uid);
            });

            TouchUtils.setOnclickListener($('button_js'), function () {
                alert2("是否确定解散该房间？", function () {
                    showLoading();
                    network.send(3003, {daikai_room_id: data['room_id'], force:true });
                }, function () {

                });
            });

            $('button_yq').setVisible(!data['is_start']);
            $('button_js').setVisible(!data['is_start']);

            if(data['room_id']) {
                $('lb_roomid').setString(data['room_id']);
            }
            if(data['roomid']) {
                $('lb_roomid').setString(data['roomid']);
            }
            if (isNew) {
                //代开
                // $('lb_jushu').setVisible(false);
                if (data['is_start']) {
                    $('lb_state').setString('已开始');
                    $('button_yq').setVisible(false);
                    $('button_js').setVisible(false);
                } else {
                    $('lb_state').setString('未开始');
                }
                //牛牛的解散  只要有2人  就不能解散
                if((data['map_id'] == MAP_ID.DN || data['map_id'] >= 4000)&& data['nicknames'] && data['nicknames'][1]){
                    $('button_js').setVisible(false);
                }
                if(data['nicknames']) {
                    for (var i = 0; i < 9; i++) {
                        var nickname = data['nicknames'][i];
                        var header = data['heads'][i];
                        if (nickname) {
                            if(header == null || header == undefined || header == ""){
                                $('header' + (i + 1)).setTexture(res.defaultHead)
                            }else{
                                loadImageToSprite(decodeURIComponent(header), $('header' + (i + 1)));
                            }
                            $('lb_nickname' + (i + 1)).setString(ellipsisStr(nickname, 5));
                            $('lb_nickname' + (i + 1)).setVisible(true);
                            $('header' + (i + 1)).setVisible(true);
                        } else {
                            $('lb_nickname' + (i + 1)).setVisible(false);
                            $('header' + (i + 1)).setVisible(false);
                        }
                        $('lb_score' + (i + 1)).setVisible(false);
                    }
                }else{
                    for (var i = 0; i < 9; i++) {
                        $('lb_nickname' + (i + 1)).setVisible(false);
                        $('header' + (i + 1)).setVisible(false);
                        $('lb_score' + (i + 1)).setVisible(false);
                    }
                }
            } else {
                $('lb_end').setString(data['is_end'] ? "已结束":"未结束");
                $('lb_end').setColor(data['is_end'] ? cc.color(255, 0, 0):cc.color(0, 0, 255));
                //已开
                if (data['cardused'] != 0) {
                    $('lb_state').setVisible(true);
                    $('lb_state').setString('已扣卡(' + data['cur_round'] + "/" + data['total_round'] + ")");
                } else {
                    $('lb_state').setVisible(true);
                    $('lb_state').setString('未扣卡(' + data['cur_round'] + "/" + data['total_round'] + ")");
                }
                if(data['nicknames'] && data['nicknames'].length > 0) {
                    for (var i = 0; i < 9; i++) {
                        var nickname = data['nicknames'][i];
                        var header = data['heads'][i];
                        if (nickname) {
                            if(header == null || header == undefined || header == ""){
                                $('header' + (i + 1)).setTexture(res.defaultHead)
                            }else{
                                loadImageToSprite(decodeURIComponent(header), $('header' + (i + 1)));
                            }
                            $('lb_nickname' + (i + 1)).setString(ellipsisStr(nickname, 5));
                            $('lb_nickname' + (i + 1)).setVisible(true);
                            $('header' + (i + 1)).setVisible(true);
                            $('lb_score' + (i + 1)).setVisible(true);
                            $('lb_score' + (i + 1)).setString(data['socres'][i]);
                        } else {
                            $('lb_nickname' + (i + 1)).setVisible(false);
                            $('header' + (i + 1)).setVisible(false);
                            $('lb_score' + (i + 1)).setVisible(false);
                        }
                    }
                }else{
                    for (var i = 0; i < 9; i++) {
                        $('lb_nickname' + (i + 1)).setVisible(false);
                        $('header' + (i + 1)).setVisible(false);
                        $('lb_score' + (i + 1)).setVisible(false);
                    }
                }
                $('button_yq').setVisible(false);
                $('button_js').setVisible(false);
            }

            var wanfastr = gameData.companyName + mapidToName(data.map_id, {});

            $('lb_wanfa').setString(wanfastr + data['wanfa']); //mRoom.getWanfaName(data['option']['wanfa']) + data['option']['wanfadesc']);
            if(data['create_time']){
                $('lb_time').setString(timestamp2time(data['create_time']));
            }
            if(data['createtime']){
                $('lb_time').setString(timestamp2time(data['createtime']));
            }

            $('bgPanel.cellbg').setVisible(isWhite);
            $('bgPanel.cellbg2').setVisible(!isWhite);

            return true;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        }
    });

    exports.DaiKaiItem = DaiKaiItem;
})(window);
