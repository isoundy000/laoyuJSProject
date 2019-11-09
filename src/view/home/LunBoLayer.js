/**
 * Created by wcc 广告轮播组件
 */

(function () {
    var exports = this;
    var $ = null;
    var imgsLength = 2;
    var imgWidth = 234;

    var LunBoLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            var that = this;

            var scene = ccs.load(res.LunBoLayer_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            this.imgArray = [1, 2];
            this.index = 0;

            var strSplit = function(str, reg){
                var newstr = "";
                var strArr = str.split(reg);
                for(var i=0;i<strArr.length;i++){
                    newstr = newstr + strArr[i] + "\n";
                }
                return newstr;
            }
            var dailiweixin = gameData.opt_conf['dailiweixin'];
            if(dailiweixin){
                var newstr = strSplit(dailiweixin, ',');
                $('root.img2.weixin1').setString(newstr);
            }
            var kefuweixin = gameData.opt_conf['kefuweixin'];
            if(kefuweixin){
                var newstr = strSplit(kefuweixin, ',');
                $('root.img1.weixin1').setString(newstr);
            }


            var lunbolayer = new cc.LayerColor(cc.color(0, 0, 0, 10), 250, 450);
            lunbolayer.setPosition(0, 0);
            this.addChild(lunbolayer);
            this.enableCuoPai(lunbolayer);

            this.isMoving = false;

            //计时器轮播
            var lunboFunc = function(){
                if(that.isMoving){
                    return;
                }
                var lastPosx = $('root.img' + that.imgArray[imgsLength - 1]).getPositionX();
                if(lastPosx  - imgWidth <= imgWidth/2){
                    $('root.img' + that.imgArray[0]).setPositionX(imgWidth*(3/2));
                    //把第一位移动到最后一位
                    var tmp = that.imgArray[0];
                    for(var i=0;i<that.imgArray.length-1;i++){
                        that.imgArray[i] = that.imgArray[i+1];
                    }
                    that.imgArray[imgsLength - 1] = tmp;
                }
                for(var i=0;i<imgsLength;i++){
                    $('root.img' + (i+1)).setPositionX($('root.img' + (i+1)).getPositionX() - imgWidth);
                }
                that.index = (that.index == 0 ? 1:0);
                that.initPoint();
            }
            this.lunbointerval = setInterval(lunboFunc, 10000);
        },
        initPoint: function(){
            for(var i=0;i<imgsLength;i++){
                $('root.point' + (i+1)).setTexture((this.index == i) ?
                    "res/image/ui/hall/hall_lunbop1.png":"res/image/ui/hall/hall_lunbop2.png");
            }
        },
        onExit: function () {
            this._super();
            if(this.lunbointerval){
                clearInterval(this.lunbointerval);
                this.lunbointerval = null;
            }
        },
        enableCuoPai:function(touchLayer){
            var that = this;
            var movePos = null;
            // var moveTime = 0;
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    if(TouchUtils.isTouchMe(touchLayer, touch, event, null)) {
                        that.isMoving = true;
                        movePos = touch.getLocation();
                        return true;
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    // var time = new Date().getTime();
                    // if(Math.abs(moveTime - time) < 50){
                    //     return;
                    // }
                    // moveTime = time;
                    if(!TouchUtils.isTouchMe(touchLayer, touch, event, null)) {
                        return false;
                    }
                    var p = touch.getLocation();
                    var posx = p.x - movePos.x;
                    movePos = p;

                    if(posx > 0){
                        //右
                        var firstPosx = $('root.img' + that.imgArray[0]).getPositionX();
                        if(firstPosx + posx >= imgWidth/2){
                            $('root.img' + that.imgArray[imgsLength - 1]).setPositionX(-imgWidth*(1/2));
                            //把最后的数据移到第一位
                            var tmp = that.imgArray[imgsLength - 1];
                            for(var i=that.imgArray.length-1;i>0;i--){
                                that.imgArray[i] = that.imgArray[i-1];
                            }
                            that.imgArray[0] = tmp;
                        }
                    }else if(posx < 0){
                        //左
                        var lastPosx = $('root.img' + that.imgArray[imgsLength - 1]).getPositionX();
                        if(lastPosx  + posx <= imgWidth/2){
                            $('root.img' + that.imgArray[0]).setPositionX(imgWidth*(3/2));
                            //把第一位移动到最后一位
                            var tmp = that.imgArray[0];
                            for(var i=0;i<that.imgArray.length-1;i++){
                                that.imgArray[i] = that.imgArray[i+1];
                            }
                            that.imgArray[imgsLength - 1] = tmp;
                        }
                    }
                    for(var i=0;i<imgsLength;i++){
                        $('root.img' + (i+1)).setPositionX($('root.img' + (i+1)).getPositionX() + posx);
                    }
                },
                onTouchEnded: function (touch, event) {
                    that.isMoving = false;

                    var juMid = 1000;
                    var index = 0;
                    var movex = 0;
                    for(var i=0;i<that.imgArray.length;i++){
                        var juli = $('root.img' + (i+1)).getPositionX();
                        if(Math.abs(juli - imgWidth/2) < juMid){
                            juMid = Math.abs(juli - imgWidth/2);
                            index = i;
                            movex = juli - imgWidth/2;
                        }
                    }
                    that.index = index;
                    that.initPoint();
                    for(var i=0;i<that.imgArray.length;i++){
                        $('root.img' + (i+1)).runAction(cc.sequence(
                            cc.moveBy(0.1, cc.p(-movex, 0))
                        ))
                    }

                    movePos = null;
                }
            });
            return cc.eventManager.addListener(chupaiListener, touchLayer);
        }
    });
    exports.LunBoLayer = LunBoLayer;
})(window);