#import <Foundation/Foundation.h>

@class OldVoiceDownloader;

@interface OldVoiceDownloader : NSObject <NSURLConnectionDelegate>
{
    NSMutableData * _responseData;
}
- (void) playVoiceByUrl:(NSString *) urlstr;

@end
