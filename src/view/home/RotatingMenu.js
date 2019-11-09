/*
    旋转菜单
    spring 2017-12-25
 */
(function (exports) {
    //椭圆配置
    var ra = 0;
    var rb = 0;
    var cx = 0;
    var cy = 0;
    var speed = 0.01;
    var stepSpeed = 0.1;

    // 上次位置
    var _lastX = 0;
    var _movedX = 0;


    var games = ['huzi', 'niuniu', 'pdk', 'psz', 'majiang'];

    var RotatingMenu = cc.LayerColor.extend({
        ctor: function (parent, arr) {
            this._super();
            this.setContentSize(cc.size(800, 500));
            this.setPosition(cc.p(1280 - 800, 100));
            this.setColor(cc.color(0, 0, 0));
            this.setOpacity(5);

            games = arr;

            var that = this;

            var btnList = [];
            var clicktime = 0;
            for (var i = 0; i < games.length; i++) {
                (function (name) {
                    btnList[i] = new cc.Sprite('res/image/ui/hall/roomcreate_' + games[i] + ".png");
                    btnList[i].setPosition(cc.p(220 * (i + 1 / 2), 200));
                    that.addChild(btnList[i]);
                    TouchUtils.setOnclickListener(btnList[i], function (sender) {
                        var time = new Date().getTime();
                        if(time - clicktime <= 1000){
                            return;
                        }
                        clicktime = time;
                        if (parent) {//} && sender.getPositionY() < (cy + 60)){
                            parent.createRoomLayer(name, false);
                        }
                    }, {swallowTouches: false, effect: TouchUtils.effects.NONE});

                    var title = new cc.Sprite('res/image/ui/hall/title_roomcreate_' + games[i] + '.png');
                    title.setPosition(cc.p(btnList[i].getContentSize().width / 2, 50));
                    btnList[i].addChild(title);
                })(games[i]);
            }
            this.btnList = btnList;

            var beginPos = null;
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    if (TouchUtils.isTouchMe(that, touch, event, null)) {
                        beginPos = touch.getLocation();
                        return true;
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    var curPos = touch.getLocation();
                    var moveX = curPos.x - beginPos.x;
                    if (curPos.y > (cy + that.getPositionY())) {
                        that.circleUpdate(-moveX);
                    } else {
                        that.circleUpdate(moveX);
                    }
                    beginPos = curPos;
                },
                onTouchEnded: function (touch, event) {
                    that.turnSide();
                },
                onTouchCancel: function (touch, event) {

                }
            });
            cc.eventManager.addListener(chupaiListener, this);

            this.circleInit(270, 150, 400, 280);

        },
        circleInit: function (a, b, x, y) {
            ra = a;
            rb = b;
            cx = x;
            cy = y;

            for (var i = 0; i < games.length; i++) {
                var index = 2 * Math.PI / games.length * (i) - Math.PI / 2;
                this.btnList[i].setPosition(this.getCirclePosition(index));

                var x = this.btnList[i].getPositionX();
                var y = this.btnList[i].getPositionY();
                var scale = this.getCircleScale(x, y);
                this.btnList[i].setScale(scale);
                var k = this.getCircleOp(x, y);
                this.btnList[i].setOpacity(255 * k);

                // 设置层级
                this.btnList[i].setLocalZOrder((i == 0) ? 100 : 1);
            }
        },
        circleUpdate: function (_movedX) {
            //_movedX > 0 右
            for (var i = 0; i < this.btnList.length; i++) {
                var x = this.btnList[i].getPositionX();
                var y = this.btnList[i].getPositionY();

                var currtheta = Math.atan(((cy - y) / rb * ra) / (cx - x));
                if (x <= cx) currtheta = currtheta + Math.PI;

                var p = this.getCirclePosition(currtheta + _movedX * speed);
                this.btnList[i].setPosition(p);
                if (y < cy)
                    this.btnList[i].setLocalZOrder(100);
                else
                    this.btnList[i].setLocalZOrder(1);
                var scale = this.getCircleScale(x, y);
                this.btnList[i].setScale(scale);
                var k = this.getCircleOp(x, y);
                this.btnList[i].setOpacity(255 * k);
            }
        },
        turnSide: function () {
            var that = this;
            var juli = Math.PI;
            var index = 0;

            for (var i = 0; i < this.btnList.length; i++) {
                var x = this.btnList[i].getPositionX();
                var y = this.btnList[i].getPositionY();

                var currtheta = Math.atan(((cy - y) / rb * ra) / (cx - x));
                if (x <= cx) currtheta = currtheta + Math.PI;
                if (y <= cy) {
                    var curjuli = Math.PI;
                    //juli > 0 向右转  juli < 0 向左转
                    if (currtheta >= 0) {
                        curjuli = (Math.PI * 3 / 2 - currtheta);
                    } else {
                        curjuli = -(Math.PI / 2 + currtheta);
                    }
                    if (Math.abs(curjuli) < Math.abs(juli)) {
                        juli = curjuli;
                        index = i;
                    }
                    // console.log(i+"==="+(currtheta/Math.PI)*180+"==xx=="+x+"===yy=="+y);
                }
            }
            //开始旋转
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
                this.sircleTime = 0;
            }
            this.sircleTime = 0;
            this.sircleTime = Math.floor(Math.abs(juli) / stepSpeed);
            this.interval = setInterval(function () {
                that.circleRun(juli);
            }, 50);
        },
        getCircleScale: function (x, y) {
            var s = 0.2 * ((2 * cy - 2 * rb - y)) / ((cy - rb)) + 0.8;
            return s;
        },
        getCircleOp: function (x, y) {
            var k = 0.1 * (2 * cy - 2 * rb - y) / (cy - rb) + 0.9;
            if (k > 1) k = 1;
            return k;
        },
        getCirclePosition: function (theta) {
            theta = theta + 2 * Math.PI;
            theta = theta % (2 * Math.PI);
            var pos = cc.p(cx + ra * Math.cos(theta), (cy + rb * Math.sin(theta)));
            return pos;
        },
        //juli > 0 向右转  juli < 0 向左转
        circleRun: function (juli) {
            var stepSpeedTmp = stepSpeed;
            if (juli < 0) {
                stepSpeedTmp = -stepSpeed;
            }
            // console.log("this.sircleTime==="+this.sircleTime);
            if (this.sircleTime <= 0) {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                    this.sircleTime = 0;
                }
                return;
            }
            this.sircleTime--;
            for (var i = 0; i < this.btnList.length; i++) {
                var x = this.btnList[i].getPositionX();
                var y = this.btnList[i].getPositionY();
                var currtheta = Math.atan(((cy - y) / rb * ra) / (cx - x));
                if (x < cx) currtheta = currtheta + Math.PI;
                var p = this.getCirclePosition(currtheta + stepSpeedTmp);
                this.btnList[i].setPosition(p);
                if (y < cy)
                    this.btnList[i].setLocalZOrder(100);
                else
                    this.btnList[i].setLocalZOrder(1);
                var scale = this.getCircleScale(x, y);
                this.btnList[i].setScale(scale);
                var k = this.getCircleOp(x, y);
                this.btnList[i].setOpacity(255 * k);
            }
        },
        onEnter: function () {
            this._super();

        },
        onExit: function () {
            this._super();
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
                this.sircleTime = 0;
            }

        }
    });

    exports.RotatingMenu = RotatingMenu;

})(window);