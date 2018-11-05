const config = require('../config');
const debug = require('debug')('sharemypics-project:albums');
const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Album = require('../models/album');
const utils = require('./utils');

const router = express.Router();


router.get('/', function (req, res, next) {
  Album.find().sort('title').exec(function (err, albums) {
    if (err) {
      return next(err);
    }
    let query = Album.find();

    res.send(albums);
  });
})

module.exports = router;
