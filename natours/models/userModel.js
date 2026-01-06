const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    require: [true, 'Please confrim your password'],
    validate: {
      // This only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
