var express = require('express');
var pictureRouter = express.Router();
const Photo = require('../models/picture');
const debug = require('debug')('sharemypics-project:pictures');
const config = require('../config');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/* GET photos */
pictureRouter.get('/', function(req, res, next) {
    picture.find().sort('id').exec(function(err, pictures) {
    if (err) {
      return next(err);
    }
    res.send(pictures);
  });
});