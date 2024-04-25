const express = require('express');
const filePath =
  '/Users/mac/Desktop/BE/dumsor-tracker-api/dev-data/logs-simple.json';
const { protect } = require('../middlewares/authMiddleware.js');

const { checkID } = require('../middlewares/checkObjectIdMiddlware.js');

const logController = require('./../controllers/logController');
const logRouter = express.Router();

logRouter.param('id', checkID);

logRouter.route('/').get(protect, logController.getAllLogs).post(
  //logController.checkBody,
  logController.createLog
);

logRouter
  .route('/:id')
  .get(logController.getLog)
  .patch(logController.updateLog)
  .delete(logController.deleteLog);

module.exports = logRouter;
