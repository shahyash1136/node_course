const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', signup);
usersRouter.post('/login', login);

usersRouter.post('/forgotPassword', forgotPassword);
usersRouter.patch('/resetPassword/:token', resetPassword);
usersRouter.patch('/updateMyPassword', protect, updatePassword);

usersRouter.patch('/updateMe', protect, updateMe);

usersRouter.route('/').get(getAllUsers).post(createUser);

usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = usersRouter;
