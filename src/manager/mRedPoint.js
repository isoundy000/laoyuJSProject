var mRedPoint = {
    init: function () {
    },

    FuncId : {
        //活动奖励 0x01 成就奖励 0x02 奇遇状态 0x04 竞技场 0x08 神殿排行榜 0x16
        RP_Activity:1,
        RP_Achievement:2,
        RP_Meeting:3,
        RP_Arena:4,
        RP_Temple:5,
        //邮件 商城 阵容 首页
        RP_Mail:6,
        RP_Shop:7,
        RP_Team:8,     //end
        RP_Home:9,
        RP_Mail2:10,
        RP_Arena2:11
    },

    pointList : {},
    registerFunction: function (control, id, posX, posY) {
        var pointInfo = {};
        id = id.toString();
        pointInfo.id = id;
        pointInfo.control = control;

        if(control.redpoint == null){
            var img = new cc.Sprite();
            img.initWithSpriteFrameName("bg_072.png");

            control.addChild(img);
            control.redpoint = img;
            img.setPosition(posX, posY);

            var active = mRedPoint.checkActive(parseInt(id));
            img.setVisible(active);
        }
        mRedPoint.pointList[id] = pointInfo;
    },

    checkFuncControl:function(pointInfo){
        if(pointInfo == null)return false;
        if(pointInfo.control == null)return false;
        if(pointInfo.control.checkNoRunning())return false;
        return true;
    },

    updateRedPoint:function(){
        for(var i=1;i<12;i++){
            var funId = i.toString();
            var funcInfo = mRedPoint.pointList[funId];
            if(this.checkFuncControl(funcInfo) == false) continue;

            var active = mRedPoint.checkActive(funId);
            funcInfo.control.redpoint.setVisible(active);
        }
    },

    checkActive:function(i){
        var active = false;
        var index = i;
        if(i == 9 || i == 10) index = 6;
        if(i == 11) index = 4;

        if(index<6){
            var rpStatus = DD[T.CharacterInfo].hasUnOpitionStatus;
            active = isBitActive(rpStatus, index-1);
        }else if(index==6){
            active = mMail.hasNewMail();
        }else if(index==7){
            active = mRedPoint.hasFreeGacha();
        }else if(index==8){
            active = mTeam.hasTeamAction();
        }
        return active;
    },

    hasFreeGacha:function(){
        var recruitInfo = DD[T.RecruitInfo];
        if(recruitInfo == null)return false;
        var timeOffset = parseInt((Date.now() - recruitInfo.msgTime)/1000);
        var f1 = mRedPoint.isFree(recruitInfo.todayRecruitLowCount,5,recruitInfo.nextRecruitLowTime - timeOffset);
        var f2 = mRedPoint.isFree(0,1,recruitInfo.nextRecruitMiddleTime - timeOffset);
        var f3 = mRedPoint.isFree(0,1,recruitInfo.nextRecruitHighTime - timeOffset);

        if(f1 == true || f2 == true || f3 == true)
            return true;
        return false;
    },

    isFree:function(freeCount, maxFreeCount, nextTime){
        if(nextTime <= 0 && (maxFreeCount - freeCount) > 0){
            return true;
        }
        return false;
    }
}