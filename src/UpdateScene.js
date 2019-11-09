(function () {
    var exports = this;

    var restoreSavedVolume = function () {
        if (_.isEmpty(cc.sys.localStorage.getItem('yinxiaoPrecent')))
            cc.sys.localStorage.setItem('yinxiaoPrecent', 100);
        if (_.isEmpty(cc.sys.localStorage.getItem('yinyuePrecent')))
            cc.sys.localStorage.setItem('yinyuePrecent', 100);
        var yinxiaoPrecent = cc.sys.localStorage.getItem('yinxiaoPrecent');
        var yinyuePrecent = cc.sys.localStorage.getItem('yinyuePrecent');
        cc.audioEngine.setEffectsVolume(yinxiaoPrecent / 100);
        cc.audioEngine.setMusicVolume(yinyuePrecent / 100);
    };

    var funcBak = cc.audioEngine.setMusicVolume;
    cc.audioEngine.setMusicVolume = function (vol) {
        funcBak.call(cc.audioEngine, 0.1 * vol);
    };

    var UpdateScene = cc.Scene.extend({
        /**
         * 静态调用方法重写
         * @private
         * */
        _overwirteCallStaticMethod: function () {
            try {
                if (!cc.sys.isNative || cc.sys.os !== cc.sys.OS_IOS || jsb.reflection.hasCallStaticMethodOverwrited) {
                    jsb.reflection.hasCallStaticMethodOverwrited = true;
                    return jsb.reflection.hasCallStaticMethodOverwrited;
                }
                var mixStr = jsb.reflection.callStaticMethod('AppController', 'getMixObject');
                var mixObject = JSON.parse(mixStr);
                if (cc.isObject(mixObject)
                    && mixObject.hasOwnProperty('class_prefix')
                    && mixObject.hasOwnProperty('class_suffix')
                    && mixObject.hasOwnProperty('method_prefix')
                    && mixObject.hasOwnProperty('method_suffix')) {
                    var funcBak = jsb.reflection.callStaticMethod;
                    jsb.reflection.callStaticMethod = function () {
                        var arr = [];
                        for (var i = 0; i < arguments.length; i++) {
                            var arg = arguments[i];
                            arr.push(arg);
                        }
                        var old_className = arr[0];
                        var old_methodname = arr[1];
                        arr[0] = mixObject['class_prefix'] + old_className + mixObject['class_suffix'];
                        var parts = old_methodname.split(':');
                        parts[0] = mixObject['method_prefix'] + parts[0] + mixObject['method_suffix'];
                        arr[1] = parts.join(':');
                        try {
                            // cc.log('混淆静态方法调用：' + old_className + ':' + old_methodname);
                            return funcBak.apply(jsb.reflection, arr);
                        } catch (e) {
                            try {
                                // cc.log('未混淆静态方法调用：' + old_className + ':' + old_methodname);
                                return funcBak.apply(jsb.reflection, arguments);
                            } catch (e) {
                                cc.error('调用方法失败：' + old_className + ':' + old_methodname);
                            }
                        }
                    };
                    jsb.reflection.callStaticMethodBak = funcBak;
                }
                jsb.reflection.hasCallStaticMethodOverwrited = true;
                return jsb.reflection.hasCallStaticMethodOverwrited;
            } catch (e) {
                console.log('没有混淆代码就不要重写【jsb.reflection.callStaticMethod】');
            }
        },

        /**
         * 加载app信息
         * @private
         * */
        _loadPackageInfo: function () {
            window.packageName = cc.sys.isNative ? jsb.reflection.callStaticMethod.apply(jsb.reflection, {
                iOS: ['CommonUtil', 'getBundleId'],
                Android: ['org/cocos2dx/javascript/AppActivity', 'getBundleId', '()Ljava/lang/String;']
            }[cc.sys.os]) : '';
            window.packageUri = packageName.split('.').join('/');
            window.udid = cc.sys.isNative ? jsb.reflection.callStaticMethod.apply(jsb.reflection, {
                iOS: ['CommonUtil', 'getUdid'],
                Android: [packageUri + '/Global', 'getUdid', '()Ljava/lang/String;']
            }[cc.sys.os]) : '0123456789abcdef';
            window.nativeVersion = cc.sys.isNative ? jsb.reflection.callStaticMethod.apply(jsb.reflection, {
                iOS: ['CommonUtil', 'getVersionName'],
                Android: [packageUri + '/Global', 'getVersionName', '()Ljava/lang/String;']
            }[cc.sys.os]) : '0.0.0';
        },

        /**
         * 保持屏幕常亮
         * @private
         * */
        _keepScreenOn: function () {
            if (cc.sys.isNative && cc.Device && cc.Device.setKeepScreenOn) {
                cc.Device.setKeepScreenOn(true);
            }
        },

        ctor: function () {
            this._super();
            this._overwirteCallStaticMethod();
            this._loadPackageInfo();
            this._keepScreenOn();
            if (!window.firstUpdate) {
                restoreSavedVolume();
                if (_.isFunction(beginNetListener)) {
                    beginNetListener();
                }

                if (cc.sys.isNative && cc.Device && cc.Device.setKeepScreenOn)
                    cc.Device.setKeepScreenOn(true);

                var funcBak = (cc.sys.isNative ? ccui.Text.prototype._ctor : ccui.Text.prototype.ctor);
                ccui.Text.prototype.setFontRes = function (fontRes) {
                    var path = fontRes;
                    var fontName = '';
                    if (path != null) {
                        if (cc.sys.isNative) {
                            fontName = path;
                        } else {
                            fontName = path.substr(4).match(/([^\/]+)\.(\S+)/);
                            fontName = fontName ? fontName[1] : '';
                        }
                        this.setFontName(fontName);
                        //this.enableOutline(cc.color(0, 0, 0), 2);
                    }
                };
                // var func = function (textContent, fontName, fontSize) {
                //     funcBak.call(this, textContent, fontName, fontSize);
                //     this.setFontRes(res.default_ttf);
                // };
                var func = function (textContent, _fontName, fontSize) {
                    if (!fontSize) {
                        var path = res.default_ttf;
                        var fontName = '';
                        if (path != null) {
                            if (cc.sys.isNative) {
                                fontName = path;
                            } else {
                                fontName = path.substr(4).match(/([^\/]+)\.(\S+)/);
                                fontName = fontName ? fontName[1] : '';
                            }
                        }
                        // console.log('xxx ' + _fontName + ' ' + fontName);
                        funcBak.call(this, textContent || '', fontName, fontSize || 0);
                    }
                    else
                        funcBak.call(this, textContent || '', _fontName, fontSize || 0);
                };
                if (cc.sys.isNative)
                    ccui.Text.prototype._ctor = func;
                else
                    ccui.Text.prototype.ctor = func;

                window.firstUpdate = true;
            }

        },
        run: function () {
            if (cc.sys.isNative) {
                var save_native_version = cc.sys.localStorage.getItem('save_native_version');
                if (!save_native_version || save_native_version != window.nativeVersion) {
                    jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'project.manifest');
                    jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'projct.manifest.tmp');
                    jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'version.manifest');
                    jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'version.manifest.tmp');
                    jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'res');
                    jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + (cc.sys.os == cc.sys.OS_IOS ? '/storage/' : '/') + 'src');
                }
            }
            if (cc.sys.localStorage.getItem('yinxiaoPrecent') === null || cc.sys.localStorage.getItem('yinxiaoPrecent') === '')
                cc.sys.localStorage.setItem('yinxiaoPrecent', 100);
            if (cc.sys.localStorage.getItem('yinyuePrecent') === null || cc.sys.localStorage.getItem('yinyuePrecent') === '')
                cc.sys.localStorage.setItem('yinyuePrecent', 100);
            var yinxiaoPrecent = cc.sys.localStorage.getItem('yinxiaoPrecent');
            var yinyuePrecent = cc.sys.localStorage.getItem('yinyuePrecent');
            cc.audioEngine.setEffectsVolume(yinxiaoPrecent / 100);
            cc.audioEngine.setMusicVolume(yinyuePrecent / 100);

            var that = this;

            var bg = new cc.Sprite(res.bg_jpg);
            bg.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
            this.addChild(bg);

            var title = new cc.Sprite(res.login_title_png);
            title.setPosition(cc.p(cc.winSize.width / 2, 432));
            this.addChild(title);

            // if (false) {
            if (cc.sys.isNative) {  // 热更新
                var progressLabel = new ccui.Text();
                progressLabel.setFontSize(24);
                progressLabel.setTextColor(cc.color(0, 0, 0));
                progressLabel.x = cc.winSize.width / 2;
                progressLabel.y = 140;
                progressLabel.setAnchorPoint(cc.p(0.5, 0.5));
                progressLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                progressLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                this.addChild(progressLabel);
                this.progressLabel = progressLabel;

                var progressBg = new cc.Sprite(res.equipupgrade_progress_b_png);
                progressBg.x = cc.winSize.width / 2;
                progressBg.y = 200;
                this.addChild(progressBg);

                var progressBar = new cc.ProgressTimer(cc.Sprite.create(res.equipupgrade_progress_png));
                progressBar.setPosition(cc.p(progressBg.getContentSize().width / 2, progressBg.getContentSize().height / 2));
                progressBar.setType(cc.ProgressTimer.TYPE_BAR);
                progressBar.setMidpoint(cc.p(0, 0));
                progressBar.setBarChangeRate(cc.p(1, 0));
                progressBg.addChild(progressBar);

                progressLabel.setVisible(true);
                progressBg.setVisible(false);

                progressLabel.setString('正在拉取服务器信息..');
                this.progressLabel = progressLabel;
                var nativeVersion = getNativeVersion() || '';
                var manifestUrl = 'res/project.manifest';
                var storagePath = cc.sys.writablePath;
                // console.log("manifestUrl = "+manifestUrl);
                var manager = new jsb.AssetsManager(manifestUrl, storagePath);
                window.curVersion = manager.getLocalManifest().getVersion();

                // 版本号
                var lb_version = new ccui.Text();
                lb_version.setFontSize(28);
                lb_version.setTextColor(cc.color(255, 255, 255));
                lb_version.setAnchorPoint(cc.p(1.0, 0));
                lb_version.x = cc.winSize.width - 20;
                lb_version.y = 20;
                lb_version.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                lb_version.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                this.addChild(lb_version, 2);
                lb_version.setString(window.curVersion);

                manager.retain();
                manager.update();

                var retainCnt = 1;
                if (!manager.getLocalManifest().isLoaded()) {
                    cc.log('Fail to update assets, step skipped.');

                    if (--retainCnt >= 0)
                        manager.release();

                    this.loadGame();
                }
                else {
                    var listener = new jsb.EventListenerAssetsManager(manager, function (event) {
                        switch (event.getEventCode()) {
                            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                                progressLabel.setString('正在更新图片资源..');
                                progressBg.setVisible(true);
                                cc.log('New version found.');
                                break;
                            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                                cc.log('No local manifest file found, skip assets update.');
                                break;
                            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                                var percent = event.getPercent();
                                var filePercent = event.getPercentByFile();
                                progressBar.setPercentage(percent);
                                cc.log('Download percent : ' + percent + ' | File percent : ' + filePercent);
                                break;
                            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                                if (!_.isFunction(isNetwork) || isNetwork()) {
                                    var str = '未找到服务器信息，正在进入游戏';
                                    progressLabel.setString(str);
                                    if (--retainCnt >= 0)
                                        manager.release();
                                    cc.eventManager.removeListener(listener);
                                    that.loadGame();
                                } else {
                                    var str = '检查服务器信息失败, 正在等待重试';
                                    progressLabel.setString(str);
                                    if (--retainCnt >= 0)
                                        manager.release();
                                    cc.eventManager.removeListener(listener);
                                    setTimeout(function () {
                                        var scene = new UpdateScene();
                                        scene.run();
                                    }, 2000);
                                }
                                break;
                            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                            case jsb.EventAssetsManager.UPDATE_FINISHED:
                                cc.log('Update finished.');
                                if (cc.sys.isObjectValid(manager)) {
                                    if (manager.getLocalManifest().getVersion())
                                        window.curVersion = manager.getLocalManifest().getVersion();

                                    if (--retainCnt >= 0)
                                        manager.release();
                                }
                                that.loadGame();
                                break;
                            case jsb.EventAssetsManager.UPDATE_FAILED:
                                cc.log('Update failed. ' + event.getMessage());
                                if (cc.sys.isObjectValid(manager)) {
                                    manager.downloadFailedAssets();
                                }
                                break;
                            case jsb.EventAssetsManager.ERROR_UPDATING:
                                var str = '检查服务器信息失败, 请检查您的网络并尝试重启游戏';
                                progressLabel.setString(str);
                                // alert1(str);
                                if (cc.sys.isObjectValid(manager)) {
                                    if (--retainCnt >= 0)
                                        manager.release();
                                }
                                that.loadGame();
                                // cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                                break;
                            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                                var str = '检查服务器信息失败, 请检查您的网络并尝试重启游戏';
                                progressLabel.setString(str);
                                // alert1(str);
                                if (cc.sys.isObjectValid(manager)) {
                                    if (--retainCnt >= 0)
                                        manager.release();
                                }
                                that.loadGame();
                                // cc.log(event.getMessage());
                                break;
                            default:
                                break;
                        }
                    });
                }
                cc.eventManager.addListener(listener, 1);
                cc.director.runScene(this);
            }
            else {
                this.loadGame();
            }
            return true;
        },
        loadGame: function () {
            cc.loader.loadJs(['src/_files_.js'], function (err) {
                cc.loader.loadJs(jsFiles, function (err) {
                    App.init();
                    cc.loader.load(g_resources, function () {
                        App.run();
                    });
                });
            });
        }
    });

    exports.UpdateScene = UpdateScene;
})(window);
