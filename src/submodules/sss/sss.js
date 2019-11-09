/**
 * Created by hjx on 2018/9/17.
 */
var sss_src = [
    'src/submodules/sss/sssRule.js',
    'src/submodules/sss/DealCardsLayer.js',
    'src/submodules/sss/PokerLayer_sss.js',
    'src/submodules/sss/SelfSortCardsLayer.js',
    'src/submodules/sss/ChooseColorLayer.js',
    'src/submodules/sss/QiangzhuangLayer.js',
    'src/submodules/sss/ZongJiesuanLayerSSS.js',
    'src/submodules/sss/sssReplayLayer.js',
    'src/submodules/sss/WanfaInfoLayer_sss.js'
];

var sss_res = {
    Player6_sss_json: 'res/submodules/sss/ccs/Players6Layer.json',
    PlayScene_sss_json: 'res/submodules/sss/ccs/PkScene_sss.json',

    ShowIdxPaisAnim_json: "res/submodules/sss/ccs/ShowIdxAnim.json",
    CardsShowNode_json: 'res/submodules/sss/ccs/CardsShowNode.json',
    ColorSetLayer_json: "res/submodules/sss/ccs/ColorSetLayer.json",
    DealCardsLayer_json: "res/submodules/sss/ccs/DealCardsLayer.json",
    SelfSortCardsLayer_json: "res/submodules/sss/ccs/SelfSortCardsLayer.json",
    ChooseTypeItem_json: "res/submodules/sss/ccs/ChooseTypeItem.json",
    Qiangzhuang13shui_json: "res/submodules/sss/ccs/QiangzhuangLayer.json",
    ZongJiesuanLayerSSS_json: "res/submodules/sss/ccs/ZongJiesuan_sss.json",
    SSSReplayLayer_json: "res/submodules/sss/ccs/SSSReplayLayer.json",
    SSSWanfaLayer_json: "res/submodules/sss/ccs/WanfaInfoLayer.json",

    Player6_sss_v_json: 'res/submodules/sss/ccs2/Players6Layer_v.json',
    PlayScene_sss_v_json: 'res/submodules/sss/ccs2/PkScene_sss_v.json',
    DealCardsLayer_v_json: "res/submodules/sss/ccs2/DealCardsLayer_v.json",
    SelfSortCardsLayer_v_json: "res/submodules/sss/ccs2/SelfSortCardsLayer_v.json",
    ChooseTypeItem_v_json: "res/submodules/sss/ccs2/ChooseTypeItem_v.json",
    ZongJiesuanLayerSSS_v_json: 'res/submodules/sss/ccs2/ZongJiesuan_sss_v.json',
    Qiangzhuang13shui_v_json: "res/submodules/sss/ccs2/QiangzhuangLayer_v.json",


    sp_sss_effect_atlas: "res/submodules/sss/spine/shisanshui_tx/shisanshui_tx.atlas"
    , sp_sss_effect_json: "res/submodules/sss/spine/shisanshui_tx/shisanshui_tx.json"
    , sp_sss_effect1_png: "res/submodules/sss/spine/shisanshui_tx/shisanshui_tx.png"
    , sp_sss_effect2_png: "res/submodules/sss/spine/shisanshui_tx/shisanshui_tx2.png"
    , sp_sss_xipai_atlas: "res/submodules/sss/spine/xipai/xipai.atlas"
    , sp_sss_xipai_json: "res/submodules/sss/spine/xipai/xipai.json"
    , sp_sss_xipai_png: "res/submodules/sss/spine/xipai/xipai.png"
    , sss_poker: 'res/submodules/sss/plist/poker_epz.plist'
    // , sss_type: 'res/submodules/sss/plist/game_txt.plist'
    , vbullet: 'res/submodules/sss/sound/bullet.mp3'
    , vdianpai: 'res/submodules/sss/sound/dianpai.mp3'
    , vfapai: 'res/submodules/sss/sound/fapai.mp3'
    , vsssliangpai: 'res/submodules/sss/sound/liangpai.mp3'
    , vssswin: 'res/submodules/sss/sound/win.mp3'
    , vssslose: 'res/submodules/sss/sound/lose.mp3'

};

var sss_create_room_tabData = {
    btn_23: {"click": [], "show": [], "hide": []}

};

var sss_create_room_wanFaData = [
    ['mapid', [
        ['', MAP_ID.PK_13S, -1000, -1000, true, true, false],
    ]],
    ['AA', [
        ['房主支付', false, 480, 580, true, true, false, null, ['mapid_0']],
        ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0']]
    ]],
    ['rounds', [
        ['5局', 5, 480, 530, false, true, false, null, ['mapid_0']],
        ['10局', 10, 720, 530, true, true, false, null, ['mapid_0']],
        ['20局', 20, 960, 530, false, true, false, null, ['mapid_0']]
    ]],
    ['maxPlayerCnt', [
        ['4人', 4, 480, 470.00, false, true, false, null, ['mapid_0']],
        ['5人', 5, 606, 470.00, true, true, false, null, ['mapid_0']],
        ['6人', 6, 732, 470.00, false, true, false, null, ['mapid_0']],
        ['7人', 7, 858, 470.00, false, true, false, null, ['mapid_0']],
        // ['8人', 8, 904, 470.00, false, true, false, null, ['mapid_0']],
        ['9人', 9, 1000, 470.00, false, true, false, null, ['mapid_0']]
    ]],
    // ['debug', [
    //     ['测试', true, 1100, 360, false, false, false, null, ['mapid_0']]
    // ]],
    ['gametype', [
        ['普通', 0, 480, 415, true, true, false, null, ['mapid_0']],
        ['抢庄', 1, 720, 415, false, true, false, null, ['mapid_0']],
        ['看牌下注', 2, 960, 415, false, true, false, null, ['mapid_0']]
    ]],
    ['crazy', [
        ['疯狂场', true, 480, 360, false, false, false, null, ['mapid_0']]
    ]],
    //ma_pai zheng_se fuse1 fuse2

    ['zhengse', [
        ['无', 0, 480, -165, true, true, false, null, ['mapid_0']],
        ['黑桃', 4, 576, -165, false, true, false, null, ['mapid_0']],
        ['红桃', 3, 672, -165, false, true, false, null, ['mapid_0']],
        ['梅花', 2, 780, -165, false, true, false, null, ['mapid_0']],
        ['方块', 1, 960, -165, false, true, false, null, ['mapid_0']],
    ]],
    ['fuse1', [
        ['无', 0, 480, -135, true, true, false, null, ['mapid_0']],
        ['黑桃', 4, 576, -135, false, true, false, null, ['mapid_0']],
        ['红桃', 3, 672, -135, false, true, false, null, ['mapid_0']],
        ['梅花', 2, 780, -135, false, true, false, null, ['mapid_0']],
        ['方块', 1, 960, -135, false, true, false, null, ['mapid_0']],
    ]],
    ['fuse2', [
        ['无', 0, 480, -90, true, true, false, null, ['mapid_0']],
        ['黑桃', 4, 576, -90, false, true, false, null, ['mapid_0']],
        ['红桃', 3, 672, -90, false, true, false, null, ['mapid_0']],
        ['梅花', 2, 780, -90, false, true, false, null, ['mapid_0']],
        ['方块', 1, 960, -90, false, true, false, null, ['mapid_0']],
    ]],
    //firstTonghuashun
    ['firsttonghuashun', [
        ['同花顺>铁枝', true, 2480, 240, false, true, false, null, ['mapid_0']],
        ['铁枝>同花顺', false, 2580, 240, true, true, false, null, ['mapid_0']],
    ]],
    //zhongtujiaru
    ['zhongtujiaru', [
        ['中途加入', true, 480, 245, false, false, false, null, ['mapid_0']]
    ]],
    ['chaoshichupai_popup', [
        ['不超时出牌', 0, 720, 305, true, true, false, null, ['mapid_0']],
        ['60秒', 60, 720, 305, false, true, false, null, ['mapid_0']],
        ['90秒', 90, 720, 305, false, true, false, null, ['mapid_0']],
        ['120秒', 120, 720, 305, false, true, false, null, ['mapid_0']]
    ]],//
    ['guipai_popup', [
        ['无鬼牌', 0, 480, 305, true, true, false, null, ['mapid_0']],
        ['2张鬼牌', 2, 480, 305, false, true, false, null, ['mapid_0']],
        ['3张鬼牌', 3, 480, 305, false, true, false, null, ['mapid_0']],
        ['4张鬼牌', 4, 480, 305, false, true, false, null, ['mapid_0']]
    ]],//beilv
    ['beilv', [
        ['2倍', 2, 700, 90, false, true, false, null, ['mapid_0']],
        ['3倍', 3, 480, 90, true, true, false, null, ['mapid_0']],
        ['4倍', 4, 700, 90, false, true, false, null, ['mapid_0']],
        ['5倍', 5, 920, 90, false, true, false, null, ['mapid_0']]
    ]],
    ['yanse', [
        ['4色', 4, 480, 195, true, true, false, null, ['mapid_0']],
        ['3色', 3, 650, 195, false, true, false, null, ['mapid_0']],
        ['2色', 2, 820, 195, false, true, false, null, ['mapid_0']],
        ['1色', 1, 990, 195, false, true, false, null, ['mapid_0']],
    ]],
    ['mapai', [
        ['马牌', 0, 720, 360, false, false, false, null, ['mapid_0']],
    ]],
    // ['autoReady', [
    //     ['', 1, 1480, 230, true, true, false, null, ['mapid_0','mapid_1']]//0 不自动准备  1 自动准备自动开始    2自动准备后  房主点开始
    // ]],
];
window.MAPAI_13SHUI_IDX = -1;
(function () {
    for (var i = 0; i < sss_create_room_wanFaData.length; i++) {
        if (sss_create_room_wanFaData[i][0] == 'mapai') {
            console.log('mapai =========== ' + i);
            window.MAPAI_13SHUI_IDX = i;
            break;
        }
    }
})();
var sssSoundDir = 'res/submodules/sss/sound/';
var sss_sound_sex = {};

(function () {
    for (var i = 1; i <= 10; i++) {
        sss_sound_sex['normal_type_' + i] = 'normal_type_' + i + ".mp3";
        if (i == 4 || i == 7) {
            sss_sound_sex['normal_type_' + i + "_2"] = 'normal_type_' + i + "_2" + ".mp3";
        }
    }
    sss_sound_sex['times' + 0] = 'times' + 0 + '.mp3';
    for (var i = 1; i <= 5; i++) {
        sss_sound_sex['special_type_' + i] = 'special_type_' + i + ".mp3";
        sss_sound_sex['times' + i] = 'times' + i + '.mp3';
    }
    sss_sound_sex['quanleida'] = 'quanleida.mp3';
    sss_sound_sex['shoot'] = 'shoot.mp3';

    var array = _.keys(sss_sound_sex);
    for (var i = 0; i < array.length; i++) {
        var name = sss_sound_sex[array[i]];
        var path1 = sssSoundDir + 'man/' + name;
        var path2 = sssSoundDir + 'woman/' + name;
        sss_res['v' + array[i] + "_1"] = path1;
        sss_res['v' + array[i] + "_2"] = path2;
    }
    // console.log(sss_res);
    //send : 'sendcard.mp3'
})();


var sss_fangka = {
    btn_23: [[3, 4, 4], [1, 1, 1]]
};
var sss_players_fangka = [[3, 4, 4], [3, 4, 5], [4, 5, 6], [4, 6, 7], [5, 7, 8]];

