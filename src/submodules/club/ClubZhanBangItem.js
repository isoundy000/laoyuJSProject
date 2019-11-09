/**
 * Created by www on 2017/5/15.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubZhanBangItem = cc.TableViewCell.extend({
        layerHeight: 0,
        ctor: function (data, idx, club_id, parentLayer) {
            this._super();

            var that = this;
            this._parentLayer = parentLayer;

            var scene = ccs.load(res.ClubZhanBangItem_1_json, 'res/');
            this.addChild(scene.node);
            this.sceneNode = scene.node;
            $ = create$(this.getChildByName("Layer"));

            this.layerHeight = this.getChildByName("Layer").getBoundingBox().height;
            this.initUI();
            return true;
        },
        initUI: function () {
            var that = this;
            this.lb_wanfaName = $('lb_wanfaName');
            this.lb_round = $('roominfo.lb_round');
            this.lb_roomid = $('roominfo.lb_roomid');
            this.lb_time = $('roominfo.lb_time');
            this.lb_idx = $('roominfo.lb_idx');
            this.bg = $('bg');
            this.Image_2 = $('Image_2');
            this.lb_wanfaName = $('lb_wanfaName');
            this.roominfo = $('roominfo');
            this.btn_share = $('btn_share');

            for (var i = 0; i < 9; i++) {
                if($('info_' + (i + 1)))  this['info_' + (i + 1)] = $('info_' + (i + 1));
            }
        },
        getLayerWidth: function () {
            return this.layerWidth;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
        initCellData: function (data, idx, curSelectedTab) {
            var that = this;
            this._data = data;
            this._idx = idx;
            this._curSelectedTab = curSelectedTab;

            this.bg.setContentSize(data.uid5 ? cc.size(930, 200) : cc.size(930, 115));
            this.Image_2.setContentSize(data.uid5 ? cc.size(43, 180) : cc.size(43, 110));
            this.Image_2.setPositionY(this.bg.getContentSize().height/2);
            this.lb_wanfaName.setPositionY(this.bg.getContentSize().height/2);
            this.roominfo.setPositionY(data.uid5 ? 110 : 20);
            this.btn_share.setPositionY(data.uid5 ? 110 : 20);

            this.btn_share.setVisible(data['map_id'] == MAP_ID['DN'] || data['map_id'] == MAP_ID['NN'] || data['map_id'] >= 4000
            || data['map_id'] == MAP_ID['ZJH']);
            TouchUtils.setOnclickListener(this.btn_share, function () {
                if(that._parentLayer){
                    that._parentLayer.shareNode(that._data);
                }
            });

            for (var i = 0; i < 9; i++) {
                if(this['info_' + (i + 1)]){//20  10 110
                    this['info_' + (i + 1)].setPositionY((data.uid5) ? ((i < 4)?110:10) : (20));
                }
            }

            if (data['wanfa']) {
                if (!_.isNumber(data['cur_round'])) {
                    this.lb_round.setString(data['total_round']);
                } else {
                    var cur_round = data['cur_round'] + 1;
                    if(cur_round > data['total_round']){
                        cur_round = data['total_round'];
                    }
                    this.lb_round.setString(cur_round + '/' + data['total_round']);
                }
            } else {
                this.lb_round.setString(data['total_round']);
            }

            var c_time = timestamp2time(data['create_time']);
            // var regE1 = new RegExp('2018-', '');
            // c_time = c_time.replace(regE2, '');
            this.lb_roomid.setString("" + data['room_id']);
            this.lb_time.setString(c_time.substr(5,c_time.length));

            var option = (data.optionstring && _.isString(data.optionstring)) ? JSON.parse(data.optionstring) : data.optionstring;
            var wanfa = gameData.mapId2Name(data['map_id']);
            if (data['map_id'] == MAP_ID['DN'] || data['map_id'] == MAP_ID['NN'] || data['map_id'] >= 4000) {
                wanfa = getZhuangMode(option);
            }
            if(wanfa && wanfa.length > 5)  wanfa = wanfa.substr(0, 5);
            this.lb_wanfaName.setString(wanfa);

            var maxScore = -100;
            var maxIndexArr = [];
            var userInfoArr = [];
            for (var i = 0; i < 9; i++) {
                userInfoArr[i] = [];
                var head= null;
                var score = null;
                if (data['resultscore']) {
                    score = data['resultscore'][i]
                    if(score && score >= maxScore)
                        maxScore = data['resultscore'][i]
                    maxIndexArr.push(i);
                }

                if (!data['nicknames']) {
                    if (data['nickname' + (i + 1)]) {
                        userInfoArr[i]['nickname'] = data['nickname' + (i + 1)];
                    }
                    if (data['uid' + (i + 1)]) {
                        userInfoArr[i]['uid'] = data['uid' + (i + 1)];
                    }
                    userInfoArr[i]['score'] = data['resultscore'][i];
                }
                if (data['heads'].length > 0) {
                    if (data['heads'][0] instanceof Array) {//字牌传的二维数组，麻将传的一维数组
                        head = data['heads'][0][i];
                    } else {
                        if (_.isString(data['heads'])) {
                            head = data['heads'].split(',')[i];
                        } else {
                            head = data['heads'][i];
                        }
                    }
                    if (head) {
                        head = head.replace('\'', '');
                        head = head.replace('\'', '');
                    }
                    userInfoArr[i]['head'] = head;
                }
            }

            this.lb_idx.setString(idx);

            if (curSelectedTab == 1) {
                userInfoArr.sort(function (a, b) {
                    return maxScore && b.score == maxScore;
                })
            }

            for (var i = 0; i < 9; i++) {
                var info = this['info_' + (i + 1)];
                if(info) {
                    var head = userInfoArr[i]['head'];
                    var uid = userInfoArr[i]['uid'];
                    var score = userInfoArr[i]['score'];
                    var nickname = userInfoArr[i]['nickname'];
                    $('icon_winner', info).setVisible(maxScore && maxScore == score);
                    if (nickname || uid) {
                        info.setVisible(true);
                        $('lb_name', info).setString(ellipsisStr(nickname, 5));
                        $('lb_id', info).setString(ellipsisStr('ID ' + uid));
                        loadImage(head, $('head', info));
                        if (undefined != score) {
                            if (score >= 0) {
                                if (score > 0)
                                    score = "+" + score;
                                $('lb_score', info).setFntFile(res.club_win_fnt);
                            } else {
                                $('lb_score', info).setFntFile(res.club_lose_fnt);
                            }
                            $('lb_score', info).setString(score);
                        } else {
                            $('lb_score', info).setVisible(false);
                        }
                    } else {
                        info.setVisible(false);
                    }
                }
            }
        },
        initMaxCellData: function (data, idx, curSelectedTab) {
            if (_.isNumber(data['currRound']) && _.isNumber(data['totalRound'])) {
                this.lb_round.setString((data['currRound'] + 1) + "/" + data['totalRound']);
            }
            if (data['create_time']) {
                var c_time = timestamp2time();
                this.lb_time.setString(c_time.substr(5,c_time.length));
            }
            this.lb_roomid.setString("" + data['roomId']);
            this.lb_wanfaName.setString(gameData.mapId2Name[data['mapId']]);

            if(!data['players']){
                console.log('没有玩家');
                return;
            }
            var players = JSON.parse(data['players']);

            var maxScore = -100;
            var userInfoArr = [];
            for (var i = 0; i < 4; i++) {
                userInfoArr[i] = [];
                var player = players[i];
                if (!player) {
                    break;
                }
                var score = player['score'];
                if(score && score >= maxScore) {
                    maxScore = score;
                }
            }

            players.sort(function(a, b) {
               return b.score && b.score == maxScore;
            });

            for (var i = 0; i < 9; i++) {
                var info = this['info_' + (i + 1)];
                var player = players[i];
                if (player) {
                    var head= player['head'];
                    var uid= player['id'];
                    var nickname = player['nickname'];
                    var score = player['score'];
                    $('icon_winner', info).setVisible(maxScore && maxScore == score);
                    info.setVisible(true);
                    $('lb_name', info).setString(ellipsisStr(nickname, 6));
                    $('lb_id', info).setString(ellipsisStr('ID ' + uid));
                    if (undefined != score) {
                        if (score >= 0) {
                            if (score > 0)
                                score = "+" + score;
                            $('lb_score', info).setFntFile(res.club_win_fnt);
                        } else {
                            $('lb_score', info).setFntFile(res.club_lose_fnt);
                        }
                        $('lb_score', info).setString(score);
                    } else {
                        $('lb_score', info).setVisible(false);
                    }
                } else {
                    info.setVisible(false);
                }
            }
        },
        getLayerHeight: function () {
            return this.layerHeight;
        },
    });

    exports.ClubZhanBangItem = ClubZhanBangItem;
})(window);
