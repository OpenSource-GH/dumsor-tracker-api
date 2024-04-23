const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');
const { PhoneNumberUtil } = require('libphonenumber-js');

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
    default: ''
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
      // Only works on CREATE and SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    validate: {
      validator: function(value) {
        try {
          const phoneUtil = PhoneNumberUtil.getInstance();
          const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'GH');
          return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
          return false; 
        }
      },
      message: 'Invalid phone number format'
    }
  },
  outages: [{
    date: {
      type: Date,
      required: true
    },
    timeOff: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return moment(v, 'YYYY-MM-DD HH:mm:ss').isAfter(moment().subtract(1, 'minute'));
        },
        message: 'Power outage time off must be in the future'
      }
    },
    timeBackOn: {
      type: String,
      required: true,
      validate: {
        validator: function(v, outage) {
          const timeOff = moment(outage.timeOff, 'YYYY-MM-DD HH:mm:ss');
          return moment(v, 'YYYY-MM-DD HH:mm:ss').isAfter(timeOff);
        },
        message: 'Power back on time must be after power off time'
      }
    }
  }]
}); 

userSchema.pre('save', function (next) {
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
