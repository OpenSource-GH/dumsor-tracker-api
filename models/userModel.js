const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: [true, 'A user must have an id'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid or unique email'],
  },
  password: {
    type: String,
    required: [true, 'Provide your password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      //Only works on CREATE and SAVE
      validator: function(el) {
      return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
