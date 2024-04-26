const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const logSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: [true, 'A Log must have an id'],
    unique: true,
  },
  location: {
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
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
