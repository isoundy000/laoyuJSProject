//
//  DDUtil.m
//  MyJSGame
//
//  Created by 张路欣 on 2017/2/18.
//
//

#import "DDUtil.h"

@implementation ADD_CLASS(DDUtil)

NSString *shareDDResult = nil;

ADD_CLASS(DDUtil) *ddUtil = nil;

+ (ADD_CLASS(DDUtil) *) ADD_FUN(getInstance) {
    if (ddUtil == nil) {
        ddUtil = [[ADD_CLASS(DDUtil) alloc] init];
    }
    return ddUtil;
}

- (ADD_CLASS(DDUtil) *) ADD_FUN(registerApp): (NSString *)app_id {
    [DTOpenAPI registerApp:app_id];
    return self;
}

- (bool) ADD_FUN(handleOpenURL):(NSURL *)url {
    return [DTOpenAPI handleOpenURL:url delegate:self];
}

+ (bool) ADD_FUN(isDDAppInstalled) {
    return [DTOpenAPI isDingTalkInstalled];
}

- (void) onResp: (DTBaseResp *)resp {
    if (resp.errorCode == DTOpenAPISuccess) {
        shareDDResult = @"ok";
    } else {
        shareDDResult = @"failed";
    }
}

+ (NSString *) ADD_FUN(getShareResult) {
    return shareDDResult;
}

+ (void) ADD_FUN(clearShareResult) {
    shareDDResult = nil;
}

+ (void) ADD_FUN(shareText): (NSString *)WeChatMessage {
    DTSendMessageToDingTalkReq *sendMessageReq = [[[DTSendMessageToDingTalkReq alloc] init] autorelease];
    DTMediaMessage *mediaMessage = [[[DTMediaMessage alloc] init] autorelease];
    DTMediaTextObject *textObject = [[[DTMediaTextObject alloc] init] autorelease];
    textObject.text = WeChatMessage;
    mediaMessage.mediaObject = textObject;
    sendMessageReq.message = mediaMessage;

    [DTOpenAPI sendReq:sendMessageReq];
}

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType {
    [ADD_CLASS(DDUtil) ADD_FUN(shareUrl): url title:title description:description sceneType:sceneType path:@"res/icon.png"];
}

+ (void) ADD_FUN(shareUrl): (NSString *)url title:(NSString *)title description:(NSString *)description sceneType:(NSNumber *)sceneType path:(NSString *)path {
    DTSendMessageToDingTalkReq *sendMessageReq = [[[DTSendMessageToDingTalkReq alloc] init] autorelease];
    DTMediaMessage *mediaMessage = [[[DTMediaMessage alloc] init] autorelease];
    DTMediaWebObject *webObject = [[[DTMediaWebObject alloc] init] autorelease];
    webObject.pageURL = url;
    mediaMessage.title = title;
    mediaMessage.thumbData = UIImagePNGRepresentation([UIImage imageNamed:path]);
    mediaMessage.messageDescription = description;
    mediaMessage.mediaObject = webObject;
    sendMessageReq.message = mediaMessage;

    [DTOpenAPI sendReq:sendMessageReq];
}

+ (void) ADD_FUN(sharePic): (NSString *)filePath imageName:(NSString *)imageName sceneType:(NSNumber *)sceneType {
    DTSendMessageToDingTalkReq *sendMessageReq = [[[DTSendMessageToDingTalkReq alloc] init] autorelease];
    DTMediaMessage *mediaMessage = [[[DTMediaMessage alloc] init] autorelease];
    DTMediaImageObject *imageObject = [[[DTMediaImageObject alloc] init] autorelease];
    NSData *imgData = [NSData dataWithContentsOfFile:[[filePath stringByAppendingString:@"/"] stringByAppendingString:imageName]];
    imageObject.imageData = imgData;
    imageObject.imageURL = @"";

    mediaMessage.mediaObject = imageObject;
    sendMessageReq.message = mediaMessage;

    [DTOpenAPI sendReq:sendMessageReq];
}

@end
