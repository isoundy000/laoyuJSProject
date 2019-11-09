/**
 * Board基类
 **/
var Board = View.extend({
    /**
     * 初始化的位置
     * @protected
     */
    initBoard: function () {
        this._rootNode.move(yy.display.center);
    }
});