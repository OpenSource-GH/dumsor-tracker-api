const Log = require('../models/logModel');
const redisClient = require('./redisClient');
const catchAsync = require('./../utils/catchAsync');

const CACHE_TTL=3600

exports.getAllLogs = catchAsync(async (req, res, next) => {
  const redis = redisClient.getClient();
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;

  const skip = (page - 1) * pageSize;

  try {
    let query = {};
    if (req.query.location) {
      const locationRegex = new RegExp(req.query.location, 'i');
      query = { location: { $regex: locationRegex } };
    }
    const logs = await Log.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalLogs = await Log.countDocuments(query);
    res.status(200).json({
      status: 'Success',
      data: {
        results: logs.length,
        logs,
        page,
        pageSize,
        totalLogs,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
});

exports.getLog = catchAsync(async (req, res, next) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({
        status: 'fail',
        message: 'Log not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        log,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

exports.createLog = catchAsync(async (req, res, next) => {
  try {
    const { location, date, timeOff, timeBackOn, userId } = req.body;
    const newLog = await Log.create({
      location,
      date,
      timeOff,
      timeBackOn,
      userId,
    });
    res.status(201).json({
      status: 'success',
      data: {
        log: newLog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
});


exports.updateLog = catchAsync(async (req, res, next) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!log) {
      return res.status(404).json({
        status: 'fail',
        message: 'log not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        log,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

exports.deleteLog = catchAsync(async (req, res, next) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({
        status: 'fail',
        message: 'Log not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});
