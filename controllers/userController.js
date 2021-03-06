var User = require('../models/User')
const rdiCollection = require('../models/RDICollection');

function getDietNames(user) {
  const dietNameList = user.diets.map((diet) => {return {"name": diet.name, "_id": diet._id}});
  return dietNameList;
}

//TODO: check if food item already exists in database
module.exports.save_fooditem_data = function(req, res, next) {
  const sentDiet = req.body;
  const user = req.user;

  //if there's an id in the nutritionData, that means that this diet has been saved
  //before and is an existing diet.
  if (sentDiet._id) {
    const existingDiet = user.diets.id(sentDiet._id);
    existingDiet.items = sentDiet.items;
  }
  else {
    user.diets.push(sentDiet);
  }

  user.save(function(err) {
    if(err) {next(err);}
    User.find({'diets.name': sentDiet.name}, {'diets.$': 1}, function(err, diet) {
      if(err) {next(err);}
      res.json({"message": "Saved!",
                "nutritionData": diet[0].diets[0],
                "dietNames": getDietNames(user)});
    })
  });
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
};
