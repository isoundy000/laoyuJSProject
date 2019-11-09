//
//  AgoraUtil.m
//  MyJSGame
//
//  Created by 张路欣 on 2017/5/31.
//
//

#import "AgoraUtil.h"
#import <AVFoundation/AVFoundation.h>
//#import "cocos2d.h"


@implementation ADD_CLASS(AgoraUtil)


ADD_CLASS(AgoraUtil) *agoraUtil = nil;
NSString *volumeList = @"{}";

+ (ADD_CLASS(AgoraUtil) *) ADD_FUN(getInstance) {
    if (agoraUtil == nil) {
        agoraUtil = [[ADD_CLASS(AgoraUtil) alloc] init];
    }
    return agoraUtil;
}

- (void) ADD_FUN(registerAgroaWithKey):(NSString *)key view:(UIView *)view {
    self.agoraKit = [AgoraRtcEngineKit sharedEngineWithAppId:key delegate:self];
    [self.agoraKit setChannelProfile:AgoraRtc_ChannelProfile_Communication];
    [self.agoraKit setVideoProfile:AgoraRtc_VideoProfile_120P swapWidthAndHeight:NO];
    self.view = view;
}

- (void)rtcEngine:(AgoraRtcEngineKit *)engine reportAudioVolumeIndicationOfSpeakers:(NSArray*)speakers totalVolume:(NSInteger)totalVolume{
    NSString* temp = @"{";
    unsigned long volume0=0;
        for(int i= 0 ; i<speakers.count ;i++)
        {
            AgoraRtcAudioVolumeInfo* user =  speakers[i];
            unsigned long volume = [user volume];
            if(i==0){
                volume0 =volume;
            }
            if(volume>100){
                unsigned long useruid = [user uid];
                if(i!=0&&volume0>100){
                    temp = [NSString stringWithFormat:@"%@%@", temp, @","];
                }
                temp = [NSString stringWithFormat:@"%@%@", temp, @"\""];
                temp = [temp stringByAppendingString:[NSString stringWithFormat: @"%lu", useruid]];
                temp = [NSString stringWithFormat:@"%@%@", temp, @"\":1"];
            }
    }
//    NSLog(@"temp = %@", temp);
    temp = [NSString stringWithFormat:@"%@%@", temp, @"}"];
//    NSLog(@"temp = %@",temp);
    volumeList = [[NSString alloc] initWithString:temp];
//    volumeList = temp;
//     cocos2d::Director::getInstance()->getEventDispatcher()->dispatchCustomEvent("game_volueinfo", temp);
}
+ (void) ADD_FUN(initVideoView): (NSString *)viewData {
    NSError *error;
    NSData *data = [viewData dataUsingEncoding:NSUTF8StringEncoding];
    [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].viewDict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&error];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)] ADD_FUN(initAllViews)];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit enableVideo];
//    [[AgoraUtil getInstance].agoraKit disableVideo];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit enableAudioVolumeIndication:100 smooth:3];
}

- (void) ADD_FUN(releaseAllViews) {
    if (self.allViews != nil && self.allViews.count > 0) {
        for (NSString *key in self.allViews) {
            UIView *view = self.allViews[key];
            [view removeFromSuperview];
            [view release];
        }
    }
    if (self.allCanvas != nil && self.allCanvas.count > 0) {
        for (NSString *key in self.allCanvas) {
            UIView *canvas = self.allCanvas[key];
            [canvas release];
        }
    }
    self.allViews = nil;
    self.allCanvas = nil;
}

- (void) ADD_FUN(initAllViews) {
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)] ADD_FUN(releaseAllViews)];
    self.allViews = [[NSMutableDictionary alloc] init];
    self.allCanvas = [[NSMutableDictionary alloc] init];
    for (NSString *key in self.viewDict) {
        NSDictionary *_dict =  [self ADD_FUN(transPos):self.viewDict[key]];
        double x = [_dict[@"x"] doubleValue];
        double y = [_dict[@"y"] doubleValue];
        double width = [_dict[@"width"] doubleValue];
        double height = [_dict[@"height"] doubleValue];
        UIView *videoView = [[UIView alloc] initWithFrame:CGRectMake(x, y, width, height)];
        videoView.translatesAutoresizingMaskIntoConstraints = NO;
        videoView.backgroundColor = [UIColor clearColor];
        videoView.userInteractionEnabled = NO;
        AgoraRtcVideoCanvas *canvas = [[AgoraRtcVideoCanvas alloc] init];
        canvas.uid = [key intValue];
        canvas.view = videoView;
        canvas.renderMode = AgoraRtc_Render_Hidden;
        [self.view addSubview:videoView];
        [self.allViews setObject:videoView forKey:key];
        [self.allCanvas setObject:canvas forKey:key];
    }
}

- (NSDictionary*) ADD_FUN(transPos): (NSDictionary*) _dict {
    double x = [_dict[@"x"] doubleValue];
    double y = [_dict[@"y"] doubleValue];
    double width = [_dict[@"width"] doubleValue];
    double height = [_dict[@"height"] doubleValue];
    double frame_width = self.view.frame.size.width;
    double frame_height = self.view.frame.size.height;
    double scale = frame_width / 1280;
    NSDictionary *_newdic = @{@"x": [NSString stringWithFormat:@"%f", x * scale],
                              @"y": [NSString stringWithFormat:@"%f", (720 - y) * scale],
                              @"width": [NSString stringWithFormat:@"%f", width * scale],
                              @"height": [NSString stringWithFormat:@"%f", height * scale]};
    return _newdic;
}

- (bool) ADD_FUN(loadAgoraKit):(NSString *)roomid uid:(NSString *)uid {
    int code = -1;
    AgoraRtcVideoCanvas *canvas = [self.allCanvas objectForKey:uid];
    if (canvas != nil) {
        [self.agoraKit setupLocalVideo:canvas];
        [self.agoraKit startPreview];
        [self.agoraKit setParameters:@"{\"che.audio.keep.audiosession\":true}"];
        code = [self.agoraKit joinChannelByKey:nil channelName:roomid info:nil uid:[uid intValue] joinSuccess:nil];
        if(code==0){
            [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit setDefaultAudioRouteToSpeakerphone:YES];
            
        }

    }
    return code == 0;
}

- (void)rtcEngine:(AgoraRtcEngineKit *)engine firstRemoteVideoDecodedOfUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed {
    AgoraRtcVideoCanvas *canvas = [self.allCanvas objectForKey: [NSString stringWithFormat:@"%lu", (unsigned long)uid]];
    if (canvas != nil) {
        [self.agoraKit setupRemoteVideo:canvas];
    }
}

+ (bool) ADD_FUN(openVideo):(NSString *)roomid uid:(NSString *)uid {
//    [[AgoraUtil getInstance].agoraKit setEnableSpeakerphone:YES];
    return [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)] ADD_FUN(loadAgoraKit):roomid uid:uid];
}

+ (void) ADD_FUN(hideAllVideo) {
    if ([ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews != nil && [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews.count > 0) {
        for (NSString *key in [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews) {
            UIView *view = [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews[key];
            [view setHidden:YES];
        }
    }
}
+ (NSString *) ADD_FUN(getVolumeList) {
    return volumeList;
}
+ (void) ADD_FUN(setVolumeList) {
    volumeList = @"{}";
}
+ (void) ADD_FUN(showAllVideo) {
    if ([ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews != nil && [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews.count > 0) {
        for (NSString *key in [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews) {
            UIView *view = [ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].allViews[key];
            [view setHidden:NO];
        }
    }
}
//静音他人，不接收语音消息
+ (void) ADD_FUN(pauseAllEffects):(NSString *)ispause {
    BOOL pause = YES;
    NSString *str1 = @"NO";
    BOOL isResult = [ispause compare:str1];
    if(isResult==NO){
        pause = NO;
    }
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit muteAllRemoteAudioStreams:pause];
   
}
//麦克风静音
+ (void) ADD_FUN(muteLocalAudioStream):(NSString *)ispause {
    BOOL pause = YES;
    NSString *str1 = @"NO";
    BOOL isResult = [ispause compare:str1];
    if(isResult==NO){
        pause = NO;
    }
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit muteLocalAudioStream:pause];
    
}
+ (void) ADD_FUN(adjustPlaybackSignalVolume): (int) volume  {
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit adjustPlaybackSignalVolume:volume];
}
+ (void) ADD_FUN(adjustRecordingSignalVolume):(int )volume  {
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit adjustRecordingSignalVolume:volume];
}
+ (void) ADD_FUN(closeVideo) {
//    [[AgoraUtil getInstance].agoraKit setParameters:@"{\"che.audio.keep.audiosession\":false}"];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit setupLocalVideo:nil];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit stopPreview];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)].agoraKit leaveChannel:nil];
    [[ADD_CLASS(AgoraUtil) ADD_FUN(getInstance)] ADD_FUN(releaseAllViews)];

}
+ (void) ADD_FUN(getAudioPress) {
    AVAudioSession *avSession = [AVAudioSession sharedInstance];
    
    if ([avSession respondsToSelector:@selector(requestRecordPermission:)]) {
        
        [avSession requestRecordPermission:^(BOOL available) {
            
            if (available) {
                //completionHandler
            }
            else
            {
                NSString *executableFile = [[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleDisplayName"];
                NSString *tip1 = @"请在“设置-隐私-麦克风”选项中允许";
                NSString *tip2 = @"访问你的麦克风";
                NSString *string1 = [tip1 stringByAppendingString:executableFile];
                NSString *string = [string1 stringByAppendingString:tip2];
                dispatch_async(dispatch_get_main_queue(), ^{
                    [[[UIAlertView alloc] initWithTitle:@"无法录音" message:string delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil] show];
                });
            }
        }];
        
    } }
+(void) ADD_FUN(requetSettingForAuth){
    NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    if ([ [UIApplication sharedApplication] canOpenURL:url])
    {
        [[UIApplication sharedApplication] openURL:url];
    }
}

//检查麦克风权限
+ (int) ADD_FUN(checkAudioStatus) {
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeAudio];
    int pre = 0;
    switch (authStatus) {
        case AVAuthorizationStatusNotDetermined:
            //没有询问是否开启麦克风
            pre = 1;
            break;
        case AVAuthorizationStatusRestricted:
            //未授权，家长限制
            pre = 2;
            break;
        case AVAuthorizationStatusDenied:
            //玩家未授权
            pre = 3;
            break;
        case AVAuthorizationStatusAuthorized:
            //玩家授权
            pre = 4;
            break;
        default:
            break;
    }
    return pre;
}
@end
