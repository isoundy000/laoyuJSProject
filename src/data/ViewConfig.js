var ViewConfig = {
    getAdventures:function() {
        var aryViews = [
            {id:1,name:"征服地狱", lv:25, icon:"ic_021.png", view:HUD_LIST.HellConquest, type:1},
            {id:2,name:"炼制装备", lv:20, icon:"ic_026.png", view:HUD_LIST.MakeItem, type:0},
            {id:3,name:"炼制法宝", lv:20, icon:"ic_013.png", view:HUD_LIST.MakeItem, type:2},
            {id:4,name:"炼制道具", lv:20, icon:"ic_012.png", view:HUD_LIST.MakeItem, type:1},
            {id:5,name:"讨伐恶魔", lv:30, icon:"ic_029.png", view:HUD_LIST.EvilFight, type:1},
            {id:6,name:"圣杯战争", lv:45, icon:"ic_027.png", view:HUD_LIST.CupFightMain, type:1}
        ];
        return this.getReturnList(aryViews);
    },

    getMeetings:function() {
        var aryViews = [
            {id:1,name:"偷吃禁果", lv:0, icon:"ic_025.png", view:HUD_LIST.EatApple, type:1},
            {id:2,name:"膜拜上帝", lv:0, icon:"ic_023.png", view:HUD_LIST.WorshipGod, type:1},
            {id:3,name:"等级礼包", lv:0, icon:"ic_024.png", view:HUD_LIST.LevelGift, type:1},
            {id:4,name:"登录礼包", lv:0, icon:"ic_028.png", view:HUD_LIST.LoginGift, type:1}
        ];
        return this.getReturnList(aryViews);
    },

    getActivities:function() {
        var aryViews = [
            {id:1,name:"充值礼包", lv:0, icon:"ic_022.png", openIdx:-1, view:HUD_LIST.A_Recharge, type:1},
            {id:2,name:"感恩回馈", lv:0, icon:"ic_020.png", openIdx:-1, view:HUD_LIST.A_FeedBack, type:1},
            {id:3,name:"VIP商店", lv:0, icon:"ic_015.png", openIdx:-1, view:HUD_LIST.A_VIPShop, type:1},
            {id:4,name:"秘宝兑换", lv:0, icon:"ic_014.png", openIdx:10, view:HUD_LIST.A_SecretExchange, type:1},
            {id:5,name:"爱神賜福", lv:0, icon:"ic_016.png", openIdx:19, view:HUD_LIST.A_LoveGod, type:1},
            {id:6,name:"新手目标", lv:0, icon:"ic_019.png", openIdx:2, view:HUD_LIST.A_NewComer, type:1},
            {id:7,name:"累计充值", lv:0, icon:"ic_018.png", openIdx:3, view:HUD_LIST.A_Total, type:1},
            {id:8,name:"累计消费", lv:0, icon:"ic_017.png", openIdx:12, view:HUD_LIST.A_Total, type:2}
        ];

        var viewList = [];
        var level = DD[T.CharacterInfo].level;
        for (var i = 0, li = aryViews.length; i < li; i++) {
            if(aryViews[i].lv <= level){
                var openIdx = aryViews[i].openIdx;
                var isOpen = false;
                if(openIdx == -1){
                    isOpen = true;
                }else{
                    isOpen = DD[T.CharacterInfo].activityOpening[openIdx];
                }
                if(isOpen == true)
                    viewList.push(aryViews[i]);
            }
        }
        return viewList;
    },

    getReturnList:function(aryViews){
        var viewList = [];
        var level = DD[T.CharacterInfo].level;
        for (var i = 0, li = aryViews.length; i < li; i++) {
            if(aryViews[i].lv <= level){
                viewList.push(aryViews[i]);
            }
        }
        return viewList;
    }

};
