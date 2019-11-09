//
//  GDLocationManager.h
//  Pods
//
//  Created by wuzhx on 16/7/14.
//
//

#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapLocationKit/AMapLocationKit.h>


@interface ADD_CLASS(GDLocationManager) : NSObject<AMapLocationManagerDelegate>

+ (void) ADD_FUN(init) : (NSString*) AK;

+ (ADD_CLASS(GDLocationManager) *) ADD_FUN(getInstance);

+ (void) ADD_FUN(startLocation);

+ (void) ADD_FUN(clearCurLocation);

+ (NSString*) ADD_FUN(getCurLocation);

+ (NSString*) ADD_FUN(getCurLocationInfo);

+ (BOOL) ADD_FUN(isAMapDataAvailable): (NSString*) lat lng: (NSString*) lng;

// 单次定位
+ (void) ADD_FUN(requestLocation);

// 开启持续定位
+ (void) ADD_FUN(startUpdatingLocation);

// 停止持续定位
+ (void) ADD_FUN(stopUpdatingLocation);
@end
