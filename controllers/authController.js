
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");


exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phoneNumber: req.body.phoneNumber,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    data: {
      token,
      user: newUser,
    },
  });
});

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password do exist
  if (!email || !password) {
    res.status(404).json({
      status: "fail",
      message: "Provide email and password",
    });
  } else {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "User does not exist",
          });
        }
        //send token to client if everything is on point
        const token = "";
        res.status(201).json({
          status: "success",
          token,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          status: "fail",
          message: "An error occured whiles loggin in",
        });
      });
=======
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

// Login user with Supabase
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

