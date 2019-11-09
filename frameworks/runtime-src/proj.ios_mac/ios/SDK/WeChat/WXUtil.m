#import "WXUtil.h"

#import "WXApi.h"

//extern NSString *WEIXIN_APP_ID;

@implementation ADD_CLASS(WXUtil)

//int WXOnRespType
//int WXOnRespErrCode;
NSString *WEIXIN_APP_ID;
NSString *WXLoginCode;

NSMutableDictionary *dict = nil;

ADD_CLASS(WXUtil) *_wxInstance = nil;
NSString *miniproRommid;

+ (ADD_CLASS(WXUtil) *) ADD_FUN(getInstance) {
    if (_wxInstance == nil) {
        _wxInstance = [[ADD_CLASS(WXUtil) alloc] init];
    }
    return _wxInstance;
}

- (bool) ADD_FUN(handleOpenURL):(NSURL *)url
{
    return [WXApi handleOpenURL:url delegate:self];
}

+ (void) ADD_FUN(registerApp): (NSString *)appid {
    WEIXIN_APP_ID = appid;
    dict = [[NSMutableDictionary alloc] init];
    [WXApi registerApp:WEIXIN_APP_ID];
}

+ (bool) ADD_FUN(isWXAppInstalled) {
    return [WXApi isWXAppInstalled];
}

+ (NSString *) ADD_FUN(getWeixinAppId) {
    return WEIXIN_APP_ID;
}

+ (void) ADD_FUN(setWXOnRespResult): (NSString *)k v:(int)v {
    [dict setValue:@(v) forKey:k];
}

+ (bool) ADD_FUN(hasWXOnRespResult): (NSString *)k {
    return [[dict allKeys] containsObject:k];
}

+ (int) ADD_FUN(getWXOnRespResult):(NSString *)k {
    return [dict[k] intValue];
}

+ (void) ADD_FUN(redirectToWeixinLogin) {
    SendAuthReq *req = [[[SendAuthReq alloc] init] autorelease];
    req.scope = @"snsapi_userinfo";
    [WXApi sendReq:req];
}

+ (NSString *) ADD_FUN(getWXLoginCode) {
    return WXLoginCode;
}

+ (void) ADD_FUN(setWXLoginCode):(NSString *)code {
    WXLoginCode = [[NSString alloc] initWithString:code];
}

//+ (void) wxPay:(NSString *)partnerId prepayId:(NSString *) prepayId package:(NSString *)package nonceStr:(NSString *)nonceStr timeStamp:(NSString *)timeStamp sign:(NSString *)sign
//{
//    PayReq *request = [[[PayReq alloc] init] autorelease];
//    request.partnerId = partnerId;
//    request.prepayId= prepayId;
//    request.package = package;
//    request.nonceStr= nonceStr;
//    request.timeStamp= [timeStamp intValue];
//    request.sign= sign;
//    [WXApi sendReq:request];
//}

+ (void) ADD_FUN(shareText):(NSString *)text sceneType:(NSNumber *)sceneType {
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.text = text;
    req.bText = YES;
    req.scene = [sceneType intValue];
    [WXApi sendReq:req];
}

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType {
    [ADD_CLASS(WXUtil) ADD_FUN(shareUrlWithIcon):url title:title description:description sceneType:sceneType path:@"res/icon.png"];
}

+ (void) ADD_FUN(shareUrlWithIcon): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType path:(NSString *)path {
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = description;
    UIImage *appIcon = [UIImage imageNamed:path];

    [message setThumbImage:appIcon];

    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = url;

    message.mediaObject = ext;

    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = [sceneType intValue];

    [WXApi sendReq:req];
}

+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType {
    WXMediaMessage *message = [WXMediaMessage message];

    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfFile:[[filePath stringByAppendingString:@"/"] stringByAppendingString:imageName]];

    UIImage *image = [UIImage imageWithData:ext.imageData];
    ext.imageData = UIImageJPEGRepresentation(image, 0.6f);

    message.mediaObject = ext;

    CGSize size;
    size.width = 300;
    size.height = (int) (300 / (double) image.size.width * image.size.height);
    UIImage *thunbImage = [ADD_CLASS(WXUtil) ADD_FUN(imageCompressWithSimple): image scaledToSize:size];
    [message setThumbImage:thunbImage];

    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = [sceneType intValue];

    [WXApi sendReq:req];
}

+ (UIImage *) ADD_FUN(imageCompressWithSimple): (UIImage *)image scaledToSize:(CGSize)size {
    UIGraphicsBeginImageContext(size);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
}

-(void) onReq:(BaseReq*) req{
    if ([req isKindOfClass:[GetMessageFromWXReq class]]) {
        
    } else if ([req isKindOfClass:[ShowMessageFromWXReq class]]) {
        
    } else if ([req isKindOfClass:[LaunchFromWXReq class]]) {
        LaunchFromWXReq *launchFromWXReq = (LaunchFromWXReq *) req;
        [ADD_CLASS(WXUtil) ADD_FUN(setminiRroRoomId):[[[NSString alloc] initWithString:launchFromWXReq.message.messageExt] autorelease]];
    }
}

- (void) onResp: (BaseResp *) resp{
    if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
        SendMessageToWXResp *sendMessageToWXResp = (SendMessageToWXResp *) resp;
        [ADD_CLASS(WXUtil) ADD_FUN(setWXOnRespResult):@"SendMessageToWXResp" v:sendMessageToWXResp.errCode];
        
    } else if ([resp isKindOfClass:[SendAuthResp class]]) {
        SendAuthResp *sendAuthResp = (SendAuthResp *) resp;
        if (sendAuthResp.code != nil) {
            [ADD_CLASS(WXUtil) ADD_FUN(setWXLoginCode):[[[NSString alloc] initWithString:sendAuthResp.code] autorelease]];
        } else {
            [ADD_CLASS(WXUtil) ADD_FUN(setWXLoginCode):[[[NSString alloc] initWithString:@"null"] autorelease]];
        }
    } else if ([resp isKindOfClass:[AddCardToWXCardPackageResp class]]) {
        //        AddCardToWXCardPackageResp *addCardToWXCardPackageResp = (AddCardToWXCardPackageResp *)resp;
        
    } else if ([resp isKindOfClass:[WXChooseCardResp class]]) {
        //        WXChooseCardResp *wXChooseCardResp = (WXChooseCardResp *)resp;
        
    }else if ([resp isKindOfClass:[LaunchFromWXReq class]]) {
        LaunchFromWXReq *launchFromWXReq = (LaunchFromWXReq *) resp;
        [ADD_CLASS(WXUtil) ADD_FUN(setminiRroRoomId):[[[NSString alloc] initWithString:launchFromWXReq.message.messageExt] autorelease]];
    }
    //    else if ([resp isKindOfClass:[PayResp class]]){
    //        PayResp *response = (PayResp *)resp;
    //        [WXUtil setWXOnRespResult:@"PayResp" v:response.errCode];
    //        if(response.errCode == 0)
    //        {
    //            [WXUtil setWxPayCode:@"sucess"];
    //        }
    //        else
    //        {
    //            [WXUtil setWxPayCode:@"failed"];
    //        }
    //    }
}

+ (NSString *) ADD_FUN(getminiRroRoomId) {
    return miniproRommid;
}

+ (void) ADD_FUN(setminiRroRoomId):(NSString *)code {
    miniproRommid = [[NSString alloc] initWithString:code];
}

+ (void) ADD_FUN(shareMiniPro):(NSString *)url title:(NSString *)title description:(NSString *)description hdImagePath:(NSString *)hdImagePath userName:(NSString *)userName path:(NSString *)path miniProgramType:(NSNumber* )miniProgramType  {
    [ADD_CLASS(WXUtil) ADD_FUN(shareSmallAppWithIcon):url title:title description:description hdImagePath:hdImagePath userName:userName path:path miniProgramType:miniProgramType];
}

+ (void) ADD_FUN(shareSmallAppWithIcon):(NSString *)url title:(NSString *)title description:(NSString *)description hdImagePath:(NSString *)hdImagePath userName:(NSString *)userName path:(NSString *)path miniProgramType:(NSNumber* )miniProgramType
{
    NSData *thumbData = UIImageJPEGRepresentation([UIImage imageNamed:hdImagePath], 0.7);
    WXMiniProgramObject *wxMiniProgramObject = [WXMiniProgramObject object];
    wxMiniProgramObject.webpageUrl = url;
    wxMiniProgramObject.userName = userName;
    wxMiniProgramObject.path = path;
    wxMiniProgramObject.hdImageData = thumbData;
    wxMiniProgramObject.miniProgramType = [miniProgramType intValue];;
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = description;
    message.mediaObject = wxMiniProgramObject;
    message.thumbData = nil;
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.message = message;
    req.scene = WXSceneSession;
    [WXApi sendReq:req];
}

@end
