(function () {
    var exports = this;

    var $ = null;

    var ReplaceCardLayer = cc.Layer.extend({
        ctor: function (arr) {
            var that = this;
            this._super();

            var scene = ccs.load(res.ReplaceCardLayer_json, 'res/');
            this.addChild(scene.node);
            $ = create$(this.getChildByName("Layer"));

            arr = [1,2,3,5];
            this.alltime = 10;


            TouchUtils.setOnclickListener($('root.mask.close'), function () {
                that.removeFromParent();
            });
            TouchUtils.setOnclickListener($('root.mask.btn_ok'), function () {
                var replaceArr = [];
                var upPaiArr = [];
                for(var i=0;i<arr.length;i++) {
                    var card = $('root.mask.card' + (i + 1));
                    card.pos = card.getPosition();
                    if(card.replaceFlag)  {
                        replaceArr.push(card);
                        upPaiArr.push(card.pai);
                    }
                }
                if(replaceArr.length == 0){
                    HUD.showMessage('请选择要替换的牌', true);
                }else{
                    for(var i=0;i<replaceArr.length;i++) {
                        var card = replaceArr[i];
                        card.runAction(cc.sequence(
                            cc.delayTime(i * 0.2),
                            cc.spawn(
                                cc.rotateTo(0.3, -20),
                                cc.moveTo(0.3, cc.p(1450, 300))),
                            cc.delayTime(0.3 + replaceArr.length*0.2),
                            cc.spawn(
                                cc.rotateTo(0.3, 0),
                                cc.moveTo(0.3, card.pos)),
                            cc.callFunc(function(sender){
                                sender.getChildByName('replace').setVisible(false);
                                sender.getChildByName('light').setVisible(true);
                                sender.setLocalZOrder(1);
                            })
                        ));
                    }
                    console.log(upPaiArr);
                    // network.wsData([
                    //     'Replace',
                    //     upPaiArr.join(',')
                    // ].join('/'));
                }
            });
            $('root.mask.time').setString(this.alltime);
            this.interval = setInterval(function(){
                that.alltime --;
                $('root.mask.time').setString(that.alltime);
                if(that.alltime <= 0){
                    if (that.interval) {
                        clearInterval(that.interval);
                        that.interval = null;
                    }
                    // that.removeFromParent();
                }
            }, 1000);

            for(var i=0;i<arr.length;i++) {
                var card = $('root.mask.card' + (i+1));
                card.setScale(1.2);
                card.setPositionY(300);
                card.pai = arr[i];
                card.replaceFlag = false;
                card.getChildByName('replace').setVisible(false);
                this.setPaiHua(card, arr[i]);
                card.runAction(cc.sequence(
                    cc.delayTime(i * 0.2),
                    cc.spawn(
                        cc.rotateTo(0.3, 0),
                        cc.moveTo(0.3, cc.p(1280 / 2 - (arr.length / 2 - i - 0.5) * 240, 300)))
                ));
                (function(i){
                    var card = $('root.mask.card' + (i+1));
                    TouchUtils.setOnclickListener(card, function (sender) {
                        sender.replaceFlag = !sender.replaceFlag;
                        sender.setLocalZOrder((sender.replaceFlag) ? -1:1);
                        sender.getChildByName('replace').setVisible((sender.replaceFlag));
                        sender.getChildByName('light').setVisible(!(sender.replaceFlag));
                    }, {effect: TouchUtils.effects.NONE});
                })(i)
            }
        },
        setPaiHua: function (pai, val) {
            var that = this;
            if (val == -1) {
                return;
            }
            var arr = getPaiNameByIdNN(val);
            //数字的
            setPokerFrameByNameNN(pai, arr);
        },
        onEnter: function () {
            this._super();

        },
        onExit: function () {
            this._super();
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }

    });
    exports.ReplaceCardLayer = ReplaceCardLayer;
})(window);