const express = require('express');
const userRouter = require('./routes/userRoutes.js');
const app = express();


app.use('/api/v1/users', userRouter);

module.exports = app;
