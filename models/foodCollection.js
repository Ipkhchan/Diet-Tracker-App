var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var foodCollectionSchema = new Schema({
  foodName: {type: String, required: true},
});

module.exports = mongoose.model('foodCollection', foodCollectionSchema);
