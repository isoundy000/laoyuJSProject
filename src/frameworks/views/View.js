/**
 * 视窗基类
 * Created by zhangluxin on 16/8/4.
 */
var View = cc.Node.extend({
    /**
     * ccs文件名
     * @type {String}
     * @protected
     */
    _ccsFileName: null,
    /**
     * ccs根节点
     * @type {cc.Node}
     * @protected
     */
    _rootNode: null,
    /**
     * ccs动作
     * @type {cc.Action}
     * @protected
     */
    _rootAction: null,
    /**
     * 网络监听
     * @type {Object}
     * @protected
     */
    _networkListeners: {},
    /**
     * 网络监听
     * @type {Object}
     * @protected
     */
    _clickListeners: {},
    /**
     * 节点列表
     * @type {Object}
     * @protected
     */
    _nodeList: {},
    /**
     * 构造函数
     */
    ctor: function () {
        this._super();
        this._initView();
    },
    /**
     * 初始化
     * @private
     */
    _initView: function () {
        this._initCCS();
        this._addNetworkListeners();
        this._addClickListener();
    },
    /**
     * 初始化ccs
     * @private
     */
    _initCCS: function () {
        if (!this._ccsFileName) {
            return;
        }
        var ccsObj = ccs.load(this._ccsFileName, 'res/');
        this._rootNode = ccsObj.node;
        this._rootAction = ccsObj.action;
        if (!this._rootNode) {
            return;
        }
        this.addChild(this._rootNode);
        this._resolveCCS(this._rootNode);
    },
    /**
     * 执行ccs动作
     * @param {Boolean} [loop] 是否循环
     */
    runCCSAction: function (loop) {
        if (!this._rootAction) {
            return;
        }
        if (loop) {
            this.rootNode.runAction(cc.repeatForever(this._rootAction));
        } else {
            this.rootNode.runAction(this._rootAction);
        }
    },
    /**
     * 解析ccs
     * 同名同结构会发生覆盖现象
     * @param {cc.Node} node 要解析的节点
     * @param {String} [root] 上溯节点名
     * @private
     */
    _resolveCCS: function (node, root) {
        var self = this;
        if (!node) {
            return;
        }
        var name = null;
        if (node != this._rootNode) {
            name = node.getName();
            if (root) {
                name = root + '.' + name;
            }
            this._nodeList[name] = node;
        }
        var childlist = node.getChildren();
        _.forIn(childlist, function (child) {
            self._resolveCCS(child, name);
        });
    },
    /**
     * 添加网络监听
     * @private
     */
    _addNetworkListeners: function () {
        var self = this;
        _.forIn(self._networkListeners, function (listener, code) {
            if (!_.isString(listener) || !_.isFunction(self[listener])) {
                cc.error('没有该listener: ' + listener);
                return;
            }
            if (code.indexOf('GS') == 0) {
                if (!P[code]) {
                    cc.error('没有该code: ' + code);
                    return;
                }
                network.addCustomListener(P[code], self[listener].bind(self));
            } else {
                if (!MsgCode[code]) {
                    cc.error('没有该code: ' + code);
                    return;
                }
                network.addListener(MsgCode[code], self[listener].bind(self));
            }
        });
    },
    /**
     * 添加点击监听事件(支持sprite和button)
     * @private
     */
    _addClickListener: function () {
        var self = this;
        _.forIn(self._clickListeners, function (listener, nodeName) {
            var node = self._nodeList[nodeName];
            if (!node || !node instanceof cc.Node || !node.isValid()) {
                return;
            }
            if (!_.isString(listener) || !_.isFunction(self[listener])) {
                return;
            }
            if (node instanceof ccui.Button) {
                node.addClickEventListener(self[listener].bind(self));
            } else {
                TouchUtils.setOnclickListener(node, self[listener].bind(self));
            }
        });
    },
    /**
     * 移除网络监听
     * @private
     */
    _removeNetworkListeners: function () {
        network.removeListeners(_.keys(this._networkListeners));
    },
    /**
     * 退出处理
     */
    onExit: function () {
        this._removeNetworkListeners();
        this._super();
    }
});