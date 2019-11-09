/**
 * Created by hjx on 2018/2/8.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubInputLayer = cc.Layer.extend({
        layerHeight: 0,
        input_num:'',
        ctor: function (type, data) {
            this._super();
            cc.log("===========请输入要修改的亲友圈名称====");

            var that = this;
            if (type == 'changeName') { //input输入
                loadNodeCCS(res.ClubChangeNameLayer_json, this);
                $ = create$(this.getChildByName("Layer"));
                $('lb_content').setString("请输入要修改的亲友圈名称");

                $('input').setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                $('input').addEventListener(function (textField, type) {
                    switch (type) {
                        case ccui.TextField.EVENT_ATTACH_WITH_IME:
                            cc.log("attach with IME");
                            break;
                        case ccui.TextField.EVENT_DETACH_WITH_IME:
                            that.setPositionY(0);
                            cc.log("detach with IME");
                            break;
                        case ccui.TextField.EVENT_INSERT_TEXT:
                            cc.log("insert words");
                            break;
                        case ccui.TextField.EVENT_DELETE_BACKWARD:
                            cc.log("delete word");
                            break;
                        default:
                            break;
                    }
                }, that);
            } else { //按钮输入
                if (type == 'invite') {
                    loadNodeCCS(res.ClubInputLayer_json, this);
                    $ = create$(this.getChildByName("Layer"));
                    $('img_title').setVisible(false);
                    // $('img_title').setTexture(res.club_word_invite);
                    // $('btn_ok').loadTexture(res.club_btn_ok);
                } else if (type == 'join') {
                    loadNodeCCS(res.ClubInputLayer_json, this);
                    $ = create$(this.getChildByName("Layer"));
                    $('img_title').setVisible(false);
                    // $('btn_ok').loadTexture(res.club_btn_ok);
                    if (data) $('input').setString('' + data);
                }


                for (var i=0;i<=9;i++){
                    (function(i){
                        TouchUtils.setOnclickListener($('btn_num_'+i), function () {
                            if (that.input_num.length < 10 ){
                                that.input_num = that.input_num + i;
                                $('input').setString(that.input_num);
                            }
                        });
                    })(i);
                }
                TouchUtils.setOnclickListener($('btn_reinput'), function () {
                    that.input_num = "";
                    $('input').setString(that.input_num);
                });

                TouchUtils.setOnclickListener($('btn_delete'), function () {
                    that.input_num = that.input_num.substring(0,that.input_num.length-1);
                    $('input').setString(that.input_num);
                });
            }

            TouchUtils.setOnclickListener($('btn_close'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root'), function () {
            });

            TouchUtils.setOnclickListener($('btn_ok'), function () {
                if (type == 'changeName'){
                    $('input').didNotSelectSelf();
                }
                var input = $('input').getString();

                if (type == 'apply') {
                    if (input == null || input == undefined || input == "") {
                        var tip = "亲友圈ID不能为空";
                        if (that.createoradd == "create") tip = "亲友圈名称不能为空";
                        alert11(tip, 'noAnimation');
                        return;
                    }
                    if (input.length < 1 || input.length > 17) {
                        var tip = "群ID长度在1-16字符之间";
                        if (that.createoradd == "create") tip = "群昵称长度在1-16字符之间";
                        alert11(tip, 'noAnimation');
                        return;
                    }

                    var inputnum = parseInt(input);
                    if (!inputnum) {
                        alert11('群ID不是数字', 'noAnimation');
                        return;
                    }
                    network.send(2103, {
                        cmd: 'applyClub',
                        club_id: input,
                        name: gameData.nickname,
                        head: gameData.headimgurl
                    });
                } else if (type == 'invite') {
                    var inputnum = parseInt(input);
                    if (!inputnum) {
                        alert11('玩家ID不是数字', 'noAnimation');
                        return;
                    }
                    network.send(2103, {cmd: 'addClubMember', club_id: data['_id'], obj_id: inputnum});
                } else if (type == 'changeName') {
                    var tip = "";
                    var str = input;
                    if (str == null || str == undefined || str == "") {
                        tip = "亲友圈名称为空";
                    }
                    if (tip == "" && (str.length < 2 || str.length > 17)) {
                        tip = "群名称长度在2-16字符之间";
                    }
                    if (tip == "") {
                        network.send(2103, {cmd: 'modifyClub', club_id: data['_id'], name: str});
                        that.removeFromParent();
                    } else {
                        alert11(tip, 'noAnimation');
                    }
                } else if (type == "join") {
                    if (input == null || input == undefined || input == "") {
                        var tip = "亲友圈ID不能为空";
                        if (that.createoradd == "create") tip = "亲友圈名称不能为空";
                        alert11(tip, 'noAnimation');
                        return;
                    }
                    if (input.length < 1 || input.length > 17) {
                        var tip = "群ID长度在1-16字符之间";
                        if (that.createoradd == "create") tip = "群昵称长度在1-16字符之间";
                        alert11(tip, 'noAnimation');
                        return;
                    }

                    var inputnum = new Number(input);
                    if (_.isNaN(inputnum)) {
                        alert11('请输入正确的群ID（数字）', 'noAnimation');
                        return;
                    }
                    network.send(2103, {
                        cmd: 'applyClub',
                        club_id: input,
                        name: gameData.nickname,
                        head: gameData.headimgurl
                    });
                }

            });

            return true;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            var that = this;
            that.msgList = [];
            this.list1 = cc.eventManager.addCustomListener('applyClub', function (event) {
                var data = event.getUserData();

                if (data.result == 0)
                    alert11(data.msg, 'noAnimation');
                that.removeFromParent();
            });

            this.list2 = cc.eventManager.addCustomListener('addClubMember', function (event) {
                var data = event.getUserData();
                if (data.result == 0) alert11('成员成功加入亲友圈', 'noAnimation');
                that.removeFromParent();
            });

        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
            cc.eventManager.removeListener(this.list1);
            cc.eventManager.removeListener(this.list2);
        }
    });

    exports.ClubInputLayer = ClubInputLayer;
})(window);