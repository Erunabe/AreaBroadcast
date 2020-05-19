# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import datetime
import os

#os.environ["http_proxy"] = "http://10.64.199.79:8080"
now = datetime.datetime.now()

nowTime = now.strftime('%Y%m%d%H')
minutes=now.strftime('%M')
splitMinutes=list(minutes)
endMinutes = int(splitMinutes[1])


if endMinutes % 5 == 0:
    pass
elif 0<= endMinutes <5:
    endMinutes=0;
else:
    endMinutes=5;

print(endMinutes)

format1 = nowTime+splitMinutes[0]+str(endMinutes)+'-00.png'
format2 = nowTime+splitMinutes[0]+str(endMinutes)+'.png'


URL = 'http://www.jma.go.jp/jp/radnowc/imgs/radar/205/'+format1
requestImage = requests.get(URL)


with open('/home/a2011529/AreaBroadcast/pyReq/pyNowcastImage/'+format2,'wb') as f:
 f.write(requestImage.content)
