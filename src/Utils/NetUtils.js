(function (exports) {

    var httpGet = function (url, cbSucc, cbFail, options) {
        var flag = false;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);

        if (cc.sys.isNative)
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");

        var isRaw = false;
        if (options && options.responseType) {
            isRaw = true;
            xhr.responseType = options.responseType;
            delete options.responseType;
        }

        for (var k in options)
            if (options.hasOwnProperty(k))
                xhr.setRequestHeader(k, options[k]);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    try {
                        if (isRaw)
                            cbSucc(new Uint8Array(xhr.response));
                        else
                            cbSucc(xhr.responseText);
                    } catch (e) {
                        if (typeof e === 'string') {
                            alert1(e );
                        }
                        else {
                            var arr = e.stack.match(/(src\/\w+.js:[0-9]*)|(<.\w+@)/g);
                            if(arr){
                                alert1(arr[0] +"\n"+arr[1]+ "\nmessage="+e.message );
                            }else{
                                console.log("" + e.stack + e.message);
                                alert1("" + e.stack + e.message );
                            }
                        }
                    }

                }
                else {
                    if (!flag) {
                        flag = true;
                        if(cbFail)  cbFail(xhr.statusText, xhr.responseText);
                    }
                }
            }
        };
        xhr.onerror = function () {
            if (!flag) {
                flag = true;
                cbFail(xhr.status, null);
            }
        };
        xhr.send();
    };

    var httpPost = function (url, data, ajaxSuccess, ajaxError, noBase64) {
        data = _.isString(data) ? data : JSON.stringify(data);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            var result, error = false;
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 0) {
                    var dataType = xhr.getResponseHeader('content-type');
                    result = xhr.responseText;
                    console.log(result);
                    try {
                        if (dataType.indexOf('json')) result = JSON.parse(result);
                    } catch (e) {
                        error = e
                    }

                    if (error) ajaxError(error, 'parsererror', xhr);
                    else ajaxSuccess(result, xhr)
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr)
                }
            }
        };
        xhr.onerror = function () {
            ajaxError(xhr.statusText || null);
        };
        if (noBase64) {
            xhr.send(data);
        } else {
            xhr.send(Base64.encode(data));
        }
    };

    var uploadFileToOSS = function (readFilename, uploadFilename, cbSucc, cbFail) {
        if (!cc.sys.isNative)
            return;

        var filePath = readFilename;

        if (jsb.fileUtils.isFileExist(filePath)) {
            var data = jsb.fileUtils.getDataFromFile(filePath);

            var accessid = gameData.alov[2];
            var arr = gameData.alov[3];
            var host = gameData.alov[1];
            var subdir = gameData.alov[4] || "";
            var url = host + "/" + subdir + uploadFilename;

            var flag = false;
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("PUT", url);
            xhr.setRequestHeader("Content-Length", data.length);
            var date = new Date().toGMTString();
            var contentMd5 = '';
            var contentType = 'application/x-www-form-urlencoded';
            var canonicalizedOSSHeaders = '';
            var canonicalizedResource = '/' + gameData.alov[0] + '/' + subdir + uploadFilename;
            var authStr = "PUT\n"
                + contentMd5 + "\n"
                + contentType + "\n"
                + date + "\n"
                + canonicalizedOSSHeaders
                + canonicalizedResource;
            var auth = Crypto.util.bytesToBase64(Crypto.HMAC(Crypto.SHA1, authStr, arr.join(''), {asBytes: true}));
            xhr.setRequestHeader("Date", date);
            xhr.setRequestHeader("Content-Type", contentType);
            xhr.setRequestHeader("Authorization", "OSS " + accessid + ":" + auth);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        if (cbSucc)
                            cbSucc(url);
                    }
                    else {
                        if (!flag) {
                            flag = true;
                            if (cbFail)
                                cbFail(xhr.statusText, xhr.responseText);
                        }
                    }
                }
            };
            xhr.onerror = function () {
                if (!flag) {
                    flag = true;
                    if (cbFail)
                        cbFail(xhr.status, null);
                }
            };
            xhr.send(data);
        }
    };

    var downloadHeadImgToSprite = function (url, targetSprite, successCb) {
        if (!cc.sys.isNative)
            url = 'res/image/defaultHead.jpg';

        if (url == "") {
            // set default image
            return;
        }

        if (url.charAt(url.length - 2) == '/' &&
            url.charAt(url.length - 1) == '0')
            url = url.substr(0, url.length - 2) + '/132';

        var userData = targetSprite.getUserData() || {};
        if (userData.url == url)
            return;

        cc.textureCache.addImageAsync(url, function (texture) {
            var sprite = new cc.Sprite(texture);
            sprite.setTexture(texture);

            var scaleX = targetSprite.getContentSize().width / sprite.getContentSize().width;
            var scaleY = targetSprite.getContentSize().height / sprite.getContentSize().height;
            sprite.setScale(scaleX, scaleY);
            sprite.setAnchorPoint(0, 0);
            sprite.setName('head');
            if (!targetSprite.getChildByName('head'))
                targetSprite.addChild(sprite);

            userData.url = url;
            targetSprite.setUserData(userData);

            if (successCb)
                successCb();
        }, null);
    };

    var getClientIp = function (cbSucc, cbFail) {
        var findIp = function (tag, str, t, cbSucc, cbFail) {
            var k = str.indexOf(t);
            if (k >= 0) {
                var ip = '';
                for (var i = k + t.length; i < k + t.length + 20; i++) {
                    if (str.charAt(i) >= '0' && str.charAt(i) <= '9' || str.charAt(i) == '.')
                        ip += str.charAt(i);
                    else
                        break;
                }
                console.log(tag + ' ip : ' + ip);
                cbSucc(ip);
            }
            else {
                console.log(tag + ' ip : fail ' + str);
                cbFail();
            }
        };

        httpGet('http://ip.chinaz.com/getip.aspx', function (str) {
            findIp('chinaz.com', str, "{ip:'", cbSucc, cbFail);
        }, cbFail);

        httpGet('http://ip.cn/', function (str) {
            findIp('ip.cn', str, "<code>", cbSucc, cbFail);
        }, cbFail);

        httpGet('http://txt.go.sohu.com/ip/soip', function (str) {
            findIp('go.sohu', str, 'sohu_user_ip="', cbSucc, cbFail);
        }, cbFail);

        false && httpGet('http://test.ip138.com/query/', function (str) {
            var json = JSON.parse(str);
            var ip = json.ip;
            console.log('ip138: ' + ip);
            cbSucc(ip);
        }, cbFail);

        false && httpGet('http://pv.sohu.com/cityjson', function (str) {
            findIp('pv.sohu', str, '"cip": "', cbSucc, cbFail);
        }, cbFail);

        false && httpGet('http://whois.pconline.com.cn/ipJson.jsp', function (str) {
            findIp('pconline', str, '"ip":"', cbSucc, cbFail);
        }, cbFail);
    };

    //对网络的判断
    var isWAN = function () {
        if(getNativeVersion()<='1.3.0')return true;
        if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod("NetManager", "isWAN");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + "/utils/NetManager", "isWAN", "()Z");
        }
        return false;
    }
    var isWifi = function () {
        if(getNativeVersion()<='1.3.0')return false;
        if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod("NetManager", "isWifi");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + "/utils/NetManager", "isWifi", "()Z");
        }
        return true;
    }

    var getNetType = function () {
        if(getNativeVersion()<='1.3.0')return -1;
        if (cc.sys.os == cc.sys.OS_IOS) {
            // return jsb.reflection.callStaticMethod("NetManager", "isWifi");
            if(isWifi()){
                return 1;
            }else if(isWAN()){
                return 2;
            }
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(packageUri + "/utils/NetManager", "getNetype", "()I");
        }
        return -1;
    }
    var uploadErrorFileToOSS = function (content) {
        if (!cc.sys.isNative)
            return;
        var data = content;
        var time = timestamp2time(Math.round((new Date()).valueOf() / 1000));
        time = time.replace(/[\s:-]+/g, '_');
        var uploadFilename = gameData.mapId + '-' + gameData.roomId + '-' + gameData.uid + '-' + time + '.txt';
        var accessid = gameData.alov[2];
        var arr = gameData.alov[3];
        var host = gameData.alov[1];
        var subdir = 'errorLog/fydp/';
        var url = host + "/" + subdir + uploadFilename;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("PUT", url);
        // xhr.setRequestHeader("Content-Length", data.length);
        var date = new Date().toGMTString();
        var contentMd5 = '';
        var contentType = 'application/x-www-form-urlencoded';
        var canonicalizedOSSHeaders = '';
        var canonicalizedResource = '/' + gameData.alov[0] + '/' + subdir + uploadFilename;
        var authStr = "PUT\n"
            + contentMd5 + "\n"
            + contentType + "\n"
            + date + "\n"
            + canonicalizedOSSHeaders
            + canonicalizedResource;
        var auth = Crypto.util.bytesToBase64(Crypto.HMAC(Crypto.SHA1, authStr, arr.join(''), {asBytes: true}));
        xhr.setRequestHeader("Date", date);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.setRequestHeader("Authorization", "OSS " + accessid + ":" + auth);
        xhr.onreadystatechange = function () {
        };
        xhr.onerror = function () {
        };
        xhr.send(data);
    };



    exports.NetUtils = {
        httpGet: httpGet,
        uploadFileToOSS: uploadFileToOSS,
        downloadHeadImgToSprite: downloadHeadImgToSprite,
        getClientIp: getClientIp,
        httpPost: httpPost,
        isWAN : isWAN,
        isWifi : isWifi,
        getNetType : getNetType,
        uploadErrorFileToOSS : uploadErrorFileToOSS
    };

})(this);

