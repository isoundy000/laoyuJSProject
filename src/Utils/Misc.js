(function (exports) {

    // exports.compareTwoNumbers = function (a, b) {
    //     return a - b
    // };
    //
    // exports.equleTo0 = function (n) {
    //     return n == 0;
    // };

    exports.I = function (res, plist) {
        if (plist) {
            var frame = cc.spriteFrameCache.getSpriteFrame(res);
            if (!frame) {
                cc.spriteFrameCache.addSpriteFrames(plist);
                frame = cc.spriteFrameCache.getSpriteFrame(res);
            }
            return frame;
        }
        return cc.textureCache.addImage(res);
    }

})(this);