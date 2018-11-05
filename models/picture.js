const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for pictures
const pictureSchema = new Schema({
  inAlbum: {
    type: ObjectId,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  addedBy: {
    type: ObjectId,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  location: {
  	type: {
  		type: {
  			type: String,
  			required: true,
  			enum: ["Point"]
  		},
  		coordinates: {
  			type: [Number],

  		}
  	}
  }
});

// Create the model from the schema and export it
module.exports = mongoose.model('Picture', pictureSchema);