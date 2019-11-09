
var mProto = {
    protoName : {},
    builder : {},
    initProtoTypes: function () {
        for (var key in P) {
            var strNewKey = P[key].toString();
            if(ProtoTypes[strNewKey] == null){
                //ProtoTypes[strNewKey] = key.slice(4);
                ProtoTypes[strNewKey] = key + "_MSG";
            }else{
                ProtoTypes[strNewKey] = key + "_MSG";
            }
        }

        for (var key in P_SSS) {
            var strNewKey = P_SSS[key].toString();
            if(ProtoNewTypes[ProTyp.SSS + "_" +strNewKey] == null){
                //ProtoTypes[strNewKey] = key.slice(4);
                ProtoNewTypes[ProTyp.SSS + "_" +strNewKey] = key + "_MSG";
            }else{
                ProtoNewTypes[ProTyp.SSS + "_" +strNewKey] = key + "_MSG";
            }
        }
        //cc.log("get proto types +++++", ProtoTypes.length);
    },

    EntityType:{},
    // initMul:function(type){
    //     this.EntityType = mProto.builder[type].build("G2.Protocol.EntityType");
    // },
    init:function(type){
        if(type){
            this.EntityType = mProto.builder[type].build("G2.Protocol.EntityType");
        }else{
            this.EntityType = mProto.builder.build("G2.Protocol.EntityType");
        }

    }
};

