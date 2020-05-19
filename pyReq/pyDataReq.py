# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import cgi
import datetime
import os
import dateutil.parser
from pymongo import MongoClient

now = datetime.datetime.now()
nowY = now.year
nowM = now.month
nowD = now.day
nowH = now.hour
nowMi = now.minute
nowS = now.second



os.environ["http_proxy"] = "http://10.64.199.79:8080"
#認証ヘッダ
headers = {'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ=='}

#POTEKA指定データ取得
Poteka = requests.get('http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt',headers=headers)

<<<<<<< HEAD

=======
>>>>>>> 2576cac621f9c21c28dbc77a410822875cc4bb0e
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
dt = dateutil.parser.parse(datatime)
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

<<<<<<< HEAD

#風向変換
 if 0<=wind_d && wind_d<=22.5 && 337.5 < wind_d && wind_d<=360:
        wind_d = "北";
    else if 22.5<wind_d && wind_d<=67.5:
        wind_d = "北東";
    else if 67.5<wind_d && wind_d<=112.5:
        wind_d = "東";
    else if 112.5<wind_d && wind_d<=157.5:
        wind_d = "南東";
    else if 157.5<wind_d && wind_d<=202.5:
        wind_d = "南";
    else if 202.5<wind_d && wind_d<=247.5:
        wind_d = "南西";
    else if 247.5<wind_d && wind_d<=292.5:
        wind_d = "西";
    else if 292.5<wind_d && wind_d<=337.5:
        wind_d = "北西";





#DB接続　格納
client = MongoClient('localhost', 27017)
db = client["AreaBroadcast"]
collection = db["MeteorObserv"]


data =    {
            "TTLfield": now,
            "GetDay":ArrayDatatime[0],
            "GetTime":ArrayDatatime[1],
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
client.close()
=======
#現在の日付時間表示
now = datetime.datetime.now()
nowY = now.year
nowM = now.month
nowD = now.day
nowH = now.hour
nowMi = now.minute
nowS = now.second

def save_data(data):
 client =MongoClient('localhost', 27017)
 db = client.AreaBroadcast
 collection = db.MeteorObserv

save_data(MeteorObserv)


class AreaBroadcast(object):

 def __init__(self,dbName,collectionName):
   self.client = MongoClient()
   self.db = self.client[dbName]
   self.collection = self.db.get_collection(collectionName)

 def find_one(self,projection=None,filter=None,sort=None):
   return self.collection.find_one(projection=projection,filter=filter,sort=sort)

mongo = ayashi('AreaBroadcast','roadPhoto')
findone = mongo.find_one(sort=[('datetime',DESCENDING)])
>>>>>>> 2576cac621f9c21c28dbc77a410822875cc4bb0e
