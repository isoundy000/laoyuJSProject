//
//  GDLocationManager.m
//  Pods
//
//  Created by wuzhx on 16/7/14.
//
//

#import "GDLocationManager.h"
#include "cocos2d.h"
#import "cocos/scripting/js-bindings/manual/ScriptingCore.h"

@interface ADD_CLASS(GDLocationManager)()


@property (nonatomic, strong) CLLocation *curLocation;
@property (nonatomic, strong) NSString *curStrLocation;
@property (nonatomic, strong) AMapLocationManager *locationManager;
@property (nonatomic, strong) AMapLocationReGeocode* curLocationInfo;
@property (nonatomic, strong) NSString* curStrLocationInfo;
@property (nonatomic, strong) NSString* locationInfo;
@end

@implementation ADD_CLASS(GDLocationManager)

+ (void) ADD_FUN(init) : (NSString*) AK {
    [AMapServices sharedServices].apiKey = AK;
}

+ (ADD_CLASS(GDLocationManager) *) ADD_FUN(getInstance)
{
    static ADD_CLASS(GDLocationManager) *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[ADD_CLASS(GDLocationManager) alloc] init];
        instance.locationManager = [[AMapLocationManager alloc] init];
        instance.locationManager.delegate = instance;
        // 带逆地理信息的一次定位（返回坐标和地址信息）
        [instance.locationManager setDesiredAccuracy:10];
        // 定位超时时间，最低2s，此处设置为2s
        instance.locationManager.locationTimeout = 10;
        // 逆地理请求超时时间，最低2s，此处设置为
        instance.locationManager.reGeocodeTimeout = 10;
        // 设置距离过滤参数
        instance.locationManager.distanceFilter = kCLDistanceFilterNone;
        // 设置是否自动停止位置更新
        instance.locationManager.pausesLocationUpdatesAutomatically = NO;
    });
    return instance;
}

+ (void) ADD_FUN(startLocation)
{
    // 带逆地理（返回坐标和地址信息）。将下面代码中的 YES 改成 NO ，则不会返回地址信息。
    [[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationManager requestLocationWithReGeocode:YES completionBlock:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {
        
        if (error)
        {
            NSLog(@"locError:{%ld - %@};", (long)error.code, error.localizedDescription);
            
            if (error.code == AMapLocationErrorLocateFailed)
            {
                return;
            }
        }
        
        NSLog(@"location:%@", location);
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation = location;
        NSString *strLocation = [NSString stringWithFormat:@"%f,%f", [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.longitude, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.latitude];
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocation = strLocation;
        
        if (regeocode)
        {
            NSLog(@"reGeocode:%@", regeocode);
            [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo = regeocode;
            NSString *strLocationInfo = [NSString stringWithFormat:@"%@%@%@%@", [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city,[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district];
            [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo = strLocationInfo;
            
            NSMutableDictionary *infoDic = [NSMutableDictionary dictionary];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.formattedAddress forKey:@"formattedAddress"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country forKey:@"country"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province forKey:@"province"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city forKey:@"city"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district forKey:@"district" ];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.street forKey:@"street"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.number forKey:@"number"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.POIName forKey:@"POIName"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.AOIName forKey:@"AOIName"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.citycode forKey:@"citycode"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.adcode forKey:@"adcode"];
            NSError *parseError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:infoDic options:NSJSONWritingPrettyPrinted error:&parseError];
            [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationInfo = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
    }];
}

+ (void) ADD_FUN(clearCurLocation)
{
    [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocation = nil;
}


+ (NSString*) ADD_FUN(getCurLocation)
{
    if ([ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocation == nil)
        return @"";
    else
        return [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocation ;
}

+ (NSString*) ADD_FUN(getCurLocationInfo)
{
    if ([ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo == nil)
        return @"";
    else
        return [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo ;
}

+ (NSString*) ADD_FUN(getLocationInfo)
{
    if ([ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationInfo == nil)
        return @"";
    else
        return [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationInfo;
}

+ (BOOL) ADD_FUN(isAMapDataAvailable): (NSString*) lat lng: (NSString*) lng {
    //设置一个目标经纬度
    double _lat = [lat doubleValue];
    double _lng = [lng doubleValue];
    CLLocationCoordinate2D coodinate = CLLocationCoordinate2DMake(_lat, _lng);
    //返回是否在大陆或以外地区，返回YES为大陆地区，NO为非大陆。
    BOOL flag= AMapLocationDataAvailableForCoordinate(coodinate);
    return flag;
}

+ (NSString*) coordConvert: (int) type lat:(NSString*) lat lng: (NSString*) lng {
    //设置一个目标经纬度
    double _lat = [lat doubleValue];
    double _lng = [lng doubleValue];
    CLLocationCoordinate2D coodinate = CLLocationCoordinate2DMake(_lat, _lng);
//    CLLocationCoordinate2D newcoodinate = AMapLocationCoordinateConvert(coodinate ,type);
//    NSString* newcoodinatestr = [NSString stringWithFormat:@"%f,%f", newcoodinate.latitude, newcoodinate.longitude];
//    return newcoodinatestr;
    return @"";
}

// 单次定位
+ (void) ADD_FUN(requestLocation)
{
    // 带逆地理（返回坐标和地址信息）。将下面代码中的 YES 改成 NO ，则不会返回地址信息。
    [[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationManager requestLocationWithReGeocode:YES completionBlock:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {
        if (error)
        {
            NSLog(@"locError:{%ld - %@};", (long)error.code, error.localizedDescription);
            
            if (error.code == AMapLocationErrorLocateFailed)
            {
                return;
            }
        }
        
        NSLog(@"location:%@", location);
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation = location;
        NSString *strLocation = [NSString stringWithFormat:@"%f,%f", [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.longitude, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.latitude];
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocation = strLocation;
        
        if (regeocode)
        {
            NSLog(@"reGeocode:%@", regeocode);
            [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo = regeocode;
            NSString *strLocationInfo = [NSString stringWithFormat:@"%@%@%@%@", [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city,[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district];
            [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo = strLocationInfo;
            
            NSMutableDictionary *infoDic = [NSMutableDictionary dictionary];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.formattedAddress forKey:@"formattedAddress"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country forKey:@"country"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province forKey:@"province"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city forKey:@"city"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district forKey:@"district" ];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.street forKey:@"street"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.number forKey:@"number"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.POIName forKey:@"POIName"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.AOIName forKey:@"AOIName"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.citycode forKey:@"citycode"];
            [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.adcode forKey:@"adcode"];
            NSError *parseError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:infoDic options:NSJSONWritingPrettyPrinted error:&parseError];
            [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationInfo = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
        std::string jsCallStr = cocos2d::StringUtils::format("LocationManager.didUpdateLocation();");
        ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
    }];
}

// 开启持续定位
+ (void) ADD_FUN(startUpdatingLocation)
{
    [[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationManager setLocatingWithReGeocode:YES];
    [[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationManager startUpdatingLocation];
}

// 停止持续定位
+ (void) ADD_FUN(stopUpdatingLocation)
{
    [[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationManager stopUpdatingLocation];
}

// 持续定位回调
- (void) amapLocationManager:(AMapLocationManager *)manager didUpdateLocation:(CLLocation *)location reGeocode:(AMapLocationReGeocode *)reGeocode
{
    NSLog(@"location:%@", location);
    [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation = location;
    NSString *strLocation = [NSString stringWithFormat:@"%f,%f", [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.longitude, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocation.coordinate.latitude];
    [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocation = strLocation;
    
//    NSLog(@"location:{lat:%f; lon:%f; accuracy:%f}", location.coordinate.latitude, location.coordinate.longitude, location.horizontalAccuracy);
    if (reGeocode)
    {
        NSLog(@"NsLog reGeocode:%@", reGeocode);
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo = reGeocode;
        NSString *strLocationInfo = [NSString stringWithFormat:@"%@%@%@%@", [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province, [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city,[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district];
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curStrLocationInfo = strLocationInfo;
        
        NSMutableDictionary *infoDic = [NSMutableDictionary dictionary];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.formattedAddress forKey:@"formattedAddress"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.country forKey:@"country"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.province forKey:@"province"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.city forKey:@"city"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.district forKey:@"district" ];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.street forKey:@"street"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.number forKey:@"number"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.POIName forKey:@"POIName"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.AOIName forKey:@"AOIName"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.citycode forKey:@"citycode"];
        [infoDic setValue:[ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].curLocationInfo.adcode forKey:@"adcode"];
        NSError *parseError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:infoDic options:NSJSONWritingPrettyPrinted error:&parseError];
        [ADD_CLASS(GDLocationManager) ADD_FUN(getInstance)].locationInfo = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    std::string jsCallStr = cocos2d::StringUtils::format("LocationManager.didUpdateLocation();");
    ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
}
@end
