const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// For OTP Verification
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// This is a global variable for OTP generation
let generatedOTP;

// To set the user token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// For user to create an account with email and password
exports.signupWithEmailPassword = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all the required fields!');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be up to 6 characters');
    }

    // To if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email has already been registered!');
    }

    // To hash the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // To create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // To generate a token
    const token = generateToken(newUser._id);

    if (newUser) {
      const { _id, username, email } = newUser;
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
      });

      // To send the user data
      res.status(201).json({ _id, username, email });
    } else {
      res.status(400).json({
        message: 'Invalid user data!',
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  }
};

// For user to create an account with phone number and OTP
exports.signupWithPhoneNumberOTP = async (req, res) => {
  const { username, phone } = req.body;

  try {
    // Validate input fields
    if (!username || !phone) {
      return res
        .status(400)
        .json({ error: 'Please fill in all the required fields!' });
    }

    // To check if phone number is already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Phone number has already been registered!' });
    }
    //  For OTP Validation
    generatedOTP = Math.floor(100000 + Math.random() * 900000); // To generate a 6-digit random number

    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      body: `Your OTP verification for user ${username} is ${generatedOTP}`,
    });

    res.status(200).json({ message: 'OTP message sent!' });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error signing up with phone number/OTP',
    });
    // console.log(error);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    // console.log(req.body);
    const { authOTP } = req.body;

    if (authOTP != generatedOTP) {
      return res.status(400).json({ message: 'Incorrect OTP!' });
    }

    // If OTP is successfully verified, proceed to create the user account
    const { username, phone, password } = req.body;
    // Create new user
    const newUser = await User.create({ username, phone });
    const token = generateToken(newUser._id);

    if (newUser) {
      const { _id, username, phone, password } = newUser;
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
      });

      // To send the user data
      res.status(201).json({ _id, username, phone, password });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};


exports.getAllUsers = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};
