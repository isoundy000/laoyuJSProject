var res_sound_root = 'res/music/music_temporary/';

var GlobalRes = {
    //全局定义的资源放在这里-----此部分只是为了整理全部资源的时候的其他的资源放置位置，不作为代码里面的使用内容--
    res_project_manifest: 'res/project.manifest'
    , res_paohuzi_proto: 'res/paohuzi.proto'
    , res_icon_png: 'res/icon.png'  //ruru
    , res_favicon_png: 'res/favicon.png'  //ruru
    , res_loading_js: 'res/loading.js'  //ruru
};


var sexEffects = [
    'nn0', 'nn1', 'nn2', 'nn3', 'nn4', 'nn5', 'nn6', 'nn7', 'nn8', 'nn9', 'nn10', 'nn11', 'nn12', 'nn13', 'kanpai', 'jiazhu', 'nn14', 'nn15', 'nn16'
];
var skeletons = [
    'shenglijiesuan', 'shenglishibai', 'feijizhadan', 'woxianchu', 'button_anim2', 'vs1', 'tubiao_tx'
];
var effectSkeletons = [
    'daoju_dapao', 'maobi', 'daoju_gongjian', 'daoju_caishen', 'daoju_zhayao', 'daoju_qifu',
];

var soundDirProp = 'res/prop/sound/';
var soundExt = '.mp3';

//扑克 音效
var sexEffectsPoker = [
    'pass', 'rocket', 'shunzi', 'three_one', 'three_with_one', 'three_with_one_pair',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
    'aircraft_with_wings',

    'airplane',
    'bomb',
    'wangzha',
    'continuous_pair',
    'four_with_one_pair',
    'four_with_two',
    'four_with_three',
    'I_got_left_one_cards',
    'I_got_left_one_cards_erdou',
    'I_got_left_two_cards',
    'I_got_left_two_cards_erdou',
    'mingpai',
    'no',
    'buyao1', 'buyao2', 'buyao3',
    'pair0', 'pair1', 'pair2', 'pair3', 'pair4', 'pair5', 'pair6', 'pair7', 'pair8', 'pair9', 'pair10', 'pair11', 'pair12',
    'tuple0', 'tuple1', 'tuple2', 'tuple3', 'tuple4', 'tuple5', 'tuple6', 'tuple7', 'tuple8', 'tuple9', 'tuple10', 'tuple11', 'tuple12',
    'pk_three'
];


var g_resources = [


    //跑胡子里面使用的一些资源文件
    'res/image/ui/result/h_di.png',
    'res/image/ui/result/h_hei.png',
    'res/image/ui/result/h_hong.png',
    'res/image/ui/result/h_tian.png',
    'res/image/ui/result/h_zimo.png',

    'res/image/ui/result/h_add.png',
    'res/image/ui/result/h_mul.png',

    'res/image/ui/result/h_hong2.png',
    'res/image/ui/result/h_zdh.png',
    'res/image/ui/result/h_jdh.png',
    'res/image/ui/result/h_hw.png',
    'res/image/ui/result/h_wh.png',
    'res/image/ui/result/h_ddh.png',
    'res/image/ui/result/h_big.png',
    'res/image/ui/result/h_small.png',
    'res/image/ui/result/h_hdh.png',


    'res/image/ui/common/bg_message.png',
    'res/image/ui/common/PopTishi.png'
];
var g_resourcesMusic = [];
var resJson = {
    //界面
    Chat_json: 'res/ccs/room/Chat.json'
    , PlayerInfo_json: 'res/ccs/home/PlayerInfo.json'
    , NoPluginLayer_json: 'res/ccs/home/NoPluginLayer.json'
    , NoticeMatchLayer_json: 'res/ccs/home/NoticeMatchLayer.json'
    , XuezhanShangxian_json: 'res/ccs/home/XuezhanShangxian.json'
    , PlayerInfoOther_json: 'res/ccs/home/PlayerInfoOther.json'
    , CreateRoom_json: 'res/ccs/room/CreateRoom.json'
    , CreateRoomSelectPop: 'res/ccs/home/CreateRoomSelectPop.json'
    , ShopLayer_json: 'res/ccs/home/ShopLayer.json'
    , CoinShopLayer_json: 'res/ccs/home/CoinShopLayer.json'
    , ZhanjiHuifang_json: 'res/ccs/history/ZhanjiHuiFang.json'
    , History_json: 'res/ccs/history/History.json'
    , SafeTipLayer_json: 'res/ccs/room/SafeTipLayer.json'
    , DaiKai_json: 'res/ccs/room/DaiKai.json'
    , DaiKaiItem_json: 'res/ccs/room/DaiKaiItem.json'
    , Loading_json: 'res/ccs/common/Loading.json'
    , ShareLayer_json: 'res/ccs/room/ShareLayer.json'
    , ShareTypeLayer_json: 'res/ccs/home/ShareTypeLayer.json'
    , PokerPlayBackLayer_json: 'res/ccs/room/PokerPlayBackLayer.json'
    , ScpdkPlayBackLayer_json: 'res/ccs/room/ScpdkPlayBackLayer.json'
    , PhzRoomQuit_json: 'res/ccs/room/RoomQuit.json'
    , UpdateSubLayer_json: 'res/ccs/common/UpdateSubLayer.json'
    , PopTishiLayer_json: 'res/ccs/common/PopTishi.json'//创建房间的时候的简介提示框
    , TishiLayer_json: 'res/ccs/common/MessageBox.json'//创建房间的时候的简介提示框
    , HistoryDetail_json: 'res/ccs/history/HistoryDetail.json'
    , NiuNiuZhanjiDetailItem_json: 'res/ccs/history/NiuniuZhanjiDetailItem.json'
    , NiuNiuZhanjiDetailCardItem_json: 'res/ccs/history/NiuniuZhanjiDetailCardItem.json'


    , HuifangZhanji_json : "res/ccs/history/JiesuanHuifangLayer.json"
    , HuifangDetailed_json : "res/ccs/history/JiesuanHuifang2Layer.json"
    , HuifangItemNode_json : "res/ccs/history/HuifangItemNode.json"

    , LunBoLayer_json: "res/ccs/home/LunBoLayer.json"
    , ActivityMsgLayer_json: "res/ccs/home/ActivityMsgLayer.json"
    , RedRainLayer_json: "res/ccs/home/RedRainLayer.json"
    , RedRainAwardLayer_json: "res/ccs/home/RedRainAwardLayer.json"

    , LunBoLayer_json: 'res/ccs/home/LunBoLayer.json'
    , ActivityMsgLayer_json: 'res/ccs/home/ActivityMsgLayer.json'
    , RedRainLayer_json: 'res/ccs/home/RedRainLayer.json'
    , RedRainAwardLayer_json: 'res/ccs/home/RedRainAwardLayer.json'
    , GuideDownLayer_json: 'res/ccs/home/GuideDownLayer.json'

    // , JiZanLayer_json: "res/ccs/home/JiZanLayer.json"

    //动画
    , PhzHead_json: 'res/ccs/animation/PhzHead.json'
    , PhzShou_json: 'res/ccs/animation/PhzShou.json'
    , PhzHu_json: 'res/ccs/animation/PhzHu.json'
    , PhzHuAni_json: 'res/ccs/animation/PhzHuAni.json'
    , PhzLoading_json: 'res/ccs/animation/PHZ_loading.json'
    , PhzLoading2_json: 'res/ccs/animation/PHZ_loading2.json'
    , Warning_json: 'res/ccs/room/MJ_baojingdeng.json'
    , boluodai_liuguang_json: 'res/ccs/animation/boluodai_liuguang.json'

    , hand_plist: 'res/anima/hand.plist'//手指动画
    , hand_png: 'res/anima/hand.png'
    , flyIcon_plist: 'res/anima/flyIcon.plist'//金币飞舞动画

    //搓牌动画
    , cuocard_big_png: 'res/image/ui/niuniu/cuocard/cuocard_big.png'
    , cuocard_big_plist: 'res/image/ui/niuniu/cuocard/cuocard_big.plist'

    //大牌和小牌
    , card_common_plist: 'res/image/ui/card_common/card_common.plist'
    , card_common_png: 'res/image/ui/card_common/card_common.png'

    //fnt美术字列表
    , jiafen_fnt: 'res/image/fonts/jiafen.fnt'
    , jiafen_png: 'res/image/fonts/jiafen.png'
    , jianfen_fnt: 'res/image/fonts/jianfen.fnt'
    , jianfen_png: 'res/image/fonts/jianfen.png'

    , score_blue_fnt: 'res/image/fonts/jianfemblue.fnt'
    , score_blue_png: 'res/image/fonts/jianfemblue_0.png'
    , score_yellow_fnt: 'res/image/fonts/jiafemyellow.fnt'
    , score_yellow_png: 'res/image/fonts/jiafemyellow_0.png'

    , jiafenhuang_fnt: 'res/image/fonts/jiafenhuang.fnt'
    , jiafenhuang_png: 'res/image/fonts/jiafenhuang_0.png'
    , koufen_hong_fnt: 'res/image/fonts/koufen-hong.fnt'
    , koufen_hong_png: 'res/image/fonts/koufen-hong_0.png'

    //实名制
    , verify_json: 'res/ccs/verify/verify.json'
    //推荐制
    , BindingAgency_json: 'res/ccs/WxShop/BindingAgencyLayer.json'
    , WxShopLayer_json: 'res/ccs/WxShop/WxShopLayer.json'
    , WxShopItem_json: 'res/ccs/WxShop/WxShopItem.json'
    , WxShopItem_json2: 'res/ccs/WxShop/WxShopItem2.json'
    , BindingTipPop_json: 'res/ccs/WxShop/BindingTipPop.json'
    //结算分享
    , jiesuan_json: 'res/ccs/share/JieSuanShareLayer.json'


    //比赛场
    , JBCMainLayer_json: 'res/ccs/pdk_jbc/JBCMainLayer.json'
    , JBCLevelItem_json: 'res/ccs/pdk_jbc/JBCLevelItem.json'
    
    //俱乐部
    // , ClubMainLayer_json: 'res/ccs/club/ClubMainLayer.json'
    // , ClubTablesLayer_json: 'res/ccs/club/ClubTablesLayer2.json'
    // , ClubInfoItem_json: 'res/ccs/club/ClubInfoLayer.json'
    // , JoinClubLayer_json: 'res/ccs/club/JoinClubLayer.json'
    // , ClubMemberLayer_json: 'res/ccs/club/ClubMemberLayer.json'
    // , ClubSettingLayer_json: 'res/ccs/club/ClubSettingLayer.json'
    // , ClubMemberItem_json: 'res/ccs/club/ClubMemberItem.json'
    // , ClubTableItem_json: 'res/ccs/club/ClubTableItem.json'
    // , ClubTableItem2_json: 'res/ccs/club/ClubTableItem2.json'
    // , ClubTableItem3_json: 'res/ccs/club/ClubTableItem3.json'
    // , ClubTableItem4_json: 'res/ccs/club/ClubTableItem4.json'
    // , ClubMsgLayer_json: 'res/ccs/club/ClubMsgLayer.json'
    // , ClubMsgItem_json: 'res/ccs/club/ClubMsgItem.json'
    // , ClubInviteLayer_json: 'res/ccs/club/ClubInviteLayer.json'
    // , ClubInputLayer_json: 'res/ccs/club/ClubInputLayer.json'
    // , ClubTalbeOperateLayer_json: 'res/ccs/club/ClubTalbeOperateLayer.json'
    // , ClubTableOpeItem_json: 'res/ccs/club/ClubTableOpeItem.json'
    // , ClubNoticeLayer_json: 'res/ccs/club/ClubNoticeLayer.json'
    // , ClubSelectGameLayer_json: 'res/ccs/club/ClubSelectGameLayer.json'
    // , ClubFankuiLayer_json: 'res/ccs/club/ClubFankuiLayer.json'
    // , ClubDayangLayer_json: 'res/ccs/club/ClubDayangLayer.json'
    // , ClubTimeUnit_json: 'res/ccs/club/ClubTimeUnitLayer.json'
    // , ClubShowTimeLayer_json: 'res/ccs/club/ClubShowTimeLayer.json'
    // , ClubTimeHelpLayer_json: 'res/ccs/club/ClubTimeHelpLayer.json'
    // //邀请在线
    // , ClubAssistant_json: 'res/ccs/club/ClubAssistant.json'
    // , ClubAssistant_v_json : 'res/ccs/club/ClubAssistant_v.json'
    // , ClubMemberInviteItem_json: 'res/ccs/club/ClubMemberInviteItem.json'
    // , ClubMemberInviteLayer_json: 'res/ccs/club/ClubMemberInviteLayer.json'


    , NiuniuHistoryCell_json: 'res/ccs/history/NiuniuHistoryCell.json'


    //扑克牌
    // , poker_b_plist: "res/image/ui/niuniu/card/poker.plist"
    // , poker_b_png: "res/image/ui/niuniu/card/poker.png"
    , poker_b_plist: 'res/submodules/niuniu/image/poker.plist'
    , poker_b_png: 'res/submodules/niuniu/image/poker.png'

    //麻将
    // , pai0plist: "res/image/ui/majiang/pai.plist"
    // , pai0_png: "res/image/ui/majiang/pai.png"

    , pai0plist: 'res/submodules/majiang/image/pai.plist'
    , pai0_png: 'res/submodules/majiang/image/pai.png'


    , pai1plist: 'res/image/ui/majiang/pai_y.plist'
    , pai1_png: 'res/image/ui/majiang/pai_y.png'
    , hupaitip_jiao: 'res/image/ui/majiang/maScene/hupaitip_jiao.png'
    , lb_lai: 'res/image/ui/majiang/maScene/lb_lai.png'
    , mjbg: 'res/image/ui/majiang/maScene/mjbg.png'
    , sp_picback: 'res/image/ui/majiang/maScene/sp_picback.png'
    , arrow: 'res/image/ui/majiang/maScene/arrow.png'
    , round_rect_91: 'res/image/ui/majiang/maScene/round_rect_91.png'
    , toast_bg: 'res/image/ui/majiang/maScene/toast_bg.png'
    , hupaitip_hu: 'res/image/ui/majiang/maScene/hupaitip_hu.png'
    , msgbg: 'res/image/ui/majiang/fenxiang/msgbg.png'
    , bu: 'res/image/ui/majiang/maScene/bu.png'


    // , ying_png: "res/image/ui/poker/jiesuan/ying.png"
    // , ping_png: "res/image/ui/poker/jiesuan/ying.png"
    // , shu_png: "res/image/ui/poker/jiesuan/shu.png"
    // , poker_b_pdk_plist: "res/image/ui/zjh/card/poker_b.plist"
    // , poker_b_pdk_png: "res/image/ui/zjh/card/poker_b.png"

    , ying_png: 'res/submodules/pdk/image/PokerZongJiesuan/ying.png'
    , ping_png: 'res/submodules/pdk/image/PokerZongJiesuan/ying.png'
    , shu_png: 'res/submodules/pdk/image/PokerZongJiesuan/shu.png'
    , poker_b_pdk_plist: 'res/appCommon/fydp/common/poker_b.plist'
    , poker_b_pdk_png: 'res/appCommon/fydp/common/poker_b.png'

    , FanDuLayer_json: 'res/ccs/login/FanDuLayer.json'

    //新版牛牛特效
    , DN_niu0_json: 'res/ccs/animation/DN_niu00.json'//无牛
    , DN_niu1_json: 'res/ccs/animation/DN_niu01.json'//
    , DN_niu2_json: 'res/ccs/animation/DN_niu02.json'
    , DN_niu3_json: 'res/ccs/animation/DN_niu03.json'
    , DN_niu4_json: 'res/ccs/animation/DN_niu04.json'
    , DN_niu5_json: 'res/ccs/animation/DN_niu05.json'
    , DN_niu6_json: 'res/ccs/animation/DN_niu06.json'
    , DN_niu7_json: 'res/ccs/animation/DN_niu07.json'
    , DN_niu8_json: 'res/ccs/animation/DN_niu08.json'
    , DN_niu9_json: 'res/ccs/animation/DN_niu09.json'
    , DN_niu10_json: 'res/ccs/animation/DN_niuniu.json'//牛牛
    , DN_niu11_json: 'res/ccs/animation/DN_niu_zhadanniu.json'  //炸弹小妞
    , DN_niu12_json: 'res/ccs/animation/DN_niu_wuhuaniu.json'   //五花牛
    , DN_niu13_json: 'res/ccs/animation/DN_niu_wuxiaoniu.json'   //五小牛
    , DN_niu14_json: 'res/ccs/animation/DN_niu_shunzi.json'   //顺子14
    , DN_niu15_json: 'res/ccs/animation/DN_niu_tonghua.json'   //同花15
    , DN_niu16_json: 'res/ccs/animation/DN_niu_hulu.json'   //葫芦16
    , DN_niu17_json: 'res/ccs/animation/DN_niushixiao.json'   //十小17
    , DN_niu18_json: 'res/ccs/animation/DN_niusishida.json'   //四十大18
    , DN_niu19_json: 'res/ccs/animation/DN_niu_tonghuashun.json'   //同花顺19

    //---------------------------------------------------------------------------end
    // , DN_niu14_json: "res/ccs/animation/DN_niu_jinniu.json"
    // , DN_niu15_json: "res/ccs/animation/DN_niu_yinniu.json"
    //牛牛静态提示图片
    , DN_niu0_png: 'res/image/ui/animation/DN_niu00.png'
    , DN_niu1_png: 'res/image/ui/animation/DN_niu01.png'
    , DN_niu2_png: 'res/image/ui/animation/DN_niu02.png'
    , DN_niu3_png: 'res/image/ui/animation/DN_niu03.png'
    , DN_niu4_png: 'res/image/ui/animation/DN_niu04.png'
    , DN_niu5_png: 'res/image/ui/animation/DN_niu05.png'
    , DN_niu6_png: 'res/image/ui/animation/DN_niu06.png'
    , DN_niu7_png: 'res/image/ui/animation/DN_niu07.png'
    , DN_niu8_png: 'res/image/ui/animation/DN_niu08.png'
    , DN_niu9_png: 'res/image/ui/animation/DN_niu09.png'
    , DN_niu14_png: 'res/image/ui/animation/DN_niu14.png'//顺子14
    , DN_niu15_png: 'res/image/ui/animation/DN_niu15.png'//通话15
    , DN_niu16_png: 'res/image/ui/animation/DN_niu16.png'//葫芦16
    , DN_niu17_png: 'res/image/ui/animation/DN_shixiao.png'//十小17
    , DN_niu18_png: 'res/image/ui/animation/DN_sishida.png'//四十大18
    // , DN_niu19_png: "res/image/ui/animation/DN_tonghuashun.png"//同花顺19

    , DN_finish_png: 'res/image/ui/animation/DN_finish.png'
    , DN_niuniu_png: 'res/image/ui/animation/DN_niuniu01.png'
    , DN_jinniu_png: 'res/image/ui/animation/DN_niu_jinniu.png'
    , DN_wuhuaniu_png: 'res/image/ui/animation/DN_niu_wuhuaniu01.png'
    , DN_wuxiaoniu_png: 'res/image/ui/animation/DN_niu_wuxiaoniu01.png'
    , DN_yinniu_png: 'res/image/ui/animation/DN_niu_yinniu.png'
    , DN_zhadanniu_png: 'res/image/ui/animation/DN_niu_zhadanniu01.png'
    //抢庄特效--有牛头
    , DN_qiangzhuang01_json: 'res/ccs/animation/DN_qiangzhuang01.json'
    , DN_qiangzhuang02_json: 'res/ccs/animation/DN_qiangzhuang02.json'
    , DN_qiangzhuang03_json: 'res/ccs/animation/DN_qiangzhuang03.json'
    //闪光特效
    , DN_qiangzhuang04_json: 'res/ccs/animation/DN_qiangzhuang04.json'
    , DN_qiangzhuang05_json: 'res/ccs/animation/DN_qiangzhuang05.json'
    , DN_qiangzhuang06_json: 'res/ccs/animation/DN_qiangzhuang06.json'
    //倍数
    , DN_niu_cheng2_json: 'res/ccs/animation/DN_niu_cheng2.json'
    , DN_niu_cheng3_json: 'res/ccs/animation/DN_niu_cheng3.json'
    , DN_niu_cheng4_json: 'res/ccs/animation/DN_niu_cheng4.json'
    , DN_niu_cheng5_json: 'res/ccs/animation/DN_niu_cheng5.json'
    , DN_niu_cheng6_json: 'res/ccs/animation/DN_niu_cheng6.json'
    , DN_niu_cheng7_json: 'res/ccs/animation/DN_niu_cheng7.json'
    , DN_niu_cheng8_json: 'res/ccs/animation/DN_niu_cheng8.json'
    , DN_niu_cheng9_json: 'res/ccs/animation/DN_niu_cheng9.json'
    , DN_niu_cheng10_json: 'res/ccs/animation/DN_niu_cheng10.json'
    , DN_niu_cheng15_json: 'res/ccs/animation/DN_niu_cheng15.json'
    , DN_niu_cheng16_json: 'res/ccs/animation/DN_niu_cheng16.json'
    , DN_niu_cheng17_json: 'res/ccs/animation/DN_niu_cheng17.json'
    , DN_niu_cheng18_json: 'res/ccs/animation/DN_niu_cheng18.json'
    , DN_niu_cheng19_json: 'res/ccs/animation/DN_niu_cheng19.json'
    , DN_niu_cheng20_json: 'res/ccs/animation/DN_niu_cheng20.json'
    , DN_niu_cheng25_json: 'res/ccs/animation/DN_niu_cheng25.json'
    //抢庄和头像的特效
    , DN_xiangkuang_guang01_json: 'res/ccs/animation/DN_xiangkuang_guang01.json'
    , DN_xiangkuang_guang02_json: 'res/ccs/animation/DN_xiangkuang_guang02.json'

    , s_bkcoin: 'res/anima/s-bkcoin.plist'
    , s_blcoin: 'res/anima/s-blcoin.plist'
    , s_grcoin: 'res/anima/s-grcoin.plist'
    , s_pkcoin: 'res/anima/s-pkcoin.plist'
    , s_rdcoin: 'res/anima/s-rdcoin.plist'
    , game_coin: 'res/image/ui/niuniu/bg/game_coin.png'

    //表情动画
    , expression1: 'res/ccs/animation/expression01.json'
    , expression2: 'res/ccs/animation/expression02.json'
    , expression3: 'res/ccs/animation/expression03.json'
    , expression4: 'res/ccs/animation/expression04.json'
    , expression5: 'res/ccs/animation/expression05.json'
    , expression6: 'res/ccs/animation/expression06.json'
    , expression7: 'res/ccs/animation/expression07.json'
    , expression8: 'res/ccs/animation/expression08.json'
    , expression9: 'res/ccs/animation/expression09.json'

    //结算界面面板
    , jiesuan_item_red: 'res/appCommon/fydp/common/jiesuan_item2.png'
    , jiesuan_item_blue: 'res/appCommon/fydp/common/jiesuan_item3.png'

    //交互动画资源列表
    , effect_emoji_zan: 'res/anima/effectemoji/zan.plist'
    , effect_emoji_zan_png: 'res/anima/effectemoji/zan.png'
    , effect_emoji_bomb: 'res/anima/effectemoji/bomb.plist'
    , effect_emoji_bomb_png: 'res/anima/effectemoji/bomb.png'
    , effect_emoji_egg: 'res/anima/effectemoji/egg.plist'
    , effect_emoji_egg_png: 'res/anima/effectemoji/egg.png'
    , effect_emoji_shoe: 'res/anima/effectemoji/shoe.plist'
    , effect_emoji_shoe_png: 'res/anima/effectemoji/shoe.png'
    , effect_emoji_flower: 'res/anima/effectemoji/flower.plist'
    , effect_emoji_flower_png: 'res/anima/effectemoji/flower.png'
    , jiatelin_qiang_json: 'res/ccs/animation/jiatelin_qiang.json'
    //火焰特效
    , huoyan_atlas: 'res/image/ui/animation/huoyan.atlas'
    , huoyan_json: 'res/image/ui/animation/huoyan.json'
    //亲友圈中人物
    , qyqrw_atlas: 'res/animation/qyq_jiemian.atlas'
    , qyqrw_json: 'res/animation/qyq_jiemian.json'
    , qyqrw_png: 'res/animation/qyq_jiemian.png'
    //比赛场按钮特效
    , bscbtn_atlas: 'res/animation/quanguobao_bisaichang.atlas'
    , bscbtn_json: 'res/animation/quanguobao_bisaichang.json'
    , bscbtn_png: 'res/animation/quanguobao_bisaichang.png'
    //大厅按钮光圈特效
    , main_btn_light_atlas: 'res/animation/quan.atlas'
    , main_btn_light_json: 'res/animation/quan.json'
    , main_btn_light_png: 'res/animation/quan.png'

    //创建房间中旋转特效
    , croom_atlas: 'res/animation/quanguobao.atlas'
    , croom_json: 'res/animation/quanguobao.json'
    , croom_png: 'res/animation/quanguobao.png'
    //跑得快 资源
    , spring_plist: 'res/image/ui/animation/spring.plist'
    , spring_png: 'res/image/ui/animation/spring.png'
    , bomb_plist: 'res/image/ui/animation/bomb.plist'
    , bomb_png: 'res/image/ui/animation/bomb.png'
    , toast_bg_png: 'res/image/ui/poker/table/toast_bg.png'

    //比赛场
    , spine_huojiang_atlas: 'res/animation/huojiang.atlas'
    , spine_huojiang_json: 'res/animation/huojiang.json'
    , spinie_huojiang_png: 'res/animation/huojiang.png'

    //转转乐
    , zhuanzhuanle_plist: 'res/animation/zhuanzhuan.plist'
    , zhuanzhuanle_png: 'res/animation/zhuanzhuan.png'
    , box_1_2: 'res/animation/box_1_2.json'


    , big_cardback: 'res/image/ui/niuniu/cuocard/big_cardback.png'
    , clubs_5: 'res/image/ui/niuniu/cuocard/clubs_5.png'
    , operate_cuo: 'res/image/ui/niuniu/character/operate_cuo.png'
    , operate_pai: 'res/image/ui/niuniu/character/operate_pai.png'
    , operate_zhong: 'res/image/ui/niuniu/character/operate_zhong.png'

    , createroom_kuang1: 'res/image/ui/hall/createroom_kuang1.png'
    , createroom_kuang2: 'res/image/ui/hall/createroom_kuang2.png'

    // 互动表情
    , expression_animation_1: 'res/ccs/animation/expression/expression10.json'
    , expression_animation_2: 'res/ccs/animation/expression/expression11.json'

    //add playerinfo
    , NewPlayerInfo_json: 'res/ccs/newplayerinfo/NewPlayerInfo.json'
    , BDIphone_json: 'res/ccs/newplayerinfo/BDIphone.json'
    , TiShi_json: 'res/ccs/newplayerinfo/TiShi.json'




    //表情
    , expression1: 'res/prop/expressions/expression01.json'
    , expression2: 'res/prop/expressions/expression02.json'
    , expression3: 'res/prop/expressions/expression03.json'
    , expression4: 'res/prop/expressions/expression04.json'
    , expression5: 'res/prop/expressions/expression05.json'
    , expression6: 'res/prop/expressions/expression06.json'
    , expression7: 'res/prop/expressions/expression07.json'
    , expression8: 'res/prop/expressions/expression08.json'
    , expression9: 'res/prop/expressions/expression09.json'
    , expression10: 'res/prop/expressions/expression10.json'
    , expression11: 'res/prop/expressions/expression11.json'

//道具

//道具

    , effect_emoji_zan_1: 'res/prop/prop/MJ_zan01.json'
    , effect_emoji_zan_2: 'res/prop/prop/MJ_zan02.json'
    , effect_emoji_zan_3: 'res/prop/prop/MJ_zan03.json'


    , effect_emoji_egg_1: 'res/prop/prop/MJ_egg01.json'
    , effect_emoji_egg_2: 'res/prop/prop/MJ_egg02.json'
    , effect_emoji_egg_3: 'res/prop/prop/MJ_egg03.json'


    , effect_emoji_bomb_1: 'res/prop/prop/MJ_bomb01.json'
    , effect_emoji_bomb_2: 'res/prop/prop/MJ_bomb02.json'
    , effect_emoji_bomb_3: 'res/prop/prop/MJ_bomb03.json'


    , effect_emoji_flower_1: 'res/prop/prop/MJ_flower01.json'
    , effect_emoji_flower_2: 'res/prop/prop/MJ_flower02.json'
    , effect_emoji_flower_3: 'res/prop/prop/MJ_flower03.json'


    , effect_emoji_shoe_1: 'res/prop/prop/MJ_shoe01.json'
    , effect_emoji_shoe_2: 'res/prop/prop/MJ_shoe02.json'
    , effect_emoji_shoe_3: 'res/prop/prop/MJ_shoe03.json'

    , jiatelin_qiang_json: 'res/prop/jiatelin/jiatelin_qiang.json'
    , bullet: 'res/prop/jiatelin_zidan.png'
    , daikong: 'res/prop/jiatelin_dankong.png'
    , sp_gongjian_json: 'res/prop/sp/daoju_gongjian/daoju_gongjian.json'
    , sp_gongjian_atlas: 'res/prop/sp/daoju_gongjian/daoju_gongjian.atlas'
    , sp_gongjian_png: 'res/prop/sp/daoju_gongjian/daoju_gongjian.png'

    , sp_zhayao_json: 'res/prop/sp/daoju_zhayao/daoju_zhayao.json'
    , sp_zhayao_atlas: 'res/prop/sp/daoju_zhayao/daoju_zhayao.atlas'
    , sp_zhayao_png: 'res/prop/sp/daoju_zhayao/daoju_zhayao.png'

    , sp_dapao_json: 'res/prop/sp/daoju_dapao/daoju_dapao.json'
    , sp_dapao_atlas: 'res/prop/sp/daoju_dapao/daoju_dapao.atlas'
    , sp_dapao_png: 'res/prop/sp/daoju_dapao/daoju_dapao.png'
    , sp_baodan_image: 'res/prop/sp/daoju_dapao/paodan.png'

    , sp_chuizhuozi_json: 'res/prop/sp/chuizhuozi/daoju_chuizhuozi.json'
    , sp_chuizhuozi_atlas: 'res/prop/sp/chuizhuozi/daoju_chuizhuozi.atlas'
    , sp_chuizhuozi_png: 'res/prop/sp/chuizhuozi/daoju_chuizhuozi.png'

    , sp_bingtong_json: 'res/prop/sp/bingtong/daoju_bingtong.json'
    , sp_bingtong_atlas: 'res/prop/sp/bingtong/daoju_bingtong.atlas'
    , sp_bingtong_png: 'res/prop/sp/bingtong/daoju_bingtong.png'

    , sp_che_json: 'res/prop/sp/che/che.json'
    , sp_che_atlas: 'res/prop/sp/che/che.atlas'
    , sp_che_png: 'res/prop/sp/che/che.png'
    , sp_plane_json: 'res/prop/sp/plane/daoju_plane.json'
    , sp_plane_atlas: 'res/prop/sp/plane/daoju_plane.atlas'
    , sp_plane_png: 'res/prop/sp/plane/daoju_plane.png'

    , sp_ship_json: 'res/prop/sp/ship/daoju_ship.json'
    , sp_ship_atlas: 'res/prop/sp/ship/daoju_ship.atlas'
    , sp_ship_png: 'res/prop/sp/ship/daoju_ship.png'

    , sp_tiaoxing_json: 'res/prop/sp/biaoqing_tiaoxing/biaoqing_tiaoxing.json'
    , sp_tiaoxing_atlas: 'res/prop/sp/biaoqing_tiaoxing/biaoqing_tiaoxing.atlas'
    , sp_tiaoxing_png: 'res/prop/sp/biaoqing_tiaoxing/biaoqing_tiaoxing.png'


//音效
    , vEffect_emoji_bomb: soundDirProp + 'audio_bomb' + soundExt
    , vEffect_emoji_zan: soundDirProp + 'audio_zan' + soundExt
    , vEffect_emoji_flower: soundDirProp + 'audio_flower' + soundExt
    , vEffect_emoji_egg: soundDirProp + 'audio_egg' + soundExt
    , vEffect_emoji_shoe: soundDirProp + 'audio_shoe' + soundExt
    , vEffect_emoji_jiatelin: soundDirProp + 'audio_jiatelin' + soundExt
    , vEffect_emoji_dapao: soundDirProp + 'audio_dapao' + soundExt
    , vEffect_emoji_gongjian: soundDirProp + 'audio_gongjian' + soundExt
    , vEffect_emoji_zhayao: soundDirProp + 'audio_bomb' + soundExt
    , vEffect_emoji_chuizhuozi: soundDirProp + 'audio_chuizhuozi' + soundExt
    , vEffect_emoji_bingtong: soundDirProp + 'audio_bingtong' + soundExt
    , vEffect_emoji_che: soundDirProp + 'audio_che' + soundExt
    , vEffect_emoji_plane: soundDirProp + 'audio_plane' + soundExt
    , vEffect_emoji_ship: soundDirProp + 'audio_ship' + soundExt
    , vEffect_emoji_tiaoxing: soundDirProp + 'audio_tiaoxing' + soundExt


    , PlayerInfoOtherNew_json: 'res/prop/PlayerInfoOther.json'
    , BuyTishi_json: 'res/prop/BuyTishi.json'
};

var soundDir = 'res/music/sound_mp3/';
var soundDirCsh = 'res/music/sound_csh/';
var soundExt = '.mp3';

var res = {
    default_ttf: 'res/image/fonts/FZZY.TTF'
    , Home_json: 'res/ccs/home/Home.json'
    , Login_json: 'res/ccs/login/Login.json'

    //背景音乐列表
    , vbg1: 'res/music/music_temporary/bgm.mp3'
    , vbg2: 'res/music/music_temporary/bgm1.mp3'
    , vbg4: 'res/music/music_temporary/bgm3.mp3'
    , vbg5: 'res/music/music_temporary/bgm4.mp3'
    , vbg6: 'res/music/music_temporary/bgm5.mp3'//扎金花的音乐

    , vbg_ma1: 'res/music/music_temporary/bgm.mp3'
    , vbg_ma2: 'res/music/music_temporary/bgm_ma2.mp3'
    , vbg_ma3: 'res/music/music_temporary/bgm_ma3.mp3'

    , narrow_0: 'res/image/ui/majiang/maScene/narrow0.png'
    , narrow_1: 'res/image/ui/majiang/maScene/narrow1.png'
    , narrow_2: 'res/image/ui/majiang/maScene/narrow2.png'
    , narrow_3: 'res/image/ui/majiang/maScene/narrow3.png'

    //shader处理
    , default_vsh: 'res/shader/default.vsh'
    , default_native_vsh: 'res/shader/default_native.vsh'
    , gray_scale_fsh: 'res/shader/gray_scale.fsh'
    , gray_mask_fsh: 'res/shader/gray_mask.fsh'
    , sepia_fsh: 'res/shader/sepia.fsh'
    , position_texture_color_vsh: 'res/shader/position_texture_color.vsh'
    , position_texture_color_fsh: 'res/shader/position_texture_color.fsh'

    //热更新使用的资源
    , equipupgrade_progress_b_png: 'res/image/ui/login/equipupgrade_progress_b.png'   //ruru
    , equipupgrade_progress_png: 'res/image/ui/login/equipupgrade_progress_.png'  //ruru
    , bg_jpg: 'res/image/ui/login/bg.jpg'  //ruru
    , login_title_png: 'res/image/ui/login/login_title.png'  //ruru

    , wifi_e: 'res/image/ui/room/wifi_e.png'
    , wifi_f: 'res/image/ui/room/wifi_f.png'
    , wifi_h: 'res/image/ui/room/wifi_h.png'
    , battery_h: 'res/image/ui/room/battery_h.png'
    , battery_f: 'res/image/ui/room/battery_f.png'
    , battery_e: 'res/image/ui/room/battery_e.png'

    , setting_bg1: 'res/image/ui/room/setting_bg1.png'
    , setting_bg: 'res/image/ui/room/setting_bg.png'
    , bullet: 'res/image/ui/common/jiatelin_zidan.png'

    , spark: 'res/image/ui/room2/spark.png'
    , gold: 'res/image/other/gold.png'
    , goldmini: 'res/image/other/goldmini.png'
    , fenshu_png: 'res/image/ui/niuniu/bg/fenshu.png'

    , create_btn_0_1: 'res/image/ui/room2/create_btn0_1.png'
    , create_btn_1_1: 'res/image/ui/room2/create_btn1_1.png'
    , create_btn_2_1: 'res/image/ui/room2/create_btn2_1.png'
    , create_btn_3_1: 'res/image/ui/room2/create_btn3_1.png'
    , create_btn_8_1: 'res/image/ui/room2/create_btn8_1.png'
    , create_btn_7_1: 'res/image/ui/room2/create_btn9_1.png'
    , create_btn_9_1: 'res/image/ui/room2/create_btn7_1.png'
    , create_btn_10_1: 'res/image/ui/room2/create_btn10_1.png'
    , create_btn_11_1: 'res/image/ui/room2/create_btn11_1.png'
    , create_btn_12_1: 'res/image/ui/room2/create_btn12_1.png'
    , create_btn_13_1: 'res/image/ui/room2/create_btn13_1.png'
    , create_btn_100_1: 'res/image/ui/room2/create_btn100_1.png'
    , create_btn_15_1: 'res/image/ui/room2/create_btn15_1.png'
    , create_btn_16_1: 'res/image/ui/room2/create_btn16_1.png'
    , create_btn_17_1: 'res/image/ui/room2/create_btn17_1.png'
    , create_btn_18_1: 'res/image/ui/room2/create_btn18_1.png'
    , create_btn_19_1: 'res/image/ui/room2/create_btn19_1.png'
    , create_btn_20_1: 'res/image/ui/room2/create_btn20_1.png'
    , create_btn_21_1: 'res/image/ui/room2/create_btn21_1.png'

    , create_btn_0: 'res/image/ui/room2/create_btn0.png'
    , create_btn_1: 'res/image/ui/room2/create_btn1.png'
    , create_btn_2: 'res/image/ui/room2/create_btn2.png'
    , create_btn_3: 'res/image/ui/room2/create_btn3.png'
    , create_btn_8: 'res/image/ui/room2/create_btn8.png'
    , create_btn_7: 'res/image/ui/room2/create_btn9.png'
    , create_btn_9: 'res/image/ui/room2/create_btn7.png'
    , create_btn_10: 'res/image/ui/room2/create_btn10.png'
    , create_btn_11: 'res/image/ui/room2/create_btn11.png'
    , create_btn_12: 'res/image/ui/room2/create_btn12.png'
    , create_btn_13: 'res/image/ui/room2/create_btn13.png'
    , create_btn_100: 'res/image/ui/room2/create_btn100.png'
    , create_btn_15: 'res/image/ui/room2/create_btn15.png'
    , create_btn_16: 'res/image/ui/room2/create_btn16.png'
    , create_btn_17: 'res/image/ui/room2/create_btn17.png'
    , create_btn_18: 'res/image/ui/room2/create_btn18.png'
    , create_btn_19: 'res/image/ui/room2/create_btn19.png'
    , create_btn_20: 'res/image/ui/room2/create_btn20.png'
    , create_btn_21: 'res/image/ui/room2/create_btn21.png'

    , signal1: 'res/image/ui/room/signal1_1.png'
    , signal2: 'res/image/ui/room/signal1_2.png'
    , signal3: 'res/image/ui/room/signal1_3.png'
    , signal4: 'res/image/ui/room/signal1_4.png'
    , signal5: 'res/image/ui/room/signal1_5.png'

    , battery_1: 'res/image/ui/room/battery1.png'
    , battery_2: 'res/image/ui/room/battery2.png'
    , battery_3: 'res/image/ui/room/battery3.png'
    , battery_4: 'res/image/ui/room/battery4.png'
    , battery_5: 'res/image/ui/room/battery5.png'

    , popup: 'res/image/ui/room2/popup.png'

    , bei_lan: 'res/image/ui/roomclean2/bei_lan.png'
    , lan_mianban: 'res/image/ui/roomclean2/bg_table_lan.png'
    , bei_huang: 'res/image/ui/roomclean2/bei_huang.png'
    , huang_mianban: 'res/image/ui/roomclean2/bg_table_huang.png'

    , icon_win: 'res/image/ui/roomclean2/twin.png'
    , icon_lose: 'res/image/ui/roomclean2/tlose.png'

    , king_pao: 'res/image/ui/roomclean2/lose.png'
    , king_winner: 'res/image/ui/roomclean2/win.png'

    , fangka: 'res/image/ui/common/create_fangka.png'

    //上面放下来的-----------------------------------------------------------------------------------
    , c_hu_png: 'res/image/ui/result/c_hu.png'
    , c_peng_png: 'res/image/ui/result/c_peng.png'
    , c_kan_png: 'res/image/ui/result/c_kan.png'
    , c_wei_png: 'res/image/ui/result/c_wei.png'
    , c_chi_png: 'res/image/ui/result/c_chi.png'
    , c_pao_png: 'res/image/ui/result/c_pao.png'
    , c_ti_png: 'res/image/ui/result/c_ti.png'
    , c_none_png: 'res/image/ui/result/c_none.png'
    , c_jiang_png: 'res/image/ui/result/c_jiang.png'

    , u_chi_png: 'res/image/ui/result/u_chi.png'//"吃""绞""一句话"
    , u_ti_png: 'res/image/ui/result/u_ti.png'//"提"
    , u_pao_png: 'res/image/ui/result/u_pao.png'//"跑"
    , u_sao_png: 'res/image/ui/result/u_sao.png'//"偎""臭偎"
    , u_peng_png: 'res/image/ui/result/u_peng.png'//"碰"
    , u_kan_png: 'res/image/ui/result/u_kan.png'//"坎"

    , mopai_bj_png: 'res/image/ui/card/mopai_bj.png'
    , chupai_bj_png: 'res/image/ui/card/chupai_bj.png'

    , gray_png: 'res/image/ui/card/gray.png'
    , green_png: 'res/image/ui/card/green.png'
    , red_png: 'res/image/ui/card/red.png'

    , transparent_97x99_png: 'res/image/ui/transparent/transparent_97x99.png'


    //从代码里面拿出来的东西
    , room2_btn1: 'res/image/ui/room2/room2_btn1.png'
    , room2_btn2: 'res/image/ui/room2/room2_btn2.png'
    , defaultHead: 'res/image/defaultHead.jpg'
    , twin: 'res/image/ui/history/twin.png'
    , tlose: 'res/image/ui/history/tlose.png'
    , tping: 'res/image/ui/history/tping.png'
    , w_1: 'res/image/ui/niuniu/card/w_1.png'
    , w_2: 'res/image/ui/niuniu/card/w_2.png'
    , notice_wd: 'res/image/ui/hall/notice_wd.png'

    , chouzhuang_png: 'res/image/ui/roomclean/chouzhuang.png'
    , zhongzhuang_png: 'res/image/other/zhongzhuang.png'
    , zhuang1_png: 'res/image/other/zhuang1.png'
    , zhuang2_png: 'res/image/other/zhuang2.png'
    , zhuang3_png: 'res/image/other/zhuang3.png'
    , zhuang4_png: 'res/image/other/zhuang4.png'
    , zhuang5_png: 'res/image/other/zhuang5.png'
    , zhuang6_png: 'res/image/other/zhuang6.png'
    , zhuang7_png: 'res/image/other/zhuang7.png'
    , zhuang8_png: 'res/image/other/zhuang8.png'
    , zhuang9_png: 'res/image/other/zhuang9.png'
    , room_zhuang1_png: 'res/image/other/room_zhuang1.png'
    , room_zhuang2_png: 'res/image/other/room_zhuang2.png'
    , room_zhuang3_png: 'res/image/other/room_zhuang3.png'
    , room_zhuang4_png: 'res/image/other/room_zhuang4.png'
    , room_zhuang5_png: 'res/image/other/room_zhuang5.png'
    , room_zhuang6_png: 'res/image/other/room_zhuang6.png'
    , room_zhuang7_png: 'res/image/other/room_zhuang7.png'
    , room_zhuang8_png: 'res/image/other/room_zhuang8.png'
    , room_zhuang9_png: 'res/image/other/room_zhuang9.png'

    , diaojiaohu_png: 'res/image/ui/result/diaojiaohu.png'//调将胡
    , paohu_png: 'res/image/ui/result/paohu.png'//跑胡
    , pinghu_png: 'res/image/ui/result/pinghu.png'//平胡//吃胡
    , penghu_png: 'res/image/ui/result/penghu.png'//碰胡
    , saohu_png: 'res/image/ui/result/saohu.png'//扫胡,畏
    , tihu_png: 'res/image/ui/result/tihu.png'//提胡
    , img_png: 'res/image/ui/result/tianhu.png'//天胡
    , tianhu_png: 'res/image/ui/result/dihu.png'//地胡

    , xiaoqidui_png: 'res/image/ui/result/xiaoqidui.png'//"7对"
    , wuhulianhu_png: 'res/image/ui/result/wuhulianhu.png'//"五福连胡"
    , shuanglong_png: 'res/image/ui/result/shuanglong.png'//"双龙"
    , pengsandalianhu_png: 'res/image/ui/result/pengsandalianhu.png'//"碰三大连胡"
    , pengsiqinglianhu_png: 'res/image/ui/result/pengsiqinglianhu.png'//"碰四清连胡"
    , pengwuhulianhu_png: 'res/image/ui/result/pengwuhulianhu.png'//"碰五福连胡"
    , saosandalianhu_png: 'res/image/ui/result/saosandalianhu.png'//"扫三大连胡"
    , saosiqinglianhu_png: 'res/image/ui/result/saosiqinglianhu.png'//"扫四清连胡"
    , saowufulianhu_png: 'res/image/ui/result/saowufulianhu.png'//"扫五福连胡"

    , icon_jiafenhuang_png: 'res/image/ui/result/jiafen.png'
    , icon_koufen_hong_png: 'res/image/ui/result/jianfen.png'

    , back_png: 'res/image/ui/card/back.png'  //牌背


    , speaker1_png: 'res/image/ui/niuniu/unit/speaker1.png'
    , speaker2_png: 'res/image/ui/niuniu/unit/speaker2.png'
    , speaker3_png: 'res/image/ui/niuniu/unit/speaker3.png'

    , ltqp0_png: 'res/image/ui/niuniu/unit/ltqp0.png'
    , ltqp1_png: 'res/image/ui/niuniu/unit/ltqp1.png'
    , ltqp2_png: 'res/image/ui/niuniu/unit/ltqp2.png'
    , ltqp3_png: 'res/image/ui/niuniu/unit/ltqp3.png'

    //下注x
    , b_b_png: 'res/image/ui/niuniu/button/b-b.png'
    , b_g_png: 'res/image/ui/niuniu/button/b-g.png'
    , b_p_png: 'res/image/ui/niuniu/button/b-p.png'
    , b_r_png: 'res/image/ui/niuniu/button/b-r.png'
    , b_bk_png: 'res/image/ui/niuniu/button/b-bk.png'

    , history_detailcell1_png: 'res/image/ui/history/history_detailcell1.png'
    , history_detailcell2_png: 'res/image/ui/history/history_detailcell2.png'
    , history_detailclose1_png: 'res/image/ui/history/history_detailclose1.png'
    , history_detailclose2_png: 'res/image/ui/history/history_detailclose2.png'

    , jiaofen_no_png: 'res/image/ui/niuniu/unit/jiaofen_no.png'
    , jiaofen_0_png: 'res/image/ui/niuniu/unit/jiaofen_0.png'
    , jiaofen_1_png: 'res/image/ui/niuniu/unit/jiaofen_1.png'
    , jiaofen_2_png: 'res/image/ui/niuniu/unit/jiaofen_2.png'
    , jiaofen_3_png: 'res/image/ui/niuniu/unit/jiaofen_3.png'
    , jiaofen_4_png: 'res/image/ui/niuniu/unit/jiaofen_4.png'

    , roomjiesan_no_png: 'res/image/ui/room/roomjiesan_no.png'
    , roomjiesan_ok_png: 'res/image/ui/room/roomjiesan_ok.png'
    , roomjiesan_wait_png: 'res/image/ui/room/roomjiesan_wait.png'
    , jiesuan_bg_png: 'res/image/ui/niuniu/bg/jiesuan_bg.png'

    //桌面资源
    , table_niuniu_back0_jpg: 'res/image/ui/niuniu/bg/table_bg.jpg'
    , table_niuniu_back1_jpg: 'res/image/ui/niuniu/bg/table_bg2.jpg'
    , table_niuniu_back2_jpg: 'res/image/ui/niuniu/bg/table_bg3.jpg'
    , table_niuniu_back3_jpg: 'res/image/ui/niuniu/bg/table_bg4.jpg'
    , table_majiang_back0_jpg: 'res/image/ui/majiang/maScene/table_back0.jpg'
    , table_majiang_back1_jpg: 'res/image/ui/majiang/maScene/table_back1.jpg'
    , table_majiang_back2_jpg: 'res/image/ui/majiang/maScene/table_back2.jpg'
    , table_majiang_back3_jpg: 'res/image/ui/majiang/maScene/table_back3.jpg'

    , button_choose_png: 'res/image/ui/common/button_choose.png'
    , button_nochoose_png: 'res/image/ui/common/button_nochoose.png'
    , setting_on_png: 'res/image/ui/common/set_on.png'
    , setting_on2_png: 'res/image/ui/common/set_on2.png'
    , cbn1_png: 'res/image/ui/common/cbn1.png'
    , cbn0_png: 'res/image/ui/common/cbn0.png'
    , shiyong_png: 'res/image/ui/common/shiyong.png'
    , click_to_use_png: 'res/image/ui/common/click_to_use.png'

    , jiesuan_bg_png: 'res/image/ui/niuniu/bg/jiesuan_bg.png'
    //pop
    , pop_pszliuju: 'res/image/ui/hall/pop_pszliuju.png'
    , pop_clubchange: 'res/image/ui/hall/pop_clubchange.png'
    , pop_epzshoufei: 'res/image/ui/hall/pop_epzshoufei.png'
    , pop_scpdk: 'res/image/ui/hall/pop_scpdk.png'
    , pop_srlfshoufei: 'res/image/ui/hall/pop_srlfshoufei.jpg'
    , pop_mianzhufk: 'res/image/ui/hall/pop_mianzhufk.jpg'
    , pop_sss: 'res/image/ui/hall/pop_sss.png'

    , zhuang_png: 'res/image/ui/niuniu/unit/zhuang.png'
    , cuoPai_shadow: 'res/image/ui/niuniu/cuocard/blackLine2.png'
    , niuniu_back_1: 'res/image/ui/niuniu/card/back_1.png'
    , niuniu_paibei_1: 'res/image/ui/niuniu/cuocard/paibei_1.png'

    // , history_cell3: "res/image/ui/history/history_cell3.png"
    , history_cell3: 'res/appCommon/fydp/common/history_cell3.png'
    // , history_tab1: "res/image/ui/history/history_tab1.png"
    // , history_tab1_1: "res/image/ui/history/history_tab1_1.png"
    // , history_tab2: "res/image/ui/history/history_tab2.png"
    // , history_tab2_1: "res/image/ui/history/history_tab2_1.png"
    // , history_tab3: "res/image/ui/history/history_tab3.png"
    // , history_tab3_1: "res/image/ui/history/history_tab3_1.png"
    // , history_tab4: "res/image/ui/history/history_tab4.png"
    // , history_tab4_1: "res/image/ui/history/history_tab4_1.png"
    // , history_tab5: "res/image/ui/history/history_tab5.png"
    // , history_tab5_1: "res/image/ui/history/history_tab5_1.png"
    // , history_tab6: "res/image/ui/history/history_tab6.png"
    // , history_tab6_1: "res/image/ui/history/history_tab6_1.png"
    // , history_tab7: "res/image/ui/history/history_tab7.png"
    // , history_tab7_1: "res/image/ui/history/history_tab7_1.png"
    // , history_tab8: "res/image/ui/history/history_tab8.png"
    // , history_tab8_1: "res/image/ui/history/history_tab8_1.png"
    // , history_tab9: "res/image/ui/history/history_tab9.png"
    // , history_tab9_1: "res/image/ui/history/history_tab9_1.png"

    , vEffect_emoji_bomb: soundDir + 'common/audio_bomb' + soundExt
    , vEffect_emoji_zan: soundDir + 'common/audio_zan' + soundExt
    , vEffect_emoji_flower: soundDir + 'common/audio_flower' + soundExt
    , vEffect_emoji_egg: soundDir + 'common/audio_egg' + soundExt
    , vEffect_emoji_shoe: soundDir + 'common/audio_shoe' + soundExt

    //其他表情特效
    , vEffect_emoji_caishen: soundDir + 'common/caishen' + soundExt
    , vEffect_emoji_dajidali: soundDir + 'common/dajidali' + soundExt
    , vEffect_emoji_dapao: soundDir + 'common/dapao' + soundExt
    , vEffect_emoji_dingshidan: soundDir + 'common/dingshidan' + soundExt
    , vEffect_emoji_maobi: soundDir + 'common/maobi' + soundExt
    , vEffect_emoji_shejian: soundDir + 'common/shejian' + soundExt

    , vchi_1: soundDir + 'man/chi' + soundExt,
    vchi_2: soundDir + 'woman/chi' + soundExt,
    vpeng_1: soundDir + 'man/peng' + soundExt,
    vpeng_2: soundDir + 'woman/peng' + soundExt,
    vgang_1: soundDir + 'man/gang' + soundExt,
    vgang_2: soundDir + 'woman/gang' + soundExt,
    vangang_1: soundDir + 'man/angang' + soundExt,
    vangang_2: soundDir + 'woman/angang' + soundExt,
    vhu_1: soundDir + 'man/hu' + soundExt,
    vhu_2: soundDir + 'woman/hu' + soundExt,
    vhu_dfz_1: soundDir + 'man/hu' + soundExt,
    vhu_dfz_2: soundDir + 'woman/hu' + soundExt,
    vhu_pao_1: soundDir + 'man/hu' + soundExt,
    vhu_pao_2: soundDir + 'woman/hu' + soundExt,
    vhu_qs_1: soundDir + 'man/hu' + soundExt,
    vhu_qs_2: soundDir + 'woman/hu' + soundExt,
    vzimo_1: soundDir + 'man/zimo' + soundExt,
    vzimo_2: soundDir + 'woman/zimo' + soundExt,

    vButtonClick: soundDir + 'common/audio_button_click' + soundExt,
    vCardClick: soundDir + 'common/audio_card_click' + soundExt,
    vCardOut: soundDir + 'common/audio_card_out' + soundExt,
    vDealCard: soundDir + 'common/audio_deal_card' + soundExt,
    vEnter: soundDir + 'common/audio_enter' + soundExt,
    vLeft: soundDir + 'common/audio_left' + soundExt,
    vLiuju: soundDir + 'common/audio_liuju' + soundExt,
    vLose: soundDir + 'common/audio_lose' + soundExt,
    vReady: soundDir + 'common/audio_ready' + soundExt,
    vWin: soundDir + 'common/audio_win' + soundExt,

    vcs_chi_1_0: soundDirCsh + 'man/chi' + soundExt,
    vcs_chi_1_1: soundDirCsh + 'man/chi_1' + soundExt,
    vcs_chi_2_0: soundDirCsh + 'woman/chi' + soundExt,
    vcs_chi_2_1: soundDirCsh + 'woman/chi_1' + soundExt,
    vcs_peng_1_0: soundDirCsh + 'man/peng' + soundExt,
    vcs_peng_1_1: soundDirCsh + 'man/peng_1' + soundExt,
    vcs_peng_2_0: soundDirCsh + 'woman/peng' + soundExt,
    vcs_peng_2_1: soundDirCsh + 'woman/peng_1' + soundExt,
    vcs_gang_1_0: soundDirCsh + 'man/gang' + soundExt,
    vcs_gang_1_1: soundDirCsh + 'man/gang_1' + soundExt,
    vcs_gang_2_0: soundDirCsh + 'woman/gang' + soundExt,
    vcs_gang_2_1: soundDirCsh + 'woman/gang_1' + soundExt,
    vcs_angang_1_0: soundDirCsh + 'man/buzhang' + soundExt,
    vcs_angang_1_1: soundDirCsh + 'man/buzhang_1' + soundExt,
    vcs_angang_2_0: soundDirCsh + 'woman/buzhang' + soundExt,
    vcs_angang_2_1: soundDirCsh + 'woman/buzhang_1' + soundExt,
    vcs_hu_dfz_1_0: soundDirCsh + 'man/hu_dafanzi' + soundExt,
    vcs_hu_dfz_1_1: soundDirCsh + 'man/hu_dafanzi_1' + soundExt,
    vcs_hu_dfz_2_0: soundDirCsh + 'woman/hu_dafanzi' + soundExt,
    vcs_hu_dfz_2_1: soundDirCsh + 'woman/hu_dafanzi_1' + soundExt,
    vcs_hu_pao_1_0: soundDirCsh + 'man/hu_pao' + soundExt,
    vcs_hu_pao_1_1: soundDirCsh + 'man/hu_pao_1' + soundExt,
    vcs_hu_pao_2_0: soundDirCsh + 'woman/hu_pao' + soundExt,
    vcs_hu_pao_2_1: soundDirCsh + 'woman/hu_pao_1' + soundExt,
    vcs_hu_qs_1_0: soundDirCsh + 'man/hu_qishou' + soundExt,
    vcs_hu_qs_1_1: soundDirCsh + 'man/hu_qishou_1' + soundExt,
    vcs_hu_qs_2_0: soundDirCsh + 'woman/hu_qishou' + soundExt,
    vcs_hu_qs_2_1: soundDirCsh + 'woman/hu_qishou_1' + soundExt,
    vcs_zimo_1_0: soundDirCsh + 'man/hu_zimo' + soundExt,
    vcs_zimo_1_1: soundDirCsh + 'man/hu_zimo_1' + soundExt,
    vcs_zimo_2_0: soundDirCsh + 'woman/hu_zimo' + soundExt,
    vcs_zimo_2_1: soundDirCsh + 'woman/hu_zimo_1' + soundExt,
    vcs_saizi_1_0: soundDirCsh + 'man/saizi' + soundExt,
    vcs_saizi_1_1: soundDirCsh + 'man/saizi_1' + soundExt,
    vcs_saizi_2_0: soundDirCsh + 'woman/saizi' + soundExt,
    vcs_saizi_2_1: soundDirCsh + 'woman/saizi_1' + soundExt
};
var HUD_LIST_pro = {
    //com
    common: 100,
    Loading: 103,
    MessageBox: 104,

    //login
    login: 300,
    Login: 302,
    // //home
    home: 500,
    Home: 501,

    //room
    room: 600,
    Settings: 608,
    RoomJoin: 609,
    PlayerBackLayer: 613,
    //录音
    AnimMic: 620,
    ChatNotSendNode: 621,
    ChatErrorNode: 623,

    rule: 700,
    Rule: 701,

    pdk_jbc:800,
    RuleJBC_PDK: 801,

    history: 900,
    History: 901,
    HistoryCell: 902,
    HistoryDetail: 903,
    HistoryDetailCell: 904,
    NiuniuHistoryCell: 905
};

var resMusic = {


    getw: 'res/music/music_temporary/effect/getw.mp3'//小胜利
    , yin_win: 'res/music/music_temporary/effect/yin_win.mp3'//大胜利
    , huangz: 'res/music/music_temporary/effect/huangz.mp3'
    , zimo: 'res/music/music_temporary/effect/zimo.mp3'
    , pth_huangz: 'res/music/music_temporary/effect/pth_huangz.mp3'
    , gan: 'res/music/music_temporary/effect/gan.mp3'
    , takecard: 'res/music/music_temporary/effect/takecard.mp3'//摸
    , runcard: 'res/music/music_temporary/effect/runcard.mp3'//出
    , gold_fly: 'res/music/music_temporary/transferDropGold.mp3'

    //牛牛
    , vcoinsfly: 'res/music/music_temporary/niuniu/common/coins_fly.mp3'
    , dianpai: 'res/music/music_temporary/niuniu/common/dianpai.mp3'
    , vfailure: 'res/music/music_temporary/niuniu/common/Failure.mp3'
    , vvictory: 'res/music/music_temporary/niuniu/common/Victory.mp3'
    , fapai: 'res/music/music_temporary/niuniu/common/fapai.mp3'
    , fanpai: 'res/music/music_temporary/niuniu/common/fanpai.mp3'
    , tishi: 'res/music/music_temporary/niuniu/common/tishi.mp3'
    , liangpai: 'res/music/music_temporary/niuniu/common/liangpai.mp3'
    , niuniuwin: 'res/music/music_temporary/niuniu/common/win.mp3'
    , niuniulose: 'res/music/music_temporary/niuniu/common/lose.mp3'
    , niuniubeishu: 'res/music/music_temporary/niuniu/common/beishu.mp3'
    , dingzhuang: 'res/music/music_temporary/niuniu/common/dingzhuang.mp3'
    , niuniuchoose: 'res/music/music_temporary/niuniu/common/choose.mp3'
    , fire: 'res/music/music_temporary/niuniu/common/fire.mp3'

    //表情音效
    , itr_biaoqing1: 'res/music/music_temporary/biaoqing/itr_dianzan.mp3'
    , itr_biaoqing2: 'res/music/music_temporary/biaoqing/itr_zhadan.mp3'
    , itr_biaoqing3: 'res/music/music_temporary/biaoqing/itr_jidan.mp3'
    , itr_biaoqing4: 'res/music/music_temporary/biaoqing/itr_tuoxie.mp3'
    , itr_biaoqing5: 'res/music/music_temporary/biaoqing/itr_xianhua.mp3'
    , itr_biaoqing6: 'res/music/music_temporary/biaoqing/itr_jiatelin.mp3'

    //设置音效
    , effect_close: 'res/music/music_temporary/common/effect_close.mp3'
    , effect_return: 'res/music/music_temporary/common/effect_return.mp3'
    , effect_tab: 'res/music/music_temporary/common/effect_tab.mp3'


    //扎金花音效
    , vadd_chip_bg: 'res/music/zjh_sound/add_chip.mp3'
    , vcompare_bg: 'res/music/zjh_sound/compare.mp3'
    , vcompare_effect: 'res/music/zjh_sound/compare_effect.mp3'
    , vfollow_chip_bg: 'res/music/zjh_sound/follow_chip.mp3'
    , vgive_up_bg: 'res/music/zjh_sound/give_up.mp3'
    , vlook_card_bg: 'res/music/zjh_sound/look_card.mp3'
    , vfapai_bg: 'res/music/zjh_sound/fapai.mp3'

    , vadd_chip_1: 'res/music/zjh_sound/man_add_chip.mp3'
    , vcompare_1: 'res/music/zjh_sound/man_compare.mp3'
    , vfollow_chip0_1: 'res/music/zjh_sound/man_follow_chip0.mp3'
    , vfollow_chip1_1: 'res/music/zjh_sound/man_follow_chip1.mp3'
    , vfollow_chip2_1: 'res/music/zjh_sound/man_follow_chip2.mp3'
    , vgive_up_1: 'res/music/zjh_sound/man_give_up.mp3'
    , vlook_card_1: 'res/music/zjh_sound/man_look_card.mp3'
    , vyaman_1: 'res/music/zjh_sound/man_yaman.mp3'

    , vadd_chip_2: 'res/music/zjh_sound/woman_add_chip.mp3'
    , vcompare_2: 'res/music/zjh_sound/woman_compare.mp3'
    , vfollow_chip0_2: 'res/music/zjh_sound/woman_follow_chip0.mp3'
    , vfollow_chip1_2: 'res/music/zjh_sound/woman_follow_chip1.mp3'
    , vfollow_chip2_2: 'res/music/zjh_sound/woman_follow_chip2.mp3'
    , vgive_up_2: 'res/music/zjh_sound/woman_give_up.mp3'
    , vlook_card_2: 'res/music/zjh_sound/woman_look_card.mp3'
    , vyaman_2: 'res/music/zjh_sound/woman_yaman.mp3'
};

var cs_res = {
    vchi_1: [res.vcs_chi_1_0, res.vcs_chi_1_1],
    vchi_2: [res.vcs_chi_2_0, res.vcs_chi_2_1],
    vpeng_1: [res.vcs_peng_1_0, res.vcs_peng_1_1],
    vpeng_2: [res.vcs_peng_2_0, res.vcs_peng_2_1],
    vgang_1: [res.vcs_gang_1_0, res.vcs_gang_1_1],
    vgang_2: [res.vcs_gang_2_0, res.vcs_gang_2_1],
    vangang_1: [res.vcs_angang_1_0, res.vcs_angang_1_1],
    vangang_2: [res.vcs_angang_2_0, res.vcs_angang_2_1],
    vhu_dfz_1: [res.vcs_hu_dfz_1_0, res.vcs_hu_dfz_1_1],
    vhu_dfz_2: [res.vcs_hu_dfz_2_0, res.vcs_hu_dfz_2_1],
    vhu_pao_1: [res.vcs_hu_pao_1_0, res.vcs_hu_pao_1_1],
    vhu_pao_2: [res.vcs_hu_pao_2_0, res.vcs_hu_pao_2_1],
    vhu_fqs_1: res.vcs_hu_pao_1_0,
    vhu_fqs_2: res.vcs_hu_pao_2_0,
    vhu_qs_1: [res.vcs_hu_qs_1_0, res.vcs_hu_qs_1_1],
    vhu_qs_2: [res.vcs_hu_qs_2_0, res.vcs_hu_qs_2_1],
    vzimo_1: [res.vcs_zimo_1_0, res.vcs_zimo_1_1],
    vzimo_2: [res.vcs_zimo_2_0, res.vcs_zimo_2_1],
    vsaizi_1: [res.vcs_saizi_1_0, res.vcs_saizi_1_1],
    vsaizi_2: [res.vcs_saizi_2_0, res.vcs_saizi_2_1]
};

function addMusicRes() {
    for (var i = 1; i <= 17; i++) {
        resMusic['vv' + i + '_1'] = 'res/music/music_temporary/common/man/v' + i + '.mp3';
        resMusic['vv' + i + '_2'] = 'res/music/music_temporary/common/woman/v' + i + '.mp3';
    }
    //碰胡子聊天音效
    for (var i = 1; i <= 9; i++) {
        resMusic['vv2_' + i + '_1'] = 'res/music/music_temporary/common/man/v2_' + i + '.mp3';
        resMusic['vv2_' + i + '_2'] = 'res/music/music_temporary/common/woman/v2_' + i + '.mp3';
    }
    resMusic['vv2_10_1'] = 'res/music/music_temporary/common/man/v16.mp3';
    resMusic['vv2_11_1'] = 'res/music/music_temporary/common/man/v17.mp3';
    resMusic['vv2_10_2'] = 'res/music/music_temporary/common/woman/v16.mp3';
    resMusic['vv2_11_2'] = 'res/music/music_temporary/common/woman/v17.mp3';

    for (var i = 0; i < sexEffects.length; i++) {
        resMusic['n' + sexEffects[i]] = 'res/music/music_temporary/niuniu/man/' + sexEffects[i] + '.mp3';
        resMusic['v' + sexEffects[i]] = 'res/music/music_temporary/niuniu/woman/' + sexEffects[i] + '.mp3';
    }
    for (var i = 0; i < sexEffectsPoker.length; i++) {
        // console.log(sexEffectsPoker[i]);
        resMusic['v' + sexEffectsPoker[i] + '_1'] = 'res/music/pdk_sound/man/' + sexEffectsPoker[i] + '.mp3';
        resMusic['v' + sexEffectsPoker[i] + '_2'] = 'res/music/pdk_sound/woman/' + sexEffectsPoker[i] + '.mp3';
    }
    //麻将
    for (var i = 1; i <= 34; i++) {
        resMusic['vp' + i + '_1'] = soundDir + 'man/' + i + soundExt;
        resMusic['vp' + i + '_2'] = soundDir + 'woman/' + i + soundExt;
    }

    var hassp = [10, 19, 27];


    for (var i = 1; i <= 27; i++) {
        resMusic['vcsp' + i + '_1'] = soundDirCsh + 'man/' + i + soundExt;
        resMusic['vcsp' + i + '_2'] = soundDirCsh + 'woman/' + i + soundExt;

        for (var j in hassp) {
            if (hassp.hasOwnProperty(j) && i == hassp[j]) {
                resMusic['vcsp' + i + '_1_1'] = soundDirCsh + 'man/' + i + '_1' + soundExt;
                resMusic['vcsp' + i + '_2_1'] = soundDirCsh + 'woman/' + i + '_1' + soundExt;
            }
        }
    }

    for (var i = 1; i <= 9; i++) {
        resMusic['vv_ma' + i + '_1'] = soundDir + 'man/v' + i + soundExt;
        resMusic['vv_ma' + i + '_2'] = soundDir + 'woman/v' + i + soundExt;
    }
    resMusic['vv_ma10_1'] = 'res/music/music_temporary/common/man/v16.mp3';
    resMusic['vv_ma11_1'] = 'res/music/music_temporary/common/man/v17.mp3';
    resMusic['vv_ma10_2'] = 'res/music/music_temporary/common/woman/v16.mp3';
    resMusic['vv_ma11_2'] = 'res/music/music_temporary/common/woman/v17.mp3';


    for (var i = 1; i <= 6; i++) {
        for (var j = 0; j < 4; j++) {
            resMusic['vcsv' + i + '_' + j + '_1'] = soundDirCsh + 'man/' + 'v' + i + '_' + j + soundExt;
            resMusic['vcsv' + i + '_' + j + '_2'] = soundDirCsh + 'woman/' + 'v' + i + '_' + j + soundExt;
        }
    }

    for (var i = 1; i <= 34; i++) {
        var found = false;
        for (var j in hassp) {
            if (hassp.hasOwnProperty(j) && i == hassp[j]) {
                found = true;
                break;
            }
        }
        if (!found) {
            cs_res['vp' + i + '_1'] = resMusic['vcsp' + i + '_1'];
            cs_res['vp' + i + '_2'] = resMusic['vcsp' + i + '_2'];
        } else {
            cs_res['vp' + i + '_1'] = [resMusic['vcsp' + i + '_1'], resMusic['vcsp' + i + '_1_1']];
            cs_res['vp' + i + '_2'] = [resMusic['vcsp' + i + '_2'], resMusic['vcsp' + i + '_2_1']];
        }
    }

    for (var i in resMusic) {
        g_resourcesMusic.push(resMusic[i]);
        res[i] = resMusic[i];
    }
}

//界面对象的创建
var HUD_LIST = {};

function addViewRes() {
    var rootDir = '';
    for (var obj in HUD_LIST_pro) {
        var id = HUD_LIST_pro[obj];

        if (id % 100 == 0 || id >= 9999) {
            rootDir = obj;
            continue;
        }

        if (!cc.sys.isNative) g_resources.push('res/ccs/' + rootDir + '/' + obj + '.json');
        var newObj = {};
        newObj.id = id;
        newObj.cls = window[obj];
        newObj.ccs = rootDir + '/' + obj;
        HUD_LIST[obj] = newObj;


    }

    // console.log(HUD_LIST);
    for (var i = 0; i < skeletons.length; i++) {
        res['sp_' + skeletons[i] + '_json'] = 'res/image/ui/skeletons/' + skeletons[i] + '/' + skeletons[i] + '.json';
        res['sp_' + skeletons[i] + '_atlas'] = 'res/image/ui/skeletons/' + skeletons[i] + '/' + skeletons[i] + '.atlas';
        res['sp_' + skeletons[i] + '_png'] = 'res/image/ui/skeletons/' + skeletons[i] + '/' + skeletons[i] + '.png';
        if (skeletons[i] == 'feijizhadan') {
            res['sp_' + skeletons[i] + '2_png'] = 'res/image/ui/skeletons/' + skeletons[i] + '/' + skeletons[i] + '2.png';
        }
    }
    // 新表情骨骼动画
    for (var i = 0; i < effectSkeletons.length; i++) {
        res['sp_' + effectSkeletons[i] + '_json'] = 'res/image/ui/skeletons/biaoqingdonghua/' + effectSkeletons[i] + '.json';
        res['sp_' + effectSkeletons[i] + '_atlas'] = 'res/image/ui/skeletons/biaoqingdonghua/' + effectSkeletons[i] + '.atlas';
        res['sp_' + effectSkeletons[i] + '_png'] = 'res/image/ui/skeletons/biaoqingdonghua/' + effectSkeletons[i] + '.png';
    }
    for (var i in res) {
        if (!cc.sys.isNative) g_resources.push(res[i]);
    }

    for (var i in resJson) {
        if (!cc.sys.isNative) g_resources.push(resJson[i]);
        res[i] = resJson[i];
    }

    if (!cc.sys.isNative) {
        for (var i = 1; i <= 13; i++) {
            g_resources.push('res/image/ui/niuniu/cuocard/clubs_' + i + '.png');
            g_resources.push('res/image/ui/niuniu/cuocard/hearts_' + i + '.png');
            g_resources.push('res/image/ui/niuniu/cuocard/diamonds_' + i + '.png');
            g_resources.push('res/image/ui/niuniu/cuocard/spades_' + i + '.png');
        }
        g_resources.push('res/image/ui/niuniu/cuocard/guanggao.png');
    }
}

