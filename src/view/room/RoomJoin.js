var RoomJoin = {
    init: function () {
        var that = this;
        this.btClose = getUI(this, 'btClose');
        addModalLayer(this);
        TouchUtils.setOnclickListener(this.btClose, function () {
            // that.hide(true);

            popHideAni(getUI(that, 'root'), function () {
                that.removeFromParent();
            });
        }, {sound: 'close'});

        popShowAni(getUI(this, 'root'), true);

        for (var i = 0; i < 12; i++) {
            (function (i) {
                var bt = getUI(that, 'bt' + i);
                bt.setTag(i);
                TouchUtils.setOnclickListener(bt, function () {
                    var tag = bt.getTag();
                    if (tag < 10) {
                        if (that.index < 6) {
                            that.txtList[that.index].setVisible(true);
                            //that.txtList[that.index].setTexture(that.numTextures[tag]);
                            that.txtList[that.index].setString(tag);
                            that.txtList[that.index].num = tag;
                            that.index++;
                        } else {
                            return;
                        }
                    } else if (tag == 10) {
                        that.index = 0;
                        for (var i = 0; i < 6; i++) {
                            that.txtList[i].setVisible(false);
                        }
                    } else if (tag == 11) {
                        that.index--;
                        if (that.index < 0) that.index = 0;
                        that.txtList[that.index].setVisible(false);
                    }
                    if (that.index >= 6) {
                        var roomId = '';
                        for (var i = 0; i < 6; i++) {
                            roomId += that.txtList[i].num;
                        }
                        that.roomId = roomId;

                        gameData.enterRoomWithClubID = 0;
                        showLoading('正在加入房间');
                        network.send(3002, {
                            room_id: '' + roomId
                        });
                    }
                });
            })(i);
        }
        // this.numTextures = [];
        // for(var i=0;i<=9;i++){
        //     this.numTextures[i] = cc.textureCache.addImage("res/image/ui/room2/" + i + ".png")
        // }

        this.txtList = [];
        this.index = 0;
        for (var i = 1; i < 7; i++) {
            var txt = getUI(this, 't' + i);
            txt.setTag(i);
            txt.setVisible(false);
            this.txtList.push(txt);
        }

        // network.addCustomListener(P.GS_Login, this.onRoleLoginOK.bind(this));

        return true;
    },

    //修改bug：房间满员之后，再有人加入房间，提示满员，点关闭后，再输入房间号，不显示房间号，
    onGetRoomInfo: function (data) {
        var that = this;
        data = JSON.parse(data);
        if (data.result == -1) {
            // HUD.showMessage("房间" + this.roomId +"不存在");
            HUD.showMessageBox('提示', '房间' + this.roomId + '不存在', function () {
                that.index = 0;
                for (var i = 0; i < 6; i++) {
                    that.txtList[i].setVisible(false);
                }
            }, true);
            HUD.removeLoading();
            return;
        }
        if (data.data.playList && data.data.playList.length > 0) {
            var inList = false;
            for (var i = 0; i < data.data.playList.length; i++) {
                if (data.data.playList[i] == gameData.uid) {
                    inList = true;
                    break;
                }
            }
            if (inList == false && data.data.playList.length == mRoom.getPlayerNum()) {
                HUD.showMessageBox('提示', '房间已经满员,请加入其他房间。', function () {
                }, true);
                that.index = 0;
                for (var i = 0; i < 6; i++) {
                    that.txtList[i].setVisible(false);
                }
                HUD.removeLoading();
                return;
            }
        }

        if (data.result == 0) {
            DC.wsHost = data.data.url;
            mRoom.roomId = data.data.roomid;
            gameData.roomId = mRoom.roomId;
            mRoom.oldRoom = 0;
            var option = data.data.option;
            var obj = decodeHttpData(option);

            mRoom.rounds = obj.rounds;
            mRoom.getWanfa(obj);
            mRoom.ownner = data.data.ownner;
            DC.wsConnect(this);
        }
    },
};