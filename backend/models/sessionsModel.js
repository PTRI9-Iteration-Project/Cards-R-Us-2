const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const sessionSchema = new Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, expires: '30m', default: Date.now },
});

sessionSchema.plugin(findOrCreate);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
