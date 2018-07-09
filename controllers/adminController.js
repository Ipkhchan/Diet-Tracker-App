const rdiCollection = require('../models/RDICollection');
const User = require('../models/User');
const foodDataCollection = require('../models/foodDataCollection');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const passport = require('passport');


//TODO: Instead of deleting and recreating RDISets as an update sequence, try actually updating?
//TODO: Try implementing indexing so searches are quicker.
module.exports.save_RDISet = function(req, res, next) {
  const rdiSetSent = req.body;
  let existingRDISources = [];

  function createRDISet(message) {
    rdiCollection.create(rdiSetSent, function(err) {
      if (err) {next(err);}
      res.send(message);
    });
  };

  function updateRDISet(message) {
    rdiCollection.findOneAndRemove({source: rdiSetSent.source}, function(err) {
      if (err) {next(err);}
    })
    createRDISet(message);
  };


  rdiCollection.find({}, ['source','age_min','age_max', 'sex'], function(err, rdiSources) {
    if (err) {next(err);}
    if (rdiSources.length > 0) {
      for (let rdiSource of rdiSources) {
        if(rdiSetSent.source == rdiSource.source &&
           rdiSetSent.age_min == rdiSource.age_min &&
           rdiSetSent.age_max == rdiSource.age_max &&
           rdiSetSent.sex == rdiSource.sex) {
             updateRDISet("Updated RDISet!");
             break;
        }
        else {
          createRDISet("Created RDISet!");
          break;
        }
      }
    }
    else {
      createRDISet("Created RDISet!");
    };
  });
};

module.exports.save_foodData = function(req, res, next) {
  const foodData = req.body.data;

  for(let foodItem of foodData) {
    foodDataCollection.create(foodItem, function(err) {
      if(err) {return next(err);}
    })
  };
  res.send("done");
}

module.exports.signup_User = [
  check('firstName',"First Name Required!").isLength({min: 1}),
  check('lastName', "Last Name Required!").isLength({min:1}),
  check('email', "Email Required!").isEmail(),
  check('username', "Username is Required!").isLength({min:1}),
  check('password', "Password must be at least 6 characters!").isLength({min:6}),
  check('sex', "Sex is missing!").exists(),
  check('age', "Age must be a positive number!").custom((value) => value > 0),
  check('age', "Age must be a number!").custom((value) => !isNaN(value)),

  (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        sex: req.body.sex,
        age: req.body.age
      })

      User.createUser(newUser,function(err, user) {
        if(err) {next(err);}
      });

      res.json("success");
    }
  }
];

module.exports.login_User = function(req, res, next) {
  if (!req.body.password.length) {
    res.json({
      success: false,
      message: "Password is Missing"
    })
  }

  if (!req.body.username.length) {
    res.json({
      success: false,
      message: "Username is Missing"
    })
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message
      });
    }


    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
};
