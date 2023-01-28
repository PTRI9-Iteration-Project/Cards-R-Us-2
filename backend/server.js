const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { DB_URI } = process.env;
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/UserModel');
const Session = require('./models/sessionsModel');

const PORT = 3000;
const app = express();

// api router
const apiRouter = require('./routes/api.js');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/', express.static(path.resolve('./dist')));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, {
//       id: user.id,
//       username: user.username,
//       picture: user.picture,
//     });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

mongoose.set('strictQuery', false);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to DB ✅');
    app.listen(PORT, console.log(`Listening at http://localhost:${PORT}/ ✅`));
  })
  .catch(console.error);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:8080/api/oauth/google/cards',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(`accessToken: ${JSON.stringify(accessToken)}`);
      console.log(`profile: ${JSON.stringify(profile)}`);

      User.findOrCreate(
        {
          email: profile.emails[0].value,
          name: profile.displayName,
        },
        function (err, user) {
          console.log(`user: ${user}`);

          Session.findOrCreate(
            {
              userId: user._id,
            },
            function (err, session) {
              console.log(`session: ${session}`);
              return cb(err, session);
            }
          );

          return cb(err, user);
        }
      );
    }
  )
);

// Main page
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve('./dist/index.html'));
});

// All api routes
app.use('/api', apiRouter);

// 404 redirect to index.html for react router
app.use((req, res) =>
  res.status(200).sendFile(path.resolve('./dist/index.html'))
);

// Express error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
