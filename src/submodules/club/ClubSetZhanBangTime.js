/**
 * Created by scw on 2018/6/1.
 */
(function () {
    var exports = this;

    var clubUrlTest = 'https://pay.yayayouxi.com/fy-club-api';

    var LoopTimeLayer = ccui.Layout.extend(
        {
            _canTouch: false,
            ctor: function (defnum, startnum, endnum) {
                this._super();
                var that = this;
                this._defnum = parseInt(defnum) || 0;
                this._snum = parseInt(startnum) || 0;
                this._enum = parseInt(endnum) || 10;
                this._cArr = [];

                var curDate = new Date();
                var curMonth = curDate.getMonth(); // 获取当前月份 */
                curDate.setMonth(curMonth + 1);//  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
                curDate.setDate(0);       // 将日期设置为0
                var dayAllNum =  curDate.getDate();//返回当月的天数 */

                if (this._snum <= this._enum){
                    for (var i = this._snum; i <= this._enum; i++) {
                        this._cArr.push(i)
                    }
                }else{
                    for (var i = this._snum; i<=dayAllNum; i++){
                        this._cArr.push(i)
                    }
                    for (var i =1; i<=this._enum; i++){
                        this._cArr.push(i)
                    }
                }

                this._index = this._cArr.indexOf(this._defnum) >= 0 ? this._cArr.indexOf(this._defnum) : 0;
                this.setContentSize(72, 59);
                this.setAnchorPoint(cc.p(0.5, 0.5));
                // this.setBackGroundColor(cc.color.GREEN);
                // this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                var scene = ccs.load(res.ClubTimeUnit_json, 'res/');
                this.addChild(scene.node);
                var $ = create$(this.getChildByName("Layer"));
                this._text = $('Text_1');
                this._text.setString(this._defnum < 10 ? '0' + this._defnum : this._defnum);
                this._arrow = $('arrow');
                return true;
            },
            getCurNum: function () {
                return this._cArr[this._index];
            },
            getArrowVisible: function () {
                return this._arrow.isVisible();
            },
            getCanTouch: function () {
                return this._canTouch;
            },
            changeCArrIndexAndText: function (ad) {
                this._index += ad;
                if (this._index > this._cArr.length - 1) {
                    this._index = 0;
                } else if (this._index < 0) {
                    this._index = this._cArr.length - 1;
                }
                this._text.setString(this._cArr[this._index] < 10 ? '0' + this._cArr[this._index] : this._cArr[this._index]);
            },
            setTouchState: function (cantouch) {
                this._canTouch = !!cantouch;
            },
            setArrowState: function (isvisible) {
                this._arrow.setVisible(!!isvisible);
            },
            setUnitColor: function (mcolor) {
                this._text.setTextColor(mcolor);
            },
            onEnter: function () {
                this._super();
                var that = this;
                this.touchlist = cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: false,
                    onTouchBegan: function (touch, event) {
                        var mrect = that.getBoundingBox();
                        if (!cc.rectContainsPoint(mrect, touch.getLocation())) {
                            return false;
                        }
                        if (!that._canTouch) {
                            return false;
                        }
                        var pl = that.getParent();
                        pl.setTimeUnitsChangeState(that.getTag());
                        return true;

                    },
                    onTouchMoved: function (touch, event) {
                    },
                    onTouchEnded: function (touch, event) {
                        var pl = that.getParent();
                        pl.setTimeUnitsTouchState(true);

                    }
                }, this);
            },
            onExit: function () {
                this._super();
                cc.eventManager.removeListener(this.touchlist);
            }
        }
    );

    var TouchLayer = cc.Layer.extend(
        {
            _oripos: null,
            ctor: function () {
                this._super();
                return true;
            },
            onEnter: function () {
                this._super();
                var that = this;
                var pl = this.getParent();

                this.touchlist = cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: false,
                    onTouchBegan: function (touch, event) {
                        that._oripos = touch.getLocation();

                        //cc.log('touch  test');
                        return true;

                    },
                    onTouchMoved: function (touch, event) {

                        var lpos = touch.getLocation();
                        var dis = lpos.y - that._oripos.y;

                        if (Math.abs(dis) < 10) {
                            return;
                        }
                        if (dis < 0) {
                            pl.changeTimeUnitsArrIndexAndText(-1);

                        } else if (dis > 0) {
                            pl.changeTimeUnitsArrIndexAndText(1);

                        }
                        that._oripos = touch.getLocation();

                    },
                    onTouchEnded: function (touch, event) {

                    }
                }, this);
            },
            onExit: function () {
                this._super();
                cc.eventManager.removeListener(this.touchlist)
            }
        }
    );

    var ClubTimeHelpLayer = cc.Layer.extend(
        {
            ctor: function () {
                this._super();
                var that = this;

                var $ = create$(loadNodeCCS(res.ClubTimeHelpLayer_json, this).node);

                $('Panel_1.Text_1').setVisible(false);
                $('Panel_1.Text_2').setVisible(true);
                $('Panel_1.Text_3').setVisible(false);
                $('Panel_1.Text_4').setVisible(false);
                $('Panel_1.Text_5').setVisible(false);

                TouchUtils.setOnclickListener($('btn_close'), function (node) {
                    that.removeFromParent();
                });

                return true;
            }
        }
    );

    var ClubSetZhanBangTime = cc.Layer.extend(
        {
            _$: null,
            _vstate: false,
            club_id : 0,
            ctor: function (data) {
                this._super();
                var ownerId = data['owner_uid'];
                var that = this;
                var opentime = data['start'] || '0:0';
                var endtime = data['end'] || '0:0';
                this._tagArr = [0, 1, 2, 3];
                var scene = loadNodeCCS(res.ClubShowTimeLayer_json, this);
                var $ = create$(scene.node);
                that.club_id = data['_id'];
                //今天的日期
                var nowDay =  timestamp2time((new Date()).valueOf()/1000,"dd");


                this._$ = $;
                $('btn_queren').setVisible(false);
                $('Text_9').setVisible(false);
                $('btn_guan').setVisible(false);
                $('Text_9_0').setString('开始时间');
                $('Text_9_0_0').setString('结束时间');


                $('Sprite_14.Text_5').setString('日');
                $('Sprite_14_0_0.Text_5').setString('日');
                $('Sprite_14_0.Text_5').setString('时');
                $('Sprite_14_0_1.Text_5').setString('时');

                $('title').setTexture('res/submodules/club/ClubShowTime/set_time.png');
                TouchUtils.setOnclickListener($('btn_close'), function (node) {
                    that.removeFromParent();
                });
                TouchUtils.setOnclickListener($('btn_help'), function (node) {
                    that.addChild(new ClubTimeHelpLayer());
                });

                TouchUtils.setOnclickListener($('btn_xiugai'), function (node) {
                    if (ownerId != gameData.uid) {
                        alert11('只有群主才可以设置时间');
                        return;
                    }
                    // that.getChildByTag(0).getChildByName('Layer').getChildByName('Text_1').setString(nowDay);
                    // that.getChildByTag(2).getChildByName('Layer').getChildByName('Text_1').setString(nowDay);

                    that.setTimeUnitsTouchState(true);
                    that.setOneTimeUnitArrowState(0, true);
                    that.setTimeUnitsColor(cc.color(54, 129, 202, 255));

                    $('btn_queren').setVisible(true);
                    $('btn_xiugai').setVisible(false);
                });
                TouchUtils.setOnclickListener($('btn_queren'), function (node) {
                    if (ownerId != gameData.uid) {
                        alert11('只有群主才可以设置开放时间');
                        return;
                    }
                    that.sendModifiedTime(data['_id']);
                });

                TouchUtils.setOnclickListener($('btn_kai'), function (node) {

                    if (ownerId != gameData.uid) {
                        alert11('只有群主才可以设置开放时间');
                        return;
                    }

                    that.clickstate = 1;
                    network.send(2103, {cmd: 'modifyHours', club_id: data['_id'], 'openingtime': 'closed'});
                });
                TouchUtils.setOnclickListener($('btn_guan'), function (node) {

                    if (ownerId != gameData.uid) {
                        alert11('只有群主才可以设置开放时间');
                        return;
                    }

                    that.clickstate = 2;
                    network.send(2103, {cmd: 'modifyHours', club_id: data['_id'], 'openingtime': 'open'});
                });


                var arr1 = opentime.split(':');
                var arr2 = endtime.split(':');

                var curDate = new Date();
                var curMonth = curDate.getMonth(); // 获取当前月份 */
                curDate.setMonth(curMonth + 1);//  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
                curDate.setDate(0);       // 将日期设置为0
                var dayAllNum =  curDate.getDate();//返回当月的天数 */

                var MaxDay = parseInt(nowDay) + 7 <= dayAllNum ?  parseInt(nowDay) + 7 :  parseInt(nowDay) + 7 - dayAllNum;


                var tmp0 = $('tky0');
                var ltlayer0 = new LoopTimeLayer(parseInt(arr1[0]), nowDay,MaxDay);
                ltlayer0.setPositionX(tmp0.getPositionX()+ (cc.winSize.width -1280)/2 );
                ltlayer0.setPositionY(tmp0.getPositionY());
                this.addChild(ltlayer0);
                ltlayer0.setTag(0);
                var tmp1 = $('tky1');
                var ltlayer1 = new LoopTimeLayer(parseInt(arr1[1]), 0, 23);
                ltlayer1.setPositionX(tmp1.getPositionX() + (cc.winSize.width -1280)/2);
                ltlayer1.setPositionY(tmp1.getPositionY());
                this.addChild(ltlayer1);
                ltlayer1.setTag(1)
                var tmp2 = $('tdy0');
                var ltlayer2 = new LoopTimeLayer(parseInt(arr2[0]), nowDay,MaxDay);
                ltlayer2.setPositionX(tmp2.getPositionX() + (cc.winSize.width -1280)/2);
                ltlayer2.setPositionY(tmp2.getPositionY());
                this.addChild(ltlayer2);
                ltlayer2.setTag(2)
                var tmp3 = $('tdy1');
                var ltlayer3 = new LoopTimeLayer(parseInt(arr2[1]), 0, 23);
                ltlayer3.setPositionX(tmp3.getPositionX() + (cc.winSize.width -1280)/2);
                ltlayer3.setPositionY(tmp3.getPositionY());
                this.addChild(ltlayer3);
                ltlayer3.setTag(3);
                this.setTimeUnitsColor(cc.color(128, 128, 128, 128));
                this.addChild(new TouchLayer());



                return true;
            },
            playVibrate: function () {
                if (this._vstate) {
                    return;
                }
                var that = this;
                this.runAction(
                    cc.sequence(
                        cc.callFunc(
                            function () {
                                that._vstate = true;
                                tvibrate(0.03);
                            }
                        ),
                        cc.delayTime(0.03),
                        cc.callFunc(
                            function () {
                                that._vstate = false;
                            }
                        )
                    )
                );
            },
            sendModifiedTime: function (clubId) {
                var that = this;
                var l0 = this.getChildByTag(0);
                var l1 = this.getChildByTag(1);
                var l2 = this.getChildByTag(2);
                var l3 = this.getChildByTag(3);

                var nowTime =  timestamp2time((new Date()).valueOf()/1000,"yyyy-mm");
                var  startTime = nowTime + '-' +  l0.getCurNum() + '+'+ l1.getCurNum() //+ ':00:00';
                var  endTime = nowTime + '-' +  l2.getCurNum() + '+'+ l3.getCurNum() //+ ':00:00';

                cc.log("====startTime=="+startTime);
                cc.log("=====endTime===="+endTime);
                showLoading('正在加载..');
                var uri = '?area=' + gameData.parent_area
                    + '&groupId=' + that.club_id + '@club'
                    + '&playerId=' + gameData.uid
                    + '&startTime=' +  startTime  //年月日 时0000
                    + '&endTime=' + endTime;
                var sign = Crypto.MD5('fy-club-stat' + gameData.parent_area + this.club_id + '@club' + gameData.uid).toString();
                console.log("/club/stat/getBigWinners" + uri + "&sign=" + sign);
                NetUtils.httpGet(clubUrlTest + "/club/stat/insCustomTime" + uri + "&sign=" + sign, function (data) {
                    hideLoading();
                    var data = JSON.parse(data);
                    alert11(data.errMsg);
                    if(data.status){
                        that.getParent().getCustomRankList();
                        that.removeFromParent(true);
                    }
                });

            },
            setOneTimeUnitArrowState: function (mtag, isvisible) {
                for (var i in this._tagArr) {
                    var ttag = this._tagArr[i];
                    var tlayer = this.getChildByTag(ttag);
                    if (ttag == mtag) {
                        tlayer.setArrowState(!!isvisible);

                    }
                }
            },
            setTimeUnitsArrowState: function (isvisible) {
                for (var i in this._tagArr) {
                    var ttag = this._tagArr[i];
                    var tlayer = this.getChildByTag(ttag);
                    tlayer.setArrowState(!!isvisible);
                }
            },
            setTimeUnitsChangeState: function (mtag) {
                for (var i in this._tagArr) {
                    var ttag = this._tagArr[i];
                    var tlayer = this.getChildByTag(ttag);
                    if (ttag == mtag) {
                        tlayer.setArrowState(true);
                        tlayer.setTouchState(true);
                    } else {
                        tlayer.setArrowState(false);
                        tlayer.setTouchState(false);
                    }
                }
            },
            setTimeUnitsTouchState: function (cantouch) {
                for (var i in this._tagArr) {
                    var ttag = this._tagArr[i];
                    var tlayer = this.getChildByTag(ttag);
                    tlayer.setTouchState(!!cantouch);
                }
            },
            setTimeUnitsColor: function (ncolor) {
                for (var i in this._tagArr) {
                    var ttag = this._tagArr[i];
                    var tlayer = this.getChildByTag(ttag);
                    tlayer.setUnitColor(ncolor);
                }
            },
            changeTimeUnitsArrIndexAndText: function (ad) {
                for (var i in this._tagArr) {
                    var ttag = this._tagArr[i];
                    var tlayer = this.getChildByTag(ttag);
                    if (tlayer.getCanTouch() && tlayer.getArrowVisible()) {
                        tlayer.changeCArrIndexAndText(ad);
                        this.playVibrate();
                    }
                }
            },
            btnStateCallBack: function () {
                if (this.clickstate == 1) {
                    this._$('btn_kai').setVisible(false);
                    this._$('btn_guan').setVisible(true);

                } else if (this.clickstate == 2) {
                    this._$('btn_guan').setVisible(false);
                    this._$('btn_kai').setVisible(true);
                }
                this.clickstate = 0;
            },
            btnStateCallBack2: function () {
                this.setTimeUnitsTouchState(false);
                this.setTimeUnitsArrowState(false);
                this._$('btn_queren').setVisible(false);
                this._$('btn_xiugai').setVisible(true);
                this.setTimeUnitsColor(cc.color(128, 128, 128, 128));
            },
            onEnter: function () {
                this._super();
                var that = this;
                this.list1 = cc.eventManager.addCustomListener('modifyHours', function (event) {
                    var data = event.getUserData();
                    if (data['result'] == 0) {
                        that.btnStateCallBack();
                    }
                });

                this.list2 = cc.eventManager.addCustomListener('setHours', function (event) {
                    var data = event.getUserData();
                    if (data['result'] == 0) {
                        alert11("修改成功");
                        that.btnStateCallBack2();
                    }

                });
            },
            onExit: function () {
                cc.eventManager.removeListener(this.list1);
                cc.eventManager.removeListener(this.list2);
                this._super();
            }

        }
    );
    exports.ClubSetZhanBangTime = ClubSetZhanBangTime;

})(window);
