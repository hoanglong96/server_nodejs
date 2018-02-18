var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newWordSchemal = new Schema({
    idTu: String,
    word: String,
    nghia: String,
    idNhomTu: String
  }
);
var newWordModel = mongoose.model("newword", newWordSchemal);

module.exports = newWordModel;
