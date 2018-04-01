var userDailyDiet = require('../models/UserDailyDiet');

//TODO: implement Access-Control-Allow-Origin globally so you don't
//have to type it out every time
//TODO: check if food item already exists in database
module.exports.add_fooditem_data = function(req, res, next) {
  var foodItems = req.body;
  let existingFoodNames = [];
  // does this async? If so, do i need to use promises to make sure the creation of Allow
  // the objects occurs
  userDailyDiet.find({}, 'name', function(err, foodNames) {
    if (err) {return next(err);}
    for (let foodName in foodNames) {
      existingFoodNames.push(foodNames[foodName].name);
    };
    createFoodItem();
  });

  function createFoodItem() {
    for (let foodItem in foodItems) {
      if(!existingFoodNames.includes(foodItem)) {
        userDailyDiet.create(foodItems[foodItem], function (err) {
           if (err) {return next(err);}
        });
      }
    }
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.send("Saved!")
  };

  // userDailyDiet.find(function(err, foodItems) {
  //   if (err) console.log(err);
  //   res.append('Access-Control-Allow-Origin', ['*']);
  //   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.append('Access-Control-Allow-Headers', 'Content-Type');
  //   res.json(foodItems);
  // });
};
