const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, 
    )
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.error('DB Connection Error:', err));

const port =  6000;

app.listen(port, () => {
  console.log(`Dumsor-Tracker running on port ${port}.... `);
});
