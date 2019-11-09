var Register = {
    init:function () {
        this.btClose = getUI(this, "btClose");
        this.btCancel = getUI(this, "btCancel");
        this.btOK = getUI(this, "btOK");

        this.btClose.addTouchEventListener(this.onClose, this);
        this.btCancel.addTouchEventListener(this.onClose, this);
        this.btOK.addTouchEventListener(this.onRegister, this);

        this.txtName = getUI(this, "txtName");
        this.txtPwd = getUI(this, "txtPwd");
        this.txtPwd2 = getUI(this, "txtPwd2");

        var userName = "";
        var pwd = "";

        this.tf1 = this.addEditBox(this.txtName, userName, "请输入账号");
        this.tf2 = this.addEditBox(this.txtPwd, pwd, "请输入密码", true);
        this.tf3 = this.addEditBox(this.txtPwd2, pwd, "请输入密码", true);

        return true;
    },

    addEditBox:function(parent, text, holder, isPwd){
        var tf = new cc.EditBox(cc.size(300, 50), new cc.Scale9Sprite("res/image/ui/common/disable/empty.png"));
        parent.addChild(tf);
        tf.setPosition(280, 26);
        if(cc.sys.isNative == false){
            tf.setPosition(280, 32);
        }
        tf.setFontColor(cc.color(255, 250, 236));
        //tf.setPlaceholderFontColor(cc.color(255, 255, 255));
        tf.setDelegate(this);
        tf.setMaxLength(15);
        tf.setFontSize(30);
        tf.setPlaceholderFontSize(30);


        if(isPwd == true)
            tf.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        if(text != null)
            tf.setString(text);
        tf.setPlaceHolder(holder);
        return tf;
    },

    editBoxEditingDidBegin: function (editBox) {

    },

    editBoxEditingDidEnd: function (editBox) {

    },

    editBoxTextChanged: function (editBox, text) {

    },

    editBoxReturn: function (editBox) {

    },


    onRegister:function (sender, type) {
        var ok = touch_process_bt(type);
        if(ok){
            var userName = this.tf1.getString();
            var passWord = this.tf2.getString();
            var passWord2 = this.tf3.getString();

            if(userName == ""){
                HUD.showMessage("帐号不能为空");
                return;
            }

            if(userName == ""){
                HUD.showMessage("密码不能为空");
                return;
            }

            if(passWord2 == ""){
                HUD.showMessage("确认密码不能为空");
                return;
            }

            if(userName.indexOf(" ") != -1){
                HUD.showMessage("帐号中不能包含空格");
                return;
            }

            if(passWord.indexOf(" ") != -1){
                HUD.showMessage("密码中不能包含空格");
                return;
            }

            if(passWord != passWord2){
                HUD.showMessage("密码和确认密码不一致");
                return;
            }

            var d = new Date();
            var time = d.getTime();
            var urlParameter = "username=" + userName + "&password=" + passWord + "&time=" + time;

            var request = [];
            request.push(userName);
            request.push(passWord);
            request.version = C_Version;
            request.channel = C_Channel;
            DC.httpPost("/api/user/register?" + urlParameter, request, this.onRegisterBack.bind(this));
        }
    },

    onRegisterBack:function(data){
        cc.log("check info ---- onRegisterBack", data);

        if(data == "ok"){
            var userName = this.tf1.getString();
            var passWord = this.tf2.getString();
            LD.set(LD.K_USER_NAME, userName);
            LD.set(LD.K_PASS_WORD, passWord);
            HUD.showLayer(HUD_LIST.LoginByAccount, HUD.getTipLayer(), null, true);
            HUD.showMessage("恭喜你，注册成功");
            this.hide(true);
        }else{
            var msg = "";
            switch (data){
                case "1":
                    msg = "用户名格式不正确";
                    break;
                case "2":
                    msg = "密码格式不正确";
                    break;
                case "3":
                    msg = "用户名已经存在";
                    break;
                default:
                    msg = "注册失败";
            }
            HUD.showMessage(msg);
        }
    },

    onClose:function (sender, type) {
        var ok = touch_process_bt(type);
        if(ok){
            this.hide(true);
        }
    }
};
