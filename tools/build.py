# coding=utf-8
"""
打包工具文件
执行必须带有参数
参数1：目标平台
参数2：目标地区
"""

import ConfigParser
import os
import shutil
import sys
import time

import compress_png
import copy_secret
import log


# 执行导出资源脚本
def publish_res(area):
    arg1 = "python publish_res.py %s" % area
    os.system(arg1)


# 执行android打包脚本
def build_android(l_time, area, rc4key):
    arg = "python build_android.py %s %s \"%s\"" % (l_time, area, rc4key)
    os.system(arg)


# 执行ios打包脚本
def build_ios(l_time, area, rc4key):
    arg = "python build_ios.py %s %s \"%s\"" % (l_time, area, rc4key)
    os.system(arg)


# 执行拷贝加密文件(Area.h)脚本
def copy_secret_file():
    arg = "python copy_secret.py"
    os.system(arg)


# 备份代码
def backup_src(l_time):
    log.debug("备份代码开始...")
    _time_path = os.path.abspath("./../publish/" + l_time)
    if os.path.exists(_time_path):
        shutil.rmtree(_time_path)
    os.mkdir(_time_path)
    _backup_src_zip = _time_path + os.sep + "backup.zip"
    _arg = "zip -q -9 -x -D *.jsc *DS_Store* -r %s ../src ../res" % _backup_src_zip
    os.system(_arg)
    log.debug("备份代码结束!")


# 删除玩法
def remove_wanfa():
    real_path = os.path.abspath('./../res/')
    sub = cf.get("update", "sub")
    sub_parts = sub.split(";")
    for _sub in sub_parts:
        _sub = _sub.strip()
        _dir = _sub.split(",")[0].strip()
        # _ver = _sub.split(",")[1].strip()
        _path = os.path.join(real_path, _dir)
        log.debug("删除玩法: " + _path)
        if os.path.exists(_path):
            shutil.rmtree(_path)


# 执行脚本
if len(sys.argv) == 3:
    _area = sys.argv[2]
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % _area)
    try:
        _rc4key = eval(cf.get("secret", "rc4key"))
        _h_file_path = eval(cf.get("secret", "h_file_path"))
        _h_dist_file_path = eval(cf.get("secret", "h_dist_file_path"))
    except ConfigParser.NoOptionError, e:
        print e
    else:
        _platform = sys.argv[1]
        _time = time.strftime("%Y_%m_%d_%H_%M_%S")
        publish_res(_area)
        remove_wanfa()
        backup_src(_time)
#        compress_png.find_png('./../res', _area, _rc4key)

        copy_secret.copy_h_file(_h_file_path, _h_dist_file_path)
        if _platform == "android":
            build_android(_time, _area, _rc4key)
        elif _platform == "ios":
            build_ios(_time, _area, _rc4key)
        elif _platform == "all":
            build_android(_time, _area, _rc4key)
            build_ios(_time, _area, _rc4key)
        else:
            log.error("打包读取conf错误！！")
        copy_secret.revert_h_file(_h_dist_file_path)
else:
    log.error("执行脚本参数数量错误！！")
