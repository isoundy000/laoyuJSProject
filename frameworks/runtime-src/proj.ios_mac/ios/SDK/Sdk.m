//
//  Sdk.m
//  ttqmdp-mobile
//
//  Created by 杨海金 on 2018/10/8.
//

#import "Sdk.h"
#import "NetWork/NetManager.h"
#import "AliPush/AliPushUtil.h"
#import "WeChat/WXUtil.h"
#import "MagicWindow/MWUtil.h"
#import "Agora/AgoraUtil.h"
#import "LiaoBei/LBUtil.h"
#import "DingDing/DDUtil.h"
#import "XianLiao/XianLiaoUtil.h"
#import "QQ/QQUtil.h"
#import "Baidu/BDLocationManager.h"
#import "Gaode/GDLocationManager.h"
#import "Nim/nimHeaders/NIMSDK.h"
//#import "TalkingDataGA.h"
#import <Bugly/Bugly.h>

@implementation ADD_CLASS(Sdk)

ADD_CLASS(Sdk) *_sdkInstance = nil;

+ (ADD_CLASS(Sdk) *) ADD_FUN(getInstance) {
    if (_sdkInstance == nil) {
        _sdkInstance = [[ADD_CLASS(Sdk) alloc] init];
    }
    return _sdkInstance;
}

- (void) ADD_FUN(registerSdk):(UIView *)view application:(UIApplication *)application launchOptions:(NSDictionary *)launchOptions {
    _view = view;
    _application = application;
    _launchOptions = launchOptions;
    [[ADD_CLASS(Sdk) ADD_FUN(getInstance)] ADD_FUN(getInfoPlist)];
    
    // 下面是必须先启动的
    [ADD_CLASS(Sdk) ADD_FUN(registerXianLiao)];
    [ADD_CLASS(Sdk) ADD_FUN(registerMagicWindow)];
    [ADD_CLASS(Sdk) ADD_FUN(registerAliPush)];
    [ADD_CLASS(Sdk) ADD_FUN(registerNetManager)];
    [ADD_CLASS(Sdk) ADD_FUN(registerBugly)];
    [ADD_CLASS(Sdk) ADD_FUN(registerDingTalk)];
    [ADD_CLASS(Sdk) ADD_FUN(registerNIM)];
//    [ADD_CLASS(Sdk) ADD_FUN(registerTalkingData)];
    //    [ADD_CLASS(Sdk) ADD_FUN(registerQQ)];
    //    [ADD_CLASS(Sdk) ADD_FUN(registerAgora)];
}

- (void) ADD_FUN(getInfoPlist) {
    NSDictionary *infoPlistDict = [[NSBundle mainBundle] infoDictionary];
    NSArray *urlTypesArr = infoPlistDict[@"CFBundleURLTypes"];
    if (urlTypesArr != nil) {
        for (NSUInteger i = 0; i < [urlTypesArr count]; i++) {
            NSDictionary *urlTypeDict = urlTypesArr[i];
            NSString *key = urlTypeDict[@"CFBundleURLName"];
            NSString *val = [urlTypeDict[@"CFBundleURLSchemes"] objectAtIndex:0];
            if ([key compare:@"weixin"] == 0) {
                _wxAppId = [[NSString alloc] initWithString:val];
            }
            if ([key compare:@"mwindow"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"mw"];
                if (array.count > 1) {
                    _mwAppId = [[NSString alloc] initWithString:array[1]];
                }
            }
            if ([key compare:@"mwkey"] == 0) {
                _mwKey = [[NSString alloc] initWithString:val];
            }
            if ([key compare:@"xianliao"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"xianliao"];
                if (array.count > 1) {
                    _xlAppId = [[NSString alloc] initWithString:array[1]];
                }
            }
            if ([key compare:@"agora"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"sw"];
                if (array.count > 1) {
                    _swAppId = [[NSString alloc] initWithString:array[1]];
                }
            }
            if ([key compare:@"tencentopenapi"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"tencent"];
                if (array.count > 1) {
                    _qqAppId = [[NSString alloc] initWithString:array[1]];
                }
            }
            if ([key compare:@"dingtalk"] == 0) {
                _ddAppId = [[NSString alloc] initWithString:val];
            }
            if ([key compare:@"liaobei"] == 0) {
                _lbAppId = [[NSString alloc] initWithString:val];
            }
            if ([key compare:@"bugly"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"bugly"];
                if (array.count > 1) {
                    _buglyAppId = [[NSString alloc] initWithString:array[1]];
                }
            }
            if ([key compare:@"talkingdata"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"talkingdata"];
                if (array.count > 1) {
                    _talkingdataAppId = [[NSString alloc] initWithString:array[1]];
                }
            }
            
            // 百度地图
            if ([key compare:@"baidu"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"baidu"];
                if (array.count > 1) {
                    _baiduAppKey = [[NSString alloc] initWithString:array[1]];
                }
            }
            
            // 高德地图
            if ([key compare:@"gaode"] == 0) {
                NSArray *array = [val componentsSeparatedByString:@"gaode"];
                if (array.count > 1) {
                    _gaodeAppKey = [[NSString alloc] initWithString:array[1]];
                }
            }
        }
    }
}

+ (void) ADD_FUN(registerWeChat) {
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] wxAppId] == nil) {
        NSLog(@"微信appid为空");
        return;
    }
    [ADD_CLASS(WXUtil) ADD_FUN(registerApp): [ADD_CLASS(Sdk) ADD_FUN(getInstance)].wxAppId];
}

+ (void) ADD_FUN(registerWeChatByAppId):(NSString*) appId {
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].wxAppId = appId;
    [ADD_CLASS(Sdk) ADD_FUN(registerWeChat)];
}

+ (void) ADD_FUN(registerMagicWindow) {
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] mwAppId] == nil) {
        NSLog(@"魔窗appid为空");
        return;
    }
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] mwKey] == nil) {
        NSLog(@"魔窗key为空");
        return;
    }
    [[ADD_CLASS(MWUtil) ADD_FUN(getInstance)] ADD_FUN(registerWMWithKey): [ADD_CLASS(Sdk) ADD_FUN(getInstance)].mwAppId];
    [[ADD_CLASS(MWUtil) ADD_FUN(getInstance)] ADD_FUN(registerWMlinkWithKey): [ADD_CLASS(Sdk) ADD_FUN(getInstance)].mwKey];
}

+ (void) ADD_FUN(registerMagicWindowByAppId): (NSString *) mwAppId key: (NSString *) mwKey {
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].mwAppId = mwAppId;
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].mwKey = mwKey;
    [ADD_CLASS(Sdk) ADD_FUN(registerMagicWindow)];
}

+ (void) ADD_FUN(registerXianLiao) {
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] xlAppId] == nil) {
        NSLog(@"闲聊appid为空");
        return;
    }
    [ADD_CLASS(XianLiaoUtil) ADD_FUN(registerApp):[ADD_CLASS(Sdk) ADD_FUN(getInstance)].xlAppId];
}

+ (void) ADD_FUN(registerXianLiaoByAppId):(NSString* ) appId {
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].xlAppId = appId;
    [ADD_CLASS(Sdk) ADD_FUN(registerXianLiao)];
}

+ (void) ADD_FUN(registerAgora) {
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] swAppId] == nil) {
        NSLog(@"声网appid为空");
        return;
    }
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)] ADD_FUN(registerAgroaWithKey):[[ADD_CLASS(Sdk) ADD_FUN(getInstance)] swAppId] view:[[ADD_CLASS(Sdk) ADD_FUN(getInstance)] view]];
}

+ (void)ADD_FUN(registerAgoraByAppId):(NSString*) appId {
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].swAppId = appId;
    [ADD_CLASS(Sdk) ADD_FUN(registerAgora)];
}

+ (void) ADD_FUN(registerQQ) {
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] qqAppId] == nil) {
        NSLog(@"微信appid为空");
        return;
    }
    [[ADD_CLASS(QQUtil) ADD_FUN(shareInstance)] ADD_FUN(registerApp):[ADD_CLASS(Sdk) ADD_FUN(getInstance)].qqAppId];
}

+ (void) ADD_FUN(registerQQByAppId):(NSString *) appId {
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].qqAppId = appId;
    [ADD_CLASS(Sdk) ADD_FUN(registerQQ)];
}

+ (void) ADD_FUN(registerDingTalk) {
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] ddAppId] == nil) {
        NSLog(@"钉钉appid为空");
        return;
    }
    [[ADD_CLASS(DDUtil) ADD_FUN(getInstance)] ADD_FUN(registerApp):[ADD_CLASS(Sdk) ADD_FUN(getInstance)].ddAppId];
}

+ (void) ADD_FUN(registerDingTalkByAppId):(NSString* ) appId {
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].ddAppId = appId;
    [ADD_CLASS(Sdk) ADD_FUN(registerDingTalk)];
}

+ (void) ADD_FUN(registerLiaoBe)
{
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] lbAppId] == nil) {
        NSLog(@"聊呗appid为空");
        return;
    }
    [[ADD_CLASS(LBUtil) ADD_FUN(getInstance)] ADD_FUN(registerApp):[ADD_CLASS(Sdk) ADD_FUN(getInstance)].lbAppId];
}

+ (void) ADD_FUN(registerLiaoBeByAppId):(NSString* ) appId
{
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].lbAppId = appId;
    [ADD_CLASS(Sdk) ADD_FUN(registerLiaoBe)];
}

+ (void) ADD_FUN(registerBaiDu)
{
    if ([ADD_CLASS(Sdk) ADD_FUN(getInstance)].baiduAppKey == nil)
    {
        NSLog(@"百度appKey为空");
        return;
    }
    [ADD_CLASS(BDLocationManager) ADD_FUN(init): [ADD_CLASS(Sdk) ADD_FUN(getInstance)].baiduAppKey];
}

+ (void) ADD_FUN(registerBaiDuByAk):(NSString* ) ak
{
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].baiduAppKey = ak;
    [ADD_CLASS(Sdk) ADD_FUN(registerBaiDu)];
}

+ (void) ADD_FUN(registerGaoDe)
{
    if ([ADD_CLASS(Sdk) ADD_FUN(getInstance)].gaodeAppKey == nil) {
        NSLog(@"高德appKey为空");
        return;
    }
    [ADD_CLASS(GDLocationManager) ADD_FUN(init):[ADD_CLASS(Sdk) ADD_FUN(getInstance)].gaodeAppKey];
}

+ (void) ADD_FUN(registerGaoDeByAk):(NSString* ) ak
{
    [ADD_CLASS(Sdk) ADD_FUN(getInstance)].gaodeAppKey = ak;
    [ADD_CLASS(Sdk) ADD_FUN(registerGaoDe)];
}

+ (BOOL) ADD_FUN(handleOpenURL): (NSURL *) url
{
    if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] wxAppId] != nil && [[url scheme] rangeOfString:[[ADD_CLASS(Sdk) ADD_FUN(getInstance)] wxAppId]].location != NSNotFound) {
        return [[ADD_CLASS(WXUtil) ADD_FUN(getInstance)] ADD_FUN(handleOpenURL):url];
    } else if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] lbAppId] != nil && [[url scheme] rangeOfString:[[ADD_CLASS(Sdk) ADD_FUN(getInstance)] lbAppId]].location != NSNotFound) {
        return [[ADD_CLASS(LBUtil) ADD_FUN(getInstance)] ADD_FUN(handleOpenURL):url];
    } else if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] xlAppId] != nil && [[url scheme] rangeOfString:[[ADD_CLASS(Sdk) ADD_FUN(getInstance)] xlAppId]].location != NSNotFound) {
        return [[ADD_CLASS(XianLiaoUtil) ADD_FUN(getInstance)] ADD_FUN(handleOpenURL):url];
    } else if ([[ADD_CLASS(Sdk) ADD_FUN(getInstance)] ddAppId] != nil && [[url scheme] rangeOfString:[[ADD_CLASS(Sdk) ADD_FUN(getInstance)] ddAppId]].location != NSNotFound) {
        return [[ADD_CLASS(DDUtil) ADD_FUN(getInstance)] ADD_FUN(handleOpenURL):url];
    } else if ([[url scheme] rangeOfString:@"yayayouxi"].location != NSNotFound) {
        [[ADD_CLASS(MWUtil) ADD_FUN(getInstance)] ADD_FUN(routeMLink):url];
        return YES;
    }
    return YES;
}

+ (BOOL) ADD_FUN(continueUserActivity):(NSUserActivity *)userActivity
{
    return [[ADD_CLASS(MWUtil) ADD_FUN(getInstance)] ADD_FUN(continueUserActivity):userActivity];
}

+ (void) ADD_FUN(didRegisterForRemoteNotificationsWithDeviceToken):(NSData *) deviceToken
{
    [[ADD_CLASS(AliPushUtil) ADD_FUN(getInstance)] ADD_FUN(didRegisterForRemoteNotificationsWithDeviceToken):deviceToken];
}

+ (void) ADD_FUN(didFailToRegisterForRemoteNotificationsWithError):(NSError *) error
{
    [[ADD_CLASS(AliPushUtil) ADD_FUN(getInstance)] ADD_FUN(didFailToRegisterForRemoteNotificationsWithError):error];
}

+ (void) ADD_FUN(registerAliPush)
{
    [[ADD_CLASS(AliPushUtil) ADD_FUN(getInstance)] ADD_FUN(registerApp): [ADD_CLASS(Sdk) ADD_FUN(getInstance)].application];
    [[ADD_CLASS(AliPushUtil) ADD_FUN(getInstance)] ADD_FUN(initCloudPush):[ADD_CLASS(Sdk) ADD_FUN(getInstance)].launchOptions];
}

+ (void) ADD_FUN(registerTalkingData)
{
//    [TalkingDataGA onStart:[ADD_CLASS(Sdk) ADD_FUN(getInstance)].talkingdataAppId withChannelId:@"AppStore"];
}

+ (void) ADD_FUN(registerNIM)
{
    [[NIMSDK sharedSDK] registerWithAppID:@"" cerName:nil];
    [[[NIMSDK sharedSDK] mediaManager] setDeactivateAudioSessionAfterComplete:NO];
    [[[NIMSDK sharedSDK] mediaManager] setNeedProximityMonitor:NO];
}

+ (void) ADD_FUN(registerNetManager)
{
    [[[ADD_CLASS(NetManager) alloc] autorelease] ADD_FUN(initManager)];
}

+ (void) ADD_FUN(registerBugly)
{
    [Bugly startWithAppId:[ADD_CLASS(Sdk) ADD_FUN(getInstance)].buglyAppId];
}
@end
