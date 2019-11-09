#import "RecorderManager.h"
#import "PlayerManager.h"

@interface ADD_CLASS(OldVoiceUtil) : NSObject <RecordingDelegate>

+ (void) ADD_FUN(startVoiceRecord): (NSString *) fileName;
+ (void) ADD_FUN(stopVoiceRecord): (NSString *) fileName;
+ (void) ADD_FUN(playVoice): (NSString *) filename;
+ (void) ADD_FUN(playVoiceByUrl): (NSString *) urlstr;
+ (BOOL) ADD_FUN(isFileOpened): (NSString *) fileName;

@end
