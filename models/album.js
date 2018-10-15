const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for albums
const albumSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  contributors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  pictures: [{
    type: Schema.Types.ObjectId,
    ref: 'Picture',
  }],
  location: {
      type: String,
  },
  coverPic: {
      type: Schema.Types.ObjectId,
      ref: 'Picture'
  }
});

// Create the model from the schema and export it
module.exports = mongoose.model('Album', albumSchema);