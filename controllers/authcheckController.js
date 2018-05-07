const jwt = require('jsonwebtoken');
const User = require('../models/User')
const config = require('../config');


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  console.log("authenticating", req.headers);
  // console.log("acrh", req.headers["access-control-request-headers"]);
  // if(req.headers["access-control-request-headers"].authorization) {
  // }
  if (!req.headers.authorization) {
    console.log("no authorization header");
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  console.log("token", token);

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    console.log("jwtSecret", config.jwtSecret);
    // the 401 code is for unauthorized status
    if (err) {
      console.log(err);
      return res.status(401).end();
    }

    const userId = decoded.sub;
    console.log("userId", userId);

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }
      // pass user details onto next route
      req.user = user
      return next();
    });
  });
  // next();
};
