var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: {
    type: String,
    index: true
  },
  password: String
})

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.hash(newUser.password, 10, function(err, hash) {
    newUser.password = hash;
    newUser.save(callback);
  });
}

module.exports.comparePassword = function(inputPassword, hash, callback) {
  console.log("inputPassword", inputPassword);
  console.log("hash", hash);
  bcrypt.compare(inputPassword, hash, function(err, isMatch) {
    if(err) {next(err);}
    console.log("isMatch", isMatch);
    callback(null, isMatch);
  })
}
