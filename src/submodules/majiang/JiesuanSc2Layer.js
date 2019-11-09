(function () {
    var exports = this;

    var $ = null;

    var HUTYPE_LIUJU = 0;
    var HUTYPE_ZIMO = 1;
    var HUTYPE_DIANPAO = 2;

    var getPaiNameByRowAndId = function (row, id, isLittle, isStand) {
        var prefix;

        var ret = null;

        if (row == 0 && isLittle) prefix = "p0s";
        if (row == 0 && !isLittle) prefix = "p2l";
        if (row == 1 && isLittle) prefix = "p1s";
        if (row == 1 && !isLittle) prefix = "p2l";
        if (row == 2 && isLittle) prefix = "p2s";
        if (row == 2 && !isLittle) prefix = "p2l";
        if (row == 3 && isLittle) prefix = "p3s";
        if (row == 3 && !isLittle) prefix = "p2l";

        if (prefix) ret = prefix + id + '.png';

        if (row == 0 && id == 0 && isLittle) ret = 'p0s0' + '.png';
        if (row == 1 && id == 0 && isLittle) ret = 'p1s0' + '.png';
        //if (row == 2 && id == 0 && isLittle) ret = '' + '.png';
        if (row == 3 && id == 0 && isLittle) ret = 'p3s0' + '.png';
        //if (row == 0 && id == 0 && !isLittle) ret = 'bs' + '.png';
        //if (row == 1 && id ==&& !isLittle) ret = 'bh' + '.png';
        if (row == 2 && id == 0 && !isLittle) ret = 'p2l0' + '.png';
        //if (row == 3 && id == 0 && !isLittle) ret = 'bh' + '.png';

        if (row == 0 && isStand && isLittle) ret = 'h0s' + '.png';
        if (row == 1 && isStand && isLittle) ret = 'h1s' + '.png';
        if (row == 3 && isStand && isLittle) ret = 'h3s' + '.png';
        if (row == 0 && isStand && !isLittle) ret = 'p2l0' + '.png';
        if (row == 1 && isStand && !isLittle) ret = 'by' + '.png';
        if (row == 3 && isStand && !isLittle) ret = 'bz' + '.png';

        return ret;
    };

    var JiesuanSc2Layer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data, laiziPaiId, map_id, laizipiPaiAId) {
            this._super();
            var that = this;
            var size = cc.winSize;
            var scene = loadNodeCCS(res.JiesuanScLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));
            var isZimo = (data['hu_type'] == HUTYPE_ZIMO);
            var isLiuju = (data['hu_type'] == HUTYPE_LIUJU);
            var isDianpao = (data['hu_type'] == HUTYPE_DIANPAO);
            var zhuangUid = data['zhuang'];
            var dianpaoUid = data['dianpao_uid'];
            var huPaiMap = data['hu_pai_map'];
            var title = (data['map_id'] ? (gameData.mapId2Name(data['map_id']) + '\n') || '' : '');
            //结算最上面的显示图片玩法1
            if (laiziPaiId != undefined && map_id == MAP_ID.SICHUAN_YB) {
                var pai = new cc.Sprite('#p2l8.png');
                var paiName = getPaiNameByRowAndId(2, laiziPaiId, false, false);
                setSpriteFrameByName(pai, paiName, 'pai');
                pai.setScale(0.5);
                pai.setPosition(cc.p(122, 680));
                $('root.panel.bg').addChild(pai);
                $('root.panel.bg').setVisible(true);
            }
            if (laiziPaiId != undefined && map_id == MAP_ID.SICHUAN_YB) {
                var pai = new cc.Sprite('#p2l8.png');
                var paiName = getPaiNameByRowAndId(2, laizipiPaiAId[0], false, false);
                setSpriteFrameByName(pai, paiName, 'pai');
                pai.setScale(0.5);
                pai.setPosition(cc.p(77, 680));
                pai.setColor(cc.color(255, 255, 0));
                $('root.panel.bg').addChild(pai);
                $('root.panel.bg').setVisible(true);
            }
            if (laiziPaiId != undefined && map_id == MAP_ID.SICHUAN_YB) {
                var pai = new cc.Sprite('#p2l8.png');
                var paiName = getPaiNameByRowAndId(2, laizipiPaiAId[1], false, false);
                setSpriteFrameByName(pai, paiName, 'pai');
                pai.setScale(0.5);
                pai.setPosition(cc.p(167, 680));
                pai.setColor(cc.color(255, 255, 0));
                $('root.panel.bg').addChild(pai);
                $('root.panel.bg').setVisible(true);
                if (laizipiPaiAId[2] != 0) {
                    pai.setPosition(cc.p(122, 680));
                    var pai = new cc.Sprite('#p2l8.png');
                    var paiName = getPaiNameByRowAndId(2, laizipiPaiAId[2], false, false);
                    setSpriteFrameByName(pai, paiName, 'pai');
                    pai.setScale(0.5);
                    pai.setPosition(cc.p(167, 680));
                    pai.setColor(cc.color(255, 255, 0));
                    $('root.panel.bg').addChild(pai);
                    $('root.panel.bg').setVisible(true);
                }
            }


            if (false);
            else if (isLiuju)   title += '流局';
            else if (isZimo)    title += '自摸';
            else if (isDianpao) title += '点炮';
            else title += '解散';

            var btn_fenxiang = $('root.panel.btn_fenxiang');
            var btn_start = $('root.panel.btn_start');
            var btn_chakan = $('root.panel.btn_chakan');

            if (gameData.loginType == 'yk') {
                btn_fenxiang.setVisible(false);
                btn_start.setPositionX(btn_start.getParent().getContentSize().width / 2);
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

                //杠牌1
                var gangIdArr = [];
                var gangIndexArr = [];
                var gangPosArr = [];

                if (!$('root.panel.row' + i))
                    continue;

                if (!title && uid == gameData.uid)
                    title = (isHu ? '胡牌' : '失败');

                if (isHu) {
                    var idx = paiArr.indexOf(huPaiMap[uid][0]);
                    if (idx >= 0) {
                        paiArr.splice(idx, 1);
                    }
                }

                var gouchengArr = [];
                //单据结算显示房间号,回放码,和时间
                $('root.panel.xianshi_id').setString(gameData.roomId);
                $('root.panel.huifangma_id').setString(data.recorderId || "");
                $('root.panel.play_time').setString(timestamp2time(data.ts));


                var playerInfo = gameData.getPlayerInfoByUid(uid);
                $('root.panel.row' + i + '.lb_nickname').setString((zhuangUid == uid ? '(庄) ' : '') + playerInfo.nickname);

                $('root.panel.row' + i + '.hubg').setVisible(isHu);
                $('root.panel.row' + i + '.hu').setVisible(isHu);
                if (gameData.mapId == MAP_ID.SICHUAN_DEYANG || gameData.mapId == MAP_ID.SICHUAN_XUEZHAN) {
                    for (var j = 0; j < textArr.length; j++) {
                        var obj = textArr[j];
                        for (var key in obj)
                            if (decodeURIComponent(key) == "1胡") {
                                $('root.panel.row' + i + '.hu').setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/yihu.png'));
                                delete obj[key];
                                break;
                            }
                            else if (decodeURIComponent(key) == "2胡") {
                                $('root.panel.row' + i + '.hu').setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/erhu.png'));
                                delete obj[key];
                                break;
                            }
                            else if (decodeURIComponent(key) == "3胡") {
                                $('root.panel.row' + i + '.hu').setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/sanhu.png'));
                                delete obj[key];
                                break;
                            }
                            // else if(textArr[x] == "1胡") {
                            //     $('root.panel.row' + i + '.hu').setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/yihu.png'));
                            //     break;
                            // }
                            else {
                            }
                        // gouchengArr.push(decodeURIComponent(key) + (obj[key] > 1 ? 'x' + obj[key] : ''));
                    }
                }
                if (textArr)
                    $('root.panel.row' + i + '.lb_score').setString(fan.toString());
                $('root.panel.row' + i + '.lb_score_gang').setString(gangScore.toString());
                $('root.panel.row' + i + '.lb_score_sum').setString(score < 0 ? score : ('+' + score.toString()));

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
                        //paiIdArr.push(dui['pai_arr'][0]);
                        gangCnt++;
                    }
                    if (dui.type == 4) {
                        paiIdArr.push(0);
                        paiIdArr.push(0);
                        paiIdArr.push(0);
                        // paiIdArr.push(dui['pai_arr'][0]);
                        anGangCnt++;
                    }

                    //杠牌2
                    if (dui.type == 3 || dui.type == 4) {
                        gangIdArr.push(dui['pai_arr'][0]);
                        gangIndexArr.push(paiIdArr.length - 2);
                    }


                    //添加飞提的id做下处理
                    if (dui.type == 5 || dui.type == 6) {
                        paiIdArr.push(dui['pai_arr'][0]);
                        paiIdArr.push(dui['pai_arr'][1]);
                        paiIdArr.push(dui['pai_arr'][2]);
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

                if (isHu && huPaiMap[uid][0]) {
                    if (paiIdArr[paiIdArr.length - 1] != -1)
                        paiIdArr.push(-1);
                    paiIdArr.push(huPaiMap[uid][0]);

                    gouchengArr.push(isZimo ? '自摸' : '点炮胡');
                }
                else {
                    $('root.panel.row' + i + '.lb_fan_text').setVisible(false);
                    $('root.panel.row' + i + '.lb_score').setVisible(false);
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
                var gapDistance = 20;
                //杠牌3
                var gangIndex = 0;

                for (var j = 0; j < paiIdArr.length; j++) {
                    if (paiIdArr[j] == -1) {
                        gapNum++;
                        continue;
                    }
                    var pai = $('root.panel.row' + i + '.a' + j);
                    if (!pai) {
                        pai = duplicateSprite(a0);
                        pai.setPositionX(a0.getPositionX() + a0.getContentSize().width * 0.932 * a0.getScaleX() * (j - gapNum) + gapNum * gapDistance);
                        a0.getParent().addChild(pai);
                    }

                    //杠牌4
                    if (gangIndexArr[gangIndex] == j) {
                        var x = a0.getPositionX() + a0.getContentSize().width * 0.932 * a0.getScaleX() * (j - gapNum) + gapNum * gapDistance;
                        var y = a0.getPositionY() + 13;
                        gangPosArr.push(cc.p(x, y));
                        gangIndex++;
                    }

                    var paiName = 'p2s' + paiIdArr[j] + '.png';
                    setSpriteFrameByName(pai, paiName, 'pai');
                    //处理结算界面手牌变色牌
                    if (laiziPaiId != undefined && map_id == MAP_ID.SICHUAN_YB) {
                        if (laizipiPaiAId[0] == paiIdArr[j] || laizipiPaiAId[1] == paiIdArr[j] || laizipiPaiAId[2] == paiIdArr[j]) {
                            pai.setColor(cc.color(255, 255, 0));
                            if (laizipiPaiAId[2] != 0 && laizipiPaiAId[2] == paiIdArr[j]) {
                                pai.setColor(cc.color(255, 255, 0));
                            }
                        }
                        else {
                            pai.setColor(cc.color(255, 255, 255));
                        }
                    }
                }
                //杠牌5
                for (var j = 0; j < gangIdArr.length; j++) {
                    var gang = $('root.panel.row' + i + '.g' + j);
                    if (!gang) {
                        gang = duplicateSprite(a0);
                        gang.setPosition(gangPosArr[j]);
                        gang.setColor(cc.color(255, 255, 255));
                        a0.getParent().addChild(gang);
                        var paiName = 'p2s' + gangIdArr[j] + '.png';
                        setSpriteFrameByName(gang, paiName, 'pai');
                    }
                }


            }

            $('root.panel.lb_ts').setString(timestamp2time(data['ts']));
            // $('root.panel.lb_title').setString(title);
            //结算最上面的显示图片玩法2
            $('root.panel.lb_title').setString(gameData.mapId2Name(data['map_id']));
            $('root.panel.lb_roomid').setString('房间号: ' + gameData.roomId + ' 局数: ' + data['cur_round'] + '/' + data['total_round']);

            for (var i = players.length; i < 4; i++)
                $('root.panel.row' + i).setVisible(false);

            TouchUtils.setOnclickListener(btn_fenxiang, function () {
                var layer = (players.length == 3 ? new JiesuanSc3Layer(data) : new JiesuanScLayer(data));
                that.addChild(layer);
            });

            TouchUtils.setOnclickListener(btn_start, function () {
                // ready
                network.send(3004, {room_id: gameData.roomId});
                window.maLayer.onJiesuanClose(true);
                that.removeFromParent(true);
            });

            var closeFunc = function () {
                // ready
                window.maLayer.onJiesuanClose(false);
                that.removeFromParent(true);
            };
            TouchUtils.setOnclickListener($('root.panel.btn_close'), closeFunc);
            TouchUtils.setOnclickListener(btn_chakan, closeFunc);

            if (data['is_last']) {
                btn_start.setVisible(false);
                btn_chakan.setVisible(true);
                //setPosition(cc.winSize.width / 2, btn_fenxiang.getPositionY());
            }

            // 回放不显示总战绩
            if (data["is_huifang"]) {
                btn_fenxiang.setVisible(true);
                btn_fenxiang.setPositionX(cc.winSize.width / 2);
                btn_chakan.setVisible(false);
            }
            return true;
        }
    });

    exports.JiesuanSc2Layer = JiesuanSc2Layer;
})(window);
