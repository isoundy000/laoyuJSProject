/**
 * Created by duwei on 2018/7/26.
 */
var ZongJieSuanErPiZiWindow = cc.Layer.extend({
    ctor: function (data, room) {
        this._super();
        this.room = room;
        this.data = data;
        var rootNode = loadFile(this, epz_res.ZongJieSuanErPiZiWindow_json);
        addModalLayer(rootNode);
        rootNode.setPositionX(cc.winSize.width/2);
        this.initWindow(this.data);
        this.addBtnTouch();
        return true;
    },
    //触摸事件
    addBtnTouch: function () {
        var self = this;
        TouchUtils.setOnclickListener(self['_root']['btn_fenxiang'], function () {
            var curscene = cc.director.getRunningScene();
            curscene.addChild(new ShareTypeLayer(self), 100);
        });
        TouchUtils.setOnclickListener(self['_root']['btn_return'], function () {
            HUD.showScene(HUD_LIST.Home, null);
        });
    },
    /**
     * 初始化
     */
    initWindow: function (data) {
        var self = this;
        //"players":[{"uid":245,"win":5,"lose":3,"score":520},{"uid":246,"win":2,"lose":6,"score":280}]}}
        self['_root']['lb_roomid'].setString('房号：' + gameData.roomId + '   局数：' + data['cur_round'] + '/' + data['total_round']);
        self['_root']['lb_ts'].setString(timestamp2time(data['ts']));
        var maxScore = 0;
        var minScore = 0;
        for(var i = 0;i<data['players'].length;i++) {
            var player = data['players'][i];
            if(player['calc_bobo_num']>maxScore){
                maxScore = player['calc_bobo_num'];
            }
            if(player['calc_bobo_num']<minScore){
                minScore = player['calc_bobo_num'];
            }
        }
        for(var i = 0;i<data['players'].length;i++) {
            var player = data['players'][i];
            var uid = player['uid'];
            var playerInfo = gameData.getPlayerInfoByUid(uid);
            var RowUnit = self['_root']["row" + i]['root'];
            loadImageToSprite(playerInfo["headimgurl"], RowUnit['head'], true);
            RowUnit['lb_name'].setString(ellipsisStr(playerInfo.nickname, 5));
            RowUnit['fangzhu'].setVisible(false);
            RowUnit['zhuang'].setVisible(data['zhuang'] == uid);
            RowUnit['shu_score'].setString(player['calc_bobo_num']);
            RowUnit['ying_score'].setString(player['calc_bobo_num'] > 0 ? "+" + player['calc_bobo_num'] : player['calc_bobo_num']);
            RowUnit['shu_score'].setVisible(player['calc_bobo_num'] < 0);
            RowUnit['ying_score'].setVisible(player['calc_bobo_num'] >= 0);
            RowUnit['dayingjia'].setVisible(player['calc_bobo_num']>0 && player['calc_bobo_num'] == maxScore);
            RowUnit['tuhao'].setVisible(player['calc_bobo_num']<0 && player['calc_bobo_num'] == minScore);
        }
        for(;i<8;i++){
            var RowUnit = self['_root']["row" + i];
            RowUnit.setVisible(false);
        }
    }
});