const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .post('/', (req, res) => {
    Studio  
      .create(req.body)
      .then(studio => res.send(studio));
  });

