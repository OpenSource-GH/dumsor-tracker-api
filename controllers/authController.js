//const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
//const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase'); 


exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return next(new AppError(error.message, 400));
    }
    // Generate JWT token for user (optional)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    return next(new AppError('Failed to sign up user', 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      return next(new AppError(error.message, 401));
    }
    // Generate JWT token for user (optional)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: 'success',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    return next(new AppError('Failed to log in user', 500));
  }
};

