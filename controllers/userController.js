var userDailyDiet = require('../models/UserDailyDiet');
var async = require('async')

//TODO: implement Access-Control-Allow-Origin globally so you don't
//have to type it out every time
//TODO: check if food item already exists in database
module.exports.save_fooditem_data = function(req, res, next) {
  const foodItems = req.body;
  const sentFoodNames = Object.keys(req.body);
  const deletedFoodNames = [];
  console.log(req.body);
  console.log("sentFoodNames", sentFoodNames);
  let existingFoodNames = [];
    //TODO: understand how errors work. does return next(err) skip to the next
    //middleware without running the rest of the code? I'm concerned that
    //this middleware will send "Saved!", even if there's been an error.
  // does this async? If so, do i need to use promises to make sure the creation of Allow
  // the objects occurs
  //collect all foodItem names stored in database so we can avoid duplicating
  //existing items
  //TODO: this code could probably be refactored to be more efficient, better looking
  //and more robust
  userDailyDiet.find({}, 'name', function(err, dbFoodItems) {
    if (err) {return next(err);}
    for (let dbFoodItem in dbFoodItems) {
      const foodName = dbFoodItems[dbFoodItem].name;
      existingFoodNames.push(foodName);
      //if sentFoodNames does not include dbFoodName, that means its been deleted
      //on on the client side, so we should note this down to delete our DB instance
      if(!sentFoodNames.includes(foodName)) {
        deletedFoodNames.push(foodName);
      };
    };

          // delete: deleteRemovedFoodItems();
    async.parallel([
      //ASYNC Function 1: saveFoodItems
      function(callback) {
        for (let foodItem in foodItems) {
          //check if foodItem already existing in database
          if(existingFoodNames.includes(foodItem)) {
            //if so, check if the quantities match up.
            let existingAmount = 0;
            userDailyDiet.findOne({name: foodItem}, 'amount').exec()
              .then((food) => {
                existingAmount = food.amount;
                //if quantities do not match up, delete the old one, and create a
                //new updated foodItem
                if(foodItems[foodItem].amount != existingAmount) {
                    userDailyDiet.findOneAndRemove({name: foodItem}, function(err) {
                      if (err) {return next(err);}
                    });
                    userDailyDiet.create(foodItems[foodItem], function (err) {
                      if (err) {return next(err);}
                    });
                 };
              })
          } else {
            console.log(foodItem);
            userDailyDiet.create(foodItems[foodItem], function (err) {
               if (err) {return next(err);}
            });
          }
        }
        callback(null);
      },
      //ASYNC function 2: delete removed items
      function(callback) {
        console.log("deletedFoodItems=", deletedFoodNames);
        deletedFoodNames.forEach((deletedFoodName) =>
          userDailyDiet.findOneAndRemove({name: deletedFoodName}, function(err) {
            if(err) {return next(err);}
          })
        );
        callback(null);
      }
    ], function(err) {
      if (err) {return next(err);}
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.append('Access-Control-Allow-Headers', 'Content-Type');
      res.send("Saved!")
     });
   });
};

module.exports.get_fooditem_data = function(req, res, next) {
  userDailyDiet.find({}, {'_id': 0, '__v': 0}, function(err, foodItems) {
    if (err) console.log(err);
    console.log(foodItems);
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.json(foodItems);
  });
};
