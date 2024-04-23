const express = require('express');
const userController = require('./../controllers/userController');

const userRouter = express.Router();

userRouter.get('/get-all-users', userController.getAllUsers);

userRouter.post('/register/email', userController.signupWithEmailPassword);
userRouter.post('/login/email', userController.loginWithEmailAndPassword);

userRouter.post('/register/phone', userController.signupWithPhoneNumberOTP);
userRouter.post('/register/phone/verify', userController.verifyOTPAndSignup);
userRouter.post('/login/phone', userController.loginWithPhoneAndOTP);
userRouter.post('/login/phone/verify', userController.verifyOTPAndLogin);



userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
