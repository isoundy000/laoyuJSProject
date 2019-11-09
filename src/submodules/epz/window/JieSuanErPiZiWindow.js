/**
 * Created by duwei on 2018/7/26.
 */
var JieSuanErPiZiWindow = cc.Layer.extend({
    ctor: function (data, room) {
        this._super();
        this.room = room;
        this.data = data;
        var rootNode = loadFile(this, epz_res.JieSuanErPiZiWindow_json);
        addModalLayer(rootNode);
        this.initWindow(this.data);
        this.addBtnTouch();
        this.scheduleClose(5);
        return true;
    },
    scheduleClose: function (time) {
        var self = this;
        var btn_start = self['_root']['btn_start'];
        var num = self['_root']['btn_start']['num'];
        if(this.room.isReplay){
            num.setVisible(false);
            return;
        }
        if (time > 0) {
            num.setString(time);
            btn_start.stopAllActions();
            btn_start.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function () {
                    self.scheduleClose(time - 1);
                })
            ))
        } else {
            num.setString('0');
            if(btn_start.onclickCallBack){
                btn_start.onclickCallBack();
            }
        }
    },
    //触摸事件
    addBtnTouch: function () {
        var self = this;
        TouchUtils.setOnclickListener(self['_root']['btn_fenxiang'], function () {
            var curscene = cc.director.getRunningScene();
            curscene.addChild(new ShareTypeLayer(self), 100);
        });
        TouchUtils.setOnclickListener(self['_root']['btn_chakan'], function () {
            network.start();
            self.removeFromParent(true);
        });
        TouchUtils.setOnclickListener(self['_root']['btn_start'], function () {
            network.start();
            network.send(3004, {room_id: gameData.roomId});
            self.removeFromParent(true);
        });
    },
    /**
     * 初始化
     */
    initWindow: function (data) {
        var self = this;
        self['_root']['lb_roomid'].setString('房号：' + gameData.roomId + '   局数：' + data['cur_round'] + '/' + data['total_round']);
        self['_root']['lb_ts'].setString(timestamp2time(data['ts']));
        if(data.is_last || data.is_jiesan){
            self['_root']['btn_chakan'].setVisible(true);
            self['_root']['btn_start'].setVisible(false);
        }else{
            self['_root']['btn_chakan'].setVisible(false);
            self['_root']['btn_start'].setVisible(true);
        }
        for(var i = 0;i<data['players'].length;i++){
            var player = data['players'][i];
            var uid = player['uid'];
            var is_visible = player['is_visible'];
            var is_loser= player['is_loser'];
            var playerInfo = gameData.getPlayerInfoByUid(uid);
            var RowUnit = self['_root']["row" + i]['root'];
            loadImageToSprite(playerInfo["headimgurl"], RowUnit['head'], true);
            RowUnit['lb_name'].setString(ellipsisStr(playerInfo.nickname, 5));
            RowUnit['fangzhu'].setVisible(false);
            RowUnit['zhuang'].setVisible(data['zhuang']==uid);
            RowUnit['shu_score'].setString(player['score']);
            RowUnit['ying_score'].setString(player['score']>0?"+"+player['score']:player['score']);
            RowUnit['shu_score'].setVisible(player['score']<0);
            RowUnit['ying_score'].setVisible(player['score']>=0);
            for(var k=0;k<player['pai_arr'].length;k++){
                if(!is_visible && k == 0){
                    RowUnit['a'+k]['pai']['bei'].setVisible(true);
                }else{
                    RowUnit['a'+k]['pai'].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('poker_epz/pai_'+player['pai_arr'][k]+'.png'));
                    RowUnit['a'+k]['pai']['bei'].setVisible(false);
                }
            }
            for(;k<2;k++){
                RowUnit['a'+k].setVisible(false);
            }
            RowUnit['liuzuolixi'].setVisible(is_loser);
            RowUnit['CardTypeUnit'].setVisible(player['pai_type']>0 && is_visible);
            RowUnit['CardTypeUnit']['sanNode'].setVisible(player['pai_type']==1);
            RowUnit['CardTypeUnit']['duiNode'].setVisible(player['pai_type']==2);
            if(player['pai_type']==1){//散牌
                RowUnit['CardTypeUnit']['sanNode']['num'].setString(player['pai_point']+'点');
            }else if(player['pai_type']==2) {//对子
                var childlist = RowUnit['CardTypeUnit']['duiNode'].getChildren();
                _.forIn(childlist, function (child) {
                    child.setVisible(false);
                });
                var pai0=player['pai_arr'][0];
                var pai1=player['pai_arr'][1];
                var index = Math.floor(pai0 / 13);
                if(index<4) {
                    var value = pai0 % 13+1;
                    RowUnit['CardTypeUnit']['duiNode']['dui_'+value].setVisible(true);
                }else if(pai0 == pai1){
                    if(pai0 == 52){
                        RowUnit['CardTypeUnit']['duiNode']['dui_14'].setVisible(true);
                    }else{
                        RowUnit['CardTypeUnit']['duiNode']['dui_15'].setVisible(true);
                    }
                }else{
                    RowUnit['CardTypeUnit']['duiNode']['dui_16'].setVisible(true);
                }
            }
        }
        for(;i<8;i++){
            var RowUnit = self['_root']["row" + i];
            RowUnit.setVisible(false);
        }
    }
});