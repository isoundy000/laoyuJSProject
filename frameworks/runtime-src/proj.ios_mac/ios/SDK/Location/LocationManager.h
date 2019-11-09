//
//  LocationManager.h
//  Pods
//
//  Created by wuzhx on 16/7/14.
//
//

#import <Foundation/Foundation.h>

@interface ADD_CLASS(LocationManager) : NSObject

+ (ADD_CLASS(LocationManager) *) ADD_FUN(shareInstance);

+ (void) ADD_FUN(startLocation);

+ (void) ADD_FUN(stopLocation);

+ (void) ADD_FUN(clearCurLocation);

+ (NSString *) ADD_FUN(getCurLocation);

+ (void) ADD_FUN(requestAuthorization);

@end
