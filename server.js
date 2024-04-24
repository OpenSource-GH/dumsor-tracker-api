const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.error('DB Connection Error:', err));

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_PUBLIC_KEY');

const port = process.env.PORT || 6000;
const server = app.listen(port, () => {
  console.log(`Dumsor-Tracker Backend running on port ${port}....`);
});
