(function () {
    var exports = this;

    var $ = null;


    var JiesuanDetailScLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function (data, curTabIdx) {
            this.data = data;
            this.curTabIdx = curTabIdx;
            this._super();

            var that = this;

            var size = cc.winSize;

            var scene = loadNodeCCS(res.JiesuanDetailScLayer_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));
            //关闭按钮
            var closeFunc = function () {
                that.removeFromParent(true);
            };
            TouchUtils.setOnclickListener($('root.panel.bg.btn_back'), closeFunc);
            TouchUtils.setOnclickListener($('root.panel.bg.btn_next'), function(){
                that.removeFromParent(true);
            });
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
            tableView.reloadData();
            this._tableView = tableView;
            //总计
            var heji = [0, 0, 0, 0];
            for (var i = 0;i < this.data.length; i++){
                heji[0] = heji[0] + (this.data[i].s[0] == -1000 ? 0 : this.data[i].s[0]);
                heji[1] = heji[1] + (this.data[i].s[1] == -1000 ? 0 : this.data[i].s[1]);
                heji[2] = heji[2] + (this.data[i].s[2] == -1000 ? 0 : this.data[i].s[2]);
                heji[3] = heji[3] + (this.data[i].s[3] == -1000 ? 0 : this.data[i].s[3]);
            }
            for(var i = 0; i < 4 ;i++){
                $('root.panel.bg.zongji_' + (i+1)).setString(heji[i])
            }
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
            return cc.size(tableViewSize.width, 50);
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
            return this.data.length;
        },
        createCell: function (cell, idx){
            //操作
            var caozuo =  new ccui.Text();
            caozuo.setName('caozuo');
            caozuo.setFontSize(20);
            caozuo.setTextColor(cc.color(0, 0, 0));
            // caozuo.enableOutline(cc.color(38, 38, 38), 1);
            caozuo.setAnchorPoint(0.5, 0.5);
            caozuo.setPosition(cc.p(100, 30));
            cell.addChild(caozuo);
            //番数
            var fanshu =  new ccui.Text();
            fanshu.setName('fanshu');
            fanshu.setFontSize(20);
            fanshu.setTextColor(cc.color(0, 0, 0));
            // fanshu.enableOutline(cc.color(38, 38, 38), 1);
            fanshu.setPosition(cc.p(300, 30));
            cell.addChild(fanshu);
            //上家
            var shangjia =  new ccui.Text();
            shangjia.setName('shangjia');
            shangjia.setFontSize(20);
            shangjia.setTextColor(cc.color(0, 0, 0));
            // shangjia.enableOutline(cc.color(38, 38, 38), 1);
            shangjia.setPosition(cc.p(500, 30));
            cell.addChild(shangjia);
            //对家
            var duijia =  new ccui.Text();
            duijia.setName('duijia');
            duijia.setFontSize(20);
            duijia.setTextColor(cc.color(0, 0, 0));
            // duijia.enableOutline(cc.color(38, 38, 38), 1);
            duijia.setPosition(cc.p(690, 30));
            cell.addChild(duijia);
            //下家
            var xiajia =  new ccui.Text();
            xiajia.setName('xiajia');
            xiajia.setFontSize(20);
            xiajia.setTextColor(cc.color(0, 0, 0));
            // xiajia.enableOutline(cc.color(38, 38, 38), 1);
            xiajia.setPosition(cc.p(900, 30));
            cell.addChild(xiajia)
            //合计
            var heji =  new ccui.Text();
            heji.setName('heji');
            heji.setFontSize(20);
            heji.setTextColor(cc.color(0, 0, 0));
            // heji.enableOutline(cc.color(38, 38, 38), 1);
            heji.setPosition(cc.p(1090, 30));
            cell.addChild(heji);
        },
        updateCell: function (cell, idx){
            var caozuo = cell.getChildByName('caozuo');
            caozuo.setString(decodeURIComponent(this.data[idx].op));
            var fanshu = cell.getChildByName('fanshu');
            fanshu.setString(this.data[idx].e);
            var shangjia = cell.getChildByName('shangjia');
            shangjia.setString((this.data[idx].s[0] == -1000 ? 0 : this.data[idx].s[0]));
            var duijia = cell.getChildByName('duijia');
            duijia.setString((this.data[idx].s[1] == -1000 ? 0 : this.data[idx].s[1]));
            var xiajia = cell.getChildByName('xiajia');
            xiajia.setString((this.data[idx].s[2] == -1000 ? 0 : this.data[idx].s[2]));
            var heji = cell.getChildByName('heji');
            heji.setString((this.data[idx].s[3] == -1000 ? 0 : this.data[idx].s[3]));
        }
    });

    exports.JiesuanDetailScLayer = JiesuanDetailScLayer;
})(window);
