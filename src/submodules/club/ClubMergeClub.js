(function (exports) {
    var $ = null;
    var ClubMergeClub = cc.Layer.extend({
        canMergeClubId:0,
        onEnter: function () {
            var that = this;
            cc.Layer.prototype.onEnter.call(this);

            this.list1 = cc.eventManager.addCustomListener('flushClubWithoutCache', function (event) {
                var data = event.getUserData();
                $('result_node').setVisible(data.result == 0);
                $('tip_no').setVisible(data.result != 0);
                if (data.result == 0){
                    that.canMergeClubId =  data.club_id || 0;
                    var info = data.info;
                    $('result_node.create_name').setString(ellipsisStr(info.nick, 5));
                    $('result_node.club_name').setString(ellipsisStr(info.name, 5));
                    $('result_node.club_id').setString(info._id);
                    loadImageToSprite(info.head,$('result_node.head'))
                }else{
                    that.canMergeClubId =  0;
                }
            });

            this.list1 = cc.eventManager.addCustomListener('applyComboClub', function (event) {
                var data = event.getUserData();
                if (data.result == 0){
                    alert11("合并消息已发送，请联系要合入的亲友圈创建者，同意后方可完成合群!")
                    that.removeFromParent(true);
                }
            });
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
        },

        ctor: function (clubid) {
            this._super();

            var that = this;

            that.clubId = clubid;

            loadNodeCCS(res.ClubMergeClub_json, this);
            $ = create$(this.getChildByName("Layer"))

            this._$ = $;

            $('result_node').setVisible(false);
            $('tip_no').setVisible(false);

            var v_input = $('input');
            v_input.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            v_input.setPlaceHolderColor(cc.color(255, 255, 255, 255));
            v_input.addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME: //点开输入框
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME://输入完毕
                        that.setPositionY(0);
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT://插入字符
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD://点击enter
                        break;
                    default:
                        break;
                }
            });

            TouchUtils.setOntouchListener($('btn_close'), function (sender) {
                that.removeFromParent(true);
            });

            TouchUtils.setOntouchListener($('btn_find'), function (sender) {
                var v_input_str = v_input.getString();
                var m_AllNum = /^[0-9]\d*$/.test(v_input_str);
                if (!m_AllNum || v_input_str.length == 0) {
                    alert11("输入亲友圈ID有误!");
                    return;
                }
                if (that.clubId+"" == v_input_str){
                    alert11("不能合入当前亲友圈!");
                    return;
                }
                network.send(2103, {cmd: "flushClubWithoutCache", dataset: "min", club_id : parseInt(v_input_str)});
            });
            TouchUtils.setOntouchListener($('btn_mergeClub'), function (sender) {
                if(!that.canMergeClubId || that.canMergeClubId == 0){
                    alert11("您输入亲友圈ID有误");
                    return;
                }
                network.send(2103, {cmd: "applyComboClub", old_club_id : that.clubId, club_id : that.canMergeClubId, msg_type: "comboClub"});
            });


            TouchUtils.setOntouchListener($('btn_help'), function (sender) {
                that.addChild(new ClubHelpLayer(4),10);
            });


        },

    });
    exports.ClubMergeClub = ClubMergeClub;

})(window);