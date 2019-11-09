function touch_process(sender, type) {
    var goPress = false;
    var isClicked = false;
    var that = sender;
    if(!that.eScale){
        that.eScale = that.getScaleX();
    }
    switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            that.notClick = false;
            goPress = true;
            break;
        case ccui.Widget.TOUCH_MOVED:
            var pt = sender.getTouchMovePosition();
            var ptStart = sender.getTouchBeganPosition();;
            var distance = cc.pDistance(ptStart, pt);
            if(distance > 100 || that.notClick == true){
                goPress = false;
                that.notClick = true;
                break;
            }

            if(sender.hitTest(pt))
                goPress = true;
            else
                goPress = false;
            break;
        case ccui.Widget.TOUCH_ENDED:
            playEffect('vButtonClick');

            goPress = false;
            if(that.notClick == true){
                break;
            }
            isClicked = true;
            break;
        case ccui.Widget.TOUCH_CANCELED:
            goPress = false;
            break;
        default:
            break;
    }

    if(goPress != that.press){
        that.stopAllActions();
        if(goPress == true)
            that.runAction(cc.scaleTo(0.05, 0.9 * that.eScale));
        else
            that.runAction(cc.scaleTo(0.05, 1.0 * that.eScale));
        that.press = goPress;
    }

    return isClicked;
};


function touch_process_bt(type){
    switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            break;

        case ccui.Widget.TOUCH_MOVED:
            break;

        case ccui.Widget.TOUCH_ENDED:
            return true;
            break;

        case ccui.Widget.TOUCH_CANCELED:
            break;

        default:
            break;
    }
    return false;
}

function newTouch(x, y){
    var touch = null;
    if(cc.sys.isNative == true){
        touch = new cc.Touch(0, x, SH-y);
    }else{
        touch = new cc.Touch(x, y, 0);
    }
    return touch;
}