/**
 * Created by hjx on 2018/4/16.
 */
//     四川长牌（考考）配置     //
var cp_png_res1_path = 'SCCP/Resources/GameResources/GameUI/';

var kaokaoSoundDir = 'res/submodules/kaokao/sound/';


var kaokao_src = [
    'src/submodules/kaokao/kaokaoRule.js',
    'src/submodules/kaokao/KaoKaoLayer.js',
    'src/submodules/kaokao/ChiLayer.js',
    'src/submodules/kaokao/TouLayer.js',
    'src/submodules/kaokao/KKJiesuanLayer.js',
    'src/submodules/kaokao/KKZongJiesuanLayer.js',
    'src/submodules/kaokao/ReplayLayer.js',
];

var kaokao_res = {
    KaoKaoLayer_json: 'res/submodules/kaokao/ccs/KaoKaoLayer.json',
    ThreePlayersLayer_json: 'res/submodules/kaokao/ccs/ThreePlayersLayer.json',
    FourPlayersLayer_json: 'res/submodules/kaokao/ccs/FourPlayersLayer.json',
    ChiLayer_json: "res/submodules/kaokao/ccs/ChiLayer.json",
    TouLayer_json: "res/submodules/kaokao/ccs/TouLayer.json",
    KKJiesuanLayer_json: "res/submodules/kaokao/ccs/KKJiesuanLayer.json",
    KKZongJiesuanLayer_json: "res/submodules/kaokao/ccs/KKZongJiesuan.json",
    KKReplayLayer_json: "res/submodules/kaokao/ccs/KKReplayLayer.json",

    cp_cards: 'res/submodules/kaokao/image/common/cards.plist',
    cp_res1: 'res/submodules/kaokao/image/SCCPGameRes.plist',
    // cp_res2: 'res/submodules/kaokao/image/SCCPGameRes1.plist',

    anim_piao: 'res/submodules/kaokao/ccs/animPiao.json',
    anim_peng: 'res/submodules/kaokao/ccs/animPeng.json',
    anim_chi: 'res/submodules/kaokao/ccs/animChi.json',
    anim_an: 'res/submodules/kaokao/ccs/animAn.json',
    anim_hu: 'res/submodules/kaokao/ccs/animHu.json',
    anim_chu: 'res/submodules/kaokao/ccs/animChu.json',
    anim_tou: 'res/submodules/kaokao/ccs/animTou.json',

    vbg: 'res/submodules/kaokao/sound/music_game.mp3',
    vsendCard: 'res/submodules/kaokao/sound/sendcard.mp3'
};
var kaokao_sound_sex = {
    card1: "tingyong.mp3",
    card2: "caishen.mp3",
    card1112: "card_20.mp3",
    card1102: "card_0.mp3",
    card1103: "card_1.mp3",
    card2104: "card_3.mp3",
    card1104: "card_2.mp3",
    card2205: "card_5.mp3",
    card1105: "card_4.mp3",
    card2306: "card_8.mp3",
    card1106: "card_7.mp3",
    card1206: "card_6.mp3",
    card2307: "card_10.mp3",
    card1107: "card_9.mp3",
    card1207: "card_11.mp3",
    card2208: "card_13.mp3",
    card2308: "card_12.mp3",
    card1108: "card_14.mp3",
    card2209: "card_15.mp3",
    card1109: "card_16.mp3",
    card2210: "card_18.mp3",
    card1110: "card_17.mp3",
    card2111: "card_19.mp3",

    chi: "chi.mp3",
    peng: "che.mp3",
    hu: 'hu.mp3',
    piao: "piao.mp3",
    // dang : '',
    // bupao : "",
    guo: "guo.mp3",
    tou1: "tou.mp3",
    tou2: "zaitou.mp3",

};
(function () {
    var array = _.keys(kaokao_sound_sex);
    for (var i = 0; i < array.length; i++) {
        var name = kaokao_sound_sex[array[i]];
        var path1 = kaokaoSoundDir + 'man/' + name;
        var path2 = kaokaoSoundDir + 'woman/' + name;
        kaokao_res['v' + array[i] + "_1"] = path1;
        kaokao_res['v' + array[i] + "_2"] = path2;
    }
    res.vbgKK = kaokao_res.vbg;

    //send : 'sendcard.mp3'
})();


var kaokao_create_room_tabData = {
    btn_19: {
        click: ['mapid_0'],
        show: [],
        hide: ['word_xzxd', 'word_xzfx', 'wanfa_small_bg']
    },
    btn_20:{"click":["mapid_1"],"show":['word_xzxd', 'word_xzfx', 'wanfa_small_bg'],"hide":[]}

};
/**
 * 下面的可以任意选
 {
 dinghu			//丁虎    0 不加 1 加番
 qiahu			//恰胡    0 不加 1 加番 点数和胡的点数恰好相等
 dahu			//大胡 0 不加 1 加番
 jgd  			//金钩钓 0 不加 1 加番
 zimo			//自摸是否加番 0 不加 1 加番
 gsh      		//杠上花是否加番 0 不加 1 加番
 pinghu			//平胡 0 不加 1 加番
 quanhong		//全红加番 0 不加 1 加番
 cjdahu  		//超级大胡 0 不加 1 加番
 haidi       	//海底捞 0 不加 1 加番
 }


 （二选一）
 {
     count   		//人数  3或4（二选一）
     ssz				// 剩三张   0胡到底 1 剩三张
     wuhei			// 0五红五黑 1五红六黑(三人玩法无，只限四人玩法)
     dang			//当类型   1 头当  2 推当
     piao			//飘类型 0 不飘  1 活飘  2 死飘
 }

 * @type {[*]}
 */
var kaokao_create_room_wanFaData = [
    ['mapid', [
        ['', MAP_ID.CP_KAOKAO, -1000, -1000, true, true, false],//绵竹考考 340
        ['', MAP_ID.CP_SICHUAN, -1000, -1000, true, true, false],//四川考考 341
    ]],
    ['AA', [
        ['房主支付', false, 480, 580, true, true, false, null, ['mapid_0','mapid_1']],
        ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0','mapid_1']]
    ]],
    ['jushu', [
        ['6局', 6, 480, 530, false, true, false, null, ['mapid_0','mapid_1']],
        ['8局', 8, 720, 530, true, true, false, null, ['mapid_0','mapid_1']],
        ['10局', 10, 960, 530, false, true, false, null, ['mapid_0','mapid_1']]
    ]],
    ['cpCount', [
        ['3人', 3, 480, 480, true, true, false, null, ['mapid_0','mapid_1']],
        //['4人(小家)', 4, 720, 480, false, true, false, null, ['mapid_0','mapid_1']]
    ]],
    ['cpPiao', [
        ['不飘', 0, 960, 330, true, true, false, null, ['mapid_0','mapid_1']],
        ['活飘', 1, 480, 330, false, true, false, null, ['mapid_0','mapid_1']],
        ['定飘', 2, 720, 330, false, true, false, null, ['mapid_0','mapid_1']],
    ]],
    ['cpTingyong', [
        ['4个听用', 1, 480, 430, false, false, false, null, ['mapid_0','mapid_1']],
    ]],
    ['cpCaishen', [
        ['4个财神', 1, 720, 430, false, false, false, null, ['mapid_0','mapid_1']],
    ]],
    ['cpFanType', [
        ['梯番', 0, 480, 380, true, true, false, null, ['mapid_1']],
        ['滚番', 1, 720, 380, false, true, false, null, ['mapid_1']],
    ]],
    ['cpFengding', [
        ['不封顶', 0, 960, 380.00, true, true, false, null, ['mapid_0']],
        ['7番', 7, 480, 380.00, false, true, false, null, ['mapid_0']],
        ['9番', 9, 720, 380.00, false, true, false, null, ['mapid_0']],

        ['3番', 3, 900, 380, false, true, false, null, ['mapid_1']],
        ['4番', 4, 1020, 380, true, true, false, null, ['mapid_1']],
        ['5番', 5, 1140, 380, false, true, false, null, ['mapid_1']],

        ['不封顶', 0, 1100, 380.00, false, true, false, null, ['mapid_1']],
        ['7番', 7, 900, 380.00, true, true, false, null, ['mapid_1']],
        ['9番', 9, 1000, 380.00, false, true, false, null, ['mapid_1']],
    ]],
    ['pengfan', [
        ['七门红', 2, 720, 230, false, true, false, null, ['mapid_1']],
        ['五门红', 1, 480, 230, true, true, false, null, ['mapid_1']],
    ]],
    ['cpZimo', [
        ['自摸加番', 1, 480, 180, true, false, false, null, ['mapid_0','mapid_1']],
    ]],
    ['cpGsh', [
        ['杠上花加番', 1, 656, 180, true, false, false, null, ['mapid_0','mapid_1']],
    ]],
    ['cpQiahu', [
        ['恰胡加番', 1, 866, 280, false, false, false, null, ['mapid_0','mapid_1']],
    ]],
    // ['cpWuhei', [
    //     ['五红五黑', 1, 480, 230, true, true, false, null, ['mapid_0']],
    //     ['五红六黑', 2, 720, 230, false, true, false, null, ['mapid_0']],
    // ]],
    ['cpWanfa', [
        ['', 'mianzhu', -1000, 230, true, false, false, null, ['mapid_0']],//绵竹玩法
        ['', 'sichuan', -1000, 230, true, false, false, null, ['mapid_1']]//四川玩法
    ]],
    ['autoReady', [
        ['', 1, 1480, 230, true, true, false, null, ['mapid_0','mapid_1']]//0 不自动准备  1 自动准备自动开始    2自动准备后  房主点开始
    ]],


    // ['cpSsz', [
    //     ['胡到底', 0, 480, 230.00, true, true, false, null, ['mapid_0']],
    //     ['剩三张', 1, 720, 230.00, false, true, false, null, ['mapid_0']]
    // ]],
    //
    ['cpDang', [
        ['头当', 1, 480, 280, true, true, false, null, ['mapid_1']],
        ['推当', 2, 720, 280, false, true, false, null, ['mapid_1']],
    ]],
    //
    ['cpDinghu', [
        ['丁斧算番牌', 1, 960, 230, false, false, false, null, ['mapid_1']],
    ]],
    //
    ['cpDahu', [
        ['大胡加番', 1, 866, 130, false, false, false, null, ['mapid_1']],
    ]],
    ['cpJgd', [
        ['金钩钓加番', 1, 1040, 130, false, false, false, null, ['mapid_1']],
    ]],
    //
    ['cpPinghu', [
        ['平胡3番', 3, 480, 130, false, false, false, null, ['mapid_1']],
    ]],
    ['cpQuanhong', [
        ['全红10番', 10, 480, 80, false, false, false, null, ['mapid_1']],
    ]],
    // ['cpCjdahu', [
    //     ['超级大胡加番', 1, 960, 380, false, false, false, null, ['mapid_0']],
    // ]],
    ['cpRuanSiGen', [
        ['软四根加番', 1, 656, 130, false, false, false, null, ['mapid_1']],
    ]],
    ['cpHaidi', [
        ['海底胡加番', 1, 1040, 180, false, false, false, null, ['mapid_1']],
    ]]

    //cpYingSiGen 硬四根
];

var kaokao_fangka = {
    btn_19: [[3, 4, 5], [1, 2, 3]],
    btn_20: [[3, 4, 5], [1, 2, 3]]
};
