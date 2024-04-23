const mongoose = require('mongoose');
const { Number } = require('twilio/lib/twiml/VoiceResponse');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    // required: ['Provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid or unique email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email',
    ],
  },

  password: {
    type: String,
    minLength: [8, 'Password must be up to 8 characters'],
    type: String,
    // required: [true, 'Provide your password'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    // required: true,
    select: false,
    validate: {
      // Only works on CREATE and SAVE
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match! Please try again.',
    },
  },

  phoneNumber: {
    type: String,
    minlength: 10,
    validate: {
      validator: function (value) {
        try {
          const phoneUtil = PhoneNumberUtil.getInstance();
          const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'GH');
          return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid phone number format',
    },
  },

  otp: {
    type: Number,
    default: null,
  },

  otpExpiresAt: {
    type: Date,
    select: false,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
});

// To Encrypt password before saving to the Database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  } else {
    // To Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User
