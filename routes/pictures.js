const config = require('../config');
const debug = require('debug')('sharemypics-project:pictures');
const express = require('express');
const mongoose = require('mongoose');
const Picture = require('../models/picture');
const utils = require('./utils');
const ObjectId = mongoose.Types.ObjectId;

var picturesRouter = express.Router();

picturesRouter.get('/', function (req, res, next) {
    Picture.find().sort('URL').exec(function (err, pictures) {
        if (err) {
          return next(err);
        }
        let query = Picture.find();
        
        res.send(pictures);
    });
});

module.exports = picturesRouter;

