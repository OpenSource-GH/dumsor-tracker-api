const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
// const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.error('DB Connection Error:', err));

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log('Dumsor-Tracker running on port ${port}.... ');
});
