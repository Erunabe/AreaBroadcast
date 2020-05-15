# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import cgi
import datetime
import os

os.environ["http_proxy"] = "http://10.64.199.79:8080"
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

#現在の日付時間表示
now = datetime.datetime.now()
nowY = now.year
nowM = now.month
nowD = now.day
nowH = now.hour
nowMi = now.minute
nowS = now.second
