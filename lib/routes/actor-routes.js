const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router() 
  .post('/', (req, res) => {
    Actor
      .create(req.body)
      .then(actor => res.send(actor));
  })

  .get('/', (req, res) => {
    Actor 
      .find()
      .select({ _id: true, name: true })
      .then(actors => res.send(actors));
  })

  .get('/:id', (req, res) => {
    Actor
      .findById(req.params.id)
      .then(actor => res.send(actor));
  });