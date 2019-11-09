/**
 * Created by scw on 2018/6/7.
 */
(function () {
    var exports=this;
    var $=null;
    var CustomTableViewCell=cc.TableViewCell.extend(
        {
            _$:null,
            ctor:function(){
                this._super();
                //this.addChild(ccs.load(res.MatchRankItem_json).node);
                var scene=ccs.load(res.MatchRankItem_json, 'res/');
                this.addChild(scene.node);
                this._$=create$(this.getChildByName('Layer'));
            },
            draw:function(ctx){
                this._super(ctx);
            },
            getNode:function(){
                return this.children[0];
            },
            get$:function(){
                return this._$;
            }
        }
    );
    var MatchRankLayer=cc.Layer.extend(
        {
            _rankArr:null,
            ctor:function(rarr){
                this._super();

                var that=this;
                this._rankArr=rarr||[];

                // var scene=ccs.load(res.MatchRankLayer_json);
                // this.addChild(scene.node);


                var scene=loadNodeCCS(res.MatchRankLayer_json,this);

                $=create$(this.getChildByName('Layer'));

                TouchUtils.setOnclickListener($('btn_close'), function () {
                    that.removeFromParent();
                });

                this.initRank();

                return true;
            },
            initRank:function(){

                var layer=this.getChildByName('Layer');
                var tableViewSize = $('tableview').getSize();
                var tableViewAnchor = $('tableview').getAnchorPoint();
                var tableViewPosition = $('tableview').getPosition();
                var tableView = new cc.TableView(this, cc.size(tableViewSize.width, tableViewSize.height));
                tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
                tableView.setPosition(tableViewPosition);
                tableView.setAnchorPoint(tableViewAnchor);
                tableView.setDelegate(this);
                layer.addChild(tableView);
                //tableView.reloadData();
            },
            tableCellAtIndex:function(table,idx){
                var cell=table.dequeueCell();
                if(!cell){
                    cell=new CustomTableViewCell();
                }

                var data=this._rankArr[this._rankArr.length-1-idx];
                var nick=data['userName']||'';
                var top=data['top']||'';
                var score=data['score']||'';
                var $2=cell.get$();
                $2('namelb').setString(ellipsisStr(nick, 7));
                $2('scorelb').setString(score);
                $2('rank').setString(top);
                $2('jin').setVisible(top==1);
                $2('yin').setVisible(top==2);
                $2('tong').setVisible(top==3);



                return cell;
            },
            tableCellTouched:function(table,cell){

            },
            tableCellSizeForIndex:function(table,idx){
                return cc.size(766,80);
            },
            numberOfCellsInTableView:function(table){
                return this._rankArr.length;
            }
        }
    );
    exports.MatchRankLayer=MatchRankLayer;
})(window);