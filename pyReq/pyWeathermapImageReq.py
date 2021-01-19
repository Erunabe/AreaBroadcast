# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import datetime
import os
from pymongo import MongoClient

os.environ["http_proxy"] = "http://10.65.129.131:8080"
os.environ["https_proxy"] = "http://10.65.129.131:8080"
now = datetime.datetime.now()
utcnow = datetime.datetime.utcnow()

year = now.strftime('%Y')
splitYear=list(year)
month=now.strftime('%m')
day=now.strftime('%d')
timeFormat=int(now.strftime('%H%M'))
hourList = [3,6,9,12,15,18,21]


if 510<= timeFormat <810:
  hourFormat = "0"+ str(hourList[0]);
elif 810<= timeFormat <1110:
  hourFormat = "0"+ str(hourList[1]);
elif 1110<= timeFormat <1410:
  hourFormat = "0"+ str(hourList[2]);
elif 1410<= timeFormat <1710:
  hourFormat = str(hourList[3]);
elif 1710<= timeFormat <2010:
  hourFormat = str(hourList[4]);
elif 2010<= timeFormat <2310:
  hourFormat = str(hourList[5]);
else:
  hourFormat = str(hourList[6]);


format = splitYear[2]+splitYear[3]+month+day+hourFormat+'.png'
DBformat_Day = year+'-'+month+'-'+day
DBformat_Time = hourFormat+':'+'00'

print(format)

URL = 'https://www.jma.go.jp/jp/g3/images/jp_c/'+format
requestImage = requests.get(URL)


with open('/home/a2011529/AreaBroadcast/public/WeathermapImage/'+format,'wb') as f:
 f.write(requestImage.content)
print(format+" 最新天気図取得保存完了")

WeathermapImage = '/WeathermapImage/'+format;



#DB接続　格納
client = MongoClient('localhost', 27017)
db = client["AreaBroadcast"]
collection = db["WeathermapImage"]


data =    {
            "TTLfield": utcnow,
            "getDay":DBformat_Day,
            "getTime":DBformat_Time,
            "imagePath":WeathermapImage
          }

collection.insert_one(data)
client.close()
