//
//  DDUtil.h
//  MyJSGame
//
//  Created by 张路欣 on 2017/2/18.
//
//

#import <Foundation/Foundation.h>
#import <DTShareKit/DTOpenAPI.h>
#import <DTShareKit/DTOpenKit.h>

@interface ADD_CLASS(DDUtil) : NSObject <DTOpenAPIDelegate>

- (ADD_CLASS(DDUtil) *) ADD_FUN(registerApp): (NSString *)app_id;

- (bool) ADD_FUN(handleOpenURL): (NSURL *)url;

+ (ADD_CLASS(DDUtil) *) ADD_FUN(getInstance);

+ (NSString *) ADD_FUN(getShareResult);

+ (void) ADD_FUN(clearShareResult);

+ (bool) ADD_FUN(isDDAppInstalled);

+ (void) ADD_FUN(shareText):(NSString *) WeChatMessage;

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType;

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType path:(NSString *)path;

+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType;

@end
