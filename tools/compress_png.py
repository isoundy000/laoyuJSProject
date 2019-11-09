# coding=utf-8
"""
图片压缩工具
"""

import ConfigParser
import json
import os
import os.path
import platform

PNGGUANT = "pngquant/pngquant"
if platform.system() == 'Windows':
    TEXTUREPACKER = '"C:/Program Files/CodeAndWeb/TexturePacker/bin/TexturePacker.exe"'
else:
    TEXTUREPACKER = '"/Applications/TexturePacker.app/Contents/MacOS/TexturePacker"'


# 压缩图片
def _compress_png(_file_full_path):
    arg = ('call ' if platform.system() == 'Windows' else '') + os.path.abspath('.') + os.sep + PNGGUANT
    arg += ('.exe' if platform.system() == 'Windows' else '')
    arg += " --force"
    arg += " --ordered"
    arg += " --output " + _file_full_path
    arg += " --speed=11"
    arg += " --quality=0-100"
    arg += " " + _file_full_path
    arg += " > tmp.txt"
    if platform.system() == 'Windows':
        arg = arg.replace('/', '\\')
    os.system(arg)
    # log.info("压缩图片 : " + _file_full_path)


# 转换图片为pvr
def _convert_to_pvrccz(_file_full_path):
    arg = ('call ' if platform.system() == 'Windows' else '') + TEXTUREPACKER
    arg += ' "%s"' % _file_full_path + " --premultiply-alpha"
    arg += ' --sheet "%s"' % _file_full_path[0:-4] + '.pvr.ccz'
    arg += " --algorithm Basic --trim-mode None --allow-free-size --opt RGBA8888"
    arg += " --size-constraints AnySize --border-padding 0 --dither-none-nn --disable-rotation"
    arg += " > tmp.txt"
    if platform.system() == 'Windows':
        arg = arg.replace('/', '\\')
    os.system(arg)
    # log.info("转换图片为 pvr.ccz: " + _file_full_path)


# 转换图片为pvrtc4
def _convert_to_pvrtc4(_file_full_path):
    arg = ('call ' if platform.system() == 'Windows' else '') + TEXTUREPACKER
    arg += ' "%s"' % _file_full_path
    arg += ' --sheet "%s"' % _file_full_path[0:-4] + '.pvr'
    arg += " --algorithm Basic --no-trim --allow-free-size --opt PVRTC4"
    arg += " > tmp.txt"
    if platform.system() == 'Windows':
        arg = arg.replace('/', '\\')
    os.system(arg)
    # log.info("转换图片为 pvr.ccz: " + _file_full_path)


# 文件扫描
def _find_png(_dir, area, rc4key):
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % area)
    try:
        _shield_file_list = cf.get("update", "shield_file_list").split(",")
    except ConfigParser.NoOptionError, e:
        print e
    else:
        for _file in os.listdir(_dir):
            if os.path.isdir(_dir + os.sep + _file):
                find_png(_dir + os.sep + _file, area, rc4key)
            else:
                name = _file.split(".")
                if name[1] == "png" and '_noenc' not in name[0]:
                    _file_full_path = _dir + os.sep + _file
                    _file_full_path = _file_full_path.replace('/', os.sep)
                    _file_full_path = _file_full_path.replace('\\', os.sep)

                    if '_nozip' not in name[0]:
                        _is_shield = False
                        for shield_file in _shield_file_list:
                            if shield_file == name[0]:
                                _is_shield = True
                                break

                        if not _is_shield:
                            _compress_png(_file_full_path)

                    _convert_to_pvrccz(_file_full_path)
                    # encrypt_ext = '.pvr.ccz'
                    os.remove(_file_full_path)
                    _file_full_path = _file_full_path[0:-4] + '.pvr.ccz'

                    # _convert_to_pvrccz(_file_full_path)
                    # os.remove(_file_full_path)
                    # _file_full_path = _file_full_path[0:-4] + '.pvr.ccz'

                    # log.info("encrypt image file : " + _file)
                    arg = ('call ' if platform.system() == 'Windows' else '') + os.path.abspath('.') + os.sep
                    arg += 'cocos2d-console/bin/compresser3'
                    arg += ('.exe' if platform.system() == 'Windows' else '')
                    arg += ' ' + _file_full_path + ' "' + rc4key + '"'
                    arg += ' > tmp.txt'
                    arg = arg.replace('/', os.sep)
                    arg = arg.replace('\\', os.sep)
                    os.system(arg)

                if name[1] == "json":
                    # log.info("compress json : " + _file)

                    file_obj = open(_dir + os.sep + _file, "r")
                    json_obj = json.load(file_obj)
                    file_obj.close()

                    file_obj = open(_dir + os.sep + _file, "w")
                    # .replace(',\n\w+"Plist": ""', "")
                    file_obj.write(json.dumps(json_obj, separators=(',', ':')))
                    file_obj.close()
                if name[1] == "json" and _file[0:4].lower() == "dust" or _file == '.DS_Store':
                    # log.info("remove file : " + _file)
                    os.remove(_dir + os.sep + _file)
                    continue
                # or name[1] == 'png'
                if '_noenc' not in name[0] and (
                        name[1] == 'json' or
                        name[1] == 'jpg' or
                        name[1] == 'plist' or
                        name[1] == 'jsc' or
                        name[1] == "manifest"):
                    # log.info("encrypt file : " + _file)
                    arg = ('call ' if platform.system() == 'Windows' else '') + os.path.abspath('.') + os.sep
                    arg += 'cocos2d-console/bin/compresser3'
                    arg += ('.exe' if platform.system() == 'Windows' else '')
                    arg += ' ' + _dir + os.sep + _file + ' "' + rc4key + '"'
                    arg += ' > tmp.txt'
                    arg = arg.replace('/', os.sep)
                    arg = arg.replace('\\', os.sep)
                    os.system(arg)


# 执行脚本
def find_png(_dir, area, rc4key):
    _find_png(_dir, area, rc4key)
    if os.path.exists('./tmp.txt'):
        os.remove('./tmp.txt')
    if os.path.exists('./out.plist'):
        os.remove('./out.plist')
