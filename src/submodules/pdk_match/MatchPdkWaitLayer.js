/**
 * Created by scw on 2018/8/29.
 */
(function () {
    var $ = null;
    var exports = this;
    var MatchPdkWaitLayer = cc.Layer.extend(
        {
            ctor: function (top1,top2,score) {
                this._super();
                // var scene = ccs.load(res.MatchWaitLayer_json);
                // this.addChild(scene.node);


                var scene=loadNodeCCS(res.MatchPdkWaitLayer_json,this);
                $ = create$(this.getChildByName("Layer"));
                // var sceneid = cc.sys.localStorage.getItem('sceneid') || 0;
                // if(sceneid>1){
                //     sceneid=0;
                // }
                //$('bg').setTexture('res/submodules/bisaichang/kawuxing/img/table/table_back' + sceneid + '.jpg');


                // var str='低于'+score+'分将被淘汰';
                // $('border.taotai').setString(str);
                this.freshRank('当前排名'+top1+'/'+top2);
                return true;
            },
            hidePaiming:function(){
                $('border.paiming').setVisible(false);
            },
            freshRank:function(str){
                $('border.paiming').setString(str);
            },
            onEnter: function () {
                this._super();
            },
            onExit: function () {
                this._super();
            }
        }
    );
    exports.MatchPdkWaitLayer=MatchPdkWaitLayer;
})(window);