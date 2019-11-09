(function (exports) {

    exports.runAtNextFrame = function (func, that) {
        setTimeout(func.bind(that || window), 0)
    };

    cc.Node.prototype.checkChildrenValid = function () {
        if (!cc.sys.isObjectValid(this))
            return false;
        var children = this.getChildren();
        if (children.length) {
            for (var i = 0; i < children.length; i++)
                if (!children[i].checkChildrenValid())
                    return false;
        }
        return true;
    };

    cc.Node.prototype.isObjectValid = function () {
        return cc.sys.isObjectValid(this);
    };

    cc.Node.prototype.runActionRecursively = function (action) {
        this.runAction(action);
        for (var i = 0; i < this.children.length; i++)
            this.runActionRecursively.call(this.children[i], action.clone());
    };
    
    cc.Sprite.prototype.playAnimByFilenames = function (filenames, speed, isLoop, endCb) {
        var animFrames = [];
        for (var i = 0; i < filenames.length; i++) {
            var texture = I(filenames[i]);
            var frame = new cc.SpriteFrame(texture, cc.rect(0, 0, texture.width, texture.height));
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, speed);

        var action = cc.animate(animation);
        this.stopAllActions();
        if (isLoop) {
            this.runAction(action.repeatForever());
        }
        else {
            this.runAction(cc.sequence(action, cc.callFunc(function () {
                if (endCb)
                    endCb();
            })));
        }
    };

    cc.create$ = function (sceneNode) {
        var func = function (query, rootNode) {
            var arr = query.split(/\./g);
            var t = rootNode || sceneNode;
            for (var i = 0; i < arr.length; i++)
                if (t) {
                    if (!cc.sys.isObjectValid(t)) {
                        cc.log("-- not a valid object " + query);
                        return null;
                    }
                    t = t.getChildByName(arr[i]);
                }
                else {
                    return null;
                }
            return t;
        };
        var retFunc = null;
        if (_.isArray(sceneNode)) {
            retFunc = function (query, rootNode) {
                if (rootNode)
                    return func(query, rootNode);
                else {
                    for (var i = 0; i < sceneNode.length; i++) {
                        var ret = func(query, sceneNode[i]);
                        if (ret)
                            return ret;
                    }
                    return null;
                }
            };
        }
        else
            retFunc = func;
        return retFunc;
    };

    cc.ClippingNode.createRoundRect = function (width, height, radius) {
        var offsetX = 0;
        var offsetY = 0;
        var clipWidth = width;
        var clipHeight = height;
        var size = cc.size(width, height);
        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p((size.width - clipWidth) / 2 + offsetX, (size.height - clipHeight) / 2 + offsetY + radius), cc.p(size.width / 2 + clipWidth / 2 + offsetX, size.height / 2 + clipHeight / 2 + offsetY - radius), cc.color(0, 0, 0), 1, cc.color(0, 0, 0));
        stencil.drawRect(cc.p((size.width - clipWidth) / 2 + offsetX + radius, (size.height - clipHeight) / 2 + offsetY), cc.p(size.width / 2 + clipWidth / 2 + offsetX - radius, size.height / 2 + clipHeight / 2 + offsetY), cc.color(0, 0, 0), 1, cc.color(0, 0, 0));
        stencil.drawCircle(cc.p(size.width / 2 - clipWidth / 2 + offsetX + radius, size.height / 2 - clipHeight / 2 + offsetY + radius), radius / 3, 0, 100, false, radius, cc.color(0, 0, 0));
        stencil.drawCircle(cc.p(size.width / 2 + clipWidth / 2 + offsetX - radius, size.height / 2 - clipHeight / 2 + offsetY + radius), radius / 3, 0, 100, false, radius, cc.color(0, 0, 0));
        stencil.drawCircle(cc.p(size.width / 2 + clipWidth / 2 + offsetX - radius, size.height / 2 + clipHeight / 2 + offsetY - radius), radius / 3, 0, 100, false, radius, cc.color(0, 0, 0));
        stencil.drawCircle(cc.p(size.width / 2 - clipWidth / 2 + offsetX + radius, size.height / 2 + clipHeight / 2 + offsetY - radius), radius / 3, 0, 100, false, radius, cc.color(0, 0, 0));
        var clippingNode = new cc.ClippingNode();
        clippingNode.stencil = stencil;
        clippingNode.setAlphaThreshold(255);
        return clippingNode;
    };

    var ccsCache = {};

    /**
     *
     * @param res {String}
     * @param distNode {cc.Node}
     * @param rootName {String}
     * @param moreArr {Array}
     */
    ccs.loadCCS = function (res, distNode, rootName, moreArr) {
        moreArr = moreArr || [];
        var mainscene = null;
        if (ccsCache && ccsCache[res]) {
            mainscene = ccsCache[res];
            ccsCache[res] = null;
            distNode.addChild(mainscene.node);
            mainscene.node.release();
        }
        else {
            mainscene = ccs.load(res);
            distNode.addChild(mainscene.node);
        }

        var interval = null;
        var checkFunc = function () {
            if (!distNode.getChildByName(rootName).checkChildrenValid())
                return;
            var rootNode = distNode.getChildByName(rootName);
            for (var i = 0; i < moreArr.length; i++) {
                var node = rootNode.getChildByName(moreArr[i]);
                if (!node || !cc.sys.isObjectValid(node))
                    return;
            }
            clearInterval(interval);
            interval = null;

            var ret = true;
            if (distNode.getBeforeOnCCSLoadFinish && distNode.getBeforeOnCCSLoadFinish())
                ret = distNode.getBeforeOnCCSLoadFinish()();
            if (ret && distNode.onCCSLoadFinish)
                distNode.onCCSLoadFinish.call(distNode);
        };
        interval = setInterval(checkFunc, 20);
        checkFunc();
    };
    ccs.chouchu = function (node,isLoop,dura,cb) {
        var duraction = dura || 0.2;
        // node.stopAllActions();
        if (isLoop) {
            node.runAction(cc.sequence(
                cc.scaleTo(duraction, 1.3, 1.3)
                , cc.scaleTo(0.2, 1, 1)
                , cc.delayTime(duraction + 0.2)
            ).repeatForever());
        }
        else {
            node.runAction(cc.sequence(
                cc.scaleTo(duraction, 1.3, 1.3)
                , cc.scaleTo(0.2, 1, 1)
                , cc.delayTime(duraction + 0.2)
                , cc.callFunc(function () {
                    cb && cb();
                })
            ));
        }
    }
    ccs.jingluan = function (node, isLoop, dura, cb) {
        var duraction = dura || 0.2;
        // node.stopAllActions();
        if (isLoop) {
            node.runAction(cc.sequence(
                cc.rotateTo(duraction, 10).easing(cc.easeExponentialInOut())
                , cc.delayTime(0.2)
                , cc.rotateTo(duraction, -10).easing(cc.easeExponentialInOut())
                , cc.delayTime(0.2)
            ).repeatForever());
        }
        else {
            node.runAction(cc.sequence(
                cc.rotateTo(duraction, 10).easing(cc.easeExponentialInOut())
                , cc.delayTime(0.2)
                , cc.rotateTo(duraction, 10).easing(cc.easeExponentialInOut())
                , cc.delayTime(0.2)
                , cc.callFunc(function () {
                    cb && cb();
                })
            ));
        }
    }

})(this);