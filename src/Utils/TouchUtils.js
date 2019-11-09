(function (exports) {

    var TouchUtils = {
        effects: {
            NONE: "NONE"
            , SEPIA: "SEPIA"
            , ZOOM: "ZOOM"
        },
        isTouchMe: function (target, touch, event, deltaSize, rect) {
            deltaSize = deltaSize || cc.size(0, 0);

            //Get the position of the current point relative to the button
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = rect || cc.rect(-deltaSize.width / 2, -deltaSize.height / 2, s.width + deltaSize.width, s.height + deltaSize.height);

            if (target.touchRect) {//设置触摸区域
                rect = target.touchRect;
            }
            //Check the click area
            if (cc.rectContainsPoint(rect, locationInNode)) {
                var flag = true;
                var t = target;
                while (true) {
                    if (t == null)
                        break;
                    if (!t.isVisible() || t.getOpacity() == 0) {
                        flag = false;
                        break;
                    }
                    t = t.getParent();
                }
                return !!flag;
            }
            return false;
        },
        //设置不能点击
        setClickDisable: function (node, disable) {
            node.disable = disable;
        },
        setTouchRect: function (node, rect) {
            node.touchRect = rect;
        },
        _setOnTouchListener: function (node, options) {
            //if (!node)
            //    return;


            if (typeof options['swallowTouches'] === 'undefined')
                options['swallowTouches'] = true;

            if (!node.getUserData())
                node.setUserData({});
            var userData = node.getUserData();

            if (userData.listener)
                cc.eventManager.removeListener(userData.listener);

            var delta = 0;
            var deltaSize = cc.size(delta, delta);

            var sepiaVal = 0.7;

            var zoomDuration = 0;
            var zoomVal = 1.1 * (node.getScaleX() || 1);
            var zoomEnd = 1 * (node.getScaleX() || 1);

            var isStillInside = false;


            var beginPos = 0;
            var endPos = 0;

            var MAX_TOUCH_MOVE = 6.0;

            userData.listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: options['swallowTouches'],
                onTouchBegan: function (touch, event) {
                    if (node.disable) {
                        return false;
                    }
                    beginPos = touch.getLocation();
                    if (TouchUtils.isTouchMe(node, touch, event, deltaSize)) {
                        if (options.effect === TouchUtils.effects.SEPIA)
                            Filter.sepia(node, sepiaVal);
                        else if (options.effect === TouchUtils.effects.ZOOM)
                            node.runAction(cc.scaleTo(zoomDuration, zoomVal, zoomVal));
                        if (options.onTouchBegan)
                            options.onTouchBegan(node, touch, event);
                        isStillInside = true;
                        var sound = options['sound'] || 'vButtonClick';
                        if (sound != 'no') {
                            if (sound == 'close') {
                                playEffect('effect_close');
                            } else if (sound == 'return') {
                                playEffect('effect_return');
                            } else if (sound == 'tab') {
                                playEffect('effect_tab');
                            } else {
                                playEffect(sound);
                            }
                        }
                        return true;
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    if (options.onTouchMoved && options.onTouchMoved(node, touch, event))
                        return true;
                    var ret = TouchUtils.isTouchMe(node, touch, event, deltaSize);
                    if (ret && !isStillInside) {
                        if (options.effect === TouchUtils.effects.SEPIA)
                            Filter.sepia(node, sepiaVal);
                        else if (options.effect === TouchUtils.effects.ZOOM)
                            addAction(node, cc.scaleTo(zoomDuration, zoomVal, zoomVal));
                        isStillInside = true;
                        if (options.onTouchMoveIn)
                            options.onTouchMoveIn(node, touch, event);
                    }
                    else if (!ret && isStillInside) {
                        if (options.effect === TouchUtils.effects.SEPIA)
                            Filter.remove(node);
                        else if (options.effect === TouchUtils.effects.ZOOM)
                            addAction(node, cc.scaleTo(zoomDuration, zoomEnd, zoomEnd));
                        isStillInside = false;
                        if (options.onTouchMoveOut)
                            options.onTouchMoveOut(node, touch, event);
                    }
                },
                onTouchEnded: function (touch, event) {
                    endPos = touch.getLocation();
                    if (options.isScroll && cc.pDistance(endPos, beginPos) > MAX_TOUCH_MOVE) {
                        Filter.remove(node);
                        return;
                    }
                    try {
                        if (options.onTouchEndedWithoutCheckTouchMe)
                            options.onTouchEndedWithoutCheckTouchMe(node, touch, event);
                        if (TouchUtils.isTouchMe(node, touch, event, deltaSize)) {
                            if (options.effect === TouchUtils.effects.SEPIA)
                                Filter.remove(node);
                            else if (options.effect === TouchUtils.effects.ZOOM)
                                addAction(node, cc.scaleTo(zoomDuration, zoomEnd, zoomEnd));
                            if (options.onTouchEnded)
                                options.onTouchEnded(node, touch, event);
                            return true;
                        }
                        if (options.onTouchCancelled)
                            options.onTouchCancelled(node, touch, event);
                    } catch (e) {
                        console.log(e.message + '\n' +e.stack);
                        //alertError(111, e, {});
                    }
                    return false;
                }
            });

            cc.eventManager.addListener(userData.listener, node);
        },
        setOnclickListener: function (node, cb, options) {
            if (!node) return;

            node.onclickCallBack = cb || null;
            var effect = (options && options.effect) ? options.effect : TouchUtils.effects.SEPIA;

            TouchUtils._setOnTouchListener(node, _.extend({
                effect: effect
                , onTouchEnded: cb
            }, options || {}));
        },
        setOntouchListener: function (node, cb, options) {
            TouchUtils._setOnTouchListener(node, _.extend({
                effect: TouchUtils.effects.SEPIA
                , onTouchBegan: cb
            }, options || {}));
        },
        setListeners: function (node, options) {
            TouchUtils._setOnTouchListener(node, _.extend({
                effect: TouchUtils.effects.NONE
            }, options || {}));
        },
        removeListeners: function (node) {
            var userData = node.getUserData() || {};
            if (userData.listener) {
                cc.eventManager.removeListener(userData.listener);
                delete userData.listener;
            }
        },
        addScrollTouchListener: function (node1, node2, cb1, cb2, trect) {
            var oripos = null;
            var par1 = node1.getParent();
            var anc1x = node1.getAnchorPoint().x;
            var anc1y = node1.getAnchorPoint().y;
            var par2 = null;
            var anc2x = null;
            var anc2y = null;
            if (node2) {
                par2 = node2.getParent();
                anc2x = node2.getAnchorPoint().x;
                anc2y = node2.getAnchorPoint().y;
            }
            var listener = cc.EventListener.create(
                {
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: false,
                    onTouchBegan: function (touch, event) {
                        if (trect && !cc.rectContainsPoint(trect, touch.getLocation())) {
                            return false;
                        }
                        var pos1 = node1.getPosition();
                        var wpos1 = par1.convertToWorldSpace(pos1);
                        var spos1 = cc.p(wpos1.x - anc1x * node1.getContentSize().width, wpos1.y - anc1y * node1.getContentSize().height);
                        var rect1 = cc.rect(spos1.x, spos1.y, node1.getContentSize().width, node1.getContentSize().height);
                        if (node2) {
                            var pos2 = node2.getPosition();
                            var wpos2 = par2.convertToWorldSpace(pos2);
                            var spos2 = cc.p(wpos2.x - anc2x * node2.getContentSize().width, wpos2.y - anc2y * node2.getContentSize().height);
                            var rect2 = cc.rect(spos2.x, spos2.y, node2.getContentSize().width, node2.getContentSize().height);
                        }
                        if (cc.rectContainsPoint(rect1, touch.getLocation())) {
                            oripos = touch.getLocation();
                            if (node2 && cc.rectContainsPoint(rect2, touch.getLocation()) && cb2) {
                                Filter.sepia(node2, 0.7);
                            }
                            playEffect('vButtonClick');
                            return true;
                        }
                        return false;
                    },
                    onTouchMoved: function (touch, event) {
                        if (node2) {
                            var pos2 = node2.getPosition();
                            var wpos2 = par2.convertToWorldSpace(pos2);
                            var spos2 = cc.p(wpos2.x - anc2x * node2.getContentSize().width, wpos2.y - anc2y * node2.getContentSize().height);
                            var rect2 = cc.rect(spos2.x, spos2.y, node2.getContentSize().width, node2.getContentSize().height);
                            if (!cc.rectContainsPoint(rect2, touch.getLocation()) && cb2) {
                                Filter.remove(node2);
                            }
                        }
                    },
                    onTouchEnded: function (touch, event) {
                        var lpos = touch.getLocation();
                        var dis = lpos.y - oripos.y;
                        if (node2) {
                            var pos2 = node2.getPosition();
                            var wpos2 = par2.convertToWorldSpace(pos2);
                            var spos2 = cc.p(wpos2.x - anc2x * node2.getContentSize().width, wpos2.y - anc2y * node2.getContentSize().height);
                            var rect2 = cc.rect(spos2.x, spos2.y, node2.getContentSize().width, node2.getContentSize().height);
                            if (cc.rectContainsPoint(rect2, touch.getLocation()) && cb2) {
                                Filter.remove(node2);
                            }
                        }
                        if (Math.abs(dis) < 10) {
                            if (node2 && cc.rectContainsPoint(rect2, touch.getLocation())) {
                                if (cb2 && typeof cb2 == 'function') {
                                    cb2();
                                }
                            } else {
                                if (cb1 && typeof cb1 == 'function') {
                                    cb1();
                                }
                            }
                        }
                    }
                }
            );
            return cc.eventManager.addListener(listener, node1);
        }
    };

    exports.TouchUtils = TouchUtils;

})(this);