const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true
  }
});

schema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'reviewer'
});

module.exports = mongoose.model('Reviewer', schema);
