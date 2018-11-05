const config = require('../config');
const formatLinkHeader = require('format-link-header');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'aReallySecretKey';

/**
 * Responds with 415 Unsupported Media Type if the request does not have the Content-Type application/json.
 */
exports.requireJson = function (req, res, next) {
  if (req.is('application/json')) {
    return next();
  }

  const error = new Error('This resource only has an application/json representation');
  error.status = 415; // 415 Unsupported Media Type
  next(error);
};

/**
 * 
 */
exports.authorize = function (req, res, next) {
  // Ensure the header is present.
  const authorization = req.get('Authorization');
  if (!authorization) {
    return res.status(401).send('Authorization header is missing');
  }
  // Check that the header has the correct format.
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).send('Authorization header is not a bearer token');
  }

  // Extract and verify the JWT.
  const token = match[1];
  jwt.verify(token, secretKey, function (err, payload) {
    if (err) {
      return res.status(401).send('Your token is invalid or has expired');
    } else {
      // Append user to request if logged in
      User.findOne({ _id: payload.sub }).exec(function (err, user) {
        if (err) {
          return res.status(401).send('User not found');
        }
        if (!user) {
          res.send(401, 'User not currently logged in');
        }
        else {
          req.user = user;
          next();
        }
      })
    }
  });
};