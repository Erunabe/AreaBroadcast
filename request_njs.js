var request = require('request');

var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,weather,wind_s',
    method: 'GET',
    headers: headers,
    json: false,
}

request(options, function (error, response, body) {

    console.log(body);

})
