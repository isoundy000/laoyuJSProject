/**
 * Created by hjx on 2018/2/7.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubEnterGame = cc.Layer.extend({
        layerHeight: 0,
        layerWidth: 0,
        roomInfo1: null,
        roomInfo2: null,
        posArr3: [],
        ctor: function (data,calback) {
            this._super();
            var that = this;

            loadNodeCCS(res.ClubEnterGame_json, this);
            $ = create$(this.getChildByName("Layer"));

            for (var i=0; i<4; i++){
                var playerSP =   $('player'+(i+1));
                playerSP.setVisible(false);
                if(data.heads[i]){
                    playerSP.setVisible(true);
                    playerSP.getChildByName('nickname').setString(ellipsisStr(data.nicknames[i],6));
                    loadImageToSprite(data.heads[i], playerSP);
                    playerSP.getChildByName('ip').setString('ID:'+data.uids[i]);
                }
            }

            $('wanfa_content').setString(data.wanfa);

            TouchUtils.setOnclickListener($("btn_close"), function () {
                that.removeFromParent(true);
            });
            TouchUtils.setOnclickListener($("btn_sure_enter"), function () {
                calback();
                that.removeFromParent(true);
            });




            return true;
        },
    });

    exports.ClubEnterGame = ClubEnterGame;

})(window);