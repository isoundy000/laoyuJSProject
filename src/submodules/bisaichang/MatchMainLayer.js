/**
 * Created by scw on 2018/6/4.
 */
(function () {
    var $ = null;
    var exports = this;
    var CustomTableViewCell = cc.TableViewCell.extend(
        {
            _$: null,
            ctor: function () {
                this._super();
                this._recordArr = [];
                var scene = ccs.load(res.MatchItem_json, 'res/');
                this.addChild(scene.node)
                this._$ = create$(this.getChildByName("Layer"));

                return true;
            },
            draw: function (ctx) {
                this._super(ctx);
            },
            get$: function () {
                return this._$;
            },
            getNode: function () {
                return this.children[0];
            },
            onEnter: function () {
                this._super();

            },
            onExit: function () {
                this._scene=null;
                if (this._listener) {
                    cc.eventManager.removeListener(this._listener);
                }
                this._super();

            }
        }
    );
    var MatchMainLayer = cc.Layer.extend(
        {
            ctor: function () {
                this._super();
                var that = this;
                this._time = 0;
                this.matchArr = [];
                this._curMatchId = 0;

                this._canSign = true;


                //this.btnNameArr = ['btn_mfs', 'btn_fks', 'btn_hbs', 'btn_sws'];
                // var scene = ccs.load(res.MatchMainLayer_json);
                // this.addChild(scene.node);

                var scene=loadNodeCCS(res.MatchMainLayer_json,this);
                this._scene=scene;


                $ = create$(this.getChildByName("Layer"));


                TouchUtils.setOnclickListener($('root.btn_back'), function () {
                    that.removeFromParent();
                });


                // TouchUtils.setOnclickListener($('root.btn_mfs'), function () {
                //     that.changeBtnAndViewState('btn_mfs');
                //
                // });
                // TouchUtils.setOnclickListener($('root.btn_fks'), function () {
                //     that.changeBtnAndViewState('btn_fks');
                //
                // });
                // TouchUtils.setOnclickListener($('root.btn_hbs'), function () {
                //     that.changeBtnAndViewState('btn_hbs');
                //
                // });
                // TouchUtils.setOnclickListener($('root.btn_sws'), function () {
                //     that.changeBtnAndViewState('btn_sws');
                //
                // });
                this.updateFk = cc.eventManager.addCustomListener('updateFk', function (event) {
                    // network.addListener(3013, function (data) {
                    var data = event.getUserData();
                    var numOfCards = data["numof_cards"];
                    if (numOfCards && numOfCards.length > 0) {
                        $('root.fklb').setString(numOfCards[1]);
                    }
                });

                TouchUtils.setOnclickListener($('root.btn_chengji'), function () {
                    // showLoading('正在获取数据..');
                    //network.send(3333, {cmd: 'getMatchRecord', params: {}});

                    that.addChild(new MatchResultListLayer(that._recordArr),2);

                });

                $('root.fklb').setString(gameData.numOfCards[1]);

                TouchUtils.setOnclickListener($('root.btn_fk'), function () {
                   if(window.maLayer){
                       window.maLayer.clickShop(1);
                   }
                });

                this.getVersion();

                return true;
            },
            getVersion: function () {
                var subArr = SubUpdateUtils.getLocalVersion();
                var sub = "";
                if(subArr)  sub = subArr['bisaichang'];

                var versiontxt = window.curVersion + "-" + sub;
                if(cc.sys.os == cc.sys.OS_IOS && versiontxt){
                    var regx = new RegExp('\\.', 'g');
                    versiontxt = versiontxt.replace(regx, '');
                }
                var version = new ccui.Text();
                version.setFontSize(15);
                version.setTextColor(cc.color(255, 255, 255));
                version.setPosition(cc.p(cc.winSize.width - 80, 10));
                version.setAnchorPoint(cc.p(1, 0.5));
                version.setString(versiontxt);
                this.addChild(version, 2);
            },
            freshFk: function () {
                $('root.fklb').setString(gameData.numOfCards[1]);
            },
            checkGetState: function (arr) {
                var tipcount = 0;
                for (var i in arr) {
                    var data = arr[i];
                    var isget = data['isGet'];
                    var reward = data['rewardList'];
                    if (reward && reward.length > 0 && isget == 0) {//有奖励未领取
                        tipcount += 1;
                    }
                }
                if (tipcount > 0) {
                    $('root.btn_chengji.tip').setVisible(true);
                    $('root.btn_chengji.tip.num').setString(tipcount);
                } else {
                    $('root.btn_chengji.tip').setVisible(false);
                }
            },
            startFreshMatchList: function (dt) {
                this.scheduleOnce(
                    function () {
                        showLoading('正在刷新比赛列表..');
                        network.send(3333, {cmd: 'getMatchList', params: {}});
                    },
                    dt
                );
            },
            onEnter: function () {
                this._super();
                var that = this;
                showLoading('正在获取数据..');
                network.send(3333, {cmd: 'getMatchList', params: {}});
                network.send(3333, {cmd: 'setPushState', params: {type: 1}});
                network.send(3333, {cmd: 'getMatchRecord', params: {}});
                this.schedule(this.didTimeCount, 1);
                this.list_getRank = cc.eventManager.addCustomListener('match_getRank', function (event) {
                    hideLoading();
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var mtop = data['myTop'] || 0;
                        var ttop = data['totalTop'] || 0;

                        var wl = that.getChildByName('waitlayer');
                        if (wl) {
                            wl.freshRank('当前排名:' + mtop + '/' + ttop);
                        }

                    } else {
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });

                this.list_lunkong = cc.eventManager.addCustomListener("match_LunKong", function (event) {
                    var data = event.getUserData();
                    var code = data['errorCode'];
                    if (!code) {

                        // var matchInfo=data['match_info'];
                        // var outline=matchInfo['out_line']||0;
                        var mwl = new MatchKwxWaitLayer(0, 0);
                        mwl.setName('waitlayer');
                        that.addChild(mwl,10);

                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true);
                    }
                });
                this.list_getMatchList = cc.eventManager.addCustomListener("match_getMatchList", function (event) {


                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        that.freshBisai(data);

                        var ttime=data['nextTime']||0;
                        if(ttime>0&&ttime<=600){
                            that.startFreshMatchList(ttime);
                        }

                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true);
                    }


                });
                this.list_getMatchRecord = cc.eventManager.addCustomListener("match_getMatchRecord", function (event) {

                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var arr = data['recordList'] || [];
                        that._recordArr = arr;

                        that.checkGetState(arr);
                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });

                this.list_signup = cc.eventManager.addCustomListener("match_signup", function (event) {

                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        that.signUpSuccess();
                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                    that._curMatchId = 0;

                });
                this.list_cancel = cc.eventManager.addCustomListener("match_cancel", function (event) {


                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        that.signCancelSuccess();
                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                    that._curMatchId = 0;

                });

                this.list_putMatchInfo = cc.eventManager.addCustomListener("match_putMatchInfo", function (event) {

                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {

                        var matchData = data['match'];
                        var matchId = matchData['matchId'];
                        var snum = matchData['signupNum'];
                        var tindex = _.findIndex(that.matchArr, function (obj) {
                            return obj['matchId'] == matchId
                        })
                        if (tindex >= 0) {
                            var tdata = that.matchArr[tindex];
                            tdata['signupNum'] = snum;


                            var tb = that._scene.node.getChildByName('bstableview');
                            tb.updateCellAtIndex(that.matchArr.length - 1 - tindex);


                        }
                        hideLoading();


                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }

                });

                this.list_getPromotionState = cc.eventManager.addCustomListener("match_getPromotionState", function (event) {
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {

                        var stage = data['stage'];
                        var tstage = data['stage_total'];
                        var jlayer = that.getChildByName('jinjilayer');
                        if (!jjlayer) {
                            var jjlayer = new MatchJinJiLayer(stage, tstage, data);
                            jjlayer.setName('jinjilayer');
                            that.addChild(jjlayer, 11);
                        } else {
                            jlayer.freshInfo(data);
                        }

                        hideLoading();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });

                this.list_putMatchRecord = cc.eventManager.addCustomListener("match_putMatchRecord", function (event) {//比赛结果
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var record = data['record'];
                        var rlayer = new MatchRewardLayer(record);
                        that.addChild(rlayer, 12);
                        rlayer.showAnim();

                    } else {
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });
                if (gameData.isLunKong) {
                    // var matchinfo=gameData.matchInfo;
                    // var score=0;
                    // if(matchinfo){
                    //     score=matchinfo['out_line']||0;
                    // }
                    var mwl = new MatchKwxWaitLayer(0, 0);
                    mwl.setName('waitlayer');
                    that.addChild(mwl, 10);
                }
            },
            didTimeCount: function (dt) {

                this._time++;
                if (this._time >= 420) {
                    network.send(3333, {cmd: 'setPushState', params: {type: 1}});
                    this._time = 0;
                }
            },
            onExit: function () {
                this._super();
                network.send(3333, {cmd: 'setPushState', params: {type: 0}});
                cc.eventManager.removeListener(this.list_getMatchList);
                cc.eventManager.removeListener(this.list_getMatchRecord);
                cc.eventManager.removeListener(this.list_signup);
                cc.eventManager.removeListener(this.list_cancel);
                cc.eventManager.removeListener(this.list_putMatchInfo);
                cc.eventManager.removeListener(this.list_lunkong);

                cc.eventManager.removeListener(this.list_getPromotionState);
                cc.eventManager.removeListener(this.list_putMatchRecord);
                cc.eventManager.removeListener(this.list_getRank);
                this.unscheduleAllCallbacks();


            },
            // changeBtnAndViewState: function (bname) {
            //     if(this._sbtname==bname){
            //         return;
            //     }
            //     for (var i=0;i<this.btnNameArr.length;i++) {
            //         var btn = $('root').getChildByName(this.btnNameArr[i]);
            //         var text=btn.getChildByName('text');
            //         if (this.btnNameArr[i] != bname) {
            //             btn.setTexture('res/bisaichang/img/btnbg1.png');
            //             text.enableOutline(cc.color(52,139,200),2);
            //         } else {
            //             btn.setTexture('res/bisaichang/img/btnbg0.png');
            //             text.enableOutline(cc.color(199,131,24),2);
            //
            //             this._sbtname=bname;
            //
            //             this.freshBisai(i);
            //         }
            //     }
            //
            // },
            freshBisai: function (data) {


                this.matchArr = data['matchList'] || [];

                if (this.matchArr.length == 0) {
                    $('root.zanwu').setVisible(true);
                }
                var tb = this._scene.node.getChildByName('bstableview');
                if (tb) {
                    // tb.removeFromParent();
                    tb.reloadData();
                }else{
                    var tableViewSize = $('root.tableview').getSize();
                    var tableViewAnchor = $('root.tableview').getAnchorPoint();
                    var tableViewPosition = $('root.tableview').getPosition();
                    var tableView = new cc.TableView(this, cc.size(tableViewSize.width, tableViewSize.height));
                    tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                    tableView.setPosition(tableViewPosition);
                    tableView.setAnchorPoint(tableViewAnchor);
                    tableView.setDelegate(this);
                    this._scene.node.addChild(tableView);
                    //tableView.reloadData();
                    tableView.setName('bstableview');
                }



            },
            tableCellTouched: function (table, cell) {
                //cc.log('here  touched');
            },
            tableCellSizeForIndex: function (table, idx) {
                return cc.size(1148, 150);
            },
            tableCellAtIndex: function (table, idx) {
                var that = this;
                var cell = table.dequeueCell();
                if (!cell) {
                    cell = new CustomTableViewCell();
                }
                var data = this.matchArr[this.matchArr.length - 1 - idx];
                var state = data['state'];
                var isopen = data['signupState'];
                if(isopen==undefined){
                    isopen=1;
                }
                var matchId = data['matchId'];

                var matchType=data['matchType'];
                var node = cell.getNode();
                var tbv = $('root.tableview');
                var ancx = tbv.getAnchorPoint().x;
                var ancy = tbv.getAnchorPoint().y;
                var par = tbv.getParent();
                var pos = tbv.getPosition();
                var wpos = par.convertToWorldSpace(pos);
                var spos = cc.p(wpos.x - ancx * tbv.getContentSize().width, wpos.y - ancy * tbv.getContentSize().height);
                var trect = cc.rect(spos.x, spos.y, tbv.getContentSize().width, tbv.getContentSize().height);


                var $2 = cell.get$();
                $2('bstitle').setString(data['name'] || '');
                $2('wanfa').setString(data['wanFa'] || '');
                $2('miaoshu.ms1').setString(data['kaiSaiShiJian'] || '');
                $2('miaoshu.ms2').setString(data['kaiSaiTiaoJian'] || '');
                $2('miaoshu.ms3').setString(data['baoMingFei'] || '');



                $2('btn_bm.num1').setString(data['signupNum'] % data['mixNum'] + '');
                $2('btn_qx.num1').setString(data['signupNum'] % data['mixNum'] + '');
                $2('btn_bm.num2').setString(data['mixNum']);
                $2('btn_qx.num2').setString(data['mixNum']);

                cc.log('mixNum is=============:',data['mixNum']);
                $2('btn_bm.num3').setString(data['signupNum']);
                $2('btn_qx.num3').setString(data['signupNum']);

                if(matchType==2){

                    $2('btn_bm.num3').setVisible(true);
                    $2('btn_qx.num3').setVisible(true);
                    $2('btn_bm.num1').setVisible(false);
                    $2('btn_qx.num1').setVisible(false);
                    $2('btn_qx.xg').setVisible(false);
                    $2('btn_bm.xg').setVisible(false);
                    $2('btn_bm.num2').setVisible(false);
                    $2('btn_qx.num2').setVisible(false);
                }else{
                    $2('btn_bm.num3').setVisible(false);
                    $2('btn_qx.num3').setVisible(false);
                    $2('btn_bm.num1').setVisible(true);
                    $2('btn_qx.num1').setVisible(true);
                    $2('btn_qx.xg').setVisible(true);
                    $2('btn_bm.xg').setVisible(true);
                    $2('btn_bm.num2').setVisible(true);
                    $2('btn_qx.num2').setVisible(true);
                }

                var iconurl = data['ioc']
                var bsicon = $2('bsicon');

                cc.textureCache.addImageAsync(iconurl, function (texture) {
                    bsicon.setTexture(texture);
                }, null);

                var bg = $2('bg');
                var func = null;
                var tnode = null;
                var mapId=data['mapid']||0;
                if (isopen == 1) {
                    if (state == 0) {
                        var signType = data['signType'];
                        tnode = $2('btn_bm');
                        func = function () {
                            if (!that._canSign) {
                                return;
                            }
                            that._canSign = false;
                            that._curMatchId = matchId;
                            if (signType == 1) {//分享报名
                                that.addChild(new MatchShareTipLayer(function () {
                                    that.shareAndSignUp(mapId);
                                }));
                                // SubUpdateUtils.checkUpdateSubByMapId(mapId,function(){
                                //     that.addChild(new MatchShareTipLayer(function () {
                                //         that.shareAndSignUp(mapId);
                                //     }));
                                // });
                            } else {
                                SubUpdateUtils.checkUpdateSubByMapId(mapId,function(){that.doSignUp()});
                            }
                            that.scheduleOnce(function () {
                                that._canSign = true
                            }, 1);
                        };
                    } else if (state == 1) {
                        tnode = $2('btn_qx');
                        func = function () {
                            that._curMatchId = matchId;
                            showLoading('正在取消报名..');
                            network.send(3333, {cmd: 'cancel', params: {entranceId: matchId}});
                        };
                    }
                } else {
                    tnode = $2('btn_wk');
                }
                $2('btn_bm').setVisible(false);
                $2('btn_qx').setVisible(false);
                $2('btn_wk').setVisible(false);
                if (tnode) {
                    tnode.setVisible(true);
                }
                var textxq = data['biSai'] || '';
                var textjl = data['jiangLi'] || '';
                cell._listener = TouchUtils.addScrollTouchListener(bg, tnode, function () {

                    if (that.getChildByName('detaillayer')) {
                        return;
                    }
                    var mdl = new MatchDetailLayer(textjl, textxq);
                    mdl.setName('detaillayer');
                    that.addChild(mdl);
                }, func, trect);

                return cell;

            },
            doSignUp:function(){
                showLoading('正在报名..');

                network.send(3333, {cmd: 'signup', params: {entranceId: this._curMatchId}});
            },
            shareAndSignUp: function (mapId) {
                var that=this;
                var scene = ccs.load(res.MatchShareNode_json, 'res/');
                WXUtils.captureAndShareToWX(scene.node, 0x88F0, 2);
                //showLoading('正在报名..');


                this.scheduleOnce(function () {
                    //network.send(3333, {cmd: 'signup', params: {entranceId: this._curMatchId}});

                    //SubUpdateUtil.showCreateMatchRoom('bs_kawuxing');
                    SubUpdateUtils.checkUpdateSubByMapId(mapId,function(){that.doSignUp()});
                }, 1);

            },
            signUpSuccess: function () {
                var tmid = this._curMatchId;
                var tindex = _.findIndex(this.matchArr, function (obj) {
                    return obj['matchId'] == tmid;
                });
                if (tindex >= 0) {
                    var tdata = this.matchArr[tindex];
                    tdata['state'] = 1;


                    var xhms = tdata['xiaoHaoMiaoShu'];
                    if (xhms) {
                        showToast(xhms, {fontName: "res/fonts/FZZY.TTF", time1: 0.1, time2: 0.2});
                    }
                    var tb = this._scene.node.getChildByName('bstableview');
                    tb.updateCellAtIndex(this.matchArr.length - 1 - tindex);

                    network.send(3013, {});//刷新房卡
                }


            },
            signCancelSuccess: function (id) {

                var tmid = this._curMatchId;
                var tindex = _.findIndex(this.matchArr, function (obj) {
                    return obj['matchId'] == tmid;

                });
                if (tindex >= 0) {
                    var tdata = this.matchArr[tindex];
                    tdata['state'] = 0;

                    var xhms = tdata['xiaoHaoMiaoShu'];
                    if (xhms) {
                        var str = '';
                        if (xhms == '您已报名成功') {
                            str = '取消报名成功';
                        } else {
                            str = '取消报名成功，报名费已返还';
                        }
                        showToast(str, {fontName: "res/fonts/FZZY.TTF", time1: 0.2, time2: 0.1});
                    }


                    var tb = this._scene.node.getChildByName('bstableview');
                    tb.updateCellAtIndex(this.matchArr.length - 1 - tindex);
                    network.send(3013, {});//刷新房卡
                }
            },
            numberOfCellsInTableView: function (table) {
                return this.matchArr.length;
            }
        }
    );

    exports.MatchMainLayer = MatchMainLayer;
})(window);