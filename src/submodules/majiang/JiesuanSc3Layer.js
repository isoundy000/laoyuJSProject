(function () {
    var exports = this;

    var $ = null;

    var JiesuanSc3Layer = cc.Layer.extend({
        myInitTaxIdx: -1,
        curTabIdx: -1,
        curSum: 0,
        pos: null,
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data) {
            this._super();

            var that = this;

            var myIdx = -1;
            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].uid == gameData.uid) {
                    myIdx = i;
                    break;
                }
            }
            if (myIdx >= 0) {
                this.myInitTaxIdx = myIdx;
                for (var i = 0; i < myIdx; i++) {
                    var t = data.players.shift();
                    data.players.push(t);
                }
            }

            this._playerid = [];
            for (var i = 0; i < data.players.length; i++)
                this._playerid.push(data.players[i].uid);
            this._data = data;

            var myPos = gameData.getPlayerInfoByUid(gameData.uid);
            for (var i = 0; i < gameData.players.length; i++)
                if (gameData.players[i].uid == gameData.uid) {
                    myPos = i;
                    this.curTabIdx = myPos;
                    break;
                }
            if (this.curTabIdx < 0)
                this.curTabIdx = 0;

            var scene = loadNodeCCS(res.JiesuanScLayer_1_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));
            var pos0 = $('root.panel.bg.Sprite_3');
            var pos1 = $('root.panel.bg.Sprite_4');
            var pos2 = $('root.panel.bg.Sprite_5');
            this.pos = [];
            this.pos.push(pos0.getPositionX());
            this.pos.push(pos1.getPositionX());
            this.pos.push(pos2.getPositionX());
            //关闭按钮
            var closeFunc = function () {
                if (gameData.mapId == MAP_ID.SICHUAN_XUELIU) {
                    window.maLayer.onJiesuanClose(false);
                }
                that.removeFromParent(true);
            };
            TouchUtils.setOnclickListener($('root.panel.bg.btn_next'), closeFunc);
            TouchUtils.setOnclickListener($('root.panel.bg.btn_detail'), function () {
                var layer = new JiesuanDetailScLayer(that._playerdata);
                that.addChild(layer);
            });
            TouchUtils.setOnclickListener($('root.panel.btn_close'), closeFunc);
            //player
            // var t1 = cc.textureCache.addImage('res/table/jisuan/jiesuan_player_n.png');
            // var t2 = cc.textureCache.addImage('res/table/jisuan/jiesuan_player_s.png');
            TouchUtils.setOnclickListener($('root.panel.bg.player_0'), function () {
                that.curTabIdx = 0;
                that.getOnePlayerData(that._playerid[0]);
                // $('root.panel.bg.player_0').setTexture(t1);
                // $('root.panel.bg.player_1').setTexture(t2);
                // $('root.panel.bg.player_2').setTexture(t2);
                // $('root.panel.bg.player_3').setTexture(t2);
                for (var index = 0; index < 4; ++index) {
                    $('root.panel.bg.player_' + index + '_s').setVisible(index == that.curTabIdx);
                }
            });
            TouchUtils.setOnclickListener($('root.panel.bg.player_1'), function () {
                that.curTabIdx = 1;
                that.getOnePlayerData(that._playerid[1]);
                // $('root.panel.bg.player_0').setTexture(t2);
                // $('root.panel.bg.player_1').setTexture(t1);
                // $('root.panel.bg.player_2').setTexture(t2);
                // $('root.panel.bg.player_3').setTexture(t2);
                for (var index = 0; index < 4; ++index) {
                    $('root.panel.bg.player_' + index + '_s').setVisible(index == that.curTabIdx);
                }
            });
            TouchUtils.setOnclickListener($('root.panel.bg.player_2'), function () {
                that.curTabIdx = 2;
                that.getOnePlayerData(that._playerid[2]);
                //     $('root.panel.bg.player_0').setTexture(t2);
                //     $('root.panel.bg.player_1').setTexture(t2);
                //     $('root.panel.bg.player_2').setTexture(t1);
                //     $('root.panel.bg.player_3').setTexture(t2);
                for (var index = 0; index < 4; ++index) {
                    $('root.panel.bg.player_' + index + '_s').setVisible(index == that.curTabIdx);
                }
            });
            $('root.panel.bg.player_3').setVisible(false);

            var s0 = $('root.panel.bg.player_0.Sprite_7');
            var s1 = $('root.panel.bg.player_1.Sprite_9');
            var s2 = $('root.panel.bg.player_2.Sprite_11');
            s0.setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/jisuan/js_me.png'));
            s1.setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/jisuan/js_xj.png'));
            s2.setTexture(cc.textureCache.addImage('res/submodules/majiang/image/ma_sc/jisuan/js_dj.png'));

            // if(gameData.mapId == MAP_ID.SICHUAN_XUELIU) {
            //     var btnStart = $('root.panel.bg.btn_next');
            //
            //     TouchUtils.setOnclickListener(btnStart, function () {
            //         // ready
            //         network.send(3004, {room_id: gameData.roomId});
            //         window.maLayer.onJiesuanClose(true);
            //         that.removeFromParent(true);
            //     });
            // }


            // $('root.panel.bg.player_0').setTexture(t1);
            // $('root.panel.bg.player_1').setTexture(t2);
            // $('root.panel.bg.player_2').setTexture(t2);
            // $('root.panel.bg.player_3').setTexture(t2);
            //head
            for (var i = 0; i < data.players.length; i++) {
                var uid = data.players[i].uid;
                var head = $('root.panel.bg.player_' + i + '.head_' + i);
                loadImageToSprite(gameData.getPlayerInfoByUid(uid)['headimgurl'], head);
                var name = $('root.panel.bg.player_' + i + '.name_' + i);
                name.setString(gameData.getPlayerInfoByUid(uid)['nickname']);
                var coin = $('root.panel.bg.player_' + i + '.coin_' + i);
                coin.setString(data.players[i].score);
            }
            //tableview
            var tableViewSize = $('root.panel.tableview').getSize();
            var tableViewAnchor = $('root.panel.tableview').getAnchorPoint();
            var tableViewPosition = $('root.panel.tableview').getPosition();

            var tableView = new cc.TableView(this, cc.size(tableViewSize.width, tableViewSize.height));
            tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
            tableView.setPosition(tableViewPosition);
            tableView.setAnchorPoint(tableViewAnchor);
            tableView.setDelegate(this);
            this.addChild(tableView);
            this._tableView = tableView;

            this.getOnePlayerData(this._playerid[0]);
            return true;
        },
        scrollViewDidScroll: function (view) {
        },
        scrollViewDidZoom: function (view) {
        },
        tableCellTouched: function (table, cell) {
        },
        tableCellTouched2: function () {
            cc.log("cell touched at index: ");
        },
        tableCellSizeForIndex: function (table, idx) {
            var tableViewSize = $('root.panel.tableview').getSize();
            if (this._playerdata.length > 0 && this._playerdata[idx].op
                && (decodeURIComponent(this._playerdata[idx].op)).length >= 10) {
                this._playerdata[idx].cellHeight = 70;
                return cc.size(tableViewSize.width, 70);
            } else {
                this._playerdata[idx].cellHeight = 50;
                return cc.size(tableViewSize.width, 50);
            }
        },
        tableCellAtIndex: function (table, idx) {
            var cell = table.dequeueCell();
            if (!cell) {
                cell = new cc.TableViewCell();
                this.createCell(cell, idx);
            }
            this.updateCell(cell, idx);
            return cell;
        },
        numberOfCellsInTableView: function (table) {
            return _.isArray(this._playerdata) ? this._playerdata.length : 0;
        },
        createCell: function (cell, idx) {
            // var cellbg = laiziPanel = new cc.Sprite('jiesuan_detail_bg');
            // cell.addChild(cellbg,-1);

            //操作
            var caozuo = new ccui.Text();
            caozuo.ignoreContentAdaptWithSize(false);
            caozuo.setTextAreaSize(cc.size(180, 80));
            caozuo.setName('caozuo');
            caozuo.setFontSize(20);
            caozuo.setTextColor(cc.color(0, 0, 0));
            // caozuo.enableOutline(cc.color(38, 38, 38), 1);
            caozuo.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            caozuo.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            // caozuo.setAnchorPoint(0.5, 1);
            caozuo.setPosition(cc.p(110, 30));
            cell.addChild(caozuo);
            //番数
            var fanshu = new ccui.Text();
            fanshu.setName('fanshu');
            fanshu.setFontSize(20);
            fanshu.setTextColor(cc.color(0, 0, 0));
            // fanshu.enableOutline(cc.color(38, 38, 38), 1);
            fanshu.setPosition(cc.p(265, 30));
            cell.addChild(fanshu);
            //上家
            var shangjia = new ccui.Text();
            shangjia.setName('shangjia');
            shangjia.setFontSize(20);
            shangjia.setTextColor(cc.color(0, 0, 0));
            // shangjia.enableOutline(cc.color(38, 38, 38), 1);
            shangjia.setPosition(cc.p(380, 30));
            cell.addChild(shangjia);
            //对家
            var duijia = new ccui.Text();
            duijia.setName('duijia');
            duijia.setFontSize(20);
            duijia.setTextColor(cc.color(0, 0, 0));
            // duijia.enableOutline(cc.color(38, 38, 38), 1);
            duijia.setPosition(cc.p(517, 30));
            cell.addChild(duijia);
            //下家
            var xiajia = new ccui.Text();
            xiajia.setName('xiajia');
            xiajia.setFontSize(20);
            xiajia.setTextColor(cc.color(0, 0, 0));
            // xiajia.enableOutline(cc.color(38, 38, 38), 1);
            xiajia.setPosition(cc.p(665, 30));
            cell.addChild(xiajia);
            //合计
            var heji = new ccui.Text();
            heji.setName('heji');
            heji.setFontSize(20);
            heji.setTextColor(cc.color(0, 0, 0));
            // heji.enableOutline(cc.color(38, 38, 38), 1);`
            heji.setPosition(cc.p(820, 30));
            cell.addChild(heji);
        },
        updateTableHeader: function () {
            var s0 = $('root.panel.bg.Sprite_3');
            var s1 = $('root.panel.bg.Sprite_4');
            var s2 = $('root.panel.bg.Sprite_5');

            var sj = $('root.panel.bg.Sprite_3');
            var dj = $('root.panel.bg.Sprite_4');
            var xj = $('root.panel.bg.Sprite_5')
            var me = $('root.panel.bg.js_me')
            sj.setVisible(false);
            dj.setVisible(false);
            xj.setVisible(false);
            me.setVisible(false);
            if (this.curTabIdx == 0) {
                sj.setPositionX(this.pos[0]);
                xj.setPositionX(this.pos[1]);
                sj.setVisible(true);
                xj.setVisible(true);
                // s0.setTexture(cc.textureCache.addImage('res/table/jisuan/js_sj.png'));
                // s1.setTexture(cc.textureCache.addImage('res/table/jisuan/js_xj.png'));
                // s2.setVisible(false);
            }
            else if (this.curTabIdx == 1) {
                me.setPositionX(this.pos[0]);
                sj.setPositionX(this.pos[1]);
                sj.setVisible(true);
                me.setVisible(true);
                // s0.setTexture(cc.textureCache.addImage('res/table/jisuan/js_me.png'));
                // s1.setTexture(cc.textureCache.addImage('res/table/jisuan/js_sj.png'));
                // s2.setVisible(false);
            }
            else if (this.curTabIdx == 2) {
                xj.setPositionX(this.pos[0]);
                me.setPositionX(this.pos[1]);
                xj.setVisible(true);
                me.setVisible(true);
                // s0.setTexture(cc.textureCache.addImage('res/table/jisuan/js_xj.png'));
                // s1.setTexture(cc.textureCache.addImage('res/table/jisuan/js_me.png'));
                // s2.setVisible(false);
            }
        },
        updateCell: function (cell, idx) {
            var caozuo = cell.getChildByName('caozuo');
            caozuo.setString(decodeURIComponent(this._playerdata[idx].op));
            var fanshu = cell.getChildByName('fanshu');
            fanshu.setString(this._playerdata[idx].e);

            var shangjia = cell.getChildByName('shangjia');
            shangjia.setString(this._strArr[idx][0]);

            var duijia = cell.getChildByName('duijia');
            duijia.setString(this._strArr[idx][1]);

            var xiajia = cell.getChildByName('xiajia');
            xiajia.setString(this._strArr[idx][2]);
            xiajia.setVisible(false);

            var heji = cell.getChildByName('heji');
            heji.setString(this._strArr[idx][3]);
            if (this._playerdata[idx].cellHeight) {
                caozuo.setPositionY(this._playerdata[idx].cellHeight / 2);
                fanshu.setPositionY(this._playerdata[idx].cellHeight / 2);
                shangjia.setPositionY(this._playerdata[idx].cellHeight / 2);
                duijia.setPositionY(this._playerdata[idx].cellHeight / 2);
                xiajia.setPositionY(this._playerdata[idx].cellHeight / 2);
                heji.setPositionY(this._playerdata[idx].cellHeight / 2);
            }
        },
        getOnePlayerData: function (playerid) {
            var playerdata;
            for (var dataone in this._data.bill) {
                if (dataone == playerid) {
                    playerdata = this._data.bill[dataone];
                    break;
                }
            }
            this._playerdata = playerdata;

            this.curSum = 0;
            $('root.panel.bg.txt_all').setString(this.curSum);

            this.updateTableHeader();

            var playerData = this._data.players[this.curTabIdx];
            // set pai arr  hu_pai_id
            for (var j = 1; j < 30; j++) {
                var pai = $('root.panel.bg.card_' + j);
                pai && pai.removeFromParent(true);
            }

            var paiArr = playerData['pai_arr'];
            var duiArr = playerData['dui_arr'];
            var paiIdArr = [];

            //杠牌1
            var gangIdArr = [];
            var gangIndexArr = [];
            var gangPosArr = [];

            _.remove(paiArr, function (n) {
                return n == 0;
            });

            paiArr.sort(function (a, b) {
                return a - b;
            });
            duiArr.sort(function (a, b) {
                if (a['pai_arr'][0] == b['pai_arr'][0]) {
                    if (a['pai_arr'][1] == b['pai_arr'][1])
                        return a['pai_arr'][2] - b['pai_arr'][2];
                    return a['pai_arr'][1] - b['pai_arr'][1];
                }
                return a['pai_arr'][0] - b['pai_arr'][0];
            });

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
                }
                if (dui.type == 4) {
                    paiIdArr.push(0);
                    paiIdArr.push(0);
                    paiIdArr.push(0);
                    // paiIdArr.push(dui['pai_arr'][0]);
                }
                //杠牌2
                if (dui.type == 3 || dui.type == 4) {
                    gangIdArr.push(dui['pai_arr'][0]);
                    gangIndexArr.push(paiIdArr.length - 2);
                }


                paiIdArr.push(-1);
            }

            for (var j = 0; j < paiArr.length; j++) {
                paiIdArr.push(paiArr[j]);
            }
            //把胡牌单独拿出来
            for (var huPid in this._data.hu_pai_map) {
                if (huPid == playerid) {
                    // for (var i = 0; i < this._data.hu_pai_map[huPid].length; i++) {
                    //     for (var j = 0; j < paiIdArr.length; j++) {
                    //         if (paiIdArr[j] && paiIdArr[j] == this._data.hu_pai_map[huPid][i]) {
                    //             paiIdArr.splice(j, 1);
                    //             break;
                    //         }
                    //     }
                    // }
                    paiIdArr.push(-1);
                    for (var i = 0; i < this._data.hu_pai_map[huPid].length; i++) {
                        paiIdArr.push(this._data.hu_pai_map[huPid][i]);
                    }
                    break;
                }
            }
            var a0 = $('root.panel.bg.card_' + 0);
            //a0.setScale(0.8);
            var gapNum = 0;
            var gapDistance = 20;
            //杠牌3
            var gangIndex = 0;

            for (var j = 0; j < paiIdArr.length; j++) {
                if (paiIdArr[j] == -1) {
                    gapNum++;
                    continue;
                }
                var pai = $('root.panel.bg.card_' + j);
                if (!pai) {
                    pai = duplicateSprite(a0);
                    pai.setName('card_' + j);
                    a0.getParent().addChild(pai);
                }

                //杠牌4
                if (gangIndexArr[gangIndex] == j) {
                    var x = a0.getPositionX() + a0.getContentSize().width * 0.932 * a0.getScaleX() * (j - gapNum) + gapNum * gapDistance;
                    var y = a0.getPositionY() + 13;
                    gangPosArr.push(cc.p(x, y));
                    gangIndex++;
                }


                pai.setPositionX(a0.getPositionX() + a0.getContentSize().width * 0.932 * a0.getScaleX() * (j - gapNum) + gapNum * gapDistance);
                var paiName = 'p2s' + paiIdArr[j] + '.png';
                setSpriteFrameByName(pai, paiName, 'pai');
            }

            //杠牌5
            var gangindex = paiIdArr.length;
            for (var j = 0; j < gangIdArr.length; j++) {
                var gang = $('root.panel.bg.card_' + gangindex);
                if (!gang) {
                    gang = duplicateSprite(a0);
                    gang.setName('card_' + gangindex);
                    gang.setPosition(gangPosArr[j]);
                    a0.getParent().addChild(gang);
                    var paiName = 'p2s' + gangIdArr[j] + '.png';
                    setSpriteFrameByName(gang, paiName, 'pai');
                }
                ;
                gangindex++;
            }
            // ===========================
            var map = [
                [2, 1, 0, 0],
                [0, 2, 0, 1],
                [1, 0, 0, 2]
                // [2, 1, 0, 0]
            ];
            for (var j = 0; j < this.myInitTaxIdx; j++)
                map.push(map.shift());

            var strArr = [];
            var valArr = [];
            var sum1 = 0;
            if (this._playerdata == null) return;
            for (var idx = 0; idx < this._playerdata.length; idx++) {
                strArr[idx] = valArr[idx] = [];

                var sum = 0;

                var t = this.curTabIdx;

                var str = this._playerdata[idx].s[map[t][0]] == -1000 ? '----' : this._playerdata[idx].s[map[t][0]] * -1;
                var val = (str == '----' ? 0 : str);
                strArr[idx][0] = (str);
                valArr[idx][0] = (val);
                sum += val;

                var str = this._playerdata[idx].s[map[t][1]] == -1000 ? '----' : this._playerdata[idx].s[map[t][1]] * -1;
                var val = (str == '----' ? 0 : str);
                strArr[idx][1] = (str);
                valArr[idx][1] = (val);
                sum += val;

                var str = this._playerdata[idx].s[map[t][2]] == -1000 ? '----' : this._playerdata[idx].s[map[t][2]] * -1;
                var val = (str == '----' ? 0 : str);
                strArr[idx][2] = (str);
                valArr[idx][2] = (val);
                // sum += val;

                sum1 += sum;
                strArr[idx][3] = (sum);
                valArr[idx][3] = (sum);
            }

            $('root.panel.bg.txt_all').setString(sum1);

            this._strArr = strArr;

            this._tableView.reloadData();
        }
    });

    exports.JiesuanSc3Layer = JiesuanSc3Layer;
})(window);
