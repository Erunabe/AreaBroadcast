const MongoClient = require( 'mongodb' ).MongoClient;
var db;
const url ='mongodb://127.0.0.1:27017';
const dbName = 'AreaBroadcast';

module.exports = {
  connectToserver: function( callback ) {
    MongoClient.connect( url,{ useNewUrlParser: true ,useUnifiedTopology: true}, function( err, client ) {
      db = client.db(dbName);
      return callback( err );
    } );
  },
  getDb: function() {
    return db;
  }
};
