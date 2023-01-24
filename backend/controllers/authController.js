const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');

const authController = {
  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log([email, password]);
      if (!email || !password)
        return new Error('No username or password provided.');
      const newUser = await User.create({ email, password });
      console.log(newUser);
      const { gallery, _id } = newUser;
      res.locals.user = { email, id: _id, gallery };
      return next();
    } catch (e) {
      return next({
        log: 'Middleware error caught in authController - signUp failed',
        status: 500,
        message: { err: e.message },
      });
    }
  },

  verifyUser(req, res, next) {
    const { email, password } = req.body;
    let hashedPassword;
    try {
      if (!email || !password)
        throw new Error('No email or password provided.');
      User.findOne({ email }, (err, userAccount) => {
        if (!userAccount) {
          return next({
            log: `Middleware error caught in authController - login failed: user not found!`,
            status: 500,
          });
        }
        hashedPassword = userAccount.password;
        bcrypt.compare(password, hashedPassword, function (err, result) {
          // result == true
          if (!result) {
            return next({
              log: `Middleware error caught in authController - incorrect password!`,
              status: 500,
            });
          }
          //after verification, pass user information to the next middleware
          const user = {
            email: userAccount.email,
            id: userAccount._id,
            gallery: userAccount.gallery,
          };
          res.locals.user = user;
          console.log('user from authControl', user);
          return next();
        });
      });
    } catch (err) {
      console.log('user not found');
      return next({
        log: `Error verifying user: ${err}`,
        status: 500,
      });
    }
  },
};

module.exports = authController;
