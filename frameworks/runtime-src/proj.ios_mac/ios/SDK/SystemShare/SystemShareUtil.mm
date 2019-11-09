#import "SystemShareUtil.h"


#include "cocos2d.h"
#import "cocos/scripting/js-bindings/manual/ScriptingCore.h"
#import "CommonUtil.h"
#import "WXApi.h"

USING_NS_CC;

@implementation ADD_CLASS(SystemShareUtil)

+ (void) ADD_FUN(shareUrl):(NSString *)url{
    
    NSURL* urlToShare = [NSURL URLWithString:url];
    
    NSMutableArray *activityItems =[NSMutableArray array];
    [activityItems addObject:urlToShare];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc]initWithActivityItems:activityItems applicationActivities:nil];
    [[[UIApplication sharedApplication] keyWindow].rootViewController presentViewController:activityVC animated:YES completion:nil];
    // 分享之后的回调
    activityVC.completionWithItemsHandler = ^(UIActivityType  _Nullable activityType, BOOL completed, NSArray * _Nullable returnedItems, NSError * _Nullable activityError) {
        if (completed) {
            NSLog(@"completed");
            std::string jsCallStr = cocos2d::StringUtils::format("SystemShareUtil.shareResq(\"%s\");", "success");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
            //分享 成功
        } else  {
            NSLog(@"cancled");
            std::string jsCallStr = cocos2d::StringUtils::format("SystemShareUtil.shareResq(\"%s\");", "fail");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
            //分享 取消
        }
    };
}

+ (void) ADD_FUN(shareText):(NSString *)text{
    NSMutableArray *activityItems =[NSMutableArray array];
    [activityItems addObject:text];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc]initWithActivityItems:activityItems applicationActivities:nil];
    [[[UIApplication sharedApplication] keyWindow].rootViewController presentViewController:activityVC animated:YES completion:nil];
    // 分享之后的回调
    activityVC.completionWithItemsHandler = ^(UIActivityType  _Nullable activityType, BOOL completed, NSArray * _Nullable returnedItems, NSError * _Nullable activityError) {
        if (completed) {
            NSLog(@"completed");
            std::string jsCallStr = cocos2d::StringUtils::format("SystemShareUtil.shareResq(\"%s\");", "success");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
            //分享 成功
        } else  {
            NSLog(@"cancled");
            std::string jsCallStr = cocos2d::StringUtils::format("SystemShareUtil.shareResq(\"%s\");", "fail");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
            //分享 取消
        }
    };
}

+ (void) ADD_FUN(sharePic):(NSString *) path
{
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfFile:path];
    UIImage *image = [UIImage imageWithData:ext.imageData];
    ext.imageData = UIImageJPEGRepresentation(image, 0.6f);
    
    NSMutableArray *activityItems =[NSMutableArray array];
    [activityItems addObject:image];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc]initWithActivityItems:activityItems applicationActivities:nil];
    [[[UIApplication sharedApplication] keyWindow].rootViewController presentViewController:activityVC animated:YES completion:nil];
    // 分享之后的回调
    activityVC.completionWithItemsHandler = ^(UIActivityType  _Nullable activityType, BOOL completed, NSArray * _Nullable returnedItems, NSError * _Nullable activityError) {
        if (completed) {
            NSLog(@"completed");
            std::string jsCallStr = cocos2d::StringUtils::format("SystemShareUtil.shareResq(\"%s\");", "success");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
            //分享 成功
        } else  {
            NSLog(@"cancled");
            std::string jsCallStr = cocos2d::StringUtils::format("SystemShareUtil.shareResq(\"%s\");", "fail");
            ScriptingCore::getInstance()->evalString(jsCallStr.c_str());
            //分享 取消
        }
    };
}

@end
