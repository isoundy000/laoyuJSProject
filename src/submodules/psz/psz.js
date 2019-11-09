//     拼三张（扎金花）配置     //

var psz_src = [
    'src/submodules/psz/CuoPaiLayer_zjh.js',
    'src/submodules/psz/FapaiLayer.js',
    'src/submodules/psz/FapaiUpdateLayer.js',
    'src/submodules/psz/MaLayer_zjh.js',
    'src/submodules/psz/ZongJiesuanLayerZJH.js',
    'src/submodules/psz/WanfaLayer_zjh.js'
];

var psz_res = {
    CuopaiLayer_zjh_json: 'res/submodules/psz/ccs/CuoPaiLayer_zjh.json',
    Wanfa_zjh_json: 'res/submodules/psz/ccs/WanfaLayer_zjh.json',
    PkSceneZJH_json: 'res/submodules/psz/ccs/PkScene_zjh.json',
    ZJHPlayer_json: 'res/submodules/psz/ccs/ZJHPlayer.json',
    ZJHNinePlayer_json: 'res/submodules/psz/ccs/ZJHNinePlayer.json',
    ZongJiesuanLayerZJH_json: 'res/submodules/psz/ccs/ZongJiesuan_zjh.json',
    FapaiLayer_json: 'res/submodules/psz/ccs/FapaiLayer.json',
    VS_json: 'res/submodules/psz/ccs/vs.json',
    PlayerInfoLocation_json: 'res/submodules/psz/ccs/PlayerInfoLocation.json',

    yaman_atlas: 'res/submodules/psz/image/PkScene_zjh/yaman.atlas',
    yaman_png: 'res/submodules/psz/image/PkScene_zjh/yaman.png',
    yaman_json: 'res/submodules/psz/image/PkScene_zjh/yaman.json'

};

var psz_create_room_tabData = {
    btn_11: {
        click: ['mapid_0'],
        show: [],
        hide: []
    }
};

var psz_create_room_wanFaData = [
    ['mapid', [
        ['拼三张', MAP_ID.ZJH, -1000, -1000, true, true, false]
    ]],
    ['AA', [
        ['房主支付', false, 480, 580, true, true, false, null, ['mapid_0']],
        ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0']]
    ]],
    ['jushu', [
        ['6局', 6, 480, 525, true, true, false, null, ['mapid_0']],
        ['8局', 8, 720, 525, true, true, false, null, ['mapid_0']],
        ['12局', 12, 960, 525, true, true, false, null, ['mapid_0']],
        ['16局', 16, 480, 480, false, true, false, null, ['mapid_0']]
    ]],
    //拼三张
    ['menround_popup', [
        ['不闷', 0, 480, 180, true, true, false, null, 'mapid_0'],
        ['1轮', 1, 480, 180, false, true, false, null, 'mapid_0'],
        ['2轮', 2, 480, 180, false, true, false, null, 'mapid_0'],
        ['3轮', 3, 480, 180, false, true, false, null, 'mapid_0'],
        ['5轮', 5, 480, 180, false, true, false, null, 'mapid_0']
    ]],
    ['biround_popup', [
        ['1轮', 1, 930, 230, true, true, false, null, 'mapid_0'],
        ['2轮', 2, 930, 230, false, true, false, null, 'mapid_0'],
        ['3轮', 3, 930, 230, false, true, false, null, 'mapid_0']
    ]],
    ['genround_popup', [
        ['5轮', 5, 480, 230, true, true, false, null, 'mapid_0'],
        ['10轮', 10, 480, 230, false, true, false, null, 'mapid_0'],
        ['15轮', 15, 480, 230, false, true, false, null, 'mapid_0'],
        ['20轮', 20, 480, 230, false, true, false, null, ['mapid_0']]
    ]],
    ['bipai_popup', [
        ['比大小', 'daxiao', 480, 430, false, true, false, null, 'mapid_0'/*, '同牌型最大单牌大小相同时，依次\n比较剩余牌的大小'*/],
        ['比花色', 'huase', 480, 430, false, true, false, null, 'mapid_0'/*, '同牌型最大单牌大小相同时，最大单张\n牌比较花色，黑桃>红桃>梅花>方片'*/],
        ['全比', 'quanbi', 480, 430, true, true, false, null, 'mapid_0'/*, '先"比大小"，大小相同再"比花色"'*/]
    ]],
    ['maxPlayerCnt_popup', [
        ['五人场', 5, 720, 430, true, true, false, null, ['mapid_0']],
        ['九人场', 9, 720, 430, false, true, false, null, ['mapid_0']]
    ]],
    ['yaman', [
        ['押满', true, 720, 330, false, false, false, null, 'mapid_0']
    ]],
    ['canReadOtherPai', [
        ['未比牌不可见', false, 480, 330, false, false, false, null, ['mapid_0']]
    ]],
    ['baoziewai', [
        ['豹子额外奖励', true, 720, 380, false, false, false, null, 'mapid_0']
    ]],
    ['bipaishuangbei', [
        ['比牌双倍开', true, 960, 380, false, false, false, null, 'mapid_0']
    ]],
    ['jiesuansuanfen', [
        ['解散局算分', true, 480, 380, false, false, false, null, 'mapid_0']
    ]],
    ['cuopai_zjh', [
        ['搓牌', true, 480, 80, false, false, false, null, 'mapid_0'/*, '发牌前玩家可以选择起始牌的位置'*/]
    ]],
    ['qiepai', [
        ['切牌', true, 720, 80, false, false, false, null, 'mapid_0'/*, '发牌前玩家可以选择起始牌的位置'*/]
    ]],
    ['zuidaxiazhu_popup', [
        ['2、3、4、5', 5, 930, 280, true, true, false, null, ['mapid_0']],
        ['2、3、5、10', 10, 930, 280, false, true, false, null, ['mapid_0']]
    ]],
    ['qipaishijian_popup', [
        ['20秒', 20, 480, 280, true, true, false, null, ['mapid_0']],
        ['60秒', 60, 480, 280, false, true, false, null, ['mapid_0']],
        ['120秒', 120, 480, 280, false, true, false, null, ['mapid_0']],
        ['180秒', 180, 480, 280, false, true, false, null, ['mapid_0']],
        ['不弃牌', -1, 480, 280, false, true, false, null, ['mapid_0']]
    ]],
    ['yunxujiaru', [
        ['禁止中途加入', false, 480, 130, false, false, false, null, ['mapid_0']]
    ]],
    ['withOnLookers', [
        ['禁止观战', false, 720, 130, false, false, false, null, ['mapid_0']]
    ]],
    ['autoReadyAfterEnd', [
        ['自动准备', true, 930, 130, false, false, false, null, ['mapid_0']]
    ]],
    ['difen_popup', [
        ['10', 10, 930, 180, false, true, false, null, ['mapid_0']],
        ['8', 8, 930, 180, false, true, false, null, ['mapid_0']],
        ['5', 5, 930, 180, false, true, false, null, ['mapid_0']],
        ['1', 1, 930, 180, true, true, false, null, ['mapid_0']],
    ]],

    // ['withOnLookers', [
    //     ['允许观看', true, 2000, 2000, true, true, false, null, ['mapid_0']]
    // ]]
];

var psz_fangka = {
    btn_11: [[6, 6, 9, 12], [2, 2, 3, 4]]
};