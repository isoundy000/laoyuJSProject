//
//  XianLiaoUtil.m
//  MyJSGame
//
//  Created by dabai on 2017/8/30.
//
//

//#import <Foundation/Foundation.h>


#import "XianLiaoUtil.h"

@implementation ADD_CLASS(XianLiaoUtil)

NSString *XIAN_LIAO_APP_ID;
NSString *XIAN_LIAO_LoginCode;
NSString *XIAN_LIAO_LoginState;
NSString *XIAN_LIAO_RoomData;
NSString *XIAN_LIAO_RoomId;

ADD_CLASS(XianLiaoUtil) *_xlInstance = nil;

+ (ADD_CLASS(XianLiaoUtil) *) ADD_FUN(getInstance)
{
    if (_xlInstance == nil) {
        _xlInstance = [[ADD_CLASS(XianLiaoUtil) alloc] init];
    }
    return _xlInstance;
}

//闲聊注册
+ (void) ADD_FUN(registerApp):(NSString *)appid {
    XIAN_LIAO_APP_ID = appid;
    [SugramApiManager registerApp:XIAN_LIAO_APP_ID];
    [SugramApiManager showLog:true];
    [SugramApiManager getGameFromSugram:^(NSString *roomToken, NSString *roomId, NSNumber *openId) {
        XIAN_LIAO_RoomId = roomId;
        XIAN_LIAO_RoomData = [NSString stringWithFormat:@"roomToken:%@, roomId:%@, openId:%@", roomToken, roomId, openId];
    }];
}

- (bool) ADD_FUN(handleOpenURL):(NSURL *)url
{
    return [SugramApiManager handleOpenURL:url];
}

//判断是否安装了闲聊
+ (bool) ADD_FUN(isXianLiaoAppInstalled) {
    return [SugramApiManager isInstallSugram];
}

//获取闲聊AppId
+ (NSString *) ADD_FUN(getXianLiaoAppId) {
    return XIAN_LIAO_APP_ID;
}

//获取闲聊房间ID
+ (NSString *) ADD_FUN(getXianLiaoRoomId) {
    return XIAN_LIAO_RoomId;
}

+ (void) ADD_FUN(clearRoomId) {
    XIAN_LIAO_RoomId = nil;
}


//获取闲聊房间信息
+ (NSString *) ADD_FUN(getXianLiaoRoomData) {
    return XIAN_LIAO_RoomData;
}

//获取闲聊登陆code
+ (NSString *) ADD_FUN(getXianLiaoLoginCode) {
    return XIAN_LIAO_LoginCode;
}

//获取闲聊登陆状态
+ (NSString *) ADD_FUN(getXianLiaoLoginState) {
    return XIAN_LIAO_LoginState;
}


//设置闲聊登陆code
+ (void) ADD_FUN(setXianLiaoLoginCode): (NSString *)code {
    XIAN_LIAO_LoginCode = [[NSString alloc] initWithString:code];
}


//分享文本
+ (void) ADD_FUN(shareText): (NSString *)text {
    if ([SugramApiManager isInstallSugram]) {
        SugramShareTextObject *textObject = [[[SugramShareTextObject alloc] init] autorelease];
        textObject.text = text;
        [SugramApiManager share:textObject fininshBlock:^(SugramShareCallBackType callBackType) {
//            NSLog(@"分享游戏结果:%ld", (long)callBackType);
        }];
    }
}

//分享图片Url
+ (void) ADD_FUN(shareUrlWithIcon): (NSString *)url {
    if ([SugramApiManager isInstallSugram]) {
        SugramShareImageObject *imageObject = [[[SugramShareImageObject alloc] init] autorelease];
        imageObject.imageUrl = url;
        [SugramApiManager share:imageObject fininshBlock:^(SugramShareCallBackType callBackType) {
//            NSLog(@"分享游戏结果:%ld", (long)callBackType);
        }];
    }

}

//分享游戏截图
+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName {
    if ([SugramApiManager isInstallSugram]) {
        SugramShareImageObject *imageObject = [[[SugramShareImageObject alloc] init] autorelease];
        imageObject.imageData = [NSData dataWithContentsOfFile:[[filePath stringByAppendingString:@"/"] stringByAppendingString:imageName]];
        [SugramApiManager share:imageObject fininshBlock:^(SugramShareCallBackType callBackType) {
//            NSLog(@"分享回调结果:%ld", (long)callBackType);
        }];
    }

}

//分享游戏
+ (void) ADD_FUN(shareGame): (NSString *)roomId title:(NSString *)title text:(NSString *)text {
    [ADD_CLASS(XianLiaoUtil) ADD_FUN(shareGame):roomId title:title text:text path:@"res/icon.png"];
}

+ (void) ADD_FUN(shareGame): (NSString *)roomId title:(NSString *)title text:(NSString *)text path:(NSString *) path {
    if ([SugramApiManager isInstallSugram]) {
        SugramShareGameObject *game = [[[SugramShareGameObject alloc] init] autorelease];
        game.roomToken = roomId;
        game.roomId = roomId;
        game.title = title;
        game.text = text;
        game.imageData = UIImagePNGRepresentation([UIImage imageNamed:path]);
        [SugramApiManager share:game fininshBlock:^(SugramShareCallBackType callBackType) {
            //            NSLog(@"分享回调结果:%ld", (long)callBackType);
        }];
    }
}

//拉起闲聊登陆 
+ (void) ADD_FUN(login) {
    [SugramApiManager registerApp:XIAN_LIAO_APP_ID];
    [SugramApiManager loginState:@"sugram_login_state" fininshBlock:^(SugramLoginCallBackType callBackType, NSString *code, NSString *state) {
        if (code) {
            XIAN_LIAO_LoginCode = [[NSString alloc] initWithString:code];
            XIAN_LIAO_LoginState = [NSString stringWithFormat:@"%ld", (long) callBackType];
        } else {
            XIAN_LIAO_LoginState = @"-1";
        }
//        NSLog(@"callBackType:%lu, code:%@, state:%@", (unsigned long)callBackType, code, state);
    }];
}

+ (UIImage *) ADD_FUN(imageCompressWithSimple):(UIImage *)image scaledToSize:(CGSize)size {
    UIGraphicsBeginImageContext(size);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
}
@end

