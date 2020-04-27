# -*- coding: utf-8 -*-
import requests
import re
from bs4 import BeautifulSoup
from pymongo import MongoClient

#--スクレイピングするURLの指定
up_url = "http://road.thr.mlit.go.jp/jyohoban/048up.html"
dw_url = "http://road.thr.mlit.go.jp/jyohoban/048dw.html"

#--プロキシの設定
#proxies = {
#"http":"http://10.64.199.79:8080",
#"https":"http://10.64.199.79:8080"
#}

#--対象のWebサイトの読み取り
up_html = requests.get(up_url)
up_html.encoding = "Shift_JIS"

dw_html = requests.get(dw_url)
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
#--表示切り替え時刻の取得(折立)

oritate_table = up_soup.findAll("table")[4]

oritate_rows = oritate_table.findAll("tr")[3]

oritate_cells = oritate_rows.findAll("td")[0]

oritate_date = oritate_cells.get_text()

##-表示切り替え時刻の取得(広瀬通)

hirose_table = dw_soup.findAll("table")[1]

hirose_rows = hirose_table.findAll("tr")[3]

hirose_cells = hirose_rows.findAll("td")[0]

hirose_date = hirose_cells.get_text()

##-表示切り替え時刻の取得(作並)

sakunami_table = dw_soup.findAll("table")[1]

sakunami_rows = sakunami_table.findAll("tr")[9]

sakunami_cells = sakunami_rows.findAll("td")[0]

sakunami_date = sakunami_cells.get_text()

##-表示内容画像の取得(折立)
picture = requests.get(oritate1_URL)
picture2 = requests.get(oritate2_URL)

sub = re.sub('[/: ]', '',oritate_date)

fmt_name = "oritate1_{0}.png".format(sub)
fmt_name2 ="oritate2_{0}.png".format(sub)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadInfoImage/'+fmt_name,'wb') as f:
 f.write(picture.content)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadInfoImage/'+fmt_name2,'wb') as f:
 f.write(picture2.content)

##-表示内容画像の取得(広瀬通)
picture3 = requests.get(hirose1_URL)
picture4 = requests.get(hirose2_URL)

sub = re.sub('[/: ]', '',hirose_date)

fmt_name3 = "hirose1_{0}.png".format(sub)
fmt_name4 ="hirose2_{0}.png".format(sub)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadInfoImage/'+fmt_name3,'wb') as f:
 f.write(picture3.content)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadInfoImage/'+fmt_name4,'wb') as f:
 f.write(picture4.content)

##-表示内容画像の取得(作並)
picture5 = requests.get(sakunami1_URL)
picture6 = requests.get(sakunami2_URL)

sub = re.sub('[/: ]', '',sakunami_date)

fmt_name5 = "sakunami1_{0}.png".format(sub)
fmt_name6 = "sakunami2_{0}.png".format(sub)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadInfoImage/'+fmt_name5,'wb') as f:
 f.write(picture5.content)

with open('/home/a2011529/AreaBroadcast/roadTrafInfo/roadInfoImage/'+fmt_name6,'wb') as f:
 f.write(picture6.content)

##-情報板名と切替時刻を画面に出力

print("折立(仙台市):",oritate_date)
print("広瀬通(仙台市):",hirose_date)
print("作並(仙台市):",sakunami_date)

data ={"path":oritate1_URL}

def save_data(data):
 client =MongoClient('localhost', 27017)
 db = client.AreaBroadcast
 collection = db.roadInfoImage

 result = collection.insert(data)

save_data(data)
