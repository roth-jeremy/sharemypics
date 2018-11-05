const bcrypt = require('bcrypt');
const config = require('../config');
const debug = require('debug')('sharemypics-project:users');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user');
const utils = require('./utils');
const secretKey = process.env.SECRET_KEY || 'aReallySecretKey';

const router = express.Router();

/**
 * @api {post} /users/register Register a new user
 * @apiName ResgisterUser
 * @apiGroup User
 *
 * @apiSuccess {String} username User name of the user
 * @apiSuccess {String} password  Password of the user
 * @apiSuccess {String} name  Name of the user
 * @apiSuccess {String} surname  Surname of the user
 * @apiSuccess {ObjectId} profilePicture  Profile picture of the user
 */
router.post('/register', function (req, res, next) {
  new User(req.body).save(function (err, savedUser) {
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

/**
 * @api {post} /users/authenticate Authenticate an existing user
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiSuccess {String} username User name of the user
 * @apiSuccess {String} password  Password of the user
 * @apiSuccess {String} name  Name of the user
 * @apiSuccess {String} surname  Surname of the user
 * @apiSuccess {ObjectId} profilePicture  Profile picture of the user
 */
router.post('/authenticate', function (req, res, next) {
  User.findOne({ username: req.body.username }).select("+password").exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.sendStatus(401);
    }

    debug(`Attempting to authenticate user "${user.name}"`);

    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) {
        return next(err);
      } else if (!valid) {
        return res.sendStatus(401);
      }

      const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;

      const claims = {
        sub: user._id.toString(),
        exp: exp
      };

      jwt.sign(claims, secretKey, function (err, token) {
        if (err) {
          return next(err);
        }
        res.json({ user, token }); // Send the token to the client
      })
    })
  })
});

/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiSuccess {String} username User name of the user
 * @apiSuccess {String} password  Password of the user
 * @apiSuccess {String} name  Name of the user
 * @apiSuccess {String} surname  Surname of the user
 * @apiSuccess {ObjectId} profilePicture  Profile picture of the user
 */
router.get('/', function (req, res, next) {
  User.find().sort('username').exec(function (err, users) {
    if (err) {
      return next(err);
    }
    let query = User.find();

    res.send(users);
  });
});

/**
 * @api {get} /users/:id Get a user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} username User name of the user
 * @apiSuccess {String} password  Password of the user
 * @apiSuccess {String} name  Name of the user
 * @apiSuccess {String} surname  Surname of the user
 * @apiSuccess {ObjectId} profilePicture  Profile picture of the user
 */
router.get('/:id', loadUserFromParamsMiddleware, function (req, res, next) {
  res.send(req.user);
});

/**
* @api {patch} /users/:id Partially update a user, all parameters optionnal
* @apiName PatchUser
* @apiGroup User
*
* @apiParam {Number} id Unique identifier of the user
*
* @apiSuccess {String} username User name of the user
* @apiSuccess {String} password  Password of the user
* @apiSuccess {String} name  Name of the user
* @apiSuccess {String} surname  Surname of the user
* @apiSuccess {ObjectId} profilePicture  Profile picture of the user
*/
router.patch('/:id', utils.authorize, utils.requireJson, loadUserFromParamsMiddleware, function (req, res, next) {
  // Update properties present in the request body
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

  req.user.save(function (err, savedUser) {
    if (err) {
      return next(err);
    }

    debug(`Updated user "${savedUser.name}"`);
    res.send(savedUser);
  });
});

/**
 * @api {put} /users/:id Completely update a user
 * @apiName PutUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} username User name of the user
 * @apiSuccess {String} password  Password of the user
 * @apiSuccess {String} name  Name of the user
 * @apiSuccess {String} surname  Surname of the user
 * @apiSuccess {ObjectId} profilePicture  Profile picture of the user
 */
router.put('/:id', utils.authorize, loadUserFromParamsMiddleware, function (req, res, next) {
  // Update properties present in the request body
  req.user.username = req.body.username;
  req.user.surname = req.body.surname;
  req.user.name = req.body.name;
  req.user.password = req.body.password;
  req.user.profilepic = req.body.profilepic;

  req.user.save(function (err, savedUser) {
    if (err) {
      return next(err);
    }

    debug(`Updated user "${savedUser.name}"`);

    res.send(savedUser);
  });
});

/**
 * @api {delete} /users/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} username User name of the user
 * @apiSuccess {String} password  Password of the user
 * @apiSuccess {String} name  Name of the user
 * @apiSuccess {String} surname  Surname of the user
 * @apiSuccess {ObjectId} profilePicture  Profile picture of the user
 */
router.delete('/:id', loadUserFromParamsMiddleware, function (req, res, next) {
  req.user.remove(function (err) {
    if (err) {
      return next(err);
    }

    debug(`Deleted user "${req.user.name}"`);

    res.sendStatus(204);
  });

});

// TODO COMMENT MISSING
function loadUserFromParamsMiddleware(req, res, next) {
  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return userNotFound(res, userId);
  }

  User.findById(req.params.id, function (err, user) {
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

module.exports = router;