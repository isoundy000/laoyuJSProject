//
//  LocationManager.m
//  Pods
//
//  Created by wuzhx on 16/7/14.
//
//

#import "BDLocationManager.h"
#include "cocos2d.h"
#import "cocos/scripting/js-bindings/manual/ScriptingCore.h"

@implementation LocationAuthDelegate
/*
 BMKLocationAuthErrorUnknown = -1,                    ///< 未知错误
 BMKLocationAuthErrorSuccess = 0,           ///< 鉴权成功
 BMKLocationAuthErrorNetworkFailed = 1,          ///< 因网络鉴权失败
 BMKLocationAuthErrorFailed  = 2,                ///< KEY非法鉴权失败
 */
- (void) onCheckPermissionState:  (BMKLocationAuthErrorCode) iError {
    if(iError == 0) {
        NSLog(@"鉴权成功");
    }
    else if(iError == -1) {
        NSLog(@"未知错误");
    }
    else if(iError == 1) {
        NSLog(@"因网络鉴权失败");
    }
    else if(iError == 2) {
        NSLog(@"KEY非法鉴权失败");
    }
}
@end

@interface ADD_CLASS(BDLocationManager)()

@property (nonatomic, strong) BMKLocationManager *locationManager;
@property (nonatomic, strong) CLLocation *curLocation;
@property (nonatomic, strong) NSString *curStrLocation;
@property (nonatomic, strong) BMKLocationReGeocode* curLocationInfo;
@property (nonatomic, strong) NSString* curStrLocationInfo;
@property (nonatomic, strong) NSString* locationInfo;

@property (nonatomic, copy) void (^block)(NSString *);

@end

@implementation ADD_CLASS(BDLocationManager)

+ (void) ADD_FUN(init) : (NSString*) AK {
    [[BMKLocationAuth sharedInstance] checkPermisionWithKey:AK authDelegate:[[LocationAuthDelegate alloc] init]];
}

+ (ADD_CLASS(BDLocationManager)*) ADD_FUN(getInstance)
{
    static ADD_CLASS(BDLocationManager) *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[ADD_CLASS(BDLocationManager) alloc] init];
        instance.locationManager = [[BMKLocationManager alloc] init];
        instance.locationManager.delegate = instance;
        // 设置返回位置的坐标系类型
        instance.locationManager.coordinateType = BMKLocationCoordinateTypeBMK09LL;
        // 设置距离过滤参数
        instance.locationManager.distanceFilter = kCLDistanceFilterNone;
        // 设置预期精度参数
        instance.locationManager.desiredAccuracy =  kCLLocationAccuracyBest;
        // 设置应用位置类型
        instance.locationManager.activityType = CLActivityTypeAutomotiveNavigation;
        // 设置是否自动停止位置更新
        instance.locationManager.pausesLocationUpdatesAutomatically = NO;
        // 设置是否允许后台定位
        //        instance.locationManager.allowsBackgroundLocationUpdates = YES;
        // 设置位置获取超时时间
        instance.locationManager.locationTimeout = 10;
        // 设置获取地址信息超时时间
        instance.locationManager.reGeocodeTimeout = 10;
    });
    return instance;
}

+ (void) ADD_FUN(startLocation)
{
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager setLocatingWithReGeocode:YES];
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager startUpdatingLocation];
}

+ (void) ADD_FUN(stopLocation)
{
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager stopUpdatingLocation];
}

+ (void) ADD_FUN(clearCurLocation)
{
    [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocation = nil;
}

+ (NSString*) ADD_FUN(getCurLocation)
{
    if ([ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocation == nil)
        return @"";
    else
        return [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocation ;
}

+ (NSString*) ADD_FUN(getCurLocationInfo)
{
    if ([ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo == nil)
        return @"";
    else
        return [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo ;
}

+ (NSString*) ADD_FUN(getLocationInfo)
{
    if ([ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationInfo == nil)
        return @"";
    else
        return [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationInfo;
}

//#pragma mark - BMKLocationManagerDelegate


-(void) BMKLocationManager:(BMKLocationManager * _Nonnull)manager didUpdateLocation:(BMKLocation * _Nullable)locations orError:(NSError * _Nullable)error
{
    if (error)
    {
        NSLog(@"locError:{%ld - %@};", (long)error.code, error.localizedDescription);
    }
    //    NSLog(@"%lu",(unsigned long)manager.coordinateType);
    if (locations)
    {
        //得到定位信息，添加annotation
        if (locations) {
            if (locations.rgcData) {
                NSLog(@"rgc = %@",[locations.rgcData description]);
                self.curLocationInfo = locations.rgcData;
                NSString *strLocationInfo = [NSString stringWithFormat:@"%@%@%@", self.curLocationInfo.province, self.curLocationInfo.city,self.curLocationInfo.district];
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo = strLocationInfo;
                
                NSMutableDictionary *infoDic = [NSMutableDictionary dictionary];
                [infoDic setValue:self.curLocationInfo.country forKey:@"country"];
                [infoDic setValue:self.curLocationInfo.province forKey:@"province"];
                [infoDic setValue:self.curLocationInfo.city forKey:@"city"];
                [infoDic setValue:self.curLocationInfo.district forKey:@"district" ];
                [infoDic setValue:self.curLocationInfo.street forKey:@"street"];
                [infoDic setValue:self.curLocationInfo.streetNumber forKey:@"streetNumber"];
                [infoDic setValue:self.curLocationInfo.locationDescribe forKey:@"locationDescribe"];
                [infoDic setValue:self.curLocationInfo.cityCode forKey:@"cityCode"];
                [infoDic setValue:self.curLocationInfo.adCode forKey:@"adCode"];
                [infoDic setValue:self.curLocationInfo.countryCode forKey:@"countryCode"];
                NSError *parseError = nil;
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:infoDic options:NSJSONWritingPrettyPrinted error:&parseError];
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationInfo = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                if (_block) {
                    _block(strLocationInfo);
                    _block = nil;
                }
            }
            if(locations.location) {
                NSLog(@"LOC = %@",locations.location);
                self.curLocation = locations.location;
                NSString *strLocation = [NSString stringWithFormat:@"%f,%f", self.curLocation.coordinate.longitude, self.curLocation.coordinate.latitude];
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocation = strLocation;
                if (_block) {
                    _block(strLocation);
                    _block = nil;
                }
            }
            
            std::string jsCallStr = cocos2d::StringUtils::format("LocationManager.didUpdateLocation();");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
        }
    }
}

+ (int) ADD_FUN(getCoordinateType) {
    return [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager.coordinateType;
}

// 单次定位
+ (void) ADD_FUN(requestLocation)
{
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager requestLocationWithReGeocode:YES withNetworkState:YES completionBlock:^(BMKLocation * _Nullable locations, BMKLocationNetworkState state, NSError * _Nullable error) {
        if (error)
        {
            NSLog(@"locError:{%ld - %@};", (long)error.code, error.localizedDescription);
        }
        
        //得到定位信息，添加annotation
        if (locations) {
            if (locations.rgcData) {
                NSLog(@"rgc = %@",[locations.rgcData description]);
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo = locations.rgcData;
                NSString *strLocationInfo = [NSString stringWithFormat:@"%@%@%@", [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province, [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city,[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district];
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo = strLocationInfo;
                
                NSMutableDictionary *infoDic = [NSMutableDictionary dictionary];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country forKey:@"country"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province forKey:@"province"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city forKey:@"city"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district forKey:@"district" ];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.street forKey:@"street"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.streetNumber forKey:@"streetNumber"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.locationDescribe forKey:@"locationDescribe"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.cityCode forKey:@"cityCode"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.adCode forKey:@"adCode"];
                [infoDic setValue:[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocationInfo.countryCode forKey:@"countryCode"];
                NSError *parseError = nil;
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:infoDic options:NSJSONWritingPrettyPrinted error:&parseError];
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationInfo = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            }
            if(locations.location) {
                NSLog(@"LOC = %@",locations.location);
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocation = locations.location;
                NSString *strLocation = [NSString stringWithFormat:@"%f,%f", [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.longitude, [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.latitude];
                [ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].curStrLocation = strLocation;
            }
            
            std::string jsCallStr = cocos2d::StringUtils::format("LocationManager.didUpdateLocation();");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
        }
    }];
}

// 开启持续定位
+ (void) ADD_FUN(startUpdatingLocation)
{
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager setLocatingWithReGeocode:YES];
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager startUpdatingLocation];
}

// 停止持续定位
+ (void) ADD_FUN(stopUpdatingLocation)
{
    [[ADD_CLASS(BDLocationManager) ADD_FUN(getInstance)].locationManager stopUpdatingLocation];
}

@end
