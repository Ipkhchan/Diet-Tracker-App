// var foodCollection = require('../models/nutritionController');
var userCollection = require('../models/userCollection')
var userDailyDiet = require('../models/UserDailyDiet')

module.exports.get_nutrition_data = function(req, res, next) {
  // console.log("here");
  // foodCollection.find()
  //   .exec(function (err, foodItemsList) {
  //     res.send(foodItemsList);
  // });
  // res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');
  // res.send({ express: 'Hello From Express' });
  userCollection.find()
    .exec(function (err, foodItemsList) {
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.append('Access-Control-Allow-Headers', 'Content-Type');
      res.json(foodItemsList);
  });
};
