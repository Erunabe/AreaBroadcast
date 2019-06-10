var request = require('request');

var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m',
    method: 'GET',
    headers: headers,
    json: false,
}

request(options, function (error, response, body) {
    res = JSON.parse(body);
    console.log(res)

    var temp = res.poteka[0].element[0].dataList[0].value;
    var humi = res.poteka[0].element[1].dataList[0].value;
    var wind_s = res.poteka[0].element[2].dataList[0].value;
    var wind_d = res.poteka[0].element[3].dataList[0].value;
    var wind_max_s = res.poteka[0].element[4].dataList[0].value;
    var press_l = res.poteka[0].element[5].dataList[0].value;
    var rain_i = res.poteka[0].element[6].dataList[0].value;
    var rain_m = res.poteka[0].element[7].dataList[0].value;

    console.log(temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m)


})
