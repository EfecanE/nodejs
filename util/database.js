const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://efecan:EfecanEfe25.@cluster0.yj2ozmg.mongodb.net/shop?retryWrites=true&w=majority";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database found!";
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
