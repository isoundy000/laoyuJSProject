import os
import ConfigParser

ROOT_DIR = "../ccui/"
OUT_DIR = "../res/"


def _cocos_stdio_publish(area):
    cf = ConfigParser.ConfigParser()
    cf.read("../conf/project-%s.conf" % area)
    try:
        ccs_name = cf.get("ccs", "ccs_name")
    except ConfigParser.NoOptionError, e:
        print e
    else:
        arg = "\"" + os.getenv('COCOS_ROOT') + "/Cocos.Tool" + "\"" + " publish -r -f " + os.path.abspath(
            ROOT_DIR) + "/" + eval(ccs_name) + ".ccs -o " + os.path.abspath(OUT_DIR) + " -d Serializer_Json"
        os.system(arg)


def publish(area):
    _cocos_stdio_publish(area)
