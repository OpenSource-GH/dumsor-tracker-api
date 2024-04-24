const express = require('express');
const userController = require('./../controllers/userController');
const {
  validateObjectId,
} = require('../middlewares/validateObjectIdMiddleware.js');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(validateObjectId, userController.getUser)
  .patch(validateObjectId, userController.updateUser)
  .delete(validateObjectId, userController.deleteUser);

module.exports = userRouter;
