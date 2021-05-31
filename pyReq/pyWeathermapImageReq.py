# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import datetime
from datetime import timedelta
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
yesterday = now - timedelta(days=1)
y_day = yesterday.strftime('%d')
timeFormat=int(now.strftime('%H%M'))
hourList = [0,3,6,9,12,15,18,21]
DBhourList = ['09','12','15','18','21','0','3','6']
DBday = day


if 510<= timeFormat <810:
  day = y_day
  hourFormat =  str(hourList[6])
  DBhourFormat = DBhourList[6]
elif 810<= timeFormat <1110:
  day = y_day
  hourFormat =  str(hourList[7])
  DBhourFormat = DBhourList[7]
elif 1110<= timeFormat <1410:
  hourFormat = "0"+ str(hourList[0])
  DBhourFormat = DBhourList[0]
elif 1410<= timeFormat <1710:
  hourFormat = "0"+str(hourList[1])
  DBhourFormat = DBhourList[1]
elif 1710<= timeFormat <2010:
  hourFormat = "0"+str(hourList[2])
  DBhourFormat = DBhourList[2]
elif 2010<= timeFormat <2310:
  hourFormat = "0"+str(hourList[3])
  DBhourFormat = DBhourList[3]
else:
  hourFormat = str(hourList[4])
  DBhourFormat = DBhourList[4]

format1 = year+month
format2 = year+month+day+hourFormat+'00'
DBformat_Day = year+'-'+month+'-'+ DBday
DBformat_Time = DBhourFormat+':'+'00'

print("取得天気図時刻(国際標準時)："+format2)
print("DB表示時間："+DBformat_Day+" "+DBformat_Time)

URL = 'https://www.data.jma.go.jp/fcd/yoho/data/wxchart/quick/'+format1+'/SPAS_COLOR_'+format2+'.png'
requestImage = requests.get(URL)
print(URL)

if requestImage.status_code == 200:
    with open('/home/a2011529/AreaBroadcast/public/WeathermapImage/'+format2+'.png','wb') as f:
     f.write(requestImage.content)

    print(format2+" 最新天気図取得保存完了")

WeathermapImage = '/WeathermapImage/'+format2;



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
