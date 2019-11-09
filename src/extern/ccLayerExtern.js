//function copyProp(obj1, obj2){
//
//    // Copy the properties over onto the new prototype
//    for (var name in obj2) {
//        // Check if we're overwriting an existing function
//        fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
//
//        obj1[name] =
//            typeof obj2[name] == "function" &&
//            typeof _super[name] == "function" &&
//            fnTest.test(obj2[name]) ? (function (name, fn) {
//                return function () {
//                    var tmp = this._super;
//
//
//                    // The method only need to be bound temporarily, so we
//                    // remove it when we're done executing
//                    var ret = fn.apply(this, arguments);
//                    this._super = tmp;
//
//                    return ret;
//                };
//            })(name, obj2[name]) :
//            obj2[name];
//    }
//}

load_ccs = function(ccsFile, ccsCls){
    //var time1 = Date.now();
    var ccsNode = ccs.load("res/ccs/"+ccsFile+".json", "res/");
    //cc.log("cost time 123------- ", Date.now() - time1, ccsFile);
    var node = ccsNode.node;
    ccui.helper.doLayout(node);
    if(ccsCls != null)
    {
        for(var key in ccsCls){
            node[key]=ccsCls[key]
        }
    }
    return node;
    //this.addChild(ccsNode.node);
    //this.node = ccsNode.node;
};

/**
 * @param name
 * @param type
 * @returns {cc.Node}
 */
getCom = function(p, name, type){
    if(type == null)
    {
        cc.log("check you function getCom");
        return null;
    }

    //var node = p.getChildByName(name);
    var node = seekNodeByName(p, name);
    if(node == null)
        return null;

    for(var key in type){
        node[key]=type[key]
    }

    if(node.init != null)
        node.init();


    node.onReleaseJS = onReleaseJS.bind(node);
    if(p.coms == null)
        p.coms = [];
    p.coms.push(node);

    return node;
};


var EXT = {
    BUTTON1:0,
    TXT_OUTLINE:1

};

/**
 * Finds a widget whose name equals to param name from root widget.
 * @param name
 * @returns {ccui.Widget}
 */
getUI = function(p, name, ext){
    var node = seekNodeByName(p, name);
    if(ext != null){
        switch (ext){
            case EXT.BUTTON1:
                initButtonExt1(node);
                break;
            case EXT.TXT_OUTLINE:
                node.enableOutline(cc.color(0,0,0), 2);
        }

    }
    return node;
};

/**
 * Finds a widget whose name equals to param name from root widget.
 * @param name
 * @returns {ccui.Widget}
 */
getCell = function(p, type, cell){
    var node = p.clone();

    //for(var key in TableViewCell){
    //    node[key]=TableViewCell[key]
    //}

    for(var key in type){
        node[key]=type[key]
    }
    if(node.init != null){
        node.init();
    }
    node.setSwallowTouches(false);

    if(cell != null){
        cell.addChild(node);
        cell.node = node;
    }
    return node;
};

seekNodeByName = function (root, name) {
    if (!root)
        return null;

    var find = root.getChildByName(name);
    if (find != null)
        return find;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var res = seekNodeByName(child, name);
        if (res !== null)
            return res;
    }
    return null;
},

checkNull = function(obj){
    if (obj == null)
        cc.log("this object is null .....");
    else
        cc.log("this object is not null .....");
};

cc.Node.prototype.show = function(parent){
    cc.log("show layer +++++++++++++++++++++++");

    this.setScale(0.01);
    this.setAnchorPoint(0.5, 0.5);
    this.setPosition(cc.winSize.width*0.5, cc.winSize.height*0.5);
    var mask = parent.getChildByTag(8888);
    if(mask != null)
        mask.setVisible(false);

    var action1 = cc.scaleTo(0.2, 1).easing(cc.easeBackOut());
    //var action1 = cc.scaleTo(0.1, 1.1);
    var action2 = cc.callFunc(function(){
        if(mask != null)
            mask.setVisible(true);
    }, this);
    //var action3 = cc.scaleTo(0.1, 1);
    var seq = cc.sequence(action2, action1);
    this.runAction(seq);
};

cc.Node.prototype.hide = function(noAnimation){
    cc.log("hide layer +++++++++++++++++++++++");
    hideMask(this);

    if(noAnimation == true || noAnimation == null){
        this.removeFromParent(true);
    }else{
        var action1 = cc.scaleTo(0.1, 0.01);
        var action2 = cc.callFunc(function(){
            this.removeFromParent(true);
        }, this);
        var seq = cc.sequence(action1, action2);
        this.runAction(seq);
    }
};

function showMask(p, parent){
    //var mask = p.getParent().getChildByTag(8888);
    //if (mask != null)
    //    mask.removeFromParent(true);

    //var colorLayer = new cc.LayerColor(cc.color(255, 255, 255), cc.winSize.width, cc.winSize.height);
    var colorLayer = new ccui.Layout();
    colorLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    colorLayer.setBackGroundColor(cc.color(0, 0, 0));
    colorLayer.setBackGroundColorOpacity(180);
    colorLayer.setContentSize(cc.winSize.width, cc.winSize.height);
    parent.addChild(colorLayer);
    colorLayer.setTag(8888);
    colorLayer.setTouchEnabled(true);
    colorLayer.setSwallowTouches(true);
    p.maskLayer = colorLayer;
    //colorLayer.setLocalZOrder(1000);
};

function hideMask(p){
    //var mask = p.getParent().getChildByTag(8888);
    var mask = p.maskLayer;
    if (mask != null && mask.checkNoRunning() == false)
    {
        //cc.log("remove mask =========================");
        mask.removeFromParent(true);
    }
};

function getParentByName(p, name){
    var target = null;
    while(p.getParent() != null){
        p = p.getParent();
        if(p.getName() == name){
            target = p;
            break;
        }
    }
    return target;
}


