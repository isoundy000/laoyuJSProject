/**
 * Created by scw on 2018/7/12.
 */


(function () {
    var exports = this;
    var MatchResultListLayer = cc.Layer.extend({
        ctor: function (arr) {
            this._super();

            var that = this;

            this._dataArr = arr || [];
            //var file = ccs.load(res.MatchResultsLayer_json);
            //this.root = file.node;
            // this.addChild(this.root);

            var scene=loadNodeCCS(res.MatchResultsLayer_json,this);
            this.root=scene.node;


            var layer = ccui.helper.seekWidgetByName(this.root, "Layer");
            var btnclose = layer.getChildByName('btnclose');

            TouchUtils.setOnclickListener(btnclose, function () {
                that.removeFromParent();
            });

            var lbzw=layer.getChildByName('zanwu');
            if(this._dataArr.length==0){
                lbzw.setVisible(true);
            }


            this.list = layer.getChildByName("ListView");
            this.list.setSwallowTouches(false);
            for (var i = 0; i < this._dataArr.length; i++) {
                var item = new MatchResultItem(this._dataArr[i],this);
                this.list.pushBackCustomItem(item);
                item.setTag(i);
            }


            return true;
        },
        getGoods: function (recordId,type,num) {
            var that=this;
            if(type==10001){//房卡
                this._recordId = recordId;
                showLoading('正在领取奖励..');
                network.send(3333, {cmd: 'getMatchReward', params: {matchRecordId: recordId}})
            }else if(type==11001){//话费
                this._recordId=recordId;
                var w=cc.winSize.width * 0.85;
                var h=cc.winSize.height * 0.85;
                var indexUrl='https://pay.yayayouxi.com/club_front/indexhf.html';
                var layer = new cc.LayerColor(cc.color(0, 0, 0, 127), cc.winSize.width, cc.winSize.height);
                layer.setAnchorPoint(0, 0);
                var playerId = gameData.uid;
                var area = gameData.parent_area;//测试写死match
                var signKey = Crypto.MD5("fy-match-reward" +area+playerId);
                var webView = new ccui.WebView(indexUrl + "?pid=" + playerId + "&area=" + area + "&sign=" + signKey+"&rid="+recordId +"&num="+num+ '&#http://');
                webView.setContentSize(w, h);
                webView.setAnchorPoint(0.5, 0.5);
                webView.setPosition(cc.winSize.width/2, 360);
                layer.addChild(webView);
                cc.director.getRunningScene().addChild(layer, 1001);

                var btn_close = new cc.Sprite('res/submodules/bisaichang/img/btnclose.png');
                btn_close.setPosition(cc.winSize.width/2+w/2+35,320+h/2+40);
                layer.addChild(btn_close);
                TouchUtils.setOnclickListener(btn_close, function (node) {
                    layer.removeFromParent(true);
                    network.send(3333, {cmd: 'getRecordState', params: {matchRecordId: recordId}})
                });



            }
            // this._recordId=recordId;
            // var indexUrl='https://pay.yayayouxi.com/club_front-test/indexhf.html';
            // var layer = new cc.LayerColor(cc.color(0, 0, 0, 127), cc.winSize.width, cc.winSize.height);
            // layer.setAnchorPoint(0, 0);
            // var playerId = gameData.uid;
            // var area = 'match';//测试写死
            // var signKey = Crypto.MD5("fy-match-reward" +area+playerId);
            // var webView = new ccui.WebView(indexUrl + "?pid=" + playerId + "&area=" + area + "&sign=" + signKey+"&rid="+recordId +"&num="+5+ '&#http://');
            // webView.setContentSize(550, 320);
            // webView.setAnchorPoint(0.5, 0.5);
            // webView.setPosition(640, 360);
            // layer.addChild(webView);
            // cc.director.getRunningScene().addChild(layer, 1001);
            //
            // var btn_close = new cc.Sprite('res/submodules/bisaichang/img/btnclose.png');
            // btn_close.setPosition(640+550/2+30,320+320/2+40);
            // btn_close.setScale(0.7);
            // layer.addChild(btn_close);
            // TouchUtils.setOnclickListener(btn_close, function (node) {
            //     layer.removeFromParent(true);
            //     network.send(3333, {cmd: 'getRecordState', params: {matchRecordId: recordId}})
            // });

        },
        getGoodSuccess: function () {
            var par=this.getParent();
            var rcid = this._recordId;
            var tindex = _.findIndex(this._dataArr, function (obj) {
                return obj['id'] == rcid;
            })
            if (tindex >= 0) {
                var tdata = this._dataArr[tindex];
                tdata['isGet'] = 1;


                par.checkGetState(this._dataArr);
                var ritem = this.list.getChildByTag(tindex);
                ritem.freshUi(tdata);


            }

            network.send(3013, {});//刷新房卡
        },
        onEnter: function () {
            this._super();
            var that=this;

            this.list_getMatchReward = cc.eventManager.addCustomListener("match_getMatchReward", function (event) {

                var data = event.getUserData();
                var ecode = data['errorCode'];
                if (!ecode) {
                    that.getGoodSuccess();
                    hideLoading();
                    alert1('成功领取奖励!');

                } else {
                    hideLoading();
                    cc.log('enter here===============');
                    alert1(data['errorMsg'], null, null, false, true, true)
                }
                that._recordId = 0;
            });


            this.list_getRecordState = cc.eventManager.addCustomListener("match_getRecordState", function (event) {

                var data = event.getUserData();
                var ecode = data['errorCode'];
                if (!ecode) {

                    var isget=data['isGet'];
                    if(isget==1){
                        that.getGoodSuccess();
                        hideLoading();
                        alert1('成功领取奖励!');
                    }else{
                        hideLoading();
                    }

                } else {
                    hideLoading();
                    alert1(data['errorMsg'], null, null, false, true, true)
                }
                that._recordId = 0;
            });


        },
        onExit: function () {
            this._super();
            cc.eventManager.removeListener(this.list_getMatchReward);
            cc.eventManager.removeListener(this.list_getRecordState);
        }
    });
    exports.MatchResultListLayer=MatchResultListLayer;
})(window);

