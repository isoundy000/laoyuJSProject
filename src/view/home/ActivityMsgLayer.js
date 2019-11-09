/**
 * Created by wcc 广告轮播组件
 */

(function () {
    var exports = this;
    var $ = null;
    var ActivityMsgLayer = cc.Layer.extend({
        ctor: function (noticeData) {
            //test
            // gameData.opt_conf['haokafankui'] = 1;
            // gameData.opt_conf['goukayouhui'] = 1;

            this._super();
            this._noticeData = noticeData;
            var that = this;

            this.activityList = [];
            if (gameData.opt_conf && gameData.opt_conf['hongbaoyu']) {
                this.activityList.push(['hongbaoyu', '红包雨']);
            }
            if (gameData.opt_conf && gameData.opt_conf['jizhan']) {
                this.activityList.push(['jizhan', '集赞活动']);
            }
            if (gameData.opt_conf && gameData.opt_conf['chongfan']) {
                this.activityList.push(['chongfan', '赠卡回馈']);
            }
            if (gameData.opt_conf && gameData.opt_conf['haokafankui']) {
                this.activityList.push(['haokafankui', '代理福利']);
            }
            if (gameData.opt_conf && gameData.opt_conf['goukayouhui']) {
                this.activityList.push(['goukayouhui', '惠购整月']);
            }

            // var scene = ccs.load(res.ActivityMsgLayer_json, 'res/');
            loadNodeCCS(res.ActivityMsgLayer_json,this);
            // this.addChild(scene.node);
            // addModalLayer(scene.node);
            $ = create$(this.getChildByName('Scene'));

            TouchUtils.setOnclickListener($('root.main.btn_back'), function () {
                that.getParent().setMessageNum(0);

                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root.main.tabbg_0'), function () {
                if (that.tab == 1) {
                    that.setTab(2);
                } else {
                    that.setTab(1);
                }
            }, {effect: TouchUtils.effects.NONE});

            if (this.activityList.length == 0) {
                this.setTab(2);
            } else {
                this.setTab(1);
            }

            var contentstr = '';
            if (this._noticeData && this._noticeData[0] && this._noticeData[0]['Details']) {
                contentstr = this._noticeData[0]['Details'];
            }
            this.setContent(contentstr);
        },
        setTab: function (tab) {
            var that = this;
            if (this.tab == tab) {
                return;
            }
            this.tab = tab;
            if (tab == 1) {
                $('root.main.left').setVisible(true);
                $('root.main.right').setVisible(true);
                $('root.main.right_msg').setVisible(false);

                $('root.main.share').setVisible(false);
                $('root.main.tabbg.activitytab').setVisible(true);
                $('root.main.tabbg.activitymsg_activity1').setVisible(false);
                $('root.main.tabbg.activitymsg_activity2').setVisible(true);

                $('root.main.tabbg.msgtab').setVisible(false);
                $('root.main.tabbg.activitymsg_msg1').setVisible(true);
                $('root.main.tabbg.activitymsg_msg2').setVisible(false);
                if ($('root.main.right.content')) $('root.main.right.content').setVisible(false);

                if (this.activityList.length == 0) {
                    $('root.main.left.activitybtn0').setVisible(false);
                    $('root.main.left.activitybtn1').setVisible(false);
                    $('root.main.right.noactivity').setVisible(true);
                    $('root.main.share').setVisible(false);
                } else {
                    $('root.main.right.noactivity').setVisible(false);
                    var left = $('root.main.left');
                    TouchUtils.setOnclickListener($('root.main.share'), function () {
                        var Layer = ccs.load(res.JiZanLayer_json, 'res/').node;
                        var node = $('root', Layer);
                        // that.addChild(Layer);
                        WXUtils.captureAndShareToPyq(node, 0x88F0);//0x88F0

                        return;

                        // var url = 'http://118.31.169.179:8086/fyactivity/activity/draw/getRedRainLog';
                        var url = 'http://pay.yayayouxi.com/fyactivity/activity/draw/getRedRainLog';
                        var playerId = gameData.uid;
                        var area = 'yyzhuzhou';
                        var signKey = Crypto.MD5('feiyu-activity' + playerId + area);
                        var paradata = {playerId: playerId, area: area, signKey: signKey};
                        NetUtils.httpPost(url, paradata, function (data) {
                            //分享
                            var Layer = ccs.load(res.RedRainAwardLayer_json, 'res/').node;
                            var node = $('root', Layer);
                            // that.addChild(Layer);
                            $('all', node).setString(data['data']['sumCash'] + '元');
                            var scrollview = $('scrollview', node);
                            var innerHeight = scrollview.getContentSize().height;
                            if (data['data']['drawLog'].length * 40 >= innerHeight) {
                                innerHeight = data['data']['drawLog'].length * 40;
                            }
                            scrollview.innerHeight = innerHeight;
                            for (var k = 0; k < data['data']['drawLog'].length; k++) {
                                var time = $('time' + k, scrollview);
                                if (!time) {
                                    time = duplicateSprite($('time0', scrollview));
                                    time.setName('time' + k);
                                    scrollview.addChild(time);
                                }
                                time.setFontSize(26);
                                time.setString(data['data']['drawLog'][k]['createTime']);
                                time.setPosition(cc.p(120, innerHeight - k * 40 - 20));
                                var money = $('money' + k, scrollview);
                                if (!money) {
                                    money = duplicateSprite($('money0', scrollview));
                                    money.setName('money' + k);
                                    scrollview.addChild(money);
                                }
                                money.setFontSize(26);
                                money.setString(data['data']['drawLog'][k]['describe']);
                                money.setPosition(cc.p(260, innerHeight - k * 40 - 20));
                            }

                            if (!cc.sys.isNative)
                                return;
                            WXUtils.captureAndShareToPyq(node, 0x88F0);//0x88F0
                        }, function () {

                        });
                    });
                    left.getChildByName('activitybtn1').setVisible(false);
                    for (var i = 0; i < this.activityList.length; i++) {
                        (function (i) {
                            var activitybtn = left.getChildByName('activitybtn' + i);
                            if (!activitybtn) {
                                activitybtn = duplicateSprite($('root.main.left.activitybtn0'));
                                left.addChild(activitybtn);
                            }
                            activitybtn.setPositionY(490 - (i) * 100);
                            activitybtn.setVisible(true);
                            activitybtn.getChildByName('title').setString(that.activityList[i][1]);
                            activitybtn.getChildByName('title2').setString(that.activityList[i][1]);
                            TouchUtils.setOnclickListener(activitybtn, function () {
                                if (that.tab == 2) {
                                    return;
                                }
                                that.setLeftBtnTexture(i);
                                if (that.activityList[i][0] == 'hongbaoyu') {
                                    that.initHongbaoyuWeb();
                                } else if (that.activityList[i][0] == 'jizhan') {
                                    that.initJizanWeb();
                                } else if (that.activityList[i][0] == 'chongfan') {
                                    that.initAlert();
                                } else if (that.activityList[i][0] == 'haokafankui') {
                                    that.initAlert('res/image/ui/hall/pop_haokafankui.jpg');
                                } else if (that.activityList[i][0] == 'goukayouhui') {
                                    that.initAlert('res/image/ui/hall/pop_goukayouhui.jpg');
                                }
                            });
                        })(i);
                        this.setLeftBtnTexture(0);
                    }
                    if (this.activityList && this.activityList[0]) {
                        if (this.activityList[0][0] == 'hongbaoyu') {
                            this.initHongbaoyuWeb();
                        }
                        if (this.activityList[0][0] == 'haokafankui') {
                            that.initAlert('res/image/ui/hall/pop_haokafankui.jpg');
                        }
                    }
                }
            } else {
                $('root.main.right.noactivity').setVisible(false);
                $('root.main.tabbg.activitytab').setVisible(false);
                $('root.main.tabbg.activitymsg_activity1').setVisible(true);
                $('root.main.tabbg.activitymsg_activity2').setVisible(false);

                $('root.main.tabbg.msgtab').setVisible(true);
                $('root.main.tabbg.activitymsg_msg1').setVisible(false);
                $('root.main.tabbg.activitymsg_msg2').setVisible(true);

                $('root.main.left').setVisible(false);
                $('root.main.right').setVisible(false);
                $('root.main.right_msg').setVisible(true);
                $('root.main.share').setVisible(false);

                if (this.webView) {
                    this.webView.removeFromParent();
                    this.webView = null;
                }
                if (this.conetnt) {
                    this.conetnt.removeFromParent();
                    this.conetnt = null;
                }
            }
        },
        setLeftBtnTexture: function (index) {
            this.leftBtnIndex = index;
            var left = $('root.main.left');
            for (var i = 0; i < this.activityList.length; i++) {
                var activitybtn = left.getChildByName('activitybtn' + i);
                if (i == index) {
                    activitybtn.setTexture('res/image/ui/hall/activitymsg_btn.png');
                    var title = activitybtn.getChildByName('title');
                    var title2 = activitybtn.getChildByName('title2');
                    title2.setPosition(cc.p(activitybtn.getContentSize().width / 2, activitybtn.getContentSize().height / 2));
                    title2.setVisible(true);
                    title.setVisible(false);
                } else {
                    activitybtn.setTexture('res/image/ui/hall/activitymsg_btn2.png');
                    var title = activitybtn.getChildByName('title');
                    var title2 = activitybtn.getChildByName('title2');
                    title.setPosition(cc.p(activitybtn.getContentSize().width / 2, activitybtn.getContentSize().height / 2));
                    title.setVisible(true);

                    title2.setVisible(false);
                }
            }
        },
        initHongbaoyuWeb: function () {
            if (this.webView) {
                this.webView.removeFromParent();
                this.webView = null;
            }
            var that = this;
            var playerId = gameData.uid;
            var area = 'yyzhuzhou';
            var signKey = Crypto.MD5('feiyu-activity' + playerId + area);
            var webView = new ccui.WebView('https://pay.yayayouxi.com/activity-front/redBag/h5_zhuzhouRedBag/index.html?playerId=' + playerId + '&area=' + area + '&signKey=' + signKey + '&http://#');
            // webView.setColor(cc.color(255, 255, 0));
            webView.setContentSize(760, 540);
            webView.setAnchorPoint(0, 0);
            webView.setPosition(330, 60);
            this.addChild(webView);
            this.webView = webView;
        },
        initZhuaapanWeb: function () {
            if (this.webView) {
                this.webView.removeFromParent();
                this.webView = null;
            }
            var that = this;
            var playerId = gameData.uid;
            var area = 'yyzhuzhou';
            var signKey = Crypto.MD5('feiyu-activity' + playerId + area);
            var webView = new ccui.WebView('http://pay.yayayouxi.com/activity-front/zhuzhou_zhuanpan/?playerId=' + playerId + '&area=' + area + '&signKey=' + signKey);
            // webView.setColor(cc.color(255, 255, 0));
            webView.setContentSize(760, 540);
            webView.setAnchorPoint(0, 0);
            webView.setPosition(330, 60);
            this.addChild(webView);
            this.webView = webView;
        },
        initJizanWeb: function () {
            if (this.webView) {
                this.webView.removeFromParent();
                this.webView = null;
            }
            var webView = new ccui.WebView('http://pay.yayayouxi.com/activity-fronth5_zhuzhouEnjoy/');
            webView.setContentSize(760, 540);
            webView.setAnchorPoint(0, 0);
            webView.setPosition(330, 60);
            this.addChild(webView);
            this.webView = webView;
        },
        initAlert: function (src) {
            if (this.conetnt) {
                this.conetnt.removeFromParent();
                this.conetnt = null;
            }
            var conetnt = new cc.Sprite(src);
            conetnt.setPosition(715, 335);
            this.addChild(conetnt);
            this.conetnt = conetnt;
        },
        setContent: function (text) {
            this.scroll = $('root.main.right_msg.scrollview');//920 * 540
            var arr = text.split('\\n');
            text = arr.join('\n');
            var newtext = text.replace(/\\n/g, '\n');
            var content = new cc.LabelTTF();
            content.setFontSize(29);
            content.setFontName('res/image/fonts/FZZY.TTF');
            content.boundingWidth = 920;
            content.setAnchorPoint(cc.p(0, 1));
            content.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            // content.setColor(cc.color(255, 255, 255));
            content.setColor(cc.color(164, 123, 99));
            content.setString(newtext);
            this.scroll.addChild(content);

            var scrollviewH = content.getContentSize().height;
            if (scrollviewH <= 540) {
                scrollviewH = 540;
            }
            var posy = 540;
            if (content.getContentSize().height >= 540) {
                posy = content.getContentSize().height;
            }
            content.setPosition(cc.p(10, posy));
            this.scroll.setInnerContainerSize(cc.size(920, scrollviewH));
            console.log(scrollviewH);
            console.log(posy);
            console.log(content.getContentSize().height);
        },
    });
    exports.ActivityMsgLayer = ActivityMsgLayer;
})(window);