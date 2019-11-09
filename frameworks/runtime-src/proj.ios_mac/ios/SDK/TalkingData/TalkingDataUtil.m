//  Created by lqn on 2017/8/23.
#import "TalkingDataUtil.h"

#import "TalkingDataGA.h"

@implementation ADD_CLASS(TalkingDataUtil)

+ (void) ADD_FUN(setAccount): (NSString *)uid name:(NSString *)name {
    TDGAAccount *tdgaAccount = [TDGAAccount setAccount:uid];
    [tdgaAccount setAccountName:name];
}

+ (void) ADD_FUN(onChargeRequest): (NSString *)orderId iapId:(NSString *)iapId currencyAmount:(NSString *)currencyAmount currencyType:(NSString *)currencyType virtualCurrencyAmount:(NSString *)virtualCurrencyAmount paymentType:(NSString *)paymentType {
    [TDGAVirtualCurrency onChargeRequst:orderId
                                  iapId:iapId
                         currencyAmount:[currencyAmount doubleValue]
                           currencyType:currencyType
                  virtualCurrencyAmount:[virtualCurrencyAmount doubleValue]
                            paymentType:paymentType];
}

+ (void) ADD_FUN(onChargeSuccess): (NSString *)orderId {
    [TDGAVirtualCurrency onChargeSuccess:orderId];
}

@end
