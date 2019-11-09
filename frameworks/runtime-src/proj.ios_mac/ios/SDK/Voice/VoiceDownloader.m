#import "VoiceUtil.h"
#import "VoiceDownloader.h"

@implementation VoiceDownloader

+ (void) downloadVoiceByUrl:(NSString *) urlstr {
    [NSThread detachNewThreadSelector:@selector(startDownload:) toTarget:self withObject:urlstr];
}

+ (void)startDownload:(NSString*)_url {
    NSURL *url = [NSURL URLWithString:_url];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:30];
//    NSURLConnection *connection = [[NSURLConnection alloc]initWithRequest:request delegate:self startImmediately:YES];
//    if (connection) {
//        _responseData = [[NSMutableData data] retain];
//    }
    NSError *pError = nil;
    NSURLResponse *pRespond = nil;
    NSData *pResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&pRespond error:&pError];
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *voiceDirectory = [documentsDirectory stringByAppendingPathComponent:@"voice"];
    if ( ! [[NSFileManager defaultManager] fileExistsAtPath:voiceDirectory]) {
        [[NSFileManager defaultManager] createDirectoryAtPath:voiceDirectory withIntermediateDirectories:YES attributes:nil error:NULL];
    }
    NSString *filePath = [voiceDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%.0f", [[NSDate date] timeIntervalSince1970]]];
    
    BOOL ret = [pResponseData writeToFile:filePath atomically:true];
    if (ret){
        [ADD_CLASS(VoiceUtil) ADD_FUN(playVoiceFile):filePath];
    }
    //[pResponseData release];
}

#pragma mark NSURLConnection Delegate Methods

//- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
//    [_responseData setLength:0];
//}
//
//- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
//    // Append the new data to the instance variable you declared
//    [_responseData appendData:data];
//}
//
//- (NSCachedURLResponse *)connection:(NSURLConnection *)connection willCacheResponse:(NSCachedURLResponse*)cachedResponse {
//    // Return nil to indicate not necessary to store a cached response for this connection
//    return nil;
//}
//
//- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
//    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
//    NSString *documentsDirectory = [paths objectAtIndex:0];
//    NSString *voiceDirectory = [documentsDirectory stringByAppendingPathComponent:@"voice"];
//    if ( ! [[NSFileManager defaultManager] fileExistsAtPath:voiceDirectory]) {
//        [[NSFileManager defaultManager] createDirectoryAtPath:voiceDirectory withIntermediateDirectories:YES attributes:nil error:NULL];
//    }
//    NSString *filePath = [voiceDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%.0f", [[NSDate date] timeIntervalSince1970]]];
//    
//    BOOL ret = [_responseData writeToFile:filePath atomically:true];
//    if (ret)
//        [VoiceUtil playVoiceFile:filePath];
//    
//    [connection release];
//    [_responseData release];
//    [self release];
//}
//
//- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
//    [connection release];
//    [_responseData release];
//    [self release];
//}

@end

