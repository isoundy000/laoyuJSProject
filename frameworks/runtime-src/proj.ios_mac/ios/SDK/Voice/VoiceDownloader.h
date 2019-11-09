#import <Foundation/Foundation.h>

@interface VoiceDownloader : NSObject <NSURLConnectionDelegate> {

}

+ (void) downloadVoiceByUrl:(NSString *) urlstr;

@end
