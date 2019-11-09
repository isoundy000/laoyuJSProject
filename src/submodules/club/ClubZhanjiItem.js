/**
 * Created by www on 2017/5/15.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubZhanjiItem = cc.TableViewCell.extend({
        layerHeight: 0,
        ctor: function (data, idx, club_id) {
            this._super();

            var that = this;

            var scene = ccs.load(res.ClubZhanjiItem_json, 'res/');
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.layerHeight = this.getChildByName("Layer").getBoundingBox().height;
            this.initUI();
            return true;
        },
        initUI: function () {
            this.lb_index = $('lb_index');
            this.lb_roomNum = $('lb_roomNum');
            this.lb_roomid = $('lb_roomid');
            this.btn_detail = $('btn_detail');
            this.lb_time = $('lb_time');
            this.lb_title = $('lb_title');
            this.sp_result = $('sp_result');

            for (var i = 0; i < 4; i++) {
                this['info_' + (i + 1)] = $('info_' + (i + 1));
                this['fz_icon' + (i + 1)] = $('fz_icon', this['info_' + (i + 1)]);
            }
        },
        getLayerWidth: function () {
            return this.layerWidth;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
        initCellData: function (data, idx, club_id) {

            TouchUtils.setOnclickListener(this.btn_detail, function () {
                window.maLayer.addChild(new ZhanjiDetailLayer(data['id'], data['nickname1'], data['nickname2'], data['nickname3'], data['nickname4'], data['result_arr'], data, club_id));
            });

            if (data['wanfa']) {
                if (!_.isNumber(data['cur_round'])) {
                    this.lb_roomNum.setString(data['total_round']);
                } else {
                    this.lb_roomNum.setString((data['cur_round'] + 1) + "/" + data['total_round']);
                }
            } else {
                this.lb_roomNum.setString(data['total_round']);
            }

            this.lb_roomid.setString("" + data['room_id']);
            this.lb_index.setString("" + idx);
            this.lb_time.setString(timestamp2time(data['create_time']));
            if (data['zhname'])
                if (data['zhname'] == '永州扯胡子') {
                    if (data['uid3'] && !data['uid4']) {
                        this.lb_title.setString('激情三人场');
                    } else if (!data['uid3']) {
                        this.lb_title.setString('火拼二人场');
                    } else {
                        this.lb_title.setString('坐醒四人场');
                    }
                } else {
                    data['zhname'] = data['zhname'].replace('祁阳落地扫', '落地扫');
                    this.lb_title.setString(data['zhname']);
                }
            else if (data['wanfa']) {
                var _name = '跑得快';
                if (data['wanfa'].indexOf('跑得快') >= 0) {
                    _name = '跑得快';
                } else if (data['wanfa'].indexOf('转转麻将') >= 0) {
                    _name = '转转麻将';
                } else if (data['wanfa'].indexOf('红中麻将') >= 0) {
                    _name = '红中麻将';
                }
                this.lb_title.setString(_name);
            }

            var myScore = 0;
            for (var i = 0; i < 4; i++) {
                var info = this['info_' + (i + 1)];
                $('fz_icon', info).setVisible(data['owner_uid'] == data['uid' + (i + 1)]);
                var nickname = '';
                var uid = 0;
                var score = 0;
                var head = "";
                if (gameData.uid == data['uid' + (i + 1)]) {
                    myScore = data['resultscore'][i];
                }
                if (!data['nicknames']) {
                    if (data['nickname' + (i + 1)])
                        nickname = data['nickname' + (i + 1)];
                    if (data['uid' + (i + 1)])
                        uid = data['uid' + (i + 1)];
                    score = data['resultscore'][i]
                }
                if (data['heads'].length > 0) {
                    if (data['heads'][0] instanceof Array) {//字牌传的二维数组，麻将传的一维数组
                        head = data['heads'][0][i];
                    } else {
                        head = data['heads'][i];
                    }
                }
                if (nickname || uid) {
                    info.setVisible(true);
                    $('lb_nickname', info).setString(ellipsisStr(nickname, 6));
                    if (undefined != score) {
                        if (score >= 0) {
                            if (score > 0)
                                score = "+" + score;
                            $('lb_score', info).setTextColor(cc.color("#3b6d99"));
                        }
                        else {
                            $('lb_score', info).setTextColor(cc.color("#b15326"));
                        }
                        $('lb_score', info).setString(score);
                    } else {
                        $('lb_score', info).setVisible(false);
                    }
                    // var icon = $('icon', info);
                    // if(cc.sys.isNative){
                    //     loadImageSprite(((head == null || head == "" || head == undefined) ? "res/image/defaultHead.jpg"
                    //         : decodeURIComponent(head)), icon, icon.getContentSize().width/2);
                    // } else {
                    //     loadImage(((head == null || head == "" || head == undefined)
                    //         ? "res/defaultHead.jpg" : decodeURIComponent(head)),  icon);
                    // }
                } else {
                    info.setVisible(false);
                }
            }
            var img = 'res/table/zhanji/zhanji_ping.png';
            if (myScore > 0) {
                img = 'res/table/zhanji/zhanji_ying.png';
            } else if (myScore < 0) {
                img = 'res/table/zhanji/zhanji_shu.png';
            }
            this.sp_result && this.sp_result.setTexture(img);
        },
        showToast: function (msg) {
            var toast = $('toast');
            if (!toast) {
                toast = new cc.Sprite(res.toast_bg_png);
                toast.setName("toast");
                cc.director.getRunningScene().addChild(toast, 1000);

                var text = new ccui.Text();
                text.setName('text');
                text.setFontSize(30);
                text.setTextColor(cc.color(255, 255, 255));
                text.setPosition(toast.getBoundingBox().width / 2, toast.getBoundingBox().height / 2);
                text.setString(msg);
                toast.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 * 4 / 5);
                toast.addChild(text, 1);
            }
            toast.stopAllActions();
            toast.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
            text = toast.getChildByName('text');
            text.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
        },
        getLayerHeight: function () {
            return this.layerHeight;
        }
    });

    exports.ClubZhanjiItem = ClubZhanjiItem;
})(window);
