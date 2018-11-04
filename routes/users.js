var express = require('express');
var userRouter = express.Router();
const User = require('../models/user');
const debug = require('debug')('sharemypics-project:users');
const config = require('../config');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const utils = require('./utils');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'aReallySecretKey';


/* GET users */
userRouter.get('/', function(req, res, next) {
    User.find().sort('username').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

module.exports = userRouter;

/* GET one user */
userRouter.get('/:id', loadUserFromParamsMiddleware ,function(req, res, next) {
  res.send(req.user);
});

/* POST users */
userRouter.post('/', function(req, res, next) {
  new User(req.body).save(function(err, savedUser) {
    if (err) {
      return next(err);
    }

    debug(`Created user "${savedUser.name}"`);

    res
      .status(201)
      .set('Location', `${config.baseUrl}/users/${savedUser._id}`)
      .send(savedUser);
  });
});

/* PATCH users -> remplace un user au complet*/
userRouter.patch('/:id', authenticate, utils.requireJson, loadUserFromParamsMiddleware, function(req, res, next) {
  // Update properties present in the request body
  if (req.user._id !== req.params.id){
    return res.status(403).send('Please mind your own things.')
  }
  if (req.body.username !== undefined) {
    req.user.username = req.body.username;
  }
  if (req.body.surname !== undefined) {
    req.user.surname = req.body.surname;
  }
  if (req.body.name !== undefined) {
    req.user.name = req.body.name;
  }
  if (req.body.password !== undefined) {
    req.user.password = req.body.password;
  }
  if (req.body.profilepic !== undefined) {
    req.user.profilepic = req.body.profilepic;
  }

  req.user.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }

    debug(`Updated person "${savedUser.name}"`);
    res.send(savedUser);
  });
});

/* PUT users -> remplace un user au complet*/
userRouter.put('/:id', utils.requireJson, loadUserFromParamsMiddleware, function(req, res, next) {
  // Update properties present in the request body
  req.user.username = req.body.username;
  req.user.surname = req.body.surname;
  req.user.name = req.body.name;
  req.user.password = req.body.password;
  req.user.profilepic = req.body.profilepic;
  
  req.user.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }

    debug(`Updated person "${savedUser.name}"`);
    res.send(savedUser);
  });
});

/* DELETE user*/
userRouter.delete('/:id', loadUserFromParamsMiddleware ,function(req, res, next) {
  req.user.remove(function(err) {
      if (err) {
        return next(err);
      }
      debug(`Deleted user "${req.user.name}"`);
      res.sendStatus(204);
    });

});

function loadUserFromParamsMiddleware(req, res, next) {

  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return userNotFound(res, userId);
  }

  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return userNotFound(res, userId);
    }

    req.user = user;
    next();
  });
}
function userNotFound(res, userId) {
  return res.status(404).type('text').send(`No user found with ID ${userId}`);
}
function authenticate(req, res, next) {
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
  jwt.verify(token, secretKey, function(err, payload) {
      if (err) {
          return res.status(401).send('Your token is invalid or has expired');
      } else {
          req.user._id = payload.sub;
          next(); // Pass the ID of the authenticated user to the next middleware.
      }
  });
}