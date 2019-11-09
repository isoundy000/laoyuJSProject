#import <LBSDK/LBSDK.h>


@interface ADD_CLASS(LBUtil) : NSObject <LBSDKApiDelegate>

+ (ADD_CLASS(LBUtil) *) ADD_FUN(getInstance);

- (void) ADD_FUN(registerApp): (NSString *)appid;

- (bool) ADD_FUN(handleOpenURL): (NSURL *) url;

+ (bool) ADD_FUN(isLBAppInstalled);

+ (NSString *) ADD_FUN(getLiaoBeiAppId);

+ (void) ADD_FUN(redirectToLBLogin);

+ (NSString *) ADD_FUN(getLBLoginCode);

+ (void) ADD_FUN(setLBLoginCode):(NSString *)id;

+ (bool) ADD_FUN(hasLBOnRespResult):(NSString *)k;

+ (int) ADD_FUN(getLBOnRespResult):(NSString *)k;

+ (void) ADD_FUN(setLBOnRespResult):(NSString *)k v:(int)v;

+ (void) ADD_FUN(wxPay):(NSString *)partnerId prepayId:(NSString *) prepayId package:(NSString *)package nonceStr:(NSString *)nonceStr timeStamp:(NSString *)timeStamp sign:(NSString *)sign;

@end
