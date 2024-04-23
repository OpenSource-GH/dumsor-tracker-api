const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');
const {PhoneNumberUtil } = require('libphonenumber-js');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
    default: ''
  },
  password: {
    type: String,
    required: true
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

module.exports = mongoose.model('User', userSchema);
