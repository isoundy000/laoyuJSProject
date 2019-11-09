/**
 * Created by zhanglm on 2017/12/21.
 */

ActivityCell = UIComponent.extend({
    m_data: null,
    m_detailCallbck: null,
    ctor: function (widget) {
        this._super();

        widget.addComponent(this);
        widget.setVisible(true);

        this.parseNode({
            m_btnSel: 'btnSel',
            m_txtTitle: 'txtTitle',
            m_imgRedDot: 'imgRedDot'
        });

        this.m_btnSel.setZoomScale(0);
        this.m_btnSel.ignoreContentAdaptWithSize(true);
        this.m_btnSel.addTouchEventListener(this.onTouchBg, this);
    },

    setData: function (data) {
        this.m_data = data;
        this.m_txtTitle.setString(data.m_title);
        this.setSelected(false);
        this.m_imgRedDot.setVisible(!data.m_read);
    },

    setSelected: function (val) {
        if (val) {
            this.m_btnSel.loadTextureNormal('res/mainmodules/common/layers/activity_layer/btn_sel_on.png', ccui.Widget.LOCAL_TEXTURE);
            this.m_txtTitle.setTextColor(cc.color(255, 255, 255, 255));
            this.m_btnSel.setTouchEnabled(false);
            this.m_imgRedDot.setVisible(false);
        } else {
            this.m_btnSel.loadTextureNormal('res/mainmodules/common/layers/activity_layer/btn_sel_off.png', ccui.Widget.LOCAL_TEXTURE);
            this.m_txtTitle.setTextColor(cc.color(148, 59, 24, 255));
            this.m_btnSel.setTouchEnabled(true);
        }
    },

    onTouchBg: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            if (this.m_detailCallbck) {
                this.m_detailCallbck(this);
            }
        }
    }
});

AnswerLayer = UIComponent.extend({
    m_curIdx: 0,
    m_rightCount: 0,
    m_optionBtnLst: null,
    m_answerLst: null,
    m_countDown: null,
    m_time: null,
    ctor: function () {
        this._super();

        this.m_optionBtnLst = [];
        this.m_answerLst = [];
        this.m_countDown = new CountDownSchedule();

        var activityData = DataManager.getInstance().getActivityData();
        var answerInfo = activityData.getActivityByType(AnswerType.answer);

        this.registerNotice(NtfGetAnswerData, this.onGetAnswerData, this);
        this.registerNotice(NtfPostAnswer, this.onPostAnswer, this);

        var rootNode = UIFileLoader.loadWithVisibleSize('res/Lobby/answer_layer.json').node;
        rootNode.addComponent(this);

        this.parseNode({
            m_btnClose: 'btnClose',
            m_panelStart: 'panelStart',
            m_panelQuestion: 'panelQuestion',
            m_panelResult: 'panelResult',
            m_txtQuestion: 'txtQuestion',
            m_btn1: 'btn1',
            m_btn2: 'btn2',
            m_btn3: 'btn3',
            m_btn4: 'btn4',
            m_btnStart: 'btnStart',
            m_btnNext: 'btnNext',
            m_txtTime: 'txtTime',
            m_txtScore: 'txtScore',
            m_txtAward: 'txtAward',
            m_txtStartInfo: 'txtStartInfo',
            m_btnOver: 'btnOver'
        });

        this.m_optionBtnLst.push(this.m_btn1);
        this.m_optionBtnLst.push(this.m_btn2);
        this.m_optionBtnLst.push(this.m_btn3);
        this.m_optionBtnLst.push(this.m_btn4);

        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
        this.m_btnStart.addTouchEventListener(this.onTouchStart, this);
        this.m_btnOver.addTouchEventListener(this.onTouchClose, this);
        this.m_btnNext.addTouchEventListener(this.onTouchNext, this);
        for (var i = 0; i < 4; ++i) {
            this.m_optionBtnLst[i].addTouchEventListener(this.onTouchOption, this);
        }

        this.m_panelStart.setVisible(true);
        this.m_txtStartInfo.setString(answerInfo.m_openData.rule);
        this.m_panelQuestion.setVisible(false);
        this.m_panelResult.setVisible(false);

        //var answerData = DataManager.getInstance().getActivityData().getAnswerData();
        //answerData.m_time = 5;
        //answerData.m_qeustionLst = [];
        //for (var i = 0; i < 5; ++i) {
        //    var question = new QuestionData();
        //    question.m_question = "问题" + (i + 1) + ":" + "???";
        //    question.m_optionLst.push("A答案");
        //    question.m_optionLst.push("B答案");
        //    question.m_optionLst.push("C答案");
        //    question.m_optionLst.push("D答案");
        //    question.m_answer = "A答案";
        //    answerData.m_qeustionLst.push(question);
        //}
        //
        //this.m_panelStart.setVisible(false);
        //this.goNext();

        this.node.addComponent(new InvitationGuard());
    },

    onExit: function () {
        this._super();
        this.m_countDown.unscheduleAll();
    },

    onTouchStart: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            MKEventSystem.sendCommand(CmdGetAnswerData);
            ProgressBar.show();
        }
    },

    onGetAnswerData: function (ntc) {
        ProgressBar.hide();
        if (ntc.getDigitalMessage() == 0) {
            this.m_panelStart.setVisible(false);
            this.goNext();
        }
    },

    onTouchClose: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            if (this.m_panelQuestion.isVisible()) {
                ConfirmDialog.show('是否放弃答题？', this.onConfirmClose.bind(this));
            } else {
                this.node.removeFromParent();
            }
        }
    },

    onConfirmClose: function (res) {
        if (res) {
            var answerData = DataManager.getInstance().getActivityData().getAnswerData();

            for (var i = this.m_answerLst.length - 1; i < answerData.m_qeustionLst.length; ++i) {
                var question = answerData.m_qeustionLst[i];
                this.m_answerLst.push({title: question.m_question, answer: ''});
            }

            var cmd = new MKCommand(CmdPostAnswer);
            cmd.setTextMessage(JSON.stringify(this.m_answerLst));
            MKEventSystem.sendCommand(cmd);

            this.node.removeFromParent();
        }
    },

    onTouchNext: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            this.goNext();
        }
    },

    onTouchOption: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            this.m_countDown.unschedule('update');
            this.m_txtTime.setString('');
            var optionIdx = this.m_optionBtnLst.indexOf(ref);
            this.chooseOption(optionIdx);
        }
    },

    chooseOption: function (optionIdx) {
        for (var i = 0; i < 4; ++i) {
            this.m_optionBtnLst[i].setTouchEnabled(false);
        }
        var answerData = DataManager.getInstance().getActivityData().getAnswerData();
        var question = answerData.m_qeustionLst[this.m_curIdx];
        this.m_curIdx++;

        var optionContent = '';
        if (optionIdx >= 0) {
            optionContent = question.m_optionLst[optionIdx];
        }

        var rightIdx = question.m_optionLst.indexOf(question.m_answer);
        if (rightIdx >= 0) {
            this.m_optionBtnLst[rightIdx].loadTextureNormal('Texture/lobby/activity/option_bg2.png', ccui.Widget.PLIST_TEXTURE);
        }

        this.m_answerLst.push({title: question.m_question, answer: optionContent});
        if (optionContent == question.m_answer) {
            this.m_rightCount++;
            var delay = cc.delayTime(1);
            var func = cc.callFunc(this.goNext, this);
            this.node.runAction(cc.sequence(delay, func));
        } else {
            if (optionIdx >= 0) {
                this.m_optionBtnLst[optionIdx].loadTextureNormal('Texture/lobby/activity/option_bg3.png', ccui.Widget.PLIST_TEXTURE);
            }

            this.m_btnNext.setVisible(true);
        }
    },

    goNext: function () {
        var answerData = DataManager.getInstance().getActivityData().getAnswerData();
        if (this.m_curIdx >= answerData.m_qeustionLst.length) {
            this.m_panelQuestion.setVisible(false);
            this.m_panelResult.setVisible(true);
            this.showResult();
        } else {
            this.m_panelQuestion.setVisible(true);
            this.m_panelResult.setVisible(false);
            this.showQuestion();
        }
    },

    showQuestion: function () {
        var answerData = DataManager.getInstance().getActivityData().getAnswerData();
        var question = answerData.m_qeustionLst[this.m_curIdx];
        this.m_txtQuestion.setString(question.m_question);

        this.m_btnNext.setVisible(false);
        this.m_time = answerData.m_time;
        this.m_txtTime.setString('');
        this.m_countDown.unschedule('update');
        this.m_countDown.schedule(this.updateTime.bind(this), 0.5, 'update');

        for (var i = 0; i < 4; ++i) {
            this.m_optionBtnLst[i].setVisible(false);
        }

        for (var i = 0, len = question.m_optionLst.length; i < len && i < 4; ++i) {
            var btn = this.m_optionBtnLst[i];
            btn.setVisible(true);
            btn.setTouchEnabled(true);
            btn.loadTextureNormal('Texture/lobby/activity/option_bg1.png', ccui.Widget.PLIST_TEXTURE);
            btn.getChildByName('txtOption').setString(question.m_optionLst[i]);
        }
    },

    updateTime: function (dt) {
        this.m_time -= dt;
        if (this.m_time < 0) {
            this.m_countDown.unschedule('update');
            this.m_txtTime.setString('');
            this.chooseOption(-1);
        } else {
            this.m_txtTime.setString(parseInt(this.m_time));
        }
    },

    onPostAnswer: function (ntc) {
        this.m_txtAward.setString(ntc.getTextMessage() + LocalStr('coin'));
    },

    showResult: function () {

        var cmd = new MKCommand(CmdPostAnswer);
        cmd.setTextMessage(JSON.stringify(this.m_answerLst));
        MKEventSystem.sendCommand(cmd);

        var answerData = DataManager.getInstance().getActivityData().getAnswerData();
        var score = cc.formatStr('共%d题，答对%d题', answerData.m_qeustionLst.length, this.m_rightCount);
        this.m_txtScore.setString(score);

        this.m_txtAward.setString('');
    }

});

ActivityLayer = UIComponent.extend({
    m_imgContent: null,
    m_data: null,
    ctor: function (index) {
        this._super();

        var rootNode = UIFileLoader.loadWithVisibleSize(main_module_common_res.activity_layer).node;
        rootNode.addComponent(this);

        this.parseNode({
            m_btnClose: 'btnClose',
            m_txtEmpty: 'txtEmpty',
            m_lstInfo: 'lstInfo',
            m_panelCell: 'panelCell',
            m_panelContent: 'panelContent',
            m_pannelBg: 'pannelBg'
        });

        this.m_panelCell.setVisible(false);
        this.m_txtEmpty.setVisible(false);
        this.m_btnClose.addTouchEventListener(this.onTouchClose, this);
        this.m_panelContent.addTouchEventListener(this.onTouchContent, this);

        var img = new ccui.ImageView();
        this.m_imgContent = new NetImage();
        img.addComponent(this.m_imgContent);
        img.setContentSize(this.m_panelContent.getContentSize());
        img.ignoreContentAdaptWithSize(false);
        img.setAnchorPoint(cc.p(0, 0));
        this.m_panelContent.addChild(img);

        this.registerNotice(NtfGetActivityData, this.onGetActivityData, this);

        this.setListData(index);

        this.node.addComponent(new KeybackComponent(this.onTouchClose, this));
        if (this.m_pannelBg) {
            this.m_pannelBg.addComponent(new PopAnimation());
        }
        this.registerNotice(NtfNetworkErr, this.onNetwork, this);
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
        MKEventSystem.sendCommand(CmdUpdateActivityState);
    },

    onTouchClose: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            this.node.removeFromParent();
        }
    },

    onGetActivityData: function () {
        if (this.m_lstInfo.getItems().length == 0) {
            this.setListData();
        }

    },

    setCurShow: function (type) {
        var activityData = DataManager.getInstance().getActivityData();
        var data = activityData.getActivityList();

        var len = data.length;
        for (var i = 0; i < len; ++i) {
            var info = data[i];
            if (info.m_open == type) {
                this.onShowDetail(this.m_lstInfo.getItems()[i].getComponent(UIComponent.Name));
                break;
            }
        }
    },

    setListData: function (index) {
        index = index == undefined ? 0 : index;
        var activityData = DataManager.getInstance().getActivityData();
        var data = activityData.getActivityList();

        var len = data.length;
        for (var i = 0; i < len; ++i) {
            var cell = new ActivityCell(this.m_panelCell.clone());
            this.m_lstInfo.pushBackCustomItem(cell.node);
            cell.m_detailCallbck = this.onShowDetail.bind(this);
            cell.setData(data[i]);
        }

        if (len == 0) {
            this.m_txtEmpty.setVisible(true);
        } else {
            this.m_txtEmpty.setVisible(false);
            this.onShowDetail(this.m_lstInfo.getItems()[index].getComponent(UIComponent.Name));
        }
    },

    onShowDetail: function (cell) {
        if (this.m_data == cell.m_data) {
            return;
        }

        this.m_data = cell.m_data;

        for (var i = 0, len = this.m_lstInfo.getItems().length; i < len; ++i) {
            var ele = this.m_lstInfo.getItems()[i];
            ele.getComponent(UIComponent.Name).setSelected(false);
        }

        cell.setSelected(true);

        if (!this.m_data.m_read) {
            var cmd = new MKCommand(CmdReadActivity);
            cmd.setTextMessage(this.m_data.m_id);
            MKEventSystem.sendCommand(cmd);
        }

        this.m_imgContent.setUrl(this.m_data.m_url);
    },

    onTouchContent: function (ref, touchType) {
        if (touchType === ccui.Widget.TOUCH_ENDED) {
            if (this.m_data == null) {
                return;
            }

            // m_open: 跳转参数

            if (!this.m_data.m_open) {
                return;
            }
        }
    }
});

