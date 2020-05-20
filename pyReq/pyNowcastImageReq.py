# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import datetime
import os
from pymongo import MongoClient

os.environ["http_proxy"] = "http://10.64.199.79:8080"
os.environ["https_proxy"] = "http://10.64.199.79:8080"
now = datetime.datetime.now()


now = datetime.datetime.now()
nowTime = now.strftime('%Y%m%d%H')
year = now.strftime('%Y')
month = now.strftime('%m')
day = now.strftime('%d')
hour = now.strftime('%H')
minutes=now.strftime('%M')
splitMinutes=list(minutes)
endMinutes = int(splitMinutes[1])


if endMinutes % 5 == 0:
    pass
elif 0<= endMinutes <5:
    endMinutes=0;
else:
    endMinutes=5;


format = nowTime+splitMinutes[0]+str(endMinutes)+'-00.png'
DBformat = nowTime+splitMinutes[0]+str(endMinutes)+'.png'
DBformat_Day = year+'-'+month+'-'+day
DBformat_Time = hour+':'+str(endMinutes)


URL = 'http://www.jma.go.jp/jp/radnowc/imgs/radar/205/'+format
requestImage = requests.get(URL)


with open('/home/a2011529/AreaBroadcast/pyReq/pyNowcastImage/'+DBformat,'wb') as f:
 f.write(requestImage.content)

print(format+" 降水分布図取得保存完了")

NowcastImage = "/NowcastImage/"+DBformat;


#DB接続　格納
client = MongoClient('localhost', 27017)
db = client["AreaBroadcast"]
collection = db["NowcastImage"]


data =    {
            "TTLfield": now,
            "getDay":DBformat_Day,
            "getTime":DBformat_Time,
            "ImagePath":NowcastImage
          }

collection.insert_one(data)
client.close()
