const express = require("express");
const router = express.Router();
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User')

const adminController = require('../controllers/adminController');

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     console.log("username", username);
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         console.log("Incorrect username");
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       User.comparePassword(password, user.password, function(err, isMatch) {
//         if(err) {next(err);}
//         if (!isMatch) {
//           console.log("Incorrect Password");
//           return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, user);
//       });
//     });
//   }
// ));

//TODO: figure our serialize and deserialize. Get req.user to show up.
// passport.serializeUser(function(user, done) {
//   console.log("serialize//user.id", user.id);
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   console.log("deserialize//id", id);
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

router.post('/metrics', adminController.save_RDISet);
router.post('/foodData', adminController.save_foodData);
router.post('/signup', adminController.signup_User);
router.post('/login', adminController.login_User);

// function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     console.log("user", user);
//     if (!user) { res.send(["failure", info])};
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//        res.send(["success", user.id]);
//     });
//   })(req, res, next);
// }


//
//  passport.authenticate('local',
// // {
// //   successRedirect: 'http://localhost:3000/',
// //   failureRedirect: 'http://localhost:3000/admin/login'}
// adminController.login_User
// )
// );



module.exports = router;
