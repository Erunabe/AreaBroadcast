# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import cgi
import datetime
import re
import os
import dateutil.parser
from pymongo import MongoClient

now = datetime.datetime.now()
utcnow = datetime.datetime.utcnow()

def utc_to_jst(timestamp_utc):
    datetime_utc = datetime.datetime.strptime(timestamp_utc + "+0000", "%Y-%m-%d"+"T"+"%H:%M:%S"+"00:00")
    datetime_jst = datetime_utc.astimezone(datetime.timezone(datetime.timedelta(hours=+9)))
    timestamp_jst = datetime.datetime.strftime(datetime_jst, '%Y-%m-%d %H:%M:%S')
    return timestamp_jst



os.environ["http_proxy"] = "http://10.65.129.131"
os.environ["https_proxy"] = "http://10.65.129.131"
#認証ヘッダ
headers = {'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ=='}

#POTEKA指定データ取得
Poteka = requests.get('http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt',headers=headers)


#辞書型からJSON形式の文字列へ変換
jPoteka=json.dumps((Poteka.json()))


#ファイルにjson形式として書き込み
fr = open('poteka_rec.json','w')
json.dump(jPoteka,fr,indent=4)
fr.close()

#ファイルを開く
json_fr = open('poteka_rec.json','r')

#jsonデータとして読込
json_lr = json.load(json_fr)

#辞書型に変換
Real_obj = json.loads(json_lr)


#実測値の値をファイルからパースして代入
datatime = Real_obj['poteka'][0]['element'][0]['dataList'][0]['datatime']
JST = datetime.timezone(datetime.timedelta(hours=+9), 'JST')
dt = dateutil.parser.parse(datatime).astimezone(JST)
strdt = str(dt)
subdt = re.sub('[：+ ]','',strdt)
getDay = subdt[0:10]
getTime = subdt[10:15]
print(getTime)


temp = Real_obj['poteka'][0]['element'][0]['dataList'][0]['value']
humi = Real_obj['poteka'][0]['element'][1]['dataList'][0]['value']
wind_s = Real_obj['poteka'][0]['element'][2]['dataList'][0]['value']
wind_d = Real_obj['poteka'][0]['element'][3]['dataList'][0]['value']
wind_max_s = Real_obj['poteka'][0]['element'][4]['dataList'][0]['value']
press_l = Real_obj['poteka'][0]['element'][5]['dataList'][0]['value']
rain_i = Real_obj['poteka'][0]['element'][6]['dataList'][0]['value']
rain_m = Real_obj['poteka'][0]['element'][7]['dataList'][0]['value']
wbgt = Real_obj['poteka'][0]['element'][8]['dataList'][0]['value']

print(temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt)


#風向変換
if 0<=wind_d<=22.5 and 337.5 < wind_d<=360:
  wind_d = "北"
elif 22.5<wind_d and wind_d <=67.5 :
  wind_d = "北東"
elif 67.5<wind_d and wind_d <=112.5 :
  wind_d = "東"
elif 112.5<wind_d and wind_d <=157.5 :
  wind_d = "南東"
elif 157.5<wind_d and wind_d <=202.5 :
  wind_d = "南"
elif 202.5<wind_d and wind_d <=247.5 :
  wind_d = "南西"
elif 247.5<wind_d and wind_d <=292.5 :
  wind_d = "西"
elif 292.5<wind_d and wind_d <=337.5 :
  wind_d = "北西"





#DB接続　格納
client = MongoClient('localhost', 27017)
db = client["AreaBroadcast"]
collection = db["MeteorObserv"]


data =    {
            "TTLfield": utcnow,
            "getDay":getDay,
            "getTime":getTime,
            "temp":temp,
            "humi":humi,
            "wind_s":wind_s,
            "wind_d":wind_d,
            "wind_max_s":wind_max_s,
            "press_l":press_l,
            "rain_i":rain_i,
            "rain_m":rain_m,
            "wbgt":wbgt
          }

collection.insert_one(data)
print("最新気象観測値格納完了")
client.close()
