var fs = require('fs');
var path = require('path');
var mongodb = require('mongodb');
var ImageDownroad = ('./ImageDownroad.js')
var BSON = mongodb.BSON;

var DB_HOST = 'localhost';
var DB_PORT = 27017
var DB_OPTION = {};
var DB_NAME = 'WeatherData';

// 以前は「safe: true」などと指定していたが、最新版では
// オプションの「w」プロパティで書き込み時の通知処理を指定する。
// 後方互換性の維持のため、「safe: true」といった指定もまだ許可されている
var CONN_OPTION = {w:1};

// メイン処理を実行する関数
function main() {

  var GetImageTime = ImageDownroad.format1;
  loadFromDB(GetImageTime, function(err,data) {
    fs.writeFile(GetImageTime, data, function (err) {
      if (err) {
        throw err;
      }
      console.log('load succeeded.');
    });
  });
}

// データをDBから取り出す
function loadFromDB(GetImageTime, callback) {
  var server = new mongodb.Server(DB_HOST, DB_PORT, DB_OPTION);
  var connector = new mongodb.Db(DB_NAME, server, CONN_OPTION);
  connector.open(function (err, db) {
    db.collection('Images', function(err, collection) {
      bson = {
        'GetImageTime': GetImageTime,
      };
      collection.find(bson, function(err, cursor) {
        if (err) {
          throw err;
        }
        // クエリ結果から最初の1件のみを取り出す
        cursor.limit(1).each(function(err, doc) {
          if (err) {
            throw err;
          }
          // 読み出しが終了したらデータベースを閉じる
          if (doc === null) {
            db.close();
            return;
          }
          // バイナリの処理については
          // http://mongodb.github.io/node-mongodb-native/api-bson-generated/binary.html
          // を参照
          // 指定したサイズ分データを読み出す
          var len = doc.ImagePath.length();
          callback(err, doc.ImagePath.read(0, len));
        });
      });
    });
  });
}
