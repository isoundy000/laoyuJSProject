/**
 * Created by hjx on 2017/10/24.
 */
(function () {
    var exports = this;
    var g_idx = 0;
    var lastFlipTime = 0;
    var guide_png_array = [
        "res/submodules/club/img/club_guide_1.jpg",
        "res/submodules/club/img/club_guide_2.jpg",
        "res/submodules/club/img/club_guide_3.jpg",
        "res/submodules/club/img/club_guide_4.jpg"
    ];
    var guideInterval = null;
    var GuideLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            var that = this;
            this.setPosition(cc.p(0, 0));

            var modalLayer = new ccui.Layout();
            modalLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            modalLayer.setBackGroundColor(cc.color('#1A1A1A'));
            modalLayer.setSwallowTouches(true);
            modalLayer.setTouchEnabled(true);
            modalLayer.setContentSize(cc.winSize);
            modalLayer.setAnchorPoint(cc.p(0.5, 0.5));
            modalLayer.x = cc.winSize.width / 2;
            modalLayer.y = cc.winSize.height / 2;
            modalLayer.ignoreAnchorPointForPosition(false);
            modalLayer.setBackGroundColorOpacity(255);
            this.addChild(modalLayer);

            guideInterval = null;
            var widgetSize = cc.size(cc.winSize.width, cc.winSize.height);
            var background = cc.size(cc.winSize.width, cc.winSize.height);
            cc.sys.localStorage.setItem('guideClub', new Date().getTime());
            // Create the page view
            var pageView = new ccui.PageView();
            pageView.setTouchEnabled(true);
            pageView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
            pageView.x = (widgetSize.width - background.width) / 2 + (background.width - pageView.width) / 2;
            pageView.y = (widgetSize.height - background.height) / 2 + (background.height - pageView.height) / 2;

            for (var i = 0; i < guide_png_array.length; ++i) {
                var layout = new ccui.Layout();
                layout.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
                var layoutRect = layout.getContentSize();

                var imageView = new ccui.ImageView();
                imageView.setTouchEnabled(false);
                imageView.setScale9Enabled(false);
                imageView.loadTexture(guide_png_array[i]);
                imageView.setScale(Math.min(cc.winSize.width/1560, cc.winSize.height/720));
                // imageView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
                imageView.x = layoutRect.width / 2;
                imageView.y = layoutRect.height / 2;
                layout.addChild(imageView);

                // var text = new ccui.Text();
                // text.string = "page" + (i + 1);
                // text.font = "30px 'Marker Felt'";
                // text.color = cc.color(192, 192, 192);
                // text.x = layoutRect.width / 2;
                // text.y = layoutRect.height / 2;
                // layout.addChild(text);

                pageView.addPage(layout);
            }

            this.addChild(pageView);

            var btn_close = new cc.Sprite('res/submodules/club/img/btn_close2.png');//activity/close_activity
            btn_close.x = cc.winSize.width - 120;
            btn_close.y = cc.winSize.height - 120;
            btn_close.setScale(2);
            this.addChild(btn_close);
            btn_close.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3,2.5), cc.scaleTo(0.3,2.2))));
            TouchUtils.setOnclickListener(btn_close, function () {
                that.removeFromParent();
            });

            var btn_left = new cc.Sprite('res/submodules/club/img/club_guide_right.png');
            btn_left.x = 90;
            btn_left.y = 100;
            btn_left.setFlippedX(true);
            this.addChild(btn_left);
            btn_left.setVisible(false);
            TouchUtils.setOnclickListener(btn_left, function () {
                g_idx = parseInt(pageView.getCurPageIndex().valueOf())
                if(g_idx>0){
                    pageView.scrollToPage(g_idx-1);
                    btn_left.setVisible(false);
                    setButtonStatus(g_idx-1);
                }
            });

            var btn_right = new cc.Sprite('res/submodules/club/img/club_guide_right.png');
            btn_right.x = 1190;
            btn_right.y = 90;
            btn_right.setScale(0.7);
            btn_right.setFlippedX(true);
            btn_right.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.8, cc.p(990, 90)).easing(cc.easeIn(3)),
                    cc.fadeOut(0.5),
                    cc.callFunc(function () {
                        btn_right.x = 1190;
                        btn_right.y = 90;
                    }),
                    cc.moveTo(0.01, cc.p(1190, 90)),
                    cc.fadeIn(0.5)
                )
            ));
            this.addChild(btn_right);
            TouchUtils.setOnclickListener(btn_right, function () {
                g_idx = parseInt(pageView.getCurPageIndex().valueOf())
                if(g_idx<guide_png_array.length-1){
                    pageView.scrollToPage(g_idx+1);
                    btn_right.setVisible(false);
                    setButtonStatus(g_idx+1);
                }
            });

            // var tipsSp1 = new cc.Sprite('res/ui/newclub/img/page1.png');
            // tipsSp1.x = cc.winSize.width/2;
            // tipsSp1.y = 40;
            // this.addChild(tipsSp1);
            // var tipsSp2 = new cc.Sprite('res/ui/newclub/img/page2.png');
            // tipsSp2.x = cc.winSize.width/2;
            // tipsSp2.y = 40;
            // this.addChild(tipsSp2);
            // tipsSp2.setVisible(false);
            // var tipsSp3 = new cc.Sprite('res/ui/newclub/img/page3.png');
            // tipsSp3.x = cc.winSize.width/2;
            // tipsSp3.y = 40;
            // this.addChild(tipsSp3);
            // tipsSp3.setVisible(false);

            var setButtonStatus = function (idx) {
                // var _idx = idx==undefined? g_idx : idx;
                // if(_idx<=0){
                //     btn_left.setVisible(false);
                //     btn_right.setVisible(true);
                //     btn_close.setVisible(true);
                //     tipsSp1.setVisible(true);
                //     tipsSp2.setVisible(false);
                //     tipsSp3.setVisible(false);
                // }else if(_idx>=guide_png_array.length-1){
                //     btn_left.setVisible(false);
                //     btn_right.setVisible(false);
                //     btn_close.setVisible(true);
                //     tipsSp1.setVisible(false);
                //     tipsSp2.setVisible(false);
                //     tipsSp3.setVisible(true);
                // }else{
                //     btn_left.setVisible(false);
                //     btn_right.setVisible(true);
                //     btn_close.setVisible(true);
                //     tipsSp1.setVisible(false);
                //     tipsSp2.setVisible(true);
                //     tipsSp3.setVisible(false);
                // }
            }

            pageView.addEventListener(function (sender, type) {
                console.log("----   " + type);
                switch (type) {
                    case ccui.PageView.EVENT_TURNING:
                        var pageView = sender;
                        // this._topDisplayLabel.setString("page = " + (pageView.getCurPageIndex().valueOf() - 0 + 1));
                        g_idx = parseInt(pageView.getCurPageIndex().valueOf())
                        lastFlipTime = new Date().getTime();
                        setButtonStatus();
                        break;
                    default:
                        break;
                }
            }, that);

            //自动翻转
            guideInterval = setInterval(function () {
                if(!cc.sys.isObjectValid(pageView)){
                    clearInterval(guideInterval);
                    guideInterval = null;
                }
                var off =  new Date().getTime()-lastFlipTime;
                // console.log(off + "   " + g_idx);
                g_idx = parseInt(pageView.getCurPageIndex().valueOf())
                setButtonStatus();
                if(off>=4500){
                    if(g_idx<guide_png_array.length-1){
                        pageView.scrollToPage(g_idx+1);
                    }else{
                        //pageView.scrollToPage(0);
                    }
                }
            }, 3500)
            return true;
        },
        onExit : function () {
            this._super();
            if(guideInterval){
                clearInterval(guideInterval);
                guideInterval = null;
            }
        }
    });
    exports.GuideLayer = GuideLayer;
})(window);