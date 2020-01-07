const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()

  .post('/', (req, res) => {
    Review
      .create(req.body)
      .then(review => res.send(review));
  })

  .get('/', (req, res) => {
    const { n = 2 } = req.query;
    Review
      .find()
      .limit(n)
      .sort({ rating: -1 })
      .populate('film', 'title')
      .then(reviews => res.send(reviews));

  })

  .delete('/:id', (req, res) => {
    Review
      .findByIdAndDelete(req.params.id)
      .then(review => res.send(review));
  });
