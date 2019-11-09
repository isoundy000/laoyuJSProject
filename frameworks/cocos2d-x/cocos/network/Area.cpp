//
//  Area.cpp
//  cocos2d_libs
//
//  Created by 张路欣 on 2017/4/14.
//
//

#include "Area.h"


string Area::getHost(string url)
{
    size_t hPos = url.find("//");
    if(hPos == string::npos){
        return "";
    }
    string tempurl = url.substr(hPos + 2);
    size_t iPos = tempurl.find("/");
    if(iPos == string::npos){
        return "";
    }
    string host = tempurl.substr(0, iPos);
    return host;
}

string Area::getUri(string url, string ptm)
{
    size_t hPos = url.find("//");
    if(hPos == string::npos){
        return "";
    }
    string tempurl = url.substr(hPos + 2);
    size_t iPos = tempurl.find("/");
    if(iPos == string::npos){
        return "";
    }
    string uri = tempurl.substr(iPos + 1);
    size_t pos = tempurl.find('?');
    if(pos == string::npos){
        uri += "?";
    } else {
        uri += "&";
    }
    uri += "AccessKey=";
    uri += AccessKey;
    uri += "&";
    uri += "Expires=";
    uri += ptm;
    return uri;
}

string Area::getNewUri(string olduri, string ptm)
{
    string newuri = "";
#ifdef FOLDER
    newuri += FOLDER;
    newuri += "/";
#endif
    newuri += olduri;
    return newuri;
}

string Area::getSignatureStr(string ptm, string uri){
    string tempdata = "";
    tempdata += COMPANY;
    tempdata += "/";
    tempdata += ptm;
    tempdata += "/";
    tempdata += AccessKeySecret;
    tempdata += "/";
#ifdef FOLDER
    tempdata += FOLDER;
    tempdata += "/";
#endif
    tempdata += uri;
    return tempdata;
}

string Area::getSignature(string tempdata)
{
    const char *data= tempdata.c_str();
    MD5 iMD5;
    iMD5.GenerateMD5((unsigned char*)data, (int)strlen(data));
    string signature = iMD5.ToString();
    return signature;
}

string Area::getNowStr()
{
    time_t  t1, t2, base_t;
    double  offset = 0;
    base_t = time(NULL);
    t1 = mktime(gmtime(&base_t));
    t2 = mktime(localtime(&base_t));
    offset = difftime(t2, t1);
    
    stringstream ss;
    int n = (int)t2 - (int)offset;
    string ptms;
    ss<<n;
    ss>>ptms;
    
    return ptms;
}

string Area::createNewUrl(string oldUrl)
{
    string testurl = oldUrl;
    size_t hPos = testurl.find("//");
    if(hPos == string::npos){
        return "";
    }
    string header = testurl.substr(0, hPos);
    string ptms = getNowStr();
    string uri = getUri(testurl, ptms);
    string newuri = getNewUri(uri, ptms);
    string tempdata = getSignatureStr(ptms, uri);
    string signature = getSignature(tempdata);
    string host = getHost(testurl);
    string newUrl = header + "//" + host + "/" + newuri + "&Signature=" + signature;
    return newUrl;
}
