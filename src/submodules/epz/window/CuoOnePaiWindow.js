/**
 * 搓牌
 * Created by duwei on 2018/7/25.
 */
(function () {
    var FSH = [
        "#ifdef GL_ES",
        "precision mediump float;",
        "#endif",

        "varying vec2 v_texCoord;",
        "varying vec4 v_fragmentColor;",
        // "uniform float posY;",
        // "uniform float height;",
        // "const float height = 0.1;",
        "uniform float posY10000;",
        "uniform float height100;",

        "void main()",
        "{",
        "    float posY = posY10000 * 0.0001;",
        "    float height = height100 * 0.01;",
        "    vec4 texColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);",
        "    if (v_texCoord.y < posY || v_texCoord.y + height >= 1. || posY + height * 2.35 >= 1.) {" +
        "        gl_FragColor = texColor;",
        "    } else if (v_texCoord.y >= posY + height) {" +
        "        gl_FragColor = vec4(0.);",
        "    } else {" +
        "        gl_FragColor = texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y + (v_texCoord.y - posY) * (.5+sin((v_texCoord.y - posY) / height * 3.1415926 / 2.))));",
        // "        gl_FragColor.a = 0.5;",
        "    }",
        "}"
    ].join("\r\n");


    var exports = this;
    var CuoOnePaiWindow = cc.Layer.extend({
        /** 牌背 */
        paibeiSprite: null,
        /** 牌背clip */
        paibeiSpriteClip: null,
        /** 牌 */
        paiSprite: null,
        /** 牌clip */
        paiSpriteClip: null,
        /** 点击起始点 */
        beginPos: cc.p(0, 0),
        /** 点击结束点 */
        endPos: cc.p(0, 0),
        /** 牌绘制初始位置 */
        paiPos: cc.p(0, 0),
        /** 牌背绘制初始位置 */
        paibeiPos: cc.p(0, 0),
        /** 牌clip绘制初始位置 */
        paiClipPos: cc.p(0, 0),
        /** 牌背clip绘制初始位置 */
        paibeiClipPos: cc.p(0, 0),
        /** 影子(横向大)绘制初始位置 */
        shadowPos: cc.p(0, 0),
        /** 影子(横向小)绘制初始位置 */
        shadow01Pos: cc.p(0, 0),
        /** 默认位移(点击立即发生) */
        defaultMoveY: 50,
        /** 牌缩放 */
        paiScale: 1,
        /** 牌偏移 */
        paiOffsetX: 1,
        /** 影子(横向大) */
        shadow: null,
        /** 影子(横向小) */
        shadow01: null,
        /** 影子(横向大) */
        maxMoveY: 200,
        spreadCount: 20,
        sen: 0.6,
        paiSize : cc.size(484, 354),
        beganPos : null,
        startPosY : 40,
        shadowOpacity : 120,
        shadowOpacityStageV: 5,
        shadowOpacitycoefficient: 100,

        onEnter: function () {
            this._super();
        },
        setPaiHua: function (pai, val) {
            //pai.setTexture('res/submodules/epz/image/base/cuopai/cuopai_'+val+'.png');
            pai.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('poker_epz/pai_'+val+'.png'));
        },
        ctor:function (typ, cuodata, handcards,room) {
            var that = this;
            this._super();
            this.data = cuodata;
            this.handcards = handcards || [];
            this.cardList = [];
            this.room = room;

            var layercolor = new cc.LayerColor(cc.color(0, 0, 0, 100), cc.winSize.width, cc.winSize.height);
            layercolor.setPosition(0, 100);
            this.addChild(layercolor);

            var touchlayer = new cc.LayerColor(cc.color(0, 0, 0, 100), cc.winSize.width, cc.winSize.height);
            touchlayer.setPosition(0, 100);
            this.addChild(touchlayer);

            if(this.handcards){
                for(var i=0;i<this.handcards.length;i++){
                    var card = new cc.Sprite();
                    card.setPosition(cc.p(cc.winSize.width/2 + (-this.handcards.length/2 + i) * 130, 610));
                    layercolor.addChild(card);
                    card.setScale(0.8);
                    this.setPaiHua(card, this.handcards[i]);
                }
            }

            this.setPosition(cc.p(0, -100));

            this.initPaiBei();
            this.initPai();
            this.initShadow();

            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, _) {
                    // var point = layercolor.convertTouchToNodeSpace(touch);
                    // if(point.x <= 300 || point.x >= cc.winSize.width - 300 || point.y >= cc.winSize.height - 200){
                    //     return true;
                    // }
                    // return false;

                    return true;
                },
                onTouchMoved: function (touch, _) {
                },
                onTouchEnded: function (touch, _) {
                }
            });
            cc.eventManager.addListener(chupaiListener, layercolor);
            this.addTouch(touchlayer);

            //关闭按钮
            var close = new cc.Sprite('res/image/ui/room/room_close.png');
            close.setPosition(cc.p(cc.winSize.width - 50, cc.winSize.height - 50));
            layercolor.addChild(close);
            TouchUtils.setOnclickListener(close, function () {
                that.room.showHandCard(false, null, true);
                that.removeFromParent();
            });
        },
        createProgramWithString : function (vshStr, fshStr) {
            if (cc.sys.isNative)
                return cc.GLProgram.createWithByteArrays(vshStr, fshStr);
            else {
                var program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(vshStr, fshStr);
                return program;
            }
        },
        update: function (dt) {
            this.updateShader();
        },
        updateShader : function(){
            if (this.beganPos == null || this.moveY < 0)
                return;
            if(this.moveY >= this.maxMoveY){
                this.moveY = this.maxMoveY-1;
                this.bigMoveY = true;
                this.beganPos.y = 282;

                var paiSpriteClipY = this.paiClipPos.y + this.moveY;
                var moveY = this.moveY;
                if (moveY != 0) {
                    moveY += this.defaultMoveY;
                }
                var paiSpriteY = this.paiPos.y + moveY - moveY * 0.2;
                //牌的遮罩层最终移动到的位置
                this.paiSpriteClipEndY = cc.winSize.height * 0.5;
                //牌的遮罩层当前位置 移动到起点位置的距离 / 移动的次数
                this.paiSpriteClipSpeed = parseInt(paiSpriteClipY - this.paiSpriteClipEndY) / this.spreadCount;
                this.paiSpriteSpeed = parseInt(Math.abs(paiSpriteY / this.spreadCount));
            }

            if (this.moveY > 0 && this.moveY < this.maxMoveY) {
                this.paibeiSprite.y = this.paibeiPos.y - this.moveY;
                this.paibeiSpriteClip.y = this.paibeiClipPos.y + this.moveY;
                this.paiSpriteClip.y = this.paiClipPos.y + this.moveY;
                this.shadow.y = this.shadowPos.y + this.moveY;
                if (this.moveY != 0) {
                    this.moveY += this.defaultMoveY;
                }
                this.paiSprite.y = this.paiPos.y + this.moveY - this.moveY * 0.2;
                this.moveY = undefined;
            }

            if(this.bigMoveY){
                this.beganPos.y += this.spreadCount;   //30
                this.paiSpriteClip.y -= this.paiSpriteClipSpeed;
                this.paiSprite.y += (this.paiSpriteSpeed);
                this.shadow.y -= this.paiSpriteClipSpeed;
                this.paibeiSprite.setVisible(false);

                if(this.paiSpriteClip.y < this.paiSpriteClipEndY){
                    this.unscheduleUpdate();
                    this.paiSprite.y = 0;
                    this.shadow.setVisible(false);
                    this.unscheduleUpdate();
                    this.paiSprite.y = 0;
                    this.shadow.setVisible(false);
                    //翻完了
                    this.cuoAniFinish = true;
                    this.scheduleOnce(function(){
                        this.cuoFinish();
                    }, 1);
                }
            }
            var value = parseInt(parseFloat(this.beganPos.y / this.paiSize.height) * 10000);
            var program = this.createProgramWithString(Filter.DEFAULT_VSH, FSH);
            program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            program.link();
            program.updateUniforms();
            program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
                glProgram_state.setUniformFloat('posY10000',value);
                glProgram_state.setUniformFloat('height100',10);
                this.paiSprite.setGLProgramState(glProgram_state);
            }
            else{
                this.paiSprite.shaderProgram = program;
                program.setUniformLocationWith1f(program.getUniformLocationForName('posY10000'),value);
                program.setUniformLocationWith1f(program.getUniformLocationForName('height100'),10);
            }
        },
        initPaiBei: function () {
            this.paibeiSprite = new cc.Sprite(epz_res.poker_epz_cuopai_bei);
            this.paibeiSpriteClip = this.createClipNode();
            this.addChild(this.paibeiSpriteClip);
            this.paibeiSpriteClip.addChild(this.paibeiSprite);
            this.paibeiClipPos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            this.paibeiPos = cc.p(0, 0);
            this.paibeiSpriteClip.setPosition(this.paibeiClipPos);
            this.paibeiSprite.setPosition(this.paibeiPos);
        },
        initPai: function () {
            this.paiSprite = new cc.Sprite('res/submodules/epz/image/base/cuopai/cuopai_'+this.data[0]+'.png');
            //this.paiSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('poker_epz/pai_'+this.data[0]+'.png'));
            this.paiSpriteClip = this.createClipNode();
            this.addChild(this.paiSpriteClip);
            this.paiSpriteClip.addChild(this.paiSprite);
            this.paiClipPos = cc.p(cc.winSize.width / 2 - this.paiOffsetX, cc.winSize.height / 2 + this.startPosY);
            this.paiPos = cc.p(
                0 ,
                0 - (this.paiSprite.getContentSize().height)
            );
            this.paiSprite.setPosition(this.paiPos);
            this.paiSpriteClip.setPosition(this.paiClipPos);
            this.paiSprite.setScale(this.paiScale);
        },

        initShadow: function () {
            this.shadow = new cc.Sprite(epz_res.poker_epz_cuopai_xian);
            this.addChild(this.shadow);
            this.shadowPos = cc.p(
                cc.winSize.width / 2 - this.paiOffsetX,
                cc.winSize.height * 0.5 - this.paiSprite.getContentSize().height * 0.5 + (this.startPosY + this.shadow.height * 0.5) - 8
            );
            this.shadow.setPosition(this.shadowPos);
            this.shadow.setVisible(false);
        },

        createClipNode: function () {
            var clipNode = new cc.ClippingNode();
            var stencil = new cc.Sprite(epz_res.poker_epz_cuopai_bai);
            clipNode.setStencil(stencil);
            clipNode.setAlphaThreshold(10);
            clipNode.setContentSize(cc.size(this.paibeiSprite.getContentSize().width, this.paibeiSprite.getContentSize().height));
            return clipNode;
        },
        addTouch: function (touchlayer) {
            var self = this;
            var paiBackWorldToNodeTransform = null;
            var chupaiListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, _) {
                    if(self.cuoAniFinish)  return;

                    var point = self.paibeiSprite.convertTouchToNodeSpace(touch);
                    if(point.x < 0 || point.x > self.paibeiSprite.width ||
                        point.y < 0 || point.y > (self.paibeiSprite.height * 0.4) ){
                        return false;
                    }
                    self.paibeiSpriteTouchPoint = point;
                    self.beginPos = touch.getLocation();
                    self.endMove();
                    self.beginMove();
                    self.moveY = 0;
                    self.temp = 0;
                    self.scheduleUpdate();
                    self.shadowOpacity = 120;
                    self.bigMoveY = false;
                    if (!paiBackWorldToNodeTransform)
                        paiBackWorldToNodeTransform = self.paibeiSprite.getWorldToNodeTransform();
                    self.beganPos = cc.pointApplyAffineTransform(touch.getLocation(), paiBackWorldToNodeTransform);

                    self.beganPosY = self.beganPos.y - 42;
                    self.beganPos.y = 42;
                    return true;
                },
                onTouchMoved: function (touch, _) {
                    var point = self.paibeiSprite.convertTouchToNodeSpace(touch);
                    if(self.bigMoveY || point.y < 0){
                        return;
                    }
                    self.endPos = touch.getLocation();
                    self.moveY = (self.endPos.y - self.beginPos.y) * self.sen;

                    if(point.y > (self.paibeiSprite.height * 0.1)){
                        var aaa = (255 - self.shadowOpacity) / self.shadowOpacitycoefficient;
                        var offsetY = parseInt(point.y - self.paibeiSpriteTouchPoint.y);
                        offsetY = offsetY < 0 ? 0 : offsetY;
                        var opacity = self.shadowOpacity + offsetY * aaa;
                        self.shadow.setOpacity(opacity > 255 ? 255 : opacity);
                    }

                    self.temp = self.moveY;
                    var pos = cc.pointApplyAffineTransform(touch.getLocation(), paiBackWorldToNodeTransform);
                    if (pos.y < 0)
                        return;
                    self.beganPos = pos;
                    self.beganPos.y -= self.beganPosY;
                },
                onTouchEnded: function (touch, _) {
                    if (self.bigMoveY) {
                    }else{
                        self.endMove();
                        self.unscheduleUpdate();
                    }
                }
            });
            cc.eventManager.addListener(chupaiListener, touchlayer);
        },
        beginMove: function () {
            this.shadowOpacity = 120;
            this.moveY = undefined;
            this.shadow.setVisible(true);
            this.shadow.setOpacity(this.shadowOpacity);
            this.paibeiSprite.setVisible(true);
            this.paiSprite.y = this.paiPos.y + this.defaultMoveY;
            this.shadow.setPosition(this.shadowPos);
            this.paibeiSprite.y = this.paibeiPos.y - this.startPosY;
            this.paibeiSpriteClip.y = this.paibeiClipPos.y + this.startPosY;
            this.paibeiClipPos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2 + this.startPosY);
            this.paibeiPos = cc.p(0,-this.startPosY);
        },
        endMove: function () {
            this.shadow.setPosition(this.shadowPos);
            this.shadow.setVisible(false);
            this.moveY = 0;
            this.moveY = undefined;
            this.paibeiClipPos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
            this.paibeiPos = cc.p(0, 0 );
            this.paibeiSprite.y = this.paibeiPos.y;
            this.paibeiSpriteClip.y = this.paibeiClipPos.y;
            this.paiSpriteClip.y = this.paiClipPos.y;
            this.paiSprite.y = this.paiPos.y ;
        },
        cuoFinish:function(){
            var cardArr = deepCopy(this.handcards);
            for (var k = 0; k < this.data.length; k++) {
                cardArr.push(this.data[k]);
            }
            this.room.showHandCard(true, cardArr);
            this.removeFromParent();
        }
    });
    exports.CuoOnePaiWindow = CuoOnePaiWindow;
})(window);
