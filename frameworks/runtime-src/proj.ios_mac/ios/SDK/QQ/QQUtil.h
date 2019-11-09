//
//  QQUtil
//  MyJSGame
//
//  Created by 张路欣 on 2017/5/31.
//
//

#import <Foundation/Foundation.h>
#import <TencentOpenAPI/TencentOAuth.h>
#import <TencentOpenAPI/TencentOAuthObject.h>
#import <TencentOpenAPI/TencentApiInterface.h>
#import "TencentOpenAPI/QQApiInterface.h"


@interface ADD_CLASS(QQUtil) : NSObject <TencentSessionDelegate>

+ (ADD_CLASS(QQUtil) *) ADD_FUN(shareInstance);

- (void) ADD_FUN(registerApp): (NSString *)qq_app_id;

+ (bool) ADD_FUN(isQQAppInstalled);

+ (NSString *) ADD_FUN(getQQToken);

+ (NSString *) ADD_FUN(getQQOpenID);

+ (void) ADD_FUN(redirectToQQLogin);

+ (NSString *) ADD_FUN(getQQUserInfo);

+ (NSString *) ADD_FUN(getShareResult);

+ (void) ADD_FUN(clearShareResult);

+ (void) ADD_FUN(shareText): (NSString *)WeChatMessage;

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType;

+ (void) ADD_FUN(shareUrlWithIcon): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType path:(NSString *)path;

+ (void) ADD_FUN(sharePic):(NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType;

@end
