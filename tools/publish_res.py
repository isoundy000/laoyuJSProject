# coding=utf-8
"""
资源发布脚本
参数1: 区域
"""

import ConfigParser
import shutil
import os
import sys
import log

import ui


# 拷贝资源
def copy_resources():
    clear_res()
    shutil.copytree(RESOURCES_PATH, RES_PATH)


# 清理res
def clear_res():
    if os.path.exists(RES_PATH):
        shutil.rmtree(RES_PATH)


# 删除文件
# def remove_files():
#     if len(REMOVE_FILES) == 0:
#         return
#     remove_file_list = REMOVE_FILES.split(",")
#     for __file in remove_file_list:
#         _file = __file.strip()
#         if _file[0:4] == 'res/':
#             if os.path.exists('../' + _file):
#                 if os.path.isdir('../' + _file):
#                     shutil.rmtree('../' + _file)
#                 else:
#                     os.remove('../' + _file)
#                 log.debug("remove " + '../' + _file)


# 执行脚本
if len(sys.argv) == 2:
    AREA = sys.argv[1]
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % AREA)
    try:
        RES_PATH = eval(cf.get("resource", "res_path"))
        RESOURCES_PATH = eval(cf.get("resource", "resources_path"))
        # REMOVE_FILES = eval(cf.get("resource", "remove_file_list"))
    except ConfigParser.NoOptionError, e:
        print e
    else:
        copy_resources()
        ui.publish(AREA)
        # remove_files()
else:
    log.debug("发布资源脚本参数错误!")
