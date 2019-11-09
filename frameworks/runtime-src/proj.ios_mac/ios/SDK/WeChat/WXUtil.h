
#import "WXApi.h"

@interface ADD_CLASS(WXUtil) : NSObject <WXApiDelegate>

+ (ADD_CLASS(WXUtil) *) ADD_FUN(getInstance);

+ (void) ADD_FUN(registerApp): (NSString *) appid;

- (bool) ADD_FUN(handleOpenURL): (NSURL *) url;

+ (bool) ADD_FUN(isWXAppInstalled);

+ (NSString *) ADD_FUN(getWeixinAppId);

+ (void) ADD_FUN(redirectToWeixinLogin);

+ (NSString *) ADD_FUN(getWXLoginCode);

+ (void) ADD_FUN(setWXLoginCode): (NSString *)id;

+ (bool) ADD_FUN(hasWXOnRespResult): (NSString *)k;

+ (int) ADD_FUN(getWXOnRespResult): (NSString *)k;

+ (void) ADD_FUN(setWXOnRespResult): (NSString *)k v:(int)v;

//+ (void) wxPay:(NSString *)partnerId prepayId:(NSString *) prepayId package:(NSString *)package nonceStr:(NSString *)nonceStr timeStamp:(NSString *)timeStamp sign:(NSString *)sign;

@end
