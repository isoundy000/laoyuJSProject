/**
 * Created by duwei on 2018/6/28.
 */
(function (exports) {
    var $ = null;
    exports.BuyTishiLayer = cc.Layer.extend({
        getTodayTime:function () {
            var mydate = new Date();
            var year = mydate.getFullYear();
            var month =  mydate.getMonth()+1;
            var today = mydate.getDate();
            return year + "_" +month+"_"+today;
        },
        ctor: function (content, onOk, onCancel) {
            this._super();
            var that = this;
            content = content || '';
            // if(cc.sys.localStorage.getItem('BuyTishiGouXuan_' + that.getTodayTime()) == 1){
            //     if (onOk)
            //         onOk();
            //     that.removeFromParent(true);
            //     return;
            // }
            var scene = loadNodeCCS(res.BuyTishi_json, this);
            // this.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));
            $('root.panel.lb_content').setString(content);

            TouchUtils.setOnclickListener($('root.panel.btn_ok'), function (node) {
                if (onOk)
                    onOk();
                that.removeFromParent(true);
            });
            TouchUtils.setOnclickListener($('root.panel.btn_cancel'), function (node) {
                if (onCancel)
                    onCancel();
                that.removeFromParent(true);
            });
            $('root.panel.CheckBox').setSelected(cc.sys.localStorage.getItem('BuyTishiGouXuan_' + that.getTodayTime()) == 1);
            $('root.panel.CheckBox').addEventListener(function (_, type) {
                var gouxuan = type == ccui.CheckBox.EVENT_SELECTED;
                cc.sys.localStorage.setItem('BuyTishiGouXuan_'+ that.getTodayTime(), gouxuan ? 1 : 0);

            });
            return true;
        }
    });
})(window);
