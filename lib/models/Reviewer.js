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

schema.statics.areThereAnyReviews = async function(id) {
  const reviews = await this.model('Review')
    .find({ reviewer: id });
  if (reviews.length === 0) {
    this.findByIdAndDelete(id);
  } else {
    const err = new Error('you done messed up');
    err.status = 409;
    return err;
  }

};

module.exports = mongoose.model('Reviewer', schema);
