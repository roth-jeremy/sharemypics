const config = require('../config');
const debug = require('debug')('sharemypics-project:pictures');
const express = require('express');
const mongoose = require('mongoose');
<<<<<<< HEAD
const Picture = require('../models/picture');
=======
>>>>>>> filtering
const utils = require('./utils');
const ObjectId = mongoose.Types.ObjectId;

var picturesRouter = express.Router();

/**
 * @api {post} /pictures Post a picture
 * @apiName PostPicture
 * @apiGroup Picture
 *
 * @apiSuccess {ObjectId} inAlbum ID of the album in which the picture is
 * @apiSuccess {String} url  The URL of the picture
 * @apiSuccess {ObjectId} addedBy  The ID of the user that added the picture
 * @apiSuccess {GeoJSON} location  The GeoJSON object with the infos of where the picture was taken
 */
router.post('/', function (req, res, next) {
});

/**
 * @api {get} /pictures Get all pictures
 * @apiName GetPictures
 * @apiGroup Picture
 *
 * @apiSuccess {ObjectId} inAlbum ID of the album in which the picture is
 * @apiSuccess {String} url  The URL of the picture
 * @apiSuccess {ObjectId} addedBy  The ID of the user that added the picture
 * @apiSuccess {GeoJSON} location  The GeoJSON object with the infos of where the picture was taken
 */
<<<<<<< HEAD
router.get('/', function (req,picturesRouter.get('/', function (req, res, next) {
	let query = Picture.find();
	// Filter pitures by Album
	if (ObjectId.isValid(req.query.inAlbum)) {
	  query = query.where('inAlbum').equals(req.query.inAlbum);
	}
	// Filter pitures by Who added it
	if (ObjectId.isValid(req.query.AddedBy)) {
	  query = query.where('AddedBy').equals(req.query.AddedBy);
	}
	  // Execute the query
	  query.exec(function(err, pictures) {
     	if (err) {
       		return next(err);
		}
 		res.send(pictures);
	});
=======
>>>>>>> filtering
});

/**
 * @api {patch} /pictures/:id Partially update a picture, all parameters optionnal
 * @apiName GetPicture
 * @apiGroup Picture
 * 
 * @apiParam {Number} id Unique identifier of the picture
 *
 * @apiSuccess {ObjectId} inAlbum ID of the album in which the picture is
 * @apiSuccess {String} url  The URL of the picture
 * @apiSuccess {ObjectId} addedBy  The ID of the user that added the picture
 * @apiSuccess {GeoJSON} location  The GeoJSON object with the infos of where the picture was taken
 */
  if (req.body.inAlbum !== undefined) {
    req.picture.inAlbum = req.body.inAlbum;
  }
  if (req.body.url !== undefined) {
    req.picture.url = req.body.url;
  }
  if (req.body.addedBy !== undefined) {
    req.picture.addedBy = req.body.addedBy;
  }
  if (req.body.location !== undefined) {
    req.picture.location = req.body.location;
  }

  req.picture.save(function (err, savedPicture) {
    if (err) {
      return next(err);
    }

    debug(`Updated picture "${savedPicture.url}"`);
    res.send(savedPicture);
  });
});

/**
 * @api {put} /pictures/:id Completely update a picture
 * @apiName UpdatePicture
 * @apiGroup Picture
 * 
 * @apiParam {Number} id Unique identifier of the picture
 *
 * @apiSuccess {ObjectId} inAlbum ID of the album in which the picture is
 * @apiSuccess {String} url  The URL of the picture
 * @apiSuccess {ObjectId} addedBy  The ID of the user that added the picture
 * @apiSuccess {GeoJSON} location  The GeoJSON object with the infos of where the picture was taken
 */
router.put('/:id', utils.requireJson, loadPictureFromParamsMiddleware, function (req, res, next) {
  req.picture.url = req.body.url;
  req.picture.addedBy = req.body.addedBy;
  req.picture.location = req.body.location;

  req.picture.save(function (err, savedPicture) {
    if (err) {
      return next(err);
    }

    debug(`Updated picture "${savedPicture.url}"`);
    res.send(savedPicture);
  });
});

/**
 * @api {delete} /pictures/:id Delete a picture
 * @apiName DeletePicture
 * @apiGroup Picture
 * 
 * @apiParam {Number} id Unique identifier of the picture
 *
 * @apiSuccess {ObjectId} inAlbum ID of the album in which the picture is
 * @apiSuccess {String} url  The URL of the picture
 * @apiSuccess {ObjectId} addedBy  The ID of the user that added the picture
 * @apiSuccess {GeoJSON} location  The GeoJSON object with the infos of where the picture was taken
 */
router.delete('/:id', loadPictureFromParamsMiddleware, function (req, res, next) {
});

//TODO comments MISSING
function loadPictureFromParamsMiddleware(req, res, next) {
    } else if (!picture) {
      return albumNotFound(res, pictureId);
    }
      next();

<<<<<<< HEAD
  //TODO COMMENTS MISSING
  function pictureNotFound(res, pictureId) {
    return res.status(404).type('text').send(`No picture found with ID ${pictureId}`);
  }

module.exports = picturesRouter;

=======
>>>>>>> filtering
