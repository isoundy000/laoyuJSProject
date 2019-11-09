/**
 * 二皮子配置
 * Created by duwei on 2018/7/13.
 */
var epz_src = [
    'src/submodules/epz/ErPiZiRoom.js',
    'src/submodules/epz/window/SetBoBoShuWindow.js',
    'src/submodules/epz/window/CuoOnePaiWindow.js',

    'src/submodules/epz/window/SetDaWindow.js',
    'src/submodules/epz/window/ZongJieSuanErPiZiWindow.js',
    'src/submodules/epz/window/JieSuanErPiZiWindow.js'
];

var epz_res = {
    ErPiZiRoom_json: 'res/submodules/epz/ccs/base/ErPiZiRoom.json',
    SetBoBoShuWindow_json: 'res/submodules/epz/ccs/base/window/SetBoBoShuWindow.json',
    SetDaWindow_json: 'res/submodules/epz/ccs/base/window/SetDaWindow.json',
    ZongJieSuanErPiZiWindow_json: 'res/submodules/epz/ccs/base/window/ZongJieSuanErPiZiWindow.json',
    JieSuanErPiZiWindow_json: 'res/submodules/epz/ccs/base/window/JieSuanErPiZiWindow.json',

    ChatSpeaker:'res/submodules/epz/ccs/base/unit/ChatSpeaker.json',

    poker_epz_png:'res/submodules/epz/image/base/card/poker_epz.png',
    poker_epz_plist:'res/submodules/epz/image/base/card/poker_epz.plist',

    poker_epz_cuopai_bei:'res/submodules/epz/image/base/cuopai/cuopai_bei.png',
    poker_epz_cuopai_bai:'res/submodules/epz/image/base/cuopai/cuopai_bai.png',
    poker_epz_cuopai_xian:'res/submodules/epz/image/base/cuopai/cuopai_xian.png',

    sp_touzi_json: 'res/submodules/epz/image/base/skeletons/touzi/touzi.json',
    sp_touzi_atlas: 'res/submodules/epz/image/base/skeletons/touzi/touzi.atlas',
    sp_touzi_png: 'res/submodules/epz/image/base/skeletons/touzi/touzi.png',

    sp_robot_json: 'res/submodules/epz/image/base/skeletons/robot/robot.json',
    sp_robot_atlas: 'res/submodules/epz/image/base/skeletons/robot/robot.atlas',
    sp_robot_png: 'res/submodules/epz/image/base/skeletons/robot/robot.png',

    sp_cheerpizi_json: 'res/submodules/epz/image/base/skeletons/cheerpizi/skeleton.json',
    sp_cheerpizi_atlas: 'res/submodules/epz/image/base/skeletons/cheerpizi/skeleton.atlas',
    sp_cheerpizi_png: 'res/submodules/epz/image/base/skeletons/cheerpizi/skeleton.png',

    table_epz_back0_jpg:'res/submodules/epz/image/base/bg/erpizi_bg1.jpg',
    table_epz_back1_jpg:'res/submodules/epz/image/base/bg/erpizi_bg2.jpg',
    table_epz_back2_jpg:'res/submodules/epz/image/base/bg/erpizi_bg3.jpg',
    table_epz_back3_jpg:'res/submodules/epz/image/base/bg/erpizi_bg4.jpg',

    //图片资源
    signal1: 'res/submodules/epz/image/base/RoomInfoUnit/signal1_1.png',
    signal2: 'res/submodules/epz/image/base/RoomInfoUnit/signal1_2.png',
    signal3: 'res/submodules/epz/image/base/RoomInfoUnit/signal1_3.png',
    signal4: 'res/submodules/epz/image/base/RoomInfoUnit/signal1_4.png',
    signal5: 'res/submodules/epz/image/base/RoomInfoUnit/signal1_5.png',

    wifi_signal1: 'res/submodules/epz/image/base/RoomInfoUnit/wifi0.png',
    wifi_signal2: 'res/submodules/epz/image/base/RoomInfoUnit/wifi1.png',
    wifi_signal3: 'res/submodules/epz/image/base/RoomInfoUnit/wifi2.png',
    wifi_signal4: 'res/submodules/epz/image/base/RoomInfoUnit/wifi3.png',

    battery_1: 'res/submodules/epz/image/base/RoomInfoUnit/battery1.png',
    battery_2: 'res/submodules/epz/image/base/RoomInfoUnit/battery2.png',
    battery_3: 'res/submodules/epz/image/base/RoomInfoUnit/battery3.png',
    battery_4: 'res/submodules/epz/image/base/RoomInfoUnit/battery4.png',
    battery_5: 'res/submodules/epz/image/base/RoomInfoUnit/battery5.png',
};

var epz_sound = {
    epz_da_1:'res/submodules/epz/sound/epz_sound/man/da.mp3',
    epz_da_2:'res/submodules/epz/sound/epz_sound/woman/da.mp3',
    epz_bi_1:'res/submodules/epz/sound/epz_sound/man/bi.mp3',
    epz_bi_2:'res/submodules/epz/sound/epz_sound/woman/bi.mp3',
    epz_diu_1:'res/submodules/epz/sound/epz_sound/man/diu.mp3',
    epz_diu_2:'res/submodules/epz/sound/epz_sound/woman/diu.mp3',
    epz_gen_1:'res/submodules/epz/sound/epz_sound/man/gen.mp3',
    epz_gen_2:'res/submodules/epz/sound/epz_sound/woman/gen.mp3',
    epz_qiao_1:'res/submodules/epz/sound/epz_sound/man/qiao.mp3',
    epz_qiao_2:'res/submodules/epz/sound/epz_sound/woman/qiao.mp3',
};

_.forIn(epz_sound, function (value, key) {
    epz_res[key] = value;
    res[key] = value;
});

var epz_create_room_tabData = {
    btn_21: {
        click: ['mapid_0'],
        show: [],
        hide: []
    }
};

var epz_create_room_wanFaData = [
    ['mapid', [
        ['扯二皮子', MAP_ID.EPZ, -1000, -1000, true, true, false]
    ]],
    ['AA', [
        ['房主支付', false, 480, 580, true, true, false, null, ['mapid_0']],
        ['AA支付', true, 720, 580, false, true, false, null, ['mapid_0']]
    ]],
    ['jushu', [
        ['8局', 8, 480, 530, true, true, false, null, ['mapid_0']],
        ['16局', 16, 720, 530, false, true, false, null, ['mapid_0']]
    ]],
    ['paiCount', [
        ['54张 一副牌', 1, 480, 480, true, true, false, null, 'mapid_0'],
        ['108张 两副牌', 2, 720, 480, false, true, false, null, 'mapid_0']
    ]],
    ['maxPlayerCnt', [
        ['六人场', 6, 480, 430, true, true, false, null, ['mapid_0']],
        ['八人场', 8, 720, 430, false, true, false, null, ['mapid_0']]
    ]],
    ['difen', [
        ['2分', 2, 480, 380, true, true, false, null, 'mapid_0'],
        ['5分', 5, 720, 380, false, true, false, null, 'mapid_0']
    ]],
    ['boboNum', [
        ['200分', 200, 480, 330, true, true, false, null, 'mapid_0'],
        ['400分', 400, 640, 330, false, true, false, null, 'mapid_0'],
        ['600分', 600, 800, 330, false, true, false, null, 'mapid_0']
    ]],
    ['beishu', [
        ['对子·王x2', 2, 480, 280, false, true, false, null, 'mapid_0'],
        ['对子·王x3', 3, 720, 280, true, true, false, null, 'mapid_0']
    ]],
    ['yunxujiaru', [
        ['禁止中途加入', false, 480, 230, false, false, false, null, ['mapid_0']]
    ]],
    ['withOnLookers', [
        ['禁止观战', false, 720, 230, false, false, false, null, ['mapid_0']]
    ]],
    ['liangTime', [
        ['10秒', 10, 480, 180, true, true, false, null, 'mapid_0'],
        ['禁止搓牌', 0, 720, 180, false, true, false, null, 'mapid_0']
    ]],
    ['qipaishijian', [
        ['20秒', 20, 480, 130, true, true, false, null, ['mapid_0']],
        ['30秒', 30, 640, 130, false, true, false, null, ['mapid_0']],
        ['40秒', 40, 800, 130, false, true, false, null, ['mapid_0']],
        ['50秒', 50, 480, 80, false, true, false, null, ['mapid_0']],
        ['60秒', 60, 640, 80, false, true, false, null, ['mapid_0']],
        ['90秒', 90, 800, 80, false, true, false, null, ['mapid_0']]
    ]]
];

var epz_fangka = {
    btn_21: [[9, 16, 12], [2, 3, 4]]
};