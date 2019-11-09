/**
 * Created by scw on 2018/8/2.
 */
(function(){
    var $=null;
    var exports=this;
    var MatchJinJiLayer=cc.Layer.extend(
        {
            ctor:function(curstage,totalstage,data){
                this._super();
                this._curStage=curstage;
                this._totalStage=totalstage;
                var that=this;
                // var scene = ccs.load(res.MatchPromotionLayer_json);
                // this.addChild(scene.node);


                var scene=loadNodeCCS(res.MatchPromotionLayer_json,this);
                $ = create$(this.getChildByName("Layer"));

                var head= $('lnode.head');
                loadImageToSprite(gameData.headimgurl, head);


                TouchUtils.setOnclickListener($('btn_back'), function () {
                    cc.director.runScene(new MainScene(0,true));
                });

                this.freshInfo(data);
                if(curstage==totalstage){
                    this.scheduleOnce(this.showBack,60);
                }
                return true;
            },
            showBack:function(dt){
                $('btn_back').setVisible(true);
            },
            freshInfo:function(data){
                var mtop=data['myTop'];
                var ttop=data['totalTop'];
                $('lnode.paiming').setString(mtop+'/'+ttop);

                var mscore=data['score'];
                $('lnode.score').setString(mscore);

                var leftround=data['remainingRoom'];
                $('leftround').setString('剩余'+leftround+'桌');

                var minscore=data['mixScore'];
                var maxscore=data['maxScore'];

                $('rnode.minscore').setString(minscore);
                $('rnode.maxscore').setString(maxscore);


                $('bnode.cround').setString('第'+this._curStage+'/'+this._totalStage+'轮');



                var nstr='无';
                var nexttype=data['nextStage'];
                if(nexttype==1){
                    nstr='打立出局';
                }else if(nexttype==2){
                    nstr='定局积分';
                }

                $('bnode.nextmatch').setString(nstr);


                var num=data['promotionUserNum'];
                if(this._curStage==this._totalStage){
                    $('rnode.jinji').setString('决赛');
                }else{
                    $('rnode.jinji').setString('前'+num+'名晋级');
                }
            },
            onEnter:function(){
                this._super();
            },
            onExit:function(){
                this._super();
            }
        }
    );
    exports.MatchJinJiLayer = MatchJinJiLayer;

})(window);