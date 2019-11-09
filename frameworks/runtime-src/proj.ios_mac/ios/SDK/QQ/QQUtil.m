//
//  QQUtil
//  MyJSGame
//
//  Created by 张路欣 on 2017/5/31.
//
//

#import "QQUtil.h"

@implementation ADD_CLASS(QQUtil)

TencentOAuth *tencentOAuth;

ADD_CLASS(QQUtil) *qqInstance = nil;

NSString *qqToken;
NSString *qqOpenID;
NSString *qqUserInfo = @"";

NSString *shareQQResult = nil;

+ (ADD_CLASS(QQUtil) *) ADD_FUN(shareInstance) {
    if (qqInstance == nil) {
        qqInstance = [[ADD_CLASS(QQUtil) alloc] init];
    }
    return qqInstance;
}

- (void) ADD_FUN(registerApp): (NSString *)qq_app_id {
    tencentOAuth = [[TencentOAuth alloc] initWithAppId:qq_app_id andDelegate:self];
}

- (void)tencentDidLogin {
    if (tencentOAuth.accessToken && 0 != [tencentOAuth.accessToken length]) {
        qqToken = tencentOAuth.accessToken;
        qqOpenID = tencentOAuth.openId;
        [tencentOAuth getUserInfo];
    }
}

- (void)getUserInfoResponse:(APIResponse *)response {
    qqUserInfo = [[NSString alloc] initWithString:response.message];
}

- (void)tencentDidNotLogin:(BOOL)cancelled {
    if (cancelled) {
        NSLog(@"用户取消登录");
    } else {
        NSLog(@"非用户取消登录");
    }
    qqToken = nil;
    qqOpenID = nil;
}

- (void)tencentDidNotNetWork {
    NSLog(@"无网络连接，请设置网络");
}

- (void)handleSendResult:(QQApiSendResultCode)sendResult {
    switch (sendResult) {
        case EQQAPISENDSUCESS:
            shareQQResult = @"ok";
            break;
        case EQQAPIAPPNOTREGISTED:
        case EQQAPIMESSAGECONTENTINVALID:
        case EQQAPIMESSAGECONTENTNULL:
        case EQQAPIMESSAGETYPEINVALID:
        case EQQAPIQQNOTINSTALLED:
        case EQQAPIQQNOTSUPPORTAPI:
        case EQQAPISENDFAILD:
        case EQQAPIVERSIONNEEDUPDATE:
        default:
            shareQQResult = @"failed";
            break;
    }
}

+ (bool) ADD_FUN(isQQAppInstalled) {
    return [TencentOAuth iphoneQQInstalled];
}

+ (NSString *) ADD_FUN(getQQToken) {
    return qqToken;
}

+ (NSString *) ADD_FUN(getQQOpenID) {
    return qqOpenID;
}

+ (void) ADD_FUN(redirectToQQLogin) {
//    NSArray *permissions = [NSArray arrayWithObjects:
//            kOPEN_PERMISSION_GET_USER_INFO,
////                            kOPEN_PERMISSION_GET_SIMPLE_USER_INFO,
////                            kOPEN_PERMISSION_ADD_ALBUM,
////                            kOPEN_PERMISSION_ADD_ONE_BLOG,
////                            kOPEN_PERMISSION_ADD_SHARE,
////                            kOPEN_PERMISSION_ADD_TOPIC,
////                            kOPEN_PERMISSION_CHECK_PAGE_FANS,
////                            kOPEN_PERMISSION_GET_INFO,
////                            kOPEN_PERMISSION_GET_OTHER_INFO,
////                            kOPEN_PERMISSION_LIST_ALBUM,
////                            kOPEN_PERMISSION_UPLOAD_PIC,
////                            kOPEN_PERMISSION_GET_VIP_INFO,
////                            kOPEN_PERMISSION_GET_VIP_RICH_INFO,
//                    nil];
    NSArray *permissions = @[kOPEN_PERMISSION_GET_USER_INFO];
    [tencentOAuth authorize:permissions inSafari:NO];
}

+ (NSString *) ADD_FUN(getQQUserInfo) {
    return qqUserInfo;
}

+ (NSString *) ADD_FUN(getShareResult) {
    return shareQQResult;
}

+ (void) ADD_FUN(clearShareResult) {
    shareQQResult = nil;
}

+ (void) ADD_FUN(shareText): (NSString *)WeChatMessage {
    //开发者分享的文本内容
    QQApiTextObject *txtObj = [QQApiTextObject objectWithText:WeChatMessage];
    SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:txtObj];
    //将内容分享到qq
    QQApiSendResultCode sent = [QQApiInterface sendReq:req];
    [[ADD_CLASS(QQUtil) ADD_FUN(shareInstance)] handleSendResult:sent];
}

+ (void) ADD_FUN(shareUrl):(NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType {
    [ADD_CLASS(QQUtil) ADD_FUN(shareUrlWithIcon):url title:title description:description sceneType:sceneType path:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"res/icon.png"]];
}

+ (void) ADD_FUN(shareUrlWithIcon):(NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType path:(NSString *)path {
    NSData *data = [NSData dataWithContentsOfFile:path];
    QQApiNewsObject *newsObj = [QQApiNewsObject
            objectWithURL:[NSURL URLWithString:url]
                    title:title
              description:description
         previewImageData:data];
    SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:newsObj];
    QQApiSendResultCode sent;
    if ([sceneType intValue] == 0) {
        //将内容分享到qq
        sent = [QQApiInterface sendReq:req];
    } else {
        //将内容分享到qzone
        sent = [QQApiInterface SendReqToQZone:req];
    }
    [[ADD_CLASS(QQUtil) ADD_FUN(shareInstance)] handleSendResult:sent];
}
+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType {
    //开发者分享图片数据
    NSData *imgData = [NSData dataWithContentsOfFile:[[filePath stringByAppendingString:@"/"] stringByAppendingString:imageName]];
//    UIImage *imagecompress = [UIImage imageWithData:imgData];
//    NSData *imgData1 = UIImageJPEGRepresentation(imagecompress, 0.6f);
    
    UIImage *image = [UIImage imageWithData:imgData];
    CGSize size;
    size.width = 300;
    size.height = (int) (300 / (double) image.size.width * image.size.height);
    UIImage *thunbImage = [ADD_CLASS(QQUtil) ADD_FUN(imageCompressWithSimple):image scaledToSize:size];
    NSData *thunbImageData = UIImagePNGRepresentation(thunbImage);
    
    QQApiImageObject *imgObj = [QQApiImageObject objectWithData:imgData
                                               previewImageData:thunbImageData
                                                          title:@""
                                                    description:@""];
    SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:imgObj];
    //将内容分享到qq
    QQApiSendResultCode sent = [QQApiInterface sendReq:req];
    [[ADD_CLASS(QQUtil) ADD_FUN(shareInstance)] handleSendResult:sent];
}

+ (UIImage *) ADD_FUN(imageCompressWithSimple): (UIImage *)image scaledToSize:(CGSize)size {
    UIGraphicsBeginImageContext(size);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
}
//+ (void)sharePic:(NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType {
//    //开发者分享图片数据
//    NSData *imgData = [NSData dataWithContentsOfFile:[[filePath stringByAppendingString:@"/"] stringByAppendingString:imageName]];
////    UIImage *image = [UIImage imageWithData:imgData];
////    NSData *imgData1 = UIImageJPEGRepresentation(image, 0.6f);
//    QQApiImageObject *imgObj = [QQApiImageObject objectWithData:imgData
//                                               previewImageData:imgData
//                                                          title:@""
//                                                    description:@""];
//
//
//
//    SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:imgObj];
//
//    //将内容分享到qq
//    QQApiSendResultCode sent = [QQApiInterface sendReq:req];
//    [[QQUtil shareInstance] handleSendResult:sent];
//}

@end
