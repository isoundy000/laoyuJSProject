//     牛牛配置     //

var niuniu_src = [
    'src/submodules/niuniu/NiuniuLayer.js',
    // 'src/submodules/niuniu/NiuniuZJNLayer.js',
    'src/submodules/niuniu/pokerRule.js',
    'src/submodules/niuniu/JiesuanLayer.js',
    'src/submodules/niuniu/ZongJiesuanLayer.js',

];

var niuniu_res = {
    CuopaiLayer_json: 'res/submodules/niuniu/ccs/CuoPaiLayer.json',
    NiuniuLayer_json: 'res/submodules/niuniu/ccs/NiuniuScene.json',
    NiuniuSixPlayerLayer_json: 'res/submodules/niuniu/ccs/NiuniuSixPlayer.json',
    NiuniuNinePlayerLayer_json: 'res/submodules/niuniu/ccs/NiuniuNinePlayer.json',
    // NiuniuZJNLayer_json: 'res/submodules/niuniu/ccs/NiuniuZJNScene.json',
    ZongJiesuanLayer_json: 'res/submodules/niuniu/ccs/NiuniuZongJiesuan.json',
    // NiuNiuZhanjiDetailItem_json: 'res/submodules/niuniu/ccs/NiuniuZhanjiDetailItem.json',
    NiuniuWanfa_json: 'res/submodules/niuniu/ccs/NiuniuWanfa.json',
    LastReviewLayer_json: 'res/submodules/niuniu/ccs/LastReviewLayer.json',
    ReplaceCardLayer_json: 'res/submodules/niuniu/ccs/ReplaceCardLayer.json'
};

var niuniu_create_room_tabData = {
    btn_1: {
        click: ['mapid_0'],
        show: ['word_bs', 'word_px', 'word_df', 'word_gfxx_1'],
        hide: ['word_zdqz', 'word_tzxx', 'word_gfxx', 'word_gfxx_2', 'word_gfxx_3', 'word_tzxx_1', 'word_gddf']
    },
    btn_2: {
        click: ['mapid_1'],
        show: ['word_bs', 'word_px', 'word_df', 'word_gfxx_1'],
        hide: ['word_zdqz', 'word_gfxx', 'word_gfxx_2', 'word_tzxx_1', 'word_tzxx', 'word_gddf']
    },
    btn_3: {
        click: ['mapid_2'],
        show: ['word_bs', 'word_px', 'word_df', 'word_tzxx_1', 'word_gfxx_2'],
        hide: ['word_zdqz', 'word_gfxx', 'word_gfxx_1', "word_tzxx", 'word_gfxx_3', 'word_gddf']
    },
    btn_4: {
        click: ['mapid_3'],
        show: ['word_bs', 'word_px', 'word_df', 'word_zdqz', 'word_tzxx', 'word_gfxx'],
        hide: ['word_tzxx_1', 'word_gfxx_2', 'word_gfxx_1', 'word_gfxx_3', 'word_gddf']
    },
    btn_5: {
        click: ['mapid_4'],
        show: ['word_bs', 'word_px', 'word_df', 'word_zdqz', 'word_tzxx', 'word_gfxx'],
        hide: ['word_tzxx_1', 'word_gfxx_2', 'word_gfxx_1', 'word_gfxx_3', 'word_gddf']
    },
    btn_6: {
        click: ['mapid_5'],
        show: ['word_bs', 'word_px', 'word_df', 'word_zdqz', 'word_tzxx', 'word_gfxx'],
        hide: ['word_tzxx_1', 'word_gfxx_2', 'word_gfxx_1', 'word_gfxx_3', 'word_gddf']
    },
    btn_12: {
        click: ['mapid_6'],
        show: ['word_bs', 'word_px', 'word_df', 'word_zdqz', 'word_tzxx', 'word_gfxx'],
        hide: ['word_gfxx_1', 'word_gfxx_2', 'word_tzxx_1', 'word_gfxx_3', 'word_gddf']
    },
    btn_13: {
        click: ['mapid_7'],
        show: ['word_px', 'word_df', 'word_gfxx_2', 'word_zdqz'],
        hide: ['word_bs', 'word_gfxx', 'word_gfxx_1', 'word_tzxx', 'word_tzxx_1', 'word_gfxx_3', 'word_gddf']
    },
    btn_14: {
        click: ['mapid_8'],
        show: ['word_bs', 'word_px', 'word_gfxx_3', 'word_gddf'],
        hide: ['word_df', 'word_gfxx_2', 'word_zdqz', 'word_gfxx_1', 'word_gfxx_2', 'word_tzxx', 'word_tzxx_1', 'word_gfxx']
    }
};

var niuniu_create_room_wanFaData = [
    ['mapid', [
        ['双十上庄', MAP_ID.DN, 2000, 2000, true, true, false],//0
        ['通比玩法', MAP_ID.DN, 2000, 2000, true, true, false],//1
        ['抢庄玩法', MAP_ID.DN, 2000, 2000, true, true, false],//2
        ['明牌抢庄', MAP_ID.DN, 2000, 2000, true, true, false],//3
        ['九人明牌', MAP_ID.DN, 2000, 2000, true, true, false],//4  干掉
        ['抢庄推注', MAP_ID.DN, 2000, 2000, true, true, false],//5
        ['无花双十', MAP_ID.DN, 2000, 2000, true, true, false],//6
        ['疯狂双十', MAP_ID.DN, 2000, 2000, true, true, false],//7
        ['经典双十', MAP_ID.DN, 2000, 2000, true, true, false]//8
    ]],
    ['AA', [
        ['房主支付', false, 480, 580, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8']],
        ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8']]
    ]],
    ['rounds_nn', [
        ['10局', 10, 480, 525, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8']],
        ['20局', 20, 720, 525, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8']],
        ['30局', 30, 960, 525, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8']]
    ]],
    ['ZhuangMode', [
        ['双十上庄', "Niuniu", 2000, 595, true, true, false, null, 'mapid_0']
    ]],
    ['ZhuangMode_nn', [
        ['通比玩法', "Tongbi", 2000, 595, true, true, false, null, 'mapid_1']
    ]],
    ['ZhuangMode_nnqz', [
        ['抢庄玩法', "Qiang", 2000, 595, true, true, false, null, 'mapid_2']
    ]],
    ['ZhuangMode_mznn', [
        ['明牌抢庄', "Qiang", 2000, 595, true, true, false, null, ['mapid_3']]
    ]],
    ['ZhuangMode_qztz', [
        ['抢庄推注', "Qiang", 2000, 595, true, true, false, null, ['mapid_5']]
    ]],
    ['ZhuangMode_whsz', [
        ['无花双十', "Qiang", 2000, 595, true, true, false, null, ['mapid_6', 'mapid_7']]
    ]],
    ['ZhuangMode_jd', [
        ['连庄', "Auto", 480, 360, true, true, false, null, ['mapid_8']],
        ['轮庄', "Lunliu", 720, 360, false, true, false, null, ['mapid_8']],
        ['霸王庄', "ShuijiBawang", 960, 360, false, true, false, null, ['mapid_8']]
    ]],
    ['Preview', [
        ['全扣', "ling", 480, 195, true, true, false, null, ['mapid_0']],
        ['扣1张', "si", 720, 195, false, true, false, null, ['mapid_0']],
        ['扣2张', "san", 960, 195, false, true, false, null, ['mapid_0']]
    ]],
    ['Preview_mp', [
        ['扣1张', "si", 2000, 305, true, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']]
    ]],
    ['AlwaysTui', [
        ['抢庄推注', true, 2000, 305, true, true, false, null, ['mapid_5']]
    ]],
    ['Xiaobeilv_popup', [
        ['双十x3 十带九x2 十带八x2 十带七x2', '3222', 480, 470, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_8']],
        ['双十x4 十带九x3 十带八x2 十带七x2', '4322', 480, 470, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_8']]
    ]],
    ['kuozhan1', [
        ['五花/炸弹x6  五小x8', true, 480, 415, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_8']]
    ]],
    ['kuozhan2', [
        ['顺子/葫芦/同花x5', true, 870, 415, true, false, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_8']]
    ]],
    ['kuozhanwuhua1', [
        ['炸弹x8 四十大/十小x6', true, 480, 415, true, true, false, null, ['mapid_6']]
    ]],
    ['tieban', [
        ['铁板牛', true, 480, 360, false, false, false, null, ['mapid_6']]
    ]],
    ['Huapai', [
        ['癞子牌', true, 480, 360, false, false, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5'], '赖子可替代任意牌，在同牌型情况下，\n有赖子的牌型小于无赖子牌型']
    ]],

    ['Huapai_fk', [
        ['癞子牌', true, 480, 415, false, false, false, null, ['mapid_7'], '赖子可替代任意牌，在同牌型情况下，\n有赖子的牌型小于无赖子牌型']
    ]],

    ['noColor', [
        ['无花', true, 2000, 2000, true, true, false, null, ['mapid_6']]
    ]],
    ['crazy', [
        ['疯狂双十', true, 2000, 2000, true, true, false, null, ['mapid_7']]
    ]],
    ['isztjr', [
        ['禁止中途加入', true, 720, 195, false, false, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 480, 140], ['mapid_1', 480, 250], ['mapid_2', 720, 250], ['mapid_3', 720, 195],
                ['mapid_5', 480, 195], ['mapid_6', 720, 195], ['mapid_7', 480, 250], ['mapid_8', 720, 195]]
        ]
    ]],

    ['Cuopai', [
        ['禁止搓牌', true, 960, 195, false, false, false, null, ['mapid_0', 'mapid_3', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720 , 140], ['mapid_3', 960 , 195], ['mapid_5', 720, 195],
                ['mapid_6', 960, 195], ['mapid_7', 720, 250], ['mapid_8', 960, 195]]
        ]
    ]],
    ['Chipin', [
        ['1分', 1, 480, 305, true, true, false, null, 'mapid_1'],
        ['2分', 2, 720, 305, false, true, false, null, 'mapid_1'],
        ['5分', 5, 960, 305, false, true, false, null, 'mapid_1']
    ]],
    ['Difen_popup', [
        ['1/2', "1,2", 480, 305, true, true, false, null, ['mapid_0', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']],
        ['2/4', "2,4", 480, 305, false, true, false, null, ['mapid_0', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']],
        ['4/8', "4,8", 480, 305, false, true, false, null, ['mapid_0', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']],
        ['5/10', "5,10", 480, 305, false, true, false, null, ['mapid_0', 'mapid_2', 'mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']]
    ]],
    ['DisableHeiqiang', [
        ['下注限制', true, 480, 195, false, false, false, null, ['mapid_6', 'mapid_3', 'mapid_4']]
    ]],

    ['DisableHeiqiang_qz', [
        ['下注限制', true, 480, 250, false, false, false, null, ['mapid_2']]
    ]],

    ['MaxTuizhu_popup', [
        ['0倍', 0, 860, 305, false, true, false, null, ['mapid_2']],
        ['5倍', 5, 860, 305, false, true, false, null, ['mapid_2']],
        ['10倍', 10, 860, 305, true, true, false, null, ['mapid_2']],
        ['15倍', 15, 860, 305, false, true, false, null, ['mapid_2']]
    ]],
    ['MaxTuizhu_wh_popup', [
        ['0倍', 0, 480, 250, false, true, false, null, ['mapid_6', 'mapid_3', 'mapid_4']],
        ['5倍', 5, 480, 250, false, true, false, null, ['mapid_6', 'mapid_3', 'mapid_4']],
        ['10倍', 10, 480, 250, true, true, false, null, ['mapid_6', 'mapid_3', 'mapid_4']],
        ['15倍', 15, 480, 250, false, true, false, null, ['mapid_6', 'mapid_3', 'mapid_4']]
    ]],
    ['MaxTuizhu_qztzadd_popup', [
        ['3倍', 3, 480, 250, false, true, false, null, ['mapid_5']],
        ['5倍', 5, 480, 250, false, true, false, null, ['mapid_5']],
        ['8倍', 8, 480, 250, true, true, false, null, ['mapid_5']]
    ]],
    ['BeiShu_mznn_popup', [
        ['1倍', 1, 860, 305, false, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']],
        ['2倍', 2, 860, 305, false, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']],
        ['3倍', 3, 860, 305, false, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']],
        ['4倍', 4, 860, 305, true, true, false, null, ['mapid_3', 'mapid_4', 'mapid_5', 'mapid_6', 'mapid_7']]
    ]],
    ['ChipInType', [
        ['首局下注', '1', 480, 250, true, true, false, null, ['mapid_0']],
        ['闲家推注', '2', 720, 250, false, true, false, null, ['mapid_0']]
    ]],
    ['Meiniuxiazhuang', [
        ['没十下庄', true, 960, 250, false, false, false, null, ['mapid_0']]
    ]],
    ['Meiniuxiazhuang_jd', [
        ['没十下庄', true, 720, 305, false, false, false, null, ['mapid_8']]
    ]],
    ['Players_wuhua', [
        ['六人场', 'liu', 720, 140, true, true, false, null, ['mapid_6']]
    ]],
    ['MinBegin_wuhua_popup', [
        ['4人自动开', 4, 480, 85, false, true, false, null, ['mapid_6']
        ],//双十上庄
        ['5人自动开', 5, 480, 85, false, true, false, null, ['mapid_6']
        ],
        ['6人自动开', 6, 480, 85, false, true, false, null, ['mapid_6']
        ],
        ['手动开始', -1, 480, 85, true, true, false, null, ['mapid_6']]
    ]],
    ['Players', [
        ['六人场', 'liu', 480, 140, true, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 480, 85], ['mapid_1', 480, 140], ['mapid_2', 480, 195], ['mapid_3', 480, 140],
                ['mapid_5', 480, 140], ['mapid_7', 480, 195], ['mapid_8', 720, 140]]
        ],
        ['九人场', 'jiu', 720, 140, false, true, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 480, 30], ['mapid_1', 720, 140], ['mapid_2', 720, 195], ['mapid_3', 720, 140],
                ['mapid_5', 720, 140], ['mapid_7', 720, 195], ['mapid_8', 960, 140]]
        ]
    ]],
    ['MinBegin_popup', [
        ['4人自动开', 4, 860, 85, false, true, false, ['Players_1'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ],//双十上庄
        ['5人自动开', 5, 860, 85, false, true, false, ['Players_1'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85],  ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ],
        ['6人自动开', 6, 860, 85, false, true, false, ['Players_1'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ],
        ['手动开始', -1, 860, 85, true, true, false, ['Players_1'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ]
    ]],
    ['MinBegin_nine_popup', [
        ['7人自动开', 7, 860, 85, false, true, false, ['Players_0'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ],//双十上庄
        ['8人自动开', 8, 860, 85, false, true, false, ['Players_0'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ],
        ['9人自动开', 9, 860, 85, false, true, false, ['Players_0'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ],
        ['手动开始', -1, 860, 85, true, true, false, ['Players_0'], ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_7', 'mapid_8'], null,
            [['mapid_0', 720, 85], ['mapid_1', 480, 85], ['mapid_2', 960, 195], ['mapid_3', 480, 85],
                ['mapid_5', 480, 85], ['mapid_7', 960, 195], ['mapid_8', 720, 85]]
        ]
    ]],

    ['ZhuangMode_jd2', [
        ['双十上庄', 'Niuniu', 480, 305, false, false, false, null, ['mapid_8']]
    ]],
    ['Difen_jd', [
        ['底分', "1,2,3,4,5", 2000, 2000, true, true, false, null, ['mapid_8']]
    ]],
    ['ChipInOnce', [
        ['只下一次注', true, 480, 195, true, false, false, null, ['mapid_8']]
    ]],
    ['Preview_jd', [
        ['全扣', "ling", 480, 250, true, true, false, null, ['mapid_8']],
        ['扣1张', "si", 720, 250, false, true, false, null, ['mapid_8']],
        ['扣2张', "san", 960, 250, false, true, false, null, ['mapid_8']]
    ]],
    ['Quick', [
        ['快速场', true, 480, 140, false, false, false, null, ['mapid_0', 'mapid_1', 'mapid_2', 'mapid_3', 'mapid_5', 'mapid_6', 'mapid_7', 'mapid_8'], '快速场时间：抢庄：6s 下注：6s 亮牌:6s \n 比牌&算分：6s 准备：6s',
            [['mapid_0', 960, 140], ['mapid_1', 480, 195], ['mapid_2', 960, 250], ['mapid_3', 960, 140],
                ['mapid_5', 960, 140], ['mapid_6', 480, 140], ['mapid_7', 960, 250], ['mapid_8', 480, 140]]
        ]
    ]],
    //经典拼十
    ['Chipin_jd_popup', [
        ['5  分        ', 5, 480, 85, false, true, false, null, ['mapid_8'], '若选择分值，则每位玩家下注分数相同，\n若手动选择，则每位玩家可以随意选择下注分数'],
        ['4  分        ', 4, 480, 85, false, true, false, null, ['mapid_8'], '若选择分值，则每位玩家下注分数相同，\n若手动选择，则每位玩家可以随意选择下注分数'],
        ['3  分        ', 3, 480, 85, false, true, false, null, ['mapid_8'], '若选择分值，则每位玩家下注分数相同，\n若手动选择，则每位玩家可以随意选择下注分数'],
        ['2  分        ', 2, 480, 85, false, true, false, null, ['mapid_8'], '若选择分值，则每位玩家下注分数相同，\n若手动选择，则每位玩家可以随意选择下注分数'],
        ['1  分        ', 1, 480, 85, false, true, false, null, ['mapid_8'], '若选择分值，则每位玩家下注分数相同，\n若手动选择，则每位玩家可以随意选择下注分数'],
        ['手动选择', 0, 480, 85, true, true, false, null, ['mapid_8'], '若选择分值，则每位玩家下注分数相同，\n若手动选择，则每位玩家可以随意选择下注分数']
    ]],
];

var niuniu_fangka = {
    btn_1: [[6, 12, 18], [2, 4, 6]],
    btn_2: [[6, 12, 18], [2, 4, 6]],
    btn_3: [[6, 12, 18], [2, 4, 6]],
    btn_4: [[6, 12, 18], [2, 4, 6]],
    btn_5: [[9, 18, 27], [2, 4, 6]],
    btn_6: [[6, 12, 18], [2, 4, 6]],
    btn_12: [[6, 12, 18], [2, 4, 6]],
    btn_13: [[6, 12, 18], [2, 4, 6]],
    btn_14: [[6, 12, 18], [2, 4, 6]]
};
