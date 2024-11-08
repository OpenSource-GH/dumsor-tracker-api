const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  timeOff: {
    type: String,
    required: true,
  },
  timeBackOn: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
