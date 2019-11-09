//
//  NetUtil.m
//  MyJSGame
//
//  Created by 张路欣 on 2017/2/17.
//
//

#import "NetManager.h"

@implementation ADD_CLASS(NetManager)

AFNetworkReachabilityManager *netManager;
bool isWifiable;
bool isWANable;

- (void) ADD_FUN(initManager) {
    netManager = [AFNetworkReachabilityManager sharedManager];
    //设置监听
    [netManager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        switch (status) {
            case AFNetworkReachabilityStatusReachableViaWWAN: //2G,3G,4G...
                isWifiable = false;
                isWANable = true;
                break;
            case AFNetworkReachabilityStatusReachableViaWiFi: //wifi网络
                isWifiable = true;
                isWANable = false;
                break;
            default:
            case AFNetworkReachabilityStatusUnknown:          //不可达的网络(未连接)
            case AFNetworkReachabilityStatusNotReachable:     //未识别的网络
                isWifiable = false;
                isWANable = false;
                break;
        }
    }];
}

+ (bool) ADD_FUN(isNetwork) {
    return isWifiable || isWANable;
}

+ (bool) ADD_FUN(isWifi) {
    return isWifiable;
}

+ (bool) ADD_FUN(isWAN) {
    return isWANable;
}

+ (void) ADD_FUN(beginNetListener) {
    [netManager startMonitoring];
}

+ (void) ADD_FUN(stopNetListener) {
    [netManager stopMonitoring];
}

@end
