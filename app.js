const express = require('express');
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoutes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

dotenv.config();

app.use('/api/v1/users', userRouter);

app.get('/test', (req, res) => {
  res.send('API TESTING!!!');
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

module.exports = app;
