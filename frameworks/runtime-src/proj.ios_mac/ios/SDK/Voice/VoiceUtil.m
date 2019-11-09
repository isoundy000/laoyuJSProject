#import "NIMSDK.h"
#import "VoiceUtil.h"
#import "VoiceDownloader.h"

static ADD_CLASS(VoiceUtil) *voiceUtil = nil;
static int curRecordStatus = 0;
static NSString *curRecordFilePath = nil;

const int RECORD_STATUS_END = 0;
const int RECORD_STATUS_RECORDING = 1;
const int RECORD_STATUS_RECORD_SUCCESS = 2;

@implementation ADD_CLASS(VoiceUtil)

#pragma mark NIMMediaManagerDelgate Delegate Methods

- (void)recordAudio:(NSString *)filePath didBeganWithError:(NSError *)error {
    curRecordStatus = RECORD_STATUS_RECORDING;
}

- (void)recordAudio:(NSString *)filePath didCompletedWithError:(NSError *)error {
    NSLog(@"recordAudio complete: %@", filePath);
    curRecordStatus = RECORD_STATUS_RECORD_SUCCESS;
    curRecordFilePath = filePath;
}

- (void)recordAudioProgress:(NSTimeInterval)currentTime {

}

#pragma mark -

+ (void) ADD_FUN(startRecord) {
    if (voiceUtil == nil)
        voiceUtil = [[ADD_CLASS(VoiceUtil) alloc] init];
    curRecordFilePath = nil;
    [[[NIMSDK sharedSDK] mediaManager] record:NIMAudioTypeAAC duration:60 delegate:voiceUtil];
}

+ (void) ADD_FUN(stopRecord) {
    [[[NIMSDK sharedSDK] mediaManager] stopRecord];
}

+ (void) ADD_FUN(cancelRecord) {
    [[[NIMSDK sharedSDK] mediaManager] cancelRecord];
}

+ (void) ADD_FUN(playVoiceFile): (NSString *)filePath {
    if (voiceUtil == nil)
        voiceUtil = [[ADD_CLASS(VoiceUtil) alloc] init];
    [[[NIMSDK sharedSDK] mediaManager] playAudio:filePath withDelegate:voiceUtil];
}

+ (void) ADD_FUN(playVoiceByUrl): (NSString *)url {
    [VoiceDownloader downloadVoiceByUrl:url];
}

+ (int) ADD_FUN(getCurRecordStatus) {
    return curRecordStatus;
}

+ (NSString *) ADD_FUN(getCurSavedVoiceFilePath) {
    if (curRecordFilePath == nil)
        return @"";
    return curRecordFilePath;
}

+ (int) ADD_FUN(getCurrentAmplitude) {
    if (curRecordStatus == RECORD_STATUS_RECORDING)
        return (int) [[[NIMSDK sharedSDK] mediaManager] recordPeakPower];
    return 0;
}

- (void)playAudio:(NSString *)filePath didBeganWithError:(NSError *)error {

}

- (void)playAudio:(NSString *)filePath didCompletedWithError:(NSError *)error {

}

@end

