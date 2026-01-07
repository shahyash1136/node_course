const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', signup);
usersRouter.post('/login', login);

usersRouter.post('/forgotPassword', forgotPassword);
usersRouter.patch('/resetPassword/:token', resetPassword);

usersRouter.route('/').get(getAllUsers).post(createUser);

usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = usersRouter;
