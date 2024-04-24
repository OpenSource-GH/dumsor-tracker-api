const express = require('express');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const logRouter = require('./routes/logRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_PUBLIC_KEY');

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
