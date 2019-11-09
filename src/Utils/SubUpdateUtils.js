(function (exports) {
    /**
     * 玩法热更工具
     * @type {object}
     */
    exports.SubUpdateUtils = {

        assetsManager: null,
        assetsManagerListener: null,
        callback: null,
        newVersion: null,

        /**
         * 打开creatRoom界面
         * @param sub
         * @param isDaikai
         * @param club_id
         * @param isSetWanfa
         * @param setwanfapos
         */
        showCreateRoom: function (sub, isDaikai, club_id, isSetWanfa, setwanfapos) {
            var that = this;
            this.newVersion = null;
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            var subSrc = 'src/submodules/' + sub + '/' + sub + '.jsc';
            if (!cc.sys.isNative || jsb.fileUtils.isFileExist(manifestDirPath + subSrc)) {
                this.loadSubGame(sub, function () {
                    hideLoading();
                    var createRoomLayer = new CreateRoomLayer(sub, isDaikai, club_id, isSetWanfa, setwanfapos);
                    createRoomLayer.setName('createRoomLayer');
                    if (window.maLayer) {
                        window.maLayer.addChild(createRoomLayer);
                    }
                });
            } else {
                var verjson = this.getLocalVersion();
                verjson[sub] = '1.0.0';
                cc.sys.localStorage.setItem(gameData.appName + '-sub-version', JSON.stringify(verjson));
                that.requestSubVersion(sub, function (version) {
                    that.checkUpdate(null, sub, version, function () {
                        hideLoading();
                        var createRoomLayer = new CreateRoomLayer(sub, isDaikai, club_id, isSetWanfa, setwanfapos);
                        createRoomLayer.setName('createRoomLayer');
                        if (window.maLayer) {
                            window.maLayer.addChild(createRoomLayer);
                        }
                    });
                });
            }
        },

        showCreateJBC_PDK: function (sub) {
            var that = this;
            this.newVersion = null;
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            var subSrc = 'src/submodules/' + sub + '/' + sub + '.jsc';
            if (!cc.sys.isNative || jsb.fileUtils.isFileExist(manifestDirPath + subSrc)) {
                this.loadSubGame(sub, function () {
                    window.paizhuo == "pdk_jbc"
                    // cc.director.runScene(new JBCMainLayer());
                    var createJBCLayer = new JBCMainLayer();
                    createJBCLayer.setName('createJBCLayer');
                    window.jbScene = createJBCLayer;
                    if (window.maLayer) {
                        window.maLayer.addChild(createJBCLayer);
                    }
                });
            } else {
                var verjson = this.getLocalVersion();
                verjson[sub] = '1.0.0';
                cc.sys.localStorage.setItem(gameData.appName + '-sub-version', JSON.stringify(verjson));
                that.requestSubVersion(sub, function (version) {
                    that.checkUpdate(null, sub, version, function () {
                        hideLoading();
                        // cc.director.runScene(new JBCMainLayer());
                        var createJBCLayer = new JBCMainLayer();
                        window.jbScene = createJBCLayer;
                        createJBCLayer.setName('createJBCLayer');
                        if (window.maLayer) {
                            window.maLayer.addChild(createJBCLayer);
                        }
                    });
                });
            }
        },        /**
         * 打开游戏场景
         * @param data
         */
        showGameScene: function (data) {
            console.log("打开游戏场景");
            this.newVersion = null;
            var sub = null;
            var that = this;
            var key = findKey(MAP_ID, gameData.mapId);
            if (key) {
                sub = MAP_ID_2_SUB[key];
            }
            if (!sub) {
                cc.error('未知游戏场景！');
                return;
            }
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            var subSrc = 'src/submodules/' + sub + '/' + sub + '.jsc';
            if (!cc.sys.isNative || jsb.fileUtils.isFileExist(manifestDirPath + subSrc)) {
                this.loadSubGame(sub, function () {
                    cc.director.runScene(new GameScene(data));
                });
            } else {
                var verjson = this.getLocalVersion();
                verjson[sub] = '1.0.0';
                cc.sys.localStorage.setItem(gameData.appName + '-sub-version', JSON.stringify(verjson));
                network.stop();
                that.requestSubVersion(sub, function (version) {
                    that.checkUpdate(null, sub, version, function () {
                        that.loadSubGame(sub, function () {
                            cc.director.runScene(new GameScene(data));
                        });
                    });
                });
            }
        },

        /**
         * 请求sub最新版本号
         * @param sub
         * @param callback
         */
        requestSubVersion: function (sub, callback) {
            if (!cc.sys.isNative) {
                callback();
                return;
            }
            // 请求最新的sub版本
            NetUtils.httpGet(gameData.updateSubUrl + 'sub-v-' + sub + '.manifest',
                function (data) {
                    var version = null;
                    try {
                        var dataJson = JSON.parse(data);
                        version = dataJson.version;
                    } catch (e) {
                    }
                    callback(version);
                },
                function () {
                    alert1('请求模块版本失败!');
                }
            );
        },

        /**
         * 检查更新
         * @param url
         * @param {string} sub 子模块
         * @param {object} version 版本号
         * @param {function} callback
         */
        checkUpdate: function (url, sub, version, callback) {
            if (url) {
                gameData.updateSubUrl = url;
            }
            cc.log(gameData.updateSubUrl);
            //热更新加参数
            // if(gameData.updateSubUrl && gameData.updateSubUrl.indexOf('?') < 0){
            //     gameData.updateSubUrl += '?uid=' + gameData.uid + '&time=' + getCurTimemills();
            // }
            if (!sub) {
                this.updateFail(sub, '拉取模块为空!');
                return;
            }
            if (!callback) {
                this.updateFail(sub, '拉取模块回调为空');
                return;
            }
            this.callback = callback;
            var newVersion = version;
            if (!cc.sys.isNative) {
                this.loadSubGame(sub);
                return;
            }
            var localVersion = this.getLocalVersion()[sub];
            // 如果版本号相同，直接进入sub
            if (localVersion === newVersion) {
                this.loadSubGame(sub);
                return;
            }
            this.clearOldFiles(sub);
            var createResult = this.createManiFest(sub);
            if (!createResult) {
                this.updateFail(sub, '创建manifest失败');
                return;
            }
            this.startUpAssetsManager(sub);
        },

        /**
         * 删除旧文件
         */
        clearOldFiles: function (sub) {
            // manifest目录
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            // manifest文件名
            var manifestFileName = 'sub-' + sub + '.manifest';
            // manifest文件
            var manifestFile = manifestDirPath + manifestFileName;
            // manifest temp文件
            var manifestTempFile = manifestDirPath + 'version.manifest.tmp';
            // manifest temp文件
            var manifestvFile = manifestDirPath + 'version.manifest';
            // manifest temp文件
            var manifestTempFile2 = manifestDirPath + 'project.manifest.tmp';
            // manifest temp文件
            var manifestvFile2 = manifestDirPath + 'project.manifest';
            // 清除一些临时文件
            if (!jsb.fileUtils.isDirectoryExist(manifestDirPath)) {
                jsb.fileUtils.createDirectory(manifestDirPath);
            }
            if (jsb.fileUtils.isFileExist(manifestFile)) {
                jsb.fileUtils.removeFile(manifestFile);
            }
            if (jsb.fileUtils.isFileExist(manifestTempFile)) {
                jsb.fileUtils.removeFile(manifestTempFile);
            }
            if (jsb.fileUtils.isFileExist(manifestvFile)) {
                jsb.fileUtils.removeFile(manifestvFile);
            }
            if (jsb.fileUtils.isFileExist(manifestTempFile2)) {
                jsb.fileUtils.removeFile(manifestTempFile2);
            }
            if (jsb.fileUtils.isFileExist(manifestvFile2)) {
                jsb.fileUtils.removeFile(manifestvFile2);
            }
        },

        /**
         * 获取本地的version存档
         */
        getLocalVersion: function () {
            var verItem = cc.sys.localStorage.getItem(gameData.appName + '-sub-version');
            if (!verItem) {
                verItem = this.createLocalVersion();
            }
            var verjson = {};
            try {
                verjson = JSON.parse(verItem);
            } catch (e) {
            }
            return verjson;
        },

        /**
         * 建立新的本地的version存档
         */
        createLocalVersion: function () {
            var verjson = {};
            for (var id in SUB_MODULE) {
                if (SUB_MODULE.hasOwnProperty(id)) {
                    verjson[SUB_MODULE[id]] = '1.0.0';
                }
            }
            return JSON.stringify(verjson);
        },

        /**
         * 创建manifest(此manifest是假的)
         * @param sub
         * @returns {bool} 建文件是否成功
         */
        createManiFest: function (sub) {
            var mainfest = {
                packageUrl: gameData.updateSubUrl + 'update/',
                remoteVersionUrl: gameData.updateSubUrl + 'sub-v-' + sub + '.manifest',
                remoteManifestUrl: gameData.updateSubUrl + 'sub-p-' + sub + '.manifest',
                version: '1.0.0',
                groupVersions: { '0': '1.0.0' },
                engineVersion: 'Cocos2d-JS v3.8.1'
            };
            // manifest目录
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            // manifest文件名
            var manifestFileName = 'sub-' + sub + '.manifest';
            // manifest文件
            var manifestFile = manifestDirPath + manifestFileName;
            return jsb.fileUtils.writeStringToFile(JSON.stringify(mainfest), manifestFile);
        },

        /**
         * 启动AssetsManager
         * @param sub
         */
        startUpAssetsManager: function (sub) {
            var that = this;
            // manifest目录
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            // manifest文件名
            var manifestFileName = 'sub-' + sub + '.manifest';
            this.removeAssetsManager();
            this.assetsManager = new jsb.AssetsManager(sub + '/' + manifestFileName, manifestDirPath);
            this.assetsManager.retain();
            this.assetsManager.update();
            showLoading('正在检查更新中..', true);
            this.assetsManagerListener = new jsb.EventListenerAssetsManager(this.assetsManager, function (event) {
                console.log('event.getEventCode() = ' + event.getEventCode());
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                        console.log('即将更新..');
                        // that.showUpdateLayer();
                        showLoading('即将更新..', true);
                        break;
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        that.updateFail(sub, '本地manifest错误');
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        that.changePercent(event.getPercent().toFixed(2));
                        console.log(event.getPercent() + '% ..');
                        break;
                    case jsb.EventAssetsManager.ASSET_UPDATED:
                        console.log('资源更新完毕');
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        that.updateFail(sub, '下载manifest失败');
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        that.newVersion = that.assetsManager.getLocalManifest().getVersion();
                        that.updateSucess(sub);
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        that.updateFail(sub, '更新模块文件失败1');
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        that.updateFail(sub, '更新模块文件失败2');
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        that.updateFail(sub, '更新模块文件失败3');
                        break;
                    default:
                        that.updateFail(sub, '更新模块文件失败4');
                        break;
                }
            });
            cc.eventManager.addListener(this.assetsManagerListener, 1);
        },

        /**
         * 加载sub
         */
        loadSubGame: function (sub, callback) {
            DeviceUtils.addSearchPath(cc.sys.writablePath + sub);
            var submoduleSrc = 'src/submodules/' + sub + '/' + sub + '.js';
            var that = this;

            //修改了玩法  清除只下之前的
            cc.sys.cleanScript(submoduleSrc);
            cc.sys.cleanScript(submoduleSrc + 'c');

            cc.loader.loadJs(submoduleSrc, function () {
                var subRes = window[sub + '_res'];
                var subSrc = window[sub + '_src'];
                cc.loader.load(_.values(subRes), function () {
                    // 把模块的res塞进res里面，会覆盖res里面现有的
                    if (cc.sys.isNative) {
                        _.assign(res, subRes);

                        _.forIn(subSrc, function (jsfile) {
                            cc.sys.cleanScript(jsfile);
                            cc.sys.cleanScript(jsfile + 'c');
                        });

                        cc.loader.loadJs(subSrc, function () {
                            if (callback) {
                                callback();
                            } else {
                                that.callback();
                            }
                        });
                    } else {
                        cc.loader.load(_.values(subRes), function () {
                            // 把模块的res塞进res里面，会覆盖res里面现有的
                            _.assign(res, subRes);
                            cc.loader.loadJs(subSrc, function () {
                                if (callback) {
                                    callback();
                                } else {
                                    that.callback();
                                }
                            });
                        });
                    }
                });
            });
        },

        /**
         * 更新成功
         */
        updateSucess: function (sub) {
            var arr = window[sub + '_src'];
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    cc.sys.cleanScript(arr[i]);
                    cc.sys.cleanScript(arr[i] + 'c');
                }
                delete window[sub + '_src'];
                window[sub + '_src'] = null;
            }
            cc.loader.releaseAll();
            window.ccsCache = {};//清理ccs缓存

            cc.textureCache.removeAllTextures();
            cc.spriteFrameCache.removeSpriteFrames();
            // this.closeUpdateLayer();
            this.removeAssetsManager();
            this.saveLocalVersion(sub);
            this.loadSubGame(sub);
        },

        /**
         * 更新失败
         * @param sub
         * @param error
         */
        updateFail: function (sub, error) {
            console.log('error = ' + error);
            alert1('拉取模块"' + sub + '"失败: ' + error);
            // this.closeUpdateLayer();
            this.removeAssetsManager();
        },

        /**
         * 存储本地版本号
         * @param sub
         */
        saveLocalVersion: function (sub, version) {
            var verjson = this.getLocalVersion();
            if (version) {
                verjson[sub] = version;
            } else {
                verjson[sub] = this.newVersion;
            }
            console.log( JSON.stringify(verjson));
            cc.sys.localStorage.setItem(gameData.appName + '-sub-version', JSON.stringify(verjson));
        },

        /**
         * 展示update界面
         */
        showUpdateLayer: function () {
            // this.closeUpdateLayer();
            window.updateSubLayer = ccs.load(res.UpdateSubLayer_json, 'res/').node;
            if (window.updateSubLayer) {
                cc.director.getRunningScene().addChild(window.updateSubLayer, 9999);
            }
        },

        /**
         * 关闭update界面
         */
        closeUpdateLayer: function () {
            if (window.updateSubLayer && cc.sys.isObjectValid(window.updateSubLayer)) {
                window.updateSubLayer.removeFromParent(true);
                window.updateSubLayer = null;
            }
            // hideLoading();
        },

        /**
         * 改变percent
         * @param percent
         */
        changePercent: function (percent) {
            showLoading('正在更新: ' + percent + '%', true);
        },
        /**
         * 清除所有子模块
         * @public
         * */
        clearAllSubmodules: function () {
            var versions = this.getLocalVersion();
            var keys = Object.keys(versions);

            for (var i = 0; i < keys.length; i++) {
                // 1.处理资源
                var module_res = window[keys[i] + '_res'];
                if (module_res) {
                    var values = _.values(module_res);
                    for (var k = 0; k < values.length; k++) {
                        cc.loader.release(values[k]);
                    }
                }

                var jsFiles = window[keys[i] + '_src'];
                if (jsFiles) {
                    // if (cc.sys.isNative) {
                    for (var j = 0; j < jsFiles.length; j++) {
                        if (cc.sys.isNative) {
                            cc.sys.cleanScript(jsFiles[i]);
                            cc.sys.cleanScript(jsFiles[i] + 'c');
                        }
                        delete window[keys[i] + '_src'];
                        window[keys[i] + '_src'] = null;
                    }
                    // cc.sys.cleanScript(this._srcSubmodulesPath + keys[i] + "/" + keys[i] + ".js");
                    // cc.sys.cleanScript(this._srcSubmodulesPath + keys[i] + "/" + keys[i] + ".jsc");
                    var submoduleSrc = 'src/submodules/' + keys[i] + '/' + keys[i] + '.js';
                    cc.sys.cleanScript(submoduleSrc);
                    cc.sys.cleanScript(submoduleSrc + 'c');
                    // } else {
                    delete window[keys[i] + '_src'];
                    window[keys[i] + '_src'] = null;
                    // }
                }

                // 2.处理native
                if (cc.sys.isNative) {
                    var submodule_path = cc.sys.writablePath + keys[i] + '/';
                    if (jsb.fileUtils.isDirectoryExist(submodule_path));
                    jsb.fileUtils.removeDirectory(submodule_path);

                }
            }
            cc.sys.localStorage.setItem(this._submodulesVersion, JSON.stringify({}));
        },

        /**
         * 删除assetsManager
         */
        removeAssetsManager: function () {
            if (this.assetsManager) {
                this.assetsManager.release();
                this.assetsManager = null;
            }
            if (this.assetsManagerListener) {
                cc.eventManager.removeListener(this.assetsManagerListener);
                this.assetsManagerListener = null;
            }
        },

        handleKWXMapId: function (data) {
            if (gameData.mapId != 2) {
                return;
            }
            if (!data) {
                return;
            }
            if (!data.desp) {
                return;
            }
            var despArr = data.desp.split(',');
            var mapName = despArr[0];
            console.log('玩法：' + mapName);
            switch (mapName) {
                case '襄阳卡五星':
                    gameData.mapId = 50;
                    break;
            }
        },


        //比赛场
        showCreateMatch:function(sub, callback){
            var that = this;
            this.newVersion = null;
            var manifestDirPath = cc.sys.writablePath + sub + '/';
            var subSrc = 'src/submodules/' + sub + '/' + sub + '.jsc';
            if(!cc.sys.isNative){
                this.loadSubGame(sub, function () {
                    hideLoading();
                    if(sub == 'bisaichang'){
                        that._showCreateMatchWindow();
                    }else if(sub == 'club'){
                        that._showCreateClub();
                    }
                    if(callback){
                        callback();
                    }
                });
            }else if (jsb.fileUtils.isFileExist(manifestDirPath + subSrc)) {
                if(sub == 'bisaichang') {
                    network.send(2006, {map_id: MAP_ID.MATCHHALL, source: MAP_ID.MATCHHALL});
                }else if(sub == 'pdk_match'){
                    gameData.lastMatchSignFunc = callback;
                    network.send(2006, {map_id: MAP_ID.PDK_MATCH, source: MAP_ID.PDK_MATCH});
                }else if(sub == 'club'){
                    network.send(2006, {map_id: MAP_ID.CLUBHALL, source: MAP_ID.CLUBHALL});
                }
            } else {
                var verjson = this.getLocalVersion();
                verjson[sub] = '1.0.0';
                cc.sys.localStorage.setItem(gameData.appName + '-sub-version', JSON.stringify(verjson));
                that.requestSubVersion(sub, function (version) {
                    that.checkUpdate(null, sub, version, function () {
                        hideLoading();
                        if(sub == 'bisaichang')  {
                            that.loadSubGame(sub, function () {
                                var matchl = new MatchMainLayer();
                                matchl.setName('matchmainlayer');
                                window.maLayer.addChild(matchl);
                            });
                        }else if(sub == 'club'){
                            that.loadSubGame(sub, function () {
                                that._showCreateClub();
                            });
                        }
                        if(callback){
                            callback();
                        }
                    });
                });
            }
        },
        _showCreateMatchWindow:function(sub){
            var self = this;
            var matchl = new MatchMainLayer();
            matchl.setName('matchmainlayer');
            window.maLayer.addChild(matchl);

        },
        _showCreateClub: function(){
            var self = this;
            var clubl = new ClubMainLayer();
            clubl.setName('ClubLayer');
            window.maLayer.addChild(clubl);
        },
        /**
         * 打开checkUpdateSubByMapId界面
         * @param mapId
         * @param callback
         */
        checkUpdateSubByMapId: function (mapId, callback) {
            showLoading('正在解析模块资源...');
            var key = findKey(MAP_ID, mapId);
            var sub = null;
            if (key) {
                sub = MAP_ID_2_SUB[key];
            }
            if(!sub){
                return alert1('更新未知模块！');
            }
            this.showCreateMatch(sub, callback);
        },

    };
})(window);