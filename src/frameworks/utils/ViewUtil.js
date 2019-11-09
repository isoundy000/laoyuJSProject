/**
 * 显示方法
 */

/**
 * 命名空间
 */
var VIEW = {};

/**
 * 层级定义
 * @type {Object}
 */
VIEW.Z_ORDER = {
    BOARD: 10,
    WINDOW: 20,
    DIALOG: 30,
    LOADING: 100
};
/**
 * 当前board(只能有一个)
 * @type {Board}
 */
VIEW.BOARD = null;
/**
 * 当前window列表
 * @type {Object}
 */
VIEW.WINDOWS = {};
/**
 * 当前的dialog列表
 * @type {Object}
 */
VIEW.Dialog = {};

/**
 * 显示board层界面(每次打开一个新的board)
 * @param {String} boardName borad名字
 * @param {Array} args 参数
 */
var showBoard = function (boardName, args) {
    if (!window[boardName]) {
        cc.error('想要显示board层界面不存在!!!');
        return;
    }
    if (!window[boardName] instanceof Board) {
        cc.error('想要显示的不是一个Board!!!');
        return;
    }
    var board = new window[boardName]();
    board.initBoard.apply(board, args);
    board.setName(boardName);
    VIEW.BOARD = board;
    var newScene = new cc.Scene();
    newScene.addChild(board, VIEW.Z_ORDER.BOARD);
    cc.director.runScene(newScene);
};