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
from pymongo import DESCENDING
from pymongo import ASCENDING
from bson.json_util import dumps,loads

now = datetime.datetime.now()
utcnow = datetime.datetime.utcnow()

def utc_to_jst(timestamp_utc):
    datetime_utc = datetime.datetime.strptime(timestamp_utc + "+0000", "%Y-%m-%d"+"T"+"%H:%M:%S"+"00:00")
    datetime_jst = datetime_utc.astimezone(datetime.timezone(datetime.timedelta(hours=+9)))
    timestamp_jst = datetime.datetime.strftime(datetime_jst, '%Y-%m-%d %H:%M:%S')
    return timestamp_jst



os.environ["http_proxy"] = "http://10.65.129.131:8080"
os.environ["https_proxy"] = "https://10.65.129.131:8080"
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
print(getDay,getTime)


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
collection1 = db["MeteorObserv"]
collection2 = db["MaxElement"]
collection3 = db["MinElement"]


data1 =    {
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

collection1.insert_one(data1)
print("最新気象観測値格納完了")




#最大値
max = collection2.find_one(sort=[('_id',-1)])
print(max)
print("----------")
if max["max_getDay"] != getDay:
  print("日付変更：最大要素格納更新")
  data2 = {
            "TTLfield": utcnow,
            "max_getDay":getDay,
            "max_temp_Time":getTime,
            "max_temp":temp,
            "max_humi_Time":getTime,
            "max_humi":humi,
            "max_wind_s_Time":getTime,
            "max_wind_s":wind_s,
            "max_wind_max_s_Time":getTime,
            "max_wind_max_s":wind_max_s,
            "max_press_l_Time":getTime,
            "max_press_l":press_l,
            "max_rain_i_Time":getTime,
            "max_rain_i":rain_i,
            "max_rain_m_Time":getTime,
            "max_rain_m":rain_m,
            "max_wbgt_Time":getTime,
            "max_wbgt":wbgt
          }

  collection2.insert_one(data2)

else:
     if max["max_temp"] < temp :
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_temp_Time":getTime,
          "max_temp":temp
         }})
         print("最高温度更新")

     if max["max_humi"] < humi :
         print("最高湿度更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_humi_Time":getTime,
          "max_humi":humi
         }})

     if max["max_wind_s"] < wind_s :
         print("最高風速更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_wind_s_Time":getTime,
          "max_wind_s":wind_s
         }})

     if max["max_wind_max_s"] < wind_max_s :
         print("最高最大瞬間風速更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_wind_max_s_Time":getTime,
          "max_wind_max_s":wind_max_s
         }})

     if max["max_press_l"] < press_l :
         print("最高気圧更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_press_l_Time":getTime,
          "max_press_l":press_l
         }})

     if max["max_rain_i"] < rain_i :
         print("最高1時間降水量更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_rain_i_Time":getTime,
          "max_rain_i":rain_i
         }})

     if max["max_rain_m"] < rain_m :
         print("最高降水強度更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_rain_m_Time":getTime,
          "max_rain_m":rain_m
         }})

     if max["max_wbgt"] < wbgt :
         print("最高暑さ指数更新")
         collection2.update_one({'max_getDay':getDay},{'$set':{
          "max_wbgt_Time":getTime,
          "max_wbgt":wbgt
         }})



#最低値
min = collection3.find_one(sort=[('_id',-1)])
print(min)
print("----------")
if min["min_getDay"] != getDay:
  print("日付変更：最小要素格納更新")
  data3 = {
            "TTLfield": utcnow,
            "min_getDay":getDay,
            "min_temp_Time":getTime,
            "min_temp":temp,
            "min_humi_Time":getTime,
            "min_humi":humi,
            "min_wind_s_Time":getTime,
            "min_wind_s":wind_s,
            "min_wind_max_s_Time":getTime,
            "min_wind_max_s":wind_max_s,
            "min_press_l_Time":getTime,
            "min_press_l":press_l,
            "min_rain_i_Time":getTime,
            "min_rain_i":rain_i,
            "min_rain_m_Time":getTime,
            "min_rain_m":rain_m,
            "min_wbgt_Time":getTime,
            "min_wbgt":wbgt
          }

  collection3.insert_one(data3)

else:
     if min["min_temp"] > temp :
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_temp_Time":getTime,
          "min_temp":temp
         }})
         print("最低温度更新")

     if min["min_humi"] > humi :
         print("最低湿度更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_humi_Time":getTime,
          "min_humi":humi
         }})

     if min["min_wind_s"] > wind_s :
         print("最低風速更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_wind_s_Time":getTime,
          "min_wind_s":wind_s
         }})

     if min["min_wind_max_s"] > wind_max_s :
         print("最低最大瞬間風速更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_wind_max_s_Time":getTime,
          "min_wind_max_s":wind_max_s
         }})

     if min["min_press_l"] > press_l :
         print("最低気圧更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_press_l_Time":getTime,
          "min_press_l":press_l
         }})

     if min["min_rain_i"] > rain_i :
         print("最低1時間降水量更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_rain_i_Time":getTime,
          "min_rain_i":rain_i
         }})

     if min["min_rain_m"] > rain_m :
         print("最低降水強度更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_rain_m_Time":getTime,
          "min_rain_m":rain_m
         }})

     if min["min_wbgt"] > wbgt :
         print("最低暑さ指数更新")
         collection3.update_one({'min_getDay':getDay},{'$set':{
          "min_wbgt_Time":getTime,
          "min_wbgt":wbgt
         }})








client.close()
