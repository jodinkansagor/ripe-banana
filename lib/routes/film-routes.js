const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res) => {
    Film
      .create(req.body)
      .then(film => res.send(film));
  })

  .get('/', (req, res) => {
    Film
      .find()
      .select({ title: true, released: true, studio: true })
      .populate('studio', 'name')
      .then(films => res.send(films));
  });

