var Logo = {
    init:function () {
        this.getServerList();
        ConfigHelper.loadConfigs();
        mLevel.init();
        mBattle.init();

        return true;
    },

    getServerList:function(){
        var request = {};
        request.version = "1.0.0";
        request.channel = "android";
        DC.httpData("/api/open/servers", request, this.onGetServerListOK.bind(this));

        //HUD.showScene(HUD_LIST.Login);
    },

    onGetServerListOK:function(data){
        //for(var i=0;i < 100; i++){
        //    var d = {};
        //    d.status = "1";
        //    d.name = "测试服务器";
        //    d.sid = (i + 2).toString();
        //    data.push(d);
        //}

        DD[T.ServerList] = data;
        HUD.showScene(HUD_LIST.Login, this);
    }
};
