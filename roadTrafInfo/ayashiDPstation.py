# -*- coding: utf-8 -*-

#--関数宣言--#
import requests
import re
import datetime
from bs4 import BeautifulSoup
from pymongo import MongoClient
from pymongo import DESCENDING

import locale
locale.setlocale(locale.LC_ALL, 'ja_JP.utf-8')

class ayashi(object):

 def __init__(self,dbName,collectionName):
   self.client = MongoClient()
   self.db = self.client[dbName]
   self.collection = self.db.get_collection(collectionName)

 def find_one(self,projection=None,filter=None,sort=None):
   return self.collection.find_one(projection=projection,filter=filter,sort=sort)

   mongo = ayashi('AreaBroadcast','roadPhoto')
   findone = mongo.find_one(sort=[('datetime',DESCENDING)])

#--対象URLの指定--#

url = "http://www2.thr.mlit.go.jp/sendai/html/DR-74170.html"

proxies = {
"http":"http://10.64.199.79:8080",
"https":"http://10.64.199.79:8080"
}

#--HTTPリクエストの送信--#]
#プロキシ適用の場合　urlのあとに,proxies=proxies
html = requests.get(url,proxies=proxies)
html.encoding = html.apparent_encoding

soup = BeautifulSoup(html.text, 'html.parser')



#--撮影日時の取得
table = soup.findAll("table")[2]

rows = table.findAll("tr")[0]

cell = rows.findAll("td")[0]

date = cell.get_text()

splitdata = date.splitlines()[0]

phototime=re.sub('[撮影日時：]', "",splitdata)

#--観測日時の取得

table2 = soup.findAll("table")[3]

rows2 = table2.findAll("tr")[0]

cell2 = rows2.findAll("td")[0]

date2 = cell2.get_text()

URL = 'http://www2.thr.mlit.go.jp/sendai/html/image/DR-74170-l.jpg'

r = requests.get(URL)

subphototime = re.sub('[/:： ]','',phototime)

photoDate = subphototime[0:4]
photoTime = subphototime[5:8]

now = datetime.datetime.now()

year = now.strftime('%Y')

nowDay = now.strftime('%m%d')


if nowDay != '0101':
    print("Today is not 1/1")
else :
    if date2 != '0101' :
        Year = int(Year)-1

    else :
        pass



datetime = "{0}{1}".format(year,subphototime)

fmt_name = "ayashi{0}.jpg".format(datetime)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadCondPhoto/'+fmt_name,'wb') as f:
 f.write(r.content)

#--観測地テーブルの取得
rainfall = soup.find("td",text="累加雨量").find_next_sibling("td").text
temp = soup.find("td",text="気温").find_next_sibling("td").text
windspeed = soup.find("td",text="風速").find_next_sibling("td").text
roadtemp = soup.find("td",text="路面温度").find_next_sibling("td").text
roadsit = soup.find("td",text="路面状況").find_next_sibling("td").text


#--画面への出力--#
print('撮影日時:' + datetime)
print(date2)
print('累加雨量:' + rainfall)
print('気温:' + temp)
print('風速:' + windspeed)
print('路面温度:' + roadtemp)
print('路面状況:' + roadsit)

data ={"getTime":date2,
       "rainfall":rainfall, "temp":temp,
       "windspeed":windspeed, "roadtemp":roadtemp,
       "roadsit":roadsit
       }

photodata ={"getTime":datetime,
"photoPath":'/home/a2011529/AreaBroadcast/roadTrafInfo/roadCondPhoto/'+fmt_name}

def save_data(data):
 client =MongoClient('localhost', 27017)
 db = client.r48
 collection = db.meteorobserv

save_data(data)

def save_data(photodata):
 client =MongoClient('localhost', 27017)
 db = client.r48
 collection = db.roadimage

 result = collection.insert(photodata)

save_data(photodata)
