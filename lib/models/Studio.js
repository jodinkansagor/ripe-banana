const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: String,
    state: String,
    country: String
  }
});

schema.virtual('film', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'studioId'
});

module.exports = mongoose.model('Studio', schema);
