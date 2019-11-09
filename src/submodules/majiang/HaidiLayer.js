(function () {
    var exports = this;

    var $ = null;

    var HaidiLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        onExit: function () {
            cc.Layer.prototype.onExit.call(this);
        },
        ctor: function () {
            this._super();

            var scene = loadNodeCCS(res.HaidipaiLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('root.panel.btn_ok'), function (node) {
                network.send(4051, {room_id: gameData.roomId, val: 1});
            });
            TouchUtils.setOnclickListener($('root.panel.btn_cancel'), function (node) {
                network.send(4051, {room_id: gameData.roomId, val: 0});
            });

            return true;
        },
        setArr: function (arr) {
            var haveISelected = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].uid == gameData.uid && arr[i].val) {
                    haveISelected = true;
                    break;
                }
            }
            var content = "请选择是否要海底牌, 优先级按以下顺序" + "\n\n";
            var selectedUid = {};
            for (var i = 0; i < arr.length; i++) {
                selectedUid[arr[i].uid] = true;
                content += "【" + gameData.playerMap[arr[i].uid].nickname + "】 " + (arr[i]['val'] ? "已选" : "等待选择") + "\n";
            }
            $('root.panel.lb_content').setString(content);

            if (haveISelected) {
                $('root.panel.btn_ok').setVisible(false);
                $('root.panel.btn_cancel').setVisible(false);
            }
        }
    });

    exports.HaidiLayer = HaidiLayer;
})(window);
