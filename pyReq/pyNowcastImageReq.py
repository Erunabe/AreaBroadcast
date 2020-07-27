# coding:utf-8
#!/usr/bin/python　3


import requests
import json
import datetime
import os
from pathlib import Path
from pymongo import MongoClient

os.environ["http_proxy"] = "http://10.64.199.79:8080"
os.environ["https_proxy"] = "http://10.64.199.79:8080"
now = datetime.datetime.now()


now = datetime.datetime.now()
utcnow = datetime.datetime.utcnow()
deltaNow = now - datetime.timedelta(minutes=5)
print(deltaNow)
nowTime = now.strftime('%Y%m%d%H')
year = now.strftime('%Y')
month = now.strftime('%m')
day = now.strftime('%d')
hour = now.strftime('%H')
deltaHour = deltaNow.strftime('%H')
minutes=now.strftime('%M')
deltaMinutes = deltaNow.strftime('%M')
splitMinutes=list(minutes)
deltaSplitMinutes=list(deltaMinutes)
endMinutes = int(splitMinutes[1])
deltaEndMinutes = int(deltaSplitMinutes[1])


if endMinutes % 5 == 0:
    pass
elif 0<= endMinutes <5:
    endMinutes=0;
else:
    endMinutes=5;

if deltaEndMinutes % 5 == 0:
    pass
elif 0<= deltaEndMinutes <5:
    deltaEndMinutes=0;
else:
    deltaEndMinutes=5;


format = nowTime+splitMinutes[0]+str(endMinutes)
delay_fmt = year+month+day+deltaHour+deltaSplitMinutes[0]+str(deltaEndMinutes)
format_Day = year+'-'+month+'-'+day
format_Time = hour+':'+str(minutes)

print(format)
print(delay_fmt)

URL = 'http://www.jma.go.jp/jp/radnowc/imgs/radar/205/'+format+'-00.png'
requestImage = requests.get(URL)


with open('/home/a2011529/AreaBroadcast/pyReq/pyNowcastImage/'+format+'.png','wb') as f:
 f.write(requestImage.content)
 with open('/home/a2011529/AreaBroadcast/public/NowcastImage/'+format+'.png','wb') as f:
  f.write(requestImage.content)

print(format+" 最新降水分布図取得保存完了")

#1時間後までの予報降水分布図取得
for val in range(2,13):
  z_val = "{0:02d}".format(val)
  URL = 'https://www.jma.go.jp/jp/radnowc/imgs/nowcast/205/'+delay_fmt+'-'+z_val+'.png'
  requestImage = requests.get(URL)
  print(str(val*5)+"分後の予報降水分布図取得保存完了")

  with open('/home/a2011529/AreaBroadcast/pyReq/pyForecastImage/'+delay_fmt+'-'+z_val+'.png','wb') as f:
    f.write(requestImage.content)


#gif画像フォルダ操作
islist=bool(os.listdir('/home/a2011529/AreaBroadcast/pyReq/nowcastGifImage/'))

if islist:
    p = Path("/home/a2011529/AreaBroadcast/pyReq/nowcastGifImage/")
    files = list(p.glob("*"))
    file_updates = {file_path: os.stat(file_path).st_mtime for file_path in files}
    newst_file_path = max(file_updates, key=file_updates.get)
    print("最新のファイルパス：")
    print(newst_file_path)
    #最新のファイルから番号を抽出
    strNewst=str(newst_file_path)
    splitNewst = strNewst[51:54]
    latestNumber=int(splitNewst)


    number=latestNumber+1
    strNumber=str(number)
    number_z=strNumber.zfill(3)
    #書き込み
    with open('/home/a2011529/AreaBroadcast/pyReq/nowcastGifImage/'+number_z+".png",'wb') as f:
     f.write(requestImage.content)

else:
    #日付が変わりリセットされた場合
    print("日付変更：リセット この画像が1番目です")
    with open('/home/a2011529/AreaBroadcast/pyReq/nowcastGifImage/'+"001.png",'wb') as f:
     f.write(requestImage.content)





NowcastImage = "/NowcastImage/"+format+'.png';


#DB接続　格納
client = MongoClient('localhost', 27017)
db = client["AreaBroadcast"]
collection = db["NowcastImage"]


data =    {
            "TTLfield": utcnow,
            "getDay":format_Day,
            "getTime":format_Time,
            "imagePath":NowcastImage
          }

collection.insert_one(data)
client.close()
