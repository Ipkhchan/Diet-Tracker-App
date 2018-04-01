var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userCollectionSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('userCollection', userCollectionSchema, 'usercollection');
