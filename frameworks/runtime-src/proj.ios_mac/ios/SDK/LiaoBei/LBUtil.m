#import "LBUtil.h"

#import <UIKit/UIKit.h>

NSString *LIAOBEI_APP_ID;

@implementation ADD_CLASS(LBUtil)

//int WXOnRespType
//int WXOnRespErrCode;
NSString *LBLoginCode;

NSMutableDictionary *cxdict = nil;
ADD_CLASS(LBUtil) *lbUtil = nil;

+ (ADD_CLASS(LBUtil) *) ADD_FUN(getInstance) {
    if (lbUtil == nil) {
        lbUtil = [[ADD_CLASS(LBUtil) alloc] init];
    }
    return lbUtil;
}
- (void) ADD_FUN(registerApp): (NSString *)appid {
    LIAOBEI_APP_ID = appid;
    cxdict = [[NSMutableDictionary alloc] init];
    [LBSDKApi registerClientId:LIAOBEI_APP_ID];
}

+ (bool) ADD_FUN(isLBAppInstalled) {
    return [LBSDKApi isLiaobeiAppInstalled];
}

+ (NSString *) ADD_FUN(getLiaoBeiAppId) {
    return LIAOBEI_APP_ID;
}

+ (void) ADD_FUN(setLBOnRespResult):(NSString *)k v:(int)v {
    [cxdict setValue:[NSNumber numberWithInt:v] forKey:k];
}

+ (bool) ADD_FUN(hasLBOnRespResult):(NSString *)k {
    return [[cxdict allKeys] containsObject:k];
}

+ (int) ADD_FUN(getLBOnRespResult):(NSString *)k {
    return [[cxdict objectForKey:k] intValue];
}

+ (void) ADD_FUN(redirectToLBLogin) {
    LBSDKAuthReq* req =[[[LBSDKAuthReq alloc] init] autorelease];
//    req.scope = @"snsapi_userinfo" ;
    [LBSDKApi sendAuthReq:req];
}

+ (NSString *) ADD_FUN(getLBLoginCode) {
    return LBLoginCode;
}

+ (void) ADD_FUN(setLBLoginCode): (NSString *)code {
    LBLoginCode = [[NSString alloc] initWithString:code];
}

+ (void) ADD_FUN(wxPay): (NSString *)partnerId prepayId:(NSString *) prepayId package:(NSString *)package nonceStr:(NSString *)nonceStr timeStamp:(NSString *)timeStamp sign:(NSString *)sign
{
//    PayReq *request = [[[PayReq alloc] init] autorelease];
//    request.partnerId = partnerId;
//    request.prepayId= prepayId;
//    request.package = package;
//    request.nonceStr= nonceStr;
//    request.timeStamp= [timeStamp intValue];
//    request.sign= sign;
//    [WXApi sendReq:request];
}

+ (void) ADD_FUN(shareText):(NSString *)text sceneType:(NSNumber *)sceneType
{
    LBSDKTextMessage* msg = [[[LBSDKTextMessage alloc] init]autorelease];
    msg.text  = text;
    LBSDKShareReq* shareReq = [[[LBSDKShareReq alloc] init]autorelease];
    shareReq.message = msg;
    shareReq.state = @"9999";
//    print("send share text req for state: \(shareReq.state!)")
    Boolean ret = [LBSDKApi sendShareReq:shareReq];
    NSLog(@"分享完成");
    NSLog(@"%@",ret?@"YES":@"NO");
}

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType
{
    LBSDKLinkMessage* msg = [[[LBSDKLinkMessage alloc] init]autorelease];
    msg.title = title;
    msg.url = url;
    msg.desc = description;
    msg.icon = [UIImage imageNamed:@"res/icon.png"];
    LBSDKShareReq* shareReq = [[[LBSDKShareReq alloc] init]autorelease];
    shareReq.message = msg;
    shareReq.state = @"9999";
    [LBSDKApi sendShareReq:shareReq];
}

+ (void) ADD_FUN(shareUrlWithIcon):(NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType path:(NSString *)path
{
    LBSDKLinkMessage* msg = [[[LBSDKLinkMessage alloc] init]autorelease];
    msg.title = title;
    msg.url = url;
    msg.desc = description;
    msg.icon = [UIImage imageNamed:path];
    LBSDKShareReq* shareReq = [[[LBSDKShareReq alloc] init]autorelease];
    shareReq.message = msg;
    shareReq.state = @"9999";
    [LBSDKApi sendShareReq:shareReq];
}

+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType
{
    LBSDKImageMessage* msg = [[[LBSDKImageMessage alloc] init]autorelease];
    NSData * imageData = [NSData dataWithContentsOfFile:[[filePath stringByAppendingString:@"/"] stringByAppendingString:imageName]];
    UIImage* image = [UIImage imageWithData:imageData];
//    UIImage* image = [UIImage imageNamed:imageName];
    msg.image = image;
//    msg.caption = @"这是一个可选字段";
    LBSDKShareReq* shareReq = [[[LBSDKShareReq alloc] init]autorelease];
    shareReq.message = msg;
    shareReq.state = @"9999";
    //    print("send share text req for state: \(shareReq.state!)")
    Boolean ret = [LBSDKApi sendShareReq:shareReq];
    NSLog(@"分享完成");
    NSLog(@"%@",ret?@"YES":@"NO");
}

+ (UIImage*) ADD_FUN(imageCompressWithSimple): (UIImage*)image scaledToSize:(CGSize)size
{
    UIGraphicsBeginImageContext(size);
    [image drawInRect:CGRectMake(0,0,size.width,size.height)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
}

- (void) onShareResp:(LBSDKShareResp *)resp{
    NSLog(@"分享回调: %@", resp.errStr);
}
- (void)onAuthResp:(LBSDKAuthResp *)resp{
    if (resp.code != nil) {
        [ADD_CLASS(LBUtil) ADD_FUN(setLBLoginCode):[[NSString alloc] initWithString: resp.code]];
    } else {
        [ADD_CLASS(LBUtil) ADD_FUN(setLBLoginCode):[[[NSString alloc] initWithString:@"null"] autorelease]];
    }
}

- (bool) ADD_FUN(handleOpenURL): (NSURL *) url
{
    return [LBSDKApi handleOpenURL: url delegate:self];
}

@end
