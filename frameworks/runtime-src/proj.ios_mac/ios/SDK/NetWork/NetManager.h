//
//  NetUtil.h
//  MyJSGame
//
//  Created by 张路欣 on 2017/2/17.
//
//

#import <Foundation/Foundation.h>
#import <AFNetworking.h>

@interface ADD_CLASS(NetManager) : NSObject

- (void) ADD_FUN(initManager);

+ (bool) ADD_FUN(isNetwork);

+ (bool) ADD_FUN(isWifi);

+ (bool) ADD_FUN(isWAN);

+ (void) ADD_FUN(beginNetListener);

+ (void) ADD_FUN(stopNetListener);

@end
