//     麻将配置     //

var majiang_src = [
    'src/submodules/majiang/HaidiLayer.js',
    'src/submodules/majiang/JiesuanLayer.js',
    'src/submodules/majiang/MaLayer.js',
    'src/submodules/majiang/MaLayer_sc_mz.js',
    'src/submodules/majiang/MaLayer_match.js',
    // 'src/submodules/majiang/MaLayer_kwx.js',
    'src/submodules/majiang/PlayBackLayer.js',
    'src/submodules/majiang/ZhaniaoLayer.js',
    'src/submodules/majiang/ZongJiesuanLayer.js',

    //四川
    'src/submodules/majiang/MaLayer_sc.js',
    'src/submodules/majiang/JiesuanSc2Layer.js',
    'src/submodules/majiang/JiesuanSc3Layer.js',
    'src/submodules/majiang/JiesuanScLayer.js',
];

var majiang_res = {
    // Warning_json: 'res/submodules/majiang/ccs/MJ_baojingdeng.json',
    ChiPanel_json: 'res/submodules/majiang/ccs/ChiPanel.json',
    HaidipaiLayer_json: 'res/submodules/majiang/ccs/HaidipaiLayer.json',
    JiesuanLayer_json: 'res/submodules/majiang/ccs/JieSuan.json',
    KaigangLayer_json: 'res/submodules/majiang/ccs/KaigangLayer.json',
    KaigangReplayLayer_json: 'res/submodules/majiang/ccs/KaigangReplayLayer.json',

    MaScene_json: 'res/submodules/majiang/ccs/MaScene.json',
    MaScene1_json: 'res/submodules/majiang/ccs/MaScene1_1.json',


    ThrowDice_json: 'res/submodules/majiang/ccs/ThrowDice.json',
    Zhaoniao_json: 'res/submodules/majiang/ccs/Zhaniao.json',
    Ma_ZongJiesuanLayer_json: 'res/submodules/majiang/ccs/ZongJieSuan.json',
    PlayBackLayer_json: 'res/submodules/majiang/ccs/PlayBackLayer.json',
    PlayBackLayer_sc_json: 'res/submodules/majiang/ccs/PlayBackLayer_sc.json',

    hupai_tips_icon: 'res/area/xykwx/table/hupai_tips_icon.png',
    chi2: 'res/area/xykwx/table/chi2.png',
    peng2: 'res/area/xykwx/table/peng2.png',
    gang2: 'res/area/xykwx/table/gang2.png',
    hu2: 'res/area/xykwx/table/hu2.png',
    zimo2: 'res/area/xykwx/table/zimo2.png',

    ltqp0: 'res/area/xykwx/table/ltqp0.png',
    ltqp1: 'res/area/xykwx/table/ltqp1.png',
    ltqp2: 'res/area/xykwx/table/ltqp2.png',
    ltqp3: 'res/area/xykwx/table/ltqp3.png',

    speaker1: 'res/area/xykwx/table/speaker1.png',
    speaker2: 'res/area/xykwx/table/speaker2.png',
    speaker3: 'res/area/xykwx/table/speaker3.png',
    sp_picback: 'res/area/xykwx/table/sp_picback.png',
    toast_bg2: 'res/area/xykwx/table/toast_bg2.png',
    hupaitip_jiao: 'res/area/xykwx/table/hupaitip_jiao.png',
    word_bujiapiao: 'res/area/xykwx/table/word_bujiapiao.png',
    mjbg: 'res/area/xykwx/table/mjbg.png',
    toast_bg: 'res/area/xykwx/table/toast_bg.png',
    liang: 'res/area/xykwx/table/liang.png',

    buxianshi: 'res/area/xykwx/table/word/buxianshi.png',
    chupaibuzhengque: 'res/area/xykwx/table/word/chupaibuzhengque.png',
    dayizhang: 'res/area/xykwx/table/word/dayizhang.png',
    dengdai: 'res/area/xykwx/table/word/dengdai.png',
    diyibu: 'res/area/xykwx/table/word/diyibu.png',
    liangpianbuzhengque: 'res/area/xykwx/table/word/liangpianbuzhengque.png',



    //四川
    JiesuanScLayer_json: "res/submodules/majiang/ccs/JieSuan_Sc.json",
    JiesuanScLayer_1_json: "res/submodules/majiang/ccs/Jiesuan_Sc_1.json",
    JiesuanDetailScLayer_json: "res/submodules/majiang/ccs/JiesuanDetail_Sc.json",
    MaScene_Sc_json: "res/submodules/majiang/ccs/MaScene_Sc.json",
    MaScene1_Sc_json: "res/submodules/majiang/ccs/MaScene1_Sc.json",
    MaScene1Xueliu_json: "res/submodules/majiang/ccs/MaScene1Xueliu.json",
    toast_bg_png: "res/submodules/majiang/image/ma_sc/toast_bg.png",

    hu_json: "res/submodules/majiang/image/ma_sc/HU.json",
    zimo_json: "res/submodules/majiang/image/ma_sc/ZIMO.json",
    guafeng_plist: "res/submodules/majiang/image/ma_sc/guafeng.plist",
    guafeng_png: "res/submodules/majiang/image/ma_sc/guafeng.png",
    lb_gang: "res/submodules/majiang/image/ma_sc/lb_gang.png",
    lb_lai: "res/submodules/majiang/image/ma_sc/lb_lai.png",
    lb_pi: "res/submodules/majiang/image/ma_sc/lb_pi.png",

    xiayu_plist: "res/submodules/majiang/image/ma_sc/rain.plist",
    xiayu_png: "res/submodules/majiang/image/ma_sc/rain.png",

    hupai_bg: "res/submodules/majiang/image/ma_sc/hupai_bg.png",
    hupai_bg2: "res/submodules/majiang/image/ma_sc/hupai_bg2.png",
};

var majiang_create_room_tabData = {
    btn_7: {
        click: ['mapid_0'],
        show: ['word_rs', 'word_zm'],
        hide: ['fengding']
    },
    btn_8: {
        click: ['mapid_1'],
        show: ['word_rs', 'word_zm'],
        hide: ['fengding']
    },
    btn_9: {
        click: ['mapid_2'],
        show: [],
        hide: ['fengding']
    },
    btn_15: {
        click: ['mapid_3'],
        show: ['fengding'],
        hide: ['word_rs', 'word_zm']
    },
    btn_16: {
        click: ['mapid_4'],
        show: ['fengding'],
        hide: ['word_rs', 'word_zm']
    },
    btn_17: {
        click: ['mapid_5'],
        show: ['fengding'],
        hide: ['word_rs', 'word_zm']
    },
    btn_18: {
        click: ['mapid_6'],
        show: ['fengding'],
        hide: ['word_rs', 'word_zm']
    },
};

var majiang_create_room_wanFaData = [
    ['mapid', [
        ['转转麻将', MAP_ID.ZHUANZHUAN, -1000, -1000, true, true, false],
        ['长沙麻将', MAP_ID.CHANGSHA, -1000, -1000, false, true, false],
        ['红中麻将', MAP_ID.HONGZHONG, -1000, -1000, false, true, false],
        ['血战到底', MAP_ID.SICHUAN_XUEZHAN, -1000, -1000, false, true, false, 'sanrenwan_0'],//3
        ['血流成河', MAP_ID.SICHUAN_XUELIU, -1000, -1000, true, true, false, 'sanrenwan_0'],//4
        ['绵竹麻将', MAP_ID.SICHUAN_MZ, -1000, -1000, true, true, false, 'sanrenwan_0'],//5
        ['三人两房', MAP_ID.SICHUAN_TRLF, -1000, -1000, true, true, false, 'sanrenwan_0'],//6
    ]],
    ['AA', [
        ['房主支付', false, 480, 580, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4','mapid_5','mapid_6']],
        ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4','mapid_5','mapid_6']]
    ]],
    ['jushu', [
        ['8局', 8, 480, 525, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2','mapid_3','mapid_4','mapid_5','mapid_6']],
        ['16局', 16, 720, 525, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2','mapid_3','mapid_4','mapid_5','mapid_6']]
    ]],

    ['qiangganghu', [['可抢杠胡', true, 480, 470, true, false, false, 'onlyzimo_0', ['mapid_0', 'mapid_2']]]],
    ['onlyzimo', [['只能自摸胡', true, 720, 470, false, false, false, 'qiangganghu_0', ['mapid_0', 'mapid_2']]]],
    ['hongzhong', [['红中赖子', true, 960, 470, false, false, false, null, ['mapid_0']]]],
    ['hongzhong_hz', [['红中赖子', true, 2000, 2000, true, true, false, null, ['mapid_2']]]],
    ['qidui', [['可胡七对', true, 480, 415, true, false, false, null, ['mapid_0', 'mapid_2']]]],
    ['zuojiang258', [['258做将', true, 720, 415, false, false, false, null, ['mapid_0', 'mapid_2']]]],
    ['zhuangxian', [['庄闲分', true, 480, 470, true, false, false, null, 'mapid_1']]],
    ['piao', [['飘分', -1, 720, 470, true, false, false, null, 'mapid_1']]],

    ['bubugao', [['步步高', true, 480, 360, false, false, false, null, 'mapid_1']]],
    ['yizhihua', [['一枝花', true, 720, 360, false, false, false, null, 'mapid_1']]],
    ['santong', [['三同', true, 960, 360, false, false, false, null, 'mapid_1']]],
    ['jintongyunv', [['金童玉女', true, 480, 305, false, false, false, null, 'mapid_1']]],
    ['zhongtusixi', [['中途四喜', true, 960, 305, false, false, false, null, 'mapid_1']]],
    ['jiaganghu', [['假将胡', true, 720, 305, false, false, false, null, 'mapid_1']]],
    ['zhongtuliuliushun', [['中途六六顺', true, 480, 250, false, false, false, null, 'mapid_1']]],

    ['liangrenwan', [['2人', true, 960, 195, false, true, false, ['sanrenwan_0', 'siren_0'], ['mapid_0']]]],
    ['sanrenwan', [['3人', true, 720, 195, false, true, false, ['liangrenwan_0', 'siren_0'], ['mapid_0']]]],
    ['siren', [['4人', true, 480, 195, true, true, false, ['sanrenwan_0', 'liangrenwan_0'], ['mapid_0']]]],
    ['sanrenwan_cs', [['3人', true, 720, 195, false, true, false, ['siren_cs_0'], ['mapid_1', 'mapid_2']]]],
    ['siren_cs', [['4人', true, 480, 195, true, true, false, ['sanrenwan_cs_0'], ['mapid_1', 'mapid_2']]]],

    ['zhongniaofanbei', [['抓码翻倍', true, 960, 470, false, false, false, null, ['mapid_1'], null, null, 'zhuama159_0']]],
    ['buzhuama', [['不抓码', true, 480, 415, true, true, false, ['zhuama159_0', 'zhuamajingdian_0'], ['mapid_1']]]],
    ['zhuama159', [['159抓码', true, 960, 415, false, true, false, ['zhuamajingdian_0', 'buzhuama_0'], ['mapid_1']]]],
    ['zhuamajingdian', [['经典抓码', true, 720, 415, false, true, false, ['zhuama159_0', 'buzhuama_0'], ['mapid_1']]]],
    ['zhaniao', [
        ['2个', 2, 480, 140, false, false, false, null, ['mapid_0', 'mapid_2']],
        ['4个', 4, 640, 140, false, false, false, null, ['mapid_0', 'mapid_2']],
        ['6个', 6, 800, 140, false, false, false, null, ['mapid_0', 'mapid_2']],
        ['摸几奖几', 100, 960, 140, false, false, false, null, ['mapid_0', 'mapid_2']]
    ]],
    ['zhaniao_cs', [
        ['2个', 2, 480, 140, true, true, false, null, ['mapid_1'], null, null,
            ['zhuamajingdian_0', 'zhuama159_0'], 'zhongniaofanbei_0'],
        ['4个', 4, 720, 140, false, true, false, null, ['mapid_1'], null, null,
            ['zhuamajingdian_0', 'zhuama159_0'], 'zhongniaofanbei_0'],
        ['6个', 6, 960, 140, false, true, false, null, ['mapid_1'], null, null,
            ['zhuamajingdian_0', 'zhuama159_0'], 'zhongniaofanbei_0']
    ]],
    ['zhaniao_csfanbei', [
        ['1个', 1, 480, 140, true, true, false, null, ['mapid_1'], null, null, 'zhongniaofanbei_0']
    ]],


    //四川
    ['zimofanfan_popup', [
        ['自摸加底', false, 485, 470, false, true, false, null, ['mapid_3', 'mapid_4', 'mapid_6']],
        ['自摸翻番', true, 485, 470, true, true, false, null, ['mapid_3', 'mapid_4', 'mapid_6']]
    ]],
    ['ganghuazimo_popup', [
        ['点杠花（点炮）', false, 760, 470, true, true, false, null, ['mapid_3', 'mapid_6']],
        ['点杠花（自摸）', true, 760, 470, false, true, false, null, ['mapid_3', 'mapid_6']]
    ]],

    ['paiCnt', [['13张', 13, -1000, -1000, true, true, false, null, ['mapid_6']]]],

    ['huansanzhang', [['换三张', true, 485, 415, true, false, false, ['sanrenwan_mz_0', 'liangrenwan_mz_0'], ['mapid_4', 'mapid_5']]]],
    ['yifandiaopao', [['平胡可接炮', true, 960, 415, true, false, false, null, 'mapid_5']]],
    ['fengding', [
        ['2番', 4, 485, 123, false, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5']],
        ['3番', 8, 635, 123, true, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5']],
        ['4番', 16, 785, 123, false, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5']],
    ]],

    ['yaojiujiangdui', [['幺九将对', true, 485, 410, true, false, false, null, ['mapid_6']]]],
    ['menqingzhongzhang', [['门清中张', true, 760, 410, true, false, false, null, ['mapid_6']]]],
    ['tiandihu', [['天地胡', true, 1035, 420, true, false, false, null, ['mapid_6']]]],
    ['dianpaopinghu', [['点炮可平胡', true, 485, 350, true, false, false, null, ['mapid_6']]]],
    ['duiduihu2fan', [['对对胡两番', true, 760, 350, true, false, false, null, ['mapid_6']]]],
    ['jiaxin5', [['夹心5', true, 1035, 350, true, false, false, null, ['mapid_6']]]],

    ['xiadayu', [
        ['下大雨', true, 485, 348, true, true, false, null, 'mapid_3'],
        ['下小雨', false, 760, 348, false, true, false, null, 'mapid_3']
    ]],
    ['duiduihu1fan', [
        ['对对胡1番', true, 485, 281, true, true, false, null, 'mapid_3'],
        ['对对胡2番', false, 760, 281, false, true, false, null, 'mapid_3']
    ]],

    ['quanyaojiu2fan', [
        ['全幺九2番', true, 485, 214, true, true, false, null, 'mapid_3'],
        ['全幺九3番', false, 760, 214, false, true, false, null, 'mapid_3']
    ]],

    ['yaojiujiangdui1', [['将对', true, 485, 415, false, false, false, null, ['mapid_3']]]],
    ['huansanzhang1', [['换三张', true, 1035, 281, false, false, false, null, 'mapid_3']]],
    ['menqingzhongzhang1', [['门清中张', true, 1035, 348, false, false, false, null, 'mapid_3']]],
    ['tiandihu1', [['天地胡', true, 1035, 214, false, false, false, null, 'mapid_3']]],
    ['dadandiao', [['大单钓', true, 760, 415, true, false, false, null, 'mapid_3']]],

    ['dy0', [['自摸翻番', true, 485, 470, true, true, false, null, ['mapid_5']]]],
    ['menqing', [['门清', true, 720, 470, false, false, false, null, ['mapid_5']]]],
    ['dianpaomenqing', [['门清可接炮', true, 960, 470, true, false, false, null, ['mapid_5']]]],
    ['sanrenwan_mz', [['三人玩', true, 720, 415, false, false, false, ['huansanzhang_0', 'liangrenwan_mz_0'], ['mapid_5']]]],
    ['liangrenwan_mz', [['两人玩', true, 720, 348, false, false, false, ['huansanzhang_0', 'sanrenwan_mz_0'], ['mapid_5']]]],

    //三人两房的两人玩
    ['liangrenwan_srlf', [['两人玩', true, 485, 170, false, false, false, null, ['mapid_6']]]],
    ['huansanzhang_srlf', [['换三张', true, 485, 290, false, false, false, ['huansizhang_srlf_0'], ['mapid_6']]]],
    ['huansizhang_srlf', [['换四张', true, 760, 290, false, false, false, ['huansanzhang_srlf_0'], ['mapid_6']]]],
    ['yitiaolong', [['一条龙', true, 485, 230, false, false, false, null, ['mapid_6']]]],
    ['jiemeidui', [['姊妹对', true, 760, 230, false, false, false, null, ['mapid_6']]]],
    ['fengding_srlf', [
        ['3番', 8, 485, 123, false, true, false, null, ['mapid_6']],
        ['4番', 16, 635, 123, true, true, false, null, ['mapid_6']],
        ['5番', 32, 785, 123, false, true, false, null, ['mapid_6']]
    ]]


];

var majiang_fangka = {
    btn_7: [[5,10], [2, 4]],
    btn_8: [[5,10], [2, 4]],
    btn_9: [[5,10], [2, 4]],

    btn_15: [[2,4], [1, 2]],
    btn_16: [[2,4], [1, 2]],
    btn_17: [[3,6], [2, 3]],
    btn_18: [[2,4], [1, 2]]
};

var addScMusic = function () {
    var scManEffectDef = [
        [11, 2], [12, 2], [13, 2], [14, 3], [15, 1], [16, 1], [17, 1], [18, 1], [19, 2],
        [21, 4], [22, 3], [23, 3], [24, 3], [25, 3], [26, 1], [27, 1], [28, 2], [29, 3],
        [31, 4], [32, 5], [33, 1], [34, 2], [35, 1], [36, 2], [37, 1], [38, 5], [39, 2],
        ['angang', 3], ['gang', 3], ['hu', 3], ['peng', 4], ['zimo', 1]
    ];
    var scWomanEffectDef = [
        [11, 2], [12, 1], [13, 2], [14, 3], [15, 1], [16, 1], [17, 1], [18, 1], [19, 2],
        [21, 4], [22, 2], [23, 3], [24, 3], [25, 3], [26, 1], [27, 1], [28, 2], [29, 3],
        [31, 4], [32, 4], [33, 1], [34, 2], [35, 1], [36, 2], [37, 1], [38, 5], [39, 2],
        ['angang', 3], ['gang', 3], ['hu', 3], ['peng', 4], ['zimo', 1]
    ];

    for (var i = 0; i < scManEffectDef.length; i++) {
        res['sc_' + scManEffectDef[i][0] + '_1'] = res['sc_' + scManEffectDef[i][0] + '_1'] || [];
        for (var j = 0; j < scManEffectDef[i][1]; j++)
            res['sc_' + scManEffectDef[i][0] + '_1'].push('res/music/sound_sc/sc_man_' + scManEffectDef[i][0] + '_0' + '.mp3');
    }
    for (var i = 0; i < scWomanEffectDef.length; i++) {
        res['sc_' + scWomanEffectDef[i][0] + '_2'] = res['sc_' + scWomanEffectDef[i][0] + '_2'] || [];
        for (var j = 0; j < scWomanEffectDef[i][1]; j++)
            res['sc_' + scWomanEffectDef[i][0] + '_2'].push('res/music/sound_sc/sc_woman_' + scWomanEffectDef[i][0] + '_0' + '.mp3');
    }
}
addScMusic();

