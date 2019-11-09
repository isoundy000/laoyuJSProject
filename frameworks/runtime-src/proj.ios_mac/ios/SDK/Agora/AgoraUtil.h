//
//  AgoraUtil.h
//  MyJSGame
//
//  Created by 张路欣 on 2017/5/31.
//
//

#import <Foundation/Foundation.h>
#import <AgoraRtcEngineKit/AgoraRtcEngineKit.h>

@interface ADD_CLASS(AgoraUtil) : NSObject <AgoraRtcEngineDelegate>

@property(strong, nonatomic) AgoraRtcEngineKit *agoraKit;
@property(strong, nonatomic) UIView *view;
@property(strong, nonatomic) NSDictionary *viewDict;
@property(strong, nonatomic) NSMutableDictionary *allViews;
@property(strong, nonatomic) NSMutableDictionary *allCanvas;

+ (ADD_CLASS(AgoraUtil) *) ADD_FUN(getInstance);

- (void) ADD_FUN(registerAgroaWithKey): (NSString *)key view:(UIView *)view;

+ (void) ADD_FUN(initVideoView): (NSString *)viewData;

- (bool) ADD_FUN(loadAgoraKit): (NSString *)roomid uid:(NSString *)uid;

- (void) ADD_FUN(releaseAllViews);

+ (void) ADD_FUN(requetSettingForAuth);

+ (void) ADD_FUN(getAudioPress);

+ (int) ADD_FUN(checkAudioStatus);

- (void) ADD_FUN(initAllViews);

- (NSDictionary*) ADD_FUN(transPos): (NSDictionary*) _dict;

+ (bool) ADD_FUN(openVideo): (NSString *)roomid uid:(NSString *)uid;

+ (void) ADD_FUN(hideAllVideo);

+ (void) ADD_FUN(showAllVideo);

+ (NSString *) ADD_FUN(getVolumeList);

+ (void) ADD_FUN(closeVideo);

+ (void) ADD_FUN(pauseAllEffects);

+ (void) ADD_FUN(resumeAllEffects);

@end
