/**
 * Created by feiyujishu on 2018/8/30.
 */

(function (exports) {
  
    exports.QrcUtil = {



    _base64ToArrayBuffer: function (base64) {
        var binary_string = dcodeIO.ByteBuffer.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    },

    drawEWMNode:function (node,httpurl,headUrl,cb) {
        var line = 10;
        var bline = line/2;
        var qrcode = new QRCode();
        var codeData =qrcode.makeCode(httpurl)
        var width =  node.getContentSize().width-line;
        var height =  node.getContentSize().height-line;
        var py = height/codeData.modules.length;
        for(var i = 0 ; i<codeData.modules.length;i++){
            var px = width/codeData.modules[i].length;
            for(var j = 0 ; j < codeData.modules[i].length ; j++){
                if(codeData.modules[i][j]){
                    var draw = new cc.DrawNode() ;
                    draw.drawRect(cc.p(px*(j)+bline,py*(i)+bline),cc.p(px*(j+1)+bline,py*(i+1)+bline),cc.color(0,0,0,255),0,cc.color(0,0,0,255))
                    node.addChild(draw);
                }
            }
        }
        if(headUrl){
            var head = new cc.Sprite(res.headbg);
            head.setScale(width/600*0.8);
            head.setPosition( node.getContentSize().width/2,node.getContentSize().height/2);
            loadImageToSprite(headUrl, head);
            node.addChild(head);
        }else {
            var head = new cc.Sprite(res.icon);
            head.setScale(width/600*0.8);
            head.setPosition( node.getContentSize().width/2,node.getContentSize().height/2);
            node.addChild(head);
        }
        if(cb){
            cb();
        }
    },
    makeQrcode: function (node, httpurl,headUrl,cb) {
        cc.log("httpurl==="+httpurl)
        if(httpurl.length>40){
            // showLoading("加载中");
            httpurl=encodeURIComponent(httpurl);
            var getrul = "http://api.weibo.com/2/short_url/shorten.json?source=211160679&url_long="+httpurl;

            NetUtils.httpGet(getrul, function(reqdata){
                // hideLoading();
                var reqdataUrl = JSON.parse(reqdata);
                reqdataUrl=reqdataUrl.urls;
                var dataResult = reqdataUrl[0]
                cc.log("dataResult.url_short=="+dataResult.url_short)
                if(dataResult.result){
                    QrcUtil.drawEWMNode(node,dataResult.url_short,headUrl,cb);
                }

            }, function(reqdata){
                // hideLoading();
            });
        }else {
            QrcUtil.drawEWMNode(node,httpurl,headUrl,cb);
        }
        return ;
        
        var item1 = httpurl ;
        var item =item1.substr(item1.length-10);
        var filePath = cc.sys.localStorage.getItem(item);
        var dir_path = jsb.fileUtils.getWritablePath()+"erweima/";

        // if(filePath&&jsb.fileUtils.isFileExist(dir_path+filePath)){
        //     var sprite = new cc.Sprite(dir_path+filePath);
        //     sprite.setPosition(node.getContentSize().width/2,node.getContentSize().height/2);
        //     node.addChild(sprite);
        //     return ;
        // }

        var pathRes = "res/qrcode/index.html";
        var webView = new ccui.WebView(pathRes);
        webView.setContentSize(cc.winSize.width, cc.winSize.height);
        webView.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        webView.setJavascriptInterfaceScheme('yygame');
        var str = 'var param = {qrcurl:\''+httpurl+'\',qrcwidth:\''+width+'\',qrcheight:\''+height+'\'};';
        webView.evaluateJS(str);
        webView.setOnJSCallback(function (sender, url) {
            var imageBase64Data = url.split(',')[1];
            var byteStream = QrcUtil._base64ToArrayBuffer(imageBase64Data);
            cc.log("zhang==="+JSON.stringify(byteStream));
            QrcUtil.saveImageEWM(byteStream, node,item);
            // webView.removeFromParent();

        });
        cc.director.getRunningScene().addChild(webView);

    },

    saveImageEWM: function (data, node,item) {
        var dir_path = jsb.fileUtils.getWritablePath()+"erweima/";
        var name = 'erweima.png';
        var file_path = dir_path +name ;
        cc.sys.localStorage.setItem(item, name);
        if (data) {
            if (!jsb.fileUtils.isDirectoryExist(dir_path)) {
                jsb.fileUtils.createDirectory(dir_path);
            }
            if (jsb.fileUtils.writeDataToFile(data, file_path)) {
                if(node){
                    var sprite = new cc.Sprite(file_path);
                    sprite.setPosition(node.getContentSize().width/2,node.getContentSize().height/2);
                    node.addChild(sprite);
                }
            }
        } else {
            console.log('Remote download file failed.');
        }
    }

};

})(window);