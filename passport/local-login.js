const jwt = require('jsonwebtoken');
const User = require('../models/User')
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config');
const jwtSecret = "secret"


module.exports = new PassportLocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("Incorrect username");
        return done({ message: 'Incorrect username.' });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if(err) {next(err);}
        if (!isMatch) {
          console.log("Incorrect Password");
          return done({ message: 'Incorrect password.' });
        }
        console.log("user._id//local-login");
        const payload = {
          sub: user._id
        };

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret);
        const data = {
          username: user.username
        };

        return done(null, token, data);
      });
    });
  }
)

/**
 * Return the Passport Local Strategy object.
 */
// module.exports = new PassportLocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   session: false,
//   passReqToCallback: true
// }, (req, email, password, done) => {
//   const userData = {
//     email: email.trim(),
//     password: password.trim()
//   };
//
//   // find a user by email address
//   return User.findOne({ email: userData.email }, (err, user) => {
//     if (err) { return done(err); }
//
//     if (!user) {
//       const error = new Error('Incorrect email or password');
//       error.name = 'IncorrectCredentialsError';
//
//       return done(error);
//     }
//
//     // check if a hashed user's password is equal to a value saved in the database
//     return user.comparePassword(userData.password, (passwordErr, isMatch) => {
//       if (err) { return done(err); }
//
//       if (!isMatch) {
//         const error = new Error('Incorrect email or password');
//         error.name = 'IncorrectCredentialsError';
//
//         return done(error);
//       }
//
//       const payload = {
//         sub: user._id
//       };
//
//       // create a token string
//       const token = jwt.sign(payload, config.jwtSecret);
//       const data = {
//         name: user.name
//       };
//
//       return done(null, token, data);
//     });
//   });
// });
