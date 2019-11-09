(function (exports) {

    var DEFAULT_WEB_VSH = [
        "attribute vec4 a_position;",
        "attribute vec2 a_texCoord;",
        "attribute vec4 a_color;",
        "varying lowp vec4 v_fragmentColor;",

        "#ifdef GL_ES",
        "    varying mediump vec2 v_texCoord;",
        "#else",
        "    varying vec2 v_texCoord;",
        "#endif",

        "void main()",
        "{",
        "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;",
        "    v_fragmentColor = a_color;",
        "    v_texCoord = a_texCoord;",
        "}"
    ].join("\r\n");

    var DEFAULT_NATIVE_VSH = [
        "attribute vec4 a_position;",
        "attribute vec2 a_texCoord;",
        "attribute vec4 a_color;",

        "varying lowp vec4 v_fragmentColor;",

        "#ifdef GL_ES",
        "varying mediump vec2 v_texCoord;",
        "#else",
        "varying vec2 v_texCoord;",
        "#endif",

        "void main()",
        "{",
        "    gl_Position = CC_PMatrix * a_position;",
        "    v_fragmentColor = a_color;",
        "    v_texCoord = a_texCoord;",
        "}"
    ].join("\r\n");

    var DEFAULT_VSH = (cc.sys.isNative || cc.ENGINE_VERSION == 'Cocos2d-JS v3.13' ? DEFAULT_NATIVE_VSH : DEFAULT_WEB_VSH);

    var GRAY_SCALE_FSH = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "varying vec2 v_texCoord;",

        "void main()",
        "{",
        "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);",
        "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114;",
        "    gl_FragColor = vec4(gray, gray, gray, texColor.a);",
        "}"
    ].join("\r\n");

    var GRAY_MASK_FSH = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "varying vec2 v_texCoord;",

        "void main()",
        "{",
        "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);",
        "    float a = texColor.a;",
        "    gl_FragColor = mix(texColor, vec4(0.3, 0.3, 0.3, texColor.a), 0.33);",
        "    gl_FragColor.a = texColor.a;",
        "    if(a<0.1)",
        "       gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);",
        "}"
    ].join("\r\n");

    var GRAY_MASK_FSH2 = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "varying vec2 v_texCoord;",

        "void main()",
        "{",
        "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);",
        // "    float a = texColor.a*0.5;",
        //"    gl_FragColor = mix(texColor, vec4(0.3, 0.3, 0.3, texColor.a), 0.33);",
        // "",
        // "    gl_FragColor.a = texColor.a*0.3;",
        // "    if(a<0.1)",
        "       gl_FragColor = vec4(texColor.r*texColor.a*0.3, texColor.g*texColor.a*0.3, texColor.b*texColor.a*0.3, texColor.a*0.3);",
        "}"
    ].join("\r\n");

    var GRAY_RED_FSH = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "varying vec2 v_texCoord;",

        "void main()",
        "{",
        "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);",
        "    gl_FragColor = mix(texColor, vec4(0.33, 0, 0, texColor.a), 0.33);",
        "    gl_FragColor.a = texColor.a;",
        "}"
    ].join("\r\n");

    var HEAVY_GRAY_MASK_FSH = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "varying vec2 v_texCoord;",

        "void main()",
        "{",
        "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);",
        "    gl_FragColor = mix(texColor, vec4(0.1, 0.1, 0.1, texColor.a), 0.7);",
        "    gl_FragColor.a = texColor.a;",
        "}"
    ].join("\r\n");

    var SEPIA_FSH = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "varying vec2 v_texCoord;",
        "uniform float u_degree;",

        "void main()",
        "{",
        "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);",
        "    float r = texColor.r * 0.393 + texColor.g * 0.769 + texColor.b * 0.189;",
        "    float g = texColor.r * 0.349 + texColor.g * 0.686 + texColor.b * 0.168;",
        "    float b = texColor.r * 0.272 + texColor.g * 0.534 + texColor.b * 0.131;",
        "    gl_FragColor = mix(texColor, vec4(r, g, b, texColor.a), u_degree);",
        "}"
    ].join("\r\n");

    var REMOVE_FSH = [
        "precision lowp float;",
        "varying vec4 v_fragmentColor;",
        "varying vec2 v_texCoord;",
        "void main()",
        "{",
        "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);",
        "}"
    ].join("\r\n");

    var applyShader = function (sprite, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            sprite.setGLProgramState(glProgram_state);
        }
        else
            sprite.shaderProgram = program;
    };

    var createProgramWithString = function (vshStr, fshStr) {
        if (cc.sys.isNative)
            return cc.GLProgram.createWithByteArrays(vshStr, fshStr);
        else {
            var program = new cc.GLProgram();
            program.initWithVertexShaderByteArray(vshStr, fshStr);
            return program;
        }
    };


    var Filter = {
        programs: {},
        storeObj : {},
        grayScale: function (sprite) {
            var program = this.programs["grayScale"];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, GRAY_SCALE_FSH);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.link();
                program.updateUniforms();
                this.programs["grayScale"] = program;
            }
            applyShader(sprite, program);
        },
        grayMask: function (sprite) {
            var program = this.programs["grayMask"];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, GRAY_MASK_FSH);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.link();
                program.updateUniforms();
                program.use();
                this.programs["grayMask"] = program;
            }
            applyShader(sprite, program);
        },
        grayMask2: function (sprite) {
            var program = this.programs["grayMask2"];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, GRAY_MASK_FSH2);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.link();
                program.updateUniforms();
                program.use();
                this.programs["grayMask2"] = program;
            }
            applyShader(sprite, program);
        },
        grayRed: function (sprite) {
            var program = this.programs["grayRed"];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, GRAY_RED_FSH);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.link();
                program.updateUniforms();
                program.use();
                this.programs["grayRed"] = program;
            }
            applyShader(sprite, program);
        },
        heavyGrayMask: function (sprite) {
            var program = this.programs["heavyGrayMask"];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, HEAVY_GRAY_MASK_FSH);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.link();
                program.updateUniforms();
                program.use();
                this.programs["heavyGrayMask"] = program;
            }
            applyShader(sprite, program);
        },
        sepia: function (sprite, degree) {
            var program = this.programs["sepia" + degree];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, SEPIA_FSH);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.link();
                program.updateUniforms();
                program.use();
                program.setUniformLocationWith1f(program.getUniformLocationForName('u_degree'), degree);
                this.programs["sepia" + degree] = program;
            }

            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
                glProgram_state.setUniformFloat("u_degree", degree);
                sprite.setGLProgramState(glProgram_state);
            }
            else
                sprite.shaderProgram = program;
        },
        remove: function (sprite) {
            var program = this.programs[cc.SHADER_POSITION_TEXTURECOLOR];
            if (!program) {
                program = createProgramWithString(DEFAULT_VSH, REMOVE_FSH);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                this.programs[cc.SHADER_POSITION_TEXTURECOLOR] = program;
            }
            applyShader(sprite, program);
        },
        store:function (sprite, key) {
            if(!sprite||!key)
                return;
            if (cc.sys.isNative) {
                this.storeObj[key] = sprite.getGLProgramState();
            }else{
                this.storeObj[key] = sprite.shaderProgram
            }

        },
        useStore:function (sprite, key) {
            var program = this.storeObj[key];
            if (cc.sys.isNative) {
            }else{
                sprite.shaderProgram = program;
            }
        }
    };

    exports.Filter = Filter;
    exports.Filter.DEFAULT_VSH = DEFAULT_VSH;
    exports.Filter.GRAY_SCALE_FSH = GRAY_SCALE_FSH;

})(this);
