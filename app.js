const express = require('express');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const logRouter = require('./routes/logRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

module.exports.supabase = createClient(supabaseUrl, supabaseAnonKey);

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/logs', logRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
