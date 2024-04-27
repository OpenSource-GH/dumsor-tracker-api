const mongoose = require('mongoose');

//moved checkObject id logic to a middleware instead of being in a controller
exports.checkID = (req, res, next) => {
  const id = req.params.id;

  if (id * 1 > logs.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid object ID',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid object Id',
    });
  }

  next();
};
