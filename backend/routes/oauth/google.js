const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionController = require('../../controllers/sessionController');
const oauth = require('../../controllers/oauth/oauthController');

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/cards',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.cookie('SSID', '63d48492dd3409f79880af5f', {
      maxAge: 1800000, // 30 mins
      httpOnly: true,
    });

    // Successful authentication, redirect cards
    res.redirect('/cards/');
  }
);

module.exports = router;
