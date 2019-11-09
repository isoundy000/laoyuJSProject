# coding=utf-8
"""
热更生成脚本
参数1: 区域
"""

import ConfigParser
import copy
import hashlib
import json
import os
import shutil
import sys
import time

import compress_png
import log
import sub


def clear_update():
    if os.path.exists(os.path.abspath(UPDATE_PATH)):
        shutil.rmtree(os.path.abspath(UPDATE_PATH))


def compile_js(_path):
    js_path = _path + os.sep + "src"
    js_arg = "./cocos2d-console/bin/cocos jscompile -s" + js_path + " -d " + js_path
    os.system(js_arg)


def del_jsc(_path):
    del_js_arg = "find " + _path + " -name \"*.jsc\" -delete"
    os.system(del_js_arg)


def backup_src(l_time):
    log.debug("backup src begin")
    if not os.path.exists(PUBLISH_PATH):
        os.mkdir(PUBLISH_PATH)
    _time_path = os.path.abspath(PUBLISH_PATH + l_time)
    if os.path.exists(_time_path):
        shutil.rmtree(_time_path)
    os.mkdir(_time_path)
    # compile_js("../")
    _backup_src_zip = _time_path + os.sep + "backup.zip"
    _arg = "zip -9 -x -D *.jsc *DS_Store* -q -r " + _backup_src_zip + " ../src ../res"
    os.system(_arg)
    del_jsc("../src")
    log.debug("backup src over")


def clear_temp():
    if os.path.exists(TEMP_PATH):
        shutil.rmtree(TEMP_PATH)


def unzip_temp(base_package_path, new_package_path, base_path, new_path):
    if os.path.exists(TEMP_PATH):
        shutil.rmtree(TEMP_PATH)
    os.mkdir(TEMP_PATH)
    unzip_new_arg = "unzip -q -d " + new_path + " " + new_package_path + "/" + "backup.zip"
    unzip_base_arg = "unzip -q -d " + base_path + " " + base_package_path + "/" + "backup.zip"
    os.system(unzip_new_arg)
    os.system(unzip_base_arg)


def is_shield(_file):
    for shield_file in SHIELD_FILE_LIST:
        if _file.find(shield_file) >= 0:
            return True
    return False


def get_file_list(_dir, file_list):
    for _file in os.listdir(_dir):
        if os.path.isdir(_dir + os.sep + _file):
            get_file_list(_dir + os.sep + _file, file_list)
        else:
            _file_full_path = _dir + os.sep + _file
            file_list.append(_file_full_path)


def compare_files(base_file_list, new_file_list):
    _diff_file_list = []
    for _new_file in new_file_list:
        _new_file_name = _new_file.split("/new/")[1]
        _relevant_file = get_relevant_file(base_file_list, _new_file_name)
        if _relevant_file < 0:
            _diff_file_list.append(_new_file)
        else:
            _new_file_open = open(_new_file, "rb")
            _new_md5 = hashlib.md5(_new_file_open.read()).hexdigest()
            _new_file_open.close()
            _relevant_file_open = open(_relevant_file, "rb")
            _relevant_md5 = hashlib.md5(_relevant_file_open.read()).hexdigest()
            _relevant_file_open.close()
            if _new_md5 != _relevant_md5:
                _diff_file_list.append(_new_file)
    return _diff_file_list


def get_relevant_file(base_file_list, _new_file_name):
    _result = -1
    for _base_file in base_file_list:
        _base_file_name = _base_file.split("/base/")[1]
        if _base_file_name == _new_file_name:
            _result = _base_file
            break
    return _result


def copy_files(file_list, new_version, new_path):
    if not os.path.exists(UPDATE_PATH):
        os.mkdir(UPDATE_PATH)
    _update_package_path = UPDATE_PATH + new_version
    if os.path.exists(_update_package_path):
        shutil.rmtree(_update_package_path)
    os.mkdir(_update_package_path)
    for _file in file_list:
        _abs_file = _file
        if len(_file.split("src" + os.sep)) > 1:
            _abs_file = "src" + os.sep + _file.split("src" + os.sep)[1]
        elif len(_file.split("res" + os.sep)) > 1:
            _abs_file = "res" + os.sep + _file.split("res" + os.sep)[1]
        # log.warning(_abs_file)
        _file_path, _file_name = os.path.split(_abs_file)
        if not os.path.exists(_update_package_path + os.sep + _file_path):
            os.makedirs(_update_package_path + os.sep + _file_path)
        if is_shield(_abs_file):
            continue
        shutil.copy(new_path + os.sep + _abs_file, _update_package_path + os.sep + _file_path)


def zip_file(new_version):
    real_update_path = os.path.abspath(UPDATE_PATH)
    zip_arg = "cd " + real_update_path + os.sep + new_version + " && "
    zip_arg += "zip -9 -x -D *.js *DS_Store* -r -q " + real_update_path + os.sep + new_version + ".zip ./"
    log.debug("zip_arg = " + zip_arg)
    os.system(zip_arg)


def make_minifest(zip_md5, base_version, new_version):
    _minifest_list = MANIFEST_LIST[base_version]
    for _minifest in _minifest_list:
        make_minifest_file(zip_md5, _minifest, base_version, new_version)


def make_minifest_file(zip_md5, _minifest, base_version, new_version):
    version_data = {}
    version_data["engineVersion"] = "Cocos2d-JS v3.8.1"
    version_data["groupVersions"] = {
        "1": new_version,
        "0": base_version
    }
    version_data["packageUrl"] = UPDATE_URL + "update"
    version_data["remoteManifestUrl"] = UPDATE_URL + "project-" + _minifest + ".manifest"
    version_data["remoteVersionUrl"] = UPDATE_URL + "version-" + _minifest + ".manifest"
    version_data["searchPaths"] = []
    version_data["version"] = new_version
    version_mainfest_path = UPDATE_PATH + "version-" + _minifest + ".manifest"

    version_file_to_write = open(version_mainfest_path, 'w')
    version_file_to_write.write(json.dumps(version_data, indent=4, sort_keys=True))
    version_file_to_write.close()

    project_data = copy.copy(version_data)
    project_data["assets"] = {
        "1": {
            "compressed": True,
            "group": "1",
            "md5": zip_md5,
            "path": new_version + ".zip"
        }
    }
    project_mainfest_path = UPDATE_PATH + "project-" + _minifest + ".manifest"
    project_file_to_write = open(project_mainfest_path, 'w')
    project_file_to_write.write(json.dumps(project_data, indent=4, sort_keys=True))
    project_file_to_write.close()


def generate(base_version, new_version, rc4key):
    base_package_path = BASE_PACKAGE_PATH + base_version + os.sep
    new_package_path = PUBLISH_PATH + NEW_PACKAGE_PATH + os.sep
    base_path = TEMP_PATH + "base"
    new_path = TEMP_PATH + "new"
    unzip_temp(base_package_path, new_package_path, base_path, new_path)
    sub.find_sub(AREA)
    # return
    base_file_list = []
    new_file_list = []
    get_file_list(base_path, base_file_list)
    get_file_list(new_path, new_file_list)
    diff_file_list = compare_files(base_file_list, new_file_list)
    copy_files(diff_file_list, new_version, new_path)
    # compress_png.find_png(UPDATE_PATH + new_version, AREA, rc4key)
    compile_js(UPDATE_PATH + new_version)
    zip_file(new_version)
    zip_file_open = open(UPDATE_PATH + new_version + ".zip", "rb")
    zip_md5 = hashlib.md5(zip_file_open.read()).hexdigest()
    zip_file_open.close()
    make_minifest(zip_md5, base_version, new_version)
    clear_temp()


# 发布资源
def publish_res():
    arg1 = "python publish_res.py " + AREA
    os.system(arg1)


# 执行脚本
if len(sys.argv) == 2:
    AREA = sys.argv[1]
    _time = ""
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % AREA)
    try:
        RC4KEY = eval(cf.get("secret", "rc4key"))
        PUBLISH_PATH = eval(cf.get("update", "publish_path"))
        BASE_PACKAGE_PATH = eval(cf.get("update", "base_package_path"))
        UPDATE_PATH = eval(cf.get("update", "update_path"))
        TEMP_PATH = eval(cf.get("update", "temp_path"))
        SHIELD_FILE_LIST = cf.get("update", "shield_file_list").split(",")
        NEW_VERSION = cf.get("update", "new_version").split(",")
        BASE_VERSION = cf.get("update", "base_version").split(",")
        UPDATE_URL = cf.get("update", "update_url")
        MANIFEST_LIST = {}
        for _version in BASE_VERSION:
            MANIFEST_LIST[_version] = cf.get("update", "manifest_list_" + _version).split(",")
    except ConfigParser.NoOptionError, e:
        print e
    else:
        clear_update()
        _time = time.strftime("%Y_%m_%d_%H_%M_%S")
        NEW_PACKAGE_PATH = _time + os.sep
        publish_res()
        backup_src(_time)

        for i in range(len(NEW_VERSION)):
            generate(BASE_VERSION[i], NEW_VERSION[i], RC4KEY)
else:
    log.debug("生成热更包脚本参数错误!")
