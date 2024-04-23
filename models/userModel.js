const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please add a password!"],
      minLength: [6, "Password must be up to 6 characters"],
    },

    phone: {
      type: Number,
    },

  location: {
    type: String,
    default: ""
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

module.exports = User
