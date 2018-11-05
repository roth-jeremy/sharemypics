const config = require('../config');
const debug = require('debug')('sharemypics-project:albums');
const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Album = require('../models/album');
const utils = require('./utils');
const User = require('../models/user');
const UserRouter = require('./users');

const router = express.Router();

/**
 * @api {post} /albums Post an album
 * @apiName PostAlbum
 * @apiGroup Album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an user's ID
 */
router.post('/', utils.authorize, function (req, res, next) {
  // Such a clever hack to add default user to request body
  // Create new album and add current user as its first contributor
  let params = { title: req.body.title, contributors: [req.user._id,] };
  new Album(params).save(function (err, savedAlbum) {
    if (err) {
      return next(err);
    }

    debug(`Created album "${savedAlbum.title}"`);

    res
      .status(201)
      .set('Location', `${config.baseUrl}/albums/${savedAlbum._id}`)
      .send(savedAlbum);
  });
})

/**
 * @api {post} /:id/addContributor Post an album
 * @apiName PostAlbum
 * @apiGroup Album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an user's ID
 */
router.post('/contribute/:id', utils.authorize, loadAlbumFromParamsMiddleware, function (req, res, next) {
  // Check if the new contributor id exists
  User.findById(req.body.userId, function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      res.status(404).type('text').send(`No user found with ID ${req.params.userId}`);
    }

    // Find album and add contributor to id
    req.album.contributors.push(user._id);

    // Save album to database
    req.album.save(function (err, savedAlbum) {
      if (err) {
        return next(err);
      }
  
      debug(`Updated album "${savedAlbum.title}"`);
  
      res
        .status(200)
        .set('Location', `${config.baseUrl}/albums/${savedAlbum._id}`)
        .send(savedAlbum);
    });
  });
});

/**
 * @api {get} /albums Get all albums
 * @apiName GetAlbums
 * @apiGroup Album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an user's ID
 */
router.get('/', function (req, res, next) {
  Album.find().sort('title').exec(function (err, albums) {
    if (err) {
      return next(err);
    }
    let query = Album.find();

    res.send(albums);
  });
})

/**
 * @api {get} /albums/:id Get an album
 * @apiName GetAlbum
 * @apiGroup Album
 * 
 * @apiParam {Number} id Unique identifier of the album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an album's ID
 */
router.get('/:id', loadAlbumFromParamsMiddleware, function (req, res, next) {
  res.send(req.album);
});

/**
 * @api {patch} /albums/:id Partially update an album, all parameters optionnal
 * @apiName PatchAlbum
 * @apiGroup Album
 * 
 * @apiParam {Number} id Unique identifier of the album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an user's ID
 */
router.patch('/:id', utils.requireJson, loadAlbumFromParamsMiddleware, function (req, res, next) {
  // Update properties present in the request body
  if (req.body.title !== undefined) {
    req.album.title = req.body.title;
  }
  if (req.body.contributors !== undefined) {
    req.album.contributors = req.body.contributors;
  }

  req.album.save(function (err, savedAlbum) {
    if (err) {
      return next(err);
    }

    debug(`Updated album "${savedAlbum.title}"`);

    res.send(savedAlbum);
  });
});

/**
 * @api {put} /albums/:id Completely update an album
 * @apiName PutAlbum
 * @apiGroup Album
 * 
 * @apiParam {Number} id Unique identifier of the album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an user's ID
 */
router.put('/:id', utils.requireJson, loadAlbumFromParamsMiddleware, function (req, res, next) {
  // Update properties present in the request body
  req.album.title = req.body.title;
  req.album.contributors = req.body.contributors;

  req.album.save(function (err, savedAlbum) {
    if (err) {
      return next(err);
    }

    debug(`Updated album "${savedAlbum.name}"`);
    res.send(savedAlbum);
  });
});

/**
 * @api {delete} /albums/:id Delete an album
 * @apiName DeleteAlbum
 * @apiGroup Album
 * 
 * @apiParam {Number} id Unique identifier of the album
 *
 * @apiSuccess {String} title Title of the album
 * @apiSuccess {ObjectIdArray} contributors  An array of the album's contributors, defined by an user's ID
 */
router.delete('/:id', loadAlbumFromParamsMiddleware, function (req, res, next) {
  req.album.remove(function (err) {
    if (err) {
      return next(err);
    }
    debug(`Deleted album "${req.album.title}"`);
    res.sendStatus(204);
  });

});

//TODO comments MISSING
function loadAlbumFromParamsMiddleware(req, res, next) {
  const albumId = req.params.id;
  if (!ObjectId.isValid(albumId)) {
    return albumNotFound(res, albumId);
  }

  Album.findById(req.params.id, function (err, album) {
    if (err) {
      return next(err);
    } else if (!album) {
      return albumNotFound(res, albumId);
    }

    req.album = album;
    next();
  });
}

//TODO COMMENTS MISSING
function albumNotFound(res, albumId) {
  return res.status(404).type('text').send(`No album found with ID ${albumId}`);
}

// Duh.
module.exports = router;