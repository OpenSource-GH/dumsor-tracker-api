const mongoose = require('mongoose');

exports.validateObjectId = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid object Id',
    });
  }

  next();
};
