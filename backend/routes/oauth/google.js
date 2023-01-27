const express = require('express');
const router = express.Router();
const sessionController = require('../../controllers/sessionController');
const oauth = require('../../controllers/oauth/oauthController');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const googleClientId = process.env.GOOGLE_ID;
const googleSecret = process.env.GOOGLE_SECRET;

app.get('/', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/cards',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;
