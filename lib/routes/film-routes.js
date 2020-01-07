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
  })

  .get('/:id', (req, res) => {
    Film
      .findById(req.params.id)
      .populate('studio', 'name')
      .populate('cast.actor', 'name')
      .populate({
        path: 'reviews',
        select: 'rating review reviewer film',
        populate: {
          path: 'film',
          select: 'title'
        }
      })
      .then(film => res.send(film));
  });


