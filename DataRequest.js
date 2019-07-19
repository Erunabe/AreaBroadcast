var request = require('request');
require('date-utils');

var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt',
    method: 'GET',
    headers: headers,
    proxy:'http://s1500740:Rose-lisa910@wproxy.net.sendai-nct.ac.jp:8080',
    json: false,
}

request(options, function (error, response, body) {
    console.log(body);
    res = JSON.parse(body);

    var datatime = res.poteka[0].element[0].dataList[0].datatime;
    var temp = res.poteka[0].element[0].dataList[0].value;
    var humi = res.poteka[0].element[1].dataList[0].value;
    var wind_s = res.poteka[0].element[2].dataList[0].value;
    var wind_d = res.poteka[0].element[3].dataList[0].value;
    var wind_max_s = res.poteka[0].element[4].dataList[0].value;
    var press_l = res.poteka[0].element[5].dataList[0].value;
    var rain_i = res.poteka[0].element[6].dataList[0].value;
    var rain_m = res.poteka[0].element[7].dataList[0].value;
    var wbgt = res.poteka[0].element[7].dataList[0].value;

    exports.res = res;
    exports.datatime = datatime;
    exports.temp = temp;
    exports.humi = humi;
    exports.wind_s = wind_s;
    exports.wind_d = wind_d;
    exports.wind_max_s = wind_max_s;
    exports.press_l = press_l;
    exports.rain_i = rain_i;
    exports.rain_m = rain_m;
    exports.wbgt = wbgt;

    console.log("気温:"+temp,"湿度:"+humi,"風速:"+wind_s,"風向:"+wind_d,"最大瞬間風速:"+wind_max_s,"気圧:"+press_l,"降水強度:"+rain_i,"1時間降水量:"+rain_m);


})
