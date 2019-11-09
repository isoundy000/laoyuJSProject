//
//  AliPushUtil.h
//  majiang-mobile
//
//  Created by 张路欣 on 2018/4/26.
//

#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>

@interface ADD_CLASS(AliPushUtil) : NSObject <UNUserNotificationCenterDelegate>

@property(nonatomic, strong) UNUserNotificationCenter *notificationCenter;

+ (ADD_CLASS(AliPushUtil) *) ADD_FUN(getInstance);

- (void) ADD_FUN(registerApp):(UIApplication *)application;

- (void) ADD_FUN(initCloudPush):(NSDictionary *)launchOptions;

- (void) ADD_FUN(didRegisterForRemoteNotificationsWithDeviceToken): (NSData *)deviceToken;

- (void) ADD_FUN(didFailToRegisterForRemoteNotificationsWithError): (NSError *)error;

- (void) ADD_FUN(handleNotification): (UNNotification *)notification;

@end
