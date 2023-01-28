const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: false,
    default: null,
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  // username: {
  //   type: String,
  //   require: true,
  //   unique: true,
  // },
  avatar: {
    type: String,
    required: false,
    default: '',
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  gallery: {
    type: Array(String),
    required: false,
    default: [],
  },
});

userSchema.plugin(findOrCreate);

// // use it for hashing password before saving to database
userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, SALT_WORK_FACTOR, (err, hash) => {
    // Store hash in your password DB.
    this.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
