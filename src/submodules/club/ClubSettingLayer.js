/**
 * Created by hjx on 2018/2/8.
 */

(function () {
    var exports = this;

    var $ = null;

    var ClubSettingLayer = cc.Layer.extend({
        ctor: function (clubid) {
            this._super();

            var that = this;

            loadNodeCCS(res.ClubSettingLayer_json, this);
            $ = create$(this.getChildByName("Layer"));

            TouchUtils.setOnclickListener($('root'), function () {
                console.log("remove setting layer");
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('btn_gonggao'), function () {
                that.addChild(new ClubNoticeLayer(getClubData(clubid), null, clubid));
            });
            TouchUtils.setOnclickListener($('btn_member'), function () {
                that.addChild(new ClubMemberLayer(getClubData(clubid)));
            });
            TouchUtils.setOnclickListener($('btn_updateName'), function () {
                var data = getClubData(clubid);
                if (gameData.uid == data['owner_uid'] || (data['admins'] && data['admins'].indexOf(gameData.uid) >= 0)) {
                    that.addChild(new ClubInputLayer('changeName', data));
                } else {
                    alert11('只有群主与管理员才可以修改亲友圈名称', 'noAnimation');
                }
            });
            TouchUtils.setOnclickListener($('btn_dataManager'), function () {
            });
            TouchUtils.setOnclickListener($('btn_jiesan'), function () {
                alert22('确定解散该亲友圈？', function () {
                    network.send(2103, {cmd: 'deleteClub', club_id: clubid});
                    that.removeFromParent();
                }, function () {
                }, 'noAnimation');
            });
            TouchUtils.setOnclickListener($('word_tcjlb'), function () {
                alert22('确定退出该亲友圈？', function () {
                    network.send(2103, {cmd: 'leaveClub', club_id: clubid, uid: gameData.uid,name:gameData.nickname ,head:gameData.headimgurl});
                    that.removeFromParent();
                }, function () {
                }, 'noAnimation');
            });
            TouchUtils.setOnclickListener($('word_zywf'), function () {
                that.addChild(new ClubNoticeLayer(getClubData(clubid), NoticeType.freeSet,clubid));
            });
            TouchUtils.setOnclickListener($('word_merge'), function () {
                if (gameData.uid != data['owner_uid']){
                    alert11("您不是群主 无法操作!");
                    return;
                }
                that.addChild(new ClubMergeClub(clubid));
            });
            TouchUtils.setOnclickListener($('word_hequn'), function () {
                alert1("敬请期待")
            });

            TouchUtils.setOnclickListener($('word_yysj'), function () {

                var data = getClubData(clubid);
                if (gameData.uid == data['owner_uid'] || true) {
                    that.addChild(new ClubShowTimeLayer(getClubData(clubid)));
                } else {
                    //alert1('只有群主才可以设置开放时间');
                    var ctlayer = that.getParent();
                    var yyopen = data['openingtime'] || 'closed';
                    var stime = data['start'] || '0:0';
                    var etime = data['end'] || '0:0';
                    var isopen = getIsOpenState(stime, etime);
                    if (yyopen == 'open' && !isopen) {//打烊状态
                        that.addChild(new ClubDayangLayer(stime, etime, 1));
                    } else {//开放状态
                        that.addChild(new ClubDayangLayer(stime, etime, 2));
                    }
                }


            });
            var data = getClubData(clubid);
            $('word_tcjlb').setVisible(data['owner_uid'] != gameData.uid)
            $('btn_jiesan').setVisible(data['owner_uid'] == gameData.uid)

            return true;
        }
    });

    exports.ClubSettingLayer = ClubSettingLayer;
})(window);