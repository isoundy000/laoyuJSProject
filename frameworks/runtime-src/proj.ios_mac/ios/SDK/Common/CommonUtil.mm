
#import "CommonUtil.h"
#import "OpenUDID.h"
#import <YunCeng/YunCeng.h>
#include "cocos2d.h"
#import <sys/utsname.h>

@implementation ADD_CLASS(CommonUtil)

// 1.1、获取系统版本号
+ (NSString *) ADD_FUN(getSystemVersion)
{
    return [[UIDevice currentDevice] systemVersion];
}

// 1.2、获得设备型号
+ (NSString *) ADD_FUN(getSystemModel)
{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
    return platform;
}

+ (void) ADD_FUN(crash)
{
    @throw NSInternalInconsistencyException;
}

+ (NSString *) ADD_FUN(getBundleId)
{
    return [[NSBundle mainBundle] bundleIdentifier];
}

+ (NSString *) ADD_FUN(getUdid)
{
    return [OpenUDID value];
}

+ (NSString *) ADD_FUN(fetchUDID)
{
    return [OpenUDID value];
}

+ (NSString *) ADD_FUN(getVersionName)
{
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
}

+ (NSString *) ADD_FUN(ni2):(NSString *)k n:(NSString *)n
{
    try {
        if ([YunCeng initWithAppKey:[k UTF8String]] == 0) {
            int iplength = 32;
            char ip[iplength];
            if ([YunCeng getNextIPByGroupName:[n UTF8String] :ip :iplength] == 0) {
                return [NSString stringWithUTF8String:ip];
            }
        }
    } catch (YunCengException *e) {
        //        NSLog(@"%@",e);
    }
    return @"";
}

// 复制到剪切板
+ (void) ADD_FUN(savePasteBoard): (NSString *)text
{
    UIPasteboard *generalPasteBoard = [UIPasteboard generalPasteboard];
    [generalPasteBoard setString:text];
}

// 获得剪切板内容
+ (NSString *) ADD_FUN(getPasteBoard)
{
    return [UIPasteboard generalPasteboard].string;
}

// copy to clipboard
+ (void) ADD_FUN(copyImage):(NSString *)path type:(NSString *)type
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSData *data = [NSData dataWithContentsOfFile:path];
    [pasteboard setData:data forPasteboardType:type];
}

// 打开指定的app
+ (void) ADD_FUN(openApp): (NSString *) app
{
    NSURL *url = [NSURL URLWithString: app];
    BOOL canOpen = [[UIApplication sharedApplication] canOpenURL:url];
    if (canOpen)
    {
        [[UIApplication sharedApplication] openURL:url];
    }
}

//电池电量
+ (NSString *) ADD_FUN(getBatteryLevel) {
    UIDevice *device = [UIDevice currentDevice];
    device.batteryMonitoringEnabled = YES;
    CGFloat level = device.batteryLevel * 100;
    return [NSString stringWithFormat:@"%g", level];
}

// 电池电量增强版
+ (NSString *) ADD_FUN(getBatteryInfo) {
    UIDevice *device = [UIDevice currentDevice];
    device.batteryMonitoringEnabled = YES;
    CGFloat level = device.batteryLevel * 100;
    return [NSString stringWithFormat:@"%ld-%g", (long) device.batteryState, level];
}

// 读取本地JSON文件
+ (NSDictionary *) ADD_FUN(readLocalFileWithName):(NSString *)name {
    // 获取文件路径
    NSString *path = [[NSBundle mainBundle] pathForResource:name ofType:@"json"];
    // 将文件数据化
    NSData *data = [[[NSData alloc] initWithContentsOfFile:path] autorelease];
    // 对数据进行JSON格式化并返回字典形式
    return [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
}

// 恢复文件
+ (void) ADD_FUN(restoreFiles) {
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSString* srcPath = [[NSBundle mainBundle] resourcePath];
    NSString* dstPath = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents/decryption/"];
    std::string searchPath = [dstPath UTF8String];
    cocos2d::FileUtils::getInstance()->addSearchPath(searchPath,true);
    NSString* dst_mapping_path = [dstPath stringByAppendingPathComponent:@"file_mapping.json"];
    if ([fileManager fileExistsAtPath:dst_mapping_path]){
        NSLog(@"已经完成拷贝工作");
        return;
    }
    NSString* src_mapping_path = [[NSBundle mainBundle].resourcePath stringByAppendingPathComponent:@"file_mapping.json"];
    if(![fileManager fileExistsAtPath:src_mapping_path]){
        return;
    }
    BOOL isExists;
    if([fileManager fileExistsAtPath:dstPath isDirectory:&isExists]){
        cocos2d::FileUtils::getInstance()->removeDirectory(std::string([dstPath UTF8String]));
    }
//    NSDictionary* file_mapping = [AppController readLocalFileWithName:@"file_mapping"];
    NSDictionary* file_mapping = [ADD_CLASS(CommonUtil) ADD_FUN(readLocalFileWithName):@"file_mapping"];
    if(file_mapping == nil){
        return;
    }
    for (NSString* key in file_mapping) {
        NSString* value = file_mapping[key];
        NSString* srcFile = [srcPath stringByAppendingPathComponent:value];
        NSString* dstFile = [dstPath stringByAppendingPathComponent:key];
        if(![fileManager fileExistsAtPath:srcFile]){
            NSLog(@"包中没有文件：%@",value);
            return;
        }
        std::string realpath = [dstFile UTF8String];
        std::string file_path = "";
        std::string file_name = "";
        size_t pos = realpath.find_last_of("/");
        if (pos != std::string::npos)
        {
            file_path = realpath.substr(0, pos + 1);
            file_name = realpath.substr(pos + 1);
        }
        realpath = file_path + file_name;
        NSError* error;
        bool result = [fileManager createDirectoryAtPath:[NSString stringWithUTF8String:file_path.c_str()] withIntermediateDirectories:YES attributes:nil error:&error];
        if(!result && error != nil)
        {
            NSLog(@"Fail to create directory %s", realpath.c_str());
        }
        if([fileManager fileExistsAtPath:dstFile]) {
            [fileManager removeItemAtPath:dstFile error:nil];
            NSLog(@"delete file %@",dstFile);
        }
        if([fileManager copyItemAtPath:srcFile toPath:dstFile error:nil]){
            NSLog(@"Copy successed!");
        } else{
            NSLog(@"Copy failed!");
        }
        NSLog(@"dstFile: %@ srcFile: %@", dstFile, srcFile);
    }
    if([fileManager copyItemAtPath:src_mapping_path toPath:dst_mapping_path error:nil]){
        NSLog(@"Copy successed!");
    } else{
        NSLog(@"Copy failed!");
    }
}

@end
