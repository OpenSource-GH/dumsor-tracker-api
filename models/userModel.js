const mongoose = require('mongoose');
const validator = require('validator');
const { PhoneNumberUtil } = require('libphonenumber-js');

const userSchema = new mongoose.Schema({
  // _id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   auto: true,
  //   required: [true, 'A user must have an id'],
  //   unique: true,
  // },
  name: {
    type: String,
    required: [true, 'Make your name  known'],
    trim: true,
  },
  email: {
    type: String,
    required: ['Provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid or unique email'],
  },
  password: {
    type: String,
    required: [true, 'Provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      // Only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
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
    type: String,
    select: false,
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

// Middleware function to hash the user's password before saving
// Runs before the 'save' operation on the user schema
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Method to convert user object to JSON format
// Removes the password field from the user object before sending to client
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
