(function () {
    var exports = this;
    var $ = null;
    var downInterval = null;

    var CuoPaiLayer = cc.Layer.extend({
        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
        },
        setPaiHua: function (pai, val) {
            var that = this;
            var arr = getPaiNameByIdNN(val);
            setSpriteFrameByName(pai, arr, 'niuniu/card/poker');
        },
        ctor: function (typ, cuodata, handcards, cb) {
            this._super();
            // cuodata = [55,1,55,1,2];
            // handcards = [55,55,1,2];
            this.typ = typ;
            this.data = cuodata;
            this.handcards = handcards || [];
            this.cardList = [];
            this.cb = cb;

            var that = this;
            var scene = ccs.load(res.CuopaiLayer_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));


            var touchLayer = new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
            touchLayer.setName("touchLayer");
            touchLayer.setAnchorPoint(0, 0);
            this.addChild(touchLayer);
            this.touchLayer = touchLayer;
            if(typ == 'zjh'){
                $('root.sec').setVisible(true);
                TouchUtils.setOnclickListener($('root.close'), function () {
                    if(cc.sys.isObjectValid(that))
                        that.removeFromParent();
                    if(cb)cb();
                });

                this.initZjhUI();
            }else{
                $('root.sec').setVisible(false);
                TouchUtils.setOnclickListener($('root.close'), function () {
                    that.getParent().showHandCard(false, null, true);
                    that.removeFromParent();
                });

                this.initUI();
            }
        },
        initZjhUI: function(){
            var that = this;
            for(var i=0;i<4;i++){
                $('root.top.a' + i).setVisible(false);
            }
            for (var j = 0; j < this.data.length; j++) {
                var node = $("root.pai.a" + j);
                if(!node){
                    node = duplicateSprite($("root.pai.a0"));
                    node.setName("a" + j);
                    $("root.pai.a0").getParent().addChild(node);
                }
                node.setRotation(90);
                node.setVisible(true);
                node.setAnchorPoint(cc.p(1, 0));
                node.setAnchorPoint(cc.p(0, 0));
                node.setPosition(cc.p(0 - node.getBoundingBox().width/2 + j*10, -300));
                var src = "res/image/ui/niuniu/cuocard/" + getBigCardName_poker(this.data[j]);
                node.setTexture(src);
                this.cardList.push(node);
                //角
                var jiao1 = node.getChildByName('jiao1');
                if(this.data[j] == 55) {
                    jiao1.setVisible(false);
                }else {
                    if (jiao1) {
                        jiao1.setVisible(true);
                        jiao1.setRotation(-90);
                        setSpriteFrameByName(jiao1, getBigCardJiaoName_poker(this.data[j]), "niuniu/cuocard/cuocard_big");
                    }
                }
                var jiao2 = node.getChildByName('jiao2');
                if(this.data[j] == 55) {
                    jiao2.setVisible(false);
                }else {
                    if (jiao2) {
                        jiao2.setVisible(true);
                        jiao2.setRotation(90);
                        setSpriteFrameByName(jiao2, getBigCardJiaoName_poker(this.data[j]), "niuniu/cuocard/cuocard_big");
                    }
                }

                var nodeW = node.getBoundingBox().width/2;
                node.runAction(cc.sequence(
                    cc.moveTo(0.2, cc.p(0 - nodeW + j*10, 500 - 3*(this.data.length - j - 1)))
                    , cc.rotateTo(0.2, 90 - 2 * (this.data.length - j - 1))
                ));
            }
            this.enableCuoPai(this.touchLayer);

            var count = 6;
            $('root.sec').setString("剩余时间:" + count);
            downInterval = setInterval(function () {
                count--;
                $('root.sec').setString("剩余时间:" + count);
                if(count == 0){
                    clearInterval(downInterval);
                    downInterval = null;
                    if(that.cb){
                        that.cb();
                        if(cc.sys.isObjectValid(that))
                            that.removeFromParent();
                    }
                }
            }, 1000);
        },
        initUI: function(){
            var that = this;

            // 2 5张
            if(this.handcards){
                for(var i=0;i<this.handcards.length;i++){
                    $('root.top.a' + i).setVisible(true);
                    // $('root.top.a' + i).setPositionX((i - 2)*140);
                    this.setPaiHua($('root.top.a' + i), this.handcards[i]);
                }
                for(i;i<4;i++){
                    $('root.top.a' + i).setVisible(false);
                }
            }
            for (var j = 0; j < this.data.length; j++) {
                var node = $("root.pai.a" + j);
                if(!node){
                    node = duplicateSprite($("root.pai.a0"));
                    node.setName("a" + j);
                    $("root.pai.a0").getParent().addChild(node);
                }
                node.setRotation(90);
                node.setVisible(true);
                node.setAnchorPoint(cc.p(1, 0));
                node.setAnchorPoint(cc.p(0, 0));
                node.setPosition(cc.p(0 - node.getBoundingBox().width/2 + j*10, -300));
                // setCardBigUI(node, this.data[j]);
                // setSpriteFrameByName(node, getBigCardName(this.data[j]), "niuniu/card/bigcard");
                var src = "res/image/ui/niuniu/cuocard/" + getBigCardName(this.data[j]);
                node.setTexture(src);
                this.cardList.push(node);
                //角
                var jiao1 = node.getChildByName('jiao1');
                if(this.data[j] == 55) {
                    jiao1.setVisible(false);
                }else {
                    if (jiao1) {
                        jiao1.setVisible(true);
                        jiao1.setRotation(-90);
                        setSpriteFrameByName(jiao1, getBigCardJiaoName(this.data[j]), "niuniu/cuocard/cuocard_big");
                    }
                }
                var jiao2 = node.getChildByName('jiao2');
                if(this.data[j] == 55) {
                    jiao2.setVisible(false);
                }else {
                    if (jiao2) {
                        jiao2.setVisible(true);
                        jiao2.setRotation(90);
                        setSpriteFrameByName(jiao2, getBigCardJiaoName(this.data[j]), "niuniu/cuocard/cuocard_big");
                    }
                }

                var nodeW = node.getBoundingBox().width/2;
                node.runAction(cc.sequence(
                    cc.moveTo(0.2, cc.p(0 - nodeW + j*10, 500 - 3*(this.data.length - j - 1)))
                    , cc.rotateTo(0.2, 90 - 2 * (this.data.length - j - 1))
                ));
            }
            this.enableCuoPai(this.touchLayer);
        },
        enableCuoPai:function(touchLayer){
            var that = this;
            var moveNode = null;
            var moveNodeRotateBak = 0;
            var touchPos = null;
            var canMove = true;
            var cuoIndex = that.data.length - 1;
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    if(canMove == false)  return;
                    for(var i=that.cardList.length - 1;i >= 0;i--) {
                        if (TouchUtils.isTouchMe(that.cardList[i], touch, event, null)) {
                            touchPos = touch.getLocation();
                            moveNode = that.cardList[i];
                            return true;
                        }
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    var p = touch.getLocation();
                    var movexy = {x:(p.x - touchPos.x), y:(p.y - touchPos.y)};
                    touchPos = p;
                    if(moveNode){
                        moveNode.setPosition(cc.p(moveNode.getPositionX() + movexy.x, moveNode.getPositionY() + movexy.y));
                    }
                },
                onTouchEnded: function (touch, event) {
                    if(moveNode){
                        moveNode.runAction(cc.sequence(
                            cc.callFunc(function () {
                                //翻完了 动画
                                var isMoveFinish = true;
                                for(var i=0;i<that.cardList.length;i++) {
                                    var card = that.cardList[i];
                                    for(var j=0;j<that.cardList.length;j++){
                                        if(i != j){
                                            var duibicard = that.cardList[j];
                                            if(Math.abs(card.getPositionX() - duibicard.getPositionX()) <= 35 &&
                                                Math.abs(card.getPositionY() - duibicard.getPositionY()) <= 35){
                                                isMoveFinish = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if(isMoveFinish == true) {
                                    canMove = false;
                                    for (var i = 0; i < that.cardList.length; i++) {
                                        var card = that.cardList[i];
                                        //
                                        card.runAction(cc.sequence(
                                            cc.rotateTo(0.1, 90 + (i - (that.data.length - 1) / 2) * 5)
                                            , cc.moveTo(0.3, cc.p(i*70 + ((that.data.length == 5) ? -300:-240),
                                                500 + (i - (that.data.length - 1) / 2) * 20))
                                            , cc.delayTime(0.5)
                                            , cc.spawn(cc.moveTo(0.1, cc.p((that.data.length == 5)?-250:-190, 500)), cc.rotateTo(0.1, 90))
                                            , cc.moveBy(0.2, cc.p(0, -600))
                                            , cc.callFunc(function () {
                                                if(that.typ == 'zjh'){
                                                    if(that.cb)  that.cb();
                                                    if(cc.sys.isObjectValid(that))
                                                        that.removeFromParent();
                                                }else{
                                                    var cardArr = deepCopy(that.handcards);
                                                    for (var k = 0; k < that.data.length; k++) {
                                                        cardArr.push(that.data[k]);
                                                    }
                                                    that.getParent().showHandCard(true, cardArr);
                                                    that.removeFromParent();
                                                }

                                            })
                                        ))
                                    }
                                }
                                moveNode = null;
                                touchPos = null;
                            })
                        ));
                    }
                }
            });
            return cc.eventManager.addListener(chupaiListener, touchLayer);
        },

        onExit: function () {
            if(downInterval){
                clearInterval(downInterval);
                downInterval = null;
            }
            cc.Layer.prototype.onExit.call(this);
        }
    });


    exports.CuoPaiLayer = CuoPaiLayer;
})(window);
