/**
 * Created by scw on 2018/6/8.
 */
(function () {
    var exports = this;
    var $ = null;
    var MatchRewardLayer = cc.Layer.extend(
        {
            ctor: function (data) {
                this._super();

                var that = this;
                this.hasget=false;
                this.canAnim=false;

                // var scene = ccs.load(res.MatchRewardLayer_json);
                // this.addChild(scene.node, 0);


                var scene=loadNodeCCS(res.MatchRewardLayer_json,this);


                $ = create$(this.getChildByName('Layer'));


                var rewardList = data['rewardList'];

                var top=data['top']+'';
                var recordId=data['id'];

                var gtype=0;
                var gnum=0;



                if (rewardList && rewardList.length > 0) {//胜利
                    var reward=rewardList[0];
                    gtype=reward['type'];
                    gnum=reward['num'];

                    this.canAnim=true;
                    var goodsStr='';
                    for(var i in  rewardList){
                        var tmp=rewardList[i];
                        var gname=tmp['name'];
                        var gcount=tmp['num'];

                        goodsStr=goodsStr+gname+'x'+gcount+',';
                    }

                    goodsStr=goodsStr.substr(0,goodsStr.length-1);
                    var str1='恭喜您在本局比赛荣获第'+top+'名';
                    var pos1=$('border.winnode.node1').getPosition();
                    var lb1=new RichLabel(str1,'Arial',26,null,top,cc.color(255,241,22),20);
                    lb1.setPosition(pos1);
                    $('border.winnode').addChild(lb1);
                    var str2='获得奖励:'+goodsStr;
                    var pos2=$('border.winnode.node2').getPosition();
                    var lb2=new RichLabel(str2,'Arial',26,null,goodsStr,cc.color(255,241,22),20);
                    lb2.setPosition(pos2);
                    $('border.winnode').addChild(lb2);

                    $('border.winnode').setVisible(true);

                } else {
                    var str1='您在本局比赛中遗憾获得第'+top+'名';
                    var pos1=$('border.failnode.node1').getPosition();
                    var lb1=new RichLabel(str1,'Arial',26,null,top,cc.color(255,241,22),20);
                    lb1.setPosition(pos1);
                    $('border.failnode').addChild(lb1);


                    var pos2=$('border.failnode.node2').getPosition();
                    var str2='再来一局重新争夺冠军吧!';
                    var lb2=new RichLabel(str2,'Arial',26,null,null,null,20);
                    lb2.setPosition(pos2);
                    $('border.failnode').addChild(lb2);

                    $('taotai').setVisible(true);
                    $('border.failnode').setVisible(true);
                }


                $('bot').runAction(cc.fadeIn(0.6));
                this.scheduleOnce(function () {
                    $('border').setVisible(true);
                }, 0.5);


                TouchUtils.setOnclickListener($('border.winnode.btn_qd'), function () {

                    if(that.hasget){
                        return;
                    }
                    showLoading('正在领取奖励..');

                    if(gtype==10001){//房卡
                        network.send(3333, {cmd: 'getMatchReward', params: {matchRecordId: recordId}})
                    }else if(gtype==11001){//话费
                        that.showRewardPlat(recordId,gnum);
                    }


                });

                TouchUtils.setOnclickListener($('border.winnode.btn_xy'), function () {
                    $('erwei').setVisible(true);
                    $('btn_close').setVisible(false);
                    $('border.winnode.btn_xy').setVisible(false);
                    $('border.winnode.btn_qd').setVisible(false);
                    that.scheduleOnce(function () {
                        WXUtils.captureAndShareToWX(that, 0x88F0,2);
                    },0.5);

                    that.scheduleOnce(function () {
                        $('erwei').setVisible(false);
                        $('btn_close').setVisible(true);
                        $('border.winnode.btn_xy').setVisible(true);
                        $('border.winnode.btn_qd').setVisible(true);
                    },1);

                });

                TouchUtils.setOnclickListener($('border.failnode.btn_qa'), function () {
                    $('erwei').setVisible(true);
                    $('btn_close').setVisible(false);
                    $('border.failnode.btn_qa').setVisible(false);
                    $('border.failnode.btn_qd').setVisible(false);
                    that.scheduleOnce(function () {
                        WXUtils.captureAndShareToWX(that, 0x88F0,2);
                    },0.5);
                    that.scheduleOnce(function () {
                        $('erwei').setVisible(false);
                        $('btn_close').setVisible(true);
                        $('border.failnode.btn_qa').setVisible(true);
                        $('border.failnode.btn_qd').setVisible(true);
                    },1);

                });

                TouchUtils.setOnclickListener($('border.failnode.btn_qd'), function () {
                    //cc.director.runScene(new MainScene());
                    //that.removeFromParent();
                    cc.director.runScene(new MainScene(0,true));
                });

                TouchUtils.setOnclickListener($('bot'), function () {

                });

                TouchUtils.setOnclickListener($('btn_close'), function () {
                   //that.removeFromParent();
                    cc.director.runScene(new MainScene(0,true));
                });

                return true;
            },
            showRewardPlat:function(recordId,num){
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
                webView.setPosition(640, 360);
                layer.addChild(webView);
                cc.director.getRunningScene().addChild(layer, 1001);

                var btn_close = new cc.Sprite('res/submodules/bisaichang/img/btnclose.png');
                btn_close.setPosition(640+w/2+35,320+h/2+40);
                layer.addChild(btn_close);
                TouchUtils.setOnclickListener(btn_close, function (node) {
                    layer.removeFromParent(true);
                    network.send(3333, {cmd: 'getRecordState', params: {matchRecordId: recordId}})
                });
            },
            showAnim:function(){
                var that=this;

                var layer=this.getChildByName('Layer');
                if(!this.canAnim){
                    return;
                }

                var spm = new sp.SkeletonAnimation(res.spine_huojiang_json, res.spine_huojiang_atlas);
                spm.setAnimation(0, 'huojiang1', false);
                spm.setCompleteListener(function () {
                    var spm2 = new sp.SkeletonAnimation(res.spine_huojiang_json, res.spine_huojiang_atlas);
                    spm2.setAnimation(0, 'huojiang2', true);
                    layer.addChild(spm2, 1);
                })
                layer.addChild(spm, 2);

            },
            onEnter:function(){
                this._super();
                var that=this;
                this.list_getMatchReward = cc.eventManager.addCustomListener("match_getMatchReward", function (event) {

                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var node=$('border.winnode.btn_qd');
                        alert1('领取奖励成功!');
                        that.hasget=true;
                        Filter.sepia(node, 0.7);
                        TouchUtils.removeListeners(node);
                        //that.removeFromParent();
                        // cc.director.runScene(new MainScene());
                        hideLoading();
                        that.gotoMainScene();
                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });
                this.list_getRecordState = cc.eventManager.addCustomListener("match_getRecordState", function (event) {
                    var data = event.getUserData();
                    var ecode = data['errorCode'];
                    if (!ecode) {
                        var isget=data['isGet'];
                        if(isget==1){
                            var node=$('border.winnode.btn_qd');
                            alert1('领取奖励成功!');
                            that.hasget=true;
                            Filter.sepia(node, 0.7);
                            TouchUtils.removeListeners(node);

                            hideLoading();
                            that.gotoMainScene();


                        }else{
                            hideLoading();
                        }

                    } else {
                        hideLoading();
                        alert1(data['errorMsg'], null, null, false, true, true)
                    }
                });
            },
            gotoMainScene:function(){
                this.scheduleOnce(function(){cc.director.runScene(new MainScene(0,true))},0.5);
            },
            onExit:function(){
                this.unscheduleAllCallbacks();
                cc.eventManager.removeListener(this.list_getMatchReward);
                cc.eventManager.removeListener(this.list_getRecordState);
                this._super();
            }
        }
    );
    exports.MatchRewardLayer = MatchRewardLayer;
})(window);