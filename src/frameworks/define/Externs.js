/**
 * 一些系统方法的拓展
 * Created by zhangluxin on 16/8/4.
 */

/**
 * 将一个节点添加到另一个节点上
 * @param {cc.Node} node 节点
 * @param {number} [z_order] 层级
 * @param {number|string} [tag] tag值
 */
cc.Node.prototype.addTo = function (node, z_order, tag) {
    node.addChild(this, z_order, tag);
};
/**
 * 显示节点
 */
cc.Node.prototype.show = function () {
    this.setVisible(true);
};
/**
 * 隐藏节点
 */
cc.Node.prototype.hide = function () {
    this.setVisible(false);
};
/**
 * 移动节点
 */
cc.Node.prototype.move = function () {
    var x = 0;
    var y = 0;
    if (arguments.length == 1) {
        x = arguments[0].x;
        y = arguments[0].y;
    } else {
        x = arguments[0];
        y = arguments[1];
    }
    this.x = x;
    this.y = y;
};

/**
 * 是否有效
 * @returns {boolean}
 */
cc.Node.prototype.isValid = function () {
    return cc.sys.isObjectValid(this);
};