const express = require('express');
const filePath =
  './dev-data/logs-simple.json';
const { protect } = require('../middlewares/authMiddleware.js');

const { checkID } = require('../middlewares/checkObjectIdMiddlware.js');

const logController = require('./../controllers/logController');
const logRouter = express.Router();

logRouter.param('id', checkID);

logRouter.route('/').get(logController.getAllLogs).post(
  //logController.checkBody,
  logController.createLog
);

logRouter
  .route('/:id')
  .get(logController.getLog)
  .patch(logController.updateLog)
  .delete(logController.deleteLog);

module.exports = logRouter;
