//     跑得快（扑克）配置     //

var pdk_src = [
    //四川跑得快
    'src/submodules/pdk/pokerRule_pdk.js',

    'src/submodules/pdk/scpdkRule.js',
    'src/submodules/pdk/SCPokerLayer.js',

    'src/submodules/pdk/PokerJieSuanLayer.js',
    'src/submodules/pdk/PokerLayer.js',
    'src/submodules/pdk/PokerZongJiesuanLayer.js',
    'src/submodules/pdk/WanfaLayer_scpdk.js',
    'src/submodules/pdk/QiepaiLayer.js',
];

var pdk_res = {
    PkScene_pdk_json: 'res/submodules/pdk/ccs/PkScene.json',
    PokerJieSuan_json: 'res/submodules/pdk/ccs/PokerJieSuan.json',
    PokerZongJieSuan_json: 'res/submodules/pdk/ccs/PokerZongJiesuan.json',
    PkQiepai_pdk_json: 'res/submodules/pdk/ccs/QiepaiLayer.json',
    //四川跑得快
    PkScene_scpdk_json: 'res/submodules/pdk/ccs/SCPDKScene.json'
    , PkWanfa_Scpdk_json : "res/submodules/pdk/ccs/WanfaLayer_scpdk.json"
    , sp_scpdk_paixing_json:"res/submodules/pdk/image/paixing/paixing.json"
    , sp_scpdk_paixing_atlas:"res/submodules/pdk/image/paixing/paixing.atlas"
    , sp_scpdk_paixing_png:"res/submodules/pdk/image/paixing/paixing.png"
    , sp_scpdk_sanzhang_json:"res/submodules/pdk/image/quanguobao_sanzhang/quanguobao_sanzhang.json"
    , sp_scpdk_sanzhang_atlas:"res/submodules/pdk/image/quanguobao_sanzhang/quanguobao_sanzhang.atlas"
    , sp_scpdk_sanzhang_png:"res/submodules/pdk/image/quanguobao_sanzhang/quanguobao_sanzhang.png"
    , sp_scpdk_sanfei_json:"res/submodules/pdk/image/sanfei/sanfei.json"
    , sp_scpdk_sanfei_atlas:"res/submodules/pdk/image/sanfei/sanfei.atlas"
    , sp_scpdk_sanfei_png:"res/submodules/pdk/image/sanfei/sanfei.png"

};

var pdk_create_room_tabData = {
    btn_10: {
        click: ['mapid_0'],
        show: [],
        hide: ["word_fd"]
    },

    btn_22: {
        click: ['mapid_1'],
        show: ["word_fd"],
        hide: []
    }
};

var pdk_create_room_wanFaData = [
    ['mapid', [
        ['跑得快', MAP_ID.PDK, -1000, -1000, true, true, false],
        ['四川跑得快', MAP_ID.SC_PDK, -1000, -1000, true, true, false]
    ]],
    ['AA',
        [['房主支付', false, 480, 580, true, true, false, null, ['mapid_0','mapid_1']],
            ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0']]
        ]],
    ['jushu', [
        ['8局', 8, 480, 525, true, true, false, null, ['mapid_0']],
        ['16局', 16, 720, 525, false, true, false, null, ['mapid_0']],
    ]],
    ['rounds', [
        ['8局', 8, 480, 525, true, true, false, null, ['mapid_1']],
        ['10局', 10, 720, 525, false, true, false, null, ['mapid_1']],
        ['20局', 20, 960, 525, false, true, false, null, ['mapid_1']]
    ]],
    //跑得快
    ['sanrenwan_pdk', [
        ['三人玩', true, 480, 470, true, true, false, ['liangren_pdk_0'], 'mapid_0']
    ]],

    ['liangren_pdk', [
        ['二人玩', true, 720, 470, false, true, false, ['zhuaniao_0', 'sanrenwan_pdk_0'], 'mapid_0']
    ]],
    ['pdk3Abomb', [
        ['3A当炸弹', true, 720, 305, false, false, false, ['pdk3A1bomb_0'], ['mapid_0']]
    ]],
    ['pdk3A1bomb', [
        ['3A带1张当炸弹', true, 720, 250, false, false, false, ['pdk3Abomb_0'], ['mapid_0']]
    ]],

    ['pdkNumofCardsPerUser', [
        ['16张', 16, 480, 415, true, true, false, null, 'mapid_0'],
        ['15张', 15, 720, 415, false, true, false, null, 'mapid_0']
    ]],
    ['zhuaniao', [
        ['抓鸟(红桃10)', true, 480, 360, false, false, false, null, 'mapid_0']
    ]],
    ['heisanzhuang', [
        ['黑桃3先出', true, 720, 360, false, false, false, null, 'mapid_0']
    ]],
    ['sidai2or3', [
        ['允许4带3', 2, 480, 250, true, false, false, null, 'mapid_0']
    ]],

    ['xianshipai', [
        ['显示余牌', true, 480, 305, true, false, false, null, ['mapid_0']]
    ]],
    ['scxianshipai', [
        ['显示余牌', true, 480, 305, false, false, false, null, ['mapid_1']]
    ]],
    ['anticheating', [
        ['防作弊', true, 960, 305, false, false, false, null, 'mapid_0']
    ]],
    ['qiepai', [
        ['切牌', true, 480, 195, true, false, false, null, ['mapid_0']]
    ]],
    ['sirenGuding', [
        ['4人', true, 480, 470, true, true, false, ['sanrenSuiji_0', 'sanrenGuding_0', 'liangrenSuiji_0'], ['mapid_1']]
    ]],
    ['sanrenSuiji', [
        ['3人(随机)', true, 650, 470, false, true, false, ['sirenGuding_0', 'sanrenGuding_0', 'liangrenSuiji_0'], ['mapid_1']]
    ]],
    ['sanrenGuding', [
        ['3人(固定)', true, 860, 470, false, true, false, ['sanrenSuiji_0', 'sirenGuding_0', 'liangrenSuiji_0'], ['mapid_1']]
    ]],
    ['liangrenSuiji', [
        ['2人(随机)', true, 1060, 470, false, true, false, ['sanrenSuiji_0', 'sirenGuding_0', 'sanrenGuding_0'], ['mapid_1']]
    ]],
    ['heitao5xianchu', [
        ['黑桃5先出', true, 480, 415, true, true, false, null, ['mapid_1']]
    ]],
    ['dierjuyingjiaxianchu', [
        ['第二局赢家先出', true, 770, 415, false, false, false, null, ['mapid_1']]
    ]],
    ['four5FourA', [
        ['4个5/4个A(关牌)', true, 480, 360, false, false, false, null, ['mapid_1']]
    ]],
    ['quanxiao', [
        ['全小(关牌)', true, 770, 360, false, false, false, null, ['mapid_1']]
    ]],
    ['quanda', [
        ['全大(关牌)', true, 1000, 360, false, false, false, null, ['mapid_1']]
    ]],
    ['qheiQhongQduiQlian', [
        ['全黑/全红/全对/全连(关牌)', true, 770, 305, false, false, false, null, ['mapid_1']]
    ]],
    ['fengdingbomb', [
        ['1炸', 1, 480, 250, true, true, false, null, 'mapid_1'],
        ['2炸', 2, 720, 250, false, true, false, null, 'mapid_1'],
        ['3炸', 3, 960, 250, false, true, false, null, 'mapid_1']
    ]],
];

var pdk_fangka = {
    btn_10: [[5, 10], [2, 4]],
    btn_22: [[0,0,3, 4, 8], [0,0,1, 1, 1]]
};
