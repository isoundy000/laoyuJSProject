var TableViewCell = {
    _idx:0,
    _className:"TableViewCell",

    getIdx:function () {
        return this._idx;
    },
    setIdx:function (idx) {
        this._idx = idx;
    },
    reset:function () {
        this._idx = cc.INVALID_INDEX;
    },

    setObjectID:function (idx) {
        this._idx = idx;
    },
    getObjectID:function () {
        return this._idx;
    }
};

function tableViewSetPosition(tableView, rowHeight, itemCount, toIndex, addOffset){
    if(addOffset == null) addOffset = 0;
    if(toIndex < 0)toIndex = 0;

    var content = tableView.getContainer();
    var viewSize = tableView.getViewSize();

    var offset = viewSize.height - (addOffset);
    var posy = rowHeight * (toIndex - itemCount) + offset;

    var baseY = 0;
    var size = content.getContentSize();
    if(size.height < viewSize.height){
        baseY = viewSize.height - size.height;
    }
    if(posy > baseY)posy = baseY;
    var topY = viewSize.height - size.height;
    if(posy < topY)posy = topY;
    content.setPositionY(posy);
    tableView.scrollViewDidScroll(tableView);
}

function tableViewRefresh(tableView){
    if(tableView != null){
        var content = tableView.getContainer();
        var posy = content.getPositionY();
        tableView.reloadData();

        var viewSize = tableView.getViewSize();
        if(posy == viewSize.height)
            return;

        var baseY = 0;
        var size = content.getContentSize();
        if(size.height < viewSize.height){
            baseY = viewSize.height - size.height;
        }
        if(posy > baseY)posy = baseY;

        var topY = viewSize.height - size.height;
        if(posy < topY)posy = topY;

        content.setPositionY(posy);
        tableView.scrollViewDidScroll(tableView);
    }
}
