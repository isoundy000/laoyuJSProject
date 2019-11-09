/**
 * 设置簸簸数
 * Created by duwei on 2018/7/17.
 */
var SetBoBoShuWindow = cc.Layer.extend({
    ctor: function (data) {
        this._super();
        var rootNode = loadFile(this, epz_res.SetBoBoShuWindow_json);
        addModalLayer(rootNode);
        this.initWindow(data);
        this.addBtnTouch();
        return true;
    },
    //触摸事件
    addBtnTouch: function () {
        var self = this;
        TouchUtils.setOnclickListener(self['_btn_jian'], function () {
            if (self.currentProportion - self.difen >= self.minBoboNum) {
                self.currentProportion -= self.difen;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });
        TouchUtils.setOnclickListener(self['_btn_jia'], function () {
            if (self.currentProportion + self.difen <= self.totalBoboNum) {
                self.currentProportion += self.difen;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });

        TouchUtils.setOnclickListener(self['_btn_sifenyi'], function () {
            self.currentProportion = (Math.floor((self.totalBoboNum / 4) / self.difen)) * self.difen;
            if (self.currentProportion < self.minBoboNum) {
                self.currentProportion = self.minBoboNum;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });

        TouchUtils.setOnclickListener(self['_btn_sanfenyi'], function () {
            self.currentProportion = (Math.floor((self.totalBoboNum / 3) / self.difen)) * self.difen;
            if (self.currentProportion < self.minBoboNum) {
                self.currentProportion = self.minBoboNum;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });

        TouchUtils.setOnclickListener(self['_btn_yiban'], function () {
            self.currentProportion = (Math.floor((self.totalBoboNum / 2) / self.difen)) * self.difen;
            if (self.currentProportion < self.minBoboNum) {
                self.currentProportion = self.minBoboNum;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });

        TouchUtils.setOnclickListener(self['_btn_zuixiao'], function () {
            self.currentProportion = self.minBoboNum;
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });
        TouchUtils.setOnclickListener(self['_btn_zuida'], function () {
            self.currentProportion = self.totalBoboNum;
            self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
            self['_shuruNum'].setString(self.currentProportion);
        });
        TouchUtils.setOnclickListener(self['_btn_queren'], function () {
            network.send(4501, {room_id: gameData.roomId, boboNum: self.currentProportion});
            self.removeFromParent(true);
        });
    },
    /**
     * 初始化
     */
    initWindow: function (data) {
        var self = this;
        self.data = data;
        self.minBoboNum = data['minBoboNum'];
        self.totalBoboNum = data['totalBoboNum'];
        self.difen = data['difen'];
        self['_shenyuNum'].setString("剩余资产：" + data['totalBoboNum']);
        self['_text_zuixiao'].setString("最小买入：" + data['minBoboNum']);
        self['_text_zuida'].setString("最大买入：" + data['totalBoboNum']);
        if(data["cur_round"] == 0){
            self.currentProportion = (Math.floor((self.totalBoboNum / 4) / self.difen)) * self.difen;
        }else{
            self.currentProportion = self.minBoboNum;
        }
        if (self.currentProportion < self.minBoboNum) {
            self.currentProportion = self.minBoboNum;
        }
        self['_shuruNum'].setString(self.currentProportion);
        self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
        self['_setSlider'].addEventListener(function (sender, type) {
            switch (type) {
                case ccui.Slider.EVENT_PERCENT_CHANGED:
                    var percent = sender.getPercent();
                    var current = self.totalBoboNum / 100 * percent;
                    self.currentProportion = Math.round(current / self.difen) * self.difen;
                    if(self.currentProportion<self.minBoboNum){
                        self.currentProportion = self.minBoboNum;
                    }
                    self['_shuruNum'].setString(self.currentProportion);
                    self['_setSlider'].setPercent(self.currentProportion / self.totalBoboNum * 100);
                    break;
                default:
                    console.log("event : " + type);
                    break;
            }
        }, null);
        self.upBoboInfo(data);
    },
    upBoboInfo: function (data) {
        var self = this;
        self.playersSetBoboInfo = data['playersSetBoboInfo'] || [];
        for (var i = 0; i < self.playersSetBoboInfo.length; i++) {
            var info = self.playersSetBoboInfo[i];
            var item = self['_ListView']["index" + i];
            if (!item) {
                item = duplicateNode(self['_item']);
                self['_ListView']["index" + i] = item;
                self['_ListView'].pushBackCustomItem(item);
            }
            var playerInfo = gameData.getPlayerInfoByUid(info['uid']);
            cc.log(playerInfo);
            var name = ellipsisStr(_.trim(decodeURIComponent(playerInfo["nickname"])), 5);
            cc.log(name);
            var name2 = ellipsisStr(playerInfo["nickname"], 5);
            cc.log(name2);

            item['lb_name'].setString(name);
            loadImageToSprite(playerInfo["headimgurl"], item['head'], true);
            item['lb_maru'].setString(info['isSetBobo'] ? "已买入" : '未买入');
        }
    }
});