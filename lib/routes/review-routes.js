const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()

  .post('/', (req, res) => {
    Review
      .create(req.body)
      .then(review => res.send(review));
  })

  .get('/', (req, res) => {
    Review
      .find()
      .limit(2)
      .sort({ rating: -1 })
      .then(reviews => res.send(reviews));

  })