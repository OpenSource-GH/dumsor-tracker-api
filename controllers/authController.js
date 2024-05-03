const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv');

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    return next(new AppError('Failed to sign up user', 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return next(new AppError(error.message, 401));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        session,
      },
    });
  } catch (err) {
    console.log(err)
    return next(new AppError('Failed to log in user', 500));
  }
};

exports.googleLogin = async (req, res, next) => {
  const { google } = req.body;
  try {
    const { user, session, error } = await supabase.auth.signIn({
      google
    });
    if (error) {
      return next(new AppError(error.message, 401));
    }
    res.status(200).json({
      status: 'success',
      data: {
        session,
        user,
      },
    });
  } catch (err) {
    return next(new AppError('Failed to log in user', 500));
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return next(new AppError(error.message, 500));
    }
    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
    });
  } catch (err) {
    return next(new AppError('Failed to log out user', 500));
  }
};

