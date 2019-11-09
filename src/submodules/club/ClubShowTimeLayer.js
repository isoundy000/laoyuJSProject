/**
 * Created by scw on 2018/6/1.
 */
(function () {
    var exports = this;
    var LoopTimeLayer = ccui.Layout.extend(
        {
            _canTouch: false,
            ctor: function (defnum, startnum, endnum) {
                this._super();
                var that = this;
                this._defnum = defnum || 0;
                this._snum = startnum || 0;
                this._enum = endnum || 10;
                this._cArr = [];
                for (var i = this._snum; i <= this._enum; i++) {
                    this._cArr.push(i)
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
    var ClubDayangLayer = cc.Layer.extend(
        {
            ctor: function (stime, etime, type) {
                this._super();
                var that = this;
                var scene = loadNodeCCS(res.ClubDYYLayer_json, this);
                var $ = create$(scene.node);

                var arr1 = stime.split(':');
                var arr2 = etime.split(':');
                var s0 = arr1[0] < 10 ? '0' + arr1[0] : arr1[0];
                var s1 = arr1[1] < 10 ? '0' + arr1[1] : arr1[1];

                var e0 = arr2[0] < 10 ? '0' + arr2[0] : arr2[0];
                var e1 = arr2[1] < 10 ? '0' + arr2[1] : arr2[1];

                $('kytime').setString(s0 + ':' + s1);
                $('dytime').setString(e0 + ':' + e1);
                if (type == 2) {//开放
                    $('title_1').setVisible(false);
                    $('title_2').setVisible(true);
                    $('Text_1').setVisible(false);
                    $('Text_2').setVisible(false);
                    $('kytime').setVisible(false);
                    $('dytime').setVisible(false);
                }

                TouchUtils.setOnclickListener($('btn_qd'), function (node) {
                    that.removeFromParent();
                });

                return true;
            }
        }
    );
    var ClubTimeHelpLayer = cc.Layer.extend(
        {
            ctor: function () {
                this._super();
                var that = this;

                var $ = create$(loadNodeCCS(res.ClubTimeHelpLayer_json, this).node);

                $('Panel_1.Text_1').setVisible(true);
                $('Panel_1.Text_2').setVisible(false);
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
    var ClubShowTimeLayer = cc.Layer.extend(
        {
            _$: null,
            _vstate: false,
            ctor: function (data) {
                this._super();
                var ownerId = data['owner_uid'];
                var that = this;
                var openstate = data['openingtime'] || 'closed';
                var opentime = data['start'] || '0:0';
                var endtime = data['end'] || '0:0';
                this._tagArr = [0, 1, 2, 3];
                // var scene = ccs.load(res.ClubShowTLayer_json,'res/');
                // this.addChild(scene.node);
                // var $ = create$(this.getChildByName("Layer"));

                var scene = loadNodeCCS(res.ClubShowTimeLayer_json, this);
                var $ = create$(scene.node);

                this._$ = $;
                $('btn_queren').setVisible(false);

                TouchUtils.setOnclickListener($('btn_close'), function (node) {
                    that.removeFromParent();
                });


                TouchUtils.setOnclickListener($('btn_help'), function (node) {
                    that.addChild(new ClubTimeHelpLayer());
                });

                TouchUtils.setOnclickListener($('btn_xiugai'), function (node) {

                    if (ownerId != gameData.uid) {
                        alert11('只有群主才可以设置开放时间');
                        return;
                    }

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
                if (openstate == 'open') {
                    $('btn_kai').setVisible(true);
                    $('btn_guan').setVisible(false);
                } else if (openstate == 'closed') {
                    $('btn_kai').setVisible(false);
                    $('btn_guan').setVisible(true);
                }
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


                var tmp0 = $('tky0');
                var ltlayer0 = new LoopTimeLayer(parseInt(arr1[0]), 0, 23);
                ltlayer0.setPosition(cc.p(tmp0.getPositionX() + (cc.winSize.width/2-1280/2), tmp0.getPositionY()));
                this.addChild(ltlayer0);
                ltlayer0.setTag(0);
                var tmp1 = $('tky1');
                var ltlayer1 = new LoopTimeLayer(parseInt(arr1[1]), 0, 59);
                ltlayer1.setPosition(cc.p(tmp1.getPositionX() + (cc.winSize.width/2-1280/2), tmp1.getPositionY()));
                this.addChild(ltlayer1);
                ltlayer1.setTag(1)
                var tmp2 = $('tdy0');
                var ltlayer2 = new LoopTimeLayer(parseInt(arr2[0]), 0, 23);
                ltlayer2.setPosition(cc.p(tmp2.getPositionX() + (cc.winSize.width/2-1280/2), tmp2.getPositionY()));
                this.addChild(ltlayer2);
                ltlayer2.setTag(2)
                var tmp3 = $('tdy1');
                var ltlayer3 = new LoopTimeLayer(parseInt(arr2[1]), 0, 59);
                ltlayer3.setPosition(cc.p(tmp3.getPositionX() + (cc.winSize.width/2-1280/2), tmp3.getPositionY()));
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
                var l0 = this.getChildByTag(0);
                var l1 = this.getChildByTag(1);
                var l2 = this.getChildByTag(2);
                var l3 = this.getChildByTag(3);
                network.send(2103, {
                    cmd: 'setHours',
                    club_id: clubId,
                    'start': l0.getCurNum() + ':' + l1.getCurNum(),
                    'end': l2.getCurNum() + ':' + l3.getCurNum()
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
    exports.ClubShowTimeLayer = ClubShowTimeLayer;
    exports.ClubDayangLayer = ClubDayangLayer;

})(window);
