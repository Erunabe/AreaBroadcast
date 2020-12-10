# -*- coding: utf-8 -*-
import requests
import re
import datetime
from bs4 import BeautifulSoup
from pymongo import MongoClient
from pymongo import DESCENDING
from pymongo import ASCENDING

utcnow = datetime.datetime.utcnow()
now = datetime.datetime.now()
year = now.strftime('%Y')
nowDay = now.strftime('%m%d')
nowMonth = now.strftime('%m')

#--スクレイピングするURLの指定
up_url = "http://road.thr.mlit.go.jp/jyohoban/048up.html"
dw_url = "http://road.thr.mlit.go.jp/jyohoban/048dw.html"

#--プロキシの設定
proxies = {
"http":"http://10.65.129.131:8080",
"https":"https://10.65.129.131:8080"
}

#--対象のWebサイトの読み取り
up_html = requests.get(up_url,proxies=proxies)
up_html.encoding = "Shift_JIS"

dw_html = requests.get(dw_url,proxies=proxies)
dw_html.encoding = "Shift_JIS"

up_soup = BeautifulSoup(up_html.text, 'html.parser')
dw_soup = BeautifulSoup(dw_html.text, 'html.parser')

##-取得する画像の指定

oritate1_URL = "http://road.thr.mlit.go.jp/jyohoban/banimg/630010321_1.png"
oritate2_URL = "http://road.thr.mlit.go.jp/jyohoban/banimg/630010321_2.png"

hirose1_URL = "http://road.thr.mlit.go.jp/jyohoban/banimg/630010351_1.png"
hirose2_URL = "http://road.thr.mlit.go.jp/jyohoban/banimg/630010351_2.png"

sakunami1_URL = "http://road.thr.mlit.go.jp/jyohoban/banimg/630010301_1.png"
sakunami2_URL = "http://road.thr.mlit.go.jp/jyohoban/banimg/630010301_2.png"





print("現在時刻：" + str(now))
print("\n")




print("-------折立道路情報板取得-------")
#DBより直近の撮影日時を取得
client = MongoClient('localhost', 27017)
db = client.AreaBroadcast
collection = db.RoadInfoImage
filter = {'location':'折立'}
latestImage = collection.find_one(filter,sort=[('_id',-1)])
latestImageDay = latestImage['getDay']
latestYear = latestImageDay[0:4]
latestImageTime = latestImage['getTime']
print("直近の表示切り替え時間："+latestImageDay+" "+latestImageTime)

client.close()

#--表示切り替え時刻の取得(折立)

oritate_table = up_soup.findAll("table")[4]

oritate_rows = oritate_table.findAll("tr")[3]

oritate_cells = oritate_rows.findAll("td")[0]

oritate_date = oritate_cells.get_text()

DBoritate_Date = oritate_date.replace('/','-')
oritate_Day=DBoritate_Date[0:5]
oritate_Month=DBoritate_Date[0:2]
oritate_Time=DBoritate_Date[6:11]
sub = re.sub('[/:： ]','',oritate_date)

#年替わり確認
if latestYear != str(year):
    print("最後に格納された日時から年が変わっています")
else :
    if oritate_Month != str(nowMonth) :
        year = int(year)-1
        print("この画像は"+str(Year)+"年に撮影されました")
    else :
        pass

if latestImageTime != oritate_Time :

    picture = requests.get(oritate1_URL,proxies=proxies)
    picture2 = requests.get(oritate2_URL,proxies=proxies)

    fmt_name1 = "oritate1_{0}.png".format(sub)
    fmt_name2 = "oritate2_{0}.png".format(sub)

    with open('/home/a2011529/AreaBroadcast/public/roadInfoImage/'+fmt_name1,'wb') as f:
     f.write(picture.content)

    with open('/home/a2011529/AreaBroadcast/public/roadInfoImage/'+fmt_name2,'wb') as f:
     f.write(picture2.content)

    data = { "TTLfield":utcnow,"bound":'上り',"location":'折立',"getDay":year+'-'+oritate_Day,"getTime":oritate_Time,
    "imagePath1":'/roadInfoImage/'+fmt_name1,
    "imagePath2":'/roadInfoImage/'+fmt_name2}

    client = MongoClient('localhost', 27017)
    db = client.AreaBroadcast
    collection = db.RoadInfoImage

    collection.insert_one(data)
    print("折立情報板格納完了")

    client.close()

else :
    print("折立情報板更新なし")





print("-------広瀬通道路情報板取得-------")
#DBより直近の撮影日時を取得
client = MongoClient('localhost', 27017)
db = client.AreaBroadcast
collection = db.RoadInfoImage

filter = {'location':'広瀬通'}
latestImage = collection.find_one(filter,sort=[('_id',-1)])
latestImageDay = latestImage['getDay']
latestYear = latestImageDay[0:4]
latestImageTime = latestImage['getTime']
print("直近の表示切り替え時間："+latestImageDay+" "+latestImageTime)

client.close()

hirose_table = dw_soup.findAll("table")[1]

hirose_rows = hirose_table.findAll("tr")[3]

hirose_cells = hirose_rows.findAll("td")[0]

hirose_date = hirose_cells.get_text()

DBhirose_Date = hirose_date.replace('/','-')
hirose_Day=DBhirose_Date[0:5]
hirose_Month=DBhirose_Date[0:2]
hirose_Time=DBhirose_Date[6:11]
sub = re.sub('[/: ]', '',hirose_date)

#年替わり確認
if latestYear != str(year):
    print("最後に格納された日時から年が変わっています")
else :
    if hirose_Month != str(nowMonth) :
        year = int(year)-1
        print("この画像は"+str(Year)+"年に撮影されました")
    else :
        pass

if latestImageTime != hirose_Time :
    ##-表示内容画像の取得(広瀬通)
    picture3 = requests.get(hirose1_URL)
    picture4 = requests.get(hirose2_URL)

    fmt_name3 = "hirose1_{0}.png".format(sub)
    fmt_name4 ="hirose2_{0}.png".format(sub)

    with open('/home/a2011529/AreaBroadcast/public/roadInfoImage/'+fmt_name3,'wb') as f:
     f.write(picture3.content)

    with open('/home/a2011529/AreaBroadcast/public/roadInfoImage/'+fmt_name4,'wb') as f:
     f.write(picture4.content)

    data = { "TTLfield":utcnow,"bound":'下り',"location":'広瀬通',"getDay":year+'-'+hirose_Day,"getTime":hirose_Time,
    "imagePath1":'/roadInfoImage/'+fmt_name3,
    "imagePath2":'/roadInfoImage/'+fmt_name4}

    client = MongoClient('localhost', 27017)
    db = client.AreaBroadcast
    collection = db.RoadInfoImage

    collection.insert_one(data)
    print("広瀬通情報板格納完了")

    client.close()

else :
    print("広瀬通情報板更新なし")






print("-------作並道路情報板取得-------")
#DBより直近の撮影日時を取得
client = MongoClient('localhost', 27017)
db = client.AreaBroadcast
collection = db.RoadInfoImage

filter = {'location':'作並'}
latestImage = collection.find_one(filter,sort=[('_id',-1)])
latestImageDay = latestImage['getDay']
latestYear = latestImageDay[0:4]
latestImageTime = latestImage['getTime']
print("直近の表示切り替え時間："+latestImageDay+" "+latestImageTime)

client.close()


sakunami_table = dw_soup.findAll("table")[1]

sakunami_rows = sakunami_table.findAll("tr")[9]

sakunami_cells = sakunami_rows.findAll("td")[0]

sakunami_date = sakunami_cells.get_text()

DBsakunami_Date = sakunami_date.replace('/','-')
sakunami_Day=DBsakunami_Date[0:5]
sakunami_Month=DBsakunami_Date[0:2]
sakunami_Time=DBsakunami_Date[6:11]
sub = re.sub('[/: ]', '',sakunami_date)


#年替わり確認
if latestYear != str(year):
    print("最後に格納された日時から年が変わっています")
else :
    if sakunami_Month != str(nowMonth) :
        year = int(year)-1
        print("この画像は"+str(Year)+"年に撮影されました")
    else :
        pass

if latestImageTime != sakunami_Time :
    ##-表示内容画像の取得(作並)
    picture5 = requests.get(sakunami1_URL)
    picture6 = requests.get(sakunami2_URL)

    fmt_name5 = "sakunami1_{0}.png".format(sub)
    fmt_name6 = "sakunami2_{0}.png".format(sub)

    with open('/home/a2011529/AreaBroadcast/public/roadInfoImage/'+fmt_name5,'wb') as f:
     f.write(picture5.content)

    with open('/home/a2011529/AreaBroadcast/public/roadInfoImage/'+fmt_name6,'wb') as f:
     f.write(picture6.content)

    data = {"TTLfield":utcnow,"bound":'下り',"location":'作並',"getDay":year+'-'+sakunami_Day,"getTime":sakunami_Time,
    "imagePath1":'/roadInfoImage/'+fmt_name5,
    "imagePath2":'/roadInfoImage/'+fmt_name6}

    client = MongoClient('localhost', 27017)
    db = client.AreaBroadcast
    collection = db.RoadInfoImage

    collection.insert_one(data)
    print("作並情報板格納完了")

    client.close()

else :
    print("作並情報板更新なし")
