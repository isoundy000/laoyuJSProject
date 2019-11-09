
Config = {
    //XVip:[],
    //XVipShop:[]
};

ConfigHelper = {
    loadCSV:function(name){
        var data = cc.loader.getRes("res/config/"+name+".csv");
        //cc.log("load .... " , name, data);
        //var csv = new CSV(data, { header: true }).parse();
        var csv = {};
        var index = 0;
        new CSV(data, { header: true, cast:false}).forEach(function(object) {
            //cc.log("+++++++++++", object.id, object.name);
            index ++;
            if(object.id == null){
                csv[index] = object;
            }else{
                csv[object.id] = object;
            }
        });
        return csv;
    },

    loadConfigs:function(){
        var configs = Object.getOwnPropertyNames(Config);
        for (var i = 0, li = configs.length; i < li; i++) {
            var configName = configs[i];
            Config[configName] = this.loadCSV(configName);
        }
    }
};





