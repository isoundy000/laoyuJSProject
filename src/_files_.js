var localStorage = cc.sys.localStorage;

var jsFiles = [
    "src/resource.js",
    "src/libs/base64.js",
    
    "src/netbase.js",
    "src/network.js",

    "src/common/gameData.js",
    "src/common/utils.js",

    "src/GameScene.js",

    "src/Utils/AccelerometerUtils.js",
    "src/Utils/AgoraUtil.js",
    "src/Utils/AliUtils.js",
    "src/Utils/CCSUtils.js",
    "src/Utils/CryptoUtils.js",
    "src/Utils/DDUtils.js",
    "src/Utils/DeviceUtils.js",
    "src/Utils/IAPUtils.js",
    "src/Utils/LBUtils.js",
    "src/Utils/LocationUtils.js",
    "src/Utils/MicLayer.js",
    "src/Utils/Misc.js",
    "src/Utils/MWUtil.js",
    "src/Utils/NetUtils.js",
    "src/Utils/OldVoiceUtils.js",
    "src/Utils/Overloads.js",
    "src/Utils/PermissionUtils.js",
    "src/Utils/QQUtils.js",
    "src/Utils/ShaderUtils.js",
    "src/Utils/StringUtils.js",
    "src/Utils/TaiJiDunUtils.js",
    "src/Utils/TimeUtils.js",
    "src/Utils/TouchUtils.js",
    "src/Utils/VoiceUtils.js",
    "src/Utils/WXUtils.js",
    "src/Utils/XianLiaoUtils.js",
    "src/Utils/SubUpdateUtils.js",
    "src/Utils/LocationManager.js",
    "src/Utils/AliPushUtil.js",
    "src/Utils/Sdk.js",

    "src/extern/ButtonExtern.js",
    "src/extern/ccLayerExtern.js",
    "src/extern/EventExtern.js",
    "src/extern/FunctionExtern.js",
    "src/extern/TableViewExtern.js",
    "src/extern/TouchExtern.js",

    // "src/extern/UIExtern.js",

    "src/data/Config.js",
    "src/data/Constants.js",
    "src/data/DataCenter.js",
    "src/data/Keys.js",
    "src/data/LocalData.js",
    "src/data/ProtoList.js",
    "src/data/RuleData.js",
    "src/data/UserData.js",
    "src/data/ViewConfig.js",
    "src/data/ReplayData.js",

    "src/manager/ByteHandler.js",
    "src/manager/HUD.js",
    "src/manager/mProto.js",
    "src/manager/mAccount.js",
    "src/manager/mCard.js",
    "src/manager/mRoom.js",
    "src/manager/mAction.js",
    "src/manager/mEffect.js",

    "src/view/common/Loading.js",
    "src/view/common/MessageBox.js",
    "src/view/common/MessageLayer.js",

    "src/common/pokerRule.js",
    "src/common/BaseMessage.js",

    "src/view/login/Login.js",
    "src/view/login/Logo.js",
    // "src/view/login/CoverLayer.js",

    "src/view/home/Home.js",
    "src/view/home/NoticeLayer.js",
    "src/view/home/LotteryLayer.js",
    "src/view/home/LotteryRuleLayer.js",
    "src/view/home/MyRewardLayer.js",
    "src/view/home/ShopLayer.js",
    "src/view/home/PlayerInfoLayer.js",
    "src/view/home/LunBoLayer.js",

    "src/view/home/MainLayer.js",
    "src/view/login/CoverLayer.js",


    "src/view/room/RoomJoin.js",
    "src/view/room/CreateRoomLayer.js",

    'src/view/room/PokerPlayBackLayer.js',
    "src/view/room/AnimMic.js",
    "src/view/room/ChatErrorNode.js",
    "src/view/room/ChatNotSendNode.js",
    "src/view/room/Settings.js",
    "src/view/room/ChatLayer.js",
    "src/view/room/PlayerBackLayer.js",
    "src/view/room/ShareLayer.js",
    "src/view/home/YaoQingLayer.js",
    "src/view/home/DaiKai.js",
    "src/view/home/DaiKaiItem.js",
    "src/view/room/SafeTipLayer.js",
    "src/view/room/CuoPaiLayer.js",
    "src/view/room/CuoOnePaiLayer.js",
    "src/view/room/LastReviewLayer.js",
    "src/view/room/ReplaceCardLayer.js",

    "src/view/rule/Rule.js",

    //推荐制度
    "src/view/wxshop/WxShopLayer.js",
    "src/view/wxshop/BindingAgencyLayer.js",
    "src/view/wxshop/BindingTipPop.js",

    "src/view/home/HuoDongLayer.js",
    "src/view/home/HuoDongGuiZheLayer.js",
    "src/view/home/ZaDanLayer.js",
    "src/view/home/ZhongJiangLayer.js",
    "src/view/home/RotatingMenu.js",
    "src/view/home/CoinShopLayer.js",

    "src/view/history/History.js",
    "src/view/history/HistoryCell.js",
    "src/view/history/NiuniuHistoryCell.js",
    "src/view/history/HistoryDetail.js",
    "src/view/history/HistoryDetailCell.js",
    "src/view/history/ZhanjiHuiFangLayer.js",

    'src/view/history/HuifangZhanjiLayer.js',
    'src/view/history/HuifangDetailedLayer.js',

    "src/app.js",
    "src/YunCengKey.js",

    //实名制
    "src/view/verify/VerifyLayer.js",
    "src/view/share/JieSuanShare.js",

    //牛牛
    "src/view/history/HistoryDetailNiuNiu.js",

    'src/view/room/NiuniuWanfaLayer.js',
    'src/view/room/ShenqingjiesanLayer.js',
    'src/view/room/PlayerLocationInfoLayer.js',

    //比赛场
    // "src/view/match/MatchDetailLayer.js",
    // "src/view/match/MatchMainLayer.js",
    // "src/view/match/MatchJinJiLayer.js",
    // "src/view/match/MatchPromotionLayer.js",
    // "src/view/match/MatchRankLayer.js",
    // "src/view/match/MatchResultItem.js",
    // "src/view/match/MatchResultListLayer.js",
    // "src/view/match/MatchResultsLayer.js",
    // "src/view/match/MatchRewardLayer.js",
    // "src/view/match/MatchShareTipLayer.js",
    // "src/view/match/RichLabel.js",

    //跑得快金币场
    "src/view/jbc/pdk/JBCMainLayer.js",
    "src/view/jbc/pdk/JBCLevelItem.js",
    "src/view/jbc/pdk/RuleJBC_PDK.js",
    "src/view/jbc/pdk/RuleJBC_Data.js",

    //俱乐部
    // "src/view/club/ClubMainLayer.js",
    // "src/view/club/ClubTablesLayer.js",
    // "src/view/club/ClubInfoItem.js",
    // "src/view/club/ClubJoinLayer.js",
    // "src/view/club/ClubMemberLayer.js",
    // "src/view/club/ClubSettingLayer.js",
    // "src/view/club/ClubNoticeLayer.js",
    // "src/view/club/ClubMsgLayer.js",
    // "src/view/club/ClubInviteLayer.js",
    // "src/view/club/ClubInputLayer.js",
    // "src/view/club/ClubTableOperateLayer.js",
    // "src/view/club/ClubSelectGameLayer.js",
    // "src/view/club/GuideLayer.js",
    // "src/view/club/ClubZhanjiLayer.js",
    // "src/view/club/ClubShowTimeLayer.js",
    // //俱乐部邀请在线好友
    // "src/view/club/ClubMemberInviteLayer.js",
    // "src/view/club/ClubAssistant.js",

    "src/view/home/ShareTypeLayer.js",

    "src/view/home/RedRainLayer.js",
    "src/view/home/ActivityMsgLayer.js",
    "src/view/room/ScpdkPlayBackLayer.js",

    'src/frameworks/FrameworkConfig.js',
    'src/frameworks/utils/SGameHelper.js',
    'src/mainmodules/MainConfig.js',

    // add playerinfo.
    "src/playerInfo/BDIphone.js",
    "src/playerInfo/NewPlayerInfo.js",
    "src/playerInfo/TiShi.js",
    "src/playerInfo/loadImage.js",


    //表情
    "src/view/prop/BuyTishiLayer.js",
    "src/view/prop/PlayerInfoLayerInGame.js",

];