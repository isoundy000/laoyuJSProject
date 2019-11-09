
//  Created by lqn on 2017/8/23.

@interface ADD_CLASS(TalkingDataUtil) : NSObject


+ (void) ADD_FUN(setAccount): (NSString *)uid name:(NSString *)name;

+ (void) ADD_FUN(onChargeRequest): (NSString *)orderId iapId:(NSString *)iapId currencyAmount:(NSString *)currencyAmount currencyType:(NSString *)currencyType virtualCurrencyAmount:(NSString *)virtualCurrencyAmount paymentType:(NSString *)paymentType;

+ (void) ADD_FUN(onChargeSuccess):(NSString *)orderId;

@end
