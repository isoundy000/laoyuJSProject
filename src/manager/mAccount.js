var mAccount = {
    token:"",
    skipGuide:false,

    getUDID: function(){
        var udid = "";
        if(window != null)
        {
            //UD.UDID = "webClient_admin188";

            //UD.UDID = "webClient_admin888";
            //UD.UDID = "webClient_admin288";
            //UD.UDID = "webClient_admin388";
            //UD.UDID = "webClient_admin488";
            //UD.UDID = "webClient_admin788";

            udid = "webClient";
            //UD.UDID = "webClient_admin_new_n11";
        }
        else
        {
            udid = sys.getNativeUDID();
        }

        return udid;

//    var myId = sys.localStorage.getItem("myid");
//    if(myId != null && myId.length > 0)
//    {
//        UD.UDID = myId;
//    }
//    else
//    {
//        myId = "TT_" + parseInt(Math.random() * 10000000) + 888;
//        UD.UDID = myId;
//        sys.localStorage.setItem("myid", myId);
//    }
    },

    getRandomName:function(sex){
        var count = 0;
        var name = "";
        if(sex == 0){
            count = getLength(Config.HeroMan);
        }else{
            count = getLength(Config.HeroWoman);
        }

        var rand = parseInt(Math.random() * count) + 1;
        if(sex == 0){
            name = Config.HeroMan[rand].ManName;
        }else{
            name = Config.HeroWoman[rand].WomanName;
        }

        count = getLength(Config.HeroFirstName);
        rand = parseInt(Math.random() * count) + 1;
        var firstName = Config.HeroFirstName[rand].FirstName;
        name = firstName + name;
        return name;
    },

    processName:function(name){
        name = name.replace(/\//g, "");
        // name = name.replace(////g, "");
        name = name.replace(/%/g, "");
        name = name.replace(/"/g, "");
        name = name.replace(/ /g, "");
        return name;
    },

    onWebSocketConnected:function(){
        if (gameData.headimgurl == null) gameData.headimgurl = '';
        if (gameData.sex == null) gameData.sex = 1;
        var avator = encodeURIComponent(gameData.headimgurl);
        var version = 1001;
        //替换版本号为当前版本号,不使用固定版本号
        if(window.curVersion){
            version = window.curVersion;
        }
        // version = "3.0.4";

        // gameData.location = "60,100";
        // gameData.locationInfo = "北京市立水桥";
        var GPS = "{'location':'27.45195225935216,112.64903382931014','locationInfo':'湖南省衡阳市衡山县','isOpenLocation':1}";
        // var GPS = JSON.stringify({
        //     location: gameData.location,
        //     locationInfo: gameData.locationInfo
        // });
        var username = this.processName(gameData.nickname);
        var loginStr = "login/"+ version +"/"+gameData.uid+"/" + username + "/"
            + avator+ "/" + gameData.sex + "/" + gameData.myToken + "/" + GPS;
        // var loginStr = "login/"+ version +"/"+0+"/" + gameData.nickname + "/" + avator+ "/" + gameData.sex + "/" + gameData.myToken;
        // console.log(loginStr);
        network.wsData(loginStr);
    }
};