/**
 * Created by scw on 2018/7/4.
 */

(function () {
    var exports = this;
    var searchSubStr = function (str, subStr) {
        var arr = [];
        var index = str.indexOf(subStr);
        while (index > -1) {
            arr.push(index);
            index = str.indexOf(subStr, index + 1);
        }
        return arr;
    }
    var RichInGameLabel = cc.Node.extend(
        {
            _lbArr: [],
            // ctor: function (str, font, size, color, cstr, ccolor, m, isAll) {
            //     this._super();
            //     this._lbArr = [];
            //     for (var i = 0; i < str.length; i++) {
            //         var lb = new cc.LabelTTF(str[i], font, size);
            //         if (color) {
            //             lb.setFontFillColor(color);
            //         }
            //
            //         lb.setAnchorPoint(cc.p(0, 0));
            //         var tmpx = 0;
            //         if (i % m == 0) {
            //             tmpx = 0;
            //         } else {
            //             if (this._lbArr[i - 1]) {
            //                 tmpx = this._lbArr[i - 1].x + this._lbArr[i - 1].getContentSize().width;
            //             }
            //         }
            //         lb.x = tmpx;
            //         var lh = lb.getContentSize().height;
            //         lb.y = 0 - ((Math.floor(i / m)) + 1) * lh;
            //         this.addChild(lb);
            //         this._lbArr.push(lb);
            //         lb.setTag(i);
            //     }
            //
            //
            //     if(isAll&&cstr&&typeof cstr=='string'&&ccolor){
            //         var tarr = [];
            //         for (var i = 0; i < cstr.length; i++) {
            //             var nstr = cstr[i];
            //             var arr = searchSubStr(str, nstr);
            //             for (var j in arr) {
            //                 tarr.push(arr[j]);
            //             }
            //         }
            //         for (var i in tarr) {
            //             var index = tarr[i];
            //             var lb = this.getChildByTag(index);
            //             if (lb) {
            //                 lb.setFontFillColor(ccolor);
            //             }
            //         }
            //     }else if (!isAll&&cstr && cstr instanceof Array && ccolor) {
            //         for (var i in  cstr) {
            //             var nstr = cstr[i];
            //             if(typeof nstr=='string'&&str.indexOf(nstr)>=0){
            //                 var tindex = str.indexOf(nstr);
            //                 for (var j = tindex; j < tindex + nstr.length; j++) {
            //                     var lb = this.getChildByTag(j);
            //                     if (lb) {
            //                         lb.setFontFillColor(ccolor);
            //                     }
            //                 }
            //             }
            //
            //
            //         }
            //     } else if (!isAll&&cstr&&typeof cstr=='string'&& str.indexOf(cstr) >= 0) {
            //         var tindex = str.indexOf(cstr);
            //         for (var i = tindex; i < tindex + cstr.length; i++) {
            //             var lb = this.getChildByTag(i);
            //             if (lb) {
            //                 lb.setFontFillColor(ccolor);
            //             }
            //         }
            //     }
            //     return true;
            // },
            ctor: function (str, font, size, color, cstrArr, ccolor, m) {
                this._super();
                this._lbArr = [];
                var ncstrArr =[];
                if(cstrArr instanceof  Array){
                    ncstrArr=cstrArr;
                } else if (typeof cstrArr == 'string') {
                    ncstrArr = [cstrArr];
                }
                var oritmpArr=[];
                var oristrArr=[];
                if(str.length<=m){
                    oristrArr.push(str);
                }else if(str.length>m){
                    var lines=Math.ceil(str.length/m);
                    for(var i=0;i<lines;i++){
                        var bindex=i*m;
                        var tindex=bindex+m;
                        var nstr=str.substring(bindex,tindex);
                        oristrArr.push(nstr);
                    }
                }
                for(var i=0;i<oristrArr.length;i++){
                    var ostr=oristrArr[i];
                    var bindex=str.indexOf(ostr);
                    var eindex=bindex+ostr.length-1;
                    var tmpArr=[];
                    for(var j in ncstrArr){
                        var ncstr=ncstrArr[j];
                        var nbindex=str.indexOf(ncstr);
                        if(nbindex>=0){
                            var neindex=nbindex+ncstr.length-1;
                            if(nbindex>=bindex&&neindex<=eindex){
                                tmpArr.push(ncstr);
                            }else if(nbindex>=bindex&&neindex>eindex){
                                var newstr=ncstr.substr(0,eindex-nbindex+1);
                                tmpArr.push(newstr);
                            }else if(nbindex<bindex&&neindex<=eindex){
                                var newstr=ncstr.substr(bindex-nbindex);
                                tmpArr.push(newstr);
                            }
                        }
                    }
                    oritmpArr.push(tmpArr);
                }

                cc.log('oristrarr is==============',oristrArr);
                // var checkIndexArr=[];
                for(var i=0;i<oristrArr.length;i++){
                    var ostr=oristrArr[i];
                    var objArr=[];
                    var tmpstrArr=oritmpArr[i];

                    cc.log('tmpstrArr is==============',tmpstrArr);
                    for(var j in tmpstrArr){
                        var ncstr=tmpstrArr[j];
                        //cc.log('ncstr is==============',ncstr);
                        var clen=ncstr.length;
                        var cindex=ostr.indexOf(ncstr);
                        if(cindex>0){
                            var tmpindexArr=searchSubStr(ostr,ncstr);
                            if(tmpindexArr.length==1){
                                objArr.push({index:cindex,len:clen});
                            }else{
                                //cc.log('tmpindexArr is===============',tmpindexArr);
                                //cc.log('enter here 111111111111');
                                for(var w=0;w<tmpindexArr.length;w++){
                                    var tmplindex=tmpindexArr[w];
                                    var cando=true;
                                    for(var p =0;p<tmpstrArr.length;p++){
                                        var tmpzjstr=tmpstrArr[p];
                                        var zjcheckarr=searchSubStr(ostr,tmpzjstr);
                                        if(zjcheckarr.length==1){
                                            var tmpzjindex=ostr.indexOf(tmpzjstr);
                                            if(tmplindex>=tmpzjindex&&tmplindex<tmpzjindex+tmpzjstr.length){
                                                cando=false;
                                                break;
                                            }
                                        }
                                    }
                                    if(cando){
                                        objArr.push({index:tmplindex,len:clen});
                                    }

                                }
                            }
                        }
                    }
                    objArr=_.sortBy(objArr,'index');
                    var lsobjArr=[];
                    if(objArr.length>0){
                        for(var k=0;k<objArr.length;k++){
                            var obj=objArr[k];
                            if(objArr[k+1]&&!objArr[k-1]){
                                var lstr1=ostr.substring(0,obj['index']);
                                if(lstr1&&lstr1.length>0){
                                    lsobjArr.push({'str':lstr1,'type':1});
                                }
                                var lstr2=ostr.substring(obj['index'],obj['index']+obj['len']);
                                lsobjArr.push({'str':lstr2,'type':2});

                            }else if(objArr[k-1]&&objArr[k+1]){
                                var obj1=objArr[k-1];
                                var bindex1=obj1['index']+obj1['len'];
                                var tindex1=obj['index'];
                                var lstr1=ostr.substring(bindex1,tindex1);
                                var lstr2=ostr.substring(obj['index'],obj['index']+obj['len']);
                                lsobjArr.push({'str':lstr1,'type':1});
                                lsobjArr.push({'str':lstr2,'type':2});
                            }else if(objArr[k-1]&&!objArr[k+1]){
                                var obj1=objArr[k-1];
                                var bindex1=obj1['index']+obj1['len'];
                                var tindex1=obj['index'];
                                var lstr1=ostr.substring(bindex1,tindex1);
                                lsobjArr.push({'str':lstr1,'type':1});

                                var lstr2=ostr.substring(obj['index'],obj['index']+obj['len']);
                                lsobjArr.push({'str':lstr2,'type':2});

                                var lstr3=ostr.substring(obj['index']+obj['len']);
                                if(lstr3&&lstr3.length>0){
                                    lsobjArr.push({'str':lstr3,'type':1});
                                }

                            }else if(!objArr[k-1]&&!objArr[k+1]){
                                var lstr1=ostr.substring(0,obj['index']);
                                if(lstr1&&lstr1.length>0){
                                    lsobjArr.push({'str':lstr1,'type':1});
                                }

                                var lstr2=ostr.substring(obj['index'],obj['index']+obj['len']);
                                lsobjArr.push({'str':lstr2,'type':2});

                                var lstr3=ostr.substring(obj['index']+obj['len']);
                                if(lstr3&&lstr3.length>0){
                                    lsobjArr.push({'str':lstr3,'type':1});
                                }
                            }
                        }
                    }else{
                        lsobjArr.push({'str':ostr,'type':1});
                    }
                    var lbArr=[];
                    for(var m=0; m<lsobjArr.length;m++){
                        var mobj=lsobjArr[m];
                        var type=mobj['type'];
                        var str=mobj['str'];
                        var lb=new cc.LabelTTF(str, font, size);
                        lb.setAnchorPoint(cc.p(0, 0));
                        if(color&&type==1){
                            lb.setFontFillColor(color);
                        }else if(type==2&&ccolor){
                            lb.setFontFillColor(ccolor);
                        }
                        if(lbArr[m-1]){
                            var plb=lbArr[m-1];
                            lb.x=plb.x+plb.getContentSize().width;
                        }else{
                            lb.x=0;
                        }
                        lb.y=0-(i+1)*lb.getContentSize().height;
                        this.addChild(lb);
                        lbArr.push(lb);
                    }
                    lbArr=[];
                }
                return true;
            },
            onEnter: function () {
                this._super();
            },
            onExit: function () {
                this._lbArr = [];
                this._super();
            }
        }
    );
    exports.RichInGameLabel = RichInGameLabel;
})(window);
