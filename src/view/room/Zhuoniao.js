var Zhuoniao = {
    init: function () {
        var that = this;
        this.selectniao = cc.sys.localStorage.getItem("selectNiao");
        if(this.selectniao == undefined || this.selectniao == null || this.selectniao == "") this.selectniao = 0;

        this.btn_confirm = getUI(this, "btn_confirm");
        this.check1 = getUI(this, "check1");
        this.check2 = getUI(this, "check2");
        this.check3 = getUI(this, "check3");
        this.check4 = getUI(this, "check4");
        this.niao1 = getUI(this, "niao1");
        this.niao2 = getUI(this, "niao2");
        this.niao3 = getUI(this, "niao3");
        this.niao4 = getUI(this, "niao4");
        this.btn_confirm.addTouchEventListener(this.confirmFunc, this);

        this.check1.setTexture((this.selectniao == 0)? "res/image/ui/room2/btselect.png":"res/image/ui/room2/bt_bg.png");
        this.check2.setTexture((this.selectniao == 10)? "res/image/ui/room2/btselect.png":"res/image/ui/room2/bt_bg.png");
        this.check3.setTexture((this.selectniao == 20)? "res/image/ui/room2/btselect.png":"res/image/ui/room2/bt_bg.png");
        this.check4.setTexture((this.selectniao == 30)? "res/image/ui/room2/btselect.png":"res/image/ui/room2/bt_bg.png");

        TouchUtils.setOnclickListener(this.check1, function (node) {
            that.selectniao = 0;
            that.check1.setTexture("res/image/ui/room2/btselect.png");
            that.check2.setTexture("res/image/ui/room2/bt_bg.png");
            that.check3.setTexture("res/image/ui/room2/bt_bg.png");
            that.check4.setTexture("res/image/ui/room2/bt_bg.png");
        });
        TouchUtils.setOnclickListener(this.check2, function (node) {
            that.selectniao = 10;
            that.check1.setTexture("res/image/ui/room2/bt_bg.png");
            that.check2.setTexture("res/image/ui/room2/btselect.png");
            that.check3.setTexture("res/image/ui/room2/bt_bg.png");
            that.check4.setTexture("res/image/ui/room2/bt_bg.png");
        });
        TouchUtils.setOnclickListener(this.check3, function (node) {
            that.selectniao = 20;
            that.check1.setTexture("res/image/ui/room2/bt_bg.png");
            that.check2.setTexture("res/image/ui/room2/bt_bg.png");
            that.check3.setTexture("res/image/ui/room2/btselect.png");
            that.check4.setTexture("res/image/ui/room2/bt_bg.png");
        });
        TouchUtils.setOnclickListener(this.check4, function (node) {
            that.selectniao = 30;
            that.check1.setTexture("res/image/ui/room2/bt_bg.png");
            that.check2.setTexture("res/image/ui/room2/bt_bg.png");
            that.check3.setTexture("res/image/ui/room2/bt_bg.png");
            that.check4.setTexture("res/image/ui/room2/btselect.png");
        });

        return true;
    },
    confirmFunc: function (sender, type) {
        var ok = touch_process(sender, type);
        if(ok){
            network.wsData("Niao/1/" + this.selectniao);
            cc.sys.localStorage.setItem("selectNiao", this.selectniao);
            this.hide(true);
        }
    }
};
