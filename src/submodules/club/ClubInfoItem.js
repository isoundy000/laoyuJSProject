/**
 * Created by hjx on 2018/2/7.
 */
(function () {
    var exports = this;

    var $ = null;
    var clubmainlayer = null;
    var ClubInfoItem = cc.Layer.extend({
        layerHeight: 0,
        ctor: function (data, cl) {
            this._super();

            clubmainlayer = cl;

            var that = this;

            var scene = ccs.load(res.ClubInfoItem_json, 'res/');
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.layerWidth = this.getChildByName("Layer").getBoundingBox().width;

            $('lb_name').setString(ellipsisStr(data.name, 10));
            $('lb_qz').setString(ellipsisStr(data.nick, 5));
            $('lb_id').setString("" + data._id);
            $('lb_players').setString(data.players_count || '');
            $('lb_count').setString(data.players_count || '');
            loadImage(data.head, $('head'));

            TouchUtils.setOnclickListener($('btn_in_club'), function () {
                that.enterClub(data._id);
            }, {swallowTouches: false});
            return true;
        },
        getLayerWidth: function () {
            return this.layerWidth;
        },
        enterClub: function (clubId) {
            var clayer = clubmainlayer.getChildByName('ctlayer');
            if (!clayer) {
                var ctlayer = new ClubTablesLayer(clubId);
                ctlayer.setName('ctlayer');
                clubmainlayer.addChild(ctlayer);
            }

        }
    });

    var ClubTableItem = cc.TableViewCell.extend({
        layerHeight: 0,
        layerWidth: 0,
        roomInfo1: null,
        roomInfo2: null,
        posArr3: [],
        posArr6: [],
        posArr7: [],
        posArr9: [],
        ctor: function (data1, data2, pos, count, idx, owner_uid, parent, inRoomLayer) {
            this._super();

            this.posArr3 = [cc.p(120, 200),cc.p(191, 85), cc.p(37, 85)];
            this.posArr6 = [cc.p(23, 191),cc.p(164, 222), cc.p(297, 189),
                cc.p(294, 75),cc.p(163, 56), cc.p(37, 78)];
            this.posArr7 = [cc.p(131, 215),cc.p(206, 215), cc.p(303, 194),
                cc.p(302, 108),cc.p(164, 86), cc.p(34, 77),
                cc.p(27, 200)];
            this.posArr9 = [cc.p(91, 215),cc.p(163, 215), cc.p(238, 214),
                cc.p(306, 186),cc.p(282, 86), cc.p(206, 69),
                cc.p(127, 69),cc.p(44, 77), cc.p(35, 173)];

            var that = this;
            var scene = null;
            if (count <= 4){
                scene = ccs.load(res.ClubTableItem_json, "res/");
            } else {
                scene = ccs.load(res.ClubTableItem4_json, "res/");
            }

            if (data1['roomInfo']) {
                this.roomInfo1 = data1['roomInfo'];
                data1 = data1['roomData'];
            }

            if (data2['roomInfo']) {
                this.roomInfo2 = data2['roomInfo'];
                data2 = data2['roomData'];
            }


            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.layerWidth = this.getChildByName("Layer").getBoundingBox().width;
            this.layerHeight = this.getChildByName("Layer").getBoundingBox().height;

            if (data1) {
                var playersNum = data1['max_player_cnt'];
                this.setTableDesk(data1, 1, playersNum);
            } else {
                if (this.roomInfo1) {
                    this.setTableDesk(this.roomInfo1, 1);
                } else {
                    this.setTableDesk(this.roomInfo1, 1, count);
                }
            }
            if (data2) {
                var playersNum = data2['max_player_cnt'];
                this.setTableDesk(data2, 2, playersNum);
            } else {
                if (pos == 5){
                    $('table1').setVisible(false);
                }
                if (this.roomInfo2) {
                    this.setTableDesk(this.roomInfo2, 2);
                } else {
                    this.setTableDesk(this.roomInfo2, 2, count);
                }
            }

            // $('table0.desk_num').setString(2 * idx + 1);
            // $('table1.desk_num').setString(2 * idx + 2);
            $('table0.desk_num').setVisible(false);
            $('table1.desk_num').setVisible(false);
            $('table0.num_bg').setVisible(false);
            $('table1.num_bg').setVisible(false);


            var startPos = null;
            TouchUtils.setOntouchListener($('table0'), undefined, {
                onTouchBegan: function (node, touch) {
                    startPos = node.convertToWorldSpace(cc.p(0, 0));
                },
                onTouchEnded: function (node, event) {
                    //判断是否禁玩
                    var clubInfo = getClubData(Currentclubid());
                    var black_list = clubInfo.black_list || [];
                    if(black_list.length > 0){
                        var isfind =  _.filter(black_list, function (uid) {
                            return  gameData.uid == uid;
                        });
                        if(isfind.length > 0){
                            alert11("你已被管理员禁玩,请联系管理员");
                            return;
                        }
                    }


                    var time = new Date().getTime();
                    if (Math.abs(gameData.clickClubRoomTime - time) <= 1000) {
                        return;
                    }
                    gameData.clickClubRoomTime = time;
                    gameData.enterRoomWithClubID = clubInfo._id || clubInfo.club_id;
                    var endPos = node.convertToWorldSpace(cc.p(0, 0));
                    // if (owner_uid == gameData.uid && data1 && data1.room_id) {
                    //     parent.showRoomSetting(data1, endPos, owner_uid, inRoomLayer);
                    //     return;
                    // }
                    if (Math.abs(endPos.x - startPos.x) <= 50) {
                        if (inRoomLayer) {
                            if (data1 && data1.room_id == gameData.roomId) {
                                parent.showRoomSetting(data1, endPos, gameData.uid, inRoomLayer);
                            } else {
                                if (gameData.mapId < 300) {
                                    alert22('是否退出当前房间, 加入其他房间？', function () {
                                        network.send(3003, {room_id: gameData.roomId});
                                    }, null, false, true, true);
                                } else {
                                    alert22('是否退出当前房间, 加入其他房间？', function () {
                                        network.sendPhz(3003, "Quit/" + gameData.roomId);
                                    }, null, false, true, true);
                                }
                            }
                            return;
                        }
                        if (data1 && data1.room_id) {
                            var  func = function(){
                                showLoading('正在加入房间');
                                network.send(3002, {
                                    room_id: '' + data1.room_id
                                });
                            }
                            if ( pos == 5 ){
                                parent.addChild(new ClubEnterGame(data1,func));
                            }else{
                                func()
                            }
                        } else {
                            var info = that.roomInfo1;
                            if (!info) {
                                info = getClubCurrentWanfaInfo();
                            }
                            if (info) {
                                var options = info.options;
                                if (_.isString(options)) {
                                    options = JSON.parse(options)
                                }
                                options.pos = pos;
                                options.place = 2 * idx;
                                console.log('options.place : ========== : ' + options.place);
                                options.desp = info.desc;
                                if (options['wanjiarenshu0'])
                                    delete options['wanjiarenshu0'];
                                if (options['wanjiarenshu1'])
                                    delete options['wanjiarenshu1'];
                                if (options['wanjiarenshu2'])
                                    delete options['wanjiarenshu2'];
                                showLoading('正在加入房间');

                                var last3001Data = {
                                    room_id: 0
                                    , club_id: options['club_id']
                                    , map_id: options['mapid']//gameData.appId
                                    , mapid: options['mapid']
                                    , daikai: true
                                    , options: options
                                    , timestamp: getCurrentTimeMills()
                                }
                                gameData.last3001Data = last3001Data;
                                network.send(3001, last3001Data);
                                // console.log(options); console.log("玩法说明：");
                            }
                        }
                    }
                },
                swallowTouches: false
            });
            TouchUtils.setOntouchListener($('table1'), undefined, {
                onTouchBegan: function (node, touch) {
                    startPos = node.convertToWorldSpace(cc.p(0, 0));
                },
                onTouchEnded: function (node, event) {
                    //判断是否禁玩
                    var clubInfo = getClubData(Currentclubid());
                    var black_list = clubInfo.black_list || [];
                    if(black_list.length > 0){
                        var isfind =  _.filter(black_list, function (uid) {
                            return  gameData.uid == uid;
                        });
                        if(isfind.length > 0){
                            alert11("你已被管理员禁玩,请联系管理员");
                            return;
                        }
                    }

                    var time = new Date().getTime();
                    if (Math.abs(gameData.clickClubRoomTime - time) <= 1000) {
                        return;
                    }
                    gameData.clickClubRoomTime = time;
                    gameData.enterRoomWithClubID = clubInfo._id || clubInfo.club_id;
                    var endPos = node.convertToWorldSpace(cc.p(0, 0));
                    // if (owner_uid == gameData.uid && data2 && data2.room_id) {
                    //     parent.showRoomSetting(data2, endPos, owner_uid, inRoomLayer);
                    //     return;
                    // }
                    if (Math.abs(endPos.x - startPos.x) <= 50) {
                        if (inRoomLayer) {
                            if (data2 && data2.room_id == gameData.roomId) {
                                //是我所在的房间 ，返回和解散处理
                                parent.showRoomSetting(data2, endPos, gameData.uid, inRoomLayer);
                            } else {
                                if (gameData.mapId < 300) {
                                    alert22('是否退出当前房间, 加入其他房间？', function () {
                                        network.send(3003, {room_id: gameData.roomId});
                                    }, null, false, true, true);
                                } else {
                                    alert22('是否退出当前房间, 加入其他房间？', function () {
                                        network.sendPhz(3003, "Quit/" + gameData.roomId);
                                    }, null, false, true, true);
                                }
                            }
                            return;
                        }
                        if (data2 && data2.room_id) {
                            var  func = function(){
                                showLoading('正在加入房间');
                                network.send(3002, {
                                    room_id: '' + data2.room_id
                                });
                            }
                            if ( pos == 5 ){
                                parent.addChild(new ClubEnterGame(data2,func));
                            }else{
                                func()
                            }
                        } else {
                            var info = that.roomInfo2;
                            if (!info) {
                                info = getClubCurrentWanfaInfo();
                            }
                            if (info) {
                                var options = info.options;
                                if (_.isString(options)) {
                                    options = JSON.parse(options)
                                }
                                options.pos = pos;
                                options.place = 2 * idx + 1;
                                console.log('options.place : ========== : ' + options.place);
                                options.desp = info.desc;
                                if (options['wanjiarenshu0'])
                                    delete options['wanjiarenshu0'];
                                if (options['wanjiarenshu1'])
                                    delete options['wanjiarenshu1'];
                                if (options['wanjiarenshu2'])
                                    delete options['wanjiarenshu2'];
                                showLoading('正在加入房间');

                                var last3001Data =  {
                                    room_id: 0
                                    , club_id: options['club_id']
                                    , map_id: options['mapid']//gameData.appId
                                    , mapid: options['mapid']
                                    , daikai: true
                                    , options: options
                                    , timestamp: getCurrentTimeMills()
                                }
                                gameData.last3001Data = last3001Data;
                                network.send(3001, last3001Data);
                            }
                        }
                    }
                },
                swallowTouches: false
            });

            if (data1 && data1.room_id) {
                $('table0.lb_num').setString("房号 " + data1.room_id);
                $('table0.lb_num').setVisible(true);
                $('table0.lb_num').setPositionX($('table0').getContentSize().width/2);
                var options = data1.option;
                if (_.isString(data1.option)) {
                    options = JSON.parse(options)
                }
                if (data1.status == 2) {
                    $('table0.lb_progress').setVisible(true);
                    $('table0.lb_progress').setString((data1.map_id >= 300 ? (!data1.used ? 1 : (data1.used + 1)) : data1.used)
                        + '/' + (options.rounds || options.jushu));
                } else {
                    $('table0.lb_progress').setVisible(false);
                }
                // $('table.Text_5').setString("局数:" +0+"/"+(options.jushu || options.rounds));
                if (data1.status == 1) {
                    $('table0.state').setVisible(false);
                    $('table0.state').setTexture('res/submodules/club/img/icon_wait.png');
                } else {
                    $('table0.state').setTexture('res/submodules/club/img/icon_start.png');
                    $('table0.state').setVisible(false);
                }
                for (var i = 1; i <= 9; i++) {
                    if (!$('table0.row' + i))break;
                    $('table0.row' + i).setVisible(false);
                }
                for (var i = 1; i <= data1.nicknames.length; i++) {
                    if ($('table0.row' + i)) {
                        $('table0.row' + i).setVisible(true);
                        // loadImageSprite(data1.heads[i - 1], $('table0.row' + i + '.head'), 30);
                        loadImage(data1.heads[i - 1], $('table0.row' + i + '.head'));
                        $('table0.row' + i + '.lb_name').setString(ellipsisStr(data1.nicknames[i - 1], 5));
                    } else {
                        break;
                    }
                }
            } else {
                $('table0.state').setVisible(true);
                $('table0.lb_num').setVisible(false);
                $('table0.lb_progress').setVisible(false);
                for (var i = 1; i <= 9; i++) {
                    if (!$('table0.row' + i))break;
                    $('table0.row' + i).setVisible(false);
                }
                $('table0.state').setTexture('res/submodules/club/img/icon_wait.png');
            }

            if (data2 && data2.room_id) {
                // if(!cc.sys.isNative) console.log("ClubTableItem ------club info ");
                // if(!cc.sys.isNative) console.log(data1);
                $('table1.lb_num').setString("房号 " + data2.room_id);
                $('table1.lb_num').setVisible(true);
                $('table1.lb_num').setPositionX($('table1').getContentSize().width/2);
                var options = data2.option;
                if (_.isString(data2.option)) {
                    options = JSON.parse(options)
                }
                if (data2.status == 2) {
                    $('table1.lb_progress').setVisible(true);
                    $('table1.lb_progress').setString((data2.map_id >= 300 ? (!data2.used ? 1 : (data2.used + 1)) : data2.used)
                        + '/' + (options.rounds || options.jushu));
                } else {
                    $('table1.lb_progress').setVisible(false);
                }
                // $('table.Text_5').setString("局数:" +0+"/"+(options.jushu || options.rounds));
                if (data2.status == 1) {
                    $('table1.state').setVisible(false);
                    $('table1.state').setTexture('res/submodules/club/img/icon_wait.png');
                } else {
                    $('table1.state').setTexture('res/submodules/club/img/icon_start.png');
                    $('table1.state').setVisible(false);
                }
                for (var i = 1; i <= 9; i++) {
                    if (!$('table1.row' + i))break;
                    $('table1.row' + i).setVisible(false);
                }
                for (var i = 1; i <= data2.nicknames.length; i++) {
                    if ($('table1.row' + i)) {
                        $('table1.row' + i).setVisible(true);
                        // loadImageSprite(data2.heads[i - 1], $('table1.row' + i + '.head'), 30);
                        loadImage(data2.heads[i - 1], $('table1.row' + i + '.head'));
                        $('table1.row' + i + '.lb_name').setString(ellipsisStr(data2.nicknames[i - 1], 5));
                    } else {
                        break;
                    }
                }
            } else {
                // if(!cc.sys.isNative) console.log("---- no --");
                $('table1.state').setVisible(true);
                $('table1.lb_num').setVisible(false);
                $('table1.lb_progress').setVisible(false);
                for (var i = 1; i <= 9; i++) {
                    if (!$('table1.row' + i))break;
                    $('table1.row' + i).setVisible(false);
                }
                $('table1.state').setTexture('res/submodules/club/img/icon_wait.png');
            }

            return true;
        },
        getDeskNum: function(desc, map_id){
            var maxPlayerCnt = 4;
            if(map_id == MAP_ID.NN || map_id == MAP_ID.DN || map_id == MAP_ID.DN_JIU_REN || map_id == MAP_ID.DN_AL_TUI || map_id == MAP_ID.DN_WUHUA_CRAZY){
                if (desc.indexOf('六人') >= 0) {
                    maxPlayerCnt = 6;
                }else if (desc.indexOf('九人') >= 0) {
                    maxPlayerCnt = 9;
                }
                return maxPlayerCnt;
            }
            if (desc.indexOf('二人') >= 0 || desc.indexOf('2人') >= 0 || desc.indexOf('两人') >= 0) {
                maxPlayerCnt = 2;
            } else if (desc.indexOf('三人') >= 0 || desc.indexOf('3人') >= 0) {
                maxPlayerCnt = 3;
            } else if (desc.indexOf('四人') >= 0 || desc.indexOf('4人') >= 0) {
                maxPlayerCnt = 4;
            }else if (desc.indexOf('五人') >= 0 || desc.indexOf('5人') >= 0) {
                maxPlayerCnt = 5;
            }else if (desc.indexOf('六人') >= 0 || desc.indexOf('6人') >= 0) {
                maxPlayerCnt = 6;
            }else if (desc.indexOf('七人') >= 0 || desc.indexOf('7人') >= 0) {
                maxPlayerCnt = 7;
            }else if (desc.indexOf('九人') >= 0 || desc.indexOf('9人') >= 0) {
                maxPlayerCnt = 9;
            }
            return maxPlayerCnt;
        },
        setTableDesk: function (data, type, playersNum) {
            var playerCount = 4;
            var wanfaObj = data;

            if (wanfaObj && wanfaObj['desc']) {
                playerCount = this.getDeskNum(wanfaObj['desc'], wanfaObj.map_id);
            }
            if (wanfaObj && wanfaObj['desc']) {
                playerCount = this.getDeskNum(wanfaObj['desc'], wanfaObj.map_id);
            }
            if (wanfaObj && wanfaObj['wanfa']) {
                playerCount = this.getDeskNum(wanfaObj['wanfa'], wanfaObj.map_id);
            }
            if (playersNum <= 9)
                playerCount = playersNum;

            if(playerCount > 7) {
                if (type == 1){
                    $('table0').setTexture('res/submodules/club/img/table_for_9.png');
                    for(var s=0;s<9;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(true);
                            $('table0.row' + (s + 1)).setPosition(this.posArr9[s]);
                        }
                    }
                } else{
                    $('table1').setTexture('res/submodules/club/img/table_for_9.png');
                    for(var s=0;s<9;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(true);
                            $('table1.row' + (s + 1)).setPosition(this.posArr9[s]);
                        }
                    }
                }
            } else if(playerCount == 7){
                if (type == 1){
                    $('table0').setTexture('res/submodules/club/img/table_for_7.png');
                    for(var s=0;s<7;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(true);
                            $('table0.row' + (s + 1)).setPosition(this.posArr7[s]);
                        }
                    }
                    for(var s=7;s<9;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(false);
                        }
                    }
                } else{
                    $('table1').setTexture('res/submodules/club/img/table_for_7.png');
                    for(var s=0;s<7;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(true);
                            $('table1.row' + (s + 1)).setPosition(this.posArr7[s]);
                        }
                    }
                    for(var s=7;s<9;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(false);
                        }
                    }
                }
            } else if(playerCount == 6){
                if (type == 1){
                    $('table0').setTexture('res/submodules/club/img/table_for_6.png');
                    for(var s=0;s<6;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(true);
                            $('table0.row' + (s + 1)).setPosition(this.posArr6[s]);
                        }
                    }
                    for(var s=6;s<9;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(false);
                        }
                    }
                } else{
                    $('table1').setTexture('res/submodules/club/img/table_for_6.png');
                    for(var s=0;s<6;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(true);
                            $('table1.row' + (s + 1)).setPosition(this.posArr6[s]);
                        }
                    }
                    for(var s=6;s<9;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(false);
                        }
                    }
                }
            } else if (playerCount == 5) {
                if (type == 1){
                    if($('table0.row5')) {
                        $('table0.row5').setPosition(this.posArr6[5]);
                        $('table0').setTexture('res/submodules/club/img/table_for_5.png');
                    }
                    for(var s=0;s<5;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(true);
                            $('table0.row' + (s + 1)).setPosition((s == 4) ? this.posArr6[5] : this.posArr6[s]);
                        }
                    }
                    for(var s=5;s<9;s++){
                        if($('table0.row' + (s+1))) {
                            $('table0.row' + (s + 1)).setVisible(false);
                        }
                    }
                } else{
                    if($('table1.row5')) {
                        $('table1.row5').setPosition(this.posArr6[5]);
                        $('table1').setTexture('res/submodules/club/img/table_for_5.png');
                    }
                    for(var s=0;s<5;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(true);
                            $('table1.row' + (s + 1)).setPosition((s == 4) ? this.posArr6[5] : this.posArr6[s]);
                        }
                    }
                    for(var s=5;s<9;s++){
                        if($('table1.row' + (s+1))) {
                            $('table1.row' + (s + 1)).setVisible(false);
                        }
                    }
                }
            } else if (playerCount == 4) {
                if (type == 1) {
                    $('table0').setTexture('res/submodules/club/img/table_for_4.png');
                } else {
                    $('table1').setTexture('res/submodules/club/img/table_for_4.png');
                }
            } else if (playerCount == 3) {
                if (type == 1) {
                    $('table0').setTexture('res/submodules/club/img/table_for_3.png');
                    $('table0.row1').setPosition(this.posArr3[0]);
                    $('table0.row2').setPosition(this.posArr3[1]);
                    $('table0.row3').setPosition(this.posArr3[2]);
                } else {
                    $('table1').setTexture('res/submodules/club/img/table_for_3.png');
                    $('table1.row1').setPosition(this.posArr3[0]);
                    $('table1.row2').setPosition(this.posArr3[1]);
                    $('table1.row3').setPosition(this.posArr3[2]);
                }
            } else if (playerCount == 2) {
                if (type == 1) {
                    $('table0.row1').setPosition($('table0.row1').getPosition());
                    $('table0.row2').setPosition($('table0.row3').getPosition());
                    $('table0').setTexture('res/submodules/club/img/table_for_2.png');
                } else {
                    $('table1').setTexture('res/submodules/club/img/table_for_2.png');
                    $('table1.row1').setPosition($('table1.row1').getPosition());
                    $('table1.row2').setPosition($('table1.row3').getPosition());
                }

            }
        },

        getLayerWidth: function () {
            return this.layerWidth;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        }
    });

    exports.ClubInfoItem = ClubInfoItem;
    exports.ClubTableItem = ClubTableItem;
})(window);