//
//  IAPUtil.m
//  MyJSGame
//
//  Created by 张路欣 on 2017/2/18.
//
//

#import "IAPUtil.h"

@implementation ADD_CLASS(IAPUtil)

ADD_CLASS(IAPUtil) *iaputil = nil;

+ (ADD_CLASS(IAPUtil) *) ADD_FUN(getInstance) {
    if (iaputil == nil) {
        iaputil = [ADD_CLASS(IAPUtil) alloc];
    }
    return iaputil;
}

NSString *iapResultCode = @"wait";
NSString *iapResult = nil;

static bool hasAddObersver = NO;


+ (void) ADD_FUN(buy): (NSString *)productId {
    if ([SKPaymentQueue canMakePayments]) {
        [[ADD_CLASS(IAPUtil) ADD_FUN(getInstance)] getProductInfo:productId];

        // 监听购买结果
        if (!hasAddObersver) {
            hasAddObersver = YES;
            [[SKPaymentQueue defaultQueue] addTransactionObserver:iaputil];
        }

    } else {
        iapResultCode = @"fail";
        iapResult = @"用户禁止应用内付费购买";
    }
}

+ (NSString *) ADD_FUN(getResultCode) {
    return iapResultCode;
}

+ (void) ADD_FUN(setResultCode): (NSString *)code {
    iapResultCode = code;
}

+ (NSString *) ADD_FUN(getResult) {
    return iapResult;
}

+ (void) ADD_FUN(setResult): (NSString *)iapresult {
    iapResult = iapresult;
}

- (void)getProductInfo:(NSString *)productIdentifier {
    SKProductsRequest *productRequest = [[[SKProductsRequest alloc] initWithProductIdentifiers:[NSSet setWithObject:productIdentifier]] autorelease];
    productRequest.delegate = self;
    [productRequest start];
}

// 查询成功后的回调
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response {
    NSArray *myProduct = response.products;
    if (myProduct.count == 0) {
        iapResultCode = @"fail";
        iapResult = @"无法获取产品信息，请重试";
        return;
    }
    SKPayment *payment = [SKPayment paymentWithProduct:myProduct[0]];
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}

//查询失败后的回调
- (void)request:(SKRequest *)request didFailWithError:(NSError *)error {
    iapResultCode = @"fail";
    iapResult = @"商品查询失败";
}

//购买操作后的回调
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions {
    for (SKPaymentTransaction *transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchased://交易完成
                iapResultCode = @"sucess";
                iapResult = [GTMBase64 stringByEncodingData:[NSData dataWithContentsOfURL:[[NSBundle mainBundle] appStoreReceiptURL]]];
                [self completeTransaction:transaction];
                break;

            case SKPaymentTransactionStateFailed://交易失败
                [self failedTransaction:transaction];
                break;

            case SKPaymentTransactionStateRestored://已经购买过该商品
                NSLog(@"恢复购买成功");
                [self restoreTransaction:transaction];
                break;

            case SKPaymentTransactionStatePurchasing://商品添加进列表
                NSLog(@"正在请求付费信息，请稍后");
                break;

            default:
                break;
        }
    }

}


- (void)completeTransaction:(SKPaymentTransaction *)transaction {
    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}


- (void)failedTransaction:(SKPaymentTransaction *)transaction {
    if (transaction.error.code != SKErrorPaymentCancelled) {
        iapResultCode = @"fail";
        iapResult = @"购买失败，请重试";
    } else {
        iapResultCode = @"fail";
        iapResult = @"用户取消交易";
    }

    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}


- (void)restoreTransaction:(SKPaymentTransaction *)transaction {
    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}

@end
