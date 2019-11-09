//
//  XianLiao.h
//  MyJSGame
//
//  Created by dabai on 2017/8/30.
//
//
//
//#ifndef XianLiao_h
//#define XianLiao_h
//
//
//#endif /* XianLiao_h */

#import <Foundation/Foundation.h>
#import "SugramApiManager.h"
#import "SugramApiObject.h"

@interface ADD_CLASS(XianLiaoUtil) : NSObject

+ (ADD_CLASS(XianLiaoUtil) *) ADD_FUN(getInstance);

+ (void) ADD_FUN(registerApp): (NSString *) appid;

- (bool) ADD_FUN(handleOpenURL): (NSURL *) url;

+ (bool) ADD_FUN(isXianLiaoAppInstalled);

+ (NSString *) ADD_FUN(getXianLiaoAppId);

+ (NSString *) ADD_FUN(getXianLiaoRoomId);

+ (NSString *) ADD_FUN(getXianLiaoRoomData);

+ (NSString *) ADD_FUN(getXianLiaoLoginCode);

+ (NSString *) ADD_FUN(getXianLiaoLoginState);

+ (void) ADD_FUN(setXianLiaoLoginCode): (NSString *)id;

+ (void) ADD_FUN(clearRoomId);

+ (void) ADD_FUN(login);

+ (void) ADD_FUN(shareText): (NSString *)text;

+ (void) ADD_FUN(shareUrlWithIcon): (NSString *)url;

+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName;

+ (void) ADD_FUN(shareGame): (NSString *)roomId title:(NSString *)title text:(NSString *)text;

+ (void) ADD_FUN(shareGame):(NSString *)roomId title:(NSString *)title text:(NSString *)text path:(NSString *) path;

@end
