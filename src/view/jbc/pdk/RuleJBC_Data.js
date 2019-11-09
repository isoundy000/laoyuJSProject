var RuleJBC_Data = {
    "rules": [
        
        //跑得快
        {
            "0": "跑得快",
            "1": "1 .游戏用牌",
            "2": "     16张牌：使用1副扑克，去掉大小王，去掉一个A、去掉三个2，共48张牌；"
        },
        {
            "0": "",
            "1": "2 .参与人数",
            "2": "     3人玩；"
        },
        {
            "0": "",
            "1": "3 .游戏过程",
            "2": "     摸到黑桃3的玩家先出牌，最先出完手中牌的人获胜。"
        },
        {
            "0": "",
            "1": "4 .出牌过程",
            "2": "     1、 逆时针出牌；\n     2、上家出的牌，下家有出必出，放走包赔。（放走规则：当下家报单，如果选择出单张，必须为手牌中最大的牌，否则视为放走，需包赔所有输分）。"
        },
        {
            "0": "",
            "1": "5 .牌型介绍",
            "2": "    单张：1张任意牌，2最大，3最小；\n    对子：2张点数相同的牌，AA最大，33最小；\n    3带X：3张点数相同的牌可带X张牌（最少0张，最多2张），带的牌不要求同点数；接牌时，必须按照上家的3+x出牌；\n    顺子：点数相连的5张及以上的牌，可以从3连到A。如：910JQKA；\n    连对：点数相连的2张及以上的对子，可以从3连到A。如：7788,334455；\n    三顺：点数相连的2个及以上的3张牌，可以从3连到A。如：888999；\n    飞机带翅膀：点数相连的2个及以上的3同牌，可以从3连到A，连N个3同牌，则可以带N张牌或者2N张牌，如：连3个3同张，333444555，可以选择带3张牌，也可以选择带6张牌。连2个3同牌，333444，可选择带2张牌，也可以带4张牌。\n    炸弹：4张相同点数的牌。炸弹的大小和牌点大小规则形同，3A也可以算作炸弹；"
        },
        {
            "0": "",
            "1": "6 .分数结算",
            "2": "    牌局结束后手牌剩余一张算一分，一个炸弹算10分；\n    报单放走包赔；\n    春天：有一家牌已经出完，另一家或者两家一张牌都没出，成为春天。春天分数翻倍；\n    红桃十中鸟翻倍：抓到红桃十的玩家，输赢翻倍。\n"+
            "牌局开始后会扣除一定服务费，不同场次扣除服务费数量不同，以具体场次为准；"
        },
    ]
};