/**
 * 阿里云推送
 */
var AliPushUtil = {};

/**
 * 收到消息
 * @param title
 * @param body
 */
AliPushUtil.messageReceived = function (title, body) {
    console.log('AliPushUtil.messageReceived');
    console.log(title);
    console.log(body);
};
/**
 * 处理消息
 * @param noticeDate
 * @param title
 * @param subtitle
 * @param body
 * @param badge
 * @param extras
 */
AliPushUtil.handleNotification = function (noticeDate, title, subtitle, body, badge, extras) {
    console.log('AliPushUtil.handleNotification');
    console.log(noticeDate);
    console.log(title);
    console.log(subtitle);
    console.log(body);
    console.log(badge);
    console.log(extras);
};

