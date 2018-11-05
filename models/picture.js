const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for pictures
const pictureSchema = new Schema({
 
  url: {
    type: String,
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
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