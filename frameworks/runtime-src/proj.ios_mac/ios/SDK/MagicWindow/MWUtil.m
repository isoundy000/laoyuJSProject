//
//  MWUtil.m
//  MyJSGame
//
//  Created by Hjianzhu on 17/5/15.
//
//

#import "MWUtil.h"
#import "MWApi.h"

@implementation ADD_CLASS(MWUtil)

ADD_CLASS(MWUtil) *mwutil = nil;
NSString *roomid = nil;

+ (ADD_CLASS(MWUtil) *) ADD_FUN(getInstance) {
    if (mwutil == nil) {
        mwutil = [ADD_CLASS(MWUtil) alloc];
    }
    return mwutil;
}

- (void) ADD_FUN(registerWMWithKey): (NSString *)key {
    [MWApi registerApp:key];
}

- (void) ADD_FUN(routeMLink): (NSURL *)url {
    [MWApi routeMLink:url];
}

- (BOOL) ADD_FUN(continueUserActivity): (NSUserActivity *)userActivity {
    return [MWApi continueUserActivity:userActivity];
}

- (void) ADD_FUN(registerWMlinkWithKey): (NSString *)key {
    [MWApi registerMLinkHandlerWithKey:key handler:^(NSURL *url, NSDictionary *params) {
        roomid = params[@"roomid"];
    }];
}

+ (NSString *) ADD_FUN(getRoomId) {
    return roomid;
}

+ (void) ADD_FUN(clearRoomId) {
    roomid = nil;
}

@end
