require('dotenv').config();
const connect = require('../utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Review = require('../models/Review');
const Reviewer = require('../models/Reviewer');
const Studio = require('../models/Studio');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return seed();
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;
  
  return {
    [`get${modelName}`]: () => Model.findOne(),
    [`get${modelName}s`]: () => Model.find()
  };
};

module.exports = {
  ...createGetters(Actor),
  ...createGetters(Film),
  ...createGetters(Review),
  ...createGetters(Reviewer),
  ...createGetters(Studio)
};
