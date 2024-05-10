const mongoose = require('mongoose');

// Middleware to check if the provided ID is a valid MongoDB object ID
exports.checkID = (req, res, next) => {
  const id = req.params.id;

  // Check if the ID is a valid MongoDB object ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid object ID',
    });
  }

  next();
};

