var userDailyDiet = require('../models/UserDailyDiet');
var foodDataCollection = require('../models/foodDataCollection');
var UserCollection = require('../models/User')
const rdiCollection = require('../models/RDICollection');

function getDietNames(user) {
  console.log("here");
  console.log("user", user);
  const dietNameList = user.diets.map((diet) => {return {"name": diet.name, "_id": diet._id}});
  console.log("about to return");
  return dietNameList;
}

//TODO: check if food item already exists in database
module.exports.save_fooditem_data = function(req, res, next) {

  const sentDiet = req.body;
  const user = req.user;
  console.log("sentDiet");

  if (sentDiet._id) {
    const existingDiet = user.diets.id(sentDiet._id);
    existingDiet.items = sentDiet.items;
  }
  else {
    user.diets.push(sentDiet);
  }

  user.save(function(err) {
    if(err) {next(err);}
    // const dietNames = getDietNames(user);
    // const dietNames = user.diets.map((diet) => {return {"name": diet.name, "_id": diet._id}});
    console.log("coolio");
    res.json({"message": "Saved!", "dietNames": getDietNames(user)});
  });
  //   //TODO: understand how errors work. does return next(err) skip to the next
  //   //middleware without running the rest of the code? I'm concerned that
  //   //this middleware will send "Saved!", even if there's been an error.
  // // does this async? If so, do i need to use promises to make sure the creation of Allow
  // // the objects occurs
  // //collect all foodItem names stored in database so we can avoid duplicating
  // //existing items
  // //TODO: this code could probably be refactored to be more efficient, better looking
  // //and more robust

};

module.exports.delete_fooditem_data = function(req, res, next) {
  const user = req.user;
  const dietId = req.params.dietName;
  // console.log("req.user", req.user);
  // console.log(req.params.dietName);
  const diet = user.diets.pull(dietId);
  user.save(function(err) {
    if(err) {next(err);}
    res.json({"message": "Deleted!", "dietNames": getDietNames(user)});
  })
}

module.exports.get_fooditem_data = function(req, res, next) {
  //if a specific diet name is requested, send that one
  if(req.params.dietName) {
    const dietId = req.params.dietName;
    const diet = req.user.diets.id(dietId);
    res.json(diet);
  //otherwise, send along the first diet stored and a list of all diet names stored
  } else {
    // const dietNames = getDietNames(req.user);
    // const dietNames = req.user.diets.map((diet) => {return {"name": diet.name, "_id": diet._id}});
    res.json({"defaultDiet": req.user.diets[0], "dietNames": getDietNames(req.user)})
  }
};

//TODO: add indexes for each nutrient to speed up search. Current search takes a
//couple seconds to complete.

module.exports.get_RDISet = function(req, res, next) {
  const sex = req.user.sex;
  const age = req.user.age;

  rdiCollection.
    findOne({
      sex: sex,
      "age_min": {$lte: age},
      "age_max": {$gte: age}}).
    exec(function(err,RDISet) {
     if(err) {next(err);}
     res.json(RDISet);
   });

  // let sex = req.params.sex;
  // let age = req.params.age;
  //
  // function getRDISet(sex, age) {
  //   rdiCollection.
  //     findOne({
  //       sex: sex,
  //       "age_min": {$lte: age},
  //       "age_max": {$gte: age}}).
  //     exec(function(err,RDISet) {
  //      if(err) {next(err);}
  //      res.json(RDISet);
  //    });
  // }
  //
  // if (sex && age) {
  //   if(sex === "default" && age === "default") {
  //     rdiCollection.findOne(function(err, RDISet) {
  //       if (err) {next(err);}
  //       // console.log(RDISet);
  //       res.json(RDISet);
  //     });
  //   }
  //   else {
  //     getRDISet(sex, age);
  //   }
  // }
  // else {
  //   const user = req.user;
  //   getRDISet(user.sex, user.age);
  //
  // }
  // //if
};
