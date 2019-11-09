/**
 * 公用方法
 * Created by zhangluxin on 16/8/4.
 */

/**
 * 判断是不是空字符串
 * @param {String} str
 * @returns {Boolean}
 */
var isNullString = function (str) {
    return !_.isString(str) || str == '' || str == 'null';
};