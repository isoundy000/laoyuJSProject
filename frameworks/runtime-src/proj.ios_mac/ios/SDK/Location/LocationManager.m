//
//  LocationManager.m
//  Pods
//
//  Created by wuzhx on 16/7/14.
//
//

#import "LocationManager.h"
#import <CoreLocation/CoreLocation.h>

@interface ADD_CLASS(LocationManager) () <CLLocationManagerDelegate>

@property(nonatomic, strong) CLLocationManager *locationManager;
@property(nonatomic, strong) CLLocation *curLocation;
@property(nonatomic, strong) NSString *curStrLocation;

@property(nonatomic, copy) void (^block)(NSString *);

@end

@implementation ADD_CLASS(LocationManager)

+ (ADD_CLASS(LocationManager) *) ADD_FUN(shareInstance) {
    static ADD_CLASS(LocationManager) *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[ADD_CLASS(LocationManager) alloc] init];
        instance.locationManager = [[CLLocationManager alloc] init];
        instance.locationManager.delegate = instance;
    });
    return instance;
}

+ (void) ADD_FUN(startLocation) {
    //[[LocationManager shareInstance].locationManager requestAlwaysAuthorization];
    [[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager startUpdatingLocation];
}

+ (void) ADD_FUN(stopLocation) {
    [[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager stopUpdatingLocation];
}

+ (void) ADD_FUN(clearCurLocation) {
    [ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].curStrLocation = nil;
}


+ (NSString *) ADD_FUN(getCurLocation) {
    if ([ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].curStrLocation == nil)
        return @"";
    else
        return [ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].curStrLocation;
}

+ (BOOL) ADD_FUN(isUserOpen) {
    BOOL isOpen = [CLLocationManager authorizationStatus] != kCLAuthorizationStatusDenied;
    return isOpen;
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    self.curLocation = [locations lastObject];
    NSString *strLocation = [NSString stringWithFormat:@"%f,%f", self.curLocation.coordinate.longitude, self.curLocation.coordinate.latitude];
    [ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].curStrLocation = strLocation;
    if (_block) {
        _block(strLocation);
        _block = nil;
    }
    [[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager stopUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    switch (status) {
        case kCLAuthorizationStatusNotDetermined:
            if ([[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
                [[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager requestWhenInUseAuthorization];
            }
            break;
        default:
            break;
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
        UIAlertView *alert = [[[UIAlertView alloc] initWithTitle:nil
                                                         message:@"请在设置-隐私-定位服务中开启定位功能"
                                                        delegate:nil
                                               cancelButtonTitle:@"关闭"
                                               otherButtonTitles:nil] autorelease];
        [alert show];

    }
    if (_block) {
        _block(nil);
        _block = nil;
    }
}

+ (void) ADD_FUN(requestAuthorization) {
    if ([[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
        [[ADD_CLASS(LocationManager) ADD_FUN(shareInstance)].locationManager requestWhenInUseAuthorization];
    }
}

@end
