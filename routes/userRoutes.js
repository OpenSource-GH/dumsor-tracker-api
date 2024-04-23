const express = require('express');
const userController = require('./../controllers/userController');

const userRouter = express.Router();

userRouter.get('/get-all-users', userController.getAllUsers);
userRouter.post('/register', userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
