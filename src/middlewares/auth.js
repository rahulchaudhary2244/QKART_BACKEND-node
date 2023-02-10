const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const jwt = require('jsonwebtoken');
const {tokenTypes} = require('../config/tokens')
const config = require("../config/config");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */
const verifyCallback = (req, resolve, reject) => async (user, err, info) => {
  if (user) {
    //TODO:------------------start---------------------
    //need to remove this, just to make test case pass - should call next with unauthorized error if the token is not an access token
    const { type } = jwt.decode(
      req.headers.authorization.split(" ")[1],
      config.jwt.secret
    );
    if (type === tokenTypes.REFRESH)
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    //-----------------------end----------------
    req.user = user;
    resolve("User authenticated");
  }

  reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
};

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 * 
 */
const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
