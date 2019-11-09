/**
 * Created by yu on 2018/8/31.
 */
(function () {
    var exports = this;

    var $ = null;

    var JBCLevelItem = cc.Layer.extend({
        layerHeight: 0,
        layerWidth: 0,
        itemColor: ['#b0ff6a',
            '#99d3ff',
            '#fffd9a',
            '#c6c2ff'],
        itemBg: ['field_bg_0.png',
            'field_bg_1.png',
            'field_bg_2.png',
            'field_bg_3.png',
            'field_bg_4.png'],
        ctor: function (data, level, parent) {
            this._super();

            var that = this;

            var scene = ccs.load(res.JBCLevelItem_json, 'res/');

            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.layerWidth = this.getChildByName("Layer").getBoundingBox().width;
            this.layerHeight = this.getChildByName("Layer").getBoundingBox().height;
            if (data) {
                $('item').setTexture('res/image/ui/pdk_jbc/' + this.itemBg[level]);
                $('item.lb_online').setTextColor(cc.color(this.itemColor[level - 1]));
                $('item.lb_online').setString(data['userNumOnline'] + '人在线');
                $('item.lb_coin').setString(getNumString(data['minGold']) + "-" + getNumString(data['maxGold']));
                if (level > 2) {
                    $('item.lb_coin').setString(getNumString(data['minGold']) + '以上');
                }
                $('item.lb_coin').x += 10;
                $('item.ft_basescore').setString(data['baseGold']);
            } else {
                console.log("---- no --");
            }

            var startPos = null;
            TouchUtils.setOntouchListener($('item'), undefined, {
                onTouchBegan: function (node, touch) {
                    startPos = node.convertToWorldSpace(cc.p(0, 0));
                },
                onTouchEnded: function (node, event) {
                    //记录时间 5秒以内只能点击一次
                    var time = new Date().getTime();
                    if (Math.abs(gameData.clickClubRoomTime - time) <= 1000) {
                        return;
                    }

                    network.send(3230, { gold_map_id: MAP_ID.PDK_JBC, gold_room_lev: level, map_id: MAP_ID.PDK_JBC });

                    // //先判断领奖励金了吗
                    // if(gameData.numOfCards[0] >= data['minGold']){
                    //     network.send(3230, {gold_map_id: MAP_ID.PDK_JBC, gold_room_lev: level});
                    // }else {
                    //     if(parent){
                    //         parent.setClickInfo(level, data['minGold']);
                    //     }
                    //     network.send(99998, {cmd: 'addEncourageCoin', area: 'niuniu'});
                    // }
                },
                swallowTouches: false
            });
            return true;
        },
        getLayerWidth: function () {
            return this.layerWidth;
        },
        getLayerHeight: function () {
            return this.layerHeight;
        }
    });

    exports.JBCLevelItem = JBCLevelItem;
})(window);