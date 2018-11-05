const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for pictures
const pictureSchema = new Schema({
 
  url: {
    type: String,
    required: true,
  },
  
});

// Create the model from the schema and export it
module.exports = mongoose.model('Picture', pictureSchema);