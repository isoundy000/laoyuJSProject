//
//  PermissionUtils.h
//  MyJSGame
//
//  Created by hjx on 2017/7/12.
//
//

@interface ADD_CLASS(PermissionUtil) : NSObject

+ (bool)ADD_FUN(hasPermission):(NSString *)key;

+ (void)ADD_FUN(requestPermission):(NSString *)key;

@end
