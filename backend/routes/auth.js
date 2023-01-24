const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');

//POST when user tries to log in
//hash password before it's saved to database
router.post(
  '/login',
  authController.verifyUser,
  sessionController.startSession,
  (req, res) => {
    res.status(200).json(res.locals.user);
  }
);
//POST to logout
router.post('/logout', (req, res) => {
  res.json('hit');
  res.clearCookie('SSID');
});

// '/signup' Endpoint
router.post(
  '/signup',
  authController.signUp,
  sessionController.startSession,
  (req, res) => res.status(200).json(res.locals.user)
);

router.get('/user', sessionController.isLoggedIn, (req, res) => {
  const { email, username, avatar, name, _id } = res.locals.user;
  res.status(200).json({ email, username, avatar, name, userId: _id });
});

module.exports = router;
