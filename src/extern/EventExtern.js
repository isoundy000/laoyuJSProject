cc.Node.prototype.addCustomListener = function(eventName, callback){
    //cc.log("node addCustomListener +++++++++++++++++++++++");
    var listener = cc.eventManager.addCustomListener(eventName, callback);
    listener.retain();
    if(this._listenerList == null){
        this._listenerList = [];
    }
    this._listenerList.push(listener);
};

cc.Node.prototype.releaseCustomListener = function(){
    if(this._listenerList != null){
        for(var key in this._listenerList){
            var listener = this._listenerList[key];
            //cc.log("release listener ========", listener);
            cc.eventManager.removeListener(listener);
            listener.release();
        }
    }
    this._listenerList = null;
};

cc.Node.prototype.checkNoRunning = function(){
    if(!cc.sys.isNative){
        if(this == null)
            return true;
        else if(this.getParent() == null){
            this.releaseCustomListener();
            return true;
        }
        return false;
    }


    if(cc.sys.isObjectValid(this) == false){
        this.releaseCustomListener();
        return true;
    }
    return false;
};

function onReleaseJS(){
    //cc.log("show layer on Exit +++++++++++++++++++++++");
    if(this.coms != null){
        for(var key in this.coms){
            this.coms[key].onReleaseJS();
        }
    }
    this.coms = null;
    this.releaseCustomListener();
}

function getLength(obj){
    return Object.getOwnPropertyNames(obj).length;
}