/**
 * Created by scw on 2018/7/12.
 */

(function () {
    var exports = this;
    var MatchResultItem = ccui.Layout.extend({
        _data: null,
        ctor: function (data, parentnode) {
            this._super();
            this.parentnode = parentnode;
            this.setContentSize(620, 117);
            this.setTouchEnabled(false);
            var file = ccs.load(res.MatchResultItem_json, 'res/');
            this.root = file.node;
            this.addChild(this.root);
            this.freshUi(data);
            return true;
        },
        freshUi: function (data) {
            var layout = ccui.helper.seekWidgetByName(this.root, "Layer");
            var tmlb = layout.getChildByName('tmlb');
            var time = data['time'];
            tmlb.setString(time);

            var bg = layout.getChildByName('bg');
            var btnkl = layout.getChildByName('btn_kl');
            var btnyl = layout.getChildByName('btn_yl');

            var rewardList = data['rewardList'] || [];
            var isGet = data['isGet'] || 0;
            var recordId = data['id'];
            var state = data['state'];//0淘汰 1胜利 2流局
            var mname = data['name'];
            var top = data['top'];
            var time = data['time'];

            var parentnode = this.parentnode;


            var rlb = this.getChildByName('richlabel');
            if (rlb) {
                rlb.removeFromParent();
            }
            var mlb = layout.getChildByName('mslb');
            var pos = mlb.getPosition();
            if (state == 1) {//比赛打完

                    // mname='免费1元话费赛';
                    // top=1;
                    // var goodstr='话费x1';
                    //
                    // var tstr = '您在' + mname + '中勇夺第' + top + '名,获得奖励' + goodstr + '可喜可贺'+top;
                    // var strarr = [mname, top + '',goodstr];
                    // var lb = new RichLabel(tstr, 'Arial', 26, cc.color(39, 119, 182), strarr, cc.color(215, 128, 26), 30);
                    // lb.setName('richlabel');
                    // lb.setPosition(pos);
                    // this.addChild(lb);

                if (rewardList.length > 0) {
                    var goodstr = '';
                    for (var i in  rewardList) {
                        var tmp = rewardList[i];
                        var gname = tmp['name'];
                        var gcount = tmp['num'];

                        goodstr = goodstr + gname + 'x' + gcount + ',';
                    }
                    goodstr = goodstr.substring(0, goodstr.length - 1);

                    var tstr = '您在' + mname + '中勇夺第' + top + '名,获得奖励' + goodstr + '可喜可贺';
                    var strarr = [mname, top + '',goodstr];
                    var lb = new RichLabel(tstr, 'Arial', 26, cc.color(39, 119, 182), strarr, cc.color(215, 128, 26), 30);
                    lb.setName('richlabel');
                    lb.setPosition(pos);
                    this.addChild(lb);


                } else {
                    var tstr='很遗憾,您在'+mname+'中获得第'+top+'名,请继续比赛再接再厉';
                    var strarr=[mname,top+''];
                    var lb = new RichLabel(tstr, 'Arial', 26, cc.color(39, 119, 182), strarr, cc.color(215, 128, 26), 30);
                    //var tstr = '您在' + mname + '被淘汰了,胜败乃兵家常事,请大侠重新来过吧~'
                    // var lb = new RichLabel(tstr, 'Arial', 26, cc.color(39, 119, 182), mname, cc.color(215, 128, 26), 30);
                    lb.setPosition(pos);
                    lb.setName('richlabel');
                    this.addChild(lb);
                }
            } else if (state == 2) {//流局
                var tstr = '您报名的' + mname + '因未满足开赛条件流赛，如有报名费，已退还给您';
                var lb = new RichLabel(tstr, 'Arial', 26, cc.color(39, 119, 182), mname, cc.color(215, 128, 26), 30);
                lb.setPosition(pos);
                lb.setName('richlabel');
                this.addChild(lb);
            }


            if (this._listener) {
                cc.eventManager.removeListener(this._listener);
            }

            var tnode = null;
            var func = null;
            btnkl.setVisible(false);
            btnyl.setVisible(false);

            if (rewardList.length > 0 && isGet == 0) {//未领取

                var reward=rewardList[0];
                var gtype=reward['type'];
                var num=reward['num'];

                tnode = btnkl;
                func = function () {
                    parentnode.getGoods(recordId,gtype,num);
                }
            } else if (rewardList.length > 0 && isGet == 1) {//已领取
                tnode = btnyl;
            }

            if (tnode) {
                tnode.setVisible(true);
            }

            var trect = cc.rect(66, 85, 1148, 500);
            this._listener = TouchUtils.addScrollTouchListener(bg, tnode, null, func, trect);

        },
        onEnter: function () {


            this._super();
        },
        onExit: function () {
            this._super();
            if (this._listener) {
                cc.eventManager.removeListener(this._listener);
            }
        }
    });
    exports.MatchResultItem=MatchResultItem;

})(window);
