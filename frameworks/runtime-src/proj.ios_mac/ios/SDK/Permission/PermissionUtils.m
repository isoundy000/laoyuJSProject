//
//  PermissionUtils.m
//  MyJSGame
//
//  Created by hjx on 2017/7/12.
//
//
#import "PermissionUtils.h"
#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CLLocationManager.h>
#import "LocationManager.h"

@implementation ADD_CLASS(PermissionUtil)

+ (bool)ADD_FUN(hasPermission):(NSString *)key {
    if ([key isEqualToString:@"video"]) {
        NSString *mediaType = AVMediaTypeVideo;
        AVAuthorizationStatus authorizationStatus = [AVCaptureDevice authorizationStatusForMediaType:mediaType];
        if (authorizationStatus == AVAuthorizationStatusRestricted || authorizationStatus == AVAuthorizationStatusDenied || authorizationStatus == AVAuthorizationStatusNotDetermined) {
            return false;
        }
        return true;
    } else if ([key isEqualToString:@"audio"]) {
        NSString *mediaType = AVMediaTypeAudio;
        AVAuthorizationStatus authorizationStatus = [AVCaptureDevice authorizationStatusForMediaType:mediaType];
        if (authorizationStatus == AVAuthorizationStatusRestricted || authorizationStatus == AVAuthorizationStatusDenied || authorizationStatus == AVAuthorizationStatusNotDetermined) {
            return false;
        }
        return true;
    } else if ([key isEqualToString:@"location"]) {
        if ([CLLocationManager locationServicesEnabled] && ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedWhenInUse)) {
            return true;
        } else if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied || [CLLocationManager authorizationStatus] == kCLAuthorizationStatusNotDetermined) {
            return false;
        }
        return false;
    } else {
        return false;
    }
}

+ (void)ADD_FUN(requestPermission):(NSString *)key {
    if ([key isEqualToString:@"video"]) {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        }];
    } else if ([key isEqualToString:@"audio"]) {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeAudio completionHandler:^(BOOL granted) {
        }];
    } else if ([key isEqualToString:@"location"]) {
        [ADD_CLASS(LocationManager) ADD_FUN(requestAuthorization)];
    }
}

@end
