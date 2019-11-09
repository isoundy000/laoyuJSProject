/**
 * Created by wangchangchun on 16/7/6.
 */
var HistoryDetail = {
    init: function () {
        var that = this;
        this.btBack = getUI(this, "btBack");
        this.scrollview = getUI(this, "tableviewLayer");
        this.scroll = getUI(this, "scrollview");
        this.scroll.setVisible(false);
        this.bg_cell = getUI(this, "bg_cell");
        //this.bg_cell.setVisible(false);
        var zongji = getUI(this, 'zongji');
        zongji.setVisible(false);

        TouchUtils.setOnclickListener(this.btBack, function () {
            that.removeFromParent();
        }, {sound:'return'});

        this.createContent();
        if(getUI(this, 'wanfa2')){
            getUI(this, 'wanfa2').setVisible(false);
        }
        // this.updateContent();
        return true;
    },

    updateContent: function (content) {
        //this.itemList = mItem.getItemList(this.index-1);
        this.replayData = content;
        this.itemList = content.result_arr;
        tableViewRefresh(this.tableView);

        for(var i=1;i<=9;i++){
            var name = getUI(this, "nickname" + i);
            var score = getUI(this, "score" + i);
            var score2 = getUI(this, "score" + i + "_0");
            if(this.replayData["uid" + i]){
                name.setString(ellipsisStr(this.replayData["nickname" + i], 4));
                if(this.replayData['resultscore'][i-1] >= 0){
                    score.setString(this.replayData['resultscore'][i-1]);
                    score.setVisible(true);
                    score2.setVisible(false);
                }else{
                    score2.setString(this.replayData['resultscore'][i-1]);
                    score2.setVisible(true);
                    score.setVisible(false);
                }
                score.setPositionX(name.getPositionX());
                score2.setPositionX(name.getPositionX());
            }else{
                name.setVisible(false);
                score.setVisible(false);
                score2.setVisible(false);
            }
        }
        if(this.replayData["uid6"]){
            for(var i=1;i<=9;i++) {
                var name = getUI(this, "nickname" + i);
                var score = getUI(this, "score" + i);
                var score2 = getUI(this, "score" + i + "_0");
                name.setPositionX(90 + (i - 1) * 100);
                score.setPositionX(90 + (i - 1) * 100);
                score2.setPositionX(90 + (i - 1) * 100);
            }
            var Text_2 = getUI(this, 'Text_2');
            Text_2.setVisible(false);
        }
    },

    createContent: function () {
        var tableView = new cc.TableView(this, cc.size(this.scrollview.getContentSize().width, this.scrollview.getContentSize().height));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        tableView.x = 0;
        tableView.y = -1;
        tableView.setDelegate(this);
        tableView.setBounceable(true);
        this.scrollview.addChild(tableView);
        this.tableView = tableView;
    },

    tableCellTouched: function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(1200, 80);
    },

    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (cell == null) {
            cell = new cc.TableViewCell();
            var node = HUD.createTableCell(HUD_LIST.HistoryDetailCell, cell);
            node.setIndex(idx, this.replayData);
        } else {
            cell.node.setIndex(idx, this.replayData);
        }
        return cell;
    },

    numberOfCellsInTableView: function (table) {
        if (this.itemList == null) return 0;
        return this.itemList.length;
    },

    onDataOK: function (event) {
        if (this.checkNoRunning()) return;
        var data = event.getUserData();
        this.updateContent();
    },
};
