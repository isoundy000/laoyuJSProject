var NoticeLayer = {
    init: function () {
        var that = this;

        this.scroll = getUI(this, "scroll");
        this.content = getUI(this, "content");
        getUI(this, "root").addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                that.getParent().setMessageNum(0);
                var main = getUI(that, 'main');
                popHideAni(main, function(){
                    that.removeFromParent(true);
                });
            }
        });

        var main = getUI(this, 'main');
        popShowAni(main, true);

        return true;
    },
    setData:function(infos, parent){
        var that = this;
        if (parent) {
            this.parent = parent;
        }
        // infos.push({Name:"1111", Details:"2016-08-27 升级公告\n 丫丫跑胡子升级了，请各位玩家大退\n游戏（退出重进）进行升级，最新版本号2.3.4 更新内容如下：", TimeInMillionSecond:"0000"});
        this.infos = infos;
        if(infos && infos[0] && infos[0]['Details']){
            this.content.setString(infos[0]['Details']);
        }
    },

}