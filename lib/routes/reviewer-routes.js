const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()

  .post('/', (req, res) => {
    Reviewer
      .create(req.body)
      .then(reviewer => res.send(reviewer));
  });
