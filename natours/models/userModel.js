const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please enter your name'],
    trim: true,
    // validator: [validator.isAlpha, 'User name must only contain characters'],
  },
  email: {
    type: String,
    require: [true, 'Please enter your email'],
    trim: true,
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    require: [true, 'Please enter password'],
    //validator: [validator.isStrongPassword, 'Password should be 8 char long'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    require: [true, 'Please confrim your password'],
    //validator: [validator.isStrongPassword, 'Password should be 8 char long'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
