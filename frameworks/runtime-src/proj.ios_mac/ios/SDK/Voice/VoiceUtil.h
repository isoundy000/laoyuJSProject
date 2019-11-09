#import "NIMSDK.h"

@interface ADD_CLASS(VoiceUtil) : NSObject <NIMMediaManagerDelgate>

- (void) recordAudio:(NSString *)filePath didBeganWithError:(NSError *)error;

- (void) recordAudio:(NSString *)filePath didCompletedWithError:(NSError *)error;

- (void) recordAudioProgress:(NSTimeInterval)currentTime;

+ (void) ADD_FUN(startRecord);

+ (void) ADD_FUN(stopRecord);

+ (void) ADD_FUN(cancelRecord);

+ (void) ADD_FUN(playVoiceByUrl): (NSString *)url;

+ (void) ADD_FUN(playVoiceFile): (NSString*)filePath;

+ (int) ADD_FUN(getCurRecordStatus);

+ (NSString *) ADD_FUN(getCurSavedVoiceFilePath);

+ (int) ADD_FUN(getCurrentAmplitude);

@end
