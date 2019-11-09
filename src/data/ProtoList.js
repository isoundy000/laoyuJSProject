ProtoTypes = {};
ProtoNewTypes = {};

ProTyp = {
    OLD: "old",
    SSS: "sss"
}

P =
    {
        GS_Login: 1,	//登录
        GS_StatusChange: 11,  //客户端状态变更
        GS_UserJoin: 101,
        GS_UserLeave: 102,
        GS_UserDisconnect: 103,	//玩家临时掉线，真正掉线采用 	GS_UserLeave
        GS_GameOver: 105, 	//服务器宣布游戏结束
        GS_GameResult: 106,	//游戏战绩显示.
        GS_CardDeal: 107,	//发牌
        GS_GameStart: 109,	//开始游戏，之后发牌
        GS_GameTurn_Out: 110, //到谁出牌了，开始读秒
        GS_GameTurn_In: 111, //请客户端选择是否进牌
        GS_BroadcastAction: 112,  // 广播
        GS_RoomInfo: 113,  // 断线重连之后，获取房间ID
        GS_Create_Room: 114, 	//创建一个房间
        GS_Chat: 115, //聊天广播
        GS_Vote: 116, //投票广播
        GS_Marquee: 117, // 跑马灯
        GS_RoomResult: 118,  //房间结算
        GS_UserKick: 119, //号被顶
        GS_Niao_Status: 120,
        GS_Pls_Disconnect: 121,
        GS_Jushou_Status: 122, //广播三个玩家的举手状态，在每一轮开始的时候广播
        GS_Baojing_Status: 123,
        GS_Fanxing_Status: 124,
        GS_ReadyStatus: 126,


        //牛牛
        GS_Login_NiuNiu: 501,
        GS_UserJoin_NiuNiu: 601,
        GS_GameStart_NiuNiu: 609,
        GS_Vote_NiuNiu: 616,
        GS_RoomResult_NiuNiu: 618,
        GS_NiuniuOver: 130, 	//服务器宣布游戏结束
        GS_GameChipIn: 200, 	//下注
        GS_GameShowHand: 201,	//翻牌，亮牌
        GS_ReadyNotify: 202,	//int变量的status变化
        GS_Qiangzuang: 203,	//抢庄。 -1 可以抢，0不能抢 1：抢 2:放弃
        GS_Preview: 204,
        GS_AutoAction: 206, //倒计时
        GS_Sitdown: 207,
        GS_LastResult: 208,
        // GS_ActionList_MSG: 209,
        GS_Replace: 209,


        //长牌
        GS_PushCard: 151,  //通知玩家出牌
        GS_CacheCard: 152,  //通知玩家摸牌
        GS_AllAnCard: 153,  //开局偷牌结束后 通知玩家的状态
        GS_SelectDang: 154, //通知玩家当和推当
        // GS_SelectPiao:155, //通知玩家选择飘
        GS_Piao_Status: 156, //通知玩家所有人飘信息
        GS_DangInfo: 157, //通知所有玩家当的玩家
        CP_GS_GameOver: 158,//长牌结算
        CP_GS_RoomResult: 159,//zong结算
        CP_GS_GameStatus: 160,//游戏状态广播
        CP_GS_ToGameStart: 161,//开始游戏按钮点击

        GS_NetWorkClose: 10001//网络断开
    };

P_SSS = {
    GS_Login: 1,	//登录
    GS_UserJoin: 101,	//玩家加入房间
    GS_UserLeave: 102,	//玩家离开房间
    GS_UserDisconnect: 103,	//玩家临时掉线，真正离开采用 	GS_UserLeave
    GS_GameOver: 105, 	//服务器宣布游戏结束
    GS_GameResult: 106,	//游戏战绩显示.
    GS_CardDeal: 107,	//发牌
    GS_GameStart: 109,	//开始游戏，之后发牌
    GS_GameTurn_Out: 110, //到谁出牌了，开始读秒
    GS_BroadcastAction: 112,  // 广播
    GS_RoomInfo: 113,  // 断线重连之后，获取房间ID
    GS_Chat: 115, //聊天广播
    GS_Vote: 116, //投票广播
    GS_Marquee: 117, //跑马灯
    GS_RoomResult: 118, //房间结算
    GS_UserKick: 119, //被自己的另一个账号踢下线
    GS_Pls_Disconnect: 121, //请客户端断开连接，关闭定时器，重连等
    GS_NiuniuOver: 130, 	//服务器宣布游戏结束
    GS_GameChipIn: 200, 	//下注
    GS_GameShowHand: 201,	//翻牌，亮牌
    GS_ReadyNotify: 202,	//int变量的status变化
    GS_Qiangzhuang: 203,	//抢庄。 -1 可以抢，0不能抢 1：抢 2:放弃
    GS_Preview: 204, //预览
    GS_StartImmediately: 205,//人数不够的情况下，立刻开始，并且修改房间人数
    GS_ShowStartBtn: 206, //显示开始按钮

    GS_Hint: 207, //提示
    GS_Submit: 208, //提交牌
    GS_BattleResult: 209, //比牌结果
    GS_Sitdown: 210, //
    GS_AutoAction: 211,//自动动作
}

ERR_CODE =
    {
        VERSION_ERR: 10,
    };