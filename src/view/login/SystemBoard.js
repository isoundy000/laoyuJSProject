var SystemBoard = {
    init:function(){
        this.btOK = getUI(this, "btOK");
        this.btOK.addTouchEventListener(this.onClose, this);

        this.ScrollView = getUI(this, "ScrollView");
        this.txtTitle2 = getUI(this.ScrollView, "txtTitle2");
        this.txtInfo = getUI(this.ScrollView, "txtInfo");
    },

    setData:function(data){
        this.txtTitle2.setString(data.n_title);
        this.txtInfo.setString(data.n_content);
        this.txtInfo.setFontSize(24);

        var rowLength = 485;
        var baseHeight = 550;

        var rows = parseInt(data.n_content.length * 30/rowLength) + 1;
        var height = rows * 29 + 40;
        if(height < baseHeight)height = baseHeight;
        this.ScrollView.setInnerContainerSize(cc.size(530, height));

        this.txtTitle2.setPositionY(height - 40);
        this.txtInfo.setPositionY(height - 70);
        this.txtInfo.setContentSize(rowLength, height);
    },

    onClose:function (sender, type) {
        var ok = touch_process_bt(type);
        if (ok) {
            this.hide(true);
        }
    }
};
