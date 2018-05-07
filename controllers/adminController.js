const rdiCollection = require('../models/RDICollection');
const User = require('../models/User');
const foodDataCollection = require('../models/foodDataCollection');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const passport = require('passport');


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

//TODO: Instead of deleting and recreating RDISets as an update sequence, try actually updating?
//TODO: Try implementing indexing so searches are quicker.
module.exports.save_RDISet = function(req, res, next) {
  const rdiSetSent = req.body;
  let existingRDISources = [];

  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

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
  console.log("here");
  const foodData = req.body.data;
  console.log(foodData);
  // console.log(foodData);
  for(let foodItem of foodData) {
    console.log(foodItem.name);
    foodDataCollection.create(foodItem, function(err) {
      if(err) {return next(err);}
    })
  };
  // res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.send("done");
}

module.exports.signup_User = [
  check('firstName',"First Name Required!").isLength({min: 1}),
  check('lastName', "Last Name Required!").isLength({min:1}),
  check('email', "Email Required!").isEmail(),
  check('username', "Username is Required!").isLength({min:1}),
  check('password', "Password must be at least 6 characters!").isLength({min:6}),

  (req,res,next) => {
    // res.append('Access-Control-Allow-Origin', ['*']);
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.append('Access-Control-Allow-Headers', 'Content-Type');

    // console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      })

      User.createUser(newUser,function(err, user) {
        if(err) {next(err);}
      });

      res.json("success");
    }
  }
];

module.exports.login_User = function(req, res, next) {
  // const validationResult = validateLoginForm(req.body);
  // if (!validationResult.success) {
  //   return res.status(400).json({
  //     success: false,
  //     message: validationResult.message,
  //     errors: validationResult.errors
  //   });
  // }


  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      return res.status(400).json({
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



module.exports.test = function(req, res, next) {
  // console.log("seshUser", req.user)
  // console.log("req.session", req.session);
  // res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.send(req.user);
}

// console.log("arguments", arguments);
// if (err) { return next(err); }
// if (!user) { return res.redirect('http://localhost:3000/admin/login'); }
// req.logIn(user, function(err) {
//   if (err) { return next(err); }
//   return res.redirect('http://localhost:3000/');
// });


  // const firstName = req.body.firstName;
  // const lastName = req.body.lastName;
  // const email= req.body.email;
  // const username = req.body.username;
  // const password = req.body.password;


//
//   console.log(firstName);
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   res.send("morency");
// }
