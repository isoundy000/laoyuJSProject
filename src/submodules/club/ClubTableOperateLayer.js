/**
 * Created by hjx on 2018/3/6.
 */
(function () {
    var exports = this;

    var $ = null;

    var ClubTableOperateLayer = cc.Layer.extend({
        ctor: function (data) {
            this._super();

            var Layer = ccs.load(res.ClubTalbeOperateLayer_json, 'res/');
            this.addChild(Layer.node);
            $ = create$(this.getChildByName("Layer"));

            var that = this;
            $('posNode.ti_bg').setVisible(false);
            this.usersList = [];
            for (var i = 0; i < data.uids.length; i++) {
                this.usersList.push([data.uids[i], data.nicknames[i], data.heads[i]]);
            }

            TouchUtils.setOnclickListener($('posNode.btn_ingame'), function (node) {
                showLoading();
                network.send(3002, {
                    room_id: '' + data.room_id
                });
            });
            TouchUtils.setOnclickListener($('posNode.btn_jiesan'), function (node) {
                if (data.status == 1) {
                    alert22("是否确定解散该房间？", function () {
                        showLoading("请求中请稍候..");
                        network.send(3003, {daikai_room_id: data['room_id'], force: true});
                    }, function () {
                    }, 'noAnimation');
                } else {
                    alert11('游戏进行中 不可以解散', 'noAnimation');
                }
            });
            TouchUtils.setOnclickListener($('posNode.btn_tiplayer'), function (node) {
                if (data.status == 1) {
                    $('posNode.ti_bg').setVisible(true);
                    if (that.tableview) {
                        tableViewRefresh(that.tableview);
                    } else {
                        var tableviewLayer = $('posNode.ti_bg.ScrollView');
                        var tableview = new cc.TableView(that, cc.size(tableviewLayer.getContentSize().width,
                            tableviewLayer.getContentSize().height));
                        tableview.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                        tableview.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
                        tableview.x = 0;
                        tableview.y = 0;
                        tableview.setDelegate(that);
                        tableview.setBounceable(true);
                        tableviewLayer.addChild(tableview);
                        that.tableview = tableview;
                        that.showDeleteBtn = false;
                    }
                } else {
                    alert11('游戏进行中 不可以踢出玩家', 'noAnimation');
                }
            });
            TouchUtils.setOnclickListener($('root'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('posNode.choose_bg'), function () {
            });
            TouchUtils.setOnclickListener($('posNode.ti_bg'), function () {
            });
            return true;
        },
        tableCellTouched: function (table, cell) {
        },
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(450, 79);
        },
        tableCellAtIndex: function (table, idx) {
            var cell = table.dequeueCell();
            if (cell == null) {
                cell = new cc.TableViewCell();
                var row0 = ccs.load(res.ClubTableOpeItem_json, 'res/').node;
                row0.setName('cellrow');
                row0.setVisible(true);
                cell.addChild(row0);
            }
            this.initUserCell(cell, idx);
            return cell;
        },
        numberOfCellsInTableView: function (table) {
            return this.usersList.length;
        },
        initUserCell: function (cell, i) {
            var that = this;
            var node = cell.getChildByName('cellrow');
            if (!node)  return;
            var userInfo = this.usersList[i];
            $('row1.lb_name', node).setString(userInfo[1]);
            TouchUtils.setOnclickListener($('row1.btn_ti', node), function (node) {
            });
        }
    });

    exports.ClubTableOperateLayer = ClubTableOperateLayer;
})(window);