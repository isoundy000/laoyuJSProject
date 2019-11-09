var Filter = {

    DEFAULT_VERTEX_SHADER:
    "attribute vec4 a_position; \n"
    + "attribute vec2 a_texCoord; \n"
    + "varying vec2 v_texCoord; \n"
    + "void main() \n"
    + "{ \n"
    + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
    + "    v_texCoord = a_texCoord; \n"
    + "}",

    GRAY_SCALE_FRAGMENT_SHADER:
    "varying vec2 v_texCoord;   \n"
    //+ "uniform sampler2D CC_Texture0; \n"   //cocos2d 3.0jsb 3.1jsb/html5开始自动加入这个属性，不需要手工声明
    + "void main() \n"
    + "{  \n"
    + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
    + "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114; \n"
    //+ "    float gray = texColor.r * 1.0 + texColor.g * 1.0 + texColor.b * 1.0; \n"
    + "    gl_FragColor = vec4(gray,gray,gray,texColor.a);  \n"
    + "}",

    SEPIA_FRAGMENT_SHADER:
    "varying vec2 v_texCoord;   \n"
        //+ "uniform sampler2D CC_Texture0; \n"
    + "uniform float u_degree; \n"
    + "void main() \n"
    + "{  \n"
    + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
    + "    float r = texColor.r * 0.393 + texColor.g * 0.769 + texColor.b * 0.189; \n"
    + "    float g = texColor.r * 0.349 + texColor.g * 0.686 + texColor.b * 0.168; \n"
    + "    float b = texColor.r * 0.272 + texColor.g * 0.534 + texColor.b * 0.131; \n"
    + "    gl_FragColor = mix(texColor, vec4(r, g, b, texColor.a), float(u_degree));  \n"
    + "}",


    programs:{},

    /**
     * 灰度
     * @param sprite
     */
    grayScale: function (sprite) {
        var program = Filter.programs["grayScale"];
        if(!program){
            program = new cc.GLProgram();
            //program.retain();          //jsb需要retain一下，否则会被回收了
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.GRAY_SCALE_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            Filter.programs["grayScale"] = program;
        }
        gl.useProgram(program.getProgram());
        sprite.shaderProgram = program;
    },

    /**
     * 造旧
     * @param sprite
     * @param degree 旧的程度 0~1
     */
    sepia: function (sprite, degree) {
        var program = Filter.programs["sepia"+degree];
        if(!program){
            program = new cc.GLProgram();
            program.retain();
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.SEPIA_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();

            /*
             这两句只在html5中有效，在jsb中失效。原因可能是native版本绘制sprite前把这个glprogram重置了，丢掉了参数。
             var degreeLocation = program.getUniformLocationForName("u_degree");
             gl.uniform1f(degreeLocation, degree);
             */

            Filter.programs["sepia"+degree] = program;
        }
        gl.useProgram(program.getProgram());
        sprite.shaderProgram = program;

        sprite.scheduleUpdate();
        sprite.update = function(){
            program.use();
            program.setUniformsForBuiltins();
            var degreeLocation = program.getUniformLocationForName("u_degree");
            gl.uniform1f( degreeLocation, degree);     //这个函数由于jsb实现有问题，在手机侧实际只能传递整数，需要注意。html5是正常的。
        };

    }
};

function createGraySprite(fileName, isSpriteFrameName){
    var img = "";
    if(cc.sys.isNative == true){
        img = new ccui.Scale9Sprite(fileName);
    }else{
        if(isSpriteFrameName == true){
            img = new cc.Sprite();
            img.initWithSpriteFrameName(fileName);
        }else{
            img = new cc.Sprite(fileName);
        }
    }
    return img;
}

function setGray(sprite){
    if(cc.sys.isNative == true){
        sprite.setState(1);
    }else{
        Filter.grayScale(sprite);
    }
};


function getLabelLength(strValue, size){
    var lab = new cc.LabelTTF(strValue);
    size = size || 20;
    lab.setFontSize(size);
    return lab.getContentSize().width;
}

function setRichLabel(p, txtList, size, offset){
    p.removeAllChildren();
    var offsetX = 0;
    var ox = 0;
    offset = offset || 5;
    for(var i=0; i<txtList.length; i++){
        //var txt = new ccui.Text();
        if(txtList[i].t != null){
            var txt = new cc.LabelTTF();
            var strValue = txtList[i].t.toString();
            txt.setString(strValue);
            txt.setFontSize(size);
            txt.setColor(txtList[i].c);

            if(txtList[i].o != null)
                txt.enableStroke(txtList[i].o, 2);

            if(txtList[i].x != null)ox = txtList[i].x;
            txt.setPosition(offsetX + ox, 0);
            txt.setAnchorPoint(0, 0.5);
            p.addChild(txt);
            offsetX += txt.getContentSize().width + offset + ox;
        }else if(txtList[i].s != null){
            var img;
            if(txtList[i].f == true){
                img = new cc.Sprite();
                img.initWithSpriteFrameName(txtList[i].s.toString());
            }else{
                img = new cc.Sprite(txtList[i].s.toString());
            }

            if(txtList[i].x != null)ox = txtList[i].x;
            img.setPosition(offsetX + ox, 0);
            img.setAnchorPoint(0, 0.5);
            p.addChild(img);
            offsetX += img.getContentSize().width + offset + ox;
        }
    }
    return offsetX;
}

function setTextInBorder(p, key, value){
    getUI(p, key).setString(value);
}

function setDateStr(objDate)
{
    var year=objDate.getFullYear();
    var month=objDate.getMonth()+1;
    var day=objDate.getDate();
    var hours=objDate.getHours();
    var minutes=objDate.getMinutes();
    var seconds=objDate.getSeconds();
    var date = year+"/"+(month < 10 ? "0" + month : month)+"/"+(day < 10 ? "0" + day : day)+" "+
        (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return date;
}

function updateAudio(){
    var soundCfg = LD.get(LD.K_AUDIO_SOUND);
    var effectCfg = LD.get(LD.K_AUDIO_EFFECT);
    if(soundCfg == "" || soundCfg == "1"){
        AudioEngine.setMusicVolume(1);
    }else{
        AudioEngine.setMusicVolume(0);
    }

    if(effectCfg == "" || effectCfg == "1"){
        AudioEngine.setEffectsVolume(1);
    }else{
        AudioEngine.setEffectsVolume(0);
    }
}

function testFunction(){
    //var card = [1,2,3,3,6,6,11,13,15,16,18,20,20,20];
    var card = [[5,1,14,20,17,19,4,10,19,17,5,2,18,12,7,4,16,5,8,2]];
    DD[T.CardList] = card;
    card.sort(function(a,b){
        return a - b;
    });

    //var cardList = mCard.getCardList();
    //var isOpen = mAction.isCanWei(40);
    //var isOpen = mAction.checkOpen(40, GUO);
    var isOpen = mAction.checkOpen(65760, HU);
    var isOpen = mAction.isHaveChi(3);

    var huInfo = mAction.isHaveHu(11);
    cc.log(JSON.stringify(huInfo));
}