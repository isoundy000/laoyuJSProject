(function () {
    var exports = this;

    var $ = null;

    var DaiKai = cc.Layer.extend({
        scrollView: null,
        totalHeight: null,
        layout: null,
        state: 0,
        ctor: function (club_id) {
            this._super();

            var that = this;
            this.club_id = club_id;

            var scene = ccs.load(res.DaiKai_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            TouchUtils.setOnclickListener($('root.panel.btn_close'), function () {
                that.removeFromParent(true);
            }, {sound:'close'});

            TouchUtils.setOnclickListener($('root.panel.btn_refresh'), function () {
                switch (that.state) {
                    case 0:
                        that.clickYiKai();
                        break;
                    case 1:
                        that.clickDaiKai();
                        break;
                }
            });

            TouchUtils.setOnclickListener($('root.panel.btn_ykfj'), function () {
                $('root.panel.btn_ykfj').setTexture('res/image/ui/room2/btn_yikai.png');
                $('root.panel.btn_dkjl').setTexture('res/image/ui/room2/btn_daikai_1.png');
                if (that.state != 0)
                    that.clickYiKai();
            }, {soubd:'tab'});

            // $('root.panel.btn_dkjl').setVisible(false);
            TouchUtils.setOnclickListener($('root.panel.btn_dkjl'), function () {
                $('root.panel.btn_ykfj').setTexture('res/image/ui/room2/btn_yikai_1.png');
                $('root.panel.btn_dkjl').setTexture('res/image/ui/room2/btn_daikai.png');
                if (that.state != 1)
                    that.clickDaiKai();
            }, {soubd:'tab'});

            that.clickYiKai();

            network.addListener(3014, function (data) {
                hideLoading();
                data.arr = data.arr.sort(function(a,b){
                    return a.create_time < b.create_time;
                });
                that.initYiKai(data.arr);
            });
            network.addListener(3015, function (data) {
                hideLoading();
                data.arr = data.arr.sort(function(a,b){
                    return a.create_time < b.create_time;
                });
                that.initDaiKai(data.arr);
            });

            network.addListener(3003, function (data) {
                hideLoading();
                that.clickYiKai();
            });

            return true;
        },
        clickYiKai: function () {
            showLoading();
            network.send(3014, {club_id: this.club_id});
        },
        clickDaiKai: function () {
            showLoading();
            network.send(3015, {club_id: this.club_id});
        },
        initYiKai: function (dataArr) {
            this.scrollView = $('root.panel.scrollView');
            this.scrollView.removeAllChildren(true);

            this.state = 0;

            if (!dataArr || !dataArr.length || dataArr.length < 1) {
                return;
            }

            this.layout = new ccui.Layout();
            this.totalHeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                this.initItem(dataArr[i], true, i % 2 == 0);
            }

            this.scrollView.setInnerContainerSize(cc.size(this.scrollView.getContentSize().width, this.totalHeight));
            this.scrollView.addChild(this.layout);
            this.layout.setPositionY(this.scrollView.getContentSize().height > this.totalHeight ? this.scrollView.getContentSize().height : this.totalHeight);
        },
        initDaiKai: function (dataArr) {
            this.scrollView = $('root.panel.scrollView');
            this.scrollView.removeAllChildren(true);

            this.state = 1;

            if (!dataArr || !dataArr.length || dataArr.length < 1) {
                return;
            }
            this.layout = new ccui.Layout();
            this.totalHeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                this.initItem(dataArr[i], false, i % 2 == 0);
            }

            this.scrollView.setInnerContainerSize(cc.size(this.scrollView.getContentSize().width, this.totalHeight));
            this.scrollView.addChild(this.layout);
            this.layout.setPositionY(this.scrollView.getContentSize().height > this.totalHeight ? this.scrollView.getContentSize().height : this.totalHeight);
        },
        initItem: function (itemData, isNew, isWhite) {
            var item = new DaiKaiItem(itemData, isNew, isWhite, this);
            this.layout.addChild(item);
            var itemHeight = item.getLayerHeight();
            item.setPositionY(0 - this.totalHeight - itemHeight);
            this.totalHeight += itemHeight;
        },
        refreshTable: function(){
            switch (this.state) {
                case 0:
                    this.clickYiKai();
                    break;
                case 1:
                    this.clickDaiKai();
                    break;
            }
        },

    });

    exports.DaiKai = DaiKai;
})(window);
