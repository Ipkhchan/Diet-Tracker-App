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
  password: String,
  sex: String,
  age: Number,
  diets: [{
    name: String,
    items: {
      name: String,
      quantity: Number,
      amount: Number,
      protein: Number,
      fat: Number,
      calorie: Number,
      carbohydrate: Number,
      fiber: Number,
      calcium: Number,
      chromium: Number,
      copper: Number,
      fluoride: Number,
      iodine: Number,
      iron: Number,
      magnesium: Number,
      manganese: Number,
      molybdenum: Number,
      phosphorus: Number,
      selenium: Number,
      zinc: Number,
      potassium: Number,
      sodium: Number,
      chloride: Number,
      "vitamin-A": Number,
      "vitamin-C": Number,
      "vitamin-D": Number,
      "vitamin-E": Number,
      "vitamin-K": Number,
      thiamin: Number,
      riboflavin: Number,
      niacin: Number,
      "vitamin-B6": Number,
      folate: Number,
      "vitamin-B12": Number,
      "pantothenic-acid": Number,
      biotin: Number,
      choline: Number,
      tryptophan: Number,
      threonine: Number,
      isoleucine: Number,
      leucine: Number,
      lysine: Number,
      methionine: Number,
      cystine: Number,
      phenylalanine: Number,
      tyrosine: Number,
      valine: Number,
      arginine: Number,
      histidine: Number,
      alanine: Number,
      "aspartic-acid": Number,
      "glutamic-acid": Number,
      glycine: Number,
      proline: Number,
      serine: Number,
      hydroxyproline: Number,
      cholesterol: Number,
      "omega3-DHA": Number,
      "omega3-EPA": Number,
      "omega3-DPA": Number,
      "omega3-ALA": Number,
      "omega3-ETE": Number,
      "omega6-eicosadienoic-acid": Number,
      "omega6-linoleic-acid": Number,
      "omega6-GLA": Number,
      "omega6-DGLA": Number,
      "omega9-oleic-acid": Number,
      "omega9-erucic-acid": Number,
      "omega9-nervonic-acid": Number,
      "fatty-acids-trans": Number,
      "fatty-acids-saturated": Number,
      "fatty-acids-monounsaturated": Number,
      "fatty-acids-polyunsaturated": Number

    }
  }]
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
