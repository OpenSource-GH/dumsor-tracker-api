const express = require('express');
const filePath =
  '/Users/mac/Desktop/BE/dumsor-tracker-api/dev-data/logs-simple.json';
const { protect } = require('../middlewares/authMiddleware.js');
const {
  validateObjectId,
} = require('../middlewares/validateObjectIdMiddleware.js');

const logController = require('./../controllers/logController');
const logRouter = express.Router();

logRouter.param('id', logController.checkID);

logRouter.route('/').get(protect, logController.getAllLogs).post(
  //logController.checkBody,
  logController.createLog
);

logRouter
  .route('/:id')
  .get(validateObjectId, logController.getLog)
  .patch(validateObjectId, logController.updateLog)
  .delete(validateObjectId, logController.deleteLog);

module.exports = logRouter;
