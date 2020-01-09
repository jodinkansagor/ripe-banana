const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()

  .post('/', (req, res, next) => {
    Review
      .create(req.body)
      .then(review => res.send(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    const { n = 100 } = req.query;
    Review
      .find()
      .limit(n)
      .sort({ rating: -1 })
      .populate('film', 'title')
      .then(reviews => res.send(reviews))
      .catch(next);

  })

  .delete('/:id', (req, res, next) => {
    Review
      .findByIdAndDelete(req.params.id)
      .then(review => res.send(review))
      .catch(next);
  });
