/**
 * 加载图片
 * @param {String} url 头像url
 * @param {cc.Sprite} stencil 裁切模板
 * @param {Boolean} [is_clipping] 是否裁切，默认：false
 * */
var loadImage = function (url, stencil, is_clipping) {
    if (!(stencil instanceof cc.Sprite)) {
        cc.error('传入的节点不是cc.Sprite类型');
        return false;
    }
    cc.log("==loadimage=="+url);
    if (typeof url === 'undefined' || !url || url === '') {
        cc.error('头像url为空，加载默认头像！');
        url = res.defaultHead;
    }
    if (typeof is_clipping === 'undefined') {
        is_clipping = false;
    }

    var stencilSize = stencil.getContentSize();
    var headSprite  = stencil;

    cc.log("==stencilSize=="+stencilSize);
    cc.log(stencilSize);

    if (is_clipping) {
        cc.log("=====is_clipping====="+is_clipping);
        var clippingNode = stencil.getChildByName('ClippingNode');
        if (!clippingNode) {
            clippingNode = new cc.ClippingNode();
            clippingNode.attr({
                stencil: new cc.Sprite(stencil.getTexture()),
                x: stencilSize.width * 0.5,
                y: stencilSize.height * 0.5
            });
            clippingNode.setAlphaThreshold(0.5);
            clippingNode.setInverted(false);
            clippingNode.setName('ClippingNode');
            stencil.addChild(clippingNode, 1);
        }

        headSprite = clippingNode.getChildByName('headimage');
        if (!headSprite) {
            cc.log("===headSprite===");
            headSprite = new cc.Sprite(stencil.getTexture());
            clippingNode.addChild(headSprite);

            var headSize = headSprite.getContentSize();
            var scaleX = stencilSize.width / headSize.width;
            var scaleY = stencilSize.height / headSize.height;
            cc.log("=======scaleY="+scaleX,scaleY);
            headSprite.setScaleX(scaleX);
            headSprite.setScaleY(scaleY);
        }
    }

    var checkNumber = function (str) {
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(str)) {
            return true;
        }
        return false;
    };

    var loadTexture = function (file_path) {
        cc.log("=====file_path=="+file_path);
        cc.log(file_path);
        var texture = file_path;
        if (!(file_path instanceof cc.Texture2D)) {
            texture = cc.textureCache.addImage(file_path);
        }
        if (texture && cc.sys.isObjectValid(headSprite)) {
            headSprite.setTexture(texture);
            var headSize = headSprite.getContentSize();
            var scaleX = stencilSize.width / headSize.width;
            var scaleY = stencilSize.height / headSize.height;
            if (!is_clipping) {
                scaleX = headSprite.getScaleX();
                scaleY = headSprite.getScaleY();
            }
            headSprite.setScaleX(scaleX);
            headSprite.setScaleY(scaleY);
        }
    };

    var saveImage = function (data) {
        var dir_path = jsb.fileUtils.getWritablePath() + 'headimage/';
        var file_path = dir_path + Crypto.MD5(url) + '.jpg';
        if (data) {
            if (!jsb.fileUtils.isDirectoryExist(dir_path)) {
                jsb.fileUtils.createDirectory(dir_path);
            }
            if (jsb.fileUtils.writeDataToFile(data, file_path)) {
                loadTexture(file_path);
            } else {
                asyncDownloader();
                console.log('Remote write file failed.');
            }
        } else {
            asyncDownloader();
            console.log('Remote download file failed.');
        }
    };

    var asyncDownloader = function () {
        cc.log("====asyncDownloader==="+url);
        cc.textureCache.addImageAsync(url, function (texture) {
            loadTexture(texture);
        }, null);
    };

    var httpDownloader = function () {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            console.log('xhr.readyState: ' + xhr.readyState);
            console.log('xhr.status:' + xhr.status);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    saveImage(new Uint8Array(xhr.response));
                } else {
                    asyncDownloader();
                }
            }
        }.bind(this);
        xhr.open('GET', url, true);
        xhr.send();
    };

    var loadImageFile = function () {
        cc.log("====loadImageFile===");
        var url_arr = url.split('/');
        var suffix = url_arr[url_arr.length - 1];
        if (checkNumber(suffix)) {
            console.log('old head url: ' + url);
            // 微信头像统一尺寸为：96 * 96
            url = url.substr(0, url.length - suffix.length) + '96';
            console.log('new head url: ' + url);
        }
        if (cc.sys.isNative) {
            var file_path = jsb.fileUtils.getWritablePath() + 'headimage/' + Crypto.MD5(url) + '.jpg';
            if (jsb.fileUtils.isFileExist(file_path)) {
                loadTexture(file_path);
            } else {
                httpDownloader();
            }
        } else {
            cc.log("===asyncDownloaderasyncDownloader====");
            asyncDownloader();
        }
    };

    loadTexture(res.defaultHead);
    loadImageFile();
};


/**
 * 根据类型加载图片
 * @param {cc.Node | cc.Sprite | ccui.Layout | ccui.ImageView} target 必须有大小，这是确定头像大小的条件
 * @param {String} url 头像url
 * @param {ImageType | Number} [type] 加载图片的类型，可不传参数，默认：ImageType.Rect
 * */
var loadImageByType = function (target, url, type) {
    if (!(target instanceof cc.Node)) {
        cc.error('传入的节点不是cc.Node类型');
        return false;
    }
    if (typeof url === 'undefined' || !url || url === '') {
        cc.error('头像url为空，加载默认头像！');
        url = res.defaultHead;
    }
    if (typeof type === 'undefined') {
        type = ImageType.Rect;
    }

    var stencil = addStencil(target, type);
    var origin_url = url;
    var md5_url = Crypto.MD5(url);
    var stencilSize = stencil.getContentSize();
    var headSprite = null;
    if (type !== ImageType.Rect) {
        var clippingNode = stencil.getChildByName('ClippingNode');
        if (!clippingNode) {
            clippingNode = new cc.ClippingNode();
            clippingNode.attr({
                stencil: new cc.Sprite(stencil.getTexture()),
                x: stencilSize.width * 0.5,
                y: stencilSize.height * 0.5
            });
            clippingNode.setAlphaThreshold(0.5);
            clippingNode.setInverted(false);
            clippingNode.setName('ClippingNode');
            stencil.addChild(clippingNode, 1);
        }

        headSprite = clippingNode.getChildByName('headimage');
        if (!headSprite) {
            headSprite = new cc.Sprite(stencil.getTexture());
            clippingNode.addChild(headSprite);
            var headSize = headSprite.getContentSize();
            var scaleX = stencilSize.width / headSize.width;
            var scaleY = stencilSize.height / headSize.height;
            headSprite.setScaleX(scaleX);
            headSprite.setScaleY(scaleY);
        }
    } else {
        headSprite = stencil.getChildByName('headSprite');
        if (!headSprite) {
            headSprite = new cc.Sprite(stencil.getTexture());
            headSprite.x = stencilSize.width * 0.5;
            headSprite.y = stencilSize.height * 0.5;
            headSprite.setName('headSprite');
            stencil.addChild(headSprite, 1);
        }
    }

    var loadTexture = function (file_path, md5_url) {
        if (stencil['last_load_url'] && stencil['last_load_url'] === md5_url) {
            var texture = file_path;
            if (!(texture instanceof cc.Texture2D) || cc.sys.isNative && jsb.fileUtils.isFileExist(file_path)) {
                texture = cc.textureCache.addImage(file_path);
            }
            if (texture && cc.sys.isObjectValid(headSprite)) {
                headSprite.setTexture(texture);
                var headSize = headSprite.getContentSize();
                var scaleX = stencilSize.width / headSize.width;
                var scaleY = stencilSize.height / headSize.height;
                headSprite.setScaleX(scaleX);
                headSprite.setScaleY(scaleY);
                console.log('最后加载的头像 url = ' + file_path);
            }
        } else {
            console.log('不是最后加载的头像 url = ' + origin_url);
        }
    };

    var saveImage = function (data) {
        if (data) {
            var dir_path = jsb.fileUtils.getWritablePath() + 'headimage/';
            var file_path = dir_path + md5_url + '.jpg';
            if (!jsb.fileUtils.isDirectoryExist(dir_path)) {
                jsb.fileUtils.createDirectory(dir_path);
            }
            if (jsb.fileUtils.writeDataToFile(data, file_path)) {
                loadTexture(file_path, md5_url);
            } else {
                asyncDownloader();
                console.log('Remote write file failed.');
            }
        } else {
            asyncDownloader();
            console.log('Remote download file failed.');
        }
    };

    var asyncDownloader = function () {
        console.log('cc.textureCache.addImageAsync下载远程头像：' + origin_url);
        cc.textureCache.addImageAsync(url, function (texture) {
            loadTexture(texture, md5_url);
        }, null);
    };

    var httpAsynDownloader = function () {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            console.log('xhr.readyState: ' + xhr.readyState);
            console.log('xhr.status:' + xhr.status);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    saveImage(new Uint8Array(xhr.response));
                } else {
                    asyncDownloader();
                }
            }
        }.bind(this);
        xhr.open('GET', url, true);
        xhr.send();
    };

    var loadImageFile = function () {
        var url_arr = url.split('/');
        var suffix = url_arr[url_arr.length - 1];
        if (/^[0-9]+.?[0-9]*$/.test(suffix)) {
            // 微信头像统一尺寸为：96 * 96
            url = url.substr(0, url.length - suffix.length) + '96';
        }
        if (cc.sys.isNative) {
            var file_path = jsb.fileUtils.getWritablePath() + 'headimage/' + md5_url + '.jpg';
            if (jsb.fileUtils.isFileExist(file_path)) {
                console.log('加载本地头像：' + file_path);
                loadTexture(file_path, md5_url);
            } else {
                console.log('下载远程头像：' + origin_url);
                httpAsynDownloader();
            }
        } else {
            asyncDownloader();
        }
    };

    stencil['last_load_url'] = Crypto.MD5(res.defaultHead);
    loadTexture(res.defaultHead, Crypto.MD5(res.defaultHead));
    if (url !== res.defaultHead) {
        stencil['last_load_url'] = md5_url;
        loadImageFile();
    }
};