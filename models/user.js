const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // Manually validate uniqueness to send a "pretty" validation error
      // rather than a MongoDB duplicate key error
      validator: validateUserUsernameUniqueness,
      message: 'Username {VALUE} already exists',
      isAsync: true
    }
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  }  
});

/**
 * Given a username, calls the callback function with true if no user exists with that username
 * (or the only user that exists is the same as the user being validated).
 */
function validateUserUsernameUniqueness(value, callback) {
  const user = this;
  this.constructor.findOne().where('username').equals(value).exec(function(err, existingUser) {
    callback(!err && (!existingUser || existingUser._id.equals(user._id)));
  });
}
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);