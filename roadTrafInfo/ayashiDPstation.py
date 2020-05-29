# -*- coding: utf-8 -*-

#--関数宣言--#
import requests
import re
import datetime
from bs4 import BeautifulSoup
from pymongo import MongoClient
from pymongo import DESCENDING
from pymongo import ASCENDING

now = datetime.datetime.now()
utcnow = datetime.datetime.utcnow()
year = now.strftime('%Y')
nowDay = now.strftime('%m%d')

import locale
locale.setlocale(locale.LC_ALL, 'ja_JP.utf-8')


print("現在時刻：" + str(now))
print("\n")

print("-------路面写真取得-------")
#DBより直近の撮影日時を取得
client = MongoClient('localhost', 27017)
db = client.AreaBroadcast
collection1 = db.RoadImage

latestPhoto = list(collection1.find().sort('_id',DESCENDING).limit(1))
latestPhotoTime = latestPhoto[0]['getTime']
print("直近の撮影時間："+latestPhotoTime)

client.close()


#Webページから撮影時間を取得
url = "http://www2.thr.mlit.go.jp/sendai/html/DR-74170.html"

proxies = {
"http":"http://10.64.199.79:8080",
"https":"http://10.64.199.79:8080"
}

#--HTTPリクエストの送信--#]
html = requests.get(url,proxies=proxies)
html.encoding = html.apparent_encoding

soup = BeautifulSoup(html.text, 'html.parser')


#--撮影日時の取得
table = soup.findAll("table")[2]

rows = table.findAll("tr")[0]

cell = rows.findAll("td")[0]

date = cell.get_text()
splitdate = date.splitlines()[0]

photoDate =re.sub('[撮影日時：]', "",splitdate)

DBphotoDate = photoDate.replace('/','-')
subphotoDate = re.sub('[/:： ]','',photoDate)

photoDay = DBphotoDate[0:5]
photoTime = DBphotoDate[6:11]


#更新されているかの確認処理
if latestPhotoTime != photoTime :
    print("撮影日時更新")
    URL = 'http://www2.thr.mlit.go.jp/sendai/html/image/DR-74170-l.jpg'
    r = requests.get(URL)
    datetime = "{0}{1}".format(year,subphotoDate)
    fmt_name = "ayashi{0}.jpg".format(datetime)
    with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadCondPhoto/'+fmt_name,'wb') as f:
     f.write(r.content)


    #年替わり確認
    if nowDay != '0101':
        print("本日は1月1日ではありません")
    else :
        if photoTime != '0101' :
            year = int(year)-1
            print(Year)
        else :
            pass

    print("撮影日時:" + year + "-" + photoTime)
    photodata ={"TTLfield": utcnow,"getDay":year+"-"+photoDay,"getTime":photoTime,
    "imagePath":'/home/a2011529/AreaBroadcast/roadTrafInfo/roadCondPhoto/'+fmt_name}

    client = MongoClient('localhost', 27017)
    db = client.AreaBroadcast
    collection1 = db.RoadImage

    collection1.insert_one(photodata)
    print("路面写真格納完了")

    client.close()

else :
    print("撮影日時更新なし")






print("\n")
print("-------観測値テーブル取得-------")
#DBより直近の観測日時を取得
client = MongoClient('localhost', 27017)
db = client.AreaBroadcast
collection2 = db.DPSObserv


latestObserv = list(collection2.find().sort('_id',DESCENDING).limit(1))
latestObservTime = latestObserv[0]['getTime']
print("直近の観測時間："+latestObservTime)

client.close()


#Webページから観測時間を取得
table2 = soup.findAll("table")[3]

rows2 = table2.findAll("tr")[0]

cell2 = rows2.findAll("td")[0]

date2 = cell2.get_text()

splitdate2 = date2.splitlines()[0]

observDate =re.sub('[観測日時：]', "",splitdate2)

observDay = observDate[0:10]
observTime = observDate[11:16]



#観測時間が更新されているかの確認処理
if latestObservTime != observTime :
    print("観測日時更新")

    #--観測地テーブルの取得
    rainfall = soup.find("td",text="累加雨量").find_next_sibling("td").text
    subRainfall =  re.sub('[mm]','',rainfall)
    temp = soup.find("td",text="気温").find_next_sibling("td").text
    subTemp =  re.sub('[℃]','',temp)
    windspeed = soup.find("td",text="風速").find_next_sibling("td").text
    subWindspeed = re.sub('[m/s]','',windspeed)
    roadtemp = soup.find("td",text="路面温度").find_next_sibling("td").text
    subRoadtemp = re.sub('[℃]','',roadtemp)
    roadsit = soup.find("td",text="路面状況").find_next_sibling("td").text

    #--画面への出力--
    print('観測日時:' + observDate)
    print('累加雨量:' + subRainfall + "mm")
    print('気温:' + subTemp + "℃")
    print('風速:' + subWindspeed + "m/s")
    print('路面温度:' +subRoadtemp + "℃")
    print('路面状況:' + roadsit)

    data ={"TTLfield": utcnow,"getDay":observDay,"getTime":observTime,
           "rainfall":subRainfall, "temp":subTemp,
           "windspeed":subWindspeed, "roadtemp":subRoadtemp,
           "roadsit":roadsit
           }

    client = MongoClient('localhost', 27017)
    db = client.AreaBroadcast
    collection2 = db.DPSObserv

    collection2.insert_one(data)

    print("観測値テーブル格納完了")

    client.close()

else :
    print("観測日時更新なし")
