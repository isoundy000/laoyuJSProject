var RuleJBC_PDK = {
    init: function () {
        var that = this;
        //返回
        this.btBack = getUI(this, 'btn_back');
        TouchUtils.setOnclickListener(this.btBack, function () {
            // that.hide(true);
            var root = that.getChildByName('root');
            layerHideAni(root, function () {
                that.removeFromParent();
            });
            that.chooseId = -1;
        }, {sound: 'close'});
        //全部控件列表
        // this.btn_scroll = getUI(this, 'btn_scroll');
        this.rullscroll = getUI(this, 'rullscroll');
        // this.btn_region = getUI(this, 'btn_0');
        //优化刷新数据
        this.chooseId = -1;
        //初始化左边列表控件
        // this.initBtn();
        //初始化最初打开的状态信息
        this.changeRuler(0);

        //动画
        var root = this.getChildByName('root');
        addModalLayer(this);
        layerShowAni(root, true);

        return true;
    },
    initBtn: function () {
        var that = this;
        this.btnList = [];
        this.scrollList = [];
        this.ruleList = [];

        //数据初始化
        for (var i = 0; i < RuleJBC_Data.rules.length; i++) {
            if (RuleJBC_Data.rules[i][0] != '') {
                this.ruleList.push({index: i});
            }
        }
        //初始化列表的高度
        var scrollH = 600;
        if (90 * this.ruleList.length >= scrollH) {
            scrollH = 90 * this.ruleList.length;
        }
        this.btn_scroll.setInnerContainerSize(cc.size(300, scrollH));

        //添加按钮列表的内容
        for (var i = 0; i < this.ruleList.length; i++) {
            this['btn_' + i] = getUI(this, 'btn_' + i);
            this['btn_' + i].setPosition(cc.p(163, scrollH - i * 90 - 55));
        }
        var setRuleVisible = function (id, num) {
            if (!(this.chooseId == -1 || this.chooseId != id)) return;
            for (var j = 0; j < that.ruleList.length; j++) {
                if (id == j) {
                    that['btn_' + j].getChildByName('foucs_bg').setVisible(true);
                } else {
                    that['btn_' + j].getChildByName('foucs_bg').setVisible(false);
                }
            }
            that.changeRuler(num);
        };
        for (var i = 0; i < that.ruleList.length; i++) {
            var num = that.ruleList[i].index;
            (function (i, num) {
                TouchUtils.setOnclickListener(that['btn_' + i], function (node) {
                    setRuleVisible(i, num);
                }, {swallowTouches: false, sound: 'tab'});
            })(i, num);
        }
        setRuleVisible(0, this.ruleList[0].index);
    },

    //此函数内容已经去掉
    initRule: function (name, num) {
        var scrollview = null;
        var posx = 620 / 2 + 5;
        scrollview = this.rullscroll;
        scrollview.removeAllChildren();
        var scrollview0H = 0;
        var rule0Sprites = [];
        if (name == 'yx' || name == 'gl' || name == 'cdbsf') {
            posx = 620 / 2 + 105;
        } else if (name == 'ly' || name == 'cs' || name == 'sy' || name == 'sybp' || name == 'hgw' || name == 'xx') {
            posx = 620 / 2 + 15;
        } else if (name == 'cz') {
            posx = 620 / 2 + 70;
        } else if (name == 'hy') {
            posx = 620 / 2 + 95;
        } else if (name == 'weimaque') {
            posx = 620 / 2 + 180;
        }
        for (var s = 0; s < num; s++) {
            var sprite = new cc.Sprite('res/image/ui/rule/' + name + (s + 1) + '.png');
            sprite.setPositionX(posx);
            rule0Sprites[rule0Sprites.length] = sprite;
            scrollview.addChild(sprite);
            scrollview0H = scrollview0H + sprite.getContentSize().height;
        }
        scrollview.setInnerContainerSize(cc.size(830, scrollview0H));
        for (var s = 0; s < rule0Sprites.length; s++) {
            rule0Sprites[s].setPositionY(scrollview0H - rule0Sprites[s].getContentSize().height / 2);
            scrollview0H = scrollview0H - rule0Sprites[s].getContentSize().height;
        }
    },
    changeRuler: function (tab) {
        if (this.chooseId == tab) return;
        //清除全部东西
        this.rullscroll.removeAllChildren();

        var idx = tab;  //指向当前玩法的最初位置
        var wholeHeight = 0;
        var ruleLabels = [];

        for (var i = idx; i < RuleJBC_Data.rules.length; i++) {
            var data = RuleJBC_Data.rules[i];
            if (!(i == idx || data[0] == '')) break;
            //添加标题
            var data1 = data[1] || '';
            if (data1 != '') {
                var content = new cc.LabelTTF();
                content.setFontName('res/fonts/FZZY.TTF');
                content.setFontSize(40);
                content.boundingWidth = 850;
                content.x = 425;
                content.setColor(cc.color(140, 112, 71));
                // content.enableStroke(cc.color(188, 106, 50), 3);
                content.setString(data[1]);
                this.rullscroll.addChild(content);
                ruleLabels[ruleLabels.length] = (content);
                //计算高度
                wholeHeight = wholeHeight + content.getContentSize().height;
                wholeHeight += 30;
            }
            //添加内容
            var data2 = data[2] || '';
            if (data2 != '') {
                var content = new cc.LabelTTF();
                content.setFontSize(30);
                content.setFontName('res/fonts/FZZY.TTF');
                content.boundingWidth = 1220;
                content.x = 610;
                content.setColor(cc.color(92, 43, 18));
                content.setString(data[2]);
                // content.enableShadow(cc.color(0, 0, 0), cc.size(1, 1), 1);
                this.rullscroll.addChild(content);
                ruleLabels[ruleLabels.length] = (content);

                wholeHeight = wholeHeight + content.getContentSize().height;
                wholeHeight += 10;
            }

            //添加标题
            var data3 = data[3] || '';
            if (data3 != '') {
                var content = new cc.LabelTTF();
                content.setFontName('res/fonts/FZZY.TTF');
                content.setFontSize(30);
                content.boundingWidth = 850;
                content.x = 425;
                content.setColor(cc.color(92, 43, 18));
                // content.enableStroke(cc.color(188, 106, 50), 3);
                content.setString(data[3]);
                this.rullscroll.addChild(content);
                ruleLabels[ruleLabels.length] = (content);
                //计算高度
                wholeHeight = wholeHeight + content.getContentSize().height;
                wholeHeight += 30;
            }
            //添加内容
            var data4 = data[4] || '';
            if (data4 != '') {
                var content = new cc.LabelTTF();
                content.setFontSize(30);
                content.setFontName('res/fonts/FZZY.TTF');
                content.boundingWidth = 1220;
                content.x = 610;
                content.setColor(cc.color(92, 43, 18));
                content.setString(data[4]);
                // content.enableShadow(cc.color(0, 0, 0), cc.size(1, 1), 1);
                this.rullscroll.addChild(content);
                ruleLabels[ruleLabels.length] = (content);
                //计算高度
                wholeHeight = wholeHeight + content.getContentSize().height;
                wholeHeight += 10;
            }
            ruleLabels.wholeHeight = wholeHeight;
        }

        //设置列表高度
        this.rullscroll.setInnerContainerSize(cc.size(1220, wholeHeight));

        //设置对象位置
        for (var s = 0; s < ruleLabels.length; s++) {
            ruleLabels[s].setPositionY(wholeHeight - ruleLabels[s].getBoundingBox().height / 2);
            wholeHeight = wholeHeight - ruleLabels[s].getBoundingBox().height;
            if (s % 2 == 0 && s != 0) {
                ruleLabels[s].y -= 30;
                wholeHeight -= 30;
            } else {
                ruleLabels[s].y -= 10;
                wholeHeight -= 10;
            }
        }

        this.rullscroll.jumpToTop();
        this.chooseId = tab;
    }
};