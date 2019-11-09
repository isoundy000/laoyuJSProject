#import "OldVoiceUtil.h"
#import "OldVoiceDownloader.h"
#import "RecorderManager.h"
#import "AppController.h"

@implementation OldVoiceDownloader

- (OldVoiceDownloader *)init
{
    self = [super init];
    if (self) {
        //执行一些资源、变量的初始化工作
    }
    return self;
}

- (void) playVoiceByUrl:(NSString *) urlstr {
    NSURL *url = [NSURL URLWithString:urlstr];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:30];
    NSURLConnection *connection = [[NSURLConnection alloc]initWithRequest:request delegate:self startImmediately:YES ];
    if (connection) {
        _responseData = [[NSMutableData data] retain];
    }
}


#pragma mark NSURLConnection Delegate Methods

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    // A response has been received, this is where we initialize the instance var you created
    // so that we can append data to it in the didReceiveData method
    // Furthermore, this method is called each time there is a redirect so reinitializing it
    // also serves to clear it
    [_responseData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    // Append the new data to the instance variable you declared
    [_responseData appendData:data];
}

- (NSCachedURLResponse *)connection:(NSURLConnection *)connection
                  willCacheResponse:(NSCachedURLResponse*)cachedResponse {
    // Return nil to indicate not necessary to store a cached response for this connection
    
    return nil;
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    NSString* filename = [NSString stringWithString:[Encapsulator defaultFileName]];
    
    [_responseData writeToFile:filename atomically:true];
//    [AppController playVoice:filename];
    [[PlayerManager sharedManager] stopPlaying];
    [PlayerManager sharedManager].delegate = nil;
    [[PlayerManager sharedManager] playAudioWithFileName:filename delegate:nil];
    [connection release];
    
    [_responseData release];
    
    [self release];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    // The request has failed for some reason!
    // Check the error var
    [connection release];
    
    [_responseData release];
}

@end

