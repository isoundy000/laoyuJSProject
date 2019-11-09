'use strict';
(function (exports) {

    var $ = null;

    var GAP = 0;
    var CardHeight = 120;
    var rowHeight = 50;
    var scrollInnerHeight = 0;

    var HistoryDetailNiuNiu = cc.Layer.extend({
        onEnter: function () {
            this._super();
        },
        ctor: function (data) {
            this._super();
            var that = this;
            this.data = data;
            that.curindex = 0;
            var mainscene = ccs.load(res.HistoryDetail_json, "res/");
            this.addChild(mainscene.node);
            $ = create$(this.getChildByName("Layer"));

            TouchUtils.setOnclickListener(mainscene.node, function () {
            });
            TouchUtils.setOnclickListener($('btBack'), function () {
                that.removeFromParent(true);
            });

            $("btshare").setVisible(true);
            TouchUtils.setOnclickListener($("btshare"), function () {
                if (!cc.sys.isNative)
                    return;
                // var nodeForShare = ccs.load(res.NiuNiuZhanjiDetailItem_json, "res/").node;
                // nodeForShare.setPosition(cc.p(itemSize.width / 2, itemSize.height / 2));
                // setData($("row", nodeForShare));
                // $("row.btn_fenxiang", nodeForShare).setVisible(false);
                // // nodeForShare.setPosition(1280/2, 720/2);
                // // that.addChild(nodeForShare);
                // // WXUtils.captureAndShareToWX(nodeForShare, itemSize);
                WXUtils.captureAndShareToWX(that, 0x88F0);//0x88F0
            }, {swallowTouches:true});

            //玩法
            var wanfaArr = JSON.parse(data.optionstring);
            var wanfatxt = wanfaArr.name;
            if(wanfaArr.desp && wanfaArr.desp.indexOf('九人') >= 0)  wanfatxt = wanfatxt + "-九人场";
            var wanfa2str = "房间号:" + data['room_id'] + ",局数:" + wanfaArr['rounds'] + ",玩法:" + wanfatxt + ",";
            if(wanfaArr.Xiaobeilv == "3222"){
                wanfa2str += '双十x3 十带九x2 十带八x2 十带七x2 ';
            }
            if(wanfaArr.Xiaobeilv == "4322"){
                wanfa2str += '双十x4 十带九x3 十带八x2 十带七x2 ';
            }
            if(wanfaArr.kuozhan1){
                wanfa2str += '五花/炸弹x6 五小x8 ';
            }
            if(wanfaArr.kuozhan2){
                wanfa2str += '顺子/葫芦/同花x5';
            }
            if(wanfaArr.kuozhanwuhua1){
                wanfa2str += '炸弹x8 四十大/十小x6';
            }
            $('titlelist.wanfa2').setString(wanfa2str);

            var scrollView = $('scrollview');
            this.scrollView = scrollView;
            $('titlelist.Text_1').setPositionX(0);
            $('titlelist.Text_2').setVisible(false);
            var _disW = 110;
            for (var i = 0; i < 9; i++) {
                if (data['uid' + (i + 1)]) {
                    var name = ellipsisStr(_.trim(decodeURIComponent(data['nickname' + (i + 1)])), 4);
                    $('titlelist.nickname' + (i + 1)).setString(name);
                    $('titlelist.nickname' + (i + 1)).setPositionX(150 + i * _disW);
                    var score = data['resultscore'][i];
                    if(score >= 0){
                        $('titlelist.score' + (i + 1)).setString(score);
                        $('titlelist.score' + (i + 1)).setVisible(true);
                        $('titlelist.score' + (i + 1) + '_0').setVisible(false);
                        $('titlelist.score' + (i + 1)).setPositionX(150 + i * _disW);
                    }else{
                        $('titlelist.score' + (i + 1) + '_0').setString(score);
                        $('titlelist.score' + (i + 1)).setVisible(false);
                        $('titlelist.score' + (i + 1) + '_0').setVisible(true);
                        $('titlelist.score' + (i + 1) + '_0').setPositionX(150 + i * _disW);
                    }
                } else {
                    $('titlelist.nickname' + (i + 1)).setVisible(false);
                    $('titlelist.score' + (i + 1)).setVisible(false);
                    $('titlelist.score' + (i + 1)+ '_0').setVisible(false);
                }
            }

            var row0 = ccs.load(res.NiuNiuZhanjiDetailItem_json, "res/").node;
            row0.setName('row0');
            var itemSize = row0.getChildByName('row').getContentSize();
            scrollView.addChild(row0);
            var rowCount = data.card_arr.length;
            var innerHeight = rowHeight * rowCount + CardHeight;
            var delta = scrollView.getContentSize().height - innerHeight;

            //牌的信息
            var cardInfo = ccs.load(res.NiuNiuZhanjiDetailCardItem_json, "res/").node;
            scrollView.addChild(cardInfo);
            this.cardInfo = cardInfo;
            this.setCardInfo(cardInfo, this.curindex, data);
            cardInfo.setPosition(cc.p(0, ((delta > 0)?delta:0) + (rowCount - this.curindex - 1)*rowHeight + 15));

            for (var i = data.card_arr.length - 1; i >= 0; i--) {
                (function (i) {
                    var node = $('scrollview.row' + i);
                    if (!node) {
                        node = ccs.load(res.NiuNiuZhanjiDetailItem_json, "res/").node;
                        node = new cc.Layer();
                        node.addChild(row0.getChildByName('row').clone());
                        node.setName('row' + i);
                        scrollView.addChild(node);
                    }
                    node.setPosition(cc.p(
                        -40,
                        innerHeight - (i) * rowHeight - ((i > that.curindex) ? (CardHeight+rowHeight) : rowHeight) + (delta > 0 ? delta : 0)
                    ));

                    var isJiesan = false;
                    var cardArr = [];
                    for (var j = 1; j <= data.card_arr[i].length - 1; j++) {
                        var arr = data.card_arr[i][j].split(',');
                        if (arr && arr.length == 5) {
                            cardArr.push(arr);
                        } else {
                            isJiesan = true;
                            break;
                        }
                    }

                    var setData = function (ref) {
                        // $('Image_3', ref).loadTexture((i % 2 == 0) ? res.history_detailcell2_png : res.history_detailcell1_png);
                        $("lb_xuhao", ref).setString('第' + (i + 1) + '局');
                        $("lb_time", ref).setString(timestamp2time(data.card_arr[i][0], "yyyy-mm-dd HH:MM"));
                        for (var j = 1; j <= cardArr.length; j++) {
                            if (data.result_arr[i][j] > 0) {
                                $("lb_score" + j, ref).setString('+' + data.result_arr[i][j]);
                                $("lb_score" + j, ref).setTextColor(cc.color(96, 55, 16));
                            } else {
                                $("lb_score" + j, ref).setString(data.result_arr[i][j]);
                                $("lb_score" + j, ref).setTextColor(cc.color(20, 87, 110));
                            }
                        }
                        if (that.curindex != i) {
                            $("btn_close", ref).loadTexture(res.history_detailclose2_png);
                        }
                        for (; j <= 9; j++) {
                            $("lb_score" + j, ref).setVisible(false);
                        }
                    };

                    //关闭按钮
                    TouchUtils.setOnclickListener($("row.btn_close", node), function () {
                        that.showCurSelect((that.curindex == i) ? -1:i);
                    });
                    TouchUtils.setOnclickListener($("row.Image_3", node), function () {
                        that.showCurSelect((that.curindex == i) ? -1:i);
                    }, {swallowTouches: false});

                    if (!isJiesan) {
                        setData($("row", node));
                    } else {
                        $("row.lb_xuhao", node).setString('房间解散');
                        $("row.lb_time", node).setString('房间解散');
                        $("row.lb_time", node).setPositionX(itemSize.width / 2);
                        for (var j = 1; j <= data.card_arr[i].length - 1; j++) {
                            $("row.lb_score" + j, node).setString('同意');
                            $("row.card.chipin" + j, node).setVisible(false);
                            $("row.card.card" + j, node).setVisible(false);
                        }
                        for (; j <= 9; j++) {
                            $("row.lb_score" + j, node).setVisible(false);
                            $("row.card.chipin" + j, node).setVisible(false);
                            $("row.card.card" + j, node).setVisible(false);
                        }
                    }
                })(i);
            }
            scrollView.innerHeight = innerHeight;
            scrollInnerHeight = innerHeight;
        },
        showCurSelect: function (cur) {
            var that = this;
            if(that.isMoving)  return;
            that.isMoving = true;
            this.curindex = cur;
            for (var k = this.data.card_arr.length - 1; k >= 0; k--) {
                (function(s){
                    var node = $('scrollview.row' + s);
                    if (node) {
                        if (that.curindex == s) {
                            $("row.btn_close", node).loadTexture(res.history_detailclose1_png);
                        } else {
                            $("row.btn_close", node).loadTexture(res.history_detailclose2_png);
                        }
                        var delta = that.scrollView.getContentSize().height - scrollInnerHeight;
                        var posy = scrollInnerHeight - (s) * rowHeight - ((s > that.curindex) ? (CardHeight+rowHeight) : rowHeight) + (delta > 0 ? delta : 0);
                        if(that.curindex == -1){
                            posy += 120;
                        }
                        node.runAction(cc.sequence(
                            cc.moveTo(0.2, cc.p(node.getPositionX(), posy)),
                            cc.callFunc(function(){
                                that.isMoving = false;
                                if(s == 0) {
                                    if (that.curindex == -1) {
                                        that.cardInfo.setVisible(false);
                                    } else {
                                        that.cardInfo.setVisible(true);
                                        that.cardInfo.setPositionY($('scrollview.row' + that.curindex).getPositionY() - CardHeight + 15);
                                        that.setCardInfo(that.cardInfo, that.curindex, that.data);
                                    }
                                }
                            })
                        ));
                    }
                })(k);
            }
        },
        setCardInfo: function(ref, i , data){
            var that = this;

            var cardArr = [];
            for (var k = 1; k <= data.card_arr[i].length - 1; k++) {
                var arr = data.card_arr[i][k].split(',');
                if (arr && arr.length == 5) {
                    cardArr.push(arr);
                }
            }
            for (var j = 1;j<=cardArr.length;j++) {
                $("card.card" + j, ref).setVisible(true);
                that.setPaiArr('card.card' + j, ref, cardArr[j-1]);

                //牛几
                var niuniunum = null;
                if (data['result2'] && data['result2'][i]) niuniunum = data['result2'][i][j];
                if (niuniunum == null || niuniunum == undefined) {
                    $("card.niuniu" + j, ref).setVisible(false);
                } else {
                    $("card.niuniu" + j, ref).setVisible(true);
                    if (niuniunum == 13) {//小牛
                        $("card.niuniu" + j, ref).loadTexture(res.DN_wuxiaoniu_png);
                    } else if (niuniunum == 12) {//五花
                        $("card.niuniu" + j, ref).loadTexture(res.DN_wuhuaniu_png);
                    } else if (niuniunum == 11) {//炸弹
                        $("card.niuniu" + j, ref).loadTexture(res.DN_zhadanniu_png);
                    } else if (niuniunum == 10) {
                        $("card.niuniu" + j, ref).loadTexture(res["DN_niuniu_png"]);
                    } else {
                        $("card.niuniu" + j, ref).loadTexture(res["DN_niu" + niuniunum + "_png"]);
                    }
                }
                //下注
                if (data.chipinvalue && data.chipinvalue[i]) {
                    $("card.chipin" + j, ref).setVisible(true);
                    var fenshu = (data.chipinvalue[i][j] <= -100) ? (0) : (data.chipinvalue[i][j]);
                    var n = 0;//庄
                    if (fenshu == 1) n = 6;
                    if (fenshu == 2) n = 6;
                    if (fenshu == 3 || fenshu == 4) n = 6;
                    if (fenshu >= 5 && fenshu <= 8) n = 6;
                    if (fenshu >= 9) n = 6;
                    var num = (data.chipinvalue[i][j] <= -100) ? (Math.abs(data.chipinvalue[i][j]) - 100) : (data.chipinvalue[i][j]);
                    if (num < 0) num = 1;
                    $("card.chipin" + j + ".fenshu", ref).setString('' + n);//0牛
                    $("card.chipin" + j + ".fenshu", ref).setScale((n == 0) ? 1 : 0.9);
                    $("card.chipin" + j + ".num", ref).setString(num);
                } else {
                    $("card.chipin" + j, ref).setVisible(false);
                }
            }
            for (; j <= 9; j++) {
                $("card.chipin" + j, ref).setVisible(false);
                $("card.niuniu" + j, ref).setVisible(false);
                $("card.card" + j, ref).setVisible(false);
            }
        },
        setPaiArr: function (nameStr, node, paiArr) {
            for (var i = 0; i < 5; i++) {
                var pai = $(nameStr + '.a' + i, node);
                var val = paiArr[i];
                var arr = getPaiNameByIdNN(val);
                setUIImageFrameByName(pai, arr, 'niuniu/card/poker.plist');
            }
        }
    });

    exports.HistoryDetailNiuNiu = HistoryDetailNiuNiu;
})(window);
