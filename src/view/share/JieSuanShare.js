(function () {
    var exports = this;

    var $ = null;


    var JieSuanShare = cc.Layer.extend({
        onEnter: function () {
            this._super();
        },
        ctor: function (texture,roomId,wanfaDesp,playbackId,clubData) {
            this._super();
            var that = this;
            var scene = ccs.load(res.jiesuan_json, "res/");
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            var showBtnArr = ['weixin', 'qq', 'dingding', 'liaobei', 'xianliao'];
            for(var i=0;i<showBtnArr.length;i++){
                var btn = $('btn_' + showBtnArr[i]);
                var Text = $('Text_' + showBtnArr[i]);
                if(btn){
                    btn.setVisible(false);
                    Text.setVisible(false);
                }
            }
            if(window.nativeVersion <= '2.2.0'){
                showBtnArr = ['weixin'];
            }else{
                showBtnArr = ['dingding', 'liaobei', 'xianliao', 'weixin'];
            }
            for(var i=0;i<showBtnArr.length;i++){
                var btn = $('btn_' + showBtnArr[i]);
                var Text = $('Text_' + showBtnArr[i]);
                btn.setPositionX(1280/2 + (showBtnArr.length/2 - i- 1/2)*140);
                Text.setPositionX(1280/2 + (showBtnArr.length/2 - i- 1/2)*140);
                if(btn){
                    btn.setVisible(true);
                    Text.setVisible(true);
                }
            }

            var btn_back = getUI(this, "btn_back");
            var shareTexture = texture;
            TouchUtils.setOnclickListener($('btn_weixin'), function () {
                if(texture){
                    that.sharePic('wx',texture);
                }else if(playbackId){
                    that.sharePlaybackId('wx', playbackId)
                }else if(clubData){
                    that.shareClub('wx', clubData)
                }else {
                    that.shareRoomId('wx',roomId,wanfaDesp);
                }
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener($('btn_xianliao'), function () {
                if(texture){
                    that.sharePic('xl',texture);
                }else if(playbackId){
                    that.sharePlaybackId('xl', playbackId)
                }else if(clubData){
                    that.shareClub('xl', clubData)
                }else {
                    that.shareRoomId('xl',roomId,wanfaDesp);
                }
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener($('btn_dingding'), function () {
                if(texture){
                    that.sharePic('dd',texture);
                }else if(playbackId){
                    that.sharePlaybackId('dd', playbackId)
                } else if(clubData){
                    that.shareClub('dd', clubData)
                }else {
                    that.shareRoomId('dd',roomId,wanfaDesp);
                }
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener($('btn_liaobei'), function () {
                if(texture){
                    that.sharePic('lb',texture);
                }else if(playbackId){
                    that.sharePlaybackId('lb', playbackId)
                }else if(clubData){
                    that.shareClub('lb', clubData)
                }else {
                    that.shareRoomId('lb',roomId,wanfaDesp);
                }
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener($('btn_qq'), function () {
                if(texture){
                    that.sharePic('qq',texture);
                }else if(playbackId){
                    that.sharePlaybackId('qq', playbackId)
                }else if(clubData){
                    that.shareClub('qq', clubData)
                }else {
                    that.shareRoomId('qq',roomId,wanfaDesp);
                }
                that.removeFromParent(true);
            });

            TouchUtils.setOnclickListener(btn_back, function () {
                that.removeFromParent(true);
            });
        },
        sharePic: function (platform, shareNode) {
            switch (platform) {
                case 'qq':
                    QQUtils.sharePic(shareNode);
                    break;
                case 'wx':
                    WXUtils.shareTexture(shareNode);
                    break;
                case 'xl':
                    XianLiaoUtils.captureAndShareToXianLiao2(shareNode);
                    break;
                case 'dd':
                    DDUtils.sharePic(shareNode,0x88F0);
                    break;
                case 'cp':

                    break;
                case 'lb':
                    LBUtils.captureAndShareToLB(shareNode,0x88F0);
                    break;

            }
        },
        sharePlaybackId: function (platform,playbackId) {
            var text = "玩家【" + gameData.nickname + "】分享了一个【丫丫扑克】的回放码: " + playbackId + ", 在大厅点击进入战绩页面, 然后点击查看回放按钮, 输入回放码点击确定后即可查看.";
            var sceneType = 0;
            var transaction = getCurTimestamp() + gameData.uid;
            switch (platform) {
                case 'qq':
                    QQUtils.shareText(text, sceneType, transaction);
                    break;
                case 'dd':
                    DDUtils.shareText(text, sceneType, transaction);
                    break;
                case 'xl':
                    XianLiaoUtils.shareText(text);
                    break;
                case 'lb':
                    LBUtils.shareText(text);
                    break;
                case 'wx':
                default:
                    shareText(text, sceneType, transaction);
                    break;
            }
        },
        shareRoomId: function (platform,roomId, wanfaDesp) {
            var wanfa = wanfaDesp?wanfaDesp:gameData.wanfaDesp;
            var id = roomId?roomId:gameData.roomId;
            var mapName = mapidToName(gameData.mapId,gameData.ZhuangMode,gameData.Preview);
            var url = 'http://www.yayayouxi.com/pk/';
            var title = mapName;

            var description = "房号: " + id + "，" +
                (wanfa ? decodeURIComponent(wanfa) + "," : "") + "速度来啊! 【" + mapName + "】";

            switch (platform) {
                case 'qq':
                    QQUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'dd':
                    DDUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'lb':
                    LBUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'xl':
                    cc.log("zhangzhisong==="+description);
                    XianLiaoUtils.shareGame(id, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'wx':
                default:
                    WXUtils.shareUrl('https://aidhyd.mlinks.cc/AcyW?roomid='+id, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
            }
        },
        shareClub: function (platform,clubData) {
            var url = 'http://www.yayayouxi.com/hbpoker/';
            var title = "丫丫俱乐部";
            var description = "玩家[" + gameData.nickname + "]邀请您加入俱乐部[" + clubData['name'] + "]，俱乐部ID[" + clubData['id'] + "]"+ "速度来啊! 【丫丫扑克】";
            var clubID = clubData['id'].toString();
            var strID =""
            for(var i =clubID.length;i<6;i++)
            {
                strID=strID+"0";
            }
            strID = strID+ clubID;

            switch (platform) {
                case 'qq':
                    QQUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'dd':
                    DDUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'xl':
                    XianLiaoUtils.shareGame(strID, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'lb':
                    LBUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'wx':
                default:
                    WXUtils.shareUrl('https://aidhyd.mlinks.cc/AcyW?roomid='+strID, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
            }
        }
    });
    exports.JieSuanShare = JieSuanShare;
})(window);
