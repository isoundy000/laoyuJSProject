//
//  BDLocationManager.h
//  Pods
//
//  Created by wuzhx on 16/7/14.
//
//

#import <Foundation/Foundation.h>
#import <BMKLocationkit/BMKLocationComponent.h>
#import <BMKLocationkit/BMKLocationAuth.h>

@interface LocationAuthDelegate : NSObject<BMKLocationAuthDelegate>
- (void) onCheckPermissionState:  (BMKLocationAuthErrorCode) iError;
@end

@interface ADD_CLASS(BDLocationManager) : NSObject<BMKLocationManagerDelegate>

+ (void) ADD_FUN(init) : (NSString*) AK;

+ (ADD_CLASS(BDLocationManager) *) ADD_FUN(getInstance);

+ (void) ADD_FUN(startLocation);

+ (void) ADD_FUN(stopLocation);

+ (void) ADD_FUN(clearCurLocation);

+ (NSString*) ADD_FUN(getCurLocation);

+ (NSString*) ADD_FUN(getCurLocationInfo);

+ (int) ADD_FUN(getCoordinateType);

// 单次定位
+ (void) ADD_FUN(requestLocation);

// 开启持续定位
+ (void) ADD_FUN(startUpdatingLocation);

// 停止持续定位
+ (void) ADD_FUN(stopUpdatingLocation);

@end
