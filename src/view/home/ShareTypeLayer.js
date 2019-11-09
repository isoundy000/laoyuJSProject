/**
 * Created by zhangluxin on 2017/2/27.
 */
(function () {
    var exports = this;

    var $ = null;

    var ShareTypeLayer = cc.Layer.extend({
        ctor: function (shareNode, roomId, wanfaDesp, playbackId, clubData) {
            var that = this;
            this._super();
            // this.setContentSize(cc.size(1280, 720));
            var scene = loadNodeCCS(res.ShareTypeLayer_json, this);
            // addModalLayer(scene.node);
            // this.addChild(scene.node);

            $ = create$(this.getChildByName('Layer'));
            if(!window.sensorLandscape){
                $('root').setRotation(-90);
            }
            // TouchUtils.setOnclickListener($('root.btn_winxinqian'), function () {
            //     that.removeFromParent(true);
            //     if (shareNode) {
            //         that.sharePic('wxq', shareNode);
            //     }else if(playbackId){
            //         that.sharePlaybackId('wxq', playbackId)
            //     }else if(clubData){
            //         that.shareClub('wxq', clubData)
            //     } else {
            //         that.shareRoomId('wxq',roomId, wanfaDesp);
            //     }
            // });
            if(shareNode){
            }else{
                $('root.btn_dingding').setVisible(false);
                $('root.txt_dd').setVisible(false);

                $('root.btn_winxin').setPositionX($('root').getContentSize().width*0.35);
                $('root.txt_pyq').setPositionX($('root').getContentSize().width*0.35);
                $('root.btn_xianliao').setPositionX($('root').getContentSize().width*0.5);
                $('root.txt_xl').setPositionX($('root').getContentSize().width*0.5);
                $('root.btn_liaobei').setPositionX($('root').getContentSize().width*0.65);
                $('root.txt_lb').setPositionX($('root').getContentSize().width*0.65);
            }

            TouchUtils.setOnclickListener($('root.btn_winxin'), function () {
                that.removeFromParent(true);
                if (shareNode) {
                    that.sharePic('wx', shareNode);
                } else if (playbackId) {
                    that.sharePlaybackId('wx', playbackId);
                } else if (clubData) {
                    that.shareClub('wx', clubData);
                } else {
                    that.shareRoomId('wx', roomId, wanfaDesp);
                }
            });
            TouchUtils.setOnclickListener($('root.btn_qq'), function () {
                that.removeFromParent(true);
                if (shareNode) {
                    that.sharePic('qq', shareNode);
                } else if (playbackId) {
                    that.sharePlaybackId('qq', playbackId);
                } else if (clubData) {
                    that.shareClub('qq', clubData);
                } else {
                    that.shareRoomId('qq', roomId, wanfaDesp);
                }
            });
            TouchUtils.setOnclickListener($('root.btn_dingding'), function () {
                that.removeFromParent(true);
                if (shareNode) {
                    that.sharePic('dd', shareNode);
                } else if (playbackId) {
                    that.sharePlaybackId('dd', playbackId);
                } else if (clubData) {
                    that.shareClub('dd', clubData);
                } else {
                    that.shareRoomId('dd', roomId, wanfaDesp);
                }
            });
            // TouchUtils.setOnclickListener($('root.btn_copy'), function () {
            //     that.removeFromParent(true);
            //     if (shareNode) {
            //         that.sharePic('cp', shareNode);
            //     }else if(playbackId){
            //         that.sharePlaybackId('cp', playbackId)
            //     }else if(clubData){
            //         that.shareClub('cp', clubData)
            //     } else {
            //         that.shareRoomId('cp',roomId, wanfaDesp);
            //     }
            // });
            TouchUtils.setOnclickListener($('root.btn_xianliao'), function () {
                if (!gameData.isXianLiaoAppInstalled) {
                    alert0('提示', '您还没有安装闲聊哦');
                    return;
                }
                that.removeFromParent(true);
                if (shareNode) {
                    that.sharePic('xl', shareNode);
                } else if (playbackId) {
                    that.sharePlaybackId('xl', playbackId);
                } else if (clubData) {
                    that.shareClub('xl', clubData);
                } else {
                    that.shareRoomId('xl', roomId, wanfaDesp);
                }
            });
            TouchUtils.setOnclickListener($('root.btn_liaobei'), function () {
                if (!gameData.isLBAppInstalled) {
                    if (cc.sys.isNative) {
                        cc.sys.openURL('https://www.liaobe.cn/');
                    } else {
                        window.open('https://www.liaobe.cn/', '_blank');
                    }
                    alert0('提示', '您还没有安装聊呗哦');
                    return;
                }
                that.removeFromParent(true);
                if (shareNode) {
                    that.sharePic('lb', shareNode);
                } else if (playbackId) {
                    that.sharePlaybackId('lb', playbackId);
                } else if (clubData) {
                    that.shareClub('lb', clubData);
                } else {
                    that.shareRoomId('lb', roomId, wanfaDesp);
                }
            });

            TouchUtils.setOnclickListener($('root'), function () {
                that.removeFromParent(true);
            }, {effect: TouchUtils.effects.NONE});
            TouchUtils.setOnclickListener($('root.viewbg'), function () {
            }, {effect: TouchUtils.effects.NONE});

            // $('root').addTouchEventListener(function (sender, type) {
            //     if (type == ccui.Widget.TOUCH_ENDED) {
            //         that.removeFromParent(true);
            //     }
            // });

            return true;
        },
        sharePic: function (platform, shareNode) {
            switch (platform) {
                case 'qq':
                    if (getNativeVersion() < '1.4.0') {
                        alert1('您的版本过低，请升级后使用该功能');
                        return;
                    }
                    QQUtils.sharePic(shareNode);
                    break;
                case 'wx':
                    WXUtils.captureAndShareToWX(shareNode, 0x88F0);
                    break;
                case 'wxq':
                    WXUtils.captureAndShareToWX(shareNode, 0x88F0, true);
                    break;
                case 'xl':
                    XianLiaoUtils.captureAndShareToXianLiao(shareNode, 0x88F0);
                    break;
                case 'lb':
                    LBUtils.captureAndShareToLB(shareNode, 0x88F0);
                    break;
                case 'dd':
                    DDUtils.shareCapture(shareNode);
                    break;
                case 'cp':
                    if (cc.sys.os == cc.sys.OS_ANDROID) {
                        alert1('此功能暂不支持');
                        return;
                    }
                    captureAndCopy(shareNode);
                    break;
            }
        },
        sharePlaybackId: function (platform, playbackId) {
            var text = '玩家【' + gameData.nickname + '】分享了一个【全民风云斗牌】的回放码: ' + playbackId + ', 在大厅点击进入战绩页面, 然后点击查看回放按钮, 输入回放码点击确定后即可查看.';
            var sceneType = 0;
            var transaction = getCurTimestamp() + gameData.uid;
            switch (platform) {
                case 'qq':
                    QQUtils.shareText(text, sceneType, transaction);
                    break;
                case 'dd':
                    DDUtils.shareText(text, sceneType, transaction);
                    break;
                case 'cp':
                    this.copyRoomId();
                    break;
                case 'xl':
                    XianLiaoUtils.shareText(text);
                    break;
                case 'lb':
                    LBUtils.shareText(text, sceneType, transaction);
                    break;
                case 'wx':
                default:
                    shareText(text, sceneType, transaction);
                    break;
            }
        },
        shareRoomId: function (platform, roomId, wanfaDesp) {
            var wanfa = wanfaDesp ? wanfaDesp.desp : gameData.wanfaDesp;
            var id = roomId ? roomId : gameData.roomId;
            var parts = decodeURIComponent(wanfa).split(',');
            var mapName = gameData.mapId2Name(wanfaDesp.mapid);
            // parts.splice(1, 1);
            // var url = 'http://www.yayayouxi.com/penghuzi2';
            var url = getShareUrl(gameData.roomId);
            var title = gameData.companyName + '-' + mapName + '-' + id;
            var description = '房号: ' + id + ',' +
                (parts.length ? parts.join(',') + ',' : '') + '速度来啊! 【全民风云斗牌】';

            switch (platform) {
                case 'qq':
                    QQUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'dd':
                    DDUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'cp':
                    this.copyRoomId();
                    break;
                case 'xl':
                    XianLiaoUtils.shareGame(id, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'lb':
                    LBUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'wx':
                    WXUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                default:
                    break;
            }
        },
        copyRoomId: function () {
            if (getNativeVersion() == '1.2.0') {
                alert1('请下载最新版本使用新功能');
                return;
            }
            var parts = decodeURIComponent(gameData.wanfaDesp).split(',');
            var mapName = parts[1];
            parts.splice(1, 1);
            var shareText = '【全民风云斗牌】\n' + mapName + '\n房号: ' + ToDBC(gameData.roomId) + '\n'
                + (parts.length ? parts.join(', ') + ', ' : '') + '速度来啊！';
            savePasteBoard(shareText);
            this.showToast('复制成功');
        },
        showToast: function (msg) {
            var toast = $('toast');
            if (!toast) {
                toast = new cc.Sprite(res.toast_bg_png);
                toast.setName('toast');
                this.addChild(toast);

                var text = new ccui.Text();
                text.setName('text');
                text.setFontSize(30);
                text.setTextColor(cc.color(255, 255, 255));
                text.setPosition(toast.getBoundingBox().width / 2, toast.getBoundingBox().height / 2);
                text.setString(msg);
                toast.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 * 4 / 5);
                toast.addChild(text);
            }
            toast.stopAllActions();
            toast.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
            text = toast.getChildByName('text');
            text.runAction(cc.sequence(cc.fadeIn(3), cc.fadeOut(0.3)));
        },
        shareClub: function (platform, clubData) {
            var url = 'http://www.yayayouxi.com/fydp';
            var title = '俱乐部名称：【' + clubData['name'] + '】';
            var description = '俱乐部ID[' + clubData['_id'] + ']，' + '玩家[' + gameData.nickname + ']邀请您加入，速度来啊！【全民斗牌】';
            var clubID = (clubData['id'] || clubData['_id']).toString();
            var strID = '';
            for (var i = clubID.length; i < 6; i++) {
                strID = strID + '0';
            }
            strID = strID + clubID;

            var url = 'http://pay.yayayouxi.com/mochuang/milnk/myclub/?url=https://ahq1at.mlinks.cc/A0Gc?roomid=' + strID
                + '&inviterHead=' + gameData.headimgurl
                + '&club=' + encodeURIComponent(clubData['name'])
                + '&inviterName=' + encodeURIComponent(gameData.nickname)
                + '&creatorHead=' + clubData.head
                + '&clubNum=' + clubData.players_count
                + '&creatorName=' + encodeURIComponent(clubData.nick);

            console.log(title);
            console.log(description);
            console.log(url);
            switch (platform) {
                case 'qq':
                    QQUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'dd':
                    DDUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'cp':
                    this.copyRoomId();
                    break;
                case 'xl':
                    XianLiaoUtils.shareGame(strID, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'lb':
                    LBUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
                case 'wx':
                default:
                    WXUtils.shareUrl(url, title, description, 0, getCurTimestamp() + gameData.uid);
                    break;
            }
        },
    });

    exports.ShareTypeLayer = ShareTypeLayer;
})(window);
