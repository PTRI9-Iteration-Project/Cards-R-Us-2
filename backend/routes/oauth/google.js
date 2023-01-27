const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionController = require('../../controllers/sessionController');
const oauth = require('../../controllers/oauth/oauthController');

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile'] }),
  oauth.middleware.getUser,
  sessionController.startSession
);

router.get(
  '/cards',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/cards/');
  }
);

module.exports = router;
