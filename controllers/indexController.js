var foodDataCollection = require('../models/foodDataCollection');
var rdiCollection = require('../models/RDICollection');

module.exports.get_nutritiousfood_data = function(req, res, next) {
  console.log("indexController.get_nu");
  const deficiency = req.params.deficiency;

  foodDataCollection.find({},{'_id': 0, 'name':1, [deficiency]: 1}).
                     sort({[deficiency]:-1}).
                     limit(20).
                     exec(function(err,list) {
                       if(err) {next(err);}
                       res.json(list);
                     });

}

module.exports.get_RDISet = function(req, res, next) {
  let sex = req.params.sex;
  let age = req.params.age;

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
