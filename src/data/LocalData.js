var LD = {
    LAST_SERVER_ID:"LAST_SERVER_ID",         //选择的服务器ID

    K_USER_NAME:"userName",
    K_PASS_WORD:"passWord",

    K_GUEST_NAME:"guestName",
    K_GUEST_PWD:"guestPwd",

    K_LOGIN_SERVERS:"loginServer",

    K_AUDIO_SOUND:"audio_sound",
    K_AUDIO_EFFECT:"audio_effect",


    get:function(key){
        var value = cc.sys.localStorage.getItem(key);
        if(value == null)
            value = "";
        return value;
    },

    set:function(key, value){
        key = key.toString();
        return cc.sys.localStorage.setItem(key, value);
    }
}