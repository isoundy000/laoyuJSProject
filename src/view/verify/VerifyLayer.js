/**
 * Created by dbz on 2017/6/23.
 */
(function () {
    var exports = this;

    var  $ = null;
    var root = null;

    var VerifyLayer = cc.Layer.extend({
        onEnter : function(){
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor : function (parent){
            this._super();
            var that = root  = this;
            var size = cc.winSize;

            var scene = ccs.load(res.verify_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            popShowAni($('Panel_1.bg')); //弹出特效

            var panelOriPos = $('Panel_1.bg').getPosition();
            var panelnewPos = cc.p(panelOriPos.x, panelOriPos.y + cc.winSize.height / 2);

            var txtXing = $('Panel_1.bg.TextField_1');
            var txtMing = $('Panel_1.bg.TextField_2');

            TouchUtils.setOnclickListener($('Panel_1.bg.btn_back'), function () {
                txtXing.didNotSelectSelf();
                txtMing.didNotSelectSelf();
                popHideAni($('Panel_1.bg'), function(){
                    that.removeFromParent();
                })
            });

            TouchUtils.setOnclickListener($('Panel_1.bg.btn_cancel'), function () {
                txtXing.didNotSelectSelf();
                txtMing.didNotSelectSelf();
                popHideAni($('Panel_1.bg'), function(){
                    that.removeFromParent();
                })
            });

            TouchUtils.setOnclickListener($('Panel_1.bg.btn_sure'), function () {
                var xingming = txtXing.getString();
                var shenfenzheng = txtMing.getString();

                if(!(/^[\u4e00-\u9fa5]+$/.test(xingming))){
                    $('Panel_1.bg.tishiBg.Text_3').setString('姓名填写错误,请重新填写');
                    $('Panel_1.bg.tishiBg').setVisible(true);
                    $('Panel_1.bg.tishiBg').runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        $('Panel_1.bg.tishiBg').setVisible(false);
                    })));
                    return;
                }

                if(!(that.IdentityCodeValid(shenfenzheng))){
                    $('Panel_1.bg.tishiBg.Text_3').setString('身份证填写错误,请重新填写');
                    $('Panel_1.bg.tishiBg').setVisible(true);
                    $('Panel_1.bg.tishiBg').runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        $('Panel_1.bg.tishiBg').setVisible(false);
                    })));
                    return;
                }

                network.send(2008, {real_name: xingming, identity_card_id: shenfenzheng});
                // var reqPara = {real_name: xingming, identity_card_id: shenfenzheng, unionid:gameData.unionid};
                // var timestamp = new Date().getTime();
                // reqPara.time = timestamp;
                // var uir = '/niuniuAuth/Auth?time=' + timestamp;
                // var paramd5 = Crypto.MD5("request:" + uir);
                // reqPara.sign = paramd5;
                // var uir = '/niuniuAuth/Auth?time=' + timestamp + '&sign=' + paramd5;
                // DC.httpPost(uir, reqPara, function (response) {
                //     var respJson = JSON.parse(response);
                //     if (respJson.result == 0) {
                //         alert1('认证成功', function () {
                //             gameData.real_name = respJson.real_name;
                //             gameData.identity_card_id = respJson.identity_card_id;
                //             parent.setYanzheng(false);
                //             that.removeFromParent(true);
                //         });
                //     }
                // }, false, DC.httpHost2, function (response) {
                //     alert1('验证失败,请重试！');
                // });
            });

            txtXing.addEventListener(function (textField, type) {
                var xingming = txtXing.getString();
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        if(cc.sys.os == cc.sys.OS_IOS){
                            // $('root.panel').setPositionY(nowPos + 250);
                            $('Panel_1.bg').setPosition(panelnewPos);
                        }
                        cc.log("attach with IME");
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        $('Panel_1.bg').setPosition(panelOriPos);
                        cc.log("detach with IME");
                        if(xingming.length == 0){
                            $('Panel_1.bg.detach_0').setVisible(false);
                            $('Panel_1.bg.detach_0_0').setVisible(false);
                            break
                        }

                        if(/^[\u4e00-\u9fa5]+$/.test(xingming)){
                            $('Panel_1.bg.detach_0').setVisible(true);
                            $('Panel_1.bg.detach_0_0').setVisible(false);
                        }else{
                            $('Panel_1.bg.detach_0').setVisible(false);
                            $('Panel_1.bg.detach_0_0').setVisible(true);
                        }
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        cc.log("insert words");
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log("delete word");
                        if(/^[\u4e00-\u9fa5]+$/.test(xingming) && xingming.length > 0){
                            $('Panel_1.bg.detach_0').setVisible(true);
                            $('Panel_1.bg.detach_0_0').setVisible(false);
                        }else{
                            $('Panel_1.bg.detach_0').setVisible(false);
                            $('Panel_1.bg.detach_0_0').setVisible(true);
                        }
                        break;
                    default:
                        break;
                }
            }, this);

            txtMing.addEventListener(function (textField, type) {
                var shenfenzheng = txtMing.getString();
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        cc.log("attach with IME");
                        if(cc.sys.os == cc.sys.OS_IOS){
                            // $('root.panel').setPositionY(nowPos + 250);
                            $('Panel_1.bg').setPosition(panelnewPos);
                        }
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        $('Panel_1.bg').setPosition(panelOriPos);
                        cc.log("detach with IME");
                        if(shenfenzheng.length == 0){
                            $('Panel_1.bg.detach_1').setVisible(false);
                            $('Panel_1.bg.detach_1_1').setVisible(false);
                            break;
                        }

                        if(that.IdentityCodeValid(shenfenzheng) && shenfenzheng.length == 18){
                            $('Panel_1.bg.detach_1').setVisible(true);
                            $('Panel_1.bg.detach_1_1').setVisible(false);
                        }else{
                            $('Panel_1.bg.detach_1').setVisible(false);
                            $('Panel_1.bg.detach_1_1').setVisible(true);
                        }
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                        cc.log("insert words");
                        break;
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        cc.log("delete word");
                        if(that.IdentityCodeValid(shenfenzheng) && shenfenzheng.length == 18){
                            $('Panel_1.bg.detach_1').setVisible(true);
                            $('Panel_1.bg.detach_1_1').setVisible(false);
                        }else{
                            $('Panel_1.bg.detach_1').setVisible(false);
                            $('Panel_1.bg.detach_1_1').setVisible(true);
                        }
                        break;
                    default:
                        break;
                }
            }, this);

            // network.addListener(2008, function (data) {
            //     if(data.success){
            //         alert1('认证成功', function () {
            //             gameData.hasShiMing = true;
            //             parent.setYanzheng(false);
            //             that.removeFromParent(true);
            //         });
            //     }else{
            //         alert1('验证失败,请重试！');
            //     }
            // });
        },
        /*
         根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
         地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
         出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
         顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
         校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

         出生日期计算方法。
         15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
         2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
         下面是正则表达式:
         出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
         身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
         15位校验规则 6位地址编码+6位出生日期+3位顺序号
         18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

         校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
         公式(1)中：
         i----表示号码字符从由至左包括校验码在内的位置序号；
         ai----表示第i位置上的号码字符值；
         Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
         i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
         Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

         */
        //身份证号合法性验证
        //支持15位和18位身份证号
        //支持地址编码、出生日期、校验位验证
        IdentityCodeValid: function (code) {
            var city = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            };
            var tip = "";
            var pass = true;

            // if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            //     tip = "身份证号格式错误";
            //     pass = false;
            // }

            if(!code || !/^[1-9]\d{5}(18|19|2([0-9]))\d{2}(0[0-9]|10|11|12)([0-2][1-9]|30|31)\d{3}[0-9Xx]$/i.test(code)){
                tip = "身份证号格式错误";
                pass = false;
            }

            else if (!city[code.substr(0, 2)]) {
                tip = "地址编码错误";
                pass = false;
            }
            else {
                //18位身份证需要验证最后一位校验位
                if (code.length == 18) {
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != code[17]) {
                        tip = "校验位错误";
                        pass = false;
                    }
                }
            }
            // if (!pass) alert(tip);
            return pass;
        },
        isNumberOrCharacter: function(_string) {

            var charecterCount = 0;
            for(var i=0; i < _string.length; i++){
                var character = _string.substr(i,1);
                var temp = character.charCodeAt();
                if (48 <= temp && temp <= 57){

                }else if(temp == 88){

                    charecterCount += 1;
                }else if(temp == 120){

                    charecterCount += 1;
                }else{
                    return false;
                }
            }
            if(charecterCount <= 1){
                return true
            }
        }
    });
    var removeSelf = function () {
        root.removeFromParent();
    };
    exports.VerifyLayer = VerifyLayer;
    exports.VerifyLayer.removeSelf = removeSelf;

})(window);