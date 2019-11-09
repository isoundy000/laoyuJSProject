# coding=utf-8
"""
android打包脚本
"""

import os
import shutil

import log


# 备份
def temp_h_file(h_dist_file_path):
    shutil.copyfile(h_dist_file_path, h_dist_file_path + "_temp")


# 拷贝
def copy_h_file(h_file_path, h_dist_file_path):
    temp_h_file(h_dist_file_path)
    if os.path.exists(h_file_path):
        shutil.copyfile(h_file_path, h_dist_file_path)
    else:
        log.error("Area.h文件不存在!")


# 还原
def revert_h_file(h_dist_file_path):
    shutil.copyfile(h_dist_file_path + "_temp", h_dist_file_path)
    os.remove(h_dist_file_path + "_temp")
