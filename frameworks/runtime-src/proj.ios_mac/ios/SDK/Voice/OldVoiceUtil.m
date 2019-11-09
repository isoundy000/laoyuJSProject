#import "OldVoiceUtil.h"
#import "OldVoiceDownloader.h"

@implementation ADD_CLASS(OldVoiceUtil)

BOOL isFileFinished;

ADD_CLASS(OldVoiceUtil)* oldVoiceUtil = nil;

+ (void) ADD_FUN(startVoiceRecord):(NSString *) fileName
{
    if(oldVoiceUtil == nil) {
        oldVoiceUtil = [[ADD_CLASS(OldVoiceUtil) alloc] init];
    }
    [[PlayerManager sharedManager] stopPlaying];
    [RecorderManager sharedManager].delegate = oldVoiceUtil;
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
    [[RecorderManager sharedManager] startRecording:fileName];
}

+ (void) ADD_FUN(stopVoiceRecord): (NSString *) fileName
{
    [[RecorderManager sharedManager] stopRecording];
}

+ (void) ADD_FUN(playVoice): (NSString *) filename
{
    [PlayerManager sharedManager].delegate = nil;
    [[PlayerManager sharedManager] playAudioWithFileName:filename delegate:nil];
}

+ (void) ADD_FUN(playVoiceByUrl): (NSString *) urlstr {
    OldVoiceDownloader *download = [[OldVoiceDownloader alloc] init];
    [download playVoiceByUrl: urlstr];
}

+ (BOOL) ADD_FUN(isFileOpened): (NSString *) fileName {
    if (isFileFinished) {
        isFileFinished = false;
        return false;
    }
    return true;
}

- (void)recordingTimeout {
    
}

- (void)recordingStopped {
    UInt32 category = kAudioSessionCategory_AudioProcessing;
    OSStatus error = AudioSessionSetProperty(kAudioSessionProperty_AudioCategory, sizeof(category), &category);
    if (error) printf("couldn't set audio category!");
}

- (void)recordingFinishedWithFileName:(NSString *)filePath time:(NSTimeInterval)interval
{
    
}

- (void)recordingFailed:(NSString *)failureInfoString {
    
}

+ (void) ADD_FUN(levelMeterChanged): (float)levelMeter {
}

+ (void) ADD_FUN(playingStoped) {
}

@end

