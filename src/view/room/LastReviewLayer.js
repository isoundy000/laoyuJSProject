(function () {
    var exports = this;
    var $ = null;

    var LastReviewLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        ctor: function () {
            // var datas = '{"Winner":0,"Reason":"showhand over","Users":[{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117784,"UserName":"101122","ChipInValue":-8,"Result":-8,"Flags":null,"Ratio":0,"Hand":[1,2,3,4,5]},{"UserID":117794,"UserName":"101123","ChipInValue":8,"Result":8,"Flags":null,"Ratio":1,"Hand":[6,7,8,9,10]}],"Url":null,"Banker":117784,"EndTime":"2017-08-14 21:14:03"}';

            this._super();
            var that = this;
            var scene = ccs.load(res.LastReviewLayer_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($("root"), function () {
                that.removeFromParent();
            }, {effect: TouchUtils.effects.NONE});
            $('root.scrollview.touxiangkuang').setVisible(false);

            TouchUtils.setOnclickListener($("root.close"), function () {
                that.removeFromParent();
            }, {effect: TouchUtils.effects.NONE});

            // that.initUI(JSON.parse(datas));

            $('root.scrollview.headbg1').setVisible(false);
            network.addListener(P.GS_LastResult, function (data) {
                that.initUI(data);
            });
            network.wsData(['LastResult'].join('/'));
        },
        initUI: function(data){
            var sHeight = 110 * data['Users'].length;
            if(sHeight <= 620){
                sHeight = 620;
            }
            $('root.scrollview').setInnerContainerSize(cc.size(440, sHeight));

            var headbg1 = $('root.scrollview.headbg1');
            headbg1.setVisible(true);
            for(var i=0;i<data['Users'].length;i++){
                var headbg = $('root.scrollview.headbg' + (i+1));
                if(!headbg){
                    headbg = duplicateSprite(headbg1);
                    headbg.setName('headbg' + (i+1));
                    $('root.scrollview').addChild(headbg);
                }
                headbg.setPositionY(sHeight - (i+1)*110 + 55);
                if(headbg) {
                    //头像
                    var uid = data['Users'][i]['UserID'];
                    var useinfo = gameData.getUserInfo(uid);
                    if (gameData.uid == uid) {
                        $('root.scrollview.touxiangkuang').setVisible(true);
                        $('root.scrollview.touxiangkuang').setPositionY(headbg.getPositionY());
                    }
                    var name = headbg.getChildByName('name');
                    if (name) {
                        var namestr = (useinfo && useinfo.nickname) ? useinfo.nickname : "空";
                        name.setString(ellipsisStr(namestr, 6));
                    }
                    //chipin  fenshu  num
                    var chipin = headbg.getChildByName('chipin');
                    if (chipin) {
                        var fenshu = (data['Users'][i]['ChipInValue'] <= -100) ? (0) : (data['Users'][i]['ChipInValue']);
                        var n = 0;//庄
                        if (fenshu == 1) n = 6;
                        if (fenshu == 2) n = 6;
                        if (fenshu == 3 || fenshu == 4) n = 6;
                        if (fenshu >= 5 && fenshu <= 8) n = 6;
                        if (fenshu >= 9) n = 6;
                        var num = (data['Users'][i]['ChipInValue'] <= -100) ? (Math.abs(data['Users'][i]['ChipInValue']) - 100) : (data['Users'][i]['ChipInValue']);
                        if (num < 0) {
                            num = 1;
                        }
                        $("fenshu", chipin).setString('' + n);//0牛
                        $("num", chipin).setString(num);
                    }
                    for (var j = 0; j < 5; j++) {
                        var a = headbg.getChildByName('a' + j);
                        if (!a) {
                            a = duplicateSprite(headbg1.getChildByName('a' + j));
                            headbg.addChild(a);
                        }
                    }
                    if (data['Users'][i] && data['Users'][i]['Cards']) {
                        var vardArr = data['Users'][i]['Cards'].split(',');
                        if (vardArr && vardArr.length == 5) {
                            this.setPaiArr('headbg' + (i + 1), $('root.scrollview'), vardArr);
                        }
                    }

                    var niuniu = headbg.getChildByName('niuniu');
                    if (niuniu) {
                        niuniu.setLocalZOrder(1);
                        var niuniunum = data['Users'][i]['Result2'];
                        if (niuniunum == 13) {//小牛
                            niuniu.setTexture(res.DN_wuxiaoniu_png);
                        } else if (niuniunum == 12) {//五花
                            niuniu.setTexture(res.DN_wuhuaniu_png);
                        } else if (niuniunum == 11) {//炸弹
                            niuniu.setTexture(res.DN_zhadanniu_png);
                        // } else if (niuniunum < 10 && niuniunum >= 0) {
                        //     niuniu.setTexture(res["DN_niu" + niuniunum + "_png"]);
                        // } else if (niuniunum == 14) {//顺子
                        //     niuniu.setTexture(res.DN_niu14_png);
                        // } else if (niuniunum == 15) {//同花
                        //     niuniu.setTexture(res.DN_niu15_png);
                        // } else if (niuniunum == 16) {//葫芦
                        //     niuniu.setTexture(res.DN_niu16_png);
                        } else if (niuniunum == 10) {
                            niuniu.setTexture(res["DN_niuniu_png"]);
                        }else{
                            niuniu.setTexture(res["DN_niu" + niuniunum + "_png"]);
                        }
                    }
                }
            }

            for(var i=0;i<data['Users'].length;i++){
                var headbg = $('root.scrollview.headbg' + (i+1));
                if(headbg) {
                    //头像
                    var uid = data['Users'][i]['UserID'];
                    var useinfo = gameData.getUserInfo(uid);
                    var head = headbg.getChildByName('head');
                    if (head) {
                        loadImageToSprite((useinfo && useinfo.headimgurl && useinfo.headimgurl.length > 0) ? useinfo.headimgurl : res.defaultHead, head, false);
                    }
                    var fontFile = (data['Users'][i]['Result'] >= 0) ? res.score_yellow_fnt : res.score_blue_fnt;
                    var score = new ccui.TextBMFont(data['Users'][i]['Result'], fontFile);
                    score.setName('score');
                    score.setPosition(cc.p(320, 95));
                    headbg.addChild(score);
                }
            }
        },
        setPaiArr: function (nameStr, node, paiArr) {
            for (var i = 0; i < 5; i++) {
                var pai = $(nameStr + '.a' + i, node);
                var val = paiArr[i];
                var arr = getPaiNameByIdNN(val);
                setSpriteFrameByName(pai, arr, 'niuniu/card/poker');
            }
        }
    });


    exports.LastReviewLayer = LastReviewLayer;
})(window);

