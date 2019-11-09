//
//  MWUtil.h
//  MyJSGame
//
//  Created by Hjianzhu on 17/5/15.
//
//

#import <Foundation/Foundation.h>

@interface ADD_CLASS(MWUtil) : NSObject

+ (ADD_CLASS(MWUtil) *) ADD_FUN(getInstance);

- (void) ADD_FUN(registerWMWithKey): (NSString *)key;

- (void) ADD_FUN(routeMLink): (NSURL *)url;

- (BOOL) ADD_FUN(continueUserActivity): (NSUserActivity *)userActivity;

- (void) ADD_FUN(registerWMlinkWithKey) :(NSString *)key;

+ (NSString *) ADD_FUN(getRoomId);

+ (void) ADD_FUN(clearRoomId);

@end
