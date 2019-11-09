function computeFactor(p1, p2, p3){
    var a, b;
    //1136*a + b = p1
    //960*a + b = p2
    //853*a + b = p3
    if(p3 == null)
        p3 = 960;

    a = (p1 - p2)/(1136 - p3);
    b = p1 - 1136 * a;
    cc.log("get result +++++++++++++++++++++", a, b);
}

function shortNumber(value){
    if(value == null)return "0";
    var iV = parseInt(value);
    if(iV > 100000000){
        return parseInt(iV/100000000) + "亿";
    }else if(iV > 10000){
        return parseInt(iV/10000) + "万";
    }
    return value;
}

function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}

function findInArray(list, value){
    if(list == null) return -1;
    for (var i=0; i<list.length; i++) {
        if(list[i] == value){
            return i;
        }
    }
    return -1;
}

function removeInArray(list, indexList){
    if(list == null) return;
    indexList.sort(function (a, b) {
        return b-a;
    });

    for (var i=0; i<indexList.length; i++) {
        list.splice(indexList[i], 1);
    }
}

function removeObjArray(list, obj){
    if(list == null) return;
    var pos = -1;
    for (var i=0; i<list.length; i++) {
        if(list[i] == obj){
            pos = i;
            break;
        }
    }

    if(pos >= 0){
        list.splice(pos, 1);
    }
}

function findInArrayStr(list, value){
    if(list == null) return -1;
    for (var i=0; i<list.length; i++) {
        if(list[i].toString() == value){
            return i;
        }
    }
    return -1;
}

function isBitActive(value, index){
    if ((value & Math.pow(2, index)) != 0) {
        return true;
    }
    return false;
}

function isEqualInt64(a, b){
    if(a == b) return true;
    if(a == null || b == null) return false;
    if(a.high == b.high && a.low == b.low){
        return true;
    }
    return false;
}

function getColorByQuality(quality){
    var color = cc.color(255, 255, 255);
    quality = parseInt(quality);
    switch(quality){
        case 0:
            color = cc.color(128, 128, 128);
            break;
        case 1:
            color = cc.color(54, 152, 54);
            break;
        case 2:
            color = cc.color(0, 81, 255);
            break;
        case 3:
            color = cc.color(180, 72, 197);
            break;
        case 4:
            color = cc.color(228, 167, 96);
            break;
        case 5:
            color = cc.color(174, 26, 38);
            break;
    }
    return color;
}

function getTimeString(totalSec, typ){
    if(totalSec < 0)totalSec = 0;
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;
    var result;
    if(typ != null){
        result  = (hours < 10 ? "0" + hours : hours) + "小时" + (minutes < 10 ? "0" + minutes : minutes) + "分" + (seconds  < 10 ? "0" + seconds : seconds) + "秒";
    }else{
        result  = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    }
    return result;
}

function setObjectSet(dataKey, value, key, indexKey){
    if(DD[dataKey] == null){DD[dataKey]={}};

    if(value != null && value[key] != null){
        var list = value[key];
        for(var i=0;i<list.length; i++){
            var id = list[i][indexKey];
            DD[dataKey][id] = list[i];
        }
    }
}

function setObjectList(dataKey, value, key){
    if(value != null){
        DD[dataKey] = value[key];
    }else{
        DD[dataKey] = [];
    }
}

function getObjectInList(list, key, value){
    for(var i=0;i<list.length;i++){
        if(list[i][key] == value){
            return list[i];
        }
    }
    return null;
}

function getObjectInList64(list, key, value){
    for(var i=0;i<list.length;i++){
        if(parseInt(list[i][key]) == parseInt(value)){
            return list[i];
        }
    }
    return null;
}

function addListToList(dataKey, list){
    if(list == null)return;
    for(var i=0;i<list.length;i++){
        addObjectToList(dataKey, list[i]);
    }
}

function addObjectToList(dataKey, obj){
    if(DD[dataKey] == null)
        DD[dataKey] = [];

    var list = DD[dataKey];
    var isNewObj = true;

    if(obj.id != null){
        for (var i = 0; i < list.length; i++) {
            if(isEqualInt64(list[i].id, obj.id)){
                list[i] = obj;
                isNewObj = false;
            }
        }
    }

    if(isNewObj){
        list.push(obj);
    }
}

function removeObjectInList(dataKey, objId){
    if(DD[dataKey] == null)
        DD[dataKey] = [];

    var list = DD[dataKey];
    var findIndex = -1;
    for (var i = 0; i < list.length; i++) {
        if(isEqualInt64(list[i].id, objId)){
            findIndex = i;
            break;
        }
    }

    if(findIndex >= 0){
        list.splice(findIndex, 1);
    }
}

function findObjectInList(dataKey, objId){
    if(DD[dataKey] == null)
        return null;

    var list = DD[dataKey];
    var findIndex = -1;
    for (var i = 0; i < list.length; i++) {
        if(isEqualInt64(list[i].id, objId)){
            findIndex = i;
            break;
        }
    }
    return list[findIndex];
}

function updateObjectList(dataKey, msg, objListKey){
    if(msg == null)return;
    var objList = msg[objListKey];
    for(var i=0;i<objList.length;i++){
        addObjectToList(dataKey, objList[i]);
    }
}

function getFileName(name){
    if(!name) return "";
    var arr = name.match(/([^\/]+)\.[^\/]+$/);
    if(arr && arr[1])
        return arr[1];
    else
        return "";
}

function encodeHttpData(obj){
    var str = JSON.stringify(obj);
    //var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
    //var base64 = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var uri = encodeURI(str);
    return uri;
}

function decodeHttpData(str){
    var strValue = decodeURI(str);
    //var words = CryptoJS.enc.Base64.parse(strValue);
    //var jStr = words.toString(CryptoJS.enc.Utf8);
    var obj = JSON.parse(strValue);
    return obj;
}