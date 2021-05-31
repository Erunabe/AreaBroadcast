# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import datetime
import re
import os
import dateutil.parser
from pymongo import MongoClient

now = datetime.datetime.now()
utcnow = datetime.datetime.utcnow()

#os.environ["http_proxy"] = "http://10.65.129.131"
#os.environ["https_proxy"] = "http://10.65.129.131"

#POTEKA指定データ取得
rasp = requests.get('http://10.64.199.12:3000/rasp')
rasp_json = rasp.json()

#実測値の値をファイルからパースして代入
datatime = rasp_json['getDay']
split_datatime = datatime.split()
getDay = split_datatime[0]
getTime = split_datatime[1]
temp_ins = rasp_json['temp_ins']
temp_avg = rasp_json['temp_avg']



#DB接続　格納
client = MongoClient('localhost', 27017)
db = client["AreaBroadcast"]
collection = db["rasp_temp"]


data =    {
            "TTLfield": utcnow,
            "getDay":getDay,
            "getTime":getTime,
            "temp_ins":temp_ins,
            "temp_avg":temp_avg
          }

collection.insert_one(data)
print("RaspberryPi 最新気温格納完了")




#davisデータ取得
davis = requests.get('http://10.64.199.12:3000/davis')
davis_json = davis.json()

#実測値の値をファイルからパースして代入
datatime = davis_json['getDay']
split_datatime = datatime.split()
getDay = split_datatime[0]
getTime = split_datatime[1]
temp = davis_json['temp']
humi = davis_json['humi']
press = davis_json['press']
rainrate = davis_json['rainrate']
wind_s = davis_json['wind_s']
wind_d = davis_json['wind_d']
windchill = davis_json['windchill']
heatindex = davis_json['heatindex']



#DB接続　格納
collection = db["davisObserv"]

data =    {
            "TTLfield": utcnow,
            "getDay":getDay,
            "getTime":getTime,
            "temp":temp,
            "humi":humi,
            "press":press,
            "rainrate":rainrate,
            "wind_s":wind_s,
            "wind_d":wind_d,
            "windchill":windchill,
            "heatindex":heatindex
          }

collection.insert_one(data)
print("davis 最新観測値格納完了")
client.close()
