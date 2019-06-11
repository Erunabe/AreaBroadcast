const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const assert = require('assert')

MongoClient.connect('mongodb://127.0.0.1:27017/WeatherData',{useNewUrlParser:true},(err, db) => {
    assert.equal(null, err)
    console.log("Connected successfully to server")
    db.close()
})

const insertDocuments = (db, callback) => {
    const documents = [
        { a: 1 },
        { a: 2 },
        { a: 3 }
    ]
    // myDBデータベースのdocumentsコレクションに対して
    // ドキュメントを3つ追加します
    db.collection('documents').insertMany(documents, (err, result) => {
        // insert結果の確認
        assert.equal(err, null)
        assert.equal(3, result.result.n)
        assert.equal(3, result.ops.length)

        console.log("Inserted 3 documents into the collection")
        callback(result)
    })
}
