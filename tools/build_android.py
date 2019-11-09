# coding=utf-8
"""
android打包脚本
"""
import ConfigParser
import os
import platform
import sys

import log


# 生成apk指令
def package_apk(localtime, rc4key):
    if os.path.exists('./../res/AppIcon.png'):
        os.remove('./../res/AppIcon.png')
    outpath = "./../publish/" + localtime + "/"
    arg = "./cocos2d-console/bin/cocos"
    if platform.system() == 'Windows':
        arg = 'call ' + arg + '.bat compile'
    else:
        arg = arg + ' compile'
    arg += " -s ./../"
    arg += " -p android"
    arg += " -m release"
    arg += " -o " + outpath
    arg += " --ndk-mode release"
    arg += " --app-abi armeabi-v7a"
    arg += " --compile-script 1 -j8"
    arg += ' --rc4key "' + rc4key + '"'
    os.system(arg)


# 执行脚本
if len(sys.argv) == 4:
    _localtime = sys.argv[1]
    _area = sys.argv[2]
    _rc4key = sys.argv[3]
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % _area)
    package_apk(_localtime, _rc4key)
else:
    log.error("android打包参数错误！")
