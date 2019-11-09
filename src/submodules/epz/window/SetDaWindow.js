/**
 * Created by duwei on 2018/7/26.
 */
var SetDaWindow = cc.Layer.extend({
    ctor: function (data, room) {
        this._super();
        this.room = room;
        this.data = data;
        var rootNode = loadFile(this, epz_res.SetDaWindow_json);
        addModalLayer(rootNode);
        this.initWindow(this.data);
        this.addBtnTouch();
        return true;
    },
    //触摸事件
    addBtnTouch: function () {
        var self = this;
        TouchUtils.setOnclickListener(self['_btn_jian'], function () {
            if (self.maxProportion < 0) {
                return;
            }
            if (self.currentProportion - self.difen >= 0) {
                self.currentProportion -= self.difen;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.maxProportion * 100);
            self['_shuruNum'].setString(self.currentProportion + self.minBoboNum);
        });
        TouchUtils.setOnclickListener(self['_btn_jia'], function () {
            if (self.maxProportion < 0) {
                return;
            }
            if (self.currentProportion + self.difen <= self.maxProportion) {
                self.currentProportion += self.difen;
            }
            self['_setSlider'].setPercent(self.currentProportion / self.maxProportion * 100);
            self['_shuruNum'].setString(self.currentProportion + self.minBoboNum);
        });
        TouchUtils.setOnclickListener(self['_btn_queding'], function () {
            network.send(4502, {
                room_id: gameData.roomId,
                op: self.room.opType.DA,
                ratio: self.currentProportion + self.minBoboNum
            });
            self.removeFromParent(true);
        });
        TouchUtils.setOnclickListener(self['_btn_quxiao'], function () {
            self.room.showOps(self.room.originalPos, self.room.codeData4500);
            self.removeFromParent(true);
        });
    },
    /**
     * 初始化
     */
    initWindow: function (data) {
        var self = this;
        self.minBoboNum = data['difen'];
        self.totalBoboNum = data['da'];
        self.maxProportion = self.totalBoboNum - self.minBoboNum;
        self.currentProportion = 0;
        self.difen = data['difen'];
        if (self.maxProportion > 0) {
            self['_shuruNum'].setString(self.currentProportion + self.minBoboNum);
            self['_setSlider'].addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.Slider.EVENT_PERCENT_CHANGED:
                        var percent = sender.getPercent();
                        var current = self.maxProportion / 100 * percent;
                        self.currentProportion = Math.round(current / self.difen) * self.difen;
                        self['_shuruNum'].setString(self.currentProportion + self.minBoboNum);
                        self['_setSlider'].setPercent(self.currentProportion / self.maxProportion * 100);
                        break;
                    default:
                        console.log('event : ' + type);
                        break;
                }
            }, null);
            self['_setSlider'].setPercent(self.currentProportion / self.maxProportion * 100);
        } else {
            self.currentProportion = self.minBoboNum;
            self['_shuruNum'].setString(self.currentProportion);
            self['_setSlider'].setPercent(100);
        }
    }
});