#ifndef _AREA_H
#define _AREA_H

#include "Md5.h"
#include <sstream>

#define COMPANY "feiyu"
//#define FOLDER "aaa"
#define AccessKey "niudawang"
#define AccessKeySecret "29673d33257febd0"
#define RECKEY "fe14e5657a4c8412"

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
