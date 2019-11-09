# coding=utf-8
"""
ios打包脚本
"""

import ConfigParser
import os
import shutil
import sys

import log


# ipa打包
def package_ipa(local_time, target, sign_key, rc4key):
    out_path = "./../publish/" + local_time + "/"
    arg = "./cocos2d-console/bin/cocos compile"
    arg += " -s ./../"
    arg += " -p ios"
    arg += " -t " + target
    arg += " -m " + "release"
    arg += " -o " + out_path
    arg += " --sign-identity " + "\"" + sign_key + "\""
    arg += " --compile-script 1 -j8"
    arg += ' --rc4key "' + rc4key + '"'
    os.system(arg)
    delapp(out_path, target)


# 删除xcarchive文件
def delapp(out_path, target):
    shutil.rmtree(out_path + eval(target) + ".xcarchive")


# 执行脚本
if len(sys.argv) == 3:
    _local_time = sys.argv[1]
    _area = sys.argv[2]
    _rc4key = sys.argv[3]
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % _area)
    try:
        _target = cf.get("ios", "target")
        _sign_key = cf.get("ios", "release_key")
    except ConfigParser.NoOptionError, e:
        print e
    else:
        package_ipa(_local_time, _target, _sign_key, _rc4key)
else:
    log.error("ios打包参数错误！")
