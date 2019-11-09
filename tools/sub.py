# coding=utf-8
"""
子模块生成脚本
"""
import hashlib
import json
import os
import shutil
import copy

import log
import ConfigParser

SRC_SUB_PATH = ''
RES_SUB_PATH = ''
TEMP_PATH = ''
UPDATE_PATH = ''
UPDATE_URL = ''
SUB_LIST = []
SUB_VERSION_LIST = []


# js 编译
def compile_js(js_path):
    js_arg = "./cocos2d-console/bin/cocos jscompile -s" + js_path + " -d " + js_path
    os.system(js_arg)


# 寻找sub
def find_sub(area):
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % area)
    try:
        global UPDATE_PATH
        UPDATE_PATH = eval(cf.get("update", "update_path"))
        global TEMP_PATH
        TEMP_PATH = eval(cf.get("update", "temp_path"))
        global SRC_SUB_PATH
        SRC_SUB_PATH = eval(cf.get("sub", "src_sub_path"))
        global RES_SUB_PATH
        RES_SUB_PATH = eval(cf.get("sub", "res_sub_path"))
        global UPDATE_URL
        UPDATE_URL = cf.get("update", "update_url")
        global SUB_LIST
        SUB_LIST = cf.get("update", "sub").split(",")
        global SUB_VERSION_LIST
        SUB_VERSION_LIST = cf.get("update", "sub_version").split(",")
    except ConfigParser.NoOptionError, e:
        print e
    else:
        # 循环处理sub
        for index in range(len(SUB_LIST)):
            try:
                _copy_sub(SUB_LIST[index])
                _zip_sub(SUB_LIST[index], SUB_VERSION_LIST[index])
                _make_manifest(SUB_LIST[index], SUB_VERSION_LIST[index])
            except IOError:
                log.error(SUB_LIST[index] + "模块打包失败")


# 拷贝sub
def _copy_sub(sub):
    _sub_path = TEMP_PATH + "sub" + os.sep + sub
    if os.path.exists(_sub_path):
        shutil.rmtree(_sub_path)
    # sub src目录
    _sub_src_path = TEMP_PATH + "new" + os.sep + "src" + os.sep + "submodules" + os.sep + sub
    # sub res目录
    _sub_res_path = TEMP_PATH + "new" + os.sep + "res" + os.sep + "submodules" + os.sep + sub
    # sub src存储目录
    _sub_src_dst_path = _sub_path + os.sep + "src" + os.sep + "submodules"
    # sub res存储目录
    _sub_res_dst_path = _sub_path + os.sep + "res" + os.sep + "submodules"
    os.makedirs(_sub_src_dst_path)
    os.makedirs(_sub_res_dst_path)
    shutil.move(_sub_src_path, _sub_src_dst_path)
    shutil.move(_sub_res_path, _sub_res_dst_path)
    compile_js(_sub_src_dst_path)


# 压缩sub
def _zip_sub(sub, version):
    if not os.path.exists(UPDATE_PATH):
        os.makedirs(UPDATE_PATH)
    _sub_path = TEMP_PATH + "sub"
    _zip_path = os.path.abspath(UPDATE_PATH)
    _real_sub_path = os.path.abspath(_sub_path)
    zip_arg = "cd " + _real_sub_path + os.sep + sub + " && "
    zip_arg += "zip -9 -x -D *.js *DS_Store* -r -q " + _zip_path + os.sep + sub +"-" + version + ".zip ./"
    log.debug("zip_arg = " + zip_arg)
    os.system(zip_arg)


def _make_manifest(sub, new_version):
    if not os.path.exists(UPDATE_PATH):
        os.makedirs(UPDATE_PATH)
    _manifest_p_file = "sub-p-" + sub + ".manifest"
    _manifest_v_file = "sub-v-" + sub + ".manifest"
    version_data = {}
    version_data["engineVersion"] = "Cocos2d-JS v3.8.1"
    version_data["groupVersions"] = {
        "1": new_version,
        "0": "1.0.0"
    }
    version_data["packageUrl"] = UPDATE_URL + "sub/update"
    version_data["remoteManifestUrl"] = UPDATE_URL + "sub/" + _manifest_p_file
    version_data["remoteVersionUrl"] = UPDATE_URL + "sub/" + _manifest_v_file
    version_data["searchPaths"] = []
    version_data["version"] = new_version
    version_mainfest_path = UPDATE_PATH + _manifest_v_file

    version_file_to_write = open(version_mainfest_path, 'w')
    version_file_to_write.write(json.dumps(version_data, indent=4, sort_keys=True))
    version_file_to_write.close()

    _new_file = UPDATE_PATH + os.sep + sub + "-" + new_version + ".zip"
    _new_file_open = open(_new_file, "rb")
    zip_md5 = hashlib.md5(_new_file_open.read()).hexdigest()
    _new_file_open.close()

    project_data = copy.copy(version_data)
    project_data["assets"] = {
        "1": {
            "compressed": True,
            "group": "1",
            "md5": zip_md5,
            "path": sub + "-" + new_version + ".zip"
        }
    }
    project_mainfest_path = UPDATE_PATH + _manifest_p_file
    project_file_to_write = open(project_mainfest_path, 'w')
    project_file_to_write.write(json.dumps(project_data, indent=4, sort_keys=True))
    project_file_to_write.close()

# find_sub("fydp")
