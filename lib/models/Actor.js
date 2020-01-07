const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: Date,
  pob: String
}, {
  toJSON: {
    virtuals: true
  }
}
);

schema.virtual('film', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'actorId'
});

module.exports = mongoose.model('Actor', schema);
