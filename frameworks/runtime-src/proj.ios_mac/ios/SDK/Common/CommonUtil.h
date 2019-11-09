//
//  CommonUtil.h
//  ttqmdp-mobile
//
//  Created by 杨海金 on 2018/10/9.
//

#import <Foundation/Foundation.h>

@interface ADD_CLASS(CommonUtil) : NSObject

// crash
+ (void) ADD_FUN(crash);

// 获得包名
+ (NSString *) ADD_FUN(getBundleId);

// 设备udid
+ (NSString *) ADD_FUN(getUdid);

// 设备udid
+ (NSString *) ADD_FUN(fetchUDID);

// 版本号
+ (NSString *) ADD_FUN(getVersionName);

// 游戏盾
+ (NSString *) ADD_FUN(ni2):(NSString *)k n:(NSString *)n;

// 复制到剪切板
+ (void) ADD_FUN(savePasteBoard): (NSString *)text;

// 获得剪切板内容
+ (NSString *) ADD_FUN(getPasteBoard);

// copy to clipboard
+ (void) ADD_FUN(copyImage): (NSString *)path type:(NSString *)type;

// 打开指定的app
+ (void) ADD_FUN(openApp): (NSString *) app;

//电池电量
+ (NSString *) ADD_FUN(getBatteryLevel);

// 电池电量增强版
+ (NSString *) ADD_FUN(getBatteryInfo);

// 读取本地JSON文件
+ (NSDictionary *) ADD_FUN(readLocalFileWithName): (NSString *)name;

// 恢复文件
+ (void) ADD_FUN(restoreFiles);

@end
