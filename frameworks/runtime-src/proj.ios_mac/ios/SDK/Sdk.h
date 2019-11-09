//
//  Sdk.h
//  ttqmdp-mobile
//
//  Created by 杨海金 on 2018/10/8.
//

#import <Foundation/Foundation.h>

@interface ADD_CLASS(Sdk) : NSObject

@property(nonatomic, strong) UIView *view;
@property(nonatomic, strong) UIApplication *application;
@property(nonatomic, strong) NSDictionary *launchOptions;

// 微信 appid
@property(nonatomic, strong) NSString *wxAppId;
// 魔窗 appid
@property(nonatomic, strong) NSString *mwAppId;
// 魔窗 key
@property(nonatomic, strong) NSString *mwKey;
// 闲聊 appid
@property(nonatomic, strong) NSString *xlAppId;
// 声网 appid
@property(nonatomic, strong) NSString *swAppId;
// QQ appid
@property(nonatomic, strong) NSString *qqAppId;
// 钉钉 appid
@property(nonatomic, strong) NSString *ddAppId;
// 聊呗 appid
@property(nonatomic, strong) NSString *lbAppId;
// 百度key
@property(nonatomic, strong) NSString *baiduAppKey;
// 高德key
@property(nonatomic, strong) NSString *gaodeAppKey;
// Bugly
@property(nonatomic, strong) NSString *buglyAppId;
// talkingdata
@property(nonatomic, strong) NSString *talkingdataAppId;

+ (ADD_CLASS(Sdk) *) ADD_FUN(getInstance);

- (void) ADD_FUN(registerSdk):(UIView *)view application:(UIApplication *)application launchOptions:(NSDictionary *)launchOptions;

- (void) ADD_FUN(getInfoPlist);

+ (void) ADD_FUN(registerWeChat);

+ (void) ADD_FUN(registerWeChatByAppId):(NSString*) appId;

+ (void) ADD_FUN(registerMagicWindow);

+ (void) ADD_FUN(registerMagicWindowByAppId): (NSString *) mwAppId key: (NSString *) mwKey;

+ (void) ADD_FUN(registerXianLiao);

+ (void) ADD_FUN(registerXianLiaoByAppId):(NSString*) appId;

+ (void) ADD_FUN(registerAgora);

+ (void) ADD_FUN(registerAgoraByAppId):(NSString*) appId;

+ (void) ADD_FUN(registerQQ);

+ (void) ADD_FUN(registerQQByAppId):(NSString *) appId;

+ (void) ADD_FUN(registerDingTalk);

+ (void) ADD_FUN(registerLiaoBe);

+ (void) ADD_FUN(registerLiaoBeByAppId):(NSString* ) appId;

+ (void) ADD_FUN(registerNIM);

+ (void) ADD_FUN(registerAliPush);

+ (void) ADD_FUN(registerTalkingData);

+ (void) ADD_FUN(registerBaiDu);

+ (void) ADD_FUN(registerBaiDuByAk):(NSString* ) ak;

+ (void) ADD_FUN(registerGaoDe);

+ (void) ADD_FUN(registerGaoDeByAk):(NSString* ) ak;

+ (BOOL) ADD_FUN(handleOpenURL):(NSURL *)url;

+ (BOOL) ADD_FUN(continueUserActivity):(NSUserActivity *)userActivity;

+ (void) ADD_FUN(didRegisterForRemoteNotificationsWithDeviceToken):(NSData *)deviceToken;

+ (void) ADD_FUN(didFailToRegisterForRemoteNotificationsWithError):(NSError *)error;

@end
