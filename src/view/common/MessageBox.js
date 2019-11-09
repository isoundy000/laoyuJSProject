var MessageBox = {
    init: function () {
        // popShowAni(getUI(this, 'root'));
        // this.setPositionX(cc.winSize.width/2 - 1280/2);
        addModalLayer(this);

        if(!window.sensorLandscape){
            getUI(this, 'root').setRotation(-90);
        }
    },

    setData: function (title, msg, callFunc, hideCancel, notclose) {
        var that = this;
        // var txtTitle = getUI(this, "lb_title");
        var txtDesc = getUI(this, 'lb_content');
        var panel = getUI(this, 'panel');
        var btCancel = getUI(this, 'btn_cancel');
        var btOK = getUI(this, 'btn_ok');
        var btCancel2 = getUI(this, 'btn_cancel2');
        var btOK2 = getUI(this, 'btn_ok2');
        btCancel2.setVisible(false);
        btOK2.setVisible(false);
        txtDesc.setString(msg);
        this.txtDesc = txtDesc;
        this.callBack = callFunc;
        if (hideCancel) {
            btCancel.setVisible(false);
            btOK.setPositionX(0);
        }

        TouchUtils.setOnclickListener(btOK, function () {
            if (that.callBack && _.isFunction(that.callBack)) {
                that.callBack();
            }
            // popHideAni(getUI(that, 'root'), function(){
            if (!notclose) {
                that.removeFromParent();
            }
            // });
        });
        TouchUtils.setOnclickListener(btCancel, function () {
            // popHideAni(getUI(that, 'root'), function(){
            that.removeFromParent();
            // });
        });
    },
    setConfirmData: function (title, msg, confirmFunc, confirmText, cancelFunc, cancelText) {
        var that = this;
        var txtDesc = getUI(this, 'lb_content');
        var panel = getUI(this, 'panel');
        var btCancel = getUI(this, 'btn_cancel2');
        var btOK = getUI(this, 'btn_ok2');
        var btCancel2 = getUI(this, 'btn_cancel');
        var btOK2 = getUI(this, 'btn_ok');
        var Text_1 = getUI(btOK, 'text');
        var Text_2 = getUI(btCancel, 'text');
        btCancel.setVisible(false);
        btOK.setVisible(false);
        Text_1.setString(confirmText);
        Text_2.setString(cancelText);
        txtDesc.setString(msg);
        this.confirm = confirmFunc;
        this.cancel = cancelFunc;

        TouchUtils.setOnclickListener(btOK2, function () {
            if (that.confirm) {
                that.confirm();
            }
            // popHideAni(getUI(that, 'root'), function(){
            that.removeFromParent();
            // });
        });
        TouchUtils.setOnclickListener(btCancel2, function () {
            if (that.cancel) {
                that.cancel();
            }
            // popHideAni(getUI(that, 'root'), function(){
            that.removeFromParent();
            // });
        });
    },
    getLabel: function () {
        return this.txtDesc;
    },
    getCom: function (p, name) {return getCom(p, name, this);}
};