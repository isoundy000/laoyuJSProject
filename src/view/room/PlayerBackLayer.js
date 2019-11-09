/**
 * Created by zhangluxin on 16/7/13.
 */

var PlayerBackLayer = {
    step: 0,
    round: 0,//第几轮  快进快退  退的是轮
    lastround: 0,
    delayTime: 500,
    isPause: false,
    clickBackToWardTime: 0,//快进快退时间
    init: function () {
        var root = getUI(this, "root");
        this.btn_backward = getUI(root, "backward");
        this.btn_backward2 = getUI(root, "backward2");
        this.btn_back = getUI(root, "back");
        this.btn_toward = getUI(root, "toward");
        this.btn_toward2 = getUI(root, "toward2");
        this.btn_pause = getUI(root, "pause");
        this.btn_play = getUI(root, "play");
        this.txt_step = getUI(root, "txt_step");
        TouchUtils.setOnclickListener(this.btn_play, this.playReplay.bind(this));
        TouchUtils.setOnclickListener(this.btn_pause, this.pauseReplay.bind(this));
        TouchUtils.setOnclickListener(this.btn_back, this.exit.bind(this));
        TouchUtils.setOnclickListener(this.btn_backward, this.backward.bind(this));
        TouchUtils.setOnclickListener(this.btn_toward, this.toward.bind(this));
        mRoom.interval = setInterval(this.run.bind(this), this.delayTime);

        this.btn_backward2.setVisible(false);
        this.btn_toward2.setVisible(false);

        this.lastround =  mRoom.replayData.getLastRound();

        // var pScheduler = cc.director.getScheduler();
        // pScheduler.setTimeScale(30);
    },
    playReplay: function () {
        this.btn_play.setVisible(false);
        this.btn_pause.setVisible(true);
        this.isPause = false;
    },
    pauseReplay: function () {
        this.btn_play.setVisible(true);
        this.btn_pause.setVisible(false);
        this.isPause = true;
    },
    backward: function () {
        //快进和快退的时间要间隔
        var now = new Date().getTime();
        if((now - this.clickBackToWardTime) < 300){
            return;
        }
        this.clickBackToWardTime = now;
        if(this.round > 0){
            this.parent.clearRoom();
            this.pauseReplay();
            this.round--;
            var playerscards = mRoom.replayData.getAllPlayerCardsByStep(this.round);
            this.step = mRoom.replayData.getStepByRound(this.round);
            this.step = parseInt(this.step) - 1;
            this.resetPlayerCards(playerscards);
        }
        this.setBackTowardStatus();
    },
    toward: function () {
        //快进和快退的时间要间隔
        var now = new Date().getTime();
        if((now - this.clickBackToWardTime) < 300){
            return;
        }
        this.clickBackToWardTime = now;
        if(this.round < this.lastround){
            this.parent.clearRoom();
            this.pauseReplay();
            this.round++;
            var playerscards = mRoom.replayData.getAllPlayerCardsByStep(this.round);
            this.step = mRoom.replayData.getStepByRound(this.round);
            this.step = parseInt(this.step) - 1;
            this.resetPlayerCards(playerscards);
        }
        this.setBackTowardStatus();
        if(this.round == this.lastround){
            this.isPause = false;
        }
    },
    setBackTowardStatus: function(){
        if(this.round == 0){
            this.btn_toward.setVisible(true);
            this.btn_toward2.setVisible(false);
            this.btn_backward.setVisible(false);
            this.btn_backward2.setVisible(true);
        }else if(this.round == this.lastround){
            this.btn_toward.setVisible(false);
            this.btn_toward2.setVisible(true);
            this.btn_backward.setVisible(true);
            this.btn_backward2.setVisible(false);
        }else{
            this.btn_toward.setVisible(true);
            this.btn_toward2.setVisible(false);
            this.btn_backward.setVisible(true);
            this.btn_backward2.setVisible(false);
        }
    },
    setData: function(parent){
        if(parent) this.parent = parent;
    },
    resetPlayerCards: function (playerscards) {
        for(var id in playerscards){
            var playercard = playerscards[id];
            var pos = this.parent.getUserPosIndex(id);
            var outCards = this.parent["out" + pos];
            var openCards = this.parent["open" + pos];

            if(pos == 0){
                DD[T.CardList] = playercard.cards;
                var cardList = mCard.getCardList();
                this.parent.cardList = cardList;
                this.parent.setupCards()
            }else if(pos == 1){
                DD[T.CardList1] =  playercard.cards;
                this.parent["cardList1"] = mCard.getOtherCardList(DD[T.CardList1]);
                this.parent.setupOtherCards(1);
            }else if(pos == 2){
                DD[T.CardList2] =  playercard.cards;
                this.parent["cardList2"] = mCard.getOtherCardList(DD[T.CardList2]);
                this.parent.setupOtherCards(2);
            }else{
                DD[T.CardList3] =  playercard.cards;
                this.parent["cardList3"] = mCard.getOtherCardList(DD[T.CardList3]);
                this.parent.setupOtherCards(3);
            }
            for (var j = 0; j < playercard.out.length; j++) {
                var card = playercard.out[j];
                outCards.addCard(card);
            }
            for (var j = 0;j<playercard.open.length;j++) {
                openCards.addCards(playercard.open[j].cards, playercard.open[j].typ, false);
            }
            //设置胡息
            this.parent.updateHX(pos);
            this.parent.txtCardCount.setString(mAction.leftCardCount);
        }
    },
    exit: function () {
        HUD.showMessageBox("提示", "是否要退出当前回放?",
            function () {
                mRoom.isReplay = false;
                clearInterval(mRoom.interval);
                HUD.showScene(HUD_LIST.Home);
            },
            false
        );
    },
    run: function () {
        if (this.isPause) {
            return;
        }
        this.step++;
        if (mRoom.replayData.isOver(this.step)) {
            clearInterval(this.interval);
        } else {
            this.round = mRoom.replayData.getRound(this.step);
            mRoom.replayData.runEvent(this.step);
        }
        this.changeTxtStep();
        this.setBackTowardStatus();
    },
    changeTxtStep: function () {
        var len = mRoom.replayData.getDataLength();
        var percent = Math.floor(this.step * 10000 / len) / 100.0;
        this.txt_step.setString(percent + "%");
    }
};