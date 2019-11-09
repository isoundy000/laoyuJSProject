(function () {
    var exports = this;

    var $ = null;

    var HUTYPE_LIUJU = 0;
    var HUTYPE_ZIMO = 1;
    var HUTYPE_DIANPAO = 2;
    var HUTYPE_JIESAN = 3;

    var JiesuanLayer = cc.Layer.extend({
        onEnter: function () {
            this._super();
            var that=this;
            if (this._data['matchId'] && !this._data['is_last']){
                this.scheduleOnce(function(){that.removeFromParent()},5);
            }
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data) {
            this._super();

            this._data=data;

            var that = this;

            var size = cc.winSize;

            var scene = loadNodeCCS(res.JiesuanLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            var isZimo = (data['hu_type'] == HUTYPE_ZIMO);
            var isLiuju = (data['hu_type'] == HUTYPE_LIUJU);
            var isDianpao = (data['hu_type'] == HUTYPE_DIANPAO);
            var isJiesan = (data['hu_type'] == HUTYPE_JIESAN);
            var zhuangUid = data['zhuang'];
            var dianpaoUid = data['dianpao_uid'];
            var huPaiId = data['hu_pai_id'];
            var wanfa = (data['map_id'] ? ('玩法：'+gameData.mapId2Name(data['map_id'])): '玩法：');

            //playEffect('vLiuju');

            // if (false);
            // else if (isLiuju) title += '流局';
            // else if (isZimo) title += '自摸';
            // else if (isDianpao) title += '点炮';
            // else title += '解散';

            var btnFenxiang = $('root.panel.btn_fenxiang');
            var btnStart = $('root.panel.btn_start');
            var btnChakan = $('root.panel.btn_chakan');

            if (gameData.loginType == 'yk') {
                btnFenxiang.setVisible(false);
                btnStart.setPositionX(btnStart.getParent().getContentSize().width / 2);
            }

            var players = data.players;

            var huCnt = 0;
            var diangangMap = {};
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var isHu = player['hu'];
                if (isHu) {
                    huCnt += 1;
                }

                var duiArr = player['dui_arr'];
                for (var j = 0; j < duiArr.length; j++) {
                    var dui = duiArr[j];
                    if (dui['from_uid'] && dui['from_uid'] != player.uid) {
                        diangangMap[dui['from_uid']] = diangangMap[dui['from_uid']] || 0;
                        diangangMap[dui['from_uid']]++;
                    }
                }
            }

            var my_score = 0;

            var set_outline_status = function (text, score) {
                if (score < 0) {
                    text.setColor(cc.color("#DFF9FF"))
                    text.enableOutline(cc.color("#5775A2"), 2);
                } else {
                    text.setColor(cc.color("#FFF9BB"))
                    text.enableOutline(cc.color("#BE3A00"), 2);
                }
            };

            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var uid = player['uid'];
                var score = player['score'];
                var gangScore = player['gang_score'];
                var fan = player['fan'];
                var paiArr = player['pai_arr'];
                var duiArr = player['dui_arr'];
                var textArr = player['text_arr'];
                var isHu = player['hu'];

                var paiIdArr = [];
                var gangIdArr = [];
                var gangIndexArr = [];
                var gangPosArr = [];

                if (!$('root.panel.row' + i))
                    continue;

                if (isHu) {
                    var idx = paiArr.indexOf(huPaiId);
                    if (idx >= 0) {
                        paiArr.splice(idx, 1);
                    }
                }

                var gouchengArr = [];

                var playerInfo = gameData.getPlayerInfoByUid(uid);
                $('root.panel.row' + i + '.lb_nickname').setString(ellipsisStr(playerInfo.nickname, 5));
                $('root.panel.row' + i + '.sp_zhuang').setVisible(zhuangUid == uid);
                loadImageToSprite(playerInfo.headimgurl, $('root.panel.row' + i + '.head'));


                $('root.panel.row' + i + '.dianpao').setVisible(false);
                $('root.panel.row' + i + '.hu').setVisible(false);
                $('root.panel.row' + i + '.zimo').setVisible(false);

                if (isDianpao) {
                    if(uid == dianpaoUid)
                        $('root.panel.row' + i + '.dianpao').setVisible(true);
                    else if(isHu)
                        $('root.panel.row' + i + '.hu').setVisible(true);
                } else if (isHu && isZimo) {
                    $('root.panel.row' + i + '.zimo').setVisible(true);
                }

                $('root.panel.row' + i + '.lb_score').setString(fan <= 0 ? fan : ('+' + fan.toString()));
                set_outline_status($('root.panel.row' + i + '.lb_score'), fan);
                $('root.panel.row' + i + '.lb_score_gang').setString(gangScore <= 0 ? gangScore : ('+' + gangScore.toString()));
                set_outline_status($('root.panel.row' + i + '.lb_score_gang'), gangScore);
                $('root.panel.row' + i + '.lb_score_sum').setString(score <= 0 ? score : ('+' + score.toString()));
                set_outline_status($('root.panel.row' + i + '.lb_score_sum'), score);

                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    var score = player['total_score'];
                    $('root.panel.row' + i + '.lb_score_sum').setString(score <= 0 ? score : ('+' + score.toString()));
                    set_outline_status($('root.panel.row' + i + '.lb_score_sum'), score);
                }
                /*----------------------- 比赛场 ----------------------- */

                if (uid == gameData.uid) my_score = score;

                while (true) {
                    for (var j = 0; j < duiArr.length; j++) {
                        var dui = duiArr[j];
                        if (dui.type == 5)
                            break;
                    }
                    if (j == duiArr.length)
                        break;
                    paiArr.push(duiArr[j]['pai_arr'][0]);
                    paiArr.push(duiArr[j]['pai_arr'][0]);
                    paiArr.push(duiArr[j]['pai_arr'][0]);
                    duiArr.splice(j, 1);
                }

                _.remove(paiArr, function (n) {
                    return n == 0;
                });

                paiArr.sort(function (a, b) {
                    return a - b
                });
                duiArr.sort(function (a, b) {
                    if (a['pai_arr'][0] == b['pai_arr'][0]) {
                        if (a['pai_arr'][1] == b['pai_arr'][1])
                            return a['pai_arr'][2] - b['pai_arr'][2];
                        return a['pai_arr'][1] - b['pai_arr'][1];
                    }
                    return a['pai_arr'][0] - b['pai_arr'][0];
                });

                var a0 = $('root.panel.row' + i + '.a' + 0);
                //a0.setScale(0.8);
                var anGangCnt = 0;
                var gangCnt = 0;
                for (var j = 0; j < duiArr.length; j++) {
                    var dui = duiArr[j];
                    if (dui.type == 1 || dui.type == 2) {
                        paiIdArr.push(dui['pai_arr'][0]);
                        paiIdArr.push(dui['pai_arr'][1]);
                        paiIdArr.push(dui['pai_arr'][2]);
                    }
                    if (dui.type == 3) {
                        paiIdArr.push(dui['pai_arr'][0]);
                        paiIdArr.push(dui['pai_arr'][0]);
                        paiIdArr.push(dui['pai_arr'][0]);
                        // paiIdArr.push(dui['pai_arr'][0]);
                        gangCnt++;
                    }
                    if (dui.type == 4) {
                        paiIdArr.push(0);
                        paiIdArr.push(0);
                        paiIdArr.push(0);
                        // paiIdArr.push(dui['pai_arr'][0]);
                        anGangCnt++;
                    }

                    //添加杠牌
                    if (dui.type == 3 || dui.type == 4)
                    {
                        gangIdArr.push(dui['pai_arr'][0]);
                        gangIndexArr.push(paiIdArr.length-2);
                    }

                    paiIdArr.push(-1);
                }

                if (anGangCnt)
                    gouchengArr.push("暗杠" + (anGangCnt > 1 ? 'x' + anGangCnt : ''));

                if (gangCnt)
                    gouchengArr.push("明杠" + (gangCnt > 1 ? 'x' + gangCnt : ''));

                if (diangangMap[uid])
                    gouchengArr.push("点杠" + (diangangMap[uid] > 1 ? 'x' + diangangMap[uid] : ''));

                for (var j = 0; j < paiArr.length; j++) {
                    paiIdArr.push(paiArr[j]);
                }

                if (isHu && huPaiId) {
                    if (paiIdArr[paiIdArr.length - 1] != -1)
                        paiIdArr.push(-1);
                    paiIdArr.push(huPaiId);

                    gouchengArr.push(isZimo ? '自摸' : '点炮胡');
                } else {
                    // $('root.panel.lb_fan_text').setVisible(false);
                    //$('root.panel.row' + i + '.lb_score').setVisible(false);
                }

                if (uid == dianpaoUid) {
                    gouchengArr.push('点炮' + (huCnt > 1 ? 'x' + huCnt : ''));
                }

                if (textArr) {
                    gouchengArr = [];
                    for (var j = 0; j < textArr.length; j++) {
                        var obj = textArr[j];
                        for (var key in obj)
                            gouchengArr.push(decodeURIComponent(key) + (obj[key] > 1 ? 'x' + obj[key] : ''));
                    }
                }

                gouchengArr.sort(function (a, b) {
                    return a < b
                });
                $('root.panel.row' + i + '.lb_goucheng').setString(gouchengArr.join(" "));

                var gapNum = 0;
                var gapDistance = 10;
                var gangIndex = 0;
                for (var j = 0; j < paiIdArr.length; j++) {
                    if (paiIdArr[j] == -1) {
                        gapNum++;
                        continue;
                    }
                    var pai = $('root.panel.row' + i + '.a' + j);
                    if (!pai) {
                        pai = duplicateSprite(a0);
                        pai.setPositionX(a0.getPositionX() + a0.getContentSize().width * 0.97 * a0.getScaleX() * (j - gapNum) + gapNum * gapDistance);
                        a0.getParent().addChild(pai);
                    }

                    if(gangIndexArr[gangIndex]==j)
                    {
                        var x = a0.getPositionX() + a0.getContentSize().width * 0.97 * a0.getScaleX() * (j - gapNum) + gapNum * gapDistance;
                        var y = a0.getPositionY()+13*a0.getScaleY();
                        gangPosArr.push(cc.p(x,y));
                        gangIndex++;
                    }

                    var paiName = 'p2s' + paiIdArr[j] + '.png';
                    setSpriteFrameByName(pai, paiName, 'majiang/pai');
                }

                //创建杠牌
                for (var j = 0; j < gangIdArr.length; j++) {
                    var gang = $('root.panel.row' + i + '.g' + j);
                    if (!gang) {
                        gang = duplicateSprite(a0);
                        gang.setPosition(gangPosArr[j]);
                        a0.getParent().addChild(gang);
                        var paiName = 'p2s' + gangIdArr[j] + '.png';
                        setSpriteFrameByName(gang, paiName, 'majiang/pai');
                    }
                }
            }

            $('root.panel.title_liuju').setVisible(false);
            $('root.panel.title_shengli').setVisible(false);
            $('root.panel.title_shibai').setVisible(false);
            $('root.panel.title_huangzhuang').setVisible(false);
            $('root.panel.title_jiesan').setVisible(false);

            if(isJiesan) {
                $('root.panel.title_jiesan').setVisible(true);
            } else if (isLiuju) {
                $('root.panel.title_liuju').setVisible(true);
            } else if (my_score > 0) {
                $('root.panel.title_shengli').setVisible(true);
            } else {
                $('root.panel.title_shibai').setVisible(true);
            }

            $('root.panel.lb_ts').setString(timestamp2time(data['ts']));
            $('root.panel.lb_wanfa').setString(wanfa);
            $('root.panel.lb_wanfa2').setVisible(gameData.wanfaDesp);
            if(gameData.wanfaDesp){
                var arr = decodeURIComponent(gameData.wanfaDesp).split(',');
                if (arr.length >= 3)
                    arr = arr.slice(3);
                var wanfaStr = arr.join(",");
                $('root.panel.lb_wanfa2').setString(wanfaStr);
            }
            /*----------------------- 比赛场 ----------------------- */
            if (gameData.matchId) {
                var matchInfo = data['matchInfo'];
                var stage = matchInfo['stage'];
                var tstage = matchInfo['stage_total'];
                var mtype = matchInfo['stage_type'] || 1;
                var matchname = '打立出局';
                if (mtype == 2) {
                    matchname = '定局积分';
                }
                var str=matchname+' 第'+stage+'/'+tstage+'轮'+' 第'+data['cur_round']+'/'+data['total_round']+'局';
                $('root.panel.lb_roomid').setString(str);
            }
            else{
                $('root.panel.lb_roomid').setString('房号：' + gameData.roomId + '   局数：' + data['cur_round'] + '/' + data['total_round']);
            }
            /*----------------------- 比赛场 ----------------------- */

            if (gameData.wanfaDesp) {
                var arr = decodeURIComponent(gameData.wanfaDesp).split(',');
                if (arr.length >= 3)
                    arr = arr.slice(3);
                var wanfaStr = arr.join(",");
                // $('root.panel.lb_wanfa').setString(wanfaStr);
                // $('root.panel.lb_wanfa').setVisible(true);
            }
            for (var i = players.length; i < 4; i++)
                $('root.panel.row' + i).setVisible(false);

            TouchUtils.setOnclickListener(btnFenxiang, function () {
                if (!cc.sys.isNative)
                    return;
                that.addChild(new ShareTypeLayer(that), 100);

                //captureAndShareToWX(that);
            });

            if(window.inReview){
                btnFenxiang.setVisible(false);
                btnStart.setPositionX(1280/2);
                btnChakan.setPositionX(1280/2);
            }

            TouchUtils.setOnclickListener(btnStart, function () {
                // ready
                network.send(3004, {room_id: gameData.roomId});
                window.maLayer.onJiesuanClose(true);
                that.removeFromParent(true);
            });

            var closeFunc = function () {
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId && data['is_last']) {
                    that.removeFromParent(true);
                    return;
                }
                /*----------------------- 比赛场 ----------------------- */
                // ready
                window.maLayer.onJiesuanClose(false);
                that.removeFromParent(true);
            };
            TouchUtils.setOnclickListener($('root.panel.btn_close'), closeFunc);
            TouchUtils.setOnclickListener(btnChakan, closeFunc);

            /*----------------------- 比赛场 ----------------------- */
            if (gameData.matchId && !data['is_last']) {
                $('root.panel.btn_close').setVisible(false);
            }
            /*----------------------- 比赛场 ----------------------- */

            if (data['is_last']) {
                btnStart.setVisible(false);
                btnChakan.setVisible(true);
                //setPosition(cc.winSize.width / 2, btnFenxiang.getPositionY());
                /*----------------------- 比赛场 ----------------------- */
                if (gameData.matchId) {
                    btnChakan.setVisible(false);
                    btnFenxiang.setPositionX(1280/2);
                }
                /*----------------------- 比赛场 ----------------------- */
            }
            var paiArr = data['zhongma_pai_arr'] || [];
            if (paiArr.length) {
                for (var i = 0; i < Math.min(paiArr.length, 6); i++) {
                    var pai = $('root.panel.ma.a' + i);
                    var paiName = 'p2s' + paiArr[i] + '.png';
                    setSpriteFrameByName(pai, paiName, 'majiang/pai');
                }
                for (; i < 6; i++) {
                    var pai = $('root.panel.ma.a' + i);
                    pai && pai.setVisible(false);
                }

                $('root.panel.ma').setVisible(true);
            }
            return true;
        }
    });
    exports.HUTYPE_LIUJU = HUTYPE_LIUJU;
    exports.HUTYPE_ZIMO = HUTYPE_ZIMO;
    exports.HUTYPE_DIANPAO = HUTYPE_DIANPAO;
    exports.Ma_JiesuanLayer = JiesuanLayer;
})(window);
