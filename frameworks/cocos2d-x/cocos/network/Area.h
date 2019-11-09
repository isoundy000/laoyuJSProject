#ifndef _AREA_H
#define _AREA_H

#include "Md5.h"
#include <sstream>

#define COMPANY "feiyu"
//#define FOLDER "aaa"
#define AccessKey "xykwx"
#define AccessKeySecret "c8ec80e7e5bdeb88"
#define RECKEY "48b0d04253b0a4f3"

class Area
{
private:
    string getHost(string url);
    string getUri(string url, string ptm);
    string getNewUri(string olduri, string ptm);
    string getSignatureStr(string ptm, string uri);
    string getSignature(string tempdata);
    string getNowStr();
public:
    string createNewUrl(string oldUrl);
};

#endif /* Area.h */
