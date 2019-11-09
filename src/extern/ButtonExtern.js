
ccui.Button.prototype.setTouchEnd = function(){

};


function initButtonExt1(node){
    node.setPressedActionEnabled(true);
    node.setZoomScale(-0.1);

    var lab = node.getTitleRenderer();

    if(lab.enableOutline == null)
        lab.enableStroke(cc.color(0, 0, 0), 2);
    else
        lab.enableOutline(cc.color(0, 0, 0), 2);
}

function setButtonGetStatus(status, bt, imgGet, isEnable, typ){
    var btnId = (typ || "1").toString();
    btnId = new Array(4 - btnId.length).join("0") + btnId;
    if(status == 1){                          //可领取
        bt.setVisible(true);
        bt.loadTextureNormal("bt_normal_"+btnId+".png", 1);
        bt.loadTexturePressed("bt_down_"+btnId+".png", 1);

        if(imgGet != null)
            imgGet.setVisible(false);
        if(isEnable != null)
            isEnable.setVisible(false);
    }else if(status == 2){                    //未达成
        bt.setVisible(true);
        bt.loadTextureNormal("bt_disable_"+btnId+".png", 1);
        bt.loadTexturePressed("bt_disable_"+btnId+".png", 1);

        if(imgGet != null)
            imgGet.setVisible(false);
        if(isEnable != null)
            isEnable.setVisible(true);
    }else if(status == 3){                     //已领取
        bt.setVisible(false);

        if(imgGet != null)
            imgGet.setVisible(true);
        if(isEnable != null)
            isEnable.setVisible(false);
    }
}

function setButtonDisable(bt, enable, typ){
    var btnId = (typ || "1").toString();
    btnId = new Array(4 - btnId.length).join("0") + btnId;
    if(enable == true){                          //可领取
        bt.loadTextureNormal("bt_normal_"+btnId+".png", 1);
        bt.loadTexturePressed("bt_down_"+btnId+".png", 1);
    }else{                    //未达成
        bt.loadTextureNormal("bt_disable_"+btnId+".png", 1);
        bt.loadTexturePressed("bt_disable_"+btnId+".png", 1);
    }
}


function setupSortButton(bt, manager, cbk){
    bt.setSwallowTouches(true);
    if(manager.sortType == 1){
        bt.setTitleText("升序排列");
    }else{
        bt.setTitleText("降序排列");
    }

    bt.addTouchEventListener( function (sender, type) {
        var ok = touch_process_bt(type);
        if(ok){
            if(manager.sortType == 1){
                manager.sortType = 2;
                bt.setTitleText("降序排列");
            }else{
                manager.sortType = 1;
                bt.setTitleText("升序排列");
            }
            cbk();
        }
    });
}

function setButtonImg(bt, img){
    bt.loadTextureNormal(img, 0);
    bt.loadTexturePressed(img, 0);
}





