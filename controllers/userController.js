const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

//Added pagination logic to the getAllUsers controller
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Set default values for page and limit
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;

  // Calculate the skip based on the page and pageSize
  const skip = (page - 1) * pageSize;

  try {
    // Find all users with pagination
    const users = await User.find().skip(skip).limit(pageSize);

    // Calculate the total number of users
    const totalUsers = await User.countDocuments();

    // Send response with pagination information
    res.status(200).json({
      status: 'Success',
      data: {
        results: users.length,
        users,
        page,
        pageSize,
        totalUsers,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};
