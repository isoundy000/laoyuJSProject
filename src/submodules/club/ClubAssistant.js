/**
 * Created by www on 2018/9/11.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubAssistant = cc.Layer.extend({
        layerHeight: 0,
        ctor: function (playerNum) {
            this._super();
            var that = this;
            var scene = ccs.load(res.ClubAssistant_json, 'res/');
            this.addChild(scene.node);
            if (cc.winSize.width > 1280) {
                scene.node.setAnchorPoint(cc.p(0.5, 0.5));
                scene.node.setPosition(cc.p(cc.winSize.width / 2 + 20, cc.winSize.height / 2));
            }
            $ = create$(this.getChildByName("Scene"));

            this.assistant = $('btn_assistant');
            this.assistant_node = $('btn_assistant.node');
            this.assistant_node.setVisible(false);
            this.assistant.setVisible(false);

            TouchUtils.setOnclickListener(this.assistant, function () {
                if (that.assistant_node.isVisible()) {
                    that.assistant_node.setVisible(false);
                } else {
                    that.assistant_node.setVisible(true);
                }
            });
            TouchUtils.setOnclickListener($('bg0', this.assistant_node), function () {
                that.assistant_node.setVisible(false);
            });
            TouchUtils.setOnclickListener($('btn_inviteOnline', this.assistant_node), function () {
                var club_id = mRoom.club_id;
                var clubInfo = getClubData(club_id);
                var clubMemberInviteLayer = new ClubMemberInviteLayer(clubInfo, club_id, playerNum);
                clubMemberInviteLayer.setName('clubMemberInviteLayer');
                if (that && cc.sys.isObjectValid(that))
                    that.addChild(clubMemberInviteLayer);
            });
            TouchUtils.setOnclickListener($('btn_showHall', this.assistant_node), function () {
                var clubTablesLayer = that.getParent().getChildByName('clubTablesLayer');
                if (!clubTablesLayer) {
                    var club_id = mRoom.club_id;
                    clubTablesLayer = new ClubTablesLayer(club_id, true);
                    clubTablesLayer.setName('clubTablesLayer');
                    that.getParent().addChild(clubTablesLayer, 101);
                }
            });


            this.assistant.setVisible(true);
            network.send(2103, {cmd: 'queryClub', refresh: 'inRoom'});
            return true;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        refreshPlayersStates:function () {
            var clubTablesLayer = this.getParent().getChildByName('clubTablesLayer');
            if(clubTablesLayer && cc.sys.isObjectValid(clubTablesLayer)){
                clubTablesLayer.refreshPlayersStates();
            }
        },
    });

    exports.ClubAssistant = ClubAssistant;
})(window);