const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  pseudo: String,
  surname: String,
  name: String,
  profilepic: String
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);