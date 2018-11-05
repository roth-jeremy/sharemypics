const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for users
const Schema = mongoose.Schema;

// Define the schema for users
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // Manually validate uniqueness
      validator: validateUserUsernameUniqueness,
      message: 'Username {VALUE} already exists',
      isAsync: true
    }
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  surname: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: Schema.Types.ObjectId,
    ref: 'Picture'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Automatically hash password with bcrypt before saving into database
 */
userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

/**
 * Given a name, calls the callback function with true if no user exists with that name
 * (or the only user that exists is the same as the user being validated).
 */
function validateUserUsernameUniqueness(value, callback) {
  const user = this;
  this.constructor.findOne().where('name').equals(value).exec(function (err, existingUser) {
    callback(!err && (!existingUser || existingUser._id.equals(user._id)));
  });
}

// Export the newly created model
module.exports = mongoose.model('User', userSchema);