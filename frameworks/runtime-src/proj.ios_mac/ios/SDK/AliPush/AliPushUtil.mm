//
//  AliPushUtil.m
//  majiang-mobile
//
//  Created by 张路欣 on 2018/4/26.
//

#import "AliPushUtil.h"
#import <UserNotifications/UserNotifications.h>
#import <CloudPushSDK/CloudPushSDK.h>
#include "cocos2d.h"
#import "cocos/scripting/js-bindings/manual/ScriptingCore.h"

USING_NS_CC;

@implementation ADD_CLASS(AliPushUtil)

ADD_CLASS(AliPushUtil) *_alpInstance = nil;

+ (ADD_CLASS(AliPushUtil) *) ADD_FUN(getInstance) {
    if (_alpInstance == nil) {
        _alpInstance = [[ADD_CLASS(AliPushUtil) alloc] init];
    }
    return _alpInstance;
}

- (void) ADD_FUN(registerApp): (UIApplication *)application {
    _notificationCenter = [UNUserNotificationCenter currentNotificationCenter];
    _notificationCenter.delegate = self;
    [_notificationCenter requestAuthorizationWithOptions:UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound completionHandler:^(BOOL granted, NSError *_Nullable error) {
        if (granted) {
            NSLog(@"User authored notification.");
            // 向APNs注册，获取deviceToken
            dispatch_async(dispatch_get_main_queue(), ^{
                [application registerForRemoteNotifications];
            });
        } else {
            NSLog(@"User denied notification.");
        }
    }];
}

- (void) ADD_FUN(initCloudPush): (NSDictionary *)launchOptions {
    [CloudPushSDK autoInit:^(CloudPushCallbackResult *res) {
        if (res.success) {
            NSLog(@"Push SDK init success, deviceId: %@.", [CloudPushSDK getDeviceId]);
        } else {
            NSLog(@"Push SDK init failed, error: %@", res.error);
        }
    }];
    // 监听推送通道打开动作
    [self listenerOnChannelOpened];
    // 监听推送消息到达
    [self registerMessageReceive];
    // 点击通知将App从关闭状态启动时，将通知打开回执上报
    [CloudPushSDK sendNotificationAck:launchOptions];
}

#pragma mark Channel Opened

/**
 *	注册推送通道打开监听
 */
- (void)listenerOnChannelOpened {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onChannelOpened:) name:@"CCPDidChannelConnectedSuccess" object:nil];
}

/**
 *	推送通道打开回调
 *
 *	@param 	notification
 */
- (void)onChannelOpened:(NSNotification *)notification {
    NSLog(@"推送通道建立成功!");
}

#pragma mark Receive Message

/**
 *	@brief	注册推送消息到来监听
 */
- (void)registerMessageReceive {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onMessageReceived:) name:@"CCPDidReceiveMessageNotification" object:nil];
}

/**
 *	处理到来推送消息
 *
 *	@param 	notification
 */
- (void)onMessageReceived:(NSNotification *)notification {
    NSLog(@"Receive one message!");
    CCPSysMessage *message = [notification object];
    NSString *title = [[[NSString alloc] initWithData:message.title encoding:NSUTF8StringEncoding] autorelease];
    NSString *body = [[[NSString alloc] initWithData:message.body encoding:NSUTF8StringEncoding] autorelease];
    std::string _title = [[[[NSString alloc] initWithString:title] autorelease] UTF8String];
    std::string _body = [[[[NSString alloc] initWithString:body] autorelease] UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("AliPushUtil.messageReceived(\"%s\",\"%s\");", _title.c_str(), _body.c_str());
    ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
}

- (void) ADD_FUN(didRegisterForRemoteNotificationsWithDeviceToken): (NSData *)deviceToken {
    NSLog(@"Upload deviceToken to CloudPush server.");
    [CloudPushSDK registerDevice:deviceToken withCallback:^(CloudPushCallbackResult *res) {
        if (res.success) {
            NSLog(@"Register deviceToken success, deviceToken: %@", [CloudPushSDK getApnsDeviceToken]);
        } else {
            NSLog(@"Register deviceToken failed, error: %@", res.error);
        }
    }];
}

- (void) ADD_FUN(didFailToRegisterForRemoteNotificationsWithError): (NSError *)error {
    NSLog(@"didFailToRegisterForRemoteNotificationsWithError %@", error);
}

/**
 *  App处于前台时收到通知
 */
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    NSLog(@"Receive a notification in foregound.");
    // 处理iOS 10通知，并上报通知打开回执
    [self ADD_FUN(handleNotification): notification];
//    // 通知不弹出
//    completionHandler(UNNotificationPresentationOptionNone);
    // 通知弹出，且带有声音、内容和角标
    completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

- (void) ADD_FUN(handleNotification):(UNNotification *)notification {
    UNNotificationRequest *request = notification.request;
    UNNotificationContent *content = request.content;
    NSDictionary *userInfo = content.userInfo;
    // 通知时间
    NSDate *noticeDate = notification.date;
    // 标题
    NSString *title = content.title;
    // 副标题
    NSString *subtitle = content.subtitle;
    // 内容
    NSString *body = content.body;
    // 角标
    int badge = [content.badge intValue];
    // 取得通知自定义字段内容，例：获取key为"Extras"的内容
    NSString *extras = [userInfo valueForKey:@"Extras"];
    // 通知角标数清0
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    // 同步角标数到服务端
    // [self syncBadgeNum:0];
    // 通知打开回执上报
    [CloudPushSDK sendNotificationAck:userInfo];
    
    if (title == nil){
        title = @"";
    }

    if (subtitle == nil){
        subtitle = @"";
    }
    
    if (body == nil){
        body = @"";
    }
    
    if (extras == nil){
        extras = @"";
    }
    
//    NSLog(@"Notification, date: %@, title: %@, subtitle: %@, body: %@, badge: %d, extras: %@.", noticeDate, title, subtitle, body, badge, extras);
    std::string _noticeDate = [[[[NSString alloc] initWithString:noticeDate.description] autorelease] UTF8String];
    std::string _title = [[[[NSString alloc] initWithString:title] autorelease] UTF8String];
    std::string _subtitle = [[[[NSString alloc] initWithString:subtitle] autorelease] UTF8String];
    std::string _body = [[[[NSString alloc] initWithString:body] autorelease] UTF8String];
    std::string _badge = [[NSString stringWithFormat:@"%d", badge] UTF8String];
    std::string _extras = [[[[NSString alloc] initWithString:extras] autorelease] UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("AliPushUtil.handleNotification(\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\");",
            _noticeDate.c_str(), _title.c_str(), _subtitle.c_str(), _body.c_str(), _badge.c_str(), _extras.c_str());
    ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
}

@end
