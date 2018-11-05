const config = require('../config');
const debug = require('debug')('sharemypics-project:pictures');
const express = require('express');
const mongoose = require('mongoose');
const Picture = require('../models/picture');
const utils = require('./utils');
const ObjectId = mongoose.Types.ObjectId;

var picturesRouter = express.Router();

picturesRouter.get('/', function (req, res, next) {
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
});

module.exports = picturesRouter;

