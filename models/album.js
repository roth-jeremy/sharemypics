const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for albums
const albumSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  contributors: [{
    type: String,
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  pictures: [{
    type: String,
  }],
  location: {
      type: String,
  },
  coverPic: {
      type: String,
  }
});

// Create the model from the schema and export it
module.exports = mongoose.model('Album', albumSchema);