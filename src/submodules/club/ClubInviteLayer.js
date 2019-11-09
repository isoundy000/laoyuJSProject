/**
 * Created by hjx on 2018/3/6.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubInviteLayer = cc.Layer.extend({
        ctor: function (data) {
            this._super();


            // var Layer = ccs.load(res.ClubInviteLayer_json, 'res/');
            // this.addChild(Layer.node);
            loadNodeCCS(res.ClubInviteLayer_json, this);
            $ = create$(this.getChildByName("Layer"));

            var that = this;
            TouchUtils.setOnclickListener($('btn_close'), function (node) {
                that.removeFromParent();
            });
            var clubData = data;
            TouchUtils.setOnclickListener($('btn_wx'), function (node) {
                var title = "俱乐部名称：【" + clubData['name'] + "】";
                var description = "俱乐部ID[" + clubData['_id'] + "]，"+"玩家[" + gameData.nickname + "]邀请您加入，速度来啊！【全民斗牌】"
                var clubID = clubData['_id'].toString();
                var strID =""
                for(var i =clubID.length;i<6;i++)
                {
                    strID=strID+"0";
                }
                strID = strID+ clubID;
                var shareurl = getShareUrl(strID);
                WXUtils.shareUrl(shareurl, title, description, 0, getCurTimestamp() + gameData.uid);
            });

            TouchUtils.setOnclickListener($('btn_invite'), function (node) {
                that.getParent().addChild(new ClubInputLayer('invite', clubData));
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root'), function () {
            });
            return true;
        }
    });

    exports.ClubInviteLayer = ClubInviteLayer;
})(window);