/**
 * Created by hjx on 2017/7/11.
 */


(function (exports) {
    var $ = null;

    var idx;
    var position2playerArrIdx ;

    var length2InfoPosition = {
        1:[[0,0]],
        2:[[-200,0],[200,0]],
        3:[[0,120],[-200,-100],[200,-100]],
        4:[[-240,0],[0,120],[240,0],[0,-120]]
    };
    var color_red=cc.color(255, 0, 0, 255);
    var color_white = cc.color(255, 255, 255, 255);
    var color_green = cc.color(21,64,24,255);

    var PlayerLocationInfoLayer = cc.Layer.extend({

        ctor: function (_position2playerArrIdx,  _idx) {
            this._super();
            idx = _idx;
            position2playerArrIdx = _position2playerArrIdx;

            var that = this;

            var playerInfo = gameData.players[position2playerArrIdx[idx]];
            var scene = loadNodeCCS(res.PlayerInfoLocation_json, this);
            // that.addChild(scene.node);
            $ = create$(this.getChildByName("Scene"));

            if($('root'))  $('root').setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);

            // var head = $('root.head', scene.node);
            // var playerName = $('root.lb_nickname', scene.node);
            // var playerID = $('root.lb_id', scene.node);
            // if(playerInfo){
            //     loadImageToSprite(playerInfo['headimgurl'], head);
            //     playerName.setString(ellipsisStr(playerInfo['nickname'], 7));
            //     playerID.setString('ID: ' + playerInfo['uid']);
            // }
            //
            // if(playerInfo && playerInfo['loc'] && gameData.location){
            //     var selectPlayerLocation = playerInfo['loc'].split(',');
            //     var otherLocation_1 = selectPlayerLocation[1];
            //     var otherLocation_2 = selectPlayerLocation[0];
            //
            //     var mylocation = gameData.location.split(',');
            //     var mylocationlat = mylocation[1];
            //     var mylocationlng = mylocation[0];
            //
            //     var myAndOtherDis = getFlatternDistance(mylocationlat, mylocationlng, otherLocation_1, otherLocation_2);
            //
            //     var text_1 = new ccui.Text();
            //     text_1.setFontSize(20);
            //     text_1.setTextColor(cc.color(168, 107, 55));
            //     text_1.setPosition(745,475);
            //     text_1.setAnchorPoint(0,0.5);
            //     text_1.setString("距我");
            //     $('root.Image_6',scene.node).addChild(text_1);
            //
            //     var text_2 = new ccui.Text();
            //     text_2.setFontSize(20);
            //     text_2.setTextColor(cc.color(255, 0, 0));
            //     text_2.setAnchorPoint(0,0.5);
            //     text_2.setPosition(text_1.getPositionX()+text_1.getContentSize().width,text_1.getPositionY());
            //     if (myAndOtherDis >= 1000) {
            //         text_2.setString((myAndOtherDis / 1000).toFixed(2) + 'km');
            //     }
            //     else {
            //         text_2.setString(myAndOtherDis + 'm');
            //     }
            //     $('root.Image_6',scene.node).addChild(text_2);
            //
            // }


            var arr = _.keys(position2playerArrIdx) || [];
            if(arr.indexOf('2')>=0){
                arr.splice(arr.indexOf('2'),1);
            }
            var posArr = length2InfoPosition[gameData.players.length-1];
            var peopleNodeArr = [];
            peopleNodeArr.push(1);
            for(var i=1; i<arr.length; i++){
                peopleNodeArr.push(duplicateSprite($('locationInfoPanel.people0')))
            }

            var drawNode = new cc.DrawNode();
            $('locationInfoPanel').addChild(drawNode, -1);

            for (var i = 0; (i < arr.length && i<gameData.players.length-1); i++) {
                var peopleNode = null;
                var isTooClose = false;
                if($('locationInfoPanel.people' + i)){
                    peopleNode = $('locationInfoPanel.people' + i);
                }else{
                    peopleNode = peopleNodeArr[i];
                    $('locationInfoPanel').addChild(peopleNode);
                    peopleNode.setName('people'+i);
                }
                peopleNode.setPositionX(posArr[i][0]);
                peopleNode.setPositionY(posArr[i][1]);

                //$('juli'  , peopleNode).setString("?");
                $('ditanceClose',peopleNode).setVisible(false);
                $('ditanceClose',peopleNode).enableOutline(color_green, 1);
                $('locationClose',peopleNode).setVisible(false);
                $('locationClose',peopleNode).enableOutline(color_green, 1);
                var playerInfo = gameData.players[position2playerArrIdx[arr[i]]];
                var head = $('head', peopleNode);
                if (playerInfo) {
                    loadImageToSprite(playerInfo['headimgurl'], head, head.getContentSize().width / 2);
                    $('locationClose',peopleNode).setVisible(!playerInfo['loc']);
                }
                //其他人和我的距离
                if(!isNullString(locationUtil.address) && playerInfo && playerInfo['loc']){
                    var otherInfo = playerInfo['loc'].split(',');
                    var otherLocation1 = otherInfo[1];
                    var otherLocation2 = otherInfo[0];
                    var mylocationlat = locationUtil.latitude;
                    var mylocationlng = locationUtil.longitude;
                    var myAndOtherDis = locationUtil.getFlatternDistance(mylocationlat, mylocationlng, otherLocation1, otherLocation2);
                    if(myAndOtherDis!=undefined){
                        isTooClose = myAndOtherDis <= 100;
                        $('ditanceClose',peopleNode).setVisible(myAndOtherDis <= 100);
                    }
                    if(isTooClose)
                        $('headBG',peopleNode).setTexture('res/image/ui/zjh/locklocation/rad.png');
                }

                var playerInfo2 = null;
                if (i == arr.length - 1) {
                    playerInfo2 = gameData.players[position2playerArrIdx[arr[0]]];
                } else {
                    playerInfo2 = gameData.players[position2playerArrIdx[arr[i + 1]]];
                }
                if(playerInfo2 && playerInfo && playerInfo2['loc'] && playerInfo['loc'] ){
                    var juliNode = $('locationInfoPanel.juliSp'+i);
                    if(!juliNode){
                        juliNode = duplicateSprite($('locationInfoPanel.juliSp0'))
                        $('locationInfoPanel').addChild(juliNode);
                    }
                    var juli = $('juli', juliNode);
                    juliNode.setPositionX((posArr[i][0] + (posArr[i+1]==undefined?posArr[0][0]:posArr[i+1][0]))/2);
                    juliNode.setPositionY((posArr[i][1] + (posArr[i+1]==undefined?posArr[0][1]:posArr[i+1][1]))/2);


                    var templocation1 = playerInfo['loc'].split(',');
                    var other1Location_1 = templocation1[1];
                    var other1Location_2 = templocation1[0]

                    var templocation2 = playerInfo2['loc'].split(',');
                    var other2Location_1 = templocation2[1];
                    var other2Location_2 = templocation2[0];
                    //其他三个人相互的距离
                    var distance = locationUtil.getFlatternDistance(other1Location_1, other1Location_2, other2Location_1, other2Location_2);
                    if (distance >= 1000) {
                        juli.setString((distance / 1000).toFixed(2) + 'km');
                    }
                    else {
                        juli.setString(distance + 'm');
                    }
                    juli.setVisible(true);
                    if(distance > 100)
                    {
                        juli.setColor(cc.color(26, 26, 26));

                    }else {
                        juli.setColor(cc.color(255, 255, 255));
                    }
                    $('juliBgWite', juliNode).setVisible(distance > 100);
                    $('juliBgRed', juliNode).setVisible(distance <= 100);

                    if(drawNode){
                        drawNode.drawSegment( cc.p(posArr[i][0],posArr[i][1]),
                            cc.p(posArr[i+1]==undefined?posArr[0][0]:posArr[i+1][0],posArr[i+1]==undefined?posArr[0][1]:posArr[i+1][1]),
                            1, distance <= 100?color_red:color_white );
                    }
                }
            }

            TouchUtils.setOnclickListener($('root.fake_root', scene.node), function () {
                that.removeFromParent(true);
            });
        },
        onEnter: function () {
            this._super();
            AgoraUtil.hideAllVideo();
        },
        onExit: function () {
            this._super();
            AgoraUtil.showAllVideo();
        }
    });

    exports.PlayerLocationInfoLayer = PlayerLocationInfoLayer;

})(window);