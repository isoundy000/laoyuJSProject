var LoginByAccount = {
    init:function () {
        this.btClose = getUI(this, "btClose");
        this.btClose.addTouchEventListener(this.onClose, this);

        this.txtName = getUI(this, "txtName");
        this.txtPwd = getUI(this, "txtPwd");

        var userName = LD.get(LD.K_USER_NAME);
        var pwd = LD.get(LD.K_PASS_WORD);

        this.tf1 = this.addEditBox(this.txtName, userName, "请输入账号");
        this.tf2 = this.addEditBox(this.txtPwd, pwd, "请输入密码", true);


        this.btRegister = getUI(this, "btRegister");
        this.btLogin = getUI(this, "btLogin");
        this.btRegister.addTouchEventListener(this.onRegister, this);
        this.btLogin.addTouchEventListener(this.onLogin, this);

        network.addCustomListener(A_LoginOK, this.hide.bind(this));
        return true;
    },

    addEditBox:function(parent, text, holder, isPwd){
        var tf = new cc.EditBox(cc.size(300, 50), new cc.Scale9Sprite("res/image/ui/common/disable/empty.png"));
        parent.addChild(tf);
        tf.setPosition(250, 26);
        if(cc.sys.isNative == false){
            tf.setPosition(250, 32);
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
            this.hide(true);
            HUD.showLayer(HUD_LIST.Register, HUD.getTipLayer(), null, true);
        }
    },

    onLogin:function (sender, type) {
        var ok = touch_process_bt(type);
        if(ok){
            var userName = this.tf1.getString();
            var passWord = this.tf2.getString();

            if(userName == ""){
                HUD.showMessage("帐号不能为空");
                return;
            }

            if(userName == ""){
                HUD.showMessage("密码不能为空");
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

            LD.set(LD.K_USER_NAME, userName);
            LD.set(LD.K_PASS_WORD, passWord);
            mAccount.login(userName, passWord);
        }
    },

    onClose:function (sender, type) {
        var ok = touch_process_bt(type);
        if(ok){
            this.hide(true);
        }
    }
};
