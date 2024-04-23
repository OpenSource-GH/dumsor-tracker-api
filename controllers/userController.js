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

let generatedOTP;
// Function to generate OTP and send message
const generateAndSendOTP = async (phoneNumber) => {
  // Generate OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000); // To generate a 6-digit random number
  // Send OTP to the provided phone number
  await twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
    body: `Your OTP verification for Dumsor Tracker is ${generatedOTP}!`,
  });

  return generatedOTP;
};

// To set the user token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// For user to create an account with email and password
exports.signupWithEmailPassword = async (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  try {
    if (!email || !password || !passwordConfirm) {
      res.status(400);
      throw new Error('Please fill in all the required fields!');
    }

    // To check if email has already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email has already been registered!');
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error('Password must be up to 8 characters');
    }

    if (password !== passwordConfirm) {
      return res.status(400).json('Passwords do not match!');
    }

    // To hash the user password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // To create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      passwordConfirm: hashedPassword,
    });
    // To generate a token
    const token = generateToken(newUser._id);

    if (newUser) {
      const { _id, email } = newUser;
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
      });

      // To send the user data
      res.status(201).json({ _id, email });
    } else {
      res.status(400).json({
        message: 'Invalid user data!',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

// For user to create an account with phone number and OTP
exports.signupWithPhoneNumberOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Validate input fields
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ error: 'Please fill in all the required fields!' });
    }

    // To check if phone number is already registered
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Phone number has already been registered!' });
    }
    //  To generate OTP
    generatedOTP = await generateAndSendOTP(phoneNumber);
    // console.log(generatedOTP);
    res.status(201).json({ message: 'Please verify OTP' });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error signing up with phone number/OTP',
    });
    // console.log(error);
  }
};

// OTP Verification Controller
exports.verifyOTPAndSignup = async (req, res) => {
  try {
    // console.log(req.body);
    const { phoneNumber, otp } = req.body;

    // To check if the provided OTP matches the generated OTP
    if (otp !== generatedOTP) {
      return res.status(400).json({ message: 'Incorrect OTP!' });
    }
    // console.log(generatedOTP);

    // To save phoneNumber and OTP in the user document
    const newUser = await User.create({ phoneNumber, otp: generatedOTP });

    const token = generateToken(newUser._id);
    if (newUser) {
      const { _id, phoneNumber } = newUser;
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
      });

      // To send the user data
      res.status(201).json({
        _id,
        phoneNumber,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Login with Email and Password
exports.loginWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;

  // To Validate user
  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password!');
  }

  // To check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User does not exist!');
  }

  // To compare password
  const correctPassword = await bcrypt.compare(password, user.password);

  // To generate token
  const token = generateToken(user._id);
  if (user && correctPassword) {
    const newUser = await User.findOne({ email }).select('-password');
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
    });
    // To send the user data
    res.status(201).json(newUser);
  } else {
    res.status(400);
    throw new Error('Invalid email or password!');
  }
};

// Login with Phone Number and OTP
exports.loginWithPhoneAndOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // To validate input fields!
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Please provide phone number!' });
    }

    // To check if the user exist
    const existingUser = await User.findOne({ phoneNumber });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found, please sign up!' });
    }

    //  To generate OTP for login
    generatedOTP = await generateAndSendOTP(phoneNumber);
    console.log('Login OTP:', generatedOTP);

    res.status(200).json({ message: 'OTP has been sent for login!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// OTP Verification Controller
exports.verifyOTPAndLogin = async (req, res) => {
  try {
    // console.log(req.body);
    const { phoneNumber, otp } = req.body;

    // To check if the provided OTP matches the generated OTP
    if (otp !== generatedOTP) {
      return res.status(400).json({ message: 'Incorrect OTP!' });
    }
    console.log('Login OTP:', generatedOTP);

    // To save phoneNumber and OTP in the user document
    const user = await User.findOne({ phoneNumber });

    const token = generateToken(user._id);
    if (user) {
      const { _id, phoneNumber } = user;
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
      });

      // To send the user data
      res.status(201).json({
        _id,
        phoneNumber,
      });
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
