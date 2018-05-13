var userDailyDiet = require('../models/UserDailyDiet');
var foodDataCollection = require('../models/foodDataCollection');
var UserCollection = require('../models/User')
const rdiCollection = require('../models/RDICollection');
var async = require('async')

//TODO: implement Access-Control-Allow-Origin globally so you don't
//have to type it out every time
//TODO: check if food item already exists in database
module.exports.save_fooditem_data = function(req, res, next) {
  const diet = req.body;
  const userId = req.user._id;
  console.log("diet", diet);
  console.log("user", userId);
  const sentFoodNames = Object.keys(req.body.items);
  const deletedFoodNames = [];
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

  UserCollection.findById(userId, function(err, user) {
    if(err) {next(err);}
    console.log("findUser", user);
    user.diets.push(diet);
    user.save(function(err) {
      if(err) {next(err);}
    })
  })

  // userDailyDiet.find({}, 'name', function(err, dbFoodItems) {
  //   if (err) {return next(err);}
  //   for (let dbFoodItem in dbFoodItems) {
  //     const foodName = dbFoodItems[dbFoodItem].name;
  //     existingFoodNames.push(foodName);
  //     //if sentFoodNames does not include dbFoodName, that means its been deleted
  //     //on on the client side, so we should note this down to delete our DB instance
  //     if(!sentFoodNames.includes(foodName)) {
  //       deletedFoodNames.push(foodName);
  //     };
  //   };
  //
  //         // delete: deleteRemovedFoodItems();
  //   async.parallel([
  //     //ASYNC Function 1: saveFoodItems
  //     function(callback) {
  //       for (let foodItem in foodItems) {
  //         //check if foodItem already existing in database
  //         if(existingFoodNames.includes(foodItem)) {
  //           //if so, check if the quantities match up.
  //           let existingAmount = 0;
  //           userDailyDiet.findOne({name: foodItem}, 'amount').exec()
  //             .then((food) => {
  //               existingAmount = food.amount;
  //               //if quantities do not match up, delete the old one, and create a
  //               //new updated foodItem
  //               if(foodItems[foodItem].amount != existingAmount) {
  //                   userDailyDiet.findOneAndRemove({name: foodItem}, function(err) {
  //                     if (err) {return next(err);}
  //                   });
  //                   userDailyDiet.create(foodItems[foodItem], function (err) {
  //                     if (err) {return next(err);}
  //                   });
  //                };
  //             })
  //         } else {
  //           userDailyDiet.create(foodItems[foodItem], function (err) {
  //              if (err) {return next(err);}
  //           });
  //         }
  //       }
  //       callback(null);
  //     },
  //     //ASYNC function 2: delete removed items
  //     function(callback) {
  //       deletedFoodNames.forEach((deletedFoodName) =>
  //         userDailyDiet.findOneAndRemove({name: deletedFoodName}, function(err) {
  //           if(err) {return next(err);}
  //         })
  //       );
  //       callback(null);
  //     }
  //   ], function(err) {
  //     if (err) {return next(err);}
  //     // console.log("headers");
  //     // res.append('Access-Control-Allow-Origin', ['*']);
  //     // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //     // res.append('Access-Control-Allow-Headers', 'Content-Type');
  //     res.send("Saved!");
  //    });
  //  });
};

module.exports.get_fooditem_data = function(req, res, next) {
  console.log("getfoodItemData", req.user._id);
  userDailyDiet.find({}, {'_id': 0, '__v': 0}, function(err, foodItems) {
    if (err) {next(err);}
    // console.log(foodItems);
    // res.append('Access-Control-Allow-Origin', ['*']);
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.json(foodItems);
  });
};

//TODO: add indexes for each nutrient to speed up search. Current search takes a
//couple seconds to complete.
// module.exports.get_nutritiousfood_data = function(req, res, next) {
//   let deficiencyList = req.body;
//   let nutritiousFoodSearch = {};
//   for (let deficiency in deficiencyList) {
//     nutritiousFoodSearch[deficiency] = function(callback) {
//       foodDataCollection.find({},{'_id': 0, 'name':1, [deficiency]: 1}).sort({[deficiency]:-1}).limit(5).exec(callback);
//     };
//   }
//
//   async.parallel(nutritiousFoodSearch, function(err, nutritiousFoodList) {
//     res.append('Access-Control-Allow-Origin', ['*']);
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     res.json(nutritiousFoodList);
//   });
//
// }

module.exports.get_nutritiousfood_data = function(req, res, next) {
  const deficiency = req.params.deficiency;
  // console.log(deficiency);

  // function sendList(err, list) {
  //   console.log(list);
  //   // res.append('Access-Control-Allow-Origin', ['*']);
  //   // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   // res.append('Access-Control-Allow-Headers', 'Content-Type');
  //   // res.json(list);
  // }

  foodDataCollection.find({},{'_id': 0, 'name':1, [deficiency]: 1}).
                     sort({[deficiency]:-1}).
                     limit(20).
                     exec(function(err,list) {
                       if(err) {next(err);}
                       // res.append('Access-Control-Allow-Origin', ['*']);
                       // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                       // res.append('Access-Control-Allow-Headers', 'Content-Type');
                       res.json(list);
                     });

// foodDataCollection.findOne(function(one) {
//   console.log(one);
// })


  // let deficiencyList = req.params.deficiency
  // let nutritiousFoodSearch = {};
  // for (let deficiency in deficiencyList) {
  //   nutritiousFoodSearch[deficiency] = function(callback) {
  //     foodDataCollection.find({},{'_id': 0, 'name':1, [deficiency]: 1}).sort({[deficiency]:-1}).limit(5).exec(callback);
  //   };
  // }
  //
  // async.parallel(nutritiousFoodSearch, function(err, nutritiousFoodList) {
  //   res.append('Access-Control-Allow-Origin', ['*']);
  //   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.append('Access-Control-Allow-Headers', 'Content-Type');
  //   res.json(nutritiousFoodList);
  // });

}

module.exports.get_RDISet = function(req, res, next) {
  // console.log(req.user);
  // console.log("here", req.params.sex, req.params.age);
  const sex = req.params.sex;
  const age = req.params.age;

  // res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');



  if(sex === "default" && age === "default") {
    rdiCollection.findOne(function(err, RDISet) {
      if (err) {next(err);}
      // console.log(RDISet);
      res.json(RDISet);
    });
  }
  else {
    rdiCollection.
      findOne({
        sex: sex,
        "age_min": {$lte: age},
        "age_max": {$gte: age}}).
      exec(function(err,RDISet) {
       if(err) {next(err);}
       res.json(RDISet);
     });
  }
};
