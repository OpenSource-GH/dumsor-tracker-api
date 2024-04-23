const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// To set the user token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.createUser = async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please fill in all the required fields!');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be up to 6 characters');
  }

  // To check for existing user by email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email has already been registered!');
  }

  // To create a new user
  const newUser = await User.create({ username, email, password, phone });
  // To generate a token
  const token = generateToken(newUser._id);

  if (newUser) {
    const { _id, username, email, phone } = newUser;
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
    });

    // To send the user data
    res.status(201).json({ _id, username, email, phone });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Invalid user data!',
    });
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
