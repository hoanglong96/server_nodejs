var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var meoToeicSchema = new Schema({
    id: Number,
    name: String,
    des: String,
    image: String
  }
);
var meoToeicModel = mongoose.model("MeoToeic", meoToeicSchema);

module.exports = meoToeicModel;
