//
//  IAPUtil.h
//  MyJSGame
//
//  Created by 张路欣 on 2017/2/18.
//
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>
#import "GTMBase64.h"

@interface ADD_CLASS(IAPUtil) : NSObject <SKProductsRequestDelegate, SKPaymentTransactionObserver>

@end
