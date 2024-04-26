const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: './config.env' });

const database_url = ''

const DB = process.env.database_url;
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
