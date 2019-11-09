(function (exports) {

    var overwrite_decodeURIComponent = function () {
        var decodeURIComponentBak = window.decodeURIComponent;
        if (!window.decodeURIComponentBak) {
            window.decodeURIComponent = function (str) {
                if (!str)
                    return '';
                try {
                    return decodeURIComponentBak(str);
                } catch (e) {
                    return '';
                }
            };
            window.decodeURIComponentBak = decodeURIComponentBak;
        }
    };

    // var overwrite_ccs_load = function () {
    //     var oldLoad = ccs.load;
    //     ccs.load = function (file, path) {
    //         return oldLoad.call(ccs, file, "res/");
    //     };
    // };

    // var overwrite_cc_loader_getRes = function () {
    //     var getRes = cc.loader.getRes;
    //     cc.loader.getRes = function (url) {
    //         if (url && url.indexOf('.json') == url.length - 5 && !cc.loader.cache[url]) {
    //             cc.loader.cache[url] = getRes.call(cc.loader, url);
    //             // console.log(url);
    //             return cc.loader.cache[url];
    //         }
    //         return getRes.call(cc.loader, url);
    //     };
    // };

    var overwrite_ccui_text_prototype_setFontRes = function () {
        var funcBak = (cc.sys.isNative ? ccui.Text.prototype._ctor : ccui.Text.prototype.ctor);
        ccui.Text.prototype.setFontRes = function (fontRes) {
            var path = fontRes;
            var fontName = '';
            if (path != null) {
                if (cc.sys.isNative) {
                    fontName = path;
                } else {
                    fontName = path.substr(4).match(/([^\/]+)\.(\S+)/);
                    fontName = fontName ? fontName[1] : "";
                }
                this.setFontName(fontName);
                //this.enableOutline(cc.color(0, 0, 0), 2);
            }
        };
        var func = function (textContent, _fontName, fontSize) {
            if (!fontSize) {
                var path = res.default_ttf;
                var fontName = '';
                if (path != null) {
                    if (cc.sys.isNative) {
                        fontName = path;
                    } else {
                        fontName = path.substr(4).match(/([^\/]+)\.(\S+)/);
                        fontName = fontName ? fontName[1] : "";
                    }
                }
                funcBak.call(this, textContent || '', fontName, fontSize || 0);
            }
            else
                funcBak.call(this, textContent || '', _fontName, fontSize || 0);
        };
        if (cc.sys.isNative)
            ccui.Text.prototype._ctor = func;
        else
            ccui.Text.prototype.ctor = func;
    };

    var overwrite_cc_audioEngine_setMusicVolume = function () {
        var funcBak = cc.audioEngine.setMusicVolume;
        cc.audioEngine.setMusicVolume = function (vol) {
            funcBak.call(cc.audioEngine, 0.1 * vol);
        };
    };

    var overwrite_cc_log = function () {
        if (!cc.sys.isNative)
            return;

        var ccLogFuncBak = console.log;
        cc.log = function (v) {
            if (typeof v === 'object') {
                try {
                    ccLogFuncBak(JSON.stringify(v));
                }
                catch (e) {
                    ccLogFuncBak('' + v);
                }
                return;
            }
            ccLogFuncBak(v);
        };

        var consoleLogFuncBak = console.log;
        console.log = function (v) {
            if (typeof v === 'object') {
                try {
                    consoleLogFuncBak(JSON.stringify(v));
                }
                catch (e) {
                    consoleLogFuncBak('' + v);
                }
                return;
            }
            consoleLogFuncBak(v);
        };
    };

    var overwrite_cc_sys_localStorage_setItem = function () {
        var funcBak = cc.sys.localStorage.setItem;
        cc.sys.localStorage.setItem = function (key, val) {
            if (typeof val === 'boolean')
                val = (val ? 1 : 0);
            funcBak.call(cc.sys.localStorage, key, val);
        };
    };

    var overwrite_cc_Sprite_setTexture = function () {
        var funcBak = cc.Sprite.prototype.setTexture;
        cc.Sprite.prototype.setTexture = function (texture) {
            if (texture instanceof cc.SpriteFrame)
                this.setSpriteFrame(texture);
            else
                funcBak.call(this, texture);
        }
    };
    var overwrite_cc_Sprite_setSpriteFrame = function () {
        var funcBak = cc.Sprite.prototype.setSpriteFrame;
        cc.Sprite.prototype.setSpriteFrame = function (frame) {
            if (!frame) {
                console.log("frame name is null!!!!!!!!!!!");
            } else if (_.isString(frame)) {
                if (!cc.spriteFrameCache.getSpriteFrame(frame)) {
                    console.log("frame is null!!!!!!!!!!!");
                }
            } else {
                funcBak.call(this, frame);
            }
        }
    };

    var overwriteJsbReflectionCallStaticMethod = function () {
        if(cc.sys.isNative){
            var funcBak = jsb.reflection.callStaticMethod;
            jsb.reflection.callStaticMethodBak = jsb.reflection.callStaticMethod;
            jsb.reflection.callStaticMethod = function () {
                try {
                    var args = _.toArray(arguments);
                    return funcBak.apply(jsb.reflection, args);
                } catch (e) {
                    var errorCode = ('' + e).split('call result code:')[1] || -100;
                    if(!window.inReview)
                        alert1('native method:\n' + arguments[0] + ':' + arguments[1] + '\nnot found!\nerrorCode :' + errorCode)
                }
            }
        }
    };
    //
    overwrite_cc_log();
    overwrite_cc_sys_localStorage_setItem();
    overwrite_decodeURIComponent();
    overwrite_cc_audioEngine_setMusicVolume();
    // overwrite_cc_loader_getRes();
    // overwrite_ccs_load();
    overwrite_ccui_text_prototype_setFontRes();
    overwrite_cc_Sprite_setTexture();
    overwrite_cc_Sprite_setSpriteFrame();
    overwriteJsbReflectionCallStaticMethod();
})(this);